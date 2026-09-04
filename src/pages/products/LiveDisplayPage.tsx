import SEOHead from '../../components/SEOHead';
import ModulePageLayout from '../../components/ModulePageLayout';
import { CheckCircle, Volume2, Bell, Truck, Monitor as MonitorIcon, ListOrdered, Utensils, Monitor, TrendingUp } from 'lucide-react';

export default function LiveDisplayPage() {
  return (
    <>
      <SEOHead
        title="Digital Menu & Order Display Malaysia — Live Display | QPOS"
        description="Customer-facing displays for live order status, digital menu boards, and promo banners. Swap menus by daypart, animate combos, and keep customers informed while they wait."
        keywords="digital menu board Malaysia, live display Malaysia, order status display, digital signage Malaysia, restaurant TV menu, daypart menu, promo display, customer-facing screen, QPOS live display"
        url="https://qbot.now/products/live-display"
      />
    <ModulePageLayout
      category="Operate"
      moduleName="Live Display"
      headline="YOUR MENU. ON SCREEN. ALWAYS FRESH."
      subtitle="A screen your customers actually watch — showing order status, queue updates, and your latest promotions."
      ctaText="GO DIGITAL"
      heroImage="/qpos-keyvisuals/hero-livedisplay.webp"
      features={[
        {
          icon: CheckCircle,
          title: 'Pickup Tracking',
          description: "Customers see their order move from 'preparing' to 'ready' in real time. No more crowding the counter asking 'is mine done?'",
        },
        {
          icon: Volume2,
          title: 'Voice Calling',
          description: 'System announces order numbers out loud in English, Malay, or Mandarin. Configurable voices.',
        },
        {
          icon: Bell,
          title: 'Audio Chimes',
          description: "Bell, triple chime, or ding dong — pick the sound that fits your place. Customers hear when their number's called.",
        },
        {
          icon: Truck,
          title: 'Delivery Platform Orders',
          description: 'Grab, Shopee, Foodpanda orders show on the same screen. Kitchen and counter staff see everything in one place.',
        },
        {
          icon: MonitorIcon,
          title: 'Multiple Screens',
          description: 'Run different displays on different screens in the same outlet. One for pickup status, one for menu promos. Your call.',
        },
      ]}
      useCase={{
        title: 'Perfect For',
        description: 'Replace printed menus that go stale. Promote specials that sell. Show order status that calms the crowd.',
        industries: ['Restaurants', 'Food Courts', 'Fast Food', 'Cafes', 'Hotels'],
      }}
      hardware={[
        {
          name: 'Any Web-Based Display',
          description: 'Use any smart TV, LED panel, or web-enabled display. No special hardware needed.',
          bullets: ['Works on any screen with a browser', 'HDMI or wireless connection', 'Portrait or landscape orientation'],
        },
      ]}
      screenshots={[
        { label: 'Digital menu board display', aspect: 'video', image: '/context_img/live01_digitial_menu.webp' },
        { label: 'Order status screen', aspect: 'video', image: '/context_img/live02_order_status.webp' },
        { label: 'Promotional carousel', aspect: 'video', image: '/context_img/live03_promotional.webp' },
      ]}
      crossLinks={[
        { name: 'QMS Control', description: 'Queue management system', path: '/products/qms', icon: ListOrdered },
        { name: 'Kitchen Display', description: 'Digital kitchen order screen', path: '/products/kitchen-display', icon: Utensils },
        { name: 'POS', description: 'Counter point of sale', path: '/products/pos', icon: Monitor },
        { name: 'Sales Boosters', description: 'Smart upsells and promotions', path: '/products/sales-boosters', icon: TrendingUp },
      ]}
      faqs={[
        { question: 'What TV do I need?', answer: 'Any TV with a browser or HDMI input. We recommend smart TVs or connect an Android box.' },
        { question: 'Can I show different content on different screens?', answer: 'Yes. Configure each screen independently from QHub.' },
        { question: 'How do I update the menu?', answer: 'Update in QHub. Changes reflect on all connected displays within seconds.' },
        { question: 'Can it show promotional videos?', answer: 'Yes. Upload images and videos that rotate in a carousel when the screen is idle.' },
      ]}
    />
    </>
  );
}
