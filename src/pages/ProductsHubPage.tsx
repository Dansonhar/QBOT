import SEOHead from '../components/SEOHead';
import {
  ArrowRight,
  BarChart3,
  Cpu,
  Globe,
  Heart,
  ListOrdered,
  MessageCircle,
  Monitor,
  Package,
  QrCode,
  Smartphone,
  Tablet,
  TabletSmartphone,
  TrendingUp,
  Tv,
  Utensils,
  Layers,
  RefreshCw,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { trackWhatsAppClick } from '../utils/trackWhatsApp';

const whatsappUrl =
  'https://wa.me/60126909189?text=Hi%20QPOS%2C%20I%27m%20interested%20in%20learning%20more';

const sellModules = [
  {
    name: 'POS',
    description: 'Full counter POS with menu management, split bills, and payments',
    path: '/products/pos',
    icon: Monitor,
    image: '/qpos-keyvisuals/hero-qpos.webp',
  },
  {
    name: 'mPOS',
    description: 'Mobile POS for tableside orders, events, and pop-ups',
    path: '/products/mpos',
    icon: Smartphone,
    image: '/qpos-keyvisuals/hero-mpos.webp',
  },
  {
    name: 'Kiosk',
    description: 'Self-ordering kiosk that boosts average order value by 20-30%',
    path: '/products/kiosk',
    icon: TabletSmartphone,
    image: '/qpos-keyvisuals/hero-kiosk.webp',
  },
  {
    name: 'Webstore',
    description: 'Built-in online store — zero commission, automatic menu sync',
    path: '/products/webstore',
    icon: Globe,
    image: '/qpos-keyvisuals/hero-web.webp',
  },
  {
    name: 'Tablet',
    description: 'Table-side ordering tablets for premium dine-in service',
    path: '/products/tablet',
    icon: Tablet,
    image: '/qpos-keyvisuals/hero-tableside.webp',
  },
  {
    name: 'QR Order',
    description: 'QR code ordering — zero hardware, zero app download',
    path: '/products/qr-order',
    icon: QrCode,
    image: '/qpos-keyvisuals/hero-qrorder.webp',
  },
];

const manageModules = [
  {
    name: 'QHub AI Dashboard',
    description: 'All-in-one cloud management for all your needs',
    path: '/products/qhub',
    icon: BarChart3,
    image: '/qpos-keyvisuals/hero-aidashboard.webp',
  },
  {
    name: 'Inventory',
    description: 'Real-time stock tracking, low stock alerts, purchase orders, cost tracking',
    path: '/products/inventory',
    icon: Package,
    image: '/qpos-keyvisuals/hero-ims.webp',
  },
];

const operateModules = [
  {
    name: 'Kitchen Display',
    description: 'Digital KDS replacing paper tickets. All channels on one screen.',
    path: '/products/kitchen-display',
    icon: Utensils,
    image: '/qpos-keyvisuals/hero-kds.webp',
  },
  {
    name: 'QMS Control',
    description: 'Queue management with digital numbering and automated calling',
    path: '/products/qms',
    icon: ListOrdered,
    image: '/qpos-keyvisuals/hero-qms.webp',
  },
  {
    name: 'Live Display',
    description: 'Digital menu board synced with POS. Menus, promos, order status.',
    path: '/products/live-display',
    icon: Tv,
    image: '/qpos-keyvisuals/hero-livedisplay.webp',
  },
];

const growModules = [
  {
    name: 'Sales Boosters',
    description:
      'Smart upsells, combo builder, happy hour triggers, spend thresholds. Up to 30% more revenue per order.',
    path: '/products/sales-boosters',
    icon: TrendingUp,
    image: '/qpos-keyvisuals/hero-salesbooster.webp',
  },
  {
    name: 'AI Insights',
    description:
      'Sales forecasting, menu performance analysis, customer patterns, anomaly detection. No data scientist required.',
    path: '/products/ai-insights',
    icon: Cpu,
    image: '/qpos-keyvisuals/hero-aidashboard.webp',
  },
  {
    name: 'Loyalty App',
    description:
      'Your own loyalty program — stamps, rewards, wallet — built into the POS. No third-party app, no extra cost.',
    path: '/products/loyalty',
    icon: Heart,
    image: '/qpos-keyvisuals/hero-loyaltyapp.webp',
  },
];

const connections = [
  {
    icon: Layers,
    text: 'Orders from 6 channels \u2192 One kitchen display',
  },
  {
    icon: RefreshCw,
    text: 'Every transaction \u2192 Automatic stock update',
  },
  {
    icon: Users,
    text: 'All customer data \u2192 Unified loyalty profile',
  },
];

function ModuleCard({
  module,
  dark = false,
}: {
  module: { name: string; description: string; path: string; icon: React.ElementType; image?: string };
  dark?: boolean;
}) {
  const Icon = module.icon;
  return (
    <Link
      to={module.path}
      className={`group border transition-all overflow-hidden ${
        dark
          ? 'border-gray-700 hover:border-white hover:shadow-lg'
          : 'border-gray-300 hover:border-black hover:shadow-lg'
      }`}
    >
      {module.image && (
        <div className="aspect-[16/9] overflow-hidden bg-gray-100">
          <img src={module.image} alt={module.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      <div className="p-6">
        {!module.image && (
          <Icon
            size={28}
            strokeWidth={2}
            className={dark ? 'text-gray-400 mb-4' : 'text-gray-500 mb-4'}
          />
        )}
        <h3
          className={`text-sm font-black uppercase tracking-wider mb-2 ${
            dark ? 'text-white' : 'text-black'
          }`}
        >
          {module.name}
        </h3>
        <p
          className={`text-sm leading-relaxed mb-4 ${
            dark ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          {module.description}
        </p>
        <span
          className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider ${
            dark
              ? 'text-gray-500 group-hover:text-white'
              : 'text-gray-400 group-hover:text-black'
          } transition-colors`}
        >
          Learn more <ArrowRight size={12} strokeWidth={3} />
        </span>
      </div>
    </Link>
  );
}

export default function ProductsHubPage() {
  return (
    <div>
      <SEOHead
        title="POS System Features Malaysia — 14 Modules for F&B & Retail"
        description="Every feature in one system: POS, self-order kiosk, QR ordering, mobile POS, webstore, tablet menu, loyalty, inventory, kitchen display, queue management, AI insights & sales boosters."
        keywords="POS features Malaysia, POS modules Malaysia, restaurant POS features, retail POS features, POS ecosystem Malaysia, kitchen display system Malaysia, queue management Malaysia, loyalty program Malaysia, sales boosters, inventory management Malaysia, AI analytics POS, QPOS products"
        url="https://qbot.now/products"
        image="https://qbot.now/qpos-keyvisuals/others/qapps_ecosystem.jpg"
        imageAlt="QPOS 14-module product ecosystem overview"
      />
      {/* ── Hero ── */}
      <section className="bg-white pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            QPOS ECOSYSTEM
          </p>
          <h1 className="text-4xl md:text-7xl font-black text-black leading-none uppercase tracking-tighter mb-6">
            ONE SYSTEM. EVERY CHANNEL.
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mb-12">
            14 integrated modules across 4 categories. Sell anywhere, manage everything,
            operate seamlessly, grow automatically.
          </p>

          <div className="flex flex-wrap gap-4">
            {[
              '6 Selling Channels',
              '2 Management Tools',
              '3 Operations Modules',
              '3 Growth Engines',
            ].map((stat) => (
              <span
                key={stat}
                className="px-5 py-2.5 border border-gray-300 text-xs font-black text-black uppercase tracking-wider"
              >
                {stat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sell ── */}
      <section className="bg-white border-t border-gray-300 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              SELL
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-black uppercase tracking-tighter mb-4">
            6 WAYS TO SELL. ZERO MISSED ORDERS.
          </h2>
          <p className="text-gray-400 max-w-2xl mb-12">
            Counter, mobile, kiosk, online, tablet, QR — every channel feeds into one
            system. Customers order how they want. You never lose a sale.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sellModules.map((m) => (
              <ModuleCard key={m.name} module={m} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Manage ── */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              MANAGE
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-black uppercase tracking-tighter mb-4">
            SEE EVERYTHING. CONTROL EVERYTHING.
          </h2>
          <p className="text-gray-400 max-w-2xl mb-12">
            Dashboard, inventory, loyalty — all the tools to run your business from one
            screen. Real-time data, instant control, zero guesswork.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {manageModules.map((m) => (
              <ModuleCard key={m.name} module={m} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Operate ── */}
      <section className="bg-white border-t border-gray-300 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              OPERATE
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-black uppercase tracking-tighter mb-4">
            YOUR KITCHEN AND FLOOR. FINALLY IN SYNC.
          </h2>
          <p className="text-gray-400 max-w-2xl mb-12">
            Kitchen displays, queue management, live screens — operations that run
            themselves. Every order routed, every customer called, every screen updated
            automatically.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {operateModules.map((m) => (
              <ModuleCard key={m.name} module={m} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Grow ── */}
      <section className="bg-black py-16 md:py-24 border-t border-gray-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              GROW
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
            MOST POS RECORD SALES. QPOS INCREASES THEM.
          </h2>
          <p className="text-gray-400 max-w-2xl mb-12">
            Smart upselling and AI analytics that turn your data into revenue. Other systems
            track what happened. QPOS tells you what to do next.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {growModules.map((m) => (
              <ModuleCard key={m.name} module={m} dark />
            ))}
          </div>
        </div>
      </section>

      {/* ── Everything Connects ── */}
      <section className="bg-white border-t border-gray-300 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-black uppercase tracking-tighter mb-4">
            EVERYTHING CONNECTS
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-16">
            Every module feeds into one unified system. One database. One dashboard. One
            truth. No integrations to maintain, no data silos to break down.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {connections.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.text} className="flex flex-col items-center">
                  <div className="w-14 h-14 flex items-center justify-center border border-gray-300 mb-4">
                    <Icon size={24} strokeWidth={2} className="text-black" />
                  </div>
                  <p className="text-sm font-bold text-black uppercase tracking-wider">
                    {c.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Bar ── */}
      <section className="bg-black py-16">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4">
            FIND YOUR PERFECT SETUP
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            Not sure which modules you need? Talk to us.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('Products Hub > WhatsApp Us')}
              className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-black text-sm uppercase tracking-wider hover:bg-green-700 transition-colors"
            >
              <MessageCircle size={16} strokeWidth={3} /> WhatsApp Us
            </a>
            <Link
              to="/hardware"
              className="flex items-center gap-2 px-8 py-4 bg-transparent text-white font-black text-sm uppercase tracking-wider border border-gray-600 hover:bg-white hover:text-black transition-colors"
            >
              See Hardware <ArrowRight size={16} strokeWidth={3} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
