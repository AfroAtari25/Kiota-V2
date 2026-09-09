import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Database, X, Copy, Check, Table, ShieldCheck, RefreshCw } from 'lucide-react';

interface DataInspectorModalProps {
  onClose: () => void;
}

export const DataInspectorModal: React.FC<DataInspectorModalProps> = ({ onClose }) => {
  const { users, listings, media, unlocks, payouts, reviews, approveListing } = useApp();
  const [activeTable, setActiveTable] = useState<
    'Users' | 'Listings' | 'Media' | 'Unlocks' | 'Payouts' | 'Reviews'
  >('Listings');
  const [copied, setCopied] = useState(false);

  const getTableData = () => {
    switch (activeTable) {
      case 'Users':
        return users;
      case 'Listings':
        return listings;
      case 'Media':
        return media;
      case 'Unlocks':
        return unlocks;
      case 'Payouts':
        return payouts;
      case 'Reviews':
        return reviews;
    }
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(getTableData(), null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tableCounts = {
    Users: users.length,
    Listings: listings.length,
    Media: media.length,
    Unlocks: unlocks.length,
    Payouts: payouts.length,
    Reviews: reviews.length,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="bg-[#FBF3E7] w-full max-w-4xl max-h-[90vh] rounded-3xl border border-[#2B2118]/20 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#2B2118] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#E8A33D] text-[#2B2118]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-extrabold text-base text-white">
                  Supabase Data Model & Schema Inspector
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-[#1B4332] text-white text-[10px] font-bold">
                  Live Relational Store
                </span>
              </div>
              <p className="text-xs text-white/70">
                PROMPT 1 Mandated Tables: Users, Listings, Media, Unlocks, Payouts, Reviews
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Table Selector Tabs */}
        <div className="flex items-center space-x-1.5 p-3 bg-white/70 border-b border-[#2B2118]/10 overflow-x-auto no-scrollbar">
          {(['Users', 'Listings', 'Media', 'Unlocks', 'Payouts', 'Reviews'] as const).map(
            (tbl) => {
              const isSelected = activeTable === tbl;
              return (
                <button
                  key={tbl}
                  onClick={() => setActiveTable(tbl)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-[#C1440E] text-white shadow-xs'
                      : 'bg-[#FBF3E7] text-[#2B2118] hover:bg-white border border-[#2B2118]/10'
                  }`}
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>{tbl}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#2B2118]/10 text-[#2B2118]'
                    }`}
                  >
                    {tableCounts[tbl]}
                  </span>
                </button>
              );
            }
          )}
        </div>

        {/* Action Controls & Table Details */}
        <div className="px-5 py-2.5 bg-[#FBF3E7] border-b border-[#2B2118]/10 flex items-center justify-between text-xs">
          <div className="text-[#2B2118]/70">
            Table: <b className="text-[#2B2118] font-mono">{activeTable}</b> • Records: {tableCounts[activeTable]}
          </div>

          <div className="flex items-center space-x-2">
            {activeTable === 'Listings' && listings.some((l) => l.status === 'pending_review') && (
              <button
                onClick={() => {
                  listings.forEach((l) => {
                    if (l.status === 'pending_review') approveListing(l.id);
                  });
                }}
                className="py-1 px-2.5 bg-[#1B4332] text-white rounded-lg text-[11px] font-bold flex items-center space-x-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Approve All Pending Listings</span>
              </button>
            )}

            <button
              onClick={handleCopyJSON}
              className="py-1 px-2.5 bg-white border border-[#2B2118]/20 text-[#2B2118] rounded-lg text-[11px] font-bold flex items-center space-x-1 hover:bg-neutral-50"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#1B4332]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied JSON!' : 'Copy Table JSON'}</span>
            </button>
          </div>
        </div>

        {/* Raw Data Viewer */}
        <div className="flex-1 p-4 overflow-auto bg-[#1e1e1e] text-emerald-300 font-mono text-xs">
          <pre>{JSON.stringify(getTableData(), null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};
