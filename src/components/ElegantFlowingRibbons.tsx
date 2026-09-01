import React, { useMemo } from 'react';

interface WaveStreamConfig {
  id: string;
  groupId: 'band-1' | 'band-2' | 'band-3' | 'band-4';
  baseY: number;
  lineCount: number;
  spacing: number;
  amplitude: number;
  frequency: number;
  phaseShift: number;
  strokeColor: string;
  strokeWidth: number;
  baseOpacity: number;
  dashPattern?: string;
}

interface ElegantFlowingRibbonsProps {
  animated?: boolean;
  opacity?: number;
  className?: string;
}

/**
 * ElegantFlowingRibbons:
 * Dense, layered, closely-grouped horizontal wavy lines that sweep across
 * the full width of the screen from left to right like flowing silk ribbons,
 * acoustic sound waves, or wind currents in soft gold, bronze, and champagne tones.
 * Gently animated with subtle horizontal flowing drift.
 */
export const ElegantFlowingRibbons: React.FC<ElegantFlowingRibbonsProps> = ({
  animated = true,
  opacity = 1,
  className = '',
}) => {
  // Generate multi-layered horizontal wave streams with high density grouped by band
  const { band1, band2, band3, band4 } = useMemo(() => {
    // 4 major horizontal ribbon groups spanning from top to bottom
    const streamGroups: WaveStreamConfig[] = [
      // Band 1: Upper Atmospheric Stream (sweeps gently across the top / hero header)
      {
        id: 'stream-upper-1',
        groupId: 'band-1',
        baseY: 140,
        lineCount: 14,
        spacing: 9,
        amplitude: 55,
        frequency: 1.8,
        phaseShift: 0.2,
        strokeColor: '#C99852',
        strokeWidth: 0.85,
        baseOpacity: 0.18,
      },
      {
        id: 'stream-upper-2',
        groupId: 'band-1',
        baseY: 170,
        lineCount: 10,
        spacing: 8,
        amplitude: 65,
        frequency: 2.2,
        phaseShift: 1.1,
        strokeColor: '#DFC396',
        strokeWidth: 0.65,
        baseOpacity: 0.14,
      },

      // Band 2: Mid-Upper Primary Harmonic Band (flows right behind the headline and title)
      {
        id: 'stream-mid-1',
        groupId: 'band-2',
        baseY: 340,
        lineCount: 18,
        spacing: 7.5,
        amplitude: 85,
        frequency: 2.1,
        phaseShift: 0.5,
        strokeColor: '#B88746',
        strokeWidth: 0.95,
        baseOpacity: 0.22,
      },
      {
        id: 'stream-mid-2',
        groupId: 'band-2',
        baseY: 380,
        lineCount: 12,
        spacing: 9,
        amplitude: 75,
        frequency: 1.6,
        phaseShift: 2.3,
        strokeColor: '#E5C287',
        strokeWidth: 0.75,
        baseOpacity: 0.16,
      },

      // Band 3: Central CTA / Value Stream (flows behind the sign-in button and features)
      {
        id: 'stream-lower-1',
        groupId: 'band-3',
        baseY: 560,
        lineCount: 16,
        spacing: 8.5,
        amplitude: 95,
        frequency: 1.9,
        phaseShift: 1.4,
        strokeColor: '#C99852',
        strokeWidth: 0.9,
        baseOpacity: 0.20,
      },
      {
        id: 'stream-lower-2',
        groupId: 'band-3',
        baseY: 600,
        lineCount: 12,
        spacing: 8,
        amplitude: 80,
        frequency: 2.4,
        phaseShift: 3.1,
        strokeColor: '#9E7438',
        strokeWidth: 0.7,
        baseOpacity: 0.15,
      },

      // Band 4: Deep Foundation Contours (sweeps smoothly across the lower feature cards)
      {
        id: 'stream-bottom-1',
        groupId: 'band-4',
        baseY: 760,
        lineCount: 14,
        spacing: 10,
        amplitude: 60,
        frequency: 1.7,
        phaseShift: 0.8,
        strokeColor: '#DFC396',
        strokeWidth: 0.85,
        baseOpacity: 0.16,
      },
      {
        id: 'stream-bottom-2',
        groupId: 'band-4',
        baseY: 800,
        lineCount: 8,
        spacing: 9,
        amplitude: 70,
        frequency: 2.0,
        phaseShift: 2.6,
        strokeColor: '#B88746',
        strokeWidth: 0.6,
        baseOpacity: 0.12,
      },
    ];

    // Compute smooth cubic bezier horizontal paths for each line
    // Viewport width 1440, extended spanning from -200 to 1640 (left to right) for drift headroom
    const pointsX = [-200, 60, 320, 580, 840, 1100, 1360, 1640];

    const groupedLines: Record<'band-1' | 'band-2' | 'band-3' | 'band-4', Array<{
      key: string;
      d: string;
      stroke: string;
      strokeWidth: number;
      opacity: number;
    }>> = {
      'band-1': [],
      'band-2': [],
      'band-3': [],
      'band-4': [],
    };

    streamGroups.forEach((group) => {
      for (let i = 0; i < group.lineCount; i++) {
        const lineOffset = (i - group.lineCount / 2) * group.spacing;
        const linePhase = group.phaseShift + (i * 0.14);
        
        // Slightly vary opacity towards edges of the stream for soft gradient ribbon feel
        const centerDistance = Math.abs(i - group.lineCount / 2) / (group.lineCount / 2);
        const lineOpacity = group.baseOpacity * (1 - centerDistance * 0.45);

        // Generate control points along X axis
        const yCoords = pointsX.map((x) => {
          const normX = (x + 200) / 1840;
          const wave1 = Math.sin(normX * Math.PI * 2 * group.frequency + linePhase);
          const wave2 = Math.cos(normX * Math.PI * 3.5 + linePhase * 0.8) * 0.35;
          const totalWave = (wave1 + wave2) * group.amplitude;
          return group.baseY + lineOffset + totalWave;
        });

        // Build smooth SVG Path using cubic beziers across the horizontal coordinates
        let pathD = `M ${pointsX[0]},${yCoords[0].toFixed(1)}`;
        
        for (let j = 0; j < pointsX.length - 1; j++) {
          const x0 = pointsX[j];
          const y0 = yCoords[j];
          const x1 = pointsX[j + 1];
          const y1 = yCoords[j + 1];

          // Tangents for horizontal continuity
          const cpX1 = x0 + (x1 - x0) * 0.5;
          const cpY1 = y0;
          const cpX2 = x0 + (x1 - x0) * 0.5;
          const cpY2 = y1;

          pathD += ` C ${cpX1.toFixed(1)},${cpY1.toFixed(1)} ${cpX2.toFixed(1)},${cpY2.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
        }

        groupedLines[group.groupId].push({
          key: `${group.id}-line-${i}`,
          d: pathD,
          stroke: group.strokeColor,
          strokeWidth: group.strokeWidth,
          opacity: Math.max(0.04, Math.min(0.35, lineOpacity)),
        });
      }
    });

    return {
      band1: groupedLines['band-1'],
      band2: groupedLines['band-2'],
      band3: groupedLines['band-3'],
      band4: groupedLines['band-4'],
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{ opacity }}
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden select-none ${className}`}
    >
      {/* Soft Ambient Radial Lights (Warm Cream & Champagne Gold) */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-[#F5ECD9]/55 via-[#FAF4EA]/30 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[28%] -right-28 w-[650px] h-[650px] bg-[#EFE3D0]/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[55%] -left-36 w-[750px] h-[750px] bg-[#F5EBE0]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-[10%] w-[550px] h-[550px] bg-[#FAF1E4]/45 rounded-full blur-3xl pointer-events-none" />

      {/* SVG Canvas for High-Density Horizontal Silk Wave Streams */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Horizontal Gold Linear Gradient */}
          <linearGradient id="global-gold-stream" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C99852" stopOpacity="0.25" />
            <stop offset="25%" stopColor="#E4B76B" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#B88746" stopOpacity="0.30" />
            <stop offset="85%" stopColor="#DFC396" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#C99852" stopOpacity="0.20" />
          </linearGradient>

          {/* Soft Silk Ribbon Mesh Fills */}
          <linearGradient id="silk-mesh-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FAF2E4" stopOpacity="0.3" />
            <stop offset="40%" stopColor="#F5E8D3" stopOpacity="0.2" />
            <stop offset="80%" stopColor="#F8EFE0" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FAF8F5" stopOpacity="0.0" />
          </linearGradient>

          <linearGradient id="silk-mesh-2" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#F5EFE6" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#FAF4EA" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FAF8F5" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Translucent Silk Ribbon Fills across horizontal bands */}
        <g className={animated ? 'animate-ribbon-drift-2' : ''}>
          <path
            d="M -200,310 C 60,240 420,430 680,320 C 940,210 1200,380 1640,290 L 1640,430 C 1200,520 940,350 680,460 C 420,570 60,380 -200,450 Z"
            fill="url(#silk-mesh-1)"
          />
        </g>
        <g className={animated ? 'animate-ribbon-drift-3' : ''}>
          <path
            d="M -200,530 C 60,450 420,650 680,540 C 940,430 1200,600 1640,510 L 1640,650 C 1200,740 940,570 680,680 C 420,790 60,600 -200,670 Z"
            fill="url(#silk-mesh-2)"
          />
        </g>

        {/* Layered Horizontal Silk & Acoustic Wave Lines grouped with distinct gentle drift tempos */}
        <g className={animated ? 'animate-ribbon-drift-1' : ''}>
          {band1.map((line) => (
            <path
              key={line.key}
              d={line.d}
              fill="none"
              stroke={line.stroke}
              strokeWidth={line.strokeWidth}
              strokeOpacity={line.opacity}
              strokeLinecap="round"
            />
          ))}
        </g>

        <g className={animated ? 'animate-ribbon-drift-2' : ''}>
          {band2.map((line) => (
            <path
              key={line.key}
              d={line.d}
              fill="none"
              stroke={line.stroke}
              strokeWidth={line.strokeWidth}
              strokeOpacity={line.opacity}
              strokeLinecap="round"
            />
          ))}
        </g>

        <g className={animated ? 'animate-ribbon-drift-3' : ''}>
          {band3.map((line) => (
            <path
              key={line.key}
              d={line.d}
              fill="none"
              stroke={line.stroke}
              strokeWidth={line.strokeWidth}
              strokeOpacity={line.opacity}
              strokeLinecap="round"
            />
          ))}
        </g>

        <g className={animated ? 'animate-ribbon-drift-4' : ''}>
          {band4.map((line) => (
            <path
              key={line.key}
              d={line.d}
              fill="none"
              stroke={line.stroke}
              strokeWidth={line.strokeWidth}
              strokeOpacity={line.opacity}
              strokeLinecap="round"
            />
          ))}
        </g>
      </svg>
    </div>
  );
};
