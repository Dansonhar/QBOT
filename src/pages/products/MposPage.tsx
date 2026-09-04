import SEOHead from '../../components/SEOHead';
import ModulePageLayout from '../../components/ModulePageLayout';
import {
  Smartphone,
  Utensils,
  LayoutGrid,
  Bell,
  Wifi,
  Sparkles,
  Monitor,
  BarChart3,
  QrCode,
} from 'lucide-react';

export default function MposPage() {
  return (
    <>
      <SEOHead
        title="Mobile POS Malaysia — Handheld mPOS for Tableside | QPOS"
        description="Handheld mobile POS for tableside ordering, pop-up events, and outdoor counters. Fire orders to kitchen instantly. Full-shift battery, built-in printer, any payment method."
        keywords="mobile POS Malaysia, mPOS Malaysia, handheld POS Malaysia, tableside POS, portable POS, pop-up POS Malaysia, event POS, restaurant mPOS, SUNMI V3 mPOS, QPOS mobile"
        url="https://qbot.now/products/mpos"
      />
    <ModulePageLayout
      category="Sell"
      moduleName="mPOS"
      headline="TAKE ORDERS ANYWHERE."
      subtitle="Same system, handheld. Take orders anywhere in the store — floor, queue, outdoor seating. Orders fire to kitchen instantly."
      ctaText="FREE YOUR STAFF"
      heroImage="/qpos-keyvisuals/hero-mpos.webp"
      features={[
        {
          icon: Smartphone,
          title: 'Built for Handheld',
          description:
            'Compact layout designed for one-hand use. Not a shrunken desktop screen — actually built for mobile.',
        },
        {
          icon: Utensils,
          title: 'Floor Ordering',
          description:
            'Walk to the table, take the order, it\'s in the kitchen before you walk back. No paper, no shouting.',
        },
        {
          icon: LayoutGrid,
          title: 'Quick View Toggle',
          description:
            'Switch between list and grid depending on how fast you need to move. Busy lunch? Use list mode.',
        },
        {
          icon: Bell,
          title: 'Live Notifications',
          description:
            'Get instant alerts when kitchen marks an order ready or a new order comes in from Kiosk or QR.',
        },
        {
          icon: Wifi,
          title: 'Sync Monitor',
          description:
            'Green dot means you\'re connected. If anything drops, you\'ll know immediately — not after 10 lost orders.',
        },
        {
          icon: Sparkles,
          title: 'Guided Sales',
          description:
            '★ Sales Boosters prompt your staff automatically — \'suggest the new latte,\' \'offer the combo upgrade,\' \'mention the dessert promo.\' Staff don\'t need to remember what to push.',
        },
      ]}
      useCase={{
        title: 'Perfect For',
        description:
          'Tableside dining, pop-ups, food trucks, outdoor markets — anywhere your staff needs to move while staying connected to the system.',
        industries: ['Tableside Dining', 'Pop-Up Events', 'Food Trucks', 'Outdoor Markets', 'Catering', 'Theme Parks'],
      }}
      hardware={[
        {
          name: 'cPad 8.7"',
          description: 'Compact handheld tablet for mobile ordering in tight spaces.',
          bullets: ['8.7" touchscreen', 'Lightweight 526g', 'IP54 rated'],
          image: '/qpos-keyvisuals/hardwares/cpad-8in.webp',
          specs: [
            { label: 'OS', value: 'SUNMI OS 4.0 (Android 14)\n*Supports version upgrade' },
            { label: 'CPU', value: 'Octa-core / Hexa-core\nup to 2.4GHz' },
            { label: 'Memory', value: '3GB RAM + 32GB ROM\n(up to 8GB + 128GB)\nMicroSD up to 256GB' },
            { label: 'Display', value: '11" WUXGA 1920×1200 IPS\nCapacitive multi-touch\nAnti-fingerprint coating' },
            { label: 'Battery', value: 'Non-removable lithium polymer\n3.87V / 8000mAh' },
            { label: 'Wi-Fi', value: '6GHz/5GHz/2.4GHz\nWi-Fi 6 (802.11ax)\n2×2 MIMO' },
            { label: 'Bluetooth', value: 'Bluetooth 5.3, BLE' },
            { label: 'Cameras', value: '5MP FF front\n8MP AF rear (or 13MP)' },
            { label: 'Scanner', value: '2D scan engine (optional)' },
            { label: 'NFC', value: 'Optional, SoftPOS\nEMVCo PCD L1 compliant' },
            { label: 'Positioning', value: 'GPS / Glonass / Beidou / Galileo' },
            { label: 'Ports', value: '2× Type-C\n6× Pogo PIN (bottom)\n8× Pogo PIN (back)' },
            { label: 'Protection', value: 'IP54' },
            { label: 'Dimensions', value: '256.1 × 168.2 × 10.1mm' },
            { label: 'Weight', value: '526g' },
            { label: 'Environment', value: 'Operating: -10°C ~ 50°C\nStorage: -20°C ~ 60°C' },
          ],
        },
        {
          name: 'cPad 11"',
          description: 'Mid-size tablet for comfortable tableside and queue ordering.',
          bullets: ['11" FHD display 1920×1200', 'Wi-Fi 6 + Bluetooth 5.3', '8000mAh all-day battery'],
          image: '/qpos-keyvisuals/hardwares/cpad-11in.webp',
          specs: [
            { label: 'OS', value: 'SUNMI OS 4.0 (Android 14)\n*Supports version upgrade' },
            { label: 'CPU', value: 'Octa-core / Hexa-core\nup to 2.4GHz' },
            { label: 'Memory', value: '3GB RAM + 32GB ROM\n(up to 8GB + 128GB)\nMicroSD up to 256GB' },
            { label: 'Display', value: '11" WUXGA 1920×1200 IPS\nCapacitive multi-touch\nAnti-fingerprint coating' },
            { label: 'Battery', value: 'Non-removable lithium polymer\n3.87V / 8000mAh' },
            { label: 'Wi-Fi', value: '6GHz/5GHz/2.4GHz\nWi-Fi 6 (802.11ax)\n2×2 MIMO' },
            { label: 'Bluetooth', value: 'Bluetooth 5.3, BLE' },
            { label: 'Cameras', value: '5MP FF front\n8MP AF rear (or 13MP)' },
            { label: 'Scanner', value: '2D scan engine (optional)' },
            { label: 'NFC', value: 'Optional, SoftPOS\nEMVCo PCD L1 compliant' },
            { label: 'Positioning', value: 'GPS / Glonass / Beidou / Galileo' },
            { label: 'Ports', value: '2× Type-C\n6× Pogo PIN (bottom)\n8× Pogo PIN (back)' },
            { label: 'Protection', value: 'IP54' },
            { label: 'Dimensions', value: '256.1 × 168.2 × 10.1mm' },
            { label: 'Weight', value: '526g' },
            { label: 'Environment', value: 'Operating: -10°C ~ 50°C\nStorage: -20°C ~ 60°C' },
          ],
        },
        {
          name: 'cPad 14"',
          description: 'Large-screen mobile terminal for detailed menu browsing.',
          bullets: ['14" HD display', 'Dual-use: handheld or mounted', 'Optional 2D scanner + NFC'],
          image: '/qpos-keyvisuals/hardwares/cpad-14in.webp',
          specs: [
            { label: 'OS', value: 'SUNMI OS 4.0 (Android 14)\n*Supports version upgrade' },
            { label: 'CPU', value: 'Octa-core / Hexa-core\nup to 2.4GHz' },
            { label: 'Memory', value: '3GB RAM + 32GB ROM\n(up to 8GB + 128GB)\nMicroSD up to 256GB' },
            { label: 'Display', value: '11" WUXGA 1920×1200 IPS\nCapacitive multi-touch\nAnti-fingerprint coating' },
            { label: 'Battery', value: 'Non-removable lithium polymer\n3.87V / 8000mAh' },
            { label: 'Wi-Fi', value: '6GHz/5GHz/2.4GHz\nWi-Fi 6 (802.11ax)\n2×2 MIMO' },
            { label: 'Bluetooth', value: 'Bluetooth 5.3, BLE' },
            { label: 'Cameras', value: '5MP FF front\n13MP AF rear' },
            { label: 'Scanner', value: '2D scan engine (optional)' },
            { label: 'NFC', value: 'Optional, SoftPOS\nEMVCo PCD L1 compliant' },
            { label: 'Positioning', value: 'GPS / Glonass / Beidou / Galileo' },
            { label: 'Ports', value: '2× Type-C\n6× Pogo PIN (bottom)\n8× Pogo PIN (back)' },
            { label: 'Protection', value: 'IP54' },
            { label: 'Dimensions', value: '256.1 × 168.2 × 10.1mm' },
            { label: 'Weight', value: '526g' },
            { label: 'Environment', value: 'Operating: -10°C ~ 50°C\nStorage: -20°C ~ 60°C' },
          ],
        },
      ]}
      screenshots={[
        { label: 'mPOS tableside ordering', aspect: 'video', image: '/context_img/mpos01_table_side_ordering.webp' },
        { label: 'Mobile payment screen', aspect: 'video', image: '/context_img/mpos02_mobile_payment.webp' },
        { label: 'Queue management view', aspect: 'video', image: '/context_img/mpos03_queue.webp' },
      ]}
      crossLinks={[
        {
          name: 'POS',
          description: 'The full counter POS experience.',
          path: '/products/pos',
          icon: Monitor,
        },
        {
          name: 'Kitchen Display',
          description: 'Send orders straight to the kitchen screen.',
          path: '/products/kitchen-display',
          icon: Utensils,
        },
        {
          name: 'QHub',
          description: 'Manage everything from one dashboard.',
          path: '/products/qhub',
          icon: BarChart3,
        },
        {
          name: 'QR Order',
          description: 'QR code ordering from customer phones.',
          path: '/products/qr-order',
          icon: QrCode,
        },
      ]}
      faqs={[
        {
          question: 'Is it the same device as the POS?',
          answer:
            'Yes. Same device, just pick it up. Switch between counter and mobile mode anytime.',
        },
        {
          question: 'Does it need internet?',
          answer:
            'Best with WiFi. Works offline for basic operations and syncs when reconnected.',
        },
        {
          question: 'Can multiple staff use mPOS?',
          answer:
            'Yes. Each staff member can have their own device, all synced to one system.',
        },
        {
          question: 'What about security?',
          answer:
            'Staff PIN login, role-based permissions. Managers control who can void, discount, or refund.',
        },
      ]}
    />
    </>
  );
}
