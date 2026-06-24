import { MessageCircle, Gift, Mail, Rocket, LifeBuoy } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/marketing/layout/site-chrome";
import { FaqItem } from "@/components/marketing/home/faq-item";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works & FAQs — SpendSmart Subscriptions",
  description: "Learn how SpendSmart Subscriptions activate premium subscriptions on your own account via official gift vouchers and email-based activation. Read our FAQs.",
  openGraph: {
    title: "How It Works — SpendSmart Subscriptions",
    description: "Three simple steps: raise an inquiry, receive activation details, start using your subscription.",
  },
};

const STEPS = [
  {
    icon: Gift,
    title: "Receive Your Activation Details",
    desc:
      "Once your subscription is confirmed, you will either receive an activation gift voucher link or be asked to share your email ID, depending on the subscription.",
  },
  {
    icon: Mail,
    title: "Activate Your Subscription",
    desc:
      "Gift Voucher Activation: You will receive an activation link along with simple instructions. Just follow the steps provided and redeem the voucher on the respective platform — in most cases, it only takes a few clicks. Email-Based Activation: For certain subscriptions, you only need to share your email ID, and our team will complete the activation for you.",
  },
  {
    icon: Rocket,
    title: "Start Using Your Subscription",
    desc: "Once activated, you can immediately access and enjoy all the benefits of your subscription.",
  },
];

const FAQS = [
  {
    q: "Are the subscriptions activated on my own account?",
    a: "Yes. In most cases the subscription is activated directly on your own existing account using your own email ID, so you continue with the same profile, settings, and saved data. There is no shared login and no need to hand over your password — you remain the sole owner of the subscription.",
  },
  {
    q: "How exactly does the activation process work?",
    a: "Once you confirm your order, activation happens in one of two ways. For voucher-based subscriptions, you receive an official gift voucher or redemption link to apply on your account by following the simple steps we share. For email-based subscriptions, you only share the email ID, and our team applies the official voucher and completes the activation for you.",
  },
  {
    q: "Do I need to create a new account or change my login?",
    a: "No. You can continue using the same account you already have with the platform — no new sign-up or password change is required. If you don't have an account on that platform yet, you can create one normally on the official website and we will activate the subscription on it.",
  },
  {
    q: "How long does activation usually take?",
    a: "Most activations are completed within a few minutes to a couple of hours after the required details are shared and payment is done. A few subscriptions may take slightly longer depending on the platform's redemption process, usually within the same working day. Our team keeps you updated until activation is confirmed.",
  },
  {
    q: "Why are your prices lower than the official website?",
    a: "We secure subscriptions through official promotional campaigns, regional pricing differences, partner offers, and gift voucher programs that the platforms themselves run. By making use of these legitimate offers, we lower the cost and pass the savings on to you — while you still receive the exact same official subscription and features.",
  },
  {
    q: "Are the subscriptions 100% genuine and official?",
    a: "Yes. Every subscription we deliver is the official subscription from the original platform, activated through approved methods such as official gift vouchers and authorised promotional programs. You get the same features, updates, and experience as someone who paid full price directly.",
  },
  {
    q: "Is this safe? Can my account get suspended?",
    a: "Activations are done only through legitimate, platform-approved methods, which is why your account stays safe and works normally. We never use methods that violate any platform's terms of service, and our team takes full responsibility to resolve the rare issue that may arise.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept UPI, bank transfer, and other commonly used payment methods in India. Once you confirm your order, our team shares the available payment options along with the exact amount, so everything stays clear and straightforward before you pay.",
  },
  {
    q: "Will my subscription stop working before the validity ends?",
    a: "No. Subscriptions activated through official gift vouchers and approved methods remain active for the full validity period of your plan — whether that is one month, three months, six months, or a year. In the rare event of any issue with an active subscription, our team is available to resolve it.",
  },
  {
    q: "What if I face an issue during or after activation?",
    a: "Our support team is available to guide you through any activation step and to help resolve any issue that may come up. If something does not work as expected after activation, simply reach out with the details and we will fix the issue, re-activate the subscription, or arrange a suitable replacement.",
  },
  {
    q: "What is your refund and replacement policy?",
    a: "If you cancel your order before the subscription is activated, a refund can be processed. Once the subscription has been successfully activated on your account, refunds are generally not possible, as the voucher has already been redeemed. However, in case of any activation-related issue, a problem in using the subscription, any validity-related concern, or any issue from our side that we are unable to resolve, our team will review the case and provide a fair replacement or alternative resolution wherever possible.",
  },
  {
    q: "Can I renew my subscription with you when it expires?",
    a: "Yes. When your current subscription is nearing expiry, simply reach out to us again and we will help you renew it at the same kind of discounted pricing. Many of our customers continue to renew with us regularly because the savings add up over time.",
  },
  {
    q: "How can I contact SpendSmart Subscriptions?",
    a: "You can reach us through our website, WhatsApp, email, Instagram, or any of our official channels. Our team responds quickly during working hours and is happy to help with any question about a subscription, pricing, activation, or after-sales support.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-gradient-hero">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <p className="font-display text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              How it works
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Getting started is <span className="text-gradient">simple.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Once you raise an inquiry through our website, WhatsApp, email, or any of our official
              channels, our team will connect with you to understand your subscription requirements
              and provide the most suitable solution based on your needs.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-primary-foreground shadow-soft">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div className="text-xs font-bold tracking-wider text-gradient">
                    STEP {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-start gap-4 rounded-2xl border border-primary/30 bg-secondary/60 p-6 shadow-soft">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-card text-primary">
              <LifeBuoy className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold">Need Help?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                If you face any issues during the activation process, our team will be available to
                guide and assist you at every step.
              </p>
              <a
                href="https://wa.me/918770066995?text=Hi%2C%20I%20need%20help%20with%20activation"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-soft"
              >
                <MessageCircle className="h-3.5 w-3.5" /> Chat with our team
              </a>
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-muted-foreground">Everything you need to know before getting started.</p>

          <div className="mt-8 space-y-3">
            {FAQS.map((f, i) => (
              <FaqItem key={i} q={f.q} a={f.a} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
