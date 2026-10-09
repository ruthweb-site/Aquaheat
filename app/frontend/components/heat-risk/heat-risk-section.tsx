import React from 'react';
import { MumbaiZone } from '@/types/zone';
import { StatusBadge } from '@/components/ui/status-badge';

interface HeatRiskSectionProps {
  selectedZone: MumbaiZone;
}

export function HeatRiskSection({ selectedZone }: HeatRiskSectionProps) {
  return (
    <section
      id="current-risk"
      aria-labelledby="current-risk-heading"
      className="aqua-card rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden"
    >
      {/* Gentle water & warm sun ambient background glow */}
      <div
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-br from-[#4FC3C8]/15 via-[#F4A340]/10 to-transparent blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#087F8C]/5 blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Header bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2ECE8]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-6 rounded-full bg-[#087F8C]" />
            <h2
              id="current-risk-heading"
              className="text-sm font-bold uppercase tracking-wider text-[#087F8C]"
            >
              Current Heat Risk
            </h2>
            <StatusBadge
              label="Staged Baseline"
              level="PLACEHOLDER"
              size="sm"
            />
          </div>
          <p className="mt-1 text-sm text-[#48656A]">
            Real-time heat strain overview for{' '}
            <span className="font-semibold text-[#132A2F]">
              {selectedZone.name} ({selectedZone.representativeLocation})
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-[#48656A] bg-[#F1F6F4] px-3.5 py-1.5 rounded-full border border-[#DCE8E3] self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-[#4CAF7D]" />
          <span>Mumbai · 2:00 PM Afternoon Watch</span>
        </div>
      </div>

      {/* Main hero card layout */}
      <div className="relative z-10 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Circular / High Impact Risk Score */}
        <div className="lg:col-span-5 flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF5E7] border border-[#F4A340]/40 text-[#A05C0A] text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-[#F4A340]" />
            Moderate Risk
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-6xl sm:text-7xl font-black text-[#132A2F] tracking-tight">
              72
            </span>
            <span className="text-2xl font-bold text-[#748E92]">/ 100</span>
          </div>

          <p className="mt-2 text-sm text-[#48656A] max-w-sm">
            Heat levels are elevated across coastal corridors. Conditions are
            manageable with simple, mindful hydration steps.
          </p>

          {/* Calming reassurance banner */}
          <div className="mt-5 w-full p-4 rounded-2xl bg-[#E8F7F0] border border-[#4CAF7D]/30 flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#4CAF7D]/20 text-[#1E6B43] flex items-center justify-center shrink-0 mt-0.5">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-[#1E6B43]">
                You&apos;re okay right now.
              </p>
              <p className="text-xs text-[#2B774E] mt-0.5 leading-relaxed">
                Stay hydrated, take gentle pauses in the shade when outdoors, and
                keep a cool bottle of water handy.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Key atmospheric measurements in soft, welcoming cards */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-2 gap-4">
          {/* Ambient Temperature */}
          <div className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#E2ECE8] hover:border-[#D0E6E7] transition-all">
            <div className="flex items-center justify-between text-xs text-[#48656A] font-medium">
              <span>Air Temperature</span>
              <span className="w-2 h-2 rounded-full bg-[#F4A340]" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#132A2F]">
                34
              </span>
              <span className="text-lg font-semibold text-[#748E92]">°C</span>
            </div>
            <p className="mt-1 text-xs text-[#748E92]">Normal midday range</p>
          </div>

          {/* Feels Like (Heat Index) */}
          <div className="p-5 rounded-2xl bg-[#FEF5E7]/50 border border-[#F4A340]/25 hover:border-[#F4A340]/40 transition-all">
            <div className="flex items-center justify-between text-xs text-[#A05C0A] font-medium">
              <span>Feels Like</span>
              <span className="w-2 h-2 rounded-full bg-[#EF6C57]" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#B83E28]">
                39
              </span>
              <span className="text-lg font-semibold text-[#B83E28]/70">°C</span>
            </div>
            <p className="mt-1 text-xs text-[#A05C0A]">Elevated by coastal humidity</p>
          </div>

          {/* Relative Humidity */}
          <div className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#E2ECE8] hover:border-[#D0E6E7] transition-all">
            <div className="flex items-center justify-between text-xs text-[#48656A] font-medium">
              <span>Relative Humidity</span>
              <span className="w-2 h-2 rounded-full bg-[#4FC3C8]" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#087F8C]">
                68
              </span>
              <span className="text-lg font-semibold text-[#748E92]">%</span>
            </div>
            <p className="mt-1 text-xs text-[#748E92]">Arabian Sea moisture</p>
          </div>

          {/* Wet-Bulb Globe Temp (WBGT) */}
          <div className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#E2ECE8] hover:border-[#D0E6E7] transition-all">
            <div className="flex items-center justify-between text-xs text-[#48656A] font-medium">
              <span>Wet-Bulb Temp</span>
              <span className="w-2 h-2 rounded-full bg-[#087F8C]" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#132A2F]">
                29
              </span>
              <span className="text-lg font-semibold text-[#748E92]">°C</span>
            </div>
            <p className="mt-1 text-xs text-[#748E92]">Sweat cooling efficiency: Moderate</p>
          </div>
        </div>
      </div>

      {/* Gentle reassurance footnote */}
      <div className="relative z-10 mt-6 pt-4 border-t border-[#E8F0EC] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#748E92]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#087F8C]" />
          <span>Active Zone Node: <strong>{selectedZone.representativeLocation}</strong></span>
        </div>
        <span>Data model staged for live AWS IoT/IMD pipeline connection</span>
      </div>
    </section>
  );
}
