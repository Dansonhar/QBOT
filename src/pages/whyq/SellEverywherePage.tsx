import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Monitor, TabletSmartphone, Globe, Link as LinkIcon, X, Check, Play } from 'lucide-react';
import { trackWhatsAppClick } from '../../utils/trackWhatsApp';
import SEOHead from '../../components/SEOHead';

const whatsappUrl = 'https://wa.me/60126909189?text=Hi%20QPOS%2C%20I%27d%20like%20to%20build%20my%20QPOS';

const cards = [
  { icon: Monitor, title: 'Counter & Mobile POS', desc: 'Serve at the counter or tableside — same system.' },
  { icon: TabletSmartphone, title: 'Self-Service Kiosk', desc: 'Customers order, you save on manpower.' },
  { icon: Globe, title: 'Webstore & QR Ordering', desc: 'Sell online and in-store — one inventory, always synced.' },
  { icon: LinkIcon, title: 'One System, All Connected', desc: 'Add channels as you grow. No switching platforms.' },
];

const withoutItems = [
  'Different system for in-store, online, and kiosk',
  'Stock doesn\'t sync — overselling and manual counts',
  'Adding a new channel means a new vendor',
];

const withItems = [
  'One system across all 6 channels',
  'Real-time inventory across every channel',
  'Just switch it on — same platform',
];

const benefits = [
  { title: '6 Selling Channels', desc: 'Counter, mobile, kiosk, webstore, tablet, QR — all connected' },
  { title: 'Always in Sync', desc: 'One inventory, one menu, one dashboard' },
  { title: 'Grow at Your Pace', desc: 'Add channels when you\'re ready, no extra system needed' },
];

export default function SellEverywherePage() {
  return (
    <div>
      <SEOHead
        title="Omnichannel POS Malaysia — Sell on 6 Channels, One System | QPOS"
        description="Counter POS, mobile POS, self-service kiosk, tablet menu, QR ordering, and webstore — six channels, one menu, one inventory, one customer. Add channels as you grow."
        keywords="omnichannel POS Malaysia, multi-channel POS Malaysia, POS with webstore, POS with kiosk, sell online and offline Malaysia, unified commerce, 6 selling channels, cross-channel POS, QPOS channels"
        url="https://qbot.now/why-q/sell-everywhere"
      />
      {/* Hero */}
      <section className="relative pt-24">
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src="/2 - staff reliability B.webp"
            alt="QPOS Multi-Channel Selling"
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
                <span className="text-white">Sell Everywhere</span>
              </nav>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-none uppercase tracking-tighter mb-4">
                6 CHANNELS. ONE SYSTEM. ZERO CHAOS.
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-xl">
                Sell from counter, mobile, kiosk, webstore, tablet, and QR -- all synced
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
            <p>Most POS systems give you a counter terminal and call it done. QPOS gives you 6 ways to sell — counter POS, mobile POS, self-service kiosk, webstore, tablet ordering, and QR scan-to-order — all running on the same platform, sharing the same inventory, syncing to the same dashboard.</p>
            <p>That means a customer can order from your kiosk while another orders via QR at the table and a third is buying from your webstore — and your stock levels update in real time across all of them. No overselling, no manual reconciliation, no separate systems to maintain.</p>
            <p>The best part: you don't need all 6 on day one. Start with counter POS, add QR ordering next month, launch your webstore when you're ready. Every channel plugs into the same system — no migration, no data loss, no new subscriptions. Just flip it on.</p>
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
          <img src="/qpos-keyvisuals/hero-selleverywhere.webp" alt="Sell Everywhere" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-16 text-white">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-2xl md:text-4xl font-black uppercase mb-4">BUILD YOUR QPOS</h2>
          <p className="text-sm font-bold text-gray-400 mb-8 uppercase">Talk to us and we'll set up the perfect system for your business.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick('Why Q Sell Everywhere > Build Your QPOS')} className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-black text-sm uppercase tracking-wider hover:bg-green-700 transition-colors">
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
