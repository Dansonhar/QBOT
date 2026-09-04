import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function IntegratedSystem() {
  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="text-2xl md:text-[36px] lg:text-[42px] font-extrabold text-black leading-[1.12] tracking-tight mb-4">
            The one POS platform behind it all
          </h2>
          <p className="text-[15px] text-gray-400 leading-[1.7] max-w-2xl mx-auto">
            Most POS systems stop at the cash register. QPOS keeps going — online ordering, kitchen display, loyalty, inventory, AI analytics — all built into one system. An order placed anywhere updates everything else automatically.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { img: '/qpos-keyvisuals/hero-qrorder.webp', quote: 'Order comes in from QR → kitchen sees it in 2 seconds.' },
            { img: '/qpos-keyvisuals/hero-ims.webp', quote: 'Every sale updates inventory across every outlet. No manual count.' },
            { img: '/qpos-keyvisuals/hero-aidashboard.webp', quote: 'AI tells you what sold, what didn\'t, and what to push tomorrow.' },
          ].map((p) => (
            <div key={p.quote} className="group">
              <div className="aspect-[4/3] overflow-hidden bg-gray-200 mb-4">
                <img src={p.img} alt={p.quote} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <p className="text-[13px] md:text-[14px] font-medium text-black leading-[1.5] italic">"{p.quote}"</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-black hover:text-green-600 transition-colors group">
            Explore all 14 modules <ArrowRight size={14} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
