"use client"

import * as React from "react"
import { Search, Loader2, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Client } from "@/types"
import CreateInvoiceDialog from "@/components/admin/clients/create-invoice-dialog"

interface GlobalInvoiceDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  globalClientSearch: string
  setGlobalClientSearch: (val: string) => void
  loadingGlobalClients: boolean
  globalClients: Client[]
  onSuccess: () => void
}

export function GlobalInvoiceDialog({
  isOpen,
  onOpenChange,
  globalClientSearch,
  setGlobalClientSearch,
  loadingGlobalClients,
  globalClients,
  onSuccess,
}: GlobalInvoiceDialogProps) {
  const [selectedGlobalClientForInvoice, setSelectedGlobalClientForInvoice] = React.useState<Client | null>(null)
  const [isGlobalCreateInvoiceOpen, setIsGlobalCreateInvoiceOpen] = React.useState(false)

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-card/95 border border-border/10 backdrop-blur-xl shadow-elegant text-foreground">
          <DialogHeader>
            <DialogTitle className="font-display text-lg flex items-center gap-2">
              <Search className="h-5 w-5 text-brand" />
              Select Client for Invoice
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs">
              Search and select a client to issue an invoice / record a purchase.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or mobile..."
                value={globalClientSearch}
                onChange={(e) => setGlobalClientSearch(e.target.value)}
                className="bg-card border border-border/10 rounded-lg pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand/40"
              />
            </div>

            {loadingGlobalClients ? (
              <div className="py-8 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin text-brand" />
                <span className="text-xs">Searching clients...</span>
              </div>
            ) : globalClients.length === 0 && globalClientSearch.length > 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No clients found.
              </div>
            ) : (
              <div className="max-h-[250px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                {globalClients.map((client) => (
                  <button
                    key={client._id}
                    onClick={() => {
                      setSelectedGlobalClientForInvoice(client)
                      onOpenChange(false)
                      setIsGlobalCreateInvoiceOpen(true)
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
                    <Plus className="h-4 w-4 text-muted-foreground group-hover:text-brand transition-colors" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {selectedGlobalClientForInvoice && (
        <CreateInvoiceDialog
          client={selectedGlobalClientForInvoice}
          isOpen={isGlobalCreateInvoiceOpen}
          onOpenChange={(open) => {
            setIsGlobalCreateInvoiceOpen(open)
            if (!open) {
              setSelectedGlobalClientForInvoice(null)
              setGlobalClientSearch("")
            }
          }}
          onSuccess={onSuccess}
        />
      )}
    </>
  )
}
