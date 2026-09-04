import SEOHead from '../components/SEOHead';

export default function RefundPage() {
  return (
    <>
      <SEOHead
        title="Refund Policy | QBot Malaysia"
        description="QBot refund policy for hardware purchases, software subscriptions, online transactions, and kiosk deployments."
        keywords="QBot refund, QBot return policy, POS refund Malaysia, QPOS refund, kiosk refund"
        url="https://qbot.now/refund"
      />
      <div className="pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-3xl md:text-5xl font-black text-black tracking-tight mb-3">Refund Policy for Qbot</h1>
          <p className="text-[12px] text-gray-500 mb-10">Last updated: April 21, 2026</p>

          <p className="text-[15px] text-gray-700 leading-relaxed mb-10">
            At Qbot, we aim for a seamless self-service experience. If there's an issue with your purchase, we're here to help.
          </p>

          <Section title="1. Eligibility for Refunds">
            <p>Refunds may be issued under the following conditions:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Duplicate transactions</li>
              <li>Service failure (e.g., ticket not issued)</li>
              <li>Accidental overcharges due to system errors</li>
            </ul>
          </Section>

          <Section title="2. Refund Requests">
            <p>
              To request a refund, contact{' '}
              <a href="mailto:hello@qbot.now" className="text-green-600 hover:text-green-500 underline">hello@qbot.now</a>{' '}
              within 7 days of the transaction. Please include:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Transaction ID</li>
              <li>Date and time</li>
              <li>Location and details of the issue</li>
            </ul>
          </Section>

          <Section title="3. Processing Time">
            <p>Approved refunds will be processed to the original payment method within 5–10 business days.</p>
          </Section>

          <Section title="4. Non-Refundable Items">
            <p>Refunds are not provided for:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Change of mind</li>
              <li>Late arrival or no-show at venues</li>
              <li>Services already used</li>
            </ul>
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
