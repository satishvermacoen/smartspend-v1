"use client";

import { Gift, Mail, Rocket, LifeBuoy, MessageCircle } from "lucide-react";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-secondary/30 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">How it works</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Getting started is simple. Raise an inquiry through our website, WhatsApp, email,
            or any official channel. Our team will understand your requirements and guide you
            to the most suitable subscription option.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Gift,
              step: "01",
              title: "Subscription Confirmation",
              body: (
                <p>
                  Once your subscription is confirmed, our team will explain the activation
                  process, share the required details, and guide you through the next steps to
                  ensure a smooth experience.
                </p>
              ),
            },
            {
              icon: Mail,
              step: "02",
              title: "Activate Your Subscription",
              body: (
                <p>
                  All subscriptions are activated either through a gift voucher or by sharing
                  your email ID, depending on the subscription. For gift voucher activations,
                  simply follow the steps shared by our team. For email-based subscriptions,
                  you only need to share your email ID, and our team will apply the gift
                  voucher and complete the activation for you.
                </p>
              ),
            },
            {
              icon: Rocket,
              step: "03",
              title: "Start Using Your Subscription",
              body: (
                <p>
                  Once activated, you can immediately verify your subscription validity, access
                  all included features, and start enjoying the benefits of your subscription.
                </p>
              ),
            },
          ].map((s) => (
            <div key={s.step} className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="text-xs font-bold tracking-wider text-primary">STEP {s.step}</div>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{s.title}</h3>
              <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start gap-4 rounded-lg border border-primary/20 bg-card p-6 shadow-sm sm:flex-row sm:items-center">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
            <LifeBuoy className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-base font-semibold text-foreground">Need Help?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              If you face any issues during the activation process, our support team will be
              available to assist you at every step and ensure a smooth experience.
            </p>
          </div>
          <a
            href="https://wa.me/918770066995?text=Hi%2C%20I%20need%20help%20with%20activation"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/95 transition-colors"
          >
            <MessageCircle className="h-4 w-4" /> Chat with our team
          </a>
        </div>
      </div>
    </section>
  );
}
