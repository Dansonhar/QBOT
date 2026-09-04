import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Zap, MessageSquare, Brain, Heart, X, Check, Play } from 'lucide-react';
import { trackWhatsAppClick } from '../../utils/trackWhatsApp';
import SEOHead from '../../components/SEOHead';

const whatsappUrl = 'https://wa.me/60126909189?text=Hi%20QPOS%2C%20I%27d%20like%20to%20build%20my%20QPOS';

const cards = [
  { icon: Zap, title: 'Sales Boosters', desc: 'Auto-upsell and cross-sell on every order, every channel.' },
  { icon: MessageSquare, title: 'Guided Sales', desc: 'Smart prompts at checkout so your staff never miss an upsell.' },
  { icon: Brain, title: 'AI Insights', desc: 'Know what sells, what doesn\'t — before you check the numbers.' },
  { icon: Heart, title: 'Loyalty Programmes', desc: 'Bring customers back with points, rewards, and member pricing.' },
];

const withoutItems = [
  'Upselling depends on staff memory and mood',
  'Guessing which products perform well',
  'Customers visit once and forget you',
];

const withItems = [
  'Automatic upsell prompts on every order',
  'AI tells you what\'s selling and what\'s not',
  'Loyalty points and rewards bring them back',
];

const benefits = [
  { title: 'More Per Order', desc: 'Sales Boosters increase average transaction value automatically' },
  { title: 'Smarter Decisions', desc: 'AI Insights replaces guesswork with real data' },
  { title: 'Repeat Customers', desc: 'Loyalty keeps them coming back without extra marketing spend' },
];

export default function GrowSalesPage() {
  return (
    <div>
      <SEOHead
        title="Grow Your Sales with QPOS — Upsells, Loyalty & AI | Malaysia"
        description="Turn every visit into a bigger ticket and a repeat one. QPOS auto-upsells, loyalty rewards, AI insights, and 6 selling channels — all built in. Grow without hiring more staff."
        keywords="grow restaurant sales Malaysia, grow retail sales Malaysia, increase average order value, POS upsell Malaysia, loyalty for growth, AI sales insights Malaysia, repeat customers Malaysia, sell more POS, QPOS grow sales"
        url="https://qbot.now/why-q/grow-sales"
      />
      {/* Hero */}
      <section className="relative pt-24">
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src="/qhubai-banner.webp"
            alt="QPOS Sales Growth"
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
                <span className="text-white">Grow Your Sales</span>
              </nav>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-none uppercase tracking-tighter mb-4">
                EVERY FEATURE DESIGNED TO MAKE YOU MORE MONEY
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-xl">
                Upsell, cross-sell, and build loyalty — automatically
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
            <p>Sales Boosters work across all 6 selling channels — counter, mobile, kiosk, webstore, tablet, and QR. Every time a customer orders, the system automatically suggests add-ons, upgrades, or combos. Your staff don't need to remember what to upsell — the system does it for them.</p>
            <p>Guided Sales takes it further on POS and mPOS. At the point of checkout, your cashier sees smart prompts — 'Customer usually orders iced latte, suggest a pastry?' It turns every staff member into your best salesperson without any training.</p>
            <p>AI Insights gives you the picture your spreadsheet never could. Which items are trending up, which ones are dead weight, what time slots are underperforming — all surfaced automatically so you can act on data, not gut feeling. Pair that with Loyalty programmes that reward repeat visits, and you're not just making sales — you're building a customer base that keeps coming back.</p>
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
          <img src="/qpos-keyvisuals/hero-growsales.webp" alt="Grow Sales" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-16 text-white">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-2xl md:text-4xl font-black uppercase mb-4">BUILD YOUR QPOS</h2>
          <p className="text-sm font-bold text-gray-400 mb-8 uppercase">Talk to us and we'll set up the perfect system for your business.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick('Why Q Grow Sales > Build Your QPOS')} className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-black text-sm uppercase tracking-wider hover:bg-green-700 transition-colors">
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
