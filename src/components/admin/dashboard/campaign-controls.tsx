"use client";

import { useState } from "react";
import { Zap, Mail, Percent, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CampaignControls() {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAction = (actionName: string, successMessage: string) => {
    setLoadingAction(actionName);
    // Simulate network request
    setTimeout(() => {
      setLoadingAction(null);
      toast.success(successMessage);
    }, 1500);
  };

  return (
    <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-3xl p-6 shadow-elegant space-y-5 relative overflow-hidden">
      {/* Overlay glow */}
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-brand/10 blur-[40px] pointer-events-none" />

      <div>
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <Zap className="h-4 w-4 text-brand" /> Quick Actions
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed mt-1">
          Trigger system-wide campaigns to boost referral engagement.
        </p>
      </div>

      <div className="space-y-3">
        <Button
          onClick={() => handleAction('bonus', '2x Rewards Weekend has been activated!')}
          disabled={loadingAction !== null}
          className="w-full h-11 text-xs font-semibold rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-500 border border-amber-500/20 flex items-center justify-start px-4 gap-3 cursor-pointer shadow-sm transition-all"
        >
          {loadingAction === 'bonus' ? <Zap className="h-4 w-4 animate-pulse" /> : <Percent className="h-4 w-4" />}
          Activate 2x Rewards (48h)
        </Button>

        <Button
          onClick={() => handleAction('nudge', 'Reminder emails sent to 45 inactive promoters.')}
          disabled={loadingAction !== null}
          className="w-full h-11 text-xs font-semibold rounded-xl bg-card border border-border/15 hover:bg-soft text-foreground flex items-center justify-start px-4 gap-3 cursor-pointer transition-all"
        >
          {loadingAction === 'nudge' ? <Zap className="h-4 w-4 animate-pulse" /> : <Mail className="h-4 w-4 text-muted-foreground" />}
          Email Inactive Promoters
        </Button>

        <Button
          onClick={() => handleAction('vip', 'VIP Campaign initiated for top 10 referrers.')}
          disabled={loadingAction !== null}
          className="w-full h-11 text-xs font-semibold rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 flex items-center justify-start px-4 gap-3 cursor-pointer transition-all"
        >
          {loadingAction === 'vip' ? <Zap className="h-4 w-4 animate-pulse" /> : <PlayCircle className="h-4 w-4" />}
          Launch VIP Campaign
        </Button>
      </div>
    </div>
  );
}
