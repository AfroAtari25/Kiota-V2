import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  MessageSquare,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileQuestion,
  Sparkles,
  ArrowLeft,
  PhoneCall,
  User,
  PlusCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TicketCategory, SupportTicket } from '../types';

interface SupportChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: TicketCategory;
  initialListingId?: string;
}

export const SupportChatModal: React.FC<SupportChatModalProps> = ({
  isOpen,
  onClose,
  initialCategory,
  initialListingId,
}) => {
  const {
    currentUser,
    tickets,
    createSupportTicket,
    replyToTicket,
    listings,
  } = useApp();

  // User's tickets (admins see all)
  const userTickets =
    currentUser.role === 'admin'
      ? tickets
      : tickets.filter((t) => t.userId === currentUser.id);

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<TicketCategory>(
    initialCategory || (currentUser.role === 'poster' ? 'listing_approval' : 'general')
  );
  const [newSubject, setNewSubject] = useState<string>('');
  const [newMessageText, setNewMessageText] = useState<string>('');
  const [replyText, setReplyText] = useState<string>('');
  const [selectedListingForTicket, setSelectedListingForTicket] = useState<string>(
    initialListingId || ''
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTicketId, tickets]);

  // Handle initial pre-filled values
  useEffect(() => {
    if (initialCategory) {
      setNewCategory(initialCategory);
      setIsCreatingNew(true);
      if (initialCategory === 'escrow_refund') {
        setNewSubject('24-Hour Escrow Refund Request');
      } else if (initialCategory === 'listing_approval') {
        setNewSubject('Listing Approval & GPS Watermark Verification');
      } else if (initialCategory === 'report_broker') {
        setNewSubject('Report Illegal Viewing Fee / Broker Extortion');
      }
    }
    if (initialListingId) {
      setSelectedListingForTicket(initialListingId);
    }
  }, [initialCategory, initialListingId]);

  if (!isOpen) return null;

  const activeTicket = tickets.find((t) => t.id === selectedTicketId);

  const handleStartTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessageText.trim()) return;

    const created = createSupportTicket({
      category: newCategory,
      subject: newSubject.trim(),
      message: newMessageText.trim(),
      listingId: selectedListingForTicket || undefined,
    });

    setIsCreatingNew(false);
    setSelectedTicketId(created.id);
    setNewSubject('');
    setNewMessageText('');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    replyToTicket(activeTicket.id, replyText.trim(), currentUser.role === 'admin');
    setReplyText('');
  };

  const getCategoryBadge = (cat: TicketCategory) => {
    switch (cat) {
      case 'escrow_refund':
        return { label: '24h Escrow Dispute', bg: 'bg-[#C1440E]/10 text-[#C1440E] border-[#C1440E]/20' };
      case 'listing_approval':
        return { label: 'Listing Approval', bg: 'bg-[#E8A33D]/15 text-[#915B00] border-[#E8A33D]/30' };
      case 'payout_delay':
        return { label: 'Payout / M-Pesa', bg: 'bg-[#1B4332]/10 text-[#1B4332] border-[#1B4332]/20' };
      case 'report_broker':
        return { label: 'Broker Extortion', bg: 'bg-red-100 text-red-700 border-red-200' };
      default:
        return { label: 'General Help', bg: 'bg-stone-100 text-stone-700 border-stone-200' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2B2118]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] w-full max-w-3xl h-[85vh] rounded-3xl shadow-2xl border border-[#2B2118]/15 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="bg-[#1B4332] text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8A33D] text-[#2B2118] flex items-center justify-center shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E8A33D]">
                  Kiota Kenya Concierge & Support Desk
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h3 className="serif text-lg font-bold text-[#FBF3E7]">
                Live Support & Dispute Center
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Inner Split Layout: Left Ticket List, Right Conversation */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT SIDE: TICKET THREADS */}
          <div
            className={`w-full sm:w-72 bg-white border-r border-[#2B2118]/10 flex flex-col shrink-0 ${
              selectedTicketId || isCreatingNew ? 'hidden sm:flex' : 'flex'
            }`}
          >
            <div className="p-3 border-b border-[#2B2118]/10 flex items-center justify-between bg-[#FBF3E7]">
              <span className="font-bold text-xs text-[#2B2118]">
                Conversations ({userTickets.length})
              </span>
              <button
                onClick={() => {
                  setIsCreatingNew(true);
                  setSelectedTicketId(null);
                }}
                className="px-2.5 py-1 bg-[#1B4332] hover:bg-[#143326] text-white text-[11px] font-bold rounded-lg flex items-center space-x-1 shadow-xs transition-all"
              >
                <PlusCircle className="w-3 h-3" />
                <span>New Ticket</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#2B2118]/8">
              {userTickets.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#2B2118]/60 space-y-2">
                  <p>No active support tickets.</p>
                  <p className="text-[11px]">Click "New Ticket" to contact our Nairobi desk.</p>
                </div>
              ) : (
                userTickets.map((t) => {
                  const badge = getCategoryBadge(t.category);
                  const isSelected = t.id === selectedTicketId;
                  const lastMsg = t.messages[t.messages.length - 1];

                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setSelectedTicketId(t.id);
                        setIsCreatingNew(false);
                      }}
                      className={`w-full text-left p-3.5 transition-colors ${
                        isSelected
                          ? 'bg-[#1B4332]/10 border-l-4 border-[#1B4332]'
                          : 'hover:bg-[#FBF3E7]/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span
                          className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${badge.bg}`}
                        >
                          {badge.label}
                        </span>
                        <span className="text-[10px] text-[#2B2118]/50 font-mono">
                          {new Date(t.lastActivityAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="font-bold text-xs text-[#2B2118] truncate">
                        {t.subject}
                      </div>
                      {lastMsg && (
                        <p className="text-[11px] text-[#2B2118]/65 truncate mt-0.5">
                          {lastMsg.text}
                        </p>
                      )}
                      <div className="mt-1.5 flex items-center justify-between text-[10px] text-[#2B2118]/50">
                        <span>{t.messages.length} message(s)</span>
                        <span
                          className={`font-bold uppercase ${
                            t.status === 'resolved' ? 'text-emerald-700' : 'text-[#C1440E]'
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Quick Contact Hotline Info */}
            <div className="p-3 bg-[#FAF7F2] border-t border-[#2B2118]/10 text-[10px] text-[#2B2118]/70 flex items-center space-x-2">
              <PhoneCall className="w-3.5 h-3.5 text-[#1B4332]" />
              <span>Nairobi Support Line: +254 741 367 051</span>
            </div>
          </div>

          {/* RIGHT SIDE: ACTIVE TICKET CHAT OR CREATE NEW */}
          <div className="flex-1 flex flex-col bg-[#FAF7F2]">
            {isCreatingNew ? (
              /* NEW TICKET FORM */
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                <div className="flex items-center space-x-2 sm:hidden mb-2">
                  <button
                    onClick={() => setIsCreatingNew(false)}
                    className="p-1 rounded-lg bg-white border border-[#2B2118]/10 text-xs font-bold flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                </div>

                <div>
                  <h4 className="serif font-bold text-lg text-[#1B4332]">
                    Start a New Inquiry or Dispute
                  </h4>
                  <p className="text-xs text-[#2B2118]/70">
                    Our team reviews GPS coordinates, verification watermarks, and escrow releases.
                  </p>
                </div>

                <form onSubmit={handleStartTicket} className="space-y-4">
                  {/* Category Selection Chips */}
                  <div>
                    <label className="block text-xs font-bold text-[#2B2118] mb-1.5">
                      What do you need assistance with?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setNewCategory('listing_approval');
                          if (!newSubject) setNewSubject('Listing Approval & Video Verification');
                        }}
                        className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-colors ${
                          newCategory === 'listing_approval'
                            ? 'bg-[#1B4332] text-white border-[#1B4332]'
                            : 'bg-white text-[#2B2118] border-[#2B2118]/15 hover:bg-[#FBF3E7]'
                        }`}
                      >
                        Listing Approval
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setNewCategory('escrow_refund');
                          if (!newSubject) setNewSubject('Claim 24h 100% Escrow Refund');
                        }}
                        className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-colors ${
                          newCategory === 'escrow_refund'
                            ? 'bg-[#C1440E] text-white border-[#C1440E]'
                            : 'bg-white text-[#2B2118] border-[#2B2118]/15 hover:bg-[#FBF3E7]'
                        }`}
                      >
                        Escrow Refund (24h)
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setNewCategory('payout_delay');
                          if (!newSubject) setNewSubject('Payout Status & M-Pesa Disbursal');
                        }}
                        className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-colors ${
                          newCategory === 'payout_delay'
                            ? 'bg-[#1B4332] text-white border-[#1B4332]'
                            : 'bg-white text-[#2B2118] border-[#2B2118]/15 hover:bg-[#FBF3E7]'
                        }`}
                      >
                        Payout & M-Pesa
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setNewCategory('report_broker');
                          if (!newSubject) setNewSubject('Report Broker Demanding Viewing Fees');
                        }}
                        className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-colors ${
                          newCategory === 'report_broker'
                            ? 'bg-red-700 text-white border-red-700'
                            : 'bg-white text-[#2B2118] border-[#2B2118]/15 hover:bg-[#FBF3E7]'
                        }`}
                      >
                        Report Viewing Fee
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setNewCategory('inaccurate_listing');
                          if (!newSubject) setNewSubject('Inaccurate Specs / Unit Occupied');
                        }}
                        className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-colors ${
                          newCategory === 'inaccurate_listing'
                            ? 'bg-[#1B4332] text-white border-[#1B4332]'
                            : 'bg-white text-[#2B2118] border-[#2B2118]/15 hover:bg-[#FBF3E7]'
                        }`}
                      >
                        Inaccurate Listing
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setNewCategory('general');
                          if (!newSubject) setNewSubject('General Question / Account Help');
                        }}
                        className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-colors ${
                          newCategory === 'general'
                            ? 'bg-[#1B4332] text-white border-[#1B4332]'
                            : 'bg-white text-[#2B2118] border-[#2B2118]/15 hover:bg-[#FBF3E7]'
                        }`}
                      >
                        General Inquiry
                      </button>
                    </div>
                  </div>

                  {/* Optional Listing Reference */}
                  {listings.length > 0 && (
                    <div>
                      <label className="block text-xs font-bold text-[#2B2118] mb-1">
                        Related Listing (Optional)
                      </label>
                      <select
                        value={selectedListingForTicket}
                        onChange={(e) => setSelectedListingForTicket(e.target.value)}
                        className="w-full p-2.5 bg-white border border-[#2B2118]/15 rounded-xl text-xs text-[#2B2118] focus:ring-1 focus:ring-[#1B4332]"
                      >
                        <option value="">-- No specific listing --</option>
                        {listings.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.title} ({l.area} - KSh {l.price.toLocaleString()})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Subject Line */}
                  <div>
                    <label className="block text-xs font-bold text-[#2B2118] mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Brief summary of your inquiry or dispute..."
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      className="w-full p-2.5 bg-white border border-[#2B2118]/15 rounded-xl text-xs text-[#2B2118] focus:ring-1 focus:ring-[#1B4332]"
                    />
                  </div>

                  {/* Initial Message */}
                  <div>
                    <label className="block text-xs font-bold text-[#2B2118] mb-1">
                      Detailed Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Provide all relevant details (e.g. what happened when you arrived, M-Pesa transaction reference, or listing video clarification)..."
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      className="w-full p-3 bg-white border border-[#2B2118]/15 rounded-xl text-xs text-[#2B2118] focus:ring-1 focus:ring-[#1B4332]"
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingNew(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#2B2118]/70 hover:bg-[#2B2118]/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#1B4332] hover:bg-[#143326] text-white text-xs font-extrabold rounded-xl shadow-md transition-all active:scale-95 flex items-center space-x-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Ticket</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : activeTicket ? (
              /* LIVE CHAT VIEW */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Active Ticket Top Bar */}
                <div className="p-3.5 bg-white border-b border-[#2B2118]/10 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedTicketId(null)}
                      className="p-1 rounded-lg bg-[#FAF7F2] border border-[#2B2118]/10 sm:hidden"
                    >
                      <ArrowLeft className="w-4 h-4 text-[#2B2118]" />
                    </button>
                    <div>
                      <h4 className="serif font-bold text-sm text-[#2B2118]">
                        {activeTicket.subject}
                      </h4>
                      <div className="flex items-center space-x-2 text-[10px] text-[#2B2118]/60 mt-0.5">
                        <span>Ticket ID: {activeTicket.id}</span>
                        {activeTicket.listingTitle && (
                          <span>• Re: {activeTicket.listingTitle}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                      getCategoryBadge(activeTicket.category).bg
                    }`}
                  >
                    {getCategoryBadge(activeTicket.category).label}
                  </span>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  <div className="text-center">
                    <span className="text-[10px] font-mono text-[#2B2118]/50 bg-white/70 px-2.5 py-1 rounded-full border border-[#2B2118]/10">
                      Opened on {new Date(activeTicket.createdAt).toLocaleDateString('en-GB')}
                    </span>
                  </div>

                  {activeTicket.messages.map((m) => {
                    const isMe = m.senderId === currentUser.id;
                    const isSupport = m.isAdminResponse || m.senderRole === 'support';

                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center space-x-1.5 mb-1 text-[10px] text-[#2B2118]/60">
                          <span className="font-bold">
                            {isMe ? 'You' : m.senderName}
                          </span>
                          <span>•</span>
                          <span className="font-mono">
                            {new Date(m.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <div
                          className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                            isMe
                              ? 'bg-[#1B4332] text-white rounded-tr-xs'
                              : isSupport
                              ? 'bg-white border-2 border-[#1B4332]/30 text-[#2B2118] rounded-tl-xs'
                              : 'bg-white border border-[#2B2118]/10 text-[#2B2118] rounded-tl-xs'
                          }`}
                        >
                          {isSupport && (
                            <div className="flex items-center space-x-1 font-bold text-[10px] text-[#1B4332] mb-1">
                              <ShieldCheck className="w-3 h-3 text-[#E8A33D]" />
                              <span>Kiota Official Support</span>
                            </div>
                          )}
                          <p className="whitespace-pre-wrap">{m.text}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply Input Bar */}
                <form
                  onSubmit={handleSendReply}
                  className="p-3 bg-white border-t border-[#2B2118]/10 flex items-center space-x-2"
                >
                  <input
                    type="text"
                    required
                    placeholder="Type your reply to Kiota Support..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 p-2.5 bg-[#FAF7F2] border border-[#2B2118]/15 rounded-xl text-xs text-[#2B2118] focus:ring-1 focus:ring-[#1B4332] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-[#1B4332] hover:bg-[#143326] text-white rounded-xl shadow-sm transition-all active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              /* EMPTY SELECTION WELCOME */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#E8A33D]/20 text-[#1B4332] flex items-center justify-center">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <h4 className="serif font-bold text-base text-[#2B2118]">
                  Kiota Customer Support & Concierge
                </h4>
                <p className="text-xs text-[#2B2118]/70 max-w-sm">
                  Select a past ticket on the left or start a new inquiry regarding listing approval, escrow refunds, or broker reporting.
                </p>
                <button
                  onClick={() => setIsCreatingNew(true)}
                  className="px-5 py-2.5 bg-[#1B4332] hover:bg-[#143326] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  Start New Conversation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
