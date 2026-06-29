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
          <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="url(#geminiGradient)"/>
        </svg>
      </div>
    );
  } else if (nameLower.includes("copilot") || nameLower.includes("github")) {
    return (
      <div className={`grid place-items-center p-0.5 overflow-hidden ${className}`}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#24292F" className="block h-full w-full object-contain">
          <path d="M9 23l.073-.001a2.53 2.53 0 01-2.347-1.838l-.697-2.433a2.529 2.529 0 00-2.426-1.839h-.497l-.104-.002c-4.485 0-2.935-5.278-1.75-9.225l.162-.525C2.412 3.99 3.883 1 6.25 1h8.86c1.12 0 2.106.745 2.422 1.829l.715 2.453a2.53 2.53 0 002.247 1.823l.147.005.534.001c3.557.115 3.088 3.745 2.156 7.206l-.113.413c-.154.548-.315 1.089-.47 1.607l-.163.525C21.588 20.01 20.116 23 17.75 23h-8.75zm8.22-15.89l-3.856.001a2.526 2.526 0 00-2.35 1.615L9.21 15.04a2.529 2.529 0 01-2.43 1.847l3.853.002c1.056 0 1.992-.661 2.361-1.644l1.796-6.287a2.529 2.529 0 012.43-1.848z"/>
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
