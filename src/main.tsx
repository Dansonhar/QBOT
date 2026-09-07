import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

// Recover from stale-chunk errors after a deploy.
// When a cached index.html points at chunk hashes that no longer exist,
// the SPA fallback returns HTML for the chunk URL and the browser errors with:
// "Failed to fetch dynamically imported module" or a MIME-type mismatch.
// Reload once to grab a fresh index.html with current chunk references.
const CHUNK_RELOAD_KEY = 'app-chunk-reloaded';
function handleChunkLoadError(reason: unknown) {
  const msg = reason instanceof Error ? reason.message : String(reason ?? '');
  const isChunkError =
    /Failed to fetch dynamically imported module/i.test(msg) ||
    /Loading (chunk|CSS chunk) \d+ failed/i.test(msg) ||
    /Importing a module script failed/i.test(msg) ||
    /MIME type of "text\/html"/i.test(msg);
  if (!isChunkError) return;
  try {
    if (sessionStorage.getItem(CHUNK_RELOAD_KEY)) return; // already retried once — give up to avoid loop
    sessionStorage.setItem(CHUNK_RELOAD_KEY, '1');
    window.location.reload();
  } catch { /* noop */ }
}
window.addEventListener('vite:preloadError', e => handleChunkLoadError((e as unknown as CustomEvent).detail));
window.addEventListener('error', e => handleChunkLoadError(e.error ?? e.message));
window.addEventListener('unhandledrejection', e => handleChunkLoadError(e.reason));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
