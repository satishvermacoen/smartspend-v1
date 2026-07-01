"use client";

import { RefreshCw, UserPlus, PlusCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  pendingEnquiries: number;
  pendingInvoices: number;
}

export function DashboardHeader({ onRefresh, isLoading, pendingEnquiries, pendingInvoices }: DashboardHeaderProps) {
  const hasPendingItems = pendingEnquiries > 0 || pendingInvoices > 0;
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold font-display text-foreground tracking-tight">
            Admin Dashboard
          </h1>
          {/* System status badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            hasPendingItems
              ? "bg-amber-500/10 border-amber-500/25 text-amber-500"
              : "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
          }`}>
            {hasPendingItems
              ? <><AlertTriangle className="h-2.5 w-2.5" /> Needs Attention</>
              : <><CheckCircle2 className="h-2.5 w-2.5" /> All Systems Go</>
            }
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{dateStr}</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-3 text-xs gap-1.5 rounded-xl border-border/20 bg-card/30 hover:bg-card/60"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-3 text-xs gap-1.5 rounded-xl border-border/20 bg-card/30 hover:bg-card/60"
          asChild
        >
          <Link href="/admin/clients">
            <PlusCircle className="h-3.5 w-3.5" />
            Add Client
          </Link>
        </Button>
        <Button
          size="sm"
          className="h-8 px-3 text-xs gap-1.5 rounded-xl bg-gradient-brand text-white hover:opacity-90"
          asChild
        >
          <Link href="/admin/partner">
            <UserPlus className="h-3.5 w-3.5" />
            Add Partner
          </Link>
        </Button>
      </div>
    </div>
  );
}
