'use client';

import * as React from "react"
import { Loader2, Mail, Phone, Calendar, Receipt, Send, MessageSquare, ShoppingBag, Award } from "lucide-react"
import { Client } from "@/types"
import { Button } from "@/components/ui/button"
import ClientPurchasesDialog from "@/components/admin/clients/client-purchases-dialog"

interface PartnerClientsListProps {
  clients: Client[]
  loading: boolean
}

const statusOptions = [
  { value: "pending", label: "Pending", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { value: "contacted", label: "Contacted", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  { value: "resolved", label: "Resolved", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  { value: "ignored", label: "Ignored", color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20" },
  { value: "active", label: "Active", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { value: "inactive", label: "Inactive", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
]

export function PartnerClientsList({ clients, loading }: PartnerClientsListProps) {
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(null)
  const [isPurchasesOpen, setIsPurchasesOpen] = React.useState(false)

  const clientList = React.useMemo(() => {
    // Auto-correct client status in frontend state if they have purchases
    return clients.map(client => {
      const hasInvoices = client.purchase !== undefined && client.purchase > 0;
      if (hasInvoices && client.status !== "active" && client.status !== "inactive") {
        return { ...client, status: "active" as Client["status"] };
      }
      return client;
    });
  }, [clients])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusInfo = (status: string) => {
    return statusOptions.find(opt => opt.value === status) || { label: status, color: "text-muted-foreground bg-muted border-border" }
  }

  return (
    <div className="space-y-4">
      <h4 className="font-bold text-sm uppercase tracking-wide text-muted-foreground">Client Details</h4>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-brand" />
        </div>
      ) : clientList.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground border border-dashed border-border/10 rounded-xl">
          No referred clients yet. Share your link to get started!
        </div>
      ) : (
        <div className="space-y-3">
          {clientList.map(client => {
            const statusInfo = getStatusInfo(client.status || "active")
            
            return (
              <div
                key={client._id}
                className="p-4 border border-border/10 rounded-xl bg-card/40 hover:bg-card/75 transition-all shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div className="space-y-1.5">
                    <p className="font-bold text-foreground text-base">{client.name}</p>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                      {client.email && (
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5" />
                          {client.email}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" />
                        {client.mobile}
                      </span>
                      {client.createdAt && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          Joined {formatDate(client.createdAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center mt-2 sm:mt-0">
                    {/* Lifetime purchases badge */}
                    {client.purchase !== undefined && client.purchase > 0 && (
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Purchases</span>
                        <span className="text-sm font-semibold text-brand px-2.5 py-1 bg-brand/5 border border-brand/10 rounded-lg mt-0.5">
                          {formatCurrency(client.purchase)}
                        </span>
                      </div>
                    )}

                    {/* Status inline badge (Read-Only) */}
                    <div className="flex flex-col items-end ml-2">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Status</span>
                      <div className={`h-8 px-3 mt-0.5 flex items-center justify-center text-xs font-medium rounded-lg border capitalize ${statusInfo.color}`}>
                        {statusInfo.label}
                      </div>
                    </div>

                    {/* View Invoices button */}
                    <div className="flex flex-col items-end ml-2">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold text-right w-full">Invoices</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedClient(client)
                          setIsPurchasesOpen(true)
                        }}
                        className="h-8 px-3 mt-0.5 inline-flex items-center gap-1.5 text-xs border border-border/15 hover:bg-soft/10 text-foreground cursor-pointer rounded-lg font-semibold"
                      >
                        <Receipt className="h-3.5 w-3.5" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Pipeline Stepper Progress */}
                {(() => {
                  const isPurchased = client.purchase !== undefined && client.purchase > 0;
                  const isRewarded = client.conversion?.referrer_reward?.status === 'credited' || 
                                     client.conversion?.referrer_reward?.status === 'claimed' ||
                                     (isPurchased && client.conversion?.purchase_details?.referrer_reward !== undefined && client.conversion.purchase_details.referrer_reward > 0);

                  let progressPercent = "w-1/3";
                  if (isRewarded) {
                    progressPercent = "w-full";
                  } else if (isPurchased) {
                    progressPercent = "w-2/3";
                  }

                  return (
                    <div className="border-t border-border/10 pt-4 mt-2">
                      <div className="flex items-center justify-between relative max-w-2xl mx-auto px-2">
                        {/* Connecting track line */}
                        <div className="absolute top-[18px] left-[20px] right-[20px] h-0.5 bg-border/20 z-0">
                          <div className={`h-full bg-brand rounded-full transition-all duration-700 ${progressPercent}`} />
                        </div>

                        {/* Step 1: Invite Sent */}
                        <div className="flex flex-col items-center z-10 text-center space-y-1 group">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-brand text-white border border-brand shadow-md">
                            <Send className="h-4 w-4" />
                          </div>
                          <span className="text-[11px] font-bold text-foreground">Invite Sent</span>
                          <span className="text-[9px] text-muted-foreground/80">
                            {client.conversion?.timeline?.clicked_at 
                              ? formatDate(client.conversion.timeline.clicked_at) 
                              : formatDate(client.createdAt)}
                          </span>
                        </div>

                        {/* Step 2: Customer Inquiry */}
                        <div className="flex flex-col items-center z-10 text-center space-y-1 group">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-brand text-white border border-brand shadow-md">
                            <MessageSquare className="h-4 w-4" />
                          </div>
                          <span className="text-[11px] font-bold text-foreground">Inquiry</span>
                          <span className="text-[9px] text-muted-foreground/80">
                            {client.conversion?.timeline?.visited_at 
                              ? formatDate(client.conversion.timeline.visited_at) 
                              : formatDate(client.createdAt)}
                          </span>
                        </div>

                        {/* Step 3: Purchase Completed */}
                        <div className="flex flex-col items-center z-10 text-center space-y-1 group">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border shadow-md ${
                            isPurchased 
                              ? "bg-brand text-white border-brand" 
                              : "bg-muted text-muted-foreground border-border/20"
                          }`}>
                            <ShoppingBag className="h-4 w-4" />
                          </div>
                          <span className={`text-[11px] font-bold ${isPurchased ? "text-foreground" : "text-muted-foreground"}`}>Purchase</span>
                          <span className="text-[9px] text-muted-foreground/80">
                            {client.conversion?.timeline?.purchased_at 
                              ? formatDate(client.conversion.timeline.purchased_at) 
                              : (isPurchased ? "Completed" : "Pending")}
                          </span>
                        </div>

                        {/* Step 4: Reward Credited */}
                        <div className="flex flex-col items-center z-10 text-center space-y-1 group">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border shadow-md ${
                            isRewarded 
                              ? "bg-emerald-500 text-white border-emerald-500" 
                              : "bg-muted text-muted-foreground border-border/20"
                          }`}>
                            <Award className="h-4 w-4" />
                          </div>
                          <span className={`text-[11px] font-bold ${isRewarded ? "text-emerald-400" : "text-muted-foreground"}`}>Reward</span>
                          <span className="text-[9px] text-muted-foreground/80 font-medium">
                            {isRewarded 
                              ? `+${formatCurrency(client.conversion?.purchase_details?.referrer_reward || client.conversion?.referrer_reward?.amount || 0)}` 
                              : "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )
          })}
        </div>
      )}
      {selectedClient && (
        <ClientPurchasesDialog
          client={selectedClient}
          isOpen={isPurchasesOpen}
          onOpenChange={setIsPurchasesOpen}
          readOnly={true}
          apiUrl="/api/partner/invoices"
        />
      )}
    </div>
  )
}
