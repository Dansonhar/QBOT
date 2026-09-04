import { useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import ToolExplainer from '../../components/free-tools/ToolExplainer';
import OtherFreeTools from '../../components/free-tools/OtherFreeTools';
import SEOHead from '../../components/SEOHead';
import { nanoid } from 'nanoid';
import { supabase } from '../../lib/supabase';
import QRCode from 'qrcode';

const DOMAIN = 'https://qbot.now';

export default function ReviewQrPage() {
  const [businessName, setBusinessName] = useState('');
  const [googleLink, setGoogleLink] = useState('');
  const [facebookLink, setFacebookLink] = useState('');
  const [reviewReward, setReviewReward] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ brandedUrl: string; qrDataUrl: string } | null>(null);
  const [copied, setCopied] = useState(false);


  const handleGenerate = async () => {
    setError('');

    if (!businessName.trim()) { setError('Please enter your business name.'); return; }
    if (!googleLink.trim() && !facebookLink.trim()) { setError('Please enter at least one review link.'); return; }

    const validateUrl = (u: string) => { try { new URL(u); return true; } catch { return false; } };
    if (googleLink.trim() && !validateUrl(googleLink.trim())) { setError('Google review link is not a valid URL.'); return; }
    if (facebookLink.trim() && !validateUrl(facebookLink.trim())) { setError('Facebook review link is not a valid URL.'); return; }

    setLoading(true);
    try {
      const shortId = nanoid(8);
      const { error: dbError } = await supabase.from('hosted_pages').insert({
        short_id: shortId,
        tool_type: 'review_qr',
        business_name: businessName.trim(),
        config: {
          google_link: googleLink.trim() || null,
          facebook_link: facebookLink.trim() || null,
          review_reward: reviewReward.trim() || null,
        },
      });

      if (dbError) throw dbError;

      const brandedUrl = `${DOMAIN}/freetools/${shortId}`;
      const qrDataUrl = await QRCode.toDataURL(brandedUrl, {
        width: 1024, margin: 2, errorCorrectionLevel: 'H',
      });

      setResult({ brandedUrl, qrDataUrl });
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.brandedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.download = `review-qr-${businessName.trim().replace(/\s+/g, '-').toLowerCase()}-qpos.png`;
    link.href = result.qrDataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Free Google Review QR Code Generator Malaysia | QPOS"
        description="Create a free QR code that sends customers straight to your Google or Facebook review page. Get more reviews, boost local SEO, rank higher. No sign-up required."
        keywords="Google review QR code, Facebook review QR, review QR code generator, get more Google reviews Malaysia, local SEO QR, review link QR, business reviews Malaysia, QPOS free tool"
        url="https://qbot.now/tools/review-qr"
      />
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        <Link to="/tools" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors">
          &larr; Free Tools
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6">
          <div className="hidden lg:block">
            <ToolExplainer tool="review-qr" />
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-black text-black uppercase tracking-tighter mb-2">Review QR Generator</h1>
            <p className="text-sm text-gray-500 mb-10">Paste your Google & Facebook review links — get a branded "Where would you like to review?" chooser page.</p>

            {!result ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Business Name</label>
                  <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="My Restaurant" className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-black focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Google Review Link</label>
                  <input type="url" value={googleLink} onChange={(e) => setGoogleLink(e.target.value)} placeholder="https://g.page/your-business/review" className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-black focus:outline-none" />
                  <p className="text-[10px] text-gray-400 mt-1">Find this in Google Business Profile → Share review link</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Facebook Review Link</label>
                  <input type="url" value={facebookLink} onChange={(e) => setFacebookLink(e.target.value)} placeholder="https://facebook.com/your-page/reviews" className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-black focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">What Customers Get After Review (Optional)</label>
                  <input type="text" value={reviewReward} onChange={(e) => setReviewReward(e.target.value)} placeholder="e.g. Give 5 stars, show to our staff and get a FREE CAKE!" className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-black focus:outline-none" />
                  <p className="text-[10px] text-gray-400 mt-1">Leave empty to skip. This will be shown prominently on the review page to motivate customers.</p>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button onClick={handleGenerate} disabled={loading} className="w-full py-3 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50">
                  {loading ? 'Generating...' : 'Generate Review QR'}
                </button>
              </div>
            ) : (
              <div className="border border-gray-200 p-8 text-center">
                <img src={result.qrDataUrl} alt="Review QR Code" className="w-64 h-64 mx-auto mb-2" />
                <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1">Powered by QPOS</p>
                <p className="text-xs text-gray-500 mb-6 break-all">{result.brandedUrl}</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button onClick={handleDownload} className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors">
                    <Download size={14} /> Download PNG
                  </button>
                  <button onClick={handleCopy} className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-black text-sm font-bold uppercase tracking-wider hover:border-black transition-colors">
                    {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Link</>}
                  </button>
                </div>
                <button onClick={() => setResult(null)} className="mt-6 text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-black transition-colors">
                  Generate Another
                </button>
              </div>
            )}

          </div>
        </div>

        <OtherFreeTools current="/tools/review-qr" />
      </div>
    </div>
  );
}
