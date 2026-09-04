// ─────────────────────────────────────────────────────────────────────────────
// Personalized brand proposals — rendered by QuoteStudioProposalPage at
// /quotesys/quotestudio/proposal/<slug>. Password-gated + noindex (not public).
// Add a new brand by adding another entry to PROPOSALS keyed by its slug.
// ─────────────────────────────────────────────────────────────────────────────
import type { TierLevel } from './quoteStudioCatalog';

export interface ProposalPhase {
  name: string;     // "Phase 1"
  date: string;     // "Aug 2026"
  title: string;    // short heading
  desc: string;     // details
  budget: string;   // "RM15,000"
  note?: string;    // e.g. "incl. 1-year subscription"
}

export interface ProposalSection {
  title: string;
  items: string[];
}

export interface Proposal {
  slug: string;
  brandName: string;            // "Badcave Gym"
  preparedFor: string;          // line under the header
  pics: string[];               // ["Mr. Murad", "Mr. Ali"]
  address: string;
  date: string;                 // issue date label
  mission: string;              // one-paragraph mission
  intro: string;                // QStudio key intro
  recap: string;                // meeting recap blurb
  issues: string[];             // Current Issues & Major Concerns
  goals: string[];              // Goals To Achieve
  currentSetup: string[];
  requirements: ProposalSection[];  // Hardware / Software / Data & Privacy / Others
  recommendedTier: TierLevel;       // 'advanced'
  signupNote: string;               // sign-up line above the roadmap
  phases: ProposalPhase[];
  futureIdeas: { title: string; desc: string }[];   // "Future Success" — aspirational ideas
}

export const PROPOSALS: Record<string, Proposal> = {
  badcave: {
    slug: 'badcave',
    brandName: 'Badcave Gym',
    preparedFor: 'Badcave Gym',
    pics: ['Mr. Murad', 'Mr. Ali'],
    address: '7, Jalan Kajibumi U1/70, Temasya Niaga, Temasya, Persiaran Kerjaya, 40150 Shah Alam, Selangor, Malaysia',
    date: '19 June 2026',
    mission:
      'Our mission is to elevate the Badcave experience — built for its many VIPs — into one integrated, seamless journey. From the front door to the gym floor, every touchpoint is connected, automated, and effortless.',
    intro:
      "QStudio is an all-in-one operating system for gyms, studios, and members' clubs. It unifies membership, access control, booking, payments, loyalty, and reporting into a single platform — so your team runs the whole business from one dashboard while members enjoy a frictionless, app-first experience. Built in Malaysia, on Malaysian payment rails, and designed to scale from a single location to a multi-brand group.",
    recap:
      'Summary of our site meeting at Badcave Gym with Mr. Murad and Mr. Ali — covering current challenges, goals, the existing setup, and the proposed roadmap to a fully automated, premium member experience.',
    issues: [
      'Membership lapses go unenforced — members with no renewal payment can still enter, causing lost revenue.',
      'Paid members get stuck at the turnstile — a frustrating experience and a broken customer journey.',
      'Automated WhatsApp messages go unanswered — risking bad Google reviews and reputation damage.',
    ],
    goals: [
      'Phase 1 — Foundation: membership onboarding, e-sign, access, and renewal.',
      'Phase 2 — Fully AI & automated: an AI chatbot for enquiries & support, plus an AI Kiosk to replace front-desk staff.',
      'Phase 3 — IoT integration: lighting that auto turns on/off (configured from the Qbot Dashboard) and a 3D virtual tour of Badcave.',
      'A reliable, stable system that runs without depending on manual labour.',
      "A member community — a connected, social 'third space' members make their favourite.",
      '24-hour access to the gym.',
    ],
    currentSetup: [
      'Two access points: door access at the front entrance, and biometric access before the gym training area.',
      'Biometric access runs a double lane — one in, one out.',
      'HIKVision door and biometric access hardware.',
      'Membership-data server hosted on the local network (LAN).',
    ],
    requirements: [
      {
        title: 'Hardware',
        items: [
          'Reuse existing hardware wherever possible.',
          'Add a vending machine to dispense mineral water to members.',
        ],
      },
      {
        title: 'Software',
        items: [
          'Fully automated membership onboarding, e-sign, access, and renewal.',
          'Staff attendance module.',
          'Support all-day access, off-peak access, and peak-hour access tiers.',
          'Automated welcome email from the gym CEO on onboarding.',
          'Fully automated membership renewal when a subscription expires.',
        ],
      },
      {
        title: 'Data & Privacy',
        items: [
          'Personal trainers cannot access or contact customer data — scheduling, attendance, credit balance, and e-sign all happen through the system.',
          'Staff can reach out to a customer when a personal trainer needs to be in touch.',
        ],
      },
      {
        title: 'Others',
        items: [
          'Member-facing app branding: a black, prestige look & feel.',
        ],
      },
    ],
    recommendedTier: 'advanced',
    signupNote:
      '1 July 2026 — Sign up to the Studio Advanced plan to unlock integrations and customizations.',
    phases: [
      {
        name: 'Phase 1',
        date: '1 Sep 2026 or earlier',
        title: 'Automated Membership Foundation',
        desc: 'Full membership system running automatically — onboarding, e-sign, access, and renewal — plus team training.',
        budget: 'RM15,000',
        note: 'incl. 1-year subscription',
      },
      {
        name: 'Phase 2',
        date: '1 Dec 2026',
        title: 'AI & Automation',
        desc: 'Branded App launch, AI chatbot, and vending-machine integration.',
        budget: 'RM20,000',
      },
      {
        name: 'Phase 3',
        date: '1 Mar 2027',
        title: 'IoT & Smart Building',
        desc: 'IoT integration with lighting, office door access, and more.',
        budget: 'TBD',
        note: 'based on complexity',
      },
    ],
    futureIdeas: [
      { title: 'Premium Zone Access', desc: 'Face-ID separates the gym into zones — VIP lounge, women-only areas, PT studios, recovery rooms — so only the right members get in, automatically.' },
      { title: 'Body Composition, In-App', desc: "Sync the body-composition machine to each member's app — they track body fat, muscle, and BMI history over time, right beside their bookings." },
      { title: 'Multi-Outlet Command Center', desc: 'Owners see every outlet at a glance — revenue, check-ins, renewals, and staff across all locations, live in one dashboard.' },
      { title: 'WhatsApp Concierge (2027)', desc: 'Members simply message WhatsApp to book a class, check their membership, freeze, or renew — an always-on concierge, no app required.' },
      { title: 'IoT Smart Building', desc: 'One all-in-one control system to manage and monitor air-conditioning, lighting, doors, and more — scheduled, automated, and watched from the dashboard.' },
      { title: 'AI Coaching & Retention Insights', desc: "AI reads each member's check-ins, classes, and progress, then nudges them toward the right next session — keeping them consistent, motivated, and renewing." },
      { title: 'Smart Vending Machines', desc: "Vending machines tied to member accounts — grab a drink or supplement and it's auto-charged to their wallet, no cash, no queue." },
      { title: 'Smart Referral Engine', desc: 'Members invite friends straight from the app and earn rewards automatically — turning your community into your best sales channel.' },
      { title: 'Member Milestones & Rewards', desc: 'Automatically celebrate streaks, anniversaries, and personal bests with points, perks, and surprise vouchers — loyalty that feels personal.' },
    ],
  },
};
