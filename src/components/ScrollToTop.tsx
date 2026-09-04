import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const firstRun = useRef(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Meta Pixel SPA pageview: the base code in index.html fires PageView once
    // on initial load, so skip the first run and track every later navigation.
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    // Meta Pixel
    (window as any).fbq?.('track', 'PageView');
    // GA4 — SPA page_view (base gtag config fires it once on load; this covers
    // every client-side navigation after).
    (window as any).gtag?.('event', 'page_view', {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  return null;
}
