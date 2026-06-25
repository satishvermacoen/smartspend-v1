"use client";

import { Users, Handshake, Sparkles, Target } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          About <span className="text-primary">Us</span>
        </h2>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-5">
        <div className="space-y-5 text-base leading-relaxed text-foreground/85 lg:col-span-3">
          <p>
            At <strong>SpendSmart Subscriptions</strong>, our journey started with a simple problem.
          </p>
          <p>
            Like many people, we wanted access to premium subscriptions for work, learning,
            entertainment, and productivity — but often found the official prices too
            expensive. While exploring different options, we discovered that many companies
            regularly offer special promotions, gifting programs, and regional pricing
            opportunities that can significantly reduce subscription costs.
          </p>
          <p>
            As we gained access to these opportunities through trusted and official channels,
            we realized that many others were facing the same challenge we once did. That
            sparked an idea: why not build a business that helps people access the same
            subscriptions at more affordable prices?
          </p>
          <p>
            Founded in <strong>2023</strong>, SpendSmart Subscriptions was created to make
            premium subscriptions more accessible and affordable. Since then, we have served{" "}
            <strong>400+ customers</strong> and built a network of{" "}
            <strong>150+ resellers</strong>, providing access to{" "}
            <strong>80+ popular AI, professional, productivity, learning, and entertainment
            subscriptions</strong>.
          </p>
          <p>
            Today, we help individuals and businesses save significantly on the subscriptions
            they use every day while enjoying a simple and seamless activation experience
            directly on their own accounts.
          </p>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-5 shadow-sm">
            <h3 className="font-display text-lg font-bold text-foreground">Our Mission</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Make premium subscriptions accessible to everyone — without the premium price tag.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:col-span-2 lg:content-start">
          {[
            { icon: Users, value: "400+", label: "Customers Served" },
            { icon: Handshake, value: "150+", label: "Resellers Network" },
            { icon: Sparkles, value: "80+", label: "Subscriptions" },
            { icon: Target, value: "2023", label: "Founded" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-primary">
                <s.icon className="h-4 w-4" />
              </div>
              <div className="mt-3 font-display text-2xl font-extrabold text-primary">
                {s.value}
              </div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
