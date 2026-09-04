import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const boosters = [
  { img: '/salesbooster/upsell.png', title: 'Smart Upsells', desc: 'Suggest add-ons automatically based on what\'s in the cart.' },
  { img: '/salesbooster/nudge.png', title: 'Last-Chance Nudges', desc: 'Show customers how close they are to a reward before checkout.' },
  { img: '/salesbooster/badges.png', title: 'Product Badges', desc: 'Tag items as Best Seller, New, or Limited to grab attention.' },
  { img: '/salesbooster/trigger.png', title: 'Offer Triggers', desc: 'Activate deals automatically when order conditions are met.' },
  { img: '/salesbooster/tiers.png', title: 'Spending Tiers', desc: 'Reward customers who spend more with bigger perks.' },
];

export default function SalesBoostersSection() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((i) => (i + 1) % boosters.length), []);
  const prev = useCallback(() => setCurrent((i) => (i - 1 + boosters.length) % boosters.length), []);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-16 mb-14">
          <h2 className="text-2xl md:text-[36px] lg:text-[42px] font-extrabold text-black leading-[1.12] tracking-tight">
            Find more revenue in every order
          </h2>
          <p className="text-[15px] text-gray-400 leading-[1.7] lg:pt-3">
            Most POS systems wait for the customer to decide. QPOS nudges them to spend more — automatically. On staff channels, it tells your team exactly what to suggest. On self-service, it shows upsells, combos, and rewards without any staff involvement.
          </p>
        </div>

        {/* Slider */}
        <div className="relative mb-8">
          <div className="overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {boosters.map((b) => (
                <div key={b.title} className="w-full flex-shrink-0">
                  <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 bg-gray-50 border border-gray-200 rounded-lg p-6 md:p-8">
                    <div className="flex-shrink-0 md:w-1/2">
                      <img src={b.img} alt={b.title} className="w-full h-auto" />
                    </div>
                    <div className="md:w-1/2 text-center md:text-left">
                      <h3 className="text-lg md:text-xl font-black text-black uppercase tracking-tight mb-2">
                        {b.title}
                      </h3>
                      <p className="text-[14px] text-gray-400 leading-[1.6]">{b.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrows */}
          <button
            onClick={prev}
            className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center shadow border border-gray-200 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
          <button
            onClick={next}
            className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center shadow border border-gray-200 transition-colors"
            aria-label="Next"
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {boosters.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-black w-5' : 'bg-gray-300 hover:bg-gray-400'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 px-6 py-5 text-center mb-8">
          <p className="text-[14px] font-bold text-black">
            No training. No memorizing. Set it once in QHub — it runs on every order, every channel.
          </p>
        </div>
        <div className="text-center">
          <Link to="/products/sales-boosters" className="inline-flex items-center gap-1.5 text-sm font-semibold text-black hover:text-green-600 transition-colors group">
            See how Sales Boosters work <ArrowRight size={14} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
