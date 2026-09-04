import { useState } from 'react';
import { Download, Copy, Check, Link2, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import ToolExplainer from '../../components/free-tools/ToolExplainer';
import OtherFreeTools from '../../components/free-tools/OtherFreeTools';
import SEOHead from '../../components/SEOHead';
import { nanoid } from 'nanoid';
import { supabase } from '../../lib/supabase';
import QRCode from 'qrcode';

const DOMAIN = 'https://qbot.now';

type QrMode = 'url' | 'document';

export default function QrGeneratorPage() {
  const [businessName, setBusinessName] = useState('');
  const [mode, setMode] = useState<QrMode>('url');
  const [url, setUrl] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ brandedUrl: string; qrDataUrl: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const getFinalUrl = (): string | null => {
    if (mode === 'url') {
      let finalUrl = url.trim();
      if (!finalUrl) { setError('Please enter a URL.'); return null; }
      if (!/^https?:\/\//i.test(finalUrl)) finalUrl = 'https://' + finalUrl;
      try { new URL(finalUrl); } catch { setError('Please enter a valid URL.'); return null; }
      return finalUrl;
    }

    // Document mode
    let finalUrl = docUrl.trim();
    if (!finalUrl) { setError('Please enter a document link.'); return null; }
    if (!/^https?:\/\//i.test(finalUrl)) finalUrl = 'https://' + finalUrl;
    try { new URL(finalUrl); } catch { setError('Please enter a valid link.'); return null; }
    return finalUrl;
  };

  const handleGenerate = async () => {
    setError('');

    if (!businessName.trim()) { setError('Please enter your business name.'); return; }

    const finalUrl = getFinalUrl();
    if (!finalUrl) return;

    setLoading(true);
    try {
      const shortId = nanoid(8);
      const { error: dbError } = await supabase.from('hosted_pages').insert({
        short_id: shortId,
        tool_type: 'qr_redirect',
        business_name: businessName.trim(),
        config: { url: finalUrl, mode },
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
    link.download = `qr-${businessName.trim().replace(/\s+/g, '-').toLowerCase()}-qpos.png`;
    link.href = result.qrDataUrl;
    link.click();
  };

  const handleReset = () => {
    setResult(null);
    setUrl('');
    setDocUrl('');
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Free QR Code Generator Malaysia — Branded, Print-Ready PNG | QPOS"
        description="Generate a free QR code for any link, menu, or document. Print-ready PNG, branded colours, high resolution. No watermark, no sign-up. Works for payments, menus, links."
        keywords="free QR code generator Malaysia, QR code maker Malaysia, branded QR code, custom QR code, business QR code, QR code PNG, QR generator print ready, QPOS free tool"
        url="https://qbot.now/tools/qr-generator"
      />
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        <Link to="/tools" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors">
          &larr; Free Tools
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6">
          {/* Left — Explainer video */}
          <div className="hidden lg:block">
            <ToolExplainer tool="qr-generator" />
          </div>

          {/* Right — Form */}
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-black uppercase tracking-tighter mb-2">QR Code Generator</h1>
            <p className="text-sm text-gray-500 mb-10">Generate a QR code for any URL or document — branded with qbot.now</p>

            {!result ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Business Name</label>
                  <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="My Business" className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-black focus:outline-none" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">QR Links To</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setMode('url')}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border text-sm font-bold uppercase tracking-wider transition-all ${
                        mode === 'url' ? 'border-black bg-black text-white' : 'border-gray-300 text-gray-500 hover:border-gray-400'
                      }`}
                    >
                      <Link2 size={16} /> URL
                    </button>
                    <button
                      onClick={() => setMode('document')}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border text-sm font-bold uppercase tracking-wider transition-all ${
                        mode === 'document' ? 'border-black bg-black text-white' : 'border-gray-300 text-gray-500 hover:border-gray-400'
                      }`}
                    >
                      <FileText size={16} /> Document
                    </button>
                  </div>
                </div>

                {mode === 'url' && (
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">URL</label>
                    <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://your-website.com" className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-black focus:outline-none" onKeyDown={(e) => e.key === 'Enter' && handleGenerate()} />
                  </div>
                )}

                {mode === 'document' && (
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Document Link</label>
                    <input type="url" value={docUrl} onChange={(e) => setDocUrl(e.target.value)} placeholder="https://drive.google.com/file/d/..." className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-black focus:outline-none" onKeyDown={(e) => e.key === 'Enter' && handleGenerate()} />
                    <p className="text-[11px] text-gray-400 mt-1.5">Google Drive, Dropbox, Canva — any shareable link works.</p>
                  </div>
                )}

                {error && <p className="text-sm text-red-500">{error}</p>}
                <button onClick={handleGenerate} disabled={loading} className="w-full py-3 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50">
                  {loading ? 'Generating...' : 'Generate QR Code'}
                </button>
              </div>
            ) : (
              <div className="border border-gray-200 p-8 text-center">
                <img src={result.qrDataUrl} alt="QR Code" className="w-64 h-64 mx-auto mb-2" />
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
                <button onClick={handleReset} className="mt-6 text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-black transition-colors">
                  Generate Another
                </button>
              </div>
            )}

          </div>
        </div>

        <OtherFreeTools current="/tools/qr-generator" />
      </div>
    </div>
  );
}
