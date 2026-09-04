// QSECURITY — standalone demo landing page.
//
// INTERNAL / UNLISTED. Not linked from any nav or footer, noindex/nofollow,
// blocked in robots.txt, and intentionally left OUT of scripts/prerender-meta.mjs
// so no social card or crawler-friendly HTML is baked. Reachable only by typing
// the URL. Built for a live walkthrough with a prospect.
//
// Theme: dark espresso brown (#17110A) + gold (#D4AF37) for a premium feel.
// Structure mirrors QStudioPage; copy is localised for security & access control.
// Imagery uses a deliberate placeholder frame system (Shot) — real assets get
// generated and dropped in later. A few videos reuse the live hardware footage
// (face-ID gate, MyKad reader, dashboard) — same engine, honestly shown.

import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import {
  ArrowRight, ChevronRight, ChevronLeft, ChevronDown,
  MessageCircle, Send, Instagram,
  Shield, ShieldCheck, ScanFace, ScanLine, Fingerprint, QrCode,
  DoorOpen, DoorClosed, Fence, Camera, Cctv, Eye,
  MapPin, ClipboardList, Siren, Car, Bike, HardHat, Footprints,
  UserPlus, Users, Lock, AlertTriangle,
  TrendingUp, Activity, Puzzle, PlayCircle,
  type LucideIcon,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';

// ────────────────────────────────────────────────────────────────
// CONSTANTS
// ────────────────────────────────────────────────────────────────
const WA = 'https://wa.me/60126909189?text=' + encodeURIComponent("Hi, I'm interested in QSECURITY.");
const WA_DEMO = 'https://wa.me/60126909189?text=' + encodeURIComponent("Hi, I'd like to book a QSECURITY walkthrough.");
const WA_TELLUS = 'https://wa.me/60126909189?text=' + encodeURIComponent(
  "Hi! I'd like to tell you about my site and see what fits.\n- Type of site (condo / office / factory / guarding co.):\n- Number of locations:\n- What matters most (visitor registration / face-ID access / AI CCTV / guard patrol / reporting):\n\nThanks!"
);

// Rotating vertical word inside the hero headline ("…for your ___")
const HERO_VERTICALS = ['condo', 'factory', 'office tower', 'guardhouse', 'worksite', 'estate', 'campus', 'gym'];

// Image registry. All assets live in /public/qsecurity. Most are the Higgsfield-
// generated set; nric + sentry reuse the original qbot photos (per request). Three
// slots still point at filenames to GENERATE — Shot falls back to a premium
// placeholder until a JPG is dropped at that exact path (zero code change).
const IMG = {
  // originals (kept on request)
  nric:    '/qsecurity/register-nric.jpg',          // hand inserting MyKad into a chip reader
  sentry:  '/qsecurity/sentry-cctv.jpg',            // Sentry AI CCTV dashboard, face-detection boxes
  // generated — access
  gate:    '/qsecurity/qsc__0001_guard-turnstile.jpg', // speed-gate turnstiles in a lobby
  checkin: '/qsecurity/qsc__0000_faceid.jpg',          // walk-through face-ID terminal
  verify:  '/qsecurity/qsc__0000_faceid.jpg',          // reuse face-ID scan for the verify step
  // generated — who it's for
  whoProperty: '/qsecurity/qsc__0009_whos-property.jpg', // guard greeting a resident in a lobby
  whoOffice:   '/qsecurity/qsc__0008_whos-office.jpg',   // office lobby reception + turnstile
  whoFactory:  '/qsecurity/qsc__0007_whos-factory.jpg',  // factory gate, hi-vis workers
  whoGuarding: '/qsecurity/qsc__0006_flow-customized.jpg',// control room / CCTV monitor wall
  // generated — lifecycle + hardware
  report:      '/qsecurity/qsc__0005_flow-report.jpg',
  customized:  '/qsecurity/qsc__0006_flow-customized.jpg',// control room (multi-site command)
  doorlock:    '/qsecurity/qsc__0002_hw-faceid.jpg',     // biometric face-ID door lock product shot
  // generated — guard tools
  guardGeo:    '/qsecurity/qsc__0004_guard-qr.jpg',      // guard photographing a check-point at night
  guardPanic:  '/qsecurity/qsc__0003_guard-panic.jpg',   // ops desk, live SOS alert
  // ⏳ TO GENERATE (premium placeholder until the file exists)
  guardQr:     '/qsecurity/guard-qr-scan.jpg',           // close-up: phone scanning a wall QR tag
  guardBook:   '/qsecurity/guard-occurrence.jpg',        // guard logging an incident on a tablet
};

// ────────────────────────────────────────────────────────────────
// AUDIENCE
// ────────────────────────────────────────────────────────────────
const AUDIENCE: { Icon: LucideIcon; label: string; sub: string; src: string }[] = [
  { Icon: Shield,   label: 'Property & Condo Management', sub: 'High-rise, gated communities, JMB / MC, serviced suites.', src: IMG.whoProperty },
  { Icon: DoorOpen, label: 'Offices & Commercial Towers', sub: 'Lobbies, tenant floors, restricted areas, car parks.',    src: IMG.whoOffice },
  { Icon: HardHat,  label: 'Factories & Worksites',       sub: 'Contractors, PPE zones, permits, shift gates.',            src: IMG.whoFactory },
  { Icon: Users,    label: 'Guarding & Facility Firms',   sub: 'Manpower companies running many sites at once.',           src: IMG.whoGuarding },
];

const ALSO_WORKS = [
  'Gated communities', 'Gyms & clubs', 'Schools & campuses', 'Data centres',
  'Hospitals & clinics', 'Hotels & suites', 'Construction sites', 'Car parks',
  'Events & venues', 'Logistics hubs', 'Retail chains', 'Government & GLC',
];

// ────────────────────────────────────────────────────────────────
// 7-STEP FLOW (the security lifecycle — the narrative spine)
// ────────────────────────────────────────────────────────────────
type FlowStep = {
  num: string;
  slug: string;
  title: string;
  benefit: string;
  long: string;
  pills: string[];
  Icon: LucideIcon;
  shot: string;
  src?: string;
};

const FLOW_STEPS: FlowStep[] = [
  {
    num: '01', slug: 'register', title: 'Register', Icon: UserPlus,
    benefit: 'Every visitor on record — in seconds, not a paper book.',
    long: "Visitors and contractors register at a lobby kiosk or with a guard. The MyKad chip or passport is read directly — name, IC and details captured off the document, not typed in. A photo is taken, the vehicle plate noted, the host notified, and a time-boxed pass issued. Legible, searchable, and handled the way PDPA expects. The guardhouse stops squinting at handwriting.",
    pills: ['Self-service kiosk', 'Guard-assisted', 'MyKad chip read', 'Passport scan', 'Visitor photo', 'Host notify', 'Vehicle plate', 'Time-boxed pass'],
    shot: 'Lobby self-registration kiosk + guardhouse tablet',
    src: IMG.nric,
  },
  {
    num: '02', slug: 'verify', title: 'Verify', Icon: ShieldCheck,
    benefit: 'Confirm who they are before you let them in.',
    long: "Match the face to the document. Validate the IC or passport. Check the name against your own watchlist or barred list. For contractors, confirm the permit-to-work and that induction is current. Verification runs in the same flow as registration — so the decision to admit is made on facts, not a glance.",
    pills: ['Face match', 'NRIC / passport check', 'Watchlist / barred list', 'Contractor permit', 'Induction check', 'Approve / deny'],
    shot: 'Identity verification — face vs document, watchlist result',
    src: IMG.verify,
  },
  {
    num: '03', slug: 'access', title: 'Access', Icon: DoorOpen,
    benefit: 'Tie entry to the person — not a card anyone can share.',
    long: "Face-ID auto-gate for high-traffic lobbies and gym floors; face-ID door lock for restricted rooms and server cabinets. Where a pass is used, the QR is dynamic — it refreshes every few seconds, so a screenshot can't be reused. Add anti-tailgating where one-in-one-out matters, zone and time rules for who goes where and when, and ANPR at the vehicle barrier.",
    pills: ['Face-ID gate', 'Face-ID door lock', 'Dynamic anti-spoof QR', 'Anti-tailgating', 'Zone & time rules', 'ANPR vehicle barrier', 'Entry log'],
    shot: 'Face-ID turnstile + door lock + vehicle barrier',
    src: IMG.gate,
  },
  {
    num: '04', slug: 'patrol', title: 'Patrol', Icon: MapPin,
    benefit: "Prove the round was walked — not just signed for.",
    long: "Guards clock in on their own phone and walk the route. At each check-point they take a geo-tagged photo — stamped with time, GPS and officer — and scan a rotating QR that has to be live and on-site. Incidents go straight into the digital occurrence book with a photo. Missed a round? HQ knows. Panic button if something goes wrong. Proof of presence you can stand behind.",
    pills: ['e-Clock-in', 'Geo-tagged photo check-points', 'Rotating-QR scan-points', 'Missed-round alert', 'Occurrence book', 'Incident + photo', 'Panic / SOS'],
    shot: 'Guard patrol app — geo-photo at a check-point',
    src: IMG.guardGeo,
  },
  {
    num: '05', slug: 'watch', title: 'Watch', Icon: Cctv,
    benefit: 'Let the cameras watch — and only call you when it matters.',
    long: "Sentry reviews the feed so a person doesn't have to stare at a wall of screens. It flags an unknown face in a staff-only zone, a worker missing a helmet or gloves, a bicycle blocking a fire exit, someone loitering at a back door, or a line crossed on the perimeter. Detections are set per camera and per zone — on only where they make sense. Recording becomes alerting.",
    pills: ['Unknown-face alert', 'PPE / glove / helmet', 'Blocked walkway', 'Loitering', 'Line crossing', 'Crowd & occupancy', 'Works with IP cameras'],
    shot: 'Sentry AI CCTV — live alerts overlaid on the feed',
    src: IMG.sentry,
  },
  {
    num: '06', slug: 'report', title: 'Report', Icon: Send,
    benefit: "Know how the site ran — without watching it all day.",
    long: "A daily site report — entries, visitors on site, patrol rounds completed, open incidents — lands on your phone every morning by WhatsApp, app push or email. The alerts that matter come in live. Every record is time-stamped and the audit trail is append-only, so it holds up for management, the JMB, or an auditor. Export to CSV or PDF anytime.",
    pills: ['Daily site report to phone', 'Live incident alerts', 'Append-only audit trail', 'Visitor & access log', 'Patrol log', 'CSV / PDF export'],
    shot: 'Daily security report on a phone + audit trail',
    src: IMG.report,
  },
  {
    num: '07', slug: 'customized', title: 'Customized', Icon: Puzzle,
    benefit: 'Localised to how your site actually runs.',
    long: "One guardhouse or fifty sites — single login, per-site setup, head-office rollup, role-based access. We keep the cameras and barriers you already have where we can, and add only what's missing. Need a specific contractor flow, a tenant portal, an ERP or payroll hook? It's modular — configured to fit, not forced from a template.",
    pills: ['Multi-site', 'One login', 'HQ rollup', 'Role-based access', 'Keep existing cameras', 'Barrier integration', 'Custom workflows', 'API access'],
    shot: 'Multi-site command console with HQ rollup',
    src: IMG.customized,
  },
];

// ────────────────────────────────────────────────────────────────
// SENTRY — AI camera oversight (the detections, elaborated)
// ────────────────────────────────────────────────────────────────
const SENTRY_DETECTIONS: { Icon: LucideIcon; title: string; body: string }[] = [
  { Icon: ScanFace,      title: 'Known & unknown faces', body: "Flags a face the system doesn't recognise in a staff-only or restricted zone — and quietly confirms the ones it does." },
  { Icon: HardHat,       title: 'PPE & safety gear',     body: "Spots a worker on the floor without a helmet, vest, mask or gloves where the rules require them — before it becomes an incident." },
  { Icon: Bike,          title: 'Obstructions & walkways', body: "Catches a bicycle, trolley or boxes left in a fire path, doorway or emergency exit, and raises it while there's still time to clear it." },
  { Icon: Footprints,    title: 'Loitering & dwell time', body: "Notices someone lingering at a back door, lift lobby or perimeter fence longer than they reasonably should." },
  { Icon: AlertTriangle, title: 'Line crossing & intrusion', body: "Draw a virtual line on the feed — a perimeter, a restricted bay — and get alerted the moment it's crossed." },
  { Icon: Users,         title: 'Crowd & occupancy',     body: "Counts heads in a zone and warns before it gets unsafe or over capacity — useful for lobbies, gyms and events." },
];

// ────────────────────────────────────────────────────────────────
// ON THE GROUND — guard accountability tools
// ────────────────────────────────────────────────────────────────
const GUARD_TOOLS: { Icon: LucideIcon; title: string; body: string; src: string }[] = [
  { Icon: Camera,        title: 'Geo-tagged patrol photos', body: "At each check-point the guard takes a photo — stamped with time, GPS location and officer ID. Proof of presence you can stand behind, not a signature on a clipboard.", src: IMG.guardGeo },
  { Icon: QrCode,        title: 'Dynamic, anti-spoof QR',   body: "Check-point and pass QR codes refresh every few seconds. A screenshot taken earlier, or sent to someone off-site, simply won't scan — the code has to be live, and in the right place.", src: IMG.guardQr },
  { Icon: ClipboardList, title: 'Digital occurrence book',  body: "Log an incident with photo, time and location; escalate, hand over between shifts and sign off — searchable later, nothing lost to a wet notebook.", src: IMG.guardBook },
  { Icon: Siren,         title: 'Panic, SOS & roll-call',   body: "A guard in trouble hits panic and HQ sees who and where instantly. In an evacuation, run a headcount and muster check from the same app.", src: IMG.guardPanic },
];

// ────────────────────────────────────────────────────────────────
// HARDWARE
// ────────────────────────────────────────────────────────────────
const HARDWARE: { Icon: LucideIcon; title: string; body: string; bullets: string[]; shot: string; src?: string }[] = [
  {
    Icon: Fence,
    title: 'Face-ID Auto Gate',
    body: 'Turnstile or boom-gate for high-traffic lobbies, gym floors and main entrances. Add the anti-tailgating sensor where one-in-one-out matters.',
    bullets: ['Turnstile / boom gate', 'Anti-tailgating (optional)', 'One-in-one-out flow', 'High-traffic ready'],
    shot: 'Face-ID turnstile at a lobby entrance',
    src: IMG.gate,
  },
  {
    Icon: DoorClosed,
    title: 'Face-ID Door Lock',
    body: "A biometric lock for a single door — restricted rooms, server / MDF cabinets, management offices, plant rooms. Simple to install, no turnstile.",
    bullets: ['Single-door install', 'No turnstile', 'Restricted rooms', 'Battery or wired'],
    shot: 'Face-ID door lock on a restricted-room door',
    src: IMG.doorlock,
  },
  {
    Icon: Cctv,
    title: 'Sentry AI Camera',
    body: 'Camera analytics for faces, PPE, obstructions, loitering and line-crossing. Works with your existing IP cameras and NVR where they support it — analytics run at the edge.',
    bullets: ['Works with existing cameras', 'Edge analytics', 'Per-zone detection rules', 'Alerts, not just recording'],
    shot: 'Sentry AI camera + analytics overlay',
    src: IMG.sentry,
  },
  {
    Icon: ScanLine,
    title: 'MyKad / Passport Reader',
    body: 'Chip reader at the guardhouse or kiosk. Reads MyKad and scans passports for visitor and contractor registration — identity captured off the document, not retyped.',
    bullets: ['MyKad chip read', 'Passport scan', 'Guardhouse or kiosk', 'PDPA-aware capture'],
    shot: 'MyKad / passport reader at the guardhouse',
    src: IMG.nric,
  },
];

// ────────────────────────────────────────────────────────────────
// COMPARISON
// ────────────────────────────────────────────────────────────────
type CompareRow = {
  label: string;
  Icon: LucideIcon;
  them: string;
  us: string;
  themMetric: string;
  usMetric: string;
  metricLabel: string;
};

const COMPARE_ROWS: CompareRow[] = [
  { label: 'Visitor log',  Icon: UserPlus,      them: 'Paper book. Illegible. Lost.',          us: 'MyKad-read, photo, searchable.',        themMetric: 'PAPER',    usMetric: 'DIGITAL',  metricLabel: 'How visitors are logged' },
  { label: 'Access',       Icon: DoorOpen,      them: 'Cards shared, cloned, lost.',           us: 'Face-ID. The person is the key.',       themMetric: 'CARD',     usMetric: 'FACE',     metricLabel: 'What unlocks the door' },
  { label: 'Passes',       Icon: QrCode,        them: 'Static QR. Screenshot reused.',         us: 'Dynamic QR. Refreshes constantly.',     themMetric: 'STATIC',   usMetric: 'LIVE',     metricLabel: 'Can a pass be spoofed' },
  { label: 'Patrol',       Icon: MapPin,        them: 'Signature on a clipboard.',             us: 'Geo-tagged photo, time, officer.',      themMetric: 'CLAIMED',  usMetric: 'PROVEN',   metricLabel: 'Proof a round was walked' },
  { label: 'CCTV',         Icon: Cctv,          them: 'Watched after the fact. If at all.',    us: 'AI flags it as it happens.',            themMetric: 'AFTER',    usMetric: 'LIVE',     metricLabel: 'When you find out' },
  { label: 'Incidents',    Icon: ClipboardList, them: 'Handwritten. Misplaced.',               us: 'Logged, photo, audit trail.',           themMetric: 'PAPER',    usMetric: 'AUDITED',  metricLabel: 'Where incidents live' },
  { label: 'Multi-site',   Icon: Shield,        them: 'A separate system per site.',           us: 'One console. HQ rollup.',               themMetric: 'N SYSTEMS', usMetric: '1 CONSOLE', metricLabel: 'Running many locations' },
  { label: 'Oversight',    Icon: Send,          them: 'Log in. Hope the report loads.',        us: 'Daily summary to your phone.',          themMetric: 'PULL',     usMetric: 'PUSH',     metricLabel: 'How you stay across it' },
];

// ────────────────────────────────────────────────────────────────
// VIDEOS — the platform in action (real hardware footage)
// ────────────────────────────────────────────────────────────────
const VIDEOS: { id: string; title: string; tag: string; desc: string }[] = [
  {
    id: 'UZxFNtalaUk',
    title: 'Face-ID Gate & Turnstile',
    tag: 'Access · Hardware',
    desc: 'A person walks up — no card, no fumble. Face matched, gate opens, in under a second. Nothing to share, clone or lose.',
  },
  {
    id: 'gQ34-uGL7TI',
    title: 'MyKad / Passport Reader',
    tag: 'Register · Identity',
    desc: 'Insert the MyKad — identity read straight off the chip, captured, and filed to the cloud. The registration step that used to be a paper book.',
  },
  {
    id: 'GoBwWbsUzTI',
    title: 'Operations Dashboard',
    tag: 'HQ · Oversight',
    desc: "Who's on site, today's entries, patrol rounds and open incidents — at a glance, with the day's report pushed to your phone.",
  },
  {
    id: 'mxBAl8NmmDQ',
    title: 'Self-Service Registration',
    tag: 'Visitor · Kiosk',
    desc: 'Visitors register themselves at the lobby kiosk — details captured, host notified, time-boxed pass issued, no queue at the guardhouse.',
  },
];

// ────────────────────────────────────────────────────────────────
// PAIN POINTS
// ────────────────────────────────────────────────────────────────
const PAIN_POINTS: { pain: string; fix: string; shot: string; src?: string }[] = [
  {
    pain: 'Still logging every visitor in a paper book at the guardhouse?',
    fix: 'Visitors register at a kiosk or with a guard — MyKad chip or passport read, photo taken, host notified, time-boxed pass issued. Legible, searchable, PDPA-handled. Seconds, not a scribble.',
    shot: 'Paper logbook → digital visitor registration',
    src: IMG.nric,
  },
  {
    pain: 'Access cards get shared, cloned, and lost?',
    fix: 'Face-ID gates and door locks tie entry to the person, not a card. Where a pass is used, the QR refreshes every few seconds — so a screenshot can\'t be reused.',
    shot: 'Face-ID gate replacing access cards',
    src: IMG.checkin,
  },
  {
    pain: 'No real way to prove guards actually walked the round?',
    fix: 'Geo-tagged photo check-points and rotating-QR scans log every round with location, time and officer — verifiable proof of presence, not a signature on a clipboard.',
    shot: 'Guard taking a geo-tagged patrol photo',
    src: IMG.guardGeo,
  },
  {
    pain: 'Hours of CCTV and nobody with time to watch it?',
    fix: 'Sentry reviews the feed for you — unknown faces, missing PPE, blocked walkways, loitering, line-crossing — and only pings a guard when there\'s something to see.',
    shot: 'Sentry AI flagging an event on the feed',
    src: IMG.sentry,
  },
];

// ────────────────────────────────────────────────────────────────
// RELIABILITY
// ────────────────────────────────────────────────────────────────
const RELIABILITY = [
  { Icon: Activity, title: 'Quiet in the background.', body: "Peak-hour lobby, shift change, a full car park — it keeps logging without drama. You forget it's there until you check the report." },
  { Icon: Lock,     title: 'Tamper-evident by design.', body: 'Entries, patrols and incidents are time-stamped on an append-only trail. Records hold up for management, the JMB, or an auditor — and export to CSV or PDF anytime.' },
  { Icon: TrendingUp, title: 'Grows with your portfolio.', body: 'One guardhouse today, fifty sites tomorrow — same console, same login, same dashboard. Add a site without re-buying the platform.' },
];

// ────────────────────────────────────────────────────────────────
// PLUGINS — optional modules that click on top of the core
// ────────────────────────────────────────────────────────────────
const PLUGINS: { Icon: LucideIcon; tag: string; title: string; body: string }[] = [
  { Icon: MapPin,        tag: 'Guarding',  title: 'Guard Tour & Patrol', body: 'Geo-tagged check-points, rotating-QR scans, e-clock-in and missed-round alerts — verifiable patrols across every site.' },
  { Icon: UserPlus,      tag: 'Front gate', title: 'Visitor Management',  body: 'Pre-registration, host approval, watchlist and time-boxed passes — the guardhouse stops keeping a paper book.' },
  { Icon: Eye,           tag: 'Cameras',   title: 'Sentry AI Analytics', body: 'PPE, obstruction, loitering, intrusion and occupancy detection layered onto the cameras you already have.' },
  { Icon: Car,           tag: 'Vehicles',  title: 'ANPR / Vehicle',      body: 'License-plate read at the barrier, resident and visitor plate lists, and gate control for car parks and loading bays.' },
  { Icon: ClipboardList, tag: 'Records',   title: 'Incident & Occurrence', body: 'A digital occurrence book — log, photo, escalate, hand over and sign off, with a searchable audit trail.' },
  { Icon: Siren,         tag: 'Emergency', title: 'Panic & Mustering',   body: 'Panic / SOS for officers and a roll-call headcount for evacuations — from the same app the team already uses.' },
];

// ────────────────────────────────────────────────────────────────
// UTILITIES
// ────────────────────────────────────────────────────────────────
function useReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>
      {children}
    </div>
  );
}

// Image frame. When `src` is set it renders the real photo (object-cover, warm
// vignette to sit on the brown theme). Otherwise it shows a premium placeholder
// — gold-framed, watermark icon, captioned — so empty slots look intentional,
// not broken. Drop a generated file at the same path later: zero code changes.
function Shot({ Icon, label, src, ratio = 'aspect-video', className = '' }: { Icon: LucideIcon; label: string; src?: string; ratio?: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  // Show the photo when we have a src that loads; otherwise fall back to the
  // premium placeholder. So a not-yet-generated image degrades gracefully —
  // drop the file at the same path and it appears, no code change.
  if (src && !failed) {
    return (
      <div className={`relative w-full overflow-hidden bg-[#0D0905] ${ratio} ${className}`}>
        <img src={src} alt={label} loading="lazy" onError={() => setFailed(true)} className="absolute inset-0 w-full h-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0D0905]/55 via-transparent to-[#0D0905]/10" />
        <div aria-hidden="true" className="absolute inset-0 ring-1 ring-inset ring-[#D4AF37]/15" />
      </div>
    );
  }
  return (
    <div className={`relative w-full overflow-hidden bg-gradient-to-br from-[#241A0F] via-[#17110A] to-[#0D0905] ${ratio} ${className}`}>
      <Icon aria-hidden="true" strokeWidth={1} className="absolute -right-5 -bottom-5 text-[#D4AF37]/[0.06]" size={190} />
      <div aria-hidden="true" className="absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(rgba(212,175,55,0.05) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
      <div aria-hidden="true" className="absolute inset-0 ring-1 ring-inset ring-[#D4AF37]/10" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center gap-2.5 px-5 text-center">
        <div className="w-12 h-12 border border-[#D4AF37]/40 bg-[#D4AF37]/10 flex items-center justify-center">
          <Icon size={20} strokeWidth={1.75} className="text-[#D4AF37]" />
        </div>
        <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#D4AF37]/80 max-w-[26ch] leading-snug">{label}</span>
        <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/25">Image · to generate</span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// HEADER
// ────────────────────────────────────────────────────────────────
const ANNOUNCEMENTS = [
  'Visitor logs, access, patrol and CCTV — joined up on one platform.',
  'Face-ID access. Dynamic anti-spoof passes. AI camera alerts.',
  'Localised for how security actually runs on the ground.',
];

function QSecurityHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [annIdx, setAnnIdx] = useState(0);
  const [annFade, setAnnFade] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnnFade(false);
      setTimeout(() => { setAnnIdx(p => (p + 1) % ANNOUNCEMENTS.length); setAnnFade(true); }, 300);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: 'Pain points',  href: '#pain' },
    { label: 'How it works', href: '#flow' },
    { label: 'Sentry AI',    href: '#sentry' },
    { label: 'On the ground', href: '#guards' },
    { label: 'Hardware',     href: '#hardware' },
    { label: 'Why us',       href: '#compare' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50" role="banner">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-[#D4AF37] focus:text-black focus:px-3 focus:py-1.5 focus:text-[11px] focus:font-bold focus:uppercase">
        Skip to content
      </a>

      <div className="bg-[#0D0905] text-white hidden lg:block border-b border-[#D4AF37]/10">
        <div className="container mx-auto px-4 md:px-6 lg:px-12 py-1.5 flex items-center justify-between">
          <div className="flex items-center divide-x divide-white/10 text-[10px] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 pr-4 text-gray-400">
              <Shield size={10} strokeWidth={2.5} className="text-[#D4AF37]" />
              QSECURITY by QBot
            </span>
            <span className="px-4 text-gray-400">Mon–Fri · 10AM–7PM</span>
            <span className={`pl-4 text-[#D4AF37] transition-opacity duration-300 ${annFade ? 'opacity-100' : 'opacity-0'}`}>
              {ANNOUNCEMENTS[annIdx]}
            </span>
          </div>
          <div className="flex items-center gap-4 divide-x divide-white/10">
            <a href={WA} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors">
              <MessageCircle size={10} strokeWidth={2.5} />
              +6012-6909-189
            </a>
          </div>
        </div>
      </div>

      <nav className={`transition-all duration-300 bg-[#17110A]/90 backdrop-blur-xl backdrop-saturate-150 border-b border-[#D4AF37]/15 ${scrolled ? 'shadow-sm' : ''}`} aria-label="Primary">
        <div className="container mx-auto px-4 md:px-6 lg:px-12 py-3 md:py-4">
          <div className="flex items-center">
            <a href="#main" className="flex items-center gap-2.5 group mr-8" aria-label="QSECURITY home">
              <span className="w-9 h-9 md:w-10 md:h-10 border-2 border-[#D4AF37]/50 bg-[#D4AF37]/10 flex items-center justify-center">
                <Shield size={18} strokeWidth={2} className="text-[#D4AF37]" />
              </span>
              <span className="text-white text-[15px] md:text-[17px] font-black uppercase tracking-[0.18em] leading-none">
                QSECURITY
              </span>
            </a>

            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navItems.map(item => (
                <a key={item.label} href={item.href} className="text-[11px] font-bold tracking-[0.1em] uppercase text-white hover:text-[#D4AF37] transition-colors duration-200">
                  {item.label}
                </a>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-5 ml-auto">
              <a href={WA_DEMO} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] hover:bg-white text-black text-[11px] font-bold uppercase tracking-wider transition-colors">
                <MessageCircle size={14} strokeWidth={2} /> Book a walkthrough <ChevronRight size={14} strokeWidth={2.5} />
              </a>
            </div>

            <div className="lg:hidden flex items-center ml-auto gap-2">
              <a href={WA_DEMO} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37] text-black text-[10px] font-bold uppercase tracking-wider">
                <MessageCircle size={12} strokeWidth={2} /> Demo
              </a>
              <button onClick={() => setMobileMenu(p => !p)} className="w-11 h-11 inline-flex items-center justify-center text-white" aria-label="Toggle menu" aria-expanded={mobileMenu}>
                {mobileMenu ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
                )}
              </button>
            </div>
          </div>

          {mobileMenu && (
            <div className="lg:hidden border-t border-white/10 py-3 flex flex-col gap-1">
              {[...navItems, { label: 'Book a walkthrough', href: WA_DEMO }].map(item => (
                <a key={item.label} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  onClick={() => setMobileMenu(false)}
                  className="text-[13px] font-bold uppercase tracking-wider text-white hover:text-[#D4AF37] min-h-[44px] py-3 px-2 flex items-center transition-colors">
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

// ────────────────────────────────────────────────────────────────
// FOOTER
// ────────────────────────────────────────────────────────────────
function QSecurityFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="relative bg-[#0D0905] text-white border-t border-[#D4AF37]/15" role="contentinfo">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="mb-4 flex items-center gap-2.5">
              <span className="w-11 h-11 border-2 border-[#D4AF37]/50 bg-[#D4AF37]/10 flex items-center justify-center">
                <Shield size={20} strokeWidth={2} className="text-[#D4AF37]" />
              </span>
              <span className="text-white text-[15px] font-black uppercase tracking-[0.18em]">QSECURITY</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-wide mb-1.5">Visitor registration, access, patrol & oversight.</p>
            <p className="text-[11px] text-gray-400 leading-relaxed mb-5">One platform for everyone who comes through your gate — localised for security and access control.</p>
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/qbotmalaysia" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-500 hover:text-[#D4AF37] transition-colors"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
              <a href="https://www.instagram.com/qbotfuture" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-500 hover:text-[#D4AF37] transition-colors"><Instagram size={16} strokeWidth={2} /></a>
            </div>
          </div>

          <div>
            <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-[0.15em] mb-3">Platform</p>
            <ul className="space-y-1.5">
              {[
                { label: 'Pain points',    href: '#pain' },
                { label: 'How it works',   href: '#flow' },
                { label: 'Register',       href: '#flow-register' },
                { label: 'Verify',         href: '#flow-verify' },
                { label: 'Access',         href: '#flow-access' },
                { label: 'Patrol',         href: '#flow-patrol' },
                { label: 'Watch',          href: '#flow-watch' },
                { label: 'Sentry AI CCTV', href: '#sentry' },
                { label: 'On the ground',  href: '#guards' },
                { label: 'Why QSECURITY',  href: '#compare' },
              ].map(item => (
                <li key={item.label}><a href={item.href} className="text-[12px] text-gray-400 hover:text-white transition-colors block py-1 min-h-[32px]">{item.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-[0.15em] mb-3">Hardware</p>
            <ul className="space-y-1.5 mb-6">
              <li><a href="#hardware" className="text-[12px] text-gray-400 hover:text-white transition-colors">Face-ID Auto Gate</a></li>
              <li><a href="#hardware" className="text-[12px] text-gray-400 hover:text-white transition-colors">Face-ID Door Lock</a></li>
              <li><a href="#hardware" className="text-[12px] text-gray-400 hover:text-white transition-colors">Sentry AI Camera</a></li>
              <li><a href="#hardware" className="text-[12px] text-gray-400 hover:text-white transition-colors">MyKad / Passport Reader</a></li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] text-white font-bold uppercase tracking-[0.15em] mb-3">Contact</p>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-400"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <div>
                  <p className="text-[12px] text-gray-400 leading-snug">B3-6-13 Solaris Dutamas</p>
                  <p className="text-[12px] text-gray-400 leading-snug">Jalan Dutamas 1, 50480</p>
                  <p className="text-[11px] text-gray-400">Publika KL</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle size={14} className="flex-shrink-0 text-gray-400" strokeWidth={2} />
                <a href={WA} target="_blank" rel="noopener noreferrer" className="text-[12px] text-gray-400 hover:text-white transition-colors">+6012-6909-189</a>
              </div>
              <p className="text-[10px] text-gray-400 pl-[26px]">Mon–Fri · 10AM–7PM</p>
              <a href={WA_DEMO} target="_blank" rel="noopener noreferrer"
                className="inline-block bg-[#D4AF37] hover:bg-white text-black text-[10px] font-bold uppercase tracking-wider px-5 py-2.5 transition-colors">
                Book a walkthrough
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-[11px] text-gray-500">
          <p>&copy; {currentYear} QBot — QSECURITY is part of the QBot product family.</p>
        </div>
      </div>
    </footer>
  );
}

// ────────────────────────────────────────────────────────────────
// HERO
// ────────────────────────────────────────────────────────────────
function Hero() {
  const [word, setWord] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setWord(w => (w + 1) % HERO_VERTICALS.length);
        setFade(true);
      }, 220);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 md:px-6 pt-24 md:pt-32 pb-12 md:pb-16 relative overflow-hidden bg-[#17110A]">
      {/* layered brown ambience — no image dependency */}
      <div aria-hidden="true" className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 18%, rgba(212,175,55,0.14) 0%, transparent 55%), radial-gradient(circle at 85% 90%, rgba(120,70,20,0.18) 0%, transparent 50%), linear-gradient(180deg, #1B130B 0%, #17110A 45%, #0D0905 100%)' }} />
      <div aria-hidden="true" className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(rgba(212,175,55,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="relative z-10 max-w-5xl w-full text-center">
        <p className="inline-flex items-center gap-2 text-[10px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#D4AF37] mb-5 md:mb-6">
          <Shield size={12} strokeWidth={2.5} /> The Security Operations Platform
        </p>

        <h1 className="text-white font-black uppercase tracking-tight leading-[1.05] max-w-5xl mx-auto text-[34px] sm:text-[50px] md:text-[64px] lg:text-[76px]">
          Peace of mind.<br className="hidden sm:block" /> For your{' '}
          <span className={`text-[#D4AF37] transition-opacity duration-200 ${fade ? 'opacity-100' : 'opacity-0'}`}>
            {HERO_VERTICALS[word]}
          </span>
        </h1>

        <p className="text-gray-200 text-[14px] md:text-[17px] leading-relaxed max-w-2xl mx-auto mt-7 md:mt-9">
          Visitor registration, identity checks, face-ID access, AI camera oversight and guard patrol — joined up on one platform. Built on the access and identity engine already running on the ground, localised for security and access control.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2.5 md:gap-3 mt-8 md:mt-10">
          <a href="#who"
            className="inline-flex items-center px-5 py-3 border-2 border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 text-white hover:text-[#D4AF37] text-[12px] md:text-[13px] font-bold uppercase tracking-wider transition-colors">
            Who it's for
          </a>
          <a href="#flow"
            className="inline-flex items-center px-5 py-3 border-2 border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 text-white hover:text-[#D4AF37] text-[12px] md:text-[13px] font-bold uppercase tracking-wider transition-colors">
            How it works
          </a>
          <a href="#sentry"
            className="inline-flex items-center px-5 py-3 border-2 border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 text-white hover:text-[#D4AF37] text-[12px] md:text-[13px] font-bold uppercase tracking-wider transition-colors">
            Sentry AI CCTV
          </a>
        </div>
      </div>

      <a href="#who" aria-label="Scroll down" className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 hover:text-[#D4AF37] transition-colors flex-col items-center gap-1">
        <span className="text-[9px] font-mono uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown size={16} strokeWidth={2} className="animate-bounce" />
      </a>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// WHO IT'S FOR
// ────────────────────────────────────────────────────────────────
function WhoSection() {
  return (
    <section id="who" className="py-16 md:py-24 px-4 md:px-6 border-t border-white/10 bg-[#17110A] text-white scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#D4AF37] mb-4">Who it's for</p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-10 md:mb-14 leading-tight max-w-3xl">
            Built for the places where people, vehicles and contractors come through a gate.
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {AUDIENCE.map(({ Icon, label, sub, src }, i) => (
            <Reveal key={label} delay={i * 0.06}>
              <article className="group border-2 border-white/15 hover:border-[#D4AF37]/60 bg-white/[0.02] h-full overflow-hidden transition-colors flex flex-col">
                <Shot Icon={Icon} label={label} src={src} ratio="aspect-[4/3]" />
                <div className="p-4 md:p-5 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 md:w-8 md:h-8 border border-[#D4AF37]/50 bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={14} strokeWidth={2} className="text-[#D4AF37]" />
                    </div>
                    <h3 className="text-white text-[13px] md:text-[15px] font-black uppercase tracking-tight leading-tight">{label}</h3>
                  </div>
                  <p className="text-gray-400 text-[11px] md:text-[12px] leading-snug">{sub}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="text-gray-300 text-[14px] md:text-[15px] leading-relaxed mt-8 md:mt-10 max-w-3xl">
            If you control who gets in, where they go, and who's accountable for it — QSECURITY runs it.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-8 md:mt-10 border-t border-white/10 pt-6 md:pt-7">
            <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-white/40 mb-3">Also works for</p>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {ALSO_WORKS.map(w => (
                <span key={w} className="inline-block text-[11px] md:text-[12px] text-gray-400 border border-white/10 bg-white/[0.02] px-2.5 py-1">
                  {w}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// 3 PILLARS — Control · Accountability · Peace of mind
// ────────────────────────────────────────────────────────────────
const PILLARS: { num: string; eyebrow: string; title: string; mirror: string; body: string; Icon: LucideIcon }[] = [
  {
    num: '01', eyebrow: 'Control', title: 'See who\'s on site.',
    mirror: 'Tired of not knowing who\'s inside the perimeter?',
    body: 'Every person, vehicle and contractor inside the gate — live. Who came in, who hasn\'t left, who\'s where they shouldn\'t be. Without flipping through a logbook.',
    Icon: Eye,
  },
  {
    num: '02', eyebrow: 'Accountability', title: 'Prove what happened.',
    mirror: 'Tired of "we did patrol" with nothing to show?',
    body: 'Every entry, patrol round and incident is time-stamped, geo-tagged and tamper-evident. When management, the JMB or an auditor asks, the record answers.',
    Icon: ShieldCheck,
  },
  {
    num: '03', eyebrow: 'Peace of mind', title: 'Sleep at night.',
    mirror: 'Tired of watching screens that show nothing 99% of the time?',
    body: 'The routine watching is automated. Cameras flag what matters, passes can\'t be spoofed, and the day\'s report comes to your phone. A human steps in only when something needs one.',
    Icon: Shield,
  },
];

function PillarsSection() {
  return (
    <section id="pillars" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-[#17110A] text-white scroll-mt-20 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 55%)' }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal>
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#D4AF37] mb-4">QSECURITY · Built on 3 pillars</p>
          <h2 className="text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 leading-[1.05]">
            Control. Accountability. <span className="text-[#D4AF37]">Peace of mind.</span>
          </h2>
          <p className="text-gray-300 text-[13px] md:text-[15px] leading-relaxed max-w-2xl mb-10 md:mb-14">
            Not more screens to watch. The three things a security operation actually needs — sharpened for sites where access and accountability are the job.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {PILLARS.map((p, i) => (
            <Reveal key={p.num} delay={i * 0.08}>
              <article className="border-2 border-white/15 hover:border-[#D4AF37]/60 bg-white/[0.02] p-6 md:p-7 h-full transition-colors relative group">
                <div className="absolute top-4 right-4 font-mono text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#D4AF37]/60 group-hover:text-[#D4AF37] transition-colors">
                  {p.num} · {p.eyebrow}
                </div>
                <div className="w-12 h-12 md:w-14 md:h-14 border-2 border-[#D4AF37]/40 bg-[#D4AF37]/10 flex items-center justify-center mb-5 md:mb-6">
                  <p.Icon size={22} strokeWidth={2} className="text-[#D4AF37]" />
                </div>
                <h3 className="text-white text-[22px] md:text-[26px] lg:text-[28px] font-black uppercase tracking-tight leading-[1.05] mb-3">
                  {p.title}
                </h3>
                <p className="text-[#D4AF37]/90 text-[12px] md:text-[13px] font-mono italic mb-3.5 md:mb-4">
                  {p.mirror}
                </p>
                <p className="text-gray-300 text-[13px] md:text-[14px] leading-relaxed">
                  {p.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// PAIN POINTS
// ────────────────────────────────────────────────────────────────
function PainPointsSection() {
  return (
    <section id="pain" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-[#17110A] text-white scroll-mt-20 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 20% 30%, rgba(212,175,55,0.08) 0%, transparent 55%)' }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal>
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#D4AF37] mb-4">Still doing it the hard way?</p>
          <h2 className="text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 leading-[1.05] max-w-3xl">
            Less paperwork. <span className="text-[#D4AF37]">More proof.</span> Fewer blind spots.
          </h2>
          <p className="text-gray-300 text-[13px] md:text-[15px] leading-relaxed max-w-2xl mb-10 md:mb-14">
            The four things that quietly cost a security operation — the gaps no one can fully account for. QSECURITY closes them.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {PAIN_POINTS.map((p, i) => (
            <Reveal key={p.pain} delay={i * 0.08}>
              <article className="group border-2 border-white/15 hover:border-[#D4AF37]/60 bg-white/[0.02] overflow-hidden h-full flex flex-col transition-colors">
                <div className="relative">
                  <Shot Icon={[UserPlus, DoorOpen, Camera, Cctv][i]} label={p.shot} src={p.src} ratio="aspect-[16/9]" />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-2 bg-black/75 backdrop-blur-sm border border-[#D4AF37]/40 px-2.5 py-1">
                    <span className="text-[#D4AF37] text-[10px] font-mono font-bold uppercase tracking-wider">Gap · {String(i + 1).padStart(2, '0')}</span>
                  </div>
                </div>
                <div className="p-5 md:p-7 flex flex-col gap-3">
                  <p className="text-[#D4AF37]/90 text-[13px] md:text-[14px] font-mono italic leading-snug">{p.pain}</p>
                  <p className="text-white text-[15px] md:text-[17px] font-bold leading-snug">{p.fix}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="text-gray-300 text-[12px] md:text-[14px] italic text-center mt-10 md:mt-14 max-w-2xl mx-auto">
            Nothing here is exotic. It's the same access, identity and automation engine running today — pointed at the security job.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// FLOW — the security lifecycle
// ────────────────────────────────────────────────────────────────
function FlowSection() {
  const [active, setActive] = useState(0);
  const [fade, setFade] = useState(true);
  const stripRef = useRef<HTMLDivElement>(null);
  const total = FLOW_STEPS.length;

  const goTo = useCallback((next: number) => {
    const idx = ((next % total) + total) % total;
    setFade(false);
    setTimeout(() => { setActive(idx); setFade(true); }, 180);
  }, [total]);

  const prev = () => goTo(active - 1);
  const next = () => goTo(active + 1);

  const touchStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 48) (dx < 0 ? next : prev)();
    touchStart.current = null;
  };

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const el = strip.querySelector<HTMLElement>(`[data-step="${active}"]`);
    if (!el) return;
    const stripRect = strip.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const targetLeft = strip.scrollLeft + (elRect.left - stripRect.left) - (stripRect.width - elRect.width) / 2;
    strip.scrollTo({ left: targetLeft, behavior: 'smooth' });
  }, [active]);

  useEffect(() => {
    const slugMap: Record<string, number> = Object.fromEntries(FLOW_STEPS.map((s, i) => [s.slug, i]));
    const fromHash = () => {
      const h = window.location.hash.replace('#', '');
      const match = h.startsWith('flow-') ? h.slice(5) : null;
      if (match && slugMap[match] !== undefined) {
        setActive(slugMap[match]);
        setTimeout(() => document.getElementById('flow')?.scrollIntoView({ behavior: 'smooth' }), 80);
      }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const step = FLOW_STEPS[active];
  const StepIcon = step.Icon;

  return (
    <section id="flow" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-[#17110A] text-white scroll-mt-20 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 80% 20%, rgba(212,175,55,0.10) 0%, transparent 55%)' }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal>
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#D4AF37] mb-4">Seven things QSECURITY does — every day</p>
          <h2 className="text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 leading-[1.05]">
            From the gate to the report. <span className="text-[#D4AF37]">On one system.</span>
          </h2>
          <p className="text-gray-300 text-[13px] md:text-[15px] leading-relaxed max-w-2xl mb-8 md:mb-12">
            The lifecycle a security operation runs every shift — tap any step to see the benefit, how it works, and what's inside.
          </p>
        </Reveal>

        <div ref={stripRef} className="-mx-4 md:mx-0 overflow-x-auto md:overflow-visible scroll-smooth snap-x snap-mandatory md:snap-none">
          <ol className="flex md:grid md:grid-cols-7 gap-2 md:gap-3 px-4 md:px-0 relative pb-1 md:pb-0 min-w-max md:min-w-0" aria-label="The seven-step QSECURITY flow">
            <div aria-hidden="true" className="hidden md:block absolute top-7 lg:top-8 left-[7%] right-[7%] h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
            {FLOW_STEPS.map((s, i) => {
              const isActive = i === active;
              return (
                <li key={s.num} data-step={i} className="snap-center md:snap-none flex-shrink-0 w-[88px] md:w-auto">
                  <button onClick={() => goTo(i)} aria-pressed={isActive} aria-label={`${s.num} ${s.title}`}
                    className="w-full flex flex-col items-center text-center group focus:outline-none">
                    <span
                      className={`relative z-10 w-14 h-14 lg:w-16 lg:h-16 border-2 flex items-center justify-center transition-all duration-200 ${
                        isActive
                          ? 'border-[#D4AF37] bg-[#D4AF37] text-black shadow-[0_0_24px_rgba(212,175,55,0.4)]'
                          : 'border-[#D4AF37]/40 bg-[#17110A] text-[#D4AF37] group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37]/10'
                      }`}>
                      <s.Icon size={22} strokeWidth={2} />
                    </span>
                    <span className={`font-mono text-[10px] font-black uppercase tracking-widest mt-2.5 md:mt-3 transition-colors ${isActive ? 'text-[#D4AF37]' : 'text-[#D4AF37]/70'}`}>{s.num}</span>
                    <span className={`text-[12px] md:text-[14px] lg:text-[15px] font-black uppercase tracking-tight mt-1 transition-colors ${isActive ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>{s.title}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
          className="mt-8 md:mt-12 border-2 border-[#D4AF37]/30 bg-black/40">
          <div className={`grid grid-cols-1 md:grid-cols-2 transition-opacity duration-200 ${fade ? 'opacity-100' : 'opacity-0'}`}>
            <div className="relative md:min-h-[360px] lg:min-h-[420px] overflow-hidden bg-[#17110A] border-b md:border-b-0 md:border-r border-[#D4AF37]/20">
              <Shot Icon={StepIcon} label={step.shot} src={step.src} ratio="aspect-[5/4] sm:aspect-video md:aspect-auto md:h-full" className="md:absolute md:inset-0" />
              <div className="absolute top-3 left-3 inline-flex items-center gap-2 bg-black/80 backdrop-blur-sm border border-[#D4AF37]/40 px-2.5 py-1">
                <StepIcon size={14} className="text-[#D4AF37]" strokeWidth={2} />
                <span className="text-[#D4AF37] text-[10px] font-mono font-bold uppercase tracking-wider">{step.num} · {step.title}</span>
              </div>
            </div>
            <div className="p-5 sm:p-6 md:p-8 lg:p-10 flex flex-col">
              <div className="flex items-baseline gap-3 mb-3 md:mb-4">
                <span className="font-mono text-[12px] md:text-[13px] font-black uppercase tracking-widest text-[#D4AF37]">{step.num} / 07</span>
                <span className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-white/40">{step.title}</span>
              </div>
              <h3 className="text-white text-[22px] sm:text-[26px] md:text-[30px] lg:text-[36px] font-black uppercase tracking-tight leading-[1.05] mb-4 md:mb-5">
                <span className="text-[#D4AF37]">{step.benefit}</span>
              </h3>
              <p className="text-gray-300 text-[13px] sm:text-[14px] md:text-[15px] leading-relaxed mb-5 md:mb-6">
                {step.long}
              </p>
              <ul className="flex flex-wrap gap-1.5 md:gap-2 mb-6 md:mb-8" aria-label={`${step.title} capabilities`}>
                {step.pills.map(p => (
                  <li key={p} className="inline-block border border-[#D4AF37]/30 bg-[#D4AF37]/[0.05] text-[#D4AF37] text-[10px] md:text-[11px] font-mono uppercase tracking-wider px-2.5 py-1">
                    {p}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                <button onClick={prev} aria-label="Previous step"
                  className="inline-flex items-center gap-2 px-4 py-3 min-h-[44px] border-2 border-white/30 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white text-[11px] font-bold uppercase tracking-wider transition-colors">
                  <ChevronLeft size={16} strokeWidth={2.5} /> <span className="hidden sm:inline">Prev</span>
                </button>
                <div className="flex items-center gap-1.5 flex-1 justify-center" role="tablist" aria-label="Jump to step">
                  {FLOW_STEPS.map((_, i) => (
                    <button key={i} onClick={() => goTo(i)} aria-label={`Step ${i + 1}`} aria-selected={i === active} role="tab"
                      className={`h-[3px] transition-all duration-300 ${i === active ? 'w-7 bg-[#D4AF37]' : 'w-2.5 bg-white/30 hover:bg-white/60'}`} />
                  ))}
                </div>
                <button onClick={next} aria-label="Next step"
                  className="inline-flex items-center gap-2 px-4 py-3 min-h-[44px] bg-[#D4AF37] hover:bg-white text-black text-[11px] font-bold uppercase tracking-wider transition-colors">
                  <span className="hidden sm:inline">Next</span> <ChevronRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <Reveal>
          <p className="text-gray-300 text-[12px] md:text-[14px] italic text-center mt-10 md:mt-14 max-w-2xl mx-auto px-2">
            Most setups bolt these together from four vendors. QSECURITY runs the whole lifecycle on one.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// SENTRY — AI camera oversight
// ────────────────────────────────────────────────────────────────
function SentrySection() {
  return (
    <section id="sentry" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-[#17110A] text-white scroll-mt-20 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 70% 10%, rgba(212,175,55,0.10) 0%, transparent 55%)' }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal>
          <p className="inline-flex items-center gap-2 text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#D4AF37] mb-4">
            <Cctv size={14} strokeWidth={2.5} /> Sentry · AI camera oversight
          </p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 leading-tight max-w-3xl">
            Cameras that watch — <span className="text-[#D4AF37]">so a person doesn't have to.</span>
          </h2>
          <p className="text-gray-300 text-[14px] md:text-[15px] leading-relaxed max-w-2xl mb-10 md:mb-14">
            Sentry reviews the feed and raises a flag when it sees something worth a look. Detections are set per camera and per zone — switched on only where they make sense — and run on the IP cameras you already have, where they support it.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6 md:gap-8 items-stretch mb-10 md:mb-12">
          <Reveal>
            <div className="relative h-full min-h-[260px] border-2 border-[#D4AF37]/30 overflow-hidden">
              <Shot Icon={Cctv} label="Sentry live view — detections overlaid on camera feed" src={IMG.sentry} ratio="h-full min-h-[260px]" />
              <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
                {['● LIVE', 'CAM 03 · LOADING BAY', 'PPE: 1 alert', 'OBSTRUCTION: fire exit'].map((t, i) => (
                  <span key={t} className={`text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1 border ${i === 0 ? 'text-[#D4AF37] border-[#D4AF37]/50 bg-black/70' : 'text-white/70 border-white/20 bg-black/60'}`}>{t}</span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="h-full border-2 border-white/15 bg-white/[0.02] p-6 md:p-8 flex flex-col justify-center">
              <h3 className="text-white text-[18px] md:text-[22px] font-black uppercase tracking-tight leading-tight mb-4">Recording is hindsight. <span className="text-[#D4AF37]">Alerting is now.</span></h3>
              <p className="text-gray-300 text-[13px] md:text-[14px] leading-relaxed mb-4">
                A wall of recorded screens only helps after something's gone wrong. Sentry turns the same cameras into a second pair of eyes that never blinks — and routes what it finds to the guard who can act on it.
              </p>
              <ul className="space-y-2">
                {['Set rules per camera and per zone', 'Alerts to the app, not just the DVR', 'Works alongside your existing NVR / cameras', 'Every alert logged for the audit trail'].map(b => (
                  <li key={b} className="flex items-start gap-2 text-gray-300 text-[12px] md:text-[13px]">
                    <span aria-hidden="true" className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 bg-[#D4AF37]" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {SENTRY_DETECTIONS.map(({ Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 0.05}>
              <article className="group border-2 border-white/15 hover:border-[#D4AF37]/50 bg-white/[0.02] p-6 md:p-7 h-full transition-colors">
                <div className="w-11 h-11 md:w-12 md:h-12 border-2 border-[#D4AF37]/40 bg-[#D4AF37]/10 flex items-center justify-center mb-5">
                  <Icon size={20} strokeWidth={2} className="text-[#D4AF37]" />
                </div>
                <h3 className="text-white text-[15px] md:text-[17px] font-black uppercase tracking-tight leading-tight mb-2.5">{title}</h3>
                <p className="text-gray-300 text-[13px] md:text-[14px] leading-relaxed">{body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="text-white/40 text-[11px] md:text-[12px] font-mono uppercase tracking-[0.18em] mt-8 md:mt-10 text-center">
            Detection coverage depends on camera placement and quality — we scope what's realistic on your site, not a wishlist.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// ON THE GROUND — guard accountability
// ────────────────────────────────────────────────────────────────
function GuardSection() {
  return (
    <section id="guards" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-[#17110A] text-white scroll-mt-20 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 25% 30%, rgba(212,175,55,0.08) 0%, transparent 55%)' }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal>
          <p className="inline-flex items-center gap-2 text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#D4AF37] mb-4">
            <MapPin size={14} strokeWidth={2.5} /> On the ground · for the guard force
          </p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 leading-tight max-w-3xl">
            Built for the officer on duty — <span className="text-[#D4AF37]">and the proof you need after.</span>
          </h2>
          <p className="text-gray-300 text-[14px] md:text-[15px] leading-relaxed max-w-2xl mb-10 md:mb-14">
            A guard's phone becomes the duty tool — clock in, walk the round, log what happens, raise the alarm. Every action carries a time, a place and an officer, so the record speaks for itself.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {GUARD_TOOLS.map(({ Icon, title, body, src }, i) => (
            <Reveal key={title} delay={i * 0.06}>
              <article className="group border-2 border-white/15 hover:border-[#D4AF37]/60 bg-white/[0.02] overflow-hidden h-full flex flex-col md:flex-row transition-colors">
                <div className="md:w-2/5 flex-shrink-0">
                  <Shot Icon={Icon} label={title} src={src} ratio="aspect-[16/10] md:aspect-auto md:h-full md:min-h-[180px]" />
                </div>
                <div className="p-5 md:p-6 flex flex-col justify-center">
                  <h3 className="text-white text-[16px] md:text-[18px] font-black uppercase tracking-tight leading-tight mb-2.5">{title}</h3>
                  <p className="text-gray-300 text-[13px] md:text-[14px] leading-relaxed">{body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-10 md:mt-14 border-2 border-[#D4AF37]/30 bg-[#D4AF37]/[0.04] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            <div className="w-12 h-12 border-2 border-[#D4AF37]/50 bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
              <Fingerprint size={22} strokeWidth={2} className="text-[#D4AF37]" />
            </div>
            <p className="text-gray-200 text-[13px] md:text-[15px] leading-relaxed">
              <span className="text-white font-bold">Why dynamic QR matters:</span> a static code printed on a wall or saved as a screenshot can be scanned from a sofa. A code that refreshes every few seconds can only be scanned live, at the point itself — which is the whole point of a patrol.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// HARDWARE
// ────────────────────────────────────────────────────────────────
function HardwareSection() {
  return (
    <section id="hardware" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-[#17110A] text-white scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#D4AF37] mb-4">The hardware at the edge</p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 leading-tight">
            Pick what fits the door — and the budget.
          </h2>
          <p className="text-gray-300 text-[14px] md:text-[15px] leading-relaxed max-w-2xl mb-10 md:mb-14">
            Same software, same records, same logs behind every device. Keep the cameras and barriers you already have where we can; add only what's missing.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          {HARDWARE.map((h, i) => (
            <Reveal key={h.title} delay={i * 0.08}>
              <article className="border-2 border-white/15 hover:border-[#D4AF37]/60 bg-white/[0.02] overflow-hidden h-full flex flex-col transition-colors">
                <div className="relative">
                  <Shot Icon={h.Icon} label={h.shot} src={h.src} ratio="aspect-[5/3]" />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-2 bg-black/70 backdrop-blur-sm border border-[#D4AF37]/40 px-2.5 py-1">
                    <h.Icon size={14} className="text-[#D4AF37]" strokeWidth={2} />
                    <span className="text-[#D4AF37] text-[10px] font-mono font-bold uppercase tracking-wider">Hardware</span>
                  </div>
                </div>
                <div className="p-5 md:p-6 flex-1 flex flex-col">
                  <h3 className="text-white text-[18px] md:text-[22px] font-black uppercase tracking-tight leading-tight mb-3">{h.title}</h3>
                  <p className="text-gray-300 text-[13px] md:text-[14px] leading-relaxed mb-4">{h.body}</p>
                  <ul className="space-y-1.5 mt-auto">
                    {h.bullets.map(b => (
                      <li key={b} className="flex items-start gap-2 text-gray-400 text-[12px] md:text-[13px]">
                        <span aria-hidden="true" className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 bg-[#D4AF37]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// VIDEOS
// ────────────────────────────────────────────────────────────────
function VideosSection() {
  return (
    <section id="videos" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-[#17110A] text-white scroll-mt-20 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 55%)' }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal>
          <div className="flex items-center gap-2 mb-4">
            <PlayCircle size={14} strokeWidth={2.5} className="text-[#D4AF37]" />
            <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#D4AF37]">The platform in action</p>
          </div>
          <h2 className="text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 leading-[1.05] max-w-3xl">
            See it run. <span className="text-[#D4AF37]">Same hardware, real footage.</span>
          </h2>
          <p className="text-gray-300 text-[13px] md:text-[15px] leading-relaxed max-w-2xl mb-10 md:mb-14">
            The face-ID gate, the MyKad reader, the dashboard — recorded from the live system. They play on loop; open any on YouTube for sound and full screen.
          </p>
        </Reveal>

        <div className="grid gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {VIDEOS.map((v, i) => (
            <Reveal key={`${v.id}-${i}`} delay={Math.min(i * 0.06, 0.24)}>
              <article className="group border-2 border-white/15 hover:border-[#D4AF37]/60 bg-white/[0.02] overflow-hidden h-full flex flex-col transition-colors">
                <div className="relative aspect-[9/16] overflow-hidden bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&mute=1&loop=1&playlist=${v.id}&controls=0&modestbranding=1&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1`}
                    title={`${v.title} — QSECURITY`}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  />
                  <div className="pointer-events-none absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 bg-black/75 backdrop-blur-sm border border-[#D4AF37]/40 px-2 py-0.5">
                    <span aria-hidden="true" className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full qsec-dot-pulse" />
                    <span className="text-[#D4AF37] text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-wider">Clip · {String(i + 1).padStart(2, '0')}</span>
                  </div>
                </div>
                <div className="p-4 md:p-5 flex flex-col flex-1">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37]/80 mb-1.5">{v.tag}</p>
                  <h3 className="text-white text-[14px] md:text-[15px] font-black uppercase tracking-tight leading-tight mb-2">{v.title}</h3>
                  <p className="text-gray-400 text-[12px] md:text-[13px] leading-snug">{v.desc}</p>
                  <a
                    href={`https://www.youtube.com/shorts/${v.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-wider text-[#D4AF37] hover:text-white transition-colors"
                  >
                    Open on YouTube <ArrowRight size={12} strokeWidth={2.5} />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// PLUGINS
// ────────────────────────────────────────────────────────────────
function PluginsSection() {
  return (
    <section id="plugins" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-[#17110A] text-white scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#D4AF37] mb-4">Modules &amp; add-ons</p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-5 leading-tight max-w-3xl">
            Switch on more <span className="text-[#D4AF37]">when the site needs it.</span>
          </h2>
          <p className="text-gray-300 text-[15px] md:text-[17px] leading-relaxed max-w-2xl mb-10 md:mb-14">
            The core covers register, access, patrol, watch and report. These click on top when a site calls for them — no second system to learn.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {PLUGINS.map(({ Icon, tag, title, body }, i) => (
            <Reveal key={title} delay={i * 0.05}>
              <article className="group border-2 border-white/15 bg-white/[0.02] hover:border-[#D4AF37]/50 transition-colors p-6 md:p-7 h-full">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 md:w-12 md:h-12 border-2 border-[#D4AF37]/40 bg-[#D4AF37]/10 flex items-center justify-center">
                    <Icon size={20} strokeWidth={2} className="text-[#D4AF37]" />
                  </div>
                  <span className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#D4AF37]/70 border border-[#D4AF37]/30 px-2 py-1">{tag}</span>
                </div>
                <h3 className="text-white text-[16px] md:text-[18px] font-black uppercase tracking-tight leading-tight mb-2.5">{title}</h3>
                <p className="text-gray-300 text-[13px] md:text-[14px] leading-relaxed">{body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="text-white/40 text-[11px] md:text-[12px] font-mono uppercase tracking-[0.18em] mt-8 md:mt-10 text-center">
            Plus tenant portals, contractor permits, e-signing, app push &amp; more — switched on per site, only what you run.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// COMPARISON
// ────────────────────────────────────────────────────────────────
function CompareSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = COMPARE_ROWS.length;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive(a => (a + 1) % total), 4000);
    return () => clearInterval(t);
  }, [paused, total]);

  const row = COMPARE_ROWS[active];
  const RowIcon = row.Icon;

  return (
    <section id="compare" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-[#17110A] text-white scroll-mt-20 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 opacity-100" style={{ backgroundImage: `radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal>
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#D4AF37] mb-4">Why QSECURITY</p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-5 leading-tight">
            One system <span className="text-[#D4AF37]">vs the usual setup.</span>
          </h2>
          <p className="text-gray-300 text-[14px] md:text-[15px] leading-relaxed mb-10 md:mb-14 max-w-2xl">
            Tap any topic to see the swap. Auto-plays every 4 seconds.
          </p>
        </Reveal>

        <Reveal>
          <div className="-mx-4 md:mx-0 overflow-x-auto md:overflow-visible">
            <div className="flex md:grid md:grid-cols-8 gap-2 px-4 md:px-0 pb-1 min-w-max md:min-w-0" role="tablist" aria-label="Compare topics">
              {COMPARE_ROWS.map((r, i) => {
                const isActive = i === active;
                const TabIcon = r.Icon;
                return (
                  <button
                    key={r.label}
                    onClick={() => { setActive(i); setPaused(true); }}
                    role="tab"
                    aria-selected={isActive}
                    className={`group snap-center md:snap-none flex-shrink-0 flex flex-col items-center gap-1.5 py-3 px-3 md:px-2 border-2 transition-all duration-200 ${
                      isActive
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_0_20px_rgba(212,175,55,0.18)]'
                        : 'border-white/15 bg-white/[0.02] hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5'
                    }`}>
                    <TabIcon size={18} strokeWidth={2} className={isActive ? 'text-[#D4AF37]' : 'text-white/70 group-hover:text-[#D4AF37]'} />
                    <span className={`text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-wider whitespace-nowrap ${isActive ? 'text-[#D4AF37]' : 'text-white/70'}`}>
                      {r.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="mt-6 md:mt-8 border-2 border-[#D4AF37]/30 bg-black/40 overflow-hidden">
          <div key={active} className="qsec-compare-fade">
            <div className="flex items-center gap-3 px-5 md:px-8 py-4 md:py-5 border-b border-[#D4AF37]/20 bg-[#D4AF37]/[0.04]">
              <div className="w-9 h-9 md:w-11 md:h-11 border-2 border-[#D4AF37]/50 bg-[#D4AF37]/10 flex items-center justify-center">
                <RowIcon size={18} strokeWidth={2} className="text-[#D4AF37]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-white/50">{row.metricLabel}</p>
                <h3 className="text-white text-[16px] md:text-[20px] font-black uppercase tracking-tight leading-tight truncate">{row.label}</h3>
              </div>
              <p className="hidden sm:block font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-white/40">
                {String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-stretch">
              <div className="p-5 md:p-8 lg:p-10 flex flex-col items-center text-center bg-white/[0.02] relative">
                <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-white/40 mb-3">The usual setup</p>
                <div className="qsec-metric-them text-white/40 font-black tracking-tight leading-none text-[30px] sm:text-[40px] md:text-[54px] lg:text-[64px] break-words max-w-full mb-3 relative">
                  <span className="line-through decoration-2 decoration-red-400/70">{row.themMetric}</span>
                </div>
                <p className="text-gray-400 text-[13px] md:text-[14px] leading-snug max-w-[28ch]">{row.them}</p>
                <div className="qsec-bar-them mt-5 md:mt-6 h-1 w-full max-w-[200px] bg-white/10 overflow-hidden">
                  <div className="h-full bg-red-400/50" />
                </div>
                <p className="font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-red-300/70 mt-2">Manual · Unproven</p>
              </div>

              <div className="hidden md:flex flex-col items-center justify-center px-2 relative">
                <div aria-hidden="true" className="absolute inset-y-6 left-1/2 w-px bg-white/10" />
                <div className="relative w-12 h-12 border-2 border-[#D4AF37] bg-[#17110A] flex items-center justify-center font-mono text-[11px] font-black uppercase tracking-wider text-[#D4AF37] qsec-vs-pulse">
                  VS
                </div>
              </div>
              <div className="md:hidden flex items-center justify-center py-3 border-y border-white/5">
                <div className="px-3 py-1 border-2 border-[#D4AF37] bg-[#17110A] font-mono text-[10px] font-black uppercase tracking-wider text-[#D4AF37]">VS</div>
              </div>

              <div className="p-5 md:p-8 lg:p-10 flex flex-col items-center text-center bg-[#D4AF37]/[0.06] relative">
                <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-3">QSECURITY</p>
                <div className="qsec-metric-us text-[#D4AF37] font-black tracking-tight leading-none text-[30px] sm:text-[40px] md:text-[54px] lg:text-[64px] break-words max-w-full mb-3 drop-shadow-[0_0_18px_rgba(212,175,55,0.35)]">
                  {row.usMetric}
                </div>
                <p className="text-white text-[13px] md:text-[14px] font-medium leading-snug max-w-[28ch]">{row.us}</p>
                <div className="qsec-bar-us mt-5 md:mt-6 h-1 w-full max-w-[200px] bg-white/10 overflow-hidden">
                  <div className="h-full bg-[#D4AF37]" />
                </div>
                <p className="font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] mt-2">Verifiable · Live</p>
              </div>
            </div>

            <div className="px-5 md:px-8 py-3 md:py-4 border-t border-white/10 flex items-center gap-3">
              <button
                onClick={() => { setActive(a => (a - 1 + total) % total); setPaused(true); }}
                aria-label="Previous comparison"
                className="w-11 h-11 md:w-9 md:h-9 border border-white/30 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white/70 flex items-center justify-center transition-colors shrink-0">
                <ChevronLeft size={14} strokeWidth={2.5} />
              </button>
              <div className="flex-1 h-0.5 bg-white/10 overflow-hidden relative">
                <div
                  key={`bar-${active}-${paused ? 'p' : 'r'}`}
                  className={`h-full bg-[#D4AF37] origin-left ${paused ? '' : 'qsec-progress'}`}
                  style={{ width: paused ? `${((active + 1) / total) * 100}%` : undefined }} />
              </div>
              <button
                onClick={() => { setActive(a => (a + 1) % total); setPaused(true); }}
                aria-label="Next comparison"
                className="w-11 h-11 md:w-9 md:h-9 border border-white/30 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white/70 flex items-center justify-center transition-colors shrink-0">
                <ChevronRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        <Reveal>
          <p className="text-gray-400 text-[12px] md:text-[13px] italic text-center mt-8 md:mt-10 max-w-2xl mx-auto">
            A logbook, an access vendor, a CCTV installer and a patrol app — none of them talking to each other. That's the usual setup. QSECURITY joins it up.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// BUILT TO FIT
// ────────────────────────────────────────────────────────────────
function ModularSection() {
  return (
    <section id="modular" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-[#17110A] text-white scroll-mt-20 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 20% 50%, rgba(212,175,55,0.08) 0%, transparent 60%)' }} />
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <Reveal>
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#D4AF37] mb-4">Configured for your site</p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-5 leading-tight">
            Localised to how you run. <span className="text-[#D4AF37]">Not a template.</span>
          </h2>
          <p className="text-[#D4AF37]/90 text-[13px] md:text-[14px] font-mono italic mb-3 max-w-2xl mx-auto">
            Tired of buying a system that almost fits?
          </p>
          <p className="text-gray-300 text-[15px] md:text-[17px] leading-relaxed max-w-2xl mx-auto mb-8 md:mb-10">
            A condo guardhouse doesn't need PPE detection. A factory doesn't need resident visitor passes. We take the same access, identity and oversight engine and shape it to your site — keeping the cameras and barriers you already have where we can, and adding only what's missing. You pay for what you actually run.
          </p>
          <a href={WA_TELLUS} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 md:px-8 py-3.5 md:py-4 bg-[#D4AF37] hover:bg-white text-black text-[12px] md:text-[13px] font-black uppercase tracking-wider transition-colors">
            <MessageCircle size={14} strokeWidth={2.5} /> Tell us about your site <ArrowRight size={14} strokeWidth={2.5} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// RELIABILITY
// ────────────────────────────────────────────────────────────────
function ReliabilitySection() {
  return (
    <section id="reliability" className="py-16 md:py-32 px-4 md:px-6 border-t border-white/10 bg-[#17110A] text-white scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-[0.35em] text-[#D4AF37] mb-4">Built to be relied on</p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-10 md:mb-14 leading-tight max-w-3xl">
            The boring stuff that matters.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {RELIABILITY.map(({ Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 0.06}>
              <article className="border-2 border-white/15 bg-white/[0.02] p-6 md:p-7 h-full">
                <div className="w-11 h-11 md:w-12 md:h-12 border-2 border-[#D4AF37]/40 bg-[#D4AF37]/10 flex items-center justify-center mb-5">
                  <Icon size={20} strokeWidth={2} className="text-[#D4AF37]" />
                </div>
                <h3 className="text-white text-[16px] md:text-[18px] font-black uppercase tracking-tight leading-tight mb-2.5">{title}</h3>
                <p className="text-gray-300 text-[13px] md:text-[14px] leading-relaxed">{body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-8 md:mt-10 border border-[#D4AF37]/20 bg-[#D4AF37]/[0.03] px-5 md:px-7 py-4 md:py-5 flex items-start gap-3">
            <ShieldCheck size={18} strokeWidth={2} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
            <p className="text-gray-300 text-[12px] md:text-[13px] leading-relaxed">
              <span className="text-white font-bold">PDPA-aware by default.</span> IC and passport data, face records and signed consents are captured with consent, encrypted at rest, access-logged, and retained per policy — and can be exported or removed on request. Built for how Malaysian operators are expected to handle it.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// FINAL CTA
// ────────────────────────────────────────────────────────────────
function FinalCta() {
  return (
    <section id="demo" className="py-20 md:py-32 px-4 md:px-6 border-t border-white/10 bg-[#17110A] text-white scroll-mt-20 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-60" style={{ backgroundImage: 'radial-gradient(rgba(212,175,55,0.10) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <Reveal>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.95] mb-5">
            See it running <span className="text-[#D4AF37]">on your site.</span>
          </h2>
          <p className="text-[#D4AF37]/90 text-[13px] md:text-[14px] font-mono italic mb-3 max-w-xl mx-auto">
            Tired of demos that show someone else's building?
          </p>
          <p className="text-gray-300 text-[15px] md:text-[17px] leading-relaxed max-w-xl mx-auto mb-8 md:mb-10">
            Book a 20-minute walkthrough. We'll show QSECURITY set up for a site like yours — the registration flow, the access hardware, Sentry, the patrol app and the daily report.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
            <a href={WA_DEMO} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 md:px-10 py-4 md:py-5 bg-[#D4AF37] hover:bg-white text-black text-[13px] md:text-[15px] font-black uppercase tracking-wider transition-colors">
              <MessageCircle size={16} strokeWidth={2.5} /> Book a walkthrough <ArrowRight size={16} strokeWidth={2.5} />
            </a>
            <a href={WA_TELLUS} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 md:px-8 py-4 md:py-5 border-2 border-white/30 hover:border-white text-white text-[12px] md:text-[14px] font-bold uppercase tracking-wider transition-colors">
              Tell us about your site <ArrowRight size={14} strokeWidth={2.5} />
            </a>
          </div>
          <p className="text-white/40 text-[10px] md:text-[11px] font-mono uppercase tracking-[0.25em] mt-7">
            Publika KL · Mon–Fri · 10AM–7PM
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// STICKY MOBILE CTA
// ────────────────────────────────────────────────────────────────
function StickyMobileCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const h = () => {
      const past = window.scrollY > 600;
      const demo = document.getElementById('demo');
      const nearEnd = demo ? demo.getBoundingClientRect().top < window.innerHeight * 0.85 : false;
      setShow(past && !nearEnd);
    };
    window.addEventListener('scroll', h, { passive: true });
    h();
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${show ? 'translate-y-0' : 'translate-y-full'}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="bg-[#0D0905]/95 backdrop-blur-md border-t border-[#D4AF37]/30 px-3 py-2.5 flex items-center gap-2">
        <a href={WA_DEMO} target="_blank" rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#D4AF37] text-black text-[12px] font-black uppercase tracking-wider px-4 py-3 min-h-[44px]">
          <MessageCircle size={14} strokeWidth={2.5} /> Book a walkthrough
        </a>
        <a href={WA_TELLUS} target="_blank" rel="noopener noreferrer" aria-label="Tell us about your site"
          className="inline-flex items-center justify-center px-3 py-3 border-2 border-white/30 text-white text-[11px] font-bold uppercase tracking-wider min-w-[44px] min-h-[44px]">
          <ArrowRight size={14} strokeWidth={2.5} />
        </a>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// MAIN PAGE
// ────────────────────────────────────────────────────────────────
export default function QSecurityPage() {
  return (
    <div className="bg-[#17110A] min-h-screen text-white selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
      {/* Unlisted demo page — noindex/nofollow, not linked anywhere, blocked in robots.txt. */}
      <SEOHead
        noindex
        noTitleSuffix
        title="QSECURITY"
        description="Visitor registration, face-ID access, AI camera oversight and guard patrol — on one platform."
        url="https://qbot.now/qsecurity"
      />

      <QSecurityHeader />

      <main id="main" role="main">
        <Hero />
        <WhoSection />
        <PillarsSection />
        <PainPointsSection />
        <FlowSection />
        <SentrySection />
        <GuardSection />
        <HardwareSection />
        <VideosSection />
        <PluginsSection />
        <CompareSection />
        <ModularSection />
        <ReliabilitySection />
        <FinalCta />
      </main>

      <StickyMobileCta />
      <QSecurityFooter />

      {/* Decorative keyframes */}
      <style>{`
        @keyframes qsec-compare-fade-in {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .qsec-compare-fade { animation: qsec-compare-fade-in 0.45s cubic-bezier(0.16,1,0.3,1); }

        @keyframes qsec-metric-them-in {
          0% { opacity: 0; transform: translateX(-12px); filter: blur(2px); }
          60% { opacity: 1; transform: translateX(0); filter: blur(0); }
          100% { opacity: 0.55; transform: translateX(0); filter: blur(0); }
        }
        .qsec-metric-them { animation: qsec-metric-them-in 1.1s ease-out both; }

        @keyframes qsec-metric-us-in {
          0% { opacity: 0; transform: scale(0.85); }
          55% { opacity: 1; transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }
        .qsec-metric-us { animation: qsec-metric-us-in 0.7s cubic-bezier(0.16,1,0.3,1) both; }

        @keyframes qsec-bar-them-fill { 0% { width: 0; } 100% { width: 32%; } }
        .qsec-bar-them > div { animation: qsec-bar-them-fill 1.4s linear both; }

        @keyframes qsec-bar-us-fill { 0% { width: 0; } 70% { width: 100%; } 100% { width: 100%; } }
        .qsec-bar-us > div { animation: qsec-bar-us-fill 0.55s cubic-bezier(0.16,1,0.3,1) 0.25s both; }

        @keyframes qsec-vs-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(212,175,55,0.45); }
          50%      { transform: scale(1.08); box-shadow: 0 0 0 8px rgba(212,175,55,0); }
        }
        .qsec-vs-pulse { animation: qsec-vs-pulse 2.2s ease-in-out infinite; }

        @keyframes qsec-progress-fill { 0% { width: 0; } 100% { width: 100%; } }
        .qsec-progress { animation: qsec-progress-fill 4s linear forwards; }

        @keyframes qsec-dot-pulse {
          0%, 100% { transform: scale(1);   opacity: 1; box-shadow: 0 0 0 0 rgba(212,175,55,0.55); }
          50%      { transform: scale(1.3); opacity: 0.85; box-shadow: 0 0 0 6px rgba(212,175,55,0); }
        }
        .qsec-dot-pulse { animation: qsec-dot-pulse 1.6s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .qsec-compare-fade,
          .qsec-metric-them,
          .qsec-metric-us,
          .qsec-bar-them > div,
          .qsec-bar-us > div,
          .qsec-vs-pulse,
          .qsec-progress,
          .qsec-dot-pulse { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
