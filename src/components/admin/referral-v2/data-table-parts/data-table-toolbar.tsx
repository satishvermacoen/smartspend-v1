"use client"

import * as React from "react"
import { Search, Loader2, Plus, Columns3Icon, ChevronDownIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table } from "@tanstack/react-table"
import { ClientItem, PendingApprovalItem } from "@/types/referral"

export type TabValue = "clients" | "codes" | "conversions" | "pending" | "settings"

interface DataTableToolbarProps<TData> {
  activeTab: TabValue
  setActiveTab: (val: TabValue) => void
  table: Table<TData>
  clients: ClientItem[]
  pendingQueue: PendingApprovalItem[]
  setGlobalDialogOpen: (open: boolean) => void
  clientSearch: string
  setClientSearch: (val: string) => void
  clientSourceFilter: string
  setClientSourceFilter: (val: string) => void
  uniqueSources: string[]
  codesSearch: string
  setCodesSearch: (val: string) => void
  setCodesPage: (page: number) => void
  codesFilter: string
  setCodesFilter: (val: string) => void
  convSearch: string
  setConvSearch: (val: string) => void
  setConvPage: (page: number) => void
  convStageFilter: string
  setConvStageFilter: (val: string) => void
  handleCreateCode: (e: React.FormEvent) => void
  newLinkName: string
  setNewLinkName: (val: string) => void
  newReferrerName: string
  setNewReferrerName: (val: string) => void
  newReferrerPhone: string
  setNewReferrerPhone: (val: string) => void
  newReferrerEmail: string
  setNewReferrerEmail: (val: string) => void
  creatingCode: boolean
}

export function DataTableToolbar<TData>({
  activeTab,
  setActiveTab,
  table,
  clients,
  pendingQueue,
  setGlobalDialogOpen,
  clientSearch,
  setClientSearch,
  clientSourceFilter,
  setClientSourceFilter,
  uniqueSources,
  codesSearch,
  setCodesSearch,
  setCodesPage,
  codesFilter,
  setCodesFilter,
  convSearch,
  setConvSearch,
  setConvPage,
  convStageFilter,
  setConvStageFilter,
  handleCreateCode,
  newLinkName,
  setNewLinkName,
  newReferrerName,
  setNewReferrerName,
  newReferrerPhone,
  setNewReferrerPhone,
  newReferrerEmail,
  setNewReferrerEmail,
  creatingCode,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex flex-col gap-6">
      {/* Top Tabs and Global Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-2 gap-4">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as TabValue)}>
          <TabsList className="bg-card/25 backdrop-blur-xl border border-border/10">
          <TabsTrigger value="clients" className="relative">
            Clients
            {clients.length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-brand/20 text-brand hover:bg-brand/20">
                {clients.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="codes">Codes</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
          <TabsTrigger value="pending">
            Approvals
            {pendingQueue.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingQueue.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {activeTab === "clients" && (
            <>
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search partners..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="pl-8 bg-background border-border/15 h-9 text-xs"
                />
              </div>
              <Select value={clientSourceFilter} onValueChange={setClientSourceFilter}>
                <SelectTrigger className="bg-background border-border/15 h-9 text-xs w-full sm:w-40">
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {uniqueSources.map((src) => (
                    <SelectItem key={src} value={src}>
                      {src}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          {activeTab === "codes" && (
            <>
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
            </>
          )}

          {activeTab === "conversions" && (
            <>
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversions..."
                  value={convSearch}
                  onChange={(e) => {
                    setConvSearch(e.target.value)
                    setConvPage(1)
                  }}
                  className="pl-8 bg-background border-border/15 h-9 text-xs"
                />
              </div>
              <Select
                value={convStageFilter}
                onValueChange={(val) => {
                  setConvStageFilter(val)
                  setConvPage(1)
                }}
              >
                <SelectTrigger className="bg-background border-border/15 h-9 text-xs w-full sm:w-40">
                  <SelectValue placeholder="All Stages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="clicked">Clicked</SelectItem>
                  <SelectItem value="signed_up">Signed Up</SelectItem>
                  <SelectItem value="purchased">Purchased</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
          {activeTab === "clients" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGlobalDialogOpen(true)}
              className="bg-brand hover:brightness-110 h-9 gap-1.5"
            >
              <Plus className="size-4" />
              Record Purchase
            </Button>
          )}

          {activeTab !== "settings" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Columns3Icon data-icon="inline-start" className="size-4" />
                  Columns
                  <ChevronDownIcon data-icon="inline-end" className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide()
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>



      {/* Code Generation Form Block */}
      {activeTab === "codes" && (
        <div className="bg-card/25 backdrop-blur-xl border border-border/10 rounded-2xl p-5 shadow-elegant mx-4 lg:mx-6">
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
                value={newReferrerEmail}
                onChange={(e) => setNewReferrerEmail(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <Button
              type="submit"
              disabled={creatingCode}
              className="h-9 bg-brand text-primary-foreground font-bold text-xs"
            >
              {creatingCode ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate"}
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}
