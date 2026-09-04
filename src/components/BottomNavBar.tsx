import { Home, Package, HelpCircle, Monitor, Tag } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BottomNavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'products', label: 'Products', icon: Package, path: '/products' },
    { id: 'whyq', label: 'Why Q', icon: HelpCircle, path: '/why-q/pos-quality' },
    { id: 'hardware', label: 'Hardware', icon: Monitor, path: '/hardware' },
    { id: 'pricing', label: 'Pricing', icon: Tag, path: '/pricing' },
  ];

  const isActive = (item: typeof navItems[number]) => {
    if (item.id === 'home') return location.pathname === '/';
    if (item.id === 'products') return location.pathname.startsWith('/products');
    if (item.id === 'whyq') return location.pathname.startsWith('/why-q');
    if (item.id === 'hardware') return location.pathname === '/hardware';
    if (item.id === 'pricing') return location.pathname === '/pricing';
    return false;
  };

  const handleClick = (item: typeof navItems[number]) => {
    if (item.id === 'home' && location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(item.path);
    }
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 z-50 safe-area-bottom">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                active
                  ? 'text-black bg-gray-50'
                  : 'text-gray-500 hover:text-black hover:bg-gray-50'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className={`text-[9px] font-bold uppercase tracking-wide ${active ? 'text-black' : ''}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
