"use client";

import {
  TrendingUp, TrendingDown, IndianRupee, ClipboardList,
  ShoppingCart, Target, Users, Tag, Bell, Gift, Minus
} from "lucide-react";
import { BarChart, Bar, ResponsiveContainer } from "recharts";

interface KPICardsProps {
  stats: {
    totalRevenue: number;
    totalInquiries: number;
    totalPurchases: number;
    conversionRate: number;
    totalPartners: number;
    monthlyInquiryGrowth: number;
    monthlySalesGrowth: number;
    activeCodes: number;
    rewardsPaid: number;
    pendingEnquiries: number;
  };
  trends: {
    inquiries: number[];
    purchases: number[];
    revenue: number[];
  };
}

interface SparklineProps {
  data: number[];
  color: string;
}

function Sparkline({ data, color }: SparklineProps) {
  const chartData = data.map((v, i) => ({ v, i }));
  return (
    <ResponsiveContainer width="100%" height={36}>
      <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barSize={4}>
        <Bar dataKey="v" fill={color} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface DeltaBadgeProps {
  value: number;
  label?: string;
}

function DeltaBadge({ value, label }: DeltaBadgeProps) {
  if (value === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-muted-foreground px-1.5 py-0.5 bg-muted/50 rounded-full">
        <Minus className="h-2.5 w-2.5" /> {label || "No change"}
      </span>
    );
  }
  const isUp = value > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
      isUp ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
    }`}>
      {isUp ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
      {Math.abs(value)}% {label || "MoM"}
    </span>
  );
}

interface CardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  valueColor: string;
  delta?: number;
  deltaLabel?: string;
  sparklineData?: number[];
  sparklineColor?: string;
  subtext?: string;
}

function KPICard({ label, value, icon, iconBg, valueColor, delta, deltaLabel, sparklineData, sparklineColor, subtext }: CardProps) {
  return (
    <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-2xl p-4 shadow-elegant flex flex-col gap-3 hover:bg-card/40 transition-all group">
      <div className="flex items-start justify-between">
        <div className={`h-9 w-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        {delta !== undefined && <DeltaBadge value={delta} label={deltaLabel} />}
      </div>

      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
        <h3 className={`text-xl font-bold font-display mt-1 ${valueColor}`}>{value}</h3>
        {subtext && <p className="text-[10px] text-muted-foreground mt-0.5">{subtext}</p>}
      </div>

      {sparklineData && sparklineData.length > 0 && (
        <div className="opacity-70 group-hover:opacity-100 transition-opacity">
          <Sparkline data={sparklineData} color={sparklineColor || "#6366f1"} />
        </div>
      )}
    </div>
  );
}

export function KPICards({ stats, trends }: KPICardsProps) {
  const formatCurrency = (n: number) =>
    n >= 100000
      ? `₹${(n / 100000).toFixed(1)}L`
      : n >= 1000
      ? `₹${(n / 1000).toFixed(1)}K`
      : `₹${n}`;

  const cards: CardProps[] = [
    {
      label: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: <IndianRupee className="h-4 w-4 text-emerald-400" />,
      iconBg: "bg-emerald-500/10",
      valueColor: "text-emerald-400",
      sparklineData: trends.revenue,
      sparklineColor: "#34d399",
      subtext: "All paid invoices",
    },
    {
      label: "Total Inquiries",
      value: stats.totalInquiries.toLocaleString("en-IN"),
      icon: <ClipboardList className="h-4 w-4 text-sky-400" />,
      iconBg: "bg-sky-500/10",
      valueColor: "text-sky-400",
      delta: stats.monthlyInquiryGrowth,
      sparklineData: trends.inquiries,
      sparklineColor: "#38bdf8",
      subtext: "All client records",
    },
    {
      label: "Total Purchases",
      value: stats.totalPurchases.toLocaleString("en-IN"),
      icon: <ShoppingCart className="h-4 w-4 text-violet-400" />,
      iconBg: "bg-violet-500/10",
      valueColor: "text-violet-400",
      delta: stats.monthlySalesGrowth,
      sparklineData: trends.purchases,
      sparklineColor: "#a78bfa",
      subtext: "Paid invoices",
    },
    {
      label: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      icon: <Target className="h-4 w-4 text-amber-400" />,
      iconBg: "bg-amber-500/10",
      valueColor: "text-amber-400",
      subtext: "Inquiries → Purchases",
    },
    {
      label: "Partner Network",
      value: stats.totalPartners.toLocaleString("en-IN"),
      icon: <Users className="h-4 w-4 text-brand" />,
      iconBg: "bg-brand/10",
      valueColor: "text-brand",
      subtext: "Referral partners",
    },
    {
      label: "Monthly Inq. Growth",
      value: `${stats.monthlyInquiryGrowth > 0 ? "+" : ""}${stats.monthlyInquiryGrowth}%`,
      icon: <TrendingUp className="h-4 w-4 text-teal-400" />,
      iconBg: "bg-teal-500/10",
      valueColor: stats.monthlyInquiryGrowth >= 0 ? "text-teal-400" : "text-rose-400",
      subtext: "vs last month",
    },
    {
      label: "Monthly Sales Growth",
      value: `${stats.monthlySalesGrowth > 0 ? "+" : ""}${stats.monthlySalesGrowth}%`,
      icon: <TrendingUp className="h-4 w-4 text-green-400" />,
      iconBg: "bg-green-500/10",
      valueColor: stats.monthlySalesGrowth >= 0 ? "text-green-400" : "text-rose-400",
      subtext: "vs last month",
    },
    {
      label: "Active Codes",
      value: stats.activeCodes.toLocaleString("en-IN"),
      icon: <Tag className="h-4 w-4 text-cyan-400" />,
      iconBg: "bg-cyan-500/10",
      valueColor: "text-cyan-400",
      subtext: "Referral codes live",
    },
    {
      label: "Rewards Paid",
      value: formatCurrency(stats.rewardsPaid),
      icon: <Gift className="h-4 w-4 text-rose-400" />,
      iconBg: "bg-rose-500/10",
      valueColor: "text-rose-400",
      subtext: "Cash to partners",
    },
    {
      label: "Open Enquiries",
      value: stats.pendingEnquiries.toLocaleString("en-IN"),
      icon: <Bell className="h-4 w-4 text-orange-400" />,
      iconBg: "bg-orange-500/10",
      valueColor: stats.pendingEnquiries > 5 ? "text-orange-400" : "text-foreground",
      subtext: "Awaiting follow-up",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
      {cards.map((card) => (
        <KPICard key={card.label} {...card} />
      ))}
    </div>
  );
}
