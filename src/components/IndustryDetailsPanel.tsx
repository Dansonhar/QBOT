import { useState, useEffect } from 'react';
import { ArrowRight, Check, Play, X } from 'lucide-react';
import { Industry } from '../types/industry';

interface IndustryDetailsPanelProps {
  industry: Industry;
  onBuildMyQBot: (industryId: string) => void;
}

export default function IndustryDetailsPanel({ industry, onBuildMyQBot }: IndustryDetailsPanelProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      setTimeout(() => {
        const panel = document.getElementById('industry-details-panel');
        if (panel) {
          panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 300);
    }
  }, [industry.id]);
  const getBenefitLabels = (industry: Industry): string[] => {
    const labelMap: Record<string, string> = {
      'save-staff-cost': 'Cutting staff cost',
      'increase-upsell': 'More upsells',
      'faster-turnover': 'Faster customer flow',
      '24-7-access': '24/7 access',
      'self-checkin': 'Self check-in/out',
      'membership-loyalty': 'Membership & loyalty',
      'queue-ticketing': 'Queue & ticketing',
      'data-reporting': 'Data & insights',
    };

    return industry.categories.slice(0, 3).map((cat) => labelMap[cat] || cat);
  };

  const handleCtaClick = () => {
    onBuildMyQBot(industry.id);
  };

  return (
    <div className="h-full flex flex-col bg-white border-2 lg:border border-gray-300 p-4 md:p-8 lg:p-12">
      <div className="flex-1">
        <div className="mb-4 md:mb-8">
          <p className="text-xs md:text-sm font-bold text-gray-600 uppercase mb-2 tracking-wider">
            SELECTED INDUSTRY
          </p>
          <h3 className="text-2xl md:text-4xl lg:text-5xl font-black text-black uppercase leading-none mb-4 md:mb-6">
            {industry.name}
          </h3>
          <div className="aspect-video w-full border border-gray-300 overflow-hidden mb-4 md:mb-6 relative group">
            <img
              src={industry.imageStatic || industry.image}
              alt={`${industry.name} industry`}
              className="w-full h-full object-cover"
            />
            {industry.videoUrl && (
              <button
                onClick={() => setIsVideoPlaying(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all duration-300"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Play size={24} strokeWidth={2.5} className="text-black ml-1 md:w-8 md:h-8" />
                </div>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3 md:space-y-6 mb-4 md:mb-8">
          {industry.benefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 bg-black flex items-center justify-center border border-gray-300 mt-1">
                <Check size={16} strokeWidth={3} className="text-white md:w-5 md:h-5" />
              </div>
              <p className="text-sm md:text-lg font-bold text-black uppercase leading-tight flex-1">
                {benefit}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-4 md:mb-8 p-4 md:p-6 bg-gray-50 border border-gray-300">
          <p className="text-xs md:text-sm font-black text-black uppercase mb-2">
            BEST FOR:
          </p>
          <p className="text-xs md:text-base font-bold text-black">
            {getBenefitLabels(industry).join(' • ')}
          </p>
        </div>
      </div>

      <div>
        <button
          onClick={handleCtaClick}
          className="w-full flex items-center justify-between px-4 md:px-8 py-4 md:py-6 bg-black text-white font-black text-sm md:text-lg uppercase border border-gray-300 hover:bg-white hover:text-black transition-all duration-300 mb-2 md:mb-4 group"
        >
          <span>Build My QBot For {industry.name}</span>
          <ArrowRight
            size={20}
            strokeWidth={3}
            className="group-hover:translate-x-2 transition-transform duration-300 md:w-6 md:h-6"
          />
        </button>
        <p className="text-xs md:text-sm font-bold text-gray-600 text-center uppercase">
          You'll see a demo flow and recommended setup for your business
        </p>
      </div>

      {isVideoPlaying && industry.videoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="relative w-full max-w-5xl">
            <button
              onClick={() => setIsVideoPlaying(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={32} strokeWidth={2.5} />
            </button>
            <div className="aspect-video w-full bg-black">
              <video
                src={industry.videoUrl}
                controls
                autoPlay
                className="w-full h-full"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
