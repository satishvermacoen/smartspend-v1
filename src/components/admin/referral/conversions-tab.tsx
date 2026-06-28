import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConversionItem, PendingApprovalItem } from './types';

interface ConversionsTabProps {
  pendingQueue: PendingApprovalItem[];
  processingRewardId: string | null;
  handleApproveReward: (item: PendingApprovalItem) => void;
  handleRejectReward: (item: PendingApprovalItem) => void;
  conversions: ConversionItem[];
  convStageFilter: string;
  setConvStageFilter: (val: string) => void;
  convSearch: string;
  setConvSearch: (val: string) => void;
  setConvPage: (val: number) => void;
  formatDate: (dateStr: string) => string;
}

export function ConversionsTab({
  pendingQueue,
  processingRewardId,
  handleApproveReward,
  handleRejectReward,
  conversions,
  convStageFilter,
  setConvStageFilter,
  convSearch,
  setConvSearch,
  setConvPage,
  formatDate
}: ConversionsTabProps) {
  return (
    <motion.div
      key="conversions"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="bg-card/25 border border-border/10 rounded-2xl p-6 shadow-elegant">
        <h3 className="font-bold text-base mb-4 flex items-center gap-1.5"><Coins className="h-5 w-5 text-brand animate-pulse" /> Pending Rewards Approvals Queue</h3>
        {pendingQueue.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground border border-dashed border-border/10 rounded-xl">
            No pending rewards queue. If auto-credit settings are toggled on, rewards approve automatically on simulated purchases!
          </div>
        ) : (
          <div className="space-y-3 max-h-[250px] overflow-y-auto">
            {pendingQueue.map(item => (
              <div key={item.redemptionId} className="flex flex-col sm:flex-row sm:items-center justify-between border border-border/10 rounded-xl p-4 bg-soft/10 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-foreground">{item.customerName}</span>
                    <span className="text-xs text-muted-foreground font-mono">({item.customerEmail})</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Claiming: <strong className="text-brand">{item.type === 'subscription_activation' ? `${item.months} Mos Subscription extension` : `₹${item.amount} Cash Payout`}</strong> on referral conversion.
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    disabled={processingRewardId === item.redemptionId}
                    onClick={() => handleApproveReward(item)}
                    className="inline-flex h-9 items-center px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 font-bold text-white text-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    Approve
                  </Button>
                  <Button
                    disabled={processingRewardId === item.redemptionId}
                    onClick={() => handleRejectReward(item)}
                    className="inline-flex h-9 items-center px-4 rounded-lg bg-destructive/15 text-destructive border border-destructive/20 text-xs hover:bg-destructive/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-2xl shadow-elegant overflow-hidden">
        <div className="p-5 border-b border-border/5 bg-soft/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="font-bold text-base">Funnel Conversion Audit Ledger</h3>
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={convStageFilter}
              onChange={e => { setConvStageFilter(e.target.value); setConvPage(1); }}
              className="bg-soft/30 border border-border/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none"
            >
              <option value="all" className="bg-background text-foreground">All Stages</option>
              <option value="clicked" className="bg-background text-foreground">Clicked</option>
              <option value="signed_up" className="bg-background text-foreground">Signed Up</option>
              <option value="purchased" className="bg-background text-foreground">Purchased</option>
              <option value="cancelled" className="bg-background text-foreground">Cancelled</option>
            </select>
            
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search conversions..."
                value={convSearch}
                onChange={e => { setConvSearch(e.target.value); setConvPage(1); }}
                className="w-full bg-soft/30 border border-border/10 rounded-xl pl-8 pr-3 py-2 text-xs text-foreground focus:border-brand/40 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {conversions.length === 0 ? (
          <div className="py-14 text-center text-muted-foreground text-sm">No conversion records matching criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border/15 bg-soft/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="px-6 py-4">Prospect</th>
                  <th className="px-6 py-4">Referrer Code</th>
                  <th className="px-6 py-4">Stage</th>
                  <th className="px-6 py-4">Timeline Event</th>
                  <th className="px-6 py-4 text-right">Referrer Reward</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {conversions.map(c => (
                  <tr key={c._id} className="hover:bg-soft/5">
                    <td className="px-6 py-4">
                      {c.prospect ? (
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-foreground text-xs">{c.prospect.name}</span>
                            {c.isFlagged && (
                              <span 
                                className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-destructive/15 text-destructive border border-destructive/10 cursor-help" 
                                title={c.flagReason}
                              >
                                Flagged
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-muted-foreground">{c.prospect.email}</div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Anonymous user</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono">
                      <div>{c.referralCode}</div>
                      {c.referrer && <div className="text-[9px] text-muted-foreground">Owner: {c.referrer.name}</div>}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {c.conversionStage === 'clicked' && <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/10 text-blue-400">Clicked</span>}
                      {c.conversionStage === 'signed_up' && <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-400">Signed Up</span>}
                      {c.conversionStage === 'purchased' && <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400">Purchased</span>}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {c.timeline?.purchased_at ? (
                        <>Purchased on {formatDate(c.timeline.purchased_at)}</>
                      ) : c.timeline?.signed_up_at ? (
                        <>Registered on {formatDate(c.timeline.signed_up_at)}</>
                      ) : c.timeline?.clicked_at ? (
                        <>Clicked link on {formatDate(c.timeline.clicked_at)}</>
                      ) : (
                        <>Updated {formatDate(c.timeline?.clicked_at || c.createdAt || '')}</>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-xs">
                      {c.referrerReward ? (
                        <div>
                          <span className="font-bold text-brand">
                            {c.referrerReward.type === 'cash' ? `₹${c.referrerReward.amount}` : `${c.referrerReward.amount} Mos`}
                          </span>
                          <div className="text-[9px] text-muted-foreground capitalize">({c.referrerReward.status})</div>
                        </div>
                      ) : <span className="text-muted-foreground/45">-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
