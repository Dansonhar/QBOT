import SEOHead from '../../components/SEOHead';
import ModulePageLayout from '../../components/ModulePageLayout';
import { ClipboardCheck, ArrowLeftRight, FileText, AlertTriangle, Search, BarChart3, Monitor, Utensils, Cpu } from 'lucide-react';

export default function InventoryPage() {
  return (
    <>
      <SEOHead
        title="Inventory Management Malaysia — Real-Time POS Stock Control | QPOS"
        description="Real-time inventory across counter, kiosk, online store, and kitchen. Auto-deduct on sale, low-stock alerts, purchase orders, stock transfers, batch and expiry tracking."
        keywords="inventory management Malaysia, POS inventory Malaysia, real-time stock control, restaurant inventory Malaysia, retail inventory, purchase order system Malaysia, stock transfer, batch tracking, expiry tracking, QPOS inventory"
        url="https://qbot.now/products/inventory"
      />
    <ModulePageLayout
      category="Manage"
      moduleName="Inventory"
      headline="KNOW WHAT YOU HAVE. ALWAYS."
      subtitle="Always know what you have, what you're running low on, and what's moving between outlets."
      ctaText="STOP STOCK SURPRISES"
      heroImage="/qpos-keyvisuals/hero-ims.webp"
      features={[
        {
          icon: ClipboardCheck,
          title: 'Stock Take',
          description: 'Count what\'s on the shelf, compare it to the system, and spot the difference instantly.',
        },
        {
          icon: ArrowLeftRight,
          title: 'Stock Transfer',
          description: 'Moving stock between outlets? Track every transfer so nothing disappears in transit.',
        },
        {
          icon: FileText,
          title: 'Purchase Orders',
          description: 'Create supplier orders directly in the system. No more spreadsheets or WhatsApp screenshots.',
        },
        {
          icon: AlertTriangle,
          title: 'Loss & Returns',
          description: "Record shrinkage, damage, or returns in one place. Know exactly where your money's going.",
        },
        {
          icon: Search,
          title: 'Full Audit Trail',
          description: "Every stock change is logged — who did it, what changed, and when. No more 'I don't know who touched it.'",
        },
      ]}
      useCase={{
        title: 'Perfect For',
        description: 'Any business that buys ingredients or stock. Stop discovering problems too late. Stop over-ordering. Protect your margins.',
        industries: ['Restaurants', 'Cafes', 'Bakeries', 'Retail', 'Multi-Outlet Chains'],
      }}
      screenshots={[
        { label: 'Stock levels dashboard', aspect: 'video', image: '/context_img/inventory01_stock.webp' },
        { label: 'Purchase order form', aspect: 'video', image: '/context_img/inventory02_purchase_order_form.webp' },
        { label: 'Stock transfer', aspect: 'video', image: '/context_img/inventory04_stock_transfer.webp' },
      ]}
      crossLinks={[
        { name: 'QHub', description: 'Central management dashboard', path: '/products/qhub', icon: BarChart3 },
        { name: 'POS', description: 'Counter point of sale', path: '/products/pos', icon: Monitor },
        { name: 'Kitchen Display', description: 'Digital kitchen order screen', path: '/products/kitchen-display', icon: Utensils },
        { name: 'AI Insights', description: 'Smart recommendations from your data', path: '/products/ai-insights', icon: Cpu },
      ]}
      faqs={[
        { question: 'Does stock update automatically?', answer: 'Yes. Every POS, kiosk, and webstore sale deducts stock in real time.' },
        { question: 'Can I track ingredients?', answer: 'Yes. Recipe-level tracking. When a burger sells, bun + patty + sauce deduct automatically.' },
        { question: 'What about stock counts?', answer: 'Physical stock count feature with variance reports to find shrinkage.' },
        { question: 'Does it work across outlets?', answer: 'Yes. Per-outlet tracking, inter-outlet transfers, and consolidated reporting.' },
      ]}
    />
    </>
  );
}
