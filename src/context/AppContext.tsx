import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Listing,
  Media,
  Unlock,
  Payout,
  Review,
  ListingCategory,
  ActiveTab,
  getTrustTierInfo,
  getUserTrackTierInfo,
  TrustTier,
  TrustTierInfo,
  EconomicsConfig,
  DEFAULT_ECONOMICS_CONFIG,
  UserTrack,
  TierConcentrationAnalytics,
  TierConcentrationItem,
  HostConcentrationItem,
  SupportTicket,
  ChatMessage,
  TicketCategory,
  ListingEarningsInfo,
} from '../types';
import {
  SEED_USERS,
  SEED_LISTINGS,
  SEED_MEDIA,
  SEED_UNLOCKS,
  SEED_PAYOUTS,
  SEED_REVIEWS,
  SEED_TICKETS,
} from '../services/mockData';

interface AppContextType {
  // State
  users: User[];
  currentUser: User;
  listings: Listing[];
  media: Media[];
  unlocks: Unlock[];
  payouts: Payout[];
  reviews: Review[];
  economicsConfig: EconomicsConfig;
  tickets: SupportTicket[];

  // Navigation & UI State
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedListingId: string | null;
  openListingDetail: (id: string) => void;
  closeListingDetail: () => void;
  viewMode: 'list' | 'map';
  setViewMode: (mode: 'list' | 'map') => void;

  // Modals & Chat
  showTermsModal: boolean;
  setShowTermsModal: (show: boolean) => void;
  showSupportModal: boolean;
  setShowSupportModal: (show: boolean) => void;
  supportInitialCategory?: TicketCategory;
  supportInitialListingId?: string;
  openSupportChat: (category?: TicketCategory, listingId?: string) => void;

  // Filters
  activeCategory: ListingCategory | 'All';
  setActiveCategory: (cat: ListingCategory | 'All') => void;
  searchArea: string;
  setSearchArea: (area: string) => void;
  budgetRange: [number, number];
  setBudgetRange: (range: [number, number]) => void;

  // Actions
  switchUser: (userId: string) => void;
  logout: () => void;
  deleteUser: (userId: string) => { success: boolean; message: string };
  loginWithPhone: (
    phone: string,
    name: string,
    role: 'seeker' | 'poster' | 'admin',
    kycData?: {
      nationalIdNumber: string;
      idFrontUrl?: string;
      idBackUrl?: string;
      faceSelfieUrl?: string;
      faceLivenessScore?: number;
    }
  ) => User;
  submitKycVerification: (
    userId: string,
    data: {
      nationalIdNumber: string;
      idFrontUrl: string;
      idBackUrl: string;
      faceSelfieUrl: string;
      faceLivenessScore: number;
    }
  ) => void;
  approveKyc: (userId: string) => void;
  rejectKyc: (userId: string, reason: string) => void;
  isUnlockedBySeeker: (listingId: string, seekerId?: string) => boolean;
  unlockListing: (
    listingId: string,
    options?: {
      paystackRef?: string;
      seekerPhone?: string;
      channel?: 'paystack_mpesa' | 'manual_mpesa';
    }
  ) => Promise<{ success: boolean; ref: string }>;
  createListing: (
    listingData: Omit<Listing, 'id' | 'status' | 'created_at' | 'poster_id'>,
    mediaList: Omit<Media, 'id' | 'listing_id'>[]
  ) => Promise<Listing>;
  createAdminListing: (
    listingData: Omit<Listing, 'id' | 'created_at'>,
    mediaList: Omit<Media, 'id' | 'listing_id'>[]
  ) => Promise<Listing>;
  addMediaToListing: (
    listingId: string,
    mediaItems: Omit<Media, 'id' | 'listing_id'>[]
  ) => void;
  removeMediaFromListing: (mediaId: string) => void;
  approveListing: (listingId: string) => void;
  denyListing: (listingId: string, reason: string) => void;
  deleteListing: (listingId: string) => void;
  submitReview: (
    listingId: string,
    accurate: boolean,
    rating: number,
    comment: string
  ) => void;
  requestMpesaWithdrawal: (posterId: string) => Promise<{ success: boolean; code: string }>;
  releaseAdminPayout: (payoutId: string) => Promise<{ success: boolean; code: string; message?: string }>;
  flagAdminPayout: (payoutId: string, reason: string) => void;
  unflagAdminPayout: (payoutId: string) => void;
  refundAdminUnlock: (unlockId: string, reason: string) => Promise<{ success: boolean; ref: string }>;
  updateUserTrustTier: (userId: string, newScore: number, status: User['verification_status']) => void;
  updateUserTrack: (
    userId: string,
    track: UserTrack,
    agencyData?: {
      agency_name?: string;
      business_reg_number?: string;
      agency_verified?: boolean;
    }
  ) => void;
  updateEconomicsConfig: (config: Partial<EconomicsConfig>) => void;
  resetEconomicsConfig: () => void;
  getPosterStats: (posterId: string) => {
    totalEarned: number;
    pendingPayouts: number;
    releasedPayouts: number;
    unlocksCount: number;
    accuracyRating: number;
    reviewsCount: number;
    tierInfo: TrustTierInfo;
  };
  getListingEarnings: (listingId: string) => ListingEarningsInfo;
  createSupportTicket: (data: {
    category: TicketCategory;
    subject: string;
    message: string;
    listingId?: string;
    unlockId?: string;
  }) => SupportTicket;
  replyToTicket: (ticketId: string, message: string, isAdmin?: boolean) => void;
  resolveTicket: (ticketId: string) => void;
  getAdminPlatformStats: () => {
    totalUnlocksVolume: number;
    totalEscrowHeld: number;
    totalDisbursed: number;
    totalKiotaRevenue: number;
    pendingListingsCount: number;
    activeListingsCount: number;
    rejectedListingsCount: number;
    totalUsersCount: number;
    verifiedUsersCount: number;
    pendingKycCount: number;
    disputeCount: number;
  };
  getTierConcentrationAnalytics: () => TierConcentrationAnalytics;
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'kiota_users_v5',
  CURRENT_USER_ID: 'kiota_current_user_v5',
  LISTINGS: 'kiota_listings_v5',
  MEDIA: 'kiota_media_v5',
  UNLOCKS: 'kiota_unlocks_v5',
  PAYOUTS: 'kiota_payouts_v5',
  REVIEWS: 'kiota_reviews_v5',
  ECONOMICS_CONFIG: 'kiota_economics_config_v1',
  TICKETS: 'kiota_tickets_v1',
};

// Kenyan phone cleaning helper
export const normalizeKenyanPhone = (rawPhone: string) => {
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.startsWith('254')) {
    return '0' + digits.slice(3);
  }
  if (digits.startsWith('0')) {
    return digits;
  }
  if (digits.length === 9) {
    return '0' + digits;
  }
  return digits;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or seeds, ensuring admin user always exists
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      if (saved) {
        const parsed: User[] = JSON.parse(saved);
        // Ensure Isa Mohamed admin exists
        if (!parsed.some((u) => u.id === 'user-admin-isa' || u.email?.toLowerCase() === 'isamohamed92@gmail.com')) {
          return [SEED_USERS[0], ...parsed];
        }
        return parsed;
      }
      return SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      return saved || 'user-admin-isa'; // Default to Isa Mohamed or first
    } catch {
      return 'user-admin-isa';
    }
  });

  const [listings, setListings] = useState<Listing[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LISTINGS);
      return saved ? JSON.parse(saved) : SEED_LISTINGS;
    } catch {
      return SEED_LISTINGS;
    }
  });

  const [media, setMedia] = useState<Media[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEDIA);
      return saved ? JSON.parse(saved) : SEED_MEDIA;
    } catch {
      return SEED_MEDIA;
    }
  });

  const [unlocks, setUnlocks] = useState<Unlock[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.UNLOCKS);
      return saved ? JSON.parse(saved) : SEED_UNLOCKS;
    } catch {
      return SEED_UNLOCKS;
    }
  });

  const [payouts, setPayouts] = useState<Payout[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYOUTS);
      return saved ? JSON.parse(saved) : SEED_PAYOUTS;
    } catch {
      return SEED_PAYOUTS;
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : SEED_REVIEWS;
    } catch {
      return SEED_REVIEWS;
    }
  });

  const [economicsConfig, setEconomicsConfig] = useState<EconomicsConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ECONOMICS_CONFIG);
      return saved ? JSON.parse(saved) : DEFAULT_ECONOMICS_CONFIG;
    } catch {
      return DEFAULT_ECONOMICS_CONFIG;
    }
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TICKETS);
      return saved ? JSON.parse(saved) : SEED_TICKETS;
    } catch {
      return SEED_TICKETS;
    }
  });

  // Modals & Chat States
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);
  const [supportInitialCategory, setSupportInitialCategory] = useState<TicketCategory | undefined>(undefined);
  const [supportInitialListingId, setSupportInitialListingId] = useState<string | undefined>(undefined);

  // Navigation and Filter States
  const [activeTab, setActiveTab] = useState<ActiveTab>('browse');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [activeCategory, setActiveCategory] = useState<ListingCategory | 'All'>('All');
  const [searchArea, setSearchArea] = useState<string>('');
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 100000]);

  // Persist changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(media));
  }, [media]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.UNLOCKS, JSON.stringify(unlocks));
  }, [unlocks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYOUTS, JSON.stringify(payouts));
  }, [payouts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ECONOMICS_CONFIG, JSON.stringify(economicsConfig));
  }, [economicsConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  }, [tickets]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0] || SEED_USERS[0];

  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUserId(target.id);
      if (target.role !== 'admin' && activeTab === 'admin') {
        setActiveTab('browse');
      }
    }
  };

  const logout = () => {
    // Switch away from admin or active user to standard seeker persona Brian Kipchoge
    const defaultSeeker = users.find((u) => u.id === 'user-seeker-1') || users.find((u) => u.role === 'seeker') || users[0];
    if (defaultSeeker) {
      setCurrentUserId(defaultSeeker.id);
    }
    if (activeTab === 'admin') {
      setActiveTab('browse');
    }
  };

  const loginWithPhone = (
    phone: string,
    name: string,
    role: 'seeker' | 'poster' | 'admin',
    kycData?: {
      nationalIdNumber: string;
      idFrontUrl?: string;
      idBackUrl?: string;
      faceSelfieUrl?: string;
      faceLivenessScore?: number;
    }
  ): User => {
    const normalizedInput = normalizeKenyanPhone(phone);

    

    // Check if phone matches any existing user
    const existing = users.find(
      (u) => normalizeKenyanPhone(u.phone) === normalizedInput
    );

    if (existing) {
      // If KYC data was provided on this login/signup, update it
      if (kycData && kycData.nationalIdNumber) {
        const masked = kycData.nationalIdNumber.length >= 4
          ? kycData.nationalIdNumber.slice(0, 4) + '****'
          : 'ID-VERIFIED';

        const updated: User = {
          ...existing,
          name: name || existing.name,
          role: role || existing.role,
          national_id_number: kycData.nationalIdNumber,
          national_id_masked: masked,
          id_front_url: kycData.idFrontUrl || existing.id_front_url,
          id_back_url: kycData.idBackUrl || existing.id_back_url,
          face_selfie_url: kycData.faceSelfieUrl || existing.face_selfie_url,
          face_liveness_score: kycData.faceLivenessScore || 98.5,
          verification_status: 'pending_verification',
          kyc_submitted_at: new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' }) + ' EAT',
        };

        setUsers((prev) => prev.map((u) => (u.id === existing.id ? updated : u)));
        setCurrentUserId(existing.id);
        if (existing.role === 'admin') setActiveTab('admin');
        return updated;
      }

      setCurrentUserId(existing.id);
      if (existing.role === 'admin') setActiveTab('admin');
      return existing;
    }

    // Create new user with KYC if provided
    const formattedPhone = phone.startsWith('+254') ? phone : `+254 ${normalizedInput.replace(/^0/, '')}`;
    const isSharer = role === 'poster';
    const hasKyc = !!kycData?.nationalIdNumber;
    const maskedId = kycData?.nationalIdNumber
      ? kycData.nationalIdNumber.slice(0, 4) + '****'
      : undefined;

    const newUser: User = {
      id: `user-${Date.now()}`,
      phone: formattedPhone,
      name: name || 'Kenya Member',
      role,
      verification_status: hasKyc ? 'pending_verification' : isSharer ? 'unverified' : 'verified',
      trust_score: hasKyc ? 80 : 70,
      trust_tier: hasKyc ? 'Silver' : 'Bronze',
      avatar_url: kycData?.faceSelfieUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || phone)}`,
      national_id_number: kycData?.nationalIdNumber,
      national_id_masked: maskedId,
      id_front_url: kycData?.idFrontUrl,
      id_back_url: kycData?.idBackUrl,
      face_selfie_url: kycData?.faceSelfieUrl,
      face_liveness_score: kycData?.faceLivenessScore || 98.6,
      kyc_submitted_at: hasKyc
        ? new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' }) + ' EAT'
        : undefined,
      member_since: 'September 2026',
      total_listings: 0,
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUserId(newUser.id);
    return newUser;
  };

  const submitKycVerification = (
    userId: string,
    data: {
      nationalIdNumber: string;
      idFrontUrl: string;
      idBackUrl: string;
      faceSelfieUrl: string;
      faceLivenessScore: number;
    }
  ) => {
    const masked = data.nationalIdNumber.length >= 4
      ? data.nationalIdNumber.slice(0, 4) + '****'
      : 'ID-VERIFIED';

    const timestamp = new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' }) + ' EAT';

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              national_id_number: data.nationalIdNumber,
              national_id_masked: masked,
              id_front_url: data.idFrontUrl,
              id_back_url: data.idBackUrl,
              face_selfie_url: data.faceSelfieUrl,
              face_liveness_score: data.faceLivenessScore,
              verification_status: 'pending_verification',
              kyc_submitted_at: timestamp,
              kyc_rejection_reason: undefined,
            }
          : u
      )
    );
  };

  const approveKyc = (userId: string) => {
    const timestamp = new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' }) + ' EAT';
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const newScore = Math.max(u.trust_score || 0, 90);
        const tierInfo = getTrustTierInfo(newScore, true);
        return {
          ...u,
          verification_status: 'verified',
          trust_score: newScore,
          trust_tier: tierInfo.tier,
          kyc_verified_at: timestamp,
          kyc_rejection_reason: undefined,
        };
      })
    );
  };

  const rejectKyc = (userId: string, reason: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              verification_status: 'rejected',
              kyc_rejection_reason: reason,
            }
          : u
      )
    );
  };

  const openListingDetail = (id: string) => {
    setSelectedListingId(id);
  };

  const closeListingDetail = () => {
    setSelectedListingId(null);
  };

  const isUnlockedBySeeker = (listingId: string, seekerId?: string) => {
    const sId = seekerId || currentUser.id;
    const listing = listings.find((l) => l.id === listingId);
    if (listing && listing.poster_id === sId) {
      return true;
    }
    return unlocks.some((u) => u.listing_id === listingId && u.seeker_id === sId);
  };

  const unlockListing = async (
    listingId: string,
    options?: {
      paystackRef?: string;
      seekerPhone?: string;
      channel?: 'paystack_mpesa' | 'manual_mpesa';
    }
  ): Promise<{ success: boolean; ref: string }> => {
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return { success: false, ref: '' };

    if (isUnlockedBySeeker(listingId, currentUser.id)) {
      return { success: true, ref: 'ALREADY-UNLOCKED' };
    }

    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomDigits = Math.floor(100 + Math.random() * 900);
    const mpesaRef = options?.paystackRef || `MPESA-QK${randomChars}${randomDigits}`;
    const unlockId = `unlock-${Date.now()}`;

    const newUnlock: Unlock = {
      id: unlockId,
      listing_id: listingId,
      seeker_id: currentUser.id,
      amount_paid: listing.unlock_price,
      payment_reference: mpesaRef,
      timestamp: new Date().toISOString(),
      seeker_phone: options?.seekerPhone || currentUser.phone,
      paystack_reference: options?.paystackRef,
      payment_channel: options?.channel || (options?.paystackRef ? 'paystack_mpesa' : 'manual_mpesa'),
    };

    const poster = users.find((u) => u.id === listing.poster_id);
    const posterListingsCount = listings.filter((l) => l.poster_id === listing.poster_id).length;
    const posterTierInfo = getUserTrackTierInfo(
      poster,
      posterListingsCount || poster?.total_listings || 0,
      economicsConfig
    );

    // Monthly volume step-down logic:
    // Check how many unlocks this poster has accumulated in the current calendar month
    const currentMonthStr = new Date().toISOString().slice(0, 7); // e.g. '2026-09'
    const posterListingIds = listings.filter((l) => l.poster_id === listing.poster_id).map((l) => l.id);
    const monthlyUnlocksForPoster = unlocks.filter(
      (u) => posterListingIds.includes(u.listing_id) && u.timestamp.startsWith(currentMonthStr)
    );
    const currentMonthlyUnlockCount = monthlyUnlocksForPoster.length + 1;
    const threshold = economicsConfig.monthlyVolumeCap.thresholdUnlocks; // default 20 unlocks

    let effectiveEarnPercent = posterTierInfo.earnShare;
    let isSteppedDown = false;
    let stepDownNote: string | undefined = undefined;

    if (currentMonthlyUnlockCount > threshold) {
      isSteppedDown = true;
      const isPartner = (poster?.track || 'community') === 'partner';
      if (isPartner) {
        // Partner step-down ladder:
        // Platinum (75%) -> Gold (60%)
        // Gold (60%) -> Silver (40%)
        // Silver (40%) -> Bronze (25%)
        // Bronze (25%) -> 20%
        if (posterTierInfo.tier === 'Platinum') {
          effectiveEarnPercent = economicsConfig.partnerTrack.tiers.gold.earnPercent;
        } else if (posterTierInfo.tier === 'Gold') {
          effectiveEarnPercent = economicsConfig.partnerTrack.tiers.silver.earnPercent;
        } else if (posterTierInfo.tier === 'Silver') {
          effectiveEarnPercent = economicsConfig.partnerTrack.tiers.bronze.earnPercent;
        } else {
          effectiveEarnPercent = Math.max(15, economicsConfig.partnerTrack.tiers.bronze.earnPercent - 5);
        }
      } else {
        // Community step-down ladder:
        // Gold (50%) -> Silver (30%)
        // Silver (30%) -> Bronze (20%)
        // Bronze (20%) -> 15%
        if (posterTierInfo.tier === 'Gold') {
          effectiveEarnPercent = economicsConfig.communityTrack.tiers.silver.earnPercent;
        } else if (posterTierInfo.tier === 'Silver') {
          effectiveEarnPercent = economicsConfig.communityTrack.tiers.bronze.earnPercent;
        } else {
          effectiveEarnPercent = Math.max(10, economicsConfig.communityTrack.tiers.bronze.earnPercent - 5);
        }
      }

      stepDownNote = `Volume Safeguard Active: Unlock #${currentMonthlyUnlockCount} this month exceeded ${threshold}-unlock cap (step-down applied from ${posterTierInfo.earnShare}% to ${effectiveEarnPercent}%).`;
    }

    const posterEarnings = Math.round(listing.unlock_price * (effectiveEarnPercent / 100));
    const futureRelease = new Date();
    futureRelease.setHours(futureRelease.getHours() + 24);

    const newPayout: Payout = {
      id: `payout-${Date.now()}`,
      poster_id: listing.poster_id,
      unlock_id: unlockId,
      amount: posterEarnings,
      status: 'pending',
      tier_at_time: posterTierInfo.tier,
      track_at_time: poster?.track || 'community',
      base_earn_percentage: posterTierInfo.earnShare,
      earn_percentage: effectiveEarnPercent,
      is_stepped_down: isSteppedDown,
      monthly_unlock_count: currentMonthlyUnlockCount,
      step_down_note: stepDownNote,
      release_time: futureRelease.toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' EAT',
      mpesa_phone: poster?.phone || '+254 700 000 000',
      listing_title: listing.title,
    };

    setUnlocks((prev) => [newUnlock, ...prev]);
    setPayouts((prev) => [newPayout, ...prev]);

    return { success: true, ref: mpesaRef };
  };

  const createListing = async (
    listingData: Omit<Listing, 'id' | 'status' | 'created_at' | 'poster_id'>,
    mediaList: Omit<Media, 'id' | 'listing_id'>[]
  ): Promise<Listing> => {
    const newId = `listing-${Date.now()}`;
    const newListing: Listing = {
      ...listingData,
      id: newId,
      status: 'pending_review',
      poster_id: currentUser.id,
      created_at: new Date().toISOString(),
      view_count: 1,
    };

    const newMediaItems: Media[] = mediaList.map((m, idx) => ({
      ...m,
      id: `media-${newId}-${idx + 1}`,
      listing_id: newId,
    }));

    setListings((prev) => [newListing, ...prev]);
    setMedia((prev) => [...newMediaItems, ...prev]);

    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? { ...u, total_listings: (u.total_listings || 0) + 1 }
          : u
      )
    );

    return newListing;
  };

  const createAdminListing = async (
    listingData: Omit<Listing, 'id' | 'created_at'>,
    mediaList: Omit<Media, 'id' | 'listing_id'>[]
  ): Promise<Listing> => {
    const newId = `listing-${Date.now()}`;
    const newListing: Listing = {
      ...listingData,
      id: newId,
      created_at: new Date().toISOString(),
      view_count: 1,
    };

    const newMediaItems: Media[] = mediaList.map((m, idx) => ({
      ...m,
      id: `media-${newId}-${idx + 1}`,
      listing_id: newId,
    }));

    setListings((prev) => [newListing, ...prev]);
    setMedia((prev) => [...newMediaItems, ...prev]);

    return newListing;
  };

  const addMediaToListing = (
    listingId: string,
    mediaItems: Omit<Media, 'id' | 'listing_id'>[]
  ) => {
    const newMedia: Media[] = mediaItems.map((m, idx) => ({
      ...m,
      id: `media-${listingId}-${Date.now()}-${idx + 1}`,
      listing_id: listingId,
    }));

    setMedia((prev) => [...newMedia, ...prev]);
  };

  const removeMediaFromListing = (mediaId: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== mediaId));
  };

  const approveListing = (listingId: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === listingId ? { ...l, status: 'active' as const, rejection_reason: undefined } : l))
    );
  };

  const denyListing = (listingId: string, reason: string) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === listingId ? { ...l, status: 'rejected' as const, rejection_reason: reason } : l
      )
    );
  };

  const deleteListing = (listingId: string) => {
    setListings((prev) => prev.filter((l) => l.id !== listingId));
    setMedia((prev) => prev.filter((m) => m.listing_id !== listingId));
    setUnlocks((prev) => prev.filter((u) => u.listing_id !== listingId));
  };

  const deleteUser = (userId: string): { success: boolean; message: string } => {
    if (userId === 'user-admin-isa' || (userId === currentUserId && currentUser.role === 'admin')) {
      return { success: false, message: 'Super Admin account (Isa Mohamed) is protected and cannot be deleted.' };
    }
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) {
      return { success: false, message: 'Account not found.' };
    }

    // Cascade remove listings posted by this user
    const userListingIds = listings.filter((l) => l.poster_id === userId).map((l) => l.id);
    setListings((prev) => prev.filter((l) => l.poster_id !== userId));
    setMedia((prev) => prev.filter((m) => !userListingIds.includes(m.listing_id)));
    setPayouts((prev) => prev.filter((p) => p.poster_id !== userId));

    // Remove user
    setUsers((prev) => prev.filter((u) => u.id !== userId));

    // If currently logged into this deleted user, fallback safely to admin or default
    if (currentUserId === userId) {
      setCurrentUserId('user-admin-isa');
      setActiveTab('admin');
    }

    return {
      success: true,
      message: `Account "${targetUser.name}" and all associated listings were removed.`,
    };
  };

  const releaseAdminPayout = async (
    payoutId: string
  ): Promise<{ success: boolean; code: string; message?: string }> => {
    const targetPayout = payouts.find((p) => p.id === payoutId);
    if (targetPayout && targetPayout.status === 'flagged') {
      return {
        success: false,
        code: '',
        message: 'Cannot disburse a flagged payout. The issue must first be marked as resolved and unflagged before funds can be released.',
      };
    }

    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomDigits = Math.floor(100 + Math.random() * 900);
    const mpesaReceipt = `MPESA-B2C-QK${randomChars}${randomDigits}`;
    const nowStr = new Date().toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' EAT';

    setPayouts((prev) =>
      prev.map((p) =>
        p.id === payoutId
          ? {
              ...p,
              status: 'released' as const,
              mpesa_receipt: mpesaReceipt,
              release_time: `Released via M-Pesa Disbursal (${nowStr})`,
              released_at: nowStr,
              approved_by: currentUser.name || 'Isa Mohamed (Admin)',
              flag_reason: undefined,
            }
          : p
      )
    );

    return { success: true, code: mpesaReceipt };
  };

  const flagAdminPayout = (payoutId: string, reason: string) => {
    setPayouts((prev) =>
      prev.map((p) =>
        p.id === payoutId
          ? {
              ...p,
              status: 'flagged' as const,
              flag_reason: reason,
              release_time: 'Escrow Safeguard Hold',
            }
          : p
      )
    );
  };

  const unflagAdminPayout = (payoutId: string) => {
    const futureRelease = new Date();
    futureRelease.setHours(futureRelease.getHours() + 24);
    const releaseTimeStr = futureRelease.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' EAT';

    setPayouts((prev) =>
      prev.map((p) =>
        p.id === payoutId
          ? {
              ...p,
              status: 'pending' as const,
              flag_reason: undefined,
              release_time: releaseTimeStr,
            }
          : p
      )
    );
  };

  const refundAdminUnlock = async (unlockId: string, reason: string) => {
    const refundRef = `REFUND-MPESA-QK${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Mark unlock as refunded
    setUnlocks((prev) =>
      prev.map((u) =>
        u.id === unlockId
          ? {
              ...u,
              is_refunded: true,
              refund_reason: reason,
              refund_reference: refundRef,
            }
          : u
      )
    );

    // Update associated payout to refunded / cancelled
    setPayouts((prev) =>
      prev.map((p) =>
        p.unlock_id === unlockId
          ? {
              ...p,
              status: 'refunded' as const,
              refund_reason: `Seeker refunded 100%: ${reason}`,
              release_time: 'Refunded to Seeker M-Pesa',
            }
          : p
      )
    );

    return { success: true, ref: refundRef };
  };

  const updateUserTrustTier = (userId: string, newScore: number, status: User['verification_status']) => {
    const tierInfo = getTrustTierInfo(newScore, status !== 'unverified');
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              trust_score: newScore,
              verification_status: status,
              trust_tier: tierInfo.tier,
            }
          : u
      )
    );
  };

  const updateUserTrack = (
    userId: string,
    track: UserTrack,
    agencyData?: {
      agency_name?: string;
      business_reg_number?: string;
      agency_verified?: boolean;
    }
  ) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const updated: User = {
          ...u,
          track,
          agency_name: agencyData?.agency_name ?? u.agency_name,
          business_reg_number: agencyData?.business_reg_number ?? u.business_reg_number,
          agency_verified:
            agencyData?.agency_verified !== undefined
              ? agencyData.agency_verified
              : track === 'partner',
        };
        const posterListings = listings.filter((l) => l.poster_id === userId);
        const tierInfo = getUserTrackTierInfo(
          updated,
          posterListings.length || updated.total_listings || 0,
          economicsConfig
        );
        updated.trust_tier = tierInfo.tier;
        return updated;
      })
    );
  };

  const updateEconomicsConfig = (newConfig: Partial<EconomicsConfig>) => {
    setEconomicsConfig((prev) => ({
      ...prev,
      ...newConfig,
      lastUpdated: new Date().toISOString(),
      updatedBy: `${currentUser.name} (Isa Mohamed Admin)`,
    }));
  };

  const resetEconomicsConfig = () => {
    setEconomicsConfig(DEFAULT_ECONOMICS_CONFIG);
  };

  const getAdminPlatformStats = () => {
    const totalUnlocksVolume = unlocks.reduce((sum, u) => sum + u.amount_paid, 0);
    const escrowHeld = payouts
      .filter((p) => p.status === 'pending' || p.status === 'flagged')
      .reduce((sum, p) => sum + p.amount, 0);
    const totalDisbursed = payouts
      .filter((p) => p.status === 'released')
      .reduce((sum, p) => sum + p.amount, 0);
    const totalKiotaRevenue = Math.max(0, totalUnlocksVolume - totalDisbursed - escrowHeld);

    const pendingListingsCount = listings.filter((l) => l.status === 'pending_review').length;
    const activeListingsCount = listings.filter((l) => l.status === 'active').length;
    const rejectedListingsCount = listings.filter((l) => l.status === 'rejected').length;
    const totalUsersCount = users.length;
    const verifiedUsersCount = users.filter((u) => u.verification_status === 'verified' || u.verification_status === 'top_rated').length;
    const pendingKycCount = users.filter((u) => u.verification_status === 'pending_verification').length;
    const disputeCount = payouts.filter((p) => p.status === 'flagged' || p.status === 'refunded').length;

    return {
      totalUnlocksVolume,
      totalEscrowHeld: escrowHeld,
      totalDisbursed,
      totalKiotaRevenue,
      pendingListingsCount,
      activeListingsCount,
      rejectedListingsCount,
      totalUsersCount,
      verifiedUsersCount,
      pendingKycCount,
      disputeCount,
    };
  };

  const submitReview = (
    listingId: string,
    accurate: boolean,
    rating: number,
    comment: string
  ) => {
    const newReview: Review = {
      id: `review-${Date.now()}`,
      listing_id: listingId,
      seeker_id: currentUser.id,
      seeker_name: currentUser.name,
      accurate,
      rating,
      comment,
      created_at: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);

    const listing = listings.find((l) => l.id === listingId);
    if (listing) {
      const posterId = listing.poster_id;
      const posterListingsIds = listings
        .filter((l) => l.poster_id === posterId)
        .map((l) => l.id);
      const allPosterReviews = [...reviews, newReview].filter((r) =>
        posterListingsIds.includes(r.listing_id)
      );
      const accurateCount = allPosterReviews.filter((r) => r.accurate).length;
      const accuratePercent = Math.round((accurateCount / allPosterReviews.length) * 100);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === posterId
            ? { ...u, trust_score: Math.max(75, Math.min(100, accuratePercent)) }
            : u
        )
      );
    }
  };

  const requestMpesaWithdrawal = async (posterId: string) => {
    const pendingItems = payouts.filter(
      (p) => p.poster_id === posterId && p.status === 'pending'
    );
    if (pendingItems.length === 0) {
      return { success: false, code: '' };
    }

    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomDigits = Math.floor(100 + Math.random() * 900);
    const mpesaReceipt = `MPESA-B2C-QK${randomChars}${randomDigits}`;

    setPayouts((prev) =>
      prev.map((p) =>
        p.poster_id === posterId && p.status === 'pending'
          ? {
              ...p,
              status: 'released',
              mpesa_receipt: mpesaReceipt,
              release_time: 'Released via M-Pesa Instant (Now)',
            }
          : p
      )
    );

    return { success: true, code: mpesaReceipt };
  };

  const getPosterStats = (posterId: string) => {
    const poster = users.find((u) => u.id === posterId) || currentUser;
    const posterListings = listings.filter((l) => l.poster_id === posterId);
    const tierInfo = getUserTrackTierInfo(
      poster,
      posterListings.length || poster?.total_listings || 0,
      economicsConfig
    );

    const posterPayouts = payouts.filter((p) => p.poster_id === posterId);
    const totalEarned = posterPayouts.reduce((sum, p) => sum + p.amount, 0);
    const pendingPayouts = posterPayouts
      .filter((p) => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);
    const releasedPayouts = posterPayouts
      .filter((p) => p.status === 'released')
      .reduce((sum, p) => sum + p.amount, 0);

    const posterListingsIds = listings
      .filter((l) => l.poster_id === posterId)
      .map((l) => l.id);
    const posterUnlocks = unlocks.filter((u) =>
      posterListingsIds.includes(u.listing_id)
    );
    const posterReviews = reviews.filter((r) =>
      posterListingsIds.includes(r.listing_id)
    );

    const accurateReviews = posterReviews.filter((r) => r.accurate).length;
    const accuracyRating =
      posterReviews.length > 0
        ? Math.round((accurateReviews / posterReviews.length) * 100)
        : 100;

    return {
      totalEarned,
      pendingPayouts,
      releasedPayouts,
      unlocksCount: posterUnlocks.length,
      accuracyRating,
      reviewsCount: posterReviews.length,
      tierInfo,
    };
  };

  const getListingEarnings = (listingId: string): ListingEarningsInfo => {
    const listing = listings.find((l) => l.id === listingId);
    const listingUnlocks = unlocks.filter((u) => u.listing_id === listingId);
    const unlockIds = listingUnlocks.map((u) => u.id);

    const listingPayouts = payouts.filter(
      (p) => unlockIds.includes(p.unlock_id) || (listing && p.listing_title && p.listing_title === listing.title)
    );

    let totalEarned = listingPayouts.reduce((sum, p) => sum + p.amount, 0);
    let pendingAmount = listingPayouts
      .filter((p) => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);
    let releasedAmount = listingPayouts
      .filter((p) => p.status === 'released')
      .reduce((sum, p) => sum + p.amount, 0);

    if (totalEarned === 0 && listingUnlocks.length > 0) {
      const poster = users.find((u) => u.id === listing?.poster_id);
      const tierInfo = getUserTrackTierInfo(poster, 4, economicsConfig);
      const perUnlockRate = Math.round(300 * (tierInfo.earnShare / 100));
      totalEarned = listingUnlocks.length * perUnlockRate;
      pendingAmount = Math.round(totalEarned * 0.3);
      releasedAmount = totalEarned - pendingAmount;
    }

    return {
      listingId,
      totalUnlocks: listingUnlocks.length,
      totalEarned,
      pendingAmount,
      releasedAmount,
      monthlyUnlocks: listingUnlocks.length,
      viewCount: listing?.view_count || (listingUnlocks.length * 18 + 35),
    };
  };

  const createSupportTicket = (data: {
    category: TicketCategory;
    subject: string;
    message: string;
    listingId?: string;
    unlockId?: string;
  }): SupportTicket => {
    const listing = listings.find((l) => l.id === data.listingId);
    const now = new Date().toISOString();
    const newTicket: SupportTicket = {
      id: `ticket-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      userRole: currentUser.role,
      category: data.category,
      subject: data.subject,
      status: 'open',
      createdAt: now,
      lastActivityAt: now,
      listingId: data.listingId,
      listingTitle: listing?.title,
      unlockId: data.unlockId,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderRole: currentUser.role,
          text: data.message,
          timestamp: now,
        },
      ],
    };

    setTimeout(() => {
      let autoReply =
        'Jambo! Thank you for contacting Kiota Kenya Support Desk. An officer has been assigned to your ticket and will assist you shortly.';
      if (data.category === 'escrow_refund') {
        autoReply =
          'Jambo! Your Escrow Refund Dispute has been logged under Kiota 24-Hour Guarantee (compliant with Kenya Consumer Protection Act 2012). We are cross-referencing on-site GPS and landlord confirmation. If verified inaccurate or occupied, your KES 300 will be instantly refunded to your M-Pesa line.';
      } else if (data.category === 'listing_approval') {
        autoReply =
          'Habari! We review all video camera watermarks and GPS coordinates against our anti-broker spoofing guidelines within 2 to 4 hours. If everything matches, your listing goes live immediately!';
      } else if (data.category === 'payout_delay') {
        autoReply =
          'Jambo! Payouts are quarantined for 24 hours to protect seekers. Once the 24-hour verification window closes with zero disputes, you can disburse instantly to M-Pesa B2C.';
      } else if (data.category === 'report_broker') {
        autoReply =
          "Thank you for reporting broker extortion. Kiota strictly prohibits middleman gatekeeping or viewing fees ('pesa ya kuona'). We will investigate and blacklist the reported party.";
      }

      setTickets((prev) =>
        prev.map((t) =>
          t.id === newTicket.id
            ? {
                ...t,
                status: 'in_progress',
                lastActivityAt: new Date().toISOString(),
                messages: [
                  ...t.messages,
                  {
                    id: `msg-resp-${Date.now()}`,
                    senderId: 'user-admin-isa',
                    senderName: 'Kiota Concierge Desk (Nairobi)',
                    senderRole: 'support',
                    isAdminResponse: true,
                    text: autoReply,
                    timestamp: new Date().toISOString(),
                  },
                ],
              }
            : t
        )
      );
    }, 1000);

    setTickets((prev) => [newTicket, ...prev]);
    return newTicket;
  };

  const replyToTicket = (ticketId: string, message: string, isAdmin: boolean = false) => {
    const now = new Date().toISOString();
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              lastActivityAt: now,
              status: isAdmin ? 'in_progress' : t.status,
              messages: [
                ...t.messages,
                {
                  id: `msg-${Date.now()}`,
                  senderId: currentUser.id,
                  senderName: isAdmin ? `${currentUser.name} (Kiota Admin)` : currentUser.name,
                  senderRole: isAdmin ? 'support' : currentUser.role,
                  isAdminResponse: isAdmin,
                  text: message,
                  timestamp: now,
                },
              ],
            }
          : t
      )
    );
  };

  const resolveTicket = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'resolved' as const } : t))
    );
  };

  const openSupportChat = (category?: TicketCategory, listingId?: string) => {
    setSupportInitialCategory(category);
    setSupportInitialListingId(listingId);
    setShowSupportModal(true);
  };

  const getTierConcentrationAnalytics = (): TierConcentrationAnalytics => {
    const totalUnlocks = unlocks.length;
    const totalRevenue = unlocks.reduce((sum, u) => sum + u.amount_paid, 0);
    const totalDisbursedOrPending = payouts
      .filter((p) => p.status === 'released' || p.status === 'pending' || p.status === 'flagged')
      .reduce((sum, p) => sum + p.amount, 0);
    const platformMargin = Math.max(0, totalRevenue - totalDisbursedOrPending);

    type TierGroupKey =
      | 'partner_platinum'
      | 'partner_gold'
      | 'partner_silver'
      | 'partner_bronze'
      | 'community_gold'
      | 'community_silver'
      | 'community_bronze';

    const tierGroups: Record<TierGroupKey, {
      name: string;
      track: UserTrack;
      tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
      unlockCount: number;
      grossRevenue: number;
      payoutsAmount: number;
      baseEarnPercent: number;
    }> = {
      partner_platinum: {
        name: 'Partner Platinum (40+ listings)',
        track: 'partner',
        tier: 'Platinum',
        unlockCount: 0,
        grossRevenue: 0,
        payoutsAmount: 0,
        baseEarnPercent: economicsConfig.partnerTrack.tiers.platinum.earnPercent,
      },
      partner_gold: {
        name: 'Partner Gold (30–39 listings)',
        track: 'partner',
        tier: 'Gold',
        unlockCount: 0,
        grossRevenue: 0,
        payoutsAmount: 0,
        baseEarnPercent: economicsConfig.partnerTrack.tiers.gold.earnPercent,
      },
      partner_silver: {
        name: 'Partner Silver (15–29 listings)',
        track: 'partner',
        tier: 'Silver',
        unlockCount: 0,
        grossRevenue: 0,
        payoutsAmount: 0,
        baseEarnPercent: economicsConfig.partnerTrack.tiers.silver.earnPercent,
      },
      partner_bronze: {
        name: 'Partner Bronze (0–14 listings)',
        track: 'partner',
        tier: 'Bronze',
        unlockCount: 0,
        grossRevenue: 0,
        payoutsAmount: 0,
        baseEarnPercent: economicsConfig.partnerTrack.tiers.bronze.earnPercent,
      },
      community_gold: {
        name: 'Community Gold (8+ listings)',
        track: 'community',
        tier: 'Gold',
        unlockCount: 0,
        grossRevenue: 0,
        payoutsAmount: 0,
        baseEarnPercent: economicsConfig.communityTrack.tiers.gold.earnPercent,
      },
      community_silver: {
        name: 'Community Silver (3–7 listings)',
        track: 'community',
        tier: 'Silver',
        unlockCount: 0,
        grossRevenue: 0,
        payoutsAmount: 0,
        baseEarnPercent: economicsConfig.communityTrack.tiers.silver.earnPercent,
      },
      community_bronze: {
        name: 'Community Bronze (0–2 listings)',
        track: 'community',
        tier: 'Bronze',
        unlockCount: 0,
        grossRevenue: 0,
        payoutsAmount: 0,
        baseEarnPercent: economicsConfig.communityTrack.tiers.bronze.earnPercent,
      },
    };

    unlocks.forEach((u) => {
      const listing = listings.find((l) => l.id === u.listing_id);
      const poster = listing ? users.find((usr) => usr.id === listing.poster_id) : null;
      const payout = payouts.find((p) => p.unlock_id === u.id);

      const track: UserTrack = payout?.track_at_time || poster?.track || 'community';
      let tierName = payout?.tier_at_time;
      if (!tierName) {
        const posterListingsCount = listing ? listings.filter((l) => l.poster_id === listing.poster_id).length : 0;
        const tierInfo = getUserTrackTierInfo(poster, posterListingsCount, economicsConfig);
        tierName = tierInfo.tier;
      }

      let key: TierGroupKey = 'community_bronze';
      if (track === 'partner') {
        if (tierName === 'Platinum') key = 'partner_platinum';
        else if (tierName === 'Gold') key = 'partner_gold';
        else if (tierName === 'Silver') key = 'partner_silver';
        else key = 'partner_bronze';
      } else {
        if (tierName === 'Gold' || tierName === 'Platinum') key = 'community_gold';
        else if (tierName === 'Silver') key = 'community_silver';
        else key = 'community_bronze';
      }

      tierGroups[key].unlockCount += 1;
      tierGroups[key].grossRevenue += u.amount_paid;
      if (payout) {
        tierGroups[key].payoutsAmount += payout.amount;
      }
    });

    const maxTierTriggerThreshold = economicsConfig.concentrationReviewTriggers.maxSingleTierVolumePercent;
    const maxHostTriggerThreshold = economicsConfig.concentrationReviewTriggers.maxSingleHostRevenuePercent;
    const monthlyCapThreshold = economicsConfig.monthlyVolumeCap?.thresholdUnlocks || 20;

    const tierBreakdown: TierConcentrationItem[] = Object.entries(tierGroups).map(([key, data]) => {
      const unlockPercent = totalUnlocks > 0 ? (data.unlockCount / totalUnlocks) * 100 : 0;
      const revenuePercent = totalRevenue > 0 ? (data.grossRevenue / totalRevenue) * 100 : 0;
      const exceedsTrigger = unlockPercent > maxTierTriggerThreshold;

      return {
        tierKey: key,
        name: data.name,
        track: data.track,
        tier: data.tier,
        unlockCount: data.unlockCount,
        unlockPercent: Math.round(unlockPercent * 10) / 10,
        grossRevenue: data.grossRevenue,
        revenuePercent: Math.round(revenuePercent * 10) / 10,
        payoutsAmount: data.payoutsAmount,
        baseEarnPercent: data.baseEarnPercent,
        exceedsTrigger,
        isBreached: exceedsTrigger,
        volume: data.grossRevenue,
        percentageOfTotal: Math.round(unlockPercent * 10) / 10,
      };
    });

    const hostMap: Record<string, {
      hostId: string;
      hostName: string;
      agencyName?: string;
      track: UserTrack;
      tier: TrustTier;
      listingCount: number;
      unlockCount: number;
      grossRevenue: number;
      hostPayoutTotal: number;
    }> = {};

    unlocks.forEach((u) => {
      const listing = listings.find((l) => l.id === u.listing_id);
      if (!listing) return;
      const posterId = listing.poster_id;
      const poster = users.find((usr) => usr.id === posterId);
      const posterListings = listings.filter((l) => l.poster_id === posterId);
      const tierInfo = getUserTrackTierInfo(poster, posterListings.length, economicsConfig);
      const payout = payouts.find((p) => p.unlock_id === u.id);

      if (!hostMap[posterId]) {
        hostMap[posterId] = {
          hostId: posterId,
          hostName: poster?.name || 'Unknown Host',
          agencyName: poster?.agency_name,
          track: poster?.track || 'community',
          tier: tierInfo.tier,
          listingCount: posterListings.length || poster?.total_listings || 0,
          unlockCount: 0,
          grossRevenue: 0,
          hostPayoutTotal: 0,
        };
      }

      hostMap[posterId].unlockCount += 1;
      hostMap[posterId].grossRevenue += u.amount_paid;
      if (payout) {
        hostMap[posterId].hostPayoutTotal += payout.amount;
      }
    });

    const topHosts: HostConcentrationItem[] = Object.values(hostMap)
      .map((h) => {
        const unlockPercent = totalUnlocks > 0 ? (h.unlockCount / totalUnlocks) * 100 : 0;
        const revenuePercent = totalRevenue > 0 ? (h.grossRevenue / totalRevenue) * 100 : 0;
        const exceedsTrigger = revenuePercent > maxHostTriggerThreshold;

        return {
          ...h,
          userId: h.hostId,
          userName: h.hostName,
          monthlyUnlockCount: h.unlockCount,
          monthlyRevenue: h.grossRevenue,
          percentageOfTotalRevenue: Math.round(revenuePercent * 10) / 10,
          unlockPercent: Math.round(unlockPercent * 10) / 10,
          revenuePercent: Math.round(revenuePercent * 10) / 10,
          exceedsTrigger,
          isBreached: exceedsTrigger,
          isOverVolumeCap: h.unlockCount > monthlyCapThreshold,
        };
      })
      .sort((a, b) => b.grossRevenue - a.grossRevenue);

    const singleHighestVolumeHost = topHosts.length > 0 ? topHosts[0] : null;
    const singleHighestVolumeTier = [...tierBreakdown].sort((a, b) => b.unlockCount - a.unlockCount)[0] || null;

    const trippedTiers = tierBreakdown.filter((t) => t.exceedsTrigger && t.unlockCount > 0);
    const tierTriggerTripped = trippedTiers.length > 0;
    const hostTriggerTripped = singleHighestVolumeHost
      ? singleHighestVolumeHost.revenuePercent > maxHostTriggerThreshold
      : false;
    const isTriggered = tierTriggerTripped || hostTriggerTripped;

    const deadline = new Date();
    deadline.setDate(deadline.getDate() + (economicsConfig.concentrationReviewTriggers?.reviewWindowDays || 14));
    const reviewDeadlineDate = deadline.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    let tierTriggerDetail: string | undefined = undefined;
    if (tierTriggerTripped) {
      const highestTripped = trippedTiers.sort((a, b) => b.unlockPercent - a.unlockPercent)[0];
      tierTriggerDetail = `${highestTripped.name} commands ${highestTripped.unlockPercent}% of monthly unlock transactions (exceeds ${maxTierTriggerThreshold}% threshold).`;
    }

    let hostTriggerDetail: string | undefined = undefined;
    if (hostTriggerTripped && singleHighestVolumeHost) {
      hostTriggerDetail = `Top host ${singleHighestVolumeHost.hostName} accounts for ${singleHighestVolumeHost.revenuePercent}% of total unlock revenue (exceeds ${maxHostTriggerThreshold}% threshold).`;
    }

    const reasons: string[] = [tierTriggerDetail, hostTriggerDetail].filter(Boolean) as string[];

    let actionPlan = 'Volume concentration is well-distributed within safeguard boundaries.';
    if (isTriggered) {
      actionPlan = `Concentration review mandatory within 14 days (by ${reviewDeadlineDate}). Recommended actions: Tune monthly volume step-down threshold (e.g. from ${economicsConfig.monthlyVolumeCap.thresholdUnlocks} to 15 unlocks), adjust top-tier earn percentages by 5%, or expand community caretaker acquisition.`;
    }

    return {
      periodLabel: new Date().toLocaleString('en-GB', { month: 'long', year: 'numeric' }),
      totalUnlocks,
      totalMonthlyUnlocks: totalUnlocks,
      totalRevenue,
      totalMonthlyVolume: totalRevenue,
      totalDisbursedOrPending,
      platformMargin,
      tierBreakdown,
      tierDistribution: tierBreakdown,
      totalSharersCount: Object.keys(hostMap).length,
      monthlyVolumeCapThreshold: monthlyCapThreshold,
      topHosts,
      singleHighestVolumeHost,
      singleHighestVolumeTier,
      reviewTriggers: {
        isTriggered,
        tierTriggerTripped,
        hostTriggerTripped,
        reasons,
        tierTriggerDetail,
        hostTriggerDetail,
        maxTierVolumePercent: maxTierTriggerThreshold,
        maxHostRevenuePercent: maxHostTriggerThreshold,
        reviewDeadlineDate,
        actionPlan,
      },
    };
  };

  const resetToDefaults = () => {
    setUsers(SEED_USERS);
    setCurrentUserId('user-admin-isa');
    setListings(SEED_LISTINGS);
    setMedia(SEED_MEDIA);
    setUnlocks(SEED_UNLOCKS);
    setPayouts(SEED_PAYOUTS);
    setReviews(SEED_REVIEWS);
    setEconomicsConfig(DEFAULT_ECONOMICS_CONFIG);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        users,
        currentUser,
        listings,
        media,
        unlocks,
        payouts,
        reviews,
        economicsConfig,
        activeTab,
        setActiveTab,
        selectedListingId,
        openListingDetail,
        closeListingDetail,
        viewMode,
        setViewMode,
        activeCategory,
        setActiveCategory,
        searchArea,
        setSearchArea,
        budgetRange,
        setBudgetRange,
        switchUser,
        logout,
        deleteUser,
        loginWithPhone,
        submitKycVerification,
        approveKyc,
        rejectKyc,
        isUnlockedBySeeker,
        unlockListing,
        createListing,
        createAdminListing,
        addMediaToListing,
        removeMediaFromListing,
        approveListing,
        denyListing,
        deleteListing,
        submitReview,
        requestMpesaWithdrawal,
        releaseAdminPayout,
        flagAdminPayout,
        unflagAdminPayout,
        refundAdminUnlock,
        updateUserTrustTier,
        updateUserTrack,
        updateEconomicsConfig,
        resetEconomicsConfig,
        getPosterStats,
        getListingEarnings,
        createSupportTicket,
        replyToTicket,
        resolveTicket,
        tickets,
        showTermsModal,
        setShowTermsModal,
        showSupportModal,
        setShowSupportModal,
        supportInitialCategory,
        supportInitialListingId,
        openSupportChat,
        getAdminPlatformStats,
        getTierConcentrationAnalytics,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
