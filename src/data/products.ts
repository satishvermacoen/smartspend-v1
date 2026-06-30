import { Tool } from "@/types";
import { ALL_TOOLS } from "./tools";

export interface Product extends Tool {
  defaultPrice: number;
}

// Default prices in INR (₹) matching realistic subscription costs
export const DEFAULT_PRICES: Record<string, number> = {
  // AI Tools
  "ChatGPT Plus": 2500,
  "Claude Pro": 2500,
  "Claude AI": 2500,
  "Gemini Pro": 2500,
  "Google Gemini": 2500,
  "Perplexity Pro": 2500,
  "Grok": 2000,
  "ElevenLabs": 2200,
  "Manus Pro": 4000,
  "Manus pro": 4000,
  "Whispr Flow": 1800,
  "Wispr Flow": 1800,

  // Developer Tools
  "Cursor Pro": 4500,
  "GitHub Copilot": 1200,
  "Lovable Pro / Lite": 6500,
  "Lovable Pro & Lite": 6500,
  "Replit": 2500,
  "Bolt": 2500,
  "Supabase Pro": 2500,
  "N8N": 2500,
  "n8n": 2500,
  "Coderabbit": 2000,
  "CodeRabbit Pro": 2000,
  "Firecrawl": 2500,
  "Railway": 1500,
  "Warpbuild": 2500,
  "Factory": 5000,

  // Creative & Design
  "Adobe Creative Cloud": 3500,
  "Canva Pro": 1200,
  "Canva Pro/Business": 1200,
  "Canva Business": 1500,
  "Figma": 2000,
  "Figma Professional": 2000,
  "Envato Elements": 1800,
  "Envato": 1800,
  "CapCut": 800,
  "CapCut Pro": 800,
  "InVideo": 1500,
  "Gamma": 1800,
  "Gamma Pro": 1800,
  "Descript": 1500,
  "Filmora": 1000,
  "Freepik": 1200,
  "Autodesk": 8000,
  "PNGTree": 1000,
  "Leonardo AI": 2000,

  // Professional & Productivity
  "LinkedIn Premium": 2200,
  "LinkedIn Sales Navigator": 6500,
  "Microsoft Office": 1500,
  "Coursera Plus": 3500,
  "Rezi - Resume builder": 1000,
  "Rezi": 1000,
  "NordVPN": 800,
  "Notion Business": 1200,
  "Notion Business + AI": 1800,
  "Asana": 1200,
  "Linear": 1200,
  "Loom": 1000,
  "Raycast": 800,
  "Airtable": 1800,

  // Marketing & Growth
  "Mobbin Team": 3000,
  "Framer pro": 2500,
  "Framer Pro": 2500,
  "Intercom": 6000,
  "Make.com": 1500,
  "PostHog": 4000,
  "Customer.io": 8000,
  "Hootsuite": 5000,
  "ChatPRD": 1500,
  "Miro Starter": 1000,
  "Feature.fm": 2500,
  "Guidless Pro": 1500,

  // OTT & Entertainment
  "YouTube Premium": 149,
  "Amazon Prime Video": 299,
  "Prime Video": 299,
  "JioHotstar": 299,
  "Disney+ Hotstar": 299,
  "Disney Plus": 299,
  "SonyLIV": 299,
  "Sony LIV": 299,
  "ZEE 5": 149,
  "Zee5": 149,
  "Spotify": 179,

  // Platform Credits
  "OpenAI Credits": 5000,
  "AWS Credits": 10000,
  "Claude Credits": 5000,
  "Lovable Credits": 5000,
  "Apify Credits": 4000,
  "V0 Credits": 2000,
  "v0 Credits": 2000,
  "Firecrawl Credits": 2500,
  "MongoDB Credits": 5000,
  "Vapi Credits": 5000,
  "Airtable Credits": 4000,
  "Render Credits": 4000,
  "Scalingo Credits": 4000,
};

// Fallback pricing by category if a product is not explicitly mapped above
export const CATEGORY_DEFAULT_PRICES: Record<string, number> = {
  "AI": 2500,
  "Developer": 2500,
  "Creative": 1500,
  "Professional": 2000,
  "Productivity": 1200,
  "Marketing": 3000,
  "Credits": 5000,
  "Product/Marketing": 2500,
  "Business/Operations": 2500,
  "OTT": 199,
};

export const PRODUCTS: Product[] = ALL_TOOLS.map((tool) => {
  const name = tool.name;
  let defaultPrice = DEFAULT_PRICES[name];

  if (!defaultPrice) {
    // Check if there are keys containing the name or vice versa
    const matchingKey = Object.keys(DEFAULT_PRICES).find(key => 
      name.toLowerCase().includes(key.toLowerCase()) || 
      key.toLowerCase().includes(name.toLowerCase())
    );
    if (matchingKey) {
      defaultPrice = DEFAULT_PRICES[matchingKey];
    } else {
      defaultPrice = CATEGORY_DEFAULT_PRICES[tool.category] || 1500;
    }
  }

  return {
    ...tool,
    defaultPrice,
  };
});
