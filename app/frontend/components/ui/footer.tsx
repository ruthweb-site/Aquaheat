import React from 'react';
import { APP_METADATA } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[#E2ECE8] bg-[#FFFFFF] py-10 text-xs text-[#748E92]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#132A2F] text-sm">{APP_METADATA.name}</span>
              <span className="text-[#D0E0DC]">·</span>
              <span className="text-[#087F8C] font-semibold">{APP_METADATA.tagline}</span>
            </div>
            <p className="mt-1 text-[#48656A] max-w-xl leading-relaxed">
              Civic heat-safety intelligence and daily well-being companion designed for the
              communities, neighborhoods, and commuters of Greater Mumbai.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl border border-[#D0E6E7] bg-[#E8F4F6]/50 text-[#087F8C] text-xs max-w-md">
            <span className="font-bold block text-[#132A2F] mb-0.5">Heat Safety Commitment</span>
            Designed to protect health, reduce urban heat strain, and provide reliable,
            calm guidance during coastal summer days.
          </div>
        </div>

        <div className="pt-4 border-t border-[#E8F0EC] flex flex-col sm:flex-row items-center justify-between gap-3 text-[#748E92]">
          <p>© 2026 AquaHeat. Built for Mumbai Heat Safety.</p>
          <p className="flex items-center gap-2">
            <span>Aligned with NDMA & BMC Heat Action Plan standards</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
