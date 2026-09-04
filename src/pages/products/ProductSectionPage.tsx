// Combined QPOS section pages — Sell / Manage / Operate / Grow.
//
// One data-driven component renders all four. Each consolidates its module
// line-up onto a single page (per the QPOS "4 sections" structure) while the
// individual per-module pages (e.g. /products/pos) stay live and are linked as
// "Learn more". Rendered inside SiteLayout, so no header/footer here.

import { Link } from 'react-router-dom';
import {
  Monitor, Smartphone, LayoutGrid, Globe, Tablet, QrCode,
  BarChart3, Package, ChefHat, ListOrdered, Tv, Zap, Brain, Heart,
  ArrowRight, MessageCircle, type LucideIcon,
} from 'lucide-react';
import SEOHead from '../../components/SEOHead';

const WA = 'https://wa.me/60126909189?text=' + encodeURIComponent("Hi QBot, I'd like to know more about QPOS.");

type Module = { name: string; desc: string; path: string; icon: LucideIcon };
type Section = {
  key: string;
  eyebrow: string;
  headline: string;
  intro: string;
  metaTitle: string;
  metaDesc: string;
  modules: Module[];
};

export const SECTIONS: Record<string, Section> = {
  sell: {
    key: 'sell',
    eyebrow: 'QPOS · Sell',
    headline: 'Sell everywhere — one platform, every channel.',
    intro: 'Take sales and payments at the counter, on the go, from a self-service kiosk, at the table, by QR, or online. Start with one channel and switch on the rest as you grow — all on one connected QPOS system. Convenient for you, flexible for every kind of business.',
    metaTitle: 'QPOS Sell — POS, mPOS, Kiosk, Webstore, QR & Tablet Ordering | Malaysia',
    metaDesc: 'Sell across every channel with QPOS: counter POS, mobile POS, self-service kiosk, online webstore, table ordering and QR ordering — one connected platform for F&B and retail in Malaysia.',
    modules: [
      { name: 'POS', desc: 'Fast, reliable counter point-of-sale built for busy F&B and retail.', path: '/products/pos', icon: Monitor },
      { name: 'mPOS', desc: 'Take orders and payments anywhere with a handheld mobile POS.', path: '/products/mpos', icon: Smartphone },
      { name: 'Self-Service Kiosk', desc: 'Let customers browse, buy and pay themselves — bigger baskets, shorter queues.', path: '/products/kiosk', icon: LayoutGrid },
      { name: 'Webstore', desc: 'Your own online store for pickup, delivery and pre-orders.', path: '/products/webstore', icon: Globe },
      { name: 'Tablet', desc: 'Self-service ordering and checkout right where customers are.', path: '/products/tablet', icon: Tablet },
      { name: 'QR Order', desc: 'Customers scan, buy and pay from their phone — no walkouts, no missed sales.', path: '/products/qr-order', icon: QrCode },
    ],
  },
  manage: {
    key: 'manage',
    eyebrow: 'QPOS · Manage',
    headline: 'Run every outlet from one dashboard.',
    intro: 'See sales, stock and staff across all your outlets in real time. QPOS keeps your menus, inventory and reports in sync so you always know exactly what is happening.',
    metaTitle: 'QPOS Manage — Dashboard, Reports & Inventory | Malaysia',
    metaDesc: 'Manage your whole business with QPOS: QHub real-time dashboard and reports plus inventory and stock control across every outlet.',
    modules: [
      { name: 'QHub Dashboard', desc: 'Real-time sales, reports and outlet performance in one place.', path: '/products/qhub', icon: BarChart3 },
      { name: 'Inventory', desc: 'Track stock, recipes and costs — cut wastage and stop running out.', path: '/products/inventory', icon: Package },
    ],
  },
  operate: {
    key: 'operate',
    eyebrow: 'QPOS · Operate',
    headline: 'Smooth operations, from kitchen to counter.',
    intro: 'Keep service fast and orders accurate. QPOS connects your kitchen, queue and customer-facing displays so every order flows without chaos.',
    metaTitle: 'QPOS Operate — Kitchen Display, Queue & Live Display | Malaysia',
    metaDesc: 'Operate efficiently with QPOS: kitchen display system (KDS), queue management (QMS) and live customer display boards — all connected.',
    modules: [
      { name: 'Kitchen Display (KDS)', desc: 'Send orders straight to the kitchen screen — no more lost dockets.', path: '/products/kitchen-display', icon: ChefHat },
      { name: 'QMS Control', desc: 'Manage queues and call numbers to keep the floor moving.', path: '/products/qms', icon: ListOrdered },
      { name: 'Live Display', desc: 'Digital menu boards and order-status screens for customers.', path: '/products/live-display', icon: Tv },
    ],
  },
  grow: {
    key: 'grow',
    eyebrow: 'QPOS · Grow',
    headline: 'Turn every order into more revenue.',
    intro: 'Sell more to the customers you already have. QPOS adds upsells, loyalty and AI insights so each visit is worth more and customers keep coming back.',
    metaTitle: 'QPOS Grow — Sales Boosters, AI Insights & Loyalty | Malaysia',
    metaDesc: 'Grow revenue with QPOS: automated sales boosters and upsells, AI insights and forecasting, and a built-in loyalty program and app.',
    modules: [
      { name: 'Sales Boosters', desc: 'Automated upsells, combos and promos that lift every basket.', path: '/products/sales-boosters', icon: Zap },
      { name: 'AI Insights', desc: 'Analytics and forecasting that tell you what to do next.', path: '/products/ai-insights', icon: Brain },
      { name: 'Loyalty App', desc: 'Points, rewards and a customer app that drives repeat visits.', path: '/products/loyalty', icon: Heart },
    ],
  },
};

export default function ProductSectionPage({ sectionKey }: { sectionKey: keyof typeof SECTIONS }) {
  const s = SECTIONS[sectionKey];

  return (
    <main className="bg-white">
      <SEOHead
        title={s.metaTitle}
        description={s.metaDesc}
        url={`https://qbot.now/products/${s.key}`}
      />

      {/* hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-14 md:py-20">
          <span className="text-[11px] font-bold text-green-600 uppercase tracking-[0.2em]">{s.eyebrow}</span>
          <h1 className="mt-3 text-3xl md:text-5xl font-black text-black tracking-tight max-w-3xl leading-[1.1]">{s.headline}</h1>
          <p className="mt-4 text-base md:text-lg text-gray-500 max-w-2xl leading-relaxed">{s.intro}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={WA} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold text-sm px-6 py-3.5 rounded-full transition-colors">
              <MessageCircle size={16} /> Talk to us
            </a>
            <Link to="/products" className="inline-flex items-center gap-2 border border-gray-300 hover:border-gray-500 text-black font-semibold text-sm px-6 py-3.5 rounded-full transition-colors">
              All products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* modules */}
      <section className="container mx-auto px-6 md:px-12 lg:px-20 py-14 md:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {s.modules.map((m) => {
            const Icon = m.icon;
            return (
              <Link key={m.path} to={m.path} className="group rounded-2xl border border-gray-200 bg-white p-6 hover:border-green-500 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center mb-4">
                  <Icon size={22} strokeWidth={1.75} className="text-green-600" />
                </div>
                <h3 className="font-black text-lg text-black tracking-tight">{m.name}</h3>
                <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{m.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-green-600">
                  Learn more <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Not sure which fits your business?</h2>
          <p className="mt-2 text-white/50 max-w-xl mx-auto">Tell us how you operate and we'll recommend the right QPOS setup — start with one, add the rest as you grow.</p>
          <a href={WA} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-7 py-4 rounded-full transition-colors">
            <MessageCircle size={18} /> Get a recommendation
          </a>
        </div>
      </section>
    </main>
  );
}
