import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/features/shared/model/user";
import ReferralConversion from "@/features/shared/model/referral-conversion";
import ReferralReward from "@/features/shared/model/referral-reward";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Aggregates for profile
    const salesAgg = await ReferralConversion.aggregate([
      { $match: { referrer_id: user._id, conversion_stage: "purchased" } },
      { $group: { _id: null, totalSale: { $sum: "$purchase_details.net_amount" } } }
    ]);

    const purchasesAgg = await ReferralConversion.aggregate([
      { $match: { prospect_id: user._id, conversion_stage: "purchased" } },
      { $group: { _id: null, totalPurchase: { $sum: "$purchase_details.net_amount" } } }
    ]);

    const reward = await ReferralReward.findOne({ customer_id: user._id }).lean();

    const claimedCash = reward?.redemptions
      ?.filter((r: any) => r.type === 'cash_claim' && r.status === 'completed')
      .reduce((sum: number, r: any) => sum + r.amount, 0) || 0;

    const pendingCashClaimed = reward?.redemptions
      ?.filter((r: any) => r.type === 'cash_claim' && r.status === 'pending')
      .reduce((sum: number, r: any) => sum + r.amount, 0) || 0;

    const availableBalance = Math.max(0, (reward?.cash_earned || 0) - claimedCash - pendingCashClaimed);

    const profileData = {
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      },
      stats: {
        sale: salesAgg[0]?.totalSale || 0,
        purchase: purchasesAgg[0]?.totalPurchase || 0,
        commission: reward?.total_earned || 0,
        cashEarned: reward?.cash_earned || 0,
        pendingCash: pendingCashClaimed,
        availableBalance,
      },
      redemptions: reward?.redemptions || []
    };

    return NextResponse.json(profileData);
  } catch (error: unknown) {
    console.error("Fetch Customer Profile Error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const { firstName, lastName, phone } = await req.json();

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    return NextResponse.json({ success: true, message: "Profile updated successfully." });
  } catch (error: unknown) {
    console.error("Update Customer Profile Error:", error);
    const message = error instanceof Error ? error.message : "Failed to update profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
