"use client";

import { useEffect, useState, useCallback } from "react"
import { RefreshCw, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/admin/referral-v2/data-table"
import { SectionCards } from "@/components/admin/referral-v2/section-cards"
import type { 
  ClientItem, ConversionItem, PendingApprovalItem
} from "@/types/referral"

interface AdminKPIs {
  activeCodes: number;
  clicks: number;
  signups: number;
  purchases: number;
  revenue: number;
  cashPaid: number;
  subscriptionMonths: number;
}

export default function AdminPartnerPage() {
  const [loading, setLoading] = useState(true)
  const [kpis, setKpis] = useState<AdminKPIs | null>(null)



  // States for conversions
  const [conversions, setConversions] = useState<ConversionItem[]>([])
  const [convStageFilter, setConvStageFilter] = useState("all")
  const [convSearch, setConvSearch] = useState("")
  const [convPage, setConvPage] = useState(1)

  // Pending queue
  const [pendingQueue, setPendingQueue] = useState<PendingApprovalItem[]>([])
  const [processingRewardId, setProcessingRewardId] = useState<string | null>(null)



  // Clients
  const [clients, setClients] = useState<ClientItem[]>([])
  const [fetchingClients, setFetchingClients] = useState(false)

  const fetchClients = useCallback(async () => {
    setFetchingClients(true)
    try {
      const res = await fetch("/api/admin/referrals/users")
      const data = await res.json()
      if (Array.isArray(data)) {
        setClients(data)
      }
    } catch (err) {
      console.error("Error loading clients:", err)
    } finally {
      setFetchingClients(false)
    }
  }, [])


  const fetchConversions = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/admin/referrals/conversions?stage=${convStageFilter}&search=${encodeURIComponent(convSearch)}&page=${convPage}&limit=15`
      )
      const data = await res.json()
      if (data.success) {
        setConversions(data.conversions)
      }
    } catch (err) {
      console.error("Error loading conversions:", err)
    }
  }, [convStageFilter, convSearch, convPage])

  const fetchPendingQueue = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/referrals/redemptions?status=pending")
      const data = await res.json()
      
      if (data.success && data.pendingRequests) {
        setPendingQueue(data.pendingRequests)
      } else {
        setPendingQueue([])
      }
    } catch (err) {
      console.error("Error fetching pending approvals queue:", err)
    }
  }, [])

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/referrals/analytics")
      const data = await res.json()
      if (data.success && data.kpis) {
        setKpis(data.kpis)
      }
    } catch (err) {
      console.error("Error loading analytics:", err)
    }
  }, [])

  const loadAllData = useCallback(async () => {
    setLoading(true)
    await Promise.all([
      fetchConversions(),
      fetchPendingQueue(),
      fetchClients(),
      fetchAnalytics(),
    ])
    setLoading(false)
  }, [fetchClients, fetchConversions, fetchPendingQueue, fetchAnalytics])

  useEffect(() => {
    let active = true
    Promise.resolve().then(() => {
      if (active) {
        loadAllData()
      }
    })
    return () => {
      active = false
    }
  }, [loadAllData])



  const handleDeleteClient = async (id: string) => {
    if (!confirm("Are you sure you want to soft-delete this user?")) return
    try {
      const res = await fetch(`/api/admin/referrals/users/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("User soft deleted successfully.")
        fetchClients()
      } else {
        throw new Error()
      }
    } catch {
      toast.error("Failed to delete user.")
    }
  }



  const handleApproveReward = async (item: PendingApprovalItem) => {
    setProcessingRewardId(item.redemptionId)
    try {
      const res = await fetch("/api/admin/referrals/rewards/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: item.customerId,
          redemptionId: item.redemptionId,
        }),
      })
      if (res.ok) {
        toast.success("Reward approved and balance updated!")
        fetchPendingQueue()
        fetchAnalytics()
      } else {
        const d = await res.json()
        throw new Error(d.error || "Approval failed.")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to approve reward.")
    } finally {
      setProcessingRewardId(null)
    }
  }

  const handleRejectReward = async (item: PendingApprovalItem) => {
    if (!confirm("Are you sure you want to reject this reward?")) return
    setProcessingRewardId(item.redemptionId)
    try {
      const res = await fetch("/api/admin/referrals/rewards/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: item.customerId,
          redemptionId: item.redemptionId,
          reason: "Manual admin rejection",
        }),
      })
      if (res.ok) {
        toast.success("Reward rejected.")
        fetchPendingQueue()
      } else {
        throw new Error()
      }
    } catch {
      toast.error("Failed to reject reward.")
    } finally {
      setProcessingRewardId(null)
    }
  }



  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-"
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  if (loading && !kpis) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
        <span>Loading Admin partner board...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 lg:px-6 gap-4">
            <div>
              <h2 className="text-xl font-display font-bold tracking-tight text-foreground">
                Partner Console
              </h2>
            </div>
            <Button
              onClick={loadAllData}
              variant="outline"
              size="sm"
              className="inline-flex items-center gap-2 rounded-xl"
            >
              <RefreshCw className="h-4 w-4" />Refresh
            </Button>
          </div>

          <SectionCards kpis={kpis} />

          <DataTable
            clients={clients}
            fetchingClients={fetchingClients}
            handleDeleteClient={handleDeleteClient}
            reloadClients={fetchClients}
            pendingQueue={pendingQueue}
            processingRewardId={processingRewardId}
            handleApproveReward={handleApproveReward}
            handleRejectReward={handleRejectReward}
            conversions={conversions}
            convStageFilter={convStageFilter}
            setConvStageFilter={setConvStageFilter}
            convSearch={convSearch}
            setConvSearch={setConvSearch}
            setConvPage={setConvPage}
            convPage={convPage}
            formatDate={formatDate}
          />
        </div>
      </div>
    </div>
  )
}

