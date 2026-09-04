import { useState, useEffect } from 'react';
import { X, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { IndustryWizard, Question } from '../data/wizardQuestions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface QBotWizardModalProps {
  industry: IndustryWizard;
  onClose: () => void;
}

interface FormData {
  [key: string]: string | string[];
}

interface ContactInfo {
  name: string;
  email: string;
  mobile: string;
}

interface DeliveryInfo {
  companyName: string;
  brandName: string;
  address: string;
  zipcode: string;
  state: string;
  country: string;
  notes: string;
}

type OrderStep = 'questions' | 'contact' | 'delivery' | 'review' | 'thankyou';

export default function QBotWizardModal({ industry, onClose }: QBotWizardModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [currentStep, setCurrentStep] = useState<OrderStep>('questions');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');
  const [referenceNumber, setReferenceNumber] = useState('');

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: '',
    email: '',
    mobile: ''
  });

  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    companyName: '',
    brandName: '',
    address: '',
    zipcode: '',
    state: '',
    country: 'Malaysia',
    notes: ''
  });

  const totalQuestions = industry.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  useEffect(() => {
    setFadeState('in');
  }, [currentQuestionIndex]);

  const handleQuestionChange = (questionId: string, value: string, isCheckbox: boolean) => {
    if (isCheckbox) {
      const currentValues = (formData[questionId] as string[]) || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      setFormData({ ...formData, [questionId]: newValues });
    } else {
      setFormData({ ...formData, [questionId]: value });
    }
  };

  const handleNext = () => {
    const currentQuestion = industry.questions[currentQuestionIndex];
    if (currentQuestion.required && !formData[currentQuestion.id]) {
      setError('Please answer this question before continuing');
      return;
    }

    setError(null);
    setFadeState('out');

    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setCurrentStep('contact');
      }
    }, 300);
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setFadeState('out');
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      }, 300);
    }
  };

  const handleContactNext = () => {
    if (!contactInfo.name || !contactInfo.email || !contactInfo.mobile) {
      setError('Please fill in all contact information');
      return;
    }
    setError(null);
    setCurrentStep('delivery');
  };

  const handleDeliveryNext = () => {
    if (!deliveryInfo.companyName || !deliveryInfo.address || !deliveryInfo.zipcode || !deliveryInfo.state) {
      setError('Please fill in required delivery information');
      return;
    }
    setError(null);
    setCurrentStep('review');
  };

  const handleConfirmOrder = async () => {
    try {
      setIsSubmitting(true);

      const orderData = {
        industry_id: null,
        total_price: 0,
        selected_products: formData,
        contact_name: contactInfo.name,
        contact_email: contactInfo.email,
        contact_mobile: contactInfo.mobile,
        company_name: deliveryInfo.companyName,
        brand_name: deliveryInfo.brandName || null,
        address: deliveryInfo.address,
        zipcode: deliveryInfo.zipcode,
        state: deliveryInfo.state,
        country: deliveryInfo.country,
        notes: deliveryInfo.notes || null
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setReferenceNumber(data.reference_number);
        setCurrentStep('thankyou');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      setError('Error submitting order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: Question) => {
    const answer = formData[question.id];

    return (
      <div
        className={`transition-opacity duration-300 ${
          fadeState === 'in' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h3 className="text-2xl md:text-3xl font-black text-black mb-2 uppercase">
          {question.question}
        </h3>
        {question.subtitle && (
          <p className="text-base font-bold text-gray-600 mb-8 uppercase">{question.subtitle}</p>
        )}

        <div className="space-y-3">
          {question.type === 'multiple' ? (
            question.options?.map((option) => {
              const isSelected = Array.isArray(answer) && answer.includes(option);
              return (
                <button
                  key={option}
                  onClick={() => handleQuestionChange(question.id, option, true)}
                  className={`w-full text-left px-6 py-4 font-black text-base uppercase border-2 transition-colors duration-200 ${
                    isSelected
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'border-white bg-white' : 'border-gray-400'
                      }`}
                    >
                      {isSelected && <Check size={16} strokeWidth={4} className="text-black" />}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              );
            })
          ) : (
            question.options?.map((option) => (
              <button
                key={option}
                onClick={() => handleQuestionChange(question.id, option, false)}
                className={`w-full text-left px-6 py-4 font-black text-base uppercase border-2 transition-colors duration-200 ${
                  answer === option
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-300 hover:border-gray-400'
                }`}
              >
                {option}
              </button>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderContactStep = () => (
    <div className="p-8">
      <h3 className="text-2xl font-black uppercase mb-6">Please enter your contact information</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold uppercase mb-2">Name *</label>
          <input
            type="text"
            value={contactInfo.name}
            onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
            className="w-full border border-gray-300 px-4 py-3 font-bold"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-bold uppercase mb-2">Email *</label>
          <input
            type="email"
            value={contactInfo.email}
            onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
            className="w-full border border-gray-300 px-4 py-3 font-bold"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-bold uppercase mb-2">Mobile No *</label>
          <input
            type="tel"
            value={contactInfo.mobile}
            onChange={(e) => setContactInfo({ ...contactInfo, mobile: e.target.value })}
            className="w-full border border-gray-300 px-4 py-3 font-bold"
            placeholder="+60123456789"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-600 text-red-600 font-bold text-sm uppercase">
          {error}
        </div>
      )}

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setCurrentStep('questions')}
          className="flex-1 py-4 bg-white text-black font-black uppercase border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft size={20} strokeWidth={3} />
          <span>Back</span>
        </button>
        <button
          onClick={handleContactNext}
          className="flex-1 py-4 bg-black text-white font-black uppercase border border-gray-300 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          <span>Next</span>
          <ArrowRight size={20} strokeWidth={3} />
        </button>
      </div>
    </div>
  );

  const renderDeliveryStep = () => (
    <div className="p-8">
      <h3 className="text-2xl font-black uppercase mb-6">Please enter billing & delivery details</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold uppercase mb-2">
            Company Name * <span className="text-gray-500 normal-case">(eg. Rasa Sayang Sdn Bhd)</span>
          </label>
          <input
            type="text"
            value={deliveryInfo.companyName}
            onChange={(e) => setDeliveryInfo({ ...deliveryInfo, companyName: e.target.value })}
            className="w-full border border-gray-300 px-4 py-3 font-bold"
            placeholder="Rasa Sayang Sdn Bhd"
          />
        </div>

        <div>
          <label className="block text-sm font-bold uppercase mb-2">Brand Name</label>
          <input
            type="text"
            value={deliveryInfo.brandName}
            onChange={(e) => setDeliveryInfo({ ...deliveryInfo, brandName: e.target.value })}
            className="w-full border border-gray-300 px-4 py-3 font-bold"
            placeholder="Rasa Sayang Gastrobar"
          />
        </div>

        <div>
          <label className="block text-sm font-bold uppercase mb-2">Address *</label>
          <textarea
            value={deliveryInfo.address}
            onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
            className="w-full border border-gray-300 px-4 py-3 font-bold"
            rows={3}
            placeholder="Street address, unit number, etc."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold uppercase mb-2">Zipcode *</label>
            <input
              type="text"
              value={deliveryInfo.zipcode}
              onChange={(e) => setDeliveryInfo({ ...deliveryInfo, zipcode: e.target.value })}
              className="w-full border border-gray-300 px-4 py-3 font-bold"
              placeholder="50000"
            />
          </div>

          <div>
            <label className="block text-sm font-bold uppercase mb-2">State *</label>
            <input
              type="text"
              value={deliveryInfo.state}
              onChange={(e) => setDeliveryInfo({ ...deliveryInfo, state: e.target.value })}
              className="w-full border border-gray-300 px-4 py-3 font-bold"
              placeholder="Kuala Lumpur"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold uppercase mb-2">Country *</label>
          <input
            type="text"
            value={deliveryInfo.country}
            onChange={(e) => setDeliveryInfo({ ...deliveryInfo, country: e.target.value })}
            className="w-full border border-gray-300 px-4 py-3 font-bold"
            placeholder="Malaysia"
          />
        </div>

        <div>
          <label className="block text-sm font-bold uppercase mb-2">Notes</label>
          <textarea
            value={deliveryInfo.notes}
            onChange={(e) => setDeliveryInfo({ ...deliveryInfo, notes: e.target.value })}
            className="w-full border border-gray-300 px-4 py-3 font-bold"
            rows={3}
            placeholder="Additional information or special requests..."
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-600 text-red-600 font-bold text-sm uppercase">
          {error}
        </div>
      )}

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setCurrentStep('contact')}
          className="flex-1 py-4 bg-white text-black font-black uppercase border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft size={20} strokeWidth={3} />
          <span>Back</span>
        </button>
        <button
          onClick={handleDeliveryNext}
          className="flex-1 py-4 bg-black text-white font-black uppercase border border-gray-300 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          <span>Review</span>
          <ArrowRight size={20} strokeWidth={3} />
        </button>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="p-8">
      <h3 className="text-2xl font-black uppercase mb-6">Review Your Order</h3>

      <div className="space-y-6">
        <div className="border border-gray-300 p-4">
          <h4 className="font-black uppercase mb-3">Your Selections</h4>
          <div className="space-y-2 text-sm">
            {Object.entries(formData).map(([key, value]) => {
              const question = industry.questions.find(q => q.id === key);
              if (!question) return null;

              return (
                <div key={key}>
                  <p className="font-bold">{question.question}</p>
                  <p className="text-gray-600">
                    {Array.isArray(value) ? value.join(', ') : value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border border-gray-300 p-4">
          <h4 className="font-black uppercase mb-3">Contact Information</h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-bold">Name:</span> {contactInfo.name}</p>
            <p><span className="font-bold">Email:</span> {contactInfo.email}</p>
            <p><span className="font-bold">Mobile:</span> {contactInfo.mobile}</p>
          </div>
        </div>

        <div className="border border-gray-300 p-4">
          <h4 className="font-black uppercase mb-3">Delivery Information</h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-bold">Company:</span> {deliveryInfo.companyName}</p>
            {deliveryInfo.brandName && <p><span className="font-bold">Brand:</span> {deliveryInfo.brandName}</p>}
            <p><span className="font-bold">Address:</span> {deliveryInfo.address}</p>
            <p><span className="font-bold">Zipcode:</span> {deliveryInfo.zipcode}</p>
            <p><span className="font-bold">State:</span> {deliveryInfo.state}</p>
            <p><span className="font-bold">Country:</span> {deliveryInfo.country}</p>
            {deliveryInfo.notes && <p><span className="font-bold">Notes:</span> {deliveryInfo.notes}</p>}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-600 text-red-600 font-bold text-sm uppercase">
          {error}
        </div>
      )}

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setCurrentStep('delivery')}
          className="flex-1 py-4 bg-white text-black font-black uppercase border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft size={20} strokeWidth={3} />
          <span>Back</span>
        </button>
        <button
          onClick={handleConfirmOrder}
          disabled={isSubmitting}
          className="flex-1 py-4 bg-black text-white font-black uppercase border border-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? 'Submitting...' : 'Confirm Order'}
          <Check size={20} strokeWidth={3} />
        </button>
      </div>
    </div>
  );

  const renderThankYouStep = () => (
    <div className="p-8 text-center">
      <div className="mb-6">
        <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={40} strokeWidth={3} className="text-white" />
        </div>
        <h3 className="text-3xl font-black uppercase mb-2">Thank You!</h3>
        <p className="text-gray-600 font-bold">Your order has been received successfully</p>
      </div>

      <div className="bg-gray-50 border border-gray-300 p-6 mb-6">
        <p className="text-sm font-bold uppercase text-gray-600 mb-2">Reference Number</p>
        <p className="text-3xl font-black">{referenceNumber}</p>
      </div>

      <div className="bg-yellow-100 border-2 border-yellow-400 p-4 mb-6">
        <p className="text-sm font-bold">
          Our QBOT team will contact you shortly to finalize your order and arrange payment.
        </p>
      </div>

      <button
        onClick={onClose}
        className="w-full py-4 bg-black text-white font-black uppercase border border-gray-300 hover:bg-gray-800 transition-colors"
      >
        Close
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
      <div className="bg-white w-full max-w-4xl max-h-[95vh] flex flex-col border border-gray-300">
        <div className="bg-white border-b border-gray-300 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-black text-black uppercase">
            {currentStep === 'questions' && `${industry.name} Configuration`}
            {currentStep === 'contact' && 'Contact Information'}
            {currentStep === 'delivery' && 'Delivery Details'}
            {currentStep === 'review' && 'Review Order'}
            {currentStep === 'thankyou' && 'Order Confirmed'}
          </h2>
          {currentStep !== 'thankyou' && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:text-black transition-colors duration-200"
            >
              <X size={28} strokeWidth={3} />
            </button>
          )}
        </div>

        {currentStep === 'questions' && (
          <>
            <div className="bg-gray-200 h-2">
              <div
                className="bg-black h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              {renderQuestion(industry.questions[currentQuestionIndex])}

              {error && (
                <div className="mt-6 p-4 bg-red-100 border border-red-600 text-red-600 font-bold text-sm uppercase">
                  {error}
                </div>
              )}
            </div>

            <div className="border-t border-gray-300 p-6 flex gap-4">
              {currentQuestionIndex > 0 && (
                <button
                  onClick={handleBack}
                  className="px-6 py-4 bg-white text-black font-black text-lg uppercase border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                >
                  BACK
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex-1 flex items-center justify-between px-6 py-4 bg-black text-white font-black text-lg uppercase border border-gray-300 hover:bg-white hover:text-black transition-colors duration-200 group"
              >
                <span>{currentQuestionIndex === totalQuestions - 1 ? 'CONTINUE' : 'NEXT'}</span>
                <ArrowRight
                  size={24}
                  strokeWidth={3}
                  className="group-hover:translate-x-2 transition-transform duration-300"
                />
              </button>
            </div>
          </>
        )}

        {currentStep === 'contact' && (
          <div className="flex-1 overflow-y-auto">
            {renderContactStep()}
          </div>
        )}

        {currentStep === 'delivery' && (
          <div className="flex-1 overflow-y-auto">
            {renderDeliveryStep()}
          </div>
        )}

        {currentStep === 'review' && (
          <div className="flex-1 overflow-y-auto">
            {renderReviewStep()}
          </div>
        )}

        {currentStep === 'thankyou' && (
          <div className="flex-1 overflow-y-auto">
            {renderThankYouStep()}
          </div>
        )}
      </div>
    </div>
  );
}
