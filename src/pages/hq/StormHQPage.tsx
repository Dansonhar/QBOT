// ─────────────────────────────────────────────────────────────────────────────
// PROJECT STORM HQ — QBot Global Command Center  (/hq/storm)
//
// INTERNAL ONLY. Shared-password gated, noindex/nofollow, blocked in robots.txt.
// This is a LIVE COMMAND CENTER, not a report. Every widget answers ONE question:
// ARE WE GROWING? If it doesn't help raise Revenue / MRR / Customers / Retention /
// Partners, it does not belong here.
//
// HOW TO UPDATE THE NUMBERS:
//   Everything the dashboard shows is derived from the single STORM object below.
//   Edit those numbers (or later wire fetchStormData() to Supabase) and the whole
//   command center updates. Auto-refreshes every 60s.
// ─────────────────────────────────────────────────────────────────────────────
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, ArrowRight, Award, Building2, CalendarCheck, CalendarClock, CheckCircle2,
  Circle, Crown, Download, Factory, Flag, Gauge, Handshake, Image as ImageIcon, Link2, Lock, type LucideIcon,
  Maximize2, Minimize2, Moon, Paperclip, Pencil, Plus, Radio, RefreshCw, RotateCcw, Rocket, ShieldCheck, Sparkles, Sun, Target,
  Trash2, TrendingUp, Trophy, Upload, UserCircle2, Users, X, Youtube, Zap,
} from 'lucide-react';
import SEOHead from '../../components/SEOHead';

// ── Theme (Japanese Executive War Room) ─────────────────────────────────────
// All colors are CSS variables (defined per-theme in index.css), so the whole
// command center switches between Light (default) and Dark. Accents stay vibrant
// on dark and deepen for readability on light.
const BG = 'var(--s-bg)';
const PANEL = 'var(--s-panel)';
const LINE = 'var(--s-line)';
const ORANGE = 'var(--s-orange)';
const BLUE = 'var(--s-blue)';
const GREEN = 'var(--s-green)';
const AMBER = 'var(--s-amber)';
const RED = 'var(--s-red)';

const THEME_KEY = 'storm_theme';
type Theme = 'light' | 'dark';

/** Apply an alpha to a color that may be a hex (#RRGGBB) OR a CSS var. */
function wa(c: string | undefined, hh: string): string {
  if (!c) return 'transparent';
  const a = parseInt(hh, 16) / 255;
  if (c.startsWith('var(') || c.startsWith('color-mix')) {
    return `color-mix(in srgb, ${c} ${(a * 100).toFixed(1)}%, transparent)`;
  }
  const n = c.replace('#', '');
  const r = parseInt(n.slice(0, 2), 16), g = parseInt(n.slice(2, 4), 16), b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

const PASSWORD = 'Stormtest!';
const SESSION_KEY = 'storm_hq_unlocked';
const REFRESH_MS = 60_000;
const TV_CYCLE_MS = 14_000;

// ── Status logic ────────────────────────────────────────────────────────────
type Status = 'green' | 'orange' | 'red';
const STATUS_COLOR: Record<Status, string> = { green: GREEN, orange: AMBER, red: RED };
const STATUS_LABEL: Record<Status, string> = { green: 'On Track', orange: 'Warning', red: 'Behind' };

/** On-track ≥80%, warning ≥50%, behind below. Pass lowerIsBetter for churn-style metrics. */
function statusOf(pct: number): Status {
  if (pct >= 80) return 'green';
  if (pct >= 50) return 'orange';
  return 'red';
}
function healthStatus(score: number): Status {
  if (score >= 75) return 'green';
  if (score >= 50) return 'orange';
  return 'red';
}

const clampPct = (v: number) => Math.max(0, Math.min(100, v));
const pctOf = (cur: number, target: number) => (target <= 0 ? 100 : (cur / target) * 100);
const fmtNum = (n: number) => n.toLocaleString('en-MY');
const fmtRM = (n: number) => `RM${n.toLocaleString('en-MY')}`;

/** Whole days from now until the end of the given ISO date (live, recomputed each render). */
function daysUntil(iso: string): number {
  const end = new Date(`${iso}T23:59:59`).getTime();
  return Math.max(0, Math.ceil((end - new Date().getTime()) / 86_400_000));
}

/** Progress % for a metric's bar (handles lower-is-better, e.g. resolution time). */
function metricPct(m: Metric): number {
  if (m.lowerBetter) return m.current <= 0 ? 100 : clampPct((m.target / m.current) * 100);
  return clampPct(pctOf(m.current, m.target));
}
function metricStatus(m: Metric): Status {
  if (m.lowerBetter) {
    if (m.current <= m.target) return 'green';
    return m.current <= m.target * 1.5 ? 'orange' : 'red';
  }
  return statusOf(pctOf(m.current, m.target));
}
/** Achievement % is the average of a person's KPI progress — outcomes, not effort. */
function personAchievement(p: Person): number {
  if (!p.metrics.length) return 0;
  return Math.round(p.metrics.reduce((a, m) => a + metricPct(m), 0) / p.metrics.length);
}

// ─────────────────────────────────────────────────────────────────────────────
// THE SINGLE SOURCE OF TRUTH — edit these numbers to drive the whole command center
// ─────────────────────────────────────────────────────────────────────────────
type ProofKind = 'link' | 'youtube' | 'image';
type ProofEntry = { kind: ProofKind; value: string; label?: string; at: string };
type Metric = {
  label: string;
  current: number;
  target: number;
  money?: boolean;
  lowerBetter?: boolean;
  unit?: string;             // e.g. 'h', '%'
  proof?: string;            // proof artifact required — "no proof, it doesn't exist"
  tasks?: string[];          // each KPI breaks down into daily tasks staff check off
  proofs?: ProofEntry[];     // logged evidence — links / youtube / images
};
type Person = {
  name: string;
  responsibilities: string[];
  streak: number;            // weeks hitting target
  bestMonth: string;
  metrics: Metric[];         // achievement % is derived from these (see personAchievement)
  standup: { yesterday: string; today: string; blocked: string | null };
};
type SpecialProject = { name: string; focus: string[]; objective: string; status: string };

// Default seed for the command center. The live data is an editable copy of this
// (persisted to localStorage), so it must stay JSON-serializable — no functions/
// icons in here. Presentation icons live in the static lookups below.
const DEFAULT_STORM = {
  // Headline mission — hard deadline. THE number the war room is built around.
  deadline: {
    metric: 'Accounts',
    current: 12,
    target: 50,
    dateISO: '2026-12-31',
    dateLabel: '31 Dec 2026',
  },

  northStar: [
    { label: 'Active Locations', current: 0, target: 100, money: false },
    { label: 'Monthly Recurring Revenue', current: 32_500, target: 100_000, money: true },
    { label: 'Partners', current: 0, target: 20, money: false },
  ],

  // Company Health — the 5 things Project Storm measures, 20% weight each.
  // We measure outcomes, not effort: Assets · Opportunities · Revenue · Success · Leverage.
  health: [
    { label: 'Assets Created', score: 0 },
    { label: 'Opportunities Created', score: 0 },
    { label: 'Revenue Growth', score: 0 },
    { label: 'Customer Success', score: 0 },
    { label: 'Business Leverage', score: 0 },
  ],

  // Page 2 — Live Company Scoreboard (weekly)
  scoreboard: [
    { label: 'Leads', current: 0, target: 500 },
    { label: 'Demos', current: 0, target: 40 },
    { label: 'Proposals', current: 0, target: 20 },
    { label: 'Closed Deals', current: 0, target: 10 },
    { label: 'Deployments', current: 0, target: 10 },
    { label: 'Partners', current: 0, target: 20 },
    { label: 'MRR Added', current: 8_200, target: 20_000, money: true },
    { label: 'Customer Churn', current: 0, target: 0, lowerBetter: true },
    { label: 'Testimonials', current: 0, target: 5 },
  ] as Metric[],

  // Page 3 — Revenue Factory
  revenueFunnel: [
    { label: 'Leads', value: 100 },
    { label: 'Meetings', value: 20 },
    { label: 'Demos', value: 10 },
    { label: 'Proposals', value: 5 },
    { label: 'Customers', value: 2 },
  ],

  factories: {
    revenue: {
      title: 'Sales Factory', mission: 'Generate Opportunities, Revenue & Partnerships',
      people: [
        {
          name: 'Sean', streak: 4, bestMonth: 'March',
          responsibilities: ['Sales presentations', 'Strategic partnerships', 'Enterprise opportunities', 'Industry relationships', 'Market expansion'],
          metrics: [
            { label: 'Demo Conducted', current: 0, target: 10, proof: 'Meeting record', tasks: ['Confirm demo bookings + prep deck', 'Run the live demo', 'Send recap + next step within 1 hour'] },
            { label: 'Partner Meetings', current: 0, target: 1, proof: 'Meeting record', tasks: ['Shortlist a partner to meet', 'Hold the partner meeting', 'Agree next step + log it'] },
            { label: 'Deck Update (marketing, pricing etc)', current: 0, target: 1, proof: 'Live URL', tasks: ['Collect latest marketing/pricing changes', 'Update the deck', 'Publish + share with team'] },
          ],
          standup: { yesterday: 'OWG demo + pricing deck refreshed', today: '2 demos booked', blocked: null },
        },
        {
          name: 'Roy', streak: 2, bestMonth: 'February',
          responsibilities: ['Lead generation', 'Meeting generation', 'Follow-ups', 'Government outreach', 'Sales visits'],
          metrics: [
            { label: 'Leads Contacted', current: 0, target: 50, proof: 'Meeting record', tasks: ['Pull today’s lead list (~10/day)', 'Contact the leads (call / WA / email)', 'Log every contact in CRM'] },
            { label: 'Qualified Meetings Booked', current: 0, target: 20, proof: 'Meeting record', tasks: ['Qualify warm leads for fit', 'Pitch a meeting + propose a slot', 'Confirm + calendar the meeting'] },
            { label: 'Government Contact', current: 0, target: 1, proof: 'Customer name', tasks: ['Identify a government / agency target', 'Find the right person', 'Open the conversation'] },
            { label: 'Sales Visit', current: 0, target: 10, proof: 'Meeting record', tasks: ['Plan today’s visit route', 'Run the on-site sales visit', 'Log outcome + next step'] },
          ],
          standup: { yesterday: '11 leads contacted + 2 visits', today: 'Book 4 qualified meetings', blocked: 'Waiting on CRM access' },
        },
        {
          name: 'Jinn', streak: 3, bestMonth: 'March',
          responsibilities: ['Build trust', 'Build authority', 'Create sales content', 'Run paid ads'],
          metrics: [
            { label: 'Founder Video', current: 0, target: 1, proof: 'Published content', tasks: ['Script the founder video angle', 'Record with founder', 'Edit + publish'] },
            { label: 'Product Video', current: 0, target: 3, proof: 'Published content', tasks: ['Pick the product feature to show', 'Record + edit the clip', 'Publish + hand to sales'] },
            { label: 'Customer / Success Highlight', current: 0, target: 1, proof: 'Published content', tasks: ['Pick a winning customer', 'Capture the highlight (quote / result)', 'Publish the highlight'] },
            { label: 'Meta Ads / TikTok Ads Launch', current: 0, target: 1, proof: 'Live URL', tasks: ['Prepare ad creative + copy', 'Set up the campaign', 'Launch + confirm it’s live'] },
          ],
          standup: { yesterday: '1 product video published', today: 'Launch a Meta ad set', blocked: null },
        },
      ] as Person[],
    },
    product: {
      title: 'Development Factory', mission: 'Build Products That Customers Want',
      status: [
        { label: 'Current Sprint', value: 'Sprint 14' },
        { label: 'Completed Features', value: '9' },
        { label: 'Upcoming Features', value: '6' },
        { label: 'Critical Bugs', value: '1' },
        { label: 'Open Issues', value: '12' },
        { label: 'Deployment Readiness', value: '88%' },
      ],
      people: [
        {
          name: 'Elon', streak: 5, bestMonth: 'March',
          responsibilities: ['Core product development', 'Revenue features', 'Product stability'],
          metrics: [
            { label: 'Customer Requested Features Released', current: 0, target: 2, proof: 'Deployment screenshot', tasks: ['Pick top customer-requested feature', 'Build + test it', 'Deploy + screenshot proof'] },
            { label: 'Bugs / Critical Fixed', current: 0, target: 5, proof: 'Deployment screenshot', tasks: ['Triage the bug queue', 'Fix critical bugs', 'Verify in production'] },
            { label: 'New Features Launch', current: 0, target: 1, proof: 'Live URL', tasks: ['Finalize the feature scope', 'Build + QA', 'Launch + announce'] },
          ],
          standup: { yesterday: 'Payments webhook hardened', today: 'Ship multi-location sync', blocked: null },
        },
        {
          name: 'Shazwin', streak: 2, bestMonth: 'February',
          responsibilities: ['Frontend', 'User experience', 'Demo improvements'],
          metrics: [
            { label: 'Customer Requested Features Released', current: 0, target: 2, proof: 'Deployment screenshot', tasks: ['Pick top UI request', 'Build + test it', 'Deploy + screenshot proof'] },
            { label: 'Bugs / Critical Fixed', current: 0, target: 5, proof: 'Deployment screenshot', tasks: ['Triage frontend bug queue', 'Fix the worst ones', 'Verify across devices'] },
            { label: 'New Features Launch', current: 0, target: 1, proof: 'Live URL', tasks: ['Finalize the UI feature scope', 'Build + QA', 'Launch + announce'] },
          ],
          standup: { yesterday: 'Kiosk demo flow polished', today: 'Dashboard responsive pass', blocked: null },
        },
        {
          name: 'Izzul', streak: 3, bestMonth: 'March',
          responsibilities: ['Martech systems', 'Sales technology', 'Internal automation'],
          metrics: [
            { label: 'Automation Features Released', current: 0, target: 2, proof: 'Live URL', tasks: ['Pick a manual step to automate', 'Build the automation', 'Ship + verify'] },
            { label: 'Internal Sales / Martech Channel Opportunities', current: 0, target: 2, proof: 'Deployment screenshot', tasks: ['Scan for a martech / sales channel gap', 'Build / deploy the improvement', 'Measure impact'] },
          ],
          standup: { yesterday: 'Quote tool automation shipped', today: 'Wire CRM automation', blocked: null },
        },
      ] as Person[],
    },
    success: {
      title: 'Deployment Factory', mission: 'Keep Customers Happy, Active & Growing',
      metrics: [
        { label: 'Active Customers', current: 0, target: 12 },
        { label: 'Customer Health', current: 0, target: 100, unit: '%' },
        { label: 'Upsells', current: 0, target: 5 },
        { label: 'Renewals', current: 0, target: 4 },
        { label: 'Testimonials', current: 0, target: 5 },
        { label: 'Churn', current: 0, target: 0, lowerBetter: true },
      ] as Metric[],
      people: [
        {
          name: 'Cetana', streak: 4, bestMonth: 'March',
          responsibilities: ['Customer success', 'Project deployment', 'Customer training', 'Retention'],
          metrics: [
            { label: 'Contact Current Customer / Identify Opportunities', current: 0, target: 10, proof: 'Meeting record', tasks: ['List customers to contact today (~2/day)', 'Reach out + check in', 'Log any upsell / renewal opportunity'] },
            { label: 'Project Deployment + Customer Training', current: 0, target: 2, proof: 'Training record', tasks: ['Prep the deployment / training plan', 'Run deployment + train staff', 'Confirm customer is live + happy'] },
            { label: 'Follow Up Non-Confirm Customers (from Roy)', current: 0, target: 30, proof: 'Meeting record', tasks: ['Pull Roy’s non-confirmed list', 'Follow up (~6/day)', 'Update status + next step'] },
            { label: 'Support Ticket Resolved', current: 0, target: 10, proof: 'Support log', tasks: ['Triage the ticket queue', 'Resolve tickets (~2/day)', 'Confirm the fix with customer'] },
          ],
          standup: { yesterday: '6 customers contacted + 1 deployment', today: 'Follow up Roy’s non-confirmed list', blocked: null },
        },
        {
          name: 'Danson', streak: 3, bestMonth: 'February',
          responsibilities: ['Internal support systems', 'Documentation', 'Knowledge management', 'Partner support'],
          metrics: [
            { label: 'Internal Support System Upgrade', current: 0, target: 2, proof: 'Live URL', tasks: ['Spot a support gap', 'Build / upgrade the system', 'Roll it out + document'] },
            { label: 'Knowledge Base Update', current: 0, target: 5, proof: 'Published content', tasks: ['Pick a common question / topic', 'Write / update the KB article', 'Publish it'] },
            { label: 'Partner Material', current: 0, target: 2, proof: 'Published content', tasks: ['Get the partner material brief', 'Produce the material', 'Hand it over + log'] },
          ],
          standup: { yesterday: '2 KB articles updated', today: 'Upgrade ticket routing', blocked: null },
        },
      ] as Person[],
    },
  },

  // Special Projects — focus areas + objective, not weekly numeric KPIs.
  specialProjects: [
    {
      name: 'Nabilah',
      focus: ['Partner Materials', 'Sales Materials', 'Landing Page Materials'],
      objective: 'Support sales conversion and partner recruitment.',
      status: 'Active',
    },
    {
      name: 'Fitri',
      focus: ['QParking', 'AI Genius', 'Studio Entry'],
      objective: 'Complete current initiatives and ensure proper handover before transition.',
      status: 'Transitioning',
    },
  ] as SpecialProject[],

  // Page 6 — Growth Factory
  growth: {
    mission: 'Create Growth Without Founder',
    metrics: [
      { label: 'Partner Leads', current: 0, target: 20 },
      { label: 'Referral Leads', current: 0, target: 25 },
      { label: 'Case Studies', current: 0, target: 6 },
      { label: 'Strategic Partnerships', current: 0, target: 5 },
      { label: 'Industry Relationships', current: 0, target: 15 },
    ] as Metric[],
  },

  // Page 9 — Customer Wall
  customers: {
    groups: [
      { label: 'Active Customers', tone: GREEN, names: ['OWG Fitness', 'FitZone KL', 'PowerHouse JB', 'StudioFlow', 'IronWorks', 'PulseGym', 'CoreLab', 'ZenYoga', 'FlexFit', 'AthletiX', 'MoveStudio', 'GritGym'] },
      { label: 'Partners', tone: ORANGE, names: ['Tech4Biz', 'GymPro Supply', 'KaratePOS', 'WellnessHub'] },
      { label: 'Prospects', tone: BLUE, names: ['BoxNation', 'YogaTribe', 'SpinCity', 'RecoverLab', 'PeakPilates', 'TitanFitness', 'AquaClub', 'CrossEdge'] },
      { label: 'Future Pipeline', tone: 'var(--s-t50)', names: ['Tokyo Wellness', 'SG ActiveLife', 'Bangkok Flex', 'Bali Movement'] },
    ],
    countries: [
      { country: 'Malaysia', count: 11 },
      { country: 'Singapore', count: 1 },
      { country: 'Japan', count: 0 },
      { country: 'Thailand', count: 0 },
      { country: 'Indonesia', count: 0 },
    ],
  },

  // Page 11 — Partner Hub
  partnerTiers: [
    { name: 'Silver', color: '#C0C0C0', customers: 3, retention: '3 Month', commission: '10%' },
    { name: 'Gold', color: '#FFD24A', customers: 10, retention: '6 Month', commission: '20%' },
    { name: 'Platinum', color: BLUE, customers: 25, retention: '12 Month', commission: '30%' },
  ],
  partners: [] as { name: string; tier: string; customers: number; mrrManaged: number; revenue: number; commission: number }[],
};

type StormData = typeof DEFAULT_STORM;
type FactoryKey = 'revenue' | 'product' | 'success';

// Presentation icons kept out of the editable data so the data stays JSON-safe.
const NORTHSTAR_ICONS: LucideIcon[] = [Building2, TrendingUp, Handshake];
const FACTORY_ICON: Record<FactoryKey, LucideIcon> = { revenue: TrendingUp, product: Factory, success: Award };

// ── Editable store (persisted to localStorage) ───────────────────────────────
const DATA_KEY = 'storm_data_v4';
const ME_KEY = 'storm_me';
const DONE_KEY = 'storm_taskdone_v1';
const CREDIT_KEY = 'storm_kpi_credit_v1'; // which (day|person|kpi) already counted +1 toward the KPI

const cloneStorm = (d: StormData): StormData => JSON.parse(JSON.stringify(d)) as StormData;

function loadStormData(): StormData {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (raw) return JSON.parse(raw) as StormData;
  } catch { /* fall through to defaults */ }
  return cloneStorm(DEFAULT_STORM);
}
function saveStormData(d: StormData) {
  try { localStorage.setItem(DATA_KEY, JSON.stringify(d)); } catch { /* quota — noop */ }
}

type StormCtx = {
  data: StormData;
  editing: boolean;
  setEditing: (b: boolean) => void;
  mutate: (recipe: (draft: StormData) => void) => void;
  replaceAll: (d: StormData) => void;
  reset: () => void;
};
const StormContext = createContext<StormCtx | null>(null);
function useStorm(): StormCtx {
  const c = useContext(StormContext);
  if (!c) throw new Error('useStorm must be used inside StormProvider');
  return c;
}

// ── Derived (all take the live data) ─────────────────────────────────────────
function companyHealth(d: StormData): number {
  const s = d.health.reduce((a, p) => a + p.score, 0) / d.health.length;
  return Math.round(s);
}
function allPeople(d: StormData): Person[] {
  return [...d.factories.revenue.people, ...d.factories.product.people, ...d.factories.success.people];
}
function computeBadges(d: StormData): { icon: string; label: string; unlocked: boolean }[] {
  return [
    { icon: '🏆', label: 'First Account', unlocked: d.deadline.current >= 1 },
    { icon: '🏆', label: '10 Accounts', unlocked: d.deadline.current >= 10 },
    { icon: '🏆', label: '25 Accounts', unlocked: d.deadline.current >= 25 },
    { icon: '🏆', label: '50 Accounts', unlocked: d.deadline.current >= 50 },
    { icon: '🏆', label: 'First Partner', unlocked: d.northStar[2].current >= 1 },
    { icon: '🏆', label: '10 Partners', unlocked: d.northStar[2].current >= 10 },
    { icon: '🏆', label: '20 Partners', unlocked: d.northStar[2].current >= 20 },
    { icon: '🏆', label: 'RM10K MRR', unlocked: d.northStar[1].current >= 10_000 },
    { icon: '🏆', label: 'RM50K MRR', unlocked: d.northStar[1].current >= 50_000 },
    { icon: '🏆', label: 'RM100K MRR', unlocked: d.northStar[1].current >= 100_000 },
    { icon: '🏆', label: 'First Location', unlocked: d.northStar[0].current >= 1 },
    { icon: '🏆', label: '100 Locations', unlocked: d.northStar[0].current >= 100 },
  ];
}

// ── Daily-task completion (per day, per person, per task) ─────────────────────
const pad2 = (n: number) => String(n).padStart(2, '0');
function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
type DoneMap = Record<string, boolean>; // key: `${date}|${person}|${kpiLabel}|${taskIndex}`
function loadDone(): DoneMap {
  try { const raw = localStorage.getItem(DONE_KEY); return raw ? (JSON.parse(raw) as DoneMap) : {}; } catch { return {}; }
}
function saveDone(m: DoneMap) {
  try { localStorage.setItem(DONE_KEY, JSON.stringify(m)); } catch { /* noop */ }
}
const doneKey = (person: string, kpi: string, ti: number, date = todayKey()) => `${date}|${person}|${kpi}|${ti}`;

// Credit ledger — records which (day|person|kpi) already added +1 to the KPI's
// current, so completing/uncompleting a day's tasks adjusts the KPI exactly once.
type CreditMap = Record<string, boolean>;
const creditKey = (person: string, kpi: string, date = todayKey()) => `${date}|${person}|${kpi}`;
function loadCredit(): CreditMap {
  try { const raw = localStorage.getItem(CREDIT_KEY); return raw ? (JSON.parse(raw) as CreditMap) : {}; } catch { return {}; }
}
function saveCredit(m: CreditMap) {
  try { localStorage.setItem(CREDIT_KEY, JSON.stringify(m)); } catch { /* noop */ }
}

// ── Proof helpers ────────────────────────────────────────────────────────────
function ytId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
  return m ? m[1] : null;
}
function detectProofKind(url: string): ProofKind {
  if (ytId(url)) return 'youtube';
  if (/\.(png|jpe?g|gif|webp|svg|avif)(\?|#|$)/i.test(url)) return 'image';
  return 'link';
}
/** Read an image file and downscale to a small JPEG data URL so it fits in localStorage. */
function downscaleImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read failed'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('decode failed'));
      img.onload = () => {
        const max = 640;
        let { width, height } = img;
        if (width > max || height > max) {
          const r = Math.min(max / width, max / height);
          width = Math.round(width * r); height = Math.round(height * r);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(String(reader.result)); return; }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED UI
// ─────────────────────────────────────────────────────────────────────────────
function Mono({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <span className={`font-mono uppercase tracking-[0.2em] ${className}`} style={style}>{children}</span>;
}

function ProgressBar({ pct, color, height = 'h-3' }: { pct: number; color: string; height?: string }) {
  return (
    <div className={`w-full ${height} rounded-full overflow-hidden`} style={{ backgroundColor: 'var(--s-track)' }}>
      <div
        className={`${height} rounded-full transition-[width] duration-1000 ease-out`}
        style={{ width: `${clampPct(pct)}%`, background: `linear-gradient(90deg, ${color}, ${wa(color, 'cc')})`, boxShadow: `0 0 18px ${wa(color, '66')}` }}
      />
    </div>
  );
}

function Panel({ children, className = '', accent }: { children: React.ReactNode; className?: string; accent?: string }) {
  return (
    <div
      className={`rounded-xl border p-5 ${className}`}
      style={{ backgroundColor: PANEL, borderColor: accent ? `${wa(accent, '40')}` : LINE }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ icon: Icon, kicker, title, mission }: { icon: LucideIcon; kicker?: string; title: string; mission?: string }) {
  return (
    <div className="mb-6">
      {kicker && <Mono className="text-[10px] block mb-2" style={{ color: ORANGE }}>{kicker}</Mono>}
      <div className="flex items-center gap-3">
        <Icon size={26} style={{ color: ORANGE }} strokeWidth={2} />
        <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white">{title}</h2>
      </div>
      {mission && <p className="mt-2 text-sm md:text-base" style={{ color: BLUE }}>{mission}</p>}
    </div>
  );
}

// Small dark inputs used throughout edit mode.
const editInputCls = 'bg-black/50 border rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-white/50';
function EditField({ value, onChange, placeholder, type = 'text', className = '' }: { value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string; className?: string }) {
  return (
    <input
      type={type} value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${editInputCls} ${className}`} style={{ borderColor: LINE }}
    />
  );
}

/** Metric row: read-only shows status bar + proof; edit shows full KPI editor incl. 3 daily tasks. */
function MetricRow({ m, edit, onPatch, onRemove }: { m: Metric; edit?: boolean; onPatch?: (patch: Partial<Metric>) => void; onRemove?: () => void }) {
  const pct = metricPct(m);
  const color = STATUS_COLOR[metricStatus(m)];

  if (edit && onPatch) {
    const tasks = m.tasks ?? [];
    const setTask = (i: number, v: string) => { const next = [...tasks]; next[i] = v; onPatch({ tasks: next }); };
    return (
      <div className="py-3 border-b last:border-b-0 space-y-2" style={{ borderColor: LINE }}>
        <div className="flex items-center gap-2">
          <EditField value={m.label} onChange={(v) => onPatch({ label: v })} placeholder="KPI name" className="flex-1 font-semibold" />
          <button onClick={onRemove} title="Remove KPI" className="p-1.5 rounded hover:bg-white/5" style={{ border: `1px solid ${wa(RED, '44')}` }}>
            <Trash2 size={13} style={{ color: RED }} />
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-1"><Mono className="text-[8px] text-white/40">Now</Mono>
            <EditField type="number" value={m.current} onChange={(v) => onPatch({ current: Number(v) || 0 })} className="w-16" /></label>
          <label className="flex items-center gap-1"><Mono className="text-[8px] text-white/40">Target</Mono>
            <EditField type="number" value={m.target} onChange={(v) => onPatch({ target: Number(v) || 0 })} className="w-16" /></label>
          <label className="flex items-center gap-1"><Mono className="text-[8px] text-white/40">Unit</Mono>
            <EditField value={m.unit ?? ''} onChange={(v) => onPatch({ unit: v || undefined })} placeholder="%/h" className="w-12" /></label>
          <EditField value={m.proof ?? ''} onChange={(v) => onPatch({ proof: v || undefined })} placeholder="Proof type" className="flex-1 min-w-[120px]" />
          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold" style={{ backgroundColor: `${wa(color, '1a')}`, color }}>{Math.round(pct)}%</span>
        </div>
        <div className="pl-2 border-l-2 space-y-1.5" style={{ borderColor: `${wa(ORANGE, '55')}` }}>
          <Mono className="text-[8px]" style={{ color: ORANGE }}>3 Daily Tasks</Mono>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-white/30 w-3">{i + 1}</span>
              <EditField value={tasks[i] ?? ''} onChange={(v) => setTask(i, v)} placeholder={`Daily task ${i + 1}`} className="flex-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const cur = m.money ? fmtRM(m.current) : `${fmtNum(m.current)}${m.unit ?? ''}`;
  const tgt = m.money ? fmtRM(m.target) : `${fmtNum(m.target)}${m.unit ?? ''}`;
  return (
    <div className="py-3 border-b last:border-b-0" style={{ borderColor: LINE }}>
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <span className="text-sm md:text-base font-semibold text-white">{m.label}</span>
        <span className="text-sm md:text-base font-mono whitespace-nowrap">
          <span className="font-bold" style={{ color }}>{cur}</span>
          <span className="text-white/35"> / {tgt}</span>
        </span>
      </div>
      <ProgressBar pct={pct} color={color} height="h-2" />
      {m.proof && (
        <Mono className="text-[7px] text-white/30 block mt-1.5 !tracking-[0.14em]">Proof · {m.proof}</Mono>
      )}
      {onPatch && <ProofSection m={m} onPatch={onPatch} />}
    </div>
  );
}

/** Log + display evidence (link / YouTube / image) on a KPI. Stored in the shared data. */
function ProofSection({ m, onPatch }: { m: Metric; onPatch: (patch: Partial<Metric>) => void }) {
  const proofs = m.proofs ?? [];
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const add = (entry: ProofEntry) => onPatch({ proofs: [...proofs, entry] });
  const removeAt = (i: number) => onPatch({ proofs: proofs.filter((_, idx) => idx !== i) });
  const addUrl = () => {
    const u = url.trim();
    if (!u) return;
    add({ kind: detectProofKind(u), value: u, at: todayKey() });
    setUrl('');
  };
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try { add({ kind: 'image', value: await downscaleImage(f), label: f.name, at: todayKey() }); }
    catch { window.alert('Could not read that image.'); }
    e.target.value = '';
  };

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 flex-wrap">
        {proofs.length > 0 && (
          <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold" style={{ color: GREEN }}>
            <CheckCircle2 size={11} /> {proofs.length} proof{proofs.length > 1 ? 's' : ''} logged
          </span>
        )}
        <button onClick={() => setOpen((o) => !o)} className="inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded hover:bg-white/5" style={{ border: `1px solid ${LINE}`, color: BLUE }}>
          <Paperclip size={10} /> {open ? 'Close' : 'Add Proof'}
        </button>
      </div>

      {proofs.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {proofs.map((pr, i) => <ProofChip key={i} pr={pr} onRemove={() => removeAt(i)} />)}
        </div>
      )}

      {open && (
        <div className="mt-2 p-2 rounded-lg flex flex-wrap items-center gap-2" style={{ backgroundColor: 'var(--s-surface)', border: `1px solid ${LINE}` }}>
          <input
            value={url} onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') addUrl(); }}
            placeholder="Paste a link or YouTube URL…"
            className="flex-1 min-w-[160px] bg-black/30 border rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-white/40"
            style={{ borderColor: LINE }}
          />
          <button onClick={addUrl} className="text-[10px] font-bold px-2.5 py-1.5 rounded hover:opacity-90" style={{ backgroundColor: BLUE, color: '#fff' }}>Add</button>
          <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded hover:bg-white/5" style={{ border: `1px solid ${LINE}`, color: 'var(--s-text)' }}>
            <ImageIcon size={12} /> Image
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
        </div>
      )}
    </div>
  );
}

function ProofChip({ pr, onRemove }: { pr: ProofEntry; onRemove: () => void }) {
  const isImg = pr.kind === 'image';
  const yt = pr.kind === 'youtube' ? ytId(pr.value) : null;
  const thumb = isImg ? pr.value : yt ? `https://img.youtube.com/vi/${yt}/default.jpg` : null;
  const Icon = pr.kind === 'youtube' ? Youtube : pr.kind === 'image' ? ImageIcon : Link2;
  return (
    <span className="group inline-flex items-center gap-1.5 pl-1 pr-1.5 py-1 rounded-lg text-[10px]" style={{ backgroundColor: 'var(--s-surface)', border: `1px solid ${wa(GREEN, '44')}` }}>
      <a href={pr.value} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 max-w-[150px]">
        {thumb
          ? <img src={thumb} alt="" className="w-7 h-7 rounded object-cover shrink-0" />
          : <span className="w-7 h-7 rounded flex items-center justify-center shrink-0" style={{ backgroundColor: wa(BLUE, '1a') }}><Icon size={13} style={{ color: BLUE }} /></span>}
        <span className="truncate text-white/80">{pr.label || (pr.kind === 'youtube' ? 'YouTube' : pr.kind === 'image' ? 'Image' : pr.value.replace(/^https?:\/\//, ''))}</span>
      </a>
      <button onClick={onRemove} title="Remove proof" className="opacity-50 hover:opacity-100"><X size={11} style={{ color: RED }} /></button>
    </span>
  );
}

/**
 * Editable list of KPIs. `onMutate(fn)` receives the underlying array so callers
 * only need to point at where the list lives in the data tree.
 */
function MetricList({ list, onMutate }: { list: Metric[]; onMutate: (fn: (arr: Metric[]) => void) => void }) {
  const { editing } = useStorm();
  return (
    <div className="space-y-1">
      {list.map((m, i) => (
        <MetricRow
          key={i} m={m} edit={editing}
          onPatch={(patch) => onMutate((arr) => { Object.assign(arr[i], patch); })}
          onRemove={() => onMutate((arr) => { arr.splice(i, 1); })}
        />
      ))}
      {editing && (
        <button
          onClick={() => onMutate((arr) => { arr.push({ label: 'New KPI', current: 0, target: 1, proof: '', tasks: ['', '', ''] }); })}
          className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-colors hover:bg-white/5"
          style={{ border: `1px dashed ${wa(ORANGE, '66')}`, color: ORANGE }}
        >
          <Plus size={13} /> Add KPI
        </button>
      )}
    </div>
  );
}

function AchievementRing({ pct, size = 92 }: { pct: number; size?: number }) {
  const status = statusOf(pct);
  const color = STATUS_COLOR[status];
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (clampPct(pct) / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--s-track)" strokeWidth={8} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`} style={{ transition: 'stroke-dasharray 1s ease-out', filter: `drop-shadow(0 0 6px ${wa(color, '99')})` }}
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className="rotate-90" style={{ transformOrigin: 'center', fill: 'var(--s-text)', fontSize: 20, fontWeight: 800 }}>
        {Math.round(pct)}%
      </text>
    </svg>
  );
}

function PersonCard({ p, factory, idx }: { p: Person; factory: FactoryKey; idx: number }) {
  const { mutate } = useStorm();
  const ach = personAchievement(p);
  const color = STATUS_COLOR[statusOf(ach)];
  return (
    <Panel accent={color} className="flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xl font-black text-white tracking-tight">{p.name}</h3>
          <Mono className="text-[9px]" style={{ color: BLUE }}>Achievement {STATUS_LABEL[statusOf(ach)]}</Mono>
        </div>
        <AchievementRing pct={ach} />
      </div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {p.responsibilities.map((r) => (
          <span key={r} className="px-2 py-0.5 rounded text-[9px] font-medium text-white/60" style={{ backgroundColor: 'var(--s-surface)', border: `1px solid ${LINE}` }}>{r}</span>
        ))}
      </div>
      <MetricList
        list={p.metrics}
        onMutate={(fn) => mutate((d) => fn(d.factories[factory].people[idx].metrics))}
      />
    </Panel>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTIONS (Pages 1–12)
// ─────────────────────────────────────────────────────────────────────────────
function MissionDeadline() {
  const { data: STORM, editing, mutate } = useStorm();
  const g = STORM.deadline;
  const days = daysUntil(g.dateISO);
  const weeks = Math.max(1, Math.round(days / 7));
  const needed = Math.max(0, g.target - g.current);
  const perWeek = needed / weeks;
  const pct = pctOf(g.current, g.target);
  const color = STATUS_COLOR[statusOf(pct)];
  return (
    <div
      className="rounded-xl border-2 p-6 md:p-7 relative overflow-hidden"
      style={{ borderColor: `${wa(ORANGE, '66')}`, background: `linear-gradient(135deg, ${wa(ORANGE, '14')}, ${PANEL} 60%)` }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        {/* The goal */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Flag size={16} style={{ color: ORANGE }} />
            <Mono className="text-[10px]" style={{ color: ORANGE }}>Mission Deadline</Mono>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-none">
            {g.target} Accounts <span className="block md:inline text-white/40 font-bold text-xl md:text-2xl">by {g.dateLabel}</span>
          </h2>
          <div className="flex items-end gap-3 mt-5 mb-3">
            {editing ? (
              <>
                <EditField type="number" value={g.current} onChange={(v) => mutate((d) => { d.deadline.current = Number(v) || 0; })} className="w-20 !text-2xl !py-0.5" />
                <span className="text-white/40 font-mono mb-1">/</span>
                <EditField type="number" value={g.target} onChange={(v) => mutate((d) => { d.deadline.target = Number(v) || 0; })} className="w-20 !text-2xl !py-0.5" />
                <span className="text-white/40 font-mono mb-1">accounts</span>
              </>
            ) : (
              <>
                <span className="text-4xl font-black" style={{ color }}>{g.current}</span>
                <span className="text-white/40 font-mono mb-1">/ {g.target} accounts</span>
              </>
            )}
            <span className="ml-auto text-lg font-black font-mono" style={{ color }}>{Math.round(pct)}%</span>
          </div>
          <ProgressBar pct={pct} color={color} height="h-4" />
        </div>
        {/* Countdown + pace */}
        <div className="lg:w-64 lg:border-l lg:pl-6 flex lg:flex-col items-end lg:items-start justify-between gap-4" style={{ borderColor: LINE }}>
          <div>
            <Mono className="text-[9px] text-white/40 block mb-1">Days Remaining</Mono>
            <div className="text-5xl md:text-6xl font-black tabular-nums leading-none" style={{ color: ORANGE, textShadow: `0 0 30px ${wa(ORANGE, '55')}` }}>{days}</div>
          </div>
          <div className="text-right lg:text-left">
            <Mono className="text-[9px] text-white/40 block mb-1">Pace To Win</Mono>
            <div className="text-xl font-black text-white">+{needed} <span className="text-white/40 text-sm font-mono">to go</span></div>
            <div className="text-sm font-mono" style={{ color: BLUE }}>≈ {perWeek.toFixed(1)} / week</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecCommandCenter() {
  const { data: STORM, editing, mutate } = useStorm();
  const health = companyHealth(STORM);
  const hColor = STATUS_COLOR[healthStatus(health)];
  return (
    <div className="space-y-8">
      <div className="text-center pt-2">
        <Mono className="text-[11px] block mb-3" style={{ color: ORANGE }}>Company Growth Operating System</Mono>
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white">PROJECT STORM</h1>
        <p className="mt-3 text-white/50 text-sm">We measure Assets, Opportunities, Revenue, Customer Success &amp; Leverage — not effort. One screen, total transparency.</p>
      </div>

      <MissionDeadline />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {STORM.northStar.map((g, i) => {
          const pct = pctOf(g.current, g.target);
          const color = STATUS_COLOR[statusOf(pct)];
          const cur = g.money ? fmtRM(g.current) : fmtNum(g.current);
          const tgt = g.money ? fmtRM(g.target) : fmtNum(g.target);
          const Icon = NORTHSTAR_ICONS[i] ?? Target;
          return (
            <Panel key={g.label} accent={color}>
              <div className="flex items-center gap-2 mb-4">
                <Icon size={18} style={{ color: BLUE }} />
                <Mono className="text-[10px] text-white/60">{g.label}</Mono>
              </div>
              {editing ? (
                <div className="flex items-center gap-2 mb-3">
                  <EditField type="number" value={g.current} onChange={(v) => mutate((d) => { d.northStar[i].current = Number(v) || 0; })} className="w-24 !text-xl" />
                  <span className="text-white/40 font-mono">/</span>
                  <EditField type="number" value={g.target} onChange={(v) => mutate((d) => { d.northStar[i].target = Number(v) || 0; })} className="w-24 !text-xl" />
                </div>
              ) : (
                <>
                  <div className="flex items-end justify-between mb-1">
                    <span className="text-4xl md:text-5xl font-black text-white">{cur}</span>
                    <span className="text-lg font-mono font-black" style={{ color }}>{Math.round(pct)}%</span>
                  </div>
                  <p className="text-white/40 text-xs mb-4 font-mono">Target {tgt}</p>
                </>
              )}
              <ProgressBar pct={pct} color={color} height="h-4" />
            </Panel>
          );
        })}
      </div>

      {/* Company Health Score */}
      <Panel accent={hColor} className="text-center">
        <Mono className="text-[10px] block mb-4" style={{ color: ORANGE }}>Company Health Score</Mono>
        <div className="flex flex-col items-center">
          <div className="flex items-baseline gap-2">
            <span className="text-7xl md:text-8xl font-black" style={{ color: hColor, textShadow: `0 0 40px ${wa(hColor, '66')}` }}>{health}</span>
            <span className="text-2xl font-bold text-white/40">/100</span>
          </div>
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: `${wa(hColor, '1a')}`, border: `1px solid ${wa(hColor, '55')}` }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: hColor }} />
            <Mono className="text-[10px]" style={{ color: hColor }}>{STATUS_LABEL[healthStatus(health)]}</Mono>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-7">
          {STORM.health.map((p, i) => (
            <div key={p.label} className="rounded-lg p-3" style={{ backgroundColor: 'var(--s-surface)' }}>
              {editing ? (
                <EditField type="number" value={p.score} onChange={(v) => mutate((d) => { d.health[i].score = Number(v) || 0; })} className="w-full !text-lg text-center" />
              ) : (
                <div className="text-2xl font-black text-white">{p.score}</div>
              )}
              <Mono className="text-[8px] text-white/50 block mt-1 !tracking-[0.12em]">{p.label}</Mono>
              <div className="mt-2"><ProgressBar pct={p.score} color={STATUS_COLOR[statusOf(p.score)]} height="h-1" /></div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-white/30 text-[11px] font-mono">20% Assets · 20% Opportunities · 20% Revenue Growth · 20% Customer Success · 20% Business Leverage</p>
      </Panel>
    </div>
  );
}

function SecRevenueFactory() {
  const { data: STORM } = useStorm();
  const fac = STORM.factories.revenue;
  return (
    <div className="space-y-6">
      <SectionTitle icon={FACTORY_ICON.revenue} kicker="Owners: Sean · Roy · Jinn" title={fac.title} mission={fac.mission} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {fac.people.map((p, i) => <PersonCard key={p.name} p={p} factory="revenue" idx={i} />)}
      </div>
    </div>
  );
}

function SecProductFactory() {
  const { data: STORM } = useStorm();
  const fac = STORM.factories.product;
  return (
    <div className="space-y-6">
      <SectionTitle icon={FACTORY_ICON.product} kicker="Owners: Elon · Shazwin · Izzul" title={fac.title} mission={fac.mission} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {fac.people.map((p, i) => <PersonCard key={p.name} p={p} factory="product" idx={i} />)}
      </div>
    </div>
  );
}

function SecSuccessFactory() {
  const { data: STORM } = useStorm();
  const fac = STORM.factories.success;
  return (
    <div className="space-y-6">
      <SectionTitle icon={FACTORY_ICON.success} kicker="Owners: Cetana · Danson" title={fac.title} mission={fac.mission} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {fac.people.map((p, i) => <PersonCard key={p.name} p={p} factory="success" idx={i} />)}
      </div>
    </div>
  );
}

function SecSpecial() {
  const { data: STORM } = useStorm();
  return (
    <div className="space-y-6">
      <SectionTitle icon={Sparkles} kicker="Special Projects" title="Special Projects" mission="Focused initiatives — complete, prove, and hand over cleanly." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {STORM.specialProjects.map((sp) => {
          const transitioning = sp.status.toLowerCase() === 'transitioning';
          const tone = transitioning ? AMBER : GREEN;
          return (
            <Panel key={sp.name} accent={tone}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black text-white tracking-tight">{sp.name}</h3>
                <span className="px-2.5 py-1 rounded text-[9px] font-mono font-bold uppercase tracking-wider" style={{ backgroundColor: `${wa(tone, '1a')}`, color: tone }}>{sp.status}</span>
              </div>
              <Mono className="text-[9px] text-white/40 block mb-2">Focus Areas</Mono>
              <div className="flex flex-wrap gap-2 mb-5">
                {sp.focus.map((f) => (
                  <span key={f} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white/90" style={{ backgroundColor: 'var(--s-surface2)', border: `1px solid ${wa(tone, '33')}` }}>{f}</span>
                ))}
              </div>
              <Mono className="text-[9px] text-white/40 block mb-1">Objective</Mono>
              <p className="text-sm text-white/80">{sp.objective}</p>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}

function SecGrowthFactory() {
  const { data: STORM } = useStorm();
  const g = STORM.growth;
  const partners = STORM.northStar[2];
  const pPct = pctOf(partners.current, partners.target);
  return (
    <div className="space-y-6">
      <SectionTitle icon={Rocket} kicker="Beyond The Founder" title="Growth Factory" mission={g.mission} />
      <Panel accent={ORANGE} className="text-center">
        <Mono className="text-[10px] block mb-3" style={{ color: ORANGE }}>Partner Count</Mono>
        <div className="flex items-baseline justify-center gap-3 mb-4">
          <span className="text-6xl font-black text-white">{partners.current}</span>
          <span className="text-2xl text-white/40 font-mono">/ {partners.target}</span>
        </div>
        <ProgressBar pct={pPct} color={STATUS_COLOR[statusOf(pPct)]} height="h-4" />
      </Panel>
    </div>
  );
}

function SecLeaderboard() {
  const { data: STORM } = useStorm();
  const ranked = useMemo(
    () => allPeople(STORM).map((p) => ({ p, ach: personAchievement(p) })).sort((a, b) => b.ach - a.ach),
    [STORM],
  );
  const medals = ['🥇', '🥈', '🥉'];
  return (
    <div className="space-y-6">
      <SectionTitle icon={Trophy} kicker="Monthly Ranking" title="Leaderboard" mission="Ranked by Achievement % — outcomes, not effort." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {ranked.slice(0, 3).map(({ p, ach }, i) => {
          const color = STATUS_COLOR[statusOf(ach)];
          return (
            <Panel key={p.name} accent={i === 0 ? ORANGE : color} className={i === 0 ? 'md:-translate-y-2' : ''}>
              <div className="flex items-center justify-between">
                <span className="text-4xl">{medals[i]}</span>
                <AchievementRing pct={ach} size={78} />
              </div>
              <h3 className="text-2xl font-black text-white mt-3">{p.name}</h3>
              <div className="flex gap-4 mt-2 text-xs font-mono text-white/50">
                <span>🔥 {p.streak}w streak</span>
                <span>Best: {p.bestMonth}</span>
              </div>
            </Panel>
          );
        })}
      </div>
      <Panel>
        {ranked.slice(3).map(({ p, ach }, i) => (
          <div key={p.name} className="flex items-center justify-between py-3 border-b last:border-b-0" style={{ borderColor: LINE }}>
            <div className="flex items-center gap-4">
              <span className="font-mono text-white/40 w-6">#{i + 4}</span>
              <span className="font-bold text-white">{p.name}</span>
              <span className="text-[11px] font-mono text-white/40">🔥 {p.streak}w · Best {p.bestMonth}</span>
            </div>
            <span className="font-black font-mono" style={{ color: STATUS_COLOR[statusOf(ach)] }}>{ach}%</span>
          </div>
        ))}
      </Panel>
    </div>
  );
}

function SecAchievements() {
  const { data: STORM } = useStorm();
  const badges = computeBadges(STORM);
  return (
    <div className="space-y-6">
      <SectionTitle icon={Award} kicker="Badge Gallery" title="Achievements" mission="Unlockable badges — earned live from the numbers." />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {badges.map((b) => {
          const on = b.unlocked;
          return (
            <div
              key={b.label}
              className="rounded-xl border p-5 text-center transition-all"
              style={{ backgroundColor: on ? `${wa(ORANGE, '10')}` : PANEL, borderColor: on ? `${wa(ORANGE, '66')}` : LINE, opacity: on ? 1 : 0.4 }}
            >
              <div className="text-4xl mb-2" style={{ filter: on ? 'none' : 'grayscale(1)' }}>{b.icon}</div>
              <Mono className="text-[9px] block" style={{ color: on ? ORANGE : 'var(--s-t50)' }}>{b.label}</Mono>
              <Mono className="text-[8px] block mt-2" style={{ color: on ? GREEN : 'var(--s-t30)' }}>{on ? 'Unlocked' : 'Locked'}</Mono>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SecPartnerHub() {
  const { data: STORM } = useStorm();
  return (
    <div className="space-y-6">
      <SectionTitle icon={Handshake} kicker="Partner Program" title="Partner Hub" mission="Partner program tracker — Silver · Gold · Platinum." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {STORM.partnerTiers.map((t) => (
          <Panel key={t.name} accent={t.color}>
            <div className="flex items-center gap-2 mb-4">
              <Crown size={18} style={{ color: t.color }} />
              <h3 className="text-xl font-black" style={{ color: t.color }}>{t.name}</h3>
            </div>
            <div className="space-y-2 text-sm text-white/70">
              <div className="flex justify-between"><span>Active Customers</span><span className="font-bold text-white">{t.customers}+</span></div>
              <div className="flex justify-between"><span>Retention</span><span className="font-bold text-white">{t.retention}</span></div>
              <div className="flex justify-between"><span>Recurring Commission</span><span className="font-black" style={{ color: t.color }}>{t.commission}</span></div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

function SecFounder() {
  const { data: STORM } = useStorm();
  const days = daysUntil(STORM.deadline.dateISO);
  const cards = [
    { label: 'Accounts', value: `${fmtNum(STORM.deadline.current)} / ${fmtNum(STORM.deadline.target)}`, color: ORANGE },
    { label: 'Days To Deadline', value: fmtNum(days), color: ORANGE },
    { label: 'Active Locations', value: `${fmtNum(STORM.northStar[0].current)} / ${fmtNum(STORM.northStar[0].target)}`, color: BLUE },
    { label: 'MRR', value: fmtRM(STORM.northStar[1].current), color: GREEN },
    { label: 'Partners', value: `${fmtNum(STORM.northStar[2].current)} / ${fmtNum(STORM.northStar[2].target)}`, color: BLUE },
    { label: 'Company Health', value: `${companyHealth(STORM)}`, color: STATUS_COLOR[healthStatus(companyHealth(STORM))] },
  ];
  return (
    <div className="space-y-6">
      <SectionTitle icon={Crown} kicker="Sean View" title="Founder Dashboard" mission="Today's critical numbers — one screen." />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => (
          <Panel key={c.label} accent={c.color} className="text-center">
            <div className="text-4xl md:text-5xl font-black mb-2" style={{ color: c.color, textShadow: `0 0 30px ${wa(c.color, '44')}` }}>{c.value}</div>
            <Mono className="text-[10px] text-white/60">{c.label}</Mono>
          </Panel>
        ))}
      </div>
      <Panel accent={ORANGE} className="text-center">
        <Flag size={18} className="inline mb-2" style={{ color: ORANGE }} />
        <p className="text-white/70 text-sm max-w-2xl mx-auto">
          <span className="font-black text-white">Golden Rule.</span> Every widget here answers one question — <span style={{ color: ORANGE }}>are we growing?</span> If it doesn't lift Revenue, MRR, Customers, Retention or Partners, it shouldn't exist.
        </p>
      </Panel>
    </div>
  );
}

function SecPhilosophy() {
  const measures = ['Assets Created', 'Opportunities Created', 'Revenue Growth', 'Customer Success', 'Business Leverage'];
  const shifts = [
    { from: 'Building Features', to: 'Building Assets' },
    { from: 'Being Busy', to: 'Creating Outcomes' },
    { from: 'Founder Dependency', to: 'System Dependency' },
  ];
  const proofTypes = ['Live URL', 'Proposal', 'Customer name', 'Meeting record', 'Published content', 'Deployment screenshot', 'Training record', 'Testimonial'];
  return (
    <div className="space-y-6">
      <SectionTitle icon={Sparkles} kicker="Project Storm Philosophy" title="Doctrine" mission="Build a machine that grows regardless of mood, circumstance, or individual." />

      {/* What we measure */}
      <Panel>
        <Mono className="text-[10px] block mb-4" style={{ color: ORANGE }}>What We Measure</Mono>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {measures.map((m, i) => (
            <div key={m} className="rounded-lg p-3 text-center" style={{ backgroundColor: 'var(--s-surface)', border: `1px solid ${LINE}` }}>
              <div className="text-2xl font-black" style={{ color: BLUE }}>{i + 1}</div>
              <Mono className="text-[8px] text-white/60 block mt-1 !tracking-[0.1em]">{m}</Mono>
            </div>
          ))}
        </div>
        <p className="mt-3 text-white/30 text-[11px]">No longer measuring effort, busyness, or who worked the longest.</p>
      </Panel>

      {/* The shifts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {shifts.map((s) => (
          <Panel key={s.to} accent={ORANGE}>
            <Mono className="text-[9px] text-white/40 block mb-2">Shift From</Mono>
            <div className="text-white/45 line-through text-lg font-bold">{s.from}</div>
            <div className="flex items-center gap-2 my-2">
              <ArrowRight size={16} style={{ color: ORANGE }} />
              <Mono className="text-[9px]" style={{ color: ORANGE }}>To</Mono>
            </div>
            <div className="text-2xl font-black text-white">{s.to}</div>
          </Panel>
        ))}
      </div>

      {/* Proof rule */}
      <Panel accent={GREEN}>
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck size={18} style={{ color: GREEN }} />
          <Mono className="text-[10px]" style={{ color: GREEN }}>Proof Or It Doesn't Exist</Mono>
        </div>
        <p className="text-white/70 text-sm mb-4 max-w-3xl">Every completed KPI must have proof. If there is no proof, it did not happen. Acceptable proof:</p>
        <div className="flex flex-wrap gap-2">
          {proofTypes.map((t) => (
            <span key={t} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white/90" style={{ backgroundColor: 'var(--s-surface2)', border: `1px solid ${wa(GREEN, '33')}` }}>{t}</span>
          ))}
        </div>
      </Panel>

      {/* Weekly question */}
      <Panel accent={ORANGE} className="text-center">
        <Mono className="text-[10px] block mb-3" style={{ color: ORANGE }}>Ask Yourself Every Week</Mono>
        <p className="text-2xl md:text-3xl font-black text-white max-w-2xl mx-auto leading-snug">"What did I create that made the company stronger?"</p>
        <p className="mt-4 font-mono uppercase tracking-[0.3em] text-sm" style={{ color: BLUE }}>Let's build a machine.</p>
      </Panel>
    </div>
  );
}

function SecMyDay() {
  const { data, mutate } = useStorm();
  const people = allPeople(data);
  const [me, setMe] = useState<string>(() => { try { return localStorage.getItem(ME_KEY) || ''; } catch { return ''; } });
  const [done, setDone] = useState<DoneMap>(() => loadDone());
  const [credit, setCredit] = useState<CreditMap>(() => loadCredit());

  const pickMe = (name: string) => { setMe(name); try { localStorage.setItem(ME_KEY, name); } catch { /* noop */ } };
  const clearMe = () => { setMe(''); try { localStorage.removeItem(ME_KEY); } catch { /* noop */ } };
  const isDone = (person: string, kpi: string, ti: number) => !!done[doneKey(person, kpi, ti)];
  const isCredited = (kpi: string) => !!credit[creditKey(me, kpi)];

  // Adjust the selected person's KPI `current` (so progress shows in Sales/Dev/Deployment).
  const bumpKpi = (kpi: string, delta: number) => mutate((d) => {
    for (const f of ['revenue', 'product', 'success'] as FactoryKey[]) {
      const person = d.factories[f].people.find((x) => x.name === me);
      if (person) {
        const mm = person.metrics.find((x) => x.label === kpi);
        if (mm) mm.current = Math.max(0, mm.current + delta);
        return;
      }
    }
  });

  // When a KPI's 3 daily tasks are all done, credit the KPI +1 (once/day, reversible).
  const reconcile = (kpi: string, doneMap: DoneMap) => {
    const m = people.find((x) => x.name === me)?.metrics.find((x) => x.label === kpi);
    const tasks = m?.tasks ?? [];
    const allDone = tasks.length > 0 && tasks.every((_, ti) => !!doneMap[doneKey(me, kpi, ti)]);
    const ck = creditKey(me, kpi);
    const credited = !!credit[ck];
    if (allDone === credited) return;
    bumpKpi(kpi, allDone ? 1 : -1);
    setCredit((prev) => { const next = { ...prev, [ck]: allDone }; if (!allDone) delete next[ck]; saveCredit(next); return next; });
  };

  const toggle = (kpi: string, ti: number) => {
    const k = doneKey(me, kpi, ti);
    const next = { ...done };
    if (next[k]) delete next[k]; else next[k] = true;
    setDone(next);
    saveDone(next);
    reconcile(kpi, next);
  };
  const tallies = (person: Person) => {
    const total = person.metrics.reduce((a, m) => a + (m.tasks?.length ?? 0), 0);
    const dn = person.metrics.reduce((a, m) => a + (m.tasks ?? []).filter((_, ti) => isDone(person.name, m.label, ti)).length, 0);
    return { total, dn, pct: total ? (dn / total) * 100 : 0 };
  };

  // Identity not chosen yet.
  if (!me || !people.some((p) => p.name === me)) {
    return (
      <div className="space-y-6">
        <SectionTitle icon={CalendarCheck} kicker="My Day" title="Who are you?" mission="Tap your name to see today's tasks. We'll remember you on this device." />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {people.map((p) => (
            <button key={p.name} onClick={() => pickMe(p.name)} className="rounded-xl border p-6 text-center transition-all hover:bg-white/5" style={{ borderColor: LINE, backgroundColor: PANEL }}>
              <UserCircle2 size={34} className="mx-auto mb-2 text-white/40" />
              <div className="text-lg font-black text-white">{p.name}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const p = people.find((x) => x.name === me)!;
  const { total, dn, pct } = tallies(p);
  const pctColor = STATUS_COLOR[statusOf(pct)];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const dateLabel = new Date().toLocaleDateString('en-MY', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="space-y-6">
      <Panel accent={pctColor}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <Mono className="text-[10px] block mb-1" style={{ color: ORANGE }}>{greeting}, {me}</Mono>
            <h2 className="text-2xl md:text-3xl font-black text-white">My Day · {dateLabel}</h2>
            <p className="text-white/50 text-sm mt-1">{total > 0 && dn === total ? 'All tasks done — legend. 🔥' : `${dn} of ${total} daily tasks done`}</p>
          </div>
          <div className="flex items-center gap-3">
            <AchievementRing pct={pct} size={84} />
            <button onClick={clearMe} className="text-[10px] font-mono uppercase tracking-wider px-3 py-2 rounded-lg hover:bg-white/5" style={{ border: `1px solid ${LINE}`, color: 'var(--s-t60)' }}>Not {me}?</button>
          </div>
        </div>
        <div className="mt-4"><ProgressBar pct={pct} color={pctColor} height="h-3" /></div>
      </Panel>

      <div className="space-y-4">
        {p.metrics.map((m) => {
          const tasks = m.tasks ?? [];
          const kdone = tasks.filter((_, ti) => isDone(me, m.label, ti)).length;
          const allDone = tasks.length > 0 && kdone === tasks.length;
          return (
            <Panel key={m.label} accent={allDone ? GREEN : LINE}>
              <div className="flex items-center justify-between mb-3 gap-3">
                <div className="flex items-baseline gap-2 min-w-0">
                  <h3 className="text-base font-black text-white truncate">{m.label}</h3>
                  <span className="text-[10px] font-mono text-white/40 whitespace-nowrap">KPI {m.current}/{m.target}{m.unit ?? ''}</span>
                </div>
                {isCredited(m.label)
                  ? <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold whitespace-nowrap" style={{ color: GREEN }}><CheckCircle2 size={11} /> +1 logged to KPI</span>
                  : <Mono className="text-[9px] whitespace-nowrap" style={{ color: 'var(--s-t40)' }}>{kdone}/{tasks.length} done</Mono>}
              </div>
              <div className="space-y-2">
                {tasks.length === 0 && <p className="text-white/30 text-xs italic">No daily tasks yet — add them in Edit mode.</p>}
                {tasks.map((t, ti) => {
                  const checked = isDone(me, m.label, ti);
                  return (
                    <button key={ti} onClick={() => toggle(m.label, ti)} className="w-full flex items-center gap-3 text-left rounded-lg px-3 py-3 transition-colors" style={{ backgroundColor: checked ? `${wa(GREEN, '12')}` : 'var(--s-surface)', border: `1px solid ${checked ? `${wa(GREEN, '44')}` : LINE}` }}>
                      {checked ? <CheckCircle2 size={20} style={{ color: GREEN }} className="shrink-0" /> : <Circle size={20} className="shrink-0 text-white/25" />}
                      <span className={`text-sm ${checked ? 'text-white/45 line-through' : 'text-white/90'}`}>{t}</span>
                    </button>
                  );
                })}
              </div>
              {m.proof && <Mono className="text-[7px] text-white/30 block mt-3 !tracking-[0.14em]">Proof needed · {m.proof}</Mono>}
            </Panel>
          );
        })}
      </div>

      <Panel>
        <div className="flex items-center gap-2 mb-4"><Users size={16} style={{ color: ORANGE }} /><Mono className="text-[10px]" style={{ color: ORANGE }}>Team Today</Mono></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {people.map((person) => {
            const t = tallies(person);
            const c = STATUS_COLOR[statusOf(t.pct)];
            return (
              <button key={person.name} onClick={() => pickMe(person.name)} className="rounded-lg p-3 text-left transition-colors hover:bg-white/5" style={{ backgroundColor: 'var(--s-surface)', border: `1px solid ${person.name === me ? `${wa(ORANGE, '66')}` : LINE}` }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-white">{person.name}</span>
                  <span className="text-[10px] font-mono font-bold" style={{ color: c }}>{t.dn}/{t.total}</span>
                </div>
                <ProgressBar pct={t.pct} color={c} height="h-1.5" />
              </button>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

// Thin divider between stacked sub-sections inside a combined tab.
function SubDivider() {
  return <div className="my-10 h-px" style={{ background: `linear-gradient(90deg, transparent, ${LINE}, transparent)` }} />;
}

// ── Combined tabs (consolidated from 15 → 7) ─────────────────────────────────
function SecDashboard() {
  return <SecCommandCenter />;
}
function SecGrowthHub() {
  return (
    <div>
      <SecGrowthFactory />
      <SubDivider />
      <SecSpecial />
    </div>
  );
}
function SecAchievementHub() {
  return (
    <div>
      <SecLeaderboard />
      <SubDivider />
      <SecAchievements />
      <SubDivider />
      <SecFounder />
      <SubDivider />
      <SecPhilosophy />
    </div>
  );
}

// ── Section registry ─────────────────────────────────────────────────────────
const SECTIONS: { id: string; label: string; icon: LucideIcon; render: () => JSX.Element }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Gauge, render: () => <SecDashboard /> },
  { id: 'myday', label: 'My Day', icon: CalendarCheck, render: () => <SecMyDay /> },
  { id: 'sales', label: 'Sales', icon: TrendingUp, render: () => <SecRevenueFactory /> },
  { id: 'development', label: 'Development', icon: Factory, render: () => <SecProductFactory /> },
  { id: 'deployment', label: 'Deployment', icon: Award, render: () => <SecSuccessFactory /> },
  { id: 'growth', label: 'Growth', icon: Rocket, render: () => <SecGrowthHub /> },
  { id: 'partner', label: 'Partner', icon: Handshake, render: () => <SecPartnerHub /> },
  { id: 'achievement', label: 'Achievement', icon: Trophy, render: () => <SecAchievementHub /> },
];

// ─────────────────────────────────────────────────────────────────────────────
// PASSWORD GATE
// ─────────────────────────────────────────────────────────────────────────────
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      onUnlock();
    } else {
      setErr('Wrong password.');
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: BG }}>
      <form onSubmit={submit} className="w-full max-w-sm rounded-xl border-2 p-7" style={{ borderColor: ORANGE, backgroundColor: wa(ORANGE, '0a') }}>
        <div className="flex items-center gap-2 mb-5">
          <Lock size={16} strokeWidth={2.5} style={{ color: ORANGE }} />
          <Mono className="text-[10px]" style={{ color: ORANGE }}>Restricted · Project Storm</Mono>
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tight text-white mb-1">Storm HQ</h1>
        <p className="text-white/60 text-[12px] mb-6">Company Growth Operating System. Internal team access only.</p>
        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/50 mb-2">Shared Password</label>
        <input
          type="password" autoFocus value={pwd}
          onChange={(e) => { setPwd(e.target.value); setErr(null); }}
          className="w-full border-2 focus:outline-none text-white text-[14px] px-3 py-2.5 mb-3 rounded-lg"
          style={{ backgroundColor: BG, borderColor: err ? RED : 'var(--s-faint)' }}
          placeholder="••••••••"
        />
        {err && <p className="text-[12px] mb-3" style={{ color: RED }}>{err}</p>}
        <button type="submit" className="w-full py-2.5 rounded-lg font-bold uppercase tracking-wide text-[13px] text-black transition-opacity hover:opacity-90" style={{ backgroundColor: ORANGE }}>
          Enter War Room
        </button>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
export default function StormHQPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [active, setActive] = useState(0);
  const [tv, setTv] = useState(false);
  const [lastSync, setLastSync] = useState(() => new Date());
  const [clock, setClock] = useState(() => new Date());
  const [, force] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  // Editable store — persisted to localStorage.
  const [data, setData] = useState<StormData>(() => loadStormData());
  const [editing, setEditing] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  // Theme — Light is the default.
  const [theme, setTheme] = useState<Theme>(() => {
    try { return (localStorage.getItem(THEME_KEY) as Theme) || 'light'; } catch { return 'light'; }
  });
  const themeClass = theme === 'light' ? 'storm-light' : 'storm-dark';
  const toggleTheme = () => setTheme((t) => {
    const next: Theme = t === 'light' ? 'dark' : 'light';
    try { localStorage.setItem(THEME_KEY, next); } catch { /* noop */ }
    return next;
  });

  useEffect(() => { saveStormData(data); }, [data]);

  const mutate = (recipe: (draft: StormData) => void) =>
    setData((prev) => { const draft = cloneStorm(prev); recipe(draft); return draft; });
  const replaceAll = (d: StormData) => setData(d);
  const reset = () => {
    if (typeof window !== 'undefined' && !window.confirm('Reset all KPIs & tasks back to the defaults? Your edits will be lost.')) return;
    setData(cloneStorm(DEFAULT_STORM));
  };
  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'storm-data.json'; a.click();
    URL.revokeObjectURL(url);
  };
  const onImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { replaceAll(JSON.parse(String(reader.result)) as StormData); }
      catch { window.alert('Could not read that file — make sure it is a Storm export.'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') setUnlocked(true);
  }, []);

  // Live clock (1s)
  useEffect(() => {
    if (!unlocked) return;
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, [unlocked]);

  // Auto-refresh every 60s. fetchStormData() can be wired here later; for now it
  // re-derives the view and stamps a fresh sync time.
  useEffect(() => {
    if (!unlocked) return;
    const t = setInterval(() => {
      setLastSync(new Date());
      force((n) => n + 1);
    }, REFRESH_MS);
    return () => clearInterval(t);
  }, [unlocked]);

  // TV mode auto-cycles the sections.
  useEffect(() => {
    if (!unlocked || !tv) return;
    const t = setInterval(() => setActive((i) => (i + 1) % SECTIONS.length), TV_CYCLE_MS);
    return () => clearInterval(t);
  }, [unlocked, tv]);

  const toggleTv = async () => {
    const next = !tv;
    setTv(next);
    try {
      if (next && rootRef.current?.requestFullscreen) await rootRef.current.requestFullscreen();
      else if (!next && document.fullscreenElement) await document.exitFullscreen();
    } catch { /* fullscreen may be blocked — TV layout still applies */ }
  };

  if (!unlocked) {
    return (
      <div className={themeClass}>
        <SEOHead title="Storm HQ" description="Internal." noindex noTitleSuffix />
        <PasswordGate onUnlock={() => setUnlocked(true)} />
      </div>
    );
  }

  const Section = SECTIONS[active];
  const refreshNow = () => { setLastSync(new Date()); force((n) => n + 1); };
  const ctx: StormCtx = { data, editing, setEditing, mutate, replaceAll, reset };

  return (
    <StormContext.Provider value={ctx}>
    <div ref={rootRef} className={`${themeClass} min-h-screen text-white`} style={{ backgroundColor: BG, fontFeatureSettings: '"tnum"' }}>
      <SEOHead title="Storm HQ" description="Internal." noindex noTitleSuffix />

      {/* Top bar */}
      <header className="sticky top-0 z-30 backdrop-blur-md border-b" style={{ backgroundColor: 'var(--s-header)', borderColor: LINE }}>
        <div className="max-w-[1500px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-2">
              <Zap size={20} style={{ color: '#FF3D00' }} fill="#FF3D00" />
              <span className="font-black tracking-tight text-lg whitespace-nowrap" style={{ color: '#FF3D00' }}>PROJECT STORM</span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ backgroundColor: `${wa(GREEN, '14')}`, border: `1px solid ${wa(GREEN, '44')}` }}>
              <Radio size={11} style={{ color: GREEN }} className="animate-pulse" />
              <Mono className="text-[9px]" style={{ color: GREEN }}>Live</Mono>
            </span>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden md:flex flex-col items-end leading-tight">
              <span className="font-mono text-sm font-bold tabular-nums">{clock.toLocaleTimeString('en-MY', { hour12: false })}</span>
              <Mono className="text-[8px] text-white/40">Synced {lastSync.toLocaleTimeString('en-MY', { hour12: false })}</Mono>
            </div>
            <DeadlineChip />
            <HealthChip />
            <button onClick={toggleTheme} title={theme === 'light' ? 'Switch to dark' : 'Switch to light'} className="p-2 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1.5" style={{ border: `1px solid ${LINE}` }}>
              {theme === 'light' ? <Moon size={15} style={{ color: BLUE }} /> : <Sun size={15} style={{ color: AMBER }} />}
              <Mono className="text-[9px] hidden lg:inline" style={{ color: 'var(--s-t50)' }}>{theme === 'light' ? 'Dark' : 'Light'}</Mono>
            </button>
            <button onClick={refreshNow} title="Refresh now" className="p-2 rounded-lg hover:bg-white/5 transition-colors" style={{ border: `1px solid ${LINE}` }}>
              <RefreshCw size={15} className="text-white/60" />
            </button>
            {!tv && (
              <button onClick={() => setEditing((v) => !v)} title="Edit KPIs & tasks" className="p-2 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1.5" style={{ border: `1px solid ${editing ? ORANGE : LINE}`, backgroundColor: editing ? `${wa(ORANGE, '1a')}` : 'transparent' }}>
                <Pencil size={15} style={{ color: editing ? ORANGE : 'var(--s-t60)' }} />
                <Mono className="text-[9px] hidden lg:inline" style={{ color: editing ? ORANGE : 'var(--s-t50)' }}>{editing ? 'Editing' : 'Edit'}</Mono>
              </button>
            )}
            <button onClick={toggleTv} title="TV / fullscreen mode" className="p-2 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1.5" style={{ border: `1px solid ${tv ? ORANGE : LINE}`, backgroundColor: tv ? `${wa(ORANGE, '1a')}` : 'transparent' }}>
              {tv ? <Minimize2 size={15} style={{ color: ORANGE }} /> : <Maximize2 size={15} className="text-white/60" />}
              <Mono className="text-[9px] hidden lg:inline" style={{ color: tv ? ORANGE : 'var(--s-t50)' }}>TV</Mono>
            </button>
          </div>
        </div>

        {/* Edit toolbar */}
        {editing && !tv && (
          <div className="border-t" style={{ borderColor: LINE, backgroundColor: `${wa(ORANGE, '0a')}` }}>
            <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-2 flex items-center gap-3 flex-wrap">
              <Mono className="text-[9px]" style={{ color: ORANGE }}>Edit Mode</Mono>
              <span className="text-[11px] text-white/50">Add / remove / edit any KPI &amp; its 3 daily tasks — changes auto-save to this browser.</span>
              <div className="ml-auto flex items-center gap-2">
                <button onClick={exportData} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold hover:bg-white/5" style={{ border: `1px solid ${LINE}`, color: BLUE }}><Download size={12} /> Export</button>
                <button onClick={() => importRef.current?.click()} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold hover:bg-white/5" style={{ border: `1px solid ${LINE}`, color: BLUE }}><Upload size={12} /> Import</button>
                <button onClick={reset} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold hover:bg-white/5" style={{ border: `1px solid ${wa(RED, '44')}`, color: RED }}><RotateCcw size={12} /> Reset</button>
                <input ref={importRef} type="file" accept="application/json" className="hidden" onChange={onImportFile} />
              </div>
            </div>
          </div>
        )}

        {/* Section tabs (hidden in TV mode) */}
        {!tv && (
          <nav className="max-w-[1500px] mx-auto px-4 md:px-6 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
            {SECTIONS.map((s, i) => {
              const on = i === active;
              return (
                <button
                  key={s.id} onClick={() => setActive(i)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors shrink-0"
                  style={{
                    backgroundColor: on ? ORANGE : 'var(--s-surface)',
                    color: on ? '#fff' : 'var(--s-t60)',
                    boxShadow: on ? `0 4px 16px ${wa(ORANGE, '55')}` : 'none',
                  }}
                >
                  <s.icon size={18} strokeWidth={2.4} />
                  <span className="font-bold text-[13px] tracking-tight">{s.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </header>

      {/* Content */}
      <main className={`max-w-[1500px] mx-auto px-4 md:px-6 py-8 ${tv ? 'lg:text-[1.05rem]' : ''}`}>
        <div key={active} style={{ animation: 'fadeInUp 0.4s ease-out' }}>
          {Section.render()}
        </div>
        <p className="text-center mt-12 text-white/25 text-[10px] font-mono uppercase tracking-[0.2em]">
          Project Storm HQ · Internal · Are we growing?
        </p>
      </main>

      {/* TV-mode progress dots */}
      {tv && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-40">
          {SECTIONS.map((_, i) => (
            <span key={i} className="h-1.5 rounded-full transition-all" style={{ width: i === active ? 28 : 8, backgroundColor: i === active ? ORANGE : 'var(--s-faint)' }} />
          ))}
        </div>
      )}
    </div>
    </StormContext.Provider>
  );
}

function DeadlineChip() {
  const { data: STORM } = useStorm();
  const g = STORM.deadline;
  const days = daysUntil(g.dateISO);
  return (
    <div
      className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
      style={{ border: `1px solid ${wa(ORANGE, '55')}`, backgroundColor: `${wa(ORANGE, '12')}` }}
      title={`${g.target} accounts by ${g.dateLabel}`}
    >
      <CalendarClock size={14} style={{ color: ORANGE }} />
      <span className="font-black font-mono text-sm" style={{ color: ORANGE }}>{days}d</span>
      <Mono className="text-[8px] text-white/40 hidden md:inline">to {g.target}</Mono>
    </div>
  );
}

function HealthChip() {
  const { data: STORM } = useStorm();
  const health = companyHealth(STORM);
  const color = STATUS_COLOR[healthStatus(health)];
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ border: `1px solid ${wa(color, '55')}`, backgroundColor: `${wa(color, '12')}` }}>
      <Activity size={14} style={{ color }} />
      <span className="font-black font-mono text-sm" style={{ color }}>{health}</span>
      <Mono className="text-[8px] text-white/40 hidden sm:inline">Health</Mono>
    </div>
  );
}
