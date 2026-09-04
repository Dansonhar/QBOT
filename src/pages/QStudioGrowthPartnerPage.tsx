// QSTUDIO / GROWTH PARTNER — fullscreen slide-by-slide pitch deck for the
// STUDIO Growth Package special partnership (RM299/mo partner price).
//
// UNLISTED / NOT CRAWLABLE. Not linked from any nav or footer, noindex/nofollow,
// blocked in robots.txt, and intentionally LEFT OUT of scripts/prerender-meta.mjs.
// Reachable only by typing the URL — meant to be presented 1:1 to a gym operator.
//
// FORMAT: a 12-slide all-black deck. Navigate by tap, arrow keys, swipe
// left/right, or the on-screen buttons. Each slide has its own URL
// (/qstudio/growthpartner/1 … /12). Persuasion arc:
//   intake (their numbers) → their results → benefits (photo split) → what's
//   inside → zero-hardware setup → full package list → the offer (RM299/mo
//   partner price, payment-gateway setup included) → payment & disbursement
//   (T+2 / T+5, collection included) → QSentry AI optional add-on → close.
// Price is RM299/mo. Gateway transaction fee (5%) is stated small/low-key,
// not headlined. NO other plan tiers appear anywhere.

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight, ArrowLeft, Check, CheckCircle2, MessageCircle,
  Monitor, Smartphone, CreditCard, BarChart3, Users,
  ScanFace, Camera, ShieldAlert, Handshake,
  TrendingDown, Laptop, Banknote, Clock, FileText,
  type LucideIcon,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';

const LIME = '#CCFF00';
const WA_NUMBER = '60126909189';
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
  "Hi STUDIO team! I'm interested in the STUDIO Growth Package (RM299/mo partnership). Please share details.",
)}`;

// Full contents of the RM299 Growth Package, grouped into phases (mirrors the
// /qstudio feature-group layout). Slide 8. NO other plan tiers appear anywhere.
const PACKAGE_GROUPS: { title: string; items: string[] }[] = [
  {
    title: 'Membership Management',
    items: [
      'Member profiles — name, ID & photo',
      'Membership plans, renewals & freezes',
      'Recurring payments — auto-billed, card on file',
      'Expiring & unpaid members flagged',
    ],
  },
  {
    title: 'Check-in & Access',
    items: [
      'QR check-in at the counter',
      'Face ID check-in — webcam',
      'Every visit logged to the profile',
      'Only active members get in',
    ],
  },
  {
    title: 'Sell & Get Paid',
    items: [
      'Counter POS on your own laptop',
      'Payment gateway setup — included',
      'Simple inventory tracking',
      'Basic sales reports — automatic',
    ],
  },
  {
    title: 'Members & Online',
    items: [
      'Member app — name, ID & status',
      'Your own website for sign-ups',
      'Backoffice dashboard',
      'Runs on your own laptop',
    ],
  },
];

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] md:text-[12px] font-mono font-bold uppercase tracking-[0.3em] mb-4" style={{ color: LIME }}>
      {children}
    </p>
  );
}

// Labelled range slider used by the slide-1 intake.
function SliderField({ label, display, min, max, step, value, onChange }: {
  label: string; display: string; min: number; max: number; step: number;
  value: number; onChange: (n: number) => void;
}) {
  return (
    <label className="block border border-white/25 bg-black/60 px-4 py-3">
      <span className="flex items-baseline justify-between gap-3 mb-2">
        <span className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-wider text-white/60 text-left">{label}</span>
        <span className="text-[18px] md:text-[20px] font-black leading-none flex-shrink-0" style={{ color: LIME }}>{display}</span>
      </span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full cursor-pointer"
        style={{ accentColor: LIME }}
      />
    </label>
  );
}

// Photo-split benefit slide — image one side, straight title + feature list the other.
function BenefitSlide({ kicker, Icon, line1, line2, features, note, img, imgSide = 'left' }: {
  kicker: string; Icon: LucideIcon; line1: string; line2: string;
  features: string[]; note: string; img: string; imgSide?: 'left' | 'right';
}) {
  return (
    <div className={`max-w-5xl mx-auto flex flex-col ${imgSide === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-6 md:gap-10`}>
      <div className="w-full max-w-[300px] md:max-w-none md:w-[42%] flex-shrink-0">
        <div className="border-2 overflow-hidden" style={{ borderColor: LIME, boxShadow: '6px 6px 0 0 rgba(204,255,0,0.25)' }}>
          <img src={img} alt="" className="w-full h-[170px] md:h-[340px] object-cover" draggable={false} />
        </div>
      </div>
      <div className="flex-1 text-center md:text-left">
        <Kicker>{kicker}</Kicker>
        <Icon size={32} strokeWidth={2.5} className="mx-auto md:mx-0 mb-4" style={{ color: LIME }} />
        <h2 className="text-[27px] md:text-[44px] font-black uppercase tracking-tight leading-[0.95] mb-5">
          {line1}<br /><span style={{ color: LIME }}>{line2}</span>
        </h2>
        <div className="space-y-2.5 max-w-md mx-auto md:mx-0 mb-5 text-left">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-3 border border-white/20 px-4 py-2.5">
              <CheckCircle2 size={15} strokeWidth={2.5} className="mt-0.5 flex-shrink-0" style={{ color: LIME }} />
              <span className="text-[12px] md:text-[14px] text-white/85 leading-snug">{f}</span>
            </div>
          ))}
        </div>
        <p className="text-[12px] md:text-[13px] font-black uppercase tracking-wider" style={{ color: LIME }}>{note}</p>
      </div>
    </div>
  );
}

export default function QStudioGrowthPartnerPage() {
  // Slide index lives in the URL — /qstudio/growthpartner/1 … /10 — so every
  // slide is directly shareable and the browser Back button steps backwards.
  const { slide: slideParam } = useParams<{ slide: string }>();
  const navigate = useNavigate();
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Interactive intake (slide 1) — their numbers drive the whole story.
  const [tgPerDay, setTgPerDay] = useState(3);      // tailgaters sneaking in per day
  const [entryPrice, setEntryPrice] = useState(15); // RM per entry
  const [staffCost, setStaffCost] = useState(0);    // RM/mo spent on front-desk / admin help
  const tgLossMonth = tgPerDay * entryPrice * 30;
  const totalLossMonth = tgLossMonth + staffCost;
  const totalLossYear = tgPerDay * entryPrice * 365 + staffCost * 12;
  const netBackMonth = Math.max(0, totalLossMonth - 299);
  const rm = (n: number) => n.toLocaleString('en-MY');

  // ── The 12-slide deck (all black) ─────────────────────────────────────────
  const slides: { bgImg?: string; render: () => React.ReactNode }[] = [

    // 1 · HOOK
    {
      bgImg: '/qfitimg/studioimg/gym.jpg',
      render: () => (
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 border" style={{ borderColor: LIME, color: LIME }}>
            <Handshake size={12} strokeWidth={3} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]">STUDIO · Special Partnership</span>
          </div>
          <h1 className="text-[34px] md:text-[60px] font-black uppercase tracking-tight leading-[0.92] mb-3">
            STUDIO<br /><span style={{ color: LIME }}>Growth Package</span>
          </h1>
          <p className="text-white/90 text-[15px] md:text-[20px] font-black uppercase tracking-wide mb-4">We grow together.</p>

          {/* Top 5 core features — visible immediately */}
          <div className="flex flex-wrap justify-center gap-1.5 max-w-2xl mx-auto mb-6">
            {[
              'Face ID or QR Check-in',
              'Enterprise-Grade Membership',
              'Auto-Collect Payments',
              'Sell Anywhere — POS & Website',
              'Reports Done For You',
            ].map(f => (
              <span key={f} className="inline-flex items-center gap-1.5 border border-white/30 bg-black/50 px-2.5 py-1">
                <CheckCircle2 size={11} strokeWidth={3} className="flex-shrink-0" style={{ color: LIME }} />
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-wider text-white">{f}</span>
              </span>
            ))}
          </div>

          {/* Intake — their numbers personalise the whole deck */}
          <div className="max-w-md mx-auto border-2 p-4 md:p-5 text-left bg-black/70" style={{ borderColor: LIME }}>
            <p className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] mb-3 text-center" style={{ color: LIME }}>
              First — tell us about your gym
            </p>
            <div className="space-y-2.5">
              <SliderField
                label="Tailgaters sneaking in per day"
                display={String(tgPerDay)}
                min={0} max={20} step={1}
                value={tgPerDay} onChange={setTgPerDay}
              />
              <SliderField
                label="Your price per entry"
                display={`RM ${entryPrice}`}
                min={5} max={100} step={5}
                value={entryPrice} onChange={setEntryPrice}
              />
              <div className="text-center text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-white/40">— and / or —</div>
              <SliderField
                label="Monthly spend on front-desk / admin help"
                display={staffCost === 0 ? 'RM 0 · I do it myself' : `RM ${rm(staffCost)}`}
                min={0} max={5000} step={100}
                value={staffCost} onChange={setStaffCost}
              />
            </div>
            <button
              type="button"
              onClick={next}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-black text-[13px] font-black uppercase tracking-wider hover:opacity-90"
              style={{ backgroundColor: LIME }}
            >
              Submit — show me my numbers <ArrowRight size={14} strokeWidth={3} />
            </button>
          </div>
        </div>
      ),
    },

    // 2 · YOUR RESULTS — shown immediately after SUBMIT
    {
      render: () => (
        <div className="max-w-3xl mx-auto text-center">
          <Kicker>Your results</Kicker>
          <TrendingDown size={34} strokeWidth={2.5} className="mx-auto mb-4" style={{ color: LIME }} />
          <h2 className="text-[26px] md:text-[44px] font-black uppercase tracking-tight leading-[0.95] mb-6">
            Here's what running manually<br /><span style={{ color: LIME }}>is costing you.</span>
          </h2>

          {/* Breakdown of THEIR inputs */}
          <div className="max-w-md mx-auto text-left space-y-2.5 mb-5">
            {tgLossMonth > 0 && (
              <div className="flex items-center justify-between gap-3 border border-white/20 px-4 py-3">
                <span className="text-[12px] md:text-[14px] text-white/80 leading-snug">
                  Tailgaters — {tgPerDay}/day × RM{entryPrice}/entry
                </span>
                <span className="text-[13px] md:text-[15px] font-black text-red-400 flex-shrink-0 tabular-nums">−RM {rm(tgLossMonth)}/mo</span>
              </div>
            )}
            {staffCost > 0 && (
              <div className="flex items-center justify-between gap-3 border border-white/20 px-4 py-3">
                <span className="text-[12px] md:text-[14px] text-white/80 leading-snug">Front-desk / admin help you're paying for</span>
                <span className="text-[13px] md:text-[15px] font-black text-red-400 flex-shrink-0 tabular-nums">−RM {rm(staffCost)}/mo</span>
              </div>
            )}
            {totalLossMonth === 0 && (
              <div className="border border-white/20 px-4 py-3 text-[12px] md:text-[14px] text-white/70 text-center">
                Go back and set your numbers — the story updates instantly.
              </div>
            )}
          </div>

          {/* Totals */}
          {totalLossMonth > 0 && (
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-6">
              <div className="border-2 border-red-500/70 bg-red-500/10 px-4 py-4">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400 mb-1">Burning per month</div>
                <div className="text-[22px] md:text-[28px] font-black leading-none text-red-400 tabular-nums">−RM {rm(totalLossMonth)}</div>
              </div>
              <div className="border-2 border-red-500/70 bg-red-500/10 px-4 py-4">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400 mb-1">Burning per year</div>
                <div className="text-[22px] md:text-[28px] font-black leading-none text-red-400 tabular-nums">−RM {rm(totalLossYear)}</div>
              </div>
            </div>
          )}

          {totalLossMonth > 0 && (
            <p className="text-white/80 text-[13px] md:text-[16px] max-w-md mx-auto leading-relaxed">
              Now let us show you how STUDIO takes all of this off your plate —{' '}
              for just <strong style={{ color: LIME }}>RM299/mo</strong>.
            </p>
          )}
        </div>
      ),
    },

    // 3 · KNOW EVERY MEMBER
    {
      render: () => (
        <BenefitSlide
          kicker="Access control · included"
          Icon={ScanFace}
          line1="Know every member"
          line2="who walks in."
          features={[
            'Face ID & QR check-in right at your counter',
            'Expired or unpaid members flagged instantly',
            'Every visit logged to the member\'s profile',
          ]}
          note={tgLossMonth > 0
            ? `No more free riders — that's RM ${rm(tgLossMonth)}/mo staying in your pocket.`
            : 'No more free riders — only paying members get in.'}
          img="/qfitimg/studioimg/app_membership.jpg"
          imgSide="left"
        />
      ),
    },

    // 3 · COLLECT PAYMENTS AUTOMATICALLY
    {
      render: () => (
        <BenefitSlide
          kicker="Recurring payments · included"
          Icon={CreditCard}
          line1="Collect payments"
          line2="automatically."
          features={[
            'Memberships auto-bill every cycle — card on file',
            'Renewals collected on time, no reminders needed',
            'Full payment history on every member',
          ]}
          note="No more chasing. The money just arrives."
          img="/qfitimg/studioimg/01_membership.jpg"
          imgSide="right"
        />
      ),
    },

    // 4 · REPORTS DONE AUTOMATICALLY
    {
      render: () => (
        <BenefitSlide
          kicker="Reporting · included"
          Icon={BarChart3}
          line1="All your reports,"
          line2="done automatically."
          features={[
            'Daily sales summed up for you',
            'Check-ins & memberships tallied live',
            'Open your dashboard — it\'s already done',
          ]}
          note={staffCost > 0
            ? `The admin work you pay RM ${rm(staffCost)}/mo for — the system does it.`
            : 'Close the gym, go home. The paperwork is finished.'}
          img="/qfitimg/studioimg/05_report.jpg"
          imgSide="left"
        />
      ),
    },

    // 6 · WHAT'S INSIDE — concrete, benefit-grouped, value-anchored
    {
      render: () => (
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <Kicker>What the Growth Package covers</Kicker>
            <h2 className="text-[26px] md:text-[40px] font-black uppercase tracking-tight leading-tight mb-2">
              A complete gym system.<br className="hidden md:block" /> Day one.
            </h2>
            <p className="text-white/60 text-[12px] md:text-[14px] mb-7">Four jobs, handled — on the same enterprise-grade platform our biggest clients run on.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5 text-left">
            {[
              { Icon: ScanFace,   title: 'Your Front Door',  items: ['QR + Face ID check-in (webcam at the counter)', 'Every member verified, every visit logged'] },
              { Icon: CreditCard, title: 'Your Money',       items: ['Recurring payments — auto-billed every cycle', 'Membership plans, renewals & freezes managed'] },
              { Icon: Monitor,    title: 'Your Office',      items: ['Backoffice dashboard for the whole gym', 'Sales reports done automatically · simple inventory'] },
              { Icon: Smartphone, title: 'Your Members',     items: ['Member app — their name, ID & membership status', 'Your own website for new sign-ups'] },
            ].map(({ Icon, title, items }) => (
              <div key={title} className="border-2 border-white/25 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: LIME }}>
                    <Icon size={17} strokeWidth={2.5} className="text-black" />
                  </div>
                  <h3 className="text-[14px] font-black uppercase tracking-tight">{title}</h3>
                </div>
                <ul className="space-y-1.5">
                  {items.map((it, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[12px] text-white/80 leading-snug">
                      <Check size={12} strokeWidth={3} className="mt-0.5 flex-shrink-0" style={{ color: LIME }} />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border border-dashed border-white/30 px-4 py-3 text-[11px] md:text-[12px] text-white/60 leading-relaxed text-center">
            Kept lean on purpose — class booking, e-sign, auto Telegram and marketing are <strong className="text-white">not</strong> inside.
            They unlock the day you upgrade. That's how this price is possible.
          </div>
        </div>
      ),
    },

    // 7 · ZERO-HARDWARE SETUP (kill the effort objection)
    {
      render: () => (
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className="w-full max-w-[300px] md:max-w-none md:w-[42%] flex-shrink-0">
            <div className="border-2 overflow-hidden" style={{ borderColor: LIME, boxShadow: '6px 6px 0 0 rgba(204,255,0,0.25)' }}>
              <img src="/growthpackage.jpg" alt="" className="w-full h-[170px] md:h-[340px] object-cover" draggable={false} />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <Kicker>Getting started · no gates to buy</Kicker>
            <Laptop size={32} strokeWidth={2.5} className="mx-auto md:mx-0 mb-4" style={{ color: LIME }} />
            <h2 className="text-[27px] md:text-[44px] font-black uppercase tracking-tight leading-[0.95] mb-5">
              The laptop you own.<br /><span style={{ color: LIME }}>A webcam. Done.</span>
            </h2>
            <div className="space-y-2.5 max-w-md mx-auto md:mx-0 mb-5 text-left">
              {[
                { Icon: Users,        line: 'Member walks up to the counter' },
                { Icon: Camera,       line: 'Your staff scans their face — or their QR / member ID' },
                { Icon: CheckCircle2, line: 'STUDIO checks the membership & logs the visit, in a second' },
              ].map(({ Icon, line }, i) => (
                <div key={i} className="flex items-center gap-3 border border-white/20 px-4 py-2.5">
                  <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center font-black text-[11px] text-black" style={{ backgroundColor: LIME }}>{i + 1}</span>
                  <Icon size={15} strokeWidth={2.5} className="flex-shrink-0" style={{ color: LIME }} />
                  <span className="text-[12px] md:text-[13px] text-white/85 leading-snug">{line}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] md:text-[12px] text-white/50 leading-relaxed max-w-md mx-auto md:mx-0">
              <strong className="text-white/80 uppercase">Straight talk:</strong> this is semi-automated — your operator runs it
              from the counter. Gates that open themselves come with the Pro plan, when you're ready.
            </p>
          </div>
        </div>
      ),
    },

    // 8 · THE FULL RM299 PACKAGE LIST — everything included, nothing else shown
    {
      render: () => (
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <Kicker>The complete list · RM299/mo</Kicker>
            <h2 className="text-[26px] md:text-[40px] font-black uppercase tracking-tight leading-tight mb-2">
              Everything inside<br className="hidden md:block" /> the Growth Package.
            </h2>
            <p className="text-white/60 text-[12px] md:text-[14px] mb-6">All of it included from day one. No hidden extras.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4 text-left">
            {PACKAGE_GROUPS.map(group => (
              <div key={group.title} className="border-2 border-white/20">
                {/* Phase header band */}
                <div className="px-3 py-1.5 text-[10.5px] font-black uppercase tracking-[0.12em] text-black" style={{ backgroundColor: LIME }}>
                  {group.title}
                </div>
                <ul className="px-3 py-2.5 space-y-1.5">
                  {group.items.map(it => (
                    <li key={it} className="flex items-start gap-2 text-[11px] md:text-[12px] text-white/85 leading-snug">
                      <CheckCircle2 size={12} strokeWidth={3} className="mt-0.5 flex-shrink-0" style={{ color: LIME }} />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-2 px-4 py-2.5 flex items-center gap-3" style={{ borderColor: LIME }}>
            <ShieldAlert size={20} strokeWidth={2.5} className="flex-shrink-0" style={{ color: LIME }} />
            <div className="text-[10.5px] md:text-[12px] text-white/80 leading-snug">
              <strong className="text-white uppercase">Growing later?</strong> Class booking, e-sign, marketing, automated
              gates and Sentry AI anti-tailgating are one upgrade away — your members and history carry over.
            </div>
          </div>
        </div>
      ),
    },

    // 9 · THE OFFER — every benefit they just saw, one partner price
    {
      render: () => (
        <div className="max-w-3xl mx-auto text-center relative">
          <div aria-hidden="true" className="absolute -top-6 right-0 md:-right-10 -rotate-[8deg] pointer-events-none select-none">
            <div className="inline-flex flex-col items-center px-3 py-1.5 border-[3px]" style={{ borderColor: LIME, color: LIME }}>
              <span className="text-[8px] font-mono font-black uppercase tracking-[0.25em] leading-tight">Special</span>
              <span className="text-[13px] font-black uppercase tracking-[0.1em] leading-none mt-0.5">Partnership</span>
            </div>
          </div>
          <Kicker>Everything you just saw</Kicker>
          <h2 className="text-[26px] md:text-[42px] font-black uppercase tracking-tight leading-[0.95] mb-5">
            All of this.<br /><span style={{ color: LIME }}>One partner price.</span>
          </h2>

          {/* All-benefits recap */}
          <div className="grid grid-cols-2 gap-1.5 max-w-lg mx-auto mb-5 text-left">
            {[
              'Face ID & QR check-in',
              'Auto-collected payments',
              'Reports done automatically',
              'Backoffice & simple inventory',
              'Member app — ID & status',
              'Your own website',
              'Membership management',
              'Runs on your own laptop',
            ].map(b => (
              <span key={b} className="inline-flex items-center gap-1.5 border border-white/25 px-2.5 py-1.5">
                <CheckCircle2 size={12} strokeWidth={3} className="flex-shrink-0" style={{ color: LIME }} />
                <span className="text-[10px] md:text-[11.5px] font-black uppercase tracking-wide text-white leading-tight">{b}</span>
              </span>
            ))}
          </div>

          <p className="text-[13px] md:text-[16px] font-black uppercase tracking-wide text-white/70 mb-3">
            Everything above — growth partners pay just:
          </p>

          {/* Single hero price */}
          <div className="inline-flex flex-col items-center border-2 px-8 py-5 relative" style={{ borderColor: LIME }}>
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 text-black whitespace-nowrap" style={{ backgroundColor: LIME }}>
              Partner Price
            </div>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-[48px] md:text-[62px] font-black leading-none" style={{ color: LIME }}>RM299</span>
              <span className="text-[15px] font-mono text-white/70">/mo</span>
            </div>
            <div className="text-[10px] font-mono text-white/50 mt-1.5">that's ~RM10 a day</div>
          </div>

          {/* ZIPP 0% installment */}
          <p className="text-[11px] md:text-[12px] font-mono text-white/60 mt-4">
            Or pay over <strong className="text-white">12 months at 0% interest</strong> — ZIPP installments available.
          </p>

          {/* Special included feature */}
          <div className="inline-flex items-center gap-2 border-2 px-4 py-2.5 mt-3" style={{ borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.08)' }}>
            <CheckCircle2 size={15} strokeWidth={3} className="flex-shrink-0" style={{ color: LIME }} />
            <span className="text-[11px] md:text-[12px] font-black uppercase tracking-wider text-white">
              Inclusive of Payment Gateway Setup
            </span>
          </div>

          {/* Gateway transaction fee — stated small & low-key */}
          <p className="text-[9px] md:text-[10px] font-mono text-white/35 mt-4 max-w-md mx-auto leading-relaxed">
            Payment gateway facilities at 5% per successful transaction.
          </p>
        </div>
      ),
    },

    // 10 · PAYMENT & DISBURSEMENT — how the money reaches the merchant
    {
      render: () => (
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <Kicker>No merchant account? We've got you</Kicker>
            <h2 className="text-[24px] md:text-[38px] font-black uppercase tracking-tight leading-tight mb-2">
              Company can't get payment<br className="hidden md:block" /> gateway facilities?
            </h2>
            <p className="text-[12px] md:text-[14px] font-black uppercase tracking-wide mb-6" style={{ color: LIME }}>
              No problem — collection is inclusive in the package.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-stretch gap-3">
            {/* With own credit-card facility → T+2 */}
            <div className="flex-1 border-2 p-5" style={{ borderColor: LIME }}>
              <div className="flex items-center gap-2.5 mb-3">
                <CreditCard size={20} strokeWidth={2.5} style={{ color: LIME }} />
                <span className="text-[13px] font-black uppercase tracking-tight">With your own card facility</span>
              </div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2 text-[12px] md:text-[13px] text-white/85 leading-snug">
                  <Check size={13} strokeWidth={3} className="mt-0.5 flex-shrink-0" style={{ color: LIME }} />
                  Payment goes straight to your merchant account
                </li>
                <li className="flex items-start gap-2 text-[12px] md:text-[13px] text-white/85 leading-snug">
                  <Banknote size={13} strokeWidth={3} className="mt-0.5 flex-shrink-0" style={{ color: LIME }} />
                  Disbursed to you fast
                </li>
              </ul>
              <div className="flex items-center gap-2 border-t border-white/15 pt-3">
                <Clock size={16} strokeWidth={2.5} style={{ color: LIME }} />
                <span className="text-[22px] font-black leading-none" style={{ color: LIME }}>T+2</span>
                <span className="text-[11px] font-mono text-white/60">within 2 working days</span>
              </div>
            </div>
            {/* Without card facility → via Qbot → T+5 */}
            <div className="flex-1 border-2 border-white/30 p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <Handshake size={20} strokeWidth={2.5} className="text-white/80" />
                <span className="text-[13px] font-black uppercase tracking-tight">Without a card facility</span>
              </div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2 text-[12px] md:text-[13px] text-white/85 leading-snug">
                  <Check size={13} strokeWidth={3} className="mt-0.5 flex-shrink-0 text-white/70" />
                  We collect it for you — QBOT handles the gateway
                </li>
                <li className="flex items-start gap-2 text-[12px] md:text-[13px] text-white/85 leading-snug">
                  <Banknote size={13} strokeWidth={3} className="mt-0.5 flex-shrink-0 text-white/70" />
                  Then disbursed to your bank
                </li>
              </ul>
              <div className="flex items-center gap-2 border-t border-white/15 pt-3">
                <Clock size={16} strokeWidth={2.5} className="text-white/80" />
                <span className="text-[22px] font-black leading-none text-white">T+5</span>
                <span className="text-[11px] font-mono text-white/60">within 5 working days</span>
              </div>
            </div>
          </div>
          <p className="text-center text-[11px] md:text-[12px] text-white/50 mt-5 leading-relaxed">
            Either way, <strong className="text-white">payment collection is included in your package</strong> — no separate gateway fees to sort out.
          </p>
        </div>
      ),
    },

    // 11 · QSENTRY AI — optional add-on (additional charges)
    {
      render: () => (
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className="w-full max-w-[320px] md:max-w-none md:w-[46%] flex-shrink-0">
            <div className="border-2 overflow-hidden" style={{ borderColor: LIME, boxShadow: '6px 6px 0 0 rgba(204,255,0,0.25)' }}>
              <img src="/qsecurity/sentry-cctv.jpg" alt="" className="w-full h-[190px] md:h-[360px] object-cover" draggable={false} />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 border px-2.5 py-1 mb-3" style={{ borderColor: LIME }}>
              <span className="text-[9px] font-mono font-black uppercase tracking-[0.2em]" style={{ color: LIME }}>Optional add-on · additional charges</span>
            </div>
            <div className="flex items-center gap-2.5 justify-center md:justify-start mb-3">
              <ShieldAlert size={28} strokeWidth={2.5} style={{ color: LIME }} />
              <h2 className="text-[30px] md:text-[48px] font-black uppercase tracking-tight leading-none">QSentry AI</h2>
            </div>
            <p className="text-[14px] md:text-[17px] font-black uppercase tracking-tight leading-tight mb-4" style={{ color: LIME }}>
              The AI eyes on your door.
            </p>
            <p className="text-white/70 text-[12px] md:text-[14px] max-w-lg leading-relaxed mb-4">
              An AI watch-camera that catches what the counter can't — tailgaters slipping in and non-members
              walking through. It snaps the photo, logs the track and alerts you instantly.
            </p>
            <div className="space-y-2 max-w-md mx-auto md:mx-0 mb-5 text-left">
              {[
                'Anti-tailgating — spots two people on one entry',
                'Non-member detection — flags unknown faces',
                'Instant photo alerts to your phone / Telegram',
                'Evidence log of every alert, timestamped',
              ].map(f => (
                <div key={f} className="flex items-start gap-2.5 border border-white/20 px-4 py-2.5">
                  <Camera size={15} strokeWidth={2.5} className="mt-0.5 flex-shrink-0" style={{ color: LIME }} />
                  <span className="text-[12px] md:text-[13px] text-white/85 leading-snug">{f}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] md:text-[12px] text-white/50 leading-relaxed max-w-md mx-auto md:mx-0">
              <strong className="text-white/80 uppercase">Optional:</strong> QSentry AI is an add-on to the Growth Package —
              additional charges apply (software + camera hardware). Ask us for a tailored quote.
            </p>
          </div>
        </div>
      ),
    },

    // 12 · CLOSE — visualise tomorrow, then scarcity + CTA
    {
      bgImg: '/qfitimg/studioimg/for_gym.png',
      render: () => (
        <div className="max-w-2xl mx-auto text-center">
          <Kicker>Tomorrow morning</Kicker>
          <h2 className="text-[28px] md:text-[48px] font-black uppercase tracking-tight leading-[0.95] mb-6">
            Run your gym<br /><span style={{ color: LIME }}>on autopilot.</span>
          </h2>
          <p className="text-white/75 text-[13px] md:text-[16px] max-w-lg mx-auto leading-relaxed mb-4">
            The webcam recognises her. Her renewal was collected overnight. Yesterday's numbers are
            already on your dashboard. <strong className="text-white">You just run the gym.</strong>
          </p>
          <p className="text-white/60 text-[12px] md:text-[14px] mb-2">
            All of that — <strong className="text-white">RM299/mo</strong>. About RM10 a day.
            {netBackMonth > 0 && (
              <> By your own numbers, that's <strong style={{ color: LIME }}>RM {rm(netBackMonth)}/mo back in your pocket</strong> —
              RM {rm(netBackMonth * 12)} a year.</>
            )}
          </p>
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] mb-8" style={{ color: LIME }}>
            Limited partnership slots — we only take gyms we can grow with
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 text-black text-[14px] font-black uppercase tracking-wider hover:opacity-90"
              style={{ backgroundColor: LIME, boxShadow: '0 4px 0 0 rgba(255,255,255,0.25)' }}
            >
              <MessageCircle size={16} strokeWidth={2.5} /> WhatsApp the STUDIO Team
            </a>
            <a
              href="/qstudio/growthquote"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/40 text-white text-[14px] font-black uppercase tracking-wider hover:border-white"
            >
              <FileText size={16} strokeWidth={2.5} /> Build a Quote
            </a>
          </div>
          <p className="text-[9.5px] text-white/40 leading-relaxed mt-10">
            Crave Asia Sdn Bhd · Trade Reg. Nr. 914475-H (201001030554) · www.craveasia.com
          </p>
        </div>
      ),
    },
  ];

  const last = slides.length - 1;
  // /qstudio/growthpartner → slide 1; /qstudio/growthpartner/7 → slide 7 (clamped).
  const idx = Math.min(last, Math.max(0, (parseInt(slideParam ?? '1', 10) || 1) - 1));
  const goTo = useCallback((i: number) => {
    const clamped = Math.min(last, Math.max(0, i));
    if (clamped !== idx) navigate(`/qstudio/growthpartner/${clamped + 1}`);
  }, [idx, last, navigate]);
  const next = useCallback(() => goTo(idx + 1), [goTo, idx]);
  const prev = useCallback(() => goTo(idx - 1), [goTo, idx]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return; // let sliders own the arrows
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter' || e.key === 'PageDown') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  // Swipe left/right navigation (ignore touches that start on the calculator sliders)
  const onTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('input,label')) { touchStart.current = null; return; }
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.2) return; // not a horizontal swipe
    if (dx < 0) next(); else prev();
  };

  const slide = slides[idx];

  // "?bare=1" hides the deck chrome (progress bar, header, nav) — used for clean
  // slide screenshots that get embedded in the printed quote as a solution appendix.
  const bare = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('bare') === '1';

  // Fit-to-viewport: measure each slide's natural size and scale it (up or down)
  // to fill the available height, bounded by width. Pure transform — no relayout.
  const bodyRef = useRef<HTMLDivElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const measure = () => {
      const body = bodyRef.current;
      const child = fitRef.current?.firstElementChild as HTMLElement | null;
      if (!body || !child) return;
      const availH = body.clientHeight - 28; // minus py-4
      const availW = body.clientWidth - 36;  // minus px-5
      const ch = child.offsetHeight;
      const cw = child.offsetWidth;
      if (ch <= 0 || cw <= 0) return;
      const s = Math.min(availH / ch, availW / cw);
      setScale(Math.max(0.5, Math.min(s, 1.9)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (bodyRef.current) ro.observe(bodyRef.current);
    const child = fitRef.current?.firstElementChild;
    if (child) ro.observe(child as Element);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [idx]);

  return (
    <main className="h-[100dvh] flex flex-col overflow-hidden antialiased bg-black text-white">
      <SEOHead
        title="STUDIO Growth Package — We Grow Together"
        description="STUDIO Growth Package — special partnership for gyms."
        noindex
      />
      <style>{`
        @keyframes gpSlideIn { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .gp-slide { animation: gpSlideIn .45s cubic-bezier(.22,.9,.3,1) both; }
      `}</style>

      {/* Progress bar */}
      {!bare && (
        <div className="h-1 w-full flex-shrink-0 bg-white/10">
          <div className="h-full transition-all duration-300" style={{ width: `${((idx + 1) / slides.length) * 100}%`, backgroundColor: LIME }} />
        </div>
      )}

      {/* Header strip */}
      {!bare && (
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0 relative z-10">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-white/50">STUDIO · Growth Partner</span>
          <span className="text-[10px] font-mono font-bold tabular-nums text-white/50">
            {String(idx + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </span>
        </div>
      )}

      {/* Slide body — tap advances (buttons/links excluded), swipe navigates */}
      <div
        ref={bodyRef}
        key={idx}
        className="gp-slide relative flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex items-center px-5 py-4 cursor-pointer"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('a,button,input,label')) return;
          next();
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {slide.bgImg && (
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <img src={slide.bgImg} alt="" className="w-full h-full object-cover opacity-20" draggable={false} />
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.92) 100%)' }} />
          </div>
        )}
        <div
          ref={fitRef}
          className="w-full relative z-10"
          style={{ transform: `scale(${scale})`, transformOrigin: 'center center', transition: 'transform .18s ease-out' }}
        >
          {slide.render()}
        </div>
      </div>

      {/* Footer nav */}
      {!bare && (
      <div className="flex items-center justify-between gap-3 px-5 py-4 flex-shrink-0 relative z-10">
        <button
          type="button"
          onClick={prev}
          disabled={idx === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-black uppercase tracking-wider border-2 border-white/30 text-white hover:border-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={13} strokeWidth={3} /> Back
        </button>

        {/* Dots */}
        <div className="hidden md:flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className="w-2 h-2 transition-all"
              style={{ backgroundColor: i === idx ? LIME : 'rgba(255,255,255,0.2)', transform: i === idx ? 'scale(1.4)' : undefined }}
            />
          ))}
        </div>

        {idx === last ? (
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-[11px] font-black uppercase tracking-wider text-black hover:opacity-90"
            style={{ backgroundColor: LIME }}
          >
            <MessageCircle size={13} strokeWidth={3} /> WhatsApp Us
          </a>
        ) : (
          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-[11px] font-black uppercase tracking-wider text-black hover:opacity-90"
            style={{ backgroundColor: LIME }}
          >
            Next <ArrowRight size={13} strokeWidth={3} />
          </button>
        )}
      </div>
      )}
    </main>
  );
}
