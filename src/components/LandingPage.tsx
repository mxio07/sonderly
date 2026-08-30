import React from 'react';
import { Shield, Lock, Brain, MessageSquare, Sparkles } from 'lucide-react';

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
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#FAF9F6] text-[#242220] flex flex-col justify-between overflow-hidden">
      
      {/* Ambient Botanical & Firefly Atmosphere Layer (Hanging Vines Frame & Fireflies) */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
      >
        {/* ========================================================================= */}
        {/* TOP HANGING BOTANICAL VINES — CASCADING DOWNWARD (LEFT & RIGHT FRAMING) */}
        {/* ========================================================================= */}

        {/* ------------------- LEFT FLANK HANGING VINES (5 Total) ------------------- */}

        {/* Left Vine 1: Very Outer Curtaining Ivy (Extreme left edge) */}
        <div className="absolute -top-4 -left-4 sm:left-0 w-64 sm:w-80 h-[500px] pointer-events-none opacity-40 animate-hanging-sway-left">
          <svg className="w-full h-full text-[#638466]" viewBox="0 0 240 480" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 30,-10 C 15,80 50,160 25,250 C 0,330 40,400 20,470"
              stroke="#638466"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.65"
            />
            <g className="animate-leaf-flutter-2" style={{ transformOrigin: '25px 40px' }}>
              <path d="M 25,40 C 10,35 5,18 18,12 C 30,8 35,28 25,40 Z" fill="#8CA58E" opacity="0.75" />
            </g>
            <g className="animate-leaf-flutter-1" style={{ transformOrigin: '30px 85px' }}>
              <path d="M 30,85 C 50,78 60,60 48,52 C 35,45 28,68 30,85 Z" fill="#638466" opacity="0.65" />
            </g>
            <g className="animate-leaf-flutter-3" style={{ transformOrigin: '40px 140px' }}>
              <path d="M 40,140 C 20,132 15,115 28,108 C 42,102 48,122 40,140 Z" fill="#8CA58E" opacity="0.75" />
            </g>
            <g className="animate-leaf-flutter-2" style={{ transformOrigin: '32px 195px' }}>
              <path d="M 32,195 C 52,188 62,170 48,162 C 35,155 28,178 32,195 Z" fill="#638466" opacity="0.65" />
            </g>
            <g className="animate-leaf-flutter-1" style={{ transformOrigin: '20px 255px' }}>
              <path d="M 20,255 C 2,248 -5,230 8,222 C 22,216 28,238 20,255 Z" fill="#8CA58E" opacity="0.7" />
            </g>
            <g className="animate-leaf-flutter-3" style={{ transformOrigin: '22px 315px' }}>
              <path d="M 22,315 C 42,308 50,290 38,282 C 25,275 18,298 22,315 Z" fill="#638466" opacity="0.6" />
            </g>
            <g className="animate-leaf-flutter-2" style={{ transformOrigin: '30px 375px' }}>
              <path d="M 30,375 C 12,368 6,350 18,342 C 32,336 38,358 30,375 Z" fill="#8CA58E" opacity="0.7" />
            </g>
            <g className="animate-leaf-flutter-1" style={{ transformOrigin: '22px 430px' }}>
              <path d="M 22,430 C 40,422 46,405 35,398 C 24,392 18,412 22,430 Z" fill="#638466" opacity="0.55" />
            </g>
            <circle cx="20" cy="470" r="3.5" fill="#8CA58E" opacity="0.6" />
          </svg>
        </div>

        {/* Left Vine 2: Main Long Trailing Eucalyptus Vine (Cascading) */}
        <div className="absolute -top-3 left-4 sm:left-10 w-72 sm:w-88 h-[560px] pointer-events-none opacity-45 animate-hanging-sway-left">
          <svg className="w-full h-full text-[#638466]" viewBox="0 0 260 520" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 60,-10 C 50,80 95,170 70,260 C 45,340 80,420 65,510"
              stroke="#638466"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.65"
            />
            <g className="animate-leaf-flutter-1" style={{ transformOrigin: '55px 45px' }}>
              <ellipse cx="40" cy="40" rx="15" ry="10" transform="rotate(-30 40 40)" fill="#8CA58E" opacity="0.75" />
            </g>
            <g className="animate-leaf-flutter-2" style={{ transformOrigin: '65px 70px' }}>
              <ellipse cx="80" cy="65" rx="16" ry="11" transform="rotate(35 80 65)" fill="#638466" opacity="0.65" />
            </g>
            <g className="animate-leaf-flutter-3" style={{ transformOrigin: '78px 120px' }}>
              <ellipse cx="60" cy="115" rx="17" ry="11" transform="rotate(-25 60 115)" fill="#8CA58E" opacity="0.75" />
            </g>
            <g className="animate-leaf-flutter-1" style={{ transformOrigin: '88px 155px' }}>
              <ellipse cx="110" cy="150" rx="16" ry="10" transform="rotate(30 110 150)" fill="#638466" opacity="0.65" />
            </g>
            <g className="animate-leaf-flutter-2" style={{ transformOrigin: '82px 205px' }}>
              <ellipse cx="65" cy="200" rx="15" ry="10" transform="rotate(-35 65 200)" fill="#8CA58E" opacity="0.7" />
            </g>
            <g className="animate-leaf-flutter-3" style={{ transformOrigin: '72px 250px' }}>
              <ellipse cx="95" cy="245" rx="15" ry="9" transform="rotate(25 95 245)" fill="#638466" opacity="0.6" />
            </g>
            <g className="animate-leaf-flutter-1" style={{ transformOrigin: '55px 300px' }}>
              <ellipse cx="40" cy="295" rx="14" ry="9" transform="rotate(-20 40 295)" fill="#8CA58E" opacity="0.7" />
            </g>
            <g className="animate-leaf-flutter-2" style={{ transformOrigin: '65px 350px' }}>
              <ellipse cx="85" cy="345" rx="13" ry="8" transform="rotate(35 85 345)" fill="#638466" opacity="0.6" />
            </g>
            <g className="animate-leaf-flutter-3" style={{ transformOrigin: '75px 410px' }}>
              <ellipse cx="60" cy="405" rx="12" ry="8" transform="rotate(-30 60 405)" fill="#8CA58E" opacity="0.65" />
            </g>
            <g className="animate-leaf-flutter-1" style={{ transformOrigin: '70px 465px' }}>
              <ellipse cx="85" cy="460" rx="11" ry="7" transform="rotate(20 85 460)" fill="#638466" opacity="0.55" />
            </g>
            <circle cx="65" cy="510" r="3.5" fill="#8CA58E" opacity="0.6" />
          </svg>
        </div>

        {/* Left Vine 3: Delicate Mid-Layer Leaf Sprig Vine */}
        <div className="absolute -top-2 left-14 sm:left-24 w-52 sm:w-64 h-[380px] pointer-events-none opacity-38 animate-hanging-sway-gentle-left" style={{ animationDelay: '1.2s' }}>
          <svg className="w-full h-full text-[#638466]" viewBox="0 0 180 360" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 65,-5 C 50,60 85,130 60,200 C 45,260 70,305 55,350"
              stroke="#638466"
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity="0.6"
            />
            <g className="animate-leaf-flutter-3" style={{ transformOrigin: '58px 45px' }}>
              <circle cx="42" cy="42" r="7" fill="#8CA58E" opacity="0.7" />
            </g>
            <g className="animate-leaf-flutter-1" style={{ transformOrigin: '66px 95px' }}>
              <ellipse cx="84" cy="90" rx="13" ry="8" transform="rotate(25 84 90)" fill="#638466" opacity="0.6" />
            </g>
            <g className="animate-leaf-flutter-2" style={{ transformOrigin: '74px 150px' }}>
              <ellipse cx="52" cy="146" rx="12" ry="7" transform="rotate(-30 52 146)" fill="#8CA58E" opacity="0.7" />
            </g>
            <g className="animate-leaf-flutter-3" style={{ transformOrigin: '60px 210px' }}>
              <ellipse cx="80" cy="205" rx="11" ry="7" transform="rotate(30 80 205)" fill="#638466" opacity="0.6" />
            </g>
            <g className="animate-leaf-flutter-1" style={{ transformOrigin: '52px 270px' }}>
              <ellipse cx="36" cy="265" rx="10" ry="6" transform="rotate(-20 36 265)" fill="#8CA58E" opacity="0.65" />
            </g>
            <g className="animate-leaf-flutter-2" style={{ transformOrigin: '62px 320px' }}>
              <ellipse cx="76" cy="316" rx="9" ry="5.5" transform="rotate(25 76 316)" fill="#638466" opacity="0.55" />
            </g>
            <circle cx="55" cy="350" r="2.8" fill="#8CA58E" opacity="0.5" />
          </svg>
        </div>

        {/* Left Vine 4: Deep Cascading Willow Vine */}
        <div className="absolute -top-2 left-24 sm:left-40 w-56 sm:w-68 h-[430px] pointer-events-none opacity-40 animate-hanging-sway-left-deep">
          <svg className="w-full h-full text-[#638466]" viewBox="0 0 200 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 50,-10 C 65,70 30,150 55,230 C 70,290 40,345 50,390"
              stroke="#638466"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.6"
            />
            <g className="animate-leaf-flutter-2" style={{ transformOrigin: '55px 35px' }}>
              <path d="M 55,35 C 75,28 85,10 70,5 C 55,0 48,22 55,35 Z" fill="#8CA58E" opacity="0.7" />
            </g>
            <g className="animate-leaf-flutter-3" style={{ transformOrigin: '50px 85px' }}>
              <path d="M 50,85 C 30,80 20,60 35,55 C 50,50 58,72 50,85 Z" fill="#638466" opacity="0.6" />
            </g>
            <g className="animate-leaf-flutter-1" style={{ transformOrigin: '40px 145px' }}>
              <path d="M 40,145 C 20,140 12,120 28,115 C 44,110 50,132 40,145 Z" fill="#8CA58E" opacity="0.7" />
            </g>
            <g className="animate-leaf-flutter-2" style={{ transformOrigin: '48px 190px' }}>
              <path d="M 48,190 C 70,185 80,165 65,160 C 50,155 42,175 48,190 Z" fill="#638466" opacity="0.6" />
            </g>
            <g className="animate-leaf-flutter-3" style={{ transformOrigin: '60px 245px' }}>
              <path d="M 60,245 C 80,240 88,220 72,215 C 56,210 50,230 60,245 Z" fill="#8CA58E" opacity="0.65" />
            </g>
            <g className="animate-leaf-flutter-1" style={{ transformOrigin: '55px 305px' }}>
              <path d="M 55,305 C 35,300 28,280 42,275 C 56,270 62,290 55,305 Z" fill="#638466" opacity="0.55" />
            </g>
            <g className="animate-leaf-flutter-2" style={{ transformOrigin: '46px 355px' }}>
              <path d="M 46,355 C 65,350 72,330 58,328 C 44,325 38,342 46,355 Z" fill="#8CA58E" opacity="0.6" />
            </g>
            <circle cx="50" cy="390" r="3" fill="#8CA58E" opacity="0.5" />
          </svg>
        </div>

        {/* Left Vine 5: Soft Inner Tendril Framing Vine */}
        <div className="absolute -top-2 left-36 sm:left-56 w-44 sm:w-56 h-[320px] pointer-events-none opacity-32 animate-hanging-sway-left" style={{ animationDelay: '2.5s' }}>
          <svg className="w-full h-full text-[#638466]" viewBox="0 0 160 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 50,-5 C 35,50 65,110 45,170 C 30,220 50,260 40,295"
              stroke="#638466"
              strokeWidth="1.3"
              strokeLinecap="round"
              opacity="0.55"
            />
            <g className="animate-leaf-flutter-1" style={{ transformOrigin: '44px 45px' }}>
              <ellipse cx="26" cy="40" rx="11" ry="6.5" transform="rotate(-25 26 40)" fill="#8CA58E" opacity="0.65" />
            </g>
            <g className="animate-leaf-flutter-2" style={{ transformOrigin: '52px 95px' }}>
              <ellipse cx="70" cy="90" rx="12" ry="7" transform="rotate(30 70 90)" fill="#638466" opacity="0.55" />
            </g>
            <g className="animate-leaf-flutter-3" style={{ transformOrigin: '55px 150px' }}>
              <ellipse cx="36" cy="146" rx="11" ry="6.5" transform="rotate(-20 36 146)" fill="#8CA58E" opacity="0.65" />
            </g>
            <g className="animate-leaf-flutter-1" style={{ transformOrigin: '38px 210px' }}>
              <ellipse cx="58" cy="205" rx="10" ry="6" transform="rotate(25 58 205)" fill="#638466" opacity="0.55" />
            </g>
            <g className="animate-leaf-flutter-2" style={{ transformOrigin: '45px 265px' }}>
              <ellipse cx="28" cy="260" rx="9" ry="5" transform="rotate(-15 28 260)" fill="#8CA58E" opacity="0.6" />
            </g>
            <circle cx="40" cy="295" r="2.5" fill="#8CA58E" opacity="0.5" />
          </svg>
        </div>


        {/* ------------------- RIGHT FLANK HANGING VINES (5 Total) ------------------- */}

        {/* Right Vine 1: Very Outer Curtaining Ivy (Extreme right edge) */}
        <div className="absolute -top-4 -right-4 sm:right-0 w-64 sm:w-80 h-[500px] pointer-events-none opacity-40 animate-hanging-sway-right">
          <svg className="w-full h-full text-[#638466]" viewBox="0 0 240 480" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 210,-10 C 225,80 190,160 215,250 C 240,330 200,400 220,470"
              stroke="#638466"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.65"
            />
            <g className="animate-leaf-flutter-2" style={{ transformOrigin: '215px 40px' }}>
              <path d="M 215,40 C 230,35 235,18 222,12 C 210,8 205,28 215,40 Z" fill="#8CA58E" opacity="0.75" />
            </g>
            <g className="animate-leaf-flutter-1" style={{ transformOrigin: '210px 85px' }}>
              <path d="M 210,85 C 190,78 180,60 192,52 C 205,45 212,68 210,85 Z" fill="#638466" opacity="0.65" />
            </g>
            <g className="animate-leaf-flutter-3" style={{ transformOrigin: '200px 140px' }}>
              <path d="M 200,140 C 220,132 225,115 212,108 C 198,102 192,122 200,140 Z" fill="#8CA58E" opacity="0.75" />
            </g>
            <g className="animate-leaf-flutter-2" style={{ transformOrigin: '208px 195px' }}>
              <path d="M 208,195 C 188,188 178,170 192,162 C 205,155 212,178 208,195 Z" fill="#638466" opacity="0.65" />
            </g>
            <g className="animate-leaf-flutter-1" style={{ transformOrigin: '220px 255px' }}>
              <path d="M 220,255 C 238,248 245,230 232,222 C 218,216 212,238 220,255 Z" fill="#8CA58E" opacity="0.7" />
            </g>
            <g className="animate-leaf-flutter-3" style={{ transformOrigin: '218px 315px' }}>
              <path d="M 218,315 C 198,308 190,290 202,282 C 215,275 222,298 218,315 Z" fill="#638466" opacity="0.6" />
            </g>
            <g className="animate-leaf-flutter-2" style={{ transformOrigin: '210px 375px' }}>
              <path d="M 210,375 C 228,368 234,350 222,342 C 208,336 202,358 210,375 Z" fill="#8CA58E" opacity="0.7" />
            </g>
            <g className="animate-leaf-flutter-1" style={{ transformOrigin: '218px 430px' }}>
              <path d="M 218,430 C 200,422 194,405 205,398 C 216,392 222,412 218,430 Z" fill="#638466" opacity="0.55" />
            </g>
            <circle cx="220" cy="470" r="3.5" fill="#8CA58E" opacity="0.6" />
          </svg>
        </div>

        {/* Right Vine 2: Main Long Trailing Eucalyptus Vine (Cascading) */}
        <div className="absolute -top-3 right-4 sm:right-10 w-72 sm:w-88 h-[560px] pointer-events-none opacity-45 animate-hanging-sway-right">
          <svg className="w-full h-full text-[#638466]" viewBox="0 0 260 520" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 200,-10 C 210,80 165,170 190,260 C 215,340 180,420 195,510"
              stroke="#638466"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.65"
            />
            <g className="animate-leaf-flutter-1" style={{ transformOrigin: '205px 45px' }}>
              <ellipse cx="220" cy="40" rx="15" ry="10" transform="rotate(30 220 40)" fill="#8CA58E" opacity="0.75" />
            </g>
            <g className="animate-leaf-flutter-3" style={{ transformOrigin: '195px 70px' }}>
              <ellipse cx="180" cy="65" rx="16" ry="11" transform="rotate(-35 180 65)" fill="#638466" opacity="0.65" />
            </g>
            <g className="animate-leaf-flutter-2" style={{ transformOrigin: '182px 120px' }}>
              <ellipse cx="200" cy="115" rx="17" ry="11" transform="rotate(25 200 115)" fill="#8CA58E" opacity="0.75" />
            </g>
            <g className="animate-leaf-flutter-1" style={{ transformOrigin: '172px 155px' }}>
              <ellipse cx="150" cy="150" rx="16" ry="10" transform="rotate(-30 150 150)" fill="#638466" opacity="0.65" />
            </g>
            <g className="animate-leaf-flutter-3" style={{ transformOrigin: '178px 205px' }}>
              <ellipse cx="195" cy="200" rx="15" ry="10" transform="rotate(35 195 200)" fill="#8CA58E" opacity="0.7" />
            </g>
            <g className="animate-leaf-flutter-2" style={{ transformOrigin: '188px 250px' }}>
              <ellipse cx="165" cy="245" rx="15" ry="9" transform="rotate(-25 165 245)" fill="#638466" opacity="0.6" />
            </g>
            <g className="animate-leaf-flutter-1" style={{ transformOrigin: '205px 300px' }}>
              <ellipse cx="220" cy="295" rx="14" ry="9" transform="rotate(20 220 295)" fill="#8CA58E" opacity="0.7" />
            </g>
            <g className="animate-leaf-flutter-3" style={{ transformOrigin: '195px 350px' }}>
              <ellipse cx="175" cy="345" rx="13" ry="8" transform="rotate(-35 175 345)" fill="#638466" opacity="0.6" />
            </g>
            <g className="animate-leaf-flutter-2" style={{ transformOrigin: '185px 410px' }}>
              <ellipse cx="200" cy="405" rx="12" ry="8" transform="rotate(30 200 405)" fill="#8CA58E" opacity="0.65" />
            </g>
            <g className="animate-leaf-flutter-1" style={{ transformOrigin: '190px 465px' }}>
              <ellipse cx="175" cy="460" rx="11" ry="7" transform="rotate(-20 175 460)" fill="#638466" opacity="0.55" />
            </g>
            <circle cx="195" cy="510" r="3.5" fill="#8CA58E" opacity="0.6" />
          </svg>
        </div>

        {/* Right Vine 3: Delicate Mid-Layer Leaf Sprig Vine */}
        <div className="absolute -top-2 right-14 sm:right-24 w-52 sm:w-64 h-[380px] pointer-events-none opacity-38 animate-hanging-sway-gentle-right" style={{ animationDelay: '1.4s' }}>
          <svg className="w-full h-full text-[#638466]" viewBox="0 0 180 360" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 115,-5 C 130,60 95,130 120,200 C 135,260 110,305 125,350"
              stroke="#638466"
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity="0.6"
            />
            <g className="animate-leaf-flutter-3" style={{ transformOrigin: '122px 45px' }}>
              <circle cx="138" cy="42" r="7" fill="#8CA58E" opacity="0.7" />
            </g>
            <g className="animate-leaf-flutter-1" style={{ transformOrigin: '114px 95px' }}>
              <ellipse cx="96" cy="90" rx="13" ry="8" transform="rotate(-25 96 90)" fill="#638466" opacity="0.6" />
            </g>
            <g className="animate-leaf-flutter-2" style={{ transformOrigin: '106px 150px' }}>
              <ellipse cx="128" cy="146" rx="12" ry="7" transform="rotate(30 128 146)" fill="#8CA58E" opacity="0.7" />
            </g>
            <g className="animate-leaf-flutter-3" style={{ transformOrigin: '120px 210px' }}>
              <ellipse cx="100" cy="205" rx="11" ry="7" transform="rotate(-30 100 205)" fill="#638466" opacity="0.6" />
            </g>
            <g className="animate-leaf-flutter-1" style={{ transformOrigin: '128px 270px' }}>
              <ellipse cx="144" cy="265" rx="10" ry="6" transform="rotate(20 144 265)" fill="#8CA58E" opacity="0.65" />
            </g>
            <g className="animate-leaf-flutter-2" style={{ transformOrigin: '118px 320px' }}>
              <ellipse cx="104" cy="316" rx="9" ry="5.5" transform="rotate(-25 104 316)" fill="#638466" opacity="0.55" />
            </g>
            <circle cx="125" cy="350" r="2.8" fill="#8CA58E" opacity="0.5" />
          </svg>
        </div>

        {/* Right Vine 4: Deep Cascading Willow Vine */}
        <div className="absolute -top-2 right-24 sm:right-40 w-56 sm:w-68 h-[430px] pointer-events-none opacity-40 animate-hanging-sway-right-deep">
          <svg className="w-full h-full text-[#638466]" viewBox="0 0 200 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 150,-10 C 135,70 170,150 145,230 C 130,290 160,345 150,390"
              stroke="#638466"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.6"
            />
            <g className="animate-leaf-flutter-3" style={{ transformOrigin: '145px 35px' }}>
              <path d="M 145,35 C 125,28 115,10 130,5 C 145,0 152,22 145,35 Z" fill="#8CA58E" opacity="0.7" />
            </g>
            <g className="animate-leaf-flutter-1" style={{ transformOrigin: '150px 85px' }}>
              <path d="M 150,85 C 170,80 180,60 165,55 C 150,50 142,72 150,85 Z" fill="#638466" opacity="0.6" />
            </g>
            <g className="animate-leaf-flutter-2" style={{ transformOrigin: '160px 145px' }}>
              <path d="M 160,145 C 180,140 188,120 172,115 C 156,110 150,132 160,145 Z" fill="#8CA58E" opacity="0.7" />
            </g>
            <g className="animate-leaf-flutter-3" style={{ transformOrigin: '152px 190px' }}>
              <path d="M 152,190 C 130,185 120,165 135,160 C 150,155 158,175 152,190 Z" fill="#638466" opacity="0.6" />
            </g>
            <g className="animate-leaf-flutter-1" style={{ transformOrigin: '140px 245px' }}>
              <path d="M 140,245 C 120,240 112,220 128,215 C 144,210 150,230 140,245 Z" fill="#8CA58E" opacity="0.65" />
            </g>
            <g className="animate-leaf-flutter-2" style={{ transformOrigin: '145px 305px' }}>
              <path d="M 145,305 C 165,300 172,280 158,275 C 144,270 138,290 145,305 Z" fill="#638466" opacity="0.55" />
            </g>
            <g className="animate-leaf-flutter-3" style={{ transformOrigin: '154px 355px' }}>
              <path d="M 154,355 C 135,350 128,330 142,328 C 156,325 162,342 154,355 Z" fill="#8CA58E" opacity="0.6" />
            </g>
            <circle cx="150" cy="390" r="3" fill="#8CA58E" opacity="0.5" />
          </svg>
        </div>

        {/* Right Vine 5: Soft Inner Tendril Framing Vine */}
        <div className="absolute -top-2 right-36 sm:right-56 w-44 sm:w-56 h-[320px] pointer-events-none opacity-32 animate-hanging-sway-right" style={{ animationDelay: '2.2s' }}>
          <svg className="w-full h-full text-[#638466]" viewBox="0 0 160 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 110,-5 C 125,50 95,110 115,170 C 130,220 110,260 120,295"
              stroke="#638466"
              strokeWidth="1.3"
              strokeLinecap="round"
              opacity="0.55"
            />
            <g className="animate-leaf-flutter-1" style={{ transformOrigin: '116px 45px' }}>
              <ellipse cx="134" cy="40" rx="11" ry="6.5" transform="rotate(25 134 40)" fill="#8CA58E" opacity="0.65" />
            </g>
            <g className="animate-leaf-flutter-2" style={{ transformOrigin: '108px 95px' }}>
              <ellipse cx="90" cy="90" rx="12" ry="7" transform="rotate(-30 90 90)" fill="#638466" opacity="0.55" />
            </g>
            <g className="animate-leaf-flutter-3" style={{ transformOrigin: '105px 150px' }}>
              <ellipse cx="124" cy="146" rx="11" ry="6.5" transform="rotate(20 124 146)" fill="#8CA58E" opacity="0.65" />
            </g>
            <g className="animate-leaf-flutter-1" style={{ transformOrigin: '122px 210px' }}>
              <ellipse cx="102" cy="205" rx="10" ry="6" transform="rotate(-25 102 205)" fill="#638466" opacity="0.55" />
            </g>
            <g className="animate-leaf-flutter-2" style={{ transformOrigin: '115px 265px' }}>
              <ellipse cx="132" cy="260" rx="9" ry="5" transform="rotate(15 132 260)" fill="#8CA58E" opacity="0.6" />
            </g>
            <circle cx="120" cy="295" r="2.5" fill="#8CA58E" opacity="0.5" />
          </svg>
        </div>

        {/* ------------------- TOP ROOF CANOPY TENDRILS ------------------- */}
        <div className="absolute top-0 left-1/4 w-1/2 h-28 pointer-events-none opacity-30 animate-hanging-sway-center">
          <svg className="w-full h-full text-[#638466]" viewBox="0 0 600 100" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0,0 Q 80,45 160,10 T 320,20 T 480,35 T 600,0" stroke="#638466" strokeWidth="1.2" opacity="0.5" />
            <ellipse cx="90" cy="35" rx="9" ry="5" transform="rotate(20 90 35)" fill="#8CA58E" opacity="0.6" />
            <ellipse cx="140" cy="22" rx="8" ry="5" transform="rotate(-25 140 22)" fill="#638466" opacity="0.5" />
            <ellipse cx="230" cy="25" rx="8" ry="4.5" transform="rotate(15 230 25)" fill="#8CA58E" opacity="0.6" />
            <ellipse cx="330" cy="28" rx="8" ry="5" transform="rotate(-20 330 28)" fill="#638466" opacity="0.5" />
            <ellipse cx="440" cy="35" rx="9" ry="5" transform="rotate(25 440 35)" fill="#8CA58E" opacity="0.6" />
            <ellipse cx="510" cy="22" rx="8" ry="4.5" transform="rotate(-15 510 22)" fill="#8CA58E" opacity="0.5" />
          </svg>
        </div>

        {/* ========================================================= */}
        {/* SPARSE GLOWING FIREFLIES (Warm Golden & Soft Green Tones) */}
        {/* ========================================================= */}
        
        {/* Firefly 1 - Warm Gold (Top Left Area) */}
        <div className="absolute top-1/4 left-[12%] animate-firefly-1">
          <div className="relative flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-[#E5C158]/35 blur-xs" />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-[#F3D77B] shadow-[0_0_8px_#E5C158]" />
          </div>
        </div>

        {/* Firefly 2 - Soft Mint Green (Center Right Area) */}
        <div className="absolute top-1/3 right-[18%] animate-firefly-2">
          <div className="relative flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-[#8CA58E]/40 blur-xs" />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-[#C2DAC3] shadow-[0_0_8px_#8CA58E]" />
          </div>
        </div>

        {/* Firefly 3 - Warm Amber/Gold (Bottom Left Area) */}
        <div className="absolute bottom-[28%] left-[22%] animate-firefly-3">
          <div className="relative flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-[#DFB35A]/35 blur-xs" />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-[#F5E09A] shadow-[0_0_8px_#DFB35A]" />
          </div>
        </div>

        {/* Firefly 4 - Soft Eucalyptus Sage (Top Right Area) */}
        <div className="absolute top-[18%] right-[28%] animate-firefly-4">
          <div className="relative flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-[#9EB99F]/35 blur-xs" />
            <div className="absolute w-1 h-1 rounded-full bg-[#D6E6D6] shadow-[0_0_6px_#9EB99F]" />
          </div>
        </div>

        {/* Firefly 5 - Delicate Honey Gold (Near Hero Center Bottom) */}
        <div className="absolute bottom-[18%] right-[14%] animate-firefly-5">
          <div className="relative flex items-center justify-center">
            <div className="w-3.5 h-3.5 rounded-full bg-[#E0B858]/30 blur-xs" />
            <div className="absolute w-1 h-1 rounded-full bg-[#F6DE8F] shadow-[0_0_6px_#E0B858]" />
          </div>
        </div>

        {/* Firefly 6 - Subtle Sage Shimmer (Left Center) */}
        <div className="absolute top-[52%] left-[8%] animate-firefly-6">
          <div className="relative flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-[#8CA58E]/30 blur-xs" />
            <div className="absolute w-1 h-1 rounded-full bg-[#C9E0CA] shadow-[0_0_6px_#8CA58E]" />
          </div>
        </div>
      </div>

      {/* Main Hero & Welcome Section */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
        
        {/* Safe Space Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF]/90 backdrop-blur-xs border border-[#EDE8E1] text-[#466548] text-xs font-semibold mb-6 shadow-xs">
          <Shield className="w-3.5 h-3.5 text-[#638466]" />
          <span>Private, Encrypted Space &amp; Google Sign-In</span>
          <span className="text-[#E0D9CE]">•</span>
          <button 
            onClick={onOpenThreatModel} 
            className="text-[#666057] hover:text-[#242220] underline underline-offset-2 font-medium cursor-pointer"
          >
            Security Overview
          </button>
        </div>

        {/* Warm, Welcoming Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#242220] mb-6 leading-tight max-w-3xl mx-auto">
          Whatever&apos;s on your mind, <br className="hidden sm:inline" />
          <span className="text-[#638466]">
            let&apos;s untangle it together.
          </span>
        </h1>

        {/* Sonder definition subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#666057] mb-10 leading-relaxed font-normal italic">
          sonder (n.) — the realization that each passer-by has a life as vivid and complex as your own.
        </p>

        {/* Error notification if sign in fails */}
        {errorMessage && (
          <div className="max-w-md mx-auto mb-6 p-4 rounded-xl bg-[#FDF4F0] border border-[#FADCD5] text-[#B6634C] text-sm text-left shadow-xs">
            <p className="font-semibold mb-1">Authentication Notice</p>
            <p className="text-xs text-[#C46A52]">{errorMessage}</p>
          </div>
        )}

        {/* ========================================================= */}
        {/* MAGICAL BUTTON WITH BLOOMING FIREFLY & SPARKLE CLUSTER */}
        {/* ========================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <div className="relative group">
            
            {/* 1. Warm Golden Ambient Glow (Noticeable bloom around button) */}
            <div className="pointer-events-none absolute -inset-3 rounded-2xl bg-gradient-to-r from-[#F3D77B]/20 via-[#E5C158]/55 to-[#8CA58E]/25 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 ease-out" />
            <div className="pointer-events-none absolute -inset-1 rounded-xl bg-[#E5C158]/40 opacity-0 group-hover:opacity-100 blur-md transition-all duration-400 ease-out" />

            {/* 2. Noticeable Blooming Cluster of Golden Fireflies / Sparkles */}
            <div className="pointer-events-none absolute -inset-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out">
              
              {/* Northwest Bloom Firefly */}
              <div className="absolute top-1/2 left-1/2 animate-bloom-nw">
                <div className="relative flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-[#E5C158]/50 blur-xs" />
                  <div className="absolute w-2 h-2 rounded-full bg-[#FFF3C4] shadow-[0_0_10px_#E5C158]" />
                </div>
              </div>

              {/* Northeast Bloom Sparkle */}
              <div className="absolute top-1/2 left-1/2 animate-bloom-ne">
                <Sparkles className="w-5 h-5 text-[#FFF0A8] drop-shadow-[0_0_8px_#E5C158]" />
              </div>

              {/* North Top Drift Firefly */}
              <div className="absolute top-1/2 left-1/2 animate-bloom-n">
                <div className="relative flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-[#F3D77B]/45 blur-xs" />
                  <div className="absolute w-1.5 h-1.5 rounded-full bg-[#FFFFFF] shadow-[0_0_8px_#F3D77B]" />
                </div>
              </div>

              {/* Southwest Bloom Firefly */}
              <div className="absolute top-1/2 left-1/2 animate-bloom-sw">
                <div className="relative flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-[#E5C158]/45 blur-xs" />
                  <div className="absolute w-1.5 h-1.5 rounded-full bg-[#FDE68A] shadow-[0_0_8px_#DFB35A]" />
                </div>
              </div>

              {/* Southeast Bloom Sparkle */}
              <div className="absolute top-1/2 left-1/2 animate-bloom-se">
                <Sparkles className="w-4.5 h-4.5 text-[#FEE685] drop-shadow-[0_0_8px_#E5C158]" />
              </div>

              {/* South Bottom Drift Firefly */}
              <div className="absolute top-1/2 left-1/2 animate-bloom-s">
                <div className="relative flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-[#C2DAC3]/50 blur-xs" />
                  <div className="absolute w-1.5 h-1.5 rounded-full bg-[#EAF5EB] shadow-[0_0_8px_#8CA58E]" />
                </div>
              </div>

              {/* Perimeter Floating Embers */}
              <div className="absolute -top-3 left-4 animate-sparkle-1">
                <div className="w-2 h-2 rounded-full bg-[#FFF3C4] shadow-[0_0_8px_#E5C158]" />
              </div>
              <div className="absolute -top-2 right-6 animate-sparkle-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FDE68A] shadow-[0_0_10px_#E5C158]" />
              </div>
              <div className="absolute -bottom-3 left-8 animate-sparkle-3">
                <div className="w-2 h-2 rounded-full bg-[#FFFBEB] shadow-[0_0_8px_#DFB35A]" />
              </div>
              <div className="absolute -bottom-2 right-8 animate-sparkle-1">
                <Sparkles className="w-3.5 h-3.5 text-[#F3D77B] drop-shadow-[0_0_6px_#E5C158]" />
              </div>

            </div>

            {/* 3. The Button */}
            <button
              id="btn-google-signin"
              onClick={onSignIn}
              disabled={isLoading}
              className="relative w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-semibold bg-[#638466] hover:bg-[#527355] text-white shadow-md hover:shadow-[0_0_28px_rgba(229,193,88,0.5),0_0_50px_rgba(229,193,88,0.25)] transition-all duration-400 transform active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed text-base cursor-pointer border border-transparent hover:border-[#F3D77B]/60"
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
            </button>
          </div>
        </div>

        {/* Natural & Organic Feature Highlights (Border-free, generous spacing) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mt-20 text-left">
          
          {/* Feature 1: Thoughtful Dialogue */}
          <div className="flex flex-col items-start space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F1F6F1] text-[#466548] flex items-center justify-center border border-[#DCE8DC]/70 shadow-xs">
              <MessageSquare className="w-5 h-5 text-[#638466]" />
            </div>
            <h3 className="text-base font-semibold text-[#242220]">A Thoughtful Listener</h3>
            <p className="text-sm text-[#666057] leading-relaxed">
              Express freely without judgment. Converse naturally with gentle, supportive perspectives that help you discover your own clarity.
            </p>
          </div>

          {/* Feature 2: Complete Privacy */}
          <div className="flex flex-col items-start space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F1F6F1] text-[#638466] flex items-center justify-center border border-[#DCE8DC]/70 shadow-xs">
              <Lock className="w-5 h-5 text-[#638466]" />
            </div>
            <h3 className="text-base font-semibold text-[#242220]">Completely Yours &amp; Private</h3>
            <p className="text-sm text-[#666057] leading-relaxed">
              Your journal is your sanctuary. Every reflection is locked to your account with zero data sharing and strict owner privacy.
            </p>
          </div>

          {/* Feature 3: Meaningful Connections */}
          <div className="flex flex-col items-start space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FDF4F0] text-[#B6634C] flex items-center justify-center border border-[#FADCD5]/70 shadow-xs">
              <Brain className="w-5 h-5 text-[#B6634C]" />
            </div>
            <h3 className="text-base font-semibold text-[#242220]">Gentle Insights &amp; Growth</h3>
            <p className="text-sm text-[#666057] leading-relaxed">
              Quietly uncover recurring patterns, emotional shifts, and heartfelt takeaways as your personal story unfolds over time.
            </p>
          </div>

        </div>

      </div>

      {/* Footer info banner */}
      <footer className="relative z-10 border-t border-[#EDE8E1] py-6 text-center text-xs text-[#666057] bg-[#FFFFFF]/70 backdrop-blur-xs">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>A tranquil, private space for personal reflection</span>
          <span>Sonderly &copy; {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
};
