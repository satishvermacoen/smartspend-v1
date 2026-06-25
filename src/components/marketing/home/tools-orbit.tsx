import type { CSSProperties } from "react";
import { ORBIT_INNER, ORBIT_OUTER } from "@/data/tools";
import { ToolLogo } from "@/components/marketing/layout/tool-logo";
import { Tool } from "@/types";

export function ToolsOrbit() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[390px] overflow-visible sm:max-w-[560px] lg:max-w-[640px]">
      <div className="absolute inset-0 rounded-full border border-border/50" />
      <div className="absolute inset-[10%] rounded-full border border-border/40" />
      <div className="absolute inset-[27%] rounded-full border border-border/30" />

      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <div className="relative grid h-28 w-28 place-items-center rounded-full bg-card shadow-md ring-1 ring-border sm:h-40 sm:w-40">
          <div className="relative flex flex-col items-center justify-center text-center">
            <div className="font-display text-3xl font-extrabold text-primary sm:text-4xl">80+</div>
            <div className="mt-1 px-2 text-[9px] font-semibold uppercase leading-tight tracking-[0.16em] text-muted-foreground sm:text-[10px]">
              Professional &amp; AI Tools
            </div>
            <div className="mx-auto mt-1.5 h-[2px] w-8 rounded-full bg-primary" />
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
        const style = {
          "--orbit-x": `${x}%`,
          "--orbit-y": `${y}%`,
        } as CSSProperties;

        return (
          <div
            key={t.name}
            className="absolute left-[var(--orbit-x)] top-[var(--orbit-y)] -translate-x-1/2 -translate-y-1/2"
            style={style}
          >
            <div
              className={radiusPct > 40 ? "animate-orbit-reverse" : "animate-orbit"}
              style={{ animationDuration: radiusPct > 40 ? "40s" : "55s" }}
            >
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className="group relative grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-card shadow-card ring-1 ring-border transition-transform hover:scale-110 sm:h-16 sm:w-16"
                  title={t.name}
                >
                  <div className="absolute inset-0 rounded-full bg-primary opacity-0 transition group-hover:opacity-[0.06]" />
                  <ToolLogo tool={t} className="h-7 w-7 sm:h-10 sm:w-10" />
                </div>
                <span className="max-w-[96px] whitespace-nowrap text-center text-[9px] font-semibold leading-tight text-foreground sm:max-w-[120px] sm:text-[11px]">
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
