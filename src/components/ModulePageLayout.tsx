import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, ChevronDown, ChevronUp, Check, X, Info } from 'lucide-react';
import { trackWhatsAppClick } from '../utils/trackWhatsApp';
import { useState, useEffect } from 'react';
import type { ElementType } from 'react';
import { createPortal } from 'react-dom';

const whatsappUrl = 'https://wa.me/60126909189?text=Hi%20QPOS%2C%20I%27m%20interested%20in%20learning%20more';

interface Feature { icon: ElementType; title: string; description: string; }
interface CrossLink { name: string; description: string; path: string; icon: ElementType; }
interface FAQ { question: string; answer: string; }
interface ScreenshotPlaceholder { label: string; aspect: 'video' | 'square' | 'portrait'; image?: string; }
interface HardwareOption { name: string; description: string; bullets: string[]; image?: string; specs?: { label: string; value: string }[]; }

interface ModulePageLayoutProps {
  category: string;
  moduleName: string;
  headline: string;
  subtitle: string;
  ctaText: string;
  features: Feature[];
  useCase: { title: string; description: string; industries: string[]; };
  screenshots: ScreenshotPlaceholder[];
  hardware?: HardwareOption[];
  crossLinks: CrossLink[];
  faqs: FAQ[];
  /** 'showcase' = bold hero + alternating features (Kiosk, POS, mPOS)
   *  'editorial' = magazine-style, text-heavy, dark sections (Sales Boosters, AI Insights)
   *  'clean' = minimal dashboard style (QHub, Inventory, Loyalty, KDS, QMS, etc.) */
  variant?: 'showcase' | 'editorial' | 'clean';
  heroImage?: string;
}

// ─── Shared: FAQ Section ───
function FAQSection({ faqs, moduleName }: { faqs: FAQ[]; moduleName: string }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <h2 className="text-xl md:text-2xl font-extrabold text-black tracking-tight mb-6">Frequently asked</h2>
      <div className="space-y-0">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-gray-200">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between py-4 text-left group">
              <span className="text-[14px] font-semibold text-black pr-4 group-hover:text-green-600 transition-colors">{faq.question}</span>
              {open === i ? <ChevronUp size={16} strokeWidth={2} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} strokeWidth={2} className="text-gray-400 flex-shrink-0" />}
            </button>
            {open === i && <p className="pb-4 text-[14px] text-gray-500 leading-[1.7]">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Shared: Tech Specs Modal ───
function TechSpecsModal({ hw, onClose }: { hw: HardwareOption; onClose: () => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEsc);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleEsc); };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-[#2a2d35] text-white rounded-lg max-w-4xl w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-[#2a2d35] z-10 flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-bold">{hw.name} Tech Specs</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors"><X size={20} /></button>
        </div>
        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {hw.specs!.map((s) => (
            <div key={s.label} className="bg-[#363940] rounded-lg p-3">
              <p className="text-[12px] font-bold text-white mb-1">{s.label}</p>
              <p className="text-[11px] text-gray-400 leading-[1.5] whitespace-pre-line">{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Shared: Hardware Section ───
function HardwareSection({ hardware }: { hardware: HardwareOption[] }) {
  const [specsOpen, setSpecsOpen] = useState<string | null>(null);
  const activeHw = hardware.find(hw => hw.name === specsOpen);

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-xl md:text-2xl font-extrabold text-black tracking-tight mb-2">Recommended hardware</h2>
        <p className="text-[14px] text-gray-400 mb-8">Choose the device that fits your setup.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {hardware.map((hw) => (
            <div key={hw.name} className="bg-white border border-gray-200 overflow-hidden group hover:border-black transition-colors">
              <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                {hw.image ? <img src={hw.image} alt={hw.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <p className="text-xs text-gray-300 font-bold uppercase">Photo: {hw.name}</p>}
              </div>
              <div className="p-5">
                <h3 className="text-sm font-bold text-black mb-1.5">{hw.name}</h3>
                <p className="text-[13px] text-gray-400 leading-[1.5] mb-3">{hw.description}</p>
                <ul className="space-y-1">
                  {hw.bullets.map((b) => <li key={b} className="text-[12px] text-gray-500 flex items-start gap-1.5"><Check size={11} strokeWidth={2.5} className="text-green-600 mt-0.5 flex-shrink-0" />{b}</li>)}
                </ul>
                {hw.specs && hw.specs.length > 0 && (
                  <button onClick={() => setSpecsOpen(hw.name)} className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-gray-500 hover:text-black transition-colors">
                    <Info size={13} strokeWidth={2} /> Tech Specs
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {activeHw && activeHw.specs && <TechSpecsModal hw={activeHw} onClose={() => setSpecsOpen(null)} />}
    </section>
  );
}

// ─── Shared: Cross Links ───
function CrossLinksSection({ crossLinks, moduleName }: { crossLinks: CrossLink[]; moduleName: string }) {
  return (
    <section className="py-16 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-xl md:text-2xl font-extrabold text-black tracking-tight mb-2">Works with {moduleName}</h2>
        <p className="text-[14px] text-gray-400 mb-8">Better together.</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {crossLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.path} to={link.path} className="border border-gray-200 p-4 hover:border-black transition-colors group">
                <Icon size={20} strokeWidth={1.5} className="text-gray-400 group-hover:text-black mb-2 transition-colors" />
                <h3 className="text-sm font-bold text-black mb-0.5 group-hover:text-green-600 transition-colors">{link.name}</h3>
                <p className="text-[12px] text-gray-400">{link.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Shared: CTA Bar ───
function CTABar({ ctaText, moduleName }: { ctaText: string; moduleName: string }) {
  return (
    <section className="py-14 md:py-20 bg-black text-white">
      <div className="max-w-2xl mx-auto text-center px-6">
        <h2 className="text-xl md:text-[28px] font-extrabold uppercase tracking-tight mb-3">{ctaText}</h2>
        <p className="text-[14px] text-white/40 mb-6">See {moduleName} in action.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick(`${moduleName} > CTA Bar > Book Demo`)} className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white text-sm font-bold uppercase tracking-wide transition-colors">
            <MessageCircle size={14} strokeWidth={2} /> Book Demo
          </a>
          <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 hover:border-white/40 text-white/60 hover:text-white text-sm font-bold uppercase tracking-wide transition-all">
            All Products <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════
// VARIANT A: SHOWCASE — Bold, image-heavy, alternating
// For: POS, mPOS, Kiosk, Tablet, Webstore, Scan-to-Order
// ═════════════════════════════════════════════════════
function ShowcaseLayout(props: ModulePageLayoutProps) {
  return (
    <div className="pt-16">
      {/* Full-width hero */}
      <section className="relative bg-black text-white overflow-hidden" style={{ minHeight: '60vh' }}>
        {props.heroImage ? (
          <div className="absolute inset-0">
            <img src={props.heroImage} alt={props.moduleName || 'QBOT module'} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gray-900" />
        )}
        <div className="relative z-10 flex items-end min-h-[60vh] pb-10 md:pb-16">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <p className="text-[11px] font-bold text-green-400 uppercase tracking-[0.15em] mb-3">{props.category} — {props.moduleName}</p>
            <h1 className="text-[32px] md:text-[48px] lg:text-[60px] font-black leading-[0.9] tracking-tighter uppercase mb-4 max-w-3xl">{props.headline}</h1>
            <p className="text-[15px] text-white/50 leading-[1.65] max-w-lg mb-6">{props.subtitle}</p>
            <div className="flex items-center gap-3">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick(`${props.moduleName} > Showcase Hero > Book Demo`)} className="inline-flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-500 text-white text-xs font-bold uppercase tracking-wide transition-colors group">
                Book Demo <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
              <Link to="/pricing" className="inline-flex items-center gap-2 px-5 py-3 border border-white/25 hover:border-white/50 text-white/60 hover:text-white text-xs font-bold uppercase tracking-wide transition-all">Pricing</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features — alternating left/right with large numbers */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {props.features.map((f, i) => {
            const Icon = f.icon;
            const isEven = i % 2 === 0;
            return (
              <div key={f.title} className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-10 ${i > 0 ? 'border-t border-gray-200' : ''}`}>
                <div className={isEven ? 'order-1' : 'order-1 lg:order-2'}>
                  <span className="text-[64px] md:text-[80px] font-black text-gray-100 leading-none">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="text-lg md:text-xl font-extrabold text-black tracking-tight -mt-4 mb-2">{f.title}</h3>
                  <p className="text-[14px] text-gray-400 leading-[1.7] max-w-md">{f.description}</p>
                </div>
                <div className={`aspect-video bg-gray-100 flex items-center justify-center ${isEven ? 'order-2' : 'order-2 lg:order-1'}`}>
                  <Icon size={40} strokeWidth={1} className="text-gray-300" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Use case — horizontal scroll tags */}
      <section className="py-12 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-6 flex-wrap">
            <h3 className="text-sm font-bold text-black">{props.useCase.title}:</h3>
            {props.useCase.industries.map((ind) => <span key={ind} className="text-[13px] font-medium text-gray-500 border-b border-gray-300 pb-0.5">{ind}</span>)}
          </div>
        </div>
      </section>

      {/* Screenshots — staggered grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-4">
            {props.screenshots.map((s, i) => (
              <div key={s.label} className={i === 0 ? 'md:col-span-2' : ''}>
                <div className={`bg-gray-100 flex items-center justify-center overflow-hidden ${i === 0 ? 'aspect-[21/9]' : 'aspect-video'}`}>
                  {s.image ? <img src={s.image} alt={s.label} className="w-full h-full object-cover" /> : <p className="text-xs text-gray-300 font-bold uppercase">{s.label}</p>}
                </div>
                <p className="text-[11px] text-gray-400 mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {props.hardware && props.hardware.length > 0 && <HardwareSection hardware={props.hardware} />}
      <CrossLinksSection crossLinks={props.crossLinks} moduleName={props.moduleName} />
      <FAQSection faqs={props.faqs} moduleName={props.moduleName} />
      <CTABar ctaText={props.ctaText} moduleName={props.moduleName} />
    </div>
  );
}

// ═════════════════════════════════════════════════════
// VARIANT B: EDITORIAL — Magazine-style, text-driven, dark hero
// For: Sales Boosters, AI Insights
// ═════════════════════════════════════════════════════
function EditorialLayout(props: ModulePageLayoutProps) {
  return (
    <div className="pt-16">
      {/* Hero — centered text */}
      <section className="relative py-20 md:py-32 bg-black text-white overflow-hidden">
        {props.heroImage && (
          <div className="absolute inset-0">
            <img src={props.heroImage} alt={props.moduleName || 'QBOT module'} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/70" />
          </div>
        )}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-[11px] font-bold text-green-400 uppercase tracking-[0.15em] mb-5">{props.category}</p>
          <h1 className="text-[28px] md:text-[42px] lg:text-[52px] font-extrabold leading-[1.1] tracking-tight mb-5">{props.headline}</h1>
          <p className="text-[16px] text-white/45 leading-[1.7] max-w-2xl mx-auto mb-8">{props.subtitle}</p>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick(`${props.moduleName} > Editorial Hero > See It In Action`)} className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white text-sm font-bold uppercase tracking-wide transition-colors group">
            See It In Action <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </section>

      {/* Features — big quote-style cards */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="space-y-6">
            {props.features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="grid md:grid-cols-12 gap-6 items-start py-8 border-b border-gray-200">
                  <div className="md:col-span-1">
                    <Icon size={24} strokeWidth={1.5} className="text-green-600" />
                  </div>
                  <div className="md:col-span-4">
                    <h3 className="text-base font-extrabold text-black">{f.title}</h3>
                  </div>
                  <div className="md:col-span-7">
                    <p className="text-[14px] text-gray-400 leading-[1.7]">{f.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use case + screenshots side by side */}
      <section className="py-16 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-extrabold text-black mb-3">{props.useCase.title}</h2>
              <p className="text-[14px] text-gray-400 leading-[1.7] mb-6">{props.useCase.description}</p>
              <div className="flex flex-wrap gap-2">
                {props.useCase.industries.map((ind) => <span key={ind} className="text-[12px] font-medium bg-white border border-gray-200 px-3 py-1.5">{ind}</span>)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {props.screenshots.map((s) => (
                <div key={s.label}>
                  <div className="bg-gray-200 aspect-video flex items-center justify-center overflow-hidden">
                    {s.image ? <img src={s.image} alt={s.label} className="w-full h-full object-cover" /> : <p className="text-[10px] text-gray-400 font-bold uppercase text-center px-2">{s.label}</p>}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {props.hardware && props.hardware.length > 0 && <HardwareSection hardware={props.hardware} />}
      <CrossLinksSection crossLinks={props.crossLinks} moduleName={props.moduleName} />
      <FAQSection faqs={props.faqs} moduleName={props.moduleName} />
      <CTABar ctaText={props.ctaText} moduleName={props.moduleName} />
    </div>
  );
}

// ═════════════════════════════════════════════════════
// VARIANT C: CLEAN — Minimal, tool/dashboard style
// For: QHub, Inventory, Loyalty, KDS, QMS, Live Display
// ═════════════════════════════════════════════════════
function CleanLayout(props: ModulePageLayoutProps) {
  return (
    <div className="pt-20 md:pt-24">
      {/* Breadcrumbs */}
      <div className="max-w-5xl mx-auto px-6 py-3">
        <nav className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400">
          <Link to="/products" className="hover:text-black transition-colors">Products</Link>
          <span>/</span><span>{props.category}</span><span>/</span>
          <span className="text-black">{props.moduleName}</span>
        </nav>
      </div>

      {/* Hero — simple, left-aligned, with screenshot right */}
      <section className="py-10 md:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-2">
              <h1 className="text-2xl md:text-[32px] font-extrabold text-black leading-[1.1] tracking-tight mb-4">{props.headline}</h1>
              <p className="text-[14px] text-gray-400 leading-[1.7] mb-6">{props.subtitle}</p>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick(`${props.moduleName} > Clean Hero > Get a Demo`)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wide transition-colors group">
                Get a Demo <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
            <div className="lg:col-span-3 bg-gray-100 aspect-video flex items-center justify-center overflow-hidden">
              {props.heroImage ? (
                <img src={props.heroImage} alt={props.moduleName} className="w-full h-full object-cover" />
              ) : (
                <p className="text-xs text-gray-300 font-bold uppercase">{props.moduleName} Dashboard</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features — compact 2-column list */}
      <section className="py-12 bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-lg font-extrabold text-black mb-6">What it does</h2>
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-5">
            {props.features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="flex items-start gap-3">
                  <Icon size={18} strokeWidth={1.5} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-[14px] font-bold text-black mb-0.5">{f.title}</h3>
                    <p className="text-[13px] text-gray-400 leading-[1.6]">{f.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Screenshots — simple row */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-4">
            {props.screenshots.map((s) => (
              <div key={s.label}>
                <div className="bg-gray-100 aspect-video flex items-center justify-center overflow-hidden">
                  {s.image ? <img src={s.image} alt={s.label} className="w-full h-full object-cover" /> : <p className="text-[10px] text-gray-300 font-bold uppercase text-center px-2">{s.label}</p>}
                </div>
                <p className="text-[11px] text-gray-400 mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use case — inline */}
      <section className="py-10 bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="text-sm font-bold text-black mb-1">{props.useCase.title}</h3>
          <p className="text-[13px] text-gray-400 mb-4">{props.useCase.description}</p>
          <div className="flex flex-wrap gap-2">
            {props.useCase.industries.map((ind) => <span key={ind} className="text-[11px] font-medium bg-gray-100 px-2.5 py-1">{ind}</span>)}
          </div>
        </div>
      </section>

      {props.hardware && props.hardware.length > 0 && <HardwareSection hardware={props.hardware} />}
      <CrossLinksSection crossLinks={props.crossLinks} moduleName={props.moduleName} />
      <FAQSection faqs={props.faqs} moduleName={props.moduleName} />
      <CTABar ctaText={props.ctaText} moduleName={props.moduleName} />
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAIN EXPORT — picks the right variant
// ═══════════════════════════════════════════════
export default function ModulePageLayout(props: ModulePageLayoutProps) {
  useEffect(() => { document.title = `${props.moduleName} — QPOS | ${props.category} Module`; }, [props.moduleName, props.category]);

  const variant = props.variant || 'clean';

  if (variant === 'showcase') return <ShowcaseLayout {...props} />;
  if (variant === 'editorial') return <EditorialLayout {...props} />;
  return <CleanLayout {...props} />;
}
