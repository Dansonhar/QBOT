import SEOHead from '../../components/SEOHead';
import ModulePageLayout from '../../components/ModulePageLayout';
import {
  Layers,
  Utensils,
  Bell,
  Receipt,
  LayoutGrid,
  Sparkles,
  Monitor,
  BarChart3,
  TrendingUp,
} from 'lucide-react';

export default function TabletPage() {
  return (
    <>
      <SEOHead
        title="Tablet POS & Digital Menu Malaysia — Table-Side Ordering | QPOS"
        description="Turn any tablet into a table-side ordering station. Customers browse, customise, and order direct to kitchen — no waiter wait. Works on Android tablets and iPads."
        keywords="tablet POS Malaysia, table-side ordering Malaysia, digital menu tablet, restaurant tablet ordering, iPad menu Malaysia, Android menu tablet, self-order tablet, QPOS tablet"
        url="https://qbot.now/products/tablet"
      />
    <ModulePageLayout
      category="Sell"
      moduleName="Tablet"
      headline="TABLE SERVICE. WITHOUT THE WAIT."
      subtitle="Tablets at the table. Customers browse the menu, customize their order, and send it to the kitchen — no waiting for staff."
      ctaText="UPGRADE TABLE SERVICE"
      heroImage="/qpos-keyvisuals/hero-tableside.webp"
      features={[
        {
          icon: Layers,
          title: 'Multi-Round Ordering',
          description:
            'Appetizers first, mains later, dessert after. Customers order in rounds, just like a proper restaurant experience.',
        },
        {
          icon: Utensils,
          title: 'Straight to Kitchen',
          description:
            'Orders fire directly to the Kitchen Display with table number and round info. No middleman.',
        },
        {
          icon: Bell,
          title: 'Service Bell',
          description:
            'Need a napkin? Want the bill? One tap calls staff to the table. No awkward hand-waving.',
        },
        {
          icon: Receipt,
          title: 'Bill Request',
          description:
            "Customer taps 'Get Bill' — your staff gets notified instantly. Faster table turnover.",
        },
        {
          icon: LayoutGrid,
          title: 'Multiple Views',
          description:
            'Switch between tile, list, or presentation mode depending on the dining experience you want to create.',
        },
        {
          icon: Sparkles,
          title: 'Sales Boosters at the Table',
          description:
            '★ Upsell suggestions, combo prompts, and limited-time badges appear while customers browse. They see the offer, they add it themselves — no staff needed to pitch.',
        },
      ]}
      useCase={{
        title: 'Perfect For',
        description:
          'Restaurants, lounges, hotel dining — anywhere table service should feel premium without the staff overhead.',
        industries: ['Fine Dining', 'Japanese Restaurants', 'Korean BBQ', 'Hotel Dining', 'Lounges'],
      }}
      hardware={[
        {
          name: 'cPad 8.7"',
          description: 'Compact table tablet for quick-service and casual dining.',
          bullets: ['8.7" touchscreen', 'IP54 rated, 526g', '8000mAh battery'],
          image: '/qpos-keyvisuals/hardwares/cpad-8in.webp',
          specs: [
            { label: 'OS', value: 'SUNMI OS 4.0 (Android 14)\n*Supports version upgrade' },
            { label: 'CPU', value: 'Octa-core / Hexa-core\nup to 2.4GHz' },
            { label: 'Memory', value: '3GB RAM + 32GB ROM\n(up to 8GB + 128GB)\nMicroSD up to 256GB' },
            { label: 'Display', value: '11" WUXGA 1920×1200 IPS\nCapacitive multi-touch' },
            { label: 'Battery', value: 'Non-removable lithium polymer\n3.87V / 8000mAh' },
            { label: 'Wi-Fi', value: 'Wi-Fi 6 (802.11ax)\n2×2 MIMO' },
            { label: 'Bluetooth', value: 'Bluetooth 5.3, BLE' },
            { label: 'Cameras', value: '5MP FF front\n8MP AF rear' },
            { label: 'Protection', value: 'IP54' },
            { label: 'Dimensions', value: '256.1 × 168.2 × 10.1mm' },
            { label: 'Weight', value: '526g' },
            { label: 'Environment', value: 'Operating: -10°C ~ 50°C\nStorage: -20°C ~ 60°C' },
          ],
        },
        {
          name: 'cPad 11"',
          description: 'Mid-size tablet for detailed menu browsing and upselling.',
          bullets: ['11" FHD 1920×1200', 'Wi-Fi 6 + Bluetooth 5.3', 'Optional desktop/table stand'],
          image: '/qpos-keyvisuals/hardwares/cpad-11in.webp',
          specs: [
            { label: 'OS', value: 'SUNMI OS 4.0 (Android 14)\n*Supports version upgrade' },
            { label: 'CPU', value: 'Octa-core / Hexa-core\nup to 2.4GHz' },
            { label: 'Memory', value: '3GB RAM + 32GB ROM\n(up to 8GB + 128GB)\nMicroSD up to 256GB' },
            { label: 'Display', value: '11" WUXGA 1920×1200 IPS\nCapacitive multi-touch' },
            { label: 'Battery', value: 'Non-removable lithium polymer\n3.87V / 8000mAh' },
            { label: 'Wi-Fi', value: 'Wi-Fi 6 (802.11ax)\n2×2 MIMO' },
            { label: 'Bluetooth', value: 'Bluetooth 5.3, BLE' },
            { label: 'Cameras', value: '5MP FF front\n8MP AF rear' },
            { label: 'Scanner', value: '2D scan engine (optional)' },
            { label: 'NFC', value: 'Optional, SoftPOS\nEMVCo PCD L1 compliant' },
            { label: 'Ports', value: '2× Type-C\n6× Pogo PIN (bottom)\n8× Pogo PIN (back)' },
            { label: 'Protection', value: 'IP54' },
            { label: 'Dimensions', value: '256.1 × 168.2 × 10.1mm' },
            { label: 'Weight', value: '526g' },
            { label: 'Environment', value: 'Operating: -10°C ~ 50°C\nStorage: -20°C ~ 60°C' },
          ],
        },
      ]}
      screenshots={[
        { label: 'Tablet menu interface', aspect: 'video', image: '/context_img/tab01_menu.webp' },
        { label: 'Service request panel', aspect: 'video', image: '/context_img/tab02_service.webp' },
        { label: 'Order summary', aspect: 'video', image: '/context_img/tab03_order_summary.webp' },
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
          question: 'What tablets are compatible?',
          answer:
            'QPOS tablet ordering runs on Android tablets. We supply pre-configured devices.',
        },
        {
          question: 'Can guests split the bill?',
          answer:
            'Yes. Digital bill splitting is built in — no math, no delays.',
        },
        {
          question: 'What about theft?',
          answer:
            'Tablets are table-mounted with secure holders and lockdown mode.',
        },
        {
          question: 'Do I need one tablet per table?',
          answer:
            'Yes, one per table for the best experience. Contact us for volume pricing.',
        },
      ]}
    />
    </>
  );
}
