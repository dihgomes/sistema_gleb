import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { startInactivityMonitor, stopInactivityMonitor } from '../../utils/tokenSecurity';
import { logout } from '../../utils/auth';

export default function InactivityMonitor({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleInactivityTimeout = () => {
      console.warn('Sessão expirada por inatividade');
      logout();
      navigate('/admin/login', { 
        state: { message: 'Sua sessão expirou por inatividade. Faça login novamente.' }
      });
    };

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      startInactivityMonitor(handleInactivityTimeout);
    }

    return () => {
      stopInactivityMonitor();
    };
  }, [navigate]);

  return <>{children}</>;
}
