import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * GitHub Pages serves this project from /QBOT/, not the domain root.
 *
 * Vite rewrites asset URLs it owns (imports, CSS url(), index.html), but the
 * codebase also holds ~443 absolute string literals like "/qpos-keyvisuals/x.webp"
 * written straight into JSX. Those are plain strings, so Vite leaves them alone
 * and they 404 under a subpath. Rewriting them by hand across 55 files would be
 * a large, regression-prone diff; this rewrites them at build time instead.
 *
 * Deliberately narrow: only quoted literals that start with a known public/
 * directory (or a root-level media file) AND end in a media extension. Router
 * paths like "/products/pos" are therefore untouched — they are handled by the
 * router basename, not by base.
 */
const PUBLIC_DIRS = [
  'qpos-keyvisuals', 'video', 'cover', 'context_img', 'qfitimg', 'qsentry_img',
  'qsecurity', 'qsecimg', 'salesbooster', 'quotesys_images', 'growthdeck', 'custompos',
].join('|');

const EXT = '(?:webp|jpe?g|png|svg|mp4|webm)';
const QUOTE = '[\'"`]';

function baseAwareAssets(base: string): Plugin {
  // "/qpos-keyvisuals/hero.webp" -> "/QBOT/qpos-keyvisuals/hero.webp"
  const dirRe = new RegExp('(' + QUOTE + ')/((?:' + PUBLIC_DIRS + ')/[^\'"`]*?\\.' + EXT + ')', 'g');
  // "/qbotlogo.svg" -> "/QBOT/qbotlogo.svg"
  const rootRe = new RegExp('(' + QUOTE + ')/([A-Za-z0-9_-]+\\.' + EXT + ')', 'g');
  return {
    name: 'qbot-base-aware-assets',
    apply: 'build',
    enforce: 'post',
    transform(code: string, id: string) {
      if (base === '/') return null;
      if (!/\.(tsx?|jsx?)$/.test(id) || id.includes('node_modules')) return null;
      const out = code
        .replace(dirRe, (_m: string, q: string, path: string) => q + base + path)
        .replace(rootRe, (_m: string, q: string, path: string) => q + base + path);
      return out === code ? null : { code: out, map: null };
    },
  };
}

// '/' for the root-domain host (qbot.now); '/QBOT/' for GitHub Pages.
const BASE = process.env.VITE_BASE || '/';

// https://vitejs.dev/config/
export default defineConfig({
  base: BASE,
  plugins: [react(), baseAwareAssets(BASE)],
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
