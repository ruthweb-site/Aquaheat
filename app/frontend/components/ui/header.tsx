import React from 'react';
import { APP_METADATA } from '@/lib/constants';
import { StatusBadge } from './status-badge';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E2ECE8] shadow-[0_2px_12px_-4px_rgba(8,127,140,0.06)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#087F8C] to-[#4FC3C8] p-0.5 shadow-[0_4px_12px_rgba(8,127,140,0.25)] flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#FFFFFF] rounded-[14px] flex items-center justify-center">
                {/* Water droplet + gentle sun beam icon */}
                <svg
                  className="w-5 h-5 text-[#087F8C]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-[#132A2F]">
                  {APP_METADATA.name}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#E8F4F6] text-[#087F8C] border border-[#087F8C]/20">
                  Mumbai Heat Safety
                </span>
              </div>
              <p className="text-xs font-medium text-[#48656A] tracking-wide">
                Predict <span className="text-[#087F8C]">→</span> Prevent <span className="text-[#087F8C]">→</span> Respond
              </p>
            </div>
          </div>

          {/* Calming status pill */}
          <div className="flex items-center gap-2">
            <StatusBadge
              label="Live Safety Monitor"
              level="SAFE"
              size="sm"
            />
          </div>
        </div>

        {/* Clean, calm section jump navigation */}
        <nav
          aria-label="Safety navigation"
          className="mt-3 pt-2.5 border-t border-[#E8F0EC] flex items-center gap-2 overflow-x-auto text-xs font-medium text-[#48656A] no-scrollbar"
        >
          <a
            href="#current-risk"
            className="px-3 py-1 rounded-full hover:text-[#087F8C] hover:bg-[#E8F4F6] transition-colors whitespace-nowrap"
          >
            Current Heat Risk
          </a>
          <span className="text-[#D0E0DC]" aria-hidden="true">
            •
          </span>
          <a
            href="#mumbai-zones"
            className="px-3 py-1 rounded-full hover:text-[#087F8C] hover:bg-[#E8F4F6] transition-colors whitespace-nowrap"
          >
            Mumbai Heat Zones
          </a>
          <span className="text-[#D0E0DC]" aria-hidden="true">
            •
          </span>
          <a
            href="#heat-timeline"
            className="px-3 py-1 rounded-full hover:text-[#087F8C] hover:bg-[#E8F4F6] transition-colors whitespace-nowrap"
          >
            24h Heat Timeline
          </a>
          <span className="text-[#D0E0DC]" aria-hidden="true">
            •
          </span>
          <a
            href="#personal-safety"
            className="px-3 py-1 rounded-full hover:text-[#087F8C] hover:bg-[#E8F4F6] transition-colors whitespace-nowrap"
          >
            Personal Safety
          </a>
          <span className="text-[#D0E0DC]" aria-hidden="true">
            •
          </span>
          <a
            href="#safety-guidance"
            className="px-3 py-1 rounded-full hover:text-[#087F8C] hover:bg-[#E8F4F6] transition-colors whitespace-nowrap"
          >
            Comfort & Guidance
          </a>
          <span className="text-[#D0E0DC]" aria-hidden="true">
            •
          </span>
          <a
            href="#emergency-help"
            className="px-3 py-1 rounded-full text-[#B83E28] hover:bg-[#FDF0ED] font-semibold transition-colors whitespace-nowrap"
          >
            Emergency Help (108)
          </a>
        </nav>
      </div>
    </header>
  );
}
