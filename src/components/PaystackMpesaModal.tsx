import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Listing } from '../types';
import {
  Smartphone,
  ShieldCheck,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Key,
  CreditCard,
  Lock,
  ArrowRight,
} from 'lucide-react';

interface PaystackMpesaModalProps {
  listing: Listing;
  onClose: () => void;
  onSuccess: (paymentRef: string) => void;
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        currency: string;
        channels?: string[];
        ref?: string;
        metadata?: Record<string, unknown>;
        callback?: (response: { reference: string; status: string }) => void;
        onClose?: () => void;
      }) => {
        openIframe: () => void;
      };
    };
  }
}

export const PaystackMpesaModal: React.FC<PaystackMpesaModalProps> = ({
  listing,
  onClose,
  onSuccess,
}) => {
  const { currentUser, unlockListing } = useApp();

  const [phone, setPhone] = useState(currentUser.phone || '0741367051');
  const [email, setEmail] = useState(currentUser.email || 'IsaMohamed92@gmail.com');
  const [paystackKey, setPaystackKey] = useState(
    (import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string) || 'pk_test_sample_kiota_sandbox_key'
  );
  const [useRealSdk, setUseRealSdk] = useState(false);

  // Flow states
  const [paymentStep, setPaymentStep] = useState<'details' | 'stk_prompt' | 'processing' | 'success' | 'failed'>('details');
  const [pinInput, setPinInput] = useState('');
  const [countdown, setCountdown] = useState(25);
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedRef, setGeneratedRef] = useState('');
  const [showTechnicalNotes, setShowTechnicalNotes] = useState(false);

  // Paystack subunit conversion: Paystack KES amounts are in cents (amount * 100)
  const amountInKes = listing.unlock_price;
  const amountInSubunits = amountInKes * 100;

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 9) {
      setErrorMessage('Please provide a valid Kenyan mobile phone number.');
      return;
    }
    if (!email || !email.includes('@')) {
      setErrorMessage('Paystack requires a valid customer email address.');
      return;
    }
    setErrorMessage('');

    // If user enabled real SDK and has a real key
    if (useRealSdk && paystackKey && paystackKey.startsWith('pk_')) {
      launchRealPaystackInline();
      return;
    }

    // Launch Sandbox STK Push Simulation
    setPaymentStep('stk_prompt');
    setCountdown(25);
  };

  const launchRealPaystackInline = () => {
    // Check or inject Paystack inline script dynamically
    const existingScript = document.getElementById('paystack-inline-js');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'paystack-inline-js';
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => triggerPaystackPopup();
      script.onerror = () => {
        setErrorMessage('Unable to connect to Paystack Inline servers. Falling back to Sandbox STK simulator.');
        setPaymentStep('stk_prompt');
      };
      document.body.appendChild(script);
    } else {
      triggerPaystackPopup();
    }
  };

  const triggerPaystackPopup = () => {
    if (!window.PaystackPop) {
      setPaymentStep('stk_prompt');
      return;
    }

    try {
      const customRef = `PSTK_MPESA_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const handler = window.PaystackPop.setup({
        key: paystackKey,
        email: email,
        amount: amountInSubunits, // in subunits (cents)
        currency: 'KES',
        channels: ['mobile_money', 'card'],
        ref: customRef,
        metadata: {
          custom_fields: [
            { display_name: 'Listing Title', variable_name: 'listing_title', value: listing.title },
            { display_name: 'Seeker Phone', variable_name: 'seeker_phone', value: phone },
            { display_name: 'Platform', variable_name: 'platform', value: 'Kiota Nest Kenya' },
          ],
        },
        callback: async (response) => {
          const verifiedRef = response.reference || customRef;
          setGeneratedRef(verifiedRef);
          await unlockListing(listing.id, {
            paystackRef: verifiedRef,
            seekerPhone: phone,
            channel: 'paystack_mpesa',
          });
          setPaymentStep('success');
          onSuccess(verifiedRef);
        },
        onClose: () => {
          setErrorMessage('Paystack checkout window closed by user.');
        },
      });
      handler.openIframe();
    } catch {
      setErrorMessage('Could not open Paystack popup with provided key. Using Sandbox STK simulator.');
      setPaymentStep('stk_prompt');
    }
  };

  const handleSimulatePinSubmit = async () => {
    setPaymentStep('processing');
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomDigits = Math.floor(100 + Math.random() * 900);
    const mpesaReceipt = `PSTK-MPESA-QK${randomChars}${randomDigits}`;

    setTimeout(async () => {
      setGeneratedRef(mpesaReceipt);
      await unlockListing(listing.id, {
        paystackRef: mpesaReceipt,
        seekerPhone: phone,
        channel: 'paystack_mpesa',
      });
      setPaymentStep('success');
      onSuccess(mpesaReceipt);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-[#FCFBF8] w-full max-w-md rounded-3xl border border-[#2B2620]/20 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header with Paystack & M-Pesa branding */}
        <div className="bg-[#0BA4DB] text-white p-5 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-white/90 text-xs font-extrabold uppercase tracking-wider mb-1">
            <span className="bg-white/20 px-2 py-0.5 rounded-md">Paystack Sandbox</span>
            <span>•</span>
            <span className="text-emerald-200">M-Pesa STK Gateway</span>
          </div>

          <h2 className="text-lg font-extrabold text-white flex items-center space-x-2">
            <span>Paystack M-Pesa Checkout</span>
          </h2>
          <p className="text-xs text-white/80 mt-0.5">
            Test Paystack M-Pesa KES collection for Kiota space unlocks.
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Details & Setup Form */}
          {paymentStep === 'details' && (
            <form onSubmit={handleInitiatePayment} className="space-y-4">
              {/* Transaction Summary Card */}
              <div className="bg-white p-4 rounded-2xl border border-[#2B2620]/10 shadow-xs space-y-2.5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-[#8A8072] uppercase tracking-wider block">
                      Target Listing
                    </span>
                    <h3 className="font-bold text-xs text-[#2B2620] line-clamp-1">{listing.title}</h3>
                    <span className="text-[10px] text-[#8A8072]">📍 {listing.area}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-[#8A8072] uppercase tracking-wider block">
                      Unlock Amount
                    </span>
                    <span className="serif text-base font-extrabold text-[#C1533A]">
                      KES {amountInKes}
                    </span>
                  </div>
                </div>

                {/* Subunit formula notice */}
                <div className="pt-2 border-t border-[#2B2620]/10 flex items-center justify-between text-[11px] bg-[#FCFBF8] p-2 rounded-xl text-[#3B5D42] font-semibold">
                  <span>Paystack Subunits (x100):</span>
                  <span className="font-mono font-extrabold">{amountInSubunits.toLocaleString()} cents</span>
                </div>
              </div>

              {/* M-Pesa Phone Input */}
              <div>
                <label className="block text-xs font-bold text-[#2B2620] mb-1">
                  M-Pesa Phone Number <span className="text-[#C1533A]">*</span>
                </label>
                <div className="flex rounded-2xl border border-[#2B2620]/20 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#0BA4DB]/30">
                  <div className="px-3 py-2.5 bg-[#FCFBF8] border-r border-[#2B2620]/10 text-xs font-bold text-[#3B5D42]">
                    🇰🇪 +254
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="741 367 051"
                    className="w-full px-3 py-2.5 text-xs font-bold text-[#2B2620] focus:outline-hidden"
                  />
                </div>
                <span className="text-[10px] text-[#8A8072] mt-1 block">
                  Safaricom M-Pesa number that will receive the STK push prompt.
                </span>
              </div>

              {/* Customer Email (Required by Paystack) */}
              <div>
                <label className="block text-xs font-bold text-[#2B2620] mb-1">
                  Customer Email (Paystack Requirement) <span className="text-[#C1533A]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="IsaMohamed92@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-[#2B2620]/20 bg-white text-xs font-medium text-[#2B2620] focus:outline-hidden focus:ring-2 focus:ring-[#0BA4DB]/30"
                />
                <span className="text-[10px] text-[#8A8072] mt-1 block">
                  Paystack requires an email for transaction audit logs & receipts.
                </span>
              </div>

              {/* Paystack Public Key Configuration */}
              <div className="bg-[#FCFBF8] p-3 rounded-2xl border border-[#2B2620]/10 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2B2620] flex items-center space-x-1">
                    <Key className="w-3.5 h-3.5 text-[#0BA4DB]" />
                    <span>Paystack Test Key (pk_test_...)</span>
                  </span>
                  <span className="text-[9px] font-extrabold uppercase bg-sky-100 text-sky-800 px-2 py-0.5 rounded-md">
                    Sandbox
                  </span>
                </div>
                <input
                  type="text"
                  value={paystackKey}
                  onChange={(e) => setPaystackKey(e.target.value)}
                  placeholder="pk_test_..."
                  className="w-full px-3 py-1.5 text-[11px] font-mono rounded-xl border border-[#2B2620]/15 bg-white text-[#2B2620] focus:outline-hidden"
                />

                <label className="flex items-center space-x-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={useRealSdk}
                    onChange={(e) => setUseRealSdk(e.target.checked)}
                    className="rounded border-[#2B2620]/20 text-[#0BA4DB] focus:ring-[#0BA4DB]"
                  />
                  <span className="text-[11px] font-semibold text-[#8A8072]">
                    Launch real Paystack Inline Popup (if valid public key is set)
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#0BA4DB] hover:bg-[#098ec0] text-white font-extrabold text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center space-x-2 active:scale-98"
              >
                <Smartphone className="w-4 h-4" />
                <span>Trigger Paystack M-Pesa STK Push (KES {amountInKes})</span>
              </button>

              {/* Escrow Guarantee */}
              <div className="flex items-center justify-center space-x-1.5 text-[10px] text-[#8A8072] text-center font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3B5D42]" />
                <span>Funds held in Kiota Escrow for 24 hours until physical visit.</span>
              </div>
            </form>
          )}

          {/* STEP 2: Interactive Sandbox STK Push Prompt on Phone */}
          {paymentStep === 'stk_prompt' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Simulated Phone Screen */}
              <div className="bg-[#1A1A1A] text-white p-5 rounded-3xl border-4 border-[#333] shadow-xl space-y-4 max-w-xs mx-auto">
                <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                  <span>SAFARICOM M-PESA</span>
                  <span>SIM 1</span>
                </div>

                {/* STK Push Dialog box */}
                <div className="bg-[#2D2D2D] p-4 rounded-2xl border border-neutral-700 space-y-3">
                  <div className="text-center space-y-1">
                    <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">
                      Paystack M-Pesa Prompt
                    </div>
                    <div className="text-xs font-extrabold text-white">
                      Do you want to pay KES {amountInKes} to KIOTA NEST via Paystack?
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-neutral-400 font-bold mb-1 text-center">
                      Enter 4-Digit M-Pesa PIN
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      placeholder="••••"
                      className="w-full text-center tracking-[0.5em] text-lg font-mono py-2 rounded-xl bg-black/50 border border-neutral-600 text-white focus:outline-hidden focus:border-emerald-400"
                    />
                  </div>

                  <div className="flex space-x-2 pt-1">
                    <button
                      onClick={() => setPaymentStep('details')}
                      className="flex-1 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-xl text-[10px] font-bold text-neutral-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSimulatePinSubmit}
                      className="flex-1 py-1.5 bg-[#00A651] hover:bg-[#008f45] rounded-xl text-[10px] font-extrabold text-white"
                    >
                      Send PIN
                    </button>
                  </div>
                </div>

                <div className="text-center text-[10px] text-neutral-400 flex items-center justify-center space-x-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>Prompt expires in 25s</span>
                </div>
              </div>

              {/* Fast Test Action */}
              <div className="text-center space-y-2">
                <button
                  onClick={handleSimulatePinSubmit}
                  className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-xs transition-transform active:scale-95 inline-flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>One-Click Sandbox Test (Confirm M-Pesa PIN)</span>
                </button>
                <div className="text-[10px] text-[#8A8072]">
                  Simulates successful Safaricom STK callback with genuine Paystack receipt.
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Processing */}
          {paymentStep === 'processing' && (
            <div className="py-8 text-center space-y-3 animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-full border-4 border-[#0BA4DB] border-t-transparent animate-spin mx-auto" />
              <div className="font-extrabold text-sm text-[#2B2620]">
                Verifying Paystack M-Pesa Transaction...
              </div>
              <p className="text-xs text-[#8A8072] max-w-xs mx-auto">
                Awaiting STK Push confirmation from Safaricom Kenya and creating Kiota Escrow contract.
              </p>
            </div>
          )}

          {/* STEP 4: Success */}
          {paymentStep === 'success' && (
            <div className="py-6 text-center space-y-4 animate-in fade-in duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="serif text-base font-extrabold text-[#2B2620]">
                  M-Pesa Payment Successful!
                </h3>
                <p className="text-xs text-[#3B5D42] font-semibold mt-0.5">
                  Listing unlocked with direct landlord phone & GPS directions.
                </p>
              </div>

              <div className="bg-[#FCFBF8] p-3 rounded-2xl border border-[#2B2620]/10 text-xs space-y-1 text-left">
                <div className="flex justify-between">
                  <span className="text-[#8A8072]">Amount Paid:</span>
                  <span className="font-bold text-[#2B2620]">KES {amountInKes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A8072]">Paystack Reference:</span>
                  <span className="font-mono font-bold text-[#0BA4DB] text-[11px]">{generatedRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A8072]">Status:</span>
                  <span className="font-bold text-emerald-700">Held in 24hr Kiota Escrow</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-[#3B5D42] hover:bg-[#2c4732] text-white font-extrabold text-xs rounded-2xl shadow-xs transition-colors"
              >
                View Landlord Contact & GPS Directions
              </button>
            </div>
          )}

          {/* Collapsible Technical Integration Notes */}
          <div className="pt-2 border-t border-[#2B2620]/10">
            <button
              onClick={() => setShowTechnicalNotes(!showTechnicalNotes)}
              className="w-full flex items-center justify-between text-xs font-bold text-[#8A8072] hover:text-[#2B2620] py-1"
            >
              <span className="flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5 text-[#0BA4DB]" />
                <span>Paystack Kenya Integration Checklist & Rules</span>
              </span>
              {showTechnicalNotes ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showTechnicalNotes && (
              <div className="mt-2 p-3 bg-sky-50/70 border border-sky-200 rounded-2xl text-[11px] text-sky-950 space-y-2">
                <div>
                  <span className="font-extrabold">1. KES Subunit Rule: </span>
                  <span>Paystack charges in subunits (1 KES = 100 cents). KES {amountInKes} must be passed as <code>{amountInSubunits}</code>.</span>
                </div>
                <div>
                  <span className="font-extrabold">2. Mobile Money Channel: </span>
                  <span>Must specify <code>channels: ['mobile_money']</code> to force the M-Pesa STK prompt on Kenyan phone numbers.</span>
                </div>
                <div>
                  <span className="font-extrabold">3. Customer Email: </span>
                  <span>Paystack requires an email parameter even when paying with phone. If blank, synthesize <code>phone@kiotanest.co.ke</code>.</span>
                </div>
                <div>
                  <span className="font-extrabold">4. Escrow Disbursal (B2C): </span>
                  <span>Paystack handles collection (C2B). Host payouts are disbursed after 24 hours using Paystack Transfers API or manual M-Pesa till.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
