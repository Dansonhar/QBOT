import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { trackWhatsAppClick } from '../utils/trackWhatsApp';
import {
  QrCode, Phone, ShieldCheck, Smartphone, ChefHat, Users,
  ArrowRight, Star, MessageCircle, ChevronDown, ChevronRight,
  Ban, PhoneCall, Clock, TrendingUp, Database, Utensils,
  Check, X,
} from 'lucide-react';

const whatsappUrl = 'https://wa.me/60126909189?text=Hi%20QPOS%2C%20I%27m%20interested%20in%20QR%20Order.%20Tell%20me%20more!';

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
// SCROLLING STRIP
// ────────────────────────────────────────────────────────────────
const STRIP_ITEMS = ['Scan & Order', 'Zero Walkouts', 'No Cash Handling', 'Phone Capture', 'Auto Upsell', 'Kitchen Direct', 'Points & Rewards', 'Customer Database', 'One Staff = Three'];

function ScrollingStrip() {
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
  const items = [...STRIP_ITEMS, ...STRIP_ITEMS, ...STRIP_ITEMS, ...STRIP_ITEMS];
  return (
    <div className="overflow-hidden">
      <div ref={ref} className="flex whitespace-nowrap will-change-transform">
        {items.map((t, i) => (
          <span key={i} className="text-xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-black px-3 sm:px-6 md:px-10 shrink-0">
            {t}<span className="text-green-500 ml-3 sm:ml-6 md:ml-10">///</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// HERO
// ────────────────────────────────────────────────────────────────
const VENUE_TYPES = ['Restaurants', 'Cafes', 'Hotels', 'Hawker Stalls', 'Mamaks', 'Food Courts', 'Bars & Pubs', 'Cloud Kitchens'];

function HeroSection() {
  const [venue, setVenue] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => { setVenue(p => (p + 1) % VENUE_TYPES.length); setFade(true); }, 300);
    }, 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="min-h-[85vh] flex flex-col items-center justify-center px-4 md:px-6 pt-20 md:pt-28 pb-8 md:pb-12 relative overflow-hidden bg-white">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src="/qpos-keyvisuals/hero-qrorder.jpg" alt="" className="w-full h-full object-cover opacity-8" />
        <div className="absolute inset-0 bg-white/90" />
      </div>

      <div className="relative z-10 max-w-5xl w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        {/* Phone image */}
        <div className="w-48 sm:w-56 md:w-72 flex-shrink-0">
          <img src="/qpos-keyvisuals/qpos-qrorder.jpeg" alt="QR Order on phone" className="w-full h-auto rounded-3xl shadow-2xl" />
        </div>

        {/* Text */}
        <div className="text-center md:text-left md:max-w-lg">
          <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-green-600 mb-4">QPOS &middot; QR Order for</p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-4 text-black h-[1.8em]">
            <span className={`inline-block transition-all duration-300 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              {VENUE_TYPES[venue]}
            </span>
          </h1>
          <p className="text-gray-500 text-[14px] md:text-[16px] leading-relaxed max-w-lg mb-8">
            Your customers scan, order, and pay — without your staff touching a thing. No missed orders. No walkouts. No stolen cash.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick('QR Order > Hero > Get Started')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white text-[12px] font-bold uppercase tracking-wider transition-colors">
              <MessageCircle size={16} strokeWidth={2} /> Get Started
            </a>
            <a href="#journey" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-black/20 hover:border-black text-black text-[12px] font-bold uppercase tracking-wider transition-colors">
              See How It Works <ArrowRight size={14} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </div>

      {/* HUD pills */}
      <div className="relative z-10 w-full max-w-4xl mx-auto mt-10 md:mt-16">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            { icon: Ban, label: 'Zero cash handling' },
            { icon: ShieldCheck, label: 'No dine-and-dash' },
            { icon: Phone, label: 'Phone capture' },
            { icon: Smartphone, label: 'Works on all devices' },
            { icon: ChefHat, label: 'Instant kitchen push' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full">
              <item.icon size={13} strokeWidth={2} className="text-green-400" />
              <span className="text-[11px] font-bold">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// JOURNEY — 4 USE CASES
// ────────────────────────────────────────────────────────────────
const USE_CASES = [
  {
    title: 'Dine In',
    hook: 'QR on every table. No pen, no paper, no missed orders.',
    body: 'Customer scans, enters phone number, browses your menu and orders. Staff just deliver food. The customer adds more items across the meal — bill builds in real time. They pay when they\'re done.',
    emoji: '🪑',
    color: 'bg-emerald-50 border-emerald-200',
  },
  {
    title: 'Pre-Pay',
    hook: 'Customer pays before kitchen starts. Zero walkout risk.',
    body: 'Customer orders and pays upfront — ideal for busy counters, hawker stalls, and high-turnover setups. Kitchen only starts after payment confirmed. No chasing, no bad debt.',
    emoji: '💳',
    color: 'bg-amber-50 border-amber-200',
  },
  {
    title: 'Hotel',
    hook: 'QR in every room. Guest orders without calling front desk.',
    body: 'Guest scans room QR, browses your in-room dining menu, places order. Goes straight to kitchen. Charge to room or pay online — fully configurable per property.',
    emoji: '🏨',
    color: 'bg-purple-50 border-purple-200',
  },
  {
    title: 'Open Order',
    hook: 'Customers order freely across the whole meal — anytime.',
    body: 'Perfect for cafes, mamaks, and all-day spots. Customer browses, orders, adds items any time. Each round fires to kitchen separately. Bill builds up in real time. They pay when ready.',
    emoji: '🧾',
    color: 'bg-blue-50 border-blue-200',
  },
];

function JourneySection() {
  const [active, setActive] = useState(0);

  return (
    <section id="journey" className="py-16 md:py-32 px-4 md:px-6 bg-white scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-green-600 mb-4">Works for every setup</p>
          <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tight mb-4 leading-tight">
            One system.<br className="hidden sm:block" /> Four modes.
          </h2>
          <p className="text-gray-500 text-[14px] md:text-[15px] leading-relaxed mb-10 md:mb-14 max-w-2xl">
            Configure QR Order for dine-in, pre-pay, hotel room service, or open ordering. Same system, different flow — you pick what fits.
          </p>
        </Reveal>

        {/* Tab bar */}
        <div className="flex flex-wrap gap-1 mb-6 md:mb-10">
          {USE_CASES.map((uc, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`flex items-center gap-2 px-4 md:px-5 py-2.5 text-[11px] md:text-[12px] font-black uppercase tracking-wider transition-all duration-200 border-b-2 ${
                active === i
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-400 hover:text-black'
              }`}>
              <span className="text-[16px]">{uc.emoji}</span>
              {uc.title}
            </button>
          ))}
        </div>

        {/* Active content card */}
        <Reveal key={active}>
          <div className={`border rounded-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden ${USE_CASES[active].color}`} style={{ animation: 'qr-reveal 0.3s ease-out' }}>
            <div className="p-6 md:p-10 flex flex-col justify-center">
              <span className="text-5xl mb-4">{USE_CASES[active].emoji}</span>
              <p className="text-black text-[16px] md:text-[20px] font-bold leading-snug mb-3">{USE_CASES[active].hook}</p>
              <p className="text-gray-600 text-[13px] md:text-[15px] leading-relaxed">{USE_CASES[active].body}</p>
            </div>
            <div className="aspect-[16/10] md:aspect-auto overflow-hidden bg-white/50 flex items-center justify-center p-8">
              <img src="/qpos-keyvisuals/qpos-qrorder.jpeg" alt="QR Order" className="w-full h-auto max-h-64 object-contain rounded-xl shadow-lg" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// PROBLEMS & FIXES — interactive toggle
// ────────────────────────────────────────────────────────────────
const PROBLEMS = [
  {
    problem: 'Staff take orders wrong, cash goes missing.',
    detail: "Every RM that passes through a staff member's hands is a RM you can't fully track. Undercharging. No-bills. Voids after the fact.",
    fix: 'No cash at the table = zero theft exposure',
    fixDetail: "Payment is handled digitally. Your staff don't touch money. There's nothing to pocket, nothing to void. Every ringgit is accounted for.",
    icon: Ban,
    image: '/qpos-keyvisuals/qrorder/issue01.png',
  },
  {
    problem: 'Table walks out. You have nothing.',
    detail: "Customer finishes eating, steps out to \"get their wallet.\" Gone. You have their table number. That's it. No name. No number.",
    fix: 'Mandatory phone number = walkouts solved',
    fixDetail: "First screen — enter your phone number. If they walk out, you call them. Problem solved before it starts.",
    icon: PhoneCall,
    image: '/qpos-keyvisuals/qrorder/issue02.png',
  },
  {
    problem: 'Peak hour = staff overwhelmed = orders lost.',
    detail: "One staff for four tables. Someone flags them down. They miss it. Order delayed 20 minutes. Customer leaves unhappy.",
    fix: 'One staff does the work of three',
    fixDetail: "When ordering is self-serve, your team focuses on food and service — not running back and forth. Same output, lower cost.",
    icon: Users,
    image: '/qpos-keyvisuals/qrorder/issue03.png',
  },
  {
    problem: 'Average bill stays flat, no natural upsell.',
    detail: "Staff are too busy to suggest add-ons. Menu boards don't push margin items. Nothing nudges the customer to spend more.",
    fix: 'Customers order more when browsing freely',
    fixDetail: "No staff hovering. Customers browse, add dessert, upgrade drinks. Built-in Sales Boosters nudge high-margin items. Average bill goes up automatically.",
    icon: TrendingUp,
  },
  {
    problem: 'No customer data. No way to bring them back.',
    detail: "They come, they eat, they leave. You have no idea who they are, what they ordered, or how to reach them again.",
    fix: 'Phone numbers = your customer database',
    fixDetail: "Every scan builds your contact list. Run promos. Send reminders. Reward regulars. The walkout safety net becomes your marketing engine.",
    icon: Database,
  },
  {
    problem: 'Kitchen gets wrong orders. Customers complain.',
    detail: "Handwritten tickets, misheard items, staff relay errors. The kitchen makes what they think was ordered — not what was actually ordered.",
    fix: 'Direct digital orders = zero kitchen errors',
    fixDetail: "Customer taps exactly what they want. Order fires straight to KDS or printer — no middleman, no misheard items, no wrong dishes.",
    icon: Clock,
  },
];

function ProblemsSection() {
  const [showFix, setShowFix] = useState<Record<number, boolean>>({});
  const toggle = (i: number) => setShowFix(prev => ({ ...prev, [i]: !prev[i] }));

  return (
    <section className="py-16 md:py-32 px-4 md:px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-red-500 mb-4">The real problems</p>
          <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tight mb-4 leading-tight">
            Problems you're<br className="hidden sm:block" /> living with.
          </h2>
          <p className="text-gray-500 text-[14px] leading-relaxed mb-10 md:mb-14 max-w-2xl">
            "Every week, at least one table forgets to pay. You smile, wave it off. But you never get that back." — What restaurateurs told us.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PROBLEMS.map((p, i) => {
            const showing = showFix[i];
            const Icon = p.icon;
            return (
              <Reveal key={i} delay={i * 0.05}>
                <div className={`border rounded-xl overflow-hidden transition-all h-full flex flex-col ${showing ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'}`}>
                  {p.image && (
                    <div className="w-full aspect-[16/10] overflow-hidden bg-gray-100">
                      <img src={p.image} alt={p.problem} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-5 md:p-6 flex flex-col flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${showing ? 'bg-green-600 text-white' : 'bg-red-50 text-red-500'}`}>
                      <Icon size={20} strokeWidth={2} />
                    </div>
                    <p className={`text-[14px] font-bold transition-colors mb-2 ${showing ? 'text-green-700 line-through decoration-green-300' : 'text-black'}`}>{p.problem}</p>
                    <p className="text-[12px] text-gray-500 leading-relaxed mb-4 flex-1">{showing ? p.fixDetail : p.detail}</p>
                    <button onClick={() => toggle(i)} className={`self-start px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${showing ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                      {showing ? '✓ Fixed' : 'See fix →'}
                    </button>
                    {showing && (
                      <div className="mt-4 flex items-start gap-3 p-3 bg-white border border-green-200 rounded-lg" style={{ animation: 'qr-reveal 0.3s ease-out' }}>
                        <ShieldCheck size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-[13px] font-bold text-green-700">{p.fix}</p>
                      </div>
                    )}
                  </div>
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
// INTERACTIVE PHONE DEMO (kept from before, but enhanced layout)
// ────────────────────────────────────────────────────────────────
type DemoStep = 'welcome' | 'menu' | 'cart' | 'checkout';

const menuItems = [
  { id: 1, name: 'Nasi Lemak Special', price: 12.90, img: '🍛', cat: 'Rice', badge: '' },
  { id: 2, name: 'Teh Tarik', price: 3.50, img: '🍵', cat: 'Drinks', badge: 'Popular' },
  { id: 3, name: 'Roti Canai', price: 2.50, img: '🫓', cat: 'Bread', badge: '' },
  { id: 4, name: 'Mee Goreng', price: 8.90, img: '🍜', cat: 'Noodle', badge: '' },
  { id: 5, name: 'Ayam Penyet', price: 14.90, img: '🍗', cat: 'Rice', badge: 'Best Seller' },
  { id: 6, name: 'Ice Lemon Tea', price: 4.50, img: '🧊', cat: 'Drinks', badge: '' },
  { id: 7, name: 'Satay (6pcs)', price: 10.90, img: '🥩', cat: 'Appetizer', badge: 'Upsell' },
  { id: 8, name: 'Cendol', price: 5.90, img: '🍧', cat: 'Dessert', badge: 'Add-on' },
];

const stepBenefits: Record<DemoStep, { title: string; points: { icon: typeof Phone; label: string; desc: string }[] }> = {
  welcome: {
    title: 'Registration',
    points: [
      { icon: Phone, label: 'Walkout prevention', desc: 'Phone number captured before ordering. If they leave without paying — you call them.' },
      { icon: Star, label: 'Loyalty from day one', desc: 'Customers earn points automatically. You build a contact database with zero effort.' },
      { icon: Users, label: 'Pax tracking', desc: 'Know how many people per table for better forecasting and service.' },
    ],
  },
  menu: {
    title: 'Menu & Ordering',
    points: [
      { icon: TrendingUp, label: 'Built-in Sales Boosters', desc: '"Best Seller" and "Popular" badges drive customers toward high-margin items.' },
      { icon: Utensils, label: 'Self-serve = higher ticket', desc: 'No staff hovering. Customers browse freely, add desserts, upgrade drinks.' },
      { icon: ChefHat, label: 'Direct to kitchen', desc: 'Orders fire instantly to KDS or printer. No handwriting. No errors.' },
    ],
  },
  cart: {
    title: 'Cart & Upsell',
    points: [
      { icon: TrendingUp, label: 'Auto upsell prompts', desc: '"Add Satay?" — system suggests add-ons at the cart. Upsell without staff.' },
      { icon: ShieldCheck, label: 'Every item tracked', desc: 'No missing items or wrong bills. Cart = kitchen ticket. Full accountability.' },
      { icon: Database, label: 'Round-based ordering', desc: 'Customers add items across the meal. Each round fires separately.' },
    ],
  },
  checkout: {
    title: 'Checkout',
    points: [
      { icon: Ban, label: 'Zero cash at table', desc: 'Digital payment. Nothing to pocket, nothing to void. Every ringgit accounted for.' },
      { icon: Star, label: 'Points earned auto', desc: 'RM1 = 1 point. Customer sees it at checkout. Loyalty that runs itself.' },
      { icon: Database, label: 'Data captured', desc: 'Phone, name, order history — saved. Run promos, send reminders, reward regulars.' },
    ],
  },
};

function PhoneDemo() {
  const [step, setStep] = useState<DemoStep>('welcome');
  const [pax, setPax] = useState(2);
  const [phone, setPhone] = useState('');
  const [cart, setCart] = useState<Record<number, number>>({});
  const [activeCat, setActiveCat] = useState('All');

  const formatPhone = (p: string) => { if (p.length <= 3) return p; if (p.length <= 7) return `${p.slice(0, 3)}-${p.slice(3)}`; return `${p.slice(0, 3)}-${p.slice(3, 7)} ${p.slice(7)}`; };
  const handleKey = (key: string) => { if (key === 'del') setPhone(p => p.slice(0, -1)); else if (key === 'submit') { if (phone.length >= 9) setStep('menu'); } else { if (phone.length < 11) setPhone(p => p + key); } };
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((s, [id, qty]) => { const it = menuItems.find(m => m.id === Number(id)); return s + (it ? it.price * qty : 0); }, 0);
  const addItem = (id: number) => setCart(p => ({ ...p, [id]: (p[id] || 0) + 1 }));
  const removeItem = (id: number) => setCart(p => { const n = { ...p }; if (n[id] > 1) n[id]--; else delete n[id]; return n; });
  const categories = ['All', ...Array.from(new Set(menuItems.map(m => m.cat)))];
  const filtered = activeCat === 'All' ? menuItems : menuItems.filter(m => m.cat === activeCat);
  const reset = () => { setStep('welcome'); setPax(2); setPhone(''); setCart({}); setActiveCat('All'); };
  const keys = [['1','2','3'],['4','5','6'],['7','8','9'],['del','0','submit']];
  const benefit = stepBenefits[step];

  const renderScreen = () => {
    switch (step) {
      case 'welcome': return (
        <div className="bg-white">
          <div className="bg-gradient-to-b from-green-600 to-green-700 px-5 pt-5 pb-6 text-center">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2"><Star size={20} strokeWidth={2} className="text-white" /></div>
            <h3 className="text-[16px] font-black text-white uppercase tracking-tight">Earn Points & Rewards</h3>
            <p className="text-[11px] text-white/70 mt-1">Enter your details to start ordering</p>
          </div>
          <div className="px-5 pt-5 pb-3">
            <div className="mb-4">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">How many pax?</label>
              <div className="flex items-center gap-2">
                {[1,2,3,4,5,6].map(n => (<button key={n} onClick={() => setPax(n)} className={`w-10 h-10 rounded-full text-[14px] font-bold transition-all ${pax === n ? 'bg-green-600 text-white scale-110 shadow-md' : 'bg-gray-100 text-gray-500'}`}>{n}</button>))}
              </div>
            </div>
            <div className="mb-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Phone Number</label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-2.5 bg-gray-100 rounded-lg flex-shrink-0"><span className="text-[14px]">🇲🇾</span><span className="text-[13px] font-bold text-black">+60</span><ChevronDown size={12} className="text-gray-400" /></div>
                <div className="flex-1 px-3 py-2.5 bg-gray-50 border-2 border-green-500 rounded-lg"><span className={`text-[15px] font-semibold ${phone ? 'text-black' : 'text-gray-300'}`}>{phone ? formatPhone(phone) : '12-3456 789'}</span>{!phone && <span className="inline-block w-0.5 h-4 bg-green-500 ml-0.5 animate-pulse align-middle" />}</div>
              </div>
            </div>
          </div>
          <div className="px-4 pb-3"><div className="grid grid-cols-3 gap-1.5">{keys.flat().map(key => (<button key={key} onClick={() => handleKey(key)} className={`h-12 rounded-xl text-center font-bold transition-all active:scale-95 ${key === 'submit' ? (phone.length >= 9 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400') : key === 'del' ? 'bg-gray-100 text-gray-500 text-[13px]' : 'bg-gray-100 text-black text-[18px]'}`}>{key === 'del' ? '⌫' : key === 'submit' ? '→' : key}</button>))}</div></div>
          <div className="px-5 pb-5 pt-1 text-center"><button onClick={() => setStep('menu')} className="text-[11px] text-gray-400">Skip for now</button></div>
        </div>
      );
      case 'menu': return (
        <div className="bg-white flex flex-col" style={{ height: '520px' }}>
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2"><div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center"><span className="text-white text-[10px] font-bold">Q</span></div><span className="text-[12px] font-bold text-black">Demo Cafe</span></div>
            <div className="flex items-center gap-2"><span className="text-[10px] text-gray-400 px-2 py-1 bg-gray-100 rounded-full">Table 5</span>
              <button onClick={() => { if (cartCount > 0) setStep('cart'); }} className="relative p-1.5"><ShieldCheck size={18} className="text-gray-400" />{cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}</button></div>
          </div>
          <div className="mx-3 mt-3 rounded-xl overflow-hidden bg-gradient-to-r from-amber-400 to-orange-500 p-3 flex-shrink-0">
            <p className="text-[9px] font-bold text-white/80 uppercase tracking-wider">Today's Special</p>
            <p className="text-[13px] font-black text-white">Spend RM30, get free Cendol!</p>
            <div className="mt-1 h-1.5 bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-white rounded-full" style={{ width: `${Math.min(100, (cartTotal / 30) * 100)}%` }} /></div>
          </div>
          <div className="flex gap-1.5 px-3 py-2 overflow-x-auto flex-shrink-0 scrollbar-hide">{categories.map(c => (<button key={c} onClick={() => setActiveCat(c)} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold ${activeCat === c ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>{c}</button>))}</div>
          <div className="flex-1 overflow-y-auto px-3 pb-3"><div className="grid grid-cols-2 gap-2">{filtered.map(item => (
            <div key={item.id} className="bg-gray-50 rounded-xl p-3 relative">
              {item.badge && <span className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-[7px] font-bold uppercase ${item.badge === 'Best Seller' ? 'bg-amber-100 text-amber-700' : item.badge === 'Popular' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{item.badge}</span>}
              <span className="text-2xl block mb-1">{item.img}</span>
              <p className="text-[11px] font-semibold text-black leading-tight">{item.name}</p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[11px] font-bold text-green-600">RM{item.price.toFixed(2)}</span>
                {cart[item.id] ? (<div className="flex items-center gap-1"><button onClick={() => removeItem(item.id)} className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-bold">−</button><span className="text-[11px] font-bold w-4 text-center">{cart[item.id]}</span><button onClick={() => addItem(item.id)} className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">+</button></div>) : (<button onClick={() => addItem(item.id)} className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-[14px] font-bold">+</button>)}
              </div>
            </div>
          ))}</div></div>
          {cartCount > 0 && (<button onClick={() => setStep('cart')} className="mx-3 mb-3 flex items-center justify-between px-4 py-3 bg-green-600 rounded-xl flex-shrink-0"><div className="flex items-center gap-2"><span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-[10px] font-bold text-white">{cartCount}</span><span className="text-[12px] font-bold text-white">View Cart</span></div><span className="text-[12px] font-bold text-white">RM{cartTotal.toFixed(2)}</span></button>)}
        </div>
      );
      case 'cart': return (
        <div className="bg-white flex flex-col" style={{ height: '520px' }}>
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 flex-shrink-0"><button onClick={() => setStep('menu')} className="text-gray-400"><ArrowRight size={16} className="rotate-180" /></button><h3 className="text-[14px] font-bold text-black">Your Order</h3><span className="text-[10px] text-gray-400 ml-auto">Round 1</span></div>
          <div className="mx-4 mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl flex-shrink-0">
            <div className="flex items-center justify-between mb-1"><span className="text-[9px] font-bold text-green-700 uppercase tracking-wider">Spend & Save</span><span className="text-[10px] font-bold text-green-600">RM{cartTotal.toFixed(0)} / RM30</span></div>
            <div className="h-2 bg-green-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${Math.min(100, (cartTotal / 30) * 100)}%` }} /></div>
            <p className="text-[9px] text-green-600 mt-1">{cartTotal >= 30 ? '🎉 Free Cendol unlocked!' : `RM${(30 - cartTotal).toFixed(0)} more for free Cendol`}</p>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {Object.entries(cart).map(([id, qty]) => { const item = menuItems.find(m => m.id === Number(id)); if (!item) return null; return (
              <div key={id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><span className="text-xl">{item.img}</span><div className="flex-1 min-w-0"><p className="text-[12px] font-semibold text-black truncate">{item.name}</p><p className="text-[11px] text-green-600 font-bold">RM{(item.price * qty).toFixed(2)}</p></div>
                <div className="flex items-center gap-1.5"><button onClick={() => removeItem(Number(id))} className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-[12px] font-bold">−</button><span className="text-[12px] font-bold w-5 text-center">{qty}</span><button onClick={() => addItem(Number(id))} className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-[12px] font-bold">+</button></div>
              </div>); })}
            {!cart[7] && (<div className="p-3 bg-amber-50 border border-amber-200 rounded-xl"><p className="text-[9px] font-bold text-amber-600 uppercase tracking-wider mb-1">Suggested Add-on</p><div className="flex items-center gap-3"><span className="text-xl">🥩</span><div className="flex-1"><p className="text-[11px] font-semibold text-black">Satay (6pcs)</p><p className="text-[10px] text-amber-600">Most ordered with your items!</p></div><button onClick={() => addItem(7)} className="px-2.5 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-lg">+ RM10.90</button></div></div>)}
          </div>
          <div className="px-4 pb-3 border-t border-gray-100 pt-3 flex-shrink-0">
            <div className="flex justify-between text-[11px] mb-1"><span className="text-gray-500">Subtotal</span><span className="font-semibold">RM{cartTotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-[11px] mb-2"><span className="text-gray-500">SST 6%</span><span className="font-semibold">RM{(cartTotal * 0.06).toFixed(2)}</span></div>
            <div className="flex justify-between text-[13px] font-bold mb-3"><span>Total</span><span className="text-green-600">RM{(cartTotal * 1.06).toFixed(2)}</span></div>
            <button onClick={() => setStep('checkout')} className="w-full py-3 bg-green-600 text-white text-[12px] font-bold uppercase tracking-wide rounded-xl">Send to Kitchen & Pay</button>
            <button onClick={() => setStep('menu')} className="w-full py-2 text-[11px] text-gray-400 mt-1">+ Add more items</button>
          </div>
        </div>
      );
      case 'checkout': return (
        <div className="bg-white flex flex-col" style={{ height: '520px' }}>
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 flex-shrink-0"><button onClick={() => setStep('cart')} className="text-gray-400"><ArrowRight size={16} className="rotate-180" /></button><h3 className="text-[14px] font-bold text-black">Checkout</h3></div>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl text-center"><Star size={24} className="text-green-600 mx-auto mb-1" /><p className="text-[18px] font-black text-green-700">+{Math.floor(cartTotal)} pts</p><p className="text-[10px] text-green-600">Points earned from this order</p></div>
            <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Order Summary</p>{Object.entries(cart).map(([id, qty]) => { const item = menuItems.find(m => m.id === Number(id)); if (!item) return null; return <div key={id} className="flex justify-between text-[11px] py-1"><span className="text-gray-600">{qty}x {item.name}</span><span className="font-semibold">RM{(item.price * qty).toFixed(2)}</span></div>; })}<div className="border-t border-gray-100 mt-2 pt-2 flex justify-between text-[13px] font-bold"><span>Total (incl. SST)</span><span className="text-green-600">RM{(cartTotal * 1.06).toFixed(2)}</span></div></div>
            <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Payment Method</p><div className="space-y-1.5">{[{ label: 'Pay at Counter', icon: '💵', active: true }, { label: 'Credit / Debit', icon: '💳', active: false }, { label: "Touch 'n Go", icon: '📱', active: false }].map(m => (<div key={m.label} className={`flex items-center gap-3 p-3 rounded-xl border ${m.active ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}><span className="text-[16px]">{m.icon}</span><span className="text-[12px] font-semibold text-black">{m.label}</span>{m.active && <span className="ml-auto w-4 h-4 bg-green-600 rounded-full flex items-center justify-center"><span className="text-white text-[8px]">✓</span></span>}</div>))}</div></div>
          </div>
          <div className="px-4 pb-3 flex-shrink-0"><button onClick={reset} className="w-full py-3.5 bg-green-600 text-white text-[12px] font-bold uppercase tracking-wide rounded-xl flex items-center justify-center gap-2"><ShieldCheck size={16} /> Place Order — RM{(cartTotal * 1.06).toFixed(2)}</button></div>
        </div>
      );
    }
  };

  const stepLabels: { key: DemoStep; label: string; num: string }[] = [
    { key: 'welcome', label: 'Register', num: '01' },
    { key: 'menu', label: 'Menu', num: '02' },
    { key: 'cart', label: 'Cart', num: '03' },
    { key: 'checkout', label: 'Checkout', num: '04' },
  ];
  const stepIndex = stepLabels.findIndex(s => s.key === step);

  return (
    <section id="demo" className="py-16 md:py-32 px-4 md:px-6 bg-white scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-green-600 mb-4 text-center">Interactive Demo</p>
          <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tight mb-4 leading-tight text-center">Experience the full flow</h2>
          <p className="text-gray-500 text-[14px] leading-relaxed mb-10 md:mb-14 max-w-lg mx-auto text-center">Tap through every screen your customer sees — from scanning the QR to placing the order.</p>
        </Reveal>

        {/* Step tabs — QFit style */}
        <div className="flex flex-wrap items-center justify-center gap-1 mb-10">
          {stepLabels.map((s, i) => (
            <button key={s.key} onClick={() => { if (s.key === 'welcome') reset(); else setStep(s.key); }}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-black uppercase tracking-wider transition-all border-b-2 ${
                i === stepIndex ? 'border-green-500 text-green-600' : i < stepIndex ? 'border-transparent text-gray-600' : 'border-transparent text-gray-300'
              }`}>
              <span className="font-mono text-[10px]">{s.num}</span> {s.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 lg:gap-16">
          {/* Benefits left */}
          <div className="order-2 lg:order-1 lg:w-[300px] flex-shrink-0">
            <div className="lg:sticky lg:top-28 space-y-4">
              <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider mb-2">{benefit.title}</p>
              {benefit.points.map(p => (
                <div key={p.label} className="flex items-start gap-3" style={{ animation: 'qr-reveal 0.3s ease-out' }}>
                  <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0"><p.icon size={18} strokeWidth={2} className="text-green-600" /></div>
                  <div><p className="text-[13px] font-bold text-black mb-0.5">{p.label}</p><p className="text-[12px] text-gray-500 leading-relaxed">{p.desc}</p></div>
                </div>
              ))}
            </div>
          </div>

          {/* Phone */}
          <div className="order-1 lg:order-2">
            <div className="w-[300px] md:w-[320px] bg-black rounded-[40px] p-3 shadow-2xl">
              <div className="bg-white rounded-[28px] overflow-hidden relative">
                <div className="bg-gray-900 px-6 pt-3 pb-2 flex items-center justify-between"><span className="text-[10px] text-white/60">9:41</span><div className="w-20 h-5 bg-black rounded-full mx-auto" /><div className="w-4 h-2.5 border border-white/60 rounded-sm relative"><div className="absolute inset-0.5 bg-green-400 rounded-[1px]" style={{ width: '70%' }} /></div></div>
                {renderScreen()}
                <div className="flex justify-center py-2 bg-white"><div className="w-28 h-1 bg-gray-300 rounded-full" /></div>
              </div>
            </div>
            <div className="text-center mt-4"><button onClick={reset} className="text-[11px] text-gray-400 hover:text-green-600 underline underline-offset-2">← Start over</button></div>
          </div>

          {/* Owner benefits right */}
          <div className="order-3 lg:w-[300px] flex-shrink-0 hidden lg:block">
            <div className="lg:sticky lg:top-28 space-y-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">For You (The Owner)</p>
              {[
                { label: 'No extra staff needed', desc: 'Ordering is self-serve. Team focuses on food and service.' },
                { label: 'Real-time kitchen orders', desc: 'Every order goes straight to KDS. No relay, no errors.' },
                { label: 'Full revenue tracking', desc: 'Every ringgit accounted for. No cash handling, no theft.' },
                { label: 'Customer database grows', desc: 'Every phone number becomes a marketing contact.' },
              ].map(p => (
                <div key={p.label} className="p-3 border border-gray-200 rounded-xl">
                  <p className="text-[12px] font-bold text-black mb-0.5">{p.label}</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// COMPARISON TABLE
// ────────────────────────────────────────────────────────────────
function ComparisonSection() {
  const rows = [
    { label: 'Customer ordering', them: 'Staff takes order manually', us: 'Customer scans QR and self-orders' },
    { label: 'Cash handling', them: 'Cash at table — no tracking', us: 'Digital only — every RM tracked' },
    { label: 'Walkout protection', them: 'None — no ID captured', us: 'Phone number mandatory before ordering' },
    { label: 'Kitchen accuracy', them: 'Handwritten orders, staff relay', us: 'Direct to KDS/printer — zero errors' },
    { label: 'Upselling', them: 'Relies on trained staff', us: 'Auto Sales Boosters, badges, add-on prompts' },
    { label: 'Customer data', them: 'None — they eat and leave', us: 'Phone, order history, points — auto captured' },
    { label: 'Staff required', them: '4+ per shift for ordering', us: '1-2 — ordering is self-serve' },
  ];

  return (
    <section className="py-16 md:py-32 px-4 md:px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-green-600 mb-4">Honest comparison</p>
          <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tight mb-4 leading-tight">Traditional Ordering<br className="hidden sm:block" /> vs QR Order</h2>
          <p className="text-gray-500 text-[14px] leading-relaxed mb-10 md:mb-14 max-w-2xl">See exactly what changes when you switch.</p>
        </Reveal>

        <div className="space-y-2 md:space-y-0 md:border md:border-gray-200 md:rounded-xl md:overflow-hidden">
          <div className="hidden md:grid grid-cols-[1fr_1fr_1fr] border-b border-gray-200 bg-gray-100">
            <div className="p-4" />
            <div className="p-4 border-l border-gray-200 text-center"><span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Traditional</span></div>
            <div className="p-4 border-l border-green-200 bg-green-50 text-center"><span className="text-[11px] font-bold text-green-600 uppercase tracking-wider">QR Order</span></div>
          </div>
          {rows.map((row, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div className="md:hidden border border-gray-200 rounded-xl p-4 bg-white">
                <p className="text-[13px] font-bold text-black uppercase tracking-wide mb-3">{row.label}</p>
                <div className="flex items-start gap-2 mb-2"><X size={14} className="text-red-400 flex-shrink-0 mt-0.5" /><span className="text-gray-600 text-[13px]">{row.them}</span></div>
                <div className="flex items-start gap-2"><Check size={14} className="text-green-600 flex-shrink-0 mt-0.5" /><span className="text-green-700 text-[13px] font-medium">{row.us}</span></div>
              </div>
              <div className={`hidden md:grid grid-cols-[1fr_1fr_1fr] ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-100 last:border-b-0`}>
                <div className="p-4 flex items-center"><span className="text-[13px] font-bold text-black">{row.label}</span></div>
                <div className="p-4 border-l border-gray-200 flex items-center"><span className="text-[13px] text-gray-500">{row.them}</span></div>
                <div className="p-4 border-l border-green-200 bg-green-50/50 flex items-center"><span className="text-[13px] text-green-700 font-medium">{row.us}</span></div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// TESTIMONIALS
// ────────────────────────────────────────────────────────────────
const testimonials = [
  { name: 'Hafiz R.', role: 'Cafe Owner \u00b7 PJ', quote: "Haven't had a walkout since we turned on the phone number field.", stars: 5 },
  { name: 'Mei Lin C.', role: 'Restaurant \u00b7 Cheras', quote: "Cut floor staff from 4 to 2. Same output. Cost down, reviews up.", stars: 5 },
  { name: 'Dinesh K.', role: 'F&B \u00b7 Mont Kiara', quote: "Average bill went up RM12 per table. Didn't change the menu.", stars: 5 },
  { name: 'Amirah S.', role: 'Cafe \u00b7 Bangsar', quote: "Kitchen errors dropped to almost zero in the first week.", stars: 5 },
];

function TestimonialsSection() {
  return (
    <section className="py-16 md:py-32 px-4 md:px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-green-600 mb-4 text-center">What merchants say</p>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-10 md:mb-14 text-center">Real results. Real businesses.</h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="border border-gray-200 rounded-xl p-6 hover:border-green-300 transition-colors">
                <div className="flex gap-0.5 mb-3">{[...Array(t.stars)].map((_, j) => <Star key={j} size={14} strokeWidth={0} fill="#16a34a" />)}</div>
                <p className="text-[15px] font-bold text-black mb-3 leading-snug">"{t.quote}"</p>
                <p className="text-[13px] font-bold text-black">{t.name}</p>
                <p className="text-[11px] text-gray-400">{t.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// STATS BAR
// ────────────────────────────────────────────────────────────────
function StatsSection() {
  return (
    <section className="py-12 md:py-16 bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-6 text-center">
        <div><p className="text-3xl md:text-5xl font-black text-green-400 mb-1">0</p><p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Cash at table</p></div>
        <div><p className="text-3xl md:text-5xl font-black text-green-400 mb-1">100%</p><p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Orders tracked</p></div>
        <div><p className="text-3xl md:text-5xl font-black text-green-400 mb-1">&uarr; Bill</p><p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Avg spend up</p></div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// CTA
// ────────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-16 md:py-32 px-4 md:px-6 bg-gray-50 border-t border-gray-200">
      <Reveal className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.9] mb-6">
          Ready to eliminate<br />the chaos?
        </h2>
        <p className="text-gray-500 text-[15px] leading-relaxed mb-8 max-w-xl mx-auto">
          Get QR Order running in your restaurant in under 24 hours. No new hardware needed. No app download.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick('QR Order > CTA > Start Now')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-500 text-white text-[13px] font-bold uppercase tracking-wider transition-colors">
            <MessageCircle size={18} strokeWidth={2} /> Start Now via WhatsApp <ChevronRight size={16} strokeWidth={2.5} />
          </a>
          <Link to="/pricing" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-300 hover:border-black text-black text-[13px] font-bold uppercase tracking-wider transition-colors">
            View Pricing <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// MAIN PAGE
// ────────────────────────────────────────────────────────────────
export default function QrOrderingPage() {
  useEffect(() => { document.title = 'QR Order — QPOS | Zero Chaos, Zero Walkouts, Zero Theft'; }, []);

  return (
    <>
      <SEOHead
        title="QR Ordering System Malaysia — Scan, Order, Pay | QPOS"
        description="Customers scan, order, and pay on their phone. No walkouts, no missed orders, no cash theft. Works for dine-in, pre-pay pickup, hotel room service, and events."
        keywords="QR ordering Malaysia, scan to order Malaysia, QR code menu Malaysia, contactless ordering, dine-in QR, table QR ordering, QR payment Malaysia, restaurant QR system, hotel QR ordering, QPOS QR order"
        url="https://qbot.now/products/qr-order"
        image="https://qbot.now/qpos-keyvisuals/hero-qrorder.jpg"
        imageAlt="QPOS QR Ordering — scan, order and pay from your phone"
      />
      <main>
        <HeroSection />
        {/* Brutalist scroller */}
        <section className="bg-white overflow-hidden border-y-4 border-green-500 py-4">
          <ScrollingStrip />
        </section>
        <JourneySection />
        <ProblemsSection />
        <PhoneDemo />
        <StatsSection />
        <ComparisonSection />

        <CTASection />
      </main>

      <style>{`
        @keyframes qr-reveal { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}
