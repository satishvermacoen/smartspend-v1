"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <Button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-secondary/40 transition-colors"
        type="button"
      >
        <span className="font-display text-sm font-semibold sm:text-base text-foreground">{q}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </Button>
      {open && (
        <div className="border-t border-border px-5 py-4 text-sm leading-relaxed text-muted-foreground bg-secondary/10">
          {a}
        </div>
      )}
    </div>
  );
}
