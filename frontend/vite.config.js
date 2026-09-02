import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    host: '0.0.0.0',
    port: 5410,
    watch: { usePolling: true },
    allowedHosts: ['conic.ddns.net'],
    proxy: {
      '/api': {
        target: 'http://backend:5411',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});