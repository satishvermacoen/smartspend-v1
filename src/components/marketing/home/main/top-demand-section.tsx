"use client";
 
import { BadgePercent, Tag, BellRing, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { TOP_DEMAND_CATEGORIES } from "@/data/tools";
import { useState } from "react";
import Image from "next/image";
import { LOGOS } from "@/data/logo-map";

function TopDemandToolLogo({ tool, className = "h-full w-full" }: { tool: any; className?: string }) {
  const nameLower = tool.name.toLowerCase();
  const [failed, setFailed] = useState(false);

  // Resolve source and scale specifically for Top Demand section
  let src: any = undefined;
  let scaleClass = "scale-[1.0]";

  if (nameLower.includes("coursera")) {
    src = "https://upload.wikimedia.org/wikipedia/commons/9/97/Coursera-Logo_Symbol.svg";
    scaleClass = "scale-[1.0]";
  } else if (nameLower.includes("nordvpn") || nameLower.includes("nord vpn")) {
    src = "https://cdn.simpleicons.org/nordvpn/4687FF";
    scaleClass = "scale-[1.0]";
  } else if (nameLower.includes("coderabbit") || nameLower.includes("code rabbit")) {
    src = "https://www.google.com/s2/favicons?domain=coderabbit.ai&sz=128";
    scaleClass = "scale-[1.0]";
  } else if (nameLower.includes("claude")) {
    src = "https://upload.wikimedia.org/wikipedia/commons/7/75/Claude_AI_logo.svg";
    scaleClass = "scale-[1.0]";
  } else if (nameLower.includes("firecrawl")) {
    src = LOGOS["firecrawl"];
    scaleClass = "scale-[1.0]";
  } else if (nameLower.includes("cursor")) {
    src = "https://upload.wikimedia.org/wikipedia/commons/e/e0/Cursor_logo.svg";
    scaleClass = "scale-[1.0]";
  } else if (nameLower.includes("rezi")) {
    src = "https://www.google.com/s2/favicons?domain=rezi.ai&sz=128";
    scaleClass = "scale-[1.0]";
  } else if (nameLower.includes("manus")) {
    src = "https://www.google.com/s2/favicons?domain=manus.im&sz=128";
    scaleClass = "scale-[1.0]";
  } else if (nameLower.includes("fireflies")) {
    src = "https://www.google.com/s2/favicons?domain=fireflies.ai&sz=128";
    scaleClass = "scale-[1.0]";
  } else if (nameLower.includes("perplexity")) {
    src = "https://www.google.com/s2/favicons?domain=perplexity.ai&sz=128";
    scaleClass = "scale-[1.0]";
  } else if (nameLower.includes("copilot") || nameLower.includes("github")) {
    src = "https://upload.wikimedia.org/wikipedia/commons/3/30/GitHub_Copilot_(2025).svg";
    scaleClass = "scale-[1.0]";
  } else {
    // For all other tools, fallback to standard LOGO_OVERRIDES local logic or tool.logo
    const LOGO_OVERRIDES_LOCAL: Record<string, any> = {
      "LinkedIn Premium": LOGOS["linkedin-premium"],
      "Microsoft Office": LOGOS["ms-office"],
      "Rezi - Resume builder": LOGOS["marquee-rezi"],
      "ChatGPT Plus": LOGOS["chatgpt-plus"],
      "Claude AI": LOGOS["claude-pro"],
      "Google Gemini": LOGOS["gemini-pro"],
      "Perplexity Pro": LOGOS["perplexity"],
      "Grok": LOGOS["grok"],
      "ElevenLabs": LOGOS["eleven-labs"],
      "Notion Business + AI": LOGOS["notion-business"],
      "Manus pro": LOGOS["marquee-manus-pro"],
      "Fireflies Pro": LOGOS["marquee-fireflies-pro"],
      "Wispr Flow": LOGOS["whisper-flow"],
      "Cursor Pro": LOGOS["cursor-pro"],
      "GitHub Copilot": LOGOS["github"],
      "Lovable Pro & Lite": LOGOS["lovable-pro"],
      "Replit": LOGOS["replit"],
      "Bolt": LOGOS["bolt"],
      "Supabase Pro": LOGOS["supabase-pro"],
      "N8N": LOGOS["n8n"],
      "Adobe Creative Cloud": LOGOS["adobe-cc"],
      "Canva Pro/Business": LOGOS["canva-pro"],
      "Envato Elements": LOGOS["elements"],
      "Descript": LOGOS["descript"],
      "Gamma Pro": LOGOS["gamma-pro"],
      "AWS Credits": LOGOS["aws-credits"],
      "Lovable Credits": LOGOS["lovable-pro"],
      "Apify Credits": LOGOS["apify-credits"],
      "V0 Credits": LOGOS["marquee-v0-credits"],
      "Cursor Credits": LOGOS["cursor-pro"],
    };

    const override = LOGO_OVERRIDES_LOCAL[tool.name];
    if (override) {
      src = override;
    } else if (tool.logo) {
      src = tool.logo;
    } else if (tool.slug) {
      src = `https://cdn.simpleicons.org/${tool.slug}/${tool.color ?? "0A66C2"}`;
    }
  }

  // Resolve StaticImageData path if it's an object
  const resolvedSrc = src && typeof src === "object" && "src" in src ? src.src : src;

  if (!resolvedSrc || failed) {
    return (
      <div
        className="grid h-full w-full place-items-center rounded-md font-display text-[11px] font-extrabold uppercase tracking-tight text-white"
        style={{ backgroundColor: `#${tool.color ?? "0A66C2"}` }}
        title={tool.name}
      >
        {tool.name
          .replace(/\b(Pro|Plus|Premium|Cloud|Credits|Business|Elements|Flow|Labs)\b/gi, "")
          .trim()
          .split(/\s+/)
          .map((w: string) => w[0])
          .join("")
          .slice(0, 2)}
      </div>
    );
  }

  return (
    <div className={`grid place-items-center p-0.5 overflow-hidden ${className}`}>
      <Image
        unoptimized
        width={96}
        height={96}
        src={resolvedSrc}
        alt={tool.name}
        className={`block h-full w-full object-contain object-center transition-transform ${scaleClass}`}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export function TopDemandSection() {

 
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative">
      <div className="text-center">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-primary sm:text-sm">
          Top Demanded Subscriptions
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Professional, AI &amp; Creative Tools
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          The exact stack today&apos;s professionals, creators and founders pay for — all in one place.
        </p>
      </div>
 
      <div className="mt-12 space-y-14">
        {TOP_DEMAND_CATEGORIES.map((cat) => (
          <div key={cat.title}>
            <div className="mb-6 flex items-center gap-4">
              <h3 className="font-display text-lg font-bold tracking-tight text-foreground sm:text-xl">
                {cat.title}
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-border via-border/60 to-transparent" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
              {cat.tools.map((tool) => (
                <div
                  key={tool.name}
                  className="group flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md relative"
                >

 
                  <div className={`flex h-20 w-20 items-center justify-center rounded-lg p-3 sm:h-24 sm:w-24 ${tool.slug === "github" ? "" : "bg-secondary/40"}`}>
                    <TopDemandToolLogo tool={tool} className="h-full w-full" />
                  </div>
                  <div className="text-center text-sm font-semibold text-foreground" title={tool.name}>
                    {tool.name}
                  </div>
                  <a
                    href={`https://wa.me/918770066995?text=${encodeURIComponent(`Hi, I'm looking for the following subscription(s): ${tool.name}. Could you please help me with the details?`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto inline-flex w-full items-center justify-center gap-1 whitespace-nowrap rounded-full border border-primary/20 bg-secondary px-2.5 py-1.5 text-[10px] font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground hover:border-transparent"
                  >
                    Get subscription details
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
 
      <div className="mt-12 flex justify-center">
        <Link
          href="/tools"
          className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-md transition hover:bg-primary/95"
        >
          <Plus className="h-5 w-5" />
          View all products
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
 
      <div className="mt-12 text-center">
        <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 sm:px-6 sm:py-4 shadow-sm max-w-full">
          <BadgePercent className="h-8 w-8 text-primary shrink-0 sm:h-10 sm:w-10" />
          <span className="font-display text-lg font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Minimum <span className="text-primary">50% Savings</span> — Guaranteed
          </span>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-display text-sm font-semibold text-foreground sm:text-base">
          <span className="flex items-center gap-1.5">
            <Tag className="h-4 w-4 text-primary" />
            Offer valid while subscription lasts
          </span>
          <span className="text-muted-foreground hidden sm:inline">·</span>
          <span className="flex items-center gap-1.5">
            <BellRing className="h-4 w-4 text-primary" />
            First come, first serve basis
          </span>
        </div>
      </div>
 

    </section>
  );
}
