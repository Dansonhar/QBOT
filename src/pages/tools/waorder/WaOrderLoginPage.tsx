import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useMerchantAuth } from '../../../contexts/MerchantAuthContext';
import SEOHead from '../../../components/SEOHead';

export default function WaOrderLoginPage() {
  const navigate = useNavigate();
  const { user, signIn, isLoading: authLoading } = useMerchantAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { document.title = 'Log In — WhatsApp Order | QPOS'; }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) navigate('/tools/wa-order/dashboard', { replace: true });
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    const { error: signInError } = await signIn(email.trim(), password);
    if (signInError) {
      setError(signInError);
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
    <div className="max-w-sm mx-auto px-4 py-12">
      <SEOHead title="Log In — WhatsApp Order | QPOS" description="Log in to manage your WhatsApp ordering menu." noindex />
      <Link to="/tools/wa-order" className="text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-black">
        &larr; Back
      </Link>

      <h1 className="text-2xl font-black uppercase tracking-tight mt-4 mb-1">Log In</h1>
      <p className="text-sm text-gray-500 mb-8">Access your WhatsApp ordering dashboard.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black" placeholder="you@business.com" />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black" />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Don't have an account?{' '}
          <Link to="/tools/wa-order/signup" className="text-black font-bold hover:underline">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
