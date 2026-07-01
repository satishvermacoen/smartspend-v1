import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Client from '@/features/shared/model/client';
import Invoice from '@/features/shared/model/invoice';
import ReferralConversion from '@/features/shared/model/referral-conversion';

export async function GET(req: Request) {
  try {
    // 1. Authenticate session
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    // 2. Connect to the database
    await connectDB();

    // 3. Parse query parameters
    const { searchParams } = new URL(req.url);
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '100', 10));
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const skip = (page - 1) * limit;

    // 4. Construct query filter to strictly limit to this partner's referred clients
    const query = {
      isDeleted: { $ne: true },
      'referredBy.referrerId': session.user.id,
    };

    // 5. Fetch clients
    const clients = await Client.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const clientIds = clients.map(c => c._id);
    
    // Fetch associated paid invoices to calculate total purchases
    const invoices = await Invoice.find({ client_id: { $in: clientIds }, status: 'paid' }).lean();

    // Fetch associated conversions for timeline tracking
    const conversions = await ReferralConversion.find({ referrer_id: session.user.id }).lean();

    const clientsWithPurchases = clients.map((client) => {
      const totalPurchase = invoices
        .filter(inv => inv.client_id.toString() === client._id.toString())
        .reduce((sum, inv) => sum + inv.amount, 0);

      // We do not auto-update the database here like in admin, as partners should have read-only access.
      // But we calculate the same state for UI consistency.
      let status = client.status;
      if (totalPurchase > 0 && status !== 'active' && status !== 'inactive') {
        status = 'active';
      }

      // Find matching conversion
      const matchedConversion = conversions.find(
        (conv) => 
          (client.email && conv.prospect_email?.toLowerCase() === client.email.toLowerCase()) ||
          (conv.referral_code === client.referralCode)
      );

      return {
        ...client,
        status,
        purchase: totalPurchase,
        conversion: matchedConversion || null
      };
    });

    const total = await Client.countDocuments(query);

    return NextResponse.json({
      success: true,
      users: clientsWithPurchases,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Partner clients list error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching clients.' },
      { status: 500 }
    );
  }
}
