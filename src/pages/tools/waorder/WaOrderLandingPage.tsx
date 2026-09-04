import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ToolExplainer from '../../../components/free-tools/ToolExplainer';
import OtherFreeTools from '../../../components/free-tools/OtherFreeTools';
import SEOHead from '../../../components/SEOHead';

export default function WaOrderLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Free WhatsApp Ordering for F&B Malaysia — Menu + Cart + WA Handoff | QPOS"
        description="Let customers order from your WhatsApp menu in seconds. Free digital menu + cart + WhatsApp order handoff. Perfect for cafes, food trucks, home kitchens, and hawker stalls."
        keywords="WhatsApp ordering Malaysia, WA order system, WhatsApp menu, online food ordering WhatsApp, F&B WhatsApp ordering, home kitchen ordering Malaysia, food truck ordering, zero commission ordering, QPOS free tool"
        url="https://qbot.now/tools/wa-order"
      />
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        <Link to="/tools" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors">
          &larr; Free Tools
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mt-6">
          {/* Left — Explainer (smaller: 2/5) */}
          <div className="hidden lg:block lg:col-span-2">
            <ToolExplainer tool="wa-order" />
          </div>

          {/* Right — Content (larger: 3/5) */}
          <div className="lg:col-span-3">
            <p className="text-[11px] font-bold text-green-600 uppercase tracking-[0.15em] mb-3">Free Tool</p>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
              WhatsApp Ordering Page for Your Business
            </h1>
            <p className="text-[15px] text-gray-500 max-w-xl mb-10">
              Create a professional menu with photos and prices. Customers scan your QR, browse, build a cart, and send the order straight to your WhatsApp. No app, no payment gateway, no fuss.
            </p>

            {/* Steps */}
            <div className="space-y-5 mb-10">
              {[
                { num: '1', emoji: '🍽️', title: 'Build Your Menu', desc: 'Add categories, items with photos and prices. Drag to reorder.' },
                { num: '2', emoji: '📱', title: 'Share Your QR', desc: 'Get a QR code and link for your ordering page. Print it anywhere.' },
                { num: '3', emoji: '💬', title: 'Receive Orders on WhatsApp', desc: 'Customers browse, build a cart, and send orders directly to your WhatsApp.' },
              ].map((step) => (
                <div key={step.num} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-black text-white flex items-center justify-center shrink-0 text-lg">
                    {step.emoji}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider">Step {step.num}: {step.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link
                to="/tools/wa-order/signup"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-gray-800"
              >
                Create Your Menu <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/tools/wa-order/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-sm font-bold uppercase tracking-wider hover:bg-gray-50"
              >
                I Have an Account
              </Link>
            </div>

            {/* Upsell */}
            <div className="bg-gray-50 p-6">
              <p className="text-sm text-gray-500 mb-1">Need online payments, order tracking, and kitchen display?</p>
              <Link to="/products/webstore" className="text-sm font-bold uppercase tracking-wider text-black hover:underline">
                Upgrade to QPos Webstore &rarr;
              </Link>
            </div>
          </div>
        </div>

        <OtherFreeTools current="/tools/wa-order" />
      </div>
    </div>
  );
}
