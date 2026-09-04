import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Monitor, Zap, LayoutGrid, Cpu,
} from 'lucide-react';
import { trackWhatsAppClick } from '../utils/trackWhatsApp';

const slides = [
  {
    id: 'device',
    tag: '3-in-1 POS',
    headline: 'ONE DEVICE.\nTHREE MODES.',
    subtitle: 'Counter POS. Mobile POS. Self-service kiosk. One device does all three. Replace RM12,200+ in hardware \u2014 starting from RM1,999.',
    image: '/Q_STAND_1.webp',
  },
  {
    id: 'integrated',
    tag: '14 Modules',
    headline: 'EVERYTHING\nCONNECTED.',
    subtitle: 'Most POS systems stop at the cash register. QPOS keeps going \u2014 online ordering, kitchen display, loyalty, inventory, AI. All built in.',
    image: '/qhubai-banner.webp',
  },
  {
    id: 'boosters',
    tag: 'Sales Boosters',
    headline: 'YOUR POS\nSELLS FOR YOU.',
    subtitle: 'Most POS systems wait for the customer to decide. QPOS nudges them to spend more \u2014 automatically. No training needed.',
    image: '/pexels-photo-6205509.webp',
  },
  {
    id: 'kiosk',
    tag: 'Self-Service',
    headline: 'CUT QUEUES.\nKEEP SELLING.',
    subtitle: 'Customers browse, order, pay, and go. Order values rise because the screen never forgets to upsell. You save one full salary monthly.',
    image: '/QBOT_DEKSTOP_1.webp',
  },
  {
    id: 'hardware',
    tag: 'Hardware',
    headline: 'FOUR FORMATS.\nONE SYSTEM.',
    subtitle: 'Every QPOS hardware is ready out of the box \u2014 preconfigured, tested, and loaded with your menu before it ships.',
    image: '/qduo-v2.webp',
  },
];

const exploreBoxes = [
  { icon: Monitor, title: 'POS System', desc: 'Counter, mobile & kiosk in one', link: '/products/pos', image: '/Q_STAND_1.webp' },
  { icon: Zap, title: 'Sales Boosters', desc: 'Auto-upsell on every order', link: '/products/sales-boosters', image: '/pexels-photo-6205509.webp' },
  { icon: LayoutGrid, title: 'Self-Service Kiosk', desc: 'Cut queues, cut costs', link: '/products/kiosk', image: '/QBOT_DEKSTOP_1.webp' },
  { icon: Cpu, title: 'AI Insights', desc: 'Data-driven decisions daily', link: '/products/ai-insights', image: '/qhubai-banner.webp' },
];

const SLIDE_INTERVAL = 4000;

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section id="home">
      {/* Hero — split layout */}
      <div className="bg-white pt-20 md:pt-24 pb-8 md:pb-12">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[60vh]">

            {/* Left — text (overlaps image slightly via z-index + negative margin) */}
            <div key={slide.id} className="animate-heroIn relative z-10">
              <h1 className="text-[48px] md:text-[72px] lg:text-[90px] font-black text-black leading-[0.88] tracking-tighter mb-4 md:mb-5 uppercase lg:mr-[-80px]">
                {slide.headline.split('\n').map((line, i, a) => (
                  <span key={i}>{line}{i < a.length - 1 && <br />}</span>
                ))}
              </h1>

              <p className="text-[13px] md:text-[15px] font-medium text-gray-400 leading-[1.6] max-w-sm mb-6 md:mb-7">
                {slide.subtitle}
              </p>

              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <a
                  href="https://wa.me/60126909189?text=Hi%20QPOS%2C%20I%27d%20like%20to%20book%20a%20free%20demo"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick('Hero > Book Demo')}
                  className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-black hover:bg-gray-800 text-white text-xs md:text-sm font-bold uppercase tracking-wide transition-colors group"
                >
                  Book Demo
                  <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 text-black text-xs md:text-sm font-bold uppercase tracking-wide border-2 border-gray-200 hover:border-black transition-colors"
                >
                  Pricing
                </Link>
              </div>

              {/* Slide indicators */}
              <div className="flex items-center gap-4 md:gap-5">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => goTo(i)}
                    aria-label={`Slide ${i + 1}`}
                    className="flex flex-col items-center gap-1.5 group"
                  >
                    <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wide transition-colors whitespace-nowrap ${
                      i === current ? 'text-black' : 'text-gray-300'
                    }`}>
                      {s.tag}
                    </span>
                    <div className="relative h-[2px] w-10 md:w-14 rounded-full bg-gray-200 overflow-hidden">
                      <div className={`absolute inset-y-0 left-0 rounded-full bg-black ${i === current ? 'animate-progress' : 'w-0'}`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right — square image */}
            <div className="relative flex items-center justify-center">
              <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
                <div className="relative aspect-square overflow-hidden bg-gray-50 border border-gray-200">
                  {slides.map((s, i) => (
                    <img
                      key={s.id}
                      src={s.image}
                      alt={s.tag}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                        i === current ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4 Explore Boxes */}
      <div className="bg-white pb-4 md:pb-6">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {exploreBoxes.map((box) => (
              <Link
                key={box.title}
                to={box.link}
                className="bg-white group hover:bg-gray-50 transition-colors overflow-hidden shadow-lg border border-gray-100"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={box.image} alt={box.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 md:p-5">
                  <h3 className="text-sm md:text-[15px] font-bold text-black mb-1 group-hover:text-green-600 transition-colors">{box.title}</h3>
                  <p className="text-[11px] md:text-xs font-normal text-gray-400 leading-relaxed">{box.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heroIn { from { opacity:0; transform: translateY(14px) } to { opacity:1; transform: translateY(0) } }
        .animate-heroIn { animation: heroIn .4s ease-out }
        @keyframes progress { from { width:0 } to { width:100% } }
        .animate-progress { animation: progress ${SLIDE_INTERVAL}ms linear }
      `}</style>
    </section>
  );
}
