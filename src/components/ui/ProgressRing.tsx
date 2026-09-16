import React from 'react';

interface ProgressRingProps {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
  gradientId?: string;
  className?: string;
  color?: string;
}

export function ProgressRing({
  value,
  size = 80,
  stroke = 8,
  label,
  sublabel,
  gradientId,
  className = '',
  color,
}: ProgressRingProps) {
  const normalizedValue = Math.min(100, Math.max(0, value));
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;
  const uniqueId = gradientId || `progress-grad-${size}-${stroke}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id={uniqueId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3366ff" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
          className="text-slate-200/80 dark:text-slate-700/60"
        />
        {/* Animated Progress Indicator */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color || `url(#${uniqueId})`}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
        />
      </svg>
      {(label || sublabel) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-1">
          {label && (
            <span className="font-display font-bold text-sm leading-none text-slate-900 dark:text-slate-100">
              {label}
            </span>
          )}
          {sublabel && (
            <span className="text-[9px] text-slate-400 font-medium leading-tight mt-0.5 max-w-[80%] truncate">
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
