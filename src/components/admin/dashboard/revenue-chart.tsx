"use client";

import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { TrendingUp } from "lucide-react";

interface RevenueDataPoint {
  name: string;
  totalRevenue: number;
  referralRevenue: number;
  directRevenue: number;
}

interface RevenueChartProps {
  data: RevenueDataPoint[];
}

const RANGES = ["3M", "6M"] as const;
type Range = typeof RANGES[number];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border/20 rounded-xl px-3 py-2.5 shadow-card text-xs space-y-1">
      <p className="font-semibold text-foreground mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-2 w-2 rounded-full" style={{ background: p.fill || p.color }} />
            {p.name}
          </span>
          <span className="font-bold text-foreground">
            ₹{(p.value as number).toLocaleString("en-IN")}
          </span>
        </div>
      ))}
    </div>
  );
};

export function RevenueChart({ data }: RevenueChartProps) {
  const [range, setRange] = useState<Range>("6M");
  const displayData = range === "3M" ? data.slice(-3) : data;

  return (
    <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-3xl p-6 shadow-elegant space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            Revenue Overview
          </h3>
          <p className="text-[11px] text-muted-foreground">Direct vs Referral-attributed revenue</p>
        </div>
        <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-0.5">
          {RANGES.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                range === r
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={displayData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradDirect" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradReferral" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#34d399" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border) / 0.3)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "oklch(0.556 0 0)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "oklch(0.556 0 0)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}K` : `₹${v}`}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
            formatter={(value) => <span style={{ color: "oklch(0.708 0 0)", fontSize: "11px" }}>{value}</span>}
          />
          <Area
            type="monotone"
            dataKey="directRevenue"
            name="Direct Revenue"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#gradDirect)"
            dot={false}
            activeDot={{ r: 4, fill: "#6366f1" }}
          />
          <Area
            type="monotone"
            dataKey="referralRevenue"
            name="Referral Revenue"
            stroke="#34d399"
            strokeWidth={2}
            fill="url(#gradReferral)"
            dot={false}
            activeDot={{ r: 4, fill: "#34d399" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
