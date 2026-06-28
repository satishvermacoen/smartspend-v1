export interface AdminKPIs {
  activeCodes: number;
  clicks: number;
  signups: number;
  purchases: number;
  revenue: number;
  cashPaid: number;
  subscriptionMonths: number;
}

export interface CodeItem {
  _id: string;
  code: string;
  is_active: boolean;
  expires_at?: string;
  created_at?: string;
  reward: {
    type: 'cash' | 'subscription';
    cashAmount: number;
    subscriptionMonths: number;
    referralBonus: number;
  };
  referrer: {
    _id: string;
    name: string;
    email: string;
  } | null;
  stats: {
    clicks: number;
    signups: number;
    purchases: number;
    revenue: number;
  };
}

export interface ConversionItem {
  _id: string;
  referralCode: string;
  conversionStage: string;
  timeline: {
    clicked_at?: string;
    visited_at?: string;
    signed_up_at?: string;
    purchased_at?: string;
  };
  purchaseDetails?: {
    grossAmount: number;
    netAmount: number;
  };
  referrerReward?: {
    type: 'cash' | 'subscription';
    amount: number;
    status: string;
  };
  referrer: { _id?: string; name: string; email: string } | null;
  prospect: { name: string; email: string } | null;
  isFlagged?: boolean;
  flagReason?: string;
  createdAt?: string;
}

export interface PendingApprovalItem {
  customerId: string;
  customerName: string;
  customerEmail: string;
  redemptionId: string;
  type: 'cash_claim' | 'subscription_activation';
  amount: number;
  months: number;
  date: string;
}

export interface ProgramSettings {
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

export interface ClientPurchaseItem {
  _id: string;
  service_name: string;
  amount: number;
  purchase_date: string;
  commission_amount: number;
  commission_calculated: boolean;
}

export interface ClientItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  referrerId?: string | null;
  purchase: number;
  sale: number;
  commission: number;
  status: string;
}
