import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Upload, X } from 'lucide-react';
import { useMerchantAuth } from '../../../contexts/MerchantAuthContext';
import { uploadToCloudinary } from '../../../services/cloudinaryService';
import SEOHead from '../../../components/SEOHead';

export default function WaOrderSignupPage() {
  const navigate = useNavigate();
  const { user, signUp, isLoading: authLoading } = useMerchantAuth();

  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { document.title = 'Sign Up — WhatsApp Order | QPOS'; }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) navigate('/tools/wa-order/dashboard', { replace: true });
  }, [user, authLoading, navigate]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Logo must be under 5MB'); return; }
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setLogoUrl(url);
    } catch { setError('Logo upload failed.'); }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!businessName.trim() || !email.trim() || !phone.trim() || !whatsapp.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    // Validate WhatsApp number format (Malaysian)
    const cleanWa = whatsapp.replace(/\D/g, '');
    if (!cleanWa.startsWith('60') || cleanWa.length < 11 || cleanWa.length > 12) {
      setError('WhatsApp number must be in Malaysian format (e.g. 60123456789).');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const { error: signUpError } = await signUp(email.trim(), password, {
      business_name: businessName.trim(),
      phone: phone.trim(),
      whatsapp_number: cleanWa,
      logo_url: logoUrl || undefined,
    });

    if (signUpError) {
      setError(signUpError);
      setLoading(false);
    } else {
      navigate('/tools/wa-order/dashboard', { replace: true });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <SEOHead title="Sign Up — WhatsApp Order | QPOS" description="Create a free WhatsApp ordering account." noindex />
      <Link to="/tools/wa-order" className="text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-black">
        &larr; Back
      </Link>

      <h1 className="text-2xl font-black uppercase tracking-tight mt-4 mb-1">Create Your Account</h1>
      <p className="text-sm text-gray-500 mb-8">Set up your WhatsApp ordering page in minutes.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Logo */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Business Logo (optional)</label>
          {logoUrl ? (
            <div className="relative w-20 h-20">
              <img src={logoUrl} alt="" className="w-full h-full object-contain border border-gray-200" />
              <button type="button" onClick={() => setLogoUrl(null)} className="absolute -top-1 -right-1 bg-black text-white p-0.5">
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <label className="flex items-center gap-2 w-fit px-3 py-2 border border-dashed border-gray-300 cursor-pointer hover:border-gray-400 text-xs text-gray-400">
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              {uploading ? 'Uploading...' : 'Upload logo'}
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={uploading} />
            </label>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Business Name *</label>
          <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black" placeholder="e.g. Mama's Kitchen" />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Email *</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black" placeholder="you@business.com" />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Phone *</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black" placeholder="0123456789" />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">WhatsApp Number *</label>
          <input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black" placeholder="60123456789" />
          <p className="text-[10px] text-gray-400 mt-1">Malaysian format with country code (60). Customer orders will be sent here.</p>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Password *</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black" placeholder="Min 6 characters" />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Already have an account?{' '}
          <Link to="/tools/wa-order/login" className="text-black font-bold hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}
