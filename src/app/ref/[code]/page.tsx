"use client";

import { useEffect, useState, use, useMemo } from "react";
import { Gift, Loader2, Sparkles, AlertCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { InquiryForm } from "@/components/marketing/home/main/inquiry-form";
import { ALL_TOOLS, logoUrl } from "@/data/tools";
import { Tool } from "@/types";
import { LOGOS } from "@/data/logo-map";
import { SiteHeader, SiteFooter } from "@/components/marketing/layout/site-chrome";
import Image, { StaticImageData } from "next/image";

const CATEGORIES = ["All", "Professional", "AI", "Developer", "Creative", "Product/Marketing", "Business/Operations", "OTT", "Credits"] as const;
type Category = (typeof CATEGORIES)[number];
 
const CATEGORY_LABELS: Record<Category, string> = {
  All: "All",
  Professional: "Professional Tools",
  AI: "AI Assistants",
  Developer: "Developer Tools",
  Creative: "Design & Creative Tools",
  "Product/Marketing": "Product, Marketing & Growth",
  "Business/Operations": "Business & Operations",
  OTT: "OTT Platforms",
  Credits: "Platform Credits",
};
 
const LOGO_OVERRIDES: Record<string, string | StaticImageData> = {
  "Firecrawl": "https://logos.hunter.io/firecrawl.dev",
  "Firecrawl Credits": "https://logos.hunter.io/firecrawl.dev",
  "Railway": "https://logos.hunter.io/railway.app",
  "Factory": "https://logos.hunter.io/factory.ai",
  "Warpbuild": "https://logos.hunter.io/warpbuild.com",
  "Bolt": "https://www.google.com/s2/favicons?domain=bolt.new&sz=128",
  "Adobe Creative Cloud": LOGOS["adobe-cc"] as StaticImageData,
  "Canva Pro": "https://logos.hunter.io/canva.com",
  "Canva Business + Leonardo AI": "https://logos.hunter.io/canva.com",
  "CapCut": "https://logos.hunter.io/capcut.com",
  "InVideo": "https://logos.hunter.io/invideo.io",
  "Gamma": "https://logos.hunter.io/gamma.app",
  "Descript": "https://logos.hunter.io/descript.com",
  "Leonardo AI": "https://logos.hunter.io/leonardo.ai",
  "Customer.io": "https://logos.hunter.io/customer.io",
  "Mobbin Team": "https://logos.hunter.io/mobbin.com",
  "Guidless Pro": "https://logos.hunter.io/guideless.ai",
  "Lead.CM": "https://www.google.com/s2/favicons?domain=leads.cm&sz=128",
  "TextShift": "https://www.google.com/s2/favicons?domain=textshift.org&sz=128",
  "Amazon Prime Video": "https://logos.hunter.io/primevideo.com",
  "JioHotstar": "https://logos.hunter.io/jiocinema.com",
  "SonyLIV": "https://upload.wikimedia.org/wikipedia/commons/f/f7/SonyLIV_2020.png",
  "ZEE 5": "https://logos.hunter.io/zee5.com",
  "OpenAI Credits": "https://logos.hunter.io/openai.com",
  "AWS Credits": LOGOS["aws-credits"] as StaticImageData,
  "MongoDB Credits": "https://logos.hunter.io/mongodb.com",
  "Vapi Credits": "https://logos.hunter.io/vapi.ai",
  "Airtable Credits": "https://logos.hunter.io/airtable.com",
  "Render Credits": "https://logos.hunter.io/render.com",
  "Scalingo Credits": "https://logos.hunter.io/scalingo.com",
};

export default function RefCodeLandingPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const uppercaseCode = code.toUpperCase();
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [discountAmount, setDiscountAmount] = useState(500);

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
      All: [], Professional: [], AI: [], Developer: [], Creative: [], "Product/Marketing": [], "Business/Operations": [], OTT: [], Credits: [],
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
            {/* LEFT COLUMN: Inquiry Form & Bonus */}
            <div className="space-y-8">
              {/* Reward/Bonus Highlight */}
              <div className="bg-card/25 border border-border/10 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-elegant relative overflow-hidden">
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-brand opacity-15 blur-2xl pointer-events-none" />
                
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-brand text-primary-foreground flex items-center justify-center shadow-soft relative">
                    <Gift className="h-7 w-7" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-gold text-brand font-bold text-[8px] rounded-full flex items-center justify-center animate-bounce">
                      <Sparkles className="h-2 w-2" />
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                      <ShieldCheck className="h-3.5 w-3.5" /> Referral Active
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight mt-2">
                      You&apos;re Invited to <span className="text-gradient">SpendSmart</span>
                    </h1>
                  </div>

                  <div className="w-full bg-soft/20 border border-border/5 rounded-2xl p-4 flex flex-col items-center gap-1 mt-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Your Signup Bonus</span>
                    <span className="text-3xl font-display font-black text-foreground">₹{discountAmount} OFF</span>
                    <span className="text-xs text-muted-foreground mt-1">Automatically deducted from your first subscription purchase.</span>
                  </div>
                </div>
              </div>

              {/* Inquiry Form */}
              <div className="bg-card/25 border border-border/10 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-elegant">
                <h2 className="text-xl font-display font-bold mb-2">Claim your discount</h2>
                <p className="text-sm text-muted-foreground mb-4">Fill out the form below to get started with your premium subscriptions.</p>
                <InquiryForm />
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

function AllSubscriptionsLogo({ tool, className = "h-8 w-8" }: { tool: Tool; className?: string }) {
  const [failed, setFailed] = useState(false);
  const nameLower = tool.name.toLowerCase();

  let src: any = undefined;
  let scaleClass = "scale-[1.0]";

  // 1. Resolve source specifically for all subscriptions section to use official/HD logos
  if (nameLower.includes("coursera")) {
    src = LOGOS["coursera-icon"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("nordvpn") || nameLower.includes("nord vpn")) {
    src = LOGOS["nordvpn"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("coderabbit") || nameLower.includes("code rabbit")) {
    src = LOGOS["marquee-coderabbit-pro"];
    scaleClass = "scale-[2.2]";
  } else if (nameLower.includes("claude credits")) {
    src = LOGOS["claude-pro"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("cursor")) {
    src = LOGOS["cursor"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("invideo")) {
    src = LOGOS["invideo"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("firecrawl")) {
    src = LOGOS["firecrawl"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("speechify")) {
    src = LOGOS["marquee-speechify"];
    scaleClass = "scale-[2.2]";
  } else if (nameLower.includes("granola")) {
    src = LOGOS["granola"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("perplexity")) {
    src = LOGOS["perplexity"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("manus")) {
    src = LOGOS["manus-pro"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("gemini")) {
    src = LOGOS["gemini-icon"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("copilot") || nameLower.includes("github")) {
    src = LOGOS["github-copilot"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("railway")) {
    src = LOGOS["railway-icon"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("warpbuild")) {
    src = LOGOS["warpbuild-icon"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("factory")) {
    src = LOGOS["factory-icon"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("edx")) {
    src = LOGOS["edx"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("spotify")) {
    src = LOGOS["spotify"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("youtube")) {
    src = LOGOS["youtube"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("prime video") || nameLower.includes("amazon")) {
    src = LOGOS["primevideo-icon"];
    scaleClass = "scale-[1.2]";
  } else if (nameLower.includes("hotstar") || nameLower.includes("jio")) {
    src = LOGOS["hotstar-icon"];
    scaleClass = "scale-[1.0]";
  } else if (nameLower.includes("sonyliv") || nameLower.includes("sony")) {
    src = LOGOS["sonyliv-icon"];
    scaleClass = "scale-[1.0]";
  } else if (nameLower.includes("zee5") || nameLower.includes("zee 5")) {
    src = LOGOS["zee5-icon"];
    scaleClass = "scale-[1.0]";
  } else if (nameLower.includes("mongodb")) {
    src = LOGOS["mongodb"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("openai")) {
    src = LOGOS["openai"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("scalingo")) {
    src = LOGOS["scalingo-icon"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("render")) {
    src = LOGOS["render-icon"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("vapi")) {
    src = LOGOS["vapi"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("autodesk")) {
    src = LOGOS["autodesk-icon"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("canva business") || nameLower.includes("leonardo")) {
    src = LOGOS["marquee-canva-business"];
    scaleClass = "scale-[2.2]";
  } else if (nameLower.includes("higgsfield")) {
    src = LOGOS["marquee-higgsfield"];
    scaleClass = "scale-[2.2]";
  } else if (nameLower.includes("capcut")) {
    src = LOGOS["marquee-capcut-pro"];
    scaleClass = "scale-[2.2]";
  } else if (nameLower.includes("freepik")) {
    src = LOGOS["freepik-icon"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("pngtree") || nameLower.includes("png tree")) {
    src = LOGOS["marquee-pngtree"];
    scaleClass = "scale-[2.2]";
  } else if (nameLower.includes("framer")) {
    src = LOGOS["framer"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("linear")) {
    src = LOGOS["linear"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("mobbin")) {
    src = LOGOS["marquee-mobbin-team"];
    scaleClass = "scale-[2.2]";
  } else if (nameLower.includes("intercom")) {
    src = LOGOS["marquee-intercom"];
    scaleClass = "scale-[2.2]";
  } else if (nameLower.includes("loom")) {
    src = LOGOS["marquee-loom"];
    scaleClass = "scale-[2.2]";
  } else if (nameLower.includes("make.com") || nameLower.includes("make")) {
    src = LOGOS["marquee-make-com"];
    scaleClass = "scale-[2.2]";
  } else if (nameLower.includes("magicpattern")) {
    src = LOGOS["marquee-magicpattern"];
    scaleClass = "scale-[2.2]";
  } else if (nameLower.includes("posthog")) {
    src = LOGOS["marquee-posthog"];
    scaleClass = "scale-[2.2]";
  } else if (nameLower.includes("customer.io") || nameLower.includes("customerio")) {
    src = LOGOS["marquee-customer-io"];
    scaleClass = "scale-[2.2]";
  } else if (nameLower.includes("hootsuite")) {
    src = LOGOS["marquee-hootsuite"];
    scaleClass = "scale-[2.2]";
  } else if (nameLower.includes("chatprd")) {
    src = LOGOS["marquee-chatprd"];
    scaleClass = "scale-[2.2]";
  } else if (nameLower.includes("miro")) {
    src = LOGOS["marquee-miro-starter"];
    scaleClass = "scale-[2.2]";
  } else if (nameLower.includes("feature.fm") || nameLower.includes("featurefm")) {
    src = LOGOS["marquee-feature-fm"];
    scaleClass = "scale-[2.2]";
  } else if (nameLower.includes("airtable")) {
    src = LOGOS["airtable"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("asana")) {
    src = LOGOS["asana"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("raycast")) {
    src = LOGOS["raycast"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("lead.cm") || nameLower.includes("leadcm")) {
    src = LOGOS["marquee-lead-cm"];
    scaleClass = "scale-[2.2]";
  } else if (nameLower.includes("gumloop")) {
    src = LOGOS["marquee-gumloop"];
    scaleClass = "scale-[2.2]";
  } else if (nameLower.includes("textshift")) {
    src = LOGOS["marquee-textshift"];
    scaleClass = "scale-[2.2]";
  } else if (nameLower.includes("lightfield")) {
    src = LOGOS["marquee-lightfield-crm"];
    scaleClass = "scale-[2.2]";
  } else if (nameLower.includes("indy")) {
    src = LOGOS["marquee-indy"];
    scaleClass = "scale-[2.2]";
  } else {
    // Local overrides for all other tools to prevent loading failures on strict network
    const LOCAL_OVERRIDES: Record<string, any> = {
      "LinkedIn Premium": LOGOS["linkedin-premium"],
      "Microsoft Office": LOGOS["ms-office"],
      "Rezi - Resume builder": LOGOS["marquee-rezi"],
      "ChatGPT Plus": LOGOS["chatgpt-plus"],
      "Claude AI": LOGOS["claude-pro"],
      "Google Gemini": LOGOS["gemini-icon"],
      "Perplexity Pro": LOGOS["perplexity"],
      "Grok": LOGOS["grok"],
      "ElevenLabs": LOGOS["eleven-labs"],
      "Notion Business + AI": LOGOS["notion-business"],
      "Notion Business": LOGOS["notion-business"],
      "Manus pro": LOGOS["marquee-manus-pro"],
      "Manus Pro": LOGOS["marquee-manus-pro"],
      "Fireflies Pro": LOGOS["marquee-fireflies-pro"],
      "Wispr Flow": LOGOS["whisper-flow"],
      "Cursor Pro": LOGOS["cursor-pro"],
      "GitHub Copilot": LOGOS["github"],
      "Lovable Pro & Lite": LOGOS["lovable-pro"],
      "Lovable Pro": LOGOS["lovable-pro"],
      "Replit": LOGOS["replit-icon"],
      "Bolt": LOGOS["bolt"],
      "Supabase Pro": LOGOS["supabase-pro"],
      "N8N": LOGOS["n8n"],
      "n8n": LOGOS["n8n"],
      "Adobe Creative Cloud": LOGOS["adobe-cc"],
      "Canva Pro/Business": LOGOS["canva-pro"],
      "Canva Pro": LOGOS["canva-pro"],
      "Envato Elements": LOGOS["elements"],
      "Descript": LOGOS["descript"],
      "Gamma Pro": LOGOS["gamma-pro"],
      "Gamma": LOGOS["gamma-pro"],
      "AWS Credits": LOGOS["aws-credits"],
      "Lovable Credits": LOGOS["lovable-pro"],
      "Apify Credits": LOGOS["apify-credits"],
      "V0 Credits": LOGOS["marquee-v0-credits"],
      "Cursor Credits": LOGOS["cursor-pro"],
      "Customer.io": LOGOS["marquee-customer-io"],
      "Mobbin Team": LOGOS["marquee-mobbin-team"],
      "Guidless Pro": LOGOS["marquee-guidless-pro"],
      "Lead.CM": LOGOS["marquee-lead-cm"],
      "TextShift": LOGOS["marquee-textshift"],
      "Amazon Prime Video": LOGOS["marquee-prime-video"],
      "JioHotstar": LOGOS["marquee-hotstar"],
      "SonyLIV": LOGOS["marquee-sony-liv"],
      "ZEE 5": LOGOS["marquee-zee5"],
      "OpenAI Credits": LOGOS["marquee-openai-credits"],
      "MongoDB Credits": LOGOS["marquee-mongodb-credits"],
      "Vapi Credits": LOGOS["marquee-vapi-credits"],
      "Airtable Credits": LOGOS["marquee-airtable-credits"],
      "Render Credits": LOGOS["marquee-render-credits"],
      "Scalingo Credits": LOGOS["marquee-scalingo-credits"],
    };

    const override = LOCAL_OVERRIDES[tool.name];
    if (override) {
      src = override;
    } else if (tool.logo) {
      src = typeof tool.logo === "object" && tool.logo !== null && "src" in tool.logo ? tool.logo.src : tool.logo;
    } else if (tool.slug) {
      src = `https://cdn.simpleicons.org/${tool.slug}/${tool.color ?? "0A66C2"}`;
    } else if (tool.domain) {
      src = `https://www.google.com/s2/favicons?domain=${tool.domain}&sz=128`;
    }
  }

  // Define scaling rules for better visual consistency
  if (scaleClass === "scale-[1.0]") {
    if (nameLower.includes("manus")) {
      scaleClass = "scale-[2.0]";
    } else if (nameLower.includes("fireflies")) {
      scaleClass = "scale-[2.2]";
    } else if (nameLower.includes("rezi")) {
      scaleClass = "scale-[2.2]";
    } else if (
      nameLower.includes("perplexity") ||
      nameLower.includes("copilot") ||
      nameLower.includes("github") ||
      nameLower.includes("claude") ||
      nameLower.includes("anthropic")
    ) {
      scaleClass = "scale-[0.85]";
    }
  }

  // Resolve StaticImageData path if it's an object
  const resolvedSrc = src && typeof src === "object" && "src" in src ? src.src : src;

  if (!resolvedSrc || failed) {
    return (
      <div
        className={`grid place-items-center rounded-md font-display text-[10px] font-extrabold uppercase tracking-tight text-white ${className}`}
        style={{ backgroundColor: `#${tool.color ?? "0A66C2"}` }}
        title={tool.name}
      >
        {tool.name
          .replace(/\b(Pro|Plus|Premium|Cloud|Credits|Business|Elements|Flow|Labs)\b/gi, "")
          .trim()
          .split(/\s+/)
          .map((w) => w[0])
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
        loading="lazy"
        className={`block h-full w-full object-contain object-center transition-transform ${scaleClass}`}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
 
function ToolTile({ tool }: { tool: Tool }) {
  return (
    <div className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card/60 p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md duration-200">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg p-2 bg-secondary/40">
        <AllSubscriptionsLogo tool={tool} className="h-full w-full" />
      </div>
      <div className="text-center text-xs font-semibold text-foreground min-w-0 w-full truncate" title={tool.name}>
        {tool.name}
      </div>
    </div>
  );
}
