"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Activity } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Dashboard components
import { DashboardHeader } from "@/components/admin/dashboard/dashboard-header";
import { KPICards } from "@/components/admin/dashboard/kpi-cards";
import { RevenueChart } from "@/components/admin/dashboard/revenue-chart";
import { InquiryPurchaseChart } from "@/components/admin/dashboard/inquiry-purchase-chart";
import { TopSubscriptionsChart } from "@/components/admin/dashboard/top-subscriptions-chart";
import { ClientStatusChart } from "@/components/admin/dashboard/client-status-chart";
import { ReferralFunnel } from "@/components/admin/dashboard/referral-funnel";
import { Leaderboard } from "@/components/admin/dashboard/leaderboard";
import { PendingActions } from "@/components/admin/dashboard/pending-actions";
import { ActivityFeed } from "@/components/admin/dashboard/activity-feed";
import { InsightsPanel } from "@/components/admin/dashboard/insights-panel";
import { GrowthMetrics } from "@/components/admin/dashboard/growth-metrics";

// ── Types ──────────────────────────────────────────────────────────────────

interface DashboardStats {
  totalRevenue: number;
  totalInquiries: number;
  totalPurchases: number;
  conversionRate: number;
  totalPartners: number;
  activeCodes: number;
  activeClients: number;
  rewardsPaid: number;
  referredClients: number;
  pendingEnquiries: number;
  pendingInvoices: number;
  pendingRewardsDocs: number;
  newClientsToday: number;
  monthlyInquiryGrowth: number;
  monthlySalesGrowth: number;
  referralAttributionRate: number;
  thisMonthInquiries: number;
  thisMonthPurchases: number;
}

interface DashboardCharts {
  revenueWithReferral: { name: string; totalRevenue: number; referralRevenue: number; directRevenue: number }[];
  inquiryVsPurchase: { name: string; inquiries: number; purchases: number; conversionRate: number }[];
  topSubscriptions: { name: string; count: number; revenue: number; avgDeal: number }[];
  clientStatusBreakdown: { status: string; count: number }[];
  funnelChartData: { name: string; value: number }[];
}

interface DashboardTrends {
  inquiries: number[];
  purchases: number[];
  revenue: number[];
}

interface ActivityItem {
  type: string;
  title: string;
  subtitle: string;
  timestamp: string;
  badge: string;
}

interface LeaderboardItem {
  referrerId: string;
  name: string;
  email: string;
  referralCode: string;
  earnings: number;
  conversionsCount: number;
  conversionRate: number;
}

interface DashboardData {
  stats: DashboardStats;
  charts: DashboardCharts;
  trends: DashboardTrends;
  feeds: { recentActivity: ActivityItem[] };
}

// ── Default empty state ────────────────────────────────────────────────────

const EMPTY_STATS: DashboardStats = {
  totalRevenue: 0, totalInquiries: 0, totalPurchases: 0,
  conversionRate: 0, totalPartners: 0, activeCodes: 0,
  activeClients: 0, rewardsPaid: 0, referredClients: 0,
  pendingEnquiries: 0, pendingInvoices: 0, pendingRewardsDocs: 0,
  newClientsToday: 0, monthlyInquiryGrowth: 0, monthlySalesGrowth: 0,
  referralAttributionRate: 0, thisMonthInquiries: 0, thisMonthPurchases: 0,
};

const EMPTY_CHARTS: DashboardCharts = {
  revenueWithReferral: [],
  inquiryVsPurchase: [],
  topSubscriptions: [],
  clientStatusBreakdown: [],
  funnelChartData: [],
};

const EMPTY_TRENDS: DashboardTrends = {
  inquiries: [0, 0, 0, 0, 0, 0, 0],
  purchases: [0, 0, 0, 0, 0, 0, 0],
  revenue:   [0, 0, 0, 0, 0, 0, 0],
};

// ── Page ──────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [dashData, setDashData] = useState<DashboardData>({
    stats: EMPTY_STATS,
    charts: EMPTY_CHARTS,
    trends: EMPTY_TRENDS,
    feeds: { recentActivity: [] },
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);

  const fetchAll = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);
    setError(false);
    try {
      const [dashRes, refRes] = await Promise.all([
        fetch("/api/admin/dashboard"),
        fetch("/api/admin/referrals/analytics"),
      ]);

      const dashJson = await dashRes.json();
      const refJson = await refRes.json();

      if (dashJson.success) {
        setDashData({
          stats:  dashJson.stats,
          charts: dashJson.charts,
          trends: dashJson.trends,
          feeds:  dashJson.feeds,
        });
      } else {
        throw new Error(dashJson.error || "Dashboard data failed.");
      }

      if (refJson.success) {
        setLeaderboard(refJson.leaderboard || []);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      toast.error("Failed to load dashboard data.");
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => fetchAll());
  }, [fetchAll]);

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-40 gap-3 text-muted-foreground bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
        <span className="text-sm">Loading Command Center...</span>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-40 text-center text-muted-foreground bg-background">
        <Activity className="h-12 w-12 opacity-30 text-destructive mb-3 animate-pulse" />
        <h4 className="font-semibold text-lg text-foreground">Failed to Load Dashboard</h4>
        <p className="text-sm max-w-sm mt-1">Check your network and authorization, then try again.</p>
        <Button
          onClick={() => fetchAll(true)}
          className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-card border border-border/15 text-foreground hover:bg-soft"
        >
          Try Again
        </Button>
      </div>
    );
  }

  const { stats, charts, trends, feeds } = dashData;

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 p-6 md:p-8 space-y-7 bg-background relative overflow-y-auto">

      {/* ── Section 1: Header ───────────────────────────────────────────── */}
      <DashboardHeader
        onRefresh={() => fetchAll(true)}
        isLoading={loading}
        pendingEnquiries={stats.pendingEnquiries}
        pendingInvoices={stats.pendingInvoices}
      />

      {/* ── Section 2: KPI Cards (10) ────────────────────────────────────── */}
      <KPICards stats={stats} trends={trends} />

      {/* ── Section 3: Main Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column — Charts */}
        <div className="lg:col-span-8 space-y-6">

          {/* 3a. Revenue Overview */}
          <RevenueChart data={charts.revenueWithReferral} />

          {/* 3b. Inquiry vs Purchase Comparison */}
          <InquiryPurchaseChart data={charts.inquiryVsPurchase} />

          {/* 3c + 3d: Two smaller charts side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TopSubscriptionsChart data={charts.topSubscriptions} />
            <ClientStatusChart data={charts.clientStatusBreakdown} />
          </div>

          {/* 3e. Referral Funnel */}
          <ReferralFunnel data={charts.funnelChartData} />
        </div>

        {/* Right Column — Action Panels */}
        <div className="lg:col-span-4 space-y-6">
          <PendingActions
            pendingEnquiries={stats.pendingEnquiries}
            pendingInvoices={stats.pendingInvoices}
            pendingRewardsDocs={stats.pendingRewardsDocs}
            newClientsToday={stats.newClientsToday}
          />
          <Leaderboard leaderboard={leaderboard} />
          <ActivityFeed items={feeds.recentActivity} />
        </div>
      </div>

      {/* ── Section 4: AI Insights Panel ────────────────────────────────── */}
      <InsightsPanel stats={stats} />

      {/* ── Section 5: Growth Metrics Strip ─────────────────────────────── */}
      <GrowthMetrics stats={stats} />

    </div>
  );
}