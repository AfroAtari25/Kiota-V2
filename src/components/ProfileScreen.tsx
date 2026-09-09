import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Award,
  Star,
  Key,
  CheckCircle2,
  Phone,
  User,
  Eye,
  Building2,
  Lock,
  ChevronRight,
  Sparkles,
  Smartphone,
  LogOut,
  RotateCcw,
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const {
    currentUser,
    users,
    switchUser,
    getPosterStats,
    listings,
    unlocks,
    reviews,
    resetToDefaults,
    setActiveTab,
  } = useApp();

  const stats = getPosterStats(currentUser.id);
  const myListings = listings.filter((l) => l.poster_id === currentUser.id);
  const mySeekerUnlocks = unlocks.filter((u) => u.seeker_id === currentUser.id);

  // Poster reviews
  const posterListingsIds = myListings.map((l) => l.id);
  const receivedReviews = reviews.filter((r) => posterListingsIds.includes(r.listing_id));
  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 animate-in fade-in duration-200">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#2B2620]/15 card-shadow space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={currentUser.name}
                className="w-16 h-16 rounded-full object-cover border-3 border-[#C1533A] shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 bg-[#3B5D42] text-white p-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h1 className="serif text-xl font-bold text-[#2B2620]">{currentUser.name}</h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${
                    isAdmin ? 'bg-[#2B2620] text-white' : 'bg-[#C1533A] text-white'
                  }`}
                >
                  {isAdmin ? 'Super Admin' : currentUser.role === 'poster' ? 'Sharer / Host' : 'Seeker'}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                    currentUser.track === 'partner'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {currentUser.track === 'partner' ? '🏢 Partner Track' : '👥 Community Track'}
                </span>
              </div>

              {currentUser.agency_name && (
                <div className="text-xs font-semibold text-blue-700 mt-0.5">
                  {currentUser.agency_name} {currentUser.agency_reg_no ? `• Reg: ${currentUser.agency_reg_no}` : ''}
                </div>
              )}

              <div className="flex items-center space-x-2 text-xs text-[#8A8072] mt-1 font-medium font-mono">
                <Phone className="w-3.5 h-3.5 text-[#C1533A]" />
                <span>{currentUser.phone}</span>
              </div>

              <div className="text-[11px] text-[#8A8072] mt-0.5">
                Member since {currentUser.member_since || 'March 2025'}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="serif text-2xl sm:text-3xl font-extrabold text-[#C1533A]">
              {currentUser.trust_score}%
            </div>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#8A8072]">
              Trust Score
            </span>
          </div>
        </div>

        {/* 3 Core Trust Badges / Verification Status */}
        <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-[#2B2620]/10">
          {/* Verification Status */}
          <div className="bg-[#FCFBF8] rounded-2xl p-3.5 border border-[#2B2620]/10 text-center">
            <ShieldCheck className="w-5 h-5 text-[#3B5D42] mx-auto mb-1" />
            <div className="text-[9px] font-extrabold uppercase tracking-widest text-[#8A8072]">Verification</div>
            <div className="serif text-xs font-extrabold text-[#3B5D42] capitalize mt-0.5">
              {currentUser.verification_status.replace('_', ' ')}
            </div>
            <span className="text-[9px] text-[#8A8072]">ID & On-Site Cam</span>
          </div>

          {/* Accuracy Rating / Tier */}
          <div className="bg-[#FCFBF8] rounded-2xl p-3.5 border border-[#2B2620]/10 text-center">
            <Award className="w-5 h-5 text-[#D48B38] mx-auto mb-1" />
            <div className="text-[9px] font-extrabold uppercase tracking-widest text-[#8A8072]">Trust Tier</div>
            <div className="serif text-xs font-extrabold text-[#2B2620] mt-0.5">
              {stats.tierInfo.tier} ({stats.tierInfo.earnShare}%)
            </div>
            <span className="text-[9px] text-[#8A8072]">Payout Share</span>
          </div>

          {/* Unlocks Generated */}
          <div className="bg-[#FCFBF8] rounded-2xl p-3.5 border border-[#2B2620]/10 text-center">
            <Key className="w-5 h-5 text-[#C1533A] mx-auto mb-1" />
            <div className="text-[9px] font-extrabold uppercase tracking-widest text-[#8A8072]">Unlocks Made</div>
            <div className="serif text-xs font-extrabold text-[#C1533A] mt-0.5">
              {stats.unlocksCount} Generated
            </div>
            <span className="text-[9px] text-[#8A8072]">Verified Leads</span>
          </div>
        </div>

        {/* Admin Hub shortcut if admin */}
        {isAdmin && (
          <div className="pt-2">
            <button
              onClick={() => setActiveTab('admin')}
              className="w-full py-2.5 px-4 bg-[#2B2620] text-white rounded-2xl font-extrabold text-xs flex items-center justify-center space-x-2 shadow-xs hover:bg-[#1a1714] transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Enter Super Admin Control Hub</span>
            </button>
          </div>
        )}
      </div>

      {/* Seeker Unlocks Section (If Seeker) */}
      <div className="bg-white rounded-3xl p-5 border border-[#2B2620]/15 card-shadow space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="serif text-sm font-bold text-[#2B2620]">
            My Unlocked Listings ({mySeekerUnlocks.length})
          </h2>
          <span className="text-[9px] text-[#3B5D42] font-extrabold uppercase tracking-wider bg-[#3B5D42]/10 px-2.5 py-0.5 rounded-full border border-[#3B5D42]/20">
            Direct Access
          </span>
        </div>

        {mySeekerUnlocks.length === 0 ? (
          <div className="text-xs text-[#8A8072] bg-[#FCFBF8] p-4 rounded-2xl text-center border border-[#2B2620]/10">
            You haven't unlocked any listings yet. Browse listings and unlock to get direct contact & exact GPS directions.
          </div>
        ) : (
          <div className="space-y-2">
            {mySeekerUnlocks.map((u) => {
              const listing = listings.find((l) => l.id === u.listing_id);
              if (!listing) return null;

              return (
                <div
                  key={u.id}
                  className="p-3.5 bg-[#FCFBF8] rounded-2xl border border-[#2B2620]/10 flex items-center justify-between"
                >
                  <div>
                    <div className="serif font-bold text-xs text-[#2B2620]">{listing.title}</div>
                    <div className="text-[10px] text-[#8A8072] mt-0.5">
                      📍 {listing.area} • Paid KSh {u.amount_paid} ({u.payment_reference})
                    </div>
                  </div>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#3B5D42] bg-white px-2.5 py-1 rounded-full border border-[#3B5D42]/20 shadow-xs">
                    Unlocked
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Switch Persona / Demo Testing */}
      <div className="bg-white rounded-3xl p-5 border border-[#2B2620]/15 card-shadow space-y-3">
        <h2 className="serif text-sm font-bold text-[#2B2620]">
          Switch Persona (Testing)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {users.map((u) => (
            <button
              key={u.id}
              onClick={() => {
                switchUser(u.id);
                if (u.role === 'admin') {
                  setActiveTab('admin');
                }
              }}
              className={`p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between ${
                u.id === currentUser.id
                  ? 'bg-[#2B2620] text-[#FCFBF8] border-[#2B2620] shadow-sm'
                  : 'bg-[#FCFBF8] text-[#2B2620] border-[#2B2620]/15 hover:bg-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <img
                  src={u.avatar_url}
                  alt={u.name}
                  className="w-9 h-9 rounded-full object-cover border border-[#C1533A]"
                />
                <div>
                  <div className="font-bold text-xs">{u.name}</div>
                  <div className={`text-[10px] ${u.id === currentUser.id ? 'text-white/80' : 'text-[#8A8072]'}`}>
                    {u.role === 'admin' ? 'Super Admin' : u.role === 'poster' ? 'Sharer / Host' : 'Seeker'} • {u.trust_score}% Trust
                  </div>
                </div>
              </div>
              {u.id === currentUser.id && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Seed Data */}
      <div className="flex justify-center pt-2">
        <button
          onClick={resetToDefaults}
          className="text-xs text-[#8A8072] hover:text-[#C1533A] flex items-center space-x-1 font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Store to Initial State</span>
        </button>
      </div>
    </div>
  );
};
