// QSTUDIO / INTRO — interactive slide-by-slide questionnaire.
//
// INTERNAL / UNLISTED. Not linked from any nav or footer, noindex/nofollow,
// blocked in robots.txt, and intentionally LEFT OUT of scripts/prerender-meta.mjs
// so no crawler-friendly static HTML or social card is baked. Reachable only by
// typing the URL — meant to be sent one-to-one to a prospect.
//
// FORMAT (sleek card deck): pick a business type, then walk 10 short cards.
// Each card = a full-colour photo on top + a tight benefit blurb below, and the
// prospect answers "Do you need this?" (No need / Need this / Urgently need) at
// the bottom-centre — that answer is what advances the deck. After the 10th card
// they leave a phone number and tap a WhatsApp button pre-filled with exactly
// what they picked, so the sales side knows how to reply.
//
// One card on screen at a time = content is revealed progressively, not dumped
// as a scrapeable feature wall. Brand synced to /qstudio: black + lime (#CCFF00).

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowRight, ArrowLeft, MessageCircle, X, RotateCcw,
  FileCheck2, CreditCard, ScanFace, ShieldAlert, CalendarCheck,
  Gift, Send, LayoutGrid, Dumbbell, Scissors, Flower2, Stethoscope,
  Ticket, Heart, Camera, Eye, Users,
  Monitor, Globe, Smartphone, Tablet, Puzzle,
  Check, Zap, Minus, MapPin, ShieldCheck, Package,
  type LucideIcon,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';

// ────────────────────────────────────────────────────────────────
// CONSTANTS — same WhatsApp line as /qstudio
// ────────────────────────────────────────────────────────────────
const WA_NUMBER = '60126909189';
const WA_DEMO = `https://wa.me/${WA_NUMBER}?text=` + encodeURIComponent("Hi, I'd like to book a STUDIO demo at Publika KL.");

// ────────────────────────────────────────────────────────────────
// BUSINESS TYPES (first screen)
// ────────────────────────────────────────────────────────────────
type Biz = { id: string; label: string; Icon: LucideIcon; img: string };
const BUSINESSES: Biz[] = [
  { id: 'gym',    label: 'Gym & Studio',         Icon: Dumbbell,    img: '/qfitimg/studioimg/for_gym.png' },
  { id: 'salon',  label: 'Salon & Beauty',       Icon: Scissors,    img: '/qfitimg/headers/qfit-salon.jpg' },
  { id: 'spa',    label: 'Spa & Massage',        Icon: Flower2,     img: '/qfitimg/headers/qfit-massage.jpg' },
  { id: 'clinic', label: 'Clinic & Aesthetics',  Icon: Stethoscope, img: '/qfitimg/studioimg/for_wellness.jpg' },
  { id: 'park',   label: 'Park & Playland',      Icon: Ticket,      img: '/qfitimg/studioimg/for_indoor_theme.jpg' },
  { id: 'club',   label: "Wellness / Club",      Icon: Heart,       img: '/qfitimg/studioimg/for_spa.jpg' },
];

// ────────────────────────────────────────────────────────────────
// THE 10 CARDS — short, benefit-first, image-led
// ────────────────────────────────────────────────────────────────
type Slide = {
  Icon: LucideIcon;
  kicker: string;
  title: string;
  line: string;
  chips: string[];
  img: string;
  badge?: string;
  strip?: 'sentry' | 'channels';
  hardware?: boolean;   // if needed → ask Door Lock vs Turnstile
  plugins?: boolean;    // this card = the multi-select plugin list
};

const SLIDES: Slide[] = [
  {
    Icon: FileCheck2, kicker: 'Sign up',
    title: 'Members live in seconds.',
    line: 'They sign up themselves — kiosk, web or phone. The IC reader fills the form, the waiver is signed on screen.',
    chips: ['Self sign-up', 'IC autofill', 'Digital waiver'],
    img: '/qfitimg/studioimg/app_membership.jpg',
  },
  {
    Icon: CreditCard, kicker: 'Membership',
    title: 'Renewals collect themselves.',
    line: 'Card on file auto-charges each cycle. A one-off decline retries instead of cancelling a good member.',
    chips: ['Auto-billing', 'Smart retry', 'FPX & e-wallets'],
    img: '/qfitimg/studioimg/01_membership.jpg',
  },
  {
    Icon: ScanFace, kicker: 'Check in',
    title: 'The face is the key.',
    line: 'Face-ID opens the door in about a second. No card to lend, no QR to screenshot. Every entry logged.',
    chips: ['Face-ID gate', '1-second match', 'Entry log'],
    img: '/qfitimg/studioimg/02_checkin.jpg',
    hardware: true,
  },
  {
    Icon: ShieldAlert, kicker: 'Sentry mode', badge: 'NEW',
    title: 'Tailgaters issue?\nLet AI be the EYES.',
    line: 'An AI watch-camera catches what the gate can’t — two people slipping in on one tap, or a face that isn’t a member. It snaps the photo, pings your Telegram, and posts repeat offenders to the Hall of Shame.',
    chips: ['Anti-tailgating', 'Non-member spotting (beta)', 'Telegram alerts', 'Hall of Shame'],
    img: '/qsecurity/sentry-cctv.jpg',
    strip: 'sentry',
  },
  {
    Icon: CalendarCheck, kicker: 'Booking',
    title: 'Members book themselves.',
    line: 'Web, app or front desk — one shared calendar. Cancellations auto-refill from the waitlist; a deposit holds the seat.',
    chips: ['Self-booking', 'Auto-waitlist', 'Deposit to confirm'],
    img: '/qfitimg/studioimg/03_booking.jpg',
  },
  {
    Icon: Users, kicker: 'Staff & commissions',
    title: 'Staff that sell more.',
    line: 'Commissions calculate themselves — %, flat or tiered, where the preview equals the payout. Staff see targets and a leaderboard on their phone.',
    chips: ['Auto-commissions', 'Preview = payout', 'Staff app', 'Leaderboards'],
    img: '/qfitimg/studioimg/analytics2.jpg',
  },
  {
    Icon: Gift, kicker: 'Rewards',
    title: 'Make them come back.',
    line: 'Points on every visit, birthday rewards and win-back nudges fire automatically — no chasing.',
    chips: ['Loyalty points', 'Birthday vouchers', 'Win-back nudges'],
    img: '/qfitimg/studioimg/04_rewards.jpeg',
  },
  {
    Icon: Send, kicker: 'Report',
    title: 'The business texts you.',
    line: 'Each morning: takings, check-ins, sign-ups and who’s about to churn — on your phone. Big events ping live.',
    chips: ['Daily summary', 'At-risk alerts', 'Full dashboard'],
    img: '/qfitimg/studioimg/05_report.jpg',
  },
  {
    Icon: LayoutGrid, kicker: 'One platform',
    title: 'One system.\nEvery channel.',
    line: 'POS, webstore, member app and self-service kiosk — all sharing one catalogue, one member, one report.',
    chips: ['One login', 'One catalogue', 'Multi-outlet'],
    img: '/qfitimg/studioimg/06_customize.png',
    strip: 'channels',
  },
  {
    Icon: Puzzle, kicker: 'Add-ons', badge: 'OPTIONAL',
    title: 'Plug in more power.',
    line: 'Many plugins to power your business — switch on only what you need, add the rest when you’re ready.',
    chips: ['AutoWhatsApp', 'eSign', 'Together', 'Showcase', 'Rental', 'Ticketing', '+ more'],
    img: '/qfitimg/studioimg/ticketing_customized.jpg',
    plugins: true,
  },
];

// Channels shown on the "One platform" card
const CHANNELS: { Icon: LucideIcon; label: string }[] = [
  { Icon: Monitor,    label: 'POS' },
  { Icon: Globe,      label: 'Webstore' },
  { Icon: Smartphone, label: 'Member App' },
  { Icon: Tablet,     label: 'Self-Service Kiosk' },
];

// The 3 ultimate benefits shown on the landing screen
const BENEFITS: { Icon: LucideIcon; title: string; desc: string }[] = [
  { Icon: Zap,         title: 'Automated',    desc: 'Sign-ups, billing & reminders run themselves.' },
  { Icon: Users,       title: 'Less staff',   desc: 'Members self-serve — do more with a smaller team.' },
  { Icon: ShieldCheck, title: 'Mistake-free', desc: 'No spreadsheets, double-bookings or missed renewals.' },
];

// The questionnaire answers
type Rating = 'no' | 'need' | 'urgent';
const RATINGS: { id: Rating; label: string; Icon: LucideIcon }[] = [
  { id: 'no',     label: 'No need',       Icon: Minus },
  { id: 'need',   label: 'Need this',     Icon: Check },
  { id: 'urgent', label: 'Urgently need', Icon: Zap },
];

// Entry hardware — mirrors /qstudio (Door Lock vs Turnstile/Auto-gate)
type Hw = 'doorlock' | 'turnstile';
const HARDWARE: { id: Hw; label: string; desc: string; img: string }[] = [
  { id: 'doorlock',  label: 'Door Lock', desc: 'One door — boutique gym or single entrance. No turnstile.', img: '/qfitimg/studioimg/type-doorlock.jpg' },
  { id: 'turnstile', label: 'Turnstile', desc: 'High traffic — big gyms, parks & attractions. Anti-tailgating.', img: '/qfitimg/studioimg/type-faceid.jpg' },
];
// Entry hardware only makes sense for gated venues
const ENTRY_BIZ = new Set(['gym', 'park']);
const hwLabel = (h?: Hw) => (h === 'doorlock' ? 'Door Lock' : h === 'turnstile' ? 'Turnstile' : '');

// Plugin catalogue — one-page multi-select on the last card
const PLUGINS_LIST: { id: string; name: string; desc: string; Icon: LucideIcon }[] = [
  { id: 'autowa',   name: 'AutoWhatsApp',    desc: 'Booking confirmations & reminders on WhatsApp.', Icon: MessageCircle },
  { id: 'esign',    name: 'eSign',           desc: 'Waivers, consents & agreements signed on any device.', Icon: FileCheck2 },
  { id: 'together', name: 'Together',        desc: 'Member challenges, squads & leaderboards.', Icon: Users },
  { id: 'showcase', name: 'Showcase',        desc: 'Public staff profiles with a “book with me” link.', Icon: Eye },
  { id: 'rental',   name: 'Rental',          desc: 'Rent out gear, lockers & equipment — tracked.', Icon: Package },
  { id: 'ticket',   name: 'Ticketing',       desc: 'QR event tickets, day passes & validation.', Icon: Ticket },
  { id: 'feedback', name: 'Feedback',        desc: 'Post-visit ratings & NPS, ranked per staff.', Icon: Heart },
  { id: 'qverify',  name: 'QVerify (NRIC)',  desc: 'Verify identity & age by MyKad or passport.', Icon: ShieldCheck },
  { id: 'reminder', name: 'Reminder / Push', desc: 'Auto nudges: birthdays, expiry, inactivity.', Icon: Send },
];

// ────────────────────────────────────────────────────────────────
// SMALL BITS
// ────────────────────────────────────────────────────────────────
function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 bg-white/[0.03] text-white/85 text-[11px] md:text-[12px] font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]" /> {label}
    </span>
  );
}

// ────────────────────────────────────────────────────────────────
// BUSINESS PICKER
// ────────────────────────────────────────────────────────────────
function BusinessPicker({ onPick }: { onPick: (b: Biz) => void }) {
  return (
    <div className="min-h-[100svh] flex flex-col items-center justify-center px-4 py-12 relative overflow-y-auto">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-40"
        style={{ backgroundImage: 'radial-gradient(rgba(204,255,0,0.10) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full bg-[#CCFF00]/10 blur-[120px] pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-3xl text-center">
        <span className="inline-block text-[#CCFF00] text-[10px] md:text-[11px] font-mono uppercase tracking-[0.3em] mb-4">
          STUDIO · All-in-one platform
        </span>
        <h1 className="text-[22px] sm:text-3xl md:text-[40px] font-black uppercase tracking-tight leading-[1.1] mb-4">
          Bookings, payments, memberships, check-in —{' '}
          <span className="text-[#CCFF00]">all in one place with STUDIO.</span>
        </h1>
        <p className="text-gray-300 text-[14px] md:text-[17px] leading-relaxed max-w-xl mx-auto mb-8">
          Works on POS, web and app. One login, one bill, no more juggling 5 different softwares.
        </p>

        {/* the 3 ultimate benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10 text-left">
          {BENEFITS.map((b, i) => (
            <div key={b.title} className="flex sm:flex-col items-center sm:items-start gap-3 p-4 rounded-2xl border border-white/10 bg-white/[0.03]"
              style={{ animation: `intro-pop 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s both` }}>
              <span className="inline-flex items-center justify-center w-10 h-10 shrink-0 rounded-xl bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00]">
                <b.Icon size={20} strokeWidth={2} />
              </span>
              <div>
                <p className="text-white font-black uppercase text-[14px] tracking-wide">{b.title}</p>
                <p className="text-gray-400 text-[12px] leading-snug">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-white/70 text-[12px] md:text-[13px] font-mono uppercase tracking-[0.25em] mb-5">
          60-second tour — what do you run?
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {BUSINESSES.map((b, i) => (
            <button key={b.id} onClick={() => onPick(b)}
              className="group relative aspect-[5/4] overflow-hidden rounded-2xl border border-white/12 hover:border-[#CCFF00] transition-all duration-200"
              style={{ animation: `intro-pop 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s both` }}>
              <img src={b.img} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-end p-3 md:p-4">
                <b.Icon size={22} strokeWidth={2} className="text-[#CCFF00] mb-1.5" />
                <span className="text-white font-bold text-[12px] md:text-[14px] leading-tight text-center">{b.label}</span>
              </div>
            </button>
          ))}
        </div>

        <a href={WA_DEMO} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-8 text-white/45 hover:text-white text-[11px] font-bold uppercase tracking-wider transition-colors">
          Or just talk to us <ArrowRight size={12} strokeWidth={2.5} />
        </a>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// A STEP CARD — photo on top, copy below (centred, readable)
// ────────────────────────────────────────────────────────────────
function StepCard({ slide, n, total, dir }: { slide: Slide; n: number; total: number; dir: number }) {
  return (
    <div key={n} className="w-full max-w-lg mx-auto"
      style={{ animation: `${dir >= 0 ? 'intro-slide-l' : 'intro-slide-r'} 0.4s cubic-bezier(0.16,1,0.3,1) both` }}>
      <div className="rounded-3xl overflow-hidden border border-white/10 bg-[#0b0b0b] shadow-2xl shadow-black/60">
        {/* full-colour photo */}
        <div className="relative h-44 sm:h-56">
          <img src={slide.img} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0b0b0b] to-transparent" />
          {slide.badge && (
            <span className="absolute top-3 right-3 px-2.5 py-1 bg-[#CCFF00] text-black text-[10px] font-black uppercase tracking-wider rounded-full">{slide.badge}</span>
          )}
        </div>

        {/* copy */}
        <div className="px-6 sm:px-8 pt-5 pb-7 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <slide.Icon size={15} strokeWidth={2.2} className="text-[#CCFF00]" />
            <span className="text-[#CCFF00] text-[10px] md:text-[11px] font-mono uppercase tracking-[0.28em]">
              Step {n + 1} / {total} · {slide.kicker}
            </span>
          </div>

          <h2 className="text-[26px] sm:text-4xl font-black uppercase tracking-tight leading-[0.95] whitespace-pre-line mb-3">
            {slide.title}
          </h2>

          <p className="text-gray-300 text-[13.5px] md:text-[15px] leading-relaxed mb-5">
            {slide.line}
          </p>

          {/* default chips */}
          {!slide.strip && (
            <div className="flex flex-wrap justify-center gap-2">
              {slide.chips.map(c => <Chip key={c} label={c} />)}
            </div>
          )}

          {/* channels: POS · Webstore · App · Kiosk */}
          {slide.strip === 'channels' && (
            <>
              <div className="grid grid-cols-2 gap-2.5 mb-3">
                {CHANNELS.map(c => (
                  <div key={c.label} className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border border-[#CCFF00]/25 bg-[#CCFF00]/[0.04]">
                    <c.Icon size={22} strokeWidth={1.8} className="text-[#CCFF00]" />
                    <span className="text-white text-[11px] font-bold uppercase tracking-wider text-center leading-tight">{c.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {slide.chips.map(c => <Chip key={c} label={c} />)}
              </div>
            </>
          )}

          {/* sentry: chips + snap → telegram → hall-of-shame */}
          {slide.strip === 'sentry' && (
            <>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {slide.chips.map(c => <Chip key={c} label={c} />)}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 text-white/70 text-[10px] font-mono uppercase tracking-[0.16em]">
                <span className="inline-flex items-center gap-1.5"><Camera size={13} className="text-[#CCFF00]" /> Snap</span>
                <ArrowRight size={11} className="text-white/30" />
                <span className="inline-flex items-center gap-1.5"><Send size={13} className="text-[#CCFF00]" /> Telegram</span>
                <ArrowRight size={11} className="text-white/30" />
                <span className="inline-flex items-center gap-1.5"><Eye size={13} className="text-[#CCFF00]" /> Hall of Shame</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// BOTTOM QUESTIONNAIRE BAR
// ────────────────────────────────────────────────────────────────
function RatingBar({ answer, onAnswer, onBack, canBack }: {
  answer?: Rating; onAnswer: (r: Rating) => void; onBack: () => void; canBack: boolean;
}) {
  return (
    <div className="shrink-0 px-4 pb-5 md:pb-6 pt-3" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 1.25rem)' }}>
      <div className="max-w-lg mx-auto text-center">
        <p className="text-white/55 text-[10px] md:text-[11px] font-mono uppercase tracking-[0.3em] mb-3">
          Do you need this for your business?
        </p>
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {RATINGS.map(r => {
            const on = answer === r.id;
            const tone =
              r.id === 'urgent'
                ? (on ? 'bg-[#CCFF00] border-[#CCFF00] text-black' : 'border-[#CCFF00]/50 text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black')
                : r.id === 'need'
                ? (on ? 'bg-white border-white text-black' : 'border-white/30 text-white hover:bg-white hover:text-black')
                : (on ? 'bg-white/80 border-white/80 text-black' : 'border-white/15 text-white/55 hover:border-white/45 hover:text-white');
            return (
              <button key={r.id} onClick={() => onAnswer(r.id)}
                className={`flex flex-col items-center justify-center gap-1.5 px-2 py-3.5 rounded-xl border text-[11px] md:text-[12.5px] font-bold uppercase tracking-wide transition-all ${tone} ${on ? 'ring-2 ring-[#CCFF00] ring-offset-2 ring-offset-black' : ''}`}>
                <r.Icon size={17} strokeWidth={2.5} />
                {r.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-center mt-3">
          {canBack && (
            <button onClick={onBack}
              className="inline-flex items-center gap-1 text-white/45 hover:text-white text-[11px] font-bold uppercase tracking-wider transition-colors">
              <ArrowLeft size={13} strokeWidth={2.5} /> Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// HARDWARE PROMPT — Door Lock vs Turnstile (after "need" on check-in)
// ────────────────────────────────────────────────────────────────
function HardwarePrompt({ onChoose, onSkip, onBack, current }: {
  onChoose: (h: Hw) => void; onSkip: () => void; onBack: () => void; current?: Hw;
}) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto flex items-center justify-center px-4 py-4 relative z-10">
      <div className="w-full max-w-lg mx-auto" style={{ animation: 'intro-slide-l 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
        <div className="text-center mb-5">
          <div className="flex items-center justify-center gap-2 mb-3">
            <ScanFace size={15} strokeWidth={2.2} className="text-[#CCFF00]" />
            <span className="text-[#CCFF00] text-[10px] md:text-[11px] font-mono uppercase tracking-[0.28em]">Check in · pick your hardware</span>
          </div>
          <h2 className="text-[26px] sm:text-4xl font-black uppercase tracking-tight leading-[0.95]">
            Which entry<br />fits your space?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {HARDWARE.map(h => {
            const on = current === h.id;
            return (
              <button key={h.id} onClick={() => onChoose(h.id)}
                className={`group relative rounded-2xl overflow-hidden border text-left transition-all ${on ? 'border-[#CCFF00] ring-2 ring-[#CCFF00] ring-offset-2 ring-offset-black' : 'border-white/12 hover:border-[#CCFF00]'}`}>
                <div className="relative h-32 sm:h-36">
                  <img src={h.img} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-black/30 to-transparent" />
                </div>
                <div className="p-4 bg-[#0b0b0b]">
                  <p className="text-white font-black uppercase tracking-wide text-[15px]">{h.label}</p>
                  <p className="text-gray-400 text-[12px] leading-snug mt-1">{h.desc}</p>
                </div>
                <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#CCFF00] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={15} strokeWidth={3} />
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-4">
          <button onClick={onBack} className="inline-flex items-center gap-1 text-white/45 hover:text-white text-[11px] font-bold uppercase tracking-wider transition-colors">
            <ArrowLeft size={13} strokeWidth={2.5} /> Back
          </button>
          <button onClick={onSkip} className="inline-flex items-center gap-1 text-white/35 hover:text-white/70 text-[11px] font-bold uppercase tracking-wider transition-colors">
            Not sure / skip <ArrowRight size={13} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// PLUGIN PICKER — one-page multi-select (the last card)
// ────────────────────────────────────────────────────────────────
function PluginPicker({ n, total, selected, onToggle }: {
  n: number; total: number; selected: Set<string>; onToggle: (id: string) => void;
}) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 relative z-10">
      <div className="w-full max-w-lg mx-auto" style={{ animation: 'intro-slide-l 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Puzzle size={15} strokeWidth={2.2} className="text-[#CCFF00]" />
            <span className="text-[#CCFF00] text-[10px] md:text-[11px] font-mono uppercase tracking-[0.28em]">Step {n + 1} / {total} · Add-ons</span>
            <span className="px-2 py-0.5 bg-[#CCFF00] text-black text-[9px] font-black uppercase tracking-wider rounded-full">Optional</span>
          </div>
          <h2 className="text-[24px] sm:text-3xl font-black uppercase tracking-tight leading-[0.98] mb-2">
            Pick the plugins<br />that interest you.
          </h2>
          <p className="text-gray-400 text-[12.5px] md:text-[13px]">Tap any that catch your eye — switch on only what you need.</p>
        </div>

        <div className="space-y-2">
          {PLUGINS_LIST.map(p => {
            const on = selected.has(p.id);
            return (
              <button key={p.id} onClick={() => onToggle(p.id)} aria-pressed={on}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${on ? 'border-[#CCFF00] bg-[#CCFF00]/[0.06]' : 'border-white/12 bg-white/[0.02] hover:border-white/30'}`}>
                <span className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center border ${on ? 'border-[#CCFF00]/50 bg-[#CCFF00]/10 text-[#CCFF00]' : 'border-white/15 text-white/65'}`}>
                  <p.Icon size={17} strokeWidth={2} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-white font-bold text-[14px] leading-tight">{p.name}</span>
                  <span className="block text-gray-400 text-[12px] leading-snug">{p.desc}</span>
                </span>
                <span className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${on ? 'border-[#CCFF00] bg-[#CCFF00] text-black' : 'border-white/25 text-transparent'}`}>
                  <Check size={14} strokeWidth={3.5} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PluginBar({ count, onContinue, onBack }: { count: number; onContinue: () => void; onBack: () => void }) {
  return (
    <div className="shrink-0 px-4 pt-3" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 1.25rem)' }}>
      <div className="max-w-lg mx-auto">
        <button onClick={onContinue}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#CCFF00] hover:bg-white text-black text-[13px] md:text-[15px] font-black uppercase tracking-wider transition-colors">
          {count > 0 ? `Continue with ${count} selected` : 'Continue'} <ArrowRight size={16} strokeWidth={2.5} />
        </button>
        <div className="flex items-center justify-between mt-3">
          <button onClick={onBack} className="inline-flex items-center gap-1 text-white/45 hover:text-white text-[11px] font-bold uppercase tracking-wider transition-colors">
            <ArrowLeft size={13} strokeWidth={2.5} /> Back
          </button>
          <span className="text-white/35 text-[10px] font-mono uppercase tracking-[0.2em]">Optional — pick any, or none</span>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// LEAD CAPTURE (after the 10th card)
// ────────────────────────────────────────────────────────────────
function LeadCapture({ biz, answers, hw, plugins, onRestart, onBack }: {
  biz: Biz; answers: Record<number, Rating>; hw?: Hw; plugins: Set<string>; onRestart: () => void; onBack: () => void;
}) {
  const [loc, setLoc] = useState('');
  const valid = loc.trim().length >= 2;

  // a simple per-feature list of every answered card: "Membership - Need", "Check in - Urgent (Turnstile)", "Rewards - No need"
  const rLabel = (r: Rating) => (r === 'urgent' ? 'Urgent' : r === 'need' ? 'Need' : 'No need');
  const picks = SLIDES
    .map((s, i) => ({ kicker: s.kicker, r: answers[i], hardware: s.hardware }))
    .filter(x => x.r)
    .map(x => `${x.kicker} - ${rLabel(x.r as Rating)}${x.hardware && hwLabel(hw) ? ` (${hwLabel(hw)})` : ''}`);

  const pluginNames = PLUGINS_LIST.filter(p => plugins.has(p.id)).map(p => p.name);

  const lines = [
    `Hi STUDIO! 👋 ${biz.label}`,
    `Location: ${loc}`,
    '',
    ...(picks.length ? picks : ['I’d like to know more.']),
  ];
  if (pluginNames.length) lines.push('', `Plugins: ${pluginNames.join(', ')}`);
  lines.push('', 'Please contact me!');
  const wa = `https://wa.me/${WA_NUMBER}?text=` + encodeURIComponent(lines.join('\n'));

  const urgent = SLIDES.filter((_, i) => answers[i] === 'urgent').map(s => s.kicker);
  const need = SLIDES.filter((_, i) => answers[i] === 'need').map(s => s.kicker);

  return (
    <div className="flex-1 overflow-y-auto flex items-center justify-center px-4 py-6"
      style={{ animation: 'intro-slide-l 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
      <div className="w-full max-w-md text-center">
        <span className="inline-flex items-center gap-2 text-[#CCFF00] text-[10px] md:text-[11px] font-mono uppercase tracking-[0.3em] mb-4">
          <biz.Icon size={14} /> Last step
        </span>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.95] mb-3">
          Send us<br /><span className="text-[#CCFF00]">your picks.</span>
        </h2>
        <p className="text-gray-300 text-[14px] md:text-[15px] leading-relaxed mb-6">
          Last thing — where's your business? Then tap to send us your picks on WhatsApp.
        </p>

        {/* recap */}
        {(urgent.length > 0 || need.length > 0 || pluginNames.length > 0) && (
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {urgent.map(k => (
              <span key={k} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#CCFF00] text-black text-[11px] font-bold">
                <Zap size={12} strokeWidth={2.5} /> {k}
              </span>
            ))}
            {need.map(k => (
              <span key={k} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/30 text-white text-[11px] font-bold">
                <Check size={12} strokeWidth={2.5} /> {k}
              </span>
            ))}
            {pluginNames.map(k => (
              <span key={k} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#CCFF00]/40 text-[#CCFF00] text-[11px] font-bold">
                <Puzzle size={12} strokeWidth={2.5} /> {k}
              </span>
            ))}
          </div>
        )}

        {/* business location */}
        <div className="flex items-center gap-2 px-4 py-3.5 rounded-xl border border-white/20 bg-white/[0.03] focus-within:border-[#CCFF00] transition-colors mb-3">
          <MapPin size={18} className="text-[#CCFF00] shrink-0" />
          <input
            type="text" autoComplete="address-level2"
            value={loc} onChange={e => setLoc(e.target.value)}
            placeholder="Business location (e.g. Bangsar, KL)"
            className="flex-1 bg-transparent text-white placeholder:text-white/35 text-[15px] outline-none"
          />
        </div>

        {/* WA button */}
        {valid ? (
          <a href={wa} target="_blank" rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#CCFF00] hover:bg-white text-black text-[14px] md:text-[15px] font-black uppercase tracking-wider transition-colors">
            <MessageCircle size={18} strokeWidth={2.5} /> Send on WhatsApp <ArrowRight size={16} strokeWidth={2.5} />
          </a>
        ) : (
          <button disabled
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/10 text-white/35 text-[14px] md:text-[15px] font-black uppercase tracking-wider cursor-not-allowed">
            <MessageCircle size={18} strokeWidth={2.5} /> Add your location
          </button>
        )}

        {/* the important nudge */}
        <p className="mt-4 text-[12px] md:text-[13px] text-[#CCFF00] font-bold leading-relaxed">
          ⚠️ This opens WhatsApp with a ready message — make sure you tap <span className="underline">SEND</span> so we receive it.
        </p>

        <div className="flex items-center justify-center gap-5 mt-7">
          <button onClick={onBack} className="inline-flex items-center gap-1 text-white/45 hover:text-white text-[11px] font-bold uppercase tracking-wider transition-colors">
            <ArrowLeft size={13} strokeWidth={2.5} /> Back
          </button>
          <button onClick={onRestart} className="inline-flex items-center gap-1 text-white/45 hover:text-white text-[11px] font-bold uppercase tracking-wider transition-colors">
            <RotateCcw size={12} strokeWidth={2.5} /> Start over
          </button>
        </div>
        <p className="text-white/30 text-[10px] font-mono uppercase tracking-[0.25em] mt-6">Publika KL · Mon–Fri · 10AM–7PM</p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// DECK
// ────────────────────────────────────────────────────────────────
function Deck({ biz, onRestart }: { biz: Biz; onRestart: () => void }) {
  const total = SLIDES.length;
  const [idx, setIdx] = useState(0);     // 0..total  (total = lead capture)
  const [dir, setDir] = useState(1);
  const [answers, setAnswers] = useState<Record<number, Rating>>({});
  const [hwPrompt, setHwPrompt] = useState(false);   // showing Door Lock vs Turnstile
  const [hw, setHw] = useState<Hw | undefined>(undefined);
  const [plugins, setPlugins] = useState<Set<string>>(new Set());
  const touchX = useRef<number | null>(null);

  const togglePlugin = useCallback((id: string) => {
    setPlugins(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  const go = useCallback((next: number) => {
    if (next < 0 || next > total) return;
    setHwPrompt(false);
    setDir(next >= idx ? 1 : -1);
    setIdx(next);
  }, [idx, total]);

  const submitAnswer = useCallback((r: Rating) => {
    setAnswers(prev => ({ ...prev, [idx]: r }));
    // entry hardware (Door Lock vs Turnstile) only for gated venues — gyms & theme parks
    if (SLIDES[idx].hardware && (r === 'need' || r === 'urgent') && ENTRY_BIZ.has(biz.id)) {
      setHwPrompt(true);
      return;
    }
    go(idx + 1);
  }, [idx, go, biz.id]);

  const chooseHw = useCallback((h: Hw) => { setHw(h); go(idx + 1); }, [idx, go]);

  const onFinal = idx === total;

  // keyboard — back only; forward requires answering
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(idx - 1);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [idx, go]);

  // swipe — back only (no skipping forward)
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (dx > 55) go(idx - 1);
    touchX.current = null;
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col overflow-hidden select-none" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {/* ambient glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#CCFF00]/[0.06] blur-[130px] pointer-events-none" aria-hidden="true" />

      {/* top bar */}
      <div className="shrink-0 px-4 md:px-6 pt-4 relative z-10" style={{ paddingTop: 'max(env(safe-area-inset-top), 1rem)' }}>
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <a href="/qstudio" className="text-[#CCFF00] font-black text-base tracking-tight">STUDIO</a>
            <span className="text-white/45 text-[10px] font-mono uppercase tracking-[0.2em] truncate max-w-[45%]">{biz.label}</span>
            {idx === 0 ? (
              <button onClick={onRestart} aria-label="Close" className="text-white/45 hover:text-white transition-colors">
                <X size={19} />
              </button>
            ) : (
              <span className="w-[19px]" aria-hidden="true" />
            )}
          </div>
          <div className="flex gap-1">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => { if (i <= idx) go(i); }} aria-label={`Go to step ${i + 1}`}
                className="flex-1 h-1 rounded-full overflow-hidden bg-white/12">
                <span className="block h-full bg-[#CCFF00] transition-all duration-300" style={{ width: i <= idx || onFinal ? '100%' : '0%' }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {onFinal ? (
        <LeadCapture biz={biz} answers={answers} hw={hw} plugins={plugins} onRestart={onRestart} onBack={() => go(total - 1)} />
      ) : hwPrompt ? (
        <HardwarePrompt
          current={hw}
          onChoose={chooseHw}
          onSkip={() => go(idx + 1)}
          onBack={() => setHwPrompt(false)}
        />
      ) : SLIDES[idx].plugins ? (
        <>
          <PluginPicker n={idx} total={total} selected={plugins} onToggle={togglePlugin} />
          <PluginBar count={plugins.size} onContinue={() => go(idx + 1)} onBack={() => go(idx - 1)} />
        </>
      ) : (
        <>
          {/* card area (scrolls if short screen) */}
          <div className="flex-1 min-h-0 overflow-y-auto flex items-center justify-center px-4 py-4 relative z-10">
            <StepCard slide={SLIDES[idx]} n={idx} total={total} dir={dir} />
          </div>

          {/* bottom-centre questionnaire — must answer to advance */}
          <RatingBar
            answer={answers[idx]}
            onAnswer={submitAnswer}
            onBack={() => go(idx - 1)}
            canBack={idx > 0}
          />
        </>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// MAIN
// ────────────────────────────────────────────────────────────────
export default function QStudioIntroPage() {
  const [biz, setBiz] = useState<Biz | null>(null);

  return (
    <div className="bg-black min-h-[100svh] text-white selection:bg-[#CCFF00] selection:text-black overflow-hidden">
      <SEOHead
        noindex
        noTitleSuffix
        title="The 60-second test every gym & salon owner needs"
        description="Tap your biggest headaches and see what one platform fixes — POS, web & app, one login, one bill. No more juggling 5 softwares."
        url="https://qbot.now/qstudio/intro"
        image="https://qbot.now/qfitimg/studioimg/02_checkin.jpg"
        imageWidth={4500}
        imageHeight={3000}
        imageAlt="STUDIO — the 60-second tour for gym, salon, spa & clinic owners"
      />

      {biz ? <Deck biz={biz} onRestart={() => setBiz(null)} /> : <BusinessPicker onPick={setBiz} />}

      <style>{`
        @keyframes intro-pop { from { opacity: 0; transform: translateY(16px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes intro-slide-l { from { opacity: 0; transform: translateX(34px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes intro-slide-r { from { opacity: 0; transform: translateX(-34px); } to { opacity: 1; transform: translateX(0); } }
        @media (prefers-reduced-motion: reduce) { [style*="intro-"] { animation: none !important; } }
      `}</style>
    </div>
  );
}
