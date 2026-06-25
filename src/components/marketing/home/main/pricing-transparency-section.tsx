"use client";

import { Sparkles } from "lucide-react";

export function PricingTransparencySection() {
  return (
    <section id="why-lower-prices" className="relative overflow-hidden py-20 bg-background">
      <div className="absolute -right-24 top-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -left-24 bottom-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary backdrop-blur">
            <Sparkles className="h-4 w-4" /> Transparent Pricing
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How Are Our <span className="text-primary">Prices Lower?</span>
          </h2>
        </div>

        <div className="mt-10 rounded-lg border border-border bg-card p-8 shadow-sm sm:p-10">
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Many leading subscription providers run promotional campaigns and special events
            where official gift vouchers are distributed. Additionally, subscription pricing
            often varies across different regions, countries, and markets. By having access to
            these opportunities and making use of these legitimate offers, we&apos;re able to
            secure subscriptions at discounted rates and pass those savings directly to our
            customers. This allows us to provide official subscriptions at significant savings
            while delivering the exact same subscription and features available through the
            official platform.
          </p>
        </div>
      </div>
    </section>
  );
}
