import { useState } from "react";
import { logoUrl } from "@/data/tools";
import { Tool } from "@/types";
import { LOGOS } from "@/data/logo-map";
import Image, { StaticImageData } from "next/image";

const LOGO_OVERRIDES: Record<string, string | StaticImageData> = {
  // Developer Tools
  "Firecrawl": LOGOS["firecrawl"] as StaticImageData,
  "Firecrawl Credits": LOGOS["firecrawl"] as StaticImageData,
  "Railway": LOGOS["railway"] as StaticImageData,
  "Factory": LOGOS["factory"] as StaticImageData,
  "Warpbuild": LOGOS["warpbuild"] as StaticImageData,
  "Bolt": LOGOS["bolt"] as StaticImageData,
  "Coderabbit": LOGOS["marquee-coderabbit-pro"] as StaticImageData,
  "Code Rabbit": LOGOS["marquee-coderabbit-pro"] as StaticImageData,
  "Cursor Pro": LOGOS["cursor-pro"] as StaticImageData,
  "GitHub Copilot": LOGOS["github"] as StaticImageData,
  "Replit": LOGOS["replit"] as StaticImageData,
  "Supabase Pro": LOGOS["supabase-pro"] as StaticImageData,
  "n8n": LOGOS["n8n"] as StaticImageData,
  "N8N": LOGOS["n8n"] as StaticImageData,

  // Design & Creative Tools
  "Adobe Creative Cloud": LOGOS["adobe-cc"] as StaticImageData,
  "Canva Pro": LOGOS["canva-pro"] as StaticImageData,
  "Canva Pro/Business": LOGOS["canva-pro"] as StaticImageData,
  "Canva Business + Leonardo AI": LOGOS["marquee-canva-business"] as StaticImageData,
  "CapCut": LOGOS["marquee-capcut-pro"] as StaticImageData,
  "InVideo": LOGOS["invideo"] as StaticImageData,
  "Gamma": LOGOS["gamma-pro"] as StaticImageData,
  "Gamma Pro": LOGOS["gamma-pro"] as StaticImageData,
  "Descript": LOGOS["descript"] as StaticImageData,
  "Leonardo AI": LOGOS["marquee-leonardo-ai"] as StaticImageData,
  "Figma Professional": LOGOS["figma"] as StaticImageData,
  "Figma Pro": LOGOS["figma"] as StaticImageData,
  "Figma": LOGOS["figma"] as StaticImageData,
  "Envato Elements": LOGOS["elements"] as StaticImageData,

  // Product Marketing
  "Customer.io": LOGOS["marquee-customer-io"] as StaticImageData,
  "Mobbin Team": LOGOS["marquee-mobbin-team"] as StaticImageData,
  "Guidless Pro": LOGOS["marquee-guidless-pro"] as StaticImageData,

  // Business & Operations & Professional
  "Lead.CM": LOGOS["marquee-lead-cm"] as StaticImageData,
  "TextShift": LOGOS["marquee-textshift"] as StaticImageData,
  "LinkedIn Premium": LOGOS["linkedin-premium"] as StaticImageData,
  "Microsoft Office": LOGOS["ms-office"] as StaticImageData,
  "Rezi - Resume builder": LOGOS["marquee-rezi"] as StaticImageData,
  "NordVPN": LOGOS["nordvpn"] as StaticImageData,
  "Perplexity Pro": LOGOS["perplexity"] as StaticImageData,
  "Notion Business + AI": LOGOS["notion-business"] as StaticImageData,
  "Notion Business": LOGOS["notion-business"] as StaticImageData,
  "Manus pro": LOGOS["marquee-manus-pro"] as StaticImageData,
  "Fireflies Pro": LOGOS["marquee-fireflies-pro"] as StaticImageData,
  "Wispr Flow": LOGOS["whisper-flow"] as StaticImageData,
  "Lovable Pro & Lite": LOGOS["lovable-pro"] as StaticImageData,
  "Lovable Pro": LOGOS["lovable-pro"] as StaticImageData,

  // OTT Platforms
  "Amazon Prime Video": LOGOS["marquee-prime-video"] as StaticImageData,
  "JioHotstar": LOGOS["marquee-hotstar"] as StaticImageData,
  "SonyLIV": LOGOS["marquee-sony-liv"] as StaticImageData,
  "ZEE 5": LOGOS["marquee-zee5"] as StaticImageData,

  // Platform Credits
  "OpenAI Credits": LOGOS["marquee-openai-credits"] as StaticImageData,
  "AWS Credits": LOGOS["aws-credits"] as StaticImageData,
  "MongoDB Credits": LOGOS["marquee-mongodb-credits"] as StaticImageData,
  "Vapi Credits": LOGOS["marquee-vapi-credits"] as StaticImageData,
  "Airtable Credits": LOGOS["marquee-airtable-credits"] as StaticImageData,
  "Render Credits": LOGOS["marquee-render-credits"] as StaticImageData,
  "Scalingo Credits": LOGOS["marquee-scalingo-credits"] as StaticImageData,
  "Lovable Credits": LOGOS["lovable-pro"] as StaticImageData,
  "Apify Credits": LOGOS["apify-credits"] as StaticImageData,
};

// Render a single stable logo source; explicit/local logos are preferred.
export function ToolLogo({
  tool,
  className = "h-8 w-8",
}: {
  tool: Tool;
  className?: string;
}) {
  // ONE stable source per tool.
  // Priority: explicit override logo → explicit local logo → simpleicons (slug) → branded favicon (domain).
  let primary: string | undefined = undefined;
  const override = LOGO_OVERRIDES[tool.name];
  if (override) {
    primary = typeof override === "object" && override !== null && "src" in override ? (override as { src: string }).src : (override as string);
  } else if (tool.logo) {
    primary = typeof tool.logo === "object" && tool.logo !== null && "src" in tool.logo ? tool.logo.src : tool.logo;
  } else if (tool.slug) {
    primary = logoUrl(tool);
  } else if (tool.domain) {
    primary = `https://www.google.com/s2/favicons?domain=${tool.domain}&sz=128`;
  }

  const [failed, setFailed] = useState(false);

  if (!primary || failed) {
    return (
      <div
        className={`grid place-items-center rounded-md font-display text-[11px] font-extrabold uppercase tracking-tight text-white ${className}`}
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

  let scaleClass = "";
  if (tool.logo || tool.slug) {
    const nameLower = tool.name.toLowerCase();
    if (nameLower.includes("manus")) {
      scaleClass = "scale-[2.0]";
    } else if (nameLower.includes("fireflies")) {
      scaleClass = "scale-[2.2]";
    } else if (nameLower.includes("rezi")) {
      scaleClass = "scale-[2.2]";
    } else if (nameLower.includes("coursera")) {
      scaleClass = "scale-[0.95]";
    } else if (nameLower.includes("perplexity") || nameLower.includes("gemini")) {
      scaleClass = "scale-[0.95]";
    } else if (nameLower.includes("copilot") || nameLower.includes("github")) {
      scaleClass = "scale-[0.95]";
    } else if (nameLower.includes("nordvpn") || nameLower.includes("nord vpn")) {
      scaleClass = "scale-[0.95]";
    } else if (nameLower.includes("invideo")) {
      scaleClass = "scale-[0.95]";
    } else if (nameLower.includes("claude") || nameLower.includes("anthropic")) {
      scaleClass = "scale-[0.95]";
    } else if (
      nameLower.includes("coderabbit") ||
      nameLower.includes("code rabbit") ||
      nameLower.includes("railway") ||
      nameLower.includes("warpbuild") ||
      nameLower.includes("factory")
    ) {
      scaleClass = "scale-[0.95]";
    }
  }

  const isInverted = tool.color === "000000";

  return (
    <div className={`grid place-items-center p-0.5 overflow-hidden ${className}`}>
      <Image
        unoptimized
        width={96}
        height={96}
        src={primary}
        alt={tool.name}
        loading={tool.logo ? "eager" : "lazy"}
        className={`block h-full w-full object-contain object-center transition-transform ${scaleClass} ${isInverted ? "dark:invert" : ""}`}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
