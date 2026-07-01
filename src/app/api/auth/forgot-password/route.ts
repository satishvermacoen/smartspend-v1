import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User, { IUser } from '@/features/shared/model/user';
import Client, { IClient } from '@/features/shared/model/client';
import { sendPasswordResetEmail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required.' },
        { status: 400 }
      );
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    await connectDB();

    let account: IUser | IClient | null = await User.findOne({ email: email.toLowerCase().trim() });

    if (!account) {
      account = await Client.findOne({ email: email.toLowerCase().trim() });
    }

    // For security reasons, do not explicitly reveal if email is not found
    if (!account) {
      return NextResponse.json(
        { message: 'If an account exists with that email, a password reset link has been sent.' },
        { status: 200 }
      );
    }

    // Generate password reset token
    const token = account.createPasswordResetToken();
    await account.save();

    // Send reset email
    const emailSent = await sendPasswordResetEmail(account.email!, token);
    if (!emailSent) {
      console.error('Failed to send password reset email to:', account.email);
    }

    return NextResponse.json(
      { message: 'If an account exists with that email, a password reset link has been sent.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
