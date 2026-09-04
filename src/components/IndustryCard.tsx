import * as Icons from 'lucide-react';
import { Industry } from '../types/industry';

interface IndustryCardProps {
  industry: Industry;
  isSelected: boolean;
  onClick: () => void;
}

export default function IndustryCard({
  industry,
  isSelected,
  onClick,
}: IndustryCardProps) {
  const IconComponent = Icons[industry.icon as keyof typeof Icons] as React.ComponentType<{ size?: number; strokeWidth?: number }>;

  return (
    <button
      onClick={onClick}
      className={`
        relative p-3 md:p-4 border border-gray-300
        transition-all duration-300 ease-out
        hover:scale-105 hover:shadow-xl hover:z-10
        focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
        ${isSelected ? 'bg-black text-white' : 'bg-white text-black'}
        w-full aspect-square
      `}
    >
      <div className="flex flex-col items-center justify-center space-y-2 md:space-y-3 h-full">
        <div
          className={`
          p-2 md:p-2.5 border border-gray-300
          ${isSelected ? 'bg-white' : 'bg-black'}
          transition-colors duration-300
        `}
        >
          {IconComponent && (
            <IconComponent
              size={24}
              strokeWidth={2.5}
              className={isSelected ? 'text-black' : 'text-white'}
            />
          )}
        </div>

        <h3
          className={`
          text-xs md:text-sm font-black uppercase text-center leading-tight
          ${isSelected ? 'text-white' : 'text-black'}
        `}
        >
          {industry.name}
        </h3>
      </div>

    </button>
  );
}
