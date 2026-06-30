import * as React from "react"
import { motion } from "framer-motion"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { toast } from "sonner"
import { Client } from "@/types"
import { Separator } from "@/components/ui/separator"
import { ReferredClientsList } from "./referred-clients-list"


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

interface ReferredClientsTabProps {
  clientId: string
}

export function ReferredClientsTab({ clientId }: ReferredClientsTabProps) {
  const [referredClients, setReferredClients] = React.useState<Client[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let isMounted = true
    const fetchClients = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/admin/clients?referrerId=${clientId}&limit=100`)
        const data = await res.json()
        if (data.success && isMounted) {
          setReferredClients(data.users || [])
        }
      } catch {
        if (isMounted) toast.error("Error loading referred clients")
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    if (clientId) {
      fetchClients()
    }
    return () => { isMounted = false }
  }, [clientId])

  const chartData = React.useMemo(() => {
    // Generate last 6 months data points
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

    referredClients.forEach(client => {
      if (!client.createdAt) return
      const createdDate = new Date(client.createdAt)
      const monthIndex = createdDate.getMonth()
      const year = createdDate.getFullYear()
      
      const targetMonth = months.find(m => m.monthIndex === monthIndex && m.year === year)
      if (targetMonth) {
        targetMonth.signups += 1
        // Treat active/resolved status or paid invoice purchases as conversions/purchases for the chart
        if (client.status === 'active' || client.status === 'resolved' || (client.purchase && client.purchase > 0)) {
          targetMonth.purchases += 1
        }
      }
    })

    return months.map(m => ({ month: m.month, signups: m.signups, purchases: m.purchases }))
  }, [referredClients])

  return (
    <motion.div
      key="referred-clients"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 text-xs mt-4"
    >
      {/* Area Chart representation */}
      <div className="m-2 space-y-1">
        <h4 className="font-bold text-xs uppercase tracking-wide text-muted-foreground">Referral Activity</h4>
        <p className="text-[10px] text-muted-foreground">Signups and conversions funnel tracked monthly</p>
        <ChartContainer config={chartConfig} className="h-44 w-full mt-2">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 0,
              right: 10,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="signups"
              type="natural"
              fill="var(--color-signups)"
              fillOpacity={0.2}
              stroke="var(--color-signups)"
              stackId="a"
            />
            <Area
              dataKey="purchases"
              type="natural"
              fill="var(--color-purchases)"
              fillOpacity={0.4}
              stroke="var(--color-purchases)"
              stackId="b"
            />
          </AreaChart>
        </ChartContainer>
      </div>

      <Separator className="bg-border/10" />

      {/* Referred Clients List */}
      <ReferredClientsList clients={referredClients} loading={loading} />
    </motion.div>
  )
}
