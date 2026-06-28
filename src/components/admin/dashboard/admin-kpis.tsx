"use client";

import { DollarSign, Gift, Users, Target } from "lucide-react";

interface AdminKPIsProps {
  totalRevenue: number;
  totalRewardsPaid: number;
  activePromoters: number;
  conversionRate: number;
}

export function AdminKPIs({ totalRevenue, totalRewardsPaid, activePromoters, conversionRate }: AdminKPIsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 w-full">
      {/* Total Referral Revenue */}
      <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-2xl p-5 shadow-elegant flex items-center justify-between transition-all hover:bg-card/40">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Referral Revenue</p>
          <h3 className="text-2xl font-bold font-display text-emerald-400 mt-2">₹{totalRevenue}</h3>
        </div>
        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
          <DollarSign className="h-5 w-5" />
        </div>
      </div>

      {/* Rewards Paid */}
      <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-2xl p-5 shadow-elegant flex items-center justify-between transition-all hover:bg-card/40">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rewards Dist.</p>
          <h3 className="text-2xl font-bold font-display text-purple-400 mt-2">₹{totalRewardsPaid}</h3>
        </div>
        <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
          <Gift className="h-5 w-5" />
        </div>
      </div>

      {/* Active Promoters */}
      <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-2xl p-5 shadow-elegant flex items-center justify-between transition-all hover:bg-card/40">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Promoters</p>
          <h3 className="text-2xl font-bold font-display text-brand mt-2">{activePromoters}</h3>
        </div>
        <div className="h-10 w-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand shrink-0">
          <Users className="h-5 w-5" />
        </div>
      </div>

      {/* Global Conversion Rate */}
      <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-2xl p-5 shadow-elegant flex items-center justify-between transition-all hover:bg-card/40">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avg. Conv. Rate</p>
          <h3 className="text-2xl font-bold font-display text-amber-400 mt-2">{conversionRate}%</h3>
        </div>
        <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
          <Target className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
