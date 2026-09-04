import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { ArrowRight, Monitor, Smartphone, LayoutGrid, Check, Zap, Shield, Wifi, WifiOff } from 'lucide-react';
import { trackWhatsAppClick } from '../utils/trackWhatsApp';

const modes = [
  {
    icon: Monitor,
    title: 'COUNTER POS',
    desc: 'Full register. Shift management, split bills, receipts, kitchen sync. Your main checkout station.',
    image: '/qpos-keyvisuals/v3mix/desktop.webp',
  },
  {
    icon: Smartphone,
    title: 'MOBILE POS',
    desc: 'Same device, handheld. Take orders tableside, in queue, at events. Orders fire to kitchen instantly.',
    image: '/qpos-keyvisuals/v3mix/handheld.webp',
  },
  {
    icon: LayoutGrid,
    title: 'KIOSK MODE',
    desc: 'Face it to the customer. They browse, order, pay themselves. No staff at the counter.',
    image: '/qpos-keyvisuals/v3mix/kioskmode.webp',
  },
];

const specs = [
  { label: 'Display', value: '10.1" HD Touchscreen' },
  { label: 'Printer', value: 'Built-in 80mm thermal' },
  { label: 'Payment', value: 'Built-in NFC + chip + swipe' },
  { label: 'Connectivity', value: 'WiFi + 4G + Bluetooth' },
  { label: 'Camera', value: 'Front-facing for QR scan' },
  { label: 'Battery', value: 'All-day battery life' },
  { label: 'OS', value: 'Android-based, QPOS pre-loaded' },
  { label: 'Weight', value: 'Lightweight, one-hand grip' },
];

const softwareHighlights = [
  { icon: Zap, title: 'Sales Boosters built in', desc: 'Auto upsells, combo prompts, spend nudges — on every order, every mode.' },
  { icon: Shield, title: 'Offline capable', desc: 'Keep taking orders when internet drops. Syncs automatically when reconnected.' },
  { icon: WifiOff, title: '14 modules, one device', desc: 'POS, kiosk, QR, loyalty, inventory, kitchen display, AI — all accessible from V3 MIX.' },
];

export default function ThreeInOnePage() {
  return (
    <div>
      <SEOHead
        title="3-in-1 POS Malaysia — Counter, Mobile & Kiosk in One | V3 MIX"
        description="One device replaces counter POS, mobile POS, and self-service kiosk. QBOT V3 MIX with built-in receipt printer, card reader, and full-shift battery. Start lean, scale fast."
        keywords="3-in-1 POS Malaysia, V3 MIX, QBOT V3, convertible POS, hybrid POS, kiosk mode POS, all-in-one POS device Malaysia, SUNMI V3, handheld to kiosk POS, single device POS"
        url="https://qbot.now/3-in-1"
        image="https://qbot.now/qpos-keyvisuals/hero-3in1.jpg"
        imageAlt="QBOT V3 MIX — 3-in-1 POS for counter, mobile, and kiosk"
      />
      {/* ── HERO ── */}
      <section className="relative bg-black text-white overflow-hidden" style={{ minHeight: '75vh' }}>
        <div className="absolute inset-0">
          <img src="/qpos-keyvisuals/hero-3in1.webp" alt="QBOT V3 MIX 3-in-1 POS device — counter, mobile, and kiosk mode" className="w-full h-full object-cover opacity-40" />
        </div>
        <div className="relative z-10 flex items-end min-h-[75vh] pb-12 md:pb-20">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="max-w-3xl">
              <p className="text-[11px] font-bold text-green-400 uppercase tracking-[0.15em] mb-4">QBOT V3 MIX — 3-IN-1 DEVICE</p>
              <h1 className="text-[36px] md:text-[56px] lg:text-[72px] font-black leading-[0.88] tracking-tighter uppercase mb-5">
                ONE DEVICE.<br />THREE MODES.<br />ZERO COMPROMISE.
              </h1>
              <p className="text-[15px] md:text-[17px] text-white/50 leading-[1.65] max-w-lg mb-7">
                Counter POS. Mobile POS. Self-service kiosk. The QBOT V3 MIX replaces three separate machines with one.
              </p>
              <div className="flex items-center gap-3">
                <a href="https://wa.me/60126909189?text=Hi%20QPOS%2C%20I%27m%20interested%20in%20the%20V3%20MIX%203-in-1%20device" target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick('3-in-1 > Hero > Book a Demo')} className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white text-sm font-bold uppercase tracking-wide transition-colors group">
                  Book a Demo <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
                <Link to="/build" className="inline-flex items-center gap-2 px-6 py-3 border border-white/25 hover:border-white/50 text-white/70 hover:text-white text-sm font-bold uppercase tracking-wide transition-all">
                  Build Your Setup
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE 3 MODES ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="text-2xl md:text-[36px] lg:text-[42px] font-extrabold text-black leading-[1.12] tracking-tight mb-4">
              Three machines. One device.
            </h2>
            <p className="text-[15px] text-gray-400 leading-[1.7] max-w-xl mx-auto">
              Most businesses buy a counter POS, a handheld POS, and a self-service kiosk separately. The V3 MIX does all three.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {modes.map((mode) => {
              const Icon = mode.icon;
              return (
                <div key={mode.title} className="group">
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100 mb-4">
                    <img src={mode.image} alt={mode.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <Icon size={18} strokeWidth={1.5} className="text-green-600" />
                    <h3 className="text-sm font-bold text-black uppercase tracking-wide">{mode.title}</h3>
                  </div>
                  <p className="text-[13px] text-gray-400 leading-[1.6]">{mode.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── THE DEVICE — Hardware showcase ── */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="text-[11px] font-bold text-green-600 uppercase tracking-[0.15em] mb-4">THE HARDWARE</p>
              <h2 className="text-2xl md:text-[36px] lg:text-[42px] font-extrabold text-black leading-[1.12] tracking-tight mb-5">
                QBOT V3 MIX
              </h2>
              <p className="text-[15px] text-gray-400 leading-[1.7] mb-8">
                Built-in receipt printer, built-in payment terminal, all-day battery. Desktop or wall-mount. Goes from counter to handheld to kiosk in seconds — no extra hardware needed.
              </p>

              {/* Configs */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center border border-gray-200 bg-white px-4 py-3">
                  <span className="text-sm font-bold text-black">Desktop config</span>
                </div>
                <div className="flex items-center border border-gray-200 bg-white px-4 py-3">
                  <span className="text-sm font-bold text-black">Dual mode + wall mount</span>
                </div>
              </div>

              {/* Optional add-ons */}
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-3">Optional add-ons</p>
              <div className="space-y-1.5">
                {['Desktop base', 'Cash drawer (Basic)', 'Cash drawer (Premium)'].map((label) => (
                  <div key={label} className="text-[13px]">
                    <span className="text-gray-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Device image */}
            <div className="aspect-square overflow-hidden bg-gray-100">
              <img src="/qpos-keyvisuals/v3mix/handheld2.webp" alt="QBOT V3 MIX" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ── SPECS ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <h2 className="text-xl md:text-2xl font-extrabold text-black tracking-tight mb-8">Technical Specs</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 border border-gray-200">
            {specs.map((s) => (
              <div key={s.label} className="bg-white p-4 md:p-5">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">{s.label}</p>
                <p className="text-sm font-bold text-black">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOFTWARE — What makes it special ── */}
      <section className="py-20 md:py-28 bg-black text-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-[11px] font-bold text-green-400 uppercase tracking-[0.15em] mb-4">THE SOFTWARE</p>
            <h2 className="text-2xl md:text-[36px] lg:text-[42px] font-extrabold text-white leading-[1.12] tracking-tight mb-4">
              It's not just the device. It's what runs on it.
            </h2>
            <p className="text-[15px] text-white/40 leading-[1.7] max-w-xl mx-auto">
              Every V3 MIX comes pre-loaded with QPOS — the full 14-module platform. Sales Boosters, AI Insights, loyalty, kitchen display, inventory — all built in, all connected.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-12">
            {softwareHighlights.map((h) => {
              const Icon = h.icon;
              return (
                <div key={h.title} className="border border-white/10 p-6">
                  <Icon size={22} strokeWidth={1.5} className="text-green-400 mb-3" />
                  <h3 className="text-sm font-bold text-white mb-1">{h.title}</h3>
                  <p className="text-[13px] text-white/40 leading-[1.6]">{h.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Module list */}
          <div className="bg-white/5 border border-white/10 p-6 md:p-8">
            <p className="text-[11px] font-bold text-white/30 uppercase tracking-wide mb-4">All 14 modules included</p>
            <div className="flex flex-wrap gap-3">
              {['POS', 'mPOS', 'Kiosk', 'Webstore', 'Tablet', 'QR Order', 'QHub', 'Inventory', 'Loyalty', 'Kitchen Display', 'QMS', 'Live Display', 'Sales Boosters', 'AI Insights'].map((m) => (
                <span key={m} className="text-[12px] font-medium text-white/50 border border-white/10 px-3 py-1.5">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <h2 className="text-xl md:text-2xl font-extrabold text-black tracking-tight mb-8">See it up close</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { src: '/qpos-keyvisuals/v3mix/cardholder.webp', alt: 'Card holder' },
              { src: '/qpos-keyvisuals/v3mix/ircamera.webp', alt: 'IR camera' },
              { src: '/qpos-keyvisuals/v3mix/printer.webp', alt: 'Built-in printer' },
              { src: '/qpos-keyvisuals/v3mix/tableside-custoemr.webp', alt: 'Tableside customer view' },
              { src: '/qpos-keyvisuals/v3mix/p1-bg.webp', alt: 'V3 MIX overview' },
            ].map((img) => (
              <div key={img.src} className="aspect-square overflow-hidden bg-gray-100">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <h2 className="text-xl md:text-2xl font-extrabold text-black tracking-tight mb-8">What's in the box</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              'QBOT V3 MIX device',
              'Built-in receipt printer',
              'Built-in payment terminal',
              'QPOS software pre-loaded',
              'Online training session',
              'Installation (coverage area)',
              'First-time menu setup',
              'Plus plan included',
              '6 months after-sales service',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5 py-2">
                <Check size={14} strokeWidth={3} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium text-black">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-16 md:py-24 bg-black text-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-[36px] lg:text-[42px] font-extrabold text-white leading-[1.12] tracking-tight mb-4">
              Ready to replace three machines with one?
            </h2>
            <p className="text-[15px] text-white/40 leading-[1.7] mb-8">
              See the V3 MIX in action at our Publika KL showroom, or book a demo online.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="https://wa.me/60126909189?text=Hi%20QPOS%2C%20I%27m%20interested%20in%20the%20V3%20MIX%203-in-1" target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick('3-in-1 > Final CTA > Book a Demo')} className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white text-sm font-bold uppercase tracking-wide transition-colors group">
                Book a Demo <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
              <Link to="/build" className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 hover:border-white/40 text-white/60 hover:text-white text-sm font-bold uppercase tracking-wide transition-all">
                Build Your Setup
              </Link>
              <Link to="/hardware" className="inline-flex items-center px-6 py-3 text-white/40 hover:text-white text-sm font-bold uppercase tracking-wide transition-colors">
                See All Hardware
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
