import * as React from "react"
import { motion } from "framer-motion"

interface EarningsTabProps {
  profileStats: { purchase: number; sale: number; commission: number; cashEarned: number }
}

export function EarningsTab({ profileStats }: EarningsTabProps) {
  return (
    <motion.div
      key="earnings"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="grid grid-cols-3 gap-3 mt-4"
    >
      <div className="bg-muted/30 border border-border/10 rounded-xl p-3 flex flex-col justify-center items-center text-center">
        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Sales</p>
        <h4 className="text-sm font-bold text-emerald-400">₹{profileStats.sale}</h4>
      </div>
      <div className="bg-muted/30 border border-border/10 rounded-xl p-3 flex flex-col justify-center items-center text-center">
        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Commissions</p>
        <h4 className="text-sm font-bold text-brand">₹{profileStats.commission}</h4>
      </div>
      <div className="bg-muted/30 border border-border/10 rounded-xl p-3 flex flex-col justify-center items-center text-center">
        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Purchases</p>
        <h4 className="text-sm font-bold text-foreground">₹{profileStats.purchase}</h4>
      </div>
    </motion.div>
  )
}
