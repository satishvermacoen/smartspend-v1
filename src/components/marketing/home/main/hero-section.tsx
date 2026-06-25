"use client";

import { Users, Zap, Handshake, Percent, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ToolsOrbit } from "@/components/marketing/home/tools-orbit";
import { WhatsAppIcon } from "@/components/marketing/layout/site-chrome";

const HERO_STATS = [
  { value: "850+", label: "Professionals Served", icon: Users },
  { value: "1,500+", label: "Successful Activations", icon: Zap },
  { value: "150+", label: "Trusted Partners", icon: Handshake },
  { value: "50%+", label: "Guaranteed Savings", icon: Percent },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-14 sm:py-16 lg:py-24">
      {/* Background decorations using theme accent colors */}
      <div className="absolute inset-0 bg-gradient-hero opacity-30" />
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-primary/10 opacity-40 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-primary/10 opacity-20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-8 lg:px-8">
        <div>
          <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-primary sm:text-sm">
            Stop overpaying for subscriptions
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Same subscriptions.
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Lower prices.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Everything you need in one place.
          </p>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            We help professionals access premium AI, Professional & Creative tools
            through <strong className="text-foreground">official gift vouchers</strong> at 50%+ discounts.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#why-lower-prices"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:bg-accent/10 sm:w-auto"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              How Are Our Prices Lower?
            </a>
            <Link
              href="/tools"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-primary/95 sm:w-auto"
            >
              <Sparkles className="h-4 w-4" />
              Explore All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://wa.me/918770066995?text=Hi%2C%20I%27d%20like%20pricing%20for%20a%20subscription"
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:bg-accent/10 sm:w-auto"
            >
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[#25D366] text-white">
                <WhatsAppIcon className="h-3 w-3" />
              </span>
              WhatsApp Us
            </a>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {HERO_STATS.map((s) => (
              <div
                key={s.label}
                className="group relative overflow-hidden rounded-lg border border-border bg-card p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="absolute inset-x-0 top-0 h-[2px] bg-primary/70" />
                <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-primary/5 blur-2xl" />
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-md bg-secondary text-primary">
                    <s.icon className="h-4 w-4" />
                  </div>
                  <div className="font-display text-2xl font-extrabold leading-none text-primary sm:text-[28px]">
                    {s.value}
                  </div>
                </div>
                <div className="mt-3 text-[11px] font-semibold uppercase leading-tight tracking-[0.12em] text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orbit */}
        <div className="relative flex flex-col items-center justify-center">
          <div className="absolute -inset-4 rounded-full bg-card/30 backdrop-blur-sm" aria-hidden />
          <ToolsOrbit />
          <div className="mt-4 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Top demand subscriptions
          </div>
        </div>
      </div>
    </section>
  );
}
