// QSTUDIO / BABEL FITNESS KL PROPOSAL — password-gated technical proposal deck.
//
// Mindbody × QStudio Face ID access: Mindbody stays the source of truth for
// members/memberships/bookings; QStudio owns face identity, liveness, access
// rules and hardware control. The deck must never imply Mindbody provides face
// recognition, and every FUTURE capability is labelled as proposed, not built.
//
// UNLISTED / NOT CRAWLABLE. noindex/nofollow, robots-blocked, not prerendered,
// not linked. Reachable only by typing the URL + entering the password
// (babelisgreat8 — also accepted at the /qstudio/proposal gate, which hands off
// here). Slide index lives in the URL (/qstudio/proposal/babel/1 … /10).

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight, ArrowLeft, CheckCircle2, MessageCircle, Lock, Unlock,
  Maximize2, Minimize2, ScanFace, DoorOpen, Database, WifiOff, MapPin,
  RefreshCw, ShieldOff, Siren, CalendarX, CalendarCheck,
  UserX, ShieldCheck, Cpu, Camera, Store, Bell, Building2,
  type LucideIcon,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { BABEL_ACCESS_CODE, BABEL_SESSION_KEY, BABEL_DECK_PATH } from './babelProposalAccess';

const LIME = '#CCFF00';       // QStudio system / action highlights
const GOLD = '#D9B36C';       // restrained warm gold — premium / Babel moments
const BROWN_BG = '#171008';   // deep warm brown backdrop for slide 9
const BG = '#0B0B0A';         // charcoal, slightly warm near-black
const INK = '#F2EEE3';        // warm white
const WA_NUMBER = '60126909189';
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
  'Hi STUDIO team — Babel Fitness here. We have reviewed the access proposal and would like to proceed with technical discovery and the one-entrance pilot.',
)}`;

// ─── Small shared pieces ─────────────────────────────────────────────────────

function Kicker({ children, color = LIME }: { children: React.ReactNode; color?: string }) {
  return (
    <p className="text-[10px] md:text-[12px] font-mono font-bold uppercase tracking-[0.3em] mb-4" style={{ color }}>
      {children}
    </p>
  );
}

// Section badge — NOW / PILOT / FUTURE must be visually unmistakable.
function Badge({ kind, range, color }: { kind: 'now' | 'pilot' | 'future'; range?: string; color?: string }) {
  const cfg = {
    now: { label: 'MUST DO NOW', style: { backgroundColor: LIME, color: '#000', borderColor: LIME } },
    pilot: { label: 'PILOT', style: { color: LIME, borderColor: LIME } },
    future: { label: 'FUTURE · PROPOSED', style: { color: GOLD, borderColor: GOLD } },
  }[kind];
  const style = color && kind !== 'now' ? { color, borderColor: color } : cfg.style;
  return (
    <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 border-2 text-[10px] md:text-[11px] font-mono font-black uppercase tracking-[0.25em]" style={style}>
      {cfg.label}{range ? <span className="opacity-70">· {range}</span> : null}
    </div>
  );
}

// Bordered point row with a check.
function Row({ children, color = LIME }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="flex items-start gap-3 border border-white/20 px-4 py-2.5">
      <CheckCircle2 size={15} strokeWidth={2.5} className="mt-0.5 flex-shrink-0" style={{ color }} />
      <span className="text-[12px] md:text-[13.5px] text-white/85 leading-snug text-left">{children}</span>
    </div>
  );
}

// Numbered requirement row — slide 5, big numbering.
function NumRow({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 border border-white/20 px-3.5 py-2.5">
      <span className="text-[15px] md:text-[18px] font-mono font-black tabular-nums flex-shrink-0 w-7 text-right" style={{ color: LIME }}>
        {String(n).padStart(2, '0')}
      </span>
      <span className="text-[11.5px] md:text-[12.5px] text-white/90 leading-snug text-left">{children}</span>
    </div>
  );
}

// Photo-split layout — image one side, content the other.
function PhotoSplit({ img, alt, imgSide = 'left', children }: {
  img: string; alt: string; imgSide?: 'left' | 'right'; children: React.ReactNode;
}) {
  return (
    <div className={`max-w-5xl mx-auto flex flex-col ${imgSide === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-6 md:gap-10`}>
      <div className="w-full max-w-[280px] md:max-w-none md:w-[38%] flex-shrink-0">
        <div className="border-2 overflow-hidden" style={{ borderColor: GOLD, boxShadow: '6px 6px 0 0 rgba(217,179,108,0.22)' }}>
          <img src={img} alt={alt} className="w-full h-[160px] md:h-[330px] object-cover" draggable={false} />
        </div>
      </div>
      <div className="flex-1 text-center md:text-left">{children}</div>
    </div>
  );
}

// Architecture box for the slide-3 responsibility diagram.
function ArchBox({ title, role, items, accent }: { title: string; role: string; items: string[]; accent?: string }) {
  const border = accent ?? 'rgba(255,255,255,0.3)';
  return (
    <div className="flex-1 border-2 px-4 py-3.5 text-left min-w-0" style={{ borderColor: border }}>
      <div className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-white/40 mb-0.5">{role}</div>
      <div className="text-[15px] md:text-[17px] font-black uppercase tracking-tight mb-2.5" style={{ color: accent ?? INK }}>{title}</div>
      <div className="space-y-1">
        {items.map(it => (
          <div key={it} className="text-[10.5px] md:text-[11.5px] font-mono text-white/65 leading-snug">· {it}</div>
        ))}
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex items-center justify-center flex-shrink-0 px-1 py-0.5" aria-hidden>
      <ArrowRight size={18} strokeWidth={2.5} className="rotate-90 md:rotate-0" style={{ color: LIME }} />
    </div>
  );
}

// ─── Content data ────────────────────────────────────────────────────────────

// Slide 5 · the MUST DO NOW requirements.
const MUST_DO: { range: string; line1: string; line2: string; items: string[]; note?: string }[] = [
  {
    range: '01–10', line1: 'First,', line2: 'get the facts right.',
    items: [
      'Mindbody stays the source of truth',
      'Official API onboarding & activation',
      'One face = one Mindbody Client ID',
      'Sync memberships, passes & bookings',
      'Block expired, frozen or invalid members',
      'Enforce limited-use & dated passes',
      'Enforce the right outlet & zones',
      'Enforce class-entry windows',
      'Verify signed Mindbody webhooks',
      'Daily reconciliation repairs misses',
    ],
  },
];

// Slide 7 · exceptions & failures — all handled, all tested.
const EXCEPTIONS: { Icon: LucideIcon; title: string }[] = [
  { Icon: ScanFace, title: 'Face not recognised' },
  { Icon: UserX, title: 'False rejection' },
  { Icon: CalendarX, title: 'Expired or frozen' },
  { Icon: MapPin, title: 'Wrong location' },
  { Icon: CalendarCheck, title: 'No class booking' },
  { Icon: ShieldOff, title: 'No consent' },
  { Icon: WifiOff, title: 'Internet down' },
  { Icon: RefreshCw, title: 'Stale sync' },
  { Icon: Siren, title: 'Emergency' },
];

// Slide 8 · privacy requirements.
const PRIVACY_ITEMS = [
  'Explicit opt-in consent',
  'BM + English privacy notice',
  'Secure template — not a stored photo',
  'Retention, withdrawal & deletion defined',
  'Equal QR entry for opt-outs',
];

// Slide 7 · hardware chain.
const HW_CHAIN = ['Camera / Terminal', 'QStudio Verifier', 'Controller / Relay', 'Gate', 'Door Sensor'];

// Slide 9 · future capabilities — proposed, not built.
const FUTURE_CARDS: { Icon: LucideIcon; title: string; items: string[] }[] = [
  { Icon: Store, title: 'Vending', items: ['Face-authorised purchases', 'Member confirms every charge', 'Stock & loyalty auto-update'] },
  { Icon: CalendarCheck, title: 'Classes', items: ['Booked vs attended', 'Free unclaimed spots', 'Demand forecasts'] },
  { Icon: Bell, title: 'Member signals', items: ['Trainer alerts on arrival', 'Renewal-risk flags', 'Session-balance reminders'] },
  { Icon: Building2, title: 'Smarter spaces', items: ['Zones & live occupancy', 'Cleaning by actual use', 'Multi-site view'] },
];

// ─── Password gate ───────────────────────────────────────────────────────────
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.trim().toLowerCase() === BABEL_ACCESS_CODE) {
      try { sessionStorage.setItem(BABEL_SESSION_KEY, '1'); } catch { /* noop */ }
      onUnlock();
    } else {
      setErr('Invalid password.');
    }
  };
  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4" style={{ backgroundColor: BG, color: INK }}>
      <form onSubmit={submit} className="w-full max-w-sm border-2 p-7" style={{ borderColor: GOLD, backgroundColor: 'rgba(217,179,108,0.05)' }}>
        <div className="flex items-center gap-2 mb-5">
          <Lock size={16} strokeWidth={2.5} style={{ color: GOLD }} />
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em]" style={{ color: GOLD }}>Private Proposal</p>
        </div>
        <h1 className="text-[22px] md:text-[26px] font-black uppercase tracking-tight leading-tight mb-1">
          Babel <span className="text-white/40">×</span> <span style={{ color: LIME }}>QStudio</span>
        </h1>
        <p className="text-white/70 text-[12px] mb-6">Enter the password shared with Babel Fitness management.</p>
        <label htmlFor="babel-pw" className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/60 mb-2">Password</label>
        <input
          id="babel-pw" type="password" autoFocus value={pw} autoComplete="off"
          onChange={e => { setPw(e.target.value); setErr(null); }}
          className="w-full bg-black border-2 border-white/20 focus:border-white/60 focus:outline-none text-white text-[14px] px-3 py-2.5 mb-3"
        />
        {err && <p className="text-red-400 text-[12px] mb-3" role="alert">{err}</p>}
        <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-black text-[12px] font-black uppercase tracking-wider hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white" style={{ backgroundColor: LIME }}>
          View Proposal <ArrowRight size={14} strokeWidth={2.5} />
        </button>
        <p className="text-[9.5px] text-white/35 mt-4 leading-relaxed">Kuala Lumpur · Prepared for Babel Fitness management.</p>
      </form>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function QStudioBabelProposalPage() {
  const [unlocked, setUnlocked] = useState(false);
  useEffect(() => { try { if (sessionStorage.getItem(BABEL_SESSION_KEY) === '1') setUnlocked(true); } catch { /* noop */ } }, []);

  const { slide: slideParam } = useParams<{ slide: string }>();
  const navigate = useNavigate();
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Fullscreen state
  const [isFs, setIsFs] = useState(false);
  useEffect(() => {
    const onFs = () => setIsFs(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);
  const toggleFs = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => { /* noop */ });
    else void document.documentElement.requestFullscreen().catch(() => { /* noop */ });
  }, []);

  const lockDeck = useCallback(() => {
    try { sessionStorage.removeItem(BABEL_SESSION_KEY); } catch { /* noop */ }
    setUnlocked(false);
  }, []);

  // ── The 10-slide deck ─────────────────────────────────────────────────────
  const slides: { bgImg?: string; brownBg?: boolean; render: () => React.ReactNode }[] = [

    // 1 · COVER
    {
      bgImg: '/qfitimg/studioimg/type-faceid.jpg',
      render: () => (
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2.5 mb-7 px-4 py-1.5 border" style={{ borderColor: GOLD }}>
            <span className="text-[11px] font-mono font-black uppercase tracking-[0.3em]" style={{ color: GOLD }}>Babel</span>
            <span className="text-[11px] text-white/40">×</span>
            <span className="text-[11px] font-mono font-black uppercase tracking-[0.3em]" style={{ color: LIME }}>QStudio</span>
          </div>
          <h1 className="text-[32px] md:text-[58px] font-black uppercase tracking-tight leading-[0.92] mb-4">
            Face-first entry.<br /><span style={{ color: LIME }}>Mindbody-controlled eligibility.</span>
          </h1>
          <p className="text-white/80 text-[14px] md:text-[18px] mb-8">
            Faster member access today. A smarter gym tomorrow.
          </p>
          <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-white/45">
            <Lock size={11} strokeWidth={2.5} /> Private proposal · Kuala Lumpur
          </div>
          <p className="mt-7 text-[11px] font-mono uppercase tracking-[0.25em] text-white/40 animate-pulse motion-reduce:animate-none">Tap or → to begin</p>
        </div>
      ),
    },

    // 2 · THE DECISION
    {
      render: () => (
        <div className="max-w-3xl mx-auto text-center">
          <Kicker>The decision</Kicker>
          <h2 className="text-[26px] md:text-[44px] font-black uppercase tracking-tight leading-[0.95] mb-7">
            Keep Mindbody.<br /><span style={{ color: LIME }}>Add the missing access layer.</span>
          </h2>
          <div className="space-y-2.5 max-w-md mx-auto mb-7 text-left">
            {[
              { Icon: Database, text: 'Mindbody — memberships & bookings' },
              { Icon: ScanFace, text: 'QStudio — face check & door decision' },
              { Icon: DoorOpen, text: 'Gate opens only when both pass' },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-3.5 border border-white/20 px-4 py-3">
                <Icon size={18} strokeWidth={2.5} className="flex-shrink-0" style={{ color: LIME }} />
                <span className="text-[13px] md:text-[15px] text-white/90 leading-snug text-left">{text}</span>
              </div>
            ))}
          </div>
          <p className="text-[12px] md:text-[14px] font-black uppercase tracking-wider text-white/90">
            Access control first — <span style={{ color: LIME }}>not an AI showcase.</span>
          </p>
        </div>
      ),
    },

    // 3 · WHO CONTROLS WHAT
    {
      render: () => (
        <div className="max-w-4xl mx-auto text-center">
          <Kicker>Who controls what</Kicker>
          <h2 className="text-[24px] md:text-[40px] font-black uppercase tracking-tight leading-[0.95] mb-7">
            Three systems.<br /><span style={{ color: LIME }}>One job each.</span>
          </h2>
          <div className="flex flex-col md:flex-row items-stretch md:items-start justify-center gap-1.5 md:gap-0 mb-6">
            <ArchBox
              role="Source of truth" title="Mindbody" accent={GOLD}
              items={['Memberships', 'Bookings']}
            />
            <FlowArrow />
            <ArchBox
              role="Decision layer" title="QStudio Access Brain" accent={LIME}
              items={['Face identity', 'Rules']}
            />
            <FlowArrow />
            <ArchBox
              role="Actuator" title="Face Terminal / Gate"
              items={['Scan', 'Unlock']}
            />
          </div>
          <p className="text-[12px] md:text-[14px] font-black uppercase tracking-wider" style={{ color: LIME }}>
            The door never stores memberships.
          </p>
        </div>
      ),
    },

    // 4 · THE MEMBER JOURNEY
    {
      render: () => (
        <PhotoSplit img="/qfitimg/modules/qfit-01faceid.jpg" alt="QStudio Face ID check-in screen recognising a member" imgSide="left">
          <Kicker>The member journey</Kicker>
          <h2 className="text-[24px] md:text-[38px] font-black uppercase tracking-tight leading-[0.95] mb-5">
            Scan to entry.<br /><span style={{ color: LIME }}>One controlled flow.</span>
          </h2>
          <ol className="space-y-1.5 max-w-sm mx-auto md:mx-0 mb-5 text-left">
            {[
              'Member enrols once — with consent',
              'Camera checks it\'s a live face',
              'QStudio matches the member',
              'Entitlement checked locally',
              'Allow or deny — with reason',
              'Gate opens, entry logged',
              'Arrival synced back to Mindbody',
            ].map((s, i) => (
              <li key={s} className="flex items-center gap-3 border border-white/20 px-3.5 py-2">
                <span className="text-[13px] font-mono font-black tabular-nums flex-shrink-0" style={{ color: LIME }}>{i + 1}</span>
                <span className="text-[11.5px] md:text-[12.5px] text-white/85 leading-snug">{s}</span>
              </li>
            ))}
          </ol>
          <div className="inline-flex items-center gap-2 border-2 px-4 py-2.5" style={{ borderColor: LIME }}>
            <ScanFace size={15} strokeWidth={2.5} style={{ color: LIME }} />
            <span className="text-[11.5px] md:text-[12.5px] font-black uppercase tracking-wider">Face match + valid entitlement = entry</span>
          </div>
        </PhotoSplit>
      ),
    },

    // 5 · MUST DO NOW — the numbered requirements.
    ...MUST_DO.map((block, bi) => ({
      render: () => (
        <div className="max-w-4xl mx-auto text-center">
          <Badge kind="now" range={block.range} />
          <h2 className="text-[24px] md:text-[38px] font-black uppercase tracking-tight leading-[0.95] mb-6">
            {block.line1}<br /><span style={{ color: LIME }}>{block.line2}</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-2 max-w-3xl mx-auto text-left">
            {block.items.map((it, i) => <NumRow key={it} n={bi * 10 + i + 1}>{it}</NumRow>)}
          </div>
          {block.note && (
            <p className="text-[12px] md:text-[14px] font-black uppercase tracking-wider mt-5" style={{ color: LIME }}>{block.note}</p>
          )}
        </div>
      ),
    })),

    // 7 · FAIL-SAFE — hardware chain + every exception handled.
    {
      render: () => (
        <div className="max-w-4xl mx-auto text-center">
          <Kicker>Fail-safe by design</Kicker>
          <h2 className="text-[24px] md:text-[40px] font-black uppercase tracking-tight leading-[0.95] mb-6">
            Proven on the<br /><span style={{ color: LIME }}>real entrance.</span>
          </h2>
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-1 md:gap-0 max-w-3xl mx-auto mb-6">
            {HW_CHAIN.map((box, i) => (
              <React.Fragment key={box}>
                {i > 0 && <FlowArrow />}
                <div className="flex-1 flex items-center justify-center gap-2 border-2 px-3 py-2.5 min-w-0" style={{ borderColor: box === 'QStudio Verifier' ? LIME : 'rgba(255,255,255,0.3)' }}>
                  {box === 'Camera / Terminal' && <Camera size={13} strokeWidth={2.5} className="flex-shrink-0" style={{ color: LIME }} />}
                  {box === 'QStudio Verifier' && <Cpu size={13} strokeWidth={2.5} className="flex-shrink-0" style={{ color: LIME }} />}
                  <span className="text-[10.5px] md:text-[11px] font-mono font-black uppercase tracking-wide" style={{ color: box === 'QStudio Verifier' ? LIME : INK }}>{box}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-white/45 mb-3">Every exception handled & tested</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-w-2xl mx-auto mb-6 text-left">
            {EXCEPTIONS.map(({ Icon, title }) => (
              <div key={title} className="flex items-center gap-2.5 border border-white/20 px-3.5 py-2.5">
                <Icon size={14} strokeWidth={2.5} className="flex-shrink-0" style={{ color: LIME }} />
                <span className="text-[10.5px] md:text-[11.5px] font-black uppercase tracking-wide leading-tight">{title}</span>
              </div>
            ))}
          </div>
          <p className="text-[12px] md:text-[14px] font-black uppercase tracking-wider" style={{ color: LIME }}>
            No one trapped. No silent bypass. All recorded.
          </p>
        </div>
      ),
    },

    // 8 · PRIVACY
    {
      render: () => (
        <div className="max-w-3xl mx-auto text-center">
          <Kicker>Privacy</Kicker>
          <ShieldCheck size={34} strokeWidth={2} className="mx-auto mb-4" style={{ color: LIME }} />
          <h2 className="text-[24px] md:text-[38px] font-black uppercase tracking-tight leading-[0.95] mb-6">
            Biometrics: voluntary,<br /><span style={{ color: LIME }}>limited, explainable.</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-2 max-w-2xl mx-auto mb-5 text-left">
            {PRIVACY_ITEMS.map(it => <Row key={it}>{it}</Row>)}
          </div>
          <p className="text-[10.5px] md:text-[11.5px] text-white/50">
            Requires Babel's privacy/legal confirmation — not legal advice.
          </p>
        </div>
      ),
    },

    // 9 · THE PILOT
    {
      render: () => (
        <PhotoSplit img="/qfitimg/studioimg/type-doorlock.jpg" alt="Access-controlled door with electronic lock hardware" imgSide="right">
          <Badge kind="pilot" />
          <h2 className="text-[24px] md:text-[38px] font-black uppercase tracking-tight leading-[0.95] mb-5">
            One entrance.<br /><span style={{ color: LIME }}>Opt-in members.</span>
          </h2>
          <div className="space-y-1.5 max-w-sm mx-auto md:mx-0 text-left">
            {[
              'One Babel KL outlet, one lane',
              'QR / front-desk fallback',
              'Sandbox first, then live',
              'Production hardware',
              'Staff training + playbook',
              '2–4 weeks monitored',
              'Expand only after UAT passes',
            ].map(p => <Row key={p}>{p}</Row>)}
          </div>
        </PhotoSplit>
      ),
    },

    // 9 · FUTURE — all proposed capabilities in one view. Brown theme, animated bg.
    {
      brownBg: true,
      render: () => (
        <div className="max-w-4xl mx-auto text-center">
          <Badge kind="future" color={GOLD} />
          <h2 className="text-[24px] md:text-[40px] font-black uppercase tracking-tight leading-[0.95] mb-6">
            After access is trusted,<br /><span style={{ color: GOLD }}>the gym gets smart.</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-2xl mx-auto mb-6 text-left">
            {FUTURE_CARDS.map(({ Icon, title, items }) => (
              <div key={title} className="border-2 px-4 py-3.5" style={{ borderColor: GOLD, backgroundColor: 'rgba(23,16,8,0.55)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={15} strokeWidth={2.5} style={{ color: GOLD }} />
                  <span className="text-[12px] md:text-[13px] font-black uppercase tracking-wider" style={{ color: GOLD }}>{title}</span>
                </div>
                <div className="space-y-1">
                  {items.map(it => (
                    <div key={it} className="text-[10.5px] md:text-[11.5px] text-white/75 leading-snug">· {it}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] md:text-[12.5px] font-black uppercase tracking-wider" style={{ color: GOLD }}>
            Proposed — built only once entry data is reliable.
          </p>
        </div>
      ),
    },

    // 10 · THE OFFER — paid deployment close.
    {
      render: () => (
        <div className="max-w-3xl mx-auto text-center">
          <Kicker>The proposal</Kicker>
          <h2 className="text-[26px] md:text-[44px] font-black uppercase tracking-tight leading-[0.95] mb-7">
            Start with access.<br /><span style={{ color: LIME }}>End with a first-of-its-kind smart gym.</span>
          </h2>
          <div className="space-y-2.5 max-w-md mx-auto mb-8 text-left">
            {[
              'Face ID entry at the Babel entrance',
              'Fully integrated with Mindbody',
              'The foundation for everything on slide 9',
            ].map(p => <Row key={p}>{p}</Row>)}
          </div>
          <a
            href={WA_LINK} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-black text-[13px] font-black uppercase tracking-wider hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            style={{ backgroundColor: LIME, boxShadow: '0 4px 0 0 rgba(217,179,108,0.45)' }}
          >
            <MessageCircle size={15} strokeWidth={2.5} /> WhatsApp the STUDIO Team
          </a>
          <p className="text-[9.5px] text-white/40 leading-relaxed mt-6">
            Crave Asia Sdn Bhd · Trade Reg. Nr. 914475-H (201001030554) · www.craveasia.com
          </p>
        </div>
      ),
    },
  ];

  const last = slides.length - 1;
  // /qstudio/proposal/babel → slide 1; /…/babel/7 → slide 7 (invalid values clamp).
  const idx = Math.min(last, Math.max(0, (parseInt(slideParam ?? '1', 10) || 1) - 1));
  const goTo = useCallback((i: number) => {
    const clamped = Math.min(last, Math.max(0, i));
    if (clamped !== idx) navigate(`${BABEL_DECK_PATH}/${clamped + 1}`);
  }, [idx, last, navigate]);
  const next = useCallback(() => goTo(idx + 1), [goTo, idx]);
  const prev = useCallback(() => goTo(idx - 1), [goTo, idx]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!unlocked) return;
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter' || e.key === 'PageDown') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
      if (e.key === 'Home') { e.preventDefault(); goTo(0); }
      if (e.key === 'End') { e.preventDefault(); goTo(last); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, goTo, last, unlocked]);

  // Swipe left/right navigation
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

  // Fit-to-viewport scaling (same approach as growthpartner/ace)
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
        <SEOHead title="Private Proposal" noindex noTitleSuffix />
        <PasswordGate onUnlock={() => setUnlocked(true)} />
      </>
    );
  }

  const slide = slides[idx];

  return (
    <main className="h-[100dvh] flex flex-col overflow-hidden antialiased" style={{ backgroundColor: BG, color: INK }}>
      <SEOHead title="Babel × QStudio — Private Proposal" noindex noTitleSuffix />
      <style>{`
        @keyframes bbSlideIn { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .bb-slide { animation: bbSlideIn .45s cubic-bezier(.22,.9,.3,1) both; }
        @keyframes bbDrift1 { from { transform: translate(-10%, -6%) scale(1); } to { transform: translate(8%, 6%) scale(1.15); } }
        @keyframes bbDrift2 { from { transform: translate(8%, 6%) scale(1.1); } to { transform: translate(-8%, -6%) scale(0.95); } }
        .bb-blob1 { animation: bbDrift1 14s ease-in-out infinite alternate; }
        .bb-blob2 { animation: bbDrift2 18s ease-in-out infinite alternate; }
        @media (prefers-reduced-motion: reduce) {
          .bb-slide, .bb-blob1, .bb-blob2 { animation: none; }
          .bb-progress { transition: none !important; }
        }
      `}</style>

      {/* Progress bar */}
      <div className="h-1 w-full flex-shrink-0 bg-white/10">
        <div className="bb-progress h-full transition-all duration-300" style={{ width: `${((idx + 1) / slides.length) * 100}%`, backgroundColor: LIME }} />
      </div>

      {/* Header strip */}
      <div className="flex items-center justify-between px-5 py-3 flex-shrink-0 relative z-10">
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em]">
          <span style={{ color: GOLD }}>Babel</span><span className="text-white/30"> × </span><span style={{ color: LIME }}>QStudio</span>
          <span className="text-white/40"> · Private</span>
        </span>
        <span className="inline-flex items-center gap-3">
          <span className="text-[10px] font-mono font-bold tabular-nums text-white/50">
            {String(idx + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </span>
          <button
            type="button" onClick={toggleFs}
            aria-label={isFs ? 'Exit fullscreen' : 'Enter fullscreen'}
            className="text-white/50 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white p-0.5"
          >
            {isFs ? <Minimize2 size={14} strokeWidth={2.5} /> : <Maximize2 size={14} strokeWidth={2.5} />}
          </button>
          <button
            type="button" onClick={lockDeck}
            aria-label="Lock the proposal and return to the password screen"
            className="text-white/50 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white p-0.5"
          >
            <Unlock size={14} strokeWidth={2.5} />
          </button>
        </span>
      </div>

      {/* Slide body — tap advances (buttons/links excluded), swipe navigates */}
      <div
        ref={bodyRef}
        key={idx}
        className="bb-slide relative flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex items-center px-5 py-4 cursor-pointer"
        onClick={(e) => { if ((e.target as HTMLElement).closest('a,button,input,label')) return; next(); }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {slide.bgImg && (
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <img src={slide.bgImg} alt="" className="w-full h-full object-cover opacity-[0.16]" draggable={false} />
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(11,11,10,0.35) 0%, rgba(11,11,10,0.94) 100%)' }} />
          </div>
        )}
        {slide.brownBg && (
          <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden" style={{ backgroundColor: BROWN_BG }}>
            <div className="bb-blob1 absolute -top-1/4 -left-1/4 w-[70%] h-[70%] rounded-full" style={{ background: 'radial-gradient(circle, rgba(217,179,108,0.26) 0%, transparent 70%)' }} />
            <div className="bb-blob2 absolute -bottom-1/4 -right-1/4 w-[80%] h-[80%] rounded-full" style={{ background: 'radial-gradient(circle, rgba(217,179,108,0.18) 0%, transparent 70%)' }} />
          </div>
        )}
        <div ref={fitRef} className="w-full relative z-10" style={{ transform: `scale(${scale})`, transformOrigin: 'center center', transition: 'transform .18s ease-out' }}>
          {slide.render()}
        </div>
      </div>

      {/* Footer nav */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 flex-shrink-0 relative z-10">
        <button
          type="button" onClick={prev} disabled={idx === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-black uppercase tracking-wider border-2 border-white/30 text-white hover:border-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          <ArrowLeft size={13} strokeWidth={3} /> Back
        </button>
        <div className="hidden md:flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i} type="button" aria-label={`Go to slide ${i + 1}`} onClick={() => goTo(i)}
              className="w-2 h-2 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              style={{ backgroundColor: i === idx ? LIME : 'rgba(255,255,255,0.2)', transform: i === idx ? 'scale(1.4)' : undefined }}
            />
          ))}
        </div>
        {idx === last ? (
          <a
            href={WA_LINK} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-[11px] font-black uppercase tracking-wider text-black hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            style={{ backgroundColor: LIME }}
          >
            <MessageCircle size={13} strokeWidth={3} /> WhatsApp Us
          </a>
        ) : (
          <button
            type="button" onClick={next}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-[11px] font-black uppercase tracking-wider text-black hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            style={{ backgroundColor: LIME }}
          >
            Next <ArrowRight size={13} strokeWidth={3} />
          </button>
        )}
      </div>
    </main>
  );
}
