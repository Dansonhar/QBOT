import SEOHead from '../../components/SEOHead';
import ModulePageLayout from '../../components/ModulePageLayout';
import { Layers, CheckCircle, Building2, ArrowRight, Volume2, Monitor, TabletSmartphone, ListOrdered, Tv } from 'lucide-react';

export default function KitchenDisplayPage() {
  return (
    <>
      <SEOHead
        title="Kitchen Display System Malaysia — KDS for Restaurants | QPOS"
        description="Replace paper dockets with a digital kitchen display. Orders land instantly from counter, kiosk, QR and online. Multi-station routing, colour-coded priorities, prep-time tracked."
        keywords="kitchen display system Malaysia, KDS Malaysia, restaurant KDS, digital docket Malaysia, paperless kitchen, multi-station KDS, cafe KDS, food prep display, QPOS kitchen display"
        url="https://qbot.now/products/kitchen-display"
      />
    <ModulePageLayout
      category="Operate"
      moduleName="Kitchen Display"
      headline="ORDERS IN. FOOD OUT. NO TICKETS."
      subtitle="Every order from every channel — on one screen, in real time. No paper tickets, no missed orders."
      ctaText="DITCH THE PAPER"
      heroImage="/qpos-keyvisuals/hero-kds.webp"
      features={[
        {
          icon: Layers,
          title: 'Round-by-Round Display',
          description: 'Kitchen sees orders broken into rounds. Appetizers fire first, mains come next. Prep stays organized.',
        },
        {
          icon: CheckCircle,
          title: 'Track Every Item',
          description: "Not just 'Order #47 is ready' — track each individual item. Know exactly what's done and what's still cooking.",
        },
        {
          icon: Building2,
          title: 'All Outlets, One Screen',
          description: 'Managing multiple locations? View orders from any or all outlets in a single display.',
        },
        {
          icon: ArrowRight,
          title: 'Clear Status Flow',
          description: "Every order moves through: preparing \u2192 ready \u2192 collected \u2192 cancelled. Kitchen always knows what's next.",
        },
        {
          icon: Volume2,
          title: 'Audio Alerts',
          description: 'New order comes in? Kitchen hears it immediately. No more checking the screen every 30 seconds.',
        },
      ]}
      useCase={{
        title: 'Perfect For',
        description: 'Any kitchen that receives orders from multiple channels. Replace paper chaos with digital clarity. Reduce errors, speed up service.',
        industries: ['Restaurants', 'Fast Food', 'Cloud Kitchens', 'Food Courts', 'Hotels'],
      }}
      hardware={[
        {
          name: 'cPad 11"',
          description: 'Compact kitchen display for smaller kitchens and single-station setups.',
          bullets: ['11" FHD 1920×1200', 'IP54 splash resistant', 'Wall or counter mount'],
          image: '/qpos-keyvisuals/hardwares/cpad-11in.webp',
          specs: [
            { label: 'OS', value: 'SUNMI OS 4.0 (Android 14)' },
            { label: 'CPU', value: 'Octa-core / Hexa-core\nup to 2.4GHz' },
            { label: 'Memory', value: '3GB RAM + 32GB ROM\n(up to 8GB + 128GB)' },
            { label: 'Display', value: '11" WUXGA 1920×1200 IPS\nCapacitive multi-touch' },
            { label: 'Battery', value: '3.87V / 8000mAh' },
            { label: 'Wi-Fi', value: 'Wi-Fi 6 (802.11ax)\n2×2 MIMO' },
            { label: 'Bluetooth', value: 'Bluetooth 5.3, BLE' },
            { label: 'Protection', value: 'IP54' },
            { label: 'Dimensions', value: '256.1 × 168.2 × 10.1mm' },
            { label: 'Weight', value: '526g' },
            { label: 'Environment', value: 'Operating: -10°C ~ 50°C\nStorage: -20°C ~ 60°C' },
          ],
        },
        {
          name: 'cPad 14"',
          description: 'Large kitchen display for busy multi-station kitchens.',
          bullets: ['14" HD display', 'Easy to read from distance', 'IP54 rated'],
          image: '/qpos-keyvisuals/hardwares/cpad-14in.webp',
          specs: [
            { label: 'OS', value: 'SUNMI OS 4.0 (Android 14)' },
            { label: 'CPU', value: 'Octa-core / Hexa-core\nup to 2.4GHz' },
            { label: 'Memory', value: '3GB RAM + 32GB ROM\n(up to 8GB + 128GB)' },
            { label: 'Display', value: '11" WUXGA 1920×1200 IPS\nCapacitive multi-touch' },
            { label: 'Battery', value: '3.87V / 8000mAh' },
            { label: 'Wi-Fi', value: 'Wi-Fi 6 (802.11ax)\n2×2 MIMO' },
            { label: 'Bluetooth', value: 'Bluetooth 5.3, BLE' },
            { label: 'Protection', value: 'IP54' },
            { label: 'Dimensions', value: '256.1 × 168.2 × 10.1mm' },
            { label: 'Weight', value: '526g' },
            { label: 'Environment', value: 'Operating: -10°C ~ 50°C\nStorage: -20°C ~ 60°C' },
          ],
        },
      ]}
      screenshots={[
        { label: 'Kitchen display with live orders', aspect: 'video', image: '/context_img/kds01_display.webp' },
        { label: 'Multi-station view', aspect: 'video', image: '/context_img/kds0102_multi_stations_view.webp' },
        { label: 'Order detail with modifiers', aspect: 'video' },
      ]}
      crossLinks={[
        { name: 'POS', description: 'Counter point of sale', path: '/products/pos', icon: Monitor },
        { name: 'Kiosk', description: 'Self-service ordering', path: '/products/kiosk', icon: TabletSmartphone },
        { name: 'QMS Control', description: 'Queue management system', path: '/products/qms', icon: ListOrdered },
        { name: 'Live Display', description: 'Customer-facing screens', path: '/products/live-display', icon: Tv },
      ]}
      faqs={[
        { question: 'What screen do I need?', answer: 'Any TV or monitor with a browser. We recommend a dedicated Android display for best performance.' },
        { question: 'Does it show which channel the order came from?', answer: 'Yes. Each order is tagged with its source — POS, kiosk, QR, webstore.' },
        { question: 'Can I customize the stations?', answer: 'Yes. Create stations (Grill, Bar, Dessert) and assign menu items to each.' },
        { question: 'What if the screen goes down?', answer: 'Fallback to kitchen printer. Orders print automatically if the display disconnects.' },
      ]}
    />
    </>
  );
}
