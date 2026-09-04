import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const products = [
  {
    name: 'QBOT V3 MIX',
    description: 'Counter, mobile, and kiosk — three modes in one device.',
    price: 'FROM RM2,999',
    image: '/qpos-keyvisuals/v3mix/desktop.webp',
    path: '/3-in-1',
  },
  {
    name: 'QBOT D3 PRO',
    description: '15.6" FHD desktop POS with optional dual display and AI-ready hardware.',
    price: 'CONTACT US',
    image: '/qpos-keyvisuals/d3pro/d3customerorder.webp',
    path: '/hardware#d3pro',
  },
  {
    name: 'K2 KIOSK',
    description: 'Self-service kiosk for high-traffic ordering. 21" or 27" options.',
    price: 'CONTACT US',
    image: '/qpos-keyvisuals/k2/k2desktop.webp',
    path: '/hardware#kiosk',
  },
];

export default function Products() {
  return (
    <section
      id="products"
      className="relative py-12 md:py-24 bg-white border-t border-gray-300"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 md:mb-20">
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-black mb-3 md:mb-6 uppercase">
            INTRODUCING Q SOLUTIONS
          </h2>
          <p className="text-base md:text-xl lg:text-2xl font-bold text-black uppercase">
            BUILT TO SCALE ADAPT AND GROW WITH YOUR BUSINESS
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {products.map((product) => (
            <Link
              key={product.name}
              to={product.path}
              className="border border-gray-300 bg-white group hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden block"
            >
              <div className="aspect-square overflow-hidden border-b border-gray-300 bg-white relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>

              <div className="p-4 md:p-8">
                <h3 className="text-xl md:text-3xl font-black text-black mb-2 md:mb-3 uppercase group-hover:text-gray-700 transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="text-sm md:text-base font-medium text-gray-700 mb-3 md:mb-4 leading-relaxed">
                  {product.description}
                </p>
                <p className="text-lg md:text-2xl font-black text-black mb-4 md:mb-6 uppercase">
                  {product.price}
                </p>
                <div className="flex items-center gap-2 text-black font-black uppercase text-sm group-hover:gap-4 transition-all duration-300">
                  <span>LEARN MORE</span>
                  <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
