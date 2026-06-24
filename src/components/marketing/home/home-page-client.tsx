"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Gift,
  Users,
  Wallet,
  Sparkles,
  Lock,
  ArrowRight,
  Zap,
  Handshake,
  Percent,
  Plus,
  Tag,
  BellRing,
  Target,
  Mail,
  Rocket,
  LifeBuoy,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
  Infinity as InfinityIcon,
  MessageCircle,
  Phone,
  Clock,
  Send,
  X,
} from "lucide-react";
import Link from "next/link";
import { SiteHeader, SiteFooter, WhatsAppIcon } from "@/components/marketing/layout/site-chrome";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ToolsOrbit } from "@/components/marketing/home/tools-orbit";
import { ToolLogo } from "@/components/marketing/layout/tool-logo";
import { WishlistSection } from "@/components/marketing/home/wishlist-section";
import { MARQUEE_TOOLS, TOP_DEMAND_CATEGORIES } from "@/data/tools";
import { Testimonial } from "@/types";

// Import local physical testimonials screenshots
import arunChat1 from "@/assets/testimonials/arun/arun-1.png";
import arunChat2 from "@/assets/testimonials/arun/arun-2.png";
import arunChat3 from "@/assets/testimonials/arun/arun-3.png";
import arunChat4 from "@/assets/testimonials/arun/arun-4.png";
import harshitChat1 from "@/assets/testimonials/harshit/harshit-1.png";
import harshitChat2 from "@/assets/testimonials/harshit/harshit-2.png";
import harshitChat3 from "@/assets/testimonials/harshit/harshit-3.png";
import chetaliChat1 from "@/assets/testimonials/chetali/chetali-1.png";
import chetaliChat2 from "@/assets/testimonials/chetali/chetali-2.png";
import chetaliChat3 from "@/assets/testimonials/chetali/chetali-3.png";

const HERO_STATS = [
  { value: "850+", label: "Professionals Served", icon: Users },
  { value: "1,500+", label: "Successful Activations", icon: Zap },
  { value: "150+", label: "Trusted Partners", icon: Handshake },
  { value: "50%+", label: "Guaranteed Savings", icon: Percent },
];

export function HomePageClient() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-brand-soft opacity-40 blur-3xl" />
          <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-gold opacity-20 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-8 lg:py-24 lg:px-8">
            <div>
              <p className="font-display text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-sm">
                Stop overpaying for subscriptions
              </p>
              <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Same subscriptions.
                <br />
                <span className="text-gradient">Lower prices.</span>
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
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-card transition hover:bg-secondary sm:w-auto"
                >
                  <Sparkles className="h-4 w-4 text-gold" />
                  How Are Our Prices Lower?
                </a>
                <Link
                  href="/tools"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:opacity-90 sm:w-auto"
                >
                  <Sparkles className="h-4 w-4 text-gold" />
                  Explore All Products
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="https://wa.me/918770066995?text=Hi%2C%20I%27d%20like%20pricing%20for%20a%20subscription"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-card transition hover:bg-secondary sm:w-auto"
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
                    className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-card transition hover:shadow-elegant"
                  >
                    <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-brand opacity-70" />
                    <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-brand opacity-[0.06] blur-2xl" />
                    <div className="flex items-center gap-2">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-primary">
                        <s.icon className="h-4 w-4" />
                      </div>
                      <div className="font-display text-2xl font-extrabold leading-none text-gradient sm:text-[28px]">
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
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-card/30 backdrop-blur-sm" aria-hidden />
              <ToolsOrbit />
              <div className="mt-4 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Top demand subscriptions
              </div>
            </div>
          </div>

          {/* logo marquee */}
          <div className="relative mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-2xl border border-border bg-card/70 py-5 backdrop-blur">
              <div className="flex w-max items-center gap-12 px-6 animate-marquee">
                {[...MARQUEE_TOOLS, ...MARQUEE_TOOLS, ...MARQUEE_TOOLS].map((t, i) => {
                  const noBg = t.slug === "github";
                  return (
                    <div key={`${t.name}-${i}`} className="flex shrink-0 items-center gap-2 opacity-90 transition hover:opacity-100" title={t.name}>
                      <ToolLogo
                        tool={t}
                        className={`h-10 w-10 shrink-0 rounded-xl ${noBg ? "" : "bg-foreground/95 p-1.5 shadow-soft ring-1 ring-border"}`}
                      />
                      <span className="whitespace-nowrap text-sm font-semibold text-muted-foreground">
                        {t.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* TOP-DEMAND LOGO GRID */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="font-display text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-sm">
              Top-most demanded subscriptions
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Professional, AI &amp; Creative Tools
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              The exact stack today's professionals, creators and founders pay for — all in one place.
            </p>
          </div>

          <div className="mt-12 space-y-14">
            {TOP_DEMAND_CATEGORIES.map((cat) => (
              <div key={cat.title}>
                <div className="mb-6 flex items-center gap-4">
                  <h3 className="font-display text-lg font-bold tracking-tight sm:text-xl">
                    {cat.title}
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-r from-border via-border/60 to-transparent" />
                  <span className="rounded-full border border-border bg-secondary/60 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {cat.tools.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
                  {cat.tools.map((tool) => (
                    <div
                      key={tool.name}
                      className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-elegant"
                    >
                      <div className={`flex h-20 w-20 items-center justify-center rounded-xl p-3 sm:h-24 sm:w-24 ${tool.slug === "github" ? "" : "bg-secondary/40"}`}>
                        <ToolLogo tool={tool} className="h-full w-full" />
                      </div>
                      <div className="text-center text-sm font-semibold text-foreground" title={tool.name}>
                        {tool.name}
                      </div>
                      <a
                        href={`https://wa.me/918770066995?text=${encodeURIComponent(`Hi, I'd like subscription details for ${tool.name}.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-auto inline-flex w-full items-center justify-center gap-1 whitespace-nowrap rounded-full border border-primary/30 bg-secondary px-2 py-1.5 text-[10px] font-semibold text-primary transition hover:bg-gradient-brand hover:text-primary-foreground hover:border-transparent"
                      >
                        Get subscription details
                        <ArrowRight className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/tools"
              className="inline-flex items-center gap-3 rounded-full bg-gradient-brand px-10 py-5 text-lg font-bold text-primary-foreground shadow-elegant transition hover:opacity-90 sm:text-xl"
            >
              <Plus className="h-6 w-6" />
              View all products
              <ArrowRight className="h-6 w-6" />
            </Link>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 rounded-full border-2 border-primary/30 bg-secondary/60 px-9 py-5 shadow-soft">
              <ShieldCheck className="h-10 w-10 text-primary sm:h-12 sm:w-12" />
              <span className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Minimum <span className="text-gradient">50% Savings</span> — Guaranteed
              </span>
            </div>
            <p className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-display text-lg font-semibold text-foreground sm:text-xl">
              <Tag className="h-6 w-6 text-primary" />
              <span>Offer valid while subscription lasts</span>
              <span className="text-muted-foreground">·</span>
              <BellRing className="h-6 w-6 text-gold" />
              <span>First come, first serve basis</span>
            </p>
          </div>
        </section>

        {/* ABOUT US */}
        <section id="about" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-gradient">About Us</span>
            </h2>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-5">
            <div className="space-y-5 text-base leading-relaxed text-foreground/90 lg:col-span-3">
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
              <div className="rounded-2xl border border-primary/30 bg-secondary/60 p-5 shadow-soft">
                <h3 className="font-display text-lg font-bold">Our Mission</h3>
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
                <div key={s.label} className="rounded-2xl border border-border bg-card p-4 shadow-card">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-primary">
                    <s.icon className="h-4 w-4" />
                  </div>
                  <div className="mt-3 font-display text-2xl font-extrabold text-gradient">
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

        {/* SUBSCRIPTION WISHLIST */}
        <WishlistSection />

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="bg-secondary/40 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
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
                <div key={s.step} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-primary-foreground shadow-soft">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <div className="text-xs font-bold tracking-wider text-gradient">STEP {s.step}</div>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
                  <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl border border-primary/30 bg-card p-6 shadow-soft sm:flex-row sm:items-center">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                <LifeBuoy className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold">Need Help?</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  If you face any issues during the activation process, our support team will be
                  available to assist you at every step and ensure a smooth experience.
                </p>
              </div>
              <a
                href="https://wa.me/918770066995?text=Hi%2C%20I%20need%20help%20with%20activation"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft"
              >
                <MessageCircle className="h-4 w-4" /> Chat with our team
              </a>
            </div>
          </div>
        </section>

        {/* WHY LOWER PRICES */}
        <section id="why-lower-prices" className="relative overflow-hidden py-20">
          <div className="absolute -right-24 top-10 h-64 w-64 rounded-full bg-gold opacity-20 blur-3xl" />
          <div className="absolute -left-24 bottom-10 h-64 w-64 rounded-full bg-brand-soft opacity-30 blur-3xl" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-5 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-gold-foreground backdrop-blur">
                <Sparkles className="h-4 w-4" /> Transparent Pricing
              </span>
              <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                How Are Our <span className="text-gradient">Prices Lower?</span>
              </h2>
            </div>

            <div className="mt-10 rounded-3xl border-2 border-gold/60 bg-card p-8 shadow-elegant sm:p-10">
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                Many leading subscription providers run promotional campaigns and special events
                where official gift vouchers are distributed. Additionally, subscription pricing
                often varies across different regions, countries, and markets. By having access to
                these opportunities and making use of these legitimate offers, we're able to
                secure subscriptions at discounted rates and pass those savings directly to our
                customers. This allows us to provide official subscriptions at significant savings
                while delivering the exact same subscription and features available through the
                official platform.
              </p>
            </div>
          </div>
        </section>

        {/* REFERRAL PROGRAM */}
        <section id="referral" className="relative overflow-hidden bg-secondary/40 py-20">
          <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-brand-soft opacity-40 blur-3xl" />
          <div className="absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-gold opacity-20 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card/80 px-5 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary backdrop-blur sm:text-base">
                <Share2 className="h-4 w-4 sm:h-5 sm:w-5" /> Referral Program
              </span>
              <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Share the Savings. <span className="text-gradient">Earn Rewards.</span>
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Enjoying your savings with SpendSmart? Refer friends, colleagues or your network and
                get rewarded on each successful referral.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-elegant">
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-brand opacity-10 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-soft">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-xl font-bold">Cash Reward</h3>
                  </div>
                  <ul className="mt-5 space-y-3 text-sm">
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

              <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-elegant">
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gold opacity-20 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-soft">
                      <Gift className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-xl font-bold">Subscription Reward</h3>
                  </div>
                  <ul className="mt-5 space-y-3 text-sm">
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

            <div className="mt-6 flex flex-col items-start gap-4 rounded-3xl border border-primary/30 bg-card p-6 shadow-soft sm:flex-row sm:items-center">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                <Tag className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-bold">Bonus for Your Referral</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your referral receives an additional{" "}
                  <strong className="text-foreground">₹500 OFF</strong> on their purchase when they
                  join through your unique referral link.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-4 rounded-3xl border-2 border-gold/60 bg-gold/5 p-6 shadow-soft">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold/15 text-gold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-bold">Real-Time Performance Tracking</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  All referral commissions are tracked transparently through your{" "}
                  <strong className="text-foreground">unique referral link</strong>. Every registered
                  referrer receives a personalized tracking link, allowing you to monitor referrals
                  and earnings in real time.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold">
              <InfinityIcon className="h-5 w-5 text-primary" />
              <span>No limits. The more you refer, the more you earn.</span>
            </div>

            <div className="mt-12 text-center">
              <h3 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Ready to <span className="text-gradient">Start Earning?</span>
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
                Fill out the form below to register as a referrer and get your unique tracking link.
              </p>
              <div className="mt-6 flex justify-center">
                <Link
                  href="/referral"
                  className="inline-flex items-center gap-3 rounded-full bg-gradient-brand px-10 py-5 text-lg font-bold text-primary-foreground shadow-elegant transition hover:opacity-90 sm:text-xl"
                >
                  Register & Get My Link
                  <ArrowRight className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Why Choose Us?</h2>
            <p className="mt-3 text-muted-foreground">Authentic activations, real savings, and support that actually responds.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <Lock className="h-6 w-6" />, title: "Own Account Activation", desc: "Subscriptions are activated directly on your account — no shared logins." },
              { icon: <Gift className="h-6 w-6" />, title: "Gift Vouchers via Promotional Campaigns", desc: "Exclusive promotional rewards you won't find anywhere else." },
              { icon: <Users className="h-6 w-6" />, title: "Trusted by 850+ Professionals", desc: "Join thousands of happy customers across India." },
              { icon: <Wallet className="h-6 w-6" />, title: "Save Thousands Every Month", desc: "Minimum 50% savings on every subscription, guaranteed." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-soft">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-primary-foreground shadow-soft">
                  {f.icon}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="font-display text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-sm">
              Loved by 850+
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              What Our <span className="text-gradient">Customers Say</span>
            </h2>
            <p className="mt-3 text-muted-foreground">Real customers. Real savings. Verified on WhatsApp.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                quote: "I had been paying full price for LinkedIn Sales Navigator for months. Got it here at less than half, and the activation was honestly quicker than I expected. Support actually replied when I had a question.",
                name: "Arun K.",
                role: "Mumbai",
                screenshots: [
                  { src: arunChat1, alt: "Arun K. WhatsApp chat — initial enquiry" },
                  { src: arunChat2, alt: "Arun K. WhatsApp chat — sharing email for activation" },
                  { src: arunChat3, alt: "Arun K. WhatsApp chat — ₹2,500 payment confirmation" },
                  { src: arunChat4, alt: "Arun K. WhatsApp chat — activation confirmed" },
                ],
              },
              {
                quote: "Honestly, I was a little skeptical at first about how something like this would actually work. But the whole thing turned out to be smooth and Gemini Pro has been running fine on my account ever since.",
                name: "Harshit G.",
                role: "Delhi",
                screenshots: [
                  { src: harshitChat1, alt: "Harshit G. WhatsApp chat — Gemini Pro enquiry and pricing" },
                  { src: harshitChat2, alt: "Harshit G. WhatsApp chat — activation confirmed" },
                  { src: harshitChat3, alt: "Harshit G. WhatsApp chat — payment done and thank you" },
                ],
              },
              {
                quote: "I got to know about them at a meetup event and was quite eager to try. Got Cursor Pro through them, and compared to the official price, the savings were genuinely impressive.",
                name: "Chetali M.",
                role: "Hyderabad",
                screenshots: [
                  { src: chetaliChat1, alt: "Chetali M. WhatsApp chat — Cursor Pro enquiry and pricing" },
                  { src: chetaliChat2, alt: "Chetali M. WhatsApp chat — gift voucher and activation" },
                  { src: chetaliChat3, alt: "Chetali M. WhatsApp chat — payment confirmed with thanks for savings" },
                ],
              },
            ].map((t) => (
              <TestimonialCard key={t.name} testimonial={t} />
            ))}
          </div>
        </section>

        {/* GET IN TOUCH */}
        <section id="contact" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="font-display text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-sm">
              Contact
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Get <span className="text-gradient">In Touch</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Questions? Ready to save? We're one message away.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Phone,
                label: "Call Us",
                value: "+91 8770066995",
                href: "tel:918770066995",
              },
              {
                icon: Mail,
                label: "Email",
                value: "support@spendsmartsubscriptions.in",
                href: "mailto:support@spendsmartsubscriptions.in",
              },
              {
                icon: Clock,
                label: "Working Hours",
                value: "Mon–Sat, 10 AM – 8 PM IST",
              },
            ].map((c) => {
              const inner = (
                <>
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-primary-foreground shadow-soft">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {c.label}
                  </div>
                  <div className="mt-1 break-words font-display text-base font-semibold text-foreground sm:text-lg">
                    {c.value}
                  </div>
                </>
              );
              const className =
                "block rounded-2xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-elegant";
              return c.href ? (
                <a key={c.label} href={c.href} className={className}>
                  {inner}
                </a>
              ) : (
                <div key={c.label} className={className}>
                  {inner}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://wa.me/918770066995?text=Hi%20I%20am%20looking%20for%20subscriptions.%20Can%20you%20please%20help%20me%20out%3F"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" /> Chat with us on WhatsApp
            </a>
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:opacity-90"
                >
                  <Send className="h-4 w-4" /> Send an Enquiry
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">Send an Enquiry</DialogTitle>
                  <DialogDescription>
                    Fill in your details and we'll contact you within minutes.
                  </DialogDescription>
                </DialogHeader>
                <InquiryForm />
              </DialogContent>
            </Dialog>
          </div>
        </section>

      </main>
      <SiteFooter />
    </div>
  );
}

function ReferralForm() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim().slice(0, 100);
    const email = String(data.get("email") || "").trim().slice(0, 255);
    const phone = String(data.get("phone") || "").trim().slice(0, 20);
    const reward = String(data.get("reward") || "Cash Reward");
    const notes = String(data.get("notes") || "").trim().slice(0, 500);

    if (!name || !phone) return;

    const text =
      `Hi, I'd like to register for the SpendSmart Referral Program.\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      (email ? `Email: ${email}\n` : "") +
      `Preferred Reward: ${reward}\n` +
      (notes ? `Notes: ${notes}\n` : "");

    window.open(`https://wa.me/918770066995?text=${encodeURIComponent(text)}`, "_blank");
    setSubmitted(true);
  };

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-4">
      <FormField label="Full Name" name="name" required placeholder="Your name" maxLength={100} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Phone / WhatsApp" name="phone" required placeholder="+91 …" maxLength={20} />
        <FormField label="Email (optional)" name="email" type="email" placeholder="you@example.com" maxLength={255} />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Preferred Reward
        </label>
        <select
          name="reward"
          className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm shadow-card focus:border-primary focus:outline-none"
        >
          <option>Cash Reward</option>
          <option>Subscription Reward (3 Months Free)</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Anything we should know? (optional)
        </label>
        <textarea
          name="notes"
          rows={3}
          maxLength={500}
          placeholder="Audience, network size, social handles…"
          className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm shadow-card focus:border-primary focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:opacity-90"
      >
        {submitted ? "Resend on WhatsApp" : "Register & Get My Link"} <ArrowRight className="h-4 w-4" />
      </button>
      <p className="text-center text-xs text-muted-foreground">
        Submitting opens WhatsApp with your details prefilled.
      </p>
    </form>
  );
}

function FormField({
  label,
  name,
  required,
  placeholder,
  type = "text",
  maxLength,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm shadow-card focus:border-primary focus:outline-none"
      />
    </div>
  );
}

const INQUIRY_OPTIONS = [
  "LinkedIn Premium",
  "ChatGPT Plus",
  "Claude Pro",
  "Gemini Pro",
  "Cursor Pro",
  "Adobe Creative Cloud",
  "Canva Pro",
  "Microsoft Office",
  "Notion Business",
  "Netflix",
  "Spotify",
  "YouTube Premium",
  "Other",
];

function InquiryForm() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim().slice(0, 100);
    const mobile = String(data.get("mobile") || "").trim().slice(0, 15);
    const email = String(data.get("email") || "").trim().slice(0, 255);
    const subscription = String(data.get("subscription") || "").trim().slice(0, 100);
    const message = String(data.get("message") || "").trim().slice(0, 500);

    if (!name || !mobile) return;

    const text =
      `Hi, I'd like to enquire about a subscription.\n\n` +
      `Name: ${name}\n` +
      `Mobile: ${mobile}\n` +
      (email ? `Email: ${email}\n` : "") +
      (subscription ? `Interested In: ${subscription}\n` : "") +
      (message ? `Message: ${message}\n` : "");

    window.open(`https://wa.me/918770066995?text=${encodeURIComponent(text)}`, "_blank");
    setSubmitted(true);
  };

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Name" name="name" required placeholder="Your name" maxLength={100} />
        <FormField label="Mobile Number" name="mobile" required type="tel" placeholder="+91 …" maxLength={15} />
      </div>
      <FormField label="Email (optional)" name="email" type="email" placeholder="you@example.com" maxLength={255} />
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Subscription Interested In
        </label>
        <select
          name="subscription"
          defaultValue=""
          className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm shadow-card focus:border-primary focus:outline-none"
        >
          <option value="" disabled>Select a subscription</option>
          {INQUIRY_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Message (optional)
        </label>
        <textarea
          name="message"
          rows={3}
          maxLength={500}
          placeholder="Tell us anything else we should know…"
          className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm shadow-card focus:border-primary focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:opacity-90"
      >
        <Send className="h-4 w-4" />
        {submitted ? "Book a Call" : "Book a Call"}
      </button>
      <p className="text-center text-xs text-muted-foreground">
        We'll never spam you. Your details go straight to our WhatsApp support.
      </p>
    </form>
  );
}

function TestimonialCard({ testimonial: t }: { testimonial: Testimonial }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const screenshots = t.screenshots ?? [];
  const total = screenshots.length;
  const current = screenshots[index];

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };
  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-elegant">
      <div className="flex gap-0.5 text-gold">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
            <path d="M10 1.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L10 14.9l-5.25 2.75 1-5.85L1.5 7.65l5.9-.85L10 1.5z" />
          </svg>
        ))}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-foreground/90">"{t.quote}"</p>
      {total > 0 && (
        <div className="mt-5">
          <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
            WhatsApp chat screenshots
          </p>
          <div className="mt-2 flex gap-2">
            {screenshots.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => openAt(i)}
                className="group relative h-16 w-12 overflow-hidden rounded-md border border-border bg-muted/40 transition hover:border-gold hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-gold"
                aria-label={`Open ${t.name} chat screenshot ${i + 1}`}
              >
                <img
                  src={typeof s.src === "object" && s.src !== null && "src" in s.src ? s.src : s.src}
                  alt={s.alt}
                  className="h-full w-full object-cover object-top transition group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="mt-5 border-t border-border/60 pt-4">
        <div className="font-display text-sm font-semibold">{t.name}</div>
        <div className="text-xs text-muted-foreground">{t.role}</div>
      </div>

      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            onOpenAutoFocus={(e) => e.preventDefault()}
            className="fixed left-1/2 top-1/2 z-50 flex w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-3 outline-none"
          >
            <DialogPrimitive.Title className="sr-only">
              {t.name} — chat screenshot {index + 1} of {total}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              {current?.alt}
            </DialogPrimitive.Description>

            <div className="flex items-center justify-between text-xs font-medium text-white/90">
              <span className="rounded-md bg-white/10 px-2 py-1 backdrop-blur">
                {index + 1} / {total}
              </span>
              <DialogPrimitive.Close
                aria-label="Close"
                className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1 text-white/90 backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <X className="h-3.5 w-3.5" />
                Close
              </DialogPrimitive.Close>
            </div>

            <div className="relative">
              {current && (
                <img
                  src={typeof current.src === "object" && current.src !== null && "src" in current.src ? current.src.src : current.src}
                  alt={current.alt}
                  className="h-auto max-h-[78vh] w-full rounded-lg object-contain"
                />
              )}
              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous screenshot"
                    className="absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-md bg-black/60 text-white backdrop-blur transition hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white/40"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next screenshot"
                    className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-md bg-black/60 text-white backdrop-blur transition hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white/40"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {total > 1 && (
              <div className="flex justify-center gap-1.5">
                {screenshots.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Go to screenshot ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"}`}
                  />
                ))}
              </div>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
}
