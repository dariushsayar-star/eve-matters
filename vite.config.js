import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// EVE Matters Experience Center — Vite config
// base: './' is required so Electron can load assets via file:// in production
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5173,
    strictPort: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
