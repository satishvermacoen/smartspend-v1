"use client"

import * as React from "react"
import { Search, Plus, Columns3Icon, ChevronDownIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

export type TabValue = "clients" | "codes" | "conversions" | "pending"

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
  convSearch: string
  setConvSearch: (val: string) => void
  setConvPage: (page: number) => void
  convStageFilter: string
  setConvStageFilter: (val: string) => void
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
  convSearch,
  setConvSearch,
  setConvPage,
  convStageFilter,
  setConvStageFilter,
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

          <TabsTrigger value="conversions">Conversions</TabsTrigger>
          <TabsTrigger value="pending">
            Approvals
            {pendingQueue.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingQueue.length}
              </Badge>
            )}
          </TabsTrigger>
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
        </div>
      </div>
    </div>
  )
}
