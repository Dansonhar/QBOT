import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2, ChevronRight } from 'lucide-react';
import type { WaOrderCategory } from '../../types/waorder';

interface Props {
  category: WaOrderCategory;
  isSelected: boolean;
  itemCount: number;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CategoryListItem({ category, isSelected, itemCount, onSelect, onEdit, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-3 cursor-pointer border-l-2 transition-colors ${
        isSelected ? 'border-black bg-gray-50' : 'border-transparent hover:bg-gray-50'
      }`}
      onClick={onSelect}
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing shrink-0" onClick={e => e.stopPropagation()}>
        <GripVertical className="w-4 h-4 text-gray-300" />
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{category.name}</p>
        <p className="text-[11px] text-gray-400">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
      </div>

      <div className="flex items-center gap-0.5 shrink-0">
        <button onClick={e => { e.stopPropagation(); onEdit(); }} className="p-1 hover:bg-gray-100" title="Edit">
          <Pencil className="w-3 h-3 text-gray-400" />
        </button>
        <button onClick={e => { e.stopPropagation(); onDelete(); }} className="p-1 hover:bg-red-50" title="Delete">
          <Trash2 className="w-3 h-3 text-red-400" />
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-300 ml-1" />
      </div>
    </div>
  );
}
