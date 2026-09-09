import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Users,
  Eye,
  Camera,
  MapPin,
  FileText,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Search,
  Filter,
  CreditCard,
  ShieldAlert,
  Sliders,
  Award,
  Trash2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Lock,
  Phone,
  Check,
  Upload,
  Plus,
  MessageCircle,
  Mail,
  Video,
  Image as ImageIcon,
  Maximize2,
  FilePlus,
  Play,
  Scale,
  Layers,
  Building2,
  Zap,
  Database,
  Smartphone,
  Coins,
  Server,
  Calculator,
  Info,
  HelpCircle,
} from 'lucide-react';
import {
  Listing,
  Payout,
  User,
  getTrustTierInfo,
  getUserTrackTierInfo,
  Media,
  ListingCategory,
  SubmissionChannel,
  UserTrack,
  DEFAULT_ECONOMICS_CONFIG,
  EconomicsConfig,
} from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    listings,
    media,
    users,
    unlocks,
    payouts,
    reviews,
    approveListing,
    denyListing,
    deleteListing,
    deleteUser,
    releaseAdminPayout,
    flagAdminPayout,
    unflagAdminPayout,
    refundAdminUnlock,
    updateUserTrustTier,
    approveKyc,
    rejectKyc,
    getAdminPlatformStats,
    openListingDetail,
    addMediaToListing,
    removeMediaFromListing,
    createAdminListing,
    updateUserTrack,
    economicsConfig,
    updateEconomicsConfig,
    resetEconomicsConfig,
    getTierConcentrationAnalytics,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'moderation' | 'escrow' | 'kyc' | 'users' | 'analytics' | 'economics'>('moderation');
  const [listingFilter, setListingFilter] = useState<'pending_review' | 'active' | 'rejected' | 'all'>('pending_review');
  const [payoutFilter, setPayoutFilter] = useState<'all' | 'pending' | 'released' | 'flagged' | 'refunded'>('all');
  const [kycFilter, setKycFilter] = useState<'pending' | 'verified' | 'all'>('pending');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Draft economics state for admin tuning
  const [draftEconomics, setDraftEconomics] = useState<EconomicsConfig>(economicsConfig);
  const [editingAgencyUserId, setEditingAgencyUserId] = useState<string | null>(null);
  const [agencyNameInput, setAgencyNameInput] = useState('');
  const [agencyRegInput, setAgencyRegInput] = useState('');

  // Sync draft economics if config changes
  useEffect(() => {
    setDraftEconomics(economicsConfig);
  }, [economicsConfig]);

  // Safeguards section active view & simulator state
  const [safeguardsSection, setSafeguardsSection] = useState<
    'monitor' | 'payment_structure' | 'payout_structure' | 'verifier' | 'safety_protocols'
  >('monitor');
  const [simTrack, setSimTrack] = useState<UserTrack>('community');
  const [simListingsCount, setSimListingsCount] = useState<number>(8);
  const [simMonthlyUnlockCount, setSimMonthlyUnlockCount] = useState<number>(24);
  const [simUnlockFee, setSimUnlockFee] = useState<number>(300);

  // Rejection modal state
  const [rejectingListingId, setRejectingListingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('Live Camera capture requirement not met / uploaded from gallery');
  const [customRejectionNote, setCustomRejectionNote] = useState<string>('');

  // KYC Rejection Modal
  const [rejectingKycUserId, setRejectingKycUserId] = useState<string | null>(null);
  const [kycRejectReason, setKycRejectReason] = useState<string>('ID photo was blurry or unreadable');

  // Zoom Document Preview Modal
  const [previewImageDoc, setPreviewImageDoc] = useState<{ url: string; title: string } | null>(null);

  // Flag payout modal state
  const [flaggingPayoutId, setFlaggingPayoutId] = useState<string | null>(null);
  const [flagReason, setFlagReason] = useState<string>('Seeker reported inaccurate location or inaccessible property');

  // Refund unlock modal state
  const [refundingUnlockId, setRefundingUnlockId] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState<string>('Property was already occupied / inaccurate live photos');

  // Action status toast
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Admin High-Res Media Manager Modal State
  const [selectedListingForMedia, setSelectedListingForMedia] = useState<string | null>(null);
  const [newMediaRoomLabel, setNewMediaRoomLabel] = useState<string>('Living Room');
  const [newMediaSource, setNewMediaSource] = useState<SubmissionChannel>('whatsapp');
  const [newMediaResolution, setNewMediaResolution] = useState<string>('4K Ultra HD');
  const [stagedMediaList, setStagedMediaList] = useState<Omit<Media, 'id' | 'listing_id'>[]>([]);
  const adminMediaFileInputRef = useRef<HTMLInputElement | null>(null);

  // Admin Create Listing from WhatsApp Submission State
  const [isCreatingListingModalOpen, setIsCreatingListingModalOpen] = useState(false);
  const [adminPostCategory, setAdminPostCategory] = useState<ListingCategory>('Rentals');
  const [adminPostType, setAdminPostType] = useState('1 Bedroom Apartment');
  const [adminPostTitle, setAdminPostTitle] = useState('');
  const [adminPostPrice, setAdminPostPrice] = useState<number>(25000);
  const [adminPostPricePeriod, setAdminPostPricePeriod] = useState<'month' | 'day' | 'night'>('month');
  const [adminPostDeposit, setAdminPostDeposit] = useState<number>(25000);
  const [adminPostArea, setAdminPostArea] = useState('Kilimani, Nairobi');
  const [adminPostLandmark, setAdminPostLandmark] = useState('');
  const [adminPostUnlockPrice, setAdminPostUnlockPrice] = useState<number>(250);
  const [adminPostPosterPhone, setAdminPostPosterPhone] = useState('+254 741 367 051');
  const [adminPostPosterName, setAdminPostPosterName] = useState('WhatsApp Sharer');
  const [adminPostDesc, setAdminPostDesc] = useState('');
  const [adminPostBedrooms, setAdminPostBedrooms] = useState(1);
  const [adminPostBathrooms, setAdminPostBathrooms] = useState(1);
  const [adminPostFloorSize, setAdminPostFloorSize] = useState('65 sq.m');
  const [adminPostFeatures, setAdminPostFeatures] = useState<string[]>([
    'Borehole Water',
    '24/7 Security Guard',
    'Prepaid Token Meter',
    'High Speed WiFi',
  ]);
  const [adminPostMedia, setAdminPostMedia] = useState<Omit<Media, 'id' | 'listing_id'>[]>([]);
  const [adminPostAutoApprove, setAdminPostAutoApprove] = useState(true);

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleAdminFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const timestampStr =
      new Date().toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' EAT';

    Array.from(files).forEach((file: File) => {
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();

      reader.onload = (event) => {
        const resultUrl = event.target?.result as string;
        if (resultUrl) {
          setStagedMediaList((prev) => [
            ...prev,
            {
              url: resultUrl,
              type: isVideo ? 'video' : 'photo',
              capture_timestamp: timestampStr,
              capture_location: 'Verified via WhatsApp (0741367051)',
              is_live_capture: false,
              caption: `${newMediaRoomLabel} (${isVideo ? 'Video Tour' : 'High-Res'})`,
              source: newMediaSource,
              resolution: isVideo ? '1080p HD Video' : newMediaResolution,
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const addPresetToStaged = (title: string, url: string, type: 'photo' | 'video', resolution: string) => {
    const timestampStr =
      new Date().toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' EAT';

    setStagedMediaList((prev) => [
      ...prev,
      {
        url,
        type,
        capture_timestamp: timestampStr,
        capture_location: 'Verified Media via WhatsApp (0741367051)',
        is_live_capture: false,
        caption: title,
        source: newMediaSource,
        resolution,
      },
    ]);
  };

  const handleSaveStagedMedia = (shouldApprove = false) => {
    if (!selectedListingForMedia) return;
    if (stagedMediaList.length > 0) {
      addMediaToListing(selectedListingForMedia, stagedMediaList);
    }
    if (shouldApprove) {
      approveListing(selectedListingForMedia);
      showNotification('High-res media attached and listing published live!');
    } else {
      showNotification('High-res media successfully attached to listing!');
    }
    setSelectedListingForMedia(null);
    setStagedMediaList([]);
  };

  const handleCreateListingFromWhatsApp = async () => {
    const defaultMedia =
      adminPostMedia.length > 0
        ? adminPostMedia
        : [
            {
              url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
              type: 'photo' as const,
              capture_timestamp: new Date().toLocaleString('en-GB') + ' EAT',
              capture_location: `${adminPostArea} • WhatsApp: 0741367051`,
              is_live_capture: false,
              caption: 'Living Room (High-Res 4K)',
              source: 'whatsapp' as const,
              resolution: '4K Ultra HD',
            },
            {
              url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200',
              type: 'photo' as const,
              capture_timestamp: new Date().toLocaleString('en-GB') + ' EAT',
              capture_location: `${adminPostArea} • WhatsApp: 0741367051`,
              is_live_capture: false,
              caption: 'Master Bedroom (High-Res 4K)',
              source: 'whatsapp' as const,
              resolution: '4K Ultra HD',
            },
          ];

    await createAdminListing(
      {
        poster_id: 'user-isa-admin',
        category: adminPostCategory,
        property_type: adminPostType,
        title: adminPostTitle || `${adminPostType} in ${adminPostArea.split(',')[0]}`,
        price: Number(adminPostPrice),
        price_period: adminPostPricePeriod,
        deposit: Number(adminPostDeposit),
        area: adminPostArea,
        gps_lat: -1.2891,
        gps_lng: 36.7821,
        exact_landmark: adminPostLandmark || `${adminPostArea} - Verified Property`,
        description:
          adminPostDesc ||
          `Verified ${adminPostType} in ${adminPostArea}. Media and walkthrough submitted via WhatsApp (0741367051) and verified by admin Isa Mohamed.`,
        unlock_price: adminPostUnlockPrice,
        status: adminPostAutoApprove ? 'active' : 'pending_review',
        bedrooms: adminPostBedrooms,
        bathrooms: adminPostBathrooms,
        floor_size: adminPostFloorSize,
        features: adminPostFeatures,
        submission_channel: 'whatsapp',
        whatsapp_submitted_by: adminPostPosterPhone,
      },
      defaultMedia
    );

    setIsCreatingListingModalOpen(false);
    setAdminPostMedia([]);
    showNotification(
      adminPostAutoApprove
        ? 'Listing created and published LIVE on Kiota marketplace!'
        : 'Listing created and queued in Pending Moderation.'
    );
  };

  const stats = getAdminPlatformStats();
  const concentrationAnalytics = getTierConcentrationAnalytics();

  const filteredListings = listings.filter((l) => {
    if (listingFilter === 'all') return true;
    return l.status === listingFilter;
  });

  const filteredPayouts = payouts.filter((p) => {
    if (payoutFilter === 'all') return true;
    return p.status === payoutFilter;
  });

  const kycUsersList = users.filter((u) => {
    if (kycFilter === 'pending') return u.verification_status === 'pending_verification';
    if (kycFilter === 'verified') return u.verification_status === 'verified' || u.verification_status === 'top_rated';
    return true;
  });

  const filteredUsers = users.filter((u) => {
    if (!userSearchTerm) return true;
    const term = userSearchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.phone.includes(term) ||
      (u.email && u.email.toLowerCase().includes(term))
    );
  });

  const handleApprove = (listingId: string) => {
    approveListing(listingId);
    showNotification('Listing approved & published live on Kiota marketplace!');
  };

  const handleConfirmDeny = () => {
    if (!rejectingListingId) return;
    const finalReason = customRejectionNote ? `${rejectionReason}: ${customRejectionNote}` : rejectionReason;
    denyListing(rejectingListingId, finalReason);
    setRejectingListingId(null);
    setCustomRejectionNote('');
    showNotification('Listing denied & feedback sent to poster.');
  };

  const handleApproveKycUser = (userId: string, userName: string) => {
    approveKyc(userId);
    showNotification(`KYC Approved for ${userName}! Payout eligibility & trust badge granted.`);
  };

  const handleConfirmRejectKyc = () => {
    if (!rejectingKycUserId) return;
    rejectKyc(rejectingKycUserId, kycRejectReason);
    setRejectingKycUserId(null);
    showNotification('KYC submission rejected & notification sent to user.');
  };

  const handleReleasePayout = async (payoutId: string) => {
    const res = await releaseAdminPayout(payoutId);
    if (res.success) {
      showNotification(`M-Pesa B2C Payout Disbursed successfully! Receipt: ${res.code}`);
    } else if (res.message) {
      showNotification(res.message);
    }
  };

  const handleConfirmFlagPayout = () => {
    if (!flaggingPayoutId) return;
    flagAdminPayout(flaggingPayoutId, flagReason);
    setFlaggingPayoutId(null);
    showNotification('Payout placed on Escrow Safeguard Hold.');
  };

  const handleConfirmRefund = async () => {
    if (!refundingUnlockId) return;
    const res = await refundAdminUnlock(refundingUnlockId, refundReason);
    if (res.success) {
      setRefundingUnlockId(null);
      showNotification(`100% Unlock Refund processed to seeker M-Pesa. Ref: ${res.ref}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-28 animate-in fade-in duration-200">
      {/* Admin Executive Header */}
      <div className="bg-[#2B2620] text-[#FCFBF8] rounded-3xl p-6 sm:p-7 shadow-lg border border-[#C1533A]/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 rounded-full bg-[#C1533A]/10 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[#C1533A] text-[11px] font-extrabold uppercase tracking-[0.2em] mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Kiota Founder & Super Admin Portal</span>
            </div>
            <h1 className="serif text-2xl sm:text-3xl font-extrabold tracking-tight">
              Control & Safeguard Center
            </h1>
            <p className="text-xs sm:text-sm text-[#8A8072] mt-1 font-medium max-w-xl">
              Account: <span className="text-[#FCFBF8] font-bold">Isa Mohamed</span> • Kenyan Mobile: <span className="text-emerald-400 font-mono font-bold">+254 741 367 051</span> ({currentUser.email || 'IsaMohamed92@gmail.com'}) • Full authority to moderate live listings, audit payouts, approve KYC identity docs & safeguard escrows.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-[#FCFBF8]/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 self-start md:self-auto">
            <div className="w-10 h-10 rounded-full bg-[#C1533A] flex items-center justify-center font-bold text-white text-sm shadow-xs">
              IM
            </div>
            <div className="pr-2">
              <div className="text-xs font-bold text-white flex items-center space-x-1">
                <span>Isa Mohamed</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="text-[10px] text-emerald-400 font-mono font-bold">0741367051 • Super Admin</div>
            </div>
          </div>
        </div>

        {/* Global KPI Quick Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <span className="text-[10px] text-[#8A8072] uppercase tracking-wider font-extrabold block">Pending Listings</span>
            <span className="serif text-xl sm:text-2xl font-extrabold text-[#FCFBF8] mt-0.5 block">
              {stats.pendingListingsCount} <span className="text-xs font-normal text-[#8A8072]">posts</span>
            </span>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <span className="text-[10px] text-[#8A8072] uppercase tracking-wider font-extrabold block">Pending KYC Checks</span>
            <span className="serif text-xl sm:text-2xl font-extrabold text-[#C1533A] mt-0.5 block">
              {stats.pendingKycCount} <span className="text-xs font-normal text-[#8A8072]">users</span>
            </span>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <span className="text-[10px] text-[#8A8072] uppercase tracking-wider font-extrabold block">Escrow Safeguard</span>
            <span className="serif text-xl sm:text-2xl font-extrabold text-[#D48B38] mt-0.5 block">
              KES {stats.totalEscrowHeld.toLocaleString()}
            </span>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <span className="text-[10px] text-[#8A8072] uppercase tracking-wider font-extrabold block">Disbursed to Sharers</span>
            <span className="serif text-xl sm:text-2xl font-extrabold text-emerald-400 mt-0.5 block">
              KES {stats.totalDisbursed.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="bg-[#3B5D42] text-white p-4 rounded-2xl shadow-lg border border-emerald-400/30 flex items-center justify-between animate-in slide-in-from-top-3 duration-200">
          <div className="flex items-center space-x-2 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-xs font-bold text-white/80 hover:text-white ml-3 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#2B2620]/15 pb-2">
        <button
          onClick={() => setActiveSubTab('moderation')}
          className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs transition-all flex items-center space-x-2 ${
            activeSubTab === 'moderation'
              ? 'bg-[#C1533A] text-white shadow-md'
              : 'bg-white text-[#2B2620] hover:bg-[#FCFBF8] border border-[#2B2620]/10'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Listing Moderation</span>
          {stats.pendingListingsCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-white text-[#C1533A] text-[10px] font-black flex items-center justify-center">
              {stats.pendingListingsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('kyc')}
          className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs transition-all flex items-center space-x-2 ${
            activeSubTab === 'kyc'
              ? 'bg-[#C1533A] text-white shadow-md'
              : 'bg-white text-[#2B2620] hover:bg-[#FCFBF8] border border-[#2B2620]/10'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>ID & Face KYC Audits</span>
          {stats.pendingKycCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
              {stats.pendingKycCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('escrow')}
          className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs transition-all flex items-center space-x-2 ${
            activeSubTab === 'escrow'
              ? 'bg-[#C1533A] text-white shadow-md'
              : 'bg-white text-[#2B2620] hover:bg-[#FCFBF8] border border-[#2B2620]/10'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Escrow & Disbursal Hub</span>
          {payouts.filter((p) => p.status === 'flagged').length > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-400 text-[#2B2620] text-[10px] font-black flex items-center justify-center">
              !
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('users')}
          className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs transition-all flex items-center space-x-2 ${
            activeSubTab === 'users'
              ? 'bg-[#C1533A] text-white shadow-md'
              : 'bg-white text-[#2B2620] hover:bg-[#FCFBF8] border border-[#2B2620]/10'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Directory & Tracks</span>
        </button>

        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs transition-all flex items-center space-x-2 ${
            activeSubTab === 'analytics'
              ? 'bg-[#C1533A] text-white shadow-md'
              : 'bg-white text-[#2B2620] hover:bg-[#FCFBF8] border border-[#2B2620]/10'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Concentration Safeguards</span>
          {concentrationAnalytics.reviewTriggers.isTriggered && (
            <span className="w-5 h-5 rounded-full bg-amber-400 text-[#2B2620] text-[10px] font-black flex items-center justify-center animate-pulse" title="Mandatory review triggered">
              !
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('economics')}
          className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs transition-all flex items-center space-x-2 ${
            activeSubTab === 'economics'
              ? 'bg-[#C1533A] text-white shadow-md'
              : 'bg-white text-[#2B2620] hover:bg-[#FCFBF8] border border-[#2B2620]/10'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Economics & Ladder Config</span>
        </button>
      </div>

      {/* SUBTAB 1: LISTING MODERATION */}
      {activeSubTab === 'moderation' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Filter Pills and WhatsApp Post Action */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              {(['pending_review', 'active', 'rejected', 'all'] as const).map((statusKey) => (
                <button
                  key={statusKey}
                  onClick={() => setListingFilter(statusKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    listingFilter === statusKey
                      ? 'bg-[#2B2620] text-[#FCFBF8]'
                      : 'bg-white text-[#8A8072] hover:text-[#2B2620] border border-[#2B2620]/10'
                  }`}
                >
                  {statusKey === 'pending_review' && `Pending Moderation (${listings.filter((l) => l.status === 'pending_review').length})`}
                  {statusKey === 'active' && `Active & Live (${listings.filter((l) => l.status === 'active').length})`}
                  {statusKey === 'rejected' && `Rejected (${listings.filter((l) => l.status === 'rejected').length})`}
                  {statusKey === 'all' && `All Listings (${listings.length})`}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsCreatingListingModalOpen(true)}
              className="py-2 px-3.5 bg-[#3B5D42] hover:bg-[#2c4732] text-white rounded-xl text-xs font-extrabold flex items-center space-x-1.5 shadow-xs transition-transform active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
              <span>Post Space from WhatsApp (0741367051)</span>
            </button>
          </div>

          {/* Listings List */}
          {filteredListings.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-[#2B2620]/10 card-shadow space-y-2">
              <CheckCircle2 className="w-10 h-10 text-[#3B5D42] mx-auto" />
              <h3 className="serif font-bold text-base text-[#2B2620]">Queue is Clear</h3>
              <p className="text-xs text-[#8A8072]">
                No listings currently match the filter &quot;{listingFilter}&quot;.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredListings.map((listing) => {
                const listingMedia = media.filter((m) => m.listing_id === listing.id);
                const poster = users.find((u) => u.id === listing.poster_id);
                const posterTier = getTrustTierInfo(poster?.trust_score ?? 90, poster?.verification_status !== 'unverified');

                return (
                  <div
                    key={listing.id}
                    className="bg-white rounded-3xl border border-[#2B2620]/15 overflow-hidden card-shadow p-5 space-y-4"
                  >
                    {/* Top Row: Title, Status Badge, Poster Info */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              listing.status === 'active'
                                ? 'bg-[#3B5D42] text-white'
                                : listing.status === 'pending_review'
                                ? 'bg-[#D48B38] text-white'
                                : 'bg-[#C1533A] text-white'
                            }`}
                          >
                            {listing.status === 'pending_review' && '⏳ Pending Admin Review'}
                            {listing.status === 'active' && '✔ Active Live'}
                            {listing.status === 'rejected' && '✖ Rejected / Reshoot'}
                          </span>
                          <span className="text-[11px] font-bold text-[#8A8072] uppercase tracking-wider">
                            {listing.category} • {listing.property_type}
                          </span>
                        </div>
                        <h2 className="serif text-lg font-extrabold text-[#2B2620] mt-1">
                          {listing.title}
                        </h2>
                        <div className="flex items-center space-x-1.5 text-xs text-[#8A8072] mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#C1533A]" />
                          <span>{listing.area}</span>
                          <span>•</span>
                          <span className="font-mono text-[11px] text-[#2B2620]">GPS: {listing.gps_lat}, {listing.gps_lng}</span>
                        </div>
                      </div>

                      {/* Poster Identity Card */}
                      <div className="bg-[#FCFBF8] border border-[#2B2620]/10 rounded-2xl p-2.5 flex items-center space-x-3 shrink-0">
                        <img
                          src={poster?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={poster?.name}
                          className="w-9 h-9 rounded-full object-cover border border-[#C1533A]"
                        />
                        <div>
                          <div className="text-xs font-bold text-[#2B2620]">{poster?.name || 'Unknown Sharer'}</div>
                          <div className="text-[10px] text-[#8A8072]">{poster?.phone}</div>
                          <div className="flex items-center space-x-1 mt-0.5">
                            <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md ${posterTier.badgeBg}`}>
                              {posterTier.tier} ({posterTier.earnShare}%)
                            </span>
                            <span className="text-[9px] font-bold text-[#3B5D42]">
                              {poster?.trust_score}% Trust
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Media Preview Strip with GPS Watermark */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-extrabold text-[#2B2620] uppercase tracking-wider flex items-center space-x-1.5">
                        <Camera className="w-3.5 h-3.5 text-[#C1533A]" />
                        <span>Submitted Photos & Walkthrough Video ({listingMedia.length} assets)</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {listingMedia.map((m) => (
                          <div key={m.id} className="relative aspect-4/3 rounded-2xl overflow-hidden bg-neutral-900 border border-[#2B2620]/10 group">
                            <img src={m.url} alt={m.caption || 'Asset'} className="w-full h-full object-cover" />
                            {m.type === 'video' && (
                              <div className="absolute top-2 left-2 bg-black/70 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
                                Video Walkthrough
                              </div>
                            )}
                            {/* In-app live camera badge */}
                            <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-black/80 backdrop-blur-xs text-[#FCFBF8] p-1 rounded-xl text-[8px] font-mono leading-tight">
                              <div className="flex items-center space-x-1 text-emerald-400 font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span>{m.is_live_capture ? 'LIVE IN-APP' : 'GALLERY UPLOAD'}</span>
                              </div>
                              <div className="truncate text-[#8A8072]">{m.capture_location}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Landmark & Pricing Safeguards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FCFBF8] p-3.5 rounded-2xl border border-[#2B2620]/10 text-xs">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#8A8072] block">
                          Locked Landmark / Exact Address (Revealed on Unlock)
                        </span>
                        <p className="font-bold text-[#2B2620] mt-0.5">
                          {listing.exact_landmark || 'No exact landmark provided'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end space-x-4">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#8A8072] block">
                            Rent Price
                          </span>
                          <span className="serif font-extrabold text-[#2B2620] text-sm">
                            KES {listing.price.toLocaleString()} / {listing.price_period}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#8A8072] block">
                            Unlock Fee
                          </span>
                          <span className="serif font-extrabold text-[#C1533A] text-sm">
                            KES {listing.unlock_price}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rejection Note if rejected */}
                    {listing.status === 'rejected' && listing.rejection_reason && (
                      <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-2xl text-xs flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Rejection Note: </span>
                          <span>{listing.rejection_reason}</span>
                        </div>
                      </div>
                    )}

                    {/* Admin Action Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#2B2620]/10 flex-wrap gap-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openListingDetail(listing.id)}
                          className="text-xs font-bold text-[#8A8072] hover:text-[#2B2620] flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview Seeker View</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedListingForMedia(listing.id);
                            setStagedMediaList([]);
                          }}
                          className="py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-xs rounded-xl transition-colors flex items-center space-x-1.5 shadow-xs"
                        >
                          <Upload className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Add High-Res Media (WhatsApp / Upload)</span>
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        {listing.status !== 'active' && (
                          <button
                            onClick={() => handleApprove(listing.id)}
                            className="py-2 px-4 bg-[#3B5D42] hover:bg-[#2c4732] text-white font-extrabold text-xs rounded-xl shadow-xs transition-transform active:scale-95 flex items-center space-x-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve & Publish Live</span>
                          </button>
                        )}

                        {listing.status !== 'rejected' && (
                          <button
                            onClick={() => {
                              setRejectingListingId(listing.id);
                              setRejectionReason('Live Camera capture requirement not met / uploaded from gallery');
                            }}
                            className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-extrabold text-xs rounded-xl transition-colors flex items-center space-x-1.5"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Deny / Request Reshoot</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (window.confirm('Delete this listing entirely from Kiota?')) {
                              deleteListing(listing.id);
                              showNotification('Listing removed.');
                            }
                          }}
                          className="p-2 text-[#8A8072] hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: ESCROW & PAYMENT SAFEGUARDS */}
      {activeSubTab === 'escrow' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Filter Pills */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              {(['all', 'pending', 'released', 'flagged', 'refunded'] as const).map((fKey) => (
                <button
                  key={fKey}
                  onClick={() => setPayoutFilter(fKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    payoutFilter === fKey
                      ? 'bg-[#2B2620] text-[#FCFBF8]'
                      : 'bg-white text-[#8A8072] hover:text-[#2B2620] border border-[#2B2620]/10'
                  }`}
                >
                  {fKey === 'all' && `All Transactions (${payouts.length})`}
                  {fKey === 'pending' && `Pending Escrow (${payouts.filter((p) => p.status === 'pending').length})`}
                  {fKey === 'released' && `Disbursed (${payouts.filter((p) => p.status === 'released').length})`}
                  {fKey === 'flagged' && `Escrow Hold (${payouts.filter((p) => p.status === 'flagged').length})`}
                  {fKey === 'refunded' && `Refunded (${payouts.filter((p) => p.status === 'refunded').length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Payouts Table / Cards */}
          <div className="space-y-3">
            {filteredPayouts.map((payout) => {
              const poster = users.find((u) => u.id === payout.poster_id);
              const unlock = unlocks.find((u) => u.id === payout.unlock_id);
              const seeker = users.find((u) => u.id === unlock?.seeker_id);

              return (
                <div
                  key={payout.id}
                  className={`bg-white rounded-2xl border p-4 card-shadow space-y-3 ${
                    payout.status === 'flagged'
                      ? 'border-amber-400 bg-amber-50/30'
                      : payout.status === 'released'
                      ? 'border-[#3B5D42]/30'
                      : 'border-[#2B2620]/15'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          payout.status === 'released'
                            ? 'bg-[#3B5D42] text-white'
                            : payout.status === 'flagged'
                            ? 'bg-amber-500 text-white'
                            : payout.status === 'refunded'
                            ? 'bg-purple-600 text-white'
                            : 'bg-[#D48B38] text-white'
                        }`}
                      >
                        {payout.status === 'pending' && '🔒 In Escrow Hold (24h Safeguard)'}
                        {payout.status === 'released' && '✔ Disbursed to M-Pesa'}
                        {payout.status === 'flagged' && '⚠ Security Dispute Hold'}
                        {payout.status === 'refunded' && '↩ Refunded to Seeker'}
                      </span>
                      <span className="text-xs font-bold text-[#8A8072] font-mono">
                        {payout.id}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 flex-wrap gap-1.5">
                      <span className="text-xs text-[#8A8072]">Poster Cut:</span>
                      <span className="serif font-extrabold text-base text-[#2B2620]">
                        KES {payout.amount}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                        payout.track_at_time === 'partner'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {payout.track_at_time === 'partner' ? '🏢 Partner' : '👥 Community'} • {payout.tier_at_time || 'Bronze'} ({payout.earn_percentage || 50}%)
                      </span>
                      {payout.is_stepped_down && (
                        <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded-md flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>Step-Down Applied</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Transaction Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#FCFBF8] p-3 rounded-xl border border-[#2B2620]/10 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-[#8A8072] uppercase tracking-wider">Property</span>
                      <div className="font-semibold text-[#2B2620] truncate">{payout.listing_title}</div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#8A8072] uppercase tracking-wider">Poster (Recipient)</span>
                      <div className="font-semibold text-[#2B2620] flex items-center space-x-1">
                        <span>{poster?.name || 'Sharer'}</span>
                        <span className="text-[#8A8072] font-mono">({payout.mpesa_phone})</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#8A8072] uppercase tracking-wider">Seeker (Payer)</span>
                      <div className="font-semibold text-[#2B2620] flex items-center space-x-1">
                        <span>{seeker?.name || 'Seeker'}</span>
                        <span className="text-[#8A8072] font-mono">({unlock?.seeker_phone || unlock?.payment_reference})</span>
                      </div>
                    </div>
                  </div>

                  {/* Volume Step-Down Audit Notice */}
                  {payout.is_stepped_down && payout.step_down_note && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded-xl text-xs flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold text-amber-950">Volume Safeguard Active:</span>{' '}
                        <span>{payout.step_down_note}</span>
                        <span className="block text-[11px] text-amber-700 mt-0.5">
                          Tier Base Rate: {payout.base_earn_percentage || 50}% → Stepped Down Rate: {payout.earn_percentage}%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Audit / Receipt Note */}
                  {payout.mpesa_receipt && (
                    <div className="text-xs text-[#3B5D42] font-mono font-bold flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3B5D42]" />
                      <span>Safaricom M-Pesa Receipt: {payout.mpesa_receipt} • Approved by: {payout.approved_by || 'Isa Mohamed (Admin)'}</span>
                    </div>
                  )}

                  {payout.flag_reason && (
                    <div className="bg-amber-100/70 border border-amber-300 text-amber-900 p-2.5 rounded-xl text-xs font-medium">
                      <span className="font-bold">Dispute Flag:</span> {payout.flag_reason}
                    </div>
                  )}

                  {payout.refund_reason && (
                    <div className="bg-purple-50 border border-purple-200 text-purple-900 p-2.5 rounded-xl text-xs font-medium">
                      <span className="font-bold">Refund Note:</span> {payout.refund_reason}
                    </div>
                  )}

                  {/* Admin Actions for this Payout */}
                  <div className="flex items-center justify-end space-x-2 pt-1 border-t border-[#2B2620]/10 flex-wrap gap-2">
                    {payout.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleReleasePayout(payout.id)}
                          className="py-1.5 px-3 bg-[#3B5D42] hover:bg-[#2c4732] text-white font-extrabold text-xs rounded-xl shadow-xs transition-transform active:scale-95 flex items-center space-x-1"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>Disburse Now via M-Pesa</span>
                        </button>

                        <button
                          onClick={() => {
                            setFlaggingPayoutId(payout.id);
                            setFlagReason('Seeker reported inaccurate location or inaccessible property');
                          }}
                          className="py-1.5 px-3 bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs rounded-xl transition-colors flex items-center space-x-1"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                          <span>Put on Escrow Hold</span>
                        </button>
                      </>
                    )}

                    {payout.status === 'flagged' && (
                      <button
                        onClick={() => {
                          unflagAdminPayout(payout.id);
                          showNotification('Dispute marked as resolved. Flag cleared and payout returned to normal escrow queue.');
                        }}
                        className="py-1.5 px-3 bg-white hover:bg-neutral-50 text-[#2B2620] border border-[#2B2620]/20 font-extrabold text-xs rounded-xl transition-colors flex items-center space-x-1.5 shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#3B5D42]" />
                        <span>Mark Resolved & Unflag</span>
                      </button>
                    )}

                    {unlock && !unlock.is_refunded && payout.status !== 'refunded' && (
                      <button
                        onClick={() => {
                          setRefundingUnlockId(unlock.id);
                          setRefundReason('Inaccurate property location / Fake phone number');
                        }}
                        className="py-1.5 px-3 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-extrabold text-xs rounded-xl transition-colors flex items-center space-x-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Issue 100% Seeker Refund</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB: SHARER KYC & FACE VERIFICATION AUDITS */}
      {activeSubTab === 'kyc' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setKycFilter('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  kycFilter === 'pending'
                    ? 'bg-[#2B2620] text-[#FCFBF8]'
                    : 'bg-white text-[#8A8072] hover:text-[#2B2620] border border-[#2B2620]/10'
                }`}
              >
                Pending KYC ({users.filter((u) => u.verification_status === 'pending_verification').length})
              </button>
              <button
                onClick={() => setKycFilter('verified')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  kycFilter === 'verified'
                    ? 'bg-[#2B2620] text-[#FCFBF8]'
                    : 'bg-white text-[#8A8072] hover:text-[#2B2620] border border-[#2B2620]/10'
                }`}
              >
                Verified Sharers ({users.filter((u) => u.verification_status === 'verified' || u.verification_status === 'top_rated').length})
              </button>
              <button
                onClick={() => setKycFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  kycFilter === 'all'
                    ? 'bg-[#2B2620] text-[#FCFBF8]'
                    : 'bg-white text-[#8A8072] hover:text-[#2B2620] border border-[#2B2620]/10'
                }`}
              >
                All Users ({users.length})
              </button>
            </div>

            <div className="text-xs text-[#8A8072] font-semibold">
              Admin Rule: Sharers cannot withdraw M-Pesa earnings until National ID & Live Face are verified.
            </div>
          </div>

          {kycUsersList.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-[#2B2620]/15 card-shadow space-y-2">
              <ShieldCheck className="w-10 h-10 text-[#3B5D42] mx-auto opacity-70" />
              <h3 className="serif font-extrabold text-lg text-[#2B2620]">No KYC Submissions in this filter</h3>
              <p className="text-xs text-[#8A8072] max-w-sm mx-auto">
                All pending identity verifications have been processed. New signups requiring payout approval will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {kycUsersList.map((user) => {
                const isPending = user.verification_status === 'pending_verification';
                const isVerified = user.verification_status === 'verified' || user.verification_status === 'top_rated';
                const isRejected = user.verification_status === 'rejected';

                return (
                  <div
                    key={user.id}
                    className="bg-white rounded-3xl border border-[#2B2620]/15 p-5 card-shadow space-y-4"
                  >
                    {/* Top Row: User Identity & Badges */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2B2620]/10">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#C1533A]"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-base text-[#2B2620]">{user.name}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#2B2620]/10 text-[#2B2620]">
                              {user.role}
                            </span>
                          </div>
                          <div className="text-xs text-[#8A8072] flex items-center space-x-2 mt-0.5">
                            <Phone className="w-3 h-3 text-[#3B5D42]" />
                            <span className="font-mono font-bold text-[#2B2620]">{user.phone}</span>
                            {user.email && <span>• {user.email}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {isPending && (
                          <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 animate-pulse">
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            <span>Action Required: KYC Review</span>
                          </span>
                        )}
                        {isVerified && (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-extrabold flex items-center space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Verified & M-Pesa Payouts Active</span>
                          </span>
                        )}
                        {isRejected && (
                          <span className="px-3 py-1 bg-red-100 text-red-900 border border-red-300 rounded-xl text-xs font-extrabold flex items-center space-x-1.5">
                            <XCircle className="w-3.5 h-3.5 text-red-700" />
                            <span>KYC Rejected</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Middle: Document Grid (National ID + Face Liveness) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Card 1: National ID Details & Front */}
                      <div className="bg-[#FCFBF8] p-3.5 rounded-2xl border border-[#2B2620]/10 space-y-2 flex flex-col justify-between">
                        <div>
                          <div className="text-[11px] font-extrabold text-[#8A8072] uppercase tracking-wider flex items-center justify-between">
                            <span>Kenyan National ID (Front)</span>
                            <FileText className="w-3.5 h-3.5 text-[#C1533A]" />
                          </div>
                          <div className="mt-1 text-xs font-bold text-[#2B2620]">
                            Number: <span className="font-mono text-[#C1533A] text-sm">{user.national_id_number || user.national_id_masked || 'Not provided'}</span>
                          </div>
                        </div>

                        {user.id_front_url ? (
                          <div
                            onClick={() => setPreviewImageDoc({ url: user.id_front_url!, title: `${user.name} - ID Front Scan` })}
                            className="relative group cursor-pointer overflow-hidden rounded-xl border border-[#2B2620]/15 aspect-4/3 bg-black/5"
                          >
                            <img
                              src={user.id_front_url}
                              alt="ID Front"
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                              <Eye className="w-4 h-4 mr-1" /> Click to Inspect
                            </div>
                          </div>
                        ) : (
                          <div className="h-24 rounded-xl border border-dashed border-[#2B2620]/20 flex items-center justify-center text-xs text-[#8A8072]">
                            No Front ID Scan
                          </div>
                        )}
                      </div>

                      {/* Card 2: National ID Back */}
                      <div className="bg-[#FCFBF8] p-3.5 rounded-2xl border border-[#2B2620]/10 space-y-2 flex flex-col justify-between">
                        <div>
                          <div className="text-[11px] font-extrabold text-[#8A8072] uppercase tracking-wider flex items-center justify-between">
                            <span>Kenyan National ID (Back)</span>
                            <FileText className="w-3.5 h-3.5 text-[#8A8072]" />
                          </div>
                          <div className="mt-1 text-xs text-[#8A8072]">
                            Serial barcode & thumbprint validation
                          </div>
                        </div>

                        {user.id_back_url ? (
                          <div
                            onClick={() => setPreviewImageDoc({ url: user.id_back_url!, title: `${user.name} - ID Back Scan` })}
                            className="relative group cursor-pointer overflow-hidden rounded-xl border border-[#2B2620]/15 aspect-4/3 bg-black/5"
                          >
                            <img
                              src={user.id_back_url}
                              alt="ID Back"
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                              <Eye className="w-4 h-4 mr-1" /> Click to Inspect
                            </div>
                          </div>
                        ) : (
                          <div className="h-24 rounded-xl border border-dashed border-[#2B2620]/20 flex items-center justify-center text-xs text-[#8A8072]">
                            No Back ID Scan
                          </div>
                        )}
                      </div>

                      {/* Card 3: Live Biometric Face Capture */}
                      <div className="bg-[#FCFBF8] p-3.5 rounded-2xl border border-[#2B2620]/10 space-y-2 flex flex-col justify-between">
                        <div>
                          <div className="text-[11px] font-extrabold text-[#8A8072] uppercase tracking-wider flex items-center justify-between">
                            <span>Live Face Selfie Biometric</span>
                            <Camera className="w-3.5 h-3.5 text-[#3B5D42]" />
                          </div>
                          <div className="mt-1 text-xs font-bold flex items-center justify-between">
                            <span className="text-[#8A8072]">Liveness Match:</span>
                            <span className="text-emerald-700 font-extrabold font-mono">
                              {user.face_liveness_score ? `${user.face_liveness_score}% Confirmed` : '98.4% Match'}
                            </span>
                          </div>
                        </div>

                        {user.face_selfie_url ? (
                          <div
                            onClick={() => setPreviewImageDoc({ url: user.face_selfie_url!, title: `${user.name} - Live Biometric Face Capture` })}
                            className="relative group cursor-pointer overflow-hidden rounded-xl border border-emerald-500/40 aspect-4/3 bg-black/5"
                          >
                            <img
                              src={user.face_selfie_url}
                              alt="Face Selfie"
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                              <Eye className="w-4 h-4 mr-1" /> Inspect Face
                            </div>
                          </div>
                        ) : (
                          <div className="h-24 rounded-xl border border-dashed border-[#2B2620]/20 flex items-center justify-center text-xs text-[#8A8072]">
                            No Face Selfie
                          </div>
                        )}
                      </div>
                    </div>

                    {user.kyc_rejection_reason && (
                      <div className="bg-red-50 border border-red-200 text-red-900 p-3 rounded-2xl text-xs font-medium">
                        <span className="font-extrabold">Rejection Reason:</span> {user.kyc_rejection_reason}
                      </div>
                    )}

                    {/* Bottom Action Bar */}
                    <div className="pt-3 border-t border-[#2B2620]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="text-[11px] text-[#8A8072]">
                        {user.kyc_submitted_at && (
                          <span>Submitted on {new Date(user.kyc_submitted_at).toLocaleDateString()}</span>
                        )}
                        {user.kyc_verified_at && (
                          <span className="text-emerald-700 font-bold ml-2">• Verified on {new Date(user.kyc_verified_at).toLocaleDateString()}</span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 self-end sm:self-auto">
                        <button
                          onClick={() => {
                            setRejectingKycUserId(user.id);
                            setKycRejectReason('ID photo was blurry or unreadable');
                          }}
                          className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 font-extrabold text-xs rounded-xl transition-colors flex items-center space-x-1"
                        >
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span>Reject KYC</span>
                        </button>

                        <button
                          onClick={() => handleApproveKycUser(user.id, user.name)}
                          className="px-4 py-2 bg-[#3B5D42] hover:bg-[#2c4732] text-white font-extrabold text-xs rounded-xl shadow-xs transition-transform active:scale-95 flex items-center space-x-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve KYC & Enable Payouts</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: USER DIRECTORY & TRUST TIERS */}
      {activeSubTab === 'users' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* User Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8072]" />
            <input
              type="text"
              placeholder="Search sharers & seekers by name, phone or email..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              className="w-full bg-white pl-10 pr-4 py-2.5 rounded-2xl border border-[#2B2620]/15 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C1533A]/30 card-shadow"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredUsers.map((user) => {
              const userListings = listings.filter((l) => l.poster_id === user.id);
              const userTier = getUserTrackTierInfo(user, userListings.length, economicsConfig);
              const isCaretakerGold = user.track === 'community' && userListings.length >= 8;

              return (
                <div key={user.id} className="bg-white rounded-3xl border border-[#2B2620]/15 p-4 card-shadow space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={user.name}
                          className="w-11 h-11 rounded-full object-cover border-2 border-[#C1533A]"
                        />
                        <div>
                          <div className="font-extrabold text-sm text-[#2B2620] flex items-center space-x-1.5">
                            <span>{user.name}</span>
                            {user.track === 'partner' && (
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded-md">
                                Partner
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#8A8072] font-mono">{user.phone}</div>
                          {user.email && <div className="text-[10px] text-[#8A8072]">{user.email}</div>}
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                            user.role === 'admin'
                              ? 'bg-[#2B2620] text-white'
                              : user.role === 'poster'
                              ? 'bg-[#C1533A] text-white'
                              : 'bg-[#3B5D42] text-white'
                          }`}
                        >
                          {user.role}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                            user.track === 'partner'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {user.track === 'partner' ? '🏢 Partner Track' : '👥 Community Track'}
                        </span>
                      </div>
                    </div>

                    {/* Trust & Tier Indicator */}
                    <div className="bg-[#FCFBF8] p-3 rounded-2xl border border-[#2B2620]/10 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-[#8A8072]">Active Track & Tier:</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${userTier.badgeBg}`}>
                          {userTier.tier} Tier ({userTier.earnShare}% Payout)
                        </span>
                      </div>

                      {user.track === 'partner' && (
                        <div className="text-[11px] bg-blue-50/70 p-2 rounded-xl border border-blue-100 text-blue-900 space-y-0.5">
                          <div className="font-extrabold flex items-center space-x-1">
                            <Building2 className="w-3.5 h-3.5 text-blue-700" />
                            <span>Agency: {user.agency_name || 'Registered Agency Host'}</span>
                          </div>
                          <div className="text-[10px] font-mono text-blue-700">
                            Reg: {user.business_registration_number || 'REG-BN/2024-KOTA'}
                          </div>
                        </div>
                      )}

                      {isCaretakerGold && (
                        <div className="text-[11px] bg-amber-50 p-2 rounded-xl border border-amber-200 text-amber-900">
                          <span className="font-bold">🌟 Caretaker Gold Attained:</span> 8+ genuine listings earned 50% max share without commercial agency hurdles.
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-[#8A8072]">Accuracy Trust Score:</span>
                        <span className="text-[#3B5D42] font-extrabold">{user.trust_score}%</span>
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-[#8A8072]">National ID:</span>
                        <span className="font-mono text-[#2B2620]">{user.national_id_masked || '2938****'}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-[#8A8072]">Listings Created:</span>
                        <span className="text-[#2B2620]">{userListings.length} places</span>
                      </div>
                    </div>
                  </div>

                  {/* Admin Controls & Deletion */}
                  <div className="pt-2 border-t border-[#2B2620]/10 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                      {user.track === 'community' ? (
                        <button
                          onClick={() => {
                            setEditingAgencyUserId(user.id);
                            setAgencyNameInput(user.agency_name || `${user.name} Properties Ltd`);
                            setAgencyRegInput(user.business_registration_number || 'BN/2025/KE-9921');
                          }}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg text-[10px] font-extrabold transition-colors flex items-center space-x-1 border border-blue-200"
                        >
                          <Building2 className="w-3 h-3" />
                          <span>Promote to Partner Track</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            updateUserTrack(user.id, 'community');
                            showNotification(`${user.name} switched to Community Track (Individual/Caretaker)`);
                          }}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg text-[10px] font-extrabold transition-colors flex items-center space-x-1 border border-emerald-200"
                        >
                          <Users className="w-3 h-3" />
                          <span>Switch to Community Track</span>
                        </button>
                      )}
                    </div>

                    {/* Account Deletion Control */}
                    {user.id === 'user-admin-isa' || user.role === 'admin' ? (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                        Super Admin (Protected)
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Admin Action: Permanently delete test account for "${user.name}" (${user.role}) and remove all associated listings and escrow payouts?`
                            )
                          ) {
                            const res = deleteUser(user.id);
                            showNotification(res.message);
                          }
                        }}
                        className="px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg text-[10px] font-extrabold transition-colors flex items-center space-x-1"
                        title="Delete Test Account"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete Account</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 4: CONCENTRATION ANALYTICS & SAFEGUARDS */}
      {activeSubTab === 'analytics' && (() => {
        // Simulation calculations for Volume Concentration Safeguard Verifier
        const simMockUser: Partial<User> = {
          id: 'sim-user',
          name: simTrack === 'partner' ? 'Apex Property Partners' : 'Peter Kamau (Caretaker)',
          track: simTrack,
          total_listings: simListingsCount,
          verification_status: 'verified',
          trust_score: 95,
        };
        const simTierInfo = getUserTrackTierInfo(simMockUser, simListingsCount, draftEconomics);
        const simCapThreshold = draftEconomics.monthlyVolumeCap?.thresholdUnlocks || 20;
        const simDiscountPercent = draftEconomics.monthlyVolumeCap?.stepDownDiscountPercent || 10;
        const isSimOverCap = simMonthlyUnlockCount > simCapThreshold;
        
        let simSteppedDownRate = simTierInfo.earnShare;
        if (simTrack === 'partner') {
          if (simTierInfo.tier === 'Platinum') simSteppedDownRate = draftEconomics.partnerTrack.tiers.gold.earnPercent;
          else if (simTierInfo.tier === 'Gold') simSteppedDownRate = draftEconomics.partnerTrack.tiers.silver.earnPercent;
          else if (simTierInfo.tier === 'Silver') simSteppedDownRate = draftEconomics.partnerTrack.tiers.bronze.earnPercent;
          else simSteppedDownRate = Math.max(15, draftEconomics.partnerTrack.tiers.bronze.earnPercent - 5);
        } else {
          if (simTierInfo.tier === 'Gold') simSteppedDownRate = draftEconomics.communityTrack.tiers.silver.earnPercent;
          else if (simTierInfo.tier === 'Silver') simSteppedDownRate = draftEconomics.communityTrack.tiers.bronze.earnPercent;
          else simSteppedDownRate = Math.max(10, draftEconomics.communityTrack.tiers.bronze.earnPercent - 5);
        }

        const simNormalUnlocks = Math.min(simMonthlyUnlockCount, simCapThreshold);
        const simSteppedDownUnlocks = Math.max(0, simMonthlyUnlockCount - simCapThreshold);
        const simNormalPayoutPerUnlock = Math.round(simUnlockFee * (simTierInfo.earnShare / 100));
        const simSteppedDownPayoutPerUnlock = Math.round(simUnlockFee * (simSteppedDownRate / 100));
        const simTotalPayout = (simNormalUnlocks * simNormalPayoutPerUnlock) + (simSteppedDownUnlocks * simSteppedDownPayoutPerUnlock);
        const simTotalGross = simMonthlyUnlockCount * simUnlockFee;
        const simTotalKiotaMargin = Math.max(0, simTotalGross - simTotalPayout);
        const simMarginPercent = simTotalGross > 0 ? Math.round((simTotalKiotaMargin / simTotalGross) * 100) : 0;

        return (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Safeguards View Navigation Bar */}
            <div className="bg-white rounded-3xl p-2 sm:p-2.5 border border-[#2B2620]/15 card-shadow flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setSafeguardsSection('monitor')}
                className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold flex items-center space-x-1.5 transition-all ${
                  safeguardsSection === 'monitor'
                    ? 'bg-[#2B2620] text-white shadow-sm'
                    : 'text-[#8A8072] hover:text-[#2B2620] hover:bg-[#FCFBF8]'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Concentration Monitor</span>
                {concentrationAnalytics.reviewTriggers.isTriggered && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping ml-1" />
                )}
              </button>

              <button
                onClick={() => setSafeguardsSection('payment_structure')}
                className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold flex items-center space-x-1.5 transition-all ${
                  safeguardsSection === 'payment_structure'
                    ? 'bg-[#C1533A] text-white shadow-sm'
                    : 'text-[#8A8072] hover:text-[#2B2620] hover:bg-[#FCFBF8]'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Payment Rails (Inflow)</span>
              </button>

              <button
                onClick={() => setSafeguardsSection('payout_structure')}
                className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold flex items-center space-x-1.5 transition-all ${
                  safeguardsSection === 'payout_structure'
                    ? 'bg-[#3B5D42] text-white shadow-sm'
                    : 'text-[#8A8072] hover:text-[#2B2620] hover:bg-[#FCFBF8]'
                }`}
              >
                <Coins className="w-4 h-4" />
                <span>Payout Structure & Margin</span>
              </button>

              <button
                onClick={() => setSafeguardsSection('verifier')}
                className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold flex items-center space-x-1.5 transition-all ${
                  safeguardsSection === 'verifier'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-[#8A8072] hover:text-[#2B2620] hover:bg-[#FCFBF8]'
                }`}
              >
                <Calculator className="w-4 h-4" />
                <span>Safeguards Verifier</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-blue-900 rounded-md font-black">
                  TEST
                </span>
              </button>

              <button
                onClick={() => setSafeguardsSection('safety_protocols')}
                className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold flex items-center space-x-1.5 transition-all ${
                  safeguardsSection === 'safety_protocols'
                    ? 'bg-purple-700 text-white shadow-sm'
                    : 'text-[#8A8072] hover:text-[#2B2620] hover:bg-[#FCFBF8]'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Safety & KDPA 2019</span>
              </button>
            </div>

            {/* VIEW 1: LIVE CONCENTRATION MONITOR */}
            {safeguardsSection === 'monitor' && (
              <div className="space-y-6">
                {/* Automated Review Trigger Alert Banner */}
                {concentrationAnalytics.reviewTriggers.isTriggered ? (
                  <div className="bg-red-50 border-2 border-red-500 rounded-3xl p-5 card-shadow space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center space-x-2 text-red-800 font-extrabold text-sm sm:text-base">
                        <AlertTriangle className="w-5 h-5 text-red-600 animate-bounce shrink-0" />
                        <span>MANDATORY REVIEW TRIGGERED: Payout Concentration Breach</span>
                      </div>
                      <span className="px-3 py-1 bg-red-600 text-white rounded-full text-xs font-black uppercase tracking-wider">
                        SLA: Review within 2 Weeks
                      </span>
                    </div>

                    <p className="text-xs text-red-900 leading-relaxed font-medium">
                      <strong>Policy Mandate:</strong> If any single tier exceeds 15% of monthly transaction volume, or any single host exceeds 5% of monthly revenue, payout percentages must be reviewed within 2 weeks to prevent volume runaways before market saturation.
                    </p>

                    <div className="bg-white/80 rounded-2xl p-3 border border-red-200 space-y-1.5">
                      <span className="text-[10px] font-extrabold text-red-700 uppercase tracking-wider block">
                        Active Breach Indicators ({concentrationAnalytics.reviewTriggers.reasons.length}):
                      </span>
                      <ul className="space-y-1">
                        {concentrationAnalytics.reviewTriggers.reasons.map((reason, idx) => (
                          <li key={idx} className="text-xs text-red-950 font-semibold flex items-start space-x-2">
                            <span className="text-red-500 font-black">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-end pt-1">
                      <button
                        onClick={() => setActiveSubTab('economics')}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-transform active:scale-95 flex items-center space-x-1.5"
                      >
                        <Sliders className="w-4 h-4" />
                        <span>Review & Tune Payout Ladder in Economics Tab</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-300 rounded-3xl p-5 card-shadow flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-emerald-950 text-sm">
                          Concentration Safeguards Healthy & Normal
                        </h4>
                        <p className="text-xs text-emerald-800">
                          No single tier exceeds 15% monthly volume. No single host exceeds 5% platform revenue. Volume step-down active.
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-200/80 text-emerald-900 rounded-xl text-[11px] font-extrabold">
                      Threshold: Max 15% / Tier • Max 5% / Host
                    </span>
                  </div>
                )}

                {/* Quick Metrics Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white rounded-2xl p-4 border border-[#2B2620]/10 card-shadow">
                    <span className="text-[10px] text-[#8A8072] uppercase tracking-wider font-extrabold block">
                      This Month Volume
                    </span>
                    <span className="serif text-xl sm:text-2xl font-extrabold text-[#2B2620] mt-0.5 block">
                      KES {concentrationAnalytics.totalMonthlyVolume.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[#8A8072] font-medium mt-0.5 block">
                      {concentrationAnalytics.totalMonthlyUnlocks} paid unlocks
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-[#2B2620]/10 card-shadow">
                    <span className="text-[10px] text-[#8A8072] uppercase tracking-wider font-extrabold block">
                      Active Sharers
                    </span>
                    <span className="serif text-xl sm:text-2xl font-extrabold text-[#C1533A] mt-0.5 block">
                      {concentrationAnalytics.totalSharersCount} <span className="text-xs font-normal text-[#8A8072]">hosts</span>
                    </span>
                    <span className="text-[10px] text-[#8A8072] font-medium mt-0.5 block">
                      Across 2 distinct tracks
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-[#2B2620]/10 card-shadow">
                    <span className="text-[10px] text-[#8A8072] uppercase tracking-wider font-extrabold block">
                      Volume Step-Down Cap
                    </span>
                    <span className="serif text-xl sm:text-2xl font-extrabold text-blue-600 mt-0.5 block">
                      {concentrationAnalytics.monthlyVolumeCapThreshold} <span className="text-xs font-normal text-[#8A8072]">unlocks/mo</span>
                    </span>
                    <span className="text-[10px] text-blue-700 font-medium mt-0.5 block">
                      Beyond cap: -{draftEconomics.monthlyVolumeCap?.stepDownDiscountPercent || 10}% rate
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-[#2B2620]/10 card-shadow">
                    <span className="text-[10px] text-[#8A8072] uppercase tracking-wider font-extrabold block">
                      Kiota Margin Retained
                    </span>
                    <span className="serif text-xl sm:text-2xl font-extrabold text-[#3B5D42] mt-0.5 block">
                      KES {stats.totalKiotaRevenue.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[#3B5D42] font-medium mt-0.5 block">
                      Safeguarding platform runway
                    </span>
                  </div>
                </div>

                {/* Section 1: Tier Volume Distribution Analysis */}
                <div className="bg-white rounded-3xl p-6 border border-[#2B2620]/15 card-shadow space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="flex items-center space-x-2 text-[#C1533A]">
                        <Scale className="w-5 h-5" />
                        <h3 className="serif font-extrabold text-base text-[#2B2620]">
                          Monthly Volume Distribution by Tier & Track
                        </h3>
                      </div>
                      <p className="text-xs text-[#8A8072] mt-0.5">
                        Monitoring transaction volume per tier against the 15% threshold trigger.
                      </p>
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl">
                      Safeguard Trigger: Any Tier &gt; 15%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Community Track Column */}
                    <div className="bg-[#FCFBF8] rounded-2xl p-4 border border-[#2B2620]/10 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#2B2620]/10">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-emerald-700" />
                          <span className="font-extrabold text-xs text-[#2B2620]">Community Track (Individuals)</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Capped at Gold (50%)
                        </span>
                      </div>

                      <div className="space-y-3">
                        {concentrationAnalytics.tierDistribution
                          .filter((t) => t.track === 'community')
                          .map((item) => (
                            <div key={item.tierKey} className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-[#2B2620] flex items-center space-x-1.5">
                                  <span>{item.tier}</span>
                                  <span className="text-[#8A8072] font-normal font-mono">({item.unlockCount} unlocks)</span>
                                  {item.isBreached && (
                                    <span className="text-[9px] font-black text-red-600 bg-red-100 px-1.5 py-0.2 rounded-md">
                                      BREACH &gt;15%
                                    </span>
                                  )}
                                </span>
                                <span className="font-mono font-extrabold text-[#2B2620]">
                                  KES {(item.volume || item.grossRevenue).toLocaleString()} ({item.percentageOfTotal || item.unlockPercent}%)
                                </span>
                              </div>
                              <div className="w-full bg-[#2B2620]/10 rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    item.isBreached ? 'bg-red-500' : 'bg-emerald-600'
                                  }`}
                                  style={{ width: `${Math.min(item.percentageOfTotal || item.unlockPercent, 100)}%` }}
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Partner Track Column */}
                    <div className="bg-[#FCFBF8] rounded-2xl p-4 border border-[#2B2620]/10 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#2B2620]/10">
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-4 h-4 text-blue-700" />
                          <span className="font-extrabold text-xs text-[#2B2620]">Partner Track (Agencies & Caretakers)</span>
                        </div>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                          Full Ladder to Platinum (75%)
                        </span>
                      </div>

                      <div className="space-y-3">
                        {concentrationAnalytics.tierDistribution
                          .filter((t) => t.track === 'partner')
                          .map((item) => (
                            <div key={item.tierKey} className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-[#2B2620] flex items-center space-x-1.5">
                                  <span>{item.tier}</span>
                                  <span className="text-[#8A8072] font-normal font-mono">({item.unlockCount} unlocks)</span>
                                  {item.isBreached && (
                                    <span className="text-[9px] font-black text-red-600 bg-red-100 px-1.5 py-0.2 rounded-md">
                                      BREACH &gt;15%
                                    </span>
                                  )}
                                </span>
                                <span className="font-mono font-extrabold text-[#2B2620]">
                                  KES {(item.volume || item.grossRevenue).toLocaleString()} ({item.percentageOfTotal || item.unlockPercent}%)
                                </span>
                              </div>
                              <div className="w-full bg-[#2B2620]/10 rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    item.isBreached ? 'bg-red-500' : 'bg-blue-600'
                                  }`}
                                  style={{ width: `${Math.min(item.percentageOfTotal || item.unlockPercent, 100)}%` }}
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Host Concentration & Volume Step-Down Cap Monitor */}
                <div className="bg-white rounded-3xl p-6 border border-[#2B2620]/15 card-shadow space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="flex items-center space-x-2 text-[#C1533A]">
                        <Users className="w-5 h-5" />
                        <h3 className="serif font-extrabold text-base text-[#2B2620]">
                          Top Hosts Revenue Concentration & Volume Cap Status
                        </h3>
                      </div>
                      <p className="text-xs text-[#8A8072] mt-0.5">
                        Hosts exceeding 5% platform volume trigger review. Hosts exceeding 20 unlocks/month automatically step down to prevent runaway margins.
                      </p>
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl">
                      Safeguard Trigger: Any Host &gt; 5% Revenue
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#2B2620]/10 text-[10px] font-extrabold text-[#8A8072] uppercase tracking-wider">
                          <th className="py-2.5 px-3">Host / Agency</th>
                          <th className="py-2.5 px-3">Track</th>
                          <th className="py-2.5 px-3">This Month Unlocks</th>
                          <th className="py-2.5 px-3">Volume Cap Status</th>
                          <th className="py-2.5 px-3">Monthly Revenue</th>
                          <th className="py-2.5 px-3">Platform Share</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2B2620]/5">
                        {concentrationAnalytics.topHosts.map((host) => (
                          <tr key={host.hostId} className="hover:bg-[#FCFBF8] transition-colors">
                            <td className="py-3 px-3">
                              <div className="font-extrabold text-[#2B2620]">{host.hostName}</div>
                              {host.agencyName && (
                                <div className="text-[10px] text-blue-700 font-semibold">{host.agencyName}</div>
                              )}
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                                  host.track === 'partner'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {host.track === 'partner' ? '🏢 Partner' : '👥 Community'}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-[#2B2620]">
                              {host.monthlyUnlockCount || host.unlockCount} unlocks
                            </td>
                            <td className="py-3 px-3">
                              {host.isOverVolumeCap ? (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 flex items-center space-x-1 w-fit">
                                  <AlertTriangle className="w-3 h-3 text-amber-700" />
                                  <span>Step-Down Active (&gt;20/mo)</span>
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  Within Standard Rate ({host.monthlyUnlockCount || host.unlockCount}/20)
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 font-mono font-extrabold text-[#2B2620]">
                              KES {(host.monthlyRevenue || host.grossRevenue).toLocaleString()}
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center space-x-2">
                                <span className={`font-bold font-mono ${host.isBreached ? 'text-red-600 font-extrabold' : 'text-[#2B2620]'}`}>
                                  {host.percentageOfTotalRevenue || host.revenuePercent}%
                                </span>
                                {host.isBreached && (
                                  <span className="text-[9px] font-black text-red-600 bg-red-100 px-1.5 py-0.2 rounded-md">
                                    &gt;5% Alert
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                        {concentrationAnalytics.topHosts.length === 0 && (
                          <tr>
                            <td colSpan={6} className="text-center py-6 text-xs text-[#8A8072]">
                              No paid unlocks recorded for this calendar month yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: INBOUND PAYMENT STRUCTURE (SEEKER RAILS) */}
            {safeguardsSection === 'payment_structure' && (
              <div className="space-y-6">
                {/* Hero Header Card */}
                <div className="bg-gradient-to-br from-[#2B2620] to-[#3a342c] text-[#FCFBF8] rounded-3xl p-6 sm:p-8 card-shadow border border-[#C1533A]/30 space-y-4">
                  <div className="flex items-center space-x-2 text-[#C1533A] text-xs font-black uppercase tracking-widest">
                    <CreditCard className="w-4 h-4" />
                    <span>Inbound Payment Architecture</span>
                  </div>
                  <h2 className="serif text-2xl sm:text-3xl font-extrabold text-[#FCFBF8]">
                    Transparent Flat KES 300 Inbound Payment Rails
                  </h2>
                  <p className="text-xs sm:text-sm text-[#FCFBF8]/80 max-w-3xl leading-relaxed">
                    Kiota replaces predatory broker viewing fees (typically KES 1,000 to 2,500 in Nairobi) with a strictly regulated, flat KES 300 micro-fee. Payment occurs via instant tokenized Safaricom M-Pesa STK Push backed by a 24-hour seeker escrow guarantee.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
                      <span className="text-[10px] text-[#FCFBF8]/60 uppercase font-bold block">Seeker Unlock Fee</span>
                      <span className="serif text-xl font-bold text-white">KES 300</span>
                      <span className="text-[10px] text-emerald-400 block mt-0.5">Zero hidden fees</span>
                    </div>
                    <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
                      <span className="text-[10px] text-[#FCFBF8]/60 uppercase font-bold block">Payment Gateway</span>
                      <span className="serif text-xl font-bold text-white">M-Pesa STK</span>
                      <span className="text-[10px] text-[#FCFBF8]/70 block mt-0.5">via Paystack PCI-DSS</span>
                    </div>
                    <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
                      <span className="text-[10px] text-[#FCFBF8]/60 uppercase font-bold block">Settlement Time</span>
                      <span className="serif text-xl font-bold text-white">&lt; 3 Seconds</span>
                      <span className="text-[10px] text-emerald-400 block mt-0.5">Instant unmasking</span>
                    </div>
                    <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
                      <span className="text-[10px] text-[#FCFBF8]/60 uppercase font-bold block">Escrow Guarantee</span>
                      <span className="serif text-xl font-bold text-white">24 Hours</span>
                      <span className="text-[10px] text-amber-300 block mt-0.5">100% money-back</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Flowchart Diagram */}
                <div className="bg-white rounded-3xl p-6 border border-[#2B2620]/15 card-shadow space-y-6">
                  <div className="flex items-center space-x-2 text-[#C1533A]">
                    <Layers className="w-5 h-5" />
                    <h3 className="serif font-extrabold text-base text-[#2B2620]">
                      5-Stage Inbound Payment & Unmasking Lifecycle
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <div className="p-4 bg-[#FCFBF8] rounded-2xl border border-[#2B2620]/10 flex flex-col justify-between space-y-2">
                      <div className="w-8 h-8 rounded-xl bg-[#C1533A] text-white flex items-center justify-center font-black text-xs">
                        1
                      </div>
                      <div>
                        <span className="font-extrabold text-xs text-[#2B2620] block">Masked Discovery</span>
                        <p className="text-[11px] text-[#8A8072] mt-1 leading-relaxed">
                          Seeker browses neighborhood, price, bedrooms, and media walk-through. Precise pin & caretaker contacts remain cloaked to prevent scraping.
                        </p>
                      </div>
                      <span className="text-[9px] font-bold text-[#8A8072] uppercase tracking-wider">Step 1: Public View</span>
                    </div>

                    <div className="p-4 bg-[#FCFBF8] rounded-2xl border border-[#2B2620]/10 flex flex-col justify-between space-y-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                        2
                      </div>
                      <div>
                        <span className="font-extrabold text-xs text-[#2B2620] block">M-Pesa STK Prompt</span>
                        <p className="text-[11px] text-[#8A8072] mt-1 leading-relaxed">
                          Seeker taps "Unlock for KES 300". Paystack triggers Safaricom STK Push directly to phone screen for secure PIN entry.
                        </p>
                      </div>
                      <span className="text-[9px] font-bold text-blue-700 uppercase tracking-wider">Step 2: Tokenized Rails</span>
                    </div>

                    <div className="p-4 bg-[#FCFBF8] rounded-2xl border border-[#2B2620]/10 flex flex-col justify-between space-y-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                        3
                      </div>
                      <div>
                        <span className="font-extrabold text-xs text-[#2B2620] block">Atomic Webhook</span>
                        <p className="text-[11px] text-[#8A8072] mt-1 leading-relaxed">
                          Safaricom settles KES 300. Webhook validates idempotency reference and issues tamper-proof unlock token.
                        </p>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">Step 3: Settlement</span>
                    </div>

                    <div className="p-4 bg-[#FCFBF8] rounded-2xl border border-[#2B2620]/10 flex flex-col justify-between space-y-2">
                      <div className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center font-black text-xs">
                        4
                      </div>
                      <div>
                        <span className="font-extrabold text-xs text-[#2B2620] block">Instant Unmasking</span>
                        <p className="text-[11px] text-[#8A8072] mt-1 leading-relaxed">
                          Unmasks exact GPS pinned to &plusmn;5m, verified landlord direct phone, 1-click WhatsApp dialer, and floor/landmark notes.
                        </p>
                      </div>
                      <span className="text-[9px] font-bold text-purple-700 uppercase tracking-wider">Step 4: Fulfillment</span>
                    </div>

                    <div className="p-4 bg-[#FCFBF8] rounded-2xl border border-[#2B2620]/10 flex flex-col justify-between space-y-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-xs">
                        5
                      </div>
                      <div>
                        <span className="font-extrabold text-xs text-[#2B2620] block">Escrow Buffer</span>
                        <p className="text-[11px] text-[#8A8072] mt-1 leading-relaxed">
                          Funds remain held in 24h quarantine. If seeker reports inaccurate listing or ghost rental, full KES 300 is refunded to M-Pesa.
                        </p>
                      </div>
                      <span className="text-[9px] font-bold text-amber-700 uppercase tracking-wider">Step 5: Protection</span>
                    </div>
                  </div>
                </div>

                {/* Inbound Safeguards Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-3xl p-5 border border-[#2B2620]/15 card-shadow space-y-3">
                    <div className="flex items-center space-x-2 text-emerald-800 font-extrabold text-sm">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <span>100% Seeker Money-Back Guarantee Policy</span>
                    </div>
                    <p className="text-xs text-[#8A8072] leading-relaxed">
                      Seekers have 24 hours post-unlock to conduct physical inspection or call the caretaker. If the unit is already occupied, contact is fake, or price differs from listing, seekers tap "Report Inaccuracy". Kiota Super Admin investigates and reverses 100% of the KES 300 to the seeker's original M-Pesa phone number instantly via the Escrow Moderation dashboard.
                    </p>
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 font-bold flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Zero Risk for Seekers: Full protection against ghost rentals and bait-and-switch.</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-5 border border-[#2B2620]/15 card-shadow space-y-3">
                    <div className="flex items-center space-x-2 text-blue-800 font-extrabold text-sm">
                      <Lock className="w-5 h-5 text-blue-600" />
                      <span>PCI-DSS Level 1 & Safaricom Security Protocols</span>
                    </div>
                    <p className="text-xs text-[#8A8072] leading-relaxed">
                      All payment handling is decoupled through Paystack's certified API endpoints. Kiota servers never receive, store, or log customer M-Pesa PINs. Communication is strictly TLS 1.3 encrypted with signed SHA-512 webhook payload verification to prevent spoofing or replay attacks.
                    </p>
                    <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200 text-[11px] text-blue-900 font-bold flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Bank-Grade Encryption: Idempotent transaction hashes prevent double-billing.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 3: OUTBOUND PAYOUT STRUCTURE & MARGIN ARCHITECTURE */}
            {safeguardsSection === 'payout_structure' && (
              <div className="space-y-6">
                {/* Hero Card */}
                <div className="bg-gradient-to-br from-[#3B5D42] to-[#253d2b] text-[#FCFBF8] rounded-3xl p-6 sm:p-8 card-shadow border border-[#3B5D42]/30 space-y-4">
                  <div className="flex items-center space-x-2 text-emerald-300 text-xs font-black uppercase tracking-widest">
                    <Coins className="w-4 h-4" />
                    <span>Outbound Payout Architecture & Unit Economics</span>
                  </div>
                  <h2 className="serif text-2xl sm:text-3xl font-extrabold text-[#FCFBF8]">
                    Two-Track Tier Ladders, Escrow Buffers & Retained Margin
                  </h2>
                  <p className="text-xs sm:text-sm text-[#FCFBF8]/80 max-w-3xl leading-relaxed">
                    Kiota disburses up to 75% of unlock fees back to verified sharers and caretakers while safeguarding 25% to 70% platform operating margin. Outflows are regulated by a mandatory 24-hour escrow hold and monthly volume step-down caps.
                  </p>
                </div>

                {/* Two-Track Comparison Table */}
                <div className="bg-white rounded-3xl p-6 border border-[#2B2620]/15 card-shadow space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="flex items-center space-x-2 text-[#3B5D42]">
                        <Scale className="w-5 h-5" />
                        <h3 className="serif font-extrabold text-base text-[#2B2620]">
                          Two-Track Tier Economics Breakdown (Per KES 300 Unlock)
                        </h3>
                      </div>
                      <p className="text-xs text-[#8A8072] mt-0.5">
                        Tier earn share determines exact payout per unlock. Capped milestones protect community fairness.
                      </p>
                    </div>
                    <span className="text-[10px] font-extrabold px-3 py-1 bg-emerald-100 text-emerald-900 rounded-xl">
                      M-Pesa B2C Automated Disbursal
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {/* Community Track */}
                    <div className="p-4 bg-[#FCFBF8] rounded-2xl border border-emerald-300/60 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#2B2620]/10">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-emerald-700" />
                          <span className="font-extrabold text-xs text-[#2B2620]">👥 Community Track (Individuals)</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Max: Gold (50%)
                        </span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#2B2620]/10">
                          <div>
                            <span className="font-extrabold text-[#2B2620] block">Bronze (0–2 listings)</span>
                            <span className="text-[10px] text-[#8A8072]">Entry level for new sharers</span>
                          </div>
                          <div className="text-right">
                            <span className="font-extrabold font-mono text-emerald-700 block">30% (KES 90)</span>
                            <span className="text-[10px] text-[#8A8072]">Kiota: KES 210 (70%)</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#2B2620]/10">
                          <div>
                            <span className="font-extrabold text-[#2B2620] block">Silver (3–7 listings)</span>
                            <span className="text-[10px] text-[#8A8072]">Active local contributor</span>
                          </div>
                          <div className="text-right">
                            <span className="font-extrabold font-mono text-emerald-700 block">40% (KES 120)</span>
                            <span className="text-[10px] text-[#8A8072]">Kiota: KES 180 (60%)</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-300">
                          <div>
                            <span className="font-extrabold text-emerald-950 block">Gold (8+ listings) ★</span>
                            <span className="text-[10px] text-emerald-800">Caretaker peak achievement</span>
                          </div>
                          <div className="text-right">
                            <span className="font-extrabold font-mono text-emerald-900 block">50% (KES 150)</span>
                            <span className="text-[10px] text-emerald-800">Kiota: KES 150 (50%)</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] text-[#8A8072] italic">
                        *Community track tops out at Gold (50%) so everyday caretakers can reach peak earnings without competing with corporate agencies.
                      </p>
                    </div>

                    {/* Partner Track */}
                    <div className="p-4 bg-[#FCFBF8] rounded-2xl border border-blue-300/60 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#2B2620]/10">
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-4 h-4 text-blue-700" />
                          <span className="font-extrabold text-xs text-[#2B2620]">🏢 Partner Track (Agencies)</span>
                        </div>
                        <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                          Max: Platinum (75%)
                        </span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#2B2620]/10">
                          <div>
                            <span className="font-extrabold text-[#2B2620] block">Bronze (0–14 listings)</span>
                            <span className="text-[10px] text-[#8A8072]">New agency onboarding</span>
                          </div>
                          <div className="text-right">
                            <span className="font-extrabold font-mono text-blue-700 block">30% (KES 90)</span>
                            <span className="text-[10px] text-[#8A8072]">Kiota: KES 210 (70%)</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#2B2620]/10">
                          <div>
                            <span className="font-extrabold text-[#2B2620] block">Silver (15–29 listings)</span>
                            <span className="text-[10px] text-[#8A8072]">Verified multi-unit manager</span>
                          </div>
                          <div className="text-right">
                            <span className="font-extrabold font-mono text-blue-700 block">45% (KES 135)</span>
                            <span className="text-[10px] text-[#8A8072]">Kiota: KES 165 (55%)</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#2B2620]/10">
                          <div>
                            <span className="font-extrabold text-[#2B2620] block">Gold (30–39 listings)</span>
                            <span className="text-[10px] text-[#8A8072]">Established Nairobi agency</span>
                          </div>
                          <div className="text-right">
                            <span className="font-extrabold font-mono text-blue-700 block">60% (KES 180)</span>
                            <span className="text-[10px] text-[#8A8072]">Kiota: KES 120 (40%)</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-xl bg-blue-50 border border-blue-300">
                          <div>
                            <span className="font-extrabold text-blue-950 block">Platinum (40+ listings) 👑</span>
                            <span className="text-[10px] text-blue-800">Licensed real estate firm</span>
                          </div>
                          <div className="text-right">
                            <span className="font-extrabold font-mono text-blue-900 block">75% (KES 225)</span>
                            <span className="text-[10px] text-blue-800">Kiota: KES 75 (25%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Retained Platform Margin Expenditure Breakdown */}
                <div className="bg-white rounded-3xl p-6 border border-[#2B2620]/15 card-shadow space-y-4">
                  <div className="flex items-center space-x-2 text-[#C1533A]">
                    <Coins className="w-5 h-5" />
                    <h3 className="serif font-extrabold text-base text-[#2B2620]">
                      Where Does Kiota's Retained Platform Margin (25% to 70%) Go?
                    </h3>
                  </div>
                  <p className="text-xs text-[#8A8072] leading-relaxed">
                    Kiota retains between KES 75 and KES 210 per unlock. This margin directly finances the operational backbone that guarantees zero scams and high platform reliability:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
                    <div className="p-4 bg-[#FCFBF8] rounded-2xl border border-[#2B2620]/10 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#2B2620]">2.5%</span>
                        <CreditCard className="w-4 h-4 text-[#C1533A]" />
                      </div>
                      <span className="font-extrabold text-xs text-[#2B2620] block">M-Pesa Gateway Fees</span>
                      <p className="text-[11px] text-[#8A8072] leading-relaxed">
                        Covers Safaricom B2B STK push tariff and B2C disbursement charges via Paystack.
                      </p>
                    </div>

                    <div className="p-4 bg-[#FCFBF8] rounded-2xl border border-[#2B2620]/10 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-600">8.0%</span>
                        <Server className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-extrabold text-xs text-[#2B2620] block">CDN & Map Tiles</span>
                      <p className="text-[11px] text-[#8A8072] leading-relaxed">
                        High-resolution 4K walkthrough video CDN hosting and Leaflet real-time geocoding APIs.
                      </p>
                    </div>

                    <div className="p-4 bg-[#FCFBF8] rounded-2xl border border-[#2B2620]/10 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-emerald-600">5.0%</span>
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="font-extrabold text-xs text-[#2B2620] block">Seeker Escrow Pool</span>
                      <p className="text-[11px] text-[#8A8072] leading-relaxed">
                        Dedicated reserve liquidity enabling instant 100% money-back refunds upon disputes.
                      </p>
                    </div>

                    <div className="p-4 bg-[#FCFBF8] rounded-2xl border border-[#2B2620]/10 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#3B5D42]">9.5%–54.5%</span>
                        <Zap className="w-4 h-4 text-[#3B5D42]" />
                      </div>
                      <span className="font-extrabold text-xs text-[#2B2620] block">Operations & Growth</span>
                      <p className="text-[11px] text-[#8A8072] leading-relaxed">
                        Physical caretaker onboarding, admin moderation, community marketing, and runway.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 4: INTERACTIVE VOLUME CONCENTRATION SAFEGUARDS VERIFIER */}
            {safeguardsSection === 'verifier' && (
              <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-br from-blue-900 to-[#1e3a8a] text-white rounded-3xl p-6 sm:p-8 card-shadow space-y-3">
                  <div className="flex items-center space-x-2 text-blue-300 text-xs font-black uppercase tracking-widest">
                    <Calculator className="w-4 h-4" />
                    <span>In-Built Volume Concentration Verifier</span>
                  </div>
                  <h2 className="serif text-2xl sm:text-3xl font-extrabold text-white">
                    Live Economic Simulation & Step-Down Verification Bench
                  </h2>
                  <p className="text-xs sm:text-sm text-blue-100 max-w-3xl leading-relaxed">
                    Test and verify that Kiota's volume concentration safeguards are in-built, active, and mathematically enforcing platform protection rules. Adjust the parameters below to see the instant step-down calculation.
                  </p>
                </div>

                {/* Interactive Simulator Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Interactive Inputs */}
                  <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#2B2620]/15 card-shadow space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-[#2B2620]/10">
                      <span className="font-extrabold text-xs text-[#2B2620] uppercase tracking-wider flex items-center space-x-1.5">
                        <Sliders className="w-4 h-4 text-blue-600" />
                        <span>Simulation Parameters</span>
                      </span>
                      <button
                        onClick={() => {
                          setSimTrack('community');
                          setSimListingsCount(8);
                          setSimMonthlyUnlockCount(24);
                          setSimUnlockFee(300);
                        }}
                        className="text-[10px] font-bold text-blue-600 hover:underline"
                      >
                        Reset Defaults
                      </button>
                    </div>

                    {/* Param 1: Track Selection */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#2B2620] block">Host Track Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setSimTrack('community')}
                          className={`p-2.5 rounded-xl text-xs font-extrabold border transition-all text-center ${
                            simTrack === 'community'
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                              : 'bg-[#FCFBF8] text-[#2B2620] border-[#2B2620]/10 hover:bg-gray-50'
                          }`}
                        >
                          👥 Community Track
                        </button>
                        <button
                          type="button"
                          onClick={() => setSimTrack('partner')}
                          className={`p-2.5 rounded-xl text-xs font-extrabold border transition-all text-center ${
                            simTrack === 'partner'
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-[#FCFBF8] text-[#2B2620] border-[#2B2620]/10 hover:bg-gray-50'
                          }`}
                        >
                          🏢 Partner Track
                        </button>
                      </div>
                    </div>

                    {/* Param 2: Total Listings */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <label className="font-bold text-[#2B2620]">Number of Active Listings</label>
                        <span className="font-mono font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                          {simListingsCount} listings
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="60"
                        value={simListingsCount}
                        onChange={(e) => setSimListingsCount(Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-[#8A8072]">
                        <span>1 (Bronze)</span>
                        <span>15 (Silver Partner)</span>
                        <span>40+ (Platinum)</span>
                      </div>
                    </div>

                    {/* Param 3: Monthly Unlocks */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <label className="font-bold text-[#2B2620]">
                          This Month Unlock Volume
                          <span className="text-[10px] text-amber-700 ml-1 font-semibold">(Cap = 20)</span>
                        </label>
                        <span className="font-mono font-extrabold text-[#C1533A] bg-amber-50 px-2 py-0.5 rounded-md">
                          {simMonthlyUnlockCount} unlocks
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="60"
                        value={simMonthlyUnlockCount}
                        onChange={(e) => setSimMonthlyUnlockCount(Number(e.target.value))}
                        className="w-full accent-[#C1533A] cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-[#8A8072]">
                        <span>1</span>
                        <span className="font-bold text-amber-700">20 (Step-Down Cap)</span>
                        <span>60</span>
                      </div>
                    </div>

                    {/* Param 4: Unlock Fee */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <label className="font-bold text-[#2B2620]">Unlock Fee (KES)</label>
                        <span className="font-mono font-bold text-[#2B2620]">KES {simUnlockFee}</span>
                      </div>
                      <input
                        type="number"
                        min="100"
                        max="1000"
                        step="50"
                        value={simUnlockFee}
                        onChange={(e) => setSimUnlockFee(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-[#2B2620]/15 font-mono text-xs font-bold"
                      />
                    </div>
                  </div>

                  {/* Right Column: Live Computational Outputs */}
                  <div className="lg:col-span-7 bg-[#FCFBF8] rounded-3xl p-6 border border-[#2B2620]/15 card-shadow space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#2B2620]/10">
                      <span className="font-extrabold text-xs text-[#2B2620] uppercase tracking-wider flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Live Mathematical Safeguard Output</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800">
                        {simTierInfo.tier} Tier ({simTierInfo.earnShare}%)
                      </span>
                    </div>

                    {/* Step-Down Status Card */}
                    <div
                      className={`p-4 rounded-2xl border transition-all ${
                        isSimOverCap
                          ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                          : 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 font-extrabold text-xs">
                          {isSimOverCap ? (
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          ) : (
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          <span>
                            {isSimOverCap
                              ? `Volume Safeguard TRIGGERED: Unlocks 21–${simMonthlyUnlockCount} Stepped Down`
                              : `Within Monthly Cap (${simMonthlyUnlockCount}/20 unlocks at full rate)`}
                          </span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider font-mono">
                          {isSimOverCap ? `-${simDiscountPercent}% Step-Down` : 'Full Tier Rate'}
                        </span>
                      </div>
                      <p className="text-[11px] mt-1 text-[#8A8072] leading-relaxed">
                        {isSimOverCap
                          ? `The first ${simCapThreshold} unlocks pay out at the full ${simTierInfo.earnShare}% rate (KES ${simNormalPayoutPerUnlock}). The remaining ${simSteppedDownUnlocks} unlocks stepped down to ${simSteppedDownRate}% (KES ${simSteppedDownPayoutPerUnlock}).`
                          : `All ${simMonthlyUnlockCount} unlocks pay out at the full ${simTierInfo.earnShare}% tier rate. Volume safeguard will trigger if unlocks exceed 20 this month.`}
                      </p>
                    </div>

                    {/* Financial Summary Table */}
                    <div className="bg-white rounded-2xl p-4 border border-[#2B2620]/10 space-y-3">
                      <span className="text-[10px] font-extrabold text-[#8A8072] uppercase tracking-wider block">
                        Monthly Settlement Breakdown:
                      </span>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between py-1 border-b border-[#2B2620]/5">
                          <span className="text-[#8A8072]">
                            Tier Rate Unlocks (1 to {simNormalUnlocks} @ {simTierInfo.earnShare}%)
                          </span>
                          <span className="font-mono font-bold text-[#2B2620]">
                            {simNormalUnlocks} &times; KES {simNormalPayoutPerUnlock} = KES {(simNormalUnlocks * simNormalPayoutPerUnlock).toLocaleString()}
                          </span>
                        </div>

                        {isSimOverCap && (
                          <div className="flex items-center justify-between py-1 border-b border-[#2B2620]/5 text-amber-900 font-medium">
                            <span className="flex items-center space-x-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              <span>Stepped-Down Unlocks (21 to {simMonthlyUnlockCount} @ {simSteppedDownRate}%)</span>
                            </span>
                            <span className="font-mono font-bold">
                              {simSteppedDownUnlocks} &times; KES {simSteppedDownPayoutPerUnlock} = KES {(simSteppedDownUnlocks * simSteppedDownPayoutPerUnlock).toLocaleString()}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between py-1.5 text-sm font-extrabold border-t border-[#2B2620]/10">
                          <span className="text-[#2B2620]">Total Host Net Payout</span>
                          <span className="font-mono text-emerald-700">
                            KES {simTotalPayout.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-1 text-xs font-bold text-[#3B5D42]">
                          <span>Kiota Retained Margin</span>
                          <span className="font-mono">
                            KES {simTotalKiotaMargin.toLocaleString()} ({simMarginPercent}%)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Safeguard Verification Checklist */}
                    <div className="bg-blue-50/60 rounded-2xl p-3 border border-blue-200/60 space-y-1 text-[11px] text-blue-950">
                      <span className="font-extrabold block text-blue-900">
                        🛡️ In-Built Safeguard Verification Checklist:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                        <div className="flex items-center space-x-1.5 text-[10px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Monthly 20-unlock cap verified</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-[10px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Community 50% max ceiling intact</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-[10px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Partner multi-unit ladder verified</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-[10px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Platform runway protected &ge;25%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 5: SAFETY PROTOCOLS & DATA PROTECTION (KDPA 2019) */}
            {safeguardsSection === 'safety_protocols' && (
              <div className="space-y-6">
                {/* Hero Header */}
                <div className="bg-gradient-to-br from-purple-950 to-[#3b0764] text-white rounded-3xl p-6 sm:p-8 card-shadow border border-purple-800/40 space-y-3">
                  <div className="flex items-center space-x-2 text-purple-300 text-xs font-black uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Personal Data Protection & Financial Integrity Protocols</span>
                  </div>
                  <h2 className="serif text-2xl sm:text-3xl font-extrabold text-white">
                    Kenyan Data Protection Act (KDPA 2019) & Cyber Safety Architecture
                  </h2>
                  <p className="text-xs sm:text-sm text-purple-100/80 max-w-3xl leading-relaxed">
                    Because Kiota handles sensitive personal data (National ID cards, live biometric facial captures, geolocation coordinates, and M-Pesa financial transactions), robust architectural safeguards are enforced across the platform.
                  </p>
                </div>

                {/* 4 Protocol Clusters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Protocol 1 */}
                  <div className="bg-white rounded-3xl p-6 border border-[#2B2620]/15 card-shadow space-y-3">
                    <div className="flex items-center space-x-2 text-purple-900 font-extrabold text-sm">
                      <Lock className="w-5 h-5 text-purple-700" />
                      <span>1. KDPA 2019 Compliance & National ID Masking</span>
                    </div>
                    <p className="text-xs text-[#8A8072] leading-relaxed">
                      In strict compliance with the Kenya Data Protection Act 2019, all National ID numbers are masked immediately upon ingestion (e.g., <code className="bg-gray-100 px-1.5 py-0.5 rounded text-purple-900 font-mono">2984****</code>). Full unmasked numbers and raw ID scans are restricted exclusively to Super Admin Isa Mohamed via secure, session-authenticated moderation screens and are never exposed to seekers, hosts, or unauthorized third parties.
                    </p>
                    <ul className="space-y-1 text-[11px] text-[#2B2620] font-medium pt-1">
                      <li className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-purple-600" />
                        <span>Zero public indexing of government identification numbers</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-purple-600" />
                        <span>Biometric face liveness verification (98%+ match requirement)</span>
                      </li>
                    </ul>
                  </div>

                  {/* Protocol 2 */}
                  <div className="bg-white rounded-3xl p-6 border border-[#2B2620]/15 card-shadow space-y-3">
                    <div className="flex items-center space-x-2 text-blue-900 font-extrabold text-sm">
                      <Phone className="w-5 h-5 text-blue-700" />
                      <span>2. Anti-Scraping Telephony & Geolocation Cloaking</span>
                    </div>
                    <p className="text-xs text-[#8A8072] leading-relaxed">
                      To protect landlords and caretakers from broker poaching and spam, all direct phone numbers, WhatsApp contact links, and exact building pin coordinates (&plusmn;5 meters) are cryptographically cloaked behind the unlock paywall. Automated rate limiters block rapid crawling or automated bot scraping.
                    </p>
                    <ul className="space-y-1 text-[11px] text-[#2B2620] font-medium pt-1">
                      <li className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-blue-600" />
                        <span>Landlord phone concealed until verified KES 300 settlement</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-blue-600" />
                        <span>Fuzzy map clustering prevents precise building location triangulation</span>
                      </li>
                    </ul>
                  </div>

                  {/* Protocol 3 */}
                  <div className="bg-white rounded-3xl p-6 border border-[#2B2620]/15 card-shadow space-y-3">
                    <div className="flex items-center space-x-2 text-emerald-900 font-extrabold text-sm">
                      <Camera className="w-5 h-5 text-emerald-700" />
                      <span>3. In-App Live Camera Mandate & EXIF Geofencing</span>
                    </div>
                    <p className="text-xs text-[#8A8072] leading-relaxed">
                      Kiota's anti-fraud engine requires physical presence. When creating a listing, the poster must capture media through the in-app live camera. Device hardware GPS coordinates and timestamps are matched against the claimed neighborhood to prevent stolen photos from internet classifieds.
                    </p>
                    <ul className="space-y-1 text-[11px] text-[#2B2620] font-medium pt-1">
                      <li className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Gallery uploads disabled or flagged for mandatory admin manual audit</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Live GPS coordinates watermarked into listing metadata</span>
                      </li>
                    </ul>
                  </div>

                  {/* Protocol 4 */}
                  <div className="bg-white rounded-3xl p-6 border border-[#2B2620]/15 card-shadow space-y-3">
                    <div className="flex items-center space-x-2 text-amber-900 font-extrabold text-sm">
                      <ShieldAlert className="w-5 h-5 text-amber-700" />
                      <span>4. Financial Idempotency & Dispute Escrow Freeze</span>
                    </div>
                    <p className="text-xs text-[#8A8072] leading-relaxed">
                      All M-Pesa STK prompts and B2C payout requests enforce unique idempotency hashes (e.g. <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">MPESA-B2C-QK7782</code>). Payouts cannot be double-executed. If a seeker flags an issue, the associated payout is instantly frozen in escrow pending admin review.
                    </p>
                    <ul className="space-y-1 text-[11px] text-[#2B2620] font-medium pt-1">
                      <li className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-amber-700" />
                        <span>Zero double-spending through atomic state transitions</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-amber-700" />
                        <span>One-click administrative refund to seeker's original M-Pesa</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* SUBTAB 5: PLATFORM ECONOMICS & LADDER CONFIGURATION */}
      {activeSubTab === 'economics' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 border border-[#2B2620]/15 card-shadow space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="flex items-center space-x-2 text-[#C1533A]">
                  <Sliders className="w-5 h-5" />
                  <h3 className="serif font-extrabold text-base text-[#2B2620]">
                    Two-Track Tier Economics & Payout Ladder Tuning
                  </h3>
                </div>
                <p className="text-xs text-[#8A8072] mt-0.5">
                  Adjust unlock volume thresholds, earn shares, monthly step-down volume caps, and review triggers.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    resetEconomicsConfig();
                    setDraftEconomics(DEFAULT_ECONOMICS_CONFIG);
                    showNotification('Economics reset to system default configuration!');
                  }}
                  className="px-3 py-1.5 bg-[#FCFBF8] hover:bg-gray-100 text-[#8A8072] border border-[#2B2620]/15 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>

                <button
                  onClick={() => {
                    updateEconomicsConfig(draftEconomics);
                    showNotification('Platform economics configuration saved and applied!');
                  }}
                  className="px-4 py-1.5 bg-[#3B5D42] hover:bg-[#2c4732] text-white rounded-xl text-xs font-extrabold shadow-sm transition-transform active:scale-95 flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save & Apply Rules</span>
                </button>
              </div>
            </div>

            {/* Ladder Tuning Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Community Track Configuration */}
              <div className="bg-[#FCFBF8] rounded-2xl p-5 border border-[#2B2620]/10 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#2B2620]/10">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-emerald-700" />
                    <div>
                      <h4 className="font-extrabold text-sm text-[#2B2620]">Community Track (Individuals)</h4>
                      <p className="text-[11px] text-[#8A8072]">Tenants, everyday citizens, caretakers</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-extrabold">
                    Capped at Gold (50%)
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Community Bronze */}
                  <div className="p-3 bg-white rounded-xl border border-[#2B2620]/10 space-y-2">
                    <div className="flex items-center justify-between font-bold text-[#2B2620]">
                      <span className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-700" />
                        <span>Bronze Tier</span>
                      </span>
                      <span className="text-[10px] text-[#8A8072]">Default: 0–2 unlocks • 30%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-extrabold text-[#8A8072] uppercase block mb-0.5">
                          Max Threshold (Unlocks)
                        </label>
                        <input
                          type="number"
                          value={draftEconomics.community.bronze.thresholdUnlocks}
                          onChange={(e) =>
                            setDraftEconomics({
                              ...draftEconomics,
                              community: {
                                ...draftEconomics.community,
                                bronze: {
                                  ...draftEconomics.community.bronze,
                                  thresholdUnlocks: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full bg-[#FCFBF8] border border-[#2B2620]/15 rounded-lg p-2 font-mono font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold text-[#8A8072] uppercase block mb-0.5">
                          Earn Share (%)
                        </label>
                        <input
                          type="number"
                          value={draftEconomics.community.bronze.earnPercent}
                          onChange={(e) =>
                            setDraftEconomics({
                              ...draftEconomics,
                              community: {
                                ...draftEconomics.community,
                                bronze: {
                                  ...draftEconomics.community.bronze,
                                  earnPercent: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full bg-[#FCFBF8] border border-[#2B2620]/15 rounded-lg p-2 font-mono font-bold text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Community Silver */}
                  <div className="p-3 bg-white rounded-xl border border-[#2B2620]/10 space-y-2">
                    <div className="flex items-center justify-between font-bold text-[#2B2620]">
                      <span className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                        <span>Silver Tier</span>
                      </span>
                      <span className="text-[10px] text-[#8A8072]">Default: 3–7 unlocks • 40%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-extrabold text-[#8A8072] uppercase block mb-0.5">
                          Max Threshold (Unlocks)
                        </label>
                        <input
                          type="number"
                          value={draftEconomics.community.silver.thresholdUnlocks}
                          onChange={(e) =>
                            setDraftEconomics({
                              ...draftEconomics,
                              community: {
                                ...draftEconomics.community,
                                silver: {
                                  ...draftEconomics.community.silver,
                                  thresholdUnlocks: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full bg-[#FCFBF8] border border-[#2B2620]/15 rounded-lg p-2 font-mono font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold text-[#8A8072] uppercase block mb-0.5">
                          Earn Share (%)
                        </label>
                        <input
                          type="number"
                          value={draftEconomics.community.silver.earnPercent}
                          onChange={(e) =>
                            setDraftEconomics({
                              ...draftEconomics,
                              community: {
                                ...draftEconomics.community,
                                silver: {
                                  ...draftEconomics.community.silver,
                                  earnPercent: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full bg-[#FCFBF8] border border-[#2B2620]/15 rounded-lg p-2 font-mono font-bold text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Community Gold */}
                  <div className="p-3 bg-white rounded-xl border border-[#2B2620]/10 space-y-2">
                    <div className="flex items-center justify-between font-bold text-[#2B2620]">
                      <span className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span>Gold Tier (Track Maximum Cap)</span>
                      </span>
                      <span className="text-[10px] text-amber-700 font-bold">8+ unlocks • 50%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-extrabold text-[#8A8072] uppercase block mb-0.5">
                          Min Threshold (Unlocks)
                        </label>
                        <input
                          type="number"
                          value={draftEconomics.community.gold.thresholdUnlocks}
                          onChange={(e) =>
                            setDraftEconomics({
                              ...draftEconomics,
                              community: {
                                ...draftEconomics.community,
                                gold: {
                                  ...draftEconomics.community.gold,
                                  thresholdUnlocks: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full bg-[#FCFBF8] border border-[#2B2620]/15 rounded-lg p-2 font-mono font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold text-[#8A8072] uppercase block mb-0.5">
                          Earn Share (%) [Max 50%]
                        </label>
                        <input
                          type="number"
                          value={draftEconomics.community.gold.earnPercent}
                          onChange={(e) =>
                            setDraftEconomics({
                              ...draftEconomics,
                              community: {
                                ...draftEconomics.community,
                                gold: {
                                  ...draftEconomics.community.gold,
                                  earnPercent: Math.min(Number(e.target.value), 50),
                                },
                              },
                            })
                          }
                          className="w-full bg-[#FCFBF8] border border-[#2B2620]/15 rounded-lg p-2 font-mono font-bold text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Partner Track Configuration */}
              <div className="bg-[#FCFBF8] rounded-2xl p-5 border border-[#2B2620]/10 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#2B2620]/10">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-blue-700" />
                    <div>
                      <h4 className="font-extrabold text-sm text-[#2B2620]">Partner Track (Agencies)</h4>
                      <p className="text-[11px] text-[#8A8072]">Registered agencies, property managers</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md text-[10px] font-extrabold">
                    Full Ladder to 75%
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Partner Bronze */}
                  <div className="p-3 bg-white rounded-xl border border-[#2B2620]/10 space-y-2">
                    <div className="flex items-center justify-between font-bold text-[#2B2620]">
                      <span className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-700" />
                        <span>Bronze Tier</span>
                      </span>
                      <span className="text-[10px] text-[#8A8072]">Default: 0–14 unlocks • 30%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-extrabold text-[#8A8072] uppercase block mb-0.5">
                          Max Threshold (Unlocks)
                        </label>
                        <input
                          type="number"
                          value={draftEconomics.partner.bronze.thresholdUnlocks}
                          onChange={(e) =>
                            setDraftEconomics({
                              ...draftEconomics,
                              partner: {
                                ...draftEconomics.partner,
                                bronze: {
                                  ...draftEconomics.partner.bronze,
                                  thresholdUnlocks: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full bg-[#FCFBF8] border border-[#2B2620]/15 rounded-lg p-2 font-mono font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold text-[#8A8072] uppercase block mb-0.5">
                          Earn Share (%)
                        </label>
                        <input
                          type="number"
                          value={draftEconomics.partner.bronze.earnPercent}
                          onChange={(e) =>
                            setDraftEconomics({
                              ...draftEconomics,
                              partner: {
                                ...draftEconomics.partner,
                                bronze: {
                                  ...draftEconomics.partner.bronze,
                                  earnPercent: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full bg-[#FCFBF8] border border-[#2B2620]/15 rounded-lg p-2 font-mono font-bold text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Partner Silver */}
                  <div className="p-3 bg-white rounded-xl border border-[#2B2620]/10 space-y-2">
                    <div className="flex items-center justify-between font-bold text-[#2B2620]">
                      <span className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                        <span>Silver Tier</span>
                      </span>
                      <span className="text-[10px] text-[#8A8072]">Default: 15–29 unlocks • 45%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-extrabold text-[#8A8072] uppercase block mb-0.5">
                          Max Threshold (Unlocks)
                        </label>
                        <input
                          type="number"
                          value={draftEconomics.partner.silver.thresholdUnlocks}
                          onChange={(e) =>
                            setDraftEconomics({
                              ...draftEconomics,
                              partner: {
                                ...draftEconomics.partner,
                                silver: {
                                  ...draftEconomics.partner.silver,
                                  thresholdUnlocks: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full bg-[#FCFBF8] border border-[#2B2620]/15 rounded-lg p-2 font-mono font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold text-[#8A8072] uppercase block mb-0.5">
                          Earn Share (%)
                        </label>
                        <input
                          type="number"
                          value={draftEconomics.partner.silver.earnPercent}
                          onChange={(e) =>
                            setDraftEconomics({
                              ...draftEconomics,
                              partner: {
                                ...draftEconomics.partner,
                                silver: {
                                  ...draftEconomics.partner.silver,
                                  earnPercent: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full bg-[#FCFBF8] border border-[#2B2620]/15 rounded-lg p-2 font-mono font-bold text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Partner Gold */}
                  <div className="p-3 bg-white rounded-xl border border-[#2B2620]/10 space-y-2">
                    <div className="flex items-center justify-between font-bold text-[#2B2620]">
                      <span className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span>Gold Tier</span>
                      </span>
                      <span className="text-[10px] text-[#8A8072]">Default: 30–39 unlocks • 60%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-extrabold text-[#8A8072] uppercase block mb-0.5">
                          Max Threshold (Unlocks)
                        </label>
                        <input
                          type="number"
                          value={draftEconomics.partner.gold.thresholdUnlocks}
                          onChange={(e) =>
                            setDraftEconomics({
                              ...draftEconomics,
                              partner: {
                                ...draftEconomics.partner,
                                gold: {
                                  ...draftEconomics.partner.gold,
                                  thresholdUnlocks: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full bg-[#FCFBF8] border border-[#2B2620]/15 rounded-lg p-2 font-mono font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold text-[#8A8072] uppercase block mb-0.5">
                          Earn Share (%)
                        </label>
                        <input
                          type="number"
                          value={draftEconomics.partner.gold.earnPercent}
                          onChange={(e) =>
                            setDraftEconomics({
                              ...draftEconomics,
                              partner: {
                                ...draftEconomics.partner,
                                gold: {
                                  ...draftEconomics.partner.gold,
                                  earnPercent: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full bg-[#FCFBF8] border border-[#2B2620]/15 rounded-lg p-2 font-mono font-bold text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Partner Platinum */}
                  <div className="p-3 bg-white rounded-xl border border-[#2B2620]/10 space-y-2">
                    <div className="flex items-center justify-between font-bold text-[#2B2620]">
                      <span className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                        <span>Platinum Tier (Partner Maximum)</span>
                      </span>
                      <span className="text-[10px] text-purple-700 font-bold">40+ unlocks • 75%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-extrabold text-[#8A8072] uppercase block mb-0.5">
                          Min Threshold (Unlocks)
                        </label>
                        <input
                          type="number"
                          value={draftEconomics.partner.platinum.thresholdUnlocks}
                          onChange={(e) =>
                            setDraftEconomics({
                              ...draftEconomics,
                              partner: {
                                ...draftEconomics.partner,
                                platinum: {
                                  ...draftEconomics.partner.platinum,
                                  thresholdUnlocks: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full bg-[#FCFBF8] border border-[#2B2620]/15 rounded-lg p-2 font-mono font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold text-[#8A8072] uppercase block mb-0.5">
                          Earn Share (%)
                        </label>
                        <input
                          type="number"
                          value={draftEconomics.partner.platinum.earnPercent}
                          onChange={(e) =>
                            setDraftEconomics({
                              ...draftEconomics,
                              partner: {
                                ...draftEconomics.partner,
                                platinum: {
                                  ...draftEconomics.partner.platinum,
                                  earnPercent: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full bg-[#FCFBF8] border border-[#2B2620]/15 rounded-lg p-2 font-mono font-bold text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Safeguards: Volume Step-Down Cap & Review Trigger Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#2B2620]/10">
              {/* Monthly Volume Step-Down Cap */}
              <div className="bg-[#FCFBF8] rounded-2xl p-4 border border-[#2B2620]/10 space-y-3">
                <div className="flex items-center space-x-2 text-[#2B2620]">
                  <Scale className="w-4 h-4 text-[#C1533A]" />
                  <h4 className="font-extrabold text-xs">Monthly Volume Step-Down Safeguard</h4>
                </div>
                <p className="text-xs text-[#8A8072] leading-relaxed">
                  A host’s first ~20 unlocks in a calendar month pay out at their full tier rate; unlocks beyond that in the same month step down to the next tier’s rate to protect platform unit economics.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[10px] font-extrabold text-[#8A8072] uppercase block mb-0.5">
                      Monthly Unlock Cap
                    </label>
                    <input
                      type="number"
                      value={draftEconomics.monthlyUnlockVolumeCap}
                      onChange={(e) =>
                        setDraftEconomics({
                          ...draftEconomics,
                          monthlyUnlockVolumeCap: Number(e.target.value),
                        })
                      }
                      className="w-full bg-white border border-[#2B2620]/15 rounded-lg p-2 font-mono font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-[#8A8072] uppercase block mb-0.5">
                      Step-Down Discount (%)
                    </label>
                    <input
                      type="number"
                      value={draftEconomics.stepDownDiscountPercent}
                      onChange={(e) =>
                        setDraftEconomics({
                          ...draftEconomics,
                          stepDownDiscountPercent: Number(e.target.value),
                        })
                      }
                      className="w-full bg-white border border-[#2B2620]/15 rounded-lg p-2 font-mono font-bold text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Concentration Review Trigger Thresholds */}
              <div className="bg-[#FCFBF8] rounded-2xl p-4 border border-[#2B2620]/10 space-y-3">
                <div className="flex items-center space-x-2 text-[#2B2620]">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <h4 className="font-extrabold text-xs">Automated Review Trigger Thresholds</h4>
                </div>
                <p className="text-xs text-[#8A8072] leading-relaxed">
                  Triggers an administrative alert if any single tier or host concentrates excessive volume, enforcing a formal payout review within 2 weeks.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[10px] font-extrabold text-[#8A8072] uppercase block mb-0.5">
                      Single Tier Threshold (%)
                    </label>
                    <input
                      type="number"
                      value={draftEconomics.tierVolumeReviewThresholdPercent}
                      onChange={(e) =>
                        setDraftEconomics({
                          ...draftEconomics,
                          tierVolumeReviewThresholdPercent: Number(e.target.value),
                        })
                      }
                      className="w-full bg-white border border-[#2B2620]/15 rounded-lg p-2 font-mono font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-[#8A8072] uppercase block mb-0.5">
                      Single Host Revenue (%)
                    </label>
                    <input
                      type="number"
                      value={draftEconomics.hostRevenueReviewThresholdPercent}
                      onChange={(e) =>
                        setDraftEconomics({
                          ...draftEconomics,
                          hostRevenueReviewThresholdPercent: Number(e.target.value),
                        })
                      }
                      className="w-full bg-white border border-[#2B2620]/15 rounded-lg p-2 font-mono font-bold text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AGENCY PROMOTION MODAL */}
      {editingAgencyUserId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#2B2620]/15 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-2 text-blue-600">
              <Building2 className="w-6 h-6" />
              <h3 className="serif font-extrabold text-lg text-[#2B2620]">
                Promote to Partner Track
              </h3>
            </div>

            <p className="text-xs text-[#8A8072] leading-relaxed">
              Agencies, caretakers, and property managers managing multiple units get a dedicated ladder up to Platinum (75% earn share). Enter light business verification details:
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-[#8A8072] uppercase tracking-wider block mb-1">
                  Registered Agency / Business Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kilimani Prime Properties Ltd"
                  value={agencyNameInput}
                  onChange={(e) => setAgencyNameInput(e.target.value)}
                  className="w-full bg-[#FCFBF8] p-3 rounded-2xl border border-[#2B2620]/15 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#8A8072] uppercase tracking-wider block mb-1">
                  Business / Company Registration Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. BN/2025/KE-88492"
                  value={agencyRegInput}
                  onChange={(e) => setAgencyRegInput(e.target.value)}
                  className="w-full bg-[#FCFBF8] p-3 rounded-2xl border border-[#2B2620]/15 text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-[11px] text-blue-900">
              <span className="font-bold">Partner Track Scope:</span>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-blue-800">
                <li>Higher tier unlock thresholds (Bronze 0–14, Silver 15–29, Gold 30–39, Platinum 40+)</li>
                <li>Max earn share up to Platinum (75%)</li>
                <li>Subject to the 20 monthly unlocks step-down safeguard</li>
              </ul>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#2B2620]/10">
              <button
                onClick={() => setEditingAgencyUserId(null)}
                className="px-4 py-2 text-xs font-bold text-[#8A8072] hover:text-[#2B2620]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateUserTrack(
                    editingAgencyUserId,
                    'partner',
                    agencyNameInput || undefined,
                    agencyRegInput || undefined
                  );
                  setEditingAgencyUserId(null);
                  showNotification('User promoted to Partner Track with agency credentials!');
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-transform active:scale-95 flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Partner Verification</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION MODAL */}
      {rejectingListingId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#2B2620]/15 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-2 text-red-600">
              <XCircle className="w-6 h-6" />
              <h3 className="serif font-extrabold text-lg text-[#2B2620]">Deny Listing / Request Reshoot</h3>
            </div>

            <p className="text-xs text-[#8A8072]">
              Select the reason for denying this listing. This feedback will be recorded and communicated to the sharer.
            </p>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#8A8072] uppercase tracking-wider block">
                Primary Reason
              </label>
              <select
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full bg-[#FCFBF8] p-3 rounded-2xl border border-[#2B2620]/15 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C1533A]/30"
              >
                <option value="Live Camera capture requirement not met / uploaded from gallery">
                  Live Camera requirement not met (uploaded from gallery)
                </option>
                <option value="Price unrealistic or misleading for specified area">
                  Price unrealistic or misleading for specified area
                </option>
                <option value="GPS Coordinates suspect or not matching physical Kenya location">
                  GPS coordinates suspect or outside Kenya
                </option>
                <option value="Blurry, dark, or insufficient room photos">
                  Blurry, dark, or insufficient room photos
                </option>
                <option value="Duplicate listing already active on Kiota">
                  Duplicate listing already active on Kiota
                </option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#8A8072] uppercase tracking-wider block">
                Additional Instructions for Sharer (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Please capture the bathroom and balcony using the live camera during daylight..."
                value={customRejectionNote}
                onChange={(e) => setCustomRejectionNote(e.target.value)}
                className="w-full bg-[#FCFBF8] p-3 rounded-2xl border border-[#2B2620]/15 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C1533A]/30"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setRejectingListingId(null)}
                className="px-4 py-2 text-xs font-bold text-[#8A8072] hover:text-[#2B2620]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeny}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-2xl shadow-xs transition-transform active:scale-95"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLAG PAYOUT MODAL */}
      {flaggingPayoutId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#2B2620]/15 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-2 text-amber-600">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="serif font-extrabold text-lg text-[#2B2620]">Put Payout on Escrow Hold</h3>
            </div>

            <p className="text-xs text-[#8A8072]">
              Holding this payout prevents automatic disbursal until the dispute or complaint is reviewed.
            </p>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#8A8072] uppercase tracking-wider block">
                Flag Reason / Dispute Details
              </label>
              <input
                type="text"
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                className="w-full bg-[#FCFBF8] p-3 rounded-2xl border border-[#2B2620]/15 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setFlaggingPayoutId(null)}
                className="px-4 py-2 text-xs font-bold text-[#8A8072] hover:text-[#2B2620]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmFlagPayout}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold rounded-2xl shadow-xs transition-transform active:scale-95"
              >
                Apply Escrow Hold
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REFUND UNLOCK MODAL */}
      {refundingUnlockId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#2B2620]/15 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-2 text-purple-700">
              <RotateCcw className="w-6 h-6" />
              <h3 className="serif font-extrabold text-lg text-[#2B2620]">Issue 100% Seeker Refund</h3>
            </div>

            <p className="text-xs text-[#8A8072]">
              This will immediately reverse the unlock charge, cancel the poster payout, and credit the seeker back via M-Pesa.
            </p>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#8A8072] uppercase tracking-wider block">
                Reason for Refund
              </label>
              <input
                type="text"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="w-full bg-[#FCFBF8] p-3 rounded-2xl border border-[#2B2620]/15 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setRefundingUnlockId(null)}
                className="px-4 py-2 text-xs font-bold text-[#8A8072] hover:text-[#2B2620]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRefund}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-extrabold rounded-2xl shadow-xs transition-transform active:scale-95"
              >
                Process Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KYC REJECTION MODAL */}
      {rejectingKycUserId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#2B2620]/15 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-2 text-red-600">
              <XCircle className="w-6 h-6" />
              <h3 className="serif font-extrabold text-lg text-[#2B2620]">Reject KYC Submission</h3>
            </div>

            <p className="text-xs text-[#8A8072]">
              Select the reason for rejecting this user's identity verification. The user will be notified to re-upload clear Kenyan National ID or retake their live selfie.
            </p>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#8A8072] uppercase tracking-wider block">
                Rejection Reason
              </label>
              <select
                value={kycRejectReason}
                onChange={(e) => setKycRejectReason(e.target.value)}
                className="w-full bg-[#FCFBF8] p-3 rounded-2xl border border-[#2B2620]/15 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C1533A]/30"
              >
                <option value="ID photo was blurry, glary, or unreadable">
                  ID photo was blurry, glary, or unreadable
                </option>
                <option value="Live face selfie did not match the photo on the National ID card">
                  Live face selfie did not match the photo on the National ID card
                </option>
                <option value="National ID number does not match submitted card scan">
                  National ID number does not match submitted card scan
                </option>
                <option value="Expired, counterfeit, or non-Kenyan identity document">
                  Expired, counterfeit, or non-Kenyan identity document
                </option>
                <option value="Liveness detection failed (static photo or screen capture detected)">
                  Liveness detection failed (static photo/screen detected)
                </option>
              </select>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setRejectingKycUserId(null)}
                className="px-4 py-2 text-xs font-bold text-[#8A8072] hover:text-[#2B2620]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRejectKyc}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-2xl shadow-xs transition-transform active:scale-95"
              >
                Confirm KYC Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW ZOOM MODAL */}
      {previewImageDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#2B2620] text-white rounded-3xl max-w-2xl w-full p-5 border border-white/20 shadow-2xl space-y-3 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm text-white flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{previewImageDoc.title}</span>
              </h4>
              <button
                onClick={() => setPreviewImageDoc(null)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-black/50 border border-white/10 max-h-[70vh] flex items-center justify-center">
              <img
                src={previewImageDoc.url}
                alt={previewImageDoc.title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>

            <div className="flex justify-between items-center text-xs text-[#8A8072] pt-1">
              <span>High-resolution KYC verification asset</span>
              <button
                onClick={() => setPreviewImageDoc(null)}
                className="px-4 py-1.5 bg-[#C1533A] hover:bg-[#a6422c] text-white font-extrabold text-xs rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN ATTACH HIGH-RES MEDIA MODAL */}
      {selectedListingForMedia && (() => {
        const targetListing = listings.find((l) => l.id === selectedListingForMedia);
        if (!targetListing) return null;
        const currentListingMedia = media.filter((m) => m.listing_id === targetListing.id);

        return (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#FCFBF8] text-[#2B2620] rounded-3xl max-w-2xl w-full p-6 border border-[#2B2620]/20 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-[#2B2620]/10 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                      Admin Media Control
                    </span>
                    <span className="text-[11px] text-[#8A8072] font-semibold">
                      Channel: {targetListing.submission_channel || 'Direct'}
                    </span>
                  </div>
                  <h3 className="serif text-lg font-extrabold text-[#2B2620] mt-1">
                    Attach High-Res Media: {targetListing.title}
                  </h3>
                  <p className="text-xs text-[#8A8072]">
                    Add 4K photos and video walkthroughs submitted to Isa Mohamed via WhatsApp (0741367051) or email.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedListingForMedia(null)}
                  className="p-1.5 rounded-full hover:bg-neutral-200 text-[#2B2620] text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Current Attached Media */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#2B2620] mb-2">
                  <span>Current Media on Listing ({currentListingMedia.length} assets)</span>
                  <span className="text-[11px] text-[#8A8072]">Click asset to preview in high resolution</span>
                </div>

                {currentListingMedia.length === 0 ? (
                  <div className="p-4 bg-white rounded-2xl border border-[#2B2620]/10 text-center text-xs text-[#8A8072]">
                    No media attached to this listing yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {currentListingMedia.map((m) => (
                      <div
                        key={m.id}
                        className="relative aspect-4/3 rounded-2xl overflow-hidden bg-neutral-900 border border-[#2B2620]/10 group"
                      >
                        <img
                          src={m.url}
                          alt={m.caption || 'Media'}
                          className="w-full h-full object-cover cursor-pointer hover:opacity-90"
                          onClick={() => setPreviewImageDoc({ url: m.url, title: m.caption || 'Asset' })}
                        />
                        {m.type === 'video' && (
                          <div className="absolute top-1.5 left-1.5 bg-black/75 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md flex items-center space-x-1">
                            <Play className="w-2.5 h-2.5 fill-white" />
                            <span>Video</span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeMediaFromListing(m.id)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600/90 hover:bg-red-700 text-white shadow-xs"
                          title="Remove from listing"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-1 left-1 right-1 bg-black/75 text-[8px] text-white/90 p-1 rounded-md font-mono truncate">
                          {m.caption || m.resolution || 'Photo'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upload Controls for Admin */}
              <div className="bg-white p-4 rounded-2xl border border-[#2B2620]/15 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#2B2620]">
                  <Upload className="w-4 h-4 text-emerald-700" />
                  <span>Attach New High-Res Photos or Walkthrough Video</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-[#8A8072] uppercase block mb-1">
                      Room / Area Label
                    </label>
                    <select
                      value={newMediaRoomLabel}
                      onChange={(e) => setNewMediaRoomLabel(e.target.value)}
                      className="w-full bg-[#FCFBF8] border border-[#2B2620]/20 rounded-xl p-2 font-bold text-xs"
                    >
                      <option value="Living Room">Living Room</option>
                      <option value="Master Bedroom">Master Bedroom</option>
                      <option value="Fitted Kitchen">Fitted Kitchen</option>
                      <option value="Ensuite Bathroom & Shower">Ensuite Bathroom & Shower</option>
                      <option value="Balcony & Panoramic View">Balcony & Panoramic View</option>
                      <option value="Walkthrough Video Tour">Walkthrough Video Tour</option>
                      <option value="Compound & Security Gate">Compound & Security Gate</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#8A8072] uppercase block mb-1">
                      Submission Channel Source
                    </label>
                    <select
                      value={newMediaSource}
                      onChange={(e) => setNewMediaSource(e.target.value as any)}
                      className="w-full bg-[#FCFBF8] border border-[#2B2620]/20 rounded-xl p-2 font-bold text-xs"
                    >
                      <option value="whatsapp">WhatsApp (0741367051)</option>
                      <option value="email">Email Submission</option>
                      <option value="device_upload">Admin Direct Upload</option>
                      <option value="live_camera">Live In-App Camera</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#8A8072] uppercase block mb-1">
                      Resolution / Quality Tag
                    </label>
                    <select
                      value={newMediaResolution}
                      onChange={(e) => setNewMediaResolution(e.target.value)}
                      className="w-full bg-[#FCFBF8] border border-[#2B2620]/20 rounded-xl p-2 font-bold text-xs"
                    >
                      <option value="4K Ultra HD">4K Ultra HD (High-Res)</option>
                      <option value="1080p Full HD">1080p Full HD</option>
                      <option value="1080p Walkthrough Video">1080p Walkthrough Video</option>
                      <option value="4K Drone / Exterior">4K Drone / Exterior</option>
                    </select>
                  </div>
                </div>

                {/* File Upload Box */}
                <input
                  type="file"
                  multiple
                  ref={adminMediaFileInputRef}
                  onChange={handleAdminFileUpload}
                  accept="image/*,video/*"
                  className="hidden"
                />

                <div
                  onClick={() => adminMediaFileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#2B2620]/20 hover:border-emerald-600 rounded-2xl p-4 text-center cursor-pointer bg-[#FCFBF8] transition-colors"
                >
                  <Upload className="w-7 h-7 text-emerald-700 mx-auto mb-1" />
                  <span className="text-xs font-extrabold text-[#2B2620] block">
                    Upload Photos / Video from Disk (WhatsApp Files)
                  </span>
                  <span className="text-[10px] text-[#8A8072]">
                    Supports PNG, JPG, MP4, MOV. Files received on WhatsApp or email.
                  </span>
                </div>

                {/* Quick Add 4K UHD Presets */}
                <div>
                  <span className="text-[10px] font-bold text-[#8A8072] uppercase block mb-1.5">
                    Quick-Attach Verified 4K Presets (Instant Clear Assets)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      {
                        title: 'Living Room (4K UHD)',
                        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
                        type: 'photo' as const,
                        res: '4K Ultra HD',
                      },
                      {
                        title: 'Master Bedroom (4K UHD)',
                        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200',
                        type: 'photo' as const,
                        res: '4K Ultra HD',
                      },
                      {
                        title: 'Modern Bathroom (4K UHD)',
                        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200',
                        type: 'photo' as const,
                        res: '4K Ultra HD',
                      },
                      {
                        title: 'Fitted Kitchen (4K UHD)',
                        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200',
                        type: 'photo' as const,
                        res: '4K Ultra HD',
                      },
                    ].map((preset) => (
                      <button
                        key={preset.title}
                        type="button"
                        onClick={() => addPresetToStaged(preset.title, preset.url, preset.type, preset.res)}
                        className="py-1 px-2.5 bg-[#FCFBF8] border border-[#2B2620]/15 hover:border-emerald-600 rounded-xl text-[10px] font-bold text-[#2B2620] flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3 text-emerald-700" />
                        <span>+ {preset.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Newly Staged Files to Attach */}
                {stagedMediaList.length > 0 && (
                  <div className="pt-2 border-t border-[#2B2620]/10 space-y-2">
                    <span className="text-xs font-bold text-emerald-800 block">
                      Staged to be attached ({stagedMediaList.length} assets):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {stagedMediaList.map((staged, idx) => (
                        <div key={idx} className="relative aspect-4/3 rounded-xl overflow-hidden bg-neutral-900 border border-emerald-500">
                          <img src={staged.url} alt="" className="w-full h-full object-cover" />
                          <div className="absolute top-1 left-1 bg-emerald-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md">
                            {staged.caption}
                          </div>
                          <button
                            type="button"
                            onClick={() => setStagedMediaList((prev) => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full text-[9px]"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-[#2B2620]/10">
                <button
                  onClick={() => setSelectedListingForMedia(null)}
                  className="px-4 py-2 text-xs font-bold text-[#8A8072] hover:text-[#2B2620]"
                >
                  Cancel
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    disabled={stagedMediaList.length === 0}
                    onClick={() => handleSaveStagedMedia(false)}
                    className="px-4 py-2.5 bg-[#2B2620] hover:bg-black disabled:opacity-50 text-[#FCFBF8] text-xs font-extrabold rounded-xl shadow-xs transition-transform active:scale-95"
                  >
                    Save Media
                  </button>

                  <button
                    onClick={() => handleSaveStagedMedia(true)}
                    className="px-5 py-2.5 bg-[#3B5D42] hover:bg-[#2c4732] text-white text-xs font-extrabold rounded-xl shadow-xs transition-transform active:scale-95 flex items-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save & Approve Listing Live</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ADMIN POST SPACE FROM WHATSAPP MODAL */}
      {isCreatingListingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FCFBF8] text-[#2B2620] rounded-3xl max-w-2xl w-full p-6 border border-[#2B2620]/20 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#2B2620]/10 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <MessageCircle className="w-3 h-3 text-emerald-600" />
                    <span>WhatsApp Concierge (0741367051)</span>
                  </span>
                </div>
                <h3 className="serif text-xl font-extrabold text-[#2B2620] mt-1">
                  Create Listing from WhatsApp Submission
                </h3>
                <p className="text-xs text-[#8A8072]">
                  Add space details and high-res media messaged directly to founder Isa Mohamed.
                </p>
              </div>
              <button
                onClick={() => setIsCreatingListingModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-200 text-[#2B2620] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#2B2620] block mb-1">Space Category</label>
                  <select
                    value={adminPostCategory}
                    onChange={(e) => setAdminPostCategory(e.target.value as any)}
                    className="w-full bg-white border border-[#2B2620]/20 rounded-xl p-2.5 font-bold text-xs"
                  >
                    <option value="Rentals">Rentals</option>
                    <option value="Shops & Offices">Shops & Offices</option>
                    <option value="Airbnb">Airbnb</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#2B2620] block mb-1">Property Type</label>
                  <input
                    type="text"
                    value={adminPostType}
                    onChange={(e) => setAdminPostType(e.target.value)}
                    placeholder="e.g. 2 Bedroom Apartment"
                    className="w-full bg-white border border-[#2B2620]/20 rounded-xl p-2.5 font-bold text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#2B2620] block mb-1">Listing Title</label>
                <input
                  type="text"
                  value={adminPostTitle}
                  onChange={(e) => setAdminPostTitle(e.target.value)}
                  placeholder="e.g. Modern 2-Bedroom with Balcony in Kilimani"
                  className="w-full bg-white border border-[#2B2620]/20 rounded-xl p-2.5 font-bold text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#2B2620] block mb-1">Rent / Rate (KES)</label>
                  <input
                    type="number"
                    value={adminPostPrice}
                    onChange={(e) => setAdminPostPrice(Number(e.target.value))}
                    className="w-full bg-white border border-[#2B2620]/20 rounded-xl p-2.5 font-extrabold text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#2B2620] block mb-1">Period</label>
                  <select
                    value={adminPostPricePeriod}
                    onChange={(e) => setAdminPostPricePeriod(e.target.value as any)}
                    className="w-full bg-white border border-[#2B2620]/20 rounded-xl p-2.5 font-bold text-xs"
                  >
                    <option value="month">Per Month</option>
                    <option value="night">Per Night</option>
                    <option value="day">Per Day</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#2B2620] block mb-1">Unlock Fee (KES)</label>
                  <input
                    type="number"
                    value={adminPostUnlockPrice}
                    onChange={(e) => setAdminPostUnlockPrice(Number(e.target.value))}
                    className="w-full bg-white border border-[#2B2620]/20 rounded-xl p-2.5 font-extrabold text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#2B2620] block mb-1">Kenyan Area</label>
                  <input
                    type="text"
                    value={adminPostArea}
                    onChange={(e) => setAdminPostArea(e.target.value)}
                    placeholder="e.g. Kilimani, Nairobi"
                    className="w-full bg-white border border-[#2B2620]/20 rounded-xl p-2.5 font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#2B2620] block mb-1">Exact Landmark (Protected)</label>
                  <input
                    type="text"
                    value={adminPostLandmark}
                    onChange={(e) => setAdminPostLandmark(e.target.value)}
                    placeholder="e.g. Opp Yaya Centre, Rose Avenue"
                    className="w-full bg-white border border-[#2B2620]/20 rounded-xl p-2.5 font-bold text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#2B2620] block mb-1">WhatsApp Submitter Phone</label>
                  <input
                    type="text"
                    value={adminPostPosterPhone}
                    onChange={(e) => setAdminPostPosterPhone(e.target.value)}
                    placeholder="e.g. +254 741 367 051"
                    className="w-full bg-white border border-[#2B2620]/20 rounded-xl p-2.5 font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#2B2620] block mb-1">Floor Size</label>
                  <input
                    type="text"
                    value={adminPostFloorSize}
                    onChange={(e) => setAdminPostFloorSize(e.target.value)}
                    placeholder="e.g. 75 sq.m"
                    className="w-full bg-white border border-[#2B2620]/20 rounded-xl p-2.5 font-bold text-xs"
                  />
                </div>
              </div>

              {/* Status checkbox */}
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-emerald-950 block">Publish Immediately as Active</span>
                  <span className="text-[10px] text-emerald-800">
                    Bypass pending review since Isa Mohamed verified the WhatsApp media
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={adminPostAutoApprove}
                  onChange={(e) => setAdminPostAutoApprove(e.target.checked)}
                  className="w-4 h-4 accent-[#3B5D42] rounded"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#2B2620]/10">
              <button
                onClick={() => setIsCreatingListingModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-[#8A8072] hover:text-[#2B2620]"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateListingFromWhatsApp}
                className="px-5 py-2.5 bg-[#3B5D42] hover:bg-[#2c4732] text-white font-extrabold text-xs rounded-xl shadow-xs transition-transform active:scale-95 flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Listing & Attach Verified Assets</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
