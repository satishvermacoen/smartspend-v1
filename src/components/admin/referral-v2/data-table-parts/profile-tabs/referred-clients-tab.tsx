import * as React from "react"
import { motion } from "framer-motion"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Client } from "@/types"
import { Separator } from "@/components/ui/separator"



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
        // Treat active/resolved as conversions/purchases for the chart
        if (client.status === 'active' || client.status === 'resolved') {
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
      <div className="space-y-3 m-2">
        <h4 className="font-bold text-xs uppercase tracking-wide text-muted-foreground">Referred Clients</h4>
        
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-brand" />
          </div>
        ) : referredClients.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">No referred clients yet.</div>
        ) : (
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
            {referredClients.map(client => (
              <div key={client._id} className="p-3 border border-border/10 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-foreground text-xs">{client.name}</p>
                    <p className="text-[10px] text-muted-foreground">{client.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                      {client.status || "active"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
