"use client"

import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { SettingsTab } from "@/components/admin/referral/settings-tab"
import type { ProgramSettings } from "@/types/referral"

export default function AdminRewardSettingsPage() {
  const [settings, setSettings] = useState<ProgramSettings | null>(null)
  const [updatingSettings, setUpdatingSettings] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/referrals/settings")
      const data = await res.json()
      if (data.success) {
        setSettings(data.settings)
      }
    } catch (err) {
      console.error("Error loading settings:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return
    setUpdatingSettings(true)
    try {
      const res = await fetch("/api/admin/referrals/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success("Referral configuration settings saved!")
        fetchSettings()
      } else {
        throw new Error(data.error || "Update failed.")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update configuration.")
    } finally {
      setUpdatingSettings(false)
    }
  }

  const handleSettingsFieldChange = (
    field: keyof ProgramSettings,
    value: string | number | boolean
  ) => {
    if (!settings) return
    setSettings((prev: ProgramSettings | null) => (prev ? { ...prev, [field]: value } : null))
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
        <span>Loading Reward Settings...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 lg:px-6 gap-4">
            <div>
              <h2 className="text-xl font-display font-bold tracking-tight text-foreground">
                Reward Setting
              </h2>
            </div>
          </div>

          <div className="px-4 lg:px-6 mt-4">
            <SettingsTab
              settings={settings}
              handleSettingsFieldChange={handleSettingsFieldChange}
              handleSaveSettings={handleSaveSettings}
              updatingSettings={updatingSettings}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
