import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Client from '@/features/shared/model/client';
import User from '@/features/shared/model/user';
import Invoice from '@/features/shared/model/invoice';

export async function GET(req: Request) {
  try {
    // 1. Authenticate session and check admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    // 2. Connect to the database
    await connectDB();

    // 3. Parse query parameters
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const source = searchParams.get('type') || 'all'; // using 'type' query parameter to map to 'source' or referral status
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '10', 10));
    const skip = (page - 1) * limit;

    // 4. Construct query filters
    const query: Record<string, any> = {
      isDeleted: { $ne: true }
    };

    // Filter by status if not "all"
    if (status !== 'all') {
      query.status = status;
    }

    const referrerId = searchParams.get('referrerId');

    // Filter by type/source
    if (referrerId) {
      query['referredBy.referrerId'] = referrerId;
    } else if (source === 'referrer') {
      // Referred clients (those with a referral partner linked)
      query['referredBy.referrerId'] = { $exists: true, $ne: null };
    } else if (source === 'non-referrer') {
      // Direct signups
      query.$or = [
        { 'referredBy.referrerId': { $exists: false } },
        { 'referredBy.referrerId': null }
      ];
    } else if (source !== 'all') {
      query.source = source;
    }

    // Apply search filter if query exists
    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { mobile: searchRegex },
        { referralCode: searchRegex }
      ];
    }

    // 5. Fetch clients and total count
    const clients = await Client.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const clientIds = clients.map(c => c._id);
    const invoices = await Invoice.find({ client_id: { $in: clientIds }, status: 'paid' }).lean();

    const clientsWithPurchases = await Promise.all(clients.map(async (client) => {
      const totalPurchase = invoices
        .filter(inv => inv.client_id.toString() === client._id.toString())
        .reduce((sum, inv) => sum + inv.amount, 0);
      
      let status = client.status;
      if (totalPurchase > 0 && status !== 'active' && status !== 'inactive') {
        status = 'active';
        await Client.findByIdAndUpdate(client._id, { $set: { status: 'active' } });
      }

      return {
        ...client,
        status,
        purchase: totalPurchase
      };
    }));

    const total = await Client.countDocuments(query);

    // 6. Calculate stats
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [totalClients, activeClients, referredClients, newClientsToday] = await Promise.all([
      Client.countDocuments({ isDeleted: { $ne: true } }),
      Client.countDocuments({ status: 'active', isDeleted: { $ne: true } }),
      Client.countDocuments({ 'referredBy.referrerId': { $exists: true, $ne: null }, isDeleted: { $ne: true } }),
      Client.countDocuments({ createdAt: { $gte: startOfToday }, isDeleted: { $ne: true } })
    ]);

    return NextResponse.json({
      success: true,
      users: clientsWithPurchases, // Map to frontend expecting 'users' key
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      stats: {
        totalUsers: totalClients,
        activeUsers: activeClients,
        referrerUsers: referredClients, // Map to stats.referrerUsers
        newUsersToday: newClientsToday
      }
    });

  } catch (error) {
    console.error('Admin clients list error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching clients.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // 1. Authenticate session and check admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    // 2. Parse request body
    const body = await req.json();
    const { name, mobile, email, status, source, notes, referralCode } = body;

    if (!name || !mobile) {
      return NextResponse.json({ error: 'Name and Mobile number are required.' }, { status: 400 });
    }

    // 3. Connect to database
    await connectDB();

    // Check if client with mobile already exists
    const existingClient = await Client.findOne({ mobile: mobile.trim(), isDeleted: { $ne: true } });
    if (existingClient) {
      return NextResponse.json({ error: 'A client with this mobile number already exists.' }, { status: 400 });
    }

    let referredBy = undefined;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode: referralCode.trim().toUpperCase(), role: 'referral_partner' });
      if (!referrer) {
        return NextResponse.json({ error: 'Referral partner with this code not found.' }, { status: 400 });
      }
      referredBy = {
        referrerId: referrer._id,
        referrerEmail: referrer.email
      };
    }

    // 4. Create and save new client
    const newClient = new Client({
      name: name.trim(),
      mobile: mobile.trim(),
      email: email?.trim().toLowerCase() || undefined,
      status: status || 'active',
      source: referralCode ? 'referral' : (source || 'admin'),
      notes: notes?.trim() || undefined,
      referralCode: referralCode?.trim().toUpperCase() || undefined,
      referredBy,
      subscriptions: []
    });

    await newClient.save();

    return NextResponse.json({
      success: true,
      message: 'Client profile created successfully.',
      client: newClient
    });

  } catch (error) {
    console.error('Admin client creation error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while creating the client.' },
      { status: 500 }
    );
  }
}
