import {
  Cpu, Monitor, Smartphone, TabletSmartphone, QrCode, Globe, Tv,
  ListOrdered, Utensils, AppWindow, TrendingUp, Package, Store, Tablet,
} from 'lucide-react';
import type { ElementType } from 'react';

// ─── Interfaces ─────────────────────────────────────────────

export type Availability = boolean | string;

export interface PricingFeatureConfig {
  name: string;
  liner: string;
  free: Availability;
  starter: Availability;
  standard: Availability;
  pro: Availability;
}

export interface PricingModuleConfig {
  id: string;
  name: string;
  description: string;
  iconName: string;
  tierAddon?: Partial<Record<string, string>>;
  features: PricingFeatureConfig[];
}

export interface TierMetaConfig {
  key: string;
  label: string;
  positioning: string;
  tagline: string;
}

export interface TierSummaryConfig {
  bullets: string[];
  constraint?: string;
  eliteLabel?: string;
  revenueFrame?: string;
}

export interface TierPrices {
  free: number;
  starter: number;
  standard: number;
  pro: number;
}

export interface CapabilityGroupConfig {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  primaryEngine?: { label: string; tagline: string };
  features: PricingFeatureConfig[];
}

export interface CapabilityTierPositioning {
  key: string;
  label: string;
  description: string;
}

export interface ShowcaseEntry {
  headline: string;
  span: string;
  gradient: string;
  iconColor: string;
  benefits: string[];
}

export interface ModuleHighlight {
  stat: string;
  label: string;
}

export interface PricingPageConfig {
  tierPricing: { monthly: TierPrices; yearly: TierPrices };
  tierPricingMYR: { monthly: TierPrices; yearly: TierPrices };
  addonMYR: Record<string, number>;
  tierMeta: TierMetaConfig[];
  tierSummary: Record<string, TierSummaryConfig>;
  modules: PricingModuleConfig[];
  capabilityGroups: CapabilityGroupConfig[];
  capabilityTierPositioning: CapabilityTierPositioning[];
  showcase: Record<string, ShowcaseEntry>;
  moduleHighlights: Record<string, ModuleHighlight[]>;
  bentoOrder: string[];
}

// ─── Icon Map ───────────────────────────────────────────────

export const ICON_MAP: Record<string, ElementType> = {
  Cpu, Monitor, Smartphone, TabletSmartphone, QrCode, Globe, Tv,
  ListOrdered, Utensils, AppWindow, TrendingUp, Package, Store, Tablet,
};

export function resolveIcon(name: string): ElementType {
  return ICON_MAP[name] || Package;
}

// ─── Default Config ─────────────────────────────────────────

export const DEFAULT_PRICING_CONFIG: PricingPageConfig = {
  tierPricing: {
    monthly: { free: 0, starter: 9.9, standard: 29.9, pro: 49.9 },
    yearly: { free: 0, starter: 7.9, standard: 24.9, pro: 42.9 },
  },
  tierPricingMYR: {
    monthly: { free: 0, starter: 39, standard: 119, pro: 199 },
    yearly: { free: 0, starter: 29, standard: 99, pro: 169 },
  },
  addonMYR: { '9.9': 39, '19.9': 79 },

  tierMeta: [
    { key: 'free', label: 'FREE', positioning: 'Validate Without Risk', tagline: 'Prove your concept costs nothing' },
    { key: 'starter', label: 'STARTER', positioning: 'Eliminate Daily Chaos', tagline: 'Take back operational control' },
    { key: 'standard', label: 'STANDARD', positioning: 'Automate Your Growth', tagline: 'Revenue automation that pays for itself' },
    { key: 'pro', label: 'PRO', positioning: 'Scale Like a Chain', tagline: 'Optimize margins across every branch' },
  ],

  tierSummary: {
    free: {
      bullets: ['Start selling in minutes', 'Basic POS & Webstore', 'Zero commitment'],
      constraint: '500 transactions/mo · QPOS watermark',
    },
    starter: {
      bullets: ['Staff control & shift tracking', 'Mobile POS on any phone', 'AI business insights'],
    },
    standard: {
      bullets: ['Self-ordering (Kiosk + QR)', 'Automated revenue boosters', 'Unlimited outlets & channels'],
      revenueFrame: 'Pays for itself with just 1–2 extra orders per day',
    },
    pro: {
      bullets: ['Inventory automation', 'Revenue attribution & forecasting', 'Multi-branch optimization'],
      eliteLabel: 'Advanced Intelligence Layer',
      revenueFrame: 'Replaces managers, spreadsheets and guesswork',
    },
  },

  modules: [
    {
      id: 'aihub', name: 'AI Hub', iconName: 'Cpu',
      description: 'Stop guessing what\u2019s working. QPOS AI analyzes your sales, customers and staff performance \u2014 and tells you exactly what to fix, optimize or double down on.',
      features: [
        { name: 'Sales Report', liner: 'See exactly where your revenue comes from \u2014 no spreadsheets needed', free: '3 months', starter: true, standard: true, pro: true },
        { name: 'AI Insights', liner: 'Ask any question about your business and get instant clarity', free: false, starter: true, standard: true, pro: true },
        { name: 'Product Performance', liner: 'Know which menu items make money and which ones drag you down', free: false, starter: false, standard: true, pro: true },
        { name: 'Customer Analytics', liner: 'Understand who your best customers are and how to keep them', free: false, starter: false, standard: true, pro: true },
        { name: 'Actionable Recommendations', liner: 'Get told exactly what to fix, optimize or double down on', free: false, starter: false, standard: true, pro: true },
        { name: 'Peak Hours Analysis', liner: 'Staff smarter by knowing exactly when your rush hits', free: false, starter: false, standard: true, pro: true },
        { name: 'Multi-Channel Breakdown', liner: 'See which channels drive the most revenue at a glance', free: false, starter: false, standard: true, pro: true },
        { name: 'Revenue by Outlet', liner: 'Instantly spot your strongest and weakest branches', free: false, starter: false, standard: true, pro: true },
        { name: 'Staff Management', liner: 'Control who does what, where \u2014 with one click', free: false, starter: true, standard: true, pro: true },
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
        { name: 'Custom Report Builder', liner: 'Build exactly the reports you need \u2014 no developer required', free: false, starter: false, standard: false, pro: true },
      ],
    },
    {
      id: 'pos', name: 'Super POS', iconName: 'Monitor',
      description: 'Handle dine-in, takeaway and delivery from one unified screen. No confusion. No switching systems. No lost orders. Your operations stay calm \u2014 even during peak hour chaos.',
      features: [
        { name: 'Full Register System', liner: 'Ring up any order in seconds \u2014 no training manual needed', free: true, starter: true, standard: true, pro: true },
        { name: 'Multi-Payment Methods', liner: 'Accept every payment method your customers expect', free: true, starter: true, standard: true, pro: true },
        { name: 'Product Modifiers', liner: 'Handle any customization without slowing down the line', free: true, starter: true, standard: true, pro: true },
        { name: 'Table Management', liner: 'See your entire floor at a glance \u2014 every table, every status', free: true, starter: true, standard: true, pro: true },
        { name: 'Tax Configuration', liner: 'Stay tax-compliant automatically across products and outlets', free: true, starter: true, standard: true, pro: true },
        { name: 'Barcode Scanning', liner: 'Scan and sell \u2014 faster than typing, zero mistakes', free: true, starter: true, standard: true, pro: true },
        { name: 'Order Notes', liner: 'Never miss a special request from the kitchen again', free: true, starter: true, standard: true, pro: true },
        { name: 'Shift Management', liner: 'Open and close with confidence \u2014 every dollar accounted for', free: false, starter: true, standard: true, pro: true },
        { name: 'Receipt Customization', liner: 'Turn every receipt into a branded marketing touchpoint', free: false, starter: true, standard: true, pro: true },
        { name: 'Discount & Promo Codes', liner: 'Reward customers on the spot without calling a manager', free: false, starter: true, standard: true, pro: true },
        { name: 'Customer Lookup', liner: 'Greet regulars by name and reward them instantly', free: false, starter: true, standard: true, pro: true },
        { name: 'Kitchen Printer Integration', liner: 'Orders hit the kitchen the moment you confirm \u2014 zero delay', free: false, starter: true, standard: true, pro: true },
        { name: 'End-of-Day Report', liner: 'Close your day in minutes, not hours \u2014 everything tallied', free: false, starter: true, standard: true, pro: true },
        { name: 'Customer Display', liner: 'Build trust with transparent pricing on a second screen', free: false, starter: false, standard: true, pro: true },
        { name: 'Parked & Open Orders', liner: 'Pause and resume orders effortlessly for flexible dining', free: false, starter: false, standard: true, pro: true },
        { name: 'Split Bill', liner: 'Split any bill any way without awkward math', free: false, starter: false, standard: true, pro: true },
        { name: 'Multi-Device Sync', liner: 'Run multiple registers in perfect sync \u2014 no conflicts ever', free: false, starter: false, standard: true, pro: true },
        { name: 'Offline Mode', liner: 'Keep selling even when the internet drops \u2014 zero downtime', free: false, starter: false, standard: true, pro: true },
        { name: 'Multi-Currency Support', liner: 'Welcome tourists and accept their currency automatically', free: false, starter: false, standard: false, pro: true },
        { name: 'Advanced Void & Refund', liner: 'Protect against fraud with manager-approved voids and full audit trails', free: false, starter: false, standard: false, pro: true },
      ],
    },
    {
      id: 'mpos', name: 'Super mPOS', iconName: 'Smartphone',
      description: 'Your phone becomes your register. Take orders tableside, manage queues and accept payments anywhere \u2014 no extra hardware, no limitations, total freedom.',
      features: [
        { name: 'Portable Register', liner: 'Take your entire register wherever the customers are', free: false, starter: true, standard: true, pro: true },
        { name: 'Queue Control', liner: 'Manage walk-in crowds without chaos or lost customers', free: false, starter: true, standard: true, pro: true },
        { name: 'Scanner Station', liner: 'Verify tickets, stamps and vouchers on the spot', free: false, starter: true, standard: true, pro: true },
        { name: 'Service Notifications', liner: 'Know instantly when a table needs you \u2014 before they wave', free: false, starter: true, standard: true, pro: true },
        { name: 'Transaction History', liner: 'Every sale at your fingertips, anytime you need it', free: false, starter: true, standard: true, pro: true },
        { name: 'Tableside Ordering', liner: 'Take orders at the table \u2014 no walking back and forth', free: false, starter: true, standard: true, pro: true },
        { name: 'Quick-Add Favorites', liner: 'Your best-sellers are one tap away during the rush', free: false, starter: true, standard: true, pro: true },
        { name: 'Discount Application', liner: 'Apply promos on the floor without returning to the counter', free: false, starter: true, standard: true, pro: true },
        { name: 'Daily Sales Summary', liner: 'End your shift knowing exactly how much you sold', free: false, starter: true, standard: true, pro: true },
        { name: 'Wireless Receipt Printing', liner: 'Print receipts from anywhere \u2014 no cables, no hassle', free: false, starter: true, standard: true, pro: true },
        { name: 'Customer Lookup', liner: 'Recognize loyalty members and reward them in seconds', free: false, starter: true, standard: true, pro: true },
        { name: 'Tap-to-Pay NFC', liner: 'Accept contactless payments with just a phone tap', free: false, starter: false, standard: true, pro: true },
        { name: 'Offline Mode', liner: 'Keep taking orders even in dead zones \u2014 auto-syncs later', free: false, starter: false, standard: true, pro: true },
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
      id: 'kiosk', name: 'Super Kiosk', iconName: 'TabletSmartphone',
      description: 'Customers spend 20\u201330% more when they order themselves. Eliminate queues, reduce staff dependency and increase revenue \u2014 all from one branded touchscreen.',
      features: [
        { name: 'Self-Ordering Interface', liner: 'Customers browse, customize and order \u2014 no staff needed', free: false, starter: false, standard: true, pro: true },
        { name: 'Multiple Payment Gateways', liner: 'Accept cards, e-wallets and NFC without extra hardware', free: false, starter: false, standard: true, pro: true },
        { name: 'Custom Branding', liner: 'Your brand, your colors \u2014 customers see you, not us', free: false, starter: false, standard: true, pro: true },
        { name: 'Dine-in & Takeaway', liner: 'Automatically sort orders so kitchen knows exactly what to prep', free: false, starter: false, standard: true, pro: true },
        { name: 'Voucher & Member Lookup', liner: 'Customers redeem loyalty rewards without asking staff', free: false, starter: false, standard: true, pro: true },
        { name: 'Order Confirmation', liner: 'Clear confirmations that reduce counter questions', free: false, starter: false, standard: true, pro: true },
        { name: 'Multi-Language Support', liner: 'Serve tourists and multilingual customers effortlessly', free: false, starter: false, standard: true, pro: true },
        { name: 'Allergen Information', liner: 'Protect customers and reduce liability with clear allergen labels', free: false, starter: false, standard: true, pro: true },
        { name: 'Combo Meal Builder', liner: 'Guide customers to higher-value combos that boost your AOV', free: false, starter: false, standard: true, pro: true },
        { name: 'Idle Screen Promotions', liner: 'Turn idle kiosks into promotional billboards that sell for you', free: false, starter: false, standard: true, pro: true },
        { name: 'Queue Number Assignment', liner: 'Organize pickups automatically \u2014 no shouting, no confusion', free: false, starter: false, standard: true, pro: true },
        { name: 'Receipt Printing', liner: 'Physical or digital receipts \u2014 whatever your customer prefers', free: false, starter: false, standard: true, pro: true },
        { name: 'NFC Contactless Payment', liner: 'Fast tap-and-go checkout that keeps the line moving', free: false, starter: false, standard: true, pro: true },
        { name: 'Remote Content Management', liner: 'Update every kiosk from your office \u2014 no USB drives needed', free: false, starter: false, standard: true, pro: true },
        { name: 'Accessibility Mode', liner: 'Serve every customer comfortably with inclusive design', free: false, starter: false, standard: true, pro: true },
        { name: 'Nutritional Information', liner: 'Health-conscious customers order with confidence', free: false, starter: false, standard: false, pro: true },
        { name: 'Custom Themes & Layouts', liner: 'Design the browsing experience that fits your restaurant style', free: false, starter: false, standard: false, pro: true },
        { name: 'Multi-Kiosk Management', liner: 'Control all your kiosks from one dashboard \u2014 no walking around', free: false, starter: false, standard: false, pro: true },
        { name: 'Age Verification Prompt', liner: 'Stay compliant with age-restricted item checks built in', free: false, starter: false, standard: false, pro: true },
        { name: 'Kiosk Analytics Dashboard', liner: 'Know exactly how your kiosks perform and where to improve', free: false, starter: false, standard: false, pro: true },
      ],
    },
    {
      id: 'qr', name: 'Scan-to-Order (QR)', iconName: 'QrCode',
      description: 'Zero hardware cost, zero app downloads. Customers order from their own phone, reorder anytime and request the bill \u2014 reducing your staff workload by up to 40%.',
      features: [
        { name: 'Table QR Ordering', liner: 'Customers order from their own phone \u2014 you spend nothing on devices', free: false, starter: false, standard: true, pro: true },
        { name: 'Multi-Round Ordering', liner: 'Guests add more items anytime without flagging a waiter', free: false, starter: false, standard: true, pro: true },
        { name: 'Service Bell', liner: 'Customers tap for help \u2014 your staff gets notified instantly', free: false, starter: false, standard: true, pro: true },
        { name: 'Bill Request', liner: 'Guests request the bill when ready \u2014 faster table turnover', free: false, starter: false, standard: true, pro: true },
        { name: 'Real-time Order Status', liner: 'Customers track their order live \u2014 fewer counter questions', free: false, starter: false, standard: true, pro: true },
        { name: 'Photo-Rich Menu', liner: 'Beautiful dish photos on their phone that drive appetite and spend', free: false, starter: false, standard: true, pro: true },
        { name: 'Promo Code Entry', liner: 'Customers apply discounts themselves \u2014 zero staff effort', free: false, starter: false, standard: true, pro: true },
        { name: 'Menu Translation', liner: 'International guests order in their own language automatically', free: false, starter: false, standard: true, pro: true },
        { name: 'Allergen Filters', liner: 'Customers filter by dietary needs \u2014 no awkward conversations', free: false, starter: false, standard: true, pro: true },
        { name: 'Digital Receipt', liner: 'Paperless receipts on their phone \u2014 eco-friendly and convenient', free: false, starter: false, standard: true, pro: true },
        { name: 'Table Auto-Detect', liner: 'The QR code knows which table \u2014 no manual input needed', free: false, starter: false, standard: true, pro: true },
        { name: 'Dietary Labels', liner: 'Clear vegan, halal and allergy tags build customer trust', free: false, starter: false, standard: true, pro: true },
        { name: 'Wait Time Display', liner: 'Set accurate expectations before customers even order', free: false, starter: false, standard: true, pro: true },
        { name: 'Cart Sharing', liner: 'Multiple guests add to one cart \u2014 perfect for group dining', free: false, starter: false, standard: true, pro: true },
        { name: 'Bandwidth-Optimized Loading', liner: 'Loads fast even on slow data \u2014 no frustrated customers', free: false, starter: false, standard: true, pro: true },
        { name: 'Customer Feedback Form', liner: 'Capture reviews while the experience is fresh', free: false, starter: false, standard: false, pro: true },
        { name: 'Order History', liner: 'Returning guests reorder favorites in seconds', free: false, starter: false, standard: false, pro: true },
        { name: 'Upsell Suggestions', liner: 'Smart prompts that add revenue without staff intervention', free: false, starter: false, standard: false, pro: true },
        { name: 'Custom QR Code Design', liner: 'Branded QR codes that match your restaurant identity', free: false, starter: false, standard: false, pro: true },
        { name: 'Multi-Language Auto-Detect', liner: 'Menu appears in the customer\u2019s phone language automatically', free: false, starter: false, standard: false, pro: true },
      ],
    },
    {
      id: 'tablet', name: 'Super Tablet', iconName: 'Tablet',
      description: 'Guests explore your full menu at their own pace, customize every detail and request service \u2014 all without a single staff interaction. Premium dining, zero labor cost.',
      tierAddon: { pro: '$19.9' },
      features: [
        { name: 'Tableside Customer Ordering', liner: 'Guests explore your menu at their own pace \u2014 no pressure, bigger orders', free: false, starter: false, standard: false, pro: true },
        { name: 'Pax Selection', liner: 'Portion and pace recommendations based on party size', free: false, starter: false, standard: false, pro: true },
        { name: 'Service Request Panel', liner: 'Water, cutlery, help \u2014 guests tap instead of waving', free: false, starter: false, standard: false, pro: true },
        { name: 'Attract Screen', liner: 'Idle tablets promote specials and new items automatically', free: false, starter: false, standard: false, pro: true },
        { name: 'Device Activation Wizard', liner: 'Set up new tablets in minutes with guided onboarding', free: false, starter: false, standard: false, pro: true },
        { name: 'Multi-Language Menu', liner: 'Guests choose their language before browsing \u2014 true hospitality', free: false, starter: false, standard: false, pro: true },
        { name: 'Photo-Rich Catalog', liner: 'Full-screen dish photos that sell better than any waiter description', free: false, starter: false, standard: false, pro: true },
        { name: 'Allergen & Dietary Filters', liner: 'Guests filter by diet with confidence \u2014 no awkward questions', free: false, starter: false, standard: false, pro: true },
        { name: 'Real-Time Stock Visibility', liner: 'Sold-out items disappear automatically \u2014 no disappointment', free: false, starter: false, standard: false, pro: true },
        { name: 'Combo Builder', liner: 'Guide guests through combos that increase your average check', free: false, starter: false, standard: false, pro: true },
        { name: 'Digital Bill Splitting', liner: 'Guests split the bill themselves \u2014 no math, no delays', free: false, starter: false, standard: false, pro: true },
        { name: 'Customer Feedback on Exit', liner: 'Capture 5-star reviews before guests walk out the door', free: false, starter: false, standard: false, pro: true },
        { name: 'Idle Mode Slideshow', liner: 'Every idle moment becomes a promotion opportunity', free: false, starter: false, standard: false, pro: true },
        { name: 'Staff Override Mode', liner: 'Managers access settings with a PIN \u2014 secure and controlled', free: false, starter: false, standard: false, pro: true },
        { name: 'Table-Linked Auto-Binding', liner: 'Tablets know their table \u2014 orders routed automatically', free: false, starter: false, standard: false, pro: true },
        { name: 'Sound & Haptic Feedback', liner: 'Satisfying confirmations that make ordering feel premium', free: false, starter: false, standard: false, pro: true },
        { name: 'Custom Theme Colors', liner: 'Your brand colors, your identity \u2014 on every table', free: false, starter: false, standard: false, pro: true },
        { name: 'Nutritional Info Display', liner: 'Health-conscious guests order confidently with full nutrition data', free: false, starter: false, standard: false, pro: true },
        { name: 'Parent & Child Table Linking', liner: 'Merge tables for large parties without any confusion', free: false, starter: false, standard: false, pro: true },
        { name: 'Remote Device Monitoring', liner: 'Know every tablet\u2019s battery and status without leaving your desk', free: false, starter: false, standard: false, pro: true },
      ],
    },
    {
      id: 'web', name: 'Webstore', iconName: 'Globe',
      description: 'Stop paying 25\u201330% to marketplaces. Your own branded online store accepts orders 24/7 with pickup and delivery \u2014 every dollar of revenue stays yours.',
      features: [
        { name: 'Online Storefront', liner: 'Your own branded shop \u2014 no marketplace taking 30% of your revenue', free: true, starter: true, standard: true, pro: true },
        { name: 'Product Catalog & Search', liner: 'Customers find what they want fast \u2014 fewer abandoned carts', free: true, starter: true, standard: true, pro: true },
        { name: 'Online Checkout & Payment', liner: 'Secure payments that build trust and close sales', free: true, starter: true, standard: true, pro: true },
        { name: 'Pickup & Delivery', liner: 'Offer both fulfillment options \u2014 cover every customer preference', free: true, starter: true, standard: true, pro: true },
        { name: 'Promo Banners & Collections', liner: 'Promote specials and seasonal items that drive extra orders', free: true, starter: true, standard: true, pro: true },
        { name: 'SEO-Optimized Pages', liner: 'Get found on Google \u2014 bring in customers who are searching for you', free: true, starter: true, standard: true, pro: true },
        { name: 'Customer Accounts', liner: 'Saved preferences and one-click reordering keep customers coming back', free: true, starter: true, standard: true, pro: true },
        { name: 'Order Tracking', liner: 'Customers track their order live \u2014 fewer support calls', free: true, starter: true, standard: true, pro: true },
        { name: 'Discount Codes', liner: 'Drive repeat orders and referrals with targeted promotions', free: false, starter: true, standard: true, pro: true },
        { name: 'Email Notifications', liner: 'Automatic updates that keep customers informed and happy', free: false, starter: true, standard: true, pro: true },
        { name: 'Inventory Sync', liner: 'Sold-out items hide automatically \u2014 no disappointed customers', free: false, starter: false, standard: true, pro: true },
        { name: 'Delivery Zone Mapping', liner: 'Set delivery areas and distance-based pricing in minutes', free: false, starter: false, standard: true, pro: true },
        { name: 'Social Media Integration', liner: 'Turn every product into a shareable social post', free: false, starter: false, standard: true, pro: true },
        { name: 'Custom Domain Support', liner: 'Your brand, your URL \u2014 build lasting customer trust', free: false, starter: false, standard: true, pro: true },
        { name: 'Multi-Language Storefront', liner: 'Reach international customers in their own language', free: false, starter: false, standard: true, pro: true },
        { name: 'Customer Reviews', liner: 'Social proof from real buyers that drives new orders', free: false, starter: false, standard: true, pro: true },
        { name: 'Scheduled Ordering', liner: 'Customers order now, pick up later \u2014 convenience that converts', free: false, starter: false, standard: true, pro: true },
        { name: 'Webstore Analytics', liner: 'Know exactly what\u2019s working and what\u2019s losing customers', free: false, starter: false, standard: false, pro: true },
        { name: 'Abandoned Cart Recovery', liner: 'Win back lost sales automatically with smart reminders', free: false, starter: false, standard: false, pro: true },
        { name: 'API Access', liner: 'Connect your store to any external tool or service you need', free: false, starter: false, standard: false, pro: true },
      ],
    },
    {
      id: 'live', name: 'Live Display', iconName: 'Tv',
      description: 'Customers see their order status live on big screens \u2014 no more crowding the counter, no more anxiety. Queue announcements keep your venue calm and organized.',
      features: [
        { name: 'Live Order Board', liner: 'Customers see their order status \u2014 no crowding the counter', free: true, starter: true, standard: true, pro: true },
        { name: 'Multi-Channel Support', liner: 'Every order from every channel on one unified screen', free: true, starter: true, standard: true, pro: true },
        { name: 'Fullscreen Kiosk Mode', liner: 'Lock your TV into a professional display \u2014 no distractions', free: true, starter: true, standard: true, pro: true },
        { name: 'Sound Notifications', liner: 'Audio alerts ensure no order number goes unheard', free: false, starter: true, standard: true, pro: true },
        { name: 'Sound Volume Control', liner: 'Fine-tune volume remotely for any time of day', free: false, starter: true, standard: true, pro: true },
        { name: 'Queue Call Announcements', liner: 'Call queue numbers on screen so everyone sees and hears', free: false, starter: false, standard: true, pro: true },
        { name: 'Custom Display Settings', liner: 'Design your display to match your venue\u2019s look and feel', free: false, starter: false, standard: true, pro: true },
        { name: 'Multi-Screen Support', liner: 'Run different views on different TVs across your venue', free: false, starter: false, standard: true, pro: true },
        { name: 'Custom Branding & Colors', liner: 'Your brand on the big screen \u2014 consistent everywhere', free: false, starter: false, standard: true, pro: true },
        { name: 'Order ETA Display', liner: 'Manage customer expectations with accurate wait times', free: false, starter: false, standard: true, pro: true },
        { name: 'Promotional Slide Carousel', liner: 'Turn wait time into marketing time with rotating promos', free: false, starter: false, standard: true, pro: true },
        { name: 'Digital Menu Board Mode', liner: 'Use idle screens as digital menus that attract orders', free: false, starter: false, standard: true, pro: true },
        { name: 'Multi-Language Display', liner: 'Serve multilingual venues with localized order displays', free: false, starter: false, standard: true, pro: true },
        { name: 'Animated Transitions', liner: 'Smooth animations that look professional and polished', free: false, starter: false, standard: true, pro: true },
        { name: 'Vertical & Horizontal Layout', liner: 'Fit any TV orientation in your venue perfectly', free: false, starter: false, standard: true, pro: true },
        { name: 'Order Type Grouping', liner: 'Organize dine-in, takeaway and delivery at a glance', free: false, starter: false, standard: true, pro: true },
        { name: 'Auto-Dimming Night Mode', liner: 'Screens dim automatically after hours \u2014 energy efficient', free: false, starter: false, standard: true, pro: true },
        { name: 'Priority Queue Highlighting', liner: 'VIP and priority orders stand out immediately', free: false, starter: false, standard: false, pro: true },
        { name: 'Remote Display Control', liner: 'Manage every screen from CMS \u2014 no walking to each TV', free: false, starter: false, standard: false, pro: true },
        { name: 'Display Health Monitoring', liner: 'Get alerted the moment a display goes offline', free: false, starter: false, standard: false, pro: true },
      ],
    },
    {
      id: 'qds', name: 'QDS (Queue Display)', iconName: 'ListOrdered',
      description: 'No more shouting queue numbers. Automatic voice announcements, multi-counter support and real-time wait tracking keep your customers informed and your staff focused.',
      features: [
        { name: 'Queue Number Display', liner: 'Crystal-clear queue numbers that every customer can see', free: false, starter: false, standard: true, pro: true },
        { name: 'Audio Announcements', liner: 'Automatic voice calls so staff never have to shout again', free: false, starter: false, standard: true, pro: true },
        { name: 'Multi-Prefix Support', liner: 'Separate queues for different counters \u2014 organized and efficient', free: false, starter: false, standard: true, pro: true },
        { name: 'Waiting Statistics', liner: 'Real-time wait data helps you manage rush hours intelligently', free: false, starter: false, standard: true, pro: true },
        { name: 'Real-time Updates', liner: 'Numbers update instantly \u2014 no lag, no confusion', free: false, starter: false, standard: true, pro: true },
        { name: 'Counter Assignment', liner: 'Direct customers to the right counter automatically', free: false, starter: false, standard: true, pro: true },
        { name: 'Custom Voice Selection', liner: 'Choose the voice and language that fits your venue', free: false, starter: false, standard: true, pro: true },
        { name: 'Queue Skip & Priority', liner: 'VIP and accessibility queue jumps handled smoothly', free: false, starter: false, standard: true, pro: true },
        { name: 'Multi-Language Announcements', liner: 'Serve multilingual venues with localized voice calls', free: false, starter: false, standard: true, pro: true },
        { name: 'Estimated Wait Time', liner: 'Set expectations upfront \u2014 reduce customer frustration', free: false, starter: false, standard: true, pro: true },
        { name: 'Queue Number Printing', liner: 'Physical tickets for customers who prefer something in hand', free: false, starter: false, standard: true, pro: true },
        { name: 'Customer Check-In', liner: 'Let customers join the queue from their phone or kiosk', free: false, starter: false, standard: true, pro: true },
        { name: 'Queue Recall', liner: 'Missed your number? One tap brings it back', free: false, starter: false, standard: true, pro: true },
        { name: 'Daily Queue Statistics', liner: 'Know how many served, peak times and average wait daily', free: false, starter: false, standard: true, pro: true },
        { name: 'Multiple Display Layouts', liner: 'Choose the view that works best for your space', free: false, starter: false, standard: true, pro: true },
        { name: 'Custom Sound Alerts', liner: 'Unique sounds per queue prefix \u2014 clear and unmistakable', free: false, starter: false, standard: true, pro: true },
        { name: 'SMS Queue Notifications', liner: 'Text customers when their turn approaches \u2014 they stay relaxed', free: false, starter: false, standard: false, pro: true },
        { name: 'Queue Transfer Between Counters', liner: 'Move customers between counters without requeuing', free: false, starter: false, standard: false, pro: true },
        { name: 'Peak Hour Auto-Scaling', liner: 'Extra queues open automatically when things get busy', free: false, starter: false, standard: false, pro: true },
        { name: 'Remote Queue Management', liner: 'Control everything from CMS \u2014 no standing behind the counter', free: false, starter: false, standard: false, pro: true },
      ],
    },
    {
      id: 'kds', name: 'KDS (Kitchen Display)', iconName: 'Utensils',
      description: 'Your kitchen, finally organized. Orders route to the right station automatically, aging alerts catch delays before customers complain, and tickets never get lost again.',
      features: [
        { name: 'Kitchen Display', liner: 'Every order visible on screen \u2014 no more lost paper tickets', free: true, starter: true, standard: true, pro: true },
        { name: 'Multi-Station Routing', liner: 'Drinks go to bar, food to grill \u2014 automatically', free: false, starter: false, standard: true, pro: true },
        { name: 'Order Bumping', liner: 'One tap to mark done \u2014 keeps the line moving fast', free: false, starter: false, standard: true, pro: true },
        { name: 'Aging Alerts', liner: 'Amber and red warnings before forgotten orders become complaints', free: false, starter: false, standard: true, pro: true },
        { name: 'Expo Station', liner: 'Your chef sees everything \u2014 coordinates final assembly perfectly', free: false, starter: false, standard: true, pro: true },
        { name: 'Auto-Complete', liner: 'Orders close automatically when all stations finish \u2014 zero admin', free: false, starter: false, standard: true, pro: true },
        { name: 'Color-Coded Priority', liner: 'Rush and VIP orders impossible to miss', free: false, starter: false, standard: true, pro: true },
        { name: 'Modification Highlighting', liner: 'Special requests pop visually \u2014 fewer kitchen mistakes', free: false, starter: false, standard: true, pro: true },
        { name: 'Course-Based Firing', liner: 'Starters, mains and desserts fired in the right sequence', free: false, starter: false, standard: true, pro: true },
        { name: 'Preparation Timer', liner: 'Track prep time per item \u2014 find and fix slowdowns', free: false, starter: false, standard: true, pro: true },
        { name: 'Voice Announcements', liner: 'Audio alerts for new orders so the kitchen never misses one', free: false, starter: false, standard: true, pro: true },
        { name: 'Allergen Warnings', liner: 'Bold allergen flags protect your customers and your reputation', free: false, starter: false, standard: true, pro: true },
        { name: 'Rush Mode', liner: 'Priority orders jump to the front across all stations instantly', free: false, starter: false, standard: true, pro: true },
        { name: 'Order Grouping', liner: 'Group by table or order for efficient batch preparation', free: false, starter: false, standard: true, pro: true },
        { name: 'Custom Station Labels', liner: 'Name and color-code each station for instant recognition', free: false, starter: false, standard: true, pro: true },
        { name: 'Kitchen Printer Fallback', liner: 'If a screen goes down, tickets print automatically \u2014 no lost orders', free: false, starter: false, standard: true, pro: true },
        { name: 'Station Performance Metrics', liner: 'Know exactly which station is fast and which needs help', free: false, starter: false, standard: false, pro: true },
        { name: 'Recipe Display', liner: 'Prep instructions on screen ensure consistency every time', free: false, starter: false, standard: false, pro: true },
        { name: 'Split-Screen View', liner: 'Two stations on one display \u2014 perfect for small kitchens', free: false, starter: false, standard: false, pro: true },
        { name: 'Historical Prep Analytics', liner: 'Track kitchen speed trends to continuously improve', free: false, starter: false, standard: false, pro: true },
      ],
    },
    {
      id: 'app', name: 'Super Loyalty App', iconName: 'AppWindow',
      description: 'One phone number, total loyalty across every channel. Customers collect stamps, earn points and redeem vouchers whether they order at POS, Kiosk, QR or Webstore.',
      features: [
        { name: 'Membership Profile', liner: 'Every customer has a profile \u2014 scanned at any touchpoint', free: true, starter: true, standard: true, pro: true },
        { name: 'Digital Receipt', liner: 'All receipts in one place \u2014 no more paper clutter', free: true, starter: true, standard: true, pro: true },
        { name: 'eStamps', liner: 'Digital stamps that customers actually use \u2014 no more lost cards', free: true, starter: true, standard: true, pro: true },
        { name: 'Transaction History', liner: 'Customers see every purchase \u2014 builds trust and habit', free: true, starter: true, standard: true, pro: true },
        { name: 'Favorites List', liner: 'One-tap reordering of favorites keeps customers coming back', free: true, starter: true, standard: true, pro: true },
        { name: 'Vouchers', liner: 'Targeted vouchers that bring customers back at the right time', free: false, starter: false, standard: true, pro: true },
        { name: 'Push Notifications', liner: 'Reach customers directly on their phone when it matters', free: false, starter: false, standard: true, pro: true },
        { name: 'Birthday Rewards', liner: 'Automatic birthday treats that make customers feel special', free: false, starter: false, standard: true, pro: true },
        { name: 'Welcome Bonus', liner: 'First-visit rewards that convert new visitors into regulars', free: false, starter: false, standard: true, pro: true },
        { name: 'Member-Only Pricing', liner: 'Exclusive pricing that makes membership feel valuable', free: false, starter: false, standard: true, pro: true },
        { name: 'In-App Ordering', liner: 'Customers order ahead \u2014 skip the line and pick up fast', free: false, starter: false, standard: true, pro: true },
        { name: 'Anniversary Rewards', liner: 'Celebrate customer milestones that deepen brand loyalty', free: false, starter: false, standard: true, pro: true },
        { name: 'Social Sharing', liner: 'Customers become promoters when they share rewards online', free: false, starter: false, standard: true, pro: true },
        { name: 'Points', liner: 'Points earned on every channel \u2014 one unified loyalty system', free: false, starter: false, standard: false, pro: true },
        { name: 'Referral Program', liner: 'Turn happy customers into your most effective sales channel', free: false, starter: false, standard: false, pro: true },
        { name: 'Tier Status Badges', liner: 'Bronze, Silver, Gold status that motivates higher spending', free: false, starter: false, standard: false, pro: true },
        { name: 'Gamification Challenges', liner: 'Fun missions that keep customers engaged between visits', free: false, starter: false, standard: false, pro: true },
        { name: 'Personalized Offers', liner: 'AI-crafted deals based on what each customer actually buys', free: false, starter: false, standard: false, pro: true },
        { name: 'Multi-Brand Support', liner: 'One app for all your restaurant brands \u2014 unified loyalty', free: false, starter: false, standard: false, pro: true },
        { name: 'Family Account Linking', liner: 'Families share points \u2014 bigger incentive to keep coming back', free: false, starter: false, standard: false, pro: true },
      ],
    },
    {
      id: 'sboost', name: 'Sales Booster', iconName: 'TrendingUp',
      description: 'Every cart becomes an opportunity. Every checkout becomes smarter. Automated upsells, nudges and triggers increase your average order value by up to 25% \u2014 without training staff.',
      features: [
        { name: 'Product Badges', liner: 'Eye-catching labels that drive attention to high-margin items', free: true, starter: true, standard: true, pro: true },
        { name: 'Checkout Nudges', liner: 'Smart prompts that increase order size without annoying customers', free: false, starter: false, standard: true, pro: true },
        { name: 'Upsell Popups', liner: 'The right suggestion at the right moment \u2014 proven to convert', free: false, starter: false, standard: true, pro: true },
        { name: 'Cart Triggers', liner: 'Automatic promotions that reward bigger orders', free: false, starter: false, standard: true, pro: true },
        { name: 'Happy Hour Automation', liner: 'Prices change automatically during slow periods \u2014 fill more seats', free: false, starter: false, standard: true, pro: true },
        { name: 'Bundle Deals', liner: 'Pre-built combos that increase revenue and simplify ordering', free: false, starter: false, standard: true, pro: true },
        { name: 'Quantity-Based Discounts', liner: 'Buy-more-save-more deals that move inventory fast', free: false, starter: false, standard: true, pro: true },
        { name: 'Time-Limited Flash Sales', liner: 'Countdown urgency that drives immediate action', free: false, starter: false, standard: true, pro: true },
        { name: 'First-Time Customer Offer', liner: 'Welcome deals that convert first-timers into regulars', free: false, starter: false, standard: true, pro: true },
        { name: 'Cross-Channel Campaigns', liner: 'One promotion runs everywhere \u2014 POS, Kiosk, QR and Webstore', free: false, starter: false, standard: true, pro: true },
        { name: 'Campaign Scheduling', liner: 'Set it and forget it \u2014 promotions activate on your schedule', free: false, starter: false, standard: true, pro: true },
        { name: 'Auto-Expiring Promotions', liner: 'Deals shut off automatically \u2014 no forgotten discounts eroding margin', free: false, starter: false, standard: true, pro: true },
        { name: 'Minimum Spend Unlocks', liner: 'Encourage bigger orders with spend-threshold rewards', free: false, starter: false, standard: true, pro: true },
        { name: 'Tier Progression', liner: 'Customer tiers that reward loyalty and motivate higher spending', free: false, starter: false, standard: false, pro: true },
        { name: 'A/B Testing', liner: 'Test two promotions and keep the one that makes more money', free: false, starter: false, standard: false, pro: true },
        { name: 'Customer Segment Targeting', liner: 'Send the right offer to the right customer group', free: false, starter: false, standard: false, pro: true },
        { name: 'Personalized Recommendations', liner: 'AI picks the product each customer is most likely to add', free: false, starter: false, standard: false, pro: true },
        { name: 'Campaign Analytics Dashboard', liner: 'See exactly which campaigns are profitable and which aren\u2019t', free: false, starter: false, standard: false, pro: true },
        { name: 'Loyalty Tier Multipliers', liner: 'Top-tier members earn bonus points \u2014 rewarding your best customers', free: false, starter: false, standard: false, pro: true },
        { name: 'Re-Engagement Campaigns', liner: 'Win back customers who haven\u2019t visited in a while \u2014 automatically', free: false, starter: false, standard: false, pro: true },
      ],
    },
    {
      id: 'ims', name: 'IMS (Inventory)', iconName: 'Package',
      description: 'Stop discovering stock problems too late. Real-time tracking across every outlet, automatic reorder alerts and supplier management \u2014 protect your margins automatically.',
      tierAddon: { pro: '$9.9' },
      features: [
        { name: 'Stock Tracking', liner: 'Know exactly what you have, across every outlet, right now', free: false, starter: false, standard: false, pro: true },
        { name: 'Supplier Management', liner: 'All your vendors, prices and history in one organized place', free: false, starter: false, standard: false, pro: true },
        { name: 'Low Stock Alerts', liner: 'Get warned before you run out \u2014 not after customers complain', free: false, starter: false, standard: false, pro: true },
        { name: 'Purchase Orders', liner: 'Generate and track POs from the same system you sell from', free: false, starter: false, standard: false, pro: true },
        { name: 'Stock Transfer', liner: 'Move inventory between outlets with full tracking and audit trail', free: false, starter: false, standard: false, pro: true },
        { name: 'Goods Received Notes', liner: 'Match deliveries against orders \u2014 catch discrepancies immediately', free: false, starter: false, standard: false, pro: true },
        { name: 'Stock Count & Reconciliation', liner: 'Physical counts with variance reports that find shrinkage fast', free: false, starter: false, standard: false, pro: true },
        { name: 'Batch Tracking', liner: 'Full traceability by batch \u2014 essential for food safety compliance', free: false, starter: false, standard: false, pro: true },
        { name: 'Expiry Date Monitoring', liner: 'Get alerted before products expire \u2014 reduce waste, protect customers', free: false, starter: false, standard: false, pro: true },
        { name: 'Wastage Recording', liner: 'Track every loss with reasons \u2014 data that helps you prevent it', free: false, starter: false, standard: false, pro: true },
        { name: 'Recipe Costing', liner: 'Know the exact cost of every dish \u2014 price with confidence', free: false, starter: false, standard: false, pro: true },
        { name: 'Automatic Reorder Points', liner: 'POs generate automatically when stock runs low \u2014 never miss a reorder', free: false, starter: false, standard: false, pro: true },
        { name: 'Multi-Unit Conversion', liner: 'Track in kg, pieces or liters \u2014 the system handles conversion', free: false, starter: false, standard: false, pro: true },
        { name: 'Ingredient-Level Tracking', liner: 'Ingredients deduct automatically when items sell \u2014 always accurate', free: false, starter: false, standard: false, pro: true },
        { name: 'Inventory Valuation Report', liner: 'Know your total inventory value at any moment \u2014 FIFO or average', free: false, starter: false, standard: false, pro: true },
        { name: 'Variance Analysis', liner: 'Find the gap between expected and actual usage \u2014 stop leakage', free: false, starter: false, standard: false, pro: true },
        { name: 'Supplier Price Comparison', liner: 'Compare supplier prices side by side \u2014 negotiate smarter', free: false, starter: false, standard: false, pro: true },
        { name: 'Barcode Label Printing', liner: 'Print internal barcodes for faster stock counts and organization', free: false, starter: false, standard: false, pro: true },
        { name: 'Stock Movement History', liner: 'Full audit trail of every movement \u2014 complete accountability', free: false, starter: false, standard: false, pro: true },
        { name: 'COGS Calculation', liner: 'Automatic cost of goods sold \u2014 know your real margins per period', free: false, starter: false, standard: false, pro: true },
      ],
    },
    {
      id: 'outlet', name: 'Outlets', iconName: 'Store',
      description: 'Whether you run 1 outlet or 20, everything stays connected, synchronized and visible. Centralize control without losing local flexibility.',
      features: [
        { name: 'Multi-Outlet Management', liner: 'Every branch, one dashboard \u2014 total visibility in one place', free: '1 outlet', starter: '1 outlet', standard: 'Unlimited', pro: 'Unlimited' },
        { name: 'Per-Outlet Settings', liner: 'Each location runs its own way \u2014 your way', free: '1 outlet', starter: '1 outlet', standard: 'Unlimited', pro: 'Unlimited' },
        { name: 'Outlet-Scoped Reports', liner: 'Compare branch performance instantly \u2014 spot winners and fix laggards', free: '1 outlet', starter: '1 outlet', standard: 'Unlimited', pro: 'Unlimited' },
        { name: 'Staff Assignment', liner: 'Control who works where with role-based access per outlet', free: '1 outlet', starter: '1 outlet', standard: 'Unlimited', pro: 'Unlimited' },
        { name: 'Centralized Product Catalog', liner: 'One menu, many outlets \u2014 update once, deploy everywhere', free: '1 outlet', starter: '1 outlet', standard: 'Unlimited', pro: 'Unlimited' },
        { name: 'Centralized Menu Updates', liner: 'Push menu changes to all outlets with one click', free: false, starter: false, standard: true, pro: true },
        { name: 'Per-Outlet Pricing', liner: 'Different locations, different prices \u2014 you control the strategy', free: false, starter: false, standard: true, pro: true },
        { name: 'Outlet Performance Rankings', liner: 'Rank branches by revenue and growth \u2014 drive healthy competition', free: false, starter: false, standard: true, pro: true },
        { name: 'Outlet Groups & Tags', liner: 'Organize outlets by region or type for smarter management', free: false, starter: false, standard: true, pro: true },
        { name: 'Opening Hours Management', liner: 'Customers always know when you\u2019re open \u2014 per outlet', free: false, starter: false, standard: true, pro: true },
        { name: 'Per-Outlet Promotions', liner: 'Run location-specific campaigns that target local customers', free: false, starter: false, standard: true, pro: true },
        { name: 'Outlet Comparison Dashboard', liner: 'Side-by-side metrics that reveal what each outlet does best', free: false, starter: false, standard: true, pro: true },
        { name: 'Centralized Staff Directory', liner: 'See all staff across all outlets in one unified view', free: false, starter: false, standard: true, pro: true },
        { name: 'Revenue Consolidation', liner: 'Total revenue across all outlets \u2014 one number, full clarity', free: false, starter: false, standard: true, pro: true },
        { name: 'Per-Outlet Branding', liner: 'Different logos and receipts per outlet \u2014 maintain local identity', free: false, starter: false, standard: false, pro: true },
        { name: 'Cross-Outlet Transfers', liner: 'Move stock and staff between branches smoothly', free: false, starter: false, standard: false, pro: true },
        { name: 'Regional Manager Roles', liner: 'Give regional managers exactly the access they need', free: false, starter: false, standard: false, pro: true },
        { name: 'Franchise Support Mode', liner: 'Franchise-ready permissions and royalty tracking built in', free: false, starter: false, standard: false, pro: true },
        { name: 'Multi-Timezone Support', liner: 'Outlets in different timezones report correctly \u2014 no confusion', free: false, starter: false, standard: false, pro: true },
        { name: 'Outlet Health Monitoring', liner: 'Get alerted the moment any outlet goes offline', free: false, starter: false, standard: false, pro: true },
      ],
    },
  ],

  capabilityGroups: [
    {
      id: 'operate', emoji: '\ud83c\udfea', title: 'OPERATE WITHOUT CHAOS', subtitle: 'One system. One database. One truth.',
      description: 'Handle dine-in, takeaway and delivery from one unified screen \u2014 no confusion, no switching systems, no lost orders during peak hours.',
      features: [
        { name: 'Full Register POS', liner: 'Ring up any order in seconds \u2014 no training manual needed', free: true, starter: true, standard: true, pro: true },
        { name: 'Multi-Payment Methods', liner: 'Accept cash, card, e-wallet and QR \u2014 whatever customers prefer', free: true, starter: true, standard: true, pro: true },
        { name: 'Product Modifiers', liner: 'Handle any customization without slowing down the line', free: true, starter: true, standard: true, pro: true },
        { name: 'Table Management', liner: 'See your entire floor at a glance \u2014 every table, every status', free: true, starter: true, standard: true, pro: true },
        { name: 'Order Notes', liner: 'Never miss a special request from the kitchen again', free: true, starter: true, standard: true, pro: true },
        { name: 'Barcode Scanning', liner: 'Scan and sell \u2014 faster than typing, zero mistakes', free: true, starter: true, standard: true, pro: true },
        { name: 'Shift Management', liner: 'Open and close with confidence \u2014 every dollar accounted for', free: false, starter: true, standard: true, pro: true },
        { name: 'Receipt Customization', liner: 'Turn every receipt into a branded touchpoint', free: false, starter: true, standard: true, pro: true },
        { name: 'Discount & Promo Codes', liner: 'Reward customers on the spot without calling a manager', free: false, starter: true, standard: true, pro: true },
        { name: 'Customer Lookup', liner: 'Greet regulars by name and reward them instantly', free: false, starter: true, standard: true, pro: true },
        { name: 'Kitchen Printer Integration', liner: 'Orders hit the kitchen the moment you confirm \u2014 zero delay', free: false, starter: true, standard: true, pro: true },
        { name: 'Split Bills', liner: 'Split any bill any way without awkward math', free: false, starter: false, standard: true, pro: true },
        { name: 'Parked & Open Orders', liner: 'Pause and resume orders effortlessly for flexible dining', free: false, starter: false, standard: true, pro: true },
        { name: 'Multi-Device Sync', liner: 'Run multiple registers in perfect sync \u2014 no conflicts ever', free: false, starter: false, standard: true, pro: true },
        { name: 'Offline Mode', liner: 'Keep selling even when the internet drops \u2014 zero downtime', free: false, starter: false, standard: true, pro: true },
        { name: 'Advanced Void & Refund', liner: 'Manager-approved voids with full audit trails prevent fraud', free: false, starter: false, standard: false, pro: true },
        { name: 'Multi-Currency Support', liner: 'Welcome tourists and accept their currency automatically', free: false, starter: false, standard: false, pro: true },
      ],
    },
    {
      id: 'sell-anywhere', emoji: '\ud83c\udf0d', title: 'SELL ANYWHERE, WITHOUT FRICTION', subtitle: 'Counter. Tableside. Self-service. Online.',
      description: 'Meet customers wherever they are \u2014 your counter, their phone, a kiosk, or your website. Every channel feeds into one unified system.',
      features: [
        { name: 'Super mPOS (Mobile POS)', liner: 'Your phone becomes your register \u2014 take orders anywhere', free: false, starter: true, standard: true, pro: true },
        { name: 'QR Order & Pay', liner: 'Customers order from their own phone \u2014 zero device cost', free: false, starter: false, standard: true, pro: true },
        { name: 'Self-Service Kiosk', liner: 'Eliminate queues and boost order value by 20\u201330%', free: false, starter: false, standard: true, pro: true },
        { name: 'Webstore (0% Commission)', liner: 'Your own online store \u2014 every dollar stays yours', free: true, starter: true, standard: true, pro: true },
        { name: 'Customer Display Screen', liner: 'Build trust with transparent pricing on a second screen', free: false, starter: false, standard: true, pro: true },
        { name: 'Multi-Language Interface', liner: 'Serve multilingual staff and customers effortlessly', free: false, starter: false, standard: true, pro: true },
        { name: 'NFC Contactless Payment', liner: 'Fast tap-and-go checkout that keeps the line moving', free: false, starter: false, standard: true, pro: true },
        { name: 'Marketplace Integration', liner: 'Connect to GrabFood, ShopeeFood and more from one system', free: 'Add-on', starter: 'Add-on', standard: 'Add-on', pro: 'Add-on' },
      ],
    },
    {
      id: 'increase-revenue', emoji: '\ud83d\udcb0', title: 'INCREASE REVENUE AUTOMATICALLY', subtitle: 'Every checkout becomes smarter.',
      description: 'AI-powered upsells, cart triggers and campaigns that increase AOV by up to 25% \u2014 without training staff or adding manual effort.',
      primaryEngine: { label: 'Sales Booster (Built-In Revenue Automation)', tagline: 'AI-powered upsells, cart triggers and campaigns that increase AOV by up to 25%.' },
      features: [
        { name: 'Sales Booster Engine', liner: 'One engine powering all your automated revenue campaigns', free: false, starter: false, standard: true, pro: true },
        { name: 'Product Badges', liner: 'Eye-catching labels that drive attention to high-margin items', free: true, starter: true, standard: true, pro: true },
        { name: 'Checkout Nudges', liner: 'Smart prompts that increase order size at the perfect moment', free: false, starter: false, standard: true, pro: true },
        { name: 'Upsell Popups', liner: 'Suggest the right add-on at checkout \u2014 proven to convert', free: false, starter: false, standard: true, pro: true },
        { name: 'Cart Triggers', liner: 'Automatic rewards when customers hit spend thresholds', free: false, starter: false, standard: true, pro: true },
        { name: 'Happy Hour Automation', liner: 'Prices adjust automatically during slow periods \u2014 fill more seats', free: false, starter: false, standard: true, pro: true },
        { name: 'Bundle Deals', liner: 'Pre-built combos that boost revenue and simplify ordering', free: false, starter: false, standard: true, pro: true },
        { name: 'Quantity-Based Discounts', liner: 'Buy-more-save-more deals that move inventory fast', free: false, starter: false, standard: true, pro: true },
        { name: 'Campaign Scheduling', liner: 'Set it and forget it \u2014 promotions run on your schedule', free: false, starter: false, standard: true, pro: true },
        { name: 'A/B Testing', liner: 'Test two promotions and keep the one that earns more', free: false, starter: false, standard: false, pro: true },
        { name: 'Campaign Analytics Dashboard', liner: 'See exactly which campaigns are profitable and which aren\u2019t', free: false, starter: false, standard: false, pro: true },
        { name: 'Personalized AI Recommendations', liner: 'AI picks the product each customer is most likely to add', free: false, starter: false, standard: false, pro: true },
      ],
    },
    {
      id: 'repeat-revenue', emoji: '\ud83d\udd01', title: 'TURN CUSTOMERS INTO REPEAT REVENUE', subtitle: 'Own the relationship. Stop losing customers to platforms.',
      description: 'Unified loyalty across POS, QR, Kiosk & Webstore under one phone number \u2014 customers earn and redeem everywhere.',
      primaryEngine: { label: 'Built-In Web-Based Loyalty App', tagline: 'Unified loyalty across POS, QR, Kiosk & Webstore under one phone number.' },
      features: [
        { name: 'Built-In Loyalty App', liner: 'One unified loyalty system across every channel you sell on', free: true, starter: true, standard: true, pro: true },
        { name: 'Membership Profile', liner: 'Every customer gets a profile \u2014 scanned at any touchpoint', free: true, starter: true, standard: true, pro: true },
        { name: 'Digital Receipt', liner: 'All receipts in one place \u2014 no more paper clutter', free: true, starter: true, standard: true, pro: true },
        { name: 'eStamps', liner: 'Digital stamps customers actually use \u2014 no more lost cards', free: true, starter: true, standard: true, pro: true },
        { name: 'Vouchers', liner: 'Targeted vouchers that bring customers back at the right time', free: false, starter: false, standard: true, pro: true },
        { name: 'Birthday Rewards', liner: 'Automatic birthday treats that make customers feel special', free: false, starter: false, standard: true, pro: true },
        { name: 'Welcome Bonus', liner: 'First-visit rewards that convert new visitors into regulars', free: false, starter: false, standard: true, pro: true },
        { name: 'Member-Only Pricing', liner: 'Exclusive pricing that makes membership feel valuable', free: false, starter: false, standard: true, pro: true },
        { name: 'Points System', liner: 'Points earned on every channel \u2014 one unified balance', free: false, starter: false, standard: false, pro: true },
        { name: 'Referral Program', liner: 'Turn happy customers into your most effective sales channel', free: false, starter: false, standard: false, pro: true },
        { name: 'Tier Status Badges', liner: 'Bronze, Silver, Gold status that motivates higher spending', free: false, starter: false, standard: false, pro: true },
        { name: 'Personalized Offers', liner: 'AI-crafted deals based on what each customer actually buys', free: false, starter: false, standard: false, pro: true },
      ],
    },
    {
      id: 'protect-margins', emoji: '\ud83d\udce6', title: 'PROTECT YOUR MARGINS', subtitle: 'Never run out. Never overbuy.',
      description: 'Your kitchen stays organized with digital tickets and auto-routing, while inventory tracking protects every dollar of margin.',
      features: [
        { name: 'Kitchen Display (KDS)', liner: 'Every order visible on screen \u2014 no more lost paper tickets', free: true, starter: true, standard: true, pro: true },
        { name: 'Multi-Station Routing', liner: 'Drinks go to bar, food to grill \u2014 routed automatically', free: false, starter: false, standard: true, pro: true },
        { name: 'Aging Alerts', liner: 'Amber and red warnings before forgotten orders become complaints', free: false, starter: false, standard: true, pro: true },
        { name: 'Expo Station', liner: 'Your chef sees everything and coordinates final assembly', free: false, starter: false, standard: true, pro: true },
        { name: 'Color-Coded Priority', liner: 'Rush and VIP orders are impossible to miss', free: false, starter: false, standard: true, pro: true },
        { name: 'Recipe Display', liner: 'Prep instructions on screen ensure consistency every time', free: false, starter: false, standard: false, pro: true },
        { name: 'Station Performance Metrics', liner: 'Know exactly which station is fast and which needs help', free: false, starter: false, standard: false, pro: true },
        { name: 'IMS Inventory (Add-on)', liner: 'Full inventory management integrated into your POS', free: false, starter: false, standard: false, pro: true },
        { name: 'Real-Time Stock Tracking', liner: 'Know exactly what you have across every outlet right now', free: false, starter: false, standard: false, pro: true },
        { name: 'Low Stock Alerts', liner: 'Get warned before you run out \u2014 not after customers complain', free: false, starter: false, standard: false, pro: true },
        { name: 'Purchase Orders', liner: 'Generate and track POs from the same system you sell from', free: false, starter: false, standard: false, pro: true },
        { name: 'Recipe Costing', liner: 'Know the exact cost of every dish \u2014 price with confidence', free: false, starter: false, standard: false, pro: true },
        { name: 'COGS Reporting', liner: 'Automatic cost of goods sold \u2014 know your real margins', free: false, starter: false, standard: false, pro: true },
      ],
    },
    {
      id: 'smarter-decisions', emoji: '\ud83e\udde0', title: 'MAKE SMARTER DECISIONS DAILY', subtitle: 'Clarity without spreadsheets.',
      description: 'AI-powered analytics that tell you exactly what to fix, optimize or double down on \u2014 no spreadsheets, no guesswork.',
      features: [
        { name: 'Sales Reports', liner: 'See exactly where your revenue comes from \u2014 no spreadsheets', free: '3 Months', starter: true, standard: true, pro: true },
        { name: 'AI Insights', liner: 'Ask any question about your business and get instant clarity', free: false, starter: true, standard: true, pro: true },
        { name: 'Product Performance', liner: 'Know which items make money and which drag you down', free: false, starter: false, standard: true, pro: true },
        { name: 'Customer Analytics', liner: 'Understand who your best customers are and how to keep them', free: false, starter: false, standard: true, pro: true },
        { name: 'Menu Engineering Matrix', liner: 'Scientifically optimize your menu for maximum profit', free: false, starter: false, standard: true, pro: true },
        { name: 'Staff Performance Scoring', liner: 'Reward your best staff and coach the rest with real data', free: false, starter: false, standard: true, pro: true },
        { name: 'Multi-Channel Breakdown', liner: 'See which channels drive the most revenue at a glance', free: false, starter: false, standard: true, pro: true },
        { name: 'Revenue Forecasting', liner: 'Plan ahead with AI-predicted revenue for the next 30 days', free: false, starter: false, standard: false, pro: true },
        { name: 'Customer Lifetime Value', liner: 'Know how much each customer is worth over their lifetime', free: false, starter: false, standard: false, pro: true },
        { name: 'Custom Report Builder', liner: 'Build exactly the reports you need \u2014 no developer required', free: false, starter: false, standard: false, pro: true },
      ],
    },
    {
      id: 'scale', emoji: '\ud83d\ude80', title: 'SCALE WITHOUT BREAKING YOUR SYSTEM', subtitle: 'Built for your second and third outlet.',
      description: 'Centralize what matters, customize what\u2019s local. Scale from one outlet to twenty without switching systems or migrating data.',
      features: [
        { name: 'Multi-Outlet Management', liner: 'Every branch, one dashboard \u2014 total visibility in one place', free: '1 Outlet', starter: '1 Outlet', standard: 'Unlimited', pro: 'Unlimited' },
        { name: 'Per-Outlet Settings', liner: 'Each location runs its own way \u2014 your rules, your setup', free: '1 Outlet', starter: '1 Outlet', standard: 'Unlimited', pro: 'Unlimited' },
        { name: 'Centralized Product Catalog', liner: 'One menu, many outlets \u2014 update once, deploy everywhere', free: '1 Outlet', starter: '1 Outlet', standard: 'Unlimited', pro: 'Unlimited' },
        { name: 'Per-Outlet Pricing', liner: 'Different locations, different prices \u2014 you control the strategy', free: false, starter: false, standard: true, pro: true },
        { name: 'Revenue Consolidation', liner: 'Total revenue across all outlets in one clear number', free: false, starter: false, standard: true, pro: true },
        { name: 'Outlet Performance Rankings', liner: 'Rank branches by revenue and growth \u2014 drive healthy competition', free: false, starter: false, standard: true, pro: true },
        { name: 'Franchise Mode', liner: 'Franchise-ready permissions and royalty tracking built in', free: false, starter: false, standard: false, pro: true },
        { name: 'Regional Manager Roles', liner: 'Give regional managers exactly the access they need', free: false, starter: false, standard: false, pro: true },
        { name: 'Multi-Timezone Support', liner: 'Outlets in different timezones report correctly \u2014 no confusion', free: false, starter: false, standard: false, pro: true },
      ],
    },
    {
      id: 'support', emoji: '\ud83e\udd1d', title: 'BUILT WITH YOU. NOT JUST FOR YOU.', subtitle: 'Infrastructure + Human Backing.',
      description: 'We don\u2019t just give you software \u2014 we give you a team that cares about your success.',
      features: [
        { name: 'Standard Support', liner: 'Help when you need it \u2014 email, chat and knowledge base', free: true, starter: true, standard: true, pro: true },
        { name: 'Priority Support', liner: 'Jump the queue \u2014 faster response when it matters most', free: false, starter: false, standard: true, pro: true },
        { name: 'Dedicated Success Manager', liner: 'A named person who knows your business and helps you grow', free: false, starter: false, standard: false, pro: true },
        { name: '60-Day Money Back', liner: 'Try risk-free \u2014 full refund if it\u2019s not right for you', free: true, starter: true, standard: true, pro: true },
      ],
    },
  ],

  capabilityTierPositioning: [
    { key: 'free', label: 'FREE', description: 'Validate your concept without risk.' },
    { key: 'starter', label: 'STARTER', description: 'Take control of daily operations.' },
    { key: 'standard', label: 'STANDARD', description: 'Automate revenue and prepare to scale.' },
    { key: 'pro', label: 'PRO', description: 'Optimize margins and run multi-branch operations like a chain.' },
  ],

  showcase: {
    aihub: { headline: 'Your 24/7 Business Brain', span: 'md:col-span-2 md:row-span-2', gradient: 'from-violet-500/20 to-blue-500/20', iconColor: 'text-violet-400', benefits: ['Finally understand your business without drowning in spreadsheets', 'Ask any question in plain language and get instant answers about performance', 'AI detects revenue opportunities and warns you about problems before they hit'] },
    pos: { headline: 'Total Control at the Counter', span: 'md:col-span-2', gradient: 'from-blue-500/20 to-cyan-500/20', iconColor: 'text-blue-400', benefits: ['Your operations stay calm \u2014 even during peak hour chaos', 'Runs on any browser \u2014 no app downloads, no proprietary hardware lock-in', 'Dine-in, takeaway and delivery unified in one screen with zero confusion'] },
    mpos: { headline: 'Freedom to Sell Anywhere', span: '', gradient: 'from-cyan-500/20 to-teal-500/20', iconColor: 'text-cyan-400', benefits: ['Your phone becomes your register \u2014 no extra hardware investment', 'Perfect for events, pop-ups, food trucks and tableside service', 'Queue management and barcode scanning from the phone in your pocket'] },
    kiosk: { headline: 'Sell More Without Hiring More', span: '', gradient: 'from-amber-500/20 to-orange-500/20', iconColor: 'text-amber-400', benefits: ['Customers spend 20\u201330% more when they order themselves', 'Eliminate queues during peak hours \u2014 serve more with fewer staff', 'Turn every customer into a higher-spending customer automatically'] },
    app: { headline: 'Loyalty That Actually Works', span: 'md:col-span-2', gradient: 'from-orange-500/20 to-pink-500/20', iconColor: 'text-orange-400', benefits: ['One phone number earns rewards across POS, Kiosk, QR and Webstore', 'No more lost paper cards \u2014 stamps, vouchers and points in one app', 'Customers keep coming back because rewards feel effortless'] },
    qr: { headline: 'Zero Hardware. Maximum Efficiency.', span: '', gradient: 'from-green-500/20 to-emerald-500/20', iconColor: 'text-green-400', benefits: ['Customers order from their own phone \u2014 you invest nothing in devices', 'Reduce staff workload by up to 40% with self-service ordering', 'Faster table turnover means more revenue per seat per hour'] },
    tablet: { headline: 'Premium Experience, Zero Staff Effort', span: '', gradient: 'from-rose-500/20 to-pink-500/20', iconColor: 'text-rose-400', benefits: ['Guests explore your menu at their own pace \u2014 no pressure, bigger orders', 'Service requests handled digitally \u2014 water, cutlery, help \u2014 one tap', 'Idle screens become promotion displays that sell for you 24/7'] },
    web: { headline: 'Your Revenue. Zero Commission.', span: '', gradient: 'from-sky-500/20 to-blue-500/20', iconColor: 'text-sky-400', benefits: ['Stop giving 25\u201330% of every order to marketplace platforms', 'Your brand, your domain, your customer relationship \u2014 fully controlled', 'Accept orders 24/7 with pickup and delivery built in'] },
    live: { headline: 'Calm Your Venue Instantly', span: '', gradient: 'from-indigo-500/20 to-violet-500/20', iconColor: 'text-indigo-400', benefits: ['Customers see their order status live \u2014 no anxiety, no crowding the counter', 'Queue announcements with sound alerts keep everything moving smoothly', 'Every channel\u2019s orders appear on one unified big screen'] },
    kds: { headline: 'Your Kitchen, Finally Organized', span: '', gradient: 'from-orange-500/20 to-red-500/20', iconColor: 'text-orange-400', benefits: ['Drinks go to bar, food to grill \u2014 automatically routed, zero confusion', 'Aging alerts catch delays before they become customer complaints', 'No more lost paper tickets \u2014 every order tracked digitally'] },
    qds: { headline: 'No More Shouting', span: '', gradient: 'from-fuchsia-500/20 to-purple-500/20', iconColor: 'text-fuchsia-400', benefits: ['Voice announcements call queue numbers automatically \u2014 staff stay focused', 'Multi-prefix queues keep different counters organized effortlessly', 'Customers know exactly how long they\u2019ll wait \u2014 reducing frustration'] },
    sboost: { headline: 'Automated Revenue Engine', span: 'md:col-span-2', gradient: 'from-emerald-500/20 to-teal-500/20', iconColor: 'text-emerald-400', benefits: ['Every cart becomes an opportunity \u2014 smart upsells at the right moment', 'Increase average order value by up to 25% without training staff', 'Set it and forget it \u2014 promotions run, expire and report automatically'] },
    ims: { headline: 'Never Run Out. Never Overbuy.', span: '', gradient: 'from-teal-500/20 to-cyan-500/20', iconColor: 'text-teal-400', benefits: ['Stop discovering stock problems too late \u2014 alerts before they cost you', 'Track every ingredient across every outlet in real time', 'Protect your profit margins automatically with smart reordering'] },
    outlet: { headline: 'Scale Without Losing Control', span: '', gradient: 'from-lime-500/20 to-green-500/20', iconColor: 'text-lime-400', benefits: ['Whether you run 1 or 20 outlets \u2014 everything stays connected and visible', 'Centralize what matters, customize what\u2019s local \u2014 your rules', 'Compare branch performance instantly and drive healthy competition'] },
  },

  moduleHighlights: {
    aihub: [{ stat: '24/7', label: 'AI Monitoring' }, { stat: '11', label: 'Analytics Tools' }],
    pos: [{ stat: '<1s', label: 'Checkout Speed' }, { stat: '7+', label: 'Payment Methods' }],
    mpos: [{ stat: '$0', label: 'Extra Hardware' }, { stat: '\u221e', label: 'Mobility' }],
    kiosk: [{ stat: '+30%', label: 'Higher AOV' }, { stat: '-50%', label: 'Queue Time' }],
    qr: [{ stat: '$0', label: 'Device Cost' }, { stat: '-40%', label: 'Staff Load' }],
    tablet: [{ stat: '5\u2605', label: 'Guest Experience' }, { stat: '24/7', label: 'Promo Display' }],
    web: [{ stat: '0%', label: 'Commission' }, { stat: '24/7', label: 'Always Open' }],
    live: [{ stat: 'Live', label: 'Real-Time' }, { stat: '4+', label: 'Channels' }],
    qds: [{ stat: 'Auto', label: 'Voice Call' }, { stat: 'A-Z', label: 'Multi-Prefix' }],
    kds: [{ stat: '0', label: 'Paper Tickets' }, { stat: 'Auto', label: 'Routing' }],
    app: [{ stat: '1', label: 'Phone Number' }, { stat: '5', label: 'Reward Types' }],
    sboost: [{ stat: '+25%', label: 'AOV Boost' }, { stat: 'Auto', label: 'Triggers' }],
    ims: [{ stat: 'Live', label: 'Stock Levels' }, { stat: 'Auto', label: 'Alerts' }],
    outlet: [{ stat: '\u221e', label: 'Branches' }, { stat: '1', label: 'Dashboard' }],
  },

  bentoOrder: ['aihub', 'pos', 'mpos', 'kiosk', 'app', 'qr', 'tablet', 'web', 'live', 'kds', 'qds', 'sboost', 'ims', 'outlet'],
};
