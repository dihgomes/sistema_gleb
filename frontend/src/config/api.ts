export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003';

export const API_ENDPOINTS = {
  LOGIN: `${API_URL}/api/auth/login`,
  CARTEIRAS: `${API_URL}/api/admin/carteiras`,
  CARTEIRA_PUBLIC: (codigo: string) => `${API_URL}/api/public/carteira/${codigo}`,
  GERAR_QRCODE: (id: string) => `${API_URL}/api/admin/carteiras/${id}/gerar-qrcode`,
};