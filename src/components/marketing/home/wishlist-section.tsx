"use client";

import { useMemo, useState } from "react";
import { Check, Plus, Search, Send, Sparkles, X, Loader2, KeyRound, ExternalLink, MessageSquare, Copy } from "lucide-react";
import { ALL_TOOLS } from "@/data/tools";
import { ToolLogo } from "@/components/marketing/layout/tool-logo";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

const WA_NUMBER = "918770066995";

interface WishlistResponse {
  success: boolean;
  message: string;
  isNewUser: boolean;
  loginCredentials: {
    username: string;
    email: string;
    password: string;
  } | null;
}

export function WishlistSection() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [other, setOther] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [responseData, setResponseData] = useState<WishlistResponse | null>(null);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedOther = other.trim();

    if (!trimmedName || trimmedName.length > 80) {
      setError("Please enter your name (max 80 characters).");
      setLoading(false);
      return;
    }
    if (!/^[+0-9\s\-()]{7,20}$/.test(trimmedPhone)) {
      setError("Please enter a valid phone number.");
      setLoading(false);
      return;
    }
    if (picked.length === 0 && !trimmedOther) {
      setError("Pick at least one subscription or tell us what you use.");
      setLoading(false);
      return;
    }
    if (trimmedOther.length > 300) {
      setError("Please keep the 'others' field under 300 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/public/wishlist/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          phone: trimmedPhone,
          picked,
          other: trimmedOther
        })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to submit wishlist.");
      }

      setResponseData(json);
      setSubmitted(true);
      toast.success(json.message || "Wishlist submitted successfully!");
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  const handleCopyPassword = () => {
    if (!responseData?.loginCredentials?.password) return;
    navigator.clipboard.writeText(responseData.loginCredentials.password);
    setCopied(true);
    toast.success("Password copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const lines = [
      `Hi, I'd like to share my subscription wishlist.`,
      ``,
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      picked.length ? `From your list: ${picked.join(", ")}` : null,
      other.trim() ? `Others I use: ${other.trim()}` : null,
      ``,
      `Please let me know if you can get any of these at a discount.`,
    ].filter(Boolean) as string[];

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="wishlist"
      className="relative overflow-hidden border-y border-border/30 bg-secondary/20 py-24 sm:py-28"
    >
      {/* Background decorations */}
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl opacity-30" />
      <div className="absolute left-0 bottom-0 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl opacity-35" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Subscription Wishlist
          </span>
          <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Tell us what you use{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">regularly.</span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            AI, professional, OTT, creative, developer tools — anything you pay for monthly. If we can source it at up to 50% discount, we will notify you immediately.
          </p>
        </div>

        {submitted && responseData ? (
          <div className="mt-12 border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
            {/* Glow accent */}
            <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />

            <div className="text-center space-y-2">
              <div className="inline-flex h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 items-center justify-center shadow-soft">
                <Sparkles className="h-6 w-6 animate-pulse" />
              </div>
              <h3 className="font-display font-extrabold text-xl text-foreground">Wishlist Submitted!</h3>
              <p className="text-xs text-muted-foreground">
                {responseData.isNewUser 
                  ? "We've created a temporary profile for you. Log in below to track discount statuses."
                  : "We've added this wishlist to your existing account profile."}
              </p>
            </div>

            {responseData.isNewUser && responseData.loginCredentials && (
              /* Auto Generated Login Info */
              <div className="border border-border bg-card/60 rounded-xl p-4 space-y-3.5">
                <div className="flex items-center gap-2 font-bold text-xs text-muted-foreground uppercase tracking-wider">
                  <KeyRound className="h-4 w-4 text-primary" /> Login Profile Created
                </div>
                <p className="text-xs text-muted-foreground">Log in with either your Mobile number or Email using these credentials:</p>
                <div className="grid gap-2 text-xs sm:grid-cols-2">
                  <div>
                    <span className="text-muted-foreground block">Mobile / Username</span>
                    <span className="font-mono font-bold text-foreground">{responseData.loginCredentials.username}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Default Password</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-foreground">{responseData.loginCredentials.password}</span>
                      <button 
                        onClick={handleCopyPassword}
                        className="text-primary hover:text-emerald-400 transition-colors cursor-pointer shrink-0"
                        title="Copy Password"
                      >
                        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleWhatsAppShare}
                className="flex-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-soft transition-all cursor-pointer"
              >
                <MessageSquare className="h-4.5 w-4.5" /> Share on WhatsApp
              </button>
              <Link
                href="/login"
                className="flex-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-card border border-border hover:bg-soft text-foreground font-bold text-sm shadow-soft transition-all"
              >
                Log in to Dashboard <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : !open ? (
          <div className="mt-12 flex justify-center">
            <Button
              type="button"
              onClick={() => setOpen(true)}
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Sparkles className="h-4 w-4 animate-pulse" />
              Share Your Wishlist
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-12 rounded-3xl border border-border/40 bg-card/45 backdrop-blur-md p-6 sm:p-10 shadow-xl shadow-primary/5 transition-all duration-300"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/80">
                  Your Name
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                  placeholder="e.g. Aditi Sharma"
                  className="mt-2.5 w-full rounded-2xl border border-border/50 bg-background/50 backdrop-blur px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition focus:border-primary focus:bg-background focus:ring-1 focus:ring-primary"
                  required
                />
              </label>
              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/80">
                  WhatsApp / Phone
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={20}
                  placeholder="e.g. +91 98765 43210"
                  className="mt-2.5 w-full rounded-2xl border border-border/50 bg-background/50 backdrop-blur px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition focus:border-primary focus:bg-background focus:ring-1 focus:ring-primary"
                  required
                />
              </label>
            </div>

            <div className="mt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/80">
                  Select Subscriptions Interested In
                </span>
                <Button
                  type="button"
                  onClick={() => setPickerOpen((v) => !v)}
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/85 px-4.5 py-2 text-xs font-bold text-foreground transition-all duration-200 hover:bg-accent/20 hover:border-primary/30"
                >
                  <Plus className={`h-3.5 w-3.5 transition-transform duration-200 ${pickerOpen ? "rotate-45" : ""}`} />
                  {pickerOpen ? "Hide Directory" : "Browse Our List"}
                </Button>
              </div>

              {/* Selected Tags list */}
              {picked.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 rounded-2xl border border-border/30 bg-background/30 p-3">
                  {picked.map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary animate-in fade-in zoom-in-95 duration-200"
                    >
                      {p}
                      <Button
                        type="button"
                        onClick={() => toggle(p)}
                        aria-label={`Remove ${p}`}
                        className="rounded-full p-0.5 transition hover:bg-primary/20"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </span>
                  ))}
                </div>
              )}

              {/* Collapsible search directory */}
              {pickerOpen && (
                <div className="mt-4 rounded-2xl border border-border/40 bg-background/60 p-4 animate-in slide-in-from-top-2 duration-300">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search subscriptions (e.g. ChatGPT, Canva)..."
                      className="w-full rounded-xl border border-border/50 bg-card px-9 py-2.5 text-sm placeholder:text-muted-foreground/50 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="mt-4 grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
                    {filtered.map((t) => {
                      const active = picked.includes(t.name);
                      return (
                        <Button
                          key={t.name}
                          type="button"
                          onClick={() => toggle(t.name)}
                          className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left text-xs font-bold transition-all duration-200 ${
                            active
                              ? "border-primary bg-primary/10 text-primary shadow-sm"
                              : "border-border/40 bg-card text-foreground hover:bg-accent/15 hover:border-border/80"
                          }`}
                        >
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-secondary/80 p-1">
                            <ToolLogo tool={t} className="h-full w-full" />
                          </span>
                          <span className="flex-1 truncate">{t.name}</span>
                          {active && <Check className="h-4 w-4 shrink-0 text-primary animate-in zoom-in-75 duration-200" />}
                        </Button>
                      );
                    })}
                    {filtered.length === 0 && (
                      <p className="col-span-full py-8 text-center text-xs text-muted-foreground/80">
                        No matches. Add your custom tool in the field below.
                      </p>
                    )}
                  </div>
                </div>
              )}

              <label className="mt-6 block">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/80">
                  Others (not in the list)
                </span>
                <textarea
                  value={other}
                  onChange={(e) => setOther(e.target.value)}
                  maxLength={300}
                  rows={3}
                  placeholder="e.g. Notion AI, Apple One, Audible, Claude Pro..."
                  className="mt-2.5 w-full resize-none rounded-2xl border border-border/50 bg-background/50 backdrop-blur px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition focus:border-primary focus:bg-background focus:ring-1 focus:ring-primary"
                />
              </label>
            </div>

            {error && (
              <p className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-xs font-semibold text-rose-500 animate-in fade-in duration-200">
                {error}
              </p>
            )}

            <div className="mt-8 flex flex-col items-center gap-4 border-t border-border/20 pt-6 sm:flex-row sm:justify-between">
              <p className="text-xs text-muted-foreground/80">
                We will try our best to source these subscriptions at a discounted price.
              </p>
              <div className="flex w-full gap-3 sm:w-auto">
                <Button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border/60 bg-background px-5 py-3.5 text-sm font-bold text-foreground transition-all duration-200 hover:bg-accent/20 sm:flex-none"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="inline-flex flex-1 items-center justify-center gap-2.5 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 sm:flex-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Wishlist
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
