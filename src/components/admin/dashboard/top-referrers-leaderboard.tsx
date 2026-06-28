"use client";

import { Trophy, ArrowUpRight } from "lucide-react";
import Link from "next/link"

interface LeaderboardItem {
  referrerId: string;
  name: string;
  email: string;
  referralCode: string;
  earnings: number;
  conversionsCount: number;
  conversionRate: number;
}

interface TopReferrersLeaderboardProps {
  leaderboard: LeaderboardItem[];
}

export function TopReferrersLeaderboard({ leaderboard }: TopReferrersLeaderboardProps) {
  return (
    <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-3xl p-6 shadow-elegant space-y-4">
      <div className="flex justify-between items-center border-b border-border/10 pb-3">
        <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <Trophy className="h-4 w-4 text-brand" /> Top Referrers
        </h4>
        <Link href="/admin/clients" className="text-[10px] text-brand hover:underline flex items-center gap-0.5">
          Manage Clients <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
      
      {leaderboard.length === 0 ? (
        <div className="py-10 text-center text-xs text-muted-foreground italic">No earnings data loaded yet.</div>
      ) : (
        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border/20 scrollbar-track-transparent">
          {leaderboard.map((item, idx) => (
            <div key={item.referrerId || idx} className="flex items-center justify-between p-3.5 rounded-2xl border border-border/5 bg-soft/10 hover:bg-soft/20 transition-all">
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shadow-inner
                  ${idx === 0 ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 
                    idx === 1 ? 'bg-slate-300/20 text-slate-300 border border-slate-300/30' : 
                    idx === 2 ? 'bg-amber-700/20 text-amber-700 border border-amber-700/30' : 
                    'bg-soft/30 text-muted-foreground'}`}
                >
                  #{idx + 1}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="font-semibold text-foreground text-sm truncate">{item.name}</div>
                  <div className="text-[10px] font-mono text-brand font-medium truncate">{item.referralCode}</div>
                </div>
              </div>
              <div className="text-right space-y-1 shrink-0 pl-2">
                <div className="font-bold text-foreground text-sm">₹{item.earnings}</div>
                <div className="text-[10px] text-muted-foreground">{item.conversionsCount} sales ({item.conversionRate}%)</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
