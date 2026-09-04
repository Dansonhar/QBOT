import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { trackWhatsAppClick } from '../utils/trackWhatsApp';

export default function ContactUsPage() {
  const phoneNumber = '+60126909189';
  const displayPhone = '+6012-6909-189';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=Hi%20QBot%2C%20I%27m%20interested%20in%20learning%20more%20about%20your%20self-service%20kiosk%20solutions`;

  return (
    <>
      <SEOHead
        title="Contact QBot — Publika KL Showroom & WhatsApp | QPOS Malaysia"
        description="Visit the QBot showroom at Publika KL. Chat on WhatsApp +6012-6909-189 or email hello@qbot.now. Open Mon-Fri 10AM-7PM. See QPOS live before you buy."
        keywords="contact QBot, QBot WhatsApp, QBot Publika KL, POS showroom Malaysia, POS showroom Kuala Lumpur, QPOS demo, kiosk showroom Malaysia, book POS demo Malaysia"
        url="https://qbot.now/contact-us"
      />
      <div className="pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-[11px] font-bold text-green-600 uppercase tracking-[0.15em] mb-4">Contact Us</p>
          <h1 className="text-3xl md:text-5xl font-black text-black tracking-tight mb-6">Let's talk.</h1>
          <p className="text-[15px] text-gray-700 leading-relaxed mb-12">
            Questions, quotes, or a tour of our Publika KL showroom — we'd love to hear from you. Reach us on whichever channel you prefer.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            <ContactCard
              icon={<Phone size={18} strokeWidth={2.5} />}
              label="WhatsApp / Phone"
              value={displayPhone}
              href={whatsappUrl}
              external
              onClick={() => trackWhatsAppClick('ContactUs > Phone')}
            />
            <ContactCard
              icon={<Mail size={18} strokeWidth={2.5} />}
              label="Email"
              value="hello@qbot.now"
              href="mailto:hello@qbot.now"
            />
            <ContactCard
              icon={<MapPin size={18} strokeWidth={2.5} />}
              label="Showroom"
              value={<>B3-6-13 Solaris Dutamas<br />Jalan Dutamas 1, 50480<br />Publika KL</>}
            />
            <ContactCard
              icon={<Clock size={18} strokeWidth={2.5} />}
              label="Hours"
              value={<>Mon–Fri: 10AM – 7PM<br />Sat–Sun: By appointment</>}
            />
          </div>

          <div className="bg-black text-white p-8 md:p-10">
            <h2 className="text-xl md:text-2xl font-black tracking-tight mb-2">Prefer WhatsApp?</h2>
            <p className="text-[13px] text-gray-400 mb-6">Fastest way to reach us. We usually reply within an hour during business hours.</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('ContactUs > WhatsApp CTA')}
              className="inline-block bg-green-600 hover:bg-green-500 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

function ContactCard({
  icon,
  label,
  value,
  href,
  external,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  href?: string;
  external?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <>
      <div className="flex items-center gap-2 mb-2 text-gray-600">
        {icon}
        <p className="text-[10px] font-bold uppercase tracking-[0.15em]">{label}</p>
      </div>
      <div className="text-[14px] text-black leading-relaxed font-medium">{value}</div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        onClick={onClick}
        className="block p-6 border border-gray-200 hover:border-black transition-colors"
      >
        {content}
      </a>
    );
  }
  return <div className="p-6 border border-gray-200">{content}</div>;
}
