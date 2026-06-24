import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/features/shared/model/user';

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

    // Find the user by token (checks expiration too)
    const user = await User.findByPasswordResetToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired password reset token.' },
        { status: 400 }
      );
    }

    // Assign new password, clear token and reset login attempts
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.loginAttempts = 0;
    user.lockUntil = undefined;

    // Save the user (triggers pre-save hashing)
    await user.save();

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
