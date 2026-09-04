import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ExternalLink, Star, MessageCircle } from 'lucide-react';
import WaOrderCustomerView from '../../components/waorder/customer/WaOrderCustomerView';
import SEOHead from '../../components/SEOHead';

interface PageData {
  tool_type: string;
  business_name: string;
  config: Record<string, unknown>;
}

export default function FreeToolHostedPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) { setNotFound(true); setLoading(false); return; }

      const { data: row, error } = await supabase
        .from('hosted_pages')
        .select('tool_type, business_name, config')
        .eq('short_id', id)
        .single();

      if (error || !row) {
        setNotFound(true);
      } else {
        setData(row as PageData);
        document.title = `${row.business_name} — Powered by QPOS`;
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
        <h1 className="text-2xl font-black text-black uppercase mb-2">Page Not Found</h1>
        <p className="text-sm text-gray-500">This link may have been removed or is invalid.</p>
        <PoweredBy />
      </div>
    );
  }

  switch (data.tool_type) {
    case 'qr_redirect':
      return <QrRedirectView businessName={data.business_name} config={data.config} />;
    case 'review_qr':
      return <ReviewChooserView businessName={data.business_name} config={data.config} />;
    case 'menu_qr':
      return <MenuRedirectView businessName={data.business_name} config={data.config} />;
    case 'wa_booking':
      return <WaBookingFormView businessName={data.business_name} config={data.config} />;
    case 'wa_order':
      return <WaOrderCustomerView businessName={data.business_name} config={data.config} />;
    default:
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
          <h1 className="text-2xl font-black text-black uppercase mb-2">Unknown Tool</h1>
          <PoweredBy />
        </div>
      );
  }
}

// ── Powered By QPOS ──────────────────────────────────────────
function PoweredBy() {
  return (
    <div className="mt-8 text-center">
      <a
        href="https://qbot.now"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest hover:text-black transition-colors"
      >
        <img src="/qbotlogo.svg" alt="QPOS" className="w-4 h-4 opacity-40" />
        Powered by QPOS
      </a>
    </div>
  );
}

// ── QR Redirect (any URL) ────────────────────────────────────
function QrRedirectView({ businessName, config }: { businessName: string; config: Record<string, unknown> }) {
  const targetUrl = config.url as string;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-sm w-full text-center shadow-sm">
        <h1 className="text-lg font-black text-black uppercase tracking-tight mb-2">{businessName}</h1>
        <p className="text-sm text-gray-500 mb-6">You're being redirected to:</p>
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
        >
          <ExternalLink size={14} /> Visit Link
        </a>
        <p className="text-[10px] text-gray-400 mt-3 break-all">{targetUrl}</p>
      </div>
      <PoweredBy />
    </div>
  );
}

// ── Review Chooser ───────────────────────────────────────────
function ReviewChooserView({ businessName, config }: { businessName: string; config: Record<string, unknown> }) {
  const googleLink = config.google_link as string | null;
  const facebookLink = config.facebook_link as string | null;
  const reviewReward = config.review_reward as string | null;

  // Single platform — redirect directly
  useEffect(() => {
    const platforms = [googleLink, facebookLink].filter(Boolean);
    if (platforms.length === 1 && !reviewReward) {
      window.location.href = platforms[0]!;
    }
  }, [googleLink, facebookLink, reviewReward]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <SEOHead title={`${businessName} — Leave a Review`} description="Leave a review for this business." noindex />
      <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-sm w-full text-center shadow-sm">
        <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-6 h-6 text-yellow-500" />
        </div>
        <h1 className="text-lg font-black text-black uppercase tracking-tight mb-1">{businessName}</h1>
        <p className="text-sm text-gray-500 mb-4">Where would you like to leave a review?</p>

        {reviewReward && (
          <div className="mb-5 px-4 py-3 bg-yellow-50 border-2 border-yellow-400 rounded-lg animate-pulse">
            <p className="text-xs font-black text-yellow-800 uppercase tracking-wide">🎁 Reward</p>
            <p className="text-sm font-bold text-yellow-900 mt-1">{reviewReward}</p>
          </div>
        )}

        <div className="space-y-3">
          {googleLink && (
            <a
              href={googleLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full px-5 py-3.5 border-2 border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-all"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-sm font-bold text-black">Google</span>
            </a>
          )}
          {facebookLink && (
            <a
              href={facebookLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full px-5 py-3.5 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="text-sm font-bold text-black">Facebook</span>
            </a>
          )}
        </div>
      </div>
      <PoweredBy />
    </div>
  );
}

// ── Menu Redirect ────────────────────────────────────────────
function MenuRedirectView({ businessName, config }: { businessName: string; config: Record<string, unknown> }) {
  const menuUrl = config.menu_url as string;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-sm w-full text-center shadow-sm">
        <h1 className="text-lg font-black text-black uppercase tracking-tight mb-1">{businessName}</h1>
        <p className="text-sm text-gray-500 mb-6">Tap below to view our menu</p>
        <a
          href={menuUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
        >
          <ExternalLink size={14} /> View Menu
        </a>
      </div>
      <PoweredBy />
    </div>
  );
}

// ── WhatsApp Booking Form ────────────────────────────────────
function WaBookingFormView({ businessName, config }: { businessName: string; config: Record<string, unknown> }) {
  const whatsappNumber = config.whatsapp_number as string;
  const fields = (config.fields as string[]) || ['name', 'date', 'time', 'pax'];
  const timeSlots = (config.time_slots as string[]) || [];
  const notes = (config.notes as string) || '';

  const [form, setForm] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const update = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  const fieldLabels: Record<string, string> = {
    name: 'Name',
    phone: 'Phone Number',
    date: 'Date',
    time: 'Preferred Time',
    pax: 'Number of Guests',
    message: 'Special Requests',
  };

  const handleSubmit = () => {
    // Build formatted message
    const lines = [
      `*New Booking Request*`,
      `Business: ${businessName}`,
      '',
      ...fields.map(f => `*${fieldLabels[f] || f}:* ${form[f] || '-'}`),
    ];

    const text = encodeURIComponent(lines.join('\n'));
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
        <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-sm w-full text-center shadow-sm">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-lg font-black text-black uppercase mb-2">Booking Sent!</h2>
          <p className="text-sm text-gray-500 mb-4">Your booking request has been sent to {businessName} via WhatsApp.</p>
          <button
            onClick={() => setSent(false)}
            className="text-xs font-bold text-black uppercase tracking-wider underline"
          >
            Make Another Booking
          </button>
        </div>
        <PoweredBy />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-10">
      <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 max-w-sm w-full shadow-sm">
        <h1 className="text-lg font-black text-black uppercase tracking-tight mb-1 text-center">{businessName}</h1>
        <p className="text-sm text-gray-500 mb-6 text-center">Book your reservation</p>

        {notes && (
          <p className="text-xs text-gray-500 bg-gray-50 rounded px-3 py-2 mb-4">{notes}</p>
        )}

        <div className="space-y-4">
          {fields.includes('name') && (
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Name *</label>
              <input
                type="text"
                value={form.name || ''}
                onChange={(e) => update('name', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:border-black focus:outline-none"
                placeholder="Your name"
              />
            </div>
          )}

          {fields.includes('phone') && (
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Phone *</label>
              <input
                type="tel"
                value={form.phone || ''}
                onChange={(e) => update('phone', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:border-black focus:outline-none"
                placeholder="012-345-6789"
              />
            </div>
          )}

          {fields.includes('date') && (
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Date *</label>
              <input
                type="date"
                value={form.date || ''}
                onChange={(e) => update('date', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:border-black focus:outline-none"
              />
            </div>
          )}

          {fields.includes('time') && (
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Preferred Time *</label>
              {timeSlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => update('time', slot)}
                      className={`border px-3 py-2.5 text-xs font-bold transition-colors ${
                        form.time === slot
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-black'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="time"
                  value={form.time || ''}
                  onChange={(e) => update('time', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:border-black focus:outline-none"
                />
              )}
            </div>
          )}

          {fields.includes('pax') && (
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Number of Guests *</label>
              <input
                type="number"
                min="1"
                value={form.pax || ''}
                onChange={(e) => update('pax', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:border-black focus:outline-none"
                placeholder="2"
              />
            </div>
          )}

          {fields.includes('message') && (
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Special Requests</label>
              <textarea
                value={form.message || ''}
                onChange={(e) => update('message', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:border-black focus:outline-none resize-none"
                rows={3}
                placeholder="Any dietary requirements or special requests..."
              />
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-500 text-white text-sm font-bold uppercase tracking-wider transition-colors"
        >
          <MessageCircle size={16} /> Send via WhatsApp
        </button>
      </div>
      <PoweredBy />
    </div>
  );
}
