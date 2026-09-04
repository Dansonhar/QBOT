import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Monitor, Printer, Cloud, Puzzle, X, Check, Play } from 'lucide-react';
import { trackWhatsAppClick } from '../../utils/trackWhatsApp';
import SEOHead from '../../components/SEOHead';

const whatsappUrl = 'https://wa.me/60126909189?text=Hi%20QPOS%2C%20I%27d%20like%20to%20build%20my%20QPOS';

const cards = [
  { icon: Monitor, title: '4 Devices, One Ecosystem', desc: 'From compact to full setup — pick what fits your business.' },
  { icon: Printer, title: 'Printer & Payment Built In', desc: 'No extra boxes on your counter. Everything in one device.' },
  { icon: Cloud, title: 'Cloud-Powered System', desc: 'Access your store from anywhere. Updates happen automatically.' },
  { icon: Puzzle, title: 'Modular by Design', desc: 'Turn features on or off. Only pay for what you actually use.' },
];

const withoutItems = [
  'Separate printer, terminal, and POS — 3 devices to manage',
  'Software locked to one machine, can\'t check remotely',
  'Paying for features you don\'t use',
];

const withItems = [
  'One device does it all',
  'Cloud-based — access from anywhere',
  'Toggle on/off — only pay for what you need',
];

const benefits = [
  { title: 'World-Class Hardware', desc: 'Enterprise-grade devices at a fraction of what traditional POS systems cost' },
  { title: 'All-in-One', desc: 'Printer + payment + POS in a single device' },
  { title: 'Your Setup, Your Rules', desc: 'Modular system that adapts to your business' },
];

export default function PosQualityPage() {
  return (
    <div>
      <SEOHead
        title="Why QPOS — World-Class POS Hardware Quality | Malaysia"
        description="QPOS runs on SUNMI enterprise hardware — built-in printer, card reader, and cloud management. One reliable device replaces three. See why Malaysian businesses trust QPOS to never crash."
        keywords="POS quality Malaysia, reliable POS system Malaysia, SUNMI POS, enterprise POS hardware, POS uptime, offline POS Malaysia, industrial POS, POS durability, QPOS hardware, built-in printer POS"
        url="https://qbot.now/why-q/pos-quality"
      />
      {/* Hero */}
      <section className="relative pt-24">
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src="/pexels-photo-6205509.webp"
            alt="QPOS Hardware"
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
                <span className="text-white">POS Quality</span>
              </nav>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-none uppercase tracking-tighter mb-4">
                HARDWARE THAT WORKS AS HARD AS YOU DO
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-xl">
                Enterprise-grade POS devices built for the demands of real-world service
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
            <p>QBOT devices aren't just POS terminals — they're all-in-one business stations. Every device comes with a built-in receipt printer and payment terminal, so there's no clutter, no extra cables, no separate machines to maintain. From the compact QBOT V3 to the full D3 PRO with dual screens, you choose the form factor that matches your operation.</p>
            <p>Everything runs on QPOS cloud software, meaning your data, your menu, your reports — all synced and accessible from any device, anywhere. Update your prices at home, check yesterday's sales from your phone, or manage two outlets from one login.</p>
            <p>The system is modular — you're not locked into paying for features you'll never use. Start with the basics, switch on Loyalty or KDS when you're ready, and turn off what you don't need. It shapes around your business, not the other way around.</p>
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

      {/* Hero Image */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="aspect-video rounded-lg overflow-hidden">
          <img src="/qpos-keyvisuals/hero-desktop.webp" alt="POS Quality" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-16 text-white">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-2xl md:text-4xl font-black uppercase mb-4">BUILD YOUR QPOS</h2>
          <p className="text-sm font-bold text-gray-400 mb-8 uppercase">Talk to us and we'll set up the perfect system for your business.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick('Why Q POS Quality > Build Your QPOS')} className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-black text-sm uppercase tracking-wider hover:bg-green-700 transition-colors">
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
