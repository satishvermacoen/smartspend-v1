import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import ReferralCode from "@/features/shared/model/referral-code";
import User from "@/features/shared/model/user";

// PATCH update customer's own code configuration
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { is_active, name } = body;

    await connectDB();

    const codeDoc = await ReferralCode.findById(id);
    if (!codeDoc) {
      return NextResponse.json({ error: "Referral code not found." }, { status: 404 });
    }

    // Ensure user owns this code
    if (codeDoc.referrer_id.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized operation." }, { status: 403 });
    }

    if (is_active !== undefined) codeDoc.is_active = is_active;
    if (name !== undefined) codeDoc.name = name;

    await codeDoc.save();

    return NextResponse.json({
      success: true,
      message: "Referral code updated successfully.",
      code: codeDoc
    });

  } catch (error: any) {
    console.error("Customer patch code error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred while updating referral code." },
      { status: 500 }
    );
  }
}

// DELETE customer's own code
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const codeDoc = await ReferralCode.findById(id);
    if (!codeDoc) {
      return NextResponse.json({ error: "Referral code not found." }, { status: 404 });
    }

    // Ensure user owns this code
    if (codeDoc.referrer_id.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized operation." }, { status: 403 });
    }

    // Unset the referralCode from the referrer user profile if it matches the code being deleted
    const user = await User.findById(session.user.id);
    if (user && user.referralCode === codeDoc.code) {
      user.referralCode = undefined;
      await user.save();
    }

    // Delete the code document
    await ReferralCode.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: `Referral code "${codeDoc.code}" deleted successfully.`
    });

  } catch (error: any) {
    console.error("Customer delete code error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred while deleting referral code." },
      { status: 500 }
    );
  }
}
