import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import StructuredData from '../components/StructuredData';
import LazyYouTube from '../components/LazyYouTube';
import { trackWhatsAppClick } from '../utils/trackWhatsApp';
import {
  ArrowRight, ChevronLeft, ChevronRight,
  Monitor, Smartphone, LayoutGrid, Globe, Tablet, QrCode,
  BarChart3, Package, Heart, ChefHat, ListOrdered, Tv, Zap, Brain,
  Phone, Dumbbell, ScanFace,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   SECTION 1: HERO
   Job: Hook them. What is it, why should I care, how much do I save.
   ═══════════════════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="bg-white" style={{ paddingTop: 'calc(88px + 10px)' }}>
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
          {/* Video — 70% */}
          <div className="lg:w-[70%]">
            <LazyYouTube
              videoId="Y8GNPc3yAxo"
              title="QPOS Video"
              className="w-full rounded-[32px]"
              style={{ paddingBottom: '56.25%' }}
              params="autoplay=1&mute=1&loop=1&playlist=Y8GNPc3yAxo&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&fs=0"
            />
          </div>
          {/* Text — 30% */}
          <div className="lg:w-[30%]">
            <h1 className="text-[32px] md:text-[40px] lg:text-[48px] font-black text-black leading-[0.92] tracking-tighter mb-4 uppercase">
              YOUR BUSINESS. YOUR WAY.
            </h1>
            <p className="text-[13px] md:text-[14px] font-medium text-gray-400 leading-[1.65] mb-6">
              Not every business needs a kiosk. Not every shop needs a webstore — yet. QBot gives you 6 sales channels and you switch on only what you need. Start with a counter POS today, add mobile sales next month, launch your webstore next quarter. One flexible system that grows exactly how your business grows.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/3-in-1" className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wide transition-colors group">
                Learn More <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link to="/build" className="inline-flex items-center px-5 py-2.5 text-black text-xs font-bold uppercase tracking-wide border-2 border-gray-200 hover:border-black transition-colors">
                Build Your POS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 2: PLATFORM
   Job: Shift from hardware → software. This isn't just a device, it's a system.
   ═══════════════════════════════════════════════════════════════ */
function PlatformSection() {
  const features = [
    { img: '/qpos-keyvisuals/hero-qpos.webp', title: 'Everything In Sync', desc: 'Every channel, every feature, every outlet — connected. One action updates everything else.' },
    { img: '/context_img/everythingconnected-onedashboard.webp', title: 'One Dashboard. Full Control.', desc: 'Stop switching between 5 apps. QHub puts your entire business on one screen.' },
    { img: '/context_img/everythingconnected-customyourpos.webp', title: 'Custom Your POS.', desc: 'Tick what you need. Untick what you don\'t. Loyalty? On. KDS? On. Booking? Not yet — skip it.' },
  ];
  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="text-2xl md:text-[36px] lg:text-[42px] font-extrabold text-black leading-[1.12] tracking-tight">
            Everything Connected
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="group">
              <div className="aspect-video overflow-hidden bg-gray-200 mb-4">
                <img src={f.img} alt={f.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-[15px] font-bold text-black mb-1">{f.title}</h3>
              <p className="text-[13px] text-gray-400 leading-[1.6]">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════════════════════════
   SECTION 4: SELL EVERYWHERE
   Job: Show 6 selling channels. This is about REACH. Don't repeat "3-in-1."
   ═══════════════════════════════════════════════════════════════ */
function SellEverywhereSection() {
  const topRow = [
    { img: '/qpos-keyvisuals/hero-qpos.webp', title: 'POS', tagline: 'Your front counter.', href: '/products/pos' },
    { img: '/qpos-keyvisuals/hero-kiosk.webp', title: 'Kiosk', tagline: 'Your self-service station.', href: '/products/kiosk' },
  ];
  const bottomRow = [
    { img: '/qpos-keyvisuals/hero-mpos.webp', title: 'mPOS', tagline: 'Your floor and queue.', href: '/products/mpos' },
    { img: '/qpos-keyvisuals/hero-tableside.webp', title: 'Tablet', tagline: 'Right where they are.', href: '/products/tablet' },
    { img: '/qpos-keyvisuals/hero-qrorder.webp', title: 'QR Order', tagline: 'Their phone. Self-checkout.', href: '/products/qr-order' },
    { img: '/qpos-keyvisuals/hero-web.webp', title: 'Webstore', tagline: 'Your online store. No middleman.', href: '/products/webstore' },
  ];
  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-16 mb-14">
          <h2 className="text-2xl md:text-[36px] lg:text-[42px] font-extrabold text-black leading-[1.12] tracking-tight">
            Sell here, there, and everywhere
          </h2>
          <p className="text-[15px] text-gray-400 leading-[1.7] lg:pt-3">
            Six ways to sell — counter, handheld, kiosk, QR code, tablet, or online. Your customers buy however they like, and every sale lands in one place. You never miss a sale.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4 md:gap-5 mb-4 md:mb-5">
          {topRow.map((ch) => (
            <Link key={ch.title} to={ch.href} className="group block">
              <div className="aspect-video overflow-hidden bg-gray-100 mb-3">
                <img src={ch.img} alt={ch.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-base font-bold text-black mb-0.5">{ch.title}</h3>
              <p className="text-[13px] text-gray-400">{ch.tagline}</p>
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-8">
          {bottomRow.map((ch) => (
            <Link key={ch.title} to={ch.href} className="group block">
              <div className="aspect-video overflow-hidden bg-gray-100 mb-3">
                <img src={ch.img} alt={ch.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-sm font-bold text-black mb-0.5">{ch.title}</h3>
              <p className="text-[12px] text-gray-400">{ch.tagline}</p>
            </Link>
          ))}
        </div>
        <p className="text-[13px] font-semibold text-gray-500 text-center">
          Every channel feeds into one system — one inventory, one dashboard, fully in sync.
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 4B: 3-IN-1 BANNER
   Job: Full-width black banner introducing the 3-in-1 POS device.
   ═══════════════════════════════════════════════════════════════ */
function ThreeInOneBanner() {
  return (
    <section className="relative bg-black text-white overflow-hidden">
      <img src="/qpos-keyvisuals/v3mix/p1-bg.webp" alt="QBOT V3 MIX 3-in-1 POS background" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-40" />
      <div className="relative z-10 py-16 md:py-20 px-6">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
            {/* Left — text */}
            <div className="lg:flex-1 text-center lg:text-left">
              <h2 className="text-2xl md:text-[36px] lg:text-[42px] font-extrabold text-white leading-[1.12] tracking-tight mb-4">
                All-new 3-in-1 POS
              </h2>
              <p className="text-[15px] text-white/60 leading-[1.7] max-w-xl mx-auto lg:mx-0 mb-8">
                Most businesses buy a counter POS, a separate handheld for tableside, and a kiosk for self-service — The QBOT V3 MIX does all three. Dock it at the counter in the morning. Undock it for tableside ordering during lunch. Wall-mount it as a self-service kiosk at night. Same device, same system — just a different mode.
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-8 mb-8">
                <div className="flex flex-col items-center gap-1.5">
                  <Monitor size={28} className="text-white" />
                  <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">POS</span>
                </div>
                <span className="text-white/30 text-xl font-light">+</span>
                <div className="flex flex-col items-center gap-1.5">
                  <Smartphone size={28} className="text-white" />
                  <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">mPOS</span>
                </div>
                <span className="text-white/30 text-xl font-light">+</span>
                <div className="flex flex-col items-center gap-1.5">
                  <LayoutGrid size={28} className="text-white" />
                  <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Self-Service</span>
                </div>
              </div>
              <Link to="/3-in-1" className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-black text-sm font-bold uppercase tracking-wide transition-colors">
                Learn More <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
            </div>
            {/* Right — YouTube Short (portrait) */}
            <div className="w-[200px] mx-auto lg:mx-0 flex-shrink-0">
              <LazyYouTube
                videoId="TpzYBNOWUK8"
                title="3-in-1 POS Video"
                className="rounded-2xl"
                style={{ paddingBottom: '177.78%' }}
                params="autoplay=1&mute=1&loop=1&playlist=TpzYBNOWUK8&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&fs=0"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 5: SALES BOOSTERS
   Job: Sharpest competitive section. QPOS actively pushes revenue UP.
   ═══════════════════════════════════════════════════════════════ */
function SalesBoostersSection() {
  const boosters = [
    { img: '/salesbooster/upsell.png', title: 'Smart Upsells', desc: 'Suggest add-ons automatically based on what\'s in the cart.' },
    { img: '/salesbooster/nudge.png', title: 'Last-Chance Nudges', desc: 'Show customers how close they are to a reward before checkout.' },
    { img: '/salesbooster/badges.png', title: 'Product Badges', desc: 'Tag items as Best Seller, New, or Limited to grab attention.' },
    { img: '/salesbooster/trigger.png', title: 'Offer Triggers', desc: 'Activate deals automatically when order conditions are met.' },
    { img: '/salesbooster/tiers.png', title: 'Spending Tiers', desc: 'Reward customers who spend more with bigger perks.' },
  ];
  const [current, setCurrent] = useState(0);
  const next = useCallback(() => setCurrent((i) => (i + 1) % boosters.length), []);
  const prev = useCallback(() => setCurrent((i) => (i - 1 + boosters.length) % boosters.length), []);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-16 mb-14">
          <h2 className="text-2xl md:text-[36px] lg:text-[42px] font-extrabold text-black leading-[1.12] tracking-tight">
            The Only POS That Actually Grows Your Sales
          </h2>
          <p className="text-[15px] text-gray-400 leading-[1.7] lg:pt-3">
            Every other POS just processes your orders. QBot makes each one worth more. Smart upsells, combo suggestions, spend thresholds, and product badges — running automatically across every channel. Your staff don't memorise scripts. Your kiosk doesn't need training. Set it once in QHub. It sells for you on every order, everywhere.
          </p>
        </div>

        {/* Slider */}
        <div className="relative mb-8">
          <div className="overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {boosters.map((b) => (
                <div key={b.title} className="w-full flex-shrink-0">
                  <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 bg-gray-50 border border-gray-200 rounded-lg p-6 md:p-8">
                    <div className="flex-shrink-0 md:w-1/2">
                      <img src={b.img} alt={b.title} loading="lazy" className="w-full h-auto" />
                    </div>
                    <div className="md:w-1/2 text-center md:text-left">
                      <h3 className="text-lg md:text-xl font-black text-black uppercase tracking-tight mb-2">
                        {b.title}
                      </h3>
                      <p className="text-[14px] text-gray-400 leading-[1.6]">{b.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrows */}
          <button
            onClick={prev}
            className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center shadow border border-gray-200 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
          <button
            onClick={next}
            className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center shadow border border-gray-200 transition-colors"
            aria-label="Next"
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-5">
            {boosters.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-black w-5' : 'bg-gray-300 hover:bg-gray-400'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <p className="text-[13px] font-semibold text-gray-500 text-center mb-6">
          Set it once in QHub. It runs on every order, every channel. No training. No memorising.
        </p>
        <div className="flex items-center justify-center">
          <Link to="/products/sales-boosters" className="text-[13px] font-bold text-black hover:text-gray-600 underline underline-offset-4 transition-colors">
            Learn more about Sales Boosters &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 6: SCALE
   Job: For merchants with 2+ locations. QPOS grows with them.
   ═══════════════════════════════════════════════════════════════ */
function ScaleSection() {
  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <h2 className="text-2xl md:text-[36px] lg:text-[42px] font-extrabold text-black leading-[1.12] tracking-tight mb-4">
              Update Once. Update Everywhere.
            </h2>
            <p className="text-[15px] text-gray-400 leading-[1.7] mb-8">
              Change your price at midnight — every outlet, every kiosk, every webstore updates by morning. Add a new item from your phone — it appears on all 6 channels instantly. And with AI Insights, you don't even have to guess what to change — it tells you what's selling, what's not, and what to do about it.
            </p>
            <div className="space-y-3">
              {[
                'One dashboard. Every outlet.',
                'Sync your catalogue, pricing, and stock across every location instantly.',
                'AI compares outlet performance — so you know where to focus.',
              ].map((p) => (
                <p key={p} className="text-[13px] font-medium text-black flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0" />
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-6">
              <Link to="/products/ai-insights" className="text-[13px] font-bold text-black hover:text-gray-600 underline underline-offset-4 transition-colors">
                Learn more about AI Dashboard &rarr;
              </Link>
            </div>
          </div>
          <div className="aspect-video overflow-hidden bg-gray-100">
            <img src="/qhubai-banner.webp" alt="QHub multi-outlet dashboard" loading="lazy" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 7: 14 MODULES
   Job: Show depth. Prove substance behind the story. Icon grid only.
   ═══════════════════════════════════════════════════════════════ */
function ModulesSection() {
  const groups = [
    { label: 'SELL', items: [
      { name: 'POS', icon: Monitor, path: '/products/pos' },
      { name: 'mPOS', icon: Smartphone, path: '/products/mpos' },
      { name: 'Kiosk', icon: LayoutGrid, path: '/products/kiosk' },
      { name: 'Webstore', icon: Globe, path: '/products/webstore' },
      { name: 'Tablet', icon: Tablet, path: '/products/tablet' },
      { name: 'QR Order', icon: QrCode, path: '/products/qr-order' },
    ]},
    { label: 'MANAGE', items: [
      { name: 'QHub', icon: BarChart3, path: '/products/qhub' },
      { name: 'Inventory', icon: Package, path: '/products/inventory' },
      { name: 'Loyalty', icon: Heart, path: '/products/loyalty' },
    ]},
    { label: 'OPERATE', items: [
      { name: 'Kitchen', icon: ChefHat, path: '/products/kitchen-display' },
      { name: 'QMS', icon: ListOrdered, path: '/products/qms' },
      { name: 'Live Display', icon: Tv, path: '/products/live-display' },
    ]},
    { label: 'GROW', items: [
      { name: 'Boosters', icon: Zap, path: '/products/sales-boosters' },
      { name: 'AI Insights', icon: Brain, path: '/products/ai-insights' },
    ]},
  ];
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="text-2xl md:text-[36px] lg:text-[42px] font-extrabold text-black leading-[1.12] tracking-tight mb-4">
            14 modules for anything your business needs
          </h2>
          <p className="text-[15px] text-gray-400 leading-[1.7] max-w-2xl mx-auto">
            Sell across 6 channels. Manage your back office, inventory, and loyalty. Run kitchen & service displays, queue management, and live screens. Grow with AI insights and automated sales boosters. One integrated platform — activate only what you need.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          {groups.map((g) => (
            <div key={g.label}>
              <p className="text-[10px] font-bold text-green-600 uppercase tracking-[0.15em] mb-3">{g.label}</p>
              <div className="space-y-1">
                {g.items.map((m) => {
                  const I = m.icon;
                  return (
                    <Link key={m.name} to={m.path} className="flex items-center gap-2.5 py-2 px-2 -mx-2 hover:bg-gray-50 transition-colors group">
                      <I size={16} strokeWidth={1.5} className="text-gray-400 group-hover:text-black transition-colors flex-shrink-0" />
                      <span className="text-[13px] font-medium text-gray-600 group-hover:text-black transition-colors">{m.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link to="/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-black hover:text-green-600 transition-colors group">
            Explore all products <ArrowRight size={14} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 8: HARDWARE
   Job: Show the physical products. What arrives at their store.
   ═══════════════════════════════════════════════════════════════ */
function HardwareSection() {
  const hw = [
    { img: '/qpos-keyvisuals/v3mix/desktop.webp', name: 'QBOT V3 MIX', desc: 'Counter, mobile, and kiosk — three modes in one device.', price: 'Contact Us', link: '/3-in-1' },
    { img: '/qpos-keyvisuals/d3pro/d3customerorder.webp', name: 'QBOT D3 PRO', desc: '15.6" FHD desktop POS with optional dual display.', price: 'Contact Us', link: '/hardware#d3pro' },
    { img: '/qpos-keyvisuals/k2/k2desktop.webp', name: 'K2 KIOSK', desc: 'Self-service kiosk for high-traffic ordering. 21" or 27".', price: 'Contact Us', link: '/hardware#kiosk' },
  ];
  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="text-2xl md:text-[36px] lg:text-[42px] font-extrabold text-black leading-[1.12] tracking-tight mb-4">
            Hardware built for your space
          </h2>
          <p className="text-[15px] text-gray-400 leading-[1.7] max-w-xl mx-auto">
            Every QPOS device arrives ready out of the box — preconfigured, tested, and loaded with your catalogue before it ships. Pick the form factor that fits your counter, floor, or entrance.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {hw.map((h) => (
            <Link key={h.name} to={h.link} className="group">
              <div className="aspect-square overflow-hidden bg-gray-100 mb-4">
                <img src={h.img} alt={h.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-base font-bold text-black mb-0.5 group-hover:text-green-600 transition-colors">{h.name}</h3>
              <p className="text-[13px] text-gray-400 leading-[1.5] mb-1">{h.desc}</p>
              <p className="text-[13px] font-bold text-black">{h.price}</p>
            </Link>
          ))}
        </div>
        <div className="text-center">
          <Link to="/hardware" className="inline-flex items-center gap-1.5 text-sm font-semibold text-black hover:text-green-600 transition-colors group">
            See all hardware <ArrowRight size={14} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 9: PRICING CTA
   Job: Simple pricing teaser with link to full pricing page.
   ═══════════════════════════════════════════════════════════════ */
function PricingCtaSection() {
  return (
    <section className="py-16 md:py-24 bg-black text-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 text-center">
        <h2 className="text-2xl md:text-[36px] font-extrabold text-white leading-[1.12] tracking-tight mb-4">
          Pricing tailored to your setup
        </h2>
        <p className="text-[15px] text-white/50 leading-[1.7] max-w-xl mx-auto mb-8">
          One subscription. Every module included. Hardware, software, installation, and training — all from one partner. Chat with us for a quote.
        </p>
        <a
          href="https://wa.me/60126909189?text=Hi%20QPOS%2C%20I%27d%20like%20to%20get%20pricing%20details%20for%20my%20business"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick('Home > Pricing CTA > Contact Us')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white text-sm font-bold uppercase tracking-wide transition-colors"
        >
          Contact Us
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 10: SHOWROOM
   Job: Convert interest into a visit.
   ═══════════════════════════════════════════════════════════════ */
function ShowroomSection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <a
            href="https://www.google.com/maps/search/?api=1&query=Solaris+Dutamas+Publika+Kuala+Lumpur"
            target="_blank"
            rel="noopener noreferrer"
            className="block aspect-video overflow-hidden bg-gray-100 relative group"
          >
            <img
              src="/qbotshowroom.jpg"
              alt="QPOS Showroom at Publika KL — Solaris Dutamas"
              width={1376}
              height={768}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <span className="bg-white/90 px-4 py-2 text-xs font-bold text-black uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
                Open in Google Maps
              </span>
            </div>
          </a>
          <div>
            <h2 className="text-2xl md:text-[36px] lg:text-[42px] font-extrabold text-black leading-[1.12] tracking-tight mb-4">
              See it in person
            </h2>
            <p className="text-[15px] text-gray-400 leading-[1.7] mb-6">
              Visit our showroom at Publika KL. Test the 3-in-1 device, try the kiosk, watch Sales Boosters in action, and talk to our team about your business.
            </p>
            <div className="space-y-2 mb-6">
              <p className="text-sm font-semibold text-black">B3-6-13 Solaris Dutamas, Jalan Dutamas 1, 50480 Publika, KL</p>
              <p className="text-sm text-gray-400">Monday–Friday, 10AM–7PM. Reservation required.</p>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://wa.me/60126909189?text=Hi%20QPOS%2C%20I%27d%20like%20to%20schedule%20a%20showroom%20visit" target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick('Home > Showroom > Book via WhatsApp')} className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold tracking-wide transition-colors">
                <Phone size={14} strokeWidth={2} /> Book via WhatsApp
              </a>
              <a href="https://www.google.com/maps/search/?api=1&query=Solaris+Dutamas+Publika+Kuala+Lumpur" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gray-500 hover:text-black transition-colors inline-flex items-center gap-1">
                Get Directions <ArrowRight size={12} strokeWidth={2} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 11: FINAL CTA
   Job: Close. One last push. Simple.
   ═══════════════════════════════════════════════════════════════ */
function FinalCTA() {
  return (
    <section className="py-16 md:py-24 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-[36px] lg:text-[42px] font-extrabold text-black leading-[1.12] tracking-tight mb-8">
            It's easy to start selling smarter
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="https://wa.me/60126909189?text=Hi%20QPOS%2C%20I%27d%20like%20to%20book%20a%20free%20demo" target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick('Home > Final CTA > Book a Demo')} className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-gray-800 text-white text-sm font-bold uppercase tracking-wide transition-colors group">
              Book a Demo <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
            <Link to="/products" className="inline-flex items-center px-6 py-3 text-black text-sm font-bold uppercase tracking-wide border-2 border-gray-200 hover:border-black transition-colors">
              Explore Products
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════
   SECTION: SPECIALISED SOLUTIONS — STUDIO + QSentry AI
   Two clickable cards with a powerful one-liner each.
   ═══════════════════════════════════════════════════════════════ */
function SpecialisedSolutionsSection() {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center mb-10">
          <span className="text-[10px] font-bold text-green-600 uppercase tracking-[0.2em]">Specialised Solutions</span>
          <h2 className="mt-2 text-2xl md:text-4xl font-black text-black uppercase tracking-tight">
            Built for your industry
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {/* STUDIO */}
          <Link to="/qstudio" onClick={() => (window as any).gtag?.('event', 'select_content', { content_type: 'product', item_id: 'qstudio', location: 'home_specialised' })} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0E0E0E] hover:border-[#CCFF00]/50 transition-colors">
            {/* key visual */}
            <div className="relative h-48 md:h-56 overflow-hidden">
              <img src="/qfitimg/studioimg/for_gym.png" alt="QStudio — gym management platform" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/30 to-transparent" />
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/60 backdrop-blur px-3 py-1.5 border border-[#CCFF00]/30">
                <Dumbbell size={14} strokeWidth={2.5} className="text-[#CCFF00]" />
                <span className="text-[10px] font-black text-[#CCFF00] uppercase tracking-wider">QStudio</span>
              </div>
            </div>
            <div className="p-7">
              <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Recurring payments, memberships & appointments — automated.
              </h3>
              <p className="mt-2 text-[14px] text-white/50 leading-relaxed">
                One platform to sell memberships, collect recurring payments, and manage bookings & appointments — for any subscription or appointment-based business.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#CCFF00]">
                Explore QStudio <ArrowRight size={16} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

          {/* QSentry AI */}
          <Link to="/qsentry" onClick={() => (window as any).gtag?.('event', 'select_content', { content_type: 'product', item_id: 'qsentry', location: 'home_specialised' })} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0E0E0E] hover:border-[#FF2D2D]/60 transition-colors">
            {/* key visual */}
            <div className="relative h-48 md:h-56 overflow-hidden">
              <img src="/qsentry_img/sentryrealfootage.jpg" alt="QSentry AI — anti-tailgater detection" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/30 to-transparent" />
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/60 backdrop-blur px-3 py-1.5 border border-[#FF2D2D]/40">
                <ScanFace size={14} strokeWidth={2.5} className="text-[#FF2D2D]" />
                <span className="text-[10px] font-black text-[#FF2D2D] uppercase tracking-wider">QSentry AI</span>
                <span className="px-1.5 py-0.5 bg-[#FF2D2D] text-white text-[8px] font-black uppercase tracking-wider rounded">New</span>
              </div>
            </div>
            <div className="p-7">
              <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                AI camera that runs your operations smarter.
              </h3>
              <p className="mt-2 text-[14px] text-white/50 leading-relaxed">
                Turn your camera into an extra pair of eyes — automate monitoring, catch what staff miss, and save hours every week.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#FF2D2D]">
                Discover QSentry AI <ArrowRight size={16} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function V2Page() {
  return (
    <main>
      <SEOHead
        title="QPOS Malaysia — All-in-One POS, Kiosk, QR & Webstore System"
        description="Malaysia's all-in-one POS system. Counter POS, self-service kiosk, QR ordering, mobile POS, webstore, loyalty & AI insights — 14 modules, one platform. Visit our Publika KL showroom."
        keywords="POS system Malaysia, POS Malaysia, point of sale Malaysia, self service kiosk Malaysia, retail POS, F&B POS, restaurant POS, gym POS, salon POS, spa POS, service business POS, cloud POS, 3-in-1 POS, QR ordering Malaysia, counter POS, mobile POS, mPOS Malaysia, loyalty program Malaysia, QPOS, QBot"
        url="https://qbot.now/"
        image="https://qbot.now/qpos-keyvisuals/qsharer.jpg"
        imageAlt="QPOS — Malaysia's all-in-one POS, kiosk, QR & webstore platform"
      />
      <StructuredData type="organization" />
      <HeroSection />
      <SpecialisedSolutionsSection />
      <SellEverywhereSection />
      {/* QR Order Highlight Banner */}
      <section className="py-0">
        <Link to="/products/qr-order" className="group block relative overflow-hidden bg-gradient-to-r from-black via-gray-900 to-black">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-10 w-40 h-40 border border-green-500/40 rounded-2xl rotate-12" />
            <div className="absolute bottom-4 right-20 w-32 h-32 border border-green-500/40 rounded-2xl -rotate-6" />
          </div>
          <div className="container mx-auto px-6 md:px-12 lg:px-20 py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6 relative">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-green-600 flex items-center justify-center flex-shrink-0">
                <QrCode size={28} strokeWidth={2} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-green-600 text-white text-[9px] font-bold uppercase tracking-wider rounded">New</span>
                  <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">QR Order</span>
                </div>
                <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">
                  Sell without the chaos.
                </h3>
                <p className="text-[13px] text-white/40 mt-0.5 hidden md:block">
                  Customers scan, buy, and pay — no walkouts, no stolen cash, no missed sales.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 group-hover:bg-green-500 text-white text-xs font-bold uppercase tracking-wide transition-colors">
                Learn More <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </Link>
      </section>
      <ThreeInOneBanner />
      <PlatformSection />
      <ScaleSection />
      <ModulesSection />
      <HardwareSection />
      <PricingCtaSection />
      <ShowroomSection />
      <FinalCTA />
    </main>
  );
}
