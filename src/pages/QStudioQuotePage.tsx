import { useState } from 'react';
import {
  ArrowRight, ArrowLeft, MessageCircle, Check, Plus, Minus, Server, X,
  DoorOpen, Camera, Fence, Send, ScanFace, ShieldCheck, Settings2,
  CreditCard, CalendarCheck, Heart, Users, Monitor, Smartphone, Tablet,
  MonitorSmartphone, Printer, Globe, Brain, Wallet, Rocket, FileText,
  type LucideIcon,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';

const LIME = '#CCFF00';

const EXTRA_OUTLET_PRICE = 129;
const EXTRA_CHANNEL_PRICE = 30;
const SETUP_FEE = 1500;
const ANNUAL_DISCOUNT = 0.15;
const SST_RATE = 0.08;

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
type CoreId = 'pos' | 'bookings' | 'loyalty' | 'staff' | 'qhub';

type Core = {
  id: CoreId;
  title: string;
  price: number;
  isDefault?: boolean;
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
    price: 129,
    tagline: 'Turn one-time visits into lifelong revenue.',
    features: [
      'Flexible Membership Plans', 'Credit-Based Packs',
      'Auto-Renewal & Billing', 'Freeze / Cancel',
      'Points Earning', 'Reward Catalogue & Redemption',
      'Bonus Campaigns', 'Referral Tracking',
      'Customer Segmentation', 'Lifetime Value Tracking',
      'Birthday & Anniversary Triggers', 'Promo Banner Slider',
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
      'Staff App (Mobile)', 'KPI Dashboard',
      'Top Performer Rankings', 'Commission Engine (% or flat)',
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
  { q: 'How does the pricing work?', a: 'Pick the cores you need — each is priced independently (RM 69/mth for most, RM 129/mth for Memberships & Loyalty). Add any additionals you want, each priced separately. Your first outlet is included; each extra outlet is RM 129/mth. No minimums beyond 1 core; no surprise upgrades.' },
  { q: 'Can I start with 1 core and add more later?', a: 'Yes. Add or drop cores and additionals anytime. Billing is prorated for the month you activate — no lock-in on what you pick.' },
  { q: 'Is there a contract?', a: 'Two plan terms: 6 months at the standard rate, or 12 months (Annual) at 15% off — both lock your rate for the duration. Monthly is billed in advance with 8% SST.' },
  { q: 'What counts as an "outlet"?', a: 'Each physical branch or premises with its own staff, hours, and POS/booking flow. Online-only storefronts count as 1 outlet. Each extra outlet is RM 129/mth.' },
  { q: 'What are "POS channels"?', a: 'POS channels are how you take orders & payments — POS terminal, self-order Kiosk, QR Order (scan-to-order), or Webstore. POS & Payments core includes 1 channel free per outlet — so 2 outlets = 2 free channels. Each additional unit (e.g. a second POS at the counter, or adding Webstore on top) is RM 30/mth. POS and Kiosk can have multiple units per outlet; QR Order and Webstore are 1 unit max.' },
  { q: 'What\'s in "Customized Modules"?', a: 'For businesses with unique workflows — bespoke field logic, industry-specific adjustments, custom reports, private integrations. RM 69/mth covers ongoing maintenance and minor iterations. Initial build is scoped and quoted separately.' },
  { q: 'How does Sentry Mode work?', a: 'The RM 300/mth covers the software — continuous scanning, alerts, timeline log. You\'ll need at least one Sentry Camera per zone (max 3 per outlet). Add cameras in the hardware step (RM 350 each, one-time).' },
  { q: 'What\'s the setup fee?', a: 'RM 1,500 one-time — covers onboarding, staff training, data import, outlet configuration, and integrations setup. Waived or reduced on 12-month (Annual) commitments in most cases.' },
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
        <h2 className="text-[15px] md:text-[20px] font-black uppercase tracking-tight text-white">{title}</h2>
      </div>
      {subtitle && <p className="text-white text-[12px] md:text-[14px] leading-relaxed mb-5 md:mb-6 pl-10 md:pl-11">{subtitle}</p>}
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
        className={`inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 text-black text-[11px] md:text-[12px] font-black uppercase tracking-wider transition-colors ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white'}`}
        style={{ backgroundColor: LIME }}>
        {label || 'Continue'} <ArrowRight size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// MAIN PAGE
// ────────────────────────────────────────────────────────────────
export default function QStudioQuotePage() {
  const [step, setStep] = useState(1);
  const [term, setTerm] = useState<6 | 12>(6);
  const [selectedCores, setSelectedCores] = useState<Set<CoreId>>(
    new Set(CORES.filter(c => c.isDefault).map(c => c.id))
  );
  const [selectedAddons, setSelectedAddons] = useState<Set<AddonId>>(new Set());
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
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // ── Quotation modal state ──
  type QuoteStage = 'review' | 'form' | 'print';
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteStage, setQuoteStage] = useState<QuoteStage>('review');
  const [installPlan, setInstallPlan] = useState<0 | 6 | 12>(0);
  type BankId = 'maybank' | 'cimb' | 'publicbank';
  const [selectedBank, setSelectedBank] = useState<BankId | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [shippingLocation, setShippingLocation] = useState('');
  const [picName, setPicName] = useState('');
  const [picMobile, setPicMobile] = useState('');
  const [quoteRef] = useState(() => `QS-${Date.now().toString(36).toUpperCase().slice(-6)}`);

  const openQuote = () => {
    setQuoteStage('review');
    setInstallPlan(0);
    setSelectedBank(null);
    setQuoteOpen(true);
  };

  const selectInstallPlan = (p: 0 | 6 | 12) => {
    setInstallPlan(p);
    if (p === 0) setSelectedBank(null);
  };

  const selectModalTerm = (months: 6 | 12) => {
    setTerm(months);
    if (months === 6 && installPlan === 12) {
      setInstallPlan(0);
      setSelectedBank(null);
    }
  };

  const BANKS: { id: BankId; label: string }[] = [
    { id: 'maybank', label: 'Maybank' },
    { id: 'cimb', label: 'CIMB' },
    { id: 'publicbank', label: 'Public Bank' },
  ];
  const bankLabel = (id: BankId | null) => BANKS.find(b => b.id === id)?.label ?? null;
  const closeQuote = () => setQuoteOpen(false);

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
  const isAnnual = term === 12;
  const coresCount = Array.from(selectedCores).filter(id => !CORES.find(c => c.id === id)?.isDefault).length;
  const coresSubtotal = Array.from(selectedCores).reduce((sum, id) => sum + CORE_PRICE_MAP[id], 0);
  const addonsSubtotal = Array.from(selectedAddons).reduce((sum, id) => sum + ADDON_PRICE_MAP[id], 0);
  const extraOutlets = Math.max(0, outlets - 1);
  const outletSubtotal = extraOutlets * EXTRA_OUTLET_PRICE;

  const posCoreSelected = selectedCores.has('pos');
  const totalChannelUnits = CHANNELS.reduce((sum, c) => sum + channelUnits[c.id], 0);
  const freeChannelAllowance = posCoreSelected ? outlets : 0;
  const billableChannelUnits = Math.max(0, totalChannelUnits - freeChannelAllowance);
  const channelsSubtotal = billableChannelUnits * EXTRA_CHANNEL_PRICE;
  const monthlyPreDiscount = coresSubtotal + addonsSubtotal + outletSubtotal + channelsSubtotal;
  const annualDiscountAmount = isAnnual ? Math.round(monthlyPreDiscount * ANNUAL_DISCOUNT) : 0;
  const effectiveMonthly = monthlyPreDiscount - annualDiscountAmount;
  const annualUpfront = effectiveMonthly * 12;
  const annualSavings = annualDiscountAmount * 12;

  // ── Term + SST math (for quotation modal) ──
  const termMonths = isAnnual ? 12 : 6;
  const monthlySst = Math.round(effectiveMonthly * SST_RATE);
  const monthlyWithSst = effectiveMonthly + monthlySst;
  const subscriptionTotal = monthlyWithSst * termMonths;

  const pserverOn = pserver === true;

  // ── Hardware math ──
  const doorlockCost = doorlockQty * 2000;
  const gateCost = gateLanes * 12000;
  const camCost = sentryCams * 350;
  const posHwSubtotal = POS_HARDWARE.reduce((sum, hw) => sum + hw.price * posHwQty[hw.id], 0);
  const hardwareSubtotal = doorlockCost + gateCost + camCost + posHwSubtotal;
  const hasHardware = hardwareSubtotal > 0;
  const deliveryFee = hasHardware ? 300 : 0;
  // Hardware: 0% SST. Delivery: 8% SST (service). Setup: 8% SST (service).
  const deliverySst = Math.round(deliveryFee * SST_RATE);
  const hardwareGrandTotal = hardwareSubtotal + deliveryFee + deliverySst;
  const setupSst = Math.round(SETUP_FEE * SST_RATE);
  const setupWithSst = SETUP_FEE + setupSst;

  // ── Grand total for quotation ──
  const oneTimeTotal = hardwareGrandTotal + setupWithSst;
  const grandTotal = subscriptionTotal + oneTimeTotal;
  const installPlanMonthly = installPlan > 0 ? Math.ceil(grandTotal / installPlan) : 0;
  const isInstallment = installPlan > 0;

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
    `Plan term: ${isAnnual ? '12 months (Annual · 15% off — save RM ' + annualSavings.toLocaleString() + '/year)' : '6 months (standard rate)'}`,
    `Cores picked (${coresCount}): ${coresPicked.length > 0 ? coresPicked.map(c => c.isDefault ? `${c.title} (inclusive)` : `${c.title} (RM ${c.price})`).join(', ') : 'None'} — RM ${coresSubtotal}/mo`,
    addonsPicked.length > 0
      ? `Additionals: ${addonsPicked.map(a => a.oneTime ? `${a.title} (RM ${a.price}/mo + one-time dev fee — quote sep.)` : `${a.title} (RM ${a.price}/mo)`).join(', ')} — RM ${addonsSubtotal}/mo recurring`
      : 'Additionals: None',
    `Outlets: ${outlets}${extraOutlets > 0 ? ` (${extraOutlets} extra × RM 129/mo = RM ${outletSubtotal}/mo)` : ' (included)'}`,
    posCoreSelected
      ? `POS channels: ${CHANNELS.filter(c => channelUnits[c.id] > 0).map(c => `${c.title} × ${channelUnits[c.id]}`).join(', ') || 'None selected'}${billableChannelUnits > 0 ? ` — ${freeChannelAllowance} free (1/outlet), ${billableChannelUnits} billable × RM ${EXTRA_CHANNEL_PRICE}/mo = RM ${channelsSubtotal}/mo` : ` (${freeChannelAllowance} included — 1/outlet)`}`
      : null,
    `Entry method: ${entryLabel}${hasExisting ? ' (has existing gate)' : ''}`,
    hardwareLines.length > 0
      ? `Hardware (one-time): ${hardwareLines.join(' | ')} | Subtotal RM ${hardwareSubtotal.toLocaleString()} + Delivery RM 300 = RM ${hardwareGrandTotal.toLocaleString()}`
      : `Hardware (one-time): None`,
    `Payment plan: ${isInstallment ? `ZIPP ${installPlan} mo × RM ${installPlanMonthly.toLocaleString()}/mo (0% interest${selectedBank ? ` — ${bankLabel(selectedBank)} credit card` : ' — Maybank / CIMB / Public Bank credit card'})` : 'Full payment'}`,
    `Private Server: ${pserverOn ? 'Yes (quote separately)' : 'No'}`,
    `Estimated monthly: RM ${effectiveMonthly.toLocaleString()}`,
    isAnnual
      ? `Annual upfront: RM ${annualUpfront.toLocaleString()} (saved RM ${annualSavings.toLocaleString()})`
      : null,
    `One-time setup fee: RM ${SETUP_FEE.toLocaleString()} (may be waived on annual)`,
  ].filter(Boolean).join('\n- ');

  const waLink = 'https://wa.me/60126909189?text=' + encodeURIComponent(
    `Hi! I'd like to lock in this QStudio quote:\n\n- ${configLines}\n\nLet's set up.`
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#CCFF00] selection:text-black overflow-x-hidden">
      <SEOHead
        title="QStudio — Private Quote Builder"
        description="Build your QStudio setup — pick cores, add-ons, outlets, and hardware — and send the quote to WhatsApp in seconds."
        keywords="QStudio quote, QStudio pricing, service business platform pricing Malaysia"
        image="https://qbot.now/qfitimg/qfit1.jpg"
        imageAlt="QStudio — Private Quote Configurator"
        url="https://qbot.now/qstudio/quote"
        noindex
      />

      {/* ─── Top bar ─── */}
      <header className="border-b border-white/10 bg-black/95 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <a href="/qstudio" className="flex items-center gap-2 text-white hover:text-white transition-colors">
            <ArrowLeft size={14} strokeWidth={2.5} />
            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider">Back to QStudio</span>
          </a>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: LIME }} />
            <span className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.2em]" style={{ color: LIME }}>Private Quote</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-16">

        {/* ─── Hero ─── */}
        <section className="mb-8 md:mb-10">
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.3em] mb-3" style={{ color: LIME }}>
            Build Your Quote
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.9] mb-4">
            <span style={{ color: LIME }}>Modular</span> Pricing
          </h1>
          <p className="text-white text-[13px] md:text-[15px] leading-relaxed max-w-2xl">
            Pick the cores you need. Add the extras you want. Scale when you're ready.
          </p>
        </section>

        {/* ─── STEP 01 — Pick Cores ─── */}
        <StepShell num={1} title="Pick your cores"
          subtitle="Each core is priced independently. Tap to add or remove. Pick at least one — most businesses start with 2 or 3."
          visible={true}>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-5">
            {CORES.filter(c => !c.isDefault).map(core => {
              const active = selectedCores.has(core.id);
              return (
                <button key={core.id} onClick={() => toggleCore(core.id)}
                  className={`border-2 p-5 md:p-6 text-left transition-colors ${active ? '' : 'border-white/15 hover:border-white/40'}`}
                  style={active ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)' } : {}}>

                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`flex-shrink-0 w-10 h-10 border-2 flex items-center justify-center transition-colors ${active ? '' : 'border-white/20'}`}
                        style={active ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.12)' } : {}}>
                        <core.Icon size={18} strokeWidth={2} style={{ color: active ? LIME : 'white' }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-[14px] md:text-[16px] font-black uppercase tracking-tight leading-tight truncate">{core.title}</p>
                        <p className="text-white text-[11px] md:text-[12px] leading-snug">{core.tagline}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="font-black text-[18px] md:text-[22px] leading-none" style={{ color: LIME }}>RM {core.price}</p>
                      <p className="text-white text-[9px] md:text-[10px] font-mono uppercase tracking-wider">/ mth</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 md:gap-1.5 mb-3">
                    {core.features.map((f, i) => (
                      <span key={i} className="inline-block border border-white/10 bg-white/[0.03] text-white text-[10px] md:text-[11px] px-2 py-0.5 leading-snug">
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                    <span className={`w-4 h-4 border-2 flex items-center justify-center transition-all ${active ? '' : 'border-white/30'}`}
                      style={active ? { borderColor: LIME, backgroundColor: LIME } : {}}>
                      {active && <Check size={10} strokeWidth={3} className="text-black" />}
                    </span>
                    <span className={`text-[11px] md:text-[12px] font-bold uppercase tracking-wider ${active ? '' : 'text-white'}`}
                      style={active ? { color: LIME } : {}}>
                      {active ? 'Added' : 'Tap to add'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Default cores (Qhub AI) — full-width, always-on */}
          {CORES.filter(c => c.isDefault).map(core => (
            <div key={core.id} className="relative border-2 p-5 md:p-6 mb-4 md:mb-5 overflow-hidden"
              style={{ borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.05)' }}>

              {/* Corner label */}
              <div className="absolute top-0 right-0 px-3 py-1 text-[10px] md:text-[11px] font-black uppercase tracking-wider text-black" style={{ backgroundColor: LIME }}>
                Default · Inclusive
              </div>

              <div className="flex items-start gap-4 md:gap-5 mb-3">
                <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 border-2 flex items-center justify-center" style={{ borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.15)' }}>
                  <core.Icon size={24} strokeWidth={2} style={{ color: LIME }} />
                </div>
                <div className="flex-1 min-w-0 pt-0.5 pr-24 md:pr-28">
                  <p className="text-white text-[15px] md:text-[18px] font-black uppercase tracking-tight leading-tight mb-1">{core.title}</p>
                  <p className="text-white text-[12px] md:text-[13px] leading-snug">{core.tagline}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 md:gap-1.5">
                {core.features.map((f, i) => (
                  <span key={i} className="inline-block border border-white/15 bg-white/[0.04] text-white text-[11px] md:text-[12px] px-2.5 py-1 leading-snug">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* POS Channel picker — appears only when POS core is added */}
          {posCoreSelected && (
            <div className="border-2 p-4 md:p-5 mb-4 md:mb-5" style={{ borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.04)', animation: 'qfit-reveal 0.3s ease-out' }}>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.2em] mb-1" style={{ color: LIME }}>
                    Attached to POS & Payments
                  </p>
                  <h3 className="text-white text-[14px] md:text-[16px] font-black uppercase tracking-tight mb-1">
                    Pick your channels
                  </h3>
                  <p className="text-white text-[11px] md:text-[12px] leading-snug">
                    1 channel free per outlet ({outlets} outlet{outlets > 1 ? 's' : ''} = {freeChannelAllowance} free) · each extra unit + RM {EXTRA_CHANNEL_PRICE}/mth
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] md:text-[11px] font-mono uppercase tracking-wider text-white">Units</p>
                  <p className="font-black text-[20px] md:text-[24px] leading-none" style={{ color: LIME }}>{totalChannelUnits}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
                {CHANNELS.map(channel => {
                  const qty = channelUnits[channel.id];
                  const active = qty > 0;
                  const atMax = qty >= channel.maxUnits;
                  return (
                    <div key={channel.id} className={`border-2 p-3 md:p-4 transition-colors ${active ? '' : 'border-white/15 bg-black/20'}`}
                      style={active ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)' } : {}}>
                      <channel.Icon size={18} strokeWidth={2} className="mb-2" style={{ color: active ? LIME : 'white' }} />
                      <p className="text-white text-[12px] md:text-[13px] font-black uppercase tracking-tight mb-1">{channel.title}</p>
                      <p className="text-white text-[10px] md:text-[11px] leading-snug mb-3">{channel.description}</p>
                      <div className="flex items-center justify-between">
                        <button onClick={() => bumpChannel(channel.id, -1)}
                          disabled={qty === 0}
                          className="w-7 h-7 border-2 border-white/20 hover:border-white/60 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                          aria-label={`Decrease ${channel.title}`}>
                          <Minus size={11} strokeWidth={2.5} className="text-white" />
                        </button>
                        <span className="text-[16px] md:text-[18px] font-black font-mono" style={{ color: active ? LIME : 'white' }}>{qty}</span>
                        <button onClick={() => bumpChannel(channel.id, 1)}
                          disabled={atMax}
                          className="w-7 h-7 border-2 border-white/20 hover:border-white/60 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                          aria-label={`Increase ${channel.title}`}>
                          <Plus size={11} strokeWidth={2.5} className="text-white" />
                        </button>
                      </div>
                      {channel.maxUnits === 1 && (
                        <p className="text-white text-[9px] md:text-[10px] font-mono uppercase tracking-wider mt-2 text-center">Max 1 unit</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {totalChannelUnits === 0 ? (
                <p className="text-white text-[11px] md:text-[12px] italic mt-3">
                  Pick at least 1 channel — 1 is included per outlet.
                </p>
              ) : (
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-white text-[11px] md:text-[12px] font-mono">
                    {totalChannelUnits} unit{totalChannelUnits > 1 ? 's' : ''} · {freeChannelAllowance} free{billableChannelUnits > 0 ? ` · ${billableChannelUnits} billable × RM ${EXTRA_CHANNEL_PRICE}` : ''}
                  </span>
                  <span className="font-black text-[14px] md:text-[16px]" style={{ color: LIME }}>
                    {channelsSubtotal > 0 ? `+ RM ${channelsSubtotal}/mo` : 'Included'}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Running subtotal */}
          <div className="border-2 border-white/15 bg-white/[0.02] p-4 md:p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-white">Subtotal</p>
              <p className="text-white text-[11px] md:text-[12px] mt-0.5">
                {coresCount === 0 ? 'No cores selected yet' : `${coresCount} core${coresCount > 1 ? 's' : ''}${channelsSubtotal > 0 ? ` + ${billableChannelUnits} extra channel${billableChannelUnits > 1 ? 's' : ''}` : ''}`}
              </p>
            </div>
            <div className="text-right">
              <p className="font-black text-[22px] md:text-[28px] leading-none" style={{ color: LIME }}>
                RM {(coresSubtotal + channelsSubtotal).toLocaleString()}
              </p>
              <p className="text-white text-[10px] md:text-[11px] font-mono uppercase tracking-wider mt-1">/ mth</p>
            </div>
          </div>

          {step === 1 && coresCount > 0 && (!posCoreSelected || totalChannelUnits > 0) && (
            <ContinueButton onClick={() => advance(2)} />
          )}
          {step === 1 && coresCount === 0 && (
            <p className="text-white text-[11px] md:text-[12px] italic mt-3 text-right">Pick at least 1 core to continue.</p>
          )}
          {step === 1 && coresCount > 0 && posCoreSelected && totalChannelUnits === 0 && (
            <p className="text-white text-[11px] md:text-[12px] italic mt-3 text-right">Pick at least 1 POS channel to continue.</p>
          )}
        </StepShell>

        {/* ─── STEP 02 — Additionals ─── */}
        <StepShell num={2} title="Add additionals"
          subtitle="Optional extras priced individually. Add any — or skip entirely."
          visible={step >= 2}>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-5">
            {ADDONS.map(addon => {
              const active = selectedAddons.has(addon.id);
              return (
                <button key={addon.id} onClick={() => toggleAddon(addon.id)}
                  className={`relative border-2 p-4 md:p-5 text-left transition-colors ${active ? '' : 'border-white/15 hover:border-white/40'}`}
                  style={active ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)' } : {}}>

                  {active && (
                    <div className="absolute top-0 right-0 w-6 h-6 flex items-center justify-center" style={{ backgroundColor: LIME }}>
                      <Check size={12} strokeWidth={3} className="text-black" />
                    </div>
                  )}

                  <addon.Icon size={22} strokeWidth={2} className="mb-3" style={{ color: active ? LIME : 'white' }} />

                  <p className="text-white text-[13px] md:text-[14px] font-black uppercase tracking-tight leading-tight mb-1">{addon.title}</p>

                  <p className="font-black text-[16px] md:text-[18px] leading-none mb-0.5" style={{ color: LIME }}>
                    RM {addon.price}<span className="text-white text-[10px] font-mono ml-1">/mth{addon.priceFootnote ? '*' : ''}</span>
                  </p>
                  {addon.oneTime && (
                    <p className="text-white text-[10px] md:text-[11px] font-mono leading-snug mb-1">+ one-time dev fee</p>
                  )}
                  {addon.priceFootnote && (
                    <p className="text-white text-[9px] md:text-[10px] italic leading-snug mb-2">{addon.priceFootnote}</p>
                  )}

                  <p className="text-white text-[11px] md:text-[12px] leading-snug mb-3 mt-1">{addon.tagline}</p>

                  <ul className="space-y-0.5">
                    {addon.features.map((f, i) => (
                      <li key={i} className="text-white text-[10px] md:text-[11px] leading-snug flex items-start gap-1.5">
                        <span className="text-white flex-shrink-0 mt-0.5">·</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>

          {/* Running subtotal */}
          <div className="border-2 border-white/15 bg-white/[0.02] p-4 md:p-5 flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-white">Additionals Subtotal</p>
              <p className="text-white text-[11px] md:text-[12px] mt-0.5">
                {selectedAddons.size === 0 ? 'No add-ons yet' : `${selectedAddons.size} add-on${selectedAddons.size > 1 ? 's' : ''}`}
              </p>
            </div>
            <div className="text-right">
              <p className="font-black text-[22px] md:text-[28px] leading-none" style={{ color: LIME }}>
                RM {addonsSubtotal.toLocaleString()}
              </p>
              <p className="text-white text-[10px] md:text-[11px] font-mono uppercase tracking-wider mt-1">/ mth</p>
            </div>
          </div>

          {/* Skip option */}
          <button
            onClick={() => { setAddonsTouched(true); advance(3); }}
            className="w-full text-center py-3 border-2 border-white/10 hover:border-white/30 text-white hover:text-white text-[11px] md:text-[12px] font-bold uppercase tracking-wider transition-colors">
            {selectedAddons.size > 0 ? 'Continue with selected add-ons' : 'Skip — no additionals for now'}
          </button>

          {step === 2 && addonsTouched && selectedAddons.size > 0 && (
            <ContinueButton onClick={() => advance(3)} />
          )}
        </StepShell>

        {/* ─── STEP 03 — Outlets ─── */}
        <StepShell num={3} title="How many outlets?"
          subtitle={`Your first outlet is included. Each extra outlet is RM ${EXTRA_OUTLET_PRICE}/mth — its own hardware, staff, packages, and reports, all under one dashboard.`}
          visible={step >= 3}>
          <div className="border-2 border-white/15 p-5 md:p-7">
            <div className="flex items-center justify-between gap-5">
              <div>
                <p className="text-[11px] md:text-[13px] font-bold uppercase tracking-wider text-white mb-1">Number of outlets</p>
                <p className="text-white text-[11px] md:text-[12px]">1 outlet included · add more anytime</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => { setOutlets(v => Math.max(1, v - 1)); setOutletsTouched(true); }}
                  className="w-9 h-9 border-2 border-white/20 hover:border-white/60 flex items-center justify-center transition-colors"
                  aria-label="Decrease outlets">
                  <Minus size={14} strokeWidth={2.5} className="text-white" />
                </button>
                <span className="text-[22px] md:text-[26px] font-black font-mono w-10 text-center" style={{ color: LIME }}>{outlets}</span>
                <button onClick={() => { setOutlets(v => Math.min(20, v + 1)); setOutletsTouched(true); }}
                  className="w-9 h-9 border-2 border-white/20 hover:border-white/60 flex items-center justify-center transition-colors"
                  aria-label="Increase outlets">
                  <Plus size={14} strokeWidth={2.5} className="text-white" />
                </button>
              </div>
            </div>
            {extraOutlets > 0 && (
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-white text-[11px] md:text-[12px] font-mono">
                  {extraOutlets} extra × RM {EXTRA_OUTLET_PRICE}
                </span>
                <span className="font-black text-[14px] md:text-[16px]" style={{ color: LIME }}>
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
                className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 border-2 border-white/20 hover:border-white/50 text-white text-[11px] md:text-[12px] font-bold uppercase tracking-wider transition-colors">
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
              className={`border-2 p-5 md:p-6 text-left transition-colors ${entryMethod === 'auto-swing' ? '' : 'border-white/15 hover:border-white/40'}`}
              style={entryMethod === 'auto-swing' ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)' } : {}}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${entryMethod === 'auto-swing' ? '' : 'border-white/30'}`}
                  style={entryMethod === 'auto-swing' ? { borderColor: LIME } : {}}>
                  {entryMethod === 'auto-swing' && <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: LIME }} />}
                </div>
                <span className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.15em]" style={{ color: LIME }}>Option A</span>
              </div>
              <p className="text-white text-[14px] md:text-[16px] font-black uppercase tracking-tight mb-1.5">Auto Swing Gate</p>
              <p className="text-white text-[11px] md:text-[12px] leading-relaxed">+ Face ID. Full auto — gate swings open after a successful scan. Best for high-traffic entrances.</p>
            </button>

            <button onClick={() => { setEntryMethod('door-gate'); setEntryTouched(true); }}
              className={`border-2 p-5 md:p-6 text-left transition-colors ${entryMethod === 'door-gate' ? '' : 'border-white/15 hover:border-white/40'}`}
              style={entryMethod === 'door-gate' ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)' } : {}}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${entryMethod === 'door-gate' ? '' : 'border-white/30'}`}
                  style={entryMethod === 'door-gate' ? { borderColor: LIME } : {}}>
                  {entryMethod === 'door-gate' && <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: LIME }} />}
                </div>
                <span className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.15em]" style={{ color: LIME }}>Option B</span>
              </div>
              <p className="text-white text-[14px] md:text-[16px] font-black uppercase tracking-tight mb-1.5">Door Gate</p>
              <p className="text-white text-[11px] md:text-[12px] leading-relaxed">+ Face ID. Standard door unlocks on scan — ideal for smaller premises and back-of-house access.</p>
            </button>
          </div>

          <label className="flex items-start gap-3 p-4 md:p-5 border-2 border-white/10 hover:border-white/25 cursor-pointer transition-colors mb-3">
            <span
              className={`flex-shrink-0 mt-0.5 w-5 h-5 border-2 flex items-center justify-center transition-all ${hasExisting ? '' : 'border-white/30'}`}
              style={hasExisting ? { borderColor: LIME, backgroundColor: LIME } : {}}
            >
              {hasExisting && <Check size={12} strokeWidth={3} className="text-black" />}
            </span>
            <input type="checkbox" className="sr-only" checked={hasExisting} onChange={() => setHasExisting(v => !v)} />
            <div>
              <p className="text-white text-[12px] md:text-[13px] font-bold leading-snug">
                I already have an auto swing gate or door gate
              </p>
              <p className="text-white text-[11px] md:text-[12px] leading-relaxed mt-0.5">
                With or without Face ID — we'll see if we can integrate yours and save you hardware costs.
              </p>
            </div>
          </label>

          <button
            onClick={() => { setEntryMethod(null); setEntryTouched(true); advance(5); }}
            className="w-full text-center py-3 border-2 border-white/10 hover:border-white/30 text-white hover:text-white text-[11px] md:text-[12px] font-bold uppercase tracking-wider transition-colors">
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

          <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-white mb-3">Access Control</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">

            {/* Doorlock */}
            <div className={`border-2 p-5 transition-colors ${doorlockQty > 0 ? '' : 'border-white/15 bg-white/[0.02]'}`}
              style={doorlockQty > 0 ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)' } : {}}>
              <DoorOpen size={20} strokeWidth={2} style={{ color: LIME }} className="mb-3" />
              <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.15em] text-white mb-1">Doorlock + Face ID</p>
              <p className="text-[20px] md:text-[22px] font-black mb-1" style={{ color: LIME }}>
                RM 2,000<span className="text-[11px] md:text-[12px] text-white font-bold ml-1">/unit</span>
              </p>
              <p className="text-white text-[11px] md:text-[12px] leading-relaxed mb-4">
                Replace your existing door lock with a Face ID unit. Works standalone.
              </p>
              <div className="flex items-center justify-between">
                <button onClick={() => { setDoorlockQty(v => Math.max(0, v - 1)); setHardwareTouched(true); }}
                  className="w-8 h-8 border-2 border-white/20 hover:border-white/60 flex items-center justify-center transition-colors"
                  aria-label="Decrease doorlocks">
                  <Minus size={12} strokeWidth={2.5} className="text-white" />
                </button>
                <span className="text-[20px] md:text-[22px] font-black font-mono" style={{ color: LIME }}>{doorlockQty}</span>
                <button onClick={() => { setDoorlockQty(v => Math.min(20, v + 1)); setHardwareTouched(true); }}
                  className="w-8 h-8 border-2 border-white/20 hover:border-white/60 flex items-center justify-center transition-colors"
                  aria-label="Increase doorlocks">
                  <Plus size={12} strokeWidth={2.5} className="text-white" />
                </button>
              </div>
            </div>

            {/* Entry Gate */}
            <div className={`border-2 p-5 transition-colors ${gateLanes > 0 ? '' : 'border-white/15 bg-white/[0.02]'}`}
              style={gateLanes > 0 ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)' } : {}}>
              <Fence size={20} strokeWidth={2} style={{ color: LIME }} className="mb-3" />
              <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.15em] text-white mb-1">Entry Gate + Face ID</p>
              <p className="text-[20px] md:text-[22px] font-black mb-1" style={{ color: LIME }}>
                RM 12,000<span className="text-[11px] md:text-[12px] text-white font-bold ml-1">/lane</span>
              </p>
              <p className="text-white text-[11px] md:text-[12px] leading-relaxed mb-4">
                Turnstile-style lane with Face ID. <span className="text-white">1 in + 1 out = 2 lanes = RM 24,000.</span>
              </p>
              <div className="flex items-center justify-between">
                <button onClick={() => { setGateLanes(v => Math.max(0, v - 1)); setHardwareTouched(true); }}
                  className="w-8 h-8 border-2 border-white/20 hover:border-white/60 flex items-center justify-center transition-colors"
                  aria-label="Decrease gate lanes">
                  <Minus size={12} strokeWidth={2.5} className="text-white" />
                </button>
                <span className="text-[20px] md:text-[22px] font-black font-mono" style={{ color: LIME }}>{gateLanes}</span>
                <button onClick={() => { setGateLanes(v => Math.min(10, v + 1)); setHardwareTouched(true); }}
                  className="w-8 h-8 border-2 border-white/20 hover:border-white/60 flex items-center justify-center transition-colors"
                  aria-label="Increase gate lanes">
                  <Plus size={12} strokeWidth={2.5} className="text-white" />
                </button>
              </div>
            </div>

            {/* Sentry Camera */}
            <div className={`border-2 p-5 transition-colors ${sentryCams > 0 ? '' : 'border-white/15 bg-white/[0.02]'}`}
              style={sentryCams > 0 ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)' } : {}}>
              <Camera size={20} strokeWidth={2} style={{ color: LIME }} className="mb-3" />
              <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.15em] text-white mb-1">Sentry Camera</p>
              <p className="text-[20px] md:text-[22px] font-black mb-1" style={{ color: LIME }}>
                RM 350<span className="text-[11px] md:text-[12px] text-white font-bold ml-1">/ea</span>
              </p>
              <p className="text-white text-[11px] md:text-[12px] leading-relaxed mb-4">
                Face-scan camera for Sentry Mode coverage. <span className="text-white">Max 3 per outlet.</span>
              </p>
              <div className="flex items-center justify-between">
                <button onClick={() => { setSentryCams(v => Math.max(0, v - 1)); setHardwareTouched(true); }}
                  className="w-8 h-8 border-2 border-white/20 hover:border-white/60 flex items-center justify-center transition-colors"
                  aria-label="Decrease cameras">
                  <Minus size={12} strokeWidth={2.5} className="text-white" />
                </button>
                <span className="text-[20px] md:text-[22px] font-black font-mono" style={{ color: LIME }}>{sentryCams}</span>
                <button onClick={() => { setSentryCams(v => Math.min(3, v + 1)); setHardwareTouched(true); }}
                  className="w-8 h-8 border-2 border-white/20 hover:border-white/60 flex items-center justify-center transition-colors"
                  aria-label="Increase cameras">
                  <Plus size={12} strokeWidth={2.5} className="text-white" />
                </button>
              </div>
            </div>
          </div>

          <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-white mb-3">POS Hardware</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            {POS_HARDWARE.map(hw => {
              const qty = posHwQty[hw.id];
              const active = qty > 0;
              return (
                <div key={hw.id} className={`border-2 p-4 transition-colors ${active ? '' : 'border-white/15 bg-white/[0.02]'}`}
                  style={active ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)' } : {}}>
                  <hw.Icon size={20} strokeWidth={2} style={{ color: LIME }} className="mb-3" />
                  <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.15em] text-white mb-1">{hw.title}</p>
                  <p className="text-[17px] md:text-[20px] font-black mb-1 leading-none" style={{ color: LIME }}>
                    RM {hw.price.toLocaleString()}<span className="text-[10px] md:text-[11px] text-white font-bold ml-1">/unit</span>
                  </p>
                  <p className="text-white text-[11px] leading-snug mb-4">
                    {hw.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <button onClick={() => bumpPosHw(hw.id, -1)}
                      className="w-8 h-8 border-2 border-white/20 hover:border-white/60 flex items-center justify-center transition-colors"
                      aria-label={`Decrease ${hw.title}`}>
                      <Minus size={12} strokeWidth={2.5} className="text-white" />
                    </button>
                    <span className="text-[18px] md:text-[20px] font-black font-mono" style={{ color: LIME }}>{qty}</span>
                    <button onClick={() => bumpPosHw(hw.id, 1)}
                      className="w-8 h-8 border-2 border-white/20 hover:border-white/60 flex items-center justify-center transition-colors"
                      aria-label={`Increase ${hw.title}`}>
                      <Plus size={12} strokeWidth={2.5} className="text-white" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-2 border-white/10 p-4 md:p-5 text-[11px] md:text-[12px] leading-relaxed space-y-1 mb-3">
            <p className="text-white"><span className="text-white">*</span> All prices above include full setup.</p>
            <p className="text-white"><span className="text-white">*</span> Wiring, power plugs and internet to be provided by client.</p>
            <p className="text-white"><span style={{ color: LIME }}>**</span> 24 months 0% interest installment available with Maybank &amp; CIMB.</p>
          </div>

          <button
            onClick={() => { setDoorlockQty(0); setGateLanes(0); setSentryCams(0); setPosHwQty({ ...EMPTY_POS_HW_QTY }); advance(6); }}
            className="w-full text-center py-3 border-2 border-white/10 hover:border-white/30 text-white hover:text-white text-[11px] md:text-[12px] font-bold uppercase tracking-wider transition-colors">
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

          <div className="border-2 border-white/15 p-5 md:p-7 mb-4 md:mb-5 bg-white/[0.02]">
            <div className="flex items-start gap-4">
              <Server size={24} strokeWidth={2} style={{ color: LIME }} className="flex-shrink-0 mt-1" />
              <div className="flex-1">
                <div className="flex items-baseline justify-between mb-2">
                  <p className="text-[11px] md:text-[13px] font-black uppercase tracking-wider text-white">Private Server</p>
                  <span className="text-white text-[18px] md:text-[22px] font-black">Let's talk</span>
                </div>
                <ul className="space-y-1.5 md:space-y-2 text-[12px] md:text-[13px] text-white leading-relaxed">
                  <li className="flex gap-2"><Check size={12} strokeWidth={3} className="flex-shrink-0 mt-1" style={{ color: LIME }} /> Dedicated server — zero neighbours</li>
                  <li className="flex gap-2"><Check size={12} strokeWidth={3} className="flex-shrink-0 mt-1" style={{ color: LIME }} /> Only your team has database access, not even us</li>
                  <li className="flex gap-2"><Check size={12} strokeWidth={3} className="flex-shrink-0 mt-1" style={{ color: LIME }} /> Custom backups, audit trail, region of your choice</li>
                  <li className="flex gap-2"><Check size={12} strokeWidth={3} className="flex-shrink-0 mt-1" style={{ color: LIME }} /> Ideal for franchises, chains, or strict compliance needs</li>
                </ul>
                <p className="text-[11px] md:text-[12px] italic mt-3" style={{ color: LIME }}>
                  Priced per setup — we'll quote on WhatsApp.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setPserver(true)}
              className={`border-2 p-4 md:p-5 text-left transition-colors ${pserverOn ? '' : 'border-white/15 hover:border-white/40'}`}
              style={pserverOn ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.08)' } : {}}>
              <div className="flex items-center gap-2 mb-1">
                <Check size={16} strokeWidth={3} style={{ color: pserverOn ? LIME : 'white' }} />
                <span className="text-[12px] md:text-[14px] font-black uppercase tracking-wider" style={{ color: pserverOn ? LIME : 'white' }}>Yes, private it</span>
              </div>
              <span className="text-white text-[11px] md:text-[12px] pl-6">Quote separately</span>
            </button>
            <button onClick={() => setPserver(false)}
              className={`border-2 p-4 md:p-5 text-left transition-colors ${pserver === false ? 'border-white/60 bg-white/5' : 'border-white/15 hover:border-white/40'}`}>
              <div className="flex items-center gap-2 mb-1">
                <X size={16} strokeWidth={3} className={pserver === false ? 'text-white' : 'text-white'} />
                <span className="text-[12px] md:text-[14px] font-black uppercase tracking-wider text-white">Shared is fine</span>
              </div>
              <span className="text-white text-[11px] md:text-[12px] pl-6">Default — secure &amp; fast</span>
            </button>
          </div>
          {step === 6 && pserver !== null && (
            <ContinueButton onClick={() => advance(7)} label="Review my quote" />
          )}
        </StepShell>

        {/* ─── SUMMARY ─── */}
        {step >= 7 && (
          <section id="quote-summary" className="border-4 p-5 md:p-8 scroll-mt-20" style={{ borderColor: LIME, animation: 'qfit-reveal 0.4s ease-out' }}>
            <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.25em] mb-4 md:mb-6" style={{ color: LIME }}>
              Your Quote
            </p>

            <div className="mb-6 md:mb-8 p-4 md:p-5 border-2" style={{ borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)' }}>
              <p className="text-white text-[16px] md:text-[22px] font-black uppercase tracking-tight leading-tight text-center">
                <span style={{ color: LIME }}>Modular pricing</span> · Pay for what you use. <span style={{ color: LIME }}>Scale when ready.</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6 md:gap-10 items-start">
              <div>
                <div className="space-y-2 text-[12px] md:text-[13px] font-mono mb-5 md:mb-6">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white">Plan</span>
                    <span className="text-white font-bold">{isAnnual ? '12 months (Annual · –15%)' : '6 months'}</span>
                  </div>

                  {/* Cores breakdown */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.15em]" style={{ color: LIME }}>
                      Cores ({coresCount})
                    </span>
                    <span className="text-white font-bold">RM {coresSubtotal.toLocaleString()}/mo</span>
                  </div>
                  {coresPicked.length > 0 ? coresPicked.map((c, i) => (
                    <div key={i} className="flex justify-between text-[11px] md:text-[12px] pl-3">
                      <span className="text-white">· {c.title}{c.isDefault && <span className="italic"> (default)</span>}</span>
                      <span className="text-white">{c.isDefault ? 'Inclusive' : `RM ${c.price}`}</span>
                    </div>
                  )) : (
                    <p className="text-white italic text-[11px] pl-3">None selected</p>
                  )}

                  {/* Additionals breakdown */}
                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.15em]" style={{ color: LIME }}>
                      Additionals ({selectedAddons.size})
                    </span>
                    <span className="text-white font-bold">{addonsSubtotal > 0 ? `RM ${addonsSubtotal.toLocaleString()}/mo` : '—'}</span>
                  </div>
                  {addonsPicked.length > 0 ? addonsPicked.map((a, i) => (
                    <div key={i} className="flex justify-between text-[11px] md:text-[12px] pl-3">
                      <span className="text-white">· {a.title}{a.oneTime && <span className="text-white"> + one-time</span>}</span>
                      <span className="text-white">RM {a.price}</span>
                    </div>
                  )) : (
                    <p className="text-white italic text-[11px] pl-3">None selected</p>
                  )}

                  <div className="flex justify-between border-b border-white/10 pb-2 pt-3">
                    <span className="text-white">Outlets</span>
                    <span className="text-white font-bold">{outlets}{extraOutlets > 0 ? ` (+ RM ${outletSubtotal}/mo)` : ' (included)'}</span>
                  </div>
                  {posCoreSelected && (
                    <>
                      <div className="pt-3 flex items-center justify-between">
                        <span className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.15em]" style={{ color: LIME }}>
                          POS Channels
                        </span>
                        <span className="text-white font-bold">{channelsSubtotal > 0 ? `+ RM ${channelsSubtotal}/mo` : 'Included'}</span>
                      </div>
                      {CHANNELS.filter(c => channelUnits[c.id] > 0).map(c => (
                        <div key={c.id} className="flex justify-between text-[11px] md:text-[12px] pl-3">
                          <span className="text-white">· {c.title} × {channelUnits[c.id]}</span>
                          <span className="text-white">{channelUnits[c.id] > 0 ? '' : '—'}</span>
                        </div>
                      ))}
                      {totalChannelUnits === 0 && (
                        <p className="text-white italic text-[11px] pl-3">No channels picked</p>
                      )}
                    </>
                  )}
                  <div className="flex justify-between border-b border-white/10 pb-2 gap-4">
                    <span className="text-white flex-shrink-0">Entry</span>
                    <span className="text-white font-bold text-right">
                      {entryMethod === 'auto-swing' ? 'Auto Swing + Face ID' : entryMethod === 'door-gate' ? 'Door Gate + Face ID' : '—'}
                      {hasExisting && <span className="text-white font-normal"> · existing</span>}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white">Private Server</span>
                    <span className="text-white font-bold">{pserverOn ? 'Quote sep.' : '—'}</span>
                  </div>

                  {hasHardware && (
                    <>
                      <div className="pt-3 flex items-center justify-between">
                        <span className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.15em]" style={{ color: LIME }}>Hardware (one-time)</span>
                        <span className="text-white font-black">RM {hardwareSubtotal.toLocaleString()}</span>
                      </div>
                      {doorlockQty > 0 && (
                        <div className="flex justify-between text-[11px] md:text-[12px] pl-3">
                          <span className="text-white">· Doorlock × {doorlockQty}</span>
                          <span className="text-white">RM {doorlockCost.toLocaleString()}</span>
                        </div>
                      )}
                      {gateLanes > 0 && (
                        <div className="flex justify-between text-[11px] md:text-[12px] pl-3">
                          <span className="text-white">· Entry Gate × {gateLanes} lane{gateLanes > 1 ? 's' : ''}</span>
                          <span className="text-white">RM {gateCost.toLocaleString()}</span>
                        </div>
                      )}
                      {sentryCams > 0 && (
                        <div className="flex justify-between text-[11px] md:text-[12px] pl-3">
                          <span className="text-white">· Sentry Camera × {sentryCams}</span>
                          <span className="text-white">RM {camCost.toLocaleString()}</span>
                        </div>
                      )}
                      {POS_HARDWARE.filter(hw => posHwQty[hw.id] > 0).map(hw => {
                        const qty = posHwQty[hw.id];
                        return (
                          <div key={hw.id} className="flex justify-between text-[11px] md:text-[12px] pl-3">
                            <span className="text-white">· {hw.title} × {qty}</span>
                            <span className="text-white">RM {(hw.price * qty).toLocaleString()}</span>
                          </div>
                        );
                      })}
                      <p className="text-[10px] text-white italic pt-1">
                        24 mo 0% instalment available (Maybank / CIMB)
                      </p>
                    </>
                  )}

                  <div className="pt-3 flex items-center justify-between border-t-2 border-white/15">
                    <span className="text-white">One-time setup fee</span>
                    <span className="text-white font-bold">RM {SETUP_FEE.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 md:space-y-5">
                <div className="border-2 border-white/15 bg-white/[0.02] p-5 md:p-6">
                  <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-white mb-2 text-center">Plan</p>
                  <div className="flex justify-center mb-5">
                    <div className="inline-flex items-stretch border-2" style={{ borderColor: LIME }}>
                      <button onClick={() => setTerm(6)}
                        className={`px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-colors ${term === 6 ? 'text-black' : 'text-white hover:text-white'}`}
                        style={term === 6 ? { backgroundColor: LIME } : {}}>
                        6 Months
                      </button>
                      <button onClick={() => setTerm(12)}
                        className={`px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-colors flex items-center gap-1.5 ${term === 12 ? 'text-black' : 'text-white hover:text-white'}`}
                        style={term === 12 ? { backgroundColor: LIME } : {}}>
                        12 Months
                        <span className="text-[8px] md:text-[9px] font-mono" style={term === 12 ? { color: 'rgba(0,0,0,0.6)' } : { color: LIME }}>
                          –15%
                        </span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-white mb-3 text-center">
                    {isAnnual ? 'Effective monthly' : 'Estimated monthly'}
                  </p>
                  <div className="text-center">
                    <div className="flex items-baseline justify-center gap-2">
                      {isAnnual && monthlyPreDiscount > 0 && (
                        <span className="text-white line-through text-[18px] md:text-[22px] font-black">
                          RM {monthlyPreDiscount.toLocaleString()}
                        </span>
                      )}
                      <div className="flex items-baseline">
                        <span className="text-white text-[20px] md:text-[24px] font-black align-top mr-1.5">RM</span>
                        <span className="font-black leading-none tracking-tighter text-[48px] md:text-[64px]" style={{ color: LIME }}>{effectiveMonthly.toLocaleString()}</span>
                        <span className="text-white text-[14px] md:text-[16px] font-bold ml-1.5">/mo</span>
                      </div>
                    </div>

                    {isAnnual && monthlyPreDiscount > 0 && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-wider mb-1" style={{ color: LIME }}>
                          − 15% · save RM {annualSavings.toLocaleString()}/year
                        </p>
                        <p className="text-white text-[11px] md:text-[12px]">
                          Annual total:{' '}
                          <span className="text-white line-through mr-1">RM {(monthlyPreDiscount * 12).toLocaleString()}</span>
                          <span className="text-white font-bold">RM {annualUpfront.toLocaleString()}</span>
                        </p>
                        <p className="text-white text-[10px] md:text-[11px] mt-1">Billed upfront — locks the rate for 12 months.</p>
                      </div>
                    )}

                    {pserverOn && (
                      <p className="text-white text-[10px] md:text-[11px] leading-relaxed mt-3 pt-3 border-t border-white/10">
                        + <span style={{ color: LIME }}>Private Server</span> quoted separately on WhatsApp.
                      </p>
                    )}

                    {monthlyPreDiscount === 0 && (
                      <p className="text-white text-[11px] md:text-[12px] mt-4">
                        Pick at least 1 core to see pricing.
                      </p>
                    )}
                  </div>
                </div>

                {hasHardware && (
                  <div className="border-2 border-white/15 bg-white/[0.02] p-5 md:p-6">
                    <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-white mb-3 text-center">One-time Payment (Hardware)</p>

                    <div className="space-y-1.5 text-[11px] md:text-[12px] font-mono">
                      <div className="flex justify-between">
                        <span className="text-white">Hardware</span>
                        <span className="text-white font-bold">RM {hardwareSubtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white">Delivery</span>
                        <span className="text-white font-bold">RM {deliveryFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-white/10">
                        <span className="text-white font-bold">Total</span>
                        <span className="font-black" style={{ color: LIME }}>RM {hardwareGrandTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 md:mt-8 pt-5 md:pt-6 border-t-2 border-white/10 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
              <p className="text-white text-[11px] md:text-[12px] leading-relaxed max-w-md">
                Generate a printable quotation with full breakdown — review, fill in your details, and print or send to our WhatsApp.
              </p>
              <button onClick={openQuote}
                disabled={monthlyPreDiscount === 0}
                className={`inline-flex items-center gap-2 px-6 md:px-8 py-3.5 md:py-4 text-black text-[12px] md:text-[14px] font-black uppercase tracking-wider transition-colors whitespace-nowrap ${monthlyPreDiscount === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white'}`}
                style={{ backgroundColor: LIME }}>
                <FileText size={16} strokeWidth={2.5} />
                Generate Quotation
                <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          </section>
        )}

        {/* ─── Pricing FAQ ─── */}
        {step >= 7 && (
        <section className="mt-14 md:mt-20" style={{ animation: 'qfit-reveal 0.4s ease-out' }}>
          <div className="flex items-center gap-3 mb-5 md:mb-6">
            <span className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center border-2 text-[11px] md:text-[12px] font-mono font-black" style={{ borderColor: LIME, color: LIME }}>
              FAQ
            </span>
            <h2 className="text-[15px] md:text-[20px] font-black uppercase tracking-tight text-white">Pricing questions, answered</h2>
          </div>

          <div className="border-t-2 border-white/15 md:pl-11">
            {PRICING_FAQS.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div key={i} className="border-b-2 border-white/15">
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 py-4 md:py-5 text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="text-white text-[12px] md:text-[14px] font-bold uppercase tracking-tight pr-4">{faq.q}</span>
                    <Plus
                      size={18}
                      strokeWidth={2.5}
                      className="flex-shrink-0 transition-transform"
                      style={{ color: LIME, transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
                    />
                  </button>
                  {open && (
                    <p className="text-white text-[12px] md:text-[14px] leading-relaxed pb-5 md:pb-6 pr-8" style={{ animation: 'qfit-reveal 0.25s ease-out' }}>
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
              We win <span style={{ color: LIME }}>only</span> when<br className="hidden sm:block" /> <span style={{ color: LIME }}>you</span> win.
            </h2>
          </section>
        )}

        <p className="text-white text-[10px] md:text-[11px] text-center mt-10 md:mt-14">
          Private page — not publicly linked. Reach out only if you were invited here.
        </p>
      </main>

      {/* ─── Quotation Modal ─── */}
      {quoteOpen && (
        <div className="qs-quote-modal fixed inset-0 z-[100] overflow-y-auto" role="dialog" aria-modal="true">
          <style>{`
            @media print {
              body > *:not(.qs-quote-modal) { display: none !important; }
              .qs-quote-modal { position: static !important; overflow: visible !important; background: white !important; }
              .qs-quote-modal .qs-print-hide { display: none !important; }
              .qs-quote-modal .qs-print-sheet { box-shadow: none !important; max-width: 100% !important; margin: 0 !important; padding: 24px !important; }
              @page { margin: 12mm; }
            }
          `}</style>

          {/* Backdrop (review/form) */}
          {quoteStage !== 'print' && (
            <div className="qs-print-hide fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={closeQuote} />
          )}

          {/* ─── REVIEW STAGE ─── */}
          {quoteStage === 'review' && (
            <div className="relative min-h-full flex items-start md:items-center justify-center p-3 md:p-6">
              <div className="qs-print-hide relative w-full max-w-2xl bg-black border-2 my-4" style={{ borderColor: LIME }}>
                <div className="flex items-center justify-between p-4 md:p-5 border-b-2 border-white/10">
                  <div>
                    <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.2em]" style={{ color: LIME }}>Quotation · Step 1 of 3</p>
                    <h2 className="text-white text-[16px] md:text-[20px] font-black uppercase tracking-tight mt-1">Review your numbers</h2>
                  </div>
                  <button onClick={closeQuote} className="w-8 h-8 flex items-center justify-center border-2 border-white/15 hover:border-white/40 transition-colors">
                    <X size={14} strokeWidth={2.5} className="text-white" />
                  </button>
                </div>

                <div className="p-4 md:p-6 space-y-4 text-[12px] md:text-[13px] font-mono">
                  {/* Configuration — what was selected */}
                  <div className="border-2 border-white/10 p-4">
                    <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-white mb-3">Configuration</p>
                    <div className="space-y-3 text-[11px] md:text-[12px]">
                      {/* Cores */}
                      <div>
                        <p className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-[0.15em] mb-1" style={{ color: LIME }}>Cores</p>
                        <ul className="space-y-0.5">
                          {coresPicked.length === 0 ? (
                            <li className="text-white">None selected</li>
                          ) : coresPicked.map(c => (
                            <li key={c.id} className="flex justify-between gap-2">
                              <span className="text-white">· {c.title}{c.isDefault ? ' (inclusive)' : ''}</span>
                              <span className="text-white font-bold whitespace-nowrap">{c.isDefault ? 'Included' : `RM ${c.price}/mo`}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Additionals */}
                      {addonsPicked.length > 0 && (
                        <div>
                          <p className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-[0.15em] mb-1" style={{ color: LIME }}>Additionals</p>
                          <ul className="space-y-0.5">
                            {addonsPicked.map(a => (
                              <li key={a.id} className="flex justify-between gap-2">
                                <span className="text-white">· {a.title}{a.oneTime ? ' (+ one-time dev fee, quoted sep.)' : ''}</span>
                                <span className="text-white font-bold whitespace-nowrap">RM {a.price}/mo</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Outlets */}
                      <div className="flex justify-between gap-2">
                        <span className="text-white"><span style={{ color: LIME }}>Outlets:</span> {outlets}</span>
                        <span className="text-white font-bold whitespace-nowrap">{extraOutlets > 0 ? `+ RM ${outletSubtotal}/mo` : 'Included'}</span>
                      </div>

                      {/* POS Channels */}
                      {posCoreSelected && (
                        <div>
                          <p className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-[0.15em] mb-1" style={{ color: LIME }}>POS channels</p>
                          <ul className="space-y-0.5">
                            {CHANNELS.filter(c => channelUnits[c.id] > 0).length === 0 ? (
                              <li className="text-white">None selected</li>
                            ) : CHANNELS.filter(c => channelUnits[c.id] > 0).map(c => (
                              <li key={c.id} className="flex justify-between gap-2">
                                <span className="text-white">· {c.title} × {channelUnits[c.id]}</span>
                              </li>
                            ))}
                            <li className="text-white/60 italic">
                              {billableChannelUnits > 0
                                ? `${freeChannelAllowance} free (1/outlet) · ${billableChannelUnits} billable × RM ${EXTRA_CHANNEL_PRICE}/mo = RM ${channelsSubtotal}/mo`
                                : `${freeChannelAllowance} included (1/outlet)`}
                            </li>
                          </ul>
                        </div>
                      )}

                      {/* Entry method */}
                      <div className="flex justify-between gap-2">
                        <span className="text-white"><span style={{ color: LIME }}>Entry method:</span></span>
                        <span className="text-white font-bold text-right">{entryLabel}{hasExisting ? ' · existing' : ''}</span>
                      </div>

                      {/* Private server */}
                      {pserverOn && (
                        <div className="flex justify-between gap-2">
                          <span className="text-white"><span style={{ color: LIME }}>Private Server:</span></span>
                          <span className="text-white font-bold">Quoted separately</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Monthly */}
                  <div className="border-2 border-white/10 p-4">
                    <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-white mb-2">Monthly subscription</p>
                    <div className="flex items-baseline justify-between gap-3 mb-2">
                      <div className="text-white">
                        <span className="font-black text-[18px] md:text-[20px]" style={{ color: LIME }}>RM {effectiveMonthly.toLocaleString()}</span>
                        <span className="text-white"> × {termMonths} months</span>
                      </div>
                      <span className="text-white text-[11px] italic">+ 8% SST</span>
                    </div>
                    <div className="space-y-1 text-[11px] md:text-[12px] pt-2 border-t border-white/10">
                      <div className="flex justify-between"><span className="text-white">Effective monthly × {termMonths} mo</span><span className="text-white">RM {(effectiveMonthly * termMonths).toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-white">SST 8% × {termMonths} mo</span><span className="text-white">RM {(monthlySst * termMonths).toLocaleString()}</span></div>
                      <div className="flex justify-between font-bold pt-1 border-t border-white/10"><span className="text-white">Subscription total ({termMonths} mo, incl. SST)</span><span style={{ color: LIME }}>RM {subscriptionTotal.toLocaleString()}</span></div>
                    </div>
                    {isAnnual && <p className="text-[10px] text-white italic mt-2">12-month plan — 15% Annual discount applied (saved RM {annualSavings.toLocaleString()}/year).</p>}
                  </div>

                  {/* One-time Hardware — itemized */}
                  {hasHardware && (
                    <div className="border-2 border-white/10 p-4">
                      <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-white mb-2">One-time payment (Hardware)</p>
                      <div className="space-y-1 text-[11px] md:text-[12px]">
                        {doorlockQty > 0 && (
                          <div className="flex justify-between"><span className="text-white">Doorlock × {doorlockQty}</span><span className="text-white">RM {doorlockCost.toLocaleString()}</span></div>
                        )}
                        {gateLanes > 0 && (
                          <div className="flex justify-between"><span className="text-white">Entry Gate × {gateLanes} lane{gateLanes > 1 ? 's' : ''}</span><span className="text-white">RM {gateCost.toLocaleString()}</span></div>
                        )}
                        {sentryCams > 0 && (
                          <div className="flex justify-between"><span className="text-white">Sentry Camera × {sentryCams}</span><span className="text-white">RM {camCost.toLocaleString()}</span></div>
                        )}
                        {POS_HARDWARE.filter(hw => posHwQty[hw.id] > 0).map(hw => (
                          <div key={hw.id} className="flex justify-between"><span className="text-white">{hw.title} × {posHwQty[hw.id]}</span><span className="text-white">RM {(hw.price * posHwQty[hw.id]).toLocaleString()}</span></div>
                        ))}
                        <div className="flex justify-between pt-1 border-t border-white/10"><span className="text-white">Hardware subtotal <span className="text-white/60 italic">(0% SST)</span></span><span className="text-white font-bold">RM {hardwareSubtotal.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="text-white">Delivery</span><span className="text-white">RM {deliveryFee.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="text-white">SST 8% on delivery</span><span className="text-white">RM {deliverySst.toLocaleString()}</span></div>
                        <div className="flex justify-between font-bold pt-1 border-t border-white/10"><span className="text-white">Hardware + delivery total</span><span style={{ color: LIME }}>RM {hardwareGrandTotal.toLocaleString()}</span></div>
                      </div>
                    </div>
                  )}

                  {/* One-time Setup */}
                  <div className="border-2 border-white/10 p-4">
                    <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-white mb-2">One-time setup fees</p>
                    <div className="space-y-1 text-[11px] md:text-[12px]">
                      <div className="flex justify-between"><span className="text-white">Onboarding · training · data import · config</span><span className="text-white">RM {SETUP_FEE.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-white">SST 8% on services</span><span className="text-white">RM {setupSst.toLocaleString()}</span></div>
                      <div className="flex justify-between font-bold pt-1 border-t border-white/10"><span className="text-white">Setup total</span><span style={{ color: LIME }}>RM {setupWithSst.toLocaleString()}</span></div>
                    </div>
                  </div>

                  {/* Grand Total */}
                  <div className="border-2 p-4 md:p-5" style={{ borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)' }}>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-white">Grand total</p>
                      <p
                        className={`font-black text-[22px] md:text-[28px] ${isInstallment ? 'line-through opacity-60' : ''}`}
                        style={{ color: LIME }}
                      >
                        RM {grandTotal.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-[10px] md:text-[11px] text-white italic mt-1">Subscription ({termMonths}mo incl. SST) + Hardware (0% SST) + Delivery & Setup (8% SST)</p>
                    {isInstallment && (
                      <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between">
                        <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-white">Per month</p>
                        <p className="font-black text-[22px] md:text-[28px]" style={{ color: LIME }}>
                          RM {installPlanMonthly.toLocaleString()}<span className="text-white text-[12px] md:text-[14px] font-bold"> /mo × {installPlan} months</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Plan term — modal-side toggle, drives grand total */}
                  <div className="border-2 border-white/10 p-4">
                    <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-white mb-2">Plan term</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => selectModalTerm(6)}
                        className={`py-2 px-3 text-[11px] md:text-[12px] font-black uppercase tracking-wider border-2 transition-colors ${term === 6 ? 'text-black' : 'border-white/15 text-white hover:border-white/40'}`}
                        style={term === 6 ? { borderColor: LIME, backgroundColor: LIME } : {}}>
                        6 Months
                      </button>
                      <button onClick={() => selectModalTerm(12)}
                        className={`py-2 px-3 text-[11px] md:text-[12px] font-black uppercase tracking-wider border-2 transition-colors flex items-center justify-center gap-1.5 ${term === 12 ? 'text-black' : 'border-white/15 text-white hover:border-white/40'}`}
                        style={term === 12 ? { borderColor: LIME, backgroundColor: LIME } : {}}>
                        12 Months
                        <span className="text-[9px] md:text-[10px] font-mono" style={term === 12 ? { color: 'rgba(0,0,0,0.6)' } : { color: LIME }}>
                          –15%
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Payment Plan */}
                  <div className="border-2 border-white/10 p-4">
                    <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-white mb-2">Payment plan</p>
                    <div className="grid grid-cols-1 gap-2">
                      {([
                        { key: 0 as const, label: 'Full', disabled: false, hint: null },
                        { key: 6 as const, label: 'ZIPP 6 mo · 0% Interest', disabled: false, hint: null },
                        { key: 12 as const, label: 'ZIPP 12 mo · 0% Interest', disabled: term !== 12, hint: term !== 12 ? 'Requires 12-month plan term' : null },
                      ]).map(opt => {
                        const active = installPlan === opt.key;
                        return (
                          <button key={opt.key}
                            onClick={() => !opt.disabled && selectInstallPlan(opt.key)}
                            disabled={opt.disabled}
                            className={`py-2.5 px-3 text-[11px] md:text-[12px] font-black uppercase tracking-wider border-2 transition-colors ${active ? 'text-black' : 'border-white/15 text-white hover:border-white/40'} ${opt.disabled ? 'opacity-40 cursor-not-allowed hover:border-white/15' : ''}`}
                            style={active ? { borderColor: LIME, backgroundColor: LIME } : {}}>
                            {opt.label}
                            {opt.hint && (
                              <span className="block text-[9px] md:text-[10px] font-mono font-normal normal-case tracking-normal mt-0.5 opacity-80">
                                {opt.hint}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bank picker (only when an installment is selected) */}
                  {isInstallment && (
                    <div className="border-2 p-3 md:p-4" style={{ borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.1)' }}>
                      <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-white mb-2">Select credit card</p>
                      <div className="grid grid-cols-3 gap-2">
                        {BANKS.map(bank => {
                          const active = selectedBank === bank.id;
                          return (
                            <button key={bank.id}
                              onClick={() => setSelectedBank(bank.id)}
                              className={`py-2 px-2 text-[10px] md:text-[11px] font-black uppercase tracking-wider border-2 transition-colors ${active ? 'text-black' : 'border-white/30 text-white hover:border-white/60'}`}
                              style={active ? { borderColor: LIME, backgroundColor: LIME } : {}}>
                              {bank.label}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[10px] md:text-[11px] text-white italic mt-3">
                        Exclusively available with Maybank, CIMB or Public Bank Credit Card Holders only.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 p-4 md:p-5 border-t-2 border-white/10">
                  <button onClick={closeQuote} className="text-white text-[11px] md:text-[12px] font-bold uppercase tracking-wider hover:text-white/70 transition-colors">
                    Cancel
                  </button>
                  <button onClick={() => setQuoteStage('form')}
                    className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 text-black text-[11px] md:text-[12px] font-black uppercase tracking-wider transition-colors hover:bg-white"
                    style={{ backgroundColor: LIME }}>
                    Continue <ArrowRight size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── FORM STAGE ─── */}
          {quoteStage === 'form' && (
            <div className="relative min-h-full flex items-start md:items-center justify-center p-3 md:p-6">
              <div className="qs-print-hide relative w-full max-w-xl bg-black border-2 my-4" style={{ borderColor: LIME }}>
                <div className="flex items-center justify-between p-4 md:p-5 border-b-2 border-white/10">
                  <div>
                    <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.2em]" style={{ color: LIME }}>Quotation · Step 2 of 3</p>
                    <h2 className="text-white text-[16px] md:text-[20px] font-black uppercase tracking-tight mt-1">Your details</h2>
                  </div>
                  <button onClick={closeQuote} className="w-8 h-8 flex items-center justify-center border-2 border-white/15 hover:border-white/40 transition-colors">
                    <X size={14} strokeWidth={2.5} className="text-white" />
                  </button>
                </div>

                <div className="p-4 md:p-6 space-y-4">
                  {[
                    { label: 'Company Name', value: companyName, setter: setCompanyName, placeholder: 'e.g. Stride Studio Sdn Bhd', type: 'text' },
                    { label: 'Shipping Location', value: shippingLocation, setter: setShippingLocation, placeholder: 'Full address — for hardware delivery', type: 'text' },
                    { label: 'PIC Name', value: picName, setter: setPicName, placeholder: 'Person in charge', type: 'text' },
                    { label: 'PIC Mobile', value: picMobile, setter: setPicMobile, placeholder: '+60 12-345 6789', type: 'tel' },
                  ].map((f, i) => (
                    <div key={i}>
                      <label className="block text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-white mb-1.5">{f.label}</label>
                      <input
                        type={f.type}
                        value={f.value}
                        onChange={(e) => f.setter(e.target.value)}
                        placeholder={f.placeholder}
                        className="w-full bg-black border-2 border-white/15 focus:border-white/60 outline-none px-3 py-2.5 text-white text-[13px] md:text-[14px] font-mono transition-colors placeholder:text-white/30"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-3 p-4 md:p-5 border-t-2 border-white/10">
                  <button onClick={() => setQuoteStage('review')}
                    className="inline-flex items-center gap-2 text-white text-[11px] md:text-[12px] font-bold uppercase tracking-wider hover:text-white/70 transition-colors">
                    <ArrowLeft size={14} strokeWidth={2.5} /> Back
                  </button>
                  <button onClick={() => setQuoteStage('print')}
                    disabled={!companyName.trim() || !shippingLocation.trim() || !picName.trim() || !picMobile.trim()}
                    className={`inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 text-black text-[11px] md:text-[12px] font-black uppercase tracking-wider transition-colors ${(!companyName.trim() || !shippingLocation.trim() || !picName.trim() || !picMobile.trim()) ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white'}`}
                    style={{ backgroundColor: LIME }}>
                    Confirm & Generate <ArrowRight size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── PRINT STAGE ─── */}
          {quoteStage === 'print' && (
            <div className="min-h-full bg-neutral-200 py-6 md:py-10">
              {/* Toolbar (hidden on print) */}
              <div className="qs-print-hide max-w-3xl mx-auto px-4 mb-4 flex items-center justify-between gap-3">
                <button onClick={() => setQuoteStage('form')}
                  className="inline-flex items-center gap-2 text-black text-[11px] md:text-[12px] font-bold uppercase tracking-wider bg-white border-2 border-black px-3 py-2 hover:bg-neutral-100 transition-colors">
                  <ArrowLeft size={14} strokeWidth={2.5} /> Back
                </button>
                <div className="flex items-center gap-2">
                  <a href={waLink} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 md:px-4 py-2 text-white text-[11px] md:text-[12px] font-black uppercase tracking-wider bg-[#25D366] hover:opacity-90 transition-opacity">
                    <MessageCircle size={14} strokeWidth={2.5} /> WhatsApp
                  </a>
                  <button onClick={() => window.print()}
                    className="inline-flex items-center gap-2 px-4 md:px-5 py-2 text-black text-[11px] md:text-[12px] font-black uppercase tracking-wider hover:bg-white transition-colors"
                    style={{ backgroundColor: LIME, border: '2px solid black' }}>
                    <Printer size={14} strokeWidth={2.5} /> Print / Save PDF
                  </button>
                  <button onClick={closeQuote}
                    className="w-9 h-9 flex items-center justify-center border-2 border-black bg-white hover:bg-neutral-100 transition-colors">
                    <X size={14} strokeWidth={2.5} className="text-black" />
                  </button>
                </div>
              </div>

              {/* Printable sheet */}
              <div className="qs-print-sheet max-w-3xl mx-auto bg-white text-black p-6 md:p-10 shadow-2xl" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
                <div className="flex items-start justify-between border-b-4 border-black pb-4 mb-6">
                  <div>
                    <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-black/60">Quotation</p>
                    <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black mt-1">QStudio</h1>
                    <p className="text-[11px] text-black/70 mt-1">Modular fitness & wellness platform</p>
                  </div>
                  <div className="text-right text-[11px] font-mono">
                    <p className="text-black/60 uppercase tracking-wider">Quote Ref</p>
                    <p className="text-black font-bold">{quoteRef}</p>
                    <p className="text-black/60 uppercase tracking-wider mt-2">Date</p>
                    <p className="text-black font-bold">{new Date().toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 text-[12px]">
                  <div>
                    <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-black/60 mb-1">Bill To</p>
                    <p className="font-bold text-black">{companyName}</p>
                    <p className="text-black/80 whitespace-pre-line">{shippingLocation}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-black/60 mb-1">Person In Charge</p>
                    <p className="font-bold text-black">{picName}</p>
                    <p className="text-black/80">{picMobile}</p>
                  </div>
                </div>

                {/* Plan summary */}
                <div className="mb-5">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-black/60 mb-1">Plan Term</p>
                  <p className="text-[14px] font-bold text-black">{isAnnual ? '12 months (Annual · 15% off)' : '6 months (standard rate)'}</p>
                </div>

                {/* Line items */}
                <table className="w-full text-[12px] border-collapse mb-6">
                  <thead>
                    <tr className="border-b-2 border-black">
                      <th className="text-left py-2 font-mono uppercase text-[10px] tracking-wider">Item</th>
                      <th className="text-right py-2 font-mono uppercase text-[10px] tracking-wider w-32">Amount (RM)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coresPicked.filter(c => !c.isDefault).map((c, i) => (
                      <tr key={'c' + i} className="border-b border-black/10">
                        <td className="py-1.5 text-black">Core · {c.title}</td>
                        <td className="py-1.5 text-right text-black">{c.price.toLocaleString()}/mo</td>
                      </tr>
                    ))}
                    {addonsPicked.map((a, i) => (
                      <tr key={'a' + i} className="border-b border-black/10">
                        <td className="py-1.5 text-black">Add-on · {a.title}{a.oneTime ? ' (one-time)' : ''}</td>
                        <td className="py-1.5 text-right text-black">{a.price.toLocaleString()}/mo</td>
                      </tr>
                    ))}
                    {extraOutlets > 0 && (
                      <tr className="border-b border-black/10">
                        <td className="py-1.5 text-black">Extra outlets × {extraOutlets}</td>
                        <td className="py-1.5 text-right text-black">{outletSubtotal.toLocaleString()}/mo</td>
                      </tr>
                    )}
                    {posCoreSelected && billableChannelUnits > 0 && (
                      <tr className="border-b border-black/10">
                        <td className="py-1.5 text-black">POS channels × {billableChannelUnits} (billable)</td>
                        <td className="py-1.5 text-right text-black">{channelsSubtotal.toLocaleString()}/mo</td>
                      </tr>
                    )}
                    {isAnnual && annualDiscountAmount > 0 && (
                      <tr className="border-b border-black/10">
                        <td className="py-1.5 text-black italic">Annual discount (–15%)</td>
                        <td className="py-1.5 text-right text-black italic">−{annualDiscountAmount.toLocaleString()}/mo</td>
                      </tr>
                    )}
                    <tr className="border-b-2 border-black">
                      <td className="py-2 font-bold text-black">Effective monthly</td>
                      <td className="py-2 text-right font-bold text-black">{effectiveMonthly.toLocaleString()}/mo</td>
                    </tr>
                    <tr className="border-b border-black/10">
                      <td className="py-1.5 text-black">Subscription · {effectiveMonthly.toLocaleString()} × {termMonths} mo</td>
                      <td className="py-1.5 text-right text-black">{(effectiveMonthly * termMonths).toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-black/10">
                      <td className="py-1.5 text-black">SST 8% × {termMonths} mo</td>
                      <td className="py-1.5 text-right text-black">{(monthlySst * termMonths).toLocaleString()}</td>
                    </tr>
                    <tr className="border-b-2 border-black">
                      <td className="py-2 font-bold text-black">Subscription total ({termMonths} mo incl. SST)</td>
                      <td className="py-2 text-right font-bold text-black">{subscriptionTotal.toLocaleString()}</td>
                    </tr>

                    {hasHardware && (
                      <>
                        {doorlockQty > 0 && <tr className="border-b border-black/10"><td className="py-1.5 text-black">Doorlock × {doorlockQty}</td><td className="py-1.5 text-right text-black">{doorlockCost.toLocaleString()}</td></tr>}
                        {gateLanes > 0 && <tr className="border-b border-black/10"><td className="py-1.5 text-black">Entry Gate × {gateLanes} lane{gateLanes > 1 ? 's' : ''}</td><td className="py-1.5 text-right text-black">{gateCost.toLocaleString()}</td></tr>}
                        {sentryCams > 0 && <tr className="border-b border-black/10"><td className="py-1.5 text-black">Sentry Camera × {sentryCams}</td><td className="py-1.5 text-right text-black">{camCost.toLocaleString()}</td></tr>}
                        {POS_HARDWARE.filter(hw => posHwQty[hw.id] > 0).map(hw => (
                          <tr key={hw.id} className="border-b border-black/10">
                            <td className="py-1.5 text-black">{hw.title} × {posHwQty[hw.id]}</td>
                            <td className="py-1.5 text-right text-black">{(hw.price * posHwQty[hw.id]).toLocaleString()}</td>
                          </tr>
                        ))}
                        <tr className="border-b border-black/10">
                          <td className="py-1.5 text-black">Delivery</td>
                          <td className="py-1.5 text-right text-black">{deliveryFee.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-black/10">
                          <td className="py-1.5 text-black">SST 8% on delivery</td>
                          <td className="py-1.5 text-right text-black">{deliverySst.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b-2 border-black">
                          <td className="py-2 font-bold text-black">One-time hardware + delivery total <span className="font-normal italic text-black/60">(hardware 0% SST)</span></td>
                          <td className="py-2 text-right font-bold text-black">{hardwareGrandTotal.toLocaleString()}</td>
                        </tr>
                      </>
                    )}

                    <tr className="border-b border-black/10">
                      <td className="py-1.5 text-black">One-time setup fees</td>
                      <td className="py-1.5 text-right text-black">{SETUP_FEE.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-black/10">
                      <td className="py-1.5 text-black">SST 8% on services</td>
                      <td className="py-1.5 text-right text-black">{setupSst.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b-2 border-black">
                      <td className="py-2 font-bold text-black">Setup total (incl. SST)</td>
                      <td className="py-2 text-right font-bold text-black">{setupWithSst.toLocaleString()}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="pt-3 text-[14px] font-black uppercase tracking-tight text-black">Grand Total</td>
                      <td className="pt-3 text-right text-[18px] font-black text-black">RM {grandTotal.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>

                {/* Payment plan */}
                <div className="border-2 border-black p-4 mb-6">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-black/60 mb-2">Payment Plan</p>
                  {isInstallment ? (
                    <>
                      <p className="text-[13px] font-bold text-black">ZIPP {installPlan} Months — 0% Interest</p>
                      <p className="text-[12px] text-black/80 mt-1">Grand total split: RM {installPlanMonthly.toLocaleString()}/mo × {installPlan}.</p>
                      {selectedBank ? (
                        <p className="text-[12px] text-black mt-2 p-2 border-2 border-black/80 font-bold">Card: {bankLabel(selectedBank)} Credit Card.</p>
                      ) : (
                        <p className="text-[12px] text-black mt-2 p-2 border-2 border-black/80 font-bold">Exclusively available with Maybank, CIMB or Public Bank Credit Card Holders only.</p>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-[13px] font-bold text-black">Full Payment</p>
                      <p className="text-[12px] text-black/80 mt-1">Single payment on confirmation — covers subscription, hardware, and setup.</p>
                    </>
                  )}
                </div>

                <div className="text-[10px] text-black/60 leading-relaxed border-t border-black/20 pt-3">
                  <p><strong>Notes:</strong> Prices in MYR. SST at 8% applied to subscription, delivery and setup (services). Hardware is taxed at 0% SST and is one-time / non-refundable once delivered. Setup fee covers onboarding, training, data import, outlet configuration. Quote valid for 14 days from issue date.</p>
                  <p className="mt-2">Issued by QStudio · qbot.now/qstudio · Quote ref {quoteRef}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
