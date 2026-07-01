import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/features/shared/model/user";
import ReferralCode from "@/features/shared/model/referral-code";
import ReferralConversion from "@/features/shared/model/referral-conversion";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const referralCodes = await ReferralCode.find({ referrer_id: user._id }).sort({ created_at: -1 }).lean();

    // Enrich with dynamic usage stats
    const enrichedCodes = await Promise.all(referralCodes.map(async (c) => {
      const clicks = await ReferralConversion.countDocuments({
        referral_code: c.code
      });

      const signups = await ReferralConversion.countDocuments({
        referral_code: c.code,
        conversion_stage: { $in: ['signed_up', 'purchased'] }
      });

      const purchasesDoc = await ReferralConversion.find({
        referral_code: c.code,
        conversion_stage: 'purchased'
      });

      const purchases = purchasesDoc.length;
      
      const revenue = purchasesDoc.reduce(
        (sum, doc) => sum + (doc.purchase_details?.net_amount || 0), 
        0
      );

      return {
        ...c,
        stats: {
          clicks,
          signups,
          purchases,
          revenue
        }
      };
    }));

    return NextResponse.json({
      success: true,
      referralCodes: enrichedCodes
    });
  } catch (error: unknown) {
    console.error("Customer get referral codes error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching your referral codes." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const { linkName } = await req.json();
    if (!linkName) {
      return NextResponse.json({ error: "Referral link name is required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const linkCount = await ReferralCode.countDocuments({ referrer_id: user._id });
    if (linkCount >= 5) {
      return NextResponse.json({ error: "You have reached the maximum limit of 5 referral links." }, { status: 400 });
    }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codeStr = 'REF';
    for (let i = 0; i < 5; i++) {
      codeStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const newCode = await ReferralCode.create({
      code: codeStr,
      name: linkName,
      referrer_id: user._id,
      is_active: true
    });

    return NextResponse.json({ success: true, referralCode: newCode });
  } catch (error: unknown) {
    console.error("Customer create referral code error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while creating your referral code." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const { id, is_active } = await req.json();
    if (!id || typeof is_active !== "boolean") {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    await connectDB();

    const codeToUpdate = await ReferralCode.findOne({ _id: id, referrer_id: session.user.id });
    if (!codeToUpdate) {
      return NextResponse.json({ error: "Referral code not found." }, { status: 404 });
    }

    codeToUpdate.is_active = is_active;
    await codeToUpdate.save();

    return NextResponse.json({ success: true, message: "Code status updated." });
  } catch (error: unknown) {
    console.error("Customer update referral code error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while updating your referral code." },
      { status: 500 }
    );
  }
}
