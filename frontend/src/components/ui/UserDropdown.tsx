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

  const getInitials = (name: string) => {
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-gradient-to-br from-emerald-500 to-teal-600',
      'bg-gradient-to-br from-blue-500 to-cyan-600',
      'bg-gradient-to-br from-purple-500 to-pink-600',
      'bg-gradient-to-br from-orange-500 to-red-600',
      'bg-gradient-to-br from-indigo-500 to-blue-600',
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className="relative z-[10000]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-2 py-2 rounded-xl transition-all duration-200 ${
          isOpen 
            ? 'bg-slate-800/80 shadow-lg shadow-emerald-500/10 scale-[0.98]' 
            : 'bg-slate-800/40 hover:bg-slate-800/60 hover:shadow-md'
        }`}
      >
        <div className={`w-10 h-10 rounded-lg ${getAvatarColor(userName)} flex items-center justify-center shadow-lg`}>
          <span className="text-white font-bold text-sm">{getInitials(userName)}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 bg-slate-800 border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3">
            <div className="flex items-center gap-3 px-3 py-4 bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-xl mb-3">
              <div className={`w-12 h-12 rounded-xl ${getAvatarColor(userName)} flex items-center justify-center shadow-lg`}>
                <span className="text-white font-bold text-base">{getInitials(userName)}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{userName}</p>
                <p className="text-xs text-emerald-400 capitalize mt-0.5 font-medium">{userRole}</p>
              </div>
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
