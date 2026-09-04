import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function AboutUsPage() {
  return (
    <>
      <SEOHead
        title="About QBot — AI POS & Kiosks Designed in Tokyo, Built for Malaysia"
        description="QBot designs AI-powered POS, self-service kiosks, and industry platforms (QFit, QStudio). Tokyo design, Malaysia deployment. Visit our Publika KL showroom — see it live before you buy."
        keywords="about QBot, QBot Malaysia, QBot Tokyo, QPOS company, POS company Malaysia, kiosk company Malaysia, POS vendor Malaysia, Publika showroom, Kuala Lumpur POS company"
        url="https://qbot.now/about-us"
      />
      <div className="pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-[11px] font-bold text-green-600 uppercase tracking-[0.15em] mb-4">About Us</p>
          <h1 className="text-3xl md:text-5xl font-black text-black tracking-tight mb-6">Designed in Tokyo. Built for Malaysia.</h1>
          <p className="text-[15px] text-gray-700 leading-relaxed mb-10">
            QBot creates self-service kiosks and all-in-one POS solutions that help businesses across F&amp;B, wellness,
            retail, gyms, and entertainment venues run smoother, serve faster, and grow smarter.
          </p>

          <Section title="Our Mission">
            <p>
              To make world-class automation accessible to every merchant — from single-outlet cafes to multi-location
              chains. We pair Japanese design discipline with local Malaysian service so your business gets the best of both.
            </p>
          </Section>

          <Section title="What We Build">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Malaysia's first 3-in-1 POS device — Counter POS, Mobile POS, and Self-Service Kiosk in one.</li>
              <li>Self-service kiosk solutions for ticketing, check-in, ordering, and payments.</li>
              <li>A modular cloud backend that grows with your business — loyalty, inventory, QR ordering, AI insights, and more.</li>
            </ul>
          </Section>

          <Section title="Why Merchants Choose QBot">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>One device, three modes — less hardware, less clutter, less cost.</li>
              <li>Activate only the modules you need. No bloated bundles, no hidden fees.</li>
              <li>Local support from our Publika KL showroom — we're here when you need us.</li>
            </ul>
          </Section>

          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <Link
              to="/contact-us"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black text-white font-black text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              Contact Us <ArrowRight size={16} strokeWidth={3} />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-black font-black text-sm uppercase tracking-wider border border-gray-300 hover:bg-black hover:text-white transition-colors"
            >
              See Products
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg md:text-xl font-black text-black uppercase tracking-tight mb-3">{title}</h2>
      <div className="space-y-3 text-[14px] text-gray-700 leading-relaxed">{children}</div>
    </section>
  );
}
