"use client";

import { useEffect, useState, use, useMemo } from "react";
import { Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { InquiryForm } from "@/components/marketing/home/main/inquiry-form";
import { ALL_TOOLS } from "@/data/tools";
import { Tool } from "@/types";
import { SiteHeader, SiteFooter } from "@/components/marketing/layout/site-chrome";
import { ToolLogo } from "@/components/marketing/layout/tool-logo";

const CATEGORIES = ["All", "Developer", "Creative", "Product/Marketing", "Business/Operations", "OTT", "Credits"] as const;
type Category = (typeof CATEGORIES)[number];
 
const CATEGORY_LABELS: Record<Category, string> = {
  All: "All",
  Developer: "Developer Tools",
  Creative: "Design & Creative Tools",
  "Product/Marketing": "Product, Marketing & Growth",
  "Business/Operations": "Business & Operations",
  OTT: "OTT Platforms",
  Credits: "Platform Credits",
};

export default function RefCodeLandingPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const uppercaseCode = code.toUpperCase();
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [, setDiscountAmount] = useState(500);

  useEffect(() => {
    async function trackClickAndValidate() {
      try {
        const clickRes = await fetch("/api/public/referral/track-click", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: uppercaseCode })
        });

        if (!clickRes.ok) {
          setStatus("error");
          return;
        }

        const infoRes = await fetch(`/api/public/referral/${uppercaseCode}`);
        if (infoRes.ok) {
          const info = await infoRes.json();
          setDiscountAmount(info.discountAmount);
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("Referral landing click tracking failed:", err);
        setStatus("error");
      }
    }

    trackClickAndValidate();
  }, [uppercaseCode]);

  const groupedTools = useMemo(() => {
    const groups: Record<Category, Tool[]> = {
      All: [], Developer: [], Creative: [], "Product/Marketing": [], "Business/Operations": [], OTT: [], Credits: [],
    };
    ALL_TOOLS.forEach((t) => {
      if (t.category in groups) {
        groups[t.category as Category].push(t);
      }
    });
    return CATEGORIES.filter((c) => c !== "All")
      .map((c) => ({ category: c, tools: groups[c] || [] }))
      .filter((g) => g.tools.length > 0);
  }, []);

  return (
    <div className="min-h-screen bg-background relative flex flex-col overflow-hidden">
      <SiteHeader />
      
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[10%] left-[-15%] w-[50%] h-[50%] bg-brand/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[50%] h-[50%] bg-gold/5 rounded-full blur-[140px] pointer-events-none" />

      <main className="flex-1 relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center gap-4 text-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-brand" />
            <h2 className="text-xl font-display font-bold">Activating Referral Link...</h2>
            <p className="text-sm text-muted-foreground">Verifying invitation code {uppercaseCode}</p>
          </div>
        )}

        {status === "error" && (
          <div className="max-w-md mx-auto bg-card/30 border border-destructive/15 backdrop-blur-xl rounded-3xl p-8 shadow-elegant text-center flex flex-col items-center gap-4 mt-10">
            <div className="h-14 w-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">Link Expired or Invalid</h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              The referral code <span className="font-mono font-semibold text-destructive">{uppercaseCode}</span> does not exist or has been deactivated.
            </p>
            <Link href="/" className="mt-2 inline-flex h-11 items-center justify-center px-6 text-sm font-semibold rounded-xl bg-card border border-border/20 text-foreground hover:bg-soft transition-all">
              Go to Homepage
            </Link>
          </div>
        )}

        {status === "success" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start"
          >
            {/* LEFT COLUMN: Inquiry Form */}
            <div className="space-y-8">
              {/* Clean Header */}
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" /> Referral Active
                </span>
                <h1 className="text-3xl font-display font-extrabold tracking-tight mt-2 text-foreground">
                  Claim your discount
                </h1>
                <p className="text-sm text-muted-foreground">
                  Fill out the form below to get started with your premium subscriptions.
                </p>
              </div>

              {/* Inquiry Form Wrapper */}
              <div className="bg-card/25 border border-border/10 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-elegant">
                <InquiryForm />
                
                {/* Visit Website Link */}
                <div className="mt-6 pt-6 border-t border-border/10">
                  <Link
                    href="/"
                    className="w-full h-12 inline-flex items-center justify-center rounded-xl border border-border/15 bg-card/40 backdrop-blur-md text-sm font-semibold text-foreground hover:bg-card/70 hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer shadow-soft"
                  >
                    Visit Website
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Tools List */}
            <div className="lg:sticky lg:top-24 h-full max-h-[85vh] flex flex-col">
              <div className="mb-6 flex flex-col">
                <h2 className="text-3xl font-display font-bold text-foreground">Our Services</h2>
                <p className="text-sm text-muted-foreground mt-1">Explore 80+ premium subscriptions at up to 50% off.</p>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 sm:pr-4 pb-12 space-y-10 custom-scrollbar">
                {groupedTools.map(({ category, tools }) => (
                  <div key={category} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-display text-sm font-bold tracking-tight text-foreground/80 uppercase">
                        {CATEGORY_LABELS[category]}
                      </h3>
                      <div className="h-px flex-1 bg-gradient-to-r from-border/80 to-transparent" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {tools.map((t) => (
                        <ToolTile key={`${t.name}-${t.category}`} tool={t} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </main>
      
      <SiteFooter />
    </div>
  );
}

function ToolTile({ tool }: { tool: Tool }) {
  return (
    <div className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card/60 p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md duration-200">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg p-2 bg-secondary/40">
        <ToolLogo tool={tool} className="h-full w-full" />
      </div>
      <div className="text-center text-xs font-semibold text-foreground min-w-0 w-full truncate" title={tool.name}>
        {tool.name}
      </div>
    </div>
  );
}
