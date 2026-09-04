import { useState, useEffect, useRef } from 'react';
import SEOHead from '../components/SEOHead';
import { trackWhatsAppClick } from '../utils/trackWhatsApp';
import {
  Layers, Shield, Wrench, Play, ArrowRight, Check, Plus, GripVertical,
  Heart, ChefHat, ListOrdered, QrCode, Scissors, Zap, Search,
  Globe, LayoutGrid, Package, Wallet, Gift, ScanLine, DollarSign,
  ShoppingCart, CreditCard, UtensilsCrossed, ConciergeBell, Star,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   TOGGLE DEMO DATA
   ═══════════════════════════════════════════════════════════════ */
const toggleModules = [
  { id: 'table', label: 'Table Management', icon: LayoutGrid, defaultOn: true, custom: false },
  { id: 'loyalty', label: 'Loyalty Program', icon: Heart, defaultOn: false, custom: false },
  { id: 'kds', label: 'Kitchen Display', icon: ChefHat, defaultOn: false, custom: false },
  { id: 'queue', label: 'Queue Management', icon: ListOrdered, defaultOn: false, custom: false },
  { id: 'qr', label: 'QR Order', icon: QrCode, defaultOn: false, custom: false },
  { id: 'split', label: 'Split Bill', icon: Scissors, defaultOn: false, custom: false },
  { id: 'upsell', label: 'Guided Upsell', icon: Zap, defaultOn: false, custom: false },
  { id: 'member', label: 'Member Details', icon: Search, defaultOn: true, custom: false },
  { id: 'inventory', label: 'Inventory Alerts', icon: Package, defaultOn: false, custom: false },
  { id: 'ewallet', label: 'Custom eWallet', icon: Wallet, defaultOn: false, custom: true },
  { id: 'commission', label: 'Staff Commission', icon: DollarSign, defaultOn: false, custom: true },
  { id: 'birthday', label: 'Birthday Voucher', icon: Gift, defaultOn: false, custom: true },
];

/* ═══════════════════════════════════════════════════════════════
   CASE STUDIES DATA
   ═══════════════════════════════════════════════════════════════ */
const caseStudies = [
  {
    id: 'barbershop',
    tab: 'Barbershop',
    industry: 'Barbershop',
    quote: '"Hide the member list. Staff shouldn\'t see it."',
    body: [
      'A barbershop chain owner noticed staff could browse the full customer list when searching by phone number. The concern — data theft.',
      'The fix: member list hidden entirely. Search returns only the matched result. No browsing. No copying. No risk.',
    ],
    before: {
      label: 'Before — Full list exposed',
      entries: ['Ahmad R. · 012-345-6789', 'Sarah L. · 017-888-2341', 'James W. · 011-234-5678', 'Mei Ling · 016-777-9012', 'Raj K. · 019-456-3210'],
    },
    after: {
      label: 'After — Only matched result',
      entry: 'Ahmad R. · 012-3**-**89',
      sublabel: 'Matched',
    },
  },
  {
    id: 'event',
    tab: 'Event',
    industry: 'Event',
    quote: '"We need a booking system built in."',
    body: [
      'An event company needed appointment scheduling and session booking integrated directly into the POS — not a separate app staff have to switch between.',
      'We plugged QBot\'s Booking module straight into their setup. Staff manage walk-ins and bookings from one screen. No third-party app. No switching systems.',
    ],
    bookingSlots: [
      { time: '10:00 AM', name: 'VIP Meet & Greet — Hafiz', status: 'Confirmed' },
      { time: '11:30 AM', name: 'Workshop A — Priya', status: 'In Progress' },
      { time: '2:00 PM', name: 'Photo Session — Daniel', status: 'Upcoming' },
    ],
  },
  {
    id: 'themepark',
    tab: 'Themepark',
    industry: 'Themepark',
    quote: '"Sell tickets and earn points in our own wallet."',
    body: [
      'A theme park needed direct ticket purchases at the POS — plus their own branded eWallet where visitors earn and spend points throughout the park.',
      'Visitors buy tickets, earn points instantly, and spend them at any food stall or gift shop inside. One tap. All native. No third-party app.',
    ],
    payment: {
      methods: ['Cash', 'Card'],
      custom: 'Park Points',
      balance: 'RM45.00',
      deduct: 'RM12.50',
    },
  },
  {
    id: 'dessert',
    tab: 'Dessert Shop',
    industry: 'F&B',
    quote: '"Spend RM50, unlock a secret menu."',
    body: [
      'A dessert shop wanted gamified loyalty — once a customer spends RM50, a hidden menu category unlocks on their next QR order. No code. No staff prompt. It just appears.',
      'Drives repeat visits. Customers come back to "unlock" the next tier. Built directly into QBot\'s loyalty engine.',
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   FLIP CARDS DATA
   ═══════════════════════════════════════════════════════════════ */
const flipCards = [
  { front: 'Pay for 50 features. Use 10.', back: 'Toggle on what you need. The rest stays off.' },
  { front: 'Staff sees customer data you didn\'t want exposed.', back: 'Hide fields. Restrict access. Per role, per device.' },
  { front: 'Every outlet forced into the same setup.', back: 'Each outlet configured independently. Same system, different rules.' },
  { front: '"Sorry, not on our roadmap."', back: 'You tell us. We configure it.' },
];

const businessTypes = ['Restaurant', 'Retail', 'Cafe', 'Services', 'Other'];

/* ═══════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function CustomPosPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    toggleModules.forEach(m => { initial[m.id] = m.defaultOn; });
    return initial;
  });
  const [activeTab, setActiveTab] = useState('barbershop');
  const [eventView, setEventView] = useState<'before' | 'after'>('before');
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState({ businessName: '', businessType: '', needs: '', whatsapp: '' });
  const [submitted, setSubmitted] = useState(false);
  const [moduleOrder, setModuleOrder] = useState(() => toggleModules.map(m => m.id));
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [flowSteps, setFlowSteps] = useState([
    { id: 'order', label: 'Order', icon: ShoppingCart },
    { id: 'pay', label: 'Pay', icon: CreditCard },
    { id: 'kitchen', label: 'Kitchen', icon: UtensilsCrossed },
    { id: 'serve', label: 'Serve', icon: ConciergeBell },
    { id: 'points', label: 'Earn Points', icon: Star },
  ]);
  const [flowDragId, setFlowDragId] = useState<string | null>(null);
  const [flowDragOverId, setFlowDragOverId] = useState<string | null>(null);

  useEffect(() => { document.title = 'Custom POS — Your POS, Your Rules | QBot'; }, []);

  // Auto-rotate hero case studies every 5s — restarts on tab change
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab(prev => {
        const ids = caseStudies.map(c => c.id);
        const idx = ids.indexOf(prev);
        return ids[(idx + 1) % ids.length];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleFlowDrop = (targetId: string) => {
    if (!flowDragId || flowDragId === targetId) return;
    setFlowSteps(prev => {
      const next = [...prev];
      const fromIdx = next.findIndex(s => s.id === flowDragId);
      const toIdx = next.findIndex(s => s.id === targetId);
      const [item] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, item);
      return next;
    });
    setFlowDragId(null);
    setFlowDragOverId(null);
  };

  const handleDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    setModuleOrder(prev => {
      const next = [...prev];
      const fromIdx = next.indexOf(dragId);
      const toIdx = next.indexOf(targetId);
      next.splice(fromIdx, 1);
      next.splice(toIdx, 0, dragId);
      return next;
    });
    setDragId(null);
    setDragOverId(null);
  };

  const flipCard = (i: number) => {
    setFlippedCards(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to Supabase for lead capture
    console.log('Custom POS form submission:', formData);
    const message = `Hi QBot, I'm interested in a Custom POS setup.\n\nBusiness: ${formData.businessName}\nType: ${formData.businessType}\nWhat I need: ${formData.needs}\nWhatsApp: ${formData.whatsapp}`;
    trackWhatsAppClick('Custom POS > Form Submit');
    window.open(`https://wa.me/60126909189?text=${encodeURIComponent(message)}`, '_blank');
    setSubmitted(true);
  };

  const activeCount = Object.values(toggles).filter(Boolean).length;
  const activeCase = caseStudies.find(c => c.id === activeTab)!;

  return (
    <div>
      <SEOHead
        title="Custom POS System Malaysia — Built for Your Business | QBot"
        description="Stop forcing your business to fit a generic POS. QBot builds modular, per-outlet, per-role POS tailored to your workflows — powered by SUNMI hardware and the full QPOS ecosystem."
        keywords="custom POS Malaysia, bespoke POS Malaysia, modular POS, configurable POS, tailored POS system, per-outlet POS, role-based POS Malaysia, QBot custom POS, SUNMI custom POS, POS customisation Malaysia"
        url="https://qbot.now/custom-pos"
      />

      {/* ── HERO + CASE STUDIES ── */}
      <section className="relative bg-black text-white overflow-hidden" style={{ paddingTop: 'calc(88px + 20px)' }}>
        <div className="absolute inset-0">
          <img src="/pexels-photo-6205509.webp" alt="" className="w-full h-full object-cover opacity-15" />
        </div>
        <div className="relative z-10 py-12 md:py-20">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid lg:grid-cols-[1fr,1fr] gap-8 lg:gap-12 items-center">
              {/* Left — headline */}
              <div>
                <h1 className="text-[36px] md:text-[52px] lg:text-[72px] font-black leading-[0.88] tracking-tighter uppercase mb-5">
                  YOUR POS.<br />YOUR RULES.
                </h1>
                <p className="text-[15px] md:text-[17px] text-white/70 leading-[1.65] max-w-md mb-8">
                  Every business is different. Your POS should be too.
                </p>
                {/* Slide indicators */}
                <div className="flex gap-2 flex-wrap">
                  {caseStudies.map(c => (
                    <button
                      key={c.id}
                      onClick={() => { setActiveTab(c.id); setEventView('before'); }}
                      className={`py-3 px-5 transition-all duration-300 relative ${
                        activeTab === c.id
                          ? 'bg-white text-black scale-105'
                          : 'border border-white/25 text-white/70 hover:border-white/50 hover:text-white hover:scale-105'
                      }`}
                    >
                      <span className="text-[13px] font-bold block">{c.tab}</span>
                      {activeTab === c.id && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-green-500" style={{ animation: 'progress 5s linear' }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right — active case image + quote */}
              <div key={activeTab} style={{ animation: 'fadeInUp 0.2s ease-out' }}>
                <div className="aspect-[4/3] border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center mb-4">
                  <span className="text-[11px] text-white/30 font-bold uppercase tracking-wide text-center px-6">[Screenshot: {activeCase.tab}]</span>
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-white leading-[1.12] tracking-tight mb-3">
                    {activeCase.quote}
                  </h3>
                  <p className="text-[14px] text-white/60 leading-[1.7]">{activeCase.body[0]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: INTERACTIVE TOGGLE DEMO ── */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="text-2xl md:text-[36px] lg:text-[42px] font-extrabold text-black leading-[1.12] tracking-tight mb-4">
              Build It Your Way
            </h2>
            <p className="text-[15px] text-gray-600 leading-[1.7] max-w-2xl mx-auto">
              Business is tough. Costs go up, competitors multiply, and customers expect more every year. The ones who survive don't just work harder — they do things differently.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr,300px] gap-4 lg:gap-5">
            {/* POS Mockup — white, dense 2-col */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* ── Header ── */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                    <span className="text-[8px] font-black text-white">Q</span>
                  </div>
                  <span className="text-[12px] text-gray-400 font-bold uppercase tracking-wider">QBot POS</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  {toggles.queue && (
                    <span className="bg-green-50 border border-green-200 text-green-700 text-[11px] font-bold px-2 py-0.5 rounded" style={{ animation: 'fadeInScale 0.15s ease-out' }}>#037</span>
                  )}
                  {toggles.loyalty && (
                    <span className="bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1" style={{ animation: 'fadeInScale 0.15s ease-out' }}><Heart size={10} strokeWidth={2.5} />230 pts</span>
                  )}
                  {toggles.inventory && (
                    <span className="bg-red-50 border border-red-200 text-red-600 text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1" style={{ animation: 'fadeInScale 0.15s ease-out' }}><Package size={10} strokeWidth={2.5} />Low stock</span>
                  )}
                </div>
              </div>

              {/* ── Body — 2 columns ── */}
              <div className="grid grid-cols-[1fr,1fr]">
                {/* LEFT: Order */}
                <div className="p-4 border-r border-gray-100">
                  {toggles.member && (
                    <div className="bg-gray-50 border border-gray-200 rounded px-3 py-2 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-bold text-gray-700">Sarah L.</span>
                        <span className="text-[11px] text-gray-400">Last visit: 3 days ago</span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-[11px] text-gray-400">Last order: Latte + Muffin</span>
                        <span className="text-[11px] text-gray-400">RM18.50</span>
                      </div>
                    </div>
                  )}

                  {toggles.upsell && (
                    <div className="bg-green-50 border border-green-200 rounded px-3 py-2 mb-3" style={{ animation: 'fadeInScale 0.15s ease-out' }}>
                      <div className="flex items-center justify-between">
                        <span className="text-green-700 text-[13px] font-bold flex items-center gap-1"><Zap size={12} strokeWidth={2.5} className="text-green-600" />Add extra shot? +RM2</span>
                        <span className="text-[11px] font-bold text-green-700 bg-green-600/10 px-2 py-0.5 rounded cursor-pointer uppercase tracking-wider">Yes</span>
                      </div>
                    </div>
                  )}

                  {[
                    { name: 'Latte', qty: 1, price: 'RM12.00' },
                    { name: 'Croissant', qty: 1, price: 'RM8.50' },
                    { name: 'Mineral Water', qty: 1, price: 'RM3.00' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-gray-100 rounded text-[10px] font-bold text-gray-500 flex items-center justify-center">{item.qty}</span>
                        <span className="text-[13px] font-medium text-gray-700">{item.name}</span>
                      </div>
                      <span className="text-[13px] text-gray-400">{item.price}</span>
                    </div>
                  ))}

                  <div className="bg-gray-50 rounded px-3 py-2.5 mt-3">
                    <div className="flex justify-between">
                      <span className="text-[14px] font-bold text-black">Total</span>
                      <span className="text-[16px] font-extrabold text-black">RM23.50</span>
                    </div>
                  </div>

                  {toggles.birthday && (
                    <div className="bg-pink-50 border border-pink-200 rounded px-3 py-2 mt-3" style={{ animation: 'fadeInScale 0.15s ease-out' }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-pink-700 text-[13px] font-bold flex items-center gap-1"><Gift size={12} strokeWidth={2} className="text-pink-600" />Birthday Voucher</span>
                        <span className="text-[12px] font-bold text-pink-600">-RM10</span>
                      </div>
                      <div className="bg-white border border-pink-200 rounded px-2.5 py-1.5 flex items-center gap-1.5">
                        <ScanLine size={12} strokeWidth={2} className="text-pink-400" />
                        <span className="text-[12px] text-pink-400">Scan voucher code...</span>
                      </div>
                    </div>
                  )}

                  {toggles.commission && (
                    <div className="bg-amber-50 border border-amber-200 rounded px-3 py-2 mt-3 flex items-center justify-between" style={{ animation: 'fadeInScale 0.15s ease-out' }}>
                      <span className="text-amber-700 text-[13px] font-medium flex items-center gap-1"><DollarSign size={12} strokeWidth={2} className="text-amber-600" />Commission</span>
                      <span className="text-[14px] font-bold text-amber-800">RM4.70</span>
                    </div>
                  )}
                </div>

                {/* RIGHT: Status + Tables/Queue + Payment */}
                <div className="p-4 flex flex-col">
                  <div className="space-y-2 mb-3">
                    {toggles.kds && (
                      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded px-3 py-2" style={{ animation: 'fadeInScale 0.15s ease-out' }}>
                        <ChefHat size={13} strokeWidth={2} className="text-green-600" />
                        <span className="text-[13px] text-green-700 font-medium">Sent to Kitchen</span>
                        <Check size={12} strokeWidth={3} className="text-green-600 ml-auto" />
                      </div>
                    )}
                    {toggles.ewallet && (
                      <div className="bg-purple-50 border border-purple-200 rounded px-3 py-2" style={{ animation: 'fadeInScale 0.15s ease-out' }}>
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-bold text-purple-700 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-purple-200 flex items-center justify-center text-[8px] font-black text-purple-700">W</span>
                            MyBrand eWallet
                          </span>
                          <span className="text-[12px] text-purple-500">RM45.00</span>
                        </div>
                        <div className="flex justify-between text-[12px] mt-1.5 pt-1.5 border-t border-purple-200">
                          <span className="text-purple-400">Deduct RM23.50</span>
                          <span className="font-bold text-purple-700">Bal: RM21.50</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tables + Queue inline */}
                  {(toggles.table || toggles.queue) && (
                    <div className={`grid ${toggles.table && toggles.queue ? 'grid-cols-2' : 'grid-cols-1'} gap-3 mb-3`}>
                      {toggles.table && (
                        <div style={{ animation: 'fadeInScale 0.15s ease-out' }}>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1"><LayoutGrid size={10} strokeWidth={2.5} />Tables</p>
                          <div className="grid grid-cols-3 gap-1">
                            {['T1', 'T2', 'T3', 'T4', 'T5', 'T6'].map((t, i) => (
                              <div key={t} className={`text-[11px] font-bold text-center py-1.5 rounded ${i < 2 ? 'bg-green-50 text-green-600 border border-green-200' : i === 2 ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-gray-50 text-gray-300 border border-gray-100'}`}>
                                {t}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {toggles.queue && (
                        <div style={{ animation: 'fadeInScale 0.15s ease-out' }}>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1"><ListOrdered size={10} strokeWidth={2.5} />Queue</p>
                          <div className="space-y-1">
                            {['#035', '#036', '#037'].map((q, i) => (
                              <div key={q} className={`text-[11px] font-bold px-2 py-1.5 rounded ${i === 2 ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}>
                                {q}{i === 2 && ' ← Now'}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Payment grid — bottom */}
                  <div className="mt-auto">
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2">Payment</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button className="bg-black text-white text-[11px] font-bold uppercase tracking-wider py-2.5 rounded text-center">Pay</button>
                      <button className="bg-gray-100 text-gray-600 text-[11px] font-bold uppercase py-2.5 rounded text-center">Cash</button>
                      <button className="bg-gray-100 text-gray-600 text-[11px] font-bold uppercase py-2.5 rounded text-center">Card</button>
                      {toggles.split && (
                        <button className="bg-white text-gray-600 text-[11px] font-bold uppercase py-2.5 rounded border-2 border-green-300 flex items-center justify-center gap-1" style={{ animation: 'fadeInScale 0.15s ease-out' }}>
                          <Scissors size={11} strokeWidth={2} />Split
                        </button>
                      )}
                      {toggles.qr && (
                        <button className="bg-white text-gray-600 text-[11px] font-bold uppercase py-2.5 rounded border-2 border-green-300 flex items-center justify-center gap-1" style={{ animation: 'fadeInScale 0.15s ease-out' }}>
                          <QrCode size={11} strokeWidth={2} />QR
                        </button>
                      )}
                      {toggles.ewallet && (
                        <button className="bg-purple-50 text-purple-700 text-[11px] font-bold uppercase py-2.5 rounded border-2 border-purple-300 flex items-center justify-center gap-1" style={{ animation: 'fadeInScale 0.15s ease-out' }}>
                          <Wallet size={11} strokeWidth={2} />eWallet
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Your Flow — full-width bottom bar ── */}
              <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Your Flow</p>
                  <p className="text-[9px] text-gray-300 uppercase tracking-wider">Drag to reorder</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {flowSteps.map((step, i) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.id} className="flex items-center gap-1.5 flex-1 min-w-0">
                        <div
                          draggable
                          onDragStart={(e) => { e.dataTransfer.setData('text/plain', step.id); setFlowDragId(step.id); }}
                          onDragOver={(e) => { e.preventDefault(); setFlowDragOverId(step.id); }}
                          onDragEnd={() => { setFlowDragId(null); setFlowDragOverId(null); }}
                          onDrop={(e) => { e.preventDefault(); handleFlowDrop(step.id); }}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded cursor-grab active:cursor-grabbing select-none transition-all ${
                            flowDragId === step.id ? 'opacity-30 scale-95' :
                            flowDragOverId === step.id && flowDragId !== step.id ? 'bg-green-100 border-2 border-green-400 border-dashed' :
                            'bg-white border border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon size={13} strokeWidth={1.5} className={`flex-shrink-0 ${flowDragOverId === step.id && flowDragId !== step.id ? 'text-green-600' : 'text-gray-500'}`} />
                          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider leading-none">{step.label}</span>
                        </div>
                        {i < flowSteps.length - 1 && (
                          <ArrowRight size={11} strokeWidth={2.5} className="text-gray-300 flex-shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Toggle Panel — draggable */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-5 shadow-sm self-start">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Modules</p>
                <p className="text-[9px] text-gray-300 uppercase tracking-wider">Drag to reorder</p>
              </div>
              <div className="space-y-0.5">
                {moduleOrder.filter(id => !toggleModules.find(m => m.id === id)?.custom).map(id => {
                  const m = toggleModules.find(mod => mod.id === id)!;
                  const Icon = m.icon;
                  return (
                    <div
                      key={m.id}
                      draggable
                      onDragStart={(e) => { e.dataTransfer.setData('text/plain', m.id); setDragId(m.id); }}
                      onDragOver={(e) => { e.preventDefault(); setDragOverId(m.id); }}
                      onDragEnd={() => { setDragId(null); setDragOverId(null); }}
                      onDrop={(e) => { e.preventDefault(); handleDrop(m.id); }}
                      className={`flex items-center gap-2.5 py-2 px-3 rounded-md cursor-grab active:cursor-grabbing select-none transition-all ${
                        dragOverId === m.id && dragId !== m.id ? 'border-t-2 border-green-400' : ''
                      } ${dragId === m.id ? 'opacity-40' : 'hover:bg-gray-50'}`}
                    >
                      <span className="text-gray-300 text-[10px] cursor-grab">⠿</span>
                      <Icon size={14} strokeWidth={1.5} className={`flex-shrink-0 transition-colors ${toggles[m.id] ? 'text-green-600' : 'text-gray-300'}`} />
                      <button
                        onClick={() => setToggles(prev => ({ ...prev, [m.id]: !prev[m.id] }))}
                        className="flex items-center flex-1 gap-2"
                      >
                        <span className={`text-[13px] font-medium transition-colors flex-1 text-left ${toggles[m.id] ? 'text-black' : 'text-gray-400'}`}>
                          {m.label}
                        </span>
                        <div className={`w-9 h-5 rounded-full relative transition-colors duration-150 flex-shrink-0 ${toggles[m.id] ? 'bg-green-600' : 'bg-gray-200'}`}>
                          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-150 ${toggles[m.id] ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Custom-built divider */}
              <div className="flex items-center gap-2 my-3 px-3">
                <div className="flex-1 border-t border-gray-200" />
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-[0.12em]">Custom-Built</span>
                <div className="flex-1 border-t border-gray-200" />
              </div>

              <div className="space-y-0.5">
                {moduleOrder.filter(id => toggleModules.find(m => m.id === id)?.custom).map(id => {
                  const m = toggleModules.find(mod => mod.id === id)!;
                  const Icon = m.icon;
                  return (
                    <div
                      key={m.id}
                      draggable
                      onDragStart={(e) => { e.dataTransfer.setData('text/plain', m.id); setDragId(m.id); }}
                      onDragOver={(e) => { e.preventDefault(); setDragOverId(m.id); }}
                      onDragEnd={() => { setDragId(null); setDragOverId(null); }}
                      onDrop={(e) => { e.preventDefault(); handleDrop(m.id); }}
                      className={`flex items-center gap-2.5 py-2 px-3 rounded-md cursor-grab active:cursor-grabbing select-none transition-all ${
                        dragOverId === m.id && dragId !== m.id ? 'border-t-2 border-green-400' : ''
                      } ${dragId === m.id ? 'opacity-40' : 'hover:bg-green-50/50'}`}
                    >
                      <span className="text-gray-300 text-[10px] cursor-grab">⠿</span>
                      <Icon size={14} strokeWidth={1.5} className={`flex-shrink-0 transition-colors ${toggles[m.id] ? 'text-green-600' : 'text-gray-300'}`} />
                      <button
                        onClick={() => setToggles(prev => ({ ...prev, [m.id]: !prev[m.id] }))}
                        className="flex items-center flex-1 gap-2"
                      >
                        <span className={`text-[13px] font-medium transition-colors flex-1 text-left ${toggles[m.id] ? 'text-black' : 'text-gray-400'}`}>
                          {m.label}
                        </span>
                        <div className={`w-9 h-5 rounded-full relative transition-colors duration-150 flex-shrink-0 ${toggles[m.id] ? 'bg-green-600' : 'bg-gray-200'}`}>
                          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-150 ${toggles[m.id] ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="text-[13px] text-gray-600 text-center mt-8">
            This is not a concept. This is how QBot works. You tell us what you need — we configure it.
          </p>
        </div>
      </section>

      {/* ── SECTION 3: THE FORMULA ── */}
      <section className="py-16 md:py-24 bg-black text-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr,auto,1fr,auto,1fr] items-center gap-4 md:gap-3">
            {/* Sunmi Hardware */}
            <div className="border border-white/10 p-5 md:p-6 text-center md:text-left">
              <div className="w-10 h-10 bg-white/5 flex items-center justify-center mx-auto md:mx-0 mb-3">
                <img src="/selfserivce-icon.webp" alt="" className="w-full h-full object-cover opacity-60" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Enterprise Hardware</h3>
              <p className="text-[12px] text-white/70 leading-[1.5]">Commercial-grade. Trusted in 200+ countries.</p>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <Plus size={16} strokeWidth={2} className="text-white/50" />
            </div>

            {/* QBot Foundation */}
            <div className="border border-white/10 p-5 md:p-6 text-center md:text-left">
              <div className="w-10 h-10 bg-white/5 flex items-center justify-center mx-auto md:mx-0 mb-3">
                <Layers size={18} strokeWidth={1.5} className="text-green-400" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">QBot Foundation</h3>
              <p className="text-[12px] text-white/70 leading-[1.5]">6 channels. Central dashboard. Modular add-ons.</p>
              <p className="text-[10px] text-white/50 mt-1">QPos + QHub + QApps</p>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <Plus size={16} strokeWidth={2} className="text-white/50" />
            </div>

            {/* Your Needs */}
            <div className="border border-white/10 p-5 md:p-6 text-center md:text-left">
              <div className="w-10 h-10 bg-white/5 flex items-center justify-center mx-auto md:mx-0 mb-3">
                <Wrench size={18} strokeWidth={1.5} className="text-green-400" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Your Needs</h3>
              <p className="text-[12px] text-white/70 leading-[1.5]">Add features. Hide fields. Configure per-outlet.</p>
              <p className="text-[10px] text-white/50 mt-1">You tell us. We build it.</p>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <span className="text-white/50 text-lg font-light">=</span>
            </div>

            {/* Result */}
            <div className="border-2 border-green-500/30 bg-green-500/5 p-5 md:p-6 text-center md:text-left">
              <h3 className="text-lg font-extrabold text-green-400 uppercase tracking-tight">Custom POS</h3>
              <p className="text-[12px] text-white/70 leading-[1.5] mt-1">Built exactly for your business.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FORM + BENEFITS ── */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid lg:grid-cols-[1fr,1fr] gap-8 lg:gap-12 items-start">
            {/* Left — Benefits */}
            <div className="lg:pt-4">
              <h2 className="text-2xl md:text-[36px] lg:text-[42px] font-extrabold text-black leading-[1.12] tracking-tight mb-4">
                Tell Us What You Need
              </h2>
              <p className="text-[15px] text-gray-600 leading-[1.7] mb-10">
                Every business is different. We'll show you how QBot adapts to yours.
              </p>
              <div className="space-y-6">
                {[
                  { icon: Layers, title: 'Modular Foundation', desc: '50+ features across 6 channels. Activate only what matters.' },
                  { icon: Shield, title: 'Your Data, Your Control', desc: 'Who sees what — per role, per outlet, per device.' },
                  { icon: Wrench, title: 'One Request Away', desc: 'You tell us. We configure, customize, deliver.' },
                ].map(b => {
                  const Icon = b.icon;
                  return (
                    <div key={b.title} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-black flex items-center justify-center flex-shrink-0">
                        <Icon size={18} strokeWidth={1.5} className="text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-black uppercase tracking-wide mb-1">{b.title}</h3>
                        <p className="text-[13px] text-gray-600 leading-[1.6]">{b.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right — Form */}
            <div className="bg-black text-white p-8 md:p-10">

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider mb-2">Business Name</label>
                      <input type="text" required value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-green-500 transition-colors placeholder:text-white/40" placeholder="Your business name" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider mb-2">Business Type</label>
                      <select required value={formData.businessType} onChange={(e) => setFormData({ ...formData, businessType: e.target.value })} className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-green-500 transition-colors appearance-none">
                        <option value="" disabled className="text-black">Select type</option>
                        {businessTypes.map(t => (<option key={t} value={t} className="text-black">{t}</option>))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider mb-2">What Do You Need?</label>
                    <textarea required rows={3} value={formData.needs} onChange={(e) => setFormData({ ...formData, needs: e.target.value })} className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-green-500 transition-colors resize-none placeholder:text-white/40" placeholder="Tell us what you need — features, restrictions, custom workflows..." />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider mb-2">WhatsApp Number</label>
                    <input type="tel" required value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-green-500 transition-colors placeholder:text-white/40" placeholder="+60..." />
                  </div>
                  <button type="submit" className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-green-600 hover:bg-green-500 text-white text-sm font-bold uppercase tracking-wide transition-colors group mt-2">
                    Tell Us What You Need <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <Check size={28} strokeWidth={1.5} className="text-green-500 mx-auto mb-3" />
                  <p className="text-sm font-bold text-white uppercase tracking-wide mb-1">Got it</p>
                  <p className="text-[13px] text-white/70">We'll reach out on WhatsApp to discuss your setup.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

