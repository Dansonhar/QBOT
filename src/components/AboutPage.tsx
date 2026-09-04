import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import CTASection from './CTASection';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

const pillars = [
  {
    id: 'brain',
    title: 'The Brain',
    description: "The engine behind it all — your smart dashboard in the cloud. This is where you update menus, track sales, control modules, and let AI show you what's working. It's like having a manager that never sleeps.",
    image: '/about-thebrain.webp',
  },
  {
    id: 'hardware',
    title: 'The Hardware',
    description: "Not just pretty — it's made to survive your busiest days. Designed to run nonstop in real-world spaces, whether it's behind a cafe counter, at a clinic front desk, or by your salon entrance. It's compact, durable, and always on.",
    image: '/about-thehardware.webp',
  },
  {
    id: 'modules',
    title: 'The Modules',
    description: 'Think of these as building blocks. You only activate the features your business actually needs — like loyalty rewards, queue display, appointment booking, or kitchen screens. No extra clutter, no forced bundles.',
    image: '/about-themodule.webp',
  },
  {
    id: 'support',
    title: 'The Support',
    description: "When you need help, we're here — no bots, no scripts. Just real people who want your setup to succeed.",
    image: '/about-thesupport.webp',
  },
  {
    id: 'future',
    title: 'The Future',
    description: "We're always upgrading so you don't have to. New features come to you, not the other way around.",
    image: '/about-thefuture.webp',
  },
];

const faqs = [
  {
    id: 'pos',
    question: 'Can I use QBot with my current POS?',
    answer: "Yes — if your POS provides API integration, it connects smoothly. If not, QBot's self-service kiosk works independently with its own cloud dashboard, just like your webstore sales. Think of it this way: POS = one report, QBot = kiosk + web sales report. Simple.",
  },
  {
    id: 'maintenance',
    question: 'What about maintenance?',
    answer: 'QBot is designed for minimal maintenance and is fully supported by our tech team.',
  },
  {
    id: 'customizable',
    question: 'Is QBot customizable?',
    answer: "Yes — we offer a wide range of customizations. Tell us your needs, and we'll tailor it for you.",
  },
  {
    id: 'fees',
    question: 'How are the fees structured?',
    answer: 'We have a one-time hardware fee and ongoing software fees. No hidden costs, just clear, straightforward pricing.',
  },
  {
    id: 'industries',
    question: 'What industries is QBot suitable for?',
    answer: 'QBot works across F&B, beauty salons, clinics, entertainment venues, and more — anywhere you want to automate and grow.',
  },
  {
    id: 'upgrade',
    question: 'Can I upgrade features later?',
    answer: "Yes — QBot's modular system lets you add features and modules anytime as your business grows.",
  },
  {
    id: 'cash',
    question: 'Can QBot handle cash payments?',
    answer: 'QBot is designed primarily for cashless payments (card, e-wallets), but we can discuss cash integration options if needed.',
  },
  {
    id: 'setup',
    question: 'How long does it take to set up QBot?',
    answer: 'Most setups can be done within a few days once hardware arrives — fast and hassle-free.',
  },
];

export default function AboutPage({ onNavigate }: AboutPageProps) {
  const [activePillar, setActivePillar] = useState(0);
  const [openFaqId, setOpenFaqId] = useState('pos');

  const handlePrevious = () => {
    setActivePillar((prev) => (prev === 0 ? pillars.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActivePillar((prev) => (prev === pillars.length - 1 ? 0 : prev + 1));
  };

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? '' : id);
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[60vh] md:h-[70vh] bg-black overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/about-qbot-all.webp"
            alt="QBot Products"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20"></div>
        </div>
      </section>

      <section className="relative -mt-32 py-24 bg-gradient-to-br from-gray-50 to-white border-b border-gray-300 z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-black text-black mb-8 uppercase leading-tight">
              Designed for What's Next.
              <br />
              Built Just for You
            </h1>
            <div className="space-y-6 text-lg md:text-xl font-bold text-black leading-relaxed">
              <p>
                Running a business today means dealing with rising costs, unreliable staff, long
                queues, and disconnected systems. Whether it's a café, clinic, gym, or venue,
                you're often stuck between overpriced tech or messy manual workarounds.
              </p>
              <p>
                We built this not as another platform — but as your invisible support, so you can
                finally put your full focus where it belongs: on your craft, your customers, and
                your own greatness. Let us handle the backend. You go focus and build your
                masterpiece.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-black text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-center gap-8 mb-24">
            <h2 className="text-5xl md:text-6xl font-semibold tracking-tight">
              The 5 Core Pillars
            </h2>
            <div className="flex gap-4">
              <button
                onClick={handlePrevious}
                className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-all duration-300 backdrop-blur-sm"
                aria-label="Previous pillar"
              >
                <ChevronLeft size={18} strokeWidth={1.5} />
              </button>
              <button
                onClick={handleNext}
                className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-all duration-300 backdrop-blur-sm"
                aria-label="Next pillar"
              >
                <ChevronRight size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="flex gap-12 transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${activePillar * 52}%)` }}
            >
              {pillars.map((pillar, index) => (
                <div
                  key={pillar.id}
                  className="flex-shrink-0 w-full md:w-[48%] flex gap-12 items-center"
                >
                  <div className={`flex-1 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-700 ${
                    index === activePillar ? 'bg-white scale-100' : 'bg-zinc-800 scale-95 opacity-50'
                  }`}>
                    <div className="aspect-square">
                      <img
                        src={pillar.image}
                        alt={pillar.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className={`flex-1 flex flex-col justify-center space-y-5 transition-all duration-700 ${
                    index === activePillar ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                  }`}>
                    <p className="text-xs text-zinc-500 uppercase tracking-[0.2em] font-medium">
                      {pillar.title}
                    </p>
                    <p className="text-lg md:text-xl font-normal leading-relaxed tracking-normal text-white/90">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-12 mt-24">
            {pillars.map((pillar, index) => (
              <button
                key={pillar.id}
                onClick={() => setActivePillar(index)}
                className={`text-center transition-all duration-400 ${
                  index === activePillar
                    ? 'opacity-100'
                    : 'opacity-30 hover:opacity-60'
                }`}
              >
                <div className="text-[11px] font-normal tracking-wide text-zinc-400">The</div>
                <div className="text-sm font-medium tracking-tight mt-1">{pillar.title.replace('The ', '')}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-center mb-16">
            Frequently Asked Questions
          </h2>
          <div className="space-y-2">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-medium text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`flex-shrink-0 text-gray-500 transition-transform duration-300 ${
                      openFaqId === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaqId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Your Invisible Support System"
        subtitle="We handle the backend so you can focus on building your masterpiece"
        onNavigate={onNavigate}
        currentPage="about"
      />
    </div>
  );
}
