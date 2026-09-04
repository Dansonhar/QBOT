import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const topRow = [
  { img: '/qpos-keyvisuals/hero-qpos.webp', title: 'POS', tagline: 'Your front counter.' },
  { img: '/qpos-keyvisuals/hero-kiosk.webp', title: 'Kiosk', tagline: 'Your self-service station.' },
];
const bottomRow = [
  { img: '/qpos-keyvisuals/hero-mpos.webp', title: 'mPOS', tagline: 'Your floor and queue.' },
  { img: '/qpos-keyvisuals/hero-tableside.webp', title: 'Tablet', tagline: 'Their table. No wait.' },
  { img: '/qpos-keyvisuals/hero-qrorder.webp', title: 'Scan-to-Order', tagline: 'Their phone. Your menu.' },
  { img: '/qpos-keyvisuals/hero-web.webp', title: 'Webstore', tagline: 'Your online store. No middleman.' },
];

export default function KioskSection() {
  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-16 mb-14">
          <h2 className="text-2xl md:text-[36px] lg:text-[42px] font-extrabold text-black leading-[1.12] tracking-tight">
            Sell here, there, and everywhere
          </h2>
          <p className="text-[15px] text-gray-400 leading-[1.7] lg:pt-3">
            Six ways to take an order — counter, handheld, kiosk, QR code, tablet, or online store. Your customer picks how they want to order. You never miss a sale.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4 md:gap-5 mb-4 md:mb-5">
          {topRow.map((ch) => (
            <div key={ch.title} className="group">
              <div className="aspect-video overflow-hidden bg-gray-100 mb-3">
                <img src={ch.img} alt={ch.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-base font-bold text-black mb-0.5">{ch.title}</h3>
              <p className="text-[13px] text-gray-400">{ch.tagline}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-8">
          {bottomRow.map((ch) => (
            <div key={ch.title} className="group">
              <div className="aspect-video overflow-hidden bg-gray-100 mb-3">
                <img src={ch.img} alt={ch.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-sm font-bold text-black mb-0.5">{ch.title}</h3>
              <p className="text-[12px] text-gray-400">{ch.tagline}</p>
            </div>
          ))}
        </div>
        <p className="text-[13px] font-semibold text-gray-500 text-center">
          Every channel feeds into one kitchen, one inventory, one dashboard.
        </p>
      </div>
    </section>
  );
}
