import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { Upload, X, Plus, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ToolPageLayout from '../../components/free-tools/ToolPageLayout';
import EmailCaptureGate, { getStoredLead } from '../../components/free-tools/EmailCaptureGate';
import QRCodeDisplay from '../../components/free-tools/QRCodeDisplay';
import CopyLinkButton from '../../components/free-tools/CopyLinkButton';
import PhonePreview from '../../components/free-tools/PhonePreview';
import SEOHead from '../../components/SEOHead';
import { Link } from 'react-router-dom';

type Step = 'configure' | 'processing' | 'preview' | 'result';

export default function BookingQrPage() {
  const [step, setStep] = useState<Step>('configure');
  const [businessName, setBusinessName] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [tngFile, setTngFile] = useState<File | null>(null);
  const [tngPreview, setTngPreview] = useState('');
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [newSlot, setNewSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [shortId, setShortId] = useState('');
  const [gateCleared, setGateCleared] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    if (getStoredLead()) setGateCleared(true);
  }, []);

  const handleTngUpload = (files: FileList | null) => {
    if (!files || !files[0]) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }
    setTngFile(file);
    setTngPreview(URL.createObjectURL(file));
  };

  const addTimeSlot = () => {
    if (!newSlot.trim()) return;
    if (!timeSlots.includes(newSlot.trim())) {
      setTimeSlots([...timeSlots, newSlot.trim()]);
    }
    setNewSlot('');
  };

  const removeSlot = (idx: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== idx));
  };

  const handleGenerate = async () => {
    setError('');

    if (!businessName.trim()) {
      setError('Please enter your business name.');
      return;
    }

    const deposit = parseFloat(depositAmount) || 0;

    if (deposit > 0 && !tngFile) {
      setError('Please upload your Touch \'n Go QR to collect deposits.');
      return;
    }

    setStep('processing');

    try {
      const id = nanoid(8);
      let tngUrl = '';

      if (tngFile) {
        const ext = tngFile.name.split('.').pop() || 'png';
        const path = `tng/${id}/qr.${ext}`;
        const { error: upErr } = await supabase.storage
          .from('free-tools')
          .upload(path, tngFile, { contentType: tngFile.type });
        if (upErr) throw upErr;

        const { data: urlData } = supabase.storage.from('free-tools').getPublicUrl(path);
        tngUrl = urlData.publicUrl;
      }

      const { error: dbErr } = await supabase.from('hosted_pages').insert({
        short_id: id,
        tool_type: 'booking_qr',
        business_name: businessName.trim(),
        config: {
          deposit_amount: deposit,
          tng_qr_url: tngUrl || null,
          time_slots: timeSlots.length > 0 ? timeSlots : null,
          notes: notes.trim() || null,
        },
      });

      if (dbErr) throw dbErr;
      setShortId(id);
      setStep(gateCleared ? 'result' : 'preview');
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
      setStep('configure');
    }
  };

  const hostedUrl = shortId ? `${window.location.origin}/b/${shortId}` : '';

  const onGateCaptured = useCallback(() => {
    setGateCleared(true);
    setStep('result');
  }, []);

  const BookingPreview = () => (
    <div className="p-4">
      <h2 className="text-sm font-black text-black uppercase text-center mb-1">{businessName}</h2>
      <p className="text-[10px] text-gray-400 text-center mb-4">Book a table</p>
      <div className="space-y-2">
        {['Name', 'Phone', 'Pax', 'Date', 'Time'].map((field) => (
          <div key={field} className="border border-gray-200 px-3 py-2">
            <span className="text-[9px] text-gray-400 uppercase">{field}</span>
          </div>
        ))}
        <div className="border border-gray-200 px-3 py-2">
          <span className="text-[9px] text-gray-400 uppercase">Special requests</span>
        </div>
      </div>
      <div className="mt-3 bg-black text-white text-center py-2 text-[10px] font-bold uppercase">
        Confirm Booking →
      </div>
      <p className="text-[8px] text-gray-400 text-center mt-4">Powered by QBot</p>
    </div>
  );

  return (
    <>
    <SEOHead
      title="Free Booking QR Malaysia — Appointment + Deposit Collection | QPOS"
      description="Create a booking QR code with optional deposit via Touch 'n Go. Customers scan, book, pay a deposit — no app, no sign-up. Salons, clinics, restaurants, tuition, studios."
      keywords="booking QR code Malaysia, appointment QR generator, deposit collection QR, Touch n Go booking, salon booking QR, clinic appointment QR, restaurant reservation QR, tuition booking QR, QPOS free tool"
      url="https://qbot.now/tools/booking-qr"
    />
    <ToolPageLayout
      title="Booking QR Generator"
      headline="Let customers book and pay a deposit — from one QR."
      subtitle="A simple reservation form with optional deposit collection."
    >
      {/* Step 1: Configure */}
      {step === 'configure' && (
        <div className="space-y-6 max-w-lg">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Business Name
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              placeholder="Your restaurant name"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Deposit Amount (RM)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              placeholder="0 for no deposit"
            />
            <p className="text-[10px] text-gray-400 mt-1">Set to 0 if you don't want to collect deposits.</p>
          </div>

          {(parseFloat(depositAmount) || 0) > 0 && (
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Upload Touch 'n Go QR
              </label>
              {tngPreview ? (
                <div className="relative inline-block">
                  <img
                    src={tngPreview}
                    alt="TnG QR"
                    className="w-40 h-40 object-contain border border-gray-200"
                  />
                  <button
                    onClick={() => { setTngFile(null); setTngPreview(''); }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-black text-white flex items-center justify-center"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 cursor-pointer hover:border-black transition-colors">
                  <Upload size={24} className="text-gray-400 mb-2" />
                  <span className="text-xs font-bold text-gray-500">Upload your TnG QR image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleTngUpload(e.target.files)}
                  />
                </label>
              )}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              Time Slots (Optional)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="time"
                value={newSlot}
                onChange={(e) => setNewSlot(e.target.value)}
                className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
              />
              <button
                onClick={addTimeSlot}
                className="px-3 py-2 border border-gray-300 hover:border-black transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            {timeSlots.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {timeSlots.map((slot, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-xs font-bold"
                  >
                    {slot}
                    <button onClick={() => removeSlot(i)} className="hover:text-red-600">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p className="text-[10px] text-gray-400 mt-1">Leave empty to let customers pick any time.</p>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Notes to Customer (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"
              rows={3}
              placeholder="e.g. Please arrive 10 minutes early"
            />
          </div>

          {error && <p className="text-xs text-red-600 font-bold">{error}</p>}

          <button
            onClick={handleGenerate}
            className="px-8 py-4 bg-black text-white font-black text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors"
          >
            Generate Booking QR →
          </button>
        </div>
      )}

      {/* Step 2: Processing */}
      {step === 'processing' && (
        <div className="text-center py-16">
          <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
            Creating your booking page...
          </p>
        </div>
      )}

      {/* Step 3: Preview (gated) */}
      {step === 'preview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PhonePreview>
            <BookingPreview />
          </PhonePreview>

          <div className="space-y-6">
            <div className="opacity-50 pointer-events-none">
              <QRCodeDisplay value={hostedUrl} showDownload={false} />
            </div>
            <div className="opacity-50">
              <p className="text-xs text-gray-500 font-mono truncate">{hostedUrl}</p>
            </div>

            <EmailCaptureGate
              toolUsed="booking_qr"
              metadata={{ hosted_link: hostedUrl, deposit_amount: parseFloat(depositAmount) || 0 }}
              headline="Your Booking QR is ready!"
              buttonText="Get My Booking QR →"
              prefillBusinessName={businessName}
              hostedPageShortId={shortId}
              onCaptured={onGateCaptured}
            />
          </div>
        </div>
      )}

      {/* Step 4: Result */}
      {step === 'result' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PhonePreview>
            <BookingPreview />
          </PhonePreview>

          <div className="space-y-6">
            <QRCodeDisplay value={hostedUrl} downloadFileName={`booking-qr-${shortId}`} />
            <CopyLinkButton url={hostedUrl} />
            <p className="text-xs text-gray-500">
              Print this QR and place it at your entrance, on social media, or in your bio link. Customers scan, book, and pay their deposit.
            </p>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs text-gray-400">
                Want full booking management with reminders?{' '}
                <Link
                  to="/products"
                  className="inline-flex items-center gap-1 text-black font-bold hover:underline"
                >
                  See QBot Booking App <ArrowRight size={10} />
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </ToolPageLayout>
    </>
  );
}
