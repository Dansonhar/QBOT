import { Link } from 'react-router-dom';
import { QrCode, Star, UtensilsCrossed, MessageCircle, ShoppingCart, ArrowRight, type LucideIcon } from 'lucide-react';

interface Tool {
  icon: LucideIcon;
  name: string;
  path: string;
}

const ALL_TOOLS: Tool[] = [
  { icon: QrCode, name: 'QR Code Generator', path: '/tools/qr-generator' },
  { icon: Star, name: 'Review QR', path: '/tools/review-qr' },
  { icon: UtensilsCrossed, name: 'Menu QR', path: '/tools/menu-qr' },
  { icon: MessageCircle, name: 'WhatsApp Booking', path: '/tools/wa-booking' },
  { icon: ShoppingCart, name: 'WhatsApp Order', path: '/tools/wa-order' },
];

interface Props {
  current: string; // path of current tool, e.g. '/tools/qr-generator'
}

export default function OtherFreeTools({ current }: Props) {
  const others = ALL_TOOLS.filter(t => t.path !== current);

  return (
    <div className="mt-16 pt-8 border-t border-gray-200">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Other Free Tools</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {others.map(tool => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.path}
              to={tool.path}
              className="group flex items-center gap-2.5 px-3 py-3 border border-gray-200 hover:border-black transition-all"
            >
              <div className="w-8 h-8 bg-gray-100 group-hover:bg-black flex items-center justify-center shrink-0 transition-colors">
                <Icon className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-black uppercase tracking-wide truncate">{tool.name}</p>
                <p className="text-[10px] text-gray-400 flex items-center gap-0.5 group-hover:gap-1 transition-all">
                  Use tool <ArrowRight size={8} strokeWidth={3} />
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
