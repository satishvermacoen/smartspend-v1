import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Enquiry from '@/features/shared/model/enquiry';
import { z } from 'zod';

// Input validation schema using Zod
const enquiryInputSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.').max(100),
  mobile: z.string().trim().min(7, 'Mobile number must be at least 7 digits.').max(15),
  email: z.string().trim().email('Please provide a valid email address.').max(255).optional().or(z.literal('')),
  subscription: z.string().trim().max(100).optional().or(z.literal('')),
  message: z.string().trim().max(500).optional().or(z.literal('')),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate request data
    const parseResult = enquiryInputSchema.safeParse(body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((err: { message: string }) => err.message).join(' ');
      return NextResponse.json(
        { error: errorMsg },
        { status: 400 }
      );
    }

    const { name, mobile, email, subscription, message } = parseResult.data;

    // Connect to database
    await connectDB();

    // Create and save enquiry
    const enquiry = new Enquiry({
      name,
      mobile,
      email: email || undefined,
      subscription: subscription || undefined,
      message: message || undefined,
      status: 'pending'
    });

    await enquiry.save();

    return NextResponse.json(
      { 
        success: true, 
        message: 'Enquiry submitted successfully.', 
        enquiryId: enquiry._id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Enquiry submission error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
