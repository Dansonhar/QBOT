import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, Printer, Gift, CheckCircle2, Pencil, X as XIcon, Star } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import QuoteStudioTimeline from '../components/QuoteStudioTimeline';
import { supabase } from '../lib/supabase';
import { computeQuoteMoney, discountSummaryLabel, type DiscountInput } from '../lib/sstMath';
import {
  ENTRY_GATES, POS_ITEMS, OTHER_HARDWARE, SETUP_AND_TRAINING, PAYMENT_GATEWAY_REGISTRATION,
  ADDITIONAL_OUTLET_ITEMS,
  findTier, findDelivery, SETUP_WAIVER_AMOUNT, normalizeStudioCategory,
  SOFTWARE_TIERS, QUOTE_SOFTWARE_TIERS, FEATURE_GROUPS, LEGACY_FEATURE_GROUPS, CATALOG_VERSION, isCellIncluded,
  CUSTOM_PACKAGE_ID,
  type StudioSst, type StudioItemType, type TierLevel, type CellValue,
  type StudioCustomPackage, type StudioTier, type FeatureGroup,
} from '../data/quoteStudioCatalog';

const LIME = '#CCFF00';
const SALES_WA = '60126909189';
const VALIDITY_DAYS = 14;
const SUBMITTED_SLUG_KEY = 'qstudio_submitted_slug';   // matches builder

const fmt = (n: number) => n.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const dateLabel = (d: Date) => d.toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' });

interface StudioCustomItem {
  id: string;
  title: string;
  description?: string;
  price: number;
  sst: StudioSst;
  type: StudioItemType;
  qty: number;
  category?: 'hardware' | 'software' | 'custom';
}

interface Selections {
  qty: Record<string, number>;
  softwareTier: string | null;
  deliveryZone: string | null;
  includeSetup: boolean;
  waiveSetup: boolean;
  customNotes: string;
  startDateISO?: string | null;
  // ── New fields ──
  foc?: string;
  paymentTerms?: string;
  /** LEGACY single master discount — replayed pro-rata when no band fields exist. */
  discountMode?: 'rm' | 'pct';
  discountValue?: number;
  discountText?: string;
  // ── Per-band discount (2026-08-04) — presence of either selects the split model ──
  discountHardware?: DiscountInput;   // off the 0%-SST band
  discountSoftware?: DiscountInput;   // off the 8%-SST band
  customItems?: StudioCustomItem[];
  descriptions?: Record<string, string>;
  additionalOutletPrices?: Record<string, number>;
  lineDiscounts?: Record<string, { mode: 'rm' | 'pct'; value: number }>;
  timelineEnabled?: boolean;
  projectTitle?: string;
  includePaymentGateway?: boolean;
  // ── New fields (2026-06-04) ──
  hideComparison?: boolean;
  customPackage?: StudioCustomPackage;
  itemPrices?: Record<string, number>;
  // ── Catalog version (2026-06-18) — absent/<2 → render legacy 5-tier matrix ──
  catalogVersion?: number;
}

// Resolve a per-line discount to an RM amount clamped to gross.
function resolveLineDiscount(gross: number, d: { mode: 'rm' | 'pct'; value: number } | undefined): number {
  if (!d || !d.value || d.value <= 0) return 0;
  const raw = d.mode === 'pct' ? gross * (d.value / 100) : d.value;
  return Math.max(0, Math.min(gross, Number.isFinite(raw) ? raw : 0));
}

interface Totals {
  hardwareSubtotal: number;
  customizationSubtotal?: number;
  subscriptionSubtotal: number;
  servicesSubtotal: number;
  sst: number;
  grandTotal: number;
  youSave: number;
  discount?: number;
  taxableBase?: number;
  monthlyRecurring?: number;
  monthlyRecurringSst?: number;
}

interface QuoteRow {
  public_id: string;
  seq_no: number | null;
  contact_name: string;
  contact_phone: string;
  contact_email: string | null;
  business_name: string | null;
  delivery_address: string | null;
  selections: Selections;
  totals: Totals;
  created_at: string;
}

export default function QuoteStudioViewPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<QuoteRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Edit button is only shown if THIS browser session submitted this exact quote.
  const canEdit = (() => {
    try { return slug && sessionStorage.getItem(SUBMITTED_SLUG_KEY) === slug; }
    catch { return false; }
  })();

  useEffect(() => {
    if (!slug) { setNotFound(true); setLoading(false); return; }
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('quotestudio_requests')
          .select('public_id, seq_no, contact_name, contact_phone, contact_email, business_name, delivery_address, selections, totals, created_at')
          .eq('public_id', slug)
          .single();
        if (cancelled) return;
        if (error || !data) { setNotFound(true); }
        else { setQuote(data as QuoteRow); }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  const issueDate = useMemo(() => quote ? new Date(quote.created_at) : new Date(), [quote]);
  const validUntil = useMemo(() => {
    const d = new Date(issueDate);
    d.setDate(d.getDate() + VALIDITY_DAYS);
    return d;
  }, [issueDate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-[12px] font-mono uppercase tracking-wider text-gray-500">Loading quote…</div>
      </div>
    );
  }

  if (notFound || !quote) {
    return (
      <>
        <SEOHead title="Quote not found" noindex />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-5">
          <div className="w-full max-w-md bg-white border-2 border-black p-7 text-center">
            <div className="text-[36px] mb-4">🔍</div>
            <h1 className="text-[20px] font-black uppercase tracking-tight mb-2">Quote Not Found</h1>
            <p className="text-[13px] text-gray-600 leading-relaxed mb-5">
              This quote link may have expired, or the URL is incorrect.
              Please check with your Q Studio consultant.
            </p>
            <a
              href={`https://wa.me/${SALES_WA}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-black text-white text-[12px] font-black uppercase tracking-wider hover:opacity-90"
            >
              <MessageCircle size={14} strokeWidth={2.5} /> Talk to Sales
            </a>
          </div>
        </div>
      </>
    );
  }

  // ── Resolve selected line items ─────────────────────────────────────────
  const descriptions = quote.selections.descriptions ?? {};
  const outletPrices = quote.selections.additionalOutletPrices ?? {};
  const itemPrices = quote.selections.itemPrices ?? {};
  const lineDiscs = quote.selections.lineDiscounts ?? {};
  const effPrice = (id: string, fallback: number) => itemPrices[id] !== undefined ? itemPrices[id] : fallback;
  const pkg = quote.selections.customPackage;

  // Presence in the qty map = on the quote. Qty 0 is a valid state: the line
  // shows the item + unit price but charges nothing (total RM 0, no SST).
  const hardwareLines = [...ENTRY_GATES, ...POS_ITEMS, ...OTHER_HARDWARE]
    .filter(item => quote.selections.qty[item.id] !== undefined && item.type === 'one-time')
    .map(item => {
      const q = quote.selections.qty[item.id] ?? 0;
      const unit = effPrice(item.id, item.price);
      const gross = unit * q;
      const ld = lineDiscs[item.id];
      const lineDiscount = resolveLineDiscount(gross, ld);
      const subtotal = gross - lineDiscount;
      return { item: { ...item, price: unit }, qty: q, gross, lineDiscount, ldConfig: ld, subtotal, sst: 0, total: subtotal };
    });

  // One-time custom items. HARDWARE-category items belong in the 0%-SST hardware
  // table — only non-hardware one-time items render under "Customization" (and
  // feed the taxable base). Mirrors the builder (see QuoteStudioPage totals).
  const allCustomOneTimeLines = (quote.selections.customItems ?? [])
    .filter(ci => ci.qty > 0 && ci.type === 'one-time')
    .map(ci => {
      const gross = ci.price * ci.qty;
      const ld = lineDiscs[ci.id];
      const lineDiscount = resolveLineDiscount(gross, ld);
      const subtotal = gross - lineDiscount;
      const isHardware = normalizeStudioCategory(ci.category) === 'hardware';
      // Hardware is always 0% SST regardless of any stored sst flag.
      const sst = isHardware ? 0 : subtotal * (ci.sst ?? 0);
      return { ci, qty: ci.qty, gross, lineDiscount, ldConfig: ld, subtotal, sst, total: subtotal + sst, isHardware };
    });
  const customHardwareOneTimeLines = allCustomOneTimeLines.filter(l => l.isHardware);
  const customOneTimeLines = allCustomOneTimeLines.filter(l => !l.isHardware);

  // Custom package — one-time → its own line in the customization table
  const pkgOneTimeLine = (pkg?.enabled && pkg.price > 0 && pkg.cadence === 'one-time') ? (() => {
    const gross = pkg.price;
    const ld = lineDiscs[CUSTOM_PACKAGE_ID];
    const lineDiscount = resolveLineDiscount(gross, ld);
    const subtotal = gross - lineDiscount;
    const sst = pkg.taxed ? subtotal * 0.08 : 0;
    return { gross, lineDiscount, ldConfig: ld, subtotal, sst, total: subtotal + sst };
  })() : null;

  // Customization subtotal (gross) — for legacy quotes saved before
  // customizationSubtotal was split out of hardwareSubtotal, derive it from
  // the line items so the totals row still shows the right number.
  //
  // MUST include the one-time Custom Package: it renders as a line in the
  // Customization table and its money is in the grand total, so leaving it out
  // made the subtotal row understate — and vanish entirely on a quote whose
  // only customization IS the package. These two consts are the single source
  // for both the summary row and computeQuoteMoney below, so they can't drift.
  const customizationSubtotal =
    customOneTimeLines.reduce((s, l) => s + l.subtotal, 0)
    + (pkgOneTimeLine?.subtotal ?? 0);
  const customizationSstable =
    customOneTimeLines.reduce((s, l) => s + (l.sst > 0 ? l.subtotal : 0), 0)
    + (pkgOneTimeLine && pkgOneTimeLine.sst > 0 ? pkgOneTimeLine.subtotal : 0);
  // Hardware row = catalog hardware + custom hardware-category items, recomputed
  // from the saved selections (self-healing for legacy snapshots).
  const hardwareSubtotalOnly = hardwareLines.reduce((s, l) => s + l.subtotal, 0)
    + customHardwareOneTimeLines.reduce((s, l) => s + l.subtotal, 0);

  // Each line carries its real qty + annual UNIT price so the table renders
  // "qty × unit = total" (previously qty was hardcoded to 1 with unit = gross,
  // which hid multi-unit lines like 3× Additional Device).
  const subscriptionLines: {
    qty: number;
    unit: number;          // annual price PER UNIT
    gross: number;
    lineDiscount: number;
    ldConfig?: { mode: 'rm' | 'pct'; value: number };
    subtotal: number;
    sst: number;
    total: number;
    label: string;
    subtitle?: string;
    id: string;
  }[] = [];
  for (const item of [...ENTRY_GATES, ...POS_ITEMS, ...OTHER_HARDWARE]) {
    if (item.type !== 'flat-annual') continue;
    const q = quote.selections.qty[item.id];
    if (q === undefined) continue;
    const unit = effPrice(item.id, item.price);
    const gross = unit * q;
    const ld = lineDiscs[item.id];
    const lineDiscount = resolveLineDiscount(gross, ld);
    const subtotal = gross - lineDiscount;
    const sst = subtotal * (item.sst ?? 0);
    subscriptionLines.push({ qty: q, unit, gross, lineDiscount, ldConfig: ld, subtotal, sst, total: subtotal + sst, label: `${item.title} · 1 year`, subtitle: descriptions[item.id] ?? item.subtitle, id: item.id });
  }
  // Additional outlets / devices — use the per-quote price override if set
  for (const item of ADDITIONAL_OUTLET_ITEMS) {
    const q = quote.selections.qty[item.id];
    if (q === undefined) continue;
    const unit = outletPrices[item.id] ?? item.price;
    const gross = unit * q;
    const ld = lineDiscs[item.id];
    const lineDiscount = resolveLineDiscount(gross, ld);
    const subtotal = gross - lineDiscount;
    const sst = subtotal * (item.sst ?? 0);
    subscriptionLines.push({ qty: q, unit, gross, lineDiscount, ldConfig: ld, subtotal, sst, total: subtotal + sst, label: `${item.title} · 1 year`, subtitle: descriptions[item.id], id: item.id });
  }
  const tier = findTier(quote.selections.softwareTier);
  if (tier && !tier.isCustom) {
    const monthly = effPrice(tier.id, tier.monthly);
    const gross = monthly * 12;
    const ld = lineDiscs[tier.id];
    const lineDiscount = resolveLineDiscount(gross, ld);
    const subtotal = gross - lineDiscount;
    const sst = subtotal * 0.08;
    subscriptionLines.push({ qty: 1, unit: gross, gross, lineDiscount, ldConfig: ld, subtotal, sst, total: subtotal + sst, label: `${tier.title} · RM${fmt(monthly)}/mo × 12 (annual)`, subtitle: descriptions[tier.id], id: tier.id });
  }
  // Custom recurring items
  for (const ci of (quote.selections.customItems ?? [])) {
    if (ci.qty <= 0) continue;
    if (ci.type === 'one-time') continue;
    const unit = ci.type === 'monthly-billed-annually' ? ci.price * 12 : ci.price;
    const gross = unit * ci.qty;
    const ld = lineDiscs[ci.id];
    const lineDiscount = resolveLineDiscount(gross, ld);
    const subtotal = gross - lineDiscount;
    const sst = subtotal * (ci.sst ?? 0);
    subscriptionLines.push({
      qty: ci.qty, unit, gross, lineDiscount, ldConfig: ld, subtotal, sst, total: subtotal + sst,
      label: `${ci.title} · ${ci.type === 'monthly-billed-annually' ? `RM${ci.price}/mo × 12` : `RM${fmt(ci.price)}/yr`}`,
      subtitle: descriptions[ci.id] ?? ci.description,
      id: ci.id,
    });
  }
  // Custom package — annual cadence rides with the other annual subscriptions
  if (pkg?.enabled && pkg.price > 0 && pkg.cadence === 'annual') {
    const gross = pkg.price;
    const ld = lineDiscs[CUSTOM_PACKAGE_ID];
    const lineDiscount = resolveLineDiscount(gross, ld);
    const subtotal = gross - lineDiscount;
    const sst = pkg.taxed ? subtotal * 0.08 : 0;
    subscriptionLines.push({
      qty: 1, unit: gross, gross, lineDiscount, ldConfig: ld, subtotal, sst, total: subtotal + sst,
      label: `${pkg.title || 'Custom Package'} · RM${fmt(pkg.price)}/yr`,
      subtitle: descriptions[CUSTOM_PACKAGE_ID] ?? pkg.description,
      id: CUSTOM_PACKAGE_ID,
    });
  }

  // Custom package — monthly cadence is a STANDALONE recurring charge (not in grand total)
  const pkgMonthly = (pkg?.enabled && pkg.price > 0 && pkg.cadence === 'monthly') ? {
    base: pkg.price,
    sst: pkg.taxed ? pkg.price * 0.08 : 0,
    taxed: pkg.taxed,
    title: pkg.title || 'Custom Package',
    description: pkg.description,
  } : null;

  const setupIncluded = quote.selections.includeSetup && !quote.selections.waiveSetup;
  const paymentGatewayIncluded = !!quote.selections.includePaymentGateway;
  const delivery = findDelivery(quote.selections.deliveryZone);

  // ── Authoritative money — RECOMPUTED from the saved selections, not read
  // from the frozen quote.totals snapshot. Quotes saved before the SST-after-
  // discount fix had wrong totals baked in; recomputing here makes them
  // self-heal, and guarantees the view matches the builder (same shared
  // computeQuoteMoney — src/lib/sstMath.ts).
  //
  // Discount: quotes built since 2026-08-04 carry one figure PER SST BAND
  // (`discountHardware` / `discountSoftware`). Older quotes carry a single
  // master discount and keep replaying through the legacy pro-rata path, so a
  // link already sent to a customer never changes its numbers.
  const bandDiscounts: { hardwareDiscount?: DiscountInput; softwareDiscount?: DiscountInput } =
    (quote.selections.discountHardware || quote.selections.discountSoftware)
      ? { hardwareDiscount: quote.selections.discountHardware, softwareDiscount: quote.selections.discountSoftware }
      : {};
  const subscriptionSubtotalCalc = subscriptionLines.reduce((s, l) => s + l.subtotal, 0);
  const svcSub = (id: string, included: boolean, base: number) =>
    included ? (effPrice(id, base) - resolveLineDiscount(effPrice(id, base), lineDiscs[id])) : 0;
  const servicesSubtotalCalc =
    svcSub(SETUP_AND_TRAINING.id, setupIncluded, SETUP_AND_TRAINING.price)
    + svcSub(PAYMENT_GATEWAY_REGISTRATION.id, paymentGatewayIncluded, PAYMENT_GATEWAY_REGISTRATION.price)
    + (delivery ? svcSub(delivery.id, true, delivery.price) : 0);
  // Every input here is the SAME const the matching summary row prints, so the
  // four rows always add up to the subtotal the grand total was built from.
  const money = computeQuoteMoney({
    hardwareSubtotal: hardwareSubtotalOnly,
    customOneTime: customizationSubtotal,
    customSstableOneTime: customizationSstable,
    subscriptionSubtotal: subscriptionSubtotalCalc,
    sstableSubscription: subscriptionLines.reduce((s, l) => s + (l.sst > 0 ? l.subtotal : 0), 0),
    servicesSubtotal: servicesSubtotalCalc,
    ...bandDiscounts,
    discountMode: quote.selections.discountMode ?? 'rm',
    discountValue: quote.selections.discountValue ?? 0,
  });

  const discountLabel = discountSummaryLabel(money.hardwareDiscount, money.softwareDiscount);

  // Ref format: QS-YYMMDD-0001 (date = quote's issue date, counter keeps
  // running across days). Old rows without seq_no fall back to public_id.
  const refDate = (() => {
    const d = new Date(quote.created_at);
    const yy = String(d.getFullYear()).slice(-2);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yy}${mm}${dd}`;
  })();
  const quoteRefDisplay = quote.seq_no
    ? `QS-${refDate}-${String(quote.seq_no).padStart(4, '0')}`
    : `QS-${quote.public_id.toUpperCase()}`;

  // ── Render printable A4 sheet ───────────────────────────────────────────
  return (
    <>
      <SEOHead title={`Q Studio Quote · ${quote.contact_name}`} noindex />
      <style>{`
        @media print {
          /* Force every element to preserve its background colors + lime/black
             accents on the timeline phase bars, kickoff card, launch banner etc.
             Without this, Chrome/Safari strip backgrounds by default. */
          *, *::before, *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          .qs-no-print { display: none !important; }
          .qs-sheet { max-width: none !important; margin: 0 !important; padding: 12mm !important; box-shadow: none !important; }
          body { background: white !important; }
          /* Plan comparison: shrink fonts on print so all 5 columns fit A4 width */
          .qs-tier-table { font-size: 9px !important; }
          .qs-tier-table th { padding: 6px 4px !important; }
          .qs-tier-table td { padding: 4px 4px !important; }
          .qs-tier-table th[data-tier-col] { min-width: 0 !important; }
        }
        @page { size: A4; margin: 0; }
      `}</style>

      <div className="min-h-screen bg-gray-100 py-6 px-4">
        {/* TOOLBAR (hidden on print) */}
        <div className="qs-no-print max-w-4xl mx-auto mb-4 flex items-center justify-end gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border-2 border-black text-black text-[11px] font-black uppercase tracking-wider hover:bg-gray-50"
          >
            <Printer size={12} strokeWidth={3} /> Save PDF
          </button>
          {canEdit && (
            <button
              type="button"
              onClick={() => navigate(`/quotesys/quotestudio?edit=${slug}`)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border-2 border-black text-black text-[11px] font-black uppercase tracking-wider hover:bg-gray-50"
            >
              <Pencil size={12} strokeWidth={3} /> Edit
            </button>
          )}
          <a
            href={`https://wa.me/${SALES_WA}?text=${encodeURIComponent(
              `Hi Q Studio team! 👋\n\nMy name is ${quote.contact_name}.\n\n📄 Quote: ${typeof window !== 'undefined' ? window.location.href : ''}\n💰 Total: RM ${fmt(money.grandTotal)} (incl. SST)\n\nPlease get in touch — thanks!`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-black text-[11px] font-black uppercase tracking-wider hover:opacity-90"
            style={{ backgroundColor: LIME, boxShadow: '0 3px 0 0 #000' }}
          >
            <MessageCircle size={12} strokeWidth={3} /> WhatsApp Client
          </a>
        </div>

        {/* A4 SHEET */}
        <div className="qs-sheet bg-white max-w-4xl mx-auto shadow-lg" style={{ padding: '12mm' }}>
          {/* HEADER — standardised across QuoteSys + QuoteStudio */}
          <div className="flex items-start justify-between gap-6 pb-5 border-b-2 border-black mb-5">
            <div>
              <h1 className="text-[44px] md:text-[56px] font-black uppercase leading-[0.9] tracking-[-0.04em] text-black">QBOT</h1>
              <p className="text-[11px] font-black uppercase tracking-wider text-black mt-2">Crave Asia Sdn Bhd</p>
              <p className="text-[10.5px] text-gray-700 leading-snug">B3-6-13, Solaris Dutamas, Jalan Dutamas 1</p>
              <p className="text-[10.5px] text-gray-700 leading-snug">Kuala Lumpur 50480 MY</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">Ref</div>
              <div className="text-[13px] font-black">{quoteRefDisplay}</div>
              <div className="text-[10px] text-gray-500 mt-2">Issued: {dateLabel(issueDate)}</div>
              <div className="text-[10px] text-gray-500">Valid until: {dateLabel(validUntil)}</div>
            </div>
          </div>

          {/* BILL TO */}
          <div className="grid grid-cols-2 gap-5 mb-6">
            <div>
              <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">Prepared For</div>
              <div className="text-[14px] font-black">{quote.contact_name}</div>
              {quote.business_name && <div className="text-[12px] text-gray-700">{quote.business_name}</div>}
              <div className="text-[11px] text-gray-600 mt-1">{quote.contact_phone}</div>
              {quote.contact_email && <div className="text-[11px] text-gray-600">{quote.contact_email}</div>}
              {quote.delivery_address && (
                <div className="text-[11px] text-gray-600 mt-1 whitespace-pre-line">{quote.delivery_address}</div>
              )}
              {quote.selections.projectTitle && (
                <div className="text-[14px] font-black text-black mt-2 leading-tight">{quote.selections.projectTitle}</div>
              )}
            </div>
            <div>
              <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">Prepared By</div>
              <div className="text-[14px] font-black">Q Studio Sales Team</div>
              <div className="text-[11px] text-gray-600">Crave Asia Sdn Bhd</div>
              <div className="text-[11px] text-gray-600">WhatsApp: +{SALES_WA}</div>
            </div>
          </div>

          {/* HARDWARE TABLE */}
          {(hardwareLines.length > 0 || customHardwareOneTimeLines.length > 0) && (
            <Table title="Hardware (0% SST)">
              {hardwareLines.map((line, i) => (
                <TableRow key={`hw-${i}`}
                  title={line.item.title}
                  subtitle={descriptions[line.item.id] ?? line.item.subtitle}
                  qty={line.qty}
                  unit={line.item.price}
                  subtotal={line.subtotal}
                  sst={0}
                  total={line.total}
                  lineDiscount={line.lineDiscount}
                  ldConfig={line.ldConfig}
                />
              ))}
              {customHardwareOneTimeLines.map((line, i) => (
                <TableRow key={`chw-${i}`}
                  title={line.ci.title}
                  subtitle={descriptions[line.ci.id] ?? line.ci.description}
                  qty={line.qty}
                  unit={line.ci.price}
                  subtotal={line.subtotal}
                  sst={0}
                  total={line.total}
                  lineDiscount={line.lineDiscount}
                  ldConfig={line.ldConfig}
                />
              ))}
            </Table>
          )}

          {/* CUSTOMIZATION TABLE */}
          {(customOneTimeLines.length > 0 || pkgOneTimeLine) && (
            <Table title="Customization (One-Time · 0% / 8% SST)">
              {customOneTimeLines.map((line, i) => (
                <TableRow key={`co-${i}`}
                  title={line.ci.title}
                  subtitle={descriptions[line.ci.id] ?? line.ci.description}
                  qty={line.qty}
                  unit={line.ci.price}
                  subtotal={line.subtotal}
                  sst={line.sst}
                  total={line.total}
                  lineDiscount={line.lineDiscount}
                  ldConfig={line.ldConfig}
                />
              ))}
              {pkgOneTimeLine && pkg && (
                <TableRow key="pkg-onetime"
                  title={pkg.title || 'Custom Package'}
                  subtitle={pkg.description}
                  qty={1}
                  unit={pkgOneTimeLine.gross}
                  subtotal={pkgOneTimeLine.subtotal}
                  sst={pkgOneTimeLine.sst}
                  total={pkgOneTimeLine.total}
                  lineDiscount={pkgOneTimeLine.lineDiscount}
                  ldConfig={pkgOneTimeLine.ldConfig}
                />
              )}
            </Table>
          )}

          {/* SUBSCRIPTIONS TABLE */}
          {subscriptionLines.length > 0 && (
            <Table title="Software & Subscriptions (Annual · 8% SST)">
              {subscriptionLines.map((line, i) => (
                <TableRow key={i}
                  title={line.label}
                  subtitle={line.subtitle}
                  qty={line.qty}
                  unit={line.unit}
                  subtotal={line.subtotal}
                  sst={line.sst}
                  total={line.total}
                  lineDiscount={line.lineDiscount}
                  ldConfig={line.ldConfig}
                />
              ))}
            </Table>
          )}

          {/* TIER COMPARISON — full table, selected plan highlighted (or none).
              Suppressed when the quote was built with "hide comparison chart". */}
          {quote.selections.hideComparison !== true && (() => {
            // New quotes (catalogVersion ≥ 2) show the current 4-tier matrix;
            // quotes saved before that keep the legacy 5-tier matrix unchanged.
            const isV2 = (quote.selections.catalogVersion ?? 1) >= CATALOG_VERSION;
            return (
              <TierComparisonTable
                selectedLevel={tier?.level ?? null}
                tiers={isV2 ? QUOTE_SOFTWARE_TIERS : SOFTWARE_TIERS}
                groups={isV2 ? FEATURE_GROUPS : LEGACY_FEATURE_GROUPS}
              />
            );
          })()}

          {/* MONTHLY RECURRING — standalone custom package charge (NOT in grand total) */}
          {pkgMonthly && (
            <Table title="Monthly Recurring (billed every month)">
              <TableRow
                title={pkgMonthly.title}
                subtitle={pkgMonthly.description}
                qty={1}
                unit={pkgMonthly.base}
                subtotal={pkgMonthly.base}
                sst={pkgMonthly.sst}
                total={pkgMonthly.base + pkgMonthly.sst}
              />
            </Table>
          )}

          {/* SETUP + DELIVERY TABLE */}
          {(setupIncluded || paymentGatewayIncluded || delivery) && (
            <Table title="Setup & Delivery (One-time · 8% SST)">
              {setupIncluded && (() => {
                const gross = effPrice(SETUP_AND_TRAINING.id, SETUP_AND_TRAINING.price);
                const ld = lineDiscs[SETUP_AND_TRAINING.id];
                const disc = resolveLineDiscount(gross, ld);
                const sub = gross - disc;
                return (
                  <TableRow
                    title={SETUP_AND_TRAINING.title}
                    subtitle={SETUP_AND_TRAINING.subtitle}
                    qty={1}
                    unit={gross}
                    subtotal={sub}
                    sst={sub * 0.08}
                    total={sub * 1.08}
                    lineDiscount={disc}
                    ldConfig={ld}
                  />
                );
              })()}
              {paymentGatewayIncluded && (() => {
                const gross = effPrice(PAYMENT_GATEWAY_REGISTRATION.id, PAYMENT_GATEWAY_REGISTRATION.price);
                const ld = lineDiscs[PAYMENT_GATEWAY_REGISTRATION.id];
                const disc = resolveLineDiscount(gross, ld);
                const sub = gross - disc;
                return (
                  <TableRow
                    title={PAYMENT_GATEWAY_REGISTRATION.title}
                    subtitle={descriptions[PAYMENT_GATEWAY_REGISTRATION.id] ?? PAYMENT_GATEWAY_REGISTRATION.subtitle}
                    qty={1}
                    unit={gross}
                    subtotal={sub}
                    sst={sub * 0.08}
                    total={sub * 1.08}
                    lineDiscount={disc}
                    ldConfig={ld}
                  />
                );
              })()}
              {delivery && (() => {
                const gross = effPrice(delivery.id, delivery.price);
                const ld = lineDiscs[delivery.id];
                const disc = resolveLineDiscount(gross, ld);
                const sub = gross - disc;
                return (
                  <TableRow
                    title={`Delivery & Installation — ${delivery.title}`}
                    subtitle={delivery.subtitle}
                    qty={1}
                    unit={gross}
                    subtotal={sub}
                    sst={sub * 0.08}
                    total={sub * 1.08}
                    lineDiscount={disc}
                    ldConfig={ld}
                  />
                );
              })()}
            </Table>
          )}

          {/* WAIVER notice */}
          {quote.selections.waiveSetup && (
            <div className="mb-6 p-3 border-2 border-black flex items-start gap-2" style={{ backgroundColor: 'rgba(204,255,0,0.15)' }}>
              <Gift size={16} strokeWidth={3} className="flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-[12px] font-black uppercase">Setup & Training Fee Waived</div>
                <div className="text-[10px] text-gray-700">
                  You save RM {fmt(SETUP_WAIVER_AMOUNT)} + RM {fmt(SETUP_WAIVER_AMOUNT * 0.08)} SST = <strong>RM {fmt(SETUP_WAIVER_AMOUNT * 1.08)}</strong> when you confirm this week.
                </div>
              </div>
            </div>
          )}

          {/* Custom notes */}
          {quote.selections.customNotes && (
            <div className="mb-6 p-3 border-2 border-gray-200">
              <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">Customer Notes</div>
              <div className="text-[11px] text-gray-700 whitespace-pre-line">{quote.selections.customNotes}</div>
            </div>
          )}

          {/* FOC */}
          {quote.selections.foc && (
            <div className="mb-6 p-3 border-2 border-black" style={{ backgroundColor: 'rgba(204,255,0,0.08)' }}>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-black mb-1">FOC — Free of Charge</div>
              <div className="text-[11px] text-black whitespace-pre-line">{quote.selections.foc}</div>
            </div>
          )}

          {/* TOTALS */}
          <div className="border-t-2 border-black pt-4 mt-4 space-y-1.5">
            <SumRow label="Hardware subtotal" amount={hardwareSubtotalOnly} />
            {customizationSubtotal > 0 && (
              <SumRow label="Customization subtotal" amount={customizationSubtotal} />
            )}
            <SumRow label="Subscriptions subtotal (annual)" amount={subscriptionSubtotalCalc} />
            <SumRow label="Setup & delivery subtotal" amount={servicesSubtotalCalc} />
            {/* ONE discount row, with the per-band split inline. Null label =
                no discount at all, so nothing renders and the customer never
                sees a "−RM 0.00". */}
            {money.split ? (
              <>
                {discountLabel && (
                  <SumRow label={discountLabel} amount={-money.discount} discount />
                )}
                {money.discount > 0 && quote.selections.discountText && (
                  <div className="text-right text-[9px] text-gray-500 font-mono">{quote.selections.discountText}</div>
                )}
              </>
            ) : money.discount > 0 && (
              <>
                <SumRow label="Discount applies to (hardware, custom & services)" amount={money.discountablePool} muted />
                <SumRow
                  label={`Discount${quote.selections.discountText ? ` — ${quote.selections.discountText}` : (quote.selections.discountMode === 'pct' && quote.selections.discountValue ? ` (${quote.selections.discountValue}%)` : '')}`}
                  amount={-money.discount}
                  discount
                />
              </>
            )}
            <div className="pt-1.5 mt-1 border-t border-gray-300">
              <SumRow label="Subtotal (after discount)" amount={money.grandTotal - money.sst} />
            </div>
            <SumRow
              label={money.sst > 0
                ? `SST 8% on taxable RM ${fmt(money.taxableBase)}`
                : 'SST (8%, after discount)'}
              amount={money.sst}
              muted
            />
            {quote.totals.youSave > 0 && (
              <SumRow label="You saved (setup waived)" amount={-quote.totals.youSave} discount />
            )}
            <div className="flex items-center justify-between pt-2 mt-2 border-t-2 border-black">
              <span className="text-[14px] font-black uppercase">Grand Total</span>
              <span className="text-[22px] font-black">RM {fmt(money.grandTotal)}</span>
            </div>
            <div className="text-right text-[9px] text-gray-500 font-mono uppercase">inclusive of SST · one-time + first-year</div>
            {((quote.totals.monthlyRecurring ?? 0) + (quote.totals.monthlyRecurringSst ?? 0)) > 0 && (
              <div className="flex items-center justify-between pt-2 mt-1 border-t border-gray-300">
                <span className="text-[12px] font-black uppercase text-gray-700">Then per month</span>
                <span className="text-[15px] font-black">RM {fmt((quote.totals.monthlyRecurring ?? 0) + (quote.totals.monthlyRecurringSst ?? 0))}/mo</span>
              </div>
            )}
          </div>

          {/* Payment terms */}
          {quote.selections.paymentTerms && (
            <div className="mt-6 border-2 border-black p-3">
              <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-600 mb-1">Payment Terms</div>
              <div className="text-[11px] text-black whitespace-pre-line">{quote.selections.paymentTerms}</div>
            </div>
          )}

          {/* Payment instructions / Bank info — mirrors QuoteSys */}
          <div className="mt-6 border border-black/40 px-3 py-2 text-[10px] text-black leading-snug">
            <p className="font-bold mb-1">Payment Instructions</p>
            <p className="mb-1">Kindly make payment to the following account and email <strong>finance@craveasia.com</strong> the payment receipt.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-0.5">
              <p><span className="text-gray-500">Account Name:</span> <strong>Crave Asia Sdn Bhd</strong></p>
              <p><span className="text-gray-500">Bank:</span> Malayan Banking Berhad (Maybank)</p>
              <p><span className="text-gray-500">Branch:</span> Damansara Utama, Petaling Jaya</p>
              <p><span className="text-gray-500">Swift Code:</span> MBBEMYKL</p>
              <p><span className="text-gray-500">MYR A/C:</span> <strong>5141 9635 1922</strong></p>
              <p><span className="text-gray-500">USD/SGD A/C:</span> <strong>7642 0300 0241</strong></p>
            </div>
          </div>

          {/* TIMELINE — opt-out via selections.timelineEnabled === false */}
          {quote.selections.timelineEnabled !== false && (
            <div className="mt-8">
              <QuoteStudioTimeline startDateISO={quote.selections.startDateISO ?? null} />
            </div>
          )}

          {/* CTA banner */}
          <div className="qs-no-print mt-8 p-5 border-2 border-black text-center" style={{ backgroundColor: 'rgba(204,255,0,0.1)' }}>
            <CheckCircle2 size={24} strokeWidth={3} className="mx-auto mb-2" style={{ color: '#1f6b00' }} />
            <h3 className="text-[16px] font-black uppercase mb-1">Ready to move forward?</h3>
            <p className="text-[12px] text-gray-700 mb-4">
              Reply on WhatsApp and we'll lock in your setup. {quote.totals.youSave > 0 && <strong>Confirm this week to save RM {fmt(quote.totals.youSave)}.</strong>}
            </p>
            <a
              href={`https://wa.me/${SALES_WA}?text=${encodeURIComponent(`Hi Q Studio team, I'd like to confirm my quote: ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-[12px] font-black uppercase tracking-wider hover:opacity-90"
            >
              <MessageCircle size={14} strokeWidth={2.5} /> Confirm via WhatsApp
            </a>
          </div>

          {/* FOOTER notes */}
          <div className="mt-8 pt-4 border-t border-gray-200 text-[9px] text-gray-500 font-mono leading-relaxed">
            <p>This quote is valid for {VALIDITY_DAYS} days from the issue date. Prices in MYR, inclusive of 8% SST where applicable. Hardware delivery for large items (turnstiles, anti-tailgating gates) may be quoted separately.</p>
          </div>

          {/* Standardised company footer — centered */}
          <div className="text-center text-[9.5px] text-gray-600 leading-relaxed mt-4 pt-3 border-t border-gray-200">
            Service Tax Agency Registration No.: W10-2312-32000094 | Trade Reg. Nr. 914475-H (201001030554) | www.craveasia.com
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Table helpers ─────────────────────────────────────────────────────────
function Table({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-gray-700 mb-2">{title}</div>
      <table className="w-full text-[11px]">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="text-left py-1.5 pr-2 font-mono font-bold uppercase text-[9px] text-gray-500 tracking-wider">Item</th>
            <th className="text-right py-1.5 px-2 font-mono font-bold uppercase text-[9px] text-gray-500 tracking-wider w-12">Qty</th>
            <th className="text-right py-1.5 px-2 font-mono font-bold uppercase text-[9px] text-gray-500 tracking-wider w-20">Unit</th>
            <th className="text-right py-1.5 px-2 font-mono font-bold uppercase text-[9px] text-gray-500 tracking-wider w-20">Subtotal</th>
            <th className="text-right py-1.5 px-2 font-mono font-bold uppercase text-[9px] text-gray-500 tracking-wider w-16">SST</th>
            <th className="text-right py-1.5 pl-2 font-mono font-bold uppercase text-[9px] text-gray-500 tracking-wider w-24">Total</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function TableRow({ title, subtitle, qty, unit, subtotal, sst, total, lineDiscount, ldConfig }: {
  title: string;
  subtitle?: string;
  qty: number;
  unit: number;
  subtotal: number;
  sst: number;
  total: number;
  lineDiscount?: number;
  ldConfig?: { mode: 'rm' | 'pct'; value: number };
}) {
  const hasDisc = !!lineDiscount && lineDiscount > 0;
  return (
    <tr className="border-b border-gray-100">
      <td className="py-2 pr-2 align-top">
        <div className="font-bold text-black">{title}</div>
        {subtitle && <div className="text-[10px] text-gray-500 whitespace-pre-line">{subtitle}</div>}
        {hasDisc && (
          <div className="text-[10px] text-black/80 font-mono mt-0.5">
            Less item discount{ldConfig?.mode === 'pct' && ldConfig.value > 0 ? ` (${ldConfig.value}%)` : ''} —{' '}
            <span className="font-bold">−RM {fmt(lineDiscount!)}</span>
          </div>
        )}
      </td>
      <td className="py-2 px-2 text-right align-top tabular-nums">{qty}</td>
      <td className="py-2 px-2 text-right align-top tabular-nums">{fmt(unit)}</td>
      <td className="py-2 px-2 text-right align-top tabular-nums">{fmt(subtotal)}</td>
      <td className="py-2 px-2 text-right align-top tabular-nums text-gray-500">{sst > 0 ? fmt(sst) : '—'}</td>
      <td className="py-2 pl-2 text-right align-top tabular-nums font-bold">{fmt(total)}</td>
    </tr>
  );
}

// ─── Tier comparison table (all plans, selected highlighted) ──────────────
function ComparisonCell({ cell }: { cell: CellValue }) {
  const included = isCellIncluded(cell);
  if (!included) {
    return <XIcon size={11} strokeWidth={2} className="inline text-gray-300" />;
  }
  if (typeof cell === 'string') {
    const isComingSoon = cell.toLowerCase() === 'coming soon';
    return (
      <span className={`text-[9px] font-mono font-bold uppercase tracking-tight ${isComingSoon ? 'text-gray-500 italic' : 'text-black'}`}>
        {cell}
      </span>
    );
  }
  return <CheckCircle2 size={12} strokeWidth={3} className="inline" style={{ color: '#1f6b00' }} />;
}

function TierComparisonTable({ selectedLevel, tiers, groups }: {
  selectedLevel: TierLevel | null;
  tiers: StudioTier[];
  groups: FeatureGroup[];
}) {
  const heading = selectedLevel
    ? 'Plan Comparison — Your selected plan is highlighted'
    : `Plan Comparison — All ${tiers.length} plans available`;
  return (
    <div className="mb-6">
      <div className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-gray-700 mb-2">
        {heading}
      </div>
      <div className="overflow-x-auto -mx-1 pb-1">
        <table className="qs-tier-table w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-white text-left text-[9px] font-mono font-bold uppercase tracking-wider text-gray-500 px-3 py-3 border-b-2 border-black w-[160px]">
                Compare Features
              </th>
              {tiers.map((t) => {
                const isSel = t.level === selectedLevel;
                return (
                  <th
                    key={t.id}
                    data-tier-col
                    className={`text-center align-bottom px-2 py-3 border-b-2 border-black relative ${isSel ? 'bg-black text-white' : 'bg-white'}`}
                    style={{ minWidth: '95px' }}
                  >
                    {t.badge && !isSel && (
                      <div
                        className="absolute -top-1 left-1/2 -translate-x-1/2 inline-flex items-center gap-0.5 text-[7.5px] font-black uppercase tracking-wider px-1.5 py-0.5 text-black whitespace-nowrap"
                        style={{ backgroundColor: LIME }}
                      >
                        <Star size={7} strokeWidth={3} /> {t.badge}
                      </div>
                    )}
                    <div className={`text-[10.5px] font-black uppercase leading-tight mb-1 ${isSel ? 'text-white' : 'text-black'}`}>
                      {t.title.replace('Studio ', '')}
                    </div>
                    {t.isCustom ? (
                      <div className={`text-[11px] font-black mb-2 leading-tight ${isSel ? 'text-white' : 'text-black'}`}>Price upon Request</div>
                    ) : (
                      <>
                        <div className={`text-[17px] font-black leading-none mb-0.5 ${isSel ? 'text-white' : 'text-black'}`}>
                          RM{t.monthly}
                        </div>
                        <div className={`text-[8px] font-mono mb-2 ${isSel ? 'text-white/70' : 'text-gray-500'}`}>/mo · billed annually</div>
                      </>
                    )}
                    <div
                      className={`w-full inline-flex items-center justify-center gap-1 px-2 py-1 text-[9px] font-black uppercase tracking-wider ${isSel ? 'bg-white text-black' : 'bg-black text-white'}`}
                      style={!isSel && t.recommended ? { backgroundColor: LIME, color: '#000' } : undefined}
                    >
                      {isSel ? <><CheckCircle2 size={9} strokeWidth={3} /> Selected</> : 'Select'}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {groups.map((group, gIdx) => (
              <React.Fragment key={gIdx}>
                <tr>
                  <td
                    colSpan={1 + tiers.length}
                    className="text-[9.5px] font-black uppercase tracking-[0.15em] text-white px-3 py-1.5"
                    style={{ backgroundColor: '#5eb3a8' }}
                  >
                    {group.title}
                  </td>
                </tr>
                {group.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="border-b border-gray-100">
                    <td className="sticky left-0 bg-white px-3 py-1.5 text-[10.5px] text-gray-800 font-medium align-top">
                      {row.feature}
                      {row.subtitle && (
                        <div className="text-[8.5px] font-mono text-gray-500 leading-tight mt-0.5">
                          {row.subtitle}
                        </div>
                      )}
                    </td>
                    {tiers.map((t) => {
                      const isSel = t.level === selectedLevel;
                      return (
                        <td
                          key={t.id}
                          className={`text-center px-2 py-1.5 align-middle ${isSel ? 'bg-black/5' : ''}`}
                        >
                          <ComparisonCell cell={row.cells[t.level]} />
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
    </div>
  );
}

function SumRow({ label, amount, muted, discount }: { label: string; amount: number; muted?: boolean; discount?: boolean }) {
  return (
    <div className="flex items-center justify-between text-[12px]">
      <span className={muted ? 'text-gray-500' : 'text-gray-700'}>{label}</span>
      <span className={`font-black tabular-nums ${discount ? 'text-green-700' : muted ? 'text-gray-500' : 'text-black'}`}>
        {discount ? '−' : ''}RM {fmt(Math.abs(amount))}
      </span>
    </div>
  );
}
