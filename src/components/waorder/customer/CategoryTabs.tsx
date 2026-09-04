import type { WaOrderCategory } from '../../../types/waorder';

interface Props {
  categories: WaOrderCategory[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function CategoryTabs({ categories, selectedId, onSelect }: Props) {
  if (categories.length <= 1) return null;

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 -mx-4 px-4">
      <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`shrink-0 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              selectedId === cat.id
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
