import { Phone, Mail, MapPin } from 'lucide-react';
import { trackWhatsAppClick } from '../utils/trackWhatsApp';

interface ContactInfoProps {
  variant?: 'default' | 'compact' | 'footer';
  showWhatsApp?: boolean;
  className?: string;
}

export default function ContactInfo({ variant = 'default', showWhatsApp = true, className = '' }: ContactInfoProps) {
  const phoneNumber = '+60126909189';
  const displayPhone = '+6012-6909-189';
  const email = 'hello@qbot.now';
  const address = 'B3-6-13 SOLARIS DUTAMAS JALAN DUTAMAS 1 50480';
  const location = 'Publika KL';

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=Hi%20QBot%2C%20I%27m%20interested%20in%20learning%20more%20about%20your%20self-service%20kiosk%20solutions`;

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap items-center gap-4 text-sm ${className}`}>
        <a
          href={showWhatsApp ? whatsappUrl : `tel:${phoneNumber}`}
          className="flex items-center space-x-2 hover:text-gray-600 transition-colors"
          target={showWhatsApp ? "_blank" : undefined}
          rel={showWhatsApp ? "noopener noreferrer" : undefined}
          onClick={showWhatsApp ? () => trackWhatsAppClick('ContactInfo > Phone (Compact)') : undefined}
        >
          <Phone size={16} strokeWidth={2.5} />
          <span className="font-bold">{displayPhone}</span>
        </a>
        <span className="text-gray-400">|</span>
        <a
          href={`mailto:${email}`}
          className="flex items-center space-x-2 hover:text-gray-600 transition-colors"
        >
          <Mail size={16} strokeWidth={2.5} />
          <span className="font-bold">{email}</span>
        </a>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`space-y-3 md:space-y-4 text-xs md:text-sm font-bold ${className}`}>
        <div className="flex items-start space-x-3">
          <MapPin size={18} className="mt-1 flex-shrink-0" strokeWidth={3} />
          <div>
            <p className="mb-1 uppercase">KUALA LUMPUR MALAYSIA</p>
            <p className="text-xs">{address}</p>
            <p className="text-xs text-gray-400 mt-1">({location})</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Phone size={18} strokeWidth={3} />
          {showWhatsApp ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('ContactInfo > Phone (Footer)')}
              className="uppercase hover:text-gray-400 transition-colors duration-200"
            >
              {displayPhone} (WHATSAPP)
            </a>
          ) : (
            <a
              href={`tel:${phoneNumber}`}
              className="uppercase hover:text-gray-400 transition-colors duration-200"
            >
              {displayPhone}
            </a>
          )}
        </div>
        <div className="flex items-center space-x-3 pt-2">
          <Mail size={18} strokeWidth={3} />
          <a href={`mailto:${email}`} className="uppercase hover:text-gray-400 transition-colors duration-200">
            {email}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <MapPin size={20} className="mt-1 flex-shrink-0" strokeWidth={2.5} />
        <div>
          <p className="font-black text-sm uppercase mb-1">Showroom Location</p>
          <p className="text-sm font-bold">{address}</p>
          <p className="text-sm text-gray-600">({location})</p>
          <p className="text-xs text-gray-500 mt-1 italic">*Reservation required</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Phone size={20} strokeWidth={2.5} />
        <div>
          <p className="font-black text-sm uppercase mb-1">Phone / WhatsApp</p>
          {showWhatsApp ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('ContactInfo > Phone (Default)')}
              className="text-sm font-bold hover:text-blue-600 transition-colors"
            >
              {displayPhone}
            </a>
          ) : (
            <a
              href={`tel:${phoneNumber}`}
              className="text-sm font-bold hover:text-blue-600 transition-colors"
            >
              {displayPhone}
            </a>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Mail size={20} strokeWidth={2.5} />
        <div>
          <p className="font-black text-sm uppercase mb-1">Email</p>
          <a
            href={`mailto:${email}`}
            className="text-sm font-bold hover:text-blue-600 transition-colors"
          >
            {email}
          </a>
        </div>
      </div>
    </div>
  );
}
