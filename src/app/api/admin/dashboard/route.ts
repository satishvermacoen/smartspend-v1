import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/features/shared/model/user';
import Client from '@/features/shared/model/client';
import Invoice from '@/features/shared/model/invoice';
import ReferralCode from '@/features/shared/model/referral-code';
import ReferralConversion from '@/features/shared/model/referral-conversion';
import ReferralReward from '@/features/shared/model/referral-reward';

function getMonthRange(offset: number) {
  const start = new Date();
  start.setMonth(start.getMonth() - offset);
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);
  return { start, end };
}

function getDayStart(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(0, 0, 0, 0);
  return d;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    await connectDB();

    const { start: thisMonthStart } = getMonthRange(0);
    const { start: lastMonthStart, end: lastMonthEnd } = getMonthRange(1);
    const startOfToday = getDayStart(0);

    // ── PARALLEL CORE STATS ────────────────────────────────────────────────
    const [
      totalInquiries,
      totalPurchases,
      totalPartners,
      pendingEnquiries,
      pendingInvoices,
      pendingRewardsDocs,
      activeCodes,
      activeClients,
      referredClients,
      newClientsToday,
      thisMonthInquiries,
      lastMonthInquiries,
      thisMonthPurchases,
      lastMonthPurchases,
    ] = await Promise.all([
      Client.countDocuments({ isDeleted: { $ne: true } }),
      Invoice.countDocuments({ status: 'paid' }),
      User.countDocuments({ role: 'referral_partner', isDeleted: { $ne: true } }),
      Client.countDocuments({ status: 'pending', isDeleted: { $ne: true } }),
      Invoice.countDocuments({ status: 'pending' }),
      ReferralReward.countDocuments({ pending_cash: { $gt: 0 } }),
      ReferralCode.countDocuments({ is_active: true }),
      Client.countDocuments({ status: 'active', isDeleted: { $ne: true } }),
      Client.countDocuments({ 'referredBy.referrerId': { $exists: true, $ne: null }, isDeleted: { $ne: true } }),
      Client.countDocuments({ createdAt: { $gte: startOfToday }, isDeleted: { $ne: true } }),
      Client.countDocuments({ createdAt: { $gte: thisMonthStart }, isDeleted: { $ne: true } }),
      Client.countDocuments({ createdAt: { $gte: lastMonthStart, $lt: lastMonthEnd }, isDeleted: { $ne: true } }),
      Invoice.countDocuments({ status: 'paid', purchase_date: { $gte: thisMonthStart } }),
      Invoice.countDocuments({ status: 'paid', purchase_date: { $gte: lastMonthStart, $lt: lastMonthEnd } }),
    ]);

    // ── REVENUE & REWARDS ──────────────────────────────────────────────────
    const [totalRevenueAgg, rewardsPaidAgg] = await Promise.all([
      Invoice.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      ReferralReward.aggregate([
        { $group: { _id: null, totalCash: { $sum: '$cash_earned' } } }
      ]),
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;
    const rewardsPaid = rewardsPaidAgg[0]?.totalCash || 0;

    // ── COMPUTED STATS ─────────────────────────────────────────────────────
    const conversionRate = totalInquiries > 0
      ? parseFloat(((totalPurchases / totalInquiries) * 100).toFixed(1)) : 0;
    const monthlyInquiryGrowth = lastMonthInquiries > 0
      ? parseFloat((((thisMonthInquiries - lastMonthInquiries) / lastMonthInquiries) * 100).toFixed(1)) : 0;
    const monthlySalesGrowth = lastMonthPurchases > 0
      ? parseFloat((((thisMonthPurchases - lastMonthPurchases) / lastMonthPurchases) * 100).toFixed(1)) : 0;
    const referralAttributionRate = totalInquiries > 0
      ? parseFloat(((referredClients / totalInquiries) * 100).toFixed(1)) : 0;

    // ── CHART: REVENUE WITH REFERRAL SPLIT (6 months) ─────────────────────
    const sixMonthsAgo = getMonthRange(5).start;

    const [revenueByMonth, referralRevenueByMonth] = await Promise.all([
      Invoice.aggregate([
        { $match: { status: 'paid', purchase_date: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: { year: { $year: '$purchase_date' }, month: { $month: '$purchase_date' } },
            total: { $sum: '$amount' }
          }
        }
      ]),
      Invoice.aggregate([
        {
          $match: {
            status: 'paid',
            purchase_date: { $gte: sixMonthsAgo },
            referrer_id: { $exists: true, $ne: null }
          }
        },
        {
          $group: {
            _id: { year: { $year: '$purchase_date' }, month: { $month: '$purchase_date' } },
            total: { $sum: '$amount' }
          }
        }
      ]),
    ]);

    const revenueWithReferral = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      const m = d.getMonth() + 1; const y = d.getFullYear();
      const totalEntry = revenueByMonth.find((e: {_id: {month: number, year: number}, total: number}) => e._id.month === m && e._id.year === y);
      const refEntry = referralRevenueByMonth.find((e: {_id: {month: number, year: number}, total: number}) => e._id.month === m && e._id.year === y);
      const totalRev = totalEntry?.total || 0;
      const refRev = refEntry?.total || 0;
      revenueWithReferral.push({
        name: MONTH_NAMES[m - 1],
        totalRevenue: totalRev,
        referralRevenue: refRev,
        directRevenue: totalRev - refRev,
      });
    }

    // ── CHART: INQUIRY VS PURCHASE (6 months) ─────────────────────────────
    const [inquiriesByMonth, purchasesByMonth] = await Promise.all([
      Client.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo }, isDeleted: { $ne: true } } },
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            count: { $sum: 1 }
          }
        }
      ]),
      Invoice.aggregate([
        { $match: { status: 'paid', purchase_date: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: { year: { $year: '$purchase_date' }, month: { $month: '$purchase_date' } },
            count: { $sum: 1 }
          }
        }
      ]),
    ]);

    const inquiryVsPurchase = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      const m = d.getMonth() + 1; const y = d.getFullYear();
      const inqEntry = inquiriesByMonth.find((e: {_id: {month: number, year: number}, count: number}) => e._id.month === m && e._id.year === y);
      const purEntry = purchasesByMonth.find((e: {_id: {month: number, year: number}, count: number}) => e._id.month === m && e._id.year === y);
      const inq = inqEntry?.count || 0;
      const pur = purEntry?.count || 0;
      inquiryVsPurchase.push({
        name: MONTH_NAMES[m - 1],
        inquiries: inq,
        purchases: pur,
        conversionRate: inq > 0 ? parseFloat(((pur / inq) * 100).toFixed(1)) : 0,
      });
    }

    // ── CHART: TOP SUBSCRIPTIONS ───────────────────────────────────────────
    const topSubscriptionsRaw = await Invoice.aggregate([
      { $match: { status: 'paid' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.service_name',
          count: { $sum: { $ifNull: ['$items.quantity', 1] } },
          revenue: { $sum: '$items.amount' }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 6 }
    ]);
    const topSubscriptions = topSubscriptionsRaw.map((s: {_id: string, count: number, revenue: number}) => ({
      name: s._id || 'Unknown Service',
      count: s.count,
      revenue: s.revenue,
      avgDeal: s.count > 0 ? Math.round(s.revenue / s.count) : 0,
    }));

    // ── CHART: CLIENT STATUS BREAKDOWN ────────────────────────────────────
    const clientStatusRaw = await Client.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const clientStatusBreakdown = clientStatusRaw.map((s: {_id: string, count: number}) => ({
      status: s._id,
      count: s.count,
    }));

    // ── CHART: REFERRAL FUNNEL ─────────────────────────────────────────────
    const funnelStagesRaw = await ReferralConversion.aggregate([
      { $group: { _id: '$conversion_stage', count: { $sum: 1 } } }
    ]);
    const stagesMap: Record<string, number> = { clicked: 0, visited: 0, signed_up: 0, purchased: 0 };
    funnelStagesRaw.forEach((stage: {_id: string, count: number}) => {
      if (stage._id in stagesMap) stagesMap[stage._id] = stage.count;
    });
    const funnelChartData = [
      { name: 'Clicks', value: stagesMap.clicked + stagesMap.visited + stagesMap.signed_up + stagesMap.purchased },
      { name: 'Visits', value: stagesMap.visited + stagesMap.signed_up + stagesMap.purchased },
      { name: 'Signups', value: stagesMap.signed_up + stagesMap.purchased },
      { name: 'Purchases', value: stagesMap.purchased },
    ];

    // ── TRENDS: 7-DAY SPARKLINES ──────────────────────────────────────────
    const last7DayStart = getDayStart(6);

    const [dailyInquiries, dailyPurchases, dailyRevenue] = await Promise.all([
      Client.aggregate([
        { $match: { createdAt: { $gte: last7DayStart }, isDeleted: { $ne: true } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } }
      ]),
      Invoice.aggregate([
        { $match: { status: 'paid', purchase_date: { $gte: last7DayStart } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$purchase_date' } }, count: { $sum: 1 } } }
      ]),
      Invoice.aggregate([
        { $match: { status: 'paid', purchase_date: { $gte: last7DayStart } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$purchase_date' } }, total: { $sum: '$amount' } } }
      ]),
    ]);

    const trends: Record<string, number[]> = { inquiries: [], purchases: [], revenue: [] };
    for (let i = 6; i >= 0; i--) {
      const dayStart = getDayStart(i);
      const dayKey = dayStart.toISOString().split('T')[0];
      trends.inquiries.push((dailyInquiries as {_id: string, count: number}[]).find(d => d._id === dayKey)?.count || 0);
      trends.purchases.push((dailyPurchases as {_id: string, count: number}[]).find(d => d._id === dayKey)?.count || 0);
      trends.revenue.push((dailyRevenue as {_id: string, total: number}[]).find(d => d._id === dayKey)?.total || 0);
    }

    // ── FEEDS: RECENT ACTIVITY ────────────────────────────────────────────
    const [recentClients, recentInvoices] = await Promise.all([
      Client.find({ isDeleted: { $ne: true } })
        .select('name mobile email createdAt source status referralCode')
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
      Invoice.find({ status: 'paid' })
        .select('invoice_number amount purchase_date client_id referrer_id')
        .populate('client_id', 'name')
        .sort({ purchase_date: -1 })
        .limit(8)
        .lean(),
    ]);

    type ActivityItem = {
      type: string; title: string; subtitle: string;
      timestamp: Date | string | undefined; badge: string;
    };

    const recentActivity: ActivityItem[] = [
      ...recentClients.map(c => ({
        type: (c.source as string) === 'referral' ? 'referral' : 'enquiry',
        title: c.name as string,
        subtitle: (c.source as string) === 'referral' ? `Referred — ${c.referralCode || ''}` : `New Enquiry — ${c.status}`,
        timestamp: c.createdAt,
        badge: (c.source as string) === 'referral' ? 'Referral' : 'Enquiry',
      })),
      ...recentInvoices.map(inv => {
        const clientName = (inv.client_id as unknown as { name?: string })?.name || 'Client';
        return {
          type: 'invoice',
          title: `₹${(inv.amount as number).toLocaleString('en-IN')} — ${clientName}`,
          subtitle: `Invoice ${inv.invoice_number}`,
          timestamp: inv.purchase_date,
          badge: 'Invoice',
        };
      }),
    ]
      .sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime())
      .slice(0, 12);

    // ── RESPONSE ──────────────────────────────────────────────────────────
    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalInquiries,
        totalPurchases,
        conversionRate,
        totalPartners,
        activeCodes,
        activeClients,
        rewardsPaid,
        referredClients,
        pendingEnquiries,
        pendingInvoices,
        pendingRewardsDocs,
        newClientsToday,
        monthlyInquiryGrowth,
        monthlySalesGrowth,
        referralAttributionRate,
        thisMonthInquiries,
        thisMonthPurchases,
      },
      charts: {
        revenueWithReferral,
        inquiryVsPurchase,
        topSubscriptions,
        clientStatusBreakdown,
        funnelChartData,
      },
      trends,
      feeds: { recentActivity },
    });

  } catch (error) {
    console.error('Admin dashboard GET route error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching dashboard statistics.' },
      { status: 500 }
    );
  }
}

