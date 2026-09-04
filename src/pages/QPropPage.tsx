import { useState, useEffect, useRef, type ReactNode } from 'react';
import {
  KeyRound, ScanLine, ShieldCheck, DoorOpen, Building2, Users,
  CalendarCheck, Smartphone, MessageCircle, Bell, ClipboardList,
  CreditCard, FileSignature, ScanFace, Camera, Wallet,
  ArrowRight, Instagram, Sparkles, ChevronRight, Check, Settings2,
  Workflow, ListChecks, Activity, BadgeCheck, RefreshCcw,
  type LucideIcon,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';

const WA = 'https://wa.me/60126909189?text=' + encodeURIComponent("Hi, I'd like to learn about STUDIO for Property & Airbnb.");
const WA_DEMO = 'https://wa.me/60126909189?text=' + encodeURIComponent("Hi, I'd like a STUDIO Property demo at Publika KL.");
const WA_QUOTE = 'https://wa.me/60126909189?text=' + encodeURIComponent(
  "Hi! I'd like a STUDIO Property quote. My setup:\n- Number of units / rooms:\n- Existing door-lock brand (if any):\n- Self check-in kiosk needed: yes / no\n- NRIC chip reader needed: yes / no\n- Approx check-ins per month:\n\nThanks!"
);

const BLUE = '#3B9EFF';

// ────────────────────────────────────────────────────────────────
// UTILITIES
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
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.98)', transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>
      {children}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// HEADER
// ────────────────────────────────────────────────────────────────
const ANNOUNCEMENTS = [
  'Self-service check-in. No front desk needed.',
  'MyKad chip + passport scan built in.',
  'Door PIN issued the moment payment clears.',
];

function PropHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [annIdx, setAnnIdx] = useState(0);
  const [annFade, setAnnFade] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnnFade(false);
      setTimeout(() => { setAnnIdx(p => (p + 1) % ANNOUNCEMENTS.length); setAnnFade(true); }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-[#06101F] text-white hidden lg:block">
        <div className="container mx-auto px-4 md:px-6 lg:px-12 py-1.5 flex items-center justify-between">
          <div className="flex items-center divide-x divide-white/10 text-[11px] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 pr-4 text-white/60">
              <Sparkles size={11} strokeWidth={2.5} style={{ color: BLUE }} />
              STUDIO by QBot · For Property & Airbnb
            </span>
            <span className="px-4 text-white/60">Mon–Fri: 10AM – 7PM</span>
            <span className={`pl-4 transition-opacity duration-300 ${annFade ? 'opacity-100' : 'opacity-0'}`} style={{ color: BLUE }}>
              {ANNOUNCEMENTS[annIdx]}
            </span>
          </div>
          <div className="flex items-center gap-4 divide-x divide-white/10">
            <a href={WA} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors">
              <MessageCircle size={11} strokeWidth={2.5} />
              +6012-6909-189
            </a>
            <a href="/qstudio" className="pl-4 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors" style={{ color: BLUE }}>
              Explore STUDIO <ArrowRight size={11} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </div>

      <nav className={`transition-all duration-300 bg-[#020814]/95 backdrop-blur-xl border-b border-white/10 ${scrolled ? 'shadow-sm' : ''}`}>
        <div className="container mx-auto px-4 md:px-6 lg:px-12 py-3 md:py-4">
          <div className="flex items-center">
            <a href="/qprop" className="flex items-center gap-2 group mr-10">
              <img src="/qbotlogo.svg" alt="STUDIO Logo" className="w-9 h-9 md:w-10 md:h-10 brightness-0 invert" />
              <div className="leading-none">
                <span className="block text-white text-[16px] md:text-[18px] font-black uppercase tracking-[0.15em]">Studio</span>
                <span className="block text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] mt-0.5" style={{ color: BLUE }}>Property · Airbnb</span>
              </div>
            </a>

            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {[
                { label: 'Book Anywhere', href: '#book' },
                { label: 'Self Check-In', href: '#checkin' },
                { label: 'Easy Maintenance', href: '#maintain' },
                { label: 'Door Locks', href: '#doorlock' },
                { label: 'Full List', href: '#all-features' },
                { label: 'Get Quote', href: '#pricing' },
              ].map(item => (
                <a key={item.label} href={item.href} className="text-[12px] font-bold tracking-[0.1em] uppercase text-white hover:opacity-80 transition-opacity">
                  {item.label}
                </a>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-5 ml-auto">
              <a href={WA_DEMO} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-black text-[12px] font-bold uppercase tracking-wider transition-colors hover:bg-white"
                style={{ backgroundColor: BLUE }}>
                <MessageCircle size={14} strokeWidth={2} /> Book Demo <ChevronRight size={14} strokeWidth={2.5} />
              </a>
            </div>

            <div className="lg:hidden flex items-center ml-auto gap-2">
              <a href={WA_DEMO} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-black text-[11px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: BLUE }}>
                <MessageCircle size={12} strokeWidth={2} /> Demo
              </a>
              <button onClick={() => setMobileMenu(p => !p)} className="p-2 text-white">
                {mobileMenu ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
                )}
              </button>
            </div>
          </div>

          {mobileMenu && (
            <div className="lg:hidden border-t border-white/10 py-3 flex flex-col gap-1">
              {[
                { label: 'Book Anywhere', href: '#book' },
                { label: 'Self Check-In', href: '#checkin' },
                { label: 'Easy Maintenance', href: '#maintain' },
                { label: 'Door Locks', href: '#doorlock' },
                { label: 'Compare', href: '#comparison' },
                { label: 'Full List', href: '#all-features' },
                { label: 'Get Quote', href: '#pricing' },
              ].map(item => (
                <a key={item.label} href={item.href} onClick={() => setMobileMenu(false)}
                  className="text-[13px] font-bold uppercase tracking-wider text-white py-2 px-2 transition-colors hover:opacity-80">
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

// ────────────────────────────────────────────────────────────────
// FOOTER
// ────────────────────────────────────────────────────────────────
function PropFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="relative bg-[#020814] text-white border-t border-white/10">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <img src="/qbotlogo.svg" alt="QBot Logo" className="w-12 h-12 brightness-0 invert" />
            </div>
            <p className="text-[13px] font-bold uppercase tracking-wide mb-1.5">STUDIO — For Property & Airbnb</p>
            <p className="text-[13px] text-white/60 leading-relaxed mb-5">Self-service kiosk + door-lock control + tenant CRM. One platform for unattended check-ins, recurring rent, and the paperwork that used to slow you down.</p>
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/qbotmalaysia" target="_blank" rel="noopener noreferrer" className="text-white/50 transition-colors hover:opacity-80" style={{ color: undefined }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
              <a href="https://www.instagram.com/qbotfuture" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:opacity-80 transition-colors"><Instagram size={16} strokeWidth={2} /></a>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: BLUE }}>The 3 Pillars</p>
            <ul className="space-y-1.5">
              {[
                { label: 'Book Anywhere', href: '#book' },
                { label: 'Self-Service Check-In', href: '#checkin' },
                { label: 'Easy Maintenance', href: '#maintain' },
                { label: 'Door-Lock Integration', href: '#doorlock' },
                { label: 'Security & Compliance', href: '#security' },
              ].map(item => (
                <li key={item.label}><a href={item.href} className="text-[13px] text-white/60 hover:text-white transition-colors">{item.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] text-white font-bold uppercase tracking-[0.15em] mb-3">Also by QBot</p>
            <ul className="space-y-1.5 mb-6">
              <li><a href="/" className="text-[13px] text-white/60 hover:text-white transition-colors">QPOS — F&B / Retail</a></li>
              <li><a href="/qstudio" className="text-[13px] text-white/60 hover:text-white transition-colors">STUDIO — Service Businesses</a></li>
              <li><a href="/qfit" className="text-[13px] text-white/60 hover:text-white transition-colors">QFit — Gym & Wellness</a></li>
              <li><a href="/hardware" className="text-[13px] text-white/60 hover:text-white transition-colors">Hardware</a></li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] text-white font-bold uppercase tracking-[0.15em] mb-3">Contact</p>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-white/60"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <div>
                  <p className="text-[13px] text-white/60 leading-snug">B3-6-13 Solaris Dutamas</p>
                  <p className="text-[13px] text-white/60 leading-snug">Jalan Dutamas 1, 50480</p>
                  <p className="text-[12px] text-white/50">Publika KL</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle size={14} className="flex-shrink-0 text-white/60" strokeWidth={2} />
                <a href={WA} target="_blank" rel="noopener noreferrer" className="text-[13px] text-white/60 hover:text-white transition-colors">+6012-6909-189</a>
              </div>
              <p className="text-[11px] text-white/50 pl-[26px]">Mon–Fri: 10AM – 7PM</p>
              <a href={WA} target="_blank" rel="noopener noreferrer"
                className="inline-block text-black text-[11px] font-bold uppercase tracking-wider px-5 py-2.5 transition-colors hover:bg-white"
                style={{ backgroundColor: BLUE }}>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-[12px] text-white/40">
          <p>&copy; {currentYear} QBOT — Part of QBot Product Family</p>
        </div>
      </div>
    </footer>
  );
}

// ────────────────────────────────────────────────────────────────
// HERO PILLAR STRIP
// ────────────────────────────────────────────────────────────────
const PILLARS = [
  { num: '01', title: 'Book Anywhere', href: '#book' },
  { num: '02', title: 'Self Check-In', href: '#checkin' },
  { num: '03', title: 'Easy Maintenance', href: '#maintain' },
];

function HeroPillarStrip() {
  return (
    <div className="w-full max-w-4xl mx-auto mt-10 md:mt-14">
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {PILLARS.map((p, i) => (
          <a key={i} href={p.href}
            className="flex flex-col items-center text-center px-2 md:px-4 py-4 md:py-5 border transition-all duration-200 hover:bg-white/5"
            style={{ borderColor: `${BLUE}40` }}>
            <span className="text-[18px] md:text-[24px] font-mono font-black leading-none mb-1.5" style={{ color: BLUE }}>
              {p.num}
            </span>
            <span className="text-[12px] md:text-[15px] font-black uppercase tracking-tight text-white leading-tight">
              {p.title}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// SCROLLING STRIPS
// ────────────────────────────────────────────────────────────────
const BRUTALIST_ITEMS = ['Self Check-In', 'MyKad Chip Scan', 'Passport Scan', 'Door PIN Issued', 'Face ID Entry', 'Auto-Billing', 'Tenant CRM', 'Cleaning Rota', 'Damage Photos', 'PDPA Compliant'];

function BrutalistStrip() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let pos = 0;
    let raf: number;
    const step = () => { pos -= 0.5; if (Math.abs(pos) >= el.scrollWidth / 2) pos = 0; el.style.transform = `translateX(${pos}px)`; raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);
  const items = [...BRUTALIST_ITEMS, ...BRUTALIST_ITEMS, ...BRUTALIST_ITEMS, ...BRUTALIST_ITEMS];
  return (
    <div className="overflow-hidden">
      <div ref={ref} className="flex whitespace-nowrap will-change-transform">
        {items.map((t, i) => (
          <span key={i} className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white px-3 sm:px-6 md:px-10 shrink-0">
            {t}<span className="ml-3 sm:ml-6 md:ml-10" style={{ color: BLUE }}>///</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// PROBLEMS WE SOLVE
// ────────────────────────────────────────────────────────────────
type Pillar = { Icon: LucideIcon; tag: string; title: string; pain: string; outcome: string; href: string };

const PILLAR_CARDS: Pillar[] = [
  {
    Icon: CalendarCheck,
    tag: 'Pillar 01',
    title: 'Book from anywhere',
    pain: 'Guests message at 1 AM. You\'re asleep. They book elsewhere.',
    outcome: 'A kiosk that takes the booking, the payment, and the deposit on the spot — without you lifting a finger.',
    href: '#book',
  },
  {
    Icon: KeyRound,
    tag: 'Pillar 02',
    title: 'Self-service check-in, secured',
    pain: 'Late arrivals. Lost keys. Wrong guests with the same name.',
    outcome: 'MyKad chip scan or passport scan, digital waiver, 4-digit PIN issued, door unlocks. No staff on site needed.',
    href: '#checkin',
  },
  {
    Icon: Workflow,
    tag: 'Pillar 03',
    title: 'Easy to run, day after day',
    pain: 'Three spreadsheets, two messaging apps, a clipboard for cleaners.',
    outcome: 'One console: rooms, tenants, bookings, payments, cleaning rota, alerts. Built so the work runs itself.',
    href: '#maintain',
  },
];

function ProblemsSection() {
  return (
    <section className="py-16 md:py-28 px-4 md:px-6 border-t border-white/10 bg-[#020814] text-white">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-[12px] md:text-[13px] font-mono font-bold uppercase tracking-[0.35em] mb-4" style={{ color: BLUE }}>What it actually solves</p>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-5 leading-[0.95]">
            Three problems.<br className="hidden sm:block" /> One platform that handles all three.
          </h2>
          <p className="text-white/75 text-[15px] md:text-[17px] leading-relaxed mb-10 md:mb-14 max-w-2xl">
            STUDIO for Property isn't a feature list. It's the unattended front-desk you've been hiring people to do — designed so a guest can book, verify ID, sign, pay, and walk through your door without you being there.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {PILLAR_CARDS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <a href={p.href} className="block border-2 p-6 md:p-7 h-full transition-colors group" style={{ borderColor: `${BLUE}30`, backgroundColor: `${BLUE}08` }}>
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 border-2 flex items-center justify-center" style={{ borderColor: BLUE, backgroundColor: `${BLUE}15` }}>
                    <p.Icon size={22} strokeWidth={2} style={{ color: BLUE }} />
                  </div>
                  <span className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-wider" style={{ color: BLUE }}>{p.tag}</span>
                </div>
                <p className="text-white text-[18px] md:text-[22px] font-black uppercase tracking-tight leading-tight mb-4">{p.title}</p>
                <p className="text-white/55 text-[14px] md:text-[15px] leading-relaxed mb-3 italic">{p.pain}</p>
                <p className="text-white text-[15px] md:text-[16px] leading-relaxed">{p.outcome}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider group-hover:gap-3 transition-all" style={{ color: BLUE }}>
                  See how <ArrowRight size={14} strokeWidth={2.5} />
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// PILLAR 1 — BOOK ANYWHERE
// ────────────────────────────────────────────────────────────────
const BOOK_BLOCKS = [
  {
    Icon: Smartphone,
    title: 'Online booking that closes itself',
    body: 'Guest picks a room type from your catalog — photos, description, monthly price. They pick a duration (1 / 2 / 3 / 6 / 12 months), and the discount tier (5% / 10% / 15%) applies automatically. No back-and-forth.',
  },
  {
    Icon: Building2,
    title: 'Catalog they trust before booking',
    body: 'Your room types live in one place, with the photos and descriptions you control. Pricing is visible across every duration, with the markdown clearly shown. Guests stop asking, start booking.',
  },
  {
    Icon: Wallet,
    title: 'Three ways to pay — they pick',
    body: 'Lumpsum card payment. Monthly recurring card. Or in-app wallet. Whatever fits the guest fits the booking.',
  },
  {
    Icon: ScanFace,
    title: 'Contact captured, ID verified',
    body: 'Phone and email validated at booking. MyKad chip scan for locals, passport or manual entry for foreigners — both supported. The booking and the identity are tied together from minute one.',
  },
];

function BookAnywhereSection() {
  return (
    <section id="book" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at 80% 30%, ${BLUE}20 0%, transparent 50%)` }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal>
          <div className="flex items-baseline gap-3 mb-5">
            <span className="font-mono font-black text-[18px] md:text-[22px]" style={{ color: BLUE }}>01</span>
            <p className="text-[12px] md:text-[13px] font-mono font-bold uppercase tracking-[0.35em]" style={{ color: BLUE }}>Book Anywhere</p>
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-5 leading-[0.95]">
            The booking happens<br className="hidden sm:block" /> while you sleep.
          </h2>
          <p className="text-white/75 text-[15px] md:text-[17px] leading-relaxed mb-10 md:mb-14 max-w-2xl">
            One self-service flow on the kiosk — and the same flow available online. Room catalog, flexible duration, auto-discount, contact capture, ID verified, payment locked in. Booking number issued on the spot.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {BOOK_BLOCKS.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.05}>
              <div className="border-2 p-6 md:p-7 h-full" style={{ borderColor: 'rgba(255,255,255,0.10)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 md:w-12 md:h-12 border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: BLUE, backgroundColor: `${BLUE}12` }}>
                    <b.Icon size={20} strokeWidth={2} style={{ color: BLUE }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-[17px] md:text-[19px] font-black uppercase tracking-tight leading-tight mb-2.5">{b.title}</p>
                    <p className="text-white/70 text-[14px] md:text-[15px] leading-relaxed">{b.body}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-6 md:mt-8 border p-5 md:p-6" style={{ borderColor: `${BLUE}40`, backgroundColor: `${BLUE}08` }}>
            <p className="text-[12px] font-mono font-bold uppercase tracking-[0.2em] mb-2" style={{ color: BLUE }}>Same Flow · Returning Guests</p>
            <p className="text-white text-[15px] md:text-[16px] leading-relaxed">
              For repeat tenants, the kiosk has a separate <span className="font-bold">returning check-in</span> mode — lookup by booking number (e.g. <span className="font-mono">PRO-XXXX</span>), NRIC re-verified against the original booking, waiver re-acknowledged, door PIN re-issued. Handles "already checked in" and "checked out" gracefully.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// PILLAR 2 — SELF-SERVICE CHECK-IN (THE 9 STEPS)
// ────────────────────────────────────────────────────────────────
type CheckinStep = { num: string; title: string; body: string; Icon: LucideIcon };

const CHECKIN_STEPS: CheckinStep[] = [
  { num: '01', title: 'Pick the room type',         body: 'Photos, description, monthly rate. All from your catalog.',                                   Icon: Building2 },
  { num: '02', title: 'Pick how long they\'ll stay', body: '1 / 2 / 3 / 6 / 12 months. Discounts (5% / 10% / 15%) applied automatically by duration.',  Icon: CalendarCheck },
  { num: '03', title: 'Capture contact',             body: 'Phone and email validated on the spot — so the PIN and confirmations land in the right place.', Icon: Smartphone },
  { num: '04', title: 'MyKad chip scan',             body: 'Locals tap their NRIC on the chip reader. Full name, IC, gender, DOB, nationality, and photo auto-fill. No typing.', Icon: ScanLine },
  { num: '05', title: 'Passport / manual fallback',  body: 'Foreign guests scan a passport or enter details manually. QVerify supports both paths.',     Icon: Camera },
  { num: '06', title: 'Pay the way they prefer',     body: 'Lumpsum card · monthly recurring card · in-app wallet. Their pick, locked at booking.',     Icon: CreditCard },
  { num: '07', title: 'Sign the digital waiver',     body: 'On-screen signature pad. Touchscreen-ready. Stored against the booking.',                    Icon: FileSignature },
  { num: '08', title: 'Booking number + 4-digit PIN', body: 'Issued instantly on screen. PIN also sent to phone (SMS-ready).',                          Icon: BadgeCheck },
  { num: '09', title: 'Door unlocks',                body: 'Activation pushed straight to your configured door lock.', Icon: DoorOpen },
];

function CheckInSection() {
  return (
    <section id="checkin" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-[#020814] text-white scroll-mt-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-60" style={{ backgroundImage: `radial-gradient(${BLUE}10 1px, transparent 1px)`, backgroundSize: '28px 28px' }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal>
          <div className="flex items-baseline gap-3 mb-5">
            <span className="font-mono font-black text-[18px] md:text-[22px]" style={{ color: BLUE }}>02</span>
            <p className="text-[12px] md:text-[13px] font-mono font-bold uppercase tracking-[0.35em]" style={{ color: BLUE }}>Self-Service Check-In</p>
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-5 leading-[0.95]">
            Nine taps from arrival<br className="hidden sm:block" /> to door unlocked.
          </h2>
          <p className="text-white/75 text-[15px] md:text-[17px] leading-relaxed mb-10 md:mb-14 max-w-2xl">
            One linear flow on the kiosk. No staff stands by, no clipboard, no waiting for the manager to drive in. The whole thing is built to verify identity properly — chip-read NRIC, passport scan, signature, and PIN — before any door opens.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {CHECKIN_STEPS.map((s, i) => (
            <Reveal key={s.num} delay={Math.min(i * 0.04, 0.32)}>
              <div className="border h-full p-5 md:p-6 relative" style={{ borderColor: 'rgba(255,255,255,0.10)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-mono font-black text-[20px] md:text-[24px]" style={{ color: BLUE }}>{s.num}</span>
                  <s.Icon size={18} strokeWidth={2} style={{ color: BLUE }} className="opacity-70" />
                </div>
                <p className="text-white text-[16px] md:text-[17px] font-black uppercase tracking-tight leading-tight mb-2">{s.title}</p>
                <p className="text-white/65 text-[14px] md:text-[15px] leading-relaxed">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-8 md:mt-10 border-2 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5 md:gap-8" style={{ borderColor: BLUE, backgroundColor: `${BLUE}10` }}>
            <ShieldCheck size={40} strokeWidth={2} style={{ color: BLUE }} className="flex-shrink-0" />
            <div>
              <p className="text-white text-[16px] md:text-[18px] font-black uppercase tracking-tight leading-tight mb-2">Anti-fraud, by design</p>
              <p className="text-white/80 text-[14px] md:text-[15px] leading-relaxed">
                Returning guests must re-scan the same NRIC the booking was made under. Mismatches are flagged — not auto-allowed. Combined with the digital waiver and PIN, every door open ties back to a verified identity.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// PILLAR 3 — EASY MAINTENANCE
// ────────────────────────────────────────────────────────────────
type MaintBlock = { Icon: LucideIcon; title: string; body: string; tags: string[] };

const MAINT_BLOCKS: MaintBlock[] = [
  {
    Icon: Activity,
    title: 'Property Dashboard',
    body: 'In-house count, pending check-ins, available rooms, live occupancy %. Open the console — know where you stand in five seconds.',
    tags: ['In-house', 'Pending', 'Available', 'Occupancy %'],
  },
  {
    Icon: ListChecks,
    title: 'Check-In / Check-Out Console',
    body: 'Searchable booking ledger, filter by Pending / In House / Departed. Manual check-in or check-out buttons when you need to override. Door PIN visible to authorised staff.',
    tags: ['Searchable', 'Filterable', 'Manual override', 'PIN visible'],
  },
  {
    Icon: Building2,
    title: 'Rooms Inventory',
    body: 'Grid view by floor. Filter by status — available, occupied, reserved, maintenance — and by room type. The whole property at a glance.',
    tags: ['By floor', 'By status', 'By type'],
  },
  {
    Icon: Users,
    title: 'Tenant Directory',
    body: 'Search by name, NRIC, or phone. Booking count per tenant. Profile, photo, stay history, notes — the tenant CRM you can actually use.',
    tags: ['Search', 'Stay history', 'Notes', 'Photo'],
  },
  {
    Icon: Settings2,
    title: 'Property Settings — 5 tabs',
    body: 'General (name, address, timezone, default check-in/out times). Room Types. Pricing matrix (RM totals across all durations, discount markers). Self Check-In toggles (NRIC requirement, waiver requirement, kiosk URL). Door-Lock integration.',
    tags: ['General', 'Room Types', 'Pricing', 'Self-Check-In', 'Door-Lock'],
  },
  {
    Icon: RefreshCcw,
    title: 'Auto-billing & agreements',
    body: 'Monthly rent auto-charged via Stripe recurring. Tenancy agreements e-signed, version-controlled. Late-payment alerts pinged to the team.',
    tags: ['Stripe recurring', 'e-Sign', 'Late alerts'],
  },
  {
    Icon: Workflow,
    title: 'Automations & notifications',
    body: 'Pre-arrival email, day-of welcome SMS, mid-stay survey, check-out reminder, post-stay review request. Templates for WhatsApp, Telegram, SMS — PIN delivery, dunning, reminders.',
    tags: ['Pre-arrival', 'Welcome', 'Mid-stay', 'Check-out', 'Post-stay'],
  },
  {
    Icon: Bell,
    title: 'Alert Engine',
    body: 'Overdue check-out. Payment failed. ID-mismatch flag. Sent to staff where they already chat — not buried in a dashboard.',
    tags: ['Overdue', 'Payment fail', 'ID mismatch'],
  },
];

function MaintenanceSection() {
  return (
    <section id="maintain" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at 15% 70%, ${BLUE}18 0%, transparent 55%)` }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal>
          <div className="flex items-baseline gap-3 mb-5">
            <span className="font-mono font-black text-[18px] md:text-[22px]" style={{ color: BLUE }}>03</span>
            <p className="text-[12px] md:text-[13px] font-mono font-bold uppercase tracking-[0.35em]" style={{ color: BLUE }}>Easy Maintenance</p>
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-5 leading-[0.95]">
            The console that<br className="hidden sm:block" /> runs the property for you.
          </h2>
          <p className="text-white/75 text-[15px] md:text-[17px] leading-relaxed mb-10 md:mb-14 max-w-2xl">
            Property manager console mounted under your slug. Every screen is one click — the dashboard, the room grid, the tenant directory, the settings. Automations push the routine messages so you don't have to.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {MAINT_BLOCKS.map((b, i) => (
            <Reveal key={b.title} delay={Math.min(i * 0.04, 0.28)}>
              <div className="border-2 p-6 md:p-7 h-full" style={{ borderColor: 'rgba(255,255,255,0.10)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-11 h-11 border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: BLUE, backgroundColor: `${BLUE}12` }}>
                    <b.Icon size={20} strokeWidth={2} style={{ color: BLUE }} />
                  </div>
                  <p className="text-white text-[17px] md:text-[19px] font-black uppercase tracking-tight leading-tight pt-1">{b.title}</p>
                </div>
                <p className="text-white/70 text-[14px] md:text-[15px] leading-relaxed mb-4">{b.body}</p>
                <div className="flex flex-wrap gap-1.5">
                  {b.tags.map((t, j) => (
                    <span key={j} className="inline-block border text-[11px] md:text-[12px] px-2.5 py-1 leading-snug text-white/80" style={{ borderColor: `${BLUE}30`, backgroundColor: `${BLUE}08` }}>{t}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// SECURITY & COMPLIANCE
// ────────────────────────────────────────────────────────────────
const SECURITY_BLOCKS = [
  {
    Icon: ScanLine,
    title: 'QVerify — Identity verification',
    body: 'MyKad chip-reader integration in capture mode (persists for property records). Age-check mode (verify-and-discard) available for any 18+ services. Passport and manual entry for non-Malaysians. Manager-PIN override for the genuine edge cases.',
  },
  {
    Icon: ScanFace,
    title: 'Face ID — Biometric recognition',
    body: 'One-time face enrollment for tenants at booking. On-device matching on the kiosk hardware — privacy-preserving. Confidence-scored check-in logs. Same enrollment works across property, studio, and POS.',
  },
  {
    Icon: DoorOpen,
    title: 'Access — Physical entry control',
    body: 'Sunmi Face ID terminals + turnstile pairing. Per-device live state (online / offline / lockdown / hold-open). Manual open / hold / close / lockdown with reason audit. Override-and-admit for twins, glasses, appearance changes.',
  },
  {
    Icon: ShieldCheck,
    title: 'Anti-passback, time-windows, guest passes',
    body: 'Anti-passback cooldown stops re-entry within X minutes. Time-window rules for after-hours (deny / allow / allow-with-alert). Guest passes — 8-char single-use codes, default 4hr validity, revocable.',
  },
  {
    Icon: ClipboardList,
    title: 'PDPA-compliant audit & erasure',
    body: 'Per-merchant encryption. Crypto-shred offboarding. Append-only audit log retained 7 years. PDPA biometric consent capture + erasure workflow on an hourly job. Built for the PDPA Amendment Act 2024.',
  },
  {
    Icon: Activity,
    title: 'Live activity feed + simulator',
    body: 'Live activity feed with entries-today and denials-today counters. Simulator mode so you can demo to clients before the hardware lands.',
  },
];

function SecuritySection() {
  return (
    <section id="security" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-[#020814] text-white scroll-mt-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-50" style={{ backgroundImage: `linear-gradient(${BLUE}08 1px, transparent 1px), linear-gradient(90deg, ${BLUE}08 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal>
          <p className="text-[12px] md:text-[13px] font-mono font-bold uppercase tracking-[0.35em] mb-4" style={{ color: BLUE }}>Security & Compliance</p>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-5 leading-[0.95]">
            Built so an unattended door<br className="hidden sm:block" /> is still a safe door.
          </h2>
          <p className="text-white/75 text-[15px] md:text-[17px] leading-relaxed mb-10 md:mb-14 max-w-2xl">
            Identity verification, face recognition, access control, and PDPA-compliant audit trails — designed to work together. Every door open ties back to a verified person, a signed waiver, and a logged event.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {SECURITY_BLOCKS.map((b, i) => (
            <Reveal key={b.title} delay={Math.min(i * 0.05, 0.3)}>
              <div className="border-2 p-6 md:p-7 h-full" style={{ borderColor: 'rgba(255,255,255,0.10)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <div className="w-11 h-11 border-2 flex items-center justify-center mb-4" style={{ borderColor: BLUE, backgroundColor: `${BLUE}12` }}>
                  <b.Icon size={20} strokeWidth={2} style={{ color: BLUE }} />
                </div>
                <p className="text-white text-[16px] md:text-[18px] font-black uppercase tracking-tight leading-tight mb-3">{b.title}</p>
                <p className="text-white/70 text-[14px] md:text-[15px] leading-relaxed">{b.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// DOOR-LOCK INTEGRATION
// ────────────────────────────────────────────────────────────────
function DoorLockSection() {
  return (
    <section id="doorlock" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 0%, ${BLUE}18 0%, transparent 60%)` }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal>
          <p className="text-[12px] md:text-[13px] font-mono font-bold uppercase tracking-[0.35em] mb-4" style={{ color: BLUE }}>Door-Lock Integration</p>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-5 leading-[0.95]">
            Payment clears.<br className="hidden sm:block" /> The door is ready.
          </h2>
          <p className="text-white/75 text-[15px] md:text-[17px] leading-relaxed mb-10 md:mb-14 max-w-2xl">
            STUDIO talks to the door lock directly. Pick your provider, paste the API key, decide how long the PIN lives — done. No second tool, no manual sync.
          </p>
        </Reveal>

        <Reveal>
          <div className="border p-6 md:p-8" style={{ borderColor: `${BLUE}40`, backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.2em] mb-3" style={{ color: BLUE }}>PIN Lifetime · Your Rule</p>
            <p className="text-white text-[15px] md:text-[17px] leading-relaxed mb-5">
              Decide what each PIN is good for. Configurable per property under the Door-Lock settings tab:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Match-booking', body: 'Active for the duration of the booking' },
                { label: '24 hours', body: 'Rolling 24-hour window' },
                { label: '7 days', body: 'Rolling weekly window' },
                { label: 'Manual revoke', body: 'Stays live until you revoke it' },
              ].map(o => (
                <div key={o.label} className="border p-4" style={{ borderColor: 'rgba(255,255,255,0.10)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  <p className="text-white text-[14px] md:text-[15px] font-black uppercase tracking-tight mb-1.5">{o.label}</p>
                  <p className="text-white/65 text-[12px] md:text-[13px] leading-snug">{o.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// BUNDLED-IN MODULES (REUSED FROM STUDIO)
// ────────────────────────────────────────────────────────────────
type BundleItem = { title: string; body: string };
type BundleCategory = { name: string; items: BundleItem[] };

const BUNDLES: BundleCategory[] = [
  {
    name: 'Bookings & Front-Desk Backup',
    items: [
      { title: 'Front-desk Check-In Console',     body: 'Fast manual check-in when a guest can\'t use the kiosk. The fallback you keep on the shelf.' },
      { title: 'Booking Console (Calendar)',      body: 'Calendar view of arrivals, departures, and overlaps — so collisions never reach the door.' },
      { title: 'Universal Booking — Rooms',       body: 'Rooms treated as bookable resources. Same engine that powers the rest of the platform.' },
      { title: 'Waitlist',                         body: 'Sold-out date with someone interested? Auto-notify when a room frees up.' },
      { title: 'Family / Group Bookings',         body: 'One reservation across multiple rooms — for families and travelling groups.' },
    ],
  },
  {
    name: 'Tenants & CRM',
    items: [
      { title: 'Members ↔ Tenants',               body: 'Tenant profile, photo, stay history, notes. The directory you actually use.' },
      { title: 'Leads Pipeline',                   body: 'Inquiry → tour-booked → deposit-paid → moved-in. Track the funnel, close the deals.' },
      { title: 'Custom Fields',                    body: 'Capture vehicle plate, pet info, dietary, emergency contact. Whatever your property needs.' },
    ],
  },
  {
    name: 'Money & Agreements',
    items: [
      { title: 'Auto-Billing (Stripe recurring)',  body: 'Monthly rent auto-charged on schedule. No chasing.' },
      { title: 'Agreements',                       body: 'Tenancy contracts with e-signature, version-controlled.' },
      { title: 'POS — Sell add-ons at check-in',   body: 'Laundry, breakfast, parking, mini-bar — billed against the same booking.' },
      { title: 'Rewards & Vouchers',               body: 'Repeat-guest loyalty, referral codes, off-peak discounts.' },
      { title: 'Staff Commissions',                body: 'Pay agents or referrers for confirmed bookings.' },
    ],
  },
  {
    name: 'Day-to-Day Ops',
    items: [
      { title: 'Schedule — Housekeeping Rota',     body: 'Cleaning and maintenance windows planned and visible.' },
      { title: 'Walk-In Queue',                    body: 'Same-day arrivals routed round-robin to available units.' },
      { title: 'Automations',                       body: 'Pre-arrival, welcome, mid-stay survey, check-out reminder, post-stay review — all on triggers.' },
      { title: 'Notifications',                     body: 'WhatsApp / Telegram / SMS templates for PINs, reminders, dunning.' },
      { title: 'Alert Engine',                      body: 'Overdue check-out, payment failed, ID-mismatch — pinged to the staff chat.' },
    ],
  },
  {
    name: 'Records & Insight',
    items: [
      { title: 'Reports',                          body: 'Occupancy %, ADR, RevPAR-style breakdowns, cohort retention.' },
      { title: 'AI Insights',                      body: 'Narrative summaries — "Why occupancy dropped last week."' },
      { title: 'Before / After Gallery',           body: 'Photos at check-in and check-out — damage protection evidence on file.' },
      { title: 'Signature Canvas',                 body: 'Waiver and damage-acknowledgement signing on tablet.' },
    ],
  },
];

function BundlesSection() {
  return (
    <section className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-[#020814] text-white">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-[12px] md:text-[13px] font-mono font-bold uppercase tracking-[0.35em] mb-4" style={{ color: BLUE }}>What's bundled in</p>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-5 leading-[0.95]">
            The tools most hosts pay<br className="hidden sm:block" /> three SaaS bills for.
          </h2>
          <p className="text-white/75 text-[15px] md:text-[17px] leading-relaxed mb-10 md:mb-14 max-w-3xl">
            STUDIO for Property runs on the same engine that powers STUDIO and QFit. The modules below are already built — they only need to be configured for your property.
          </p>
        </Reveal>

        <div className="space-y-10 md:space-y-12">
          {BUNDLES.map((cat, i) => (
            <Reveal key={cat.name} delay={i * 0.04}>
              <div>
                <div className="flex items-baseline gap-3 mb-5 md:mb-6">
                  <span className="font-mono font-black text-[16px] md:text-[18px]" style={{ color: BLUE }}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="text-white text-[18px] md:text-[22px] font-black uppercase tracking-tight">{cat.name}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {cat.items.map(it => (
                    <div key={it.title} className="border p-5" style={{ borderColor: 'rgba(255,255,255,0.10)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                      <div className="flex items-start gap-2 mb-2">
                        <Check size={14} strokeWidth={3} className="flex-shrink-0 mt-1" style={{ color: BLUE }} />
                        <p className="text-white text-[14px] md:text-[15px] font-black uppercase tracking-tight leading-tight">{it.title}</p>
                      </div>
                      <p className="text-white/65 text-[13px] md:text-[14px] leading-relaxed pl-[22px]">{it.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// COMPARISON
// ────────────────────────────────────────────────────────────────
const COMPARISON_ROWS = [
  { label: 'Unattended check-in',     them: 'Front-desk staff, or a lockbox you trust',         us: 'Kiosk flow: ID, signature, payment, PIN, door — done' },
  { label: 'Identity verification',   them: 'Photo of an ID, eyeballed later',                  us: 'MyKad chip read or passport scan, tied to booking' },
  { label: 'Door access',             them: 'Hand over a key or share a static code',           us: 'PIN issued on the spot, lifetime configurable, revocable' },
  { label: 'Returning guests',        them: 'Manual checks every time',                          us: 'NRIC re-verified against original booking — fraud flagged' },
  { label: 'Recurring rent',          them: 'Invoice chase, late-payment headaches',             us: 'Stripe recurring + late-payment alerts on the staff chat' },
  { label: 'Cleaning / maintenance',  them: 'WhatsApp group + spreadsheet',                       us: 'Schedule + alerts inside the same console' },
  { label: 'Compliance (PDPA)',       them: 'Hope for the best',                                  us: 'Encryption, audit log retained 7 years, erasure workflow' },
  { label: 'Tools needed',            them: '3–4 separate SaaS subscriptions',                    us: 'One platform, one bill, one support number' },
];

function ComparisonSection() {
  return (
    <section id="comparison" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-100" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="max-w-4xl mx-auto relative z-10">
        <Reveal>
          <p className="text-[12px] md:text-[13px] font-mono font-bold uppercase tracking-[0.25em] mb-4" style={{ color: BLUE }}>Honest Comparison</p>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-5 leading-tight">
            The way most hosts do it<br className="hidden sm:block" /> vs STUDIO for Property
          </h2>
          <p className="text-white/75 text-[15px] md:text-[17px] leading-relaxed mb-10 md:mb-14 max-w-2xl">
            We're not pretending there are no other ways. We're saying: this is what each row costs in time, money, and risk — and where STUDIO lands.
          </p>
        </Reveal>

        <div className="space-y-3 md:space-y-0 md:border md:border-white/10">
          <div className="hidden md:grid grid-cols-[1fr_1fr_1fr] border-b border-white/10">
            <div className="p-5" />
            <div className="p-5 border-l border-white/10 text-center">
              <span className="text-[12px] font-mono font-bold text-white uppercase tracking-wider">The usual way</span>
            </div>
            <div className="p-5 border-l text-center" style={{ borderColor: `${BLUE}40`, backgroundColor: `${BLUE}10` }}>
              <span className="text-[12px] font-mono font-bold uppercase tracking-wider" style={{ color: BLUE }}>STUDIO</span>
            </div>
          </div>

          {COMPARISON_ROWS.map((row, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div className="md:hidden border border-white/10 p-4">
                <p className="text-[14px] font-bold text-white uppercase tracking-wide mb-3">{row.label}</p>
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-white/50 text-[12px] font-bold uppercase shrink-0 mt-0.5">Usual:</span>
                  <span className="text-white text-[14px] leading-snug">{row.them}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[12px] font-bold uppercase shrink-0 mt-0.5" style={{ color: BLUE }}>STUDIO:</span>
                  <span className="text-[14px] leading-snug font-medium" style={{ color: BLUE }}>{row.us}</span>
                </div>
              </div>
              <div className={`hidden md:grid grid-cols-[1fr_1fr_1fr] ${i % 2 === 0 ? 'bg-white/[0.03]' : ''} border-b border-white/5 last:border-b-0`}>
                <div className="p-5 flex items-center">
                  <span className="text-[14px] font-bold text-white uppercase tracking-wide leading-snug">{row.label}</span>
                </div>
                <div className="p-5 border-l border-white/10 flex items-center">
                  <span className="text-[14px] text-white leading-relaxed">{row.them}</span>
                </div>
                <div className="p-5 border-l flex items-center" style={{ borderColor: `${BLUE}20`, backgroundColor: `${BLUE}08` }}>
                  <span className="text-[14px] leading-relaxed font-medium" style={{ color: BLUE }}>{row.us}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// FULL FEATURES LIST (strictly from spec)
// ────────────────────────────────────────────────────────────────
type FeatureRow = { name: string; detail: string };
type FeatureCategory = { name: string; rows: FeatureRow[] };

const FEATURES_LIST: FeatureCategory[] = [
  {
    name: '1. Self-Service Kiosk — Book Now',
    rows: [
      { name: 'Room type catalog',          detail: 'Photos, descriptions, RM/month pricing.' },
      { name: 'Flexible duration',          detail: '1 / 2 / 3 / 6 / 12 months with auto-discount tiers (5% / 10% / 15%).' },
      { name: 'Contact capture',            detail: 'Phone + email validation.' },
      { name: 'MyKad NRIC chip scan',       detail: 'Auto-fills full name, IC, gender, DOB, nationality, photo.' },
      { name: 'Passport / manual fallback', detail: 'For foreigners. QVerify supports both.' },
      { name: 'Payment options',            detail: 'Lumpsum card · monthly recurring card · wallet.' },
      { name: 'Digital waiver',             detail: 'On-screen signature pad (touchscreen).' },
      { name: 'Booking number + door PIN',  detail: 'Auto-generated booking number + 4-digit door PIN issued on the spot.' },
      { name: 'PIN delivery + door unlock', detail: 'PIN sent to phone (SMS-ready) + door-lock activation.' },
    ],
  },
  {
    name: '2. Self-Service Kiosk — Returning Check-In',
    rows: [
      { name: 'Booking-number lookup',      detail: 'PRO-XXXX format.' },
      { name: 'NRIC verification',          detail: 'Must match booked NRIC (anti-fraud).' },
      { name: 'Waiver re-acknowledgement',  detail: 'Signature re-captured.' },
      { name: 'Door-lock activation',       detail: 'Animated "provisioning…" success state.' },
      { name: 'Edge-case handling',         detail: '"Already checked in" and "checked out" handled gracefully.' },
    ],
  },
  {
    name: '3. Backoffice — Property Manager Console',
    rows: [
      { name: 'Dashboard',                  detail: 'In-house count, pending check-ins, available rooms, live occupancy %.' },
      { name: 'Check-In / Check-Out console', detail: 'Searchable booking ledger, filter by Pending / In House / Departed, manual check-in/out buttons, PIN visible.' },
      { name: 'Rooms inventory',            detail: 'Grid view by floor, filters by status (available / occupied / reserved / maintenance) and room type.' },
      { name: 'Tenant directory',           detail: 'Search by name / NRIC / phone, booking count per tenant.' },
    ],
  },
  {
    name: '4. Property Settings — 5 Tabs',
    rows: [
      { name: 'General',                    detail: 'Name, address, timezone, default check-in / check-out times.' },
      { name: 'Room Types',                 detail: 'Catalog editor with descriptions & base pricing.' },
      { name: 'Pricing matrix',             detail: 'Auto-calculated RM totals across all durations with discount markers.' },
      { name: 'Self Check-In',              detail: 'Toggle kiosk on/off, require-NRIC toggle, require-waiver toggle, copyable kiosk URL.' },
      { name: 'Door-Lock integration',      detail: 'Provider picker, API key, PIN lifetime (match-booking / 24h / 7d / manual-revoke).' },
    ],
  },
  {
    name: '5. QVerify — Identity Verification & Compliance',
    rows: [
      { name: 'MyKad chip reader',          detail: 'Capture mode persists for property records.' },
      { name: 'Age-check mode',             detail: 'Verify-and-discard for any 18+ services.' },
      { name: 'Passport / manual entry',    detail: 'For non-Malaysians.' },
      { name: 'Per-merchant encryption',    detail: 'With crypto-shred offboarding.' },
      { name: 'Append-only audit log',      detail: 'Retained 7 years (PDPA Amendment Act 2024 compliant).' },
      { name: 'Manager-PIN override',       detail: 'For edge cases.' },
    ],
  },
  {
    name: '6. Access — Physical Entry Control',
    rows: [
      { name: 'Sunmi Face ID + turnstiles', detail: 'Terminal + turnstile pairing.' },
      { name: 'Per-device live state',      detail: 'Online / offline / lockdown / hold-open.' },
      { name: 'Manual control',             detail: 'Open / hold / close / lockdown with reason audit.' },
      { name: 'Override-and-admit',         detail: 'For twins, appearance changes, glasses, etc.' },
      { name: 'Anti-passback cooldown',     detail: 'No re-entry within X minutes.' },
      { name: 'Time-window rules',          detail: 'After-hours deny / allow / allow-with-alert.' },
      { name: 'Guest passes',               detail: '8-char single-use codes, default 4hr validity, revocable.' },
      { name: 'PDPA biometric consent',     detail: '+ erasure workflow (hourly job).' },
      { name: 'Live activity feed',         detail: 'Entries-today / denials-today counters.' },
      { name: 'Simulator mode',             detail: 'Demo before hardware lands.' },
    ],
  },
  {
    name: '7. Face ID — Biometric Recognition',
    rows: [
      { name: 'Face enrollment',            detail: 'One-time for tenants at booking.' },
      { name: 'On-device matching',         detail: 'On kiosk hardware (privacy-preserving).' },
      { name: 'Confidence-scored logs',     detail: 'Every check-in logged with confidence score.' },
      { name: 'Shared enrollment',          detail: 'Across property + studio + POS (single enrollment, multi-use).' },
    ],
  },
  {
    name: '8. Reusable Studio Modules',
    rows: [
      { name: 'Check-In Console',           detail: 'Fast front-desk check-in fallback when guest can\'t use the kiosk.' },
      { name: 'Face ID check-in',           detail: 'Tenant face entry to building / floor (vs PIN).' },
      { name: 'Members ↔ Tenants',          detail: 'Tenant CRM with profile, photo, stay history, notes.' },
      { name: 'Leads pipeline',             detail: 'Inquiry → tour-booked → deposit-paid → moved-in funnel.' },
      { name: 'Universal Booking — Rooms',  detail: 'Supports rooms as bookable resource.' },
      { name: 'Booking Console',            detail: 'Calendar of arrivals / departures / overlaps.' },
      { name: 'Schedule',                   detail: 'Cleaning / housekeeping rota; maintenance windows.' },
      { name: 'Waitlist',                   detail: 'Sold-out date → auto-notify when room frees up.' },
      { name: 'Auto-billing',               detail: 'Stripe recurring — monthly rent auto-charge for long-stay tenants.' },
      { name: 'Agreements',                 detail: 'Tenancy contracts with e-signature, version-controlled.' },
      { name: 'Automations',                detail: 'Pre-arrival email, day-of welcome SMS, mid-stay survey, check-out reminder, post-stay review request.' },
      { name: 'Notifications',              detail: 'WhatsApp / Telegram / SMS templates — PIN delivery, check-out reminders, late-payment dunning.' },
      { name: 'Alert Engine',               detail: 'Overdue check-out, payment failed, ID-mismatch flag.' },
      { name: 'Before / After gallery',     detail: 'Before / After stay photos — damage protection evidence.' },
      { name: 'Walk-in queue',              detail: 'Same-day arrival traffic with round-robin to available units.' },
      { name: 'Rewards & Vouchers',         detail: 'Repeat-guest loyalty, referral codes, off-peak discounts.' },
      { name: 'Staff Commissions',          detail: 'Pay agents / referrers for confirmed bookings.' },
      { name: 'Reports',                    detail: 'Occupancy %, ADR, RevPAR-style breakdowns, cohort retention.' },
      { name: 'AI Insights',                detail: '"Why occupancy dropped last week" narrative summaries.' },
      { name: 'Custom Fields',              detail: 'Capture vehicle plate, pet info, dietary, emergency contact.' },
      { name: 'Family / Group bookings',    detail: 'Group reservation across multiple rooms.' },
      { name: 'POS',                        detail: 'Sell add-ons at check-in — laundry, breakfast, parking, mini-bar.' },
      { name: 'Signature Canvas',           detail: 'Waiver / damage-acknowledgement signing on tablet.' },
    ],
  },
];

function FullFeaturesSection() {
  return (
    <section id="all-features" className="py-16 md:py-28 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-[12px] md:text-[13px] font-mono font-bold uppercase tracking-[0.35em] mb-4" style={{ color: BLUE }}>Full Features List</p>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-5 leading-[0.95]">
            Everything in one table.
          </h2>
          <p className="text-white/70 text-[15px] md:text-[17px] leading-relaxed mb-10 md:mb-14 max-w-2xl">
            The complete list — grouped by area. Nothing inflated, nothing extra.
          </p>
        </Reveal>

        <div className="space-y-10 md:space-y-12">
          {FEATURES_LIST.map((cat, ci) => (
            <Reveal key={cat.name} delay={Math.min(ci * 0.03, 0.21)}>
              <div>
                <h3 className="text-white text-[16px] md:text-[20px] font-black uppercase tracking-tight mb-4 pb-3 border-b-2" style={{ borderColor: BLUE }}>
                  {cat.name}
                </h3>

                {/* Desktop table */}
                <div className="hidden md:block border border-white/10">
                  {cat.rows.map((r, i) => (
                    <div key={r.name} className={`grid grid-cols-[260px_1fr] ${i % 2 === 0 ? 'bg-white/[0.02]' : ''} border-b border-white/5 last:border-b-0`}>
                      <div className="p-4 flex items-start gap-2 border-r border-white/10">
                        <Check size={14} strokeWidth={3} className="flex-shrink-0 mt-1" style={{ color: BLUE }} />
                        <span className="text-[14px] font-bold text-white leading-snug">{r.name}</span>
                      </div>
                      <div className="p-4 flex items-center">
                        <span className="text-[14px] text-white/75 leading-relaxed">{r.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile stacked */}
                <div className="md:hidden space-y-2">
                  {cat.rows.map(r => (
                    <div key={r.name} className="border border-white/10 p-4" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                      <div className="flex items-start gap-2 mb-1.5">
                        <Check size={13} strokeWidth={3} className="flex-shrink-0 mt-1" style={{ color: BLUE }} />
                        <p className="text-[14px] font-bold text-white leading-snug">{r.name}</p>
                      </div>
                      <p className="text-[13px] text-white/70 leading-relaxed pl-[22px]">{r.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// PRICING / CTA
// ────────────────────────────────────────────────────────────────
function PricingSection() {
  return (
    <section id="pricing" className="py-16 md:py-24 px-4 md:px-6 border-t border-white/10 bg-[#020814] text-white scroll-mt-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-60" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="max-w-5xl mx-auto relative z-10">
        <Reveal>
          <p className="text-[12px] md:text-[13px] font-mono font-bold uppercase tracking-[0.35em] mb-3" style={{ color: BLUE }}>Get a Quote</p>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-5 leading-[0.95]">
            Pay for the rooms you run. <span style={{ color: BLUE }}>Add what you need.</span>
          </h2>
          <p className="text-white/75 text-[15px] md:text-[17px] leading-relaxed max-w-2xl mb-10 md:mb-12">
            Tell us how many units, which door-lock brand, and whether you need a kiosk and NRIC chip reader. We'll come back with a tailored quote.
          </p>
        </Reveal>

        <Reveal>
          <div className="border-4 p-6 md:p-10 relative overflow-hidden text-center" style={{ borderColor: BLUE, backgroundColor: `${BLUE}08` }}>
            <div className="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-4 border-l-4" style={{ borderColor: BLUE }} />
            <div className="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-4 border-r-4" style={{ borderColor: BLUE }} />
            <div className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-4 border-l-4" style={{ borderColor: BLUE }} />
            <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-4 border-r-4" style={{ borderColor: BLUE }} />

            <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.95] mb-3 md:mb-4">
              Your property.<br className="hidden md:block" /> <span style={{ color: BLUE }}>Your quote.</span>
            </h3>
            <p className="text-white text-[14px] md:text-[16px] leading-relaxed max-w-xl mx-auto mb-6 md:mb-8">
              Units, door-lock provider, kiosk hardware, NRIC chip reader, payment options. Send us the setup — we'll send back the number.
            </p>

            <a href={WA_QUOTE} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 md:px-10 py-4 md:py-5 text-black text-[14px] md:text-[16px] font-black uppercase tracking-wider transition-colors hover:bg-white"
              style={{ backgroundColor: BLUE }}>
              <MessageCircle size={16} strokeWidth={2.5} /> Get my quote on WhatsApp <ArrowRight size={16} strokeWidth={2.5} />
            </a>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-5 text-[11px] md:text-[12px] text-white font-mono uppercase tracking-wider">
              <span>No tiers</span>
              <span className="hidden sm:inline opacity-40">·</span>
              <span>Add or drop any month</span>
              <span className="hidden sm:inline opacity-40">·</span>
              <span>No lock-in</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// MAIN PAGE
// ────────────────────────────────────────────────────────────────
const HERO_IMAGES = [
  '/qfitimg/headers/qfit-pool.jpg',
  '/qfitimg/headers/qfit-massage.jpg',
  '/qfitimg/headers/qfit-salon.jpg',
];

export default function QPropPage() {
  const [heroBg, setHeroBg] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setHeroBg(p => (p + 1) % HERO_IMAGES.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-[#020814] min-h-screen text-white selection:bg-[#3B9EFF] selection:text-black overflow-x-hidden">
      <SEOHead
        title="STUDIO for Property & Airbnb — Self-Service Kiosk + Door-Lock Control"
        description="Unattended check-in for short-stay, co-living and Airbnb properties. Kiosk booking, MyKad chip scan, passport scan, digital waiver, door PIN issued on the spot. PDPA-compliant."
        keywords="property management system Malaysia, Airbnb self check-in, co-living software Malaysia, MyKad chip reader, NRIC verification, smart door lock integration, short stay PMS Malaysia, PDPA compliant property management"
        image="https://qbot.now/qfitimg/qfit1.jpg"
        imageAlt="STUDIO for Property & Airbnb"
        url="https://qbot.now/qprop"
      />
      <PropHeader />

      {/* ═══ HERO ═══ */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 md:px-6 pt-20 md:pt-28 pb-8 md:pb-12 relative overflow-hidden bg-black">
        {HERO_IMAGES.map((src, i) => (
          <div key={i} className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ease-in-out"
            style={{ backgroundImage: `url(${src})`, opacity: heroBg === i ? 1 : 0 }} />
        ))}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(2,8,20,0.85) 0%, rgba(2,8,20,0.90) 100%)' }} />

        <div className="relative z-10 max-w-5xl w-full flex flex-col items-center text-center">
          <p className="text-[11px] md:text-[13px] font-mono font-bold uppercase tracking-[0.3em] mb-4 md:mb-6" style={{ color: BLUE }}>
            STUDIO · For Property & Airbnb
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-6 md:mb-8 text-white">
            Book it.<br />
            Check in.<br />
            <span style={{ color: BLUE }}>Door unlocks.</span>
          </h1>
          <p className="text-white/85 text-[16px] md:text-[20px] leading-relaxed max-w-2xl mb-8 md:mb-10">
            The unattended front-desk for short-stay, co-living, and Airbnb properties. Self-service kiosk that books, verifies ID, takes payment, issues a PIN, and unlocks the door — without staff on site.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a href="#book"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 text-white text-[13px] md:text-[14px] font-bold uppercase tracking-wider transition-colors hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
              See how it works <ArrowRight size={14} strokeWidth={2.5} />
            </a>
            <a href="#pricing"
              className="inline-flex items-center gap-2 px-6 py-3 text-black text-[13px] md:text-[14px] font-bold uppercase tracking-wider transition-colors hover:bg-white"
              style={{ backgroundColor: BLUE }}>
              Get a quote <ArrowRight size={14} strokeWidth={2.5} />
            </a>
          </div>
        </div>

        <HeroPillarStrip />
      </section>

      {/* ═══ BRUTALIST SCROLLER ═══ */}
      <section className="bg-black overflow-hidden border-y-4" style={{ borderColor: BLUE }}>
        <div className="py-4 overflow-hidden">
          <BrutalistStrip />
        </div>
      </section>

      <ProblemsSection />
      <BookAnywhereSection />
      <CheckInSection />
      <MaintenanceSection />
      <DoorLockSection />
      <SecuritySection />
      <BundlesSection />
      <ComparisonSection />
      <FullFeaturesSection />
      <PricingSection />

      <PropFooter />
    </div>
  );
}
