import { useState, useEffect } from 'react';
import { Package, Building2, Settings, FileText, LogOut, BarChart3, Menu, X } from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import AdminProducts from './AdminProducts';
import AdminIndustries from './AdminIndustries';
import AdminPresets from './AdminPresets';
import AdminQuotes from './AdminQuotes';

type AdminView = 'products' | 'industries' | 'presets' | 'quotes';

interface AdminPanelProps {
  onBack: () => void;
}

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const [currentView, setCurrentView] = useState<AdminView>('quotes');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('adminSidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const { logout, adminEmail } = useAdminAuth();

  useEffect(() => {
    localStorage.setItem('adminSidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const handleLogout = async () => {
    await logout();
    onBack();
  };

  const menuItems = [
    { id: 'products' as AdminView, label: 'Products', icon: Package },
    { id: 'industries' as AdminView, label: 'Industries', icon: Building2 },
    { id: 'presets' as AdminView, label: 'Industry Presets', icon: Settings },
    { id: 'quotes' as AdminView, label: 'Quote Requests', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-black text-white border-b border-gray-300">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 hover:bg-gray-800 transition-colors"
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
              </button>
              <div>
                <h1 className="text-xl font-black uppercase">Admin Panel</h1>
                <p className="text-xs font-bold text-gray-400 uppercase">{adminEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onBack}
                className="px-4 py-2 bg-white text-black font-black text-xs uppercase border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                Back to Site
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-gray-300 font-black text-xs uppercase hover:bg-white hover:text-black transition-colors flex items-center gap-2"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`bg-white border-r border-gray-300 transition-all duration-300 flex-shrink-0 ${
            sidebarCollapsed ? 'w-16' : 'w-60'
          }`}
        >
          <nav className="p-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 mb-1 font-bold text-xs uppercase transition-colors ${
                    currentView === item.id
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-gray-100'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon size={18} strokeWidth={2.5} className="flex-shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {!sidebarCollapsed && (
            <div className="m-2 p-3 bg-gray-50 border border-gray-300">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 size={14} className="text-gray-600" />
                <h3 className="text-xs font-black uppercase">Stats</h3>
              </div>
              <p className="text-xs text-gray-600 font-bold">
                System operational
              </p>
            </div>
          )}
        </aside>

        <main className="flex-1 overflow-auto relative">
          <div className="p-4">
            {currentView === 'products' && <AdminProducts />}
            {currentView === 'industries' && <AdminIndustries />}
            {currentView === 'presets' && <AdminPresets />}
            {currentView === 'quotes' && <AdminQuotes />}
          </div>
        </main>
      </div>
    </div>
  );
}
