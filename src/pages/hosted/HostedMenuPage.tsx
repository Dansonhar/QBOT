import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import SEOHead from '../../components/SEOHead';

interface MenuConfig {
  images: string[];
}

export default function HostedMenuPage() {
  const { shortId } = useParams<{ shortId: string }>();
  const [businessName, setBusinessName] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      if (!shortId) { setNotFound(true); setLoading(false); return; }

      const { data, error } = await supabase
        .from('hosted_pages')
        .select('business_name, config')
        .eq('short_id', shortId)
        .eq('tool_type', 'pdf_menu')
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setBusinessName(data.business_name);
        setImages((data.config as MenuConfig).images || []);
        document.title = `${data.business_name} — Menu`;
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

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
        <h1 className="text-2xl font-black text-black uppercase mb-2">Menu Not Found</h1>
        <p className="text-sm text-gray-500">This menu link may have been removed or is invalid.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead title={`${businessName || 'Menu'} — Digital Menu`} description="View the menu." noindex />
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <h1 className="text-sm font-black text-black uppercase tracking-wide text-center">
          {businessName}
        </h1>
      </div>

      {/* Menu images */}
      <div className="max-w-lg mx-auto">
        {images.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`Menu page ${i + 1}`}
            className="w-full"
            loading="lazy"
          />
        ))}
      </div>

      {/* Footer branding */}
      <div className="text-center py-8 border-t border-gray-100">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider">
          Powered by QBot — Free digital menu for your business
        </p>
      </div>
    </div>
  );
}
