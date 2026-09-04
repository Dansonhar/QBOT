import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Eye,
  Flame,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  Minus,
  Plus,
  TrendingUp,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

// ─────────────────────────────────────────────────────────────
// LOCALE
// ─────────────────────────────────────────────────────────────
export type Locale = 'en' | 'ms';

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const WA_NUMBER = '60126909189';
const WA_BASE = `https://wa.me/${WA_NUMBER}`;
const APPLE_TEXT = '#1d1d1f';
const APPLE_SOFT_BG = '#f5f5f7';

const URL_BASE = 'https://qbot.now/pos-buying-guide';
const URL_EN = `${URL_BASE}?lang=en`;
const URL_BM = `${URL_BASE}?lang=bm`;

function waLink(text: string): string {
  return `${WA_BASE}?text=${encodeURIComponent(text)}`;
}

// ─────────────────────────────────────────────────────────────
// MODELS (numeric data — shared across locales)
// ─────────────────────────────────────────────────────────────
type ModelId =
  | 'qr'
  | 'lite'
  | 'mobile'
  | 'mini'
  | 'mix'
  | 'standard'
  | 'self-service'
  | 'kiosk';

interface PosModelBase {
  id: ModelId;
  name: string;
  priceFrom: number;
  perMonth: number;
  budgetBucket: 'under1k' | '1k-3k' | '3k-5k' | '5k+';
}

const MODELS: PosModelBase[] = [
  { id: 'qr', name: 'QPOS QR', priceFrom: 249, perMonth: 10, budgetBucket: 'under1k' },
  { id: 'lite', name: 'QPOS Lite', priceFrom: 828, perMonth: 34, budgetBucket: 'under1k' },
  { id: 'mobile', name: 'QPOS Mobile', priceFrom: 1780, perMonth: 74, budgetBucket: '1k-3k' },
  { id: 'mini', name: 'QPOS Mini', priceFrom: 2780, perMonth: 115, budgetBucket: '1k-3k' },
  { id: 'mix', name: 'QPOS Mix', priceFrom: 3480, perMonth: 145, budgetBucket: '3k-5k' },
  { id: 'standard', name: 'QPOS Standard', priceFrom: 3880, perMonth: 161, budgetBucket: '3k-5k' },
  { id: 'self-service', name: 'QPOS Self-Service', priceFrom: 4080, perMonth: 170, budgetBucket: '3k-5k' },
  { id: 'kiosk', name: 'QPOS Kiosk', priceFrom: 7176, perMonth: 299, budgetBucket: '5k+' },
];

const MODEL_BY_ID: Record<ModelId, PosModelBase> = MODELS.reduce(
  (acc, m) => {
    acc[m.id] = m;
    return acc;
  },
  {} as Record<ModelId, PosModelBase>,
);

interface ModelCopy {
  hook: string;
  bestFor: string;
  avoidIf: string;
  imageBrief: string;
}

const MODEL_COPY: Record<Locale, Record<ModelId, ModelCopy>> = {
  en: {
    qr: {
      hook: "Your customer's phone IS your POS",
      bestFor: 'Hawker stalls, kopitiams, single vendors',
      avoidIf: 'You need to accept cash',
      imageBrief: 'QPOS QR — phone with QR menu',
    },
    lite: {
      hook: 'Already have an iPad? Turn it into a kiosk in 10 minutes',
      bestFor: 'Cafes with spare tablets, food trucks',
      avoidIf: "You don't own a tablet",
      imageBrief: 'QPOS Lite — tablet mounted as kiosk',
    },
    mobile: {
      hook: 'A full POS in your apron pocket',
      bestFor: 'Trucks, pop-ups, events, queue management',
      avoidIf: 'You need a fixed counter',
      imageBrief: 'QPOS Mobile — handheld POS device',
    },
    mini: {
      hook: "Malaysia's smallest professional counter POS",
      bestFor: 'Tight counters, dessert bars, takeaway',
      avoidIf: 'You want a customer-facing screen',
      imageBrief: 'QPOS Mini — compact counter POS',
    },
    mix: {
      hook: 'Counter by day. Kiosk by night. Mobile when busy.',
      bestFor: 'Operators who shift modes by daypart',
      avoidIf: 'You only need one mode',
      imageBrief: 'QPOS Mix — 3-in-1 device shown in 3 modes',
    },
    standard: {
      hook: 'The dual-screen front counter customers expect from a real brand',
      bestFor: 'Cafes, restaurants, brand-conscious operators',
      avoidIf: "You're a solo operator",
      imageBrief: 'QPOS Standard — dual-screen counter POS',
    },
    'self-service': {
      hook: "Malaysia's first POS that flips into self-order mode",
      bestFor: 'Cafes wanting self-order without a kiosk pillar',
      avoidIf: 'You want a freestanding kiosk pillar',
      imageBrief: 'QPOS Self-Service — POS in self-order mode',
    },
    kiosk: {
      hook: 'Replace one cashier. Pays back in 4 months.',
      bestFor: 'Fast food, branded concepts, high-volume outlets',
      avoidIf: 'Under 50 orders per day',
      imageBrief: 'QPOS Kiosk — freestanding kiosk pillar',
    },
  },
  ms: {
    qr: {
      hook: 'Telefon pelanggan ANDA ialah POS anda',
      bestFor: 'Gerai jaja, kopitiam, peniaga tunggal',
      avoidIf: 'Anda perlu terima tunai',
      imageBrief: 'QPOS QR — telefon dengan menu QR',
    },
    lite: {
      hook: 'Sudah ada iPad? Jadikan kiosk dalam 10 minit',
      bestFor: 'Kafe dengan tablet lebih, trak makanan',
      avoidIf: 'Anda tiada tablet',
      imageBrief: 'QPOS Lite — tablet dipasang sebagai kiosk',
    },
    mobile: {
      hook: 'POS penuh dalam poket apron',
      bestFor: 'Trak, pop-up, acara, urus barisan',
      avoidIf: 'Anda perlukan kaunter tetap',
      imageBrief: 'QPOS Mobile — peranti POS pegang tangan',
    },
    mini: {
      hook: 'POS kaunter profesional terkecil di Malaysia',
      bestFor: 'Kaunter sempit, kedai pencuci mulut, bawa balik',
      avoidIf: 'Anda mahu skrin menghadap pelanggan',
      imageBrief: 'QPOS Mini — POS kaunter padat',
    },
    mix: {
      hook: 'Kaunter waktu siang. Kiosk waktu malam. Mudah alih bila sibuk.',
      bestFor: 'Pengendali yang tukar mod ikut waktu',
      avoidIf: 'Anda hanya perlu satu mod',
      imageBrief: 'QPOS Mix — peranti 3-dalam-1 dalam 3 mod',
    },
    standard: {
      hook: 'Kaunter depan dwi-skrin yang pelanggan jangka daripada jenama sebenar',
      bestFor: 'Kafe, restoran, pengendali sedar jenama',
      avoidIf: 'Anda pengendali solo',
      imageBrief: 'QPOS Standard — POS kaunter dwi-skrin',
    },
    'self-service': {
      hook: 'POS pertama Malaysia yang bertukar ke mod tempah sendiri',
      bestFor: 'Kafe yang nak layan diri tanpa tiang kiosk',
      avoidIf: 'Anda mahu tiang kiosk berdiri sendiri',
      imageBrief: 'QPOS Self-Service — POS dalam mod tempah sendiri',
    },
    kiosk: {
      hook: 'Ganti satu juruwang. Pulang modal dalam 4 bulan.',
      bestFor: 'Makanan segera, jenama berkonsep, outlet volum tinggi',
      avoidIf: 'Bawah 50 pesanan sehari',
      imageBrief: 'QPOS Kiosk — tiang kiosk berdiri sendiri',
    },
  },
};

// ─────────────────────────────────────────────────────────────
// QUIZ DATA
// ─────────────────────────────────────────────────────────────
interface QuizOption {
  value: string;
  emoji: string;
  label: string;
}

interface QuizQuestion {
  id: number;
  prompt: string;
  options: QuizOption[];
}

const QUIZ_QUESTIONS: Record<Locale, QuizQuestion[]> = {
  en: [
    {
      id: 1,
      prompt: "What's slowing your business down right now?",
      options: [
        { value: 'staff_cost', emoji: '💸', label: 'Staff costs eating my margins' },
        { value: 'queues', emoji: '⏱️', label: 'Long queues / slow checkout' },
        { value: 'no_repeat', emoji: '🔁', label: "Customers don't come back" },
        { value: 'tracking', emoji: '📊', label: "I can't track what's selling" },
        { value: 'missing_orders', emoji: '📝', label: 'Missing orders during rush' },
        { value: 'starting_out', emoji: '🌱', label: "I'm just starting out" },
      ],
    },
    {
      id: 2,
      prompt: 'If you could fix that, what would change?',
      options: [
        { value: 'cut_salary', emoji: '✂️', label: 'Cut one staff salary' },
        { value: 'serve_more', emoji: '🚀', label: 'Serve 2× more per hour' },
        { value: 'repeat_rate', emoji: '❤️', label: '30% repeat customers' },
        { value: 'see_numbers', emoji: '📈', label: 'See real numbers daily' },
        { value: 'catch_orders', emoji: '✅', label: 'Catch every order' },
        { value: 'clean_start', emoji: '🛠️', label: 'Start clean, start right' },
      ],
    },
    {
      id: 3,
      prompt: 'What do you run?',
      options: [
        { value: 'cafe', emoji: '☕', label: 'Cafe' },
        { value: 'fastfood', emoji: '🍔', label: 'Fast food / QSR' },
        { value: 'restaurant', emoji: '🍽️', label: 'Sit-down restaurant' },
        { value: 'stall', emoji: '🛻', label: 'Stall, truck, kiosk' },
        { value: 'other', emoji: '🏢', label: 'Other (gym, salon, service)' },
      ],
    },
    {
      id: 4,
      prompt: 'Where do customers order?',
      options: [
        { value: 'counter', emoji: '🧾', label: 'At a fixed counter' },
        { value: 'table', emoji: '🪑', label: 'At their table' },
        { value: 'mix', emoji: '🔀', label: 'A mix of both' },
        { value: 'mobile', emoji: '🚶', label: 'On the move' },
      ],
    },
    {
      id: 5,
      prompt: 'Your budget for the device?',
      options: [
        { value: 'under1k', emoji: '💵', label: 'Under RM1,000' },
        { value: '1k-3k', emoji: '💵💵', label: 'RM1,000 – RM3,000' },
        { value: '3k-5k', emoji: '💵💵💵', label: 'RM3,000 – RM5,000' },
        { value: '5k+', emoji: '💵💵💵💵', label: 'RM5,000+' },
        { value: 'unsure', emoji: '🤔', label: 'Not sure yet' },
      ],
    },
    {
      id: 6,
      prompt: 'How urgent?',
      options: [
        { value: 'this_month', emoji: '🔥', label: 'This month' },
        { value: 'next_few', emoji: '📅', label: 'Next 1–3 months' },
        { value: 'exploring', emoji: '👀', label: 'Just exploring' },
      ],
    },
  ],
  ms: [
    {
      id: 1,
      prompt: 'Apa yang melambatkan perniagaan anda sekarang?',
      options: [
        { value: 'staff_cost', emoji: '💸', label: 'Kos staf makan margin saya' },
        { value: 'queues', emoji: '⏱️', label: 'Barisan panjang / checkout lambat' },
        { value: 'no_repeat', emoji: '🔁', label: 'Pelanggan tak datang balik' },
        { value: 'tracking', emoji: '📊', label: 'Saya tak boleh jejak apa yang laku' },
        { value: 'missing_orders', emoji: '📝', label: 'Pesanan tertinggal waktu sibuk' },
        { value: 'starting_out', emoji: '🌱', label: 'Saya baru mula' },
      ],
    },
    {
      id: 2,
      prompt: 'Kalau boleh perbaiki, apa yang berubah?',
      options: [
        { value: 'cut_salary', emoji: '✂️', label: 'Kurangkan satu gaji staf' },
        { value: 'serve_more', emoji: '🚀', label: 'Sajikan 2× lebih banyak sejam' },
        { value: 'repeat_rate', emoji: '❤️', label: '30% pelanggan tetap' },
        { value: 'see_numbers', emoji: '📈', label: 'Lihat nombor sebenar setiap hari' },
        { value: 'catch_orders', emoji: '✅', label: 'Tangkap setiap pesanan' },
        { value: 'clean_start', emoji: '🛠️', label: 'Mula bersih, mula betul' },
      ],
    },
    {
      id: 3,
      prompt: 'Apa yang anda jalankan?',
      options: [
        { value: 'cafe', emoji: '☕', label: 'Kafe' },
        { value: 'fastfood', emoji: '🍔', label: 'Makanan segera / QSR' },
        { value: 'restaurant', emoji: '🍽️', label: 'Restoran duduk' },
        { value: 'stall', emoji: '🛻', label: 'Gerai, trak, kiosk' },
        { value: 'other', emoji: '🏢', label: 'Lain (gim, salun, perkhidmatan)' },
      ],
    },
    {
      id: 4,
      prompt: 'Di mana pelanggan pesan?',
      options: [
        { value: 'counter', emoji: '🧾', label: 'Di kaunter tetap' },
        { value: 'table', emoji: '🪑', label: 'Di meja mereka' },
        { value: 'mix', emoji: '🔀', label: 'Campuran kedua-duanya' },
        { value: 'mobile', emoji: '🚶', label: 'Sambil bergerak' },
      ],
    },
    {
      id: 5,
      prompt: 'Bajet anda untuk peranti?',
      options: [
        { value: 'under1k', emoji: '💵', label: 'Bawah RM1,000' },
        { value: '1k-3k', emoji: '💵💵', label: 'RM1,000 – RM3,000' },
        { value: '3k-5k', emoji: '💵💵💵', label: 'RM3,000 – RM5,000' },
        { value: '5k+', emoji: '💵💵💵💵', label: 'RM5,000+' },
        { value: 'unsure', emoji: '🤔', label: 'Belum pasti' },
      ],
    },
    {
      id: 6,
      prompt: 'Berapa segera?',
      options: [
        { value: 'this_month', emoji: '🔥', label: 'Bulan ini' },
        { value: 'next_few', emoji: '📅', label: '1–3 bulan akan datang' },
        { value: 'exploring', emoji: '👀', label: 'Sekadar tinjau' },
      ],
    },
  ],
};

const BUSINESS_LABEL: Record<Locale, Record<string, string>> = {
  en: {
    cafe: 'cafe',
    fastfood: 'fast food / QSR',
    restaurant: 'sit-down restaurant',
    stall: 'stall, truck, or mall kiosk',
    other: 'business (gym, salon, service)',
  },
  ms: {
    cafe: 'kafe',
    fastfood: 'makanan segera / QSR',
    restaurant: 'restoran duduk',
    stall: 'gerai, trak, atau kiosk',
    other: 'perniagaan (gim, salun, perkhidmatan)',
  },
};

// ─────────────────────────────────────────────────────────────
// RECOMMENDATION REASONS
// ─────────────────────────────────────────────────────────────
const REASONS: Record<
  Locale,
  {
    q1: Record<string, string>;
    q3: Record<string, string>;
    q4: Record<string, string>;
  }
> = {
  en: {
    q1: {
      staff_cost: 'Built to reduce headcount at the counter.',
      queues: 'Designed to clear queues at peak.',
      no_repeat: 'Loyalty + repeat-customer tools built in.',
      tracking: 'A clean daily view of what sold.',
      missing_orders: 'Captures every order — even offline.',
      starting_out: 'Right-sized to start clean.',
      default: 'Matches your biggest constraint.',
    },
    q3: {
      cafe: 'Tuned for cafe rhythms.',
      fastfood: 'Built for high-volume, fast-ticket ops.',
      restaurant: 'Works with table service and split bills.',
      stall: 'Compact and rugged for stalls and trucks.',
      other: 'Flexible for non-F&B service flows too.',
      default: 'Matches your operating model.',
    },
    q4: {
      counter: 'Optimised for a fixed counter workflow.',
      table: 'Pairs cleanly with QR table ordering.',
      mix: 'Handles counter + table + takeaway.',
      mobile: 'Works on the move — no fixed counter needed.',
      default: 'Adapts to where customers order.',
    },
  },
  ms: {
    q1: {
      staff_cost: 'Direka untuk kurangkan staf di kaunter.',
      queues: 'Direka untuk hilangkan barisan waktu puncak.',
      no_repeat: 'Alat kesetiaan + pelanggan tetap built-in.',
      tracking: 'Pandangan harian bersih apa yang laku.',
      missing_orders: 'Tangkap setiap pesanan — walaupun offline.',
      starting_out: 'Saiz tepat untuk mula bersih.',
      default: 'Sepadan dengan halangan terbesar anda.',
    },
    q3: {
      cafe: 'Disesuaikan untuk rentak kafe.',
      fastfood: 'Dibina untuk operasi volum tinggi, tiket pantas.',
      restaurant: 'Berfungsi dengan layan meja dan bil pecah.',
      stall: 'Padat dan tahan untuk gerai dan trak.',
      other: 'Fleksibel untuk perkhidmatan bukan F&B juga.',
      default: 'Sepadan dengan model operasi anda.',
    },
    q4: {
      counter: 'Dioptimumkan untuk aliran kaunter tetap.',
      table: 'Pasangan bersih dengan tempahan meja QR.',
      mix: 'Kendalikan kaunter + meja + bawa balik.',
      mobile: 'Berfungsi sambil bergerak — tak perlu kaunter tetap.',
      default: 'Adaptasi kepada tempat pelanggan pesan.',
    },
  },
};

function recommendModel(
  answers: Record<number, string>,
  locale: Locale,
): {
  primary: ModelId;
  runnerUp: ModelId;
  reasons: { q1: string; q3: string; q4: string };
  avoidedSpend: number;
} {
  const q1 = answers[1];
  const q3 = answers[3];
  const q4 = answers[4];
  const q5 = answers[5];

  let primary: ModelId = 'mix';
  if (q5 === 'under1k') {
    primary = q4 === 'mobile' || q3 === 'stall' ? 'qr' : 'lite';
  } else if (q5 === '1k-3k') {
    primary = q4 === 'mobile' || q4 === 'table' ? 'mobile' : 'mini';
  } else if (q5 === '3k-5k') {
    if (q4 === 'mix') primary = 'mix';
    else if (q1 === 'queues') primary = 'self-service';
    else primary = 'standard';
  } else if (q5 === '5k+') {
    primary = 'kiosk';
  }
  if (q1 === 'staff_cost' && (q5 === '5k+' || q5 === '3k-5k')) {
    primary = 'kiosk';
  }

  const order: ModelId[] = ['qr', 'lite', 'mobile', 'mini', 'mix', 'standard', 'self-service', 'kiosk'];
  const idx = order.indexOf(primary);
  const runnerUp: ModelId = idx >= order.length - 1 ? order[idx - 1] : order[idx + 1];

  const r = REASONS[locale];
  const reasons = {
    q1: r.q1[q1] || r.q1.default,
    q3: r.q3[q3] || r.q3.default,
    q4: r.q4[q4] || r.q4.default,
  };

  const avoidedSpend = Math.max(0, MODEL_BY_ID.kiosk.priceFrom - MODEL_BY_ID[primary].priceFrom);
  return { primary, runnerUp, reasons, avoidedSpend };
}

// ─────────────────────────────────────────────────────────────
// FAQ ITEMS
// ─────────────────────────────────────────────────────────────
const FAQ_ITEMS: Record<Locale, { q: string; a: string }[]> = {
  en: [
    {
      q: 'How much does a POS system cost in Malaysia?',
      a: "POS systems in Malaysia range from RM249 (basic QR ordering) to over RM10,000 (full kiosk setups). QPOS covers the full range — from RM249 for QPOS QR to RM7,176 for QPOS Kiosk. The right price depends on your business size and workflow, not on what's most expensive.",
    },
    {
      q: "What's the best POS for a small cafe?",
      a: "For most small cafes, QPOS Standard (RM3,880) or QPOS Mix (RM3,480) is the sweet spot — both offer a real counter experience with customer-facing capability. If you're tight on space, QPOS Mini (RM2,780) works. If you want self-ordering to reduce queues, look at QPOS Self-Service (RM4,080).",
    },
    {
      q: "Is the 2-year free software bonus real — what's the catch?",
      a: 'No catch. Every QPOS package already includes 12 months of cloud software. If you sign up this month, we extend that to 24 months at no extra cost. After 24 months, cloud software is optional at approximately RM69/month. You keep all hardware, all your data, and all your settings either way.',
    },
    {
      q: 'Is QPOS SST-ready and LHDN e-Invoice compliant?',
      a: 'Yes. QPOS is built for the Malaysian market, including SST handling and LHDN e-Invoice compatibility. We update the system as regulations evolve.',
    },
    {
      q: 'Does QPOS work offline?',
      a: "Yes. QPOS continues to take orders and process transactions offline. Data syncs automatically when your internet reconnects. You'll never lose a sale to a dropped connection.",
    },
    {
      q: 'What payment methods does QPOS accept?',
      a: "QPOS accepts Visa, Mastercard, FPX online banking, MAE, GrabPay, Touch 'n Go eWallet, Boost, ShopeePay, WeChat Pay, and Alipay. All major Malaysian payment methods are supported out of the box.",
    },
    {
      q: 'How long does setup take?',
      a: 'Most setups take 1–3 days from order confirmation to going live. Hardware ships fast, our team handles onsite installation and staff training, and the cloud software is pre-configured for your menu before delivery.',
    },
    {
      q: 'Can I start with QPOS QR and upgrade later?',
      a: 'Absolutely. Many operators start with QPOS QR (RM249) and add a counter POS, kiosk, or mobile device as they grow. Your data, menu, and customer records carry over — you only pay the difference in hardware.',
    },
    {
      q: "What's the difference between QPOS Mix and QPOS Standard?",
      a: 'QPOS Standard (RM3,880) is a fixed dual-screen counter — built for traditional cashier setups with a customer-facing display. QPOS Mix (RM3,480) is more flexible — it works as a counter, flips into self-service kiosk mode, and can detach for mobile order-taking. Pick Mix if your operation changes through the day. Pick Standard if you want a consistent, professional counter experience.',
    },
    {
      q: 'What happens after the 2 years of free software?',
      a: 'After 24 months, cloud software is optional at approximately RM69/month. You keep all hardware, all data, all your customer records, and all your settings. If you choose not to renew, the hardware still works for offline operations. No lock-ins, no hostage data.',
    },
  ],
  ms: [
    {
      q: 'Berapakah kos sistem POS di Malaysia?',
      a: 'Sistem POS di Malaysia berjulat dari RM249 (tempahan QR asas) hingga lebih RM10,000 (pemasangan kiosk penuh). QPOS meliputi seluruh julat — dari RM249 untuk QPOS QR hingga RM7,176 untuk QPOS Kiosk. Harga yang tepat bergantung pada saiz dan aliran kerja perniagaan anda, bukan apa yang paling mahal.',
    },
    {
      q: 'Apakah POS terbaik untuk kafe kecil?',
      a: 'Untuk kebanyakan kafe kecil, QPOS Standard (RM3,880) atau QPOS Mix (RM3,480) adalah pilihan terbaik — kedua-duanya menawarkan pengalaman kaunter sebenar dengan keupayaan menghadap pelanggan. Jika ruang anda terhad, QPOS Mini (RM2,780) berfungsi. Jika anda mahu tempahan sendiri untuk kurangkan barisan, lihat QPOS Self-Service (RM4,080).',
    },
    {
      q: 'Adakah bonus perisian percuma 2 tahun ini benar — apa tangkapnya?',
      a: 'Tiada tangkap. Setiap pakej QPOS sudah termasuk 12 bulan perisian awan. Jika anda mendaftar bulan ini, kami sambungkan ke 24 bulan tanpa kos tambahan. Selepas 24 bulan, perisian awan adalah pilihan pada kira-kira RM69/bulan. Anda kekal dengan semua perkakasan, semua data, dan semua tetapan anda.',
    },
    {
      q: 'Adakah QPOS bersedia SST dan mematuhi e-Invois LHDN?',
      a: 'Ya. QPOS dibina untuk pasaran Malaysia, termasuk pengendalian SST dan keserasian e-Invois LHDN. Kami kemas kini sistem apabila peraturan berubah.',
    },
    {
      q: 'Adakah QPOS berfungsi offline?',
      a: 'Ya. QPOS terus terima pesanan dan proses transaksi semasa offline. Data disegerakkan secara automatik bila internet kembali. Anda tidak akan kehilangan jualan kerana sambungan terputus.',
    },
    {
      q: 'Apakah kaedah pembayaran yang diterima QPOS?',
      a: "QPOS menerima Visa, Mastercard, perbankan dalam talian FPX, MAE, GrabPay, dompet elektronik Touch 'n Go, Boost, ShopeePay, WeChat Pay dan Alipay. Semua kaedah pembayaran utama Malaysia disokong terus.",
    },
    {
      q: 'Berapa lama pemasangan?',
      a: 'Kebanyakan pemasangan ambil 1–3 hari dari pengesahan pesanan ke beroperasi. Perkakasan dihantar pantas, pasukan kami kendalikan pemasangan di lokasi dan latihan staf, dan perisian awan pra-konfigurasi untuk menu anda sebelum penghantaran.',
    },
    {
      q: 'Boleh saya mula dengan QPOS QR dan naik taraf kemudian?',
      a: 'Boleh. Ramai pengendali mula dengan QPOS QR (RM249) dan tambah POS kaunter, kiosk, atau peranti mudah alih bila berkembang. Data, menu, dan rekod pelanggan anda dibawa — anda hanya bayar perbezaan perkakasan.',
    },
    {
      q: 'Apa perbezaan antara QPOS Mix dan QPOS Standard?',
      a: 'QPOS Standard (RM3,880) ialah kaunter dwi-skrin tetap — dibina untuk pemasangan juruwang tradisional dengan paparan menghadap pelanggan. QPOS Mix (RM3,480) lebih fleksibel — berfungsi sebagai kaunter, bertukar ke mod kiosk layan diri, dan boleh dilepaskan untuk tempahan mudah alih. Pilih Mix jika operasi anda berubah sepanjang hari. Pilih Standard jika anda mahu pengalaman kaunter profesional yang konsisten.',
    },
    {
      q: 'Apa berlaku selepas 2 tahun perisian percuma?',
      a: 'Selepas 24 bulan, perisian awan adalah pilihan pada kira-kira RM69/bulan. Anda kekal dengan semua perkakasan, semua data, semua rekod pelanggan, dan semua tetapan anda. Jika anda pilih untuk tidak perbaharui, perkakasan masih berfungsi untuk operasi offline. Tiada lock-in, tiada data tebusan.',
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// PAIN COPY (5 stages)
// ─────────────────────────────────────────────────────────────
interface PainCopy {
  eyebrow: string;
  line1: string;
  line2: string;
  body: string;
  stat: string;
  statLabel: string;
  imageBrief: string;
  bg: 'white' | 'soft';
}

const PAINS: Record<Locale, PainCopy[]> = {
  en: [
    {
      eyebrow: 'Silent killer #1 · Flying blind',
      line1: 'Your bestseller',
      line2: 'could be losing money.',
      body: "Without item-level reporting, you're guessing what to push and what to cut. The hot seller might have the worst margin in the menu — and you keep promoting it.",
      stat: '40%',
      statLabel: 'of F&B items lose money once full cost is calculated',
      imageBrief: 'Owner staring at receipts without a clear picture of item margins',
      bg: 'white',
    },
    {
      eyebrow: 'Silent killer #2 · No shock absorber',
      line1: 'Lunch rush',
      line2: 'breaks the day.',
      body: '60 minutes that decide your week. Slow counter, missed orders, queue walk-aways. Survive it — or die by it.',
      stat: 'RM800',
      statLabel: 'average lunch-hour revenue lost per slow-checkout incident',
      imageBrief: 'Packed counter at noon with a long impatient queue',
      bg: 'soft',
    },
    {
      eyebrow: 'Silent killer #3 · Staff is fragile',
      line1: 'Your cashier',
      line2: 'is your weakest link.',
      body: 'Sick days. No-shows. Quit without notice. Trained for 3 weeks, gone in 2 months. The cost compounds every cycle.',
      stat: 'RM2,500/mo',
      statLabel: 'full cost of one cashier: salary + EPF + SOCSO + overtime',
      imageBrief: 'Empty cashier counter with a hand-written "back in 10" sign',
      bg: 'white',
    },
    {
      eyebrow: "Silent killer #4 · No memory",
      line1: 'They ate. They paid.',
      line2: "You'll never see them again.",
      body: "No phone. No name. No reason to return. Tomorrow you start from zero — running on the marketing treadmill, paying to attract the same kind of stranger every day.",
      stat: '70%',
      statLabel: 'share of revenue healthy F&B gets from repeat customers',
      imageBrief: 'Customer walking out the door with no loyalty capture',
      bg: 'soft',
    },
    {
      eyebrow: 'Silent killer #5 · Stuck on price',
      line1: 'Race to the bottom.',
      line2: 'Because you have nothing else.',
      body: 'No loyalty. No combos. No reason a customer picks you over the cafe next door. So you discount — and your margin erodes one promo at a time.',
      stat: '+15%',
      statLabel: 'ticket-size lift from automatic upsell prompts at POS',
      imageBrief: 'Two cafes side-by-side with discount signs in the windows',
      bg: 'white',
    },
  ],
  ms: [
    {
      eyebrow: 'Pembunuh senyap #1 · Buta data',
      line1: 'Bestseller anda',
      line2: 'mungkin yang paling rugi.',
      body: 'Tanpa laporan setiap item, anda meneka apa nak promosi dan apa nak buang. Item paling laku boleh jadi margin paling teruk — dan anda terus promosikan.',
      stat: '40%',
      statLabel: 'item F&B sebenarnya rugi bila semua kos dikira',
      imageBrief: 'Pemilik tengok resit tanpa gambaran margin setiap item',
      bg: 'white',
    },
    {
      eyebrow: 'Pembunuh senyap #2 · Tiada penampan',
      line1: 'Waktu tengahari',
      line2: 'rosakkan hari anda.',
      body: '60 minit yang menentukan minggu anda. Kaunter lambat, pesanan tertinggal, pelanggan beredar. Hidup atau mati di situ.',
      stat: 'RM800',
      statLabel: 'purata hasil tengahari hilang setiap insiden checkout lambat',
      imageBrief: 'Kaunter sesak tengahari dengan barisan panjang yang tak sabar',
      bg: 'soft',
    },
    {
      eyebrow: 'Pembunuh senyap #3 · Staf rapuh',
      line1: 'Juruwang anda',
      line2: 'paling lemah dalam operasi.',
      body: 'MC. Tak datang. Letak jawatan tanpa notis. Latih 3 minggu, hilang dalam 2 bulan. Kos bertambah setiap pusingan.',
      stat: 'RM2,500/bln',
      statLabel: 'kos penuh seorang juruwang: gaji + EPF + SOCSO + OT',
      imageBrief: 'Kaunter juruwang kosong dengan nota "balik 10 minit"',
      bg: 'white',
    },
    {
      eyebrow: 'Pembunuh senyap #4 · Tiada ingatan',
      line1: 'Mereka makan. Mereka bayar.',
      line2: 'Hilang selama-lamanya.',
      body: 'Tiada nombor. Tiada nama. Tiada sebab nak balik. Esok anda mula dari kosong — terus bayar untuk tarik orang asing yang sama setiap hari.',
      stat: '70%',
      statLabel: 'hasil F&B yang sihat datang daripada pelanggan tetap',
      imageBrief: 'Pelanggan keluar tanpa data kesetiaan ditangkap',
      bg: 'soft',
    },
    {
      eyebrow: 'Pembunuh senyap #5 · Tersangkut pada harga',
      line1: 'Perlumbaan ke bawah.',
      line2: 'Sebab tiada yang lain.',
      body: 'Tiada kesetiaan. Tiada kombo. Tiada sebab pelanggan pilih anda berbanding kafe sebelah. Jadi anda diskaun — margin terkikis satu promo demi satu.',
      stat: '+15%',
      statLabel: 'kenaikan saiz tiket daripada prompt upsell automatik di POS',
      imageBrief: 'Dua kafe bersebelahan dengan papan diskaun di tingkap',
      bg: 'white',
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// PROMISES (3 pillars — more control / more sales / more customers)
// ─────────────────────────────────────────────────────────────
interface Promise3 {
  eyebrow: string;
  title: string;
  body: string;
  stat: string;
  icon: LucideIcon;
}

const PROMISES: Record<Locale, Promise3[]> = {
  en: [
    {
      eyebrow: '1 · Control',
      title: 'More control.',
      body: 'Every transaction logged. Every shift reconciled. Every cent accounted for.',
      stat: '100%',
      icon: Eye,
    },
    {
      eyebrow: '2 · Sales',
      title: 'More sales.',
      body: 'Upsell prompts. Faster checkout. Bigger tickets — without more staff.',
      stat: '+15%',
      icon: TrendingUp,
    },
    {
      eyebrow: '3 · Customers',
      title: 'More customers.',
      body: 'Loyalty + WhatsApp turn first-time strangers into regulars.',
      stat: '70%',
      icon: Heart,
    },
  ],
  ms: [
    {
      eyebrow: '1 · Kawalan',
      title: 'Lebih kawalan.',
      body: 'Setiap transaksi direkod. Setiap shift disesuaikan. Setiap sen dikira.',
      stat: '100%',
      icon: Eye,
    },
    {
      eyebrow: '2 · Jualan',
      title: 'Lebih jualan.',
      body: 'Prompt upsell. Checkout pantas. Bil besar — tanpa staf tambah.',
      stat: '+15%',
      icon: TrendingUp,
    },
    {
      eyebrow: '3 · Pelanggan',
      title: 'Lebih pelanggan.',
      body: 'Kesetiaan + WhatsApp tukar orang asing kepada pelanggan tetap.',
      stat: '70%',
      icon: Heart,
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// FUN FACTS (horizontal carousel)
// ─────────────────────────────────────────────────────────────
interface FunFact {
  stat: string;
  label: string;
}

const FUN_FACTS: Record<Locale, FunFact[]> = {
  en: [
    { stat: '47%', label: 'of F&B closures cite poor cash-flow control' },
    { stat: 'RM200', label: 'avg monthly cashier theft loss without POS reconciliation' },
    { stat: '+23%', label: 'repeat visits when loyalty is built into the POS' },
    { stat: '12–20%', label: 'ticket lift from kiosk self-order vs counter only' },
    { stat: '−12%', label: 'customers under 30 lost if you accept cash only' },
    { stat: '5–7yr', label: 'average POS lifespan — wrong choice = wrong for years' },
    { stat: '60%', label: "of customers cite slow checkout as a reason they don't return" },
    { stat: '+15%', label: 'per-ticket lift from automatic upsell prompts' },
  ],
  ms: [
    { stat: '47%', label: 'penutupan F&B disebabkan kawalan aliran tunai lemah' },
    { stat: 'RM200', label: 'purata kerugian kecurian juruwang/bulan tanpa penyesuaian POS' },
    { stat: '+23%', label: 'lawatan berulang bila kesetiaan dibina dalam POS' },
    { stat: '12–20%', label: 'kenaikan tiket dari kiosk layan diri vs kaunter sahaja' },
    { stat: '−12%', label: 'pelanggan bawah 30 hilang jika terima tunai sahaja' },
    { stat: '5–7thn', label: 'jangka hayat POS purata — pilihan salah kos sepanjang masa' },
    { stat: '60%', label: 'pelanggan kata checkout lambat sebab mereka tak datang balik' },
    { stat: '+15%', label: 'kenaikan setiap tiket daripada prompt upsell automatik' },
  ],
};

// ─────────────────────────────────────────────────────────────
// UI STRINGS
// ─────────────────────────────────────────────────────────────
interface UiStrings {
  meta: { title: string; description: string; keywords: string };
  urgencyBar: {
    label: string;
    suffix: string;
    cta: string;
    dismiss: string;
  };
  hero: {
    eyebrow: string;
    h1Line1: string;
    h1Line2: string;
    sub1: string;
    sub2: string;
    cta: string;
    secondaryLink: string;
    impatientLink: string;
    scarcityStrip: string;
    imageBrief: string;
    trustStrip: string;
  };
  quickPicks: {
    eyebrow: string;
    line1: string;
    line2: string;
    items: { tag: string; modelId: ModelId; blurb: string }[];
    cta: string;
  };
  lossMath: {
    eyebrow: string;
    line1: string;
    line2: string;
    body: string;
    stats: { value: string; label: string }[];
    cta: string;
  };
  promisesHead: { eyebrow: string; line1: string; line2: string };
  funFactsHead: { eyebrow: string; line1: string; line2: string; swipeHint: string };
  intro: { line1: string; line2: string; sub: string };
  bridge: {
    eyebrow: string;
    line1: string;
    line2: string;
    body: string;
    cta: string;
    imageBrief: string;
  };
  quizIntro: { eyebrow: string; line1: string; line2: string; body: string; cta: string };
  quizUi: { questionOf: (n: number, total: number) => string; reset: string; back: string; skip: string };
  result: {
    eyebrow: string;
    title: string;
    pricePrimary: (perMonth: string) => string;
    priceAlt: (priceFrom: string) => string;
    monthlyVs: { primary: string; vs: string };
    runnerUp: string;
    quote: string;
    compareAll: string;
    restart: string;
    imageBrief: (modelName: string) => string;
    bonusAnchor: string;
    scarcity: string;
  };
  lineup: {
    eyebrow: string;
    line1: string;
    sub: string;
    budgetLabels: Record<string, string>;
    bestFor: string;
    avoidIf: string;
    getQuote: string;
    footnote: string;
  };
  math: { eyebrow: string; line1: string; line2: string; stats: { value: string; suffix?: string; label: string }[] };
  comparison: {
    eyebrow: string;
    line1: string;
    line2: string;
    cols: { cat: string; typical: string; qpos: string };
    rows: { cat: string; typical: string; qpos: string }[];
    body: string;
    cta: string;
  };
  carrot: {
    eyebrow: string;
    line1: string;
    line2: string;
    body: string;
    units: string[];
    cta: string;
    footnote: string;
  };
  faq: { eyebrow: string; line1: string; line2: string };
  finalCta: { eyebrow: string; line1: string; line2: string; body: string; ctaPrimary: string; ctaSecondary: string };
  sticky: { mobile: string; desktop: string };
  footer: {
    qpos: string;
    qposLinks: { home: string; products: string; pricing: string };
    talk: string;
    talkLinks: { whatsapp: string; web: string; contact: string };
    builtFor: string;
    builtForItems: string[];
    legal: string;
    legalLinks: { privacy: string; terms: string; refund: string };
    tagline: string;
    copyright: string;
    languageSwitch: string;
  };
  waMessages: {
    quizResult: (modelName: string, businessType: string) => string;
    lineupCard: (modelName: string, priceFrom: string) => string;
    demo: string;
    bonus: string;
    defaultSticky: string;
    learnMore: string;
  };
}

const T: Record<Locale, UiStrings> = {
  en: {
    meta: {
      title: 'QPOS Buying Guide — Find the Right POS for Your F&B in 60 Seconds | Malaysia',
      description:
        "Interactive POS buying guide for Malaysian F&B owners. Compare 8 QPOS models, get a free recommendation, and save with our 2-year free software bonus.",
      keywords: 'POS buying guide malaysia, best pos malaysia, F&B POS, restaurant POS malaysia, kiosk malaysia, QPOS',
    },
    urgencyBar: {
      label: '🎁 2-Year Free Software Bonus — RM1,440 saved.',
      suffix: 'Ends in',
      cta: 'Claim now',
      dismiss: 'Dismiss',
    },
    hero: {
      eyebrow: 'POS Buying Guide · 2026',
      h1Line1: 'Pick smart.',
      h1Line2: 'Skip the regret.',
      sub1: 'So many POS types. Only one fits your business.',
      sub2: "Pick wrong → waste RM3,000 + a year of subscriptions you can't escape.",
      cta: 'Start the guide',
      secondaryLink: 'See all 8 models',
      impatientLink: 'Skip — chat on WhatsApp',
      scarcityStrip: '',
      imageBrief: 'All 8 QPOS devices arranged on white background',
      trustStrip: '🇲🇾 Built for Malaysian F&B · 💳 All payments · 🛡️ SST + e-Invoice ready · 📱 WhatsApp support',
    },
    quickPicks: {
      eyebrow: 'In a hurry?',
      line1: 'Most owners',
      line2: 'pick one of these.',
      items: [
        { tag: '🔥 Most popular', modelId: 'mix', blurb: 'Counter by day, kiosk by night. Best all-rounder for cafes & QSR.' },
        { tag: '💸 Smartest entry', modelId: 'qr', blurb: 'Start in 10 minutes. RM249 today, upgrade anytime.' },
        { tag: '⚡ Fastest payback', modelId: 'kiosk', blurb: 'Replaces one cashier. Saves ~RM2,500/mo. Pays back in 4 months.' },
      ],
      cta: 'Get this on WhatsApp',
    },
    lossMath: {
      eyebrow: 'The cost of waiting',
      line1: 'RM30,000+',
      line2: 'lost every year.',
      body: 'Cash leak. Slow checkout. No upsell. No repeat customers. Wrong POS choice. Add it up — and the bleed compounds every month.',
      stats: [
        { value: '−RM2,400/yr', label: 'cash leak without POS reconciliation' },
        { value: '−RM18,000/yr', label: 'missed upsell on counter-only orders' },
        { value: '−RM10,000/yr', label: 'lost repeat customers without loyalty' },
      ],
      cta: 'Stop the bleed',
    },
    promisesHead: {
      eyebrow: 'What to look for',
      line1: 'Three things',
      line2: 'every great POS does.',
    },
    funFactsHead: {
      eyebrow: 'POS reality check',
      line1: 'Numbers most',
      line2: 'owners miss.',
      swipeHint: 'Swipe to see more →',
    },
    intro: {
      line1: 'Five silent ways',
      line2: 'F&B loses money.',
      sub: 'Most owners never see the cost. All five compound — shift after shift, week after week.',
    },
    bridge: {
      eyebrow: 'The fix',
      line1: 'Eight POS.',
      line2: 'One answer for you.',
      body: 'A different model for every kind of F&B operator. The next 60 seconds tells you which.',
      cta: 'Find my POS',
      imageBrief: 'All 8 QPOS models lined up — family portrait',
    },
    quizIntro: {
      eyebrow: 'The 60-second guide',
      line1: 'Six questions.',
      line2: 'One honest answer.',
      body: 'Even if our recommendation is the cheapest model. Especially then.',
      cta: 'Start',
    },
    quizUi: {
      questionOf: (n, total) => `Question ${n} of ${total}`,
      reset: 'Reset',
      back: 'Back',
      skip: 'Skip — give me a quick pick →',
    },
    result: {
      eyebrow: 'Your match',
      title: 'Meet your POS.',
      pricePrimary: (m) => `From RM${m}/mth for 24 mths`,
      priceAlt: (p) => `or RM${p}`,
      monthlyVs: { primary: '/mo', vs: "vs ~RM1,200/mo you'd lose by not fixing this." },
      runnerUp: 'Runner-up if budget shifts:',
      quote: 'Lock my quote on WhatsApp',
      compareAll: 'Compare all 8',
      restart: 'Restart',
      imageBrief: (n) => `Hero shot of ${n}`,
      bonusAnchor: 'Software RM1,440 → FREE for 24 months · Commit this month only.',
      scarcity: '🟢 Limited free onsite install slots for KL · Selangor · Penang',
    },
    lineup: {
      eyebrow: 'The full lineup',
      line1: 'Meet the family.',
      sub: 'Each one solves a specific problem. Find yours below.',
      budgetLabels: {
        all: 'All',
        under1k: 'Under RM1k',
        '1k-3k': 'RM1k–3k',
        '3k-5k': 'RM3k–5k',
        '5k+': 'RM5k+',
      },
      bestFor: 'Best for:',
      avoidIf: 'Avoid if:',
      getQuote: 'Get quote',
      footnote: '*Per-month figure based on 24-month amortization including the 2-year free software bonus.',
    },
    math: {
      eyebrow: 'The numbers',
      line1: 'Math beats',
      line2: 'adjectives.',
      stats: [
        { value: 'RM1,440', label: 'saved with the 2-year free software bonus' },
        { value: '~4', suffix: 'mo', label: 'payback when a kiosk replaces a cashier' },
        { value: '24/7', label: 'WhatsApp support in BM · EN · 中文' },
      ],
    },
    comparison: {
      eyebrow: 'What separates good from bad',
      line1: 'Same stack.',
      line2: 'Different math.',
      cols: { cat: 'Category', typical: 'Typical', qpos: 'QPOS' },
      rows: [
        { cat: 'Cloud software', typical: 'RM150–250/mo, forever', qpos: '2 years FREE, then optional' },
        { cat: 'Hardware + software', typical: 'Separate vendors', qpos: 'One bundle, one team' },
        { cat: 'Loyalty & promos', typical: '+RM100–200/mo subscription', qpos: 'Built in (QBot)' },
        { cat: 'Self-service mode', typical: 'Separate kiosk pillar (RM10k+)', qpos: 'Built into models from RM4,080' },
        { cat: 'Setup & training', typical: 'RM800–1,500 extra', qpos: 'Free, onsite' },
        { cat: 'Support', typical: 'Email ticket queue', qpos: 'WhatsApp · BM · EN · 中文' },
        { cat: 'Built for', typical: 'Generic global market', qpos: 'Designed for Malaysian F&B' },
      ],
      body: 'See it yourself. Free 15-minute WhatsApp demo.',
      cta: 'Book free demo',
    },
    carrot: {
      eyebrow: 'This month only · ends in',
      line1: 'RM1,440 → FREE.',
      line2: 'For 24 months.',
      body: "Every QPOS includes 12 months of cloud software. Commit this month and we double it — at zero extra cost. Miss this month, you pay full price.",
      units: ['Days', 'Hours', 'Minutes', 'Seconds'],
      cta: 'Lock my 2-year bonus now',
      footnote: '🟢 Limited free onsite installation slots for KL · Selangor · Penang this month. First-commit, first-served.',
    },
    faq: { eyebrow: 'Questions', line1: 'Everything you', line2: 'want to know.' },
    finalCta: {
      eyebrow: 'Every month you wait',
      line1: 'Costs you RM1,200+.',
      line2: 'Talk to a human.',
      body: "15 minutes on WhatsApp. We tell you the model. Even if it's the RM249 one. Don't be the 75% who buy wrong first.",
      ctaPrimary: 'Chat on WhatsApp now',
      ctaSecondary: 'Restart the guide',
    },
    sticky: {
      mobile: 'Chat on WhatsApp — Free consultation',
      desktop: 'WhatsApp Us',
    },
    footer: {
      qpos: 'QPOS',
      qposLinks: { home: 'Home', products: 'All products', pricing: 'Pricing' },
      talk: 'Talk to us',
      talkLinks: { whatsapp: 'WhatsApp +6012-6909-189', web: 'www.qbot.now', contact: 'Contact' },
      builtFor: 'Built for',
      builtForItems: ['Cafes & restaurants', 'Hawker stalls', 'Food trucks & pop-ups', 'Quick service'],
      legal: 'Legal',
      legalLinks: { privacy: 'Privacy', terms: 'Terms', refund: 'Refund' },
      tagline: 'All-in-One POS Solutions, Powered by AI. Visa · Mastercard · MAE · FPX · GrabPay · TNG · Alipay · WeChat · Boost.',
      copyright: '© 2026 CRAVE Asia.',
      languageSwitch: 'Bahasa Melayu',
    },
    waMessages: {
      quizResult: (m, b) =>
        `Hi QPOS! I just completed your POS Buying Guide. It recommended ${m} for my ${b}. Please send me a quote and lock in my 2-year free software bonus. Thanks!`,
      lineupCard: (m, p) =>
        `Hi QPOS! I'm interested in ${m} (from RM${p}). Please send me a quote and details on the 2-year free software bonus.`,
      demo: `Hi QPOS! I'd like to book a free 15-minute WhatsApp demo. Please let me know available times.`,
      bonus: `Hi QPOS! I want to lock in the 2-year free software bonus this month. Please send me details.`,
      defaultSticky: `Hi QPOS! I'm browsing your POS Buying Guide. Please help me pick the right model.`,
      learnMore: `Hi QPOS! I'd like to learn more.`,
    },
  },
  ms: {
    meta: {
      title: 'Panduan Membeli POS QPOS — Cari POS Yang Tepat untuk F&B Anda dalam 60 Saat | Malaysia',
      description:
        'Panduan interaktif membeli POS untuk pemilik F&B Malaysia. Bandingkan 8 model QPOS, dapatkan cadangan percuma, dan jimat dengan bonus perisian percuma 2 tahun.',
      keywords: 'panduan POS malaysia, POS terbaik malaysia, POS F&B, POS restoran malaysia, kiosk malaysia, QPOS',
    },
    urgencyBar: {
      label: '🎁 Bonus Perisian Percuma 2 Tahun — RM1,440 dijimatkan.',
      suffix: 'Tamat dalam',
      cta: 'Tuntut sekarang',
      dismiss: 'Tutup',
    },
    hero: {
      eyebrow: 'Panduan Membeli POS · 2026',
      h1Line1: 'Pilih dengan bijak.',
      h1Line2: 'Elak penyesalan.',
      sub1: 'Banyak jenis POS. Hanya satu sesuai untuk perniagaan anda.',
      sub2: 'Pilih yang salah → rugi RM3,000 + setahun langganan yang tak boleh elak.',
      cta: 'Mula panduan',
      secondaryLink: 'Lihat semua 8 model',
      impatientLink: 'Lompat — chat WhatsApp',
      scarcityStrip: '',
      imageBrief: 'Semua 8 peranti QPOS disusun atas latar putih',
      trustStrip: '🇲🇾 Dibina untuk F&B Malaysia · 💳 Semua bayaran · 🛡️ Sedia SST + e-Invois · 📱 Sokongan WhatsApp',
    },
    quickPicks: {
      eyebrow: 'Tergesa-gesa?',
      line1: 'Kebanyakan pemilik',
      line2: 'pilih salah satu daripada ini.',
      items: [
        { tag: '🔥 Paling popular', modelId: 'mix', blurb: 'Kaunter siang, kiosk malam. Terbaik untuk kafe & QSR.' },
        { tag: '💸 Mula paling pintar', modelId: 'qr', blurb: 'Mula dalam 10 minit. RM249 hari ini, naik taraf bila-bila.' },
        { tag: '⚡ Pulang modal pantas', modelId: 'kiosk', blurb: 'Ganti satu juruwang. Jimat ~RM2,500/bln. Pulang modal 4 bulan.' },
      ],
      cta: 'Dapatkan di WhatsApp',
    },
    lossMath: {
      eyebrow: 'Kos bertangguh',
      line1: 'RM30,000+',
      line2: 'hilang setiap tahun.',
      body: 'Wang bocor. Checkout lambat. Tiada upsell. Tiada pelanggan tetap. POS salah. Jumlahkan — dan kerugian bertambah setiap bulan.',
      stats: [
        { value: '−RM2,400/thn', label: 'wang bocor tanpa penyesuaian POS' },
        { value: '−RM18,000/thn', label: 'upsell terlepas pada pesanan kaunter sahaja' },
        { value: '−RM10,000/thn', label: 'pelanggan tetap hilang tanpa kesetiaan' },
      ],
      cta: 'Hentikan kerugian',
    },
    promisesHead: {
      eyebrow: 'Apa yang perlu dicari',
      line1: 'Tiga perkara',
      line2: 'yang POS hebat patut buat.',
    },
    funFactsHead: {
      eyebrow: 'Realiti POS',
      line1: 'Nombor yang',
      line2: 'kebanyakan terlepas pandang.',
      swipeHint: 'Leret untuk lihat lagi →',
    },
    intro: {
      line1: '5 cara senyap',
      line2: 'F&B kerugian.',
      sub: 'Kebanyakan pemilik tak nampak kosnya. Kelima-lima ini bertambah — shift demi shift, minggu demi minggu.',
    },
    bridge: {
      eyebrow: 'Penyelesaian',
      line1: 'Lapan POS.',
      line2: 'Satu jawapan untuk anda.',
      body: 'Model berbeza untuk setiap jenis pengendali F&B. 60 saat akan datang beritahu yang mana satu.',
      cta: 'Cari POS saya',
      imageBrief: 'Semua 8 model QPOS berbaris — potret keluarga',
    },
    quizIntro: {
      eyebrow: 'Panduan 60 saat',
      line1: 'Enam soalan.',
      line2: 'Satu jawapan jujur.',
      body: 'Walaupun cadangan kami model termurah. Terutamanya begitu.',
      cta: 'Mula',
    },
    quizUi: {
      questionOf: (n, total) => `Soalan ${n} daripada ${total}`,
      reset: 'Set semula',
      back: 'Kembali',
      skip: 'Lompat — beri saya pilihan pantas →',
    },
    result: {
      eyebrow: 'Padanan anda',
      title: 'Kenali POS anda.',
      pricePrimary: (m) => `Dari RM${m}/bln untuk 24 bln`,
      priceAlt: (p) => `atau RM${p}`,
      monthlyVs: { primary: '/bln', vs: 'berbanding ~RM1,200/bln anda rugi kalau tak baiki.' },
      runnerUp: 'Pilihan kedua jika bajet berubah:',
      quote: 'Kunci sebut harga di WhatsApp',
      compareAll: 'Banding semua 8',
      restart: 'Mula semula',
      imageBrief: (n) => `Gambar utama ${n}`,
      bonusAnchor: 'Perisian RM1,440 → PERCUMA selama 24 bulan · Komited bulan ini sahaja.',
      scarcity: '🟢 Slot pemasangan di lokasi percuma terhad untuk KL · Selangor · Pulau Pinang',
    },
    lineup: {
      eyebrow: 'Senarai lengkap',
      line1: 'Kenali keluarga.',
      sub: 'Setiap satu selesaikan masalah khusus. Cari milik anda di bawah.',
      budgetLabels: {
        all: 'Semua',
        under1k: 'Bawah RM1k',
        '1k-3k': 'RM1k–3k',
        '3k-5k': 'RM3k–5k',
        '5k+': 'RM5k+',
      },
      bestFor: 'Sesuai untuk:',
      avoidIf: 'Elak jika:',
      getQuote: 'Sebut harga',
      footnote: '*Angka per-bulan berdasarkan amortisasi 24 bulan termasuk bonus perisian percuma 2 tahun.',
    },
    math: {
      eyebrow: 'Nombor',
      line1: 'Matematik kalahkan',
      line2: 'kata sifat.',
      stats: [
        { value: 'RM1,440', label: 'dijimatkan dengan bonus perisian percuma 2 tahun' },
        { value: '~4', suffix: 'bln', label: 'pulang modal bila kiosk ganti juruwang' },
        { value: '24/7', label: 'sokongan WhatsApp BM · EN · 中文' },
      ],
    },
    comparison: {
      eyebrow: 'Apa beza yang baik dengan yang buruk',
      line1: 'Sama susunan.',
      line2: 'Matematik berbeza.',
      cols: { cat: 'Kategori', typical: 'Biasa', qpos: 'QPOS' },
      rows: [
        { cat: 'Perisian awan', typical: 'RM150–250/bln, selamanya', qpos: '2 TAHUN PERCUMA, kemudian pilihan' },
        { cat: 'Perkakasan + perisian', typical: 'Pembekal berasingan', qpos: 'Satu pakej, satu pasukan' },
        { cat: 'Kesetiaan & promosi', typical: '+RM100–200/bln langganan', qpos: 'Built-in (QBot)' },
        { cat: 'Mod layan diri', typical: 'Tiang kiosk berasingan (RM10k+)', qpos: 'Built-in dari RM4,080' },
        { cat: 'Pemasangan & latihan', typical: 'RM800–1,500 tambahan', qpos: 'Percuma, di lokasi' },
        { cat: 'Sokongan', typical: 'Tiket email', qpos: 'WhatsApp · BM · EN · 中文' },
        { cat: 'Dibina untuk', typical: 'Pasaran global umum', qpos: 'Dibina untuk F&B Malaysia' },
      ],
      body: 'Lihat sendiri. Demo WhatsApp percuma 15 minit.',
      cta: 'Tempah demo percuma',
    },
    carrot: {
      eyebrow: 'Bulan ini sahaja · tamat dalam',
      line1: 'RM1,440 → PERCUMA.',
      line2: 'Selama 24 bulan.',
      body: 'Setiap QPOS termasuk 12 bulan perisian awan. Komited bulan ini dan kami gandakan — tanpa kos tambahan. Terlepas bulan ini, anda bayar harga penuh.',
      units: ['Hari', 'Jam', 'Minit', 'Saat'],
      cta: 'Kunci bonus 2 tahun saya sekarang',
      footnote: '🟢 Slot pemasangan di lokasi percuma terhad untuk KL · Selangor · Pulau Pinang. Yang komited dulu, dapat dulu.',
    },
    faq: { eyebrow: 'Soalan', line1: 'Semua yang anda', line2: 'ingin tahu.' },
    finalCta: {
      eyebrow: 'Setiap bulan anda tangguh',
      line1: 'Kos anda RM1,200+.',
      line2: 'Bercakap dengan manusia.',
      body: '15 minit di WhatsApp. Kami beritahu modelnya. Walaupun model RM249. Jangan jadi 75% yang pilih salah dulu.',
      ctaPrimary: 'Chat WhatsApp sekarang',
      ctaSecondary: 'Mula semula panduan',
    },
    sticky: {
      mobile: 'Chat di WhatsApp — Perundingan percuma',
      desktop: 'WhatsApp Kami',
    },
    footer: {
      qpos: 'QPOS',
      qposLinks: { home: 'Laman utama', products: 'Semua produk', pricing: 'Harga' },
      talk: 'Hubungi kami',
      talkLinks: { whatsapp: 'WhatsApp +6012-6909-189', web: 'www.qbot.now', contact: 'Hubungi' },
      builtFor: 'Dibina untuk',
      builtForItems: ['Kafe & restoran', 'Gerai jaja', 'Trak makanan & pop-up', 'Perkhidmatan pantas'],
      legal: 'Undang-undang',
      legalLinks: { privacy: 'Privasi', terms: 'Terma', refund: 'Bayaran balik' },
      tagline: 'Penyelesaian POS Semua-Dalam-Satu, Dikuasakan AI. Visa · Mastercard · MAE · FPX · GrabPay · TNG · Alipay · WeChat · Boost.',
      copyright: '© 2026 CRAVE Asia.',
      languageSwitch: 'English',
    },
    waMessages: {
      quizResult: (m, b) =>
        `Hi QPOS! Saya baru selesai Panduan Membeli POS anda. Ia mencadangkan ${m} untuk ${b} saya. Sila hantar saya sebut harga dan kunci bonus perisian percuma 2 tahun saya. Terima kasih!`,
      lineupCard: (m, p) =>
        `Hi QPOS! Saya berminat dengan ${m} (dari RM${p}). Sila hantar saya sebut harga dan butiran bonus perisian percuma 2 tahun.`,
      demo: `Hi QPOS! Saya ingin tempah demo WhatsApp percuma 15 minit. Sila beritahu saya masa yang ada.`,
      bonus: `Hi QPOS! Saya nak kunci bonus perisian percuma 2 tahun bulan ini. Sila hantar saya butiran.`,
      defaultSticky: `Hi QPOS! Saya sedang lihat Panduan Membeli POS anda. Tolong saya pilih model yang sesuai.`,
      learnMore: `Hi QPOS! Saya ingin tahu lebih lanjut.`,
    },
  },
};

// ─────────────────────────────────────────────────────────────
// REVEAL
// ─────────────────────────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  className = '',
  y = 24,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// IMAGE PLACEHOLDER
// ─────────────────────────────────────────────────────────────
function ImagePlaceholder({
  brief,
  dimensions,
  className = '',
  aspect = 'aspect-[4/3]',
  tone = 'soft',
}: {
  brief: string;
  dimensions: string;
  className?: string;
  aspect?: string;
  tone?: 'soft' | 'white';
}) {
  const bg =
    tone === 'soft'
      ? 'bg-gradient-to-b from-[#f5f5f7] to-[#fafafb]'
      : 'bg-white border border-[#E5E5E5]/60';
  return (
    <div
      role="img"
      aria-label={`${brief} (${dimensions})`}
      className={`w-full ${aspect} ${bg} rounded-[28px] flex flex-col items-center justify-center p-6 text-center ${className}`}
    >
      <ImageIcon size={26} strokeWidth={1.4} className="text-gray-400 mb-3 opacity-60" />
      <div className="text-xs text-gray-500 max-w-sm leading-snug">{brief}</div>
      <div className="text-[10px] text-gray-400 mt-2 font-mono">{dimensions}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BUTTONS
// ─────────────────────────────────────────────────────────────
function PrimaryButton({
  children,
  onClick,
  href,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}) {
  const base = `inline-flex items-center justify-center gap-1.5 px-6 py-3 min-h-[44px] rounded-full bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white text-sm sm:text-base font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 ${className}`;
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={base}>
      {children}
    </button>
  );
}

function LinkArrow({
  children,
  onClick,
  href,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}) {
  const base = `inline-flex items-center gap-0.5 text-purple-700 hover:underline text-sm sm:text-base font-medium ${className}`;
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
        {children}
        <ChevronRight size={16} strokeWidth={2.5} />
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={base}>
      {children}
      <ChevronRight size={16} strokeWidth={2.5} />
    </button>
  );
}

function WhatsAppButton({
  children,
  href,
  onClick,
  className = '',
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  const base = `inline-flex items-center justify-center gap-1.5 px-6 py-3 min-h-[44px] rounded-full text-sm sm:text-base font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 bg-[#25D366] hover:bg-[#1FB855] text-white ${className}`;
  const content = (
    <>
      <WhatsAppIcon size={16} />
      {children}
    </>
  );
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={base}>
      {content}
    </button>
  );
}

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// STAGE
// ─────────────────────────────────────────────────────────────
function Stage({
  id,
  bg = 'white',
  children,
  className = '',
  padding = 'lg',
  maxWidth = 'default',
}: {
  id?: string;
  bg?: 'white' | 'soft';
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  maxWidth?: 'default' | 'narrow' | 'wide';
}) {
  const padClass =
    padding === 'xl'
      ? 'py-24 sm:py-32 lg:py-44'
      : padding === 'lg'
        ? 'py-20 sm:py-28 lg:py-36'
        : padding === 'md'
          ? 'py-16 sm:py-20 lg:py-28'
          : 'py-10 sm:py-14 lg:py-20';
  const widthClass =
    maxWidth === 'narrow'
      ? 'max-w-[820px]'
      : maxWidth === 'wide'
        ? 'max-w-[1200px]'
        : 'max-w-[980px]';
  return (
    <section
      id={id}
      className={`relative w-full ${className}`}
      style={bg === 'soft' ? { backgroundColor: APPLE_SOFT_BG } : { backgroundColor: '#ffffff' }}
    >
      <div className={`${widthClass} mx-auto px-5 sm:px-6 ${padClass}`}>{children}</div>
    </section>
  );
}

function Headline({
  line1,
  line2,
  as = 'h2',
  size = 'lg',
  line2Tone = 'muted',
}: {
  line1: ReactNode;
  line2?: ReactNode;
  as?: 'h1' | 'h2';
  size?: 'md' | 'lg' | 'xl';
  line2Tone?: 'muted' | 'accent';
}) {
  const sizeClass =
    size === 'xl'
      ? 'text-[44px] sm:text-7xl lg:text-[88px]'
      : size === 'lg'
        ? 'text-[40px] sm:text-6xl lg:text-[72px]'
        : 'text-[32px] sm:text-5xl lg:text-6xl';
  const line2Class = line2Tone === 'accent' ? 'text-purple-700' : 'text-[#86868b]';
  const cls = `${sizeClass} font-semibold tracking-[-0.025em] leading-[1.05]`;
  const content = (
    <>
      <span style={{ color: APPLE_TEXT }}>{line1}</span>
      {line2 && (
        <>
          <br />
          <span className={line2Class}>{line2}</span>
        </>
      )}
    </>
  );
  if (as === 'h1') return <h1 className={cls}>{content}</h1>;
  return <h2 className={cls}>{content}</h2>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="text-sm sm:text-base font-medium text-[#86868b] mb-3">{children}</div>;
}


// ─────────────────────────────────────────────────────────────
// SECTIONS
// ─────────────────────────────────────────────────────────────
function HeroSection({ t, onStartQuiz }: { t: UiStrings; onStartQuiz: () => void }) {
  const impatientMsg = `Hi QPOS! I don't want to take the quiz — just send me a quote for your best-fit POS for my F&B. Thanks!`;
  return (
    <Stage padding="lg" maxWidth="wide">
      <div className="text-center">
        <Reveal>
          <div className="text-sm sm:text-base font-medium text-[#86868b] mb-4">{t.hero.eyebrow}</div>
        </Reveal>
        <Reveal delay={0.05}>
          <h1
            className="font-semibold tracking-[-0.03em] leading-[0.98] text-[52px] sm:text-8xl lg:text-[112px]"
            style={{ color: APPLE_TEXT }}
          >
            {t.hero.h1Line1}
          </h1>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="font-semibold tracking-[-0.03em] leading-[0.98] text-[52px] sm:text-8xl lg:text-[112px] text-[#86868b]">
            {t.hero.h1Line2}
          </h1>
        </Reveal>
        <Reveal delay={0.18}>
          <p className="mt-6 sm:mt-8 mx-auto max-w-2xl text-lg sm:text-2xl text-[#1d1d1f] leading-snug">
            {t.hero.sub1}
            <br className="hidden sm:block" />
            <span className="text-[#86868b]">{t.hero.sub2}</span>
          </p>
        </Reveal>
        <Reveal delay={0.28}>
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <PrimaryButton onClick={onStartQuiz}>{t.hero.cta}</PrimaryButton>
              <WhatsAppButton href={waLink(impatientMsg)}>
                {t.hero.impatientLink}
              </WhatsAppButton>
            </div>
            <LinkArrow
              onClick={() => document.getElementById('lineup')?.scrollIntoView({ behavior: 'smooth' })}
              className="!text-xs sm:!text-sm"
            >
              {t.hero.secondaryLink}
            </LinkArrow>
          </div>
        </Reveal>

        {t.hero.scarcityStrip && (
          <Reveal delay={0.34}>
            <div className="mt-7 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-xs sm:text-sm text-purple-900">
              <Zap size={14} className="text-[#F58220]" strokeWidth={2.5} aria-hidden="true" />
              <span>{t.hero.scarcityStrip}</span>
            </div>
          </Reveal>
        )}

        <Reveal delay={0.42} y={32}>
          <div className="mt-12 sm:mt-16 lg:mt-20 mx-auto max-w-5xl">
            <ImagePlaceholder brief={t.hero.imageBrief} dimensions="1600×900px" aspect="aspect-[16/9]" />
          </div>
        </Reveal>

        <Reveal delay={0.5}>
          <p className="mt-10 sm:mt-12 text-sm text-[#86868b]">{t.hero.trustStrip}</p>
        </Reveal>
      </div>
    </Stage>
  );
}

function MistakesIntroSection({ t }: { t: UiStrings }) {
  return (
    <Stage padding="sm" bg="soft">
      <Reveal>
        <div
          role="alert"
          className="warning-pulse mx-auto max-w-3xl text-center rounded-3xl border-2 border-red-600 bg-red-50/40 px-5 sm:px-8 py-8 sm:py-10"
        >
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-red-600 uppercase tracking-[0.18em] mb-4">
            <span
              className="warning-dot inline-block w-2 h-2 rounded-full bg-red-600"
              aria-hidden="true"
            />
            Warning
          </div>
          <Headline line1={t.intro.line1} line2={t.intro.line2} size="lg" />
          <p className="mt-5 mx-auto max-w-2xl text-base sm:text-lg text-[#1d1d1f] leading-snug">
            {t.intro.sub}
          </p>
        </div>
      </Reveal>
    </Stage>
  );
}

function PainStage({ pain }: { pain: PainCopy }) {
  return (
    <Stage padding="md" bg={pain.bg}>
      <Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-5xl mx-auto">
          <div className="lg:col-span-7">
            <Eyebrow>{pain.eyebrow}</Eyebrow>
            <Headline line1={pain.line1} line2={pain.line2} size="md" />
            <p className="mt-5 text-base sm:text-lg text-[#1d1d1f] leading-relaxed max-w-xl">
              {pain.body}
            </p>
          </div>
          <div className="lg:col-span-5 lg:border-l lg:border-[#d2d2d7]/60 lg:pl-10">
            <div
              className="font-semibold tracking-[-0.03em] text-6xl sm:text-7xl lg:text-8xl tabular-nums leading-none"
              style={{ color: APPLE_TEXT }}
            >
              {pain.stat}
            </div>
            <div className="mt-3 text-sm sm:text-base text-[#86868b] leading-snug max-w-xs">
              {pain.statLabel}
            </div>
          </div>
        </div>
      </Reveal>
    </Stage>
  );
}

function LossMathSection({ t, onStartQuiz }: { t: UiStrings; onStartQuiz: () => void }) {
  return (
    <Stage padding="md">
      <Reveal className="text-center mb-8 sm:mb-10 max-w-3xl mx-auto">
        <Eyebrow>{t.lossMath.eyebrow}</Eyebrow>
        <h2
          className="font-semibold tracking-[-0.03em] leading-[0.98] text-[56px] sm:text-7xl lg:text-[96px] text-[#F58220] tabular-nums"
        >
          {t.lossMath.line1}
        </h2>
        <h3
          className="mt-2 font-semibold tracking-[-0.025em] text-[24px] sm:text-3xl lg:text-4xl text-[#86868b]"
        >
          {t.lossMath.line2}
        </h3>
        <p className="mt-6 text-base text-[#1d1d1f] leading-relaxed max-w-xl mx-auto">
          {t.lossMath.body}
        </p>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 lg:gap-6 max-w-3xl mx-auto mb-10">
        {t.lossMath.stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div className="text-center px-2">
              <div className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-[#F58220] tabular-nums whitespace-nowrap">
                {s.value}
              </div>
              <div className="mt-2 text-xs sm:text-sm text-[#86868b] leading-snug">
                {s.label}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div className="flex justify-center">
          <PrimaryButton onClick={onStartQuiz}>{t.lossMath.cta}</PrimaryButton>
        </div>
      </Reveal>
    </Stage>
  );
}

function ThreePromisesSection({ t, locale }: { t: UiStrings; locale: Locale }) {
  const items = PROMISES[locale];
  return (
    <Stage padding="lg" maxWidth="wide">
      <Reveal className="text-center mb-12 sm:mb-16">
        <Eyebrow>{t.promisesHead.eyebrow}</Eyebrow>
        <Headline line1={t.promisesHead.line1} line2={t.promisesHead.line2} size="xl" />
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
        {items.map((p, i) => {
          const Icon = p.icon;
          return (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="bg-[#f5f5f7] rounded-3xl p-7 sm:p-9 h-full flex flex-col">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-6">
                  <Icon size={22} strokeWidth={2} className="text-purple-700" />
                </div>
                <div className="text-sm font-medium text-[#86868b] mb-2">{p.eyebrow}</div>
                <h3
                  className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] leading-tight mb-4"
                  style={{ color: APPLE_TEXT }}
                >
                  {p.title}
                </h3>
                <p className="text-base text-[#86868b] leading-relaxed mb-7 flex-1">{p.body}</p>
                <div
                  className="text-5xl sm:text-6xl font-semibold tracking-[-0.03em] tabular-nums"
                  style={{ color: APPLE_TEXT }}
                >
                  {p.stat}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Stage>
  );
}

function FunFactCarousel({ t, locale }: { t: UiStrings; locale: Locale }) {
  const items = FUN_FACTS[locale];
  return (
    <Stage padding="lg" bg="soft" maxWidth="wide">
      <Reveal className="text-center mb-10 sm:mb-14 max-w-3xl mx-auto">
        <Eyebrow>{t.funFactsHead.eyebrow}</Eyebrow>
        <Headline line1={t.funFactsHead.line1} line2={t.funFactsHead.line2} size="xl" />
        <p className="mt-5 text-sm text-[#86868b]">{t.funFactsHead.swipeHint}</p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="relative -mx-5 sm:-mx-6">
          <div
            className="overflow-x-auto snap-x snap-mandatory px-5 sm:px-6 pb-6 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
            role="region"
            aria-label="POS facts carousel"
          >
            <div className="flex gap-4 sm:gap-5">
              {items.map((f, i) => (
                <div
                  key={i}
                  className="snap-start flex-shrink-0 w-[78%] sm:w-[44%] lg:w-[28%]"
                >
                  <div className="bg-white rounded-3xl p-6 sm:p-8 h-full border border-[#d2d2d7]/40">
                    <div
                      className="font-semibold tracking-[-0.03em] text-5xl sm:text-6xl lg:text-7xl tabular-nums leading-none"
                      style={{ color: APPLE_TEXT }}
                    >
                      {f.stat}
                    </div>
                    <div className="mt-5 text-sm sm:text-base text-[#86868b] leading-snug">
                      {f.label}
                    </div>
                  </div>
                </div>
              ))}
              {/* tail spacer so last card can scroll fully into view */}
              <div className="flex-shrink-0 w-5 sm:w-6" aria-hidden="true" />
            </div>
          </div>
        </div>
      </Reveal>
    </Stage>
  );
}

// ─────────────────────────────────────────────────────────────
// QUIZ
// ─────────────────────────────────────────────────────────────
type QuizAnswers = Record<number, string>;

function QuizSection({
  t,
  locale,
  onComplete,
  result,
  onRestart,
  resultRef,
}: {
  t: UiStrings;
  locale: Locale;
  onComplete: (answers: QuizAnswers) => void;
  result: ReturnType<typeof recommendModel> | null;
  onRestart: () => void;
  resultRef: React.RefObject<HTMLDivElement>;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});

  const questions = QUIZ_QUESTIONS[locale];
  const total = questions.length;
  const current = questions[step];
  const progress = ((step + (result ? 1 : 0)) / total) * 100;

  function handleSelect(value: string) {
    const next = { ...answers, [current.id]: value };
    setAnswers(next);
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      onComplete(next);
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  function handleRestart() {
    setStep(0);
    setAnswers({});
    onRestart();
  }

  function handleSkip() {
    // Fill remaining unanswered with sensible defaults to compute a recommendation
    const filled: QuizAnswers = {
      1: answers[1] || 'starting_out',
      2: answers[2] || 'clean_start',
      3: answers[3] || 'cafe',
      4: answers[4] || 'counter',
      5: answers[5] || '3k-5k',
      6: answers[6] || 'next_few',
    };
    onComplete(filled);
  }

  return (
    <Stage id="quiz" padding="lg" bg="soft">
      {!result && current && (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <Eyebrow>{t.quizIntro.eyebrow}</Eyebrow>
            <Headline line1={t.quizIntro.line1} line2={t.quizIntro.line2} size="md" />
          </div>

          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#86868b]">
                {t.quizUi.questionOf(step + 1, total)}
              </span>
              <button
                type="button"
                onClick={handleRestart}
                className="text-sm font-medium text-[#86868b] hover:text-purple-700 transition-colors"
              >
                {t.quizUi.reset}
              </button>
            </div>
            <div className="h-1 w-full bg-[#d2d2d7] rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-700 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1 text-sm font-medium text-[#86868b] hover:text-purple-700 mb-6 transition-colors"
            >
              <ArrowLeft size={14} />
              {t.quizUi.back}
            </button>
          )}

          <h3
            key={current.id}
            className="font-semibold tracking-[-0.025em] leading-[1.05] text-[28px] sm:text-4xl lg:text-5xl mb-8 sm:mb-10 text-center animate-quiz-fade"
            style={{ color: APPLE_TEXT }}
          >
            {current.prompt}
          </h3>

          <div key={`opts-${current.id}`} className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-quiz-fade">
            {current.options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className="group flex items-center gap-3 text-left p-4 sm:p-5 min-h-[64px] rounded-2xl bg-white border border-[#d2d2d7]/60 hover:border-purple-700 hover:bg-purple-50/30 active:scale-[0.99] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              >
                <span className="text-2xl flex-shrink-0 transition-transform group-hover:scale-110" aria-hidden="true">
                  {opt.emoji}
                </span>
                <span className="text-sm sm:text-base font-medium leading-snug" style={{ color: APPLE_TEXT }}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>

          {step >= 2 && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={handleSkip}
                className="inline-flex items-center gap-1 text-sm font-medium text-[#86868b] hover:text-purple-700 transition-colors"
              >
                {t.quizUi.skip}
              </button>
            </div>
          )}
        </div>
      )}

      {result && (
        <ResultBlock
          t={t}
          locale={locale}
          result={result}
          answers={answers}
          onRestart={handleRestart}
          resultRef={resultRef}
        />
      )}
    </Stage>
  );
}

function ResultBlock({
  t,
  locale,
  result,
  answers,
  onRestart,
  resultRef,
}: {
  t: UiStrings;
  locale: Locale;
  result: ReturnType<typeof recommendModel>;
  answers: QuizAnswers;
  onRestart: () => void;
  resultRef: React.RefObject<HTMLDivElement>;
}) {
  const model = MODEL_BY_ID[result.primary];
  const modelCopy = MODEL_COPY[locale][result.primary];
  const runner = MODEL_BY_ID[result.runnerUp];
  const businessType = BUSINESS_LABEL[locale][answers[3]] || (locale === 'ms' ? 'perniagaan F&B' : 'F&B business');
  const waMsg = t.waMessages.quizResult(model.name, businessType);

  return (
    <div ref={resultRef} className="max-w-3xl mx-auto">
      <div className="text-center mb-10 sm:mb-14">
        <Eyebrow>{t.result.eyebrow}</Eyebrow>
        <Headline line1={t.result.title} size="xl" />
      </div>

      <div className="mx-auto mb-10">
        <ImagePlaceholder
          brief={t.result.imageBrief(model.name)}
          dimensions="900×900px"
          aspect="aspect-square"
          tone="white"
          className="max-w-lg mx-auto"
        />
      </div>

      <div className="text-center">
        <div className="font-semibold tracking-[-0.025em] text-4xl sm:text-6xl lg:text-7xl" style={{ color: APPLE_TEXT }}>
          {model.name}
        </div>
        <p className="mt-4 mx-auto max-w-xl text-lg sm:text-xl text-[#86868b] italic leading-snug">
          &ldquo;{modelCopy.hook}&rdquo;
        </p>

        <div className="mt-8 text-3xl sm:text-4xl font-semibold text-emerald-600 tabular-nums">
          {t.result.pricePrimary(String(model.perMonth))}
        </div>
        <div className="mt-1 text-sm text-[#86868b]">
          {t.result.priceAlt(model.priceFrom.toLocaleString())}
        </div>
      </div>

      <div className="mt-10 mx-auto max-w-md space-y-3">
        {[result.reasons.q1, result.reasons.q3, result.reasons.q4].map((r, i) => (
          <div key={i} className="flex gap-2.5 text-sm sm:text-base text-[#1d1d1f]">
            <span className="text-purple-700 font-bold flex-shrink-0 mt-0.5">✓</span>
            <span>{r}</span>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div
          className="font-semibold tracking-[-0.025em] text-3xl sm:text-5xl lg:text-6xl tabular-nums"
          style={{ color: APPLE_TEXT }}
        >
          RM{model.perMonth}
          <span className="text-[#86868b]">{t.result.monthlyVs.primary}</span>
        </div>
        <div className="mt-2 text-base sm:text-lg text-[#86868b]">{t.result.monthlyVs.vs}</div>
      </div>

      <p className="mt-10 text-sm text-[#86868b] text-center">
        {t.result.runnerUp}{' '}
        <span className="font-medium text-[#1d1d1f]">{runner.name}</span>
      </p>

      <div className="mt-10 mx-auto max-w-xl rounded-3xl bg-gradient-to-b from-purple-50 to-white border border-purple-100 p-5 sm:p-7 text-center">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F58220] mb-3">
          <Flame size={12} strokeWidth={2.5} />
          <span>{t.urgencyBar.label}</span>
        </div>
        <p className="text-sm sm:text-base font-medium text-[#1d1d1f] leading-snug">
          {t.result.bonusAnchor}
        </p>
        <p className="mt-2 text-xs text-[#86868b]">{t.result.scarcity}</p>
      </div>

      <div className="mt-7 flex items-center justify-center gap-5 flex-wrap">
        <WhatsAppButton href={waLink(waMsg)}>{t.result.quote}</WhatsAppButton>
        <LinkArrow
          onClick={() => document.getElementById('lineup')?.scrollIntoView({ behavior: 'smooth' })}
        >
          {t.result.compareAll}
        </LinkArrow>
      </div>

      <div className="mt-5 text-center">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-1 text-sm font-medium text-[#86868b] hover:text-purple-700 transition-colors"
        >
          <ArrowLeft size={12} />
          {t.result.restart}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LINEUP
// ─────────────────────────────────────────────────────────────
type Budget = 'all' | 'under1k' | '1k-3k' | '3k-5k' | '5k+';

function LineupSection({ t, locale }: { t: UiStrings; locale: Locale }) {
  const [filter, setFilter] = useState<Budget>('all');
  const visible = useMemo(
    () => (filter === 'all' ? MODELS : MODELS.filter((m) => m.budgetBucket === filter)),
    [filter],
  );

  return (
    <Stage id="lineup" padding="lg" maxWidth="wide">
      <Reveal className="text-center mb-12 sm:mb-16">
        <Eyebrow>{t.lineup.eyebrow}</Eyebrow>
        <Headline line1={t.lineup.line1} size="xl" />
        <p className="mt-6 mx-auto max-w-2xl text-lg sm:text-xl text-[#86868b] leading-snug">{t.lineup.sub}</p>
      </Reveal>

      <div className="flex flex-wrap justify-center gap-2 mb-10 sm:mb-12">
        {(Object.keys(t.lineup.budgetLabels) as Budget[]).map((b) => (
          <button
            key={b}
            type="button"
            onClick={() => setFilter(b)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === b
                ? 'bg-[#1d1d1f] text-white'
                : 'bg-white text-[#1d1d1f] border border-[#d2d2d7]/80 hover:border-[#1d1d1f]'
            }`}
          >
            {t.lineup.budgetLabels[b]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {visible.map((m, i) => {
          const copy = MODEL_COPY[locale][m.id];
          const waMsg = t.waMessages.lineupCard(m.name, m.priceFrom.toLocaleString());
          return (
            <div
              key={m.id}
              style={{
                animation: 'lineup-fade 0.6s ease-out forwards',
                animationDelay: `${Math.min(i * 0.04, 0.24)}s`,
                opacity: 0,
              }}
            >
              <div className="bg-[#f5f5f7] rounded-3xl p-6 h-full flex flex-col">
                <ImagePlaceholder
                  brief={copy.imageBrief}
                  dimensions="500×500px"
                  aspect="aspect-square"
                  tone="white"
                  className="mb-5"
                />
                <h3
                  className="text-2xl font-semibold tracking-tight mb-1"
                  style={{ color: APPLE_TEXT }}
                >
                  {m.name}
                </h3>
                <p className="text-sm text-[#86868b] leading-snug mb-3 italic">
                  “{copy.hook}”
                </p>
                <div className="text-lg font-semibold text-emerald-600 tabular-nums leading-tight">
                  {t.result.pricePrimary(String(m.perMonth))}
                </div>
                <div className="text-xs text-[#86868b] mb-4">
                  {t.result.priceAlt(m.priceFrom.toLocaleString())}
                </div>
                <div className="text-xs space-y-1.5 mb-5 flex-1 text-[#1d1d1f]">
                  <div>
                    <span className="text-[#86868b]">{t.lineup.bestFor} </span>
                    {copy.bestFor}
                  </div>
                  <div>
                    <span className="text-[#86868b]">{t.lineup.avoidIf} </span>
                    {copy.avoidIf}
                  </div>
                </div>
                <LinkArrow href={waLink(waMsg)} className="!text-sm mt-auto">
                  {t.lineup.getQuote}
                </LinkArrow>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-10 text-xs text-[#86868b] text-center">{t.lineup.footnote}</p>
    </Stage>
  );
}

function ComparisonSection({ t }: { t: UiStrings }) {
  return (
    <Stage padding="lg" bg="soft">
      <Reveal className="text-center mb-12 sm:mb-16">
        <Eyebrow>{t.comparison.eyebrow}</Eyebrow>
        <Headline line1={t.comparison.line1} line2={t.comparison.line2} size="xl" />
      </Reveal>

      <div className="max-w-3xl mx-auto bg-white rounded-3xl overflow-hidden border border-[#d2d2d7]/40">
        {t.comparison.rows.map((r, i) => (
          <div
            key={r.cat}
            className={`grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-y-1 sm:gap-x-6 px-5 sm:px-7 py-3.5 sm:py-4 ${
              i < t.comparison.rows.length - 1 ? 'border-b border-[#d2d2d7]/30' : ''
            } items-baseline`}
          >
            <div className="text-[11px] sm:text-xs text-[#86868b] uppercase tracking-[0.14em] font-medium">
              {r.cat}
            </div>
            <div className="text-sm sm:text-base leading-snug">
              <span className="text-[#86868b] line-through decoration-1 mr-2">
                {r.typical}
              </span>
              <span className="text-[#86868b] mr-2" aria-hidden="true">→</span>
              <span className="font-semibold" style={{ color: APPLE_TEXT }}>
                {r.qpos}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-12 text-center">
          <p className="text-base sm:text-lg text-[#86868b] mb-5">{t.comparison.body}</p>
          <WhatsAppButton href={waLink(t.waMessages.demo)}>{t.comparison.cta}</WhatsAppButton>
        </div>
      </Reveal>
    </Stage>
  );
}

function useEndOfMonthCountdown() {
  const target = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  }, []);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return [days, hours, minutes, seconds];
}

function CarrotSection({ t }: { t: UiStrings }) {
  const values = useEndOfMonthCountdown();

  return (
    <Stage padding="lg">
      <Reveal className="text-center">
        <Eyebrow>{t.carrot.eyebrow}</Eyebrow>
        <Headline line1={t.carrot.line1} line2={t.carrot.line2} size="xl" line2Tone="accent" />
        <p className="mt-6 mx-auto max-w-xl text-lg sm:text-xl text-[#86868b] leading-snug">{t.carrot.body}</p>
      </Reveal>

      <Reveal delay={0.1} y={28}>
        <div className="mt-12 max-w-md mx-auto">
          <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-7">
            {t.carrot.units.map((label, idx) => (
              <div key={label} className="text-center">
                <div
                  className="font-semibold tracking-[-0.025em] tabular-nums text-3xl sm:text-5xl"
                  style={{ color: APPLE_TEXT }}
                >
                  {String(values[idx]).padStart(2, '0')}
                </div>
                <div className="mt-1 text-[10px] sm:text-xs text-[#86868b] uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <WhatsAppButton href={waLink(t.waMessages.bonus)}>{t.carrot.cta}</WhatsAppButton>
          </div>
        </div>
      </Reveal>

      <p className="mt-7 text-xs text-[#86868b] text-center">{t.carrot.footnote}</p>
    </Stage>
  );
}

function FaqSection({ t, locale }: { t: UiStrings; locale: Locale }) {
  const [open, setOpen] = useState<number | null>(0);
  const items = FAQ_ITEMS[locale];

  return (
    <Stage padding="lg" bg="soft">
      <Reveal className="text-center mb-12 sm:mb-16">
        <Eyebrow>{t.faq.eyebrow}</Eyebrow>
        <Headline line1={t.faq.line1} line2={t.faq.line2} size="xl" />
      </Reveal>

      <div className="max-w-2xl mx-auto">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="border-b border-[#d2d2d7]/60">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-4 py-5 sm:py-6 text-left hover:opacity-80 transition-opacity focus:outline-none"
              >
                <span className="text-base sm:text-lg font-medium leading-snug" style={{ color: APPLE_TEXT }}>
                  {item.q}
                </span>
                <span className="flex-shrink-0 text-[#86868b]">
                  {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="pb-5 sm:pb-6 text-base text-[#86868b] leading-relaxed">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
}

function FinalCtaSection({ t, onRestart }: { t: UiStrings; onRestart: () => void }) {
  return (
    <Stage padding="xl">
      <div className="text-center">
        <Eyebrow>{t.finalCta.eyebrow}</Eyebrow>
        <Headline line1={t.finalCta.line1} line2={t.finalCta.line2} size="xl" />
        <p className="mt-6 mx-auto max-w-xl text-lg sm:text-xl text-[#86868b] leading-snug">{t.finalCta.body}</p>
        <div className="mt-8 flex items-center justify-center gap-5 flex-wrap">
          <WhatsAppButton href={waLink(t.waMessages.defaultSticky)}>{t.finalCta.ctaPrimary}</WhatsAppButton>
          <LinkArrow onClick={onRestart}>{t.finalCta.ctaSecondary}</LinkArrow>
        </div>
      </div>
    </Stage>
  );
}

function StickyWhatsApp({ t }: { t: UiStrings }) {
  const href = waLink(t.waMessages.defaultSticky);
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-[#25D366] text-white font-medium text-sm shadow-lg"
        >
          <MessageCircle size={16} />
          {t.sticky.mobile}
        </a>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:inline-flex fixed bottom-6 right-6 z-40 items-center gap-2 px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#1FB855] text-white font-medium text-sm shadow-xl transition-colors"
      >
        <WhatsAppIcon size={16} />
        {t.sticky.desktop}
      </a>
    </>
  );
}

function GuideFooter({ t, locale }: { t: UiStrings; locale: Locale }) {
  const altHref = locale === 'en' ? '/pos-buying-guide?lang=bm' : '/pos-buying-guide?lang=en';
  return (
    <footer className="bg-[#f5f5f7] text-[#86868b]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 py-10 lg:py-14 text-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h3 className="text-[#1d1d1f] font-semibold mb-3">{t.footer.qpos}</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:underline">{t.footer.qposLinks.home}</a></li>
              <li><a href="/products" className="hover:underline">{t.footer.qposLinks.products}</a></li>
              <li><a href="/pricing" className="hover:underline">{t.footer.qposLinks.pricing}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#1d1d1f] font-semibold mb-3">{t.footer.talk}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={waLink(t.waMessages.learnMore)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {t.footer.talkLinks.whatsapp}
                </a>
              </li>
              <li><a href="https://www.qbot.now" className="hover:underline">{t.footer.talkLinks.web}</a></li>
              <li><a href="/contact-us" className="hover:underline">{t.footer.talkLinks.contact}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#1d1d1f] font-semibold mb-3">{t.footer.builtFor}</h3>
            <ul className="space-y-2">
              {t.footer.builtForItems.map((it) => <li key={it}>{it}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="text-[#1d1d1f] font-semibold mb-3">{t.footer.legal}</h3>
            <ul className="space-y-2">
              <li><a href="/privacy" className="hover:underline">{t.footer.legalLinks.privacy}</a></li>
              <li><a href="/terms" className="hover:underline">{t.footer.legalLinks.terms}</a></li>
              <li><a href="/refund" className="hover:underline">{t.footer.legalLinks.refund}</a></li>
              <li>
                <a href={altHref} className="hover:underline font-medium text-[#1d1d1f]" lang={locale === 'en' ? 'ms' : 'en'}>
                  🌐 {t.footer.languageSwitch}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[#d2d2d7]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>{t.footer.tagline}</p>
          <p>{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────
// JSON-LD + HREFLANG
// ─────────────────────────────────────────────────────────────
function useFaqJsonLd(locale: Locale) {
  useEffect(() => {
    const id = 'faq-jsonld-pos-buying-guide';
    document.getElementById(id)?.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: locale === 'ms' ? 'ms-MY' : 'en-MY',
      mainEntity: FAQ_ITEMS[locale].map((it) => ({
        '@type': 'Question',
        name: it.q,
        acceptedAnswer: { '@type': 'Answer', text: it.a },
      })),
    });
    document.head.appendChild(script);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, [locale]);
}

function useProductJsonLd() {
  useEffect(() => {
    const id = 'product-jsonld-pos-buying-guide';
    document.getElementById(id)?.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': MODELS.map((m) => ({
        '@type': 'Product',
        name: m.name,
        description: MODEL_COPY.en[m.id].hook,
        brand: { '@type': 'Brand', name: 'QPOS' },
        offers: {
          '@type': 'Offer',
          price: m.priceFrom,
          priceCurrency: 'MYR',
          availability: 'https://schema.org/InStock',
          url: URL_EN,
        },
      })),
    });
    document.head.appendChild(script);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);
}

function useHreflangAlternates(locale: Locale) {
  useEffect(() => {
    document.documentElement.lang = locale === 'ms' ? 'ms-MY' : 'en-MY';

    const ids = ['hreflang-en', 'hreflang-ms', 'hreflang-x'];
    ids.forEach((id) => document.getElementById(id)?.remove());

    const en = document.createElement('link');
    en.rel = 'alternate';
    en.hreflang = 'en-MY';
    en.href = URL_EN;
    en.id = 'hreflang-en';
    document.head.appendChild(en);

    const ms = document.createElement('link');
    ms.rel = 'alternate';
    ms.hreflang = 'ms-MY';
    ms.href = URL_BM;
    ms.id = 'hreflang-ms';
    document.head.appendChild(ms);

    const x = document.createElement('link');
    x.rel = 'alternate';
    x.hreflang = 'x-default';
    x.href = URL_BASE;
    x.id = 'hreflang-x';
    document.head.appendChild(x);

    return () => {
      ids.forEach((id) => document.getElementById(id)?.remove());
    };
  }, [locale]);
}

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────
export default function PosBuyingGuidePage() {
  const [searchParams] = useSearchParams();
  const langParam = searchParams.get('lang')?.toLowerCase();
  const locale: Locale = langParam === 'bm' || langParam === 'ms' ? 'ms' : 'en';
  const t = T[locale];
  const [result, setResult] = useState<ReturnType<typeof recommendModel> | null>(null);
  const [quizSignal, setQuizSignal] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  useFaqJsonLd(locale);
  useProductJsonLd();
  useHreflangAlternates(locale);

  function handleStartQuiz() {
    setResult(null);
    setQuizSignal((s) => s + 1);
    setTimeout(() => {
      document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  function handleComplete(answers: QuizAnswers) {
    const r = recommendModel(answers, locale);
    setResult(r);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }

  function handleRestart() {
    setResult(null);
    setQuizSignal((s) => s + 1);
    setTimeout(() => {
      document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  return (
    <main
      className="bg-white antialiased min-h-screen pb-16 md:pb-0"
      style={{ color: APPLE_TEXT }}
      lang={locale === 'ms' ? 'ms-MY' : 'en-MY'}
    >
      <style>{`
        @keyframes quiz-fade {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-quiz-fade { animation: quiz-fade 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes lineup-fade {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes warning-pulse {
          0%, 100% { border-color: #dc2626; box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.0); }
          50% { border-color: #ef4444; box-shadow: 0 0 0 6px rgba(220, 38, 38, 0.12); }
        }
        .warning-pulse { animation: warning-pulse 1.4s ease-in-out infinite; }
        @keyframes warning-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .warning-dot { animation: warning-dot 1.4s ease-in-out infinite; }
      `}</style>
      <SEOHead
        title={t.meta.title}
        description={t.meta.description}
        keywords={t.meta.keywords}
        url={locale === 'ms' ? URL_BM : URL_EN}
      />

      <HeroSection t={t} onStartQuiz={handleStartQuiz} />

      {/* Industry diagnosis — problems & data first */}
      <MistakesIntroSection t={t} />
      {PAINS[locale].map((p) => (
        <PainStage key={p.line1} pain={p} />
      ))}
      <FunFactCarousel t={t} locale={locale} />
      <LossMathSection t={t} onStartQuiz={handleStartQuiz} />

      {/* What to look for in a POS (advisory, brand-neutral) */}
      <ThreePromisesSection t={t} locale={locale} />

      {/* Here's our answer — quiz Q1 shows immediately */}
      <QuizSection
        key={quizSignal}
        t={t}
        locale={locale}
        onComplete={handleComplete}
        result={result}
        onRestart={() => {
          setResult(null);
          setQuizSignal((s) => s + 1);
        }}
        resultRef={resultRef}
      />
      <LineupSection t={t} locale={locale} />
      <ComparisonSection t={t} />
      <CarrotSection t={t} />
      <FaqSection t={t} locale={locale} />
      <FinalCtaSection t={t} onRestart={handleRestart} />
      <GuideFooter t={t} locale={locale} />
      <StickyWhatsApp t={t} />
    </main>
  );
}
