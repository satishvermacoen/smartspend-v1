"use client"

import React, { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { Search, Loader2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { getCodeColumns } from "@/components/admin/referral-v2/data-table-parts/columns"
import type { CodeItem } from "@/types/referral"

export default function AdminInviteCodesPage() {
  const [codes, setCodes] = useState<CodeItem[]>([])
  const [loading, setLoading] = useState(true)
  
  const [codesSearch, setCodesSearch] = useState("")
  const [codesFilter, setCodesFilter] = useState("all")
  const [codesPage, setCodesPage] = useState(1)

  // Create Code form state
  const [newLinkName, setNewLinkName] = useState("")
  const [newReferrerName, setNewReferrerName] = useState("")
  const [newReferrerPhone, setNewReferrerPhone] = useState("")
  const [newReferrerEmail, setNewReferrerEmail] = useState("")
  const [creatingCode, setCreatingCode] = useState(false)

  const fetchCodes = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/admin/referrals/codes?status=${codesFilter}&search=${encodeURIComponent(codesSearch)}&page=${codesPage}&limit=10`
      )
      const data = await res.json()
      if (data.success) {
        setCodes(data.codes)
      }
    } catch (err) {
      console.error("Error loading codes:", err)
    } finally {
      setLoading(false)
    }
  }, [codesFilter, codesSearch, codesPage])

  useEffect(() => {
    fetchCodes()
  }, [fetchCodes])

  const handleToggleCodeStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/referrals/codes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus }),
      })
      if (res.ok) {
        toast.success(`Referral code status updated.`)
        fetchCodes()
      } else {
        throw new Error()
      }
    } catch {
      toast.error("Failed to toggle code status.")
    }
  }

  const handleDeleteCode = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this code?")) return
    try {
      const res = await fetch(`/api/admin/referrals/codes/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Referral code deleted.")
        fetchCodes()
      } else {
        throw new Error()
      }
    } catch {
      toast.error("Failed to delete code.")
    }
  }

  const handleCreateCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLinkName) {
      toast.error("Please provide a name for this referral link.")
      return
    }
    setCreatingCode(true)
    try {
      const res = await fetch("/api/admin/referrals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          linkName: newLinkName,
          name: newReferrerName,
          phone: newReferrerPhone,
          email: newReferrerEmail,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        if (data.userCreated) {
          toast.success(
            <div className="flex flex-col gap-1.5 p-1">
              <span className="font-semibold text-sm text-foreground">Referral link generated!</span>
              <span className="text-xs text-muted-foreground">A new user account was created:</span>
              <div className="bg-muted p-2 rounded-lg text-xs space-y-1 font-mono select-all">
                <div>Email: {data.email}</div>
                <div>Password: {data.password}</div>
              </div>
              <span className="text-[10px] text-muted-foreground">Please copy and share these credentials with the client.</span>
            </div>,
            { duration: 20000 }
          )
        } else {
          toast.success("Referral link generated successfully!")
        }
        setNewLinkName("")
        setNewReferrerName("")
        setNewReferrerPhone("")
        setNewReferrerEmail("")
        fetchCodes()
      } else {
        throw new Error(data.error || "Creation failed.")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create code.")
    } finally {
      setCreatingCode(false)
    }
  }

  const handleCopyLink = (code: string) => {
    const link = `${window.location.origin}/join/${code}`
    navigator.clipboard.writeText(link)
    toast.success("Link copied to clipboard")
  }

  const handleWhatsAppShare = (code: string) => {
    const link = `${window.location.origin}/join/${code}`
    const message = encodeURIComponent(`Here is the invite link: ${link}`)
    window.open(`https://wa.me/?text=${message}`, "_blank")
  }

  const columns = React.useMemo(
    () => getCodeColumns(handleToggleCodeStatus, handleDeleteCode, handleCopyLink, handleWhatsAppShare),
    []
  )

  const table = useReactTable({
    data: codes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-6 w-full h-full space-y-6 flex flex-col flex-1 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-xl font-bold font-display tracking-tight text-foreground">Invite Codes</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Generate and manage invite codes for your partners.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/25 p-4 rounded-xl border border-border/10 shadow-elegant">
        <div className="relative w-full sm:w-60">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search codes..."
            value={codesSearch}
            onChange={(e) => {
              setCodesSearch(e.target.value)
              setCodesPage(1)
            }}
            className="pl-8 bg-background border-border/15 h-9 text-xs"
          />
        </div>
        <Select
          value={codesFilter}
          onValueChange={(val) => {
            setCodesFilter(val)
            setCodesPage(1)
          }}
        >
          <SelectTrigger className="bg-background border-border/15 h-9 text-xs w-full sm:w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card/25 backdrop-blur-xl border border-border/10 rounded-2xl p-5 shadow-elegant">
        <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">Generate New Referral Code</h4>
        <form onSubmit={handleCreateCode} className="grid gap-3 sm:grid-cols-5 items-end">
          <div>
            <Label className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Link Name</Label>
            <Input
              placeholder="e.g. Summer Promo"
              value={newLinkName}
              onChange={(e) => setNewLinkName(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Client Name</Label>
            <Input
              placeholder="Jane Doe"
              value={newReferrerName}
              onChange={(e) => setNewReferrerName(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Client Phone</Label>
            <Input
              placeholder="+91..."
              value={newReferrerPhone}
              onChange={(e) => setNewReferrerPhone(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Client Email</Label>
            <Input
              placeholder="user@example.com"
              type="email"
              value={newReferrerEmail}
              onChange={(e) => setNewReferrerEmail(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
          <Button type="submit" disabled={creatingCode} className="h-9 w-full bg-brand hover:bg-brand/90 text-white font-medium text-xs">
            {creatingCode ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate"}
          </Button>
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/10 bg-card/25 backdrop-blur-xl shadow-elegant">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
            <span className="text-xs">Fetching codes...</span>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/40 sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-border/10 hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan} className="text-xs font-bold text-muted-foreground uppercase py-3">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="border-border/10 hover:bg-muted/30">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground text-xs"
                  >
                    No invite codes found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
