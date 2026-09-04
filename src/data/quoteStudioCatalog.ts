// QuoteStudio catalog — customer-facing Q Studio quote builder.
// Self-contained: does NOT import from quotesysCatalog (the internal sales tool)
// so the two can evolve independently.
//
// SST rules (Malaysia):
//  - Hardware (entry gates, POS units):        0% SST
//  - Software, subscriptions, setup, delivery: 8% SST

export type StudioSst = 0 | 0.08;

// 'one-time'                 = paid once, hardware-style line item
// 'monthly-billed-annually'  = priced as RM/month but charged as 12× annual upfront
// 'flat-annual'              = priced as RM/year, charged once
export type StudioItemType = 'one-time' | 'monthly-billed-annually' | 'flat-annual';

export interface StudioCatalogItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  benefits?: string[];
  price: number;
  priceLabel?: string;
  sst: StudioSst;
  type: StudioItemType;
  image?: string;
  badge?: string;
  recommended?: boolean;
}

// ─── Custom package (Section 2 — freeform, salesperson-defined software line) ──
// 'one-time' → upfront one-off charge · 'monthly' → standalone RM/month recurring
// charge (NOT folded into the upfront grand total) · 'annual' → RM/year, billed
// once with the other annual subscriptions.
export type StudioPackageCadence = 'one-time' | 'monthly' | 'annual';

export interface StudioCustomPackage {
  enabled: boolean;
  title?: string;
  description: string;   // supports multiline
  price: number;
  cadence: StudioPackageCadence;
  taxed: boolean;        // true → +8% SST, false → no tax
}

// Synthetic id used for the custom package line (line-discount / description keys).
export const CUSTOM_PACKAGE_ID = 'custom-package';

export function emptyCustomPackage(): StudioCustomPackage {
  return { enabled: false, title: '', description: '', price: 0, cadence: 'one-time', taxed: true };
}

// ─── Custom-item categories ───────────────────────────────────────────────────
// Permanently-saved, user-added catalog items are filed under one of these
// sections so an "Add item" form can live inside Hardware / Software / Services
// — mirroring QuoteSys. Persisted in quotesys_custom_items.category.
// NOTE: values must satisfy the quotesys_custom_items.category CHECK constraint
// (hardware | software | setup | delivery | custom). The "Services & Other"
// bucket maps to the allowed 'custom' value, which is also what legacy
// QuoteStudio items already carry — so no migration is needed.
export type StudioItemCategory = 'hardware' | 'software' | 'custom';

export const STUDIO_ITEM_CATEGORIES: { id: StudioItemCategory; title: string; defaultType: StudioItemType; defaultSst: StudioSst }[] = [
  { id: 'hardware', title: 'Hardware', defaultType: 'one-time', defaultSst: 0 },
  { id: 'software', title: 'Software & Subscriptions', defaultType: 'monthly-billed-annually', defaultSst: 0.08 },
  { id: 'custom', title: 'Services & Other', defaultType: 'one-time', defaultSst: 0.08 },
];

// Coerce an arbitrary stored category string into a known one. Legacy rows and
// QuoteSys-only buckets ('setup' / 'delivery') fall back to the 'custom' bucket.
export function normalizeStudioCategory(raw: string | null | undefined): StudioItemCategory {
  return raw === 'hardware' || raw === 'software' ? raw : 'custom';
}

// ─── Entry Gate (hardware, 0% SST, qty selectable) ───
export const ENTRY_GATES: StudioCatalogItem[] = [
  {
    id: 'eg-anti-tailgate',
    title: 'Anti Tailgating Premium Gate',
    subtitle: 'Optional Add-on · 2-layered security',
    description: 'Eliminate tailgating risk entirely with premium 2-layer secure entry.',
    benefits: [
      'Two-stage gate prevents unauthorised entry',
      'Tamper-proof aluminium build',
      'Ideal for premium studios and 24/7 access gyms',
    ],
    price: 18000,
    sst: 0,
    type: 'one-time',
    image: '/quotesys_images/studio-06premiumantitailgate.jpg',
    badge: 'Top Security',
  },
  {
    id: 'eg-premium-swing',
    title: 'Face ID Premium Swing Gate',
    subtitle: 'Item shown is 2 sets · Requires Studio subscription',
    description: 'Polished swing gate experience with built-in Face ID.',
    benefits: [
      'Wide entry — wheelchair & equipment friendly',
      'Glass-paneled premium finish',
      'Auto-close with silent motor',
    ],
    price: 12000,
    sst: 0,
    type: 'one-time',
    image: '/quotesys_images/studio-05premium.jpg',
  },
  {
    id: 'eg-single-flap',
    title: 'Face ID Simple Swing Gate',
    subtitle: 'Price inclusive of Face ID device · *Requires Studio subscription',
    description: 'Best-selling cost-effective Face ID entry for boutique studios.',
    benefits: [
      'Compact footprint — fits narrow entryways',
      'Acrylic swing arm, soft-close mechanism',
      'Fast Face ID recognition (<1 sec)',
    ],
    price: 4500,
    sst: 0,
    type: 'one-time',
    image: '/quotesys_images/studio-04costeffective.jpg',
    badge: 'Best Seller',
    recommended: true,
  },
  {
    id: 'eg-simple-swing',
    title: 'Face ID Space Gate',
    subtitle: 'All comes with Face ID device · Space-saving',
    description: 'Lean, space-efficient gate — great for small studios.',
    benefits: [
      'Minimal floor footprint',
      'Includes Face ID device',
      'Smooth swing motion',
    ],
    price: 6500,
    sst: 0,
    type: 'one-time',
    image: '/quotesys_images/studio-03spacesave.jpg',
    badge: 'Space Saver',
  },
  {
    id: 'eg-rotary-tripod',
    title: 'Face ID Rotary Tripod',
    subtitle: 'Classic tripod-style turnstile',
    description: 'Traditional turnstile — proven, reliable, robust.',
    benefits: [
      'Heavy-duty stainless steel arms',
      'Auto-drop arm for emergencies',
      'Lowest cost per entry-point',
    ],
    price: 5000,
    sst: 0,
    type: 'one-time',
    image: '/quotesys_images/studio-02tripod.jpg',
  },
  {
    id: 'eg-door-lock',
    title: 'Face ID Door Lock',
    subtitle: '*Requires Studio subscription',
    description: 'Convert any door into a Face ID checkpoint — ideal for VIP rooms.',
    benefits: [
      'Retrofit any existing door',
      'Battery-backed (continues during power outage)',
      'Perfect for staff-only / VIP areas',
    ],
    price: 2000,
    sst: 0,
    type: 'one-time',
    image: '/quotesys_images/studio-01faceid.jpg',
  },
  {
    id: 'eg-sentry-kit',
    title: 'Sentry Hardware Kit (Server + 1 Cam)',
    subtitle: 'On-prem AI security server + 1 camera',
    description: 'Edge Sentry server bundled with one AI camera — expandable with more cameras.',
    benefits: [
      'On-site edge server for local processing',
      'Includes 1 AI camera',
      'Add more cameras as you grow',
    ],
    price: 4200,
    sst: 0,
    type: 'one-time',
  },
];

// ─── POS Hardware (mostly 0% SST, two yearly subscriptions at 8%) ───
export const POS_ITEMS: StudioCatalogItem[] = [
  {
    id: 'pos-own-laptop',
    title: 'Use My Own Laptop',
    subtitle: 'Bring your own device',
    description: 'No extra hardware cost — run Q Studio on your existing laptop.',
    benefits: [
      'Zero hardware investment',
      'Use any modern laptop or PC',
      'Recommended for low-volume studios',
    ],
    price: 0,
    priceLabel: 'FREE',
    sst: 0,
    type: 'one-time',
    badge: 'Free',
  },
  {
    id: 'pos-kiosk',
    title: 'QPOS Kiosk',
    subtitle: 'Self-service kiosk for unattended check-in',
    description: 'Let members check themselves in — staff handles only escalations.',
    benefits: [
      '21.5" touchscreen',
      'Self-service member sign-up + payment',
      'Reduces front-desk workload by 70%',
    ],
    price: 7176,
    sst: 0,
    type: 'one-time',
    image: '/quotesys_images/qpos-kiosk.jpeg',
  },
  {
    id: 'pos-lite',
    title: 'QPOS Lite',
    subtitle: 'Cloud POS — annual subscription',
    description: 'Lightweight cloud POS for new studios — start in under 24 hours.',
    benefits: [
      'No upfront hardware cost',
      'Cloud-synced across all devices',
      'Includes 24/7 support',
    ],
    price: 828,
    sst: 0.08,
    type: 'flat-annual',
    image: '/quotesys_images/qpos-lite.jpeg',
  },
  {
    id: 'pos-mini',
    title: 'QPOS Mini',
    subtitle: 'Compact countertop POS',
    description: 'All-in-one mini POS terminal — fits any front desk.',
    benefits: [
      'Compact footprint',
      'Built-in receipt printer',
      'Plug & play setup',
    ],
    price: 1980,
    sst: 0,
    type: 'one-time',
    image: '/quotesys_images/qpos-mini.jpeg',
  },
  {
    id: 'pos-mobile',
    title: 'QPOS Mobile',
    subtitle: 'Handheld mobile POS',
    description: 'Take payments anywhere — perfect for personal trainers on the floor.',
    benefits: [
      'Pocket-sized portable terminal',
      'Long battery life',
      'Built-in card reader',
    ],
    price: 1280,
    sst: 0,
    type: 'one-time',
    image: '/quotesys_images/qpos-mobile.jpeg',
  },
  {
    id: 'pos-qr',
    title: 'QPOS QR',
    subtitle: 'QR-ordering · annual subscription',
    description: 'Members order classes & products via QR — no cashier needed.',
    benefits: [
      'Scan-to-order flow',
      'Cashless transactions',
      'Reduces queues during peak hours',
    ],
    price: 249,
    sst: 0.08,
    type: 'flat-annual',
    image: '/quotesys_images/qpos-qr.jpeg',
  },
  {
    id: 'pos-self-service',
    title: 'QPOS Self Service',
    subtitle: 'Tabletop self-service POS',
    description: 'Compact self-serve terminal — bridge between mini and full kiosk.',
    benefits: [
      'Tabletop or wall-mount',
      'Customer-facing screen',
      'Includes Face ID slot',
    ],
    price: 4080,
    sst: 0,
    type: 'one-time',
    image: '/quotesys_images/qpos-selfservice.jpeg',
  },
  {
    id: 'pos-standard',
    title: 'QPOS Standard',
    subtitle: 'Flagship full-featured POS',
    description: 'Our most popular POS — handles every studio workflow.',
    benefits: [
      'Full keyboard & dual displays',
      'Industry-grade durability',
      'Best for high-traffic studios',
    ],
    price: 3880,
    sst: 0,
    type: 'one-time',
    image: '/quotesys_images/qpos-standard.jpeg',
    recommended: true,
  },
  {
    id: 'pos-v3-mix',
    title: 'QPOS V3 Mix 3-in-1',
    subtitle: 'Counter POS + Mobile POS + Kiosk in one device',
    description: 'One device, three modes — switch between counter, mobile and self-service kiosk.',
    benefits: [
      'Counter, mobile & kiosk modes in one',
      'Compact footprint, wall-mountable',
      'Built-in printer & card reader ready',
    ],
    price: 2599,
    sst: 0,
    type: 'one-time',
    image: '/quotesys_images/qpos-mix.jpeg',
  },
];

// ─── Other Hardware (accessories & add-ons, 0% SST, one-time) ───
// Mirrors the QuoteSys hardware accessory items so QuoteStudio can quote them
// without ad-hoc custom lines. All 0% SST.
export const OTHER_HARDWARE: StudioCatalogItem[] = [
  {
    id: 'oth-sunmi-cloud-printer',
    title: 'Sunmi Cloud Printer',
    subtitle: 'Cloud kitchen / docket printer',
    price: 600,
    sst: 0,
    type: 'one-time',
    image: '/quotesys_images/sunmi_cloud_printer.jpg',
  },
  {
    id: 'oth-standard-cloud-printer',
    title: 'Standard Cloud Printer',
    subtitle: 'Cloud kitchen / docket printer',
    price: 350,
    sst: 0,
    type: 'one-time',
    image: '/quotesys_images/standard_cloud_printer.jpg',
  },
  {
    id: 'oth-kiosk-printer',
    title: 'Kiosk Printer',
    subtitle: 'Thermal printer for kiosks',
    price: 500,
    sst: 0,
    type: 'one-time',
  },
  {
    id: 'oth-cash-drawer-5',
    title: 'Cash Drawer (5 Cash Lanes)',
    subtitle: 'Heavy-duty cash drawer',
    price: 280,
    sst: 0,
    type: 'one-time',
    image: '/quotesys_images/cash_Drawer_5slot.jpg',
  },
  {
    id: 'oth-cash-drawer-4',
    title: 'Cash Drawer (4 Cash Lanes)',
    subtitle: 'Compact cash drawer',
    price: 220,
    sst: 0,
    type: 'one-time',
    image: '/quotesys_images/cash_Drawer_4slot.jpg.jpg',
  },
  {
    id: 'oth-payment-terminal',
    title: 'Payment Terminal',
    subtitle: 'Card & e-wallet payment terminal',
    price: 900,
    sst: 0,
    type: 'one-time',
    image: '/quotesys_images/payment_terminal.jpg',
  },
  {
    id: 'oth-v3-mix-wall-mount',
    title: 'V3 Mix Wall Mount',
    subtitle: 'Wall-mount bracket for QPOS V3 Mix',
    price: 350,
    sst: 0,
    type: 'one-time',
    image: '/quotesys_images/sunmi_v3_mix_wallmount.jpg',
  },
  {
    id: 'oth-mobile-interactive-screen',
    title: 'Mobile Interactive Screen',
    subtitle: 'Mobile digital display · price editable per quote',
    price: 0,
    sst: 0,
    type: 'one-time',
    image: '/quotesys_images/digital_signage_32.jpg',
  },
  {
    id: 'oth-faceid-cam-kiosk',
    title: 'Face ID Camera (Kiosk)',
    subtitle: 'Add-on Face ID camera for kiosks',
    price: 1500,
    sst: 0,
    type: 'one-time',
    image: '/quotesys_images/face_id.jpg',
  },
  {
    id: 'oth-faceid-cam-turnstile',
    title: 'Face ID Camera (Turnstile)',
    subtitle: 'Add-on Face ID camera for turnstiles',
    price: 2500,
    sst: 0,
    type: 'one-time',
    image: '/quotesys_images/face_id.jpg',
  },
  {
    id: 'oth-sentry-ip-camera',
    title: 'Sentry IP Camera',
    subtitle: 'Additional AI camera for the Sentry kit',
    price: 350,
    sst: 0,
    type: 'one-time',
  },
];

// ─── Software Tiers (single-select, RM/mo billed annually, 8% SST) ───
export type TierLevel = 'starter' | 'standard' | 'pro' | 'advanced' | 'enterprise';

export interface StudioTier extends StudioCatalogItem {
  monthly: number;          // shown price
  level: TierLevel;
  highlight: string;
  isCustom?: boolean;       // Enterprise — no fixed price
}

export const SOFTWARE_TIERS: StudioTier[] = [
  {
    id: 'sw-starter',
    title: 'Studio Starter',
    subtitle: 'For new studios',
    monthly: 99,
    price: 99,
    sst: 0.08,
    type: 'monthly-billed-annually',
    level: 'starter',
    highlight: 'Launch your studio',
  },
  {
    id: 'sw-standard',
    title: 'Studio Standard',
    subtitle: 'For growing studios',
    monthly: 299,
    price: 299,
    sst: 0.08,
    type: 'monthly-billed-annually',
    level: 'standard',
    highlight: 'For growing studios',
  },
  {
    id: 'sw-pro',
    title: 'Studio Pro',
    subtitle: 'Scale up',
    monthly: 499,
    price: 499,
    sst: 0.08,
    type: 'monthly-billed-annually',
    level: 'pro',
    highlight: 'Scale with marketing & ticketing',
  },
  {
    id: 'sw-advanced',
    title: 'Studio Advanced',
    subtitle: 'Most popular',
    monthly: 699,
    price: 699,
    sst: 0.08,
    type: 'monthly-billed-annually',
    level: 'advanced',
    highlight: 'Loyalty, rewards & automation',
    badge: 'Most Popular',
    recommended: true,
  },
  {
    id: 'sw-enterprise',
    title: 'Studio Enterprise',
    subtitle: 'Chains & groups',
    monthly: 2699,
    price: 2699,
    sst: 0.08,
    type: 'monthly-billed-annually',
    level: 'enterprise',
    highlight: 'Chains, hotels, wellness groups',
  },
];

// Tiers offered by the QuoteStudio builder / public quote view / /qstudio/pricing.
// The RM99 'Studio Starter' tier was retired (Jun 2026) — it stays in SOFTWARE_TIERS
// so the themepark pricing page (which keeps its own Starter price) is untouched,
// but every other surface renders this 4-tier list instead.
export const QUOTE_SOFTWARE_TIERS: StudioTier[] = SOFTWARE_TIERS.filter(t => t.level !== 'starter');

// Bump when the feature matrix / tier line-up changes in a way that should NOT
// retroactively alter already-sent quotes. New quotes stamp this into selections;
// the /qref view renders the legacy matrix for quotes below this version.
export const CATALOG_VERSION = 2;

// ─── Feature comparison matrix ──────────────────────────────────────────────
// Each row has 5 cells (one per tier). A cell is either:
//   true   → ✓ (included)
//   false  → not included (blank/dash)
//   string → custom text (e.g. "Unlimited", "10 products", "Customized", "coming soon")

export type CellValue = boolean | string;

export interface FeatureRow {
  feature: string;
  tooltip: string;
  cells: Record<TierLevel, CellValue>;
  subtitle?: string;
}

export interface FeatureGroup {
  title: string;
  rows: FeatureRow[];
}

const C = (s: CellValue, st: CellValue, p: CellValue, a: CellValue, e: CellValue):
  Record<TierLevel, CellValue> => ({ starter: s, standard: st, pro: p, advanced: a, enterprise: e });

// Frozen snapshot of the pre-v2 matrix. Rendered by /qref for quotes saved
// before CATALOG_VERSION 2 so already-sent quotes never change. Do not edit.
export const LEGACY_FEATURE_GROUPS: FeatureGroup[] = [
  {
    title: 'POS',
    rows: [
      { feature: 'Counter POS',                 tooltip: 'Ring up sales fast from any device — no pen, no paper.',                       cells: C(true, true, true, true, true) },
      { feature: 'Customer Website',            tooltip: 'A simple branded site members can find and book from.',                       cells: C(true, true, true, true, true) },
      { feature: 'Sales & Finance Reports',     tooltip: 'End-of-day numbers without a spreadsheet.',                                   cells: C(true, true, true, true, true) },
      { feature: 'Data Export',                 tooltip: 'Pull a CSV any time — your data is yours.',                                   cells: C(true, true, true, true, true) },
      { feature: 'Payment System',              tooltip: 'Take cards, e-wallets, and QR — all in one tap.',                             cells: C(true, true, true, true, true) },
      { feature: 'All-in-one Dashboard',        tooltip: 'One screen for sales, members, schedule — your whole studio at a glance.',    cells: C(true, true, true, true, true) },
      { feature: 'Data Analytics',              tooltip: 'Filter by date, branch, or staff — answer questions a spreadsheet can\'t.',   cells: C(true, true, true, true, true) },
      { feature: 'AI Insights',                 tooltip: 'AI flags trends and outliers automatically — what\'s growing, what\'s stalling.', cells: C(false, false, false, true, true) },
      { feature: 'Products Management',         tooltip: 'Bundle and price your packages, classes, and merch in one place.',            cells: C('10 products', '50 products', 'Unlimited', 'Unlimited', 'Unlimited') },
    ],
  },
  {
    title: 'Membership',
    rows: [
      { feature: 'Recurring Member Payment',    tooltip: 'Auto-bill members monthly — fewer chases, better retention.',                 cells: C(true, true, true, true, true) },
      { feature: 'Member Profile Setup',        tooltip: 'One profile per member — history, payments, preferences in one place.',      cells: C(true, true, true, true, true) },
      { feature: 'QR Code Check-in',            tooltip: 'Members scan in 2 seconds — no front-desk queue.',                            cells: C(true, true, true, true, true) },
      { feature: 'Face ID Check-in',            tooltip: 'Walk-in, walk-up, walk-on the floor — no card or phone needed.',              cells: C(false, true, true, true, true) },
      { feature: 'E-Agreement Sign Feature',    tooltip: 'Membership contracts signed on the spot — no printer required.',              cells: C(false, false, true, true, true) },
      { feature: 'Door Access / Turnstile Mgmt', tooltip: 'Gates open only for valid members — auto and secure.',                       cells: C(false, false, true, true, true) },
      { feature: 'Family / Bundle Pass',        tooltip: 'Share one pass across family — without sharing logins.',                      cells: C(false, false, true, true, true) },
      { feature: 'Members',                     tooltip: 'Sign up as many as you want — no per-member fees.',                           cells: C('Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited') },
      { feature: 'Franchise Model',             tooltip: 'Roll out one brand across many branches with central control.',               cells: C(false, false, false, false, 'Customized') },
    ],
  },
  {
    title: 'Staff',
    rows: [
      { feature: 'Staff Check-in System',       tooltip: 'Staff clock in/out from the same system — no separate app.',                  cells: C(true, true, true, true, true) },
      { feature: 'Timesheet',                   tooltip: 'Hours logged automatically — no end-of-month chaos.',                         cells: C(true, true, true, true, true) },
      { feature: 'Activity Log',                tooltip: 'See who did what, when — accountability built in.',                           cells: C(true, true, true, true, true) },
      { feature: 'Staff Commissions Mgmt',      tooltip: 'Pay PTs and trainers based on what they actually sold.',                      cells: C(false, false, false, true, true) },
      { feature: 'Staff Accounts',              tooltip: 'Add team members — additional staff billed at a fixed rate.',                 cells: C('1 staff', '10 staff', 'Unlimited', 'Unlimited', 'Unlimited') },
      { feature: 'Outlets',                     tooltip: 'Manage multiple locations from one account.',                                 cells: C('1 outlet', '1 outlet', '1 outlet', 'Unlimited', 'Unlimited') },
      { feature: 'Devices',                     tooltip: 'Connect multiple POS / Face ID devices to your outlet.',                      cells: C('1', '1', 'Unlimited', 'Unlimited', 'Unlimited') },
    ],
  },
  {
    title: 'Booking & Schedule',
    rows: [
      { feature: 'Schedule Classes & Facilities', tooltip: 'Yoga, HIIT, PT slots, facilities — all bookable from one calendar.',       cells: C(false, true, true, true, true) },
      { feature: 'Pricing Plan Management',     tooltip: 'Set member tiers, drop-in fees, package deals — your rules.',                 cells: C(false, true, true, true, true) },
      { feature: 'Calendar-Based Scheduler',    tooltip: 'Drag, drop, done — your week at a glance.',                                   cells: C(false, true, true, true, true) },
      { feature: 'Member Booking via App/Web',  tooltip: 'Members book themselves — no DMs at 11pm.',                                   cells: C(false, true, true, true, true) },
      { feature: 'Customized Rules',            tooltip: 'Limit class sizes, no-show fees, refund windows — your way.',                 cells: C(false, false, true, true, true) },
    ],
  },
  {
    title: 'Marketing',
    rows: [
      { feature: 'Leads Management',            tooltip: 'Capture interested visitors and follow up without losing track.',             cells: C(false, false, true, true, true) },
      { feature: 'Email Blast',                 tooltip: 'Send promos to all members — tokens charged per send.',                       cells: C(false, false, true, true, true) },
      { feature: 'WhatsApp Blast',              tooltip: 'Reach members where they actually read — tokens charged per send.',           cells: C(false, false, true, true, true) },
    ],
  },
  {
    title: 'Loyalty & Rewards',
    rows: [
      { feature: 'Voucher Management',          tooltip: 'Spin up promo codes for any campaign in minutes.',                            cells: C(false, false, true, true, true) },
      { feature: 'Digital Stamp Card',          tooltip: '10 visits = 1 free — automated, fraud-proof.',                                cells: C(false, false, true, true, true) },
      { feature: 'Points & Rewards',            tooltip: 'Members earn points on every visit — spend them on perks.',                   cells: C(false, false, false, true, true) },
    ],
  },
  {
    title: 'Ticketing',
    rows: [
      { feature: 'QR Tickets',                  tooltip: 'One-time entry tickets — perfect for events and trials.',                     cells: C(false, false, true, true, true) },
      { feature: 'Face Check-in Tickets',       tooltip: 'Skip the QR — your face is the ticket.',                                       cells: C(false, false, true, true, true) },
      { feature: 'Time-Based Tickets',          tooltip: 'Hour passes, day passes, week passes — all timed.',                            cells: C(false, false, false, true, true) },
      { feature: 'Advanced Tickets',            tooltip: 'Bundles, group tickets, tiered access — flexible setups.',                     cells: C(false, false, false, true, true) },
    ],
  },
  {
    title: 'Inventory System',
    rows: [
      { feature: 'Supplier Management',         tooltip: 'Track who supplies what and when restocks are due.',                          cells: C(false, false, true, true, true) },
      { feature: 'Stock Management',            tooltip: 'Know what\'s in stock before someone asks.',                                  cells: C(false, false, true, true, true) },
      { feature: 'Stock Items',                 tooltip: 'Track everything from towels to protein bars.',                               cells: C(false, false, 'Unlimited', 'Unlimited', 'Unlimited') },
    ],
  },
  {
    title: 'Integrations',
    rows: [
      { feature: 'Class Pass Integration',      tooltip: 'Sync Class Pass bookings into your QStudio schedule — launching soon.',         cells: C('Coming Soon', 'Coming Soon', 'Coming Soon', 'Coming Soon', 'Coming Soon') },
      { feature: 'Customized Integration',      tooltip: 'Bespoke integration with your existing tools — launching soon.',                cells: C('Coming Soon', 'Coming Soon', 'Coming Soon', 'Coming Soon', 'Coming Soon') },
      { feature: 'Customized Modules',          tooltip: 'Tailor-made modules built for your workflow — only on Advanced and Enterprise.', cells: C(false, false, false, true, true) },
      { feature: 'Vending Machine Integration', tooltip: 'Self-serve vending tied to member accounts — launching soon.',                  cells: C('Coming Soon', 'Coming Soon', 'Coming Soon', 'Coming Soon', 'Coming Soon') },
    ],
  },
  {
    title: 'Push Notifications',
    rows: [
      { feature: 'Daily Sales Report',          tooltip: 'Yesterday\'s numbers on your phone before your first coffee — app push or WhatsApp.', cells: C(false, true, true, true, true) },
      { feature: 'Check-in Report',             tooltip: 'Who came in and when — sent to your phone daily.',                            cells: C(false, true, true, true, true) },
      { feature: 'Abnormal Check-in',           tooltip: 'Get notified if something looks off — suspicious patterns flagged.',          cells: C(false, false, true, true, true) },
      { feature: 'Expiring Members',            tooltip: 'Heads-up before members lapse — renew before they drift away.',               cells: C(false, false, true, true, true) },
      { feature: 'Low Sales Alert',             tooltip: 'Get pinged when sales dip below your threshold.',                              cells: C(false, false, false, true, true) },
      { feature: 'Branch Performance Summary',  tooltip: 'Multi-branch numbers in one message.',                                        cells: C(false, false, false, true, true) },
      { feature: 'Top Selling Services / Products', tooltip: 'Know your bestsellers — and double down on them.',                         cells: C(false, false, false, true, true) },
      { feature: 'Staff Late Notifications',    tooltip: 'Auto-alert when staff don\'t clock in on time.',                              cells: C(false, false, false, true, true) },
      { feature: 'Customized Notifications',    tooltip: 'Pick exactly what you want pinged about — your way.',                          cells: C(false, false, false, false, true) },
    ],
  },
];

// ─── Active feature comparison matrix (CATALOG_VERSION 2, Jun 2026) ──────────
// Rendered by the quote builder, /qstudio/pricing, and /qref for new quotes.
// The 'starter' cell is never displayed (QUOTE_SOFTWARE_TIERS drops Starter) —
// it mirrors the 'standard' value purely to satisfy the 5-tuple shape.
export const FEATURE_GROUPS: FeatureGroup[] = [
  {
    title: 'Platforms',
    rows: [
      { feature: 'Own Laptop / PC',             tooltip: 'Run your whole studio from any laptop or desktop browser — nothing to install.', cells: C(true, true, true, true, true) },
      { feature: 'Counter POS',                 tooltip: 'Ring up sales fast from any device — no pen, no paper.',                       cells: C(true, true, true, true, true) },
      { feature: 'Self-Service Kiosk',          tooltip: 'Let members check in and buy on a self-serve kiosk — no front desk needed.',  cells: C(false, false, true, true, true) },
      { feature: 'Webstore',                    tooltip: 'A branded online store members can browse and buy from.',                      cells: C(false, false, true, true, true) },
      { feature: 'QR',                          tooltip: 'QR ordering and check-in — scan and go.',                                     cells: C(false, false, true, true, true) },
      { feature: 'Studio App',                  tooltip: 'Members book, pay, and check in from the QStudio member app.',                 cells: C(true, true, true, true, true) },
      { feature: 'Branded App (*additional charge)', tooltip: 'Your own logo and name on the app stores — billed separately.',           cells: C(false, false, false, true, true) },
    ],
  },
  {
    title: 'Reporting',
    rows: [
      { feature: 'All-in-one Dashboard',        tooltip: 'One screen for sales, members, schedule — your whole studio at a glance.',    cells: C(true, true, true, true, true) },
      { feature: 'Sales & Finance Reports',     tooltip: 'End-of-day numbers without a spreadsheet.',                                   cells: C(true, true, true, true, true) },
      { feature: 'Data Export',                 tooltip: 'Pull a CSV any time — your data is yours.',                                   cells: C(true, true, true, true, true) },
      { feature: 'Payment System',              tooltip: 'Take cards, e-wallets, and QR — all in one tap.',                             cells: C(true, true, true, true, true) },
      { feature: 'Data Analytics',              tooltip: 'Filter by date, branch, or staff — answer questions a spreadsheet can\'t.',   cells: C(true, true, true, true, true) },
      { feature: 'AI Insights',                 tooltip: 'AI flags trends and outliers automatically — what\'s growing, what\'s stalling.', cells: C(false, false, false, true, true) },
      { feature: 'Products Management',         tooltip: 'Bundle and price your packages, classes, and merch in one place.',            cells: C('50 products', '50 products', '200 products', 'Unlimited', 'Unlimited') },
    ],
  },
  {
    title: 'Membership',
    rows: [
      { feature: 'Recurring Member Payment',    tooltip: 'Auto-bill members monthly — fewer chases, better retention.',                 cells: C(true, true, true, true, true) },
      { feature: 'Member Profile Setup',        tooltip: 'One profile per member — history, payments, preferences in one place.',      cells: C(true, true, true, true, true) },
      { feature: 'QR Code Check-in',            tooltip: 'Members scan in 2 seconds — no front-desk queue.',                            cells: C(true, true, true, true, true) },
      { feature: 'Face ID Check-in',            tooltip: 'Walk-in, walk-up, walk-on the floor — no card or phone needed.',              cells: C(false, false, true, true, true) },
      { feature: 'E-Agreement Sign Feature',    tooltip: 'Membership contracts signed on the spot — no printer required.',              cells: C(false, false, true, true, true) },
      { feature: 'Door Access / Turnstile Mgmt', tooltip: 'Gates open only for valid members — auto and secure.',                       cells: C(false, false, true, true, true) },
      { feature: 'Family / Bundle Pass',        tooltip: 'Share one pass across family — without sharing logins.',                      cells: C(false, false, false, true, true) },
      { feature: 'Members',                     tooltip: 'How many member profiles you can hold on your plan.',                         cells: C('1,000', '1,000', '3,000', 'Unlimited', 'Unlimited') },
      { feature: 'Franchise Model',             tooltip: 'Roll out one brand across many branches with central control.',               cells: C(false, false, false, false, 'Customized') },
    ],
  },
  {
    title: 'Staff',
    rows: [
      { feature: 'Staff Check-in System',       tooltip: 'Staff clock in/out from the same system — no separate app.',                  cells: C(true, true, true, true, true) },
      { feature: 'Timesheet',                   tooltip: 'Hours logged automatically — no end-of-month chaos.',                         cells: C(true, true, true, true, true) },
      { feature: 'Activity Log',                tooltip: 'See who did what, when — accountability built in.',                           cells: C(true, true, true, true, true) },
      { feature: 'Staff Commissions Mgmt',      tooltip: 'Pay PTs and trainers based on what they actually sold.',                      cells: C(false, false, false, true, true) },
      { feature: 'Staff Accounts',              tooltip: 'Add team members — additional staff billed at a fixed rate.',                 cells: C('10 staff', '10 staff', 'Unlimited', 'Unlimited', 'Unlimited') },
      { feature: 'Outlets',                     tooltip: 'Manage multiple locations from one account.',                                 cells: C('1 outlet', '1 outlet', '1 outlet', 'Unlimited', 'Unlimited') },
      { feature: 'Devices',                     tooltip: 'Connect multiple POS / Face ID devices to your outlet.',                      cells: C('1', '1', 'Unlimited', 'Unlimited', 'Unlimited') },
    ],
  },
  {
    title: 'Booking & Schedule',
    rows: [
      { feature: 'Schedule Classes & Facilities', tooltip: 'Yoga, HIIT, PT slots, facilities — all bookable from one calendar.',       cells: C(true, true, true, true, true) },
      { feature: 'Pricing Plan Management',     tooltip: 'Set member tiers, drop-in fees, package deals — your rules.',                 cells: C(true, true, true, true, true) },
      { feature: 'Calendar-Based Scheduler',    tooltip: 'Drag, drop, done — your week at a glance.',                                   cells: C(true, true, true, true, true) },
      { feature: 'Member Booking via App/Web',  tooltip: 'Members book themselves — no DMs at 11pm.',                                   cells: C(false, false, true, true, true) },
      { feature: 'Customized Rules',            tooltip: 'Limit class sizes, no-show fees, refund windows — your way.',                 cells: C(false, false, true, true, true) },
    ],
  },
  {
    title: 'Marketing',
    rows: [
      { feature: 'Leads Management',            tooltip: 'Capture interested visitors and follow up without losing track.',             cells: C(false, false, true, true, true) },
      { feature: 'Email Blast',                 tooltip: 'Send promos to all members — tokens charged per send.',                       cells: C(false, false, true, true, true) },
      { feature: 'WhatsApp Blast',              tooltip: 'Reach members where they actually read — tokens charged per send.',           cells: C(false, false, false, true, true) },
    ],
  },
  {
    title: 'Loyalty & Rewards',
    rows: [
      { feature: 'Voucher Management',          tooltip: 'Spin up promo codes for any campaign in minutes.',                            cells: C(false, false, true, true, true) },
      { feature: 'Points & Rewards',            tooltip: 'Members earn points on every visit — spend them on perks.',                   cells: C(false, false, false, true, true) },
    ],
  },
  {
    title: 'Ticketing',
    rows: [
      { feature: 'QR Tickets',                  tooltip: 'One-time entry tickets — perfect for events and trials.',                     cells: C(false, false, true, true, true) },
      { feature: 'Face Check-in Tickets',       tooltip: 'Skip the QR — your face is the ticket.',                                       cells: C(false, false, true, true, true) },
      { feature: 'Time-Based Tickets',          tooltip: 'Hour passes, day passes, week passes — all timed.',                            cells: C(false, false, false, true, true) },
      { feature: 'Advanced Tickets',            tooltip: 'Bundles, group tickets, tiered access — flexible setups.',                     cells: C(false, false, false, true, true) },
    ],
  },
  {
    title: 'Inventory System',
    rows: [
      { feature: 'Supplier Management',         tooltip: 'Track who supplies what and when restocks are due.',                          cells: C(false, false, true, true, true) },
      { feature: 'Stock Management',            tooltip: 'Know what\'s in stock before someone asks.',                                  cells: C(false, false, true, true, true) },
      { feature: 'Stock Items',                 tooltip: 'Track everything from towels to protein bars.',                               cells: C(false, false, 'Unlimited', 'Unlimited', 'Unlimited') },
    ],
  },
  {
    title: 'Integrations',
    rows: [
      { feature: 'Class Pass Integration',              tooltip: 'Sync Class Pass bookings into your QStudio schedule — launching soon.',     cells: C('Coming Soon', 'Coming Soon', 'Coming Soon', 'Coming Soon', 'Coming Soon') },
      { feature: 'Customized Integration',              tooltip: 'Bespoke integration with your existing tools — launching soon.',            cells: C('Coming Soon', 'Coming Soon', 'Coming Soon', 'Coming Soon', 'Coming Soon') },
      { feature: 'Vending Machine Integration',         tooltip: 'Self-serve vending tied to member accounts — launching soon.',              cells: C('Coming Soon', 'Coming Soon', 'Coming Soon', 'Coming Soon', 'Coming Soon') },
      { feature: 'Body Composition Monitor Integration', tooltip: 'Sync body-composition scans to member profiles — launching soon.',          cells: C('Coming Soon', 'Coming Soon', 'Coming Soon', 'Coming Soon', 'Coming Soon') },
      { feature: 'Customized Modules (*one-time fees)', tooltip: 'Tailor-made modules built for your workflow — one-time build fees apply.',   cells: C(false, false, false, true, true) },
      { feature: 'Multi-brands',                        tooltip: 'Run several brands from one account — Enterprise only.',                     cells: C(false, false, false, false, true) },
      { feature: 'IoT (Lighting, Aircond, etc.)',       tooltip: 'Tie lighting, air-con, and devices to your system — Enterprise only.',      cells: C(false, false, false, false, true) },
    ],
  },
  {
    title: 'Push Notifications — Internal',
    rows: [
      { feature: 'Daily Sales Report',          tooltip: 'Yesterday\'s numbers on your phone before your first coffee — app push or WhatsApp.', cells: C(true, true, true, true, true) },
      { feature: 'Check-in Report',             tooltip: 'Who came in and when — sent to your phone daily.',                            cells: C(true, true, true, true, true) },
      { feature: 'Abnormal Check-in',           tooltip: 'Get notified if something looks off — suspicious patterns flagged.',          cells: C(false, false, true, true, true) },
      { feature: 'Expiring Members',            tooltip: 'Heads-up before members lapse — renew before they drift away.',               cells: C(false, false, true, true, true) },
      { feature: 'Low Sales Alert',             tooltip: 'Get pinged when sales dip below your threshold.',                              cells: C(false, false, false, true, true) },
      { feature: 'Branch Performance Summary',  tooltip: 'Multi-branch numbers in one message.',                                        cells: C(false, false, false, true, true) },
      { feature: 'Top Selling Services / Products', tooltip: 'Know your bestsellers — and double down on them.',                         cells: C(false, false, false, true, true) },
      { feature: 'Staff Late Notifications',    tooltip: 'Auto-alert when staff don\'t clock in on time.',                              cells: C(false, false, false, true, true) },
      { feature: 'Customized Notifications',    tooltip: 'Pick exactly what you want pinged about — your way.',                          cells: C(false, false, false, false, true) },
    ],
  },
  {
    title: 'Push Notifications — Customers',
    rows: [
      { feature: 'Expiring Membership Reminder', tooltip: 'Auto-remind members before their plan lapses — renew before they drift away.', cells: C(false, false, true, true, true) },
      { feature: 'Class Reminder',              tooltip: 'Nudge members before their booked class — fewer no-shows.',                   cells: C(false, false, true, true, true) },
      { feature: 'Birthday Reminder',           tooltip: 'Auto-send a birthday greeting or perk — keep members feeling seen.',          cells: C(false, false, false, true, true) },
      { feature: 'Customized Reminders',        tooltip: 'Build your own member reminder triggers — your way.',                         cells: C(false, false, false, true, true) },
    ],
  },
  {
    title: 'Support',
    rows: [
      { feature: 'Ticketing Support',           tooltip: 'Raise a support ticket any time — tracked to resolution.',                   cells: C(true, true, true, true, true) },
      { feature: 'Dedicated WhatsApp Support',  tooltip: 'A direct WhatsApp line to our team — Advanced onwards.',                      cells: C(false, false, false, true, true) },
      { feature: 'VIP Support',                 tooltip: 'Priority, white-glove support for Enterprise accounts.',                      cells: C(false, false, false, false, true) },
    ],
  },
];

// True if the cell represents inclusion (checkmark OR a non-empty value like "Unlimited").
// False/empty-string/empty-trim → not included.
export function isCellIncluded(cell: CellValue): boolean {
  if (typeof cell === 'boolean') return cell;
  return typeof cell === 'string' && cell.trim().length > 0;
}

// Grouped list of features available at a given tier — for the saved PDF.
export interface TierFeatureGroup {
  group: string;
  items: string[]; // "Feature Name" or "Feature Name (value)"
}

export function getTierFeatureGroups(tierLevel: TierLevel): TierFeatureGroup[] {
  const out: TierFeatureGroup[] = [];
  for (const g of FEATURE_GROUPS) {
    const items: string[] = [];
    for (const row of g.rows) {
      const cell = row.cells[tierLevel];
      if (!isCellIncluded(cell)) continue;
      if (typeof cell === 'string' && cell.trim().length > 0 && cell.toLowerCase() !== 'coming soon') {
        items.push(`${row.feature} (${cell})`);
      } else if (typeof cell === 'string' && cell.toLowerCase() === 'coming soon') {
        items.push(`${row.feature} (coming soon)`);
      } else {
        items.push(row.feature);
      }
    }
    if (items.length > 0) out.push({ group: g.title, items });
  }
  return out;
}

// ─── Additional Outlets / Devices (annual subscription, 8% SST, editable price) ───
// Mirrors QuoteSys's "STUDIO Additional Device / Additional Outlet" items, but:
// - Charged annually (qty × annual price)
// - Default price is the sales-team baseline; sales rep can override per quote
//   because different gyms negotiate different monthly rates.
// The catalog price below is RM/year (default = QuoteSys monthly × 12).
export const ADDITIONAL_OUTLET_ITEMS: StudioCatalogItem[] = [
  {
    id: 'studio-add-outlet',
    title: 'STUDIO Additional Outlet',
    subtitle: 'Per outlet · billed annually · price editable',
    description: 'Add a new physical branch to your Studio account. Each outlet is billed yearly; rate is negotiable per gym.',
    price: 129 * 12, // RM 1,548 / outlet / yr (default — editable per quote)
    sst: 0.08,
    type: 'flat-annual',
  },
  {
    id: 'studio-add-device',
    title: 'STUDIO Additional Device',
    subtitle: 'Per extra POS device · billed annually · price editable',
    description: 'Add another POS device to your existing outlet. Yearly billing; rate is negotiable per gym.',
    price: 69 * 12, // RM 828 / device / yr (default — editable per quote)
    sst: 0.08,
    type: 'flat-annual',
  },
];

// ─── Setup & Training (one-time, 8% SST) ───
export const SETUP_AND_TRAINING: StudioCatalogItem = {
  id: 'setup-train',
  title: 'Setup & Training',
  subtitle: 'On-site installation + 4-hour staff training',
  description: 'We come on-site, install everything, and train your team end-to-end.',
  benefits: [
    'On-site hardware installation',
    '4-hour staff training session',
    '30-day post-launch hand-holding',
  ],
  price: 800,
  sst: 0.08,
  type: 'one-time',
};

// ─── Payment Gateway Registration (one-time, 8% SST, opt-in) ───
export const PAYMENT_GATEWAY_REGISTRATION: StudioCatalogItem = {
  id: 'payment-gateway-reg',
  title: 'Payment Gateway Registration',
  subtitle: 'One-time registration & onboarding fee',
  description: 'We register your business with our payment gateway partner and complete the onboarding paperwork.',
  benefits: [
    'Gateway account application & KYC',
    'Settlement bank account linking',
    'Test transactions before go-live',
  ],
  price: 500,
  sst: 0.08,
  type: 'one-time',
};

// ─── Delivery (one-time, 8% SST, single-select) ───
export const DELIVERY_ZONES: StudioCatalogItem[] = [
  {
    id: 'del-kv',
    title: 'Klang Valley',
    subtitle: 'KL, PJ, Selangor',
    price: 300,
    sst: 0.08,
    type: 'one-time',
  },
  {
    id: 'del-wm',
    title: 'West Malaysia',
    subtitle: 'Outside Klang Valley',
    price: 500,
    sst: 0.08,
    type: 'one-time',
  },
  {
    id: 'del-em',
    title: 'East Malaysia',
    subtitle: 'Sabah & Sarawak',
    price: 800,
    sst: 0.08,
    type: 'one-time',
  },
];

// ─── Helpers ───
export const ALL_HARDWARE = [...ENTRY_GATES, ...POS_ITEMS, ...OTHER_HARDWARE];

export function findItem(id: string): StudioCatalogItem | undefined {
  return ALL_HARDWARE.find(i => i.id === id)
      ?? SOFTWARE_TIERS.find(i => i.id === id)
      ?? DELIVERY_ZONES.find(i => i.id === id)
      ?? ADDITIONAL_OUTLET_ITEMS.find(i => i.id === id)
      ?? (SETUP_AND_TRAINING.id === id ? SETUP_AND_TRAINING : undefined)
      ?? (PAYMENT_GATEWAY_REGISTRATION.id === id ? PAYMENT_GATEWAY_REGISTRATION : undefined);
}

export function findAdditionalOutletItem(id: string): StudioCatalogItem | undefined {
  return ADDITIONAL_OUTLET_ITEMS.find(i => i.id === id);
}

export function findTier(id: string | null): StudioTier | undefined {
  return id ? SOFTWARE_TIERS.find(t => t.id === id) : undefined;
}

export function findDelivery(id: string | null): StudioCatalogItem | undefined {
  return id ? DELIVERY_ZONES.find(d => d.id === id) : undefined;
}

export const SETUP_WAIVER_AMOUNT = 800;

// ─── Project Rollout Timeline ──────────────────────────────────────────────
// 8-week rollout from confirmation to launch. Confirmation kicks off W1.
// Launch is a milestone on the Monday AFTER W8 (= W9 Monday) — shown
// separately, not in the 8-column grid.
export interface TimelinePhase {
  id: string;
  title: string;
  startWeek: number; // 1-indexed
  endWeek: number;   // inclusive
  highlight?: boolean;
  note?: string;
}

export const TIMELINE_TOTAL_WEEKS = 8;

export const PROJECT_TIMELINE: TimelinePhase[] = [
  { id: 'confirm',  title: 'Confirmation & 50% Deposit', startWeek: 1, endWeek: 1, highlight: true, note: 'Project kick-off' },
  { id: 'onboard',  title: 'Client Onboarding',          startWeek: 1, endWeek: 1 },
  { id: 'hardware', title: 'Hardware Order',             startWeek: 2, endWeek: 5, note: 'Approx. 1 month' },
  { id: 'payment',  title: 'Payment Gateway Setup',      startWeek: 2, endWeek: 4, note: '2–3 weeks' },
  { id: 'setup',    title: 'Setup & Testing',            startWeek: 2, endWeek: 5 },
  { id: 'preview',  title: 'Preview & Review',           startWeek: 4, endWeek: 6 },
  { id: 'delivery', title: 'Delivery',                   startWeek: 7, endWeek: 8, note: '2 weeks' },
  { id: 'install',  title: 'Installation & Training',    startWeek: 7, endWeek: 7 },
];

// ─── Date helpers ──────────────────────────────────────────────────────────
// W1 always starts on a Monday. If user picks Wed → snap forward to next Mon.

export function snapToNextMonday(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  const day = r.getDay(); // 0=Sun, 1=Mon ... 6=Sat
  const diff = day === 1 ? 0 : (1 - day + 7) % 7;
  r.setDate(r.getDate() + diff);
  return r;
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

// W1 = startMonday + 0d; W8 = startMonday + 49d (W8 Mon).
// Week label uses Monday-of-week date.
export function weekStartDate(startMonday: Date, weekNum: number): Date {
  return addDays(startMonday, (weekNum - 1) * 7);
}

// Launch = W9 Monday = 56 days after W1 Monday.
export function computeLaunchDate(startMonday: Date): Date {
  return addDays(startMonday, TIMELINE_TOTAL_WEEKS * 7);
}

// ISO YYYY-MM-DD parser/formatter for the <input type=date> field.
export function toISODate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

// ─── Malaysian phone normalization ─────────────────────────────────────────
// Always produce "+60 <local>" so quotes display the country code.
// Accepts inputs like "012-345 6789", "12345 6789", "+60123456789", "60123456789".
export function normalizeMyPhone(raw: string): string {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (trimmed.startsWith('+')) return trimmed;
  const digits = trimmed.replace(/\D/g, '');
  let local = digits;
  if (local.startsWith('60')) local = local.slice(2);
  if (local.startsWith('0')) local = local.slice(1);
  return `+60 ${local}`;
}
