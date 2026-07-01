import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/features/shared/model/user';
import Client from '@/features/shared/model/client';
import ReferralReward from '@/features/shared/model/referral-reward';
import ReferralConversion from '@/features/shared/model/referral-conversion';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getMonthStart(offset: number) {
  const d = new Date();
  d.setMonth(d.getMonth() - offset);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // ── ACTIVE SUBSCRIPTION ───────────────────────────────────────────────
    const now = new Date();
    const activeSub = user.subscriptions
      .filter((s: { status: string; endDate: Date }) => s.status === 'active' && new Date(s.endDate) > now)
      .sort((a: { endDate: Date }, b: { endDate: Date }) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())[0] || null;

    let daysRemaining = 0;
    if (activeSub) {
      const diffTime = new Date(activeSub.endDate).getTime() - now.getTime();
      daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    // ── REWARD LEDGER ─────────────────────────────────────────────────────
    const ledger = await ReferralReward.findOne({ customer_id: user._id });

    const claimedCash = ledger?.redemptions
      .filter((r: { type: string; status: string }) => r.type === 'cash_claim' && r.status === 'completed')
      .reduce((sum: number, r: { amount: number }) => sum + r.amount, 0) || 0;

    const pendingCash = ledger?.redemptions
      .filter((r: { type: string; status: string }) => r.type === 'cash_claim' && r.status === 'pending')
      .reduce((sum: number, r: { amount: number }) => sum + r.amount, 0) || 0;

    const cashEarned = ledger?.cash_earned || 0;
    const availableBalance = Math.max(0, cashEarned - claimedCash - pendingCash);
    const subscriptionMonths = ledger?.subscription_months || 0;

    // ── FUNNEL COUNTS (parallel) ──────────────────────────────────────────
    const [referralClicks, referralSignups, referralPurchases, referredCount] = await Promise.all([
      ReferralConversion.countDocuments({
        referrer_id: user._id,
        conversion_stage: { $in: ['clicked', 'visited', 'signed_up', 'purchased'] }
      }),
      ReferralConversion.countDocuments({
        referrer_id: user._id,
        conversion_stage: { $in: ['signed_up', 'purchased'] }
      }),
      ReferralConversion.countDocuments({ referrer_id: user._id, conversion_stage: 'purchased' }),
      User.countDocuments({ 'referredBy.referrerId': user._id }),
    ]);

    // ── CLIENT COUNTS ─────────────────────────────────────────────────────
    const [activeClients, totalClients] = await Promise.all([
      Client.countDocuments({ 'referredBy.referrerId': user._id, status: 'active', isDeleted: { $ne: true } }),
      Client.countDocuments({ 'referredBy.referrerId': user._id, isDeleted: { $ne: true } }),
    ]);

    // ── EARNINGS TODAY ────────────────────────────────────────────────────
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const todayConversions = await ReferralConversion.find({
      referrer_id: user._id,
      conversion_stage: 'purchased',
      'timeline.purchased_at': { $gte: todayStart }
    });
    const earningsToday = todayConversions.reduce(
      (sum: number, c: { referrer_reward?: { amount?: number } }) => sum + (c.referrer_reward?.amount || 0), 0
    );

    // ── COMPUTED ──────────────────────────────────────────────────────────
    const conversionRate = referralClicks > 0
      ? parseFloat(((referralPurchases / referralClicks) * 100).toFixed(1)) : 0;

    // ── CHART: MONTHLY PERFORMANCE (6 months, real data) ─────────────────
    const sixMonthsAgo = getMonthStart(5);
    const monthlyRaw = await ReferralConversion.aggregate([
      { $match: { referrer_id: user._id, createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            stage: '$conversion_stage'
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const monthlyPerformance = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      const m = d.getMonth() + 1; const y = d.getFullYear();
      const forMonth = monthlyRaw.filter((e: { _id: { year: number; month: number } }) => e._id.month === m && e._id.year === y);
      const clicks = forMonth
        .filter((e: { _id: { stage: string } }) => ['clicked', 'visited', 'signed_up', 'purchased'].includes(e._id.stage))
        .reduce((s: number, e: { count: number }) => s + e.count, 0);
      const signups = forMonth
        .filter((e: { _id: { stage: string } }) => ['signed_up', 'purchased'].includes(e._id.stage))
        .reduce((s: number, e: { count: number }) => s + e.count, 0);
      const purchases = forMonth
        .filter((e: { _id: { stage: string } }) => e._id.stage === 'purchased')
        .reduce((s: number, e: { count: number }) => s + e.count, 0);
      monthlyPerformance.push({ name: MONTH_NAMES[m - 1], clicks, signups, purchases });
    }

    // ── CHART: FUNNEL ─────────────────────────────────────────────────────
    const funnelData = [
      { name: 'Clicks', value: referralClicks },
      { name: 'Signups', value: referralSignups },
      { name: 'Purchases', value: referralPurchases },
    ];

    // ── CHART: CLIENT STATUS ──────────────────────────────────────────────
    const clientStatusRaw = await Client.aggregate([
      { $match: { 'referredBy.referrerId': user._id, isDeleted: { $ne: true } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const clientStatusBreakdown = clientStatusRaw.map((s: { _id: string; count: number }) => ({
      status: s._id,
      count: s.count,
    }));

    // ── FEEDS: RECENT ACTIVITY (real timestamps) ──────────────────────────
    const recentConversions = await ReferralConversion.find({ referrer_id: user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    type ActivityItem = { type: string; title: string; subtitle: string; timestamp: Date | string; badge: string };
    const recentActivity: ActivityItem[] = (recentConversions as unknown as Array<{
      conversion_stage: string;
      prospect_email?: string;
      referrer_reward?: { amount?: number };
      timeline?: { purchased_at?: Date };
      createdAt?: Date;
    }>).map((c) => {
      const email = c.prospect_email || 'Prospect';
      if (c.conversion_stage === 'purchased') {
        return {
          type: 'purchase',
          title: `${email} made a purchase`,
          subtitle: c.referrer_reward?.amount ? `You earned ₹${c.referrer_reward.amount}` : 'Reward credited',
          timestamp: c.timeline?.purchased_at || c.createdAt || new Date(),
          badge: 'Purchase',
        };
      }
      if (c.conversion_stage === 'signed_up') {
        return { type: 'signup', title: `${email} signed up`, subtitle: 'Awaiting purchase to earn reward', timestamp: c.createdAt || new Date(), badge: 'Signup' };
      }
      return { type: 'click', title: 'Your link was clicked', subtitle: email !== 'Prospect' ? `By ${email}` : 'New visitor', timestamp: c.createdAt || new Date(), badge: 'Click' };
    });


    // ── BILLING HISTORY ───────────────────────────────────────────────────
    const billingHistory = user.subscriptions
      .slice()
      .sort((a: { startDate: Date }, b: { startDate: Date }) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

    // ── RESPONSE ──────────────────────────────────────────────────────────
    return NextResponse.json({
      success: true,
      profile: {
        fullName: user.fullName,
        email: user.email,
        referralCode: user.referralCode || '',
        accountBalance: user.accountBalance || 0,
        createdAt: user.get('createdAt'),
      },
      stats: {
        activePlanName: activeSub ? activeSub.packageName : 'No Active Plan',
        daysRemaining,
        walletBalance: availableBalance,
        cashEarned,
        pendingCash,
        availableBalance,
        claimedCash,
        subscriptionMonths,
        earningsToday,
        referredCount,
        referralClicks,
        referralSignups,
        referralPurchases,
        activeClients,
        totalClients,
        conversionRate,
      },
      charts: {
        monthlyPerformance,
        funnelData,
        clientStatusBreakdown,
      },
      feeds: { recentActivity },
      activeSubscription: activeSub,
      conversions: recentConversions.slice(0, 5),
      billingHistory,
    });

  } catch (error) {
    console.error('Partner dashboard GET route error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while loading dashboard.' },
      { status: 500 }
    );
  }
}
