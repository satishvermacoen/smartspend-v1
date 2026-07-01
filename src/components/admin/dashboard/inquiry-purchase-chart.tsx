"use client";

import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { GitCompare } from "lucide-react";

interface DataPoint {
  name: string;
  inquiries: number;
  purchases: number;
  conversionRate: number;
}

interface InquiryPurchaseChartProps {
  data: DataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border/20 rounded-xl px-3 py-2.5 shadow-card text-xs space-y-1">
      <p className="font-semibold text-foreground mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-2 w-2 rounded-full" style={{ background: p.fill || p.color || p.stroke }} />
            {p.name}
          </span>
          <span className="font-bold text-foreground">
            {p.dataKey === "conversionRate" ? `${p.value}%` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export function InquiryPurchaseChart({ data }: InquiryPurchaseChartProps) {
  return (
    <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-3xl p-6 shadow-elegant space-y-5">
      <div className="space-y-0.5">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <GitCompare className="h-4 w-4 text-sky-400" />
          Inquiry vs Purchase Comparison
        </h3>
        <p className="text-[11px] text-muted-foreground">Monthly lead volume vs closed sales + conversion rate trend</p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 0 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border) / 0.3)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "oklch(0.556 0 0)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="count"
            tick={{ fill: "oklch(0.556 0 0)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={35}
          />
          <YAxis
            yAxisId="rate"
            orientation="right"
            tick={{ fill: "oklch(0.556 0 0)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
            width={42}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
            formatter={(value) => <span style={{ color: "oklch(0.708 0 0)", fontSize: "11px" }}>{value}</span>}
          />
          <Bar yAxisId="count" dataKey="inquiries" name="Inquiries" fill="#38bdf8" radius={[3, 3, 0, 0]} opacity={0.8} />
          <Bar yAxisId="count" dataKey="purchases" name="Purchases" fill="#a78bfa" radius={[3, 3, 0, 0]} opacity={0.85} />
          <Line
            yAxisId="rate"
            type="monotone"
            dataKey="conversionRate"
            name="Conv. Rate %"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ fill: "#f59e0b", r: 3 }}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
