import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';
import InactivityMonitor from '../common/InactivityMonitor';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <InactivityMonitor>
      {children}
    </InactivityMonitor>
  );
}
