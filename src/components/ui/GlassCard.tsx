import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({
  children,
  className = '',
  hover = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={`glass rounded-2xl ${
        hover
          ? 'hover:shadow-xl hover:-translate-y-0.5 hover:border-slate-300/80 dark:hover:border-slate-600/80 transition-all duration-300'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
