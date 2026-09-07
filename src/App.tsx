import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNavBar from './components/BottomNavBar';
import WhatsAppButton from './components/WhatsAppButton';
import StructuredData from './components/StructuredData';
import ScrollToTop from './components/ScrollToTop';
import AdminPanel from './components/AdminPanel';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { trackWhatsAppClick } from './utils/trackWhatsApp';
import { MerchantAuthProvider } from './contexts/MerchantAuthContext';
import MerchantAuthGuard from './components/merchant/MerchantAuthGuard';

// Home page sections
import Hero from './components/Hero';
import IntegratedSystem from './components/IntegratedSystem';
import SalesBoostersSection from './components/SalesBoostersSection';
import KioskSection from './components/KioskSection';
import ModulesGrid from './components/ModulesGrid';
import IndustrySolutions from './components/IndustrySolutions';
import StatsBar from './components/StatsBar';
import ShowroomSection from './components/ShowroomSection';
import CTASection from './components/CTASection';
import YouTubeSection from './components/YouTubeSection';

// Existing pages (repurposed)
import SuperPOSLanding from './components/SuperPOSLanding';

// Lazy-loaded pages
const ProductsHubPage = lazy(() => import('./pages/ProductsHubPage'));
const HardwarePage = lazy(() => import('./pages/HardwarePage'));
const FreeToolsPage = lazy(() => import('./pages/FreeToolsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const V2Page = lazy(() => import('./pages/V2Page'));
const BuildPage = lazy(() => import('./pages/BuildPage'));
const ThreeInOnePage = lazy(() => import('./pages/ThreeInOnePage'));
const CustomPosPage = lazy(() => import('./pages/CustomPosPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const VideoPage = lazy(() => import('./pages/VideoPage'));

// Free Tools pages
const PdfMenuPage = lazy(() => import('./pages/tools/PdfMenuPage'));
const ReviewQrPage = lazy(() => import('./pages/tools/ReviewQrPage'));
const BookingQrPage = lazy(() => import('./pages/tools/BookingQrPage'));
const QrGeneratorPage = lazy(() => import('./pages/tools/QrGeneratorPage'));
const MenuQrPage = lazy(() => import('./pages/tools/MenuQrPage'));
const WaBookingPage = lazy(() => import('./pages/tools/WaBookingPage'));
const WaOrderLandingPage = lazy(() => import('./pages/tools/waorder/WaOrderLandingPage'));
const WaOrderLoginPage = lazy(() => import('./pages/tools/waorder/WaOrderLoginPage'));
const WaOrderSignupPage = lazy(() => import('./pages/tools/waorder/WaOrderSignupPage'));
const WaOrderDashboardPage = lazy(() => import('./pages/tools/waorder/WaOrderDashboardPage'));

// POS Buying Guide — standalone landing page (no site chrome)
const PosBuyingGuidePage = lazy(() => import('./pages/PosBuyingGuidePage'));

// Hosted pages (public, no chrome)
const HostedMenuPage = lazy(() => import('./pages/hosted/HostedMenuPage'));
const HostedReviewPage = lazy(() => import('./pages/hosted/HostedReviewPage'));
const HostedBookingPage = lazy(() => import('./pages/hosted/HostedBookingPage'));
const FreeToolHostedPage = lazy(() => import('./pages/hosted/FreeToolHostedPage'));

// Sell pages
const ProductSectionPage = lazy(() => import('./pages/products/ProductSectionPage'));
const PosPage = lazy(() => import('./pages/products/PosPage'));
const MposPage = lazy(() => import('./pages/products/MposPage'));
const KioskPage = lazy(() => import('./pages/products/KioskPage'));
const WebstorePage = lazy(() => import('./pages/products/WebstorePage'));
const TabletPage = lazy(() => import('./pages/products/TabletPage'));
const ScanToOrderPage = lazy(() => import('./pages/products/ScanToOrderPage'));
// ScanToOrderPage kept for legacy; QR Ordering page replaces it at /products/qr-order

// Manage pages
const QhubPage = lazy(() => import('./pages/products/QhubPage'));
const InventoryPage = lazy(() => import('./pages/products/InventoryPage'));
const LoyaltyPage = lazy(() => import('./pages/products/LoyaltyPage'));

// Operate pages
const KitchenDisplayPage = lazy(() => import('./pages/products/KitchenDisplayPage'));
const QmsPage = lazy(() => import('./pages/products/QmsPage'));
const LiveDisplayPage = lazy(() => import('./pages/products/LiveDisplayPage'));

// Grow pages
const SalesBoostersPage = lazy(() => import('./pages/products/SalesBoostersPage'));
const AiInsightsPage = lazy(() => import('./pages/products/AiInsightsPage'));

// Why Q pages
const PosQualityPage = lazy(() => import('./pages/whyq/PosQualityPage'));
const GrowSalesPage = lazy(() => import('./pages/whyq/GrowSalesPage'));
const EasyToManagePage = lazy(() => import('./pages/whyq/EasyToManagePage'));
const SellEverywherePage = lazy(() => import('./pages/whyq/SellEverywherePage'));

// QFit — page itself retired; /qfit root redirects to /qstudio. Quote + packages subroutes remain.
const QFitQuotePage = lazy(() => import('./pages/QFitQuotePage'));
const QFitPackagesPage = lazy(() => import('./pages/QFitPackagesPage'));

// QStudio
const HomeV3 = lazy(() => import('./pages/HomeV3'));
const QStudioPage = lazy(() => import('./pages/QStudioPage'));
const QStudioIntroPage = lazy(() => import('./pages/QStudioIntroPage'));
// Growth Partner — special-partnership presentation (noindex, robots-blocked, unlisted)
const QStudioGrowthPartnerPage = lazy(() => import('./pages/QStudioGrowthPartnerPage'));
const QStudioGrowthQuotePage = lazy(() => import('./pages/QStudioGrowthQuotePage'));
// Code-gated personalized proposal deck (acestudio188 → Ace Studio Sarawak)
const QStudioAceProposalPage = lazy(() => import('./pages/QStudioAceProposalPage'));
// Password-gated Babel Fitness KL proposal deck (babelisgreat8 → Mindbody × Face ID access)
const QStudioBabelProposalPage = lazy(() => import('./pages/QStudioBabelProposalPage'));

// VIP360 — STUDIO premium care program. Private/unlisted (noindex, robots-blocked,
// not prerendered, not linked). Reachable at /vipcare and /qstudio/vipcare.
const VIP360Page = lazy(() => import('./pages/qstudio/vipcare/VIP360Page'));

// QProp (STUDIO for Property & Airbnb)
const QPropPage = lazy(() => import('./pages/QPropPage'));

// QSECURITY — unlisted demo page (noindex, not linked, robots-blocked, own chrome)
const QSecurityPage = lazy(() => import('./pages/QSecurityPage'));
// QSENTRY AI — anti-tailgater camera landing (noindex, unlisted, robots-blocked, own chrome)
const QSentryPage = lazy(() => import('./pages/QSentryPage'));
const QStudioPricingPage = lazy(() => import('./pages/QStudioPricingPage'));
const QStudioPricingThemeparkPage = lazy(() => import('./pages/QStudioPricingThemeparkPage'));
const QStudioGuideForGymsPage = lazy(() => import('./pages/QStudioGuideForGymsPage'));
const QStudioTicketingPage = lazy(() => import('./pages/QStudioTicketingPage'));

// QR Ordering
const QrOrderingPage = lazy(() => import('./pages/QrOrderingPage'));

// Quote Generator
const QuoteGeneratorPage = lazy(() => import('./pages/QuoteGeneratorPage'));

// QuoteSys (internal — password-gated, hidden from crawlers)
const QuoteSysPage = lazy(() => import('./pages/QuoteSysPage'));

// Storm HQ (internal command center — shared password, hidden from crawlers, no site chrome)
const StormHQPage = lazy(() => import('./pages/hq/StormHQPage'));

// QuoteStudio (customer-facing — password-gated, no site chrome)
const QuoteStudioPage = lazy(() => import('./pages/QuoteStudioPage'));
const QuoteStudioViewPage = lazy(() => import('./pages/QuoteStudioViewPage'));
const QuoteStudioProposalPage = lazy(() => import('./pages/QuoteStudioProposalPage'));

// QKiosk Lite
const QKioskLitePage = lazy(() => import('./pages/QKioskLitePage'));

// Legal
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const RefundPage = lazy(() => import('./pages/RefundPage'));

// Company
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const ContactUsPage = lazy(() => import('./pages/ContactUsPage'));

function HomePage() {
  useEffect(() => { document.title = 'QPOS — 3-in-1 POS System Malaysia | Counter, Mobile & Kiosk in One Device'; }, []);

  return (
    <main>
      <Hero />
      <YouTubeSection />
      <IntegratedSystem />
      <SalesBoostersSection />
      <KioskSection />
      <ModulesGrid />
      <IndustrySolutions />
      <StatsBar />
      <ShowroomSection />
      <CTASection />
    </main>
  );
}

function ExternalRedirect({ url }: { url: string }) {
  useEffect(() => {
    window.location.href = url;
  }, [url]);
  return null;
}

function PricingPageWrapper() {
  return <SuperPOSLanding />;
}

function ComingSoonPage({ title }: { title: string }) {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[11px] font-bold text-green-600 uppercase tracking-[0.15em] mb-4">Coming Soon</p>
      <h1 className="text-3xl md:text-5xl font-extrabold text-black tracking-tight mb-4">{title}</h1>
      <p className="text-[15px] text-gray-400 max-w-md mb-8">We're working hard to bring this to you. Stay tuned!</p>
      <a href="https://wa.me/60126909189?text=Hi%20QPOS%2C%20I%27m%20interested%20in%20learning%20more" target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick('ComingSoon > Contact Us')} className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white text-sm font-bold uppercase tracking-wide transition-colors">
        Contact Us
      </a>
    </main>
  );
}

function AdminPageWrapper() {
  return (
    <AdminAuthProvider>
      <AdminPanel onBack={() => window.location.href = '/'} />
    </AdminAuthProvider>
  );
}

// Layout wrapper that shows site chrome (header, footer, nav) for normal pages
function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white pb-16 lg:pb-0">
      <StructuredData type="organization" />
      <ScrollToTop />
      <Header />
      {children}
      <Footer />
      <BottomNavBar />
      <WhatsAppButton position="bottom-right" />
    </div>
  );
}

function App() {
  const isAdminPage = window.location.pathname === '/admincms' || window.location.pathname === '/admincms/';

  if (isAdminPage) {
    return <AdminPageWrapper />;
  }

  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Loading...</div></div>}>
          <Routes>
            {/* Hosted pages — no site chrome */}
            <Route path="/m/:shortId" element={<HostedMenuPage />} />
            <Route path="/r/:shortId" element={<HostedReviewPage />} />
            <Route path="/b/:shortId" element={<HostedBookingPage />} />
            <Route path="/freetools/:id" element={<FreeToolHostedPage />} />

            {/* QFit — root redirects to /qstudio; subroutes (quote, packages) stay untouched */}
            <Route path="/qfit" element={<Navigate to="/qstudio" replace />} />
            <Route path="/qfit/quote" element={<QFitQuotePage />} />
            <Route path="/qfit/packages" element={<QFitPackagesPage />} />

            {/* QStudio — own header/footer, no site chrome */}
            <Route path="/qstudio" element={<QStudioPage />} />
            <Route path="/qstudio/intro" element={<QStudioIntroPage />} />
            <Route path="/qstudio/growthquote" element={<QStudioGrowthQuotePage />} />
            <Route path="/qstudio/proposal" element={<QStudioAceProposalPage />} />
            <Route path="/qstudio/proposal/babel/:slide?" element={<QStudioBabelProposalPage />} />
            {/* Alias links for the Babel deck — both land on the password gate */}
            <Route path="/qstudio/presentation" element={<Navigate to="/qstudio/proposal/babel" replace />} />
            <Route path="/qstudio/presentations" element={<Navigate to="/qstudio/proposal/babel" replace />} />
            <Route path="/qstudio/growthpartner/:slide?" element={<QStudioGrowthPartnerPage />} />
            <Route path="/qstudio/pricing" element={<QStudioPricingPage />} />
            <Route path="/qstudio/pricing/themepark" element={<QStudioPricingThemeparkPage />} />
            <Route path="/qstudio/guide-for-gyms" element={<QStudioGuideForGymsPage />} />
            <Route path="/qstudio/ticketing" element={<QStudioTicketingPage />} />

            {/* VIP360 — premium care program. Private/unlisted, own header/footer, no site chrome. */}
            <Route path="/vipcare" element={<VIP360Page />} />
            <Route path="/qstudio/vipcare" element={<VIP360Page />} />

            {/* STUDIO for Property & Airbnb — own header/footer, no site chrome */}
            <Route path="/qprop" element={<QPropPage />} />

            {/* QSECURITY — unlisted demo page, own header/footer, no site chrome. Not linked anywhere; noindex + robots-blocked. */}
            <Route path="/qsecurity" element={<QSecurityPage />} />

            {/* QSENTRY AI — anti-tailgater camera landing. Unlisted, own chrome, noindex + robots-blocked. */}
            <Route path="/qsentry" element={<QSentryPage />} />

            {/* QuoteSys — internal, password-gated, no site chrome */}
            <Route path="/quotesys" element={<QuoteSysPage />} />

            {/* Storm HQ — internal command center, shared-password gated, no site chrome */}
            <Route path="/hq/storm" element={<StormHQPage />} />

            {/* QuoteStudio — customer-facing, password-gated wizard; public hosted view at /qref/<slug> */}
            <Route path="/quotesys/quotestudio" element={<QuoteStudioPage />} />
            <Route path="/quotesys/quotestudio/proposal/:brand" element={<QuoteStudioProposalPage />} />
            <Route path="/qref/:slug" element={<QuoteStudioViewPage />} />

            {/* POS Buying Guide — standalone landing page, no site chrome. Locale via ?lang=en|bm. */}
            <Route path="/pos-buying-guide" element={<PosBuyingGuidePage />} />
            <Route path="/guide" element={<Navigate to="/pos-buying-guide" replace />} />
            <Route path="/panduan" element={<Navigate to="/pos-buying-guide?lang=bm" replace />} />
            <Route path="/panduan-membeli-pos" element={<Navigate to="/pos-buying-guide?lang=bm" replace />} />

            {/* All other pages — with site chrome */}
            <Route path="*" element={
              <SiteLayout>
                <Routes>
                  {/* Home */}
                  <Route path="/" element={<HomeV3 />} />
                  <Route path="/legacy-home" element={<V2Page />} />
                  <Route path="/build" element={<ComingSoonPage title="Build Your POS" />} />
                  <Route path="/3-in-1" element={<ThreeInOnePage />} />
                  <Route path="/custom-pos" element={<CustomPosPage />} />
                  <Route path="/qkiosk-lite" element={<QKioskLitePage />} />
                  <Route path="/quotegenerator" element={<QuoteGeneratorPage />} />

                  {/* Products Hub */}
                  <Route path="/products" element={<ProductsHubPage />} />

                  {/* QPOS combined section pages (Sell / Manage / Operate / Grow) */}
                  <Route path="/products/sell" element={<ProductSectionPage sectionKey="sell" />} />
                  <Route path="/products/manage" element={<ProductSectionPage sectionKey="manage" />} />
                  <Route path="/products/operate" element={<ProductSectionPage sectionKey="operate" />} />
                  <Route path="/products/grow" element={<ProductSectionPage sectionKey="grow" />} />

                  {/* Sell */}
                  <Route path="/products/pos" element={<PosPage />} />
                  <Route path="/products/mpos" element={<MposPage />} />
                  <Route path="/products/kiosk" element={<KioskPage />} />
                  <Route path="/products/webstore" element={<WebstorePage />} />
                  <Route path="/products/tablet" element={<TabletPage />} />
                  <Route path="/products/qr-order" element={<QrOrderingPage />} />
                  <Route path="/products/scan-to-order" element={<Navigate to="/products/qr-order" replace />} />
                  <Route path="/products/qr-ordering" element={<Navigate to="/products/qr-order" replace />} />

                  {/* Manage */}
                  <Route path="/products/qhub" element={<QhubPage />} />
                  <Route path="/products/inventory" element={<InventoryPage />} />
                  <Route path="/products/loyalty" element={<LoyaltyPage />} />

                  {/* Operate */}
                  <Route path="/products/kitchen-display" element={<KitchenDisplayPage />} />
                  <Route path="/products/qms" element={<QmsPage />} />
                  <Route path="/products/live-display" element={<LiveDisplayPage />} />

                  {/* Grow */}
                  <Route path="/products/sales-boosters" element={<SalesBoostersPage />} />
                  <Route path="/products/ai-insights" element={<AiInsightsPage />} />

                  {/* Why Q */}
                  <Route path="/why-q/pos-quality" element={<PosQualityPage />} />
                  <Route path="/why-q/grow-sales" element={<GrowSalesPage />} />
                  <Route path="/why-q/easy-to-manage" element={<EasyToManagePage />} />
                  <Route path="/why-q/sell-everywhere" element={<SellEverywherePage />} />

                  {/* Hardware */}
                  <Route path="/hardware" element={<HardwarePage />} />

                  {/* Pricing */}
                  <Route path="/pricing" element={<PricingPage />} />

                  {/* Video */}
                  <Route path="/video" element={<VideoPage />} />

                  {/* Free Tools */}
                  <Route path="/tools" element={<FreeToolsPage />} />
                  <Route path="/tools/qr-generator" element={<QrGeneratorPage />} />
                  <Route path="/tools/review-qr" element={<ReviewQrPage />} />
                  <Route path="/tools/menu-qr" element={<MenuQrPage />} />
                  <Route path="/tools/wa-booking" element={<WaBookingPage />} />
                  <Route path="/tools/wa-order" element={<WaOrderLandingPage />} />
                  <Route path="/tools/wa-order/login" element={<MerchantAuthProvider><WaOrderLoginPage /></MerchantAuthProvider>} />
                  <Route path="/tools/wa-order/signup" element={<MerchantAuthProvider><WaOrderSignupPage /></MerchantAuthProvider>} />
                  <Route path="/tools/wa-order/dashboard" element={<MerchantAuthProvider><MerchantAuthGuard><WaOrderDashboardPage /></MerchantAuthGuard></MerchantAuthProvider>} />
                  {/* Legacy tool routes */}
                  <Route path="/tools/pdf-menu" element={<PdfMenuPage />} />
                  <Route path="/tools/booking-qr" element={<BookingQrPage />} />

                  {/* Company */}
                  <Route path="/about-us" element={<AboutUsPage />} />
                  <Route path="/contact-us" element={<ContactUsPage />} />

                  {/* Legal */}
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/refund" element={<RefundPage />} />

                  {/* 404 */}
                  <Route path="/techforbiz" element={<ExternalRedirect url="https://whatsapp.com/channel/0029Vb7tIRB2Jl863ZcJKe1r" />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </SiteLayout>
            } />
          </Routes>
        </Suspense>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;
