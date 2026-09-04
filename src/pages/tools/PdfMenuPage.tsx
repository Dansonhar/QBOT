import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { Upload, X, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ToolPageLayout from '../../components/free-tools/ToolPageLayout';
import EmailCaptureGate, { getStoredLead } from '../../components/free-tools/EmailCaptureGate';
import QRCodeDisplay from '../../components/free-tools/QRCodeDisplay';
import CopyLinkButton from '../../components/free-tools/CopyLinkButton';
import PhonePreview from '../../components/free-tools/PhonePreview';
import SEOHead from '../../components/SEOHead';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const MAX_IMAGES = 5;
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

type Step = 'upload' | 'processing' | 'preview' | 'result';

export default function PdfMenuPage() {
  const [step, setStep] = useState<Step>('upload');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [businessName, setBusinessName] = useState('');
  const [shortId, setShortId] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [gateCleared, setGateCleared] = useState(false);
  const [error, setError] = useState('');
  const [lowQualityWarning, setLowQualityWarning] = useState(false);

  useEffect(() => {
    return () => { previews.forEach((url) => URL.revokeObjectURL(url)); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (getStoredLead()) setGateCleared(true);
  }, []);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    setError('');
    setLowQualityWarning(false);

    const validFiles: File[] = [];
    for (let i = 0; i < newFiles.length && files.length + validFiles.length < MAX_IMAGES; i++) {
      const f = newFiles[i];
      if (f.size > MAX_SIZE) {
        setError(`${f.name} exceeds 10MB limit.`);
        continue;
      }
      if (!f.type.startsWith('image/')) {
        setError(`${f.name} is not an image file.`);
        continue;
      }
      validFiles.push(f);
    }

    if (files.length + validFiles.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed.`);
      return;
    }

    // Check image quality
    validFiles.forEach((f) => {
      const img = new Image();
      img.onload = () => {
        if (img.width < 600 || img.height < 600) {
          setLowQualityWarning(true);
        }
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(f);
    });

    const newPreviews = validFiles.map((f) => URL.createObjectURL(f));
    setFiles((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (idx: number) => {
    URL.revokeObjectURL(previews[idx]);
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleGenerate = async () => {
    if (!businessName.trim()) {
      setError('Please enter your business name.');
      return;
    }
    if (files.length === 0) {
      setError('Please upload at least one menu image.');
      return;
    }

    setStep('processing');
    setError('');

    try {
      const id = nanoid(8);
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const ext = files[i].name.split('.').pop() || 'jpg';
        const path = `menus/${id}/${i}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from('free-tools')
          .upload(path, files[i], { contentType: files[i].type });

        if (uploadErr) throw uploadErr;

        const { data: urlData } = supabase.storage.from('free-tools').getPublicUrl(path);
        uploadedUrls.push(urlData.publicUrl);
      }

      const { error: dbErr } = await supabase.from('hosted_pages').insert({
        short_id: id,
        tool_type: 'pdf_menu',
        business_name: businessName.trim(),
        config: { images: uploadedUrls },
      });

      if (dbErr) throw dbErr;

      setShortId(id);
      setImageUrls(uploadedUrls);
      setStep(gateCleared ? 'result' : 'preview');
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
      setStep('upload');
    }
  };

  const hostedUrl = shortId ? `${window.location.origin}/m/${shortId}` : '';

  const onGateCaptured = useCallback(() => {
    setGateCleared(true);
    setStep('result');
  }, []);

  return (
    <>
    <SEOHead
      title="Free PDF Menu Maker Malaysia — Digital Menu with QR | QPOS"
      description="Upload your menu (image or PDF), get a shareable digital menu link + QR code. Customers view instantly on any phone — no app required. Free, no sign-up."
      keywords="PDF menu maker Malaysia, digital menu generator, restaurant menu QR, online menu Malaysia, contactless menu, free menu design, menu link generator, cafe menu QR, QPOS free tool"
      url="https://qbot.now/tools/pdf-menu"
    />
    <ToolPageLayout
      title="PDF Menu Generator"
      headline="Turn your menu into a digital link in seconds."
      subtitle="Upload a photo, get a hosted menu page with a QR code."
    >
      {/* Step 1: Upload */}
      {step === 'upload' && (
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Business Name
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors max-w-md"
              placeholder="Your restaurant name"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              Menu Images ({files.length}/{MAX_IMAGES})
            </label>

            {/* Upload area */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-8 cursor-pointer hover:border-black transition-colors">
              <Upload size={32} className="text-gray-400 mb-2" />
              <span className="text-sm font-bold text-gray-500">Click to upload or drag images here</span>
              <span className="text-xs text-gray-400 mt-1">JPG, PNG, HEIC — max 10MB per image</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </label>

            {/* Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                {previews.map((src, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={src}
                      alt={`Menu page ${i + 1}`}
                      className="w-full aspect-[3/4] object-cover border border-gray-200"
                    />
                    <button
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {lowQualityWarning && (
              <div className="flex items-center gap-2 mt-3 text-xs text-amber-600 font-bold">
                <AlertTriangle size={14} />
                Your image looks low quality — your menu may appear blurry. Try a higher resolution photo.
              </div>
            )}
          </div>

          {error && <p className="text-xs text-red-600 font-bold">{error}</p>}

          <button
            onClick={handleGenerate}
            disabled={files.length === 0}
            className="px-8 py-4 bg-black text-white font-black text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors disabled:opacity-30"
          >
            Generate Menu →
          </button>
        </div>
      )}

      {/* Step 2: Processing */}
      {step === 'processing' && (
        <div className="text-center py-16">
          <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
            Creating your digital menu...
          </p>
        </div>
      )}

      {/* Step 3: Preview (gated) */}
      {step === 'preview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PhonePreview>
              <div className="p-4">
                <h2 className="text-sm font-black text-black uppercase text-center mb-3">
                  {businessName}
                </h2>
                {imageUrls.map((url, i) => (
                  <img key={i} src={url} alt={`Menu ${i + 1}`} className="w-full mb-2" />
                ))}
                <p className="text-[8px] text-gray-400 text-center mt-4">Powered by QBot</p>
              </div>
            </PhonePreview>

            <div className="space-y-6">
              <div className="opacity-50 pointer-events-none">
                <QRCodeDisplay value={hostedUrl} showDownload={false} />
              </div>
              <div className="opacity-50">
                <p className="text-xs text-gray-500 font-mono truncate">{hostedUrl}</p>
              </div>

              <EmailCaptureGate
                toolUsed="pdf_menu"
                metadata={{ hosted_link: hostedUrl }}
                headline="Your menu is ready!"
                buttonText="Get My Menu Link →"
                prefillBusinessName={businessName}
                hostedPageShortId={shortId}
                onCaptured={onGateCaptured}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Result */}
      {step === 'result' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PhonePreview>
              <div className="p-4">
                <h2 className="text-sm font-black text-black uppercase text-center mb-3">
                  {businessName}
                </h2>
                {imageUrls.map((url, i) => (
                  <img key={i} src={url} alt={`Menu ${i + 1}`} className="w-full mb-2" />
                ))}
                <p className="text-[8px] text-gray-400 text-center mt-4">Powered by QBot</p>
              </div>
            </PhonePreview>

            <div className="space-y-6">
              <QRCodeDisplay value={hostedUrl} downloadFileName={`menu-qr-${shortId}`} />
              <CopyLinkButton url={hostedUrl} />
              <p className="text-xs text-gray-500">
                Print this QR and place it on your table, counter, or storefront. Customers scan it to see your menu on their phone.
              </p>

              {/* Upsell */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-xs text-gray-400">
                  Want a digital menu with online ordering?{' '}
                  <Link
                    to="/products/webstore"
                    className="inline-flex items-center gap-1 text-black font-bold hover:underline"
                  >
                    See QBot Webstore <ArrowRight size={10} />
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </ToolPageLayout>
    </>
  );
}
