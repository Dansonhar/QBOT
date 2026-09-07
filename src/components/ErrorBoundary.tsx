import { Component, type ErrorInfo, type ReactNode } from 'react';

/**
 * Last line of defence against a blank page.
 *
 * A throw during render unmounts the whole React tree, leaving an empty
 * <div id="root"> — the white screen. This catches it and shows something
 * actionable instead, so a single broken component never costs the whole site.
 */
export default class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[QBot] Uncaught render error:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem', background: '#FAFAF8', color: '#000',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}>
        <div style={{ maxWidth: 460 }}>
          <p style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6B6B6B', margin: 0 }}>
            QBot
          </p>
          <h1 style={{ fontSize: 30, lineHeight: 1.1, letterSpacing: '-0.03em', margin: '14px 0 10px' }}>
            Something went wrong on this page.
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: '#3D3D3D', margin: '0 0 22px' }}>
            The rest of the site is fine. Reload, or get in touch and we will sort it out.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{ background: '#000', color: '#fff', border: 0, padding: '13px 24px',
                       fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer' }}
            >
              Reload
            </button>
            <a
              href="/"
              style={{ border: '1px solid rgba(0,0,0,0.2)', color: '#000', padding: '13px 24px',
                       fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', textDecoration: 'none' }}
            >
              Home
            </a>
          </div>
        </div>
      </div>
    );
  }
}
