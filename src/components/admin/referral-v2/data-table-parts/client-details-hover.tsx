"use client"

import * as React from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ClientItem } from "@/types/referral"
import { Mail, Phone, ExternalLink } from "lucide-react"

interface ClientDetailsHoverProps {
  client: ClientItem
  onClick?: (client: ClientItem) => void
}

export function ClientDetailsHover({ client, onClick }: ClientDetailsHoverProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="cursor-pointer font-semibold text-foreground text-sm hover:underline hover:text-brand transition-colors"
            onClick={() => onClick?.(client)}
          >
            {client.name}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="w-64 p-3 bg-card border-border/10 shadow-elegant">
          <div className="space-y-3">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-foreground">{client.name}</h4>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                Status: <span className={client.status === "active" ? "text-emerald-500" : "text-amber-500"}>{client.status || "Unknown"}</span>
              </p>
            </div>
            
            <div className="space-y-2 text-xs">
              {client.email && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 text-brand" />
                  <span className="truncate">{client.email}</span>
                </div>
              )}
              {client.phone && client.phone !== "N/A" && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 text-brand" />
                  <span>{client.phone}</span>
                </div>
              )}

            </div>

            <div className="pt-2 border-t border-border/10 flex items-center text-[10px] text-brand font-semibold">
              <ExternalLink className="h-3 w-3 mr-1" />
              Click to view full profile
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
