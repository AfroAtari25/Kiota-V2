import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, PlusCircle, Key, Wallet, UserCircle2, ShieldCheck, Building2 } from 'lucide-react';
import { ActiveTab } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, unlocks, currentUser, payouts, listings } = useApp();

  const userUnlocksCount = unlocks.filter((u) => u.seeker_id === currentUser.id).length;
  const hostListingsCount = listings.filter((l) => l.poster_id === currentUser.id).length;
  const pendingPosterPayouts = payouts.filter(
    (p) => p.poster_id === currentUser.id && p.status === 'pending'
  ).length;
  const pendingAdminListings = listings.filter((l) => l.status === 'pending_review').length;

  const isAdmin = currentUser.role === 'admin';
  const isHost = currentUser.role === 'poster';

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = isAdmin
    ? [
        { id: 'browse', label: 'Explore', icon: Search },
        { id: 'admin', label: 'Admin Hub', icon: ShieldCheck, badge: pendingAdminListings },
        { id: 'post', label: 'Share Place', icon: PlusCircle },
        { id: 'wallet', label: 'Safeguards', icon: Wallet },
        { id: 'profile', label: 'Admin ID', icon: UserCircle2 },
      ]
    : isHost
    ? [
        { id: 'browse', label: 'Explore', icon: Search },
        { id: 'host_properties', label: 'My Kejas', icon: Building2, badge: hostListingsCount },
        { id: 'post', label: 'Share Place', icon: PlusCircle },
        { id: 'wallet', label: 'Earnings', icon: Wallet, badge: pendingPosterPayouts > 0 ? pendingPosterPayouts : undefined },
        { id: 'profile', label: 'Trust & ID', icon: UserCircle2 },
      ]
    : [
        { id: 'browse', label: 'Find Nest', icon: Search },
        { id: 'unlocks', label: 'Unlocked', icon: Key, badge: userUnlocksCount },
        { id: 'post', label: 'Share Place', icon: PlusCircle },
        { id: 'wallet', label: 'Safeguards', icon: Wallet },
        { id: 'profile', label: 'Trust & ID', icon: UserCircle2 },
      ];

  return (
    <nav
      id="bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#FCFBF8]/95 backdrop-blur-md border-t border-[#2B2620]/15 px-3 py-2 pb-safe shadow-lg"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isPost = item.id === 'post';

          if (isPost) {
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className="relative flex flex-col items-center -mt-5 focus:outline-hidden"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                  isActive ? 'bg-[#3B5D42] text-white ring-4 ring-[#C1533A]/30' : 'bg-[#C1533A] text-white hover:bg-[#ab452e]'
                }`}>
                  <PlusCircle className="w-6 h-6" />
                </div>
                <span className={`text-[10px] mt-1 font-bold ${isActive ? 'text-[#3B5D42]' : 'text-[#2B2620]/80'}`}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors focus:outline-hidden ${
                isActive ? 'text-[#C1533A]' : 'text-[#8A8072] hover:text-[#2B2620]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#C1533A] text-[#FCFBF8] text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#C1533A] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
