import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Lock, ArrowRight, Printer, CheckCircle2, AlertTriangle, Target, Wrench,
  ShieldCheck, MapPin, Users, Sparkles,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { FEATURE_GROUPS, isCellIncluded, QUOTE_SOFTWARE_TIERS, type CellValue, type TierLevel } from '../data/quoteStudioCatalog';
import { PROPOSALS } from '../data/proposals';

const LIME = '#CCFF00';
const BAND = '#5eb3a8';
const CHECK = '#1f6b00';
const PASSWORD = 'Malaysia168!';
const GATE_KEY = 'qstudio_proposal_unlocked';

// Tier ladder — used to find the plan immediately below the recommended one.
const TIER_ORDER: TierLevel[] = ['starter', 'standard', 'pro', 'advanced', 'enterprise'];

// "Genuinely available" = included AND actually live today (Coming Soon doesn't count).
const genuinelyIncluded = (cell: CellValue): boolean =>
  isCellIncluded(cell) && String(cell).toLowerCase() !== 'coming soon';

const cellLabel = (feature: string, cell: CellValue): string => {
  if (typeof cell === 'string') {
    if (cell.toLowerCase() === 'coming soon') return `${feature} (coming soon)`;
    if (cell.trim()) return `${feature} (${cell})`;
  }
  return feature;
};

// Build the recommended-tier feature list, flagging every row that the plan
// immediately below it does NOT genuinely include (false OR coming-soon) — i.e.
// the upgrades + roadmap items that justify choosing this tier over the lower one.
function buildPlanFeatures(level: TierLevel) {
  const prev = TIER_ORDER[TIER_ORDER.indexOf(level) - 1] ?? null;
  return FEATURE_GROUPS
    .map(g => ({
      group: g.title,
      items: g.rows
        .filter(r => isCellIncluded(r.cells[level]))
        .map(r => {
          const cell = r.cells[level];
          return {
            label: cellLabel(r.feature, cell),
            soon: typeof cell === 'string' && cell.toLowerCase() === 'coming soon',
            highlight: prev ? !genuinelyIncluded(r.cells[prev]) : false,
          };
        }),
    }))
    .filter(g => g.items.length > 0);
}

// ── Password gate ────────────────────────────────────────────────────────────
function ProposalGate({ brandName, onUnlock }: { brandName: string; onUnlock: () => void }) {
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === PASSWORD) { sessionStorage.setItem(GATE_KEY, '1'); onUnlock(); }
    else setErr('Wrong password.');
  };
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm border-2 p-7" style={{ borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.04)' }}>
        <div className="flex items-center gap-2 mb-5">
          <Lock size={16} strokeWidth={2.5} style={{ color: LIME }} />
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em]" style={{ color: LIME }}>Confidential Proposal</p>
        </div>
        <h1 className="text-[22px] md:text-[26px] font-black uppercase tracking-tight leading-tight mb-1">{brandName}</h1>
        <p className="text-white/70 text-[12px] mb-6">Enter the access code shared by your QStudio consultant to view this proposal.</p>
        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/60 mb-2">Access Code</label>
        <input
          type="password"
          autoFocus
          value={pwd}
          onChange={e => { setPwd(e.target.value); setErr(null); }}
          className="w-full bg-black border-2 border-white/20 focus:border-white/60 focus:outline-none text-white text-[14px] px-3 py-2.5 mb-3"
        />
        {err && <p className="text-red-400 text-[12px] mb-3">{err}</p>}
        <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-black text-[12px] font-black uppercase tracking-wider transition-opacity hover:opacity-90" style={{ backgroundColor: LIME }}>
          View Proposal <ArrowRight size={14} strokeWidth={2.5} />
        </button>
      </form>
    </div>
  );
}

// ── Small building blocks ────────────────────────────────────────────────────
function Band({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-white px-3 py-2 mb-4 avoid-break" style={{ backgroundColor: BAND }}>
      {icon}{children}
    </div>
  );
}

function Bullets({ items, danger }: { items: string[]; danger?: boolean }) {
  return (
    <ul className="space-y-2">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2.5 text-[13px] leading-relaxed text-gray-800">
          {danger
            ? <AlertTriangle size={15} strokeWidth={2.5} className="mt-0.5 flex-shrink-0" style={{ color: '#b91c1c' }} />
            : <CheckCircle2 size={15} strokeWidth={2.5} className="mt-0.5 flex-shrink-0" style={{ color: CHECK }} />}
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] mb-2" style={{ color: LIME }}>QStudio</p>
        <h1 className="text-2xl font-black uppercase tracking-tight">Proposal not found</h1>
        <p className="text-white/60 text-[13px] mt-2">Check the link with your QStudio consultant.</p>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function QuoteStudioProposalPage() {
  const { brand } = useParams<{ brand: string }>();
  const proposal = brand ? PROPOSALS[brand.toLowerCase()] : undefined;

  const [unlocked, setUnlocked] = useState(false);
  useEffect(() => { if (sessionStorage.getItem(GATE_KEY) === '1') setUnlocked(true); }, []);
  useEffect(() => { if (proposal) document.title = `${proposal.brandName} — QStudio Proposal`; }, [proposal]);

  if (!proposal) return <NotFound />;
  if (!unlocked) return <ProposalGate brandName={proposal.brandName} onUnlock={() => setUnlocked(true)} />;

  const tier = QUOTE_SOFTWARE_TIERS.find(t => t.level === proposal.recommendedTier);
  const featureGroups = buildPlanFeatures(proposal.recommendedTier);

  return (
    <main className="bg-gray-100 min-h-screen text-black antialiased">
      <SEOHead
        title={`${proposal.brandName} — QStudio Proposal`}
        description="Confidential QStudio proposal."
        url={`https://qbot.now/quotesys/quotestudio/proposal/${proposal.slug}`}
        noindex
      />
      <style>{`
        @media print {
          @page { size: A4; margin: 12mm; }
          .no-print { display: none !important; }
          .proposal-sheet { max-width: none !important; margin: 0 !important; border: 0 !important; box-shadow: none !important; }
          .avoid-break { break-inside: avoid; }
          body { background: #fff !important; }
        }
        .proposal-print, .proposal-print * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      `}</style>

      {/* Toolbar (screen only) */}
      <div className="no-print sticky top-0 z-40 bg-white border-b-2 border-black px-5 py-3 flex items-center justify-between gap-4">
        <div className="text-[12px] text-gray-500">Confidential · prepared for <strong className="text-black">{proposal.brandName}</strong></div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 bg-black text-white font-black uppercase tracking-wider text-[12px] px-4 py-2.5 hover:opacity-90"
        >
          <Printer size={15} strokeWidth={2.5} /> Export as PDF
        </button>
      </div>

      <div className="proposal-print proposal-sheet max-w-4xl mx-auto my-6 bg-white border border-gray-200 shadow-[0_10px_40px_rgba(0,0,0,0.08)] px-7 md:px-12 py-10 md:py-12">

        {/* Cover */}
        <header className="border-b-2 border-black pb-7 mb-8">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <div className="text-[30px] font-black tracking-tight leading-none">QStudio<span style={{ color: CHECK }}>.</span></div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-gray-500 mt-2">Partnership Proposal</div>
            </div>
            <div className="inline-block text-[11px] font-black uppercase tracking-[0.06em] text-black px-3 py-2" style={{ backgroundColor: LIME }}>
              Confidential
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-[1.05] mt-7">
            Prepared for {proposal.brandName}
          </h1>

          <div className="grid sm:grid-cols-3 gap-4 mt-6 text-[12.5px]">
            <div className="flex gap-2"><Users size={15} className="mt-0.5 flex-shrink-0 text-gray-400" /><div><div className="text-[10px] font-mono uppercase tracking-wider text-gray-400">PIC</div>{proposal.pics.join(', ')}</div></div>
            <div className="flex gap-2 sm:col-span-2"><MapPin size={15} className="mt-0.5 flex-shrink-0 text-gray-400" /><div><div className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Location</div>{proposal.address}</div></div>
          </div>
          <div className="text-[11px] font-mono text-gray-400 mt-4">Issued {proposal.date}</div>
        </header>

        {/* Mission */}
        <section className="mb-9 avoid-break">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} style={{ color: CHECK }} />
            <span className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-500">Our Mission</span>
          </div>
          <p className="text-[16px] md:text-[18px] leading-relaxed font-medium text-black border-l-4 pl-4" style={{ borderColor: LIME }}>
            {proposal.mission}
          </p>
        </section>

        {/* Intro */}
        <section className="mb-9">
          <Band>About QStudio</Band>
          <p className="text-[13.5px] leading-relaxed text-gray-800">{proposal.intro}</p>
        </section>

        {/* Recap */}
        <section className="mb-9">
          <Band>Meeting Recap</Band>
          <p className="text-[13.5px] leading-relaxed text-gray-800">{proposal.recap}</p>
        </section>

        {/* Issues */}
        <section className="mb-9 avoid-break">
          <Band icon={<AlertTriangle size={14} strokeWidth={2.5} />}>Current Issues &amp; Major Concerns</Band>
          <Bullets items={proposal.issues} danger />
        </section>

        {/* Goals */}
        <section className="mb-9 avoid-break">
          <Band icon={<Target size={14} strokeWidth={2.5} />}>Goals To Achieve</Band>
          <Bullets items={proposal.goals} />
        </section>

        {/* Current setup */}
        <section className="mb-9 avoid-break">
          <Band icon={<ShieldCheck size={14} strokeWidth={2.5} />}>Current Setup</Band>
          <Bullets items={proposal.currentSetup} />
        </section>

        {/* Requirements */}
        <section className="mb-9">
          <Band icon={<Wrench size={14} strokeWidth={2.5} />}>System Requirements</Band>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
            {proposal.requirements.map((req, i) => (
              <div key={i} className="avoid-break">
                <div className="text-[12px] font-black uppercase tracking-wider text-black mb-2.5 pb-1.5 border-b border-gray-200">{req.title}</div>
                <Bullets items={req.items} />
              </div>
            ))}
          </div>
        </section>

        {/* Recommended plan */}
        <section className="mb-9">
          <Band icon={<CheckCircle2 size={14} strokeWidth={2.5} />}>Recommended Plan</Band>
          <div className="border-2 border-black avoid-break">
            <div className="flex items-end justify-between gap-4 flex-wrap px-5 py-4 bg-black text-white">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/60">QStudio Software</div>
                <div className="text-[20px] font-black uppercase tracking-tight">{tier?.title ?? 'Studio Advanced'}</div>
              </div>
              <div className="text-right">
                <div className="text-[26px] font-black leading-none">RM{tier?.monthly ?? 699}</div>
                <div className="text-[10px] font-mono text-white/60 mt-1">/mo · billed annually · excl. 8% SST</div>
              </div>
            </div>
            <div className="px-5 py-5">
              <div className="text-[11px] text-gray-600 mb-4 flex items-center gap-2 flex-wrap">
                <span className="text-gray-500">Everything included in the Advanced plan.</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 border border-black/10" style={{ backgroundColor: 'rgba(204,255,0,0.6)' }} />
                  <span><strong className="text-black">Highlighted</strong> = beyond the Pro plan — the upgrades &amp; roadmap items {proposal.brandName} needs.</span>
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                {featureGroups.map((g, gi) => (
                  <div key={gi} className="avoid-break">
                    <div className="text-[11px] font-black uppercase tracking-[0.12em] mb-2" style={{ color: CHECK }}>{g.group}</div>
                    <ul className="space-y-1.5">
                      {g.items.map((item, ii) => (
                        <li key={ii} className={`flex gap-2 text-[12.5px] leading-snug ${
                          item.highlight ? 'text-black font-bold' : item.soon ? 'text-gray-400 italic' : 'text-gray-800'
                        }`}>
                          <CheckCircle2 size={13} strokeWidth={2.5} className="mt-0.5 flex-shrink-0" style={{ color: item.highlight || !item.soon ? CHECK : '#9ca3af' }} />
                          <span
                            className={item.highlight ? 'px-1 -mx-0.5' : ''}
                            style={item.highlight ? { backgroundColor: 'rgba(204,255,0,0.55)', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' } : undefined}
                          >
                            {item.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-gray-200 flex gap-2.5 text-[12px] leading-relaxed text-gray-700 avoid-break" style={{ backgroundColor: 'rgba(204,255,0,0.10)', padding: '12px', marginLeft: '-4px', marginRight: '-4px', borderTop: `2px solid ${LIME}` }}>
                <AlertTriangle size={15} strokeWidth={2.5} className="mt-0.5 flex-shrink-0 text-black" />
                <span>
                  <strong className="text-black">Please note:</strong> some features above are <strong>not free with the plan</strong>.
                  Selected modules may carry one-time <strong>activation fees</strong> and ongoing <strong>usage fees</strong> (token-based — e.g. Email
                  &amp; WhatsApp blasts are charged per send). Hardware, the Branded App, and customizations are quoted and billed separately from the plan subscription.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Launch plan */}
        <section className="mb-4">
          <Band icon={<Target size={14} strokeWidth={2.5} />}>Launch Plan &amp; Roadmap</Band>
          <div className="text-[13.5px] font-bold text-black border-l-4 pl-4 mb-6" style={{ borderColor: LIME }}>
            {proposal.signupNote}
          </div>
          <div className="space-y-4">
            {proposal.phases.map((p, i) => (
              <div key={i} className="flex gap-4 border border-gray-200 p-4 avoid-break">
                <div className="flex-shrink-0 w-[88px]">
                  <div className="text-[11px] font-black uppercase tracking-wider text-black px-2 py-1 text-center" style={{ backgroundColor: LIME }}>{p.name}</div>
                  <div className="text-[11px] font-mono text-gray-500 text-center mt-1.5">{p.date}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-black text-black uppercase tracking-tight">{p.title}</div>
                  <div className="text-[13px] text-gray-700 mt-1 leading-relaxed">{p.desc}</div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Est. budget</div>
                  <div className="text-[17px] font-black text-black leading-none mt-0.5">{p.budget}</div>
                  {p.note && <div className="text-[10px] text-gray-500 mt-1">{p.note}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Future success */}
        <section className="mb-4">
          <Band icon={<Sparkles size={14} strokeWidth={2.5} />}>Future Success</Band>
          <p className="text-[13px] text-gray-600 mb-5">
            Premium, high-class ideas QStudio can make possible for {proposal.brandName} — the experiences that set a flagship gym apart.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {proposal.futureIdeas.map((idea, i) => (
              <div key={i} className="border border-gray-200 p-3.5 avoid-break">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 text-[12px] font-black text-black" style={{ backgroundColor: LIME }}>
                    {i + 1}
                  </div>
                  <div className="text-[13.5px] font-black uppercase tracking-tight text-black leading-tight">{idea.title}</div>
                </div>
                <div className="text-[12.5px] text-gray-700 leading-relaxed">{idea.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 pt-5 border-t border-gray-200 text-[11px] text-gray-500 leading-relaxed">
          <strong className="text-black">QStudio</strong> — all-in-one studio &amp; wellness management. This proposal is confidential and prepared exclusively for {proposal.brandName}.
          Budgets are estimates and subject to a final scope of work. All prices in RM, excl. 8% SST.
        </footer>
      </div>
    </main>
  );
}
