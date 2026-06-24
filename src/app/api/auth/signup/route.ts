import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/features/shared/model/user';
import { sendVerificationEmail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password, phone } = await req.json();

    // Server-side validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'First name, last name, email, and password are required fields.' },
        { status: 400 }
      );
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists.' },
        { status: 400 }
      );
    }

    // Create inactive user
    const user = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone ? phone.trim() : undefined,
      role: 'customer',
      status: 'inactive', // inactive until email is verified
      emailVerified: false
    });

    // Generate verification token
    const token = user.createEmailVerificationToken();

    // Save user
    await user.save();

    // Send verification email
    const emailSent = await sendVerificationEmail(user.email, token);
    if (!emailSent) {
      console.warn('User registered but email failed to send to:', user.email);
    }

    return NextResponse.json(
      { 
        message: 'Registration successful! Please check your email to verify your account.',
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during registration. Please try again.' },
      { status: 500 }
    );
  }
}
