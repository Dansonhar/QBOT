import { MessageCircle } from 'lucide-react';
import { trackWhatsAppClick } from '../utils/trackWhatsApp';

interface WhatsAppButtonProps {
  position?: 'bottom-right' | 'bottom-left';
  className?: string;
}

export default function WhatsAppButton({ position = 'bottom-right', className = '' }: WhatsAppButtonProps) {
  const phoneNumber = '60126909189';
  const message = encodeURIComponent(
    "Hi QBot Team! I'm interested in learning more about your AI-powered self-service kiosk solutions for my business in Malaysia. Could you please provide more information?"
  );
  const href = `https://wa.me/${phoneNumber}?text=${message}`;

  const positionClasses = position === 'bottom-right'
    ? 'right-4 md:right-6'
    : 'left-4 md:left-6';

  const handleClick = () => {
    trackWhatsAppClick('Floating Widget > Direct');
  };

  return (
    <div className={`fixed bottom-20 lg:bottom-6 ${positionClasses} ${className}`} style={{ zIndex: 9999 }}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="group relative inline-flex bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full p-4 shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Chat with QBot Team on WhatsApp"
      >
        <MessageCircle size={28} strokeWidth={2.5} className="group-hover:animate-bounce" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
          1
        </span>
      </a>
    </div>
  );
}
