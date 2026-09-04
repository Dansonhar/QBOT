import { MessageCircle, Smartphone, CreditCard, Gift, TrendingUp } from 'lucide-react';
import { trackWhatsAppClick } from '../utils/trackWhatsApp';
import SEOHead from '../components/SEOHead';

const whatsappUrl = 'https://wa.me/60126909189?text=Hi%20QPOS%2C%20I%27d%20like%20to%20get%20pricing%20details%20for%20my%20business';

export default function PricingPage() {
  return (
    <div className="pt-16">
      <SEOHead
        title="POS System Pricing Malaysia — Contact Us for a Quote"
        description="Get a tailored quote for QPOS — counter POS, mPOS, self-service kiosk, QR ordering and webstore. Hardware + software + installation + training, all from one partner."
        keywords="POS pricing Malaysia, POS Malaysia, restaurant POS, kiosk pricing Malaysia, QPOS pricing"
        url="https://qbot.now/pricing"
      />

      {/* Hero */}
      <section className="py-16 md:py-24 bg-black text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-[11px] font-bold text-green-400 uppercase tracking-[0.15em] mb-4">QPOS All-in-One POS Solutions</p>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">Pricing tailored to your setup</h1>
          <p className="text-[15px] text-white/45 max-w-2xl mx-auto">
            Hardware, software, installation, training — bundled together. Chat with us and we'll quote a setup that fits your business.
          </p>
        </div>
      </section>

      {/* Highlight Boxes */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[
            { icon: Smartphone, hook: 'Still using multiple systems?', title: 'All-in-One QPOS', sub: '' },
            { icon: CreditCard, hook: 'Paying thousands of thousands?', title: 'Flexible Payment Plans', sub: '' },
            { icon: Gift, hook: 'Still paying monthly?', title: 'Software Bundled In*', sub: 'Limited Time Offer' },
            { icon: TrendingUp, hook: 'Still training staff to sell?', title: 'Built-in Sales Boosters', sub: '' },
          ].map(({ icon: Icon, hook, title, sub }) => (
            <div
              key={title}
              className="relative flex flex-col items-center text-center px-3 py-5 md:py-6 border border-gray-200 rounded-lg bg-gray-50 hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-600 text-white mb-3">
                <Icon size={20} strokeWidth={2} />
              </div>
              <p className="text-[11px] md:text-[12px] text-gray-400 italic mb-1">{hook}</p>
              <p className="text-[12px] md:text-[13px] font-bold text-black uppercase tracking-wide leading-snug">{title}</p>
              {sub && <p className="text-[10px] md:text-[11px] font-bold text-green-600 uppercase tracking-wider mt-1">{sub}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center px-6">
          <h2 className="text-2xl md:text-[36px] font-extrabold uppercase tracking-tight mb-4">Get a quote in minutes</h2>
          <p className="text-[15px] text-gray-500 leading-[1.7] mb-8">
            Tell us about your business — counter, kiosk, mobile, or all three — and we'll send you a tailored bundle with hardware, software, installation, and training included.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick('Pricing > Contact CTA > WhatsApp')}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-green-600 hover:bg-green-500 text-white text-sm font-bold uppercase tracking-wide transition-colors"
          >
            <MessageCircle size={16} strokeWidth={2} /> Contact Us on WhatsApp
          </a>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14 md:py-20 bg-black text-white">
        <div className="max-w-2xl mx-auto text-center px-6">
          <h2 className="text-xl md:text-[28px] font-extrabold uppercase tracking-tight mb-3">Not sure which setup?</h2>
          <p className="text-[14px] text-white/40 mb-6">Talk to us — we'll recommend the right fit for your business.</p>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick('Pricing > Bottom CTA > Chat With Us')} className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white text-sm font-bold uppercase tracking-wide transition-colors">
            <MessageCircle size={14} strokeWidth={2} /> Chat With Us
          </a>
        </div>
      </section>
    </div>
  );
}
