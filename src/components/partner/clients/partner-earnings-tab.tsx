import { motion } from "framer-motion"
import { PartnerWithdrawDialog } from "./partner-withdraw-dialog"
import { Badge } from "@/components/ui/badge"

export interface Redemption {
  _id: string;
  created_at: string;
  type: string;
  amount: number;
  months?: number;
  status: string;
}

interface PartnerEarningsTabProps {
  profileStats: { 
    purchase: number; 
    sale: number; 
    commission: number; 
    cashEarned: number;
    pendingCash?: number;
    availableBalance?: number;
  },
  redemptions?: Redemption[]
}

export function PartnerEarningsTab({ profileStats, redemptions = [] }: PartnerEarningsTabProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-sm uppercase tracking-wide text-muted-foreground">Earnings Overview</h4>
            <p className="text-xs text-muted-foreground">A summary of your generated sales and earned commissions.</p>
          </div>
          <PartnerWithdrawDialog availableBalance={profileStats.availableBalance || 0} />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 flex flex-col justify-center items-center text-center shadow-sm">
            <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">Available to Withdraw</p>
            <h4 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(profileStats.availableBalance || 0)}</h4>
          </div>
          
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 flex flex-col justify-center items-center text-center shadow-sm">
            <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">Pending Withdrawal</p>
            <h4 className="text-2xl font-bold text-amber-700 dark:text-amber-300">{formatCurrency(profileStats.pendingCash || 0)}</h4>
          </div>
          
          <div className="bg-muted border border-border/50 rounded-xl p-6 flex flex-col justify-center items-center text-center shadow-sm">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Total Cash Earned</p>
            <h4 className="text-2xl font-bold text-foreground">{formatCurrency(profileStats.cashEarned || 0)}</h4>
          </div>
        </div>
      </div>

      {/* Redemptions History */}
      <div className="bg-card border border-border/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border/10">
          <h4 className="font-bold text-sm uppercase tracking-wide text-foreground">Withdrawal History</h4>
          <p className="text-xs text-muted-foreground mt-1">Track your past withdrawal requests and their statuses.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-muted/50 border-b border-border/10">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Amount / Duration</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {redemptions && redemptions.length > 0 ? (
                // Sort redemptions by date descending
                [...redemptions].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((redemption) => (
                  <tr key={redemption._id} className="border-b border-border/5 last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(redemption.created_at)}</td>
                    <td className="px-6 py-4">
                      {redemption.type === 'cash_claim' ? 'Cash Withdrawal' : 'Subscription Activation'}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {redemption.type === 'cash_claim' 
                        ? formatCurrency(redemption.amount)
                        : `${redemption.months} Months`}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        redemption.status === 'completed' ? 'default' : 
                        redemption.status === 'pending' ? 'outline' : 'destructive'
                      } className={
                        redemption.status === 'completed' ? 'bg-emerald-500 hover:bg-emerald-600' : 
                        redemption.status === 'pending' ? 'border-amber-500 text-amber-600' : ''
                      }>
                        {redemption.status.charAt(0).toUpperCase() + redemption.status.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No withdrawal requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
