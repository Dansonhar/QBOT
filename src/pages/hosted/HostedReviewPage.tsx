import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import SEOHead from '../../components/SEOHead';

interface ReviewConfig {
  google_link: string | null;
  facebook_link: string | null;
  platforms: string[];
}

export default function HostedReviewPage() {
  const { shortId } = useParams<{ shortId: string }>();
  const [businessName, setBusinessName] = useState('');
  const [config, setConfig] = useState<ReviewConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      if (!shortId) { setNotFound(true); setLoading(false); return; }

      const { data, error } = await supabase
        .from('hosted_pages')
        .select('business_name, config')
        .eq('short_id', shortId)
        .eq('tool_type', 'review_qr')
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setBusinessName(data.business_name);
        setConfig(data.config as ReviewConfig);
        document.title = `${data.business_name} — Leave a Review`;

        // Single platform — redirect directly
        const cfg = data.config as ReviewConfig;
        if (cfg.platforms.length === 1) {
          const url = cfg.platforms[0] === 'google' ? cfg.google_link : cfg.facebook_link;
          if (url) {
            window.location.href = url;
            return;
          }
        }
      }
      setLoading(false);
    }
    load();
  }, [shortId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !config) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
        <h1 className="text-2xl font-black text-black uppercase mb-2">Page Not Found</h1>
        <p className="text-sm text-gray-500">This review link may have been removed or is invalid.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <SEOHead title={`${businessName || 'Leave a Review'}`} description="Leave a review for this business." noindex />
      <div className="max-w-sm w-full text-center">
        {/* Business name */}
        <h1 className="text-lg font-black text-black uppercase tracking-tight mb-2">
          {businessName}
        </h1>
        <p className="text-sm text-gray-500 mb-8">Enjoyed your visit? Leave us a review!</p>

        {/* Review buttons */}
        <div className="space-y-3">
          {config.google_link && (
            <a
              href={config.google_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full border-2 border-gray-200 px-6 py-4 text-sm font-bold uppercase tracking-wide hover:border-black transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Review on Google
            </a>
          )}

          {config.facebook_link && (
            <a
              href={config.facebook_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full border-2 border-gray-200 px-6 py-4 text-sm font-bold uppercase tracking-wide hover:border-black transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Review on Facebook
            </a>
          )}
        </div>

        {/* Branding */}
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-12">
          Powered by QBot
        </p>
      </div>
    </div>
  );
}
