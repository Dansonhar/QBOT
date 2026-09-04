import { KioskModel } from '../types/kiosk';

export const kioskModels: KioskModel[] = [
  {
    id: 'q1stand',
    name: 'Q1 Stand',
    tagline: 'Tall. Iconic. Designed to be seen.',
    description: 'Eye-level presence for high-traffic areas',
    perfectFor: 'F&B, malls, gyms, theme parks, events',
    benefits: [
      'Eye-level presence for high-traffic areas',
      'Comfortably large screen for browsing menus & selections',
      'Built for fast ordering and high-throughput environments',
      'Works standalone or paired with queue systems',
    ],
    image: '/Q_STAND_1.webp',
  },
  {
    id: 'q1desktop',
    name: 'Q1 Desktop',
    tagline: 'Compact. Clean. Counter-ready.',
    description: 'Small footprint for tight counters',
    perfectFor: 'Cafes, salons, clinics, gyms, coworking, boutique stores',
    benefits: [
      'Small footprint for tight counters',
      'Ideal for cashier replacement or tabletop self-ordering',
      'Minimalistic, modern presence without blocking staff',
      'Perfect for reception desks & compact businesses',
    ],
    image: '/QBOT_DEKSTOP_1.webp',
  },
  {
    id: 'q1duo',
    name: 'Q1 Duo',
    tagline: 'Dual-screen power for ultra-speedy operations.',
    description: 'Two screens: customer-side + operator-side',
    perfectFor: 'Fast-moving F&B, car wash, cinemas, theme parks',
    benefits: [
      'Two screens: customer-side + operator-side',
      'Faster order handling & verification',
      'Great for high-volume outlets needing rapid service',
      'Ideal for upsells, combos, and add-on promotions',
    ],
    image: '/qduo-v2.webp',
  },
];

export const kioskFeatures = [
  'Self-ordering & payments',
  'Self check-in & booking',
  'Membership signup & renewals',
  'Upsell automation',
  'Ticketing & QR pass generation',
  'Queue management',
  'Loyalty & rewards',
  'Multi-language support',
  'Analytics powered by QHub AI',
];

export const universalBenefits = [
  'Built to withstand heavy daily use',
  'Supports all cashless payments',
  'Real-time menu & promo updates from QHub',
  'AI Insights to boost sales instantly',
  'Works with all Q Modules (Stampcard, Queue Display, KDS, Appointment, etc.)',
];
