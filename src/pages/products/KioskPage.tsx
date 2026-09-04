import SEOHead from '../../components/SEOHead';
import ModulePageLayout from '../../components/ModulePageLayout';
import {
  Sparkles,
  Heart,
  WifiOff,
  UserPlus,
  UtensilsCrossed,
  Utensils,
  Tv,
  TrendingUp,
} from 'lucide-react';

export default function KioskPage() {
  return (
    <>
      <SEOHead
        title="Self-Service Kiosk Malaysia — Order & Pay Kiosk for F&B | QPOS"
        description="Self-service ordering kiosks for restaurants, cafes, and quick-service F&B in Malaysia. Built-in upsells, loyalty signup, and multi-language UI. Shorter queues, higher tickets."
        keywords="self service kiosk Malaysia, ordering kiosk Malaysia, F&B kiosk Malaysia, restaurant kiosk, self checkout kiosk, self order terminal, Q1 kiosk, floor-standing kiosk, countertop kiosk, QPOS kiosk, McDonald's style kiosk Malaysia"
        url="https://qbot.now/products/kiosk"
      />
    <ModulePageLayout
      category="Sell"
      moduleName="Kiosk"
      headline="LET CUSTOMERS ORDER THEMSELVES."
      subtitle="Customers order and pay themselves. No queue, no miscommunication, no staff needed at the counter."
      ctaText="BOOST YOUR ORDERS"
      heroImage="/qpos-keyvisuals/hero-kiosk.webp"
      features={[
        {
          icon: Sparkles,
          title: 'Sales Boosters Built In',
          description:
            '★ Upsell prompts, combo suggestions, flash sale countdowns, spend-threshold nudges, and product badges — all configurable per item, time of day, or order value. Revenue goes up on every order without staff involvement.',
        },
        {
          icon: Heart,
          title: 'Loyalty at Checkout',
          description:
            'Customers see their tier progress, unlock rewards, and earn stamps right on the kiosk screen. Repeat visits start here.',
        },
        {
          icon: WifiOff,
          title: 'Works Offline',
          description:
            'Internet drops? Kiosk keeps taking orders. Everything syncs the moment connection returns.',
        },
        {
          icon: UserPlus,
          title: 'Member Sign-Up',
          description:
            'New customers can join your loyalty program during checkout. No separate app, no friction.',
        },
        {
          icon: UtensilsCrossed,
          title: 'Dine-In or Takeaway',
          description:
            'Customer picks their order type, selects a table if dining in, pays, and walks away. Fully self-service.',
        },
      ]}
      useCase={{
        title: 'Perfect For',
        description:
          "Any business with walk-in traffic. Customers spend 20-30% more when they order themselves — proven by McDonald's, now accessible to every business.",
        industries: ['Fast Food', 'Bubble Tea', 'Cinemas', 'Theme Parks', 'Gyms', 'Hotels', 'Food Courts'],
      }}
      hardware={[
        {
          name: 'K2 Mini 15.6"',
          description: 'Compact self-service kiosk. Wall-mount, desktop, or stand.',
          bullets: ['15.6" FHD multi-touch', 'Built-in printer with auto cutter', '3D camera for face recognition'],
          image: '/qpos-keyvisuals/hardwares/k2wallmount.webp',
          specs: [
            { label: 'OS', value: 'SUNMI OS (*based on Android)' },
            { label: 'CPU', value: 'Qualcomm Snapdragon Octa-core / Rockchip Quad-core' },
            { label: 'Memory', value: '16GB ROM + 2GB RAM\nMicroSD (TF) up to 64GB' },
            { label: 'Display', value: 'Portrait: 15.6" 1080×1920 FHD\nLandscape (optional): 15.6" 1920×1080 FHD\nMulti-touch' },
            { label: 'Camera', value: '3D structured light\nFace recognition payment\nMembership verification' },
            { label: 'Scanner', value: '1D, 2D\nMobile screen & printed barcodes' },
            { label: 'Printer', value: 'Thermal with auto cutter\n58/80mm paper roll\nUp to 250mm/s' },
            { label: 'NFC', value: '2nd gen ID card reading\nM1/ID/CPU card (optional)' },
            { label: 'Wi-Fi', value: '2.4GHz/5GHz\nIEEE 802.11 a/b/g/n/ac' },
            { label: 'Bluetooth', value: 'BT 2.1/3.0/4.0, BLE' },
            { label: 'Ethernet', value: '10/100M self-adaptive' },
            { label: 'Speaker', value: '1 × 3W' },
            { label: 'Ports', value: '5× USB Type-A\n1× RJ11 serial\n1× RJ12 cash drawer\n1× RJ45 LAN\n1× Audio jack\n1× Micro USB debug' },
            { label: 'Dimensions', value: 'Dual monitor: 380×280×590mm\nSingle: 300×250×590mm\nWall-mount: 265×120×680mm' },
            { label: 'Weight', value: 'Dual: 10.5kg\nSingle: 8kg\nWall-mount: 5kg' },
            { label: 'Power Adapter', value: 'Input: AC100~240V/1.7A\nOutput: DC24V/2.5A' },
            { label: 'Environment', value: 'Operating: 0°C ~ 40°C\nStorage: -20°C ~ 55°C' },
          ],
        },
        {
          name: 'K2 23.8"',
          description: 'Full-size floor-standing or wall-mounted kiosk for high-traffic areas.',
          bullets: ['23.8" FHD capacitive multi-touch', '3D facial recognition camera', 'Built-in 80mm printer with auto cutter'],
          image: '/qpos-keyvisuals/hardwares/k2stand.webp',
          specs: [
            { label: 'OS', value: 'SUNMI OS (Android 13 / 9 / 7)' },
            { label: 'Processor', value: 'Config 1: Qualcomm Kyro-670 octa-core up to 2.7GHz\nConfig 2/3: Hexa-core (A72+A53) 1.8GHz' },
            { label: 'Memory', value: 'Config 1: 6GB RAM + 128GB ROM\nConfig 2: 4GB + 32GB\nConfig 3: 4GB + 16GB' },
            { label: 'Display', value: '23.8" FHD 1920×1080\nCapacitive multi-touch' },
            { label: 'Camera', value: '3D facial recognition (optional)' },
            { label: 'Scanner', value: '1D/2D mobile & printed barcodes' },
            { label: 'Printer', value: '80mm thermal with auto cutter\n250mm/s\n58mm optional' },
            { label: 'NFC Reader', value: 'Mifare 1 (S50, S70)\nISO 14443A CPU card\nID card (Config 2/3)' },
            { label: 'Wi-Fi', value: 'Config 1: Wi-Fi 6 (802.11ax)\nConfig 2/3: 802.11 a/b/g/n' },
            { label: 'Bluetooth', value: 'BT 2.1/3.0/4.2 BLE' },
            { label: 'Ethernet', value: '100/1000M self-adaptive' },
            { label: 'Ports', value: '5× USB-A\n1× RJ45 LAN\n1× Audio jack\n1× Micro USB debug\n1× HDMI' },
            { label: 'Speaker', value: '2 × 3W' },
            { label: 'Dimensions', value: 'Wall-mount: 394×171×1017mm\nFloor + table: 1018×645×1850mm\nFloor: 540×490×1850mm' },
            { label: 'Weight', value: 'Wall-mount: 16.5kg\nFloor + table: 58kg\nFloor: 45kg' },
            { label: 'Power Adapter', value: 'Input: AC100~240V\nOutput: DC 12V/24V' },
            { label: 'Environment', value: 'Operating: 0°C ~ 40°C\nStorage: -20°C ~ 55°C' },
          ],
        },
        {
          name: 'Larger Screens',
          description: 'Looking for bigger displays? We have additional models available.',
          bullets: ['Custom sizes available', 'Floor-standing options', 'Contact us for details'],
        },
      ]}
      screenshots={[
        { label: 'Kiosk menu browsing', aspect: 'video', image: '/context_img/kiosk01_menu.webp' },
        { label: 'Payment screen', aspect: 'video', image: '/context_img/kiosk03_payment.webp' },
        { label: 'Order confirmation with queue number', aspect: 'video', image: '/context_img/kiosk05_order_queue.webp' },
      ]}
      crossLinks={[
        {
          name: 'Kitchen Display',
          description: 'Send orders straight to the kitchen screen.',
          path: '/products/kitchen-display',
          icon: Utensils,
        },
        {
          name: 'Live Display',
          description: 'Show order status on customer-facing screens.',
          path: '/products/live-display',
          icon: Tv,
        },
        {
          name: 'Sales Boosters',
          description: 'Upsell, bundle, and increase average order value.',
          path: '/products/sales-boosters',
          icon: TrendingUp,
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
          question: 'Does it actually increase sales?',
          answer:
            'Yes. Data shows customers spend 20-30% more at kiosks due to built-in Sales Boosters — upsell prompts, combo suggestions, and spend-threshold rewards.',
        },
        {
          question: 'What kiosk hardware do you offer?',
          answer:
            'Q1 Stand (RM5,300), Q1 Desktop (RM4,500), and Q1 Duo (RM6,800). All come with payment terminals.',
        },
        {
          question: 'Can customers pay with cash?',
          answer:
            'Our kiosks focus on cashless payments. Cards, e-wallets, and QR payments are supported.',
        },
        {
          question: 'How do I update the kiosk menu?',
          answer:
            'Through QHub. Update once, changes reflect on all kiosks instantly.',
        },
        {
          question: 'Can it work without internet?',
          answer:
            'Basic ordering works offline. Payment processing requires an internet connection.',
        },
      ]}
    />
    </>
  );
}
