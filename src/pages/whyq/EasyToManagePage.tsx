import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, LayoutDashboard, BarChart3, Utensils, GraduationCap, X, Check, Play } from 'lucide-react';
import { trackWhatsAppClick } from '../../utils/trackWhatsApp';
import SEOHead from '../../components/SEOHead';

const whatsappUrl = 'https://wa.me/60126909189?text=Hi%20QPOS%2C%20I%27d%20like%20to%20build%20my%20QPOS';

const cards = [
  { icon: LayoutDashboard, title: 'QHub Command Center', desc: 'One dashboard for sales, inventory, staff, and reports.' },
  { icon: BarChart3, title: 'Real-Time Reporting', desc: 'See what\'s happening across every outlet, right now.' },
  { icon: Utensils, title: 'Kitchen Display System', desc: 'Orders flow straight to the kitchen. No lost tickets.' },
  { icon: GraduationCap, title: 'Zero Training Needed', desc: 'So simple, new staff can start taking orders in minutes.' },
];

const withoutItems = [
  'Checking multiple apps for sales, stock, staff',
  'Paper tickets lost or misread in the kitchen',
  'New staff takes days to learn the system',
];

const withItems = [
  'One dashboard — QHub — for everything',
  'Digital KDS — every order tracked and timed',
  'Intuitive UI — productive in minutes',
];

const benefits = [
  { title: 'One Dashboard', desc: 'QHub centralises every part of your operation' },
  { title: 'Fewer Mistakes', desc: 'Digital kitchen orders eliminate lost tickets' },
  { title: 'Staff-Proof', desc: 'So simple, training is barely needed' },
];

export default function EasyToManagePage() {
  return (
    <div>
      <SEOHead
        title="Easy POS Management Malaysia — QHub Dashboard & Multi-Outlet | QPOS"
        description="One QHub dashboard for sales, inventory, staff, and every outlet. Real-time reporting, role-based access, centralised menu control. New staff start in minutes, no training headaches."
        keywords="easy POS management Malaysia, multi-outlet POS dashboard, QHub Malaysia, central restaurant management, franchise POS Malaysia, simple POS Malaysia, zero training POS, role-based POS, real-time reports POS"
        url="https://qbot.now/why-q/easy-to-manage"
      />
      {/* Hero */}
      <section className="relative pt-24">
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src="/qbot-aihub-v2.webp"
            alt="QPOS Management Dashboard"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-6 w-full">
              <nav className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-white/50 mb-6">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <span>Why Q</span>
                <span>/</span>
                <span className="text-white">Easy to Manage</span>
              </nav>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-none uppercase tracking-tighter mb-4">
                RUN YOUR BUSINESS FROM ONE SCREEN
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-xl">
                One dashboard for sales, inventory, staff, and reports
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Visual Cards */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div key={card.title} className="border border-gray-300 p-6 hover:border-black hover:shadow-lg transition-all">
              <card.icon className="w-8 h-8 text-black mb-4" strokeWidth={2} />
              <h3 className="text-sm font-black text-black uppercase mb-2">{card.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Deep-Dive */}
      <section className="bg-gray-50 border-t border-b border-gray-300 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-black text-black uppercase tracking-tighter mb-8">THE FULL PICTURE</h2>
          <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
            <p>QHub is your central command center — everything your business generates flows through one dashboard. Sales by outlet, inventory levels, staff performance, customer data — it's all there, live, without flipping between apps or waiting for end-of-day reports.</p>
            <p>The KDS replaces paper tickets and shouting across the kitchen. Every order from every channel — counter, kiosk, QR, webstore — lands on the kitchen screen the moment it's placed. Colour-coded by priority, timed so nothing sits too long, and automatically cleared when fulfilled.</p>
            <p>The whole system was designed so that a new hire can start taking orders within minutes. No thick manuals, no two-day training. The interface guides them through every step. That means less time onboarding and fewer mistakes during peak hours.</p>
          </div>
        </div>
      </section>

      {/* Before vs After */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-black text-black uppercase tracking-tighter mb-8">BEFORE VS AFTER</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-gray-300">
          <div className="bg-gray-50 p-6 border-b md:border-b-0 md:border-r border-gray-300">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">WITHOUT QPOS</h3>
            <ul className="space-y-3">
              {withoutItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-500">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-6">
            <h3 className="text-xs font-black text-black uppercase tracking-widest mb-4">WITH QPOS</h3>
            <ul className="space-y-3">
              {withItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-black">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="border-t border-b border-gray-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-0">
          {benefits.map((b, i) => (
            <div key={b.title} className={`p-8 ${i < 2 ? 'border-b md:border-b-0 md:border-r border-gray-300' : ''}`}>
              <h3 className="text-sm font-black text-black uppercase mb-2">{b.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Video Placeholder */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="aspect-video rounded-lg overflow-hidden">
          <img src="/qpos-keyvisuals/hero-easymanage.webp" alt="Easy to Manage" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-16 text-white">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-2xl md:text-4xl font-black uppercase mb-4">BUILD YOUR QPOS</h2>
          <p className="text-sm font-bold text-gray-400 mb-8 uppercase">Talk to us and we'll set up the perfect system for your business.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick('Why Q Easy to Manage > Build Your QPOS')} className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-black text-sm uppercase tracking-wider hover:bg-green-700 transition-colors">
              <MessageCircle size={16} strokeWidth={3} /> Build Your QPOS
            </a>
            <Link to="/products" className="flex items-center gap-2 px-8 py-4 bg-transparent text-white font-black text-sm uppercase tracking-wider border border-gray-600 hover:bg-white hover:text-black transition-colors">
              See All Products <ArrowRight size={16} strokeWidth={3} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
