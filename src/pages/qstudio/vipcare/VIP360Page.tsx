// QStudio VIP360 — STUDIO's premium business-continuity care program.
//
// PRIVATE / UNLISTED. Lives under /qstudio/vipcare. Reachable at /vipcare and
// /qstudio/vipcare. Not linked from any nav or footer, carries noindex/nofollow,
// and is blocked in robots.txt + left OUT of scripts/prerender-meta.mjs — so no
// social card or crawler HTML is baked. Reachable only by typing the URL.
//
// Design: reuses the STUDIO design system verbatim — black canvas, #CCFF00 lime
// accent, Inter, font-black uppercase headings, mono eyebrows, border-2 cards,
// radial lime gradients, the Reveal + Shot components. It must read as if it was
// designed alongside the QStudio homepage. The story it sells is business
// continuity — zero downtime, peace of mind — not technical support.
//
// Imagery uses the Shot placeholder frame system: slots point at /vipcare/*.jpg.
// A handful reuse real hardware photography (turnstile, face-ID, AI CCTV); the
// rest degrade to a premium captioned placeholder until a render is dropped in
// at the same path — zero code change.

import { useState, useEffect, useRef, type ReactNode } from 'react';
import {
  ArrowRight, ChevronRight, ChevronDown, MessageCircle, Instagram, Check, Minus,
  Zap, Wrench, GraduationCap, ShieldCheck, Plus,
  Search, Wind, RefreshCw, Gauge, FileText,
  HardDrive, Cpu, ScanLine, Fence, Activity,
  Download, Database, Lock,
  Sparkles, Lightbulb, FileBarChart, TrendingUp, MessageCircleQuestion,
  Monitor, Cctv, Server, HardHat,
  AlertOctagon, AlertTriangle, AlertCircle, CalendarClock,
  type LucideIcon,
} from 'lucide-react';
import SEOHead from '../../../components/SEOHead';

// ────────────────────────────────────────────────────────────────
// CONSTANTS
// ────────────────────────────────────────────────────────────────
const WA_UPGRADE = 'https://wa.me/60126909189?text=' + encodeURIComponent(
  "Hi, I'd like to upgrade to VIP360 for my STUDIO system. Please tell me about the plans."
);
const WA_SALES = 'https://wa.me/60126909189?text=' + encodeURIComponent(
  "Hi! I'd like to talk to sales about VIP360 business continuity.\n- Business type:\n- Number of outlets / devices:\n- What matters most (uptime / preventive care / priority support / on-site):\n\nThanks!"
);

// Image registry — /vipcare/* slots to generate; a few reuse real hardware shots.
const IMG = {
  pos:      '/vipcare/care-pos.jpg',                    // engineer servicing a POS terminal
  kiosk:    '/vipcare/care-kiosk.jpg',                  // engineer inspecting a self-service kiosk
  turnstile:'/qsecurity/qsc__0001_guard-turnstile.jpg',// real: speed-gate turnstiles in a lobby
  camera:   '/qsecurity/sentry-cctv.jpg',              // real: AI CCTV dashboard, detection boxes
  faceid:   '/qsecurity/qsc__0000_faceid.jpg',         // real: walk-through face-ID terminal
  server:   '/vipcare/care-server.jpg',                // engineer at a server / network rack
  engineer: '/vipcare/care-engineer.jpg',              // certified engineer, on-site
};

// ────────────────────────────────────────────────────────────────
// WHY VIP360 — four pillars
// ────────────────────────────────────────────────────────────────
const WHY: { Icon: LucideIcon; tag: string; title: string; body: string }[] = [
  { Icon: Zap,          tag: 'Fast',       title: 'Fast', body: 'Priority response when your business needs us most. Your queue jumps to the front — SLA-backed, in writing.' },
  { Icon: Wrench,       tag: 'Preventive', title: 'Preventive', body: 'We catch and fix problems before they interrupt a single sale. Scheduled visits, not emergency call-outs.' },
  { Icon: GraduationCap,tag: 'Expert',     title: 'Expert', body: 'Certified STUDIO engineers keeping your hardware and software performing at their best, every visit.' },
  { Icon: ShieldCheck,  tag: 'Reliable',   title: 'Reliable', body: 'Complete protection across your hardware, software and operations — one program, one point of contact.' },
];

// ────────────────────────────────────────────────────────────────
// EVERY VISIT MATTERS — six-step service timeline
// ────────────────────────────────────────────────────────────────
const TIMELINE: { num: string; Icon: LucideIcon; title: string; body: string }[] = [
  { num: '01', Icon: Search,        title: 'Inspect',  body: 'Complete hardware inspection, top to bottom.' },
  { num: '02', Icon: Wind,          title: 'Clean',    body: 'Internal cleaning and preventive housekeeping.' },
  { num: '03', Icon: RefreshCw,     title: 'Update',   body: 'Latest software, firmware and security patches.' },
  { num: '04', Icon: Gauge,         title: 'Optimise', body: 'Database optimisation and performance tuning.' },
  { num: '05', Icon: GraduationCap, title: 'Train',    body: 'Staff refresher training and feature walkthrough.' },
  { num: '06', Icon: FileText,      title: 'Report',   body: 'Receive your VIP360 Health Report.' },
];

// ────────────────────────────────────────────────────────────────
// WHAT'S INCLUDED — three care cards with checklists
// ────────────────────────────────────────────────────────────────
const INCLUDED: { Icon: LucideIcon; title: string; blurb: string; items: string[] }[] = [
  {
    Icon: HardDrive, title: 'Hardware Care',
    blurb: 'Every device on your floor, kept in peak condition.',
    items: [
      'Hardware inspection', 'Internal cleaning', 'Printer servicing', 'Scanner calibration',
      'NFC reader testing', 'Turnstile inspection', 'Power supply testing', 'Network cable inspection',
      'UPS inspection', 'Device diagnostics',
    ],
  },
  {
    Icon: Cpu, title: 'Software Care',
    blurb: 'Your STUDIO software current, tuned and secure.',
    items: [
      'Latest STUDIO update', 'Firmware update', 'Security patches', 'Database optimisation',
      'Backup verification', 'Storage health', 'Configuration review', 'Performance tuning',
      'Security review',
    ],
  },
  {
    Icon: GraduationCap, title: 'Business Care',
    blurb: 'Your team sharp, your workflows optimised.',
    items: [
      'Staff refresher training', 'New feature walkthrough', 'Best practice consultation',
      'Workflow optimisation', 'System Health Report', 'Performance recommendations', 'Q&A session',
    ],
  },
];

// ────────────────────────────────────────────────────────────────
// HEALTH REPORT — dashboard mockup data
// ────────────────────────────────────────────────────────────────
const HEALTH_TILES: { Icon: LucideIcon; label: string; value: string; good: boolean }[] = [
  { Icon: Cpu,       label: 'Hardware',    value: 'PASS',      good: true },
  { Icon: Download,  label: 'Software',    value: 'PASS',      good: true },
  { Icon: Lock,      label: 'Security',    value: 'PASS',      good: true },
  { Icon: Gauge,     label: 'Performance', value: 'Excellent', good: true },
  { Icon: Database,  label: 'Database',    value: 'Optimised', good: true },
  { Icon: HardDrive, label: 'Storage',     value: '82%',       good: true },
];
const HEALTH_RECS = ['Replace printer roller', 'Increase backup frequency', 'Update user permissions'];

// ────────────────────────────────────────────────────────────────
// EQUIPMENT WE PROTECT — framed strip
// ────────────────────────────────────────────────────────────────
const EQUIPMENT: { Icon: LucideIcon; label: string; src?: string }[] = [
  { Icon: Monitor,  label: 'POS terminals',       src: IMG.pos },
  { Icon: ScanLine, label: 'Self-service kiosks',  src: IMG.kiosk },
  { Icon: Fence,    label: 'Turnstiles & gates',   src: IMG.turnstile },
  { Icon: Cctv,     label: 'AI cameras',           src: IMG.camera },
  { Icon: Server,   label: 'Servers & network',    src: IMG.server },
  { Icon: HardHat,  label: 'On-site engineers',    src: IMG.engineer },
];

// ────────────────────────────────────────────────────────────────
// SERVICE PACKAGES — pricing (Cost / Warranty / P4 Preventive / P3–P1 Repair)
// ────────────────────────────────────────────────────────────────
type Pkg = {
  name: string; cost: string; warranty: string; preventive: string;
  repair?: { minor: string; major: string; critical: string };
  included?: string; highlight?: boolean;
};
const PACKAGES: Pkg[] = [
  { name: 'Standard', cost: 'Inclusive',               warranty: 'Self-send to factory',              preventive: 'RM600',       repair: { minor: 'RM600', major: 'RM800', critical: 'RM1,200' } },
  { name: 'VIP360',   cost: 'RM300 + RM40 / device', warranty: 'Free door-to-door pickup & return', preventive: 'FOC 2 times', included: '1 included' },
  { name: 'VIP360+',  cost: 'RM450 + RM40 / device', warranty: 'Free door-to-door pickup & return', preventive: 'FOC 4 times', included: '2 included', highlight: true },
];

// ────────────────────────────────────────────────────────────────
// SLA MATRIX — priority × Standard vs VIP360 (response / update / resolution)
// ────────────────────────────────────────────────────────────────
type SlaLevel = { response: string; update: string; resolution: string };
const SLA_MATRIX: { code: string; Icon: LucideIcon; title: string; example: string; std: SlaLevel; vip: SlaLevel }[] = [
  {
    code: 'P1', Icon: AlertOctagon, title: 'Critical',
    example: 'System completely down — unable to process sales, memberships or gate access.',
    std: { response: '2 Hours', update: 'Immediate', resolution: 'Same Day' },
    vip: { response: '30 Minutes', update: 'Immediate', resolution: '4 Hours' },
  },
  {
    code: 'P2', Icon: AlertTriangle, title: 'Major',
    example: 'A major function is impaired but the system remains substantially operable.',
    std: { response: '4 Hours', update: '4 Hours', resolution: 'Next Business Day' },
    vip: { response: '2 Hours', update: '2 Hours', resolution: 'Next Business Day' },
  },
  {
    code: 'P3', Icon: AlertCircle, title: 'Minor',
    example: 'A minor function is affected with limited operational impact.',
    std: { response: '8 Hours', update: '8 Hours', resolution: '3 Business Days' },
    vip: { response: '4 Hours', update: '4 Hours', resolution: '3 Business Days' },
  },
  {
    code: 'P4', Icon: CalendarClock, title: 'Preventive',
    example: 'Preventive maintenance on hardware and software, housekeeping and patch / firmware updates (if required).',
    std: { response: 'Next Business Day', update: 'Scheduled', resolution: '< 5 Business Days / Next Release' },
    vip: { response: 'Next Business Day', update: 'Scheduled', resolution: '< 5 Business Days / Next Release' },
  },
];

// ────────────────────────────────────────────────────────────────
// PLAN FEATURES — only what the package / SLA tables don't already cover
// ────────────────────────────────────────────────────────────────
const PLAN_ROWS: { feature: string; standard: string; vip: string; vipPlus: string }[] = [
  { feature: 'Priority Remote Support', standard: 'Standard',   vip: 'Priority', vipPlus: 'Highest priority' },
  { feature: 'Software Updates',        standard: 'Included',    vip: 'Priority', vipPlus: 'Priority' },
  { feature: 'Firmware Updates',        standard: 'Included',    vip: 'Included', vipPlus: 'Included' },
  { feature: 'System Health Report',    standard: '—',          vip: 'Included', vipPlus: 'Included' },
  { feature: 'Staff Refresher Training',standard: 'Chargeable',  vip: 'Included', vipPlus: 'Included' },
  { feature: 'Hardware Housekeeping',   standard: 'Chargeable',  vip: 'Included', vipPlus: 'Included' },
  { feature: 'Performance Optimisation',standard: 'Chargeable',  vip: 'Included', vipPlus: 'Included' },
];

// ────────────────────────────────────────────────────────────────
// WHY BUSINESSES LOVE VIP360
// ────────────────────────────────────────────────────────────────
const LOVE: { Icon: LucideIcon; text: string }[] = [
  { Icon: ShieldCheck,   text: 'Prevent unexpected downtime' },
  { Icon: TrendingUp,    text: 'Extend hardware lifespan' },
  { Icon: Zap,           text: 'Faster emergency response' },
  { Icon: Wrench,        text: 'Regular engineer visits' },
  { Icon: FileBarChart,  text: 'Reduce repair costs' },
  { Icon: GraduationCap, text: 'Keep staff trained' },
  { Icon: RefreshCw,     text: 'Always up-to-date software' },
  { Icon: Lock,          text: 'Better security' },
  { Icon: Sparkles,      text: 'Peace of mind' },
];

// ────────────────────────────────────────────────────────────────
// FAQ
// ────────────────────────────────────────────────────────────────
const FAQ: { q: string; a: string }[] = [
  {
    q: 'What is included in preventive maintenance?',
    a: 'Every preventive visit runs the full VIP360 cycle — hardware inspection and internal cleaning, printer, scanner and NFC checks, the latest STUDIO software, firmware and security patches, database optimisation and performance tuning, backup verification, plus staff refresher training. It ends with your VIP360 Health Report.',
  },
  {
    q: 'How often will engineers visit?',
    a: 'VIP360 includes 2 scheduled preventive maintenance visits per year; VIP360+ includes 4. Visits are booked ahead around your quietest hours so nothing interrupts trading. Emergency on-site support is separate and covered under your SLA.',
  },
  {
    q: 'Is emergency on-site support included?',
    a: 'Yes. VIP360 includes 1 emergency on-site visit per year and VIP360+ includes 2, on top of priority remote support. Critical (P1) issues get a 30-minute response and a 4-hour resolution target under VIP360.',
  },
  {
    q: 'Can I upgrade anytime?',
    a: 'Anytime. Move from Standard to VIP360, or VIP360 to VIP360+, whenever you like — the new priority response, preventive visits and coverage apply from activation. No re-onboarding, no downtime.',
  },
  {
    q: 'Does VIP360 cover hardware warranty?',
    a: 'VIP360 and VIP360+ upgrade your hardware warranty to door-to-door collection — we come to you, collect the device, and return it serviced. Standard cover requires you to self-send units to the service centre.',
  },
];

// ────────────────────────────────────────────────────────────────
// UTILITIES — Reveal (IntersectionObserver fade-up)
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
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>
      {children}
    </div>
  );
}

// Image frame. Renders the real photo when `src` loads; otherwise a premium
// lime-framed placeholder — so not-yet-generated renders look intentional. Drop
// a JPG at the same path later and it appears, no code change.
function Shot({ Icon, label, src, ratio = 'aspect-video', className = '' }: { Icon: LucideIcon; label: string; src?: string; ratio?: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (src && !failed) {
    return (
      <div className={`relative w-full overflow-hidden bg-black ${ratio} ${className}`}>
        <img src={src} alt={label} loading="lazy" onError={() => setFailed(true)} className="absolute inset-0 w-full h-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
        <div aria-hidden="true" className="absolute inset-0 ring-1 ring-inset ring-[#CCFF00]/15" />
      </div>
    );
  }
  return (
    <div className={`relative w-full overflow-hidden bg-gradient-to-br from-[#141a06] via-[#0a0d02] to-black ${ratio} ${className}`}>
      <Icon aria-hidden="true" strokeWidth={1} className="absolute -right-5 -bottom-5 text-[#CCFF00]/[0.06]" size={190} />
      <div aria-hidden="true" className="absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(rgba(204,255,0,0.05) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
      <div aria-hidden="true" className="absolute inset-0 ring-1 ring-inset ring-[#CCFF00]/10" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center gap-2.5 px-5 text-center">
        <div className="w-12 h-12 border border-[#CCFF00]/40 bg-[#CCFF00]/10 flex items-center justify-center">
          <Icon size={20} strokeWidth={1.75} className="text-[#CCFF00]" />
        </div>
        <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#CCFF00]/80 max-w-[26ch] leading-snug">{label}</span>
        <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/25">Image · to generate</span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// HEADER
// ────────────────────────────────────────────────────────────────
const ANNOUNCEMENTS = [
  'Preventive maintenance — before problems ever interrupt your business.',
  'Priority response. Door-to-door hardware care. Zero downtime.',
  'The premium care program for your STUDIO systems.',
];

const NAV_ITEMS = [
  { label: 'Why VIP360',  href: '#why' },
  { label: 'Every visit', href: '#timeline' },
  { label: 'Plans',       href: '#plans' },
  { label: 'SLA',         href: '#sla' },
  { label: 'FAQ',         href: '#faq' },
];

function VIPHeader() {
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
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50" role="banner">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-[#CCFF00] focus:text-black focus:px-3 focus:py-1.5 focus:text-[11px] focus:font-bold focus:uppercase">
        Skip to content
      </a>

      <div className="bg-[#111] text-white hidden lg:block">
        <div className="container mx-auto px-4 md:px-6 lg:px-12 py-1.5 flex items-center justify-between">
          <div className="flex items-center divide-x divide-gray-300 text-[10px] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 pr-4 text-gray-400">
              <ShieldCheck size={10} strokeWidth={2.5} className="text-[#CCFF00]" />
              VIP360 · Premium Care
            </span>
            <span className="px-4 text-gray-400">Mon–Fri · 10AM–7PM</span>
            <span className={`pl-4 text-[#CCFF00] transition-opacity duration-300 ${annFade ? 'opacity-100' : 'opacity-0'}`}>
              {ANNOUNCEMENTS[annIdx]}
            </span>
          </div>
          <div className="flex items-center gap-4 divide-x divide-gray-600">
            <a href={WA_SALES} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors">
              <MessageCircle size={10} strokeWidth={2.5} />
              +6012-6909-189
            </a>
            <a href="/qstudio" className="pl-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#CCFF00] hover:text-white transition-colors">
              Back to STUDIO <ArrowRight size={10} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </div>

      <nav className={`transition-all duration-300 bg-black/90 backdrop-blur-xl backdrop-saturate-150 border-b border-white/10 ${scrolled ? 'shadow-sm' : ''}`} aria-label="Primary">
        <div className="container mx-auto px-4 md:px-6 lg:px-12 py-3 md:py-4">
          <div className="flex items-center">
            <a href="/qstudio" className="flex items-center gap-2 group mr-8" aria-label="STUDIO home">
              <img src="/qbotlogo.svg" alt="STUDIO logo" className="w-9 h-9 md:w-10 md:h-10 brightness-0 invert" />
              <span className="text-white text-[16px] md:text-[18px] font-black uppercase tracking-[0.15em] leading-none">STUDIO</span>
              <span className="inline-flex items-center bg-[#CCFF00] text-black text-[10px] md:text-[11px] font-black uppercase tracking-[0.12em] px-1.5 py-0.5 leading-none">VIP360</span>
            </a>

            <div className="hidden lg:flex items-center space-x-7 xl:space-x-9">
              {NAV_ITEMS.map(item => (
                <a key={item.label} href={item.href} className="text-[11px] font-bold tracking-[0.1em] uppercase text-white hover:text-[#CCFF00] transition-colors duration-200">
                  {item.label}
                </a>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-5 ml-auto">
              <a href={WA_UPGRADE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-[#CCFF00] hover:bg-white text-black text-[11px] font-bold uppercase tracking-wider transition-colors">
                <ShieldCheck size={14} strokeWidth={2} /> Upgrade to VIP360 <ChevronRight size={14} strokeWidth={2.5} />
              </a>
            </div>

            <div className="lg:hidden flex items-center ml-auto gap-2">
              <a href={WA_UPGRADE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#CCFF00] text-black text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck size={12} strokeWidth={2} /> Upgrade
              </a>
              <button onClick={() => setMobileMenu(p => !p)} className="w-11 h-11 inline-flex items-center justify-center text-white" aria-label="Toggle menu" aria-expanded={mobileMenu}>
                {mobileMenu ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
                )}
              </button>
            </div>
          </div>

          {mobileMenu && (
            <div className="lg:hidden border-t border-white/10 py-3 flex flex-col gap-1">
              {[...NAV_ITEMS, { label: 'Upgrade to VIP360', href: WA_UPGRADE }, { label: 'Back to STUDIO', href: '/qstudio' }].map(item => (
                <a key={item.label} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  onClick={() => setMobileMenu(false)}
                  className="text-[13px] font-bold uppercase tracking-wider text-white hover:text-[#CCFF00] min-h-[44px] py-3 px-2 flex items-center transition-colors">
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
function VIPFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="relative bg-black text-white border-t border-white/10" role="contentinfo">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <img src="/qbotlogo.svg" alt="QBot logo" className="w-11 h-11 brightness-0 invert" />
              <span className="inline-flex items-center bg-[#CCFF00] text-black text-[10px] font-black uppercase tracking-[0.12em] px-1.5 py-0.5 leading-none">VIP360</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-wide mb-1.5">Complete protection. Complete peace of mind.</p>
            <p className="text-[11px] text-gray-400 leading-relaxed mb-5">STUDIO's premium business-continuity program — preventive care, priority support and on-site assistance that keep your operations running.</p>
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/qbotmalaysia" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-500 hover:text-[#CCFF00] transition-colors"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
              <a href="https://www.instagram.com/qbotfuture" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-500 hover:text-[#CCFF00] transition-colors"><Instagram size={16} strokeWidth={2} /></a>
              <a href="https://www.tiktok.com/@qbotfuture" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-gray-500 hover:text-[#CCFF00] transition-colors"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg></a>
            </div>
          </div>

          <div>
            <p className="text-[10px] text-[#CCFF00] font-bold uppercase tracking-[0.15em] mb-3">VIP360</p>
            <ul className="space-y-1.5">
              {[
                { label: 'Why VIP360',     href: '#why' },
                { label: 'Every visit',    href: '#timeline' },
                { label: "What's included",href: '#included' },
                { label: 'Health Report',  href: '#health' },
                { label: 'Choose a plan',  href: '#plans' },
                { label: 'Support SLA',    href: '#sla' },
                { label: 'FAQ',            href: '#faq' },
              ].map(item => (
                <li key={item.label}><a href={item.href} className="text-[12px] text-gray-400 hover:text-white transition-colors block py-1 min-h-[32px]">{item.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] text-[#CCFF00] font-bold uppercase tracking-[0.15em] mb-3">Coverage</p>
            <ul className="space-y-1.5 mb-6">
              <li><a href="#included" className="text-[12px] text-gray-400 hover:text-white transition-colors">Hardware Care</a></li>
              <li><a href="#included" className="text-[12px] text-gray-400 hover:text-white transition-colors">Software Care</a></li>
              <li><a href="#included" className="text-[12px] text-gray-400 hover:text-white transition-colors">Business Care</a></li>
            </ul>
            <p className="text-[10px] text-white font-bold uppercase tracking-[0.15em] mb-3">Also by QBot</p>
            <ul className="space-y-1.5">
              <li><a href="/qstudio" className="text-[12px] text-gray-400 hover:text-white transition-colors">STUDIO — Membership OS</a></li>
              <li><a href="/" className="text-[12px] text-gray-400 hover:text-white transition-colors">QPOS — F&amp;B / Retail POS</a></li>
            </ul>
          </div>

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
                <a href={WA_SALES} target="_blank" rel="noopener noreferrer" className="text-[12px] text-gray-400 hover:text-white transition-colors">+6012-6909-189</a>
              </div>
              <p className="text-[10px] text-gray-400 pl-[26px]">Mon–Fri · 10AM–7PM</p>
              <a href={WA_UPGRADE} target="_blank" rel="noopener noreferrer"
                className="inline-block bg-[#CCFF00] hover:bg-white text-black text-[10px] font-bold uppercase tracking-wider px-5 py-2.5 transition-colors">
                Upgrade to VIP360
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-[11px] text-gray-500">
          <p>&copy; {currentYear} QBot — VIP360 is the premium care program for STUDIO, part of the QBot product family.</p>
        </div>
      </div>
    </footer>
  );
}

// ────────────────────────────────────────────────────────────────
// HERO — badge, headline, 360 rings, orbiting equipment
// ────────────────────────────────────────────────────────────────
const ORBIT: { Icon: LucideIcon; label: string }[] = [
  { Icon: Monitor,  label: 'POS' },
  { Icon: ScanLine, label: 'Kiosk' },
  { Icon: Fence,    label: 'Turnstile' },
  { Icon: Cctv,     label: 'AI Camera' },
  { Icon: Server,   label: 'Server' },
];

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black pt-28 md:pt-32 pb-16 md:pb-20 px-4 md:px-6">
      {/* Ambient lime gradients */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 78% 32%, rgba(204,255,0,0.14) 0%, transparent 48%), radial-gradient(circle at 12% 78%, rgba(204,255,0,0.07) 0%, transparent 45%)' }} />
      <div aria-hidden="true" className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(rgba(204,255,0,0.06) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      <div className="relative z-10 max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 border border-[#CCFF00]/40 bg-[#CCFF00]/[0.06] px-3 py-1.5 mb-6">
            <ShieldCheck size={13} strokeWidth={2.5} className="text-[#CCFF00]" />
            <span className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.28em] text-[#CCFF00]">Premium Care Program</span>
          </div>

          <h1 className="text-white font-black uppercase tracking-tight leading-[1.02] text-[38px] sm:text-[52px] md:text-[62px] lg:text-[64px]">
            Your Business<br className="hidden sm:block" /> Never Stops.<br />
            <span className="text-[#CCFF00]">Neither Do We.</span>
          </h1>

          <p className="text-gray-300 text-[14px] md:text-[16px] leading-relaxed max-w-xl mx-auto lg:mx-0 mt-6 md:mt-7">
            VIP360 is STUDIO's premium business-continuity program, designed to keep your operations running smoothly. From preventive maintenance and software updates to priority support and emergency on-site assistance — VIP360 protects your business <span className="text-white font-semibold">before problems happen</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 mt-8 md:mt-10">
            <a href={WA_UPGRADE} target="_blank" rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#CCFF00] hover:bg-white text-black text-[13px] md:text-[14px] font-black uppercase tracking-wider transition-colors">
              <ShieldCheck size={16} strokeWidth={2.5} /> Upgrade to VIP360 <ArrowRight size={15} strokeWidth={2.5} />
            </a>
            <a href="#plans"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 border-2 border-[#CCFF00]/40 hover:border-[#CCFF00] hover:bg-[#CCFF00]/10 text-white hover:text-[#CCFF00] text-[12px] md:text-[13px] font-bold uppercase tracking-wider transition-colors">
              Compare plans
            </a>
          </div>

          <p className="text-white/40 text-[10px] md:text-[11px] font-mono uppercase tracking-[0.22em] mt-7">
            Trusted by businesses across Malaysia · SLA-backed
          </p>
        </div>

        {/* 360 rings + orbiting equipment */}
        <div aria-hidden="true" className="relative mx-auto w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] lg:w-[440px] lg:h-[440px]">
          {/* concentric rings */}
          <div className="absolute inset-0 rounded-full border border-[#CCFF00]/10 vip-spin-slow" />
          <div className="absolute inset-[10%] rounded-full border border-dashed border-[#CCFF00]/25 vip-spin-rev" />
          <div className="absolute inset-[22%] rounded-full border border-[#CCFF00]/15 vip-spin-slow" />
          <div className="absolute inset-[6%] rounded-full" style={{ background: 'radial-gradient(circle, rgba(204,255,0,0.10) 0%, transparent 62%)' }} />

          {/* orbiting equipment chips */}
          {ORBIT.map(({ Icon, label }, i) => {
            const angle = (i / ORBIT.length) * Math.PI * 2 - Math.PI / 2;
            const r = 46; // % of half-size
            const x = 50 + Math.cos(angle) * r;
            const y = 50 + Math.sin(angle) * r;
            return (
              <div key={label} className="absolute -translate-x-1/2 -translate-y-1/2 vip-float" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.4}s` }}>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-[#CCFF00]/50 bg-black/80 backdrop-blur-sm flex items-center justify-center shadow-[0_0_20px_rgba(204,255,0,0.18)]">
                    <Icon size={20} strokeWidth={2} className="text-[#CCFF00]" />
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider text-white/60">{label}</span>
                </div>
              </div>
            );
          })}

          {/* center badge */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full border-2 border-[#CCFF00] bg-black flex flex-col items-center justify-center text-center shadow-[0_0_40px_rgba(204,255,0,0.3)] vip-pulse-soft">
              <span className="text-[#CCFF00] font-black text-[34px] sm:text-[40px] lg:text-[44px] leading-none tracking-tight">360°</span>
              <span className="text-white/70 text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-[0.25em] mt-1">Protection</span>
            </div>
          </div>
        </div>
      </div>

      <a href="#why" aria-label="Scroll down" className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 hover:text-[#CCFF00] transition-colors flex-col items-center gap-1">
        <span className="text-[9px] font-mono uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown size={16} strokeWidth={2} className="animate-bounce" />
      </a>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// WHY VIP360
// ────────────────────────────────────────────────────────────────
function WhySection() {
  return (
    <section id="why" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(204,255,0,0.08) 0%, transparent 55%)' }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal className="text-center">
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#CCFF00] mb-4">Why VIP360</p>
          <h2 className="text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 leading-[1.05]">
            More than support. <span className="text-[#CCFF00]">Complete protection.</span>
          </h2>
          <p className="text-gray-300 text-[13px] md:text-[15px] leading-relaxed max-w-2xl mx-auto mb-10 md:mb-14">
            A complete maintenance and business-protection service — engineered so downtime never gets the chance to reach your customers.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {WHY.map(({ Icon, tag, title, body }, i) => (
            <Reveal key={title} delay={i * 0.07}>
              <article className="group border-2 border-white/15 hover:border-[#CCFF00]/60 bg-white/[0.02] p-6 md:p-7 h-full transition-colors relative">
                <div className="absolute top-4 right-4 font-mono text-[10px] font-black uppercase tracking-widest text-[#CCFF00]/50 group-hover:text-[#CCFF00] transition-colors">{tag}</div>
                <div className="w-12 h-12 md:w-14 md:h-14 border-2 border-[#CCFF00]/40 bg-[#CCFF00]/10 flex items-center justify-center mb-5 md:mb-6">
                  <Icon size={22} strokeWidth={2} className="text-[#CCFF00]" />
                </div>
                <h3 className="text-white text-[18px] md:text-[20px] font-black uppercase tracking-tight leading-tight mb-2.5">{title}</h3>
                <p className="text-gray-300 text-[13px] md:text-[14px] leading-relaxed">{body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// EVERY VISIT MATTERS — timeline
// ────────────────────────────────────────────────────────────────
function TimelineSection() {
  return (
    <section id="timeline" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 80% 20%, rgba(204,255,0,0.09) 0%, transparent 55%)' }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal className="text-center">
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#CCFF00] mb-4">Every visit matters</p>
          <h2 className="text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 leading-[1.05]">
            Six steps. <span className="text-[#CCFF00]">Every single visit.</span>
          </h2>
          <p className="text-gray-300 text-[13px] md:text-[15px] leading-relaxed max-w-2xl mx-auto mb-12 md:mb-16">
            Not a quick look-over. Every VIP360 visit runs the same disciplined cycle — so nothing gets skipped and nothing gets missed.
          </p>
        </Reveal>

        <div className="relative">
          {/* connecting line — desktop */}
          <div aria-hidden="true" className="hidden md:block absolute top-8 left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-[#CCFF00]/40 to-transparent" />
          <ol className="grid grid-cols-2 md:grid-cols-6 gap-x-4 gap-y-10 md:gap-3">
            {TIMELINE.map(({ num, Icon, title, body }, i) => (
              <Reveal key={num} delay={i * 0.08}>
                <li className="flex flex-col items-center text-center">
                  <div className="relative z-10 w-16 h-16 border-2 border-[#CCFF00]/40 bg-black flex items-center justify-center text-[#CCFF00] transition-colors hover:border-[#CCFF00] hover:bg-[#CCFF00]/10">
                    <Icon size={24} strokeWidth={2} />
                  </div>
                  <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#CCFF00] mt-3">Step {num}</span>
                  <h3 className="text-white text-[15px] md:text-[16px] font-black uppercase tracking-tight mt-1">{title}</h3>
                  <p className="text-gray-400 text-[12px] md:text-[13px] leading-snug mt-1.5 max-w-[22ch]">{body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// WHAT'S INCLUDED — three care cards
// ────────────────────────────────────────────────────────────────
function IncludedSection() {
  return (
    <section id="included" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center">
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#CCFF00] mb-4">What's included every visit</p>
          <h2 className="text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 leading-[1.05]">
            Three layers of care. <span className="text-[#CCFF00]">One program.</span>
          </h2>
          <p className="text-gray-300 text-[13px] md:text-[15px] leading-relaxed max-w-2xl mx-auto mb-10 md:mb-14">
            Hardware, software and business — every VIP360 visit covers all three, so nothing about your operation is left to chance.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {INCLUDED.map(({ Icon, title, blurb, items }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <article className="border-2 border-white/15 hover:border-[#CCFF00]/60 bg-white/[0.02] p-6 md:p-7 h-full flex flex-col transition-colors">
                <div className="w-12 h-12 md:w-14 md:h-14 border-2 border-[#CCFF00]/40 bg-[#CCFF00]/10 flex items-center justify-center mb-5">
                  <Icon size={22} strokeWidth={2} className="text-[#CCFF00]" />
                </div>
                <h3 className="text-white text-[18px] md:text-[20px] font-black uppercase tracking-tight leading-tight mb-1.5">{title}</h3>
                <p className="text-[#CCFF00]/90 text-[12px] md:text-[13px] font-mono italic mb-5">{blurb}</p>
                <ul className="space-y-2 mt-auto">
                  {items.map(it => (
                    <li key={it} className="flex items-start gap-2.5 text-gray-300 text-[13px] md:text-[14px]">
                      <Check size={15} strokeWidth={3} className="text-[#CCFF00] flex-shrink-0 mt-0.5" />
                      {it}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Equipment we protect */}
        <Reveal delay={0.1}>
          <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-white/40 mt-14 md:mt-20 mb-5 text-center">The equipment we protect</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {EQUIPMENT.map(({ Icon, label, src }) => (
              <article key={label} className="group border-2 border-white/15 hover:border-[#CCFF00]/60 bg-white/[0.02] overflow-hidden transition-colors">
                <Shot Icon={Icon} label={label} src={src} ratio="aspect-[4/3]" />
                <div className="flex items-center gap-2 px-3 py-2.5">
                  <Icon size={14} strokeWidth={2} className="text-[#CCFF00] flex-shrink-0" />
                  <span className="text-white text-[11px] md:text-[12px] font-bold uppercase tracking-tight leading-tight">{label}</span>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// HEALTH REPORT — Apple-Health style dashboard mockup
// ────────────────────────────────────────────────────────────────
function HealthReportSection() {
  const { ref, visible } = useReveal(0.2);
  const pct = 96;
  const R = 78;
  const C = 2 * Math.PI * R;
  const offset = C * (1 - pct / 100);

  return (
    <section id="health" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 20% 40%, rgba(204,255,0,0.08) 0%, transparent 55%)' }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal className="text-center">
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#CCFF00] mb-4">VIP360 Health Report</p>
          <h2 className="text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 leading-[1.05]">
            Know your system's health. <span className="text-[#CCFF00]">At a glance.</span>
          </h2>
          <p className="text-gray-300 text-[13px] md:text-[15px] leading-relaxed max-w-2xl mx-auto mb-10 md:mb-14">
            Every preventive visit concludes with a detailed VIP360 Health Report — with clear recommendations to improve reliability, security and performance.
          </p>
        </Reveal>

        {/* Dashboard card */}
        <Reveal>
          <div ref={ref} className="border-2 border-[#CCFF00]/30 bg-gradient-to-b from-white/[0.04] to-transparent overflow-hidden">
            {/* header bar */}
            <div className="flex items-center gap-3 px-5 md:px-8 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="w-9 h-9 border-2 border-[#CCFF00]/50 bg-[#CCFF00]/10 flex items-center justify-center">
                <Activity size={16} strokeWidth={2.5} className="text-[#CCFF00]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-white/50">System Health Report</p>
                <h3 className="text-white text-[15px] md:text-[17px] font-black uppercase tracking-tight leading-tight">VIP360 · Preventive Visit</h3>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 border border-[#CCFF00]/40 bg-[#CCFF00]/10 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#CCFF00]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] vip-blink" /> All systems healthy
              </span>
            </div>

            <div className="grid lg:grid-cols-[auto_1fr] gap-8 lg:gap-10 p-6 md:p-8 lg:p-10">
              {/* Overall ring */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-[200px] h-[200px] md:w-[220px] md:h-[220px]">
                  <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                    <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />
                    <circle
                      cx="100" cy="100" r={R} fill="none" stroke="#CCFF00" strokeWidth="14" strokeLinecap="round"
                      strokeDasharray={C}
                      strokeDashoffset={visible ? offset : C}
                      style={{ transition: 'stroke-dashoffset 1.6s cubic-bezier(0.16,1,0.3,1)', filter: 'drop-shadow(0 0 8px rgba(204,255,0,0.5))' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-white font-black text-[52px] md:text-[58px] leading-none tracking-tight">{pct}<span className="text-[#CCFF00] text-[28px] align-top">%</span></span>
                    <span className="text-white/50 text-[9px] font-mono font-bold uppercase tracking-[0.25em] mt-1">Overall Health</span>
                  </div>
                </div>
                <p className="text-[#CCFF00] text-[11px] font-mono font-bold uppercase tracking-[0.2em] mt-4">Excellent condition</p>
              </div>

              {/* Tiles + recommendations */}
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {HEALTH_TILES.map(({ Icon, label, value }) => (
                    <div key={label} className="border border-white/12 bg-white/[0.03] p-3.5 md:p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon size={14} strokeWidth={2} className="text-[#CCFF00]" />
                        <span className="text-white/50 text-[10px] font-mono font-bold uppercase tracking-wider">{label}</span>
                      </div>
                      <p className="text-white text-[16px] md:text-[18px] font-black uppercase tracking-tight leading-none">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="border border-[#CCFF00]/25 bg-[#CCFF00]/[0.04] p-4 md:p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb size={15} strokeWidth={2.5} className="text-[#CCFF00]" />
                    <span className="text-[#CCFF00] text-[10px] font-mono font-bold uppercase tracking-[0.2em]">Recommendations</span>
                  </div>
                  <ul className="space-y-2">
                    {HEALTH_RECS.map(r => (
                      <li key={r} className="flex items-start gap-2.5 text-gray-200 text-[13px] md:text-[14px]">
                        <ArrowRight size={14} strokeWidth={2.5} className="text-[#CCFF00] flex-shrink-0 mt-0.5" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-gray-400 text-[12px] md:text-[13px] italic text-center mt-8 md:mt-10 max-w-2xl mx-auto">
            Every preventive maintenance visit ends with a report like this — the evidence your systems are healthy, and the plan to keep them that way.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// PLANS — feature comparison (package pricing table removed per request)
// ────────────────────────────────────────────────────────────────
function planCell(value: string, highlight = false) {
  if (value === '—') return <Minus size={16} strokeWidth={2.5} className="text-white/60 mx-auto" />;
  const positive = /Included|Priority|Highest/i.test(value);
  return (
    <span className={`inline-flex items-center gap-1.5 justify-center text-[13px] md:text-[14px] leading-snug text-white ${highlight ? 'font-bold' : 'font-medium'}`}>
      {positive && <Check size={14} strokeWidth={3} className="text-[#CCFF00] flex-shrink-0" />}
      {value}
    </span>
  );
}

// Lime "included / free" perk cell for the package table.
function Perk({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center justify-center gap-1.5 text-[#CCFF00] font-semibold text-[13px] md:text-[14px] leading-snug"><Check size={14} strokeWidth={3} className="flex-shrink-0" />{children}</span>;
}

function PlansSection() {
  return (
    <section id="plans" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 opacity-100" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal className="text-center">
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#CCFF00] mb-4">Choose your protection</p>
          <h2 className="text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 leading-[1.05]">
            Pick the level of <span className="text-[#CCFF00]">peace of mind.</span>
          </h2>
          <p className="text-white text-[13px] md:text-[15px] leading-relaxed max-w-2xl mx-auto mb-10 md:mb-14">
            Every plan builds on the last. VIP360+ is our most-chosen program for businesses that simply cannot afford to stop.
          </p>
        </Reveal>

        {/* PACKAGE PRICING TABLE */}
        <Reveal>
          <div className="-mx-4 md:mx-0 overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[880px] border-collapse text-center">
              <thead>
                <tr>
                  <th className="text-left align-middle p-3 md:p-4 border-b-2 border-white/10 sticky left-0 bg-black z-10">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/80">Package</span>
                  </th>
                  <th className="p-3 md:p-4 align-middle border-b-2 border-white/10 border-l border-white/[0.06]"><span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/80">Monthly Cost</span></th>
                  <th className="p-3 md:p-4 align-middle border-b-2 border-white/10 border-l border-white/[0.06]"><span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/80">Warranty</span></th>
                  {[
                    { code: 'P4', label: 'Preventive' },
                    { code: 'P3', label: 'Minor' },
                    { code: 'P2', label: 'Major' },
                    { code: 'P1', label: 'Critical' },
                  ].map(c => (
                    <th key={c.code} className="p-2.5 md:p-3 align-middle border-b-2 border-white/10 border-l border-white/[0.06] bg-[#CCFF00]/[0.03]">
                      <span className="block font-mono text-[10px] font-black uppercase tracking-widest text-[#CCFF00]">{c.code}</span>
                      <span className="block text-white text-[11px] md:text-[12px] font-black uppercase tracking-tight mt-0.5">{c.label}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PACKAGES.map(p => (
                  <tr key={p.name} className={p.highlight ? 'bg-[#CCFF00]/[0.05]' : ''}>
                    <td className={`p-4 md:p-5 text-left align-middle border-t border-white/[0.06] sticky left-0 z-10 ${p.highlight ? 'bg-[#0e1400] border-l-2 border-l-[#CCFF00]' : 'bg-black'}`}>
                      <span className={`block text-[15px] md:text-[17px] font-black uppercase tracking-tight ${p.highlight ? 'text-[#CCFF00]' : 'text-white'}`}>{p.name}</span>
                      {p.highlight && <span className="inline-flex items-center bg-[#CCFF00] text-black text-[8px] font-black uppercase tracking-[0.15em] px-1.5 py-0.5 mt-1.5">Most Popular</span>}
                    </td>
                    <td className="p-4 md:p-5 align-middle border-t border-l border-white/[0.06]">
                      <span className={`text-[13px] md:text-[14px] ${p.cost === 'Inclusive' ? 'text-white/80' : `font-bold ${p.highlight ? 'text-[#CCFF00]' : 'text-white'}`}`}>{p.cost}</span>
                    </td>
                    <td className="p-4 md:p-5 align-middle border-t border-l border-white/[0.06]">
                      {p.warranty.startsWith('Free') ? <Perk>{p.warranty}</Perk> : <span className="text-white text-[13px] md:text-[14px] leading-snug">{p.warranty}</span>}
                    </td>
                    <td className="p-4 md:p-5 align-middle border-t border-l border-white/[0.06]">
                      {p.preventive.startsWith('FOC') ? <Perk>{p.preventive}</Perk> : <span className="text-white text-[13px] md:text-[14px]">{p.preventive}</span>}
                    </td>
                    {p.repair ? (
                      <>
                        <td className="p-4 md:p-5 align-middle border-t border-l border-white/[0.06]"><span className="text-white text-[13px] md:text-[14px]">{p.repair.minor}</span></td>
                        <td className="p-4 md:p-5 align-middle border-t border-l border-white/[0.06]"><span className="text-white text-[13px] md:text-[14px]">{p.repair.major}</span></td>
                        <td className="p-4 md:p-5 align-middle border-t border-l border-white/[0.06]"><span className="text-white text-[13px] md:text-[14px]">{p.repair.critical}</span></td>
                      </>
                    ) : (
                      <td colSpan={3} className="p-4 md:p-5 align-middle border-t border-l border-white/[0.06] bg-[#CCFF00]/[0.03]"><Perk>{p.included}</Perk></td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="text-white/70 text-[11px] md:text-[12px] font-mono uppercase tracking-[0.15em] mt-5 text-center">P1–P4 = on-site repair callout · chargeable per visit under Standard, included with VIP360 · monthly base fee + RM40 per device, on top of your STUDIO plan · swipe on mobile</p>
        </Reveal>

        {/* CTA row */}
        <Reveal delay={0.05}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            <a href={WA_SALES} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 px-4 py-3 border border-white/40 hover:border-white text-white hover:bg-white/10 text-[11px] font-bold uppercase tracking-wider transition-colors">Keep Standard</a>
            <a href={WA_UPGRADE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 px-4 py-3 border-2 border-[#CCFF00]/60 hover:border-[#CCFF00] text-[#CCFF00] text-[11px] font-bold uppercase tracking-wider transition-colors">Choose VIP360</a>
            <a href={WA_UPGRADE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-[#CCFF00] hover:bg-white text-black text-[11px] font-black uppercase tracking-wider transition-colors">Choose VIP360+</a>
          </div>
        </Reveal>

        {/* ALSO INCLUDED — feature comparison */}
        <Reveal>
          <div className="mt-14 md:mt-20 border-t border-white/10 pt-10 md:pt-14">
            <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-[#CCFF00] mb-6 text-center">Also included with every VIP360 plan</p>
            <div className="-mx-4 md:mx-0 overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr>
                  <th className="text-left align-bottom p-3 md:p-4 sticky left-0 bg-black z-10 w-[34%]">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-white/80">Feature</span>
                  </th>
                  <th className="p-3 md:p-4 text-center border-b-2 border-white/10">
                    <span className="block text-white text-[13px] md:text-[15px] font-black uppercase tracking-tight">Standard</span>
                    <span className="block text-white/70 text-[9px] font-mono uppercase tracking-wider mt-1">Included</span>
                  </th>
                  <th className="p-3 md:p-4 text-center border-b-2 border-white/10">
                    <span className="block text-white text-[13px] md:text-[15px] font-black uppercase tracking-tight">VIP360</span>
                    <span className="block text-white/70 text-[9px] font-mono uppercase tracking-wider mt-1">RM300 + RM40/device</span>
                  </th>
                  <th className="p-3 md:p-4 text-center border-b-2 border-[#CCFF00] bg-[#CCFF00]/[0.06] relative">
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#CCFF00] text-black text-[8px] md:text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 whitespace-nowrap">Most Popular</span>
                    <span className="block text-[#CCFF00] text-[13px] md:text-[15px] font-black uppercase tracking-tight mt-1">VIP360+</span>
                    <span className="block text-[#CCFF00]/80 text-[9px] font-mono uppercase tracking-wider mt-1">RM450 + RM40/device</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {PLAN_ROWS.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 1 ? 'bg-white/[0.015]' : ''}>
                    <td className="p-3 md:p-4 sticky left-0 z-10 bg-black text-left">
                      <span className="text-white text-[13px] md:text-[14px] font-semibold leading-snug">{row.feature}</span>
                    </td>
                    <td className="p-3 md:p-4 text-center border-l border-white/[0.06]">{planCell(row.standard)}</td>
                    <td className="p-3 md:p-4 text-center border-l border-white/[0.06]">{planCell(row.vip)}</td>
                    <td className="p-3 md:p-4 text-center border-l border-[#CCFF00]/20 bg-[#CCFF00]/[0.04]">{planCell(row.vipPlus, true)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// SLA MATRIX — priority × Standard vs VIP360
// ────────────────────────────────────────────────────────────────
function SlaSection() {
  return (
    <section id="sla" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 80% 30%, rgba(204,255,0,0.08) 0%, transparent 55%)' }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal className="text-center">
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#CCFF00] mb-4">Priority support SLA</p>
          <h2 className="text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 leading-[1.05]">
            When it matters, <span className="text-[#CCFF00]">we move first.</span>
          </h2>
          <p className="text-white/90 text-[13px] md:text-[15px] leading-relaxed max-w-2xl mx-auto mb-10 md:mb-14">
            Clear response, update and resolution targets — in writing. VIP360 puts your business at the front of the queue.
          </p>
        </Reveal>

        <Reveal>
          <div className="-mx-4 md:mx-0 overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr>
                  <th rowSpan={2} className="text-left align-middle p-3 md:p-4 border-b-2 border-white/10 w-[13%]"><span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/80">Priority</span></th>
                  <th rowSpan={2} className="text-left align-middle p-3 md:p-4 border-b-2 border-white/10 border-l border-white/[0.06] w-[26%]"><span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/80">Example</span></th>
                  <th colSpan={3} className="p-2.5 md:p-3 text-center border-b border-white/10 border-l border-white/[0.06] bg-white/[0.06]"><span className="text-[11px] md:text-[12px] font-black uppercase tracking-widest text-white">Standard Warranty</span></th>
                  <th colSpan={3} className="p-2.5 md:p-3 text-center border-b border-[#CCFF00]/30 border-l border-[#CCFF00]/20 bg-[#CCFF00]/[0.08]"><span className="text-[11px] md:text-[12px] font-black uppercase tracking-widest text-[#CCFF00]">VIP360</span></th>
                </tr>
                <tr>
                  {['Response Time', 'Update Freq.', 'Resolution'].map((h, k) => (
                    <th key={`s-${h}`} className={`p-2.5 md:p-3 text-center border-b-2 border-white/10 bg-white/[0.03] ${k === 0 ? 'border-l border-white/[0.06]' : ''}`}><span className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-wider text-white/80">{h}</span></th>
                  ))}
                  {['Response Time', 'Update Freq.', 'Resolution'].map((h, k) => (
                    <th key={`v-${h}`} className={`p-2.5 md:p-3 text-center border-b-2 border-[#CCFF00]/30 bg-[#CCFF00]/[0.04] ${k === 0 ? 'border-l border-[#CCFF00]/20' : ''}`}><span className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-wider text-[#CCFF00]/80">{h}</span></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SLA_MATRIX.map(({ code, Icon, title, example, std, vip }, i) => (
                  <tr key={code} className={i % 2 === 1 ? 'bg-white/[0.015]' : ''}>
                    <td className="p-3 md:p-4 align-top border-t border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 border-2 border-[#CCFF00]/40 bg-[#CCFF00]/10 flex items-center justify-center flex-shrink-0">
                          <Icon size={15} strokeWidth={2} className="text-[#CCFF00]" />
                        </div>
                        <div className="leading-tight">
                          <span className="block font-mono text-[12px] font-black uppercase tracking-widest text-[#CCFF00]">{code}</span>
                          <span className="block text-white text-[12px] md:text-[13px] font-black uppercase tracking-tight">{title}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 md:p-4 align-top border-t border-l border-white/[0.06]">
                      <span className="text-white text-[12px] md:text-[13px] leading-snug">{example}</span>
                    </td>
                    <td className="p-3 md:p-4 text-center align-middle border-t border-l border-white/[0.06]"><span className="text-white text-[12px] md:text-[13px]">{std.response}</span></td>
                    <td className="p-3 md:p-4 text-center align-middle border-t border-white/[0.06]"><span className="text-white text-[12px] md:text-[13px]">{std.update}</span></td>
                    <td className="p-3 md:p-4 text-center align-middle border-t border-white/[0.06]"><span className="text-white text-[12px] md:text-[13px]">{std.resolution}</span></td>
                    <td className="p-3 md:p-4 text-center align-middle border-t border-l border-[#CCFF00]/20 bg-[#CCFF00]/[0.04]"><span className="text-[#CCFF00] text-[12px] md:text-[13px] font-bold">{vip.response}</span></td>
                    <td className="p-3 md:p-4 text-center align-middle border-t border-[#CCFF00]/10 bg-[#CCFF00]/[0.04]"><span className="text-white text-[12px] md:text-[13px] font-semibold">{vip.update}</span></td>
                    <td className="p-3 md:p-4 text-center align-middle border-t border-[#CCFF00]/10 bg-[#CCFF00]/[0.04]"><span className="text-white text-[12px] md:text-[13px] font-semibold">{vip.resolution}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-white/70 text-[11px] md:text-[12px] font-mono uppercase tracking-[0.15em] mt-6 text-center">Response &amp; resolution targets apply during business hours · Mon–Fri 10AM–7PM · swipe the table on mobile</p>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// WHY BUSINESSES LOVE VIP360
// ────────────────────────────────────────────────────────────────
function LoveSection() {
  return (
    <section id="love" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center">
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#CCFF00] mb-4">Why businesses love VIP360</p>
          <h2 className="text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 leading-[1.05]">
            Fewer surprises. <span className="text-[#CCFF00]">More confidence.</span>
          </h2>
          <p className="text-gray-300 text-[13px] md:text-[15px] leading-relaxed max-w-2xl mx-auto mb-10 md:mb-14">
            The reasons operators across Malaysia put VIP360 on every device they run.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {LOVE.map(({ Icon, text }, i) => (
            <Reveal key={text} delay={(i % 3) * 0.06}>
              <article className="group flex items-center gap-4 border-2 border-white/15 hover:border-[#CCFF00]/60 bg-white/[0.02] p-5 h-full transition-colors">
                <div className="w-11 h-11 border-2 border-[#CCFF00]/40 bg-[#CCFF00]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#CCFF00]/20 transition-colors">
                  <Icon size={18} strokeWidth={2} className="text-[#CCFF00]" />
                </div>
                <span className="text-white text-[14px] md:text-[15px] font-bold uppercase tracking-tight leading-tight">{text}</span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// FAQ — accordion
// ────────────────────────────────────────────────────────────────
function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20">
      <div className="max-w-3xl mx-auto">
        <Reveal className="text-center">
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#CCFF00] mb-4">Frequently asked questions</p>
          <h2 className="text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-10 md:mb-14 leading-[1.05]">
            The things people <span className="text-[#CCFF00]">ask us first.</span>
          </h2>
        </Reveal>

        <div className="space-y-3">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 0.04}>
                <div className={`border-2 ${isOpen ? 'border-[#CCFF00]/50 bg-[#CCFF00]/[0.03]' : 'border-white/15 bg-white/[0.02]'} transition-colors`}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 text-left px-5 md:px-6 py-4 md:py-5 min-h-[56px]">
                    <span className="text-white text-[14px] md:text-[16px] font-bold uppercase tracking-tight leading-snug">{item.q}</span>
                    <span className={`flex-shrink-0 w-8 h-8 border-2 ${isOpen ? 'border-[#CCFF00] bg-[#CCFF00] text-black' : 'border-[#CCFF00]/40 text-[#CCFF00]'} flex items-center justify-center transition-colors`}>
                      {isOpen ? <Minus size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
                    </span>
                  </button>
                  <div className="grid transition-all duration-300 ease-out" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                    <div className="overflow-hidden">
                      <p className="px-5 md:px-6 pb-5 md:pb-6 text-gray-300 text-[13px] md:text-[14px] leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <p className="text-gray-400 text-[12px] md:text-[13px] text-center mt-10">
            Still have a question?{' '}
            <a href={WA_SALES} target="_blank" rel="noopener noreferrer" className="text-[#CCFF00] hover:text-white font-bold transition-colors inline-flex items-center gap-1">
              <MessageCircleQuestion size={14} strokeWidth={2.5} /> Talk to our team
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// FINAL CTA
// ────────────────────────────────────────────────────────────────
function FinalCta() {
  return (
    <section id="upgrade" className="py-20 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-70" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(204,255,0,0.14) 0%, transparent 55%)' }} />
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-50" style={{ backgroundImage: 'radial-gradient(rgba(204,255,0,0.10) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 border border-[#CCFF00]/40 bg-[#CCFF00]/[0.06] px-3 py-1.5 mb-6">
            <ShieldCheck size={13} strokeWidth={2.5} className="text-[#CCFF00]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.28em] text-[#CCFF00]">Business Continuity</span>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.98] mb-6">
            Protect your business <span className="text-[#CCFF00]">before problems happen.</span>
          </h2>
          <p className="text-gray-300 text-[15px] md:text-[17px] leading-relaxed max-w-xl mx-auto mb-8 md:mb-10">
            Don't wait until downtime affects your operations. Join businesses across Malaysia that trust VIP360 to keep their STUDIO systems running at peak performance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
            <a href={WA_UPGRADE} target="_blank" rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 md:px-10 py-4 md:py-5 bg-[#CCFF00] hover:bg-white text-black text-[13px] md:text-[15px] font-black uppercase tracking-wider transition-colors">
              <ShieldCheck size={16} strokeWidth={2.5} /> Upgrade to VIP360 <ArrowRight size={16} strokeWidth={2.5} />
            </a>
            <a href={WA_SALES} target="_blank" rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 md:px-8 py-4 md:py-5 border-2 border-white/30 hover:border-white text-white text-[12px] md:text-[14px] font-bold uppercase tracking-wider transition-colors">
              Contact sales <ArrowRight size={14} strokeWidth={2.5} />
            </a>
          </div>
          <p className="text-white/40 text-[10px] md:text-[11px] font-mono uppercase tracking-[0.25em] mt-7">
            Publika KL · Mon–Fri · 10AM–7PM
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// STICKY MOBILE CTA
// ────────────────────────────────────────────────────────────────
function StickyMobileCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const h = () => {
      const past = window.scrollY > 600;
      const end = document.getElementById('upgrade');
      const nearEnd = end ? end.getBoundingClientRect().top < window.innerHeight * 0.85 : false;
      setShow(past && !nearEnd);
    };
    window.addEventListener('scroll', h, { passive: true });
    h();
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${show ? 'translate-y-0' : 'translate-y-full'}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="bg-black/95 backdrop-blur-md border-t border-[#CCFF00]/30 px-3 py-2.5 flex items-center gap-2">
        <a href={WA_UPGRADE} target="_blank" rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#CCFF00] text-black text-[12px] font-black uppercase tracking-wider px-4 py-3 min-h-[44px]">
          <ShieldCheck size={14} strokeWidth={2.5} /> Upgrade to VIP360
        </a>
        <a href="#plans" aria-label="Compare plans"
          className="inline-flex items-center justify-center px-3 py-3 border-2 border-white/30 text-white text-[11px] font-bold uppercase tracking-wider min-w-[44px] min-h-[44px]">
          <ArrowRight size={14} strokeWidth={2.5} />
        </a>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// MAIN PAGE
// ────────────────────────────────────────────────────────────────
export default function VIP360Page() {
  useEffect(() => { document.title = 'QStudio VIP360'; }, []);

  return (
    <div className="bg-black min-h-screen text-white selection:bg-[#CCFF00] selection:text-black overflow-x-hidden">
      <SEOHead
        noindex
        noTitleSuffix
        title="QStudio VIP360"
        description="VIP360 is STUDIO's premium business-continuity program — preventive maintenance, priority support, door-to-door hardware care and emergency on-site assistance that protect your business before problems happen."
        image="https://qbot.now/qfitimg/studioimg/02_checkin.jpg"
        imageAlt="VIP360 — STUDIO's premium business continuity and care program"
        url="https://qbot.now/vipcare"
      />

      <VIPHeader />

      <main id="main" role="main">
        <Hero />
        <WhySection />
        <TimelineSection />
        <IncludedSection />
        <HealthReportSection />
        <PlansSection />
        <SlaSection />
        <LoveSection />
        <FaqSection />
        <FinalCta />
      </main>

      <StickyMobileCta />
      <VIPFooter />

      {/* Scoped animations — premium, restrained */}
      <style>{`
        @keyframes vip-spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes vip-spin-rev  { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        .vip-spin-slow { animation: vip-spin-slow 44s linear infinite; }
        .vip-spin-rev  { animation: vip-spin-rev 34s linear infinite; }

        @keyframes vip-float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          50%      { transform: translate(-50%, -50%) translateY(-8px); }
        }
        .vip-float { animation: vip-float 5s ease-in-out infinite; }

        @keyframes vip-pulse-soft {
          0%, 100% { box-shadow: 0 0 40px rgba(204,255,0,0.28); }
          50%      { box-shadow: 0 0 58px rgba(204,255,0,0.45); }
        }
        .vip-pulse-soft { animation: vip-pulse-soft 3.4s ease-in-out infinite; }

        @keyframes vip-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        .vip-blink { animation: vip-blink 1.6s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .vip-spin-slow, .vip-spin-rev, .vip-float, .vip-pulse-soft, .vip-blink { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
