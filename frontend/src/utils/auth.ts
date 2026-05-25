export function getToken(): string | null {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

export function getAdmin() {
  const adminStr = localStorage.getItem('admin') || sessionStorage.getItem('admin');
  return adminStr ? JSON.parse(adminStr) : null;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('admin');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('admin');
  window.location.href = '/admin/login';
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
