import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight, Check, CheckCircle2, ChevronDown, ChevronUp, Gift, HelpCircle, Lock, Minus, Pencil, Plus, Save, Shield, Sparkles, Star, Tag, Trash2, Users, MessageCircle, FileText, X as XIcon, Calculator,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import QuoteStudioTimeline from '../components/QuoteStudioTimeline';
import { supabase } from '../lib/supabase';
import { computeQuoteMoney, discountSummaryLabel, migrateLegacyDiscount, SST_RATE, type DiscountInput } from '../lib/sstMath';
import { QUOTE_BUILDER_VERSION } from '../lib/quoteBuilderVersion';
import {
  ENTRY_GATES, POS_ITEMS, OTHER_HARDWARE, QUOTE_SOFTWARE_TIERS, CATALOG_VERSION, FEATURE_GROUPS, SETUP_AND_TRAINING, PAYMENT_GATEWAY_REGISTRATION, DELIVERY_ZONES,
  ADDITIONAL_OUTLET_ITEMS, findAdditionalOutletItem,
  type StudioCatalogItem, type StudioSst, type StudioItemType, type CellValue,
  type StudioCustomPackage, type StudioPackageCadence, CUSTOM_PACKAGE_ID, emptyCustomPackage,
  type StudioItemCategory, STUDIO_ITEM_CATEGORIES, normalizeStudioCategory,
  findTier, findDelivery, isCellIncluded, SETUP_WAIVER_AMOUNT,
  normalizeMyPhone,
} from '../data/quoteStudioCatalog';
import {
  fetchTemplates, saveTemplate as serverSaveTemplate, deleteTemplate as serverDeleteTemplate,
  fetchCompanies, upsertCompany, deleteCompany as serverDeleteCompany,
  fetchCustomItems, insertCustomItem, updateCustomItem as serverUpdateCustomItem, deleteCustomItem as serverDeleteCustomItem,
  type ServerCompany,
} from '../lib/quotesysServer';

const PASSWORD = 'Malaysia168!';
const SESSION_KEY = 'qstudio_unlocked';
const SUBMITTED_SLUG_KEY = 'qstudio_submitted_slug';   // tells qref view "this user submitted this quote → show Edit"
const LIME = '#CCFF00';
const TOOL = 'quotestudio' as const;
const CUSTOM_ITEMS_CACHE_KEY = 'qstudio_custom_items_cache_v1';
const TEMPLATES_CACHE_KEY = 'qstudio_templates_cache_v1';

const fmt = (n: number) => n.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

type SectionId = 'entry' | 'software' | 'customization' | 'details';

// A user-added ad-hoc line item — mirrors QuoteSys's custom-item shape so the
// two tools can share the persistence table.
export interface StudioCustomItem {
  id: string;
  title: string;
  description?: string;
  price: number;
  sst: StudioSst;
  type: StudioItemType;
  qty: number; // qty embedded in the item — custom items are unique per quote
  category?: StudioItemCategory; // section the item belongs to (legacy rows → 'services')
}

// Per-line override of price for Additional Outlet / Additional Device items.
// Key = catalog id, value = annual RM (overrides catalog default if set).
export type AdditionalOutletPrices = Record<string, number>;

// Per-line discount applied BEFORE the quote-level discount + SST.
// Key = item id (catalog id, software tier id, custom item id, or 'setup' / 'delivery').
export type LineDiscount = { mode: 'rm' | 'pct'; value: number };
export type LineDiscounts = Record<string, LineDiscount>;

// Resolve a line discount to an RM amount clamped to the gross.
function resolveLineDiscount(gross: number, d: LineDiscount | undefined): number {
  if (!d || !d.value || d.value <= 0) return 0;
  const raw = d.mode === 'pct' ? gross * (d.value / 100) : d.value;
  return Math.max(0, Math.min(gross, Number.isFinite(raw) ? raw : 0));
}

interface Selections {
  qty: Record<string, number>;
  softwareTier: string | null;
  deliveryZone: string | null;
  includeSetup: boolean;
  waiveSetup: boolean;
  customNotes: string;
  startDateISO?: string | null;
  // ── New fields (post-2026-05-21) ──
  foc?: string;
  paymentTerms?: string;
  /** LEGACY single master discount — replayed as-is on quotes saved before the split. */
  discountMode?: 'rm' | 'pct';
  discountValue?: number;
  discountText?: string;
  customItems?: StudioCustomItem[];
  descriptions?: Record<string, string>;
  additionalOutletPrices?: AdditionalOutletPrices;
  lineDiscounts?: LineDiscounts;
  timelineEnabled?: boolean;
  projectTitle?: string;
  includePaymentGateway?: boolean;
  // ── Per-band discount (2026-08-04) — presence of either selects the split model ──
  discountHardware?: DiscountInput;   // off the 0%-SST band
  discountSoftware?: DiscountInput;   // off the 8%-SST band
  // ── New fields (2026-06-04) ──
  hideComparison?: boolean;                 // hide the feature-comparison chart on the customer quote
  customPackage?: StudioCustomPackage;      // freeform package line in Section 2
  itemPrices?: Record<string, number>;      // per-quote price overrides keyed by catalog item id
  // ── Catalog version (2026-06-18) — gates which feature matrix /qref renders ──
  catalogVersion?: number;                  // CATALOG_VERSION at save time; absent/<2 → legacy matrix
}

interface Totals {
  hardwareSubtotal: number;
  customizationSubtotal: number;
  subscriptionSubtotal: number;
  servicesSubtotal: number;
  sst: number;
  grandTotal: number;
  youSave: number;
  // ── New fields (post-2026-05-21) ──
  discount?: number;              // total = hardwareDiscount + softwareDiscount
  taxableBase?: number;
  // ── Per-band discount (2026-08-04) ──
  hardwareDiscount?: number;      // RM off the 0%-SST band
  softwareDiscount?: number;      // RM off the 8%-SST band
  zeroRatedPool?: number;         // every 0%-SST line, pre-discount
  taxablePool?: number;           // every 8%-SST line, pre-discount
  /**
   * A legacy master discount resolved into the two bands, for the migration
   * effect to commit. Null once migrated (i.e. on every quote built today).
   */
  legacyMigration?: { hardwareDiscount: number; softwareDiscount: number } | null;
  // ── Standalone monthly recurring (2026-06-04) — NOT part of grandTotal ──
  monthlyRecurring?: number;       // base RM/month (pre-SST)
  monthlyRecurringSst?: number;    // SST on the monthly base
  // ── Verify panel breakdown (internal tool) ──
  breakdown?: VerifyBreakdown;
}

// A single line as it enters the SST math — for the internal Verify panel.
interface VerifyLine {
  label: string;
  pool: 'Hardware' | 'Customization' | 'Subscription' | 'Services';
  amount: number;   // net subtotal (post line-discount) entering the pool
  taxable: number;  // the 8%-taxable portion of `amount` (0 for hardware)
}

// Every intermediate the canonical SST math walks through, so the numbers can
// be eyeballed against the grand total. Mirrors computeQuoteMoney (sstMath.ts).
interface VerifyBreakdown {
  lines: VerifyLine[];
  fullSubtotal: number;
  zeroRatedPool: number;      // every 0%-SST line — hardware discount's ceiling
  taxablePool: number;        // every 8%-SST line — software discount's ceiling
  hardwareDiscount: number;   // RM off the 0% band
  softwareDiscount: number;   // RM off the 8% band
  discount: number;           // hardwareDiscount + softwareDiscount
  taxableBase: number;        // taxablePool − softwareDiscount
  sst: number;
  grandTotal: number;
  rate: number;
}

const DEFAULT_PAYMENT_TERMS = '50% deposit on confirmation, balance on go-live.';

const NO_DISCOUNT: DiscountInput = { mode: 'rm', value: 0 };

/**
 * Read the discount off a saved quote / template. Prefers the per-band fields;
 * a payload that only has the legacy single master discount hands it back as
 * `legacy` so the builder can migrate it into the two bands once the pools are
 * known (see the migration effect).
 */
function readDiscount(s: Pick<Selections, 'discountHardware' | 'discountSoftware' | 'discountMode' | 'discountValue'>): {
  hw: DiscountInput;
  sw: DiscountInput;
  legacy: DiscountInput | null;
} {
  if (s.discountHardware || s.discountSoftware) {
    return {
      hw: s.discountHardware ?? NO_DISCOUNT,
      sw: s.discountSoftware ?? NO_DISCOUNT,
      legacy: null,
    };
  }
  const value = s.discountValue ?? 0;
  return {
    hw: NO_DISCOUNT,
    sw: NO_DISCOUNT,
    legacy: value > 0 ? { mode: s.discountMode ?? 'rm', value } : null,
  };
}

interface TemplatePayload {
  qty: Record<string, number>;
  softwareTier: string | null;
  deliveryZone: string | null;
  includeSetup: boolean;
  waiveSetup: boolean;
  customNotes: string;
  startDateISO?: string | null;
  foc?: string;
  paymentTerms?: string;
  /** LEGACY single master discount — migrated into the two bands on load. */
  discountMode?: 'rm' | 'pct';
  discountValue?: number;
  discountText?: string;
  discountHardware?: DiscountInput;
  discountSoftware?: DiscountInput;
  customItems?: StudioCustomItem[];
  descriptions?: Record<string, string>;
  additionalOutletPrices?: AdditionalOutletPrices;
  lineDiscounts?: LineDiscounts;
  timelineEnabled?: boolean;
  projectTitle?: string;
  includePaymentGateway?: boolean;
  hideComparison?: boolean;
  customPackage?: StudioCustomPackage;
  itemPrices?: Record<string, number>;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  businessName?: string;
  deliveryAddress?: string;
}

interface Template {
  id: string;
  name: string;
  createdAt: number;
  payload: TemplatePayload;
}

function loadTemplatesCache(): Template[] {
  try { const raw = localStorage.getItem(TEMPLATES_CACHE_KEY); return raw ? JSON.parse(raw) as Template[] : []; }
  catch { return []; }
}
function cacheTemplates(t: Template[]) {
  try { localStorage.setItem(TEMPLATES_CACHE_KEY, JSON.stringify(t)); } catch { /* noop */ }
}
function loadCustomItemsCache(): StudioCustomItem[] {
  try { const raw = localStorage.getItem(CUSTOM_ITEMS_CACHE_KEY); return raw ? JSON.parse(raw) as StudioCustomItem[] : []; }
  catch { return []; }
}
function cacheCustomItems(items: StudioCustomItem[]) {
  try { localStorage.setItem(CUSTOM_ITEMS_CACHE_KEY, JSON.stringify(items)); } catch { /* noop */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// PASSWORD GATE
// ─────────────────────────────────────────────────────────────────────────────
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      onUnlock();
    } else {
      setErr('Wrong password.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm border-2 p-7" style={{ borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.04)' }}>
        <div className="flex items-center gap-2 mb-5">
          <Lock size={16} strokeWidth={2.5} style={{ color: LIME }} />
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em]" style={{ color: LIME }}>Access</p>
        </div>
        <h1 className="text-[22px] md:text-[26px] font-black uppercase tracking-tight leading-tight mb-1">Q Studio Quote</h1>
        <p className="text-white/70 text-[12px] mb-6">Enter the access code shared by your Q Studio consultant.</p>
        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/60 mb-2">Access Code</label>
        <input
          type="password"
          autoFocus
          value={pwd}
          onChange={e => { setPwd(e.target.value); setErr(null); }}
          className="w-full bg-black border-2 border-white/20 focus:border-white/60 focus:outline-none text-white text-[14px] px-3 py-2.5 mb-3"
        />
        {err && <p className="text-red-400 text-[12px] mb-3">{err}</p>}
        <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-black text-[12px] font-black uppercase tracking-wider transition-opacity hover:opacity-90" style={{ backgroundColor: LIME }}>
          Continue <ArrowRight size={14} strokeWidth={2.5} />
        </button>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LINE-DISCOUNT FIELD — compact inline editor that appears on every selected
// item card. Tap "+ Discount" to expand; entering 0 / clicking × removes it.
// ─────────────────────────────────────────────────────────────────────────────
function LineDiscountField({
  itemId, gross, current, onChange, compact = false,
}: {
  itemId: string;
  gross: number;
  current: LineDiscount | undefined;
  onChange: (id: string, next: LineDiscount | null) => void;
  compact?: boolean;
}) {
  const hasDiscount = !!current && current.value > 0;
  const [open, setOpen] = useState(hasDiscount);

  // Keep "open" in sync if the parent clears the discount externally.
  useEffect(() => { if (hasDiscount) setOpen(true); }, [hasDiscount]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 hover:text-black border border-dashed border-gray-300 hover:border-black px-2 py-1 ${compact ? '' : 'mt-1.5'}`}
      >
        <Tag size={10} strokeWidth={2.5} /> Add discount
      </button>
    );
  }

  const mode = current?.mode ?? 'rm';
  const value = current?.value ?? 0;
  const resolved = resolveLineDiscount(gross, current);
  const exceeds = mode === 'pct' ? value > 100 : value > gross && gross > 0;

  return (
    <div className={`border border-gray-300 ${compact ? '' : 'mt-1.5'} bg-gray-50`}>
      <div className="flex items-stretch">
        <div className="flex items-center px-1.5 bg-black text-white">
          <Tag size={10} strokeWidth={2.5} />
        </div>
        <div className="inline-flex border-l border-gray-300">
          {(['rm', 'pct'] as const).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => onChange(itemId, value > 0 ? { mode: m, value } : null)}
              className={`px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider ${mode === m ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {m === 'rm' ? 'RM' : '%'}
            </button>
          ))}
        </div>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step={mode === 'pct' ? '0.5' : '1'}
          value={value || ''}
          onChange={e => {
            const n = parseFloat(e.target.value);
            onChange(itemId, Number.isFinite(n) && n > 0 ? { mode, value: n } : null);
          }}
          placeholder={mode === 'pct' ? '10' : '50'}
          className="flex-1 min-w-0 border-l border-gray-300 bg-white px-2 py-1 text-[11px] font-mono focus:outline-none focus:bg-yellow-50"
        />
        <button
          type="button"
          onClick={() => { onChange(itemId, null); setOpen(false); }}
          aria-label="Remove discount"
          className="px-2 border-l border-gray-300 text-gray-400 hover:text-red-600 hover:bg-red-50"
        >
          <XIcon size={10} strokeWidth={2.5} />
        </button>
      </div>
      {resolved > 0 ? (
        <div className={`px-1.5 py-0.5 text-[9px] font-mono ${exceeds ? 'text-red-600 bg-red-50' : 'text-gray-600'}`}>
          {exceeds ? <>capped at max</> : <>−RM {fmt(resolved)} off this line</>}
        </div>
      ) : (
        <div className="px-1.5 py-0.5 text-[9px] font-mono text-gray-400">no discount</div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ITEM PRICE FIELD — per-quote price override for any catalog item.
// Shows the effective price in an editable box with a Reset back to default.
// ─────────────────────────────────────────────────────────────────────────────
function ItemPriceField({
  itemId, defaultPrice, override, onChange, unitLabel = 'price', compact = false,
}: {
  itemId: string;
  defaultPrice: number;
  override: number | undefined;
  onChange: (id: string, value: number | null) => void;
  unitLabel?: string;
  compact?: boolean;
}) {
  const value = override !== undefined ? override : defaultPrice;
  const isOverridden = override !== undefined && override !== defaultPrice;
  return (
    <label className={`block ${compact ? '' : 'mt-2'}`}>
      <span className="block text-[9px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">
        Edit {unitLabel} (RM)
      </span>
      <div className="flex border-2 border-gray-200 focus-within:border-black">
        <span className="px-2 py-1.5 bg-gray-100 text-[11px] font-mono text-gray-600 border-r-2 border-gray-200">RM</span>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step="1"
          value={value}
          onChange={e => {
            const n = parseFloat(e.target.value);
            onChange(itemId, Number.isFinite(n) ? n : 0);
          }}
          className="flex-1 min-w-0 px-2 py-1.5 text-[12px] font-mono focus:outline-none focus:bg-yellow-50"
        />
        {isOverridden && (
          <button
            type="button"
            onClick={() => onChange(itemId, null)}
            title="Reset to default"
            className="px-2 text-[10px] font-mono text-gray-500 hover:text-black border-l-2 border-gray-200"
          >
            Reset
          </button>
        )}
      </div>
      {isOverridden && (
        <span className="block text-[9px] font-mono text-gray-400 mt-0.5">default RM {fmt(defaultPrice)}</span>
      )}
    </label>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM PACKAGE CARD — "Create your own package" (Section 2).
// Freeform line: multiline description, price, billing cadence, tax toggle.
// Coexists with a selected tier.
// ─────────────────────────────────────────────────────────────────────────────
const PACKAGE_CADENCES: { id: StudioPackageCadence; label: string; suffix: string }[] = [
  { id: 'one-time', label: 'One-time', suffix: 'one-time' },
  { id: 'monthly', label: 'Monthly', suffix: '/mo' },
  { id: 'annual', label: 'Per year', suffix: '/yr' },
];

function CustomPackageCard({ pkg, onField }: {
  pkg: StudioCustomPackage;
  onField: <K extends keyof StudioCustomPackage>(key: K, value: StudioCustomPackage[K]) => void;
}) {
  const suffix = PACKAGE_CADENCES.find(c => c.id === pkg.cadence)?.suffix ?? '';
  const sst = pkg.taxed ? pkg.price * 0.08 : 0;
  const lineTotal = pkg.price + sst;
  return (
    <div className={`mt-6 border-2 p-4 transition-all ${pkg.enabled ? 'border-black' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-[14px] font-black text-black uppercase tracking-tight">Create Your Own Package</h4>
          <p className="text-[11px] mt-0.5 text-gray-500 leading-snug">
            Build a bespoke package with your own description, price and billing — appears on the quote alongside any plan.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onField('enabled', !pkg.enabled)}
          className={`inline-flex items-center gap-1 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider flex-shrink-0 hover:opacity-90 ${pkg.enabled ? 'bg-black text-white' : 'text-black'}`}
          style={!pkg.enabled ? { backgroundColor: LIME } : undefined}
        >
          {pkg.enabled ? <><CheckCircle2 size={11} strokeWidth={3} /> Added</> : <><Plus size={11} strokeWidth={3} /> Add</>}
        </button>
      </div>

      {pkg.enabled && (
        <div className="mt-4 space-y-3">
          {/* Title (optional) */}
          <div>
            <label className="block text-[9px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">Package name (optional)</label>
            <input
              type="text"
              value={pkg.title ?? ''}
              onChange={e => onField('title', e.target.value)}
              placeholder="e.g. Custom Studio Bundle"
              className="w-full border-2 border-gray-200 focus:border-black focus:outline-none text-[13px] px-3 py-2"
            />
          </div>

          {/* Description (multiline) */}
          <div>
            <label className="block text-[9px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">What's included</label>
            <textarea
              value={pkg.description}
              onChange={e => onField('description', e.target.value)}
              rows={4}
              placeholder={"Describe the package…\nList each line on its own row — line breaks are preserved on the quote."}
              className="w-full border-2 border-gray-200 focus:border-black focus:outline-none text-[13px] px-3 py-2.5 resize-y whitespace-pre-line"
            />
          </div>

          {/* Price + cadence + tax */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[9px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">Price (RM)</label>
              <div className="flex border-2 border-gray-200 focus-within:border-black">
                <span className="px-3 py-2 bg-gray-100 text-[12px] font-mono text-gray-600 border-r-2 border-gray-200">RM</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="1"
                  value={pkg.price || ''}
                  onChange={e => { const n = parseFloat(e.target.value); onField('price', Number.isFinite(n) ? n : 0); }}
                  placeholder="0"
                  className="flex-1 min-w-0 px-3 py-2 text-[13px] font-mono focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-[9px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">Billing</label>
              <div className="inline-flex border-2 border-gray-200 w-full">
                {PACKAGE_CADENCES.map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onField('cadence', c.id)}
                    className={`flex-1 px-2 py-2 text-[11px] font-black uppercase tracking-wider ${i > 0 ? 'border-l-2 border-gray-200' : ''} ${pkg.cadence === c.id ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tax toggle */}
          <div className="inline-flex border-2 border-gray-200">
            {[{ v: true, label: 'With 8% SST' }, { v: false, label: 'No tax' }].map((opt, i) => (
              <button
                key={String(opt.v)}
                type="button"
                onClick={() => onField('taxed', opt.v)}
                className={`px-3 py-1.5 text-[11px] font-black uppercase tracking-wider ${i > 0 ? 'border-l-2 border-gray-200' : ''} ${pkg.taxed === opt.v ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {pkg.price > 0 && (
            <div className="text-[11px] font-mono text-gray-600 border-t border-gray-200 pt-2">
              {pkg.cadence === 'monthly' ? (
                <>Standalone recurring: <strong className="text-black">RM {fmt(lineTotal)}{suffix}</strong> {pkg.taxed && <span className="text-gray-400">(incl. SST)</span>} — not added to the upfront grand total.</>
              ) : (
                <><strong className="text-black">RM {fmt(lineTotal)}</strong> {pkg.taxed && <span className="text-gray-400">(incl. SST)</span>} · {suffix}</>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HARDWARE CARD (entry gate or POS, qty stepper)
// ─────────────────────────────────────────────────────────────────────────────
function HardwareCard({ item, qty, onChange, lineDiscount, onLineDiscount, priceOverride, onPriceOverride }: {
  item: StudioCatalogItem;
  qty: number | undefined;   // undefined = not on quote · 0 = on quote, display-only (not charged)
  onChange: (next: number) => void;
  lineDiscount: LineDiscount | undefined;
  onLineDiscount: (id: string, next: LineDiscount | null) => void;
  priceOverride: number | undefined;
  onPriceOverride: (id: string, value: number | null) => void;
}) {
  const selected = qty !== undefined;
  const q = qty ?? 0;
  const effPrice = priceOverride !== undefined ? priceOverride : item.price;
  return (
    <div
      className={`relative flex flex-col bg-white border-2 transition-all ${selected ? 'border-black shadow-lg' : 'border-gray-200 hover:border-gray-400'}`}
      style={selected ? { boxShadow: `0 4px 0 0 ${LIME}` } : undefined}
    >
      {item.badge && (
        <div className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-wider px-2 py-1 bg-black text-white">{item.badge}</div>
      )}
      <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-contain p-4" loading="lazy" />
        ) : (
          <div className="text-[36px]" aria-hidden>💻</div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-[15px] font-black text-black leading-tight mb-1">{item.title}</h3>
        {item.subtitle && <p className="text-[11px] text-gray-500 mb-2">{item.subtitle}</p>}
        {item.description && <p className="text-[12px] text-gray-700 leading-snug mb-3 whitespace-pre-line">{item.description}</p>}
        {item.benefits && (
          <ul className="space-y-1 mb-4 flex-1">
            {item.benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-700 leading-snug">
                <Check size={12} strokeWidth={3} className="mt-0.5 flex-shrink-0" style={{ color: '#1f6b00' }} />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-end justify-between gap-2 mt-auto pt-2 border-t border-gray-100">
          <div>
            <div className="text-[10px] text-gray-500 font-mono uppercase">
              {item.type === 'flat-annual' ? 'per year' : item.priceLabel ? '' : 'one-time'}
            </div>
            <div className="text-[18px] font-black text-black leading-tight">
              {item.priceLabel ?? `RM ${fmt(effPrice)}`}
            </div>
            {item.sst > 0 && (
              <div className="text-[9px] text-gray-400 font-mono uppercase">+ 8% SST</div>
            )}
          </div>
          {selected ? (
            <div className="flex items-center gap-2 bg-black text-white">
              <button type="button" onClick={() => onChange(q - 1)} className="w-9 h-9 flex items-center justify-center hover:opacity-80" aria-label={q === 0 ? 'Remove from quote' : 'Decrease'}>
                {q === 0 ? <XIcon size={14} strokeWidth={2.5} /> : <Minus size={14} strokeWidth={2.5} />}
              </button>
              <span className="w-6 text-center text-[14px] font-black">{q}</span>
              <button type="button" onClick={() => onChange(q + 1)} className="w-9 h-9 flex items-center justify-center hover:opacity-80" aria-label="Increase">
                <Plus size={14} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onChange(1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-black text-[11px] font-black uppercase tracking-wider hover:opacity-90"
              style={{ backgroundColor: LIME }}
            >
              <Plus size={12} strokeWidth={3} /> Add
            </button>
          )}
        </div>
        {selected && q === 0 && (
          <div className="mt-2 px-2 py-1.5 border border-dashed border-gray-300 bg-gray-50 text-[10px] font-mono text-gray-600">
            Qty 0 — shown on the quote with its price, <strong className="text-black">not charged</strong> (total RM 0.00). Tap × to remove.
          </div>
        )}
        {selected && !item.priceLabel && (
          <ItemPriceField
            itemId={item.id}
            defaultPrice={item.price}
            override={priceOverride}
            onChange={onPriceOverride}
          />
        )}
        {selected && q > 0 && (
          <LineDiscountField
            itemId={item.id}
            gross={effPrice * q}
            current={lineDiscount}
            onChange={onLineDiscount}
          />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SOFTWARE COMPARISON TABLE
// ─────────────────────────────────────────────────────────────────────────────
function CellRender({ cell, dim }: { cell: CellValue; dim?: boolean }) {
  const included = isCellIncluded(cell);
  if (!included) {
    return <XIcon size={14} strokeWidth={2} className="inline text-gray-300" />;
  }
  if (typeof cell === 'string') {
    const isComingSoon = cell.toLowerCase() === 'coming soon';
    return (
      <span className={`text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-tight ${isComingSoon ? 'text-gray-500 italic' : 'text-black'} ${dim ? 'opacity-70' : ''}`}>
        {cell}
      </span>
    );
  }
  return <CheckCircle2 size={16} strokeWidth={3} className="inline" style={{ color: '#1f6b00' }} />;
}

function FeatureTooltip({ text }: { text: string }) {
  // Anchor the popup to the right of the icon (and a touch below) so it
  // extends into the tier columns — never clipped by the table's overflow-x-auto.
  // The feature-name column is sticky-left, so the icon is always visible
  // at the left edge of the table viewport.
  return (
    <span className="relative inline-flex group align-middle ml-1" title={text}>
      <HelpCircle size={11} strokeWidth={2.5} className="text-gray-300 group-hover:text-gray-700 transition-colors cursor-help" />
      <span
        role="tooltip"
        className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:block z-50 w-56 bg-gray-900 text-white text-[12px] font-medium leading-relaxed px-3 py-2.5 rounded-md shadow-2xl pointer-events-none whitespace-normal antialiased subpixel-antialiased"
        style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', WebkitFontSmoothing: 'antialiased' }}
      >
        {text}
      </span>
    </span>
  );
}

function ComparisonTable({ selectedTier, onSelect }: {
  selectedTier: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <div className="overflow-x-auto -mx-5 md:mx-0 px-5 md:px-0 pb-2">
      <table className="w-full min-w-[760px] border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-white text-left text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 px-3 py-3 border-b-2 border-black w-[180px] md:w-[220px]">
              Compare Features
            </th>
            {QUOTE_SOFTWARE_TIERS.map(tier => {
              const selected = selectedTier === tier.id;
              return (
                <th
                  key={tier.id}
                  className={`text-center align-bottom px-2 py-3 border-b-2 border-black relative transition-colors ${selected ? 'bg-black text-white' : 'bg-white'}`}
                  style={{ minWidth: '110px' }}
                >
                  {tier.badge && !selected && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 inline-flex items-center gap-0.5 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 text-black whitespace-nowrap" style={{ backgroundColor: LIME }}>
                      <Star size={7} strokeWidth={3} /> {tier.badge}
                    </div>
                  )}
                  <div className={`text-[11px] md:text-[12px] font-black uppercase leading-tight mb-1 ${selected ? 'text-white' : 'text-black'}`}>
                    {tier.title.replace('Studio ', '')}
                  </div>
                  {tier.isCustom ? (
                    <div className={`text-[12px] font-black mb-2 leading-tight ${selected ? 'text-white' : 'text-black'}`}>Price upon Request</div>
                  ) : (
                    <>
                      <div className={`text-[18px] md:text-[20px] font-black leading-none mb-0.5 ${selected ? 'text-white' : 'text-black'}`}>
                        RM{tier.monthly}
                      </div>
                      <div className={`text-[9px] font-mono mb-2 ${selected ? 'text-white/70' : 'text-gray-500'}`}>/mo · billed annually</div>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => onSelect(selected ? null : tier.id)}
                    className={`w-full inline-flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${selected ? 'bg-white text-black' : 'bg-black text-white hover:opacity-90'}`}
                    style={!selected && tier.recommended ? { backgroundColor: LIME, color: '#000' } : undefined}
                  >
                    {selected ? <><CheckCircle2 size={10} strokeWidth={3} /> Selected</> : 'Select'}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {FEATURE_GROUPS.map((group, gIdx) => (
            <React.Fragment key={gIdx}>
              {/* Group band — sea-green like the screenshot */}
              <tr>
                <td
                  colSpan={1 + QUOTE_SOFTWARE_TIERS.length}
                  className="text-[10px] font-black uppercase tracking-[0.15em] text-white px-3 py-1.5"
                  style={{ backgroundColor: '#5eb3a8' }}
                >
                  {group.title}
                </td>
              </tr>
              {group.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-gray-50">
                  <td className="sticky left-0 bg-white text-[12px] text-gray-800 px-3 py-2 border-b border-gray-100 font-medium">
                    <span className="inline-flex items-center">
                      {row.feature}
                      <FeatureTooltip text={row.tooltip} />
                    </span>
                  </td>
                  {QUOTE_SOFTWARE_TIERS.map(tier => {
                    const selected = selectedTier === tier.id;
                    const cell = row.cells[tier.level];
                    return (
                      <td
                        key={tier.id}
                        className={`text-center px-2 py-2 border-b border-gray-100 align-middle ${selected ? 'bg-black/5' : ''}`}
                      >
                        <CellRender cell={cell} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ACCORDION SECTION WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
function SectionHeader({
  step, title, summary, open, onToggle,
}: {
  step: number;
  title: string;
  summary?: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-3 px-5 py-4 bg-white border-2 border-gray-200 hover:border-gray-400 transition-colors text-left"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center font-black text-[14px] text-black" style={{ backgroundColor: LIME }}>
          {step}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] md:text-[16px] font-black text-black uppercase tracking-tight leading-tight truncate">{title}</div>
          {summary && <div className="text-[11px] text-gray-500 truncate mt-0.5">{summary}</div>}
        </div>
      </div>
      <ChevronDown size={20} strokeWidth={2.5} className={`flex-shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function QuoteStudioPage() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') setUnlocked(true);
  }, []);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editSlug = searchParams.get('edit');

  const [qty, setQty] = useState<Record<string, number>>({});
  const [softwareTier, setSoftwareTier] = useState<string | null>(null);
  const [deliveryZone, setDeliveryZone] = useState<string | null>(null);
  const [includeSetup, setIncludeSetup] = useState(false);   // opt-in: total starts at RM 0
  const [waiveSetup, setWaiveSetup] = useState(false);
  const [includePaymentGateway, setIncludePaymentGateway] = useState(false); // opt-in
  const [customNotes, setCustomNotes] = useState('');
  const [startDateISO, setStartDateISO] = useState<string | null>(null);
  const [timelineEnabled, setTimelineEnabled] = useState(true);
  const [openSection, setOpenSection] = useState<SectionId>('entry');
  const [verifyOpen, setVerifyOpen] = useState(false); // internal SST verify panel
  const [hwTab, setHwTab] = useState<'entry' | 'pos' | 'others'>('entry');

  // Customer details
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [projectTitle, setProjectTitle] = useState('');

  // ── Sales-tool fields (added post-2026-05-21) ──
  const [foc, setFoc] = useState('');
  const [paymentTerms, setPaymentTerms] = useState(DEFAULT_PAYMENT_TERMS);
  // ── Discount, split per SST band ────────────────────────────────────────
  // One number can't be attributed across a quote that mixes 0% hardware with
  // 8% software, so the rep types each band separately and each stays inside
  // its own pool. `legacyDiscount` holds the old single master discount from a
  // quote/template saved before the split; the effect below migrates it into
  // the two bands (total RM preserved) once the pools are known.
  const [hwDiscount, setHwDiscount] = useState<DiscountInput>({ mode: 'rm', value: 0 });
  const [swDiscount, setSwDiscount] = useState<DiscountInput>({ mode: 'rm', value: 0 });
  const [legacyDiscount, setLegacyDiscount] = useState<DiscountInput | null>(null);
  const [discountText, setDiscountText] = useState<string>('');
  const [customItems, setCustomItems] = useState<StudioCustomItem[]>(() => loadCustomItemsCache());
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [additionalOutletPrices, setAdditionalOutletPrices] = useState<AdditionalOutletPrices>({});
  const [lineDiscounts, setLineDiscounts] = useState<LineDiscounts>({});

  // ── New (2026-06-04) ──
  const [hideComparison, setHideComparison] = useState(false);
  const [customPackage, setCustomPackage] = useState<StudioCustomPackage>(() => emptyCustomPackage());
  const [itemPrices, setItemPrices] = useState<Record<string, number>>({});

  const setCustomPackageField = <K extends keyof StudioCustomPackage>(key: K, value: StudioCustomPackage[K]) =>
    setCustomPackage(prev => ({ ...prev, [key]: value }));

  // Effective price for any catalog item — per-quote override falls back to catalog default.
  const effectivePrice = (id: string, fallback: number): number =>
    itemPrices[id] !== undefined ? itemPrices[id] : fallback;

  const setItemPrice = (id: string, value: number | null) => {
    setItemPrices(prev => {
      if (value === null) {
        if (prev[id] === undefined) return prev;
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: Math.max(0, value) };
    });
  };

  const setLineDiscount = (id: string, next: LineDiscount | null) => {
    setLineDiscounts(prev => {
      if (next === null || !next.value || next.value <= 0) {
        if (prev[id] === undefined) return prev;
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: { mode: next.mode, value: Math.max(0, next.value) } };
    });
  };
  const [templates, setTemplates] = useState<Template[]>(() => loadTemplatesCache());
  const [companies, setCompanies] = useState<ServerCompany[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pre-fill from an existing quote when ?edit=<slug> is present
  useEffect(() => {
    if (!editSlug || !unlocked) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('quotestudio_requests')
        .select('contact_name, contact_phone, contact_email, business_name, delivery_address, selections')
        .eq('public_id', editSlug)
        .single();
      if (cancelled || !data) return;
      setName(data.contact_name ?? '');
      setPhone(data.contact_phone ?? '');
      setEmail(data.contact_email ?? '');
      setBusinessName(data.business_name ?? '');
      setDeliveryAddress(data.delivery_address ?? '');
      const s: Selections = (data.selections as Selections) ?? {} as Selections;
      setQty(s.qty ?? {});
      setSoftwareTier(s.softwareTier ?? null);
      setDeliveryZone(s.deliveryZone ?? null);
      setIncludeSetup(!!s.includeSetup);
      setWaiveSetup(!!s.waiveSetup);
      setIncludePaymentGateway(!!s.includePaymentGateway);
      setCustomNotes(s.customNotes ?? '');
      setStartDateISO(s.startDateISO ?? null);
      setTimelineEnabled(s.timelineEnabled !== false);
      setProjectTitle(s.projectTitle ?? '');
      // New fields — guarded for older quotes
      setFoc(s.foc ?? '');
      setPaymentTerms(s.paymentTerms ?? DEFAULT_PAYMENT_TERMS);
      const d = readDiscount(s);
      setHwDiscount(d.hw);
      setSwDiscount(d.sw);
      setLegacyDiscount(d.legacy);
      setDiscountText(s.discountText ?? '');
      setCustomItems(s.customItems ?? []);
      setDescriptions(s.descriptions ?? {});
      setAdditionalOutletPrices(s.additionalOutletPrices ?? {});
      setLineDiscounts(s.lineDiscounts ?? {});
      setHideComparison(!!s.hideComparison);
      setCustomPackage(s.customPackage ?? emptyCustomPackage());
      setItemPrices(s.itemPrices ?? {});
    })();
    return () => { cancelled = true; };
  }, [editSlug, unlocked]);

  // Hydrate templates / companies / custom items from server.
  useEffect(() => {
    if (!unlocked) return;
    let cancelled = false;
    (async () => {
      try {
        const rows = await fetchTemplates<TemplatePayload>(TOOL);
        if (cancelled) return;
        const mapped: Template[] = rows.map(r => ({ id: r.id, name: r.name, createdAt: r.createdAt, payload: r.payload }));
        setTemplates(mapped);
        cacheTemplates(mapped);
      } catch (e) { console.error('QuoteStudio: fetchTemplates failed', e); }
      try {
        const rows = await fetchCompanies(TOOL);
        if (!cancelled) setCompanies(rows);
      } catch (e) { console.error('QuoteStudio: fetchCompanies failed', e); }
      try {
        const rows = await fetchCustomItems(TOOL);
        if (cancelled) return;
        // Merge: server items are the source of truth for the pool (title, price,
        // tax, …) but QUANTITIES belong to the quote being built — preserve
        // whatever is already in state (initial cache, a loaded template, or an
        // ?edit= prefill; this effect may resolve after those). Display order
        // also comes from current state (the shared table has no sort column);
        // items added on another device fall to the end.
        setCustomItems(prev => {
          const prevById = new Map(prev.map(c => [c.id, c]));
          const prevOrder = prev.map(c => c.id);
          const items: StudioCustomItem[] = rows.map(r => ({
            id: r.id,
            title: r.title,
            description: r.description ?? undefined,
            price: r.price,
            sst: (r.sst === 0.08 ? 0.08 : 0) as StudioSst,
            type: (['one-time', 'flat-annual', 'monthly-billed-annually'].includes(r.itemType) ? r.itemType : 'one-time') as StudioItemType,
            qty: prevById.get(r.id)?.qty ?? 1,
            category: normalizeStudioCategory(r.category),
          }));
          items.sort((a, b) => {
            const ia = prevOrder.indexOf(a.id);
            const ib = prevOrder.indexOf(b.id);
            if (ia === -1 && ib === -1) return 0;
            if (ia === -1) return 1;
            if (ib === -1) return -1;
            return ia - ib;
          });
          cacheCustomItems(items);
          return items;
        });
      } catch (e) { console.error('QuoteStudio: fetchCustomItems failed', e); }
    })();
    return () => { cancelled = true; };
  }, [unlocked]);

  // Set qty 1 for "use my own laptop" / FREE items isn't necessary — user can add manually.

  // Qty 0 is a VALID state: the item stays on the quote (price shown, total
  // RM 0, no tax) so the customer can see it without committing. Going below
  // 0 removes the item from the quote entirely.
  const setItemQty = (id: string, next: number) => {
    setQty(prev => {
      const copy = { ...prev };
      if (next < 0) { delete copy[id]; return copy; }
      copy[id] = Math.min(99, next);
      return copy;
    });
  };

  // Effective annual price for an additional-outlet item (default = catalog,
  // override = user-typed RM/yr per quote).
  const effectiveOutletPrice = (itemId: string): number => {
    if (additionalOutletPrices[itemId] !== undefined) return additionalOutletPrices[itemId];
    return findAdditionalOutletItem(itemId)?.price ?? 0;
  };

  // ─── Totals ──────────────────────────────────────────────────────────────
  // Calc rules (mirrors QuoteSys, fixed 2026-05-20):
  //   - Per-line discounts (lineDiscounts[id]) apply first → each line's
  //     "lineNet" enters the relevant pool.
  //   - The quote-level discount then applies on top of the one-time pool.
  //   - Taxable subtotal = services + custom-taxable-one-time (post-line-disc);
  //     quote discount eats the non-taxable hardware pool first.
  const totals: Totals = useMemo(() => {
    let hardwareSubtotal = 0;
    let subscriptionSubtotal = 0;
    let sstableSubscription = 0;
    const lines: VerifyLine[] = [];
    const qtyLabel = (title: string, q: number) => (q > 1 ? `${title} ×${q}` : title);

    const netForLine = (id: string, gross: number) =>
      gross - resolveLineDiscount(gross, lineDiscounts[id]);

    // Hardware lines (entry gates + POS + other hardware one-time items).
    // Qty-0 lines are display-only — they contribute RM 0 to every pool and
    // to the taxable base, so skipping them keeps the SST math exact.
    for (const item of [...ENTRY_GATES, ...POS_ITEMS, ...OTHER_HARDWARE]) {
      const q = qty[item.id] ?? 0;
      if (q <= 0) continue;
      const lineTotal = netForLine(item.id, effectivePrice(item.id, item.price) * q);
      if (item.type === 'one-time') {
        hardwareSubtotal += lineTotal;
        lines.push({ label: qtyLabel(item.title, q), pool: 'Hardware', amount: lineTotal, taxable: 0 });
      } else if (item.type === 'flat-annual') {
        subscriptionSubtotal += lineTotal;
        if (item.sst > 0) sstableSubscription += lineTotal;
        lines.push({ label: qtyLabel(item.title, q), pool: 'Subscription', amount: lineTotal, taxable: item.sst > 0 ? lineTotal : 0 });
      }
    }

    // Software tier (×12 if monthly-billed-annually, ×1 if flat)
    const tier = findTier(softwareTier);
    if (tier && !tier.isCustom) {
      const annual = netForLine(tier.id, effectivePrice(tier.id, tier.monthly) * 12);
      subscriptionSubtotal += annual;
      sstableSubscription += annual;
      lines.push({ label: `${tier.title} · ×12 (annual)`, pool: 'Subscription', amount: annual, taxable: annual });
    }

    // Additional Outlets / Devices (annual; price may be overridden per quote)
    for (const item of ADDITIONAL_OUTLET_ITEMS) {
      const q = qty[item.id] ?? 0;
      if (q <= 0) continue;
      const annual = netForLine(item.id, effectiveOutletPrice(item.id) * q);
      subscriptionSubtotal += annual;
      if (item.sst > 0) sstableSubscription += annual;
      lines.push({ label: qtyLabel(item.title, q), pool: 'Subscription', amount: annual, taxable: item.sst > 0 ? annual : 0 });
    }

    // Custom items
    let customOneTime = 0;
    let customSstableOneTime = 0;
    for (const ci of customItems) {
      const q = ci.qty;
      if (!q || q <= 0) continue;
      if (ci.type === 'one-time') {
        const lineTotal = netForLine(ci.id, ci.price * q);
        // Custom HARDWARE belongs in the 0%-SST hardware pool — not Customization.
        // Filing it under customOneTime mis-categorises the line AND (if its SST
        // flag isn't 0) inflates the taxable base, throwing off the pro-rata SST
        // whenever hardware and software are mixed.
        if (normalizeStudioCategory(ci.category) === 'hardware') {
          hardwareSubtotal += lineTotal;
          lines.push({ label: qtyLabel(ci.title, q), pool: 'Hardware', amount: lineTotal, taxable: 0 });
        } else {
          customOneTime += lineTotal;
          if (ci.sst > 0) customSstableOneTime += lineTotal;
          lines.push({ label: qtyLabel(ci.title, q), pool: 'Customization', amount: lineTotal, taxable: ci.sst > 0 ? lineTotal : 0 });
        }
      } else {
        // monthly-billed-annually → ×12; flat-annual → ×1
        const grossAnnual = ci.type === 'monthly-billed-annually' ? ci.price * 12 * q : ci.price * q;
        const annual = netForLine(ci.id, grossAnnual);
        subscriptionSubtotal += annual;
        if (ci.sst > 0) sstableSubscription += annual;
        lines.push({ label: qtyLabel(ci.title, q), pool: 'Subscription', amount: annual, taxable: ci.sst > 0 ? annual : 0 });
      }
    }

    // Custom package (Section 2 freeform line)
    //  - one-time → one-time pool (taxable if marked)
    //  - annual   → annual subscription pool
    //  - monthly  → standalone recurring (tracked separately, NOT in grandTotal)
    let monthlyRecurring = 0;
    let monthlyRecurringSst = 0;
    if (customPackage.enabled && customPackage.price > 0) {
      const taxed = customPackage.taxed;
      const pkgLabel = customPackage.title || 'Custom Package';
      if (customPackage.cadence === 'one-time') {
        const lineTotal = netForLine(CUSTOM_PACKAGE_ID, customPackage.price);
        customOneTime += lineTotal;
        if (taxed) customSstableOneTime += lineTotal;
        lines.push({ label: pkgLabel, pool: 'Customization', amount: lineTotal, taxable: taxed ? lineTotal : 0 });
      } else if (customPackage.cadence === 'annual') {
        const annual = netForLine(CUSTOM_PACKAGE_ID, customPackage.price);
        subscriptionSubtotal += annual;
        if (taxed) sstableSubscription += annual;
        lines.push({ label: `${pkgLabel} · annual`, pool: 'Subscription', amount: annual, taxable: taxed ? annual : 0 });
      } else { // monthly — standalone recurring
        monthlyRecurring = customPackage.price;
        monthlyRecurringSst = taxed ? customPackage.price * 0.08 : 0;
      }
    }

    // Services (setup + payment gateway + delivery) — always 8% SST; all discountable per line
    const setupGross = (includeSetup && !waiveSetup) ? effectivePrice(SETUP_AND_TRAINING.id, SETUP_AND_TRAINING.price) : 0;
    const setupAmt = setupGross > 0 ? netForLine(SETUP_AND_TRAINING.id, setupGross) : 0;
    const pgGross = includePaymentGateway ? effectivePrice(PAYMENT_GATEWAY_REGISTRATION.id, PAYMENT_GATEWAY_REGISTRATION.price) : 0;
    const pgAmt = pgGross > 0 ? netForLine(PAYMENT_GATEWAY_REGISTRATION.id, pgGross) : 0;
    const delivery = findDelivery(deliveryZone);
    const deliveryGross = delivery ? effectivePrice(delivery.id, delivery.price) : 0;
    const deliveryAmt = delivery && deliveryGross > 0 ? netForLine(delivery.id, deliveryGross) : 0;
    const servicesSubtotal = setupAmt + pgAmt + deliveryAmt;
    if (setupAmt > 0) lines.push({ label: SETUP_AND_TRAINING.title, pool: 'Services', amount: setupAmt, taxable: setupAmt });
    if (pgAmt > 0) lines.push({ label: PAYMENT_GATEWAY_REGISTRATION.title, pool: 'Services', amount: pgAmt, taxable: pgAmt });
    if (delivery && deliveryAmt > 0) lines.push({ label: delivery.title, pool: 'Services', amount: deliveryAmt, taxable: deliveryAmt });

    // ─── Quote-level discount (per SST band) + SST ───────────────────────────
    // Derived in the shared computeQuoteMoney() so the live builder and the
    // saved/shared quote view compute identical numbers (see src/lib/sstMath.ts).
    // The hardware discount comes off the 0% band and never touches the tax;
    // the software/services discount comes off the 8% band and SST is charged
    // on exactly what's left. Per-line discounts are already netted into the
    // pools above. A legacy single discount (old saved quote) is migrated into
    // the two bands by the effect below — until it commits, replay it as-is.
    const money = computeQuoteMoney({
      hardwareSubtotal,
      customOneTime,
      customSstableOneTime,
      subscriptionSubtotal,
      sstableSubscription,
      servicesSubtotal,
      hardwareDiscount: legacyDiscount ? null : hwDiscount,
      softwareDiscount: legacyDiscount ? null : swDiscount,
      discountMode: legacyDiscount?.mode,
      discountValue: legacyDiscount?.value,
    });
    const { discount: cappedDiscount, taxableBase, sst, grandTotal } = money;

    const youSave = waiveSetup ? SETUP_WAIVER_AMOUNT + SETUP_WAIVER_AMOUNT * 0.08 : 0;

    // ── Verify-panel breakdown — the same intermediates computeQuoteMoney walks ──
    const breakdown: VerifyBreakdown = {
      lines,
      fullSubtotal: money.fullSubtotal,
      zeroRatedPool: money.zeroRatedPool,
      taxablePool: money.taxablePool,
      hardwareDiscount: money.hardwareDiscount,
      softwareDiscount: money.softwareDiscount,
      discount: cappedDiscount,
      taxableBase,
      sst,
      grandTotal,
      rate: SST_RATE,
    };

    // What a legacy master discount becomes once split across the two bands —
    // consumed by the migration effect, which then clears `legacyDiscount`.
    const legacyMigration = legacyDiscount
      ? migrateLegacyDiscount({ hardwareSubtotal, customOneTime, customSstableOneTime, servicesSubtotal, legacy: legacyDiscount })
      : null;

    return {
      hardwareSubtotal,
      customizationSubtotal: customOneTime,
      subscriptionSubtotal,
      servicesSubtotal,
      sst,
      grandTotal,
      youSave,
      discount: cappedDiscount,
      hardwareDiscount: money.hardwareDiscount,
      softwareDiscount: money.softwareDiscount,
      zeroRatedPool: money.zeroRatedPool,
      taxablePool: money.taxablePool,
      taxableBase,
      monthlyRecurring,
      monthlyRecurringSst,
      breakdown,
      legacyMigration,
    };
  }, [qty, softwareTier, deliveryZone, includeSetup, waiveSetup, includePaymentGateway, additionalOutletPrices, itemPrices, customItems, customPackage, hwDiscount, swDiscount, legacyDiscount, lineDiscounts]);

  // ── Legacy discount migration ────────────────────────────────────────────
  // An old quote/template carries one master discount. Once the pools are known
  // we convert it to two RM band discounts that keep the SAME total RM off, then
  // drop the legacy value so every later edit uses the per-band math.
  const legacyMigration = totals.legacyMigration;
  useEffect(() => {
    if (!legacyDiscount || !legacyMigration) return;
    const round2 = (n: number) => Math.round(n * 100) / 100;
    setHwDiscount({ mode: 'rm', value: round2(legacyMigration.hardwareDiscount) });
    setSwDiscount({ mode: 'rm', value: round2(legacyMigration.softwareDiscount) });
    setLegacyDiscount(null);
  }, [legacyDiscount, legacyMigration]);

  // ─── Section summaries (shown in collapsed header) ───
  // hwSelectedLines counts items ON the quote (qty-0 display-only lines included);
  // hwSelectedCount sums units for the "N items" label.
  const hwSelectedLines = Object.keys(qty).length;
  const hwSelectedCount = Object.values(qty).reduce((a, b) => a + b, 0);
  const softwareLabel = softwareTier ? findTier(softwareTier)?.title : null;
  const deliveryLabel = deliveryZone ? findDelivery(deliveryZone)?.title : null;

  // ─── Custom item handlers (server-backed shared pool) ───
  // `category` files the saved item under Hardware / Software / Services so it
  // renders inside the matching section and persists there permanently.
  type CustomItemData = { title: string; description?: string; price: number; qty: number; sst: StudioSst; type: StudioItemType; category: StudioItemCategory };

  const addCustomItemHandler = async (data: CustomItemData) => {
    let id: string;
    try {
      const row = await insertCustomItem(TOOL, {
        title: data.title,
        description: data.description,
        price: data.price,
        sst: data.sst,
        itemType: data.type,
        category: data.category,
      });
      id = row.id;
    } catch (e) {
      console.error('QuoteStudio: insertCustomItem failed', e);
      id = `cust-${Math.random().toString(36).slice(2, 8)}`;
    }
    setCustomItems(prev => {
      const next = [...prev, {
        id, title: data.title, description: data.description,
        price: data.price, sst: data.sst, type: data.type, qty: Math.max(1, data.qty),
        category: data.category,
      }];
      cacheCustomItems(next);
      return next;
    });
  };

  const updateCustomItemHandler = (id: string, data: CustomItemData) => {
    setCustomItems(prev => {
      const next = prev.map(it => it.id === id ? {
        ...it,
        title: data.title,
        description: data.description,
        price: data.price,
        sst: data.sst,
        type: data.type,
        qty: Math.max(1, data.qty),
        category: data.category,
      } : it);
      cacheCustomItems(next);
      return next;
    });
    serverUpdateCustomItem(id, {
      title: data.title, description: data.description, price: data.price,
      sst: data.sst, itemType: data.type, category: data.category,
    }).catch(e => console.error('QuoteStudio: updateCustomItem failed', e));
  };

  const removeCustomItemHandler = (id: string) => {
    setCustomItems(prev => {
      const next = prev.filter(it => it.id !== id);
      cacheCustomItems(next);
      return next;
    });
    serverDeleteCustomItem(id).catch(e => console.error('QuoteStudio: deleteCustomItem failed', e));
  };

  const setCustomItemQty = (id: string, n: number) => {
    setCustomItems(prev => prev.map(it => it.id === id ? { ...it, qty: Math.max(0, Math.min(99, n)) } : it));
  };

  // Reorder a custom item up (-1) / down (+1) within its own category section.
  // We swap it with the adjacent item of the same category in the flat array so
  // the per-section #1, #2, #3 numbering reflects the new order. Order is cached
  // locally (the shared-pool table has no sort column) and survives reloads via
  // the cached-order merge in the hydrate effect above.
  const moveCustomItem = (id: string, dir: -1 | 1) => {
    setCustomItems(prev => {
      const item = prev.find(it => it.id === id);
      if (!item) return prev;
      const cat = normalizeStudioCategory(item.category);
      const idxs = prev.reduce<number[]>((acc, it, i) => {
        if (normalizeStudioCategory(it.category) === cat) acc.push(i);
        return acc;
      }, []);
      const pos = idxs.findIndex(i => prev[i].id === id);
      const target = pos + dir;
      if (pos === -1 || target < 0 || target >= idxs.length) return prev;
      const next = [...prev];
      const a = idxs[pos];
      const b = idxs[target];
      [next[a], next[b]] = [next[b], next[a]];
      cacheCustomItems(next);
      return next;
    });
  };

  // ─── Description override handler ───
  const setLineDescription = (id: string, value: string) => {
    setDescriptions(prev => {
      if (!value.trim()) {
        if (prev[id] === undefined) return prev;
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: value };
    });
  };

  // ─── Additional-outlet price override handler ───
  const setOutletPrice = (id: string, value: number | null) => {
    setAdditionalOutletPrices(prev => {
      if (value === null) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: value };
    });
  };

  // ─── Template handlers (server-backed) ───
  const saveAsTemplate = async (templateName: string) => {
    const payload: TemplatePayload = {
      qty: { ...qty },
      softwareTier, deliveryZone, includeSetup, waiveSetup, customNotes, startDateISO,
      timelineEnabled,
      projectTitle,
      includePaymentGateway,
      foc, paymentTerms,
      discountHardware: { ...hwDiscount }, discountSoftware: { ...swDiscount }, discountText,
      customItems: customItems.map(ci => ({ ...ci })),
      descriptions: { ...descriptions },
      additionalOutletPrices: { ...additionalOutletPrices },
      lineDiscounts: { ...lineDiscounts },
      hideComparison,
      customPackage: { ...customPackage },
      itemPrices: { ...itemPrices },
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      businessName,
      deliveryAddress,
    };
    try {
      const row = await serverSaveTemplate<TemplatePayload>(TOOL, templateName.trim(), payload);
      setTemplates(prev => {
        const next = [{ id: row.id, name: row.name, createdAt: row.createdAt, payload: row.payload }, ...prev];
        cacheTemplates(next);
        return next;
      });
    } catch (e) {
      console.error('QuoteStudio: saveTemplate failed', e);
      window.alert('Failed to save template to server — check your connection.');
    }
  };

  const loadTemplate = (id: string) => {
    const t = templates.find(x => x.id === id);
    if (!t) return;
    const p = t.payload;
    setQty({ ...(p.qty ?? {}) });
    setSoftwareTier(p.softwareTier ?? null);
    setDeliveryZone(p.deliveryZone ?? null);
    setIncludeSetup(!!p.includeSetup);
    setWaiveSetup(!!p.waiveSetup);
    setIncludePaymentGateway(!!p.includePaymentGateway);
    setCustomNotes(p.customNotes ?? '');
    setStartDateISO(p.startDateISO ?? null);
    setTimelineEnabled(p.timelineEnabled !== false);
    setProjectTitle(p.projectTitle ?? '');
    setFoc(p.foc ?? '');
    setPaymentTerms(p.paymentTerms ?? DEFAULT_PAYMENT_TERMS);
    const d = readDiscount(p);
    setHwDiscount(d.hw);
    setSwDiscount(d.sw);
    setLegacyDiscount(d.legacy);
    setDiscountText(p.discountText ?? '');
    // Custom items: the template stores a full snapshot of the shared pool with
    // per-item quantities. Apply the template's QUANTITIES onto the current pool
    // (server truth for title/price), zero items the template didn't have, and
    // resurrect template items since deleted from the pool — so the loaded quote
    // matches the template exactly without hiding newer pool items.
    if (p.customItems) {
      const tpl = p.customItems;
      setCustomItems(prev => {
        const tplById = new Map(tpl.map(ci => [ci.id, ci]));
        const merged = prev.map(it => {
          const t = tplById.get(it.id);
          return { ...it, qty: t ? t.qty : 0 };
        });
        for (const t of tpl) {
          if (!prev.some(it => it.id === t.id)) merged.push({ ...t });
        }
        return merged;
      });
    }
    setDescriptions(p.descriptions ?? {});
    setAdditionalOutletPrices(p.additionalOutletPrices ?? {});
    setLineDiscounts(p.lineDiscounts ?? {});
    setHideComparison(!!p.hideComparison);
    setCustomPackage(p.customPackage ?? emptyCustomPackage());
    setItemPrices(p.itemPrices ?? {});
    if (p.customerName !== undefined) setName(p.customerName);
    if (p.customerPhone !== undefined) setPhone(p.customerPhone);
    if (p.customerEmail !== undefined) setEmail(p.customerEmail);
    if (p.businessName !== undefined) setBusinessName(p.businessName);
    if (p.deliveryAddress !== undefined) setDeliveryAddress(p.deliveryAddress);
  };

  const deleteTemplateHandler = (id: string) => {
    setTemplates(prev => {
      const next = prev.filter(t => t.id !== id);
      cacheTemplates(next);
      return next;
    });
    serverDeleteTemplate(id).catch(e => console.error('QuoteStudio: deleteTemplate failed', e));
  };

  // ─── Company handlers ───
  const saveCompany = async () => {
    const company = businessName.trim() || name.trim();
    if (!company) { window.alert('Enter a business name or your name first.'); return; }
    try {
      const row = await upsertCompany(TOOL, {
        companyName: company,
        picName: name.trim() || undefined,
        picContact: phone.trim() || undefined,
        picEmail: email.trim() || undefined,
        deliveryAddress: deliveryAddress.trim() || undefined,
      });
      setCompanies(prev => {
        const without = prev.filter(c => c.id !== row.id);
        return [...without, row].sort((a, b) => a.companyName.localeCompare(b.companyName));
      });
    } catch (e) {
      console.error('QuoteStudio: saveCompany failed', e);
      window.alert('Failed to save company.');
    }
  };

  const loadCompany = (id: string) => {
    const c = companies.find(x => x.id === id);
    if (!c) return;
    setBusinessName(c.companyName);
    if (c.picName) setName(c.picName);
    if (c.picContact) setPhone(c.picContact);
    if (c.picEmail) setEmail(c.picEmail);
    if (c.deliveryAddress) setDeliveryAddress(c.deliveryAddress);
  };

  const removeCompany = (id: string) => {
    setCompanies(prev => prev.filter(c => c.id !== id));
    serverDeleteCompany(id).catch(e => console.error('QuoteStudio: deleteCompany failed', e));
  };

  // ─── Submit ──────────────────────────────────────────────────────────────
  const customItemsSelected = customItems.some(ci => ci.qty > 0);
  const canSubmit = name.trim() && phone.trim() && (hwSelectedLines > 0 || softwareTier !== null || customItemsSelected);

  async function handleSubmit() {
    if (submitting) return;
    setSubmitError(null);
    if (!canSubmit) {
      setSubmitError('Please add at least one item and fill in your name & phone.');
      return;
    }
    setSubmitting(true);
    try {
      const selections: Selections = {
        qty, softwareTier, deliveryZone, includeSetup, waiveSetup, customNotes, startDateISO,
        catalogVersion: CATALOG_VERSION,
        timelineEnabled,
        projectTitle: projectTitle.trim() || undefined,
        includePaymentGateway: includePaymentGateway || undefined,
        foc: foc || undefined,
        paymentTerms: paymentTerms !== DEFAULT_PAYMENT_TERMS ? paymentTerms : undefined,
        // Per-band discount. Both keys are always written (even at 0) so the
        // shared-quote view knows this quote is on the split model and must NOT
        // fall back to the legacy pro-rata replay.
        discountHardware: { ...hwDiscount },
        discountSoftware: { ...swDiscount },
        discountText: discountText || undefined,
        customItems: customItems.length > 0 ? customItems : undefined,
        descriptions: Object.keys(descriptions).length > 0 ? descriptions : undefined,
        additionalOutletPrices: Object.keys(additionalOutletPrices).length > 0 ? additionalOutletPrices : undefined,
        lineDiscounts: Object.keys(lineDiscounts).length > 0 ? lineDiscounts : undefined,
        hideComparison: hideComparison || undefined,
        customPackage: (customPackage.enabled && customPackage.price > 0) ? customPackage : undefined,
        itemPrices: Object.keys(itemPrices).length > 0 ? itemPrices : undefined,
      };

      // Claim a running sequence number for this quote.
      // RPC returns the next integer for the 'quotestudio' counter.
      let seqNo: number | null = null;
      try {
        const { data: seqData, error: seqErr } = await supabase.rpc('quotesys_claim_next_seq', { p_tool: TOOL });
        if (seqErr) throw seqErr;
        seqNo = typeof seqData === 'number' ? seqData : null;
      } catch (e) {
        console.error('QuoteStudio: claim seq failed, continuing without seq_no', e);
      }

      const insertRow: Record<string, unknown> = {
        contact_name: name.trim(),
        contact_phone: normalizeMyPhone(phone),
        contact_email: email.trim() || null,
        business_name: businessName.trim() || null,
        delivery_address: deliveryAddress.trim() || null,
        selections,
        totals,
        status: 'new',
      };
      if (seqNo !== null) insertRow.seq_no = seqNo;

      const { data, error } = await supabase
        .from('quotestudio_requests')
        .insert(insertRow)
        .select('public_id')
        .single();
      if (error) throw error;
      if (!data?.public_id) throw new Error('No quote ID returned');

      // Mark this browser session as the submitter so /qref/<slug> can show Edit.
      try { sessionStorage.setItem(SUBMITTED_SLUG_KEY, data.public_id); } catch { /* noop */ }

      navigate(`/qref/${data.public_id}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Submission failed. Please try again.';
      setSubmitError(msg);
      setSubmitting(false);
    }
  }

  if (!unlocked) {
    return (
      <>
        <SEOHead title="Q Studio Quote — Get Yours" noindex />
        <PasswordGate onUnlock={() => setUnlocked(true)} />
      </>
    );
  }

  const toggle = (id: SectionId) => setOpenSection(prev => prev === id ? prev : id);

  return (
    <>
      <SEOHead title="Q Studio Quote — Get Yours" noindex />
      <div className="min-h-screen bg-gray-50">
        {/* HERO */}
        <header className="bg-black text-white relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-5 py-10 md:py-14 relative">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 border" style={{ borderColor: LIME, color: LIME }}>
              <Sparkles size={12} strokeWidth={3} />
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]">Q Studio · Malaysia</span>
            </div>

            {/* Introduction Promo stamp */}
            <div
              aria-hidden="true"
              className="absolute top-4 right-4 md:top-6 md:right-6 -rotate-[8deg] pointer-events-none select-none"
              style={{ transformOrigin: 'top right' }}
            >
              <div className="inline-flex flex-col items-center px-3 md:px-4 py-1.5 md:py-2 border-[3px] border-red-500 text-red-500 bg-black/30 backdrop-blur-[2px]">
                <span className="text-[8px] md:text-[9px] font-mono font-black uppercase tracking-[0.25em] leading-tight">Introduction</span>
                <span className="text-[14px] md:text-[18px] font-black uppercase tracking-[0.12em] leading-none mt-0.5">Promo</span>
              </div>
            </div>
            <h1 className="text-[28px] md:text-[44px] font-black uppercase tracking-tight leading-[1.05] mb-3">
              Build Your <span style={{ color: LIME }}>Q Studio</span> Setup
            </h1>
            <p className="text-white/80 text-[14px] md:text-[16px] max-w-2xl leading-relaxed mb-6">
              Get an instant, tailored quote for your gym, studio or wellness business —
              delivered straight to your WhatsApp. No commitment.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-white/70">
              <span className="inline-flex items-center gap-1.5"><Shield size={12} strokeWidth={2.5} style={{ color: LIME }} /> 500+ studios powered by Q</span>
              <span className="inline-flex items-center gap-1.5"><MessageCircle size={12} strokeWidth={2.5} style={{ color: LIME }} /> Reply within 15 min · biz hours</span>
              <span className="inline-flex items-center gap-1.5"><FileText size={12} strokeWidth={2.5} style={{ color: LIME }} /> Instant PDF quote</span>
            </div>
          </div>
        </header>

        {/* STICKY LIVE TOTAL */}
        <div className="sticky top-0 z-40 bg-white border-b-2 border-black">
          <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-500">Your Quote</div>
              <div className="text-[18px] md:text-[22px] font-black text-black truncate">
                RM {fmt(totals.grandTotal)}
                <span className="text-[10px] text-gray-500 font-mono ml-2">incl. 8% SST</span>
                {((totals.monthlyRecurring ?? 0) + (totals.monthlyRecurringSst ?? 0)) > 0 && (
                  <span className="text-[11px] font-black ml-2" style={{ color: '#1f6b00' }}>
                    + RM {fmt((totals.monthlyRecurring ?? 0) + (totals.monthlyRecurringSst ?? 0))}/mo
                  </span>
                )}
              </div>
            </div>
            {totals.youSave > 0 && (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5" style={{ backgroundColor: LIME }}>
                <Gift size={14} strokeWidth={3} className="text-black" />
                <span className="text-[11px] font-black uppercase text-black">You save RM {fmt(totals.youSave)}</span>
              </div>
            )}
          </div>
        </div>

        {/* SALES TOOLS BAR — templates + companies */}
        <div className="bg-gray-100 border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-5 py-3 flex flex-wrap items-center gap-3">
            <QStudioTemplatesBar
              templates={templates}
              canSave={hwSelectedLines > 0 || softwareTier !== null || customItems.length > 0}
              onSave={saveAsTemplate}
              onLoad={loadTemplate}
              onDelete={deleteTemplateHandler}
            />
            <QStudioCompaniesBar
              companies={companies}
              currentName={businessName || name}
              onLoad={loadCompany}
              onSave={saveCompany}
              onDelete={removeCompany}
            />
          </div>
        </div>

        <main className="max-w-5xl mx-auto px-5 py-8 space-y-3">
          {/* ── STEP 1: HARDWARE ── */}
          <SectionHeader
            step={1}
            title="Select Your Entry Gate & POS"
            summary={hwSelectedLines > 0 ? `${hwSelectedCount} item${hwSelectedCount !== 1 ? 's' : ''} added — RM ${fmt(totals.hardwareSubtotal)}` : 'Pick the hardware your studio needs'}
            open={openSection === 'entry'}
            onToggle={() => toggle('entry')}
          />
          {openSection === 'entry' && (
            <div className="bg-white border-2 border-t-0 border-gray-200 -mt-3 p-5 md:p-6">
              {/* Sub-tabs */}
              <div className="flex gap-2 mb-5 border-b border-gray-200">
                {([['entry', 'Entry Gate'], ['pos', 'POS Hardware'], ['others', 'Others']] as const).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setHwTab(id)}
                    className={`px-4 py-2 text-[12px] font-black uppercase tracking-wider transition-colors ${hwTab === id ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(hwTab === 'entry' ? ENTRY_GATES : hwTab === 'pos' ? POS_ITEMS : OTHER_HARDWARE).map(item => (
                  <HardwareCard
                    key={item.id}
                    item={item}
                    qty={qty[item.id]}
                    onChange={(n) => setItemQty(item.id, n)}
                    lineDiscount={lineDiscounts[item.id]}
                    onLineDiscount={setLineDiscount}
                    priceOverride={itemPrices[item.id]}
                    onPriceOverride={setItemPrice}
                  />
                ))}
              </div>

              {/* Add your own hardware — saved permanently */}
              <div className="mt-6">
                <QStudioCustomItemsSection
                  category="hardware"
                  title="Add Your Own Hardware"
                  subtitle="Add a hardware item not listed above (e.g. a camera, printer). Saved permanently to the shared pool."
                  items={customItems}
                  lineDiscounts={lineDiscounts}
                  onAdd={addCustomItemHandler}
                  onUpdate={updateCustomItemHandler}
                  onRemove={removeCustomItemHandler}
                  onQty={setCustomItemQty}
                  onMove={moveCustomItem}
                  onLineDiscount={setLineDiscount}
                />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => toggle('software')}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-black text-white text-[12px] font-black uppercase tracking-wider hover:opacity-90"
                >
                  Next: Choose Software <ArrowRight size={14} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: SOFTWARE ── */}
          <SectionHeader
            step={2}
            title="Choose Your Studio Software"
            summary={softwareLabel ? `${softwareLabel} — billed annually` : 'Pick the plan that fits your studio'}
            open={openSection === 'software'}
            onToggle={() => toggle('software')}
          />
          {openSection === 'software' && (
            <div className="bg-white border-2 border-t-0 border-gray-200 -mt-3 p-5 md:p-6">
              <p className="text-[12px] text-gray-600 mb-4 leading-relaxed">
                Every plan is <strong>billed annually</strong> (paid once per year, monthly equivalent shown).
                Each higher tier includes everything below. No long-term lock-in — upgrade or downgrade anytime.
              </p>

              {/* Hide comparison chart — sales toggle (affects the customer quote only) */}
              <label className="flex items-start gap-2.5 mb-4 p-3 border-2 border-dashed border-gray-300 cursor-pointer select-none hover:border-gray-500 transition-colors">
                <input
                  type="checkbox"
                  checked={hideComparison}
                  onChange={e => setHideComparison(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-black flex-shrink-0"
                />
                <span className="min-w-0">
                  <span className="block text-[12px] font-black uppercase tracking-tight text-black">Hide comparison chart from customer quote</span>
                  <span className="block text-[11px] text-gray-500 leading-snug">
                    The chart stays here so you can still pick a plan — it just won't appear on the generated quote the customer sees.
                  </span>
                </span>
              </label>

              <ComparisonTable
                selectedTier={softwareTier}
                onSelect={setSoftwareTier}
              />
              {softwareTier && (() => {
                const tier = findTier(softwareTier);
                if (!tier || tier.isCustom) return null;
                const effMonthly = effectivePrice(tier.id, tier.monthly);
                const annual = effMonthly * 12;
                return (
                  <div className="mt-4 p-4 border-2 border-black space-y-3" style={{ backgroundColor: 'rgba(204,255,0,0.1)' }}>
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-600">You picked</div>
                        <div className="text-[15px] font-black text-black">{tier.title}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-600">Annual subscription</div>
                        <div className="text-[18px] font-black text-black">RM {fmt(annual)} <span className="text-[10px] font-mono text-gray-500">+ 8% SST</span></div>
                      </div>
                    </div>
                    <ItemPriceField
                      itemId={tier.id}
                      defaultPrice={tier.monthly}
                      override={itemPrices[tier.id]}
                      onChange={setItemPrice}
                      unitLabel="monthly price"
                      compact
                    />
                    <LineDiscountField
                      itemId={tier.id}
                      gross={annual}
                      current={lineDiscounts[tier.id]}
                      onChange={setLineDiscount}
                      compact
                    />
                  </div>
                );
              })()}

              {/* Create your own package — freeform, coexists with a selected tier */}
              <CustomPackageCard pkg={customPackage} onField={setCustomPackageField} />

              {/* Additional outlets / devices — annual, editable price per gym */}
              <div className="mt-6 border-t-2 border-gray-200 pt-5">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-700 mb-3">
                  Additional Outlets &amp; Devices <span className="text-gray-400 ml-1">· billed annually · 8% SST · price editable per quote</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ADDITIONAL_OUTLET_ITEMS.map(item => {
                    const selected = qty[item.id] !== undefined;
                    const q = qty[item.id] ?? 0;
                    const priceOverride = additionalOutletPrices[item.id];
                    const annualPrice = priceOverride ?? item.price;
                    return (
                      <div key={item.id} className="border-2 border-gray-200 p-4 hover:border-gray-400 transition-colors">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-black text-black leading-tight">{item.title}</div>
                            <div className="text-[10px] text-gray-500 mt-0.5">{item.subtitle}</div>
                          </div>
                          {selected ? (
                            <div className="flex items-center gap-1 bg-black text-white flex-shrink-0">
                              <button type="button" onClick={() => setItemQty(item.id, q - 1)} className="w-7 h-7 flex items-center justify-center hover:opacity-80" aria-label={q === 0 ? 'Remove from quote' : 'Decrease'}>{q === 0 ? <XIcon size={12} strokeWidth={2.5} /> : <Minus size={12} strokeWidth={2.5} />}</button>
                              <span className="w-5 text-center text-[12px] font-black">{q}</span>
                              <button type="button" onClick={() => setItemQty(item.id, q + 1)} className="w-7 h-7 flex items-center justify-center hover:opacity-80" aria-label="Increase"><Plus size={12} strokeWidth={2.5} /></button>
                            </div>
                          ) : (
                            <button type="button" onClick={() => setItemQty(item.id, 1)} className="inline-flex items-center gap-1 px-3 py-1.5 text-black text-[10px] font-black uppercase tracking-wider hover:opacity-90 flex-shrink-0" style={{ backgroundColor: LIME }}>
                              <Plus size={10} strokeWidth={3} /> Add
                            </button>
                          )}
                        </div>
                        <label className="block">
                          <span className="block text-[9px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">Annual price per unit (RM)</span>
                          <div className="flex border-2 border-gray-200 focus-within:border-black">
                            <span className="px-3 py-2 bg-gray-100 text-[12px] font-mono text-gray-600 border-r-2 border-gray-200">RM</span>
                            <input
                              type="number"
                              inputMode="decimal"
                              min="0"
                              step="1"
                              value={annualPrice}
                              onChange={e => {
                                const n = parseFloat(e.target.value);
                                setOutletPrice(item.id, Number.isFinite(n) ? n : 0);
                              }}
                              className="flex-1 px-3 py-2 text-[13px] font-mono focus:outline-none"
                            />
                            {priceOverride !== undefined && (
                              <button
                                type="button"
                                onClick={() => setOutletPrice(item.id, null)}
                                aria-label="Reset to default"
                                title="Reset to default"
                                className="px-2 text-[10px] font-mono text-gray-500 hover:text-black border-l-2 border-gray-200"
                              >
                                Reset
                              </button>
                            )}
                          </div>
                          {selected && (
                            <div className="text-[10px] text-gray-500 font-mono mt-1.5">
                              {q} × RM {fmt(annualPrice)} = <strong className="text-black">RM {fmt(annualPrice * q)}/yr</strong>
                              {q === 0 && <span className="text-gray-400"> · display only, not charged</span>}
                            </div>
                          )}
                        </label>
                        {q > 0 && (
                          <LineDiscountField
                            itemId={item.id}
                            gross={annualPrice * q}
                            current={lineDiscounts[item.id]}
                            onChange={setLineDiscount}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add your own software / subscription — saved permanently */}
              <div className="mt-6 border-t-2 border-gray-200 pt-5">
                <QStudioCustomItemsSection
                  category="software"
                  title="Add Your Own Software / Subscription"
                  subtitle="Add a software plan or subscription not listed above. Saved permanently to the shared pool."
                  items={customItems}
                  lineDiscounts={lineDiscounts}
                  onAdd={addCustomItemHandler}
                  onUpdate={updateCustomItemHandler}
                  onRemove={removeCustomItemHandler}
                  onQty={setCustomItemQty}
                  onMove={moveCustomItem}
                  onLineDiscount={setLineDiscount}
                />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => toggle('customization')}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-black text-white text-[12px] font-black uppercase tracking-wider hover:opacity-90"
                >
                  Next: Customization <ArrowRight size={14} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: CUSTOMIZATION ── */}
          <SectionHeader
            step={3}
            title="Customization & Delivery"
            summary={deliveryLabel ? `Delivery: ${deliveryLabel}${waiveSetup ? ' · Setup waived' : ''}` : 'Add setup, delivery & special notes'}
            open={openSection === 'customization'}
            onToggle={() => toggle('customization')}
          />
          {openSection === 'customization' && (
            <div className="bg-white border-2 border-t-0 border-gray-200 -mt-3 p-5 md:p-6 space-y-6">
              {/* Custom items — Services & Other (sales-tool, saved permanently) */}
              <QStudioCustomItemsSection
                category="custom"
                title="Services & Other Items"
                subtitle="Add ad-hoc services or anything else. Saved permanently to the shared pool."
                items={customItems}
                lineDiscounts={lineDiscounts}
                onAdd={addCustomItemHandler}
                onUpdate={updateCustomItemHandler}
                onRemove={removeCustomItemHandler}
                onQty={setCustomItemQty}
                onMove={moveCustomItem}
                onLineDiscount={setLineDiscount}
              />

              {/* Description overrides per selected line */}
              <QStudioDescriptionsSection
                qty={qty}
                customItems={customItems}
                descriptions={descriptions}
                onSetDescription={setLineDescription}
              />

              {/* Custom notes */}
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Anything Specific We Should Know?
                </label>
                <textarea
                  value={customNotes}
                  onChange={e => setCustomNotes(e.target.value)}
                  rows={4}
                  placeholder="Preferred install date, special integrations, current system you're migrating from…"
                  className="w-full border-2 border-gray-200 focus:border-black focus:outline-none text-[13px] px-3 py-2.5 resize-none"
                />
                <p className="text-[11px] text-gray-500 mt-1.5">My team will fill the rest based on your replies — this is optional.</p>
              </div>

              {/* FOC */}
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Free of Charge (FOC) — optional
                </label>
                <textarea
                  value={foc}
                  onChange={e => setFoc(e.target.value)}
                  rows={3}
                  placeholder="e.g. Free 6 months WhatsApp support · Free staff training session · 1 free Face ID camera"
                  className="w-full border-2 border-gray-200 focus:border-black focus:outline-none text-[13px] px-3 py-2.5 resize-none"
                />
              </div>

              {/* Discount — one field per SST band */}
              <QStudioDiscountSection
                hardware={hwDiscount} software={swDiscount}
                setHardware={setHwDiscount} setSoftware={setSwDiscount}
                text={discountText} setText={setDiscountText}
                zeroRatedPool={totals.zeroRatedPool ?? 0}
                taxablePool={totals.taxablePool ?? 0}
                hardwareDiscount={totals.hardwareDiscount ?? 0}
                softwareDiscount={totals.softwareDiscount ?? 0}
                sst={totals.sst}
              />

              {/* Payment terms */}
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Payment Terms
                </label>
                <textarea
                  value={paymentTerms}
                  onChange={e => setPaymentTerms(e.target.value)}
                  rows={3}
                  placeholder="e.g. 50% deposit on confirmation, balance on go-live."
                  className="w-full border-2 border-gray-200 focus:border-black focus:outline-none text-[13px] px-3 py-2.5 resize-none"
                />
              </div>

              {/* Setup & Training (opt-in) */}
              <div className={`border-2 p-4 transition-all ${includeSetup && !waiveSetup ? 'border-black' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-[14px] font-black ${waiveSetup ? 'text-gray-500 line-through' : 'text-black'}`}>
                      Setup & Training
                    </h4>
                    <p className="text-[11px] mt-0.5 text-gray-600">{SETUP_AND_TRAINING.subtitle}</p>
                    {SETUP_AND_TRAINING.benefits && (
                      <ul className="mt-2 space-y-1">
                        {SETUP_AND_TRAINING.benefits.map((b, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-700">
                            <Check size={11} strokeWidth={3} className="mt-0.5 flex-shrink-0" style={{ color: '#1f6b00' }} />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="text-right">
                      <div className={`text-[16px] font-black ${waiveSetup ? 'text-gray-400 line-through' : 'text-black'}`}>RM {fmt(effectivePrice(SETUP_AND_TRAINING.id, SETUP_AND_TRAINING.price))}</div>
                      <div className="text-[9px] text-gray-500 font-mono uppercase">+ 8% SST</div>
                    </div>
                    {includeSetup ? (
                      <button
                        type="button"
                        onClick={() => { setIncludeSetup(false); setWaiveSetup(false); }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white text-[10px] font-black uppercase tracking-wider hover:opacity-90"
                      >
                        <CheckCircle2 size={11} strokeWidth={3} /> Added
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIncludeSetup(true)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-black text-[10px] font-black uppercase tracking-wider hover:opacity-90"
                        style={{ backgroundColor: LIME }}
                      >
                        <Plus size={11} strokeWidth={3} /> Add
                      </button>
                    )}
                  </div>
                </div>
                {includeSetup && !waiveSetup && (
                  <>
                    <ItemPriceField
                      itemId={SETUP_AND_TRAINING.id}
                      defaultPrice={SETUP_AND_TRAINING.price}
                      override={itemPrices[SETUP_AND_TRAINING.id]}
                      onChange={setItemPrice}
                    />
                    <LineDiscountField
                      itemId={SETUP_AND_TRAINING.id}
                      gross={effectivePrice(SETUP_AND_TRAINING.id, SETUP_AND_TRAINING.price)}
                      current={lineDiscounts[SETUP_AND_TRAINING.id]}
                      onChange={setLineDiscount}
                    />
                  </>
                )}
              </div>

              {/* Payment Gateway Registration (opt-in) */}
              <div className={`border-2 p-4 transition-all ${includePaymentGateway ? 'border-black' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] font-black text-black">
                      {PAYMENT_GATEWAY_REGISTRATION.title}
                    </h4>
                    <p className="text-[11px] mt-0.5 text-gray-600">{PAYMENT_GATEWAY_REGISTRATION.subtitle}</p>
                    {PAYMENT_GATEWAY_REGISTRATION.benefits && (
                      <ul className="mt-2 space-y-1">
                        {PAYMENT_GATEWAY_REGISTRATION.benefits.map((b, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-700">
                            <Check size={11} strokeWidth={3} className="mt-0.5 flex-shrink-0" style={{ color: '#1f6b00' }} />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-[16px] font-black text-black">RM {fmt(effectivePrice(PAYMENT_GATEWAY_REGISTRATION.id, PAYMENT_GATEWAY_REGISTRATION.price))}</div>
                      <div className="text-[9px] text-gray-500 font-mono uppercase">+ 8% SST</div>
                    </div>
                    {includePaymentGateway ? (
                      <button
                        type="button"
                        onClick={() => setIncludePaymentGateway(false)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white text-[10px] font-black uppercase tracking-wider hover:opacity-90"
                      >
                        <CheckCircle2 size={11} strokeWidth={3} /> Added
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIncludePaymentGateway(true)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-black text-[10px] font-black uppercase tracking-wider hover:opacity-90"
                        style={{ backgroundColor: LIME }}
                      >
                        <Plus size={11} strokeWidth={3} /> Add
                      </button>
                    )}
                  </div>
                </div>
                {includePaymentGateway && (
                  <>
                    <ItemPriceField
                      itemId={PAYMENT_GATEWAY_REGISTRATION.id}
                      defaultPrice={PAYMENT_GATEWAY_REGISTRATION.price}
                      override={itemPrices[PAYMENT_GATEWAY_REGISTRATION.id]}
                      onChange={setItemPrice}
                    />
                    <LineDiscountField
                      itemId={PAYMENT_GATEWAY_REGISTRATION.id}
                      gross={effectivePrice(PAYMENT_GATEWAY_REGISTRATION.id, PAYMENT_GATEWAY_REGISTRATION.price)}
                      current={lineDiscounts[PAYMENT_GATEWAY_REGISTRATION.id]}
                      onChange={setLineDiscount}
                    />
                  </>
                )}
              </div>

              {/* Delivery */}
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-gray-600 mb-3">
                  Delivery & Installation
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {DELIVERY_ZONES.map(zone => {
                    const selected = deliveryZone === zone.id;
                    return (
                      <div
                        key={zone.id}
                        className={`border-2 p-4 transition-all ${selected ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}
                        style={selected ? { boxShadow: `0 4px 0 0 ${LIME}` } : undefined}
                      >
                        <button
                          type="button"
                          onClick={() => setDeliveryZone(prev => prev === zone.id ? null : zone.id)}
                          className="w-full text-left"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[13px] font-black text-black">{zone.title}</span>
                            {selected && <CheckCircle2 size={14} strokeWidth={3} className="text-black" />}
                          </div>
                          <div className="text-[10px] text-gray-500 mb-2">{zone.subtitle}</div>
                          <div className="text-[14px] font-black text-black">RM {fmt(effectivePrice(zone.id, zone.price))}</div>
                          <div className="text-[9px] text-gray-500 font-mono uppercase">+ 8% SST</div>
                        </button>
                        {selected && (
                          <>
                            <ItemPriceField
                              itemId={zone.id}
                              defaultPrice={zone.price}
                              override={itemPrices[zone.id]}
                              onChange={setItemPrice}
                            />
                            <LineDiscountField
                              itemId={zone.id}
                              gross={effectivePrice(zone.id, zone.price)}
                              current={lineDiscounts[zone.id]}
                              onChange={setLineDiscount}
                            />
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-[11px] text-gray-500 mt-3 italic">
                  * Large items (turnstiles, anti-tailgating gates) will be quoted separately for delivery.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => toggle('details')}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-black text-white text-[12px] font-black uppercase tracking-wider hover:opacity-90"
                >
                  Next: Your Details <ArrowRight size={14} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: CUSTOMER DETAILS ── */}
          <SectionHeader
            step={4}
            title="Your Details"
            summary={name && phone ? `${name} · ${phone}` : 'Tell us how to reach you'}
            open={openSection === 'details'}
            onToggle={() => toggle('details')}
          />
          {openSection === 'details' && (
            <div className="bg-white border-2 border-t-0 border-gray-200 -mt-3 p-5 md:p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Your Name *" value={name} onChange={setName} placeholder="e.g. Ahmad Lee" />
                <Field label="Phone (WhatsApp) *" value={phone} onChange={setPhone} placeholder="012-345 6789" prefix="+60" />
                <Field label="Email (optional)" value={email} onChange={setEmail} placeholder="you@studio.my" type="email" />
                <Field label="Studio / Business Name" value={businessName} onChange={setBusinessName} placeholder="e.g. FlexFit Studio" />
              </div>
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Delivery Address
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  rows={3}
                  className="w-full border-2 border-gray-200 focus:border-black focus:outline-none text-[13px] px-3 py-2.5 resize-none"
                />
              </div>

              <Field
                label="Project Title (optional)"
                value={projectTitle}
                onChange={setProjectTitle}
                placeholder="e.g. FlexFit KL Flagship Rollout"
              />

              {/* Waiver checkbox — only meaningful if Setup is added */}
              {includeSetup ? (
                <label
                  className={`flex items-start gap-3 p-4 border-2 cursor-pointer transition-all ${waiveSetup ? 'border-black' : 'border-gray-200 hover:border-gray-400'}`}
                  style={waiveSetup ? { backgroundColor: 'rgba(204,255,0,0.15)' } : undefined}
                >
                  <input
                    type="checkbox"
                    checked={waiveSetup}
                    onChange={e => setWaiveSetup(e.target.checked)}
                    className="mt-0.5 w-5 h-5 cursor-pointer flex-shrink-0 accent-black"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[14px] font-black text-black">Confirm by this week — Waive RM800 Setup Fee!</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-black" style={{ backgroundColor: LIME }}>
                        <Gift size={9} strokeWidth={3} /> Save RM864
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                      Confirm your order by the end of this week and we'll waive the full RM800 setup & training fee
                      (RM864 incl. SST). Limited slots — first come, first served.
                    </p>
                  </div>
                </label>
              ) : (
                <div className="p-3 border-2 border-dashed border-gray-200 text-[11px] text-gray-500 italic">
                  💡 Add Setup &amp; Training in step 3 to unlock the &ldquo;Confirm this week, waive RM800&rdquo; promo.
                </div>
              )}

              {/* Confidence row */}
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-500">
                <span className="inline-flex items-center gap-1.5"><Shield size={12} strokeWidth={2.5} /> Your details stay private</span>
                <span className="inline-flex items-center gap-1.5"><MessageCircle size={12} strokeWidth={2.5} /> Reply on WhatsApp in 15 min</span>
                <span className="inline-flex items-center gap-1.5"><FileText size={12} strokeWidth={2.5} /> PDF quote in your hand</span>
              </div>

              {submitError && (
                <div className="text-[12px] text-red-600 bg-red-50 border-2 border-red-200 px-3 py-2">{submitError}</div>
              )}

              {/* Final summary */}
              <FinalSummary totals={totals} />

              {/* Rollout timeline */}
              <div className="pt-2">
                <div className="flex items-center justify-between gap-3 mb-3 p-3 border-2 border-gray-200 bg-gray-50">
                  <div className="min-w-0">
                    <div className="text-[12px] font-black uppercase tracking-tight text-black">8-Week Rollout Plan</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      {timelineEnabled
                        ? 'Shown on the quote PDF — kickoff → launch milestone.'
                        : 'Hidden — will NOT appear on the quote PDF.'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTimelineEnabled(v => !v)}
                    aria-pressed={timelineEnabled}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider flex-shrink-0 transition-colors ${timelineEnabled ? 'bg-black text-white hover:opacity-90' : 'border-2 border-gray-300 text-gray-700 hover:border-black bg-white'}`}
                  >
                    {timelineEnabled ? (
                      <><CheckCircle2 size={11} strokeWidth={3} /> Enabled · Click to Disable</>
                    ) : (
                      <><Plus size={11} strokeWidth={3} /> Disabled · Click to Enable</>
                    )}
                  </button>
                </div>
                {timelineEnabled && (
                  <QuoteStudioTimeline
                    startDateISO={startDateISO}
                    onStartDateChange={setStartDateISO}
                  />
                )}
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !canSubmit}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-black text-white text-[14px] font-black uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                style={!submitting && canSubmit ? { boxShadow: `0 4px 0 0 ${LIME}` } : undefined}
              >
                {submitting ? 'Submitting…' : <>Submit <ArrowRight size={14} strokeWidth={2.5} /></>}
              </button>
              <p className="text-center text-[11px] text-gray-500">
                No commitment — this is just a quote. You'll see your saved PDF + WhatsApp the team on the next screen.
              </p>
            </div>
          )}
        </main>

        {/* Mobile sticky submit shortcut */}
        <div className="md:hidden sticky bottom-0 left-0 right-0 bg-white border-t-2 border-black p-3 z-30">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-500">Total incl. SST</div>
              <div className="text-[16px] font-black text-black">RM {fmt(totals.grandTotal)}</div>
              {((totals.monthlyRecurring ?? 0) + (totals.monthlyRecurringSst ?? 0)) > 0 && (
                <div className="text-[11px] font-black" style={{ color: '#1f6b00' }}>
                  + RM {fmt((totals.monthlyRecurring ?? 0) + (totals.monthlyRecurringSst ?? 0))}/mo
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => { setOpenSection('details'); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-black text-white text-[11px] font-black uppercase tracking-wider"
            >
              Finish <ArrowRight size={12} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Builder version — internal only, never shown on the client quote */}
        <div className="pt-6 pb-4 text-center">
          <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-gray-400">QuoteStudio {QUOTE_BUILDER_VERSION}</p>
        </div>
      </div>

      {/* Internal SST verification panel — fixed to the right edge */}
      <VerifyPanel totals={totals} open={verifyOpen} onToggle={() => setVerifyOpen(v => !v)} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FIELD HELPER
// ─────────────────────────────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder, type = 'text', prefix }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  prefix?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-gray-600 mb-1.5">{label}</label>
      <div className="flex border-2 border-gray-200 focus-within:border-black">
        {prefix && (
          <span className="px-3 py-2.5 bg-gray-100 text-[13px] font-mono text-gray-600 border-r-2 border-gray-200">{prefix}</span>
        )}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2.5 text-[13px] focus:outline-none"
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FINAL SUMMARY
// ─────────────────────────────────────────────────────────────────────────────
function FinalSummary({ totals }: { totals: Totals }) {
  const hwDisc = totals.hardwareDiscount ?? 0;
  const swDisc = totals.softwareDiscount ?? 0;
  const discountLabel = discountSummaryLabel(hwDisc, swDisc);
  return (
    <div className="bg-gray-50 border-2 border-gray-200 p-4 space-y-1.5">
      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">Quote Summary</div>
      <Row label="Hardware (0% SST)" amount={totals.hardwareSubtotal} />
      {totals.customizationSubtotal > 0 && (
        <Row label="Customization (one-time)" amount={totals.customizationSubtotal} />
      )}
      <Row label="Software & subscriptions (annual)" amount={totals.subscriptionSubtotal} />
      <Row label="Setup & delivery" amount={totals.servicesSubtotal} />
      {/* ONE discount row, with the per-band split inline. Null label = no
          discount at all, so nothing renders and no "−RM 0.00" appears. */}
      {discountLabel && <Row label={discountLabel} amount={-(hwDisc + swDisc)} discount />}
      <div className="border-t border-gray-300 mt-1 pt-1.5">
        <Row label="Subtotal (after discount)" amount={totals.grandTotal - totals.sst} />
      </div>
      <Row label={`SST 8% on RM ${fmt(totals.taxableBase ?? 0)}`} amount={totals.sst} muted />
      {totals.youSave > 0 && (
        <Row label="You save (setup waived)" amount={-totals.youSave} discount />
      )}
      <div className="border-t-2 border-gray-300 mt-2 pt-2 flex items-center justify-between">
        <span className="text-[13px] font-black uppercase text-black">Grand Total</span>
        <span className="text-[20px] font-black text-black">RM {fmt(totals.grandTotal)}</span>
      </div>
      {((totals.monthlyRecurring ?? 0) + (totals.monthlyRecurringSst ?? 0)) > 0 && (
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] font-black uppercase text-gray-600">Then per month</span>
          <span className="text-[14px] font-black" style={{ color: '#1f6b00' }}>
            RM {fmt((totals.monthlyRecurring ?? 0) + (totals.monthlyRecurringSst ?? 0))}/mo
          </span>
        </div>
      )}
    </div>
  );
}

function Row({ label, amount, muted, discount }: { label: string; amount: number; muted?: boolean; discount?: boolean }) {
  return (
    <div className="flex items-center justify-between text-[12px]">
      <span className={muted ? 'text-gray-500' : 'text-gray-700'}>{label}</span>
      <span className={`font-black ${discount ? 'text-green-700' : muted ? 'text-gray-500' : 'text-black'}`}>
        {discount ? '−' : ''}RM {fmt(Math.abs(amount))}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VERIFY PANEL — internal-only SST calculation breakdown, docked to the right
// edge. Shows every line routed to its pool (so e.g. a custom HARDWARE item is
// visibly in the 0%-SST Hardware pool, not Customization) and walks the exact
// per-band SST math from sstMath.ts step by step, then cross-checks the grand
// total. Not shown on the customer quote.
// ─────────────────────────────────────────────────────────────────────────────
const VERIFY_POOLS: VerifyLine['pool'][] = ['Hardware', 'Customization', 'Subscription', 'Services'];
const POOL_NOTE: Record<VerifyLine['pool'], string> = {
  Hardware: '0% SST',
  Customization: 'one-time · 0% / 8%',
  Subscription: 'annual · 0% / 8%',
  Services: 'always 8%',
};

function VerifyPanel({ totals, open, onToggle }: { totals: Totals; open: boolean; onToggle: () => void }) {
  const b = totals.breakdown;
  if (!b) return null;

  // Cross-check: the panel's own walk must reproduce the grand total to the cent.
  const recomputed = b.fullSubtotal - b.discount + b.sst;
  const tiesOut = Math.abs(recomputed - b.grandTotal) < 0.005;

  return (
    <>
      {/* Always-visible toggle tab on the right edge */}
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={open}
        title="Verify SST calculation (internal)"
        className="fixed right-0 top-1/3 z-50 inline-flex items-center gap-1.5 px-2.5 py-3 bg-black text-white text-[10px] font-mono font-bold uppercase tracking-wider rounded-l-md shadow-lg hover:opacity-90"
        style={{ writingMode: 'vertical-rl' }}
      >
        <Calculator size={13} strokeWidth={2.5} /> Verify SST
      </button>

      {open && (
        <div className="fixed right-0 top-0 bottom-0 z-50 w-[360px] max-w-[88vw] bg-white border-l-2 border-black shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b-2 border-black bg-gray-900 text-white">
            <div className="flex items-center gap-2">
              <Calculator size={15} strokeWidth={2.5} />
              <span className="text-[12px] font-black uppercase tracking-wider">SST Verify</span>
              <span className="text-[9px] font-mono text-gray-400">internal</span>
            </div>
            <button type="button" onClick={onToggle} aria-label="Close verify panel" className="text-gray-300 hover:text-white">
              <XIcon size={16} strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 text-[12px]">
            {/* Per-pool line routing */}
            {VERIFY_POOLS.map(pool => {
              const poolLines = b.lines.filter(l => l.pool === pool);
              if (poolLines.length === 0) return null;
              const poolTotal = poolLines.reduce((s, l) => s + l.amount, 0);
              const poolTaxable = poolLines.reduce((s, l) => s + l.taxable, 0);
              return (
                <div key={pool} className="border border-gray-200">
                  <div className="flex items-center justify-between px-2.5 py-1.5 bg-gray-100">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-700">
                      {pool} <span className="text-gray-400 normal-case">· {POOL_NOTE[pool]}</span>
                    </span>
                    <span className="text-[11px] font-black text-black">RM {fmt(poolTotal)}</span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {poolLines.map((l, i) => (
                      <div key={i} className="flex items-center justify-between gap-2 px-2.5 py-1.5">
                        <span className="text-gray-700 truncate">{l.label}</span>
                        <span className="flex items-center gap-2 flex-shrink-0">
                          {l.taxable > 0 ? (
                            <span className="text-[9px] font-mono font-bold uppercase text-amber-700 bg-amber-100 px-1 py-0.5">8% base</span>
                          ) : (
                            <span className="text-[9px] font-mono font-bold uppercase text-gray-500 bg-gray-100 px-1 py-0.5">0%</span>
                          )}
                          <span className="font-black text-black tabular-nums">RM {fmt(l.amount)}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                  {poolTaxable > 0 && poolTaxable !== poolTotal && (
                    <div className="px-2.5 py-1 text-[10px] text-gray-500 bg-gray-50 border-t border-gray-100">
                      taxable portion: RM {fmt(poolTaxable)}
                    </div>
                  )}
                </div>
              );
            })}

            {/* The exact SST math walk (mirrors sstMath.ts) */}
            <div className="border-2 border-black">
              <div className="px-2.5 py-1.5 bg-black text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                SST math · discount per band, tax on what's left
              </div>
              <div className="px-2.5 py-2 space-y-1">
                <VRow label="Full subtotal (all pools)" amount={b.fullSubtotal} />
                <div className="border-t border-gray-200 my-1" />
                <VRow label="0% band — hardware & other 0% lines" amount={b.zeroRatedPool} />
                <VRow label="Discount on hardware" amount={-b.hardwareDiscount} discount muted />
                <VRow label="0% net (no SST)" amount={b.zeroRatedPool - b.hardwareDiscount} />
                <div className="border-t border-gray-200 my-1" />
                <VRow label="8% band — software, custom & services" amount={b.taxablePool} />
                <VRow label="Discount on software / services" amount={-b.softwareDiscount} discount muted />
                <VRow label="Taxable base (8% net)" amount={b.taxableBase} />
                <div className="flex items-center justify-between text-[11px] text-gray-500">
                  <span>SST rate</span>
                  <span className="font-mono">{(b.rate * 100).toFixed(0)}%</span>
                </div>
                <VRow label={`SST = base × ${(b.rate * 100).toFixed(0)}%`} amount={b.sst} />
                <div className="border-t-2 border-black my-1" />
                <VRow label="Total discount" amount={-b.discount} discount />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-gray-600">subtotal − discount + SST</span>
                  <span className="text-[15px] font-black text-black">RM {fmt(b.grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Self cross-check */}
            <div className={`flex items-center gap-2 px-3 py-2 border-2 text-[11px] font-bold ${tiesOut ? 'border-green-600 bg-green-50 text-green-800' : 'border-red-600 bg-red-50 text-red-700'}`}>
              {tiesOut ? <Check size={14} strokeWidth={3} /> : <XIcon size={14} strokeWidth={3} />}
              {tiesOut
                ? `Ties out — RM ${fmt(recomputed)} = grand total`
                : `Mismatch — walk gives RM ${fmt(recomputed)} vs RM ${fmt(b.grandTotal)}`}
            </div>

            <p className="text-[10px] text-gray-400 leading-relaxed">
              Internal tool — not shown on the customer quote. The walk above is the
              single source of truth (sstMath.ts); the saved/shared quote recomputes
              the same way and self-heals old quotes.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function VRow({ label, amount, muted, discount }: { label: string; amount: number; muted?: boolean; discount?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className={`${muted ? 'text-gray-500' : 'text-gray-700'} text-[11px]`}>{label}</span>
      <span className={`font-black tabular-nums ${discount ? 'text-green-700' : 'text-black'}`}>
        {discount ? '−' : ''}RM {fmt(Math.abs(amount))}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Templates bar — server-backed (mirrors QuoteSys's TemplatesBar)
// ─────────────────────────────────────────────────────────────────────────────
function QStudioTemplatesBar({ templates, canSave, onSave, onLoad, onDelete }: {
  templates: Template[];
  canSave: boolean;
  onSave: (name: string) => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const handleSave = () => {
    if (!canSave) return;
    const name = window.prompt('Template name:', '');
    if (!name || !name.trim()) return;
    onSave(name);
  };
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete template “${name}”?`)) onDelete(id);
  };
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleSave}
        disabled={!canSave}
        title={canSave ? 'Save current selection as template' : 'Add at least one item first'}
        className="inline-flex items-center gap-1.5 border-2 border-gray-300 hover:border-black disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 hover:text-black text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1.5 transition-colors bg-white"
      >
        <Save size={11} strokeWidth={2.5} /> Save Template
      </button>
      {templates.length > 0 && (
        <select
          defaultValue=""
          onChange={e => { if (e.target.value === '__none') return; if (e.target.value) { onLoad(e.target.value); e.currentTarget.value = ''; } }}
          className="bg-white border-2 border-gray-300 hover:border-black focus:border-black focus:outline-none text-gray-700 text-[10px] font-mono uppercase tracking-wider px-2 py-1.5"
        >
          <option value="">Load template…</option>
          {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      )}
      {templates.length > 0 && (
        <div className="hidden md:flex items-center gap-1 flex-wrap">
          {templates.slice(0, 4).map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleDelete(t.id, t.name)}
              aria-label={`Delete template ${t.name}`}
              title={`Delete: ${t.name}`}
              className="text-gray-400 hover:text-red-600 text-[10px] font-mono uppercase tracking-wider px-1 py-1"
            >
              <Trash2 size={10} strokeWidth={2.5} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Companies bar — server-backed contact directory
// ─────────────────────────────────────────────────────────────────────────────
function QStudioCompaniesBar({ companies, currentName, onLoad, onSave, onDelete }: {
  companies: ServerCompany[];
  currentName: string;
  onLoad: (id: string) => void;
  onSave: () => void;
  onDelete: (id: string) => void;
}) {
  const matched = currentName.trim()
    ? companies.find(c => c.companyName.toLowerCase() === currentName.trim().toLowerCase())
    : null;
  return (
    <div className="flex flex-wrap items-center gap-2 ml-auto">
      <button
        type="button"
        onClick={onSave}
        disabled={!currentName.trim()}
        className="inline-flex items-center gap-1.5 border-2 border-gray-300 hover:border-black disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 hover:text-black text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1.5 transition-colors bg-white"
      >
        <Save size={11} strokeWidth={2.5} /> Save Company
      </button>
      {companies.length > 0 && (
        <div className="inline-flex items-center gap-1.5">
          <Users size={11} strokeWidth={2.5} className="text-gray-500" />
          <select
            defaultValue=""
            onChange={e => { if (e.target.value) { onLoad(e.target.value); e.currentTarget.value = ''; } }}
            className="bg-white border-2 border-gray-300 hover:border-black focus:border-black focus:outline-none text-gray-700 text-[10px] font-mono uppercase tracking-wider px-2 py-1.5"
          >
            <option value="">Load company…</option>
            {companies.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
          </select>
        </div>
      )}
      {matched && (
        <button
          type="button"
          onClick={() => { if (window.confirm(`Forget “${matched.companyName}”?`)) onDelete(matched.id); }}
          aria-label="Delete saved company"
          className="text-gray-400 hover:text-red-600 inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-1.5"
        >
          <Trash2 size={11} strokeWidth={2.5} /> Forget
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom items section — mirrors QuoteSys's CustomItemForm
// ─────────────────────────────────────────────────────────────────────────────
type StudioCustomItemFormData = { title: string; description?: string; price: number; qty: number; sst: StudioSst; type: StudioItemType };

function QStudioCustomItemsSection({ category, title, subtitle, items, lineDiscounts, onAdd, onUpdate, onRemove, onQty, onMove, onLineDiscount }: {
  category: StudioItemCategory;
  title: string;
  subtitle: string;
  items: StudioCustomItem[];
  lineDiscounts: LineDiscounts;
  onAdd: (data: StudioCustomItemFormData & { category: StudioItemCategory }) => void;
  onUpdate: (id: string, data: StudioCustomItemFormData & { category: StudioItemCategory }) => void;
  onRemove: (id: string) => void;
  onQty: (id: string, n: number) => void;
  onMove: (id: string, dir: -1 | 1) => void;
  onLineDiscount: (id: string, next: LineDiscount | null) => void;
}) {
  const sectionItems = items.filter(it => normalizeStudioCategory(it.category) === category);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  return (
    <div className="border-2 border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3 gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-600">{title}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">{subtitle}</div>
        </div>
        {!open && (
          <button type="button" onClick={() => { setEditingId(null); setOpen(true); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-[10px] font-black uppercase tracking-wider hover:opacity-90 flex-shrink-0">
            <Plus size={11} strokeWidth={3} /> Add Item
          </button>
        )}
      </div>

      {sectionItems.length > 0 && (
        <ul className="mb-3 divide-y divide-gray-100 border border-gray-200">
          {sectionItems.map((it, idx) => {
            const gross = it.type === 'monthly-billed-annually' ? it.price * 12 * it.qty : it.price * it.qty;
            const isEditing = editingId === it.id;
            return (
              <li key={it.id} className={`px-3 py-2 ${isEditing ? 'bg-gray-50' : ''}`}>
                <div className="flex items-center gap-2.5">
                  {/* #number + up/down reorder */}
                  <div className="flex flex-col items-center flex-shrink-0 w-6">
                    <button type="button" onClick={() => onMove(it.id, -1)} disabled={idx === 0} aria-label="Move up" className="text-gray-300 hover:text-black disabled:opacity-20 disabled:cursor-not-allowed leading-none"><ChevronUp size={13} strokeWidth={3} /></button>
                    <span className="text-[10px] font-mono font-black text-gray-400 leading-none my-0.5">#{idx + 1}</span>
                    <button type="button" onClick={() => onMove(it.id, 1)} disabled={idx === sectionItems.length - 1} aria-label="Move down" className="text-gray-300 hover:text-black disabled:opacity-20 disabled:cursor-not-allowed leading-none"><ChevronDown size={13} strokeWidth={3} /></button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-black text-black truncate">{it.title}</div>
                    <div className="text-[10px] text-gray-500 font-mono">
                      RM {fmt(it.price)} · {it.sst === 0.08 ? '8% SST' : '0% SST'} · {it.type === 'one-time' ? 'One-time' : it.type === 'flat-annual' ? 'Annual' : 'Monthly (×12)'}
                    </div>
                    {it.description && <div className="text-[10px] text-gray-600 mt-0.5 whitespace-pre-line line-clamp-2">{it.description}</div>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => onQty(it.id, Math.max(0, it.qty - 1))} className="w-6 h-6 border border-gray-200 hover:border-black flex items-center justify-center" aria-label="Decrease"><Minus size={10} strokeWidth={2.5} /></button>
                    <span className="w-7 text-center text-[12px] font-mono font-black">{it.qty}</span>
                    <button type="button" onClick={() => onQty(it.id, it.qty + 1)} className="w-6 h-6 border border-gray-200 hover:border-black flex items-center justify-center" aria-label="Increase"><Plus size={10} strokeWidth={2.5} /></button>
                  </div>
                  <button type="button" onClick={() => { setOpen(false); setEditingId(isEditing ? null : it.id); }} aria-label={isEditing ? 'Close editor' : 'Edit'} className={isEditing ? 'text-black' : 'text-gray-400 hover:text-black'}><Pencil size={12} strokeWidth={2.5} /></button>
                  <button type="button" onClick={() => { if (window.confirm(`Remove “${it.title}” from the shared custom-item pool?`)) onRemove(it.id); }} aria-label="Remove" className="text-gray-400 hover:text-red-600"><XIcon size={12} strokeWidth={2.5} /></button>
                </div>
                {it.qty > 0 && !isEditing && (
                  <LineDiscountField
                    itemId={it.id}
                    gross={gross}
                    current={lineDiscounts[it.id]}
                    onChange={onLineDiscount}
                  />
                )}
                {/* Inline editor — expands right here, no scrolling */}
                {isEditing && (
                  <div className="mt-2">
                    <CustomItemForm
                      category={category}
                      editing={it}
                      onSubmit={(data) => { onUpdate(it.id, { ...data, category }); setEditingId(null); }}
                      onCancel={() => setEditingId(null)}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Add-new form (editing happens inline within each row above) */}
      {open && (
        <CustomItemForm
          category={category}
          editing={null}
          onSubmit={(data) => { onAdd({ ...data, category }); setOpen(false); }}
          onCancel={() => setOpen(false)}
        />
      )}
    </div>
  );
}

// Grow a textarea to fit its content. Used as a ref callback (fires on mount, so
// a pre-filled description expands to show everything) and from onChange (grows
// live as you type) — no manual dragging needed.
function autoSizeTextarea(el: HTMLTextAreaElement | null) {
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = `${el.scrollHeight}px`;
}

function CustomItemForm({ category, editing, onSubmit, onCancel }: {
  category: StudioItemCategory;
  editing: StudioCustomItem | null | undefined;
  onSubmit: (data: StudioCustomItemFormData) => void;
  onCancel: () => void;
}) {
  const catDef = STUDIO_ITEM_CATEGORIES.find(c => c.id === category);
  const [title, setTitle] = useState(editing?.title ?? '');
  const [description, setDescription] = useState(editing?.description ?? '');
  const [price, setPrice] = useState(editing ? String(editing.price) : '');
  const [qty, setQty] = useState(editing ? String(editing.qty) : '1');
  const [sst, setSst] = useState<StudioSst>(editing?.sst ?? catDef?.defaultSst ?? 0.08);
  const [type, setType] = useState<StudioItemType>(editing?.type ?? catDef?.defaultType ?? 'one-time');

  const priceNum = parseFloat(price);
  const qtyNum = parseInt(qty, 10);
  const canSubmit = title.trim().length > 0 && !isNaN(priceNum) && priceNum >= 0 && !isNaN(qtyNum) && qtyNum > 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ title: title.trim(), description: description.trim() || undefined, price: priceNum, qty: qtyNum, sst, type });
  };

  return (
    <form onSubmit={submit} className="border-2 border-black p-3 bg-gray-50">
      {editing && <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-black mb-2">Editing custom item</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="block">
          <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-600 mb-1">Title *</span>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. On-site staff training" className="w-full border-2 border-gray-200 focus:border-black focus:outline-none text-[12px] px-2 py-2" />
        </label>
        <label className="block">
          <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-600 mb-1">Description (optional)</span>
          <textarea ref={autoSizeTextarea} value={description} onChange={e => { setDescription(e.target.value); autoSizeTextarea(e.target); }} rows={2} placeholder="Shown under the line on the PDF" className="w-full border-2 border-gray-200 focus:border-black focus:outline-none text-[12px] px-2 py-2 resize-none overflow-hidden min-h-[3.25rem]" />
        </label>
        <label className="block">
          <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-600 mb-1">Unit Price (RM) *</span>
          <input type="number" inputMode="decimal" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-full border-2 border-gray-200 focus:border-black focus:outline-none text-[12px] px-2 py-2" />
        </label>
        <label className="block">
          <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-600 mb-1">Qty *</span>
          <input type="number" inputMode="numeric" min="1" step="1" value={qty} onChange={e => setQty(e.target.value)} className="w-full border-2 border-gray-200 focus:border-black focus:outline-none text-[12px] px-2 py-2" />
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-600 mb-1">Tax Rate</div>
          <div className="flex gap-2">
            {([0, 0.08] as StudioSst[]).map(r => (
              <button key={r} type="button" onClick={() => setSst(r)} className={`flex-1 border-2 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider ${sst === r ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-700 hover:border-gray-400'}`}>
                {r === 0 ? '0% SST' : '8% SST'}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-600 mb-1">Billing</div>
          <div className="flex gap-2">
            {(['one-time', 'flat-annual', 'monthly-billed-annually'] as StudioItemType[]).map(t => (
              <button key={t} type="button" onClick={() => setType(t)} className={`flex-1 border-2 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider ${type === t ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-700 hover:border-gray-400'}`}>
                {t === 'one-time' ? 'One-Time' : t === 'flat-annual' ? 'Annual' : 'Monthly×12'}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button type="submit" disabled={!canSubmit} className="flex-1 px-4 py-2 bg-black text-white text-[11px] font-black uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90">
          {editing ? 'Save Changes' : 'Add Custom Item'}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border-2 border-gray-200 hover:border-gray-400 text-gray-700 text-[11px] font-bold uppercase tracking-wider">Cancel</button>
      </div>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-line description overrides
// ─────────────────────────────────────────────────────────────────────────────
function QStudioDescriptionsSection({ qty, customItems, descriptions, onSetDescription }: {
  qty: Record<string, number>;
  customItems: StudioCustomItem[];
  descriptions: Record<string, string>;
  onSetDescription: (id: string, value: string) => void;
}) {
  const lines: { id: string; title: string; defaultDesc?: string }[] = [];
  for (const item of [...ENTRY_GATES, ...POS_ITEMS, ...OTHER_HARDWARE, ...ADDITIONAL_OUTLET_ITEMS]) {
    if (qty[item.id] !== undefined) lines.push({ id: item.id, title: item.title, defaultDesc: item.description });
  }
  for (const ci of customItems) {
    if (ci.qty > 0) lines.push({ id: ci.id, title: ci.title, defaultDesc: ci.description });
  }
  if (lines.length === 0) {
    return (
      <div className="p-3 border-2 border-dashed border-gray-200 text-[11px] text-gray-500 italic">
        Pick items first — you'll be able to set per-line descriptions here that appear on the PDF.
      </div>
    );
  }
  return (
    <div>
      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-600 mb-2">
        Per-line Descriptions <span className="text-gray-400 ml-1">· override what shows under each item on the PDF</span>
      </div>
      <div className="space-y-2">
        {lines.map(l => (
          <div key={l.id} className="border border-gray-200 p-2">
            <div className="text-[11px] font-black text-black mb-1">{l.title}</div>
            <textarea
              value={descriptions[l.id] ?? l.defaultDesc ?? ''}
              onChange={e => onSetDescription(l.id, e.target.value)}
              rows={2}
              placeholder="Description shown on the PDF…"
              className="w-full border border-gray-200 focus:border-black focus:outline-none text-[11px] px-2 py-1.5 resize-y"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Discount section with custom text field
// ─────────────────────────────────────────────────────────────────────────────
// One discount input, bound to a single SST band. The % is a % OF THAT BAND.
function BandDiscountField({ label, note, pool, discount, applied, onChange }: {
  label: string;
  note: string;
  pool: number;                       // the band's pre-discount subtotal
  discount: DiscountInput;
  applied: number;                    // resolved RM, already clamped to `pool`
  onChange: (d: DiscountInput) => void;
}) {
  const { mode, value } = discount;
  const [draft, setDraft] = useState<string>(value ? String(value) : '');
  useEffect(() => { setDraft(value ? String(value) : ''); }, [value]);
  const exceeds = mode === 'pct' ? value > 100 : value > pool && pool > 0;
  return (
    <div className="border border-gray-200 p-3">
      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-700">
        {label}
      </div>
      <div className="text-[10px] text-gray-400 mb-2">{note}</div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex border-2 border-gray-200">
          {(['rm', 'pct'] as const).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => onChange({ mode: m, value })}
              className={`px-3 py-2 text-[11px] font-mono font-bold uppercase tracking-wider ${mode === m ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {m === 'rm' ? 'RM' : '%'}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[140px]">
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step={mode === 'pct' ? '0.5' : '1'}
            value={draft}
            onChange={e => {
              setDraft(e.target.value);
              const n = parseFloat(e.target.value);
              onChange({ mode, value: Number.isFinite(n) && n > 0 ? n : 0 });
            }}
            placeholder={mode === 'pct' ? 'e.g. 10' : 'e.g. 500'}
            className="w-full border-2 border-gray-200 focus:border-black focus:outline-none text-[13px] px-3 py-2 pr-10"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[11px] font-mono pointer-events-none">
            {mode === 'pct' ? '%' : 'RM'}
          </span>
        </div>
        {value > 0 && (
          <button type="button" onClick={() => { onChange({ mode, value: 0 }); setDraft(''); }} className="inline-flex items-center gap-1 border-2 border-gray-200 hover:border-gray-400 text-gray-600 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1.5">
            <XIcon size={11} strokeWidth={2.5} /> Clear
          </button>
        )}
      </div>
      <div className="flex items-baseline justify-between gap-3 text-[11px] mt-2 pt-2 border-t border-gray-100 font-mono">
        <span className="text-gray-500">Subtotal: <span className="text-black">RM {fmt(pool)}</span></span>
        <span>−<strong className="text-green-700">RM {fmt(applied)}</strong> → <strong className="text-black">RM {fmt(pool - applied)}</strong></span>
      </div>
      {exceeds && (
        <p className="text-red-600 text-[11px] italic mt-2">
          Exceeds this band's subtotal — capped at {mode === 'pct' ? '100%' : `RM ${fmt(pool)}`}.
        </p>
      )}
      {pool <= 0 && value > 0 && (
        <p className="text-gray-500 text-[11px] italic mt-2">Nothing in this band yet — the discount won't apply until you add a line to it.</p>
      )}
    </div>
  );
}

// Discount, split per SST band. A single figure can never be attributed across
// a quote that mixes 0% hardware with 8% software, so each band is discounted
// on its own and SST is charged on what's left of the 8% band only.
function QStudioDiscountSection({
  hardware, software, setHardware, setSoftware, text, setText,
  zeroRatedPool, taxablePool, hardwareDiscount, softwareDiscount, sst,
}: {
  hardware: DiscountInput;
  software: DiscountInput;
  setHardware: (d: DiscountInput) => void;
  setSoftware: (d: DiscountInput) => void;
  text: string;
  setText: (s: string) => void;
  zeroRatedPool: number;
  taxablePool: number;
  hardwareDiscount: number;
  softwareDiscount: number;
  sst: number;
}) {
  const netZero = zeroRatedPool - hardwareDiscount;
  const netTaxable = taxablePool - softwareDiscount;
  const total = hardwareDiscount + softwareDiscount;
  return (
    <div className="border-2 border-gray-200 p-4">
      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-600 mb-3">
        Discount <span className="text-gray-400 ml-1">· entered per SST band so the tax lands right</span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <BandDiscountField
          label="Discount on Hardware (0%)"
          note="Hardware & anything else rated 0% SST"
          pool={zeroRatedPool}
          discount={hardware}
          applied={hardwareDiscount}
          onChange={setHardware}
        />
        <BandDiscountField
          label="Discount on Software / Services (8%)"
          note="Subscriptions, customization, setup, gateway & delivery"
          pool={taxablePool}
          discount={software}
          applied={softwareDiscount}
          onChange={setSoftware}
        />
      </div>

      <label className="block mt-3 mb-2">
        <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">Discount label (optional — shown on PDF)</span>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="e.g. New Year promo · Loyalty rebate · Volume discount"
          className="w-full border-2 border-gray-200 focus:border-black focus:outline-none text-[12px] px-3 py-2"
        />
      </label>

      {/* The arithmetic, spelled out — this is what the customer's quote will
          show. Hidden entirely until there's a discount: with nothing entered
          it only restates the subtotals already shown in the fields above. */}
      {total > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-1 text-[11px] font-mono">
          {hardwareDiscount > 0 && (
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-gray-500">Hardware after discount × 0%</span>
              <span className="text-black">RM {fmt(netZero)}</span>
            </div>
          )}
          {softwareDiscount > 0 && (
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-gray-500">Software / services after discount × 8%</span>
              <span className="text-black">RM {fmt(netTaxable)} + RM {fmt(sst)} = RM {fmt(netTaxable + sst)}</span>
            </div>
          )}
          <div className="flex items-baseline justify-between gap-3 pt-1 border-t border-gray-100">
            <span className="text-gray-600 font-bold">Total discount</span>
            <strong className="text-green-700">−RM {fmt(total)}</strong>
          </div>
        </div>
      )}
    </div>
  );
}

