import * as React from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface PersonalTabProps {
  profileFirstName: string
  setProfileFirstName: (val: string) => void
  profileLastName: string
  setProfileLastName: (val: string) => void
  profileEmail: string
  setProfileEmail: (val: string) => void
  profilePhone: string
  setProfilePhone: (val: string) => void
  profileStatus: string
  setProfileStatus: (val: string) => void
  handleUpdateProfileClient: (e: React.FormEvent) => void
  profileUpdating: boolean
}

export function PersonalTab({
  profileFirstName,
  setProfileFirstName,
  profileLastName,
  setProfileLastName,
  profileEmail,
  setProfileEmail,
  profilePhone,
  setProfilePhone,
  profileStatus,
  setProfileStatus,
  handleUpdateProfileClient,
  profileUpdating,
}: PersonalTabProps) {
  return (
    <motion.div
      key="personal"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 text-xs mt-4"
    >
      <form onSubmit={handleUpdateProfileClient} className="space-y-4">
        <h4 className="font-bold text-xs uppercase tracking-wide text-muted-foreground">Edit Partner Information</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">First Name</Label>
            <Input
              value={profileFirstName}
              onChange={e => setProfileFirstName(e.target.value)}
              className="h-9 text-xs bg-background"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Last Name</Label>
            <Input
              value={profileLastName}
              onChange={e => setProfileLastName(e.target.value)}
              className="h-9 text-xs bg-background"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground uppercase font-bold">Email Address</Label>
          <Input
            type="email"
            value={profileEmail}
            onChange={e => setProfileEmail(e.target.value)}
            className="h-9 text-xs bg-background"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground uppercase font-bold">Phone Number</Label>
          <Input
            value={profilePhone}
            onChange={e => setProfilePhone(e.target.value)}
            className="h-9 text-xs bg-background"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground uppercase font-bold">Account Status</Label>
          <Select value={profileStatus} onValueChange={setProfileStatus}>
            <SelectTrigger className="h-9 text-xs bg-background">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          disabled={profileUpdating}
          className="w-full h-9 bg-brand text-primary-foreground font-bold text-xs mt-2"
        >
          {profileUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
        </Button>
      </form>
    </motion.div>
  )
}
