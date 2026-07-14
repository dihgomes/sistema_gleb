import { Home, Users, Plus, Key, Settings, LogOut, X, Cog } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAdmin } from '../../utils/auth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onChangePassword: () => void;
}

export default function Sidebar({ isOpen, onClose, onLogout, onChangePassword }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const admin = getAdmin();

  const menuItems = [
    { path: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/admin/carteiras', icon: Users, label: 'Carteiras' },
    { path: '/admin/carteiras/nova', icon: Plus, label: 'Nova Carteira' },
    { path: '/admin/pins', icon: Key, label: 'PINs de Acesso' },
    { path: '/admin/configuracoes', icon: Cog, label: 'Configurações' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-slate-800/95 backdrop-blur-xl border-r border-emerald-500/20 z-50 transition-transform duration-300 easeInOut ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:fixed lg:z-30`}
      >
        <div className="flex flex-col h-full w-64">
          {/* Header do Sidebar */}
          <div className="h-16 px-4 border-b border-emerald-500/20 flex items-center">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                  {admin?.nome?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h1 className="text-sm font-bold text-white truncate max-w-[140px]">{admin?.nome || 'Usuário'}</h1>
                  <p className="text-xs text-emerald-400 capitalize">{admin?.role || 'user'}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-white border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer do Sidebar */}
          <div className="p-4 border-t border-emerald-500/20 space-y-2">
            <button
              onClick={() => {
                onChangePassword();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Trocar Senha</span>
            </button>
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
