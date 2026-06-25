import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Enquiry from '@/features/shared/model/enquiry';

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
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '10', 10));
    const skip = (page - 1) * limit;

    // 4. Construct query filters
    const query: Record<string, unknown> = {};

    // Filter by status if not "all"
    if (status !== 'all') {
      query.status = status;
    }

    // Apply search filter if query exists
    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { mobile: searchRegex },
        { email: searchRegex },
        { subscription: searchRegex }
      ];
    }

    // 5. Fetch enquiries and total count
    const enquiries = await Enquiry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Enquiry.countDocuments(query);

    return NextResponse.json({
      success: true,
      enquiries,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Admin enquiry list error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching enquiries.' },
      { status: 500 }
    );
  }
}
