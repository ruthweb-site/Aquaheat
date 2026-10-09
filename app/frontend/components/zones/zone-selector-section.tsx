'use client';

import React from 'react';
import { MumbaiZone } from '@/types/zone';
import { MUMBAI_ZONES } from '@/lib/zones';
import { StatusBadge } from '@/components/ui/status-badge';

interface ZoneSelectorSectionProps {
  selectedZone: MumbaiZone;
  onSelectZone: (zone: MumbaiZone) => void;
}

export function ZoneSelectorSection({
  selectedZone,
  onSelectZone,
}: ZoneSelectorSectionProps) {
  // Staged subtle micro-risk indicators for Mumbai zones
  const zoneMicroStatus: Record<
    string,
    { status: string; level: 'SAFE' | 'MODERATE' | 'HIGH'; breeze: string }
  > = {
    'south-mumbai': {
      status: 'Moderate',
      level: 'MODERATE',
      breeze: 'Gentle coastal sea breeze',
    },
    'western-suburbs': {
      status: 'Moderate Warmth',
      level: 'MODERATE',
      breeze: 'Moderate humidity corridor',
    },
    'eastern-suburbs': {
      status: 'Elevated Heat',
      level: 'HIGH',
      breeze: 'Inland heat pocket',
    },
    'central-mumbai': {
      status: 'Moderate',
      level: 'MODERATE',
      breeze: 'Dense transit area',
    },
    'harbour': {
      status: 'Moderate',
      level: 'MODERATE',
      breeze: 'Bay moisture active',
    },
    'northern-mumbai': {
      status: 'Mild / Safe',
      level: 'SAFE',
      breeze: 'Slightly cooler canopy',
    },
  };

  return (
    <section
      id="mumbai-zones"
      aria-labelledby="zones-heading"
      className="aqua-card rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#E2ECE8]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-6 rounded-full bg-[#4FC3C8]" />
            <h2
              id="zones-heading"
              className="text-xl sm:text-2xl font-bold tracking-tight text-[#132A2F]"
            >
              Where is Mumbai feeling the heat?
            </h2>
          </div>
          <p className="mt-1 text-sm text-[#48656A]">
            Select your zone to personalize cooling guidance and local neighborhood recommendations
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#E8F4F6] text-[#087F8C] border border-[#087F8C]/20 self-start sm:self-auto">
          Viewing: <span className="underline">{selectedZone.name}</span>
        </div>
      </div>

      {/* Grid of six Mumbai Zones */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MUMBAI_ZONES.map((zone) => {
          const isSelected = selectedZone.id === zone.id;
          const meta = zoneMicroStatus[zone.id] || {
            status: 'Moderate',
            level: 'MODERATE',
            breeze: 'Coastal zone',
          };

          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => onSelectZone(zone)}
              aria-pressed={isSelected}
              className={`text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer relative ${
                isSelected
                  ? 'bg-[#FFFFFF] border-[#087F8C] ring-2 ring-[#087F8C]/20 shadow-[0_8px_20px_-4px_rgba(8,127,140,0.15)]'
                  : 'bg-[#F8FAF7] border-[#E2ECE8] hover:border-[#D0E6E7] hover:bg-[#FFFFFF]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-base text-[#132A2F]">
                    {zone.name}
                  </h3>
                  <p className="text-xs text-[#48656A] mt-0.5 font-medium">
                    {zone.representativeLocation}
                  </p>
                </div>

                <StatusBadge
                  label={meta.status}
                  level={meta.level}
                  size="sm"
                />
              </div>

              <div className="mt-3 text-xs text-[#748E92] flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 text-[#4FC3C8] shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{meta.breeze}</span>
              </div>

              <div className="mt-3 pt-3 border-t border-[#E8F0EC] flex items-center justify-between text-[11px] text-[#748E92] font-mono">
                <span>
                  {zone.latitude.toFixed(2)}°N, {zone.longitude.toFixed(2)}°E
                </span>
                {isSelected ? (
                  <span className="text-[#087F8C] font-sans font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#087F8C]" />
                    Selected
                  </span>
                ) : (
                  <span className="text-[#748E92] hover:text-[#087F8C] font-sans">
                    Tap to view
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected zone summary note */}
      <div className="mt-6 p-4 rounded-2xl bg-[#E8F4F6]/60 border border-[#087F8C]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#087F8C]">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-[#087F8C] shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <span className="font-medium text-[#132A2F]">
            Showing heat safety indices tuned for{' '}
            <strong>{selectedZone.name}</strong> ({selectedZone.representativeLocation})
          </span>
        </div>
        <span className="text-[#48656A]">
          Coordinates: {selectedZone.latitude}° N, {selectedZone.longitude}° E
        </span>
      </div>
    </section>
  );
}
