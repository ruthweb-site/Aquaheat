import React from 'react';
import { RiskLevel } from '@/types/heat-risk';

interface StatusBadgeProps {
  label: string;
  level?: RiskLevel | 'INFO' | 'PLACEHOLDER';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showDot?: boolean;
}

export function StatusBadge({
  label,
  level = 'INFO',
  size = 'md',
  className = '',
  showDot = true,
}: StatusBadgeProps) {
  // Brand & Risk color tokens:
  // Safe: Soft green #4CAF7D
  // Moderate: Warm amber #F4A340
  // High: Coral #EF6C57
  // Extreme: Deep red #D64545
  // Primary/Info: Deep teal #087F8C
  const levelStyles: Record<
    string,
    { bg: string; text: string; border: string; dot: string }
  > = {
    SAFE: {
      bg: 'bg-[#EBF7F0]',
      text: 'text-[#1E6B43]',
      border: 'border-[#4CAF7D]/30',
      dot: 'bg-[#4CAF7D]',
    },
    LOW: {
      bg: 'bg-[#EBF7F0]',
      text: 'text-[#1E6B43]',
      border: 'border-[#4CAF7D]/30',
      dot: 'bg-[#4CAF7D]',
    },
    MODERATE: {
      bg: 'bg-[#FEF5E7]',
      text: 'text-[#A05C0A]',
      border: 'border-[#F4A340]/35',
      dot: 'bg-[#F4A340]',
    },
    HIGH: {
      bg: 'bg-[#FDF0ED]',
      text: 'text-[#B83E28]',
      border: 'border-[#EF6C57]/35',
      dot: 'bg-[#EF6C57]',
    },
    EXTREME: {
      bg: 'bg-[#FCEBEB]',
      text: 'text-[#961F1F]',
      border: 'border-[#D64545]/40',
      dot: 'bg-[#D64545]',
    },
    INFO: {
      bg: 'bg-[#E8F4F6]',
      text: 'text-[#087F8C]',
      border: 'border-[#087F8C]/25',
      dot: 'bg-[#087F8C]',
    },
    PLACEHOLDER: {
      bg: 'bg-[#F1F6F4]',
      text: 'text-[#48656A]',
      border: 'border-[#D0E0DC]',
      dot: 'bg-[#4FC3C8]',
    },
  };

  const current = levelStyles[level] || levelStyles.INFO;

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${current.bg} ${current.text} ${current.border} ${sizeStyles[size]} ${className}`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${current.dot} shrink-0`}
          aria-hidden="true"
        />
      )}
      <span>{label}</span>
    </span>
  );
}
