import React, { useState } from 'react';
import {
  Building,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Eye,
  Key,
  MessageSquare,
  PlusCircle,
  Search,
  Filter,
  ArrowUpRight,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ListingStatus } from '../types';

export const HostPropertiesDashboard: React.FC = () => {
  const {
    currentUser,
    listings,
    getListingEarnings,
    openListingDetail,
    setActiveTab,
    openSupportChat,
    tickets,
    getPosterStats,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending_review' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'earnings' | 'unlocks'>('earnings');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter listings belonging to this host
  const hostListings = listings.filter((l) => l.poster_id === currentUser.id);

  // High-level aggregate stats
  const hostStats = getPosterStats(currentUser.id);
  const activeCount = hostListings.filter((l) => l.status === 'active').length;
  const pendingCount = hostListings.filter((l) => l.status === 'pending_review').length;
  const rejectedCount = hostListings.filter((l) => l.status === 'rejected').length;

  // Total earnings across all properties
  const propertyEarningsList = hostListings.map((l) => ({
    listing: l,
    earnings: getListingEarnings(l.id),
  }));

  const totalAllPropertyEarnings = propertyEarningsList.reduce(
    (sum, item) => sum + item.earnings.totalEarned,
    0
  );
  const totalInEscrow = propertyEarningsList.reduce(
    (sum, item) => sum + item.earnings.pendingAmount,
    0
  );
  const totalDisbursed = propertyEarningsList.reduce(
    (sum, item) => sum + item.earnings.releasedAmount,
    0
  );
  const totalUnlocks = propertyEarningsList.reduce(
    (sum, item) => sum + item.earnings.totalUnlocks,
    0
  );

  // Apply filters and sorting
  const filteredListings = propertyEarningsList
    .filter(({ listing }) => {
      if (statusFilter !== 'all' && listing.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          listing.title.toLowerCase().includes(q) ||
          listing.area.toLowerCase().includes(q) ||
          listing.category.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'earnings') {
        return b.earnings.totalEarned - a.earnings.totalEarned;
      }
      if (sortBy === 'unlocks') {
        return b.earnings.totalUnlocks - a.earnings.totalUnlocks;
      }
      return new Date(b.listing.created_at).getTime() - new Date(a.listing.created_at).getTime();
    });

  const handleCopyLink = (listingId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/#listing-${listingId}`);
    setCopiedId(listingId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Host's tickets
  const hostTickets = tickets.filter((t) => t.userId === currentUser.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-in fade-in duration-200">
      {/* Top Welcome & KPI Header */}
      <div className="bg-[#1B4332] text-white rounded-3xl p-6 sm:p-7 shadow-md card-shadow space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E8A33D] bg-black/25 px-2.5 py-0.5 rounded-full">
                {currentUser.track === 'partner' ? 'Partner Host Portal' : 'Community Host Portal'}
              </span>
              <span className="text-xs font-mono text-[#FBF3E7]/70">
                Tier: {hostStats.tierInfo.tier} ({hostStats.tierInfo.earnShare}% Payout)
              </span>
            </div>
            <h1 className="serif text-2xl sm:text-3xl font-bold text-[#FBF3E7] mt-1">
              {currentUser.name}&apos;s Listed Properties
            </h1>
            <p className="text-xs text-white/80">
              Track approval status, per-property earnings, and communicate with Kiota Concierge.
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => openSupportChat('listing_approval')}
              className="py-2.5 px-4 bg-white/10 hover:bg-white/20 text-[#FBF3E7] rounded-2xl font-bold text-xs flex items-center space-x-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#E8A33D]" />
              <span>Contact Support</span>
            </button>
            <button
              onClick={() => setActiveTab('post')}
              className="py-2.5 px-4 bg-[#E8A33D] hover:bg-[#d8932d] text-[#2B2118] rounded-2xl font-extrabold text-xs shadow-sm flex items-center space-x-1.5 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List New Property</span>
            </button>
          </div>
        </div>

        {/* 4 Financial Performance Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10">
          <div className="bg-black/20 backdrop-blur-xs p-3.5 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 block">
              Total Listed
            </span>
            <div className="serif text-2xl font-extrabold text-white mt-0.5">
              {hostListings.length}
            </div>
            <span className="text-[10px] text-[#E8A33D]">
              {activeCount} Live • {pendingCount} In Review
            </span>
          </div>

          <div className="bg-black/20 backdrop-blur-xs p-3.5 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 block">
              Total Unlocks
            </span>
            <div className="serif text-2xl font-extrabold text-white mt-0.5">
              {totalUnlocks}
            </div>
            <span className="text-[10px] text-emerald-300">
              Paid by verified seekers
            </span>
          </div>

          <div className="bg-black/20 backdrop-blur-xs p-3.5 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 block">
              Total Earned
            </span>
            <div className="serif text-2xl font-extrabold text-[#E8A33D] mt-0.5">
              KSh {totalAllPropertyEarnings.toLocaleString()}
            </div>
            <span className="text-[10px] text-white/70">
              Disbursed: KSh {totalDisbursed.toLocaleString()}
            </span>
          </div>

          <div className="bg-black/20 backdrop-blur-xs p-3.5 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 block">
              In 24h Escrow
            </span>
            <div className="serif text-2xl font-extrabold text-white mt-0.5">
              KSh {totalInEscrow.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-300">
              Eligible for M-Pesa B2C
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="bg-white rounded-2xl p-4 border border-[#2B2118]/10 card-shadow space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Status Pills */}
          <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                statusFilter === 'all'
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'bg-[#FBF3E7] text-[#2B2118]/70 hover:bg-[#FBF3E7]/80'
              }`}
            >
              All Properties ({hostListings.length})
            </button>

            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center space-x-1 ${
                statusFilter === 'active'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Approved & Live ({activeCount})</span>
            </button>

            <button
              onClick={() => setStatusFilter('pending_review')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center space-x-1 ${
                statusFilter === 'pending_review'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>Pending Moderation ({pendingCount})</span>
            </button>

            {rejectedCount > 0 && (
              <button
                onClick={() => setStatusFilter('rejected')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center space-x-1 ${
                  statusFilter === 'rejected'
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200'
                }`}
              >
                <AlertCircle className="w-3 h-3" />
                <span>Needs Revision ({rejectedCount})</span>
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <span className="text-[11px] font-bold text-[#2B2118]/60">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#FBF3E7] border border-[#2B2118]/15 rounded-xl px-2.5 py-1 text-xs text-[#2B2118] font-bold focus:ring-1 focus:ring-[#1B4332]"
            >
              <option value="earnings">Highest Earned (KSh)</option>
              <option value="unlocks">Most Unlocks</option>
              <option value="recent">Recently Listed</option>
            </select>
          </div>
        </div>

        {/* Search Field */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#2B2118]/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, location (e.g. Kilimani, Wood Ave), or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FBF3E7] border border-[#2B2118]/10 rounded-xl text-xs text-[#2B2118] focus:ring-1 focus:ring-[#1B4332] focus:outline-none"
          />
        </div>
      </div>

      {/* Property Listings Feed */}
      {filteredListings.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-[#2B2118]/10 text-center space-y-4 card-shadow">
          <div className="w-14 h-14 bg-[#FBF3E7] rounded-full flex items-center justify-center mx-auto text-[#1B4332]">
            <Building className="w-7 h-7" />
          </div>
          <div>
            <h3 className="serif font-bold text-base text-[#2B2118]">
              No properties match your filter
            </h3>
            <p className="text-xs text-[#2B2118]/65 max-w-sm mx-auto mt-1">
              Try adjusting your approval filter or list a new house to start earning unlock revenue.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('post')}
            className="py-3 px-6 bg-[#1B4332] hover:bg-[#143326] text-white font-extrabold text-xs rounded-2xl shadow-md transition-all active:scale-95"
          >
            Post a Property
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredListings.map(({ listing, earnings }) => {
            const isApproved = listing.status === 'active';
            const isPending = listing.status === 'pending_review';
            const isRejected = listing.status === 'rejected';

            return (
              <div
                key={listing.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-[#2B2118]/10 card-shadow hover:border-[#1B4332]/35 transition-all space-y-4"
              >
                {/* Header Row: Title, Category, Status Pill, Rent */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start space-x-3.5">
                    {/* Property Thumbnail */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border border-[#2B2118]/10 bg-stone-100">
                      <img
                        src={listing.media_urls?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300'}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/70 text-white font-mono text-[9px] px-1 rounded">
                        {listing.category}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        {isApproved && (
                          <span className="text-[9px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center space-x-1">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Live & Approved</span>
                          </span>
                        )}
                        {isPending && (
                          <span className="text-[9px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full flex items-center space-x-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>Pending Moderation</span>
                          </span>
                        )}
                        {isRejected && (
                          <span className="text-[9px] font-extrabold uppercase tracking-wider bg-red-100 text-red-800 border border-red-300 px-2 py-0.5 rounded-full flex items-center space-x-1">
                            <AlertCircle className="w-2.5 h-2.5" />
                            <span>Revision Needed</span>
                          </span>
                        )}
                        <span className="text-[10px] text-[#2B2118]/50 font-mono">
                          Listed {new Date(listing.created_at).toLocaleDateString('en-GB')}
                        </span>
                      </div>

                      <h3 className="serif font-bold text-base sm:text-lg text-[#2B2118] mt-1 leading-snug">
                        {listing.title}
                      </h3>
                      <p className="text-xs text-[#2B2118]/70">
                        {listing.area} • {listing.exact_landmark}
                      </p>
                    </div>
                  </div>

                  {/* Monthly Rent */}
                  <div className="text-left sm:text-right shrink-0 bg-[#FBF3E7] sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none">
                    <span className="text-[10px] font-bold text-[#2B2118]/60 uppercase tracking-wider block">
                      Listed Rent
                    </span>
                    <div className="serif text-xl font-extrabold text-[#C1440E]">
                      KSh {listing.price.toLocaleString()}
                      <span className="text-xs font-normal text-[#2B2118]/70 sans"> / {listing.price_period}</span>
                    </div>
                  </div>
                </div>

                {/* Moderation Alert Note (if pending or rejected) */}
                {isPending && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 flex items-start space-x-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">GPS Telemetry Verification in Progress:</span>
                      <p className="text-[11px] text-amber-800/90 mt-0.5">
                        Our moderation desk is reviewing the in-app camera watermark and geofencing coordinates. High-quality listings are approved within 2-4 hours.
                      </p>
                    </div>
                  </div>
                )}

                {isRejected && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-xs text-red-900 flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Action Required:</span>
                      <p className="text-[11px] text-red-800/90 mt-0.5">
                        {listing.rejection_reason || 'Please re-upload camera footage with clear entrance street markers and ensure GPS is enabled.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* FINANCIAL BREAKDOWN BOX FOR THIS SPECIFIC PROPERTY */}
                <div className="bg-[#FAF7F2] border border-[#2B2118]/10 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-[#1B4332]">
                      <DollarSign className="w-4 h-4 text-[#E8A33D]" />
                      <span>Property Financial Breakdown</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#2B2118]/60">
                      ID: {listing.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    <div className="bg-white p-2.5 rounded-xl border border-[#2B2118]/8">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#2B2118]/60 block">
                        Total Unlocks
                      </span>
                      <div className="serif text-lg font-bold text-[#2B2118]">
                        {earnings.totalUnlocks}
                      </div>
                      <span className="text-[9px] text-[#2B2118]/50">
                        {earnings.viewCount} Views
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-[#2B2118]/8">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#2B2118]/60 block">
                        Total Earned
                      </span>
                      <div className="serif text-lg font-bold text-[#1B4332]">
                        KSh {earnings.totalEarned.toLocaleString()}
                      </div>
                      <span className="text-[9px] text-emerald-700 font-medium">
                        Gross share
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-[#2B2118]/8">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#2B2118]/60 block">
                        In 24h Escrow
                      </span>
                      <div className="serif text-lg font-bold text-[#C1440E]">
                        KSh {earnings.pendingAmount.toLocaleString()}
                      </div>
                      <span className="text-[9px] text-[#2B2118]/50">
                        Quarantine hold
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-[#2B2118]/8">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#2B2118]/60 block">
                        Disbursed
                      </span>
                      <div className="serif text-lg font-bold text-emerald-700">
                        KSh {earnings.releasedAmount.toLocaleString()}
                      </div>
                      <span className="text-[9px] text-emerald-600 font-medium">
                        Sent to M-Pesa
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openListingDetail(listing.id)}
                      className="py-2 px-3.5 bg-white hover:bg-[#FAF7F2] text-[#2B2118] border border-[#2B2118]/15 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#1B4332]" />
                      <span>View Public Listing</span>
                    </button>

                    <button
                      onClick={() => handleCopyLink(listing.id)}
                      className="py-2 px-3 bg-white hover:bg-[#FAF7F2] text-[#2B2118] border border-[#2B2118]/15 rounded-xl font-bold text-xs flex items-center space-x-1 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#C1440E]" />
                      <span>{copiedId === listing.id ? 'Copied!' : 'Share'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => openSupportChat('listing_approval', listing.id)}
                    className="py-2 px-3.5 bg-[#1B4332]/10 hover:bg-[#1B4332]/20 text-[#1B4332] rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Contact Support on this Property</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Host Support Quick Access Widget */}
      <div className="bg-[#FAF7F2] border border-[#1B4332]/20 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 card-shadow">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center shrink-0 shadow-sm">
            <MessageSquare className="w-6 h-6 text-[#E8A33D]" />
          </div>
          <div>
            <h4 className="serif font-bold text-base text-[#1B4332]">
              Need Help With Property Verification or M-Pesa Payouts?
            </h4>
            <p className="text-xs text-[#2B2118]/70 mt-0.5">
              Chat directly with our dedicated Host Liaison Desk in Nairobi. Inquiries answered within minutes.
            </p>
          </div>
        </div>

        <button
          onClick={() => openSupportChat('listing_approval')}
          className="py-3 px-5 bg-[#1B4332] hover:bg-[#143326] text-white font-extrabold text-xs rounded-2xl shadow-md transition-all active:scale-95 shrink-0"
        >
          Open Host Chat Desk
        </button>
      </div>
    </div>
  );
};
