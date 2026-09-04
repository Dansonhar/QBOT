import { Module } from '../types/module';

interface ModuleCardProps {
  module: Module;
  onLearnMore?: () => void;
}

export default function ModuleCard({ module }: ModuleCardProps) {
  return (
    <div className="bg-white border border-gray-300 hover:shadow-2xl transition-all duration-300 group">
      <div className="aspect-square w-full border-b border-gray-300 overflow-hidden">
        <img
          src={module.image}
          alt={module.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-black text-black uppercase mb-3 leading-tight">
          {module.name}
        </h3>

        <p className="text-sm md:text-base font-bold text-black leading-tight">
          {module.description}
        </p>
      </div>
    </div>
  );
}
