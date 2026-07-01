import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import ReferralReward, { IRedemption } from "@/features/shared/model/referral-reward";
import User from "@/features/shared/model/user";
import { sendWithdrawalStatusEmail } from "@/lib/mail";

interface PopulatedPartner {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface PopulatedReward {
  _id: unknown;
  customer_id?: PopulatedPartner;
  redemptions?: IRedemption[];
}

// GET /api/admin/referrals/withdrawals
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    await connectDB();

    // Fetch all referral rewards with populated customer_id
    const rewards = await ReferralReward.find({})
      .populate({ path: "customer_id", select: "firstName lastName email", model: User })
      .lean();

    // Extract and flatten all redemptions
    const allWithdrawals = (rewards as unknown as PopulatedReward[]).flatMap((reward) => 
      (reward.redemptions || []).map((redemption) => ({
        ...redemption,
        partnerId: reward.customer_id?._id,
        partnerName: reward.customer_id?.firstName 
          ? `${reward.customer_id.firstName} ${reward.customer_id.lastName}` 
          : "Unknown",
        partnerEmail: reward.customer_id?.email,
        rewardId: reward._id
      }))
    );

    // Sort by created_at descending (newest first)
    allWithdrawals.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ withdrawals: allWithdrawals });
  } catch (error: unknown) {
    console.error("Fetch Withdrawals Error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch withdrawals";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH /api/admin/referrals/withdrawals
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const body = await req.json();
    const { rewardId, redemptionId, status } = body;

    if (!rewardId || !redemptionId || !status) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!["completed", "failed", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    await connectDB();

    const reward = await ReferralReward.findById(rewardId).populate({
      path: "customer_id",
      select: "firstName lastName email",
      model: User
    });

    if (!reward) {
      return NextResponse.json({ error: "Referral reward not found." }, { status: 404 });
    }

    const redemption = reward.redemptions.find(r => r._id?.toString() === redemptionId);
    if (!redemption) {
      return NextResponse.json({ error: "Redemption request not found." }, { status: 404 });
    }

    if (redemption.status !== "pending") {
      return NextResponse.json({ error: `Request is already ${redemption.status}.` }, { status: 400 });
    }

    // Update the ledger based on status
    if (status === "completed") {
      redemption.status = "completed";
      // Assuming pending_cash was already deducted when they requested, or availableBalance is calculated based on pending + completed.
      // We don't need to change total_earned or cash_earned.
    } else if (status === "failed" || status === "rejected") {
      redemption.status = "failed";
      // Optionally adjust pending_cash here if it's explicitly tracked in the DB.
    }

    await reward.save();

    // Send email notification to partner
    const partner = reward.customer_id as unknown as PopulatedPartner;
    if (partner && partner.email) {
      const partnerName = partner.firstName || 'Partner';
      await sendWithdrawalStatusEmail(
        partner.email,
        partnerName,
        redemption.amount,
        status === "completed" ? "approved" : "rejected"
      ).catch(err => console.error("Failed to send withdrawal email:", err));
    }

    return NextResponse.json({ success: true, message: `Withdrawal request ${status}.` });
  } catch (error: unknown) {
    console.error("Update Withdrawal Status Error:", error);
    const message = error instanceof Error ? error.message : "Failed to update withdrawal status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
