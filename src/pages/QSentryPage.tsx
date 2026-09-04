// QSENTRY AI — standalone product landing page (/qsentry).
//
// PUBLIC + INDEXABLE. This is a primary organic-search entry point, not an unlisted
// link. SEO surface, and where each piece lives:
//   - <SEOHead>          title / description / keywords / canonical / OG / Twitter
//   - <SeoJsonLd>        Product + FAQPage + VideoObject + BreadcrumbList rich results
//   - public/sitemap.xml /qsentry entry incl. image + video sitemap extensions
//   - public/robots.txt  crawlable (NOT disallowed — do not add it there)
//   - scripts/prerender-meta.mjs
//                        bakes the meta AND a no-JS static content fallback into
//                        dist/qsentry/index.html so non-rendering crawlers
//                        (Bing, WhatsApp, LinkedIn, GPTBot/PerplexityBot…) still
//                        read the full offer. Keep that block in sync with the copy
//                        in SPECS / FAQ_PLAIN below when either changes.
// Everything a buyer would search for must exist as crawlable TEXT on this page —
// never only inside an image. See SpecsTable: it mirrors qsentryai-specs.jpg.
//
// Product: Malaysia's first anti-tailgater AI camera for gyms. Catches members who
// sneak friends in — auto alarm (red lights + buzzer), photo + video capture, and a
// mobile report with date/time. Privacy-first: no continuous recording, only
// tailgaters are captured.
//
// Theme: near-black (#0A0A0A) + alert red (#FF2D2D). Athletic, security-tech feel.
//
// IMPORTANT — assets in /public/qsentry_img must NEVER be cropped (client request).
// All product imagery uses object-contain on a padded backdrop. Only decorative
// full-bleed treatments (none of the client photos) may bleed.

import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import {
  ArrowRight, ChevronDown, ShieldCheck, ScanFace, Siren, Camera,
  Smartphone, Lock, Wrench, BadgeCheck, MapPin, Check, Clock,
  AlertTriangle, TrendingDown, Users, MessageCircle,
  RotateCcw, Video, Bell, Sparkles, ChevronRight, Eye, Pencil, type LucideIcon,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { supabase } from '../lib/supabase';

// ────────────────────────────────────────────────────────────────
// CONSTANTS
// ────────────────────────────────────────────────────────────────
const IMG = {
  logo:     '/qsentry_img/qsentry_logo.svg',
  video:    '/qsentry_img/qsentry-video.mp4',   // portrait demo, web-optimized (~232KB)
  poster:   '/qsentry_img/qsentry-poster.jpg',  // first-frame poster (instant splash)
  phone:    '/qsentry_img/sentryphone.png',     // mobile alert mockup
  specs:    '/qsentry_img/qsentryai-specs.jpg',  // product / spec sheet
  footage:  '/qsentry_img/sentryrealfootage.jpg',// real captured tailgater frame
};

const WA_NUMBER = '60126909189';
const waLink = (msg: string) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
const WA = waLink("Hi, I'm interested in QSentry AI.");

const fmtRM = (n: number) => 'RM' + Math.round(n).toLocaleString('en-MY');

// Pricing
const PRICE_RRP = 5699;                 // RRP (strikethrough)
const PRICE_NOW = 4999;                 // intro / preorder price (one-time hardware + setup)

// ────────────────────────────────────────────────────────────────
// SMALL HOOKS / PRIMITIVES
// ────────────────────────────────────────────────────────────────
function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(22px)',
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// Animated count-up number. Re-runs whenever `value` changes (drives the loss meter).
function CountUp({ value, prefix = '', className = '' }: { value: number; prefix?: string; className?: string }) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number>();
  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    const start = performance.now();
    const dur = 600;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (to - from) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value]);
  return <span className={className}>{prefix}{Math.round(display).toLocaleString('en-MY')}</span>;
}

// Uncropped product image. object-contain on a dark padded frame — assets are
// shown in full, never cut. Subtle red ring to sit on the black theme.
//
// Serves the .webp sibling produced by scripts/convert-to-webp.mjs and falls back
// to the original for anything that can't take webp. The originals are heavy
// (sentryphone.png alone is 600KB); webp cuts this page by well over a megabyte,
// which is page-experience signal as much as it is courtesy to mobile data plans.
// The aspect-ratio wrapper reserves the box before the image lands, so no CLS.
function Photo({ src, alt, ratio = 'aspect-video', className = '', contain = true }: { src: string; alt: string; ratio?: string; className?: string; contain?: boolean }) {
  const webp = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  return (
    <div className={`relative w-full overflow-hidden bg-[#0E0E0E] ring-1 ring-white/10 ${ratio} ${className}`}>
      <picture>
        {webp !== src && <source srcSet={webp} type="image/webp" />}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 w-full h-full ${contain ? 'object-contain' : 'object-cover'}`}
        />
      </picture>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// HEADER
// ────────────────────────────────────────────────────────────────
// Header mirrors the /qstudio chrome (two-tier: utility bar + sticky nav),
// re-skinned with QSentry's red theme (#FF2D2D) in place of Studio's lime.
const HEADER_ANNOUNCEMENTS = [
  "Malaysia's first anti-tailgater AI camera for gyms.",
  'Preorder now — be first to stop tailgaters at your gym.',
  'Stop giving away free workouts. Catch every tailgater.',
];

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [annIdx, setAnnIdx] = useState(0);
  const [annFade, setAnnFade] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnnFade(false);
      setTimeout(() => { setAnnIdx(p => (p + 1) % HEADER_ANNOUNCEMENTS.length); setAnnFade(true); }, 300);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: 'The problem', href: '#problem' },
    { label: 'The cost',    href: '#loss' },
    { label: 'How it works', href: '#how' },
    { label: 'Features',    href: '#features' },
    { label: 'Specs',       href: '#specs' },
    { label: 'Pricing',     href: '#pricing' },
    { label: 'FAQ',         href: '#faq' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50" role="banner">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-[#FF2D2D] focus:text-white focus:px-3 focus:py-1.5 focus:text-[11px] focus:font-bold focus:uppercase">
        Skip to content
      </a>

      {/* utility bar */}
      <div className="bg-[#111] text-white hidden lg:block">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-1.5 flex items-center justify-between">
          <div className="flex items-center divide-x divide-gray-700 text-[10px] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 pr-4 text-gray-400">
              <Sparkles size={10} strokeWidth={2.5} className="text-[#FF2D2D]" />
              QSentry AI by QBot
            </span>
            <span className="px-4 text-gray-400">Klang Valley demos</span>
            <span className={`pl-4 text-[#FF2D2D] transition-opacity duration-300 ${annFade ? 'opacity-100' : 'opacity-0'}`}>
              {HEADER_ANNOUNCEMENTS[annIdx]}
            </span>
          </div>
          <div className="flex items-center gap-4 divide-x divide-gray-600">
            <a href={WA} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors">
              <MessageCircle size={10} strokeWidth={2.5} />
              +6012-6909-189
            </a>
            <a href="/qstudio" className="pl-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#FF2D2D] hover:text-white transition-colors">
              Explore STUDIO <ArrowRight size={10} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </div>

      {/* main nav */}
      <nav className={`transition-all duration-300 bg-black/90 backdrop-blur-xl backdrop-saturate-150 border-b border-white/10 ${scrolled ? 'shadow-sm' : ''}`} aria-label="Primary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 md:py-4">
          <div className="flex items-center">
            <a href="#main" className="flex items-center mr-10" aria-label="QSentry AI home">
              <img src={IMG.logo} alt="QSentry AI" className="h-7 md:h-8 w-auto" style={{ filter: 'invert(1) brightness(2)' }} />
            </a>

            <div className="hidden lg:flex items-center space-x-5 xl:space-x-7">
              {navItems.map(item => (
                <a key={item.label} href={item.href} className="text-[11px] font-bold tracking-[0.1em] uppercase text-white hover:text-[#FF2D2D] transition-colors duration-200">
                  {item.label}
                </a>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-5 ml-auto">
              <a href="#demo" className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF2D2D] hover:bg-[#ff4747] text-white text-[11px] font-bold uppercase tracking-wider transition-colors rounded-full">
                <MessageCircle size={14} strokeWidth={2} /> Book a demo <ChevronRight size={14} strokeWidth={2.5} />
              </a>
            </div>

            <div className="lg:hidden flex items-center ml-auto gap-2">
              <a href="#demo" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF2D2D] text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                <MessageCircle size={12} strokeWidth={2} /> Demo
              </a>
              <button onClick={() => setMobileMenu(p => !p)} className="w-11 h-11 inline-flex items-center justify-center text-white" aria-label="Toggle menu" aria-expanded={mobileMenu}>
                {mobileMenu ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
                )}
              </button>
            </div>
          </div>

          {mobileMenu && (
            <div className="lg:hidden border-t border-white/10 py-3 flex flex-col gap-1">
              {[...navItems, { label: 'Explore STUDIO', href: '/qstudio' }].map(item => (
                <a key={item.label} href={item.href}
                  onClick={() => setMobileMenu(false)}
                  className="text-[13px] font-bold uppercase tracking-wider text-white hover:text-[#FF2D2D] min-h-[44px] py-3 px-2 flex items-center transition-colors">
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

// ────────────────────────────────────────────────────────────────
// HERO VIDEO — progressive load with a "LOADING VIDEO" progress bar.
// Poster shows instantly; bar fills from buffered ranges; video fades in
// once it can play. Safety timeout reveals it even if events misbehave.
// ────────────────────────────────────────────────────────────────
function HeroVideo() {
  const vref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  const updateProgress = () => {
    const v = vref.current;
    if (!v || !v.duration || !isFinite(v.duration)) return;
    try {
      const end = v.buffered.length ? v.buffered.end(v.buffered.length - 1) : 0;
      setProgress(Math.min(100, Math.round((end / v.duration) * 100)));
    } catch { /* buffered can throw before metadata — ignore */ }
  };

  useEffect(() => {
    // Fallback: never trap the user behind the loader.
    const t = setTimeout(() => setReady(true), 7000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative rounded-[2rem] border-[6px] border-[#1a1a1a] bg-black overflow-hidden shadow-2xl ring-1 ring-[#FF2D2D]/20">
      <video
        ref={vref}
        src={IMG.video}
        autoPlay muted loop playsInline preload="auto"
        poster={IMG.poster}
        onProgress={updateProgress}
        onLoadedData={updateProgress}
        onCanPlay={() => { updateProgress(); setReady(true); }}
        onPlaying={() => setReady(true)}
        className={`w-full h-auto block transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* loading overlay */}
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0A]">
          <img src={IMG.poster} aria-hidden alt="" className="absolute inset-0 w-full h-full object-cover opacity-25 blur-[2px]" />
          <div className="relative z-10 w-3/4 max-w-[190px]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/85 flex items-center gap-1.5">
                <Video size={12} className="text-[#FF2D2D]" /> Loading video
              </span>
              <span className="text-[10px] font-bold text-[#FF2D2D] tabular-nums">{progress}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/15 overflow-hidden">
              <div
                className={`h-full bg-[#FF2D2D] ${progress ? 'transition-all duration-200' : 'animate-pulse'}`}
                style={{ width: `${progress || 12}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#FF2D2D] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white animate-pulse">
        <Siren size={11} /> Tailgating detected
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// HERO
// ────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
      {/* ambient red glow */}
      <div aria-hidden className="absolute -top-32 -right-24 w-[480px] h-[480px] rounded-full bg-[#FF2D2D]/20 blur-[120px]" />
      <div aria-hidden className="absolute top-40 -left-24 w-[360px] h-[360px] rounded-full bg-[#FF2D2D]/10 blur-[120px]" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF2D2D]/40 bg-[#FF2D2D]/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#ff6b6b] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF2D2D] animate-pulse" /> First in Malaysia · Anti-Tailgating AI CCTV
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight">
            Every tailgater is <span className="text-[#FF2D2D]">money walking</span> out your door.
          </h1>
          <p className="mt-5 text-lg text-white/70 max-w-xl leading-relaxed">
            QSentry AI is Malaysia's first anti-tailgating AI CCTV camera for gyms. It catches members who sneak friends in —
            <span className="text-white font-semibold"> automatically</span>, with photo & video proof and an
            instant alert to your phone. No staff needed.
          </p>
          <div className="mt-6 inline-flex items-start gap-2.5 rounded-xl border border-[#4ade80]/40 bg-[#0a2a14]/50 px-4 py-3">
            <BadgeCheck size={18} className="text-[#4ade80] mt-0.5 shrink-0" />
            <p className="text-sm text-white/85">
              <span className="font-black text-[#4ade80]">PREORDER NOW</span> — be among the <span className="font-bold text-white">first gyms</span> to stop tailgaters.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#loss" className="inline-flex items-center gap-2 bg-[#FF2D2D] hover:bg-[#ff4747] text-white font-bold px-7 py-4 rounded-full transition-colors shadow-[0_0_30px_rgba(255,45,45,0.4)]">
              Calculate how much you're losing to tailgaters <ArrowRight size={18} />
            </a>
          </div>
          <p className="mt-4 text-sm text-white/40 flex items-center gap-1.5">
            <MapPin size={14} /> Klang Valley only · Limited demo slots each week
          </p>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-white/55">
            <span className="flex items-center gap-1.5"><Lock size={13} className="text-[#FF2D2D]" /> No video stored</span>
            <span className="flex items-center gap-1.5"><BadgeCheck size={13} className="text-[#FF2D2D]" /> 2-Year Warranty</span>
            <span className="flex items-center gap-1.5"><RotateCcw size={13} className="text-[#FF2D2D]" /> 30-Day Money-Back</span>
          </div>
        </div>

        {/* portrait demo video — shown in full, phone-framed, with loading bar */}
        <Reveal delay={0.1} className="relative mx-auto w-full max-w-[300px]">
          <HeroVideo />
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// PROBLEM
// ────────────────────────────────────────────────────────────────
const PAINS: { Icon: LucideIcon; title: string; body: string }[] = [
  { Icon: Users, title: 'Friends slip in free', body: 'One member taps in. Their buddy walks through behind them — and trains for free, every single day.' },
  { Icon: Clock, title: 'Staff can\'t catch it', body: 'Your front desk is busy. Nobody is watching the gate 24/7. Your turnstile can\'t tell two bodies from one.' },
  { Icon: TrendingDown, title: 'It never shows up', body: 'Lost entries never hit your P&L — so the leak goes on for months without you even knowing.' },
];

function Problem() {
  return (
    <section id="problem" className="py-16 sm:py-24 border-t border-white/10 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal>
          <p className="text-[#FF2D2D] font-bold uppercase tracking-[0.18em] text-xs mb-3">The silent revenue killer</p>
          <h2 className="text-3xl sm:text-4xl font-black leading-tight max-w-2xl">
            Most Malaysian gyms are quietly bleeding money through the turnstile.
          </h2>
          <p className="mt-4 text-white/60 max-w-2xl text-lg">
            Tailgating — members bringing friends in for free — is the #1 unmeasured loss in gyms.
            You're not running a gym. You're running a charity for freeloaders.
          </p>
        </Reveal>
        <div className="mt-10 grid sm:grid-cols-3 gap-5">
          {PAINS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-[#FF2D2D]/30 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-[#FF2D2D]/10 border border-[#FF2D2D]/30 flex items-center justify-center mb-4">
                  <p.Icon size={20} className="text-[#FF2D2D]" />
                </div>
                <h3 className="font-bold text-lg mb-2">{p.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// LOSS CALCULATOR  (state lifted to page so pricing can reuse monthlyLoss)
// ────────────────────────────────────────────────────────────────
function Slider({ label, value, min, max, step, onChange, format }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; format: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm text-white/70">{label}</label>
        <span className="text-base font-black text-white tabular-nums">{format(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#FF2D2D]"
        style={{ background: `linear-gradient(to right, #FF2D2D ${pct}%, rgba(255,255,255,0.12) ${pct}%)` }}
      />
    </div>
  );
}

function LossCalculator({ perDay, setPerDay, entryVal, setEntryVal, days, setDays, monthlyLoss, yearlyLoss }: {
  perDay: number; setPerDay: (v: number) => void;
  entryVal: number; setEntryVal: (v: number) => void;
  days: number; setDays: (v: number) => void;
  monthlyLoss: number; yearlyLoss: number;
}) {
  const payback = Math.max(0.2, PRICE_NOW / Math.max(1, monthlyLoss)); // months to recoup the one-time cost
  return (
    <section id="loss" className="py-16 sm:py-24 border-t border-white/10 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal>
          <p className="text-[#FF2D2D] font-bold uppercase tracking-[0.18em] text-xs mb-3">The cost of doing nothing</p>
          <h2 className="text-3xl sm:text-4xl font-black leading-tight max-w-2xl">
            See exactly how much tailgating is costing you.
          </h2>
        </Reveal>

        <div className="mt-10 grid lg:grid-cols-2 gap-6 items-stretch">
          {/* inputs */}
          <Reveal className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 space-y-7">
            <Slider label="Tailgaters caught per day" value={perDay} min={1} max={20} step={1} onChange={setPerDay} format={(v) => `${v}`} />
            <Slider label="Value of one entry (lost day-pass / member)" value={entryVal} min={15} max={150} step={5} onChange={setEntryVal} format={fmtRM} />
            <Slider label="Days open per month" value={days} min={20} max={31} step={1} onChange={setDays} format={(v) => `${v}`} />
            <p className="text-xs text-white/40 pt-1">Drag the sliders to match your gym. Defaults are conservative.</p>
          </Reveal>

          {/* result */}
          <Reveal delay={0.1} className="relative rounded-2xl border border-[#FF2D2D]/40 bg-gradient-to-br from-[#FF2D2D]/15 to-[#1a0606] p-6 sm:p-8 flex flex-col justify-center overflow-hidden">
            <div aria-hidden className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#FF2D2D]/20 blur-3xl" />
            <div className="relative">
              <p className="text-sm font-bold uppercase tracking-wider text-[#ff8a8a] mb-1">You're losing about</p>
              <div className="text-5xl sm:text-6xl font-black text-white leading-none">
                <CountUp value={monthlyLoss} prefix="RM" /><span className="text-2xl text-white/50 font-bold"> /month</span>
              </div>
              <div className="mt-3 text-2xl font-black text-[#FF2D2D]">
                = <CountUp value={yearlyLoss} prefix="RM" /> <span className="text-base text-white/50 font-bold">/year</span>
              </div>
              <p className="mt-4 text-white/70 text-sm leading-relaxed">
                That's <span className="font-bold text-white">{fmtRM(yearlyLoss)}</span> walking past your front desk — free.
              </p>

              <div className="mt-6 rounded-xl bg-black/40 border border-white/10 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">QSentry pays for itself in</span>
                  <span className="font-bold text-[#4ade80]">{payback < 1 ? `${Math.ceil(payback * 4)} weeks` : `${payback.toFixed(1)} months`}</span>
                </div>
              </div>
              <a href="#demo" className="mt-5 inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-[#FF2D2D] hover:bg-[#ff4747] text-white font-bold px-6 py-3.5 rounded-full transition-colors">
                Stop the leak — Book a free demo <ArrowRight size={17} />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// HOW IT WORKS
// ────────────────────────────────────────────────────────────────
const STEPS: { Icon: LucideIcon; title: string; body: string }[] = [
  { Icon: ScanFace, title: 'Detects', body: 'AI spots two people entering on one tap — instantly, day and night.' },
  { Icon: Siren, title: 'Alarms', body: 'Red flashing lights + buzzer sound the moment a tailgater is caught.' },
  { Icon: Camera, title: 'Captures', body: 'Snaps a photo and short video clip of the offender. No more "it wasn\'t me".' },
  { Icon: Smartphone, title: 'Reports', body: 'Alert lands on your phone with date, time, photo & video — even when you\'re away.' },
];

function HowItWorks() {
  return (
    <section id="how" className="py-16 sm:py-24 border-t border-white/10 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal>
          <p className="text-[#FF2D2D] font-bold uppercase tracking-[0.18em] text-xs mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-black leading-tight max-w-2xl">
            QSentry watches the door so you don't have to.
          </h2>
        </Reveal>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <div className="relative h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <span className="absolute top-5 right-5 text-5xl font-black text-white/5">{i + 1}</span>
                <div className="w-12 h-12 rounded-xl bg-[#FF2D2D]/10 border border-[#FF2D2D]/30 flex items-center justify-center mb-4">
                  <s.Icon size={22} className="text-[#FF2D2D]" />
                </div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// CAPTURE PROOF  (photo + video + phone alert)
// ────────────────────────────────────────────────────────────────
function CaptureProof() {
  return (
    <section className="py-16 sm:py-24 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal>
          <p className="text-[#FF2D2D] font-bold uppercase tracking-[0.18em] text-xs mb-3">Proof in your pocket</p>
          <h2 className="text-3xl sm:text-4xl font-black leading-tight max-w-2xl">
            Photo, video & instant alert — every time.
          </h2>
          <p className="mt-4 text-white/60 max-w-2xl text-lg">
            The moment QSentry catches a tailgater, it captures a clear photo and a short video clip,
            then pings your phone with the date and time. Undeniable evidence, handled your way.
          </p>
        </Reveal>

        <div className="mt-10 grid lg:grid-cols-3 gap-6 items-start">
          <Reveal className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3 text-sm font-bold text-white/70"><Camera size={16} className="text-[#FF2D2D]" /> Real captured footage</div>
            <Photo src={IMG.footage} alt="QSentry AI capturing a tailgater entering behind a member" ratio="aspect-video" contain={false} />
            <p className="mt-3 text-xs text-white/40">Live detection box flags the second person entering on one tap.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex items-center gap-2 mb-3 text-sm font-bold text-white/70"><Bell size={16} className="text-[#FF2D2D]" /> Alert on your phone</div>
            <Photo src={IMG.phone} alt="QSentry AI tailgating alert delivered to a mobile phone with date and time" ratio="aspect-[1080/1147]" />
            <p className="mt-3 text-xs text-white/40">Date, time, photo & video — wherever you are.</p>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[#FF2D2D]/30 bg-[#FF2D2D]/[0.06] p-5 flex items-start gap-3">
            <Video size={20} className="text-[#FF2D2D] mt-0.5 shrink-0" />
            <div>
              <h3 className="font-bold">Photo <span className="text-white/50">+</span> video capture</h3>
              <p className="text-sm text-white/55 mt-1">Not just a still — a short clip of the exact moment, so there's no argument.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex items-start gap-3">
            <Lock size={20} className="text-[#FF2D2D] mt-0.5 shrink-0" />
            <div>
              <h3 className="font-bold">Privacy-first — no video stored</h3>
              <p className="text-sm text-white/55 mt-1">QSentry doesn't record your members. It only captures tailgaters. PDPA-friendly, trust-safe.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// FEATURES / WHY
// ────────────────────────────────────────────────────────────────
const FEATURES: { Icon: LucideIcon; title: string; body: string }[] = [
  { Icon: ScanFace, title: 'Catches what staff miss', body: 'AI auto-detection runs 24/7 — never blinks, never takes a break.' },
  { Icon: Siren, title: 'Freeloaders know they\'re caught', body: 'Instant red flashing lights + buzzer. The deterrent alone stops repeat offenders.' },
  { Icon: Smartphone, title: 'Proof in your pocket', body: 'Date, time, photo & video sent straight to your phone. Handle it your way.' },
  { Icon: Lock, title: 'No video recorded, ever', body: 'Only tailgaters are captured. PDPA-friendly and safe for member trust.' },
  { Icon: Wrench, title: 'Easy to install', body: 'Up and running in one visit. No rewiring, no IT team needed.' },
  { Icon: BadgeCheck, title: '2-year warranty', body: 'We stand behind the hardware — two full years, covered.' },
];

function Features() {
  return (
    <section id="features" className="py-16 sm:py-24 border-t border-white/10 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal>
          <p className="text-[#FF2D2D] font-bold uppercase tracking-[0.18em] text-xs mb-3">Why QSentry AI</p>
          <h2 className="text-3xl sm:text-4xl font-black leading-tight max-w-2xl">Built for Malaysian gyms. Nothing else like it.</h2>
        </Reveal>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.06}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-[#FF2D2D]/30 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-[#FF2D2D]/10 border border-[#FF2D2D]/30 flex items-center justify-center mb-4">
                  <f.Icon size={20} className="text-[#FF2D2D]" />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* spec sheet image — shown in full */}
        <Reveal delay={0.1} className="mt-10">
          <Photo src={IMG.specs} alt="QSentry AI anti-tailgater camera — 21.5-inch FHD display, 4K wide-angle camera, red/green alert light, wall or ceiling mount" ratio="aspect-[2368/1572]" />
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// SPECIFICATIONS
// ────────────────────────────────────────────────────────────────
// Every spec here is also printed on qsentryai-specs.jpg. Crawlers and screen
// readers can't read a JPEG — so the same numbers live as real text below, and
// feed the Product schema's additionalProperty list. Keep the two in sync.
const SPECS: { label: string; value: string }[] = [
  { label: 'Camera',            value: '4K Ultra HD, wide-angle lens' },
  { label: 'Display',           value: '21.5" FHD screen for clear real-time monitoring' },
  { label: 'Detection',         value: 'On-device AI — tailgating & intrusion alert, 24/7' },
  { label: 'Alert light',       value: 'Red / green indicator bar for instant visual notification' },
  { label: 'Audible alarm',     value: 'Built-in buzzer triggered on detection' },
  { label: 'Tilt range',        value: 'Manual adjustable tilt, +15° to −30°' },
  { label: 'Housing',           value: '3D-printed high-strength PLA+, ventilated for heat dissipation' },
  { label: 'Form factor',       value: 'All-in-one — screen, camera and alert system in a single unit' },
  { label: 'Mounting',          value: 'Wall or ceiling mount, flexible for any entrance layout' },
  { label: 'Capture',           value: 'Photo + short video clip of each tailgating event' },
  { label: 'Notifications',     value: 'Mobile alert with date, time, photo and video' },
  { label: 'Offline operation', value: 'Keeps detecting and capturing without internet; queued alerts send on reconnect' },
  { label: 'Recording',         value: 'None — members are never recorded, only tailgating events are captured' },
  { label: 'Warranty',          value: '2-year hardware warranty' },
  { label: 'Availability',      value: 'Preorder — installation and demos in Klang Valley, Malaysia' },
];

function SpecsTable() {
  return (
    <section id="specs" className="py-16 sm:py-24 border-t border-white/10 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Reveal>
          <p className="text-[#FF2D2D] font-bold uppercase tracking-[0.18em] text-xs mb-3">Specifications</p>
          <h2 className="text-3xl sm:text-4xl font-black leading-tight">
            QSentry AI anti-tailgater camera — full specs.
          </h2>
          <p className="mt-4 text-white/60 text-lg">
            One unit at your entrance does everything: watches, alarms, captures and reports.
            No separate server, no extra cameras, no rewiring.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="mt-8 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <caption className="sr-only">QSentry AI anti-tailgater camera technical specifications</caption>
            <tbody>
              {SPECS.map((s) => (
                <tr key={s.label} className="border-b border-white/10 align-top">
                  <th scope="row" className="py-3 pr-6 text-sm font-bold text-white/80 whitespace-nowrap w-[38%] sm:w-[30%]">
                    {s.label}
                  </th>
                  <td className="py-3 text-sm text-white/60 leading-relaxed">{s.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// PRICING  (with feature checklist + "you prevent / month")
// ────────────────────────────────────────────────────────────────
const INCLUDED = [
  'QSentry AI anti-tailgater camera',
  'Automatic tailgating detection (24/7)',
  'Red flashing lights + buzzer alarm',
  'Photo + video capture of every offender',
  'Instant mobile alerts (date / time / proof)',
  'Privacy-first — no video recorded',
  'Easy installation included',
  '2-year hardware warranty',
  '30-day money-back guarantee',
];

function Pricing({ monthlyLoss }: { monthlyLoss: number }) {
  return (
    <section id="pricing" className="py-16 sm:py-24 border-t border-white/10 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal>
          <p className="text-[#FF2D2D] font-bold uppercase tracking-[0.18em] text-xs mb-3 text-center">Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-black leading-tight text-center max-w-2xl mx-auto">
            One-time setup. Then it pays for itself — every month.
          </h2>
        </Reveal>

        <div className="mt-10 grid lg:grid-cols-2 gap-6 items-stretch max-w-4xl mx-auto">
          {/* price card */}
          <Reveal className="relative rounded-3xl border border-[#FF2D2D]/40 bg-gradient-to-b from-[#1a0606] to-[#0E0E0E] p-7 sm:p-8 overflow-hidden">
            <div aria-hidden className="absolute -right-16 -top-16 w-52 h-52 rounded-full bg-[#FF2D2D]/15 blur-3xl" />
            <div className="relative blur-[18px] select-none pointer-events-none" aria-hidden="true">
              <span className="inline-block rounded-full bg-[#FF2D2D] text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 mb-4">Preorder · Intro price</span>
              <div className="flex items-end gap-3">
                <span className="text-white/40 line-through text-2xl font-bold">{fmtRM(PRICE_RRP)}</span>
                <span className="text-5xl sm:text-6xl font-black text-white leading-none">{fmtRM(PRICE_NOW)}</span>
              </div>
              <p className="mt-2 text-white/60">one-time hardware &amp; setup</p>

              <a href="#demo" className="mt-5 inline-flex w-full items-center justify-center gap-2 bg-[#FF2D2D] hover:bg-[#ff4747] text-white font-bold px-6 py-4 rounded-full transition-colors shadow-[0_0_30px_rgba(255,45,45,0.35)]">
                Preorder Now · Book Free Demo <ArrowRight size={18} />
              </a>

              {/* prevented per month — tied to the calculator */}
              <div className="mt-6 rounded-2xl bg-[#0a2a14]/60 border border-[#4ade80]/30 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#4ade80] mb-1">You'd prevent about</p>
                <div className="text-3xl font-black text-white leading-none">
                  <CountUp value={monthlyLoss} prefix="RM" /><span className="text-base text-white/50 font-bold"> /month in losses</span>
                </div>
                <p className="mt-2 text-sm text-white/60">
                  That's money straight back in your pocket — QSentry pays for itself in weeks.
                </p>
              </div>
              <p className="mt-3 text-xs text-white/40 flex items-center gap-1.5"><RotateCcw size={13} /> 30-day Money-back Guarantee — if you're not satisfied for any reason, we give it back.</p>
            </div>

            {/* price gate — blurred price; tap anywhere to go to the form */}
            <a href="#demo" className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/65 backdrop-blur-md text-center px-6 cursor-pointer group">
              <span className="w-14 h-14 rounded-full bg-[#FF2D2D]/20 border border-[#FF2D2D]/50 flex items-center justify-center shadow-[0_0_24px_rgba(255,45,45,0.35)]">
                <Lock size={24} className="text-[#FF2D2D]" />
              </span>
              <span className="text-2xl font-black text-white">Unlock your price</span>
              <span className="text-sm text-white/70 max-w-[18rem]">Book a free demo and we'll reveal your full preorder price &amp; launch offer.</span>
              <span className="mt-1 inline-flex items-center gap-2 bg-[#FF2D2D] group-hover:bg-[#ff4747] text-white font-bold px-6 py-3.5 rounded-full transition-colors shadow-[0_0_30px_rgba(255,45,45,0.4)]">
                Reveal Price · Book Free Demo <ArrowRight size={17} />
              </span>
            </a>
          </Reveal>

          {/* checklist */}
          <Reveal delay={0.1} className="rounded-3xl border border-white/10 bg-white/[0.02] p-7 sm:p-8">
            <h3 className="font-bold text-lg mb-5">Everything included</h3>
            <ul className="space-y-3">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-[#FF2D2D]/15 border border-[#FF2D2D]/40 flex items-center justify-center shrink-0">
                    <Check size={12} className="text-[#FF2D2D]" />
                  </span>
                  <span className="text-sm text-white/75">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// TRUST STRIP
// ────────────────────────────────────────────────────────────────
function TrustStrip() {
  const items: { Icon: LucideIcon; label: string }[] = [
    { Icon: ShieldCheck, label: 'First in Malaysia' },
    { Icon: Lock, label: 'Privacy-First' },
    { Icon: BadgeCheck, label: '2-Year Warranty' },
    { Icon: RotateCcw, label: '30-Day Money-Back' },
  ];
  return (
    <section className="py-10 border-t border-white/10 bg-white/[0.015]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-2.5 justify-center text-center">
            <it.Icon size={20} className="text-[#FF2D2D] shrink-0" />
            <span className="text-sm font-bold text-white/80">{it.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// FAQ
// ────────────────────────────────────────────────────────────────
// Single source of truth for the FAQ. `a` renders the accordion, `plain` feeds the
// FAQPage schema — one array so the two can never drift apart. Google requires the
// marked-up answer to match what a visitor reads, so `plain` must stay a faithful
// plain-text version of `a`, not a different pitch.
const FAQS: { q: string; a: ReactNode; plain: string }[] = [
  {
    q: 'What is tailgating at a gym?',
    a: (
      <>
        Tailgating is when one paying member taps or scans in and a
        <span className="text-white font-semibold"> second person walks through the same opening behind them</span> —
        a friend, a partner, a lapsed member. Turnstiles and access-control gates count the tap, not the bodies,
        so the extra entry never appears anywhere in your system. It's the most common and least
        measured source of lost revenue in Malaysian gyms.
      </>
    ),
    plain:
      'Tailgating is when one paying member taps or scans in and a second person walks through the same opening behind them — a friend, a partner, or a lapsed member. Turnstiles and access-control gates count the tap, not the bodies, so the extra entry never appears in your system. It is the most common and least measured source of lost revenue in Malaysian gyms.',
  },
  {
    q: 'Why QSentry AI?',
    a: (
      <>
        So many gyms want to go <span className="text-white font-semibold">24/7 and staffless</span> — our
        Studio solutions already make that possible. But the one big deterrent is tailgaters: members
        bringing friends in for free. That's why our team works day and night to counter it — and
        QSentry AI is the answer.
      </>
    ),
    plain:
      'Many gyms want to run 24/7 and staffless, and our Studio solutions already make that possible. The one big deterrent is tailgaters — members bringing friends in for free. QSentry AI was built specifically to counter that.',
  },
  {
    q: 'How does QSentry AI detect a tailgater?',
    a: (
      <>
        A 4K wide-angle camera watches the entrance and on-device AI counts the people passing through on
        each single entry event. When it sees two bodies on one tap, it fires immediately:
        <span className="text-white font-semibold"> red flashing light and buzzer</span>, then a photo and a
        short video clip of the offender, then a push alert to your phone with the date and time.
        The whole sequence takes seconds and needs no staff involvement.
      </>
    ),
    plain:
      'A 4K wide-angle camera watches the entrance and on-device AI counts the people passing through on each entry event. When it detects two bodies on one tap it triggers a red flashing light and buzzer, captures a photo and a short video clip of the offender, and pushes an alert to your phone with the date and time. The whole sequence takes seconds and needs no staff involvement.',
  },
  {
    q: 'Is QSentry AI an AI CCTV camera? How is it different from normal CCTV?',
    a: (
      <>
        Yes — QSentry AI is an <span className="text-white font-semibold">AI CCTV purpose-built for
        anti-tailgating</span>. A normal CCTV just records hours of footage for you to scrub through after
        the fact; QSentry AI watches your entrance live, counts the people on each entry, and
        <span className="text-white font-semibold"> acts in the moment</span> — alarm, photo + video capture,
        and an alert to your phone. And unlike regular CCTV it doesn't record continuously, which keeps it
        privacy-first and PDPA-friendly.
      </>
    ),
    plain:
      "Yes — QSentry AI is an AI CCTV purpose-built for anti-tailgating. A normal CCTV just records hours of footage for you to review after the fact; QSentry AI watches your entrance live, counts the people on each entry, and acts in the moment — alarm, photo and video capture, and an alert to your phone. Unlike regular CCTV it does not record continuously, which keeps it privacy-first and PDPA-friendly.",
  },
  {
    q: 'What if a tailgater covers their face (mask, helmet, cap)?',
    a: (
      <>
        Still caught. QSentry doesn't rely on faces — its AI reads the
        <span className="text-white font-semibold"> whole-body structure and movement</span> to detect a second
        person slipping through. So masks, helmets, caps or hoodies won't fool it.
      </>
    ),
    plain:
      "Still caught. QSentry does not rely on faces — its AI reads whole-body structure and movement to detect a second person slipping through, so masks, helmets, caps or hoodies won't fool it.",
  },
  {
    q: 'Does it work with my existing turnstile, door lock or access control?',
    a: (
      <>
        Yes. QSentry AI is a <span className="text-white font-semibold">standalone unit that sits above or beside
        your entrance</span> — it watches the opening rather than plugging into your gate, so it works over a
        turnstile, a door or gate lock, or even a manned front counter. You keep whatever access system,
        membership software or POS you already run; nothing has to be replaced or rewired.
      </>
    ),
    plain:
      'Yes. QSentry AI is a standalone unit that mounts above or beside your entrance and watches the opening rather than plugging into your gate, so it works with a turnstile, a door or gate lock, or a manned front counter. You keep whatever access system, membership software or POS you already run — nothing has to be replaced or rewired.',
  },
  {
    q: 'Does QSentry AI record my members? Is it PDPA compliant?',
    a: (
      <>
        No continuous recording, ever. QSentry does not keep footage of members going about their workout —
        it only captures the <span className="text-white font-semibold">moment a tailgating event is detected</span>,
        as a photo and a short clip held as evidence for you. That data-minimising design is what makes it
        privacy-first and comfortable under Malaysia's PDPA. As with any camera at an entrance, you should
        still display a notice at the door telling visitors that monitoring is in place.
      </>
    ),
    plain:
      "No continuous recording. QSentry does not keep footage of members going about their workout — it only captures the moment a tailgating event is detected, as a photo and a short clip held as evidence. That data-minimising design is what makes it privacy-first and comfortable under Malaysia's PDPA. As with any entrance camera, you should still display a notice at the door telling visitors that monitoring is in place.",
  },
  {
    q: 'Will it work without internet?',
    a: (
      <>
        Yes! It keeps detecting and capturing even when offline — you'll just receive the
        notifications <span className="text-white font-semibold">a little later instead of live</span>.
        The moment the internet is back, every captured image is sent straight to you.
      </>
    ),
    plain:
      'Yes. It keeps detecting and capturing even when offline; you simply receive the notifications a little later instead of live. The moment the internet is back, every captured image is sent straight to you.',
  },
  {
    q: 'How long does installation take?',
    a: (
      <>
        One visit. QSentry AI is an all-in-one unit — screen, camera and alarm in a single housing — that
        wall- or ceiling-mounts at your entrance with an adjustable tilt to suit your layout.
        <span className="text-white font-semibold"> No rewiring, no server, no IT team.</span> Installation is
        included in the price.
      </>
    ),
    plain:
      'One visit. QSentry AI is an all-in-one unit — screen, camera and alarm in a single housing — that wall- or ceiling-mounts at your entrance with an adjustable tilt to suit your layout. No rewiring, no server and no IT team required, and installation is included in the price.',
  },
  {
    q: 'How much does QSentry AI cost?',
    a: (
      <>
        QSentry AI is a <span className="text-white font-semibold">one-time hardware and setup cost</span> —
        there is no monthly subscription to catch tailgaters. Hardware, installation, the 2-year warranty and
        the 30-day money-back guarantee are all included. We're in preorder at a launch price below RRP, so
        book a free demo and we'll confirm your exact price and current offer.
      </>
    ),
    plain:
      'QSentry AI is a one-time hardware and setup cost — there is no monthly subscription to catch tailgaters. Hardware, installation, the 2-year warranty and the 30-day money-back guarantee are all included. The unit is currently in preorder at a launch price below RRP; book a free demo to confirm your exact price and the current offer.',
  },
  {
    q: 'Where in Malaysia do you install and demo?',
    a: (
      <>
        Free on-site demos are <span className="text-white font-semibold">Klang Valley</span> (Kuala Lumpur,
        Selangor, Petaling Jaya, Subang, Shah Alam, Cheras, Puchong) with limited slots each week. Outside the
        Klang Valley we run a virtual demo first and arrange installation from there — tell us your location
        when you book.
      </>
    ),
    plain:
      'Free on-site demos are available in the Klang Valley — Kuala Lumpur, Selangor, Petaling Jaya, Subang, Shah Alam, Cheras and Puchong — with limited slots each week. Outside the Klang Valley we run a virtual demo first and arrange installation from there; tell us your location when you book.',
  },
  {
    q: 'What if I have a problem?',
    a: (
      <>
        We've got you covered. Our team
        <span className="text-white font-semibold"> supports your site</span> — if anything goes
        wrong, we'll help you resolve it.
      </>
    ),
    plain:
      'Our team supports your site — if anything goes wrong, we will help you resolve it. The unit also carries a 2-year hardware warranty.',
  },
  {
    q: 'Is there really a money-back guarantee?',
    a: (
      <>
        Yes, absolutely. Simply return the unit to us <span className="text-white font-semibold">whole and
        undamaged</span> within 30 days, and we will refund you in full — <span className="text-white font-semibold">no
        questions asked.</span>
      </>
    ),
    plain:
      'Yes. Return the unit whole and undamaged within 30 days and we will refund you in full, no questions asked.',
  },
];

function FaqItem({ q, a, open, onToggle }: { q: string; a: ReactNode; open: boolean; onToggle: () => void }) {
  return (
    <div className="border border-white/10 rounded-2xl bg-white/[0.02] overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-4 hover:bg-white/[0.03] transition-colors"
        aria-expanded={open}
      >
        <span className="font-bold text-base sm:text-lg">{q}</span>
        <ChevronDown size={20} className={`shrink-0 text-[#FF2D2D] transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className="grid transition-all duration-300" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
        <div className="overflow-hidden">
          <p className="px-5 sm:px-6 pb-5 text-white/60 text-sm sm:text-base leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}

function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section id="faq" className="py-16 sm:py-24 border-t border-white/10 scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Reveal>
          <p className="text-[#FF2D2D] font-bold uppercase tracking-[0.18em] text-xs mb-3 text-center">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-black leading-tight text-center">Questions, answered.</h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-8 space-y-3">
          {FAQS.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} open={openIdx === i} onToggle={() => setOpenIdx((cur) => (cur === i ? null : i))} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// DEMO FORM — guided multi-step: loss → demo type → details → questions
// ────────────────────────────────────────────────────────────────
type DemoType = 'onsite' | 'virtual';

const SYSTEM_OPTIONS = [
  { v: 'manual', label: 'Manual', detail: '' },
  { v: 'saas', label: 'SaaS platform', detail: 'Which platform?' },
  { v: 'others', label: 'Others', detail: 'Please specify' },
];
const GATE_OPTIONS = [
  { v: 'turnstile', label: 'Turnstile' },
  { v: 'door', label: 'Door / gate lock' },
  { v: 'manual', label: 'Manual (staff / human)' },
];
const INTEREST_OPTIONS = [
  { v: 'qsentry', label: 'QSentry AI (anti-tailgater)' },
  { v: 'payments', label: 'Recurring payment solutions' },
  { v: 'pos', label: 'POS systems' },
  { v: 'membership', label: 'Membership management' },
  { v: 'faceid', label: 'Face ID access gate' },
  { v: 'app', label: 'Membership app' },
  { v: 'online', label: 'Online platform' },
  { v: 'customized', label: 'Customized solutions' },
  { v: 'others', label: 'Others' },
];
const STEP_LABELS = ['Your loss', 'Demo', 'Details', 'Questions'];

// generic full-width single-choice row
function ChoiceRow({ active, title, sub, onClick }: { active: boolean; title: string; sub?: string; onClick: () => void }) {
  return (
    <button
      type="button" onClick={onClick} aria-pressed={active}
      className={`w-full text-left rounded-xl border px-4 py-3 transition-colors ${active ? 'border-[#4ade80] bg-[#4ade80]/10' : 'border-white/15 bg-black/40 hover:border-white/30'}`}
    >
      <span className="flex items-center gap-2.5 font-bold">
        <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${active ? 'border-[#4ade80]' : 'border-white/30'}`}>
          {active && <span className="w-2 h-2 rounded-full bg-[#4ade80]" />}
        </span>
        {title}
      </span>
      {sub && <span className="block mt-0.5 pl-[26px] text-xs text-white/45">{sub}</span>}
    </button>
  );
}

function DemoForm({ perDay, setPerDay, entryVal, setEntryVal, days, setDays, monthlyLoss, yearlyLoss }: {
  perDay: number; setPerDay: (v: number) => void;
  entryVal: number; setEntryVal: (v: number) => void;
  days: number; setDays: (v: number) => void;
  monthlyLoss: number; yearlyLoss: number;
}) {
  const [step, setStep] = useState(1); // 1..4
  const [editingLoss, setEditingLoss] = useState(false);
  const [form, setForm] = useState({ gym: '', name: '', phone: '', area: '' });
  const [phoneCode, setPhoneCode] = useState('+60');
  const [demoType, setDemoType] = useState<DemoType>('onsite');
  const [currentSystem, setCurrentSystem] = useState('');
  const [systemDetail, setSystemDetail] = useState('');
  const [accessGate, setAccessGate] = useState('');
  const [interests, setInterests] = useState<string[]>(['qsentry']);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const toggleInterest = (v: string) => setInterests((arr) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]));

  const demoLabel = demoType === 'onsite' ? 'Free on-site demo (Klang Valley)' : 'Virtual demo';
  const sysOpt = SYSTEM_OPTIONS.find((o) => o.v === currentSystem);
  const systemLabel = !sysOpt ? '-' : (sysOpt.detail && systemDetail.trim() ? `${sysOpt.label}: ${systemDetail.trim()}` : sysOpt.label);
  const gateLabel = GATE_OPTIONS.find((o) => o.v === accessGate)?.label || '-';
  const interestLabels = interests.map((v) => INTEREST_OPTIONS.find((o) => o.v === v)?.label || v).join(', ') || '-';
  const fullPhone = `${phoneCode} ${form.phone}`.trim();
  const infoValid = Boolean(form.gym && form.name && form.phone);

  const goNext = () => setStep((s) => Math.min(4, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const submit = async () => {
    setStatus('sending');
    try {
      const { error } = await supabase.from('qsentry_demo_requests').insert({
        gym_name: form.gym,
        contact_name: form.name,
        contact_phone: fullPhone,
        area: form.area || null,
        demo_type: demoType,
        current_system: currentSystem ? systemLabel : null,
        access_gate: accessGate || null,
        interests,
        est_monthly_loss: Math.round(monthlyLoss),
        calc: { perDay, entryVal, days },
      });
      if (error) throw error;
      // Conversion events — Meta Pixel + GA4 (both no-op if the tag isn't loaded).
      (window as any).fbq?.('track', 'Lead', { content_name: 'QSentry Demo Request', value: monthlyLoss, currency: 'MYR' });
      (window as any).gtag?.('event', 'generate_lead', {
        currency: 'MYR',
        value: monthlyLoss,
        lead_source: 'qsentry_demo_form',
        demo_type: demoType,
      });
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  // After submit — prefilled WhatsApp message carrying everything they entered.
  const waPrefilled = waLink(
    `I'm interested in QSentry AI and here's my info:\n` +
    `- Gym: ${form.gym}\n- Name: ${form.name}\n- Phone: ${fullPhone}\n- Location: ${form.area || '-'}\n` +
    `- Demo: ${demoLabel}\n- Current system: ${systemLabel}\n- Access gate: ${gateLabel}\n` +
    `- Interested in: ${interestLabels}\n- Est. loss: ${fmtRM(monthlyLoss)}/month`
  );

  return (
    <section id="demo" className="py-16 sm:py-24 border-t border-white/10 scroll-mt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl font-black leading-tight">Stop giving away free workouts.</h2>
          <p className="mt-4 text-white/65 text-lg max-w-xl mx-auto">
            Book a free demo — on-site (Klang Valley) or virtual. No cost, no obligation.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-8">
          {status === 'done' ? (
            <div className="rounded-3xl border border-[#4ade80]/40 bg-[#0a2a14]/40 p-8">
              <BadgeCheck size={40} className="text-[#4ade80] mx-auto mb-3" />
              <h3 className="text-2xl font-black">Thank you, {form.name.split(' ')[0] || 'there'}! 🎉</h3>
              <p className="mt-2 text-white/65 max-w-md mx-auto">
                We've received your request for a <span className="text-white font-semibold">{demoLabel}</span> and
                we'll be in touch. <span className="text-white font-semibold">Want a faster response?</span> Tap below
                to WhatsApp us — your details are already filled in.
              </p>
              <a href={waPrefilled} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-6 py-3.5 rounded-full transition-colors">
                <MessageCircle size={18} /> WhatsApp us for a faster response
              </a>
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 text-left">
              {/* stepper */}
              <div className="flex items-center justify-between mb-7">
                {STEP_LABELS.map((lbl, i) => {
                  const n = i + 1; const done = step > n; const cur = step === n;
                  return (
                    <div key={lbl} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors ${cur ? 'bg-[#FF2D2D] text-white' : done ? 'bg-[#FF2D2D]/30 text-white' : 'bg-white/10 text-white/40'}`}>
                          {done ? <Check size={15} /> : n}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ${cur ? 'text-white' : 'text-white/35'}`}>{lbl}</span>
                      </div>
                      {n < STEP_LABELS.length && <span className={`h-px flex-1 mx-1 ${done ? 'bg-[#FF2D2D]/40' : 'bg-white/10'}`} />}
                    </div>
                  );
                })}
              </div>

              {/* STEP 1 — your loss */}
              {step === 1 && (
                <div>
                  <h3 className="text-xl font-black">Here's what tailgaters are costing you</h3>

                  {editingLoss ? (
                    /* inline calculator — replaces the loss box */
                    <div className="mt-4 rounded-2xl border border-white/15 bg-black/40 p-5 space-y-6">
                      <Slider label="Tailgaters caught per day" value={perDay} min={1} max={20} step={1} onChange={setPerDay} format={(v) => `${v}`} />
                      <Slider label="Value of one entry (lost day-pass / member)" value={entryVal} min={15} max={150} step={5} onChange={setEntryVal} format={fmtRM} />
                      <Slider label="Days open per month" value={days} min={20} max={31} step={1} onChange={setDays} format={(v) => `${v}`} />
                      <div className="flex items-center justify-between pt-1 border-t border-white/10">
                        <span className="text-sm text-white/60">Your estimated loss</span>
                        <span className="text-2xl font-black text-white">{fmtRM(monthlyLoss)}<span className="text-sm text-white/50 font-bold"> /mo</span></span>
                      </div>
                      <button onClick={() => setEditingLoss(false)} className="inline-flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/15 text-white font-bold px-5 py-3 rounded-full transition-colors">
                        <Check size={16} /> Done
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 relative rounded-2xl border border-[#FF2D2D]/40 bg-gradient-to-br from-[#FF2D2D]/15 to-[#1a0606] p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#ff8a8a]">Your estimated loss</p>
                      <div className="text-4xl font-black text-white leading-none mt-1">{fmtRM(monthlyLoss)}<span className="text-lg text-white/50 font-bold"> /mo</span></div>
                      <div className="text-lg font-black text-[#FF2D2D] mt-1">= {fmtRM(yearlyLoss)} /year</div>
                      <button
                        onClick={() => setEditingLoss(true)}
                        className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-white/25 hover:border-white/50 bg-black/40 text-white text-xs font-bold px-3 py-1.5 transition-colors"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                    </div>
                  )}

                  <p className="mt-3 text-sm text-white/55">
                    Based on your numbers. Let's stop the leak — it starts with a free demo.
                  </p>
                  <button onClick={goNext} className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-[#FF2D2D] hover:bg-[#ff4747] text-white font-bold px-6 py-4 rounded-full transition-colors shadow-[0_0_30px_rgba(255,45,45,0.35)]">
                    Yes — book my free demo <ArrowRight size={18} />
                  </button>
                </div>
              )}

              {/* STEP 2 — demo type */}
              {step === 2 && (
                <div>
                  <h3 className="text-xl font-black">How would you like your demo?</h3>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <ChoiceRow active={demoType === 'onsite'} title="Free on-site demo" sub="Klang Valley only" onClick={() => setDemoType('onsite')} />
                    <ChoiceRow active={demoType === 'virtual'} title="Virtual demo" sub="Anywhere, over video" onClick={() => setDemoType('virtual')} />
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button onClick={goBack} className="px-5 py-3.5 rounded-full border border-white/20 hover:border-white/40 text-white font-semibold transition-colors">Back</button>
                    <button onClick={goNext} className="flex-1 inline-flex items-center justify-center gap-2 bg-[#FF2D2D] hover:bg-[#ff4747] text-white font-bold px-6 py-3.5 rounded-full transition-colors">Continue <ArrowRight size={17} /></button>
                  </div>
                </div>
              )}

              {/* STEP 3 — details */}
              {step === 3 && (
                <div>
                  <h3 className="text-xl font-black">Your details</h3>
                  <div className="mt-4 grid sm:grid-cols-2 gap-4">
                    <Field label="Gym name *" value={form.gym} onChange={set('gym')} placeholder="e.g. Iron Republic Gym" required />
                    <Field label="Your name *" value={form.name} onChange={set('name')} placeholder="e.g. Ahmad" required />
                    <PhoneField code={phoneCode} setCode={setPhoneCode} value={form.phone} onChange={set('phone')} />
                    <Field label="Gym location / area" value={form.area} onChange={set('area')} placeholder="e.g. Petaling Jaya" />
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button onClick={goBack} className="px-5 py-3.5 rounded-full border border-white/20 hover:border-white/40 text-white font-semibold transition-colors">Back</button>
                    <button onClick={goNext} disabled={!infoValid} className="flex-1 inline-flex items-center justify-center gap-2 bg-[#FF2D2D] hover:bg-[#ff4747] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-3.5 rounded-full transition-colors">Continue <ArrowRight size={17} /></button>
                  </div>
                </div>
              )}

              {/* STEP 4 — questions */}
              {step === 4 && (
                <div>
                  <h3 className="text-xl font-black">A few quick questions</h3>

                  <div className="mt-5">
                    <p className="text-sm font-semibold text-white/75 mb-2">1. What system is your gym currently using?</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {SYSTEM_OPTIONS.map((o) => <ChoiceRow key={o.v} active={currentSystem === o.v} title={o.label} onClick={() => { setCurrentSystem(o.v); setSystemDetail(''); }} />)}
                    </div>
                    {sysOpt?.detail && (
                      <input
                        value={systemDetail} onChange={(e) => setSystemDetail(e.target.value)}
                        placeholder={sysOpt.detail} autoFocus
                        className="mt-3 w-full rounded-xl bg-black/40 border border-white/15 focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none px-4 py-3 text-white placeholder:text-white/25 transition-colors"
                      />
                    )}
                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-semibold text-white/75 mb-2">2. Do you have an access gate?</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {GATE_OPTIONS.map((o) => <ChoiceRow key={o.v} active={accessGate === o.v} title={o.label} onClick={() => setAccessGate(o.v)} />)}
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-semibold text-white/75 mb-2">3. What are you most interested in? <span className="text-white/40 font-normal">(tick all)</span></p>
                    <div className="flex flex-wrap gap-2">
                      {INTEREST_OPTIONS.map((o) => {
                        const on = interests.includes(o.v);
                        return (
                          <button key={o.v} type="button" onClick={() => toggleInterest(o.v)}
                            className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors inline-flex items-center gap-1.5 ${on ? 'border-[#4ade80] bg-[#4ade80]/15 text-white' : 'border-white/15 text-white/55 hover:border-white/30'}`}>
                            {on && <Check size={13} className="text-[#4ade80]" />}{o.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {status === 'error' && (
                    <p className="mt-4 text-sm text-[#ff6b6b] flex items-center gap-1.5"><AlertTriangle size={15} /> Something went wrong — please try again.</p>
                  )}
                  <div className="mt-6 flex gap-3">
                    <button onClick={goBack} className="px-5 py-3.5 rounded-full border border-white/20 hover:border-white/40 text-white font-semibold transition-colors">Back</button>
                    <button onClick={submit} disabled={status === 'sending'} className="flex-1 inline-flex items-center justify-center gap-2 bg-[#FF2D2D] hover:bg-[#ff4747] disabled:opacity-60 text-white font-bold px-6 py-3.5 rounded-full transition-colors shadow-[0_0_30px_rgba(255,45,45,0.35)]">
                      {status === 'sending' ? 'Sending…' : 'Submit'} {status !== 'sending' && <ArrowRight size={17} />}
                    </button>
                  </div>
                  <p className="mt-4 text-center text-xs text-white/40">Free demo · No obligation · 30-day Money-back Guarantee.</p>
                </div>
              )}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, placeholder, required }: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm text-white/60">{label}</span>
      <input
        value={value} onChange={onChange} placeholder={placeholder} required={required}
        className="mt-1.5 w-full rounded-xl bg-black/40 border border-white/15 focus:border-[#FF2D2D] focus:ring-1 focus:ring-[#FF2D2D] outline-none px-4 py-3 text-white placeholder:text-white/25 transition-colors"
      />
    </label>
  );
}

// Phone input with a country-code selector. Defaults to Malaysia (+60).
const PHONE_CODES = [
  { code: '+60', label: '🇲🇾 +60' },
  { code: '+65', label: '🇸🇬 +65' },
  { code: '+62', label: '🇮🇩 +62' },
  { code: '+66', label: '🇹🇭 +66' },
  { code: '+673', label: '🇧🇳 +673' },
  { code: '+63', label: '🇵🇭 +63' },
  { code: '+84', label: '🇻🇳 +84' },
  { code: '+91', label: '🇮🇳 +91' },
  { code: '+61', label: '🇦🇺 +61' },
  { code: '+44', label: '🇬🇧 +44' },
  { code: '+1', label: '🇺🇸 +1' },
];

function PhoneField({ code, setCode, value, onChange }: {
  code: string; setCode: (c: string) => void; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm text-white/60">WhatsApp number *</span>
      <div className="mt-1.5 flex gap-2">
        <select
          value={code} onChange={(e) => setCode(e.target.value)} aria-label="Country code"
          className="rounded-xl bg-black/40 border border-white/15 focus:border-[#FF2D2D] focus:ring-1 focus:ring-[#FF2D2D] outline-none px-2.5 py-3 text-white text-sm shrink-0"
        >
          {PHONE_CODES.map((c) => <option key={c.code} value={c.code} className="bg-[#141414]">{c.label}</option>)}
        </select>
        <input
          type="tel" inputMode="tel" value={value} onChange={onChange} placeholder="12-345 6789" required
          className="flex-1 min-w-0 rounded-xl bg-black/40 border border-white/15 focus:border-[#FF2D2D] focus:ring-1 focus:ring-[#FF2D2D] outline-none px-4 py-3 text-white placeholder:text-white/25 transition-colors"
        />
      </div>
    </label>
  );
}

// ────────────────────────────────────────────────────────────────
// FOOTER + STICKY MOBILE CTA
// ────────────────────────────────────────────────────────────────
// The footer is this page's only outbound link surface. Without it /qsentry is a
// crawl dead end — nothing to follow, no path back into the rest of qbot.now — so
// the links below are load-bearing for SEO, not decoration. The address and phone
// repeat the NAP details in the site-wide Organization schema, which is what local
// search matches on.
function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <img src={IMG.logo} alt="QSentry AI" className="h-7 w-auto mx-auto mb-3" style={{ filter: 'invert(1) brightness(2)' }} />
          <p className="text-xs text-white/35">Malaysia's first anti-tailgater AI camera for gyms.</p>
        </div>

        <nav aria-label="Footer" className="mt-8 grid sm:grid-cols-3 gap-8 text-center sm:text-left">
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-wider text-white/70 mb-3">On this page</h2>
            <ul className="space-y-2 text-sm text-white/45">
              <li><a href="#problem" className="hover:text-[#FF2D2D] transition-colors">Gym tailgating — the problem</a></li>
              <li><a href="#loss" className="hover:text-[#FF2D2D] transition-colors">Tailgating loss calculator</a></li>
              <li><a href="#how" className="hover:text-[#FF2D2D] transition-colors">How QSentry AI works</a></li>
              <li><a href="#specs" className="hover:text-[#FF2D2D] transition-colors">Specifications</a></li>
              <li><a href="#faq" className="hover:text-[#FF2D2D] transition-colors">FAQ</a></li>
              <li><a href="#demo" className="hover:text-[#FF2D2D] transition-colors">Book a free demo</a></li>
            </ul>
          </div>
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-wider text-white/70 mb-3">More from QBot</h2>
            <ul className="space-y-2 text-sm text-white/45">
              <li><a href="/qstudio" className="hover:text-[#FF2D2D] transition-colors">STUDIO — gym & wellness platform</a></li>
              <li><a href="/qstudio/guide-for-gyms" className="hover:text-[#FF2D2D] transition-colors">Guide for gyms: Face-ID entry</a></li>
              <li><a href="/qstudio/pricing" className="hover:text-[#FF2D2D] transition-colors">STUDIO pricing</a></li>
              <li><a href="/about-us" className="hover:text-[#FF2D2D] transition-colors">About QBot</a></li>
              <li><a href="/contact-us" className="hover:text-[#FF2D2D] transition-colors">Contact us</a></li>
              <li><a href="/" className="hover:text-[#FF2D2D] transition-colors">QPOS home</a></li>
            </ul>
          </div>
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-wider text-white/70 mb-3">Talk to us</h2>
            <address className="not-italic space-y-2 text-sm text-white/45">
              <p>
                <a href={WA} target="_blank" rel="noopener noreferrer" className="hover:text-[#FF2D2D] transition-colors">
                  WhatsApp +6012-6909-189
                </a>
              </p>
              <p><a href="mailto:hello@qbot.now" className="hover:text-[#FF2D2D] transition-colors">hello@qbot.now</a></p>
              <p className="leading-relaxed">
                QBot Showroom, B3-6-13 Solaris Dutamas,<br />
                Jalan Dutamas 1, 50480 Kuala Lumpur, Malaysia
              </p>
              <p className="text-white/30">Mon–Fri, 10am–7pm</p>
            </address>
          </div>
        </nav>

        <p className="text-xs text-white/25 mt-10 text-center">
          © 2026 QSentry AI by QBot · Anti-tailgater AI camera · Free on-site demos across the Klang Valley
        </p>
      </div>
    </footer>
  );
}

// Floating "AI is watching" HUD badge — fixed top-right, sits below the header.
// Pulsing red dot + scanning eye to reinforce the live-AI feel; reassures on privacy.
function AiWatchingBadge() {
  return (
    <div className="fixed top-20 sm:top-28 right-3 sm:right-5 z-40 select-none pointer-events-none">
      <div className="group relative flex items-center gap-2.5 rounded-full bg-black/70 backdrop-blur-md border border-[#FF2D2D]/40 pl-3 pr-3.5 py-1.5 shadow-[0_0_22px_rgba(255,45,45,0.3)] overflow-hidden">
        {/* sweeping scan shimmer */}
        <span aria-hidden className="absolute inset-0 -translate-x-full animate-[qsentry-scan_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-[#FF2D2D]/20 to-transparent" />
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2D2D] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF2D2D]" />
        </span>
        <Eye size={13} className="relative text-[#FF2D2D] animate-pulse shrink-0" />
        <div className="relative leading-tight">
          <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.12em] text-white leading-[1.15]">AI is watching<br />tailgaters!</div>
          <div className="text-[8px] sm:text-[9px] text-white/50 mt-0.5">No recording</div>
        </div>
      </div>
    </div>
  );
}

function StickyCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const h = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <div className={`lg:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-[#0A0A0A]/90 backdrop-blur-md border-t border-white/10 transition-transform duration-300 ${show ? 'translate-y-0' : 'translate-y-full'}`}>
      <a href="#demo" className="flex items-center justify-center gap-2 bg-[#FF2D2D] text-white font-bold px-6 py-3.5 rounded-full shadow-[0_0_24px_rgba(255,45,45,0.4)]">
        Get a FREE Demo <ArrowRight size={17} />
      </a>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// STRUCTURED DATA — Product + FAQ + Video + Breadcrumb rich results
// ────────────────────────────────────────────────────────────────
// The FAQ answers come straight from FAQS above (`plain`), so the markup can
// never claim something the visitor doesn't actually read on the page.
// A near-identical copy of this graph is baked into dist/qsentry/index.html by
// scripts/prerender-meta.mjs for crawlers that don't execute JS.
const ORIGIN = 'https://qbot.now';

function SeoJsonLd() {
  const data = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': `${ORIGIN}/qsentry#product`,
      name: 'QSentry AI — Anti-Tailgating AI CCTV Camera for Gyms',
      alternateName: ['QSentry', 'QSentry AI CCTV camera for gyms', 'QSentry AI tailgating detection camera'],
      sku: 'QSENTRY-AI-01',
      image: [
        `${ORIGIN}/qsentry_img/sentrysharer.jpg`,
        `${ORIGIN}/qsentry_img/qsentryai-specs.jpg`,
        `${ORIGIN}/qsentry_img/sentryrealfootage.jpg`,
      ],
      description:
        "Malaysia's first anti-tailgating AI CCTV camera for gyms. Auto-detects members sneaking friends in, sounds a red-light and buzzer alarm, and captures photo + video proof sent to your phone. Privacy-first: no continuous recording. One-time cost, 2-year warranty, 30-day money-back guarantee.",
      brand: { '@type': 'Brand', name: 'QSentry AI' },
      manufacturer: { '@type': 'Organization', name: 'QBot', url: ORIGIN },
      category: 'AI CCTV Security Camera',
      audience: { '@type': 'BusinessAudience', name: 'Gyms, fitness studios and 24/7 staffless facilities' },
      additionalProperty: SPECS.map((s) => ({
        '@type': 'PropertyValue',
        name: s.label,
        value: s.value,
      })),
      offers: {
        '@type': 'Offer',
        url: `${ORIGIN}/qsentry`,
        priceCurrency: 'MYR',
        price: String(PRICE_NOW),
        availability: 'https://schema.org/PreOrder',
        priceValidUntil: '2026-12-31',
        areaServed: { '@type': 'Country', name: 'Malaysia' },
        seller: { '@type': 'Organization', name: 'QBot', url: ORIGIN, telephone: '+60126909189' },
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: 'MY',
          returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
          merchantReturnDays: 30,
          returnMethod: 'https://schema.org/ReturnByMail',
          returnFees: 'https://schema.org/FreeReturn',
        },
        warranty: {
          '@type': 'WarrantyPromise',
          durationOfWarranty: { '@type': 'QuantitativeValue', value: 2, unitCode: 'ANN' },
        },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${ORIGIN}/qsentry#faq`,
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.plain },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      '@id': `${ORIGIN}/qsentry#demo-video`,
      name: 'QSentry AI catching a gym tailgater in real time',
      description:
        'Live footage from a Malaysian gym: a second person follows a member through the turnstile and QSentry AI flags the tailgating event, triggers the alarm and captures photo and video proof.',
      thumbnailUrl: [`${ORIGIN}${IMG.poster}`],
      contentUrl: `${ORIGIN}${IMG.video}`,
      uploadDate: '2026-06-28',
      isFamilyFriendly: true,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'QBot', item: ORIGIN },
        { '@type': 'ListItem', position: 2, name: 'QSentry AI — Anti-Tailgater Camera for Gyms', item: `${ORIGIN}/qsentry` },
      ],
    },
  ];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

// ────────────────────────────────────────────────────────────────
// PAGE
// ────────────────────────────────────────────────────────────────
export default function QSentryPage() {
  // Loss-calculator state lifted to page level so Pricing + DemoForm can reuse it.
  const [perDay, setPerDay] = useState(3);
  const [entryVal, setEntryVal] = useState(50);
  const [days, setDays] = useState(30);
  const monthlyLoss = perDay * entryVal * days;
  const yearlyLoss = monthlyLoss * 12;

  const scrollHint = useCallback(() => {
    document.getElementById('loss')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white antialiased selection:bg-[#FF2D2D] selection:text-white">
      <style>{`@keyframes qsentry-scan { 0% { transform: translateX(-100%); } 60%, 100% { transform: translateX(100%); } }`}</style>
      <SEOHead
        title="QSentry AI — Anti-Tailgating AI CCTV Camera for Gyms in Malaysia"
        description="Malaysia's first anti-tailgating AI CCTV camera for gyms. QSentry AI auto-catches every tailgater — instant alarm, photo & video proof to your phone. Privacy-first: no recording. Preorder + free Klang Valley demo."
        keywords="QSentry, QSentry AI, AI CCTV, AI CCTV Malaysia, AI CCTV camera for gym, anti-tailgating camera Malaysia, anti tailgater camera, anti-tailgating system Malaysia, gym tailgating, catch gym tailgaters, tailgating detection AI, gym security camera Malaysia, gym access control Malaysia, 24/7 staffless gym"
        url="https://qbot.now/qsentry"
        image="https://qbot.now/qsentry_img/sentrysharer.jpg"
        imageWidth={1200}
        imageHeight={630}
        imageAlt="QSentry AI — Malaysia's first anti-tailgating AI CCTV camera for gyms"
        noTitleSuffix
      />
      <SeoJsonLd />
      <Header />
      <main id="main">
        <Hero />
        <button onClick={scrollHint} aria-label="Scroll" className="mx-auto -mt-6 mb-2 hidden sm:flex items-center justify-center w-full text-white/30 hover:text-white/60 transition-colors">
          <ChevronDown className="animate-bounce" size={22} />
        </button>
        <Problem />
        <LossCalculator
          perDay={perDay} setPerDay={setPerDay}
          entryVal={entryVal} setEntryVal={setEntryVal}
          days={days} setDays={setDays}
          monthlyLoss={monthlyLoss} yearlyLoss={yearlyLoss}
        />
        <HowItWorks />
        <CaptureProof />
        <Features />
        <SpecsTable />
        <Pricing monthlyLoss={monthlyLoss} />
        <TrustStrip />
        <Faq />
        <DemoForm
          perDay={perDay} setPerDay={setPerDay}
          entryVal={entryVal} setEntryVal={setEntryVal}
          days={days} setDays={setDays}
          monthlyLoss={monthlyLoss} yearlyLoss={yearlyLoss}
        />
      </main>
      <Footer />
      <AiWatchingBadge />
      <StickyCTA />
    </div>
  );
}
