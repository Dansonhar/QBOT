import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import SEOHead from '../../components/SEOHead';

interface BookingConfig {
  deposit_amount: number;
  tng_qr_url: string | null;
  time_slots: string[] | null;
  notes: string | null;
}

type BookingStep = 'form' | 'deposit' | 'confirmed';

export default function HostedBookingPage() {
  const { shortId } = useParams<{ shortId: string }>();
  const [businessName, setBusinessName] = useState('');
  const [config, setConfig] = useState<BookingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [bookingStep, setBookingStep] = useState<BookingStep>('form');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [bookingId, setBookingId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+60');
  const [pax, setPax] = useState('2');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  useEffect(() => {
    async function load() {
      if (!shortId) { setNotFound(true); setLoading(false); return; }

      const { data, error } = await supabase
        .from('hosted_pages')
        .select('business_name, config')
        .eq('short_id', shortId)
        .eq('tool_type', 'booking_qr')
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setBusinessName(data.business_name);
        setConfig(data.config as BookingConfig);
        document.title = `Book a Table — ${data.business_name}`;
      }
      setLoading(false);
    }
    load();
  }, [shortId]);

  const today = new Date().toISOString().split('T')[0];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !phone.trim() || !pax || !date || !time) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);

    try {
      const { data: insertedBooking, error: dbErr } = await supabase
        .from('bookings')
        .insert({
          booking_page_id: shortId,
          customer_name: name.trim(),
          customer_phone: phone.trim(),
          pax: parseInt(pax),
          booking_date: date,
          booking_time: time,
          special_requests: specialRequests.trim() || null,
          deposit_confirmed: false,
        })
        .select('id')
        .single();

      if (dbErr) throw dbErr;

      setBookingId(insertedBooking.id);

      // If deposit > 0, show deposit screen; otherwise go straight to confirmation
      if (config && config.deposit_amount > 0) {
        setBookingStep('deposit');
      } else {
        setBookingStep('confirmed');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDepositConfirm = async () => {
    if (bookingId) {
      try {
        await supabase
          .from('bookings')
          .update({ deposit_confirmed: true })
          .eq('id', bookingId);
      } catch {}
    }
    setBookingStep('confirmed');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !config) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
        <h1 className="text-2xl font-black text-black uppercase mb-2">Page Not Found</h1>
        <p className="text-sm text-gray-500">This booking link may have been removed or is invalid.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead title="Book an Appointment" description="Secure your slot with an optional deposit." noindex />
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <h1 className="text-sm font-black text-black uppercase tracking-wide text-center">
          {businessName}
        </h1>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Booking Form */}
        {bookingStep === 'form' && (
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <h2 className="text-lg font-black text-black uppercase tracking-tight mb-4">
              Book a Table
            </h2>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Phone *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Number of Pax *
              </label>
              <select
                value={pax}
                onChange={(e) => setPax(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black bg-white"
                required
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={today}
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Time *
              </label>
              {config.time_slots && config.time_slots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {config.time_slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={`border px-3 py-2 text-xs font-bold transition-colors ${
                        time === slot
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
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black"
                  required
                />
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Special Requests
              </label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black resize-none"
                rows={2}
                placeholder="Any special requirements?"
              />
            </div>

            {error && <p className="text-xs text-red-600 font-bold">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black text-white font-black text-sm uppercase tracking-wider py-4 hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Confirm Booking →'}
            </button>
          </form>
        )}

        {/* Deposit Screen */}
        {bookingStep === 'deposit' && (
          <div className="text-center space-y-6">
            <h2 className="text-lg font-black text-black uppercase tracking-tight">
              Pay your deposit to confirm
            </h2>

            <div className="text-3xl font-black text-black">
              RM{config.deposit_amount.toFixed(2)}
            </div>

            {config.tng_qr_url && (
              <div className="border border-gray-200 p-4 inline-block">
                <img
                  src={config.tng_qr_url}
                  alt="Touch 'n Go QR"
                  className="w-64 h-64 object-contain"
                />
              </div>
            )}

            <p className="text-sm text-gray-600">
              Open your Touch 'n Go eWallet app, scan this QR, and pay RM{config.deposit_amount.toFixed(2)} to confirm your booking.
            </p>

            {config.notes && (
              <div className="bg-gray-50 border border-gray-200 p-3">
                <p className="text-xs text-gray-600">{config.notes}</p>
              </div>
            )}

            <button
              onClick={handleDepositConfirm}
              className="w-full bg-black text-white font-black text-sm uppercase tracking-wider py-4 hover:bg-gray-900 transition-colors"
            >
              I've Paid — Confirm My Booking →
            </button>
          </div>
        )}

        {/* Confirmation */}
        {bookingStep === 'confirmed' && (
          <div className="text-center space-y-6 py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-xl font-black text-black uppercase tracking-tight">
              Booking Confirmed!
            </h2>

            <div className="text-left border border-gray-200 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Name</span>
                <span className="font-bold">{name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Pax</span>
                <span className="font-bold">{pax}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date</span>
                <span className="font-bold">{date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Time</span>
                <span className="font-bold">{time}</span>
              </div>
              {config.deposit_amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Deposit</span>
                  <span className="font-bold">RM{config.deposit_amount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-500">
              The restaurant has been notified. See you there!
            </p>
          </div>
        )}

        {/* Footer branding */}
        <div className="text-center py-8">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">
            Powered by QBot
          </p>
        </div>
      </div>
    </div>
  );
}
