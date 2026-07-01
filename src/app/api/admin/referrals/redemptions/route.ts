import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import ReferralReward, { IRedemption } from '@/features/shared/model/referral-reward';

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

    interface PopulatedCustomer {
      _id: { toString(): string };
      firstName?: string;
      lastName?: string;
      email?: string;
    }

    interface RedemptionRequest {
      customerId: string;
      customerName: string;
      customerEmail: string;
      redemptionId: string;
      type: string;
      amount: number;
      months: number;
      date: Date | string;
    }

    const pendingRequests: RedemptionRequest[] = [];

    ledgers.forEach(ledger => {
      const customer = ledger.customer_id as unknown as PopulatedCustomer;
      if (!customer) return;

      ledger.redemptions?.forEach((redemption: IRedemption) => {
        if (redemption.status === statusFilter || statusFilter === 'all') {
          pendingRequests.push({
            customerId: customer._id.toString(),
            customerName: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Referrer',
            customerEmail: customer.email || '',
            redemptionId: redemption._id?.toString() || '',
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
  } catch (error) {
    console.error('Fetch Redemptions Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch redemptions.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
