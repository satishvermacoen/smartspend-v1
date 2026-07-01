"use client";

import { BrainCircuit, AlertTriangle, CheckCircle2, TrendingDown, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

interface InsightsPanelProps {
  stats: {
    conversionRate: number;
    pendingEnquiries: number;
    totalPartners: number;
    totalInquiries: number;
    referredClients: number;
    monthlyInquiryGrowth: number;
    monthlySalesGrowth: number;
    rewardsPaid: number;
    totalRevenue: number;
  };
}

interface Insight {
  type: "success" | "warning" | "critical" | "info";
  title: string;
  description: string;
  action: string;
  href: string;
}

function getInsights(stats: InsightsPanelProps["stats"]): Insight[] {
  const insights: Insight[] = [];

  const dormantRate = stats.totalPartners > 0
    ? ((stats.totalPartners - (stats.totalInquiries > 0 ? Math.floor(stats.referredClients / stats.totalPartners) : 0)) / stats.totalPartners) * 100
    : 0;

  // Insight 1 — Conversion Rate
  if (stats.conversionRate < 10) {
    insights.push({
      type: "critical",
      title: "Low Conversion Rate",
      description: `Only ${stats.conversionRate}% of inquiries convert to purchases (target: >15%). Identify bottlenecks in your sales process.`,
      action: "Review Enquiries",
      href: "/admin/enquiry",
    });
  } else if (stats.conversionRate >= 25) {
    insights.push({
      type: "success",
      title: "Strong Conversion Rate",
      description: `${stats.conversionRate}% inquiry-to-purchase conversion is excellent. Scale your inquiry channels to grow revenue further.`,
      action: "View Clients",
      href: "/admin/clients",
    });
  }

  // Insight 2 — Uncontacted enquiries
  if (stats.pendingEnquiries > 5) {
    insights.push({
      type: "critical",
      title: "Lead Response Backlog",
      description: `${stats.pendingEnquiries} enquiries are pending contact. Leads contacted within 1 hour convert 7× more. Act now.`,
      action: "Contact Leads",
      href: "/admin/enquiry",
    });
  }

  // Insight 3 — Monthly growth divergence
  if (stats.monthlyInquiryGrowth > 15 && stats.monthlySalesGrowth < 0) {
    insights.push({
      type: "warning",
      title: "Inquiry Growth, Sales Dip",
      description: `Inquiries are up ${stats.monthlyInquiryGrowth}% but sales dropped ${Math.abs(stats.monthlySalesGrowth)}%. Your pipeline is filling but not closing — revisit your follow-up process.`,
      action: "View Pipeline",
      href: "/admin/clients?status=contacted",
    });
  }

  // Insight 4 — Referral attribution low
  const attributionRate = stats.totalInquiries > 0
    ? (stats.referredClients / stats.totalInquiries) * 100 : 0;
  if (stats.totalPartners > 3 && attributionRate < 20) {
    insights.push({
      type: "info",
      title: "Referral Program Underperforming",
      description: `Only ${attributionRate.toFixed(0)}% of clients came via referral with ${stats.totalPartners} active partners. Engage dormant partners with a reward incentive email.`,
      action: "Manage Partners",
      href: "/admin/partner",
    });
  }

  // Insight 5 — Healthy state
  if (insights.length === 0) {
    insights.push({
      type: "success",
      title: "Business in Great Shape",
      description: `Conversion rate at ${stats.conversionRate}%, no urgent pending items. Keep momentum — consider a referral bonus campaign to accelerate growth.`,
      action: "View Analytics",
      href: "/admin/partner",
    });
  }

  // Revenue vs rewards check
  const roiRatio = stats.rewardsPaid > 0 ? stats.totalRevenue / stats.rewardsPaid : 0;
  if (stats.rewardsPaid > 0 && roiRatio > 5) {
    insights.push({
      type: "info",
      title: "High Partner ROI",
      description: `Every ₹1 spent on rewards generates ₹${roiRatio.toFixed(1)} in revenue. Consider increasing reward amounts to attract more partners.`,
      action: "Referral Settings",
      href: "/admin/partner",
    });
  }

  return insights.slice(0, 3);
}

const TYPE_STYLES = {
  success:  { border: "border-emerald-500/20 bg-emerald-500/8", icon: <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />, badge: "bg-emerald-500/15 text-emerald-400" },
  warning:  { border: "border-amber-500/20 bg-amber-500/8",   icon: <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />,   badge: "bg-amber-500/15 text-amber-400" },
  critical: { border: "border-rose-500/20 bg-rose-500/8",     icon: <TrendingDown className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />,     badge: "bg-rose-500/15 text-rose-400" },
  info:     { border: "border-brand/20 bg-brand/8",            icon: <Zap className="h-4 w-4 text-brand shrink-0 mt-0.5" />,                  badge: "bg-brand/15 text-brand" },
};

export function InsightsPanel({ stats }: InsightsPanelProps) {
  const insights = getInsights(stats);

  return (
    <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-3xl p-6 shadow-elegant space-y-4">
      <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
        <BrainCircuit className="h-4 w-4 text-brand" />
        AI Strategy Intelligence
        <span className="ml-auto text-[9px] font-normal text-muted-foreground">Auto-updated on refresh</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, idx) => {
          const style = TYPE_STYLES[insight.type];
          return (
            <div
              key={idx}
              className={`border rounded-2xl p-4 space-y-3 transition-all ${style.border}`}
            >
              <div className="flex items-start gap-2.5">
                {style.icon}
                <div className="space-y-1 flex-1">
                  <h5 className="font-bold text-xs text-foreground uppercase tracking-wider">{insight.title}</h5>
                  <p className="text-[11px] text-foreground/80 leading-relaxed">{insight.description}</p>
                </div>
              </div>
              <Link
                href={insight.href}
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-opacity hover:opacity-80 ${style.badge}`}
              >
                {insight.action} <ArrowRight className="h-2.5 w-2.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
