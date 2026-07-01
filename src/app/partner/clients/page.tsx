"use client"
import React, { useState } from 'react'
import { PartnerClientsView } from '@/components/partner/clients/partner-clients-view'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

export default function PartnerClientsPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setRefreshKey(prev => prev + 1)
    
    // Simulate brief spin animation and notify user
    setTimeout(() => {
      setIsRefreshing(false)
      toast.success("Refresh complete")
    }, 600)
  }

  return (
    <div className="p-6 w-full h-full space-y-6 flex flex-col flex-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-display tracking-tight text-foreground">Referred Clients</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Monitor the clients you&apos;ve referred, their signups, and conversion statuses.
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

      <PartnerClientsView key={refreshKey} />
    </div>
  )
}
