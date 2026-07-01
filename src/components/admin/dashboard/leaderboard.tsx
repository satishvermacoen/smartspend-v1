"use client";

import { Trophy, ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";

interface LeaderboardItem {
  referrerId: string;
  name: string;
  email: string;
  referralCode: string;
  earnings: number;
  conversionsCount: number;
  conversionRate: number;
}

interface LeaderboardProps {
  leaderboard: LeaderboardItem[];
}

const RANK_STYLES = [
  "bg-amber-400/20 text-amber-400 border border-amber-400/30",
  "bg-slate-400/20 text-slate-400 border border-slate-400/30",
  "bg-orange-700/20 text-orange-600 border border-orange-600/30",
];

export function Leaderboard({ leaderboard }: LeaderboardProps) {
  return (
    <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-3xl p-6 shadow-elegant space-y-4">
      <div className="flex justify-between items-center border-b border-border/10 pb-3">
        <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <Trophy className="h-4 w-4 text-amber-400" />
          Top Referrers
        </h4>
        <Link href="/admin/partner" className="text-[10px] text-brand hover:underline flex items-center gap-0.5 font-semibold">
          All Partners <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      {leaderboard.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted-foreground italic">
          No partner earnings data yet.
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((item, idx) => (
            <div
              key={item.referrerId || idx}
              className="flex items-center gap-3 p-3 rounded-2xl border border-border/5 bg-soft/10 hover:bg-soft/20 transition-all"
            >
              {/* Rank badge */}
              <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                RANK_STYLES[idx] || "bg-muted/30 text-muted-foreground border border-border/20"
              }`}>
                {idx < 3 ? ["🥇", "🥈", "🥉"][idx] : `#${idx + 1}`}
              </div>

              <div className="min-w-0 flex-1">
                <div className="font-semibold text-foreground text-xs truncate">{item.name || "Partner"}</div>
                <div className="text-[9px] font-mono text-brand/80 font-medium">{item.referralCode}</div>
              </div>

              <div className="text-right shrink-0">
                <div className="font-bold text-foreground text-sm">₹{item.earnings.toLocaleString("en-IN")}</div>
                <div className="text-[9px] text-muted-foreground">
                  {item.conversionsCount} sales · {item.conversionRate}%
                </div>
              </div>

              {/* Mini trend indicator */}
              <div className="shrink-0">
                {item.conversionRate > 20
                  ? <TrendingUp className="h-3 w-3 text-emerald-400" />
                  : <TrendingDown className="h-3 w-3 text-muted-foreground/40" />
                }
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
