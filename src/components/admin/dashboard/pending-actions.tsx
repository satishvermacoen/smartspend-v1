"use client";

import { Bell, FileText, Gift, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PendingActionsProps {
  pendingEnquiries: number;
  pendingInvoices: number;
  pendingRewardsDocs: number;
  newClientsToday: number;
}

interface ActionItem {
  icon: React.ReactNode;
  label: string;
  count: number;
  href: string;
  severity: "critical" | "warning" | "info" | "success";
  description: string;
}

const SEVERITY_STYLES = {
  critical: "bg-rose-500/10 border-rose-500/20 text-rose-400",
  warning:  "bg-amber-500/10 border-amber-500/20 text-amber-400",
  info:     "bg-sky-500/10 border-sky-500/20 text-sky-400",
  success:  "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
};

export function PendingActions({ pendingEnquiries, pendingInvoices, pendingRewardsDocs, newClientsToday }: PendingActionsProps) {
  const items: ActionItem[] = [
    {
      icon: <Bell className="h-3.5 w-3.5" />,
      label: "Uncontacted Enquiries",
      count: pendingEnquiries,
      href: "/admin/enquiry",
      severity: pendingEnquiries > 5 ? "critical" : pendingEnquiries > 0 ? "warning" : "success",
      description: pendingEnquiries > 0 ? "Respond within 24h for best results" : "All enquiries addressed",
    },
    {
      icon: <FileText className="h-3.5 w-3.5" />,
      label: "Pending Invoices",
      count: pendingInvoices,
      href: "/admin/clients",
      severity: pendingInvoices > 0 ? "warning" : "success",
      description: pendingInvoices > 0 ? "Follow up to collect payment" : "No outstanding invoices",
    },
    {
      icon: <Gift className="h-3.5 w-3.5" />,
      label: "Reward Redemptions",
      count: pendingRewardsDocs,
      href: "/admin/partner",
      severity: pendingRewardsDocs > 0 ? "info" : "success",
      description: pendingRewardsDocs > 0 ? "Partners awaiting payout" : "All rewards settled",
    },
    {
      icon: <Users className="h-3.5 w-3.5" />,
      label: "New Clients Today",
      count: newClientsToday,
      href: "/admin/clients",
      severity: "success",
      description: newClientsToday > 0 ? "Fresh leads to follow up" : "No new clients today",
    },
  ];

  return (
    <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-3xl p-6 shadow-elegant space-y-4">
      <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
        <Bell className="h-4 w-4 text-orange-400" />
        Action Items
      </h4>

      <div className="space-y-2.5">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 p-3 rounded-2xl border transition-all hover:opacity-90 ${SEVERITY_STYLES[item.severity]}`}
          >
            <div className="shrink-0">{item.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-foreground leading-tight">{item.label}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 truncate">{item.description}</div>
            </div>
            <div className="shrink-0 flex items-center gap-1.5">
              <span className="text-base font-bold text-foreground">{item.count}</span>
              <ArrowRight className="h-3 w-3 opacity-60" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
