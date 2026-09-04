import { QHubFeature, AIQuestion, ControlCard, IndustryCard } from '../types/qhub';

export const controlCards: ControlCard[] = [
  {
    title: 'Your Business, Your Control',
    description:
      'Update menus, prices, layouts, flows, and promotions anytime. Changes reflect LIVE on kiosks, QR menus, and apps — instantly.',
    image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800&h=450',
  },
  {
    title: 'Smart Reporting',
    description:
      "Clear, actionable reports showing what's selling, what's not, and what needs fixing — all in one glance.",
    image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800&h=450',
  },
  {
    title: 'Growth-Driven Support',
    description:
      'Our team supports your growth journey — not just troubleshooting. Real people, real solutions, real improvements.',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=450',
  },
];

export const qhubFeatures: QHubFeature[] = [
  {
    id: 'ai-insights',
    title: 'AI-Powered Insights',
    description:
      "Instantly see what's working, what's not, and what action to take — powered by AI recommendations.",
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
  },
  {
    id: 'menu-management',
    title: 'Menu & Product Management',
    description: 'Update kiosks or QR menus anytime with new items, pricing, bundles, or visuals.',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
  },
  {
    id: 'promotion-control',
    title: 'Promotion Control Panel',
    description: 'Launch or pause promotions instantly — no developer needed.',
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
  },
  {
    id: 'customizable',
    title: 'Fully Customizable',
    description: 'Change colors, screensavers, layouts, flows, languages, and banner designs easily.',
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
  },
  {
    id: 'integrations',
    title: 'Rich Integrations',
    description: 'Connect QHub with POS systems, accounting tools, CRMs, or any API-enabled service.',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
  },
  {
    id: 'payments',
    title: 'All Cashless Payments',
    description: "Accept Visa, GrabPay, Touch 'n Go, Apple Pay, QR Pay — without extra hardware.",
    image: 'https://images.pexels.com/photos/4968391/pexels-photo-4968391.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
  },
];

export const aiQuestions: AIQuestion[] = [
  {
    id: 'fb-1',
    category: 'F&B',
    question: 'Why is my lunch hour revenue dropping?',
    answer:
      'Sales dropped 13% at 1–3PM. QHub suggests offering a Lunch Combo and auto-promoting it on the kiosk home screen.',
  },
  {
    id: 'fb-2',
    category: 'F&B',
    question: 'Which menu item should I promote today?',
    answer:
      'Based on inventory levels and profit margins, QHub recommends featuring the Signature Burger with a limited-time 15% discount.',
  },
  {
    id: 'fb-3',
    category: 'F&B',
    question: 'How do I reduce queue time during peak hours?',
    answer:
      'QHub detected average wait time of 8 minutes. Enable express ordering and pre-order options to reduce queue by 40%.',
  },
  {
    id: 'salon-1',
    category: 'Salon / Wellness',
    question: 'Which treatment has the highest upsell potential?',
    answer:
      'Only 14% of customers took treatment upgrades this week. QHub recommends placing "Scalp Detox" on the home page as a highlight add-on.',
  },
  {
    id: 'salon-2',
    category: 'Salon / Wellness',
    question: 'Are my weekends under-utilized?',
    answer:
      'Saturday mornings show 32% lower bookings. QHub suggests launching an early-bird weekend promotion to boost utilization.',
  },
  {
    id: 'sports-1',
    category: 'Sports Facilities',
    question: 'Which court generates the highest revenue?',
    answer:
      'Court 3 delivers 38% higher revenue. QHub suggests dynamic pricing from 6PM–9PM to maximize earnings.',
  },
  {
    id: 'sports-2',
    category: 'Sports Facilities',
    question: 'When is my peak playtime?',
    answer:
      'Peak hours are 6PM–9PM weekdays with 94% occupancy. Consider adding late-night slots or premium pricing.',
  },
  {
    id: 'education-1',
    category: 'Education',
    question: 'Which classes are filling slower?',
    answer:
      'AI detected lower renewals for Robotics. QHub recommends a bundled renewal with free trial classes.',
  },
  {
    id: 'education-2',
    category: 'Education',
    question: 'Are parents renewing on time?',
    answer:
      'Renewal rate dropped 18% this month. QHub suggests sending automated reminders 2 weeks before expiry with early-bird incentives.',
  },
  {
    id: 'parking-1',
    category: 'Parking',
    question: 'How many cars abandoned payment?',
    answer:
      'Exit congestion spikes at 6.20PM. QHub suggests enabling prepaid top-ups and instant QR auto-pay.',
  },
  {
    id: 'parking-2',
    category: 'Parking',
    question: 'When is traffic congestion highest?',
    answer:
      '6.20PM shows highest congestion. QHub recommends dynamic exit pricing or off-peak incentives to distribute traffic.',
  },
  {
    id: 'retail-1',
    category: 'Retail / Mall',
    question: 'Which kiosk location pulls the most signups?',
    answer:
      'Kiosk A (Ground Floor) converts 41% more signups. Move campaign banners here for highest ROI.',
  },
];

export const industries: IndustryCard[] = [
  { name: 'F&B', icon: 'utensils' },
  { name: 'Salon', icon: 'scissors' },
  { name: 'Fitness', icon: 'dumbbell' },
  { name: 'Parking', icon: 'car' },
  { name: 'Retail', icon: 'shopping-bag' },
  { name: 'Clinics', icon: 'heart-pulse' },
  { name: 'Carwash', icon: 'droplet' },
  { name: 'Education', icon: 'graduation-cap' },
  { name: 'Sports', icon: 'trophy' },
  { name: 'Events', icon: 'calendar' },
];
