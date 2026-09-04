/*
 * ═══════════════════════════════════════════════════════════
 * QPOS CONFIGURATOR — All editable data lives here.
 * Change prices, bundles, plans, or copy — no need to touch UI code.
 * ═══════════════════════════════════════════════════════════
 */

// ─── STEP 1: Business Types ───
export const businessTypes = [
  { id: 'fnb', label: 'Restaurant / F&B', icon: '🍜' },
  { id: 'retail', label: 'Retail / Shop', icon: '🛍️' },
  { id: 'cafe', label: 'Café / Bakery', icon: '☕' },
  { id: 'services', label: 'Services (Salon, Gym, etc.)', icon: '💈' },
] as const;

export type BusinessType = typeof businessTypes[number]['id'];

// ─── STEP 2: Selling Channels ───
export interface SellingChannel {
  id: string;
  label: string;
  description: string;
  type: 'hardware' | 'software';
}

export const sellingChannels: SellingChannel[] = [
  // Hardware channels — trigger Step 3
  { id: 'counter-pos', label: 'Counter POS', description: 'Your front counter register', type: 'hardware' },
  { id: 'mpos', label: 'mPOS (Mobile POS)', description: 'Handheld ordering for floor & queue', type: 'hardware' },
  { id: 'kiosk', label: 'Kiosk (Self-Service)', description: 'Customer-facing self-order station', type: 'hardware' },
  // Software-only channels — no hardware needed
  { id: 'webstore', label: 'Webstore', description: 'Online ordering — no commissions', type: 'software' },
  { id: 'tablet', label: 'Tablet Ordering', description: 'In-table tablets for dine-in', type: 'software' },
  { id: 'qr', label: 'QR Scan-to-Order', description: 'Customers scan & order from their phone', type: 'software' },
];

// ─── STEP 3: Hardware Bundles ───
export interface BundleAddOn {
  id: string;
  label: string;
  price: number;
}

export interface HardwareBundle {
  id: string;
  name: string;
  device: string;
  basePrice: number;
  /** Which hardware channel combos trigger this bundle recommendation */
  channelMatch: string[][];
  description: string;
  highlights: string[];
  whatsIncluded: string[];
  availablePlans: string[]; // plan IDs
  addOns: BundleAddOn[];
  variants?: { label: string; price: number }[];
  image?: string;
}

export const hardwareBundles: HardwareBundle[] = [
  {
    id: 'basic',
    name: 'Bundle A: Basic',
    device: 'QBOT V3',
    basePrice: 1099,
    channelMatch: [['counter-pos']],
    description: 'Compact handheld POS with built-in printer and payment terminal.',
    highlights: ['Built-in receipt printer', 'Built-in payment terminal', '5.5" touchscreen'],
    whatsIncluded: [
      'POS base included',
      'Online training',
      'Installation (coverage area)',
      'First-time menu setup',
      'Free 2 months Plus',
      '6 months after-sales service',
    ],
    availablePlans: ['free', 'standard'],
    addOns: [],
    image: '/Q_STAND_1.webp',
  },
  {
    id: 'essentials',
    name: 'Bundle B: Essentials',
    device: 'QBOT CPAD 11"',
    basePrice: 2999,
    channelMatch: [['counter-pos', 'mpos']],
    description: 'Mid-size tablet POS with external printer. Great for counter + mobile.',
    highlights: ['11" HD touchscreen', 'Built-in payment terminal', 'External receipt printer included'],
    whatsIncluded: [
      'POS base included (standard)',
      'External receipt printer included',
      'Online training',
      'Installation (coverage area)',
      'First-time menu setup',
      'Free 2 months Plus',
      '6 months after-sales service',
    ],
    availablePlans: ['standard'],
    addOns: [
      { id: 'multi-base', label: 'Upgrade to multi-purpose base', price: 300 },
    ],
    image: '/QBOT_DEKSTOP_1.webp',
  },
  {
    id: '3in1',
    name: 'Bundle C: 3-in-1',
    device: 'QBOT V3 MIX',
    basePrice: 2999,
    channelMatch: [['counter-pos', 'mpos', 'kiosk']],
    description: 'The 3-in-1 device. Counter, mobile, and kiosk from one device.',
    highlights: ['Built-in receipt printer', 'Built-in payment terminal', 'Counter + wall mount modes'],
    whatsIncluded: [
      'Online training',
      'Installation (coverage area)',
      'First-time menu setup',
      'Free 2 months Plus',
      '6 months after-sales service',
    ],
    availablePlans: ['standard', 'plus', 'pro'],
    addOns: [
      { id: 'desktop-base', label: 'Desktop base', price: 300 },
      { id: 'cash-drawer-basic', label: 'Cash drawer (Basic)', price: 200 },
      { id: 'cash-drawer-premium', label: 'Cash drawer (Premium)', price: 600 },
    ],
    variants: [
      { label: 'Desktop config', price: 2999 },
      { label: 'Dual mode with wall mount', price: 3299 },
    ],
    image: '/qduo-v2.webp',
  },
  {
    id: 'full',
    name: 'Bundle D: Full',
    device: 'QBOT D3 PRO',
    basePrice: 3499,
    channelMatch: [
      ['counter-pos', 'kiosk'],
      ['counter-pos', 'mpos', 'kiosk'],
      ['mpos', 'kiosk'],
    ],
    description: 'Premium all-in-one terminal. Single or dual screen. Add a dedicated kiosk.',
    highlights: ['15.6" HD touchscreen', 'Built-in payment terminal', 'External receipt printer included'],
    whatsIncluded: [
      'External receipt printer included',
      'Online training',
      'Installation (coverage area)',
      'First-time menu setup',
      'Free 2 months Plus',
      '6 months after-sales service',
    ],
    availablePlans: ['standard', 'plus', 'pro'],
    addOns: [
      { id: 'kiosk-21', label: '21" Kiosk add-on', price: 4299 },
      { id: 'kiosk-27', label: '27" Kiosk add-on', price: 6299 },
    ],
    variants: [
      { label: 'Single screen', price: 3499 },
      { label: 'Double screen', price: 3999 },
    ],
    image: '/Q_STAND_1.webp',
  },
];

// ─── Helper: recommend bundles based on selected hardware channels ───
export function getRecommendedBundles(selectedHardwareChannels: string[]): HardwareBundle[] {
  if (selectedHardwareChannels.length === 0) return [];
  const sorted = [...selectedHardwareChannels].sort();
  // Find exact matches first, then broader bundles
  const matches = hardwareBundles.filter((b) =>
    b.channelMatch.some((match) => {
      const s = [...match].sort();
      // Bundle matches if selected channels are a subset or exact match
      return sorted.every((ch) => s.includes(ch));
    })
  );
  // If no exact match, show all bundles that cover at least one selected channel
  if (matches.length === 0) {
    return hardwareBundles.filter((b) =>
      b.channelMatch.some((match) =>
        sorted.some((ch) => match.includes(ch))
      )
    );
  }
  return matches;
}

// ─── STEP 4: Software Plans ───
export interface SoftwarePlan {
  id: string;
  name: string;
  devices: string;
  price6m: number;
  price12m: number;
  monthlyEquiv6m: number;
  monthlyEquiv12m: number;
  features: string[];
  isFree?: boolean;
}

export const softwarePlans: SoftwarePlan[] = [
  {
    id: 'free',
    name: 'Free',
    devices: '1 device, up to 20 products',
    price6m: 0,
    price12m: 0,
    monthlyEquiv6m: 0,
    monthlyEquiv12m: 0,
    features: ['1 device', 'Up to 20 products', 'Basic reports', 'Standard support'],
    isFree: true,
  },
  {
    id: 'standard',
    name: 'Standard',
    devices: 'Up to 2 devices/outlet',
    price6m: 474,
    price12m: 828,
    monthlyEquiv6m: 79,
    monthlyEquiv12m: 69,
    features: ['Up to 2 devices', 'Unlimited products', 'Full reports', 'Priority support', 'Inventory module'],
  },
  {
    id: 'plus',
    name: 'Plus',
    devices: 'Unlimited devices',
    price6m: 774,
    price12m: 1428,
    monthlyEquiv6m: 129,
    monthlyEquiv12m: 119,
    features: ['Unlimited devices', 'Unlimited products', 'Sales Boosters', 'Loyalty module', 'Multi-outlet', 'Advanced reports'],
  },
  {
    id: 'pro',
    name: 'Pro',
    devices: 'Unlimited devices',
    price6m: 1374,
    price12m: 2388,
    monthlyEquiv6m: 229,
    monthlyEquiv12m: 199,
    features: ['Everything in Plus', 'AI Insights', 'API access', 'Dedicated account manager', 'Custom integrations'],
  },
];

// ─── Wizard State Type ───
export interface WizardState {
  businessType: BusinessType | null;
  channels: string[];
  bundleId: string | null;
  variantIndex: number;
  addOns: string[];
  planId: string | null;
  billingCycle: '6m' | '12m';
}

export const initialWizardState: WizardState = {
  businessType: null,
  channels: [],
  bundleId: null,
  variantIndex: 0,
  addOns: [],
  planId: null,
  billingCycle: '12m',
};
