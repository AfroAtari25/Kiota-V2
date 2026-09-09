import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wallet,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Phone,
  Smartphone,
  Shield,
  HelpCircle,
  RefreshCcw,
  Building2,
  DollarSign,
  Send,
} from 'lucide-react';

export const WalletScreen: React.FC = () => {
  const { currentUser, payouts, requestMpesaWithdrawal, getPosterStats, setActiveTab } = useApp();

  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawalSuccessCode, setWithdrawalSuccessCode] = useState<string | null>(null);

  const stats = getPosterStats(currentUser.id);
  const posterPayouts = payouts.filter((p) => p.poster_id === currentUser.id);
  const isAdmin = currentUser.role === 'admin';

  const handleWithdrawal = async () => {
    if (stats.pendingPayouts <= 0) {
      alert('No pending payout balance available to withdraw.');
      return;
    }

    setIsWithdrawing(true);
    setTimeout(async () => {
      const res = await requestMpesaWithdrawal(currentUser.id);
      setIsWithdrawing(false);
      if (res.success) {
        setWithdrawalSuccessCode(res.code);
      }
    }, 900);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 animate-in fade-in duration-200">
      {/* Admin Notice Banner if user is Admin */}
      {isAdmin && (
        <div className="bg-[#2B2620] text-[#FCFBF8] rounded-3xl p-5 border border-[#C1533A]/30 card-shadow flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C1533A] flex items-center justify-center font-bold text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="serif font-extrabold text-sm text-[#FCFBF8]">Admin Escrow & Disbursals</h4>
              <p className="text-xs text-[#8A8072]">
                As Super Admin, you manage the master escrow ledger and approve B2C payouts across Kenya.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('admin')}
            className="px-3.5 py-2 bg-[#C1533A] hover:bg-[#ab452e] text-white text-xs font-extrabold rounded-2xl shadow-xs transition-transform active:scale-95 shrink-0"
          >
            Open Admin Hub
          </button>
        </div>
      )}

      {/* Wallet Header Banner */}
      <div className="bg-[#2B2620] text-[#FCFBF8] rounded-3xl p-6 relative overflow-hidden shadow-lg border border-[#2B2620]/30 card-shadow">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-44 h-44 rounded-full bg-[#C1533A]/10 pointer-events-none" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#C1533A] text-white flex items-center justify-center font-extrabold shadow-sm ring-2 ring-[#C1533A]/40">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h2 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C1533A]">
                  {stats.tierInfo.tier} Sharer M-Pesa Wallet
                </h2>
                <span className={`px-2 py-0.2 rounded-full text-[9px] font-extrabold ${
                  currentUser.track === 'partner'
                    ? 'bg-blue-900/60 text-blue-200 border border-blue-400/40'
                    : 'bg-emerald-900/60 text-emerald-200 border border-emerald-400/40'
                }`}>
                  {currentUser.track === 'partner' ? '🏢 Partner Track' : '👥 Community Track'}
                </span>
              </div>
              <span className="text-xs text-[#FCFBF8]/90 font-medium">
                {currentUser.name} {currentUser.agency_name ? `(${currentUser.agency_name})` : ''} • {currentUser.phone}
              </span>
            </div>
          </div>

          <span className="bg-[#3B5D42]/30 text-emerald-300 border border-emerald-400/30 px-3 py-0.8 rounded-full text-[9px] font-extrabold uppercase tracking-wider">
            {stats.tierInfo.earnShare}% Payout Share
          </span>
        </div>

        {/* Main Available Balance */}
        <div className="space-y-1 my-2">
          <span className="text-[10px] uppercase tracking-[0.18em] text-[#8A8072] font-bold">Total Net Earnings</span>
          <div className="serif text-3xl sm:text-4xl font-extrabold text-[#FCFBF8] tracking-tight">
            KSh {stats.totalEarned.toLocaleString()}
          </div>
          {currentUser.track === 'community' ? (
            <p className="text-[11px] text-[#FCFBF8]/80 pt-0.5">
              {stats.tierInfo.tier === 'Gold' ? (
                <span className="text-amber-300 font-bold">★ Caretaker Milestone Achieved: Top Gold 50% Earn Share!</span>
              ) : (
                <span>Caretaker Milestone: Share 8 genuine listings to reach top Gold Tier (50% share).</span>
              )}
            </p>
          ) : (
            <p className="text-[11px] text-blue-200/90 pt-0.5 font-medium">
              Registered Agency Tier • Full ladder eligible up to Platinum (75% earn share).
            </p>
          )}
        </div>

        {/* Quick Withdrawal CTA */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="text-xs text-[#8A8072] font-medium">
            <span>Instant Safaricom M-Pesa B2C Disbursal</span>
          </div>

          <button
            id="btn-request-payout"
            onClick={handleWithdrawal}
            disabled={isWithdrawing || stats.pendingPayouts === 0}
            className={`py-2.5 px-4 rounded-2xl text-xs font-extrabold flex items-center space-x-1.5 transition-all shadow-md active:scale-95 ${
              stats.pendingPayouts > 0
                ? 'bg-[#C1533A] text-white hover:bg-[#ab452e]'
                : 'bg-white/20 text-white/50 cursor-not-allowed'
            }`}
          >
            {isWithdrawing ? (
              <span>Releasing to M-Pesa...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Withdraw KSh {stats.pendingPayouts.toLocaleString()}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Withdrawal Success Feedback */}
      {withdrawalSuccessCode && (
        <div className="bg-[#3B5D42]/10 border-2 border-[#3B5D42] rounded-3xl p-4 flex items-center justify-between animate-in zoom-in-95 duration-150 card-shadow">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-6 h-6 text-[#3B5D42]" />
            <div>
              <span className="serif font-bold text-sm text-[#3B5D42]">M-Pesa B2C Payment Dispatched!</span>
              <p className="text-[11px] text-[#2B2620]/80 font-mono">
                Receipt: {withdrawalSuccessCode} sent to {currentUser.phone}
              </p>
            </div>
          </div>
          <button
            onClick={() => setWithdrawalSuccessCode(null)}
            className="text-xs font-bold text-[#3B5D42] hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Host Properties Quick Access Link */}
      {currentUser.role === 'poster' && (
        <div className="bg-[#1B4332]/10 border border-[#1B4332]/25 rounded-3xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 card-shadow">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center font-bold shrink-0">
              <Building2 className="w-5 h-5 text-[#E8A33D]" />
            </div>
            <div>
              <h4 className="serif font-bold text-sm text-[#1B4332]">
                View Listed Properties & Approvals
              </h4>
              <p className="text-xs text-[#2B2620]/75">
                Filter by approval status, track individual listing earnings, or contact Support.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('host_properties')}
            className="px-4 py-2 bg-[#1B4332] hover:bg-[#143326] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 shrink-0 text-center"
          >
            Manage My Properties
          </button>
        </div>
      )}

      {/* 3 Metric Breakdown Cards */}
      <div className="grid grid-cols-3 gap-3">
        {/* Total Earned */}
        <div className="bg-white rounded-3xl p-4 border border-[#2B2620]/10 card-shadow flex flex-col justify-between">
          <span className="text-[9px] uppercase tracking-widest font-extrabold text-[#8A8072]">All-Time</span>
          <div className="serif text-lg sm:text-xl font-extrabold text-[#3B5D42] mt-1">
            KSh {stats.totalEarned.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#8A8072] mt-1 font-medium">{stats.unlocksCount} unlocks</span>
        </div>

        {/* Pending Payouts */}
        <div className="bg-white rounded-3xl p-4 border border-[#2B2620]/10 card-shadow flex flex-col justify-between">
          <span className="text-[9px] uppercase tracking-widest font-extrabold text-[#8A8072]">Escrow</span>
          <div className="serif text-lg sm:text-xl font-extrabold text-[#D48B38] mt-1">
            KSh {stats.pendingPayouts.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#8A8072] mt-1 font-medium">Releases in 24h</span>
        </div>

        {/* Released Payouts */}
        <div className="bg-white rounded-3xl p-4 border border-[#2B2620]/10 card-shadow flex flex-col justify-between">
          <span className="text-[9px] uppercase tracking-widest font-extrabold text-[#8A8072]">Disbursed</span>
          <div className="serif text-lg sm:text-xl font-extrabold text-[#C1533A] mt-1">
            KSh {stats.releasedPayouts.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#8A8072] mt-1 font-medium">M-Pesa Sent</span>
        </div>
      </div>

      {/* Payouts History Table */}
      <div className="bg-white rounded-3xl p-5 border border-[#2B2620]/10 card-shadow space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="serif text-base font-bold text-[#2B2620]">
              Payouts Ledger
            </h3>
            <p className="text-xs text-[#8A8072]">
              Live records of all unlock revenue splits and M-Pesa disbursements
            </p>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C1533A] bg-[#FCFBF8] px-2.5 py-1 rounded-full border border-[#2B2620]/10">
            {posterPayouts.length} Records
          </span>
        </div>

        {posterPayouts.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#8A8072] bg-[#FCFBF8] rounded-2xl border border-[#2B2620]/10">
            No unlock payouts logged yet for this sharer account.
          </div>
        ) : (
          <div className="divide-y divide-[#2B2620]/8">
            {posterPayouts.map((payout) => {
              const isPending = payout.status === 'pending';

              return (
                <div
                  key={payout.id}
                  className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isPending ? 'bg-[#D48B38]/20 text-[#D48B38]' : 'bg-[#3B5D42]/10 text-[#3B5D42]'
                    }`}>
                      {isPending ? <Clock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[#2B2620]">
                        {payout.listing_title || 'Listing Unlock Share'}
                      </div>
                      <div className="text-[11px] text-[#8A8072] flex items-center space-x-2 mt-0.5">
                        <span>{payout.release_time}</span>
                        <span>•</span>
                        <span className="font-mono text-[10px] text-[#2B2620]">
                          {payout.mpesa_receipt || payout.unlock_id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-extrabold text-[#3B5D42]">
                      +KSh {payout.amount.toLocaleString()}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block mt-0.5 ${
                      isPending
                        ? 'bg-[#D48B38]/20 text-[#D48B38]'
                        : 'bg-[#3B5D42]/10 text-[#3B5D42]'
                    }`}>
                      {payout.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Escrow & Verification Explainer */}
      <div className="bg-[#FCFBF8] rounded-3xl p-5 border border-[#2B2620]/15 text-xs text-[#2B2620] space-y-3">
        <div className="font-extrabold text-xs text-[#2B2620] flex items-center space-x-1.5">
          <Shield className="w-4 h-4 text-[#C1533A]" />
          <span>How Kiota Two-Track Payouts & Safeguards Work</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-[#8A8072]">
          <div className="p-3 bg-white rounded-2xl border border-[#2B2620]/10 space-y-1">
            <span className="font-extrabold text-emerald-800 block">👥 Community Track (Individuals & Caretakers)</span>
            <p>
              Everyday citizens, tenants, and caretakers. Bronze (0–2 listings, 30%), Silver (3–7 listings, 40%), Gold (8+ listings, 50% max). Caretakers sharing 8 genuine listings reach Gold at 50% — a meaningful, attainable milestone.
            </p>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-[#2B2620]/10 space-y-1">
            <span className="font-extrabold text-blue-800 block">🏢 Partner Track (Agencies & Managers)</span>
            <p>
              Registered property agencies and caretakers managing multiple units. Bronze (0–14, 30%), Silver (15–29, 45%), Gold (30–39, 60%), Platinum (40+ listings, 75% max) with agency verification.
            </p>
          </div>
        </div>

        <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/80 text-[11px] text-[#2B2620] space-y-1">
          <span className="font-extrabold text-amber-900 block">🛡️ Volume Concentration Safeguards:</span>
          <p className="text-[#8A8072]">
            • <strong>Monthly Volume Step-Down:</strong> A host's first 20 unlocks in a calendar month pay out at full tier rate. Subsequent unlocks step down by -10% to prevent volume runaways.<br />
            • <strong>Automated Review Trigger:</strong> If any single tier exceeds 15% of monthly volume or any host exceeds 5% of platform revenue, a payout percentage review is triggered within 2 weeks.<br />
            • <strong>24h Escrow Lock:</strong> Funds are held in escrow for 24 hours to guarantee GPS accuracy and seeker satisfaction before M-Pesa B2C release.
          </p>
        </div>
      </div>
    </div>
  );
};
