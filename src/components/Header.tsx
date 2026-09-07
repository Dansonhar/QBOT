import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const PRODUCTS: { group: string; items: [string, string][] }[] = [
  { group: 'Sell', items: [['POS', '/products/pos'], ['mPOS', '/products/mpos'], ['Kiosk', '/products/kiosk'], ['Webstore', '/products/webstore'], ['Tablet', '/products/tablet'], ['QR Order', '/products/qr-order']] },
  { group: 'Manage', items: [['QHub', '/products/qhub'], ['Inventory', '/products/inventory'], ['Loyalty', '/products/loyalty']] },
  { group: 'Operate', items: [['Kitchen Display', '/products/kitchen-display'], ['Queue (QMS)', '/products/qms'], ['Live Display', '/products/live-display']] },
  { group: 'Grow', items: [['Sales Boosters', '/products/sales-boosters'], ['AI Insights', '/products/ai-insights']] },
];

const PLATFORMS: [string, string, string][] = [
  ['QStudio', '/qstudio', 'Memberships, recurring payments, bookings'],
  ['QSentry AI', '/qsentry', 'AI camera oversight for operations'],
  ['QSecurity', '/qsecurity', 'Visitor registration and face-ID access'],
  ['QProp', '/qprop', 'Self check-in and door-lock for property'],
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<null | 'products' | 'platforms'>(null);
  const [mobile, setMobile] = useState(false);
  const { pathname } = useLocation();
  const navRef = useRef<HTMLElement | null>(null);

  /* The homepage opens on a black hero, so the bar starts transparent there only. */
  const overHero = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(null); setMobile(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobile]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(null); setMobile(false); } };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('mousedown', onClick); };
  }, []);

  const solid = scrolled || !overHero || open !== null;
  const fg = solid ? 'text-black' : 'text-white';

  return (
    <header
      ref={navRef}
      className={`v3 fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid ? 'bg-[var(--paper-95)] backdrop-blur-md border-b border-[var(--rule)]' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1500px] items-center gap-8 px-6 md:px-10 lg:px-16">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="QBot home">
          {/* The mark is solid black artwork; invert it while the bar is
              transparent over the dark hero, then let it return to black. */}
          <img
            src="/qbotlogo.svg"
            alt=""
            aria-hidden="true"
            width={26}
            height={26}
            className={`h-[26px] w-[26px] transition-[filter] duration-500 ${solid ? '' : 'invert'}`}
          />
          <span className={`t-label text-[15px] font-bold tracking-[0.24em] ${fg}`}>QBOT</span>
        </Link>

        {/* desktop nav */}
        <nav className="hidden flex-1 items-center gap-1 lg:flex">
          {([['Products', 'products'], ['Platforms', 'platforms']] as const).map(([label, key]) => (
            <button
              key={key}
              type="button"
              onClick={() => setOpen(open === key ? null : key)}
              onMouseEnter={() => setOpen(key)}
              aria-expanded={open === key}
              className={`t-label px-4 py-2.5 transition-opacity hover:opacity-60 ${fg} ${open === key ? 'opacity-100' : ''}`}
            >
              {label}
            </button>
          ))}
          {([['Hardware', '/hardware'], ['Pricing', '/pricing'], ['About', '/about-us']] as [string, string][]).map(([label, href]) => (
            <Link key={href} to={href} onMouseEnter={() => setOpen(null)} className={`t-label px-4 py-2.5 transition-opacity hover:opacity-60 ${fg}`}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <a
            href="https://wa.me/60126909189?text=Hi%20QBot%2C%20I%27d%20like%20to%20book%20a%20demo"
            target="_blank"
            rel="noopener noreferrer"
            className={`t-label hidden px-6 py-3 transition-colors sm:inline-block ${
              solid ? 'bg-black text-white hover:bg-[var(--g-70)]' : 'bg-white text-black hover:bg-white/85'
            }`}
          >
            Book a demo
          </a>
          <button
            type="button"
            onClick={() => setMobile(v => !v)}
            aria-label={mobile ? 'Close menu' : 'Open menu'}
            aria-expanded={mobile}
            className={`flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden ${fg}`}
          >
            <span className={`block h-px w-5 bg-current transition-transform duration-300 ${mobile ? 'translate-y-[3px] rotate-45' : ''}`} />
            <span className={`block h-px w-5 bg-current transition-transform duration-300 ${mobile ? '-translate-y-[3px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* mega panel */}
      <div
        onMouseLeave={() => setOpen(null)}
        className={`hidden overflow-hidden border-t border-[var(--rule)] bg-[var(--paper)] transition-[max-height,opacity] duration-500 lg:block ${
          open ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mx-auto max-w-[1500px] px-16 py-12">
          {open === 'products' && (
            <div className="grid grid-cols-4 gap-10">
              {PRODUCTS.map(g => (
                <div key={g.group}>
                  <div className="t-label mb-5 text-[var(--g-40)]">{g.group}</div>
                  {g.items.map(([n, href]) => (
                    <Link key={href} to={href} className="group flex items-center justify-between border-t border-[var(--rule)] py-3 last:border-b">
                      <span className="t-small font-medium text-[var(--g-50)] transition-colors group-hover:text-black">{n}</span>
                      <span className="t-num text-[var(--g-20)] transition-transform group-hover:translate-x-0.5 group-hover:text-black">→</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}
          {open === 'platforms' && (
            <div className="grid grid-cols-2 gap-x-16">
              {PLATFORMS.map(([n, href, d]) => (
                <Link key={href} to={href} className="group flex items-baseline gap-6 border-b border-[var(--rule)] py-6">
                  <span className="t-h3 shrink-0 transition-transform duration-500 group-hover:translate-x-1.5">{n}</span>
                  <span className="t-small text-[var(--g-50)]">{d}</span>
                  <span className="t-num ml-auto text-[var(--g-20)] transition-all group-hover:translate-x-1 group-hover:text-black">→</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* mobile drawer — a real layout, not a shrunken desktop menu */}
      <div
        className={`fixed inset-x-0 top-[72px] bottom-0 overflow-y-auto bg-[var(--paper)] transition-all duration-400 lg:hidden ${
          mobile ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'
        }`}
      >
        <div className="px-6 py-8">
          {PRODUCTS.map(g => (
            <div key={g.group} className="mb-8">
              <div className="t-label mb-3 text-[var(--g-40)]">{g.group}</div>
              <div className="grid grid-cols-2 gap-x-4">
                {g.items.map(([n, href]) => (
                  <Link key={href} to={href} className="t-small border-t border-[var(--rule)] py-3 font-medium">{n}</Link>
                ))}
              </div>
            </div>
          ))}
          <div className="t-label mb-3 text-[var(--g-40)]">Platforms</div>
          {PLATFORMS.map(([n, href]) => (
            <Link key={href} to={href} className="t-h3 block border-t border-[var(--rule)] py-4">{n}</Link>
          ))}
          <div className="mt-8 grid gap-3">
            {([['Hardware', '/hardware'], ['Pricing', '/pricing'], ['About', '/about-us'], ['Contact', '/contact-us']] as [string, string][]).map(([n, href]) => (
              <Link key={href} to={href} className="t-small border-t border-[var(--rule)] py-3 font-medium">{n}</Link>
            ))}
          </div>
          <a
            href="https://wa.me/60126909189?text=Hi%20QBot%2C%20I%27d%20like%20to%20book%20a%20demo"
            target="_blank"
            rel="noopener noreferrer"
            className="t-label mt-8 block bg-black px-6 py-4 text-center text-white"
          >
            Book a demo
          </a>
        </div>
      </div>
    </header>
  );
}
