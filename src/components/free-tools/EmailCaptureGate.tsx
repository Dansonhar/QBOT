import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface EmailCaptureGateProps {
  toolUsed: 'pdf_menu' | 'review_qr' | 'booking_qr' | 'qr_generator';
  metadata?: Record<string, unknown>;
  headline: string;
  buttonText: string;
  prefillBusinessName?: string;
  hostedPageShortId?: string;
  onCaptured: () => void;
}

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || null,
    utm_medium: params.get('utm_medium') || null,
    utm_campaign: params.get('utm_campaign') || null,
  };
}

const SESSION_KEY = 'qbot_free_tools_lead';

export function getStoredLead(): { businessName: string; email: string; phone: string } | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

export default function EmailCaptureGate({
  toolUsed,
  metadata,
  headline,
  buttonText,
  prefillBusinessName,
  hostedPageShortId,
  onCaptured,
}: EmailCaptureGateProps) {
  const [businessName, setBusinessName] = useState(prefillBusinessName || '');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+60');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = getStoredLead();
    if (stored) {
      onCaptured();
    }
  }, [onCaptured]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!businessName.trim() || !email.trim() || !phone.trim()) {
      setError('All fields are required.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const utm = getUtmParams();
      const { error: dbError } = await supabase.from('free_tool_leads').insert({
        business_name: businessName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        tool_used: toolUsed,
        metadata: metadata || {},
        ...utm,
      });

      if (dbError) throw dbError;

      // Update hosted page with creator email if applicable
      if (hostedPageShortId) {
        await supabase
          .from('hosted_pages')
          .update({ created_by_email: email.trim() })
          .eq('short_id', hostedPageShortId);
      }

      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ businessName: businessName.trim(), email: email.trim(), phone: phone.trim() })
      );
      onCaptured();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-300 bg-white p-6 md:p-8 max-w-md mx-auto">
      <h3 className="text-lg font-black text-black uppercase tracking-tight mb-1">{headline}</h3>
      <p className="text-xs text-gray-400 mb-6">Enter your details to get your result.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            Business Name
          </label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
            placeholder="Your business name"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
            placeholder="you@business.com"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
            placeholder="+60123456789"
            required
          />
        </div>

        {error && <p className="text-xs text-red-600 font-bold">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white font-black text-sm uppercase tracking-wider py-4 hover:bg-gray-900 transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting...' : buttonText}
        </button>

        <p className="text-[10px] text-gray-400 text-center">
          We'll only use this to send you your link. No spam, ever.
        </p>
      </form>
    </div>
  );
}
