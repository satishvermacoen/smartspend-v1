import { SiteHeader, SiteFooter } from "@/components/marketing/layout/site-chrome";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — SpendSmart Subscriptions",
  description: "Privacy Policy for SpendSmart Subscriptions. How we collect, use and protect your information.",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border bg-gradient-soft">
          <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Privacy <span className="text-gradient">Policy</span>
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">Last Updated: June 2026</p>
          </div>
        </section>

        <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="prose-content space-y-8 text-[15px] leading-relaxed text-foreground">
            <p className="text-muted-foreground">
              At <strong className="text-foreground">SpendSmart Subscriptions</strong>, we respect your privacy
              and are committed to protecting the information you share with us.
            </p>

            <Section title="Information We Collect">
              <p>We may collect:</p>
              <ul>
                <li>Name</li>
                <li>Phone number</li>
                <li>Subscription requirements</li>
                <li>Information voluntarily shared during communication</li>
              </ul>
            </Section>

            <Section title="How We Use Your Information">
              <p>We use your information to:</p>
              <ul>
                <li>Process subscription orders</li>
                <li>Provide customer support</li>
                <li>Share activation and order updates</li>
                <li>Improve our services</li>
              </ul>
            </Section>

            <Section title="Information Sharing">
              <p>
                We do not sell, rent, or trade your personal information. Information may only be shared when
                required to complete a subscription activation or comply with legal obligations.
              </p>
            </Section>

            <Section title="Data Security">
              <p>
                We take reasonable measures to protect your information from unauthorized access, alteration,
                disclosure, or destruction. While no method of transmission over the internet is 100% secure,
                we strive to use industry-standard practices to safeguard your data.
              </p>
            </Section>

            <Section title="Your Rights">
              <p>
                You may request access to, correction of, or deletion of your personal information at any time
                by contacting us via email or by visiting our website.
              </p>
            </Section>

            <Section title="Contact Us">
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or how your
                information is handled, our team will be glad to assist you. You can reach out through
                email, WhatsApp, call, or by visiting our website.
              </p>
              <p>
                We aim to respond to every query promptly during our working hours and ensure your concerns
                are addressed with care and confidentiality.
              </p>
            </Section>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl font-bold tracking-tight">{title}</h2>
      <div className="mt-3 space-y-3 text-foreground/90 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_ul]:text-muted-foreground">
        {children}
      </div>
    </section>
  );
}
