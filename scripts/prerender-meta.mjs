// Postbuild: bake per-route social/SEO meta into static HTML files.
//
// Why: this is a Vite SPA. Meta tags are injected client-side via SEOHead's
// useEffect after React mounts. Facebook/WhatsApp/Twitter/LinkedIn crawlers
// don't execute JS — they read the raw HTML they receive and use whatever
// meta is in there. Without prerendering, every shared URL falls back to
// /dist/index.html's home-page meta.
//
// What this does: clones dist/index.html into dist/<path>/index.html for each
// route below, swapping the title, description, canonical, OG and Twitter
// meta with route-specific values. The SPA fallback in _redirects only fires
// for paths that lack a static file, so these prerendered HTMLs win at the
// edge for crawlers while the live React app continues to drive the user
// experience after mount.
//
// To add a route: append to ROUTES below. Keep image dimensions accurate
// (helps FB/LinkedIn pick a large-card layout instead of small).
//
// Two optional per-route fields go further than meta:
//   jsonLd:   schema.org objects written into <head>. React also injects these
//             once it mounts, but crawlers that skip JS only ever see this copy.
//   bodyHtml: a static content fallback written INSIDE <div id="root">. React
//             replaces the container's children on mount, so a visitor sees it
//             for a frame at most — but Bing, WhatsApp, LinkedIn and the AI
//             crawlers (GPTBot, PerplexityBot, ClaudeBot) never run the bundle
//             and would otherwise index a blank page. It must stay a faithful
//             summary of what the rendered page actually says; wording that
//             promises more than the live page is cloaking.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

const DIST = 'dist';
const SOURCE = join(DIST, 'index.html');
const ORIGIN = 'https://qbot.now';

// ── /qsentry static fallback ────────────────────────────────────────────────
// Mirrors SPECS and FAQS in src/pages/QSentryPage.tsx. Update both together.
const QSENTRY_SPECS = [
  ['Camera', '4K Ultra HD, wide-angle lens'],
  ['Display', '21.5" FHD screen for clear real-time monitoring'],
  ['Detection', 'On-device AI — tailgating & intrusion alert, 24/7'],
  ['Alert light', 'Red / green indicator bar for instant visual notification'],
  ['Audible alarm', 'Built-in buzzer triggered on detection'],
  ['Tilt range', 'Manual adjustable tilt, +15° to −30°'],
  ['Housing', '3D-printed high-strength PLA+, ventilated for heat dissipation'],
  ['Form factor', 'All-in-one — screen, camera and alert system in a single unit'],
  ['Mounting', 'Wall or ceiling mount, flexible for any entrance layout'],
  ['Capture', 'Photo + short video clip of each tailgating event'],
  ['Notifications', 'Mobile alert with date, time, photo and video'],
  ['Offline operation', 'Keeps detecting and capturing without internet; queued alerts send on reconnect'],
  ['Recording', 'None — members are never recorded, only tailgating events are captured'],
  ['Warranty', '2-year hardware warranty'],
  ['Availability', 'Preorder — installation and demos in Klang Valley, Malaysia'],
];

const QSENTRY_FAQ = [
  ['What is tailgating at a gym?', 'Tailgating is when one paying member taps or scans in and a second person walks through the same opening behind them — a friend, a partner, or a lapsed member. Turnstiles and access-control gates count the tap, not the bodies, so the extra entry never appears in your system. It is the most common and least measured source of lost revenue in Malaysian gyms.'],
  ['Why QSentry AI?', 'Many gyms want to run 24/7 and staffless, and our Studio solutions already make that possible. The one big deterrent is tailgaters — members bringing friends in for free. QSentry AI was built specifically to counter that.'],
  ['How does QSentry AI detect a tailgater?', 'A 4K wide-angle camera watches the entrance and on-device AI counts the people passing through on each entry event. When it detects two bodies on one tap it triggers a red flashing light and buzzer, captures a photo and a short video clip of the offender, and pushes an alert to your phone with the date and time. The whole sequence takes seconds and needs no staff involvement.'],
  ['Is QSentry AI an AI CCTV camera? How is it different from normal CCTV?', 'Yes — QSentry AI is an AI CCTV purpose-built for anti-tailgating. A normal CCTV just records hours of footage for you to review after the fact; QSentry AI watches your entrance live, counts the people on each entry, and acts in the moment — alarm, photo and video capture, and an alert to your phone. Unlike regular CCTV it does not record continuously, which keeps it privacy-first and PDPA-friendly.'],
  ['What if a tailgater covers their face (mask, helmet, cap)?', "Still caught. QSentry does not rely on faces — its AI reads whole-body structure and movement to detect a second person slipping through, so masks, helmets, caps or hoodies won't fool it."],
  ['Does it work with my existing turnstile, door lock or access control?', 'Yes. QSentry AI is a standalone unit that mounts above or beside your entrance and watches the opening rather than plugging into your gate, so it works with a turnstile, a door or gate lock, or a manned front counter. You keep whatever access system, membership software or POS you already run — nothing has to be replaced or rewired.'],
  ['Does QSentry AI record my members? Is it PDPA compliant?', "No continuous recording. QSentry does not keep footage of members going about their workout — it only captures the moment a tailgating event is detected, as a photo and a short clip held as evidence. That data-minimising design is what makes it privacy-first and comfortable under Malaysia's PDPA. As with any entrance camera, you should still display a notice at the door telling visitors that monitoring is in place."],
  ['Will it work without internet?', 'Yes. It keeps detecting and capturing even when offline; you simply receive the notifications a little later instead of live. The moment the internet is back, every captured image is sent straight to you.'],
  ['How long does installation take?', 'One visit. QSentry AI is an all-in-one unit — screen, camera and alarm in a single housing — that wall- or ceiling-mounts at your entrance with an adjustable tilt to suit your layout. No rewiring, no server and no IT team required, and installation is included in the price.'],
  ['How much does QSentry AI cost?', 'QSentry AI is a one-time hardware and setup cost — there is no monthly subscription to catch tailgaters. Hardware, installation, the 2-year warranty and the 30-day money-back guarantee are all included. The unit is currently in preorder at a launch price below RRP; book a free demo to confirm your exact price and the current offer.'],
  ['Where in Malaysia do you install and demo?', 'Free on-site demos are available in the Klang Valley — Kuala Lumpur, Selangor, Petaling Jaya, Subang, Shah Alam, Cheras and Puchong — with limited slots each week. Outside the Klang Valley we run a virtual demo first and arrange installation from there; tell us your location when you book.'],
  ['What if I have a problem?', 'Our team supports your site — if anything goes wrong, we will help you resolve it. The unit also carries a 2-year hardware warranty.'],
  ['Is there really a money-back guarantee?', 'Yes. Return the unit whole and undamaged within 30 days and we will refund you in full, no questions asked.'],
];

const QSENTRY_DESC =
  "Malaysia's first anti-tailgating AI CCTV camera for gyms. Auto-detects members sneaking friends in, sounds a red-light and buzzer alarm, and captures photo + video proof sent to your phone. Privacy-first: no continuous recording. One-time cost, 2-year warranty, 30-day money-back guarantee.";

const QSENTRY_JSONLD = [
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
    description: QSENTRY_DESC,
    brand: { '@type': 'Brand', name: 'QSentry AI' },
    manufacturer: { '@type': 'Organization', name: 'QBot', url: ORIGIN },
    category: 'AI CCTV Security Camera',
    audience: { '@type': 'BusinessAudience', name: 'Gyms, fitness studios and 24/7 staffless facilities' },
    additionalProperty: QSENTRY_SPECS.map(([name, value]) => ({ '@type': 'PropertyValue', name, value })),
    offers: {
      '@type': 'Offer',
      url: `${ORIGIN}/qsentry`,
      priceCurrency: 'MYR',
      price: '4999',
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
    mainEntity: QSENTRY_FAQ.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    '@id': `${ORIGIN}/qsentry#demo-video`,
    name: 'QSentry AI catching a gym tailgater in real time',
    description:
      'Live footage from a Malaysian gym: a second person follows a member through the turnstile and QSentry AI flags the tailgating event, triggers the alarm and captures photo and video proof.',
    thumbnailUrl: [`${ORIGIN}/qsentry_img/qsentry-poster.jpg`],
    contentUrl: `${ORIGIN}/qsentry_img/qsentry-video.mp4`,
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

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Inline styles only — Tailwind's content scanner never looks in scripts/, so any
// utility class used here would be purged out of the stylesheet.
//
// This is styled, not raw, because on a slow 4G connection the visitor genuinely
// reads it for a second or two before the lazy route chunk arrives. Dark theme and
// QSentry red so the hand-off to the real page is a continuation rather than a
// flash of a different-looking document.
const S = {
  wrap: 'background:#0A0A0A;color:#fff;font-family:Inter,system-ui,-apple-system,sans-serif;padding:3rem 1.25rem;max-width:52rem;margin:0 auto;line-height:1.6;-webkit-font-smoothing:antialiased',
  eyebrow: 'color:#FF2D2D;font-size:11px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;margin:0 0 0.75rem',
  h1: 'font-size:2.25rem;font-weight:900;line-height:1.1;letter-spacing:-0.02em;margin:0 0 1rem',
  h2: 'font-size:1.4rem;font-weight:900;line-height:1.2;margin:2.5rem 0 0.75rem;border-top:1px solid rgba(255,255,255,0.1);padding-top:1.75rem',
  h3: 'font-size:1rem;font-weight:700;margin:1.5rem 0 0.35rem',
  p: 'color:rgba(255,255,255,0.65);margin:0 0 1rem',
  li: 'color:rgba(255,255,255,0.65);margin:0 0 0.5rem',
  ul: 'padding-left:1.25rem;margin:0 0 1rem',
  table: 'width:100%;border-collapse:collapse;margin:0 0 1rem',
  th: 'text-align:left;padding:0.6rem 1.5rem 0.6rem 0;font-size:0.875rem;font-weight:700;color:rgba(255,255,255,0.8);border-bottom:1px solid rgba(255,255,255,0.1);vertical-align:top;white-space:nowrap',
  td: 'padding:0.6rem 0;font-size:0.875rem;color:rgba(255,255,255,0.6);border-bottom:1px solid rgba(255,255,255,0.1);vertical-align:top',
  a: 'color:#FF2D2D;text-decoration:none',
};

const QSENTRY_BODY = `
<div style="${S.wrap}">
  <p style="${S.eyebrow}">First in Malaysia · Anti-Tailgating AI CCTV</p>
  <h1 style="${S.h1}">Every tailgater is money walking out your door.</h1>
  <p style="${S.p}">QSentry AI is Malaysia's first anti-tailgating AI CCTV camera for gyms. It catches members who sneak
  friends in automatically, with photo and video proof and an instant alert to your phone. No staff needed.
  Preorder now — free on-site demo in the Klang Valley.</p>

  <h2 style="${S.h2}">The problem: gyms are bleeding money through the turnstile</h2>
  <ul style="${S.ul}">
    <li style="${S.li}"><strong>Friends slip in free.</strong> One member taps in, their buddy walks through behind them, and trains for free every day.</li>
    <li style="${S.li}"><strong>Staff can't catch it.</strong> The front desk is busy and nobody watches the gate 24/7 — a turnstile can't tell two bodies from one.</li>
    <li style="${S.li}"><strong>It never shows up.</strong> Lost entries never hit your P&amp;L, so the leak runs for months without you knowing.</li>
  </ul>

  <h2 style="${S.h2}">How QSentry AI works</h2>
  <ol style="${S.ul}">
    <li style="${S.li}"><strong>Detects</strong> — AI spots two people entering on one tap, instantly, day and night.</li>
    <li style="${S.li}"><strong>Alarms</strong> — red flashing lights and a buzzer fire the moment a tailgater is caught.</li>
    <li style="${S.li}"><strong>Captures</strong> — snaps a photo and a short video clip of the offender.</li>
    <li style="${S.li}"><strong>Reports</strong> — the alert lands on your phone with date, time, photo and video, even when you're away.</li>
  </ol>

  <h2 style="${S.h2}">Why QSentry AI</h2>
  <ul style="${S.ul}">
    <li style="${S.li}">Catches what staff miss — auto-detection runs 24/7 and never blinks.</li>
    <li style="${S.li}">Instant red flashing lights and buzzer; the deterrent alone stops repeat offenders.</li>
    <li style="${S.li}">Proof in your pocket — date, time, photo and video sent to your phone.</li>
    <li style="${S.li}">No video recorded, ever. Only tailgaters are captured — PDPA-friendly and safe for member trust.</li>
    <li style="${S.li}">Easy to install — up and running in one visit, no rewiring and no IT team.</li>
    <li style="${S.li}">2-year hardware warranty and a 30-day money-back guarantee.</li>
  </ul>

  <h2 style="${S.h2}">QSentry AI specifications</h2>
  <table style="${S.table}"><tbody>
${QSENTRY_SPECS.map(([k, v]) => `    <tr><th scope="row" style="${S.th}">${esc(k)}</th><td style="${S.td}">${esc(v)}</td></tr>`).join('\n')}
  </tbody></table>

  <h2 style="${S.h2}">Pricing</h2>
  <p style="${S.p}">One-time hardware and setup cost — no monthly subscription to catch tailgaters. Included: the
  QSentry AI camera, 24/7 automatic tailgating detection, red flashing lights and buzzer alarm, photo and video
  capture of every offender, instant mobile alerts, privacy-first operation with no video recorded, installation,
  a 2-year hardware warranty and a 30-day money-back guarantee. Currently in preorder below RRP — book a free
  demo to confirm your price.</p>

  <h2 style="${S.h2}">Frequently asked questions</h2>
${QSENTRY_FAQ.map(([q, a]) => `  <h3 style="${S.h3}">${esc(q)}</h3>\n  <p style="${S.p}">${esc(a)}</p>`).join('\n')}

  <h2 style="${S.h2}">Book a free demo</h2>
  <p style="${S.p}">On-site (Klang Valley) or virtual — no cost, no obligation.
  WhatsApp <a style="${S.a}" href="https://wa.me/60126909189">+6012-6909-189</a>,
  email <a style="${S.a}" href="mailto:hello@qbot.now">hello@qbot.now</a>, or visit the QBot showroom at
  B3-6-13 Solaris Dutamas, Jalan Dutamas 1, 50480 Kuala Lumpur, Malaysia. Open Mon–Fri, 10am–7pm.</p>

  <p style="${S.p}"><a style="${S.a}" href="${ORIGIN}/">QPOS home</a> ·
  <a style="${S.a}" href="${ORIGIN}/qstudio">STUDIO for gyms &amp; wellness</a> ·
  <a style="${S.a}" href="${ORIGIN}/qstudio/guide-for-gyms">Guide for gyms</a> ·
  <a style="${S.a}" href="${ORIGIN}/contact-us">Contact us</a></p>
</div>`;

const ROUTES = [
  {
    // Public product launch landing — indexable + rich share card
    path: '/qsentry',
    title: 'QSentry AI — Anti-Tailgating AI CCTV Camera for Gyms in Malaysia',
    description:
      "Malaysia's first anti-tailgating AI CCTV camera for gyms. QSentry AI auto-catches every tailgater — instant alarm, photo & video proof to your phone. Privacy-first: no recording. Preorder + free Klang Valley demo.",
    keywords:
      'QSentry, QSentry AI, AI CCTV, AI CCTV Malaysia, AI CCTV camera for gym, anti-tailgating camera Malaysia, anti tailgater camera, anti-tailgating system Malaysia, gym tailgating, catch gym tailgaters, tailgating detection AI, gym security camera Malaysia, gym access control Malaysia, 24/7 staffless gym',
    image: `${ORIGIN}/qsentry_img/sentrysharer.jpg`,
    imageWidth: 1200,
    imageHeight: 630,
    imageAlt: "QSentry AI — Malaysia's first anti-tailgating AI CCTV camera for gyms",
    type: 'website',
    video: `${ORIGIN}/qsentry_img/qsentry-video.mp4`,
    jsonLd: QSENTRY_JSONLD,
    bodyHtml: QSENTRY_BODY,
  },
  {
    path: '/qstudio',
    title: 'All-in-One Platform for Fitness & Wellness',
    description:
      'Face-ID check-in. No manual admin. Bookings from web, app or front counter. Staff, commissions and integrated reports — all in one.',
    image: `${ORIGIN}/qfitimg/studioimg/02_checkin.jpg`,
    imageWidth: 4500,
    imageHeight: 3000,
    imageAlt:
      'Studio by QBot — Face-ID auto-gate check-in at a Malaysian gym',
    type: 'website',
  },
  {
    // Unlisted 1:1 outreach link — noindex (stays out of search) but rich share card
    path: '/qstudio/intro',
    title: 'The 60-second test every gym & salon owner needs',
    description:
      'Tap your biggest headaches and see what one platform fixes — POS, web & app, one login, one bill. No more juggling 5 softwares.',
    image: `${ORIGIN}/qfitimg/studioimg/02_checkin.jpg`,
    imageWidth: 4500,
    imageHeight: 3000,
    imageAlt: 'STUDIO — the 60-second tour for gym, salon, spa & clinic owners',
    type: 'website',
    noindex: true,
  },
  {
    path: '/qstudio/pricing',
    title: 'QStudio Pricing — Software Plans for Studios & Gyms | Malaysia',
    description:
      'QStudio software pricing — Starter, Standard, Pro, Advanced, Enterprise. Compare every feature across tiers. Billed annually, 8% SST applies. Upgrade or downgrade any month.',
    image: `${ORIGIN}/qfitimg/studioimg/02_checkin.jpg`,
    imageWidth: 4500,
    imageHeight: 3000,
    imageAlt: 'STUDIO by QBot — software pricing for studios and gyms',
    type: 'website',
  },
  {
    path: '/qstudio/pricing/themepark',
    title: 'QSTUDIO FOR THEMEPARKS — Software Plans for Theme Parks, Playlands & Museums | Malaysia',
    description:
      'QStudio software pricing for theme parks, playlands, and museums — Starter, Standard, Pro, Advanced, Enterprise. Compare every feature across tiers. Billed annually, 8% SST applies. Upgrade or downgrade any month.',
    image: `${ORIGIN}/qfitimg/studioimg/02_checkin.jpg`,
    imageWidth: 4500,
    imageHeight: 3000,
    imageAlt: 'STUDIO by QBot — software pricing for theme parks, playlands and museums',
    type: 'website',
  },
  {
    path: '/qstudio/guide-for-gyms',
    title: 'QStudio for Gyms — Member Management + Face-ID Entry | Malaysia',
    description:
      'QStudio is the all-in-one platform for Malaysian gyms — member management, Face-ID entry gates, anti-tailgating, 24/7 access. Six silent ways gyms lose money — and the system that fixes them.',
    image: `${ORIGIN}/qfitimg/studioimg/02_checkin.jpg`,
    imageWidth: 4500,
    imageHeight: 3000,
    imageAlt: 'STUDIO by QBot — gym member management and Face-ID entry',
    type: 'website',
  },
  {
    path: '/qprop',
    title: 'STUDIO for Property & Airbnb — Self-Service Kiosk + Door-Lock Control',
    description:
      'Unattended check-in for short-stay, co-living and Airbnb properties. Kiosk booking, MyKad chip scan, passport scan, digital waiver, door PIN issued on the spot. PDPA-compliant.',
    image: `${ORIGIN}/qfitimg/qfit1.jpg`,
    imageWidth: 1200,
    imageHeight: 630,
    imageAlt: 'STUDIO for Property & Airbnb',
    type: 'website',
  },
  {
    path: '/qkiosk-lite',
    title: 'QKiosk Lite Malaysia — Self-Order Kiosk on Any Tablet, RM 69/mo',
    description:
      "Turn any Android tablet or iPad into a self-service ordering kiosk for RM 69/month. Bring your own tablet — live this week. Malaysia's most affordable F&B self-order kiosk.",
    image: `${ORIGIN}/qpos-keyvisuals/qsharer.jpg`,
    imageWidth: 1200,
    imageHeight: 630,
    imageAlt: 'QPOS — All-in-One POS System for F&B, Retail, Wellness & Gym in Malaysia',
    type: 'website',
  },
  {
    path: '/pos-buying-guide',
    title: 'QPOS Buying Guide — Find the Right POS for Your F&B in 60 Seconds | Malaysia',
    description:
      'Interactive POS buying guide for Malaysian F&B owners. Compare 8 QPOS models, get a free recommendation, and save with our 2-year free software bonus.',
    image: `${ORIGIN}/qpos-keyvisuals/qsharer.jpg`,
    imageWidth: 1200,
    imageHeight: 630,
    imageAlt: 'QPOS — All-in-One POS System for F&B, Retail, Wellness & Gym in Malaysia',
    type: 'article',
  },
  {
    path: '/about-us',
    title: 'About QBot — AI POS & Kiosks Designed in Tokyo, Built for Malaysia',
    description:
      'QBot designs AI-powered POS, self-service kiosks, and industry platforms (QFit, QStudio). Tokyo design, Malaysia deployment. Visit our Publika KL showroom — see it live before you buy.',
    image: `${ORIGIN}/qpos-keyvisuals/qsharer.jpg`,
    imageWidth: 1200,
    imageHeight: 630,
    imageAlt: 'QPOS — All-in-One POS System for F&B, Retail, Wellness & Gym in Malaysia',
    type: 'website',
  },
  {
    path: '/contact-us',
    title: 'Contact QBot — Publika KL Showroom & WhatsApp | QPOS Malaysia',
    description:
      'Visit the QBot showroom at Publika KL. Chat on WhatsApp +6012-6909-189 or email hello@qbot.now. Open Mon-Fri 10AM-7PM. See QPOS live before you buy.',
    image: `${ORIGIN}/qpos-keyvisuals/qsharer.jpg`,
    imageWidth: 1200,
    imageHeight: 630,
    imageAlt: 'QPOS — All-in-One POS System for F&B, Retail, Wellness & Gym in Malaysia',
    type: 'website',
  },
];

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function setOrAppendMeta(html, attr, value, content) {
  // Match existing <meta {attr}="{value}" ...>
  const escValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`<meta\\s+${attr}="${escValue}"[^>]*>`, 'i');
  const tag = `<meta ${attr}="${value}" content="${escapeAttr(content)}" />`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace('</head>', `  ${tag}\n  </head>`);
}

function setOrAppendCanonical(html, url) {
  const re = /<link\s+rel="canonical"[^>]*>/i;
  const tag = `<link rel="canonical" href="${escapeAttr(url)}" />`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace('</head>', `  ${tag}\n  </head>`);
}

function setOrAppendJsonLd(html, jsonLd) {
  // JSON.stringify already escapes quotes; only "</" needs neutralising so the
  // payload can't terminate the <script> block early.
  const payload = JSON.stringify(jsonLd).replace(/<\//g, '<\\/');
  return html.replace('</head>', `  <script type="application/ld+json">${payload}</script>\n  </head>`);
}

function applyRoute(html, route) {
  const url = `${ORIGIN}${route.path}`;

  // <title>
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeAttr(route.title)}</title>`);

  // Core
  html = setOrAppendMeta(html, 'name', 'description', route.description);
  if (route.keywords) html = setOrAppendMeta(html, 'name', 'keywords', route.keywords);

  // Open Graph
  html = setOrAppendMeta(html, 'property', 'og:title', route.title);
  html = setOrAppendMeta(html, 'property', 'og:description', route.description);
  html = setOrAppendMeta(html, 'property', 'og:image', route.image);
  html = setOrAppendMeta(html, 'property', 'og:image:width', String(route.imageWidth));
  html = setOrAppendMeta(html, 'property', 'og:image:height', String(route.imageHeight));
  html = setOrAppendMeta(html, 'property', 'og:image:alt', route.imageAlt);
  html = setOrAppendMeta(html, 'property', 'og:image:type', 'image/jpeg');
  html = setOrAppendMeta(html, 'property', 'og:url', url);
  html = setOrAppendMeta(html, 'property', 'og:type', route.type || 'website');

  // Twitter
  html = setOrAppendMeta(html, 'name', 'twitter:card', 'summary_large_image');
  html = setOrAppendMeta(html, 'name', 'twitter:title', route.title);
  html = setOrAppendMeta(html, 'name', 'twitter:description', route.description);
  html = setOrAppendMeta(html, 'name', 'twitter:image', route.image);
  html = setOrAppendMeta(html, 'name', 'twitter:image:alt', route.imageAlt);

  // Canonical
  html = setOrAppendCanonical(html, url);

  // Video — lets FB/LinkedIn play the demo inline instead of showing a still.
  // No twitter:player here: that card type needs a whole hosted player page, and
  // a half-declared one just gets the card rejected. Twitter keeps the image card.
  if (route.video) {
    html = setOrAppendMeta(html, 'property', 'og:video', route.video);
    html = setOrAppendMeta(html, 'property', 'og:video:type', 'video/mp4');
  }

  // Robots — unlisted pages stay out of search but still get a rich link preview
  if (route.noindex) {
    html = setOrAppendMeta(html, 'name', 'robots', 'noindex, nofollow');
  }

  // schema.org graph — present before any JS runs
  if (route.jsonLd) {
    html = setOrAppendJsonLd(html, route.jsonLd);
  }

  // Static content fallback for non-rendering crawlers. React's createRoot()
  // clears the container on mount, so this never coexists with the live page.
  if (route.bodyHtml) {
    const rootRe = /<div id="root">\s*<\/div>/i;
    if (!rootRe.test(html)) {
      console.warn(`prerender-meta: ${route.path} — no empty <div id="root"></div> found; skipping bodyHtml.`);
    } else {
      html = html.replace(rootRe, `<div id="root">${route.bodyHtml}</div>`);
    }
  }

  return html;
}

function main() {
  if (!existsSync(SOURCE)) {
    console.error(`prerender-meta: ${SOURCE} not found — run "vite build" first.`);
    process.exit(1);
  }
  const baseHtml = readFileSync(SOURCE, 'utf8');

  for (const route of ROUTES) {
    const slug = route.path.replace(/^\/+/, '');
    const out = join(DIST, slug, 'index.html');
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, applyRoute(baseHtml, route));
    console.log(`prerender-meta: ${route.path} -> ${out}`);
  }
}

main();
