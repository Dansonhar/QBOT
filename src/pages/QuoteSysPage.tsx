import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Check, ChevronDown, ChevronRight, Lock, Minus, Moon, Pencil, Plus, Printer, Save, Search, Sun, Tag, Trash2, Users, X,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { CATALOG, CATEGORIES, type CatalogItem, type CategoryId, type ItemType, type SstRate } from '../data/quotesysCatalog';
import { supabase } from '../lib/supabase';
import { splitDiscountSst, discountSummaryLabel, type DiscountInput } from '../lib/sstMath';
import { QUOTE_BUILDER_VERSION } from '../lib/quoteBuilderVersion';
import {
  fetchTemplates, saveTemplate as serverSaveTemplate, deleteTemplate as serverDeleteTemplate,
  fetchCompanies, upsertCompany, deleteCompany as serverDeleteCompany,
  fetchCustomItems, insertCustomItem, updateCustomItem as serverUpdateCustomItem, deleteCustomItem as serverDeleteCustomItem,
  type ServerCompany,
} from '../lib/quotesysServer';

const LIME = '#CCFF00';
const PASSWORD = 'Malaysia168!';
const SESSION_KEY = 'qsys_unlocked';
const TEMPLATES_CACHE_KEY = 'qsys_templates_cache_v2';
const CUSTOM_ITEMS_CACHE_KEY = 'qsys_custom_items_cache_v1';
const THEME_KEY = 'qsys_theme';
const VALIDITY_DAYS = 14;
const TOOL = 'quotesys' as const;

type Theme = 'dark' | 'light';

// Per-line discount applied BEFORE the quote-level discount + SST.
// Stored as raw user input (RM or %), resolved to RM at calc time.
export type LineDiscount = { mode: 'rm' | 'pct'; value: number };
export type LineDiscounts = Record<string, LineDiscount>;

interface TemplatePayload {
  qty: Record<string, number>;
  customCatalog: CatalogItem[];
  secondYearHalf: Record<string, boolean>;
  descriptions?: Record<string, string>;
  lineDiscounts?: LineDiscounts;
  selectionOrder?: string[];
  companyName?: string;
  picName?: string;
  picContact?: string;
}

interface Template {
  id: string;
  name: string;
  createdAt: number;
  payload: TemplatePayload;
}

function loadTemplatesCache(): Template[] {
  try {
    const raw = localStorage.getItem(TEMPLATES_CACHE_KEY);
    return raw ? JSON.parse(raw) as Template[] : [];
  } catch { return []; }
}

function cacheTemplates(t: Template[]) {
  try { localStorage.setItem(TEMPLATES_CACHE_KEY, JSON.stringify(t)); } catch { /* noop */ }
}

function loadCustomItemsCache(): CatalogItem[] {
  try {
    const raw = localStorage.getItem(CUSTOM_ITEMS_CACHE_KEY);
    return raw ? JSON.parse(raw) as CatalogItem[] : [];
  } catch { return []; }
}

function cacheCustomItems(items: CatalogItem[]) {
  try { localStorage.setItem(CUSTOM_ITEMS_CACHE_KEY, JSON.stringify(items)); } catch { /* noop */ }
}

type Stage = 'builder' | 'print';

const INSTALLMENT_PLANS: { months: 6 | 12 | 24; label: string }[] = [
  { months: 6,  label: '0% Interest · 6 months'  },
  { months: 12, label: '0% Interest · 12 months' },
  { months: 24, label: '0% Interest · 24 months' },
];

const fmt = (n: number) => n.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const dateLabel = (d: Date) => d.toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' });

// Date stamp shared by both ref formatters — YYMMDD.
function todayYYMMDD(d: Date = new Date()) {
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yy}${mm}${dd}`;
}

// Running number from the shared counter table — formatted as
// QF-YYMMDD-0001. The date is the day the ref was claimed; the counter
// keeps incrementing across days (does not reset daily).
async function claimQuoteSysRef(): Promise<string> {
  const date = todayYYMMDD();
  try {
    const { data, error } = await supabase.rpc('quotesys_claim_next_seq', { p_tool: 'quotesys' });
    if (error) throw error;
    const seq = typeof data === 'number' ? data : 0;
    return `QF-${date}-${String(seq).padStart(4, '0')}`;
  } catch (e) {
    console.error('QuoteSys: claim ref failed, using placeholder', e);
    return `QF-${date}-OFFLINE`;
  }
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
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em]" style={{ color: LIME }}>Restricted</p>
        </div>
        <h1 className="text-[22px] md:text-[26px] font-black uppercase tracking-tight leading-tight mb-1">QuoteSys</h1>
        <p className="text-white/70 text-[12px] mb-6">Internal pricing generator. Sales access only.</p>

        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/60 mb-2">Password</label>
        <input
          type="password"
          autoFocus
          value={pwd}
          onChange={e => { setPwd(e.target.value); setErr(null); }}
          className="w-full bg-black border-2 border-white/20 focus:border-white/60 focus:outline-none text-white text-[14px] px-3 py-2.5 mb-3"
        />
        {err && <p className="text-red-400 text-[12px] mb-3">{err}</p>}

        <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-black text-[12px] font-black uppercase tracking-wider transition-opacity hover:opacity-90" style={{ backgroundColor: LIME }}>
          Unlock <ArrowRight size={14} strokeWidth={2.5} />
        </button>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function QuoteSysPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [stage, setStage] = useState<Stage>('builder');

  // selection: itemId → quantity
  const [qty, setQty] = useState<Record<string, number>>({});
  // optional per-item flag: 50% on 2nd year onwards (only items where secondYearHalfPrice = true)
  const [secondYearHalf, setSecondYearHalf] = useState<Record<string, boolean>>({});
  // per-line description override (key = item id, value = custom description shown
  // in the print view in place of the catalog default). Empty string treated as
  // "cleared — fall back to catalog default".
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  // per-line discount (key = item id). Applied before quote-level discount + SST.
  const [lineDiscounts, setLineDiscounts] = useState<LineDiscounts>({});
  // catalog search filter (matches title or subcategory, case-insensitive)
  const [search, setSearch] = useState('');
  // user-entered ad-hoc items (server-persisted via quotesys_custom_items;
  // localStorage acts as an offline cache).
  const [customCatalog, setCustomCatalog] = useState<CatalogItem[]>(() => loadCustomItemsCache());
  const ALL_ITEMS = useMemo(() => [...CATALOG, ...customCatalog], [customCatalog]);
  // saved item-bundle templates (server-backed; localStorage caches last fetch).
  const [templates, setTemplates] = useState<Template[]>(() => loadTemplatesCache());
  // reusable company directory (server-backed).
  const [companies, setCompanies] = useState<ServerCompany[]>([]);
  // collapse state per category (default: all collapsed; search auto-expands)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    hardware: true, software: true, setup: true, delivery: true, custom: true,
  });
  // manual ordering of selected items (drives preview + per-category print order)
  const [selectionOrder, setSelectionOrder] = useState<string[]>([]);
  // builder theme — light/dark, persisted to localStorage
  const [theme, setTheme] = useState<Theme>(() => {
    try { const v = localStorage.getItem(THEME_KEY); return v === 'light' ? 'light' : 'dark'; } catch { return 'dark'; }
  });
  useEffect(() => { try { localStorage.setItem(THEME_KEY, theme); } catch { /* noop */ } }, [theme]);

  // customer + meta
  const [companyName, setCompanyName] = useState('');
  const [picName, setPicName] = useState('');
  const [picContact, setPicContact] = useState('');
  const [foc, setFoc] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('50% deposit on confirmation, balance on go-live.');

  // One-time discount, entered PER SST BAND and applied BEFORE SST.
  // The one-time pool mixes 0% hardware with 8% setup/delivery, so a single
  // figure could never be attributed correctly — whatever the tool guessed was
  // wrong for the deal the rep actually meant. Each band is discounted on its
  // own and SST is charged on what's left of the 8% band only.
  // (Subscriptions stay outside the master discount — discount those per line.)
  const [hwDiscount, setHwDiscount] = useState<DiscountInput>({ mode: 'rm', value: 0 });
  const [swDiscount, setSwDiscount] = useState<DiscountInput>({ mode: 'rm', value: 0 });

  const [quoteRef, setQuoteRef] = useState<string>('QF—');
  const issueDate = useMemo(() => new Date(), []);
  const validUntil = useMemo(() => {
    const d = new Date(issueDate);
    d.setDate(d.getDate() + VALIDITY_DAYS);
    return d;
  }, [issueDate]);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') setUnlocked(true);
  }, []);

  // Claim a running quote ref on unlock — one ref per builder session.
  useEffect(() => {
    if (!unlocked) return;
    if (quoteRef !== 'QF—') return; // already claimed
    let cancelled = false;
    (async () => {
      const ref = await claimQuoteSysRef();
      if (!cancelled) setQuoteRef(ref);
    })();
    return () => { cancelled = true; };
  }, [unlocked, quoteRef]);

  // Hydrate templates / companies / custom items from server once unlocked.
  // If the server fails (offline, network) we keep the localStorage cache.
  useEffect(() => {
    if (!unlocked) return;
    let cancelled = false;
    (async () => {
      try {
        const rows = await fetchTemplates<TemplatePayload>(TOOL);
        if (cancelled) return;
        const mapped: Template[] = rows.map(r => ({
          id: r.id,
          name: r.name,
          createdAt: r.createdAt,
          payload: {
            qty: r.payload.qty ?? {},
            customCatalog: r.payload.customCatalog ?? [],
            secondYearHalf: r.payload.secondYearHalf ?? {},
            descriptions: r.payload.descriptions ?? {},
            lineDiscounts: r.payload.lineDiscounts ?? {},
            selectionOrder: r.payload.selectionOrder,
            companyName: r.payload.companyName,
            picName: r.payload.picName,
            picContact: r.payload.picContact,
          },
        }));
        setTemplates(mapped);
        cacheTemplates(mapped);
      } catch (e) { console.error('QuoteSys: fetchTemplates failed', e); }
      try {
        const rows = await fetchCompanies(TOOL);
        if (!cancelled) setCompanies(rows);
      } catch (e) { console.error('QuoteSys: fetchCompanies failed', e); }
      try {
        const rows = await fetchCustomItems(TOOL);
        if (cancelled) return;
        const validCategories: CategoryId[] = ['hardware', 'software', 'setup', 'delivery', 'custom'];
        const items: CatalogItem[] = rows.map(r => ({
          id: r.id,
          title: r.title,
          description: r.description ?? undefined,
          price: r.price,
          sst: (r.sst === 0.08 ? 0.08 : 0) as SstRate,
          type: (['one-time', 'recurring', 'yearly'].includes(r.itemType) ? r.itemType : 'one-time') as ItemType,
          category: (validCategories.includes(r.category as CategoryId) ? r.category : 'custom') as CategoryId,
          subcategory: r.subcategory ?? undefined,
        }));
        setCustomCatalog(items);
        cacheCustomItems(items);
      } catch (e) { console.error('QuoteSys: fetchCustomItems failed', e); }
    })();
    return () => { cancelled = true; };
  }, [unlocked]);

  const setItemQty = (id: string, next: number) => {
    const wasZero = (qty[id] ?? 0) === 0;
    setQty(prev => {
      const n = Math.max(0, Math.min(99, next));
      const copy = { ...prev };
      if (n === 0) delete copy[id]; else copy[id] = n;
      return copy;
    });
    // Selection-order maintenance: append on first add, splice when fully removed.
    if (next > 0 && wasZero) {
      setSelectionOrder(prev => prev.includes(id) ? prev : [...prev, id]);
    }
    // Drop the second-year-half flag + description override if the item is removed.
    if (next <= 0) {
      setSecondYearHalf(prev => {
        if (!prev[id]) return prev;
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setDescriptions(prev => {
        if (prev[id] === undefined) return prev;
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setLineDiscounts(prev => {
        if (prev[id] === undefined) return prev;
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setSelectionOrder(prev => prev.filter(x => x !== id));
    }
  };

  const setLineDiscount = (id: string, next: LineDiscount | null) => {
    setLineDiscounts(prev => {
      if (next === null || (!next.value || next.value <= 0)) {
        if (prev[id] === undefined) return prev;
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: { mode: next.mode, value: Math.max(0, next.value) } };
    });
  };

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

  // Keep selectionOrder aligned with qty for paths that bypass setItemQty
  // (addCustomItem, updateCustomItem, loadTemplate). Append any qty>0 id
  // not yet ordered; prune ids whose qty fell to 0.
  useEffect(() => {
    setSelectionOrder(prev => {
      const activeIds = Object.keys(qty).filter(id => (qty[id] ?? 0) > 0);
      const active = new Set(activeIds);
      const kept = prev.filter(id => active.has(id));
      const missing = activeIds.filter(id => !kept.includes(id));
      if (kept.length === prev.length && missing.length === 0) return prev;
      return [...kept, ...missing];
    });
  }, [qty]);

  const moveSelection = (id: string, direction: -1 | 1) => {
    setSelectionOrder(prev => {
      // If id isn't tracked yet, seed from current active qty keys so the swap works.
      const base = prev.includes(id)
        ? prev
        : [...prev, ...Object.keys(qty).filter(k => (qty[k] ?? 0) > 0 && !prev.includes(k))];
      const i = base.indexOf(id);
      if (i === -1) return prev;
      const j = i + direction;
      if (j < 0 || j >= base.length) return prev;
      const next = [...base];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const toggleSecondYearHalf = (id: string) => {
    setSecondYearHalf(prev => {
      const copy = { ...prev };
      if (copy[id]) delete copy[id]; else copy[id] = true;
      return copy;
    });
  };

  const addCustomItem = async (data: {
    title: string; description?: string; price: number; qty: number;
    sst: SstRate; type: ItemType; category: CategoryId; subcategory?: string;
  }) => {
    let id: string;
    try {
      const row = await insertCustomItem(TOOL, {
        title: data.title,
        description: data.description,
        price: data.price,
        sst: data.sst,
        itemType: data.type,
        category: data.category,
        subcategory: data.subcategory,
      });
      id = row.id;
    } catch (e) {
      console.error('QuoteSys: insertCustomItem failed; staying local', e);
      id = `cust-${Math.random().toString(36).slice(2, 8)}`;
    }
    const item: CatalogItem = {
      id,
      title: data.title,
      description: data.description,
      price: data.price,
      sst: data.sst,
      type: data.type,
      category: data.category,
      subcategory: data.subcategory?.trim() || undefined,
    };
    setCustomCatalog(prev => {
      const next = [...prev, item];
      cacheCustomItems(next);
      return next;
    });
    setQty(prev => ({ ...prev, [id]: Math.max(1, data.qty) }));
  };

  const removeCustomItem = (id: string) => {
    setCustomCatalog(prev => {
      const next = prev.filter(it => it.id !== id);
      cacheCustomItems(next);
      return next;
    });
    setQty(prev => { const c = { ...prev }; delete c[id]; return c; });
    serverDeleteCustomItem(id).catch(e => console.error('QuoteSys: deleteCustomItem failed', e));
  };

  const updateCustomItem = (id: string, data: {
    title: string; description?: string; price: number; qty: number;
    sst: SstRate; type: ItemType; category: CategoryId; subcategory?: string;
  }) => {
    setCustomCatalog(prev => {
      const next = prev.map(it => it.id === id ? {
        ...it,
        title: data.title,
        description: data.description,
        price: data.price,
        sst: data.sst,
        type: data.type,
        category: data.category,
        subcategory: data.subcategory?.trim() || undefined,
      } : it);
      cacheCustomItems(next);
      return next;
    });
    setQty(prev => ({ ...prev, [id]: Math.max(1, data.qty) }));
    serverUpdateCustomItem(id, {
      title: data.title,
      description: data.description,
      price: data.price,
      sst: data.sst,
      itemType: data.type,
      category: data.category,
      subcategory: data.subcategory,
    }).catch(e => console.error('QuoteSys: updateCustomItem failed', e));
  };

  const saveAsTemplate = async (name: string) => {
    const payload: TemplatePayload = {
      qty: { ...qty },
      customCatalog: [...customCatalog],
      secondYearHalf: { ...secondYearHalf },
      descriptions: { ...descriptions },
      lineDiscounts: { ...lineDiscounts },
      selectionOrder: [...selectionOrder],
      companyName, picName, picContact,
    };
    try {
      const row = await serverSaveTemplate<TemplatePayload>(TOOL, name.trim(), payload);
      setTemplates(prev => {
        const next = [{ id: row.id, name: row.name, createdAt: row.createdAt, payload: row.payload }, ...prev];
        cacheTemplates(next);
        return next;
      });
    } catch (e) {
      console.error('QuoteSys: saveTemplate failed', e);
      window.alert('Failed to save template to server — check your connection.');
    }
  };

  const loadTemplate = (id: string) => {
    const tmpl = templates.find(t => t.id === id);
    if (!tmpl) return;
    const p = tmpl.payload;
    setCustomCatalog([...(p.customCatalog ?? [])]);
    setQty({ ...(p.qty ?? {}) });
    setSecondYearHalf({ ...(p.secondYearHalf ?? {}) });
    setDescriptions({ ...(p.descriptions ?? {}) });
    setLineDiscounts({ ...(p.lineDiscounts ?? {}) });
    if (p.selectionOrder) setSelectionOrder([...p.selectionOrder]);
    if (p.companyName !== undefined) setCompanyName(p.companyName);
    if (p.picName !== undefined) setPicName(p.picName);
    if (p.picContact !== undefined) setPicContact(p.picContact);
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => {
      const next = prev.filter(t => t.id !== id);
      cacheTemplates(next);
      return next;
    });
    serverDeleteTemplate(id).catch(e => console.error('QuoteSys: deleteTemplate failed', e));
  };

  // ─── Company directory ─────────────────────────────────────────────────
  const saveCompany = async () => {
    if (!companyName.trim()) {
      window.alert('Enter a company name first.');
      return;
    }
    try {
      const row = await upsertCompany(TOOL, {
        companyName: companyName.trim(),
        picName: picName.trim() || undefined,
        picContact: picContact.trim() || undefined,
      });
      setCompanies(prev => {
        const without = prev.filter(c => c.id !== row.id);
        return [...without, row].sort((a, b) => a.companyName.localeCompare(b.companyName));
      });
    } catch (e) {
      console.error('QuoteSys: saveCompany failed', e);
      window.alert('Failed to save company.');
    }
  };

  const loadCompany = (id: string) => {
    const c = companies.find(x => x.id === id);
    if (!c) return;
    setCompanyName(c.companyName);
    setPicName(c.picName ?? '');
    setPicContact(c.picContact ?? '');
  };

  const removeCompany = (id: string) => {
    setCompanies(prev => prev.filter(c => c.id !== id));
    serverDeleteCompany(id).catch(e => console.error('QuoteSys: deleteCompany failed', e));
  };

  const toggleCollapse = (id: string) => {
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // ── Derived: line items by category (only items with qty > 0) ──
  type Line = { item: CatalogItem; qty: number; gross: number; lineDiscount: number; subtotal: number; sstAmt: number; total: number };

  const lines: Line[] = useMemo(() => {
    const orderIndex = (id: string) => {
      const i = selectionOrder.indexOf(id);
      return i === -1 ? Number.MAX_SAFE_INTEGER : i;
    };
    return ALL_ITEMS
      .filter(it => (qty[it.id] ?? 0) > 0)
      .sort((a, b) => orderIndex(a.id) - orderIndex(b.id))
      .map(it => {
        const q = qty[it.id];
        const gross = it.price * q;
        const ld = lineDiscounts[it.id];
        const rawLd = ld && ld.value > 0
          ? (ld.mode === 'pct' ? gross * (ld.value / 100) : ld.value)
          : 0;
        const lineDiscount = Math.max(0, Math.min(gross, rawLd));
        const subtotal = gross - lineDiscount;
        const sstAmt = subtotal * it.sst;
        return { item: it, qty: q, gross, lineDiscount, subtotal, sstAmt, total: subtotal + sstAmt };
      });
  }, [qty, ALL_ITEMS, selectionOrder, lineDiscounts]);

  const oneTimeLines = lines.filter(l => l.item.type === 'one-time');
  const recurringLines = lines.filter(l => l.item.type === 'recurring');
  const yearlyItemLines = lines.filter(l => l.item.type === 'yearly');

  const oneTimeSubtotalGross = oneTimeLines.reduce((s, l) => s + l.subtotal, 0);

  // The one-time pool, split by SST band: 0% hardware vs 8% setup/delivery (and
  // any 8% one-time custom item). Each band takes its own discount, and SST is
  // charged on exactly `taxable pool − software discount` — no pro-rata, no
  // cross-band bleed. Same shared primitive as QuoteStudio so the two never
  // drift — see src/lib/sstMath.ts.
  const oneTimeZeroPool = oneTimeLines.filter(l => l.item.sst <= 0).reduce((s, l) => s + l.subtotal, 0);
  const oneTimeTaxablePool = oneTimeLines.filter(l => l.item.sst > 0).reduce((s, l) => s + l.subtotal, 0);
  const {
    hardwareDiscount: oneTimeHwDiscount,
    softwareDiscount: oneTimeSwDiscount,
    discount: oneTimeDiscount,
    taxableBase: oneTimeTaxableBase,
    sst: oneTimeSst,
  } = splitDiscountSst({
    zeroRatedPool: oneTimeZeroPool,
    taxablePool: oneTimeTaxablePool,
    hardwareDiscount: hwDiscount,
    softwareDiscount: swDiscount,
  });

  const oneTimeSubtotal = oneTimeSubtotalGross - oneTimeDiscount;
  const oneTimeTotal = oneTimeSubtotal + oneTimeSst;

  const recurringSubtotal = recurringLines.reduce((s, l) => s + l.subtotal, 0);
  const recurringSst = recurringLines.reduce((s, l) => s + l.sstAmt, 0);
  const recurringTotal = recurringSubtotal + recurringSst;

  // Subscription totals: each recurring item × its contractMonths (default 12 for
  // standard monthly plans, 24 for 2-year packages) + yearly items × 1.
  const yearlyItemSubtotal = yearlyItemLines.reduce((s, l) => s + l.subtotal, 0);
  const yearlyItemSst = yearlyItemLines.reduce((s, l) => s + l.sstAmt, 0);
  const recurringContractSubtotal = recurringLines.reduce((s, l) => s + l.subtotal * (l.item.contractMonths ?? 12), 0);
  const recurringContractSst = recurringLines.reduce((s, l) => s + l.sstAmt * (l.item.contractMonths ?? 12), 0);
  const yearlySubtotal = recurringContractSubtotal + yearlyItemSubtotal;
  const yearlySst = recurringContractSst + yearlyItemSst;
  const yearlyTotal = yearlySubtotal + yearlySst;
  // The 8%-taxable slice of the subscription block. NOT the same as
  // `yearlySubtotal` — 0%-rated recurring lines (terminal fees, FOC promos)
  // sit in there too, and counting them would overstate the "Taxable Amount"
  // printed on the quote.
  const yearlyTaxableSubtotal =
    recurringLines.filter(l => l.item.sst > 0).reduce((s, l) => s + l.subtotal * (l.item.contractMonths ?? 12), 0)
    + yearlyItemLines.filter(l => l.item.sst > 0).reduce((s, l) => s + l.subtotal, 0);

  // Per-year breakdown: each item annualised to a 12-month equivalent, so a
  // 2-year package shows half its contract total per year.
  const perYearRecurringSubtotal = recurringLines.reduce((s, l) => s + l.subtotal * 12, 0);
  const perYearRecurringSst = recurringLines.reduce((s, l) => s + l.sstAmt * 12, 0);
  const perYearTotal = perYearRecurringSubtotal + perYearRecurringSst + yearlyItemSubtotal + yearlyItemSst;
  // Show per-year only when at least one recurring item has a contract > 12 mths.
  const hasMultiYearContract = recurringLines.some(l => (l.item.contractMonths ?? 12) > 12);

  // Grand total = one-time (hardware/setup/delivery incl. SST) + first-year subscription (incl. SST).
  const grandTotal = oneTimeTotal + yearlyTotal;

  const goPrint = () => { setStage('print'); window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); };
  const goBuilder = () => setStage('builder');
  const lock = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setUnlocked(false);
  };

  if (!unlocked) {
    return (
      <>
        <SEOHead title="QuoteSys" description="Internal." noindex />
        <PasswordGate onUnlock={() => setUnlocked(true)} />
      </>
    );
  }

  const sharedProps = {
    lines, oneTimeLines, recurringLines, yearlyItemLines,
    oneTimeSubtotalGross, oneTimeDiscount,
    oneTimeZeroPool, oneTimeTaxablePool,
    hwDiscount, swDiscount, oneTimeHwDiscount, oneTimeSwDiscount,
    oneTimeSubtotal, oneTimeSst, oneTimeTotal,
    oneTimeTaxableBase,
    recurringSubtotal, recurringSst, recurringTotal,
    perYearTotal, hasMultiYearContract,
    yearlySubtotal, yearlySst, yearlyTotal, yearlyTaxableSubtotal,
    grandTotal,
    secondYearHalf,
    descriptions,
    lineDiscounts,
    companyName, picName, picContact, foc, paymentTerms,
    quoteRef, issueDate, validUntil,
  };

  return (
    <>
      <SEOHead title="QuoteSys" description="Internal." noindex />

      {/* Print stylesheet — show only the printable sheet when printing */}
      <style>{`
        @media print {
          @page { size: A4; margin: 12mm; }
          body { background: white !important; }
          .qs-print-hide { display: none !important; }
          .qs-sheet { box-shadow: none !important; padding: 0 !important; max-width: 100% !important; }
        }
      `}</style>

      {stage === 'builder' && (
        <BuilderView
          qty={qty}
          setItemQty={setItemQty}
          toggleSecondYearHalf={toggleSecondYearHalf}
          setLineDescription={setLineDescription}
          setLineDiscount={setLineDiscount}
          search={search}
          setSearch={setSearch}
          customCatalog={customCatalog}
          addCustomItem={addCustomItem}
          removeCustomItem={removeCustomItem}
          updateCustomItem={updateCustomItem}
          templates={templates}
          saveAsTemplate={saveAsTemplate}
          loadTemplate={loadTemplate}
          deleteTemplate={deleteTemplate}
          companies={companies}
          saveCompany={saveCompany}
          loadCompany={loadCompany}
          removeCompany={removeCompany}
          collapsed={collapsed}
          toggleCollapse={toggleCollapse}
          moveSelection={moveSelection}
          theme={theme}
          toggleTheme={toggleTheme}
          setCompanyName={setCompanyName}
          setPicName={setPicName}
          setPicContact={setPicContact}
          setFoc={setFoc}
          setPaymentTerms={setPaymentTerms}
          setHwDiscount={setHwDiscount}
          setSwDiscount={setSwDiscount}
          onGenerate={goPrint}
          onLock={lock}
          {...sharedProps}
        />
      )}

      {stage === 'print' && (
        <PrintView onBack={goBuilder} {...sharedProps} />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILDER VIEW
// ─────────────────────────────────────────────────────────────────────────────
type Line = { item: CatalogItem; qty: number; gross: number; lineDiscount: number; subtotal: number; sstAmt: number; total: number };

interface SharedProps {
  lines: Line[];
  oneTimeLines: Line[];
  recurringLines: Line[];
  yearlyItemLines: Line[];
  oneTimeSubtotalGross: number; oneTimeDiscount: number;
  // Per-band one-time discount: 0% hardware vs 8% setup/delivery.
  oneTimeZeroPool: number; oneTimeTaxablePool: number;
  hwDiscount: DiscountInput; swDiscount: DiscountInput;
  oneTimeHwDiscount: number; oneTimeSwDiscount: number;
  oneTimeSubtotal: number; oneTimeSst: number; oneTimeTotal: number;
  oneTimeTaxableBase: number;
  recurringSubtotal: number; recurringSst: number; recurringTotal: number;
  yearlySubtotal: number; yearlySst: number; yearlyTotal: number;
  yearlyTaxableSubtotal: number;   // the 8%-rated slice of yearlySubtotal
  perYearTotal: number; hasMultiYearContract: boolean;
  grandTotal: number;
  secondYearHalf: Record<string, boolean>;
  descriptions: Record<string, string>;
  lineDiscounts: LineDiscounts;
  companyName: string; picName: string; picContact: string;
  foc: string; paymentTerms: string;
  quoteRef: string; issueDate: Date; validUntil: Date;
}

interface BuilderProps extends SharedProps {
  qty: Record<string, number>;
  setItemQty: (id: string, next: number) => void;
  toggleSecondYearHalf: (id: string) => void;
  setLineDescription: (id: string, value: string) => void;
  setLineDiscount: (id: string, next: LineDiscount | null) => void;
  search: string;
  setSearch: (s: string) => void;
  customCatalog: CatalogItem[];
  addCustomItem: (data: { title: string; description?: string; price: number; qty: number; sst: SstRate; type: ItemType; category: CategoryId; subcategory?: string }) => void;
  removeCustomItem: (id: string) => void;
  updateCustomItem: (id: string, data: { title: string; description?: string; price: number; qty: number; sst: SstRate; type: ItemType; category: CategoryId; subcategory?: string }) => void;
  templates: Template[];
  saveAsTemplate: (name: string) => void;
  loadTemplate: (id: string) => void;
  deleteTemplate: (id: string) => void;
  companies: ServerCompany[];
  saveCompany: () => void;
  loadCompany: (id: string) => void;
  removeCompany: (id: string) => void;
  collapsed: Record<string, boolean>;
  toggleCollapse: (id: string) => void;
  moveSelection: (id: string, direction: -1 | 1) => void;
  theme: Theme;
  toggleTheme: () => void;
  setCompanyName: (s: string) => void;
  setPicName: (s: string) => void;
  setPicContact: (s: string) => void;
  setFoc: (s: string) => void;
  setPaymentTerms: (s: string) => void;
  setHwDiscount: (d: DiscountInput) => void;
  setSwDiscount: (d: DiscountInput) => void;
  onGenerate: () => void;
  onLock: () => void;
}

function BuilderView(p: BuilderProps) {
  const canGenerate = p.lines.length > 0 && p.companyName.trim().length > 0;
  const isLight = p.theme === 'light';
  const [editCustomId, setEditCustomId] = useState<string | null>(null);
  const editingCustom = editCustomId ? p.customCatalog.find(it => it.id === editCustomId) ?? null : null;

  const accentVars = isLight
    ? { '--qs-accent': '#1f6b00', '--qs-accent-soft': 'rgba(31,107,0,0.08)', '--qs-on-accent': '#ffffff' } as React.CSSProperties
    : { '--qs-accent': '#CCFF00', '--qs-accent-soft': 'rgba(204,255,0,0.06)', '--qs-on-accent': '#000000' } as React.CSSProperties;

  return (
    <div
      className={`min-h-screen pb-40 ${isLight ? 'qs-theme-light bg-white text-black' : 'bg-black text-white'}`}
      style={accentVars}
    >
      {/* Light-mode overrides — scoped to .qs-theme-light only */}
      <style>{`
        .qs-theme-light .bg-black { background-color: #fff !important; }
        .qs-theme-light .text-white { color: #111 !important; }
        .qs-theme-light .text-white\\/80 { color: rgba(0,0,0,0.8) !important; }
        .qs-theme-light .text-white\\/70 { color: rgba(0,0,0,0.7) !important; }
        .qs-theme-light .text-white\\/60 { color: rgba(0,0,0,0.6) !important; }
        .qs-theme-light .text-white\\/50 { color: rgba(0,0,0,0.5) !important; }
        .qs-theme-light .text-white\\/40 { color: rgba(0,0,0,0.4) !important; }
        .qs-theme-light .border-white\\/10 { border-color: rgba(0,0,0,0.1) !important; }
        .qs-theme-light .border-white\\/15 { border-color: rgba(0,0,0,0.15) !important; }
        .qs-theme-light .border-white\\/20 { border-color: rgba(0,0,0,0.18) !important; }
        .qs-theme-light .border-white\\/30 { border-color: rgba(0,0,0,0.3) !important; }
        .qs-theme-light .border-white\\/40 { border-color: rgba(0,0,0,0.4) !important; }
        .qs-theme-light .hover\\:border-white\\/40:hover { border-color: rgba(0,0,0,0.4) !important; }
        .qs-theme-light .hover\\:border-white\\/60:hover { border-color: rgba(0,0,0,0.6) !important; }
        .qs-theme-light .hover\\:text-white:hover { color: #000 !important; }
        .qs-theme-light .focus\\:border-white\\/60:focus { border-color: rgba(0,0,0,0.6) !important; }
        .qs-theme-light .bg-white\\/\\[0\\.02\\] { background-color: rgba(0,0,0,0.025) !important; }
        .qs-theme-light .hover\\:bg-white\\/\\[0\\.05\\]:hover { background-color: rgba(0,0,0,0.05) !important; }
      `}</style>

      {/* Top bar */}
      <div className="qs-print-hide border-b-2 border-white/10 bg-black sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em]" style={{ color: 'var(--qs-accent)' }}>QuoteSys · Internal</p>
            <p className="text-white text-[14px] font-black uppercase tracking-tight">Pricing Generator</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={p.toggleTheme} aria-label="Toggle theme" className="text-white/60 hover:text-white inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider">
              {isLight ? <Moon size={12} strokeWidth={2.5} /> : <Sun size={12} strokeWidth={2.5} />}
              <span className="hidden sm:inline">{isLight ? 'Dark' : 'Light'}</span>
            </button>
            <button onClick={p.onLock} className="text-white/60 hover:text-white text-[10px] font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
              <Lock size={12} strokeWidth={2.5} /> Lock
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6">
       <div className="space-y-6 md:space-y-8 min-w-0">

        {/* ── Customer info ── */}
        <Section num={1} title="Customer details" subtitle="Required to generate the PDF.">
          <CompaniesBar
            companies={p.companies}
            currentName={p.companyName}
            onLoad={p.loadCompany}
            onSave={p.saveCompany}
            onDelete={p.removeCompany}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <Field label="Company / Customer" value={p.companyName} onChange={p.setCompanyName} placeholder="Acme Sdn Bhd" required />
            <Field label="Person In Charge"   value={p.picName}     onChange={p.setPicName}     placeholder="Full name" />
            <Field label="Contact (phone/email)" value={p.picContact} onChange={p.setPicContact} placeholder="+60 12-345 6789" />
          </div>
          <div className="grid grid-cols-3 gap-3 md:gap-4 mt-3 text-[11px] font-mono">
            <Meta label="Quote Ref"     value={p.quoteRef} />
            <Meta label="Issue Date"    value={dateLabel(p.issueDate)} />
            <Meta label={`Valid Until (${VALIDITY_DAYS} days)`} value={dateLabel(p.validUntil)} />
          </div>
        </Section>

        {/* ── Items by category, grouped by subcategory ── */}
        <Section num={2} title="Select items" subtitle="Tap to add. Use −/+ to adjust quantity.">
          {/* Search */}
          <div className="mb-3 relative">
            <Search size={14} strokeWidth={2.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            <input
              type="text"
              value={p.search}
              onChange={e => p.setSearch(e.target.value)}
              placeholder="Search items by name or category…"
              className="w-full bg-black border-2 border-white/20 focus:border-white/60 focus:outline-none text-white text-[13px] pl-9 pr-9 py-2.5"
            />
            {p.search && (
              <button
                type="button"
                onClick={() => p.setSearch('')}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-white/60 hover:text-white"
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* Templates toolbar */}
          <TemplatesBar
            templates={p.templates}
            canSave={p.lines.length > 0}
            onSave={p.saveAsTemplate}
            onLoad={p.loadTemplate}
            onDelete={p.deleteTemplate}
          />

          {(() => {
            const q = p.search.trim().toLowerCase();
            const allItems: CatalogItem[] = [...CATALOG, ...p.customCatalog];
            const customIds = new Set(p.customCatalog.map(c => c.id));
            const matches = (it: CatalogItem) =>
              !q || it.title.toLowerCase().includes(q) || (it.subcategory ?? '').toLowerCase().includes(q);
            const totalMatches = allItems.filter(matches).length;
            if (q && totalMatches === 0) {
              return (
                <div className="border-2 border-dashed border-white/15 p-5 text-white/60 text-[12px] italic">
                  No items match “{p.search}”.
                </div>
              );
            }
            return CATEGORIES.map(cat => {
            const items = allItems.filter(it => it.category === cat.id && matches(it));
            const isCustomCat = cat.id === 'custom';
            // Hide a stock category that has no matches under search; always render Custom so its form is reachable.
            if (q && items.length === 0 && !isCustomCat) return null;
            const selectedCount = items.filter(it => (p.qty[it.id] ?? 0) > 0).length;
            const isCollapsed = !q && !!p.collapsed[cat.id];
            return (
              <div key={cat.id} className="mb-4 md:mb-5 last:mb-0">
                <button
                  type="button"
                  onClick={() => p.toggleCollapse(cat.id)}
                  className="w-full flex items-center justify-between mb-3 pb-2 border-b border-white/15 hover:border-white/30 transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    {isCollapsed
                      ? <ChevronRight size={14} strokeWidth={2.5} className="text-white/50 group-hover:text-white" />
                      : <ChevronDown  size={14} strokeWidth={2.5} className="text-white/70 group-hover:text-white" />}
                    <h3 className="text-white text-[13px] md:text-[15px] font-black uppercase tracking-tight">{cat.title}</h3>
                    {selectedCount > 0 && (
                      <span className="text-[9px] md:text-[10px] font-mono font-black uppercase tracking-wider px-1.5 py-0.5" style={{ backgroundColor: 'var(--qs-accent)', color: 'var(--qs-on-accent)' }}>
                        {selectedCount}
                      </span>
                    )}
                  </span>
                  <span className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--qs-accent)' }}>{cat.sstLabel}</span>
                </button>

                {!isCollapsed && (
                  <>
                <CustomItemForm
                  category={cat.id}
                  categoryTitle={cat.title}
                  onAdd={p.addCustomItem}
                  editingItem={editingCustom && editingCustom.category === cat.id ? editingCustom : null}
                  currentQty={editingCustom && editingCustom.category === cat.id ? (p.qty[editingCustom.id] ?? 1) : 1}
                  onUpdate={(data) => {
                    if (editCustomId) p.updateCustomItem(editCustomId, data);
                    setEditCustomId(null);
                  }}
                  onCancelEdit={() => setEditCustomId(null)}
                />

                {items.length === 0 ? (
                  isCustomCat ? null : (
                    <div className="border-2 border-dashed border-white/15 p-5 text-white/50 text-[12px] italic">
                      No items in this category.
                    </div>
                  )
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {items.map(it => {
                      const q = p.qty[it.id] ?? 0;
                      const active = q > 0;
                      const isCustom = customIds.has(it.id);
                      return (
                        <div
                          key={it.id}
                          className={`relative border-2 p-2.5 transition-colors ${active ? '' : 'border-white/15 bg-white/[0.02] hover:border-white/40'}`}
                          style={active ? { borderColor: 'var(--qs-accent)', backgroundColor: 'var(--qs-accent-soft)' } : {}}
                        >
                          {active && (
                            <div className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center" style={{ backgroundColor: 'var(--qs-accent)' }}>
                              <Check size={10} strokeWidth={3} className="text-black" />
                            </div>
                          )}

                          {isCustom && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  if (editCustomId === it.id) setEditCustomId(null);
                                  p.removeCustomItem(it.id);
                                }}
                                aria-label="Remove custom item"
                                className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-black border border-white/30 hover:border-white text-white/70 hover:text-white flex items-center justify-center"
                              >
                                <X size={11} strokeWidth={2.5} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditCustomId(it.id)}
                                aria-label="Edit custom item"
                                className={`absolute -top-2 left-4 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${editCustomId === it.id ? 'text-black' : 'bg-black border-white/30 hover:border-white text-white/70 hover:text-white'}`}
                                style={editCustomId === it.id ? { backgroundColor: 'var(--qs-accent)', borderColor: 'var(--qs-accent)' } : {}}
                              >
                                <Pencil size={10} strokeWidth={2.5} />
                              </button>
                            </>
                          )}

                          {it.subcategory && (
                            <p className="text-[8.5px] font-mono uppercase tracking-[0.15em] text-white/40 mb-1 truncate">{it.subcategory}</p>
                          )}
                          {it.image ? (
                            <div className="flex items-start gap-2 mb-1.5">
                              <img
                                src={it.image}
                                alt={it.title}
                                loading="lazy"
                                className="w-10 h-10 object-cover border border-white/10 flex-shrink-0 bg-white/[0.02]"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-[11px] md:text-[12px] font-black uppercase tracking-tight leading-tight mb-1 pr-6">
                                  {it.title}
                                </p>
                                <p className="font-black text-[12px] leading-none" style={{ color: 'var(--qs-accent)' }}>
                                  {it.priceLabel
                                    ? <span className="text-[10px]">{it.priceLabel}</span>
                                    : <>RM {it.price.toLocaleString()}<span className="text-white/70 text-[9px] font-mono ml-1">{it.type === 'recurring' ? '/mth' : it.type === 'yearly' ? '/yr' : 'one-time'}</span></>
                                  }
                                </p>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-white text-[11px] md:text-[12px] font-black uppercase tracking-tight leading-tight mb-1.5 pr-6">
                                {it.title}
                              </p>
                              <p className="font-black text-[13px] leading-none mb-2" style={{ color: 'var(--qs-accent)' }}>
                                {it.priceLabel
                                  ? <span className="text-[11px]">{it.priceLabel}</span>
                                  : <>RM {it.price.toLocaleString()}<span className="text-white/70 text-[9px] font-mono ml-1">{it.type === 'recurring' ? '/mth' : it.type === 'yearly' ? '/yr' : 'one-time'}</span></>
                                }
                              </p>
                            </>
                          )}
                          {it.description && (
                            <p className="text-white/70 text-[10px] leading-snug mb-1.5 whitespace-pre-line">{it.description}</p>
                          )}
                          {it.details && (
                            <p className="text-white/60 text-[9.5px] font-mono leading-snug mb-1.5 whitespace-pre-line">{it.details}</p>
                          )}

                          <div className="flex items-center justify-between border-t border-white/10 pt-1.5">
                            <button onClick={() => p.setItemQty(it.id, q - 1)} disabled={q === 0}
                              className="w-7 h-7 border-2 border-white/20 hover:border-white/60 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors">
                              <Minus size={11} strokeWidth={2.5} className="text-white" />
                            </button>
                            <span className="text-[15px] font-black font-mono" style={{ color: active ? 'var(--qs-accent)' : 'currentColor' }}>{q}</span>
                            <button onClick={() => p.setItemQty(it.id, q + 1)}
                              className="w-7 h-7 border-2 border-white/20 hover:border-white/60 flex items-center justify-center transition-colors">
                              <Plus size={11} strokeWidth={2.5} className="text-white" />
                            </button>
                          </div>

                          {it.secondYearHalfPrice && (
                            <label className={`flex items-center gap-1.5 mt-1.5 pt-1.5 border-t border-white/10 cursor-pointer select-none ${q === 0 ? 'opacity-40 pointer-events-none' : ''}`}>
                              <input
                                type="checkbox"
                                checked={!!p.secondYearHalf[it.id]}
                                onChange={() => p.toggleSecondYearHalf(it.id)}
                                className="w-3.5 h-3.5 cursor-pointer"
                                style={{ accentColor: 'var(--qs-accent)' }}
                              />
                              <span className="text-white/80 text-[9.5px] font-mono uppercase tracking-wider">50% Y2+</span>
                            </label>
                          )}

                          {active && it.price > 0 && (
                            <LineDiscountInline
                              itemId={it.id}
                              gross={it.price * q}
                              current={p.lineDiscounts[it.id]}
                              onChange={p.setLineDiscount}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                  </>
                )}
              </div>
            );
          });
          })()}
        </Section>

        {/* ── FOC ── */}
        <Section num={3} title="Free of charge (FOC)" subtitle="Optional — anything you'd like to throw in. Free text.">
          <textarea
            value={p.foc}
            onChange={e => p.setFoc(e.target.value)}
            rows={3}
            placeholder="e.g. Free 6 months WhatsApp support · Free training session · 50 receipt rolls"
            className="w-full bg-black border-2 border-white/20 focus:border-white/60 focus:outline-none text-white text-[13px] px-3 py-2.5 leading-relaxed"
          />
        </Section>

        {/* ── Discount on the one-time subtotal, per SST band (before SST) ── */}
        <Section num={4} title="Discount" subtitle="Optional — applied to the one-time subtotal before SST, one figure per SST band so the tax lands right. Subscriptions are discounted per line instead.">
          <DiscountControls
            hardware={p.hwDiscount}
            software={p.swDiscount}
            setHardware={p.setHwDiscount}
            setSoftware={p.setSwDiscount}
            zeroRatedPool={p.oneTimeZeroPool}
            taxablePool={p.oneTimeTaxablePool}
            hardwareDiscount={p.oneTimeHwDiscount}
            softwareDiscount={p.oneTimeSwDiscount}
            sst={p.oneTimeSst}
          />
        </Section>

        {/* ── Payment terms ── */}
        <Section num={5} title="Payment terms" subtitle="Free text — appears verbatim on the PDF. Payment-plan comparison is auto-generated.">
          <textarea
            value={p.paymentTerms}
            onChange={e => p.setPaymentTerms(e.target.value)}
            rows={3}
            placeholder="e.g. 50% deposit on confirmation, balance on go-live."
            className="w-full bg-black border-2 border-white/20 focus:border-white/60 focus:outline-none text-white text-[13px] px-3 py-2.5 leading-relaxed"
          />
        </Section>
       </div>

       {/* Side preview: sticky on lg+, stacked at the bottom of the form on smaller screens */}
       <aside className="qs-print-hide mt-8 lg:mt-0 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
         <SidePreview
           lines={p.lines}
           descriptions={p.descriptions}
           lineDiscounts={p.lineDiscounts}
           onMove={p.moveSelection}
           onRemove={(id: string) => p.setItemQty(id, 0)}
           onSetDescription={p.setLineDescription}
           onSetDiscount={p.setLineDiscount}
         />
       </aside>
      </div>

      {/* ── Sticky footer: live total + generate ── */}
      <div className="qs-print-hide fixed bottom-0 inset-x-0 z-30 bg-black border-t-2" style={{ borderColor: 'var(--qs-accent)' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5 md:gap-8 min-w-0">
            <div>
              <p className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/60">One-time</p>
              <p className="font-black text-[16px] md:text-[20px] leading-none" style={{ color: 'var(--qs-accent)' }}>RM {fmt(p.oneTimeSubtotal)}</p>
              <p className="text-white/60 text-[9px] md:text-[10px] font-mono mt-0.5">
                {p.oneTimeDiscount > 0 ? <>Disc: −{fmt(p.oneTimeDiscount)} · </> : null}
                SST: {fmt(p.oneTimeSst)}
              </p>
            </div>
            <div>
              <p className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/60">Yearly (×12)</p>
              <p className="font-black text-[16px] md:text-[20px] leading-none" style={{ color: 'var(--qs-accent)' }}>RM {fmt(p.yearlySubtotal)}<span className="text-white/60 text-[10px] font-mono ml-1">/yr</span></p>
              <p className="text-white/60 text-[9px] md:text-[10px] font-mono mt-0.5">SST: {fmt(p.yearlySst)}</p>
            </div>
            <div className="pl-5 md:pl-8 border-l-2" style={{ borderColor: 'var(--qs-accent)' }}>
              <p className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white">Grand Total</p>
              <p className="font-black text-[18px] md:text-[22px] leading-none text-white">RM {fmt(p.grandTotal)}</p>
              <p className="text-white/60 text-[9px] md:text-[10px] font-mono mt-0.5">Hardware + 1-yr subs incl. SST</p>
            </div>
          </div>
          <button onClick={p.onGenerate} disabled={!canGenerate}
            className="inline-flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 text-[11px] md:text-[13px] font-black uppercase tracking-wider transition-opacity disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90"
            style={{ backgroundColor: 'var(--qs-accent)', color: 'var(--qs-on-accent)' }}>
            Generate PDF <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        </div>
        {!canGenerate && (
          <div className="max-w-6xl mx-auto px-4 md:px-6 pb-2">
            <p className="text-white/50 text-[10px] md:text-[11px] italic">
              {p.lines.length === 0 ? 'Add at least one item' : ''}{p.lines.length === 0 && p.companyName.trim().length === 0 ? ' · ' : ''}{p.companyName.trim().length === 0 ? 'enter a company name' : ''}.
            </p>
          </div>
        )}
        <div className="max-w-6xl mx-auto px-4 md:px-6 pb-1.5 -mt-1">
          <p className="text-white/30 text-[9px] font-mono uppercase tracking-[0.2em] text-right">QuoteSys {QUOTE_BUILDER_VERSION}</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRINT VIEW — A4 sheet, optimised for window.print() → PDF
// ─────────────────────────────────────────────────────────────────────────────
interface PrintProps extends SharedProps {
  onBack: () => void;
}

function PrintView(p: PrintProps) {
  return (
    <div className="min-h-screen bg-neutral-200 py-6 md:py-10 print:bg-white print:py-0">
      {/* Toolbar — hidden on print */}
      <div className="qs-print-hide max-w-3xl mx-auto px-4 mb-4 flex items-center justify-between gap-3">
        <button onClick={p.onBack}
          className="inline-flex items-center gap-2 text-black text-[11px] md:text-[12px] font-bold uppercase tracking-wider bg-white border-2 border-black px-3 py-2 hover:bg-neutral-100 transition-colors">
          <ArrowLeft size={14} strokeWidth={2.5} /> Back to builder
        </button>
        <button onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 md:px-5 py-2 text-black text-[11px] md:text-[12px] font-black uppercase tracking-wider hover:bg-white transition-colors"
          style={{ backgroundColor: LIME, border: '2px solid black' }}>
          <Printer size={14} strokeWidth={2.5} /> Print / Save PDF
        </button>
      </div>

      {/* A4 sheet */}
      <div className="qs-sheet max-w-3xl mx-auto bg-white text-black p-6 md:p-10 shadow-2xl" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>

        {/* Header — standardised across QuoteSys + QuoteStudio */}
        <div className="flex items-start justify-between border-b-4 border-black pb-4 mb-6">
          <div>
            <h1 className="text-[44px] md:text-[56px] font-black uppercase leading-[0.9] tracking-[-0.04em] text-black">QBOT</h1>
            <p className="text-[11px] font-black uppercase tracking-wider text-black mt-2">Crave Asia Sdn Bhd</p>
            <p className="text-[10.5px] text-black/80 leading-snug">B3-6-13, Solaris Dutamas, Jalan Dutamas 1</p>
            <p className="text-[10.5px] text-black/80 leading-snug">Kuala Lumpur 50480 MY</p>
          </div>
          <div className="text-right text-[11px] font-mono">
            <p className="text-black/60 uppercase tracking-wider">Quote Ref</p>
            <p className="text-black font-bold">{p.quoteRef}</p>
            <p className="text-black/60 uppercase tracking-wider mt-2">Date</p>
            <p className="text-black font-bold">{dateLabel(p.issueDate)}</p>
            <p className="text-black/60 uppercase tracking-wider mt-2">Valid Until</p>
            <p className="text-black font-bold">{dateLabel(p.validUntil)}</p>
          </div>
        </div>

        {/* Bill to */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-[12px]">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-black/60 mb-1">Bill To</p>
            <p className="font-bold text-black">{p.companyName || '—'}</p>
          </div>
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-black/60 mb-1">Person In Charge</p>
            <p className="font-bold text-black">{p.picName || '—'}</p>
            {p.picContact && <p className="text-black/80">{p.picContact}</p>}
          </div>
        </div>

        {/* Line items by category */}
        <table className="w-full text-[12px] border-collapse mb-6">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="text-left py-2 font-mono uppercase text-[10px] tracking-wider">Item</th>
              <th className="text-right py-2 font-mono uppercase text-[10px] tracking-wider w-12">Qty</th>
              <th className="text-right py-2 font-mono uppercase text-[10px] tracking-wider w-20">Unit (RM)</th>
              <th className="text-right py-2 font-mono uppercase text-[10px] tracking-wider w-12">SST</th>
              <th className="text-right py-2 font-mono uppercase text-[10px] tracking-wider w-24">Amount (RM)</th>
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map(cat => {
              const catLines = p.lines.filter(l => l.item.category === cat.id);
              if (catLines.length === 0) return null;
              if (cat.id === 'software') {
                return <SoftwareBundleRow key={cat.id} title={cat.title} sstLabel={cat.sstLabel} lines={catLines} secondYearHalf={p.secondYearHalf} lineDiscounts={p.lineDiscounts} />;
              }
              return (
                <CategoryRows key={cat.id} title={cat.title} sstLabel={cat.sstLabel} lines={catLines} secondYearHalf={p.secondYearHalf} descriptions={p.descriptions} lineDiscounts={p.lineDiscounts} />
              );
            })}

            {p.foc.trim() && (
              <>
                <tr className="border-t-2 border-black">
                  <td colSpan={5} className="pt-3 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-black/70">FOC — Free of Charge</td>
                </tr>
                <tr className="border-b border-black/10">
                  <td colSpan={5} className="py-1.5 text-black whitespace-pre-line">{p.foc}</td>
                </tr>
              </>
            )}

            {/* Combined totals */}
            {(() => {
              const combinedSubtotal = p.oneTimeSubtotalGross + p.yearlySubtotal;
              const combinedTaxable = p.oneTimeTaxableBase + p.yearlyTaxableSubtotal;
              const combinedTax = p.oneTimeSst + p.yearlySst;
              const discountLabel = discountSummaryLabel(p.oneTimeHwDiscount, p.oneTimeSwDiscount);
              return (
                <>
                  <tr className="border-t-2 border-black">
                    <td colSpan={4} className="pt-3 py-1.5 text-black">Subtotal</td>
                    <td className="pt-3 py-1.5 text-right text-black">{fmt(combinedSubtotal)}</td>
                  </tr>
                  {/* ONE discount row, with the per-band split inline. Null
                      label = no discount at all, so nothing renders and the
                      customer never sees a "−0.00". */}
                  {discountLabel && (
                    <tr>
                      <td colSpan={4} className="py-1.5 text-black">{discountLabel}</td>
                      <td className="py-1.5 text-right text-black">−{fmt(p.oneTimeDiscount)}</td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={4} className="py-1.5 text-black">
                      Tax
                      <span className="block text-[10px] text-black/60 font-mono mt-0.5">
                        Taxable Amount: RM {fmt(combinedTaxable)} · SST 8%: RM {fmt(combinedTax)}
                      </span>
                    </td>
                    <td className="py-1.5 text-right text-black align-top">{fmt(combinedTax)}</td>
                  </tr>
                  {p.grandTotal > 0 && (
                    <tr className="border-t-2 border-b-4 border-black bg-black text-white">
                      <td colSpan={4} className="py-3 px-2 font-black uppercase tracking-wider text-[13px]">Grand Total</td>
                      <td className="py-3 px-2 text-right font-black text-[14px]">RM {fmt(p.grandTotal)}</td>
                    </tr>
                  )}
                </>
              );
            })()}
          </tbody>
        </table>

        {/* Payment options comparison */}
        {p.grandTotal > 0 && (
          <div className="mb-6">
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-black/60 mb-2">Payment Options</p>
            <table className="w-full text-[12px] border-collapse border-2 border-black">
              <thead>
                <tr className="border-b-2 border-black bg-black text-white">
                  <th className="text-left py-2 px-3 font-mono uppercase text-[10px] tracking-wider">Plan</th>
                  <th className="text-right py-2 px-3 font-mono uppercase text-[10px] tracking-wider">Per Month</th>
                  <th className="text-right py-2 px-3 font-mono uppercase text-[10px] tracking-wider">Total Payable</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-black/15">
                  <td className="py-2 px-3 font-bold text-black">Full Payment</td>
                  <td className="py-2 px-3 text-right text-black">—</td>
                  <td className="py-2 px-3 text-right font-bold text-black">RM {fmt(p.grandTotal)}</td>
                </tr>
                {INSTALLMENT_PLANS.map(pl => (
                  <tr key={pl.months} className="border-b border-black/15 last:border-b-0">
                    <td className="py-2 px-3 font-bold text-black">{pl.label}</td>
                    <td className="py-2 px-3 text-right text-black">RM {fmt(p.grandTotal / pl.months)} <span className="text-black/60 font-mono">× {pl.months}</span></td>
                    <td className="py-2 px-3 text-right font-bold text-black">RM {fmt(p.grandTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[10.5px] text-black/70 italic mt-2">
              0% Interest installments are exclusively available with <strong>Maybank, CIMB</strong> or <strong>Public Bank</strong> credit card holders. Grand Total includes hardware/setup/delivery + first-year subscription (×12 mths upfront).
            </p>
          </div>
        )}

        {/* Payment terms */}
        {p.paymentTerms.trim() && (
          <div className="border-2 border-black p-4 mb-6">
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-black/60 mb-2">Payment Terms</p>
            <p className="text-[12px] text-black whitespace-pre-line">{p.paymentTerms}</p>
          </div>
        )}

        {/* Payment instructions */}
        <div className="border border-black/40 px-3 py-2 mb-3 text-[10.5px] text-black leading-snug">
          <p className="font-bold mb-1">Payment Instructions</p>
          <p className="mb-1">Kindly make payment to the following account and email <strong>finance@craveasia.com</strong> the payment receipt.</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
            <p><span className="text-black/60">Account Name:</span> <strong>Crave Asia Sdn Bhd</strong></p>
            <p><span className="text-black/60">Bank:</span> Malayan Banking Berhad (Maybank)</p>
            <p><span className="text-black/60">Branch:</span> Damansara Utama, Petaling Jaya</p>
            <p><span className="text-black/60">Swift Code:</span> MBBEMYKL</p>
            <p><span className="text-black/60">MYR A/C:</span> <strong>5141 9635 1922</strong></p>
            <p><span className="text-black/60">USD/SGD A/C:</span> <strong>7642 0300 0241</strong></p>
          </div>
        </div>

        {/* Footer notes */}
        <div className="text-[10px] text-black/60 leading-relaxed border-t border-black/20 pt-3">
          <p><strong>Notes:</strong> Prices in MYR. SST at 8% applies to software, subscription, setup and delivery (services). Hardware is taxed at 0% SST and is one-time / non-refundable once delivered. Subscriptions are billed yearly (×12 months upfront). Quote valid for {VALIDITY_DAYS} days from issue date.</p>
          <p className="mt-2">Quote ref {p.quoteRef} · Issued {dateLabel(p.issueDate)}</p>
        </div>

        {/* Standardised company footer — centered */}
        <div className="text-center text-[9.5px] text-black/70 leading-relaxed mt-4 pt-3 border-t border-black/15">
          Service Tax Agency Registration No.: W10-2312-32000094 | Trade Reg. Nr. 914475-H (201001030554) | www.craveasia.com
        </div>
      </div>
    </div>
  );
}

function SoftwareBundleRow({ title, sstLabel, lines, secondYearHalf, lineDiscounts }: { title: string; sstLabel: string; lines: Line[]; secondYearHalf: Record<string, boolean>; lineDiscounts: LineDiscounts }) {
  const totalYearly = lines.reduce(
    (s, l) => s + (l.item.type === 'yearly' ? l.subtotal : l.subtotal * (l.item.contractMonths ?? 12)),
    0,
  );
  // Suffix reflects the longest contract present in the bundle.
  // All 12mo → '/yr'; any 24mo (or longer) → '/2 years' (or '/N years').
  const maxMonths = Math.max(12, ...lines.map(l => (l.item.type === 'recurring' ? (l.item.contractMonths ?? 12) : 12)));
  const totalSuffix = maxMonths === 12 ? '/yr'
    : maxMonths % 12 === 0 ? `/${maxMonths / 12} years`
    : `(${maxMonths} mths)`;
  const promoLines = lines.filter(l => secondYearHalf[l.item.id] && l.item.price > 0);
  const bundleRate = lines.find(l => l.item.sst > 0)?.item.sst ?? 0;
  return (
    <>
      <tr>
        <td colSpan={5} className="pt-3 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-black/70">
          {title} <span className="text-black/40 ml-2">{sstLabel}</span>
        </td>
      </tr>
      <tr className="border-b border-black/10">
        <td className="py-1.5 text-black align-top">
          <p className="font-bold">Qbot AI Cloud Software</p>
          <ul className="mt-0.5 ml-4 list-disc text-black/80 text-[11px] leading-snug">
            {lines.map(l => {
              const ld = lineDiscounts[l.item.id];
              const hasLineDisc = l.lineDiscount > 0;
              const contractMonths = l.item.type === 'recurring' ? (l.item.contractMonths ?? 12) : 1;
              return (
                <li key={l.item.id}>
                  {l.item.title}
                  {l.qty > 1 && <span className="text-black/50"> × {l.qty}</span>}
                  {l.item.priceLabel && <span className="italic text-black/60"> ({l.item.priceLabel})</span>}
                  {hasLineDisc && (
                    <span className="ml-1 text-black/80 font-mono">
                      · less{ld?.mode === 'pct' && ld.value > 0 ? ` ${ld.value}%` : ''}{' '}
                      <span className="font-bold">−RM {fmt(l.lineDiscount * contractMonths)}</span>
                    </span>
                  )}
                  {l.item.details && (
                    <div className="text-[10px] text-black/70 leading-snug whitespace-pre-line mt-0.5 ml-1 font-mono">{l.item.details}</div>
                  )}
                </li>
              );
            })}
          </ul>
          {promoLines.length > 0 && (
            <p className="text-[10.5px] text-black/70 italic mt-1">
              Promo: 50% on 2nd year onwards for {promoLines.map(l => l.item.title).join(', ')}
            </p>
          )}
        </td>
        <td className="py-1.5 text-right text-black align-top">—</td>
        <td className="py-1.5 text-right text-black align-top">—</td>
        <td className="py-1.5 text-right text-black align-top">{Math.round(bundleRate * 100)}%</td>
        <td className="py-1.5 text-right text-black align-top whitespace-nowrap">{fmt(totalYearly)} {totalSuffix}</td>
      </tr>
    </>
  );
}

function CategoryRows({ title, sstLabel, lines, secondYearHalf, descriptions, lineDiscounts }: { title: string; sstLabel: string; lines: Line[]; secondYearHalf: Record<string, boolean>; descriptions: Record<string, string>; lineDiscounts: LineDiscounts }) {
  return (
    <>
      <tr>
        <td colSpan={5} className="pt-3 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-black/70">
          {title} <span className="text-black/40 ml-2">{sstLabel}</span>
        </td>
      </tr>
      {lines.map(l => {
        const isFreebie = l.item.price === 0;
        const isRecurring = l.item.type === 'recurring';
        const halfFromY2 = isRecurring && !isFreebie && !!secondYearHalf[l.item.id];
        const contractMonths = l.item.contractMonths ?? 12;
        const effectiveDesc = descriptions[l.item.id] ?? l.item.description;
        const ld = lineDiscounts[l.item.id];
        const hasLineDisc = l.lineDiscount > 0;
        return (
          <tr key={l.item.id} className="border-b border-black/10">
            <td className="py-1.5 text-black align-top">
              {l.item.title}
              {l.item.subcategory && <span className="text-black/50 italic ml-1">· {l.item.subcategory}</span>}
              {isRecurring && !isFreebie && <span className="text-black/50 italic ml-1">/mo × {contractMonths} mths</span>}
              {effectiveDesc && (
                <p className="text-[10.5px] text-black/70 leading-snug whitespace-pre-line mt-0.5">{effectiveDesc}</p>
              )}
              {hasLineDisc && (
                <p className="text-[10.5px] text-black/80 mt-0.5 font-mono">
                  Less item discount{ld?.mode === 'pct' && ld.value > 0 ? ` (${ld.value}%)` : ''} —{' '}
                  <span className="font-bold">−RM {fmt(isRecurring ? l.lineDiscount * contractMonths : l.lineDiscount)}</span>
                </p>
              )}
              {halfFromY2 && (
                <span className="block text-[10.5px] text-black/70 italic mt-0.5">
                  Promo: 50% on 2nd year onwards — RM {fmt(l.item.price * 0.5)}/mo (RM {fmt(l.item.price * 0.5 * 12 * l.qty)}/yr from year 2)
                </span>
              )}
            </td>
            <td className="py-1.5 text-right text-black align-top">{l.qty}</td>
            <td className="py-1.5 text-right text-black align-top">
              {l.item.priceLabel ? <span className="italic">{l.item.priceLabel}</span> : fmt(l.item.price)}
            </td>
            <td className="py-1.5 text-right text-black align-top">{Math.round(l.item.sst * 100)}%</td>
            <td className="py-1.5 text-right text-black align-top">
              {isFreebie
                ? <span className="italic">{l.item.priceLabel ?? 'FOC'}</span>
                : isRecurring
                  ? `${fmt(l.subtotal * contractMonths)}${
                      contractMonths === 12 ? ' /yr'
                      : contractMonths % 12 === 0 ? ` /${contractMonths / 12} years`
                      : ` (${contractMonths} mths)`
                    }`
                  : fmt(l.subtotal)}
            </td>
          </tr>
        );
      })}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Small UI primitives
// ─────────────────────────────────────────────────────────────────────────────
// One discount input, bound to a single SST band. The % is a % OF THAT BAND.
function BandDiscountField({ label, note, pool, discount, applied, onChange }: {
  label: string;
  note: string;
  pool: number;                    // the band's pre-discount one-time subtotal
  discount: DiscountInput;
  applied: number;                 // resolved RM, already clamped to `pool`
  onChange: (d: DiscountInput) => void;
}) {
  const { mode, value } = discount;
  const [text, setText] = useState<string>(value ? String(value) : '');
  useEffect(() => { setText(value ? String(value) : ''); }, [value]);

  const exceeds = mode === 'pct' ? value > 100 : value > pool && pool > 0;

  return (
    <div className="border border-white/15 p-3">
      <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-white">{label}</p>
      <p className="text-[10px] text-white/45 mb-2">{note}</p>

      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex border-2 border-white/20">
          {(['rm', 'pct'] as const).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => onChange({ mode: m, value })}
              className={`px-3 py-2 text-[11px] font-mono font-bold uppercase tracking-wider transition-colors ${mode === m ? '' : 'text-white/70 hover:text-white'}`}
              style={mode === m ? { backgroundColor: 'var(--qs-accent)', color: 'var(--qs-on-accent)' } : {}}
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
            max={(mode === 'pct' ? 100 : pool) || undefined}
            value={text}
            onChange={e => {
              setText(e.target.value);
              const n = parseFloat(e.target.value);
              onChange({ mode, value: Number.isFinite(n) && n > 0 ? n : 0 });
            }}
            placeholder={mode === 'pct' ? 'e.g. 10' : 'e.g. 500'}
            className="w-full bg-black border-2 border-white/20 focus:border-white/60 focus:outline-none text-white text-[13px] px-3 py-2.5 pr-10"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 text-[11px] font-mono pointer-events-none">
            {mode === 'pct' ? '%' : 'RM'}
          </span>
        </div>
        {value > 0 && (
          <button
            type="button"
            onClick={() => { setText(''); onChange({ mode, value: 0 }); }}
            className="inline-flex items-center gap-1.5 border-2 border-white/30 hover:border-white/60 text-white/80 hover:text-white text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-2 transition-colors"
          >
            <X size={12} strokeWidth={2.5} /> Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-white/10 mt-3 pt-2 text-[11px] font-mono">
        <span className="text-white/60">Subtotal: <span className="text-white">RM {fmt(pool)}</span></span>
        <span className="text-white/60">
          −<span className="font-black" style={{ color: 'var(--qs-accent)' }}>RM {fmt(applied)}</span>
          {' → '}<span className="text-white font-black">RM {fmt(pool - applied)}</span>
        </span>
      </div>

      {pool <= 0 && value > 0 && (
        <p className="text-white/60 text-[11px] italic mt-2">Nothing one-time in this band yet — the discount won't apply until you add a line to it.</p>
      )}
      {exceeds && (
        <p className="text-red-400 text-[11px] italic mt-2">
          Exceeds this band's subtotal — it'll be capped at {mode === 'pct' ? '100%' : `RM ${fmt(pool)}`}.
        </p>
      )}
    </div>
  );
}

// Discount, split per SST band. A single figure can never be attributed across
// a one-time pool that mixes 0% hardware with 8% setup/delivery, so each band
// is discounted on its own and SST is charged on what's left of the 8% band.
function DiscountControls({
  hardware, software, setHardware, setSoftware,
  zeroRatedPool, taxablePool, hardwareDiscount, softwareDiscount, sst,
}: {
  hardware: DiscountInput;
  software: DiscountInput;
  setHardware: (d: DiscountInput) => void;
  setSoftware: (d: DiscountInput) => void;
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
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <BandDiscountField
          label="Discount on Hardware (0%)"
          note="Hardware & any other 0%-SST one-time line"
          pool={zeroRatedPool}
          discount={hardware}
          applied={hardwareDiscount}
          onChange={setHardware}
        />
        <BandDiscountField
          label="Discount on Software / Services (8%)"
          note="Setup, delivery & any other 8%-SST one-time line"
          pool={taxablePool}
          discount={software}
          applied={softwareDiscount}
          onChange={setSoftware}
        />
      </div>

      {/* The arithmetic, spelled out — this is what lands on the PDF. Hidden
          until there's a discount: with nothing entered it only restates the
          subtotals already shown in the fields above. */}
      {total > 0 && (
        <div className="border-t border-white/10 pt-3 space-y-1 text-[11px] font-mono">
          {hardwareDiscount > 0 && (
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <span className="text-white/60">Hardware after discount × 0%</span>
              <span className="text-white">RM {fmt(netZero)}</span>
            </div>
          )}
          {softwareDiscount > 0 && (
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <span className="text-white/60">Software / services after discount × 8%</span>
              <span className="text-white">RM {fmt(netTaxable)} + RM {fmt(sst)} = RM {fmt(netTaxable + sst)}</span>
            </div>
          )}
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-white/10 pt-1">
            <span className="text-white/60 font-bold">Total discount</span>
            <span className="font-black" style={{ color: 'var(--qs-accent)' }}>−RM {fmt(total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ num, title, subtitle, children }: { num: number; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-4">
        <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] mb-1" style={{ color: 'var(--qs-accent)' }}>Step {String(num).padStart(2, '0')}</p>
        <h2 className="text-[18px] md:text-[22px] font-black uppercase tracking-tight text-white leading-tight">{title}</h2>
        {subtitle && <p className="text-white/70 text-[12px] md:text-[13px] mt-1">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function Field({ label, value, onChange, placeholder, required }: { label: string; value: string; onChange: (s: string) => void; placeholder?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/60 mb-1.5">
        {label}{required && <span className="ml-1" style={{ color: 'var(--qs-accent)' }}>*</span>}
      </span>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-black border-2 border-white/20 focus:border-white/60 focus:outline-none text-white text-[13px] px-3 py-2.5" />
    </label>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-2 border-white/10 bg-white/[0.02] px-3 py-2">
      <p className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-white/60">{label}</p>
      <p className="text-white text-[12px] font-bold mt-0.5 truncate">{value}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Side preview — sticky list of selected items; ↑/↓ reorder, X remove
// ─────────────────────────────────────────────────────────────────────────────
function SidePreview({
  lines, descriptions, lineDiscounts, onMove, onRemove, onSetDescription, onSetDiscount,
}: {
  lines: Line[];
  descriptions: Record<string, string>;
  lineDiscounts: LineDiscounts;
  onMove: (id: string, direction: -1 | 1) => void;
  onRemove: (id: string) => void;
  onSetDescription: (id: string, value: string) => void;
  onSetDiscount: (id: string, next: LineDiscount | null) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  return (
    <div className="border-2 border-white/15 bg-white/[0.02] p-4">
      <div className="flex items-baseline justify-between mb-3 pb-2 border-b border-white/15">
        <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--qs-accent)' }}>
          Quote Preview
        </p>
        <span className="text-[10px] font-mono text-white/50">{lines.length} item{lines.length === 1 ? '' : 's'}</span>
      </div>

      {lines.length === 0 ? (
        <p className="text-white/50 text-[12px] italic">No items yet — pick from the catalog on the left.</p>
      ) : (
        <ul className="space-y-1.5">
          {lines.map((l, i) => {
            const isFirst = i === 0;
            const isLast = i === lines.length - 1;
            const isFreebie = l.item.price === 0;
            const isRecurring = l.item.type === 'recurring';
            const isYearly = l.item.type === 'yearly';
            const contractMonths = l.item.contractMonths ?? 12;
            const hasLineDisc = l.lineDiscount > 0;
            const amount = isFreebie
              ? (l.item.priceLabel ?? 'FOC')
              : isRecurring
                ? `${fmt(l.subtotal * contractMonths)}${
                    contractMonths === 12 ? '/yr'
                    : contractMonths % 12 === 0 ? `/${contractMonths / 12}yr`
                    : ` (${contractMonths}mo)`
                  }`
                : isYearly
                  ? `${fmt(l.subtotal)}/yr`
                  : fmt(l.subtotal);
            const grossAmount = isRecurring
              ? `${fmt(l.gross * contractMonths)}`
              : isYearly
                ? `${fmt(l.gross)}/yr`
                : fmt(l.gross);
            const desc = descriptions[l.item.id] ?? l.item.description ?? '';
            const ld = lineDiscounts[l.item.id];
            const editing = editingId === l.item.id;
            return (
              <li key={l.item.id} className="group border-b border-white/[0.06] pb-1.5">
                <div className="flex items-start gap-2">
                  <div className="flex flex-col gap-0.5 pt-0.5">
                    <button
                      type="button"
                      onClick={() => onMove(l.item.id, -1)}
                      disabled={isFirst}
                      aria-label="Move up"
                      className="w-5 h-5 border border-white/20 hover:border-white/60 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    >
                      <ArrowUp size={10} strokeWidth={2.5} className="text-white/70" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onMove(l.item.id, 1)}
                      disabled={isLast}
                      aria-label="Move down"
                      className="w-5 h-5 border border-white/20 hover:border-white/60 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    >
                      <ArrowDown size={10} strokeWidth={2.5} className="text-white/70" />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-[11.5px] font-bold leading-tight truncate">
                      {l.item.title}
                      {l.qty > 1 && <span className="text-white/50 font-normal ml-1">× {l.qty}</span>}
                    </p>
                    <p className="text-white/60 text-[10px] font-mono mt-0.5">
                      {hasLineDisc && !isFreebie ? (
                        <>
                          <span className="line-through text-white/30 mr-1">RM {grossAmount}</span>
                          <span className="font-bold" style={{ color: 'var(--qs-accent)' }}>RM {amount}</span>
                        </>
                      ) : (
                        <>RM {amount}</>
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingId(editing ? null : l.item.id)}
                    aria-label="Edit description"
                    title={desc ? 'Edit description' : 'Add description'}
                    className={`w-5 h-5 flex items-center justify-center transition-colors ${editing ? 'text-white' : 'text-white/40 hover:text-white'}`}
                  >
                    <Pencil size={10} strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(l.item.id)}
                    aria-label="Remove"
                    className="w-5 h-5 text-white/40 hover:text-white flex items-center justify-center"
                  >
                    <X size={11} strokeWidth={2.5} />
                  </button>
                </div>
                {editing ? (
                  <div className="mt-1.5 space-y-1.5">
                    <textarea
                      autoFocus
                      value={descriptions[l.item.id] ?? l.item.description ?? ''}
                      onChange={e => onSetDescription(l.item.id, e.target.value)}
                      rows={2}
                      placeholder="Description shown under the line item on the PDF…"
                      className="w-full bg-black border-2 border-white/20 focus:border-white/60 focus:outline-none text-white text-[11.5px] px-2 py-1.5 leading-snug resize-y"
                    />
                    {!isFreebie && (
                      <LineDiscountInput
                        gross={l.gross}
                        discount={ld}
                        onChange={(next) => onSetDiscount(l.item.id, next)}
                      />
                    )}
                  </div>
                ) : (
                  <>
                    {desc && (
                      <p className="mt-1 pl-7 text-white/60 text-[10.5px] leading-snug whitespace-pre-line line-clamp-2">{desc}</p>
                    )}
                    {hasLineDisc && (
                      <p className="mt-1 pl-7 text-[10px] font-mono" style={{ color: 'var(--qs-accent)' }}>
                        −RM {fmt(l.lineDiscount)}{ld?.mode === 'pct' && ld.value > 0 ? ` (${ld.value}%)` : ''} item discount
                      </p>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-white/40 text-[9.5px] font-mono mt-3 pt-3 border-t border-white/10">
        Order here is preserved within each category on the printed quote. Click <Pencil size={9} strokeWidth={2.5} className="inline align-text-bottom" /> to override description or apply an item discount.
      </p>
    </div>
  );
}

// Compact in-card discount editor — rendered directly on each selected
// catalog card so per-item discounts are visible without opening the side
// preview. Mirrors the pattern used in QuoteStudio.
function LineDiscountInline({
  itemId, gross, current, onChange,
}: {
  itemId: string;
  gross: number;
  current: LineDiscount | undefined;
  onChange: (id: string, next: LineDiscount | null) => void;
}) {
  const hasDiscount = !!current && current.value > 0;
  const [open, setOpen] = useState(hasDiscount);
  useEffect(() => { if (hasDiscount) setOpen(true); }, [hasDiscount]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-1.5 pt-1.5 border-t border-white/10 w-full inline-flex items-center justify-center gap-1 text-white/50 hover:text-white text-[9.5px] font-mono font-bold uppercase tracking-wider"
      >
        <Tag size={9} strokeWidth={2.5} /> + Discount
      </button>
    );
  }

  const mode = current?.mode ?? 'rm';
  const value = current?.value ?? 0;
  const resolved = value > 0
    ? Math.min(gross, mode === 'pct' ? gross * (value / 100) : value)
    : 0;
  const exceeds = mode === 'pct' ? value > 100 : value > gross && gross > 0;

  return (
    <div className="mt-1.5 pt-1.5 border-t border-white/10">
      <div className="flex items-stretch border border-white/20">
        {(['rm', 'pct'] as const).map(m => (
          <button
            key={m}
            type="button"
            onClick={() => onChange(itemId, value > 0 ? { mode: m, value } : null)}
            className={`px-1.5 py-0.5 text-[9.5px] font-mono font-bold uppercase tracking-wider ${mode === m ? '' : 'text-white/60 hover:text-white'}`}
            style={mode === m ? { backgroundColor: 'var(--qs-accent)', color: 'var(--qs-on-accent)' } : {}}
          >
            {m === 'rm' ? 'RM' : '%'}
          </button>
        ))}
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
          placeholder={mode === 'pct' ? '%' : 'RM'}
          className="flex-1 min-w-0 border-l border-white/20 bg-black text-white text-[10.5px] font-mono px-1.5 py-0.5 focus:outline-none focus:bg-white/[0.05]"
        />
        <button
          type="button"
          onClick={() => { onChange(itemId, null); setOpen(false); }}
          aria-label="Remove discount"
          className="px-1.5 border-l border-white/20 text-white/40 hover:text-white"
        >
          <X size={10} strokeWidth={2.5} />
        </button>
      </div>
      <div className={`text-[9px] font-mono mt-0.5 ${exceeds ? 'text-red-400' : 'text-white/60'}`}>
        {exceeds ? 'capped at line max' : resolved > 0 ? <>−RM {fmt(resolved)} off line</> : 'no discount'}
      </div>
    </div>
  );
}

// Inline per-line discount editor (used inside SidePreview's edit panel).
function LineDiscountInput({
  gross, discount, onChange,
}: {
  gross: number;
  discount: LineDiscount | undefined;
  onChange: (next: LineDiscount | null) => void;
}) {
  const mode = discount?.mode ?? 'rm';
  const value = discount?.value ?? 0;
  const [draft, setDraft] = useState<string>(value ? String(value) : '');
  useEffect(() => { setDraft(value ? String(value) : ''); }, [value]);

  const handleValue = (s: string) => {
    setDraft(s);
    const n = parseFloat(s);
    onChange(Number.isFinite(n) && n > 0 ? { mode, value: n } : null);
  };

  const resolved = value > 0
    ? Math.min(gross, mode === 'pct' ? gross * (value / 100) : value)
    : 0;
  const exceeds = mode === 'pct' ? value > 100 : value > gross && gross > 0;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/50">Discount</span>
      <div className="inline-flex border-2 border-white/20">
        {(['rm', 'pct'] as const).map(m => (
          <button
            key={m}
            type="button"
            onClick={() => onChange(value > 0 ? { mode: m, value } : null)}
            className={`px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider ${mode === m ? '' : 'text-white/60 hover:text-white'}`}
            style={mode === m ? { backgroundColor: 'var(--qs-accent)', color: 'var(--qs-on-accent)' } : {}}
          >
            {m === 'rm' ? 'RM' : '%'}
          </button>
        ))}
      </div>
      <div className="relative flex-1 min-w-[110px]">
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step={mode === 'pct' ? '0.5' : '1'}
          value={draft}
          onChange={e => handleValue(e.target.value)}
          placeholder={mode === 'pct' ? '%' : 'RM'}
          className="w-full bg-black border-2 border-white/20 focus:border-white/60 focus:outline-none text-white text-[11.5px] px-2 py-1 pr-7"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 text-[10px] font-mono pointer-events-none">
          {mode === 'pct' ? '%' : 'RM'}
        </span>
      </div>
      {value > 0 && (
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label="Clear discount"
          className="text-white/40 hover:text-white p-1"
        >
          <X size={11} strokeWidth={2.5} />
        </button>
      )}
      <span className="basis-full text-[10px] font-mono text-white/60 pl-1">
        {resolved > 0 ? <>−RM {fmt(resolved)} off line · {exceeds ? <span className="text-red-400">capped</span> : 'applied before SST'}</> : <span className="text-white/40">no discount</span>}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Companies bar — saved company directory (load / save / delete)
// ─────────────────────────────────────────────────────────────────────────────
function CompaniesBar({
  companies, currentName, onLoad, onSave, onDelete,
}: {
  companies: ServerCompany[];
  currentName: string;
  onLoad: (id: string) => void;
  onSave: () => void;
  onDelete: (id: string) => void;
}) {
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Remove “${name}” from your saved companies?`)) onDelete(id);
  };
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onSave}
        disabled={!currentName.trim()}
        title={currentName.trim() ? 'Save / update this company' : 'Enter a company name first'}
        className="inline-flex items-center gap-1.5 border-2 border-white/30 hover:border-white/60 disabled:opacity-30 disabled:cursor-not-allowed text-white/80 hover:text-white text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1.5 transition-colors"
      >
        <Save size={12} strokeWidth={2.5} /> Save Company
      </button>
      {companies.length > 0 && (
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 ml-1 inline-flex items-center gap-1">
          <Users size={11} strokeWidth={2.5} /> Load:
        </span>
      )}
      {companies.length > 0 && (
        <select
          defaultValue=""
          onChange={e => { if (e.target.value) { onLoad(e.target.value); e.currentTarget.value = ''; } }}
          className="bg-black border-2 border-white/20 hover:border-white/40 focus:border-white/60 focus:outline-none text-white text-[11px] font-mono uppercase tracking-wider px-2 py-1.5"
        >
          <option value="">Select…</option>
          {companies.map(c => (
            <option key={c.id} value={c.id}>{c.companyName}</option>
          ))}
        </select>
      )}
      {currentName.trim() && companies.find(c => c.companyName.toLowerCase() === currentName.trim().toLowerCase()) && (
        <button
          type="button"
          onClick={() => {
            const found = companies.find(c => c.companyName.toLowerCase() === currentName.trim().toLowerCase());
            if (found) handleDelete(found.id, found.companyName);
          }}
          aria-label="Delete saved company"
          className="inline-flex items-center gap-1.5 text-white/40 hover:text-red-400 text-[10px] font-mono uppercase tracking-wider px-2 py-1.5"
        >
          <Trash2 size={11} strokeWidth={2.5} /> Forget
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Templates bar — save current selection / load / delete
// ─────────────────────────────────────────────────────────────────────────────
function TemplatesBar({
  templates, canSave, onSave, onLoad, onDelete,
}: {
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
    <div className="mb-5 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleSave}
        disabled={!canSave}
        title={canSave ? 'Save current selection as template' : 'Add at least one item first'}
        className="inline-flex items-center gap-1.5 border-2 border-white/30 hover:border-white/60 disabled:opacity-30 disabled:cursor-not-allowed text-white/80 hover:text-white text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1.5 transition-colors"
      >
        <Plus size={12} strokeWidth={2.5} /> Save as Template
      </button>
      {templates.length > 0 && (
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 ml-1">Load:</span>
      )}
      {templates.map(t => (
        <span key={t.id} className="inline-flex items-stretch border-2 border-white/20">
          <button
            type="button"
            onClick={() => onLoad(t.id)}
            className="px-2.5 py-1.5 text-white/80 hover:text-white hover:bg-white/[0.05] text-[11px] font-mono font-bold uppercase tracking-wider"
            title={`Load: ${t.name}`}
          >
            {t.name}
          </button>
          <button
            type="button"
            onClick={() => handleDelete(t.id, t.name)}
            aria-label={`Delete template ${t.name}`}
            className="px-1.5 border-l border-white/20 text-white/40 hover:text-white hover:bg-white/[0.05]"
          >
            <X size={11} strokeWidth={2.5} />
          </button>
        </span>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom item form — adds an ad-hoc line item to the quote
// ─────────────────────────────────────────────────────────────────────────────
function CustomItemForm({
  category, categoryTitle, onAdd, editingItem, currentQty, onUpdate, onCancelEdit,
}: {
  category: CategoryId;
  categoryTitle: string;
  onAdd: BuilderProps['addCustomItem'];
  editingItem: CatalogItem | null;
  currentQty: number;
  onUpdate: (data: { title: string; description?: string; price: number; qty: number; sst: SstRate; type: ItemType; category: CategoryId; subcategory?: string }) => void;
  onCancelEdit: () => void;
}) {
  // Sensible defaults per category — hardware is 0% SST one-time, services are
  // 8% SST. User can override either via the buttons below.
  const defaultSst: SstRate = category === 'hardware' ? 0 : 0.08;
  const defaultType: ItemType = category === 'software' ? 'recurring' : 'one-time';

  const [open, setOpen] = useState(false);
  const [subcategory, setSubcategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('1');
  const [sst, setSst] = useState<SstRate>(defaultSst);
  const [type, setType] = useState<ItemType>(defaultType);
  const formRef = useRef<HTMLFormElement | null>(null);

  const isEditing = editingItem !== null;

  const reset = () => {
    setSubcategory(''); setTitle(''); setDescription(''); setPrice(''); setUnit('1');
    setSst(defaultSst); setType(defaultType);
  };

  useEffect(() => {
    if (editingItem) {
      setSubcategory(editingItem.subcategory ?? '');
      setTitle(editingItem.title);
      setDescription(editingItem.description ?? '');
      setPrice(String(editingItem.price));
      setUnit(String(Math.max(1, currentQty)));
      setSst(editingItem.sst);
      setType(editingItem.type);
      setOpen(true);
      requestAnimationFrame(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
    // intentionally only re-run when editingItem changes (prefill once on entry)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingItem?.id]);

  const priceNum = parseFloat(price);
  const unitNum = parseInt(unit, 10);
  const canSubmit = title.trim().length > 0 && !isNaN(priceNum) && priceNum >= 0 && !isNaN(unitNum) && unitNum > 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const data = {
      title: title.trim(),
      description: description.trim() || undefined,
      price: priceNum,
      qty: unitNum,
      sst,
      type,
      category,
      subcategory: subcategory.trim() || undefined,
    };
    if (isEditing) {
      onUpdate(data);
    } else {
      onAdd(data);
    }
    reset();
    setOpen(false);
  };

  const cancel = () => {
    reset();
    setOpen(false);
    if (isEditing) onCancelEdit();
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mb-4 w-full border-2 border-dashed border-white/30 hover:border-white/60 text-white/70 hover:text-white text-[12px] font-mono font-bold uppercase tracking-wider py-3 inline-flex items-center justify-center gap-2 transition-colors"
      >
        <Plus size={14} strokeWidth={2.5} /> Add {categoryTitle} Item
      </button>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} className="mb-4 border-2 p-4" style={{ borderColor: 'var(--qs-accent)', backgroundColor: 'var(--qs-accent-soft)' }}>
      <p className="text-[10px] font-mono font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--qs-accent)' }}>
        {isEditing ? 'Editing' : 'New'} · {categoryTitle}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Subheader (subcategory)" value={subcategory} onChange={setSubcategory} placeholder={category === 'hardware' ? 'e.g. POS, KIOSK, Cash Drawer' : 'e.g. Monthly Subscription'} />
        <Field label="Title" value={title} onChange={setTitle} placeholder="e.g. On-site training (per session)" required />
        <label className="block md:col-span-2">
          <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/60 mb-1.5">Description (optional)</span>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Short note shown on the card (supports multiple lines)"
            rows={3}
            className="w-full bg-black border-2 border-white/20 focus:border-white/60 focus:outline-none text-white text-[13px] px-3 py-2.5 resize-y"
          />
        </label>
        <label className="block">
          <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/60 mb-1.5">Unit Price (RM) <span style={{ color: 'var(--qs-accent)' }}>*</span></span>
          <input type="number" inputMode="decimal" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)}
            className="w-full bg-black border-2 border-white/20 focus:border-white/60 focus:outline-none text-white text-[13px] px-3 py-2.5" />
        </label>
        <label className="block">
          <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/60 mb-1.5">Quantity <span style={{ color: 'var(--qs-accent)' }}>*</span></span>
          <input type="number" inputMode="numeric" min="1" step="1" value={unit} onChange={e => setUnit(e.target.value)}
            className="w-full bg-black border-2 border-white/20 focus:border-white/60 focus:outline-none text-white text-[13px] px-3 py-2.5" />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
        <div>
          <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/60 mb-1.5">Billing</span>
          <div className="flex gap-2">
            {(['one-time', 'recurring', 'yearly'] as ItemType[]).map(t => (
              <button key={t} type="button" onClick={() => setType(t)}
                className={`flex-1 border-2 py-2 text-[11px] font-mono font-bold uppercase tracking-wider transition-colors ${type === t ? '' : 'border-white/20 text-white/70 hover:border-white/60'}`}
                style={type === t ? { backgroundColor: 'var(--qs-accent)', borderColor: 'var(--qs-accent)', color: 'var(--qs-on-accent)' } : {}}>
                {t === 'one-time' ? 'One-Time' : t === 'recurring' ? 'Monthly' : 'Yearly'}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/60 mb-1.5">Tax Rate</span>
          <div className="flex gap-2">
            {([0, 0.08] as SstRate[]).map(r => (
              <button key={r} type="button" onClick={() => setSst(r)}
                className={`flex-1 border-2 py-2 text-[12px] font-mono font-bold uppercase tracking-wider transition-colors ${sst === r ? '' : 'border-white/20 text-white/70 hover:border-white/60'}`}
                style={sst === r ? { backgroundColor: 'var(--qs-accent)', borderColor: 'var(--qs-accent)', color: 'var(--qs-on-accent)' } : {}}>
                {r === 0 ? '0% SST' : '8% SST'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button type="submit" disabled={!canSubmit}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[12px] font-black uppercase tracking-wider transition-opacity disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90"
          style={{ backgroundColor: 'var(--qs-accent)', color: 'var(--qs-on-accent)' }}>
          {isEditing ? 'Save Changes' : 'Add to Quote'}
        </button>
        <button type="button" onClick={cancel}
          className="px-4 py-2.5 border-2 border-white/30 hover:border-white/60 text-white/80 hover:text-white text-[12px] font-bold uppercase tracking-wider transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
