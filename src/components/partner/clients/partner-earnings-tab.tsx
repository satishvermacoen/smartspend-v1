import * as React from "react"
import { motion } from "framer-motion"

interface PartnerEarningsTabProps {
  profileStats: { purchase: number; sale: number; commission: number; cashEarned: number }
}

export function PartnerEarningsTab({ profileStats }: PartnerEarningsTabProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <motion.div
      key="earnings"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 mt-6"
    >
      <div className="bg-card border border-border/10 p-6 rounded-2xl shadow-sm space-y-6">
        <div className="space-y-1">
          <h4 className="font-bold text-sm uppercase tracking-wide text-muted-foreground">Earnings Overview</h4>
          <p className="text-xs text-muted-foreground">A summary of your generated sales and earned commissions.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 flex flex-col justify-center items-center text-center shadow-sm">
            <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">Total Sales</p>
            <h4 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(profileStats.sale)}</h4>
          </div>
          
          <div className="bg-brand/10 border border-brand/20 rounded-xl p-6 flex flex-col justify-center items-center text-center shadow-sm">
            <p className="text-[11px] font-bold text-brand uppercase tracking-wider mb-2">Commissions</p>
            <h4 className="text-2xl font-bold text-brand">{formatCurrency(profileStats.commission)}</h4>
          </div>
          
          <div className="bg-muted border border-border/50 rounded-xl p-6 flex flex-col justify-center items-center text-center shadow-sm">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Total Purchases</p>
            <h4 className="text-2xl font-bold text-foreground">{formatCurrency(profileStats.purchase)}</h4>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
