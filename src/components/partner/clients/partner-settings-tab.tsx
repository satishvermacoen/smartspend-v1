import * as React from "react"
import { motion } from "framer-motion"
import { Loader2, Link as LinkIcon, ToggleRight, ToggleLeft, Copy, Share2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CodeItem } from "@/types/referral"

interface PartnerSettingsTabProps {
  profileCodes: CodeItem[]
  handleCopyLink: (code: string) => void
  handleWhatsAppShare: (code: string) => void
  handleToggleProfileCodeStatus: (id: string, status: boolean) => void
  handleGenerateProfileCode: (e: React.FormEvent) => void
  profileNewLinkName: string
  setProfileNewLinkName: (val: string) => void
  profileCreatingCode: boolean
}

export function PartnerSettingsTab({
  profileCodes,
  handleCopyLink,
  handleWhatsAppShare,
  handleToggleProfileCodeStatus,
  handleGenerateProfileCode,
  profileNewLinkName,
  setProfileNewLinkName,
  profileCreatingCode,
}: PartnerSettingsTabProps) {
  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 mt-6"
    >
      <div className="bg-card border border-border/10 p-6 rounded-2xl shadow-sm space-y-5">
        <div className="space-y-1">
          <h4 className="font-bold text-sm flex items-center gap-2 uppercase tracking-wide text-foreground">
            <LinkIcon className="h-4 w-4 text-brand" /> Generate New Referral Link
          </h4>
          <p className="text-xs text-muted-foreground">Create custom tracking links for different campaigns.</p>
        </div>
        
        <form onSubmit={handleGenerateProfileCode} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase font-bold">Link Name</Label>
            <Input
              placeholder="e.g. Instagram Bio Promo"
              value={profileNewLinkName}
              onChange={e => setProfileNewLinkName(e.target.value)}
              className="bg-background"
            />
          </div>
          <Button
            type="submit"
            disabled={profileCreatingCode || profileCodes.length >= 5 || !profileNewLinkName.trim()}
            className="w-full sm:w-auto px-6 bg-brand text-primary-foreground font-bold"
          >
            {profileCreatingCode ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {profileCreatingCode ? "Generating..." : "Generate Link"}
          </Button>
        </form>
        {profileCodes.length >= 5 && (
          <p className="text-xs text-destructive font-semibold">
            You have reached the maximum limit of 5 referral links.
          </p>
        )}
      </div>

      <div className="bg-card border border-border/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 bg-muted/20 border-b border-border/10">
          <h4 className="font-bold text-sm uppercase tracking-wide">Active Referral Links ({profileCodes.length})</h4>
        </div>
        
        {profileCodes.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">No links generated yet. Generate one above to start sharing!</div>
        ) : (
          <div className="divide-y divide-border/10 max-h-[350px] overflow-y-auto">
            {profileCodes.map(c => (
              <div key={c._id} className="p-5 space-y-3 hover:bg-muted/10 transition-colors">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="font-semibold text-foreground text-sm">{c.name || "N/A"}</div>
                    <div className="font-mono text-brand font-bold text-sm bg-brand/10 inline-block px-2 py-0.5 rounded border border-brand/20">
                      {c.code}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">Status</span>
                      <Button
                        size="sm"
                        onClick={() => handleToggleProfileCodeStatus(c._id, c.is_active)}
                        className="h-8 w-8 p-0 border-border/10 hover:bg-muted"
                        variant="outline"
                        title={c.is_active ? "Deactivate Code" : "Activate Code"}
                      >
                        {c.is_active ? <ToggleRight className="h-5 w-5 text-brand" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    size="sm"
                    onClick={() => handleCopyLink(c.code)}
                    className="h-8 px-3 text-xs bg-background hover:bg-muted font-semibold"
                    variant="outline"
                  >
                    <Copy className="h-3 w-3 mr-1.5" /> Copy Link
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleWhatsAppShare(c.code)}
                    className="h-8 px-3 text-xs border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 font-semibold"
                    variant="outline"
                  >
                    <Share2 className="h-3 w-3 mr-1.5" /> Share on WhatsApp
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
