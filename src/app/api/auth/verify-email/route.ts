import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/features/shared/model/user';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required.' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the user by token (checks expiration too)
    const user = await User.findByEmailVerificationToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token.' },
        { status: 400 }
      );
    }

    // Verify email, activate status, and save
    await user.verifyEmail();

    return NextResponse.json(
      { message: 'Email address verified successfully! You can now log in.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during verification. Please try again.' },
      { status: 500 }
    );
  }
}
