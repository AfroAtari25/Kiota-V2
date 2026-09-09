import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { BrowseScreen } from './components/BrowseScreen';
import { PostListingFlow } from './components/PostListingFlow';
import { UnlocksScreen } from './components/UnlocksScreen';
import { WalletScreen } from './components/WalletScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { HostPropertiesDashboard } from './components/HostPropertiesDashboard';
import { ListingDetailModal } from './components/ListingDetailModal';
import { TermsAndConditionsModal } from './components/TermsAndConditionsModal';
import { SupportChatModal } from './components/SupportChatModal';
import { Scale, ShieldCheck, MessageSquare, Heart } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    showTermsModal,
    setShowTermsModal,
    showSupportModal,
    setShowSupportModal,
    supportModalCategory,
    supportModalListingId,
    openSupportChat,
  } = useApp();

  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#2B2620] flex flex-col font-sans">
      {/* Header */}
      <Header />

      {/* Primary Scrollable Content Area */}
      <main className="flex-1 px-4 py-4 max-w-5xl w-full mx-auto">
        {activeTab === 'browse' && <BrowseScreen />}
        {activeTab === 'post' && <PostListingFlow />}
        {activeTab === 'unlocks' && <UnlocksScreen />}
        {activeTab === 'host_properties' && <HostPropertiesDashboard />}
        {activeTab === 'wallet' && <WalletScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Platform Legal & Compliance Footer */}
      <footer className="bg-[#FAF7F2] border-t border-[#2B2620]/10 px-4 py-8 mb-16 sm:mb-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#2B2620]/75">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-xl bg-[#1B4332] text-white flex items-center justify-center font-bold text-xs">
              K
            </div>
            <div>
              <span className="font-bold text-[#2B2620]">Kiota Kenya Technologies Ltd</span>
              <p className="text-[10px] text-[#2B2620]/60">
                Constitution of Kenya (2010) & ODPC Reg: ODPC/PR/2026/0891
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setShowTermsModal(true)}
              className="hover:text-[#1B4332] font-semibold flex items-center space-x-1"
            >
              <Scale className="w-3.5 h-3.5 text-[#C1440E]" />
              <span>Terms & User Conditions</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setShowTermsModal(true)}
              className="hover:text-[#1B4332] font-semibold flex items-center space-x-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#1B4332]" />
              <span>KDPA 2019 Privacy Accord</span>
            </button>
            <span>•</span>
            <button
              onClick={() => openSupportChat('general')}
              className="hover:text-[#1B4332] font-semibold flex items-center space-x-1 text-[#C1440E]"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Support Chat Desk</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <ListingDetailModal />
      <TermsAndConditionsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
      <SupportChatModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        initialCategory={supportModalCategory}
        initialListingId={supportModalListingId}
      />

      {/* Mobile-First Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
