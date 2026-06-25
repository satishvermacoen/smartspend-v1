"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Testimonial } from "@/types";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/marketing/layout/site-chrome";

export function TestimonialCard({ testimonial: t }: { testimonial: Testimonial }) {
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
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 duration-200">
      <div className="flex gap-0.5 text-primary">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
            <path d="M10 1.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L10 14.9l-5.25 2.75 1-5.85L1.5 7.65l5.9-.85L10 1.5z" />
          </svg>
        ))}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-foreground/90">&quot;{t.quote}&quot;</p>
      {total > 0 && (
        <div className="mt-5">
          <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
            WhatsApp chat screenshots
          </p>
          <div className="mt-2 flex gap-2">
            {screenshots.map((s, i) => (
              <Button
                key={i}
                type="button"
                onClick={() => openAt(i)}
                className="group relative h-16 w-12 overflow-hidden rounded-md border border-border bg-muted/40 transition hover:border-primary hover:shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={`Open ${t.name} chat screenshot ${i + 1}`}
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  className="h-full w-full object-cover object-top transition group-hover:scale-105"
                />
              </Button>
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
                <Image
                  src={current.src}
                  alt={current.alt}
                  className="h-auto max-h-[78vh] w-full rounded-lg object-contain"
                />
              )}
              {total > 1 && (
                <>
                  <Button
                    type="button"
                    onClick={prev}
                    aria-label="Previous screenshot"
                    className="absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-md bg-black/60 text-white backdrop-blur transition hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white/40"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    onClick={next}
                    aria-label="Next screenshot"
                    className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-md bg-black/60 text-white backdrop-blur transition hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white/40"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>

            {total > 1 && (
              <div className="flex justify-center gap-1.5">
                {screenshots.map((_, i) => (
                  <Button
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
