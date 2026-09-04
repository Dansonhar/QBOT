import SEOHead from '../../components/SEOHead';
import ModulePageLayout from '../../components/ModulePageLayout';
import { Building2, Shield, ClipboardList, Palette, LayoutDashboard, Cpu, Package, Monitor, Heart } from 'lucide-react';

export default function QhubPage() {
  return (
    <>
      <SEOHead
        title="QHub — Central POS Dashboard for Multi-Outlet Business | QPOS Malaysia"
        description="One dashboard to manage every outlet. Update menus, staff, pricing, receipts, and roles across branches. Real-time multi-outlet sales across all channels — counter, kiosk, QR, web."
        keywords="POS dashboard Malaysia, multi-outlet POS Malaysia, central POS management, QHub, restaurant chain management Malaysia, franchise POS, retail chain software, role-based POS access, QPOS management"
        url="https://qbot.now/products/qhub"
      />
    <ModulePageLayout
      category="Manage"
      moduleName="QHub"
      headline="SEE EVERYTHING. CONTROL EVERYTHING."
      subtitle="One dashboard to run your entire business — menus, staff, outlets, settings. No switching between apps."
      ctaText="TAKE CONTROL"
      heroImage="/qpos-keyvisuals/hero-aidashboard.webp"
      features={[
        {
          icon: Building2,
          title: 'Multi-Outlet Control',
          description: 'Run every outlet from one screen. Each store keeps its own menu, pricing, and team — you see them all.',
        },
        {
          icon: Shield,
          title: 'Staff Roles & Access',
          description: 'Give your manager access to reports but not refunds. You decide who sees what, system by system.',
        },
        {
          icon: ClipboardList,
          title: 'Menu Editor',
          description: 'Change a price or add a new item once — it updates across POS, Kiosk, Webstore, and QR instantly. No manual syncing.',
        },
        {
          icon: Palette,
          title: 'Branding & Appearance',
          description: 'Your logo, your colors, your layout. Customize how your Kiosk, POS, and Webstore look without touching code.',
        },
        {
          icon: LayoutDashboard,
          title: 'Command Centre',
          description: 'One-click launch into any module. POS, Kiosk, KDS, Inventory, Webstore — everything opens from here.',
        },
      ]}
      useCase={{
        title: 'Perfect For',
        description: 'Business owners who want full visibility without visiting every outlet. Check sales from your phone at midnight. Fix problems before they cost you.',
        industries: ['Multi-Outlet Chains', 'Franchise Owners', 'F&B Groups', 'Restaurant Managers'],
      }}
      screenshots={[
        { label: 'QHub main dashboard', aspect: 'video', image: '/context_img/qhub_main.webp' },
        { label: 'Sales analytics view', aspect: 'video', image: '/context_img/sales_analytics.webp' },
        { label: 'Product management screen', aspect: 'video', image: '/context_img/product_management.webp' },
      ]}
      crossLinks={[
        { name: 'AI Insights', description: 'Smart recommendations from your data', path: '/products/ai-insights', icon: Cpu },
        { name: 'Inventory', description: 'Real-time stock tracking', path: '/products/inventory', icon: Package },
        { name: 'POS', description: 'Counter point of sale', path: '/products/pos', icon: Monitor },
        { name: 'Loyalty', description: 'Customer loyalty program', path: '/products/loyalty', icon: Heart },
      ]}
      faqs={[
        { question: 'Can I access QHub from my phone?', answer: 'Yes. QHub is fully responsive. Access from any browser on any device.' },
        { question: 'Can I manage multiple outlets?', answer: 'Yes. Switch between outlets or view consolidated data across all branches.' },
        { question: 'Who can access QHub?', answer: 'Role-based access. Owners see everything. Managers see their outlet. Cashiers see nothing.' },
        { question: 'Is there a mobile app?', answer: 'No app needed. QHub runs in your browser — works on phone, tablet, or desktop.' },
        { question: 'How do I update menus?', answer: 'Through the Menu Editor. Changes sync to POS, Kiosk, Webstore, and QR automatically.' },
      ]}
    />
    </>
  );
}
