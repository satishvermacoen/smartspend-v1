"use client";

import { BarChart3 } from "lucide-react";

interface GrowthMetricsProps {
  stats: {
    totalRevenue: number;
    activeClients: number;
    totalPartners: number;
    referralAttributionRate: number;
    monthlyInquiryGrowth: number;
    monthlySalesGrowth: number;
    conversionRate: number;
    totalPurchases: number;
    rewardsPaid: number;
  };
}

function formatCurrency(n: number): string {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

export function GrowthMetrics({ stats }: GrowthMetricsProps) {
  const avgClientLTV = stats.activeClients > 0
    ? Math.round(stats.totalRevenue / stats.activeClients) : 0;
  const cpa = stats.totalPurchases > 0
    ? Math.round(stats.rewardsPaid / stats.totalPurchases) : 0;
  const partnerROI = stats.rewardsPaid > 0
    ? parseFloat((stats.totalRevenue / stats.rewardsPaid).toFixed(1)) : 0;

  const metrics = [
    {
      label: "Avg. Client LTV",
      value: formatCurrency(avgClientLTV),
      description: "Revenue ÷ active clients",
      color: "text-emerald-400",
      good: avgClientLTV > 5000,
    },
    {
      label: "Inq. Growth (MoM)",
      value: `${stats.monthlyInquiryGrowth > 0 ? "+" : ""}${stats.monthlyInquiryGrowth}%`,
      description: "New clients this vs last month",
      color: stats.monthlyInquiryGrowth >= 0 ? "text-teal-400" : "text-rose-400",
      good: stats.monthlyInquiryGrowth > 0,
    },
    {
      label: "Sales Growth (MoM)",
      value: `${stats.monthlySalesGrowth > 0 ? "+" : ""}${stats.monthlySalesGrowth}%`,
      description: "Paid invoices this vs last month",
      color: stats.monthlySalesGrowth >= 0 ? "text-green-400" : "text-rose-400",
      good: stats.monthlySalesGrowth > 0,
    },
    {
      label: "Referral Attribution",
      value: `${stats.referralAttributionRate}%`,
      description: "Clients via referral channel",
      color: "text-brand",
      good: stats.referralAttributionRate > 30,
    },
    {
      label: "Cost per Acquisition",
      value: formatCurrency(cpa),
      description: "Rewards paid ÷ purchases",
      color: cpa < 500 ? "text-emerald-400" : "text-amber-400",
      good: cpa > 0 && cpa < 1000,
    },
    {
      label: "Partner ROI",
      value: partnerROI > 0 ? `${partnerROI}×` : "—",
      description: "Revenue generated per ₹ of reward",
      color: "text-violet-400",
      good: partnerROI > 3,
    },
  ];

  return (
    <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-3xl p-6 shadow-elegant space-y-4">
      <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
        <BarChart3 className="h-4 w-4 text-brand" />
        Business Health Metrics
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-soft/10 border border-border/5 rounded-2xl px-4 py-3 space-y-1.5 hover:bg-soft/20 transition-all"
          >
            <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">{m.label}</p>
            <p className={`text-lg font-bold font-display ${m.color}`}>{m.value}</p>
            <p className="text-[9px] text-muted-foreground leading-tight">{m.description}</p>
            <div className={`h-0.5 rounded-full mt-1.5 ${m.good ? "bg-emerald-500/40" : "bg-muted/40"}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
