"use client";

import { Activity, CheckCircle2, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface RecentConversion {
  _id: string;
  referralCode: string;
  purchasedAt: string;
  amount: number;
  referrerReward: number;
  referrerRewardType: 'cash' | 'subscription';
  referrerName: string;
  prospectName: string;
}

interface AdminRecentActivityProps {
  conversions: RecentConversion[];
}

export function AdminRecentActivity({ conversions }: AdminRecentActivityProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-3xl p-6 shadow-elegant space-y-4">
      <div className="flex justify-between items-center border-b border-border/10 pb-3">
        <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <Activity className="h-4 w-4 text-brand" /> Global Feed
        </h4>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[9px] bg-brand/10 text-brand border-brand/20 font-medium px-2 py-0">Live</Badge>
          <Link href="/admin/clients" className="text-[10px] text-brand hover:underline flex items-center gap-0.5">
            Logs <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border/20 scrollbar-track-transparent">
        {conversions.length === 0 ? (
          <div className="text-center text-xs text-muted-foreground py-10 italic">No recent conversions detected.</div>
        ) : (
          conversions.map((conv) => (
            <div key={conv._id} className="flex gap-3 items-start border-b border-border/5 pb-3 last:border-0 last:pb-0">
              <div className="mt-0.5 h-6 w-6 rounded-full flex items-center justify-center shrink-0 bg-emerald-500/10">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <p className="text-xs text-foreground leading-snug">
                  <span className="font-semibold">{conv.prospectName}</span> purchased a plan via <span className="font-semibold text-brand">{conv.referrerName}</span>.
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[10px] text-muted-foreground font-mono">{formatDate(conv.purchasedAt)}</span>
                  <Badge variant="outline" className="text-[9px] bg-purple-500/10 text-purple-400 border-purple-500/20 px-1.5 py-0">
                    Reward: {conv.referrerRewardType === 'cash' ? `₹${conv.referrerReward}` : `${conv.referrerReward} Months`}
                  </Badge>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
