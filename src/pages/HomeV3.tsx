import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import StructuredData from '../components/StructuredData';
import { Reveal, MaskLines, Counter, useScrollProgress, useReveal } from '../components/v3/motion';
import { trackWhatsAppClick } from '../utils/trackWhatsApp';

const WA = 'https://wa.me/60126909189';
const WA_DEMO = `${WA}?text=Hi%20QBot%2C%20I%27d%20like%20to%20book%20a%20demo`;
const WA_VISIT = `${WA}?text=Hi%20QBot%2C%20I%27d%20like%20to%20schedule%20a%20showroom%20visit`;

/** Small viewport hook so sticky scroll storytelling degrades to a stack on mobile. */
function useIsDesktop() {
  const [is, setIs] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const on = () => setIs(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return is;
}

/** Section number + name. The mono register that runs through the whole page. */
function SectionTag({ n, children, invert = false }: { n: string; children: string; invert?: boolean }) {
  return (
    <Reveal className={`t-label flex items-center gap-3 ${invert ? 'text-white/45' : 'text-[var(--g-40)]'}`}>
      <span>{n}</span>
      <span className={`h-px w-8 ${invert ? 'bg-white/25' : 'bg-black/20'}`} />
      <span>{children}</span>
    </Reveal>
  );
}

/* ═══════════════ 01 · HERO ═══════════════ */
function Hero() {
  const facts = [
    { v: 14, s: '', l: 'Modules' },
    { v: 6, s: '', l: 'Sales channels' },
    { v: 17, s: '', l: 'Industries' },
    { v: 5, s: '', l: 'Platform products' },
  ];
  return (
    <section className="relative min-h-[100svh] bg-black text-white flex flex-col overflow-hidden">
      {/* Full-bleed key visual — the three-mode triptych, held back so type leads */}
      <div className="absolute inset-0">
        <img
          src="/qpos-keyvisuals/hero-3in1.webp"
          alt="QBOT V3 MIX shown in counter, kiosk and handheld modes"
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-center opacity-[0.72] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/45 to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-transparent to-black/60" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-end px-6 md:px-10 lg:px-16 pb-10 pt-32">
        <div className="mx-auto w-full max-w-[1500px]">
          <Reveal className="t-label text-white/50 mb-8" delay={100}>
            Designed in Tokyo · Built for Malaysia
          </Reveal>

          <MaskLines
            className="t-display max-w-[16ch]"
            lines={['One system', 'behind', 'every sale.']}
            delay={220}
            step={110}
          />

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <Reveal delay={700} className="t-lead max-w-xl text-white/65">
              Counter, kiosk, handheld, tablet, QR and web — six ways to sell,
              one platform underneath. Activate only what your business needs.
            </Reveal>

            <Reveal delay={820} className="flex flex-wrap items-center gap-3">
              <a
                href={WA_DEMO}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick('HomeV3 > Hero > Book a demo')}
                className="t-label bg-white px-7 py-4 text-black transition-colors hover:bg-white/85"
              >
                Book a demo
              </a>
              <Link
                to="/products"
                className="t-label border border-white/25 px-7 py-4 text-white transition-colors hover:border-white hover:bg-white hover:text-black"
              >
                See the platform
              </Link>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Fact rail — verifiable numbers only */}
      <div className="relative z-10 hairline-inv">
        <div className="mx-auto grid max-w-[1500px] grid-cols-2 lg:grid-cols-4">
          {facts.map((f, i) => (
            <div
              key={f.l}
              className={`px-6 py-7 md:px-10 lg:px-16 ${i > 0 ? 'lg:border-l' : ''} ${i % 2 ? 'border-l' : ''} border-white/12 ${i < 2 ? 'border-b lg:border-b-0' : ''}`}
            >
              <div className="t-num text-3xl font-semibold md:text-4xl">
                <Counter to={f.v} suffix={f.s} />
              </div>
              <div className="t-label mt-1.5 text-white/40">{f.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ 02 · POSITION ═══════════════ */
function Position() {
  return (
    <section className="bg-[var(--paper)] px-6 py-24 md:px-10 md:py-36 lg:px-16">
      <div className="mx-auto max-w-[1500px]">
        <SectionTag n="01">What we build</SectionTag>
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
          <MaskLines
            className="t-h1"
            lines={['We build the software', 'and the hardware', 'a business runs on.']}
            step={95}
          />
          <div className="lg:pt-3">
            <Reveal delay={160} className="t-body text-[var(--g-50)]">
              QBot designs self-service kiosks, all-in-one POS devices and the cloud platform
              behind them. One vendor for the screen on the counter, the system in the back
              office, and the support when something breaks.
            </Reveal>
            <Reveal delay={260} className="mt-8 space-y-0">
              {[
                ['Hardware', 'Counter, kiosk and handheld devices, built and serviced by us.'],
                ['Platform', '14 modules across selling, managing, operating and growing.'],
                ['Deployment', 'Preconfigured, installed and supported from Kuala Lumpur.'],
              ].map(([k, v]) => (
                <div key={k} className="hairline grid grid-cols-[92px_1fr] gap-4 py-4">
                  <span className="t-label pt-1 text-[var(--g-40)]">{k}</span>
                  <span className="t-small text-[var(--g-50)]">{v}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ 03 · PROBLEM ═══════════════ */
function Problem() {
  const stack = ['Counter POS', 'Kiosk vendor', 'Online store', 'Loyalty app', 'Stock spreadsheet'];
  return (
    <section className="bg-black px-6 py-24 text-white md:px-10 md:py-36 lg:px-16">
      <div className="mx-auto max-w-[1500px]">
        <SectionTag n="02" invert>The problem</SectionTag>
        <div className="mt-10 grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <MaskLines
              className="t-h1"
              lines={['Five systems.', 'None of them', 'talk to each other.']}
              step={95}
            />
            <Reveal delay={300} className="t-body mt-8 max-w-md text-white/55">
              Every new channel means another vendor, another login, another stock count that
              drifts out of sync. The cost is not the subscriptions — it is the hours, the
              double entry, and the sales that quietly go missing.
            </Reveal>
          </div>

          <Reveal delay={140} className="lg:pt-2">
            <div data-stagger>
            {stack.map((s, i) => (
              <div
                key={s}
                className="hairline-inv flex items-center justify-between gap-6 py-5"
                style={{ ['--reveal-delay' as string]: `${i * 70}ms` }}
              >
                <div className="flex items-center gap-5">
                  <span className="t-num text-xs text-white/30">{String(i + 1).padStart(2, '0')}</span>
                  <span className="t-h3 text-white/85 line-through decoration-white/25 decoration-1">{s}</span>
                </div>
                <span className="t-label text-white/30">Separate</span>
              </div>
            ))}
            </div>
            <div className="mt-8 flex items-center gap-4 border border-white/20 px-6 py-5">
              <span className="t-num text-xs text-white/40">→</span>
              <span className="t-h3">One platform</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ 04 · SYSTEM DIAGRAM ═══════════════ */
function Systemap() {
  const ref = useReveal<HTMLDivElement>();
  const surfaces = ['POS', 'Kiosk', 'mPOS', 'Tablet', 'QR', 'Web'];
  return (
    <section className="bg-[var(--paper)] px-6 py-24 md:px-10 md:py-36 lg:px-16">
      <div className="mx-auto max-w-[1500px]">
        <SectionTag n="03">How it fits together</SectionTag>
        <MaskLines className="t-h1 mt-10 max-w-[18ch]" lines={['Every surface', 'writes to one core.']} step={95} />

        <div ref={ref} data-reveal className="mt-16 md:mt-24">
          <svg viewBox="0 0 1200 420" className="w-full" role="img" aria-label="Six selling surfaces connecting to one platform core, which connects to inventory, reporting and customers">
            {/* connector lines drawn on scroll */}
            {surfaces.map((_, i) => {
              const x = 100 + i * 200;
              return (
                <path
                  key={i}
                  d={`M ${x} 96 L ${x} 150 Q ${x} 178 ${x < 600 ? x + 28 : x - 28} 178 L ${x < 600 ? 572 : 628} 178 Q 600 178 600 200`}
                  fill="none"
                  stroke="rgba(0,0,0,0.28)"
                  strokeWidth="1"
                  data-draw
                  style={{ ['--len' as string]: 400, ['--reveal-delay' as string]: `${i * 80}ms` }}
                />
              );
            })}
            {/* surface nodes */}
            {surfaces.map((s, i) => {
              const x = 100 + i * 200;
              return (
                <g key={s}>
                  <rect x={x - 74} y={40} width={148} height={56} fill="none" stroke="rgba(0,0,0,0.18)" />
                  <text x={x} y={74} textAnchor="middle" className="t-num" fontSize="15" fill="#0A0A0A" fontWeight="500">{s}</text>
                </g>
              );
            })}
            {/* core */}
            <rect x={432} y={200} width={336} height={78} fill="#000" />
            <text x={600} y={236} textAnchor="middle" fontSize="15" fill="#fff" fontFamily="JetBrains Mono, monospace" letterSpacing="3">QBOT PLATFORM</text>
            <text x={600} y={258} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.5)" fontFamily="JetBrains Mono, monospace" letterSpacing="2">ONE CATALOGUE · ONE LEDGER</text>
            {/* outputs */}
            {['Inventory', 'Reporting', 'Customers'].map((o, i) => {
              const x = 320 + i * 280;
              return (
                <g key={o}>
                  <path d={`M 600 278 Q 600 320 ${x} 320 L ${x} 352`} fill="none" stroke="rgba(0,0,0,0.28)" strokeWidth="1" data-draw style={{ ['--len' as string]: 420, ['--reveal-delay' as string]: `${500 + i * 90}ms` }} />
                  <rect x={x - 74} y={352} width={148} height={50} fill="none" stroke="rgba(0,0,0,0.18)" />
                  <text x={x} y={382} textAnchor="middle" fontSize="13" fill="#3D3D3D" fontFamily="JetBrains Mono, monospace" letterSpacing="1">{o}</text>
                </g>
              );
            })}
          </svg>
        </div>

        <Reveal delay={200} className="t-body mx-auto mt-14 max-w-2xl text-center text-[var(--g-50)]">
          Change a price once and it lands on every counter, kiosk and webstore.
          Sell on any surface and the stock count moves in the same second.
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════ 05 · SIX SURFACES (sticky, scroll-driven) ═══════════════ */
const CHANNELS = [
  { n: 'POS',      img: '/qpos-keyvisuals/hero-qpos.webp',      href: '/products/pos',       line: 'The counter.',      copy: 'Fast checkout, split bills, offline-safe. The station your staff live on.' },
  { n: 'Kiosk',    img: '/qpos-keyvisuals/hero-kiosk.webp',     href: '/products/kiosk',     line: 'Self-service.',     copy: 'Customers order themselves. Queues shorten, average baskets rise, staff move to the floor.' },
  { n: 'mPOS',     img: '/qpos-keyvisuals/hero-mpos.webp',      href: '/products/mpos',      line: 'In hand.',          copy: 'Take payment anywhere — the queue, the table, the event, the roadshow.' },
  { n: 'Tablet',   img: '/qpos-keyvisuals/hero-tableside.webp', href: '/products/tablet',    line: 'Tableside.',        copy: 'Order at the table and fire straight to the kitchen. No walking, no paper.' },
  { n: 'QR Order', img: '/qpos-keyvisuals/hero-qrorder.webp',   href: '/products/qr-order',  line: 'Their phone.',      copy: 'Scan, order, pay. No app to install, no card to hand over, no cash to reconcile.' },
  { n: 'Webstore', img: '/qpos-keyvisuals/hero-web.webp',       href: '/products/webstore',  line: 'Online.',           copy: 'Your own storefront on your own terms — no marketplace commission in the middle.' },
];

function Surfaces() {
  const isDesktop = useIsDesktop();
  const [ref, p] = useScrollProgress<HTMLDivElement>();
  const i = Math.min(Math.floor(p * CHANNELS.length), CHANNELS.length - 1);

  /* Mobile / tablet: an honest stack. Sticky pinning on a small screen fights the user. */
  if (!isDesktop) {
    return (
      <section className="bg-black px-6 py-24 text-white md:px-10">
        <div className="mx-auto max-w-[1500px]">
          <SectionTag n="04" invert>Six ways to sell</SectionTag>
          <MaskLines className="t-h1 mt-8" lines={['Wherever the', 'customer is.']} step={95} />
          <div className="mt-12 space-y-14">
            {CHANNELS.map((c, k) => (
              <Link key={c.n} to={c.href} className="block">
                <Reveal mask className="aspect-[4/3] overflow-hidden bg-white/5">
                  <img src={c.img} alt={c.n} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                </Reveal>
                <Reveal delay={90} className="mt-5">
                  <div className="t-label text-white/40">{String(k + 1).padStart(2, '0')} · {c.n}</div>
                  <h3 className="t-h2 mt-2">{c.line}</h3>
                  <p className="t-body mt-3 text-white/55">{c.copy}</p>
                </Reveal>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* Desktop: pinned canvas, imagery cross-fades as the index advances. */
  return (
    <section ref={ref} className="relative bg-black text-white" style={{ height: `${CHANNELS.length * 85}vh` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden px-10 lg:px-16">
        <div className="mx-auto grid w-full max-w-[1500px] grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] items-center gap-20">
          {/* left — index */}
          <div>
            <SectionTag n="04" invert>Six ways to sell</SectionTag>
            <h2 className="t-h1 mt-8">Wherever the<br />customer is.</h2>
            <div className="mt-12">
              {CHANNELS.map((c, k) => {
                const on = k === i;
                return (
                  <Link
                    key={c.n}
                    to={c.href}
                    className="group flex items-center gap-5 border-t border-white/12 py-4 last:border-b"
                  >
                    <span className={`t-num text-xs transition-colors duration-500 ${on ? 'text-white' : 'text-white/25'}`}>
                      {String(k + 1).padStart(2, '0')}
                    </span>
                    <span className={`t-h3 transition-all duration-500 ${on ? 'translate-x-1 text-white' : 'text-white/30'}`}>
                      {c.n}
                    </span>
                    <span
                      className="ml-auto h-px bg-white transition-all duration-700"
                      style={{ width: on ? 56 : 0, opacity: on ? 1 : 0 }}
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* right — stacked stage */}
          <div>
            <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
              {CHANNELS.map((c, k) => (
                <img
                  key={c.n}
                  src={c.img}
                  alt={c.n}
                  loading={k === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-all duration-[900ms]"
                  style={{
                    opacity: k === i ? 1 : 0,
                    transform: `scale(${k === i ? 1 : 1.06})`,
                    transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
                  }}
                />
              ))}
              {/* progress hairline */}
              <div className="absolute bottom-0 left-0 h-px w-full bg-white/15">
                <div className="h-full bg-white transition-[width] duration-300" style={{ width: `${p * 100}%` }} />
              </div>
            </div>
            <div className="relative mt-7 h-24">
              {CHANNELS.map((c, k) => (
                <div
                  key={c.n}
                  className="absolute inset-0 transition-all duration-700"
                  style={{
                    opacity: k === i ? 1 : 0,
                    transform: `translateY(${k === i ? 0 : 14}px)`,
                    pointerEvents: k === i ? 'auto' : 'none',
                  }}
                >
                  <h3 className="t-h2">{c.line}</h3>
                  <p className="t-body mt-2 max-w-lg text-white/55">{c.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ 06 · V3 MIX ═══════════════ */
function Device() {
  const modes = [
    ['Dock it', 'Counter POS'],
    ['Undock it', 'Handheld mPOS'],
    ['Mount it', 'Self-service kiosk'],
  ];
  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <img src="/qpos-keyvisuals/v3mix/p1-bg.webp" alt="" aria-hidden="true" loading="lazy" className="h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black" />
      </div>

      <div className="relative z-10 px-6 py-24 md:px-10 md:py-36 lg:px-16">
        <div className="mx-auto max-w-[1500px]">
          <SectionTag n="05" invert>The device</SectionTag>
          <div className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:items-end">
            <MaskLines className="t-h1" lines={['Three machines.', 'One device.']} step={100} />
            <Reveal delay={200} className="t-body text-white/60 lg:pb-3">
              Most operators buy a counter POS, a separate handheld, and a kiosk from a third
              vendor. The QBOT V3 MIX is all three — same device, same system, different mode.
            </Reveal>
          </div>

          <Reveal mask delay={120} className="mt-16 overflow-hidden">
            <img
              src="/qpos-keyvisuals/hero-3in1.webp"
              alt="QBOT V3 MIX in counter dock, wall-mounted kiosk and handheld configurations"
              loading="lazy"
              decoding="async"
              className="w-full object-cover"
            />
          </Reveal>

          <div className="mt-2 grid md:grid-cols-3">
            {modes.map(([verb, role], k) => (
              <Reveal key={verb} delay={k * 110} className="hairline-inv py-7 md:pr-8">
                <div className="t-num text-xs text-white/30">{String(k + 1).padStart(2, '0')}</div>
                <div className="t-h3 mt-2">{verb}</div>
                <div className="t-label mt-1.5 text-white/45">{role}</div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200} className="mt-10">
            <Link to="/3-in-1" className="t-label inline-block border border-white/25 px-7 py-4 transition-colors hover:border-white hover:bg-white hover:text-black">
              Explore the V3 MIX
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ 07 · MODULES ═══════════════ */
const GROUPS = [
  { k: 'Sell',    items: [['POS', '/products/pos'], ['mPOS', '/products/mpos'], ['Kiosk', '/products/kiosk'], ['Webstore', '/products/webstore'], ['Tablet', '/products/tablet'], ['QR Order', '/products/qr-order']] },
  { k: 'Manage',  items: [['QHub', '/products/qhub'], ['Inventory', '/products/inventory'], ['Loyalty', '/products/loyalty']] },
  { k: 'Operate', items: [['Kitchen Display', '/products/kitchen-display'], ['Queue (QMS)', '/products/qms'], ['Live Display', '/products/live-display']] },
  { k: 'Grow',    items: [['Sales Boosters', '/products/sales-boosters'], ['AI Insights', '/products/ai-insights']] },
];

function Modules() {
  return (
    <section className="bg-[var(--paper)] px-6 py-24 md:px-10 md:py-36 lg:px-16">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <SectionTag n="06">Depth</SectionTag>
            <MaskLines className="t-h1 mt-8 max-w-[16ch]" lines={['Fourteen modules.', 'Switch on what', 'you need.']} step={95} />
          </div>
          <Reveal delay={200} className="t-body max-w-sm text-[var(--g-50)]">
            No bloated bundle. Start with a counter POS, add loyalty next quarter,
            turn on kitchen displays when the second outlet opens.
          </Reveal>
        </div>

        <div className="mt-16 grid gap-px bg-[var(--rule)] md:grid-cols-2 lg:grid-cols-4">
          {GROUPS.map((g, gi) => (
            <Reveal key={g.k} delay={gi * 90} className="bg-[var(--paper)] p-7 lg:p-8">
              <div className="flex items-baseline justify-between">
                <span className="t-label text-black">{g.k}</span>
                <span className="t-num text-xs text-[var(--g-40)]">{String(g.items.length).padStart(2, '0')}</span>
              </div>
              <div className="mt-6">
                {g.items.map(([name, href]) => (
                  <Link
                    key={name}
                    to={href}
                    className="group flex items-center justify-between border-t border-[var(--rule)] py-3.5 last:border-b"
                  >
                    <span className="t-small font-medium text-[var(--g-50)] transition-colors group-hover:text-black">{name}</span>
                    <span className="t-num text-[var(--g-20)] transition-all group-hover:translate-x-0.5 group-hover:text-black">→</span>
                  </Link>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ 08 · INDUSTRIES ═══════════════ */
const INDUSTRIES: [string, string][] = [
  ['F&B', 'fnb'], ['Gyms', 'gym'], ['Salons', 'salon'], ['Wellness', 'wellness'],
  ['Clinics', 'clinic'], ['Cinemas', 'cinema'], ['Theme parks', 'themepark'], ['Museums', 'museum'],
  ['Hotels', 'hotels'], ['Malls', 'malls'], ['Parking', 'parking'], ['Transport', 'transport'],
  ['Car wash', 'carwash'], ['Coworking', 'coworking'], ['Events', 'events'], ['Sport', 'sport'],
  ['Property', 'propertymanagement'],
];

function Industries() {
  const [active, setActive] = useState(0);
  return (
    <section className="bg-black px-6 py-24 text-white md:px-10 md:py-36 lg:px-16">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <SectionTag n="07" invert>Reach</SectionTag>
            <MaskLines className="t-h1 mt-8 max-w-[15ch]" lines={['Seventeen', 'industries run', 'on it.']} step={95} />
          </div>
          <Reveal delay={180} className="t-body max-w-sm text-white/55">
            The same core, configured per vertical — ticketing for a theme park,
            memberships for a gym, table service for a restaurant.
          </Reveal>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          {/* stage */}
          <Reveal mask className="relative aspect-[4/3] overflow-hidden bg-white/5 lg:aspect-auto lg:min-h-[460px]">
            {INDUSTRIES.map(([label, slug], k) => (
              <img
                key={slug}
                src={`/cover/cover-${slug}.webp`}
                alt={label}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-all duration-700"
                style={{ opacity: k === active ? 1 : 0, transform: `scale(${k === active ? 1 : 1.05})` }}
              />
            ))}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <div className="t-num text-xs text-white/50">{String(active + 1).padStart(2, '0')} / 17</div>
              <div className="t-h2 mt-1">{INDUSTRIES[active][0]}</div>
            </div>
          </Reveal>

          {/* list */}
          <Reveal delay={120} className="flex flex-wrap content-start gap-x-2 gap-y-2 lg:pt-2">
            {INDUSTRIES.map(([label], k) => (
              <button
                key={label}
                type="button"
                onMouseEnter={() => setActive(k)}
                onFocus={() => setActive(k)}
                onClick={() => setActive(k)}
                aria-pressed={k === active}
                className={`t-label border px-4 py-3 transition-colors duration-300 ${
                  k === active
                    ? 'border-white bg-white text-black'
                    : 'border-white/18 text-white/55 hover:border-white/50 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ 09 · ECOSYSTEM ═══════════════ */
const ECOSYSTEM = [
  { n: 'QPOS',      d: 'Commerce platform — six selling surfaces, fourteen modules.', href: '/products',  img: '/qpos-keyvisuals/hero-qpos.webp' },
  { n: 'QStudio',   d: 'Memberships, recurring payments, bookings and appointments.', href: '/qstudio',   img: '/qfitimg/studioimg/for_gym.png' },
  { n: 'QSentry AI',d: 'AI camera that watches operations and flags what staff miss.', href: '/qsentry',  img: '/qsentry_img/sentryrealfootage.jpg' },
  { n: 'QSecurity', d: 'Visitor registration, face-ID access, guard patrol oversight.', href: '/qsecurity', img: '/qsecurity/qsc__0000_faceid.jpg' },
  { n: 'QProp',     d: 'Self-service check-in and door-lock control for property stays.', href: '/qprop', img: '/cover/cover-propertymanagement.webp' },
];

function Ecosystem() {
  return (
    <section className="bg-[var(--paper)] px-6 py-24 md:px-10 md:py-36 lg:px-16">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <SectionTag n="08">The ecosystem</SectionTag>
            <MaskLines className="t-h1 mt-8 max-w-[17ch]" lines={['One core.', 'Five products', 'built on top.']} step={95} />
          </div>
          <Reveal delay={180} className="t-body max-w-sm text-[var(--g-50)]">
            The platform that runs a restaurant counter also runs a gym membership,
            a building's front door and a hotel check-in. Same core, new vertical.
          </Reveal>
        </div>

        <div className="mt-16 hairline">
          {ECOSYSTEM.map((e, k) => (
            <Reveal key={e.n} delay={k * 70}>
              <Link
                to={e.href}
                className="group relative flex items-center gap-6 border-b border-[var(--rule)] py-7 md:py-9"
              >
                <span className="t-num w-10 shrink-0 text-xs text-[var(--g-40)]">{String(k + 1).padStart(2, '0')}</span>
                <span className="t-h2 shrink-0 transition-transform duration-500 group-hover:translate-x-2">{e.n}</span>
                <span className="t-small hidden flex-1 text-[var(--g-50)] md:block">{e.d}</span>
                {/* hover-revealed thumbnail — the reward for exploring */}
                <span className="pointer-events-none absolute right-16 top-1/2 hidden h-24 w-40 -translate-y-1/2 overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100 lg:block">
                  <img src={e.img} alt="" aria-hidden="true" loading="lazy" className="h-full w-full object-cover" />
                </span>
                <span className="t-num ml-auto shrink-0 text-[var(--g-20)] transition-all duration-500 group-hover:translate-x-1 group-hover:text-black">→</span>
              </Link>
              <span className="t-small block pb-6 text-[var(--g-50)] md:hidden">{e.d}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ 10 · HARDWARE ═══════════════ */
const HARDWARE = [
  { n: 'V3 MIX',  d: 'Counter, handheld and kiosk in one device.',      img: '/qpos-keyvisuals/v3mix/desktop.webp',        href: '/3-in-1' },
  { n: 'D3 PRO',  d: '15.6" FHD desktop POS, optional dual display.',   img: '/qpos-keyvisuals/d3pro/d3customerorder.webp', href: '/hardware' },
  { n: 'K2 KIOSK',d: 'Free-standing self-service kiosk, 21" or 27".',   img: '/qpos-keyvisuals/k2/k2desktop.webp',          href: '/hardware' },
];

function Hardware() {
  return (
    <section className="bg-black px-6 py-24 text-white md:px-10 md:py-36 lg:px-16">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <SectionTag n="09" invert>Hardware</SectionTag>
            <MaskLines className="t-h1 mt-8 max-w-[16ch]" lines={['Built, loaded', 'and tested', 'before it ships.']} step={95} />
          </div>
          <Reveal delay={180} className="t-body max-w-sm text-white/55">
            Devices arrive preconfigured with your catalogue already on them.
            Plug in and sell — no integrator, no third-party installer.
          </Reveal>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {HARDWARE.map((h, k) => (
            <Link key={h.n} to={h.href} className="group block">
              <Reveal mask delay={k * 110} className="aspect-[4/5] overflow-hidden bg-white/5">
                <img
                  src={h.img}
                  alt={h.n}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
                />
              </Reveal>
              <Reveal delay={k * 110 + 90} className="mt-5 flex items-start justify-between gap-4 border-t border-white/12 pt-4">
                <div>
                  <div className="t-h3">{h.n}</div>
                  <div className="t-small mt-1 text-white/50">{h.d}</div>
                </div>
                <span className="t-num text-white/30 transition-all group-hover:translate-x-1 group-hover:text-white">→</span>
              </Reveal>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ 11 · CREDIBILITY ═══════════════ */
function Showroom() {
  const MAPS = 'https://www.google.com/maps/search/?api=1&query=Solaris+Dutamas+Publika+Kuala+Lumpur';
  return (
    <section className="bg-[var(--paper)]">
      <div className="mx-auto max-w-[1500px] px-6 pt-24 md:px-10 md:pt-36 lg:px-16">
        <SectionTag n="10">Proof</SectionTag>
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20 lg:items-end">
          <MaskLines className="t-h1 max-w-[16ch]" lines={['Come and use it', 'before you buy it.']} step={100} />
          <Reveal delay={200} className="t-body text-[var(--g-50)] lg:pb-2">
            Our showroom in Publika, Kuala Lumpur runs the full line — the 3-in-1 device,
            the kiosks, the kitchen displays. Not a slide deck. The real thing, switched on.
          </Reveal>
        </div>
      </div>

      {/* full-bleed photograph — the composition break */}
      <Reveal mask className="mt-16 md:mt-20">
        <a href={MAPS} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden">
          <img
            src="/qbotshowroom.jpg"
            alt="QBot showroom at Solaris Dutamas, Publika Kuala Lumpur"
            width={1376}
            height={768}
            loading="lazy"
            decoding="async"
            className="h-[45vh] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03] md:h-[70vh]"
          />
        </a>
      </Reveal>

      <div className="mx-auto max-w-[1500px] px-6 pb-24 md:px-10 md:pb-36 lg:px-16">
        <div className="grid gap-px bg-[var(--rule)] md:grid-cols-3">
          {[
            ['Showroom', 'B3-6-13 Solaris Dutamas\nJalan Dutamas 1, 50480 Publika, KL'],
            ['Hours', 'Monday – Friday, 10AM – 7PM\nReservation required'],
            ['Origin', 'Designed in Tokyo\nDeployed and supported from Malaysia'],
          ].map(([k, v], i) => (
            <Reveal key={k} delay={i * 90} className="bg-[var(--paper)] px-1 py-8 md:px-7">
              <div className="t-label text-[var(--g-40)]">{k}</div>
              <div className="t-small mt-3 whitespace-pre-line font-medium text-black">{v}</div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200} className="mt-10 flex flex-wrap gap-3">
          <a
            href={WA_VISIT}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick('HomeV3 > Showroom > Book a visit')}
            className="t-label bg-black px-7 py-4 text-white transition-colors hover:bg-[var(--g-70)]"
          >
            Book a visit
          </a>
          <a href={MAPS} target="_blank" rel="noopener noreferrer" className="t-label border border-black/20 px-7 py-4 text-black transition-colors hover:border-black">
            Get directions
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════ 12 · CLOSE ═══════════════ */
function Close() {
  return (
    <section className="bg-black px-6 py-28 text-white md:px-10 md:py-40 lg:px-16">
      <div className="mx-auto max-w-[1500px]">
        <MaskLines
          className="t-display max-w-[13ch]"
          lines={['Let us show', 'you the', 'whole system.']}
          step={110}
        />
        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <Reveal delay={400} className="t-lead max-w-lg text-white/55">
            Tell us what you sell and where. We will map it to the platform and
            show you exactly what it looks like running.
          </Reveal>
          <Reveal delay={500} className="flex flex-wrap gap-3">
            <a
              href={WA_DEMO}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('HomeV3 > Close > Book a demo')}
              className="t-label bg-white px-8 py-4 text-black transition-colors hover:bg-white/85"
            >
              Book a demo
            </a>
            <Link to="/contact-us" className="t-label border border-white/25 px-8 py-4 transition-colors hover:border-white hover:bg-white hover:text-black">
              Talk to us
            </Link>
          </Reveal>
        </div>

        <div className="hairline-inv mt-20 grid gap-6 pt-8 md:grid-cols-3">
          {[
            ['WhatsApp', '+60 12-690 9189', WA],
            ['Email', 'hello@qbot.now', 'mailto:hello@qbot.now'],
            ['Showroom', 'Publika, Kuala Lumpur', 'https://www.google.com/maps/search/?api=1&query=Solaris+Dutamas+Publika+Kuala+Lumpur'],
          ].map(([k, v, href]) => (
            <a key={k} href={href} target="_blank" rel="noopener noreferrer" className="group">
              <div className="t-label text-white/35">{k}</div>
              <div className="t-small mt-1.5 font-medium transition-colors group-hover:text-white/70">{v}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ PAGE ═══════════════ */
export default function HomeV3() {
  return (
    <main className="v3 bg-[var(--paper)]">
      <SEOHead
        title="QBot — POS, Self-Service Kiosk & Commerce Platform | Malaysia"
        description="QBot builds the hardware and software businesses run on: counter POS, self-service kiosks, QR ordering, webstore and a 14-module cloud platform. 17 industries. Showroom in Publika KL."
        keywords="POS system Malaysia, self service kiosk Malaysia, 3-in-1 POS, QR ordering Malaysia, mobile POS, webstore, loyalty, AI insights, QBot, QPOS, kiosk manufacturer Malaysia"
        url="https://qbot.now/"
        image="https://qbot.now/qpos-keyvisuals/qsharer.jpg"
        imageAlt="QBot — POS, kiosk and commerce platform"
      />
      <StructuredData type="organization" />
      <Hero />
      <Position />
      <Problem />
      <Systemap />
      <Surfaces />
      <Device />
      <Modules />
      <Industries />
      <Ecosystem />
      <Hardware />
      <Showroom />
      <Close />
    </main>
  );
}
