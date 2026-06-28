import React from 'react';
import { motion } from 'framer-motion';
import { Settings, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgramSettings } from './types';

interface SettingsTabProps {
  settings: ProgramSettings | null;
  handleSettingsFieldChange: (field: keyof ProgramSettings, value: string | number | boolean) => void;
  handleSaveSettings: (e: React.FormEvent) => void;
  updatingSettings: boolean;
}

export function SettingsTab({
  settings,
  handleSettingsFieldChange,
  handleSaveSettings,
  updatingSettings
}: SettingsTabProps) {
  if (!settings) return null;

  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-3xl bg-card/25 backdrop-blur-xl border border-border/10 rounded-2xl p-6 sm:p-8 shadow-elegant"
    >
      <form onSubmit={handleSaveSettings} className="space-y-6">
        <h3 className="font-bold text-lg border-b border-border/5 pb-3 flex items-center gap-1.5">
          <Settings className="h-5 w-5 text-brand" /> Referral Reward Configuration
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
              High Cash Reward Amount (₹)
            </label>
            <input
              type="number"
              value={settings.cash_reward_high}
              onChange={e => handleSettingsFieldChange("cash_reward_high", e.target.value)}
              className="w-full bg-soft/30 border border-border/10 rounded-xl px-4 py-3 text-sm text-foreground focus:border-brand/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
              Low Cash Reward Amount (₹)
            </label>
            <input
              type="number"
              value={settings.cash_reward_low}
              onChange={e => handleSettingsFieldChange("cash_reward_low", e.target.value)}
              className="w-full bg-soft/30 border border-border/10 rounded-xl px-4 py-3 text-sm text-foreground focus:border-brand/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
              Min Purchase Threshold (₹)
            </label>
            <input
              type="number"
              value={settings.min_purchase_for_reward}
              onChange={e => handleSettingsFieldChange("min_purchase_for_reward", e.target.value)}
              className="w-full bg-soft/30 border border-border/10 rounded-xl px-4 py-3 text-sm text-foreground focus:border-brand/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
              Referral Signup Bonus Discount (₹)
            </label>
            <input
              type="number"
              value={settings.referral_bonus_amount}
              onChange={e => handleSettingsFieldChange("referral_bonus_amount", e.target.value)}
              className="w-full bg-soft/30 border border-border/10 rounded-xl px-4 py-3 text-sm text-foreground focus:border-brand/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
              Free Subscription Months Reward
            </label>
            <input
              type="number"
              value={settings.subscription_months}
              onChange={e => handleSettingsFieldChange("subscription_months", e.target.value)}
              className="w-full bg-soft/30 border border-border/10 rounded-xl px-4 py-3 text-sm text-foreground focus:border-brand/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
              Currency Code
            </label>
            <input
              type="text"
              value={settings.currency}
              onChange={e => handleSettingsFieldChange("currency", e.target.value)}
              className="w-full bg-soft/30 border border-border/10 rounded-xl px-4 py-3 text-sm text-foreground focus:border-brand/40 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 border-t border-border/5 pt-4 mt-2">
            <h4 className="font-bold text-sm mb-4">Commission Settings</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                  Commission Percentage (%)
                </label>
                <input
                  type="number"
                  value={settings.commission_percentage || 10}
                  onChange={e => handleSettingsFieldChange("commission_percentage", e.target.value)}
                  className="w-full bg-soft/30 border border-border/10 rounded-xl px-4 py-3 text-sm text-foreground focus:border-brand/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                  Default Reward Type
                </label>
                <select
                  value={settings.default_reward_type || 'percentage'}
                  onChange={e => handleSettingsFieldChange("default_reward_type", e.target.value)}
                  className="w-full bg-soft/30 border border-border/10 rounded-xl px-4 py-3 text-sm text-foreground focus:border-brand/40 focus:outline-none"
                >
                  <option value="percentage" className="bg-background">Percentage of Sale</option>
                  <option value="fixed_cash" className="bg-background">Fixed Cash Reward</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 border-t border-border/5 pt-5">
          <h4 className="font-bold text-sm">Automation Settings</h4>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold uppercase text-foreground">Auto-Credit Referrer Cash Rewards</div>
                <div className="text-[11px] text-muted-foreground">If enabled, cash rewards are immediately credited to accountBalance without manual review.</div>
              </div>
              <Button
                type="button"
                onClick={() => handleSettingsFieldChange("auto_credit_cash", !settings.auto_credit_cash)}
                className="text-brand hover:brightness-110 cursor-pointer"
              >
                {settings.auto_credit_cash ? <ToggleRight className="h-8 w-8 text-brand" /> : <ToggleLeft className="h-8 w-8 text-muted-foreground" />}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold uppercase text-foreground">Auto-Apply Subscription Free Months</div>
                <div className="text-[11px] text-muted-foreground">If enabled, subscription extension free months apply automatically to active user subscriptions.</div>
              </div>
              <Button
                type="button"
                onClick={() => handleSettingsFieldChange("auto_apply_subscription", !settings.auto_apply_subscription)}
                className="text-brand hover:brightness-110 cursor-pointer"
              >
                {settings.auto_apply_subscription ? <ToggleRight className="h-8 w-8 text-brand" /> : <ToggleLeft className="h-8 w-8 text-muted-foreground" />}
              </Button>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={updatingSettings}
          className="w-full h-12 bg-gradient-brand text-primary-foreground font-bold rounded-xl text-sm hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-1 cursor-pointer"
        >
          {updatingSettings ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Save Configurations</>}
        </Button>
      </form>
    </motion.div>
  );
}
