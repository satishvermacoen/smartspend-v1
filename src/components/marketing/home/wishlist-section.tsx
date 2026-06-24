"use client";

import { useMemo, useState } from "react";
import { Check, Plus, Search, Send, Sparkles, X } from "lucide-react";
import { ALL_TOOLS } from "@/data/tools";
import { ToolLogo } from "@/components/marketing/layout/tool-logo";

const WA_NUMBER = "918770066995";

export function WishlistSection() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [other, setOther] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const uniqueTools = useMemo(() => {
    const seen = new Set<string>();
    return ALL_TOOLS.filter((t) => {
      if (seen.has(t.name)) return false;
      seen.add(t.name);
      return true;
    });
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return uniqueTools;
    return uniqueTools.filter((t) => t.name.toLowerCase().includes(q));
  }, [uniqueTools, query]);

  function toggle(name: string) {
    setPicked((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedOther = other.trim();

    if (!trimmedName || trimmedName.length > 80) {
      setError("Please enter your name (max 80 characters).");
      return;
    }
    if (!/^[+0-9\s\-()]{7,20}$/.test(trimmedPhone)) {
      setError("Please enter a valid phone number.");
      return;
    }
    if (picked.length === 0 && !trimmedOther) {
      setError("Pick at least one subscription or tell us what you use.");
      return;
    }
    if (trimmedOther.length > 300) {
      setError("Please keep the 'others' field under 300 characters.");
      return;
    }

    const lines = [
      `Hi, I'd like to share my subscription wishlist.`,
      ``,
      `Name: ${trimmedName}`,
      `Phone: ${trimmedPhone}`,
      picked.length ? `From your list: ${picked.join(", ")}` : null,
      trimmedOther ? `Others I use: ${trimmedOther}` : null,
      ``,
      `Please let me know if you can get any of these at a discount.`,
    ].filter(Boolean) as string[];

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <section
      id="wishlist"
      className="border-y border-border bg-secondary/40 py-20"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary shadow-soft backdrop-blur">
            Subscription Wishlist
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Tell us which subscriptions you use{" "}
            <span className="text-gradient">regularly.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            AI, professional, OTT, creative, productivity — anything you pay for
            every month. If we can source it at a discount, we'll reach out to you.
          </p>
        </div>

        {!open ? (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:opacity-90"
            >
              <Sparkles className="h-4 w-4" />
              Share your wishlist
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Your name
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                  placeholder="e.g. Aditi Sharma"
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  WhatsApp / phone
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={20}
                  placeholder="e.g. +91 98765 43210"
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </label>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Subscriptions you're interested in
                </span>
                <button
                  type="button"
                  onClick={() => setPickerOpen((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-secondary"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {pickerOpen ? "Close list" : "Pick from our list"}
                </button>
              </div>

              {picked.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {picked.map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                    >
                      {p}
                      <button
                        type="button"
                        onClick={() => toggle(p)}
                        aria-label={`Remove ${p}`}
                        className="rounded-full p-0.5 transition hover:bg-primary/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {pickerOpen && (
                <div className="mt-4 rounded-2xl border border-border bg-background p-4">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search subscriptions..."
                      className="w-full rounded-xl border border-border bg-card px-9 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="mt-3 grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
                    {filtered.map((t) => {
                      const active = picked.includes(t.name);
                      return (
                        <button
                          key={t.name}
                          type="button"
                          onClick={() => toggle(t.name)}
                          className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition ${
                            active
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-card text-foreground hover:bg-secondary"
                          }`}
                        >
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-secondary/60 p-1">
                            <ToolLogo tool={t} className="h-full w-full" />
                          </span>
                          <span className="flex-1 truncate">{t.name}</span>
                          {active && <Check className="h-3.5 w-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                    {filtered.length === 0 && (
                      <p className="col-span-full py-6 text-center text-xs text-muted-foreground">
                        No matches. Add it under "Others" below.
                      </p>
                    )}
                  </div>
                </div>
              )}

              <label className="mt-5 block">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Others (not in the list)
                </span>
                <textarea
                  value={other}
                  onChange={(e) => setOther(e.target.value)}
                  maxLength={300}
                  rows={3}
                  placeholder="e.g. Notion AI, Apple One, Audible..."
                  className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>
            </div>

            {error && (
              <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              <p className="text-xs text-muted-foreground">
                We'll try our best to get them all at a discount.
              </p>
              <div className="flex w-full gap-3 sm:w-auto">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary sm:flex-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:opacity-90 sm:flex-none"
                >
                  <Send className="h-4 w-4" />
                  Send my wishlist
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
