import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReferralSetting extends Document {
  cash_reward_high: number;
  cash_reward_low: number;
  subscription_months: number;
  referral_bonus_amount: number;
  min_purchase_for_reward: number;
  auto_credit_cash: boolean;
  auto_apply_subscription: boolean;
  currency: string;
  commission_percentage: number;
  default_reward_type: 'fixed_cash' | 'percentage';
}

const ReferralSettingSchema = new Schema<IReferralSetting>({
  cash_reward_high: { type: Number, default: 1000 },
  cash_reward_low: { type: Number, default: 500 },
  subscription_months: { type: Number, default: 3 },
  referral_bonus_amount: { type: Number, default: 500 },
  min_purchase_for_reward: { type: Number, default: 4000 },
  auto_credit_cash: { type: Boolean, default: true },
  auto_apply_subscription: { type: Boolean, default: true },
  currency: { type: String, default: 'INR' },
  commission_percentage: { type: Number, default: 10 },
  default_reward_type: { type: String, enum: ['fixed_cash', 'percentage'], default: 'percentage' }
}, {
  timestamps: true
});

if (process.env.NODE_ENV === "development") {
  delete mongoose.models.ReferralSetting;
}

const ReferralSetting = mongoose.models.ReferralSetting as Model<IReferralSetting> || 
  mongoose.model<IReferralSetting>('ReferralSetting', ReferralSettingSchema);

export default ReferralSetting;

// Helper to get or seed settings
export async function getReferralSettings(): Promise<IReferralSetting> {
  let settings = await ReferralSetting.findOne();
  if (!settings) {
    settings = await ReferralSetting.create({});
  }
  return settings;
}
