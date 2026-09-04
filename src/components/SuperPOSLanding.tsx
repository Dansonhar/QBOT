import { useEffect } from 'react';
import {
  Shield, Globe, Smartphone, Monitor, ChefHat,
  QrCode, BarChart3, Users, Star, Check, ArrowRight, Printer, MessageCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PricingSection from './PricingSection';
import HardwareBundles from './HardwareBundles';
import { trackWhatsAppClick } from '../utils/trackWhatsApp';

const CHANNELS = [
  { icon: Monitor, name: 'QPOS', desc: 'Full POS terminal' },
  { icon: Smartphone, name: 'mPOS', desc: 'Mobile POS on the go' },
  { icon: Globe, name: 'Kiosk', desc: 'Self-service ordering' },
  { icon: QrCode, name: 'QR Order', desc: 'Scan & order from table' },
  { icon: Globe, name: 'Webstore', desc: 'Online storefront' },
  { icon: ChefHat, name: 'Kitchen', desc: 'Kitchen display system' },
  { icon: Users, name: 'QBooking', desc: 'Appointment booking' },
  { icon: Printer, name: 'Printing', desc: 'Thermal receipt printing' },
  { icon: BarChart3, name: 'Analytics', desc: 'Sales & customer insights' },
  { icon: Star, name: 'Loyalty', desc: 'Points, stamps & rewards' },
];

const whatsappUrl = 'https://wa.me/60126909189?text=Hi%20QPOS%2C%20I%27m%20interested%20in%20learning%20more';

const handleComingSoon = () => {
  alert('Coming Soon! We are preparing something amazing for you.');
};

export default function SuperPOSLanding() {
  useEffect(() => { document.title = 'QPOS Pricing — Plans & Features'; }, []);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-white pt-28 md:pt-32 pb-16 md:pb-24 border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-bold text-black uppercase tracking-wider mb-4">
              Powered by QPOS
            </p>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-black leading-none uppercase tracking-tighter mb-6">
              Self-Service<br />& Automation<br />Solutions.
            </h1>
            <p className="text-lg md:text-2xl font-black text-gray-400 uppercase mb-8">
              All at affordable pricing. Built for Malaysian F&B and retail.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleComingSoon}
                className="flex items-center gap-2 px-8 py-4 bg-black text-white font-black text-sm uppercase tracking-wider border border-gray-300 hover:bg-white hover:text-black transition-colors group"
              >
                Start Free <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick('Pricing > Hero > WhatsApp Us')}
                className="flex items-center gap-2 px-8 py-4 bg-transparent text-black font-black text-sm uppercase tracking-wider border border-gray-300 hover:bg-black hover:text-white transition-colors"
              >
                <MessageCircle size={16} strokeWidth={3} /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="border-b border-gray-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-0">
          {[
            { title: 'Save Staff Cost', desc: 'No more RM2,500-RM4,000 salaries plus overtime' },
            { title: 'Reduce Headcount', desc: 'Use staff only where required' },
            { title: 'Accept All Payments', desc: 'Credit cards, TNG, Boost, GrabPay and more' },
          ].map((item, index) => (
            <div
              key={item.title}
              className={`p-8 md:p-10 ${index !== 2 ? 'md:border-r border-b md:border-b-0 border-gray-300' : ''}`}
            >
              <h3 className="text-lg md:text-xl font-black text-black mb-2 uppercase">{item.title}</h3>
              <p className="text-sm font-bold text-black uppercase leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Channels Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <h2 className="text-2xl md:text-4xl font-black text-black text-center mb-4 uppercase">
          Everything You Need, One System
        </h2>
        <p className="text-sm font-bold text-gray-500 text-center mb-12 uppercase">
          10+ channels working together. One dashboard to rule them all.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-0 border border-gray-300">
          {CHANNELS.map((ch) => {
            const Icon = ch.icon;
            return (
              <div key={ch.name} className="p-5 border border-gray-300 hover:bg-gray-50 transition-all text-center">
                <Icon className="w-8 h-8 text-black mx-auto mb-3" />
                <h3 className="font-black text-black text-sm uppercase">{ch.name}</h3>
                <p className="text-xs text-gray-500 mt-1 uppercase">{ch.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Security */}
      <section className="bg-black py-16 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Shield className="w-12 h-12 text-white mx-auto mb-4" />
          <h2 className="text-2xl md:text-4xl font-black mb-4 uppercase">Enterprise-Grade Security</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-sm font-bold uppercase">
            Role-based access control. Server-side entitlement enforcement. PIN-based staff authentication.
          </p>
          <div className="flex items-center justify-center gap-6 md:gap-8 text-xs font-bold text-gray-300 flex-wrap uppercase">
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-white" /> Tenant Isolation</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-white" /> RLS Enforced</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-white" /> Audit Logging</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-white" /> Multi-Outlet Support</span>
          </div>
        </div>
      </section>

      {/* Hardware Bundles */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20 border-b border-gray-200">
        <HardwareBundles />
      </section>

      {/* Software Pricing */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <PricingSection />
      </section>

      {/* CTA */}
      <section className="bg-black py-16 text-white border-t border-gray-300">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-2xl md:text-4xl font-black uppercase mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-sm font-bold text-gray-400 mb-8 uppercase">
            See QPOS in action and discover how it can revolutionize your operations
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleComingSoon}
              className="flex items-center gap-2 px-8 py-4 bg-white text-black font-black text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors group"
            >
              Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('Pricing > CTA > WhatsApp Us')}
              className="flex items-center gap-2 px-8 py-4 bg-transparent text-white font-black text-sm uppercase tracking-wider border border-gray-300 hover:bg-white hover:text-black transition-colors"
            >
              <MessageCircle size={16} strokeWidth={3} /> WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
