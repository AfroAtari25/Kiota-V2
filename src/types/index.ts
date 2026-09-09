export type UserRole = 'seeker' | 'poster' | 'admin';
export type VerificationStatus = 'verified' | 'unverified' | 'pending_verification' | 'top_rated' | 'rejected' | 'agent';

export type UserTrack = 'community' | 'partner';
export type TrustTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  role: UserRole;
  track?: UserTrack; // 'community' (default, individuals) or 'partner' (agencies/caretakers)
  agency_name?: string;
  business_reg_number?: string;
  agency_verified?: boolean;
  partner_verification_doc_url?: string;
  verification_status: VerificationStatus;
  trust_score: number; // 0 - 100
  trust_tier?: TrustTier;
  avatar_url?: string;
  national_id_number?: string;
  national_id_masked?: string;
  id_front_url?: string;
  id_back_url?: string;
  face_selfie_url?: string;
  face_liveness_score?: number; // e.g. 98.7%
  kyc_submitted_at?: string;
  kyc_verified_at?: string;
  kyc_rejection_reason?: string;
  member_since?: string;
  total_listings?: number;
}

export interface TrustTierInfo {
  tier: TrustTier;
  track: UserTrack;
  earnShare: number; // earn percentage (e.g. 20%, 30%, 50%, 75%)
  badgeBg: string;
  textColor: string;
  description: string;
  maxTierForTrack?: boolean;
  premiumMultiplier?: number;
}

// Configurable Economics & Ladder Settings (Stored dynamically, not hardcoded)
export interface EconomicsConfig {
  communityTrack: {
    name: string;
    description: string;
    maxEarnPercent: number; // 50% max (capped at Gold)
    tiers: {
      bronze: { min: number; max: number; earnPercent: number }; // 0-2 listings, 20%
      silver: { min: number; max: number; earnPercent: number }; // 3-7 listings, 30%
      gold: { min: number; max: number; earnPercent: number };   // 8+ listings, 50%
    };
  };
  partnerTrack: {
    name: string;
    description: string;
    maxEarnPercent: number; // 75% max (Platinum)
    platinumPremiumMultiplier: number; // 1.25x premium pricing
    tiers: {
      bronze: { min: number; max: number; earnPercent: number };   // 0-14 listings, 25%
      silver: { min: number; max: number; earnPercent: number };   // 15-29 listings, 40%
      gold: { min: number; max: number; earnPercent: number };     // 30-39 listings, 60%
      platinum: { min: number; max: number; earnPercent: number }; // 40+ listings, 75%
    };
  };
  monthlyVolumeCap: {
    thresholdUnlocks: number; // default 20 unlocks/month
    stepDownRate: number; // e.g. step down to next tier or -15%
    description: string;
  };
  concentrationReviewTriggers: {
    maxSingleTierVolumePercent: number; // default 15%
    maxSingleHostRevenuePercent: number; // default 5%
    reviewWindowDays: number; // 14 days (2 weeks)
  };
  lastUpdated?: string;
  updatedBy?: string;
}

export const DEFAULT_ECONOMICS_CONFIG: EconomicsConfig = {
  communityTrack: {
    name: 'Community Track (Individuals)',
    description: 'Everyday citizens, one-off sharers, tenants, and small caretakers. Capped at Gold (50%). Accessible instantly.',
    maxEarnPercent: 50,
    tiers: {
      bronze: { min: 0, max: 2, earnPercent: 20 },
      silver: { min: 3, max: 7, earnPercent: 30 },
      gold: { min: 8, max: Infinity, earnPercent: 50 },
    },
  },
  partnerTrack: {
    name: 'Partner Track (Agencies & Caretakers)',
    description: 'Registered real estate agencies, professional caretakers, building managers. Full ladder to Platinum (75%) + premium pricing with verified credentials.',
    maxEarnPercent: 75,
    platinumPremiumMultiplier: 1.25,
    tiers: {
      bronze: { min: 0, max: 14, earnPercent: 25 },
      silver: { min: 15, max: 29, earnPercent: 40 },
      gold: { min: 30, max: 39, earnPercent: 60 },
      platinum: { min: 40, max: Infinity, earnPercent: 75 },
    },
  },
  monthlyVolumeCap: {
    thresholdUnlocks: 20,
    stepDownRate: 15,
    description: "First 20 unlocks in a calendar month earn full tier rate; subsequent unlocks step down to the next tier's rate to prevent volume monopoly.",
  },
  concentrationReviewTriggers: {
    maxSingleTierVolumePercent: 15, // if any single tier exceeds 15% of monthly transactions
    maxSingleHostRevenuePercent: 5,  // if any single host exceeds 5% of monthly platform revenue
    reviewWindowDays: 14,
  },
  lastUpdated: '2026-09-03T00:00:00Z',
  updatedBy: 'Isa Mohamed (Super Admin)',
};

export const getUserTrackTierInfo = (
  user?: Partial<User> | null,
  listingCount: number = 0,
  config: EconomicsConfig = DEFAULT_ECONOMICS_CONFIG
): TrustTierInfo => {
  const track: UserTrack = user?.track === 'partner' ? 'partner' : 'community';

  if (track === 'partner') {
    const { bronze, silver, gold, platinum } = config.partnerTrack.tiers;
    if (listingCount >= platinum.min) {
      return {
        tier: 'Platinum',
        track: 'partner',
        earnShare: platinum.earnPercent,
        badgeBg: 'bg-[#C1533A] text-white',
        textColor: 'text-[#C1533A]',
        description: `Partner Agency Platinum: ${platinum.earnPercent}% earn share + ${config.partnerTrack.platinumPremiumMultiplier}x premium pricing (${listingCount}+ listings)`,
        maxTierForTrack: true,
        premiumMultiplier: config.partnerTrack.platinumPremiumMultiplier,
      };
    }
    if (listingCount >= gold.min) {
      return {
        tier: 'Gold',
        track: 'partner',
        earnShare: gold.earnPercent,
        badgeBg: 'bg-[#D48B38] text-white',
        textColor: 'text-[#D48B38]',
        description: `Partner Agency Gold: ${gold.earnPercent}% earn share (${gold.min}–${gold.max} listings managed)`,
      };
    }
    if (listingCount >= silver.min) {
      return {
        tier: 'Silver',
        track: 'partner',
        earnShare: silver.earnPercent,
        badgeBg: 'bg-[#3B5D42] text-white',
        textColor: 'text-[#3B5D42]',
        description: `Partner Agency Silver: ${silver.earnPercent}% earn share (${silver.min}–${silver.max} listings managed)`,
      };
    }
    return {
      tier: 'Bronze',
      track: 'partner',
      earnShare: bronze.earnPercent,
      badgeBg: 'bg-[#8A8072] text-white',
      textColor: 'text-[#8A8072]',
      description: `Partner Agency Bronze: ${bronze.earnPercent}% entry earn share (0–${bronze.max} listings managed)`,
    };
  }

  // Community Track (Individuals, One-off sharers, Tenants)
  const { bronze, silver, gold } = config.communityTrack.tiers;
  if (listingCount >= gold.min) {
    return {
      tier: 'Gold',
      track: 'community',
      earnShare: gold.earnPercent,
      badgeBg: 'bg-[#D48B38] text-white',
      textColor: 'text-[#D48B38]',
      description: `Community Gold: ${gold.earnPercent}% earn share (Capped at Gold for individuals, ${gold.min}+ listings)`,
      maxTierForTrack: true,
    };
  }
  if (listingCount >= silver.min) {
    return {
      tier: 'Silver',
      track: 'community',
      earnShare: silver.earnPercent,
      badgeBg: 'bg-[#3B5D42] text-white',
      textColor: 'text-[#3B5D42]',
      description: `Community Silver: ${silver.earnPercent}% earn share (${silver.min}–${silver.max} listings)`,
    };
  }
  return {
    tier: 'Bronze',
    track: 'community',
    earnShare: bronze.earnPercent,
    badgeBg: 'bg-[#8A8072] text-white',
    textColor: 'text-[#8A8072]',
    description: `Community Bronze: ${bronze.earnPercent}% entry earn share (0–${bronze.max} listings)`,
  };
};

export const getTrustTierInfo = (
  trustScore: number = 80,
  isVerified: boolean = true,
  user?: Partial<User> | null,
  listingCount: number = 0,
  config: EconomicsConfig = DEFAULT_ECONOMICS_CONFIG
): TrustTierInfo => {
  return getUserTrackTierInfo(user, listingCount || user?.total_listings || 0, config);
};

export type ListingCategory = 'Rentals' | 'Shops & Offices' | 'Airbnb';
export type ListingStatus = 'active' | 'pending_review' | 'occupied' | 'rejected';

export type SubmissionChannel = 'live_camera' | 'device_upload' | 'whatsapp' | 'email';

export interface Listing {
  id: string;
  category: ListingCategory;
  property_type: string; // e.g. '1 Bedroom Apartment', 'Executive Office Suite', 'Furnished Studio'
  title: string;
  price: number; // in KSh
  price_period: 'month' | 'day' | 'night';
  deposit?: number;
  area: string; // e.g. 'Kilimani, Nairobi', 'Westlands', 'Roysambu', 'CBD'
  gps_lat: number;
  gps_lng: number;
  exact_landmark?: string; // e.g. 'Wood Avenue Plaza, 3rd Floor Apt 3C' (locked until unlocked)
  description: string;
  status: ListingStatus;
  submission_channel?: SubmissionChannel;
  whatsapp_submitted_by?: string;
  rejection_reason?: string;
  poster_id: string;
  unlock_price: number; // e.g. 150 - 300 KSh
  bedrooms?: number;
  bathrooms?: number;
  floor_size?: string;
  features: string[];
  created_at: string;
  view_count?: number;
}

export type MediaType = 'photo' | 'video';
export type MediaSource = 'in_app_camera' | 'device_upload' | 'whatsapp_submission' | 'email_submission' | 'admin_attached';

export interface Media {
  id: string;
  listing_id: string;
  url: string;
  type: MediaType;
  capture_timestamp: string; // e.g. '2026-09-02 11:24 EAT'
  capture_location: string; // e.g. 'GPS -1.2891, 36.7821 ± 3m Live Verified'
  is_live_capture: boolean;
  caption?: string;
  source?: MediaSource;
  resolution?: string; // e.g. '4K UHD', '1080p HD'
}

export interface Unlock {
  id: string;
  listing_id: string;
  seeker_id: string;
  amount_paid: number;
  payment_reference: string; // e.g. 'MPESA-QKD78X904'
  timestamp: string;
  seeker_phone?: string;
  is_refunded?: boolean;
  refund_reason?: string;
  refund_reference?: string;
  paystack_reference?: string;
  payment_channel?: 'paystack_mpesa' | 'manual_mpesa';
}

export type PayoutStatus = 'pending' | 'released' | 'flagged' | 'refunded';

export interface Payout {
  id: string;
  poster_id: string;
  unlock_id: string;
  amount: number;
  status: PayoutStatus;
  release_time: string;
  mpesa_phone: string;
  mpesa_receipt?: string;
  listing_title?: string;
  tier_at_time?: TrustTier;
  track_at_time?: UserTrack;
  earn_percentage?: number;
  base_earn_percentage?: number;
  is_stepped_down?: boolean;
  monthly_unlock_count?: number;
  step_down_note?: string;
  flag_reason?: string;
  refund_reason?: string;
  approved_by?: string;
  released_at?: string;
}

export interface Review {
  id: string;
  listing_id: string;
  seeker_id: string;
  seeker_name: string;
  accurate: boolean; // physical inspection matches description & price
  rating: number; // 1 to 5 stars
  comment: string;
  created_at: string;
}

export type ActiveTab = 'browse' | 'post' | 'unlocks' | 'wallet' | 'profile' | 'admin' | 'host_properties';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'seeker' | 'poster' | 'admin' | 'support';
  text: string;
  timestamp: string;
  isAdminResponse?: boolean;
}

export type TicketCategory =
  | 'escrow_refund'
  | 'inaccurate_listing'
  | 'payout_delay'
  | 'listing_approval'
  | 'report_broker'
  | 'technical_help'
  | 'general';

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userRole: 'seeker' | 'poster' | 'admin';
  category: TicketCategory;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  lastActivityAt: string;
  listingId?: string;
  listingTitle?: string;
  unlockId?: string;
  messages: ChatMessage[];
}

export interface ListingEarningsInfo {
  listingId: string;
  totalUnlocks: number;
  totalEarned: number;
  pendingAmount: number;
  releasedAmount: number;
  monthlyUnlocks: number;
  viewCount: number;
}

export interface TierConcentrationItem {
  tierKey: string;
  name: string;
  track: UserTrack;
  tier: TrustTier;
  unlockCount: number;
  unlockPercent: number; // % of total unlocks
  grossRevenue: number;
  revenuePercent: number; // % of total GMV
  payoutsAmount: number;
  baseEarnPercent: number;
  exceedsTrigger: boolean; // if unlockPercent > 15%
  isBreached?: boolean;
  volume?: number;
  percentageOfTotal?: number;
}

export interface HostConcentrationItem {
  hostId: string;
  userId?: string;
  hostName: string;
  userName?: string;
  agencyName?: string;
  track: UserTrack;
  tier: TrustTier;
  listingCount: number;
  unlockCount: number;
  monthlyUnlockCount?: number;
  unlockPercent: number;
  grossRevenue: number;
  monthlyRevenue?: number;
  revenuePercent: number; // % of total platform GMV
  percentageOfTotalRevenue?: number;
  hostPayoutTotal: number;
  exceedsTrigger: boolean; // if revenuePercent > 5%
  isBreached?: boolean;
  isOverVolumeCap?: boolean;
}

export interface TierConcentrationAnalytics {
  periodLabel: string;
  totalUnlocks: number;
  totalMonthlyUnlocks: number;
  totalRevenue: number;
  totalMonthlyVolume: number;
  totalDisbursedOrPending: number;
  platformMargin: number;
  tierBreakdown: TierConcentrationItem[];
  tierDistribution: TierConcentrationItem[];
  totalSharersCount: number;
  monthlyVolumeCapThreshold: number;
  topHosts: HostConcentrationItem[];
  singleHighestVolumeHost: HostConcentrationItem | null;
  singleHighestVolumeTier: TierConcentrationItem | null;
  reviewTriggers: {
    isTriggered: boolean;
    tierTriggerTripped: boolean;
    hostTriggerTripped: boolean;
    reasons: string[];
    tierTriggerDetail?: string;
    hostTriggerDetail?: string;
    maxTierVolumePercent: number;
    maxHostRevenuePercent: number;
    reviewDeadlineDate: string;
    actionPlan: string;
  };
}
