import SEOHead from '../../components/SEOHead';
import ModulePageLayout from '../../components/ModulePageLayout';
import { BarChart3, GitCompare, Clock, MessageSquare, TrendingUp, Monitor, Package } from 'lucide-react';

export default function AiInsightsPage() {
  return (
    <>
      <SEOHead
        title="AI Sales Analytics Malaysia — AI Insights & Recommendations | QPOS"
        description="AI-powered sales analytics with plain-English recommendations. Channel comparison, peak-hour forecasting, promo ROI, staff performance, and anomaly detection — all on one dashboard."
        keywords="AI analytics Malaysia, POS analytics Malaysia, sales dashboard Malaysia, business intelligence POS, AI insights Malaysia, sales forecasting, anomaly detection POS, restaurant analytics, retail analytics, QPOS AI"
        url="https://qbot.now/products/ai-insights"
      />
    <ModulePageLayout
      category="Grow"
      moduleName="AI Insights"
      headline="YOUR POS LEARNS. YOUR BUSINESS GROWS."
      subtitle="Your sales data turned into plain English recommendations. Stop guessing what's working — the system tells you."
      ctaText="SMARTER DECISIONS. ZERO GUESSWORK."
      heroImage="/qpos-keyvisuals/hero-aidashboard.webp"
      features={[
        {
          icon: BarChart3,
          title: 'Sales Dashboard',
          description: 'Revenue, order count, and average order value across 7 days, 30 days, or 90 days. Growth arrows show if you\'re up or down.',
        },
        {
          icon: GitCompare,
          title: 'Channel Comparison',
          description: 'See which channel brings the most revenue — POS, Kiosk, QR, Webstore — side by side. Know where to double down.',
        },
        {
          icon: Clock,
          title: 'Peak Hours',
          description: 'Orders broken down by hour and day. Know exactly when you\'re busiest so you can staff and stock accordingly.',
        },
        {
          icon: MessageSquare,
          title: 'AI Chat',
          description: "Ask questions like 'What sold best last week?' or 'Which outlet is underperforming?' and get an instant conversational answer.",
        },
        {
          icon: TrendingUp,
          title: 'Promo Analytics',
          description: 'Track every voucher and booster — how many were used, how much discount was given, and whether it actually drove more sales.',
        },
      ]}
      useCase={{
        title: 'No Data Scientist Required',
        description: 'Plain English recommendations. No spreadsheets. No manual analysis. QPOS AI turns your transaction data into actionable insights you can act on today.',
        industries: ['Multi-Outlet Chains', 'Growing Restaurants', 'Franchise Owners', 'F&B Groups'],
      }}
      screenshots={[
        { label: 'AI dashboard with recommendations', aspect: 'video', image: '/context_img/ai01.webp' },
        { label: 'Sales forecast chart', aspect: 'video', image: '/context_img/ai02.webp' },
        { label: 'Menu engineering matrix', aspect: 'video', image: '/context_img/ai03.webp' },
      ]}
      crossLinks={[
        { name: 'QHub', description: 'Central management dashboard', path: '/products/qhub', icon: BarChart3 },
        { name: 'Sales Boosters', description: 'Smart upsells and promotions', path: '/products/sales-boosters', icon: TrendingUp },
        { name: 'POS', description: 'Counter point of sale', path: '/products/pos', icon: Monitor },
        { name: 'Inventory', description: 'Real-time stock tracking', path: '/products/inventory', icon: Package },
      ]}
      faqs={[
        { question: 'Is this real AI?', answer: 'Yes. Machine learning models trained on your actual sales data. Not just charts — actionable recommendations.' },
        { question: 'Do I need a lot of data?', answer: 'AI Insights starts working after 2-4 weeks of transaction data. The more data, the better the predictions.' },
        { question: 'Is it included in my subscription?', answer: 'AI Insights is available on Standard and Pro plans. Check the pricing page for details.' },
        { question: 'Can I export the reports?', answer: 'Yes. Export to CSV and PDF from QHub.' },
      ]}
    />
    </>
  );
}
