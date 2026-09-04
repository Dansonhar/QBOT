import { useState, useMemo } from 'react';
import SEOHead from '../components/SEOHead';
import { ArrowRight, ArrowLeft, Check, ChevronDown } from 'lucide-react';
import { trackWhatsAppClick } from '../utils/trackWhatsApp';
import {
  businessTypes,
  sellingChannels,
  hardwareBundles,
  softwarePlans,
  getRecommendedBundles,
  initialWizardState,
  type WizardState,
  type HardwareBundle,
  type SoftwarePlan,
} from '../data/configuratorConfig';

const STEPS = ['Business', 'Channels', 'Hardware', 'Plan', 'Review'];

// ═══════════════════════════════════════════════
// PRICE CALCULATOR
// ═══════════════════════════════════════════════
function calcTotal(state: WizardState) {
  let hardware = 0;
  let softwareMonthly = 0;

  const bundle = hardwareBundles.find((b) => b.id === state.bundleId);
  if (bundle) {
    hardware = bundle.variants ? bundle.variants[state.variantIndex]?.price ?? bundle.basePrice : bundle.basePrice;
    state.addOns.forEach((aId) => {
      const addOn = bundle.addOns.find((a) => a.id === aId);
      if (addOn) hardware += addOn.price;
    });
  }

  const plan = softwarePlans.find((p) => p.id === state.planId);
  if (plan) {
    softwareMonthly = state.billingCycle === '12m' ? plan.monthlyEquiv12m : plan.monthlyEquiv6m;
  }

  return { hardware, softwareMonthly };
}

// ═══════════════════════════════════════════════
// PROGRESS BAR
// ═══════════════════════════════════════════════
function ProgressBar({ current, steps, skipHardware }: { current: number; steps: string[]; skipHardware: boolean }) {
  const filtered = skipHardware ? steps.filter((s) => s !== 'Hardware') : steps;
  const mappedCurrent = skipHardware && current > 2 ? current - 1 : current;
  const adjustedCurrent = skipHardware && current === 2 ? current : mappedCurrent;

  return (
    <div className="flex items-center justify-center gap-1 mb-10">
      {filtered.map((step, i) => {
        const actualIdx = skipHardware ? (i >= 2 ? i + 1 : i) : i;
        const isActive = actualIdx === current;
        const isDone = actualIdx < current;
        return (
          <div key={step} className="flex items-center">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide transition-colors ${
              isActive ? 'text-black' : isDone ? 'text-green-600' : 'text-gray-300'
            }`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isActive ? 'bg-black text-white' : isDone ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {isDone ? <Check size={10} strokeWidth={3} /> : i + 1}
              </span>
              <span className="hidden sm:inline">{step}</span>
            </div>
            {i < filtered.length - 1 && <div className="w-6 md:w-10 h-px bg-gray-200" />}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════
// STICKY PRICE BAR
// ═══════════════════════════════════════════════
function PriceBar({ state }: { state: WizardState }) {
  const { hardware, softwareMonthly } = calcTotal(state);
  if (!state.bundleId && !state.planId) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-black text-white py-3 px-4 md:px-6 lg:hidden">
      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-4">
          {hardware > 0 && <span>Hardware: <strong>RM{hardware.toLocaleString()}</strong></span>}
          {softwareMonthly > 0 && <span>Software: <strong>RM{softwareMonthly}/mth</strong></span>}
        </div>
        <span className="font-bold">RM{(hardware + softwareMonthly).toLocaleString()}</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// STEP 1: BUSINESS TYPE
// ═══════════════════════════════════════════════
function Step1({ state, update }: { state: WizardState; update: (s: Partial<WizardState>) => void }) {
  return (
    <div>
      <h2 className="text-2xl md:text-[34px] font-extrabold text-black tracking-tight mb-2">What's your business?</h2>
      <p className="text-[15px] text-gray-400 mb-8">We'll personalise your setup based on your industry.</p>
      <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-lg">
        {businessTypes.map((bt) => (
          <button
            key={bt.id}
            onClick={() => update({ businessType: bt.id })}
            className={`p-5 md:p-6 border-2 text-left transition-all ${
              state.businessType === bt.id
                ? 'border-black bg-black text-white'
                : 'border-gray-200 hover:border-gray-400 text-black'
            }`}
          >
            <span className="text-2xl mb-2 block">{bt.icon}</span>
            <span className="text-sm font-bold">{bt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// STEP 2: SELLING CHANNELS
// ═══════════════════════════════════════════════
function Step2({ state, update }: { state: WizardState; update: (s: Partial<WizardState>) => void }) {
  const toggle = (id: string) => {
    const next = state.channels.includes(id)
      ? state.channels.filter((c) => c !== id)
      : [...state.channels, id];
    update({ channels: next, bundleId: null, variantIndex: 0, addOns: [] });
  };

  const hwChannels = sellingChannels.filter((c) => c.type === 'hardware');
  const swChannels = sellingChannels.filter((c) => c.type === 'software');

  return (
    <div>
      <h2 className="text-2xl md:text-[34px] font-extrabold text-black tracking-tight mb-2">Where do you want to sell?</h2>
      <p className="text-[15px] text-gray-400 mb-8">Pick one or more. Hardware channels will let you choose a device next.</p>

      <p className="text-[11px] font-bold text-green-600 uppercase tracking-[0.12em] mb-3">Hardware Channels</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {hwChannels.map((ch) => (
          <button
            key={ch.id}
            onClick={() => toggle(ch.id)}
            className={`p-4 border-2 text-left transition-all ${
              state.channels.includes(ch.id)
                ? 'border-black bg-black text-white'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <p className="text-sm font-bold mb-0.5">{ch.label}</p>
            <p className={`text-[12px] ${state.channels.includes(ch.id) ? 'text-white/60' : 'text-gray-400'}`}>{ch.description}</p>
          </button>
        ))}
      </div>

      <p className="text-[11px] font-bold text-green-600 uppercase tracking-[0.12em] mb-3">Software-Only Channels</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {swChannels.map((ch) => (
          <button
            key={ch.id}
            onClick={() => toggle(ch.id)}
            className={`p-4 border-2 text-left transition-all ${
              state.channels.includes(ch.id)
                ? 'border-black bg-black text-white'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <p className="text-sm font-bold mb-0.5">{ch.label}</p>
            <p className={`text-[12px] ${state.channels.includes(ch.id) ? 'text-white/60' : 'text-gray-400'}`}>{ch.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// STEP 3: HARDWARE
// ═══════════════════════════════════════════════
function Step3({ state, update }: { state: WizardState; update: (s: Partial<WizardState>) => void }) {
  const hwChannels = state.channels.filter((c) => sellingChannels.find((sc) => sc.id === c)?.type === 'hardware');
  const recommended = getRecommendedBundles(hwChannels);

  const selectBundle = (b: HardwareBundle) => {
    update({
      bundleId: b.id,
      variantIndex: 0,
      addOns: [],
      planId: b.availablePlans.includes(state.planId || '') ? state.planId : b.availablePlans[0],
    });
  };

  const toggleAddOn = (aId: string) => {
    const next = state.addOns.includes(aId)
      ? state.addOns.filter((a) => a !== aId)
      : [...state.addOns, aId];
    update({ addOns: next });
  };

  const selectedBundle = hardwareBundles.find((b) => b.id === state.bundleId);

  return (
    <div>
      <h2 className="text-2xl md:text-[34px] font-extrabold text-black tracking-tight mb-2">Choose your hardware</h2>
      <p className="text-[15px] text-gray-400 mb-8">Select the device bundle that fits your setup.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {recommended.map((b) => (
          <button
            key={b.id}
            onClick={() => selectBundle(b)}
            className={`border-2 text-left transition-all overflow-hidden ${
              state.bundleId === b.id ? 'border-black' : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            {b.image && (
              <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                <img src={b.image} alt={b.device} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-[11px] font-bold text-green-600 uppercase tracking-wide mb-1">{b.name}</p>
                  <p className="text-base font-bold text-black">{b.device}</p>
                </div>
                <p className="text-lg font-extrabold text-black">RM{b.basePrice.toLocaleString()}</p>
              </div>
              <p className="text-[13px] text-gray-400 mb-3">{b.description}</p>
              <div className="flex flex-wrap gap-2">
                {b.highlights.map((h) => (
                  <span key={h} className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5">{h}</span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Variant selector */}
      {selectedBundle?.variants && (
        <div className="mb-6">
          <p className="text-sm font-bold text-black mb-3">Configuration</p>
          <div className="flex gap-3">
            {selectedBundle.variants.map((v, i) => (
              <button
                key={v.label}
                onClick={() => update({ variantIndex: i })}
                className={`px-4 py-2.5 border-2 text-sm font-semibold transition-all ${
                  state.variantIndex === i ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                {v.label} — RM{v.price.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add-ons */}
      {selectedBundle && selectedBundle.addOns.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-bold text-black mb-3">Add-ons</p>
          <div className="space-y-2">
            {selectedBundle.addOns.map((a) => (
              <button
                key={a.id}
                onClick={() => toggleAddOn(a.id)}
                className={`w-full flex items-center justify-between p-3 border-2 text-left transition-all ${
                  state.addOns.includes(a.id) ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 border-2 flex items-center justify-center ${state.addOns.includes(a.id) ? 'border-black bg-black' : 'border-gray-300'}`}>
                    {state.addOns.includes(a.id) && <Check size={10} strokeWidth={3} className="text-white" />}
                  </div>
                  <span className="text-sm font-medium">{a.label}</span>
                </div>
                <span className="text-sm font-bold">+RM{a.price.toLocaleString()}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* What's included */}
      {selectedBundle && (
        <div className="bg-gray-50 border border-gray-200 p-5">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-3">What's included</p>
          <div className="grid grid-cols-2 gap-y-1.5">
            {selectedBundle.whatsIncluded.map((item) => (
              <p key={item} className="text-[12px] text-gray-600 flex items-start gap-1.5">
                <Check size={11} strokeWidth={2.5} className="text-green-600 mt-0.5 flex-shrink-0" />
                {item}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
// STEP 4: SOFTWARE PLAN
// ═══════════════════════════════════════════════
function Step4({ state, update }: { state: WizardState; update: (s: Partial<WizardState>) => void }) {
  const bundle = hardwareBundles.find((b) => b.id === state.bundleId);
  const availableIds = bundle ? bundle.availablePlans : ['free', 'standard', 'plus', 'pro'];
  const available = softwarePlans.filter((p) => availableIds.includes(p.id));

  return (
    <div>
      <h2 className="text-2xl md:text-[34px] font-extrabold text-black tracking-tight mb-2">Choose your plan</h2>
      <p className="text-[15px] text-gray-400 mb-6">All plans include 6 months free with your hardware purchase.</p>

      {/* Billing toggle */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => update({ billingCycle: '6m' })}
          className={`px-4 py-2 text-sm font-bold transition-colors ${state.billingCycle === '6m' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}
        >6 Months</button>
        <button
          onClick={() => update({ billingCycle: '12m' })}
          className={`px-4 py-2 text-sm font-bold transition-colors ${state.billingCycle === '12m' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}
        >12 Months <span className="text-green-600 ml-1">Save 15%</span></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {softwarePlans.map((p) => {
          const isAvailable = available.some((a) => a.id === p.id);
          const isSelected = state.planId === p.id;
          const price = state.billingCycle === '12m' ? p.price12m : p.price6m;
          const monthly = state.billingCycle === '12m' ? p.monthlyEquiv12m : p.monthlyEquiv6m;

          return (
            <button
              key={p.id}
              onClick={() => isAvailable && update({ planId: p.id })}
              disabled={!isAvailable}
              className={`border-2 p-5 text-left transition-all ${
                !isAvailable ? 'border-gray-100 opacity-40 cursor-not-allowed' :
                isSelected ? 'border-black' : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <p className="text-lg font-extrabold text-black mb-0.5">{p.name}</p>
              <p className="text-[12px] text-gray-400 mb-3">{p.devices}</p>
              <p className="text-2xl font-extrabold text-black mb-0.5">
                {p.isFree ? 'RM0' : `RM${monthly}`}<span className="text-sm font-medium text-gray-400">/mth</span>
              </p>
              {!p.isFree && <p className="text-[11px] text-gray-400 mb-4">RM{price} / {state.billingCycle === '12m' ? '12 months' : '6 months'}</p>}
              {p.isFree && <p className="text-[11px] text-green-600 font-semibold mb-4">Free forever</p>}
              <ul className="space-y-1.5">
                {p.features.map((f) => (
                  <li key={f} className="text-[12px] text-gray-500 flex items-start gap-1.5">
                    <Check size={11} strokeWidth={2.5} className="text-green-600 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// STEP 5: REVIEW
// ═══════════════════════════════════════════════
function Step5({ state }: { state: WizardState }) {
  const { hardware, softwareMonthly } = calcTotal(state);
  const bundle = hardwareBundles.find((b) => b.id === state.bundleId);
  const plan = softwarePlans.find((p) => p.id === state.planId);
  const bType = businessTypes.find((b) => b.id === state.businessType);
  const channelLabels = state.channels.map((c) => sellingChannels.find((sc) => sc.id === c)?.label).filter(Boolean);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', business: '', outlets: '1' });
  const [submitted, setSubmitted] = useState(false);

  const whatsAppMsg = encodeURIComponent(
    `Hi QPOS, I just configured my setup:\n` +
    `Business: ${bType?.label}\n` +
    `Channels: ${channelLabels.join(', ')}\n` +
    `${bundle ? `Hardware: ${bundle.device} (RM${hardware.toLocaleString()})` : 'Software only'}\n` +
    `Plan: ${plan?.name} (RM${softwareMonthly}/mth)\n` +
    `I'd like to proceed.`
  );

  return (
    <div>
      <h2 className="text-2xl md:text-[34px] font-extrabold text-black tracking-tight mb-6">Your QPOS build</h2>

      <div className="space-y-4 mb-8">
        <div className="border border-gray-200 p-4">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">Business Type</p>
          <p className="text-sm font-bold text-black">{bType?.icon} {bType?.label}</p>
        </div>
        <div className="border border-gray-200 p-4">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">Selling Channels</p>
          <div className="flex flex-wrap gap-2">{channelLabels.map((l) => <span key={l} className="text-xs font-medium bg-gray-100 px-2 py-1">{l}</span>)}</div>
        </div>
        {bundle && (
          <div className="border border-gray-200 p-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">Hardware</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-black">{bundle.device}</p>
                {bundle.variants && <p className="text-[12px] text-gray-400">{bundle.variants[state.variantIndex]?.label}</p>}
                {state.addOns.length > 0 && <p className="text-[12px] text-gray-400">+ {state.addOns.map((a) => bundle.addOns.find((ao) => ao.id === a)?.label).join(', ')}</p>}
              </div>
              <p className="text-lg font-extrabold text-black">RM{hardware.toLocaleString()}</p>
            </div>
          </div>
        )}
        <div className="border border-gray-200 p-4">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">Software Plan</p>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-black">{plan?.name}</p>
            <p className="text-lg font-extrabold text-black">{plan?.isFree ? 'Free' : `RM${softwareMonthly}/mth`}</p>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="bg-black text-white p-5 mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white/60">Hardware (one-time)</span>
          <span className="text-base font-bold">RM{hardware.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-white/60">Software (monthly)</span>
          <span className="text-base font-bold">RM{softwareMonthly}/mth</span>
        </div>
        <div className="border-t border-white/20 pt-3 flex items-center justify-between">
          <span className="text-sm font-bold">Total to get started</span>
          <span className="text-xl font-extrabold">RM{(hardware + softwareMonthly).toLocaleString()}</span>
        </div>
      </div>

      {/* CTAs */}
      {!showForm && !submitted && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-500 text-white text-sm font-bold uppercase tracking-wide transition-colors"
          >
            Arrange a Demo <ArrowRight size={14} strokeWidth={2.5} />
          </button>
          <a
            href={`https://wa.me/60126909189?text=${whatsAppMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick('Build > Checkout via WhatsApp')}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-black hover:bg-gray-800 text-white text-sm font-bold uppercase tracking-wide transition-colors"
          >
            Checkout via WhatsApp <ArrowRight size={14} strokeWidth={2.5} />
          </a>
        </div>
      )}

      {/* Demo Form */}
      {showForm && !submitted && (
        <div className="border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-black mb-4">Arrange a Demo</h3>
          <div className="space-y-3 mb-5">
            {[
              { key: 'name', label: 'Name', type: 'text' },
              { key: 'email', label: 'Email', type: 'email' },
              { key: 'phone', label: 'Phone', type: 'tel' },
              { key: 'business', label: 'Business Name', type: 'text' },
              { key: 'outlets', label: 'Number of Outlets', type: 'number' },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1 block">{f.label}</label>
                <input
                  type={f.type}
                  value={formData[f.key as keyof typeof formData]}
                  onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:border-black focus:outline-none transition-colors"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setSubmitted(true); setShowForm(false); }}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-500 text-white text-sm font-bold uppercase tracking-wide transition-colors"
            >
              Submit
            </button>
            <button onClick={() => setShowForm(false)} className="px-6 py-3 border border-gray-200 text-sm font-bold text-gray-500 hover:border-black transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {submitted && (
        <div className="bg-green-50 border border-green-200 p-6 text-center">
          <p className="text-lg font-bold text-green-700 mb-1">Demo request submitted!</p>
          <p className="text-sm text-green-600">Our team will contact you within 24 hours to schedule your demo.</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAIN WIZARD
// ═══════════════════════════════════════════════
// (no separate hero — Step 1 IS the intro)

// ═══════════════════════════════════════════════
// MAIN WIZARD
// ═══════════════════════════════════════════════
export default function BuildPage() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>(initialWizardState);

  const update = (partial: Partial<WizardState>) => setState((prev) => ({ ...prev, ...partial }));

  const hasHardwareChannels = state.channels.some((c) => sellingChannels.find((sc) => sc.id === c)?.type === 'hardware');
  const skipHardware = !hasHardwareChannels;

  const canNext = useMemo(() => {
    if (step === 0) return !!state.businessType;
    if (step === 1) return state.channels.length > 0;
    if (step === 2) return skipHardware || !!state.bundleId;
    if (step === 3) return !!state.planId;
    return true;
  }, [step, state, skipHardware]);

  const goNext = () => {
    if (step === 1 && skipHardware) {
      if (!state.planId) update({ planId: 'standard' });
      setStep(3);
    } else if (step === 2 && !state.planId) {
      const bundle = hardwareBundles.find((b) => b.id === state.bundleId);
      if (bundle) update({ planId: bundle.availablePlans[0] });
      setStep(3);
    } else {
      setStep((s) => Math.min(s + 1, 4));
    }
  };

  const goBack = () => {
    if (step === 3 && skipHardware) {
      setStep(1);
    } else {
      setStep((s) => Math.max(s - 1, 0));
    }
  };

  const { hardware, softwareMonthly } = calcTotal(state);

  return (
    <>
      <SEOHead
        title="Build My POS — Custom POS Configurator Malaysia | QPOS"
        description="Configure your ideal POS setup in 2 minutes — pick your business type, selling channels, hardware, add-ons, and get a personalised quote. Built for F&B, retail, wellness in Malaysia."
        keywords="POS configurator Malaysia, build POS online, custom POS Malaysia, POS wizard, POS quote Malaysia, F&B POS builder, retail POS builder, POS setup tool, QPOS configurator, POS quote generator"
        url="https://qbot.now/build"
      />
    <div className="min-h-screen bg-white pt-14 md:pt-16 pb-20">
      {step === 0 ? (
        <div>
          {/* Hero image — full width banner */}
          <div className="relative w-full overflow-hidden bg-black" style={{ height: '40vh', minHeight: '260px' }}>
            <img src="/Q_STAND_1.webp" alt="QBOT POS stand accessory" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 flex items-end">
              <div className="container mx-auto px-6 md:px-12 lg:px-20 pb-8 md:pb-10">
                <h1 className="text-[28px] md:text-[40px] lg:text-[48px] font-black text-white leading-[0.92] tracking-tighter uppercase">
                  FIND THE BEST POS<br />SETUP FOR YOUR BUSINESS.
                </h1>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="container mx-auto px-6 md:px-12 lg:px-20 py-10 md:py-14">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-20">
              {/* Left — benefits + description */}
              <div>
                <p className="text-[15px] text-gray-400 leading-[1.7] mb-8">
                  Answer a few questions. We'll match you with the right device, plan, and price — in under 2 minutes.
                </p>
                <div className="space-y-4 mb-8">
                  {[
                    { title: 'Instant recommendation', desc: 'Hardware + software matched to your business type and channels.' },
                    { title: 'Transparent pricing', desc: 'See your total upfront — no hidden fees, no surprises.' },
                    { title: 'No signup needed', desc: 'Explore freely. Book a demo or checkout when you\'re ready.' },
                  ].map((b) => (
                    <div key={b.title} className="flex items-start gap-3">
                      <Check size={14} strokeWidth={3} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-black">{b.title}</p>
                        <p className="text-[13px] text-gray-400">{b.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — the question with big buttons */}
              <div>
                <p className="text-xl md:text-2xl font-extrabold text-black tracking-tight mb-2">
                  What type of business do you run?
                </p>
                <p className="text-[13px] text-gray-400 mb-6">Select one to get started.</p>

                <div className="space-y-2.5">
                  {businessTypes.map((bt) => (
                    <button
                      key={bt.id}
                      onClick={() => { update({ businessType: bt.id }); setTimeout(goNext, 250); }}
                      className="w-full flex items-center gap-4 px-5 py-4 border-2 text-left transition-all group border-gray-200 hover:border-black text-black"
                    >
                      <span className="text-2xl">{bt.icon}</span>
                      <span className="text-[15px] font-bold flex-1">{bt.label}</span>
                      <ArrowRight size={16} strokeWidth={2} className="text-gray-300 group-hover:text-black transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
      <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-5xl pt-8">
        <ProgressBar current={step} steps={STEPS} skipHardware={skipHardware} />

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            {step === 1 && <Step2 state={state} update={update} />}
            {step === 2 && <Step3 state={state} update={update} />}
            {step === 3 && <Step4 state={state} update={update} />}
            {step === 4 && <Step5 state={state} />}

            {/* Nav buttons */}
            {step < 4 && (
              <div className="flex items-center justify-between mt-10">
                {step > 0 ? (
                  <button onClick={goBack} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors">
                    <ArrowLeft size={14} strokeWidth={2.5} /> Back
                  </button>
                ) : <div />}
                <button
                  onClick={goNext}
                  disabled={!canNext}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
                    canNext ? 'bg-black hover:bg-gray-800 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {step === 3 ? 'Review Build' : 'Next'} <ArrowRight size={14} strokeWidth={2.5} />
                </button>
              </div>
            )}

            {step === 4 && (
              <button onClick={() => setStep(0)} className="mt-6 text-sm font-bold text-gray-400 hover:text-black transition-colors flex items-center gap-2">
                <ArrowLeft size={14} strokeWidth={2.5} /> Start Over
              </button>
            )}
          </div>

          {/* Sidebar price summary (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-gray-50 border border-gray-200 p-5">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-4">Your Build</p>

              {state.businessType && (
                <div className="mb-3 pb-3 border-b border-gray-200">
                  <p className="text-[11px] text-gray-400 mb-0.5">Business</p>
                  <p className="text-sm font-semibold text-black">{businessTypes.find((b) => b.id === state.businessType)?.label}</p>
                </div>
              )}

              {state.channels.length > 0 && (
                <div className="mb-3 pb-3 border-b border-gray-200">
                  <p className="text-[11px] text-gray-400 mb-1">Channels</p>
                  <div className="flex flex-wrap gap-1">{state.channels.map((c) => <span key={c} className="text-[10px] font-medium bg-gray-200 px-1.5 py-0.5">{sellingChannels.find((sc) => sc.id === c)?.label}</span>)}</div>
                </div>
              )}

              {state.bundleId && (
                <div className="mb-3 pb-3 border-b border-gray-200">
                  <p className="text-[11px] text-gray-400 mb-0.5">Hardware</p>
                  <div className="flex justify-between"><p className="text-sm font-semibold text-black">{hardwareBundles.find((b) => b.id === state.bundleId)?.device}</p><p className="text-sm font-bold">RM{hardware.toLocaleString()}</p></div>
                </div>
              )}

              {state.planId && (
                <div className="mb-4 pb-3 border-b border-gray-200">
                  <p className="text-[11px] text-gray-400 mb-0.5">Plan</p>
                  <div className="flex justify-between"><p className="text-sm font-semibold text-black">{softwarePlans.find((p) => p.id === state.planId)?.name}</p><p className="text-sm font-bold">{softwareMonthly > 0 ? `RM${softwareMonthly}/mth` : 'Free'}</p></div>
                </div>
              )}

              {(hardware > 0 || softwareMonthly > 0) && (
                <div className="bg-black text-white p-3 -mx-5 -mb-5 mt-2">
                  <div className="flex justify-between text-sm"><span className="text-white/60">Total</span><span className="font-extrabold">RM{(hardware + softwareMonthly).toLocaleString()}</span></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Mobile price bar */}
      <PriceBar state={state} />
    </div>
    </>
  );
}
