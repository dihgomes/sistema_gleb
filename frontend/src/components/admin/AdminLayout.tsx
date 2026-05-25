import { ReactNode } from 'react';
import { LogOut, Home, Users, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout, getAdmin } from '../../utils/auth';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const admin = getAdmin();

  const menuItems = [
    { path: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/admin/carteiras', icon: Users, label: 'Carteiras' },
    { path: '/admin/carteiras/nova', icon: Plus, label: 'Nova Carteira' },
  ];

  const handleLogout = () => {
    if (confirm('Deseja realmente sair?')) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-xl border-b border-emerald-500/10 shadow-lg relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Área Administrativa</h1>
                <p className="text-xs text-emerald-400">Sistema GLEB</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">{admin?.nome}</p>
                <p className="text-xs text-slate-400">{admin?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600/90 hover:bg-red-600 rounded-lg transition-all shadow-lg shadow-red-500/20 border border-red-500/50"
              >
                <LogOut className="w-4 h-4 text-white" />
                <span className="hidden sm:inline text-white font-medium">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-slate-800/30 backdrop-blur-sm border-b border-emerald-500/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? 'border-emerald-500 text-emerald-400 font-semibold bg-emerald-500/10'
                      : 'border-transparent text-slate-400 hover:text-white hover:border-emerald-500/50 hover:bg-slate-700/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800/30 backdrop-blur-sm border-t border-emerald-500/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-slate-400">
            Grande Loja Maçônica do Estado da Bahia - Sistema de Validação de Carteiras
          </p>
          <p className="text-center text-xs text-slate-500 mt-1">
            © {new Date().getFullYear()} Santa Casa de Ruy Barbosa
          </p>
        </div>
      </footer>
    </div>
  );
}
