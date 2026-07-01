import * as React from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface PartnerPersonalTabProps {
  profileFirstName: string
  setProfileFirstName: (val: string) => void
  profileLastName: string
  setProfileLastName: (val: string) => void
  profileEmail: string
  profilePhone: string
  setProfilePhone: (val: string) => void
  profileStatus: string
  handleUpdateProfileClient: (e: React.FormEvent) => void
  profileUpdating: boolean
}

export function PartnerPersonalTab({
  profileFirstName,
  setProfileFirstName,
  profileLastName,
  setProfileLastName,
  profileEmail,
  profilePhone,
  setProfilePhone,
  profileStatus,
  handleUpdateProfileClient,
  profileUpdating,
}: PartnerPersonalTabProps) {
  return (
    <motion.div
      key="personal"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 text-sm mt-6"
    >
      <form onSubmit={handleUpdateProfileClient} className="space-y-5 bg-card border border-border/10 p-6 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <h4 className="font-bold text-sm uppercase tracking-wide text-muted-foreground">Personal Information</h4>
          <p className="text-xs text-muted-foreground">Manage your contact details. Some fields are read-only.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase font-bold">First Name</Label>
            <Input
              value={profileFirstName}
              onChange={e => setProfileFirstName(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase font-bold">Last Name</Label>
            <Input
              value={profileLastName}
              onChange={e => setProfileLastName(e.target.value)}
              className="bg-background"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground uppercase font-bold">Email Address</Label>
          <Input
            type="email"
            value={profileEmail}
            disabled
            className="bg-muted text-muted-foreground cursor-not-allowed"
          />
          <p className="text-[10px] text-muted-foreground">Email address cannot be changed.</p>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground uppercase font-bold">Phone Number</Label>
          <Input
            value={profilePhone}
            onChange={e => setProfilePhone(e.target.value)}
            className="bg-background"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground uppercase font-bold">Account Status</Label>
          <Select value={profileStatus} disabled>
            <SelectTrigger className="bg-muted text-muted-foreground cursor-not-allowed capitalize">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={profileUpdating}
            className="w-full sm:w-auto px-8 bg-brand text-primary-foreground font-bold"
          >
            {profileUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {profileUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
