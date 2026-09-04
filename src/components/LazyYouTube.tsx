import { useState, useRef, useEffect } from 'react';

interface LazyYouTubeProps {
  videoId: string;
  title: string;
  className?: string;
  style?: React.CSSProperties;
  /** Extra iframe params (after ?) */
  params?: string;
  /** Show play button overlay (default true) */
  showPlay?: boolean;
}

/**
 * Facade pattern: renders a thumbnail + play button.
 * Only loads the heavy YouTube iframe when the user clicks
 * or (for autoplay muted videos) when the element enters the viewport.
 */
export default function LazyYouTube({
  videoId,
  title,
  className = '',
  style,
  params = 'autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&fs=0',
  showPlay = false,
}: LazyYouTubeProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Load iframe when element enters viewport (for autoplay/muted videos)
  useEffect(() => {
    if (loaded) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loaded]);

  const loopParam = params.includes('loop=1') && !params.includes('playlist=')
    ? `&playlist=${videoId}`
    : '';

  return (
    <div ref={ref} className={`relative overflow-hidden bg-black ${className}`} style={style}>
      {!loaded ? (
        <>
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          {showPlay && (
            <button
              onClick={() => setLoaded(true)}
              aria-label={`Play ${title}`}
              className="absolute inset-0 flex items-center justify-center z-10 group"
            >
              <div className="w-16 h-16 bg-black/70 group-hover:bg-red-600 rounded-full flex items-center justify-center transition-colors">
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-white ml-1" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
          )}
        </>
      ) : (
        <>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?${params}${loopParam}`}
            title={title}
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            style={{ border: 0 }}
          />
          {/* Overlay to block YouTube UI */}
          <div className="absolute inset-0 z-10" />
        </>
      )}
    </div>
  );
}
