import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ArrowRight,
  ChevronRight,
  DoorOpen,
  Image as ImageIcon,
  MessageCircle,
  RotateCcw,
  ScanFace,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';

const WA_NUMBER = '60126909189';
const WA_BASE = `https://wa.me/${WA_NUMBER}`;
const ACCENT = '#CCFF00';

function waLink(text: string): string {
  return `${WA_BASE}?text=${encodeURIComponent(text)}`;
}

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
        transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────────────────────
function MonoEyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] sm:text-[12px] font-mono font-bold uppercase tracking-[0.3em] text-[#CCFF00]">
      {children}
    </span>
  );
}

function LimeButton({
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
  const base = `inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] bg-[#CCFF00] hover:bg-white text-black text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors ${className}`;
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

function GhostButton({
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
  const base = `inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] border border-white/30 hover:border-[#CCFF00] hover:text-[#CCFF00] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors ${className}`;
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

function ImagePlaceholder({
  brief,
  dimensions,
  aspect = 'aspect-[4/3]',
  className = '',
}: {
  brief: string;
  dimensions: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`${brief} (${dimensions})`}
      className={`w-full ${aspect} bg-gradient-to-b from-white/5 to-white/[0.02] border border-dashed border-white/15 flex flex-col items-center justify-center p-5 sm:p-6 text-center ${className}`}
    >
      <ImageIcon size={22} strokeWidth={1.2} className="text-white/30 mb-3" />
      <div className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#CCFF00]/80 mb-2">
        [Image]
      </div>
      <div className="text-[11px] sm:text-xs text-white/50 leading-snug max-w-[36ch] mb-2.5">
        {brief}
      </div>
      <div className="text-[9px] sm:text-[10px] font-mono text-white/30 tracking-wider">
        {dimensions}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MARQUEE STRIPS
// ─────────────────────────────────────────────────────────────
function GymPainMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const items = useMemo(
    () => [
      'Member Chaos',
      'Manual Front Desk',
      'No Upsell',
      'Staff Drift',
      'Tailgating',
      'No 24/7',
    ],
    [],
  );
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let pos = 0;
    let raf = 0;
    const step = () => {
      pos -= 0.5;
      if (Math.abs(pos) >= el.scrollWidth / 2) pos = 0;
      el.style.transform = `translateX(${pos}px)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);
  const repeated = [...items, ...items, ...items, ...items];
  return (
    <div className="overflow-hidden py-5 border-y border-white/10 bg-black">
      <div ref={ref} className="flex whitespace-nowrap will-change-transform">
        {repeated.map((t, i) => (
          <span
            key={i}
            className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white px-3 sm:px-6 md:px-10 shrink-0"
          >
            {t}
            <span className="text-[#CCFF00] ml-3 sm:ml-6 md:ml-10">///</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────
interface Pain {
  num: string;
  eyebrow: string;
  headline: string;
  body: string;
  stat: string;
  statLabel: string;
}

const PAINS: Pain[] = [
  {
    num: '01',
    eyebrow: 'Member Chaos',
    headline: 'Spreadsheets are eating your nights.',
    body: "Renewals due. Payments outstanding. Freeze requests. All living in someone's head — until the day a member churns and you realise it was preventable.",
    stat: '60%',
    statLabel: 'of gym churn is preventable with proper member tracking',
  },
  {
    num: '02',
    eyebrow: 'Hands instead of systems',
    headline: "You're paying for what a system does free.",
    body: 'Front-desk check-ins. Locker assignments. Class sign-ups. Each one a salary line — and every month, the same line item compounds.',
    stat: 'RM5K+/MO',
    statLabel: 'wasted on front-desk roles a system can replace',
  },
  {
    num: '03',
    eyebrow: 'No upsell',
    headline: 'Members buy what you forget to offer.',
    body: 'Towels at the door. PT sessions at check-in. Sauna add-on at booking. If your system doesn’t prompt, your front desk won’t either — and the revenue walks past you.',
    stat: '+22%',
    statLabel: 'revenue lift from automatic upsell prompts at check-in',
  },
  {
    num: '04',
    eyebrow: 'Staff drift',
    headline: 'Check-ins late. Commissions wrong.',
    body: "Trainers clock in by guesswork. Commissions calculated by memory. By month-end, the math doesn't tie back to anything — and disputes eat the manager's week.",
    stat: '1 in 4',
    statLabel: 'staff hours go unmanaged in mid-size gyms',
  },
  {
    num: '05',
    eyebrow: 'Tailgating',
    headline: 'One pays. Two enter.',
    body: 'The biggest silent leak in gyms. Without anti-tailgating, every paid member can wave a friend in through the same door — and you never see the cost on a P&L.',
    stat: '8–12%',
    statLabel: 'revenue lost to tailgating in unguarded gyms',
  },
  {
    num: '06',
    eyebrow: 'No after-hours',
    headline: "You close at 11pm. Your competitor doesn't.",
    body: 'Members want to train at 6am, 11pm, 3am. Without 24/7 access control, you stay manned — or stay closed. Both are expensive.',
    stat: '+30%',
    statLabel: 'revenue from unstaffed late-night hours when 24/7 access is enabled',
  },
];

interface Gate {
  num: string;
  name: string;
  blurb: string;
  bestFor: string;
  priceFrom: number;
  tag?: string;
}

const GATES: Gate[] = [
  {
    num: '01',
    name: 'Face ID Door Lock',
    blurb: 'Smart lock on your existing door. No physical barrier — entry unlocks when Face-ID matches.',
    bestFor: 'Small studios, PT studios, single-room concepts',
    priceFrom: 2000,
  },
  {
    num: '02',
    name: 'Face ID Rotary Tripod',
    blurb: 'Classic 3-arm turnstile. Mechanical, proven, cost-effective. Works with Face-ID controller.',
    bestFor: 'Standard gym entry, budget-conscious operators',
    priceFrom: 5000,
  },
  {
    num: '03',
    name: 'Face ID Space Gate',
    blurb: 'Compact swing barrier for tight lobbies. Single-lane motorised entry, lean footprint.',
    bestFor: 'Mall units, narrow lobbies, boutique studios',
    priceFrom: 6500,
    tag: '📐 SPACE SAVER',
  },
  {
    num: '04',
    name: 'Face ID Simple Swing Gate',
    blurb: 'Standard motorised swing barrier. Clean profile, fast cycle, low maintenance.',
    bestFor: 'Mid-tier gyms, brand-conscious operators',
    priceFrom: 4500,
    tag: '🏆 BEST SELLER',
  },
  {
    num: '05',
    name: 'Premium Swing Gate',
    blurb: 'Glass-paneled premium swing with built-in Face ID. Wheelchair-friendly wide entry, silent motor.',
    bestFor: 'Premium concepts, high-traffic clubs',
    priceFrom: 12000,
  },
  {
    num: '06',
    name: 'Anti-Tailgating Premium',
    blurb: '2-stage gate. Lidar + dual-beam detection auto-blocks the second person through the same scan.',
    bestFor: '24/7 gyms, security-critical sites, premium memberships',
    priceFrom: 18000,
    tag: '🛡️ TOP SECURITY',
  },
];

// ─────────────────────────────────────────────────────────────
// SOFTWARE PRICING TIERS (matches /qstudio/pricing — quoteStudio catalog)
// ─────────────────────────────────────────────────────────────
interface Tier {
  id: string;
  title: string;
  shortName: string;
  subtitle: string;
  monthly: number;
  highlight: string;
  badge?: string;
  recommended?: boolean;
  isCustom?: boolean;
  perks: string[];
}

const TIERS: Tier[] = [
  {
    id: 'starter',
    title: 'Studio Starter',
    shortName: 'Starter',
    subtitle: 'For new studios',
    monthly: 99,
    highlight: 'Launch your studio',
    perks: ['Counter POS', 'Online booking', 'Member CRM', 'Basic reports'],
  },
  {
    id: 'standard',
    title: 'Studio Standard',
    shortName: 'Standard',
    subtitle: 'For growing studios',
    monthly: 299,
    highlight: 'For growing studios',
    perks: ['Everything in Starter', 'Memberships & packages', 'Staff & commissions', 'Auto reports', 'Face-ID ready'],
  },
  {
    id: 'pro',
    title: 'Studio Pro',
    shortName: 'Pro',
    subtitle: 'Most popular',
    monthly: 499,
    highlight: 'Scale with marketing & ticketing',
    badge: 'MOST POPULAR',
    recommended: true,
    perks: ['Everything in Standard', 'Marketing automation', 'Ticketing', 'Webstore', 'Multi-outlet'],
  },
  {
    id: 'advanced',
    title: 'Studio Advanced',
    shortName: 'Advanced',
    subtitle: 'Power users',
    monthly: 699,
    highlight: 'Loyalty, rewards & automation',
    perks: ['Everything in Pro', 'Advanced loyalty', 'Rental & lockers', 'Staff commissions', 'Priority support'],
  },
  {
    id: 'enterprise',
    title: 'Studio Enterprise',
    shortName: 'Enterprise',
    subtitle: 'Custom-built',
    monthly: 0,
    highlight: 'Chains, hotels, wellness groups',
    isCustom: true,
    perks: ['Everything in Advanced', 'Custom modules', 'White-label apps', 'Dedicated success manager', 'SLA'],
  },
];

// ─────────────────────────────────────────────────────────────
// SECTIONS
// ─────────────────────────────────────────────────────────────
function HeroSection({ onScrollGates }: { onScrollGates: () => void }) {
  const heroMsg = `Hi QStudio! I run a gym/studio in Malaysia. I'd like to chat about member management, entry gates with Face-ID, and 24/7 access. Please send me a quick overview.`;

  return (
    <section className="relative bg-black text-white py-20 sm:py-28 lg:py-40 px-4 md:px-6 overflow-hidden border-b border-white/10">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 15% 25%, rgba(204,255,0,0.14) 0%, transparent 55%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage: 'radial-gradient(rgba(204,255,0,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="max-w-6xl mx-auto relative z-10 text-center">
        <Reveal>
          <MonoEyebrow>
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ backgroundColor: ACCENT, boxShadow: `0 0 12px ${ACCENT}` }}
            />
            QStudio Guide · For Gyms
          </MonoEyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-6 text-[44px] sm:text-7xl lg:text-[110px] font-black uppercase tracking-tight leading-[0.92]">
            Run your gym
            <br />
            <span style={{ color: ACCENT }}>like clockwork.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.18}>
          <p className="mt-7 mx-auto max-w-2xl text-base sm:text-lg text-white/70 leading-snug">
            Six silent ways gyms lose money — and the entry gates, Face-ID and 24/7 systems that fix them.
          </p>
        </Reveal>
        <Reveal delay={0.28}>
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <LimeButton href={waLink(heroMsg)}>Chat on WhatsApp</LimeButton>
            <GhostButton onClick={onScrollGates}>
              See entry gates
              <ArrowRight size={14} />
            </GhostButton>
          </div>
        </Reveal>

        <Reveal delay={0.4} y={32}>
          <div className="mt-14 sm:mt-20 max-w-5xl mx-auto">
            <ImagePlaceholder
              brief="Hero — members walking through a QStudio Face-ID gate at gym entrance, lime light bar across the scanner"
              dimensions="1600×900px (16:9), dark studio backdrop"
              aspect="aspect-[16/9]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PainNumberedSection() {
  return (
    <section className="bg-black text-white border-b border-white/10 py-20 sm:py-28 lg:py-32 px-4 md:px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 85% 30%, rgba(204,255,0,0.08) 0%, transparent 55%)',
        }}
      />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal className="text-center mb-12 sm:mb-16">
          <MonoEyebrow>The Diagnosis · 6 Silent Killers</MonoEyebrow>
          <h2 className="mt-5 text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95]">
            Where the
            <br />
            <span style={{ color: ACCENT }}>money leaks.</span>
          </h2>
          <p className="mt-6 mx-auto max-w-2xl text-base text-white/60 leading-relaxed">
            Most owners only see the symptoms. The system below stops the cause.
          </p>
        </Reveal>

        <Reveal delay={0.1} y={32}>
          <div className="max-w-5xl mx-auto mb-14 sm:mb-20">
            <ImagePlaceholder
              brief="Wide shot of a packed gym floor at peak hour — sweaty, busy, energetic. Owner clearly overwhelmed at the front desk."
              dimensions="1600×800px (2:1), grainy/cinematic"
              aspect="aspect-[2/1]"
            />
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/10">
          {PAINS.map((p, i) => (
            <Reveal key={p.num} delay={Math.min(i * 0.04, 0.2)}>
              <div className="bg-black p-7 sm:p-9 h-full flex flex-col group hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[12px] font-mono font-bold text-[#CCFF00]">[{p.num}]</span>
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-white/40">
                    {p.eyebrow}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight leading-[1.02] mb-5">
                  {p.headline}
                </h3>
                <p className="text-sm sm:text-base text-white/60 leading-relaxed mb-6 flex-1">
                  {p.body}
                </p>
                <div className="pt-5 border-t border-white/10">
                  <div className="flex items-baseline gap-3">
                    <span
                      className="text-3xl sm:text-4xl lg:text-5xl font-black tabular-nums leading-none"
                      style={{ color: ACCENT }}
                    >
                      {p.stat}
                    </span>
                    <span className="text-[11px] sm:text-xs text-white/50 leading-snug">
                      {p.statLabel}
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function EntryGatesSection() {
  return (
    <section id="gates" className="bg-black text-white border-b border-white/10 py-20 sm:py-28 lg:py-32 px-4 md:px-6 relative overflow-hidden scroll-mt-20">
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage: 'radial-gradient(rgba(204,255,0,0.05) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal className="text-center mb-14 sm:mb-20">
          <MonoEyebrow>Built for Entry · 6 Options</MonoEyebrow>
          <h2 className="mt-5 text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95]">
            Six gates.
            <br />
            <span style={{ color: ACCENT }}>One unlocks your gym.</span>
          </h2>
          <p className="mt-6 mx-auto max-w-2xl text-base text-white/60 leading-relaxed">
            Every gate ships with Face-ID. Pick the form factor that fits your floor.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
          {GATES.map((gate, i) => {
            const waMsg = `Hi QStudio! I'm interested in the ${gate.name} for my gym. Please send me pricing, install timeline, and a quick demo on WhatsApp.`;
            return (
              <Reveal key={gate.num} delay={Math.min(i * 0.05, 0.25)}>
                <div className="bg-black p-6 sm:p-7 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[12px] font-mono font-bold text-[#CCFF00]">[{gate.num}]</span>
                    {gate.tag && (
                      <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#CCFF00]">
                        {gate.tag}
                      </span>
                    )}
                  </div>
                  <div className="mb-5">
                    <ImagePlaceholder
                      brief={`${gate.name} — product shot on dark background, lime Face-ID reader accent`}
                      dimensions="800×600px"
                      aspect="aspect-[4/3]"
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-2 leading-tight">
                    {gate.name}
                  </h3>
                  <div className="mb-4 flex items-baseline gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/50">
                      From
                    </span>
                    <span
                      className="text-2xl sm:text-3xl font-black tabular-nums leading-none"
                      style={{ color: ACCENT }}
                    >
                      RM{gate.priceFrom.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed mb-5 flex-1">{gate.blurb}</p>
                  <div className="text-[11px] text-white/50 mb-4 leading-snug">
                    <span className="font-mono font-bold uppercase tracking-wider text-white/70">Best for: </span>
                    {gate.bestFor}
                  </div>
                  <div className="flex items-center gap-2 mb-5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#CCFF00]">
                    <ScanFace size={14} strokeWidth={2} />
                    Face-ID Included
                  </div>
                  <a
                    href={waLink(waMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-wider text-[#CCFF00] hover:text-white transition-colors mt-auto py-3 border-t border-white/10"
                  >
                    <span>Get Pricing</span>
                    <ChevronRight size={14} strokeWidth={2.5} />
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SoftwarePricingSection() {
  return (
    <section
      id="pricing"
      className="bg-black text-white border-b border-white/10 py-20 sm:py-28 lg:py-32 px-4 md:px-6 relative overflow-hidden scroll-mt-20"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="max-w-7xl mx-auto relative z-10">
        <Reveal className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
          <MonoEyebrow>Software · 5 Tiers · Pay for what you use</MonoEyebrow>
          <h2 className="mt-5 text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95]">
            Pricing that
            <br />
            <span style={{ color: ACCENT }}>scales with you.</span>
          </h2>
          <p className="mt-6 mx-auto max-w-2xl text-base text-white/60 leading-relaxed">
            Monthly RM, billed annually. 8% SST applies. Upgrade or downgrade any month — no lock-in.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-white/10">
          {TIERS.map((tier, i) => {
            const waMsg = `Hi QStudio! I'm interested in the ${tier.title}${tier.isCustom ? '' : ` plan (RM${tier.monthly}/mo)`} for my gym. Please send me a tailored quote.`;
            return (
              <Reveal key={tier.id} delay={Math.min(i * 0.04, 0.2)}>
                <div
                  className={`relative bg-black p-6 sm:p-7 h-full flex flex-col ${
                    tier.recommended ? '' : ''
                  }`}
                  style={
                    tier.recommended
                      ? { boxShadow: 'inset 0 0 0 2px #CCFF00', backgroundColor: 'rgba(204,255,0,0.04)' }
                      : undefined
                  }
                >
                  {tier.badge && (
                    <div
                      className="absolute -top-px right-0 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider"
                      style={{ backgroundColor: ACCENT, color: '#000' }}
                    >
                      {tier.badge}
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] font-mono font-bold text-[#CCFF00]">
                      [{String(i + 1).padStart(2, '0')}]
                    </span>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-white/40">
                      {tier.subtitle}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight mb-1 leading-tight">
                    {tier.shortName}
                  </h3>
                  <p className="text-[11px] text-white/50 leading-snug mb-5">{tier.highlight}</p>

                  <div className="mb-5 pb-5 border-b border-white/10">
                    {tier.isCustom ? (
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className="text-3xl sm:text-4xl font-black uppercase tabular-nums leading-none"
                          style={{ color: ACCENT }}
                        >
                          Custom
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[11px] text-white/50">RM</span>
                          <span
                            className="text-4xl sm:text-5xl font-black tabular-nums leading-none"
                            style={{ color: ACCENT }}
                          >
                            {tier.monthly}
                          </span>
                          <span className="text-[11px] text-white/50">/mo</span>
                        </div>
                        <div className="mt-2 text-[10px] font-mono uppercase tracking-wider text-white/40">
                          Billed annually · + 8% SST
                        </div>
                      </>
                    )}
                  </div>

                  <ul className="space-y-2 mb-6 flex-1">
                    {tier.perks.map((p) => (
                      <li key={p} className="flex gap-2 text-[12px] text-white/70 leading-snug">
                        <span className="text-[#CCFF00] flex-shrink-0 mt-px">✓</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={waLink(waMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                      tier.recommended
                        ? 'bg-[#CCFF00] hover:bg-white text-black'
                        : 'border border-white/30 hover:border-[#CCFF00] hover:text-[#CCFF00] text-white'
                    }`}
                  >
                    {tier.isCustom ? 'Get Custom Quote' : 'Choose Plan'}
                    <ChevronRight size={12} strokeWidth={2.5} />
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-8 sm:mt-10 text-center text-[11px] font-mono uppercase tracking-[0.25em] text-white/40">
          Each higher tier includes everything below · Upgrade/downgrade any month
        </p>
      </div>
    </section>
  );
}

function TwoTierSecuritySection() {
  const waMsg = `Hi QStudio! I want to enable QR + Face-ID two-tier security on my gym entry gates. Please send me details and pricing.`;

  const benefits: { icon: LucideIcon; title: string; body: string }[] = [
    {
      icon: RotateCcw,
      title: 'QR refreshes every 15 seconds',
      body: 'Too fast to share. Too fast to screenshot. The code in the app dies before a friend can use it.',
    },
    {
      icon: ScanFace,
      title: 'Face confirms the human',
      body: 'After QR scan, face match locks entry to the actual paying member. No swaps. No fakes.',
    },
    {
      icon: ShieldCheck,
      title: 'Every entry logged',
      body: 'Who entered. When. Which gate. Owner sees it live on the dashboard from anywhere.',
    },
  ];

  return (
    <section className="bg-black text-white border-b border-white/10 py-20 sm:py-28 lg:py-32 px-4 md:px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(204,255,0,0.12) 0%, transparent 60%)',
        }}
      />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal className="text-center mb-12 sm:mb-16">
          <MonoEyebrow>
            <Sparkles size={12} strokeWidth={2.4} style={{ color: ACCENT }} />
            Optional Upgrade · 2-Tier Security
          </MonoEyebrow>
          <h2 className="mt-5 text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95]">
            Member QR.
            <br />
            <span style={{ color: ACCENT }}>+ Face.</span>
          </h2>
          <p className="mt-6 mx-auto max-w-2xl text-base text-white/60 leading-relaxed">
            QR refreshes every 15 seconds — too fast to share. Face confirms identity. Together: bulletproof.
          </p>
        </Reveal>

        <Reveal delay={0.1} y={32}>
          <div className="max-w-4xl mx-auto mb-14 sm:mb-20">
            <ImagePlaceholder
              brief="Annotated flow diagram — phone shows QR with live 15s countdown ring → camera scans face → gate unlocks with green status light. 3 frames on dark backdrop."
              dimensions="1400×700px (2:1), dark UI mockup style"
              aspect="aspect-[2/1]"
            />
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 mb-14">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <Reveal key={b.title} delay={i * 0.08}>
                <div className="bg-black p-7 sm:p-9 h-full">
                  <div
                    className="w-12 h-12 border border-[#CCFF00]/30 flex items-center justify-center mb-6"
                    style={{ backgroundColor: 'rgba(204,255,0,0.05)' }}
                  >
                    <Icon size={20} strokeWidth={2} style={{ color: ACCENT }} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight mb-3 leading-tight">
                    {b.title}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed">{b.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2}>
          <div className="flex justify-center">
            <LimeButton href={waLink(waMsg)}>Enable 2-Tier Security</LimeButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CustomisableSection() {
  const waMsg = `Hi QStudio! Here's my gym setup — please tell me which gate fits and how to customise the access rules.`;

  return (
    <section className="bg-black text-white border-b border-white/10 py-16 sm:py-20 lg:py-28 px-4 md:px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <Reveal className="text-center mb-12 sm:mb-14">
          <MonoEyebrow>Configurable Per Gym</MonoEyebrow>
          <h2 className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.95]">
            Your rules.
            <br />
            <span style={{ color: ACCENT }}>Your gym.</span>
          </h2>
          <p className="mt-6 mx-auto max-w-2xl text-base text-white/60 leading-relaxed">
            Different rules for different memberships. Different gates for different hours.
            Off-peak rates, freeze policies, after-hours access — all tuned to your business.
          </p>
        </Reveal>

        <Reveal delay={0.1} y={32}>
          <div className="max-w-4xl mx-auto mb-12">
            <ImagePlaceholder
              brief="QStudio admin — access rule builder UI showing membership tier × time window × gate behavior matrix, with toggle switches and lime status indicators"
              dimensions="1400×900px (14:9), dark dashboard mockup"
              aspect="aspect-[14/9]"
            />
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="flex justify-center">
            <GhostButton href={waLink(waMsg)}>
              Tell Us Your Setup
              <ChevronRight size={14} strokeWidth={2.5} />
            </GhostButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCtaSection() {
  const waMsg = `Hi QStudio! I'd like a 15-minute WhatsApp consult about running my gym with QStudio. Please share available times.`;

  return (
    <section className="bg-black text-white py-24 sm:py-32 lg:py-44 px-4 md:px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(204,255,0,0.18) 0%, transparent 55%)',
        }}
      />
      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <Reveal>
          <MonoEyebrow>Ready When You Are</MonoEyebrow>
          <h2 className="mt-5 text-4xl sm:text-7xl lg:text-[88px] font-black uppercase tracking-tight leading-[0.95]">
            15 minutes.
            <br />
            <span style={{ color: ACCENT }}>Free consult.</span>
          </h2>
          <p className="mt-6 mx-auto max-w-xl text-base sm:text-lg text-white/70 leading-snug">
            Tell us about your gym. We'll show you the gate that fits, the pricing, the install timeline.
            Even if it's the cheapest option.
          </p>
        </Reveal>

        <Reveal delay={0.1} y={32}>
          <div className="mt-12 sm:mt-16 mx-auto max-w-4xl">
            <ImagePlaceholder
              brief="Empty 24/7 gym at 3am — soft uplighting, equipment in shadow, single member training, lime-lit Face-ID gate glowing at the entrance"
              dimensions="1600×600px (8:3), cinematic letterbox"
              aspect="aspect-[8/3]"
            />
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
            <LimeButton href={waLink(waMsg)}>Chat on WhatsApp Now</LimeButton>
          </div>
          <p className="mt-6 text-[11px] font-mono uppercase tracking-[0.25em] text-white/40">
            BM · EN · 中文 · KL · Selangor · Penang
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function GymFooter() {
  return (
    <footer className="bg-black text-white border-t border-white/10 py-10 sm:py-14 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-sm">
          <div>
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#CCFF00] mb-3">
              QStudio
            </h3>
            <p className="text-white/60 leading-relaxed">
              Member management, Face-ID entry, 24/7 access — built for Malaysian gyms.
            </p>
          </div>
          <div>
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#CCFF00] mb-3">
              Talk to us
            </h3>
            <ul className="space-y-2 text-white/60">
              <li>
                <a
                  href={waLink("Hi QStudio! I'd like to learn more for my gym.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#CCFF00] transition-colors"
                >
                  WhatsApp +6012-6909-189
                </a>
              </li>
              <li>BM · EN · 中文</li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#CCFF00] mb-3">
              Built for
            </h3>
            <ul className="space-y-2 text-white/60">
              <li>Gyms &amp; fitness studios</li>
              <li>Yoga &amp; pilates</li>
              <li>24/7 unstaffed access</li>
              <li>Boutique &amp; chain operators</li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#CCFF00] mb-3">
              Explore
            </h3>
            <ul className="space-y-2 text-white/60">
              <li>
                <a href="/qstudio" className="hover:text-[#CCFF00] transition-colors">
                  QStudio Platform
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-[#CCFF00] transition-colors">
                  QBot Home
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-6 border-t border-white/10 text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 text-center">
          © 2026 QStudio · A Qbot product
        </div>
      </div>
    </footer>
  );
}

function StickyWhatsApp() {
  const msg = `Hi QStudio! I'm browsing the gym guide. Please tell me more.`;
  const href = waLink(msg);
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-[#CCFF00] text-black font-bold text-xs uppercase tracking-wider shadow-lg"
        >
          <MessageCircle size={14} />
          WhatsApp Free Consult
        </a>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:inline-flex fixed bottom-6 right-6 z-40 items-center gap-2 px-5 py-3 bg-[#CCFF00] hover:bg-white text-black text-xs font-bold uppercase tracking-wider shadow-xl transition-colors"
      >
        <MessageCircle size={14} />
        WhatsApp Us
      </a>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────
export default function QStudioGuideForGymsPage() {
  const scrollToGates = useMemo(
    () => () => {
      document.getElementById('gates')?.scrollIntoView({ behavior: 'smooth' });
    },
    [],
  );

  return (
    <main className="bg-black text-white antialiased min-h-screen pb-14 md:pb-0">
      <SEOHead
        title="QStudio for Gyms — Member Management + Face-ID Entry | Malaysia"
        description="QStudio is the all-in-one platform for Malaysian gyms — member management, Face-ID entry gates, anti-tailgating, 24/7 access. Six silent ways gyms lose money — and the system that fixes them."
        keywords="gym management malaysia, face id gym, anti-tailgating gym, gym turnstile, 24/7 gym malaysia, gym software, QStudio"
        url="https://qbot.now/qstudio/guide-for-gyms"
      />

      <HeroSection onScrollGates={scrollToGates} />
      <GymPainMarquee />
      <PainNumberedSection />
      <EntryGatesSection />
      <SoftwarePricingSection />
      <TwoTierSecuritySection />
      <CustomisableSection />
      <FinalCtaSection />
      <GymFooter />
      <StickyWhatsApp />

      {/* DoorOpen kept available for future hardware iconography */}
      <span className="hidden" aria-hidden="true">
        <DoorOpen />
      </span>
    </main>
  );
}
