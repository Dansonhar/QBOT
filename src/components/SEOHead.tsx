import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  url?: string;
  type?: string;
  imageAlt?: string;
  noindex?: boolean;
  /** Skip the automatic " | QPOS" suffix. Useful when the title is intentionally brand-free for click-bait share cards. */
  noTitleSuffix?: boolean;
}

const SITE_NAME = 'QPOS';
const DEFAULT_LOCALE = 'en_MY';
const BASE_URL = 'https://qbot.now';
const DEFAULT_IMAGE = `${BASE_URL}/qpos-keyvisuals/qsharer.jpg`;
const DEFAULT_IMAGE_ALT = 'QPOS — All-in-One POS System for F&B, Retail, Wellness & Gym in Malaysia';

export default function SEOHead({
  title = 'QPOS | AI Self-Service Kiosks for F&B, Wellness, Gym & Retail',
  description = 'QPOS is Malaysia\'s all-in-one POS solution. POS, self-ordering kiosk, QR ordering, webstore, loyalty, AI insights — 14 modules in one platform.',
  keywords = 'self service kiosk malaysia, kiosk malaysia, QPOS, AI kiosks, F&B kiosk, restaurant kiosk, POS system malaysia',
  image = DEFAULT_IMAGE,
  imageWidth = 1200,
  imageHeight = 630,
  url = BASE_URL,
  type = 'website',
  imageAlt = DEFAULT_IMAGE_ALT,
  noindex = false,
  noTitleSuffix = false,
}: SEOHeadProps) {
  useEffect(() => {
    // Title — append brand if not already present (unless explicitly suppressed)
    const fullTitle = noTitleSuffix || title.includes('QPOS') || title.includes('QBot') || title.includes('QHub') || title.includes('QFit')
      ? title
      : `${title} | QPOS`;
    document.title = fullTitle;

    // Core meta
    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'keywords', keywords);
    updateMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // Open Graph
    updateMetaTag('property', 'og:title', fullTitle);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:image', image);
    updateMetaTag('property', 'og:image:width', String(imageWidth));
    updateMetaTag('property', 'og:image:height', String(imageHeight));
    updateMetaTag('property', 'og:image:alt', imageAlt);
    updateMetaTag('property', 'og:image:type', 'image/jpeg');
    updateMetaTag('property', 'og:url', url);
    updateMetaTag('property', 'og:type', type);
    updateMetaTag('property', 'og:site_name', SITE_NAME);
    updateMetaTag('property', 'og:locale', DEFAULT_LOCALE);

    // Twitter Card
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', fullTitle);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', image);
    updateMetaTag('name', 'twitter:image:alt', imageAlt);

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonicalLink) {
      canonicalLink.href = url;
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      canonicalLink.href = url;
      document.head.appendChild(canonicalLink);
    }
  }, [title, description, keywords, image, imageWidth, imageHeight, url, type, imageAlt, noindex, noTitleSuffix]);

  return null;
}

function updateMetaTag(attribute: string, attributeValue: string, content: string) {
  let element = document.querySelector(`meta[${attribute}="${attributeValue}"]`);

  if (element) {
    element.setAttribute('content', content);
  } else {
    element = document.createElement('meta');
    element.setAttribute(attribute, attributeValue);
    element.setAttribute('content', content);
    document.head.appendChild(element);
  }
}
