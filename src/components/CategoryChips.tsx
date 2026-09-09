import React from 'react';
import { useApp } from '../context/AppContext';
import { ListingCategory } from '../types';
import { Home, Store, Sparkles, LayoutGrid } from 'lucide-react';

export const CategoryChips: React.FC = () => {
  const { activeCategory, setActiveCategory } = useApp();

  const categories: { label: string; value: ListingCategory | 'All'; icon: React.FC<{ className?: string }> }[] = [
    { label: 'All Spaces', value: 'All', icon: LayoutGrid },
    { label: 'Rentals', value: 'Rentals', icon: Home },
    { label: 'Shops & Offices', value: 'Shops & Offices', icon: Store },
    { label: 'Airbnb / Stays', value: 'Airbnb', icon: Sparkles },
  ];

  return (
    <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1.5 px-1">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isSelected = activeCategory === cat.value;

        return (
          <button
            key={cat.value}
            id={`filter-chip-${cat.value.replace(/\s+/g, '-').toLowerCase()}`}
            onClick={() => setActiveCategory(cat.value)}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all duration-150 active:scale-95 ${
              isSelected
                ? 'bg-[#C1440E] text-white shadow-sm ring-2 ring-[#C1440E]/20'
                : 'bg-[#FBF3E7] text-[#2B2118] hover:bg-white border border-[#2B2118]/12'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#C1440E]'}`} />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
