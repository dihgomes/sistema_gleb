import { ReactNode, useState } from 'react';
import { Menu } from 'lucide-react';
import { logout } from '../../utils/auth';
import Modal from '../ui/Modal';
import ChangePasswordModal from '../ui/ChangePasswordModal';
import Sidebar from './Sidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fundacaoDate = new Date('1950-02-03');
  const hoje = new Date();
  const anos = hoje.getFullYear() - fundacaoDate.getFullYear();
  const jaFezAniversario = hoje.getMonth() > fundacaoDate.getMonth() || 
    (hoje.getMonth() === fundacaoDate.getMonth() && hoje.getDate() >= fundacaoDate.getDate());
  const anosExistencia = jaFezAniversario ? anos : anos - 1;

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  const handleChangePassword = () => {
    setShowChangePasswordModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        onChangePassword={handleChangePassword}
      />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <header className="bg-slate-800/50 backdrop-blur-xl border-b border-emerald-500/10 shadow-lg relative z-50">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-slate-400 hover:text-white transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="ml-4 lg:ml-0">
                <h1 className="text-lg font-bold text-white">Santa Casa de Ruy Barbosa</h1>
                <p className="text-xs text-emerald-400">{anosExistencia} anos cuidando da saúde</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10">
          {children}
        </main>

        <footer className="bg-slate-800/30 backdrop-blur-sm border-t border-emerald-500/10 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-sm text-slate-400">
              SANTA CASA DE RUY BARBOSA - Sistema de Validação de Carteiras
            </p>
            <p className="text-center text-xs text-slate-500 mt-1">
              © {new Date().getFullYear()} Santa Casa de Ruy Barbosa
            </p>
          </div>
        </footer>
      </div>

      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Confirmar Saída"
        message="Deseja realmente sair do sistema?"
        confirmText="Sair"
        cancelText="Cancelar"
        confirmVariant="danger"
      />

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </div>
  );
}
