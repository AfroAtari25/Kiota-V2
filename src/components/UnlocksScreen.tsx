import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Key,
  MapPin,
  Phone,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Search,
  HelpCircle,
  Smartphone,
  Info,
  Calendar,
} from 'lucide-react';
import { AntiScreenshotGuard } from './AntiScreenshotGuard';

export const UnlocksScreen: React.FC = () => {
  const {
    unlocks,
    listings,
    users,
    currentUser,
    openListingDetail,
    setActiveTab,
    openSupportChat,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'active_escrow' | 'settled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Unlocks for current user
  const myUnlocks = unlocks.filter((u) => u.seeker_id === currentUser.id);

  // Helper to calculate 24h escrow window
  const getEscrowRemainingHours = (unlockedAt: string) => {
    const unlockTime = new Date(unlockedAt).getTime();
    const now = new Date().getTime();
    const elapsedHours = (now - unlockTime) / (1000 * 60 * 60);
    const remaining = Math.max(0, 24 - elapsedHours);
    return remaining;
  };

  const filteredUnlocks = myUnlocks.filter((u) => {
    const listing = listings.find((l) => l.id === u.listing_id);
    if (!listing) return false;

    const remainingHours = getEscrowRemainingHours(u.unlocked_at);
    const isActiveEscrow = remainingHours > 0;

    if (activeFilter === 'active_escrow' && !isActiveEscrow) return false;
    if (activeFilter === 'settled' && isActiveEscrow) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        listing.title.toLowerCase().includes(q) ||
        listing.area.toLowerCase().includes(q) ||
        u.payment_reference.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeEscrowCount = myUnlocks.filter(
    (u) => getEscrowRemainingHours(u.unlocked_at) > 0
  ).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24 animate-in fade-in duration-200">
      {/* Seeker Dashboard Banner */}
      <div className="bg-[#1B4332] text-white rounded-3xl p-6 sm:p-7 shadow-md card-shadow space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E8A33D] bg-black/30 px-2.5 py-0.5 rounded-full">
                Seeker Protected Hub
              </span>
              <span className="text-xs font-mono text-[#FBF3E7]/75">
                {currentUser.phone}
              </span>
            </div>
            <h1 className="serif text-2xl sm:text-3xl font-bold text-[#FBF3E7] mt-1">
              My Unlocked Kejas & Spaces
            </h1>
            <p className="text-xs text-white/80">
              Direct landlord contacts, exact GPS landmarks, and 24-hour escrow refund protection.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => openSupportChat('escrow_refund')}
              className="py-2.5 px-4 bg-white/10 hover:bg-white/20 text-[#FBF3E7] rounded-2xl font-bold text-xs flex items-center space-x-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#E8A33D]" />
              <span>Dispute / Concierge</span>
            </button>
            <button
              onClick={() => setActiveTab('browse')}
              className="py-2.5 px-4 bg-[#E8A33D] hover:bg-[#d8932d] text-[#2B2118] rounded-2xl font-extrabold text-xs shadow-sm flex items-center space-x-1.5 transition-all active:scale-95"
            >
              <Key className="w-4 h-4" />
              <span>Browse Feed</span>
            </button>
          </div>
        </div>

        {/* Aggregate Badges */}
        <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-white/10">
          <div className="bg-black/20 backdrop-blur-xs p-3 rounded-2xl">
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/70 block">
              Unlocked Kejas
            </span>
            <div className="serif text-xl font-extrabold text-white mt-0.5">
              {myUnlocks.length}
            </div>
            <span className="text-[10px] text-[#E8A33D]">Permanent Access</span>
          </div>

          <div className="bg-black/20 backdrop-blur-xs p-3 rounded-2xl">
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/70 block">
              Active 24h Escrow
            </span>
            <div className="serif text-xl font-extrabold text-emerald-300 mt-0.5">
              {activeEscrowCount}
            </div>
            <span className="text-[10px] text-white/70">100% Refund Window</span>
          </div>

          <div className="bg-black/20 backdrop-blur-xs p-3 rounded-2xl">
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/70 block">
              Total Invested
            </span>
            <div className="serif text-xl font-extrabold text-white mt-0.5">
              KSh {(myUnlocks.length * 300).toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-300">Saved broker fees</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#2B2118]/10 card-shadow space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                activeFilter === 'all'
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'bg-[#FBF3E7] text-[#2B2118]/70 hover:bg-[#FBF3E7]/80'
              }`}
            >
              All Unlocks ({myUnlocks.length})
            </button>
            <button
              onClick={() => setActiveFilter('active_escrow')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center space-x-1 ${
                activeFilter === 'active_escrow'
                  ? 'bg-[#C1440E] text-white shadow-xs'
                  : 'bg-[#C1440E]/10 text-[#C1440E] hover:bg-[#C1440E]/20'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>Under 24h Inspection ({activeEscrowCount})</span>
            </button>
            <button
              onClick={() => setActiveFilter('settled')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                activeFilter === 'settled'
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'bg-[#FBF3E7] text-[#2B2118]/70 hover:bg-[#FBF3E7]/80'
              }`}
            >
              Settled / Past Unlocks
            </button>
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-[#2B2118]/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search unlocked properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#FBF3E7] border border-[#2B2118]/10 rounded-xl text-xs text-[#2B2118] focus:ring-1 focus:ring-[#1B4332] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Empty State */}
      {myUnlocks.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-[#2B2118]/10 text-center space-y-4 card-shadow">
          <div className="w-14 h-14 bg-[#FBF3E7] rounded-full flex items-center justify-center mx-auto text-[#C1440E] border border-[#2B2118]/10">
            <Key className="w-7 h-7" />
          </div>
          <div>
            <h3 className="serif font-bold text-base text-[#2B2118]">No Unlocked Kejas Yet</h3>
            <p className="text-xs text-[#2B2118]/65 max-w-sm mx-auto mt-1 leading-relaxed">
              When you pay KES 300 to unlock a listing, verified direct landlord contact, exact building GPS pin, and 24-hour money-back escrow protection are enabled here.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('browse')}
            className="py-3.5 px-6 bg-[#C1440E] hover:bg-[#a53709] text-white font-extrabold text-xs rounded-2xl shadow-md transition-all active:scale-95"
          >
            Explore Available Listings
          </button>
        </div>
      ) : filteredUnlocks.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center text-xs text-[#2B2118]/70">
          No unlocked properties match the selected filter.
        </div>
      ) : (
        /* List of Unlocked Properties */
        <div className="space-y-5">
          {filteredUnlocks.map((u) => {
            const listing = listings.find((l) => l.id === u.listing_id);
            if (!listing) return null;
            const poster = users.find((usr) => usr.id === listing.poster_id);
            const remainingHours = getEscrowRemainingHours(u.unlocked_at);
            const isWithinEscrow = remainingHours > 0;

            return (
              <div
                key={u.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-[#2B2118]/10 card-shadow space-y-4 hover:border-[#1B4332]/40 transition-colors"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start space-x-3.5">
                    <img
                      src={listing.media_urls?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300'}
                      alt={listing.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-[#2B2118]/10 shrink-0"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider bg-[#1B4332]/10 text-[#1B4332] px-2.5 py-0.5 rounded-full border border-[#1B4332]/20">
                          {listing.category}
                        </span>
                        <span className="text-[10px] text-[#2B2118]/50 font-mono">
                          Ref: {u.payment_reference}
                        </span>
                      </div>
                      <h3 className="serif font-bold text-base sm:text-lg text-[#2B2118] mt-1">
                        {listing.title}
                      </h3>
                      <div className="text-xs text-[#2B2118]/70 flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#C1440E]" />
                        <span>{listing.area}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0 bg-[#FBF3E7] sm:bg-transparent p-2.5 sm:p-0 rounded-xl">
                    <div className="serif text-xl font-extrabold text-[#C1440E]">
                      KSh {listing.price.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-[#2B2118]/60 font-bold block">
                      / {listing.price_period}
                    </span>
                  </div>
                </div>

                {/* 24-Hour Escrow Protection Notice Bar */}
                <div
                  className={`rounded-2xl p-3.5 border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                    isWithinEscrow
                      ? 'bg-[#E8A33D]/10 border-[#E8A33D]/30 text-[#2B2118]'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {isWithinEscrow ? (
                      <Clock className="w-4 h-4 text-[#C1440E] shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold">
                        {isWithinEscrow
                          ? `24-Hour Inspection Active (${Math.floor(remainingHours)}h ${Math.round((remainingHours % 1) * 60)}m left)`
                          : 'Escrow Guarantee Verified & Settled'}
                      </span>
                      <p className="text-[10px] text-[#2B2118]/70">
                        {isWithinEscrow
                          ? 'Funds held in quarantine. If house is occupied or inaccurate, claim a 100% refund.'
                          : 'Property verified on site. Host payout cleared.'}
                      </p>
                    </div>
                  </div>

                  {isWithinEscrow && (
                    <button
                      onClick={() => openSupportChat('escrow_refund', listing.id)}
                      className="py-1.5 px-3 bg-[#C1440E] hover:bg-[#a53709] text-white font-extrabold text-[11px] rounded-xl shadow-xs transition-colors shrink-0 text-center"
                    >
                      Report Inaccurate / Refund
                    </button>
                  )}
                </div>

                {/* ANTI-SCREENSHOT PROTECTED CONTACT & LANDMARK SECTION */}
                <AntiScreenshotGuard
                  title="Landlord Contact & Precision GPS Landmark"
                  categoryLabel="Protected • Anti-Scrape"
                  autoHideDurationSeconds={25}
                >
                  <div className="space-y-3">
                    {/* Exact Address / Landmark Box */}
                    <div className="bg-[#FBF3E7] p-3.5 rounded-2xl border border-[#2B2118]/10 space-y-1">
                      <div className="font-bold text-[#1B4332] text-xs flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#C1440E]" />
                        <span>Exact Building & Gate Landmark:</span>
                      </div>
                      <div className="font-medium text-xs text-[#2B2118] pl-5">
                        {listing.exact_landmark || `${listing.area} - Specific Building & Unit`}
                      </div>
                    </div>

                    {/* Direct Contact Buttons */}
                    {poster && (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <a
                            href={`tel:${poster.phone}`}
                            className="py-3 px-3 bg-[#1B4332] hover:bg-[#143326] text-white rounded-2xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-colors active:scale-95"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call {poster.name.split(' ')[0]}</span>
                          </a>

                          <a
                            href={`https://wa.me/${poster.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(poster.name)},%20I%20unlocked%20your%20listing%20"${encodeURIComponent(listing.title)}"%20on%20Kiota.`}
                            target="_blank"
                            rel="noreferrer"
                            className="py-3 px-3 bg-[#25D366] hover:bg-[#20b858] text-white rounded-2xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-colors active:scale-95"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp Chat</span>
                          </a>
                        </div>

                        <div className="text-center font-mono text-xs font-bold text-[#2B2118] bg-white py-2 rounded-xl border border-[#2B2118]/10">
                          Direct Line: {poster.phone} ({poster.name})
                        </div>
                      </div>
                    )}
                  </div>
                </AntiScreenshotGuard>

                {/* Card Footer Actions */}
                <div className="pt-2 border-t border-[#2B2118]/8 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 text-[10px] text-[#2B2118]/60 font-mono">
                    <Calendar className="w-3 h-3" />
                    <span>Unlocked {new Date(u.unlocked_at).toLocaleDateString('en-GB')}</span>
                  </div>

                  <button
                    onClick={() => openListingDetail(listing.id)}
                    className="font-bold text-[#C1440E] hover:underline flex items-center space-x-1"
                  >
                    <span>Full Gallery, Video & Review</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Anti-Broker Policy Safeguard Reminder */}
      <div className="bg-white rounded-3xl p-5 border border-[#2B2118]/10 card-shadow flex items-start space-x-3.5">
        <div className="w-10 h-10 rounded-2xl bg-[#C1440E]/10 text-[#C1440E] flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="serif font-bold text-[#2B2118]">
            Zero Tolerance for Illegal Viewing Fees (&quot;Pesa ya Kuona Nyumba&quot;)
          </h4>
          <p className="text-[11px] text-[#2B2118]/75 leading-relaxed">
            Kiota&apos;s KES 300 platform unlock fee is the <b>only fee</b> required to view a property. If any caretaker or middleman demands an upfront viewing fee on site, do not pay. Report immediately via the Support Chat for an instant 100% refund and disciplinary action against the listing.
          </p>
        </div>
      </div>
    </div>
  );
};
