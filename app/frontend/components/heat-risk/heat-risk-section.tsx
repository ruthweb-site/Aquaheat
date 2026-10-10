import React from 'react';
import { MumbaiZone } from '@/types/zone';
import { StatusBadge } from '@/components/ui/status-badge';
import { RiskLevel, HourlyForecastPoint } from '@/types/heat-risk';

export interface TelemetryData {
  zoneId: string;
  zoneName: string;
  representativeLocation: string;
  observation: {
    zoneId: string;
    timestamp: string;
    temperature: number;
    apparentTemperature: number;
    relativeHumidity: number;
    windSpeed: number;
    cloudCover: number;
    precipitation: number;
    solarRadiation: number;
  };
  hourlyForecasts?: HourlyForecastPoint[];
  riskLevel: string;
  futureHeatRiskScore: number | null;
  modelConfidence: number | null;
  riskMethod: string;
  notes: string;
  isPlaceholder: boolean;
}

interface HeatRiskSectionProps {
  selectedZone: MumbaiZone;
  telemetry?: TelemetryData | null;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function HeatRiskSection({
  selectedZone,
  telemetry,
  isLoading = false,
  error = null,
  onRetry,
}: HeatRiskSectionProps) {
  // Format observation time if available
  const formattedTime = React.useMemo(() => {
    if (!telemetry?.observation?.timestamp) return null;
    try {
      const d = new Date(telemetry.observation.timestamp);
      return d.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return null;
    }
  }, [telemetry]);

  const riskBadgeLevel: RiskLevel = React.useMemo(() => {
    const lvl = telemetry?.riskLevel?.toUpperCase();
    if (lvl === 'SAFE' || lvl === 'LOW' || lvl === 'MODERATE' || lvl === 'HIGH' || lvl === 'EXTREME') {
      return lvl as RiskLevel;
    }
    return 'MODERATE';
  }, [telemetry?.riskLevel]);

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
              label={
                isLoading
                  ? 'Updating...'
                  : error
                  ? 'Provider Offline'
                  : telemetry && !telemetry.isPlaceholder
                  ? 'Live Open-Meteo'
                  : 'Staged Baseline'
              }
              level={
                isLoading
                  ? 'INFO'
                  : error
                  ? 'HIGH'
                  : telemetry && !telemetry.isPlaceholder
                  ? riskBadgeLevel
                  : 'PLACEHOLDER'
              }
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
          <span
            className={`w-2 h-2 rounded-full ${
              isLoading ? 'bg-[#F4A340] animate-pulse' : error ? 'bg-[#EF6C57]' : 'bg-[#4CAF7D]'
            }`}
          />
          <span>
            {isLoading
              ? 'Fetching observations...'
              : formattedTime
              ? `Mumbai · Updated at ${formattedTime}`
              : 'Mumbai · Real-Time Station'}
          </span>
        </div>
      </div>

      {/* Loading state skeleton */}
      {isLoading && (
        <div className="relative z-10 mt-8 p-8 rounded-2xl bg-[#FFFFFF]/80 border border-[#E2ECE8] flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#087F8C] border-t-transparent animate-spin" />
          <div className="text-sm font-semibold text-[#132A2F]">
            Connecting to Open-Meteo for {selectedZone.name}...
          </div>
          <p className="text-xs text-[#748E92] max-w-md">
            Querying real coordinates ({selectedZone.latitude}°N, {selectedZone.longitude}°E) for ambient temperature, humidity, and heat index.
          </p>
        </div>
      )}

      {/* Error state with retry */}
      {!isLoading && error && (
        <div className="relative z-10 mt-8 p-6 rounded-2xl bg-[#FDF0ED] border border-[#EF6C57]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#EF6C57]/20 text-[#B83E28] flex items-center justify-center shrink-0 mt-0.5">
              ⚠️
            </div>
            <div>
              <div className="text-sm font-bold text-[#B83E28]">
                Weather Provider Unreachable
              </div>
              <p className="text-xs text-[#961F1F] mt-0.5 leading-relaxed">
                {error}. Atmospheric readings for {selectedZone.name} could not be updated right now.
              </p>
            </div>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#087F8C] text-[#FFFFFF] hover:bg-[#066B76] transition-colors shrink-0 cursor-pointer"
            >
              Retry Connection
            </button>
          )}
        </div>
      )}

      {/* Main hero card layout when data is available */}
      {!isLoading && !error && (
        <div className="relative z-10 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Deterministic Environmental Risk & ML status */}
          <div className="lg:col-span-5 flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF5E7] border border-[#F4A340]/40 text-[#A05C0A] text-xs font-bold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-[#F4A340]" />
              {telemetry?.riskLevel || 'Moderate'} Environmental Risk
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-black text-[#132A2F] tracking-tight">
                {telemetry?.observation ? `${telemetry.observation.apparentTemperature.toFixed(1)}°C` : '39°C'}
              </span>
              <span className="text-sm font-bold text-[#748E92] uppercase">Feels Like</span>
            </div>

            <p className="mt-2 text-xs sm:text-sm text-[#48656A] max-w-sm">
              Ambient heat level derived deterministically from NOAA/NWS heat index criteria for coastal Mumbai.
            </p>

            {/* Environmental vs Personal Exposure clarity banner */}
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
                  Environmental vs Personal Heat
                </p>
                <p className="text-xs text-[#2B774E] mt-0.5 leading-relaxed">
                  These numbers reflect outdoor ambient air. Your personal heat strain depends on physical exertion, shade, and hydration.
                </p>
              </div>
            </div>

            {/* Predictive ML Score Status */}
            <div className="mt-3 text-[11px] text-[#748E92] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#087F8C]" />
              <span>
                Predictive Risk Score: <strong>Pending Phase 5 ML Deployment</strong>
              </span>
            </div>
          </div>

          {/* Right: Real atmospheric measurements from Open-Meteo */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-2 gap-4">
            {/* Ambient Temperature */}
            <div className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#E2ECE8] hover:border-[#D0E6E7] transition-all">
              <div className="flex items-center justify-between text-xs text-[#48656A] font-medium">
                <span>Air Temperature</span>
                <span className="w-2 h-2 rounded-full bg-[#F4A340]" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#132A2F]">
                  {telemetry?.observation ? telemetry.observation.temperature.toFixed(1) : '34'}
                </span>
                <span className="text-lg font-semibold text-[#748E92]">°C</span>
              </div>
              <p className="mt-1 text-xs text-[#748E92]">Dry-bulb station sensor</p>
            </div>

            {/* Feels Like (Apparent Temperature) */}
            <div className="p-5 rounded-2xl bg-[#FEF5E7]/50 border border-[#F4A340]/25 hover:border-[#F4A340]/40 transition-all">
              <div className="flex items-center justify-between text-xs text-[#A05C0A] font-medium">
                <span>Apparent Heat</span>
                <span className="w-2 h-2 rounded-full bg-[#EF6C57]" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#B83E28]">
                  {telemetry?.observation ? telemetry.observation.apparentTemperature.toFixed(1) : '39'}
                </span>
                <span className="text-lg font-semibold text-[#B83E28]/70">°C</span>
              </div>
              <p className="mt-1 text-xs text-[#A05C0A]">Humidity-weighted perceived heat</p>
            </div>

            {/* Relative Humidity */}
            <div className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#E2ECE8] hover:border-[#D0E6E7] transition-all">
              <div className="flex items-center justify-between text-xs text-[#48656A] font-medium">
                <span>Relative Humidity</span>
                <span className="w-2 h-2 rounded-full bg-[#4FC3C8]" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#087F8C]">
                  {telemetry?.observation ? telemetry.observation.relativeHumidity.toFixed(0) : '68'}
                </span>
                <span className="text-lg font-semibold text-[#748E92]">%</span>
              </div>
              <p className="mt-1 text-xs text-[#748E92]">Arabian Sea coastal moisture</p>
            </div>

            {/* Wind Speed & Atmosphere */}
            <div className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#E2ECE8] hover:border-[#D0E6E7] transition-all">
              <div className="flex items-center justify-between text-xs text-[#48656A] font-medium">
                <span>Wind & Sky</span>
                <span className="w-2 h-2 rounded-full bg-[#087F8C]" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#132A2F]">
                  {telemetry?.observation ? telemetry.observation.windSpeed.toFixed(1) : '12'}
                </span>
                <span className="text-lg font-semibold text-[#748E92]">km/h</span>
              </div>
              <p className="mt-1 text-xs text-[#748E92]">
                {telemetry?.observation
                  ? `${telemetry.observation.cloudCover}% clouds · ${telemetry.observation.precipitation}mm rain`
                  : 'Gentle coastal sea breeze'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reassurance footnote */}
      <div className="relative z-10 mt-6 pt-4 border-t border-[#E8F0EC] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#748E92]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#087F8C]" />
          <span>
            Active Node: <strong>{selectedZone.representativeLocation}</strong> ({selectedZone.latitude}°N, {selectedZone.longitude}°E)
          </span>
        </div>
        <span>
          {telemetry && !telemetry.isPlaceholder
            ? 'Live observations verified via Open-Meteo'
            : 'Staged for live sensor & API connection'}
        </span>
      </div>
    </section>
  );
}
