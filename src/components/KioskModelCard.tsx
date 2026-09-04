import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { KioskModel } from '../types/kiosk';

interface KioskModelCardProps {
  model: KioskModel;
  onViewDetails: () => void;
}

export default function KioskModelCard({ model, onViewDetails }: KioskModelCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setIsExpanded(!isExpanded);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails();
  };

  return (
    <div
      className={`bg-white border border-gray-300 transition-all duration-500 cursor-pointer ${
        isExpanded ? 'shadow-2xl' : 'hover:shadow-lg'
      }`}
      onClick={handleCardClick}
    >
      <div className="aspect-square w-full border-b border-gray-300 overflow-hidden bg-white">
        <img
          src={model.image}
          alt={model.name}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="p-4 md:p-6">
        <h3 className="text-xl md:text-2xl font-black text-black uppercase mb-2">
          {model.name}
        </h3>

        <p className="text-sm font-bold text-black uppercase mb-6 tracking-wide">
          {model.tagline}
        </p>

        <div
          className={`transition-all duration-500 overflow-hidden ${
            isExpanded ? 'max-h-[1000px] opacity-100 mb-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="border border-gray-300 p-3 mb-4 bg-gray-50">
            <p className="text-xs font-black text-black uppercase mb-2">PERFECT FOR:</p>
            <p className="text-sm font-bold text-black">{model.perfectFor}</p>
          </div>

          <div className="mb-4">
            <p className="text-xs font-black text-black uppercase mb-3">BENEFITS:</p>
            <div className="space-y-3">
              {model.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check size={20} strokeWidth={3} className="flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-black leading-tight">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleViewDetails}
          className="w-full flex items-center justify-center gap-2 md:gap-3 px-4 py-3 md:px-6 md:py-4 bg-black text-white text-sm md:text-base font-black uppercase border border-gray-300 hover:bg-white hover:text-black transition-colors duration-200 group"
        >
          <span>VIEW {model.name} DETAILS</span>
          <ArrowRight
            size={20}
            strokeWidth={3}
            className="group-hover:translate-x-2 transition-transform duration-300"
          />
        </button>
      </div>
    </div>
  );
}
