"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, PieLabelRenderProps } from "recharts";
import { Users } from "lucide-react";
import Link from "next/link";

interface StatusBreakdown { status: string; count: number }
interface PartnerClientStatusProps { data: StatusBreakdown[]; total: number }

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  pending:   { color: "#f59e0b", label: "Pending" },
  contacted: { color: "#38bdf8", label: "Contacted" },
  active:    { color: "#34d399", label: "Active" },
  resolved:  { color: "#6366f1", label: "Resolved" },
  inactive:  { color: "#64748b", label: "Inactive" },
  ignored:   { color: "#ef4444", label: "Ignored" },
};

const RADIAN = Math.PI / 180;
const renderLabel = (props: PieLabelRenderProps) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  if (percent === undefined || percent < 0.06) return null;
  const radius = (innerRadius || 0) + ((outerRadius || 0) - (innerRadius || 0)) * 0.6;
  const x = (cx || 0) + radius * Math.cos(-(midAngle || 0) * RADIAN);
  const y = (cy || 0) + radius * Math.sin(-(midAngle || 0) * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      status: string;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  const cfg = STATUS_CONFIG[d.payload.status] || { color: "#888", label: d.payload.status };
  return (
    <div className="bg-card border border-border/20 rounded-xl px-3 py-2 shadow-card text-xs">
      <p className="font-semibold text-foreground">{cfg.label}</p>
      <p className="text-muted-foreground mt-0.5"><span className="font-bold text-foreground">{d.value}</span> clients</p>
    </div>
  );
};

export function PartnerClientStatus({ data, total }: PartnerClientStatusProps) {
  return (
    <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-3xl p-6 shadow-elegant space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Users className="h-4 w-4 text-brand" /> My Referred Clients
          </h3>
          <p className="text-[11px] text-muted-foreground">{total} total clients referred</p>
        </div>
        <Link href="/partner/clients" className="text-[10px] text-brand hover:underline font-semibold">
          View All →
        </Link>
      </div>

      {total === 0 ? (
        <div className="flex items-center justify-center py-10 text-xs text-muted-foreground italic">
          No referred clients yet
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={72} dataKey="count" nameKey="status" labelLine={false} label={renderLabel}>
                {data.map((entry) => {
                  const cfg = STATUS_CONFIG[entry.status] || { color: "#888" };
                  return <Cell key={entry.status} fill={cfg.color} opacity={0.85} />;
                })}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {data.map((d) => {
              const cfg = STATUS_CONFIG[d.status] || { color: "#888", label: d.status };
              return (
                <div key={d.status} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ background: cfg.color }} />
                  <span className="text-[10px] text-muted-foreground">{cfg.label}</span>
                  <span className="ml-auto text-[10px] font-bold text-foreground">{d.count}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
