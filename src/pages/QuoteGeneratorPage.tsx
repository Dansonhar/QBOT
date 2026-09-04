import { useState } from 'react';
import {
  ArrowRight, MessageCircle, Check, Plus, Minus, Server, X,
  DoorOpen, Camera, Fence, Send, ScanFace, ShieldCheck, Settings2,
  CreditCard, CalendarCheck, Heart, Users, Monitor, Smartphone, Tablet,
  MonitorSmartphone, Printer, Globe, Brain, Wallet, Rocket, Package, type LucideIcon,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';

const LIME = '#CCFF00';
const ACCENT = '#16a34a';

const EXTRA_OUTLET_PRICE = 129;
const EXTRA_CHANNEL_PRICE = 30;
const SETUP_FEE = 1500;

// ────────────────────────────────────────────────────────────────
// POS CHANNELS (attached to POS & Payments core)
// ────────────────────────────────────────────────────────────────
type ChannelId = 'pos' | 'kiosk' | 'qr-order' | 'webstore';

type Channel = {
  id: ChannelId;
  title: string;
  description: string;
  maxUnits: number;
  Icon: LucideIcon;
};

const CHANNELS: Channel[] = [
  { id: 'pos',      title: 'POS',      description: 'Counter or handheld till — add multiple per outlet.',   maxUnits: 10, Icon: CreditCard },
  { id: 'kiosk',    title: 'Kiosk',    description: 'Self-order / self-checkout — add multiple per outlet.', maxUnits: 10, Icon: Monitor },
  { id: 'qr-order', title: 'QR Order', description: 'Scan-to-order menu for table or customer phone.',       maxUnits: 1,  Icon: Smartphone },
  { id: 'webstore', title: 'Webstore', description: 'Online storefront — orders, deposits, vouchers.',       maxUnits: 1,  Icon: Globe },
];

const EMPTY_CHANNEL_UNITS: Record<ChannelId, number> = CHANNELS.reduce((acc, c) => {
  acc[c.id] = 0;
  return acc;
}, {} as Record<ChannelId, number>);

// ────────────────────────────────────────────────────────────────
// CORES — modular cores, priced individually
// ────────────────────────────────────────────────────────────────
type CoreId = 'pos' | 'ims' | 'bookings' | 'loyalty' | 'staff' | 'qhub';

type Core = {
  id: CoreId;
  title: string;
  price: number;
  isDefault?: boolean;
  badge?: string;
  tagline: string;
  features: string[];
  Icon: LucideIcon;
};

const CORES: Core[] = [
  {
    id: 'pos',
    title: 'POS & Payments',
    price: 69,
    tagline: 'Sell anything. Take payment anywhere.',
    features: [
      'Counter POS', 'In-App Checkout', 'Web Checkout',
      'Multi-Payment Split', 'QR / e-Wallet / Card / Cash',
      'Digital Receipts', 'Deposits & Part-Payments',
      'Product Catalogue', 'Basic Inventory',
      'Refund / Void', 'Daily Sales Dashboard',
      'Sales Boosters (Badges & Upsells)',
    ],
    Icon: CreditCard,
  },
  {
    id: 'ims',
    title: 'Inventory Management System (IMS)',
    price: 69,
    badge: 'Ready in June 2026',
    tagline: 'Know your stock. Cut your shrink.',
    features: [
      'Real-Time Stock Levels', 'Multi-Outlet Sync',
      'Low-Stock Alerts', 'Reorder Points',
      'Purchase Orders', 'Supplier Management',
      'Stock Take / Count Sheets', 'Stock Transfers',
      'Batch & Expiry Tracking', 'Barcode Scanning',
      'Cost of Goods Tracking', 'Inventory Reports',
    ],
    Icon: Package,
  },
  {
    id: 'bookings',
    title: 'Bookings & Scheduling',
    price: 69,
    tagline: 'Fill every slot. Every chair. Every bay.',
    features: [
      'Online Booking', '1-on-1 Appointments',
      'Class / Capacity Booking', 'Seat-Reserved Classes',
      'Room / Bay / Chair Assignment', 'Calendar Sync',
      'Auto-Waitlist', 'Auto-Accept Rules',
      'Walk-In Queue', 'Deposit-to-Confirm', 'No-Show Tracking',
    ],
    Icon: CalendarCheck,
  },
  {
    id: 'loyalty',
    title: 'Memberships & Loyalty',
    price: 69,
    tagline: 'Turn one-time visits into lifelong revenue.',
    features: [
      'Points Earning', 'Reward Catalogue & Redemption',
      'Bonus Campaigns', 'Referral Tracking',
      'Customer Segmentation', 'Lifetime Value Tracking',
      'Promo Banner Slider',
    ],
    Icon: Heart,
  },
  {
    id: 'staff',
    title: 'Staff & KPI',
    price: 69,
    tagline: 'Your team performs. You pay them right.',
    features: [
      'Unlimited Staff Accounts', 'Staff Profiles & Roles',
      'KPI Dashboard', 'Top Performer Rankings',
      'Commission Engine (% or flat)',
      'Commission Status Tracking', 'Effective-Dated Rules',
      'Shifts / Schedule', 'Attendance Log',
      'Role-Based Access', 'Audit Trail',
    ],
    Icon: Users,
  },
  {
    id: 'qhub',
    title: 'Qhub AI',
    price: 0,
    isDefault: true,
    tagline: 'Your brain & control tower — always on, always included.',
    features: [
      'Unlimited Sales Reports',
      'Products Management',
      'Multi-Tier Staff Roles',
      'Global Branding Control',
      'Receipt Templates',
      'Audit & Activity Log',
      'Data Export',
      'AI Insights & Anomaly Alerts',
    ],
    Icon: Brain,
  },
];

const CORE_PRICE_MAP: Record<CoreId, number> = Object.fromEntries(
  CORES.map(c => [c.id, c.price])
) as Record<CoreId, number>;

// ────────────────────────────────────────────────────────────────
// ADDITIONALS — priced individually
// ────────────────────────────────────────────────────────────────
type AddonId = 'auto-reports' | 'face-id-customer' | 'face-id-staff' | 'sentry' | 'ewallet' | 'boosters-pack' | 'custom' | 'dual-display';

type Addon = {
  id: AddonId;
  title: string;
  price: number;
  oneTime?: boolean;
  priceFootnote?: string;
  tagline: string;
  features: string[];
  Icon: LucideIcon;
};

const ADDONS: Addon[] = [
  {
    id: 'auto-reports',
    title: 'Auto Reports',
    price: 20,
    tagline: 'Daily sales pushed straight to your Telegram.',
    features: [
      'Telegram group / channel push',
      'Daily / Weekly / Monthly digest',
      'Live booking & low-stock alerts',
      'Custom schedule per recipient',
      'End-of-day cash-up summary',
    ],
    Icon: Send,
  },
  {
    id: 'face-id-customer',
    title: 'Face ID Customer Check-In',
    price: 69,
    tagline: 'Customers check in with their face — no cards, no cheats.',
    features: [
      'Face enrolment at sign-up',
      'Check-in kiosk mode',
      'Live attendance & presence log',
      'QR member card fallback',
      'Tied to bookings & memberships',
    ],
    Icon: ScanFace,
  },
  {
    id: 'face-id-staff',
    title: 'Face ID Staff Check-In',
    price: 69,
    tagline: 'Staff clock in & auth with their face.',
    features: [
      'Staff clock-in / clock-out',
      'Face auth for sensitive actions',
      'Shift attendance log',
      'Commission-aware clock tracking',
      'No shared PINs or buddy punch-ins',
    ],
    Icon: ScanFace,
  },
  {
    id: 'sentry',
    title: 'Sentry Mode',
    price: 300,
    tagline: '24/7 face scanning. Unknown faces flagged.',
    features: [
      'Continuous face scan across premises',
      'Confidence-score matching',
      'Instant staff alerts with snapshot + location',
      'Unknown-face timeline log',
      'Multi-camera coverage',
    ],
    Icon: ShieldCheck,
  },
  {
    id: 'ewallet',
    title: 'e-Wallet System',
    price: 500,
    tagline: 'Customers top up & spend inside your app.',
    features: [
      'Prepaid balance per customer / member',
      'Top-up via QR / card / cash',
      'Redeem at POS, web, kiosk',
      'Balance ledger & audit trail',
      'Auto-incentives on top-ups',
    ],
    Icon: Wallet,
  },
  {
    id: 'boosters-pack',
    title: 'Advanced Sales Boosters Pack',
    price: 69,
    tagline: '+3 new boosters on top of Badges & Upsells.',
    features: [
      'Triggers — fire promos based on cart, time, customer tier',
      'Tiers — bronze / silver / gold rules with auto perks',
      'Nudges — smart prompts at checkout to lift ticket size',
      'A/B test any booster rule',
      'Revenue lift reporting per booster',
    ],
    Icon: Rocket,
  },
  {
    id: 'dual-display',
    title: 'POS Interactive Dual Display',
    price: 30,
    tagline: 'Customer-facing screen at the counter.',
    features: [
      'Live cart & pricing display',
      'Tip / signature / review capture',
      'Promo & loyalty banners',
      'Upsell prompts at checkout',
      'Works on selected device only',
    ],
    Icon: Monitor,
  },
  {
    id: 'custom',
    title: 'Customized Modules',
    price: 129,
    oneTime: true,
    priceFootnote: '*Depending complexity',
    tagline: 'Bespoke workflow + one-time development fees.',
    features: [
      'Custom field / form logic',
      'Industry-specific workflow tweaks',
      'Custom reports & dashboards',
      'Custom integrations & webhooks',
      'Private development lane',
    ],
    Icon: Settings2,
  },
];

const ADDON_PRICE_MAP: Record<AddonId, number> = Object.fromEntries(
  ADDONS.map(a => [a.id, a.price])
) as Record<AddonId, number>;

// ────────────────────────────────────────────────────────────────
// POS HARDWARE — one-time, per-unit pricing
// ────────────────────────────────────────────────────────────────
type PosHwId = 'v3' | 'cpad11' | 'v3mix' | 'd3pro' | 'q1kiosk' | 'q1stand' | 'term' | 'printer';

type PosHw = { id: PosHwId; title: string; price: number; description: string; Icon: LucideIcon };

const POS_HARDWARE: PosHw[] = [
  { id: 'v3',      title: 'V3',                    price: 1440, description: 'All-in-one Android POS with built-in printer.',  Icon: Smartphone },
  { id: 'cpad11',  title: 'CPAD 11',               price: 2280, description: '11" tablet POS — counter or handheld.',           Icon: Tablet },
  { id: 'v3mix',   title: 'V3 MIX',                price: 3480, description: 'V3 + customer-facing display combo.',             Icon: Monitor },
  { id: 'd3pro',   title: 'D3 Pro Dual',           price: 4080, description: 'Dual-screen POS — staff + customer.',             Icon: MonitorSmartphone },
  { id: 'q1kiosk', title: 'Q1 Kiosk',              price: 7176, description: 'Self-order & pay kiosk — countertop.',            Icon: Monitor },
  { id: 'q1stand', title: 'Q1 Kiosk + Stand',      price: 7676, description: 'Q1 Kiosk with floor stand, ready to deploy.',     Icon: Monitor },
  { id: 'term',    title: 'Payment Terminal',      price: 900,  description: 'EDC / card / QR payment terminal.',               Icon: CreditCard },
  { id: 'printer', title: 'Cloud Receipt Printer', price: 350,  description: 'WiFi / LAN thermal receipt printer.',              Icon: Printer },
];

const EMPTY_POS_HW_QTY: Record<PosHwId, number> = POS_HARDWARE.reduce((acc, hw) => {
  acc[hw.id] = 0;
  return acc;
}, {} as Record<PosHwId, number>);

// ────────────────────────────────────────────────────────────────
// FAQS
// ────────────────────────────────────────────────────────────────
const PRICING_FAQS = [
  { q: 'How does the pricing work?', a: 'Pick the cores you need — each is RM 69/mth. Add any additionals you want, each priced separately. Your first outlet is included; each extra outlet is RM 129/mth. No minimums beyond 1 core; no surprise upgrades.' },
  { q: 'Can I start with 1 core and add more later?', a: 'Yes. Add or drop cores and additionals anytime. Billing is prorated for the month you activate — no lock-in on what you pick.' },
  { q: 'Is there a contract?', a: 'Two options — Annual (paid upfront, locks your rate for 12 months) or 2 Years (paid upfront, 20% off and locks your rate for 24 months). You can add or drop cores anytime; billing is prorated.' },
  { q: 'What counts as an "outlet"?', a: 'Each physical branch or premises with its own staff, hours, and POS/booking flow. Online-only storefronts count as 1 outlet. Each extra outlet is RM 129/mth.' },
  { q: 'What are "POS channels"?', a: 'POS channels are how you take orders & payments — POS terminal, self-order Kiosk, QR Order (scan-to-order), or Webstore. POS & Payments core includes 1 channel free per outlet — so 2 outlets = 2 free channels. Each additional unit (e.g. a second POS at the counter, or adding Webstore on top) is RM 30/mth. POS and Kiosk can have multiple units per outlet; QR Order and Webstore are 1 unit max.' },
  { q: 'What\'s in "Customized Modules"?', a: 'For businesses with unique workflows — bespoke field logic, industry-specific adjustments, custom reports, private integrations. RM 69/mth covers ongoing maintenance and minor iterations. Initial build is scoped and quoted separately.' },
  { q: 'How does Sentry Mode work?', a: 'The RM 300/mth covers the software — continuous scanning, alerts, timeline log. You\'ll need at least one Sentry Camera per zone (max 3 per outlet). Add cameras in the hardware step (RM 350 each, one-time).' },
  { q: 'What\'s the setup fee?', a: 'RM 1,500 one-time — covers onboarding, staff training, data import, outlet configuration, and integrations setup.' },
  { q: 'Is there a free trial?', a: 'Live demo at our Publika KL showroom — see the modules and auto-report push in person before committing.' },
];

// ────────────────────────────────────────────────────────────────
// UI helpers
// ────────────────────────────────────────────────────────────────
function StepShell({ num, title, subtitle, visible, children }: { num: number; title: string; subtitle?: string; visible: boolean; children: React.ReactNode }) {
  if (!visible) return null;
  return (
    <section id={`step-${num}`} className="mb-10 md:mb-14 scroll-mt-20" style={{ animation: 'qfit-reveal 0.4s ease-out' }}>
      <div className="flex items-center gap-3 mb-2">
        <span className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-[11px] md:text-[12px] font-mono font-black text-black" style={{ backgroundColor: LIME }}>
          {String(num).padStart(2, '0')}
        </span>
        <h2 className="text-[15px] md:text-[20px] font-black uppercase tracking-tight text-gray-700">{title}</h2>
      </div>
      {subtitle && <p className="text-gray-700 text-[12px] md:text-[14px] leading-relaxed mb-5 md:mb-6 pl-10 md:pl-11">{subtitle}</p>}
      <div className="md:pl-11">
        {children}
      </div>
    </section>
  );
}

function ContinueButton({ onClick, label, disabled }: { onClick: () => void; label?: string; disabled?: boolean }) {
  return (
    <div className="flex justify-end mt-5 md:mt-6">
      <button onClick={onClick} disabled={disabled}
        className={`inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 text-black text-[11px] md:text-[12px] font-black uppercase tracking-wider transition-colors ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-90'}`}
        style={{ backgroundColor: LIME }}>
        {label || 'Continue'} <ArrowRight size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// MAIN PAGE
// ────────────────────────────────────────────────────────────────
export default function QuoteGeneratorPage() {
  const [step, setStep] = useState(1);
  const [billing, setBilling] = useState<'annual' | '2year'>('annual');
  const [selectedCores, setSelectedCores] = useState<Set<CoreId>>(
    new Set(CORES.filter(c => c.isDefault).map(c => c.id))
  );
  const [selectedAddons, setSelectedAddons] = useState<Set<AddonId>>(new Set());
  const [autoReportsQty, setAutoReportsQty] = useState(0);
  const [addonsTouched, setAddonsTouched] = useState(false);
  const [outlets, setOutlets] = useState(1);
  const [outletsTouched, setOutletsTouched] = useState(false);
  const [channelUnits, setChannelUnits] = useState<Record<ChannelId, number>>({ ...EMPTY_CHANNEL_UNITS });

  const bumpChannel = (id: ChannelId, delta: number) => {
    const channel = CHANNELS.find(c => c.id === id);
    if (!channel) return;
    setChannelUnits(prev => ({
      ...prev,
      [id]: Math.max(0, Math.min(channel.maxUnits, prev[id] + delta)),
    }));
  };
  const [entryMethod, setEntryMethod] = useState<'auto-swing' | 'door-gate' | null>(null);
  const [entryTouched, setEntryTouched] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);
  const [doorlockQty, setDoorlockQty] = useState(0);
  const [gateLanes, setGateLanes] = useState(0);
  const [sentryCams, setSentryCams] = useState(0);
  const [posHwQty, setPosHwQty] = useState<Record<PosHwId, number>>({ ...EMPTY_POS_HW_QTY });
  const [hardwareTouched, setHardwareTouched] = useState(false);

  const bumpPosHw = (id: PosHwId, delta: number) => {
    setPosHwQty(prev => ({ ...prev, [id]: Math.max(0, Math.min(20, prev[id] + delta)) }));
    setHardwareTouched(true);
  };
  const [pserver, setPserver] = useState<boolean | null>(null);
  const [installment, setInstallment] = useState<0 | 6 | 12 | 24>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const advance = (to: number) => {
    setStep(s => Math.max(s, to));
    setTimeout(() => {
      const el = document.getElementById(`step-${to}`) || document.getElementById('quote-summary');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const toggleCore = (id: CoreId) => {
    const core = CORES.find(c => c.id === id);
    if (core?.isDefault) return;
    setSelectedCores(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAddon = (id: AddonId) => {
    setAddonsTouched(true);
    setSelectedAddons(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // ── Pricing math ──
  const coresCount = Array.from(selectedCores).filter(id => !CORES.find(c => c.id === id)?.isDefault).length;
  const coresSubtotal = Array.from(selectedCores).reduce((sum, id) => sum + CORE_PRICE_MAP[id], 0);
  const autoReportsCost = autoReportsQty * ADDON_PRICE_MAP['auto-reports'];
  const addonsSubtotal = Array.from(selectedAddons).reduce((sum, id) => sum + ADDON_PRICE_MAP[id], 0) + autoReportsCost;
  const addonsSelectedCount = selectedAddons.size + (autoReportsQty > 0 ? 1 : 0);
  const extraOutlets = Math.max(0, outlets - 1);
  const outletSubtotal = extraOutlets * EXTRA_OUTLET_PRICE;

  const posCoreSelected = selectedCores.has('pos');
  const totalChannelUnits = CHANNELS.reduce((sum, c) => sum + channelUnits[c.id], 0);
  const freeChannelAllowance = posCoreSelected ? outlets : 0;
  const billableChannelUnits = Math.max(0, totalChannelUnits - freeChannelAllowance);
  const channelsSubtotal = billableChannelUnits * EXTRA_CHANNEL_PRICE;
  const monthlyTotal = coresSubtotal + addonsSubtotal + outletSubtotal + channelsSubtotal;
  const is2Year = billing === '2year';
  const termMonths = is2Year ? 24 : 12;
  const termDiscount = is2Year ? 0.20 : 0;
  const termListTotal = monthlyTotal * termMonths;
  const termSavings = Math.round(termListTotal * termDiscount);
  const termTotal = termListTotal - termSavings;
  const annualUpfront = termTotal;

  const pserverOn = pserver === true;

  // ── Hardware math ──
  const doorlockCost = doorlockQty * 2000;
  const gateCost = gateLanes * 12000;
  const camCost = sentryCams * 350;
  const posHwSubtotal = POS_HARDWARE.reduce((sum, hw) => sum + hw.price * posHwQty[hw.id], 0);
  const hardwareSubtotal = doorlockCost + gateCost + camCost + posHwSubtotal;
  const hasHardware = hardwareSubtotal > 0;
  const deliveryFee = hasHardware ? 300 : 0;
  const hardwareGrandTotal = hardwareSubtotal + deliveryFee;
  const installmentMonthly = installment > 0 ? Math.ceil(hardwareGrandTotal / installment) : 0;

  const entryLabel = entryMethod === 'auto-swing' ? 'Auto Swing Gate + Face ID'
    : entryMethod === 'door-gate' ? 'Door Gate + Face ID'
    : 'Not selected';

  const coresPicked = Array.from(selectedCores)
    .map(id => CORES.find(c => c.id === id))
    .filter((c): c is Core => !!c);
  const addonsPicked = Array.from(selectedAddons)
    .map(id => ADDONS.find(a => a.id === id))
    .filter((a): a is Addon => !!a);

  const hardwareLines: string[] = [];
  if (doorlockQty > 0) hardwareLines.push(`Doorlock × ${doorlockQty} = RM ${doorlockCost.toLocaleString()}`);
  if (gateLanes > 0) hardwareLines.push(`Entry Gate × ${gateLanes} lane${gateLanes > 1 ? 's' : ''} = RM ${gateCost.toLocaleString()}`);
  if (sentryCams > 0) hardwareLines.push(`Sentry Camera × ${sentryCams} = RM ${camCost.toLocaleString()}`);
  POS_HARDWARE.forEach(hw => {
    const qty = posHwQty[hw.id];
    if (qty > 0) hardwareLines.push(`${hw.title} × ${qty} = RM ${(hw.price * qty).toLocaleString()}`);
  });

  const configLines = [
    `Billing: ${is2Year ? '2 Years (20% off — save RM ' + termSavings.toLocaleString() + ')' : 'Annual'}`,
    `Cores picked (${coresCount}): ${coresPicked.length > 0 ? coresPicked.map(c => c.isDefault ? `${c.title} (inclusive)` : `${c.title} (RM ${c.price})`).join(', ') : 'None'} — RM ${coresSubtotal}/mo`,
    addonsSelectedCount > 0
      ? `Additionals: ${[
          autoReportsQty > 0 ? `Auto Reports × ${autoReportsQty} (RM ${autoReportsCost}/mo)` : null,
          ...addonsPicked.map(a => a.oneTime ? `${a.title} (RM ${a.price}/mo + one-time dev fee — quote sep.)` : `${a.title} (RM ${a.price}/mo)`),
        ].filter(Boolean).join(', ')} — RM ${addonsSubtotal}/mo recurring`
      : 'Additionals: None',
    `Outlets: ${outlets}${extraOutlets > 0 ? ` (${extraOutlets} extra × RM 129/mo = RM ${outletSubtotal}/mo)` : ' (included)'}`,
    posCoreSelected
      ? `POS channels: ${CHANNELS.filter(c => channelUnits[c.id] > 0).map(c => `${c.title} × ${channelUnits[c.id]}`).join(', ') || 'None selected'}${billableChannelUnits > 0 ? ` — ${freeChannelAllowance} free (1/outlet), ${billableChannelUnits} billable × RM ${EXTRA_CHANNEL_PRICE}/mo = RM ${channelsSubtotal}/mo` : ` (${freeChannelAllowance} included — 1/outlet)`}`
      : null,
    `Entry method: ${entryLabel}${hasExisting ? ' (has existing gate)' : ''}`,
    hardwareLines.length > 0
      ? `Hardware (one-time): ${hardwareLines.join(' | ')} | Subtotal RM ${hardwareSubtotal.toLocaleString()} + Delivery RM 300 = RM ${hardwareGrandTotal.toLocaleString()}`
      : `Hardware (one-time): None`,
    hasHardware
      ? `Payment plan: ${installment === 0 ? 'Full payment' : `${installment} mo × RM ${installmentMonthly.toLocaleString()} (0% interest · Maybank / CIMB)`}`
      : null,
    `Private Server: ${pserverOn ? 'Yes (quote separately)' : 'No'}`,
    `${is2Year ? '2-year' : 'Annual'} upfront: RM ${termTotal.toLocaleString()}`,
    `Monthly fee: RM ${monthlyTotal.toLocaleString()}/mo`,
    `One-time setup fee: RM ${SETUP_FEE.toLocaleString()} (may be waived on annual)`,
  ].filter(Boolean).join('\n- ');

  const waLink = 'https://wa.me/60126909189?text=' + encodeURIComponent(
    `Hi! I'd like to lock in this QPOS quote:\n\n- ${configLines}\n\nLet's set up.`
  );

  return (
    <div className="bg-white text-gray-900 selection:bg-[#CCFF00] selection:text-black overflow-x-hidden">
      <SEOHead
        title="QPOS — Quote Generator"
        description="Build your QPOS setup — pick cores, add-ons, outlets, and hardware — and send the quote to WhatsApp in seconds."
        keywords="QPOS quote, QPOS pricing, POS system pricing Malaysia"
        image="https://qbot.now/qfitimg/qfit1.jpg"
        imageAlt="QPOS — Quote Generator"
        url="https://qbot.now/quotegenerator"
      />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-16">

        {/* ─── Hero ─── */}
        <section className="mb-8 md:mb-10">
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.3em] mb-3" style={{ color: ACCENT }}>
            Build Your Quote
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.9] mb-4">
            <span style={{ color: ACCENT }}>Modular</span> Pricing
          </h1>
          <p className="text-gray-700 text-[13px] md:text-[15px] leading-relaxed max-w-2xl">
            Pick the cores you need. Add the extras you want. Scale when you're ready.
          </p>
        </section>

        {/* ─── STEP 01 — Pick Cores ─── */}
        <StepShell num={1} title="Pick your cores"
          subtitle="Each core is priced independently. Tap to add or remove. Pick at least one — most businesses start with 2 or 3."
          visible={true}>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-5">
            {CORES.map(core => {
              const isDefault = !!core.isDefault;
              const active = isDefault || selectedCores.has(core.id);
              return (
                <button key={core.id} onClick={() => toggleCore(core.id)}
                  disabled={isDefault}
                  className={`relative border-2 p-5 md:p-6 text-left transition-colors ${isDefault ? 'cursor-default' : active ? '' : 'border-gray-200 hover:border-gray-400'}`}
                  style={active ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)' } : {}}>

                  {core.badge && (
                    <div className="absolute -top-2 left-4 px-2 py-0.5 text-[9px] md:text-[10px] font-black uppercase tracking-wider text-black rounded-full shadow-sm" style={{ backgroundColor: LIME }}>
                      {core.badge}
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`flex-shrink-0 w-10 h-10 border-2 flex items-center justify-center transition-colors ${active ? '' : 'border-gray-300'}`}
                        style={active ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.12)' } : {}}>
                        <core.Icon size={18} strokeWidth={2} style={{ color: active ? ACCENT : '#6b7280' }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-gray-700 text-[14px] md:text-[16px] font-black uppercase tracking-tight leading-tight truncate">{core.title}</p>
                        <p className="text-gray-700 text-[11px] md:text-[12px] leading-snug">{core.tagline}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      {isDefault ? (
                        <>
                          <p className="font-black text-[13px] md:text-[15px] leading-none uppercase tracking-wider" style={{ color: ACCENT }}>Inclusive</p>
                          <p className="text-gray-700 text-[9px] md:text-[10px] font-mono uppercase tracking-wider mt-1">free</p>
                        </>
                      ) : (
                        <>
                          <p className="font-black text-[18px] md:text-[22px] leading-none" style={{ color: ACCENT }}>RM {core.price}</p>
                          <p className="text-gray-700 text-[9px] md:text-[10px] font-mono uppercase tracking-wider">/ mth</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 md:gap-1.5 mb-3">
                    {core.features.map((f, i) => (
                      <span key={i} className="inline-block border border-gray-200 bg-gray-50 text-gray-700 text-[10px] md:text-[11px] px-2 py-0.5 leading-snug">
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                    <span className={`w-4 h-4 border-2 flex items-center justify-center transition-all ${active ? '' : 'border-gray-300'}`}
                      style={active ? { borderColor: LIME, backgroundColor: LIME } : {}}>
                      {active && <Check size={10} strokeWidth={3} className="text-black" />}
                    </span>
                    <span className={`text-[11px] md:text-[12px] font-bold uppercase tracking-wider ${active ? '' : 'text-gray-700'}`}
                      style={active ? { color: ACCENT } : {}}>
                      {isDefault ? 'Default · Inclusive' : active ? 'Added' : 'Tap to add'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* POS Channel picker — appears only when POS core is added */}
          {posCoreSelected && (
            <div className="border-2 p-4 md:p-5 mb-4 md:mb-5" style={{ borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.04)', animation: 'qfit-reveal 0.3s ease-out' }}>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.2em] mb-1" style={{ color: ACCENT }}>
                    Attached to POS & Payments
                  </p>
                  <h3 className="text-gray-700 text-[14px] md:text-[16px] font-black uppercase tracking-tight mb-1">
                    Pick your channels
                  </h3>
                  <p className="text-gray-700 text-[11px] md:text-[12px] leading-snug">
                    1 channel free per outlet ({outlets} outlet{outlets > 1 ? 's' : ''} = {freeChannelAllowance} free) · each extra unit + RM {EXTRA_CHANNEL_PRICE}/mth
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] md:text-[11px] font-mono uppercase tracking-wider text-gray-700">Units</p>
                  <p className="font-black text-[20px] md:text-[24px] leading-none" style={{ color: ACCENT }}>{totalChannelUnits}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
                {CHANNELS.map(channel => {
                  const qty = channelUnits[channel.id];
                  const active = qty > 0;
                  const atMax = qty >= channel.maxUnits;
                  return (
                    <div key={channel.id} className={`border-2 p-3 md:p-4 transition-colors ${active ? '' : 'border-gray-200 bg-gray-50'}`}
                      style={active ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)' } : {}}>
                      <channel.Icon size={18} strokeWidth={2} className="mb-2" style={{ color: active ? ACCENT : '#6b7280' }} />
                      <p className="text-gray-700 text-[12px] md:text-[13px] font-black uppercase tracking-tight mb-1">{channel.title}</p>
                      <p className="text-gray-700 text-[10px] md:text-[11px] leading-snug mb-3">{channel.description}</p>
                      <div className="flex items-center justify-between">
                        <button onClick={() => bumpChannel(channel.id, -1)}
                          disabled={qty === 0}
                          className="w-7 h-7 border-2 border-gray-300 hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                          aria-label={`Decrease ${channel.title}`}>
                          <Minus size={11} strokeWidth={2.5} className="text-gray-700" />
                        </button>
                        <span className="text-[16px] md:text-[18px] font-black font-mono" style={{ color: active ? ACCENT : '#6b7280' }}>{qty}</span>
                        <button onClick={() => bumpChannel(channel.id, 1)}
                          disabled={atMax}
                          className="w-7 h-7 border-2 border-gray-300 hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                          aria-label={`Increase ${channel.title}`}>
                          <Plus size={11} strokeWidth={2.5} className="text-gray-700" />
                        </button>
                      </div>
                      {channel.maxUnits === 1 && (
                        <p className="text-gray-700 text-[9px] md:text-[10px] font-mono uppercase tracking-wider mt-2 text-center">Max 1 unit</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {totalChannelUnits === 0 ? (
                <p className="text-gray-700 text-[11px] md:text-[12px] italic mt-3">
                  Pick at least 1 channel — 1 is included per outlet.
                </p>
              ) : (
                <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-gray-700 text-[11px] md:text-[12px] font-mono">
                    {totalChannelUnits} unit{totalChannelUnits > 1 ? 's' : ''} · {freeChannelAllowance} free{billableChannelUnits > 0 ? ` · ${billableChannelUnits} billable × RM ${EXTRA_CHANNEL_PRICE}` : ''}
                  </span>
                  <span className="font-black text-[14px] md:text-[16px]" style={{ color: ACCENT }}>
                    {channelsSubtotal > 0 ? `+ RM ${channelsSubtotal}/mo` : 'Included'}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Running subtotal */}
          <div className="border-2 border-gray-200 bg-gray-50 p-4 md:p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-gray-700">Subtotal</p>
              <p className="text-gray-700 text-[11px] md:text-[12px] mt-0.5">
                {coresCount === 0 ? 'No cores selected yet' : `${coresCount} core${coresCount > 1 ? 's' : ''}${channelsSubtotal > 0 ? ` + ${billableChannelUnits} extra channel${billableChannelUnits > 1 ? 's' : ''}` : ''}`}
              </p>
            </div>
            <div className="text-right">
              <p className="font-black text-[22px] md:text-[28px] leading-none" style={{ color: ACCENT }}>
                RM {(coresSubtotal + channelsSubtotal).toLocaleString()}
              </p>
              <p className="text-gray-700 text-[10px] md:text-[11px] font-mono uppercase tracking-wider mt-1">/ mth</p>
            </div>
          </div>

          {step === 1 && coresCount > 0 && (!posCoreSelected || totalChannelUnits > 0) && (
            <ContinueButton onClick={() => advance(2)} />
          )}
          {step === 1 && coresCount === 0 && (
            <p className="text-gray-700 text-[11px] md:text-[12px] italic mt-3 text-right">Pick at least 1 core to continue.</p>
          )}
          {step === 1 && coresCount > 0 && posCoreSelected && totalChannelUnits === 0 && (
            <p className="text-gray-700 text-[11px] md:text-[12px] italic mt-3 text-right">Pick at least 1 POS channel to continue.</p>
          )}
        </StepShell>

        {/* ─── STEP 02 — Additionals ─── */}
        <StepShell num={2} title="Add additionals"
          subtitle="Optional extras priced individually. Add any — or skip entirely."
          visible={step >= 2}>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-5">
            {ADDONS.map(addon => {
              if (addon.id === 'auto-reports') {
                const qty = autoReportsQty;
                const active = qty > 0;
                const lineCost = qty * addon.price;
                return (
                  <div key={addon.id}
                    className={`relative border-2 p-4 md:p-5 transition-colors ${active ? '' : 'border-gray-200'}`}
                    style={active ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)' } : {}}>

                    {active && (
                      <div className="absolute top-0 right-0 w-6 h-6 flex items-center justify-center" style={{ backgroundColor: LIME }}>
                        <Check size={12} strokeWidth={3} className="text-black" />
                      </div>
                    )}

                    <addon.Icon size={22} strokeWidth={2} className="mb-3" style={{ color: active ? ACCENT : '#6b7280' }} />

                    <p className="text-gray-700 text-[13px] md:text-[14px] font-black uppercase tracking-tight leading-tight mb-1">{addon.title}</p>

                    <p className="font-black text-[16px] md:text-[18px] leading-none mb-0.5" style={{ color: ACCENT }}>
                      RM {addon.price}<span className="text-gray-700 text-[10px] font-mono ml-1">/mth per recipient</span>
                    </p>

                    <p className="text-gray-700 text-[11px] md:text-[12px] leading-snug mb-3 mt-1">{addon.tagline}</p>

                    <ul className="space-y-0.5 mb-3">
                      {addon.features.map((f, i) => (
                        <li key={i} className="text-gray-700 text-[10px] md:text-[11px] leading-snug flex items-start gap-1.5">
                          <span className="text-gray-700 flex-shrink-0 mt-0.5">·</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-wider text-gray-700">Recipients</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setAutoReportsQty(v => Math.max(0, v - 1)); setAddonsTouched(true); }}
                          disabled={qty === 0}
                          className="w-7 h-7 border-2 border-gray-300 hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                          aria-label="Decrease Auto Reports">
                          <Minus size={11} strokeWidth={2.5} className="text-gray-700" />
                        </button>
                        <span className="text-[16px] md:text-[18px] font-black font-mono w-6 text-center" style={{ color: active ? ACCENT : '#6b7280' }}>{qty}</span>
                        <button onClick={() => { setAutoReportsQty(v => Math.min(20, v + 1)); setAddonsTouched(true); }}
                          disabled={qty >= 20}
                          className="w-7 h-7 border-2 border-gray-300 hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                          aria-label="Increase Auto Reports">
                          <Plus size={11} strokeWidth={2.5} className="text-gray-700" />
                        </button>
                      </div>
                    </div>
                    {active && (
                      <p className="text-[11px] md:text-[12px] font-mono font-bold text-right mt-2" style={{ color: ACCENT }}>
                        = RM {lineCost.toLocaleString()}/mo
                      </p>
                    )}
                  </div>
                );
              }

              const active = selectedAddons.has(addon.id);
              return (
                <button key={addon.id} onClick={() => toggleAddon(addon.id)}
                  className={`relative border-2 p-4 md:p-5 text-left transition-colors ${active ? '' : 'border-gray-200 hover:border-gray-400'}`}
                  style={active ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)' } : {}}>

                  {active && (
                    <div className="absolute top-0 right-0 w-6 h-6 flex items-center justify-center" style={{ backgroundColor: LIME }}>
                      <Check size={12} strokeWidth={3} className="text-black" />
                    </div>
                  )}

                  <addon.Icon size={22} strokeWidth={2} className="mb-3" style={{ color: active ? ACCENT : '#6b7280' }} />

                  <p className="text-gray-700 text-[13px] md:text-[14px] font-black uppercase tracking-tight leading-tight mb-1">{addon.title}</p>

                  <p className="font-black text-[16px] md:text-[18px] leading-none mb-0.5" style={{ color: ACCENT }}>
                    RM {addon.price}<span className="text-gray-700 text-[10px] font-mono ml-1">/mth{addon.priceFootnote ? '*' : ''}</span>
                  </p>
                  {addon.oneTime && (
                    <p className="text-gray-700 text-[10px] md:text-[11px] font-mono leading-snug mb-1">+ one-time dev fee</p>
                  )}
                  {addon.priceFootnote && (
                    <p className="text-gray-700 text-[9px] md:text-[10px] italic leading-snug mb-2">{addon.priceFootnote}</p>
                  )}

                  <p className="text-gray-700 text-[11px] md:text-[12px] leading-snug mb-3 mt-1">{addon.tagline}</p>

                  <ul className="space-y-0.5">
                    {addon.features.map((f, i) => (
                      <li key={i} className="text-gray-700 text-[10px] md:text-[11px] leading-snug flex items-start gap-1.5">
                        <span className="text-gray-700 flex-shrink-0 mt-0.5">·</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>

          {/* Running subtotal */}
          <div className="border-2 border-gray-200 bg-gray-50 p-4 md:p-5 flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-gray-700">Additionals Subtotal</p>
              <p className="text-gray-700 text-[11px] md:text-[12px] mt-0.5">
                {addonsSelectedCount === 0 ? 'No add-ons yet' : `${addonsSelectedCount} add-on${addonsSelectedCount > 1 ? 's' : ''}`}
              </p>
            </div>
            <div className="text-right">
              <p className="font-black text-[22px] md:text-[28px] leading-none" style={{ color: ACCENT }}>
                RM {addonsSubtotal.toLocaleString()}
              </p>
              <p className="text-gray-700 text-[10px] md:text-[11px] font-mono uppercase tracking-wider mt-1">/ mth</p>
            </div>
          </div>

          {/* Skip option */}
          <button
            onClick={() => { setAddonsTouched(true); advance(3); }}
            className="w-full text-center py-3 border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 text-[11px] md:text-[12px] font-bold uppercase tracking-wider transition-colors">
            {addonsSelectedCount > 0 ? 'Continue with selected add-ons' : 'Skip — no additionals for now'}
          </button>

          {step === 2 && addonsTouched && addonsSelectedCount > 0 && (
            <ContinueButton onClick={() => advance(3)} />
          )}
        </StepShell>

        {/* ─── STEP 03 — Outlets ─── */}
        <StepShell num={3} title="How many outlets?"
          subtitle={`Your first outlet is included. Each extra outlet is RM ${EXTRA_OUTLET_PRICE}/mth — its own hardware, staff, packages, and reports, all under one dashboard.`}
          visible={step >= 3}>
          <div className="border-2 border-gray-200 p-5 md:p-7">
            <div className="flex items-center justify-between gap-5">
              <div>
                <p className="text-[11px] md:text-[13px] font-bold uppercase tracking-wider text-gray-700 mb-1">Number of outlets</p>
                <p className="text-gray-700 text-[11px] md:text-[12px]">1 outlet included · add more anytime</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => { setOutlets(v => Math.max(1, v - 1)); setOutletsTouched(true); }}
                  className="w-9 h-9 border-2 border-gray-300 hover:border-gray-500 flex items-center justify-center transition-colors"
                  aria-label="Decrease outlets">
                  <Minus size={14} strokeWidth={2.5} className="text-gray-700" />
                </button>
                <span className="text-[22px] md:text-[26px] font-black font-mono w-10 text-center" style={{ color: ACCENT }}>{outlets}</span>
                <button onClick={() => { setOutlets(v => Math.min(20, v + 1)); setOutletsTouched(true); }}
                  className="w-9 h-9 border-2 border-gray-300 hover:border-gray-500 flex items-center justify-center transition-colors"
                  aria-label="Increase outlets">
                  <Plus size={14} strokeWidth={2.5} className="text-gray-700" />
                </button>
              </div>
            </div>
            {extraOutlets > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                <span className="text-gray-700 text-[11px] md:text-[12px] font-mono">
                  {extraOutlets} extra × RM {EXTRA_OUTLET_PRICE}
                </span>
                <span className="font-black text-[14px] md:text-[16px]" style={{ color: ACCENT }}>
                  + RM {outletSubtotal.toLocaleString()}/mo
                </span>
              </div>
            )}
          </div>
          {step === 3 && outletsTouched && (
            <ContinueButton onClick={() => advance(4)} />
          )}
          {step === 3 && !outletsTouched && outlets === 1 && (
            <div className="flex justify-end mt-5 md:mt-6">
              <button onClick={() => { setOutletsTouched(true); advance(4); }}
                className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 border-2 border-gray-300 hover:border-gray-500 text-gray-700 text-[11px] md:text-[12px] font-bold uppercase tracking-wider transition-colors">
                1 outlet is enough — continue <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </StepShell>

        {/* ─── STEP 04 — Entry Method ─── */}
        <StepShell num={4} title="Select desired entry method"
          subtitle="Optional — only if you need access control (tied to Face ID Check-In or Sentry Mode). Skip if not needed."
          visible={step >= 4}>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-5">
            <button onClick={() => { setEntryMethod('auto-swing'); setEntryTouched(true); }}
              className={`border-2 p-5 md:p-6 text-left transition-colors ${entryMethod === 'auto-swing' ? '' : 'border-gray-200 hover:border-gray-400'}`}
              style={entryMethod === 'auto-swing' ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)' } : {}}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${entryMethod === 'auto-swing' ? '' : 'border-gray-300'}`}
                  style={entryMethod === 'auto-swing' ? { borderColor: LIME } : {}}>
                  {entryMethod === 'auto-swing' && <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: LIME }} />}
                </div>
                <span className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.15em]" style={{ color: ACCENT }}>Option A</span>
              </div>
              <p className="text-gray-700 text-[14px] md:text-[16px] font-black uppercase tracking-tight mb-1.5">Auto Swing Gate</p>
              <p className="text-gray-700 text-[11px] md:text-[12px] leading-relaxed">+ Face ID. Full auto — gate swings open after a successful scan. Best for high-traffic entrances.</p>
            </button>

            <button onClick={() => { setEntryMethod('door-gate'); setEntryTouched(true); }}
              className={`border-2 p-5 md:p-6 text-left transition-colors ${entryMethod === 'door-gate' ? '' : 'border-gray-200 hover:border-gray-400'}`}
              style={entryMethod === 'door-gate' ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)' } : {}}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${entryMethod === 'door-gate' ? '' : 'border-gray-300'}`}
                  style={entryMethod === 'door-gate' ? { borderColor: LIME } : {}}>
                  {entryMethod === 'door-gate' && <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: LIME }} />}
                </div>
                <span className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.15em]" style={{ color: ACCENT }}>Option B</span>
              </div>
              <p className="text-gray-700 text-[14px] md:text-[16px] font-black uppercase tracking-tight mb-1.5">Door Gate</p>
              <p className="text-gray-700 text-[11px] md:text-[12px] leading-relaxed">+ Face ID. Standard door unlocks on scan — ideal for smaller premises and back-of-house access.</p>
            </button>
          </div>

          <label className="flex items-start gap-3 p-4 md:p-5 border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-colors mb-3">
            <span
              className={`flex-shrink-0 mt-0.5 w-5 h-5 border-2 flex items-center justify-center transition-all ${hasExisting ? '' : 'border-gray-300'}`}
              style={hasExisting ? { borderColor: LIME, backgroundColor: LIME } : {}}
            >
              {hasExisting && <Check size={12} strokeWidth={3} className="text-black" />}
            </span>
            <input type="checkbox" className="sr-only" checked={hasExisting} onChange={() => setHasExisting(v => !v)} />
            <div>
              <p className="text-gray-700 text-[12px] md:text-[13px] font-bold leading-snug">
                I already have an auto swing gate or door gate
              </p>
              <p className="text-gray-700 text-[11px] md:text-[12px] leading-relaxed mt-0.5">
                With or without Face ID — we'll see if we can integrate yours and save you hardware costs.
              </p>
            </div>
          </label>

          <button
            onClick={() => { setEntryMethod(null); setEntryTouched(true); advance(5); }}
            className="w-full text-center py-3 border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 text-[11px] md:text-[12px] font-bold uppercase tracking-wider transition-colors">
            Skip — I don't need access control
          </button>

          {step === 4 && entryTouched && entryMethod && (
            <ContinueButton onClick={() => advance(5)} />
          )}
        </StepShell>

        {/* ─── STEP 05 — Add-on Hardware ─── */}
        <StepShell num={5} title="Add-on hardware"
          subtitle="One-time hardware you'd like us to supply and install. Adjust the quantity for each — or leave everything at 0."
          visible={step >= 5}>

          <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-gray-700 mb-3">Access Control</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">

            {/* Doorlock */}
            <div className={`border-2 p-5 transition-colors ${doorlockQty > 0 ? '' : 'border-gray-200 bg-gray-50'}`}
              style={doorlockQty > 0 ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)' } : {}}>
              <DoorOpen size={20} strokeWidth={2} style={{ color: ACCENT }} className="mb-3" />
              <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.15em] text-gray-700 mb-1">Doorlock + Face ID</p>
              <p className="text-[20px] md:text-[22px] font-black mb-1" style={{ color: ACCENT }}>
                RM 2,000<span className="text-[11px] md:text-[12px] text-gray-700 font-bold ml-1">/unit</span>
              </p>
              <p className="text-gray-700 text-[11px] md:text-[12px] leading-relaxed mb-4">
                Replace your existing door lock with a Face ID unit. Works standalone.
              </p>
              <div className="flex items-center justify-between">
                <button onClick={() => { setDoorlockQty(v => Math.max(0, v - 1)); setHardwareTouched(true); }}
                  className="w-8 h-8 border-2 border-gray-300 hover:border-gray-500 flex items-center justify-center transition-colors"
                  aria-label="Decrease doorlocks">
                  <Minus size={12} strokeWidth={2.5} className="text-gray-700" />
                </button>
                <span className="text-[20px] md:text-[22px] font-black font-mono" style={{ color: ACCENT }}>{doorlockQty}</span>
                <button onClick={() => { setDoorlockQty(v => Math.min(20, v + 1)); setHardwareTouched(true); }}
                  className="w-8 h-8 border-2 border-gray-300 hover:border-gray-500 flex items-center justify-center transition-colors"
                  aria-label="Increase doorlocks">
                  <Plus size={12} strokeWidth={2.5} className="text-gray-700" />
                </button>
              </div>
            </div>

            {/* Entry Gate */}
            <div className={`border-2 p-5 transition-colors ${gateLanes > 0 ? '' : 'border-gray-200 bg-gray-50'}`}
              style={gateLanes > 0 ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)' } : {}}>
              <Fence size={20} strokeWidth={2} style={{ color: ACCENT }} className="mb-3" />
              <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.15em] text-gray-700 mb-1">Entry Gate + Face ID</p>
              <p className="text-[20px] md:text-[22px] font-black mb-1" style={{ color: ACCENT }}>
                RM 12,000<span className="text-[11px] md:text-[12px] text-gray-700 font-bold ml-1">/lane</span>
              </p>
              <p className="text-gray-700 text-[11px] md:text-[12px] leading-relaxed mb-4">
                Turnstile-style lane with Face ID. <span className="text-gray-700">1 in + 1 out = 2 lanes = RM 24,000.</span>
              </p>
              <div className="flex items-center justify-between">
                <button onClick={() => { setGateLanes(v => Math.max(0, v - 1)); setHardwareTouched(true); }}
                  className="w-8 h-8 border-2 border-gray-300 hover:border-gray-500 flex items-center justify-center transition-colors"
                  aria-label="Decrease gate lanes">
                  <Minus size={12} strokeWidth={2.5} className="text-gray-700" />
                </button>
                <span className="text-[20px] md:text-[22px] font-black font-mono" style={{ color: ACCENT }}>{gateLanes}</span>
                <button onClick={() => { setGateLanes(v => Math.min(10, v + 1)); setHardwareTouched(true); }}
                  className="w-8 h-8 border-2 border-gray-300 hover:border-gray-500 flex items-center justify-center transition-colors"
                  aria-label="Increase gate lanes">
                  <Plus size={12} strokeWidth={2.5} className="text-gray-700" />
                </button>
              </div>
            </div>

            {/* Sentry Camera */}
            <div className={`border-2 p-5 transition-colors ${sentryCams > 0 ? '' : 'border-gray-200 bg-gray-50'}`}
              style={sentryCams > 0 ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)' } : {}}>
              <Camera size={20} strokeWidth={2} style={{ color: ACCENT }} className="mb-3" />
              <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.15em] text-gray-700 mb-1">Sentry Camera</p>
              <p className="text-[20px] md:text-[22px] font-black mb-1" style={{ color: ACCENT }}>
                RM 350<span className="text-[11px] md:text-[12px] text-gray-700 font-bold ml-1">/ea</span>
              </p>
              <p className="text-gray-700 text-[11px] md:text-[12px] leading-relaxed mb-4">
                Face-scan camera for Sentry Mode coverage. <span className="text-gray-700">Max 3 per outlet.</span>
              </p>
              <div className="flex items-center justify-between">
                <button onClick={() => { setSentryCams(v => Math.max(0, v - 1)); setHardwareTouched(true); }}
                  className="w-8 h-8 border-2 border-gray-300 hover:border-gray-500 flex items-center justify-center transition-colors"
                  aria-label="Decrease cameras">
                  <Minus size={12} strokeWidth={2.5} className="text-gray-700" />
                </button>
                <span className="text-[20px] md:text-[22px] font-black font-mono" style={{ color: ACCENT }}>{sentryCams}</span>
                <button onClick={() => { setSentryCams(v => Math.min(3, v + 1)); setHardwareTouched(true); }}
                  className="w-8 h-8 border-2 border-gray-300 hover:border-gray-500 flex items-center justify-center transition-colors"
                  aria-label="Increase cameras">
                  <Plus size={12} strokeWidth={2.5} className="text-gray-700" />
                </button>
              </div>
            </div>
          </div>

          <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-gray-700 mb-3">POS Hardware</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            {POS_HARDWARE.map(hw => {
              const qty = posHwQty[hw.id];
              const active = qty > 0;
              return (
                <div key={hw.id} className={`border-2 p-4 transition-colors ${active ? '' : 'border-gray-200 bg-gray-50'}`}
                  style={active ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)' } : {}}>
                  <hw.Icon size={20} strokeWidth={2} style={{ color: ACCENT }} className="mb-3" />
                  <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.15em] text-gray-700 mb-1">{hw.title}</p>
                  <p className="text-[17px] md:text-[20px] font-black mb-1 leading-none" style={{ color: ACCENT }}>
                    RM {hw.price.toLocaleString()}<span className="text-[10px] md:text-[11px] text-gray-700 font-bold ml-1">/unit</span>
                  </p>
                  <p className="text-gray-700 text-[11px] leading-snug mb-4">
                    {hw.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <button onClick={() => bumpPosHw(hw.id, -1)}
                      className="w-8 h-8 border-2 border-gray-300 hover:border-gray-500 flex items-center justify-center transition-colors"
                      aria-label={`Decrease ${hw.title}`}>
                      <Minus size={12} strokeWidth={2.5} className="text-gray-700" />
                    </button>
                    <span className="text-[18px] md:text-[20px] font-black font-mono" style={{ color: ACCENT }}>{qty}</span>
                    <button onClick={() => bumpPosHw(hw.id, 1)}
                      className="w-8 h-8 border-2 border-gray-300 hover:border-gray-500 flex items-center justify-center transition-colors"
                      aria-label={`Increase ${hw.title}`}>
                      <Plus size={12} strokeWidth={2.5} className="text-gray-700" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-2 border-gray-200 p-4 md:p-5 text-[11px] md:text-[12px] leading-relaxed space-y-1 mb-3">
            <p className="text-gray-700"><span className="text-gray-700">*</span> All prices above include full setup.</p>
            <p className="text-gray-700"><span className="text-gray-700">*</span> Wiring, power plugs and internet to be provided by client.</p>
            <p className="text-gray-700"><span style={{ color: ACCENT }}>**</span> 24 months 0% interest installment available with Maybank &amp; CIMB.</p>
          </div>

          <button
            onClick={() => { setDoorlockQty(0); setGateLanes(0); setSentryCams(0); setPosHwQty({ ...EMPTY_POS_HW_QTY }); advance(6); }}
            className="w-full text-center py-3 border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 text-[11px] md:text-[12px] font-bold uppercase tracking-wider transition-colors">
            Skip — no hardware needed
          </button>

          {step === 5 && hardwareTouched && (
            <ContinueButton onClick={() => advance(6)} />
          )}
        </StepShell>

        {/* ─── STEP 06 — Private Server ─── */}
        <StepShell num={6} title="Want a private server?"
          subtitle="Your own dedicated database, isolated from the shared platform. Faster, hardened, and auditable — only your team has access. Not for everyone, but essential for franchises and data-strict operations."
          visible={step >= 6}>

          <div className="border-2 border-gray-200 p-5 md:p-7 mb-4 md:mb-5 bg-gray-50">
            <div className="flex items-start gap-4">
              <Server size={24} strokeWidth={2} style={{ color: ACCENT }} className="flex-shrink-0 mt-1" />
              <div className="flex-1">
                <div className="flex items-baseline justify-between mb-2">
                  <p className="text-[11px] md:text-[13px] font-black uppercase tracking-wider text-gray-700">Private Server</p>
                  <span className="text-gray-700 text-[18px] md:text-[22px] font-black">Let's talk</span>
                </div>
                <ul className="space-y-1.5 md:space-y-2 text-[12px] md:text-[13px] text-gray-700 leading-relaxed">
                  <li className="flex gap-2"><Check size={12} strokeWidth={3} className="flex-shrink-0 mt-1" style={{ color: ACCENT }} /> Dedicated server — zero neighbours</li>
                  <li className="flex gap-2"><Check size={12} strokeWidth={3} className="flex-shrink-0 mt-1" style={{ color: ACCENT }} /> Only your team has database access, not even us</li>
                  <li className="flex gap-2"><Check size={12} strokeWidth={3} className="flex-shrink-0 mt-1" style={{ color: ACCENT }} /> Custom backups, audit trail, region of your choice</li>
                  <li className="flex gap-2"><Check size={12} strokeWidth={3} className="flex-shrink-0 mt-1" style={{ color: ACCENT }} /> Ideal for franchises, chains, or strict compliance needs</li>
                </ul>
                <p className="text-[11px] md:text-[12px] italic mt-3" style={{ color: ACCENT }}>
                  Priced per setup — we'll quote on WhatsApp.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setPserver(true)}
              className={`border-2 p-4 md:p-5 text-left transition-colors ${pserverOn ? '' : 'border-gray-200 hover:border-gray-400'}`}
              style={pserverOn ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.08)' } : {}}>
              <div className="flex items-center gap-2 mb-1">
                <Check size={16} strokeWidth={3} style={{ color: pserverOn ? ACCENT : '#6b7280' }} />
                <span className="text-[12px] md:text-[14px] font-black uppercase tracking-wider" style={{ color: pserverOn ? ACCENT : '#6b7280' }}>Yes, private it</span>
              </div>
              <span className="text-gray-700 text-[11px] md:text-[12px] pl-6">Quote separately</span>
            </button>
            <button onClick={() => setPserver(false)}
              className={`border-2 p-4 md:p-5 text-left transition-colors ${pserver === false ? 'border-gray-500 bg-gray-100' : 'border-gray-200 hover:border-gray-400'}`}>
              <div className="flex items-center gap-2 mb-1">
                <X size={16} strokeWidth={3} className={pserver === false ? 'text-gray-700' : 'text-gray-700'} />
                <span className="text-[12px] md:text-[14px] font-black uppercase tracking-wider text-gray-700">Shared is fine</span>
              </div>
              <span className="text-gray-700 text-[11px] md:text-[12px] pl-6">Default — secure &amp; fast</span>
            </button>
          </div>
          {step === 6 && pserver !== null && (
            <ContinueButton onClick={() => advance(7)} label="Review my quote" />
          )}
        </StepShell>

        {/* ─── SUMMARY ─── */}
        {step >= 7 && (
          <section id="quote-summary" className="border-4 p-5 md:p-8 scroll-mt-20" style={{ borderColor: LIME, animation: 'qfit-reveal 0.4s ease-out' }}>
            <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.25em] mb-4 md:mb-6" style={{ color: ACCENT }}>
              Your Quote
            </p>

            <div className="mb-6 md:mb-8 p-4 md:p-5 border-2" style={{ borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)' }}>
              <p className="text-gray-700 text-[16px] md:text-[22px] font-black uppercase tracking-tight leading-tight text-center">
                <span style={{ color: ACCENT }}>Modular pricing</span> · Pay for what you use. <span style={{ color: ACCENT }}>Scale when ready.</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6 md:gap-10 items-start">
              <div>
                <div className="space-y-2 text-[12px] md:text-[13px] font-mono mb-5 md:mb-6">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-700">Billing</span>
                    <span className="text-gray-700 font-bold">{is2Year ? '2 Years (–20%)' : 'Annual'}</span>
                  </div>

                  {/* Cores breakdown */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.15em]" style={{ color: ACCENT }}>
                      Cores ({coresCount})
                    </span>
                    <span className="text-gray-700 font-bold">RM {coresSubtotal.toLocaleString()}/mo</span>
                  </div>
                  {coresPicked.length > 0 ? coresPicked.map((c, i) => (
                    <div key={i} className="flex justify-between text-[11px] md:text-[12px] pl-3">
                      <span className="text-gray-700">· {c.title}{c.isDefault && <span className="italic"> (default)</span>}</span>
                      <span className="text-gray-700">{c.isDefault ? 'Inclusive' : `RM ${c.price}`}</span>
                    </div>
                  )) : (
                    <p className="text-gray-700 italic text-[11px] pl-3">None selected</p>
                  )}

                  {/* Additionals breakdown */}
                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.15em]" style={{ color: ACCENT }}>
                      Additionals ({addonsSelectedCount})
                    </span>
                    <span className="text-gray-700 font-bold">{addonsSubtotal > 0 ? `RM ${addonsSubtotal.toLocaleString()}/mo` : '—'}</span>
                  </div>
                  {addonsSelectedCount > 0 ? (
                    <>
                      {autoReportsQty > 0 && (
                        <div className="flex justify-between text-[11px] md:text-[12px] pl-3">
                          <span className="text-gray-700">· Auto Reports × {autoReportsQty}</span>
                          <span className="text-gray-700">RM {autoReportsCost.toLocaleString()}</span>
                        </div>
                      )}
                      {addonsPicked.map((a, i) => (
                        <div key={i} className="flex justify-between text-[11px] md:text-[12px] pl-3">
                          <span className="text-gray-700">· {a.title}{a.oneTime && <span className="text-gray-700"> + one-time</span>}</span>
                          <span className="text-gray-700">RM {a.price}</span>
                        </div>
                      ))}
                    </>
                  ) : (
                    <p className="text-gray-700 italic text-[11px] pl-3">None selected</p>
                  )}

                  <div className="flex justify-between border-b border-gray-200 pb-2 pt-3">
                    <span className="text-gray-700">Outlets</span>
                    <span className="text-gray-700 font-bold">{outlets}{extraOutlets > 0 ? ` (+ RM ${outletSubtotal}/mo)` : ' (included)'}</span>
                  </div>
                  {posCoreSelected && (
                    <>
                      <div className="pt-3 flex items-center justify-between">
                        <span className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.15em]" style={{ color: ACCENT }}>
                          POS Channels
                        </span>
                        <span className="text-gray-700 font-bold">{channelsSubtotal > 0 ? `+ RM ${channelsSubtotal}/mo` : 'Included'}</span>
                      </div>
                      {CHANNELS.filter(c => channelUnits[c.id] > 0).map(c => (
                        <div key={c.id} className="flex justify-between text-[11px] md:text-[12px] pl-3">
                          <span className="text-gray-700">· {c.title} × {channelUnits[c.id]}</span>
                          <span className="text-gray-700">{channelUnits[c.id] > 0 ? '' : '—'}</span>
                        </div>
                      ))}
                      {totalChannelUnits === 0 && (
                        <p className="text-gray-700 italic text-[11px] pl-3">No channels picked</p>
                      )}
                    </>
                  )}
                  <div className="flex justify-between border-b border-gray-200 pb-2 gap-4">
                    <span className="text-gray-700 flex-shrink-0">Entry</span>
                    <span className="text-gray-700 font-bold text-right">
                      {entryMethod === 'auto-swing' ? 'Auto Swing + Face ID' : entryMethod === 'door-gate' ? 'Door Gate + Face ID' : '—'}
                      {hasExisting && <span className="text-gray-700 font-normal"> · existing</span>}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-700">Private Server</span>
                    <span className="text-gray-700 font-bold">{pserverOn ? 'Quote sep.' : '—'}</span>
                  </div>

                  {hasHardware && (
                    <>
                      <div className="pt-3 flex items-center justify-between">
                        <span className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.15em]" style={{ color: ACCENT }}>Hardware (one-time)</span>
                        <span className="text-gray-700 font-black">RM {hardwareSubtotal.toLocaleString()}</span>
                      </div>
                      {doorlockQty > 0 && (
                        <div className="flex justify-between text-[11px] md:text-[12px] pl-3">
                          <span className="text-gray-700">· Doorlock × {doorlockQty}</span>
                          <span className="text-gray-700">RM {doorlockCost.toLocaleString()}</span>
                        </div>
                      )}
                      {gateLanes > 0 && (
                        <div className="flex justify-between text-[11px] md:text-[12px] pl-3">
                          <span className="text-gray-700">· Entry Gate × {gateLanes} lane{gateLanes > 1 ? 's' : ''}</span>
                          <span className="text-gray-700">RM {gateCost.toLocaleString()}</span>
                        </div>
                      )}
                      {sentryCams > 0 && (
                        <div className="flex justify-between text-[11px] md:text-[12px] pl-3">
                          <span className="text-gray-700">· Sentry Camera × {sentryCams}</span>
                          <span className="text-gray-700">RM {camCost.toLocaleString()}</span>
                        </div>
                      )}
                      {POS_HARDWARE.filter(hw => posHwQty[hw.id] > 0).map(hw => {
                        const qty = posHwQty[hw.id];
                        return (
                          <div key={hw.id} className="flex justify-between text-[11px] md:text-[12px] pl-3">
                            <span className="text-gray-700">· {hw.title} × {qty}</span>
                            <span className="text-gray-700">RM {(hw.price * qty).toLocaleString()}</span>
                          </div>
                        );
                      })}
                      <p className="text-[10px] text-gray-700 italic pt-1">
                        24 mo 0% instalment available (Maybank / CIMB)
                      </p>
                    </>
                  )}

                </div>
              </div>

              <div className="space-y-4 md:space-y-5">
                <div className="border-2 border-gray-200 bg-gray-50 p-5 md:p-6">
                  <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-4 text-center">Plan</p>

                  <div className="flex justify-center mb-5">
                    <div className="inline-flex items-stretch border-2" style={{ borderColor: LIME }}>
                      <button onClick={() => setBilling('annual')}
                        className={`px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-colors ${billing === 'annual' ? 'text-black' : 'text-gray-700 hover:text-gray-900'}`}
                        style={billing === 'annual' ? { backgroundColor: LIME } : {}}>
                        Annual
                      </button>
                      <button onClick={() => setBilling('2year')}
                        className={`px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-colors flex items-center gap-1.5 ${billing === '2year' ? 'text-black' : 'text-gray-700 hover:text-gray-900'}`}
                        style={billing === '2year' ? { backgroundColor: LIME } : {}}>
                        2 Years
                        <span className="text-[8px] md:text-[9px] font-mono" style={billing === '2year' ? { color: 'rgba(0,0,0,0.6)' } : { color: ACCENT }}>
                          –20%
                        </span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-gray-700 mb-3 text-center">
                    {is2Year ? '2-Year Total' : 'Annual Total'}
                  </p>
                  <div className="text-center">
                    <div className="flex items-baseline justify-center gap-2">
                      {is2Year && monthlyTotal > 0 && (
                        <span className="text-gray-500 line-through text-[18px] md:text-[22px] font-black">
                          RM {termListTotal.toLocaleString()}
                        </span>
                      )}
                      <div className="flex items-baseline">
                        <span className="text-gray-700 text-[20px] md:text-[24px] font-black align-top mr-1.5">RM</span>
                        <span className="font-black leading-none tracking-tighter text-[48px] md:text-[64px]" style={{ color: ACCENT }}>{termTotal.toLocaleString()}</span>
                        <span className="text-gray-700 text-[14px] md:text-[16px] font-bold ml-1.5">{is2Year ? '/2yr' : '/yr'}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 text-[10px] md:text-[11px] mt-1">
                      Billed upfront — locks the rate for {termMonths} months.
                    </p>

                    {is2Year && monthlyTotal > 0 && (
                      <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-wider mt-2" style={{ color: ACCENT }}>
                        − 20% · save RM {termSavings.toLocaleString()}
                      </p>
                    )}

                    {monthlyTotal > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                        <div className="flex items-center justify-between text-[11px] md:text-[12px]">
                          <span className="text-gray-700 font-bold uppercase tracking-wider">One-time setup fee</span>
                          <span className="text-gray-900 font-black">RM {SETUP_FEE.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] md:text-[12px]">
                          <span className="text-gray-700 font-bold uppercase tracking-wider">Monthly fee</span>
                          <span className="text-gray-900 font-black">RM {monthlyTotal.toLocaleString()}/mo</span>
                        </div>
                      </div>
                    )}

                    {pserverOn && (
                      <p className="text-gray-700 text-[10px] md:text-[11px] leading-relaxed mt-3 pt-3 border-t border-gray-200">
                        + <span style={{ color: ACCENT }}>Private Server</span> quoted separately on WhatsApp.
                      </p>
                    )}

                    {monthlyTotal === 0 && (
                      <p className="text-gray-700 text-[11px] md:text-[12px] mt-4">
                        Pick at least 1 core to see pricing.
                      </p>
                    )}
                  </div>
                </div>

                {hasHardware && (
                  <div className="border-2 border-gray-200 bg-gray-50 p-5 md:p-6">
                    <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-3 text-center">One-time Payment (Hardware)</p>

                    <div className="space-y-1.5 text-[11px] md:text-[12px] font-mono mb-4 pb-4 border-b-2 border-gray-200">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Hardware</span>
                        <span className="text-gray-700 font-bold">RM {hardwareSubtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Delivery</span>
                        <span className="text-gray-700 font-bold">RM {deliveryFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-gray-200">
                        <span className="text-gray-700 font-bold">Total</span>
                        <span className="font-black" style={{ color: ACCENT }}>RM {hardwareGrandTotal.toLocaleString()}</span>
                      </div>
                    </div>

                    <p className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-wider text-gray-700 mb-2 text-center">Payment plan</p>
                    <div className="grid grid-cols-2 gap-1.5 mb-4">
                      {([
                        { key: 0 as const, label: 'Full' },
                        { key: 6 as const, label: '6 mo · 0%' },
                        { key: 12 as const, label: '12 mo · 0%' },
                        { key: 24 as const, label: '24 mo · 0%' },
                      ]).map(opt => {
                        const active = installment === opt.key;
                        return (
                          <button key={opt.key}
                            onClick={() => setInstallment(opt.key)}
                            className={`py-2 px-2 text-[10px] md:text-[11px] font-black uppercase tracking-wider border-2 transition-colors ${active ? 'text-black' : 'border-gray-200 text-gray-700 hover:text-gray-900 hover:border-gray-400'}`}
                            style={active ? { borderColor: LIME, backgroundColor: LIME } : {}}>
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="text-center">
                      {installment === 0 ? (
                        <>
                          <div className="flex items-baseline justify-center">
                            <span className="text-gray-700 text-[16px] md:text-[20px] font-black align-top mr-1.5">RM</span>
                            <span className="font-black leading-none tracking-tighter text-[36px] md:text-[48px]" style={{ color: ACCENT }}>{hardwareGrandTotal.toLocaleString()}</span>
                          </div>
                          <p className="text-gray-700 text-[10px] md:text-[11px] font-bold uppercase tracking-wider mt-2">One-time</p>
                        </>
                      ) : (
                        <>
                          <div className="flex items-baseline justify-center">
                            <span className="text-gray-700 text-[16px] md:text-[20px] font-black align-top mr-1.5">RM</span>
                            <span className="font-black leading-none tracking-tighter text-[36px] md:text-[48px]" style={{ color: ACCENT }}>{installmentMonthly.toLocaleString()}</span>
                            <span className="text-gray-700 text-[13px] md:text-[15px] font-bold ml-1.5">/mo</span>
                          </div>
                          <p className="text-gray-700 text-[10px] md:text-[11px] font-bold uppercase tracking-wider mt-2">
                            × {installment} months <span style={{ color: ACCENT }}>· 0% interest</span>
                          </p>
                          <p className="text-gray-700 text-[10px] italic mt-1">Maybank / CIMB — subject to approval</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 md:mt-8 pt-5 md:pt-6 border-t-2 border-gray-200 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
              <p className="text-gray-700 text-[11px] md:text-[12px] leading-relaxed max-w-md">
                Tap the button — your full config is sent to our WhatsApp. We'll confirm, invoice, and onboard same day.
              </p>
              <a href={waLink} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 md:px-8 py-3.5 md:py-4 text-black text-[12px] md:text-[14px] font-black uppercase tracking-wider transition-colors hover:opacity-90 whitespace-nowrap"
                style={{ backgroundColor: LIME }}>
                <MessageCircle size={16} strokeWidth={2.5} />
                Lock in this quote
                <ArrowRight size={14} strokeWidth={2.5} />
              </a>
            </div>
          </section>
        )}

        {/* ─── Pricing FAQ ─── */}
        {step >= 7 && (
        <section className="mt-14 md:mt-20" style={{ animation: 'qfit-reveal 0.4s ease-out' }}>
          <div className="flex items-center gap-3 mb-5 md:mb-6">
            <span className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center border-2 text-[11px] md:text-[12px] font-mono font-black" style={{ borderColor: LIME, color: ACCENT }}>
              FAQ
            </span>
            <h2 className="text-[15px] md:text-[20px] font-black uppercase tracking-tight text-gray-700">Pricing questions, answered</h2>
          </div>

          <div className="border-t-2 border-gray-200 md:pl-11">
            {PRICING_FAQS.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div key={i} className="border-b-2 border-gray-200">
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 py-4 md:py-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-700 text-[12px] md:text-[14px] font-bold uppercase tracking-tight pr-4">{faq.q}</span>
                    <Plus
                      size={18}
                      strokeWidth={2.5}
                      className="flex-shrink-0 transition-transform"
                      style={{ color: ACCENT, transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
                    />
                  </button>
                  {open && (
                    <p className="text-gray-700 text-[12px] md:text-[14px] leading-relaxed pb-5 md:pb-6 pr-8" style={{ animation: 'qfit-reveal 0.25s ease-out' }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
        )}

        {/* ─── Closing statement ─── */}
        {step >= 7 && (
          <section className="mt-14 md:mt-20 py-12 md:py-16 border-y-4 text-center relative overflow-hidden"
            style={{ borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.04)', animation: 'qfit-reveal 0.5s ease-out' }}>
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4" style={{ borderColor: LIME }} />
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4" style={{ borderColor: LIME }} />
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4" style={{ borderColor: LIME }} />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4" style={{ borderColor: LIME }} />

            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.9]">
              We win <span style={{ color: ACCENT }}>only</span> when<br className="hidden sm:block" /> <span style={{ color: ACCENT }}>you</span> win.
            </h2>
          </section>
        )}

        <p className="text-gray-700 text-[10px] md:text-[11px] text-center mt-10 md:mt-14">
          Private page — not publicly linked. Reach out only if you were invited here.
        </p>
      </main>
    </div>
  );
}
