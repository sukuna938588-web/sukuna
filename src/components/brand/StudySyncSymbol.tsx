import React from 'react';

export interface StudySyncSymbolProps {
  size?: number | string;
  className?: string;
  animated?: boolean;
  glow?: boolean;
  theme?: 'dark' | 'light' | 'auto';
  idPrefix?: string;
}

export const StudySyncSymbol: React.FC<StudySyncSymbolProps> = ({
  size = 48,
  className = '',
  animated = false,
  glow = true,
  idPrefix = 'ss-sym',
}) => {
  const gradMain = `${idPrefix}-ribbon-main`;
  const gradUpper = `${idPrefix}-ribbon-upper`;
  const gradSpecular = `${idPrefix}-specular`;
  const gradCyan = `${idPrefix}-cyan`;
  const filterGlow = `${idPrefix}-glow`;
  const filterShadow = `${idPrefix}-shadow`;

  return (
    <svg
      viewBox="0 0 110 110"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-label="StudySync AI Symbol"
    >
      <defs>
        {/* Core Brand Ribbon Gradient: #4F46E5 -> #7C3AED -> #06B6D4 */}
        <linearGradient id={gradMain} x1="10%" y1="10%" x2="90%" y2="90%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="48%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>

        {/* Upper Ribbon Crest Gradient */}
        <linearGradient id={gradUpper} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="60%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>

        {/* Specular Edge Highlight */}
        <linearGradient id={gradSpecular} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Electric Cyan Accent */}
        <linearGradient id={gradCyan} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#67E8F9" />
        </linearGradient>

        {/* Volumetric Glow */}
        {glow && (
          <filter id={filterGlow} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}

        <filter id={filterShadow} x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#4F46E5" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Ambient Volumetric Aura */}
      <circle cx="55" cy="55" r="42" fill="#4F46E5" opacity="0.12" />
      <circle cx="55" cy="55" r="30" fill="#06B6D4" opacity="0.08" />

      {/* Connected Student Collaboration Network (Orbiting Nodes & Synaptic Links) */}
      <g opacity="0.88">
        {/* Synaptic Bezier Arcs */}
        <path
          d="M 16,36 Q 28,30 38,36"
          stroke="#06B6D4"
          strokeWidth="1.2"
          strokeDasharray="2.5 2"
          strokeOpacity="0.7"
          className={animated ? 'animate-pulse' : ''}
        />
        <path
          d="M 94,32 Q 82,38 72,36"
          stroke="#818CF8"
          strokeWidth="1.2"
          strokeDasharray="2.5 2"
          strokeOpacity="0.7"
        />
        <path
          d="M 14,76 Q 26,82 38,76"
          stroke="#22D3EE"
          strokeWidth="1.2"
          strokeDasharray="2.5 2"
          strokeOpacity="0.7"
        />
        <path
          d="M 96,78 Q 84,72 74,78"
          stroke="#A855F7"
          strokeWidth="1.2"
          strokeDasharray="2.5 2"
          strokeOpacity="0.7"
        />

        {/* Peripheral Student Constellation Rings */}
        <path
          d="M 16,36 C 6,56 6,66 14,76"
          stroke="#6366F1"
          strokeWidth="0.8"
          strokeDasharray="2 3"
          strokeOpacity="0.4"
        />
        <path
          d="M 94,32 C 104,52 104,64 96,78"
          stroke="#06B6D4"
          strokeWidth="0.8"
          strokeDasharray="2 3"
          strokeOpacity="0.4"
        />

        {/* Student Learner Node (Top Left) */}
        <circle cx="16" cy="36" r="5" fill="#4F46E5" fillOpacity="0.25" />
        <circle cx="16" cy="36" r="3" fill="#06B6D4" filter={glow ? `url(#${filterGlow})` : undefined} />
        <circle cx="16" cy="36" r="1.1" fill="#FFFFFF" />

        {/* Peer Tutor Node (Top Right) */}
        <circle cx="94" cy="32" r="5" fill="#7C3AED" fillOpacity="0.25" />
        <circle cx="94" cy="32" r="3" fill="#818CF8" />
        <circle cx="94" cy="32" r="1.1" fill="#FFFFFF" />

        {/* Study Circle Node (Bottom Left) */}
        <circle cx="14" cy="76" r="5" fill="#06B6D4" fillOpacity="0.25" />
        <circle cx="14" cy="76" r="3" fill="#22D3EE" filter={glow ? `url(#${filterGlow})` : undefined} />
        <circle cx="14" cy="76" r="1.1" fill="#FFFFFF" />

        {/* AI Matching Engine Node (Bottom Right) */}
        <circle cx="96" cy="78" r="5" fill="#9333EA" fillOpacity="0.25" />
        <circle cx="96" cy="78" r="3" fill="#A855F7" />
        <circle cx="96" cy="78" r="1.1" fill="#FFFFFF" />
      </g>

      {/* Main 3D Ribbon Letter "S" */}
      <g filter={`url(#${filterShadow})`}>
        {/* Outer Ribbon Core */}
        <path
          d="M 68,28 C 68,28 42,23 32,33 C 22,43 24,56 38,62 C 48,66 60,68 56,79 C 52,90 38,92 27,85 C 23,82.5 21,78 21,78"
          stroke={`url(#${gradMain})`}
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Specular Bevel Highlight */}
        <path
          d="M 64,29 C 45,25 35,33 34,42 C 33,51 44,57 52,61 C 60,65 65,71 62,80 C 58,88 47,89 33,85"
          stroke={`url(#${gradSpecular})`}
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Micro-light Filament */}
        <path
          d="M 66,28 C 42,24 33,35 34,44 C 35,53 47,59 55,63 C 64,68 67,76 63,84 C 58,91 44,92 29,86"
          stroke="#FFFFFF"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeOpacity="0.5"
          fill="none"
        />
      </g>

      {/* Center Connected Student Nodes & Synapses Across S Center */}
      <g opacity="0.95">
        <path d="M 36,46 L 48,42" stroke="#22D3EE" strokeWidth="1.2" strokeDasharray="2 1.5" strokeOpacity="0.85" />
        <path d="M 48,42 L 62,48" stroke="#818CF8" strokeWidth="1.2" strokeDasharray="2 1.5" strokeOpacity="0.85" />
        <path d="M 40,58 L 54,54" stroke="#22D3EE" strokeWidth="1.4" strokeDasharray="2 1.5" strokeOpacity="0.9" />
        <path d="M 54,54 L 68,60" stroke="#A855F7" strokeWidth="1.4" strokeDasharray="2 1.5" strokeOpacity="0.9" />
        <path d="M 48,42 L 54,54" stroke="#67E8F9" strokeWidth="1.1" strokeOpacity="0.75" />

        <circle cx="48" cy="42" r="3" fill="#7C3AED" filter={glow ? `url(#${filterGlow})` : undefined} />
        <circle cx="48" cy="42" r="1.2" fill="#FFFFFF" />

        <circle cx="40" cy="58" r="3.2" fill="#06B6D4" filter={glow ? `url(#${filterGlow})` : undefined} />
        <circle cx="40" cy="58" r="1.3" fill="#FFFFFF" />

        <circle cx="54" cy="54" r="3.8" fill="#4F46E5" filter={glow ? `url(#${filterGlow})` : undefined} />
        <circle cx="54" cy="54" r="2.2" fill="#22D3EE" />
        <circle cx="54" cy="54" r="1" fill="#FFFFFF" />

        <circle cx="68" cy="60" r="3.1" fill="#9333EA" filter={glow ? `url(#${filterGlow})` : undefined} />
        <circle cx="68" cy="60" r="1.2" fill="#FFFFFF" />
      </g>

      {/* AI Circuit Traces Embedded in Lower S Curve */}
      <g opacity="0.95">
        {/* Data Bus Traces */}
        <path
          d="M 40,78 L 48,78 L 54,72 L 66,72"
          stroke="#22D3EE"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="66" cy="72" r="2" fill="#22D3EE" filter={glow ? `url(#${filterGlow})` : undefined} />
        <circle cx="66" cy="72" r="0.9" fill="#FFFFFF" />

        <path
          d="M 36,85 L 46,85 L 53,92 L 59,92"
          stroke="#67E8F9"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="59" cy="92" r="1.6" fill="#67E8F9" />

        <path d="M 46,78 L 46,85" stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="46" cy="78" r="1.2" fill="#38BDF8" />
        <circle cx="46" cy="85" r="1.2" fill="#38BDF8" />

        {/* Neural Micro-Vias */}
        <circle cx="51" cy="75" r="1" fill="#22D3EE" />
        <circle cx="38" cy="82" r="1" fill="#67E8F9" />
      </g>

      {/* Academic Graduation Cap Integrated at Top Crest */}
      <g>
        {/* Diamond Mortarboard */}
        <polygon
          points="54,7 76,16 54,25 32,16"
          fill="#4F46E5"
          stroke="#818CF8"
          strokeWidth="0.9"
        />
        <polygon
          points="54,7 76,16 54,25 32,16"
          fill={`url(#${gradUpper})`}
          opacity="0.85"
        />
        {/* Specular Leading Ridge */}
        <polyline points="32,16 54,7 76,16" stroke="#C7D2FE" strokeWidth="1.2" fill="none" />
        {/* Skullcap Band */}
        <path d="M 40,19.5 L 54,25 L 68,19.5 L 68,23.5 L 54,28.5 L 40,23.5 Z" fill="#312E81" />
        {/* Center Pivot Stud */}
        <ellipse cx="54" cy="16" rx="2" ry="1.4" fill="#FFFFFF" />
        {/* Flowing Tassel with Glowing Cyan Tip */}
        <path
          d="M 54,16 C 64,17 73,22 75,29 C 76,33 75,38 73,43"
          stroke="#22D3EE"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="73" cy="43" r="2.2" fill="#22D3EE" filter={glow ? `url(#${filterGlow})` : undefined} />
        <circle cx="73" cy="43" r="0.9" fill="#FFFFFF" />
      </g>
    </svg>
  );
};
