import SEOHead from '../../components/SEOHead';
import ModulePageLayout from '../../components/ModulePageLayout';
import { Award, Ticket, Trophy, Shield, Wallet, Monitor, TabletSmartphone, TrendingUp, BarChart3 } from 'lucide-react';

export default function LoyaltyPage() {
  return (
    <>
      <SEOHead
        title="Customer Loyalty Program Malaysia — Stamps, Rewards & Wallet | QPOS"
        description="Built-in loyalty with digital stamps, reward tiers, birthday perks, referral tracking, and a customer wallet. Turn first-timers into regulars — all tied to POS, kiosk, QR, and web."
        keywords="loyalty program Malaysia, customer rewards Malaysia, digital stamp card, POS loyalty Malaysia, restaurant loyalty program, retail rewards program, tier rewards, customer retention Malaysia, referral program Malaysia, customer wallet, QPOS loyalty"
        url="https://qbot.now/products/loyalty"
      />
    <ModulePageLayout
      category="Grow"
      moduleName="Loyalty App"
      headline="TURN FIRST-TIMERS INTO REGULARS."
      subtitle="Your own loyalty program — stamps, rewards, wallet — built into the POS. No third-party app, no extra cost."
      ctaText="BUILD LOYALTY NOW"
      heroImage="/qpos-keyvisuals/hero-loyaltyapp.webp"
      features={[
        {
          icon: Award,
          title: 'Digital Stamp Cards',
          description: 'Customers collect stamps on their phone. You set the milestones, you choose the rewards.',
        },
        {
          icon: Ticket,
          title: 'Vouchers',
          description: 'Create discount vouchers, send them out, and track who actually redeems them.',
        },
        {
          icon: Trophy,
          title: 'Reward Tiers',
          description: 'The more they spend, the better the reward. Free items, percentage off, voucher drops — you set the ladder.',
        },
        {
          icon: Shield,
          title: 'Anti-Abuse Protection',
          description: 'Cooldown timers stop customers from stamping twice in 5 minutes. Your rewards stay profitable.',
        },
        {
          icon: Wallet,
          title: 'Wallet & Points',
          description: 'Every customer has a digital balance. They earn points, they spend points — all tracked automatically.',
        },
      ]}
      useCase={{
        title: 'Perfect For',
        description: 'Any business that wants repeat customers. One phone number, total loyalty across every channel. Customers earn and redeem everywhere.',
        industries: ['Cafes', 'Restaurants', 'Bubble Tea', 'Bakeries', 'Beauty Salons'],
      }}
      screenshots={[
        { label: 'Loyalty member profile', aspect: 'video', image: '/context_img/qapp01_profile.webp' },
        { label: 'Stamp card interface', aspect: 'video', image: '/context_img/qapp02_stamp.webp' },
        { label: 'Rewards redemption', aspect: 'video', image: '/context_img/qapp03_reward.webp' },
      ]}
      crossLinks={[
        { name: 'POS', description: 'Counter point of sale', path: '/products/pos', icon: Monitor },
        { name: 'Kiosk', description: 'Self-service ordering', path: '/products/kiosk', icon: TabletSmartphone },
        { name: 'Sales Boosters', description: 'Smart upsells and promotions', path: '/products/sales-boosters', icon: TrendingUp },
        { name: 'QHub', description: 'Central management dashboard', path: '/products/qhub', icon: BarChart3 },
      ]}
      faqs={[
        { question: 'Do customers need to download an app?', answer: 'No. Customers join via QR code. Everything runs in the browser.' },
        { question: 'How do customers earn rewards?', answer: 'Automatically. Every qualifying purchase earns stamps or points across all channels.' },
        { question: 'Can I customize the rewards?', answer: 'Yes. Set your own stamp cards, point values, tier thresholds, and reward items.' },
        { question: 'Does it work with the kiosk?', answer: 'Yes. Customers scan their member QR at the kiosk to earn and redeem.' },
        { question: 'Can I see customer analytics?', answer: 'Yes. QHub shows visit frequency, spend patterns, and loyalty engagement metrics.' },
      ]}
    />
    </>
  );
}
