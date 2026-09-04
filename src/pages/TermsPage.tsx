import SEOHead from '../components/SEOHead';

export default function TermsPage() {
  return (
    <>
      <SEOHead
        title="Terms &amp; Conditions | QBot Malaysia"
        description="Terms and conditions for using QBot POS systems, self-service kiosks, and the qbot.now website and services."
        keywords="QBot terms, QPOS terms of service, terms and conditions Malaysia, QBot kiosk terms"
        url="https://qbot.now/terms"
      />
      <div className="pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-3xl md:text-5xl font-black text-black tracking-tight mb-3">Terms and Conditions for Qbot</h1>
          <p className="text-[12px] text-gray-500 mb-10">Last updated: April 21, 2026</p>

          <p className="text-[15px] text-gray-700 leading-relaxed mb-10">
            Welcome to Qbot! By accessing or using our website and kiosk services, you agree to be bound by these
            Terms and Conditions. If you do not agree, please do not use our services.
          </p>

          <Section title="1. Use of Services">
            <p>Qbot provides self-service kiosk solutions for ticketing, check-in, and related features at gyms, indoor parks, outdoor theme parks, and other venues.</p>
            <p>You agree to use our services only for lawful purposes and in accordance with these terms.</p>
          </Section>

          <Section title="2. Account and Access">
            <p>Some features may require account creation or personal information input. You are responsible for maintaining the confidentiality of your information and for all activities that occur under your account.</p>
          </Section>

          <Section title="3. Payments">
            <p>Payments made through Qbot kiosks or website are processed securely. Prices may vary depending on venue and service type.</p>
          </Section>

          <Section title="4. Service Availability">
            <p>We strive for 24/7 service availability, but Qbot may experience temporary interruptions due to maintenance, upgrades, or technical issues.</p>
          </Section>

          <Section title="5. Intellectual Property">
            <p>All content, logos, and technology used in Qbot are owned by or licensed to Qbot.jp. Unauthorized use is prohibited.</p>
          </Section>

          <Section title="6. Changes to Terms">
            <p>We reserve the right to update these Terms at any time. Changes will be posted on this page with an updated date.</p>
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
