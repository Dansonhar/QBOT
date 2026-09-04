import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Monitor, Smartphone, LayoutGrid, Globe, Tablet, QrCode,
  BarChart3, Package, Heart, ChefHat, ListOrdered, Tv, Zap, Brain,
} from 'lucide-react';

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

export default function ModulesGrid() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="text-2xl md:text-[36px] lg:text-[42px] font-extrabold text-black leading-[1.12] tracking-tight mb-4">
            14 modules for anything your business needs
          </h2>
          <p className="text-[15px] text-gray-400 leading-[1.7] max-w-2xl mx-auto">
            Sell across 6 channels. Manage your back office, inventory, and loyalty. Run kitchen display, queue management, and live screens. Grow with AI insights and automated sales boosters. One platform. Activate what you need.
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
