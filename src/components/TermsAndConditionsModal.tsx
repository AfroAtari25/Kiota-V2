import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  Scale,
  Lock,
  AlertOctagon,
  HelpCircle,
  Download,
  Search,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsAndConditionsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'summary' | 'full_legal' | 'privacy' | 'escrow'>('summary');
  const [searchTerm, setSearchTerm] = useState('');
  const [hasAgreed, setHasAgreed] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#2B2118]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border border-[#2B2118]/15 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#1B4332] text-white p-5 sm:p-6 flex items-start justify-between shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#E8A33D] text-[#2B2118] flex items-center justify-center shadow-md">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E8A33D]">
                  Legal Framework & Constitutional Compliance
                </span>
                <span className="text-[9px] font-mono bg-white/10 px-2 py-0.5 rounded text-white/80">
                  Ver 3.2 (2026)
                </span>
              </div>
              <h2 className="serif text-xl sm:text-2xl font-bold text-[#FBF3E7] mt-0.5">
                Kiota Platform Terms of Service & Privacy Accord
              </h2>
              <p className="text-xs text-white/75 mt-0.5">
                Compliant with the Constitution of Kenya (2010), Data Protection Act (2019), & Consumer Protection Act (2012)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white px-5 py-2.5 border-b border-[#2B2118]/10 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex space-x-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'summary'
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'text-[#2B2118]/70 hover:bg-[#2B2118]/5'
              }`}
            >
              Plain English Summary
            </button>
            <button
              onClick={() => setActiveTab('full_legal')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'full_legal'
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'text-[#2B2118]/70 hover:bg-[#2B2118]/5'
              }`}
            >
              Full Legal Articles (1 - 9)
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'privacy'
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'text-[#2B2118]/70 hover:bg-[#2B2118]/5'
              }`}
            >
              Data Protection & Anti-Screenshot Policy
            </button>
            <button
              onClick={() => setActiveTab('escrow')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'escrow'
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'text-[#2B2118]/70 hover:bg-[#2B2118]/5'
              }`}
            >
              Escrow Guarantee & Ban Rules
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#2B2118]/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search terms (e.g. refund, ban)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1 bg-[#FBF3E7] border border-[#2B2118]/10 rounded-xl text-xs text-[#2B2118] focus:outline-none focus:ring-1 focus:ring-[#1B4332] w-44"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#2B2118] text-xs leading-relaxed max-h-[60vh]">
          {/* TAB 1: PLAIN ENGLISH SUMMARY */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="bg-[#1B4332]/5 border border-[#1B4332]/20 rounded-2xl p-4 space-y-2">
                <h3 className="serif font-bold text-sm text-[#1B4332] flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#1B4332]" />
                  <span>The Kiota Compact: Real Houses, Zero Street Broker Extortion</span>
                </h3>
                <p className="text-xs text-[#2B2118]/80 leading-relaxed">
                  Kiota is built to eradicate exploitative middleman viewing fees in Kenya while giving verified property owners a direct, dignified platform to connect with tenants.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5">
                <div className="bg-white rounded-2xl p-4 border border-[#2B2118]/10 card-shadow space-y-2">
                  <div className="font-bold text-[#1B4332] text-xs flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#1B4332]" />
                    <span>For House & Space Seekers</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-[#2B2118]/75 list-disc pl-4">
                    <li><b>KES 300 Fixed Unlock Fee:</b> The only fee you pay to access direct landlord contacts and exact building GPS pin.</li>
                    <li><b>24-Hour Money-Back Escrow:</b> If you visit the unit and find it taken, fake, or misstated, flag it within 24h for a 100% refund to your M-Pesa.</li>
                    <li><b>Zero Viewing Fees:</b> Landlords and hosts are strictly prohibited from demanding "pesa ya kuona nyumba".</li>
                    <li><b>Anti-Screenshot Protection:</b> Contact data is legally protected under Kenya Data Protection Act 2019. Commercial syndication is unlawful.</li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-[#2B2118]/10 card-shadow space-y-2">
                  <div className="font-bold text-[#C1440E] text-xs flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C1440E]" />
                    <span>For Hosts & Property Sharers</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-[#2B2118]/75 list-disc pl-4">
                    <li><b>Fair Payout Tiers:</b> Earn 20% to 75% per unlock depending on your verified track (Community vs. Partner) and listing count.</li>
                    <li><b>Direct M-Pesa Disbursal:</b> Payouts are released safely after the 24-hour seeker protection quarantine.</li>
                    <li><b>Mandatory Verification:</b> You must pass in-app camera watermark video capture matching GPS coordinates.</li>
                    <li><b>Zero Tolerance for Fakes:</b> Posting occupied units, stock photos, or demanding off-platform bribes results in instant permanent blacklisting.</li>
                  </ul>
                </div>
              </div>

              <div className="bg-[#E8A33D]/10 border border-[#E8A33D]/30 rounded-2xl p-4 space-y-1 text-xs">
                <div className="font-bold text-[#2B2118] flex items-center space-x-1.5">
                  <Scale className="w-4 h-4 text-[#C1440E]" />
                  <span>Constitutional Protections in Action</span>
                </div>
                <p className="text-[11px] text-[#2B2118]/80 leading-relaxed">
                  Our practices are directly anchored in <b>Article 46 (Consumer Protection)</b> and <b>Article 31 (Right to Privacy)</b> of the <b>Constitution of Kenya 2010</b>. Every user has the right to accurate information, safe commerce, and confidentiality of personal phone numbers.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: FULL LEGAL ARTICLES */}
          {activeTab === 'full_legal' && (
            <div className="space-y-5 font-sans">
              <div>
                <h4 className="serif font-bold text-sm text-[#1B4332]">Article 1: Preamble & Constitutional Foundation</h4>
                <p className="mt-1 text-[11px] text-[#2B2118]/80">
                  These Terms of Service constitute a legally binding agreement between you (the "User", whether acting as a Property Seeker, Sharer/Host, or Institutional Partner) and Kiota Technologies Limited, registered under the Companies Act of the Republic of Kenya. The operation of this platform is subject to the Constitution of Kenya (2010), specifically Article 31 (Right to Privacy), Article 40 (Protection of Right to Property), and Article 46 (Consumer Rights).
                </p>
              </div>

              <div>
                <h4 className="serif font-bold text-sm text-[#1B4332]">Article 2: Prohibited Conduct & Ban Policies</h4>
                <div className="mt-1 text-[11px] text-[#2B2118]/80 space-y-1.5">
                  <p>Kiota operates under a strict, non-negotiable code of conduct. The following actions constitute severe platform violations and trigger immediate permanent expulsion, forfeit of pending escrow balances, and reporting to law enforcement where criminal deception is established:</p>
                  <ul className="list-disc pl-4 space-y-1 text-[#2B2118]/75">
                    <li><b>Demand of Viewing Fees:</b> Solicitating, demanding, or conditioning physical viewing upon payment of "pesa ya kuona", registration fees, or brokerage charges outside Kiota's singular KES 300 platform unlock fee.</li>
                    <li><b>Phony or Stock Listings:</b> Submitting photography, videos, or pricing for properties that do not exist, are not currently vacant, or for which the Sharer does not have direct custodial mandate under the Land Registration Act (2012).</li>
                    <li><b>GPS Spoofing & Watermark Tampering:</b> Attempting to bypass in-app camera timestamping, location geofencing, or using screen capture emulators.</li>
                    <li><b>Screen Capture & Data Harvesting:</b> Scraping, screenshotting, syndicating, or compiling landlord contact information or precision address landmarks for third-party brokerage lists.</li>
                    <li><b>Harassment or Discrimination:</b> Discriminating against prospective tenants on the basis of ethnicity, religion, gender, or marital status in violation of Article 27 of the Constitution of Kenya.</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="serif font-bold text-sm text-[#1B4332]">Article 3: Pricing, Unlocking, and Revenue Split</h4>
                <p className="mt-1 text-[11px] text-[#2B2118]/80">
                  The standard consumer unlock fee is KES 300 per listing. In accordance with the Kenya Consumer Protection Act (2012), this fee represents payment for authentic verified property contacts and exact coordinates. The Platform deducts a commission according to the Sharer's Trust Tier (Bronze, Silver, Gold, Platinum) and Track (Community vs. Partner). All payouts to hosts are processed via Safaricom M-Pesa B2C following the mandatory 24-hour escrow quarantine.
                </p>
              </div>

              <div>
                <h4 className="serif font-bold text-sm text-[#1B4332]">Article 4: Governing Law & Conciliation</h4>
                <p className="mt-1 text-[11px] text-[#2B2118]/80">
                  These Terms shall be interpreted in accordance with the Laws of the Republic of Kenya. Any dispute arising under these Terms shall first be referred to Kiota Conciliation Desk. If unresolved within 14 days, the dispute shall be submitted to the exclusive jurisdiction of the competent courts of Nairobi, Kenya.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: DATA PROTECTION & ANTI-SCREENSHOT */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="bg-[#1B4332]/5 border border-[#1B4332]/20 rounded-2xl p-4 space-y-2">
                <div className="font-bold text-xs text-[#1B4332] flex items-center space-x-1.5">
                  <Lock className="w-4 h-4 text-[#1B4332]" />
                  <span>Kenya Data Protection Act (2019) Compliance Notice</span>
                </div>
                <p className="text-[11px] text-[#2B2118]/80 leading-relaxed">
                  Kiota is registered as a Data Controller and Data Processor under the Office of the Data Protection Commissioner (ODPC) of Kenya (Registration Certificate ODPC/PR/2026/0891). We process all National IDs, phone numbers, and location telemetry in strict adherence to data protection principles.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="serif font-bold text-sm text-[#1B4332]">Anti-Screenshot & Contact Confidentiality Shield</h4>
                <p className="text-[11px] text-[#2B2118]/80">
                  To safeguard landlord and caretaker privacy and prevent street broker syndication:
                </p>
                <div className="bg-white p-4 rounded-2xl border border-[#2B2118]/10 space-y-2 text-[11px]">
                  <p>
                    <b>1. Forensic Watermarking:</b> All revealed landlord contact numbers and landmark directions are rendered with an indelible forensic watermark carrying the viewer's registered phone number and timestamp.
                  </p>
                  <p>
                    <b>2. Prohibition of Screen Capture (Section 72 of KDPA 2019):</b> Capturing, recording, or redistributing contact data obtained through an unlock without express written consent is an offence under Section 72 of the Kenya Data Protection Act, carrying legal liability and immediate platform revocation.
                  </p>
                  <p>
                    <b>3. Ephemeral Viewing:</b> Contact data is masked by default and only revealed upon deliberate tap for a 25-second inspection window, ensuring unauthorized parties cannot passively view or photograph private information.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="serif font-bold text-sm text-[#1B4332]">Data Subject Rights (Article 26, KDPA)</h4>
                <p className="mt-1 text-[11px] text-[#2B2118]/80">
                  You maintain the right to access, rectify, or request deletion of your personal data at any time by contacting our Data Protection Officer at <b>privacy@kiota.co.ke</b> or via the in-app Support Chat.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: ESCROW & DISPUTES */}
          {activeTab === 'escrow' && (
            <div className="space-y-4">
              <div className="bg-[#0BA4DB]/10 border border-[#0BA4DB]/30 rounded-2xl p-4 space-y-2">
                <div className="font-bold text-xs text-[#0BA4DB] flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0BA4DB]" />
                  <span>24-Hour 100% Escrow Buyer Protection Policy</span>
                </div>
                <p className="text-[11px] text-[#2B2118]/80 leading-relaxed">
                  Every KES 300 unlock payment is quarantined in our escrow holding account for 24 hours before any host payout is eligible for disbursement.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="serif font-bold text-sm text-[#1B4332]">Valid Grounds for a 100% Refund</h4>
                <div className="grid sm:grid-cols-2 gap-3 text-[11px]">
                  <div className="bg-white p-3.5 rounded-2xl border border-[#2B2118]/10 space-y-1">
                    <span className="font-bold text-[#1B4332]">✅ Unit Already Occupied</span>
                    <p className="text-[#2B2118]/70">If you arrive on site and the premises were already leased prior to your unlock, your KES 300 is refunded immediately.</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-[#2B2118]/10 space-y-1">
                    <span className="font-bold text-[#1B4332]">✅ Host Unreachable for 12+ Hours</span>
                    <p className="text-[#2B2118]/70">If the provided landlord/caretaker phone number is switched off or fails to answer calls within the 24-hour escrow window.</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-[#2B2118]/10 space-y-1">
                    <span className="font-bold text-[#1B4332]">✅ Material Misrepresentation</span>
                    <p className="text-[#2B2118]/70">If the property differs substantially from the listed video (e.g. price misstated, bedsitter marketed as 1-bedroom).</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-[#2B2118]/10 space-y-1">
                    <span className="font-bold text-[#1B4332]">✅ Demand for Broker Viewing Fees</span>
                    <p className="text-[#2B2118]/70">If anyone on site demands an illegal viewing fee ("pesa ya kuona"), report immediately for an instant refund and host ban.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#2B2118]/10 text-[11px] space-y-1.5">
                <span className="font-bold text-[#2B2118]">How to Claim Your Escrow Refund:</span>
                <ol className="list-decimal pl-4 space-y-1 text-[#2B2118]/75">
                  <li>Navigate to your <b>Seeker Dashboard</b>.</li>
                  <li>Click <b>"Report Inaccurate / Claim 100% Escrow Refund"</b> on the unlocked listing.</li>
                  <li>Submit your quick dispute explanation to Kiota Concierge Chat.</li>
                  <li>Upon automated audit of GPS logs and phone call history, KES 300 is reversed directly to your M-Pesa line.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-white p-4 sm:p-5 border-t border-[#2B2118]/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2 text-xs text-[#2B2118]/70">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Active Kenyan Constitution & ODPC Compliance Stamp</span>
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            <button
              onClick={() => {
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                  printWindow.document.write(`
                    <html>
                      <head><title>Kiota Terms of Service (Kenya)</title></head>
                      <body style="font-family: sans-serif; padding: 30px; line-height: 1.6;">
                        <h1>Kiota Kenya Platform Terms of Service & Privacy Accord</h1>
                        <p>Compliant with Constitution of Kenya (2010) & Kenya Data Protection Act (2019)</p>
                        <hr/>
                        <h3>Article 1: Preamble</h3>
                        <p>Kiota connects verified property owners directly with seekers under strict anti-extortion consumer protection rules.</p>
                        <h3>Article 2: Zero Viewing Fees</h3>
                        <p>The KES 300 unlock fee is the sole platform charge. Demanding viewing fees is strictly prohibited.</p>
                        <h3>Article 3: 24-Hour Money-Back Escrow</h3>
                        <p>Seekers are protected by a 24-hour quarantine guarantee.</p>
                      </body>
                    </html>
                  `);
                  printWindow.document.close();
                  printWindow.print();
                }
              }}
              className="px-4 py-2.5 bg-[#FBF3E7] hover:bg-[#ebd5bb] text-[#2B2118] font-bold text-xs rounded-xl border border-[#2B2118]/15 transition-colors flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print / Save Accord</span>
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#1B4332] hover:bg-[#143326] text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              Close & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
