'use client';

import * as React from "react"
import { motion } from "framer-motion"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { toast } from "sonner"
import { Client } from "@/types"
import { CodeItem } from "@/types/referral"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User as UserIcon, IndianRupee, Settings, Users, } from "lucide-react"

import { PartnerClientsList } from "./partner-clients-list"
import { PartnerPersonalTab } from "./partner-personal-tab"
import { PartnerEarningsTab } from "./partner-earnings-tab"
import { PartnerSettingsTab } from "./partner-settings-tab"

const chartConfig = {
  signups: {
    label: "Signups",
    color: "var(--primary)",
  },
  purchases: {
    label: "Purchases",
    color: "var(--brand)",
  },
} satisfies ChartConfig

export function PartnerClientsView() {
  const [activeTab, setActiveTab] = React.useState<string>("clients")
  
  // Data States
  const [clients, setClients] = React.useState<Client[]>([])
  const [loadingClients, setLoadingClients] = React.useState(true)
  
  const [profileStats, setProfileStats] = React.useState({ purchase: 0, sale: 0, commission: 0, cashEarned: 0 })
  const [profileCodes, setProfileCodes] = React.useState<CodeItem[]>([])
  
  // Personal Info States
  const [profileFirstName, setProfileFirstName] = React.useState("")
  const [profileLastName, setProfileLastName] = React.useState("")
  const [profileEmail, setProfileEmail] = React.useState("")
  const [profilePhone, setProfilePhone] = React.useState("")
  const [profileStatus, setProfileStatus] = React.useState("")
  const [profileUpdating, setProfileUpdating] = React.useState(false)

  // Code Generation States
  const [profileNewLinkName, setProfileNewLinkName] = React.useState("")
  const [profileCreatingCode, setProfileCreatingCode] = React.useState(false)

  // Fetch Initial Data
  React.useEffect(() => {
    let isMounted = true

    const fetchAllData = async () => {
      try {
        // Fetch Clients
        fetch(`/api/partner/clients?limit=100`).then(res => res.json()).then(data => {
          if (data.success && isMounted) {
            setClients(data.users || [])
          }
          if (isMounted) setLoadingClients(false)
        }).catch(() => {
          if (isMounted) setLoadingClients(false)
        })

        // Fetch Profile & Earnings
        fetch(`/api/partner/referral/profile`).then(res => res.json()).then(data => {
          if (isMounted && data.user) {
            setProfileFirstName(data.user.firstName || "")
            setProfileLastName(data.user.lastName || "")
            setProfileEmail(data.user.email || "")
            setProfilePhone(data.user.phone || "")
            setProfileStatus(data.user.status || "active")
            setProfileStats({
              purchase: data.stats.purchase || 0,
              sale: data.stats.sale || 0,
              commission: data.stats.commission || 0,
              cashEarned: data.stats.cashEarned || 0,
            })
          }
        })

        // Fetch Referral Codes
        fetch(`/api/partner/referral/code`).then(res => res.json()).then(data => {
          if (data.success && isMounted) {
            setProfileCodes(data.referralCodes || [])
          }
        })

      } catch (error) {
        console.error(error)
      }
    }

    fetchAllData()

    return () => { isMounted = false }
  }, [])

  // Action Handlers
  const handleUpdateProfileClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileUpdating(true)
    try {
      const res = await fetch(`/api/partner/referral/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: profileFirstName,
          lastName: profileLastName,
          phone: profilePhone
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Profile updated successfully")
      } else {
        toast.error(data.error || "Failed to update profile")
      }
    } catch {
      toast.error("An error occurred")
    } finally {
      setProfileUpdating(false)
    }
  }

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
      // Optimistic update
      setProfileCodes(prev => prev.map(c => c._id === id ? { ...c, is_active: newStatus } : c))
      
      const res = await fetch(`/api/partner/referral/code`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: newStatus })
      })
      const data = await res.json()
      if (!data.success) {
        // Revert on failure
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

  // Chart Data Processing
  const chartData = React.useMemo(() => {
    const months = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date()
      d.setMonth(d.getMonth() - (5 - i))
      return {
        month: d.toLocaleString('default', { month: 'short' }),
        year: d.getFullYear(),
        monthIndex: d.getMonth(),
        signups: 0,
        purchases: 0
      }
    })

    clients.forEach(client => {
      if (!client.createdAt) return
      const createdDate = new Date(client.createdAt)
      const monthIndex = createdDate.getMonth()
      const year = createdDate.getFullYear()
      
      const targetMonth = months.find(m => m.monthIndex === monthIndex && m.year === year)
      if (targetMonth) {
        targetMonth.signups += 1
        if (client.status === 'active' || client.status === 'resolved' || (client.purchase && client.purchase > 0)) {
          targetMonth.purchases += 1
        }
      }
    })

    return months.map(m => ({ month: m.month, signups: m.signups, purchases: m.purchases }))
  }, [clients])

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-card border border-border/10 w-full sm:w-auto inline-flex justify-start h-auto p-1.5 rounded-xl shadow-sm mb-6">
          <TabsTrigger value="clients" className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold data-[state=active]:bg-brand/10 data-[state=active]:text-brand rounded-lg">
            <Users className="h-3.5 w-3.5 mr-2" />
            Clients
          </TabsTrigger>
          <TabsTrigger value="earnings" className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold data-[state=active]:bg-brand/10 data-[state=active]:text-brand rounded-lg">
            <IndianRupee className="h-3.5 w-3.5 mr-2" />
            Earnings
          </TabsTrigger>
          {/* <TabsTrigger value="personal" className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold data-[state=active]:bg-brand/10 data-[state=active]:text-brand rounded-lg">
            <UserIcon className="h-3.5 w-3.5 mr-2" />
            Personal
          </TabsTrigger> */}
          <TabsTrigger value="settings" className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold data-[state=active]:bg-brand/10 data-[state=active]:text-brand rounded-lg">
            <Settings className="h-3.5 w-3.5 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Clients Tab */}
        <TabsContent value="clients" className="focus-visible:outline-none">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="bg-card border border-border/10 p-6 rounded-2xl shadow-sm space-y-5">
              <div className="space-y-1">
                <h4 className="font-bold text-sm uppercase tracking-wide text-muted-foreground">Referral Activity</h4>
                <p className="text-xs text-muted-foreground">Signups and conversions tracked over the last 6 months</p>
              </div>
              <div className="pt-2">
                <ChartContainer config={chartConfig} className="h-64 w-full">
                  <AreaChart accessibilityLayer data={chartData} margin={{ left: 0, right: 10 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                    <Area dataKey="signups" type="natural" fill="var(--color-signups)" fillOpacity={0.2} stroke="var(--color-signups)" stackId="a" />
                    <Area dataKey="purchases" type="natural" fill="var(--color-purchases)" fillOpacity={0.4} stroke="var(--color-purchases)" stackId="b" />
                  </AreaChart>
                </ChartContainer>
              </div>
            </div>
            <PartnerClientsList clients={clients} loading={loadingClients} />
          </motion.div>
        </TabsContent>

        {/* Earnings Tab */}
        <TabsContent value="earnings" className="focus-visible:outline-none">
          <PartnerEarningsTab profileStats={profileStats} />
        </TabsContent>

        {/* Personal Tab */}
        <TabsContent value="personal" className="focus-visible:outline-none">
          <PartnerPersonalTab
            profileFirstName={profileFirstName}
            setProfileFirstName={setProfileFirstName}
            profileLastName={profileLastName}
            setProfileLastName={setProfileLastName}
            profileEmail={profileEmail}
            profilePhone={profilePhone}
            setProfilePhone={setProfilePhone}
            profileStatus={profileStatus}
            handleUpdateProfileClient={handleUpdateProfileClient}
            profileUpdating={profileUpdating}
          />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="focus-visible:outline-none">
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
