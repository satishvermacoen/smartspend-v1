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
  createdAt?: string;
  updatedAt?: string;
}

