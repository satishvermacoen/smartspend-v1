"use client"
import React, { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, CheckCircle, XCircle } from "lucide-react"
import { format } from "date-fns"

interface Withdrawal {
  _id: string;
  type: string;
  amount: number;
  months: number;
  status: string;
  created_at: string;
  partnerId: string;
  partnerName: string;
  partnerEmail: string;
  rewardId: string;
}

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  const fetchWithdrawals = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/referrals/withdrawals")
      const data = await res.json()
      if (res.ok) {
        setWithdrawals(data.withdrawals)
      } else {
        toast.error(data.error || "Failed to fetch withdrawals")
      }
    } catch  {
      toast.error("An error occurred while fetching withdrawals")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleRefresh = () => {
    setIsLoading(true)
    fetchWithdrawals()
  }

  useEffect(() => {
    const load = async () => {
      await fetchWithdrawals()
    }
    load()
  }, [fetchWithdrawals])

  const handleUpdateStatus = async (rewardId: string, redemptionId: string, status: 'completed' | 'rejected') => {
    setIsProcessing(redemptionId)
    try {
      const res = await fetch("/api/admin/referrals/withdrawals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardId, redemptionId, status })
      })
      const data = await res.json()
      
      if (res.ok) {
        toast.success(data.message || `Withdrawal marked as ${status}`)
        fetchWithdrawals() // Refresh data
      } else {
        toast.error(data.error || "Failed to update status")
      }
    } catch {
      toast.error("An error occurred while updating status")
    } finally {
      setIsProcessing(null)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="p-6 w-full h-full space-y-6 flex flex-col flex-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-display tracking-tight text-foreground">Withdrawal Requests</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage partner commission withdrawal requests.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 border-border/10 hover:bg-muted/50 rounded-lg cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin text-brand' : ''}`} />
          Refresh
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/10 rounded-2xl shadow-sm overflow-hidden flex-1"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-muted/50 border-b border-border/10">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Partner</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    Loading requests...
                  </td>
                </tr>
              ) : withdrawals.length > 0 ? (
                withdrawals.map((w) => (
                  <tr key={w._id} className="border-b border-border/5 last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(new Date(w.created_at), "PPp")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{w.partnerName}</div>
                      <div className="text-xs text-muted-foreground">{w.partnerEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      {w.type === 'cash_claim' ? 'Cash Withdrawal' : 'Subscription'}
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">
                      {formatCurrency(w.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        w.status === 'completed' ? 'default' : 
                        w.status === 'pending' ? 'outline' : 'destructive'
                      } className={
                        w.status === 'completed' ? 'bg-emerald-500 hover:bg-emerald-600' : 
                        w.status === 'pending' ? 'border-amber-500 text-amber-600' : ''
                      }>
                        {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {w.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 border-emerald-500/20 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                            onClick={() => handleUpdateStatus(w.rewardId, w._id, 'completed')}
                            disabled={isProcessing === w._id}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 border-red-500/20 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleUpdateStatus(w.rewardId, w._id, 'rejected')}
                            disabled={isProcessing === w._id}
                          >
                            <XCircle className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No withdrawal requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
