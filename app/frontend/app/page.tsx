'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { HeatRiskSection, TelemetryData } from '@/components/heat-risk/heat-risk-section';
import { ZoneSelectorSection } from '@/components/zones/zone-selector-section';
import { TimelineSection } from '@/components/timeline/timeline-section';
import { PersonalExposureSection } from '@/components/exposure/exposure-section';
import { RecommendationsSection } from '@/components/recommendations/recommendations-section';
import { EmergencySection } from '@/components/emergency/emergency-section';
import { DEFAULT_SELECTED_ZONE } from '@/lib/zones';
import { MumbaiZone } from '@/types/zone';

export default function HomePage() {
  const [selectedZone, setSelectedZone] =
    useState<MumbaiZone>(DEFAULT_SELECTED_ZONE);
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const backendBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
    const url = backendBase
      ? `${backendBase}/weather?zoneId=${encodeURIComponent(selectedZone.id)}`
      : `/api/weather?zoneId=${encodeURIComponent(selectedZone.id)}`;

    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}: Failed to fetch weather`);
      }

      const data: TelemetryData = await res.json();
      setTelemetry(data);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Weather request timed out. Please try again.');
      } else {
        const msg = err instanceof Error ? err.message : 'Unable to connect to weather provider';
        setError(msg);
      }
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }, [selectedZone.id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWeather();
  }, [fetchWeather]);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAF7] text-[#132A2F]">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10 sm:space-y-12">
        {/* Welcoming, calm intro hero */}
        <section
          aria-label="Welcome to AquaHeat"
          className="relative rounded-3xl bg-gradient-to-br from-[#FFFFFF] via-[#F8FAF7] to-[#E8F4F6] p-7 sm:p-10 border border-[#E2ECE8] shadow-[0_4px_24px_-4px_rgba(8,127,140,0.06)] overflow-hidden"
        >
          {/* Subtle water ripple & warm sun backdrop glow */}
          <div
            className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#4FC3C8]/15 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#F4A340]/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F4F6] text-[#087F8C] border border-[#087F8C]/20 mb-3.5">
              <span className="w-2 h-2 rounded-full bg-[#087F8C]" />
              AquaHeat · Mumbai Heat Safety
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#132A2F] leading-tight">
              Stay cool, safe, and protected across{' '}
              <span className="text-[#087F8C]">Mumbai.</span>
            </h1>

            <p className="mt-2.5 text-base sm:text-lg font-semibold text-[#087F8C] tracking-wide flex items-center gap-2">
              <span>Predict</span>
              <span className="text-[#4FC3C8]">→</span>
              <span>Prevent</span>
              <span className="text-[#4FC3C8]">→</span>
              <span>Respond</span>
            </p>

            <p className="mt-3 text-sm sm:text-base text-[#48656A] leading-relaxed">
              We help you understand how coastal humidity and afternoon heat
              impact your neighborhood, so you can plan your day with confidence,
              comfort, and peace of mind.
            </p>
          </div>

          {/* Quick reassuring highlights */}
          <div className="relative z-10 mt-8 pt-6 border-t border-[#E8F0EC] grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E2ECE8] flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#E8F4F6] text-[#087F8C] flex items-center justify-center font-bold shrink-0">
                6
              </div>
              <div>
                <div className="font-bold text-[#132A2F]">Mumbai Zones</div>
                <div className="text-[#748E92] text-[11px]">Local micro-climate views</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E2ECE8] flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#EBF7F0] text-[#1E6B43] flex items-center justify-center font-bold shrink-0">
                💧
              </div>
              <div>
                <div className="font-bold text-[#132A2F]">Personal Safety</div>
                <div className="text-[#748E92] text-[11px]">Hydration & shade pacing</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E2ECE8] flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#FDF0ED] text-[#D64545] flex items-center justify-center font-bold shrink-0">
                108
              </div>
              <div>
                <div className="font-bold text-[#132A2F]">Emergency Help</div>
                <div className="text-[#748E92] text-[11px]">Free 24x7 ambulance support</div>
              </div>
            </div>
          </div>
        </section>

        {/* 1. CURRENT HEAT RISK */}
        <HeatRiskSection
          selectedZone={selectedZone}
          telemetry={telemetry}
          isLoading={isLoading}
          error={error}
          onRetry={fetchWeather}
        />

        {/* 2. MUMBAI HEAT ZONES */}
        <ZoneSelectorSection
          selectedZone={selectedZone}
          onSelectZone={setSelectedZone}
        />

        {/* 3. 24-HOUR HEAT TIMELINE */}
        <TimelineSection
          forecasts={telemetry?.hourlyForecasts}
          isLoading={isLoading}
          error={error}
        />

        {/* 4. PERSONAL SAFETY (What are you doing today?) */}
        <PersonalExposureSection />

        {/* 5. SAFETY & COMFORT RECOMMENDATIONS */}
        <RecommendationsSection />

        {/* 6. EMERGENCY HEAT GUIDANCE (Need help right now?) */}
        <EmergencySection />
      </main>

      <Footer />
    </div>
  );
}
