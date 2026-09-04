import { useState } from 'react';
import { Download, Copy, Check, Plus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import ToolExplainer from '../../components/free-tools/ToolExplainer';
import OtherFreeTools from '../../components/free-tools/OtherFreeTools';
import SEOHead from '../../components/SEOHead';
import { nanoid } from 'nanoid';
import { supabase } from '../../lib/supabase';
import QRCode from 'qrcode';

const DOMAIN = 'https://qbot.now';

const AVAILABLE_FIELDS = [
  { key: 'name', label: 'Name', default: true },
  { key: 'phone', label: 'Phone Number', default: true },
  { key: 'date', label: 'Date', default: true },
  { key: 'time', label: 'Preferred Time', default: true },
  { key: 'pax', label: 'Number of Guests', default: true },
  { key: 'message', label: 'Special Requests', default: false },
];

export default function WaBookingPage() {
  const [businessName, setBusinessName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [fields, setFields] = useState<string[]>(AVAILABLE_FIELDS.filter(f => f.default).map(f => f.key));
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [newSlot, setNewSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ brandedUrl: string; qrDataUrl: string } | null>(null);
  const [copied, setCopied] = useState(false);


  const toggleField = (key: string) => {
    setFields(prev => prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key]);
  };

  const formatTime12h = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${suffix}`;
  };

  const addSlot = () => {
    if (!newSlot.trim()) return;
    const formatted = formatTime12h(newSlot);
    if (timeSlots.includes(formatted)) return;
    setTimeSlots(prev => [...prev, formatted]);
    setNewSlot('');
  };

  const removeSlot = (slot: string) => {
    setTimeSlots(prev => prev.filter(s => s !== slot));
  };

  const handleGenerate = async () => {
    setError('');

    if (!businessName.trim()) { setError('Please enter your business name.'); return; }
    if (!whatsappNumber.trim()) { setError('Please enter your WhatsApp number.'); return; }
    if (fields.length === 0) { setError('Please select at least one form field.'); return; }

    setLoading(true);
    try {
      const shortId = nanoid(8);
      const { error: dbError } = await supabase.from('hosted_pages').insert({
        short_id: shortId,
        tool_type: 'wa_booking',
        business_name: businessName.trim(),
        config: {
          whatsapp_number: whatsappNumber.trim(),
          fields,
          time_slots: timeSlots,
          notes: notes.trim(),
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
    link.download = `booking-qr-${businessName.trim().replace(/\s+/g, '-').toLowerCase()}-qpos.png`;
    link.href = result.qrDataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Free WhatsApp Booking Form Generator Malaysia | QPOS"
        description="Build a WhatsApp booking link with pre-filled questions for your business. Customers tap, fill, send — you get the booking straight in WhatsApp. Free, no sign-up."
        keywords="WhatsApp booking form Malaysia, WA booking link, WhatsApp appointment form, booking form generator, salon booking WhatsApp, clinic booking WhatsApp, restaurant reservation WhatsApp, QPOS free tool"
        url="https://qbot.now/tools/wa-booking"
      />
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        <Link to="/tools" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors">
          &larr; Free Tools
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6">
          <div className="hidden lg:block">
            <ToolExplainer tool="wa-booking" />
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-black text-black uppercase tracking-tighter mb-2">WhatsApp Booking Form</h1>
            <p className="text-sm text-gray-500 mb-10">Set up your booking fields — we generate a hosted form. Customer submissions go straight to your WhatsApp as a formatted message.</p>

            {!result ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Business Name</label>
                  <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="My Restaurant" className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-black focus:outline-none" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">WhatsApp Number</label>
                  <input type="tel" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} placeholder="60123456789" className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-black focus:outline-none" />
                  <p className="text-[10px] text-gray-400 mt-1">Include country code without + (e.g. 60123456789)</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Form Fields</label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_FIELDS.map((f) => (
                      <button
                        key={f.key}
                        onClick={() => toggleField(f.key)}
                        className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide border transition-all ${
                          fields.includes(f.key) ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {fields.includes('time') && (
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Time Slots (Optional)</label>
                    <p className="text-[10px] text-gray-400 mb-2">Add preset time slots or leave empty for free-text input</p>
                    <div className="flex gap-2 mb-2">
                      <input type="time" value={newSlot} onChange={(e) => setNewSlot(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 text-sm focus:border-black focus:outline-none" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSlot())} />
                      <button onClick={addSlot} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors" type="button">
                        <Plus size={16} />
                      </button>
                    </div>
                    {timeSlots.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {timeSlots.map((slot) => (
                          <span key={slot} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-xs font-medium">
                            {slot}
                            <button onClick={() => removeSlot(slot)} className="text-gray-400 hover:text-black"><X size={12} /></button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Additional Notes (Optional)</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Deposit of RM50 required for groups above 6 pax" className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-black focus:outline-none resize-none" rows={2} />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button onClick={handleGenerate} disabled={loading} className="w-full py-3 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50">
                  {loading ? 'Generating...' : 'Generate Booking Form'}
                </button>
              </div>
            ) : (
              <div className="border border-gray-200 p-8 text-center">
                <img src={result.qrDataUrl} alt="Booking QR Code" className="w-64 h-64 mx-auto mb-2" />
                <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1">Powered by QPOS</p>
                <p className="text-xs text-gray-500 mb-2 break-all">{result.brandedUrl}</p>
                <p className="text-[10px] text-gray-400 mb-6">Share this QR or link — customers fill out the form, and you receive the booking on WhatsApp.</p>
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

        <OtherFreeTools current="/tools/wa-booking" />
      </div>
    </div>
  );
}
