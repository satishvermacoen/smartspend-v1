import { useState } from "react";
import { logoUrl } from "@/data/tools";
import { Tool } from "@/types";

// Render a single stable logo source; explicit/local logos are preferred.
export function ToolLogo({
  tool,
  className = "h-8 w-8",
}: {
  tool: Tool;
  className?: string;
}) {
  // ONE stable source per tool.
  // Priority: explicit local logo → simpleicons (slug) → branded favicon (domain).
  let primary: string | undefined = undefined;
  if (tool.logo) {
    primary = typeof tool.logo === "object" && tool.logo !== null && "src" in tool.logo ? tool.logo.src : tool.logo;
  } else if (tool.slug) {
    primary = logoUrl(tool);
  } else if (tool.domain) {
    primary = `https://icons.duckduckgo.com/ip3/${tool.domain}.ico`;
  }

  const [failed, setFailed] = useState(false);

  if (!primary || failed) {
    return (
      <div
        className={`grid place-items-center rounded-lg font-display text-[11px] font-extrabold uppercase tracking-tight text-white ${className}`}
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
    <div className={`grid place-items-center p-0.5 ${className}`}>
      <img
        src={primary}
        alt={tool.name}
        width="160"
        height="160"
        loading={tool.logo ? "eager" : "lazy"}
        className="block h-full w-full object-contain object-center"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
