"use client";

import {
  IndianRupee, Users, Target, Clock, MousePointer2,
  UserCheck, CalendarDays, Gift
} from "lucide-react";

interface PartnerKPICardsProps {
  stats: {
    availableBalance: number;
    cashEarned: number;
    referredCount: number;
    activeClients: number;
    conversionRate: number;
    pendingCash: number;
    referralClicks: number;
    subscriptionMonths: number;
  };
}

interface CardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  valueColor: string;
  hint: string;
}

function KPICard({ label, value, icon, iconBg, valueColor, hint }: CardProps) {
  return (
    <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-2xl p-5 shadow-elegant flex flex-col gap-3 hover:bg-card/40 transition-all group">
      <div className="flex items-start justify-between">
        <div className={`h-9 w-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
        <h3 className={`text-xl font-bold font-display mt-1 ${valueColor}`}>{value}</h3>
        <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{hint}</p>
      </div>
    </div>
  );
}

export function PartnerKPICards({ stats }: PartnerKPICardsProps) {
  const fmt = (n: number) =>
    n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` :
    n >= 1000   ? `₹${(n / 1000).toFixed(1)}K`   : `₹${n}`;

  const cards: CardProps[] = [
    {
      label: "Available Balance",
      value: fmt(stats.availableBalance),
      icon: <IndianRupee className="h-4 w-4 text-emerald-400" />,
      iconBg: "bg-emerald-500/10",
      valueColor: "text-emerald-400",
      hint: "Ready to withdraw",
    },
    {
      label: "Total Earned",
      value: fmt(stats.cashEarned),
      icon: <Gift className="h-4 w-4 text-violet-400" />,
      iconBg: "bg-violet-500/10",
      valueColor: "text-violet-400",
      hint: "Lifetime cash rewards",
    },
    {
      label: "Referred Clients",
      value: stats.referredCount.toString(),
      icon: <Users className="h-4 w-4 text-sky-400" />,
      iconBg: "bg-sky-500/10",
      valueColor: "text-sky-400",
      hint: "All referred users",
    },
    {
      label: "Active Clients",
      value: stats.activeClients.toString(),
      icon: <UserCheck className="h-4 w-4 text-teal-400" />,
      iconBg: "bg-teal-500/10",
      valueColor: "text-teal-400",
      hint: "Purchased a plan",
    },
    {
      label: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      icon: <Target className="h-4 w-4 text-amber-400" />,
      iconBg: "bg-amber-500/10",
      valueColor: "text-amber-400",
      hint: "Clicks → purchases",
    },
    {
      label: "Pending Rewards",
      value: fmt(stats.pendingCash),
      icon: <Clock className="h-4 w-4 text-orange-400" />,
      iconBg: "bg-orange-500/10",
      valueColor: stats.pendingCash > 0 ? "text-orange-400" : "text-muted-foreground",
      hint: "Awaiting processing",
    },
    {
      label: "Total Clicks",
      value: stats.referralClicks.toString(),
      icon: <MousePointer2 className="h-4 w-4 text-brand" />,
      iconBg: "bg-brand/10",
      valueColor: "text-brand",
      hint: "Link interactions",
    },
    {
      label: "Subscription Months",
      value: stats.subscriptionMonths > 0 ? `${stats.subscriptionMonths} mo` : "0",
      icon: <CalendarDays className="h-4 w-4 text-rose-400" />,
      iconBg: "bg-rose-500/10",
      valueColor: "text-rose-400",
      hint: "Free months earned",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-3 w-full">
      {cards.map((card) => (
        <KPICard key={card.label} {...card} />
      ))}
    </div>
  );
}
