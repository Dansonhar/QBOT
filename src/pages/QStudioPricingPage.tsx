import { useEffect } from 'react';
import React from 'react';
import { CheckCircle2, HelpCircle, MessageCircle, Star, X as XIcon } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import {
  QUOTE_SOFTWARE_TIERS,
  FEATURE_GROUPS,
  isCellIncluded,
  type CellValue,
} from '../data/quoteStudioCatalog';

const LIME = '#CCFF00';
const WA = `https://wa.me/60126909189?text=${encodeURIComponent(
  "Hi QStudio! I'd like a quote for your software plan. Please share details.",
)}`;

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

export default function QStudioPricingPage() {
  useEffect(() => {
    document.title = 'QStudio Pricing — Software Plans | Malaysia';
  }, []);

  return (
    <main className="bg-white min-h-screen text-black antialiased">
      <SEOHead
        title="QStudio Pricing — Software Plans for Studios & Gyms | Malaysia"
        description="QStudio software pricing — Standard, Pro, Advanced, Enterprise. Compare every feature across tiers. Billed annually, 8% SST applies. Upgrade or downgrade any month."
        keywords="QStudio pricing, studio software pricing malaysia, gym software pricing, qstudio plans, qstudio software fees"
        url="https://qbot.now/qstudio/pricing"
      />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <header className="relative mb-8 md:mb-10 pr-32 md:pr-40">
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.3em] mb-3" style={{ color: '#1f6b00' }}>
            QStudio · Software Plans
          </p>
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-[1.05] text-black">
            Pricing
          </h1>
          <p className="mt-3 text-sm md:text-base text-gray-600 max-w-2xl">
            Compare every feature across tiers. Billed annually · 8% SST applies · Upgrade or downgrade any month.
          </p>

          {/* Introduction Promo stamp */}
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 -rotate-[8deg] pointer-events-none select-none"
            style={{ transformOrigin: 'top right' }}
          >
            <div className="inline-flex flex-col items-center px-3 md:px-4 py-1.5 md:py-2 border-[3px] border-red-600 text-red-600 bg-white/60 backdrop-blur-[2px]">
              <span className="text-[8px] md:text-[9px] font-mono font-black uppercase tracking-[0.25em] leading-tight">Introduction</span>
              <span className="text-[14px] md:text-[18px] font-black uppercase tracking-[0.12em] leading-none mt-0.5">Promo</span>
            </div>
          </div>
        </header>

        <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0 pb-2">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-white text-left text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 px-3 py-3 border-b-2 border-black w-[180px] md:w-[220px]">
                  Compare Features
                </th>
                {QUOTE_SOFTWARE_TIERS.map((tier) => (
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
                      {tier.title.replace('Studio ', '')}
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
              {FEATURE_GROUPS.map((group, gIdx) => (
                <React.Fragment key={gIdx}>
                  <tr>
                    <td
                      colSpan={1 + QUOTE_SOFTWARE_TIERS.length}
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
                        {row.subtitle && (
                          <div className="text-[10px] font-mono text-gray-500 mt-0.5">
                            {row.subtitle}
                          </div>
                        )}
                      </td>
                      {QUOTE_SOFTWARE_TIERS.map((tier) => (
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
