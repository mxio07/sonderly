import React, { useState, useRef, useEffect } from 'react';
import { 
  LogOut, 
  ShieldCheck, 
  BookOpen, 
  HelpCircle, 
  Sparkles, 
  Home,
  MoreVertical,
  ChevronDown
} from 'lucide-react';
import { UserProfile } from '../types';
import fireflyLogo from '../assets/images/sonderly_firefly_logo.jpg';

export type AppTab = 'home' | 'write' | 'dialogue' | 'history' | 'ask';

interface NavbarProps {
  user: UserProfile | null;
  onSignOut: () => void;
  onNewEntry: () => void;
  onOpenThreatModel: () => void;
  onOpenTestWalkthrough: () => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
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
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close overflow menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };
    if (isMoreMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMoreMenuOpen]);

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE4DC] text-[#1F1D1A] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Title */}
        <div 
          onClick={() => user && setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
          title={user ? "Go to Home Mode Choice" : "Sonderly"}
        >
          <div className="w-10 h-10 rounded-xl bg-white border border-[#E0D9CE] flex items-center justify-center shadow-xs overflow-hidden p-0.5 group-hover:border-[#8C5E24] transition-colors">
            <img
              src={fireflyLogo}
              alt="Sonderly Firefly Logo"
              className="w-full h-full object-contain rounded-lg"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif font-bold tracking-tight text-[#1F1D1A] group-hover:text-[#8C5E24] transition-colors">Sonderly</h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F5EFE6] text-[#6B4716] border border-[#DFCBA8]">
                Gemini 3.6 Flash
              </span>
            </div>
            <p className="text-xs text-[#5C5346] hidden md:block font-medium">Intelligent Thinking Companion &amp; Firestore Security</p>
          </div>
        </div>

        {/* Center Main Navigation: Decluttered to Home, Past Entries, Ask Past Self */}
        {user && (
          <nav className="flex items-center bg-[#F2ECE4] p-1 rounded-xl border border-[#E2DBD0] gap-1">
            {/* Home Tab */}
            <button
              id="nav-tab-home"
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-[#FFFFFF] text-[#1F1D1A] shadow-xs font-bold border border-[#E0D9CE]'
                  : 'text-[#4D453B] hover:text-[#1F1D1A] hover:bg-[#EAE2D8]'
              }`}
            >
              <Home className="w-4 h-4 text-[#8C5E24]" />
              <span>Home</span>
            </button>

            {/* Past Entries */}
            <button
              id="nav-tab-history"
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-[#FFFFFF] text-[#1F1D1A] shadow-xs font-bold border border-[#E0D9CE]'
                  : 'text-[#4D453B] hover:text-[#1F1D1A] hover:bg-[#EAE2D8]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#8C5E24]" />
              <span>Past Entries</span>
              {entriesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-[#F5EFE6] text-[#6B4716] font-bold border border-[#DFCBA8]">
                  {entriesCount}
                </span>
              )}
            </button>

            {/* Ask Past Self */}
            <button
              id="nav-tab-ask"
              onClick={() => setActiveTab('ask')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'ask'
                  ? 'bg-[#FFFFFF] text-[#1F1D1A] shadow-xs font-bold border border-[#E0D9CE]'
                  : 'text-[#4D453B] hover:text-[#1F1D1A] hover:bg-[#EAE2D8]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#8C5E24]" />
              <span>Ask Past Self</span>
            </button>
          </nav>
        )}

        {/* Right Section: Compact Overflow Menu & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Compact Overflow Menu (Security Specs & Test Walkthrough) */}
          <div className="relative" ref={moreMenuRef}>
            <button
              id="btn-nav-more"
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shadow-xs cursor-pointer ${
                isMoreMenuOpen 
                  ? 'bg-[#F5EFE6] text-[#1F1D1A] border-[#8C5E24]' 
                  : 'bg-[#FFFFFF] text-[#3D352E] hover:text-[#1F1D1A] hover:bg-[#F5EFE6] border-[#E0D8CA]'
              }`}
              title="More options and specifications"
            >
              <MoreVertical className="w-4 h-4 text-[#8C5E24]" />
              <span className="hidden sm:inline">More</span>
              <ChevronDown className={`w-3 h-3 text-[#5C5346] transition-transform ${isMoreMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isMoreMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#FFFFFF] border border-[#E0D8CA] shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-[#8C5E24] tracking-wider uppercase border-b border-[#EAE4DC] mb-1">
                  Diagnostics &amp; Security
                </div>

                <button
                  id="btn-threat-model-open"
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    onOpenThreatModel();
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-[#3D352E] hover:text-[#1F1D1A] hover:bg-[#F5EFE6] transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#F5EFE6] flex items-center justify-center border border-[#DFCBA8] shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#8C5E24]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1F1D1A]">Security Specs</p>
                    <p className="text-[10px] text-[#5C5346] font-normal">Threat Model &amp; Directives</p>
                  </div>
                </button>

                <button
                  id="btn-test-walkthrough-open"
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    onOpenTestWalkthrough();
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-[#3D352E] hover:text-[#1F1D1A] hover:bg-[#F5EFE6] transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#F5EFE6] flex items-center justify-center border border-[#DFCBA8] shrink-0">
                    <HelpCircle className="w-3.5 h-3.5 text-[#8C5E24]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1F1D1A]">Test Walkthrough</p>
                    <p className="text-[10px] text-[#5C5346] font-normal">Interactive verification suite</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* User Profile & Sign Out */}
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
                <div className="w-8 h-8 rounded-full bg-[#8C5E24] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="hidden xl:block text-left text-xs">
                <p className="font-semibold text-[#1F1D1A] truncate max-w-[120px]">{user.displayName || 'User'}</p>
                <p className="text-[#5C5346] text-[10px] truncate max-w-[120px]">{user.email}</p>
              </div>
              <button
                id="btn-sign-out"
                onClick={onSignOut}
                title="Sign out securely"
                className="p-2 rounded-xl text-[#5C5346] hover:text-[#9E4733] hover:bg-[#FDF3F0] transition-colors cursor-pointer border border-transparent hover:border-[#FADCD5]"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenThreatModel}
              className="text-xs font-semibold text-[#6B4716] hover:text-[#1F1D1A] underline underline-offset-2 cursor-pointer"
            >
              Security Directives
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
