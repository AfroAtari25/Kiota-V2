import React from 'react';
import { useApp } from '../context/AppContext';
import { CategoryChips } from './CategoryChips';
import { FilterBar } from './FilterBar';
import { ListingCard } from './ListingCard';
import { LeafletMap } from './LeafletMap';
import { PlusCircle, Search, Sparkles, ShieldCheck } from 'lucide-react';

export const BrowseScreen: React.FC = () => {
  const {
    listings,
    activeCategory,
    searchArea,
    budgetRange,
    viewMode,
    openListingDetail,
    setActiveTab,
  } = useApp();

  // Filter listings (only show active approved listings to seekers)
  const filteredListings = listings.filter((listing) => {
    if (listing.status !== 'active') {
      return false;
    }

    // Category match
    if (activeCategory !== 'All' && listing.category !== activeCategory) {
      return false;
    }

    // Area search match
    if (searchArea && searchArea.trim() !== '') {
      const term = searchArea.toLowerCase().trim();
      const matchArea = listing.area.toLowerCase().includes(term);
      const matchTitle = listing.title.toLowerCase().includes(term);
      const matchDesc = listing.description.toLowerCase().includes(term);
      if (!matchArea && !matchTitle && !matchDesc) return false;
    }

    // Budget match
    if (listing.price > budgetRange[1]) {
      return false;
    }

    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-24 animate-in fade-in duration-200">
      {/* Kiota Hero Banner */}
      <div className="bg-[#C1533A] text-white rounded-3xl p-6 sm:p-7 shadow-md relative overflow-hidden card-shadow border border-[#C1533A]/30">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-60 h-60 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-12 bottom-0 translate-y-12 w-36 h-36 rounded-full bg-[#3B5D42]/20 pointer-events-none" />

        <div className="relative z-10 max-w-xl space-y-2.5">
          <div className="flex items-center space-x-2 text-[#FCFBF8]/90 text-[10px] font-extrabold uppercase tracking-[0.2em]">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-live-pulse" />
            <span>Live In-App Photo Verified • M-Pesa Native</span>
          </div>

          <div className="space-y-0.5">
            <h1 className="serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#FCFBF8] tracking-tight leading-tight">
              Find Your Nest. <span className="text-[#FCFBF8]/80 font-normal italic">Pata Kiota Chako.</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#FCFBF8]/90 leading-relaxed font-medium">
              Homes, shops, offices & short-stays shared by neighbours across Kenya.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="bg-[#3B5D42]/80 backdrop-blur-xs text-[#FCFBF8] px-3 py-1 rounded-full font-bold border border-white/10 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>First poster gets paid</span>
            </span>
            <span className="bg-white/15 backdrop-blur-xs text-[#FCFBF8] px-3 py-1 rounded-full font-bold">
              KES 100–300 M-Pesa Unlock
            </span>
          </div>
        </div>
      </div>

      {/* Category Chips (All, Rentals, Shops & Offices, Airbnb) */}
      <CategoryChips />

      {/* Filters & View Toggle (List vs Leaflet Map) */}
      <FilterBar />

      {/* Results Count & Subtext */}
      <div className="flex items-center justify-between text-xs font-bold text-[#2B2620]/75 px-1">
        <span>
          Showing {filteredListings.length} {filteredListings.length === 1 ? 'verified place' : 'verified places'} in Kenya
        </span>
        {activeCategory !== 'All' && (
          <span className="text-[#C1533A] bg-white px-2.5 py-0.5 rounded-full border border-[#2B2620]/10 text-[10px] font-extrabold">
            {activeCategory}
          </span>
        )}
      </div>

      {/* Main View Mode Switch */}
      {viewMode === 'map' ? (
        /* Leaflet + OpenStreetMap Map View */
        <div className="h-[520px] w-full">
          <LeafletMap
            listings={filteredListings}
            onSelectListing={(id) => openListingDetail(id)}
          />
        </div>
      ) : (
        /* Cards List View */
        <div>
          {filteredListings.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-[#2B2620]/10 space-y-4 card-shadow">
              <div className="w-14 h-14 bg-[#FCFBF8] text-[#C1533A] rounded-full flex items-center justify-center mx-auto border border-[#2B2620]/10">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="serif font-bold text-base text-[#2B2620]">No Places Found in this Area</h3>
                <p className="text-xs text-[#8A8072] max-w-sm mx-auto leading-relaxed">
                  Know a house, shop, or office going in this area? Share it on Kiota and be the first to get paid for it.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('post')}
                className="py-3 px-5 bg-[#C1533A] hover:bg-[#ab452e] text-white font-extrabold text-xs rounded-2xl shadow-md transition-all active:scale-95 inline-flex items-center space-x-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Share a Place & Get Paid</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
