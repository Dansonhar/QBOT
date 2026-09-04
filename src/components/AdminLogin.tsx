import { useState } from 'react';
import { X, Lock, Mail } from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';

interface AdminLoginProps {
  onClose: () => void;
}

export default function AdminLogin({ onClose }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        onClose();
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
      <div className="bg-white border border-gray-300 w-full max-w-md">
        <div className="bg-black text-white p-6 flex items-center justify-between border-b border-gray-300">
          <h2 className="text-xl font-black uppercase">Admin Login</h2>
          <button onClick={onClose} className="p-2 hover:bg-white hover:text-black transition-colors">
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-6">
            <label className="block text-sm font-black uppercase mb-2">
              <Mail size={16} className="inline mr-2" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 font-bold focus:outline-none focus:border-gray-400"
              placeholder="admin@qbot.now"
              required
              autoFocus
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-black uppercase mb-2">
              <Lock size={16} className="inline mr-2" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-3 font-bold focus:outline-none focus:border-gray-400"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-600 text-red-600 font-bold text-sm uppercase">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-black text-white font-black uppercase border border-gray-300 hover:bg-white hover:text-black transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
