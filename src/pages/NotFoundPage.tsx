import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { ArrowRight } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <>
      <SEOHead
        title="Page Not Found — 404 | QPOS Malaysia"
        description="The page you're looking for doesn't exist or has moved. Explore QPOS products, hardware, or talk to us on WhatsApp."
        keywords="QPOS 404"
        url="https://qbot.now/404"
        noindex
      />
    <div className="pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h1 className="text-8xl md:text-[12rem] font-black text-black leading-none tracking-tighter mb-4">404</h1>
        <p className="text-xl md:text-2xl font-black text-gray-400 uppercase mb-8">Page not found</p>
        <p className="text-sm text-gray-500 mb-12">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-8 py-4 bg-black text-white font-black text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            Go Home <ArrowRight size={16} strokeWidth={3} />
          </Link>
          <Link
            to="/products"
            className="flex items-center gap-2 px-8 py-4 bg-transparent text-black font-black text-sm uppercase tracking-wider border border-gray-300 hover:bg-black hover:text-white transition-colors"
          >
            See Products
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
