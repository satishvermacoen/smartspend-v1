import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Clipboard, MessageCircle, ToggleLeft, ToggleRight, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CodeItem } from './types';

interface CodesTabProps {
  codes: CodeItem[];
  codesFilter: string;
  setCodesFilter: (val: string) => void;
  codesSearch: string;
  setCodesSearch: (val: string) => void;
  setCodesPage: (val: number) => void;
  handleCreateCode: (e: React.FormEvent) => void;
  newLinkName: string;
  setNewLinkName: (val: string) => void;
  newReferrerName: string;
  setNewReferrerName: (val: string) => void;
  newReferrerPhone: string;
  setNewReferrerPhone: (val: string) => void;
  newReferrerEmail: string;
  setNewReferrerEmail: (val: string) => void;
  creatingCode: boolean;
  handleCopyLink: (code: string) => void;
  handleWhatsAppShare: (code: string) => void;
  handleToggleCodeStatus: (id: string, status: boolean) => void;
  handleDeleteCode: (id: string) => void;
}

export function CodesTab({
  codes,
  codesFilter,
  setCodesFilter,
  codesSearch,
  setCodesSearch,
  setCodesPage,
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
  handleCopyLink,
  handleWhatsAppShare,
  handleToggleCodeStatus,
  handleDeleteCode
}: CodesTabProps) {
  return (
    <motion.div
      key="codes"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="bg-card/25 backdrop-blur-xl border border-border/10 rounded-2xl p-6 shadow-elegant">
        <h3 className="font-bold text-base mb-4 flex items-center gap-1.5"><Plus className="h-4 w-4 text-brand" /> Create Referral Code</h3>
        <form onSubmit={handleCreateCode} className="grid gap-4 sm:grid-cols-5 items-end">
          <div className="sm:col-span-1">
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">Link Name</label>
            <input
              type="text"
              placeholder="e.g. Summer Promo"
              value={newLinkName}
              onChange={e => setNewLinkName(e.target.value)}
              className="w-full bg-soft/30 border border-border/10 rounded-xl px-3 py-2.5 text-sm text-foreground focus:border-brand/40 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">Client Name</label>
            <input
              type="text"
              placeholder="Jane Doe"
              value={newReferrerName}
              onChange={e => setNewReferrerName(e.target.value)}
              className="w-full bg-soft/30 border border-border/10 rounded-xl px-3 py-2.5 text-sm text-foreground focus:border-brand/40 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">Client Phone</label>
            <input
              type="text"
              placeholder="+91..."
              value={newReferrerPhone}
              onChange={e => setNewReferrerPhone(e.target.value)}
              className="w-full bg-soft/30 border border-border/10 rounded-xl px-3 py-2.5 text-sm text-foreground focus:border-brand/40 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">Client Email</label>
            <input
              type="email"
              placeholder="user@example.com"
              value={newReferrerEmail}
              onChange={e => setNewReferrerEmail(e.target.value)}
              className="w-full bg-soft/30 border border-border/10 rounded-xl px-3 py-2.5 text-sm text-foreground focus:border-brand/40 focus:outline-none"
            />
          </div>

          <Button
            type="submit"
            disabled={creatingCode}
            className="w-full h-11 bg-gradient-brand text-primary-foreground font-bold rounded-xl text-sm hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-1 sm:col-span-1"
          >
            {creatingCode ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Generate Code</>}
          </Button>
        </form>
      </div>

      <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-2xl shadow-elegant overflow-hidden">
        <div className="p-5 border-b border-border/5 bg-soft/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="font-bold text-base">Referral Codes List</h3>
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={codesFilter}
              onChange={e => { setCodesFilter(e.target.value); setCodesPage(1); }}
              className="bg-soft/30 border border-border/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none"
            >
              <option value="all" className="bg-background text-foreground">All Status</option>
              <option value="active" className="bg-background text-foreground">Active</option>
              <option value="inactive" className="bg-background text-foreground">Inactive</option>
            </select>
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search codes..."
                value={codesSearch}
                onChange={e => { setCodesSearch(e.target.value); setCodesPage(1); }}
                className="w-full bg-soft/30 border border-border/10 rounded-xl pl-8 pr-3 py-2 text-xs text-foreground focus:border-brand/40 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {codes.length === 0 ? (
          <div className="py-14 text-center text-muted-foreground text-sm">No referral codes found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border/15 bg-soft/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Link</th>
                  <th className="px-6 py-4">Referrer Owner</th>
                  <th className="px-6 py-4">Reward Scheme</th>
                  <th className="px-6 py-4">Uses (Clicks/Sales)</th>
                  <th className="px-6 py-4">Revenue</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {codes.map(c => (
                  <tr key={c._id} className="hover:bg-soft/5">
                    <td className="px-6 py-4 font-mono font-bold text-foreground">{c.code}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleCopyLink(c.code)}
                          className="h-7 px-2 rounded-lg border border-border/15 bg-soft/10 text-muted-foreground hover:text-foreground hover:bg-soft transition-all inline-flex items-center gap-1 text-xs"
                        >
                          <Clipboard className="h-3 w-3" /> Copy
                        </Button>
                        <Button
                          onClick={() => handleWhatsAppShare(c.code)}
                          className="h-7 px-2 rounded-lg border border-green-500/20 bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-all inline-flex items-center gap-1 text-xs"
                        >
                          <MessageCircle className="h-3 w-3" /> WhatsApp
                        </Button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {c.referrer ? (
                        <div>
                          <div className="font-semibold text-foreground text-xs">{c.referrer.name}</div>
                          <div className="text-[10px] text-muted-foreground">{c.referrer.email}</div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">None (Unassigned)</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {c.reward.type === 'cash' 
                        ? `Cash (₹${c.reward.cashAmount})` 
                        : `Sub (${c.reward.subscriptionMonths} mos)`}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold">
                      {c.stats.clicks} clicks / {c.stats.purchases} conversions
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-emerald-400">
                      ₹{c.stats.revenue}
                    </td>
                    <td className="px-6 py-4">
                      {c.is_active ? (
                        <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">Active</span>
                      ) : (
                        <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-muted text-muted-foreground border border-border/10">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => handleToggleCodeStatus(c._id, c.is_active)}
                          className="h-8 w-8 rounded-lg border border-border/15 flex items-center justify-center hover:bg-soft transition-all text-foreground cursor-pointer"
                          title="Toggle Active Status"
                        >
                          {c.is_active ? <ToggleRight className="h-5 w-5 text-brand" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                        </Button>
                        <Button
                          onClick={() => handleDeleteCode(c._id)}
                          className="h-8 w-8 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-all cursor-pointer"
                          title="Delete Code"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
