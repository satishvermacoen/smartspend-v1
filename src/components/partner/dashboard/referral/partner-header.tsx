"use client";

import { Trophy, Star, ShieldCheck, RefreshCw, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PartnerHeaderProps {
  fullName: string;
  referralPurchases: number;
  earningsToday: number;
  onRefresh: () => void;
  isLoading: boolean;
}

const TIERS = [
  { name: "Starter", min: 0,  max: 4,  icon: Star,        color: "text-sky-400",    bg: "bg-sky-500/10",    border: "border-sky-500/20" },
  { name: "Pro",     min: 5,  max: 19, icon: ShieldCheck,  color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/20" },
  { name: "Elite",   min: 20, max: Infinity, icon: Trophy, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
];

export function PartnerHeader({ fullName, referralPurchases, earningsToday, onRefresh, isLoading }: PartnerHeaderProps) {
  const tier = TIERS.find(t => referralPurchases >= t.min && referralPurchases <= t.max) || TIERS[0];
  const TierIcon = tier.icon;

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";
  const firstName = fullName?.split(" ")[0] || "Partner";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold font-display text-foreground tracking-tight">
            {greeting}, {firstName} 👋
          </h1>
          {/* Tier Badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${tier.bg} ${tier.border} ${tier.color}`}>
            <TierIcon className="h-2.5 w-2.5" />
            {tier.name} Partner
          </div>
          {/* Earnings today */}
          {earningsToday > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
              <IndianRupee className="h-2.5 w-2.5" />
              +₹{earningsToday} today
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {now.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <Button
        onClick={onRefresh}
        disabled={isLoading}
        className="inline-flex items-center gap-2 rounded-xl border border-border/15 bg-card/40 backdrop-blur-md px-4 py-2 text-sm font-medium text-foreground hover:bg-card/70 transition-all shrink-0 self-end sm:self-auto"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        Refresh
      </Button>
    </div>
  );
}
