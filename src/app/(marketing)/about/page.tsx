import { Users, Handshake, Sparkles, Target, ArrowRight } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/marketing/layout/site-chrome";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — SpendSmart Subscriptions",
  description: "Founded in 2023, SpendSmart Subscriptions helps people access premium subscriptions without paying full price.",
  openGraph: {
    title: "About SpendSmart Subscriptions",
    description: "Helping customers save more while enjoying the services they use every day.",
  },
};

const STATS = [
  { icon: Users, value: "400+", label: "Customers Served" },
  { icon: Handshake, value: "150+", label: "Resellers Network" },
  { icon: Sparkles, value: "80+", label: "Premium Subscriptions" },
  { icon: Target, value: "2023", label: "Founded" },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-gradient-hero">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <p className="font-display text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              About Us
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Premium subscriptions, <span className="text-gradient">without the premium price.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Founded in 2023, SpendSmart Subscriptions was created with a simple goal: helping
              people access premium subscriptions without paying full price.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="mt-3 font-display text-3xl font-extrabold text-gradient">{s.value}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 space-y-6 text-base leading-relaxed text-foreground/90">
            <p>
              Since we began, we have served <strong>400+ customers</strong> and built a network of{" "}
              <strong>150+ resellers</strong>, providing access to <strong>80+ popular AI, professional,
              productivity, learning, and entertainment subscriptions</strong>.
            </p>
            <p>
              Through official gift vouchers and promotional offers, we ensure a seamless activation
              experience directly on your own account — making premium subscriptions more accessible
              and affordable.
            </p>
            <div className="rounded-2xl border border-primary/30 bg-secondary/60 p-6 shadow-soft">
              <h2 className="font-display text-xl font-bold">Our Mission</h2>
              <p className="mt-2 text-muted-foreground">
                Helping customers save more while enjoying the services they use every day.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:opacity-90"
            >
              Explore Subscriptions <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-card transition hover:bg-secondary"
            >
              How it works
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
