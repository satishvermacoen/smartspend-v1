"use client";

import { CheckCircle2, AlertTriangle, BrainCircuit } from "lucide-react";

interface AdminGrowthSuggestionsProps {
  globalClicks: number;
  globalSignups: number;
  globalPurchases: number;
  activePromoters: number;
}

const getAdminRecommendation = (clicks: number, signups: number, purchases: number, activePromoters: number) => {
  const clickToSignupRate = clicks > 0 ? (signups / clicks) * 100 : 0;
  const signupToPurchaseRate = signups > 0 ? (purchases / signups) * 100 : 0;

  if (activePromoters < 10) {
    return {
      title: "Low Promoter Activation ⚠️",
      insight: "Very few users are actively sharing their referral links.",
      advice: "Send a targeted email campaign to all users explaining the ₹500 discount they can offer friends and the rewards they earn. Include a direct button to their referral dashboard.",
      type: "warning"
    };
  }

  if (clickToSignupRate < 15) {
    return {
      title: "Landing Page Drop-off 📉",
      insight: `Global link clicks are converting to signups at only ${Math.round(clickToSignupRate)}% (Target: >20%).`,
      advice: "A/B test the referral sign-up page. Ensure the ₹500 discount is immediately visible above the fold. Consider simplifying the registration form.",
      type: "warning"
    };
  }

  if (signups > 0 && signupToPurchaseRate < 20) {
    return {
      title: "Purchase Activation Stalled 💳",
      insight: `System is generating signups, but only ${Math.round(signupToPurchaseRate)}% upgrade to paid plans (Target: >30%).`,
      advice: "Implement an automated drip email sequence for referred users who haven't purchased within 3 days. Remind them their ₹500 discount expires soon.",
      type: "warning"
    };
  }

  return {
    title: "System Healthy & Scaling ⭐",
    insight: `Global Funnel metrics look great. Clicks-to-Signup: ${Math.round(clickToSignupRate)}% | Signup-to-Purchase: ${Math.round(signupToPurchaseRate)}%.`,
    advice: "Consider launching a '2x Rewards Weekend' for your top 10 promoters to push momentum even further.",
    type: "success"
  };
};

export function AdminGrowthSuggestions({ globalClicks, globalSignups, globalPurchases, activePromoters }: AdminGrowthSuggestionsProps) {
  const rec = getAdminRecommendation(globalClicks, globalSignups, globalPurchases, activePromoters);

  const getStyles = () => {
    switch (rec.type) {
      case 'success': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      default: return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
    }
  };

  const getIcon = () => {
    switch (rec.type) {
      case 'success': return <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />;
      default: return <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-3xl p-6 shadow-elegant space-y-4">
      <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
        <BrainCircuit className="h-4 w-4 text-purple-400" /> Admin Strategy AI
      </h3>
      
      <div className={`border rounded-2xl p-5 space-y-3 transition-all ${getStyles()}`}>
        <div className="flex items-start gap-3">
          {getIcon()}
          <div className="space-y-1.5">
            <h6 className="font-bold text-sm text-foreground uppercase tracking-wider">{rec.title}</h6>
            <p className="text-xs text-foreground/90 font-medium leading-relaxed">{rec.insight}</p>
          </div>
        </div>
        <div className="text-[12px] text-foreground/80 border-t border-current/10 pt-3 leading-relaxed">
          <strong className="text-foreground">System Action: </strong>{rec.advice}
        </div>
      </div>
    </div>
  );
}
