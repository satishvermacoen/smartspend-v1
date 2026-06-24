"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/marketing/layout/site-chrome";
import { ALL_TOOLS } from "@/data/tools";
import { ToolLogo } from "@/components/marketing/layout/tool-logo";
import { Tool } from "@/types";

const CATEGORIES = ["All", "AI", "Professional", "Creative", "Developer", "Productivity", "Marketing", "Credits"] as const;
type Category = (typeof CATEGORIES)[number];

export function ToolsPageClient() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category>("All");

  const filtered = useMemo(() => {
    return ALL_TOOLS.filter((t) => {
      const matchesCat = cat === "All" || t.category === cat;
      const matchesQ = !query || t.name.toLowerCase().includes(query.toLowerCase());
      return matchesCat && matchesQ;
    });
  }, [query, cat]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border bg-gradient-soft">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              All <span className="text-gradient">Subscriptions</span>
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              {ALL_TOOLS.length}+ premium subscriptions — AI, Professional, Creative, Developer tools & cloud credits. Up to 50% off.
            </p>

            {/* search */}
            <div className="relative mt-6 max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search subscriptions…"
                className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm shadow-card outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40"
              />
            </div>

            {/* categories */}
            <div className="mt-5 -mx-4 overflow-x-auto px-4 pb-1">
              <div className="flex w-max gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    type="button"
                    className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
                      cat === c
                        ? "border-transparent bg-gradient-brand text-primary-foreground shadow-soft"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <p className="py-20 text-center text-muted-foreground">No subscriptions match your search.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
              {filtered.map((t) => (
                <ToolCard key={`${t.name}-${t.category}`} tool={t} />
              ))}
            </div>
          )}
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-card">
            <h2 className="font-display text-2xl font-bold">Don't see what you need?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We source many more subscriptions on request. Drop us a message.
            </p>
            <a
              href="https://wa.me/918770066995"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
            >
              Request a subscription
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <a
      href={`https://wa.me/918770066995?text=${encodeURIComponent(`Hi, I'd like pricing for ${tool.name}`)}`}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-4 text-center shadow-card transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft"
    >
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary/60 p-2">
        <ToolLogo tool={tool} className="h-full w-full" />
      </div>
      <div className="min-w-0">
        <div className="line-clamp-2 text-sm font-semibold leading-tight">{tool.name}</div>
        <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {tool.category}
        </div>
      </div>
      <span className="mt-auto rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-primary">
        Up to 50% off
      </span>
    </a>
  );
}
