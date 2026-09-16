import React from 'react';
import { StudySyncSymbol } from './StudySyncSymbol';

export interface StudySyncLogoProps {
  variant?: 'horizontal' | 'navbar' | 'hero' | 'icon' | 'stacked';
  theme?: 'auto' | 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showTagline?: boolean;
  taglineText?: string;
  className?: string;
  animated?: boolean;
  onClick?: () => void;
}

export const StudySyncLogo: React.FC<StudySyncLogoProps> = ({
  variant = 'horizontal',
  theme = 'auto',
  size = 'md',
  showTagline = false,
  taglineText = 'INTELLIGENT PEER TUTOR MATCHING',
  className = '',
  animated = false,
  onClick,
}) => {
  // Compute sizing dimensions
  const symbolSize = (() => {
    if (variant === 'navbar') return 34;
    if (variant === 'hero') return 72;
    switch (size) {
      case 'sm':
        return 28;
      case 'md':
        return 38;
      case 'lg':
        return 52;
      case 'xl':
        return 68;
      case 'hero':
        return 80;
      default:
        return 38;
    }
  })();

  // Text sizing classes
  const textSizeClass = (() => {
    if (variant === 'navbar') return 'text-lg';
    if (variant === 'hero') return 'text-3xl sm:text-4xl lg:text-5xl';
    switch (size) {
      case 'sm':
        return 'text-base';
      case 'md':
        return 'text-xl';
      case 'lg':
        return 'text-2xl sm:text-3xl';
      case 'xl':
        return 'text-3xl sm:text-4xl';
      case 'hero':
        return 'text-4xl sm:text-5xl lg:text-6xl';
      default:
        return 'text-xl';
    }
  })();

  const aiBadgeClass = (() => {
    if (variant === 'navbar') return 'text-xs px-1.5 py-0.5 ml-1.5';
    if (variant === 'hero') return 'text-sm sm:text-base px-2.5 py-1 ml-2.5';
    switch (size) {
      case 'sm':
        return 'text-[10px] px-1.5 py-0.5 ml-1';
      case 'md':
        return 'text-xs px-1.5 py-0.5 ml-1.5';
      case 'lg':
        return 'text-xs sm:text-sm px-2 py-0.5 ml-2';
      case 'xl':
      case 'hero':
        return 'text-sm sm:text-base px-2.5 py-1 ml-2.5';
      default:
        return 'text-xs px-1.5 py-0.5 ml-1.5';
    }
  })();

  // Theme text color classes
  const textPrimaryColor = (() => {
    if (theme === 'dark') return 'text-white';
    if (theme === 'light') return 'text-[#0A1128]';
    return 'text-[#0A1128] dark:text-white';
  })();

  const taglineColor = (() => {
    if (theme === 'dark') return 'text-slate-400';
    if (theme === 'light') return 'text-slate-500';
    return 'text-slate-500 dark:text-slate-400';
  })();

  // Standalone App Icon Variant
  if (variant === 'icon') {
    return (
      <div
        onClick={onClick}
        className={`relative inline-flex items-center justify-center rounded-2xl p-2 bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/60 shadow-xl shadow-indigo-500/10 backdrop-blur-md transition-transform duration-300 hover:scale-105 select-none ${className}`}
      >
        <StudySyncSymbol size={symbolSize} animated={animated} glow={true} theme={theme} />
      </div>
    );
  }

  // Stacked Layout (Symbol Centered on top, Typography below)
  if (variant === 'stacked') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex flex-col items-center text-center select-none ${className}`}
      >
        <div className="relative mb-3 flex items-center justify-center">
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full pointer-events-none" />
          <StudySyncSymbol size={symbolSize * 1.25} animated={animated} glow={true} theme={theme} />
        </div>

        <div className="flex items-center justify-center">
          <span className={`font-display font-extrabold tracking-tight ${textSizeClass} ${textPrimaryColor}`}>
            StudySync
          </span>
          <span
            className={`font-display font-black tracking-wider uppercase rounded-lg bg-gradient-to-r from-cyan-500/15 via-indigo-500/15 to-purple-500/15 border border-cyan-400/40 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 shadow-sm ${aiBadgeClass}`}
          >
            AI
          </span>
        </div>

        {(showTagline || variant === 'hero') && (
          <div className="mt-2 flex flex-col items-center">
            <span
              className={`font-sans text-[10px] sm:text-xs font-semibold tracking-[0.22em] uppercase ${taglineColor}`}
            >
              {taglineText}
            </span>
            <div className="w-12 h-0.5 mt-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500" />
          </div>
        )}
      </div>
    );
  }

  // Horizontal / Hero / Navbar Layout
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none transition-all group ${className}`}
    >
      {/* 3D Vector Emblem with ambient backglow */}
      <div className="relative shrink-0 flex items-center justify-center">
        {variant === 'hero' && (
          <div className="absolute inset-0 -m-3 bg-gradient-to-tr from-indigo-600/30 via-purple-600/20 to-cyan-500/30 blur-2xl rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />
        )}
        <StudySyncSymbol
          size={symbolSize}
          animated={animated}
          glow={true}
          theme={theme}
          className="transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      {/* Typography Unit */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center leading-none">
          <span
            className={`font-display font-extrabold tracking-tight ${textSizeClass} ${textPrimaryColor}`}
          >
            StudySync
          </span>

          {/* AI Badge with Gradient & Micro-Border */}
          <span
            className={`font-display font-black tracking-wider uppercase rounded-lg bg-gradient-to-r from-cyan-500/15 via-indigo-500/15 to-purple-500/15 border border-cyan-400/40 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 shadow-sm ${aiBadgeClass}`}
          >
            AI
          </span>
        </div>

        {/* Tagline / Subtitle */}
        {(showTagline || variant === 'hero') && (
          <div className="mt-1 flex items-center gap-2">
            <span
              className={`font-sans text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase ${taglineColor}`}
            >
              {taglineText}
            </span>
            <span className="hidden sm:inline-block w-8 h-[2px] rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500" />
          </div>
        )}
      </div>
    </div>
  );
};
