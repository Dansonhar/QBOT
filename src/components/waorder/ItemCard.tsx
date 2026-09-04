import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { cloudinaryThumbnail } from '../../services/cloudinaryService';
import type { WaOrderItem } from '../../types/waorder';

interface Props {
  item: WaOrderItem;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailability: () => void;
}

export default function ItemCard({ item, onEdit, onDelete, onToggleAvailability }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`flex items-center gap-3 p-3 bg-white border border-gray-200 ${!item.is_available ? 'opacity-50' : ''}`}>
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing shrink-0">
        <GripVertical className="w-4 h-4 text-gray-300" />
      </button>

      {item.image_url && (
        <img src={cloudinaryThumbnail(item.image_url)} alt="" loading="lazy" className="w-12 h-12 object-cover shrink-0" />
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{item.name}</p>
        {item.description && <p className="text-xs text-gray-400 truncate">{item.description}</p>}
        <p className="text-xs font-bold text-gray-600">RM {item.price.toFixed(2)}</p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onToggleAvailability}
          className={`w-8 h-5 rounded-full relative transition-colors ${item.is_available ? 'bg-green-500' : 'bg-gray-300'}`}
          title={item.is_available ? 'Available' : 'Unavailable'}
        >
          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${item.is_available ? 'left-3.5' : 'left-0.5'}`} />
        </button>
        <button onClick={onEdit} className="p-1.5 hover:bg-gray-100" title="Edit">
          <Pencil className="w-3.5 h-3.5 text-gray-500" />
        </button>
        <button onClick={onDelete} className="p-1.5 hover:bg-red-50" title="Delete">
          <Trash2 className="w-3.5 h-3.5 text-red-400" />
        </button>
      </div>
    </div>
  );
}
