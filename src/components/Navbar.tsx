import React from 'react';
import { LogOut, ShieldCheck, BookOpen, PlusCircle, HelpCircle, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import fireflyLogo from '../assets/images/sonderly_firefly_logo.jpg';

interface NavbarProps {
  user: UserProfile | null;
  onSignOut: () => void;
  onNewEntry: () => void;
  onOpenThreatModel: () => void;
  onOpenTestWalkthrough: () => void;
  activeTab: 'write' | 'history' | 'ask';
  setActiveTab: (tab: 'write' | 'history' | 'ask') => void;
  entriesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onSignOut,
  onOpenThreatModel,
  onOpenTestWalkthrough,
  activeTab,
  setActiveTab,
  entriesCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE4DC] text-[#1F1D1A] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#E0D9CE] flex items-center justify-center shadow-xs overflow-hidden p-0.5">
            <img
              src={fireflyLogo}
              alt="Sonderly Firefly Logo"
              className="w-full h-full object-contain rounded-lg"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif font-bold tracking-tight text-[#1F1D1A]">Sonderly</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F5EFE6] text-[#8C6226] border border-[#E8DCB8]">
                Gemini 3.6 Flash
              </span>
            </div>
            <p className="text-xs text-[#7C7469] hidden sm:block">Intelligent Thinking Companion &amp; Firestore Security</p>
          </div>
        </div>

        {/* Center Navigation if Authenticated */}
        {user && (
          <div className="flex items-center bg-[#F2ECE4] p-1 rounded-xl border border-[#E2DBD0]">
            <button
              id="nav-tab-write"
              onClick={() => setActiveTab('write')}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'write'
                  ? 'bg-[#FFFFFF] text-[#1F1D1A] shadow-xs font-bold border border-[#E0D9CE]'
                  : 'text-[#6B6357] hover:text-[#1F1D1A] hover:bg-[#EAE2D8]'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-[#B88746]" />
              <span>Workspace</span>
            </button>
            <button
              id="nav-tab-history"
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-[#FFFFFF] text-[#1F1D1A] shadow-xs font-bold border border-[#E0D9CE]'
                  : 'text-[#6B6357] hover:text-[#1F1D1A] hover:bg-[#EAE2D8]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#B88746]" />
              <span>Past Entries</span>
              {entriesCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-[#F5EFE6] text-[#8C6226] font-bold border border-[#E8DCB8]">
                  {entriesCount}
                </span>
              )}
            </button>
            <button
              id="nav-tab-ask"
              onClick={() => setActiveTab('ask')}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'ask'
                  ? 'bg-[#FFFFFF] text-[#1F1D1A] shadow-xs font-bold border border-[#E0D9CE]'
                  : 'text-[#6B6357] hover:text-[#1F1D1A] hover:bg-[#EAE2D8]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#B88746]" />
              <span>Ask Past Self</span>
            </button>
          </div>
        )}

        {/* Right Section Actions & User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Threat Model Inspector */}
          <button
            id="btn-threat-model-open"
            onClick={onOpenThreatModel}
            title="View Threat Model & Security Controls"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FFFFFF] text-[#423A31] hover:text-[#1F1D1A] hover:bg-[#F5EFE6] border border-[#EAE4DC] transition-all shadow-xs cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#B88746]" />
            <span className="hidden md:inline">Security &amp; Threat Model</span>
          </button>

          {/* Test Walkthrough Modal */}
          <button
            id="btn-test-walkthrough-open"
            onClick={onOpenTestWalkthrough}
            title="View Interactive Test Walkthrough"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FFFFFF] text-[#423A31] hover:text-[#1F1D1A] hover:bg-[#F5EFE6] border border-[#EAE4DC] transition-all shadow-xs cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-[#B88746]" />
            <span className="hidden md:inline">Test Walkthrough</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3 pl-2 border-l border-[#EAE4DC]">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-8 h-8 rounded-full border border-[#D8CEBE] shadow-xs"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#B88746] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="hidden lg:block text-left text-xs">
                <p className="font-semibold text-[#1F1D1A] truncate max-w-[120px]">{user.displayName || 'User'}</p>
                <p className="text-[#7C7469] text-[10px] truncate max-w-[120px]">{user.email}</p>
              </div>
              <button
                id="btn-signout"
                onClick={onSignOut}
                title="Sign Out"
                className="p-2 text-[#7C7469] hover:text-[#9E4733] hover:bg-[#FDF3F0] rounded-xl transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
