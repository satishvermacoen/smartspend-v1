"use client";

import { ToolLogo } from "@/components/marketing/layout/tool-logo";
import { MARQUEE_TOOLS } from "@/data/tools";

export function MarqueeSection() {
  return (
    <div className="relative mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-lg border border-border bg-card/70 py-5 backdrop-blur">
        <div className="flex w-max items-center gap-12 px-6 animate-marquee">
          {[...MARQUEE_TOOLS, ...MARQUEE_TOOLS, ...MARQUEE_TOOLS].map((t, i) => {
            const noBg = t.slug === "github";
            return (
              <div
                key={`${t.name}-${i}`}
                className="flex shrink-0 items-center gap-2 opacity-90 transition hover:opacity-100"
                title={t.name}
              >
                <ToolLogo
                  tool={t}
                  className={`h-10 w-10 shrink-0 rounded-lg ${noBg ? "" : "bg-foreground/5 p-1.5 shadow-sm ring-1 ring-border"}`}
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
  );
}
