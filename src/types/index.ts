import { StaticImageData } from "next/image";

export type Category =
  | "AI"
  | "Professional"
  | "Creative"
  | "Developer"
  | "Productivity"
  | "Marketing"
  | "Credits"
  | "Product/Marketing"
  | "Business/Operations"
  | "OTT";

export type Tool = {
  name: string;
  slug: string; // simpleicons slug or custom brand slug
  color?: string; // brand hex without #
  category: Category;
  logo?: StaticImageData; // optional explicit image reference (imported statically or custom component)
  domain?: string; // brand domain for favicon/logo fallback (e.g. "linear.app")
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  screenshots?: { src: StaticImageData; alt: string }[];
};

export interface ClientConversion {
  referral_code?: string;
  referrer_id?: string;
  prospect_id?: string;
  prospect_email?: string;
  conversion_stage?: 'clicked' | 'visited' | 'enquired' | 'signed_up' | 'purchased' | 'cancelled';
  timeline?: {
    clicked_at?: string;
    visited_at?: string;
    signed_up_at?: string;
    purchased_at?: string;
    cancelled_at?: string;
  };
  purchase_details?: {
    gross_amount?: number;
    referral_bonus_applied?: number;
    net_amount?: number;
    referrer_reward?: number;
  };
  referrer_reward?: {
    type?: 'cash' | 'subscription';
    amount?: number;
    status?: 'calculated' | 'credited' | 'claimed';
    claimed_at?: string;
  };
}

export interface Client {
  _id: string;
  name: string;
  mobile: string;
  email?: string;
  status: 'pending' | 'contacted' | 'resolved' | 'ignored' | 'active' | 'inactive';
  source: 'website_enquiry' | 'referral' | 'wishlist' | 'admin';
  referralCode?: string;
  referredBy?: {
    referrerId?: string;
    referrerEmail?: string;
  };
  notes?: string;
  purchase?: number;
  conversion?: ClientConversion;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceItem {
  service_name: string;
  amount: number;
  quantity?: number;
}

export interface Invoice {
  _id: string;
  client_id: string | {
    _id: string;
    name: string;
    mobile?: string;
    email?: string;
  };
  invoice_number: string;
  items: InvoiceItem[];
  amount: number;
  discount_applied?: number;
  tax_amount?: number;
  purchase_date: string;
  status: 'pending' | 'paid' | 'cancelled';
  referrer_id?: string | {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
  };
  commission_amount?: number;
  createdAt?: string;
  updatedAt?: string;
}

