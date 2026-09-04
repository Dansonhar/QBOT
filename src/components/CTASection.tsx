import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackWhatsAppClick } from '../utils/trackWhatsApp';

export default function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-[36px] lg:text-[42px] font-extrabold text-black leading-[1.12] tracking-tight mb-8">
            It's easy to start selling smarter
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://wa.me/60126909189?text=Hi%20QPOS%2C%20I%27d%20like%20to%20book%20a%20free%20demo"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('CTA Section > Book a Demo')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-gray-800 text-white text-sm font-bold uppercase tracking-wide transition-colors group"
            >
              Book a Demo <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
            <Link to="/products" className="inline-flex items-center px-6 py-3 text-black text-sm font-bold uppercase tracking-wide border-2 border-gray-200 hover:border-black transition-colors">
              Explore Products
            </Link>
            <Link to="/pricing" className="inline-flex items-center px-6 py-3 text-gray-500 hover:text-black text-sm font-bold uppercase tracking-wide transition-colors">
              See Pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
