import { Module } from '../types/module';

export const modules: Module[] = [
  {
    id: 'web-store',
    name: 'QR Menu',
    description: 'Turn your kiosk or QR code into a full online store. Let customers browse, order, and pay anywhere, anytime.',
    image: '/qrmenu.webp',
    category: 'ordering',
  },
  {
    id: 'booking',
    name: 'Booking Module with QR Pass',
    description: 'Book, confirm, and check-in instantly. Perfect for salons, gyms, sports facilities, classes, and events.',
    image: '/bookingmodule.webp',
    category: 'booking',
  },
  {
    id: 'interactive-menu',
    name: 'Interactive Menu',
    description: 'A beautiful digital menu built for upsells. Change prices, add items, and run promos in seconds.',
    image: '/interactivemenu.webp',
    category: 'ordering',
  },
  {
    id: 'queue-display',
    name: 'Queue Display System (QDS)',
    description: 'Real-time queue visibility for customers. Reduce frustration and increase operational flow.',
    image: '/queuedisplayssytem.webp',
    category: 'operations',
  },
  {
    id: 'ereceipt',
    name: 'Digital eReceipt',
    description: 'Email / WhatsApp receipts instantly. Cleaner records, lower printing cost, better customer experience.',
    image: '/digitalereceipt.webp',
    category: 'operations',
  },
  {
    id: 'kitchen-display',
    name: 'Kitchen Display System (KDS)',
    description: 'Make your kitchen run like a machine. Orders appear instantly, reducing errors and speeding up prep.',
    image: '/kitchendisplayssytem.webp',
    category: 'operations',
  },
  {
    id: 'stampcard',
    name: 'Digital Stampcard',
    description: 'Reward loyalty without physical cards. Each visit auto-stamps — driving repeat business effortlessly.',
    image: '/digitalstampcard.webp',
    category: 'loyalty',
  },
];

export const powerups = [
  {
    title: 'Fully Integrated',
    description: 'All modules work seamlessly together without messy setups or complicated connections.',
  },
  {
    title: 'Built to Scale',
    description: 'Add modules as you grow. Start with one, expand to all — no limits.',
  },
  {
    title: 'Cloud-Powered',
    description: 'Update instantly from QHub. Changes reflect across all devices in real-time.',
  },
  {
    title: 'Save Time',
    description: 'Automate operations that used to take hours. Focus on growing your business.',
  },
  {
    title: 'Boost Results',
    description: 'Each module is designed to increase revenue, reduce costs, or improve experience.',
  },
  {
    title: 'Zero Hassle',
    description: 'No complex training needed. Intuitive interfaces that work from day one.',
  },
];
