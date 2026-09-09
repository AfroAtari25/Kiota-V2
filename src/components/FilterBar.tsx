import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, SlidersHorizontal, Map, List, X, MapPin, DollarSign } from 'lucide-react';

const POPULAR_AREAS = [
  'All Areas',
  'Kilimani, Nairobi',
  'Westlands, Nairobi',
  'Roysambu (TRM Drive), Nairobi',
  'South B (Hazina), Nairobi',
  'CBD (Moi Avenue), Nairobi',
  'Karen, Nairobi',
  'Nyali, Mombasa',
  'Ruaka, Kiambu',
];

export const FilterBar: React.FC = () => {
  const {
    searchArea,
    setSearchArea,
    budgetRange,
    setBudgetRange,
    viewMode,
    setViewMode,
  } = useApp();

  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [maxBudget, setMaxBudget] = useState(budgetRange[1]);

  const handleApplyFilter = () => {
    setBudgetRange([0, maxBudget]);
    setShowFiltersModal(false);
  };

  const handleResetFilter = () => {
    setMaxBudget(100000);
    setBudgetRange([0, 100000]);
    setSearchArea('');
    setShowFiltersModal(false);
  };

  const activeFiltersCount = (searchArea ? 1 : 0) + (budgetRange[1] < 100000 ? 1 : 0);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center space-x-2">
        {/* Area Search Input */}
        <div className="relative flex-1">
          <MapPin className="w-4 h-4 text-[#C1440E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchArea}
            onChange={(e) => setSearchArea(e.target.value)}
            placeholder="Search Area (e.g. Kilimani, Roysambu, Westlands)..."
            className="w-full bg-white border border-[#2B2118]/15 rounded-2xl pl-9.5 pr-8 py-2.5 text-xs font-semibold text-[#2B2118] placeholder-[#2B2118]/45 focus:outline-hidden focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] card-shadow transition-all"
          />
          {searchArea && (
            <button
              onClick={() => setSearchArea('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2B2118]/40 hover:text-[#2B2118]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Budget Filter Trigger Button */}
        <button
          id="btn-budget-filter"
          onClick={() => setShowFiltersModal(true)}
          className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-1.5 border transition-all card-shadow ${
            activeFiltersCount > 0
              ? 'bg-[#1B4332] text-white border-[#1B4332]'
              : 'bg-white text-[#2B2118] border-[#2B2118]/15 hover:bg-[#FBF3E7]'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Budget</span>
          {budgetRange[1] < 100000 && (
            <span className="text-[10px] bg-[#E8A33D] text-[#2B2118] px-1.5 py-0.2 rounded-md font-bold">
              &le; {(budgetRange[1] / 1000).toFixed(0)}k
            </span>
          )}
        </button>

        {/* View Mode Toggle: Leaflet Map vs List */}
        <div className="flex bg-white border border-[#2B2118]/15 rounded-2xl p-1 shrink-0 card-shadow">
          <button
            id="toggle-view-list"
            onClick={() => setViewMode('list')}
            title="List View"
            className={`p-1.5 rounded-xl transition-all ${
              viewMode === 'list'
                ? 'bg-[#C1440E] text-white shadow-xs'
                : 'text-[#2B2118]/60 hover:text-[#2B2118]'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            id="toggle-view-map"
            onClick={() => setViewMode('map')}
            title="Leaflet Map View"
            className={`p-1.5 rounded-xl transition-all ${
              viewMode === 'map'
                ? 'bg-[#C1440E] text-white shadow-xs'
                : 'text-[#2B2118]/60 hover:text-[#2B2118]'
            }`}
          >
            <Map className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Area Filter Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar text-[11px] font-medium pb-1">
        <span className="text-[#2B2118]/50 text-[10px] font-bold uppercase tracking-wider shrink-0 mr-1">
          Hotspots:
        </span>
        {POPULAR_AREAS.slice(1, 6).map((area) => {
          const simpleName = area.split(',')[0];
          const isSelected = searchArea === simpleName || searchArea === area;
          return (
            <button
              key={area}
              onClick={() => setSearchArea(isSelected ? '' : simpleName)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                isSelected
                  ? 'bg-[#1B4332] text-white font-bold'
                  : 'bg-white/60 hover:bg-white text-[#2B2118]/80 border border-[#2B2118]/10'
              }`}
            >
              {simpleName}
            </button>
          );
        })}
      </div>

      {/* Filter Modal */}
      {showFiltersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-[#FBF3E7] w-full max-w-md rounded-3xl border border-[#2B2118]/15 shadow-2xl overflow-hidden">
            <div className="p-5 bg-[#C1440E] text-white flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base">Filter by Budget & Area</h3>
                <p className="text-xs text-white/80">Tailor your space search in Kenya</p>
              </div>
              <button
                onClick={() => setShowFiltersModal(false)}
                className="p-1.5 rounded-full bg-black/20 hover:bg-black/30"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Budget Range Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-[#2B2118]">
                    Max Budget Limit
                  </label>
                  <span className="text-sm font-extrabold text-[#C1440E] bg-white px-2.5 py-0.5 rounded-lg border border-[#C1440E]/30">
                    KSh {maxBudget >= 100000 ? '100,000+' : maxBudget.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="2500"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full accent-[#C1440E] h-2 bg-neutral-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-bold text-[#2B2118]/50 mt-1">
                  <span>KSh 5,000</span>
                  <span>KSh 50,000</span>
                  <span>KSh 100,000+</span>
                </div>
              </div>

              {/* Preset Budget Chips */}
              <div>
                <label className="text-xs font-bold text-[#2B2118] block mb-2">
                  Quick Budget Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Under KSh 15,000 (Bedsitters)', val: 15000 },
                    { label: 'Under KSh 35,000 (1BR / Stalls)', val: 35000 },
                    { label: 'Under KSh 60,000 (2BR / Offices)', val: 60000 },
                    { label: 'Any Budget (All Spaces)', val: 100000 },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => setMaxBudget(preset.val)}
                      className={`py-2 px-2.5 rounded-xl text-[11px] font-bold text-left border transition-all ${
                        maxBudget === preset.val
                          ? 'bg-[#1B4332] text-white border-[#1B4332]'
                          : 'bg-white text-[#2B2118] border-[#2B2118]/15 hover:bg-neutral-50'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Area Quick Selector */}
              <div>
                <label className="text-xs font-bold text-[#2B2118] block mb-2">
                  Select Kenyan Region / Area
                </label>
                <select
                  value={searchArea}
                  onChange={(e) => setSearchArea(e.target.value === 'All Areas' ? '' : e.target.value)}
                  className="w-full bg-white border border-[#2B2118]/20 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-[#2B2118] focus:outline-hidden focus:border-[#C1440E]"
                >
                  {POPULAR_AREAS.map((a) => (
                    <option key={a} value={a === 'All Areas' ? '' : a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center space-x-3 pt-3 border-t border-[#2B2118]/10">
                <button
                  type="button"
                  onClick={handleResetFilter}
                  className="flex-1 py-3 rounded-2xl bg-white border border-[#2B2118]/20 text-xs font-bold text-[#2B2118] hover:bg-neutral-50"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleApplyFilter}
                  className="flex-1 py-3 rounded-2xl bg-[#C1440E] hover:bg-[#a53709] text-white text-xs font-bold shadow-md"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
