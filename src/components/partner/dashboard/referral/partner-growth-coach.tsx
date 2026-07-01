"use client";

import { BrainCircuit, Rocket, Zap, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PartnerGrowthCoachProps {
  stats: {
    referralClicks: number;
    referralSignups: number;
    referralPurchases: number;
    conversionRate: number;
    pendingCash: number;
    availableBalance: number;
  };
}

interface CoachCard {
  type: "success" | "warning" | "info" | "action";
  title: string;
  insight: string;
  advice: string;
  action: string;
  href: string;
}

const TYPE_STYLES = {
  success: { border: "border-emerald-500/20 bg-emerald-500/8", icon: <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />, badge: "bg-emerald-500/15 text-emerald-400" },
  warning: { border: "border-amber-500/20 bg-amber-500/8",   icon: <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />,   badge: "bg-amber-500/15 text-amber-400" },
  info:    { border: "border-brand/20 bg-brand/8",            icon: <Zap className="h-4 w-4 text-brand shrink-0" />,                  badge: "bg-brand/15 text-brand" },
  action:  { border: "border-violet-500/20 bg-violet-500/8",  icon: <Rocket className="h-4 w-4 text-violet-400 shrink-0" />,          badge: "bg-violet-500/15 text-violet-400" },
};

function getCoachCards(stats: PartnerGrowthCoachProps["stats"]): CoachCard[] {
  const cards: CoachCard[] = [];
  const { referralClicks: clicks, referralSignups: signups, referralPurchases: purchases, pendingCash, availableBalance } = stats;
  const clickToSignup = clicks > 0 ? (signups / clicks) * 100 : 0;
  const signupToPurchase = signups > 0 ? (purchases / signups) * 100 : 0;

  if (clicks === 0) {
    cards.push({
      type: "action",
      title: "Launch Your Campaign 🚀",
      insight: "Your referral link hasn't received any clicks yet. Time to share!",
      advice: "Post on WhatsApp status, LinkedIn, or send a personal message. Mention the ₹500 discount — that's your best hook.",
      action: "Copy Your Link",
      href: "/partner/dashboard",
    });
  } else if (clickToSignup < 20) {
    cards.push({
      type: "warning",
      title: "Optimize Signup Rate ✍️",
      insight: `Your link gets clicks, but only ${Math.round(clickToSignup)}% sign up (target: 20%+).`,
      advice: "Send a personal message explaining the value — generic links convert 3x worse than a friend's personal recommendation.",
      action: "Share via WhatsApp",
      href: "/partner/dashboard",
    });
  }

  if (signups > 0 && signupToPurchase < 30) {
    cards.push({
      type: "warning",
      title: "Boost Upgrade Rate 💳",
      insight: `${signups} signups but only ${Math.round(signupToPurchase)}% upgraded to paid plans.`,
      advice: "Follow up with signed-up contacts. Remind them upgrading redeems their ₹500 coupon — urgency drives action.",
      action: "View My Clients",
      href: "/partner/clients",
    });
  }

  if (purchases >= 5 && signupToPurchase >= 30) {
    cards.push({
      type: "success",
      title: "Top Performer Funnel ⭐",
      insight: `Excellent! Click→Signup: ${Math.round(clickToSignup)}% | Signup→Purchase: ${Math.round(signupToPurchase)}%.`,
      advice: "You're in the top tier. Scale further by sharing in newsletter communities or creating a short video testimonial.",
      action: "View Earnings",
      href: "/partner/earning",
    });
  }

  if (availableBalance > 0) {
    cards.push({
      type: "info",
      title: "💸 Rewards Ready to Claim",
      insight: `You have ₹${availableBalance} available to withdraw right now.`,
      advice: "Withdraw to your account balance and use it on your next subscription renewal.",
      action: "Withdraw Now",
      href: "/partner/earning",
    });
  } else if (pendingCash > 0) {
    cards.push({
      type: "info",
      title: "⏳ Rewards Being Processed",
      insight: `₹${pendingCash} in rewards is currently pending approval.`,
      advice: "Pending rewards are typically processed within 48 hours. Keep referring in the meantime!",
      action: "View Wallet",
      href: "/partner/earning",
    });
  }

  if (cards.length === 0) {
    cards.push({
      type: "action",
      title: "Keep the Momentum Going 🔥",
      insight: "Your referral program is active. Every new referral means more earnings.",
      advice: "Target your social networks — LinkedIn for professionals, WhatsApp groups for local reach. Be consistent!",
      action: "Share Now",
      href: "/partner/setting",
    });
  }

  return cards.slice(0, 3);
}

export function PartnerGrowthCoach({ stats }: PartnerGrowthCoachProps) {
  const cards = getCoachCards(stats);

  return (
    <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-3xl p-6 shadow-elegant space-y-4">
      <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
        <BrainCircuit className="h-4 w-4 text-brand" />
        AI Growth Coach
        <span className="ml-auto text-[9px] font-normal text-muted-foreground">Based on your live data</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card, idx) => {
          const style = TYPE_STYLES[card.type];
          return (
            <div key={idx} className={`border rounded-2xl p-4 space-y-3 ${style.border}`}>
              <div className="flex items-start gap-2.5">
                {style.icon}
                <div className="space-y-1 flex-1">
                  <h5 className="font-bold text-xs text-foreground uppercase tracking-wider">{card.title}</h5>
                  <p className="text-[11px] text-foreground/80 leading-relaxed">{card.insight}</p>
                </div>
              </div>
              <p className="text-[11px] text-foreground/70 border-t border-current/10 pt-2 leading-relaxed">
                <strong className="text-foreground">Tip: </strong>{card.advice}
              </p>
              <Link
                href={card.href}
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg hover:opacity-80 transition-opacity ${style.badge}`}
              >
                {card.action} <ArrowRight className="h-2.5 w-2.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
