"use client"
import React, { useState, useEffect } from 'react'
import { PartnerEarningsTab, Redemption } from '@/components/partner/clients/partner-earnings-tab'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

export default function PartnerEarningsPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const [profileStats, setProfileStats] = useState({ purchase: 0, sale: 0, commission: 0, cashEarned: 0, pendingCash: 0, availableBalance: 0 })
  const [profileRedemptions, setProfileRedemptions] = useState<Redemption[]>([])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setRefreshKey(prev => prev + 1)
    
    setTimeout(() => {
      setIsRefreshing(false)
      toast.success("Refresh complete")
    }, 600)
  }

  useEffect(() => {
    let isMounted = true

    const fetchEarningsData = async () => {
      try {
        const res = await fetch(`/api/partner/referral/profile`)
        const data = await res.json()
        if (isMounted && data.user) {
          setProfileStats({
            purchase: data.stats?.purchase || 0,
            sale: data.stats?.sale || 0,
            commission: data.stats?.commission || 0,
            cashEarned: data.stats?.cashEarned || 0,
            pendingCash: data.stats?.pendingCash || 0,
            availableBalance: data.stats?.availableBalance || 0,
          })
          if (data.redemptions) {
            setProfileRedemptions(data.redemptions)
          }
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchEarningsData()

    return () => { isMounted = false }
  }, [refreshKey])

  return (
    <div className="p-6 w-full h-full space-y-6 flex flex-col flex-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-display tracking-tight text-foreground">Earnings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track your commission, cash earned, and redemption history.
          </p>
        </div>
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 border-border/10 hover:bg-muted/50 rounded-lg cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-brand' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <PartnerEarningsTab profileStats={profileStats} redemptions={profileRedemptions} />
      </div>
    </div>
  )
}
