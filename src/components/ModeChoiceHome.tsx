import React from 'react';
import { 
  PenTool, 
  MessageSquare, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Search,
  CheckCircle2,
  Clock,
  Compass
} from 'lucide-react';
import { UserProfile, JournalEntry } from '../types';
import { ElegantFlowingRibbons } from './ElegantFlowingRibbons';

interface ModeChoiceHomeProps {
  user: UserProfile;
  entries: JournalEntry[];
  onSelectMode: (mode: 'write' | 'dialogue') => void;
  onNavigateToHistory: () => void;
  onNavigateToAsk: () => void;
}

export const ModeChoiceHome: React.FC<ModeChoiceHomeProps> = ({
  user,
  entries,
  onSelectMode,
  onNavigateToHistory,
  onNavigateToAsk,
}) => {
  // Dynamically resolve authenticated user's display name or email username
  const userName = user.displayName?.trim() 
    ? user.displayName.trim().split(' ')[0] 
    : (user.email ? user.email.split('@')[0] : 'there');
  const recentEntry = entries.length > 0 ? entries[0] : null;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#FBF9F4] text-[#1F1D1A] py-10 sm:py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-between overflow-hidden">
      
      {/* Background Layer: Gently animated flowing horizontal gold/cream ribbon lines filling margins & background */}
      <ElegantFlowingRibbons animated={true} />

      {/* Central Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center">
        
        {/* Welcoming Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          {/* Prominent, readable welcome banner */}
          <div className="inline-flex items-center gap-2.5 sm:gap-3 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#FFFFFF]/95 backdrop-blur-xs border border-[#DFCBA8] shadow-sm mb-6 mx-auto transition-all">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#8C5E24] shrink-0" />
            <span className="text-sm sm:text-base md:text-lg font-bold text-[#1F1D1A]">
              Welcome, {userName}
            </span>
            <span className="text-[#8C5E24] font-bold text-sm sm:text-base">&bull;</span>
            <span className="text-xs sm:text-sm md:text-base text-[#593A12] font-semibold">
              Intelligent Thinking Companion
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1F1D1A] tracking-tight leading-tight">
            How would you like to think today?
          </h1>

          <p className="text-base sm:text-lg text-[#3D352E] mt-3.5 font-normal leading-relaxed">
            Select a mode to begin. You can switch between deep reflection, interactive dialogue, and historical inquiry at any time.
          </p>
        </div>

        {/* The Three Choice Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 max-w-6xl mx-auto w-full mb-12">
          
          {/* Choice Card 1: Reflect & Synthesize */}
          <div
            id="card-mode-write"
            onClick={() => onSelectMode('write')}
            className="group relative rounded-2xl bg-gradient-to-b from-[#FFFFFF]/95 to-[#FAF8F5]/95 backdrop-blur-xs border-2 border-[#E0D8CA] hover:border-[#8C5E24] p-7 sm:p-8 text-left shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1 overflow-hidden"
          >
            {/* Ambient Corner Accent (Lower z-index behind text) */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#F5EFE6]/60 rounded-bl-full pointer-events-none group-hover:bg-[#F5ECD9] transition-colors z-0" />

            <div className="relative z-10">
              {/* Header Badge & Icon */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-[#2A241F] to-[#1F1D1A] text-white flex items-center justify-center border border-[#423A31] shadow-xs group-hover:scale-105 transition-transform">
                  <PenTool className="w-6 h-6 text-[#E5C287]" />
                </div>
                <span className="px-3.5 py-1 rounded-full bg-[#FAF8F5] border border-[#DFCBA8] text-[#593A12] text-xs sm:text-sm font-mono font-bold shadow-2xs">
                  Mode 01
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1D1A] group-hover:text-[#8C5E24] transition-colors tracking-tight mb-3">
                Reflect &amp; Synthesize
              </h2>

              {/* Explicit Requested Description */}
              <p className="text-sm sm:text-base text-[#3D352E] leading-relaxed font-normal mb-6">
                Pour out what's on your mind. Sonderly reads it back with clarity — a synthesis, the emotional themes it notices, and books that might help.
              </p>

              {/* Included Capabilities List */}
              <div className="space-y-2.5 mb-8 pt-4 border-t border-[#EAE4DC]">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#24201C] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#8C5E24] shrink-0" />
                  <span>Unfiltered journaling with auto-title synthesis</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#24201C] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#8C5E24] shrink-0" />
                  <span>Emotional themes &amp; cognitive key insights</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#24201C] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#8C5E24] shrink-0" />
                  <span>Curated thematic book recommendations</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#24201C] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#8C5E24] shrink-0" />
                  <span>Semantic linkages to related past entries</span>
                </div>
              </div>
            </div>

            {/* Action CTA Button */}
            <div className="relative z-10 flex items-center justify-between pt-4 border-t border-[#EAE4DC] text-sm sm:text-base font-bold text-[#1F1D1A] group-hover:text-[#8C5E24] transition-colors">
              <span>Open Reflection Workspace</span>
              <div className="w-9 h-9 rounded-full bg-[#FAF8F5] group-hover:bg-[#8C5E24] text-[#1F1D1A] group-hover:text-white border border-[#E0D8CA] group-hover:border-[#8C5E24] flex items-center justify-center transition-all">
                <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Choice Card 2: Talk it Through */}
          <div
            id="card-mode-dialogue"
            onClick={() => onSelectMode('dialogue')}
            className="group relative rounded-2xl bg-gradient-to-b from-[#FFFFFF]/95 to-[#FAF8F5]/95 backdrop-blur-xs border-2 border-[#E0D8CA] hover:border-[#8C5E24] p-7 sm:p-8 text-left shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1 overflow-hidden"
          >
            {/* Ambient Corner Accent (Lower z-index behind text) */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#F5ECD9]/60 rounded-bl-full pointer-events-none group-hover:bg-[#F5EFE6] transition-colors z-0" />

            <div className="relative z-10">
              {/* Header Badge & Icon */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-[#7A4F1D] to-[#593A12] text-white flex items-center justify-center border border-[#8C5E24] shadow-xs group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-6 h-6 text-[#FAF8F5]" />
                </div>
                <span className="px-3.5 py-1 rounded-full bg-[#FAF8F5] border border-[#DFCBA8] text-[#593A12] text-xs sm:text-sm font-mono font-bold shadow-2xs">
                  Mode 02
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1D1A] group-hover:text-[#8C5E24] transition-colors tracking-tight mb-3">
                Talk it Through
              </h2>

              {/* Explicit Requested Description */}
              <p className="text-sm sm:text-base text-[#3D352E] leading-relaxed font-normal mb-6">
                Think out loud with Sonderly. A real back-and-forth conversation to untangle a problem, weigh a decision, or work through what you're feeling.
              </p>

              {/* Included Capabilities List */}
              <div className="space-y-2.5 mb-8 pt-4 border-t border-[#EAE4DC]">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#24201C] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#8C5E24] shrink-0" />
                  <span>Real-time multi-turn back-and-forth dialogue</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#24201C] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#8C5E24] shrink-0" />
                  <span>Deep Inquiry, Brainstorm, &amp; Socratic modes</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#24201C] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#8C5E24] shrink-0" />
                  <span>Interactive problem unblocking &amp; reframing</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#24201C] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#8C5E24] shrink-0" />
                  <span>Full conversation history saved with your thoughts</span>
                </div>
              </div>
            </div>

            {/* Action CTA Button */}
            <div className="relative z-10 flex items-center justify-between pt-4 border-t border-[#EAE4DC] text-sm sm:text-base font-bold text-[#1F1D1A] group-hover:text-[#8C5E24] transition-colors">
              <span>Begin Socratic Conversation</span>
              <div className="w-9 h-9 rounded-full bg-[#FAF8F5] group-hover:bg-[#8C5E24] text-[#1F1D1A] group-hover:text-white border border-[#E0D8CA] group-hover:border-[#8C5E24] flex items-center justify-center transition-all">
                <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Choice Card 3: Ask Your Past Self */}
          <div
            id="card-mode-ask"
            onClick={onNavigateToAsk}
            className="group relative rounded-2xl bg-gradient-to-b from-[#FFFFFF]/95 to-[#FAF8F5]/95 backdrop-blur-xs border-2 border-[#E0D8CA] hover:border-[#8C5E24] p-7 sm:p-8 text-left shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1 overflow-hidden"
          >
            {/* Ambient Corner Accent (Lower z-index behind text) */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#F5EFE6]/60 rounded-bl-full pointer-events-none group-hover:bg-[#F5ECD9] transition-colors z-0" />

            <div className="relative z-10">
              {/* Header Badge & Icon */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-[#3D3126] to-[#241E18] text-white flex items-center justify-center border border-[#423A31] shadow-xs group-hover:scale-105 transition-transform">
                  <Search className="w-6 h-6 text-[#E5C287]" />
                </div>
                <span className="px-3.5 py-1 rounded-full bg-[#FAF8F5] border border-[#DFCBA8] text-[#593A12] text-xs sm:text-sm font-mono font-bold shadow-2xs">
                  Mode 03
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1D1A] group-hover:text-[#8C5E24] transition-colors tracking-tight mb-3">
                Ask Your Past Self
              </h2>

              {/* Explicit Requested Description */}
              <p className="text-sm sm:text-base text-[#3D352E] leading-relaxed font-normal mb-6">
                Ask questions about your own journaling history and get answers grounded in your real past entries — with the sources shown.
              </p>

              {/* Included Capabilities List */}
              <div className="space-y-2.5 mb-8 pt-4 border-t border-[#EAE4DC]">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#24201C] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#8C5E24] shrink-0" />
                  <span>Retrieval-augmented answers from your entries</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#24201C] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#8C5E24] shrink-0" />
                  <span>Sources cited from your real reflections</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#24201C] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#8C5E24] shrink-0" />
                  <span>Honest when a topic hasn't come up</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#24201C] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#8C5E24] shrink-0" />
                  <span>Semantic search across your history</span>
                </div>
              </div>
            </div>

            {/* Action CTA Button */}
            <div className="relative z-10 flex items-center justify-between pt-4 border-t border-[#EAE4DC] text-sm sm:text-base font-bold text-[#1F1D1A] group-hover:text-[#8C5E24] transition-colors">
              <span>Explore Your History</span>
              <div className="w-9 h-9 rounded-full bg-[#FAF8F5] group-hover:bg-[#8C5E24] text-[#1F1D1A] group-hover:text-white border border-[#E0D8CA] group-hover:border-[#8C5E24] flex items-center justify-center transition-all">
                <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

        </div>

        {/* Quick Context & Past Journal Shortcuts Bar */}
        <div className="max-w-4xl mx-auto w-full p-4 sm:p-5 rounded-2xl bg-[#FFFFFF]/95 backdrop-blur-xs border border-[#E0D8CA] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-[#F5EFE6] text-[#593A12] flex items-center justify-center border border-[#DFCBA8] shrink-0">
              <BookOpen className="w-4.5 h-4.5 text-[#8C5E24]" />
            </div>
            <div>
              <p className="font-bold text-[#1F1D1A]">
                {entries.length === 0 
                  ? 'Your journal is ready for your first reflection' 
                  : `${entries.length} reflection${entries.length === 1 ? '' : 's'} stored in your private vault`}
              </p>
              {recentEntry && (
                <p className="text-[#3D352E] truncate max-w-sm sm:max-w-md font-semibold mt-0.5">
                  Latest: "{recentEntry.title || 'Untitled reflection'}" &bull; {new Date(recentEntry.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {entries.length > 0 && (
              <>
                <button
                  onClick={onNavigateToHistory}
                  className="px-3.5 py-2 rounded-lg bg-[#FAF8F5] hover:bg-[#F5EFE6] text-[#2A241F] hover:text-[#000000] font-bold border border-[#E0D8CA] transition-colors cursor-pointer flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-[#8C5E24]" />
                  <span>Past Entries</span>
                </button>
                <button
                  onClick={onNavigateToAsk}
                  className="px-3.5 py-2 rounded-lg bg-[#FAF8F5] hover:bg-[#F5EFE6] text-[#2A241F] hover:text-[#000000] font-bold border border-[#E0D8CA] transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-[#8C5E24]" />
                  <span>Ask Past Self</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Subtle Footer Note */}
      <div className="relative z-10 max-w-5xl mx-auto w-full mt-8 text-center text-xs sm:text-sm text-[#3D352E] font-semibold">
        <span>All reflections &amp; dialogues are securely isolated to your account via Firestore rules.</span>
      </div>

    </div>
  );
};
