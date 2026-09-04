import { useState } from 'react';
import { ArrowRight, ArrowLeft, MessageCircle, Check, Plus, Minus, ShieldCheck, Server, X, DoorOpen, Camera, Fence } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const LIME = '#CCFF00';

const PRICING_FAQS = [
  { q: 'What counts as an "active member"?', a: 'Anyone on a paid plan or credit pack at any point during the month — even if they freeze mid-month. Active anytime = counted. Only fully cancelled members and 14-day trial members don\'t count.' },
  { q: 'What if my member count changes month to month?', a: 'The base plan is charged upfront (every 4 months on the monthly plan, or annually on the annual plan). Any extra active members above the included tier are billed monthly on top and added to your next bill. A member who froze on the 15th still counts for that month because they were active during it.' },
  { q: 'Is there a contract?', a: 'No lock-in. The monthly plan is billed every 4 months — you commit one 4-month block at a time. Additional active members are billed monthly on top. Or lock in annual upfront to enjoy a special monthly rate and bigger savings.' },
  { q: 'What happens when I grow past the base tier?', a: 'You only pay for the extra active members above the included count, at RM 2/member/mth. WhatsApp us for volume pricing once you cross 1,000 members.' },
  { q: 'Can I add Sentry Mode later?', a: 'Yes — add or remove anytime. Billed prorated for the month you activate.' },
  { q: 'What if I have 1,000+ members?', a: "Drop us a WhatsApp — we'll build a custom quote with volume pricing." },
  { q: 'Is there a free trial?', a: 'We offer a live demo at our Publika KL showroom. See Sentry Mode catching unknown faces in real-time before you commit.' },
  { q: 'What\'s the setup fee?', a: 'RM 1,500 one-time on the monthly plan — covers face enrolment, staff training, member data import, outlet configuration. Waived or reduced on annual commitments in most cases.' },
];

const ALL_FEATURES = [
  'Face ID Check-In', 'QR Member Card', 'Walk-In Intake', 'Queue Management',
  'Live Availability Board', 'Face ID Staff Auth', '1-on-1 Appointments', 'Class Booking with Capacity',
  'Seat-Reserved Classes', 'Room Bookings', 'Auto-Waitlist', 'Session Calendar',
  'Auto-Accept Bookings', 'Flexible Membership Plans', 'Credit-Based System', 'Auto-Renewal & Billing',
  'Membership Freeze/Cancel', 'Counter POS', 'In-App Checkout', 'Web Booking & Purchase',
  'Digital Receipts', 'Reward Point Redemption', 'Staff Profiles', 'KPI Dashboard',
  'Top Performer Rankings', 'Commission Engine (% or flat)', 'Commission Status Tracking', 'Points Earning',
  'Bonus Campaigns', 'Reward Catalogue', 'Referral Tracking', 'Customer Segmentation',
  'Lifetime Value Tracking', 'Birthday & Anniversary Triggers', 'Push Notifications', 'Promo Banner Slider',
  'Daily Sales Dashboard', 'Filtered Reports', 'Revenue Trends', 'Commission Summaries',
  'Role-Based Access', 'Audit Trail', 'Unlimited Staff Accounts', 'Unlimited Bookings',
  'Unlimited Transactions', 'Kitchen/Cafe Integration', 'Transformation Gallery', 'Own Web App (for Staff)',
  'Own Web App (for Member)', 'Own Webstore',
];

function ContinueButton({ onClick, label }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick}
      className="mt-5 md:mt-6 inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 text-black text-[11px] md:text-[12px] font-black uppercase tracking-wider transition-colors hover:bg-white"
      style={{ backgroundColor: LIME }}>
      {label || 'Continue'} <ArrowRight size={14} strokeWidth={2.5} />
    </button>
  );
}

function StepShell({ num, title, subtitle, visible, children }: { num: number; title: string; subtitle?: string; visible: boolean; children: React.ReactNode }) {
  if (!visible) return null;
  return (
    <section id={`step-${num}`} className="mb-10 md:mb-14 scroll-mt-20" style={{ animation: 'qfit-reveal 0.4s ease-out' }}>
      <div className="flex items-center gap-3 mb-2">
        <span className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-[11px] md:text-[12px] font-mono font-black text-black" style={{ backgroundColor: LIME }}>
          {String(num).padStart(2, '0')}
        </span>
        <h2 className="text-[15px] md:text-[20px] font-black uppercase tracking-tight text-white">{title}</h2>
      </div>
      {subtitle && <p className="text-white/60 text-[12px] md:text-[14px] leading-relaxed mb-5 md:mb-6 pl-10 md:pl-11">{subtitle}</p>}
      <div className="md:pl-11">
        {children}
      </div>
    </section>
  );
}

export default function QFitQuotePage() {

  const [step, setStep] = useState(1);
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [members, setMembers] = useState(150);
  const [outlets, setOutlets] = useState(1);
  const [entryMethod, setEntryMethod] = useState<'auto-swing' | 'door-gate' | null>(null);
  const [hasExisting, setHasExisting] = useState(false);
  const [doorlockQty, setDoorlockQty] = useState(0);
  const [gateLanes, setGateLanes] = useState(0);
  const [sentryCams, setSentryCams] = useState(0);
  const [hardwareTouched, setHardwareTouched] = useState(false);
  const [sentry, setSentry] = useState<boolean | null>(null);
  const [pserver, setPserver] = useState<boolean | null>(null);
  const [installment, setInstallment] = useState<0 | 6 | 12 | 24>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [featuresRevealed, setFeaturesRevealed] = useState(false);
  const [membersTouched, setMembersTouched] = useState(false);
  const [outletsTouched, setOutletsTouched] = useState(false);

  const advance = (to: number) => {
    setStep(s => Math.max(s, to));
    setTimeout(() => {
      const el = document.getElementById(`step-${to}`) || document.getElementById('quote-summary');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const isAnnual = billing === 'annual';
  const basePlatform = Math.max(399, members * 2);
  const annualDiscountPerMo = isAnnual ? 100 : 0;
  const platformCost = basePlatform - annualDiscountPerMo;
  const sentryOn = sentry === true;
  const sentryCost = sentryOn ? 300 : 0;
  const extraOutlets = Math.max(0, outlets - 1);
  const outletCost = extraOutlets * 129;
  const pserverOn = pserver === true;
  const customQuote = members >= 1000;
  const membersLabel = customQuote ? '1,000+' : members.toLocaleString();
  const monthlyPreDiscount = basePlatform + sentryCost + outletCost;
  const total = platformCost + sentryCost + outletCost;
  const annualUpfront = total * 12;
  const annualSavings = annualDiscountPerMo * 12; // 1200

  const entryLabel = entryMethod === 'auto-swing' ? 'Auto Swing Gate + Face ID'
    : entryMethod === 'door-gate' ? 'Door Gate + Face ID'
    : 'Not selected';

  const doorlockCost = doorlockQty * 2000;
  const gateCost = gateLanes * 12000;
  const camCost = sentryCams * 350;
  const hardwareSubtotal = doorlockCost + gateCost + camCost;
  const hardwareTotal = hardwareSubtotal; // legacy alias (for existing refs)
  const hasHardware = hardwareSubtotal > 0;
  const deliveryFee = hasHardware ? 300 : 0;
  const hardwareGrandTotal = hardwareSubtotal + deliveryFee;
  const installmentMonthly = installment > 0 ? Math.ceil(hardwareGrandTotal / installment) : 0;

  const hardwareLines: string[] = [];
  if (doorlockQty > 0) hardwareLines.push(`Doorlock × ${doorlockQty} = RM ${doorlockCost.toLocaleString()}`);
  if (gateLanes > 0) hardwareLines.push(`Entry Gate × ${gateLanes} lane${gateLanes > 1 ? 's' : ''} = RM ${gateCost.toLocaleString()}`);
  if (sentryCams > 0) hardwareLines.push(`Sentry Camera × ${sentryCams} = RM ${camCost.toLocaleString()}`);

  const configLines = [
    `Billing: ${isAnnual ? 'Annual (RM 1,200 off — RM 100/mo saved)' : 'Monthly (billed every 4 months)'}`,
    `Active members: ${membersLabel}`,
    `Outlets: ${outlets}${extraOutlets > 0 ? ` (${extraOutlets} extra × RM 129/mo)` : ' (included)'}`,
    `Entry method: ${entryLabel}${hasExisting ? ' (already has existing gate)' : ''}`,
    hardwareLines.length > 0
      ? `Hardware (one-time): ${hardwareLines.join(' | ')} | Subtotal RM ${hardwareSubtotal.toLocaleString()} + Delivery RM 300 = RM ${hardwareGrandTotal.toLocaleString()}`
      : `Hardware (one-time): None`,
    hasHardware
      ? `Payment plan: ${installment === 0 ? 'Full payment' : `${installment} mo × RM ${installmentMonthly.toLocaleString()} (0% interest · Maybank / CIMB)`}`
      : null,
    `Platform cost: RM ${platformCost.toLocaleString()}/mo`,
    `Sentry Mode: ${sentryOn ? 'Yes (+ RM 300/mo)' : 'No'}`,
    `Private Server: ${pserverOn ? 'Yes (quote separately)' : 'No'}`,
    customQuote
      ? `Estimated monthly: Let's talk — custom volume quote`
      : `Estimated monthly: RM ${total.toLocaleString()}`,
    !customQuote && isAnnual
      ? `Annual upfront: RM ${annualUpfront.toLocaleString()} (saved RM ${annualSavings.toLocaleString()})`
      : null,
  ].filter(Boolean).join('\n- ');

  const waLink = 'https://wa.me/60126909189?text=' + encodeURIComponent(
    `Hi! I'd like to lock in this QFit quote:\n\n- ${configLines}\n\nLet's set up.`
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#CCFF00] selection:text-black overflow-x-hidden">
      <SEOHead
        title="QFit — Private Quote Builder"
        description="Configure your QFit setup — members, outlets, entry method, hardware, add-ons — and send the quote to WhatsApp in seconds."
        keywords="QFit quote, QFit pricing, gym management pricing Malaysia"
        image="https://qbot.now/qfitimg/qfit1.jpg"
        imageAlt="QFit — Private Quote Configurator"
        url="https://qbot.now/qfit/quote"
        noindex
      />
      {/* ─── Top bar ─── */}
      <header className="border-b border-white/10 bg-black/95 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <a href="/qfit" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <ArrowLeft size={14} strokeWidth={2.5} />
            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider">Back to QFit</span>
          </a>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: LIME }} />
            <span className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.2em]" style={{ color: LIME }}>Private Quote</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-16">

        {/* ─── Hero ─── */}
        <section className="mb-8 md:mb-10">
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.3em] mb-3" style={{ color: LIME }}>
            Build Your Quote
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.9] mb-4">
            <span style={{ color: LIME }}>Flexible</span> Pricing
          </h1>
        </section>

        {/* ─── STEP 01 — Features ─── */}
        <StepShell num={1} title="Pick the features you want"
          subtitle={featuresRevealed
            ? "✓ Every feature below is included — in every plan, from day one."
            : "Go on, try to pick the ones you need. Tap any feature."}
          visible={true}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-1.5 md:gap-y-2 border-t-2 border-b-2 border-white/15 py-4 md:py-5">
            {ALL_FEATURES.map((f, i) => (
              <button key={i}
                onClick={() => {
                  if (featuresRevealed) return;
                  setFeaturesRevealed(true);
                }}
                className="flex items-center gap-2 min-w-0 text-left cursor-pointer group">
                <span
                  className={`w-3.5 h-3.5 flex-shrink-0 border-2 flex items-center justify-center transition-all duration-300 ${featuresRevealed ? '' : 'border-white/30 group-hover:border-white/70'}`}
                  style={{
                    ...(featuresRevealed ? { borderColor: LIME, backgroundColor: LIME } : {}),
                    transitionDelay: featuresRevealed ? `${Math.min(i * 15, 600)}ms` : '0ms',
                  }}
                >
                  {featuresRevealed && <Check size={9} strokeWidth={3} className="text-black" />}
                </span>
                <span className="text-white text-[11px] md:text-[12px] truncate">{f}</span>
              </button>
            ))}
          </div>

          {featuresRevealed ? (
            <div className="mt-4 md:mt-5 border-2 p-4 md:p-5" style={{ borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)', animation: 'qfit-reveal 0.35s ease-out' }}>
              <div className="flex items-start gap-3">
                <Check size={18} strokeWidth={3} className="flex-shrink-0 mt-0.5" style={{ color: LIME }} />
                <div>
                  <p className="text-white text-[13px] md:text-[16px] font-black uppercase tracking-tight mb-1.5">
                    All of it. <span style={{ color: LIME }}>Included.</span>
                  </p>
                  <p className="text-white/80 text-[12px] md:text-[14px] leading-relaxed">
                    No pro tier, no upsells, no surprise gates. Every QFit account gets the full stack — we win when you grow.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-white/45 text-[11px] md:text-[12px] italic mt-3">
              Tap any feature above — you'll see something 👆
            </p>
          )}

          {step === 1 && featuresRevealed && (
            <div className="flex justify-end mt-5 md:mt-6">
              <button onClick={() => advance(2)}
                className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 text-black text-[11px] md:text-[12px] font-black uppercase tracking-wider transition-colors hover:bg-white"
                style={{ backgroundColor: LIME }}>
                Continue <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </StepShell>

        {/* ─── STEP 02 — Active members ─── */}
        <StepShell num={2} title="How many active members?"
          subtitle="An active member = anyone on a paid plan or credit pack this month. Drag the slider to match your gym."
          visible={step >= 2}>
          <div className="border-2 p-5 md:p-7" style={{ borderColor: LIME }}>
            <div className="flex items-baseline justify-between mb-3">
              <label className="text-[11px] md:text-[13px] font-bold uppercase tracking-wider text-white">Active members</label>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono font-black text-[22px] md:text-[28px]" style={{ color: LIME }}>{membersLabel}</span>
                <span className="text-white/50 text-[10px] md:text-[11px] font-mono uppercase tracking-wider">members</span>
              </div>
            </div>
            <input type="range" min={0} max={1000} step={10}
              value={members}
              onChange={e => { setMembers(parseInt(e.target.value, 10)); setMembersTouched(true); }}
              className="w-full h-2 bg-white/10 appearance-none cursor-pointer"
              style={{ accentColor: LIME }} />
            <div className="flex justify-between text-[10px] text-white/40 font-mono mt-1.5">
              <span>0</span><span>250</span><span>500</span><span>750</span><span>1,000+</span>
            </div>
          </div>
          {step === 2 && membersTouched && (
            <div className="flex justify-end mt-5 md:mt-6">
              <button onClick={() => advance(3)}
                className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 text-black text-[11px] md:text-[12px] font-black uppercase tracking-wider transition-colors hover:bg-white"
                style={{ backgroundColor: LIME }}>
                Continue <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </StepShell>

        {/* ─── STEP 03 — Outlets ─── */}
        <StepShell num={3} title="How many outlets?"
          subtitle="Your first outlet is included. Each extra outlet gets its own Face ID hardware, staff, memberships, and reports — all under one dashboard."
          visible={step >= 3}>
          <div className="border-2 border-white/15 p-5 md:p-7">
            <div className="flex items-center justify-between gap-5">
              <div>
                <p className="text-[11px] md:text-[13px] font-bold uppercase tracking-wider text-white mb-1">Number of outlets</p>
                <p className="text-white/60 text-[11px] md:text-[12px]">1 outlet included · add more anytime</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => { setOutlets(v => Math.max(1, v - 1)); setOutletsTouched(true); }}
                  className="w-9 h-9 border-2 border-white/20 hover:border-white/60 flex items-center justify-center transition-colors"
                  aria-label="Decrease outlets">
                  <Minus size={14} strokeWidth={2.5} className="text-white" />
                </button>
                <span className="text-[22px] md:text-[26px] font-black font-mono w-10 text-center" style={{ color: LIME }}>{outlets}</span>
                <button onClick={() => { setOutlets(v => Math.min(20, v + 1)); setOutletsTouched(true); }}
                  className="w-9 h-9 border-2 border-white/20 hover:border-white/60 flex items-center justify-center transition-colors"
                  aria-label="Increase outlets">
                  <Plus size={14} strokeWidth={2.5} className="text-white" />
                </button>
              </div>
            </div>
          </div>
          {step === 3 && outletsTouched && (
            <div className="flex justify-end mt-5 md:mt-6">
              <button onClick={() => advance(4)}
                className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 text-black text-[11px] md:text-[12px] font-black uppercase tracking-wider transition-colors hover:bg-white"
                style={{ backgroundColor: LIME }}>
                Continue <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </StepShell>

        {/* ─── STEP 04 — Entry Method ─── */}
        <StepShell num={4} title="Select desired entry method"
          subtitle="How will members enter your premises? Face ID scans their face and opens the gate — no cards, no buddy passes."
          visible={step >= 4}>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-5">
            <button onClick={() => setEntryMethod('auto-swing')}
              className={`border-2 p-5 md:p-6 text-left transition-colors ${entryMethod === 'auto-swing' ? '' : 'border-white/15 hover:border-white/40'}`}
              style={entryMethod === 'auto-swing' ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)' } : {}}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${entryMethod === 'auto-swing' ? '' : 'border-white/30'}`}
                  style={entryMethod === 'auto-swing' ? { borderColor: LIME } : {}}>
                  {entryMethod === 'auto-swing' && <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: LIME }} />}
                </div>
                <span className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.15em]" style={{ color: LIME }}>Option A</span>
              </div>
              <p className="text-white text-[14px] md:text-[16px] font-black uppercase tracking-tight mb-1.5">Auto Swing Gate</p>
              <p className="text-white/70 text-[11px] md:text-[12px] leading-relaxed">+ Face ID. Full auto — gate swings open after a successful scan. Best for high-traffic entrances.</p>
            </button>

            <button onClick={() => setEntryMethod('door-gate')}
              className={`border-2 p-5 md:p-6 text-left transition-colors ${entryMethod === 'door-gate' ? '' : 'border-white/15 hover:border-white/40'}`}
              style={entryMethod === 'door-gate' ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)' } : {}}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${entryMethod === 'door-gate' ? '' : 'border-white/30'}`}
                  style={entryMethod === 'door-gate' ? { borderColor: LIME } : {}}>
                  {entryMethod === 'door-gate' && <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: LIME }} />}
                </div>
                <span className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.15em]" style={{ color: LIME }}>Option B</span>
              </div>
              <p className="text-white text-[14px] md:text-[16px] font-black uppercase tracking-tight mb-1.5">Door Gate</p>
              <p className="text-white/70 text-[11px] md:text-[12px] leading-relaxed">+ Face ID. Standard door unlocks on scan — ideal for smaller studios and back-of-house access.</p>
            </button>
          </div>

          {/* Optional checkbox */}
          <label className="flex items-start gap-3 p-4 md:p-5 border-2 border-white/10 hover:border-white/25 cursor-pointer transition-colors">
            <span
              className={`flex-shrink-0 mt-0.5 w-5 h-5 border-2 flex items-center justify-center transition-all ${hasExisting ? '' : 'border-white/30'}`}
              style={hasExisting ? { borderColor: LIME, backgroundColor: LIME } : {}}
            >
              {hasExisting && <Check size={12} strokeWidth={3} className="text-black" />}
            </span>
            <input type="checkbox" className="sr-only" checked={hasExisting} onChange={() => setHasExisting(v => !v)} />
            <div>
              <p className="text-white text-[12px] md:text-[13px] font-bold leading-snug">
                I already have an auto swing gate or door gate
              </p>
              <p className="text-white/55 text-[11px] md:text-[12px] leading-relaxed mt-0.5">
                With or without Face ID — we'll see if we can retrofit yours and save you hardware costs.
              </p>
            </div>
          </label>

          {step === 4 && entryMethod && (
            <div className="flex justify-end mt-5 md:mt-6">
              <button onClick={() => advance(5)}
                className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 text-black text-[11px] md:text-[12px] font-black uppercase tracking-wider transition-colors hover:bg-white"
                style={{ backgroundColor: LIME }}>
                Continue <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </StepShell>

        {/* ─── STEP 05 — Add-on Hardware ─── */}
        <StepShell num={5} title="Add-on hardware"
          subtitle="One-time hardware you'd like us to supply and install. Adjust the quantity for each — or leave everything at 0."
          visible={step >= 5}>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-5">

            {/* Doorlock */}
            <div className={`border-2 p-5 transition-colors ${doorlockQty > 0 ? '' : 'border-white/15 bg-white/[0.02]'}`}
              style={doorlockQty > 0 ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)' } : {}}>
              <DoorOpen size={20} strokeWidth={2} style={{ color: LIME }} className="mb-3" />
              <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.15em] text-white mb-1">Doorlock + Face ID</p>
              <p className="text-[20px] md:text-[22px] font-black mb-1" style={{ color: LIME }}>
                RM 2,000<span className="text-[11px] md:text-[12px] text-white/50 font-bold ml-1">/unit</span>
              </p>
              <p className="text-white/70 text-[11px] md:text-[12px] leading-relaxed mb-4">
                Replace your existing door lock with a Face ID unit. Works standalone.
              </p>
              <div className="flex items-center justify-between">
                <button onClick={() => { setDoorlockQty(v => Math.max(0, v - 1)); setHardwareTouched(true); }}
                  className="w-8 h-8 border-2 border-white/20 hover:border-white/60 flex items-center justify-center transition-colors"
                  aria-label="Decrease doorlocks">
                  <Minus size={12} strokeWidth={2.5} className="text-white" />
                </button>
                <span className="text-[20px] md:text-[22px] font-black font-mono" style={{ color: LIME }}>{doorlockQty}</span>
                <button onClick={() => { setDoorlockQty(v => Math.min(20, v + 1)); setHardwareTouched(true); }}
                  className="w-8 h-8 border-2 border-white/20 hover:border-white/60 flex items-center justify-center transition-colors"
                  aria-label="Increase doorlocks">
                  <Plus size={12} strokeWidth={2.5} className="text-white" />
                </button>
              </div>
            </div>

            {/* Entry Gate */}
            <div className={`border-2 p-5 transition-colors ${gateLanes > 0 ? '' : 'border-white/15 bg-white/[0.02]'}`}
              style={gateLanes > 0 ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)' } : {}}>
              <Fence size={20} strokeWidth={2} style={{ color: LIME }} className="mb-3" />
              <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.15em] text-white mb-1">Entry Gate + Face ID</p>
              <p className="text-[20px] md:text-[22px] font-black mb-1" style={{ color: LIME }}>
                RM 12,000<span className="text-[11px] md:text-[12px] text-white/50 font-bold ml-1">/lane</span>
              </p>
              <p className="text-white/70 text-[11px] md:text-[12px] leading-relaxed mb-4">
                Turnstile-style lane with Face ID. <span className="text-white/90">1 in + 1 out = 2 lanes = RM 24,000.</span>
              </p>
              <div className="flex items-center justify-between">
                <button onClick={() => { setGateLanes(v => Math.max(0, v - 1)); setHardwareTouched(true); }}
                  className="w-8 h-8 border-2 border-white/20 hover:border-white/60 flex items-center justify-center transition-colors"
                  aria-label="Decrease gate lanes">
                  <Minus size={12} strokeWidth={2.5} className="text-white" />
                </button>
                <span className="text-[20px] md:text-[22px] font-black font-mono" style={{ color: LIME }}>{gateLanes}</span>
                <button onClick={() => { setGateLanes(v => Math.min(10, v + 1)); setHardwareTouched(true); }}
                  className="w-8 h-8 border-2 border-white/20 hover:border-white/60 flex items-center justify-center transition-colors"
                  aria-label="Increase gate lanes">
                  <Plus size={12} strokeWidth={2.5} className="text-white" />
                </button>
              </div>
            </div>

            {/* Sentry Camera */}
            <div className={`border-2 p-5 transition-colors ${sentryCams > 0 ? '' : 'border-white/15 bg-white/[0.02]'}`}
              style={sentryCams > 0 ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)' } : {}}>
              <Camera size={20} strokeWidth={2} style={{ color: LIME }} className="mb-3" />
              <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.15em] text-white mb-1">Sentry Camera</p>
              <p className="text-[20px] md:text-[22px] font-black mb-1" style={{ color: LIME }}>
                RM 350<span className="text-[11px] md:text-[12px] text-white/50 font-bold ml-1">/ea</span>
              </p>
              <p className="text-white/70 text-[11px] md:text-[12px] leading-relaxed mb-4">
                IP camera for Sentry Mode coverage. Add for extra angles or zones.
              </p>
              <div className="flex items-center justify-between">
                <button onClick={() => { setSentryCams(v => Math.max(0, v - 1)); setHardwareTouched(true); }}
                  className="w-8 h-8 border-2 border-white/20 hover:border-white/60 flex items-center justify-center transition-colors"
                  aria-label="Decrease sentry cameras">
                  <Minus size={12} strokeWidth={2.5} className="text-white" />
                </button>
                <span className="text-[20px] md:text-[22px] font-black font-mono" style={{ color: LIME }}>{sentryCams}</span>
                <button onClick={() => { setSentryCams(v => Math.min(30, v + 1)); setHardwareTouched(true); }}
                  className="w-8 h-8 border-2 border-white/20 hover:border-white/60 flex items-center justify-center transition-colors"
                  aria-label="Increase sentry cameras">
                  <Plus size={12} strokeWidth={2.5} className="text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Footnotes */}
          <div className="border-2 border-white/10 p-4 md:p-5 text-[11px] md:text-[12px] leading-relaxed space-y-1">
            <p className="text-white/60"><span className="text-white/40">*</span> All prices above include full setup.</p>
            <p className="text-white/60"><span className="text-white/40">*</span> Wiring, power plugs and internet to be provided by client.</p>
            <p className="text-white/80"><span style={{ color: LIME }}>**</span> 24 months 0% interest installment available with Maybank & CIMB.</p>
          </div>

          {step === 5 && hardwareTouched && (
            <div className="flex justify-end mt-5 md:mt-6">
              <button onClick={() => advance(6)}
                className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 text-black text-[11px] md:text-[12px] font-black uppercase tracking-wider transition-colors hover:bg-white"
                style={{ backgroundColor: LIME }}>
                Continue <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </StepShell>

        {/* ─── STEP 06 — Sentry Mode ─── */}
        <StepShell num={6} title="Upgrade to Sentry Mode?"
          subtitle="Face ID cameras that scan every face across your premises — strangers get flagged to staff in seconds. Most gyms lose 1–3 memberships a month to buddy-pass sharing and tailgating. Sentry plugs that leak."
          visible={step >= 6}>

          <div className="border-2 border-white/15 mb-4 md:mb-5 bg-white/[0.02] overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr]">
              {/* Image */}
              <div className="relative bg-black aspect-[4/3] md:aspect-auto md:min-h-[260px] overflow-hidden">
                <img src="/qfitimg/sentrycover.jpg" alt="Sentry Mode — Face ID cameras" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2 py-1 border border-red-500/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-400 text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-wider">Live</span>
                </div>
              </div>
              {/* Copy */}
              <div className="p-5 md:p-7">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck size={18} strokeWidth={2} style={{ color: LIME }} />
                  <p className="text-[11px] md:text-[13px] font-black uppercase tracking-wider text-white">Sentry Mode</p>
                </div>
                <ul className="space-y-1.5 md:space-y-2 text-[12px] md:text-[13px] text-white/75 leading-relaxed">
                  <li className="flex gap-2"><Check size={12} strokeWidth={3} className="flex-shrink-0 mt-1" style={{ color: LIME }} /> 3 cameras included — entrance, floor, back area</li>
                  <li className="flex gap-2"><Check size={12} strokeWidth={3} className="flex-shrink-0 mt-1" style={{ color: LIME }} /> Confidence-score matching (handles caps, angles, lighting)</li>
                  <li className="flex gap-2"><Check size={12} strokeWidth={3} className="flex-shrink-0 mt-1" style={{ color: LIME }} /> Instant mobile app alert with snapshot + camera location</li>
                  <li className="flex gap-2"><Check size={12} strokeWidth={3} className="flex-shrink-0 mt-1" style={{ color: LIME }} /> Unknown-face log with timeline — finally see the leak</li>
                </ul>
                <p className="text-[11px] md:text-[12px] italic mt-3" style={{ color: LIME }}>
                  Catches 1 non-member/month = pays for itself.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setSentry(true)}
              className={`border-2 p-4 md:p-5 text-left transition-colors ${sentryOn ? '' : 'border-white/15 hover:border-white/40'}`}
              style={sentryOn ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.08)' } : {}}>
              <div className="flex items-center gap-2 mb-1">
                <Check size={16} strokeWidth={3} style={{ color: sentryOn ? LIME : 'rgba(255,255,255,0.4)' }} />
                <span className="text-[12px] md:text-[14px] font-black uppercase tracking-wider" style={{ color: sentryOn ? LIME : 'white' }}>Yes, add it</span>
              </div>
              <span className="text-white/60 text-[11px] md:text-[12px] pl-6">Protect your revenue</span>
            </button>
            <button onClick={() => setSentry(false)}
              className={`border-2 p-4 md:p-5 text-left transition-colors ${sentry === false ? 'border-white/60 bg-white/5' : 'border-white/15 hover:border-white/40'}`}>
              <div className="flex items-center gap-2 mb-1">
                <X size={16} strokeWidth={3} className={sentry === false ? 'text-white' : 'text-white/40'} />
                <span className="text-[12px] md:text-[14px] font-black uppercase tracking-wider text-white">Not now</span>
              </div>
              <span className="text-white/60 text-[11px] md:text-[12px] pl-6">Add later anytime</span>
            </button>
          </div>
          {step === 6 && sentry !== null && (
            <div className="flex justify-end mt-5 md:mt-6">
              <button onClick={() => advance(7)}
                className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 text-black text-[11px] md:text-[12px] font-black uppercase tracking-wider transition-colors hover:bg-white"
                style={{ backgroundColor: LIME }}>
                Continue <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </StepShell>

        {/* ─── STEP 06 — Private Server ─── */}
        <StepShell num={7} title="Want a private server?"
          subtitle="Your own dedicated database, isolated from the shared platform. Faster, hardened, and auditable — only your team has access. Not for everyone, but essential for franchises and data-strict operations."
          visible={step >= 7}>

          <div className="border-2 border-white/15 p-5 md:p-7 mb-4 md:mb-5 bg-white/[0.02]">
            <div className="flex items-start gap-4">
              <Server size={24} strokeWidth={2} style={{ color: LIME }} className="flex-shrink-0 mt-1" />
              <div className="flex-1">
                <div className="flex items-baseline justify-between mb-2">
                  <p className="text-[11px] md:text-[13px] font-black uppercase tracking-wider text-white">Private Server</p>
                  <span className="text-white text-[18px] md:text-[22px] font-black">Let's talk</span>
                </div>
                <ul className="space-y-1.5 md:space-y-2 text-[12px] md:text-[13px] text-white/75 leading-relaxed">
                  <li className="flex gap-2"><Check size={12} strokeWidth={3} className="flex-shrink-0 mt-1" style={{ color: LIME }} /> Dedicated server — zero neighbours</li>
                  <li className="flex gap-2"><Check size={12} strokeWidth={3} className="flex-shrink-0 mt-1" style={{ color: LIME }} /> Only your team has database access, not even us</li>
                  <li className="flex gap-2"><Check size={12} strokeWidth={3} className="flex-shrink-0 mt-1" style={{ color: LIME }} /> Custom backups, audit trail, region of your choice</li>
                  <li className="flex gap-2"><Check size={12} strokeWidth={3} className="flex-shrink-0 mt-1" style={{ color: LIME }} /> Ideal for franchises, chains, or strict compliance needs</li>
                </ul>
                <p className="text-[11px] md:text-[12px] italic mt-3" style={{ color: LIME }}>
                  Priced per setup — we'll quote on WhatsApp.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setPserver(true)}
              className={`border-2 p-4 md:p-5 text-left transition-colors ${pserverOn ? '' : 'border-white/15 hover:border-white/40'}`}
              style={pserverOn ? { borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.08)' } : {}}>
              <div className="flex items-center gap-2 mb-1">
                <Check size={16} strokeWidth={3} style={{ color: pserverOn ? LIME : 'rgba(255,255,255,0.4)' }} />
                <span className="text-[12px] md:text-[14px] font-black uppercase tracking-wider" style={{ color: pserverOn ? LIME : 'white' }}>Yes, private it</span>
              </div>
              <span className="text-white/60 text-[11px] md:text-[12px] pl-6">Quote separately</span>
            </button>
            <button onClick={() => setPserver(false)}
              className={`border-2 p-4 md:p-5 text-left transition-colors ${pserver === false ? 'border-white/60 bg-white/5' : 'border-white/15 hover:border-white/40'}`}>
              <div className="flex items-center gap-2 mb-1">
                <X size={16} strokeWidth={3} className={pserver === false ? 'text-white' : 'text-white/40'} />
                <span className="text-[12px] md:text-[14px] font-black uppercase tracking-wider text-white">Shared is fine</span>
              </div>
              <span className="text-white/60 text-[11px] md:text-[12px] pl-6">Default — secure & fast</span>
            </button>
          </div>
          {step === 7 && pserver !== null && (
            <div className="flex justify-end mt-5 md:mt-6">
              <button onClick={() => advance(8)}
                className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 text-black text-[11px] md:text-[12px] font-black uppercase tracking-wider transition-colors hover:bg-white"
                style={{ backgroundColor: LIME }}>
                Review my quote <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </StepShell>

        {/* ─── SUMMARY ─── */}
        {step >= 8 && (
          <section id="quote-summary" className="border-4 p-5 md:p-8 scroll-mt-20" style={{ borderColor: LIME, animation: 'qfit-reveal 0.4s ease-out' }}>
            <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.25em] mb-4 md:mb-6" style={{ color: LIME }}>
              Your Quote
            </p>

            {/* Prominent value line */}
            <div className="mb-6 md:mb-8 p-4 md:p-5 border-2" style={{ borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.06)' }}>
              <p className="text-white text-[16px] md:text-[22px] font-black uppercase tracking-tight leading-tight text-center">
                <span style={{ color: LIME }}>RM 2 per active member / mth.</span> Everything included. <span style={{ color: LIME }}>Full power to grow!</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6 md:gap-10 items-center">
              <div>
                <div className="space-y-2 text-[12px] md:text-[13px] font-mono mb-5 md:mb-6">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/60">Billing</span>
                    <span className="text-white font-bold">{isAnnual ? 'Annual (–25%)' : 'Monthly (4-mo)'}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/60">Active members</span>
                    <span className="text-white font-bold">{membersLabel}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/60">Outlets</span>
                    <span className="text-white font-bold">{outlets}{extraOutlets > 0 ? ` (${extraOutlets} extra)` : ''}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2 gap-4">
                    <span className="text-white/60 flex-shrink-0">Entry</span>
                    <span className="text-white font-bold text-right">
                      {entryMethod === 'auto-swing' ? 'Auto Swing + Face ID' : entryMethod === 'door-gate' ? 'Door Gate + Face ID' : '—'}
                      {hasExisting && <span className="text-white/50 font-normal"> · existing</span>}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/60">Platform</span>
                    <span className="text-white font-bold">RM {platformCost.toLocaleString()}/mo</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/60">Extra outlets</span>
                    <span className="text-white font-bold">{outletCost > 0 ? `RM ${outletCost}/mo` : '—'}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/60">Sentry Mode</span>
                    <span className="text-white font-bold">{sentryOn ? `RM ${sentryCost}/mo` : '—'}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/60">Private Server</span>
                    <span className="text-white font-bold">{pserverOn ? 'Quote sep.' : '—'}</span>
                  </div>
                  {hardwareTotal > 0 && (
                    <>
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.15em]" style={{ color: LIME }}>Hardware (one-time)</span>
                        <span className="text-white font-black">RM {hardwareTotal.toLocaleString()}</span>
                      </div>
                      {doorlockQty > 0 && (
                        <div className="flex justify-between text-[11px] md:text-[12px] pl-3">
                          <span className="text-white/55">· Doorlock × {doorlockQty}</span>
                          <span className="text-white/75">RM {doorlockCost.toLocaleString()}</span>
                        </div>
                      )}
                      {gateLanes > 0 && (
                        <div className="flex justify-between text-[11px] md:text-[12px] pl-3">
                          <span className="text-white/55">· Entry Gate × {gateLanes} lane{gateLanes > 1 ? 's' : ''}</span>
                          <span className="text-white/75">RM {gateCost.toLocaleString()}</span>
                        </div>
                      )}
                      {sentryCams > 0 && (
                        <div className="flex justify-between text-[11px] md:text-[12px] pl-3">
                          <span className="text-white/55">· Sentry Camera × {sentryCams}</span>
                          <span className="text-white/75">RM {camCost.toLocaleString()}</span>
                        </div>
                      )}
                      <p className="text-[10px] text-white/45 italic pt-1">
                        24 mo 0% instalment available (Maybank / CIMB)
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4 md:space-y-5">
              <div className="border-2 border-white/15 bg-white/[0.02] p-5 md:p-6">
                {/* Billing toggle — now inside estimated card */}
                <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-white/50 mb-2 text-center">Plan</p>
                <div className="flex justify-center mb-5">
                  <div className="inline-flex items-stretch border-2" style={{ borderColor: LIME }}>
                    <button onClick={() => setBilling('monthly')}
                      className={`px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-colors ${billing === 'monthly' ? 'text-black' : 'text-white/60 hover:text-white'}`}
                      style={billing === 'monthly' ? { backgroundColor: LIME } : {}}>
                      Monthly
                    </button>
                    <button onClick={() => setBilling('annual')}
                      className={`px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-colors flex items-center gap-1.5 ${billing === 'annual' ? 'text-black' : 'text-white/60 hover:text-white'}`}
                      style={billing === 'annual' ? { backgroundColor: LIME } : {}}>
                      Annual
                      <span className="text-[8px] md:text-[9px] font-mono" style={billing === 'annual' ? { color: 'rgba(0,0,0,0.6)' } : { color: LIME }}>
                        RM 1,200 off
                      </span>
                    </button>
                  </div>
                </div>

                <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-white/70 mb-3 text-center">
                  {isAnnual ? 'Effective monthly' : 'Estimated monthly'}
                </p>
                <div className="text-center">
                {customQuote ? (
                  <>
                    <p className="font-black uppercase tracking-tight leading-none text-[36px] md:text-[52px] mb-2" style={{ color: LIME }}>Let's talk</p>
                    <p className="text-white/65 text-[11px] md:text-[12px] leading-relaxed">1,000+ members — custom volume pricing.</p>
                  </>
                ) : (
                  <>
                    <div className="flex items-baseline justify-center gap-2">
                      {isAnnual && (
                        <span className="text-white/35 line-through text-[18px] md:text-[22px] font-black">
                          RM {monthlyPreDiscount.toLocaleString()}
                        </span>
                      )}
                      <div className="flex items-baseline">
                        <span className="text-white text-[20px] md:text-[24px] font-black align-top mr-1.5">RM</span>
                        <span className="font-black leading-none tracking-tighter text-[48px] md:text-[64px]" style={{ color: LIME }}>{total.toLocaleString()}</span>
                        <span className="text-white/70 text-[14px] md:text-[16px] font-bold ml-1.5">/mo</span>
                      </div>
                    </div>

                    {isAnnual && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-wider mb-1" style={{ color: LIME }}>
                          − RM 100/mo · save RM 1,200/year
                        </p>
                        <p className="text-white/70 text-[11px] md:text-[12px]">
                          Annual total:{' '}
                          <span className="text-white/35 line-through mr-1">RM {(monthlyPreDiscount * 12).toLocaleString()}</span>
                          <span className="text-white font-bold">RM {annualUpfront.toLocaleString()}</span>
                        </p>
                        <p className="text-white/45 text-[10px] md:text-[11px] mt-1">Billed upfront — locks the rate for 12 months.</p>
                      </div>
                    )}

                    {pserverOn && (
                      <p className="text-white/65 text-[10px] md:text-[11px] leading-relaxed mt-3 pt-3 border-t border-white/10">
                        + <span style={{ color: LIME }}>Private Server</span> quoted separately on WhatsApp.
                      </p>
                    )}
                  </>
                )}
                </div>
              </div>

              {/* One-time Hardware Payment card */}
              {hasHardware && (
                <div className="border-2 border-white/15 bg-white/[0.02] p-5 md:p-6">
                  <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-white/50 mb-3 text-center">One-time Payment (Hardware)</p>

                  {/* Hardware subtotal + delivery */}
                  <div className="space-y-1.5 text-[11px] md:text-[12px] font-mono mb-4 pb-4 border-b-2 border-white/10">
                    <div className="flex justify-between">
                      <span className="text-white/60">Hardware</span>
                      <span className="text-white font-bold">RM {hardwareSubtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Delivery</span>
                      <span className="text-white font-bold">RM {deliveryFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-white/10">
                      <span className="text-white font-bold">Total</span>
                      <span className="font-black" style={{ color: LIME }}>RM {hardwareGrandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Installment selector */}
                  <p className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-wider text-white/50 mb-2 text-center">Payment plan</p>
                  <div className="grid grid-cols-2 gap-1.5 mb-4">
                    {([
                      { key: 0 as const, label: 'Full' },
                      { key: 6 as const, label: '6 mo · 0%' },
                      { key: 12 as const, label: '12 mo · 0%' },
                      { key: 24 as const, label: '24 mo · 0%' },
                    ]).map(opt => {
                      const active = installment === opt.key;
                      return (
                        <button key={opt.key}
                          onClick={() => setInstallment(opt.key)}
                          className={`py-2 px-2 text-[10px] md:text-[11px] font-black uppercase tracking-wider border-2 transition-colors ${active ? 'text-black' : 'border-white/15 text-white/70 hover:text-white hover:border-white/40'}`}
                          style={active ? { borderColor: LIME, backgroundColor: LIME } : {}}>
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Big number */}
                  <div className="text-center">
                    {installment === 0 ? (
                      <>
                        <div className="flex items-baseline justify-center">
                          <span className="text-white text-[16px] md:text-[20px] font-black align-top mr-1.5">RM</span>
                          <span className="font-black leading-none tracking-tighter text-[36px] md:text-[48px]" style={{ color: LIME }}>{hardwareGrandTotal.toLocaleString()}</span>
                        </div>
                        <p className="text-white/60 text-[10px] md:text-[11px] font-bold uppercase tracking-wider mt-2">One-time</p>
                      </>
                    ) : (
                      <>
                        <div className="flex items-baseline justify-center">
                          <span className="text-white text-[16px] md:text-[20px] font-black align-top mr-1.5">RM</span>
                          <span className="font-black leading-none tracking-tighter text-[36px] md:text-[48px]" style={{ color: LIME }}>{installmentMonthly.toLocaleString()}</span>
                          <span className="text-white/70 text-[13px] md:text-[15px] font-bold ml-1.5">/mo</span>
                        </div>
                        <p className="text-white/60 text-[10px] md:text-[11px] font-bold uppercase tracking-wider mt-2">
                          × {installment} months <span style={{ color: LIME }}>· 0% interest</span>
                        </p>
                        <p className="text-white/40 text-[10px] italic mt-1">Maybank / CIMB — subject to approval</p>
                      </>
                    )}
                  </div>
                </div>
              )}
              </div>
            </div>

            <div className="mt-6 md:mt-8 pt-5 md:pt-6 border-t-2 border-white/10 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
              <p className="text-white/60 text-[11px] md:text-[12px] leading-relaxed max-w-md">
                Tap the button — your full config is sent to our WhatsApp. We'll confirm, invoice, and onboard same day.
              </p>
              <a href={waLink} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 md:px-8 py-3.5 md:py-4 text-black text-[12px] md:text-[14px] font-black uppercase tracking-wider transition-colors hover:bg-white whitespace-nowrap"
                style={{ backgroundColor: LIME }}>
                <MessageCircle size={16} strokeWidth={2.5} />
                {customQuote ? 'Request custom quote' : 'Lock in this quote'}
                <ArrowRight size={14} strokeWidth={2.5} />
              </a>
            </div>
          </section>
        )}

        {/* ─── Pricing FAQ — only after summary ─── */}
        {step >= 8 && (
        <section className="mt-14 md:mt-20" style={{ animation: 'qfit-reveal 0.4s ease-out' }}>
          <div className="flex items-center gap-3 mb-5 md:mb-6">
            <span className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center border-2 text-[11px] md:text-[12px] font-mono font-black" style={{ borderColor: LIME, color: LIME }}>
              FAQ
            </span>
            <h2 className="text-[15px] md:text-[20px] font-black uppercase tracking-tight text-white">Pricing questions, answered</h2>
          </div>

          <div className="border-t-2 border-white/15 md:pl-11">
            {PRICING_FAQS.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div key={i} className="border-b-2 border-white/15">
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 py-4 md:py-5 text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="text-white text-[12px] md:text-[14px] font-bold uppercase tracking-tight pr-4">{faq.q}</span>
                    <Plus
                      size={18}
                      strokeWidth={2.5}
                      className="flex-shrink-0 transition-transform"
                      style={{ color: LIME, transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
                    />
                  </button>
                  {open && (
                    <p className="text-white/75 text-[12px] md:text-[14px] leading-relaxed pb-5 md:pb-6 pr-8" style={{ animation: 'qfit-reveal 0.25s ease-out' }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
        )}

        {/* ─── Closing statement ─── */}
        {step >= 8 && (
          <section className="mt-14 md:mt-20 py-12 md:py-16 border-y-4 text-center relative overflow-hidden"
            style={{ borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.04)', animation: 'qfit-reveal 0.5s ease-out' }}>
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4" style={{ borderColor: LIME }} />
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4" style={{ borderColor: LIME }} />
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4" style={{ borderColor: LIME }} />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4" style={{ borderColor: LIME }} />

            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.9]">
              We win <span style={{ color: LIME }}>only</span> when<br className="hidden sm:block" /> <span style={{ color: LIME }}>you</span> win.
            </h2>
          </section>
        )}

        <p className="text-white/30 text-[10px] md:text-[11px] text-center mt-10 md:mt-14">
          Private page — not publicly linked. Reach out only if you were invited here.
        </p>
      </main>
    </div>
  );
}
