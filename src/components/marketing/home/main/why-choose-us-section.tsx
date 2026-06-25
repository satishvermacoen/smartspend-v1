"use client";

import { Lock, Gift, Users, Wallet } from "lucide-react";

export function WhyChooseUsSection() {
  const features = [
    { icon: <Lock className="h-5 w-5" />, title: "Own Account Activation", desc: "Subscriptions are activated directly on your account — no shared logins." },
    { icon: <Gift className="h-5 w-5" />, title: "Gift Vouchers via Promotional Campaigns", desc: "Exclusive promotional rewards you won't find anywhere else." },
    { icon: <Users className="h-5 w-5" />, title: "Trusted by 850+ Professionals", desc: "Join thousands of happy customers across India." },
    { icon: <Wallet className="h-5 w-5" />, title: "Save Thousands Every Month", desc: "Minimum 50% savings on every subscription, guaranteed." },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Why Choose Us?</h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">Authentic activations, real savings, and support that actually responds.</p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-lg border border-border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md duration-200"
          >
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              {f.icon}
            </div>
            <h3 className="mt-4 font-display text-base font-semibold text-foreground">{f.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
