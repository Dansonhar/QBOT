import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // qbotweb always runs on 5174 (5173 belongs to qstudio) — strictPort so it
  // fails loudly instead of silently hopping to another port.
  // `host: true` binds 0.0.0.0 instead of localhost, so `npm run dev` prints a
  // Network URL and phones / tablets / other machines on the LAN can open it —
  // no need to remember `-- --host`.
  server: {
    host: true,
    port: 5174,
    strictPort: true,
  },
  preview: {
    host: true,
    port: 5174,
    strictPort: true,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
