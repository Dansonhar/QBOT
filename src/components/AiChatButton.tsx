import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, ArrowRight, Loader2 } from 'lucide-react';

interface AiChatButtonProps {
  position?: 'bottom-right' | 'bottom-left';
}

type Role = 'ai' | 'user';
interface Message {
  id: number;
  role: Role;
  text: string;
  cta?: { label: string; href: string };
}

const GREETING =
  "Hi, I'm QBot AI. I can answer questions about our POS, kiosks, pricing, and setup — instantly, in plain English. What would you like to know?";

interface Answer {
  text: string;
  cta?: Message['cta'];
}

const ANSWERS: Record<string, Answer> = {
  whatis: {
    text:
      "QBot is an all-in-one POS platform built in Malaysia. One subscription gives you counter POS, mobile POS, self-service kiosk, QR ordering, webstore, loyalty, and AI insights — across F&B, retail, and service businesses. Hardware, software, installation, and training come bundled from one partner.",
    cta: { label: 'Explore products', href: '/products' },
  },
  pricing: {
    text:
      "Our pricing is tailored to your setup — counter only, kiosk + counter, multi-outlet, etc. Bundles include hardware, software, installation, and training, with flexible payment plans. The fastest way to get an accurate quote is a 2-minute WhatsApp chat with our team.",
    cta: {
      label: 'Get a quote on WhatsApp',
      href:
        'https://wa.me/60126909189?text=' +
        encodeURIComponent("Hi QBot, I'd like a tailored pricing quote."),
    },
  },
  kiosk: {
    text:
      "Yes — self-service kiosks are a core part of QBot. We offer the K2 Kiosk (21\" or 27\") and the V3 MIX 3-in-1 (counter + mobile + kiosk in one device). Both are preconfigured with your menu before they ship and integrate with kitchen displays, payment terminals, and your loyalty program.",
    cta: { label: 'See kiosk details', href: '/products/kiosk' },
  },
  accounting: {
    text:
      "Yes. QBot exports daily, weekly, and monthly sales summaries in formats your accountant can import directly (CSV/Excel), and we have direct integrations with common Malaysian accounting tools. We can also push end-of-day takings to your Telegram or email automatically — handy for owners who want numbers without logging in.",
    cta: { label: 'Talk to our team', href: 'https://wa.me/60126909189' },
  },
};

function matchKey(raw: string): string | null {
  const q = raw.toLowerCase();

  if (
    /\b(integrate|integration|connect|sync|export|accountant|accounting|acc|sql|autocount|xero|quickbook|qne)\b/.test(
      q,
    )
  ) {
    return 'accounting';
  }
  if (
    /\b(kiosk|self[\s-]?service|self[\s-]?serve|self[\s-]?order|self[\s-]?check|self[\s-]?out|unattended)\b/.test(
      q,
    ) ||
    /\bself\b/.test(q)
  ) {
    return 'kiosk';
  }
  if (
    /\b(price|pricing|cost|how much|berapa|quote|harga|rm|monthly|subscription|plan|package)\b/.test(
      q,
    )
  ) {
    return 'pricing';
  }
  if (
    /\b(what|whats|what's|wat|wut|tell|about|explain|info)\b.*\b(qbot|q-bot|q bot|you|this|product|platform|service)\b/.test(
      q,
    ) ||
    /^\s*(what|whats|what's|wat|wut|tell me)\s/.test(q) ||
    /\bqbot\b/.test(q)
  ) {
    return 'whatis';
  }

  return null;
}

const GENERIC_STAGES = [
  'Understanding your question…',
  'Searching QBot knowledge base…',
  'Cross-checking with our team docs…',
  'Compiling the answer…',
];

const TOPIC_STAGES: Record<string, string[]> = {
  whatis: [
    'Loading platform overview…',
    'Reviewing 14+ modules and channels…',
    'Summarising key capabilities…',
  ],
  pricing: [
    'Pulling latest bundle pricing…',
    'Checking installment & promo plans…',
    'Matching to typical setups…',
  ],
  kiosk: [
    'Scouting available kiosk models…',
    'Comparing K2 21" vs 27" specs…',
    'Verifying integration options…',
  ],
  accounting: [
    'Reviewing supported integrations…',
    'Checking export formats (CSV/Excel)…',
    'Confirming Telegram/email push…',
  ],
};

function pickStages(key: string | null): string[] {
  const generic = GENERIC_STAGES[Math.floor(Math.random() * 2)];
  const topic = key ? TOPIC_STAGES[key] : null;
  if (topic) {
    const t1 = topic[Math.floor(Math.random() * topic.length)];
    const t2 = topic[Math.floor(Math.random() * topic.length)];
    const stages = [generic, t1];
    if (t2 !== t1 && Math.random() > 0.4) stages.push(t2);
    stages.push('Compiling the answer…');
    return stages;
  }
  return [
    generic,
    GENERIC_STAGES[2],
    'Compiling the answer…',
  ];
}

const FALLBACK = (q: string): Answer => ({
  text: `Great question. I can give you a quick answer here, but for "${q.slice(
    0,
    80,
  )}${q.length > 80 ? '…' : ''}" the most accurate response is from our team — they can match a setup to your exact business in under 2 minutes on WhatsApp.`,
  cta: {
    label: 'Continue on WhatsApp',
    href:
      'https://wa.me/60126909189?text=' +
      encodeURIComponent(`Hi QBot, I asked your AI: "${q}". Can you help?`),
  },
});

export default function AiChatButton({ position = 'bottom-right' }: AiChatButtonProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'ai', text: GREETING },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [stage, setStage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(2);
  const timersRef = useRef<number[]>([]);

  const positionClasses =
    position === 'bottom-right' ? 'right-4 md:right-6' : 'left-4 md:left-6';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing, stage]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput('');
    setMessages((m) => [...m, { id: idRef.current++, role: 'user', text: trimmed }]);

    const key = matchKey(trimmed);
    const stages = pickStages(key);

    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];

    let elapsed = 0;
    stages.forEach((s, i) => {
      const wait = 600 + Math.random() * 900;
      const showAt = elapsed;
      elapsed += wait;
      const t = window.setTimeout(() => {
        setStage(s);
        if (i === 0) setTyping(false);
      }, showAt);
      timersRef.current.push(t);
    });

    const dotsStart = elapsed;
    const dotsDuration = 500 + Math.random() * 400;
    const tDots = window.setTimeout(() => {
      setStage(null);
      setTyping(true);
    }, dotsStart);
    timersRef.current.push(tDots);

    const tAnswer = window.setTimeout(() => {
      const answer = key ? ANSWERS[key] : FALLBACK(trimmed);
      setMessages((m) => [
        ...m,
        { id: idRef.current++, role: 'ai', text: answer.text, cta: answer.cta },
      ]);
      setTyping(false);
      setStage(null);
    }, dotsStart + dotsDuration);
    timersRef.current.push(tAnswer);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`fixed bottom-20 lg:bottom-6 ${positionClasses}`}
      style={{ zIndex: 9999 }}
    >
      {open && (
        <div
          className="absolute bottom-20 right-0 mb-2 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
          style={{ height: 'min(560px, calc(100vh - 8rem))', zIndex: 10000 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4 py-3.5 text-white flex-shrink-0 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'radial-gradient(rgba(34,197,94,0.4) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <span className="font-black text-sm tracking-tight">
                    QBot AI
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] text-white/60">
                      Online · instant replies
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="hover:bg-white/10 rounded-full p-1.5 transition-colors"
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`mb-3 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] ${
                    m.role === 'user'
                      ? 'bg-black text-white rounded-2xl rounded-br-md'
                      : 'bg-white text-gray-800 rounded-2xl rounded-bl-md border border-gray-200'
                  } px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  {m.cta && (
                    <a
                      href={m.cta.href}
                      target={m.cta.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-[11px] font-bold uppercase tracking-wide rounded-md transition-colors"
                    >
                      {m.cta.label} <ArrowRight size={12} strokeWidth={2.5} />
                    </a>
                  )}
                </div>
              </div>
            ))}

            {stage && (
              <div className="flex justify-start mb-3">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-3.5 py-2.5 shadow-sm flex items-center gap-2 max-w-[85%]">
                  <Loader2 size={13} strokeWidth={2.5} className="text-green-600 animate-spin flex-shrink-0" />
                  <span className="text-[12px] text-gray-500 italic leading-snug">
                    {stage}
                  </span>
                </div>
              </div>
            )}

            {typing && (
              <div className="flex justify-start mb-3">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 bg-white px-3 py-2.5 flex items-center gap-2 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask anything about QBot…"
              className="flex-1 px-3 py-2 text-[13px] bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:bg-white transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-9 h-9 flex items-center justify-center bg-green-600 hover:bg-green-500 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex-shrink-0"
              aria-label="Send"
            >
              <Send size={15} strokeWidth={2.5} />
            </button>
          </div>

          <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-100 text-center flex-shrink-0">
            <p className="text-[9px] text-gray-400">
              Powered by QBot AI · Replies in seconds
            </p>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="group relative bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white rounded-full p-4 shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Open AI chat"
      >
        {open ? (
          <X size={26} strokeWidth={2.5} />
        ) : (
          <>
            <Sparkles size={26} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
            <span className="absolute inset-0 rounded-full bg-green-500 opacity-30 animate-ping" />
          </>
        )}
      </button>

      {!open && (
        <div className="absolute -top-1 -right-1 bg-gradient-to-br from-amber-400 to-amber-500 text-black text-[9px] font-black uppercase tracking-wider rounded-full px-2 py-0.5 shadow-lg">
          AI
        </div>
      )}
    </div>
  );
}
