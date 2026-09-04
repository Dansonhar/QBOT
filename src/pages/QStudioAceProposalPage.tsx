// QSTUDIO / ACE STUDIO PROPOSAL — code-gated personalized proposal deck.
//
// Same sliding style as /qstudio/growthpartner, but gated by a prospect code
// (acestudio188 → Ace Studio Sarawak). Adds a meeting recap, a tailored solution
// slide for each of their requirements, then the Growth Package offer + a quote
// summary — all in the fullscreen sliding deck format.
//
// UNLISTED / NOT CRAWLABLE. noindex/nofollow, robots-blocked, not prerendered,
// not linked. Reachable only by typing the URL + entering the code.

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, ArrowLeft, Check, CheckCircle2, MessageCircle, Lock,
  DoorOpen, Gift, Wallet, CalendarCheck, ClipboardList, ScanFace,
  LayoutGrid, Handshake, FileText, TrendingUp,
  Monitor, Smartphone, CreditCard, BarChart3, Camera, ShieldAlert, Banknote, Clock,
  type LucideIcon,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { BABEL_ACCESS_CODE, BABEL_SESSION_KEY, BABEL_DECK_PATH } from './babelProposalAccess';

const LIME = '#CCFF00';
const WA_NUMBER = '60126909189';
const ACCESS_CODE = 'acestudio188';
const SESSION_KEY = 'ace_proposal_unlocked';
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
  "Hi STUDIO team! This is Vin from Ace Studio Sarawak — I've reviewed the proposal and would like to proceed.",
)}`;

// ─── Prospect recap (from the 15 Jul 2026 Google Meet) ───────────────────────
const PROSPECT = {
  company: 'Ace Studio Sarawak',
  name: 'Vin Leong',
  phone: '+60 19-831 1391',
  when: '15 Jul 2026, 3:00 PM',
  channel: 'Virtual · Google Meet',
};

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] md:text-[12px] font-mono font-bold uppercase tracking-[0.3em] mb-4" style={{ color: LIME }}>
      {children}
    </p>
  );
}

// ─── Reused from the growthpartner deck ──────────────────────────────────────
// Icon-led benefit slide (title + feature list, centred).
function BenefitSlide({ kicker, Icon, line1, line2, features, note }: {
  kicker: string; Icon: LucideIcon; line1: string; line2: string; features: string[]; note: string;
}) {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <Kicker>{kicker}</Kicker>
      <Icon size={38} strokeWidth={2} className="mx-auto mb-4" style={{ color: LIME }} />
      <h2 className="text-[27px] md:text-[46px] font-black uppercase tracking-tight leading-[0.95] mb-5">
        {line1}<br /><span style={{ color: LIME }}>{line2}</span>
      </h2>
      <div className="space-y-2.5 max-w-md mx-auto mb-5 text-left">
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-3 border border-white/20 px-4 py-2.5">
            <CheckCircle2 size={15} strokeWidth={2.5} className="mt-0.5 flex-shrink-0" style={{ color: LIME }} />
            <span className="text-[12px] md:text-[14px] text-white/85 leading-snug">{f}</span>
          </div>
        ))}
      </div>
      <p className="text-[12px] md:text-[13px] font-black uppercase tracking-wider" style={{ color: LIME }}>{note}</p>
    </div>
  );
}

// Full contents of the package, grouped (from growthpartner slide 8).
const PACKAGE_GROUPS: { title: string; items: string[] }[] = [
  { title: 'Membership Management', items: ['Member profiles — name, ID & photo', 'Plans, renewals & freezes', 'Recurring payments — auto-billed', 'Expiring & unpaid members flagged'] },
  { title: 'Check-in & Access', items: ['QR check-in at the counter', 'Face ID check-in — webcam', 'Every visit logged to the profile', 'Only active members get in'] },
  { title: 'Sell & Get Paid', items: ['Counter POS on your own laptop', 'Payment gateway setup — included', 'Simple inventory tracking', 'Basic sales reports — automatic'] },
  { title: 'Members & Online', items: ['Member app — name, ID & status', 'Your own website for sign-ups', 'Backoffice dashboard', 'Runs on your own laptop'] },
];

// Solution slide — their requirement → how STUDIO settles it.
function SolutionSlide({ n, Icon, need, line1, line2, points }: {
  n: number; Icon: LucideIcon; need: string; line1: string; line2: string; points: string[];
}) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center">
        <Kicker>Solution {n} of 5</Kicker>
        <div className="inline-flex items-start gap-2.5 mb-3 max-w-2xl mx-auto border border-white/20 px-4 py-2.5 text-left">
          <span className="text-[9px] font-mono font-black uppercase tracking-wider text-white/40 mt-0.5 flex-shrink-0">You said</span>
          <span className="text-[12px] md:text-[13px] text-white/70 leading-snug">{need}</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 mt-2">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 md:w-28 md:h-28 flex items-center justify-center border-2" style={{ borderColor: LIME }}>
            <Icon size={44} strokeWidth={2} style={{ color: LIME }} />
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-[26px] md:text-[42px] font-black uppercase tracking-tight leading-[0.95] mb-4">
            {line1}<br /><span style={{ color: LIME }}>{line2}</span>
          </h2>
          <div className="space-y-2 max-w-lg mx-auto md:mx-0 text-left">
            {points.map(p => (
              <div key={p} className="flex items-start gap-2.5 border border-white/20 px-4 py-2.5">
                <CheckCircle2 size={15} strokeWidth={2.5} className="mt-0.5 flex-shrink-0" style={{ color: LIME }} />
                <span className="text-[12px] md:text-[14px] text-white/85 leading-snug">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Code gate ───────────────────────────────────────────────────────────────
function CodeGate({ onUnlock }: { onUnlock: () => void }) {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = code.trim().toLowerCase();
    if (entered === ACCESS_CODE) {
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* noop */ }
      onUnlock();
    } else if (entered === BABEL_ACCESS_CODE) {
      // Babel Fitness password entered at the generic gate — hand off to the
      // Babel deck, already unlocked for this session.
      try { sessionStorage.setItem(BABEL_SESSION_KEY, '1'); } catch { /* noop */ }
      navigate(BABEL_DECK_PATH);
    } else {
      setErr('Invalid access code.');
    }
  };
  return (
    <div className="min-h-[100dvh] bg-black text-white flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm border-2 p-7" style={{ borderColor: LIME, backgroundColor: 'rgba(204,255,0,0.04)' }}>
        <div className="flex items-center gap-2 mb-5">
          <Lock size={16} strokeWidth={2.5} style={{ color: LIME }} />
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em]" style={{ color: LIME }}>Private Proposal</p>
        </div>
        <h1 className="text-[22px] md:text-[26px] font-black uppercase tracking-tight leading-tight mb-1">STUDIO Proposal</h1>
        <p className="text-white/70 text-[12px] mb-6">Enter the access code shared by your STUDIO consultant.</p>
        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/60 mb-2">Access Code</label>
        <input
          type="text" autoFocus value={code}
          onChange={e => { setCode(e.target.value); setErr(null); }}
          className="w-full bg-black border-2 border-white/20 focus:border-white/60 focus:outline-none text-white text-[14px] px-3 py-2.5 mb-3"
        />
        {err && <p className="text-red-400 text-[12px] mb-3">{err}</p>}
        <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-black text-[12px] font-black uppercase tracking-wider hover:opacity-90" style={{ backgroundColor: LIME }}>
          View Proposal <ArrowRight size={14} strokeWidth={2.5} />
        </button>
      </form>
    </div>
  );
}

export default function QStudioAceProposalPage() {
  const [unlocked, setUnlocked] = useState(false);
  useEffect(() => { try { if (sessionStorage.getItem(SESSION_KEY) === '1') setUnlocked(true); } catch { /* noop */ } }, []);

  const [idx, setIdx] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // ── The deck ──────────────────────────────────────────────────────────────
  const slides: { render: () => React.ReactNode }[] = [

    // 1 · COVER + MEETING RECAP
    {
      render: () => (
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 border" style={{ borderColor: LIME, color: LIME }}>
            <Handshake size={12} strokeWidth={3} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]">STUDIO · Private Proposal</span>
          </div>
          <h1 className="text-[30px] md:text-[52px] font-black uppercase tracking-tight leading-[0.95] mb-2">
            Prepared for<br /><span style={{ color: LIME }}>{PROSPECT.company}</span>
          </h1>
          <p className="text-white/70 text-[13px] md:text-[15px] mb-7">Following our meeting — here's how STUDIO solves your requirements.</p>
          <div className="grid grid-cols-2 gap-2.5 max-w-lg mx-auto text-left">
            {[
              ['Meeting', PROSPECT.when],
              ['Channel', PROSPECT.channel],
              ['Contact', PROSPECT.name],
              ['Phone', PROSPECT.phone],
            ].map(([k, v]) => (
              <div key={k} className="border border-white/20 px-4 py-2.5">
                <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/40">{k}</div>
                <div className="text-[13px] font-bold text-white">{v}</div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[11px] font-mono uppercase tracking-[0.25em] text-white/40 animate-pulse">Tap or swipe to begin →</p>
        </div>
      ),
    },

    // 2 · CURRENT CHALLENGE
    {
      render: () => (
        <div className="max-w-3xl mx-auto text-center">
          <Kicker>Where you are today</Kicker>
          <DoorOpen size={40} strokeWidth={2} className="mx-auto mb-5" style={{ color: LIME }} />
          <h2 className="text-[28px] md:text-[46px] font-black uppercase tracking-tight leading-[0.95] mb-6">
            Two floors. Two door systems.<br /><span style={{ color: LIME }}>Nothing talks to each other.</span>
          </h2>
          <p className="text-white/70 text-[14px] md:text-[16px] max-w-xl mx-auto leading-relaxed mb-6">
            Your 1st and 2nd floor both have Face ID door access — but neither is linked to your Reserv
            membership system. So doors don't know who's a paid member, and someone has to open them manually.
          </p>
          <div className="inline-flex items-center gap-2 border-2 px-4 py-2.5" style={{ borderColor: LIME }}>
            <ScanFace size={16} strokeWidth={2.5} style={{ color: LIME }} />
            <span className="text-[12px] font-black uppercase tracking-wider text-white">STUDIO links membership → your door hardware</span>
          </div>
        </div>
      ),
    },

    // 3 · SOLUTION 1 — membership ↔ face door access
    {
      render: () => (
        <SolutionSlide
          n={1}
          Icon={DoorOpen}
          need="Connect our membership system to the Face ID door access on both floors — so we don't open doors manually."
          line1="Doors that know"
          line2="your members."
          points={[
            'Link your existing Face ID door access (1st & 2nd floor) to STUDIO membership',
            'Active member → door opens automatically, no staff needed',
            'Expired or unpaid → access denied right at the door',
            'Every entry logged per member, per floor',
          ]}
        />
      ),
    },

    // 4 · SOLUTION 2 — credit sharing (1 friend, capped, time-limited)
    {
      render: () => (
        <SolutionSlide
          n={2}
          Icon={Gift}
          need="Members share credits via the Loyalty App — but only to 1 friend, a capped amount, usable within a set period."
          line1="Share credits —"
          line2="on your rules."
          points={[
            'Members share class credits from the Loyalty App',
            'Restricted to ONE friend only (e.g. Aaron → Alice)',
            'Capped amount per share (e.g. 4 credits)',
            'Shared credits expire within a set validity window',
          ]}
        />
      ),
    },

    // 5 · SOLUTION 3 — prepaid credits → deduct on booking
    {
      render: () => (
        <SolutionSlide
          n={3}
          Icon={Wallet}
          need="Members buy credits (RM X) in the app, then each class booking deducts from that balance."
          line1="Buy credits,"
          line2="book with them."
          points={[
            'Members top up a credit balance in the Loyalty App (RM X)',
            'Every class booking deducts from their balance automatically',
            'Balance & spend history visible to member and owner',
            'No cash at the desk — bookings settle from prepaid credit',
          ]}
        />
      ),
    },

    // 6 · SOLUTION 4 — instructor Staff App + venue calendar
    {
      render: () => (
        <SolutionSlide
          n={4}
          Icon={CalendarCheck}
          need="Instructors use the Staff App to see a venue/room calendar — if it's booked, they can't book it again."
          line1="No more"
          line2="double-booked rooms."
          points={[
            'Instructors/providers use the Staff App to view each venue/room calendar',
            'Booked slots are blocked — a taken room can\'t be double-booked',
            'Real-time availability across all rooms & floors',
            'Every booking tied to the instructor who made it',
          ]}
        />
      ),
    },

    // 7 · SOLUTION 5 — QHub attendance report → instructor pay
    {
      render: () => (
        <SolutionSlide
          n={5}
          Icon={ClipboardList}
          need="In QHub, the owner views an attendance report (classes + students) to decide instructor payment."
          line1="Pay instructors"
          line2="by the numbers."
          points={[
            'QHub attendance report: classes held + students per class',
            'Totals broken down per instructor/provider',
            'Owner decides each instructor\'s payout from real attendance data',
            'Export-ready for payroll',
          ]}
        />
      ),
    },

    // 8 · WHY STUDIO — one system
    {
      render: () => (
        <div className="max-w-3xl mx-auto text-center">
          <Kicker>Why STUDIO</Kicker>
          <LayoutGrid size={40} strokeWidth={2} className="mx-auto mb-5" style={{ color: LIME }} />
          <h2 className="text-[28px] md:text-[46px] font-black uppercase tracking-tight leading-[0.95] mb-6">
            One system.<br /><span style={{ color: LIME }}>Every requirement — handled.</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-xl mx-auto text-left">
            {[
              'Membership linked to your door hardware',
              'Loyalty App — credit sharing & prepaid credits',
              'Staff App — venue calendar, no double-booking',
              'QHub — attendance reports for instructor pay',
              'Recurring payments, auto-billed',
              'Enterprise-grade platform behind 500+ businesses',
            ].map(f => (
              <div key={f} className="flex items-start gap-2 border border-white/20 px-3.5 py-2.5">
                <Check size={13} strokeWidth={3} className="mt-0.5 flex-shrink-0" style={{ color: LIME }} />
                <span className="text-[12px] text-white/85 leading-snug">{f}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },

    // ── Merged from the STUDIO Growth Partner deck (the core value story) ──

    // 9 · Know every member
    {
      render: () => (
        <BenefitSlide
          kicker="Access control · included"
          Icon={ScanFace}
          line1="Know every member"
          line2="who walks in."
          features={[
            'Face ID & QR check-in — linked to your door hardware',
            'Expired or unpaid members flagged instantly',
            "Every visit logged to the member's profile",
          ]}
          note="No more free riders — only paying members get in."
        />
      ),
    },

    // 10 · Collect payments automatically
    {
      render: () => (
        <BenefitSlide
          kicker="Recurring payments · included"
          Icon={CreditCard}
          line1="Collect payments"
          line2="automatically."
          features={[
            'Memberships auto-bill every cycle — card on file',
            'Renewals collected on time, no reminders',
            'Full payment history on every member',
          ]}
          note="No more chasing. The money just arrives."
        />
      ),
    },

    // 11 · Reports done automatically
    {
      render: () => (
        <BenefitSlide
          kicker="Reporting · included"
          Icon={BarChart3}
          line1="All your reports,"
          line2="done automatically."
          features={[
            'Daily sales summed up for you',
            'Check-ins, classes & attendance tallied live',
            "Open your dashboard — it's already done",
          ]}
          note="Close the studio, go home. The paperwork is finished."
        />
      ),
    },

    // 12 · A complete gym system
    {
      render: () => (
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <Kicker>What STUDIO covers</Kicker>
            <h2 className="text-[26px] md:text-[40px] font-black uppercase tracking-tight leading-tight mb-2">
              A complete studio system.<br className="hidden md:block" /> Day one.
            </h2>
            <p className="text-white/60 text-[12px] md:text-[14px] mb-7">Four jobs, handled — on the same enterprise-grade platform our biggest clients run on.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
            {[
              { Icon: ScanFace,   title: 'Your Front Door', items: ['Face ID + QR — linked to your doors', 'Every member verified, every visit logged'] },
              { Icon: CreditCard, title: 'Your Money',      items: ['Recurring payments — auto-billed', 'Prepaid credits & credit sharing'] },
              { Icon: Monitor,    title: 'Your Office',      items: ['Backoffice + QHub attendance reports', 'Sales reports automatic · simple inventory'] },
              { Icon: Smartphone, title: 'Your Members',     items: ['Member & Loyalty app', 'Staff app — venue calendar & bookings'] },
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
        </div>
      ),
    },

    // 13 · The full package list (phases)
    {
      render: () => (
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <Kicker>Everything inside</Kicker>
            <h2 className="text-[26px] md:text-[40px] font-black uppercase tracking-tight leading-tight mb-6">
              The complete platform.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
            {PACKAGE_GROUPS.map(group => (
              <div key={group.title} className="border-2 border-white/20">
                <div className="px-3 py-1.5 text-[10.5px] font-black uppercase tracking-[0.12em] text-black" style={{ backgroundColor: LIME }}>{group.title}</div>
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
        </div>
      ),
    },

    // 14 · Payment & disbursement
    {
      render: () => (
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <Kicker>Getting paid · fast & clear</Kicker>
            <h2 className="text-[24px] md:text-[40px] font-black uppercase tracking-tight leading-tight mb-2">
              Your money, in your bank<br className="hidden md:block" /> — in days, not weeks.
            </h2>
            <p className="text-white/60 text-[12px] md:text-[14px] mb-7">Two ways to get paid — collection is included either way.</p>
          </div>
          <div className="flex flex-col md:flex-row items-stretch gap-3">
            <div className="flex-1 border-2 p-5" style={{ borderColor: LIME }}>
              <div className="flex items-center gap-2.5 mb-3">
                <CreditCard size={20} strokeWidth={2.5} style={{ color: LIME }} />
                <span className="text-[13px] font-black uppercase tracking-tight">With your own card facility</span>
              </div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2 text-[12px] md:text-[13px] text-white/85 leading-snug"><Check size={13} strokeWidth={3} className="mt-0.5 flex-shrink-0" style={{ color: LIME }} />Payment goes straight to your merchant account</li>
                <li className="flex items-start gap-2 text-[12px] md:text-[13px] text-white/85 leading-snug"><Banknote size={13} strokeWidth={3} className="mt-0.5 flex-shrink-0" style={{ color: LIME }} />Disbursed to you fast</li>
              </ul>
              <div className="flex items-center gap-2 border-t border-white/15 pt-3">
                <Clock size={16} strokeWidth={2.5} style={{ color: LIME }} />
                <span className="text-[22px] font-black leading-none" style={{ color: LIME }}>T+2</span>
                <span className="text-[11px] font-mono text-white/60">within 2 working days</span>
              </div>
            </div>
            <div className="flex-1 border-2 border-white/30 p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <Handshake size={20} strokeWidth={2.5} className="text-white/80" />
                <span className="text-[13px] font-black uppercase tracking-tight">Without a card facility</span>
              </div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2 text-[12px] md:text-[13px] text-white/85 leading-snug"><Check size={13} strokeWidth={3} className="mt-0.5 flex-shrink-0 text-white/70" />We collect it for you — QBOT handles the gateway</li>
                <li className="flex items-start gap-2 text-[12px] md:text-[13px] text-white/85 leading-snug"><Banknote size={13} strokeWidth={3} className="mt-0.5 flex-shrink-0 text-white/70" />Then disbursed to your bank</li>
              </ul>
              <div className="flex items-center gap-2 border-t border-white/15 pt-3">
                <Clock size={16} strokeWidth={2.5} className="text-white/80" />
                <span className="text-[22px] font-black leading-none text-white">T+5</span>
                <span className="text-[11px] font-mono text-white/60">within 5 working days</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // 15 · QSentry AI — optional add-on
    {
      render: () => (
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 border px-2.5 py-1 mb-3" style={{ borderColor: LIME }}>
            <span className="text-[9px] font-mono font-black uppercase tracking-[0.2em]" style={{ color: LIME }}>Optional add-on · additional charges</span>
          </div>
          <ShieldAlert size={40} strokeWidth={2.5} className="mx-auto mb-4" style={{ color: LIME }} />
          <h2 className="text-[28px] md:text-[46px] font-black uppercase tracking-tight leading-[0.95] mb-5">
            QSentry AI.<br /><span style={{ color: LIME }}>The eyes on your door.</span>
          </h2>
          <p className="text-white/70 text-[13px] md:text-[15px] max-w-xl mx-auto leading-relaxed mb-6">
            An AI watch-camera that catches tailgaters and non-members slipping past your Face ID doors —
            snaps the photo, logs the track and alerts you instantly. Ideal across your two floors.
          </p>
          <div className="space-y-2 max-w-md mx-auto text-left">
            {['Anti-tailgating — spots two people on one entry', 'Non-member detection — flags unknown faces', 'Instant photo alerts to your phone / Telegram', 'Evidence log of every alert, timestamped'].map(f => (
              <div key={f} className="flex items-start gap-2.5 border border-white/20 px-4 py-2.5">
                <Camera size={15} strokeWidth={2.5} className="mt-0.5 flex-shrink-0" style={{ color: LIME }} />
                <span className="text-[12px] md:text-[13px] text-white/85 leading-snug">{f}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },

    // 16 · THE OFFER
    {
      render: () => (
        <div className="max-w-3xl mx-auto text-center relative">
          <div aria-hidden className="absolute -top-6 right-0 md:-right-8 -rotate-[8deg] pointer-events-none select-none">
            <div className="inline-flex flex-col items-center px-3 py-1.5 border-[3px]" style={{ borderColor: LIME, color: LIME }}>
              <span className="text-[8px] font-mono font-black uppercase tracking-[0.25em] leading-tight">Special</span>
              <span className="text-[13px] font-black uppercase tracking-[0.1em] leading-none mt-0.5">Partnership</span>
            </div>
          </div>
          <Kicker>Your special partnership</Kicker>
          <h2 className="text-[26px] md:text-[42px] font-black uppercase tracking-tight leading-[0.95] mb-3">
            Zero monthly.<br /><span style={{ color: LIME }}>We earn only when you do.</span>
          </h2>
          <div className="inline-flex flex-col items-center border-2 px-8 py-5 mb-4" style={{ borderColor: LIME }}>
            <div className="flex items-baseline justify-center gap-2 flex-wrap">
              <span className="text-[24px] md:text-[32px] font-black text-white/40 line-through leading-none">RM499</span>
              <span className="text-[48px] md:text-[62px] font-black leading-none" style={{ color: LIME }}>RM0</span>
              <span className="text-[15px] font-mono text-white/70">/mo</span>
              <span className="text-[30px] md:text-[40px] font-black leading-none text-white">+ 5%</span>
            </div>
            <div className="text-[10px] font-mono text-white/50 mt-2">on transactions incl. bank charges · Face ID &amp; QR check-in included</div>
          </div>
          <p className="text-white/70 text-[12px] md:text-[14px] max-w-xl mx-auto leading-relaxed">
            No fixed monthly software fee — we take a small share of transactions instead. Loyalty (credit sharing
            &amp; prepaid), class/venue booking and door-access integration are set up for your two-floor studio.
          </p>
        </div>
      ),
    },

    // 17 · YOUR INVESTMENT — quote summary
    {
      render: () => (
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <Kicker>Your investment</Kicker>
            <h2 className="text-[26px] md:text-[40px] font-black uppercase tracking-tight leading-tight mb-5">Tailored for Ace Studio.</h2>
          </div>
          <div className="border-2 border-white/25 divide-y divide-white/10 max-w-xl mx-auto">
            {[
              ['STUDIO Software', 'RM499 → RM0/mo + 5%'],
              ['Loyalty App — credit share + prepaid credits', 'included'],
              ['Class Scheduling & Venue Booking', 'included'],
              ['Door-access integration — both floors', 'quoted after site survey'],
              ['Setup, hardware & installation', 'see full quote'],
            ].map(([t, v]) => (
              <div key={t} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <span className="text-[12px] md:text-[13px] text-white/85 leading-snug">{t}</span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider flex-shrink-0" style={{ color: LIME }}>{v}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <a
              href="/qstudio/growthquote"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-black text-[13px] font-black uppercase tracking-wider hover:opacity-90"
              style={{ backgroundColor: LIME }}
            >
              <FileText size={15} strokeWidth={2.5} /> Open the full itemised quote
            </a>
            <p className="text-[10px] font-mono text-white/40 mt-3">RM499 → RM0 monthly + 5% of transactions incl. bank charges · hardware quoted after site survey</p>
          </div>
        </div>
      ),
    },

    // 18 · CLOSE
    {
      render: () => (
        <div className="max-w-2xl mx-auto text-center">
          <TrendingUp size={36} strokeWidth={2.5} className="mx-auto mb-5" style={{ color: LIME }} />
          <h2 className="text-[30px] md:text-[50px] font-black uppercase tracking-tight leading-[0.95] mb-5">
            Ready to link it<br /><span style={{ color: LIME }}>all together, Vin?</span>
          </h2>
          <p className="text-white/70 text-[13px] md:text-[15px] max-w-lg mx-auto leading-relaxed mb-8">
            One platform for {PROSPECT.company} — doors, credits, bookings and instructor pay, all connected.
            Let's lock in your rollout.
          </p>
          <a
            href={WA_LINK} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 text-black text-[14px] font-black uppercase tracking-wider hover:opacity-90"
            style={{ backgroundColor: LIME, boxShadow: '0 4px 0 0 rgba(255,255,255,0.25)' }}
          >
            <MessageCircle size={16} strokeWidth={2.5} /> WhatsApp the STUDIO Team
          </a>
          <p className="text-[9.5px] text-white/40 leading-relaxed mt-10">
            Crave Asia Sdn Bhd · Trade Reg. Nr. 914475-H (201001030554) · www.craveasia.com
          </p>
        </div>
      ),
    },
  ];

  const last = slides.length - 1;
  const next = useCallback(() => setIdx(i => Math.min(last, i + 1)), [last]);
  const prev = useCallback(() => setIdx(i => Math.max(0, i - 1)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!unlocked) return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter' || e.key === 'PageDown') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, unlocked]);

  const onTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('a,button,input,label')) { touchStart.current = null; return; }
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x, dy = t.clientY - start.y;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    if (dx < 0) next(); else prev();
  };

  // Fit-to-viewport scaling (same as growthpartner)
  const bodyRef = useRef<HTMLDivElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    if (!unlocked) return;
    const measure = () => {
      const body = bodyRef.current;
      const child = fitRef.current?.firstElementChild as HTMLElement | null;
      if (!body || !child) return;
      const availH = body.clientHeight - 28, availW = body.clientWidth - 36;
      const ch = child.offsetHeight, cw = child.offsetWidth;
      if (ch <= 0 || cw <= 0) return;
      setScale(Math.max(0.5, Math.min(Math.min(availH / ch, availW / cw), 1.9)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (bodyRef.current) ro.observe(bodyRef.current);
    const child = fitRef.current?.firstElementChild;
    if (child) ro.observe(child as Element);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [idx, unlocked]);

  if (!unlocked) {
    return (
      <>
        <SEOHead title="STUDIO Proposal" noindex />
        <CodeGate onUnlock={() => setUnlocked(true)} />
      </>
    );
  }

  const slide = slides[idx];

  return (
    <main className="h-[100dvh] flex flex-col overflow-hidden antialiased bg-black text-white">
      <SEOHead title={`STUDIO Proposal · ${PROSPECT.company}`} noindex />
      <style>{`
        @keyframes gpSlideIn { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .gp-slide { animation: gpSlideIn .45s cubic-bezier(.22,.9,.3,1) both; }
      `}</style>

      {/* Progress bar */}
      <div className="h-1 w-full flex-shrink-0 bg-white/10">
        <div className="h-full transition-all duration-300" style={{ width: `${((idx + 1) / slides.length) * 100}%`, backgroundColor: LIME }} />
      </div>

      {/* Header strip */}
      <div className="flex items-center justify-between px-5 py-3 flex-shrink-0 relative z-10">
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-white/50">STUDIO · {PROSPECT.company}</span>
        <span className="text-[10px] font-mono font-bold tabular-nums text-white/50">
          {String(idx + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
      </div>

      {/* Slide body */}
      <div
        ref={bodyRef}
        key={idx}
        className="gp-slide relative flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex items-center px-5 py-4 cursor-pointer"
        onClick={(e) => { if ((e.target as HTMLElement).closest('a,button,input,label')) return; next(); }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div ref={fitRef} className="w-full relative z-10" style={{ transform: `scale(${scale})`, transformOrigin: 'center center', transition: 'transform .18s ease-out' }}>
          {slide.render()}
        </div>
      </div>

      {/* Footer nav */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 flex-shrink-0 relative z-10">
        <button type="button" onClick={prev} disabled={idx === 0} className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-black uppercase tracking-wider border-2 border-white/30 text-white hover:border-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed">
          <ArrowLeft size={13} strokeWidth={3} /> Back
        </button>
        <div className="hidden md:flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button key={i} type="button" aria-label={`Go to slide ${i + 1}`} onClick={() => setIdx(i)} className="w-2 h-2 transition-all" style={{ backgroundColor: i === idx ? LIME : 'rgba(255,255,255,0.2)', transform: i === idx ? 'scale(1.4)' : undefined }} />
          ))}
        </div>
        {idx === last ? (
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-5 py-2.5 text-[11px] font-black uppercase tracking-wider text-black hover:opacity-90" style={{ backgroundColor: LIME }}>
            <MessageCircle size={13} strokeWidth={3} /> WhatsApp Us
          </a>
        ) : (
          <button type="button" onClick={next} className="inline-flex items-center gap-1.5 px-5 py-2.5 text-[11px] font-black uppercase tracking-wider text-black hover:opacity-90" style={{ backgroundColor: LIME }}>
            Next <ArrowRight size={13} strokeWidth={3} />
          </button>
        )}
      </div>
    </main>
  );
}
