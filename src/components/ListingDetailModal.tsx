import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  MapPin,
  Lock,
  Unlock as UnlockIcon,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Camera,
  Video,
  Sparkles,
  Share2,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Star,
  DollarSign,
  Smartphone,
  Trash2,
} from 'lucide-react';
import { LeafletMap } from './LeafletMap';
import { PaystackMpesaModal } from './PaystackMpesaModal';
import { AntiScreenshotGuard } from './AntiScreenshotGuard';

export const ListingDetailModal: React.FC = () => {
  const {
    selectedListingId,
    closeListingDetail,
    listings,
    media,
    users,
    currentUser,
    isUnlockedBySeeker,
    unlockListing,
    deleteListing,
    reviews,
    submitReview,
  } = useApp();

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockSuccessRef, setUnlockSuccessRef] = useState<string | null>(null);
  const [showPaystackModal, setShowPaystackModal] = useState(false);

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewAccurate, setReviewAccurate] = useState(true);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!selectedListingId) return null;

  const listing = listings.find((l) => l.id === selectedListingId);
  if (!listing) return null;

  const listingMedia = media.filter((m) => m.listing_id === listing.id);
  const poster = users.find((u) => u.id === listing.poster_id) || {
    name: 'Verified Landlord',
    phone: '+254 722 000 000',
    verification_status: 'verified' as const,
    trust_score: 95,
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    national_id_masked: '2981****',
  };

  const isUnlocked = isUnlockedBySeeker(listing.id, currentUser.id);
  const listingReviews = reviews.filter((r) => r.listing_id === listing.id);
  const activeMedia = listingMedia[activeMediaIndex] || listingMedia[0];

  const handleUnlock = async () => {
    setIsUnlocking(true);
    // Simulate brief STK Push processing
    setTimeout(async () => {
      const res = await unlockListing(listing.id);
      setIsUnlocking(false);
      if (res.success) {
        setUnlockSuccessRef(res.ref);
      }
    }, 800);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    submitReview(listing.id, reviewAccurate, reviewRating, reviewComment);
    setReviewSubmitted(true);
    setShowReviewForm(false);
    setReviewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto">
      <div className="bg-[#FBF3E7] w-full max-w-2xl max-h-[92vh] rounded-t-3xl sm:rounded-3xl border border-[#2B2118]/20 shadow-2xl overflow-y-auto flex flex-col relative animate-in slide-in-from-bottom duration-200">
        {/* Sticky Header with Close Button */}
        <div className="sticky top-0 z-30 bg-[#FBF3E7]/95 backdrop-blur-md px-4 py-3 border-b border-[#2B2118]/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-[#C1440E] text-white">
              {listing.category}
            </span>
            <span className="text-xs font-semibold text-[#2B2118]/70">
              {listing.property_type}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {currentUser.role === 'admin' && (
              <button
                onClick={() => {
                  if (window.confirm(`Admin Action: Delete listing "${listing.title}" permanently?`)) {
                    deleteListing(listing.id);
                    closeListingDetail();
                  }
                }}
                className="p-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition-colors flex items-center space-x-1 px-2.5 text-xs font-bold"
                title="Delete Listing (Admin)"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delete Post</span>
              </button>
            )}

            <button
              id="btn-close-detail-modal"
              onClick={closeListingDetail}
              className="p-1.5 rounded-full bg-[#2B2118]/10 hover:bg-[#2B2118]/20 text-[#2B2118] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gallery Section with Full Photo / Video Player */}
        <div className="relative aspect-16/10 w-full bg-neutral-950 overflow-hidden shrink-0">
          {activeMedia && activeMedia.type === 'video' ? (
            <video
              src={activeMedia.url}
              controls
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={activeMedia?.url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          )}

          {/* Media Authenticity Badge */}
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white px-3 py-1 rounded-xl text-[11px] font-semibold border border-white/15 flex items-center space-x-2 shadow-lg">
            {activeMedia?.is_live_capture ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-live-pulse" />
                <Camera className="w-3.5 h-3.5 text-emerald-300" />
                <span>Live In-App Capture: {activeMedia?.capture_timestamp || 'Verified'}</span>
              </>
            ) : activeMedia?.source === 'whatsapp' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp High-Res (Admin Verified): {activeMedia?.resolution || '4K UHD'}</span>
              </>
            ) : activeMedia?.source === 'email' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span>Email High-Res Asset: {activeMedia?.resolution || 'Original'}</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>{activeMedia?.resolution || 'Admin Verified Asset'}: {activeMedia?.caption || 'Authentic'}</span>
              </>
            )}
          </div>

          {/* Media Carousel Navigation Controls */}
          {listingMedia.length > 1 && (
            <>
              <button
                onClick={() =>
                  setActiveMediaIndex((prev) => (prev > 0 ? prev - 1 : listingMedia.length - 1))
                }
                className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setActiveMediaIndex((prev) => (prev < listingMedia.length - 1 ? prev + 1 : 0))
                }
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Media count & GPS text overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <div className="bg-black/65 backdrop-blur-xs text-white/90 text-[10px] px-2.5 py-1 rounded-lg border border-white/10 font-mono">
              {activeMedia?.capture_location || 'GPS Verified On-Site'}
            </div>
            <div className="bg-black/75 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
              {activeMediaIndex + 1} / {listingMedia.length}
            </div>
          </div>
        </div>

        {/* Thumbnail Selector */}
        {listingMedia.length > 1 && (
          <div className="flex items-center space-x-2 p-3 bg-[#2B2118]/5 overflow-x-auto no-scrollbar border-b border-[#2B2118]/10">
            {listingMedia.map((m, idx) => (
              <button
                key={m.id || idx}
                onClick={() => setActiveMediaIndex(idx)}
                className={`relative w-14 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  activeMediaIndex === idx ? 'border-[#C1440E] scale-105 shadow-sm' : 'border-transparent opacity-60'
                }`}
              >
                <img src={m.url} alt="" className="w-full h-full object-cover" />
                {m.type === 'video' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Video className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Main Details Body */}
        <div className="p-6 space-y-6">
          {/* Title & Price Card */}
          <div>
            <div className="flex items-baseline justify-between">
              <div className="serif text-3xl font-extrabold text-[#C1440E] tracking-tight">
                KSh {listing.price.toLocaleString()}
                <span className="text-xs font-bold text-[#2B2118]/60 ml-1.5 sans">
                  / {listing.price_period}
                </span>
              </div>

              {listing.deposit !== undefined && (
                <div className="text-xs font-bold text-[#1B4332] bg-[#1B4332]/10 px-3 py-1 rounded-full border border-[#1B4332]/20">
                  Deposit: {listing.deposit === 0 ? 'No Deposit' : `KSh ${listing.deposit.toLocaleString()}`}
                </div>
              )}
            </div>

            <h1 className="serif text-xl sm:text-2xl font-bold text-[#2B2118] mt-2">
              {listing.title}
            </h1>

            <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#2B2118]/70 mt-1">
              <MapPin className="w-4 h-4 text-[#C1440E]" />
              <span>{listing.area}</span>
            </div>
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-3 gap-2 bg-white rounded-3xl p-4 border border-[#2B2118]/10 text-center card-shadow">
            {listing.bedrooms !== undefined && (
              <div>
                <div className="text-[9px] text-[#2B2118]/50 uppercase tracking-widest font-bold">Bedrooms</div>
                <div className="serif text-sm font-extrabold text-[#2B2118] mt-0.5">{listing.bedrooms} Bedroom</div>
              </div>
            )}
            {listing.bathrooms !== undefined && (
              <div>
                <div className="text-[9px] text-[#2B2118]/50 uppercase tracking-widest font-bold">Bathrooms</div>
                <div className="serif text-sm font-extrabold text-[#2B2118] mt-0.5">{listing.bathrooms} Bath</div>
              </div>
            )}
            <div>
              <div className="text-[9px] text-[#2B2118]/50 uppercase tracking-widest font-bold">Floor Size</div>
              <div className="serif text-sm font-extrabold text-[#2B2118] mt-0.5">{listing.floor_size || 'Spacious'}</div>
            </div>
          </div>

          {/* Admin Verification & Quality Guarantee */}
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-3xl flex items-start space-x-3 text-xs text-emerald-950">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-extrabold text-[#2B2118] block">
                Admin Quality Verified by Isa Mohamed
              </span>
              <p className="text-[#8A8072] text-[11px] leading-relaxed">
                This space has undergone strict quality moderation. High-resolution photos, walkthrough videos, and Kenyan GPS coordinates were audited before approval to ensure seekers are never misled.
              </p>
            </div>
          </div>

          {/* Poster / Landlord Card */}
          <div className="bg-white rounded-3xl p-4 border border-[#2B2118]/10 flex items-center justify-between card-shadow">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={poster.avatar_url}
                  alt={poster.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#E8A33D]"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#1B4332] border-2 border-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="serif font-bold text-sm text-[#2B2118]">{poster.name}</span>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider bg-[#1B4332] text-white px-2 py-0.5 rounded-full">
                    {poster.trust_score}% Trust
                  </span>
                </div>
                <div className="text-[11px] text-[#2B2118]/70 flex items-center space-x-1 mt-0.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1B4332]" />
                  <span>National ID & Physical Inspection Verified</span>
                </div>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <div className="text-[9px] text-[#2B2118]/50 uppercase tracking-widest font-bold">Listed By</div>
              <div className="text-xs font-bold text-[#C1440E] capitalize">
                {poster.verification_status.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* UNLOCK GATE SECTION */}
          {/* ========================================================================= */}
          <div className="rounded-3xl border-2 overflow-hidden transition-all duration-300 card-shadow">
            {!isUnlocked ? (
              /* LOCKED VIEW */
              <div className="bg-gradient-to-b from-[#FBF3E7] to-[#E8A33D]/15 border-[#E8A33D]/40 p-5 space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#C1440E] text-white flex items-center justify-center shrink-0 shadow-md ring-2 ring-[#E8A33D]/30">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="serif text-base font-bold text-[#2B2118]">
                      Exact GPS Pin & Direct Phone Locked
                    </h3>
                    <p className="text-xs text-[#2B2118]/75 mt-0.5 font-medium">
                      Unlock direct contact with Landlord/Host & exact building landmark directions.
                    </p>
                  </div>
                </div>

                {/* Blurred Approximate Map Area with Artistic Blur Overlay */}
                <div className="relative rounded-2xl overflow-hidden border border-[#2B2118]/15 h-52">
                  <div className="w-full h-full filter blur-[3px] opacity-90">
                    <LeafletMap singleListing={listing} isLocked={true} listings={[]} />
                  </div>

                  {/* Overlay message */}
                  <div className="absolute inset-0 bg-[#2B2118]/45 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white">
                    <div className="w-10 h-10 rounded-full bg-[#E8A33D]/90 text-[#2B2118] flex items-center justify-center mb-2 shadow-lg animate-bounce">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="serif font-bold text-sm tracking-tight">
                      Approximate Area: {listing.area.split(',')[0]}
                    </span>
                    <span className="text-[11px] text-white/90 max-w-xs mt-1 font-medium">
                      Exact building name, door number, and precision pin are unlocked instantly.
                    </span>
                  </div>
                </div>

                {/* Masked Contact Preview */}
                <div className="bg-white rounded-2xl p-3.5 border border-[#2B2118]/10 flex items-center justify-between text-xs card-shadow">
                  <div className="flex items-center space-x-2 text-[#2B2118]/80">
                    <Phone className="w-4 h-4 text-[#C1440E]" />
                    <span>Landlord Phone: <b className="text-[#2B2118] font-mono">+254 722 ••• ••• (Locked)</b></span>
                  </div>
                  <span className="text-[9px] font-extrabold text-[#C1440E] uppercase tracking-widest bg-[#C1440E]/10 px-2 py-0.5 rounded-md">
                    Hidden
                  </span>
                </div>

                {/* Unlock Button triggering Paystack M-Pesa Modal */}
                <button
                  id="btn-unlock-listing"
                  onClick={() => setShowPaystackModal(true)}
                  className="w-full py-4 bg-[#0BA4DB] hover:bg-[#098ec0] text-white rounded-2xl serif font-bold text-base shadow-lg flex items-center justify-center space-x-2 active:scale-98 transition-all"
                >
                  <Smartphone className="w-5 h-5 text-white" />
                  <span>Unlock via Paystack M-Pesa (KSh {listing.unlock_price})</span>
                </button>

                <div className="text-center text-[10px] text-[#2B2118]/70 font-medium flex items-center justify-center space-x-1">
                  <span>🛡️ 100% Escrow Protection: Funds held securely until you verify space accuracy on-site.</span>
                </div>
              </div>
            ) : (
              /* UNLOCKED VIEW */
              <div className="bg-white border-[#1B4332] p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between bg-[#1B4332]/10 border border-[#1B4332]/20 rounded-2xl p-3.5">
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-6 h-6 text-[#1B4332]" />
                    <div>
                      <span className="serif text-sm font-bold text-[#1B4332]">Listing Unlocked!</span>
                      <p className="text-[10px] text-[#1B4332]/80 font-mono">
                        Ref: {unlockSuccessRef || 'MPESA-QK88219'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest bg-[#1B4332] text-white px-2.5 py-1 rounded-full">
                    Active Access
                  </span>
                </div>

                {/* Screenshot Protected Landlord Contact & Landmark */}
                <AntiScreenshotGuard
                  title="Verified Landlord Contact & Landmark"
                  categoryLabel="Anti-Screenshot • KDPA 2019"
                  autoHideDurationSeconds={25}
                >
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-[#2B2118] uppercase tracking-wider">
                      Direct Landlord Contact:
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${poster.phone}`}
                        className="py-3 px-4 bg-[#1B4332] hover:bg-[#143326] text-white rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-all"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Call Landlord</span>
                      </a>
                      <a
                        href={`https://wa.me/${poster.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(poster.name)},%20I%20unlocked%20your%20listing%20"${encodeURIComponent(listing.title)}"%20on%20Kiota.`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-3 px-4 bg-[#25D366] hover:bg-[#20b858] text-white rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-all"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>WhatsApp Chat</span>
                      </a>
                    </div>
                    <div className="text-center font-mono text-xs font-bold text-[#2B2118] bg-[#FBF3E7] py-2.5 rounded-2xl border border-[#2B2118]/10">
                      Phone: {poster.phone} ({poster.name})
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-[#2B2118]/10">
                      <div className="text-xs font-bold text-[#2B2118] flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-[#C1440E]" />
                        <span>Exact Building & Directions:</span>
                      </div>
                      <div className="bg-[#FBF3E7] p-3 rounded-2xl border border-[#C1440E]/30 text-xs font-bold text-[#2B2118]">
                        🏢 {listing.exact_landmark || `${listing.area} - Specific Unit`}
                      </div>
                    </div>
                  </div>
                </AntiScreenshotGuard>

                {/* Crisp Exact Leaflet Map Pin */}
                <div className="h-52 rounded-2xl overflow-hidden border border-[#2B2118]/15 mt-2">
                  <LeafletMap singleListing={listing} isLocked={false} listings={[]} />
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2B2118]/60 mb-2">
              Property Description
            </h3>
            <p className="text-xs text-[#2B2118]/85 leading-relaxed bg-white p-4 rounded-2xl border border-[#2B2118]/10">
              {listing.description}
            </p>
          </div>

          {/* Amenities / Features */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2B2118]/60 mb-2">
              Features & Amenities
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {listing.features.map((feat) => (
                <div
                  key={feat}
                  className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-[#2B2118]/10 text-xs font-semibold text-[#2B2118]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4332]" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews & Physical Accuracy Ratings */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2B2118]/60">
                Seeker Verification Reviews ({listingReviews.length})
              </h3>
              {isUnlocked && !reviewSubmitted && (
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="text-xs font-bold text-[#C1440E] hover:underline"
                >
                  {showReviewForm ? 'Cancel' : '+ Write Visit Review'}
                </button>
              )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="bg-white p-4 rounded-2xl border-2 border-[#C1440E]/30 space-y-3">
                <div className="font-bold text-xs text-[#2B2118]">
                  Did you visit {listing.title}?
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-[#2B2118]">Accurate to listing?</span>
                  <button
                    type="button"
                    onClick={() => setReviewAccurate(true)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                      reviewAccurate ? 'bg-[#1B4332] text-white' : 'bg-neutral-100 text-[#2B2118]'
                    }`}
                  >
                    ✅ Yes, Accurate
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewAccurate(false)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                      !reviewAccurate ? 'bg-[#C1440E] text-white' : 'bg-neutral-100 text-[#2B2118]'
                    }`}
                  >
                    ❌ Inaccurate
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2B2118] block mb-1">
                    Rating (1-5 Stars)
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className={`p-1 rounded-md ${
                          reviewRating >= star ? 'text-[#E8A33D]' : 'text-neutral-300'
                        }`}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <textarea
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe your on-site experience (e.g. water pressure, security, landlord interaction)..."
                    className="w-full text-xs p-3 rounded-xl border border-[#2B2118]/20 focus:outline-hidden focus:border-[#C1440E]"
                    rows={3}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#1B4332] text-white font-bold text-xs rounded-xl hover:bg-[#143326]"
                >
                  Submit Physical Verification Review
                </button>
              </form>
            )}

            {listingReviews.length === 0 ? (
              <div className="text-xs text-[#2B2118]/60 bg-white p-3.5 rounded-2xl border border-[#2B2118]/10 text-center">
                No seeker reviews yet. Unlock and visit to be the first to verify!
              </div>
            ) : (
              <div className="space-y-2">
                {listingReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white p-3.5 rounded-2xl border border-[#2B2118]/10 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-[#2B2118]">{rev.seeker_name}</span>
                        {rev.accurate && (
                          <span className="bg-[#1B4332]/10 text-[#1B4332] text-[10px] font-bold px-2 py-0.5 rounded-md">
                            ✅ 100% Accurate On-Site
                          </span>
                        )}
                      </div>
                      <div className="flex text-[#E8A33D]">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[#2B2118]/80 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Paystack M-Pesa Checkout Modal */}
      {showPaystackModal && (
        <PaystackMpesaModal
          listing={listing}
          onClose={() => setShowPaystackModal(false)}
          onSuccess={(paymentRef) => {
            setUnlockSuccessRef(paymentRef);
            setShowPaystackModal(false);
          }}
        />
      )}
    </div>
  );
};
