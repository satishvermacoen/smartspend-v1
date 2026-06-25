# Spend Smart: Referral System (Updated)

**Tagline**: Share the Savings. Earn Rewards.

---

## Reward Structure

### Cash Rewards
- **₹1,000** for referral purchases ≥ ₹4,000
- **₹500** for referral purchases < ₹4,000
- **Auto-credited** to referrer's account balance (no claim needed)

### Subscription Rewards
- **3 Months FREE** on new subscription
- **OR** apply as extension to existing subscription
- **Instant activation** (no claim needed)

### Referral Bonus (for prospect)
- **₹500 OFF** on first purchase when using referral link
- Deducted from purchase total before referrer reward calculated
- Increases conversion likelihood

---

## Data Model Changes

### referral_codes collection

**Remove**:
- `tiered_config` (not needed)
- `reward.applies_to_packages`

**Keep/Update**:
- `code`: Unique identifier
- `referrer_id`: Customer who owns code
- `is_active`: Boolean
- `created_at`, `expires_at`

**Reward field** (simplified):
```
reward: {
  type: "cash" | "subscription",
  cashAmount: 1000 | 500,  // in paisa
  subscriptionMonths: 3,
  referralBonus: 500       // ₹500 off for prospect
}
```

### referral_conversions collection

**New/Updated fields**:
- `conversion_stage`: clicked → visited → signed_up → purchased
- `purchase_details`:
  - `gross_amount`: Original purchase price
  - `referral_bonus_applied`: ₹500
  - `net_amount`: gross - bonus
  - `referrer_reward`: Cash or subscription earned

- `referrer_reward`: 
  - `type`: "cash" | "subscription"
  - `amount`: ₹500 or ₹1,000
  - `status`: calculated → credited → claimed
  - `claimed_at`: Date

### referral_rewards collection

**Changes**:
- `total_earned`: Sum of all referrer rewards (in paisa)
- `cash_earned`: Separate cash total
- `subscription_months`: Total free months earned
- `redemptions`: Track cash claims + subscription activations
- `preferred_reward_type`: "cash" | "subscription"

### New: referral_settings collection

**Fields**:
- `cash_reward_high`: ₹1,000 (threshold: ≥ ₹4,000)
- `cash_reward_low`: ₹500 (threshold: < ₹4,000)
- `subscription_months`: 3
- `referral_bonus_amount`: ₹500
- `min_purchase_for_reward`: ₹4,000
- `auto_credit_cash`: true
- `auto_apply_subscription`: true
- `currency`: "INR"

---

## API Routes

### Admin Routes

**Referral Code Management**:
- `POST /api/admin/referrals/codes` – Create code
- `GET /api/admin/referrals/codes` – List all codes (filters: active, referrer, date)
- `GET /api/admin/referrals/codes/:id` – Get details with conversion history
- `PATCH /api/admin/referrals/codes/:id` – Update/deactivate
- `DELETE /api/admin/referrals/codes/:id` – Delete

**Conversion & Rewards**:
- `GET /api/admin/referrals/conversions` – All conversions (filters: stage, date, referrer)
- `GET /api/admin/referrals/analytics` – Dashboard stats (total clicks, conversions, revenue, etc.)
- `GET /api/admin/referrals/customer/:customerId/rewards` – Customer reward ledger
- `POST /api/admin/referrals/rewards/approve` – Manual approval
- `POST /api/admin/referrals/rewards/reject` – Reject reward

**Settings**:
- `GET /api/admin/referrals/settings` – Get referral config
- `PATCH /api/admin/referrals/settings` – Update rewards, thresholds, etc.

---

### Customer Routes

**Referral Code**:
- `GET /api/customer/referral/code` – Get my referral code
- `POST /api/customer/referral/code/generate` – Generate if not exists

**Dashboard**:
- `GET /api/customer/referral/stats` – Quick stats (clicks, signups, purchases, earnings)
- `GET /api/customer/referral/performance` – Conversion funnel with timeline
- `GET /api/customer/referral/referrals` – List of my referrals (name, status, date, reward)

**Rewards & Earnings**:
- `GET /api/customer/referral/rewards` – Total earned, claimed, pending
- `POST /api/customer/referral/rewards/claim-cash` – Claim cash reward
- `POST /api/customer/referral/rewards/apply-subscription` – Apply 3-month free to subscription
- `GET /api/customer/referral/history` – All transactions (earned, claimed, applied)

**Share**:
- `GET /api/customer/referral/share-links` – Generate share links (direct, email, social)

---

### Public Routes (No Auth)

**Tracking**:
- `POST /api/public/referral/track-click` – Record click + generate session token
- `POST /api/public/referral/validate` – Validate code & show reward info

**Landing**:
- `GET /api/public/referral/:code` – Public referral landing page data

---

## Admin Panel Pages

### 1. Referral Dashboard
**Sections**:
- **KPIs**: Active codes, total clicks, conversions, total earned, cash paid, subscriptions given
- **Trends**: 7-day/30-day line chart (clicks, purchases, revenue)
- **Conversion Funnel**: Clicked → Signed Up → Purchased (with %)
- **Top Referrers**: Leaderboard (name, referrals, earnings, conversion rate)
- **Recent Conversions**: Table of last 10 purchases

---

### 2. Referral Codes Management
**Features**:
- **Create Code Form**:
  - Code name / auto-generate
  - Assign to customer (dropdown)
  - Expiry date
  - Reward type (cash/subscription)
  - Active/inactive toggle
  
- **Codes Table**:
  - Code | Assigned To | Status | Uses | Clicks | Purchases | Revenue | Actions
  - Filter by: status, referrer, date range
  - Bulk actions: activate, deactivate, delete

- **Code Details**:
  - Code info + settings
  - Click-to-purchase funnel
  - List of all conversions (prospect, stage, date, amount, reward status)
  - Edit, deactivate, delete buttons

---

### 3. Conversions & Rewards
**Conversions Table**:
- Prospect email | Code | Stage | Clicked | Purchased | Amount | Reward | Status | Actions
- Filter: stage (clicked/signed_up/purchased), date, referrer
- Bulk approve/reject pending rewards
- Flag for manual review

**Reward Queue**:
- Show pending rewards awaiting approval
- Approve button (auto-credit ₹500 or ₹1,000, or apply 3-month free)
- Reject with reason
- Bulk process

**Reward Ledger**:
- Customer email | Total Earned | Cash Paid | Subscriptions Given | Pending | Last Updated
- Click to see detailed transaction history

---

### 4. Settings
**Config Section**:
- Cash reward thresholds (high: ₹4,000, amount: ₹1,000; low: amount ₹500)
- Subscription reward (months: 3)
- Referral bonus (₹500)
- Auto-credit settings (cash: yes, subscription: yes)
- Require admin approval: toggle + threshold amount

---

## Customer Portal Pages

### 1. Referral Dashboard
**Quick Stats Section**:
```
My Clicks: 45  |  My Signups: 8  |  My Purchases: 5  |  My Earnings: ₹4,500
```

**Share Section**:
- My Code: `VJDOE123`
- Link: `https://spendsmartdemo.com/ref/VJDOE123` [Copy]
- Share buttons: [Email] [WhatsApp] [Copy Link]

**My Referrals Table**:
- Prospect | Status | Clicked | Purchased | Reward Earned | Date
- Show: pending, signed_up, purchased, cancelled
- Filter by status, date range

---

### 2. Earnings & Rewards
**Overview**:
- **Total Earned**: ₹4,500
- **Cash Balance**: ₹2,500 (earned)
- **Pending Approval**: ₹500
- **Free Subscription Months**: 6

**Transaction History**:
- Date | Type | Amount | Status | Action
- Types: Cash earned, Cash claimed, Subscription applied, Bonus received
- Filter: all, earned, claimed

**Claim Section**:
- Cash available: ₹2,500
- [Claim Now] button
- Shows: Amount claimed, credited to account, instant

**Subscription**:
- Free months available: 6
- [Apply to New Subscription] button
- [Apply to Existing Subscription] dropdown + apply button

---

## Key Differences from Original Spec

| Aspect | Old | New |
|--------|-----|-----|
| **Reward Type** | Percentage-based (15-20%) | Fixed cash (₹500/₹1,000) or subscription |
| **Calculation** | Variable % per deal | Simple threshold-based |
| **Prospect Incentive** | No bonus | ₹500 OFF automatically |
| **Claim Process** | Manual approval needed | Auto-credited instantly |
| **Tiered Rewards** | Yes, by conversion count | No, flat structure |
| **Subscription Reward** | Not included | 3 months free |
| **Earning Limits** | Tiered caps | No limits |
| **Real-time Tracking** | Basic dashboard | Detailed performance dashboard |

---

## MongoDB Indexes

```javascript
// referral_codes
db.referral_codes.createIndex({ code: 1 }, { unique: true });
db.referral_codes.createIndex({ referrer_id: 1, is_active: 1 });
db.referral_codes.createIndex({ created_at: -1 });

// referral_conversions
db.referral_conversions.createIndex({ referral_code: 1 });
db.referral_conversions.createIndex({ referrer_id: 1, conversion_stage: 1 });
db.referral_conversions.createIndex({ prospect_id: 1 });
db.referral_conversions.createIndex({ purchased_at: -1 });

// referral_rewards
db.referral_rewards.createIndex({ customer_id: 1 });
db.referral_rewards.createIndex({ total_earned: -1 });
```

---

## Implementation Checklist

**Phase 1: Backend Foundation** (Week 1-2)
- [ ] Update MongoDB schemas (codes, conversions, rewards, settings)
- [ ] Build API routes (admin + customer)
- [ ] Reward calculation logic (₹500/₹1,000 logic)
- [ ] Auto-credit mechanism
- [ ] Email notifications (referral click, purchase, reward)

**Phase 2: Admin Panel** (Week 3-4)
- [ ] Referral dashboard
- [ ] Codes management (create, list, edit)
- [ ] Conversions table & filters
- [ ] Reward approval queue
- [ ] Analytics section
- [ ] Settings page

**Phase 3: Customer Portal** (Week 5-6)
- [ ] Referral dashboard
- [ ] Share links & buttons
- [ ] Earnings overview
- [ ] Claim cash feature
- [ ] Apply subscription feature
- [ ] Transaction history

**Phase 4: Testing & Optimization** (Week 7)
- [ ] End-to-end testing
- [ ] Performance optimization (caching, indexes)
- [ ] Security audit
- [ ] Go-live

---

## Success Metrics

**Business KPIs**:
- Referral conversion rate: **15%+** (clicks to purchases)
- Avg referral value: **₹4,500+** (earning threshold)
- Cost per acquisition: **<₹500** (reward vs. customer LTV)
- Referrer adoption: **50%+** (% with active code)
- Reward claim rate: **80%+** (earned vs. claimed)

**Operational**:
- Code generation: **<2 min**
- Reward crediting: **<1 min** (automatic)
- Dashboard load time: **<2 sec**
- API response: **<200ms** (p95)

---

## Notes

- All amounts in **₹ (Indian Rupees)**
- Auto-credit for cash (no manual approval unless above threshold)
- Subscription rewards applied instantly to account
- Real-time dashboard tracking for transparency
- No earning limits (unlimited referrals & rewards)
- Simple, easy-to-understand reward structure

