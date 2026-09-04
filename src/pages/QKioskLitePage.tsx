import { useEffect, useRef, useState, type ReactNode } from 'react';
import SEOHead from '../components/SEOHead';
import { trackWhatsAppClick } from '../utils/trackWhatsApp';
import {
  MessageCircle, ArrowRight, ArrowDown, Check, X,
  Tablet, Download, ShoppingBag, QrCode,
  UtensilsCrossed, CreditCard, ChefHat, Hash, BarChart3,
  UserX, Users, Clock,
} from 'lucide-react';

const whatsappUrl = 'https://wa.me/60126909189?text=Hi%20QPOS%2C%20I%27m%20interested%20in%20QKiosk%20Lite%20(RM69%2Fmo).%20Tell%20me%20more!';

// ────────────────────────────────────────────────────────────────
// Reveal on scroll
// ────────────────────────────────────────────────────────────────
function useReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>
      {children}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// HERO
// ────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="min-h-[90vh] flex items-center px-4 md:px-6 pt-24 md:pt-32 pb-12 md:pb-16 relative overflow-hidden bg-white">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* Left — copy */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full mb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-green-700">New from QPos</span>
            <span className="text-[10px] text-green-600">·</span>
            <span className="text-[10px] font-bold text-green-700">Use any tablet you already own</span>
          </div>

          <h1 className="text-[32px] sm:text-[44px] md:text-[56px] font-black uppercase tracking-tighter leading-[0.92] mb-5 text-black">
            Turn any tablet<br />into a<br /><span className="text-green-600">self-order kiosk.</span>
          </h1>

          <p className="text-gray-500 text-[14px] md:text-[16px] leading-relaxed max-w-lg mb-8">
            Less hassle. Quick to start. Use any Android or iPad (RM800–RM1800) and you're live today. No waiting. No installation drama.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick('QKiosk Lite > Hero > WhatsApp')}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-green-600 hover:bg-green-500 text-white text-[12px] font-black uppercase tracking-wider transition-colors">
              <MessageCircle size={16} strokeWidth={2.5} /> Chat on WhatsApp
            </a>
            <a href="#how-it-works" className="inline-flex items-center gap-2 px-6 py-3.5 border-2 border-black/15 hover:border-black text-black text-[12px] font-black uppercase tracking-wider transition-colors">
              See how it works <ArrowDown size={14} strokeWidth={2.5} />
            </a>
          </div>
        </div>

        {/* Right — price card */}
        <div className="relative">
          <div className="bg-black text-white rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/20 rounded-full blur-3xl" />
            <div className="relative">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/50 mb-3">From only</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-[64px] md:text-[84px] font-black leading-none tracking-tighter text-white">RM69</span>
                <span className="text-[16px] text-white/60 font-bold">/ month</span>
              </div>
              <p className="text-[13px] text-white/60 mb-6">Per tablet</p>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/15 border border-green-500/30 rounded-full mb-6">
                <Tablet size={13} className="text-green-400" strokeWidth={2.5} />
                <span className="text-[11px] font-bold text-green-300 uppercase tracking-wider">BYO Tablet · Android or iPad</span>
              </div>

              <div className="pt-6 border-t border-white/10">
                <p className="text-[13px] text-white/70 leading-relaxed">
                  Save <span className="text-white font-bold">thousands</span> vs full kiosk setup <span className="line-through text-white/40">(RM8,000+)</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// PAIN (black)
// ────────────────────────────────────────────────────────────────
const PAINS = [
  {
    n: '01',
    icon: UserX,
    title: "Can't hire cashiers",
    body: "You post ads. Nobody shows up. The one who does quits after 2 weeks. Your counter is understaffed on the busiest days.",
  },
  {
    n: '02',
    icon: Clock,
    title: 'Long queues = lost sales',
    body: "Lunch rush hits. 8 people in line. 3 walk away. That's RM90 gone. Every. Single. Day.",
  },
  {
    n: '03',
    icon: Users,
    title: 'You want to start fast',
    body: "You don't have time to wait weeks for setup, training, installation. You need something running by this weekend — with whatever you already have on hand.",
  },
];

function PainSection() {
  return (
    <section className="bg-black text-white py-20 md:py-32 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-red-400 mb-4">The real problem</p>
          <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95] mb-14 md:mb-20">
            Running F&B<br />in 2026<br />is brutal.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {PAINS.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={i} delay={i * 0.08}>
                <div className="border border-white/10 p-6 md:p-8 rounded-2xl h-full hover:border-white/25 transition-colors">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[11px] font-black text-white/40 tracking-widest">PAIN {p.n}</span>
                    <Icon size={22} strokeWidth={2} className="text-red-400" />
                  </div>
                  <h3 className="text-[20px] md:text-[22px] font-black mb-4 leading-tight">{p.title}</h3>
                  <p className="text-[14px] text-white/60 leading-relaxed">{p.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// HOW IT WORKS
// ────────────────────────────────────────────────────────────────
const STEPS = [
  {
    n: '1',
    icon: Tablet,
    title: 'Grab any tablet',
    body: "Android or iPad you already own — or pick one up for RM800–RM1800. We'll recommend models.",
    tag: 'BYO · Your choice',
  },
  {
    n: '2',
    icon: Download,
    title: 'Install QKiosk Lite',
    body: 'Download the app, log in with your QPos account. Sync menu, pricing, images in minutes.',
    tag: '5 minutes setup',
  },
  {
    n: '3',
    icon: ShoppingBag,
    title: 'Customer self-orders',
    body: 'They browse, customize, confirm their order. Your kitchen gets the ticket instantly.',
    tag: 'Zero staff needed',
  },
  {
    n: '4',
    icon: QrCode,
    title: 'QR to pay, or counter',
    body: 'QR code shows on screen → scan to pay (DuitNow / TnG / card). Or pay cash/card at counter.',
    tag: 'Flexible payment',
  },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 px-4 md:px-6 bg-white scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-green-600 mb-4">How it works</p>
          <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95] mb-4">
            Live in one<br />afternoon.
          </h2>
          <p className="text-gray-500 text-[14px] md:text-[16px] leading-relaxed max-w-2xl mb-14 md:mb-20">
            Grab a tablet, install the app, load your menu. That's it. No technician visits. No waiting list.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={i} delay={i * 0.06}>
                <div className="bg-gray-50 hover:bg-gray-100 transition-colors p-7 md:p-8 rounded-2xl h-full border border-gray-100">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-black text-[18px]">
                      {s.n}
                    </div>
                    <Icon size={22} strokeWidth={2} className="text-green-600" />
                  </div>
                  <h3 className="text-[20px] md:text-[22px] font-black text-black mb-3 leading-tight">Step {s.n} — {s.title}</h3>
                  <p className="text-[14px] text-gray-600 leading-relaxed mb-5">{s.body}</p>
                  <span className="inline-flex items-center px-3 py-1 bg-white border border-gray-200 rounded-full text-[11px] font-bold uppercase tracking-wider text-gray-700">
                    {s.tag}
                  </span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// FEATURES
// ────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: UtensilsCrossed,
    title: 'Full menu, your way',
    body: 'Categories, modifiers, combo sets, add-ons, portion sizes. Exactly like your counter POS.',
  },
  {
    icon: QrCode,
    title: 'QR pay on screen',
    body: 'Customer finishes order → QR appears → they scan with DuitNow, TnG, Maybank, any e-wallet.',
  },
  {
    icon: CreditCard,
    title: 'Or pay at counter',
    body: 'Cash. Credit card. Debit. QR. Whatever your customer wants — they bring the order number to the counter.',
  },
  {
    icon: ChefHat,
    title: 'Auto-sync to kitchen',
    body: "Order lands straight on your QPos KDS or printer. Kitchen cooks. Staff doesn't key anything in.",
  },
  {
    icon: Hash,
    title: 'Queue number printed',
    body: "Customer gets a queue number. You call it when food's ready. Simple. Proven. Works.",
  },
  {
    icon: BarChart3,
    title: 'Sales into QHub',
    body: 'Every kiosk order flows into your QHub dashboard. Track sales, items sold, peak hours — everything.',
  },
];

function FeaturesSection() {
  return (
    <section className="py-20 md:py-32 px-4 md:px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-green-600 mb-4">What's inside</p>
          <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95] mb-4">
            Everything your counter does<br />— without the counter.
          </h2>
          <p className="text-gray-500 text-[14px] md:text-[16px] leading-relaxed max-w-2xl mb-14 md:mb-20">
            QKiosk Lite is a full self-order system. No missing features just because it's entry-level.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={i} delay={(i % 3) * 0.06}>
                <div className="bg-white p-7 rounded-2xl h-full border border-gray-100 hover:border-green-500/40 hover:shadow-lg transition-all">
                  <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center mb-5">
                    <Icon size={20} strokeWidth={2.2} className="text-green-600" />
                  </div>
                  <h3 className="text-[17px] font-black text-black mb-3 leading-tight">{f.title}</h3>
                  <p className="text-[13.5px] text-gray-600 leading-relaxed">{f.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// COST COMPARISON
// ────────────────────────────────────────────────────────────────
function CostSection() {
  const cashierCons = [
    'Takes MC, leave, quits suddenly',
    'Peak hour bottleneck at one counter',
    'Needs training, supervision, rehiring',
    'Ang pao, bonus, raises every year',
  ];
  const kioskPros = [
    'Works every day, no sick leave',
    'Serves 3 customers at once (add more tablets)',
    'Zero training — customers use it themselves',
    'No EPF, SOCSO, bonus, raises',
  ];

  return (
    <section className="py-20 md:py-32 px-4 md:px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-green-600 mb-4">Do the math</p>
          <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95] mb-4">
            RM69/mo vs<br />RM2,500/mo cashier.
          </h2>
          <p className="text-gray-500 text-[14px] md:text-[16px] leading-relaxed max-w-2xl mb-14 md:mb-20">
            A self-order tablet doesn't take MC, doesn't show up late, doesn't quit after 3 weeks. It just works every day for the price of a few nasi lemak.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 items-stretch relative">
          {/* Left — Cashier */}
          <Reveal>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-7 md:p-9 h-full">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-3">Hiring one cashier</p>
              <p className="text-[12px] text-gray-500 mb-2">Monthly cost of labour</p>
              <div className="text-[48px] md:text-[60px] font-black tracking-tighter text-black leading-none mb-2">
                RM 2,500
              </div>
              <p className="text-[12px] text-gray-500 mb-6 italic">Salary only. Before EPF, SOCSO, overtime, training.</p>
              <ul className="space-y-3">
                {cashierCons.map((c, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <X size={16} strokeWidth={2.5} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-[13.5px] text-gray-700 leading-relaxed">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* VS divider */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-black text-white items-center justify-center font-black text-[14px] tracking-tight shadow-xl">
            VS
          </div>

          {/* Right — QKiosk Lite */}
          <Reveal delay={0.08}>
            <div className="bg-black text-white rounded-2xl p-7 md:p-9 h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/20 rounded-full blur-3xl" />
              <div className="relative">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-green-400 mb-3">QKiosk Lite</p>
                <p className="text-[12px] text-white/60 mb-2">Monthly subscription</p>
                <div className="text-[48px] md:text-[60px] font-black tracking-tighter text-white leading-none mb-2">
                  RM 69
                </div>
                <p className="text-[12px] text-white/60 mb-6 italic">Per tablet. Your own hardware (RM800–RM1800 one-off).</p>
                <ul className="space-y-3">
                  {kioskPros.map((c, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check size={16} strokeWidth={2.8} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-[13.5px] text-white/85 leading-relaxed">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Savings banner */}
        <Reveal delay={0.12}>
          <div className="mt-8 md:mt-10 bg-orange-500 text-black rounded-2xl p-6 md:p-8 text-center">
            <p className="text-[18px] md:text-[28px] font-black uppercase tracking-tight leading-tight">
              You save RM 2,431 every month
            </p>
            <p className="text-[13px] md:text-[15px] font-bold mt-2 text-black/75">
              That's RM 29,172 a year
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// FINAL CTA
// ────────────────────────────────────────────────────────────────
function FinalCtaSection() {
  return (
    <section className="py-24 md:py-36 px-4 md:px-6 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-green-500/20 rounded-full blur-[120px]" />
      </div>
      <div className="relative max-w-4xl mx-auto text-center">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-green-400 mb-5">Start today</p>
          <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95] mb-6">
            Your first self-order kiosk<br />at <span className="text-green-400">RM69/mo.</span>
          </h2>
          <p className="text-white/60 text-[14px] md:text-[17px] leading-relaxed max-w-2xl mx-auto mb-10">
            Small setup fee, no long contract lock-in. Chat us on WhatsApp — we'll walk you through tablet picks, menu setup, and have you live this week.
          </p>

          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick('QKiosk Lite > Final CTA > WhatsApp')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-400 text-black text-[13px] font-black uppercase tracking-wider transition-colors rounded-full group">
            <MessageCircle size={17} strokeWidth={2.5} /> WhatsApp us now
            <ArrowRight size={15} strokeWidth={2.8} className="group-hover:translate-x-0.5 transition-transform" />
          </a>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-8">
            {['No long contract', 'Quick setup', 'Cancel anytime', 'Live this week'].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5 text-[12px] font-bold text-white/70 uppercase tracking-wider">
                <Check size={13} strokeWidth={3} className="text-green-400" /> {t}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// PAGE
// ────────────────────────────────────────────────────────────────
export default function QKioskLitePage() {
  return (
    <>
      <SEOHead
        title="QKiosk Lite Malaysia — Self-Order Kiosk on Any Tablet, RM 69/mo"
        description="Turn any Android tablet or iPad into a self-service ordering kiosk for RM 69/month. Bring your own tablet — live this week. Malaysia's most affordable F&B self-order kiosk."
        keywords="QKiosk Lite, cheap self service kiosk Malaysia, tablet kiosk Malaysia, iPad ordering kiosk, Android self order, BYO tablet kiosk, affordable F&B kiosk, self order RM69, cafe kiosk Malaysia, restaurant kiosk subscription"
        url="https://qbot.now/qkiosk-lite"
      />
      <main>
        <HeroSection />
        <PainSection />
        <HowItWorksSection />
        <FeaturesSection />
        <CostSection />
        <FinalCtaSection />
      </main>
    </>
  );
}
