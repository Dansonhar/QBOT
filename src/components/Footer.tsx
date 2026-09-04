import { Mail, MapPin, Phone, Facebook, Instagram, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackWhatsAppClick } from '../utils/trackWhatsApp';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const phoneNumber = '+60126909189';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=Hi%20QBot%2C%20I%27m%20interested%20in%20learning%20more%20about%20your%20self-service%20kiosk%20solutions`;

  return (
    <footer className="relative bg-black text-white border-t border-gray-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 md:py-16">

        {/* ── Main grid: Logo | Products (4 cols) | Company ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-12 gap-8 lg:gap-6 mb-12">

          {/* Logo + tagline */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-3">
            <div className="mb-4">
              <img src="/qbotlogo.svg" alt="QBot Logo" className="w-12 h-12 brightness-0 invert" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wide mb-1.5">All-in-One POS Solutions</p>
            <p className="text-[11px] text-gray-500 leading-relaxed mb-5">Introducing Malaysia's First 3-in-1 POS Solutions. One device. Three modes (Counter POS, Mobile POS and Self-service Kiosk)</p>
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/qbotmalaysia" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" aria-label="Facebook"><Facebook size={16} strokeWidth={2} /></a>
              <a href="https://www.instagram.com/qbotfuture" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" aria-label="Instagram"><Instagram size={16} strokeWidth={2} /></a>
              <a href="https://www.tiktok.com/@qbotfuture" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" aria-label="TikTok"><Video size={16} strokeWidth={2} /></a>
            </div>
          </div>

          {/* Sell */}
          <div className="lg:col-span-2">
            <p className="text-[10px] text-green-500 font-bold uppercase tracking-[0.15em] mb-3">Sell</p>
            <ul className="space-y-1.5">
              {[
                { label: 'POS', to: '/products/pos' },
                { label: 'mPOS', to: '/products/mpos' },
                { label: 'Kiosk', to: '/products/kiosk' },
                { label: 'Webstore', to: '/products/webstore' },
                { label: 'Tablet', to: '/products/tablet' },
                { label: 'QR Order', to: '/products/qr-order' },
              ].map((item) => (
                <li key={item.label}><Link to={item.to} className="text-[12px] text-gray-400 hover:text-white transition-colors">{item.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Manage + Operate stacked */}
          <div className="lg:col-span-2">
            <p className="text-[10px] text-green-500 font-bold uppercase tracking-[0.15em] mb-3">Manage</p>
            <ul className="space-y-1.5 mb-6">
              {[
                { label: 'QHub', to: '/products/qhub' },
                { label: 'Inventory', to: '/products/inventory' },
              ].map((item) => (
                <li key={item.label}><Link to={item.to} className="text-[12px] text-gray-400 hover:text-white transition-colors">{item.label}</Link></li>
              ))}
            </ul>
            <p className="text-[10px] text-green-500 font-bold uppercase tracking-[0.15em] mb-3">Operate</p>
            <ul className="space-y-1.5">
              {[
                { label: 'Kitchen Display', to: '/products/kitchen-display' },
                { label: 'QMS', to: '/products/qms' },
                { label: 'Live Display', to: '/products/live-display' },
              ].map((item) => (
                <li key={item.label}><Link to={item.to} className="text-[12px] text-gray-400 hover:text-white transition-colors">{item.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Grow */}
          <div className="lg:col-span-2">
            <p className="text-[10px] text-green-500 font-bold uppercase tracking-[0.15em] mb-3">Grow</p>
            <ul className="space-y-1.5 mb-6">
              {[
                { label: 'Sales Boosters', to: '/products/sales-boosters' },
                { label: 'AI Insights', to: '/products/ai-insights' },
                { label: 'Loyalty', to: '/products/loyalty' },
              ].map((item) => (
                <li key={item.label}><Link to={item.to} className="text-[12px] text-gray-400 hover:text-white transition-colors">{item.label}</Link></li>
              ))}
            </ul>
            <p className="text-[10px] text-white font-bold uppercase tracking-[0.15em] mb-3">Solutions</p>
            <ul className="space-y-1.5">
              {[
                { label: 'Products', to: '/products' },
                { label: 'Hardware', to: '/hardware' },
                { label: 'Pricing', to: '/pricing' },
                // Site-wide link into /qsentry — the product landing has no other
                // footer entry point, and every page linking in is what makes it
                // crawlable rather than orphaned behind the header mega-menu.
                { label: 'QSentry AI', to: '/qsentry' },
              ].map((item) => (
                <li key={item.label}><Link to={item.to} className="text-[12px] text-gray-400 hover:text-white transition-colors">{item.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-3">
            <p className="text-[10px] text-white font-bold uppercase tracking-[0.15em] mb-3">Contact</p>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-0.5 flex-shrink-0 text-gray-600" strokeWidth={2} />
                <div>
                  <p className="text-[12px] text-gray-400 leading-snug">B3-6-13 Solaris Dutamas</p>
                  <p className="text-[12px] text-gray-400 leading-snug">Jalan Dutamas 1, 50480</p>
                  <p className="text-[11px] text-gray-600">Publika KL</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="flex-shrink-0 text-gray-600" strokeWidth={2} />
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick('Footer > Phone Number')} className="text-[12px] text-gray-400 hover:text-white transition-colors">+6012-6909-189</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="flex-shrink-0 text-gray-600" strokeWidth={2} />
                <a href="mailto:hello@qbot.now" className="text-[12px] text-gray-400 hover:text-white transition-colors">hello@qbot.now</a>
              </div>
              <p className="text-[10px] text-gray-600 pl-[26px]">Mon–Fri: 10AM – 7PM</p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick('Footer > Chat on WhatsApp')}
                className="inline-block bg-green-600 hover:bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider px-5 py-2.5 transition-colors"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* ── Divider + Copyright ── */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[11px] text-gray-600">
          <p>&copy; {currentYear} QBOT — Designed in Tokyo, Serving Malaysia</p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <li><Link to="/about-us" className="text-gray-500 hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/contact-us" className="text-gray-500 hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link to="/terms" className="text-gray-500 hover:text-white transition-colors">Terms</Link></li>
            <li><Link to="/privacy" className="text-gray-500 hover:text-white transition-colors">Privacy</Link></li>
            <li><Link to="/refund" className="text-gray-500 hover:text-white transition-colors">Refund</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
