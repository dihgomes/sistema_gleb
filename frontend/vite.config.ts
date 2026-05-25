import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true,
    allowedHosts: [
      'localhost',
      'controle-hrrb.com.br',
      'www.controle-hrrb.com.br',
      '.controle-hrrb.com.br'
    ]
  }
});
