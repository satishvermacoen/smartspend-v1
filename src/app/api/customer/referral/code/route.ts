import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/features/shared/model/user";
import ReferralCode from "@/features/shared/model/referral-code";

export async function GET(req: NextRequest) {
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

    const referralCodes = await ReferralCode.find({ referrer_id: user._id }).lean();

    return NextResponse.json({
      success: true,
      referralCodes
    });
  } catch (error: any) {
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
  } catch (error: any) {
    console.error("Customer create referral code error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while creating your referral code." },
      { status: 500 }
    );
  }
}
