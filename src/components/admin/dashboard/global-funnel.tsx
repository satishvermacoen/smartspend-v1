"use client";

import { Share2 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface GlobalFunnelProps {
  data: {
    name: string;
    value: number;
  }[];
}

export function GlobalFunnel({ data }: GlobalFunnelProps) {
  const COLORS = ['#3b82f6', '#f59e0b', '#10b981'];

  return (
    <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-3xl p-6 shadow-elegant space-y-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Share2 className="h-4 w-4 text-purple-400" /> Global Funnel Conversion
          </h4>
          <p className="text-xs text-muted-foreground mt-1">Aggregated pipeline drop-off rates.</p>
        </div>
      </div>
      
      <div className="h-[220px] w-full">
        {data.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground italic">
            No funnel data available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" barSize={24} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" horizontal={false} />
              <XAxis type="number" stroke="currentColor" className="text-[10px] opacity-50" tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" stroke="currentColor" className="text-[11px] font-medium" tickLine={false} axisLine={false} width={80} />
              <Tooltip 
                cursor={{ fill: 'currentColor', opacity: 0.05 }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border) / 0.1)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                }}
                itemStyle={{ fontSize: '12px', fontWeight: 500, color: 'var(--brand)' }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
