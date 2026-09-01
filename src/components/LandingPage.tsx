import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { ElegantFlowingRibbons } from './ElegantFlowingRibbons';
import { FeatureShowcase } from './FeatureShowcase';

interface LandingPageProps {
  onSignIn: () => void;
  isLoading: boolean;
  errorMessage?: string | null;
  onOpenThreatModel: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSignIn,
  isLoading,
  errorMessage,
  onOpenThreatModel,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#FBF9F4] text-[#1F1D1A] flex flex-col justify-between overflow-hidden">
      
      {/* Background Layer: Dense, elegant horizontal flowing ribbon curves */}
      <ElegantFlowingRibbons />

      {/* Main Hero Content Section */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center flex-1 flex flex-col justify-center">
        
        {/* Security & Intelligence Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFFFF]/95 backdrop-blur-xs border border-[#DFCBA8] text-[#593A12] text-xs sm:text-sm font-bold mb-8 shadow-xs mx-auto">
          <Sparkles className="w-4 h-4 text-[#8C5E24]" />
          <span>Intelligent Thinking Companion &bull; Powered by Gemini</span>
          <span className="text-[#8C5E24]">•</span>
          <button 
            onClick={onOpenThreatModel} 
            className="text-[#1F1D1A] hover:text-[#8C5E24] underline underline-offset-2 font-bold cursor-pointer transition-colors"
          >
            Security Specs
          </button>
        </div>

        {/* Sophisticated Display Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-[#1F1D1A] mb-6 leading-[1.12] max-w-3xl mx-auto">
          Untangle complex thoughts. <br className="hidden sm:inline" />
          <span className="text-[#8C5E24]">
            Gain enduring clarity.
          </span>
        </h1>

        {/* Subtitle / Value proposition */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg lg:text-xl text-[#24201C] mb-10 leading-relaxed font-normal">
          A private, structured thinking environment where deep inquiry meets cognitive synthesis. Transform scattered insights into coherent understanding with grounded memory.
        </p>

        {/* Error notification if sign in fails */}
        {errorMessage && (
          <div className="max-w-md mx-auto mb-6 p-4 rounded-xl bg-[#FDF3F0] border border-[#FADCD5] text-[#9E4733] text-sm sm:text-base text-left shadow-xs">
            <p className="font-bold mb-1">Authentication Notice</p>
            <p className="text-xs sm:text-sm text-[#9E4733]">{errorMessage}</p>
          </div>
        )}

        {/* High-Contrast Prominent CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-8">
          <div className="relative group w-full sm:w-auto">
            
            {/* Ambient Bronze Hover Glow */}
            <div className="pointer-events-none absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-[#D4A359]/20 via-[#B88746]/40 to-[#A37438]/20 opacity-0 group-hover:opacity-100 blur-md transition-all duration-400 ease-out" />

            <button
              id="btn-google-signin"
              onClick={onSignIn}
              disabled={isLoading}
              className="relative w-full sm:w-auto flex items-center justify-center gap-3 px-9 py-4 rounded-xl font-bold bg-[#2A241F] hover:bg-[#1F1B17] text-white shadow-sm hover:shadow-md transition-all duration-300 transform active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg cursor-pointer border border-[#423A31]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span className="tracking-wide">Sign In with Google</span>
              <ArrowRight className="w-5 h-5 text-[#E5C287] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Feature Showcase: Alternating Editorial Layout of Sonderly's Unique Capabilities */}
        <FeatureShowcase />

      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#EAE4DC] py-6 text-center text-xs sm:text-sm text-[#3D352E] bg-[#FFFFFF]/90 backdrop-blur-xs font-semibold">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Intelligent companion for personal clarity &amp; structured thought</span>
          <span>Sonderly &copy; {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
};
