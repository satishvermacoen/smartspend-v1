"use client";

import { Share2, Wallet, Gift, Check, Tag, ShieldCheck, ArrowRight, Infinity as InfinityIcon } from "lucide-react";
import Link from "next/link";

export function ReferralProgramSection() {
  return (
    <section id="referral" className="relative overflow-hidden bg-secondary/30 py-20">
      <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-5 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary backdrop-blur sm:text-base">
            <Share2 className="h-4 w-4 sm:h-5 sm:w-5" /> Referral Program
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Share the Savings. <span className="text-primary">Earn Rewards.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Enjoying your savings with SpendSmart? Refer friends, colleagues or your network and
            get rewarded on each successful referral.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-lg border border-border bg-card p-7 shadow-sm">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                  <Wallet className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">Cash Reward</h3>
              </div>
              <ul className="mt-5 space-y-3 text-sm text-foreground/80">
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    Get <strong>₹1,000</strong> for referrals resulting in purchases{" "}
                    <strong>above ₹4,000</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    Get <strong>₹500</strong> for referrals resulting in purchases{" "}
                    <strong>below ₹4,000</strong>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg border border-border bg-card p-7 shadow-sm">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                  <Gift className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">Subscription Reward</h3>
              </div>
              <ul className="mt-5 space-y-3 text-sm text-foreground/80">
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    Receive <strong>3 Months FREE</strong> on a new subscription
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    Or apply as an <strong>extension</strong> to an existing subscription of
                    your choice
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-start gap-4 rounded-lg border border-primary/20 bg-card p-6 shadow-sm sm:flex-row sm:items-center">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
            <Tag className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-base font-bold text-foreground">Bonus for Your Referral</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your referral receives an additional{" "}
              <strong className="text-foreground">₹500 OFF</strong> on their purchase when they
              join through your unique referral link.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-4 rounded-lg border border-primary/35 bg-primary/5 p-6 shadow-sm">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-base font-bold text-foreground">Real-Time Performance Tracking</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              All referral commissions are tracked transparently through your{" "}
              <strong className="text-foreground">unique referral link</strong>. Every registered
              referrer receives a personalized tracking link, allowing you to monitor referrals
              and earnings in real time.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-foreground/80">
          <InfinityIcon className="h-5 w-5 text-primary" />
          <span>No limits. The more you refer, the more you earn.</span>
        </div>

        <div className="mt-12 text-center">
          <h3 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Ready to <span className="text-primary">Start Earning?</span>
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
            Fill out the form below to register as a referrer and get your unique tracking link.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/referral"
              className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-md transition hover:bg-primary/95"
            >
              Register & Get My Link
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
