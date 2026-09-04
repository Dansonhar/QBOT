import React, { useState, useCallback, useMemo } from 'react';
import { Check, X, ChevronDown, ChevronUp, Cpu, Monitor, Smartphone, TabletSmartphone, QrCode, Globe, Tv, ListOrdered, Utensils, AppWindow, TrendingUp, Package, Store, Tablet, Info, Building2, Loader2 } from 'lucide-react';
import { usePricingPageConfig } from '../hooks/usePricingPageConfig';
import { resolveIcon } from '../types/pricingPageConfig';

// ── Types ──────────────────────────────────────────────────
type Availability = true | false | string; // true = included, false = not available, string = addon price

interface PricingFeature {
  name: string;
  liner: string;
  free: Availability;
  starter: Availability;
  standard: Availability;
  pro: Availability;
}

interface PricingModule {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  features: PricingFeature[];
  tierAddon?: Partial<Record<'free' | 'starter' | 'standard' | 'pro', string>>; // e.g. { pro: '$19.9' } shown in header row
}

// ── Pricing Data ───────────────────────────────────────────
const MONTHLY_PRICES_USD = { free: 0, starter: 9.9, standard: 29.9, pro: 49.9 };
const YEARLY_PRICES_USD = { free: 0, starter: 7.9, standard: 24.9, pro: 42.9 };
const MONTHLY_PRICES_MYR = { free: 0, starter: 39, standard: 119, pro: 199 };
const YEARLY_PRICES_MYR = { free: 0, starter: 29, standard: 99, pro: 169 };
// Addon price mapping: USD → MYR
const ADDON_MYR: Record<string, number> = { '9.9': 39, '19.9': 79 };

const TIER_META: { key: 'free' | 'starter' | 'standard' | 'pro'; label: string; positioning: string; tagline: string }[] = [
  { key: 'free', label: 'FREE', positioning: 'Validate Without Risk', tagline: 'Prove your concept costs nothing' },
  { key: 'starter', label: 'STARTER', positioning: 'Eliminate Daily Chaos', tagline: 'Take back operational control' },
  { key: 'standard', label: 'STANDARD', positioning: 'Automate Your Growth', tagline: 'Revenue automation that pays for itself' },
  { key: 'pro', label: 'PRO', positioning: 'Scale Like a Chain', tagline: 'Optimize margins across every branch' },
];

// Tier summaries for psychological positioning
const TIER_SUMMARY: Record<string, { bullets: string[]; constraint?: string; eliteLabel?: string; revenueFrame?: string }> = {
  free: {
    bullets: ['Start selling in minutes', 'Basic POS & Webstore', 'Zero commitment'],
    constraint: '500 transactions/mo \u00b7 QPOS watermark',
  },
  starter: {
    bullets: ['Staff control & shift tracking', 'Mobile POS on any phone', 'AI business insights'],
  },
  standard: {
    bullets: ['Self-ordering (Kiosk + QR)', 'Automated revenue boosters', 'Unlimited outlets & channels'],
    revenueFrame: 'Pays for itself with just 1\u20132 extra orders per day',
  },
  pro: {
    bullets: ['Inventory automation', 'Revenue attribution & forecasting', 'Multi-branch optimization'],
    eliteLabel: 'Advanced Intelligence Layer',
    revenueFrame: 'Replaces managers, spreadsheets and guesswork',
  },
};

const MODULES: PricingModule[] = [
  {
    id: 'aihub',
    name: 'AI Hub',
    description: 'Stop guessing what\u2019s working. QPOS AI analyzes your sales, customers and staff performance — and tells you exactly what to fix, optimize or double down on.',
    icon: Cpu,
    features: [
      { name: 'Sales Report', liner: 'See exactly where your revenue comes from — no spreadsheets needed', free: '3 months', starter: true, standard: true, pro: true },
      { name: 'AI Insights', liner: 'Ask any question about your business and get instant clarity', free: false, starter: true, standard: true, pro: true },
      { name: 'Product Performance', liner: 'Know which menu items make money and which ones drag you down', free: false, starter: false, standard: true, pro: true },
      { name: 'Customer Analytics', liner: 'Understand who your best customers are and how to keep them', free: false, starter: false, standard: true, pro: true },
      { name: 'Actionable Recommendations', liner: 'Get told exactly what to fix, optimize or double down on', free: false, starter: false, standard: true, pro: true },
      { name: 'Peak Hours Analysis', liner: 'Staff smarter by knowing exactly when your rush hits', free: false, starter: false, standard: true, pro: true },
      { name: 'Multi-Channel Breakdown', liner: 'See which channels drive the most revenue at a glance', free: false, starter: false, standard: true, pro: true },
      { name: 'Revenue by Outlet', liner: 'Instantly spot your strongest and weakest branches', free: false, starter: false, standard: true, pro: true },
      { name: 'Staff Management', liner: 'Control who does what, where — with one click', free: false, starter: true, standard: true, pro: true },
      { name: 'Weekly Email Digest', liner: 'Wake up every Monday knowing exactly how last week went', free: false, starter: true, standard: true, pro: true },
      { name: 'Export to CSV & PDF', liner: 'Share reports with partners and accountants in seconds', free: false, starter: true, standard: true, pro: true },
      { name: 'Dashboard Widgets', liner: 'See your most important numbers the moment you log in', free: false, starter: false, standard: true, pro: true },
      { name: 'Menu Engineering Matrix', liner: 'Scientifically optimize your menu for maximum profit', free: false, starter: false, standard: true, pro: true },
      { name: 'Staff Performance Scoring', liner: 'Reward your best staff and coach the rest with real data', free: false, starter: false, standard: true, pro: true },
      { name: 'Discount Impact Analysis', liner: 'Know whether your discounts are making or losing money', free: false, starter: false, standard: false, pro: true },
      { name: 'Fulfillment Analytics', liner: 'Find kitchen bottlenecks before they cost you customers', free: false, starter: false, standard: false, pro: true },
      { name: 'Booster Impact Report', liner: 'Measure exactly how much extra revenue your promotions generate', free: false, starter: false, standard: false, pro: true },
      { name: 'Revenue Forecasting', liner: 'Plan ahead with AI-predicted revenue for the next 30 days', free: false, starter: false, standard: false, pro: true },
      { name: 'Customer Lifetime Value', liner: 'Know how much each customer is worth over their lifetime', free: false, starter: false, standard: false, pro: true },
      { name: 'Custom Report Builder', liner: 'Build exactly the reports you need — no developer required', free: false, starter: false, standard: false, pro: true },
    ],
  },
  {
    id: 'pos',
    name: 'Super POS',
    description: 'Handle dine-in, takeaway and delivery from one unified screen. No confusion. No switching systems. No lost orders. Your operations stay calm — even during peak hour chaos.',
    icon: Monitor,
    features: [
      { name: 'Full Register System', liner: 'Ring up any order in seconds — no training manual needed', free: true, starter: true, standard: true, pro: true },
      { name: 'Multi-Payment Methods', liner: 'Accept every payment method your customers expect', free: true, starter: true, standard: true, pro: true },
      { name: 'Product Modifiers', liner: 'Handle any customization without slowing down the line', free: true, starter: true, standard: true, pro: true },
      { name: 'Table Management', liner: 'See your entire floor at a glance — every table, every status', free: true, starter: true, standard: true, pro: true },
      { name: 'Tax Configuration', liner: 'Stay tax-compliant automatically across products and outlets', free: true, starter: true, standard: true, pro: true },
      { name: 'Barcode Scanning', liner: 'Scan and sell — faster than typing, zero mistakes', free: true, starter: true, standard: true, pro: true },
      { name: 'Order Notes', liner: 'Never miss a special request from the kitchen again', free: true, starter: true, standard: true, pro: true },
      { name: 'Shift Management', liner: 'Open and close with confidence — every dollar accounted for', free: false, starter: true, standard: true, pro: true },
      { name: 'Receipt Customization', liner: 'Turn every receipt into a branded marketing touchpoint', free: false, starter: true, standard: true, pro: true },
      { name: 'Discount & Promo Codes', liner: 'Reward customers on the spot without calling a manager', free: false, starter: true, standard: true, pro: true },
      { name: 'Customer Lookup', liner: 'Greet regulars by name and reward them instantly', free: false, starter: true, standard: true, pro: true },
      { name: 'Kitchen Printer Integration', liner: 'Orders hit the kitchen the moment you confirm — zero delay', free: false, starter: true, standard: true, pro: true },
      { name: 'End-of-Day Report', liner: 'Close your day in minutes, not hours — everything tallied', free: false, starter: true, standard: true, pro: true },
      { name: 'Customer Display', liner: 'Build trust with transparent pricing on a second screen', free: false, starter: false, standard: true, pro: true },
      { name: 'Parked & Open Orders', liner: 'Pause and resume orders effortlessly for flexible dining', free: false, starter: false, standard: true, pro: true },
      { name: 'Split Bill', liner: 'Split any bill any way without awkward math', free: false, starter: false, standard: true, pro: true },
      { name: 'Multi-Device Sync', liner: 'Run multiple registers in perfect sync — no conflicts ever', free: false, starter: false, standard: true, pro: true },
      { name: 'Offline Mode', liner: 'Keep selling even when the internet drops — zero downtime', free: false, starter: false, standard: true, pro: true },
      { name: 'Multi-Currency Support', liner: 'Welcome tourists and accept their currency automatically', free: false, starter: false, standard: false, pro: true },
      { name: 'Advanced Void & Refund', liner: 'Protect against fraud with manager-approved voids and full audit trails', free: false, starter: false, standard: false, pro: true },
    ],
  },
  {
    id: 'mpos',
    name: 'Super mPOS',
    description: 'Your phone becomes your register. Take orders tableside, manage queues and accept payments anywhere — no extra hardware, no limitations, total freedom.',
    icon: Smartphone,
    features: [
      { name: 'Portable Register', liner: 'Take your entire register wherever the customers are', free: false, starter: true, standard: true, pro: true },
      { name: 'Queue Control', liner: 'Manage walk-in crowds without chaos or lost customers', free: false, starter: true, standard: true, pro: true },
      { name: 'Scanner Station', liner: 'Verify tickets, stamps and vouchers on the spot', free: false, starter: true, standard: true, pro: true },
      { name: 'Service Notifications', liner: 'Know instantly when a table needs you — before they wave', free: false, starter: true, standard: true, pro: true },
      { name: 'Transaction History', liner: 'Every sale at your fingertips, anytime you need it', free: false, starter: true, standard: true, pro: true },
      { name: 'Tableside Ordering', liner: 'Take orders at the table — no walking back and forth', free: false, starter: true, standard: true, pro: true },
      { name: 'Quick-Add Favorites', liner: 'Your best-sellers are one tap away during the rush', free: false, starter: true, standard: true, pro: true },
      { name: 'Discount Application', liner: 'Apply promos on the floor without returning to the counter', free: false, starter: true, standard: true, pro: true },
      { name: 'Daily Sales Summary', liner: 'End your shift knowing exactly how much you sold', free: false, starter: true, standard: true, pro: true },
      { name: 'Wireless Receipt Printing', liner: 'Print receipts from anywhere — no cables, no hassle', free: false, starter: true, standard: true, pro: true },
      { name: 'Customer Lookup', liner: 'Recognize loyalty members and reward them in seconds', free: false, starter: true, standard: true, pro: true },
      { name: 'Tap-to-Pay NFC', liner: 'Accept contactless payments with just a phone tap', free: false, starter: false, standard: true, pro: true },
      { name: 'Offline Mode', liner: 'Keep taking orders even in dead zones — auto-syncs later', free: false, starter: false, standard: true, pro: true },
      { name: 'Split Bill on Mobile', liner: 'Split bills tableside without making anyone wait', free: false, starter: false, standard: true, pro: true },
      { name: 'Photo Menu Display', liner: 'Show beautiful dish photos that help customers decide faster', free: false, starter: false, standard: true, pro: true },
      { name: 'Multi-Language Interface', liner: 'Your multilingual staff works in their preferred language', free: false, starter: false, standard: true, pro: true },
      { name: 'Bluetooth Peripheral Support', liner: 'Connect printers and scanners without any wiring', free: false, starter: false, standard: true, pro: true },
      { name: 'Device Management', liner: 'Track and control all your mobile devices from one place', free: false, starter: false, standard: true, pro: true },
      { name: 'GPS Location Tracking', liner: 'Know where every device and staff member is during events', free: false, starter: false, standard: false, pro: true },
      { name: 'Multi-Outlet Switching', liner: 'Jump between branches on one device without logging out', free: false, starter: false, standard: false, pro: true },
    ],
  },
  {
    id: 'kiosk',
    name: 'Super Kiosk',
    description: 'Customers spend 20\u201330% more when they order themselves. Eliminate queues, reduce staff dependency and increase revenue — all from one branded touchscreen.',
    icon: TabletSmartphone,
    features: [
      { name: 'Self-Ordering Interface', liner: 'Customers browse, customize and order — no staff needed', free: false, starter: false, standard: true, pro: true },
      { name: 'Multiple Payment Gateways', liner: 'Accept cards, e-wallets and NFC without extra hardware', free: false, starter: false, standard: true, pro: true },
      { name: 'Custom Branding', liner: 'Your brand, your colors — customers see you, not us', free: false, starter: false, standard: true, pro: true },
      { name: 'Dine-in & Takeaway', liner: 'Automatically sort orders so kitchen knows exactly what to prep', free: false, starter: false, standard: true, pro: true },
      { name: 'Voucher & Member Lookup', liner: 'Customers redeem loyalty rewards without asking staff', free: false, starter: false, standard: true, pro: true },
      { name: 'Order Confirmation', liner: 'Clear confirmations that reduce counter questions', free: false, starter: false, standard: true, pro: true },
      { name: 'Multi-Language Support', liner: 'Serve tourists and multilingual customers effortlessly', free: false, starter: false, standard: true, pro: true },
      { name: 'Allergen Information', liner: 'Protect customers and reduce liability with clear allergen labels', free: false, starter: false, standard: true, pro: true },
      { name: 'Combo Meal Builder', liner: 'Guide customers to higher-value combos that boost your AOV', free: false, starter: false, standard: true, pro: true },
      { name: 'Idle Screen Promotions', liner: 'Turn idle kiosks into promotional billboards that sell for you', free: false, starter: false, standard: true, pro: true },
      { name: 'Queue Number Assignment', liner: 'Organize pickups automatically — no shouting, no confusion', free: false, starter: false, standard: true, pro: true },
      { name: 'Receipt Printing', liner: 'Physical or digital receipts — whatever your customer prefers', free: false, starter: false, standard: true, pro: true },
      { name: 'NFC Contactless Payment', liner: 'Fast tap-and-go checkout that keeps the line moving', free: false, starter: false, standard: true, pro: true },
      { name: 'Remote Content Management', liner: 'Update every kiosk from your office — no USB drives needed', free: false, starter: false, standard: true, pro: true },
      { name: 'Accessibility Mode', liner: 'Serve every customer comfortably with inclusive design', free: false, starter: false, standard: true, pro: true },
      { name: 'Nutritional Information', liner: 'Health-conscious customers order with confidence', free: false, starter: false, standard: false, pro: true },
      { name: 'Custom Themes & Layouts', liner: 'Design the browsing experience that fits your restaurant style', free: false, starter: false, standard: false, pro: true },
      { name: 'Multi-Kiosk Management', liner: 'Control all your kiosks from one dashboard — no walking around', free: false, starter: false, standard: false, pro: true },
      { name: 'Age Verification Prompt', liner: 'Stay compliant with age-restricted item checks built in', free: false, starter: false, standard: false, pro: true },
      { name: 'Kiosk Analytics Dashboard', liner: 'Know exactly how your kiosks perform and where to improve', free: false, starter: false, standard: false, pro: true },
    ],
  },
  {
    id: 'qr',
    name: 'Scan-to-Order (QR)',
    description: 'Zero hardware cost, zero app downloads. Customers order from their own phone, reorder anytime and request the bill — reducing your staff workload by up to 40%.',
    icon: QrCode,
    features: [
      { name: 'Table QR Ordering', liner: 'Customers order from their own phone — you spend nothing on devices', free: false, starter: false, standard: true, pro: true },
      { name: 'Multi-Round Ordering', liner: 'Guests add more items anytime without flagging a waiter', free: false, starter: false, standard: true, pro: true },
      { name: 'Service Bell', liner: 'Customers tap for help — your staff gets notified instantly', free: false, starter: false, standard: true, pro: true },
      { name: 'Bill Request', liner: 'Guests request the bill when ready — faster table turnover', free: false, starter: false, standard: true, pro: true },
      { name: 'Real-time Order Status', liner: 'Customers track their order live — fewer counter questions', free: false, starter: false, standard: true, pro: true },
      { name: 'Photo-Rich Menu', liner: 'Beautiful dish photos on their phone that drive appetite and spend', free: false, starter: false, standard: true, pro: true },
      { name: 'Promo Code Entry', liner: 'Customers apply discounts themselves — zero staff effort', free: false, starter: false, standard: true, pro: true },
      { name: 'Menu Translation', liner: 'International guests order in their own language automatically', free: false, starter: false, standard: true, pro: true },
      { name: 'Allergen Filters', liner: 'Customers filter by dietary needs — no awkward conversations', free: false, starter: false, standard: true, pro: true },
      { name: 'Digital Receipt', liner: 'Paperless receipts on their phone — eco-friendly and convenient', free: false, starter: false, standard: true, pro: true },
      { name: 'Table Auto-Detect', liner: 'The QR code knows which table — no manual input needed', free: false, starter: false, standard: true, pro: true },
      { name: 'Dietary Labels', liner: 'Clear vegan, halal and allergy tags build customer trust', free: false, starter: false, standard: true, pro: true },
      { name: 'Wait Time Display', liner: 'Set accurate expectations before customers even order', free: false, starter: false, standard: true, pro: true },
      { name: 'Cart Sharing', liner: 'Multiple guests add to one cart — perfect for group dining', free: false, starter: false, standard: true, pro: true },
      { name: 'Bandwidth-Optimized Loading', liner: 'Loads fast even on slow data — no frustrated customers', free: false, starter: false, standard: true, pro: true },
      { name: 'Customer Feedback Form', liner: 'Capture reviews while the experience is fresh', free: false, starter: false, standard: false, pro: true },
      { name: 'Order History', liner: 'Returning guests reorder favorites in seconds', free: false, starter: false, standard: false, pro: true },
      { name: 'Upsell Suggestions', liner: 'Smart prompts that add revenue without staff intervention', free: false, starter: false, standard: false, pro: true },
      { name: 'Custom QR Code Design', liner: 'Branded QR codes that match your restaurant identity', free: false, starter: false, standard: false, pro: true },
      { name: 'Multi-Language Auto-Detect', liner: 'Menu appears in the customer\u2019s phone language automatically', free: false, starter: false, standard: false, pro: true },
    ],
  },
  {
    id: 'tablet',
    name: 'Super Tablet',
    description: 'Guests explore your full menu at their own pace, customize every detail and request service — all without a single staff interaction. Premium dining, zero labor cost.',
    icon: Tablet,
    tierAddon: { pro: '$19.9' },
    features: [
      { name: 'Tableside Customer Ordering', liner: 'Guests explore your menu at their own pace — no pressure, bigger orders', free: false, starter: false, standard: false, pro: true },
      { name: 'Pax Selection', liner: 'Portion and pace recommendations based on party size', free: false, starter: false, standard: false, pro: true },
      { name: 'Service Request Panel', liner: 'Water, cutlery, help — guests tap instead of waving', free: false, starter: false, standard: false, pro: true },
      { name: 'Attract Screen', liner: 'Idle tablets promote specials and new items automatically', free: false, starter: false, standard: false, pro: true },
      { name: 'Device Activation Wizard', liner: 'Set up new tablets in minutes with guided onboarding', free: false, starter: false, standard: false, pro: true },
      { name: 'Multi-Language Menu', liner: 'Guests choose their language before browsing — true hospitality', free: false, starter: false, standard: false, pro: true },
      { name: 'Photo-Rich Catalog', liner: 'Full-screen dish photos that sell better than any waiter description', free: false, starter: false, standard: false, pro: true },
      { name: 'Allergen & Dietary Filters', liner: 'Guests filter by diet with confidence — no awkward questions', free: false, starter: false, standard: false, pro: true },
      { name: 'Real-Time Stock Visibility', liner: 'Sold-out items disappear automatically — no disappointment', free: false, starter: false, standard: false, pro: true },
      { name: 'Combo Builder', liner: 'Guide guests through combos that increase your average check', free: false, starter: false, standard: false, pro: true },
      { name: 'Digital Bill Splitting', liner: 'Guests split the bill themselves — no math, no delays', free: false, starter: false, standard: false, pro: true },
      { name: 'Customer Feedback on Exit', liner: 'Capture 5-star reviews before guests walk out the door', free: false, starter: false, standard: false, pro: true },
      { name: 'Idle Mode Slideshow', liner: 'Every idle moment becomes a promotion opportunity', free: false, starter: false, standard: false, pro: true },
      { name: 'Staff Override Mode', liner: 'Managers access settings with a PIN — secure and controlled', free: false, starter: false, standard: false, pro: true },
      { name: 'Table-Linked Auto-Binding', liner: 'Tablets know their table — orders routed automatically', free: false, starter: false, standard: false, pro: true },
      { name: 'Sound & Haptic Feedback', liner: 'Satisfying confirmations that make ordering feel premium', free: false, starter: false, standard: false, pro: true },
      { name: 'Custom Theme Colors', liner: 'Your brand colors, your identity — on every table', free: false, starter: false, standard: false, pro: true },
      { name: 'Nutritional Info Display', liner: 'Health-conscious guests order confidently with full nutrition data', free: false, starter: false, standard: false, pro: true },
      { name: 'Parent & Child Table Linking', liner: 'Merge tables for large parties without any confusion', free: false, starter: false, standard: false, pro: true },
      { name: 'Remote Device Monitoring', liner: 'Know every tablet\u2019s battery and status without leaving your desk', free: false, starter: false, standard: false, pro: true },
    ],
  },
  {
    id: 'web',
    name: 'Webstore',
    description: 'Stop paying 25\u201330% to marketplaces. Your own branded online store accepts orders 24/7 with pickup and delivery — every dollar of revenue stays yours.',
    icon: Globe,
    features: [
      { name: 'Online Storefront', liner: 'Your own branded shop — no marketplace taking 30% of your revenue', free: true, starter: true, standard: true, pro: true },
      { name: 'Product Catalog & Search', liner: 'Customers find what they want fast — fewer abandoned carts', free: true, starter: true, standard: true, pro: true },
      { name: 'Online Checkout & Payment', liner: 'Secure payments that build trust and close sales', free: true, starter: true, standard: true, pro: true },
      { name: 'Pickup & Delivery', liner: 'Offer both fulfillment options — cover every customer preference', free: true, starter: true, standard: true, pro: true },
      { name: 'Promo Banners & Collections', liner: 'Promote specials and seasonal items that drive extra orders', free: true, starter: true, standard: true, pro: true },
      { name: 'SEO-Optimized Pages', liner: 'Get found on Google — bring in customers who are searching for you', free: true, starter: true, standard: true, pro: true },
      { name: 'Customer Accounts', liner: 'Saved preferences and one-click reordering keep customers coming back', free: true, starter: true, standard: true, pro: true },
      { name: 'Order Tracking', liner: 'Customers track their order live — fewer support calls', free: true, starter: true, standard: true, pro: true },
      { name: 'Discount Codes', liner: 'Drive repeat orders and referrals with targeted promotions', free: false, starter: true, standard: true, pro: true },
      { name: 'Email Notifications', liner: 'Automatic updates that keep customers informed and happy', free: false, starter: true, standard: true, pro: true },
      { name: 'Inventory Sync', liner: 'Sold-out items hide automatically — no disappointed customers', free: false, starter: false, standard: true, pro: true },
      { name: 'Delivery Zone Mapping', liner: 'Set delivery areas and distance-based pricing in minutes', free: false, starter: false, standard: true, pro: true },
      { name: 'Social Media Integration', liner: 'Turn every product into a shareable social post', free: false, starter: false, standard: true, pro: true },
      { name: 'Custom Domain Support', liner: 'Your brand, your URL — build lasting customer trust', free: false, starter: false, standard: true, pro: true },
      { name: 'Multi-Language Storefront', liner: 'Reach international customers in their own language', free: false, starter: false, standard: true, pro: true },
      { name: 'Customer Reviews', liner: 'Social proof from real buyers that drives new orders', free: false, starter: false, standard: true, pro: true },
      { name: 'Scheduled Ordering', liner: 'Customers order now, pick up later — convenience that converts', free: false, starter: false, standard: true, pro: true },
      { name: 'Webstore Analytics', liner: 'Know exactly what\u2019s working and what\u2019s losing customers', free: false, starter: false, standard: false, pro: true },
      { name: 'Abandoned Cart Recovery', liner: 'Win back lost sales automatically with smart reminders', free: false, starter: false, standard: false, pro: true },
      { name: 'API Access', liner: 'Connect your store to any external tool or service you need', free: false, starter: false, standard: false, pro: true },
    ],
  },
  {
    id: 'live',
    name: 'Live Display',
    description: 'Customers see their order status live on big screens — no more crowding the counter, no more anxiety. Queue announcements keep your venue calm and organized.',
    icon: Tv,
    features: [
      { name: 'Live Order Board', liner: 'Customers see their order status — no crowding the counter', free: true, starter: true, standard: true, pro: true },
      { name: 'Multi-Channel Support', liner: 'Every order from every channel on one unified screen', free: true, starter: true, standard: true, pro: true },
      { name: 'Fullscreen Kiosk Mode', liner: 'Lock your TV into a professional display — no distractions', free: true, starter: true, standard: true, pro: true },
      { name: 'Sound Notifications', liner: 'Audio alerts ensure no order number goes unheard', free: false, starter: true, standard: true, pro: true },
      { name: 'Sound Volume Control', liner: 'Fine-tune volume remotely for any time of day', free: false, starter: true, standard: true, pro: true },
      { name: 'Queue Call Announcements', liner: 'Call queue numbers on screen so everyone sees and hears', free: false, starter: false, standard: true, pro: true },
      { name: 'Custom Display Settings', liner: 'Design your display to match your venue\u2019s look and feel', free: false, starter: false, standard: true, pro: true },
      { name: 'Multi-Screen Support', liner: 'Run different views on different TVs across your venue', free: false, starter: false, standard: true, pro: true },
      { name: 'Custom Branding & Colors', liner: 'Your brand on the big screen — consistent everywhere', free: false, starter: false, standard: true, pro: true },
      { name: 'Order ETA Display', liner: 'Manage customer expectations with accurate wait times', free: false, starter: false, standard: true, pro: true },
      { name: 'Promotional Slide Carousel', liner: 'Turn wait time into marketing time with rotating promos', free: false, starter: false, standard: true, pro: true },
      { name: 'Digital Menu Board Mode', liner: 'Use idle screens as digital menus that attract orders', free: false, starter: false, standard: true, pro: true },
      { name: 'Multi-Language Display', liner: 'Serve multilingual venues with localized order displays', free: false, starter: false, standard: true, pro: true },
      { name: 'Animated Transitions', liner: 'Smooth animations that look professional and polished', free: false, starter: false, standard: true, pro: true },
      { name: 'Vertical & Horizontal Layout', liner: 'Fit any TV orientation in your venue perfectly', free: false, starter: false, standard: true, pro: true },
      { name: 'Order Type Grouping', liner: 'Organize dine-in, takeaway and delivery at a glance', free: false, starter: false, standard: true, pro: true },
      { name: 'Auto-Dimming Night Mode', liner: 'Screens dim automatically after hours — energy efficient', free: false, starter: false, standard: true, pro: true },
      { name: 'Priority Queue Highlighting', liner: 'VIP and priority orders stand out immediately', free: false, starter: false, standard: false, pro: true },
      { name: 'Remote Display Control', liner: 'Manage every screen from CMS — no walking to each TV', free: false, starter: false, standard: false, pro: true },
      { name: 'Display Health Monitoring', liner: 'Get alerted the moment a display goes offline', free: false, starter: false, standard: false, pro: true },
    ],
  },
  {
    id: 'qds',
    name: 'QDS (Queue Display)',
    description: 'No more shouting queue numbers. Automatic voice announcements, multi-counter support and real-time wait tracking keep your customers informed and your staff focused.',
    icon: ListOrdered,
    features: [
      { name: 'Queue Number Display', liner: 'Crystal-clear queue numbers that every customer can see', free: false, starter: false, standard: true, pro: true },
      { name: 'Audio Announcements', liner: 'Automatic voice calls so staff never have to shout again', free: false, starter: false, standard: true, pro: true },
      { name: 'Multi-Prefix Support', liner: 'Separate queues for different counters — organized and efficient', free: false, starter: false, standard: true, pro: true },
      { name: 'Waiting Statistics', liner: 'Real-time wait data helps you manage rush hours intelligently', free: false, starter: false, standard: true, pro: true },
      { name: 'Real-time Updates', liner: 'Numbers update instantly — no lag, no confusion', free: false, starter: false, standard: true, pro: true },
      { name: 'Counter Assignment', liner: 'Direct customers to the right counter automatically', free: false, starter: false, standard: true, pro: true },
      { name: 'Custom Voice Selection', liner: 'Choose the voice and language that fits your venue', free: false, starter: false, standard: true, pro: true },
      { name: 'Queue Skip & Priority', liner: 'VIP and accessibility queue jumps handled smoothly', free: false, starter: false, standard: true, pro: true },
      { name: 'Multi-Language Announcements', liner: 'Serve multilingual venues with localized voice calls', free: false, starter: false, standard: true, pro: true },
      { name: 'Estimated Wait Time', liner: 'Set expectations upfront — reduce customer frustration', free: false, starter: false, standard: true, pro: true },
      { name: 'Queue Number Printing', liner: 'Physical tickets for customers who prefer something in hand', free: false, starter: false, standard: true, pro: true },
      { name: 'Customer Check-In', liner: 'Let customers join the queue from their phone or kiosk', free: false, starter: false, standard: true, pro: true },
      { name: 'Queue Recall', liner: 'Missed your number? One tap brings it back', free: false, starter: false, standard: true, pro: true },
      { name: 'Daily Queue Statistics', liner: 'Know how many served, peak times and average wait daily', free: false, starter: false, standard: true, pro: true },
      { name: 'Multiple Display Layouts', liner: 'Choose the view that works best for your space', free: false, starter: false, standard: true, pro: true },
      { name: 'Custom Sound Alerts', liner: 'Unique sounds per queue prefix — clear and unmistakable', free: false, starter: false, standard: true, pro: true },
      { name: 'SMS Queue Notifications', liner: 'Text customers when their turn approaches — they stay relaxed', free: false, starter: false, standard: false, pro: true },
      { name: 'Queue Transfer Between Counters', liner: 'Move customers between counters without requeuing', free: false, starter: false, standard: false, pro: true },
      { name: 'Peak Hour Auto-Scaling', liner: 'Extra queues open automatically when things get busy', free: false, starter: false, standard: false, pro: true },
      { name: 'Remote Queue Management', liner: 'Control everything from CMS — no standing behind the counter', free: false, starter: false, standard: false, pro: true },
    ],
  },
  {
    id: 'kds',
    name: 'KDS (Kitchen Display)',
    description: 'Your kitchen, finally organized. Orders route to the right station automatically, aging alerts catch delays before customers complain, and tickets never get lost again.',
    icon: Utensils,
    features: [
      { name: 'Kitchen Display', liner: 'Every order visible on screen — no more lost paper tickets', free: true, starter: true, standard: true, pro: true },
      { name: 'Multi-Station Routing', liner: 'Drinks go to bar, food to grill — automatically', free: false, starter: false, standard: true, pro: true },
      { name: 'Order Bumping', liner: 'One tap to mark done — keeps the line moving fast', free: false, starter: false, standard: true, pro: true },
      { name: 'Aging Alerts', liner: 'Amber and red warnings before forgotten orders become complaints', free: false, starter: false, standard: true, pro: true },
      { name: 'Expo Station', liner: 'Your chef sees everything — coordinates final assembly perfectly', free: false, starter: false, standard: true, pro: true },
      { name: 'Auto-Complete', liner: 'Orders close automatically when all stations finish — zero admin', free: false, starter: false, standard: true, pro: true },
      { name: 'Color-Coded Priority', liner: 'Rush and VIP orders impossible to miss', free: false, starter: false, standard: true, pro: true },
      { name: 'Modification Highlighting', liner: 'Special requests pop visually — fewer kitchen mistakes', free: false, starter: false, standard: true, pro: true },
      { name: 'Course-Based Firing', liner: 'Starters, mains and desserts fired in the right sequence', free: false, starter: false, standard: true, pro: true },
      { name: 'Preparation Timer', liner: 'Track prep time per item — find and fix slowdowns', free: false, starter: false, standard: true, pro: true },
      { name: 'Voice Announcements', liner: 'Audio alerts for new orders so the kitchen never misses one', free: false, starter: false, standard: true, pro: true },
      { name: 'Allergen Warnings', liner: 'Bold allergen flags protect your customers and your reputation', free: false, starter: false, standard: true, pro: true },
      { name: 'Rush Mode', liner: 'Priority orders jump to the front across all stations instantly', free: false, starter: false, standard: true, pro: true },
      { name: 'Order Grouping', liner: 'Group by table or order for efficient batch preparation', free: false, starter: false, standard: true, pro: true },
      { name: 'Custom Station Labels', liner: 'Name and color-code each station for instant recognition', free: false, starter: false, standard: true, pro: true },
      { name: 'Kitchen Printer Fallback', liner: 'If a screen goes down, tickets print automatically — no lost orders', free: false, starter: false, standard: true, pro: true },
      { name: 'Station Performance Metrics', liner: 'Know exactly which station is fast and which needs help', free: false, starter: false, standard: false, pro: true },
      { name: 'Recipe Display', liner: 'Prep instructions on screen ensure consistency every time', free: false, starter: false, standard: false, pro: true },
      { name: 'Split-Screen View', liner: 'Two stations on one display — perfect for small kitchens', free: false, starter: false, standard: false, pro: true },
      { name: 'Historical Prep Analytics', liner: 'Track kitchen speed trends to continuously improve', free: false, starter: false, standard: false, pro: true },
    ],
  },
  {
    id: 'app',
    name: 'Super Loyalty App',
    description: 'One phone number, total loyalty across every channel. Customers collect stamps, earn points and redeem vouchers whether they order at POS, Kiosk, QR or Webstore.',
    icon: AppWindow,
    features: [
      { name: 'Membership Profile', liner: 'Every customer has a profile — scanned at any touchpoint', free: true, starter: true, standard: true, pro: true },
      { name: 'Digital Receipt', liner: 'All receipts in one place — no more paper clutter', free: true, starter: true, standard: true, pro: true },
      { name: 'eStamps', liner: 'Digital stamps that customers actually use — no more lost cards', free: true, starter: true, standard: true, pro: true },
      { name: 'Transaction History', liner: 'Customers see every purchase — builds trust and habit', free: true, starter: true, standard: true, pro: true },
      { name: 'Favorites List', liner: 'One-tap reordering of favorites keeps customers coming back', free: true, starter: true, standard: true, pro: true },
      { name: 'Vouchers', liner: 'Targeted vouchers that bring customers back at the right time', free: false, starter: false, standard: true, pro: true },
      { name: 'Push Notifications', liner: 'Reach customers directly on their phone when it matters', free: false, starter: false, standard: true, pro: true },
      { name: 'Birthday Rewards', liner: 'Automatic birthday treats that make customers feel special', free: false, starter: false, standard: true, pro: true },
      { name: 'Welcome Bonus', liner: 'First-visit rewards that convert new visitors into regulars', free: false, starter: false, standard: true, pro: true },
      { name: 'Member-Only Pricing', liner: 'Exclusive pricing that makes membership feel valuable', free: false, starter: false, standard: true, pro: true },
      { name: 'In-App Ordering', liner: 'Customers order ahead — skip the line and pick up fast', free: false, starter: false, standard: true, pro: true },
      { name: 'Anniversary Rewards', liner: 'Celebrate customer milestones that deepen brand loyalty', free: false, starter: false, standard: true, pro: true },
      { name: 'Social Sharing', liner: 'Customers become promoters when they share rewards online', free: false, starter: false, standard: true, pro: true },
      { name: 'Points', liner: 'Points earned on every channel — one unified loyalty system', free: false, starter: false, standard: false, pro: true },
      { name: 'Referral Program', liner: 'Turn happy customers into your most effective sales channel', free: false, starter: false, standard: false, pro: true },
      { name: 'Tier Status Badges', liner: 'Bronze, Silver, Gold status that motivates higher spending', free: false, starter: false, standard: false, pro: true },
      { name: 'Gamification Challenges', liner: 'Fun missions that keep customers engaged between visits', free: false, starter: false, standard: false, pro: true },
      { name: 'Personalized Offers', liner: 'AI-crafted deals based on what each customer actually buys', free: false, starter: false, standard: false, pro: true },
      { name: 'Multi-Brand Support', liner: 'One app for all your restaurant brands — unified loyalty', free: false, starter: false, standard: false, pro: true },
      { name: 'Family Account Linking', liner: 'Families share points — bigger incentive to keep coming back', free: false, starter: false, standard: false, pro: true },
    ],
  },
  {
    id: 'sboost',
    name: 'Sales Booster',
    description: 'Every cart becomes an opportunity. Every checkout becomes smarter. Automated upsells, nudges and triggers increase your average order value by up to 25% — without training staff.',
    icon: TrendingUp,
    features: [
      { name: 'Product Badges', liner: 'Eye-catching labels that drive attention to high-margin items', free: true, starter: true, standard: true, pro: true },
      { name: 'Checkout Nudges', liner: 'Smart prompts that increase order size without annoying customers', free: false, starter: false, standard: true, pro: true },
      { name: 'Upsell Popups', liner: 'The right suggestion at the right moment — proven to convert', free: false, starter: false, standard: true, pro: true },
      { name: 'Cart Triggers', liner: 'Automatic promotions that reward bigger orders', free: false, starter: false, standard: true, pro: true },
      { name: 'Happy Hour Automation', liner: 'Prices change automatically during slow periods — fill more seats', free: false, starter: false, standard: true, pro: true },
      { name: 'Bundle Deals', liner: 'Pre-built combos that increase revenue and simplify ordering', free: false, starter: false, standard: true, pro: true },
      { name: 'Quantity-Based Discounts', liner: 'Buy-more-save-more deals that move inventory fast', free: false, starter: false, standard: true, pro: true },
      { name: 'Time-Limited Flash Sales', liner: 'Countdown urgency that drives immediate action', free: false, starter: false, standard: true, pro: true },
      { name: 'First-Time Customer Offer', liner: 'Welcome deals that convert first-timers into regulars', free: false, starter: false, standard: true, pro: true },
      { name: 'Cross-Channel Campaigns', liner: 'One promotion runs everywhere — POS, Kiosk, QR and Webstore', free: false, starter: false, standard: true, pro: true },
      { name: 'Campaign Scheduling', liner: 'Set it and forget it — promotions activate on your schedule', free: false, starter: false, standard: true, pro: true },
      { name: 'Auto-Expiring Promotions', liner: 'Deals shut off automatically — no forgotten discounts eroding margin', free: false, starter: false, standard: true, pro: true },
      { name: 'Minimum Spend Unlocks', liner: 'Encourage bigger orders with spend-threshold rewards', free: false, starter: false, standard: true, pro: true },
      { name: 'Tier Progression', liner: 'Customer tiers that reward loyalty and motivate higher spending', free: false, starter: false, standard: false, pro: true },
      { name: 'A/B Testing', liner: 'Test two promotions and keep the one that makes more money', free: false, starter: false, standard: false, pro: true },
      { name: 'Customer Segment Targeting', liner: 'Send the right offer to the right customer group', free: false, starter: false, standard: false, pro: true },
      { name: 'Personalized Recommendations', liner: 'AI picks the product each customer is most likely to add', free: false, starter: false, standard: false, pro: true },
      { name: 'Campaign Analytics Dashboard', liner: 'See exactly which campaigns are profitable and which aren\u2019t', free: false, starter: false, standard: false, pro: true },
      { name: 'Loyalty Tier Multipliers', liner: 'Top-tier members earn bonus points — rewarding your best customers', free: false, starter: false, standard: false, pro: true },
      { name: 'Re-Engagement Campaigns', liner: 'Win back customers who haven\u2019t visited in a while — automatically', free: false, starter: false, standard: false, pro: true },
    ],
  },
  {
    id: 'ims',
    name: 'IMS (Inventory)',
    description: 'Stop discovering stock problems too late. Real-time tracking across every outlet, automatic reorder alerts and supplier management — protect your margins automatically.',
    icon: Package,
    tierAddon: { pro: '$9.9' },
    features: [
      { name: 'Stock Tracking', liner: 'Know exactly what you have, across every outlet, right now', free: false, starter: false, standard: false, pro: true },
      { name: 'Supplier Management', liner: 'All your vendors, prices and history in one organized place', free: false, starter: false, standard: false, pro: true },
      { name: 'Low Stock Alerts', liner: 'Get warned before you run out — not after customers complain', free: false, starter: false, standard: false, pro: true },
      { name: 'Purchase Orders', liner: 'Generate and track POs from the same system you sell from', free: false, starter: false, standard: false, pro: true },
      { name: 'Stock Transfer', liner: 'Move inventory between outlets with full tracking and audit trail', free: false, starter: false, standard: false, pro: true },
      { name: 'Goods Received Notes', liner: 'Match deliveries against orders — catch discrepancies immediately', free: false, starter: false, standard: false, pro: true },
      { name: 'Stock Count & Reconciliation', liner: 'Physical counts with variance reports that find shrinkage fast', free: false, starter: false, standard: false, pro: true },
      { name: 'Batch Tracking', liner: 'Full traceability by batch — essential for food safety compliance', free: false, starter: false, standard: false, pro: true },
      { name: 'Expiry Date Monitoring', liner: 'Get alerted before products expire — reduce waste, protect customers', free: false, starter: false, standard: false, pro: true },
      { name: 'Wastage Recording', liner: 'Track every loss with reasons — data that helps you prevent it', free: false, starter: false, standard: false, pro: true },
      { name: 'Recipe Costing', liner: 'Know the exact cost of every dish — price with confidence', free: false, starter: false, standard: false, pro: true },
      { name: 'Automatic Reorder Points', liner: 'POs generate automatically when stock runs low — never miss a reorder', free: false, starter: false, standard: false, pro: true },
      { name: 'Multi-Unit Conversion', liner: 'Track in kg, pieces or liters — the system handles conversion', free: false, starter: false, standard: false, pro: true },
      { name: 'Ingredient-Level Tracking', liner: 'Ingredients deduct automatically when items sell — always accurate', free: false, starter: false, standard: false, pro: true },
      { name: 'Inventory Valuation Report', liner: 'Know your total inventory value at any moment — FIFO or average', free: false, starter: false, standard: false, pro: true },
      { name: 'Variance Analysis', liner: 'Find the gap between expected and actual usage — stop leakage', free: false, starter: false, standard: false, pro: true },
      { name: 'Supplier Price Comparison', liner: 'Compare supplier prices side by side — negotiate smarter', free: false, starter: false, standard: false, pro: true },
      { name: 'Barcode Label Printing', liner: 'Print internal barcodes for faster stock counts and organization', free: false, starter: false, standard: false, pro: true },
      { name: 'Stock Movement History', liner: 'Full audit trail of every movement — complete accountability', free: false, starter: false, standard: false, pro: true },
      { name: 'COGS Calculation', liner: 'Automatic cost of goods sold — know your real margins per period', free: false, starter: false, standard: false, pro: true },
    ],
  },
  {
    id: 'outlet',
    name: 'Outlets',
    description: 'Whether you run 1 outlet or 20, everything stays connected, synchronized and visible. Centralize control without losing local flexibility.',
    icon: Store,
    features: [
      { name: 'Multi-Outlet Management', liner: 'Every branch, one dashboard — total visibility in one place', free: '1 outlet', starter: '1 outlet', standard: 'Unlimited', pro: 'Unlimited' },
      { name: 'Per-Outlet Settings', liner: 'Each location runs its own way — your way', free: '1 outlet', starter: '1 outlet', standard: 'Unlimited', pro: 'Unlimited' },
      { name: 'Outlet-Scoped Reports', liner: 'Compare branch performance instantly — spot winners and fix laggards', free: '1 outlet', starter: '1 outlet', standard: 'Unlimited', pro: 'Unlimited' },
      { name: 'Staff Assignment', liner: 'Control who works where with role-based access per outlet', free: '1 outlet', starter: '1 outlet', standard: 'Unlimited', pro: 'Unlimited' },
      { name: 'Centralized Product Catalog', liner: 'One menu, many outlets — update once, deploy everywhere', free: '1 outlet', starter: '1 outlet', standard: 'Unlimited', pro: 'Unlimited' },
      { name: 'Centralized Menu Updates', liner: 'Push menu changes to all outlets with one click', free: false, starter: false, standard: true, pro: true },
      { name: 'Per-Outlet Pricing', liner: 'Different locations, different prices — you control the strategy', free: false, starter: false, standard: true, pro: true },
      { name: 'Outlet Performance Rankings', liner: 'Rank branches by revenue and growth — drive healthy competition', free: false, starter: false, standard: true, pro: true },
      { name: 'Outlet Groups & Tags', liner: 'Organize outlets by region or type for smarter management', free: false, starter: false, standard: true, pro: true },
      { name: 'Opening Hours Management', liner: 'Customers always know when you\u2019re open — per outlet', free: false, starter: false, standard: true, pro: true },
      { name: 'Per-Outlet Promotions', liner: 'Run location-specific campaigns that target local customers', free: false, starter: false, standard: true, pro: true },
      { name: 'Outlet Comparison Dashboard', liner: 'Side-by-side metrics that reveal what each outlet does best', free: false, starter: false, standard: true, pro: true },
      { name: 'Centralized Staff Directory', liner: 'See all staff across all outlets in one unified view', free: false, starter: false, standard: true, pro: true },
      { name: 'Revenue Consolidation', liner: 'Total revenue across all outlets — one number, full clarity', free: false, starter: false, standard: true, pro: true },
      { name: 'Per-Outlet Branding', liner: 'Different logos and receipts per outlet — maintain local identity', free: false, starter: false, standard: false, pro: true },
      { name: 'Cross-Outlet Transfers', liner: 'Move stock and staff between branches smoothly', free: false, starter: false, standard: false, pro: true },
      { name: 'Regional Manager Roles', liner: 'Give regional managers exactly the access they need', free: false, starter: false, standard: false, pro: true },
      { name: 'Franchise Support Mode', liner: 'Franchise-ready permissions and royalty tracking built in', free: false, starter: false, standard: false, pro: true },
      { name: 'Multi-Timezone Support', liner: 'Outlets in different timezones report correctly — no confusion', free: false, starter: false, standard: false, pro: true },
      { name: 'Outlet Health Monitoring', liner: 'Get alerted the moment any outlet goes offline', free: false, starter: false, standard: false, pro: true },
    ],
  },
];

// ── Capability Mode Data ──────────────────────────────────
interface CapabilityFeature {
  name: string;
  liner: string;
  free: Availability;
  starter: Availability;
  standard: Availability;
  pro: Availability;
}

interface CapabilityGroup {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  primaryEngine?: { label: string; tagline: string };
  features: CapabilityFeature[];
}

const CAPABILITY_GROUPS: CapabilityGroup[] = [
  {
    id: 'operate',
    emoji: '🏪',
    title: 'OPERATE WITHOUT CHAOS',
    subtitle: 'One system. One database. One truth.',
    description: 'Handle dine-in, takeaway and delivery from one unified screen — no confusion, no switching systems, no lost orders during peak hours.',
    features: [
      { name: 'Full Register POS', liner: 'Ring up any order in seconds — no training manual needed', free: true, starter: true, standard: true, pro: true },
      { name: 'Multi-Payment Methods', liner: 'Accept cash, card, e-wallet and QR — whatever customers prefer', free: true, starter: true, standard: true, pro: true },
      { name: 'Product Modifiers', liner: 'Handle any customization without slowing down the line', free: true, starter: true, standard: true, pro: true },
      { name: 'Table Management', liner: 'See your entire floor at a glance — every table, every status', free: true, starter: true, standard: true, pro: true },
      { name: 'Order Notes', liner: 'Never miss a special request from the kitchen again', free: true, starter: true, standard: true, pro: true },
      { name: 'Barcode Scanning', liner: 'Scan and sell — faster than typing, zero mistakes', free: true, starter: true, standard: true, pro: true },
      { name: 'Shift Management', liner: 'Open and close with confidence — every dollar accounted for', free: false, starter: true, standard: true, pro: true },
      { name: 'Receipt Customization', liner: 'Turn every receipt into a branded touchpoint', free: false, starter: true, standard: true, pro: true },
      { name: 'Discount & Promo Codes', liner: 'Reward customers on the spot without calling a manager', free: false, starter: true, standard: true, pro: true },
      { name: 'Customer Lookup', liner: 'Greet regulars by name and reward them instantly', free: false, starter: true, standard: true, pro: true },
      { name: 'Kitchen Printer Integration', liner: 'Orders hit the kitchen the moment you confirm — zero delay', free: false, starter: true, standard: true, pro: true },
      { name: 'Split Bills', liner: 'Split any bill any way without awkward math', free: false, starter: false, standard: true, pro: true },
      { name: 'Parked & Open Orders', liner: 'Pause and resume orders effortlessly for flexible dining', free: false, starter: false, standard: true, pro: true },
      { name: 'Multi-Device Sync', liner: 'Run multiple registers in perfect sync — no conflicts ever', free: false, starter: false, standard: true, pro: true },
      { name: 'Offline Mode', liner: 'Keep selling even when the internet drops — zero downtime', free: false, starter: false, standard: true, pro: true },
      { name: 'Advanced Void & Refund', liner: 'Manager-approved voids with full audit trails prevent fraud', free: false, starter: false, standard: false, pro: true },
      { name: 'Multi-Currency Support', liner: 'Welcome tourists and accept their currency automatically', free: false, starter: false, standard: false, pro: true },
    ],
  },
  {
    id: 'sell-anywhere',
    emoji: '🌍',
    title: 'SELL ANYWHERE, WITHOUT FRICTION',
    subtitle: 'Counter. Tableside. Self-service. Online.',
    description: 'Meet customers wherever they are — your counter, their phone, a kiosk, or your website. Every channel feeds into one unified system.',
    features: [
      { name: 'Super mPOS (Mobile POS)', liner: 'Your phone becomes your register — take orders anywhere', free: false, starter: true, standard: true, pro: true },
      { name: 'QR Order & Pay', liner: 'Customers order from their own phone — zero device cost', free: false, starter: false, standard: true, pro: true },
      { name: 'Self-Service Kiosk', liner: 'Eliminate queues and boost order value by 20–30%', free: false, starter: false, standard: true, pro: true },
      { name: 'Webstore (0% Commission)', liner: 'Your own online store — every dollar stays yours', free: true, starter: true, standard: true, pro: true },
      { name: 'Customer Display Screen', liner: 'Build trust with transparent pricing on a second screen', free: false, starter: false, standard: true, pro: true },
      { name: 'Multi-Language Interface', liner: 'Serve multilingual staff and customers effortlessly', free: false, starter: false, standard: true, pro: true },
      { name: 'NFC Contactless Payment', liner: 'Fast tap-and-go checkout that keeps the line moving', free: false, starter: false, standard: true, pro: true },
      { name: 'Marketplace Integration', liner: 'Connect to GrabFood, ShopeeFood and more from one system', free: 'Add-on', starter: 'Add-on', standard: 'Add-on', pro: 'Add-on' },
    ],
  },
  {
    id: 'increase-revenue',
    emoji: '💰',
    title: 'INCREASE REVENUE AUTOMATICALLY',
    subtitle: 'Every checkout becomes smarter.',
    description: 'AI-powered upsells, cart triggers and campaigns that increase AOV by up to 25% — without training staff or adding manual effort.',
    primaryEngine: { label: 'Sales Booster (Built-In Revenue Automation)', tagline: 'AI-powered upsells, cart triggers and campaigns that increase AOV by up to 25%.' },
    features: [
      { name: 'Sales Booster Engine', liner: 'One engine powering all your automated revenue campaigns', free: false, starter: false, standard: true, pro: true },
      { name: 'Product Badges', liner: 'Eye-catching labels that drive attention to high-margin items', free: true, starter: true, standard: true, pro: true },
      { name: 'Checkout Nudges', liner: 'Smart prompts that increase order size at the perfect moment', free: false, starter: false, standard: true, pro: true },
      { name: 'Upsell Popups', liner: 'Suggest the right add-on at checkout — proven to convert', free: false, starter: false, standard: true, pro: true },
      { name: 'Cart Triggers', liner: 'Automatic rewards when customers hit spend thresholds', free: false, starter: false, standard: true, pro: true },
      { name: 'Happy Hour Automation', liner: 'Prices adjust automatically during slow periods — fill more seats', free: false, starter: false, standard: true, pro: true },
      { name: 'Bundle Deals', liner: 'Pre-built combos that boost revenue and simplify ordering', free: false, starter: false, standard: true, pro: true },
      { name: 'Quantity-Based Discounts', liner: 'Buy-more-save-more deals that move inventory fast', free: false, starter: false, standard: true, pro: true },
      { name: 'Campaign Scheduling', liner: 'Set it and forget it — promotions run on your schedule', free: false, starter: false, standard: true, pro: true },
      { name: 'A/B Testing', liner: 'Test two promotions and keep the one that earns more', free: false, starter: false, standard: false, pro: true },
      { name: 'Campaign Analytics Dashboard', liner: 'See exactly which campaigns are profitable and which aren\u2019t', free: false, starter: false, standard: false, pro: true },
      { name: 'Personalized AI Recommendations', liner: 'AI picks the product each customer is most likely to add', free: false, starter: false, standard: false, pro: true },
    ],
  },
  {
    id: 'repeat-revenue',
    emoji: '🔁',
    title: 'TURN CUSTOMERS INTO REPEAT REVENUE',
    subtitle: 'Own the relationship. Stop losing customers to platforms.',
    description: 'Unified loyalty across POS, QR, Kiosk & Webstore under one phone number — customers earn and redeem everywhere.',
    primaryEngine: { label: 'Built-In Web-Based Loyalty App', tagline: 'Unified loyalty across POS, QR, Kiosk & Webstore under one phone number.' },
    features: [
      { name: 'Built-In Loyalty App', liner: 'One unified loyalty system across every channel you sell on', free: true, starter: true, standard: true, pro: true },
      { name: 'Membership Profile', liner: 'Every customer gets a profile — scanned at any touchpoint', free: true, starter: true, standard: true, pro: true },
      { name: 'Digital Receipt', liner: 'All receipts in one place — no more paper clutter', free: true, starter: true, standard: true, pro: true },
      { name: 'eStamps', liner: 'Digital stamps customers actually use — no more lost cards', free: true, starter: true, standard: true, pro: true },
      { name: 'Vouchers', liner: 'Targeted vouchers that bring customers back at the right time', free: false, starter: false, standard: true, pro: true },
      { name: 'Birthday Rewards', liner: 'Automatic birthday treats that make customers feel special', free: false, starter: false, standard: true, pro: true },
      { name: 'Welcome Bonus', liner: 'First-visit rewards that convert new visitors into regulars', free: false, starter: false, standard: true, pro: true },
      { name: 'Member-Only Pricing', liner: 'Exclusive pricing that makes membership feel valuable', free: false, starter: false, standard: true, pro: true },
      { name: 'Points System', liner: 'Points earned on every channel — one unified balance', free: false, starter: false, standard: false, pro: true },
      { name: 'Referral Program', liner: 'Turn happy customers into your most effective sales channel', free: false, starter: false, standard: false, pro: true },
      { name: 'Tier Status Badges', liner: 'Bronze, Silver, Gold status that motivates higher spending', free: false, starter: false, standard: false, pro: true },
      { name: 'Personalized Offers', liner: 'AI-crafted deals based on what each customer actually buys', free: false, starter: false, standard: false, pro: true },
    ],
  },
  {
    id: 'protect-margins',
    emoji: '📦',
    title: 'PROTECT YOUR MARGINS',
    subtitle: 'Never run out. Never overbuy.',
    description: 'Your kitchen stays organized with digital tickets and auto-routing, while inventory tracking protects every dollar of margin.',
    features: [
      { name: 'Kitchen Display (KDS)', liner: 'Every order visible on screen — no more lost paper tickets', free: true, starter: true, standard: true, pro: true },
      { name: 'Multi-Station Routing', liner: 'Drinks go to bar, food to grill — routed automatically', free: false, starter: false, standard: true, pro: true },
      { name: 'Aging Alerts', liner: 'Amber and red warnings before forgotten orders become complaints', free: false, starter: false, standard: true, pro: true },
      { name: 'Expo Station', liner: 'Your chef sees everything and coordinates final assembly', free: false, starter: false, standard: true, pro: true },
      { name: 'Color-Coded Priority', liner: 'Rush and VIP orders are impossible to miss', free: false, starter: false, standard: true, pro: true },
      { name: 'Recipe Display', liner: 'Prep instructions on screen ensure consistency every time', free: false, starter: false, standard: false, pro: true },
      { name: 'Station Performance Metrics', liner: 'Know exactly which station is fast and which needs help', free: false, starter: false, standard: false, pro: true },
      { name: 'IMS Inventory (Add-on)', liner: 'Full inventory management integrated into your POS', free: false, starter: false, standard: false, pro: true },
      { name: 'Real-Time Stock Tracking', liner: 'Know exactly what you have across every outlet right now', free: false, starter: false, standard: false, pro: true },
      { name: 'Low Stock Alerts', liner: 'Get warned before you run out — not after customers complain', free: false, starter: false, standard: false, pro: true },
      { name: 'Purchase Orders', liner: 'Generate and track POs from the same system you sell from', free: false, starter: false, standard: false, pro: true },
      { name: 'Recipe Costing', liner: 'Know the exact cost of every dish — price with confidence', free: false, starter: false, standard: false, pro: true },
      { name: 'COGS Reporting', liner: 'Automatic cost of goods sold — know your real margins', free: false, starter: false, standard: false, pro: true },
    ],
  },
  {
    id: 'smarter-decisions',
    emoji: '🧠',
    title: 'MAKE SMARTER DECISIONS DAILY',
    subtitle: 'Clarity without spreadsheets.',
    description: 'AI-powered analytics that tell you exactly what to fix, optimize or double down on — no spreadsheets, no guesswork.',
    features: [
      { name: 'Sales Reports', liner: 'See exactly where your revenue comes from — no spreadsheets', free: '3 Months', starter: true, standard: true, pro: true },
      { name: 'AI Insights', liner: 'Ask any question about your business and get instant clarity', free: false, starter: true, standard: true, pro: true },
      { name: 'Product Performance', liner: 'Know which items make money and which drag you down', free: false, starter: false, standard: true, pro: true },
      { name: 'Customer Analytics', liner: 'Understand who your best customers are and how to keep them', free: false, starter: false, standard: true, pro: true },
      { name: 'Menu Engineering Matrix', liner: 'Scientifically optimize your menu for maximum profit', free: false, starter: false, standard: true, pro: true },
      { name: 'Staff Performance Scoring', liner: 'Reward your best staff and coach the rest with real data', free: false, starter: false, standard: true, pro: true },
      { name: 'Multi-Channel Breakdown', liner: 'See which channels drive the most revenue at a glance', free: false, starter: false, standard: true, pro: true },
      { name: 'Revenue Forecasting', liner: 'Plan ahead with AI-predicted revenue for the next 30 days', free: false, starter: false, standard: false, pro: true },
      { name: 'Customer Lifetime Value', liner: 'Know how much each customer is worth over their lifetime', free: false, starter: false, standard: false, pro: true },
      { name: 'Custom Report Builder', liner: 'Build exactly the reports you need — no developer required', free: false, starter: false, standard: false, pro: true },
    ],
  },
  {
    id: 'scale',
    emoji: '🚀',
    title: 'SCALE WITHOUT BREAKING YOUR SYSTEM',
    subtitle: 'Built for your second and third outlet.',
    description: 'Centralize what matters, customize what\u2019s local. Scale from one outlet to twenty without switching systems or migrating data.',
    features: [
      { name: 'Multi-Outlet Management', liner: 'Every branch, one dashboard — total visibility in one place', free: '1 Outlet', starter: '1 Outlet', standard: 'Unlimited', pro: 'Unlimited' },
      { name: 'Per-Outlet Settings', liner: 'Each location runs its own way — your rules, your setup', free: '1 Outlet', starter: '1 Outlet', standard: 'Unlimited', pro: 'Unlimited' },
      { name: 'Centralized Product Catalog', liner: 'One menu, many outlets — update once, deploy everywhere', free: '1 Outlet', starter: '1 Outlet', standard: 'Unlimited', pro: 'Unlimited' },
      { name: 'Per-Outlet Pricing', liner: 'Different locations, different prices — you control the strategy', free: false, starter: false, standard: true, pro: true },
      { name: 'Revenue Consolidation', liner: 'Total revenue across all outlets in one clear number', free: false, starter: false, standard: true, pro: true },
      { name: 'Outlet Performance Rankings', liner: 'Rank branches by revenue and growth — drive healthy competition', free: false, starter: false, standard: true, pro: true },
      { name: 'Franchise Mode', liner: 'Franchise-ready permissions and royalty tracking built in', free: false, starter: false, standard: false, pro: true },
      { name: 'Regional Manager Roles', liner: 'Give regional managers exactly the access they need', free: false, starter: false, standard: false, pro: true },
      { name: 'Multi-Timezone Support', liner: 'Outlets in different timezones report correctly — no confusion', free: false, starter: false, standard: false, pro: true },
    ],
  },
  {
    id: 'support',
    emoji: '🤝',
    title: 'BUILT WITH YOU. NOT JUST FOR YOU.',
    subtitle: 'Infrastructure + Human Backing.',
    description: 'We don\u2019t just give you software — we give you a team that cares about your success.',
    features: [
      { name: 'Standard Support', liner: 'Help when you need it — email, chat and knowledge base', free: true, starter: true, standard: true, pro: true },
      { name: 'Priority Support', liner: 'Jump the queue — faster response when it matters most', free: false, starter: false, standard: true, pro: true },
      { name: 'Dedicated Success Manager', liner: 'A named person who knows your business and helps you grow', free: false, starter: false, standard: false, pro: true },
      { name: '60-Day Money Back', liner: 'Try risk-free — full refund if it\u2019s not right for you', free: true, starter: true, standard: true, pro: true },
    ],
  },
];

// Tier positioning descriptions for capability mode footer
const CAPABILITY_TIER_POSITIONING: { key: 'free' | 'starter' | 'standard' | 'pro'; label: string; description: string }[] = [
  { key: 'free', label: 'FREE', description: 'Validate your concept without risk.' },
  { key: 'starter', label: 'STARTER', description: 'Take control of daily operations.' },
  { key: 'standard', label: 'STANDARD', description: 'Automate revenue and prepare to scale.' },
  { key: 'pro', label: 'PRO', description: 'Optimize margins and run multi-branch operations like a chain.' },
];

// ── Feature Showcase (Bento Grid) ─────────────────────────
const BENTO_ORDER = ['aihub', 'pos', 'mpos', 'kiosk', 'app', 'qr', 'tablet', 'web', 'live', 'kds', 'qds', 'sboost', 'ims', 'outlet'];

const SHOWCASE: Record<string, {
  headline: string;
  span: string;
  gradient: string;
  iconColor: string;
  benefits: string[];
}> = {
  aihub: {
    headline: 'Your 24/7 Business Brain',
    span: 'md:col-span-2 md:row-span-2',
    gradient: 'from-violet-500/20 to-blue-500/20',
    iconColor: 'text-violet-400',
    benefits: [
      'Finally understand your business without drowning in spreadsheets',
      'Ask any question in plain language and get instant answers about performance',
      'AI detects revenue opportunities and warns you about problems before they hit',
    ],
  },
  pos: {
    headline: 'Total Control at the Counter',
    span: 'md:col-span-2',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-400',
    benefits: [
      'Your operations stay calm — even during peak hour chaos',
      'Runs on any browser — no app downloads, no proprietary hardware lock-in',
      'Dine-in, takeaway and delivery unified in one screen with zero confusion',
    ],
  },
  mpos: {
    headline: 'Freedom to Sell Anywhere',
    span: '',
    gradient: 'from-cyan-500/20 to-teal-500/20',
    iconColor: 'text-cyan-400',
    benefits: [
      'Your phone becomes your register — no extra hardware investment',
      'Perfect for events, pop-ups, food trucks and tableside service',
      'Queue management and barcode scanning from the phone in your pocket',
    ],
  },
  kiosk: {
    headline: 'Sell More Without Hiring More',
    span: '',
    gradient: 'from-amber-500/20 to-orange-500/20',
    iconColor: 'text-amber-400',
    benefits: [
      'Customers spend 20\u201330% more when they order themselves',
      'Eliminate queues during peak hours — serve more with fewer staff',
      'Turn every customer into a higher-spending customer automatically',
    ],
  },
  app: {
    headline: 'Loyalty That Actually Works',
    span: 'md:col-span-2',
    gradient: 'from-orange-500/20 to-pink-500/20',
    iconColor: 'text-orange-400',
    benefits: [
      'One phone number earns rewards across POS, Kiosk, QR and Webstore',
      'No more lost paper cards — stamps, vouchers and points in one app',
      'Customers keep coming back because rewards feel effortless',
    ],
  },
  qr: {
    headline: 'Zero Hardware. Maximum Efficiency.',
    span: '',
    gradient: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-green-400',
    benefits: [
      'Customers order from their own phone — you invest nothing in devices',
      'Reduce staff workload by up to 40% with self-service ordering',
      'Faster table turnover means more revenue per seat per hour',
    ],
  },
  tablet: {
    headline: 'Premium Experience, Zero Staff Effort',
    span: '',
    gradient: 'from-rose-500/20 to-pink-500/20',
    iconColor: 'text-rose-400',
    benefits: [
      'Guests explore your menu at their own pace — no pressure, bigger orders',
      'Service requests handled digitally — water, cutlery, help — one tap',
      'Idle screens become promotion displays that sell for you 24/7',
    ],
  },
  web: {
    headline: 'Your Revenue. Zero Commission.',
    span: '',
    gradient: 'from-sky-500/20 to-blue-500/20',
    iconColor: 'text-sky-400',
    benefits: [
      'Stop giving 25\u201330% of every order to marketplace platforms',
      'Your brand, your domain, your customer relationship — fully controlled',
      'Accept orders 24/7 with pickup and delivery built in',
    ],
  },
  live: {
    headline: 'Calm Your Venue Instantly',
    span: '',
    gradient: 'from-indigo-500/20 to-violet-500/20',
    iconColor: 'text-indigo-400',
    benefits: [
      'Customers see their order status live — no anxiety, no crowding the counter',
      'Queue announcements with sound alerts keep everything moving smoothly',
      'Every channel\u2019s orders appear on one unified big screen',
    ],
  },
  kds: {
    headline: 'Your Kitchen, Finally Organized',
    span: '',
    gradient: 'from-orange-500/20 to-red-500/20',
    iconColor: 'text-orange-400',
    benefits: [
      'Drinks go to bar, food to grill — automatically routed, zero confusion',
      'Aging alerts catch delays before they become customer complaints',
      'No more lost paper tickets — every order tracked digitally',
    ],
  },
  qds: {
    headline: 'No More Shouting',
    span: '',
    gradient: 'from-fuchsia-500/20 to-purple-500/20',
    iconColor: 'text-fuchsia-400',
    benefits: [
      'Voice announcements call queue numbers automatically — staff stay focused',
      'Multi-prefix queues keep different counters organized effortlessly',
      'Customers know exactly how long they\u2019ll wait — reducing frustration',
    ],
  },
  sboost: {
    headline: 'Automated Revenue Engine',
    span: 'md:col-span-2',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-400',
    benefits: [
      'Every cart becomes an opportunity — smart upsells at the right moment',
      'Increase average order value by up to 25% without training staff',
      'Set it and forget it — promotions run, expire and report automatically',
    ],
  },
  ims: {
    headline: 'Never Run Out. Never Overbuy.',
    span: '',
    gradient: 'from-teal-500/20 to-cyan-500/20',
    iconColor: 'text-teal-400',
    benefits: [
      'Stop discovering stock problems too late — alerts before they cost you',
      'Track every ingredient across every outlet in real time',
      'Protect your profit margins automatically with smart reordering',
    ],
  },
  outlet: {
    headline: 'Scale Without Losing Control',
    span: '',
    gradient: 'from-lime-500/20 to-green-500/20',
    iconColor: 'text-lime-400',
    benefits: [
      'Whether you run 1 or 20 outlets — everything stays connected and visible',
      'Centralize what matters, customize what\u2019s local — your rules',
      'Compare branch performance instantly and drive healthy competition',
    ],
  },
};

// ── Masonry modal data ────────────────────────────────────
const MODULE_HIGHLIGHTS: Record<string, { stat: string; label: string }[]> = {
  aihub: [{ stat: '24/7', label: 'AI Monitoring' }, { stat: '11', label: 'Analytics Tools' }],
  pos: [{ stat: '<1s', label: 'Checkout Speed' }, { stat: '7+', label: 'Payment Methods' }],
  mpos: [{ stat: '$0', label: 'Extra Hardware' }, { stat: '∞', label: 'Mobility' }],
  kiosk: [{ stat: '+30%', label: 'Higher AOV' }, { stat: '-50%', label: 'Queue Time' }],
  qr: [{ stat: '$0', label: 'Device Cost' }, { stat: '-40%', label: 'Staff Load' }],
  tablet: [{ stat: '5★', label: 'Guest Experience' }, { stat: '24/7', label: 'Promo Display' }],
  web: [{ stat: '0%', label: 'Commission' }, { stat: '24/7', label: 'Always Open' }],
  live: [{ stat: 'Live', label: 'Real-Time' }, { stat: '4+', label: 'Channels' }],
  qds: [{ stat: 'Auto', label: 'Voice Call' }, { stat: 'A-Z', label: 'Multi-Prefix' }],
  kds: [{ stat: '0', label: 'Paper Tickets' }, { stat: 'Auto', label: 'Routing' }],
  app: [{ stat: '1', label: 'Phone Number' }, { stat: '5', label: 'Reward Types' }],
  sboost: [{ stat: '+25%', label: 'AOV Boost' }, { stat: 'Auto', label: 'Triggers' }],
  ims: [{ stat: 'Live', label: 'Stock Levels' }, { stat: 'Auto', label: 'Alerts' }],
  outlet: [{ stat: '∞', label: 'Branches' }, { stat: '1', label: 'Dashboard' }],
};

const MASONRY_SPANS = [
  'col-span-2 row-span-2', '', 'row-span-2', 'col-span-2', '', '',
  'row-span-2', '', 'col-span-2', '', '', 'row-span-2',
  'col-span-2', '', '', 'col-span-2', '',
];

const MASONRY_BG = [
  'bg-white/60', 'bg-white/50', 'bg-white/70', 'bg-white/55',
  'bg-white/45', 'bg-white/65', 'bg-white/50', 'bg-white/60',
  'bg-white/70', 'bg-white/55', 'bg-white/45', 'bg-white/65',
  'bg-white/55', 'bg-white/50', 'bg-white/60', 'bg-white/45', 'bg-white/70',
];

const VISUAL_INDICES = new Set([0, 2, 6, 11]);

const BENTO_GREENS = [
  'from-white/60 to-gray-100/60', 'from-white/50 to-gray-50/50',
  'from-gray-50/60 to-white/60', 'from-white/55 to-gray-100/55',
  'from-white/65 to-gray-50/65', 'from-gray-100/50 to-white/50',
  'from-white/50 to-gray-50/50', 'from-white/60 to-gray-100/60',
  'from-gray-50/50 to-white/50', 'from-white/55 to-gray-50/55',
  'from-white/60 to-gray-100/60', 'from-gray-50/55 to-white/55',
  'from-white/55 to-gray-50/55', 'from-white/50 to-gray-100/50',
];

const BENTO_ICONS = [
  'text-gray-600', 'text-gray-500', 'text-gray-600', 'text-gray-500',
  'text-gray-600', 'text-gray-500', 'text-gray-600', 'text-gray-500',
  'text-gray-600', 'text-gray-500', 'text-gray-600', 'text-gray-500',
  'text-gray-600', 'text-gray-500',
];

// ── Helpers ─────────────────────────────────────────────────
function renderAvailability(value: Availability, currency: 'USD' | 'MYR', addonMyrMap: Record<string, number> = ADDON_MYR) {
  if (value === true) {
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-black mx-auto">
        <Check className="w-3 h-3 text-white" />
      </span>
    );
  }
  if (value === false) {
    return <X className="w-3.5 h-3.5 text-gray-300 mx-auto" />;
  }
  // addon price string — convert if MYR; non-price strings shown as-is
  if (value.startsWith('$')) {
    const raw = value.slice(1);
    const symbol = currency === 'USD' ? '$' : 'RM';
    const display = currency === 'USD' ? raw : (addonMyrMap[raw] ?? Math.round(parseFloat(raw) * 4.5));
    return <span className="text-[10px] font-semibold text-orange-600 uppercase tracking-wider">+{symbol}{display}/mth</span>;
  }
  return <span className="text-[10px] font-semibold text-gray-700 uppercase tracking-wider">{value}</span>;
}

// ── Component ──────────────────────────────────────────────
const PricingSection: React.FC = () => {
  const { config, loading: configLoading } = usePricingPageConfig();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');
  const [currency, setCurrency] = useState<'USD' | 'MYR'>('MYR');
  const [viewMode, setViewMode] = useState<'module' | 'capability'>('module');
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['aihub', 'pos']));
  const [expandedCapGroups, setExpandedCapGroups] = useState<Set<string>>(new Set(['operate', 'sell-anywhere']));
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  // Derive pricing data from config (dynamic) instead of hard-coded constants
  const dynamicPrices = useMemo(() => ({
    MONTHLY_USD: config.tierPricing.monthly,
    YEARLY_USD: config.tierPricing.yearly,
    MONTHLY_MYR: config.tierPricingMYR.monthly,
    YEARLY_MYR: config.tierPricingMYR.yearly,
  }), [config]);
  const dynamicAddonMYR = config.addonMYR;
  const dynamicTierMeta = config.tierMeta;
  const dynamicTierSummary = config.tierSummary;
  const dynamicModules = useMemo(() => config.modules.map(m => ({
    ...m,
    icon: resolveIcon(m.iconName),
  })), [config.modules]);
  const dynamicCapGroups = config.capabilityGroups;
  const dynamicCapTierPos = config.capabilityTierPositioning;
  const dynamicShowcase = config.showcase;
  const dynamicHighlights = config.moduleHighlights;
  const dynamicBentoOrder = config.bentoOrder;

  const showTooltip = useCallback((e: React.MouseEvent, text: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ text, x: rect.right + 8, y: rect.top + rect.height / 2 });
  }, []);

  const hideTooltip = useCallback(() => setTooltip(null), []);
  const prices = currency === 'USD'
    ? (billing === 'monthly' ? dynamicPrices.MONTHLY_USD : dynamicPrices.YEARLY_USD)
    : (billing === 'monthly' ? dynamicPrices.MONTHLY_MYR : dynamicPrices.YEARLY_MYR);
  const monthlyPrices = currency === 'USD' ? dynamicPrices.MONTHLY_USD : dynamicPrices.MONTHLY_MYR;
  const currencySymbol = currency === 'USD' ? '$' : 'RM';

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedModules(new Set(dynamicModules.map((m) => m.id)));
  };

  const collapseAll = () => {
    setExpandedModules(new Set());
  };

  const toggleCapGroup = (id: string) => {
    setExpandedCapGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAllCap = () => {
    setExpandedCapGroups(new Set(dynamicCapGroups.map((g) => g.id)));
  };

  const collapseAllCap = () => {
    setExpandedCapGroups(new Set());
  };

  const COL_GRID = 'grid-cols-[minmax(170px,1fr)_repeat(4,minmax(80px,1fr))_minmax(80px,1fr)]';

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 mb-8">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
        @keyframes tilePop { from { opacity: 0; transform: scale(0.8) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}</style>
      {/* Hero — emotional positioning */}
      <div className="text-center mb-16">
        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-emerald-600 mb-3">All-in-One POS Solutions</p>
        <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight leading-tight">
          Most POS Systems Record Sales.<br />
          <span className="text-emerald-600">QPOS Increases Them.</span>
        </h2>
        <p className="text-sm text-gray-500 mt-4 max-w-xl mx-auto leading-relaxed">
          One unified system connecting POS, Kiosk, QR, Webstore, Loyalty and AI — so you operate smarter, sell more, and scale without stress.
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6">
          {['Reduce staff dependency', 'Increase average order value', 'Eliminate commission fees', 'Automate promotions', 'Scale across outlets'].map((item) => (
            <span key={item} className="text-[10px] text-gray-600 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* "The Cost of Staying Basic" — pain section */}
      <div className="mb-12 max-w-2xl mx-auto">
        <h3 className="text-lg font-bold text-black text-center mb-4">The Cost of Staying Basic</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            'Paying 25–30% commission to marketplaces',
            'Hiring extra staff to manage queues',
            'Manual reporting and spreadsheet chaos',
            'Missed upsell opportunities every day',
            'Stock wastage from poor visibility',
            'Disconnected loyalty programs',
          ].map((pain) => (
            <div key={pain} className="flex items-start gap-2 p-3 bg-red-50/60 border border-red-100 rounded-lg">
              <X className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
              <span className="text-[10px] text-gray-700 leading-tight">{pain}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-sm font-semibold text-black mt-4">QPOS replaces all of this with one unified system.</p>
      </div>

      {/* Pricing header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 px-1">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold text-black tracking-tight">Choose Your Plan</h2>
          <p className="text-sm text-gray-500 mt-1">From validation to scale — pick the tier that matches your stage</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Currency toggle */}
          <div className="inline-flex items-center border border-gray-300 rounded-full p-0.5">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-full transition-all duration-300 ${
                currency === 'USD' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
              }`}
            >
              USD
            </button>
            <button
              onClick={() => setCurrency('MYR')}
              className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-full transition-all duration-300 ${
                currency === 'MYR' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
              }`}
            >
              MYR
            </button>
          </div>
          {/* Billing toggle */}
          <div className="inline-flex items-center border border-black rounded-full p-0.5">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-full transition-all duration-300 ${
                billing === 'monthly' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-full transition-all duration-300 ${
                billing === 'yearly' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
              }`}
            >
              Yearly
              <span className="ml-1 text-[8px] text-emerald-600 font-semibold">-20%</span>
            </button>
          </div>
        </div>
      </div>

      {/* View mode toggle + Expand / Collapse all */}
      <div className="flex items-center justify-between mb-2 px-1">
        {/* View mode toggle */}
        <div className="inline-flex items-center border border-gray-300 rounded-full p-0.5">
          <button
            onClick={() => setViewMode('module')}
            className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-full transition-all duration-300 ${
              viewMode === 'module' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
            }`}
          >
            By Module
          </button>
          <button
            onClick={() => setViewMode('capability')}
            className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-full transition-all duration-300 ${
              viewMode === 'capability' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
            }`}
          >
            By Capability
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={viewMode === 'module' ? expandAll : expandAllCap} className="text-[9px] uppercase tracking-widest text-gray-500 hover:text-black transition-colors font-medium">Expand All</button>
          <span className="text-gray-300">|</span>
          <button onClick={viewMode === 'module' ? collapseAll : collapseAllCap} className="text-[9px] uppercase tracking-widest text-gray-500 hover:text-black transition-colors font-medium">Collapse All</button>
        </div>
      </div>

      {/* ═══════ CAPABILITY MODE TABLE ═══════ */}
      {viewMode === 'capability' && (
        <div id="pricing-table" className="overflow-x-auto">
          <div className="min-w-[600px] border border-gray-300 bg-white divide-y divide-gray-200">

            {/* ── Capability table header ── */}
            <div className={`grid grid-cols-[minmax(170px,1fr)_repeat(4,minmax(80px,1fr))] sticky top-0 z-20 bg-white border-b border-gray-300 shadow-sm`}>
              <div className="sticky left-0 z-30 bg-white px-4 py-4 border-r border-gray-100 flex items-end">
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Capabilities</span>
              </div>
              {dynamicTierMeta.map((tier) => {
                const price = prices[tier.key as keyof typeof prices];
                const isPopular = tier.key === 'standard';
                const summary = dynamicTierSummary[tier.key];
                return (
                  <div
                    key={tier.key}
                    className={`text-center px-2 py-4 ${isPopular ? 'bg-black text-white border-x-2 border-t-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.25)]' : ''}`}
                  >
                    {isPopular && (
                      <p className="text-[7px] font-bold uppercase tracking-widest text-emerald-400 mb-1">Recommended</p>
                    )}
                    <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase">{tier.label}</h3>
                    <p className={`text-[8px] tracking-wider mt-0.5 text-gray-400`}>{tier.positioning}</p>
                    <div className="my-1.5">
                      {billing === 'yearly' && tier.key !== 'free' && (
                        <div className={`text-[10px] line-through ${isPopular ? 'text-gray-500' : 'text-gray-400'}`}>
                          {currencySymbol}{monthlyPrices[tier.key]}
                        </div>
                      )}
                      <div className="flex items-baseline justify-center gap-0.5">
                        <span className={`text-[9px] ${isPopular ? 'text-gray-400' : 'text-gray-500'}`}>{currencySymbol}</span>
                        <span className="text-2xl font-black">{price === 0 ? '0' : price}</span>
                        <span className={`text-[9px] ${isPopular ? 'text-gray-400' : 'text-gray-500'}`}>/mo</span>
                      </div>
                    </div>
                    {summary && (
                      <div className={`text-left mx-auto max-w-[120px] mb-2 space-y-0.5 ${isPopular ? 'text-gray-300' : 'text-gray-400'}`}>
                        {summary.bullets.map((b, i) => (
                          <p key={i} className="text-[7px] leading-tight flex items-start gap-1">
                            <span className={`mt-[3px] w-1 h-1 rounded-full flex-shrink-0 ${isPopular ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                            {b}
                          </p>
                        ))}
                      </div>
                    )}
                    {summary?.constraint && (
                      <p className="text-[7px] text-orange-500 font-medium mb-1.5">{summary.constraint}</p>
                    )}
                    {summary?.revenueFrame && (
                      <p className={`text-[7px] font-medium mb-1.5 ${isPopular ? 'text-emerald-400' : 'text-gray-400'}`}>{summary.revenueFrame}</p>
                    )}
                    <button
                      className={`mx-auto block w-full max-w-[100px] py-1.5 text-[8px] font-bold uppercase tracking-widest border transition-all duration-300 ${
                        isPopular
                          ? 'bg-white text-black border-white hover:bg-gray-200'
                          : 'bg-black text-white border-black hover:bg-gray-900'
                      }`}
                    >
                      {price === 0 ? 'Get Started' : 'Select This'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* ── Capability group rows ── */}
            {dynamicCapGroups.map((group) => {
              const isExpanded = expandedCapGroups.has(group.id);
              return (
                <div key={group.id}>
                  {/* Group header */}
                  <button
                    onClick={() => toggleCapGroup(group.id)}
                    className={`w-full grid grid-cols-[minmax(170px,1fr)_repeat(4,minmax(80px,1fr))] items-center hover:bg-gray-50 transition-colors`}
                  >
                    <div className="sticky left-0 z-10 bg-white px-4 py-3 flex items-center gap-2 text-left border-r border-gray-100">
                      <span className="text-base flex-shrink-0">{group.emoji}</span>
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-black uppercase tracking-wider truncate block">{group.title}</span>
                        <span className="text-[9px] text-gray-400 italic block truncate">{group.subtitle}</span>
                      </div>
                      {isExpanded
                        ? <ChevronUp className="w-3.5 h-3.5 text-gray-400 ml-auto flex-shrink-0" />
                        : <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-auto flex-shrink-0" />}
                    </div>
                    {dynamicTierMeta.map((tier) => {
                      const anyIncluded = group.features.some((f: any) => f[tier.key] !== false);
                      return (
                        <div key={tier.key} className={`text-center py-3 ${tier.key === 'standard' ? 'border-x-2 border-emerald-500 bg-emerald-50/40' : ''}`}>
                          {anyIncluded
                            ? <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-black mx-auto"><Check className="w-3 h-3 text-white" /></span>
                            : <X className="w-3.5 h-3.5 text-gray-300 mx-auto" />}
                        </div>
                      );
                    })}
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div>
                      {/* Description row */}
                      <div className="border-t border-gray-100 bg-gray-50 px-6 py-3">
                        <p className="text-[11px] text-gray-600 leading-relaxed italic">{group.description}</p>
                      </div>
                      {/* Primary engine callout */}
                      {group.primaryEngine && (
                        <div className="border-t border-gray-100 bg-emerald-50/50 px-6 py-2.5">
                          <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                            Primary Engine: {group.primaryEngine.label}
                          </p>
                          <p className="text-[10px] text-emerald-600 mt-0.5">{group.primaryEngine.tagline}</p>
                        </div>
                      )}
                      {/* Feature rows */}
                      {group.features.map((feat, idx) => {
                        const isBold = feat.name.startsWith('Sales Booster') || feat.name.startsWith('Built-In Loyalty');
                        return (
                          <div key={idx} className={`grid grid-cols-[minmax(170px,1fr)_repeat(4,minmax(80px,1fr))] items-center border-t border-gray-100`}>
                            <div className="sticky left-0 z-10 bg-gray-50 px-4 py-2.5 pl-10 border-r border-gray-100">
                              <div className="flex items-center gap-1.5">
                                <p className={`text-[11px] ${isBold ? 'font-bold text-black' : 'font-semibold text-gray-800'}`}>{feat.name}</p>
                                <Info
                                  className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 cursor-help flex-shrink-0 transition-colors"
                                  onMouseEnter={(e) => showTooltip(e, feat.liner)}
                                  onMouseLeave={hideTooltip}
                                />
                              </div>
                            </div>
                            {dynamicTierMeta.map((tier) => (
                              <div key={tier.key} className={`text-center py-2.5 ${tier.key === 'standard' ? 'border-x-2 border-emerald-500 bg-emerald-50/40' : ''}`}>
                                {renderAvailability((feat as any)[tier.key], currency, dynamicAddonMYR)}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* ── Tier positioning footer ── */}
            <div className="grid grid-cols-[minmax(170px,1fr)_repeat(4,minmax(80px,1fr))] border-t border-gray-200 bg-gray-50">
              <div className="sticky left-0 z-10 bg-gray-50 px-4 py-4 border-r border-gray-100">
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Tier Summary</span>
              </div>
              {dynamicCapTierPos.map((tier) => (
                <div key={tier.key} className={`text-center px-3 py-4 ${tier.key === 'standard' ? 'border-x-2 border-emerald-500 bg-emerald-50/40' : ''}`}>
                  <p className="text-[10px] font-bold text-black uppercase tracking-wider">{tier.label}</p>
                  <p className="text-[9px] text-gray-500 mt-1 leading-snug">{tier.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════ MODULE MODE TABLE ═══════ */}
      {viewMode === 'module' && <div id="pricing-table" className="overflow-x-auto">
        <div className="min-w-[680px] border border-gray-300 bg-white divide-y divide-gray-200">

          {/* ── Table header: pricing integrated — sticky on scroll ── */}
          <div className={`grid ${COL_GRID} sticky top-0 z-20 bg-white border-b border-gray-300 shadow-sm`}>
            <div className="sticky left-0 z-30 bg-white px-4 py-4 border-r border-gray-100 flex items-end">
              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Features</span>
            </div>
            {dynamicTierMeta.map((tier) => {
              const price = prices[tier.key as keyof typeof prices];
              const isPopular = tier.key === 'standard';
              const isPro = tier.key === 'pro';
              const summary = dynamicTierSummary[tier.key];
              return (
                <div
                  key={tier.key}
                  className={`text-center px-2 py-4 ${isPopular ? 'bg-black text-white border-x-2 border-t-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.25)]' : ''}`}
                >
                  {isPopular && (
                    <p className="text-[7px] font-bold uppercase tracking-widest text-emerald-400 mb-1">Recommended for Growing Restaurants</p>
                  )}
                  <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase">{tier.label}</h3>
                  <p className={`text-[8px] tracking-wider mt-0.5 ${isPopular ? 'text-gray-400' : 'text-gray-400'}`}>{tier.positioning}</p>
                  <div className="my-1.5">
                    {billing === 'yearly' && tier.key !== 'free' && (
                      <div className={`text-[10px] line-through ${isPopular ? 'text-gray-500' : 'text-gray-400'}`}>
                        {currencySymbol}{monthlyPrices[tier.key]}
                      </div>
                    )}
                    <div className="flex items-baseline justify-center gap-0.5">
                      <span className={`text-[9px] ${isPopular ? 'text-gray-400' : 'text-gray-500'}`}>{currencySymbol}</span>
                      <span className="text-2xl font-black">{price === 0 ? '0' : price}</span>
                      <span className={`text-[9px] ${isPopular ? 'text-gray-400' : 'text-gray-500'}`}>/mo</span>
                    </div>
                  </div>
                  {/* Tier summary bullets */}
                  {summary && (
                    <div className={`text-left mx-auto max-w-[120px] mb-2 space-y-0.5 ${isPopular ? 'text-gray-300' : 'text-gray-400'}`}>
                      {summary.bullets.map((b, i) => (
                        <p key={i} className="text-[7px] leading-tight flex items-start gap-1">
                          <span className={`mt-[3px] w-1 h-1 rounded-full flex-shrink-0 ${isPopular ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                          {b}
                        </p>
                      ))}
                    </div>
                  )}
                  {/* FREE friction constraint */}
                  {summary?.constraint && (
                    <p className="text-[7px] text-orange-500 font-medium mb-1.5">{summary.constraint}</p>
                  )}
                  {/* PRO elite label */}
                  {summary?.eliteLabel && (
                    <p className="text-[7px] font-bold uppercase tracking-widest text-amber-500 mb-1.5">{summary.eliteLabel}</p>
                  )}
                  {/* Revenue framing */}
                  {summary?.revenueFrame && (
                    <p className={`text-[7px] font-medium mb-1.5 ${isPopular ? 'text-emerald-400' : 'text-gray-400'}`}>{summary.revenueFrame}</p>
                  )}
                  <button
                    className={`mx-auto block w-full max-w-[100px] py-1.5 text-[8px] font-bold uppercase tracking-widest border transition-all duration-300 ${
                      isPopular
                        ? 'bg-white text-black border-white hover:bg-gray-200'
                        : isPro
                        ? 'bg-black text-white border-black hover:bg-gray-900'
                        : 'bg-black text-white border-black hover:bg-gray-900'
                    }`}
                  >
                    {price === 0 ? 'Get Started' : 'Select This'}
                  </button>
                </div>
              );
            })}
            {/* ENTERPRISE anchor column */}
            <div className="text-center px-2 py-4 bg-gray-50 border-l border-gray-200">
              <Building2 className="w-4 h-4 mx-auto text-gray-400 mb-1" />
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-black">ENTERPRISE</h3>
              <p className="text-[8px] tracking-wider mt-0.5 text-gray-400">Expanding Across Regions</p>
              <div className="my-1.5">
                <span className="text-lg font-black text-black">Custom</span>
              </div>
              <div className="text-left mx-auto max-w-[120px] mb-2 space-y-0.5 text-gray-400">
                <p className="text-[7px] leading-tight flex items-start gap-1"><span className="mt-[3px] w-1 h-1 rounded-full flex-shrink-0 bg-gray-300" />Dedicated onboarding</p>
                <p className="text-[7px] leading-tight flex items-start gap-1"><span className="mt-[3px] w-1 h-1 rounded-full flex-shrink-0 bg-gray-300" />Custom integrations</p>
                <p className="text-[7px] leading-tight flex items-start gap-1"><span className="mt-[3px] w-1 h-1 rounded-full flex-shrink-0 bg-gray-300" />Priority support & SLA</p>
                <p className="text-[7px] leading-tight flex items-start gap-1"><span className="mt-[3px] w-1 h-1 rounded-full flex-shrink-0 bg-gray-300" />Multi-region deployment</p>
              </div>
              <button className="mx-auto block w-full max-w-[100px] py-1.5 text-[8px] font-bold uppercase tracking-widest border border-black text-black hover:bg-black hover:text-white transition-all duration-300">
                Contact Us
              </button>
            </div>
          </div>

          {/* ── Module rows ── */}
          {dynamicModules.map((mod) => {
            const isExpanded = expandedModules.has(mod.id);
            const Icon = mod.icon;
            return (
              <div key={mod.id}>
                {/* Module header */}
                <button
                  onClick={() => toggleModule(mod.id)}
                  className={`w-full grid ${COL_GRID} items-center hover:bg-gray-50 transition-colors`}
                >
                  <div className="sticky left-0 z-10 bg-white px-4 py-3 flex items-center gap-2 text-left border-r border-gray-100">
                    <Icon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    <span className="text-[11px] font-bold text-black uppercase tracking-wider truncate">{mod.name}</span>
                    {isExpanded
                      ? <ChevronUp className="w-3.5 h-3.5 text-gray-400 ml-auto flex-shrink-0" />
                      : <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-auto flex-shrink-0" />}
                  </div>
                  {dynamicTierMeta.map((tier) => {
                    const addonPrice = mod.tierAddon?.[tier.key];
                    const anyIncluded = mod.features.some((f: any) => f[tier.key] !== false);
                    return (
                      <div key={tier.key} className={`text-center py-3 ${tier.key === 'standard' ? 'border-x-2 border-emerald-500 bg-emerald-50/40' : ''}`}>
                        {addonPrice
                          ? renderAvailability(addonPrice, currency, dynamicAddonMYR)
                          : anyIncluded
                          ? <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-black mx-auto"><Check className="w-3 h-3 text-white" /></span>
                          : <X className="w-3.5 h-3.5 text-gray-300 mx-auto" />}
                      </div>
                    );
                  })}
                  {/* Enterprise column — always check */}
                  <div className="text-center py-3 bg-gray-50 border-l border-gray-200">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-black mx-auto"><Check className="w-3 h-3 text-white" /></span>
                  </div>
                </button>

                {/* Expanded feature rows */}
                {isExpanded && (
                  <div>
                    {/* Full-width description row */}
                    <div className="border-t border-gray-100 bg-gray-50 px-6 py-3">
                      <p className="text-[11px] text-gray-600 leading-relaxed italic">{mod.description}</p>
                    </div>
                    {mod.features.map((feat, idx) => (
                      <div key={idx} className={`grid ${COL_GRID} items-center border-t border-gray-100`}>
                        <div className="sticky left-0 z-10 bg-gray-50 px-4 py-2.5 pl-10 border-r border-gray-100">
                          <div className="flex items-center gap-1.5">
                            <p className="text-[11px] font-semibold text-gray-800">{feat.name}</p>
                            <Info
                              className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 cursor-help flex-shrink-0 transition-colors"
                              onMouseEnter={(e) => showTooltip(e, feat.liner)}
                              onMouseLeave={hideTooltip}
                            />
                          </div>
                        </div>
                        {dynamicTierMeta.map((tier) => (
                          <div key={tier.key} className={`text-center py-2.5 ${tier.key === 'standard' ? 'border-x-2 border-emerald-500 bg-emerald-50/40' : ''}`}>
                            {renderAvailability((feat as any)[tier.key], currency, dynamicAddonMYR)}
                          </div>
                        ))}
                        {/* Enterprise column — always included */}
                        <div className="text-center py-2.5 bg-gray-50 border-l border-gray-200">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-black mx-auto">
                            <Check className="w-3 h-3 text-white" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>}

      {/* Money back guarantee */}
      <div className="text-center mt-8 mb-4">
        <p className="text-sm font-bold text-black tracking-wide">60 Days Money Back Guaranteed*</p>
      </div>

      {/* Footer note */}
      <div className="text-center">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider">
          All prices in {currency}. Add-on prices shown where applicable. Cancel anytime.
        </p>
      </div>

      {/* "Why We're Different" — 4 pillars */}
      <div className="mt-20 mb-12">
        <div className="text-center mb-8">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-emerald-600 mb-2">Why We&apos;re Different</p>
          <h2 className="text-3xl font-black text-black tracking-tight">Built Different. Designed to Grow.</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-16">
          {[
            { title: 'One Database', sub: 'All Channels Connected', desc: 'POS, Kiosk, QR, Webstore, Loyalty — one system, one source of truth.' },
            { title: 'AI Built-In', sub: 'Not an Afterthought', desc: 'Every insight, recommendation and forecast powered by AI from day one.' },
            { title: 'Revenue Automation', sub: 'Not Just Recording', desc: 'Upsells, nudges and boosters that increase your sales automatically.' },
            { title: 'Multi-Outlet Ready', sub: 'From Day One', desc: 'Scale from one outlet to twenty without switching systems or migrating data.' },
          ].map((pillar) => (
            <div key={pillar.title} className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <h4 className="text-xs font-bold text-black uppercase tracking-wider">{pillar.title}</h4>
              <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">{pillar.sub}</p>
              <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Feature Showcase — Bento Grid ── */}
      <div className="mb-12">
        <div className="text-center mb-10">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-emerald-600 mb-2">14 Modules. One System.</p>
          <h2 className="text-3xl font-black text-black tracking-tight">Your Escape from Chaos</h2>
          <p className="text-sm text-gray-500 mt-2">Tap any module to see how it transforms your operations</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3" style={{ gridAutoFlow: 'dense', gridAutoRows: '150px' }}>
          {dynamicBentoOrder.map((modId, bentoIdx) => {
            const mod = dynamicModules.find((m) => m.id === modId);
            const showcase = dynamicShowcase[modId];
            if (!mod || !showcase) return null;
            const Icon = mod.icon;
            const isLarge = showcase.span.includes('row-span-2');
            const grad = BENTO_GREENS[bentoIdx % BENTO_GREENS.length];
            const iconClr = BENTO_ICONS[bentoIdx % BENTO_ICONS.length];
            return (
              <button
                key={modId}
                onClick={() => setSelectedModule(modId)}
                className={`${showcase.span} rounded-2xl bg-gradient-to-br ${grad} backdrop-blur-xl border border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.06)] p-5 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_40px_rgba(0,0,0,0.1)] hover:border-white/60 group relative overflow-hidden flex flex-col`}
              >
                <Icon className={`${isLarge ? 'w-10 h-10' : 'w-7 h-7'} ${iconClr} mb-auto`} />
                <div>
                  <h3 className={`text-gray-900 font-bold tracking-wide ${isLarge ? 'text-base' : 'text-xs'}`}>{mod.name}</h3>
                  <p className={`text-gray-500 font-semibold mt-1 ${isLarge ? 'text-sm' : 'text-[10px]'}`}>{showcase.headline}</p>
                  {isLarge && (
                    <p className="text-gray-400 text-[11px] mt-2 leading-relaxed line-clamp-2">{mod.description}</p>
                  )}
                </div>
                <div className="absolute bottom-3 right-4 text-gray-300 group-hover:text-gray-500 transition-colors">
                  <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Masonry Module Detail Modal ── */}
      {selectedModule && (() => {
        const mod = dynamicModules.find((m) => m.id === selectedModule);
        const showcase = dynamicShowcase[selectedModule];
        if (!mod || !showcase) return null;
        const Icon = mod.icon;

        // Build masonry items: hero + stats + features + benefits
        const tiles: { type: 'hero' | 'stat' | 'feature' | 'benefit'; title: string; sub: string; stat?: string; label?: string }[] = [];
        tiles.push({ type: 'hero', title: mod.name, sub: showcase.headline });
        (dynamicHighlights[selectedModule] || []).forEach(s =>
          tiles.push({ type: 'stat', title: '', sub: '', stat: s.stat, label: s.label })
        );
        mod.features.forEach(f => tiles.push({ type: 'feature', title: f.name, sub: f.liner }));
        showcase.benefits.forEach(b => tiles.push({ type: 'benefit', title: '', sub: b }));

        return (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6"
            onClick={() => setSelectedModule(null)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-2xl animate-[fadeIn_200ms_ease-out]" />
            <div
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white/70 backdrop-blur-2xl border border-white/50 rounded-3xl p-4 sm:p-6 shadow-[0_24px_80px_rgba(0,0,0,0.12)] animate-[zoomIn_400ms_cubic-bezier(0.16,1,0.3,1)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => setSelectedModule(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 text-gray-500 hover:bg-black/10 hover:text-gray-800 transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Masonry Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5" style={{ gridAutoFlow: 'dense', gridAutoRows: '85px' }}>
                {tiles.map((tile, i) => {
                  const span = MASONRY_SPANS[i] || '';
                  const bg = MASONRY_BG[i % MASONRY_BG.length];
                  const isVisual = VISUAL_INDICES.has(i);
                  const delay = `${i * 30}ms`;

                  return (
                    <div
                      key={i}
                      className={`${span} ${bg} backdrop-blur-xl border border-white/40 rounded-2xl p-4 relative overflow-hidden flex flex-col animate-[tilePop_400ms_cubic-bezier(0.16,1,0.3,1)_both]`}
                      style={{ animationDelay: delay }}
                    >
                      {/* Visual icon overlay for designated tiles */}
                      {isVisual && tile.type !== 'hero' && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
                          <Icon className="w-24 h-24 text-gray-900" />
                        </div>
                      )}

                      {tile.type === 'hero' && (
                        <>
                          <div className="absolute -top-8 -right-8 w-40 h-40 bg-gradient-to-br from-gray-200/40 to-transparent rounded-full blur-3xl" />
                          <Icon className="w-16 h-16 text-gray-900/[0.06] absolute top-4 right-4" />
                          <div className="mt-auto relative">
                            <h3 className="text-2xl font-black text-gray-900 leading-tight">{tile.title}</h3>
                            <p className="text-gray-500 text-sm font-semibold mt-1">{tile.sub}</p>
                            <p className="text-gray-400 text-xs mt-2 leading-relaxed line-clamp-2">{mod.description}</p>
                          </div>
                        </>
                      )}

                      {tile.type === 'stat' && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <span className="text-3xl font-black text-gray-900 leading-none">{tile.stat}</span>
                          <span className="text-gray-400 text-[9px] uppercase tracking-[0.2em] mt-1.5">{tile.label}</span>
                        </div>
                      )}

                      {tile.type === 'feature' && (
                        <div className="mt-auto">
                          <h4 className="text-xs font-bold text-gray-800 leading-tight">{tile.title}</h4>
                          <p className="text-gray-400 text-[10px] mt-1 leading-tight line-clamp-3">{tile.sub}</p>
                        </div>
                      )}

                      {tile.type === 'benefit' && (
                        <div className="flex items-start gap-2 mt-auto">
                          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-black/10 flex-shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 text-gray-700" />
                          </span>
                          <p className="text-gray-600 text-[11px] leading-relaxed">{tile.sub}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom CTA */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => {
                    setSelectedModule(null);
                    document.getElementById('pricing-table')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border border-gray-300 text-gray-700 hover:bg-black/5 transition-all duration-300"
                >
                  View in Pricing Table
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Floating tooltip — rendered fixed to avoid overflow clipping */}
      {tooltip && (
        <div
          className="fixed z-[100] px-3 py-2 bg-black text-white text-[11px] leading-snug rounded-lg shadow-xl max-w-[220px] pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y, transform: 'translateY(-50%)' }}
        >
          {tooltip.text}
          <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-black" />
        </div>
      )}
    </div>
  );
};

export default PricingSection;
