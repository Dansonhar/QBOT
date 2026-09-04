import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, MessageCircle, ChevronDown, ChevronRight, ArrowRight,
  Monitor, Smartphone, LayoutGrid, Globe, Tablet, QrCode,
  BarChart3, Package, Heart,
  ChefHat, ListOrdered, Tv,
  Zap, Brain, Phone, MapPin,
  ShoppingBag, Dumbbell, ScanFace, Settings2, Boxes, TrendingUp,
} from 'lucide-react';


const whyQCards = [
  {
    title: 'POS Quality',
    desc: 'Enterprise-grade POS built for speed, reliability, and scale.',
    image: '/qpos-keyvisuals/pos_quality.webp',
    link: '/why-q/pos-quality',
  },
  {
    title: 'Sell Everywhere',
    desc: '6 channels — counter, mobile, kiosk, QR, tablet, webstore.',
    image: '/qpos-keyvisuals/others/sell_everywhere.webp',
    link: '/why-q/sell-everywhere',
  },
  {
    title: 'Easy to Manage',
    desc: 'One dashboard for menus, staff, inventory, and outlets.',
    image: '/qpos-keyvisuals/others/ai_powered_dashboard.webp',
    link: '/why-q/easy-to-manage',
  },
  {
    title: 'Grow Your Sales',
    desc: 'Built-in upsells, loyalty, and AI that increase every order.',
    image: '/qpos-keyvisuals/others/grow_your_sales.webp',
    link: '/why-q/grow-sales',
  },
];

const navLinks = [
  { label: 'PRODUCTS', path: '/products', megaMenu: 'products' as const },
  { label: 'WHY Q?', path: '/', megaMenu: 'whyq' as const },
  { label: 'HARDWARE', path: '/hardware' },
  { label: 'PRICING', path: '/pricing' },
];

import { trackWhatsAppClick } from '../utils/trackWhatsApp';

const whatsappUrl =
  'https://wa.me/60126909189?text=Hi%20QBot%2C%20I%27m%20interested%20in%20learning%20more%20about%20your%20solutions';

type AnnouncementItem = { text: string; href?: string; highlight?: boolean };

const ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    text: 'Introducing Q STUDIO — All-in-One Platform for Memberships, Bookings & Ticketing',
    href: '/qstudio',
    highlight: true,
  },
  { text: "Malaysia's First 3-in-1 POS. 1 device. 3 modes." },
];

function AnnouncementRotator() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
        setFade(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const item = ANNOUNCEMENTS[index];
  const fadeClass = `transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`;

  if (item.href) {
    return (
      <Link
        to={item.href}
        className={`pl-4 inline-flex items-center gap-1.5 ${fadeClass} ${item.highlight ? 'text-[#CCFF00] font-extrabold tracking-wide hover:text-white' : 'text-green-400 hover:text-white'}`}
      >
        {item.highlight && (
          <span aria-hidden="true" className="inline-block px-1.5 py-0.5 bg-[#CCFF00] text-black text-[9px] font-black uppercase tracking-wider rounded-sm leading-none">
            New
          </span>
        )}
        <span>{item.text}</span>
        <span aria-hidden="true">→</span>
      </Link>
    );
  }

  return (
    <span className={`pl-4 text-green-400 ${fadeClass}`}>
      {item.text}
    </span>
  );
}


type MegaMenuType = 'products' | 'whyq' | null;

export default function Header() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<MegaMenuType>(null);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileWhyQOpen, setMobileWhyQOpen] = useState(false);
  const [mobileExpandedGroups, setMobileExpandedGroups] = useState<Set<string>>(new Set());
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    return () => { if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current); };
  }, []);

  const handleMegaEnter = (menu: MegaMenuType) => {
    if (closeTimeoutRef.current) { clearTimeout(closeTimeoutRef.current); closeTimeoutRef.current = null; }
    setActiveMega(menu);
  };
  const handleMegaLeave = () => {
    closeTimeoutRef.current = setTimeout(() => setActiveMega(null), 150);
  };
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobileProductsOpen(false);
    setMobileWhyQOpen(false);
    setMobileExpandedGroups(new Set());
  };
  const toggleMobileGroup = (title: string) => {
    setMobileExpandedGroups((prev) => {
      const next = new Set(prev);
      next.has(title) ? next.delete(title) : next.add(title);
      return next;
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top black announcement bar */}
      <div className="bg-black text-white hidden lg:block">
        <div className="container mx-auto px-4 md:px-6 lg:px-12 py-1.5 flex items-center justify-between">
          <div className="flex items-center divide-x divide-gray-600 text-[10px] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 pr-4">
              <MapPin size={10} strokeWidth={2.5} />
              Showroom: Publika KL (By Reservation)
            </span>
            <span className="px-4">Mon-Fri: 10AM - 7PM</span>
            <AnnouncementRotator />
          </div>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider hover:text-gray-300 transition-colors">
            <Phone size={10} strokeWidth={2.5} />
            +6012-6909-189
          </a>
        </div>
      </div>

      <nav
        className={`transition-all duration-300 bg-white/70 backdrop-blur-xl backdrop-saturate-150 border-b border-gray-200/40 ${
          isScrolled ? 'shadow-sm' : ''
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-12 py-3 md:py-4">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center group mr-10">
              <img
                src="/qbotlogo.svg"
                alt="QPOS Logo"
                className="w-9 h-9 md:w-10 md:h-10 transition-all duration-200 group-hover:opacity-80"
              />
            </Link>

            {/* Desktop nav — flush left after logo */}
            <div className="hidden lg:flex items-center space-x-8 xl:space-x-10">
              {navLinks.map((item) => {
                const isActive = item.label === 'WHY Q?'
                  ? location.pathname.startsWith('/why-q')
                  : item.path === '/'
                    ? location.pathname === '/'
                    : location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                const activeClass = isActive ? 'text-black border-b-[3px] border-black pb-1' : 'text-gray-600';

                return item.megaMenu ? (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => handleMegaEnter(item.megaMenu)}
                    onMouseLeave={handleMegaLeave}
                  >
                    <Link
                      to={item.path}
                      className={`text-[11px] font-bold tracking-[0.1em] uppercase flex items-center gap-1 hover:text-black transition-colors duration-200 ${activeClass}`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown size={12} strokeWidth={2.5} />
                    </Link>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-32 h-4" />
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`text-[11px] font-bold tracking-[0.1em] uppercase hover:text-black transition-colors duration-200 ${activeClass}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Right — pushed to far right */}
            <div className="hidden lg:flex items-center divide-x divide-gray-200 ml-auto border-l border-gray-200">
              <Link to="/qstudio" title="QStudio — Memberships, Bookings, Face-ID for Fitness, Salons & Clubs"
                className="px-4 text-[12px] font-black uppercase tracking-tight text-black hover:text-green-600 transition-colors">
                QStudio
              </Link>
              <Link to="/qsentry" title="QSentry AI — Anti-Tailgater Camera for Gyms"
                className="px-4 text-[12px] font-black uppercase tracking-tight text-black hover:text-[#FF2D2D] transition-colors">
                QSentry AI
              </Link>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick('Header > WhatsApp (Desktop)')}
                title="Chat on WhatsApp"
                className="pl-4 inline-flex items-center gap-1.5 text-[12px] font-black uppercase tracking-tight text-black hover:text-green-600 transition-colors">
                <MessageCircle size={16} strokeWidth={2.5} /> WhatsApp
              </a>
            </div>

            {/* Mobile */}
            <div className="lg:hidden flex items-center gap-2.5 ml-auto">
              <Link to="/qstudio" className="hidden sm:inline text-[11px] font-black uppercase tracking-tight text-black hover:text-green-600 transition-colors" title="QStudio">
                QStudio
              </Link>
              <Link to="/qsentry" className="hidden sm:inline text-[11px] font-black uppercase tracking-tight text-black hover:text-[#FF2D2D] transition-colors" title="QSentry AI">
                QSentry AI
              </Link>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick('Header > WhatsApp Icon (Mobile)')} className="p-1.5 text-gray-500 transition-colors" title="WhatsApp">
                <MessageCircle size={20} strokeWidth={2} />
              </a>
              <button
                onClick={() => isMobileMenuOpen ? closeMobileMenu() : setIsMobileMenuOpen(true)}
                className="p-1.5 text-black transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white max-h-[80vh] overflow-y-auto">
            <div className="container mx-auto px-4 md:px-6 py-3 flex flex-col space-y-0.5">
              {/* Products accordion */}
              <div>
                <button onClick={() => setMobileProductsOpen(!mobileProductsOpen)} className="w-full flex items-center justify-between text-sm font-semibold text-black py-2.5">
                  <span>PRODUCTS</span>
                  <ChevronDown size={14} strokeWidth={2.5} className={`transition-transform ${mobileProductsOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileProductsOpen && (
                  <div className="pl-4 pb-2">
                    {/* QPOS — expandable into 4 sections */}
                    <div>
                      <button onClick={() => toggleMobileGroup('QPOS')} className="w-full flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider py-2">
                        <span>QPOS — All-in-One POS &amp; Self-Service</span>
                        <ChevronRight size={12} strokeWidth={2.5} className={`transition-transform ${mobileExpandedGroups.has('QPOS') ? 'rotate-90' : ''}`} />
                      </button>
                      {mobileExpandedGroups.has('QPOS') && (
                        <div className="pl-4 pb-1">
                          {[
                            { name: 'Sell', path: '/products/sell' },
                            { name: 'Manage', path: '/products/manage' },
                            { name: 'Operate', path: '/products/operate' },
                            { name: 'Grow', path: '/products/grow' },
                            { name: 'All QPOS products', path: '/products' },
                          ].map((s) => (
                            <Link key={s.path} to={s.path} onClick={closeMobileMenu} className="block text-sm font-medium text-black py-2">{s.name}</Link>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* QSTUDIO */}
                    <Link to="/qstudio" onClick={closeMobileMenu} className="block text-xs font-bold text-gray-500 uppercase tracking-wider py-2.5">
                      QStudio — memberships &amp; bookings
                    </Link>
                    {/* QSENTRY AI */}
                    <Link to="/qsentry" onClick={closeMobileMenu} className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider py-2.5">
                      QSentry AI — AI camera intelligence
                      <span className="px-1.5 py-0.5 bg-[#FF2D2D] text-white text-[8px] font-black rounded">NEW</span>
                    </Link>
                  </div>
                )}
              </div>
              {/* Why Q accordion */}
              <div>
                <button onClick={() => setMobileWhyQOpen(!mobileWhyQOpen)} className="w-full flex items-center justify-between text-sm font-semibold text-black py-2.5">
                  <span>WHY Q?</span>
                  <ChevronDown size={14} strokeWidth={2.5} className={`transition-transform ${mobileWhyQOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileWhyQOpen && (
                  <div className="pl-4 pb-2 space-y-2">
                    {whyQCards.map((card) => (
                      <Link key={card.title} to={card.link} onClick={closeMobileMenu} className="flex items-center gap-3 py-1.5">
                        <img src={card.image} alt={card.title} className="w-10 h-10 object-cover rounded-sm flex-shrink-0" />
                        <div>
                          <span className="text-sm font-medium text-black">{card.title}</span>
                          <span className="block text-xs text-gray-400">{card.desc}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link to="/hardware" onClick={closeMobileMenu} className="text-sm font-semibold text-black py-2.5">HARDWARE</Link>
              <Link to="/pricing" onClick={closeMobileMenu} className="text-sm font-semibold text-black py-2.5">PRICING</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Products Mega Menu */}
      {activeMega === 'products' && (
        <div
          className="hidden lg:block absolute left-0 right-0 bg-white border-t border-gray-200 shadow-xl"
          onMouseEnter={() => handleMegaEnter('products')}
          onMouseLeave={handleMegaLeave}
          style={{ animation: 'slideDown 0.2s ease-out forwards' }}
        >
          <div className="container mx-auto px-6 lg:px-12 py-6">
            {/* Top: 3 product families — each an image card linking to its page */}
            <div className="grid grid-cols-3 gap-5 mb-3">
              {/* QPOS */}
              <Link to="/products" onClick={() => setActiveMega(null)} className="group rounded-xl overflow-hidden border border-gray-200 hover:border-green-500 hover:shadow-md transition-all">
                <div className="h-32 overflow-hidden bg-gray-100">
                  <img src="/qpos-keyvisuals/v3mix/kioskmode.webp" alt="QPOS — POS & self-service" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={16} strokeWidth={2} className="text-green-600" />
                    <span className="text-[14px] font-black text-black uppercase tracking-tight group-hover:text-green-600 transition-colors">QPOS</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 leading-snug">All-in-One POS &amp; Self-Service Solutions</p>
                </div>
              </Link>

              {/* QSTUDIO */}
              <Link to="/qstudio" onClick={() => setActiveMega(null)} className="group rounded-xl overflow-hidden border border-gray-200 hover:border-green-500 hover:shadow-md transition-all">
                <div className="h-32 overflow-hidden bg-gray-100">
                  <img src="/qfitimg/studioimg/for_gym.png" alt="QStudio — memberships & bookings" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <Dumbbell size={16} strokeWidth={2} className="text-green-600" />
                    <span className="text-[14px] font-black text-black uppercase tracking-tight group-hover:text-green-600 transition-colors">QStudio</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 leading-snug">Recurring payments, memberships &amp; appointments — automated.</p>
                </div>
              </Link>

              {/* QSENTRY AI */}
              <Link to="/qsentry" onClick={() => setActiveMega(null)} className="group rounded-xl overflow-hidden border border-gray-200 hover:border-[#FF2D2D] hover:shadow-md transition-all">
                <div className="h-32 overflow-hidden bg-gray-100">
                  <img src="/qsentry_img/sentryrealfootage.jpg" alt="QSentry AI — anti-tailgater camera" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <ScanFace size={16} strokeWidth={2} className="text-[#FF2D2D]" />
                    <span className="text-[14px] font-black text-black uppercase tracking-tight group-hover:text-[#FF2D2D] transition-colors">QSentry AI</span>
                    <span className="px-1.5 py-0.5 bg-[#FF2D2D] text-white text-[8px] font-black uppercase tracking-wider rounded">New</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 leading-snug">AI camera for smarter, time-saving operations.</p>
                </div>
              </Link>
            </div>
            {/* QPOS sections: Sell | Manage | Operate | Grow */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { name: 'Sell', desc: 'POS, kiosk, QR, webstore', path: '/products/sell', icon: ShoppingBag },
                { name: 'Manage', desc: 'Dashboard, reports, stock', path: '/products/manage', icon: Boxes },
                { name: 'Operate', desc: 'Kitchen, queue, displays', path: '/products/operate', icon: Settings2 },
                { name: 'Grow', desc: 'Upsells, AI, loyalty', path: '/products/grow', icon: TrendingUp },
              ].map((item) => { const Icon = item.icon; return (
                <Link key={item.path} to={item.path} onClick={() => setActiveMega(null)} className="group flex items-center gap-3 rounded-xl hover:bg-gray-50 p-3 transition-colors">
                  <div className="w-11 h-11 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} strokeWidth={1.75} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-black uppercase tracking-tight group-hover:text-green-600 transition-colors">{item.name}</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                </Link>
              ); })}
            </div>
            {/* See all — right aligned */}
            <div className="mt-3 flex justify-end">
              <Link to="/products" onClick={() => setActiveMega(null)} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-black hover:text-green-600 transition-colors">
                See all products <ArrowRight size={13} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Why Q? Mega Menu — 4 thumbnail cards */}
      {activeMega === 'whyq' && (
        <div
          className="hidden lg:block absolute left-0 right-0 bg-white border-t border-gray-200 shadow-xl"
          onMouseEnter={() => handleMegaEnter('whyq')}
          onMouseLeave={handleMegaLeave}
          style={{ animation: 'slideDown 0.2s ease-out forwards' }}
        >
          <div className="container mx-auto px-6 lg:px-12 py-8">
            <div className="grid grid-cols-4 gap-5">
              {whyQCards.map((card) => (
                <Link
                  key={card.title}
                  to={card.link}
                  onClick={() => setActiveMega(null)}
                  className="group"
                >
                  <div className="aspect-[16/10] overflow-hidden rounded-lg bg-gray-100 mb-3">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h4 className="text-sm font-semibold text-black group-hover:text-green-600 transition-colors mb-0.5">
                    {card.title}
                  </h4>
                  <p className="text-xs text-gray-400">{card.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
