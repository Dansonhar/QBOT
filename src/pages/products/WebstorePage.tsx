import SEOHead from '../../components/SEOHead';
import ModulePageLayout from '../../components/ModulePageLayout';
import {
  Image,
  CreditCard,
  Users,
  Truck,
  Eye,
  Sparkles,
  Monitor,
  BarChart3,
  Utensils,
  Heart,
} from 'lucide-react';

export default function WebstorePage() {
  return (
    <>
      <SEOHead
        title="Own Webstore Malaysia — Zero Commission Online Ordering | QPOS"
        description="Your branded online store with zero commission. Customers order direct, pay direct, delivery from you — not a marketplace. Stock auto-synced with your POS."
        keywords="online ordering Malaysia, webstore Malaysia, zero commission online food ordering, ecommerce POS Malaysia, branded webstore, restaurant webstore Malaysia, cafe online ordering, QPOS webstore, direct ordering"
        url="https://qbot.now/products/webstore"
      />
    <ModulePageLayout
      category="Sell"
      moduleName="Webstore"
      headline="YOUR ONLINE STORE. BUILT IN."
      subtitle="Your own branded online store. Customers order directly from you — no Grab commission, no middleman."
      ctaText="GO ONLINE TODAY"
      heroImage="/qpos-keyvisuals/hero-web.webp"
      features={[
        {
          icon: Image,
          title: 'Collections & Banners',
          description:
            'Feature your best sellers, seasonal items, or promos with curated product collections and slider banners.',
        },
        {
          icon: CreditCard,
          title: 'Full Checkout',
          description:
            'Customer info, payment, voucher codes, tax — all in one smooth flow. No abandoned carts from clunky UX.',
        },
        {
          icon: Users,
          title: 'Member Recognition',
          description:
            'Returning customer enters their phone number. Their points, order history, and rewards load instantly.',
        },
        {
          icon: Truck,
          title: 'Pickup & Delivery',
          description:
            'Let customers choose how they get their order. Set your own delivery zones and fulfillment rules.',
        },
        {
          icon: Eye,
          title: 'Preview Before Launch',
          description:
            'Test your store privately before going live. See exactly what customers will see.',
        },
        {
          icon: Sparkles,
          title: 'Sales Boosters On Every Order',
          description:
            '★ Upsell prompts, combo deals, spend-threshold rewards, and product badges run automatically on your Webstore. Configure what shows, when it shows, and at what order value.',
        },
      ]}
      useCase={{
        title: 'Perfect For',
        description:
          'Restaurants wanting online ordering without marketplace commission. Takeaway, pre-orders, catering — your store, your brand, your customer relationship.',
        industries: ['Takeaway & Delivery', 'Bakeries', 'Catering', 'Meal Prep', 'Pre-Orders'],
      }}
      screenshots={[
        { label: 'Webstore homepage', aspect: 'video', image: '/context_img/web01_home.webp' },
        { label: 'Product detail page', aspect: 'video', image: '/context_img/web03_product_details.webp' },
        { label: 'Checkout flow', aspect: 'video', image: '/context_img/web04_checkout.webp' },
      ]}
      crossLinks={[
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
          name: 'Loyalty',
          description: 'Reward repeat customers automatically.',
          path: '/products/loyalty',
          icon: Heart,
        },
        {
          name: 'Kitchen Display',
          description: 'Send orders straight to the kitchen screen.',
          path: '/products/kitchen-display',
          icon: Utensils,
        },
      ]}
      faqs={[
        {
          question: 'Do I need a domain?',
          answer:
            'We provide a QPOS-hosted URL. You can also connect your own custom domain.',
        },
        {
          question: 'Is there a commission?',
          answer:
            'Zero commission. You only pay your QPOS subscription fee.',
        },
        {
          question: 'How do delivery orders work?',
          answer:
            'Orders appear in your POS like any other order. Set delivery zones and fees in QHub.',
        },
        {
          question: 'Can customers track their orders?',
          answer:
            'Yes. Real-time order status updates keep customers informed.',
        },
      ]}
    />
    </>
  );
}
