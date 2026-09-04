import SEOHead from '../../components/SEOHead';
import ModulePageLayout from '../../components/ModulePageLayout';
import { UserPlus, Ticket, Tv, Clock, Settings, BarChart3, Monitor, Utensils } from 'lucide-react';

export default function QmsPage() {
  return (
    <>
      <SEOHead
        title="Queue Management System Malaysia — Smart QMS & Counter Display | QPOS"
        description="Digital queue management with auto ticketing, live wait-time estimates, counter assignment, and customer SMS/WhatsApp/Telegram notifications. Perfect for F&B, clinics, and retail counters."
        keywords="queue management Malaysia, QMS Malaysia, queue system Malaysia, smart queue, counter assignment system, clinic queue Malaysia, restaurant queue, retail queue, queue display board, waiting list system, QPOS QMS"
        url="https://qbot.now/products/qms"
      />
    <ModulePageLayout
      category="Operate"
      moduleName="QMS Control"
      headline="QUEUES THAT MANAGE THEMSELVES."
      subtitle="Customers join the queue, get a number, and wait comfortably. The system calls them when it's ready. No crowding, no confusion."
      ctaText="END THE QUEUE CHAOS"
      heroImage="/qpos-keyvisuals/hero-qms.webp"
      features={[
        {
          icon: UserPlus,
          title: 'Smart Check-In',
          description: 'Customers enter pax count, answer any custom questions you set, and get a ticket. Clean and fast.',
        },
        {
          icon: Ticket,
          title: 'Auto Ticket Numbers',
          description: 'System generates queue tickets with estimated wait time. Customers know what to expect.',
        },
        {
          icon: Tv,
          title: 'Live Display Board',
          description: 'Customer-facing screen shows the current number being served and the next 3 waiting. Always visible.',
        },
        {
          icon: Clock,
          title: 'Wait Time Prediction',
          description: "System calculates real wait times based on current queue depth and how fast you're serving. Not guesswork.",
        },
        {
          icon: Settings,
          title: 'Per-Outlet Settings',
          description: 'Each outlet runs its own queue rules, accent colors, and display settings. One system, customized per location.',
        },
      ]}
      useCase={{
        title: 'Perfect For',
        description: 'Food courts, clinics, service counters — anywhere customers queue. Keep them informed, keep them calm.',
        industries: ['Food Courts', 'Clinics', 'Government Services', 'Theme Parks', 'Pharmacies'],
      }}
      hardware={[
        {
          name: 'cPad 11"',
          description: 'Counter-mounted queue control terminal for staff.',
          bullets: ['11" FHD 1920×1200', 'Compact, IP54 rated', 'Wi-Fi 6 + Bluetooth 5.3'],
          image: '/qpos-keyvisuals/hardwares/cpad-11in.webp',
          specs: [
            { label: 'OS', value: 'SUNMI OS 4.0 (Android 14)' },
            { label: 'CPU', value: 'Octa-core / Hexa-core\nup to 2.4GHz' },
            { label: 'Memory', value: '3GB RAM + 32GB ROM\n(up to 8GB + 128GB)' },
            { label: 'Display', value: '11" WUXGA 1920×1200 IPS\nCapacitive multi-touch' },
            { label: 'Battery', value: '3.87V / 8000mAh' },
            { label: 'Wi-Fi', value: 'Wi-Fi 6 (802.11ax)' },
            { label: 'Bluetooth', value: 'Bluetooth 5.3, BLE' },
            { label: 'Protection', value: 'IP54' },
            { label: 'Dimensions', value: '256.1 × 168.2 × 10.1mm' },
            { label: 'Weight', value: '526g' },
          ],
        },
        {
          name: 'cPad 14"',
          description: 'Larger queue management terminal for high-traffic counters.',
          bullets: ['14" HD display', 'Clear queue overview', 'IP54 rated'],
          image: '/qpos-keyvisuals/hardwares/cpad-14in.webp',
          specs: [
            { label: 'OS', value: 'SUNMI OS 4.0 (Android 14)' },
            { label: 'CPU', value: 'Octa-core / Hexa-core\nup to 2.4GHz' },
            { label: 'Memory', value: '3GB RAM + 32GB ROM\n(up to 8GB + 128GB)' },
            { label: 'Display', value: '11" WUXGA 1920×1200 IPS\nCapacitive multi-touch' },
            { label: 'Battery', value: '3.87V / 8000mAh' },
            { label: 'Wi-Fi', value: 'Wi-Fi 6 (802.11ax)' },
            { label: 'Bluetooth', value: 'Bluetooth 5.3, BLE' },
            { label: 'Protection', value: 'IP54' },
            { label: 'Dimensions', value: '256.1 × 168.2 × 10.1mm' },
            { label: 'Weight', value: '526g' },
          ],
        },
      ]}
      screenshots={[
        { label: 'Queue display board', aspect: 'video', image: '/context_img/qms01_queue_display.webp' },
        { label: 'Counter assignment screen', aspect: 'video', image: '/context_img/qms02_counter_assignment.webp' },
        { label: 'Wait time analytics', aspect: 'video', image: '/context_img/qms03_wait_time.webp' },
      ]}
      crossLinks={[
        { name: 'Live Display', description: 'Customer-facing screens', path: '/products/live-display', icon: Tv },
        { name: 'POS', description: 'Counter point of sale', path: '/products/pos', icon: Monitor },
        { name: 'Kitchen Display', description: 'Digital kitchen order screen', path: '/products/kitchen-display', icon: Utensils },
        { name: 'QHub', description: 'Central management dashboard', path: '/products/qhub', icon: BarChart3 },
      ]}
      faqs={[
        { question: 'How do customers get a queue number?', answer: 'From the kiosk, POS, or mobile. Digital or printed tickets.' },
        { question: 'Can I customize the voice?', answer: 'Yes. Choose language, voice type, and volume per counter.' },
        { question: 'Does it integrate with the POS?', answer: 'Yes. Queue numbers link to orders for seamless fulfillment tracking.' },
        { question: 'What display hardware do I need?', answer: 'Any TV or monitor with a browser. Wall-mount or counter-stand.' },
      ]}
    />
    </>
  );
}
