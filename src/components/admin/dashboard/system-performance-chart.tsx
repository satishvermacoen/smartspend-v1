"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp } from "lucide-react";

interface SystemPerformanceChartProps {
  data: {
    date: string;
    clicks: number;
    signups: number;
    purchases: number;
  }[];
}

export function SystemPerformanceChart({ data }: SystemPerformanceChartProps) {
  return (
    <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-3xl p-6 shadow-elegant w-full h-full min-h-[350px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-brand" /> System Network Growth
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Global referral funnel performance over time.</p>
        </div>
        <span className="text-xs text-muted-foreground bg-soft/20 px-2 py-1 rounded-md">Last 30 Days</span>
      </div>

      <div className="flex-1 w-full min-h-[250px]">
        {data.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground italic">
            No system data available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="currentColor" 
                className="text-[10px] opacity-50" 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="currentColor" 
                className="text-[10px] opacity-50" 
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border) / 0.1)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                }}
                itemStyle={{ fontSize: '12px', fontWeight: 500 }}
                labelStyle={{ fontSize: '10px', color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType="circle" />
              <Area type="monotone" dataKey="clicks" name="Link Clicks" stroke="#3b82f6" fill="url(#colorClicks)" strokeWidth={2} />
              <Area type="monotone" dataKey="signups" name="New Signups" stroke="#f59e0b" fill="url(#colorSignups)" strokeWidth={2} />
              <Area type="monotone" dataKey="purchases" name="Paid Conversions" stroke="#10b981" fill="url(#colorPurchases)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
