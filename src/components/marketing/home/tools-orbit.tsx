import { useState } from "react";
import { ORBIT_INNER, ORBIT_OUTER, logoUrl } from "@/data/tools";
import { ToolLogo } from "@/components/marketing/layout/tool-logo";
import { Tool } from "@/types";
import { LOGOS } from "@/data/logo-map";
import Image from "next/image";

function OrbitToolLogo({ tool, className = "h-7 w-7 sm:h-10 sm:w-10" }: { tool: Tool; className?: string }) {
  const name = tool.name.toLowerCase();
  
  // Resolve image source
  let src: string | undefined = undefined;
  if (name.includes("coursera")) {
    src = "https://cdn.simpleicons.org/coursera/0056D2";
  } else if (name.includes("perplexity")) {
    src = "https://cdn.simpleicons.org/perplexity/1F1F1F";
  } else if (name.includes("nordvpn") || name.includes("nord vpn")) {
    src = "https://cdn.simpleicons.org/nordvpn/4687FF";
  } else if (tool.logo) {
    src = typeof tool.logo === "object" && tool.logo !== null && "src" in tool.logo ? tool.logo.src : tool.logo;
  } else if (tool.slug) {
    src = logoUrl(tool);
  } else if (tool.domain) {
    src = `https://www.google.com/s2/favicons?domain=${tool.domain}&sz=128`;
  }

  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`grid place-items-center rounded-full font-display text-[11px] font-extrabold uppercase tracking-tight text-white ${className}`}
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

  // Adjust scaling for perfect centering and display in Orbit circle container
  let scaleClass = "scale-[1.0]";
  if (name.includes("coursera")) {
    scaleClass = "scale-[0.85]";
  } else if (name.includes("perplexity")) {
    scaleClass = "scale-[0.85]";
  } else if (name.includes("copilot") || name.includes("github")) {
    scaleClass = "scale-[0.9]";
  } else if (name.includes("nordvpn") || name.includes("nord vpn")) {
    scaleClass = "scale-[0.85]";
  } else if (name.includes("invideo")) {
    scaleClass = "scale-[0.85]";
  } else if (name.includes("manus")) {
    scaleClass = "scale-[2.0]";
  } else if (name.includes("fireflies")) {
    scaleClass = "scale-[2.2]";
  } else if (name.includes("rezi")) {
    scaleClass = "scale-[2.2]";
  }

  const isInverted = name.includes("perplexity") || name.includes("github") || name.includes("copilot");

  return (
    <div className={`grid place-items-center p-0.5 overflow-hidden ${className}`}>
      <Image
        unoptimized
        width={96}
        height={96}
        src={src}
        alt={tool.name}
        className={`block h-full w-full object-contain object-center transition-transform ${scaleClass} ${isInverted ? "dark:invert" : ""}`}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export function ToolsOrbit() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[340px] overflow-visible sm:max-w-[480px] lg:max-w-[500px] xl:max-w-[560px]">
      {/* Visual ring tracks */}
      <div className="absolute inset-0 rounded-full border border-border/10" />
      <div className="absolute inset-[8%] rounded-full border border-border/10" />
      <div className="absolute inset-[23%] rounded-full border border-border/10" />

      {/* Center piece */}
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <div className="relative grid h-28 w-28 place-items-center rounded-full bg-card shadow-elegant border border-border sm:h-40 sm:w-40">
          {/* Inner decorative dashed spinning ring */}
          <div className="absolute inset-1.5 rounded-full border border-dashed border-border/40 animate-orbit-reverse" />
          
          <div className="relative flex flex-col items-center justify-center text-center z-10">
            <div className="font-display text-3.5xl font-extrabold text-gradient leading-none sm:text-4.5xl">80+</div>
            <div className="mt-1.5 px-1 text-[9px] font-bold uppercase leading-tight tracking-[0.14em] text-muted-foreground sm:text-[10.5px]">
              Professional &amp; AI
              <span className="block mt-0.5 text-primary/80">Tools</span>
            </div>
            <div className="mx-auto mt-2 h-[2px] w-8 rounded-full" style={{ backgroundImage: 'var(--gradient-brand)' }} />
          </div>
        </div>
      </div>

      <Ring tools={ORBIT_OUTER} radiusPct={42} className="animate-orbit" />
      <Ring tools={ORBIT_INNER} radiusPct={27} className="animate-orbit-reverse" />
    </div>
  );
}

function Ring({
  tools,
  radiusPct,
  className,
}: {
  tools: Tool[];
  radiusPct: number;
  className?: string;
}) {
  return (
    <div className={`absolute inset-0 ${className ?? ""}`}>
      {tools.map((t, i) => {
        const angle = (i / tools.length) * 2 * Math.PI - Math.PI / 2;
        const x = 50 + radiusPct * Math.cos(angle);
        const y = 50 + radiusPct * Math.sin(angle);

        return (
          <div
            key={t.name}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${x}%`,
              top: `${y}%`,
            }}
          >
            <div
              className={radiusPct > 40 ? "animate-orbit-reverse" : "animate-orbit"}
              style={{ animationDuration: radiusPct > 40 ? "40s" : "55s" }}
            >
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className="group relative grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-card border border-border shadow-sm transition-transform hover:scale-110 sm:h-16 sm:w-16"
                  title={t.name}
                >
                  <div className="absolute inset-0 rounded-full bg-primary opacity-0 transition group-hover:opacity-[0.06]" />
                  <OrbitToolLogo tool={t} className="h-7 w-7 sm:h-10 sm:w-10" />
                </div>
                <span className="hidden sm:block max-w-[96px] whitespace-nowrap text-center text-[9px] font-semibold leading-tight text-muted-foreground sm:max-w-[120px] sm:text-[11px]">
                  {t.name}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

