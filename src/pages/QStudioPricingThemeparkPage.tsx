import { useEffect } from 'react';
import React from 'react';
import { CheckCircle2, HelpCircle, MessageCircle, Star, X as XIcon } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import {
  SOFTWARE_TIERS as BASE_TIERS,
  isCellIncluded,
  type CellValue,
  type StudioTier,
  type FeatureGroup,
  type TierLevel,
} from '../data/quoteStudioCatalog';

const LIME = '#CCFF00';
const WA = `https://wa.me/60126909189?text=${encodeURIComponent(
  "Hi QStudio! I'd like a quote for your theme park / playland / museum plan. Please share details.",
)}`;

// ─── Themepark-specific tier pricing ───────────────────────────────────────
// Starter 499 · Standard 899 · Pro 1599 · Advanced 2499 · Enterprise = custom
const THEMEPARK_PRICES: Record<TierLevel, number> = {
  starter: 499,
  standard: 899,
  pro: 1599,
  advanced: 2499,
  enterprise: 0,
};

const THEMEPARK_TIERS: StudioTier[] = BASE_TIERS.map((t) => ({
  ...t,
  title: t.title.replace('Studio ', 'Park '),
  monthly: THEMEPARK_PRICES[t.level],
  price: THEMEPARK_PRICES[t.level],
}));

// ─── Themepark-specific feature matrix ─────────────────────────────────────
// Reordered for theme parks / playlands / museums:
//   1. Ticketing (headline)  →  2. POS  →  3. Visitor & Pass Holder Mgmt
//   →  4. Booking & Schedule  →  5. Staff  →  6. Marketing
//   →  7. Loyalty & Rewards  →  8. Inventory  →  9. Integrations
//   →  10. Push Notifications
const C = (s: CellValue, st: CellValue, p: CellValue, a: CellValue, e: CellValue):
  Record<TierLevel, CellValue> => ({ starter: s, standard: st, pro: p, advanced: a, enterprise: e });

const THEMEPARK_GROUPS: FeatureGroup[] = [
  {
    title: 'Ticketing',
    rows: [
      { feature: 'QR Tickets',                  tooltip: 'Single-entry QR tickets — perfect for gate admission and event days.',          cells: C(true, true, true, true, true) },
      { feature: 'Face Check-in Tickets',       tooltip: 'Skip the QR — your guest\'s face is the ticket.',                                cells: C(false, true, true, true, true) },
      { feature: 'Time-Based Tickets',          tooltip: 'Hour passes, day passes, week passes — all timed.',                              cells: C(false, false, true, true, true) },
      { feature: 'Advanced Tickets',            tooltip: 'Family bundles, group tickets, tiered access (kid/adult/senior) — flexible setups.', cells: C(false, false, false, true, true) },
    ],
  },
  {
    title: 'POS',
    rows: [
      { feature: 'Counter POS',                 tooltip: 'Ring up tickets and concessions fast from any device — no pen, no paper.',     cells: C(true, true, true, true, true) },
      { feature: 'Customer Website',            tooltip: 'A simple branded site visitors can find and book tickets from.',                cells: C(true, true, true, true, true) },
      { feature: 'Sales & Finance Reports',     tooltip: 'End-of-day numbers without a spreadsheet.',                                     cells: C(true, true, true, true, true) },
      { feature: 'Data Export',                 tooltip: 'Pull a CSV any time — your data is yours.',                                     cells: C(true, true, true, true, true) },
      { feature: 'Payment System',              tooltip: 'Take cards, e-wallets, and QR — all in one tap.',                               cells: C(true, true, true, true, true) },
      { feature: 'All-in-one Dashboard',        tooltip: 'One screen for gate counts, ticket sales, F&B — your whole park at a glance.', cells: C(true, true, true, true, true) },
      { feature: 'Data Analytics',              tooltip: 'Filter by date, gate, attraction, or staff — answer questions a spreadsheet can\'t.', cells: C(true, true, true, true, true) },
      { feature: 'AI Insights',                 tooltip: 'AI flags trends and outliers automatically — what\'s growing, what\'s stalling.', cells: C(false, false, false, true, true) },
      { feature: 'Products Management',         tooltip: 'Bundle and price your tickets, passes, and merch in one place.',               cells: C('10 products', '50 products', 'Unlimited', 'Unlimited', 'Unlimited') },
    ],
  },
  {
    title: 'Visitor & Pass Holder Management',
    rows: [
      { feature: 'Family / Bundle Pass',        tooltip: 'Share one pass across the whole family — without sharing logins.',             cells: C(false, false, true, true, true) },
      { feature: 'Visitor Profile Setup',       tooltip: 'One profile per visitor — visit history, payments, preferences in one place.', cells: C(true, true, true, true, true) },
      { feature: 'QR Code Check-in',            tooltip: 'Visitors scan in 2 seconds — no gate queue.',                                  cells: C(true, true, true, true, true) },
      { feature: 'Face ID Check-in',            tooltip: 'Walk-up, walk-in, walk-on — no card or phone needed.',                         cells: C(false, true, true, true, true) },
      { feature: 'Recurring Season Pass Payment', tooltip: 'Auto-bill season pass holders monthly — fewer chases, better renewal.',      cells: C(false, false, true, true, true) },
      { feature: 'E-Agreement Sign Feature',    tooltip: 'Waivers and liability forms signed on the spot — no printer required.',        cells: C(false, false, true, true, true) },
      { feature: 'Gate / Turnstile / Ride Access', tooltip: 'Gates and ride entries open only for valid tickets — auto and secure.',     cells: C(false, false, true, true, true) },
      { feature: 'Visitors / Pass Holders',     tooltip: 'Sign up as many as you want — no per-visitor fees.',                            cells: C('Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited') },
      { feature: 'Franchise Model',             tooltip: 'Roll out one brand across many parks/sites with central control.',              cells: C(false, false, false, false, 'Customized') },
    ],
  },
  {
    title: 'Booking & Schedule',
    rows: [
      { feature: 'Schedule Attractions & Time Slots', tooltip: 'Rides, exhibits, shows, tours, party rooms — all bookable from one calendar.', cells: C(false, true, true, true, true) },
      { feature: 'Pricing Plan Management',     tooltip: 'Set ticket tiers, off-peak rates, family bundles — your rules.',               cells: C(false, true, true, true, true) },
      { feature: 'Calendar-Based Scheduler',    tooltip: 'Drag, drop, done — your week of shows and tours at a glance.',                  cells: C(false, true, true, true, true) },
      { feature: 'Visitor Booking via App/Web', tooltip: 'Visitors book themselves — no DMs at 11pm.',                                    cells: C(false, true, true, true, true) },
      { feature: 'Customized Rules',            tooltip: 'Capacity per attraction, no-show fees, weather refund windows — your way.',    cells: C(false, false, true, true, true) },
    ],
  },
  {
    title: 'Staff',
    rows: [
      { feature: 'Staff Check-in System',       tooltip: 'Staff clock in/out from the same system — no separate app.',                    cells: C(true, true, true, true, true) },
      { feature: 'Timesheet',                   tooltip: 'Hours logged automatically — no end-of-month chaos.',                           cells: C(true, true, true, true, true) },
      { feature: 'Activity Log',                tooltip: 'See who did what, when — accountability built in.',                             cells: C(true, true, true, true, true) },
      { feature: 'Staff Commissions Mgmt',      tooltip: 'Pay ticket agents, tour guides, and party hosts based on what they actually sold.', cells: C(false, false, false, true, true) },
      { feature: 'Staff Accounts',              tooltip: 'Add team members — additional staff billed at a fixed rate.',                   cells: C('1 staff', '10 staff', 'Unlimited', 'Unlimited', 'Unlimited') },
      { feature: 'Outlets',                     tooltip: 'Manage multiple parks/sites from one account. Extra outlet: RM399/mo.',         cells: C('1 outlet', '1 outlet', 'Unlimited', 'Unlimited', 'Unlimited') },
    ],
  },
  {
    title: 'Marketing',
    rows: [
      { feature: 'Leads Management',            tooltip: 'Capture interested visitors and follow up without losing track.',               cells: C(false, false, true, true, true) },
      { feature: 'Email Blast',                 tooltip: 'Send promos to all visitors — tokens charged per send.',                        cells: C(false, false, true, true, true) },
      { feature: 'WhatsApp Blast',              tooltip: 'Reach visitors where they actually read — tokens charged per send.',            cells: C(false, false, true, true, true) },
    ],
  },
  {
    title: 'Loyalty & Rewards',
    rows: [
      { feature: 'Voucher Management',          tooltip: 'Spin up promo codes for school holidays or off-peak campaigns in minutes.',     cells: C(false, false, true, true, true) },
      { feature: 'Digital Stamp Card',          tooltip: 'Repeat-visit rewards — e.g. 10 visits = 1 free — automated, fraud-proof.',      cells: C(false, false, true, true, true) },
      { feature: 'Points & Rewards',            tooltip: 'Visitors earn points on every visit — spend them on perks and merch.',          cells: C(false, false, false, true, true) },
    ],
  },
  {
    title: 'Inventory System',
    rows: [
      { feature: 'Supplier Management',         tooltip: 'Track who supplies what and when restocks are due.',                            cells: C(false, false, true, true, true) },
      { feature: 'Stock Management',            tooltip: 'Know what merch and F&B stock is on hand before someone asks.',                 cells: C(false, false, true, true, true) },
      { feature: 'Stock Items',                 tooltip: 'Track everything from plush toys to snacks.',                                   cells: C(false, false, 'Unlimited', 'Unlimited', 'Unlimited') },
    ],
  },
  {
    title: 'Integrations',
    rows: [
      { feature: 'Klook Integration',           tooltip: 'Sync ticket inventory with Klook — launching soon.',                            cells: C('Coming Soon', 'Coming Soon', 'Coming Soon', 'Coming Soon', 'Coming Soon') },
      { feature: 'Customized Integration',      tooltip: 'Bespoke integration with your existing tools — launching soon.',                cells: C('Coming Soon', 'Coming Soon', 'Coming Soon', 'Coming Soon', 'Coming Soon') },
      { feature: 'Vending Machine Integration', tooltip: 'Self-serve vending tied to visitor accounts — launching soon.',                  cells: C('Coming Soon', 'Coming Soon', 'Coming Soon', 'Coming Soon', 'Coming Soon') },
    ],
  },
  {
    title: 'Push Notifications',
    rows: [
      { feature: 'Daily Sales Report',          tooltip: 'Yesterday\'s numbers on your phone before your first coffee — app push or WhatsApp.', cells: C(false, true, true, true, true) },
      { feature: 'Check-in Report',             tooltip: 'Gate counts by hour, day, and attraction — sent to your phone daily.',          cells: C(false, true, true, true, true) },
      { feature: 'Abnormal Check-in',           tooltip: 'Get notified if something looks off — duplicate scans, suspicious patterns flagged.', cells: C(false, false, true, true, true) },
      { feature: 'Expiring Season Passes',      tooltip: 'Heads-up before passes lapse — renew before holders drift away.',               cells: C(false, false, true, true, true) },
      { feature: 'Low Sales Alert',             tooltip: 'Get pinged when ticket sales dip below your threshold.',                         cells: C(false, false, false, true, true) },
      { feature: 'Branch Performance Summary',  tooltip: 'Multi-park numbers in one message.',                                            cells: C(false, false, false, true, true) },
      { feature: 'Top Selling Tickets / Products', tooltip: 'Know your bestsellers — and double down on them.',                            cells: C(false, false, false, true, true) },
      { feature: 'Staff Late Notifications',    tooltip: 'Auto-alert when staff don\'t clock in on time.',                                cells: C(false, false, false, true, true) },
      { feature: 'Customized Notifications',    tooltip: 'Pick exactly what you want pinged about — your way.',                            cells: C(false, false, false, false, true) },
    ],
  },
];

function FeatureTooltip({ text }: { text: string }) {
  return (
    <span className="relative inline-flex group align-middle ml-1" title={text}>
      <HelpCircle size={11} strokeWidth={2.5} className="text-gray-300 group-hover:text-gray-700 transition-colors cursor-help" />
      <span
        role="tooltip"
        className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:block z-50 w-56 bg-gray-900 text-white text-[12px] font-medium leading-relaxed px-3 py-2.5 rounded-md shadow-2xl pointer-events-none whitespace-normal"
      >
        {text}
      </span>
    </span>
  );
}

function CellRender({ cell }: { cell: CellValue }) {
  const included = isCellIncluded(cell);
  if (!included) {
    return <XIcon size={14} strokeWidth={2} className="inline text-gray-300" />;
  }
  if (typeof cell === 'string') {
    const isComingSoon = cell.toLowerCase() === 'coming soon';
    return (
      <span
        className={`text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-tight ${
          isComingSoon ? 'text-gray-500 italic' : 'text-black'
        }`}
      >
        {cell}
      </span>
    );
  }
  return <CheckCircle2 size={16} strokeWidth={3} className="inline" style={{ color: '#1f6b00' }} />;
}

export default function QStudioPricingThemeparkPage() {
  useEffect(() => {
    document.title = 'QSTUDIO FOR THEMEPARKS — Software Plans | Malaysia';
  }, []);

  return (
    <main className="bg-white min-h-screen text-black antialiased">
      <SEOHead
        title="QSTUDIO FOR THEMEPARKS — Software Plans for Theme Parks, Playlands & Museums | Malaysia"
        description="QStudio software pricing for theme parks, playlands, and museums — Starter, Standard, Pro, Advanced, Enterprise. Compare every feature across tiers. Billed annually, 8% SST applies. Upgrade or downgrade any month."
        keywords="QStudio theme park pricing, playland software pricing malaysia, museum ticketing software, theme park POS, attractions ticketing"
        url="https://qbot.now/qstudio/pricing/themepark"
      />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <header className="relative mb-8 md:mb-10">
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.3em] mb-3" style={{ color: '#1f6b00' }}>
            QStudio · Theme Park · Playland · Museum
          </p>
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-[1.05] text-black">
            QSTUDIO FOR THEMEPARKS
          </h1>
          <p className="mt-3 text-sm md:text-base text-gray-600 max-w-2xl">
            Sell tickets, manage season passes, run attractions and F&amp;B — one system across every gate. Billed annually · 8% SST applies.
          </p>
        </header>

        <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0 pb-2">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-white text-left text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 px-3 py-3 border-b-2 border-black w-[180px] md:w-[220px]">
                  Compare Features
                </th>
                {THEMEPARK_TIERS.map((tier) => (
                  <th
                    key={tier.id}
                    className="text-center align-bottom px-2 py-3 border-b-2 border-black relative bg-white"
                    style={{ minWidth: '110px' }}
                  >
                    {tier.badge && (
                      <div
                        className="absolute -top-1 left-1/2 -translate-x-1/2 inline-flex items-center gap-0.5 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 text-black whitespace-nowrap"
                        style={{ backgroundColor: LIME }}
                      >
                        <Star size={7} strokeWidth={3} /> {tier.badge}
                      </div>
                    )}
                    <div className="text-[11px] md:text-[12px] font-black uppercase leading-tight mb-1 text-black">
                      {tier.title.replace('Park ', '')}
                    </div>
                    {tier.isCustom ? (
                      <div className="text-[12px] font-black mb-2 leading-tight text-black">Price upon Request</div>
                    ) : (
                      <>
                        <div className="text-[18px] md:text-[20px] font-black leading-none mb-0.5 text-black">
                          RM{tier.monthly}
                        </div>
                        <div className="text-[9px] font-mono mb-2 text-gray-500">/mo · billed annually</div>
                      </>
                    )}
                    <a
                      href={WA}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all bg-black text-white hover:opacity-90"
                      style={tier.recommended ? { backgroundColor: LIME, color: '#000' } : undefined}
                    >
                      Get Quote
                    </a>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {THEMEPARK_GROUPS.map((group, gIdx) => (
                <React.Fragment key={gIdx}>
                  <tr>
                    <td
                      colSpan={1 + THEMEPARK_TIERS.length}
                      className="text-[10px] font-black uppercase tracking-[0.15em] text-white px-3 py-1.5"
                      style={{ backgroundColor: '#5eb3a8' }}
                    >
                      {group.title}
                    </td>
                  </tr>
                  {group.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-gray-50">
                      <td className="sticky left-0 bg-white text-[12px] text-gray-800 px-3 py-2 border-b border-gray-100 font-medium">
                        <span className="inline-flex items-center">
                          {row.feature}
                          <FeatureTooltip text={row.tooltip} />
                        </span>
                      </td>
                      {THEMEPARK_TIERS.map((tier) => (
                        <td
                          key={tier.id}
                          className="text-center px-2 py-2 border-b border-gray-100 align-middle"
                        >
                          <CellRender cell={row.cells[tier.level]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Additional outlet note */}
        <div className="mt-6 border-l-4 border-black bg-gray-50 px-4 py-3 text-[12px] md:text-[13px] text-gray-800">
          <span className="font-black uppercase tracking-wider text-[11px] mr-2">Additional Outlet</span>
          RM399 / month per extra outlet — same plan, fully synced across locations.
        </div>

        <div className="mt-8 flex items-center justify-center">
          <a
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-black text-[12px] md:text-[13px] font-black uppercase tracking-wider transition-colors hover:bg-white"
            style={{ backgroundColor: LIME }}
          >
            <MessageCircle size={14} strokeWidth={2.5} />
            Get a Quote on WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
