import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Client from '@/features/shared/model/client';
import Invoice from '@/features/shared/model/invoice';
import { sendClientPasswordUpdateEmail } from '@/lib/mail';
import { z } from 'zod';

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  mobile: z.string().min(1).optional(),
  email: z.string().email().optional().or(z.literal('')),
  status: z.enum(['pending', 'contacted', 'resolved', 'ignored', 'active', 'inactive']).optional(),
  notes: z.string().optional(),
  password: z.string().min(6).optional().or(z.literal('')),
});


export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Authenticate session and check admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Client ID is required.' }, { status: 400 });
    }

    // 2. Connect to database
    await connectDB();

    // 3. Find the client
    const client = await Client.findOne({ _id: id, isDeleted: { $ne: true } });
    if (!client) {
      return NextResponse.json({ error: 'Client not found.' }, { status: 404 });
    }

    // 4. Fetch invoices (purchases) associated with this client
    const invoices = await Invoice.find({ client_id: id }).sort({ purchase_date: -1 });

    return NextResponse.json({
      success: true,
      client,
      invoices
    });

  } catch (error) {
    console.error('Admin client fetch details error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching client details.' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Authenticate session and check admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Client ID is required.' }, { status: 400 });
    }

    const body = await req.json();
    const parseResult = updateSchema.safeParse(body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((err) => err.message).join(' ');
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const updateData = { ...parseResult.data };

    // 2. Connect to database
    await connectDB();

    // 3. Find the client
    const client = await Client.findOne({ _id: id, isDeleted: { $ne: true } });
    if (!client) {
      return NextResponse.json({ error: 'Client not found.' }, { status: 404 });
    }

    // Check if mobile number is being updated and already in use by another client
    if (updateData.mobile && updateData.mobile !== client.mobile) {
      const existingClient = await Client.findOne({ 
        mobile: updateData.mobile.trim(), 
        _id: { $ne: id }, 
        isDeleted: { $ne: true } 
      });
      if (existingClient) {
        return NextResponse.json({ error: 'A client with this mobile number already exists.' }, { status: 400 });
      }
    }

    // Assign fields
    if (updateData.name !== undefined) client.name = updateData.name.trim();
    if (updateData.mobile !== undefined) client.mobile = updateData.mobile.trim();
    if (updateData.email !== undefined) {
      client.email = updateData.email === '' ? undefined : updateData.email.trim().toLowerCase();
    }
    if (updateData.status !== undefined) client.status = updateData.status;
    if (updateData.notes !== undefined) client.notes = updateData.notes.trim();

    if (updateData.password !== undefined && updateData.password !== '') {
      client.password = updateData.password;
      const targetEmail = client.email || updateData.email;
      if (targetEmail) {
        await sendClientPasswordUpdateEmail(targetEmail, client.name, updateData.password);
      }
    }

    await client.save();

    return NextResponse.json({
      success: true,
      message: 'Client profile updated successfully.',
      client
    });

  } catch (error) {
    console.error('Admin client update error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while updating the client.' },
      { status: 500 }
    );
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Authenticate session and check admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Client ID is required.' }, { status: 400 });
    }

    // 2. Connect to database
    await connectDB();

    // 3. Soft delete client
    const deletedClient = await Client.findByIdAndUpdate(id, { $set: { isDeleted: true } });
    if (!deletedClient) {
      return NextResponse.json({ error: 'Client not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Client deleted successfully.'
    });

  } catch (error) {
    console.error('Admin client deletion error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while deleting the client.' },
      { status: 500 }
    );
  }
}
