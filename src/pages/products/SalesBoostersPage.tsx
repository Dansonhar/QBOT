import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';
import { trackWhatsAppClick } from '../../utils/trackWhatsApp';
import {
  ArrowRight, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  MessageCircle, Monitor, TabletSmartphone, Heart, Cpu,
} from 'lucide-react';

const whatsappUrl = 'https://wa.me/60126909189?text=Hi%20QPOS%2C%20I%27m%20interested%20in%20learning%20more';

const boosters = [
  {
    img: '/salesbooster/upsell.png',
    title: 'Smart Upsells',
    desc: 'Order a burger? System suggests fries. Order coffee? System suggests cake. Pairings you set, shown automatically.',
  },
  {
    img: '/salesbooster/nudge.png',
    title: 'Last-Chance Nudges',
    desc: "\"You're RM5 away from a free item\" pops up before checkout. Recovers revenue that would have walked out the door.",
  },
  {
    img: '/salesbooster/badges.png',
    title: 'Product Badges',
    desc: "Tag items as 'Best Seller,' 'Limited Time,' 'Staff Pick,' or 'New' — with eye-catching labels on every menu screen.",
  },
  {
    img: '/salesbooster/trigger.png',
    title: 'Offer Triggers',
    desc: 'Set rules: spend RM30, get a free drink. Buy a burger and fries, unlock a dessert discount. System handles it automatically.',
  },
  {
    img: '/salesbooster/tiers.png',
    title: 'Spending Tiers',
    desc: 'Customers climb a reward ladder. The more they spend, the bigger the reward. Keeps them coming back and spending more.',
  },
];

const faqs = [
  { question: 'How does upselling work?', answer: 'Set rules in QHub. When a customer adds coffee, suggest a pastry. Rules activate across all channels automatically.' },
  { question: 'Does it work on the kiosk?', answer: 'Yes. All 5 booster types work on POS, kiosk, QR ordering, webstore, and tablet.' },
  { question: 'Can I schedule promotions?', answer: 'Yes. Set start/end dates, time-of-day triggers, and day-of-week schedules.' },
  { question: 'How much extra revenue can I expect?', answer: 'Results vary, but merchants report 15-30% increase in average order value.' },
  { question: 'Do I need to train my staff?', answer: 'No. The system prompts automatically. Staff just follow the on-screen suggestions.' },
];

const crossLinks = [
  { name: 'POS', description: 'Counter point of sale', path: '/products/pos', icon: Monitor },
  { name: 'Kiosk', description: 'Self-service ordering', path: '/products/kiosk', icon: TabletSmartphone },
  { name: 'Loyalty', description: 'Customer loyalty program', path: '/products/loyalty', icon: Heart },
  { name: 'AI Insights', description: 'Smart recommendations from your data', path: '/products/ai-insights', icon: Cpu },
];

export default function SalesBoostersPage() {
  const [current, setCurrent] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const next = useCallback(() => setCurrent((i) => (i + 1) % boosters.length), []);
  const prev = useCallback(() => setCurrent((i) => (i - 1 + boosters.length) % boosters.length), []);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <>
      <SEOHead
        title="Sales Booster Tools — Badges, Upsells, Bundles, Triggers | QPOS Malaysia"
        description="Turn every order into a bigger order. Product badges, smart upsells, threshold nudges, bundles, tier-based promos, and triggered campaigns — built into POS, kiosk, QR, and web."
        keywords="sales booster Malaysia, POS upsell Malaysia, product badge, bundle selling, threshold promo, order nudge, retail upsell, F&B upsell, average order value, ticket size Malaysia, QPOS sales boosters, cross-sell POS"
        url="https://qbot.now/products/sales-boosters"
      />

      <div className="pt-16">
        {/* Hero — Slider */}
        <section className="relative bg-black text-white overflow-hidden" style={{ minHeight: '60vh' }}>
          <div className="absolute inset-0">
            {boosters.map((b, i) => (
              <img
                key={b.title}
                src={b.img}
                alt={b.title}
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
          </div>

          <div className="relative z-10 flex items-end min-h-[60vh] pb-10 md:pb-16">
            <div className="max-w-7xl mx-auto px-6 w-full">
              <p className="text-[11px] font-bold text-green-400 uppercase tracking-[0.15em] mb-3">Grow — Sales Boosters</p>
              <h1 className="text-[28px] md:text-[42px] lg:text-[52px] font-black leading-[0.95] tracking-tighter uppercase mb-4 max-w-3xl">
                MOST POS RECORD SALES.<br />QPOS INCREASES THEM.
              </h1>
              <p className="text-[15px] text-white/50 leading-[1.65] max-w-lg mb-6">
                Automatic upsells, bundles, and spend rewards that run on every order, across every channel. Revenue goes up without extra staff effort.
              </p>
              <div className="flex items-center gap-3">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick('Sales Boosters > Hero > Book Demo')} className="inline-flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-500 text-white text-xs font-bold uppercase tracking-wide transition-colors group">
                  Book Demo <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
                <Link to="/pricing" className="inline-flex items-center gap-2 px-5 py-3 border border-white/25 hover:border-white/50 text-white/60 hover:text-white text-xs font-bold uppercase tracking-wide transition-all">Pricing</Link>
              </div>
            </div>
          </div>

          {/* Slider controls */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft size={18} strokeWidth={2.5} className="text-white" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            aria-label="Next"
          >
            <ChevronRight size={18} strokeWidth={2.5} className="text-white" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {boosters.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-5' : 'bg-white/30 hover:bg-white/50'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Problem statement */}
        <section className="py-12 bg-gray-50 border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-lg md:text-xl font-extrabold text-black mb-3">The Problem</h2>
            <p className="text-[14px] text-gray-400 leading-[1.7] max-w-2xl mx-auto mb-5">
              Up to 30% of potential add-on sales never happen. Staff forgets promotions. Static menus don't adapt. QPOS Sales Boosters fix all of this automatically with 5 intelligent booster types.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {['Quick Service', 'Cafes', 'Bubble Tea', 'Fast Food', 'Restaurants'].map((ind) => (
                <span key={ind} className="text-[12px] font-medium bg-white border border-gray-200 px-3 py-1.5">{ind}</span>
              ))}
            </div>
          </div>
        </section>

        {/* 5 Boosters — Image + Explanation combined */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <p className="text-[11px] font-bold text-green-600 uppercase tracking-[0.15em] mb-3 text-center">5 Booster Types</p>
            <h2 className="text-2xl md:text-[36px] font-extrabold text-black tracking-tight text-center mb-14">
              Every tool you need to grow every order
            </h2>

            <div className="space-y-20">
              {boosters.map((b, i) => (
                <div key={b.title} className="scroll-mt-24" id={b.title.toLowerCase().replace(/\s+/g, '-')}>
                  {/* Image — full width, no crop */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden mb-6">
                    <img src={b.img} alt={b.title} className="w-full h-auto" />
                  </div>
                  {/* Explanation */}
                  <div className="max-w-2xl">
                    <span className="text-[48px] md:text-[64px] font-black text-gray-100 leading-none">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="text-lg md:text-xl font-extrabold text-black tracking-tight -mt-3 mb-2">{b.title}</h3>
                    <p className="text-[14px] text-gray-400 leading-[1.7]">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* No training banner */}
        <section className="py-10 bg-gray-50 border-y border-gray-200">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-[15px] font-bold text-black">
              No training. No memorizing. Set it once in QHub — it runs on every order, every channel.
            </p>
          </div>
        </section>

        {/* Cross Links */}
        <section className="py-16 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-xl md:text-2xl font-extrabold text-black tracking-tight mb-2">Works with Sales Boosters</h2>
            <p className="text-[14px] text-gray-400 mb-8">Better together.</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {crossLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.path} to={link.path} className="border border-gray-200 p-4 hover:border-black transition-colors group">
                    <Icon size={20} strokeWidth={1.5} className="text-gray-400 group-hover:text-black mb-2 transition-colors" />
                    <h3 className="text-sm font-bold text-black mb-0.5 group-hover:text-green-600 transition-colors">{link.name}</h3>
                    <p className="text-[12px] text-gray-400">{link.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-xl md:text-2xl font-extrabold text-black tracking-tight mb-6">Frequently asked</h2>
          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-gray-200">
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full flex items-center justify-between py-4 text-left group">
                  <span className="text-[14px] font-semibold text-black pr-4 group-hover:text-green-600 transition-colors">{faq.question}</span>
                  {faqOpen === i ? <ChevronUp size={16} strokeWidth={2} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} strokeWidth={2} className="text-gray-400 flex-shrink-0" />}
                </button>
                {faqOpen === i && <p className="pb-4 text-[14px] text-gray-500 leading-[1.7]">{faq.answer}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 md:py-20 bg-black text-white">
          <div className="max-w-2xl mx-auto text-center px-6">
            <h2 className="text-xl md:text-[28px] font-extrabold uppercase tracking-tight mb-3">STOP LEAVING MONEY ON THE TABLE</h2>
            <p className="text-[14px] text-white/40 mb-6">See Sales Boosters in action.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick('Sales Boosters > CTA > Book Demo')} className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white text-sm font-bold uppercase tracking-wide transition-colors">
                <MessageCircle size={14} strokeWidth={2} /> Book Demo
              </a>
              <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 hover:border-white/40 text-white/60 hover:text-white text-sm font-bold uppercase tracking-wide transition-all">
                All Products <ArrowRight size={14} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
