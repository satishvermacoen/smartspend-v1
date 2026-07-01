'use client';

import * as React from "react"
import { motion } from "framer-motion"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Client } from "@/types"

import { PartnerClientsList } from "./partner-clients-list"

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
  const [clients, setClients] = React.useState<Client[]>([])
  const [loadingClients, setLoadingClients] = React.useState(true)
  
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

      } catch (error) {
        console.error(error)
      }
    }

    fetchAllData()

    return () => { isMounted = false }
  }, [])

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
    <div className="w-full h-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="space-y-8 h-full flex flex-col"
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
        <div className="flex-1">
          <PartnerClientsList clients={clients} loading={loadingClients} />
        </div>
      </motion.div>
    </div>
  )
}
