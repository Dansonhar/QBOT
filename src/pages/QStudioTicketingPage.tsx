import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import {
  ArrowRight, ChevronRight, ChevronLeft, ChevronDown,
  MessageCircle, Send, Sparkles, Instagram,
  Ticket, Landmark, PartyPopper, ToyBrick,
  ShoppingCart, DoorOpen, CreditCard, Puzzle,
  Eye, Database, TrendingUp, Activity,
  ScanLine, Smartphone, Plane,
  type LucideIcon,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';

// ────────────────────────────────────────────────────────────────
// BRAND COLOR — orange (instead of the green used on /qstudio)
//   primary:   #FF6B00
//   alpha rgba(255,107,0, X)
// ────────────────────────────────────────────────────────────────

const WA = 'https://wa.me/60126909189?text=Hi%20I%27m%20interested%20in%20Studio%20Ticketing';
const WA_DEMO = 'https://wa.me/60126909189?text=' + encodeURIComponent("Hi, I'd like to book a Studio Ticketing demo at Publika KL.");
const WA_TELLUS = 'https://wa.me/60126909189?text=' + encodeURIComponent(
  "Hi! I'd like to tell you about my ticketed venue and see what fits.\n- Venue type (theme park / museum / playland / event):\n- Daily / annual visitors:\n- What I need (tickets / annual pass / Face-ID gates / kiosk / OTA / cashless / reports):\n\nThanks!"
);

const HERO_BG = [
  '/qfitimg/studioimg/for_outdoor_theme.jpg',
  '/qfitimg/studioimg/for_indoor_theme.jpg',
  '/qfitimg/studioimg/for_museums.jpg',
  '/qfitimg/studioimg/for_events.jpg',
];

const HERO_HEADLINES = [
  'Stop juggling counter sales, OTAs, and turnstile counts manually.',
  'Guests buy tickets online, on the app, at the counter or the kiosk.',
  'Face-ID or QR at the gate — they walk in. No queue. No torn stubs.',
  'Less admin. More automation. More return visitors.',
  'One system runs parks, museums, playlands and ticketed events.',
];

// ────────────────────────────────────────────────────────────────
// AUDIENCE
// ────────────────────────────────────────────────────────────────
const AUDIENCE: { Icon: LucideIcon; label: string; sub: string; img: string }[] = [
  { Icon: Ticket,       label: 'Outdoor Theme Parks',    sub: 'Day tickets, ride passes, season passes, group bookings.', img: '/qfitimg/studioimg/for_outdoor_theme.jpg' },
  { Icon: ToyBrick,     label: 'Indoor Playlands',       sub: 'Hourly play, weekday passes, party packages.',             img: '/qfitimg/studioimg/for_indoor_theme.jpg' },
  { Icon: Landmark,     label: 'Museums & Galleries',    sub: 'Timed entry, exhibition tickets, school groups.',          img: '/qfitimg/studioimg/for_museums.jpg' },
  { Icon: PartyPopper,  label: 'Ticketed Events & Shows', sub: 'Concerts, festivals, exhibitions, conferences.',          img: '/qfitimg/studioimg/for_events.jpg' },
];

const ALSO_WORKS = [
  'Water Parks', 'Aquariums', 'Zoos', 'Trampoline Parks',
  'Escape Rooms', 'VR Arcades', 'Karting', 'Mini Golf',
  'Adventure Parks', 'Heritage Sites', 'Sports Stadiums', 'Cultural Centres',
  'Pop-up Experiences',
];

// ────────────────────────────────────────────────────────────────
// HARDWARE
// ────────────────────────────────────────────────────────────────
const HARDWARE: { title: string; img: string }[] = [
  { title: 'Anti Tailgating Premium Gate', img: '/quotesys_images/studio-06premiumantitailgate.jpg' },
  { title: 'Face ID Premium Swing Gate',   img: '/quotesys_images/studio-05premium.jpg' },
  { title: 'Face ID Simple Swing Gate',    img: '/quotesys_images/studio-04costeffective.jpg' },
  { title: 'Face ID Space Gate',           img: '/quotesys_images/studio-03spacesave.jpg' },
  { title: 'Face ID Rotary Tripod',        img: '/quotesys_images/studio-02tripod.jpg' },
  { title: 'Face ID Door Lock',            img: '/quotesys_images/studio-01faceid.jpg' },
];

// Sell-side hardware — same Studio software, every counter / kiosk / handheld.
// Catalog mirror of quotesysCatalog.ts (no prices on the marketing surface).
const SELL_HARDWARE: { title: string; img: string }[] = [
  { title: 'Sunmi D3 Pro',         img: '/quotesys_images/sunmi_d3_pro.jpg' },
  { title: 'Sunmi V3 Mix',         img: '/quotesys_images/sunmi_v3_mix.jpg' },
  { title: 'Sunmi cPad',           img: '/quotesys_images/ipad.jpg' },
  { title: 'Sunmi V3 Handheld',    img: '/quotesys_images/sunmi_v3_terminal.jpg' },
  { title: 'Sunmi K2 Kiosk',       img: '/quotesys_images/sunmi_k2.jpg' },
  { title: 'Q1 Desktop Kiosk',     img: '/quotesys_images/kiosk_q1_desktop.jpg' },
];

// ────────────────────────────────────────────────────────────────
// COMPARISON
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
  { label: 'Ticket sales', Icon: ShoppingCart,   them: 'Counter only. OTA in a spreadsheet.',     us: 'Webstore, app, counter, kiosk, OTA — one inventory.', themMetric: '1 CH',    usMetric: '5 CH',     metricLabel: 'Sales channels' },
  { label: 'Check-in',     Icon: DoorOpen,       them: 'Torn stub. Visual check.',                  us: 'Face-ID or QR. Gate opens.',                          themMetric: '15 SEC',  usMetric: '1 SEC',    metricLabel: 'Time at the gate' },
  { label: 'Annual Pass',  Icon: CreditCard,     them: 'Card or plastic. Easy to share.',          us: 'Face-bound. One guest, one pass.',                   themMetric: 'SHARED',  usMetric: 'LOCKED',   metricLabel: 'Pass integrity' },
  { label: 'In-park spend',Icon: CreditCard,     them: 'Cash, multiple POS systems.',               us: 'Cashless wristband, single ledger.',                 themMetric: 'WALLET',  usMetric: 'WRISTBAND', metricLabel: 'How guests pay inside' },
  { label: 'OTA platforms',Icon: Plane,          them: 'Manual reconcile. Email vouchers.',         us: 'Live sync. Scan and go.',                            themMetric: 'MANUAL',  usMetric: 'AUTO',     metricLabel: 'OTA flow' },
  { label: 'Multi-venue',  Icon: Puzzle,         them: 'One license per park.',                     us: 'One login. HQ rollup.',                              themMetric: 'N LOGINS',usMetric: '1 LOGIN',  metricLabel: 'Access' },
  { label: 'Reports',      Icon: Send,           them: 'Log in. Hope dashboard loads.',             us: 'Daily summary to your phone.',                       themMetric: 'PULL',    usMetric: 'PUSH',     metricLabel: 'How you find out' },
  { label: 'Re-visits',    Icon: Activity,       them: 'No data. No nudge. No return.',             us: 'Re-visit campaigns fire automatically.',             themMetric: 'MANUAL',  usMetric: 'AUTO',     metricLabel: 'Bring guests back' },
];

// ────────────────────────────────────────────────────────────────
// MOBILE APP — branded, integrated
// ────────────────────────────────────────────────────────────────
const APP_BULLETS: { Icon: LucideIcon; title: string; body: string }[] = [
  {
    Icon: Smartphone,
    title: 'Your brand, your icon, your app',
    body: "Your park, museum or event lives on the home screen with your name, your colours, your icon. Guests download once and come back to the same place every visit.",
  },
  {
    Icon: ShoppingCart,
    title: 'Tickets, passes, top-ups — one app',
    body: 'Guests buy day tickets, renew annual passes, book timed slots, top up cashless wristbands, and reserve ride slots — all from the same app, with their cards on file.',
  },
  {
    Icon: ScanLine,
    title: 'Wallet-free park',
    body: 'Cashless wristbands, vending-machine top-ups, in-park F&B, game counters — everything bills to the guest profile. No bills, no cards, no fumbling at the till.',
  },
  {
    Icon: Plane,
    title: 'Integrated with OTAs',
    body: "Klook, KKday, Trip.com — synced live, vouchers scanned at the gate, reconciled automatically. One ledger, every channel.",
  },
];

// ────────────────────────────────────────────────────────────────
// PAIN POINTS
// ────────────────────────────────────────────────────────────────
const PAIN_POINTS: { pain: string; fix: string; img: string; imgAlt: string }[] = [
  {
    pain: 'Still selling tickets one channel at a time — and reconciling OTAs by hand?',
    fix: 'Guests buy tickets from your webstore, mobile app, ticket counter, self-service kiosk or OTA — every channel on one inventory. Counter, kiosk and OTA all settle to the same ledger, automatically.',
    img: '/qfitimg/studioimg/ticketing_app.jpg',
    imgAlt: 'Guests buying tickets across webstore, kiosk, counter, app and OTA platforms',
  },
  {
    pain: 'Torn stubs, printed QRs, and a gate that can\'t breathe at peak hour?',
    fix: 'Face-ID auto-gate for annual-pass holders, QR turnstile for day-ticket guests. Every guest walks in in under a second. No queue. No torn stubs.',
    img: '/qfitimg/studioimg/ticketing_faceid.jpg',
    imgAlt: 'Face-ID auto-gate and QR turnstile checking guests in with no queue',
  },
  {
    pain: 'Visitors come once and never come back?',
    fix: 'Every visit earns loyalty points. Birthday tickets, pass-renewal reminders and 6-month re-visit nudges fire automatically — so they come back without you chasing.',
    img: '/qfitimg/studioimg/ticketing_loyalty.jpg',
    imgAlt: 'Loyalty points, birthday tickets and re-visit nudges landing in the guest app',
  },
  {
    pain: 'Can\'t tell how the day went without logging into three different systems?',
    fix: 'Daily takings, footfall by hour, channel splits, OTA reconciliation and slow-day alerts — pushed straight to your phone every morning. The park runs while you watch.',
    img: '/qfitimg/studioimg/ticketing_data.jpg',
    imgAlt: 'Daily ticketing report on a phone — takings, footfall, channel splits and OTA reconciliation',
  },
];

// ────────────────────────────────────────────────────────────────
// RELIABILITY
// ────────────────────────────────────────────────────────────────
const RELIABILITY = [
  { Icon: Activity, title: 'Quiet in the background.', body: "Public holiday, packed lot, queue at the kiosk — Studio handles it without a hiccup. You forget it's there until you check the report." },
  { Icon: Database,  title: 'Your data is yours.',      body: 'Guests, sales, history, gate logs, OTA splits — export to CSV or PDF anytime. No lock-in. No data held hostage if you ever want to leave.' },
  { Icon: TrendingUp, title: 'Grows with you.',         body: "One park today, fifty tomorrow — same system, same login, same dashboard. Add a venue without re-buying the platform." },
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
  'No more torn stubs. No more printed QRs. No more reconciling OTAs by hand.',
  'Tickets, annual passes, gates and reports — all on one platform.',
  'Built for theme parks, museums, playlands and ticketed events.',
];

function QTicketHeader() {
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
    { label: 'Hardware',     href: '#hardware' },
    { label: 'Sell anywhere', href: '#sell' },
    { label: 'Mobile app',   href: '#app' },
    { label: 'Why Studio',   href: '#compare' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50" role="banner">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-[#FF6B00] focus:text-black focus:px-3 focus:py-1.5 focus:text-[11px] focus:font-bold focus:uppercase">
        Skip to content
      </a>

      <div className="bg-[#111] text-white hidden lg:block">
        <div className="container mx-auto px-4 md:px-6 lg:px-12 py-1.5 flex items-center justify-between">
          <div className="flex items-center divide-x divide-gray-300 text-[10px] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 pr-4 text-gray-400">
              <Sparkles size={10} strokeWidth={2.5} className="text-[#FF6B00]" />
              Studio Ticketing by QBot
            </span>
            <span className="px-4 text-gray-400">Mon–Fri · 10AM–7PM</span>
            <span className={`pl-4 text-[#FF6B00] transition-opacity duration-300 ${annFade ? 'opacity-100' : 'opacity-0'}`}>
              {ANNOUNCEMENTS[annIdx]}
            </span>
          </div>
          <div className="flex items-center gap-4 divide-x divide-gray-600">
            <a href={WA} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors">
              <MessageCircle size={10} strokeWidth={2.5} />
              +6012-6909-189
            </a>
            <a href="/qstudio" className="pl-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#FF6B00] hover:text-white transition-colors">
              Studio (gyms & wellness) <ArrowRight size={10} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </div>

      <nav className={`transition-all duration-300 bg-black/90 backdrop-blur-xl backdrop-saturate-150 border-b border-white/10 ${scrolled ? 'shadow-sm' : ''}`} aria-label="Primary">
        <div className="container mx-auto px-4 md:px-6 lg:px-12 py-3 md:py-4">
          <div className="flex items-center">
            <a href="/qstudio/ticketing" className="flex items-center gap-2 group mr-10" aria-label="Studio Ticketing home">
              <img src="/qbotlogo.svg" alt="Studio Ticketing logo" className="w-9 h-9 md:w-10 md:h-10 brightness-0 invert" />
              <span className="text-white text-[16px] md:text-[18px] font-black uppercase tracking-[0.15em] leading-none">
                Ticketing
              </span>
            </a>

            <div className="hidden lg:flex items-center space-x-7 xl:space-x-9">
              {navItems.map(item => (
                <a key={item.label} href={item.href} className="text-[11px] font-bold tracking-[0.1em] uppercase text-white hover:text-[#FF6B00] transition-colors duration-200">
                  {item.label}
                </a>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-5 ml-auto">
              <a href={WA_DEMO} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6B00] hover:bg-white text-black text-[11px] font-bold uppercase tracking-wider transition-colors">
                <MessageCircle size={14} strokeWidth={2} /> Book a demo <ChevronRight size={14} strokeWidth={2.5} />
              </a>
            </div>

            <div className="lg:hidden flex items-center ml-auto gap-2">
              <a href={WA_DEMO} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6B00] text-black text-[10px] font-bold uppercase tracking-wider">
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
              {[...navItems, { label: 'Book a demo', href: WA_DEMO }, { label: 'Studio (gyms & wellness)', href: '/qstudio' }].map(item => (
                <a key={item.label} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  onClick={() => setMobileMenu(false)}
                  className="text-[13px] font-bold uppercase tracking-wider text-white hover:text-[#FF6B00] min-h-[44px] py-3 px-2 flex items-center transition-colors">
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
function QTicketFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="relative bg-black text-white border-t border-white/10" role="contentinfo">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <img src="/qbotlogo.svg" alt="QBot logo" className="w-12 h-12 brightness-0 invert" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wide mb-1.5">The operating system for ticketed venues.</p>
            <p className="text-[11px] text-gray-400 leading-relaxed mb-5">Tickets. Annual passes. Face-ID & QR gates. OTA. Cashless. Reports. From sale to re-visit — on one system.</p>
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/qbotmalaysia" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-500 hover:text-[#FF6B00] transition-colors"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
              <a href="https://www.instagram.com/qbotfuture" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-500 hover:text-[#FF6B00] transition-colors"><Instagram size={16} strokeWidth={2} /></a>
              <a href="https://www.tiktok.com/@qbotfuture" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-gray-500 hover:text-[#FF6B00] transition-colors"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg></a>
            </div>
          </div>

          <div>
            <p className="text-[10px] text-[#FF6B00] font-bold uppercase tracking-[0.15em] mb-3">Platform</p>
            <ul className="space-y-1.5">
              {[
                { label: 'Pain points',    href: '#pain' },
                { label: 'Hardware',       href: '#hardware' },
                { label: 'Sell anywhere',  href: '#sell' },
                { label: 'Mobile app',     href: '#app' },
                { label: 'Why Studio',     href: '#compare' },
              ].map(item => (
                <li key={item.label}><a href={item.href} className="text-[12px] text-gray-400 hover:text-white transition-colors block py-1 min-h-[32px]">{item.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] text-[#FF6B00] font-bold uppercase tracking-[0.15em] mb-3">Hardware</p>
            <ul className="space-y-1.5 mb-6">
              <li><a href="#hardware" className="text-[12px] text-gray-400 hover:text-white transition-colors">Face-ID Auto Gate</a></li>
              <li><a href="#hardware" className="text-[12px] text-gray-400 hover:text-white transition-colors">QR Turnstile & Counter Scan</a></li>
            </ul>
            <p className="text-[10px] text-white font-bold uppercase tracking-[0.15em] mb-3">Also by QBot</p>
            <ul className="space-y-1.5">
              <li><a href="/" className="text-[12px] text-gray-400 hover:text-white transition-colors">QPOS — F&amp;B / Retail POS</a></li>
              <li><a href="/qstudio" className="text-[12px] text-gray-400 hover:text-white transition-colors">Studio — Gym & Wellness</a></li>
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
                className="inline-block bg-[#FF6B00] hover:bg-white text-black text-[10px] font-bold uppercase tracking-wider px-5 py-2.5 transition-colors">
                Book a demo
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-[11px] text-gray-500">
          <p>&copy; {currentYear} QBot — Studio Ticketing is part of the QBot product family.</p>
        </div>
      </div>
    </footer>
  );
}

// ────────────────────────────────────────────────────────────────
// HERO
// ────────────────────────────────────────────────────────────────
function Hero() {
  const [bg, setBg] = useState(0);
  const [headline, setHeadline] = useState(0);
  const [fade, setFade] = useState(true);
  const total = HERO_HEADLINES.length;

  useEffect(() => {
    const t = setInterval(() => setBg(p => (p + 1) % HERO_BG.length), 5000);
    return () => clearInterval(t);
  }, []);

  const swap = useCallback((next: number) => {
    setFade(false);
    setTimeout(() => { setHeadline(((next % total) + total) % total); setFade(true); }, 220);
  }, [total]);

  const prev = () => swap(headline - 1);
  const next = () => swap(headline + 1);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headline]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 md:px-6 pt-24 md:pt-32 pb-12 md:pb-16 relative overflow-hidden bg-black">
      {HERO_BG.map((src, i) => (
        <div key={i} aria-hidden="true" className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1600ms] ease-in-out"
          style={{ backgroundImage: `url(${src})`, opacity: bg === i ? 1 : 0 }} />
      ))}
      <div aria-hidden="true" className="absolute inset-0 bg-black/70" />
      <div aria-hidden="true" className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(rgba(255,107,0,0.08) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="relative z-10 max-w-5xl w-full text-center">
        <p className="text-[10px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#FF6B00] mb-5 md:mb-6">
          Studio Ticketing
        </p>

        <div className="flex items-center gap-2 md:gap-4 justify-center">
          <button onClick={prev} aria-label="Previous headline"
            className="hidden md:flex flex-shrink-0 w-12 h-12 border-2 border-white/30 hover:border-[#FF6B00] hover:bg-[#FF6B00]/10 text-white hover:text-[#FF6B00] transition-colors items-center justify-center">
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>

          <h1 aria-live="polite"
            className={`flex-1 max-w-3xl text-white text-[22px] sm:text-[30px] md:text-[42px] lg:text-[52px] font-black uppercase tracking-tight leading-[1.05] min-h-[5em] sm:min-h-[4em] md:min-h-[2.6em] flex items-center justify-center transition-opacity duration-200 ${fade ? 'opacity-100' : 'opacity-0'}`}>
            {HERO_HEADLINES[headline]}
          </h1>

          <button onClick={next} aria-label="Next headline"
            className="hidden md:flex flex-shrink-0 w-12 h-12 border-2 border-white/30 hover:border-[#FF6B00] hover:bg-[#FF6B00]/10 text-white hover:text-[#FF6B00] transition-colors items-center justify-center">
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex items-center justify-center gap-3 md:gap-4 mt-4 md:mt-6">
          <button onClick={prev} aria-label="Previous headline"
            className="md:hidden flex-shrink-0 w-11 h-11 border-2 border-white/30 active:border-[#FF6B00] active:bg-[#FF6B00]/10 text-white transition-colors flex items-center justify-center">
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
          <div className="flex items-center gap-2" role="tablist" aria-label="Hero headlines">
            {HERO_HEADLINES.map((_, i) => (
              <button key={i} onClick={() => swap(i)} aria-label={`Go to headline ${i + 1}`} aria-selected={i === headline} role="tab"
                className={`h-[3px] transition-all duration-300 ${i === headline ? 'w-7 md:w-8 bg-[#FF6B00]' : 'w-2.5 md:w-3 bg-white/30 hover:bg-white/60'}`} />
            ))}
          </div>
          <button onClick={next} aria-label="Next headline"
            className="md:hidden flex-shrink-0 w-11 h-11 border-2 border-white/30 active:border-[#FF6B00] active:bg-[#FF6B00]/10 text-white transition-colors flex items-center justify-center">
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </div>
        <p className="text-white/60 text-[10px] md:text-[11px] font-mono uppercase tracking-[0.2em] mt-3">
          {headline + 1} of {total}
        </p>

        <p className="text-gray-200 text-[14px] md:text-[17px] leading-relaxed max-w-2xl mx-auto mt-8 md:mt-10">
          From the day a guest buys a ticket to the day they renew an annual pass — Studio Ticketing runs the whole flow on one platform.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-7 md:mt-9">
          <a href={WA_DEMO} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 md:py-3.5 bg-[#FF6B00] hover:bg-white text-black text-[12px] md:text-[13px] font-black uppercase tracking-wider transition-colors">
            <MessageCircle size={14} strokeWidth={2.5} /> Book a demo <ArrowRight size={14} strokeWidth={2.5} />
          </a>
          <a href="#pain"
            className="inline-flex items-center gap-2 px-6 py-3 md:py-3.5 border-2 border-white/30 hover:border-white text-white text-[12px] md:text-[13px] font-bold uppercase tracking-wider transition-colors">
            See how it works <ChevronDown size={14} strokeWidth={2.5} />
          </a>
        </div>
      </div>

      <a href="#who" aria-label="Scroll down" className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 hover:text-[#FF6B00] transition-colors flex-col items-center gap-1">
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
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#FF6B00] mb-4">Who it's for</p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-10 md:mb-14 leading-tight max-w-3xl">
            Built for the venues where guests buy a ticket, scan a pass, or hold an annual membership.
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {AUDIENCE.map(({ Icon, label, sub, img }, i) => (
            <Reveal key={label} delay={i * 0.06}>
              <article className="group border-2 border-white/15 hover:border-[#FF6B00]/60 bg-white/[0.02] h-full overflow-hidden transition-colors flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.03] flex items-center justify-center p-2">
                  <img src={img} alt={label} loading="lazy" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="p-4 md:p-5 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 md:w-8 md:h-8 border border-[#FF6B00]/50 bg-[#FF6B00]/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={14} strokeWidth={2} className="text-[#FF6B00]" />
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
            If your guests buy a ticket, scan a pass, or come back on an annual membership — Studio Ticketing runs it.
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
// 3 PILLARS — More control · More sales · More return guests
// ────────────────────────────────────────────────────────────────
const PILLARS: { num: string; eyebrow: string; title: string; mirror: string; body: string; Icon: LucideIcon }[] = [
  {
    num: '01', eyebrow: 'Control', title: 'More control.',
    mirror: 'Tired of reconciling OTAs and counter sales by hand?',
    body: "Every ticket scanned. Every pass validated. Every ride counted. Every channel reconciled. Know who walked in, what they paid for, and which OTA sent them — without opening a spreadsheet.",
    Icon: Eye,
  },
  {
    num: '02', eyebrow: 'Sales', title: 'More sales.',
    mirror: 'Tired of selling out only the easy seats?',
    body: 'Timed-entry slots fill up. Auto-renewals on annual passes fire. Birthday tickets, expiry reminders and family-bundle upsells run in the background — revenue compounds without you chasing.',
    Icon: TrendingUp,
  },
  {
    num: '03', eyebrow: 'Guests', title: 'More return guests.',
    mirror: 'Tired of losing first-timers to a printed stub?',
    body: 'Self-service kiosk in ten seconds. Online ticketing around the clock. Annual-pass upgrade prompted at the gate. Referrals tracked. First-time guests walk in without a queue — and come back as regulars.',
    Icon: PartyPopper,
  },
];

function PillarsSection() {
  return (
    <section id="pillars" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,107,0,0.10) 0%, transparent 55%)' }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal>
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#FF6B00] mb-4">Studio Ticketing · Built on 3 pillars</p>
          <h2 className="text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 leading-[1.05]">
            More control. More sales. <span className="text-[#FF6B00]">More return guests.</span>
          </h2>
          <p className="text-gray-300 text-[13px] md:text-[15px] leading-relaxed max-w-2xl mb-10 md:mb-14">
            Studio Ticketing runs on the same three pillars as every other Studio surface — sharpened for ticketed venues.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {PILLARS.map((p, i) => (
            <Reveal key={p.num} delay={i * 0.08}>
              <article className="border-2 border-white/15 hover:border-[#FF6B00]/60 bg-white/[0.02] p-6 md:p-7 h-full transition-colors relative group">
                <div className="absolute top-4 right-4 font-mono text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#FF6B00]/60 group-hover:text-[#FF6B00] transition-colors">
                  {p.num} · {p.eyebrow}
                </div>
                <div className="w-12 h-12 md:w-14 md:h-14 border-2 border-[#FF6B00]/40 bg-[#FF6B00]/10 flex items-center justify-center mb-5 md:mb-6">
                  <p.Icon size={22} strokeWidth={2} className="text-[#FF6B00]" />
                </div>
                <h3 className="text-white text-[22px] md:text-[26px] lg:text-[28px] font-black uppercase tracking-tight leading-[1.05] mb-3">
                  {p.title}
                </h3>
                <p className="text-[#FF6B00]/90 text-[12px] md:text-[13px] font-mono italic mb-3.5 md:mb-4">
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
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 20% 30%, rgba(255,107,0,0.10) 0%, transparent 55%)' }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal>
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#FF6B00] mb-4">Still doing it the hard way?</p>
          <h2 className="text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 leading-[1.05] max-w-3xl">
            Less admin. <span className="text-[#FF6B00]">More automation.</span> More returning guests.
          </h2>
          <p className="text-gray-300 text-[13px] md:text-[15px] leading-relaxed max-w-2xl mb-10 md:mb-14">
            The four jobs that eat your gate team's day. Studio Ticketing takes them off the floor — so your team stops fighting paperwork and starts running the venue.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {PAIN_POINTS.map((p, i) => (
            <Reveal key={p.pain} delay={i * 0.08}>
              <article className="group border-2 border-white/15 hover:border-[#FF6B00]/60 bg-white/[0.02] overflow-hidden h-full flex flex-col transition-colors">
                <div className="relative aspect-[16/9] overflow-hidden bg-white/[0.03] flex items-center justify-center">
                  <img src={p.img} alt={p.imgAlt} loading="lazy" className="max-w-full max-h-full object-contain" />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-2 bg-black/75 backdrop-blur-sm border border-[#FF6B00]/40 px-2.5 py-1">
                    <span className="text-[#FF6B00] text-[10px] font-mono font-bold uppercase tracking-wider">Pain · {String(i + 1).padStart(2, '0')}</span>
                  </div>
                </div>
                <div className="p-5 md:p-7 flex flex-col gap-3">
                  <p className="text-[#FF6B00]/90 text-[13px] md:text-[14px] font-mono italic leading-snug">{p.pain}</p>
                  <p className="text-white text-[15px] md:text-[17px] font-bold leading-snug">{p.fix}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="text-gray-300 text-[12px] md:text-[14px] italic text-center mt-10 md:mt-14 max-w-2xl mx-auto">
            That's Studio Ticketing — every venue gets its own branded web + app, every guest has their own profile, every visit feeds the next one.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// HARDWARE — Face-ID or QR at the gate
// ────────────────────────────────────────────────────────────────
function HardwareSection() {
  return (
    <section id="hardware" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#FF6B00] mb-4">Every gate, one platform</p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 leading-tight">
            Pick the gate that fits your venue.
          </h2>
          <p className="text-gray-300 text-[14px] md:text-[15px] leading-relaxed max-w-2xl mb-10 md:mb-14">
            From premium anti-tailgating turnstiles to a single door lock — every gate runs on the same Studio software, the same guest record, and the same logs.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          {HARDWARE.map((h, i) => (
            <Reveal key={h.title} delay={i * 0.05}>
              <article className="group border-2 border-white/15 hover:border-[#FF6B00]/60 bg-white/[0.02] overflow-hidden h-full flex flex-col transition-colors">
                <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.03] flex items-center justify-center p-2">
                  <img src={h.img} alt={h.title} loading="lazy" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="px-3 py-3 md:px-4 md:py-4 border-t border-white/10">
                  <h3 className="text-white text-[12px] md:text-[14px] font-black uppercase tracking-tight leading-tight group-hover:text-[#FF6B00] transition-colors">
                    {h.title}
                  </h3>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="text-gray-400 text-[12px] md:text-[13px] italic text-center mt-10 md:mt-12 max-w-2xl mx-auto">
            Six gate types. One Studio Ticketing record behind every entrance — Face-ID for pass holders, QR for day tickets.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// SELL HARDWARE — counter, kiosk, handheld; one Studio software
// ────────────────────────────────────────────────────────────────
function SellHardwareSection() {
  return (
    <section id="sell" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#FF6B00] mb-4">Every channel, one platform</p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 leading-tight">
            Sell however you want.
          </h2>
          <p className="text-gray-300 text-[14px] md:text-[15px] leading-relaxed max-w-2xl mb-10 md:mb-14">
            From the front counter to the self-service kiosk to a handheld at the gate — every device runs the same Studio software, the same inventory, and the same daily report.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          {SELL_HARDWARE.map((h, i) => (
            <Reveal key={h.title} delay={i * 0.05}>
              <article className="group border-2 border-white/15 hover:border-[#FF6B00]/60 bg-white/[0.02] overflow-hidden h-full flex flex-col transition-colors">
                <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.03] flex items-center justify-center p-2">
                  <img src={h.img} alt={h.title} loading="lazy" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="px-3 py-3 md:px-4 md:py-4 border-t border-white/10">
                  <h3 className="text-white text-[12px] md:text-[14px] font-black uppercase tracking-tight leading-tight group-hover:text-[#FF6B00] transition-colors">
                    {h.title}
                  </h3>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="text-gray-400 text-[12px] md:text-[13px] italic text-center mt-10 md:mt-12 max-w-2xl mx-auto">
            Pick one. Pick all. Same Studio behind every sale — counter, kiosk, handheld or app.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// MOBILE APP / WALLET-FREE / OTA SECTION
// ────────────────────────────────────────────────────────────────
function AppSection() {
  return (
    <section id="app" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-black text-white scroll-mt-20 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 75% 40%, rgba(255,107,0,0.12) 0%, transparent 55%)' }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal>
          <div className="flex items-center gap-2 mb-4">
            <span aria-hidden="true" className="inline-block w-5 h-3 bg-[#FF6B00]" />
            <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#FF6B00]">Your venue. Your app. One ledger.</p>
          </div>
          <h2 className="text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 leading-[1.05] max-w-3xl">
            A wallet-free venue, <span className="text-[#FF6B00]">on your own mobile app.</span>
          </h2>
          <p className="text-gray-300 text-[13px] md:text-[15px] leading-relaxed max-w-2xl mb-10 md:mb-14">
            Your park, your museum, your event lives on the guest's home screen — your branding, your icon, your everything. Tickets, annual passes, cashless top-ups, vending-machine pairing, OTA voucher scan — all from the same app.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
          <Reveal>
            <div className="relative border-2 border-[#FF6B00]/30 bg-white/[0.03] overflow-hidden">
              <div className="aspect-[4/3] flex items-center justify-center p-3">
                <img
                  src="/qfitimg/studioimg/ticketing_app.jpg"
                  alt="Branded mobile app — tickets, annual pass, cashless top-ups, vending and OTA voucher scan"
                  loading="lazy"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="absolute top-3 left-3 inline-flex items-center gap-2 bg-black/75 backdrop-blur-sm border border-[#FF6B00]/40 px-2.5 py-1">
                <Smartphone size={14} className="text-[#FF6B00]" strokeWidth={2} />
                <span className="text-[#FF6B00] text-[10px] font-mono font-bold uppercase tracking-wider">Your branded app</span>
              </div>
              <div className="absolute bottom-3 right-3 inline-flex items-center gap-2 bg-black/75 backdrop-blur-sm border border-[#FF6B00]/40 px-2.5 py-1">
                <span aria-hidden="true" className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full qticket-dot-pulse" />
                <span className="text-[#FF6B00] text-[10px] font-mono font-bold uppercase tracking-wider">Live · Cashless</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-4 md:space-y-5">
              <div className="border-l-2 border-[#FF6B00]/60 pl-4">
                <p className="text-[#FF6B00]/90 text-[12px] md:text-[13px] font-mono italic mb-2">One app. Every ticket, pass and top-up.</p>
                <p className="text-white text-[15px] md:text-[17px] leading-relaxed">
                  Guests buy day tickets, renew their annual pass, book timed slots, top up wristbands and scan OTA vouchers — all in one branded app. No paper, no email, no separate vendor portals.
                </p>
              </div>

              {APP_BULLETS.map((b, i) => (
                <Reveal key={b.title} delay={0.12 + i * 0.06}>
                  <div className="flex items-start gap-3 md:gap-4 border border-white/10 hover:border-[#FF6B00]/50 bg-white/[0.02] p-3.5 md:p-4 transition-colors">
                    <div className="w-9 h-9 md:w-10 md:h-10 border-2 border-[#FF6B00]/50 bg-[#FF6B00]/10 flex items-center justify-center flex-shrink-0">
                      <b.Icon size={16} className="text-[#FF6B00]" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-[13px] md:text-[14px] font-black uppercase tracking-tight leading-snug mb-1">{b.title}</p>
                      <p className="text-gray-400 text-[12px] md:text-[13px] leading-snug">{b.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <p className="text-gray-300 text-[12px] md:text-[14px] italic text-center mt-10 md:mt-14 max-w-2xl mx-auto">
            One scan at the gate. One tap at the vending machine. One ledger at HQ. That's how a modern venue should run.
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
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#FF6B00] mb-4">Why Studio Ticketing</p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-5 leading-tight">
            One system <span className="text-[#FF6B00]">vs the usual ticketing stack.</span>
          </h2>
          <p className="text-gray-300 text-[14px] md:text-[15px] leading-relaxed mb-10 md:mb-14 max-w-2xl">
            Tap any topic to see the swap. Auto-plays every 4 seconds.
          </p>
        </Reveal>

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
                        ? 'border-[#FF6B00] bg-[#FF6B00]/10 shadow-[0_0_20px_rgba(255,107,0,0.20)]'
                        : 'border-white/15 bg-white/[0.02] hover:border-[#FF6B00]/40 hover:bg-[#FF6B00]/5'
                    }`}>
                    <TabIcon size={18} strokeWidth={2} className={isActive ? 'text-[#FF6B00]' : 'text-white/70 group-hover:text-[#FF6B00]'} />
                    <span className={`text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-wider whitespace-nowrap ${isActive ? 'text-[#FF6B00]' : 'text-white/70'}`}>
                      {r.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="mt-6 md:mt-8 border-2 border-[#FF6B00]/30 bg-black/40 overflow-hidden">
          <div key={active} className="qticket-compare-fade">
            <div className="flex items-center gap-3 px-5 md:px-8 py-4 md:py-5 border-b border-[#FF6B00]/20 bg-[#FF6B00]/[0.05]">
              <div className="w-9 h-9 md:w-11 md:h-11 border-2 border-[#FF6B00]/50 bg-[#FF6B00]/10 flex items-center justify-center">
                <RowIcon size={18} strokeWidth={2} className="text-[#FF6B00]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-white/50">{row.metricLabel}</p>
                <h3 className="text-white text-[16px] md:text-[20px] font-black uppercase tracking-tight leading-tight truncate">{row.label}</h3>
              </div>
              <p className="hidden sm:block font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-white/40">
                {String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-stretch">
              <div className="p-5 md:p-8 lg:p-10 flex flex-col items-center text-center bg-white/[0.02] relative">
                <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-white/40 mb-3">The usual stack</p>
                <div className="qticket-metric-them text-white/40 font-black tracking-tight leading-none text-[34px] sm:text-[44px] md:text-[60px] lg:text-[76px] break-words max-w-full mb-3 relative">
                  <span className="line-through decoration-2 decoration-red-400/70">{row.themMetric}</span>
                </div>
                <p className="text-gray-400 text-[13px] md:text-[14px] leading-snug max-w-[28ch]">{row.them}</p>
                <div className="qticket-bar-them mt-5 md:mt-6 h-1 w-full max-w-[200px] bg-white/10 overflow-hidden">
                  <div className="h-full bg-red-400/50" />
                </div>
                <p className="font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-red-300/70 mt-2">Slow · Manual</p>
              </div>

              <div className="hidden md:flex flex-col items-center justify-center px-2 relative">
                <div aria-hidden="true" className="absolute inset-y-6 left-1/2 w-px bg-white/10" />
                <div className="relative w-12 h-12 border-2 border-[#FF6B00] bg-black flex items-center justify-center font-mono text-[11px] font-black uppercase tracking-wider text-[#FF6B00] qticket-vs-pulse">
                  VS
                </div>
              </div>
              <div className="md:hidden flex items-center justify-center py-3 border-y border-white/5">
                <div className="px-3 py-1 border-2 border-[#FF6B00] bg-black font-mono text-[10px] font-black uppercase tracking-wider text-[#FF6B00]">VS</div>
              </div>

              <div className="p-5 md:p-8 lg:p-10 flex flex-col items-center text-center bg-[#FF6B00]/[0.06] relative">
                <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-[#FF6B00] mb-3">Studio Ticketing</p>
                <div className="qticket-metric-us text-[#FF6B00] font-black tracking-tight leading-none text-[34px] sm:text-[44px] md:text-[60px] lg:text-[76px] break-words max-w-full mb-3 drop-shadow-[0_0_18px_rgba(255,107,0,0.4)]">
                  {row.usMetric}
                </div>
                <p className="text-white text-[13px] md:text-[14px] font-medium leading-snug max-w-[28ch]">{row.us}</p>
                <div className="qticket-bar-us mt-5 md:mt-6 h-1 w-full max-w-[200px] bg-white/10 overflow-hidden">
                  <div className="h-full bg-[#FF6B00]" />
                </div>
                <p className="font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[#FF6B00] mt-2">Fast · Automatic</p>
              </div>
            </div>

            <div className="px-5 md:px-8 py-3 md:py-4 border-t border-white/10 flex items-center gap-3">
              <button
                onClick={() => { setActive(a => (a - 1 + total) % total); setPaused(true); }}
                aria-label="Previous comparison"
                className="w-11 h-11 md:w-9 md:h-9 border border-white/30 hover:border-[#FF6B00] hover:text-[#FF6B00] text-white/70 flex items-center justify-center transition-colors shrink-0">
                <ChevronLeft size={14} strokeWidth={2.5} />
              </button>
              <div className="flex-1 h-0.5 bg-white/10 overflow-hidden relative">
                <div
                  key={`bar-${active}-${paused ? 'p' : 'r'}`}
                  className={`h-full bg-[#FF6B00] origin-left ${paused ? '' : 'qticket-progress'}`}
                  style={{ width: paused ? `${((active + 1) / total) * 100}%` : undefined }} />
              </div>
              <button
                onClick={() => { setActive(a => (a + 1) % total); setPaused(true); }}
                aria-label="Next comparison"
                className="w-11 h-11 md:w-9 md:h-9 border border-white/30 hover:border-[#FF6B00] hover:text-[#FF6B00] text-white/70 flex items-center justify-center transition-colors shrink-0">
                <ChevronRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        <Reveal>
          <p className="text-gray-400 text-[12px] md:text-[13px] italic text-center mt-8 md:mt-10 max-w-2xl mx-auto">
            Five tools, four vendors, zero of them talking to each other — that's the usual ticketing stack. Studio joins it up.
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
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 20% 50%, rgba(255,107,0,0.10) 0%, transparent 60%)' }} />
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <Reveal>
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#FF6B00] mb-4">Designed to improvise your business</p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-5 leading-tight">
            Configured for your venue. <span className="text-[#FF6B00]">Not a template.</span>
          </h2>
          <p className="text-[#FF6B00]/90 text-[13px] md:text-[14px] font-mono italic mb-3 max-w-2xl mx-auto">
            Tired of paying for features you'll never use?
          </p>
          <p className="text-gray-300 text-[15px] md:text-[17px] leading-relaxed max-w-2xl mx-auto mb-8 md:mb-10">
            Studio Ticketing is modular. A museum doesn't need ride passes. A playland doesn't need OTA integration. A theme park needs both. We configure what fits — and improvise around your existing OTAs, vending machines, in-park POS and hardware — so you only pay for what you actually run.
          </p>
          <a href={WA_TELLUS} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 md:px-8 py-3.5 md:py-4 bg-[#FF6B00] hover:bg-white text-black text-[12px] md:text-[13px] font-black uppercase tracking-wider transition-colors">
            <MessageCircle size={14} strokeWidth={2.5} /> Tell us about your venue <ArrowRight size={14} strokeWidth={2.5} />
          </a>
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
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#FF6B00] mb-4">Built to be relied on</p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-10 md:mb-14 leading-tight max-w-3xl">
            The boring stuff that matters.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {RELIABILITY.map(({ Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 0.06}>
              <article className="border-2 border-white/15 bg-white/[0.02] p-6 md:p-7 h-full">
                <div className="w-11 h-11 md:w-12 md:h-12 border-2 border-[#FF6B00]/40 bg-[#FF6B00]/10 flex items-center justify-center mb-5">
                  <Icon size={20} strokeWidth={2} className="text-[#FF6B00]" />
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
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-60" style={{ backgroundImage: 'radial-gradient(rgba(255,107,0,0.12) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <Reveal>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.95] mb-5">
            See your venue <span className="text-[#FF6B00]">running on it.</span>
          </h2>
          <p className="text-[#FF6B00]/90 text-[13px] md:text-[14px] font-mono italic mb-3 max-w-xl mx-auto">
            Tired of demos that show generic screens?
          </p>
          <p className="text-gray-300 text-[15px] md:text-[17px] leading-relaxed max-w-xl mx-auto mb-8 md:mb-10">
            Book a 20-minute walk-through. We'll show Studio Ticketing configured to a venue like yours — ticket flow, hardware fit, OTA integration, the works.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
            <a href={WA_DEMO} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 md:px-10 py-4 md:py-5 bg-[#FF6B00] hover:bg-white text-black text-[13px] md:text-[15px] font-black uppercase tracking-wider transition-colors">
              <MessageCircle size={16} strokeWidth={2.5} /> Book a demo <ArrowRight size={16} strokeWidth={2.5} />
            </a>
            <a href={WA_TELLUS} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 md:px-8 py-4 md:py-5 border-2 border-white/30 hover:border-white text-white text-[12px] md:text-[14px] font-bold uppercase tracking-wider transition-colors">
              Tell us about your venue <ArrowRight size={14} strokeWidth={2.5} />
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
      <div className="bg-black/95 backdrop-blur-md border-t border-[#FF6B00]/30 px-3 py-2.5 flex items-center gap-2">
        <a href={WA_DEMO} target="_blank" rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#FF6B00] text-black text-[12px] font-black uppercase tracking-wider px-4 py-3 min-h-[44px]">
          <MessageCircle size={14} strokeWidth={2.5} /> Book a demo
        </a>
        <a href={WA_TELLUS} target="_blank" rel="noopener noreferrer" aria-label="Tell us about your venue"
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
export default function QStudioTicketingPage() {
  return (
    <div className="bg-black min-h-screen text-white selection:bg-[#FF6B00] selection:text-black overflow-x-hidden">
      <SEOHead
        noTitleSuffix
        noindex
        title="Studio Ticketing — Theme Parks, Museums, Playlands & Events"
        description="Face-ID or QR at the gate. Tickets across webstore, app, counter and self-service kiosk. Annual passes, OTA, cashless wristbands and one dashboard — all in one."
        keywords="ticketing system malaysia, theme park ticketing, museum ticketing, playland ticketing, event ticketing, annual pass system, face id gate, qr turnstile, cashless wristband, vending machine integration, OTA integration, klook kkday integration, all-in-one ticketing dashboard"
        image="https://qbot.now/cover/cover-themepark.jpg"
        imageWidth={1600}
        imageHeight={900}
        imageAlt="Studio Ticketing by QBot — Face-ID and QR gates at a theme park entrance"
        url="https://qbot.now/qstudio/ticketing"
      />

      <QTicketHeader />

      <main id="main" role="main">
        <Hero />
        <WhoSection />
        <PillarsSection />
        <PainPointsSection />
        <HardwareSection />
        <SellHardwareSection />
        <AppSection />
        <CompareSection />
        <ModularSection />
        <ReliabilitySection />
        <FinalCta />
      </main>

      <StickyMobileCta />
      <QTicketFooter />

      <style>{`
        @keyframes qticket-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes qticket-reveal {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes qticket-compare-fade-in {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .qticket-compare-fade { animation: qticket-compare-fade-in 0.45s cubic-bezier(0.16,1,0.3,1); }

        @keyframes qticket-metric-them-in {
          0% { opacity: 0; transform: translateX(-12px); filter: blur(2px); }
          60% { opacity: 1; transform: translateX(0); filter: blur(0); }
          100% { opacity: 0.55; transform: translateX(0); filter: blur(0); }
        }
        .qticket-metric-them { animation: qticket-metric-them-in 1.1s ease-out both; }

        @keyframes qticket-metric-us-in {
          0% { opacity: 0; transform: scale(0.85); }
          55% { opacity: 1; transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }
        .qticket-metric-us { animation: qticket-metric-us-in 0.7s cubic-bezier(0.16,1,0.3,1) both; }

        @keyframes qticket-bar-them-fill {
          0% { width: 0; }
          100% { width: 32%; }
        }
        .qticket-bar-them > div { animation: qticket-bar-them-fill 1.4s linear both; }

        @keyframes qticket-bar-us-fill {
          0% { width: 0; }
          70% { width: 100%; }
          100% { width: 100%; }
        }
        .qticket-bar-us > div { animation: qticket-bar-us-fill 0.55s cubic-bezier(0.16,1,0.3,1) 0.25s both; }

        @keyframes qticket-vs-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,107,0,0.5); }
          50%      { transform: scale(1.08); box-shadow: 0 0 0 8px rgba(255,107,0,0); }
        }
        .qticket-vs-pulse { animation: qticket-vs-pulse 2.2s ease-in-out infinite; }

        @keyframes qticket-progress-fill {
          0% { width: 0; }
          100% { width: 100%; }
        }
        .qticket-progress { animation: qticket-progress-fill 4s linear forwards; }

        @keyframes qticket-dot-pulse {
          0%, 100% { transform: scale(1);   opacity: 1; box-shadow: 0 0 0 0 rgba(255,107,0,0.6); }
          50%      { transform: scale(1.3); opacity: 0.85; box-shadow: 0 0 0 6px rgba(255,107,0,0); }
        }
        .qticket-dot-pulse { animation: qticket-dot-pulse 1.6s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .qticket-compare-fade,
          .qticket-metric-them,
          .qticket-metric-us,
          .qticket-bar-them > div,
          .qticket-bar-us > div,
          .qticket-vs-pulse,
          .qticket-progress,
          .qticket-dot-pulse { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
