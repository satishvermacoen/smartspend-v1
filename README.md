# Smartspend-v1
# Spend Smart: Referral System Feature Specification

**Version**: 1.0  
**Status**: Feature Specification  
**Last Updated**: June 2026  
**Owner**: Admin / Product Team

---

## Table of Contents

1. [Overview](#overview)
2. [Business Goals](#business-goals)
3. [Core Concepts](#core-concepts)
4. [System Architecture](#system-architecture)
5. [Data Model](#data-model)
6. [API Specification](#api-specification)
7. [Admin Panel Features](#admin-panel-features)
8. [Customer Portal Features](#customer-portal-features)
9. [Tracking & Attribution](#tracking--attribution)
10. [Reward Management](#reward-management)
11. [Security & Compliance](#security--compliance)
12. [Implementation Roadmap](#implementation-roadmap)
13. [Success Metrics](#success-metrics)

---

## Overview

### Purpose
The Referral System enables Spend Smart customers to refer new prospects and earn rewards while the company tracks referral attribution, conversion funnels, and automates reward distribution.

### Key Features
- Admin-managed referral code creation and assignment
- Real-time click and conversion tracking
- Multi-stage conversion funnel (click → signup → purchase)
- Automated and manual reward processing
- Comprehensive admin dashboard and analytics
- Customer-facing referral dashboard with reward ledger

### Scope
- Referral code generation and management
- Prospect tracking from click through purchase
- Reward attribution and payout
- Admin controls and reporting
- **Out of Scope (Phase 2)**: SMS marketing, social sharing widgets, API for third-party integrations

---

## Business Goals

1. **Increase Customer Acquisition**: Leverage existing customer base for low-cost new customer acquisition
2. **Improve Customer Retention**: Incentivize customers through referral rewards
3. **Track Attribution Accurately**: Know exactly which referrer drove each conversion
4. **Automate Operations**: Reduce manual work in reward calculation and processing
5. **Enable Reporting**: Provide insights into referral channel effectiveness

---

## Core Concepts

### Referral Code
A unique identifier (e.g., `SMART2024`, `VIP_JDOE_001`) that tracks and attributes conversions to a specific referrer.

**Types**:
- **Assignable**: Created by admin, assigned to a specific customer
- **Generic**: Created by admin, unassigned (e.g., marketing campaign codes)
- **Self-Generated**: Customer requests code through their portal

### Conversion
The journey of a prospect from initial click through purchase completion.

**Stages**:
1. **Clicked**: Prospect clicked referral link
2. **Visited**: Prospect landed on site
3. **Signed Up**: Prospect created account
4. **Purchased**: Prospect bought a subscription
5. **Cancelled**: Prospect cancelled (negative conversion)
6. **Churned**: Prospect did not convert within window

### Referral Reward
Incentive awarded to referrer upon successful prospect conversion.

**Types**:
- **Percentage**: % of referral value (e.g., 15% of first purchase)
- **Fixed Amount**: Flat amount per referral
- **Tiered**: Increasing % based on conversion count (e.g., 5 referrals → 15%, 10 → 20%)

**Claim Methods**:
- Account credit (applied to next invoice)
- Discount code (standalone coupon)
- Payout (bank transfer, once threshold reached)

---

## System Architecture

### High-Level Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      Admin Creates Code                      │
│                                                               │
│ [Create Form] → [Validation] → [MongoDB] → [Code Generated] │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│               Customer Shares / Uses Code                     │
│                                                               │
│ [Link Generated] → [Customer Dashboard] → [Email Share]     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│            Prospect Clicks & Visits Referral Link            │
│                                                               │
│ [Click] → [Pixel Tracking] → [Conversion Record] → [JWT]   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│        Prospect Signup with Referral Attribution             │
│                                                               │
│ [Signup Form] → [Validate Code] → [Link Account] → [DB]    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│        Prospect Purchases Package / Subscription             │
│                                                               │
│ [Purchase] → [Calculate Reward] → [Credit/Pending] → [DB]  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│         Referrer Claims or Receives Reward                   │
│                                                               │
│ [Claim] → [Admin Approval?] → [Process] → [Ledger]         │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Database** | MongoDB | Referral codes, conversions, rewards |
| **Backend** | Next.js API Routes | REST endpoints, business logic |
| **Frontend** | React + Tailwind CSS | Admin panel, customer portal |
| **Authentication** | NextAuth.js | Admin & customer session management |
| **Tracking** | Custom middleware | Click tracking, pixel injection |
| **Analytics** | MongoDB Aggregation | Dashboard KPIs, funnel analysis |
| **Email** | Resend / SendGrid | Notifications, link distribution |
| **Data Import/Export** | PapaParse / SheetJS | CSV bulk operations |
| **Caching** | Redis (optional) | Code validation, analytics cache |

---

## Data Model

### Collection: `referral_codes`

**Purpose**: Store all referral codes, their settings, and usage limits.

```javascript
{
  _id: ObjectId,
  
  // Code Identity
  code: String, // Unique, 8-12 chars (e.g., "SMART2024", "VJDOE001")
  display_name: String, // Human-readable name
  description: String, // Optional: "Summer Campaign", "VIP Tier"
  
  // Referrer
  referrer_id: ObjectId, // Customer who owns this code (null if generic)
  referrer_email: String, // Cached email for quick lookup
  
  // Lifecycle
  created_at: Date,
  created_by: {
    user_id: ObjectId, // Admin who created
    user_email: String,
    source: String // "admin_manual", "customer_request", "bulk_import"
  },
  expires_at: Date, // null = no expiry
  is_active: Boolean, // Soft delete
  
  // Usage Limits
  max_uses: Number, // null = unlimited
  usage_count: Number, // Current usage
  
  // Reward Configuration
  reward: {
    type: String, // "percentage", "fixed_amount", "tiered"
    value: Number, // e.g., 15 (for 15%), 5000 (for $50 in cents)
    applies_to: String, // "first_purchase", "annual_value", "subscription_value"
    applies_to_packages: [String], // null = all packages
    minimum_purchase_required: Number, // e.g., 2000 cents ($20)
  },
  
  // Tiered Rewards (if type === "tiered")
  tiered_config: [{
    min_conversions: Number,
    max_conversions: Number,
    reward_percentage: Number
  }],
  
  // Metadata
  campaign: String, // e.g., "summer_2024", "product_launch"
  channel: String, // e.g., "email", "social", "manual", "bulk"
  tags: [String], // Custom tags for filtering
  
  // Tracking
  utm_source: String,
  utm_medium: String,
  utm_campaign: String,
  
  // Stats (Denormalized for performance)
  stats: {
    total_clicks: Number,
    total_signups: Number,
    total_purchases: Number,
    total_revenue: Number,
    conversion_rate: Number // percentage
  }
}
```

---

### Collection: `referral_conversions`

**Purpose**: Track each prospect's journey from click to purchase.

```javascript
{
  _id: ObjectId,
  
  // Code & Referrer Reference
  referral_code: String,
  referrer_id: ObjectId,
  referrer_email: String,
  
  // Prospect Identity
  prospect_id: ObjectId, // null until signup
  prospect_email: String, // Captured at click or signup
  prospect_phone: String, // Optional
  
  // Conversion Stages
  conversion_stage: String, // "clicked", "visited", "signed_up", "purchased", "cancelled", "churned"
  
  timeline: {
    clicked_at: Date,
    visited_at: Date,
    signed_up_at: Date,
    purchased_at: Date,
    cancelled_at: Date
  },
  
  // Device & Attribution
  metadata: {
    user_agent: String,
    ip_address: String,
    country: String, // Geo-IP lookup
    city: String,
    device_type: String, // "mobile", "desktop", "tablet"
    browser: String,
    os: String,
    
    // UTM Params from initial click
    utm_source: String,
    utm_medium: String,
    utm_campaign: String,
    utm_content: String,
    utm_term: String,
    
    // Session & Cookie
    session_id: String,
    referral_token: String // JWT-like token for tracking
  },
  
  // Purchase Details
  purchase_details: {
    order_id: ObjectId,
    order_date: Date,
    packages: [{
      package_name: String,
      package_id: ObjectId,
      price: Number, // in cents
      billing_cycle: String, // "monthly", "annual"
      quantity: Number
    }],
    subtotal: Number,
    discount_applied: Number, // Discount from referral code
    total_value: Number
  },
  
  // Reward Attribution
  referrer_reward: {
    amount: Number, // in cents
    type: String, // "percentage", "fixed", "tiered"
    calculated_at: Date,
    status: String, // "pending", "credited", "claimed", "failed", "refunded"
    claimed_at: Date,
    claim_method: String, // "account_credit", "discount_code", "payout"
    notes: String
  },
  
  // Refund / Churn Tracking
  refund_details: {
    refunded: Boolean,
    refund_date: Date,
    refund_amount: Number,
    reward_reversed: Boolean
  },
  
  // Timestamps
  created_at: Date,
  updated_at: Date,
  
  // Admin Notes
  notes: String,
  flagged: Boolean, // Manual review needed
  flag_reason: String
}
```

---

### Collection: `referral_rewards`

**Purpose**: Aggregated reward ledger per customer.

```javascript
{
  _id: ObjectId,
  
  customer_id: ObjectId,
  customer_email: String,
  
  // Totals (Denormalized for quick dashboard access)
  total_earned: Number, // All-time
  total_claimed: Number, // Amount already redeemed
  pending_amount: Number, // Awaiting approval or claim
  available_balance: Number, // total_earned - total_claimed
  
  // Individual Redemptions (Rolling Array)
  redemptions: [{
    conversion_id: ObjectId,
    amount: Number,
    status: String, // "pending", "approved", "claimed", "failed"
    claim_method: String,
    claimed_at: Date,
    notes: String
  }],
  
  // Preferences
  preferred_claim_method: String,
  payout_threshold: Number, // Min amount before payout available
  
  // Timestamps
  last_reward_earned_at: Date,
  last_claim_at: Date
}
```

---

### Collection: `referral_settings`

**Purpose**: Global referral program configuration (singleton).

```javascript
{
  _id: ObjectId,
  
  company_id: String, // "spend_smart"
  
  // Reward Configuration
  reward: {
    default_type: String, // "percentage", "fixed_amount", "tiered"
    default_percentage: Number, // 15 (for 15%)
    default_fixed_amount: Number, // 5000 (for $50)
    
    // Tiered (if enabled)
    tiered_enabled: Boolean,
    tiered_tiers: [{
      min_conversions: Number,
      reward_percentage: Number
    }],
    
    // Constraints
    minimum_purchase_for_reward: Number, // 2000 (for $20)
    reward_applies_to: String, // "first_purchase", "annual"
    apply_to_all_packages: Boolean,
    excluded_package_ids: [ObjectId]
  },
  
  // Code Validity
  default_code_expiry_days: Number, // 365
  allow_custom_expiry: Boolean,
  
  // Referrer Limits
  max_referrals_per_customer: Number, // null = unlimited
  allow_self_referral: Boolean, // Prevent customer → self
  
  // Approval Workflow
  require_admin_approval_for_rewards: Boolean,
  require_approval_threshold: Number, // Only approve above $X
  auto_credit_below_threshold: Boolean,
  
  // Claim Methods
  available_claim_methods: [String], // ["account_credit", "discount_code", "payout"]
  payout_enabled: Boolean,
  payout_minimum_balance: Number, // $50
  payout_frequency: String, // "monthly", "on_demand"
  
  // Communication
  notify_referrer_on_click: Boolean,
  notify_referrer_on_signup: Boolean,
  notify_referrer_on_purchase: Boolean,
  
  // Tracking
  track_utm_params: Boolean,
  track_device_info: Boolean,
  
  // Timestamps
  created_at: Date,
  updated_at: Date
}
```

---

## API Specification

### Base URL
```
/api/referral
```

### Authentication
- Admin endpoints: Require admin role via NextAuth session
- Customer endpoints: Require customer authentication
- Public endpoints: No auth required

---

### Admin Endpoints

#### 1. Create Referral Code

**Endpoint**: `POST /api/admin/referrals/codes`

**Auth**: Admin only

**Request Body**:
```json
{
  "code": "SMART2024",
  "display_name": "Summer 2024 Campaign",
  "description": "Referral code for summer campaign",
  "referrer_id": "user123", // null = generic code
  "reward": {
    "type": "percentage",
    "value": 15,
    "applies_to": "first_purchase",
    "minimum_purchase_required": 2000
  },
  "expires_at": "2025-12-31T23:59:59Z",
  "max_uses": 100, // null = unlimited
  "campaign": "summer_2024",
  "channel": "email",
  "tags": ["vip", "paid_plan"]
}
```

**Response**:
```json
{
  "success": true,
  "code": "SMART2024",
  "created_at": "2024-06-15T10:30:00Z",
  "referral_url": "https://spendsmartdemo.com/ref/SMART2024"
}
```

**Status Codes**: 201 Created, 400 Bad Request, 409 Conflict (duplicate code)

---

#### 2. Bulk Create Referral Codes

**Endpoint**: `POST /api/admin/referrals/codes/bulk`

**Auth**: Admin only

**Request Body**:
```json
{
  "codes": [
    {
      "code": "VJDOE001",
      "referrer_id": "user123",
      "reward": { "type": "percentage", "value": 15 }
    },
    {
      "code": "VJSMITH001",
      "referrer_id": "user456",
      "reward": { "type": "percentage", "value": 15 }
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "created": 2,
  "failed": 0,
  "errors": []
}
```

---

#### 3. Get All Referral Codes

**Endpoint**: `GET /api/admin/referrals/codes`

**Auth**: Admin only

**Query Parameters**:
```
?page=1&limit=20&status=active&referrer_id=user123&campaign=summer_2024&sort=-created_at
```

**Response**:
```json
{
  "success": true,
  "total": 45,
  "page": 1,
  "limit": 20,
  "codes": [
    {
      "_id": "obj123",
      "code": "SMART2024",
      "referrer_email": "john@example.com",
      "is_active": true,
      "stats": {
        "total_clicks": 23,
        "total_purchases": 5,
        "conversion_rate": 21.7,
        "total_revenue": 15000
      },
      "created_at": "2024-06-15T10:30:00Z",
      "expires_at": "2025-12-31T23:59:59Z"
    }
  ]
}
```

---

#### 4. Get Referral Code Details

**Endpoint**: `GET /api/admin/referrals/codes/:codeId`

**Auth**: Admin only

**Response**:
```json
{
  "success": true,
  "code": {
    "_id": "obj123",
    "code": "SMART2024",
    "display_name": "Summer 2024 Campaign",
    "referrer_id": "user123",
    "referrer_email": "john@example.com",
    "reward": {
      "type": "percentage",
      "value": 15,
      "applies_to": "first_purchase"
    },
    "is_active": true,
    "created_at": "2024-06-15T10:30:00Z",
    "expires_at": "2025-12-31T23:59:59Z",
    "stats": {
      "total_clicks": 23,
      "total_signups": 8,
      "total_purchases": 5,
      "total_revenue": 15000,
      "conversion_rate": 21.7
    },
    "conversions": [
      {
        "conversion_id": "conv123",
        "prospect_email": "prospect@example.com",
        "conversion_stage": "purchased",
        "purchase_value": 3000,
        "reward_amount": 450,
        "clicked_at": "2024-06-16T09:00:00Z",
        "purchased_at": "2024-06-18T14:30:00Z"
      }
    ]
  }
}
```

---

#### 5. Update Referral Code

**Endpoint**: `PATCH /api/admin/referrals/codes/:codeId`

**Auth**: Admin only

**Request Body**:
```json
{
  "is_active": false,
  "display_name": "Updated Name",
  "reward": { "type": "percentage", "value": 20 }
}
```

**Response**: Updated code object

---

#### 6. Delete Referral Code

**Endpoint**: `DELETE /api/admin/referrals/codes/:codeId`

**Auth**: Admin only

**Response**:
```json
{
  "success": true,
  "message": "Code deleted successfully"
}
```

---

#### 7. Get Referral Analytics Dashboard

**Endpoint**: `GET /api/admin/referrals/analytics`

**Auth**: Admin only

**Query Parameters**:
```
?start_date=2024-01-01&end_date=2024-12-31&campaign=summer_2024
```

**Response**:
```json
{
  "success": true,
  "period": {
    "start_date": "2024-01-01",
    "end_date": "2024-12-31"
  },
  "overview": {
    "active_codes": 12,
    "total_clicks": 2345,
    "total_conversions": 234,
    "conversion_rate": 9.98,
    "total_referral_revenue": 45600000, // in cents
    "total_rewards_paid": 6840000
  },
  "trends": {
    "daily_clicks": [
      { "date": "2024-06-01", "clicks": 45, "purchases": 3 }
    ],
    "weekly_summary": [
      { "week": "2024-W23", "clicks": 312, "purchases": 28 }
    ]
  },
  "top_referrers": [
    {
      "referrer_id": "user123",
      "referrer_email": "john@example.com",
      "total_referrals": 12,
      "total_revenue": 45000,
      "total_rewards": 6750,
      "conversion_rate": 25
    }
  ],
  "conversion_funnel": {
    "clicked": 2345,
    "signed_up": 456,
    "purchased": 234,
    "click_to_signup": 19.4,
    "signup_to_purchase": 51.3
  }
}
```

---

#### 8. Get Conversions (Filterable)

**Endpoint**: `GET /api/admin/referrals/conversions`

**Auth**: Admin only

**Query Parameters**:
```
?page=1&limit=50&status=purchased&referrer_id=user123&date_from=2024-06-01&sort=-purchased_at
```

**Response**:
```json
{
  "success": true,
  "total": 234,
  "page": 1,
  "conversions": [
    {
      "conversion_id": "conv123",
      "referral_code": "SMART2024",
      "referrer_email": "john@example.com",
      "prospect_email": "prospect@example.com",
      "conversion_stage": "purchased",
      "clicked_at": "2024-06-16T09:00:00Z",
      "signed_up_at": "2024-06-16T10:30:00Z",
      "purchased_at": "2024-06-18T14:30:00Z",
      "purchase_value": 3000,
      "reward_amount": 450,
      "reward_status": "credited"
    }
  ]
}
```

---

#### 9. Approve Pending Reward

**Endpoint**: `POST /api/admin/referrals/rewards/approve`

**Auth**: Admin only

**Request Body**:
```json
{
  "conversion_id": "conv123",
  "approve": true,
  "admin_notes": "Approved - verified purchase"
}
```

**Response**:
```json
{
  "success": true,
  "reward_credited": true,
  "amount": 450
}
```

---

#### 10. Get Customer Reward Details

**Endpoint**: `GET /api/admin/referrals/customer/:customerId/rewards`

**Auth**: Admin only

**Response**:
```json
{
  "success": true,
  "customer_id": "user123",
  "customer_email": "john@example.com",
  "total_earned": 6750000, // cents
  "total_claimed": 5000000,
  "available_balance": 1750000,
  "pending_amount": 250000,
  "redemptions": [
    {
      "conversion_id": "conv123",
      "amount": 450,
      "status": "credited",
      "claim_method": "account_credit",
      "claimed_at": "2024-06-20T10:00:00Z"
    }
  ]
}
```

---

### Customer Endpoints

#### 1. Get My Referral Code

**Endpoint**: `GET /api/customer/referral/code`

**Auth**: Customer

**Response**:
```json
{
  "success": true,
  "referral_code": "VJDOE123",
  "referral_url": "https://spendsmartdemo.com/ref/VJDOE123",
  "reward_config": {
    "type": "percentage",
    "value": 15,
    "applies_to": "first_purchase"
  }
}
```

---

#### 2. Request Custom Referral Code

**Endpoint**: `POST /api/customer/referral/code/request`

**Auth**: Customer

**Request Body**:
```json
{
  "display_name": "My Referral Code",
  "custom_code": null // Auto-generate if null
}
```

**Response**:
```json
{
  "success": true,
  "code": "VJDOE_CUSTOM001",
  "url": "https://spendsmartdemo.com/ref/VJDOE_CUSTOM001",
  "created_at": "2024-06-15T10:30:00Z"
}
```

---

#### 3. Get Referral Statistics

**Endpoint**: `GET /api/customer/referral/stats`

**Auth**: Customer

**Response**:
```json
{
  "success": true,
  "overview": {
    "total_clicks": 45,
    "total_signups": 8,
    "total_purchases": 5,
    "total_revenue": 15000,
    "conversion_rate": 11.1,
    "click_to_purchase": 11.1
  },
  "referrals": [
    {
      "prospect_email": "prospect@example.com",
      "conversion_stage": "purchased",
      "clicked_at": "2024-06-16T09:00:00Z",
      "purchased_at": "2024-06-18T14:30:00Z",
      "purchase_value": 3000,
      "reward_earned": 450
    }
  ]
}
```

---

#### 4. Get My Referral Rewards

**Endpoint**: `GET /api/customer/referral/rewards`

**Auth**: Customer

**Response**:
```json
{
  "success": true,
  "total_earned": 6750,
  "total_claimed": 5000,
  "available_balance": 1750,
  "pending_approval": 250,
  "history": [
    {
      "conversion_id": "conv123",
      "amount": 450,
      "status": "credited",
      "claim_method": "account_credit",
      "claimed_at": "2024-06-20T10:00:00Z"
    }
  ]
}
```

---

#### 5. Claim Referral Reward

**Endpoint**: `POST /api/customer/referral/rewards/claim`

**Auth**: Customer

**Request Body**:
```json
{
  "amount": 1750, // null = claim all
  "claim_method": "account_credit", // "account_credit", "discount_code", "payout"
  "notes": "Optional notes"
}
```

**Response**:
```json
{
  "success": true,
  "claimed_amount": 1750,
  "claim_method": "account_credit",
  "status": "pending", // or "credited" if auto-approved
  "claim_id": "claim_123",
  "message": "Reward claimed successfully. Admin approval pending."
}
```

---

#### 6. Get Referral Share Links

**Endpoint**: `GET /api/customer/referral/share-links`

**Auth**: Customer

**Response**:
```json
{
  "success": true,
  "links": {
    "direct_link": "https://spendsmartdemo.com/ref/VJDOE123",
    "facebook": "https://www.facebook.com/sharer/sharer.php?u=https://spendsmartdemo.com/ref/VJDOE123",
    "twitter": "https://twitter.com/intent/tweet?url=https://spendsmartdemo.com/ref/VJDOE123&text=Check%20out%20Spend%20Smart",
    "linkedin": "https://www.linkedin.com/sharing/share-offsite/?url=https://spendsmartdemo.com/ref/VJDOE123",
    "email_template": "Hi! I recommend Spend Smart. Use my referral code: VJDOE123"
  }
}
```

---

### Public Endpoints

#### 1. Track Referral Click

**Endpoint**: `POST /api/public/referral/track-click`

**Auth**: None (rate-limited)

**Request Body**:
```json
{
  "code": "SMART2024",
  "prospect_email": "prospect@example.com", // optional
  "utm_source": "email",
  "utm_medium": "referral",
  "utm_campaign": "summer2024"
}
```

**Response**:
```json
{
  "success": true,
  "conversion_id": "conv123",
  "referral_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // JWT for session tracking
  "message": "Click tracked successfully"
}
```

---

#### 2. Validate Referral Code

**Endpoint**: `POST /api/public/referral/validate`

**Auth**: None

**Request Body**:
```json
{
  "code": "SMART2024"
}
```

**Response**:
```json
{
  "success": true,
  "valid": true,
  "code": "SMART2024",
  "reward": {
    "type": "percentage",
    "value": 15,
    "description": "Get 15% off on your first purchase"
  },
  "referrer_name": "John Doe" // Optional
}
```

---

#### 3. Get Code Info

**Endpoint**: `GET /api/public/referral/:code/info`

**Auth**: None

**Response**:
```json
{
  "success": true,
  "code": "SMART2024",
  "is_valid": true,
  "reward": {
    "type": "percentage",
    "value": 15,
    "description": "15% off first purchase"
  },
  "referrer_name": "Spend Smart Team" // or customer name if visible
}
```

---

## Admin Panel Features

### Dashboard

**Key Metrics Section**:
- **Active Codes**: Card showing count of active referral codes
- **Total Clicks (30-day)**: Line chart with daily trend
- **Conversion Funnel**: Visual funnel (clicks → signups → purchases)
- **Total Referral Revenue**: Big metric card
- **Total Rewards Paid**: Big metric card

**Top Performers Table**:
| Referrer | Referrals | Revenue | Reward Earned | Conversion Rate |
|----------|-----------|---------|---------------|-----------------|
| John Doe | 12 | $450 | $67.50 | 25% |
| Jane Smith | 8 | $320 | $48 | 20% |

---

### Referral Code Management

**Create Code Form**:
```
┌────────────────────────────────────────────┐
│ CREATE REFERRAL CODE                       │
├────────────────────────────────────────────┤
│                                            │
│ Code Name/ID          [Auto-generate ▼]   │
│                                            │
│ Assign to Customer    [Select Customer ▼] │
│                       or [Generate Generic]│
│                                            │
│ Description           [Text Area]         │
│                                            │
│ ┌─ REWARD CONFIGURATION ─────────────────┐ │
│ │ Type                [Percentage ▼]     │ │
│ │ Value               [15]               │ │
│ │ Applies To          [First Purchase ▼]│ │
│ │ Min Purchase        [$20]              │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ ┌─ VALIDITY & LIMITS ────────────────────┐ │
│ │ Expires Date        [Date Picker]      │ │
│ │ Max Uses            [100] (blank=∞)    │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ ┌─ METADATA ────────────────────────────┐ │
│ │ Campaign            [summer_2024]     │ │
│ │ Channel             [email ▼]         │ │
│ │ Tags                [vip, paid_plan] │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ [ ] Allow self-referral                   │
│ [ ] Require admin approval for rewards    │
│                                            │
│ [Create Code]  [Create & Assign More]     │
│ [Preview]      [Cancel]                   │
└────────────────────────────────────────────┘
```

**View Codes Table**:
```
Code        | Assigned To    | Status  | Uses | Clicks | Purchases | Revenue | Actions
SMART2024   | (Generic)      | Active  | 5/10 | 23     | 3         | $1,500  | [View] [Edit] [Deactivate]
VJDOE001    | John Doe       | Active  | 8/∞  | 41     | 12        | $4,500  | [View] [Edit] [Delete]
VJSMITH001  | Jane Smith     | Expired | 12/20| 156    | 34        | $12,800 | [View] [Reactivate]
```

**Code Details View**:
- Code info & settings
- Conversion funnel chart
- Referral list with dates & amounts
- Reward ledger
- Edit / Deactivate / Delete buttons

---

### Bulk Operations

**Upload Referral Codes (CSV)**:
```
code,referrer_email,reward_type,reward_value,max_uses,expires_at
VJDOE001,john@example.com,percentage,15,100,2025-12-31
VJSMITH001,jane@example.com,percentage,15,100,2025-12-31
```

**Actions**:
- [Choose File]
- Preview mapping
- [Upload & Create]
- Download template

---

### Conversion Tracking

**Conversions Table** (Filterable & Sortable):
```
Prospect Email      | Code    | Stage     | Clicked   | Signed Up | Purchased | Purchase Value | Reward Status
prospect1@ex.com    | SMART24 | purchased | Jun 16    | Jun 16    | Jun 18    | $300           | Credited
prospect2@ex.com    | VJDOE01 | signed_up | Jun 17    | Jun 17    | —         | —              | N/A
prospect3@ex.com    | VJDOE01 | visited   | Jun 18    | —         | —         | —              | N/A
```

**Filters**:
- Status (clicked, signed_up, purchased, cancelled, churned)
- Date range
- Code / Referrer
- Reward status

**Conversion Funnel Chart**:
```
Clicked: 2,345 (100%)
  ↓
Signed Up: 456 (19.4%)
  ↓
Purchased: 234 (51.3% of signups)
```

---

### Reward Management

**Pending Rewards Queue**:
```
Prospect Email      | Code     | Amount | Conversion Date | Status    | Actions
prospect4@ex.com    | SMART24  | $500   | Jun 18          | Pending   | [Approve] [Reject]
prospect5@ex.com    | VJDOE01  | $225   | Jun 19          | Pending   | [Approve] [Reject]
```

**Reward Details Modal**:
- Prospect info
- Referral code & amount
- Conversion details
- Admin notes field
- [Approve], [Reject], [Flag for Review]

**Bulk Process**:
- [ ] Select multiple pending rewards
- [Bulk Approve] [Bulk Reject] [Bulk Flag]

**Ledger View**:
- All-time rewards by customer
- Earned, claimed, pending breakdown
- Transaction history

---

## Customer Portal Features

### Referral Dashboard

**Quick Stats**:
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│   My Clicks  │  My Sign-Ups │ My Purchases │  My Earnings │
│      45      │      8       │      5       │    $67.50    │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**Share Section**:
```
┌─ MY REFERRAL CODE ──────────────────────────────┐
│ Code: VJDOE123                                   │
│ Link: https://spendsmartdemo.com/ref/VJDOE123  │
│                                                 │
│ [Copy Link]                                     │
│                                                 │
│ Share on:                                       │
│ [Facebook] [Twitter] [LinkedIn] [Email]        │
│ [WhatsApp] [SMS] [Copy HTML]                   │
└─────────────────────────────────────────────────┘
```

**Referral Activity Table**:
```
Prospect          | Status    | Clicked   | Purchased | Reward Earned
john@example.com  | Purchased | Jun 16    | Jun 18    | $450
jane@example.com  | Signed Up | Jun 17    | —         | —
bob@example.com   | Visited   | Jun 18    | —         | —
```

---

### Reward Ledger

**Earnings Overview**:
```
Total Earned:       $6,750.00
Already Claimed:    $5,000.00
Available Balance:  $1,750.00
Pending Approval:   $250.00
```

**Redemption History**:
| Date | Amount | Method | Status | Notes |
|------|--------|--------|--------|-------|
| Jun 20 | $450 | Account Credit | Credited | — |
| Jun 15 | $500 | Payout | Processing | — |

**Claim Reward Modal**:
```
Amount to Claim: [1750] (or [Claim All])

How would you like to receive it?
○ Account Credit (applied to next invoice)
○ Discount Code (standalone coupon)
○ Bank Transfer (minimum $50)

Notes: [Text area]

[Claim Reward] [Cancel]
```

---

## Tracking & Attribution

### Click Tracking Mechanism

**1. Referral Link Format**:
```
https://spendsmartdemo.com/ref/SMART2024
https://spendsmartdemo.com/?ref=SMART2024
https://spendsmartdemo.com/pricing?referral=SMART2024
```

**2. Click Capture**:
```javascript
// In middleware or layout component
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const refCode = params.get('ref') || extractFromPath();
  
  if (refCode) {
    // POST to /api/public/referral/track-click
    trackReferralClick(refCode);
    // Store in localStorage for session persistence
    localStorage.setItem('referral_code', refCode);
    localStorage.setItem('referral_timestamp', Date.now());
  }
}, []);
```

**3. Pixel / Analytics Integration**:
- Google Analytics UTM auto-tracking
- Custom event: `referral_click`, `referral_signup`, `referral_purchase`

---

### Conversion Stage Tracking

| Stage | Trigger | Data Captured |
|-------|---------|---------------|
| **Clicked** | Link click | Timestamp, IP, device, UTM |
| **Visited** | Page load | Session created, user agent |
| **Signed Up** | Account creation | Prospect ID, email |
| **Purchased** | Order completed | Order ID, revenue, packages |
| **Cancelled** | Subscription cancelled | Refund amount |

---

### Attribution Model

**Last-Touch Attribution** (Default):
- If prospect uses multiple codes, last code gets credit

**First-Touch Attribution** (Optional):
- First code used gets credit

**Multi-Touch** (Future):
- Weighted split between all codes in session

---

## Reward Management

### Reward Calculation

**Formula**:
```
Reward = Purchase Value × Reward Percentage / 100
```

**Example**:
- Purchase: $300 (Basic Suite)
- Reward Type: Percentage
- Reward Value: 15%
- Calculation: $300 × 15% = $45

**Minimum Purchase Constraint**:
- Code specifies minimum purchase (e.g., $20)
- If purchase < $20, no reward

**Tiered Calculation**:
```
IF total_conversions < 5:
  reward_percentage = 15
ELSE IF total_conversions >= 5 AND < 10:
  reward_percentage = 18
ELSE IF total_conversions >= 10:
  reward_percentage = 20
```

---

### Reward Status Workflow

```
┌─────────────┐
│  Calculated │
└──────┬──────┘
       │
       ├─ Auto-credit (if enabled)
       │  ↓
       │  ┌──────────┐
       │  │ Credited │
       │  └──────────┘
       │
       └─ Require approval
          ↓
          ┌─────────┐
          │ Pending │ ← Admin queue
          └────┬────┘
               │
        ┌──────┴──────┐
        ↓             ↓
     ┌────────┐  ┌───────────┐
     │Approved│  │  Rejected │
     └────┬───┘  └───────────┘
          ↓
     ┌─────────┐
     │Credited │
     └────┬────┘
          ↓
     ┌──────────────┐
     │ Available to │
     │Claim/Redeem  │
     └──────────────┘
```

---

### Reward Redemption Methods

**1. Account Credit**
- Instant
- Applied to customer's account balance
- Used towards next purchase
- No payout threshold

**2. Discount Code**
- Generated standalone coupon
- Can be applied to any purchase
- Expiry configurable

**3. Payout (Bank Transfer)**
- Minimum balance threshold ($50)
- Monthly or on-demand
- Integration with payment processor
- Requires bank details

---

## Security & Compliance

### Rate Limiting

- **Click tracking**: 100 requests/hour per IP
- **Code validation**: 20 requests/minute per IP
- **Account endpoints**: Standard API rate limits

### Fraud Prevention

1. **Duplicate Detection**:
   - Flag same prospect with multiple referral codes
   - Alert on unusual patterns

2. **IP Tracking**:
   - Monitor for click farms or bot activity
   - Geo-IP verification

3. **Email Verification**:
   - Verify prospect email before crediting reward
   - Block disposable emails (optional)

4. **Manual Review**:
   - Flag conversions above threshold for review
   - Admin approval workflow

### Data Privacy

- Store encrypted referral tokens
- Mask full email in reports (show last 4 chars)
- GDPR compliance for customer data
- Referral data retention: 2 years post-conversion
- Right to delete: Remove prospect data on request

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-3)
- MongoDB schema design
- Core API endpoints (create code, validate, track click)
- Conversion tracking middleware
- Admin basic CRUD UI

**Deliverable**: Admin can create codes and track clicks

---

### Phase 2: Admin Panel (Weeks 4-6)
- Admin dashboard with analytics
- Referral code management UI
- Conversion table & filters
- Bulk code creation

**Deliverable**: Fully functional admin panel

---

### Phase 3: Customer Portal (Weeks 7-8)
- Customer referral dashboard
- Share links & social integration
- Reward ledger & claim UI
- Notifications

**Deliverable**: Customers can view & claim rewards

---

### Phase 4: Automation & Refinement (Weeks 9-10)
- Auto-credit rewards
- Payout processing
- Email notifications
- Reward expiry management

**Deliverable**: Fully automated reward system

---

### Phase 5: Optimization & Reporting (Week 11+)
- Advanced analytics (cohort, retention)
- Tiered rewards
- Custom reporting
- API for third-party integrations

---

## Success Metrics

### Business KPIs

| Metric | Target | Formula |
|--------|--------|---------|
| Referral Conversion Rate | 15%+ | Purchases / Clicks |
| Average Referral Value | $300+ | Total Revenue / Conversions |
| Cost Per Referral (CPRA) | <10% of LTV | Total Rewards / Customer Lifetime Value |
| Referrer Adoption | 40%+ | % of customers with active code |
| Reward Claim Rate | 60%+ | % of earned rewards claimed |

---

### Operational KPIs

| Metric | Target |
|--------|--------|
| Code Creation Time | < 2 minutes |
| Click to Signup Time | < 3 days |
| Reward Processing Time | < 24 hours |
| Admin Approval Backlog | < 50 pending |

---

### Technical KPIs

| Metric | Target |
|--------|--------|
| API Response Time (p95) | < 200ms |
| Database Query Time (p95) | < 100ms |
| Uptime | 99.9% |
| Error Rate | < 0.1% |

---

## Appendix

### Sample Referral Link Variations

```
Direct Link:
https://spendsmartdemo.com/ref/SMART2024

UTM Parameters:
https://spendsmartdemo.com/?ref=SMART2024&utm_source=email&utm_medium=referral&utm_campaign=summer2024

Subdomain:
https://referral.spendsmartdemo.com/SMART2024

Pricing Page Direct:
https://spendsmartdemo.com/pricing?referral=SMART2024&offer=15off
```

---

### Email Template for Referral Share

```
Subject: Share Your Referral Code & Earn Rewards

Hi [Customer Name],

Thanks for being a valued Spend Smart customer! 
Now you can earn rewards by sharing your unique referral code.

Your Referral Code: SMART2024
Your Referral Link: https://spendsmartdemo.com/ref/SMART2024

What You'll Earn:
- 15% commission on every successful referral
- Rewards credited to your account instantly
- No limit on how many you can earn

How It Works:
1. Share your link with friends/colleagues
2. They sign up using your code
3. They make their first purchase
4. You earn 15% of their purchase as account credit

Share on:
[Facebook] [Twitter] [LinkedIn] [Email]

Questions? Contact support@spendsmartdemo.com

Cheers,
Spend Smart Team
```

---

### Code Naming Conventions

```
Generic Campaigns:
PROMO2024, SUMMER2024, EARLY2024

Customer-Assigned:
VJDOE_001, VJSMITH_001, VJJONES_001

Partner:
PARTNER_ACME, PARTNER_TECHCORP

Bulk Campaigns:
BULK_Q2_001, BULK_Q2_002, BULK_Q2_003

VIP/Premium:
VIP_JDOE_001, VIP_PREMIUM_001, ELITE_001
```

---

**End of Document**
