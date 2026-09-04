import { Phone, ArrowRight } from 'lucide-react';
import { trackWhatsAppClick } from '../utils/trackWhatsApp';

export default function ShowroomSection() {
  const whatsappUrl = 'https://wa.me/60126909189?text=Hi%20QPOS%2C%20I%27d%20like%20to%20schedule%20a%20showroom%20visit%20at%20Publika%20KL';

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <a
            href="https://www.google.com/maps/search/?api=1&query=Solaris+Dutamas+Publika+Kuala+Lumpur"
            target="_blank"
            rel="noopener noreferrer"
            className="block aspect-[4/3] overflow-hidden bg-gray-100 relative group"
          >
            <img
              src="/qbotshowroom.jpg"
              alt="QPOS Showroom at Publika KL — Solaris Dutamas"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="bg-white/95 px-4 py-2 text-xs font-bold text-black uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
                Open in Google Maps
              </span>
            </div>
          </a>
          <div>
            <h2 className="text-2xl md:text-[36px] lg:text-[42px] font-extrabold text-black leading-[1.12] tracking-tight mb-4">
              See it in person
            </h2>
            <p className="text-[15px] text-gray-400 leading-[1.7] mb-6">
              Visit our showroom at Publika KL. Test the 3-in-1 device, try the kiosk, watch Sales Boosters in action, and talk to our team about your business.
            </p>
            <div className="space-y-2 mb-6">
              <p className="text-sm font-semibold text-black">B3-6-13 Solaris Dutamas, Jalan Dutamas 1, 50480 Publika, KL</p>
              <p className="text-sm text-gray-400">Monday–Friday, 10AM–7PM. Reservation required.</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick('Showroom > Book via WhatsApp')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold tracking-wide transition-colors"
              >
                <Phone size={14} strokeWidth={2} /> Book via WhatsApp
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Solaris+Dutamas+Publika+Kuala+Lumpur"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-gray-500 hover:text-black transition-colors inline-flex items-center gap-1"
              >
                Get Directions <ArrowRight size={12} strokeWidth={2} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
