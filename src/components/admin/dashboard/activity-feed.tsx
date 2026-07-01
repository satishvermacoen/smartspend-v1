"use client";

import { Activity, ClipboardList, FileText, Link2 } from "lucide-react";

interface ActivityItem {
  type: string;
  title: string;
  subtitle: string;
  timestamp: string | Date | undefined;
  badge: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
}

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  enquiry: {
    icon: <ClipboardList className="h-3.5 w-3.5" />,
    color: "text-sky-400",
    bg: "bg-sky-500/10",
  },
  referral: {
    icon: <Link2 className="h-3.5 w-3.5" />,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  invoice: {
    icon: <FileText className="h-3.5 w-3.5" />,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
};

function timeAgo(ts: string | Date | undefined): string {
  if (!ts) return "";
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-3xl p-6 shadow-elegant space-y-4">
      <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
        <Activity className="h-4 w-4 text-brand" />
        Recent Activity
      </h4>

      {items.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted-foreground italic">
          No recent activity yet.
        </div>
      ) : (
        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
          {items.map((item, idx) => {
            const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.enquiry;
            return (
              <div
                key={idx}
                className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-soft/10 transition-all"
              >
                <div className={`h-7 w-7 rounded-xl ${cfg.bg} ${cfg.color} flex items-center justify-center shrink-0 mt-0.5`}>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-foreground truncate">{item.title}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 truncate">{item.subtitle}</div>
                </div>
                <div className="text-[9px] text-muted-foreground shrink-0 mt-0.5">
                  {timeAgo(item.timestamp)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
