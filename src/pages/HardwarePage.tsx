import { useEffect, useState } from 'react';
import SEOHead from '../components/SEOHead';
import { Link } from 'react-router-dom';
import {
  Monitor, Cpu, HardDrive, Printer, Nfc, ScanBarcode,
  Repeat, Car, Brain, Wifi, Cable,
  Camera, Globe, Layers, Package, Tablet, Smartphone,
  ArrowRight, MessageCircle, ChevronLeft, ChevronRight, Play
} from 'lucide-react';

import { trackWhatsAppClick } from '../utils/trackWhatsApp';

const whatsappUrl = 'https://wa.me/60126909189?text=Hi%20QPOS%2C%20I%27d%20like%20help%20choosing%20the%20right%20device';

interface SpecItem {
  icon: React.ElementType;
  label: string;
  detail: string;
}

interface VideoItem {
  youtubeId: string;
  label: string;
}

interface DeviceProps {
  id: string;
  index: string;
  name: string;
  tagline: string;
  oneLiner: string;
  heroImage?: string;
  heroVideo?: string; // YouTube video ID for hero
  specs: SpecItem[];
  benefit: string;
  tags: string[];
  gallery: { src: string; alt: string }[];
  videos?: VideoItem[];
  ctaLabel: string;
  bg?: string;
  prevId: string;
  nextId: string;
}

function YouTubeEmbed({ videoId, className = '' }: { videoId: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    return (
      <button
        onClick={() => setLoaded(true)}
        className={`relative bg-black flex items-center justify-center group cursor-pointer ${className}`}
      >
        <img
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
          alt="QBOT hardware video thumbnail"
          className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play size={24} className="text-black ml-1" fill="currentColor" />
          </div>
        </div>
      </button>
    );
  }

  return (
    <iframe
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
      title="Video"
      className={className}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}

function DeviceSection({ id, index, name, tagline, oneLiner, heroImage, heroVideo, specs, benefit, tags, gallery, videos, ctaLabel, bg = 'bg-gray-950', prevId, nextId }: DeviceProps) {
  return (
    <section id={id} className={`${bg} py-20 md:py-28`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header + Prev/Next */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-[0.2em] mb-3">DEVICE {index}</p>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-none uppercase tracking-tighter mb-4">{name}</h2>
            <p className="text-xl md:text-2xl font-bold text-gray-400 mb-2">{tagline}</p>
            <p className="text-sm text-gray-500 max-w-xl">{oneLiner}</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 mt-2">
            <button
              onClick={() => document.getElementById(prevId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="w-10 h-10 flex items-center justify-center border border-gray-700 text-gray-500 hover:text-white hover:border-white transition-colors"
              aria-label="Previous device"
            >
              <ChevronLeft size={18} strokeWidth={2} />
            </button>
            <button
              onClick={() => document.getElementById(nextId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="w-10 h-10 flex items-center justify-center border border-gray-700 text-gray-500 hover:text-white hover:border-white transition-colors"
              aria-label="Next device"
            >
              <ChevronRight size={18} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Hero — Video or Image */}
        <div className="mb-16">
          {heroVideo ? (
            <YouTubeEmbed videoId={heroVideo} className="w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden" />
          ) : heroImage ? (
            <div className="aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden bg-gray-900">
              <img src={heroImage} alt={name} className="w-full h-full object-cover" />
            </div>
          ) : null}
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-16">
          {specs.map((spec) => {
            const Icon = spec.icon;
            return (
              <div key={spec.label} className="border border-gray-800 rounded-xl p-4 md:p-5">
                <Icon className="w-5 h-5 text-gray-500 mb-3" strokeWidth={1.5} />
                <p className="text-xs font-bold text-white uppercase tracking-wider mb-1">{spec.label}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{spec.detail}</p>
              </div>
            );
          })}
        </div>

        {/* Benefit */}
        <div className="max-w-2xl mb-16">
          <p className="text-sm md:text-base text-gray-400 leading-relaxed">{benefit}</p>
        </div>

        {/* Best For Tags */}
        <div className="flex flex-wrap gap-2 mb-16">
          {tags.map((tag) => (
            <span key={tag} className="px-3 py-1.5 bg-gray-800 text-xs font-medium text-gray-400 rounded-full">{tag}</span>
          ))}
        </div>

        {/* Image Gallery */}
        {gallery.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-16">
            {gallery.map((img) => (
              <div key={img.alt} className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-900">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        )}

        {/* Feature Videos */}
        {videos && videos.length > 0 && (
          <div className={`grid ${videos.length === 1 ? 'grid-cols-1 max-w-2xl' : 'grid-cols-1 md:grid-cols-2'} gap-4 mb-16`}>
            {videos.map((v) => (
              <div key={v.youtubeId}>
                <YouTubeEmbed videoId={v.youtubeId} className="w-full aspect-video rounded-xl overflow-hidden" />
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-2">{v.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <Link
          to="/pricing"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors rounded-lg group"
        >
          {ctaLabel} <ArrowRight size={16} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
        </Link>

      </div>
    </section>
  );
}

export default function HardwarePage() {
  const [activeDevice, setActiveDevice] = useState('v3');
  const [showStickyNav, setShowStickyNav] = useState(false);

  useEffect(() => {
    const sections = ['v3', 'v3mix', 'cpad', 'd3pro', 'kiosk'];
    const observers: IntersectionObserver[] = [];

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveDevice(id); },
        { threshold: 0.2 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    const heroEl = document.getElementById('hardware-hero');
    if (heroEl) {
      const heroObserver = new IntersectionObserver(
        ([entry]) => setShowStickyNav(!entry.isIntersecting),
        { threshold: 0 }
      );
      heroObserver.observe(heroEl);
      observers.push(heroObserver);
    }

    return () => observers.forEach(o => o.disconnect());
  }, []);

  const deviceNav = [
    { id: 'v3', label: 'QBOT V3' },
    { id: 'v3mix', label: 'V3 MIX' },
    { id: 'cpad', label: 'CPAD' },
    { id: 'd3pro', label: 'D3 PRO' },
    { id: 'kiosk', label: 'KIOSK' },
  ];

  return (
    <div>
      <SEOHead
        title="POS Hardware Malaysia — SUNMI V3, V3 MIX, CPAD, D3 PRO & Kiosks"
        description="SUNMI-powered POS hardware in Malaysia: V3 handheld, V3 MIX 3-in-1, CPAD tablet POS, D3 PRO dual-screen, and Q1 self-service kiosks. One ecosystem — delivered, installed, supported."
        keywords="POS hardware Malaysia, SUNMI POS Malaysia, POS terminal Malaysia, POS device Malaysia, QBOT V3, V3 MIX, CPAD 11 tablet POS, D3 PRO dual screen POS, Q1 self service kiosk, handheld POS Malaysia, android POS Malaysia, restaurant POS hardware, retail POS hardware"
        url="https://qbot.now/hardware"
        image="https://qbot.now/qpos-keyvisuals/hero-hardware.jpg"
        imageAlt="QPOS hardware lineup — V3, V3 MIX, CPAD, D3 PRO, Q1 kiosk"
      />
      {/* Sticky Device Nav */}
      {showStickyNav && (
        <div className="fixed top-[52px] lg:top-[88px] left-0 right-0 z-40 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-1 overflow-x-auto">
            {deviceNav.map(d => (
              <button
                key={d.id}
                onClick={() => document.getElementById(d.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                  activeDevice === d.id ? 'text-white border-b-2 border-white' : 'text-gray-500 hover:text-white'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Page Hero */}
      <section id="hardware-hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-black overflow-hidden">
        <div className="absolute inset-0">
          <img src="/qpos-keyvisuals/hero-hardware.webp" alt="QBOT POS hardware lineup" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none uppercase tracking-tighter mb-6">
            Your Business.<br />Your Way.
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto mb-4">
            Five devices. One ecosystem. Pick the one that fits how you work.
          </p>
          <p className="text-xs text-gray-600 uppercase tracking-wider mb-12">Powered by SUNMI</p>

          {/* 5 Brutalist Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 max-w-6xl mx-auto">
            {[
              { label: 'I need a device I can carry anywhere', target: 'v3' },
              { label: 'I need flexibility — mobile and counter', target: 'v3mix' },
              { label: 'I want a versatile tablet POS', target: 'cpad' },
              { label: 'I want a complete counter setup', target: 'd3pro' },
              { label: 'I want customers to order themselves', target: 'kiosk' },
            ].map((btn) => (
              <button
                key={btn.target}
                onClick={() => document.getElementById(btn.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="border-2 border-white/20 bg-transparent text-white font-bold text-sm uppercase tracking-wide px-5 py-5 hover:bg-white hover:text-black transition-colors text-left leading-tight"
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Device 1: QBOT V3 */}
      <DeviceSection
        id="v3"
        index="01"
        name="QBOT V3"
        tagline="Everything you need. In the palm of your hand."
        oneLiner="The all-in-one mobile POS — printer, payment, and scanner built into a single handheld device."
        heroVideo="jzY2npdcv4w"
        specs={[
          { icon: Monitor, label: 'Display', detail: '6.75" HD+, 420 nits — readable even in bright sunlight' },
          { icon: Cpu, label: 'Processor', detail: 'Octa-core up to 2.4 GHz — no lag during peak hours' },
          { icon: HardDrive, label: 'Storage', detail: '4GB RAM + 64GB ROM — handles your full menu and inventory' },
          { icon: Printer, label: 'Built-in Printer', detail: 'Receipt + label printing — no extra hardware needed' },
          { icon: Nfc, label: 'Built-in Payment', detail: 'NFC SoftPOS — accept tap-to-pay from the same device' },
          { icon: ScanBarcode, label: 'Barcode Scanner', detail: 'Laser 2D — scans damaged, wrinkled, even stained barcodes' },
        ]}
        benefit="Take orders at the table, scan stock in the storeroom, print receipts on the floor — no counter needed. The QBOT V3 is built for businesses that move. Light enough to carry through a full shift, powerful enough to run your entire operation. Printer and payment terminal are built in, so there's nothing extra to buy, charge, or lose. Metallic finish and ergonomic grip mean it looks and feels like a proper business tool — not a repurposed phone."
        tags={['Cafés', 'Food Trucks', 'Pop-Ups', 'Small Retail', 'Tableside Ordering', 'Delivery Management', 'Queue Ticketing', 'Label Printing']}
        gallery={[
          { src: 'https://file.cdn.sunmi.com/newebsite/products/v3-family/lg/p7-6.jpg', alt: 'Mobile payment' },
          { src: 'https://file.cdn.sunmi.com/newebsite/products/v3-family/lg/p7-2.jpg', alt: 'Tableside ordering' },
          { src: 'https://file.cdn.sunmi.com/newebsite/products/v3-family/lg/p7-4.jpg', alt: 'Label printing' },
        ]}
        videos={[
          { youtubeId: 'KnNCUcFqqAY', label: 'QBOT V3 Overview' },
        ]}
        ctaLabel="Build Your QPOS with QBOT V3"
        prevId="kiosk"
        nextId="v3mix"
      />

      {/* Device 2: QBOT V3 MIX */}
      <DeviceSection
        id="v3mix"
        index="02"
        name="QBOT V3 MIX"
        tagline="Counter. Mobile. Kiosk. One device does it all."
        oneLiner="Three modes in a single device — dock it, carry it, or mount it on the wall."
        heroVideo="3d2SHLp1wCw"
        bg="bg-gray-900"
        specs={[
          { icon: Repeat, label: '3-in-1 Mode', detail: 'Counter POS, mobile POS, and kiosk — switch anytime' },
          { icon: Printer, label: 'Built-in Printer', detail: 'Receipt printing built into the body — no external box' },
          { icon: Nfc, label: 'Built-in Payment', detail: 'Accept payments in any mode — counter, tableside, or self-service' },
          { icon: ScanBarcode, label: 'Barcode/QR Scanner', detail: 'Scan products for inventory checks and quick lookups' },
          { icon: Layers, label: 'Multiple Bases', detail: 'Standard, multi-purpose, desktop, or wall mount — fit any space' },
          { icon: Car, label: 'Drive-Thru Ready', detail: 'Take orders and payments at the window' },
        ]}
        benefit="Why buy three devices when one does everything? Dock the V3 MIX at the counter as your main POS in the morning. Undock it for tableside ordering during the lunch rush. Wall-mount it as a customer-facing kiosk after hours. It adapts to your space and your service style — no extra hardware, no reconfiguration. Perfect for restaurants that do dine-in and takeaway, or retail stores that want a self-service option without buying a separate kiosk."
        tags={['Restaurants', 'Dine-in + Takeaway', 'Retail Stores', 'Drive-Thru', 'Tableside Service', 'Self-Service Counter']}
        gallery={[
          { src: '/qpos-keyvisuals/v3mix/desktop.webp', alt: 'V3 MIX docked (counter mode)' },
          { src: '/qpos-keyvisuals/v3mix/handheld.webp', alt: 'V3 MIX undocked (mobile mode)' },
          { src: '/qpos-keyvisuals/v3mix/kioskmode.webp', alt: 'V3 MIX kiosk mode' },
          { src: '/qpos-keyvisuals/others/tableside.webp', alt: 'Tableside service' },
          { src: '/qpos-keyvisuals/v3mix/cardholder.webp', alt: 'Card holder' },
          { src: '/qpos-keyvisuals/v3mix/printer.webp', alt: 'Built-in printer' },
        ]}
        videos={[
          { youtubeId: 'Q8_gOx3atAI', label: 'V3 MIX Rotate Base Demo' },
        ]}
        ctaLabel="Build Your QPOS with V3 MIX"
        prevId="v3"
        nextId="cpad"
      />

      {/* Device 3: CPAD */}
      <DeviceSection
        id="cpad"
        index="03"
        name="QBOT CPAD"
        tagline="The versatile tablet POS that goes anywhere."
        oneLiner="Compact, powerful, and built for flexibility — wall-mount it, carry it, or dock it at the counter."
        heroVideo="9MbNR1aQKZg"
        specs={[
          { icon: Tablet, label: 'Compact Tablet', detail: 'Slim tablet form factor — fits anywhere, counter to wall' },
          { icon: Smartphone, label: 'Mobile Ready', detail: 'Carry it to the table, queue, or floor — fully portable' },
          { icon: ScanBarcode, label: 'Built-in Scanner', detail: 'Quick scan for QR codes, barcodes, and payments' },
          { icon: Globe, label: 'Wall-Mountable', detail: 'Mount on the wall for self-service or customer-facing display' },
          { icon: Printer, label: 'External Printer', detail: 'Pairs with Bluetooth or USB printers for receipts' },
          { icon: Wifi, label: 'Always Connected', detail: 'WiFi + 4G — stays online wherever you take it' },
        ]}
        benefit="The CPAD is the tablet POS for businesses that need flexibility without compromise. Use it as your main POS at the counter, carry it tableside for orders, mount it on the wall as a KDS or customer display, or hand it to staff for mobile ordering. It's the Swiss Army knife of POS hardware — compact enough to fit anywhere, powerful enough to run your full operation."
        tags={['Cafés', 'Restaurants', 'Tableside Ordering', 'KDS', 'Wall-Mount Display', 'Mobile POS', 'Small Retail']}
        gallery={[
          { src: '/qpos-keyvisuals/cpad/cpadpos.webp', alt: 'CPAD as counter POS' },
          { src: '/qpos-keyvisuals/cpad/cpadmobile.webp', alt: 'CPAD mobile ordering' },
          { src: '/qpos-keyvisuals/cpad/cpadwall.webp', alt: 'CPAD wall-mounted' },
          { src: '/qpos-keyvisuals/cpad/cpadkds.webp', alt: 'CPAD as kitchen display' },
          { src: '/qpos-keyvisuals/cpad/cpadtablesideorder.webp', alt: 'CPAD tableside ordering' },
          { src: '/qpos-keyvisuals/cpad/cpadtakeorder.webp', alt: 'CPAD taking orders' },
          { src: '/qpos-keyvisuals/cpad/cpadscan.webp', alt: 'CPAD scanning' },
        ]}
        videos={[
          { youtubeId: '-9NI_nxhrXk', label: 'CPAD Snap Demo' },
        ]}
        ctaLabel="Build Your QPOS with CPAD"
        bg="bg-gray-900"
        prevId="v3mix"
        nextId="d3pro"
      />

      {/* Device 4: QBOT D3 PRO */}
      <DeviceSection
        id="d3pro"
        index="04"
        name="QBOT D3 PRO"
        tagline="Your counter's command center."
        oneLiner='15.6" FHD touchscreen with optional customer-facing display. The full desktop POS for serious operations.'
        heroVideo="IS1Log2BdS4"
        specs={[
          { icon: Monitor, label: '15.6" FHD Display', detail: 'Full HD capacitive touchscreen — staff can read it from across the counter' },
          { icon: Cpu, label: 'Processor', detail: 'Octa-core 2.2 GHz, Android 14 — zero lag, even during peak' },
          { icon: Brain, label: 'AI-Ready', detail: 'Native 6 TOPS AI computing — hardware that gets smarter over time' },
          { icon: Layers, label: 'Dual Display Option', detail: 'Add a 10.1" or 15.6" customer screen with touch, NFC, and USB' },
          { icon: Wifi, label: 'Connectivity', detail: 'Wi-Fi 6 + Bluetooth 5.4 — rock-solid in crowded malls' },
          { icon: Cable, label: 'Clean Counter', detail: 'Concealed cable design — no wire mess on your counter' },
        ]}
        benefit={`The D3 PRO is the full desktop setup for businesses that don't compromise. A 15.6" screen your staff can read from across the counter. An optional customer-facing display with built-in NFC so customers tap and pay without anyone turning anything around. AI-ready hardware that grows with your business. Concealed cables so your counter looks as professional as your service. You can even brand it with your own logo and colours — this is your POS, not someone else's.`}
        tags={['Chain F&B', 'Busy Retail', 'Convenience Stores', 'Multi-Staff Operations', 'Quick-Service Restaurants', 'Brand-Conscious Businesses']}
        gallery={[
          { src: '/qpos-keyvisuals/d3pro/d3customerorder.webp', alt: 'Customer ordering at D3 PRO' },
          { src: '/qpos-keyvisuals/d3pro/d3retail.webp', alt: 'D3 PRO in retail' },
          { src: '/qpos-keyvisuals/d3pro/d3sale.webp', alt: 'D3 PRO checkout' },
          { src: '/qpos-keyvisuals/d3pro/d3softpos.webp', alt: 'D3 PRO SoftPOS payment' },
        ]}
        videos={[
          { youtubeId: 'wMo83k4crtE', label: 'D3 PRO Overview' },
        ]}
        ctaLabel="Build Your QPOS with D3 PRO"
        prevId="cpad"
        nextId="kiosk"
      />

      {/* Device 5: Self-Service Kiosk */}
      <section id="kiosk" className="bg-gray-900 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header + Prev/Next */}
          <div className="flex items-start justify-between mb-12">
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-[0.2em] mb-3">DEVICE 05</p>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-none uppercase tracking-tighter mb-4">Self-Service Kiosk</h2>
              <p className="text-xl md:text-2xl font-bold text-gray-400 mb-2">Customers order. You save.</p>
              <p className="text-sm text-gray-500 max-w-xl">21" or 27" self-service kiosks. Let customers browse, order, and pay — while your team focuses on service.</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 mt-2">
              <button
                onClick={() => document.getElementById('d3pro')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="w-10 h-10 flex items-center justify-center border border-gray-700 text-gray-500 hover:text-white hover:border-white transition-colors"
                aria-label="Previous device"
              >
                <ChevronLeft size={18} strokeWidth={2} />
              </button>
              <button
                onClick={() => document.getElementById('v3')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="w-10 h-10 flex items-center justify-center border border-gray-700 text-gray-500 hover:text-white hover:border-white transition-colors"
                aria-label="Next device"
              >
                <ChevronRight size={18} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Hero video */}
          <div className="mb-16">
            <YouTubeEmbed videoId="TfoGCMc7SJQ" className="w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden" />
          </div>

          {/* Two models side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* K2 MINI */}
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-6">K2 MINI — 21"</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Package, label: 'Ultra-Light', detail: 'Only 10kg — out of the box, zero assembly needed' },
                  { icon: Layers, label: 'Dual Monitor', detail: '15.6" customer screen + staff screen that tilts and swivels' },
                  { icon: Camera, label: 'Face Recognition', detail: 'Built-in 3D structured light camera' },
                  { icon: Printer, label: 'Seiko Printer', detail: '58mm/80mm — Japanese print engine for fast, reliable receipts' },
                  { icon: ScanBarcode, label: 'Smart Scanner', detail: 'Tilted forward for faster scanning — customers don\'t fumble' },
                  { icon: Globe, label: 'Wall-Mountable', detail: 'Floor-standing or wall-mount — fits any store layout' },
                ].map((spec) => {
                  const Icon = spec.icon;
                  return (
                    <div key={spec.label} className="border border-gray-800 rounded-xl p-4">
                      <Icon className="w-5 h-5 text-gray-500 mb-3" strokeWidth={1.5} />
                      <p className="text-xs font-bold text-white uppercase tracking-wider mb-1">{spec.label}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{spec.detail}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* K2 */}
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-6">K2 — 27"</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Cpu, label: 'Processor', detail: 'Qualcomm octa-core up to 2.7 GHz — handles high-traffic queues' },
                  { icon: HardDrive, label: 'Storage', detail: '6GB RAM + 128GB ROM — smooth even with complex menus' },
                  { icon: Wifi, label: 'Tri-Band Wi-Fi', detail: '2.4 / 5 / 6 GHz — stable in any environment' },
                  { icon: Printer, label: 'Seiko Print Engine', detail: 'Up to 250mm/s print speed — no receipt bottleneck' },
                  { icon: Layers, label: 'Multiple Versions', detail: 'Retail, Restaurant, Healthcare, and Extendable configurations' },
                  { icon: Globe, label: 'Proven Globally', detail: 'Deployed in 30+ countries by 300+ companies' },
                ].map((spec) => {
                  const Icon = spec.icon;
                  return (
                    <div key={spec.label} className="border border-gray-800 rounded-xl p-4">
                      <Icon className="w-5 h-5 text-gray-500 mb-3" strokeWidth={1.5} />
                      <p className="text-xs font-bold text-white uppercase tracking-wider mb-1">{spec.label}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{spec.detail}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Benefit */}
          <div className="max-w-2xl mb-16">
            <p className="text-sm md:text-base text-gray-400 leading-relaxed">
              Let your customers order and pay themselves. No queue, no miscommunication, no extra headcount. The K2 MINI is plug-and-play at just 10kg — mount it on a wall or place it on a counter, no assembly needed. The K2 is the full-size kiosk for high-traffic locations, with dedicated retail, restaurant, and healthcare configurations built in. Both include a staff-facing screen so your team can step in to assist when needed. Self-service doesn't mean no service — it means smarter service.
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-16">
            {['Quick-Service Restaurants', 'High-Traffic F&B', 'Retail Chains', 'Clinics', 'Self-Ordering', 'Reducing Queue Times'].map(tag => (
              <span key={tag} className="px-3 py-1.5 bg-gray-800 text-xs font-medium text-gray-400 rounded-full">{tag}</span>
            ))}
          </div>

          {/* Gallery — K2 images */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-16">
            {[
              { src: '/qpos-keyvisuals/k2/k2desktop.webp', alt: 'K2 desktop setup' },
              { src: '/qpos-keyvisuals/k2/k2duo.webp', alt: 'K2 dual screen' },
              { src: '/qpos-keyvisuals/k2/k2wallmount.webp', alt: 'K2 wall mount' },
              { src: '/qpos-keyvisuals/k2/k2carryanywhere.webp', alt: 'K2 carry anywhere' },
              { src: '/qpos-keyvisuals/k2/k2facescan.webp', alt: 'K2 face recognition' },
              { src: '/qpos-keyvisuals/k2/k2scan.webp', alt: 'K2 barcode scanning' },
            ].map(img => (
              <div key={img.alt} className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-800">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>

          {/* Videos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            <div>
              <YouTubeEmbed videoId="h7mC2mn8PeY" className="w-full aspect-video rounded-xl overflow-hidden" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-2">K2 Specs &amp; Quality</p>
            </div>
          </div>

          {/* CTA */}
          <Link to="/pricing" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors rounded-lg group">
            Build Your QPOS with Kiosk <ArrowRight size={16} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
          </Link>

        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-black py-20 md:py-28 text-white">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">Not Sure Which Device?</h2>
          <p className="text-gray-400 mb-10">Tell us how you sell — we'll recommend the right setup.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/pricing" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors rounded-lg group">
              Build Your QPOS <ArrowRight size={16} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick('Hardware > CTA > Talk to an Expert')} className="inline-flex items-center gap-2 px-8 py-4 border border-gray-600 text-white font-bold text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-colors rounded-lg">
              <MessageCircle size={16} strokeWidth={2.5} /> Talk to an Expert
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
