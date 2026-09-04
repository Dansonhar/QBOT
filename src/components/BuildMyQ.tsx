import { useState, useEffect } from 'react';
import { Scissors, UtensilsCrossed, Car, Building, Dumbbell, ShoppingBag, Briefcase, ParkingCircle, Tablet, Sparkles, Stethoscope, GraduationCap, BookOpen, Film, CalendarDays, Landmark, Bus, Building2, Gift, Ticket } from 'lucide-react';
import ProductConfigurator from './ProductConfigurator';
import { IndustryType } from '../types/configurator';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const industryIcons: Record<string, any> = {
  salon: Scissors,
  fnb: UtensilsCrossed,
  carwash: Car,
  hotel: Building,
  court: Dumbbell,
  retail: ShoppingBag,
  coworking: Briefcase,
  parking: ParkingCircle,
  'tablet-fnb': Tablet,
  wellness: Sparkles,
  gym: Dumbbell,
  themepark: Ticket,
  property: Building2,
};

export default function BuildMyQ() {
  const [industries, setIndustries] = useState<IndustryType[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIndustries();
  }, []);

  const loadIndustries = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-industries');
      if (error) throw error;
      setIndustries(data || []);
    } catch (error) {
      console.error('Error loading industries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIndustryClick = (industry: IndustryType) => {
    setSelectedIndustry(industry);
  };

  return (
    <>
      <section id="build-my-q" className="relative py-12 md:py-24 bg-black border-t border-gray-300">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 md:mb-16 text-center">
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-4 md:mb-6 uppercase">
              Build My QBot
            </h2>
            <p className="text-base md:text-xl lg:text-2xl font-bold text-white uppercase mb-2 md:mb-4">
              Select Your Industry.
            </p>
            <p className="text-base md:text-xl lg:text-2xl font-bold text-white uppercase">
              See What QBot Automates.
            </p>
            <p className="text-sm md:text-base font-bold text-gray-300 uppercase mt-4 md:mt-6 max-w-3xl mx-auto">
              Choose your industry and visualize how QBot saves staff, grows sales, and automates
              operations instantly.
            </p>
          </div>

          {loading ? (
            <div className="text-center text-white text-base md:text-xl font-bold uppercase mb-8 md:mb-16">
              Loading industries...
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mb-8 md:mb-16">
              {industries.map((industry) => {
                const Icon = industryIcons[industry.slug];
                return (
                  <button
                    key={industry.id}
                    onClick={() => handleIndustryClick(industry)}
                    className="group bg-white border border-gray-300 hover:border-gray-400 transition-all duration-300 hover:shadow-xl overflow-hidden"
                  >
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-b border-gray-300 group-hover:border-gray-400 transition-colors">
                      {Icon && <Icon size={48} strokeWidth={2} className="text-black md:w-16 md:h-16" />}
                    </div>
                    <div className="p-3 md:p-6">
                      <h3 className="text-sm md:text-lg font-black text-black mb-1 md:mb-2 uppercase">
                        {industry.name}
                      </h3>
                      <p className="text-xs font-bold text-gray-700 uppercase hidden md:block">
                        Configure Your System
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="bg-white border border-gray-300 p-6 md:p-16">
            <h3 className="text-2xl md:text-4xl lg:text-5xl font-black text-black mb-4 md:mb-8 uppercase text-center">
              TIME TO UPGRADE YOUR BUSINESS
            </h3>
            <div className="text-center">
              <a
                href="#"
                className="inline-block bg-black text-white px-6 md:px-12 py-4 md:py-6 font-black text-sm md:text-lg uppercase border border-gray-300 hover:bg-white hover:text-black transition-colors duration-200"
              >
                VIEW DEMO IN PUBLIKA KL
              </a>
            </div>
          </div>
        </div>
      </section>

      {selectedIndustry && (
        <ProductConfigurator
          industry={selectedIndustry}
          onClose={() => setSelectedIndustry(null)}
        />
      )}
    </>
  );
}
