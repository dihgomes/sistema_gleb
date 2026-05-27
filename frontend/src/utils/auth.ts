import { validateToken, clearAuthData, isTokenExpired } from './tokenSecurity';

export function getToken(): string | null {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  if (token && isTokenExpired(token)) {
    clearAuthData();
    return null;
  }
  
  return token;
}

export function getAdmin() {
  const adminStr = localStorage.getItem('admin') || sessionStorage.getItem('admin');
  
  if (!validateToken()) {
    return null;
  }
  
  return adminStr ? JSON.parse(adminStr) : null;
}

export function logout() {
  clearAuthData();
  window.location.href = '/admin/login';
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
