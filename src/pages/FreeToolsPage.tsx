import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { QrCode, Star, UtensilsCrossed, MessageCircle, ShoppingCart, ArrowRight, Check } from 'lucide-react';

const tools = [
  {
    icon: QrCode,
    name: 'QR Code Generator',
    hook: 'Generate a QR to drive customers to your website, socials, Google Maps, or menu — one scan, instant access.',
    path: '/tools/qr-generator',
    benefits: [
      'High-resolution 1024×1024px output',
      'Download as PNG',
      'Works for any URL — website, social, maps',
      'No sign-up required',
    ],
  },
  {
    icon: Star,
    name: 'Review QR Generator',
    hook: 'Get more 5-star reviews by making it effortless for customers to leave one. Pro tip: offer a free dessert after each review — it pays for itself.',
    path: '/tools/review-qr',
    benefits: [
      'One QR for multiple review platforms',
      'Branded review chooser page',
      'Print on receipts, tables, or packaging',
      'No hosting or storage needed',
    ],
  },
  {
    icon: UtensilsCrossed,
    name: 'Menu QR',
    hook: 'Let customers view your menu from their phone — no app downloads, no reprinting when prices change.',
    path: '/tools/menu-qr',
    benefits: [
      'Links to your existing hosted menu',
      'Branded QR with your business name',
      'No file uploads or storage',
      'Change your menu anytime — QR stays the same',
    ],
  },
  {
    icon: MessageCircle,
    name: 'WhatsApp Booking',
    hook: 'Fill your tables faster — customers book in seconds and the reservation lands straight in your WhatsApp. No missed calls.',
    path: '/tools/wa-booking',
    benefits: [
      'Custom booking fields',
      'Hosted form page with shareable link & QR',
      'Submissions sent directly to your WhatsApp',
      'No app needed for customers',
    ],
  },
  {
    icon: ShoppingCart,
    name: 'WhatsApp Order',
    hook: 'Turn your phone into an ordering system — customers browse your menu, build a cart, and send the order straight to your WhatsApp. No app needed.',
    path: '/tools/wa-order',
    benefits: [
      'Interactive menu with photos & prices',
      'Cart with quantities & total',
      'Orders sent directly to your WhatsApp',
      'QR code for table tents & receipts',
    ],
  },
];

export default function FreeToolsPage() {
  return (
    <div>
      <SEOHead
        title="Free Business Tools Malaysia — QR, Menu, Booking & WhatsApp | QPOS"
        description="Free tools for F&B, retail, and service owners in Malaysia — QR code generator, Google review QR, menu QR, PDF menu, WhatsApp booking & ordering forms. No sign-up, no cost."
        keywords="free business tools Malaysia, free QR code generator Malaysia, Google review QR, menu QR code generator, PDF menu maker, WhatsApp booking form, WhatsApp ordering form, restaurant free tools Malaysia, cafe free tools, QPOS free tools"
        url="https://qbot.now/tools"
      />
      {/* Hero */}
      <section className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">FREE TOOLS</p>
          <h1 className="text-4xl md:text-7xl font-black text-black leading-none uppercase tracking-tighter mb-6">
            FREE TOOLS FOR BUSINESS OWNERS.
          </h1>
          <p className="text-lg md:text-xl font-bold text-gray-400 uppercase max-w-2xl">
            Run your business better — no sign-up, no cost. Powered by QPOS.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.name}
                  to={tool.path}
                  className="group relative border border-gray-200 p-6 hover:border-black transition-all overflow-hidden aspect-square flex"
                >
                  {/* Default state */}
                  <div className="flex flex-col justify-between flex-1 group-hover:opacity-0 group-hover:translate-y-[-8px] transition-all duration-200">
                    <div>
                      <div className="w-14 h-14 bg-gray-100 flex items-center justify-center mb-5">
                        <Icon className="w-7 h-7 text-black" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-lg font-black text-black uppercase tracking-tight mb-2">
                        {tool.name}
                      </h3>
                      <p className="text-[13px] text-gray-500 leading-relaxed">{tool.hook}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-black uppercase tracking-wider group-hover:gap-2 transition-all">
                      Use Tool <ArrowRight size={11} strokeWidth={3} />
                    </span>
                  </div>

                  {/* Hover state — benefits */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 bg-white">
                    <div>
                      <div className="w-14 h-14 bg-black flex items-center justify-center mb-5">
                        <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-lg font-black text-black uppercase tracking-tight mb-4">
                        {tool.name}
                      </h3>
                      <div className="space-y-2.5">
                        {tool.benefits.map((b) => (
                          <div key={b} className="flex items-start gap-2.5">
                            <Check size={14} strokeWidth={3} className="text-green-600 mt-0.5 shrink-0" />
                            <span className="text-[13px] text-gray-600 leading-snug">{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <span className="inline-flex items-center justify-center gap-1.5 text-[11px] font-bold text-white bg-black uppercase tracking-wider py-2.5 w-full transition-all">
                      Use Tool <ArrowRight size={11} strokeWidth={3} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-black py-16">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4">
            WANT MORE THAN FREE TOOLS?
          </h2>
          <p className="text-sm font-bold text-gray-400 uppercase mb-8">
            See what QPOS can do for your business.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-black text-sm uppercase tracking-wider hover:bg-gray-100 transition-colors"
          >
            Explore Products <ArrowRight size={14} strokeWidth={3} />
          </Link>
        </div>
      </section>
    </div>
  );
}
