import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Invoice from "@/features/shared/model/invoice";
import Client from "@/features/shared/model/client";
import User from "@/features/shared/model/user";
import ReferralSetting from "@/features/shared/model/referral-setting";
import ReferralReward from "@/features/shared/model/referral-reward";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Invoice ID is required." }, { status: 400 });
    }

    await connectDB();

    const invoice = await Invoice.findById(id)
      .populate("client_id", "name email mobile source notes referralCode")
      .populate("referrer_id", "firstName lastName email role referralCode");

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      invoice
    });
  } catch (error) {
    console.error("Fetch Invoice Details Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve invoice details." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Invoice ID is required." }, { status: 400 });
    }

    const body = await req.json();
    const { status } = body;

    if (!status || !["pending", "paid", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid or missing invoice status." }, { status: 400 });
    }

    await connectDB();

    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
    }

    const oldStatus = invoice.status;
    invoice.status = status;

    if (status === "paid" || status === "pending") {
      const client = await Client.findById(invoice.client_id);
      if (client && client.status !== "active") {
        client.status = "active";
        await client.save();
      }
    }

    // Apply commission logic only if it goes from non-paid -> paid AND has not been calculated yet
    if (status === "paid" && oldStatus !== "paid" && !invoice.commission_calculated) {
      const client = await Client.findById(invoice.client_id);
      const referrerId = client?.referredBy?.referrerId || null;

      if (referrerId) {
        invoice.commission_calculated = true;
        let settings = await ReferralSetting.findOne();
        if (!settings) {
          settings = await ReferralSetting.create({});
        }

        let commission_amount = 0;
        const rewardType = settings.default_reward_type || "percentage";
        if (rewardType === "percentage") {
          const percentage = settings.commission_percentage || 10;
          commission_amount = invoice.amount * (percentage / 100);
        } else {
          if (invoice.amount >= settings.min_purchase_for_reward) {
            commission_amount = settings.cash_reward_high;
          } else {
            commission_amount = settings.cash_reward_low;
          }
        }

        invoice.commission_amount = commission_amount;
        invoice.referrer_id = referrerId;

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
    }

    await invoice.save();

    return NextResponse.json({
      success: true,
      message: "Invoice status updated successfully.",
      invoice
    });
  } catch (error) {
    console.error("Update Invoice Status Error:", error);
    const message = error instanceof Error ? error.message : "An error occurred while updating the invoice.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
