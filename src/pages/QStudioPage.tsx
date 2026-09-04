import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import {
  ArrowRight, ChevronRight, ChevronLeft, ChevronDown,
  MessageCircle, Send, Sparkles, Instagram,
  Dumbbell, Ticket, Scissors, Heart,
  FileCheck2, DoorOpen, CalendarCheck, CreditCard, Gift, Puzzle,
  Eye, Database, TrendingUp, DoorClosed, Fence, Activity,
  PenLine, PlayCircle,
  Users, Share2, Package,
  type LucideIcon,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';

// ────────────────────────────────────────────────────────────────
// CONSTANTS
// ────────────────────────────────────────────────────────────────
const WA = 'https://wa.me/60126909189?text=Hi%20I%27m%20interested%20in%20STUDIO';
const WA_DEMO = 'https://wa.me/60126909189?text=' + encodeURIComponent("Hi, I'd like to book a STUDIO demo at Publika KL.");
const WA_TELLUS = 'https://wa.me/60126909189?text=' + encodeURIComponent(
  "Hi! I'd like to tell you about my business and see what fits.\n- Business type:\n- Number of outlets:\n- What I need (booking / face-ID / memberships / multi-outlet / reports / loyalty):\n\nThanks!"
);

const HERO_BG = [
  '/qfitimg/headers/qfit-gym.jpg',
  '/qfitimg/headers/qfit-salon.jpg',
  '/qfitimg/headers/qfit-massage.jpg',
  '/qfitimg/headers/qfit-court.jpg',
  '/qfitimg/headers/qfit-pool.jpg',
  '/qfitimg/headers/qfit-pickle.jpg',
];

// Rotating vertical word inside the hero headline ("All-in-One Platform for Your ___")
const HERO_VERTICALS = ['gym', 'salon', 'playland', 'club', 'beauty clinic', 'themepark', 'spa', 'studio'];

// ────────────────────────────────────────────────────────────────
// AUDIENCE
// ────────────────────────────────────────────────────────────────
const AUDIENCE: { Icon: LucideIcon; label: string; sub: string; img: string }[] = [
  { Icon: Dumbbell, label: 'Gyms & Studios',          sub: 'Fitness, yoga, pilates, martial arts, dance.',     img: '/qfitimg/studioimg/for_gym.png' },
  { Icon: Ticket,   label: 'Theme & Indoor Parks',    sub: 'Ticketing, ride passes, indoor playgrounds.',      img: '/qfitimg/studioimg/for_indoor_theme.jpg' },
  { Icon: Scissors, label: 'Salons & Spas',           sub: 'Hair, nails, beauty, massage, treatments.',         img: '/qfitimg/studioimg/for_spa.jpg' },
  { Icon: Heart,    label: "Wellness & Members' Clubs", sub: 'Wellness centres, private clubs, communities.', img: '/qfitimg/studioimg/for_wellness.jpg' },
];

const ALSO_WORKS = [
  'Yoga', 'Pilates', 'Climbing Gyms', 'Boxing & MMA', 'CrossFit',
  'Aesthetic Clinics', 'TCM Clinics', 'Tuition', 'Kids Activity',
  'Coworking', 'Karaoke', 'Function Halls', 'Escape Rooms',
];

// ────────────────────────────────────────────────────────────────
// 7-STEP FLOW (the narrative spine)
// ────────────────────────────────────────────────────────────────
type FlowStep = {
  num: string;
  slug: string;
  title: string;
  benefit: string;
  body: string;
  long: string;
  pills: string[];
  img: string;
  imgAlt: string;
  Icon: LucideIcon;
};

const FLOW_STEPS: FlowStep[] = [
  {
    num: '01', slug: 'signup', title: 'Sign up', Icon: FileCheck2,
    benefit: 'Stop chasing paperwork. New members live in seconds.',
    body: 'Dashboard, online, or self-service kiosk. NRIC checker + digital waiver.',
    long: "Sign new members up the way your front desk runs — staff enters them from the dashboard, the member fills the form online, or they walk up to the self-service kiosk. The NRIC checker pulls name, IC, address and date of birth automatically. Waiver signed on screen. No retyping, no clipboards, no scanning forms. The IC stays on file as a trace — the way Malaysian operators actually run their business.",
    pills: ['Dashboard signup', 'Online form', 'Self-service kiosk', 'NRIC autofill', 'Digital waiver', 'PDPA-aware'],
    img: '/qfitimg/studioimg/app_membership.jpg',
    imgAlt: 'STUDIO sign-up — dashboard, online form, and self-service kiosk with NRIC autofill',
  },
  {
    num: '02', slug: 'membership', title: 'Membership', Icon: CreditCard,
    benefit: 'Sell every model your business actually has.',
    body: 'Credit packs, unlimited, walk-in. Recurring or one-time. Powered by Fiuu.',
    long: "Credit packs for class-based studios. Unlimited for gyms. Pay-per-visit for walk-ins. Trial-to-member built in. Credits deduct correctly; expiries are tracked; balances are visible to the member in their app. No spreadsheet. No 'I'm sure I had three classes left' arguments. Recurring auto-charge or one-time payment, powered by Fiuu — Malaysia's payment rails. Tie each membership to a member card, face-ID, QR code, or any mix.",
    pills: ['Credit packs', 'Unlimited', 'Walk-in', 'Trial → member', 'Auto-renewal', 'Freeze / cancel', 'Fiuu payments', 'Card / Face / QR'],
    img: '/qfitimg/studioimg/01_membership.jpg',
    imgAlt: 'STUDIO memberships — credit packs, unlimited and walk-in tiers with Fiuu billing',
  },
  {
    num: '03', slug: 'checkin', title: 'Check in', Icon: DoorOpen,
    benefit: 'No more sign-in sheets. No more queues.',
    body: 'Face-ID auto-gate or door lock checks them in the moment they arrive.',
    long: "Pick the door that fits — Face-ID lock for treatment rooms and small studios, auto-gate for high-traffic gyms and parks, or counter check-in where staff verifies face-ID at sign-in. Add the anti-tailgating sensor where one-in-one-out matters. Pair with a Sentry camera for 24/7 unknown-face alerts across the floor. Your front desk stops squinting at IC photos at peak hour — and stops shared memberships dead.",
    pills: ['Face-ID lock', 'Auto-gate', 'Counter check-in', '1-second match', 'Anti-tailgating', 'Sentry camera', 'Visit log', 'Staff clock-in'],
    img: '/qfitimg/studioimg/02_checkin.jpg',
    imgAlt: 'STUDIO check-in — Face-ID auto-gate and door lock catching every visitor automatically',
  },
  {
    num: '04', slug: 'booking', title: 'Booking', Icon: CalendarCheck,
    benefit: 'Members book from their phone — anytime, anywhere.',
    body: 'Web, app, or front-desk admin. One calendar, one capacity, one waitlist.',
    long: 'Members book classes, rooms, slots, and appointments from your website, the customer app, or the front-desk console — at 2am if they want. Same calendar. Same capacity. Same waitlist. Credits deduct. Deposit collected. Card on file charged. Nobody double-books because someone wrote the wrong thing in a notebook. The seat is held.',
    pills: ['Web booking', 'Customer app', 'Front-desk console', 'Class capacity', 'Room / chair / bay', 'Auto-waitlist', 'Deposit to confirm', 'Card on file'],
    img: '/qfitimg/studioimg/03_booking.jpg',
    imgAlt: 'STUDIO booking — web, customer app and front-desk console on one calendar',
  },
  {
    num: '05', slug: 'rewards', title: 'Rewards', Icon: Gift,
    benefit: 'Make every visit earn the next one.',
    body: 'Loyalty points, birthday vouchers, expiry reminders, retention nudges — automatic.',
    long: "Set the rules once. Every visit earns points. STUDIO fires birthday-month vouchers automatically. Renewal reminders go out before memberships lapse. Retention nudges land for members who haven't visited in three months. Every push lands in the customer app. You don't lift a finger — members come back without you chasing.",
    pills: ['Loyalty points', 'Birthday vouchers', 'Expiry reminders', '3-month retention nudges', 'Push notifications', 'Referral tracking', 'Tier rewards'],
    img: '/qfitimg/studioimg/04_rewards.jpeg',
    imgAlt: 'STUDIO rewards engine firing loyalty points, birthday vouchers and retention nudges',
  },
  {
    num: '06', slug: 'report', title: 'Report', Icon: Send,
    benefit: "Know what's happening — without watching the floor.",
    body: 'Daily reports, expiry alerts, and retention warnings — sent to your phone.',
    long: "STUDIO reads the business for you. Daily takings, check-ins, new sign-ups, expiring memberships, and at-risk members get summarised and pushed to your phone every morning — by WhatsApp, app push, or email, whatever your team already uses. The alerts that matter (low stock, big refund, member at-risk) come in live. The dashboard is there when you want to dig in. You don't have to be on the floor to know how the day went.",
    pills: ['Daily summary to phone', 'Expiry reminders', 'At-risk alerts', 'Live operational alerts', 'CSV / PDF export', 'Full dashboard'],
    img: '/qfitimg/studioimg/05_report.jpg',
    imgAlt: "STUDIO daily report on a phone — takings, check-ins, at-risk members and live alerts",
  },
  {
    num: '07', slug: 'customized', title: 'Customized', Icon: Puzzle,
    benefit: 'Your business, your rules.',
    body: 'Multi-outlet, ClassPass, inventory, custom workflows.',
    long: "Run one outlet or fifty — single login, per-outlet branding, head-office rollup reports, role-based access. Need ClassPass integration? Inventory sync with your supplier? A custom commission rule for your franchise? STUDIO is modular — we configure what fits and leave out what doesn't. One-time dev work for the bespoke pieces.",
    pills: ['Multi-outlet', 'One login', 'Per-outlet branding', 'HQ rollup', 'Role-based access', 'ClassPass', 'Inventory sync', 'Custom workflows', 'API access'],
    img: '/qfitimg/studioimg/06_customize.png',
    imgAlt: 'STUDIO multi-outlet rollup dashboard with custom integrations',
  },
];

// ────────────────────────────────────────────────────────────────
// HARDWARE
// ────────────────────────────────────────────────────────────────
const HARDWARE = [
  {
    Icon: DoorClosed,
    title: 'Face-ID Door Lock',
    body: 'A biometric lock for a single door. Right for studios, salons, treatment rooms, private members\' areas. Simple to install. No turnstile required.',
    bullets: ['Single-door install', 'No turnstile', 'Member zones', 'Battery or wired'],
    img: '/qfitimg/studioimg/type-doorlock.jpg',
    imgAlt: 'Face-ID door lock mounted at a studio treatment room entrance',
  },
  {
    Icon: Fence,
    title: 'Face-ID Auto Gate',
    body: 'A full turnstile or boom-gate setup. Right for gyms, theme parks, larger members\' clubs. Add the anti-tailgating sensor where one-in-one-out matters; skip it where it doesn\'t.',
    bullets: ['Turnstile / boom gate', 'Anti-tailgating sensor (optional)', 'One-in-one-out flow', 'High-traffic ready'],
    img: '/qfitimg/studioimg/type-faceid.jpg',
    imgAlt: 'Face-ID auto-gate turnstile with anti-tailgating sensor at a gym entrance',
  },
];

// ────────────────────────────────────────────────────────────────
// COMPARISON (rewritten in brief voice + animated tabbed visual)
// ────────────────────────────────────────────────────────────────
type CompareRow = {
  label: string;
  Icon: LucideIcon;
  them: string;
  us: string;
  themMetric: string;
  usMetric: string;
  metricLabel: string;
};

const COMPARE_ROWS: CompareRow[] = [
  { label: 'Sign-up',       Icon: FileCheck2,    them: 'Paper waiver. Front desk retypes.',     us: 'NRIC scan autofills. Waiver on screen.', themMetric: '5 MIN',     usMetric: '10 SEC',    metricLabel: 'Time per member' },
  { label: 'Check-in',      Icon: DoorOpen,      them: 'Card or QR. Shared, lost, forgotten.',   us: 'Face-ID. Person = membership.',          themMetric: '30 SEC',    usMetric: '1 SEC',     metricLabel: 'Time at the door' },
  { label: 'Bookings',      Icon: CalendarCheck, them: 'Phone calls. Paper notebook.',            us: 'Members book from their phone.',         themMetric: 'STAFF',     usMetric: 'SELF',      metricLabel: 'Who does the work' },
  { label: 'Memberships',   Icon: CreditCard,    them: 'Spreadsheet. Manual expiry chase.',       us: 'Live balances in the member app.',       themMetric: 'OFFLINE',   usMetric: 'LIVE',      metricLabel: 'Where the truth lives' },
  { label: 'Multi-outlet',  Icon: Puzzle,        them: 'One license per location.',                us: 'One login. HQ rollup.',                  themMetric: 'N LOGINS',  usMetric: '1 LOGIN',   metricLabel: 'Access' },
  { label: 'Reports',       Icon: Send,          them: 'Log in. Hope dashboard loads.',           us: 'Daily summary to your phone.',           themMetric: 'PULL',      usMetric: 'PUSH',      metricLabel: 'How you find out' },
  { label: 'Loyalty',       Icon: Gift,          them: 'Extra add-on. Extra cost.',                us: 'Points, birthdays, vouchers — in the box.', themMetric: 'ADD-ON', usMetric: 'BUILT-IN', metricLabel: 'Loyalty engine' },
  { label: 'Renewal',       Icon: Activity,      them: 'Manual calls. Texts. Easy to miss.',      us: 'Reminders fire before the lapse.',       themMetric: 'MANUAL',    usMetric: 'AUTO',      metricLabel: 'Renewal chase' },
];

// ────────────────────────────────────────────────────────────────
// VIDEOS — STUDIO in action (YouTube Shorts)
// ────────────────────────────────────────────────────────────────
const VIDEOS: { id: string; title: string; tag: string; desc: string }[] = [
  {
    id: 'mxBAl8NmmDQ',
    title: 'Self-service & Webstore',
    tag: 'Customer · Web',
    desc: 'Members sign up, book classes, top up credits, and buy memberships from your website or the lobby kiosk — self-service from day one.',
  },
  {
    id: 'UZxFNtalaUk',
    title: 'Face-ID Gate & Turnstile',
    tag: 'Door · Hardware',
    desc: 'Watch a member walk in with no card, no QR, no front-desk fumble. Face matched. Gate opens. Done — in under a second.',
  },
  {
    id: 'gQ34-uGL7TI',
    title: 'eSign + NRIC / Passport Reader',
    tag: 'Sign-up · Identity',
    desc: 'NRIC Checker — one tap, identity locked in. An extra security layer in your sign-up flow: insert the MyKad, STUDIO captures the data, signs the waiver, and files it to the cloud.',
  },
  {
    id: 'BNLgOsfWTqs',
    title: 'Staff & Trainers App',
    tag: 'Staff · Mobile',
    desc: 'Trainers see their classes, attendance, commissions, and clients on their own phone. Less time at the front desk, more time on the floor.',
  },
  {
    id: 'GoBwWbsUzTI',
    title: 'Backoffice & AI Dashboard',
    tag: 'HQ · Dashboard',
    desc: 'Your business at a glance — takings, check-ins, expiring memberships, at-risk members. AI surfaces what needs your attention today.',
  },
];

// ────────────────────────────────────────────────────────────────
// PAIN POINTS (real-world problems STUDIO takes off your plate)
// ────────────────────────────────────────────────────────────────
const PAIN_POINTS: { pain: string; fix: string; img: string; imgAlt: string }[] = [
  {
    pain: 'Still chasing waivers and sign-up forms on paper?',
    fix: 'Customers sign up, complete waivers, and pay from the front counter, the self-service kiosk, their own phone, or your company website — whichever works for them. New members live in seconds, no clipboard, no retyping.',
    img: '/qfitimg/studioimg/app_membership.jpg',
    imgAlt: 'Customer signing up at front counter, self-service kiosk, mobile, or company website',
  },
  {
    pain: 'Sign-in sheets, queues, and a front desk that can\'t breathe at peak hour?',
    fix: 'Face-ID auto-gate or door lock checks them in the moment they walk in. No queue. No staff time wasted at the counter.',
    img: '/qfitimg/studioimg/02_checkin.jpg',
    imgAlt: 'Face-ID auto-gate checking a member in automatically with no queue',
  },
  {
    pain: 'Members coming once and never coming back?',
    fix: 'Every visit earns loyalty points. Birthday vouchers, expiry reminders, and 3-month retention nudges fire automatically — so they come back without you chasing.',
    img: '/qfitimg/studioimg/04_rewards.jpeg',
    imgAlt: 'Loyalty points, vouchers and retention nudges landing in the customer app',
  },
  {
    pain: 'Can\'t tell how the day went without logging in to a dashboard?',
    fix: 'Daily reports, expiring-membership alerts, and at-risk-member warnings — sent straight to your phone every morning. The business runs while you watch.',
    img: '/qfitimg/studioimg/05_report.jpg',
    imgAlt: 'Daily STUDIO report on a phone — takings, check-ins, expiring memberships and at-risk members',
  },
];

// ────────────────────────────────────────────────────────────────
// RELIABILITY
// ────────────────────────────────────────────────────────────────
const RELIABILITY = [
  { Icon: Activity, title: 'Quiet in the background.', body: "Friday night, full classes, queue at the kiosk — STUDIO handles it without a hiccup. You forget it's there until you check the report." },
  { Icon: Database,  title: 'Your data is yours.',      body: 'Members, sales, history, visit logs — export to CSV or PDF anytime. No lock-in. No data held hostage if you ever want to leave.' },
  { Icon: TrendingUp, title: 'Grows with you.',         body: "One outlet today, fifty tomorrow — same system, same login, same dashboard. Add an outlet without re-buying the platform." },
];

// ────────────────────────────────────────────────────────────────
// PLUGINS — optional add-ons that click on top of the core
// ────────────────────────────────────────────────────────────────
const PLUGINS: { Icon: LucideIcon; tag: string; title: string; body: string }[] = [
  { Icon: Users,         tag: 'Community', title: 'Together',     body: 'Turn members into a community — invite friends, form squads, run challenges and climb a shared leaderboard.' },
  { Icon: Sparkles,      tag: 'Profiles',  title: 'Showcase',     body: "Public trainer & staff profiles. Each gets a shareable page with a 'Book with me' link straight into your calendar." },
  { Icon: Share2,        tag: 'Loyalty',   title: 'Share & Gift', body: 'Members gift a class, share credits or hand a friend a guest pass — deducted from their own balance, tracked automatically.' },
  { Icon: MessageCircle, tag: 'Messaging', title: 'AutoWhatsApp', body: 'Booking confirmations and reminders sent automatically over WhatsApp — fewer no-shows, zero manual typing.' },
  { Icon: PenLine,       tag: 'Documents', title: 'eSign',        body: 'Waivers, agreements and forms signed on any device — stored, searchable and PDPA-ready.' },
  { Icon: Package,       tag: 'Rental',    title: 'Rental',       body: 'Rent out lockers, gear and equipment — timed, tracked and billed without a separate spreadsheet.' },
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
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>
      {children}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// HEADER
// ────────────────────────────────────────────────────────────────
const ANNOUNCEMENTS = [
  'No more sign-in sheets. No more queues. No more wasted staff time.',
  'Sign-up, booking, check-in — your members do it from their phone.',
  "Built for studios, parks, salons, and members' clubs.",
];

function QStudioHeader() {
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

  const navItems = [
    { label: 'Pain points',  href: '#pain' },
    { label: 'How it works', href: '#flow' },
    { label: 'Hardware',     href: '#hardware' },
    { label: 'Videos',       href: '#videos' },
    { label: 'Why STUDIO',   href: '#compare' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50" role="banner">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-[#CCFF00] focus:text-black focus:px-3 focus:py-1.5 focus:text-[11px] focus:font-bold focus:uppercase">
        Skip to content
      </a>

      <div className="bg-[#111] text-white hidden lg:block">
        <div className="container mx-auto px-4 md:px-6 lg:px-12 py-1.5 flex items-center justify-between">
          <div className="flex items-center divide-x divide-gray-300 text-[10px] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 pr-4 text-gray-400">
              <Sparkles size={10} strokeWidth={2.5} className="text-[#CCFF00]" />
              STUDIO by QBot
            </span>
            <span className="px-4 text-gray-400">Mon–Fri · 10AM–7PM</span>
            <span className={`pl-4 text-[#CCFF00] transition-opacity duration-300 ${annFade ? 'opacity-100' : 'opacity-0'}`}>
              {ANNOUNCEMENTS[annIdx]}
            </span>
          </div>
          <div className="flex items-center gap-4 divide-x divide-gray-600">
            <a href={WA} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors">
              <MessageCircle size={10} strokeWidth={2.5} />
              +6012-6909-189
            </a>
            <a href="/" className="pl-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#CCFF00] hover:text-white transition-colors">
              Explore QPOS <ArrowRight size={10} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </div>

      <nav className={`transition-all duration-300 bg-black/90 backdrop-blur-xl backdrop-saturate-150 border-b border-white/10 ${scrolled ? 'shadow-sm' : ''}`} aria-label="Primary">
        <div className="container mx-auto px-4 md:px-6 lg:px-12 py-3 md:py-4">
          <div className="flex items-center">
            <a href="/qstudio" className="flex items-center gap-2 group mr-10" aria-label="STUDIO home">
              <img src="/qbotlogo.svg" alt="STUDIO logo" className="w-9 h-9 md:w-10 md:h-10 brightness-0 invert" />
              <span className="text-white text-[16px] md:text-[18px] font-black uppercase tracking-[0.15em] leading-none">
                STUDIO
              </span>
            </a>

            <div className="hidden lg:flex items-center space-x-7 xl:space-x-9">
              {navItems.map(item => (
                <a key={item.label} href={item.href} className="text-[11px] font-bold tracking-[0.1em] uppercase text-white hover:text-[#CCFF00] transition-colors duration-200">
                  {item.label}
                </a>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-5 ml-auto">
              <a href={WA_DEMO} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-[#CCFF00] hover:bg-white text-black text-[11px] font-bold uppercase tracking-wider transition-colors">
                <MessageCircle size={14} strokeWidth={2} /> Book a demo <ChevronRight size={14} strokeWidth={2.5} />
              </a>
            </div>

            <div className="lg:hidden flex items-center ml-auto gap-2">
              <a href={WA_DEMO} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#CCFF00] text-black text-[10px] font-bold uppercase tracking-wider">
                <MessageCircle size={12} strokeWidth={2} /> Demo
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
              {[...navItems, { label: 'Book a demo', href: WA_DEMO }, { label: 'Explore QPOS', href: '/' }].map(item => (
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
function QStudioFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="relative bg-black text-white border-t border-white/10" role="contentinfo">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <img src="/qbotlogo.svg" alt="QBot logo" className="w-12 h-12 brightness-0 invert" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wide mb-1.5">The operating system for membership-based, walk-in businesses.</p>
            <p className="text-[11px] text-gray-400 leading-relaxed mb-5">Memberships. Bookings. Check-in. Payments. From sign-up to renewal — on one system.</p>
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/qbotmalaysia" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-500 hover:text-[#CCFF00] transition-colors"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
              <a href="https://www.instagram.com/qbotfuture" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-500 hover:text-[#CCFF00] transition-colors"><Instagram size={16} strokeWidth={2} /></a>
              <a href="https://www.tiktok.com/@qbotfuture" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-gray-500 hover:text-[#CCFF00] transition-colors"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg></a>
            </div>
          </div>

          <div>
            <p className="text-[10px] text-[#CCFF00] font-bold uppercase tracking-[0.15em] mb-3">Platform</p>
            <ul className="space-y-1.5">
              {[
                { label: 'Pain points',   href: '#pain' },
                { label: 'How it works',  href: '#flow' },
                { label: 'Sign up',       href: '#flow-signup' },
                { label: 'Membership',    href: '#flow-membership' },
                { label: 'Check in',      href: '#flow-checkin' },
                { label: 'Booking',       href: '#flow-booking' },
                { label: 'Rewards',       href: '#flow-rewards' },
                { label: 'Report',        href: '#flow-report' },
                { label: 'Customized',    href: '#flow-customized' },
                { label: 'Videos',        href: '#videos' },
                { label: 'Why STUDIO',    href: '#compare' },
              ].map(item => (
                <li key={item.label}><a href={item.href} className="text-[12px] text-gray-400 hover:text-white transition-colors block py-1 min-h-[32px]">{item.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] text-[#CCFF00] font-bold uppercase tracking-[0.15em] mb-3">Hardware</p>
            <ul className="space-y-1.5 mb-6">
              <li><a href="#hardware" className="text-[12px] text-gray-400 hover:text-white transition-colors">Face-ID Door Lock</a></li>
              <li><a href="#hardware" className="text-[12px] text-gray-400 hover:text-white transition-colors">Face-ID Auto Gate</a></li>
            </ul>
            <p className="text-[10px] text-white font-bold uppercase tracking-[0.15em] mb-3">Also by QBot</p>
            <ul className="space-y-1.5">
              <li><a href="/" className="text-[12px] text-gray-400 hover:text-white transition-colors">QPOS — F&amp;B / Retail POS</a></li>
              <li><a href="/qfit" className="text-[12px] text-gray-400 hover:text-white transition-colors">QFit — Gym & Wellness</a></li>
              <li><a href="/hardware" className="text-[12px] text-gray-400 hover:text-white transition-colors">All Hardware</a></li>
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
                <a href={WA} target="_blank" rel="noopener noreferrer" className="text-[12px] text-gray-400 hover:text-white transition-colors">+6012-6909-189</a>
              </div>
              <p className="text-[10px] text-gray-400 pl-[26px]">Mon–Fri · 10AM–7PM</p>
              <a href={WA_DEMO} target="_blank" rel="noopener noreferrer"
                className="inline-block bg-[#CCFF00] hover:bg-white text-black text-[10px] font-bold uppercase tracking-wider px-5 py-2.5 transition-colors">
                Book a demo
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-[11px] text-gray-500">
          <p>&copy; {currentYear} QBot — STUDIO is part of the QBot product family.</p>
        </div>
      </div>
    </footer>
  );
}

// ────────────────────────────────────────────────────────────────
// JSON-LD (SEO structured data)
// ────────────────────────────────────────────────────────────────
function useJsonLd() {
  useEffect(() => {
    const data = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://qbot.now/#org',
          name: 'QBot',
          url: 'https://qbot.now',
          logo: 'https://qbot.now/qbotlogo.svg',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'B3-6-13 Solaris Dutamas, Jalan Dutamas 1',
            postalCode: '50480',
            addressLocality: 'Kuala Lumpur',
            addressCountry: 'MY',
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+60-12-6909-189',
            contactType: 'sales',
            areaServed: 'MY',
            availableLanguage: ['en', 'ms'],
          },
        },
        {
          '@type': 'SoftwareApplication',
          '@id': 'https://qbot.now/qstudio#app',
          name: 'STUDIO',
          alternateName: 'QStudio',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web, iOS, Android',
          description: "The operating system for membership-based, walk-in businesses. Self-service sign-up and waivers, Face-ID auto check-in, online booking, loyalty and retention automation, and daily business reports straight to your phone. Built for gyms, fitness studios, theme parks, indoor playgrounds, salons, spas, wellness centres, and members' clubs.",
          url: 'https://qbot.now/qstudio',
          image: 'https://qbot.now/qfitimg/studioimg/02_checkin.jpg',
          provider: { '@id': 'https://qbot.now/#org' },
          featureList: [
            'Self-service sign-up with NRIC autofill, digital waiver and e-signature',
            'Sign-up from front counter, self-service kiosk, mobile app or company website',
            'Face-ID auto check-in (door lock or auto-gate)',
            'Online class, slot and appointment booking',
            'Memberships, credit packs and auto-renewal billing',
            'Loyalty points, birthday vouchers and retention nudges',
            'Daily reports and at-risk alerts pushed to phone',
            'Multi-outlet rollup with role-based access',
            'Encrypted cloud storage of waivers, agreements and signed consents',
            'PDPA-aware data handling for Malaysian operators',
          ],
          offers: { '@type': 'Offer', priceCurrency: 'MYR', availability: 'https://schema.org/InStock' },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'QBot',   item: 'https://qbot.now/' },
            { '@type': 'ListItem', position: 2, name: 'STUDIO', item: 'https://qbot.now/qstudio' },
          ],
        },
        {
          '@type': 'ItemList',
          name: 'Industries STUDIO is built for',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Gyms & Studios — fitness, yoga, pilates, martial arts, dance' },
            { '@type': 'ListItem', position: 2, name: 'Theme & Indoor Parks — ticketing, ride passes, indoor playgrounds' },
            { '@type': 'ListItem', position: 3, name: 'Salons & Spas — hair, nails, beauty, massage, treatments' },
            { '@type': 'ListItem', position: 4, name: "Wellness & Members' Clubs — wellness centres, private clubs, communities" },
          ],
        },
        {
          '@type': 'HowTo',
          name: 'How STUDIO runs the membership lifecycle',
          description: 'Seven jobs STUDIO handles every day — sign-up, membership, check-in, booking, rewards, report, customised — on one platform.',
          step: [
            { '@type': 'HowToStep', position: 1, name: 'Sign up',     text: 'New members sign up from the front counter, self-service kiosk, their own phone, or your website. NRIC scan autofills name, IC, address and DOB; digital waiver and e-signature collected in the same flow.' },
            { '@type': 'HowToStep', position: 2, name: 'Membership',  text: 'Sell credit packs, unlimited plans, walk-in passes and trials. Recurring or one-time billing via Fiuu. Member balances live in the customer app.' },
            { '@type': 'HowToStep', position: 3, name: 'Check in',    text: 'Face-ID door lock for small studios, Face-ID auto-gate for high-traffic venues, or counter check-in — the person matches the membership.' },
            { '@type': 'HowToStep', position: 4, name: 'Booking',     text: 'Members book classes, rooms, slots and appointments from the website, the customer app, or the front-desk console. One calendar, one waitlist, credits auto-deduct.' },
            { '@type': 'HowToStep', position: 5, name: 'Rewards',     text: 'Every visit earns loyalty points. Birthday vouchers, expiry reminders and retention nudges fire automatically.' },
            { '@type': 'HowToStep', position: 6, name: 'Report',      text: 'Daily takings, check-ins, new sign-ups, expiring memberships and at-risk members get pushed to your phone by WhatsApp, app push or email.' },
            { '@type': 'HowToStep', position: 7, name: 'Customized',  text: 'Multi-outlet rollup, ClassPass integration, inventory sync, custom commission rules — configured to fit the business.' },
          ],
        },
        ...[
          { id: 'UZxFNtalaUk', name: 'STUDIO by QBot — Face-ID Gate & Turnstile',  description: 'See how a member walks in with no card, no QR, no front-desk fumble. Face matched, gate opens, in under a second.' },
          { id: 'GoBwWbsUzTI', name: 'STUDIO by QBot — Backoffice & AI Dashboard', description: "STUDIO's backoffice and AI dashboard surfacing takings, check-ins, expiring memberships and at-risk members at a glance." },
          { id: 'BNLgOsfWTqs', name: 'STUDIO by QBot — Staff & Trainers App',      description: 'Trainers viewing their classes, attendance, commissions and clients from their own phone — front-desk paperwork removed.' },
          { id: 'mxBAl8NmmDQ', name: 'STUDIO by QBot — Self-service & Webstore',   description: 'Members signing up, booking classes, topping up credits and buying memberships from the website or lobby kiosk.' },
          { id: 'gQ34-uGL7TI', name: 'STUDIO by QBot — eSign + NRIC / Passport Reader', description: 'NRIC Checker in the sign-up flow — insert the MyKad, STUDIO captures the data, signs the waiver and files it to the cloud.' },
        ].map(v => ({
          '@type': 'VideoObject',
          name: v.name,
          description: v.description,
          thumbnailUrl: [`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`, `https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`],
          contentUrl: `https://www.youtube.com/shorts/${v.id}`,
          embedUrl: `https://www.youtube.com/embed/${v.id}`,
          uploadDate: '2026-05-01',
          publisher: { '@id': 'https://qbot.now/#org' },
        })),
        {
          '@type': 'FAQPage',
          mainEntity: [
            { '@type': 'Question', name: 'What is STUDIO?', acceptedAnswer: { '@type': 'Answer', text: "STUDIO is the operating system for membership-based, walk-in businesses — gyms, fitness studios, theme parks, indoor playgrounds, salons, spas, wellness centres, and members' clubs. It runs the whole lifecycle from sign-up to renewal on one platform." } },
            { '@type': 'Question', name: 'Where can members sign up?', acceptedAnswer: { '@type': 'Answer', text: 'Members can sign up at the front counter (staff enters from the dashboard), at a self-service kiosk in the lobby, on their own phone via the online form or customer app, or directly on your company website — whichever channel fits the moment. The NRIC scan, digital waiver, agreement and e-signature are part of the same flow on every channel.' } },
            { '@type': 'Question', name: 'How does the NRIC Checker work?', acceptedAnswer: { '@type': 'Answer', text: "Insert the MyKad into the NRIC reader during sign-up. STUDIO pulls name, IC, address and date of birth straight off the chip — chip-read identity rather than typed-in data. Combined with the digital waiver, agreement and signature on the same screen, the entire registration packet is captured and saved encrypted to the cloud. PDPA-aware by default." } },
            { '@type': 'Question', name: 'Does STUDIO support Face-ID at the door?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Two hardware options — a Face-ID Door Lock for single doors (studios, salons, treatment rooms) and a Face-ID Auto Gate (turnstile or boom-gate) for higher-traffic venues like gyms and theme parks. Same software, same member record, same logs.' } },
            { '@type': 'Question', name: 'How do I see daily reports without logging in?', acceptedAnswer: { '@type': 'Answer', text: "STUDIO sends a daily summary — takings, check-ins, new sign-ups, expiring memberships and at-risk members — straight to your phone every morning by WhatsApp, app push or email. Live alerts for low stock, big refunds and renewal events come in real time. No dashboard chasing." } },
            { '@type': 'Question', name: 'Does STUDIO work for multiple outlets?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. One login runs one outlet or fifty. Each outlet keeps its own branding; reports roll up to head office; staff are scoped to the outlets they work at.' } },
            { '@type': 'Question', name: 'Is STUDIO PDPA-compliant for Malaysian operators?', acceptedAnswer: { '@type': 'Answer', text: 'STUDIO is built PDPA-aware out of the box. NRIC data, biometric records (Face-ID), and signed consents are stored with proper retention, encrypted at rest, with access logs — the way Malaysian operators need to handle it. Members can be exported or removed on request.' } },
            { '@type': 'Question', name: 'How does STUDIO bring members back?', acceptedAnswer: { '@type': 'Answer', text: 'Loyalty points earn on every visit. Birthday-month vouchers fire automatically. Renewal reminders go out before memberships lapse. A 3-month retention nudge lands for members who have stopped coming. Every push lands in the customer app — no manual chasing.' } },
          ],
        },
      ],
    };
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.text = JSON.stringify(data);
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);
}

// ────────────────────────────────────────────────────────────────
// HERO — single headline with a rotating vertical word
// ────────────────────────────────────────────────────────────────
function Hero() {
  const [bg, setBg] = useState(0);
  const [word, setWord] = useState(0);
  const [fade, setFade] = useState(true);

  // Background crossfade
  useEffect(() => {
    const t = setInterval(() => setBg(p => (p + 1) % HERO_BG.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Rotating vertical word ("…for your gym / salon / studio …")
  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setWord(w => (w + 1) % HERO_VERTICALS.length);
        setFade(true);
      }, 220);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 md:px-6 pt-24 md:pt-32 pb-12 md:pb-16 relative overflow-hidden bg-black">
      {HERO_BG.map((src, i) => (
        <div key={i} aria-hidden="true" className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1600ms] ease-in-out"
          style={{ backgroundImage: `url(${src})`, opacity: bg === i ? 1 : 0 }} />
      ))}
      <div aria-hidden="true" className="absolute inset-0 bg-black/70" />
      <div aria-hidden="true" className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(rgba(204,255,0,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="relative z-10 max-w-5xl w-full text-center">
        <p className="text-[10px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#CCFF00] mb-5 md:mb-6">
          All-in-One Platform
        </p>

        <h1 className="text-white font-black uppercase tracking-tight leading-[1.05] max-w-5xl mx-auto text-[34px] sm:text-[50px] md:text-[64px] lg:text-[76px]">
          For Your{' '}
          <span className={`text-[#CCFF00] transition-opacity duration-200 ${fade ? 'opacity-100' : 'opacity-0'}`}>
            {HERO_VERTICALS[word]}
          </span>
        </h1>

        <p className="text-gray-200 text-[14px] md:text-[17px] leading-relaxed max-w-2xl mx-auto mt-7 md:mt-9">
          Still subscribing to 6 different softwares to run your business? Introducing STUDIO. From sign-up to Face-ID check-in to automated renewal — bookings, POS, loyalty, access and a member booking app; all in one platform.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2.5 md:gap-3 mt-8 md:mt-10">
          <a href="#who"
            className="inline-flex items-center px-5 py-3 border-2 border-[#CCFF00]/40 hover:border-[#CCFF00] hover:bg-[#CCFF00]/10 text-white hover:text-[#CCFF00] text-[12px] md:text-[13px] font-bold uppercase tracking-wider transition-colors">
            Who it's for
          </a>
          <a href="#pain"
            className="inline-flex items-center px-5 py-3 border-2 border-[#CCFF00]/40 hover:border-[#CCFF00] hover:bg-[#CCFF00]/10 text-white hover:text-[#CCFF00] text-[12px] md:text-[13px] font-bold uppercase tracking-wider transition-colors">
            Reduce manpower
          </a>
          <a href="#flow"
            className="inline-flex items-center px-5 py-3 border-2 border-[#CCFF00]/40 hover:border-[#CCFF00] hover:bg-[#CCFF00]/10 text-white hover:text-[#CCFF00] text-[12px] md:text-[13px] font-bold uppercase tracking-wider transition-colors">
            Full lifecycle
          </a>
        </div>
      </div>

      <a href="#who" aria-label="Scroll down" className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 hover:text-[#CCFF00] transition-colors flex-col items-center gap-1">
        <span className="text-[9px] font-mono uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown size={16} strokeWidth={2} className="animate-bounce" />
      </a>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// WHO IT'S FOR
// ────────────────────────────────────────────────────────────────
function WhoSection() {
  return (
    <section id="who" className="py-16 md:py-24 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#CCFF00] mb-4">Who it's for</p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-10 md:mb-14 leading-tight max-w-3xl">
            Built for the businesses where customers walk in, book a slot, or hold a membership.
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {AUDIENCE.map(({ Icon, label, sub, img }, i) => (
            <Reveal key={label} delay={i * 0.06}>
              <article className="group border-2 border-white/15 hover:border-[#CCFF00]/60 bg-white/[0.02] h-full overflow-hidden transition-colors flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.03] flex items-center justify-center p-2">
                  <img src={img} alt={label} loading="lazy" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="p-4 md:p-5 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 md:w-8 md:h-8 border border-[#CCFF00]/50 bg-[#CCFF00]/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={14} strokeWidth={2} className="text-[#CCFF00]" />
                    </div>
                    <h3 className="text-white text-[13px] md:text-[15px] font-black uppercase tracking-tight leading-tight">{label}</h3>
                  </div>
                  <p className="text-gray-400 text-[11px] md:text-[12px] leading-snug">{sub}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="text-gray-300 text-[14px] md:text-[15px] leading-relaxed mt-8 md:mt-10 max-w-3xl">
            If your customers walk in, book a slot, or hold a membership — STUDIO runs it.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-8 md:mt-10 border-t border-white/10 pt-6 md:pt-7">
            <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-white/40 mb-3">Also works for</p>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {ALSO_WORKS.map(w => (
                <span key={w} className="inline-block text-[11px] md:text-[12px] text-gray-400 border border-white/10 bg-white/[0.02] px-2.5 py-1">
                  {w}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// 3 PILLARS — More control · More sales · More customers
// ────────────────────────────────────────────────────────────────
const PILLARS: { num: string; eyebrow: string; title: string; mirror: string; body: string; Icon: LucideIcon }[] = [
  {
    num: '01', eyebrow: 'Control', title: 'More control.',
    mirror: 'Tired of spreadsheets? So are we.',
    body: 'Every visit logged. Every credit accounted for. Every membership tracked. Know who walked in, who\'s about to lapse, and who owes what — without opening a file.',
    Icon: Eye,
  },
  {
    num: '02', eyebrow: 'Sales', title: 'More sales.',
    mirror: 'Tired of chasing renewals? Set the rules once.',
    body: 'Auto-renewals fire. Birthday vouchers go out. Expiry reminders convert before members lapse. Revenue compounds in the background — no chasing, no manual lists.',
    Icon: TrendingUp,
  },
  {
    num: '03', eyebrow: 'Customers', title: 'More customers.',
    mirror: 'Tired of losing first-timers to a paper form?',
    body: 'Self-service signup in ten seconds. Online booking around the clock. Trial-to-member built in. Referrals tracked. First-timers walk in without a queue — and come back as regulars.',
    Icon: Heart,
  },
];

function PillarsSection() {
  return (
    <section id="pillars" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(204,255,0,0.08) 0%, transparent 55%)' }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal>
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#CCFF00] mb-4">STUDIO · Built on 3 pillars</p>
          <h2 className="text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 leading-[1.05]">
            More control. More sales. <span className="text-[#CCFF00]">More customers.</span>
          </h2>
          <p className="text-gray-300 text-[13px] md:text-[15px] leading-relaxed max-w-2xl mb-10 md:mb-14">
            STUDIO runs on the same three pillars as everything else in the QBot family — sharpened for membership-based, walk-in businesses.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {PILLARS.map((p, i) => (
            <Reveal key={p.num} delay={i * 0.08}>
              <article className="border-2 border-white/15 hover:border-[#CCFF00]/60 bg-white/[0.02] p-6 md:p-7 h-full transition-colors relative group">
                <div className="absolute top-4 right-4 font-mono text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#CCFF00]/60 group-hover:text-[#CCFF00] transition-colors">
                  {p.num} · {p.eyebrow}
                </div>
                <div className="w-12 h-12 md:w-14 md:h-14 border-2 border-[#CCFF00]/40 bg-[#CCFF00]/10 flex items-center justify-center mb-5 md:mb-6">
                  <p.Icon size={22} strokeWidth={2} className="text-[#CCFF00]" />
                </div>
                <h3 className="text-white text-[22px] md:text-[26px] lg:text-[28px] font-black uppercase tracking-tight leading-[1.05] mb-3">
                  {p.title}
                </h3>
                <p className="text-[#CCFF00]/90 text-[12px] md:text-[13px] font-mono italic mb-3.5 md:mb-4">
                  {p.mirror}
                </p>
                <p className="text-gray-300 text-[13px] md:text-[14px] leading-relaxed">
                  {p.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// PAIN POINTS
// ────────────────────────────────────────────────────────────────
function PainPointsSection() {
  return (
    <section id="pain" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 20% 30%, rgba(204,255,0,0.08) 0%, transparent 55%)' }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal>
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#CCFF00] mb-4">Still doing it the hard way?</p>
          <h2 className="text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 leading-[1.05] max-w-3xl">
            Less admin. <span className="text-[#CCFF00]">More automation.</span> More returning customers.
          </h2>
          <p className="text-gray-300 text-[13px] md:text-[15px] leading-relaxed max-w-2xl mb-10 md:mb-14">
            The four jobs that eat your front desk's day. STUDIO takes them off the floor — so your team stops fighting paperwork and starts running the business.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {PAIN_POINTS.map((p, i) => (
            <Reveal key={p.pain} delay={i * 0.08}>
              <article className="group border-2 border-white/15 hover:border-[#CCFF00]/60 bg-white/[0.02] overflow-hidden h-full flex flex-col transition-colors">
                <div className="relative aspect-[16/9] overflow-hidden bg-white/[0.03] flex items-center justify-center">
                  <img src={p.img} alt={p.imgAlt} loading="lazy" className="max-w-full max-h-full object-contain" />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-2 bg-black/75 backdrop-blur-sm border border-[#CCFF00]/40 px-2.5 py-1">
                    <span className="text-[#CCFF00] text-[10px] font-mono font-bold uppercase tracking-wider">Pain · {String(i + 1).padStart(2, '0')}</span>
                  </div>
                </div>
                <div className="p-5 md:p-7 flex flex-col gap-3">
                  <p className="text-[#CCFF00]/90 text-[13px] md:text-[14px] font-mono italic leading-snug">{p.pain}</p>
                  <p className="text-white text-[15px] md:text-[17px] font-bold leading-snug">{p.fix}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="text-gray-300 text-[12px] md:text-[14px] italic text-center mt-10 md:mt-14 max-w-2xl mx-auto">
            That's STUDIO — every business gets its own web app, every member has their own phone, every visit feeds the next one.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// FLOW DIAGRAM
// ────────────────────────────────────────────────────────────────
function FlowSection() {
  const [active, setActive] = useState(0);
  const [fade, setFade] = useState(true);
  const stripRef = useRef<HTMLDivElement>(null);
  const total = FLOW_STEPS.length;

  const goTo = useCallback((next: number) => {
    const idx = ((next % total) + total) % total;
    setFade(false);
    setTimeout(() => { setActive(idx); setFade(true); }, 180);
  }, [total]);

  const prev = () => goTo(active - 1);
  const next = () => goTo(active + 1);

  // Touch swipe on mobile panel
  const touchStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 48) (dx < 0 ? next : prev)();
    touchStart.current = null;
  };

  // Center the active step pill inside the mobile strip — scroll ONLY the
  // strip's internal horizontal overflow, never the page. (scrollIntoView with
  // block:'nearest' was pulling the whole page down on first load because the
  // pill sits below the hero on landing.)
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const el = strip.querySelector<HTMLElement>(`[data-step="${active}"]`);
    if (!el) return;
    const stripRect = strip.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const targetLeft = strip.scrollLeft + (elRect.left - stripRect.left) - (stripRect.width - elRect.width) / 2;
    strip.scrollTo({ left: targetLeft, behavior: 'smooth' });
  }, [active]);

  // URL hash deep-link: #flow-signup → select that step
  useEffect(() => {
    const slugMap: Record<string, number> = Object.fromEntries(FLOW_STEPS.map((s, i) => [s.slug, i]));
    const fromHash = () => {
      const h = window.location.hash.replace('#', '');
      const match = h.startsWith('flow-') ? h.slice(5) : h === 'flow' ? null : null;
      if (match && slugMap[match] !== undefined) {
        setActive(slugMap[match]);
        setTimeout(() => document.getElementById('flow')?.scrollIntoView({ behavior: 'smooth' }), 80);
      }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const step = FLOW_STEPS[active];
  const StepIcon = step.Icon;

  const imageNode = <img src={step.img} alt={step.imgAlt} loading="lazy" className="w-full h-full object-contain" />;

  return (
    <section id="flow" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 80% 20%, rgba(204,255,0,0.10) 0%, transparent 55%)' }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal>
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#CCFF00] mb-4">Seven things STUDIO does — every day</p>
          <h2 className="text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 leading-[1.05]">
            The whole lifecycle. <span className="text-[#CCFF00]">On one system.</span>
          </h2>
          <p className="text-gray-300 text-[13px] md:text-[15px] leading-relaxed max-w-2xl mb-8 md:mb-12">
            Not modules. Not "everything." The seven jobs a membership business runs every day — tap any step to see the benefit, the mechanics, and what's inside.
          </p>
        </Reveal>

        {/* STEP STRIP — clickable, scrollable on mobile, connecting line on desktop */}
        <div ref={stripRef} className="-mx-4 md:mx-0 overflow-x-auto md:overflow-visible scroll-smooth snap-x snap-mandatory md:snap-none">
          <ol className="flex md:grid md:grid-cols-7 gap-2 md:gap-3 px-4 md:px-0 relative pb-1 md:pb-0 min-w-max md:min-w-0" aria-label="The seven-step STUDIO flow">
            <div aria-hidden="true" className="hidden md:block absolute top-7 lg:top-8 left-[7%] right-[7%] h-px bg-gradient-to-r from-transparent via-[#CCFF00]/40 to-transparent" />
            {FLOW_STEPS.map((s, i) => {
              const isActive = i === active;
              return (
                <li key={s.num} data-step={i} className="snap-center md:snap-none flex-shrink-0 w-[88px] md:w-auto">
                  <button onClick={() => goTo(i)} aria-pressed={isActive} aria-label={`${s.num} ${s.title} — ${s.body}`}
                    className="w-full flex flex-col items-center text-center group focus:outline-none">
                    <span
                      className={`relative z-10 w-14 h-14 md:w-14 md:h-14 lg:w-16 lg:h-16 border-2 flex items-center justify-center transition-all duration-200 ${
                        isActive
                          ? 'border-[#CCFF00] bg-[#CCFF00] text-black shadow-[0_0_24px_rgba(204,255,0,0.4)]'
                          : 'border-[#CCFF00]/40 bg-black text-[#CCFF00] group-hover:border-[#CCFF00] group-hover:bg-[#CCFF00]/10'
                      }`}>
                      <s.Icon size={22} strokeWidth={2} />
                    </span>
                    <span className={`font-mono text-[10px] font-black uppercase tracking-widest mt-2.5 md:mt-3 transition-colors ${isActive ? 'text-[#CCFF00]' : 'text-[#CCFF00]/70'}`}>{s.num}</span>
                    <span className={`text-[12px] md:text-[14px] lg:text-[15px] font-black uppercase tracking-tight mt-1 transition-colors ${isActive ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>{s.title}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {/* ACTIVE STEP PANEL */}
        <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
          className="mt-8 md:mt-12 border-2 border-[#CCFF00]/30 bg-black/40">
          <div className={`grid grid-cols-1 md:grid-cols-2 transition-opacity duration-200 ${fade ? 'opacity-100' : 'opacity-0'}`}>
            {/* Image */}
            <div className="relative aspect-[5/4] sm:aspect-video md:aspect-auto md:min-h-[360px] lg:min-h-[420px] overflow-hidden bg-black border-b md:border-b-0 md:border-r border-[#CCFF00]/20">
              {imageNode}
              <div className="absolute top-3 left-3 inline-flex items-center gap-2 bg-black/80 backdrop-blur-sm border border-[#CCFF00]/40 px-2.5 py-1">
                <StepIcon size={14} className="text-[#CCFF00]" strokeWidth={2} />
                <span className="text-[#CCFF00] text-[10px] font-mono font-bold uppercase tracking-wider">{step.num} · {step.title}</span>
              </div>
            </div>
            {/* Content */}
            <div className="p-5 sm:p-6 md:p-8 lg:p-10 flex flex-col">
              <div className="flex items-baseline gap-3 mb-3 md:mb-4">
                <span className="font-mono text-[12px] md:text-[13px] font-black uppercase tracking-widest text-[#CCFF00]">{step.num} / 07</span>
                <span className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-white/40">{step.title}</span>
              </div>
              <h3 className="text-white text-[22px] sm:text-[26px] md:text-[30px] lg:text-[36px] font-black uppercase tracking-tight leading-[1.05] mb-4 md:mb-5">
                <span className="text-[#CCFF00]">{step.benefit}</span>
              </h3>
              <p className="text-gray-300 text-[13px] sm:text-[14px] md:text-[15px] leading-relaxed mb-5 md:mb-6">
                {step.long}
              </p>
              <ul className="flex flex-wrap gap-1.5 md:gap-2 mb-6 md:mb-8" aria-label={`${step.title} capabilities`}>
                {step.pills.map(p => (
                  <li key={p} className="inline-block border border-[#CCFF00]/30 bg-[#CCFF00]/[0.04] text-[#CCFF00] text-[10px] md:text-[11px] font-mono uppercase tracking-wider px-2.5 py-1">
                    {p}
                  </li>
                ))}
              </ul>

              {/* Controls */}
              <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                <button onClick={prev} aria-label="Previous step"
                  className="inline-flex items-center gap-2 px-4 py-3 min-h-[44px] border-2 border-white/30 hover:border-[#CCFF00] hover:text-[#CCFF00] text-white text-[11px] font-bold uppercase tracking-wider transition-colors">
                  <ChevronLeft size={16} strokeWidth={2.5} /> <span className="hidden sm:inline">Prev</span>
                </button>
                <div className="flex items-center gap-1.5 flex-1 justify-center" role="tablist" aria-label="Jump to step">
                  {FLOW_STEPS.map((_, i) => (
                    <button key={i} onClick={() => goTo(i)} aria-label={`Step ${i + 1}`} aria-selected={i === active} role="tab"
                      className={`h-[3px] transition-all duration-300 ${i === active ? 'w-7 bg-[#CCFF00]' : 'w-2.5 bg-white/30 hover:bg-white/60'}`} />
                  ))}
                </div>
                <button onClick={next} aria-label="Next step"
                  className="inline-flex items-center gap-2 px-4 py-3 min-h-[44px] bg-[#CCFF00] hover:bg-white text-black text-[11px] font-bold uppercase tracking-wider transition-colors">
                  <span className="hidden sm:inline">Next</span> <ChevronRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <Reveal>
          <p className="text-gray-300 text-[12px] md:text-[14px] italic text-center mt-10 md:mt-14 max-w-2xl mx-auto px-2">
            Most software does one piece. STUDIO runs the whole lifecycle in one system.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// HARDWARE — Face-ID at the door
// ────────────────────────────────────────────────────────────────
function HardwareSection() {
  return (
    <section id="hardware" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#CCFF00] mb-4">Two ways to do face-ID at the door</p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 leading-tight">
            Pick the door that fits your space.
          </h2>
          <p className="text-[#CCFF00]/90 text-[13px] md:text-[14px] font-mono italic mb-2">
            Tired of waving people through at peak hour?
          </p>
          <p className="text-gray-300 text-[14px] md:text-[15px] leading-relaxed max-w-2xl mb-10 md:mb-14">
            Pick the hardware that fits your space. Same software, same member record, same logs behind every door.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {HARDWARE.map((h, i) => (
            <Reveal key={h.title} delay={i * 0.08}>
              <article className="border-2 border-white/15 hover:border-[#CCFF00]/60 bg-white/[0.02] overflow-hidden h-full flex flex-col transition-colors">
                <div className="relative aspect-[5/3] overflow-hidden bg-white/[0.03] flex items-center justify-center p-3">
                  <img src={h.img} alt={h.imgAlt} loading="lazy" className="max-w-full max-h-full object-contain" />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-2 bg-black/70 backdrop-blur-sm border border-[#CCFF00]/40 px-2.5 py-1">
                    <h.Icon size={14} className="text-[#CCFF00]" strokeWidth={2} />
                    <span className="text-[#CCFF00] text-[10px] font-mono font-bold uppercase tracking-wider">Hardware</span>
                  </div>
                </div>
                <div className="p-5 md:p-6 flex-1 flex flex-col">
                  <h3 className="text-white text-[18px] md:text-[22px] font-black uppercase tracking-tight leading-tight mb-3">{h.title}</h3>
                  <p className="text-gray-300 text-[13px] md:text-[14px] leading-relaxed mb-4">{h.body}</p>
                  <ul className="space-y-1.5 mt-auto">
                    {h.bullets.map(b => (
                      <li key={b} className="flex items-start gap-2 text-gray-400 text-[12px] md:text-[13px]">
                        <span aria-hidden="true" className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 bg-[#CCFF00]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// VIDEOS — STUDIO in action
// ────────────────────────────────────────────────────────────────
function VideosSection() {
  return (
    <section id="videos" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(204,255,0,0.08) 0%, transparent 55%)' }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal>
          <div className="flex items-center gap-2 mb-4">
            <PlayCircle size={14} strokeWidth={2.5} className="text-[#CCFF00]" />
            <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#CCFF00]">Watch STUDIO in action</p>
          </div>
          <h2 className="text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 leading-[1.05] max-w-3xl">
            See it run. <span className="text-[#CCFF00]">Not just hear about it.</span>
          </h2>
          <p className="text-gray-300 text-[13px] md:text-[15px] leading-relaxed max-w-2xl mb-10 md:mb-14">
            Short, focused looks at the moving parts — the gate, the dashboard, the staff app, the customer experience. They play on loop; open any on YouTube for sound and full screen.
          </p>
        </Reveal>

        <div className="grid gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {VIDEOS.map((v, i) => (
            <Reveal key={`${v.id}-${i}`} delay={Math.min(i * 0.06, 0.24)}>
              <article className="group border-2 border-white/15 hover:border-[#CCFF00]/60 bg-white/[0.02] overflow-hidden h-full flex flex-col transition-colors">
                <div className="relative aspect-[9/16] overflow-hidden bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&mute=1&loop=1&playlist=${v.id}&controls=0&modestbranding=1&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1`}
                    title={`${v.title} — STUDIO by QBot`}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  />
                  <div className="pointer-events-none absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 bg-black/75 backdrop-blur-sm border border-[#CCFF00]/40 px-2 py-0.5">
                    <span aria-hidden="true" className="w-1.5 h-1.5 bg-[#CCFF00] rounded-full qstudio-dot-pulse" />
                    <span className="text-[#CCFF00] text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-wider">Shorts · {String(i + 1).padStart(2, '0')}</span>
                  </div>
                </div>
                <div className="p-4 md:p-5 flex flex-col flex-1">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#CCFF00]/80 mb-1.5">{v.tag}</p>
                  <h3 className="text-white text-[14px] md:text-[15px] font-black uppercase tracking-tight leading-tight mb-2">{v.title}</h3>
                  <p className="text-gray-400 text-[12px] md:text-[13px] leading-snug">{v.desc}</p>
                  <a
                    href={`https://www.youtube.com/shorts/${v.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-wider text-[#CCFF00] hover:text-white transition-colors"
                  >
                    Open on YouTube <ArrowRight size={12} strokeWidth={2.5} />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="text-gray-300 text-[12px] md:text-[14px] italic text-center mt-10 md:mt-14 max-w-2xl mx-auto">
            More demos drop every week on our YouTube — subscribe to follow the build.
          </p>
        </Reveal>
      </div>
    </section>
  );
}


// ────────────────────────────────────────────────────────────────
// COMPARISON
// ────────────────────────────────────────────────────────────────
function CompareSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = COMPARE_ROWS.length;

  // Auto-advance every 4s unless the user is hovering / has clicked
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive(a => (a + 1) % total), 4000);
    return () => clearInterval(t);
  }, [paused, total]);

  const row = COMPARE_ROWS[active];
  const RowIcon = row.Icon;

  return (
    <section id="compare" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 opacity-100" style={{ backgroundImage: `radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal>
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#CCFF00] mb-4">Why STUDIO</p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-5 leading-tight">
            One system <span className="text-[#CCFF00]">vs the usual stack.</span>
          </h2>
          <p className="text-gray-300 text-[14px] md:text-[15px] leading-relaxed mb-10 md:mb-14 max-w-2xl">
            Tap any topic to see the swap. Auto-plays every 4 seconds.
          </p>
        </Reveal>

        {/* TAB STRIP */}
        <Reveal>
          <div className="-mx-4 md:mx-0 overflow-x-auto md:overflow-visible">
            <div className="flex md:grid md:grid-cols-8 gap-2 px-4 md:px-0 pb-1 min-w-max md:min-w-0" role="tablist" aria-label="Compare topics">
              {COMPARE_ROWS.map((r, i) => {
                const isActive = i === active;
                const TabIcon = r.Icon;
                return (
                  <button
                    key={r.label}
                    onClick={() => { setActive(i); setPaused(true); }}
                    role="tab"
                    aria-selected={isActive}
                    className={`group snap-center md:snap-none flex-shrink-0 flex flex-col items-center gap-1.5 py-3 px-3 md:px-2 border-2 transition-all duration-200 ${
                      isActive
                        ? 'border-[#CCFF00] bg-[#CCFF00]/10 shadow-[0_0_20px_rgba(204,255,0,0.18)]'
                        : 'border-white/15 bg-white/[0.02] hover:border-[#CCFF00]/40 hover:bg-[#CCFF00]/5'
                    }`}>
                    <TabIcon size={18} strokeWidth={2} className={isActive ? 'text-[#CCFF00]' : 'text-white/70 group-hover:text-[#CCFF00]'} />
                    <span className={`text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-wider whitespace-nowrap ${isActive ? 'text-[#CCFF00]' : 'text-white/70'}`}>
                      {r.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* ACTIVE PANEL */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="mt-6 md:mt-8 border-2 border-[#CCFF00]/30 bg-black/40 overflow-hidden">
          <div key={active} className="qstudio-compare-fade">
            {/* Header strip */}
            <div className="flex items-center gap-3 px-5 md:px-8 py-4 md:py-5 border-b border-[#CCFF00]/20 bg-[#CCFF00]/[0.04]">
              <div className="w-9 h-9 md:w-11 md:h-11 border-2 border-[#CCFF00]/50 bg-[#CCFF00]/10 flex items-center justify-center">
                <RowIcon size={18} strokeWidth={2} className="text-[#CCFF00]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-white/50">{row.metricLabel}</p>
                <h3 className="text-white text-[16px] md:text-[20px] font-black uppercase tracking-tight leading-tight truncate">{row.label}</h3>
              </div>
              <p className="hidden sm:block font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-white/40">
                {String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </p>
            </div>

            {/* Versus body */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-stretch">
              {/* USUAL */}
              <div className="p-5 md:p-8 lg:p-10 flex flex-col items-center text-center bg-white/[0.02] relative">
                <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-white/40 mb-3">The usual stack</p>
                <div className="qstudio-metric-them text-white/40 font-black tracking-tight leading-none text-[34px] sm:text-[44px] md:text-[60px] lg:text-[76px] break-words max-w-full mb-3 relative">
                  <span className="line-through decoration-2 decoration-red-400/70">{row.themMetric}</span>
                </div>
                <p className="text-gray-400 text-[13px] md:text-[14px] leading-snug max-w-[28ch]">{row.them}</p>
                <div className="qstudio-bar-them mt-5 md:mt-6 h-1 w-full max-w-[200px] bg-white/10 overflow-hidden">
                  <div className="h-full bg-red-400/50" />
                </div>
                <p className="font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-red-300/70 mt-2">Slow · Manual</p>
              </div>

              {/* VS divider */}
              <div className="hidden md:flex flex-col items-center justify-center px-2 relative">
                <div aria-hidden="true" className="absolute inset-y-6 left-1/2 w-px bg-white/10" />
                <div className="relative w-12 h-12 border-2 border-[#CCFF00] bg-black flex items-center justify-center font-mono text-[11px] font-black uppercase tracking-wider text-[#CCFF00] qstudio-vs-pulse">
                  VS
                </div>
              </div>
              <div className="md:hidden flex items-center justify-center py-3 border-y border-white/5">
                <div className="px-3 py-1 border-2 border-[#CCFF00] bg-black font-mono text-[10px] font-black uppercase tracking-wider text-[#CCFF00]">VS</div>
              </div>

              {/* STUDIO */}
              <div className="p-5 md:p-8 lg:p-10 flex flex-col items-center text-center bg-[#CCFF00]/[0.06] relative">
                <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-[#CCFF00] mb-3">STUDIO</p>
                <div className="qstudio-metric-us text-[#CCFF00] font-black tracking-tight leading-none text-[34px] sm:text-[44px] md:text-[60px] lg:text-[76px] break-words max-w-full mb-3 drop-shadow-[0_0_18px_rgba(204,255,0,0.35)]">
                  {row.usMetric}
                </div>
                <p className="text-white text-[13px] md:text-[14px] font-medium leading-snug max-w-[28ch]">{row.us}</p>
                <div className="qstudio-bar-us mt-5 md:mt-6 h-1 w-full max-w-[200px] bg-white/10 overflow-hidden">
                  <div className="h-full bg-[#CCFF00]" />
                </div>
                <p className="font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[#CCFF00] mt-2">Fast · Automatic</p>
              </div>
            </div>

            {/* Progress + controls */}
            <div className="px-5 md:px-8 py-3 md:py-4 border-t border-white/10 flex items-center gap-3">
              <button
                onClick={() => { setActive(a => (a - 1 + total) % total); setPaused(true); }}
                aria-label="Previous comparison"
                className="w-11 h-11 md:w-9 md:h-9 border border-white/30 hover:border-[#CCFF00] hover:text-[#CCFF00] text-white/70 flex items-center justify-center transition-colors shrink-0">
                <ChevronLeft size={14} strokeWidth={2.5} />
              </button>
              <div className="flex-1 h-0.5 bg-white/10 overflow-hidden relative">
                <div
                  key={`bar-${active}-${paused ? 'p' : 'r'}`}
                  className={`h-full bg-[#CCFF00] origin-left ${paused ? '' : 'qstudio-progress'}`}
                  style={{ width: paused ? `${((active + 1) / total) * 100}%` : undefined }} />
              </div>
              <button
                onClick={() => { setActive(a => (a + 1) % total); setPaused(true); }}
                aria-label="Next comparison"
                className="w-11 h-11 md:w-9 md:h-9 border border-white/30 hover:border-[#CCFF00] hover:text-[#CCFF00] text-white/70 flex items-center justify-center transition-colors shrink-0">
                <ChevronRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        <Reveal>
          <p className="text-gray-400 text-[12px] md:text-[13px] italic text-center mt-8 md:mt-10 max-w-2xl mx-auto">
            Four tools, three vendors, zero of them talking to each other — that's the usual stack. STUDIO joins it up.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// BUILT TO FIT
// ────────────────────────────────────────────────────────────────
function ModularSection() {
  return (
    <section id="modular" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 20% 50%, rgba(204,255,0,0.08) 0%, transparent 60%)' }} />
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <Reveal>
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#CCFF00] mb-4">Built to fit your business</p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-5 leading-tight">
            Configured for your business. <span className="text-[#CCFF00]">Not a template.</span>
          </h2>
          <p className="text-[#CCFF00]/90 text-[13px] md:text-[14px] font-mono italic mb-3 max-w-2xl mx-auto">
            Tired of paying for features you'll never use?
          </p>
          <p className="text-gray-300 text-[15px] md:text-[17px] leading-relaxed max-w-2xl mx-auto mb-8 md:mb-10">
            STUDIO is modular. A pilates studio doesn't need theme-park ticketing. A salon doesn't need climbing-wall passes. We configure what fits your business and leave out what doesn't — so you only pay for what you actually run.
          </p>
          <a href={WA_TELLUS} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 md:px-8 py-3.5 md:py-4 bg-[#CCFF00] hover:bg-white text-black text-[12px] md:text-[13px] font-black uppercase tracking-wider transition-colors">
            <MessageCircle size={14} strokeWidth={2.5} /> Tell us about your business <ArrowRight size={14} strokeWidth={2.5} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// PLUGINS — exciting optional add-ons (kept secondary to the core)
// ────────────────────────────────────────────────────────────────
function PluginsSection() {
  return (
    <section id="plugins" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#CCFF00] mb-4">Plugins &amp; add-ons</p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-5 leading-tight max-w-3xl">
            Switch on more <span className="text-[#CCFF00]">when you're ready.</span>
          </h2>
          <p className="text-gray-300 text-[15px] md:text-[17px] leading-relaxed max-w-2xl mb-10 md:mb-14">
            The core runs your day — sign-up, membership, check-in, booking, rewards, reports. These click on top when you want them. No migration, no second system to learn.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {PLUGINS.map(({ Icon, tag, title, body }, i) => (
            <Reveal key={title} delay={i * 0.05}>
              <article className="group border-2 border-white/15 bg-white/[0.02] hover:border-[#CCFF00]/50 transition-colors p-6 md:p-7 h-full">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 md:w-12 md:h-12 border-2 border-[#CCFF00]/40 bg-[#CCFF00]/10 flex items-center justify-center">
                    <Icon size={20} strokeWidth={2} className="text-[#CCFF00]" />
                  </div>
                  <span className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#CCFF00]/70 border border-[#CCFF00]/30 px-2 py-1">{tag}</span>
                </div>
                <h3 className="text-white text-[16px] md:text-[18px] font-black uppercase tracking-tight leading-tight mb-2.5">{title}</h3>
                <p className="text-gray-300 text-[13px] md:text-[14px] leading-relaxed">{body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="text-white/40 text-[11px] md:text-[12px] font-mono uppercase tracking-[0.18em] mt-8 md:mt-10 text-center">
            Plus ticketing, access rules, app push notifications, NRIC verify &amp; more — switched on per outlet, only what you run.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// RELIABILITY
// ────────────────────────────────────────────────────────────────
function ReliabilitySection() {
  return (
    <section id="reliability" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#CCFF00] mb-4">Built to be relied on</p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-10 md:mb-14 leading-tight max-w-3xl">
            The boring stuff that matters.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {RELIABILITY.map(({ Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 0.06}>
              <article className="border-2 border-white/15 bg-white/[0.02] p-6 md:p-7 h-full">
                <div className="w-11 h-11 md:w-12 md:h-12 border-2 border-[#CCFF00]/40 bg-[#CCFF00]/10 flex items-center justify-center mb-5">
                  <Icon size={20} strokeWidth={2} className="text-[#CCFF00]" />
                </div>
                <h3 className="text-white text-[16px] md:text-[18px] font-black uppercase tracking-tight leading-tight mb-2.5">{title}</h3>
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
// FINAL CTA
// ────────────────────────────────────────────────────────────────
function FinalCta() {
  return (
    <section id="demo" className="py-20 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-60" style={{ backgroundImage: 'radial-gradient(rgba(204,255,0,0.10) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <Reveal>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.95] mb-5">
            See your business <span className="text-[#CCFF00]">running on it.</span>
          </h2>
          <p className="text-[#CCFF00]/90 text-[13px] md:text-[14px] font-mono italic mb-3 max-w-xl mx-auto">
            Tired of demos that show generic screens?
          </p>
          <p className="text-gray-300 text-[15px] md:text-[17px] leading-relaxed max-w-xl mx-auto mb-8 md:mb-10">
            Book a 20-minute walk-through. We'll show STUDIO configured to a business like yours — sign-up flow, hardware fit, the works.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
            <a href={WA_DEMO} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 md:px-10 py-4 md:py-5 bg-[#CCFF00] hover:bg-white text-black text-[13px] md:text-[15px] font-black uppercase tracking-wider transition-colors">
              <MessageCircle size={16} strokeWidth={2.5} /> Book a demo <ArrowRight size={16} strokeWidth={2.5} />
            </a>
            <a href={WA_TELLUS} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 md:px-8 py-4 md:py-5 border-2 border-white/30 hover:border-white text-white text-[12px] md:text-[14px] font-bold uppercase tracking-wider transition-colors">
              Tell us about your business <ArrowRight size={14} strokeWidth={2.5} />
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
      const demo = document.getElementById('demo');
      const nearEnd = demo ? demo.getBoundingClientRect().top < window.innerHeight * 0.85 : false;
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
        <a href={WA_DEMO} target="_blank" rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#CCFF00] text-black text-[12px] font-black uppercase tracking-wider px-4 py-3 min-h-[44px]">
          <MessageCircle size={14} strokeWidth={2.5} /> Book a demo
        </a>
        <a href={WA_TELLUS} target="_blank" rel="noopener noreferrer" aria-label="Tell us about your business"
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
export default function QStudioPage() {
  useJsonLd();

  return (
    <div className="bg-black min-h-screen text-white selection:bg-[#CCFF00] selection:text-black overflow-x-hidden">
      <SEOHead
        noTitleSuffix
        title="All-in-One Platform for Fitness & Wellness"
        description="Face-ID check-in. No manual admin. Bookings from web, app or front counter. Staff, commissions and integrated reports — all in one."
        keywords="qstudio, studio by qbot, gym management software malaysia, studio management software malaysia, yoga studio software, pilates studio software, theme park management software, indoor playground software malaysia, salon software malaysia, spa management software, members club software, face id access control gym, biometric gym entry, NRIC checker malaysia, mykad reader membership, digital waiver malaysia, e-signature membership, self service kiosk gym malaysia, membership booking system malaysia, class booking software malaysia, loyalty rewards software malaysia, recurring membership billing malaysia, fiuu membership payment, multi outlet membership software, PDPA compliant membership software, daily business report whatsapp push notifications"
        image="https://qbot.now/qfitimg/studioimg/02_checkin.jpg"
        imageWidth={4500}
        imageHeight={3000}
        imageAlt="STUDIO by QBot — Face-ID auto-gate check-in at a Malaysian gym, no queue at the door"
        url="https://qbot.now/qstudio"
      />

      <QStudioHeader />

      <main id="main" role="main">
        <Hero />
        <WhoSection />
        <PillarsSection />
        <PainPointsSection />
        <FlowSection />
        <HardwareSection />
        <VideosSection />
        <PluginsSection />
        <CompareSection />
        <ModularSection />
        <ReliabilitySection />
        <FinalCta />
      </main>

      <StickyMobileCta />
      <QStudioFooter />

      {/* Decorative keyframes */}
      <style>{`
        @keyframes qstudio-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes qstudio-reveal {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes qstudio-compare-fade-in {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .qstudio-compare-fade { animation: qstudio-compare-fade-in 0.45s cubic-bezier(0.16,1,0.3,1); }

        @keyframes qstudio-metric-them-in {
          0% { opacity: 0; transform: translateX(-12px); filter: blur(2px); }
          60% { opacity: 1; transform: translateX(0); filter: blur(0); }
          100% { opacity: 0.55; transform: translateX(0); filter: blur(0); }
        }
        .qstudio-metric-them { animation: qstudio-metric-them-in 1.1s ease-out both; }

        @keyframes qstudio-metric-us-in {
          0% { opacity: 0; transform: scale(0.85); }
          55% { opacity: 1; transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }
        .qstudio-metric-us { animation: qstudio-metric-us-in 0.7s cubic-bezier(0.16,1,0.3,1) both; }

        @keyframes qstudio-bar-them-fill {
          0% { width: 0; }
          100% { width: 32%; }
        }
        .qstudio-bar-them > div { animation: qstudio-bar-them-fill 1.4s linear both; }

        @keyframes qstudio-bar-us-fill {
          0% { width: 0; }
          70% { width: 100%; }
          100% { width: 100%; }
        }
        .qstudio-bar-us > div { animation: qstudio-bar-us-fill 0.55s cubic-bezier(0.16,1,0.3,1) 0.25s both; }

        @keyframes qstudio-vs-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(204,255,0,0.45); }
          50%      { transform: scale(1.08); box-shadow: 0 0 0 8px rgba(204,255,0,0); }
        }
        .qstudio-vs-pulse { animation: qstudio-vs-pulse 2.2s ease-in-out infinite; }

        @keyframes qstudio-progress-fill {
          0% { width: 0; }
          100% { width: 100%; }
        }
        .qstudio-progress { animation: qstudio-progress-fill 4s linear forwards; }

        @keyframes qstudio-dot-pulse {
          0%, 100% { transform: scale(1);   opacity: 1; box-shadow: 0 0 0 0 rgba(204,255,0,0.55); }
          50%      { transform: scale(1.3); opacity: 0.85; box-shadow: 0 0 0 6px rgba(204,255,0,0); }
        }
        .qstudio-dot-pulse { animation: qstudio-dot-pulse 1.6s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .qstudio-compare-fade,
          .qstudio-metric-them,
          .qstudio-metric-us,
          .qstudio-bar-them > div,
          .qstudio-bar-us > div,
          .qstudio-vs-pulse,
          .qstudio-progress,
          .qstudio-dot-pulse { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
