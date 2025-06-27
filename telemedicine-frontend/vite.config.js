import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
    'process.env': {},
  },
  resolve: {
    alias: {
      util: 'util/',
      stream: 'stream-browserify',
      events: 'events/',
    },
  },
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
      },
    },
  },
});
