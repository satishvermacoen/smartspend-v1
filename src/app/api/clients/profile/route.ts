import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Client from '@/features/shared/model/client';
import { z } from 'zod';

const updateClientProfileSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100).optional(),
  mobile: z.string().trim().min(1, 'Mobile number is required').max(20).optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, 'New password must be at least 6 characters').optional(),
}).refine(data => {
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: 'Current password is required to set a new password',
  path: ['currentPassword']
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'client') {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    await connectDB();

    const client = await Client.findById(session.user.id);
    if (!client) {
      return NextResponse.json({ error: 'Client not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: client._id,
        email: client.email,
        name: client.name,
        phone: client.mobile,
        role: 'client',
        status: client.status,
        createdAt: client.createdAt,
      }
    });

  } catch (error) {
    console.error('Fetch client profile error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve profile data.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'client') {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const parseResult = updateClientProfileSchema.safeParse(body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map(err => err.message).join(' ');
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { name, mobile, currentPassword, newPassword } = parseResult.data;

    // Fetch client with password field explicitly selected
    const client = await Client.findById(session.user.id).select('+password');
    if (!client) {
      return NextResponse.json({ error: 'Client not found.' }, { status: 404 });
    }

    // Handle password change if requested
    if (newPassword && currentPassword) {
      const isMatch = await client.comparePassword(currentPassword);
      if (!isMatch) {
        return NextResponse.json({ error: 'Incorrect current password.' }, { status: 400 });
      }
      client.password = newPassword;
    }

    // Update basic information
    if (name !== undefined) client.name = name;
    if (mobile !== undefined) client.mobile = mobile;

    await client.save();

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: client._id,
        email: client.email,
        name: client.name,
        phone: client.mobile,
        role: 'client',
        status: client.status,
      }
    });

  } catch (error) {
    console.error('Update client profile error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while updating your profile.' },
      { status: 500 }
    );
  }
}
