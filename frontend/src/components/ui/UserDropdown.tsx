import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Key, Settings, LogOut } from 'lucide-react';

interface UserDropdownProps {
  userName: string;
  userRole: string;
  onChangePassword: () => void;
  onSettings?: () => void;
  onLogout: () => void;
  isAdmin?: boolean;
}

export default function UserDropdown({
  userName,
  userRole,
  onChangePassword,
  onSettings,
  onLogout,
  isAdmin = false
}: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 border ${
          isOpen 
            ? 'bg-slate-700 border-emerald-500/40 shadow-lg shadow-emerald-500/20' 
            : 'bg-slate-700/50 border-emerald-500/20 hover:bg-slate-700 hover:border-emerald-500/30'
        }`}
      >
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-white">{userName}</p>
          <p className="text-xs text-emerald-400 capitalize">{userRole}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-emerald-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-slate-800/95 backdrop-blur-xl border border-emerald-500/30 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            <div className="px-4 py-3 border-b border-slate-700/50 mb-2">
              <p className="text-sm font-semibold text-white">{userName}</p>
              <p className="text-xs text-slate-400 capitalize mt-0.5">{userRole}</p>
            </div>

            <button
              onClick={() => handleItemClick(onChangePassword)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-300 rounded-lg transition-all duration-200 group"
            >
              <div className="p-2 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                <Key className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="font-medium">Alterar Senha</p>
                <p className="text-xs text-slate-500 group-hover:text-slate-400">Trocar sua senha de acesso</p>
              </div>
            </button>

            {isAdmin && onSettings && (
              <button
                onClick={() => handleItemClick(onSettings)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-blue-500/10 hover:text-blue-300 rounded-lg transition-all duration-200 group mt-1"
              >
                <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                  <Settings className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Configurações</p>
                  <p className="text-xs text-slate-500 group-hover:text-slate-400">Gerenciar usuários do sistema</p>
                </div>
              </button>
            )}

            <div className="border-t border-slate-700/50 my-2"></div>

            <button
              onClick={() => handleItemClick(onLogout)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-all duration-200 group"
            >
              <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                <LogOut className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-left">
                <p className="font-medium">Sair do Sistema</p>
                <p className="text-xs text-slate-500 group-hover:text-slate-400">Encerrar sua sessão</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
