import { createBrowserRouter, Navigate } from 'react-router-dom';
import ValidationPage from '../components/public/ValidationPage';
import LoginPage from '../components/admin/LoginPage';
import TrocarSenhaPage from '../components/admin/TrocarSenhaPage';
import Dashboard from '../components/admin/Dashboard';
import CarteirasListPage from '../components/admin/CarteirasListPage';
import CarteiraFormPage from '../components/admin/CarteiraFormPage';
import QRCodePage from '../components/admin/QRCodePage';
import ProtectedRoute from '../components/admin/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/admin/login" replace />,
  },
  {
    path: '/q/:codigo',
    element: <ValidationPage />,
  },
  {
    path: '/admin/login',
    element: <LoginPage />,
  },
  {
    path: '/admin/trocar-senha',
    element: (
      <ProtectedRoute>
        <TrocarSenhaPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/carteiras',
    element: (
      <ProtectedRoute>
        <CarteirasListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/carteiras/nova',
    element: (
      <ProtectedRoute>
        <CarteiraFormPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/carteiras/:id/editar',
    element: (
      <ProtectedRoute>
        <CarteiraFormPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/carteiras/:id/qrcode',
    element: (
      <ProtectedRoute>
        <QRCodePage />
      </ProtectedRoute>
    ),
  },
]);
