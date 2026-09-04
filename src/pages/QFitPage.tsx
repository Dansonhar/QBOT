import { useState, useEffect, useRef, type ReactNode } from 'react';
import {
  ScanFace, Smartphone, CalendarCheck, ClipboardList,
  MessageCircle, CreditCard, Megaphone,
  Target, Globe, Heart, Brain,
  ArrowRight, Instagram, Dumbbell, ChevronRight,
  Camera, UserPlus, Bell, Zap, Eye, Activity, Moon,
  Check,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';

const WA = 'https://wa.me/60126909189?text=Hi%20I%27m%20interested%20in%20QFit';
const WA_DEMO = 'https://wa.me/60126909189?text=' + encodeURIComponent("Hi, I'd like to book a QFit showroom demo at Publika KL.");
const HERO_IMAGES = [
  '/qfitimg/headers/qfit-gym.jpg',
  '/qfitimg/headers/qfit-cardio.jpg',
  '/qfitimg/headers/qfit-pool.jpg',
  '/qfitimg/headers/qfit-court.jpg',
  '/qfitimg/headers/qfit-pickle.jpg',
  '/qfitimg/headers/qfit-salon.jpg',
  '/qfitimg/headers/qfit-massage.jpg',
];

const HERO_VENUES = [
  'Gyms', 'Fitness Studios', 'Swimming Pools', 'Spas & Saunas',
  'Pilates Studios', 'Massage Centres', 'TCM Centres',
  'Yoga Studios', 'Martial Arts', 'Dance Studios',
  'Hair & Beauty Salons', 'Physiotherapy Centres', 'Boxing Gyms',
];

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
// HERO HUD
// ────────────────────────────────────────────────────────────────
function HeroHud({ onSelect }: { activeStep: number; onSelect: (i: number) => void }) {
  return (
    <div className="w-full max-w-5xl mx-auto mt-10 md:mt-16 relative">
      <div className="grid grid-cols-4 md:grid-cols-8 gap-1 md:gap-2">
        {JOURNEY_STEPS.map((step, i) => (
          <button key={i}
            onClick={() => { onSelect(i); document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="flex flex-col items-center text-center px-1 md:px-2 py-2 transition-all duration-200 cursor-pointer hover:bg-white/5">
            <span className="text-[14px] md:text-[20px] font-mono font-black text-[#CCFF00] leading-none mb-1">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-[9px] md:text-[11px] font-black uppercase tracking-tight text-white leading-tight">
              {step.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}


// ────────────────────────────────────────────────────────────────
// HEADER — matches main site structure, QFit themed
// ────────────────────────────────────────────────────────────────
const QFIT_ANNOUNCEMENTS = [
  'Malaysia\'s First Platform with Face ID Entry.',
  'Hardware + Software + Marketing. One Platform.',
  'No buddy-pass cheating. No spreadsheet management.',
];

function QFitHeader() {
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
      setTimeout(() => { setAnnIdx(p => (p + 1) % QFIT_ANNOUNCEMENTS.length); setAnnFade(true); }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top announcement bar */}
      <div className="bg-[#111] text-white hidden lg:block">
        <div className="container mx-auto px-4 md:px-6 lg:px-12 py-1.5 flex items-center justify-between">
          <div className="flex items-center divide-x divide-gray-300 text-[10px] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 pr-4 text-gray-400">
              <Dumbbell size={10} strokeWidth={2.5} className="text-[#CCFF00]" />
              QFit by QBot
            </span>
            <span className="px-4 text-gray-400">Mon-Fri: 10AM - 7PM</span>
            <span className={`pl-4 text-[#CCFF00] transition-opacity duration-300 ${annFade ? 'opacity-1000' : 'opacity-0'}`}>
              {QFIT_ANNOUNCEMENTS[annIdx]}
            </span>
          </div>
          <div className="flex items-center gap-4 divide-x divide-gray-600">
            <a href={WA} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors">
              <MessageCircle size={10} strokeWidth={2.5} />
              +6012-6909-189
            </a>
            <a href="/" className="pl-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#CCFF00] hover:text-[#CCFF00] transition-colors">
              Explore QPOS <ArrowRight size={10} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className={`transition-all duration-300 bg-black/90 backdrop-blur-xl backdrop-saturate-150 border-b border-white/10 ${scrolled ? 'shadow-sm' : ''}`}>
        <div className="container mx-auto px-4 md:px-6 lg:px-12 py-3 md:py-4">
          <div className="flex items-center">
            {/* Logo */}
            <a href="/qfit" className="flex items-center group mr-10">
              <img src="/qbotlogo.svg" alt="QFit Logo" className="w-9 h-9 md:w-10 md:h-10 transition-all duration-200 group-hover:opacity-100 brightness-0 invert" />
            </a>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {[
                { label: 'THE ONE PLATFORM', href: '#journey' },
                { label: 'FEATURES', href: '#features' },
                { label: 'FACE-ID SENTRY', href: '#sentry' },
                { label: 'COMPARE', href: '#comparison' },
                { label: 'GET QUOTE', href: '#pricing' },
              ].map(item => (
                <a key={item.label} href={item.href} className="text-[11px] font-bold tracking-[0.1em] uppercase text-white hover:text-[#CCFF00] transition-colors duration-200">
                  {item.label}
                </a>
              ))}
            </div>

            {/* Right */}
            <div className="hidden lg:flex items-center gap-5 ml-auto">
              <a href={WA_DEMO} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-[#CCFF00] hover:bg-white text-black text-[11px] font-bold uppercase tracking-wider transition-colors">
                <MessageCircle size={14} strokeWidth={2} /> Book Demo <ChevronRight size={14} strokeWidth={2.5} />
              </a>
            </div>

            {/* Mobile */}
            <div className="lg:hidden flex items-center ml-auto gap-2">
              <a href={WA_DEMO} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#CCFF00] text-black text-[10px] font-bold uppercase tracking-wider">
                <MessageCircle size={12} strokeWidth={2} /> Demo
              </a>
              <button onClick={() => setMobileMenu(p => !p)} className="p-2 text-white/100">
                {mobileMenu ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenu && (
            <div className="lg:hidden border-t border-white/10 py-3 flex flex-col gap-1">
              {[
                { label: 'The One Platform', href: '#journey' },
                { label: 'Features', href: '#features' },
                { label: 'Face-ID Sentry', href: '#sentry' },
                { label: 'Compare', href: '#comparison' },
                { label: 'Get Quote', href: '#pricing' },
                { label: 'Explore QPOS', href: '/' },
              ].map(item => (
                <a key={item.label} href={item.href} onClick={() => setMobileMenu(false)}
                  className="text-[12px] font-bold uppercase tracking-wider text-white hover:text-[#CCFF00] py-2 px-2 transition-colors">
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
// FOOTER — matches main site structure, QFit themed
// ────────────────────────────────────────────────────────────────
function QFitFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="relative bg-black text-white border-t border-white/10">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">

          {/* Logo + tagline */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <img src="/qbotlogo.svg" alt="QBot Logo" className="w-12 h-12 brightness-0 invert" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wide mb-1.5">The All-In-One Platform for Fitness & Wellness</p>
            <p className="text-[11px] text-gray-400 leading-relaxed mb-5">Face ID entry. Branded website. Member app. Staff app. Auto billing. Built-in marketing. AI dashboard. One platform that runs your entire operation.</p>
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/qbotmalaysia" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#CCFF00] transition-colors"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
              <a href="https://www.instagram.com/qbotfuture" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#CCFF00] transition-colors"><Instagram size={16} strokeWidth={2} /></a>
              <a href="https://www.tiktok.com/@qbotfuture" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#CCFF00] transition-colors"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg></a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <p className="text-[10px] text-[#CCFF00] font-bold uppercase tracking-[0.15em] mb-3">Platform</p>
            <ul className="space-y-1.5">
              {[
                { label: 'Entry Gate & Face ID', href: '#features' },
                { label: 'Member App', href: '#features' },
                { label: 'Trainer App', href: '#features' },
                { label: 'AI Dashboard', href: '#features' },
                { label: 'CRM & Marketing', href: '#features' },
                { label: 'Website Builder', href: '#features' },
              ].map(item => (
                <li key={item.label}><a href={item.href} className="text-[12px] text-gray-400 hover:text-white transition-colors">{item.label}</a></li>
              ))}
            </ul>
          </div>

          {/* Compare + Resources */}
          <div>
            <p className="text-[10px] text-[#CCFF00] font-bold uppercase tracking-[0.15em] mb-3">Compare</p>
            <ul className="space-y-1.5 mb-6">
              {[
                { label: 'vs Typical Platforms', href: '#comparison' },
                { label: 'Why QFit', href: '#comparison' },
              ].map(item => (
                <li key={item.label}><a href={item.href} className="text-[12px] text-gray-400 hover:text-white transition-colors">{item.label}</a></li>
              ))}
            </ul>
            <p className="text-[10px] text-white font-bold uppercase tracking-[0.15em] mb-3">Also by QBot</p>
            <ul className="space-y-1.5">
              <li><a href="/" className="text-[12px] text-gray-400 hover:text-white transition-colors">QPOS — F&B / Retail POS</a></li>
              <li><a href="/hardware" className="text-[12px] text-gray-400 hover:text-white transition-colors">Hardware</a></li>
              <li><a href="/pricing" className="text-[12px] text-gray-400 hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] text-white font-bold uppercase tracking-[0.15em] mb-3">Contact</p>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-400"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <div>
                  <p className="text-[12px] text-gray-400 leading-snug">B3-6-13 Solaris Dutamas</p>
                  <p className="text-[12px] text-gray-400 leading-snug">Jalan Dutamas 1, 50480</p>
                  <p className="text-[11px] text-gray-400">Publika KL</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle size={14} className="flex-shrink-0 text-gray-400" strokeWidth={2} />
                <a href={WA} target="_blank" rel="noopener noreferrer" className="text-[12px] text-gray-400 hover:text-white transition-colors">+6012-6909-189</a>
              </div>
              <p className="text-[10px] text-gray-400 pl-[26px]">Mon–Fri: 10AM – 7PM</p>
              <a href={WA} target="_blank" rel="noopener noreferrer"
                className="inline-block bg-[#CCFF00] hover:bg-white text-black text-[10px] font-bold uppercase tracking-wider px-5 py-2.5 transition-colors">
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="border-t border-white/10 pt-6 text-[11px] text-gray-500">
          <p>&copy; {currentYear} QBOT — Part of QBot Product Family</p>
        </div>
      </div>
    </footer>
  );
}

// ────────────────────────────────────────────────────────────────
// SCROLLING STRIP
// ────────────────────────────────────────────────────────────────
function ScrollingStrip() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let pos = -(el.scrollWidth / 2);
    let raf: number;
    const step = () => { pos += 0.4; if (pos >= 0) pos = -(el.scrollWidth / 2); el.style.transform = `translateX(${pos}px)`; raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);
  const items = [...MODULES, ...MODULES, ...MODULES, ...MODULES];
  return (
    <div className="overflow-hidden">
      <div ref={ref} className="flex whitespace-nowrap will-change-transform">
        {items.map((m, i) => {
          const Icon = m.icon;
          return (
            <span key={i} className="inline-flex items-center gap-2 text-[13px] font-mono font-bold uppercase tracking-[0.2em] text-white/100 mx-8">
              <Icon size={14} strokeWidth={1.5} /> {m.title}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// BRUTALIST STRIP — smooth left-to-right scroll
// ────────────────────────────────────────────────────────────────
const BRUTALIST_ITEMS = ['Face Check-in', 'Operate 24/7', 'Staff-free', 'Book & Schedule', 'Auto Billing', 'Capture Leads', 'Loyalty & Rewards', 'Staff Performance', 'AI Insights'];

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
            {t}<span className="text-[#CCFF00] ml-3 sm:ml-6 md:ml-10">///</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// MODULE ICON BAR DATA
// ────────────────────────────────────────────────────────────────
const MODULES = [
  { icon: ScanFace, title: 'Face ID Entry' },
  { icon: Globe, title: 'Website' },
  { icon: Smartphone, title: 'Member App' },
  { icon: CreditCard, title: 'Payments & Billing' },
  { icon: Target, title: 'CRM & Leads' },
  { icon: Heart, title: 'Loyalty' },
  { icon: Megaphone, title: 'Marketing' },
  { icon: CalendarCheck, title: 'Booking' },
  { icon: ClipboardList, title: 'Staff Ops' },
  { icon: Brain, title: 'AI Dashboard' },
];


// ────────────────────────────────────────────────────────────────
// MAIN PAGE
// ────────────────────────────────────────────────────────────────
type JourneyStep = {
  title: string;
  hook: string;
  includes: string[];
  note?: string;
  img: string;
};

const JOURNEY_STEPS: JourneyStep[] = [
  {
    title: 'Face ID & Entry',
    hook: 'The moment someone walks through your door.',
    includes: ['Face ID Check-In', 'QR Member Card', 'Walk-In Intake', 'Live Availability Board', 'Face ID Staff Auth', 'Queue Management'],
    img: '/qfitimg/modules/qfit-01faceid.jpg',
  },
  {
    title: 'Bookings & Classes',
    hook: 'Fill every slot. Every seat. Every room.',
    includes: ['1-on-1 Appointments', 'Class Booking with Capacity', 'Seat-Reserved Classes', 'Room Bookings', 'Waitlist', 'Session Calendar', 'Status Flow', 'Auto-Accept'],
    img: '/qfitimg/modules/qfit-02bookings.jpg',
  },
  {
    title: 'Memberships & Billing',
    hook: 'Recurring revenue, on autopilot.',
    includes: ['Flexible Plans (monthly / annual / class-pack / unlimited / trial)', 'Credit-Based System', 'Auto-Renewal', 'Credit Rollover', 'Membership States', 'Plan-Specific Pricing', 'Membership Card'],
    img: '/qfitimg/modules/qfit-03app.jpg',
  },
  {
    title: 'Point of Sale',
    hook: 'Buy or book — from anywhere. Same system.',
    includes: ['Counter POS', 'In-App Checkout', 'Web Booking & Purchase', 'Service & Product Checkout', 'Multi-Payment Split', 'Digital Receipts', 'Reward Point Redemption at POS'],
    note: 'All synced to one customer, one bill, one report.',
    img: '/qfitimg/modules/qfit-04pos.jpg',
  },
  {
    title: 'Staff & Commissions',
    hook: 'Trainers perform. You pay them right.',
    includes: ['Staff Profiles', 'KPI Dashboard', 'Top Performer Rankings', 'Commission Engine (% or flat)', 'Commission Status Tracking', 'Effective-Dated Rules', 'Service Category Breakdown', 'Stylist Bookings Console'],
    img: '/qfitimg/modules/qfit-05staff.jpg',
  },
  {
    title: 'Loyalty & CRM',
    hook: 'Turn one-time visits into repeat revenue.',
    includes: ['Points Earning', 'Bonus Campaigns', 'Reward Catalogue', 'Points Ledger', 'Referral Tracking', 'Customer Segmentation', 'Lifetime Value', 'Birthday / Anniversary Triggers', 'Push Notifications', 'Promo Banners'],
    img: '/qfitimg/modules/qfit-06loyalty.jpg',
  },
  {
    title: 'Reports & Multi-Outlet',
    hook: 'Run one gym or ten. Same dashboard.',
    includes: ['Daily Sales Dashboard', 'Filtered Reports', 'Revenue Trends', 'Commission Summaries', 'Multi-Outlet Operations', 'Per-Outlet Hours / Staff / Reports', 'Outlet Selector', 'Role-Based Access', 'Audit Trail'],
    img: '/qfitimg/modules/qfit-07dashboard.jpg',
  },
  {
    title: 'Sentry Mode',
    hook: 'Non-member walks in. You get pinged.',
    includes: ['24/7 face scanning across premises', 'Confidence-score matching', 'Staff Mobile App alerts with snapshot + timestamp', 'Unknown-face log with timeline', 'Multi-camera coverage (entrance, floor, back areas)', 'Outlet-locked Sentry Console'],
    img: '/qfitimg/modules/qfit-08sentry.jpg',
  },
];

// ────────────────────────────────────────────────────────────────
// SENTRY SECTION
// ────────────────────────────────────────────────────────────────
const SENTRY_STEPS = [
  { num: '01', title: 'Set up Sentry cameras', body: 'We handle the setup at your entrance, floor, and back areas. Positioned for the best face capture angles.', Icon: Camera },
  { num: '02', title: 'Register your members', body: 'Members enrol their face once at sign-up. Takes 5 seconds. Stored securely, tied to their membership.', Icon: UserPlus },
  { num: '03', title: 'Sentry scores every face', body: 'Every face gets a match confidence score against your member database. High confidence — passes silently. Low confidence — flagged as unknown. Lighting, angle, and caps all factor in, so Sentry thinks before it alerts.', Icon: ScanFace },
  { num: '04', title: 'Staff gets alerted', body: 'Mobile App alert in under a second — with a snapshot, confidence score, and camera location. Staff makes the final call.', Icon: Bell },
];

const SENTRY_BENEFITS = [
  { num: '01', title: 'Plug the revenue leak', body: "Every tailgater you catch is a membership you should've sold. Sentry turns silent losses into signups.", Icon: Zap },
  { num: '02', title: 'No extra staff needed', body: 'Sentry does the watching. Your team only acts when something gets flagged.', Icon: Eye },
  { num: '03', title: 'Real numbers, finally', body: 'Every unknown face logged with time, snapshot, and confidence score. You stop guessing how bad the leak is — you see it.', Icon: Activity },
  { num: '04', title: 'Works while you sleep', body: "24/7 coverage. Weekends, midnight, public holidays — Sentry doesn't clock off.", Icon: Moon },
];

function SentrySection() {
  const [tab, setTab] = useState<'how' | 'benefits'>('how');
  const items = tab === 'how' ? SENTRY_STEPS : SENTRY_BENEFITS;
  const intro = tab === 'how' ? 'Four steps. Always on.' : 'What you actually get back.';

  return (
    <section id="sentry" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20 relative overflow-hidden">
      {/* Ambient red glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 15% 25%, rgba(239,68,68,0.10) 0%, transparent 55%)' }} />
      <div className="absolute inset-0 pointer-events-none opacity-60" style={{ backgroundImage: 'radial-gradient(rgba(239,68,68,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <Reveal>
          <div className="flex items-center gap-2 mb-5">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-red-500 opacity-75" style={{ animation: 'qfit-pulse 1.4s ease-in-out infinite' }} />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            <p className="text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-red-400">Face ID Sentry Mode</p>
          </div>
          <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tight mb-5 leading-[0.9]">
            Get alerted when<br className="hidden sm:block" /> non-member is in your gym.
          </h2>
          <p className="text-white/80 text-[14px] md:text-[16px] leading-relaxed max-w-2xl mb-10 md:mb-14">
            Sentry Mode reads every face across your premises. The moment a stranger walks in, staff gets pinged.
          </p>
        </Reveal>

        {/* Video + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-10 mb-10 md:mb-14 items-start">
          {/* LEFT: Video with HUD overlay */}
          <Reveal className="lg:col-span-3">
            <div className="relative bg-black border border-red-500/50 overflow-hidden aspect-video"
              style={{ animation: 'qfit-alert-pulse 2.4s ease-in-out infinite' }}>
              <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-contain block">
                <source src="/qfitimg/qfitsample.mp4" type="video/mp4" />
              </video>

              {/* Tint */}
              <div className="pointer-events-none absolute inset-0 bg-red-500/5 mix-blend-overlay" />

              {/* Scanline */}
              <div className="pointer-events-none absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent"
                style={{ animation: 'qfit-scan 3.2s linear infinite', boxShadow: '0 0 14px rgba(239,68,68,0.9)' }} />

              {/* Corner brackets */}
              <div className="pointer-events-none absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-red-500" />
              <div className="pointer-events-none absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-red-500" />
              <div className="pointer-events-none absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-red-500" />
              <div className="pointer-events-none absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-red-500" />

              {/* Top HUD */}
              <div className="absolute top-0 inset-x-0 p-3 md:p-4 flex items-start justify-between pointer-events-none">
                <div className="flex items-center gap-2 bg-black/75 backdrop-blur-sm px-2.5 py-1 border border-red-500/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" style={{ animation: 'qfit-blink 1s ease-in-out infinite' }} />
                  <span className="text-red-400 text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-wider">Live</span>
                </div>
                <div className="bg-black/75 backdrop-blur-sm px-2.5 py-1 border border-white/25">
                  <span className="text-white text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-wider">Sentry Mode</span>
                </div>
              </div>

              {/* Bottom HUD */}
              <div className="absolute bottom-0 inset-x-0 p-3 md:p-4 pointer-events-none">
                <div className="flex items-center justify-between bg-black/75 backdrop-blur-sm px-3 py-2 border border-red-500/50">
                  <div className="flex items-center gap-2">
                    <ScanFace size={14} className="text-red-400" strokeWidth={2} />
                    <span className="text-red-400 text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-wider">Scanning<span style={{ animation: 'qfit-blink 1.2s ease-in-out infinite' }}>...</span></span>
                  </div>
                  <span className="text-white/70 text-[10px] md:text-[11px] font-mono">CAM 01 · ENTRANCE</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* RIGHT: Tabs & content */}
          <div className="lg:col-span-2 flex flex-col">
            {/* Tab switcher */}
            <div className="flex border-b border-white/10 mb-4">
              {[
                { id: 'how' as const, label: 'How it Works' },
                { id: 'benefits' as const, label: 'Benefits' },
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex-1 px-4 py-3 text-[11px] md:text-[12px] font-black uppercase tracking-wider transition-all duration-200 border-b-2 ${
                    tab === t.id ? 'border-red-500 text-red-400' : 'border-transparent text-white/50 hover:text-white'
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>

            <p className="text-white/60 text-[12px] md:text-[13px] italic mb-5 md:mb-6">{intro}</p>

            <div key={tab} className="space-y-4 md:space-y-5" style={{ animation: 'qfit-reveal 0.35s ease-out' }}>
              {items.map((it, i) => (
                <div key={i} className="flex gap-3 md:gap-4 group">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 border border-red-500/40 bg-red-500/5 flex items-center justify-center group-hover:bg-red-500/15 group-hover:border-red-500 transition-colors">
                    <it.Icon size={18} className="text-red-400" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-mono font-black text-red-500 text-[12px] md:text-[13px]">{it.num}</span>
                      <p className="text-white text-[13px] md:text-[15px] font-bold uppercase tracking-tight">{it.title}</p>
                    </div>
                    <p className="text-white/70 text-[12px] md:text-[13px] leading-relaxed">{it.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <Reveal>
          <div className="border border-red-500/30 bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent p-6 md:p-10 text-center relative overflow-hidden">
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-red-500/50" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-red-500/50" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-red-500/50" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-red-500/50" />
            <a href={WA_DEMO} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-red-500 hover:bg-red-400 text-black text-[12px] md:text-[13px] font-black uppercase tracking-wider transition-colors">
              See Sentry live <ArrowRight size={16} strokeWidth={2.5} />
            </a>
            <p className="text-white/75 text-[12px] md:text-[14px] mt-4 leading-relaxed max-w-xl mx-auto">
              Book a showroom demo at Publika KL. We'll show you every face it catches in real-time.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// ONE PRICING SECTION
// ────────────────────────────────────────────────────────────────
const PRICING_FEATURES: Array<{ label: string; soon?: boolean }> = [
  { label: 'Face ID Check-In' }, { label: 'QR Member Card' }, { label: 'Walk-In Intake' }, { label: 'Queue Management' },
  { label: 'Live Availability Board' }, { label: 'Face ID Staff Auth' }, { label: '1-on-1 Appointments' }, { label: 'Class Booking with Capacity' },
  { label: 'Seat-Reserved Classes' }, { label: 'Room Bookings' }, { label: 'Auto-Waitlist' }, { label: 'Session Calendar' },
  { label: 'Auto-Accept Bookings' }, { label: 'Flexible Membership Plans' }, { label: 'Credit-Based System' }, { label: 'Auto-Renewal & Billing' },
  { label: 'Membership Freeze/Cancel' }, { label: 'Counter POS' }, { label: 'In-App Checkout' }, { label: 'Web Booking & Purchase' },
  { label: 'Digital Receipts' }, { label: 'Reward Point Redemption' }, { label: 'Staff Profiles' }, { label: 'KPI Dashboard' },
  { label: 'Top Performer Rankings' }, { label: 'Commission Engine (% or flat)' }, { label: 'Commission Status Tracking' }, { label: 'Points Earning' },
  { label: 'Bonus Campaigns' }, { label: 'Reward Catalogue' }, { label: 'Referral Tracking' }, { label: 'Customer Segmentation' },
  { label: 'Lifetime Value Tracking' }, { label: 'Birthday & Anniversary Triggers' }, { label: 'Push Notifications' }, { label: 'Promo Banner Slider' },
  { label: 'Daily Sales Dashboard' }, { label: 'Filtered Reports' }, { label: 'Revenue Trends' }, { label: 'Commission Summaries' },
  { label: 'Role-Based Access' }, { label: 'Audit Trail' }, { label: 'Unlimited Staff Accounts' }, { label: 'Unlimited Bookings' },
  { label: 'Unlimited Transactions' }, { label: 'Kitchen/Cafe Integration' }, { label: 'Transformation Gallery' }, { label: 'Own Web App (for Staff)' },
  { label: 'Own Web App (for Member)' }, { label: 'Own Webstore' }, { label: 'Apple / Google App*', soon: true },
];

const LIME = '#CCFF00';

function QFitPricingSection() {
  const quoteWa = 'https://wa.me/60126909189?text=' + encodeURIComponent(
    "Hi! I'd like a QFit quote for my business. Here's my setup:\n- Business type:\n- Active members:\n- Number of outlets:\n- Add-ons (Sentry Mode / multi-outlet / private server):\n\nThanks!"
  );

  return (
    <section id="pricing" className="py-12 md:py-16 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20 relative overflow-hidden">
      {/* Grid backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-60" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* ─── BLOCK 1 — HEADER ─── */}
        <Reveal>
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] mb-3" style={{ color: LIME }}>Get a Quote</p>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-3 leading-[0.9]">
            We only win <span style={{ color: LIME }}>when you win.</span>
          </h2>
          <p className="text-white/80 text-[13px] md:text-[15px] leading-relaxed max-w-2xl mb-6 md:mb-8">
            One plan. Every feature. Tailored to your setup — chat with us for a quote.
          </p>
        </Reveal>

        {/* ─── BLOCKS 2 + 3 SIDE-BY-SIDE ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-5 md:gap-6 mb-10 md:mb-14 items-stretch">

          {/* BLOCK 2 — HERO PRICE CARD */}
          <Reveal className="order-2 lg:order-1">
            <div className="border-4 bg-black p-5 md:p-7 relative h-full flex flex-col" style={{ borderColor: LIME }}>
              <div className="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-4 border-l-4" style={{ borderColor: LIME }} />
              <div className="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-4 border-r-4" style={{ borderColor: LIME }} />
              <div className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-4 border-l-4" style={{ borderColor: LIME }} />
              <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-4 border-r-4" style={{ borderColor: LIME }} />

              <div className="text-center flex-1 flex flex-col justify-center">
                <p className="text-[9px] md:text-[11px] font-mono font-bold uppercase tracking-[0.25em] mb-4 md:mb-5" style={{ color: LIME }}>
                  QFit Platform — All-You-Can-Use
                </p>

                <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.95] mb-4 md:mb-5">
                  Pricing tailored<br /><span style={{ color: LIME }}>to your setup.</span>
                </h3>

                <p className="text-white/80 text-[13px] md:text-[15px] leading-relaxed max-w-md mx-auto mb-6 md:mb-8">
                  One plan. Every feature. No tiers, no upgrades. Chat with us — we'll quote you in 2 minutes.
                </p>

                <a href={quoteWa} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 md:px-8 py-3.5 md:py-4 text-black text-[12px] md:text-[14px] font-black uppercase tracking-wider transition-colors hover:bg-white self-center"
                  style={{ backgroundColor: LIME }}>
                  <MessageCircle size={16} strokeWidth={2.5} /> WhatsApp for pricing <ArrowRight size={14} strokeWidth={2.5} />
                </a>

                <div className="mt-5 md:mt-6 flex items-center justify-center gap-2 md:gap-3 text-[10px] md:text-[11px] text-white/60 flex-wrap">
                  <span>Identify Hardware Setup</span>
                  <span className="opacity-40">·</span>
                  <span>Software Demo</span>
                  <span className="opacity-40">·</span>
                  <span>Get Pricing</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* BLOCK 3 — EVERYTHING'S INCLUDED */}
          <Reveal className="order-1 lg:order-2">
            <div className="h-full flex flex-col">
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-2 leading-tight">
                Every feature. <span style={{ color: LIME }}>Zero upgrades.</span>
              </h3>
              <p className="text-white/70 text-[12px] md:text-[13px] leading-relaxed mb-3 md:mb-4">
                No "Pro tier to unlock." No "contact sales for this." The full QFit stack — included.
              </p>

              <div className="grid grid-cols-2 gap-x-3 gap-y-1 md:gap-y-1.5 border-t-2 border-b-2 border-white/15 py-3 md:py-4 flex-1 content-start">
                {PRICING_FEATURES.map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 min-w-0">
                    <Check size={11} strokeWidth={3} className={`flex-shrink-0 ${f.soon ? 'opacity-40' : ''}`} style={{ color: LIME }} />
                    <span className={`text-[10px] md:text-[11.5px] truncate ${f.soon ? 'text-white/50 italic' : 'text-white'}`}>
                      {f.label}
                      {f.soon && <span className="text-white/40 not-italic"> — coming soon</span>}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-white/50 text-[10px] md:text-[11px] italic mt-2 md:mt-3">
                All included, no upgrade needed. Fair usage of 1gb storage per outlet/account.
              </p>
            </div>
          </Reveal>

        </div>

        {/* ─── BLOCK 7 — WHY THIS PRICING WORKS ─── */}
        <Reveal>
          <div className="mb-12 md:mb-16">
            <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-10 md:mb-12 leading-tight">
              Pricing that <span style={{ color: LIME }}>respects you.</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                { kicker: 'Start small.', tail: 'Grow loaded.', body: 'Get the same enterprise software that industry charges 3× more for — at a rate that scales with your business. No reason left not to grow.' },
                { kicker: "If you're big,", tail: "you pay fairly.", body: "No hidden ceiling. No forced \"enterprise call.\" A simple per-member rate on top of the base — you only pay for members you're actively earning from." },
                { kicker: "Everyone gets", tail: "every feature.", body: "No Starter vs. Pro vs. Enterprise nonsense. Every gym on QFit runs on the full platform. No upsell calls." },
              ].map((col, i) => (
                <div key={i} className="border-t-2 pt-5 md:pt-6" style={{ borderColor: LIME }}>
                  <p className="text-white text-[16px] md:text-[20px] font-black uppercase tracking-tight leading-tight mb-3">
                    {col.kicker}{' '}<span style={{ color: LIME }}>{col.tail}</span>
                  </p>
                  <p className="text-white/75 text-[13px] md:text-[14px] leading-relaxed">{col.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}

export default function QFitPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [heroBg, setHeroBg] = useState(0);
  const [heroVenue, setHeroVenue] = useState(0);
  const [venueFade, setVenueFade] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setHeroBg(p => (p + 1) % HERO_IMAGES.length), 4000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => {
      setVenueFade(false);
      setTimeout(() => { setHeroVenue(p => (p + 1) % HERO_VENUES.length); setVenueFade(true); }, 300);
    }, 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-white min-h-screen text-black selection:bg-[#CCFF00] overflow-x-hidden">
      <SEOHead
        title="QFit Malaysia — Face ID Gym, Pilates & Wellness Management Platform"
        description="Malaysia's first Face ID gym management platform. Member app, staff app, auto-billing, booking, Sentry Mode — all-in-one for gyms, pilates, yoga, spas, salons, martial arts."
        keywords="gym management software Malaysia, gym POS Malaysia, face ID gym entry, pilates studio software Malaysia, yoga studio software, fitness booking system Malaysia, wellness centre POS, spa management Malaysia, salon booking Malaysia, martial arts studio software, membership software Malaysia, Sentry Mode gym, gym check-in kiosk, QFit"
        image="https://qbot.now/qfitimg/qfit1.jpg"
        imageAlt="QFit — Face ID Management Platform for Gyms, Pilates & Wellness Studios"
        url="https://qbot.now/qfit"
      />
      <QFitHeader />

      {/* ═══ HERO ═══ */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 md:px-6 pt-20 md:pt-28 pb-8 md:pb-12 relative overflow-hidden bg-black">

        {/* Background image crossfade */}
        {HERO_IMAGES.map((src, i) => (
          <div key={i} className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ease-in-out"
            style={{ backgroundImage: `url(${src})`, opacity: heroBg === i ? 1 : 0 }} />
        ))}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 max-w-5xl w-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16">
          {/* Device image */}
          <div className="w-36 sm:w-48 md:w-64 lg:w-72 flex-shrink-0 flex-grow-0">
            <img src="/qfitimg/qfit-device.png" alt="QFit device" className="w-full h-auto drop-shadow-2xl" />
          </div>

          {/* Text */}
          <div className="text-center md:text-left md:w-[400px] lg:w-[480px] flex-shrink-0 flex-grow-0">
            <p className="text-[9px] md:text-[11px] font-mono font-bold uppercase tracking-[0.2em] md:tracking-[0.35em] text-[#CCFF00] mb-3 md:mb-5">The All-In-One Management Platform For</p>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-4 md:mb-6 text-white h-[1.8em]">
              <span className={`inline-block transition-all duration-300 ${venueFade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                {HERO_VENUES[heroVenue]}
              </span>
            </h1>
            <p className="text-gray-400 text-[13px] md:text-[16px] leading-relaxed max-w-lg mb-6 md:mb-10">
              Face ID access. Member app. Staff app. Owner dashboard. Loyalty & CRM.
              One platform that replaces your spreadsheets, card systems, WhatsApp groups and Headaches.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
              <a href="#journey"
                className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-white/30 hover:border-white text-white text-[11px] font-bold uppercase tracking-wider transition-colors">
                See What's Inside <ArrowRight size={14} strokeWidth={2.5} />
              </a>
            </div>
          </div>
        </div>

        {/* NEW! Sentry Mode highlight */}
        <div className="relative z-10 w-full max-w-5xl mx-auto mt-8 md:mt-12 px-2 md:px-0">
          <a
            href="#sentry"
            className="group flex items-stretch border overflow-hidden"
            style={{ animation: 'qfit-alert-pulse 1.2s ease-in-out infinite' }}
          >
            {/* Image */}
            <div className="hidden sm:block w-32 md:w-48 flex-shrink-0 overflow-hidden bg-black">
              <img src="/qfitimg/sentrycover.jpg" alt="Sentry Mode" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            {/* Text */}
            <div className="flex-1 p-4 md:p-6 flex items-center gap-3 md:gap-5">
              <span
                className="flex-shrink-0 inline-block text-[10px] md:text-[11px] font-black uppercase tracking-wider px-2.5 py-1"
                style={{ animation: 'qfit-alert-badge 1.2s ease-in-out infinite' }}
              >
                New!
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-[13px] md:text-[18px] font-black uppercase tracking-tight leading-tight mb-1 md:mb-1.5">
                  Stop buddy tailgating. Run 24/7 with peace.
                </p>
                <p className="text-gray-200 text-[11px] md:text-[13px] leading-snug">
                  Sentry Mode scans every face across your premises. Unknown walk-ins get flagged to staff instantly.
                </p>
              </div>
              <ChevronRight size={20} className="hidden md:block text-red-300 group-hover:translate-x-1 transition-transform flex-shrink-0" strokeWidth={2.5} />
            </div>
          </a>
        </div>

        <HeroHud activeStep={activeStep} onSelect={setActiveStep} />
      </section>

      {/* ═══ BRUTALIST SCROLLER ═══ */}
      <section className="bg-black overflow-hidden border-y-4 border-[#CCFF00]">
        {/* Row 1: Left to right */}
        <div className="py-4 overflow-hidden">
          <BrutalistStrip />
        </div>
        {/* Row 2: Right to left */}
        <div className="py-4 border-t border-white/10 overflow-hidden">
          <ScrollingStrip />
        </div>
      </section>



      {/* ═══ JOURNEY ═══ */}
      <section id="journey" className="py-16 md:py-40 px-4 md:px-6 border-t border-gray-100 bg-black text-white scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#CCFF00] mb-5">8 Modules. One Platform.</p>
            <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tight mb-5 leading-tight">
              From First Click to Loyal Member.<br className="hidden sm:block" /> Fully Automated.
            </h2>
            <p className="text-white/100 text-[14px] md:text-[15px] leading-relaxed mb-10 md:mb-14 max-w-2xl">
              One platform covers the entire loop — entry, bookings, billing, POS, staff, loyalty, reports, and security. From any device, for any fitness or wellness business.
            </p>
          </Reveal>

          {/* Tab bar — 2 cols mobile, 4 cols desktop (2 rows) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-6 md:mb-10">
            {JOURNEY_STEPS.map((step, i) => (
              <button key={i} onClick={() => setActiveStep(i)}
                className={`flex items-center justify-start gap-2 px-3 md:px-4 py-2.5 md:py-3 text-[10px] md:text-[12px] font-black uppercase tracking-tight transition-all duration-200 border-b-2 ${
                  activeStep === i
                    ? 'border-[#CCFF00] text-[#CCFF00] bg-white/5'
                    : 'border-transparent text-white hover:text-[#CCFF00]'
                }`}>
                <span className="font-mono text-[10px] md:text-[11px] opacity-70">{String(i + 1).padStart(2, '0')}</span>
                <span className="truncate">{step.title}</span>
              </button>
            ))}
          </div>

          {/* Active content card */}
          <div key={activeStep} className="border border-white/10 bg-white/5 grid grid-cols-1 md:grid-cols-2 overflow-hidden" style={{ animation: 'qfit-reveal 0.3s ease-out' }}>
            <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
              <img src={JOURNEY_STEPS[activeStep].img} alt={JOURNEY_STEPS[activeStep].title} className="w-full h-full object-cover" />
            </div>
            <div className="p-5 md:p-10 flex flex-col justify-center">
              <div className="flex items-baseline gap-2 mb-2 md:mb-3">
                <span className="font-mono font-black text-[#CCFF00] text-[13px] md:text-[14px]">{String(activeStep + 1).padStart(2, '0')}</span>
                <p className="text-white text-[14px] md:text-[16px] font-black uppercase tracking-tight">{JOURNEY_STEPS[activeStep].title}</p>
              </div>
              <p className="text-white text-[15px] md:text-[20px] font-bold leading-snug mb-4 md:mb-5">{JOURNEY_STEPS[activeStep].hook}</p>
              <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#CCFF00] mb-2.5">Includes</p>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {JOURNEY_STEPS[activeStep].includes.map((item, i) => (
                  <span key={i} className="inline-block border border-white/15 bg-white/[0.03] text-white/85 text-[11px] md:text-[12px] px-2.5 py-1 leading-snug">
                    {item}
                  </span>
                ))}
              </div>
              {JOURNEY_STEPS[activeStep].note && (
                <p className="text-[#CCFF00] text-[12px] md:text-[13px] italic leading-relaxed mt-4">
                  {JOURNEY_STEPS[activeStep].note}
                </p>
              )}
            </div>
          </div>

          {/* Full Features */}
          <div id="features" className="mt-16 md:mt-24 pt-12 md:pt-16 border-t border-white/10 scroll-mt-20">
            <Reveal>
              <p className="text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#CCFF00] mb-5">Everything Included</p>
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-10 md:mb-16 leading-tight">The Full Features</h2>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  heading: 'Attract & Convert',
                  items: [
                    'Website Builder — Your business online, bookable 24/7',
                    'WhatsApp Auto-Reply — Every enquiry gets a response instantly',
                    'Lead Capture — Walk-ins logged at the counter, auto follow-up triggered',
                    'Free Trial Management — Prospects try, system converts',
                    'CRM Pipeline — Lead, Trial, Member, At Risk — all visible',
                  ],
                },
                {
                  heading: 'Run Your Operations',
                  items: [
                    'Face ID Entry — Members check in with their face, no cards needed',
                    'Auto Billing — Monthly or Annual fees collected automatically',
                    'Staff Check-In — Attendance and commissions tracked via Face ID',
                    'Booking & Scheduling — Classes, sessions, rooms, equipment — one system',
                    'Membership Management — Sign-ups, renewals, freezes, expiry — handled',
                  ],
                },
                {
                  heading: 'Engage Your Members',
                  items: [
                    'Member App — Book, track progress, view streaks, sync health data',
                    'Trainer App — Client roster, session notes, before/after photos, schedule',
                    'Loyalty & Rewards — Visit streaks, milestones, referral bonuses',
                    'Auto Marketing — Inactive nudges, birthday promos, renewal reminders',
                    'Push Notifications — Right message, right time, no manual work',
                  ],
                },
                {
                  heading: 'See Everything',
                  items: [
                    'AI Dashboard — Revenue, churn, attendance, staff performance — live',
                    'Member Health Score — Flag at-risk members before they cancel',
                    'Staff Performance — Who\'s delivering, who\'s not',
                    'Multi-Location Overview — Every branch, one screen',
                    'Business Reports — Export, analyse, decide',
                  ],
                },
              ].map((col, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div>
                    <h3 className="text-[14px] font-black uppercase tracking-wider text-[#CCFF00] mb-6 pb-3 border-b-2 border-[#CCFF00]">{col.heading}</h3>
                    <ul className="space-y-4">
                      {col.items.map((item, j) => {
                        const [title, desc] = item.split(' — ');
                        return (
                          <li key={j}>
                            <span className="text-white text-[14px] font-bold underline underline-offset-4 decoration-white/30">{title}</span>
                            {desc && <p className="text-white text-[13px] mt-1">{desc}</p>}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ═══ SENTRY MODE ═══ */}
      <SentrySection />

      {/* ═══ COMPARISON TABLE ═══ */}
      <section id="comparison" className="py-16 md:py-40 px-4 md:px-6 border-t border-white/10 relative overflow-hidden scroll-mt-20 bg-black text-white">
        <div className="absolute inset-0 opacity-100" style={{ backgroundImage: `radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
        <div className="max-w-4xl mx-auto relative z-10">
          <Reveal>
            <p className="text-[12px] font-mono font-bold uppercase tracking-[0.25em] text-[#CCFF00] mb-5">Honest Comparison</p>
            <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tight mb-6 leading-tight">
              Software-Only Platforms<br className="hidden sm:block" /> vs QFit
            </h2>
            <p className="text-white/100 text-[14px] md:text-[15px] leading-relaxed mb-10 md:mb-16 max-w-2xl">
              Most gym platforms sell you software and leave the rest to you. QFit is the full stack — hardware, software, marketing, and support in one box.
            </p>
          </Reveal>

          {/* Table — stacked cards on mobile, grid on desktop */}
          <div className="space-y-3 md:space-y-0 md:border md:border-white/10">
            {/* Header row — desktop only */}
            <div className="hidden md:grid grid-cols-[1fr_1fr_1fr] border-b border-white/10">
              <div className="p-5" />
              <div className="p-5 border-l border-white/10 text-center">
                <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">Typical Platform</span>
              </div>
              <div className="p-5 border-l border-[#CCFF00]/30 bg-[#CCFF00]/10 text-center">
                <span className="text-[11px] font-mono font-bold text-[#CCFF00] uppercase tracking-wider">QFit</span>
              </div>
            </div>

            {/* Rows */}
            {[
              { label: 'Entry System', them: 'Not integrated', us: 'Face ID — biometric, can\'t cheat' },
              { label: 'Hardware', them: 'Buy separately, integrate yourself', us: 'Pre-configured, installed by us' },
              { label: 'Marketing', them: 'Locked behind RM 1,500+/mo tier', us: 'Included in every plan' },
              { label: 'Real-time presence', them: 'No — only knows who booked', us: 'Yes — real-time Face ID log' },
              { label: 'Walk-in to member', them: '10+ min, needs staff', us: '90 seconds, self-service' },
              { label: 'Buddy pass sharing', them: 'Can\'t detect it', us: 'Physically impossible' },
              { label: 'Support', them: '3 vendors = 3 numbers', us: 'One number' },
            ].map((row, i) => (
              <Reveal key={i} delay={i * 0.04}>
                {/* Mobile: stacked card */}
                <div className="md:hidden border border-white/10 p-4">
                  <p className="text-[13px] font-bold text-white uppercase tracking-wide mb-3">{row.label}</p>
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-red-400 text-[11px] font-bold uppercase shrink-0 mt-0.5">Others:</span>
                    <span className="text-white text-[13px] leading-snug">{row.them}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#CCFF00] text-[11px] font-bold uppercase shrink-0 mt-0.5">QFit:</span>
                    <span className="text-[#CCFF00] text-[13px] leading-snug font-medium">{row.us}</span>
                  </div>
                </div>
                {/* Desktop: grid row */}
                <div className={`hidden md:grid grid-cols-[1fr_1fr_1fr] ${i % 2 === 0 ? 'bg-white/[0.03]' : ''} border-b border-white/5 last:border-b-0`}>
                  <div className="p-5 flex items-center">
                    <span className="text-[13px] font-bold text-white uppercase tracking-wide leading-snug">{row.label}</span>
                  </div>
                  <div className="p-5 border-l border-white/10 flex items-center">
                    <span className="text-[13px] text-white leading-relaxed">{row.them}</span>
                  </div>
                  <div className="p-5 border-l border-[#CCFF00]/20 bg-[#CCFF00]/5 flex items-center">
                    <span className="text-[13px] text-[#CCFF00] leading-relaxed font-medium">{row.us}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Price anchor */}
          <Reveal>
            <div className="mt-10 border border-white/10 bg-white/5 p-6 md:p-8 text-center relative overflow-hidden">
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white/20" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white/20" />
              <p className="text-white/100 text-[15px] md:text-[16px] leading-relaxed">
                Most gym platforms charge <span className="text-white font-bold">RM 500–2,500/month</span> and don't include hardware or marketing.
              </p>
              <p className="text-[#CCFF00] text-[16px] md:text-[18px] font-bold mt-2">
                QFit bundles hardware, software, and marketing into one plan.
              </p>
            </div>
          </Reveal>
        </div>
      </section>



      {/* ═══ ONE PRICING ═══ */}
      <QFitPricingSection />

      <QFitFooter />
    </div>
  );
}
