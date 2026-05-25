import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgGradient: 'bg-gradient-to-r from-green-500 to-green-600',
    iconColor: 'text-white',
  },
  error: {
    icon: XCircle,
    bgGradient: 'bg-gradient-to-r from-red-500 to-red-600',
    iconColor: 'text-white',
  },
  info: {
    icon: AlertCircle,
    bgGradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
    iconColor: 'text-white',
  },
};

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-slide-in-right pointer-events-auto">
      <div className={`${config.bgGradient} rounded-lg shadow-lg overflow-hidden min-w-[320px] max-w-md`}>
        <div className="flex items-center gap-3 p-4">
          <Icon className={`w-6 h-6 flex-shrink-0 ${config.iconColor}`} />
          <p className="text-white font-medium text-sm flex-1">{message}</p>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="h-1 bg-white/20">
          <div 
            className="h-full bg-white/40 animate-progress" 
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      </div>
    </div>
  );
}
