// QSTUDIO / GROWTH PARTNER — Quote Builder.
//
// Companion to the /qstudio/growthpartner pitch deck. A light, printable quote
// sheet the sales rep fills in live with a prospect: enter gym name + date, tick
// the line items, and the totals + 1-time / 12-mo / 24-mo ZIPP options compute
// live. Print to PDF or fire a pre-filled WhatsApp summary.
//
// UNLISTED / NOT CRAWLABLE. noindex/nofollow, robots-blocked, not prerendered,
// not linked from nav. Reachable by typing the URL or from the deck's CTA.

import { useMemo, useState, Fragment } from 'react';
import { Printer, MessageCircle, Check, Sparkles, X as XIcon } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { QUOTE_SOFTWARE_TIERS, FEATURE_GROUPS, isCellIncluded, type CellValue } from '../data/quoteStudioCatalog';

const LIME = '#CCFF00';
const WA_NUMBER = '60126909189';
const SST = 0.08;
const fmt = (n: number) => n.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Today as YYYY-MM-DD for the <input type=date> default (browser runtime).
function todayISO(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}
function dateLabel(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1).toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' });
}

type Cadence = 'one-time' | 'annual' | 'monthly-note';

interface LineItem {
  id: string;
  title: string;
  note?: string;
  price: number;          // actual charged price (RM), exclusive of SST
  listPrice?: number;     // if set, this higher "before" price is struck through and `price` is shown as the deal
  wasPrice?: number;      // if set, list price is struck through and the item is FREE
  freeLabel?: string;     // e.g. 'Use your own' — shown instead of a price
  cadence: Cadence;       // one-time · annual (×1, already the yearly figure) · monthly-note (info only, RM0)
  sst: number;            // 0 or 0.08 on the effective (post-free) price
  locked?: boolean;       // always included, checkbox disabled
  defaultOn: boolean;
  hasDomainInput?: boolean;
  partnerPrice?: number;  // if set, a "Partner Price" button switches the charged price to this value (0 = waived / free)
  subNote?: string;       // extra disclaimer line shown under the row
}

const ITEMS: LineItem[] = [
  { id: 'software',  title: 'STUDIO Growth Software', note: 'RM299/mo · billed annually',                         price: 299 * 12, cadence: 'annual',  sst: SST, locked: true, defaultOn: true, partnerPrice: 0 },
  { id: 'faceid',    title: 'Hikvision Face ID',      note: 'One-time · *Wiring and doorlock not included',       price: 1799, listPrice: 3599, cadence: 'one-time', sst: 0, defaultOn: false },
  { id: 'setup',     title: 'Setup & Installation',   note: 'One-time',                                           price: 1500, partnerPrice: 500, cadence: 'one-time', sst: SST, defaultOn: true },
  { id: 'delivery',  title: 'Delivery',               note: 'One-time',                                           price: 300,  wasPrice: 300, cadence: 'one-time', sst: SST, defaultOn: true },
  { id: 'pc',        title: 'PC / Laptop',            note: 'Use your own device',   freeLabel: 'Use your own',   price: 0,       cadence: 'one-time', sst: 0,   defaultOn: true },
  { id: 'domain',    title: 'Website Domain',         note: 'e.g. www.yourgym.com.my',                            price: 120,     cadence: 'annual',   sst: SST, defaultOn: false, hasDomainInput: true },
  { id: 'gateway',   title: 'Payment Gateway Setup',  note: 'Facilities at 5% per successful transaction, inclusive of gateway fees', price: 500, wasPrice: 500, cadence: 'one-time', sst: SST, defaultOn: true },
  { id: 'terminal',  title: 'Payment Terminal',       note: 'One-time · hardware',                                price: 900,     cadence: 'one-time', sst: 0,   defaultOn: true, locked: true, subNote: 'Payment gateway facilities at 5% per successful transaction, inclusive of gateway fees.' },
  { id: 'offline',   title: 'Offline Sync Server',    note: 'One-time · *Power plug and internet to be provided by client', price: 4000, cadence: 'one-time', sst: 0, defaultOn: false },
  { id: 'turnstile', title: 'Tripod Turnstile',       note: 'One-time · hardware',                                price: 5000, partnerPrice: 3000, cadence: 'one-time', sst: 0, defaultOn: false },
];

// Not included — optional add-ons, each priced per month.
const ADDON_FEATURES: { label: string; price: number }[] = [
  { label: 'Extra POS Terminal',           price: 69 },
  { label: 'Loyalty & Rewards',            price: 30 },
  { label: 'AI Sentry — anti-tailgating',  price: 99 },
  { label: 'Ticketing System',             price: 129 },
  { label: 'Venue / Facility Booking',     price: 30 },
  { label: 'Auto Email Marketing',         price: 99 },
  { label: 'WhatsApp Blast',               price: 99 },
  { label: 'Class Scheduling & Booking',   price: 30 },
  { label: 'E-Sign Agreements',            price: 30 },
  { label: 'Leads Management',             price: 30 },
];

// Deck slide screenshots (public/growthdeck/slide-N.jpg) embedded as the
// presentation appendix. Regenerate these if the /qstudio/growthpartner deck changes.
const DECK_SLIDES = Array.from({ length: 12 }, (_, i) => i + 1);

// Feature comparison matrix loaded from QuoteStudio, with the RM299 (Standard)
// tier highlighted as the customer's Growth plan.
const SELECTED_LEVEL = 'standard';

// Per-cell overrides for the RM299 (Standard) column — the Growth Package
// specially includes some features (and a higher member cap) beyond the base tier.
const SENTINEL_SPECIAL = 'Special Included';
const STANDARD_OVERRIDES: Record<string, CellValue> = {
  'Webstore': SENTINEL_SPECIAL,
  'Face ID Check-in': SENTINEL_SPECIAL,
  'Members': '3,000',
};

// Display-only feature-name relabels for this chart (shared catalog untouched).
const FEATURE_RENAME: Record<string, string> = {
  'QR': 'QR Ordering',
};

function ComparisonCell({ cell }: { cell: CellValue }) {
  if (cell === SENTINEL_SPECIAL) {
    return <span className="text-[7.5px] font-black uppercase leading-tight" style={{ color: '#1f6b00' }} title="Specially included in your Growth Package">★ Special Incl.</span>;
  }
  if (!isCellIncluded(cell)) return <XIcon size={10} strokeWidth={2} className="inline text-gray-300" />;
  if (typeof cell === 'string') {
    const soon = cell.toLowerCase() === 'coming soon';
    return <span className={`text-[8px] font-mono font-bold uppercase tracking-tight ${soon ? 'text-gray-400 italic' : 'text-black'}`}>{cell}</span>;
  }
  return <Check size={11} strokeWidth={3} className="inline" style={{ color: '#1f6b00' }} />;
}

function ComparisonChart() {
  return (
    <div className="mt-6 border-2 border-black p-4">
      <div className="inline-block text-[10px] font-black uppercase tracking-wider mb-3 px-2 py-0.5 text-black" style={{ backgroundColor: LIME }}>
        What's included — your Growth plan vs the rest
      </div>
      <div className="gq-chart-wrap overflow-x-auto">
        <table className="gq-chart w-full min-w-[620px] border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-white text-left text-[9px] font-mono font-bold uppercase tracking-wider text-gray-500 px-2 py-2 border-b-2 border-black w-[150px]">Compare</th>
              {QUOTE_SOFTWARE_TIERS.map(t => {
                const sel = t.level === SELECTED_LEVEL;
                return (
                  <th key={t.id} className={`text-center align-bottom px-1.5 py-2 border-b-2 border-black ${sel ? 'bg-black text-white' : 'bg-white'}`} style={{ minWidth: '78px' }}>
                    {sel && <div className="text-[7px] font-black uppercase tracking-wider mb-0.5" style={{ color: LIME }}>Your Plan</div>}
                    <div className={`text-[10px] font-black uppercase leading-tight ${sel ? 'text-white' : 'text-black'}`}>{t.title.replace('Studio ', '')}</div>
                    <div className={`text-[13px] font-black leading-none mt-0.5 ${sel ? 'text-white' : 'text-black'}`}>RM{t.monthly}</div>
                    <div className={`text-[7px] font-mono ${sel ? 'text-white/60' : 'text-gray-400'}`}>/mo</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {FEATURE_GROUPS.map((group, gi) => (
              <Fragment key={gi}>
                <tr>
                  <td colSpan={1 + QUOTE_SOFTWARE_TIERS.length} className="text-[8.5px] font-black uppercase tracking-[0.12em] text-white px-2 py-1" style={{ backgroundColor: '#5eb3a8' }}>{group.title}</td>
                </tr>
                {group.rows.map((row, ri) => (
                  <tr key={ri} className="border-b border-gray-100">
                    <td className="sticky left-0 bg-white px-2 py-1 text-[10px] text-gray-800 align-middle">{FEATURE_RENAME[row.feature] ?? row.feature}</td>
                    {QUOTE_SOFTWARE_TIERS.map(t => {
                      const sel = t.level === SELECTED_LEVEL;
                      const cell = (sel && row.feature in STANDARD_OVERRIDES) ? STANDARD_OVERRIDES[row.feature] : row.cells[t.level];
                      return <td key={t.id} className={`text-center px-1.5 py-1 align-middle ${sel ? 'bg-black/5' : ''}`}><ComparisonCell cell={cell} /></td>;
                    })}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[9px] text-gray-500 mt-2" style={{ color: '#1f6b00' }}>★ Specially included in your Growth Package — beyond the standard plan.</p>
    </div>
  );
}

export default function QStudioGrowthQuotePage() {
  const [gymName, setGymName] = useState('');
  const [date, setDate] = useState<string>(todayISO());
  const [domain, setDomain] = useState('');
  const [partnerOn, setPartnerOn] = useState<Record<string, boolean>>({}); // per-item "Partner Price" toggle (rep presses live)
  const [checked, setChecked] = useState<Record<string, boolean>>(
    () => Object.fromEntries(ITEMS.map(i => [i.id, i.defaultOn])),
  );

  const toggle = (id: string) => {
    const it = ITEMS.find(i => i.id === id);
    if (it?.locked) return;
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Effective unit price for an item — partner price (if toggled) → free (wasPrice) → list price.
  const effBase = (it: LineItem) => {
    if (it.partnerPrice !== undefined && partnerOn[it.id]) return it.partnerPrice;
    return it.wasPrice !== undefined ? 0 : it.price;
  };

  const { lines, subtotal, sstTotal, grand, savings } = useMemo(() => {
    const lines = ITEMS.filter(it => checked[it.id]).map(it => {
      const base = effBase(it);
      const sst = base * it.sst;
      // Savings = the "before" price (free/list/full) minus what they actually pay, incl SST.
      const refBase = it.wasPrice ?? it.listPrice ?? it.price;
      const save = Math.max(0, refBase - base) * (1 + it.sst);
      return { it, base, sst, total: base + sst, save };
    });
    const subtotal = lines.reduce((s, l) => s + l.base, 0);
    const sstTotal = lines.reduce((s, l) => s + l.sst, 0);
    const savings = lines.reduce((s, l) => s + l.save, 0);
    return { lines, subtotal, sstTotal, grand: subtotal + sstTotal, savings };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, partnerOn]);

  const per12 = grand / 12;
  const per24 = grand / 24;
  // Year-2 renewal = full annual software fee incl SST (RM299/mo × 12 + 8%).
  const sw = ITEMS.find(i => i.id === 'software')!;
  const yr2Fee = sw.price * (1 + sw.sst);

  const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    `Hi STUDIO team! 👋\n\nGym: ${gymName || '(name)'}\nDate: ${dateLabel(date)}\n\nGrowth Package quote:\n` +
    lines.map(l => `• ${l.it.title} — ${l.it.wasPrice !== undefined || l.base === 0 ? 'FREE' : `RM ${fmt(l.total)}`}`).join('\n') +
    `\n\nTotal (incl. SST): RM ${fmt(grand)}\nor RM ${fmt(per12)}/mo × 12 (0% ZIPP)\n\nPlease proceed — thanks!`,
  )}`;

  return (
    <>
      <SEOHead title="STUDIO Growth Package — Quote Builder" description="Build a STUDIO Growth Package quote." noindex />
      <style>{`
        @media print {
          .gq-no-print { display: none !important; }
          .gq-sheet { box-shadow: none !important; margin: 0 !important; max-width: none !important; }
          body { background: #fff !important; }
          /* Comparison chart: shrink so all tier columns fit A4 width */
          .gq-chart-wrap { overflow: visible !important; }
          .gq-chart { min-width: 0 !important; font-size: 8px !important; }
          .gq-chart th, .gq-chart td { padding: 2px 3px !important; }
        }
        @page { size: A4; margin: 12mm; }
      `}</style>

      <div className="min-h-screen bg-gray-100 py-6 px-4">
        {/* Toolbar */}
        <div className="gq-no-print max-w-3xl mx-auto mb-4 flex items-center justify-between gap-2 flex-wrap">
          <a href="/qstudio/growthpartner/9" className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-500 hover:text-black">
            ← Back to presentation
          </a>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border-2 border-black text-black text-[11px] font-black uppercase tracking-wider hover:bg-gray-50"
            >
              <Printer size={12} strokeWidth={3} /> Save PDF
            </button>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-black text-[11px] font-black uppercase tracking-wider hover:opacity-90"
              style={{ backgroundColor: LIME, boxShadow: '0 3px 0 0 #000' }}
            >
              <MessageCircle size={12} strokeWidth={3} /> Send on WhatsApp
            </a>
          </div>
        </div>

        {/* Sheet */}
        <div className="gq-sheet bg-white max-w-3xl mx-auto shadow-lg" style={{ padding: '10mm' }}>
          {/* Header */}
          <div className="flex items-start justify-between gap-6 pb-4 border-b-2 border-black mb-5">
            <div>
              <div className="inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-black mb-1.5" style={{ backgroundColor: LIME }}>
                Special Partnership
              </div>
              <h1 className="text-[26px] md:text-[32px] font-black uppercase tracking-tight leading-none">STUDIO Growth Package</h1>
              <p className="text-[11px] text-gray-600 mt-1">Quotation · Crave Asia Sdn Bhd</p>
            </div>
            <div className="text-right flex flex-col items-end">
              <div className="inline-block border-2 px-3 py-2" style={{ borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.18)' }}>
                <div className="text-[9px] font-mono font-black uppercase tracking-[0.15em]" style={{ color: '#1f6b00' }}>Partner Savings</div>
                <div className="text-[20px] md:text-[24px] font-black tabular-nums leading-none mt-0.5">RM {fmt(savings)}</div>
              </div>
              <div className="text-[9px] text-gray-400 mt-1.5">Promo RM299/mo · 12-mo 0% ZIPP</div>
            </div>
          </div>

          {/* Gym + date inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            <label className="sm:col-span-2 block">
              <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">Gym / Company Name</span>
              <input
                type="text"
                value={gymName}
                onChange={e => setGymName(e.target.value)}
                placeholder="e.g. FlexFit Studio Sdn Bhd"
                className="w-full border-2 border-gray-200 focus:border-black focus:outline-none text-[14px] font-bold px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">Date</span>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full border-2 border-gray-200 focus:border-black focus:outline-none text-[13px] px-3 py-2"
              />
            </label>
          </div>

          {/* Line items */}
          <div className="border-2 border-black">
            <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 items-center px-3 py-2 bg-black text-white text-[9px] font-mono font-bold uppercase tracking-wider">
              <span>Incl.</span><span>Item</span><span className="text-right">Amount</span>
            </div>
            {ITEMS.map(it => {
              const on = checked[it.id];
              const partnerActive = it.partnerPrice !== undefined && !!partnerOn[it.id];
              const isPartnerWaive = partnerActive && it.partnerPrice === 0;      // software → free, show big struck /mo
              const isPartnerDiscount = partnerActive && (it.partnerPrice ?? 0) > 0; // setup → struck original + partner price
              const showFree = it.wasPrice !== undefined;
              const struckPrice = it.wasPrice ?? it.price; // original list price for the struck-through display
              const base = effBase(it);
              const sst = base * it.sst;
              const lineTotal = base + sst;
              const struckOriginal = it.listPrice ?? (isPartnerDiscount ? it.price : undefined);
              return (
                <div key={it.id} className={`border-t border-gray-200 ${on ? '' : 'opacity-45'}`}>
                  <button
                    type="button"
                    onClick={() => toggle(it.id)}
                    disabled={it.locked}
                    className={`w-full grid grid-cols-[auto_1fr_auto] gap-x-3 items-start px-3 py-2.5 text-left ${it.locked ? 'cursor-default' : 'hover:bg-gray-50'}`}
                  >
                    <span className={`mt-0.5 w-5 h-5 flex items-center justify-center border-2 ${on ? 'border-black' : 'border-gray-300'}`} style={on ? { backgroundColor: LIME } : undefined}>
                      {on && <Check size={13} strokeWidth={3} className="text-black" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-black text-black leading-tight">
                        {it.title}
                        {it.locked && <span className="ml-2 text-[8px] font-mono uppercase tracking-wider text-gray-400 align-middle">{base > 0 ? 'required' : 'included'}</span>}
                      </span>
                      {it.note && <span className="block text-[10.5px] text-gray-500 leading-snug mt-0.5">{it.note}</span>}
                      {it.cadence === 'annual' && <span className="block text-[9px] font-mono text-gray-400 uppercase mt-0.5">Billed annually · 8% SST</span>}
                    </span>
                    <span className="text-right whitespace-nowrap">
                      {it.freeLabel ? (
                        <span className="text-[12px] font-black text-gray-500">{it.freeLabel}</span>
                      ) : isPartnerWaive ? (
                        <span className="text-[24px] md:text-[32px] font-black text-black line-through leading-none">RM {fmt(it.price * (1 + it.sst))}</span>
                      ) : showFree ? (
                        <span className="inline-flex items-baseline gap-1.5">
                          <span className="text-[11px] text-gray-400 line-through">RM {fmt(struckPrice)}</span>
                          <span className="text-[13px] font-black" style={{ color: '#1f6b00' }}>FREE</span>
                        </span>
                      ) : (
                        <>
                          {struckOriginal !== undefined && <span className="block text-[11px] text-gray-400 line-through">RM {fmt(struckOriginal)}</span>}
                          <span className="block text-[14px] font-black text-black">RM {fmt(lineTotal)}</span>
                          {it.sst > 0 && base > 0 && <span className="block text-[9px] font-mono text-gray-400">incl. SST</span>}
                        </>
                      )}
                    </span>
                  </button>
                  {/* Partner Price toggle */}
                  {it.partnerPrice !== undefined && on && (
                    <div className="px-3 pb-3 pl-11">
                      <button
                        type="button"
                        onClick={() => setPartnerOn(p => ({ ...p, [it.id]: !p[it.id] }))}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider border-2 transition-colors ${
                          partnerOn[it.id] ? 'bg-black text-white border-black' : 'border-black text-black hover:bg-gray-50'
                        }`}
                        style={!partnerOn[it.id] ? { backgroundColor: LIME } : undefined}
                      >
                        <Sparkles size={12} strokeWidth={3} />
                        {partnerOn[it.id] ? 'Partner Price applied — undo' : 'Partner Price'}
                      </button>
                    </div>
                  )}
                  {it.hasDomainInput && on && (
                    <div className="px-3 pb-3 pl-11">
                      <input
                        type="text"
                        value={domain}
                        onChange={e => setDomain(e.target.value)}
                        placeholder="www.yourgym.com.my"
                        className="w-full max-w-xs border border-gray-300 focus:border-black focus:outline-none text-[12px] font-mono px-2.5 py-1.5"
                      />
                    </div>
                  )}
                  {it.subNote && (
                    <div className="px-3 pb-2.5 pl-11 -mt-1">
                      <span className="block text-[10px] font-mono text-gray-500 leading-snug">· {it.subNote}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div className="mt-5 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold tabular-nums">RM {fmt(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-gray-600">SST (8%, where applicable)</span>
                <span className="font-bold tabular-nums text-gray-600">RM {fmt(sstTotal)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 mt-1 border-t-2 border-black">
                <span className="text-[14px] font-black uppercase">Total (Yr 1, incl. SST)</span>
                <span className="text-[20px] font-black tabular-nums">RM {fmt(grand)}</span>
              </div>
            </div>
          </div>

          {/* Payment options */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="border-2 border-black p-3 text-center">
              <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">One-time payment</div>
              <div className="text-[18px] font-black tabular-nums">RM {fmt(grand)}</div>
              <div className="text-[9px] font-mono text-gray-400 mt-0.5">pay in full</div>
            </div>
            <div className="border-2 p-3 text-center" style={{ borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.12)' }}>
              <div className="text-[9px] font-mono font-bold uppercase tracking-wider mb-1" style={{ color: '#1f6b00' }}>12 months · 0% ZIPP</div>
              <div className="text-[18px] font-black tabular-nums">RM {fmt(per12)}<span className="text-[10px] font-mono text-gray-500">/mo</span></div>
              <div className="text-[9px] font-mono text-gray-500 mt-0.5">interest-free</div>
            </div>
            <div className="border-2 border-gray-300 p-3 text-center">
              <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">24 months · installment</div>
              <div className="text-[18px] font-black tabular-nums">RM {fmt(per24)}<span className="text-[10px] font-mono text-gray-500">/mo</span></div>
              <div className="text-[9px] font-mono text-gray-400 mt-0.5">spread it out</div>
            </div>
          </div>

          {/* WHAT'S INCLUDED — QuoteStudio comparison chart, RM299 (Standard) highlighted */}
          <ComparisonChart />

          {/* WHAT'S NOT INCLUDED — optional add-ons, at the bottom */}
          <div className="mt-4 border-2 border-gray-300 p-4">
            <div className="text-[10px] font-black uppercase tracking-wider mb-3 text-gray-600">
              Not included · optional add-ons — add anytime as you grow
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
              {ADDON_FEATURES.map(f => (
                <div key={f.label} className="flex items-center justify-between gap-2 text-[11px] text-gray-700 leading-snug border-b border-gray-100 pb-1">
                  <span className="flex items-start gap-2 min-w-0">
                    <XIcon size={11} strokeWidth={3} className="mt-0.5 flex-shrink-0 text-gray-300" />
                    <span>{f.label}</span>
                  </span>
                  <span className="text-[9px] font-mono font-bold text-gray-500 flex-shrink-0">+RM{f.price}/mo</span>
                </div>
              ))}
            </div>
          </div>

          {/* Year 2 onwards */}
          <div className="mt-4 border-2 p-3.5" style={{ borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.1)' }}>
            <div className="text-[10px] font-black uppercase tracking-wider mb-0.5" style={{ color: '#1f6b00' }}>Year 2 onwards</div>
            <p className="text-[11px] text-gray-800 leading-snug">
              Software renews at <strong>RM {fmt(yr2Fee)}/year or 5% of transactions, whichever is higher</strong> —
              the fixed annual fee is waived once your 5% transaction fees reach that amount.
            </p>
          </div>

          {/* Footnotes */}
          <div className="mt-5 pt-3 border-t border-gray-200 text-[9.5px] text-gray-500 font-mono leading-relaxed space-y-1">
            <p>· Software billed annually (RM299/mo × 12) + 8% SST.</p>
            {partnerOn.software && <p>· <strong className="text-gray-700">First-year software fee waived</strong> under partner price.</p>}
            {partnerOn.setup && <p>· Setup &amp; Installation at <strong className="text-gray-700">partner price</strong> — RM500.</p>}
            <p>· Delivery &amp; Payment Gateway Setup <strong className="text-gray-700">waived</strong> under the Growth Partnership promo.</p>
            <p>· 0% installment over 12 months via ZIPP, subject to approval. Prices in MYR.</p>
            <p className="text-gray-400">· Payment gateway facilities at 5% per successful transaction, inclusive of gateway fees.</p>
          </div>

          {/* Presentation appendix — the full deck, so the quote is a total solution */}
          <div className="mt-8 pt-5 border-t-2 border-black">
            <div className="inline-block text-[10px] font-black uppercase tracking-wider mb-1 px-2 py-0.5 text-black" style={{ backgroundColor: LIME }}>
              The Full Presentation · Your Total Solution
            </div>
            <p className="text-[10px] text-gray-500 mb-3">A walkthrough of the STUDIO Growth Package — what it fixes, what's included, and how you're supported.</p>
            <div className="space-y-3">
              {DECK_SLIDES.map(n => (
                <div key={n} style={{ breakInside: 'avoid' }}>
                  <img src={`/growthdeck/slide-${n}.jpg`} alt={`Presentation slide ${n}`} className="w-full border-2 border-black" loading="lazy" />
                </div>
              ))}
            </div>
          </div>

          {/* Company footer */}
          <div className="text-center text-[9px] text-gray-500 leading-relaxed mt-5 pt-3 border-t border-gray-200">
            Crave Asia Sdn Bhd · SST Reg. W10-2312-32000094 · Trade Reg. 914475-H (201001030554) · www.craveasia.com · WhatsApp +{WA_NUMBER}
          </div>
        </div>
      </div>
    </>
  );
}
