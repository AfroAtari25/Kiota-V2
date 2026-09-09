import React, { useState } from 'react';
import { useApp, normalizeKenyanPhone } from '../context/AppContext';
import {
  Phone,
  ShieldCheck,
  X,
  ArrowRight,
  Smartphone,
  Sparkles,
  CheckCircle2,
  Lock,
  Camera,
  Upload,
  UserCheck,
  FileText,
  AlertCircle,
  Eye,
  Crown,
} from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { loginWithPhone, users } = useApp();

  const [step, setStep] = useState<'basic' | 'kyc_id' | 'kyc_face' | 'otp'>('basic');
  const [phoneDigits, setPhoneDigits] = useState('741367051'); // Default to Isa Mohamed admin for testing or demo
  const [name, setName] = useState('');
  const [role, setRole] = useState<'seeker' | 'poster'>('poster');
  const [requiresKyc, setRequiresKyc] = useState<boolean>(true);

  // KYC Fields
  const [nationalIdNumber, setNationalIdNumber] = useState('');
  const [idFrontUrl, setIdFrontUrl] = useState('');
  const [idBackUrl, setIdBackUrl] = useState('');
  const [faceSelfieUrl, setFaceSelfieUrl] = useState('');
  const [faceLivenessScore, setFaceLivenessScore] = useState(99.2);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraCountdown, setCameraCountdown] = useState<number | null>(null);

  // OTP
  const [otp, setOtp] = useState('4829');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fullPhoneNumber = `+254 ${phoneDigits.trim()}`;
  const isIsaAdminPhone =
    normalizeKenyanPhone(phoneDigits) === '0741367051' ||
    phoneDigits.includes('741367051');

  const SAMPLE_ID_FRONTS = [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
  ];
  const SAMPLE_SELFIES = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
  ];

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'front' | 'back' | 'selfie'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (target === 'front') setIdFrontUrl(result);
        if (target === 'back') setIdBackUrl(result);
        if (target === 'selfie') {
          setFaceSelfieUrl(result);
          setFaceLivenessScore(98.8 + Math.random() * 1.1);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartCapture = () => {
    setIsCameraActive(true);
    setCameraCountdown(3);
    const interval = setInterval(() => {
      setCameraCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          const randomSelfie = SAMPLE_SELFIES[Math.floor(Math.random() * SAMPLE_SELFIES.length)];
          setFaceSelfieUrl(randomSelfie);
          setFaceLivenessScore(99.4);
          setIsCameraActive(false);
          return null;
        }
        return prev - 1;
      });
    }, 800);
  };

  const handleBasicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneDigits || phoneDigits.length < 8) {
      setErrorMsg('Please enter a valid Kenyan phone number (e.g. 0741367051 or 741367051).');
      return;
    }
    setErrorMsg('');

    // If it's the Admin phone, skip KYC requirement as Isa Mohamed is already Verified Super Admin
    if (isIsaAdminPhone) {
      setStep('otp');
      return;
    }

    // If poster role or user opted for KYC verification to receive payouts
    if (role === 'poster' || requiresKyc) {
      setStep('kyc_id');
    } else {
      setStep('otp');
    }
  };

  const handleKycIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nationalIdNumber || nationalIdNumber.length < 6) {
      setErrorMsg('Please enter your Kenyan National ID Number.');
      return;
    }
    if (!idFrontUrl) {
      setErrorMsg('Please upload or select a clear photo of your National ID Front.');
      return;
    }
    setErrorMsg('');
    setStep('kyc_face');
  };

  const handleKycFaceSubmit = () => {
    if (!faceSelfieUrl) {
      setErrorMsg('Please capture your live face selfie to complete biometric verification.');
      return;
    }
    setErrorMsg('');
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      loginWithPhone(fullPhoneNumber, name, role, {
        nationalIdNumber,
        idFrontUrl,
        idBackUrl,
        faceSelfieUrl,
        faceLivenessScore,
      });
      setIsVerifying(false);
      onClose();
    }, 600);
  };

  const handleQuickSelect = (
    userPhone: string,
    userName: string,
    userRole: 'seeker' | 'poster' | 'admin'
  ) => {
    const raw = userPhone.replace('+254', '').trim();
    setPhoneDigits(raw);
    setName(userName);
    if (userRole === 'admin') {
      setRole('poster');
    } else {
      setRole(userRole);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B2620]/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-[#FCFBF8] w-full max-w-lg rounded-3xl border border-[#8A8072]/20 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-[#3B5D42] text-[#F7F5EE] p-5 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 text-[#C1533A] font-bold text-xs uppercase tracking-wider mb-1">
            <Smartphone className="w-4 h-4 text-emerald-300" />
            <span className="text-emerald-200">Kiota Kenyan Auth & KYC Portal</span>
          </div>

          <h2 className="text-xl font-extrabold text-white">
            {step === 'basic' && 'Karibu Kiota'}
            {step === 'kyc_id' && 'Upload Kenyan National ID'}
            {step === 'kyc_face' && 'Live Biometric Face Capture'}
            {step === 'otp' && 'Verify SMS OTP Code'}
          </h2>

          <p className="text-xs text-white/80 mt-0.5">
            {step === 'basic' && 'Kenyan phone authentication with M-Pesa KYC verification.'}
            {step === 'kyc_id' && 'Required for posters to earn money and receive instant M-Pesa payouts.'}
            {step === 'kyc_face' && 'Instant biometric selfie check to safeguard community trust.'}
            {step === 'otp' && `Enter the 4-digit verification code sent to ${fullPhoneNumber}`}
          </p>

          {/* Stepper Dots */}
          <div className="flex items-center space-x-2 mt-4">
            <div
              className={`h-1.5 flex-1 rounded-full ${
                step === 'basic' || step === 'kyc_id' || step === 'kyc_face' || step === 'otp'
                  ? 'bg-emerald-400'
                  : 'bg-white/20'
              }`}
            />
            {(role === 'poster' || requiresKyc) && !isIsaAdminPhone && (
              <>
                <div
                  className={`h-1.5 flex-1 rounded-full ${
                    step === 'kyc_id' || step === 'kyc_face' || step === 'otp'
                      ? 'bg-emerald-400'
                      : 'bg-white/20'
                  }`}
                />
                <div
                  className={`h-1.5 flex-1 rounded-full ${
                    step === 'kyc_face' || step === 'otp' ? 'bg-emerald-400' : 'bg-white/20'
                  }`}
                />
              </>
            )}
            <div
              className={`h-1.5 flex-1 rounded-full ${
                step === 'otp' ? 'bg-emerald-400' : 'bg-white/20'
              }`}
            />
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center space-x-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Basic Information */}
          {step === 'basic' && (
            <form onSubmit={handleBasicSubmit} className="space-y-4">
              {/* Phone Input */}
              <div>
                <label className="block text-xs font-bold text-[#2B2620] mb-1.5">
                  Kenyan Mobile Number (Safaricom / Airtel) <span className="text-[#C1533A]">*</span>
                </label>
                <div className="flex rounded-2xl border border-[#8A8072]/30 bg-white overflow-hidden focus-within:border-[#3B5D42] focus-within:ring-2 focus-within:ring-[#3B5D42]/20 transition-all">
                  <div className="px-3.5 py-3 bg-[#F7F5EE] border-r border-[#8A8072]/20 text-xs font-bold text-[#3B5D42] flex items-center space-x-1">
                    <span>🇰🇪 +254</span>
                  </div>
                  <input
                    type="tel"
                    required
                    value={phoneDigits}
                    onChange={(e) => setPhoneDigits(e.target.value)}
                    placeholder="741 367 051"
                    className="w-full px-3.5 py-3 text-sm font-semibold text-[#2B2620] focus:outline-hidden"
                  />
                </div>

                {isIsaAdminPhone && (
                  <div className="mt-2 p-2.5 bg-amber-50 border border-amber-300 rounded-xl flex items-center space-x-2 text-xs text-amber-900 font-semibold">
                    <Crown className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Super Admin number recognized (Isa Mohamed). Full Admin Hub unlocked!</span>
                  </div>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#2B2620] mb-1.5">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Isa Mohamed or Wanjiku Mwangi"
                  className="w-full rounded-2xl border border-[#8A8072]/30 bg-white px-3.5 py-3 text-sm font-semibold text-[#2B2620] focus:outline-hidden focus:border-[#3B5D42] focus:ring-2 focus:ring-[#3B5D42]/20 transition-all"
                />
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-[#2B2620] mb-1.5">
                  Your Primary Kiota Activity
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRole('poster');
                      setRequiresKyc(true);
                    }}
                    className={`py-3 px-3 rounded-2xl text-xs font-bold border transition-all text-left flex flex-col justify-between ${
                      role === 'poster'
                        ? 'bg-[#3B5D42] text-white border-[#3B5D42] shadow-sm'
                        : 'bg-white text-[#2B2620] border-[#8A8072]/20 hover:border-[#3B5D42]'
                    }`}
                  >
                    <span className="text-base mb-1">🏠</span>
                    <div>
                      <div className="font-extrabold">Post & Earn M-Pesa</div>
                      <div className={`text-[10px] ${role === 'poster' ? 'text-white/80' : 'text-[#8A8072]'}`}>
                        Landlord / Space Sharer
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRole('seeker');
                      setRequiresKyc(false);
                    }}
                    className={`py-3 px-3 rounded-2xl text-xs font-bold border transition-all text-left flex flex-col justify-between ${
                      role === 'seeker'
                        ? 'bg-[#3B5D42] text-white border-[#3B5D42] shadow-sm'
                        : 'bg-white text-[#2B2620] border-[#8A8072]/20 hover:border-[#3B5D42]'
                    }`}
                  >
                    <span className="text-base mb-1">🔍</span>
                    <div>
                      <div className="font-extrabold">Find Real Homes</div>
                      <div className={`text-[10px] ${role === 'seeker' ? 'text-white/80' : 'text-[#8A8072]'}`}>
                        Rentals & Direct Contacts
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* KYC notice badge for posters */}
              {role === 'poster' && !isIsaAdminPhone && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-2 text-xs text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Kenyan KYC Verification Required: </span>
                    <span className="text-emerald-800">
                      You will upload a National ID copy and take a live face selfie to be approved for M-Pesa payouts.
                    </span>
                  </div>
                </div>
              )}

              {/* Quick Pick Accounts */}
              <div className="pt-2 border-t border-[#8A8072]/15">
                <div className="text-[11px] font-bold text-[#8A8072] uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Quick Test Demo Profiles:</span>
                  <span className="text-[10px] text-[#3B5D42] font-semibold">Click to load</span>
                </div>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickSelect('0741367051', 'Isa Mohamed', 'admin')}
                    className="w-full text-left px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-xs flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="flex items-center space-x-1.5 font-bold text-[#2B2620]">
                        <Crown className="w-3.5 h-3.5 text-amber-600" />
                        <span>Isa Mohamed (Super Admin)</span>
                      </div>
                      <div className="text-[10px] text-[#8A8072] font-mono">IsaMohamed92@gmail.com</div>
                    </div>
                    <span className="text-[#C1533A] font-mono font-bold text-[11px]">0741367051</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickSelect('0722345678', 'Wanjiku Mwangi', 'poster')}
                    className="w-full text-left px-3 py-1.5 bg-white hover:bg-neutral-50 border border-[#8A8072]/15 rounded-xl text-xs flex items-center justify-between transition-colors"
                  >
                    <span className="font-semibold text-[#2B2620]">Wanjiku Mwangi (Verified Landlord)</span>
                    <span className="text-[#8A8072] font-mono text-[11px]">0722345678</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickSelect('0711987654', 'Brian Kipchoge', 'seeker')}
                    className="w-full text-left px-3 py-1.5 bg-white hover:bg-neutral-50 border border-[#8A8072]/15 rounded-xl text-xs flex items-center justify-between transition-colors"
                  >
                    <span className="font-semibold text-[#2B2620]">Brian Kipchoge (House Seeker)</span>
                    <span className="text-[#8A8072] font-mono text-[11px]">0711987654</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#C1533A] hover:bg-[#a53709] text-white rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-98 mt-2"
              >
                <span>{role === 'poster' && !isIsaAdminPhone ? 'Proceed to KYC ID Verification' : 'Send SMS OTP Code'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: KYC National ID Upload */}
          {step === 'kyc_id' && (
            <form onSubmit={handleKycIdSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2B2620] mb-1.5">
                  Kenyan National ID Number <span className="text-[#C1533A]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={nationalIdNumber}
                    onChange={(e) => setNationalIdNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 28491023"
                    className="w-full rounded-2xl border border-[#8A8072]/30 bg-white px-4 py-3 text-sm font-semibold text-[#2B2620] focus:outline-hidden focus:border-[#3B5D42] focus:ring-2 focus:ring-[#3B5D42]/20 transition-all pl-10"
                  />
                  <FileText className="w-4 h-4 text-[#8A8072] absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* ID Front */}
              <div>
                <label className="block text-xs font-bold text-[#2B2620] mb-1.5 flex items-center justify-between">
                  <span>National ID Card (Front) <span className="text-[#C1533A]">*</span></span>
                  <span className="text-[11px] text-[#3B5D42] font-semibold">Photo & details visible</span>
                </label>

                {idFrontUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/50 bg-emerald-50 p-2 flex items-center space-x-3">
                    <img
                      src={idFrontUrl}
                      alt="ID Front"
                      referrerPolicy="no-referrer"
                      className="w-20 h-14 object-cover rounded-xl border border-[#8A8072]/20"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>ID Front Captured</span>
                      </div>
                      <p className="text-[11px] text-emerald-700 truncate">Stored safely for verification</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIdFrontUrl('')}
                      className="p-1.5 rounded-full hover:bg-emerald-100 text-emerald-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="border-2 border-dashed border-[#8A8072]/30 hover:border-[#3B5D42] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-white transition-all text-center group">
                      <Upload className="w-6 h-6 text-[#8A8072] group-hover:text-[#3B5D42] mb-1" />
                      <span className="text-xs font-bold text-[#2B2620]">Upload ID Front Photo</span>
                      <span className="text-[11px] text-[#8A8072]">Take photo or upload image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'front')}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIdFrontUrl(SAMPLE_ID_FRONTS[0]);
                        if (!nationalIdNumber) setNationalIdNumber('35892104');
                      }}
                      className="text-[11px] text-[#3B5D42] hover:underline font-semibold block"
                    >
                      Attach Sample Kenyan ID Front
                    </button>
                  </div>
                )}
              </div>

              {/* ID Back */}
              <div>
                <label className="block text-xs font-bold text-[#2B2620] mb-1.5 flex items-center justify-between">
                  <span>National ID Card (Back) <span className="text-[#8A8072] font-normal">(Optional)</span></span>
                </label>

                {idBackUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border border-emerald-500/50 bg-emerald-50 p-2 flex items-center space-x-3">
                    <img
                      src={idBackUrl}
                      alt="ID Back"
                      referrerPolicy="no-referrer"
                      className="w-20 h-14 object-cover rounded-xl border border-[#8A8072]/20"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>ID Back Attached</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIdBackUrl('')}
                      className="p-1.5 rounded-full hover:bg-emerald-100 text-emerald-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border border-dashed border-[#8A8072]/30 hover:border-[#3B5D42] rounded-2xl p-3 flex items-center justify-center space-x-2 cursor-pointer bg-white transition-all">
                    <Upload className="w-4 h-4 text-[#8A8072]" />
                    <span className="text-xs font-semibold text-[#2B2620]">Upload ID Back Scan</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'back')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('basic')}
                  className="py-3 px-4 border border-[#8A8072]/30 hover:bg-neutral-100 rounded-2xl font-bold text-xs text-[#2B2620]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-[#3B5D42] hover:bg-[#2e4a34] text-white rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-98"
                >
                  <span>Continue to Face Selfie Capture</span>
                  <UserCheck className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: KYC Biometric Face Capture */}
          {step === 'kyc_face' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-sm font-extrabold text-[#2B2620]">
                  Biometric Face Match & Liveness Check
                </h3>
                <p className="text-xs text-[#8A8072] mt-0.5">
                  Verify that you are the genuine owner of the submitted ID card.
                </p>
              </div>

              {/* Interactive Camera Container */}
              <div className="relative mx-auto w-64 h-64 bg-[#2B2620] rounded-3xl overflow-hidden border-4 border-[#3B5D42] shadow-xl flex flex-col items-center justify-center">
                {faceSelfieUrl && !isCameraActive ? (
                  <div className="relative w-full h-full">
                    <img
                      src={faceSelfieUrl}
                      alt="Captured Face"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-xs rounded-xl p-1.5 text-center text-white text-[11px] font-bold flex items-center justify-center space-x-1.5 border border-emerald-400/40">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>Liveness Match: {faceLivenessScore.toFixed(1)}%</span>
                    </div>
                  </div>
                ) : isCameraActive ? (
                  <div className="relative w-full h-full bg-[#1e1b18] flex flex-col items-center justify-center">
                    <div className="w-40 h-52 rounded-full border-2 border-dashed border-emerald-400 flex flex-col items-center justify-center relative">
                      {cameraCountdown !== null ? (
                        <span className="text-5xl font-extrabold text-white animate-ping">
                          {cameraCountdown}
                        </span>
                      ) : (
                        <div className="text-center px-4">
                          <Eye className="w-8 h-8 text-emerald-400 mx-auto mb-2 animate-bounce" />
                          <span className="text-xs font-bold text-white">Look at camera</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute top-2 bg-emerald-600/90 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Biometric Sensor Active
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-white flex flex-col items-center">
                    <div className="w-16 h-20 rounded-full border-2 border-dashed border-white/40 flex items-center justify-center mb-2">
                      <Camera className="w-6 h-6 text-white/70" />
                    </div>
                    <span className="text-xs font-bold text-white/90">Click Below to Capture</span>
                    <span className="text-[10px] text-white/60 mt-0.5">Live anti-spoofing photo</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleStartCapture}
                  disabled={isCameraActive}
                  className="w-full py-3 bg-[#C1533A] hover:bg-[#a53709] text-white rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md active:scale-98"
                >
                  <Camera className="w-4 h-4" />
                  <span>{faceSelfieUrl ? 'Retake Face Selfie' : 'Capture Live Face Selfie'}</span>
                </button>

                <div className="flex items-center justify-center space-x-3 text-xs">
                  <label className="text-[#8A8072] hover:text-[#3B5D42] font-semibold cursor-pointer underline flex items-center space-x-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'selfie')}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[#8A8072]">•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFaceSelfieUrl(SAMPLE_SELFIES[3]);
                      setFaceLivenessScore(99.1);
                    }}
                    className="text-[#3B5D42] hover:underline font-semibold"
                  >
                    Attach Sample Verified Face
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('kyc_id')}
                  className="py-3 px-4 border border-[#8A8072]/30 hover:bg-neutral-100 rounded-2xl font-bold text-xs text-[#2B2620]"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!faceSelfieUrl}
                  onClick={handleKycFaceSubmit}
                  className={`flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md ${
                    faceSelfieUrl
                      ? 'bg-[#3B5D42] hover:bg-[#2e4a34] text-white active:scale-98'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  <span>Proceed to SMS Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SMS OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-900 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-700" />
                  <div>
                    <span className="font-bold">Kenyan SMS OTP: </span>
                    <span className="text-emerald-800">Use code for instant sign in</span>
                  </div>
                </div>
                <span className="font-mono bg-white px-2.5 py-1 rounded-md font-extrabold text-[#C1533A] border border-emerald-300">
                  4829
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2620] mb-1.5 text-center">
                  Enter 4-Digit Verification Code
                </label>
                <div className="flex justify-center">
                  <input
                    type="text"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-44 text-center tracking-[0.4em] text-2xl font-mono font-extrabold text-[#2B2620] bg-white border-2 border-[#3B5D42] rounded-2xl py-3 focus:outline-hidden shadow-inner"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#8A8072]">
                <button
                  type="button"
                  onClick={() => setStep('basic')}
                  className="hover:underline font-semibold text-[#2B2620]"
                >
                  Change phone number
                </button>
                <button
                  type="button"
                  onClick={() => setOtp('4829')}
                  className="text-[#C1533A] font-bold hover:underline"
                >
                  Resend OTP
                </button>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3.5 bg-[#3B5D42] hover:bg-[#2e4a34] text-white rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-98"
              >
                {isVerifying ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {isIsaAdminPhone
                        ? 'Authenticate Super Admin & Open Admin Hub'
                        : 'Verify & Enter Kiota'}
                    </span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
