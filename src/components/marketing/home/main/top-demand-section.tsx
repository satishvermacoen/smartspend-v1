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
    return (
      <div className={`grid place-items-center p-0.5 overflow-hidden ${className}`}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#0056D2" className="block h-full w-full object-contain">
          <path d="M11.374 23.977c-4.183-.21-8.006-2.626-9.959-6.347-2.097-3.858-1.871-8.864.732-12.454C4.748 1.338 9.497-.698 14.281.23c4.583.857 8.351 4.494 9.358 8.911 1.122 4.344-.423 9.173-3.925 12.04-2.289 1.953-5.295 2.956-8.34 2.797zm7.705-8.05a588.737 588.737 0 0 0-3.171-1.887c-.903 1.483-2.885 2.248-4.57 1.665-2.024-.639-3.394-2.987-2.488-5.134.801-2.009 2.79-2.707 4.357-2.464a4.19 4.19 0 0 1 2.623 1.669c1.077-.631 2.128-1.218 3.173-1.855-2.03-3.118-6.151-4.294-9.656-2.754-3.13 1.423-4.89 4.68-4.388 7.919.54 3.598 3.73 6.486 7.716 6.404a7.664 7.664 0 0 0 6.404-3.563z"/>
        </svg>
      </div>
    );
  } else if (nameLower.includes("nordvpn") || nameLower.includes("nord vpn")) {
    return (
      <div className={`grid place-items-center p-0.5 overflow-hidden ${className}`}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#4687FF" className="block h-full w-full object-contain">
          <path d="M2.2838 21.5414A11.9866 11.9866 0 010 14.4832C0 7.8418 5.3727 2.4586 12 2.4586c6.6279 0 12 5.3832 12 12.0246a11.9853 11.9853 0 01-2.2838 7.0582l-5.7636-9.3783-.5565.9419.5645 2.6186L12 8.9338l-2.45 4.1447.5707 2.6451-2.0764-3.5555-5.7605 9.3733z"/>
        </svg>
      </div>
    );
  } else if (nameLower.includes("coderabbit") || nameLower.includes("code rabbit")) {
    src = LOGOS["marquee-coderabbit-pro"];
    scaleClass = "scale-[2.2]";
  } else if (nameLower.includes("claude")) {
    src = LOGOS["claude-pro"];
    scaleClass = "scale-[1.0]";
  } else if (nameLower.includes("firecrawl")) {
    src = LOGOS["firecrawl"];
    scaleClass = "scale-[1.0]";
  } else if (nameLower.includes("cursor")) {
    src = LOGOS["cursor"];
    scaleClass = "scale-[1.0]";
  } else if (nameLower.includes("rezi")) {
    src = LOGOS["marquee-rezi"];
    scaleClass = "scale-[2.2]";
  } else if (nameLower.includes("manus")) {
    src = LOGOS["manus-pro"];
    scaleClass = "scale-[1.0]";
  } else if (nameLower.includes("fireflies")) {
    src = LOGOS["marquee-fireflies-pro"];
    scaleClass = "scale-[2.2]";
  } else if (nameLower.includes("perplexity")) {
    return (
      <div className={`grid place-items-center p-0.5 overflow-hidden ${className}`}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#1F1F1F" className="block h-full w-full object-contain">
          <path d="M19.785 0v7.272H22.5V17.62h-2.935V24l-7.037-6.194v6.145h-1.091v-6.152L4.392 24v-6.465H1.5V7.188h2.884V0l7.053 6.494V.19h1.09v6.49L19.786 0zm-7.257 9.044v7.319l5.946 5.234V14.44l-5.946-5.397zm-1.099-.08l-5.946 5.398v7.235l5.946-5.234V8.965zm8.136 7.58h1.844V8.349H13.46l6.105 5.54v2.655zm-8.982-8.28H2.59v8.195h1.8v-2.576l6.192-5.62zM5.475 2.476v4.71h5.115l-5.115-4.71zm13.219 0l-5.115 4.71h5.115v-4.71z"/>
        </svg>
      </div>
    );
  } else if (nameLower.includes("gemini")) {
    return (
      <div className={`grid place-items-center p-0.5 overflow-hidden ${className}`}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="block h-full w-full object-contain">
          <defs>
            <linearGradient id="geminiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#9b72f3"/>
              <stop offset="50%" stop-color="#4285f4"/>
              <stop offset="100%" stop-color="#2b76f9"/>
            </linearGradient>
          </defs>
          <path d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81" fill="url(#geminiGradient)"/>
        </svg>
      </div>
    );
  } else if (nameLower.includes("copilot") || nameLower.includes("github")) {
    return (
      <div className={`grid place-items-center p-0.5 overflow-hidden ${className}`}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#24292F" className="block h-full w-full object-contain">
          <path d="M23.922 16.992c-.861 1.495-5.859 5.023-11.922 5.023-6.063 0-11.061-3.528-11.922-5.023A.641.641 0 0 1 0 16.736v-2.869a.841.841 0 0 1 .053-.22c.372-.935 1.347-2.292 2.605-2.656.167-.429.414-1.055.644-1.517a10.195 10.195 0 0 1-.052-1.086c0-1.331.282-2.499 1.132-3.368.397-.406.89-.717 1.474-.952 1.399-1.136 3.392-2.093 6.122-2.093 2.731 0 4.767.957 6.166 2.093.584.235 1.077.546 1.474.952.85.869 1.132 2.037 1.132 3.368 0 .368-.014.733-.052 1.086.23.462.477 1.088.644 1.517 1.258.364 2.233 1.721 2.605 2.656a.832.832 0 0 1 .053.22v2.869a.641.641 0 0 1-.078.256ZM12.172 11h-.344a4.323 4.323 0 0 1-.355.508C10.703 12.455 9.555 13 7.965 13c-1.725 0-2.989-.359-3.782-1.259a2.005 2.005 0 0 1-.085-.104L4 11.741v6.585c1.435.779 4.514 2.179 8 2.179 3.486 0 6.565-1.4 8-2.179v-6.585l-.098-.104s-.033.045-.085.104c-.793.9-2.057 1.259-3.782 1.259-1.59 0-2.738-.545-3.508-1.492a4.323 4.323 0 0 1-.355-.508h-.016.016Zm.641-2.935c.136 1.057.403 1.913.878 2.497.442.544 1.134.938 2.344.938 1.573 0 2.292-.337 2.657-.751.384-.435.558-1.15.558-2.361 0-1.14-.243-1.847-.705-2.319-.477-.488-1.319-.862-2.824-1.025-1.487-.161-2.192.138-2.533.529-.269.307-.437.808-.438 1.578v.021c0 .265.021.562.063.893Zm-1.626 0c.042-.331.063-.628.063-.894v-.02c-.001-.77-.169-1.271-.438-1.578-.341-.391-1.046-.69-2.533-.529-1.505.163-2.347.537-2.824 1.025-.462.472-.705 1.179-.705 2.319 0 1.211.175 1.926.558 2.361.365.414 1.084.751 2.657.751 1.21 0 1.902-.394 2.344-.938.475-.584.742-1.44.878-2.497Z"/>
          <path d="M14.5 14.25a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1Zm-5 0a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1Z"/>
        </svg>
      </div>
    );
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
