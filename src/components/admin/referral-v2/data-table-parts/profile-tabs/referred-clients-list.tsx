'use client';

import * as React from "react"
import { Loader2, Mail, Phone, Calendar, Receipt } from "lucide-react"
import { Client } from "@/types"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import ClientPurchasesDialog from "@/components/admin/clients/client-purchases-dialog"

interface ReferredClientsListProps {
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

export function ReferredClientsList({ clients, loading }: ReferredClientsListProps) {
  const [clientList, setClientList] = React.useState<Client[]>([])
  const [updatingId, setUpdatingId] = React.useState<string | null>(null)
  
  // States for Invoice/Purchases dialog
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(null)
  const [isInvoiceOpen, setIsInvoiceOpen] = React.useState(false)

  React.useEffect(() => {
    // Auto-correct client status in frontend state if they have purchases
    const correctedClients = clients.map(client => {
      const hasInvoices = client.purchase !== undefined && client.purchase > 0;
      if (hasInvoices && client.status !== "active" && client.status !== "inactive") {
        return { ...client, status: "active" as any };
      }
      return client;
    });
    setClientList(correctedClients);
  }, [clients])

  const handleStatusChange = async (clientId: string, newStatus: string) => {
    setUpdatingId(clientId)
    try {
      const res = await fetch(`/api/admin/clients/${clientId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Client status updated successfully")
        setClientList(prev =>
          prev.map(c => (c._id === clientId ? { ...c, status: newStatus as any } : c))
        )
      } else {
        toast.error(data.error || "Failed to update status")
      }
    } catch {
      toast.error("An error occurred while updating status")
    } finally {
      setUpdatingId(null)
    }
  }

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

  const getStatusColor = (status: string) => {
    return statusOptions.find(opt => opt.value === status)?.color || "text-muted-foreground bg-muted border-border"
  }

  // Get allowed options based on the client's current status and purchase history
  const getAllowedStatusOptions = (client: Client) => {
    const currentStatus = client.status || "pending"
    const hasInvoices = client.purchase !== undefined && client.purchase > 0

    if (hasInvoices) {
      return statusOptions.filter(opt => opt.value === "active" || opt.value === "inactive")
    }

    switch (currentStatus) {
      case "pending":
        return statusOptions.filter(opt => opt.value === "pending" || opt.value === "contacted")
      case "contacted":
        return statusOptions.filter(opt => opt.value === "contacted" || opt.value === "resolved" || opt.value === "ignored")
      case "resolved":
      case "ignored":
        return statusOptions.filter(opt => opt.value === "resolved" || opt.value === "ignored")
      case "active":
      case "inactive":
        return statusOptions.filter(opt => opt.value === "active" || opt.value === "inactive")
      default:
        return statusOptions
    }
  }

  return (
    <div className="space-y-3 m-2">
      <h4 className="font-bold text-xs uppercase tracking-wide text-muted-foreground">Clients</h4>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-brand" />
        </div>
      ) : clientList.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground border border-dashed border-border/10 rounded-xl">
          No referred clients yet.
        </div>
      ) : (
        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
          {clientList.map(client => {
            const statusColor = getStatusColor(client.status || "active")
            const allowedOptions = getAllowedStatusOptions(client)
            return (
              <div
                key={client._id}
                className="p-3 border border-border/10 rounded-xl bg-card/40 hover:bg-card/75 transition-all shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div className="space-y-1">
                    <p className="font-bold text-foreground text-sm">{client.name}</p>
                    
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
                      {client.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {client.email}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {client.mobile}
                      </span>
                      {client.createdAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Joined {formatDate(client.createdAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Lifetime purchases badge */}
                    {client.purchase !== undefined && (
                      <span className="text-[11px] font-semibold text-brand px-2.5 py-1 bg-brand/5 border border-brand/10 rounded-lg">
                        {formatCurrency(client.purchase)}
                      </span>
                    )}

                    {/* View Invoices Action Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedClient(client)
                        setIsInvoiceOpen(true)
                      }}
                      className="h-8 px-2.5 text-[11px] rounded-lg border border-border/10 hover:bg-muted/50 cursor-pointer flex items-center gap-1 transition-all"
                    >
                      <Receipt className="h-3 w-3" />
                      Invoices
                    </Button>

                    {/* Status inline select selector */}
                    <div className="relative w-28">
                      {updatingId === client._id ? (
                        <div className="h-8 flex items-center justify-center border border-border/10 rounded-lg">
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-brand" />
                        </div>
                      ) : (
                        <Select
                          value={client.status || "active"}
                          onValueChange={(val) => handleStatusChange(client._id, val)}
                        >
                          <SelectTrigger className={`h-8 text-[11px] font-medium rounded-lg border border-border/10 capitalize ${statusColor}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border border-border/10">
                            {allowedOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value} className="text-xs capitalize">
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Invoices Dialog */}
      {selectedClient && (
        <ClientPurchasesDialog
          client={selectedClient}
          isOpen={isInvoiceOpen}
          onOpenChange={setIsInvoiceOpen}
        />
      )}
    </div>
  )
}
