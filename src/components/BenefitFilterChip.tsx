import { BenefitFilter } from '../types/industry';

interface BenefitFilterChipProps {
  filter: BenefitFilter;
  isActive: boolean;
  onClick: () => void;
}

export default function BenefitFilterChip({
  filter,
  isActive,
  onClick,
}: BenefitFilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-3 font-black text-sm uppercase whitespace-nowrap
        border border-gray-300 transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
        ${
          isActive
            ? 'bg-black text-white scale-105 shadow-lg'
            : 'bg-white text-black hover:bg-gray-100 hover:scale-105'
        }
      `}
    >
      {filter.label}
    </button>
  );
}
