import React from 'react';
import { 
  PenTool, 
  MessageSquare, 
  BookOpen, 
  Compass, 
  GitFork, 
  Sparkles, 
  Bookmark,
  Search, 
  ShieldCheck,
  CheckCircle2,
  Library
} from 'lucide-react';

interface FeatureItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  visualType: 'modes' | 'books' | 'rag' | 'connected';
  accentColor: string;
}

const FEATURES: FeatureItem[] = [
  {
    id: 'modes',
    badge: 'Cognitive Agility',
    title: 'Two Ways to Think',
    description: 'Choose your mode: pour out your thoughts and get an AI synthesis with themes, or have a real back-and-forth conversation to work something through.',
    visualType: 'modes',
    accentColor: '#8C5E24',
  },
  {
    id: 'books',
    badge: 'Curated Intelligence',
    title: 'Books That Meet You Where You Are',
    description: 'Sonderly reads the themes in your reflections and recommends real books that might genuinely help — with covers, right in your entry.',
    visualType: 'books',
    accentColor: '#7A4F1D',
  },
  {
    id: 'rag',
    badge: 'Semantic Retrieval',
    title: 'Ask Your Past Self',
    description: 'Ask questions about your own journaling history and get answers grounded in your real past entries, with the sources shown.',
    visualType: 'rag',
    accentColor: '#8C5E24',
  },
  {
    id: 'connected',
    badge: 'Synthesized Memory',
    title: 'Your Reflections, Connected',
    description: 'Sonderly automatically surfaces related past reflections, so you can see how your thinking evolves over time.',
    visualType: 'connected',
    accentColor: '#7A4F1D',
  },
];

export const FeatureShowcase: React.FC = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto mt-16 mb-24 px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF8F5] border border-[#DFCBA8] text-[#593A12] text-xs sm:text-sm font-bold mb-3.5 shadow-2xs">
          <Sparkles className="w-4 h-4 text-[#8C5E24]" />
          <span>Thought Architecture</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#1F1D1A] tracking-tight">
          Crafted for how the mind actually reflects
        </h2>
        <p className="text-sm sm:text-base text-[#24201C] mt-3 font-normal">
          Every capability is built around depth, continuity, and structured understanding.
        </p>
      </div>

      {/* Alternating Feature Rows */}
      <div className="space-y-16 sm:space-y-24">
        {FEATURES.map((feature, index) => {
          const isReversed = index % 2 !== 0;

          return (
            <div
              key={feature.id}
              className={`flex flex-col ${
                isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
              } items-center gap-8 lg:gap-14`}
            >
              {/* Text Column */}
              <div className="w-full lg:w-1/2 text-left space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5EFE6] border border-[#DFCBA8] text-[#593A12] text-xs sm:text-sm font-mono font-bold">
                  <span>0{index + 1}</span>
                  <span className="text-[#8C5E24]">•</span>
                  <span>{feature.badge}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1D1A] tracking-tight leading-snug">
                  {feature.title}
                </h3>

                <p className="text-base sm:text-lg text-[#24201C] leading-relaxed font-normal">
                  {feature.description}
                </p>

                {/* Subtle reassurance / attribute */}
                <div className="pt-2 flex items-center gap-2 text-xs sm:text-sm font-bold text-[#593A12]">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#8C5E24] shrink-0" />
                  <span>
                    {feature.id === 'modes' && 'Seamless mode switching with preserved state'}
                    {feature.id === 'books' && 'High-signal literature contextualized to your entry'}
                    {feature.id === 'rag' && 'Grounded RAG retrieval with exact citation dates'}
                    {feature.id === 'connected' && 'Vector-embedded similarity linking past & present'}
                  </span>
                </div>
              </div>

              {/* Visual / Graphic Column */}
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-2xl bg-gradient-to-b from-[#FFFFFF] to-[#FAF8F5] border border-[#E0D8CA] p-5 sm:p-7 shadow-xs hover:shadow-sm transition-all duration-300 overflow-hidden group">
                  
                  {/* Subtle Background Accent Glow */}
                  <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#F5ECD9]/50 rounded-full blur-2xl pointer-events-none" />

                  {/* Render tailored visual based on visualType */}
                  {feature.visualType === 'modes' && <ModesVisual />}
                  {feature.visualType === 'books' && <BooksVisual />}
                  {feature.visualType === 'rag' && <RagVisual />}
                  {feature.visualType === 'connected' && <ConnectedVisual />}

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Privacy & Security Assurance Banner */}
      <div className="mt-20 sm:mt-28 p-6 rounded-2xl bg-[#FFFFFF]/95 backdrop-blur-xs border border-[#E0D8CA] flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F5EFE6] text-[#593A12] flex items-center justify-center border border-[#DFCBA8] shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#8C5E24]" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-serif font-bold text-[#1F1D1A]">
              Owner-Isolated &bull; Built on Firebase Security
            </h4>
            <p className="text-xs sm:text-sm text-[#24201C] mt-0.5 font-medium">
              Strict per-user document isolation, federated Google Auth, and server-side secret management.
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#DFCBA8] text-xs font-mono font-bold text-[#593A12] shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#8C5E24]" />
          <span>Zero Insecure Defaults</span>
        </div>
      </div>

    </div>
  );
};

/* --- Visual 1: Two Ways to Think --- */
const ModesVisual: React.FC = () => (
  <div className="space-y-3.5 select-none">
    {/* Mode 1 Card: Unfiltered Pour + Synthesis */}
    <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#DFCBA8] flex items-start gap-3.5 shadow-2xs">
      <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] text-[#593A12] flex items-center justify-center border border-[#DFCBA8] shrink-0">
        <PenTool className="w-4.5 h-4.5 text-[#8C5E24]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-serif font-bold text-[#1F1D1A]">Unfiltered Flow</span>
          <span className="text-xs font-mono font-bold text-[#593A12] bg-[#F5EFE6] px-2 py-0.5 rounded border border-[#DFCBA8]">Synthesis</span>
        </div>
        <p className="text-xs sm:text-sm text-[#24201C] mt-1 line-clamp-1 font-semibold">
          "Felt torn between two architectural paths today..."
        </p>
        <div className="mt-2.5 flex items-center gap-2">
          <span className="text-xs bg-[#FAF8F5] text-[#593A12] border border-[#DFCBA8] px-2.5 py-0.5 rounded font-bold">#decision-fatigue</span>
          <span className="text-xs bg-[#FAF8F5] text-[#593A12] border border-[#DFCBA8] px-2.5 py-0.5 rounded font-bold">#clarity</span>
        </div>
      </div>
    </div>

    {/* Mode 2 Card: Socratic Back-and-Forth Dialogue */}
    <div className="p-4 rounded-xl bg-[#FAF8F5] border-2 border-[#8C5E24]/60 flex items-start gap-3.5 shadow-2xs ring-1 ring-[#8C5E24]/20">
      <div className="w-9 h-9 rounded-lg bg-[#F5EFE6] text-[#593A12] flex items-center justify-center border border-[#DFCBA8] shrink-0">
        <MessageSquare className="w-4.5 h-4.5 text-[#8C5E24]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-serif font-bold text-[#1F1D1A]">Socratic Dialogue</span>
          <span className="text-xs font-mono font-bold text-[#593A12] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#DFCBA8]">Active Inquiry</span>
        </div>
        <p className="text-xs sm:text-sm text-[#1F1D1A] mt-1 font-bold">
          "What core assumption would change if you inverted that constraint?"
        </p>
        <p className="text-xs text-[#593A12] mt-1.5 font-semibold">
          Multi-turn exploration powered by Gemini
        </p>
      </div>
    </div>
  </div>
);

/* --- Visual 2: Books That Meet You Where You Are (Clean, elegant icon-and-spine aesthetic) --- */
const BooksVisual: React.FC = () => (
  <div className="space-y-3.5 select-none">
    <div className="flex items-center justify-between text-xs sm:text-sm pb-2 border-b border-[#EAE4DC]">
      <div className="flex items-center gap-2 text-[#1F1D1A] font-serif font-bold">
        <Library className="w-4 h-4 text-[#8C5E24]" />
        <span>Thematic Book Recommendations</span>
      </div>
      <span className="text-xs text-[#593A12] font-mono font-bold bg-[#F5EFE6] px-2 py-0.5 rounded border border-[#DFCBA8]">
        Theme Matched
      </span>
    </div>

    {/* Book Item 1 */}
    <div className="p-3.5 sm:p-4 rounded-xl bg-[#FFFFFF] border border-[#DFCBA8] flex items-start gap-3.5 shadow-2xs hover:border-[#8C5E24] transition-colors">
      <div className="w-10 h-12 rounded-lg bg-gradient-to-b from-[#2A241F] to-[#1F1D1A] flex items-center justify-center text-[#E5C287] border border-[#423A31] shadow-2xs shrink-0 mt-0.5">
        <BookOpen className="w-5 h-5 text-[#D4A359]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <h4 className="text-xs sm:text-sm font-serif font-bold text-[#1F1D1A] truncate">Thinking, Fast and Slow</h4>
          <span className="text-xs text-[#3D352E] font-mono font-semibold shrink-0">D. Kahneman</span>
        </div>
        <p className="text-xs sm:text-sm text-[#24201C] mt-0.5 leading-snug font-medium">
          Examines dual-system cognitive biases &amp; intuition
        </p>
        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#F5EFE6] border border-[#DFCBA8] text-xs font-bold text-[#593A12]">
          <Bookmark className="w-3 h-3 text-[#8C5E24]" />
          <span>Surfaced for: Cognitive overload &amp; decision fatigue</span>
        </div>
      </div>
    </div>

    {/* Book Item 2 */}
    <div className="p-3.5 sm:p-4 rounded-xl bg-[#FAF8F5] border border-[#DFCBA8] flex items-start gap-3.5 shadow-2xs hover:border-[#8C5E24] transition-colors">
      <div className="w-10 h-12 rounded-lg bg-gradient-to-b from-[#7A4F1D] to-[#593A12] flex items-center justify-center text-[#FAF8F5] border border-[#8C5E24] shadow-2xs shrink-0 mt-0.5">
        <BookOpen className="w-5 h-5 text-[#FAF8F5]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <h4 className="text-xs sm:text-sm font-serif font-bold text-[#1F1D1A] truncate">Deep Work</h4>
          <span className="text-xs text-[#3D352E] font-mono font-semibold shrink-0">Cal Newport</span>
        </div>
        <p className="text-xs sm:text-sm text-[#24201C] mt-0.5 leading-snug font-medium">
          Rules for focused success in a distracted world
        </p>
        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#FFFFFF] border border-[#DFCBA8] text-xs font-bold text-[#593A12]">
          <Bookmark className="w-3 h-3 text-[#8C5E24]" />
          <span>Surfaced for: Focus discipline &amp; distraction</span>
        </div>
      </div>
    </div>
  </div>
);

/* --- Visual 3: Ask Your Past Self (RAG) --- */
const RagVisual: React.FC = () => (
  <div className="space-y-3.5 select-none">
    {/* Question Input Pill */}
    <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#DFCBA8] flex items-center gap-2.5 shadow-2xs">
      <Search className="w-4 h-4 text-[#8C5E24] shrink-0" />
      <span className="text-xs sm:text-sm text-[#1F1D1A] font-bold truncate">
        "When did I first realize my creative block was just exhaustion?"
      </span>
    </div>

    {/* Grounded RAG Synthesis Box */}
    <div className="p-4 rounded-xl bg-[#FAF8F5] border-2 border-[#8C5E24]/60 shadow-2xs ring-1 ring-[#8C5E24]/15">
      <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#593A12] mb-2">
        <Sparkles className="w-3.5 h-3.5 text-[#8C5E24]" />
        <span>Grounded Answer from 3 Journal Entries</span>
      </div>
      <p className="text-xs sm:text-sm text-[#1F1D1A] leading-relaxed font-semibold">
        "You first articulated this on <span className="font-bold underline decoration-[#8C5E24]">March 14</span>, noting that stepping away for 48 hours restored your clarity faster than forcing output."
      </p>
      <div className="mt-3 pt-2.5 border-t border-[#EAE4DC] flex items-center gap-2">
        <span className="text-xs font-mono font-bold bg-[#FFFFFF] border border-[#DFCBA8] text-[#593A12] px-2.5 py-0.5 rounded shadow-2xs">
          Source: Entry #12 &bull; March 14, 2026
        </span>
        <span className="text-xs font-mono font-bold bg-[#FFFFFF] border border-[#DFCBA8] text-[#593A12] px-2.5 py-0.5 rounded shadow-2xs">
          Entry #19
        </span>
      </div>
    </div>
  </div>
);

/* --- Visual 4: Your Reflections, Connected --- */
const ConnectedVisual: React.FC = () => (
  <div className="space-y-3 select-none">
    <div className="flex items-center justify-between text-xs sm:text-sm pb-2 border-b border-[#EAE4DC]">
      <span className="font-serif font-bold text-[#1F1D1A]">Semantic Association Network</span>
      <span className="text-xs text-[#593A12] font-mono font-bold bg-[#F5EFE6] px-2 py-0.5 rounded border border-[#DFCBA8]">
        94% Similarity
      </span>
    </div>

    {/* Current Reflection */}
    <div className="p-3.5 rounded-xl bg-[#FFFFFF] border-2 border-[#8C5E24]/50 flex items-start gap-3 shadow-2xs">
      <div className="w-3 h-3 rounded-full bg-[#8C5E24] mt-1 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-serif font-bold text-[#1F1D1A]">Today's Reflection</span>
          <span className="text-xs text-[#3D352E] font-semibold">Active Entry</span>
        </div>
        <p className="text-xs sm:text-sm text-[#24201C] mt-1 truncate font-semibold">
          Navigating delegation and letting go of micro-control in product architecture.
        </p>
      </div>
    </div>

    {/* Connected Past Reflection with connecting link */}
    <div className="pl-4 border-l-2 border-dashed border-[#8C5E24]/60 ml-3.5 space-y-2">
      <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#DFCBA8] flex items-start gap-2.5 shadow-2xs">
        <GitFork className="w-4 h-4 text-[#7A4F1D] mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-serif font-bold text-[#1F1D1A]">Related Past Entry</span>
            <span className="text-xs font-mono font-bold text-[#593A12] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#DFCBA8]">3 months ago</span>
          </div>
          <p className="text-xs sm:text-sm text-[#24201C] mt-1 truncate font-semibold">
            "Why trust is the precursor to leverage: reflections on team autonomy."
          </p>
        </div>
      </div>
    </div>
  </div>
);
