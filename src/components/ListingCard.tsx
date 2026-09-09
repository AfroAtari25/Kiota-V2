import React from 'react';
import { Listing, Media, User } from '../types';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Award,
  Camera,
  Video,
  MapPin,
  Key,
  CheckCircle,
  Eye,
  Lock,
} from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const { media, users, openListingDetail, isUnlockedBySeeker, currentUser } = useApp();

  const listingMedia = media.filter((m) => m.listing_id === listing.id);
  const coverMedia = listingMedia[0] || {
    url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    type: 'photo',
    is_live_capture: true,
  };

  const poster = users.find((u) => u.id === listing.poster_id) || {
    name: 'Verified Landlord',
    verification_status: 'verified' as const,
    trust_score: 95,
  };

  const isUnlocked = isUnlockedBySeeker(listing.id, currentUser.id);
  const hasVideo = listingMedia.some((m) => m.type === 'video');

  // Trust badge styling based on verification_status
  const renderTrustBadge = () => {
    if (poster.verification_status === 'top_rated') {
      return (
        <div className="flex items-center space-x-1 bg-[#E8A33D] text-[#2B2118] px-2.5 py-0.8 rounded-full text-[9px] font-extrabold uppercase tracking-wider shadow-sm">
          <span>★ TOP RATED</span>
        </div>
      );
    }
    if (poster.verification_status === 'verified') {
      return (
        <div className="flex items-center space-x-1 bg-white/95 text-[#1B4332] px-2.5 py-0.8 rounded-full text-[9px] font-extrabold uppercase tracking-wider shadow-sm">
          <span>✔ VERIFIED POSTER</span>
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-1 bg-[#2B2118]/80 text-[#FBF3E7] px-2.5 py-0.8 rounded-full text-[9px] font-bold uppercase tracking-wider">
        <span>UNDER REVIEW</span>
      </div>
    );
  };

  const getCategoryBadgeColor = () => {
    switch (listing.category) {
      case 'Rentals':
        return 'bg-[#C1440E] text-white';
      case 'Shops & Offices':
        return 'bg-[#2B2118] text-[#FBF3E7]';
      case 'Airbnb':
        return 'bg-[#E8A33D] text-[#2B2118]';
      default:
        return 'bg-[#C1440E] text-white';
    }
  };

  return (
    <div
      id={`listing-card-${listing.id}`}
      onClick={() => openListingDetail(listing.id)}
      className="group bg-white rounded-3xl overflow-hidden border border-[#2B2118]/10 hover:border-[#E8A33D]/60 transition-all duration-200 card-shadow hover:shadow-lg cursor-pointer flex flex-col"
    >
      {/* Media / Cover Container */}
      <div className="relative aspect-4/3 w-full bg-neutral-900 overflow-hidden">
        <img
          src={coverMedia.url}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {/* Category Badge */}
          <span className={`px-2.5 py-0.8 rounded-full text-[9px] font-extrabold uppercase tracking-wider shadow-sm ${getCategoryBadgeColor()}`}>
            {listing.category}
          </span>

          {/* Trust Badge */}
          {renderTrustBadge()}
        </div>

        {/* In-App Live Camera Verification Tag */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center space-x-1.5">
          <div className="bg-[#2B2118]/80 backdrop-blur-xs text-[#FBF3E7] px-2 py-0.8 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center space-x-1 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-pulse" />
            <Camera className="w-3 h-3 text-emerald-300" />
            <span>Live Camera</span>
          </div>

          {hasVideo && (
            <div className="bg-[#2B2118]/80 backdrop-blur-xs text-[#FBF3E7] px-2 py-0.8 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center space-x-1 border border-white/10">
              <Video className="w-3 h-3 text-[#E8A33D]" />
              <span>Video</span>
            </div>
          )}
        </div>

        {/* Unlock Status Ribbon */}
        {isUnlocked ? (
          <div className="absolute bottom-2.5 right-2.5 bg-[#1B4332] text-white px-2.5 py-0.8 rounded-full text-[9px] font-extrabold uppercase tracking-wider flex items-center space-x-1 shadow-md">
            <CheckCircle className="w-3 h-3 text-emerald-300" />
            <span>Unlocked</span>
          </div>
        ) : (
          <div className="absolute bottom-2.5 right-2.5 bg-[#C1440E] text-white px-2.5 py-0.8 rounded-full text-[9px] font-extrabold uppercase tracking-wider flex items-center space-x-1 shadow-md">
            <Lock className="w-3 h-3" />
            <span>KSh {listing.unlock_price} to Unlock</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Price & Period & Category label */}
          <div className="flex items-baseline justify-between mb-1">
            <div className="flex items-baseline space-x-1">
              <span className="serif text-lg font-extrabold text-[#2B2118] tracking-tight">
                KSh {listing.price.toLocaleString()}
              </span>
              <span className="text-[11px] font-bold text-[#2B2118]/50">
                / {listing.price_period}
              </span>
            </div>

            <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#C1440E] bg-[#FBF3E7] px-2 py-0.5 rounded-full border border-[#2B2118]/8">
              {listing.property_type}
            </span>
          </div>

          {/* Title */}
          <h3 className="serif font-bold text-sm text-[#2B2118] line-clamp-1 group-hover:text-[#C1440E] transition-colors">
            {listing.title}
          </h3>

          {/* Area & Location */}
          <div className="flex items-center space-x-1 text-xs text-[#2B2118]/70 mt-1">
            <MapPin className="w-3.5 h-3.5 text-[#C1440E] shrink-0" />
            <span className="truncate">{listing.area}</span>
          </div>

          {/* Accuracy Rating Pill */}
          <div className="flex items-center space-x-1.5 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#E8A33D]" />
            <span className="text-[10px] font-bold text-[#2B2118]/80">
              {poster.trust_score}% Accuracy Score
            </span>
          </div>
        </div>

        {/* Key Features Chips */}
        <div className="mt-3 pt-2.5 border-t border-[#2B2118]/8 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 overflow-hidden text-[10px] text-[#2B2118]/70">
            {listing.features.slice(0, 2).map((feat) => (
              <span key={feat} className="bg-[#FBF3E7] px-2 py-0.5 rounded-md font-semibold text-[10px] truncate max-w-[120px] border border-[#2B2118]/6">
                {feat}
              </span>
            ))}
            {listing.features.length > 2 && (
              <span className="text-[#2B2118]/40 font-bold text-[10px]">
                +{listing.features.length - 2}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              openListingDetail(listing.id);
            }}
            className="text-xs font-extrabold text-[#C1440E] hover:underline flex items-center space-x-1"
          >
            <span>Details</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};
