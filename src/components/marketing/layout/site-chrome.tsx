import Link from "next/link";

const WhatsAppIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
  </svg>
);

const SpendSmartMark = ({ className = "h-full w-full" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} role="img" aria-label="SpendSmart logo">
    <rect width="64" height="64" rx="16" fill="url(#spendsmart-mark-gradient)" />
    <path d="M20 40c2.8 4.1 7.1 6.2 12.8 6.2 6.6 0 11.2-3.1 11.2-8 0-4.7-3.2-6.9-10.5-8.2-5.1-.9-7.2-1.6-7.2-3.9 0-2 2-3.4 5.3-3.4 3.6 0 6.2 1.3 8.2 4l5.1-4.2c-2.8-3.8-7-5.7-12.8-5.7-6.6 0-11 3.2-11 8.1 0 5.1 3.7 7.2 10.8 8.4 4.9.9 6.8 1.7 6.8 3.9 0 2.1-2.1 3.3-5.7 3.3-3.7 0-6.5-1.4-8.6-4.3L20 40Z" fill="white" />
    <path d="M45.5 15.5h6.8v6.8h-6.8zM45.5 25.3h6.8v6.8h-6.8zM52.3 22.3h-6.8l6.8-6.8v6.8Z" fill="#F59E0B" />
    <defs>
      <linearGradient id="spendsmart-mark-gradient" x1="10" y1="8" x2="56" y2="58" gradientUnits="userSpaceOnUse">
        <stop stopColor="#064E3B" />
        <stop offset="1" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
  </svg>
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
        <a
          href="https://wa.me/918770066995"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:opacity-90"
        >
          <span className="hidden sm:inline">Enquire Now</span>
          <span className="sm:hidden">Enquire</span>
        </a>
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
