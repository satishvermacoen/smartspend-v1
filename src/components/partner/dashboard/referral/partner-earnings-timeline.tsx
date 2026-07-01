"use client";

import { useEffect, useState } from "react";
import { History, ShoppingCart, UserPlus, MousePointer2, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

interface HistoryItem {
  date: string | Date;
  type: string;
  details: string;
  amount: number;
  months: number;
  status: string;
}

interface PartnerEarningsTimelineProps {
  recentActivity?: { type: string; title: string; subtitle: string; timestamp: string | Date; badge: string }[];
}

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  purchase: { icon: <ShoppingCart className="h-3.5 w-3.5" />, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  signup:   { icon: <UserPlus className="h-3.5 w-3.5" />,    color: "text-sky-400",     bg: "bg-sky-500/10" },
  click:    { icon: <MousePointer2 className="h-3.5 w-3.5" />, color: "text-brand",     bg: "bg-brand/10" },
};

const BADGE_STYLES: Record<string, string> = {
  Purchase: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Signup:   "bg-sky-500/10 text-sky-400 border-sky-500/20",
  Click:    "bg-brand/10 text-brand border-brand/20",
};

function timeAgo(ts: string | Date | undefined): string {
  if (!ts) return "";
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function PartnerEarningsTimeline({ recentActivity = [] }: PartnerEarningsTimelineProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/partner/referral/history")
      .then(r => r.json())
      .then(d => {
        if (d.success) setHistory(d.history?.slice(0, 10) || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const STATUS_BADGE: Record<string, string> = {
    completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    pending:   "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  return (
    <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-3xl p-6 shadow-elegant space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <History className="h-4 w-4 text-brand" /> Earnings Timeline
        </h3>
        <Link href="/partner/clients" className="text-[10px] text-brand hover:underline flex items-center gap-0.5 font-semibold">
          Full History <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-brand" />
        </div>
      ) : history.length === 0 && recentActivity.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted-foreground italic">
          No earnings history yet. Start referring to earn rewards!
        </div>
      ) : history.length > 0 ? (
        /* Full ledger from /history endpoint */
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {history.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-soft/10 transition-all">
              <div className="shrink-0 mt-0.5">
                <div className="h-7 w-7 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <ShoppingCart className="h-3.5 w-3.5 text-emerald-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{item.type}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{item.details}</p>
              </div>
              <div className="text-right shrink-0 space-y-1">
                {item.amount > 0 && (
                  <p className="text-xs font-bold text-emerald-400">₹{item.amount}</p>
                )}
                {item.months > 0 && (
                  <p className="text-[10px] text-violet-400 font-semibold">+{item.months}mo</p>
                )}
                <span className={`inline-flex text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${STATUS_BADGE[item.status] || "bg-muted/20 text-muted-foreground border-border/20"}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Fallback: recent activity from dashboard feed */
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {recentActivity.map((item, idx) => {
            const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.click;
            return (
              <div key={idx} className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-soft/10 transition-all">
                <div className={`h-7 w-7 rounded-xl ${cfg.bg} ${cfg.color} flex items-center justify-center shrink-0 mt-0.5`}>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{item.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{item.subtitle}</p>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <p className="text-[9px] text-muted-foreground">{timeAgo(item.timestamp)}</p>
                  <span className={`inline-flex text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${BADGE_STYLES[item.badge] || ""}`}>
                    {item.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
