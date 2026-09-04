// QuoteSys catalog — internal sales-team pricing items.
// Add / edit items in the CATALOG array below. The page renders categories in
// the order defined in CATEGORIES (hardware → software → setup → delivery).
// Within each category, items are grouped by `subcategory` for easier scanning.
//
// SST rules (Malaysia, Mar 2024 onwards):
//  - Hardware:                          0% SST
//  - Software / Subscription / Setup / Delivery (services): 8% SST

export type SstRate = 0 | 0.08;

// 'one-time'  = billed once, included in one-time total
// 'recurring' = monthly subscription (price = RM/mo), bundled into yearly total ×12
// 'yearly'    = annual subscription (price = RM/yr), added to yearly total ×1
export type ItemType = 'one-time' | 'recurring' | 'yearly';

export type CategoryId = 'hardware' | 'software' | 'setup' | 'delivery' | 'custom';

export interface CatalogItem {
  id: string;
  title: string;
  subcategory?: string;   // e.g. 'POS', 'KIOSK (Hang)', 'Turnstile Long' — used to group items inside a category
  description?: string;
  details?: string;       // optional multi-line disclosure (rate schedules, settlement terms) — shown on card + PDF
  price: number;          // RM, exclusive of SST. Use 0 for FOC / variable items and set priceLabel.
  priceLabel?: string;    // overrides the RM display when set (e.g. 'FOC', '0.5% per transaction')
  sst: SstRate;
  type: ItemType;
  category: CategoryId;
  secondYearHalfPrice?: boolean;  // if true, builder shows a "50% on 2nd year onwards" toggle for this item
  // For recurring items: contract length in months. Defaults to 12.
  // Line item amount = price × qty × contractMonths.
  // Yearly subscription summary still uses × 12 regardless — set to 24 for
  // 2-year packages so the line shows the full contract total while the
  // annual figure remains a true 12-month value.
  contractMonths?: number;
  image?: string;         // optional thumbnail path (served from /public, e.g. '/quotesys_images/sunmi_d3_pro.jpg')
}

export interface Category {
  id: CategoryId;
  title: string;
  sstLabel: string;
}

export const CATEGORIES: Category[] = [
  { id: 'hardware', title: 'Hardware',                sstLabel: '0% SST' },
  { id: 'software', title: 'Software & Subscription', sstLabel: '8% SST' },
  { id: 'setup',    title: 'Setup & Installation',    sstLabel: '8% SST' },
  { id: 'delivery', title: 'Optional Delivery',       sstLabel: '8% SST' },
  { id: 'custom',   title: 'Custom Items',            sstLabel: 'Varies' },
];

export const CATALOG: CatalogItem[] = [
  // ── HARDWARE — POS / MPOS (0% SST) ──
  { id: 'hw-sunmi-d3-pro',       title: 'Sunmi D3 Pro',        subcategory: 'POS',  price: 4080, sst: 0, type: 'one-time', category: 'hardware', image: '/quotesys_images/sunmi_d3_pro.jpg' },
  { id: 'hw-sunmi-cpad',         title: 'Sunmi cPad',          subcategory: 'POS',  price: 2280, sst: 0, type: 'one-time', category: 'hardware', image: '/quotesys_images/ipad.jpg' },
  { id: 'hw-sunmi-v3-mix',       title: 'Sunmi V3 Mix',        subcategory: 'POS',  price: 3480, sst: 0, type: 'one-time', category: 'hardware', image: '/quotesys_images/sunmi_v3_mix.jpg' },
  { id: 'hw-v3-mix-wall-mount',  title: 'V3 Mix Wall Mount',   subcategory: 'POS',  price: 350,  sst: 0, type: 'one-time', category: 'hardware', image: '/quotesys_images/sunmi_v3_mix_wallmount.jpg' },
  { id: 'hw-sunmi-v3-mini',      title: 'Sunmi V3 Mini',       subcategory: 'POS',  price: 2880, sst: 0, type: 'one-time', category: 'hardware', image: '/quotesys_images/sunmi_d3_mini.jpg' },
  { id: 'hw-sunmi-v3',           title: 'Sunmi V3',            subcategory: 'MPOS', price: 1440, sst: 0, type: 'one-time', category: 'hardware', image: '/quotesys_images/sunmi_v3_terminal.jpg' },
  { id: 'hw-payment-terminal',   title: 'Payment Terminal',    subcategory: 'Payment Terminal', price: 900, sst: 0, type: 'one-time', category: 'hardware', image: '/quotesys_images/payment_terminal.jpg' },

  // ── HARDWARE — Kiosk (0% SST) ──
  { id: 'hw-q1-kiosk-desktop',   title: 'Q1 Kiosk Desktop 21.5"', subcategory: 'KIOSK Desktop', price: 7176,  sst: 0, type: 'one-time', category: 'hardware', image: '/quotesys_images/kiosk_q1_desktop.jpg' },
  { id: 'hw-q1-kiosk-desktop-27-flat', title: 'Q1 Kiosk Desktop 27" (Flat)', subcategory: 'KIOSK Desktop', price: 9676,  sst: 0, type: 'one-time', category: 'hardware', image: '/quotesys_images/kiosk_q1_desktop.jpg' },
  { id: 'hw-q1-kiosk-stand',     title: 'Q1 Kiosk Stand 21.5"',   subcategory: 'KIOSK Stand',   price: 500,   sst: 0, type: 'one-time', category: 'hardware', image: '/quotesys_images/kiosk_q1_stand.jpg' },
  { id: 'hw-sunmi-k2-mini',      title: 'Sunmi K2 Mini 16.5"',    subcategory: 'KIOSK (Hang)',  price: 6500,  sst: 0, type: 'one-time', category: 'hardware', image: '/quotesys_images/sunmi_k2_mini.jpg' },
  { id: 'hw-sunmi-k2',           title: 'Sunmi K2',               subcategory: 'KIOSK (Hang)',  price: 14800, sst: 0, type: 'one-time', category: 'hardware', image: '/quotesys_images/sunmi_k2.jpg' },
  { id: 'hw-sunmi-k2-stand',     title: 'Sunmi K2 Stand',         subcategory: 'KIOSK Stand',   price: 2500,  sst: 0, type: 'one-time', category: 'hardware' },

  // ── HARDWARE — Printers & Cash Drawers (0% SST) ──
  { id: 'hw-sunmi-cloud-printer',  title: 'Sunmi Cloud Printer',     subcategory: 'Cloud Kitchen Printer', price: 600, sst: 0, type: 'one-time', category: 'hardware', image: '/quotesys_images/sunmi_cloud_printer.jpg' },
  { id: 'hw-standard-cloud-printer', title: 'Standard Cloud Printer', subcategory: 'Cloud Kitchen Printer', price: 350, sst: 0, type: 'one-time', category: 'hardware', image: '/quotesys_images/standard_cloud_printer.jpg' },
  { id: 'hw-cash-drawer-5',        title: 'Cash Drawer (5 Cash Lanes)', subcategory: 'Cash Drawer',        price: 280, sst: 0, type: 'one-time', category: 'hardware', image: '/quotesys_images/cash_Drawer_5slot.jpg' },
  { id: 'hw-cash-drawer-4',        title: 'Cash Drawer (4 Cash Lanes)', subcategory: 'Cash Drawer',        price: 220, sst: 0, type: 'one-time', category: 'hardware', image: '/quotesys_images/cash_Drawer_4slot.jpg.jpg' },
  { id: 'hw-kiosk-printer',        title: 'Kiosk Printer',              subcategory: 'Thermal',            price: 500, sst: 0, type: 'one-time', category: 'hardware' },

  // ── HARDWARE — Face ID & Cameras (0% SST) ──
  { id: 'hw-face-id-cam-kiosk',     title: 'Face ID Camera (Kiosk)',     subcategory: 'Camera (Kiosk)',           price: 1500, sst: 0, type: 'one-time', category: 'hardware', image: '/quotesys_images/face_id.jpg' },
  { id: 'hw-face-id-cam-turnstile', title: 'Face ID Camera (Turnstile)', subcategory: 'Camera (Turnstile)',       price: 2500, sst: 0, type: 'one-time', category: 'hardware', image: '/quotesys_images/face_id.jpg' },
  { id: 'hw-face-id-door',          title: 'Face ID Door Access',        subcategory: 'Camera (Door)',            price: 2000, sst: 0, type: 'one-time', category: 'hardware', image: '/quotesys_images/face_id_door_access.jpg' },
  { id: 'hw-sentry-ip-camera',      title: 'Sentry IP Camera',           subcategory: 'Camera (Sentry IP Camera)', price: 350,  sst: 0, type: 'one-time', category: 'hardware' },

  // ── HARDWARE — Turnstiles (0% SST) ──
  { id: 'hw-turnstile-long-single',   title: 'Turnstile — Long (Single Gate)',   subcategory: 'Turnstile Long',   price: 12000, sst: 0, type: 'one-time', category: 'hardware', image: '/quotesys_images/turnstile_long_singlegate.jpg' },
  { id: 'hw-turnstile-long-double',   title: 'Turnstile — Long (Double Gate)',   subcategory: 'Turnstile Long',   price: 24000, sst: 0, type: 'one-time', category: 'hardware', image: '/quotesys_images/turnstile_long_doublegate.jpg' },
  { id: 'hw-turnstile-short-single',  title: 'Turnstile — Short (Single Gate)',  subcategory: 'Turnstile Short',  price: 13000, sst: 0, type: 'one-time', category: 'hardware' },
  { id: 'hw-turnstile-short-double',  title: 'Turnstile — Short (Double Gate)',  subcategory: 'Turnstile Short',  price: 26000, sst: 0, type: 'one-time', category: 'hardware' },
  { id: 'hw-turnstile-tripod-single', title: 'Turnstile — Tripod (Single)',      subcategory: 'Turnstile Tripod', price: 6500,  sst: 0, type: 'one-time', category: 'hardware', image: '/quotesys_images/turnstile_tripod_flap.jpg' },
  { id: 'hw-turnstile-single-flap',   title: 'Turnstile — Single Flap',          subcategory: 'Turnstile Flap',   price: 8700,  sst: 0, type: 'one-time', category: 'hardware', image: '/quotesys_images/turnstile_single_flap.jpg' },

  // ── SOFTWARE / SUBSCRIPTION (8% SST, recurring monthly) ──
  { id: 'sw-qpos-cloud-ai',          title: 'QPOS Cloud AI (Standard)',                    subcategory: 'Monthly Subscription',  price: 69,  sst: 0.08, type: 'recurring', category: 'software' },
  { id: 'sw-qpos-cloud-ai-std-2y',   title: 'QPOS Cloud AI (Standard) — 2 Years Package',  subcategory: '2-Year Package',        price: 69,  sst: 0.08, type: 'recurring', category: 'software', contractMonths: 24 },
  { id: 'sw-qpos-cloud-ai-pro',      title: 'QPOS Cloud AI (Pro)',                         subcategory: 'Monthly Subscription',  price: 129, sst: 0.08, type: 'recurring', category: 'software' },
  { id: 'sw-qpos-cloud-ai-pro-2y',   title: 'QPOS Cloud AI (Pro) — 2 Years Package',       subcategory: '2-Year Package',        price: 129, sst: 0.08, type: 'recurring', category: 'software', contractMonths: 24 },
  { id: 'sw-studio-membership',    title: 'STUDIO Membership',           subcategory: 'Monthly Subscription', price: 129, sst: 0.08, type: 'recurring', category: 'software' },
  { id: 'sw-studio-staff',         title: 'STUDIO Staff / Commission Sys', subcategory: 'Monthly Subscription', price: 69, sst: 0.08, type: 'recurring', category: 'software' },
  { id: 'sw-studio-face-id',       title: 'STUDIO Face ID',              subcategory: 'Monthly Subscription', price: 129, sst: 0.08, type: 'recurring', category: 'software' },
  { id: 'sw-sentry-ai-cctv',       title: 'Sentry AI CCTV',              subcategory: 'Monthly Subscription', price: 300, sst: 0.08, type: 'recurring', category: 'software' },
  { id: 'sw-studio-booking',       title: 'STUDIO Booking System',       subcategory: 'Monthly Subscription', price: 129, sst: 0.08, type: 'recurring', category: 'software' },
  { id: 'sw-qpos-add-device',      title: 'QPOS Additional Device',      subcategory: 'Monthly Subscription', price: 30,  sst: 0.08, type: 'recurring', category: 'software' },
  { id: 'sw-qpos-add-outlet',      title: 'QPOS Additional Outlet',      subcategory: 'Monthly Subscription', price: 69,  sst: 0.08, type: 'recurring', category: 'software' },
  { id: 'sw-studio-add-device',    title: 'STUDIO Additional Device',    subcategory: 'Monthly Subscription', price: 69,  sst: 0.08, type: 'recurring', category: 'software' },
  { id: 'sw-studio-add-outlet',    title: 'STUDIO Additional Outlet',    subcategory: 'Monthly Subscription', price: 129, sst: 0.08, type: 'recurring', category: 'software' },
  { id: 'sw-qpos-self-service',    title: 'QPOS Self-Service Module',    subcategory: 'Monthly Subscription', price: 69,  sst: 0.08, type: 'recurring', category: 'software' },
  { id: 'sw-qrpos-auto-reporting', title: 'Auto-Reporting (QRPOS)',      subcategory: 'Monthly Subscription', description: 'Automatically send report to Telegram for ultimate convenience', price: 12, sst: 0.08, type: 'recurring', category: 'software' },
  { id: 'sw-medicloud-suite',      title: 'MediCloud Suite',             subcategory: 'Monthly Subscription', price: 299, sst: 0.08, type: 'recurring', category: 'software', secondYearHalfPrice: true },
  { id: 'sw-propcloud-suite',      title: 'PropCloud Suite',             subcategory: 'Monthly Subscription', price: 299, sst: 0.08, type: 'recurring', category: 'software', secondYearHalfPrice: true },
  { id: 'sw-platform-fees',        title: 'Platform Fees 0.5%',          subcategory: 'Monthly Subscription', price: 0,   priceLabel: '0.5% per transaction', sst: 0.08, type: 'recurring', category: 'software' },
  { id: 'sw-qr-pos',               title: 'QR POS',                      subcategory: 'Yearly Subscription',  price: 249, sst: 0.08, type: 'yearly', category: 'software' },
  {
    id: 'sw-terminal-fees',
    title: 'QPOS & QRPOS Terminal Fees',
    subcategory: 'Terminal Fees',
    description: 'Inclusive of 0.5% platform fees',
    details:
      'Visa/Master Credit Card: 2%\n' +
      'Visa/Master Debit/Prepaid Card: 2%\n' +
      'MyDebit, Shopee, Boost, GrabPay, Maybank QR, TnG QR, Duitnow QR: 2%\n' +
      'Foreign Cards: 3.8%\n' +
      '**FPX B2B / B2C: Not Supported\n' +
      '- Settlement Period: T+2 days',
    price: 0,
    priceLabel: 'No fixed fee',
    sst: 0,
    type: 'recurring',
    category: 'software',
  },
  { id: 'sw-free-12-qpos-cloud',   title: 'Free 12 Mths QPOS Cloud Software', subcategory: 'Promotion',       price: 0,   priceLabel: 'FOC', sst: 0, type: 'recurring', category: 'software' },
  { id: 'sw-free-24-qpos-ai',      title: 'Free 24 Mths QPOS Cloud Software', subcategory: 'Promotion',       price: 0,   priceLabel: 'FOC', sst: 0, type: 'recurring', category: 'software' },

  // ── SETUP & INSTALLATION (8% SST, one-time) ──
  { id: 'st-setup-fees',           title: 'Setup Fees',                  subcategory: 'One Time Setup',       price: 500, sst: 0.08, type: 'one-time', category: 'setup' },

  // ── OPTIONAL DELIVERY (8% SST, one-time) ──
  { id: 'dl-kv',                   title: 'Delivery & Installation (KV)',          subcategory: 'Klang Valley',     price: 300,  sst: 0.08, type: 'one-time', category: 'delivery' },
  { id: 'dl-wm',                   title: 'Delivery & Installation (WM)',          subcategory: 'Peninsula',        price: 500,  sst: 0.08, type: 'one-time', category: 'delivery' },
  { id: 'dl-em',                   title: 'Delivery & Installation (EM)',          subcategory: 'East Malaysia',    price: 1200, sst: 0.08, type: 'one-time', category: 'delivery' },
];
