import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import ReferralReward from '@/features/shared/model/referral-reward';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status') || 'pending';

    await connectDB();

    // Find all reward ledgers that have redemptions
    const ledgers = await ReferralReward.find({ 
      'redemptions.0': { $exists: true } 
    }).populate('customer_id', 'firstName lastName email').lean();

    const pendingRequests: any[] = [];

    ledgers.forEach(ledger => {
      const customer = ledger.customer_id as any;
      if (!customer) return;

      ledger.redemptions?.forEach((redemption: any) => {
        if (redemption.status === statusFilter || statusFilter === 'all') {
          pendingRequests.push({
            customerId: customer._id.toString(),
            customerName: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Referrer',
            customerEmail: customer.email,
            redemptionId: redemption._id.toString(),
            type: redemption.type,
            amount: redemption.amount || 0,
            months: redemption.months || 0,
            date: redemption.created_at || new Date().toISOString(),
          });
        }
      });
    });

    // Sort by date descending
    pendingRequests.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ success: true, pendingRequests });
  } catch (error: any) {
    console.error('Fetch Redemptions Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch redemptions.' }, { status: 500 });
  }
}
