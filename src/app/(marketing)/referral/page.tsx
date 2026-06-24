import { Share2, Wallet, Gift, Tag, Infinity as InfinityIcon, Check } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/marketing/layout/site-chrome";
import { ReferralForm } from "@/components/marketing/home/referral-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Referral Program — Share the Savings, Earn Rewards",
  description: "Refer friends to SpendSmart Subscriptions and earn up to ₹1,000 cash or 3 months free subscription. Your referral also gets ₹500 OFF.",
  openGraph: {
    title: "Refer & Earn — SpendSmart Subscriptions",
    description: "Share the savings. Earn cash or free subscription months for every referral.",
  },
};

export default function ReferralPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-gradient-hero">
          <div className="absolute -left-32 top-16 h-72 w-72 rounded-full bg-brand-soft opacity-40 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-gold opacity-20 blur-3xl" />
          <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Share2 className="h-3.5 w-3.5 text-primary" /> Referral Program
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Share the Savings. <span className="text-gradient">Earn Rewards.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Enjoying your savings with SpendSmart? Refer your friends, colleagues, or network and
              get rewarded when they make a successful purchase.
            </p>
          </div>
        </section>

        {/* REWARDS */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Choose Your Reward
            </h2>
            <p className="mt-2 text-muted-foreground">Pick the perk that suits you best.</p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-elegant">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-brand opacity-10 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-soft">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-2xl font-bold">Cash Reward</h3>
                </div>
                <ul className="mt-6 space-y-3 text-sm">
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

            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-elegant">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gold opacity-20 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-soft">
                    <Gift className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-2xl font-bold">Subscription Reward</h3>
                </div>
                <ul className="mt-6 space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>
                      Receive <strong>3 Months FREE</strong> on a new subscription
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>
                      Or apply it as an <strong>extension</strong> to an existing subscription of your choice
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Referral bonus */}
          <div className="mt-8 flex flex-col items-start gap-4 rounded-3xl border border-primary/30 bg-secondary/60 p-6 shadow-soft sm:flex-row sm:items-center sm:p-8">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-card text-primary">
              <Tag className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold">Bonus for Your Referral</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Your referral receives an additional <strong className="text-foreground">₹500 OFF</strong> on
                their purchase when they join through your unique referral link.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-foreground">
            <InfinityIcon className="h-5 w-5 text-primary" />
            <span>No limits. The more you refer, the more you earn.</span>
          </div>
        </section>

        {/* REGISTRATION FORM */}
        <section id="register" className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-elegant sm:p-10">
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold sm:text-3xl">Register as a Referrer</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Fill in the details below. Our team will share your unique referral link and track
                referrals transparently.
              </p>
            </div>
            <ReferralForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
