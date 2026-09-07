import {
  useEffect, useRef, useState, useCallback,
  type ReactNode, type ElementType, type CSSProperties,
} from 'react';

/* ───────────────────────────────────────────────────────────────
   One shared IntersectionObserver drives every reveal on the page.
   Cheaper than one observer per element, and it unobserves on
   entry so nothing re-runs while the user scrolls back up.
   ─────────────────────────────────────────────────────────────── */
let sharedIO: IntersectionObserver | null = null;

function observer(): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return null;
  if (!sharedIO) {
    sharedIO = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            sharedIO?.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    );
  }
  return sharedIO;
}

/** Attach to any element carrying data-reveal / data-mask / data-draw. */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    const io = observer();
    if (!el) return;
    if (!io) { el.classList.add('is-in'); return; }   // no IO support → show immediately
    io.observe(el);
    return () => io.unobserve(el);
  }, []);
  return ref;
}

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  y?: number;
  mask?: boolean;
  /** Curtain colour for a mask reveal — must match the section behind it. */
  curtain?: 'dark' | 'paper';
  className?: string;
  style?: CSSProperties;
};

/** Fade/slide (or clip-mask) an element in as it enters the viewport. */
export function Reveal({
  children, as: Tag = 'div', delay = 0, y, mask = false, curtain = 'dark', className = '', style,
}: RevealProps) {
  const ref = useReveal<HTMLDivElement>();
  const attr = mask ? { 'data-mask': '' } : { 'data-reveal': '' };
  return (
    <Tag
      ref={ref}
      {...attr}
      className={className}
      style={{
        ...(delay ? { ['--reveal-delay' as string]: `${delay}ms` } : null),
        ...(y !== undefined ? { ['--reveal-y' as string]: `${y}px` } : null),
        ...(mask && curtain === 'paper' ? { ['--curtain' as string]: 'var(--paper)' } : null),
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

/** Headline that reveals line by line from behind a mask. */
export function MaskLines({
  lines, className = '', delay = 0, step = 90,
}: { lines: string[]; className?: string; delay?: number; step?: number }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} data-reveal className={className} style={{ ['--reveal-y' as string]: '0px' }}>
      {lines.map((l, i) => (
        <span key={l + i} className="line-mask">
          <span style={{ ['--reveal-delay' as string]: `${delay + i * step}ms` }}>{l}</span>
        </span>
      ))}
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────
   Count-up. Uses rAF with an eased curve, honours reduced motion,
   and only starts once the number is actually on screen.
   ─────────────────────────────────────────────────────────────── */
export function Counter({
  to, duration = 1600, suffix = '', prefix = '', className = '',
}: { to: number; duration?: number; suffix?: string; prefix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [val, setVal] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) { setVal(to); return; }

    const io = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting || done.current) return;
      done.current = true;
      io.disconnect();
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - t0) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);          // easeOutCubic
        setVal(Math.round(to * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });

    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return <span ref={ref} className={className}>{prefix}{val}{suffix}</span>;
}

/* ───────────────────────────────────────────────────────────────
   Scroll progress through a tall section — powers sticky,
   scroll-driven storytelling. rAF-throttled so it never thrashes.
   Returns 0 → 1 across the section's scrollable travel.
   ─────────────────────────────────────────────────────────────── */
export function useScrollProgress<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [p, setP] = useState(0);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const travel = r.height - window.innerHeight;
    if (travel <= 0) { setP(0); return; }
    setP(Math.min(Math.max(-r.top / travel, 0), 1));
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; measure(); });
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [measure]);

  return [ref, p] as const;
}
