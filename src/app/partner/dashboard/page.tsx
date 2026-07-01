"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// New components
import { PartnerHeader } from "@/components/partner/dashboard/referral/partner-header";
import { PartnerKPICards } from "@/components/partner/dashboard/referral/partner-kpi-cards";
import { PartnerPerformanceChart } from "@/components/partner/dashboard/referral/partner-performance-chart";
import { PartnerFunnel } from "@/components/partner/dashboard/referral/partner-funnel";
import { PartnerClientStatus } from "@/components/partner/dashboard/referral/partner-client-status";
import { PartnerWalletCard } from "@/components/partner/dashboard/referral/partner-wallet-card";
import { PartnerGrowthCoach } from "@/components/partner/dashboard/referral/partner-growth-coach";
import { PartnerEarningsTimeline } from "@/components/partner/dashboard/referral/partner-earnings-timeline";

// Preserved existing components (no mock data)
import { QuickShareWidget } from "@/components/partner/dashboard/referral/quick-share-widget";
import { GamificationProgress } from "@/components/partner/dashboard/referral/gamification-progress";

// ── Types ──────────────────────────────────────────────────────────────────

interface DashboardStats {
  activePlanName: string;
  daysRemaining: number;
  walletBalance: number;
  cashEarned: number;
  pendingCash: number;
  availableBalance: number;
  claimedCash: number;
  subscriptionMonths: number;
  earningsToday: number;
  referredCount: number;
  referralClicks: number;
  referralSignups: number;
  referralPurchases: number;
  activeClients: number;
  totalClients: number;
  conversionRate: number;
}

interface DashboardCharts {
  monthlyPerformance: { name: string; clicks: number; signups: number; purchases: number }[];
  funnelData: { name: string; value: number }[];
  clientStatusBreakdown: { status: string; count: number }[];
}

interface ActivityItem {
  type: string;
  title: string;
  subtitle: string;
  timestamp: string;
  badge: string;
}

interface DashboardData {
  profile: {
    fullName: string;
    email: string;
    referralCode: string;
    accountBalance: number;
    createdAt: string;
  };
  stats: DashboardStats;
  charts: DashboardCharts;
  feeds: { recentActivity: ActivityItem[] };
}

// ── Defaults ───────────────────────────────────────────────────────────────

const EMPTY_STATS: DashboardStats = {
  activePlanName: '', daysRemaining: 0, walletBalance: 0, cashEarned: 0,
  pendingCash: 0, availableBalance: 0, claimedCash: 0, subscriptionMonths: 0,
  earningsToday: 0, referredCount: 0, referralClicks: 0, referralSignups: 0,
  referralPurchases: 0, activeClients: 0, totalClients: 0, conversionRate: 0,
};

const EMPTY_CHARTS: DashboardCharts = {
  monthlyPerformance: [],
  funnelData: [],
  clientStatusBreakdown: [],
};

// ── Page ──────────────────────────────────────────────────────────────────

export default function PartnerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState<DashboardData>({
    profile: { fullName: '', email: '', referralCode: '', accountBalance: 0, createdAt: '' },
    stats: EMPTY_STATS,
    charts: EMPTY_CHARTS,
    feeds: { recentActivity: [] },
  });

  const fetchDashboardData = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/partner/dashboard");
      const json = await res.json();
      if (res.ok && json.success) {
        setData({
          profile: json.profile,
          stats: json.stats,
          charts: json.charts || EMPTY_CHARTS,
          feeds: json.feeds || { recentActivity: [] },
        });
      } else {
        throw new Error(json.error || "Failed to retrieve dashboard.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load dashboard.";
      toast.error(message);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => fetchDashboardData());
  }, [fetchDashboardData]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-40 gap-3 text-muted-foreground bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
        <span className="text-sm">Loading your dashboard...</span>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-40 text-center text-muted-foreground bg-background">
        <CreditCard className="h-12 w-12 opacity-30 text-destructive mb-3 animate-pulse" />
        <h4 className="font-semibold text-lg text-foreground">Failed to Load Dashboard</h4>
        <p className="text-sm max-w-sm mt-1">Please try refreshing or log back in.</p>
        <Button
          onClick={() => fetchDashboardData(true)}
          className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-card border border-border/15 text-foreground hover:bg-soft"
        >
          Try Again
        </Button>
      </div>
    );
  }

  const { profile, stats, charts, feeds } = data;

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 p-6 md:p-8 space-y-7 bg-background overflow-y-auto">

      {/* ── Section 1: Header ──────────────────────────────────────────── */}
      <PartnerHeader
        fullName={profile.fullName}
        referralPurchases={stats.referralPurchases}
        earningsToday={stats.earningsToday}
        onRefresh={() => fetchDashboardData(true)}
        isLoading={loading}
      />

      {/* ── Section 2: KPI Cards (8) ───────────────────────────────────── */}
      <PartnerKPICards stats={stats} />

      {/* ── Section 3: Main Grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column — Charts */}
        <div className="lg:col-span-8 space-y-6">
          {/* 3a. Real performance chart */}
          <PartnerPerformanceChart data={charts.monthlyPerformance} />

          {/* 3b + 3c: Funnel + Client Status side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PartnerFunnel data={charts.funnelData} />
            <PartnerClientStatus
              data={charts.clientStatusBreakdown}
              total={stats.totalClients}
            />
          </div>
        </div>

        {/* Right Column — Action Panels */}
        <div className="lg:col-span-4 space-y-6">
          {/* 3d. Wallet breakdown */}
          <PartnerWalletCard
            cashEarned={stats.cashEarned}
            pendingCash={stats.pendingCash}
            availableBalance={stats.availableBalance}
            claimedCash={stats.claimedCash}
          />

          {/* 3e. Quick Share Widget (preserved) */}
          <QuickShareWidget referralCode={profile.referralCode} />

          {/* 3f. Gamification Tier (preserved + enhanced) */}
          <GamificationProgress totalNetwork={stats.referredCount} />
        </div>
      </div>

      {/* ── Section 4: AI Growth Coach (3-card) ───────────────────────── */}
      <PartnerGrowthCoach stats={stats} />

      {/* ── Section 5: Earnings Timeline ──────────────────────────────── */}
      <PartnerEarningsTimeline recentActivity={feeds.recentActivity} />

    </div>
  );
}
