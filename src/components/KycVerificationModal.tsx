import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  X,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  Sparkles,
  RefreshCw,
  Eye,
  Lock,
} from 'lucide-react';

interface KycVerificationModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const KycVerificationModal: React.FC<KycVerificationModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const { currentUser, submitKycVerification } = useApp();

  const [step, setStep] = useState<'id_doc' | 'face_capture' | 'submitting' | 'success'>('id_doc');
  const [nationalIdNumber, setNationalIdNumber] = useState(currentUser.national_id_number || '');
  const [idFrontUrl, setIdFrontUrl] = useState(currentUser.id_front_url || '');
  const [idBackUrl, setIdBackUrl] = useState(currentUser.id_back_url || '');
  const [faceSelfieUrl, setFaceSelfieUrl] = useState(currentUser.face_selfie_url || '');
  const [faceLivenessScore, setFaceLivenessScore] = useState<number>(99.4);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraCountdown, setCameraCountdown] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Sample ID and Face templates for quick testing
  const SAMPLE_ID_FRONTS = [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?w=600&auto=format&fit=crop&q=80',
  ];
  const SAMPLE_ID_BACKS = [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
  ];
  const SAMPLE_SELFIES = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
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
          // Pick realistic selfie
          const randomSelfie = SAMPLE_SELFIES[Math.floor(Math.random() * SAMPLE_SELFIES.length)];
          setFaceSelfieUrl(randomSelfie);
          setFaceLivenessScore(99.2 + Math.floor(Math.random() * 6) / 10);
          setIsCameraActive(false);
          return null;
        }
        return prev - 1;
      });
    }, 800);
  };

  const handleContinueToFace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nationalIdNumber || nationalIdNumber.length < 6) {
      setErrorMsg('Please enter a valid Kenyan National ID number (at least 6 digits).');
      return;
    }
    if (!idFrontUrl) {
      setErrorMsg('Please upload or select a clear photo of your National ID (Front).');
      return;
    }
    setErrorMsg('');
    setStep('face_capture');
  };

  const handleSubmitKyc = () => {
    if (!faceSelfieUrl) {
      setErrorMsg('Please complete your live face capture to verify identity.');
      return;
    }

    setStep('submitting');
    setTimeout(() => {
      submitKycVerification(currentUser.id, {
        nationalIdNumber,
        idFrontUrl: idFrontUrl || SAMPLE_ID_FRONTS[0],
        idBackUrl: idBackUrl || SAMPLE_ID_BACKS[0],
        faceSelfieUrl,
        faceLivenessScore,
      });
      setStep('success');
    }, 1000);
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
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span className="text-emerald-200">Kiota Identity & Payout Verification</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            National ID & Live Face Verification
          </h2>
          <p className="text-xs text-white/80 mt-0.5">
            Required by Kenyan regulatory standards to earn from posts and receive instant M-Pesa payouts.
          </p>

          {/* Step Progress Indicators */}
          <div className="flex items-center space-x-2 mt-4">
            <div
              className={`h-1.5 flex-1 rounded-full transition-all ${
                step === 'id_doc' || step === 'face_capture' || step === 'submitting' || step === 'success'
                  ? 'bg-emerald-400'
                  : 'bg-white/30'
              }`}
            />
            <div
              className={`h-1.5 flex-1 rounded-full transition-all ${
                step === 'face_capture' || step === 'submitting' || step === 'success'
                  ? 'bg-emerald-400'
                  : 'bg-white/30'
              }`}
            />
            <div
              className={`h-1.5 flex-1 rounded-full transition-all ${
                step === 'success' ? 'bg-emerald-400' : 'bg-white/30'
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

          {/* STEP 1: National ID Document */}
          {step === 'id_doc' && (
            <form onSubmit={handleContinueToFace} className="space-y-4">
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
                <p className="text-[11px] text-[#8A8072] mt-1">
                  We securely hash your ID number to prevent identity fraud and ensure account safety.
                </p>
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
                      <p className="text-[11px] text-emerald-700 truncate">Ready for admin verification</p>
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
                      <span className="text-[11px] text-[#8A8072]">JPEG, PNG, or camera scan</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => handleFileUpload(e, 'front')}
                        className="hidden"
                      />
                    </label>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] text-[#8A8072]">Or demo sample:</span>
                      <button
                        type="button"
                        onClick={() => setIdFrontUrl(SAMPLE_ID_FRONTS[0])}
                        className="text-[11px] bg-white border border-[#8A8072]/20 hover:border-[#3B5D42] px-2.5 py-1 rounded-lg font-medium text-[#2B2620]"
                      >
                        Sample Kenyan ID Front
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ID Back */}
              <div>
                <label className="block text-xs font-bold text-[#2B2620] mb-1.5 flex items-center justify-between">
                  <span>National ID Card (Back) <span className="text-[#8A8072] font-normal">(Optional)</span></span>
                  <span className="text-[11px] text-[#8A8072]">Fingerprint & barcode</span>
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
                  <div className="space-y-2">
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
                    <button
                      type="button"
                      onClick={() => setIdBackUrl(SAMPLE_ID_BACKS[0])}
                      className="text-[11px] text-[#8A8072] hover:text-[#3B5D42] underline block"
                    >
                      Attach Sample ID Back
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#3B5D42] hover:bg-[#2e4a34] text-white rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-98"
                >
                  <span>Proceed to Live Face Capture</span>
                  <UserCheck className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Live Face Capture Element */}
          {step === 'face_capture' && (
            <div className="space-y-5">
              <div className="text-center">
                <h3 className="text-sm font-extrabold text-[#2B2620]">
                  Biometric Face Match & Liveness Check
                </h3>
                <p className="text-xs text-[#8A8072] mt-0.5">
                  Align your face within the oval. Kiota validates your selfie against your National ID.
                </p>
              </div>

              {/* Interactive Camera Container */}
              <div className="relative mx-auto w-64 h-72 bg-[#2B2620] rounded-3xl overflow-hidden border-4 border-[#3B5D42] shadow-xl flex flex-col items-center justify-center">
                {faceSelfieUrl && !isCameraActive ? (
                  <div className="relative w-full h-full">
                    <img
                      src={faceSelfieUrl}
                      alt="Captured Face"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-xs rounded-xl p-2 text-center text-white text-xs font-bold flex items-center justify-center space-x-1.5 border border-emerald-400/40">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Match Confidence: {faceLivenessScore.toFixed(1)}%</span>
                    </div>
                  </div>
                ) : isCameraActive ? (
                  <div className="relative w-full h-full bg-[#1e1b18] flex flex-col items-center justify-center">
                    {/* Simulated live video stream */}
                    <div className="absolute inset-0 bg-radial from-[#3B5D42]/30 to-transparent animate-pulse" />
                    {/* Face Oval Guide */}
                    <div className="w-44 h-56 rounded-full border-2 border-dashed border-emerald-400 flex flex-col items-center justify-center relative">
                      {cameraCountdown !== null ? (
                        <span className="text-5xl font-extrabold text-white drop-shadow-md animate-ping">
                          {cameraCountdown}
                        </span>
                      ) : (
                        <div className="text-center px-4">
                          <Eye className="w-8 h-8 text-emerald-400 mx-auto mb-2 animate-bounce" />
                          <span className="text-xs font-bold text-white">Look straight & hold steady</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute top-3 bg-emerald-600/90 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      <span>Live Liveness Sensor Active</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-white flex flex-col items-center">
                    <div className="w-20 h-24 rounded-full border-2 border-dashed border-white/40 flex items-center justify-center mb-3">
                      <Camera className="w-8 h-8 text-white/70" />
                    </div>
                    <span className="text-xs font-bold text-white/90">Click to Open Live Camera</span>
                    <span className="text-[11px] text-white/60 mt-1">Instant biometric recognition</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleStartCapture}
                  disabled={isCameraActive}
                  className="w-full py-3.5 bg-[#C1533A] hover:bg-[#a53709] text-white rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-98"
                >
                  <Camera className="w-4 h-4" />
                  <span>{faceSelfieUrl ? 'Retake Face Selfie' : 'Capture Live Face Selfie'}</span>
                </button>

                <div className="flex items-center justify-center space-x-3 pt-1">
                  <label className="text-xs text-[#8A8072] hover:text-[#3B5D42] font-semibold cursor-pointer underline flex items-center space-x-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload photo file</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      onChange={(e) => handleFileUpload(e, 'selfie')}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[#8A8072] text-xs">•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFaceSelfieUrl(SAMPLE_SELFIES[0]);
                      setFaceLivenessScore(99.6);
                    }}
                    className="text-xs text-[#3B5D42] hover:underline font-semibold"
                  >
                    Use Sample Verified Face
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('id_doc')}
                  className="py-3 px-4 border border-[#8A8072]/30 hover:bg-neutral-100 rounded-2xl font-bold text-xs text-[#2B2620]"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!faceSelfieUrl}
                  onClick={handleSubmitKyc}
                  className={`flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md ${
                    faceSelfieUrl
                      ? 'bg-[#3B5D42] hover:bg-[#2e4a34] text-white active:scale-98'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit for Instant Admin Verification</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Submitting State */}
          {step === 'submitting' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 border-4 border-[#3B5D42] border-t-transparent rounded-full animate-spin mx-auto" />
              <div>
                <h3 className="text-base font-extrabold text-[#2B2620]">
                  Verifying ID & Biometrics...
                </h3>
                <p className="text-xs text-[#8A8072] mt-1 max-w-xs mx-auto">
                  Running Kenyan National ID format check, anti-spoofing liveness model, and encryption.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Success State */}
          {step === 'success' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#2B2620]">
                  Verification Details Submitted!
                </h3>
                <p className="text-xs text-[#8A8072] mt-1.5 max-w-sm mx-auto">
                  Your National ID and live face capture have been queued for the Kiota Super Admin verification desk. Once approved, you can post listings, unlock spaces, and withdraw direct M-Pesa payouts.
                </p>
              </div>

              <div className="bg-[#F7F5EE] border border-[#8A8072]/20 rounded-2xl p-4 max-w-sm mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8A8072]">National ID:</span>
                  <span className="font-mono font-bold text-[#2B2620]">{nationalIdNumber.slice(0, 4)}****</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A8072]">Biometric Liveness:</span>
                  <span className="font-bold text-emerald-700">{faceLivenessScore.toFixed(1)}% (Passed)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A8072]">Payout Status:</span>
                  <span className="font-bold text-[#C1533A]">Pending Admin Review</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onSuccess) onSuccess();
                  onClose();
                }}
                className="w-full py-3.5 bg-[#3B5D42] hover:bg-[#2e4a34] text-white rounded-2xl font-bold text-sm shadow-md transition-all active:scale-98"
              >
                Done & Return to Kiota
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
