"use client";
 
import { useMemo, useState } from "react";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/marketing/layout/site-chrome";
import { ALL_TOOLS, logoUrl } from "@/data/tools";
import { Tool } from "@/types";
import { LOGOS } from "@/data/logo-map";
import { Button } from "@/components/ui/button";
import Image from "next/image";
 
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
 
const LOGO_OVERRIDES: Record<string, string> = {
  // Developer Tools
  "Firecrawl": "https://logos.hunter.io/firecrawl.dev",
  "Firecrawl Credits": "https://logos.hunter.io/firecrawl.dev",
  "Railway": "https://logos.hunter.io/railway.app",
  "Factory": "https://logos.hunter.io/factory.ai",
  "Warpbuild": "https://logos.hunter.io/warpbuild.com",
  "Bolt": "https://www.google.com/s2/favicons?domain=bolt.new&sz=128",
 
  // Design & Creative Tools
  "Adobe Creative Cloud": LOGOS["adobe-cc"] as string,
  "Canva Pro": "https://logos.hunter.io/canva.com",
  "Canva Business + Leonardo AI": "https://logos.hunter.io/canva.com",
  "CapCut": "https://logos.hunter.io/capcut.com",
  "InVideo": "https://logos.hunter.io/invideo.io",
  "Gamma": "https://logos.hunter.io/gamma.app",
  "Descript": "https://logos.hunter.io/descript.com",
  "Leonardo AI": "https://logos.hunter.io/leonardo.ai",
 
  // Product Marketing
  "Customer.io": "https://logos.hunter.io/customer.io",
  "Mobbin Team": "https://logos.hunter.io/mobbin.com",
  "Guidless Pro": "https://logos.hunter.io/guideless.ai",
 
  // Business & Operations
  "Lead.CM": "https://www.google.com/s2/favicons?domain=leads.cm&sz=128",
  "TextShift": "https://www.google.com/s2/favicons?domain=textshift.org&sz=128",
 
  // OTT Platforms
  "Amazon Prime Video": "https://logos.hunter.io/primevideo.com",
  "JioHotstar": "https://logos.hunter.io/jiocinema.com",
  "SonyLIV": "https://upload.wikimedia.org/wikipedia/commons/f/f7/SonyLIV_2020.png",
  "ZEE 5": "https://logos.hunter.io/zee5.com",
 
  // Platform Credits
  "OpenAI Credits": "https://logos.hunter.io/openai.com",
  "AWS Credits": LOGOS["aws-credits"] as string,
  "MongoDB Credits": "https://logos.hunter.io/mongodb.com",
  "Vapi Credits": "https://logos.hunter.io/vapi.ai",
  "Airtable Credits": "https://logos.hunter.io/airtable.com",
  "Render Credits": "https://logos.hunter.io/render.com",
  "Scalingo Credits": "https://logos.hunter.io/scalingo.com",
};
 
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
 
  const grouped = useMemo(() => {
    const groups: Record<Category, Tool[]> = {
      All: [],
      Professional: [],
      AI: [],
      Developer: [],
      Creative: [],
      "Product/Marketing": [],
      "Business/Operations": [],
      OTT: [],
      Credits: [],
    };
 
    filtered.forEach((t) => {
      if (t.category in groups) {
        groups[t.category as Category].push(t);
      }
    });
 
    const orderedCategories = CATEGORIES.filter((c) => c !== "All");
    return orderedCategories
      .map((c) => ({
        category: c,
        tools: groups[c] || [],
      }))
      .filter((g) => g.tools.length > 0);
  }, [filtered]);
 
  return (
    <div className="flex min-h-screen flex-col bg-background relative">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-secondary/10 py-16 sm:py-20">
          {/* Background Glow */}
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl opacity-40 pointer-events-none" />
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Direct Access &amp; Savings
            </span>
            <h1 className="mt-5 font-display text-lg font-extrabold tracking-tight text-foreground sm:text-xl lg:text-2xl max-w-xl leading-tight">
              Explore <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent font-extrabold">80+ Most Demanded Subscriptions</span> Across Various Categories with Guaranteed Savings of <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent font-extrabold">50% &amp; More</span>.
            </h1>
 
            {/* search */}
            <div className="relative mt-8 max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search subscriptions by name…"
                className="h-12 w-full rounded-2xl border border-border/80 bg-card pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
 
            <div className="mt-6">
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((c) => (
                  <Button
                    key={c}
                    onClick={() => setCat(c)}
                    type="button"
                    className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold transition ${
                      cat === c
                        ? "border-transparent bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {CATEGORY_LABELS[c]}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>
 
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <p className="py-20 text-center text-muted-foreground">No subscriptions match your search.</p>
          ) : (
            <div className="space-y-16">
              {grouped.map(({ category, tools }) => (
                <div key={category} className="space-y-6">
                  {/* Category Title & Divider */}
                  <div className="flex items-center gap-4">
                    <h3 className="font-display text-base font-bold tracking-tight text-foreground sm:text-lg">
                      {CATEGORY_LABELS[category]}
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-border via-border/50 to-transparent" />
                  </div>
 
                  {/* Category Grid */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
                    {tools.map((t) => (
                      <ToolTile
                        key={`${t.name}-${t.category}`}
                        tool={t}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
 
        <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-primary/20 bg-card p-8 text-center shadow-elegant">
            <h2 className="font-display text-2xl font-bold text-foreground">Don&apos;t see what you need?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We source many more subscriptions on request. Drop us a message.
            </p>
            <a
              href={`https://wa.me/918770066995?text=${encodeURIComponent("Hi, I'm looking for a subscription that isn't currently listed on your website. Could you please help me find it?")}`}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/10 hover:bg-primary/95 transition-colors"
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
    scaleClass = "scale-[1.2]";
  } else if (nameLower.includes("sonyliv") || nameLower.includes("sony")) {
    src = LOGOS["sonyliv-icon"];
    scaleClass = "scale-[1.2]";
  } else if (nameLower.includes("zee5") || nameLower.includes("zee 5")) {
    src = LOGOS["zee5-icon"];
    scaleClass = "scale-[1.2]";
  } else if (nameLower.includes("mongodb")) {
    src = LOGOS["mongodb"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("openai")) {
    src = LOGOS["openai"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("scalingo")) {
    src = LOGOS["scalingo"];
    scaleClass = "scale-[0.85]";
  } else if (nameLower.includes("render")) {
    src = LOGOS["render"];
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
 
function ToolTile({
  tool,
}: {
  tool: Tool;
}) {
  return (
    <div
      className="group flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md duration-200 relative"
    >
 
      <div className="flex h-20 w-20 items-center justify-center rounded-lg p-3 bg-secondary/40">
        <AllSubscriptionsLogo tool={tool} className="h-full w-full" />
      </div>
      <div className="text-center text-sm font-semibold text-foreground min-w-0 w-full truncate" title={tool.name}>
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
  );
}
