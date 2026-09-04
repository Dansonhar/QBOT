import { Plus, Minus } from 'lucide-react';
import { cloudinaryThumbnail } from '../../../services/cloudinaryService';
import { useCart } from '../../../contexts/CartContext';
import type { WaOrderItem } from '../../../types/waorder';

interface Props {
  item: WaOrderItem;
}

export default function MenuItemCard({ item }: Props) {
  const { addItem, removeItem, getQuantity } = useCart();
  const qty = getQuantity(item.id);

  return (
    <div className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
      {item.image_url && (
        <img
          src={cloudinaryThumbnail(item.image_url)}
          alt={item.name}
          className="w-16 h-16 object-cover shrink-0"
        />
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{item.name}</p>
        {item.description && <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>}
        <p className="text-sm font-bold mt-1">RM {item.price.toFixed(2)}</p>
      </div>

      <div className="flex items-center gap-1 shrink-0 self-center">
        {qty > 0 ? (
          <>
            <button
              onClick={() => removeItem(item.id)}
              className="w-7 h-7 flex items-center justify-center border border-gray-300 hover:bg-gray-100"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-7 text-center text-sm font-bold">{qty}</span>
            <button
              onClick={() => addItem(item)}
              className="w-7 h-7 flex items-center justify-center bg-black text-white hover:bg-gray-800"
            >
              <Plus className="w-3 h-3" />
            </button>
          </>
        ) : (
          <button
            onClick={() => addItem(item)}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:bg-gray-100"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
