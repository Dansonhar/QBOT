import { describe, it, expect } from 'vitest';
import {
  sstOnDiscountedBase, splitDiscountSst, resolveDiscount, computeQuoteMoney, discountSummaryLabel,
  migrateLegacyDiscount, SST_RATE,
} from './sstMath';

const round2 = (n: number) => Math.round(n * 100) / 100;

describe('splitDiscountSst (per-SST-band discount — the current model)', () => {
  // ── GOLDEN CASE — the brief this model was built from ───────────────────
  //   hardware 10,000 · software 20,000 · −1,000 hardware · −5,000 software
  //   → 9,000 (0%) + 15,000 × 1.08 = 16,200  →  RM 25,200
  it('worked example ties out to RM 25,200', () => {
    const r = splitDiscountSst({
      zeroRatedPool: 10000,
      taxablePool: 20000,
      hardwareDiscount: { mode: 'rm', value: 1000 },
      softwareDiscount: { mode: 'rm', value: 5000 },
    });
    expect(r.zeroRatedBase).toBe(9000);
    expect(r.taxableBase).toBe(15000);
    expect(round2(r.sst)).toBe(1200);
    expect(r.discount).toBe(6000);
    expect(round2(r.zeroRatedBase + r.taxableBase + r.sst)).toBe(25200);
  });

  it('the hardware discount NEVER changes the SST (the whole point)', () => {
    const base = { zeroRatedPool: 10000, taxablePool: 20000, softwareDiscount: { mode: 'rm' as const, value: 5000 } };
    const noHw = splitDiscountSst({ ...base });
    const bigHw = splitDiscountSst({ ...base, hardwareDiscount: { mode: 'rm', value: 9999 } });
    expect(bigHw.sst).toBe(noHw.sst);
    expect(bigHw.taxableBase).toBe(noHw.taxableBase);
  });

  it('SST is charged on taxablePool − softwareDiscount exactly — no pro-rata bleed', () => {
    const r = splitDiscountSst({
      zeroRatedPool: 10000,
      taxablePool: 20000,
      softwareDiscount: { mode: 'rm', value: 5000 },
    });
    expect(r.taxableBase).toBe(15000);
    // The old pro-rata model would have credited only 5000 × (20000/30000).
    expect(r.taxableBase).not.toBe(20000 - 5000 * (20000 / 30000));
  });

  it('a % is a % OF ITS OWN BAND, not of the whole quote', () => {
    const r = splitDiscountSst({
      zeroRatedPool: 10000,
      taxablePool: 20000,
      hardwareDiscount: { mode: 'pct', value: 10 },
      softwareDiscount: { mode: 'pct', value: 25 },
    });
    expect(r.hardwareDiscount).toBe(1000);  // 10% of 10,000
    expect(r.softwareDiscount).toBe(5000);  // 25% of 20,000
  });

  it('clamps each band to its own pool — no bleeding into the other', () => {
    const r = splitDiscountSst({
      zeroRatedPool: 1000,
      taxablePool: 500,
      hardwareDiscount: { mode: 'rm', value: 9999 },
      softwareDiscount: { mode: 'rm', value: 9999 },
    });
    expect(r.hardwareDiscount).toBe(1000);
    expect(r.softwareDiscount).toBe(500);
    expect(r.taxableBase).toBe(0);
    expect(r.sst).toBe(0);
  });

  it('an all-hardware quote never produces SST', () => {
    const r = splitDiscountSst({
      zeroRatedPool: 10000,
      taxablePool: 0,
      hardwareDiscount: { mode: 'rm', value: 1000 },
      softwareDiscount: { mode: 'rm', value: 500 },
    });
    expect(r.softwareDiscount).toBe(0);
    expect(r.sst).toBe(0);
  });

  it('no discounts → SST on the full taxable band', () => {
    const r = splitDiscountSst({ zeroRatedPool: 10000, taxablePool: 20000 });
    expect(r.discount).toBe(0);
    expect(round2(r.sst)).toBe(1600);
  });

  it('handles an empty quote without dividing by zero', () => {
    const r = splitDiscountSst({ zeroRatedPool: 0, taxablePool: 0 });
    expect(r.discount).toBe(0);
    expect(r.sst).toBe(0);
  });
});

describe('discountSummaryLabel (the single order-summary row)', () => {
  it('lists both bands when both are discounted', () => {
    expect(discountSummaryLabel(1000, 5618.8))
      .toBe('Total Discount (Hardwares: RM1,000.00, Software & Services: RM5,618.80)');
  });

  it('lists only the band that has a discount', () => {
    expect(discountSummaryLabel(1000, 0)).toBe('Total Discount (Hardwares: RM1,000.00)');
    expect(discountSummaryLabel(0, 5000)).toBe('Total Discount (Software & Services: RM5,000.00)');
  });

  it('returns null when there is no discount — caller renders no row', () => {
    expect(discountSummaryLabel(0, 0)).toBeNull();
  });
});

describe('resolveDiscount', () => {
  it('resolves RM and % against the pool, clamped to it', () => {
    expect(resolveDiscount(1000, { mode: 'rm', value: 250 })).toBe(250);
    expect(resolveDiscount(1000, { mode: 'pct', value: 12.5 })).toBe(125);
    expect(resolveDiscount(1000, { mode: 'rm', value: 5000 })).toBe(1000);
    expect(resolveDiscount(1000, { mode: 'pct', value: 250 })).toBe(1000);
  });

  it('treats missing / zero / negative / NaN input as no discount', () => {
    expect(resolveDiscount(1000, undefined)).toBe(0);
    expect(resolveDiscount(1000, null)).toBe(0);
    expect(resolveDiscount(1000, { mode: 'rm', value: 0 })).toBe(0);
    expect(resolveDiscount(1000, { mode: 'rm', value: -50 })).toBe(0);
    expect(resolveDiscount(1000, { mode: 'rm', value: NaN })).toBe(0);
    expect(resolveDiscount(0, { mode: 'rm', value: 100 })).toBe(0);
  });
});

describe('sstOnDiscountedBase (LEGACY — replays pre-split quotes)', () => {
  // ── GOLDEN CASE — locks the bug that started all this ───────────────────
  // Towerclub Penang, quote QS-260611-0044. Must match the accounting invoice
  // exactly: RM 45,287.08. If this ever fails, the SST math has regressed.
  it('Towerclub Penang QS-260611-0044 ties out to the invoice (RM 45,287.08)', () => {
    const hardware = 4080;       // 0% SST
    const customization = 33000; // 8% SST
    const subscription = 8388;   // 8% SST (annual)
    const setupDelivery = 500;   // 8% SST
    const discount = 3758;

    const subtotal = hardware + customization + subscription + setupDelivery; // 45,968
    const taxablePreDiscount = customization + subscription + setupDelivery;  // 41,888

    const { taxableBase, sst } = sstOnDiscountedBase({ subtotal, taxablePreDiscount, discount });
    const grandTotal = subtotal - discount + sst;

    expect(round2(taxableBase)).toBe(38463.55);
    expect(round2(sst)).toBe(3077.08);
    expect(round2(grandTotal)).toBe(45287.08);
  });

  // ── INVARIANTS — the two bugs we never want back ────────────────────────
  it('charges SST on the POST-discount base, never the pre-discount value', () => {
    // All taxable: 1000 taxable, 100 off → base 900, SST 72 (not 80).
    const r = sstOnDiscountedBase({ subtotal: 1000, taxablePreDiscount: 1000, discount: 100 });
    expect(r.taxableBase).toBe(900);
    expect(r.sst).toBeCloseTo(72, 9);
  });

  it('spreads the discount pro-rata: 0% lines absorb their share (no SST relief)', () => {
    // Half taxable / half 0% hardware; 200 discount → only 100 lands on taxable.
    const r = sstOnDiscountedBase({ subtotal: 1000, taxablePreDiscount: 500, discount: 200 });
    expect(r.taxableBase).toBe(400); // 500 - 200 * (500/1000)
    expect(r.sst).toBeCloseTo(32, 9);
  });

  it('does NOT take the whole discount off the taxable lines first (the QuoteSys bug)', () => {
    const proRata = sstOnDiscountedBase({ subtotal: 1000, taxablePreDiscount: 500, discount: 200 });
    const offTaxableFirst = Math.max(0, 500 - 200); // 300 — the old, under-charging behaviour
    expect(proRata.taxableBase).toBeGreaterThan(offTaxableFirst);
  });

  it('with no 0% lines, pro-rata equals plain (taxable − discount)', () => {
    const r = sstOnDiscountedBase({ subtotal: 800, taxablePreDiscount: 800, discount: 250 });
    expect(r.taxableBase).toBe(550);
  });

  it('no discount → SST on the full taxable portion', () => {
    const r = sstOnDiscountedBase({ subtotal: 1000, taxablePreDiscount: 600, discount: 0 });
    expect(r.taxableBase).toBe(600);
    expect(r.sst).toBeCloseTo(48, 9);
  });

  it('clamps a discount larger than the subtotal to zero base / zero SST', () => {
    const r = sstOnDiscountedBase({ subtotal: 1000, taxablePreDiscount: 800, discount: 5000 });
    expect(r.taxableBase).toBe(0);
    expect(r.sst).toBe(0);
  });

  it('handles an all-hardware (0% taxable) quote: no SST regardless of discount', () => {
    const r = sstOnDiscountedBase({ subtotal: 1000, taxablePreDiscount: 0, discount: 100 });
    expect(r.taxableBase).toBe(0);
    expect(r.sst).toBe(0);
  });

  it('handles an empty quote without dividing by zero', () => {
    const r = sstOnDiscountedBase({ subtotal: 0, taxablePreDiscount: 0, discount: 0 });
    expect(r.taxableBase).toBe(0);
    expect(r.sst).toBe(0);
  });

  it('exposes the rate as 8%', () => {
    expect(SST_RATE).toBe(0.08);
  });
});

describe('computeQuoteMoney (whole-quote, builder === view)', () => {
  // The same Towerclub quote, as POOLS — must produce the invoice total whether
  // computed by the live builder or recomputed by the saved-quote view.
  // Real saved quote 6d2e42adc9: POS self-service hardware 4080 (0%),
  // Customization 30000 + On-site Training 3000 (8% custom), Delivery WM 500
  // (8% service), Studio Advanced 699×12 = 8388 (8% subscription), 10% discount.
  const towerclub = {
    hardwareSubtotal: 4080,        // 0% SST
    customOneTime: 33000,          // customization + training, 8%
    customSstableOneTime: 33000,
    subscriptionSubtotal: 8388,    // 8% annual
    sstableSubscription: 8388,
    servicesSubtotal: 500,         // delivery WM, 8%
  } as const;

  // ── Per-band model — what every quote built today uses ──────────────────
  it('the worked example ties out to RM 25,200 end-to-end', () => {
    // hardware 10,000 (0%) · software 20,000 (8% annual) · −1,000 hw · −5,000 sw
    const m = computeQuoteMoney({
      hardwareSubtotal: 10000,
      customOneTime: 0,
      customSstableOneTime: 0,
      subscriptionSubtotal: 20000,
      sstableSubscription: 20000,
      servicesSubtotal: 0,
      hardwareDiscount: { mode: 'rm', value: 1000 },
      softwareDiscount: { mode: 'rm', value: 5000 },
    });
    expect(m.split).toBe(true);
    expect(m.zeroRatedPool).toBe(10000);
    expect(m.taxablePool).toBe(20000);
    expect(m.discount).toBe(6000);
    expect(m.taxableBase).toBe(15000);
    expect(round2(m.sst)).toBe(1200);
    expect(round2(m.grandTotal)).toBe(25200);
  });

  it('splits the bands correctly when a quote mixes all four pools', () => {
    const m = computeQuoteMoney({ ...towerclub, hardwareDiscount: { mode: 'rm', value: 80 }, softwareDiscount: { mode: 'rm', value: 1888 } });
    expect(m.zeroRatedPool).toBe(4080);                    // hardware only
    expect(m.taxablePool).toBe(33000 + 8388 + 500);        // custom + subs + services
    expect(m.zeroRatedPool + m.taxablePool).toBe(m.fullSubtotal);
    expect(m.taxableBase).toBe(41888 - 1888);
    expect(round2(m.sst)).toBe(round2(40000 * 0.08));
    expect(round2(m.grandTotal)).toBe(round2(m.fullSubtotal - m.discount + m.sst));
  });

  it('the software band INCLUDES the annual subscription (that IS the software)', () => {
    const m = computeQuoteMoney({ ...towerclub, softwareDiscount: { mode: 'pct', value: 100 } });
    expect(round2(m.softwareDiscount)).toBe(41888);
    expect(m.taxableBase).toBe(0);
    expect(m.sst).toBe(0);
  });

  it('grand total always reconciles under the split model too', () => {
    const m = computeQuoteMoney({ ...towerclub, hardwareDiscount: { mode: 'pct', value: 7 }, softwareDiscount: { mode: 'pct', value: 3 } });
    expect(round2(m.grandTotal)).toBe(round2(m.fullSubtotal - m.discount + m.sst));
  });

  // ── Legacy replay — an already-sent quote must never move ───────────────
  it('10% discount (delivery IN the base) ties out to RM 45,287.08', () => {
    const m = computeQuoteMoney({ ...towerclub, discountMode: 'pct', discountValue: 10 });
    expect(round2(m.discount)).toBe(3758); // 10% of 37,580 = hw+custom+services
    expect(round2(m.taxableBase)).toBe(38463.55);
    expect(round2(m.sst)).toBe(3077.08);
    expect(round2(m.grandTotal)).toBe(45287.08);
  });

  it('the discountable pool includes services, not just hardware+custom', () => {
    const m = computeQuoteMoney({ ...towerclub, discountMode: 'pct', discountValue: 10 });
    expect(m.discountablePool).toBe(37580); // 4080 + 33000 + 500 (NOT 37080)
  });

  it('RM-value discount of 3758 also gives RM 45,287.08', () => {
    const m = computeQuoteMoney({ ...towerclub, discountMode: 'rm', discountValue: 3758 });
    expect(round2(m.grandTotal)).toBe(45287.08);
  });

  it('grand total always reconciles: subtotal − discount + SST', () => {
    const m = computeQuoteMoney({ ...towerclub, discountMode: 'rm', discountValue: 1234 });
    expect(round2(m.grandTotal)).toBe(round2(m.fullSubtotal - m.discount + m.sst));
  });

  it('no discount → SST on the full taxable subtotal', () => {
    const m = computeQuoteMoney({ ...towerclub, discountMode: 'rm', discountValue: 0 });
    expect(m.discount).toBe(0);
    expect(round2(m.sst)).toBe(round2((33000 + 8388 + 500) * 0.08));
  });

  it('a legacy quote replays pro-rata — a band discount is what opts into the new math', () => {
    const legacy = computeQuoteMoney({ ...towerclub, discountMode: 'pct', discountValue: 10 });
    expect(legacy.split).toBe(false);
    expect(round2(legacy.grandTotal)).toBe(45287.08);   // unchanged, as sent
  });
});

describe('migrateLegacyDiscount (old saved quote → two bands)', () => {
  const pools = {
    hardwareSubtotal: 4080,
    customOneTime: 33000,
    customSstableOneTime: 33000,
    servicesSubtotal: 500,
  };

  it('preserves the total RM off, split by the old pool composition', () => {
    const m = migrateLegacyDiscount({ ...pools, legacy: { mode: 'pct', value: 10 } });
    // Old pool = 4080 + 33000 + 500 = 37,580 → 10% = 3,758.
    expect(round2(m.hardwareDiscount + m.softwareDiscount)).toBe(3758);
    // 33,500 of that 37,580 is 8%-rated.
    expect(round2(m.softwareDiscount)).toBe(round2(3758 * (33500 / 37580)));
  });

  it('an all-hardware quote migrates entirely to the 0% band', () => {
    const m = migrateLegacyDiscount({
      hardwareSubtotal: 10000, customOneTime: 0, customSstableOneTime: 0, servicesSubtotal: 0,
      legacy: { mode: 'rm', value: 1000 },
    });
    expect(m.hardwareDiscount).toBe(1000);
    expect(m.softwareDiscount).toBe(0);
  });

  it('no legacy discount → nothing to migrate', () => {
    expect(migrateLegacyDiscount({ ...pools, legacy: null })).toEqual({ hardwareDiscount: 0, softwareDiscount: 0 });
  });
});
