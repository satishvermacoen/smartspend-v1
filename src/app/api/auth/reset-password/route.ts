import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User, { IUser } from '@/features/shared/model/user';
import Client, { IClient } from '@/features/shared/model/client';

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the account by token (checks expiration too)
    let account: IUser | IClient | null = await User.findByPasswordResetToken(token);
    let isClient = false;

    if (!account) {
      account = await Client.findByPasswordResetToken(token);
      if (account) {
        isClient = true;
      }
    }

    if (!account) {
      return NextResponse.json(
        { error: 'Invalid or expired password reset token.' },
        { status: 400 }
      );
    }

    // Assign new password, clear token and reset login attempts
    account.password = newPassword;
    account.passwordResetToken = undefined;
    account.passwordResetExpires = undefined;
    
    if (!isClient) {
      const userAccount = account as IUser;
      userAccount.loginAttempts = 0;
      userAccount.lockUntil = undefined;
    }

    // Save the account (triggers pre-save hashing)
    await account.save();

    return NextResponse.json(
      { message: 'Your password has been reset successfully! You can now log in.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
