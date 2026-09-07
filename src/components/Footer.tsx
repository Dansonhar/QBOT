import { Link } from 'react-router-dom';

const COLS: { head: string; links: [string, string][] }[] = [
  { head: 'Sell', links: [['POS', '/products/pos'], ['mPOS', '/products/mpos'], ['Kiosk', '/products/kiosk'], ['Webstore', '/products/webstore'], ['Tablet', '/products/tablet'], ['QR Order', '/products/qr-order']] },
  { head: 'Platform', links: [['QHub', '/products/qhub'], ['Inventory', '/products/inventory'], ['Loyalty', '/products/loyalty'], ['Kitchen Display', '/products/kitchen-display'], ['Queue (QMS)', '/products/qms'], ['AI Insights', '/products/ai-insights']] },
  { head: 'Products', links: [['QStudio', '/qstudio'], ['QSentry AI', '/qsentry'], ['QSecurity', '/qsecurity'], ['QProp', '/qprop'], ['Hardware', '/hardware'], ['Free tools', '/tools']] },
  { head: 'Company', links: [['About', '/about-us'], ['Contact', '/contact-us'], ['Pricing', '/pricing'], ['Buying guide', '/pos-buying-guide'], ['Terms', '/terms'], ['Privacy', '/privacy']] },
];

const SOCIAL: [string, string][] = [
  ['Instagram', 'https://www.instagram.com/qbotfuture'],
  ['Facebook', 'https://www.facebook.com/qbotmalaysia'],
  ['TikTok', 'https://www.tiktok.com/@qbotfuture'],
];

export default function Footer() {
  return (
    <footer className="v3 bg-black px-6 pb-10 pt-20 text-white md:px-10 md:pt-28 lg:px-16">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_2fr] lg:gap-20">
          <div>
            <div className="flex items-center gap-2.5">
              <img
                src="/qbotlogo.svg"
                alt=""
                aria-hidden="true"
                width={28}
                height={28}
                className="h-7 w-7 invert"
              />
              <span className="t-label text-[15px] font-bold tracking-[0.24em]">QBOT</span>
            </div>
            <p className="t-small mt-5 max-w-xs text-white/45">
              Self-service kiosks, all-in-one POS devices, and the platform behind them.
              Designed in Tokyo. Deployed and supported from Malaysia.
            </p>
            <div className="mt-7 space-y-1">
              <a href="https://wa.me/60126909189" target="_blank" rel="noopener noreferrer" className="t-small block text-white/70 transition-colors hover:text-white">+60 12-690 9189</a>
              <a href="mailto:hello@qbot.now" className="t-small block text-white/70 transition-colors hover:text-white">hello@qbot.now</a>
              <p className="t-small pt-2 text-white/45">B3-6-13 Solaris Dutamas<br />Jalan Dutamas 1, 50480 Publika, KL</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
            {COLS.map(c => (
              <div key={c.head}>
                <div className="t-label mb-4 text-white/35">{c.head}</div>
                <ul className="space-y-2.5">
                  {c.links.map(([n, href]) => (
                    <li key={href}>
                      <Link to={href} className="t-small text-white/60 transition-colors hover:text-white">{n}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="hairline-inv mt-16 flex flex-col gap-4 pt-7 md:flex-row md:items-center md:justify-between">
          <p className="t-label text-white/30">© {new Date().getFullYear()} QBot · All rights reserved</p>
          <div className="flex gap-6">
            {SOCIAL.map(([n, href]) => (
              <a key={n} href={href} target="_blank" rel="noopener noreferrer" className="t-label text-white/40 transition-colors hover:text-white">{n}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
