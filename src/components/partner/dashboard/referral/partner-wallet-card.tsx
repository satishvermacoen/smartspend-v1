"use client";

import { Wallet, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PartnerWalletCardProps {
  cashEarned: number;
  pendingCash: number;
  availableBalance: number;
  claimedCash: number;
}

export function PartnerWalletCard({ cashEarned, pendingCash, availableBalance, claimedCash }: PartnerWalletCardProps) {
  const fmt = (n: number) =>
    n >= 1000 ? `₹${(n / 1000).toFixed(1)}K` : `₹${n}`;

  const total = cashEarned || 1; // avoid div by zero
  const availPct = Math.round((availableBalance / total) * 100);
  const pendingPct = Math.round((pendingCash / total) * 100);
  const claimedPct = Math.round((claimedCash / total) * 100);

  const segments = [
    { label: "Available", value: availableBalance, pct: availPct, color: "bg-emerald-400" },
    { label: "Pending",   value: pendingCash,      pct: pendingPct, color: "bg-amber-400" },
    { label: "Claimed",   value: claimedCash,      pct: claimedPct, color: "bg-sky-400" },
  ];

  return (
    <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-3xl p-6 shadow-elegant space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <Wallet className="h-4 w-4 text-emerald-400" /> Earnings Wallet
        </h3>
        <Link href="/partner/earning" className="text-[10px] text-brand hover:underline flex items-center gap-0.5 font-semibold">
          Manage <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Total */}
      <div className="text-center space-y-0.5">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Earned</p>
        <p className="text-3xl font-bold font-display text-violet-400">{fmt(cashEarned)}</p>
      </div>

      {/* Segmented progress bar */}
      <div className="h-3 w-full rounded-full overflow-hidden flex bg-muted/30">
        {segments.map(s => (
          s.pct > 0 && (
            <div
              key={s.label}
              className={`h-full transition-all duration-700 ${s.color}`}
              style={{ width: `${s.pct}%` }}
            />
          )
        ))}
      </div>

      {/* Breakdown labels */}
      <div className="grid grid-cols-3 gap-2">
        {segments.map(s => (
          <div key={s.label} className="text-center space-y-0.5">
            <div className="flex items-center justify-center gap-1">
              <span className={`h-2 w-2 rounded-full ${s.color}`} />
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
            </div>
            <p className="text-sm font-bold text-foreground">{fmt(s.value)}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      {availableBalance > 0 && (
        <Link
          href="/partner/referral"
          className="flex items-center justify-center gap-2 w-full h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all"
        >
          Withdraw {fmt(availableBalance)} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
