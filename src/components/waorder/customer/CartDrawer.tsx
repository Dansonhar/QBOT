import { useState } from 'react';
import { X, Plus, Minus, Trash2, MessageCircle } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';

interface Props {
  businessName: string;
  whatsappNumber: string;
  onClose: () => void;
}

export default function CartDrawer({ businessName, whatsappNumber, onClose }: Props) {
  const { cartItems, totalPrice, updateQuantity } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');

  const buildWhatsAppMessage = (): string => {
    let msg = `🛒 *New Order from ${businessName}*\n\n`;
    msg += `👤 ${customerName}\n`;
    if (customerPhone.trim()) msg += `📱 ${customerPhone.trim()}\n`;
    msg += `\n📋 *Order:*\n`;

    for (const ci of cartItems) {
      const lineTotal = ci.item.price * ci.quantity;
      msg += `${ci.quantity}x ${ci.item.name} — RM${lineTotal.toFixed(2)}\n`;
    }

    msg += `\n💰 *Total: RM${totalPrice.toFixed(2)}*\n`;
    if (notes.trim()) msg += `\n📝 *Notes:* ${notes.trim()}\n`;
    msg += `\n---\nOrdered via qbot.now`;

    return msg;
  };

  const handleSendOrder = () => {
    if (!customerName.trim()) return;
    const message = buildWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    // Clean the whatsapp number — remove non-digits, ensure country code
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, '_blank');
  };

  const canSend = customerName.trim().length > 0 && cartItems.length > 0;

  return (
    <div className="fixed inset-0 z-30 flex flex-col">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="relative mt-auto bg-white max-h-[85vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-sm font-bold uppercase tracking-wider">Your Order</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.map(ci => (
            <div key={ci.item.id} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{ci.item.name}</p>
                <p className="text-xs text-gray-500">RM {ci.item.price.toFixed(2)} each</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => updateQuantity(ci.item.id, ci.quantity - 1)} className="w-7 h-7 flex items-center justify-center border border-gray-300 hover:bg-gray-100">
                  {ci.quantity === 1 ? <Trash2 className="w-3 h-3 text-red-400" /> : <Minus className="w-3 h-3" />}
                </button>
                <span className="w-7 text-center text-sm font-bold">{ci.quantity}</span>
                <button onClick={() => updateQuantity(ci.item.id, ci.quantity + 1)} className="w-7 h-7 flex items-center justify-center bg-black text-white hover:bg-gray-800">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <p className="text-sm font-bold w-16 text-right shrink-0">RM {(ci.item.price * ci.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Footer form */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold uppercase tracking-wider">Total</span>
            <span className="text-lg font-black">RM {totalPrice.toFixed(2)}</span>
          </div>

          <input
            type="text"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            placeholder="Your name *"
            className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black"
          />
          <input
            type="tel"
            value={customerPhone}
            onChange={e => setCustomerPhone(e.target.value)}
            placeholder="Phone number (optional)"
            className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black"
          />
          <input
            type="text"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Special requests (optional)"
            className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black"
          />

          <button
            onClick={handleSendOrder}
            disabled={!canSend}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-600 text-white text-sm font-bold uppercase tracking-wider hover:bg-green-500 disabled:opacity-30"
          >
            <MessageCircle className="w-4 h-4" />
            Send Order via WhatsApp
          </button>

          <p className="text-[10px] text-gray-400 text-center">
            WhatsApp required to send your order.
          </p>
        </div>
      </div>
    </div>
  );
}
