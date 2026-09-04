import { useEffect, useState, useCallback } from 'react';

interface Props {
  tool: 'qr-generator' | 'review-qr' | 'menu-qr' | 'wa-booking' | 'wa-order';
}

export default function ToolExplainer({ tool }: Props) {
  switch (tool) {
    case 'qr-generator': return <QrGeneratorAnim />;
    case 'review-qr': return <ReviewQrAnim />;
    case 'menu-qr': return <MenuQrAnim />;
    case 'wa-booking': return <WaBookingAnim />;
    case 'wa-order': return <WaOrderAnim />;
  }
}

// ─── Wrapper ─────────────────────────────────────────────
function AnimShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky top-32">
      <div className="bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center min-h-[520px] p-6">
        {children}
      </div>
    </div>
  );
}

// ─── Phone frame ─────────────────────────────────────────
function Phone({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`w-[220px] bg-white rounded-[28px] border-[3px] border-gray-800 shadow-xl overflow-hidden ${className}`}>
      <div className="h-6 bg-gray-800 flex items-center justify-center">
        <div className="w-14 h-2.5 bg-gray-700 rounded-full" />
      </div>
      <div className="min-h-[380px]">{children}</div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. QR GENERATOR — URL types in, QR materializes, phone scans
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function QrGeneratorAnim() {
  const [phase, setPhase] = useState(0);
  // 0=typing, 1=generating, 2=qr-ready, 3=scanning, 4=website-popup, 5=reactions
  const TIMINGS = [2200, 1200, 1800, 1200, 1800, 3000];

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPhase(prev => (prev + 1) % TIMINGS.length);
    }, TIMINGS[phase]);
    return () => clearTimeout(timeout);
  }, [phase]);

  const url = 'bigburger.co';
  const REACTIONS = ['😍', '👍', '🔥', '🎉'];

  return (
    <AnimShell>
      <div className="relative flex flex-col items-center gap-5">
        {/* URL input mockup */}
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 w-64 shadow-sm">
          <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-1">Your URL</p>
          <TypingText text={url} active={phase === 0} />
        </div>

        {/* QR code area */}
        <div className={`relative transition-all duration-700 ${phase >= 2 ? 'scale-100 opacity-100' : phase === 1 ? 'scale-75 opacity-50' : 'scale-50 opacity-0'}`}>
          <div className="w-32 h-32 bg-white border-2 border-gray-800 p-2 shadow-lg">
            <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-[2px]">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className={`transition-all ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    backgroundColor: [0,1,2,3,5,6,7,8,9,14,15,16,21,23,24,25,27,28,30,32,33,35,37,39,40,42,44,46,48,49,50,55,56,57,58,61,62,63].includes(i) ? '#1a1a1a' : '#fff',
                    transitionDelay: `${i * 15}ms`,
                  }}
                />
              ))}
            </div>
          </div>
          {phase === 1 && <div className="absolute inset-0 flex items-center justify-center text-2xl animate-spin">⚡</div>}
          {phase >= 2 && phase < 4 && <div className="absolute -top-2 -right-2 text-xl animate-bounce">✨</div>}
        </div>

        {/* Scanning indicator */}
        <div className={`transition-all duration-500 ${phase === 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="flex items-center gap-2">
            <span className="text-lg animate-pulse">📱</span>
            <span className="text-xs text-gray-500">*scans QR*</span>
          </div>
        </div>

        {/* Website popup */}
        <div className={`transition-all duration-500 ${phase >= 4 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-90'}`}>
          <div className="bg-white border border-gray-200 rounded-xl shadow-xl w-56 overflow-hidden">
            {/* Browser bar */}
            <div className="bg-gray-100 px-3 py-1.5 flex items-center gap-1.5">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white rounded px-2 py-0.5 text-[8px] text-gray-400 truncate ml-1">bigburger.co</div>
            </div>
            {/* Page content */}
            <div className="p-3 text-center">
              <span className="text-3xl">🍔</span>
              <p className="text-xs font-black uppercase tracking-tight mt-1">Big Burger</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Welcome to our page!</p>
              <div className="mt-2 bg-black text-white text-[9px] font-bold uppercase py-1.5 px-3 rounded">Order Now</div>
            </div>
          </div>
        </div>

        {/* Floating happy reactions */}
        {phase === 5 && REACTIONS.map((emoji, i) => (
          <span
            key={i}
            className="absolute text-2xl animate-float-up"
            style={{
              right: i % 2 === 0 ? '-10px' : 'auto',
              left: i % 2 === 1 ? '-10px' : 'auto',
              top: `${30 + i * 18}%`,
              animationDelay: `${i * 250}ms`,
              animationDuration: '1.8s',
            }}
          >
            {emoji}
          </span>
        ))}

        <button onClick={() => setPhase(0)} className="text-[10px] text-gray-300 uppercase tracking-widest hover:text-gray-500 transition-colors">
          ↻ Replay
        </button>
      </div>
    </AnimShell>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. REVIEW QR — Stars pop in, review count climbs
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ReviewQrAnim() {
  const [stars, setStars] = useState(0);
  const [reviews, setReviews] = useState(12);
  const [showQr, setShowQr] = useState(false);
  const [phase, setPhase] = useState(0);

  const reset = useCallback(() => {
    setStars(0);
    setReviews(12);

    setShowQr(false);
    setPhase(0);
  }, []);

  useEffect(() => {
    if (phase === 0) {
      // Show QR first
      const t = setTimeout(() => { setShowQr(true); setPhase(1); }, 800);
      return () => clearTimeout(t);
    }
    if (phase === 1) {
      // Stars pop in one by one
      if (stars < 5) {
        const t = setTimeout(() => setStars(s => s + 1), 400);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase(2), 600);
        return () => clearTimeout(t);
      }
    }
    if (phase === 2) {
      // Reviews count up fast from 12 to 1828
      if (reviews < 1828) {
        const remaining = 1828 - reviews;
        const step = remaining > 500 ? 67 : remaining > 100 ? 23 : remaining > 20 ? 7 : 1;
        const delay = remaining > 100 ? 30 : 60;
        const t = setTimeout(() => setReviews(r => Math.min(r + step, 1828)), delay);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase(3), 2000);
        return () => clearTimeout(t);
      }
    }
    if (phase === 3) {
      const t = setTimeout(reset, 1500);
      return () => clearTimeout(t);
    }
  }, [phase, stars, reviews, reset]);

  const REACTIONS = ['🤩', '😍', '👏', '🔥', '💯'];

  return (
    <AnimShell>
      <div className="flex flex-col items-center gap-5">
        {/* QR appears */}
        <div className={`transition-all duration-500 ${showQr ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          <div className="bg-white rounded-xl px-5 py-4 shadow-lg border border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Scan to Review</p>
            <div className="w-20 h-20 bg-gray-800 mx-auto rounded-md mb-2" />
            <p className="text-xs font-bold">Big Burger Cafe</p>
          </div>
        </div>

        {/* Stars */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <span
              key={i}
              className={`text-3xl transition-all duration-300 ${i <= stars ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Review counter */}
        <div className="bg-white rounded-lg px-6 py-3 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-black tabular-nums">{reviews}</p>
          <p className="text-xs text-gray-500">Google Reviews</p>
        </div>

        {/* Floating reactions */}
        <div className="h-8 relative w-48">
          {phase >= 2 && REACTIONS.map((emoji, i) => (
            <span
              key={i}
              className="absolute text-lg animate-float-up"
              style={{
                left: `${15 + i * 18}%`,
                animationDelay: `${i * 300}ms`,
                animationDuration: '1.5s',
              }}
            >
              {emoji}
            </span>
          ))}
        </div>

        <button onClick={reset} className="text-[10px] text-gray-300 uppercase tracking-widest hover:text-gray-500 transition-colors">
          ↻ Replay
        </button>
      </div>
    </AnimShell>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. MENU QR — Phone shows menu scrolling with food items
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function MenuQrAnim() {
  const [scanned, setScanned] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);

  const ITEMS = [
    { emoji: '🍔', name: 'Classic Burger', price: '9.90' },
    { emoji: '🍟', name: 'Loaded Fries', price: '5.50' },
    { emoji: '🥤', name: 'Vanilla Shake', price: '6.50' },
    { emoji: '🌭', name: 'Hotdog Deluxe', price: '7.00' },
    { emoji: '🧁', name: 'Brownie Sundae', price: '8.50' },
    { emoji: '🥗', name: 'Caesar Salad', price: '7.90' },
  ];

  useEffect(() => {
    if (!scanned) {
      const t = setTimeout(() => setScanned(true), 1500);
      return () => clearTimeout(t);
    }
    const interval = setInterval(() => {
      setScrollPos(prev => {
        if (prev >= ITEMS.length) {
          setTimeout(() => { setScanned(false); setScrollPos(0); }, 2000);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
    return () => clearInterval(interval);
  }, [scanned]);

  return (
    <AnimShell>
      <div className="flex flex-col items-center gap-4">
        {/* QR scan indicator */}
        <div className={`flex items-center gap-2 transition-all duration-500 ${!scanned ? 'opacity-100' : 'opacity-0 -translate-y-4'}`}>
          <span className="text-2xl animate-pulse">📱</span>
          <span className="text-sm text-gray-500">*scans QR*</span>
        </div>

        {/* Phone with menu */}
        <Phone className={`transition-all duration-700 ${scanned ? 'scale-100 opacity-100' : 'scale-90 opacity-40'}`}>
          <div className="p-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🍔</span>
              <p className="text-xs font-black uppercase tracking-tight">Big Burger Cafe</p>
            </div>
            <div className="space-y-2">
              {ITEMS.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-400 ${
                    i < scrollPos ? 'bg-white shadow-sm opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <span className="text-xl">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold">{item.name}</p>
                    <p className="text-[10px] text-gray-500">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Phone>

        <button onClick={() => { setScanned(false); setScrollPos(0); }} className="text-[10px] text-gray-300 uppercase tracking-widest hover:text-gray-500 transition-colors">
          ↻ Replay
        </button>
      </div>
    </AnimShell>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. WA BOOKING — Form fills itself, WhatsApp bubble pops
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function WaBookingAnim() {
  const [step, setStep] = useState(0);

  const FIELDS = [
    { label: '👤 Name', value: 'Sarah' },
    { label: '📅 Date', value: '28 Mar' },
    { label: '🕐 Time', value: '7:30 PM' },
    { label: '👥 Pax', value: '4' },
  ];

  useEffect(() => {
    const maxSteps = FIELDS.length + 2; // fields + send + delivered
    if (step >= maxSteps) {
      const t = setTimeout(() => setStep(0), 3000);
      return () => clearTimeout(t);
    }
    const delay = step < FIELDS.length ? 700 : step === FIELDS.length ? 1000 : 1500;
    const t = setTimeout(() => setStep(s => s + 1), delay);
    return () => clearTimeout(t);
  }, [step]);

  const sending = step === FIELDS.length;
  const delivered = step > FIELDS.length;

  return (
    <AnimShell>
      <div className="flex flex-col items-center gap-5">
        {/* Booking form on phone */}
        <Phone>
          <div className="p-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">📋 Big Burger Cafe</p>

            <div className="space-y-2.5">
              {FIELDS.map((field, i) => (
                <div key={i} className={`transition-all duration-300 ${i < step ? 'opacity-100' : 'opacity-30'}`}>
                  <p className="text-[9px] text-gray-400 mb-0.5">{field.label}</p>
                  <div className="bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5 flex items-center">
                    {i < step ? (
                      <span className="text-xs font-semibold">{field.value}</span>
                    ) : (
                      <span className="text-[10px] text-gray-300">...</span>
                    )}
                    {i === step - 1 && <span className="ml-auto text-xs">✅</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Send button */}
            <div className={`mt-4 transition-all duration-300 ${step >= FIELDS.length ? 'opacity-100 scale-100' : 'opacity-30 scale-95'}`}>
              <div className={`text-center py-2.5 rounded-md text-xs font-bold text-white transition-colors ${
                delivered ? 'bg-green-500' : 'bg-green-600'
              }`}>
                {delivered ? '✓ Sent!' : sending ? '⏳ Sending...' : '💬 Send via WhatsApp'}
              </div>
            </div>
          </div>
        </Phone>

        {/* WhatsApp message bubble */}
        <div className={`transition-all duration-500 ${delivered ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-6 opacity-0 scale-90'}`}>
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 max-w-[240px] shadow-sm">
            <p className="text-[10px] text-green-800 font-bold mb-1">💬 New WhatsApp Message</p>
            <p className="text-[10px] text-green-700 leading-relaxed">
              *New Booking*{'\n'}
              👤 Sarah{'\n'}
              📅 28 Mar, 🕐 7:30 PM{'\n'}
              👥 4 pax
            </p>
            <p className="text-[9px] text-green-500 mt-1">Just now ✓✓</p>
          </div>
        </div>

        <button onClick={() => setStep(0)} className="text-[10px] text-gray-300 uppercase tracking-widest hover:text-gray-500 transition-colors">
          ↻ Replay
        </button>
      </div>
    </AnimShell>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. WA ORDER — Food items fly into cart, order sent
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function WaOrderAnim() {
  const [cart, setCart] = useState<number[]>([]);
  const [phase, setPhase] = useState<'browsing' | 'adding' | 'checkout' | 'sent'>('browsing');
  const [addingIdx, setAddingIdx] = useState(-1);

  const ITEMS = [
    { emoji: '🍔', name: 'Smash Burger', price: 9.9 },
    { emoji: '🍟', name: 'Cheese Fries', price: 5.5 },
    { emoji: '🥤', name: 'Choco Shake', price: 6.5 },
  ];

  const total = cart.reduce((sum, idx) => sum + ITEMS[idx].price, 0);

  const reset = useCallback(() => {
    setCart([]);
    setPhase('browsing');
    setAddingIdx(-1);
  }, []);

  useEffect(() => {
    if (phase === 'browsing') {
      const t = setTimeout(() => setPhase('adding'), 1200);
      return () => clearTimeout(t);
    }

    if (phase === 'adding') {
      const sequence = [0, 1, 0, 2]; // Add items in this order
      const currentAdd = cart.length;
      if (currentAdd < sequence.length) {
        const t = setTimeout(() => {
          setAddingIdx(sequence[currentAdd]);
          setTimeout(() => {
            setCart(prev => [...prev, sequence[currentAdd]]);
            setAddingIdx(-1);
          }, 300);
        }, 600);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase('checkout'), 800);
        return () => clearTimeout(t);
      }
    }

    if (phase === 'checkout') {
      const t = setTimeout(() => setPhase('sent'), 2000);
      return () => clearTimeout(t);
    }

    if (phase === 'sent') {
      const t = setTimeout(reset, 3000);
      return () => clearTimeout(t);
    }
  }, [phase, cart.length, reset]);

  return (
    <AnimShell>
      <div className="flex flex-col items-center gap-4">
        <Phone>
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-black uppercase tracking-tight">🍔 Big Burger Cafe</p>
              <div className="relative">
                <span className="text-lg">🛒</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                    {cart.length}
                  </span>
                )}
              </div>
            </div>

            {/* Menu items */}
            <div className="space-y-2">
              {ITEMS.map((item, i) => {
                const isAdding = addingIdx === i;
                const itemCount = cart.filter(idx => idx === i).length;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 ${
                      isAdding ? 'border-green-400 bg-green-50 scale-[1.03]' : 'border-gray-100 bg-white'
                    }`}
                  >
                    <span className={`text-2xl transition-transform duration-200 ${isAdding ? 'scale-125' : ''}`}>{item.emoji}</span>
                    <div className="flex-1">
                      <p className="text-[11px] font-bold">{item.name}</p>
                      <p className="text-[10px] text-gray-500">${item.price.toFixed(2)}</p>
                    </div>
                    {itemCount > 0 && (
                      <span className="text-[10px] font-bold bg-black text-white px-1.5 py-0.5 rounded">
                        ×{itemCount}
                      </span>
                    )}
                    {isAdding && <span className="text-sm animate-ping-once">➕</span>}
                  </div>
                );
              })}
            </div>

            {/* Cart total */}
            {cart.length > 0 && (
              <div className={`mt-3 p-2.5 rounded-md text-center transition-all duration-300 ${
                phase === 'sent' ? 'bg-green-500 text-white' : phase === 'checkout' ? 'bg-green-600 text-white' : 'bg-black text-white'
              }`}>
                {phase === 'sent' ? (
                  <p className="text-xs font-bold">✅ Order sent via WhatsApp!</p>
                ) : phase === 'checkout' ? (
                  <p className="text-xs font-bold">💬 Sending to WhatsApp...</p>
                ) : (
                  <p className="text-xs font-bold">🛒 ${total.toFixed(2)} — View Cart</p>
                )}
              </div>
            )}
          </div>
        </Phone>

        {/* WhatsApp message */}
        <div className={`transition-all duration-500 ${phase === 'sent' ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-6 opacity-0 scale-90'}`}>
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 max-w-[240px] shadow-sm">
            <p className="text-[10px] text-green-800 font-bold mb-1">💬 New Order!</p>
            <p className="text-[10px] text-green-700 leading-relaxed whitespace-pre-line">
              2× 🍔 Smash Burger — $19.80{'\n'}1× 🍟 Cheese Fries — $5.50{'\n'}1× 🥤 Choco Shake — $6.50{'\n'}💰 *Total: $31.80*
            </p>
            <p className="text-[9px] text-green-500 mt-1">Just now ✓✓</p>
          </div>
        </div>

        <button onClick={reset} className="text-[10px] text-gray-300 uppercase tracking-widest hover:text-gray-500 transition-colors">
          ↻ Replay
        </button>
      </div>
    </AnimShell>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Utility: Typing text effect
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function TypingText({ text, active }: { text: string; active: boolean }) {
  const [len, setLen] = useState(0);

  useEffect(() => {
    if (!active) { setLen(text.length); return; }
    setLen(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setLen(i);
      if (i >= text.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, [active, text]);

  return (
    <p className="text-sm font-mono">
      {text.slice(0, len)}
      {active && len < text.length && <span className="animate-pulse">|</span>}
    </p>
  );
}
