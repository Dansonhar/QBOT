// ─────────────────────────────────────────────────────────────────────────
// Canonical Malaysia SST math for ALL quote tools (QuoteStudio, QuoteSys, …).
//
// This is the single source of truth for "SST on a discounted base". Both
// quote builders MUST route their discount + SST through this file so the
// numbers tie out to the accounting invoice to the cent.
//
// ── CURRENT MODEL (2026-08-04): the discount is entered PER SST BAND ────────
// A quote mixes 0%-SST hardware with 8%-SST software/services, so a single
// "master discount" can never be attributed correctly — whatever the tool
// guesses (all-on-taxable, or pro-rata) is wrong for any deal where the rep
// actually meant "RM1,000 off the hardware and RM5,000 off the software".
// So the discount is now TWO numbers, each clamped to its own band:
//
//     hardware net = zeroRatedPool − hardwareDiscount   → ×0%  (no SST)
//     software net = taxablePool   − softwareDiscount   → ×8%
//     grand total  = fullSubtotal − (hwDisc + swDisc) + SST
//
//   e.g. hardware 10,000 · software 20,000 · −1,000 hw · −5,000 sw
//        →  9,000 (0%) + 15,000 × 1.08 (16,200)  =  RM 25,200
//
// See {@link splitDiscountSst} — that is the function to use for new work.
//
// ── LEGACY MODEL (single master discount) ───────────────────────────────────
// Quotes saved before the split still carry one `discountValue`. They keep
// computing through {@link sstOnDiscountedBase} so a shared quote link never
// changes its numbers after the fact. The rule there, and why the obvious
// shortcuts were wrong:
//   • SST is charged on the amount AFTER the discount — never the pre-discount
//     value. (Tax-after-discount is a legal requirement; charging on the gross
//     over-collects tax. This was the QuoteStudio bug.)
//   • The discount was spread PRO-RATA across the whole subtotal — taxable AND
//     non-taxable lines. Only the share landing on the 8% lines reduced the
//     SST base; the share landing on 0% hardware gave no relief. Subtracting
//     the whole discount off the taxable lines first OVER-credits relief
//     whenever 0% lines are present. (This was the QuoteSys bug.)
// Do NOT route new work through it — it is kept only to replay old quotes.
//
// Keep this file pure (no React, no I/O) so it stays unit-testable.
// ─────────────────────────────────────────────────────────────────────────

/** Malaysia Sales & Service Tax rate for taxable services/software. */
export const SST_RATE = 0.08;

/** A discount as the user typed it — an RM amount or a % of its own pool. */
export interface DiscountInput {
  mode: 'rm' | 'pct';
  value: number;
}

/**
 * Resolve a {@link DiscountInput} to an RM amount, clamped to `[0, pool]`.
 * A % is always a percentage OF THAT POOL, never of the whole quote.
 */
export function resolveDiscount(pool: number, d: DiscountInput | null | undefined): number {
  if (!d || !(d.value > 0) || !(pool > 0)) return 0;
  const raw = d.mode === 'pct' ? pool * (d.value / 100) : d.value;
  if (!Number.isFinite(raw) || raw <= 0) return 0;
  return Math.min(raw, pool);
}

const fmtRM = (n: number) => n.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * The ONE row a split discount gets in an order summary:
 *
 *   Total Discount (Hardwares: RM1,000.00, Software & Services: RM5,000.00)
 *
 * Only bands with an actual discount are listed, and `null` comes back when
 * there's no discount at all — the caller's signal to render no row, so a
 * customer never sees "−RM 0.00". Lives here, next to the math, so the three
 * quote surfaces that print it can't word it three different ways.
 */
export function discountSummaryLabel(hardwareDiscount: number, softwareDiscount: number): string | null {
  const parts: string[] = [];
  if (hardwareDiscount > 0) parts.push(`Hardwares: RM${fmtRM(hardwareDiscount)}`);
  if (softwareDiscount > 0) parts.push(`Software & Services: RM${fmtRM(softwareDiscount)}`);
  return parts.length > 0 ? `Total Discount (${parts.join(', ')})` : null;
}

// ─────────────────────────────────────────────────────────────────────────
// PER-BAND DISCOUNT — the current model. Each discount stays inside its own
// SST band, so the 8% base is exactly `taxablePool − softwareDiscount` and the
// 0% discount never touches the tax at all.
// ─────────────────────────────────────────────────────────────────────────

export interface SplitDiscountInput {
  /** Everything rated 0% SST that the hardware discount may come off. */
  zeroRatedPool: number;
  /** Everything rated 8% SST that the software/services discount may come off. */
  taxablePool: number;
  /** Discount on the 0%-SST (hardware) band. */
  hardwareDiscount?: DiscountInput | null;
  /** Discount on the 8%-SST (software / services) band. */
  softwareDiscount?: DiscountInput | null;
  /** SST rate; defaults to {@link SST_RATE}. */
  rate?: number;
}

export interface SplitDiscountResult {
  /** RM taken off the 0% band (clamped to `zeroRatedPool`). */
  hardwareDiscount: number;
  /** RM taken off the 8% band (clamped to `taxablePool`). */
  softwareDiscount: number;
  /** `hardwareDiscount + softwareDiscount` — for the single "Discount" row. */
  discount: number;
  /** `zeroRatedPool − hardwareDiscount` — carries no SST. */
  zeroRatedBase: number;
  /** `taxablePool − softwareDiscount` — the base SST is charged on. */
  taxableBase: number;
  /** `taxableBase × rate`. */
  sst: number;
}

/**
 * Apply a per-band discount and charge SST on the discounted 8% band only.
 * No pro-rata, no cross-band bleed: what the rep types off hardware stays off
 * hardware. See the file header for the worked example.
 */
export function splitDiscountSst(i: SplitDiscountInput): SplitDiscountResult {
  const rate = i.rate ?? SST_RATE;
  const zeroRatedPool = Math.max(0, i.zeroRatedPool);
  const taxablePool = Math.max(0, i.taxablePool);

  const hardwareDiscount = resolveDiscount(zeroRatedPool, i.hardwareDiscount);
  const softwareDiscount = resolveDiscount(taxablePool, i.softwareDiscount);

  const zeroRatedBase = zeroRatedPool - hardwareDiscount;
  const taxableBase = taxablePool - softwareDiscount;

  return {
    hardwareDiscount,
    softwareDiscount,
    discount: hardwareDiscount + softwareDiscount,
    zeroRatedBase,
    taxableBase,
    sst: taxableBase * rate,
  };
}

export interface SstOnDiscountedBaseInput {
  /**
   * Full pre-discount subtotal the discount is spread across — the sum of the
   * taxable AND non-taxable lines the discount applies to.
   */
  subtotal: number;
  /** The 8%-taxable portion of `subtotal`, before the discount is applied. */
  taxablePreDiscount: number;
  /** Master discount amount (RM). Clamped to [0, subtotal] internally. */
  discount: number;
  /** SST rate; defaults to {@link SST_RATE}. */
  rate?: number;
}

export interface SstResult {
  /** The discounted 8%-taxable base that SST is actually charged on. */
  taxableBase: number;
  /** SST amount = `taxableBase * rate`. */
  sst: number;
}

/**
 * LEGACY — single master discount spread pro-rata across the whole subtotal.
 * Kept so quotes saved before the per-band split replay with the exact numbers
 * their customer was shown. New work uses {@link splitDiscountSst}.
 */
export function sstOnDiscountedBase(input: SstOnDiscountedBaseInput): SstResult {
  const rate = input.rate ?? SST_RATE;
  const subtotal = Math.max(0, input.subtotal);
  const taxablePreDiscount = Math.max(0, Math.min(input.taxablePreDiscount, subtotal));
  const discount = Math.max(0, Math.min(input.discount, subtotal));

  // Share of the subtotal that is taxable → share of the discount that lands
  // on taxable lines and therefore reduces the SST base.
  const taxableShare = subtotal > 0 ? taxablePreDiscount / subtotal : 0;
  const taxableBase = Math.max(0, taxablePreDiscount - discount * taxableShare);

  return { taxableBase, sst: taxableBase * rate };
}

// ─────────────────────────────────────────────────────────────────────────
// Whole-quote money for the QuoteStudio builder. The discount + SST + grand
// total MUST be derived here so the live builder and the saved/shared quote
// view can never disagree (the view recomputes from saved line pools instead
// of trusting a frozen `totals` snapshot — old quotes self-heal). Pools are
// post-line-discount, pre-master-discount.
// ─────────────────────────────────────────────────────────────────────────

export interface QuoteMoneyInput {
  /** 0%-SST one-time hardware. */
  hardwareSubtotal: number;
  /** Custom one-time lines (taxable + non-taxable). */
  customOneTime: number;
  /** The 8%-taxable portion of `customOneTime`. */
  customSstableOneTime: number;
  /** Annual subscriptions (taxable + non-taxable). */
  subscriptionSubtotal: number;
  /** The 8%-taxable portion of `subscriptionSubtotal`. */
  sstableSubscription: number;
  /** Setup / gateway / delivery — always fully 8%-taxable. */
  servicesSubtotal: number;
  /**
   * Discount on the 0%-SST band: hardware + any 0%-rated custom / subscription
   * line. Presence of this OR {@link softwareDiscount} selects the per-band model.
   */
  hardwareDiscount?: DiscountInput | null;
  /** Discount on the 8%-SST band: taxable custom, taxable subscription, services. */
  softwareDiscount?: DiscountInput | null;
  /**
   * LEGACY single master discount, from a quote saved before the per-band split.
   * Only consulted when neither band discount is supplied. `discountMode` /
   * `discountValue` are the older spelling of the same thing.
   */
  discountMode?: 'rm' | 'pct';
  discountValue?: number;
  rate?: number;
}

export interface QuoteMoneyResult {
  fullSubtotal: number;
  /** True when the per-band model was used; false for a replayed legacy quote. */
  split: boolean;
  /** Sum of every 0%-SST line — the hardware discount's ceiling. */
  zeroRatedPool: number;
  /** Sum of every 8%-SST line — the software/services discount's ceiling. */
  taxablePool: number;
  /** RM off the 0% band. */
  hardwareDiscount: number;
  /** RM off the 8% band. */
  softwareDiscount: number;
  /** What the legacy master discount could come off. Legacy replay only. */
  discountablePool: number;
  /** Total discount = hardware + software (or the legacy master discount). */
  discount: number;
  taxableBase: number;
  sst: number;
  grandTotal: number;
}

/**
 * Whole-quote money for a quote builder.
 *
 * Per-band model (default for anything built today): the hardware discount comes
 * off the 0% pool and the software/services discount off the 8% pool, SST is
 * charged on `taxablePool − softwareDiscount`, and the grand total is
 * `subtotal − discount + SST`. Both bands are discountable in full — including
 * the annual subscription, which IS the "software" a rep discounts.
 *
 * Legacy replay (`discountMode` / `discountValue` with no band discounts): the
 * single master discount came off hardware + custom one-time + services only,
 * with its SST relief spread pro-rata (see {@link sstOnDiscountedBase}).
 */
export function computeQuoteMoney(i: QuoteMoneyInput): QuoteMoneyResult {
  const fullSubtotal = i.hardwareSubtotal + i.customOneTime + i.subscriptionSubtotal + i.servicesSubtotal;

  // Bands. Every line is in exactly one, so the two always sum to fullSubtotal.
  const taxablePool = i.customSstableOneTime + i.sstableSubscription + i.servicesSubtotal;
  const zeroRatedPool = Math.max(0, fullSubtotal - taxablePool);

  const hasSplit = !!i.hardwareDiscount || !!i.softwareDiscount;
  if (hasSplit) {
    const s = splitDiscountSst({
      zeroRatedPool,
      taxablePool,
      hardwareDiscount: i.hardwareDiscount,
      softwareDiscount: i.softwareDiscount,
      rate: i.rate,
    });
    return {
      fullSubtotal,
      split: true,
      zeroRatedPool,
      taxablePool,
      hardwareDiscount: s.hardwareDiscount,
      softwareDiscount: s.softwareDiscount,
      discountablePool: fullSubtotal,
      discount: s.discount,
      taxableBase: s.taxableBase,
      sst: s.sst,
      grandTotal: fullSubtotal - s.discount + s.sst,
    };
  }

  // ── Legacy replay ──────────────────────────────────────────────────────
  // The old master discount applied to everything ONE-TIME — hardware, custom
  // one-time AND the fixed services (setup / gateway / delivery) — but NOT the
  // annual subscription. Its SST relief was spread pro-rata across the whole
  // subtotal. Reproduced verbatim so shared quote links never move.
  const discountablePool = i.hardwareSubtotal + i.customOneTime + i.servicesSubtotal;
  const raw = i.discountMode === 'pct'
    ? discountablePool * ((i.discountValue ?? 0) / 100)
    : (i.discountValue ?? 0);
  const discount = Math.max(0, Math.min(Number.isFinite(raw) ? raw : 0, discountablePool));

  const { taxableBase, sst } = sstOnDiscountedBase({
    subtotal: fullSubtotal,
    taxablePreDiscount: taxablePool,
    discount,
    rate: i.rate,
  });

  return {
    fullSubtotal,
    split: false,
    zeroRatedPool,
    taxablePool,
    hardwareDiscount: 0,
    softwareDiscount: 0,
    discountablePool,
    discount,
    taxableBase,
    sst,
    grandTotal: fullSubtotal - discount + sst,
  };
}

/**
 * Migrate a legacy single master discount into the two bands, preserving the
 * total RM off. The split follows the composition of the pool the old discount
 * actually applied to (hardware + custom one-time + services), so the money
 * lands where it always did — only the SST changes, which is the point.
 */
export function migrateLegacyDiscount(i: {
  hardwareSubtotal: number;
  customOneTime: number;
  customSstableOneTime: number;
  servicesSubtotal: number;
  legacy: DiscountInput | null | undefined;
}): { hardwareDiscount: number; softwareDiscount: number } {
  const pool = i.hardwareSubtotal + i.customOneTime + i.servicesSubtotal;
  const discount = resolveDiscount(pool, i.legacy);
  if (discount <= 0) return { hardwareDiscount: 0, softwareDiscount: 0 };

  const taxableInPool = i.customSstableOneTime + i.servicesSubtotal;
  const taxableShare = pool > 0 ? Math.min(1, taxableInPool / pool) : 0;
  const softwareDiscount = discount * taxableShare;
  return { hardwareDiscount: discount - softwareDiscount, softwareDiscount };
}
