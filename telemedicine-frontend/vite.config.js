import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://khamiyevbabek-001-site1.ktempurl.com',
        changeOrigin: true,
        secure: false,
      },
      '/chathub': {
        target: 'https://khamiyevbabek-001-site1.ktempurl.com',
        ws: true,
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
