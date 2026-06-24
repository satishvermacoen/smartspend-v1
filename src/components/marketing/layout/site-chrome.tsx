"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const WhatsAppIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
  </svg>
);

const SpendSmartMark = ({ className = "h-full w-full" }: { className?: string }) => (
  <img src="/logo.png" className={`${className} object-contain rounded-lg`} alt="SpendSmart logo" />
);

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="SpendSmart Subscriptions">
          <span className="grid h-12 w-12 place-items-center sm:h-14 sm:w-14">
            <SpendSmartMark />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
            SpendSmart
            <span className="ml-1.5 text-gradient">Subscriptions</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground lg:flex">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/tools" className="hover:text-foreground transition-colors">Subscriptions</Link>
          <Link href="/#how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
          <Link href="/#referral" className="hover:text-foreground transition-colors">Referral Program</Link>
          <Link href="/#about" className="hover:text-foreground transition-colors">About Us</Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Navigation Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="outline"
              asChild
              className="rounded-full border-border/60 px-5 text-sm font-semibold hover:bg-muted"
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="rounded-full bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-90 border-0 px-5 text-sm font-semibold"
              >
              <Link href="/signup">Sign Up</Link>
            </Button>
             <Button
              variant="default"
              asChild
                className="rounded-full bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-90 border-0 px-5 text-sm font-semibold"
              >
              <a
                href="https://wa.me/918770066995"
                target="_blank"
                rel="noreferrer"
              >
                <span>Enquire Now</span>
              </a>
            </Button>
          </div>

          {/* Mobile Menu Trigger & Drawer */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] p-6 flex flex-col justify-between">
                <div className="flex flex-col gap-6">
                  <SheetHeader className="p-0 border-b border-border/40 pb-4">
                    <SheetTitle>
                      <Link href="/" className="flex items-center gap-2.5" aria-label="SpendSmart Subscriptions">
                        <span className="grid h-10 w-10 place-items-center">
                          <SpendSmartMark />
                        </span>
                        <span className="font-display text-base font-extrabold tracking-tight text-foreground">
                          SpendSmart
                          <span className="ml-1 text-gradient">Subs</span>
                        </span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-4 text-base font-medium">
                    <Link href="/" className="hover:text-foreground transition-colors py-1">Home</Link>
                    <Link href="/tools" className="hover:text-foreground transition-colors py-1">Subscriptions</Link>
                    <Link href="/#how-it-works" className="hover:text-foreground transition-colors py-1">How It Works</Link>
                    <Link href="/#referral" className="hover:text-foreground transition-colors py-1">Referral Program</Link>
                    <Link href="/#about" className="hover:text-foreground transition-colors py-1">About Us</Link>
                  </nav>
                </div>
                <div className="flex flex-col gap-3 border-t border-border/40 pt-6">
                  <Button
                    variant="outline"
                    asChild
                    className="w-full rounded-full text-sm font-semibold hover:bg-muted"
                  >
                    <a
                      href="https://wa.me/918770066995"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <span>Enquire Now</span>
                    </a>
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      asChild
                      className="flex-1 rounded-full border-border/60 text-sm font-semibold hover:bg-muted"
                    >
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button
                      variant="default"
                      asChild
                      className="flex-1 rounded-full bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-90 border-0 text-sm font-semibold"
                    >
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-foreground text-background">
      <div className="border-b border-background/10 bg-gradient-to-r from-[#0b3d2e] via-[#0f5132] to-[#0b3d2e]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#25D366] text-white shadow-soft">
              <WhatsAppIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-base font-bold text-background">
                Join our WhatsApp community
              </p>
              <p className="text-xs text-background/70">
                Early drops, deal alerts and member-only subscription offers.
              </p>
            </div>
          </div>
          <a
            href="https://chat.whatsapp.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-2.5 text-sm font-semibold text-white shadow-elegant transition hover:opacity-90"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Join Community
          </a>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-11 w-11 place-items-center">
                <SpendSmartMark />
              </span>
              <span className="font-display text-lg font-extrabold leading-none">
                <span className="text-background">SpendSmart</span>{" "}
                <span className="text-gold">Subscriptions</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-background/65">
              Helping professionals, creators, and businesses access premium AI, productivity,
              and creative subscriptions at 50%+ lower prices through a seamless gift voucher
              activation process across India.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://wa.me/918770066995"
                target="_blank"
                rel="noreferrer"
                aria-label="Chat on WhatsApp"
                className="grid h-10 w-10 place-items-center rounded-full bg-[#25D366] text-white shadow-soft transition hover:opacity-90"
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
              <a
                href="mailto:support@spendsmartsubscriptions.in"
                aria-label="Email us on Gmail"
                className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-soft transition hover:opacity-90"
              >
                <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
                  <path fill="#4285F4" d="M44 35.5V13.6c0-1.5-1.2-2.6-2.6-2.6h-1.7L24 22 8.3 11H6.6C5.2 11 4 12.1 4 13.6v21.9C4 37 5.2 38 6.6 38H12V21.8l12 8.7 12-8.7V38h5.4c1.4 0 2.6-1 2.6-2.5z"/>
                  <path fill="#34A853" d="M12 38V21.8L4 15.8v19.7C4 37 5.2 38 6.6 38H12z"/>
                  <path fill="#FBBC04" d="M36 38h5.4c1.4 0 2.6-1 2.6-2.5V15.8l-8 6V38z"/>
                  <path fill="#EA4335" d="M44 13.6c0-1.5-1.2-2.6-2.6-2.6h-1.7L24 22 8.3 11H6.6C5.2 11 4 12.1 4 13.6v2.2l8 6 12 8.7 12-8.7 8-6v-2.2z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-gold">Quick Links</h3>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/" className="text-sm text-background/65 transition-colors hover:text-gold">Home</Link></li>
              <li><Link href="/#about" className="text-sm text-background/65 transition-colors hover:text-gold">About Us</Link></li>
              <li><Link href="/tools" className="text-sm text-background/65 transition-colors hover:text-gold">Subscriptions</Link></li>
              <li><Link href="/how-it-works#faq" className="text-sm text-background/65 transition-colors hover:text-gold">FAQs</Link></li>
              <li><Link href="/#referral" className="text-sm text-background/65 transition-colors hover:text-gold">Referral Program</Link></li>
              <li><Link href="/privacy" className="text-sm text-background/65 transition-colors hover:text-gold">Privacy Policy</Link></li>
              <li><Link href="/#how-it-works" className="text-sm text-background/65 transition-colors hover:text-gold">How It Works</Link></li>
              <li><Link href="/#why-lower-prices" className="text-sm text-background/65 transition-colors hover:text-gold">How Our Prices Are Lower</Link></li>
            </ul>
          </div>

          {/* Reach Us */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-gold">Reach Us</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-background/65">
              <li><a href="tel:918770066995" className="transition-colors hover:text-gold">+91 8770066995</a></li>
              <li><a href="mailto:support@spendsmartsubscriptions.in" className="transition-colors hover:text-gold">support@spendsmartsubscriptions.in</a></li>
              <li>Mon–Sat, 10 AM – 8 PM IST</li>
              <li className="text-background/45">SpendSmartSubscriptions.in</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-background/10 pt-6 text-center text-xs text-background/45 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} SpendSmart Subscriptions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export { WhatsAppIcon };
