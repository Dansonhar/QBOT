import SEOHead from '../../components/SEOHead';
import ModulePageLayout from '../../components/ModulePageLayout';
import {
  DollarSign,
  UserX,
  RefreshCw,
  Zap,
  Sparkles,
  Utensils,
  Monitor,
  Tv,
  Heart,
} from 'lucide-react';

export default function ScanToOrderPage() {
  return (
    <>
      <SEOHead
        title="Scan-to-Order Malaysia — QR Menu & Phone Ordering | QPOS"
        description="Customers scan a QR code, browse your menu, order and pay from their phone. No app install, no extra hardware. Works for dine-in, takeaway, and hotel room service."
        keywords="scan to order Malaysia, QR code menu Malaysia, QR ordering, contactless ordering, scan to pay, restaurant QR ordering, cafe QR menu, QPOS scan order"
        url="https://qbot.now/products/scan-to-order"
      />
    <ModulePageLayout
      category="Sell"
      moduleName="Scan-to-Order"
      headline="SCAN. ORDER. DONE."
      subtitle="Customers scan a QR code with their own phone. Menu opens. They order and pay. No app download, no extra hardware."
      ctaText="GO QR TODAY"
      heroImage="/qpos-keyvisuals/hero-qrorder.webp"
      features={[
        {
          icon: DollarSign,
          title: 'Zero Hardware Cost',
          description:
            "The customer's phone IS the ordering device. You print a QR code. That's it.",
        },
        {
          icon: UserX,
          title: 'No Sign-Up Required',
          description:
            'Anonymous ordering supported. Customers scan and order without creating an account.',
        },
        {
          icon: RefreshCw,
          title: 'Reorder Without Rescanning',
          description:
            'Session stays open. Customers can add more items across multiple rounds from the same QR scan.',
        },
        {
          icon: Zap,
          title: 'Instant Kitchen Sync',
          description:
            'The moment a customer submits an order, it appears on POS and Kitchen Display. No delay.',
        },
        {
          icon: Sparkles,
          title: 'Vouchers & Sales Boosters',
          description:
            '★ Customers apply vouchers, see upsell prompts, unlock spend-threshold rewards, and get combo suggestions — all from their own phone. Same Sales Boosters engine as Kiosk and Webstore.',
        },
      ]}
      useCase={{
        title: 'Perfect For',
        description:
          'The cheapest way to go multi-channel. One QR code per table. Customers do the work. Staff focuses on what matters.',
        industries: ['Cafes', 'Mamak Shops', 'Food Courts', 'Pubs & Bars', 'Hawker Stalls', 'Restaurants'],
      }}
      screenshots={[
        { label: 'QR scan on phone', aspect: 'video', image: '/context_img/qr01_scan.webp' },
        { label: 'Mobile menu browsing', aspect: 'video', image: '/context_img/qr02_menu.webp' },
        { label: 'Order confirmation', aspect: 'video', image: '/context_img/qr03_order_summary.webp' },
      ]}
      crossLinks={[
        {
          name: 'Kitchen Display',
          description: 'Send orders straight to the kitchen screen.',
          path: '/products/kitchen-display',
          icon: Utensils,
        },
        {
          name: 'POS',
          description: 'The full counter POS experience.',
          path: '/products/pos',
          icon: Monitor,
        },
        {
          name: 'Live Display',
          description: 'Show order status on customer-facing screens.',
          path: '/products/live-display',
          icon: Tv,
        },
        {
          name: 'Loyalty',
          description: 'Reward repeat customers automatically.',
          path: '/products/loyalty',
          icon: Heart,
        },
      ]}
      faqs={[
        {
          question: 'Do customers need to download an app?',
          answer:
            'No. Everything runs in the browser. Scan, browse, order, pay.',
        },
        {
          question: 'How do I create QR codes?',
          answer:
            'QHub generates unique QR codes for each table. Print them and place on tables.',
        },
        {
          question: "What if the customer doesn't have data?",
          answer:
            'Works on WiFi too. Provide free WiFi and customers scan and order.',
        },
        {
          question: 'Can customers pay via QR?',
          answer:
            'Yes. Card payments, e-wallet, and online banking all supported.',
        },
      ]}
    />
    </>
  );
}
