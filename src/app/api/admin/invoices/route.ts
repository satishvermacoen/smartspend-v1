import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Client from "@/features/shared/model/client";
import Invoice from "@/features/shared/model/invoice";
import User from "@/features/shared/model/user";
import ReferralSetting from "@/features/shared/model/referral-setting";
import ReferralReward from "@/features/shared/model/referral-reward";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");
    const search = searchParams.get("search") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10));
    const skip = (page - 1) * limit;

    await connectDB();

    const query: Record<string, any> = {};

    if (clientId) {
      query.client_id = clientId;
    }

    if (search) {
      query.invoice_number = new RegExp(search.trim(), "i");
    }

    const invoices = await Invoice.find(query)
      .populate("client_id", "name email mobile source")
      .populate("referrer_id", "firstName lastName email role")
      .sort({ purchase_date: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Invoice.countDocuments(query);

    return NextResponse.json({
      success: true,
      invoices,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Fetch Invoices Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve invoices list." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const body = await req.json();
    const { client_id, items, discount_applied, tax_amount, status, purchase_date } = body;

    if (!client_id || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Client ID and at least one item are required." }, { status: 400 });
    }

    // Calculate total amount from items
    let calculatedAmount = items.reduce((sum: number, item: any) => {
      const amt = Number(item.amount) || 0;
      const qty = Number(item.quantity) || 1;
      return sum + (amt * qty);
    }, 0);

    // Apply discount and add tax
    const discount = Number(discount_applied) || 0;
    const tax = Number(tax_amount) || 0;
    const finalAmount = Math.max(0, calculatedAmount - discount + tax);

    await connectDB();

    const client = await Client.findById(client_id);
    if (!client) {
      return NextResponse.json({ error: "Client not found." }, { status: 404 });
    }

    const invoiceStatus = status || "paid";

    // 1. Referral Commission Logic (only if invoice status is paid)
    const referrerId = client.referredBy?.referrerId || null;
    let commission_amount = 0;
    let commission_calculated = false;

    if (referrerId && invoiceStatus === "paid") {
      commission_calculated = true;
      let settings = await ReferralSetting.findOne();
      if (!settings) {
        settings = await ReferralSetting.create({});
      }

      const rewardType = settings.default_reward_type || "percentage";
      if (rewardType === "percentage") {
        const percentage = settings.commission_percentage || 10;
        commission_amount = finalAmount * (percentage / 100);
      } else {
        if (finalAmount >= settings.min_purchase_for_reward) {
          commission_amount = settings.cash_reward_high;
        } else {
          commission_amount = settings.cash_reward_low;
        }
      }

      if (commission_amount > 0) {
        let rewardRecord = await ReferralReward.findOne({ customer_id: referrerId });
        if (!rewardRecord) {
          rewardRecord = await ReferralReward.create({
            customer_id: referrerId,
            total_earned: 0,
            cash_earned: 0,
            subscription_months: 0,
            pending_cash: 0
          });
        }

        if (settings.auto_credit_cash) {
          rewardRecord.total_earned += commission_amount;
          rewardRecord.cash_earned += commission_amount;
          await User.findByIdAndUpdate(referrerId, { $inc: { accountBalance: commission_amount } });
        } else {
          rewardRecord.pending_cash += commission_amount;
        }
        await rewardRecord.save();
      }
    }

    // 2. Generate Sequential Invoice Number (INV-YYYY-MM-DD-XXXX)
    const today = purchase_date ? new Date(purchase_date) : new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const datePrefix = `INV-${year}-${month}-${day}-`;

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const count = await Invoice.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });
    const invoice_number = `${datePrefix}${String(count + 1).padStart(4, "0")}`;

    // 3. Create the Invoice
    const newInvoice = await Invoice.create({
      client_id,
      invoice_number,
      items: items.map(item => ({
        service_name: item.service_name,
        amount: Number(item.amount),
        quantity: Number(item.quantity) || 1
      })),
      amount: finalAmount,
      discount_applied: discount,
      tax_amount: tax,
      purchase_date: today,
      status: invoiceStatus,
      referrer_id: referrerId || undefined,
      commission_amount,
      commission_calculated
    });

    return NextResponse.json({
      success: true,
      message: "Invoice created successfully.",
      invoice: newInvoice
    });

  } catch (error: any) {
    console.error("Create Invoice Error:", error);
    return NextResponse.json(
      { error: error?.message || "An error occurred while creating the invoice." },
      { status: 500 }
    );
  }
}
