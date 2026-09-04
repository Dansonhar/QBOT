import SEOHead from '../../components/SEOHead';
import ModulePageLayout from '../../components/ModulePageLayout';
import {
  Clock,
  Shield,
  PauseCircle,
  LayoutGrid,
  Monitor,
  Sparkles,
  Utensils,
  Smartphone,
  BarChart3,
  TrendingUp,
  ScanLine,
  ListOrdered,
  CalendarCheck,
  Ticket,
} from 'lucide-react';

export default function PosPage() {
  return (
    <>
      <SEOHead
        title="Counter POS System Malaysia — Fast Checkout & Shift Control | QPOS"
        description="Counter POS for Malaysian F&B and retail. Fast checkout, multi-payment split (card/QR/e-wallet/cash), shift management, and live order flow — standalone or as part of QPOS."
        keywords="counter POS Malaysia, cashier POS Malaysia, point of sale Malaysia, POS terminal, restaurant POS, cafe POS, retail checkout Malaysia, fast checkout POS, shift management POS, multi-payment POS, QPOS counter"
        url="https://qbot.now/products/pos"
      />
    <ModulePageLayout
      category="Sell"
      moduleName="POS"
      headline="YOUR COUNTER. UNLEASHED."
      subtitle="Full register system. Fast checkout, smart order flow, and every sale tracked from open to close."
      ctaText="START SELLING SMARTER"
      heroImage="/qpos-keyvisuals/hero-qpos.webp"
      features={[
        {
          icon: Clock,
          title: 'Shift Management',
          description:
            'Staff clocks in, counts the drawer, runs the shift, counts out. End-of-day report prints automatically.',
        },
        {
          icon: Shield,
          title: 'Manager Override',
          description:
            'Discounts, voids, and refunds need a manager PIN. You stay in control even when you\'re not there.',
        },
        {
          icon: PauseCircle,
          title: 'Parked Orders',
          description:
            'Customer forgot their wallet? Park the order, serve the next person, come back to it later. Nothing lost.',
        },
        {
          icon: LayoutGrid,
          title: 'Table Management',
          description:
            'Assign tables, send rounds to kitchen in sequence — appetizer first, mains after. Proper dine-in flow.',
        },
        {
          icon: Monitor,
          title: 'Customer Display',
          description:
            'Second screen faces the customer. They see every item and the running total. Builds trust, reduces disputes.',
        },
        {
          icon: Sparkles,
          title: 'Guided Sales',
          description:
            '★ Sales Boosters appear on screen during checkout — prompting staff to suggest add-ons, mention promos, or offer upgrades. Your team sells more without memorizing anything.',
        },
        {
          icon: ScanLine,
          title: 'Scanner',
          description:
            'Scan barcodes and QR codes directly from the POS. Product lookup, payment codes, voucher redemption — one scan and it\'s done.',
        },
        {
          icon: ListOrdered,
          title: 'Queue Control',
          description:
            'Issue queue numbers, call the next customer, and display the queue on screen. No more shouting names or losing track of who\'s next.',
        },
        {
          icon: CalendarCheck,
          title: 'Bookings',
          description:
            'Accept and manage reservations right from the POS. View upcoming bookings, check availability, and seat customers when they arrive.',
        },
        {
          icon: Ticket,
          title: 'Ticketing',
          description:
            'Issue numbered tickets for orders or services. Track ticket status, mark as completed, and keep everything moving in order.',
        },
      ]}
      useCase={{
        title: 'Perfect For',
        description:
          "Whether you're running a busy mamak, a cafe, or a retail shop — POS handles the volume. Fast checkout, accurate orders, happy customers.",
        industries: ['Restaurants', 'Cafes', 'Mamak Shops', 'Retail', 'Food Courts', 'Bakeries'],
      }}
      hardware={[
        {
          name: 'D3 Pro',
          description: 'Premium all-in-one POS terminal with built-in printer and dual display.',
          bullets: ['15.6" FHD touchscreen', 'Built-in 80mm thermal printer', 'Optional 10.1" customer display'],
          image: '/qpos-keyvisuals/hardwares/d3pro.webp',
          specs: [
            { label: 'Product Model', value: 'F3510' },
            { label: 'OS', value: 'SUNMI OS (Android 13)\n*Supports version upgrade' },
            { label: 'Processor', value: 'Qualcomm hexa-core, up to 2.4GHz' },
            { label: 'Memory', value: '4GB RAM + 64GB ROM' },
            { label: 'Display', value: '15.6" FHD 1920×1080\n10-point capacitive touch' },
            { label: 'Printer', value: 'Built-in 80mm thermal printer\nAuto cutter, 250mm/s' },
            { label: 'Wi-Fi', value: '2.4GHz & 5GHz\nIEEE 802.11 a/b/g/n/ac' },
            { label: 'Bluetooth', value: 'BT 5.0, BLE supported' },
            { label: 'Ethernet', value: '1000M LAN' },
            { label: 'Ports', value: '1× USB 3.0 Type-A\n2× USB 2.0 Type-A\n1× USB Type-C 2.0\n1× RJ11 serial\n1× RJ12 cash drawer\n1× RJ45 LAN\n1× Audio jack' },
            { label: 'Speaker', value: '1 × 3W' },
            { label: 'Power Adapter', value: 'Input: AC 100~240V\nOutput: DC 24V/1.5A/36W' },
            { label: 'Dimensions', value: '380 × 195 × 310mm' },
            { label: 'Weight', value: 'D3 Pro: 4.5kg\n10.1" monitor: 0.88kg' },
            { label: 'Environment', value: 'Operating: 0°C ~ 40°C\nStorage: -20°C ~ 60°C' },
          ],
        },
        {
          name: 'V3 Mix',
          description: 'Versatile 10.1" countertop terminal with built-in printer and battery.',
          bullets: ['10.1" HD IPS touchscreen', 'Built-in 58mm thermal printer', 'Removable battery, 2600mAh'],
          image: '/qpos-keyvisuals/hardwares/v3mix.webp',
          specs: [
            { label: 'Product Model', value: 'T5701' },
            { label: 'OS', value: 'SUNMI OS 4.0 (Android 13)\n*Supports version upgrade' },
            { label: 'Processor', value: 'Qualcomm hexa-core\n2.4/1.9GHz' },
            { label: 'Memory', value: '4GB RAM + 32GB ROM' },
            { label: 'Display', value: '10.1" HD 1280×800 IPS' },
            { label: 'Printer', value: 'Thermal printer\n70mm/s\n58mm / 40mm paper' },
            { label: 'Camera', value: 'Front 2MP FF\n0.3MP FF for QR payment' },
            { label: 'Scanner', value: '2D professional scanner' },
            { label: 'Wi-Fi', value: '2.4GHz/5GHz\nIEEE 802.11 a/b/g/n/ac' },
            { label: 'Bluetooth', value: 'BT2.1/3.0/4.2, BLE' },
            { label: 'Battery', value: 'Removable lithium\n7.2V / 2600mAh' },
            { label: 'NFC Reader', value: 'Type A&B, Mifare, FeLica\nISO/IEC 14443 & 15693' },
            { label: 'SIM Card Slot', value: 'Dual Nano SIM\n3.0V/1.8V' },
            { label: 'GPS', value: 'GPS, AGPS' },
            { label: 'Fingerprint', value: 'For login' },
            { label: 'Dimensions', value: '246 × 231 × 73mm' },
            { label: 'Weight', value: '670g' },
            { label: 'Power Adapter', value: 'Input: AC100-240V\nOutput: 5V/2A' },
            { label: 'Cradle (Optional)', value: 'Charging, 3× USB-A\nRJ11, RJ45' },
            { label: 'Customer Display', value: 'Optional USB GFD\n6.7" touchscreen' },
            { label: 'Environment', value: 'Operating: 0°C ~ 45°C\nStorage: -20°C ~ 60°C' },
          ],
        },
      ]}
      screenshots={[
        { label: 'POS main register screen', aspect: 'video', image: '/context_img/pos01_product.webp' },
        { label: 'Menu management dashboard', aspect: 'video', image: '/context_img/pos03_menu.webp' },
        { label: 'End-of-day report', aspect: 'video', image: '/context_img/pos05_report.webp' },
      ]}
      crossLinks={[
        {
          name: 'Kitchen Display',
          description: 'Send orders straight to the kitchen screen.',
          path: '/products/kitchen-display',
          icon: Utensils,
        },
        {
          name: 'mPOS',
          description: 'Take orders tableside with a handheld device.',
          path: '/products/mpos',
          icon: Smartphone,
        },
        {
          name: 'QHub',
          description: 'Manage everything from one dashboard.',
          path: '/products/qhub',
          icon: BarChart3,
        },
        {
          name: 'Sales Boosters',
          description: 'Upsell, bundle, and increase average order value.',
          path: '/products/sales-boosters',
          icon: TrendingUp,
        },
      ]}
      faqs={[
        {
          question: 'What hardware do I need?',
          answer:
            'QPOS runs on Android-based touchscreen terminals. We supply pre-configured devices optimized for QPOS.',
        },
        {
          question: 'Can I customize the menu layout?',
          answer:
            'Yes. Organize by categories, add images, set modifiers, variants, and pricing per outlet — all from QHub.',
        },
        {
          question: 'Does it work offline?',
          answer:
            'Basic POS operations work offline. Data syncs automatically when connection returns.',
        },
        {
          question: 'How do I handle refunds?',
          answer:
            'Manager-approved voids and refunds with full audit trail. Every action is logged.',
        },
        {
          question: 'What payment methods are supported?',
          answer:
            'Cash, cards, e-wallets (TNG, Boost, GrabPay, ShopeePay), FPX, and vouchers.',
        },
      ]}
    />
    </>
  );
}
