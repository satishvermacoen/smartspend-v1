"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, ResponsiveContainer
} from "recharts";
import { Award } from "lucide-react";

interface SubscriptionData {
  name: string;
  count: number;
  revenue: number;
  avgDeal: number;
}

interface TopSubscriptionsChartProps {
  data: SubscriptionData[];
}

const COLORS = ["#6366f1", "#34d399", "#f59e0b", "#38bdf8", "#a78bfa", "#fb923c"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload as SubscriptionData;
  return (
    <div className="bg-card border border-border/20 rounded-xl px-3 py-2.5 shadow-card text-xs space-y-1.5">
      <p className="font-bold text-foreground text-sm">{label}</p>
      <div className="flex justify-between gap-6">
        <span className="text-muted-foreground">Volume</span>
        <span className="font-semibold text-foreground">{d.count} sold</span>
      </div>
      <div className="flex justify-between gap-6">
        <span className="text-muted-foreground">Revenue</span>
        <span className="font-semibold text-emerald-400">₹{d.revenue.toLocaleString("en-IN")}</span>
      </div>
      <div className="flex justify-between gap-6">
        <span className="text-muted-foreground">Avg Deal</span>
        <span className="font-semibold text-amber-400">₹{d.avgDeal.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
};

export function TopSubscriptionsChart({ data }: TopSubscriptionsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-3xl p-6 shadow-elegant space-y-5">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Award className="h-4 w-4 text-amber-400" />
            Most Purchased Subscriptions
          </h3>
          <p className="text-[11px] text-muted-foreground">Top services by revenue</p>
        </div>
        <div className="flex items-center justify-center py-12 text-xs text-muted-foreground italic">
          No invoice data yet
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-3xl p-6 shadow-elegant space-y-5">
      <div className="space-y-0.5">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <Award className="h-4 w-4 text-amber-400" />
          Most Purchased Subscriptions
        </h3>
        <p className="text-[11px] text-muted-foreground">Top services by revenue generated</p>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
          barSize={14}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border) / 0.3)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: "oklch(0.556 0 0)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}K` : `₹${v}`}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "oklch(0.556 0 0)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={100}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "oklch(0.556 0 0 / 0.05)" }} />
          <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Rank labels */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/10">
        {data.slice(0, 4).map((d, i) => (
          <div key={d.name} className="flex items-center gap-2 text-[10px]">
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="text-muted-foreground truncate">{d.name}</span>
            <span className="ml-auto font-semibold text-foreground shrink-0">{d.count}x</span>
          </div>
        ))}
      </div>
    </div>
  );
}
