"use client"
import React, { useState, useEffect } from 'react'
import { PartnerSettingsTab } from '@/components/partner/clients/partner-settings-tab'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { CodeItem } from '@/types/referral'

export default function PartnerSettingsPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const [profileCodes, setProfileCodes] = useState<CodeItem[]>([])
  const [profileNewLinkName, setProfileNewLinkName] = useState("")
  const [profileCreatingCode, setProfileCreatingCode] = useState(false)

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

    const fetchCodes = async () => {
      try {
        const res = await fetch(`/api/partner/referral/code`)
        const data = await res.json()
        if (data.success && isMounted) {
          setProfileCodes(data.referralCodes || [])
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchCodes()

    return () => { isMounted = false }
  }, [refreshKey])

  const handleGenerateProfileCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileNewLinkName.trim()) return

    setProfileCreatingCode(true)
    try {
      const res = await fetch(`/api/partner/referral/code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkName: profileNewLinkName })
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Code generated")
        setProfileCodes([data.referralCode, ...profileCodes])
        setProfileNewLinkName("")
      } else {
        toast.error(data.error || "Failed to generate code")
      }
    } catch {
      toast.error("An error occurred")
    } finally {
      setProfileCreatingCode(false)
    }
  }

  const handleToggleProfileCodeStatus = async (id: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus
      setProfileCodes(prev => prev.map(c => c._id === id ? { ...c, is_active: newStatus } : c))
      
      const res = await fetch(`/api/partner/referral/code`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: newStatus })
      })
      const data = await res.json()
      if (!data.success) {
        setProfileCodes(prev => prev.map(c => c._id === id ? { ...c, is_active: currentStatus } : c))
        toast.error(data.error || "Failed to update code status")
      } else {
        toast.success("Status updated")
      }
    } catch {
      setProfileCodes(prev => prev.map(c => c._id === id ? { ...c, is_active: currentStatus } : c))
      toast.error("An error occurred")
    }
  }

  const handleCopyLink = async (code: string) => {
    try {
      const res = await fetch(`/api/partner/referral/share-links?code=${code}`)
      const data = await res.json()
      if (data.success && data.shareLinks?.referralLink) {
        await navigator.clipboard.writeText(data.shareLinks.referralLink)
        toast.success("Link copied to clipboard")
      } else {
        toast.error("Failed to copy link")
      }
    } catch {
      toast.error("An error occurred")
    }
  }

  const handleWhatsAppShare = async (code: string) => {
    try {
      const res = await fetch(`/api/partner/referral/share-links?code=${code}`)
      const data = await res.json()
      if (data.success && data.shareLinks?.whatsapp) {
        window.open(data.shareLinks.whatsapp, '_blank')
      } else {
        toast.error("Failed to generate share link")
      }
    } catch {
      toast.error("An error occurred")
    }
  }

  return (
    <div className="p-6 w-full h-full space-y-6 flex flex-col flex-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-display tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your referral codes and links.
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
        <PartnerSettingsTab
          profileCodes={profileCodes}
          handleCopyLink={handleCopyLink}
          handleWhatsAppShare={handleWhatsAppShare}
          handleToggleProfileCodeStatus={handleToggleProfileCodeStatus}
          handleGenerateProfileCode={handleGenerateProfileCode}
          profileNewLinkName={profileNewLinkName}
          setProfileNewLinkName={setProfileNewLinkName}
          profileCreatingCode={profileCreatingCode}
        />
      </div>
    </div>
  )
}
