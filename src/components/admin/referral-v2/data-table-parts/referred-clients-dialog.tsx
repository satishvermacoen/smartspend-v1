"use client"

import * as React from "react"
import { Loader2, Users, ChevronRightIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Client } from "@/types"
import { ClientItem } from "@/types/referral"

interface ReferredClientsDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedPartner: ClientItem | null
  referredClients: Client[]
  loadingReferredClients: boolean
  onClientSelect: (client: Client) => void
}

export function ReferredClientsDialog({
  isOpen,
  onOpenChange,
  selectedPartner,
  referredClients,
  loadingReferredClients,
  onClientSelect,
}: ReferredClientsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/95 border border-border/10 backdrop-blur-xl shadow-elegant text-foreground">
        <DialogHeader>
          <DialogTitle className="font-display text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-brand" />
            Referred Clients
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Clients referred by <strong className="text-foreground">{selectedPartner?.name}</strong>. Select a client to view their purchase history.
          </DialogDescription>
        </DialogHeader>

        {loadingReferredClients ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-brand" />
            <span className="text-xs">Loading referred clients...</span>
          </div>
        ) : referredClients.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No clients referred by this partner yet.
          </div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
            {referredClients.map((client) => (
              <button
                key={client._id}
                onClick={() => {
                  onOpenChange(false)
                  onClientSelect(client)
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-border/5 bg-soft/5 hover:bg-soft/15 hover:border-brand/20 transition-all text-left group"
              >
                <div>
                  <h6 className="text-xs font-semibold text-foreground group-hover:text-brand transition-colors">
                    {client.name}
                  </h6>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">
                    {client.mobile} {client.email ? `| ${client.email}` : ""}
                  </span>
                </div>
                <ChevronRightIcon className="h-4 w-4 text-muted-foreground group-hover:text-brand transition-colors" />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
