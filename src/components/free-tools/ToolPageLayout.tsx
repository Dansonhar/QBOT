import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface ToolPageLayoutProps {
  title: string;
  headline: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function ToolPageLayout({ title, headline, subtitle, children }: ToolPageLayoutProps) {
  return (
    <div className="min-h-screen">
      {/* Back link */}
      <div className="pt-28 pb-4">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-black transition-colors"
          >
            <ArrowLeft size={14} strokeWidth={3} />
            Free Tools
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="pb-8">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{title}</p>
          <h1 className="text-3xl md:text-5xl font-black text-black leading-none uppercase tracking-tighter mb-4">
            {headline}
          </h1>
          <p className="text-base md:text-lg font-bold text-gray-400 uppercase max-w-xl">
            {subtitle}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-6">{children}</div>
      </section>
    </div>
  );
}
