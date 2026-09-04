import SEOHead from '../components/SEOHead';

export default function PrivacyPage() {
  return (
    <>
      <SEOHead
        title="Privacy Policy | QBot Malaysia"
        description="How QBot collects, uses, stores, and protects your personal data. PDPA-compliant, transparent, and always under your control."
        keywords="QBot privacy policy, QPOS privacy, PDPA compliance Malaysia, data protection POS"
        url="https://qbot.now/privacy"
      />
      <div className="pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-3xl md:text-5xl font-black text-black tracking-tight mb-3">Privacy Policy for Qbot</h1>
          <p className="text-[12px] text-gray-500 mb-10">Last updated: April 21, 2026</p>

          <p className="text-[15px] text-gray-700 leading-relaxed mb-10">
            Qbot respects your privacy and is committed to protecting your personal data. This policy explains how we
            collect, use, and store your information.
          </p>

          <Section title="1. Information We Collect">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Name, email, phone number (if provided by user)</li>
              <li>Payment information (processed securely through third-party services)</li>
              <li>Kiosk usage data (e.g., check-in times, ticket selections)</li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Data">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>To process transactions</li>
              <li>To improve the performance and user experience of our kiosks and website</li>
              <li>To respond to inquiries or customer service requests</li>
            </ul>
          </Section>

          <Section title="3. Sharing of Information">
            <p>We do not sell or rent your personal data. We may share data with service providers only to the extent necessary to operate our services (e.g., payment processors).</p>
          </Section>

          <Section title="4. Data Security">
            <p>We implement industry-standard encryption and security protocols to protect your data.</p>
          </Section>

          <Section title="5. Your Rights">
            <p>
              Users in Japan and other jurisdictions may request to access, correct, or delete their data by contacting us at{' '}
              <a href="mailto:hello@qbot.now" className="text-green-600 hover:text-green-500 underline">hello@qbot.now</a>.
            </p>
          </Section>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg md:text-xl font-black text-black uppercase tracking-tight mb-3">{title}</h2>
      <div className="space-y-3 text-[14px] text-gray-700 leading-relaxed">{children}</div>
    </section>
  );
}
