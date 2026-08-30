import React from 'react';
import { LogOut, ShieldCheck, BookOpen, PlusCircle, HelpCircle } from 'lucide-react';
import { UserProfile } from '../types';
import fireflyLogo from '../assets/images/sonderly_firefly_logo.jpg';

interface NavbarProps {
  user: UserProfile | null;
  onSignOut: () => void;
  onNewEntry: () => void;
  onOpenThreatModel: () => void;
  onOpenTestWalkthrough: () => void;
  activeTab: 'write' | 'history';
  setActiveTab: (tab: 'write' | 'history') => void;
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
    <header className="sticky top-0 z-30 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#EDE8E1] text-[#242220] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#EAE4DC] flex items-center justify-center shadow-xs overflow-hidden p-0.5">
            <img
              src={fireflyLogo}
              alt="Sonderly Firefly Logo"
              className="w-full h-full object-contain rounded-lg"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-[#242220]">Sonderly</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F1F6F1] text-[#466548] border border-[#DCE8DC]">
                Gemini 3.6 Flash
              </span>
            </div>
            <p className="text-xs text-[#666057] hidden sm:block">Empathetic Journaling &amp; User-Isolated Firestore</p>
          </div>
        </div>

        {/* Center Navigation if Authenticated */}
        {user && (
          <div className="flex items-center bg-[#F7F4EE] p-1 rounded-xl border border-[#EAE4DC] shadow-inner">
            <button
              id="nav-tab-write"
              onClick={() => setActiveTab('write')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'write'
                  ? 'bg-[#FFFFFF] text-[#466548] shadow-xs font-bold'
                  : 'text-[#666057] hover:text-[#242220] hover:bg-[#EDE8E1]/60'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-[#638466]" />
              <span>Workspace</span>
            </button>
            <button
              id="nav-tab-history"
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-[#FFFFFF] text-[#466548] shadow-xs font-bold'
                  : 'text-[#666057] hover:text-[#242220] hover:bg-[#EDE8E1]/60'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#638466]" />
              <span>Past Entries</span>
              {entriesCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-[#F1F6F1] text-[#466548] font-bold border border-[#DCE8DC]">
                  {entriesCount}
                </span>
              )}
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FFFFFF] text-[#423E39] hover:text-[#466548] hover:bg-[#F1F6F1] border border-[#EDE8E1] transition-all shadow-xs cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#638466]" />
            <span className="hidden md:inline">Security &amp; Threat Model</span>
          </button>

          {/* Test Walkthrough Modal */}
          <button
            id="btn-test-walkthrough-open"
            onClick={onOpenTestWalkthrough}
            title="View Interactive Test Walkthrough"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FFFFFF] text-[#423E39] hover:text-[#B6634C] hover:bg-[#FDF4F0] border border-[#EDE8E1] transition-all shadow-xs cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-[#B6634C]" />
            <span className="hidden md:inline">Test Walkthrough</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3 pl-2 border-l border-[#EDE8E1]">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-8 h-8 rounded-full border border-[#DCE8DC] shadow-xs"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#638466] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="hidden lg:block text-left text-xs">
                <p className="font-semibold text-[#242220] truncate max-w-[120px]">{user.displayName || 'User'}</p>
                <p className="text-[#666057] text-[10px] truncate max-w-[120px]">{user.email}</p>
              </div>
              <button
                id="btn-signout"
                onClick={onSignOut}
                title="Sign Out"
                className="p-2 text-[#918B82] hover:text-[#C46A52] hover:bg-[#FDF4F0] rounded-xl transition-all cursor-pointer"
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
