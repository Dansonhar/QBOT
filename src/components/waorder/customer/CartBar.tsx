import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';

interface Props {
  onOpen: () => void;
}

export default function CartBar({ onOpen }: Props) {
  const { totalItems, totalPrice } = useCart();

  if (totalItems === 0) return null;

  return (
    <button
      onClick={onOpen}
      className="fixed bottom-0 left-0 right-0 z-20 bg-black text-white px-4 py-3 flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        <div className="relative">
          <ShoppingCart className="w-5 h-5" />
          <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
            {totalItems}
          </span>
        </div>
        <span className="text-sm font-bold">View Cart</span>
      </div>
      <span className="text-sm font-bold">RM {totalPrice.toFixed(2)}</span>
    </button>
  );
}
