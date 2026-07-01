"use client";

import { useState } from "react";
import {
  ComposedChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { TrendingUp } from "lucide-react";

interface MonthlyPoint {
  name: string;
  clicks: number;
  signups: number;
  purchases: number;
}

interface PartnerPerformanceChartProps {
  data: MonthlyPoint[];
}

const RANGES = ["3M", "6M"] as const;
type Range = typeof RANGES[number];

interface CustomTooltipPayloadItem {
  dataKey: string | number;
  name: string;
  value: number;
  fill?: string;
  color?: string;
  stroke?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: CustomTooltipPayloadItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border/20 rounded-xl px-3 py-2.5 shadow-card text-xs space-y-1">
      <p className="font-semibold text-foreground mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-2 w-2 rounded-full" style={{ background: p.fill || p.color || p.stroke }} />
            {p.name}
          </span>
          <span className="font-bold text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export function PartnerPerformanceChart({ data }: PartnerPerformanceChartProps) {
  const [range, setRange] = useState<Range>("6M");
  const displayData = range === "3M" ? data.slice(-3) : data;
  const hasData = displayData.some(d => d.clicks > 0 || d.signups > 0 || d.purchases > 0);

  return (
    <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-3xl p-6 shadow-elegant space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-brand" />
            Referral Performance
          </h3>
          <p className="text-[11px] text-muted-foreground">Monthly clicks, signups & purchases from your referrals</p>
        </div>
        <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-0.5">
          {RANGES.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                range === r ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <TrendingUp className="h-10 w-10 text-muted-foreground/20 mb-3" />
          <p className="text-xs text-muted-foreground">No referral activity yet.</p>
          <p className="text-[11px] text-muted-foreground/60 mt-1">Share your link to start seeing data here.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={230}>
          <ComposedChart data={displayData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border) / 0.3)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "oklch(0.556 0 0)", fontSize: 11 }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fill: "oklch(0.556 0 0)", fontSize: 11 }}
              axisLine={false} tickLine={false} width={28}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
              formatter={(v) => <span style={{ color: "oklch(0.708 0 0)", fontSize: "11px" }}>{v}</span>}
            />
            <Bar dataKey="clicks" name="Clicks" fill="#6366f1" radius={[3, 3, 0, 0]} opacity={0.7} />
            <Bar dataKey="signups" name="Signups" fill="#38bdf8" radius={[3, 3, 0, 0]} opacity={0.8} />
            <Bar dataKey="purchases" name="Purchases" fill="#34d399" radius={[3, 3, 0, 0]} opacity={0.85} />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
