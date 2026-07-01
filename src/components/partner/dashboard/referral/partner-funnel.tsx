"use client";

import { Filter } from "lucide-react";

interface FunnelPoint { name: string; value: number }
interface PartnerFunnelProps { data: FunnelPoint[] }

const COLORS = ["#6366f1", "#38bdf8", "#34d399"];

export function PartnerFunnel({ data }: PartnerFunnelProps) {
  const maxValue = data[0]?.value || 1;
  const hasData = data.some(d => d.value > 0);

  return (
    <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-3xl p-6 shadow-elegant space-y-4">
      <div className="space-y-0.5">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <Filter className="h-4 w-4 text-brand" /> Referral Funnel
        </h3>
        <p className="text-[11px] text-muted-foreground">How visitors progress through your referral pipeline</p>
      </div>

      {!hasData ? (
        <div className="flex items-center justify-center py-10 text-xs text-muted-foreground italic">
          Share your link to see funnel data
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((stage, idx) => {
            const prevValue = idx > 0 ? data[idx - 1].value : stage.value;
            const dropOff = idx > 0 && prevValue > 0
              ? Math.round(((prevValue - stage.value) / prevValue) * 100) : 0;
            const barWidth = maxValue > 0 ? (stage.value / maxValue) * 100 : 0;

            return (
              <div key={stage.name} className="space-y-1.5">
                {idx > 0 && dropOff > 0 && (
                  <div className="flex items-center justify-end pr-1">
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                      dropOff > 60 ? "text-rose-400 bg-rose-500/10" :
                      dropOff > 30 ? "text-amber-400 bg-amber-500/10" :
                      "text-emerald-400 bg-emerald-500/10"
                    }`}>
                      ↓ {dropOff}% drop-off
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-16 text-[10px] font-semibold text-muted-foreground text-right shrink-0">{stage.name}</div>
                  <div className="flex-1 relative h-7 bg-muted/20 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(barWidth, 2)}%`, background: COLORS[idx % COLORS.length], opacity: 0.85 }}
                    />
                  </div>
                  <div className="w-8 text-right text-xs font-bold text-foreground shrink-0">{stage.value}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
