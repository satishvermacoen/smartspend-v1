'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string | React.ReactNode;
  footer?: React.ReactNode;
  bannerTitle?: string;
  bannerDescription?: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  footer,
  bannerTitle = "Unlock Premium Access at half the cost.",
  bannerDescription = "Get genuine vouchers to your favorite subscriptions (LinkedIn Premium, ChatGPT Plus, Adobe Creative Cloud, and more) at up to 50% off."
}: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-gradient-hero font-sans antialiased overflow-hidden">
      {/* Form / Authentication Side */}
      <div className="flex flex-col p-6 md:p-10 lg:p-16 justify-center relative overflow-hidden">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />

        {/* Decorative premium glowing backgrounds */}
        <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[60%] bg-brand/10 rounded-full blur-[140px] pointer-events-none animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-[-10%] right-[-15%] w-[60%] h-[60%] bg-teal-mid/15 rounded-full blur-[140px] pointer-events-none animate-pulse duration-[10000ms]" />

        <div className="w-full max-w-[440px] mx-auto relative z-10">
          <header className="mb-8">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="h-12 w-12 rounded-2xl bg-card border border-border/10 flex items-center justify-center shadow-soft p-1.5 transition-all duration-300 group-hover:scale-105 group-hover:border-brand/20">
                <Image
                  src="/logo.png"
                  width={120}
                  height={120}
                  className="object-contain rounded-lg"
                  alt="SpendSmart logo"
                  priority
                />
              </div>
              <div className="text-left select-none">
                <span className="block font-display font-extrabold text-2xl tracking-tight text-gradient leading-none">
                  SpendSmart
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground/80 font-bold">
                  Subscriptions
                </span>
              </div>
            </Link>
          </header>

          <main className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            <div className="space-y-6">
              <div className="space-y-2 text-left">
                {title && (
                  <h1 className="text-3xl font-display font-extrabold tracking-tight text-foreground bg-gradient-to-r from-foreground via-foreground/95 to-foreground/80 bg-clip-text text-transparent">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>

              <div className="bg-card/45 backdrop-blur-2xl border border-border/15 shadow-elegant rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:border-brand/25">
                {children}
              </div>

              {footer && (
                <div className="text-center pt-4">
                  {footer}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Image Banner Side */}
      <div className="relative hidden lg:block bg-teal-deep overflow-hidden border-l border-border/10">
        {/* Subtle grid on banner for digital aesthetic texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:30px_30px] z-10 pointer-events-none" />
        <div className="absolute inset-0 z-10 bg-gradient-to-tr from-brand/20 to-transparent mix-blend-overlay" />
        
        {/* Banner visual */}
        <Image
          src="/auth-banner.png"
          alt="SpentSmart Premium Subscriptions Banner"
          fill
          className="object-cover transition-transform duration-[6000ms] hover:scale-105"
          priority
        />
        
        {/* High contrast overlay styling */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-teal-deep/95 via-teal-deep/40 to-transparent" />

        {/* Text descriptions */}
        <div className="absolute inset-0 z-30 flex flex-col justify-end p-16">
          <div className="space-y-4 max-w-xl animate-in fade-in slide-in-from-left-6 duration-750 ease-out delay-150 fill-mode-both">
            <h2 className="text-4xl font-display font-extrabold text-foreground leading-tight tracking-tight">
              {bannerTitle}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {bannerDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
