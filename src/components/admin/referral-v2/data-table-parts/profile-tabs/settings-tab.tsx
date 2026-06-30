import * as React from "react"
import { motion } from "framer-motion"
import { Loader2, Link as LinkIcon, ToggleRight, ToggleLeft } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CodeItem } from "@/types/referral"

interface SettingsTabProps {
  profileCodes: CodeItem[]
  handleCopyLink: (code: string) => void
  handleWhatsAppShare: (code: string) => void
  handleToggleProfileCodeStatus: (id: string, status: boolean) => void
  handleGenerateProfileCode: (e: React.FormEvent) => void
  profileNewLinkName: string
  setProfileNewLinkName: (val: string) => void
  profileCreatingCode: boolean
}

export function SettingsTab({
  profileCodes,
  handleCopyLink,
  handleWhatsAppShare,
  handleToggleProfileCodeStatus,
  handleGenerateProfileCode,
  profileNewLinkName,
  setProfileNewLinkName,
  profileCreatingCode,
}: SettingsTabProps) {
  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4 text-xs mt-4"
    >
      <div className="bg-muted/30 border border-border/10 rounded-xl p-4 space-y-3">
        <h4 className="font-bold text-xs flex items-center gap-1">
          <LinkIcon className="h-3.5 w-3.5 text-brand" /> Generate New Referral Link
        </h4>
        <form onSubmit={handleGenerateProfileCode} className="flex gap-2 items-end">
          <div className="flex-1">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Link Name</Label>
            <Input
              placeholder="e.g. YouTube Promo"
              value={profileNewLinkName}
              onChange={e => setProfileNewLinkName(e.target.value)}
              className="h-8 text-xs bg-background"
            />
          </div>
          <Button
            type="submit"
            disabled={profileCreatingCode || profileCodes.length >= 5}
            className="h-8 px-3 bg-brand text-primary-foreground font-bold text-xs"
          >
            {profileCreatingCode ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Generate"}
          </Button>
        </form>
        {profileCodes.length >= 5 && (
          <p className="text-[10px] text-destructive font-semibold mt-1">
            Reached limit of 5 referral links.
          </p>
        )}
      </div>

      <div className="border border-border/10 rounded-xl overflow-hidden">
        <div className="p-3 bg-muted/40 border-b border-border/10">
          <h4 className="font-bold text-xs">Referral Links ({profileCodes.length})</h4>
        </div>
        {profileCodes.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">No links generated yet.</div>
        ) : (
          <div className="divide-y divide-border/10 max-h-[220px] overflow-y-auto">
            {profileCodes.map(c => (
              <div key={c._id} className="p-3 space-y-2 hover:bg-muted/10 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="font-semibold text-foreground text-xs">{c.name || "N/A"}</div>
                  <span className="font-mono text-brand font-bold text-xs">{c.code}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      onClick={() => handleCopyLink(c.code)}
                      className="h-6 px-1.5 text-[10px] bg-background hover:bg-muted"
                      variant="outline"
                    >
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleWhatsAppShare(c.code)}
                      className="h-6 px-1.5 text-[10px] border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                      variant="outline"
                    >
                      WhatsApp
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleToggleProfileCodeStatus(c._id, c.is_active)}
                    className="h-6 w-6 p-0 border-border/10 hover:bg-muted"
                    variant="outline"
                  >
                    {c.is_active ? <ToggleRight className="h-4 w-4 text-brand" /> : <ToggleLeft className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
