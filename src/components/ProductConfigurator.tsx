import { useState, useEffect, useMemo } from 'react';
import { X, Plus, Minus, ShoppingCart, Mail, Phone, Check, ArrowRight, Wallet, CreditCard, ArrowLeft } from 'lucide-react';
import { Product, IndustryType, IndustryProductPreset, SelectedProduct } from '../types/configurator';
import { supabase } from '../lib/supabase';


interface ContactInfo {
  name: string;
  email: string;
  mobile: string;
  countryCode: string;
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

type OrderStep = 'configurator' | 'contact' | 'delivery' | 'review' | 'thankyou';

interface ProductConfiguratorProps {
  industry: IndustryType;
  onClose: () => void;
}

export default function ProductConfigurator({ industry, onClose }: ProductConfiguratorProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Map<string, SelectedProduct>>(new Map());
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<OrderStep>('configurator');
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'onetime' | 'installment'>('onetime');
  const [error, setError] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState('');

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: '',
    email: '',
    mobile: '',
    countryCode: '+60'
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

  useEffect(() => {
    loadProductsAndPresets();
  }, [industry.id]);

  const loadProductsAndPresets = async () => {
    try {
      setLoading(true);

      const { data: productsData, error } = await supabase.functions.invoke('get-products');
      if (error) throw error;

      setProducts(productsData || []);

      const initialSelected = new Map<string, SelectedProduct>();

      const defaultProducts = [
        'Q1 Desktop',
        'Payment Merchant',
        'Digital Receipt (QR)',
        'QHUB AI',
        '12 Months Warranty',
        'Delivery to West Malaysia',
        'Setup Fees'
      ];

      productsData?.forEach((product) => {
        if (defaultProducts.includes(product.name)) {
          initialSelected.set(product.id, {
            product,
            quantity: 1,
            isSelected: true,
          });
        }
      });

      setSelectedProducts(initialSelected);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const toggleProduct = (product: Product) => {
    if (product.is_mandatory) return;

    setSelectedProducts((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(product.id);

      if (existing) {
        if (existing.isSelected) {
          newMap.delete(product.id);

          // Auto-deselect Face-ID System when Face-ID Camera is deselected
          if (product.name === 'Face-ID Camera') {
            const faceIdSystem = Array.from(newMap.values()).find(sp => sp.product.name === 'Face-ID System');
            if (faceIdSystem) {
              newMap.delete(faceIdSystem.product.id);
            }
          }

          // Auto-deselect POS System when QPOS is deselected
          if (product.name === 'QPOS') {
            const posSystem = Array.from(newMap.values()).find(sp => sp.product.name === 'POS System');
            if (posSystem) {
              newMap.delete(posSystem.product.id);
            }
          }
        } else {
          const kiosks = Array.from(newMap.values()).reduce((sum, sp) => {
            if (sp.product.exclusive_group === 'q1_kiosks' && sp.isSelected) {
              return sum + sp.quantity;
            }
            return sum;
          }, 0);

          const followsKioskCount = ['Extended Warranty'].includes(product.name);
          const quantity = followsKioskCount ? kiosks : 1;
          newMap.set(product.id, { ...existing, isSelected: true, quantity });

          // Handle delivery options mutual exclusivity when re-selecting
          if (product.exclusive_group === 'delivery_options') {
            Array.from(newMap.values()).forEach(sp => {
              if (sp.product.exclusive_group === 'delivery_options' && sp.product.id !== product.id) {
                newMap.delete(sp.product.id);
              }
            });
          }
        }
      } else {
        let currentKioskQuantity = 1;

        if (product.exclusive_group === 'q1_kiosks') {
          const existingKiosk = Array.from(newMap.values()).find(sp =>
            sp.product.exclusive_group === 'q1_kiosks' && sp.isSelected
          );
          if (existingKiosk) {
            currentKioskQuantity = existingKiosk.quantity;
          }

          Array.from(newMap.values()).forEach(sp => {
            if (sp.product.exclusive_group === 'q1_kiosks' && sp.product.id !== product.id) {
              newMap.delete(sp.product.id);
            }
          });

          const newEntry = { product, quantity: currentKioskQuantity, isSelected: true };
          newMap.set(product.id, newEntry);

          newMap.forEach((sp, id) => {
            if (['Payment Merchant', 'Digital Receipt (QR)', 'QHUB AI', 'Extended Warranty', '12 Months Warranty', 'Face-ID Camera'].includes(sp.product.name)) {
              newMap.set(id, { ...sp, quantity: currentKioskQuantity });
            }
          });

          // Update Turnstile Face-ID Addon quantity to match total turnstiles
          const totalTurnstiles = Array.from(newMap.values()).reduce((sum, sp) => {
            if (['Turnstile', 'Turnstile Slim'].includes(sp.product.name) && sp.isSelected) {
              return sum + sp.quantity;
            }
            return sum;
          }, 0);

          if (totalTurnstiles > 0) {
            const faceIdAddon = Array.from(newMap.values()).find(sp => sp.product.name === 'Turnstile Face-ID Addon');
            if (faceIdAddon) {
              newMap.set(faceIdAddon.product.id, { ...faceIdAddon, quantity: totalTurnstiles });
            }
          }
        } else {
          const kiosks = Array.from(newMap.values()).reduce((sum, sp) => {
            if (sp.product.exclusive_group === 'q1_kiosks' && sp.isSelected) {
              return sum + sp.quantity;
            }
            return sum;
          }, 0);

          const followsKioskCount = ['Extended Warranty', '12 Months Warranty', 'Face-ID Camera'].includes(product.name);

          // Calculate turnstile quantity for Face-ID Addon
          let quantity = 1;
          if (followsKioskCount) {
            quantity = kiosks;
          } else if (product.name === 'Turnstile Face-ID Addon') {
            const totalTurnstiles = Array.from(newMap.values()).reduce((sum, sp) => {
              if (['Turnstile', 'Turnstile Slim'].includes(sp.product.name) && sp.isSelected) {
                return sum + sp.quantity;
              }
              return sum;
            }, 0);
            quantity = totalTurnstiles > 0 ? totalTurnstiles : 1;
          }

          const newEntry = { product, quantity, isSelected: true };
          newMap.set(product.id, newEntry);

          // Auto-select Face-ID System when Face-ID Camera is selected
          if (product.name === 'Face-ID Camera') {
            const faceIdSystem = products.find(p => p.name === 'Face-ID System');
            if (faceIdSystem && !newMap.has(faceIdSystem.id)) {
              newMap.set(faceIdSystem.id, { product: faceIdSystem, quantity: 1, isSelected: true });
            }
          }

          // Auto-select POS System when QPOS or QPOS with Cash Drawer is selected
          if (product.name === 'QPOS' || product.name === 'QPOS with Cash Drawer') {
            const posSystem = products.find(p => p.name === 'POS System');
            if (posSystem && !newMap.has(posSystem.id)) {
              newMap.set(posSystem.id, { product: posSystem, quantity: 1, isSelected: true });
            }
          }

          // Auto-select QPOS and POS System when Cash Drawer is selected
          if (product.name === 'Cash Drawer') {
            const qpos = products.find(p => p.name === 'QPOS');
            const posSystem = products.find(p => p.name === 'POS System');
            if (qpos && !newMap.has(qpos.id)) {
              newMap.set(qpos.id, { product: qpos, quantity: 1, isSelected: true });
            }
            if (posSystem && !newMap.has(posSystem.id)) {
              newMap.set(posSystem.id, { product: posSystem, quantity: 1, isSelected: true });
            }
          }

          // Handle delivery options mutual exclusivity
          if (product.exclusive_group === 'delivery_options') {
            Array.from(newMap.values()).forEach(sp => {
              if (sp.product.exclusive_group === 'delivery_options' && sp.product.id !== product.id) {
                newMap.delete(sp.product.id);
              }
            });
          }
        }
      }

      return newMap;
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setSelectedProducts((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(productId);

      if (existing) {
        let newQuantity = Math.max(1, existing.quantity + delta);

        if (existing.product.exclusive_group === 'q1_kiosks') {
          newQuantity = Math.min(newQuantity, 4);
        }

        if (existing.product.name === 'Extended Warranty') {
          const kiosks = Array.from(newMap.values()).reduce((sum, sp) => {
            if (sp.product.exclusive_group === 'q1_kiosks' && sp.isSelected) {
              return sum + sp.quantity;
            }
            return sum;
          }, 0);
          newQuantity = Math.min(newQuantity, kiosks);
        }

        newMap.set(productId, { ...existing, quantity: newQuantity });

        if (existing.product.exclusive_group === 'q1_kiosks') {
          const totalKiosks = newQuantity;
          newMap.forEach((sp, id) => {
            if (['Payment Merchant', 'Digital Receipt (QR)', 'QHUB AI', 'Extended Warranty', '12 Months Warranty', 'Face-ID Camera', 'Delivery to West Malaysia', 'Delivery to East Malaysia', 'Onsite Installation'].includes(sp.product.name)) {
              newMap.set(id, { ...sp, quantity: totalKiosks });
            }
          });
        }

        // Update Turnstile Face-ID Addon when turnstile quantity changes
        if (['Turnstile', 'Turnstile Slim'].includes(existing.product.name)) {
          const totalTurnstiles = Array.from(newMap.values()).reduce((sum, sp) => {
            if (['Turnstile', 'Turnstile Slim'].includes(sp.product.name) && sp.isSelected) {
              return sum + sp.quantity;
            }
            return sum;
          }, 0);

          const faceIdAddon = Array.from(newMap.values()).find(sp => sp.product.name === 'Turnstile Face-ID Addon');
          if (faceIdAddon && faceIdAddon.isSelected) {
            newMap.set(faceIdAddon.product.id, { ...faceIdAddon, quantity: totalTurnstiles });
          }
        }
      }

      return newMap;
    });
  };

  const calculateQ1Price = (product: Product, quantity: number): number => {
    if (!product.bundle_price_2) {
      return product.price * quantity;
    }

    const pairs = Math.floor(quantity / 2);
    const singles = quantity % 2;
    return (pairs * product.bundle_price_2) + (singles * product.price);
  };

  const { totalHardware, totalSubscription, selectedCount, totalKiosks } = useMemo(() => {
    let hardware = 0;
    let subscription = 0;
    let count = 0;
    let kiosks = 0;

    selectedProducts.forEach(({ product, quantity, isSelected }) => {
      if (isSelected) {
        if (product.exclusive_group === 'q1_kiosks') {
          hardware += calculateQ1Price(product, quantity);
          kiosks += quantity;
        } else if (!['QHUB AI', 'Extended Warranty', 'Delivery to West Malaysia', 'Delivery to East Malaysia', 'Onsite Installation'].includes(product.name)) {
          hardware += product.price * quantity;
        }
        if (product.name !== 'QHUB AI' && product.name !== 'Extended Warranty') {
          subscription += product.subscription_price * quantity;
        }
        count++;
      }
    });

    const qhubAI = products.find(p => p.name === 'QHUB AI');
    const isQhubSelected = Array.from(selectedProducts.values()).some(sp => sp.product.name === 'QHUB AI' && sp.isSelected);
    if (qhubAI && isQhubSelected && kiosks > 0) {
      if (kiosks === 1) {
        subscription += qhubAI.subscription_price;
      } else {
        subscription += qhubAI.subscription_price + (69 * (kiosks - 1));
      }
    }

    if (kiosks > 1) {
      const additionalLicense = products.find(p => p.name === 'Additional Kiosk License');
      if (additionalLicense) {
        subscription += (kiosks - 1) * additionalLicense.subscription_price;
      }
    }

    const extendedWarranty = Array.from(selectedProducts.values()).find(sp => sp.product.name === 'Extended Warranty');
    if (extendedWarranty && extendedWarranty.isSelected && kiosks > 0) {
      hardware += 600 * kiosks;
    }

    const westMalaysiaDelivery = Array.from(selectedProducts.values()).find(sp => sp.product.name === 'Delivery to West Malaysia');
    if (westMalaysiaDelivery && westMalaysiaDelivery.isSelected && westMalaysiaDelivery.product.price > 0 && kiosks > 0) {
      hardware += westMalaysiaDelivery.product.price;
    }

    const eastMalaysiaDelivery = Array.from(selectedProducts.values()).find(sp => sp.product.name === 'Delivery to East Malaysia');
    if (eastMalaysiaDelivery && eastMalaysiaDelivery.isSelected && eastMalaysiaDelivery.product.price > 0 && kiosks > 0) {
      hardware += eastMalaysiaDelivery.product.price;
    }

    const onsiteInstallation = Array.from(selectedProducts.values()).find(sp => sp.product.name === 'Onsite Installation');
    if (onsiteInstallation && onsiteInstallation.isSelected && onsiteInstallation.product.price > 0 && kiosks > 0) {
      hardware += onsiteInstallation.product.price;
    }

    return {
      totalHardware: hardware,
      totalSubscription: subscription,
      selectedCount: count,
      totalKiosks: kiosks,
    };
  }, [selectedProducts, products]);

  const groupedProducts = useMemo(() => {
    const groups: Record<string, Product[]> = {
      'Cloud Platform': [],
      'Kiosks': [],
      'POS Systems': [],
      'Kitchen & Display': [],
      'Tablets': [],
      'Printers': [],
      'Payment': [],
      'Access Control': [],
      'Retail': [],
      'Subscriptions': [],
      'Delivery': [],
      'After-Sales': [],
    };

    products.forEach((product) => {
      if (product.exclusive_group === 'delivery_options') {
        groups['Delivery'].push(product);
      } else if (product.subcategory === 'after-sales') {
        groups['After-Sales'].push(product);
      } else if (product.category === 'subscription') {
        groups['Subscriptions'].push(product);
      } else if (product.subcategory === 'platform') {
        groups['Cloud Platform'].push(product);
      } else if (product.subcategory === 'kiosk') {
        groups['Kiosks'].push(product);
      } else if (product.subcategory === 'pos') {
        groups['POS Systems'].push(product);
      } else if (product.subcategory === 'kitchen' || product.subcategory === 'display') {
        groups['Kitchen & Display'].push(product);
      } else if (product.subcategory === 'tablet') {
        groups['Tablets'].push(product);
      } else if (product.subcategory === 'printer') {
        groups['Printers'].push(product);
      } else if (product.subcategory === 'payment') {
        groups['Payment'].push(product);
      } else if (product.subcategory === 'access' || product.subcategory === 'wristband') {
        groups['Access Control'].push(product);
      } else if (product.subcategory === 'retail') {
        groups['Retail'].push(product);
      }
    });

    Object.keys(groups).forEach((key) => {
      if (groups[key].length === 0) delete groups[key];
    });

    return groups;
  }, [products]);

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
      setSubmitting(true);

      const selectedProductsArray = Array.from(selectedProducts.values())
        .filter((sp) => sp.isSelected)
        .map((sp) => ({
          product_id: sp.product.id,
          product_name: sp.product.name,
          quantity: sp.quantity,
          unit_price: sp.product.price,
          unit_subscription: sp.product.subscription_price,
          total_price: sp.product.price * sp.quantity,
          total_subscription: sp.product.subscription_price * sp.quantity,
        }));

      const orderData = {
        industry_id: industry.id,
        total_price: totalHardware,
        selected_products: selectedProductsArray,
        contact_name: contactInfo.name,
        contact_email: contactInfo.email,
        contact_mobile: `${contactInfo.countryCode}${contactInfo.mobile}`,
        company_name: deliveryInfo.companyName,
        brand_name: deliveryInfo.brandName || null,
        address: deliveryInfo.address,
        zipcode: deliveryInfo.zipcode,
        state: deliveryInfo.state,
        country: deliveryInfo.country,
        notes: deliveryInfo.notes || null,
        payment_method: paymentMethod
      };

      const { data, error } = await supabase.functions.invoke('submit-order', {
        body: orderData,
      });

      if (error) throw error;

      if (data) {
        setReferenceNumber(data.reference_number);
        setCurrentStep('thankyou');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      setError('Error submitting order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
        <div className="text-white text-2xl font-black uppercase">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-0 md:p-4 overflow-hidden">
      <div className="bg-white w-full h-full md:max-w-[1800px] md:max-h-[95vh] md:rounded-none flex flex-col border-0 md:border border-gray-300">
        <div className="bg-black text-white p-3 md:p-6 flex items-center justify-between border-b border-gray-300">
          <div>
            <h2 className="text-lg md:text-2xl font-black uppercase">
              {currentStep === 'configurator' && 'Configure Your QBot System'}
              {currentStep === 'contact' && 'Contact Information'}
              {currentStep === 'delivery' && 'Delivery Details'}
              {currentStep === 'review' && 'Review Your Order'}
              {currentStep === 'thankyou' && 'Order Confirmed'}
            </h2>
            <p className="text-xs md:text-sm font-bold text-gray-300 uppercase mt-1">Industry: {industry.name}</p>
          </div>
          {currentStep !== 'thankyou' && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:text-black transition-colors duration-200"
            >
              <X size={24} strokeWidth={3} className="md:w-7 md:h-7" />
            </button>
          )}
        </div>

        {currentStep === 'configurator' && (
          <div className="flex-1 overflow-y-auto md:overflow-hidden flex flex-col md:flex-row">
          <div className="flex-shrink-0 md:flex-1 overflow-visible md:overflow-y-auto p-3 md:p-6 md:border-r border-gray-300">
            <h3 className="text-base md:text-xl font-black uppercase mb-3 md:mb-6">Select Products & Services</h3>

            {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
              <div key={category} className="mb-4 md:mb-8">
                <h4 className="text-sm md:text-lg font-black uppercase mb-2 md:mb-4 text-gray-700">{category}</h4>

                {category === 'Kiosks' ? (
                  <div className="space-y-6">
                    <p className="text-xs font-bold text-gray-600 uppercase mb-4">Select one kiosk type (Choose quantity below)</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                      {categoryProducts.filter(p => p.exclusive_group === 'q1_kiosks').map((product) => {
                        const selected = selectedProducts.get(product.id);
                        const isSelected = selected?.isSelected || false;
                        const quantity = selected?.quantity || 1;
                        const calculatedPrice = isSelected ? calculateQ1Price(product, quantity) : product.price;

                        return (
                          <div
                            key={product.id}
                            className={`border-2 transition-all duration-200 relative cursor-pointer ${
                              isSelected
                                ? 'border-black bg-white shadow-lg'
                                : 'border-gray-300 hover:border-gray-400 bg-white'
                            }`}
                            onClick={() => toggleProduct(product)}
                          >
                            <div className="p-3 md:p-4">
                              <div className="flex items-start gap-2 mb-3">
                                <div className="flex-shrink-0 mt-1">
                                  <div
                                    className={`w-5 h-5 md:w-6 md:h-6 border-2 flex items-center justify-center transition-all ${
                                      isSelected ? 'border-black bg-black' : 'border-gray-300 bg-white'
                                    }`}
                                  >
                                    {isSelected && <Check size={14} strokeWidth={3} className="text-white md:w-4 md:h-4" />}
                                  </div>
                                </div>
                                <h5 className="font-black text-xs md:text-sm uppercase leading-tight">{product.name}</h5>
                              </div>

                              {product.thumbnail_url && (
                                <div className="mb-3">
                                  <img
                                    src={product.thumbnail_url}
                                    alt={product.name}
                                    className="w-full h-32 md:h-40 object-contain"
                                  />
                                </div>
                              )}

                              {product.description && (
                                <p className="text-[10px] md:text-xs text-gray-600 mb-3 leading-tight line-clamp-3">
                                  {product.description}
                                </p>
                              )}

                              <div className="mb-3">
                                <span className="text-base md:text-lg font-black">
                                  RM {formatPrice(product.price)}
                                </span>
                                {product.subscription_price > 0 && (
                                  <span className="text-[10px] md:text-xs font-bold text-gray-600 uppercase ml-2">
                                    + RM {formatPrice(product.subscription_price)}/mo
                                  </span>
                                )}
                              </div>

                              {isSelected && product.bundle_price_2 && (
                                <div className="bg-yellow-100 border-2 border-yellow-400 p-2 mb-3">
                                  <p className="text-[10px] md:text-xs font-black uppercase text-center text-yellow-900">
                                    Bundle: 2 Units for RM {formatPrice(product.bundle_price_2)}
                                  </p>
                                </div>
                              )}

                              {isSelected && (
                                <div className="relative">
                                  {(quantity === 2 || quantity === 4) && product.bundle_price_2 && (
                                    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
                                      {[...Array(15)].map((_, i) => (
                                        <div
                                          key={i}
                                          className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                                          style={{
                                            left: `${Math.random() * 100}%`,
                                            top: '-10px',
                                            animation: `confetti ${1 + Math.random()}s ease-out ${Math.random() * 0.5}s`,
                                          }}
                                        />
                                      ))}
                                    </div>
                                  )}
                                  <div
                                    className="flex items-center justify-center gap-2 md:gap-3"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      onClick={() => updateQuantity(product.id, -1)}
                                      className="w-7 h-7 md:w-8 md:h-8 border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 font-black"
                                      disabled={quantity <= 1}
                                    >
                                      <Minus size={14} className="md:w-4 md:h-4" />
                                    </button>
                                    <span className="text-sm md:text-base font-black w-8 md:w-10 text-center">{quantity}</span>
                                    <button
                                      onClick={() => updateQuantity(product.id, 1)}
                                      className="w-7 h-7 md:w-8 md:h-8 border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 font-black disabled:opacity-50 disabled:cursor-not-allowed"
                                      disabled={product.exclusive_group === 'q1_kiosks' && quantity >= 4}
                                    >
                                      <Plus size={14} className="md:w-4 md:h-4" />
                                    </button>
                                  </div>
                                  {quantity % 2 === 0 && product.bundle_price_2 && quantity >= 2 && (
                                    <div className="mt-2 md:mt-3 bg-[#ff8005] text-white p-2 text-center">
                                      <p className="text-[10px] md:text-xs font-black uppercase">
                                        Bundle Price Applied! Saved RM {formatPrice((product.price * quantity) - calculateQ1Price(product, quantity))}
                                      </p>
                                    </div>
                                  )}
                                  {quantity % 2 === 1 && product.bundle_price_2 && quantity >= 1 && (
                                    <div className="mt-2 md:mt-3 text-center">
                                      <p className="text-[10px] md:text-xs font-black uppercase text-[#ff8005]">
                                        Buy 1 more to save RM {formatPrice(calculateQ1Price(product, quantity) - calculateQ1Price(product, quantity + 1) + (product.price))}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {categoryProducts.filter(p => p.exclusive_group !== 'q1_kiosks').length > 0 && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
                        {categoryProducts.filter(p => p.exclusive_group !== 'q1_kiosks').map((product) => {
                          const selected = selectedProducts.get(product.id);
                          const isSelected = selected?.isSelected || false;
                          const quantity = selected?.quantity || 1;

                          return (
                            <div
                              key={product.id}
                              className={`border p-4 transition-all duration-200 ${
                                product.is_mandatory ? 'cursor-default' : 'cursor-pointer'
                              } ${
                                isSelected
                                  ? 'border-gray-400 bg-gray-50'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                              onClick={() => !product.is_mandatory && toggleProduct(product)}
                            >
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                  <div
                                    className={`w-6 h-6 border-2 flex items-center justify-center transition-all ${
                                      product.is_mandatory
                                        ? 'border-black bg-black'
                                        : isSelected
                                        ? 'border-black bg-black'
                                        : 'border-gray-300 bg-white'
                                    }`}
                                  >
                                    {isSelected && !product.is_mandatory && <Check size={16} strokeWidth={3} className="text-white" />}
                                  </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                  <h5 className="font-black text-sm uppercase mb-1">{product.name}</h5>
                                  {product.description && (
                                    <p className="text-xs text-gray-600 mb-2 leading-tight">
                                      {product.description}
                                    </p>
                                  )}

                                  <div className="flex items-center gap-4 flex-wrap">
                                    {product.price > 0 && (
                                      <span className="text-sm font-black">
                                        RM {formatPrice(product.price)}
                                      </span>
                                    )}
                                    {product.subscription_price > 0 && (
                                      <span className="text-xs font-bold text-gray-600 uppercase">
                                        + RM {formatPrice(product.subscription_price)}/mo
                                      </span>
                                    )}
                                  </div>

                                  {isSelected && !product.is_mandatory && (
                                    <div
                                      className="flex items-center gap-2 mt-3"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <button
                                        onClick={() => updateQuantity(product.id, -1)}
                                        className="w-7 h-7 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                        disabled={quantity <= 1}
                                      >
                                        <Minus size={14} />
                                      </button>
                                      <span className="text-sm font-black w-8 text-center">{quantity}</span>
                                      <button
                                        onClick={() => updateQuantity(product.id, 1)}
                                        className="w-7 h-7 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                      >
                                        <Plus size={14} />
                                      </button>
                                    </div>
                                  )}
                                  {product.is_mandatory && isSelected && (
                                    <div className="mt-3">
                                      <span className="text-xs font-bold text-gray-600">
                                        Quantity: {quantity} unit{quantity > 1 ? 's' : ''}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {categoryProducts.map((product) => {
                      const selected = selectedProducts.get(product.id);
                      const isSelected = selected?.isSelected || false;
                      const quantity = selected?.quantity || 1;

                      if (product.auto_add_trigger === 'kiosk_count_gt_1') {
                        return null;
                      }

                      return (
                        <div
                          key={product.id}
                          className={`border p-4 transition-all duration-200 ${
                            product.is_mandatory ? 'cursor-default' : 'cursor-pointer'
                          } ${
                            isSelected
                              ? 'border-gray-400 bg-gray-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          onClick={() => !product.is_mandatory && toggleProduct(product)}
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div
                                className={`w-6 h-6 border-2 flex items-center justify-center transition-all ${
                                  product.is_mandatory
                                    ? 'border-black bg-black'
                                    : isSelected
                                      ? 'border-black bg-black'
                                      : 'border-gray-300 bg-white'
                                }`}
                              >
                                {isSelected && !product.is_mandatory && <Check size={16} strokeWidth={3} className="text-white" />}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <h5 className="font-black text-sm uppercase mb-1">
                                {product.name}
                              </h5>
                              {product.description && (
                                <p className="text-xs text-gray-600 mb-2 leading-tight">
                                  {product.description}
                                </p>
                              )}

                              <div className="flex items-center gap-4 flex-wrap">
                                {product.original_price && product.original_price > 0 && (
                                  <span className="text-sm font-black text-gray-400 line-through">
                                    RM {formatPrice(product.original_price)}
                                  </span>
                                )}
                                {product.price > 0 ? (
                                  <span className="text-sm font-black">
                                    RM {formatPrice(product.price)}
                                  </span>
                                ) : product.price === 0 && product.original_price && (
                                  <span className="text-sm font-black text-[#ff8005]">
                                    RM {formatPrice(0)}
                                  </span>
                                )}
                                {product.subscription_price > 0 && (
                                  <span className="text-xs font-bold text-gray-600 uppercase">
                                    + RM {formatPrice(product.subscription_price)}/mo
                                  </span>
                                )}
                              </div>

                              {product.name === 'QHUB AI' && isSelected && quantity > 1 && (
                                <div className="bg-yellow-100 border-2 border-yellow-400 p-3 mt-3">
                                  <p className="text-xs font-black uppercase text-center text-yellow-900">
                                    {quantity} KIOSK LICENSE
                                  </p>
                                  <p className="text-xs text-center text-yellow-800 mt-1">
                                    1st unit: RM {formatPrice(product.subscription_price)}/mo
                                  </p>
                                  <p className="text-xs text-center text-yellow-800">
                                    Units 2-{quantity}: RM 69.00/mo each
                                  </p>
                                  <p className="text-xs font-black text-center text-yellow-900 mt-1">
                                    Total: RM {formatPrice(product.subscription_price + (69 * (quantity - 1)))}/mo
                                  </p>
                                </div>
                              )}

                              {isSelected && !product.is_mandatory && !['Extended Warranty', 'Delivery to West Malaysia', 'Delivery to East Malaysia', 'Onsite Installation', 'Turnstile Face-ID Addon'].includes(product.name) && (
                                <div
                                  className="flex items-center gap-2 mt-3"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    onClick={() => updateQuantity(product.id, -1)}
                                    className="w-7 h-7 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                    disabled={quantity <= 1}
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="text-sm font-black w-8 text-center">{quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(product.id, 1)}
                                    className="w-7 h-7 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                              )}
                              {(product.is_mandatory || ['Extended Warranty'].includes(product.name)) && isSelected && (
                                <div className="mt-3">
                                  <span className="text-xs font-bold text-gray-600">
                                    Quantity: {quantity} unit{quantity > 1 ? 's' : ''}
                                  </span>
                                </div>
                              )}
                              {['Delivery to West Malaysia', 'Delivery to East Malaysia', 'Onsite Installation'].includes(product.name) && isSelected && (
                                <div className="mt-3">
                                  <span className="text-xs font-bold text-gray-600">
                                    Quantity: 1 unit (applied once)
                                  </span>
                                </div>
                              )}
                              {product.name === 'Turnstile Face-ID Addon' && isSelected && (
                                <div className="mt-3">
                                  <span className="text-xs font-bold text-gray-600">
                                    Quantity: {quantity} unit{quantity > 1 ? 's' : ''} (follows turnstile count)
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex-shrink-0 w-full md:w-[450px] bg-gray-50 p-3 pb-20 md:p-6 overflow-visible md:overflow-y-auto border-t border-gray-300 md:border-t-0 md:border-l">
            <div className="bg-white border border-gray-300 p-3 md:p-6 mb-4 md:mb-6">
              <h3 className="text-base md:text-xl font-black uppercase mb-3 md:mb-4 flex items-center gap-2">
                <ShoppingCart size={18} className="md:w-5 md:h-5" />
                Configuration Summary
              </h3>

              <div className="mb-4 md:mb-6">
                <p className="text-xs md:text-sm font-bold text-gray-600 uppercase mb-3 md:mb-4">
                  {selectedCount} {selectedCount === 1 ? 'Item' : 'Items'} Selected
                </p>

                {selectedCount > 0 ? (
                  <div className="space-y-2 md:space-y-3 max-h-none md:max-h-64 overflow-visible md:overflow-y-auto mb-4 md:mb-6 border-t border-gray-300 pt-3 md:pt-4">
                    {Array.from(selectedProducts.values())
                      .filter((sp) => sp.isSelected)
                      .sort((a, b) => {
                        // Kiosks first
                        if (a.product.exclusive_group === 'q1_kiosks' && b.product.exclusive_group !== 'q1_kiosks') return -1;
                        if (a.product.exclusive_group !== 'q1_kiosks' && b.product.exclusive_group === 'q1_kiosks') return 1;

                        // Delivery items last
                        const aIsDelivery = ['Delivery to West Malaysia', 'Delivery to East Malaysia'].includes(a.product.name);
                        const bIsDelivery = ['Delivery to West Malaysia', 'Delivery to East Malaysia'].includes(b.product.name);
                        if (aIsDelivery && !bIsDelivery) return 1;
                        if (!aIsDelivery && bIsDelivery) return -1;

                        return 0;
                      })
                      .map(({ product, quantity }) => {
                        let itemPrice = 0;
                        let subscriptionPrice = 0;
                        let itemDescription = '';

                        if (product.exclusive_group === 'q1_kiosks') {
                          itemPrice = calculateQ1Price(product, quantity);
                          const savings = (product.price * quantity) - itemPrice;
                          if (quantity > 1 && product.bundle_price_2 && savings > 0) {
                            itemDescription = `Bundle discount: Save RM ${formatPrice(savings)}`;
                          }
                        } else if (product.name === 'Extended Warranty') {
                          itemPrice = 600 * quantity;
                          if (quantity > 1) {
                            itemDescription = `RM 600 × ${quantity} units`;
                          }
                        } else if (['Delivery to West Malaysia', 'Delivery to East Malaysia', 'Onsite Installation'].includes(product.name)) {
                          itemPrice = product.price;
                          itemDescription = 'Applied once regardless of quantity';
                        } else if (product.name !== 'QHUB AI') {
                          itemPrice = product.price * quantity;
                          subscriptionPrice = product.subscription_price * quantity;
                        }

                        if (product.name === 'QHUB AI') {
                          return null;
                        }

                        const displayQuantity = ['Delivery to West Malaysia', 'Delivery to East Malaysia', 'Onsite Installation'].includes(product.name) ? 1 : quantity;

                        return (
                          <div key={product.id} className="flex justify-between items-start text-xs">
                            <div className="flex-1 pr-2">
                              <p className="font-bold uppercase leading-tight">{product.name} x{displayQuantity}</p>
                              {itemDescription && (
                                <p className="text-[#ff8005] mt-1 text-[10px] font-bold">
                                  {itemDescription}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              {itemPrice > 0 && (
                                <p className="font-black">RM {formatPrice(itemPrice)}</p>
                              )}
                              {subscriptionPrice > 0 && (
                                <p className="text-gray-600 font-bold">
                                  +RM {formatPrice(subscriptionPrice)}/mo
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}

                    {totalKiosks > 0 && (
                      <div className="flex justify-between items-start text-xs border-t border-gray-200 pt-3 mt-3">
                        <div className="flex-1 pr-2">
                          <p className="font-bold uppercase leading-tight">QHUB AI</p>
                          <p className="text-gray-600 mt-1 italic text-[10px]">
                            {totalKiosks === 1
                              ? 'Cloud platform included (Mandatory)'
                              : `1st unit: RM 129/mo + ${totalKiosks - 1} additional unit${totalKiosks > 2 ? 's' : ''}: RM 69/mo each`
                            }
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-600 font-bold">
                            +RM {formatPrice(totalKiosks === 1 ? 129 : 129 + (69 * (totalKiosks - 1)))}/mo
                          </p>
                        </div>
                      </div>
                    )}

                    {totalKiosks > 1 && (
                      <div className="flex justify-between items-start text-xs border-t border-gray-200 pt-3 mt-3">
                        <div className="flex-1 pr-2">
                          <p className="font-bold uppercase leading-tight">Additional Kiosk License</p>
                          <p className="text-gray-600 mt-1 italic text-[10px]">
                            Auto-added (×{totalKiosks - 1})
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-600 font-bold">
                            +RM {formatPrice((totalKiosks - 1) * (products.find(p => p.name === 'Additional Kiosk License')?.subscription_price || 69))}/mo
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic mb-6 border-t border-gray-300 pt-4">
                    No products selected
                  </p>
                )}
              </div>

              <div className="border-t-2 border-gray-300 pt-3 md:pt-4 space-y-2 md:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs md:text-sm font-bold uppercase">Hardware Total:</span>
                  <span className="text-base md:text-lg font-black">RM {formatPrice(totalHardware)}</span>
                </div>

                {totalSubscription > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm font-bold uppercase">Monthly:</span>
                    <span className="text-base md:text-lg font-black">RM {formatPrice(totalSubscription)}/mo</span>
                  </div>
                )}

                <div className="border-t-2 border-black pt-2 md:pt-3 mt-2 md:mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm md:text-base font-black uppercase">Total Investment:</span>
                    <span className="text-xl md:text-2xl font-black">RM {formatPrice(totalHardware)}</span>
                  </div>
                  {totalSubscription > 0 && (
                    <p className="text-[10px] md:text-xs text-gray-600 text-right mt-1 font-bold">
                      + RM {formatPrice(totalSubscription)}/month
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-300 p-3 md:p-6 space-y-3 md:space-y-4">
              <h4 className="text-sm md:text-lg font-black uppercase mb-3 md:mb-4">Payment Method</h4>

              <div
                onClick={() => setPaymentMethod('onetime')}
                className={`flex justify-between items-center py-2 md:py-3 border-2 cursor-pointer transition-all ${
                  paymentMethod === 'onetime' ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-3">
                  <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'onetime' ? 'border-black' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'onetime' && <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-black" />}
                  </div>
                  <Wallet size={16} className="text-gray-700 md:w-[18px] md:h-[18px]" />
                  <span className="text-xs md:text-sm font-bold uppercase">One-time Payment</span>
                </div>
                <span className="text-base md:text-xl font-black pr-2 md:pr-3">RM {formatPrice(totalHardware)}</span>
              </div>

              <div
                onClick={() => setPaymentMethod('installment')}
                className={`flex justify-between items-center py-2 md:py-3 border-2 cursor-pointer transition-all ${
                  paymentMethod === 'installment' ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-3">
                  <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'installment' ? 'border-black' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'installment' && <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-black" />}
                  </div>
                  <CreditCard size={16} className="text-gray-700 md:w-[18px] md:h-[18px]" />
                  <span className="text-xs md:text-sm font-bold uppercase">0% Interest 12 Months</span>
                </div>
                <span className="text-base md:text-xl font-black pr-2 md:pr-3">RM {formatPrice(totalHardware / 12)}/mo</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep('contact')}
              disabled={selectedCount === 0}
              className="w-full py-3 md:py-4 bg-black text-white text-sm md:text-base font-black uppercase border border-gray-300 hover:bg-white hover:text-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>Confirm</span>
              <Check size={18} strokeWidth={3} className="md:w-5 md:h-5" />
            </button>

            <p className="text-[10px] md:text-xs text-gray-600 text-center mt-2 md:mt-4 leading-relaxed">
              Review your configuration and proceed to checkout.
            </p>
          </div>
        </div>
        )}

        {currentStep === 'contact' && (
          <div className="flex-1 overflow-y-auto p-8">
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
                <div className="flex gap-2">
                  <select
                    value={contactInfo.countryCode}
                    onChange={(e) => setContactInfo({ ...contactInfo, countryCode: e.target.value })}
                    className="border border-gray-300 px-4 py-3 font-bold"
                  >
                    <option value="+60">🇲🇾 +60</option>
                    <option value="+65">🇸🇬 +65</option>
                    <option value="+62">🇮🇩 +62</option>
                    <option value="+66">🇹🇭 +66</option>
                    <option value="+84">🇻🇳 +84</option>
                    <option value="+63">🇵🇭 +63</option>
                    <option value="+86">🇨🇳 +86</option>
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+1">🇺🇸 +1</option>
                  </select>
                  <input
                    type="tel"
                    value={contactInfo.mobile}
                    onChange={(e) => setContactInfo({ ...contactInfo, mobile: e.target.value })}
                    className="flex-1 border border-gray-300 px-4 py-3 font-bold"
                    placeholder="123456789"
                  />
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
                onClick={() => setCurrentStep('configurator')}
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
        )}

        {currentStep === 'delivery' && (
          <div className="flex-1 overflow-y-auto p-8">
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
        )}

        {currentStep === 'review' && (
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-black uppercase mb-6">Review Your Order</h3>

              <div className="space-y-6">
                <div className="border border-gray-300 p-4">
                  <h4 className="font-black uppercase mb-3">Selected Products</h4>
                  <div className="space-y-2 text-sm">
                    {Array.from(selectedProducts.values())
                      .filter(sp => sp.isSelected)
                      .map(sp => {
                        let itemPrice = 0;
                        const displayQuantity = ['Delivery to West Malaysia', 'Delivery to East Malaysia', 'Onsite Installation'].includes(sp.product.name) ? 1 : sp.quantity;

                        if (sp.product.exclusive_group === 'q1_kiosks') {
                          itemPrice = calculateQ1Price(sp.product, sp.quantity);
                        } else if (sp.product.name === 'Extended Warranty') {
                          itemPrice = 600 * sp.quantity;
                        } else if (['Delivery to West Malaysia', 'Delivery to East Malaysia', 'Onsite Installation'].includes(sp.product.name)) {
                          itemPrice = sp.product.price;
                        } else if (sp.product.name !== 'QHUB AI') {
                          itemPrice = sp.product.price * sp.quantity;
                        }

                        if (sp.product.name === 'QHUB AI') {
                          return null;
                        }

                        return (
                          <div key={sp.product.id} className="flex justify-between">
                            <span className="font-bold">{sp.product.name} x{displayQuantity}</span>
                            <span className="text-gray-600">RM {formatPrice(itemPrice)}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <div className="border border-gray-300 p-4">
                  <h4 className="font-black uppercase mb-3">Total Hardware Cost</h4>
                  <p className="text-2xl font-black">RM {formatPrice(totalHardware)}</p>
                </div>

                {totalSubscription > 0 && (
                  <div className="border border-gray-300 p-4">
                    <h4 className="font-black uppercase mb-3">Monthly Subscription</h4>
                    <div className="space-y-2 text-sm">
                      {Array.from(selectedProducts.values())
                        .filter(sp => sp.isSelected && sp.product.subscription_price > 0 && sp.product.name !== 'QHUB AI')
                        .map(sp => (
                          <div key={sp.product.id} className="flex justify-between">
                            <span className="font-bold">{sp.product.name} x{sp.quantity}</span>
                            <span className="text-gray-600">RM {formatPrice(sp.product.subscription_price * sp.quantity)}/mo</span>
                          </div>
                        ))}
                      {Array.from(selectedProducts.values()).some(sp => sp.isSelected && sp.product.name === 'QHUB AI') && totalKiosks > 0 && (
                        <div className="flex justify-between">
                          <span className="font-bold">QHUB AI x{totalKiosks}</span>
                          <span className="text-gray-600">
                            RM {formatPrice(
                              totalKiosks === 1
                                ? (Array.from(selectedProducts.values()).find(sp => sp.product.name === 'QHUB AI')?.product.subscription_price || 0)
                                : (Array.from(selectedProducts.values()).find(sp => sp.product.name === 'QHUB AI')?.product.subscription_price || 0) + (69 * (totalKiosks - 1))
                            )}/mo
                          </span>
                        </div>
                      )}
                      {totalKiosks > 1 && (
                        <div className="flex justify-between">
                          <span className="font-bold">Additional Kiosk License x{totalKiosks - 1}</span>
                          <span className="text-gray-600">RM {formatPrice((totalKiosks - 1) * (products.find(p => p.name === 'Additional Kiosk License')?.subscription_price || 0))}/mo</span>
                        </div>
                      )}
                      <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between">
                        <span className="font-black">Monthly Total:</span>
                        <span className="font-black">RM {formatPrice(totalSubscription)}/mo</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border border-gray-300 p-4">
                  <h4 className="font-black uppercase mb-3">Payment Method</h4>
                  <p className="text-sm font-bold">
                    {paymentMethod === 'onetime' ? 'One-time Payment' : '0% Interest 12 Months Installment'}
                  </p>
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
                  disabled={submitting}
                  className="flex-1 py-4 bg-black text-white font-black uppercase border border-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? 'Submitting...' : 'Confirm Order'}
                  <Check size={20} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'thankyou' && (
          <div className="flex-1 overflow-y-auto p-8 text-center">
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
        )}
      </div>
    </div>
  );
}
