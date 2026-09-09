import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  UserCheck,
  Shield,
  Phone,
  Database,
  Users,
  ChevronDown,
  Sparkles,
  Wallet,
  LogOut,
  Crown,
  MessageSquare,
  Building2,
  Key,
  Scale,
} from 'lucide-react';
import { AuthModal } from './AuthModal';
import { DataInspectorModal } from './DataInspectorModal';

export const Header: React.FC = () => {
  const {
    currentUser,
    users,
    switchUser,
    logout,
    getPosterStats,
    activeTab,
    setActiveTab,
    openSupportChat,
    setShowTermsModal,
    tickets,
  } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const stats = getPosterStats(currentUser.id);
  const isAdmin = currentUser.role === 'admin';
  const myOpenTickets = tickets.filter(
    (t) => (t.userId === currentUser.id || isAdmin) && t.status !== 'resolved'
  ).length;

  return (
    <>
      <header id="main-header" className="sticky top-0 z-30 bg-[#FCFBF8]/95 backdrop-blur-md border-b border-[#2B2620]/10 px-4 py-3 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Kiota Official Brand & Logo Mark */}
          <div
            className="flex items-center space-x-3 cursor-pointer select-none"
            onClick={() => setActiveTab('browse')}
          >
            {/* Kiota Nest Eye Mark */}
            <div className="w-10 h-10 rounded-2xl bg-[#FCFBF8] border-2 border-[#C1533A] flex items-center justify-center shadow-xs ring-2 ring-[#C1533A]/20">
              <svg viewBox="0 0 100 100" className="w-6 h-6" fill="none">
                <ellipse cx="50" cy="50" rx="42" ry="32" stroke="#C1533A" strokeWidth="9" />
                <ellipse cx="50" cy="50" rx="26" ry="19" stroke="#3B5D42" strokeWidth="6" />
                <circle cx="50" cy="50" r="9" fill="#C1533A" />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="serif text-2xl font-extrabold tracking-tight text-[#2B2620]">
                  KIOTA
                </span>
                <span className="text-[#8A8072] text-sm font-semibold">·</span>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C1533A]">
                  NEST
                </span>
              </div>
              <p className="text-[10px] font-bold text-[#3B5D42] tracking-wide leading-none mt-0.5">
                Pata Kiota Chako <span className="text-[#8A8072] font-normal">• Kenya</span>
              </p>
            </div>
          </div>

          {/* Quick Info & User Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Direct Admin Hub Button */}
            {isAdmin ? (
              <button
                id="btn-nav-admin-hub"
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 rounded-2xl font-extrabold text-xs transition-all flex items-center space-x-1.5 border shadow-xs ${
                  activeTab === 'admin'
                    ? 'bg-[#2B2620] text-[#FCFBF8] border-[#2B2620]'
                    : 'bg-[#C1533A] text-white hover:bg-[#ab452e] border-[#C1533A]'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Hub</span>
              </button>
            ) : currentUser.role === 'poster' ? (
              /* Quick Balance for Sharer/Poster */
              <div className="hidden md:flex flex-col items-end pr-2 border-r border-[#2B2620]/10">
                <span className="uppercase tracking-[0.18em] text-[9px] font-extrabold text-[#8A8072]">
                  {stats.tierInfo.tier} Wallet ({stats.tierInfo.earnShare}%)
                </span>
                <span className="text-xs font-extrabold text-[#3B5D42] serif">
                  KSh {stats.totalEarned.toLocaleString()}
                </span>
              </div>
            ) : null}

            {/* Support / Concierge Chat Button */}
            <button
              id="btn-open-support-chat"
              onClick={() => openSupportChat('general')}
              title="Live Concierge & Dispute Support"
              className="relative p-2 sm:px-3 rounded-2xl bg-[#FCFBF8] text-[#2B2620] hover:bg-[#1B4332]/10 transition-all flex items-center space-x-1.5 text-xs font-bold border border-[#2B2620]/15 card-shadow"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#1B4332]" />
              <span className="hidden md:inline">Support</span>
              {myOpenTickets > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#C1440E] animate-ping absolute -top-0.5 -right-0.5" />
              )}
            </button>

            {/* Database Tables Inspector Button */}
            <button
              id="btn-open-db-inspector"
              onClick={() => setShowDataModal(true)}
              title="Inspect Platform Tables"
              className="p-2 sm:px-3 rounded-2xl bg-[#FCFBF8] text-[#2B2620] hover:bg-[#C1533A]/10 transition-all flex items-center space-x-1.5 text-xs font-bold border border-[#2B2620]/15 card-shadow"
            >
              <Database className="w-3.5 h-3.5 text-[#C1533A]" />
              <span className="hidden sm:inline">DB Ledger</span>
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                id="btn-user-switcher"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-2 bg-white hover:bg-[#FCFBF8] border border-[#2B2620]/15 rounded-2xl px-2.5 py-1.5 transition-all card-shadow"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={currentUser.name}
                    className={`w-7 h-7 rounded-full object-cover border-2 ${
                      isAdmin ? 'border-[#2B2620]' : 'border-[#C1533A]'
                    }`}
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#3B5D42] border border-white" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-[#2B2620] truncate max-w-[110px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-[#C1533A] font-bold">
                    {isAdmin ? 'Super Admin' : currentUser.role === 'poster' ? 'Sharer / Host' : 'Seeker'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#8A8072]" />
              </button>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-76 bg-white rounded-3xl shadow-xl border border-[#2B2620]/15 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2.5 border-b border-[#2B2620]/10 bg-[#FCFBF8] rounded-2xl mb-1">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-[#2B2620] serif">{currentUser.name}</div>
                      {isAdmin && (
                        <span className="bg-[#2B2620] text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#3B5D42] flex items-center space-x-1 mt-0.5 font-mono">
                      <Phone className="w-3 h-3 text-[#3B5D42]" />
                      <span>{currentUser.phone}</span>
                    </div>
                    {currentUser.email && (
                      <div className="text-[10px] text-[#8A8072] mt-0.5">
                        {currentUser.email}
                      </div>
                    )}
                  </div>

                  <div className="py-1">
                    <div className="px-3 py-1 text-[10px] font-bold text-[#8A8072] uppercase tracking-widest">
                      Switch Role & Persona
                    </div>
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setShowUserDropdown(false);
                          if (u.role === 'admin') {
                            setActiveTab('admin');
                          }
                        }}
                        className={`w-full text-left px-3 py-2 rounded-2xl flex items-center justify-between text-xs transition-colors my-0.5 ${
                          u.id === currentUser.id
                            ? 'bg-[#FCFBF8] text-[#C1533A] font-bold border border-[#C1533A]/30'
                            : 'hover:bg-neutral-50 text-[#2B2620]'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <img
                            src={u.avatar_url}
                            alt={u.name}
                            className={`w-7 h-7 rounded-full object-cover border ${
                              u.role === 'admin' ? 'border-[#2B2620]' : 'border-[#C1533A]'
                            }`}
                          />
                          <div>
                            <div className="font-semibold flex items-center space-x-1">
                              <span>{u.name}</span>
                              {u.role === 'admin' && (
                                <span className="bg-[#2B2620] text-white text-[8px] px-1.5 py-0.2 rounded font-bold">
                                  Founder
                                </span>
                              )}
                            </div>
                            <div className="text-[9px] uppercase tracking-wider text-[#8A8072]">
                              {u.role === 'admin' ? 'Super Admin' : u.role === 'poster' ? 'Sharer / Host' : 'Seeker'} • {u.trust_score}% Trust
                            </div>
                          </div>
                        </div>
                        {u.id === currentUser.id && (
                          <span className="w-2 h-2 rounded-full bg-[#3B5D42]" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#2B2620]/10 space-y-1.5">
                    {/* Role-Specific Portal Links */}
                    {currentUser.role === 'poster' ? (
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          setActiveTab('host_properties');
                        }}
                        className="w-full text-left px-3 py-2 bg-[#1B4332]/10 hover:bg-[#1B4332]/20 text-[#1B4332] rounded-2xl text-xs font-bold transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-3.5 h-3.5 text-[#1B4332]" />
                          <span>My Listed Properties</span>
                        </div>
                        <span className="text-[10px] bg-[#1B4332] text-white px-2 py-0.5 rounded-full font-mono">
                          Manage
                        </span>
                      </button>
                    ) : currentUser.role === 'seeker' ? (
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          setActiveTab('unlocks');
                        }}
                        className="w-full text-left px-3 py-2 bg-[#1B4332]/10 hover:bg-[#1B4332]/20 text-[#1B4332] rounded-2xl text-xs font-bold transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <Key className="w-3.5 h-3.5 text-[#E8A33D]" />
                          <span>My Unlocked Kejas</span>
                        </div>
                        <span className="text-[10px] bg-[#E8A33D] text-[#2B2118] px-2 py-0.5 rounded-full font-bold">
                          Protected
                        </span>
                      </button>
                    ) : null}

                    {/* Support Chat Link */}
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        openSupportChat('general');
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#FAF7F2] text-[#2B2620] rounded-xl text-xs font-medium transition-colors flex items-center space-x-2"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#C1440E]" />
                      <span>Concierge & Dispute Chat</span>
                    </button>

                    {/* Legal Terms Link */}
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        setShowTermsModal(true);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#FAF7F2] text-[#2B2620] rounded-xl text-xs font-medium transition-colors flex items-center space-x-2"
                    >
                      <Scale className="w-3.5 h-3.5 text-[#1B4332]" />
                      <span>Terms & Privacy Accord (KDPA 2019)</span>
                    </button>

                    {isAdmin ? (
                      <>
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            setActiveTab('admin');
                          }}
                          className="w-full text-center py-2 px-3 bg-[#2B2620] text-white rounded-2xl text-xs font-bold hover:bg-[#1a1714] transition-colors"
                        >
                          Open Admin Dashboard
                        </button>
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            logout();
                          }}
                          className="w-full text-center py-2 px-3 bg-red-50 text-red-700 hover:bg-red-100 rounded-2xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Log Out of Admin Account</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            setShowAuthModal(true);
                          }}
                          className="w-full text-center py-2 px-3 bg-[#2B2620] text-white rounded-2xl text-xs font-bold hover:bg-[#1a1714] transition-colors flex items-center justify-center space-x-1.5"
                        >
                          <Crown className="w-3.5 h-3.5 text-amber-300" />
                          <span>Admin Login (Isa Mohamed)</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            setShowAuthModal(true);
                          }}
                          className="w-full text-center py-2 px-3 bg-[#C1533A] text-white rounded-2xl text-xs font-bold hover:bg-[#ab452e] transition-colors shadow-xs active:scale-95"
                        >
                          Login with Phone (+254)
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {/* Supabase Data Inspector */}
      {showDataModal && <DataInspectorModal onClose={() => setShowDataModal(false)} />}
    </>
  );
};
