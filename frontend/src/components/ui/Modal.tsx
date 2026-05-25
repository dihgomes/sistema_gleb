import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'primary';
  children?: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmVariant = 'primary',
  children
}: ModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-500/20 max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 px-6 py-4 border-b border-emerald-500/20 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700/50 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-slate-400 hover:text-white" />
          </button>
        </div>

        <div className="px-6 py-6">
          {children || (
            <p className="text-slate-300 text-base leading-relaxed">{message}</p>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-700/50 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg font-semibold transition-all border border-slate-600/50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-lg font-semibold transition-all shadow-lg ${
              confirmVariant === 'danger'
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-red-500/25 border border-red-500/50'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/25 border border-emerald-500/50'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
