import React, { useState, useMemo } from 'react';
import { Info, Check, X, MessageCircle } from 'lucide-react';
import { trackWhatsAppClick } from '../utils/trackWhatsApp';

// ── Tooltip Component ───────────────────────────────────────
const InfoTip: React.FC<{ text: string }> = ({ text }) => {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex ml-1.5 align-middle">
      <span
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="cursor-help text-gray-400 hover:text-black transition-colors"
      >
        <Info className="w-3.5 h-3.5" />
      </span>
      {show && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-[10px] leading-snug rounded-lg shadow-xl whitespace-nowrap max-w-[260px] text-wrap pointer-events-none">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-900" />
        </span>
      )}
    </span>
  );
};

// ── Data ─────────────────────────────────────────────────────
const BUNDLES = [
  { key: 'a', label: 'BUNDLE A', name: 'Basic', highlight: false },
  { key: 'b', label: 'BUNDLE B', name: 'Essentials', highlight: false },
  { key: 'c', label: 'BUNDLE C', name: '3-in-1 (POS, mPOS, Kiosk)', highlight: true },
  { key: 'd', label: 'BUNDLE D', name: 'Full', highlight: false },
];

interface RowData {
  label: string;
  tooltip: string;
  values: string[];
}

const HARDWARE_ROWS: RowData[] = [
  {
    label: 'POS Type',
    tooltip: 'The hardware model included in this bundle',
    values: ['QBOT V3', 'QBOT CPAD 11"', 'QBOT V3 MIX', 'QBOT D3 PRO'],
  },
  {
    label: 'POS Base',
    tooltip: 'The stand/base that holds the POS terminal',
    values: ['Included', 'Included (Standard Base)', 'Included', 'Included'],
  },
  {
    label: 'Receipt Printer',
    tooltip: 'Thermal receipt printer for customer receipts',
    values: ['Built-in', 'Included', 'Built-in', 'Included'],
  },
  {
    label: 'Payment Terminal',
    tooltip: 'Integrated card & e-wallet payment acceptance',
    values: ['Built-in', 'Built-in', 'Built-in', 'Built-in'],
  },
  {
    label: 'QPOS AI Software (6 Months)',
    tooltip: 'Standard plan included free for 6 months, plus 2 extra months on the Plus plan upgrade',
    values: [
      'Standard (Free Plus Plan 2 Mths)',
      'Standard (Free Plus Plan 2 Mths)',
      'Standard (Free Plus Plan 2 Mths)',
      'Standard (Free Plus Plan 2 Mths)',
    ],
  },
  {
    label: 'Online Training',
    tooltip: 'Remote onboarding session to get your team up and running',
    values: ['Included', 'Included', 'Included', 'Included'],
  },
  {
    label: 'Installation (Coverage Area)',
    tooltip: 'On-site setup and installation within our coverage area',
    values: ['Included', 'Included', 'Included', 'Included'],
  },
  {
    label: 'First Time Menu Setup',
    tooltip: 'We help configure your menu, modifiers and categories',
    values: ['Included', 'Included', 'Included', 'Included'],
  },
  {
    label: '6 Months After-Sales Service',
    tooltip: 'Priority support and hardware warranty for 6 months after purchase',
    values: ['Included', 'Included', 'Included', 'Included'],
  },
];

interface PriceOption {
  main: string[];
  extras?: string[];
}

const TOTALS: PriceOption[] = [
  { main: ['RM 1,099'] },
  { main: ['Multi Base with Printer: RM 2,999'], extras: ['Upgrade Standard Base to Multi-Purpose Base: +RM300'] },
  { main: ['Desktop: RM 2,999', '3 Mode with Wall Mount: RM 3,499'], extras: ['Add Desktop Base: +RM300', 'Add Cash Drawer: RM200–RM600'] },
  { main: ['Single Screen: RM 3,499', 'Double Screen: RM 3,999'], extras: ['Add 21" Kiosk: +RM4,299', 'Add 27" Kiosk: RM6,299'] },
];

// ── Renewal Data ─────────────────────────────────────────────
interface RenewalRow {
  label: string;
  sub: string;
  tooltip: string;
  values: (string | null)[];
}

const RENEWAL_ROWS: RenewalRow[] = [
  {
    label: 'Free Package',
    sub: '1 device only, up to 20 products',
    tooltip: 'Perfect for testing — keep using QPOS forever at no cost with basic features',
    values: ['0 Forever', null, null, null],
  },
  {
    label: 'Standard Package',
    sub: 'Up to 2 devices / outlet',
    tooltip: 'Ideal for single-outlet operations needing staff control and mobile POS',
    values: [
      '6 mths: 474\n12 mths: 828',
      '6 mths: 474\n12 mths: 828',
      '6 mths: 474 (79/mth)\n12 mths: 828 (69/mth)',
      '6 mths: 474\n12 mths: 828',
    ],
  },
  {
    label: 'Plus Package',
    sub: 'Unlimited devices',
    tooltip: 'Unlocks Kiosk, QR ordering and unlimited devices — best for growing outlets',
    values: [
      null,
      null,
      '6 mths: 774 (129/mth)\n12 mths: 1,428 (119/mth)',
      '6 mths: 774\n12 mths: 1,428',
    ],
  },
  {
    label: 'Pro Package',
    sub: 'Unlimited devices',
    tooltip: 'Full power — inventory, forecasting, multi-branch optimization and dedicated support',
    values: [
      null,
      null,
      '6 mths: 1,374 (219/mth)\n12 mths: 2,388 (199/mth)',
      '6 mths: 1,374\n12 mths: 2,388',
    ],
  },
];

const whatsappUrl = 'https://wa.me/60126909189?text=Hi%20QPOS%2C%20I%27m%20interested%20in%20the%20hardware%20bundles';

type PaymentPlan = 'full' | '3mo' | '6mo' | '12mo';

// Base prices for installment calculation (RM)
const BASE_PRICES: { main: number[]; labels: string[] }[] = [
  { main: [1099], labels: ['RM {price}'] },
  { main: [2999], labels: ['Multi Base with Printer: RM {price}'] },
  { main: [2999, 3499], labels: ['Desktop: RM {price}', '3 Mode with Wall Mount: RM {price}'] },
  { main: [3499, 3999], labels: ['Single Screen: RM {price}', 'Double Screen: RM {price}'] },
];

function formatPrice(price: number): string {
  return price % 1 === 0 ? price.toLocaleString() : price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getInstallmentLabel(plan: PaymentPlan): string {
  if (plan === '3mo') return '/mo x 3';
  if (plan === '6mo') return '/mo x 6';
  if (plan === '12mo') return '/mo x 12';
  return '';
}

// ── Component ────────────────────────────────────────────────
const HardwareBundles: React.FC = () => {
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan>('full');

  const computedTotals = useMemo(() => {
    const divisor = paymentPlan === '3mo' ? 3 : paymentPlan === '6mo' ? 6 : paymentPlan === '12mo' ? 12 : 1;
    const suffix = getInstallmentLabel(paymentPlan);

    return BASE_PRICES.map((bundle, j) => {
      const mainLines = bundle.main.map((price, k) => {
        const display = paymentPlan === 'full' ? formatPrice(price) : formatPrice(Math.ceil(price / divisor));
        return bundle.labels[k].replace('{price}', display) + (paymentPlan !== 'full' ? suffix : '');
      });
      return { main: mainLines, extras: TOTALS[j].extras };
    });
  }, [paymentPlan]);

  return (
    <div className="w-full max-w-6xl mx-auto mb-16">
      {/* Section header */}
      <div className="text-center mb-10">
        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-3">QPOS Hardware</p>
        <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight leading-tight uppercase">
          All-in-One<br />POS Solutions
        </h2>
        <p className="text-sm text-gray-500 mt-3 max-w-lg mx-auto">
          Everything you need in one box — hardware, software, training and support. Pick the bundle that fits your business.
        </p>
      </div>

      {/* Main table */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Bundle headers */}
          <div className="grid grid-cols-[200px_repeat(4,1fr)] border-b-2 border-black">
            <div className="p-4" />
            {BUNDLES.map((b) => (
              <div
                key={b.key}
                className={`p-4 text-center ${b.highlight ? 'bg-black text-white' : 'bg-gray-50'}`}
              >
                <p className={`text-[9px] font-bold uppercase tracking-widest ${b.highlight ? 'text-gray-400' : 'text-gray-500'}`}>
                  {b.label}
                </p>
                <p className={`text-sm font-black uppercase mt-1 ${b.highlight ? 'text-white' : 'text-black'}`}>
                  {b.name}
                </p>
              </div>
            ))}
          </div>

          {/* Hardware rows */}
          {HARDWARE_ROWS.map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-[200px_repeat(4,1fr)] border-b border-gray-200 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
            >
              <div className="px-4 py-3 flex items-center">
                <span className="text-[11px] font-bold text-black uppercase leading-tight">{row.label}</span>
                <InfoTip text={row.tooltip} />
              </div>
              {row.values.map((val, j) => (
                <div key={j} className={`px-3 py-3 flex items-center justify-center text-center ${BUNDLES[j].highlight && i === 0 ? '' : ''}`}>
                  <span className="text-[11px] text-gray-700 font-medium leading-tight">{val}</span>
                </div>
              ))}
            </div>
          ))}

          {/* Payment plan selector */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-black uppercase tracking-wider">Payment Plan</span>
              <InfoTip text="0% interest installment via Maybank & CIMB Bank. Delivery not included. Self-collect in Publika KL." />
            </div>
            <div className="inline-flex items-center border border-black rounded-full p-0.5">
              {([
                { key: 'full' as PaymentPlan, label: 'Full' },
                { key: '3mo' as PaymentPlan, label: '3 Months' },
                { key: '6mo' as PaymentPlan, label: '6 Months' },
                { key: '12mo' as PaymentPlan, label: '12 Months' },
              ]).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setPaymentPlan(opt.key)}
                  className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-full transition-all duration-300 ${
                    paymentPlan === opt.key ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {opt.label}
                  {opt.key !== 'full' && <span className="ml-1 text-[8px] text-emerald-500 font-semibold">0%</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Total row */}
          <div className="grid grid-cols-[200px_repeat(4,1fr)] border-y-2 border-black bg-white">
            <div className="px-4 py-4 flex items-start">
              <span className="text-sm font-black text-black uppercase">Total</span>
              <InfoTip text="One-time hardware cost. Software subscription billed separately after 6 months." />
            </div>
            {computedTotals.map((t, j) => (
              <div key={j} className={`px-3 py-4 text-center ${BUNDLES[j].highlight ? 'bg-black/5' : ''}`}>
                {t.main.map((line, k) => (
                  <p key={k} className="text-[12px] font-black text-black leading-snug">{line}</p>
                ))}
                {paymentPlan !== 'full' && (
                  <p className="text-[9px] text-emerald-600 font-semibold mt-1">0% Interest</p>
                )}
                {t.extras && (
                  <div className="mt-2 space-y-0.5">
                    {t.extras?.map((ex, k) => (
                      <p key={k} className="text-[9px] text-gray-500 leading-snug">{ex}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── Renewal Section ── */}
          <div className="mt-0">
            <div className="grid grid-cols-[200px_repeat(4,1fr)] bg-black text-white">
              <div className="col-span-5 px-4 py-4 text-center">
                <p className="text-sm font-black uppercase tracking-wider">Renewal After 6 Months</p>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-0.5">(Pricing shown in 6 mths / 12 mths)</p>
              </div>
            </div>

            {RENEWAL_ROWS.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-[200px_repeat(4,1fr)] border-b border-gray-200 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
              >
                <div className="px-4 py-3 flex flex-col justify-center">
                  <span className="text-[11px] font-bold text-black uppercase leading-tight flex items-center">
                    {row.label}
                    <InfoTip text={row.tooltip} />
                  </span>
                  <span className="text-[9px] text-gray-400 italic mt-0.5">{row.sub}</span>
                </div>
                {row.values.map((val, j) => (
                  <div key={j} className="px-3 py-3 flex items-center justify-center text-center">
                    {val === null ? (
                      <span className="text-[10px] text-gray-300 font-medium">NA</span>
                    ) : (
                      <div className="space-y-0.5">
                        {val.split('\n').map((line, k) => (
                          <p key={k} className="text-[11px] text-gray-700 font-medium leading-snug">{line}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-6 text-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('Hardware Bundles > Enquire via WhatsApp')}
              className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Enquire via WhatsApp
            </a>
            <p className="text-[9px] text-gray-400 mt-2">Talk to our team for bundle customization and bulk pricing</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HardwareBundles;
