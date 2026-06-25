"use client";

import { SiteHeader, SiteFooter } from "@/components/marketing/layout/site-chrome";
import { WishlistSection } from "@/components/marketing/home/wishlist-section";
import { HeroSection } from "@/components/marketing/home/main/hero-section";
import { MarqueeSection } from "@/components/marketing/home/main/marquee-section";
import { TopDemandSection } from "@/components/marketing/home/main/top-demand-section";
import { AboutSection } from "@/components/marketing/home/main/about-section";
import { HowItWorksSection } from "@/components/marketing/home/main/how-it-works-section";
import { PricingTransparencySection } from "@/components/marketing/home/main/pricing-transparency-section";
import { ReferralProgramSection } from "@/components/marketing/home/main/referral-program-section";
import { WhyChooseUsSection } from "@/components/marketing/home/main/why-choose-us-section";
import { TestimonialsSection } from "@/components/marketing/home/main/testimonials-section";
import { ContactSection } from "@/components/marketing/home/main/contact-section";

export function HomePageClient() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* HERO */}
        <HeroSection />

        {/* LOGO MARQUEE */}
        <MarqueeSection />

        {/* TOP-DEMAND LOGO GRID */}
        <TopDemandSection />

        {/* ABOUT US */}
        <AboutSection />

        {/* SUBSCRIPTION WISHLIST */}
        <WishlistSection />

        {/* HOW IT WORKS */}
        <HowItWorksSection />

        {/* WHY LOWER PRICES */}
        <PricingTransparencySection />

        {/* REFERRAL PROGRAM */}
        <ReferralProgramSection />

        {/* WHY CHOOSE US */}
        <WhyChooseUsSection />

        {/* TESTIMONIALS */}
        <TestimonialsSection />

        {/* GET IN TOUCH */}
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
