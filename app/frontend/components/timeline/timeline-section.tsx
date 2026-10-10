import React from 'react';
import { StatusBadge } from '@/components/ui/status-badge';
import { HourlyForecastPoint, RiskLevel } from '@/types/heat-risk';

interface TimelineSectionProps {
  forecasts?: HourlyForecastPoint[] | null;
  isLoading?: boolean;
  error?: string | null;
}

export function TimelineSection({
  forecasts,
  isLoading = false,
  error = null,
}: TimelineSectionProps) {
  const getLevelColor = (level: string) => {
    switch (level?.toUpperCase()) {
      case 'SAFE':
        return {
          bar: 'bg-[#4CAF7D]',
          bg: 'bg-[#EBF7F0]',
          text: 'text-[#1E6B43]',
          border: 'border-[#4CAF7D]/30',
        };
      case 'HIGH':
        return {
          bar: 'bg-[#EF6C57]',
          bg: 'bg-[#FDF0ED]',
          text: 'text-[#B83E28]',
          border: 'border-[#EF6C57]/35',
        };
      case 'EXTREME':
        return {
          bar: 'bg-[#D64545]',
          bg: 'bg-[#FCEBEB]',
          text: 'text-[#961F1F]',
          border: 'border-[#D64545]/40',
        };
      case 'MODERATE':
        return {
          bar: 'bg-[#F4A340]',
          bg: 'bg-[#FEF5E7]',
          text: 'text-[#A05C0A]',
          border: 'border-[#F4A340]/30',
        };
      case 'LOW':
      default:
        return {
          bar: 'bg-[#4FC3C8]',
          bg: 'bg-[#E8F4F6]',
          text: 'text-[#087F8C]',
          border: 'border-[#4FC3C8]/30',
        };
    }
  };

  const formatTimeLabel = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        hour12: true,
      }).format(date);
    } catch {
      return timestamp;
    }
  };

  const formatDayLabel = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
      }).format(date);
    } catch {
      return '';
    }
  };

  // Find peak forecast window dynamically from real forecast points
  const peakForecastPoint = React.useMemo(() => {
    if (!forecasts || forecasts.length === 0) return null;
    return forecasts.reduce((max, point) =>
      point.apparentTemperature > max.apparentTemperature ? point : max
    );
  }, [forecasts]);

  const peakBadgeLabel = React.useMemo(() => {
    if (!peakForecastPoint) return null;
    const time = formatTimeLabel(peakForecastPoint.timestamp);
    const day = formatDayLabel(peakForecastPoint.timestamp);
    return `Peak Forecast: ${day} ${time} · Feels ${peakForecastPoint.apparentTemperature}°C`;
  }, [peakForecastPoint]);

  const peakBadgeLevel: RiskLevel = React.useMemo(() => {
    if (!peakForecastPoint?.riskLevel) return 'MODERATE';
    return peakForecastPoint.riskLevel;
  }, [peakForecastPoint]);

  return (
    <section
      id="heat-timeline"
      aria-labelledby="timeline-heading"
      className="aqua-card rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#E2ECE8]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-6 rounded-full bg-[#F4A340]" />
            <h2
              id="timeline-heading"
              className="text-xl sm:text-2xl font-bold tracking-tight text-[#132A2F]"
            >
              24-Hour Heat Forecast Timeline
            </h2>
          </div>
          <p className="mt-1 text-sm text-[#48656A]">
            Hourly atmospheric model projections in IST (Asia/Kolkata) — plan ahead to seek shade during peak periods
          </p>
        </div>

        <div className="flex items-center gap-2">
          {peakBadgeLabel ? (
            <StatusBadge
              label={peakBadgeLabel}
              level={peakBadgeLevel}
              size="sm"
            />
          ) : (
            <StatusBadge
              label="Forecast: Ingesting Live Data"
              level="SAFE"
              size="sm"
            />
          )}
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3" role="status" aria-label="Loading forecast timeline">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl border border-[#E2ECE8] bg-[#F8FAF7] animate-pulse flex flex-col justify-between h-44"
            >
              <div className="space-y-2">
                <div className="h-3 w-12 bg-[#E2ECE8] rounded" />
                <div className="h-2 w-8 bg-[#E2ECE8] rounded" />
                <div className="h-6 w-14 bg-[#E2ECE8] rounded mt-4" />
                <div className="h-3 w-16 bg-[#E2ECE8] rounded" />
              </div>
              <div className="h-4 w-full bg-[#E2ECE8] rounded mt-4" />
            </div>
          ))}
        </div>
      )}

      {/* Unavailable State (Error or empty forecast array — no fabricated values) */}
      {!isLoading && (error || !forecasts || forecasts.length === 0) && (
        <div className="my-6 p-8 rounded-2xl bg-[#FFFFFF] border border-[#E2ECE8] text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#FEF5E7] text-[#A05C0A] flex items-center justify-center font-bold text-xl mb-3">
            ⏱
          </div>
          <h3 className="text-base font-bold text-[#132A2F]">
            24-Hour Forecast Unavailable
          </h3>
          <p className="mt-1 text-xs text-[#748E92] max-w-md mx-auto leading-relaxed">
            Live hourly atmospheric predictions for this zone are currently unavailable from the Open-Meteo weather service. Current observations remain active above.
          </p>
        </div>
      )}

      {/* Real Hourly Forecast Cards */}
      {!isLoading && forecasts && forecasts.length > 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {forecasts.map((point) => {
              const styles = getLevelColor(point.riskLevel);
              const isPeak =
                point.apparentTemperature >= 41 ||
                (peakForecastPoint &&
                  point.apparentTemperature === peakForecastPoint.apparentTemperature);
              const timeLabel = formatTimeLabel(point.timestamp);
              const dayLabel = formatDayLabel(point.timestamp);

              return (
                <div
                  key={point.timestamp}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                    isPeak
                      ? 'bg-[#FFFFFF] border-[#EF6C57]/40 shadow-sm ring-1 ring-[#EF6C57]/20'
                      : 'bg-[#F8FAF7] border-[#E2ECE8] hover:bg-[#FFFFFF]'
                  }`}
                >
                  <div>
                    {/* Header: Local Time & Risk Indicator */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-[#132A2F] block">
                          {timeLabel}
                        </span>
                        <span className="text-[10px] text-[#748E92] block font-medium">
                          {dayLabel}
                        </span>
                      </div>
                      <span
                        className={`w-2 h-2 rounded-full ${styles.bar}`}
                        aria-hidden="true"
                        title={`Forecast Risk: ${point.riskLevel}`}
                      />
                    </div>

                    {/* Forecast Label Badge */}
                    <div className="mt-2">
                      <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-[#087F8C] bg-[#E8F4F6] px-1.5 py-0.5 rounded">
                        Forecast
                      </span>
                    </div>

                    {/* Forecast Temperature & Feels-Like */}
                    <div className="mt-2.5">
                      <div className="text-lg font-black text-[#132A2F] tracking-tight">
                        {point.temperature}°C
                      </div>
                      <div className="text-[11px] font-semibold text-[#48656A] mt-0.5">
                        Feels {point.apparentTemperature}°C
                      </div>
                      <div className="text-[10px] text-[#748E92] mt-0.5">
                        ML Score: <span className="font-medium text-[#A05C0A]">PENDING</span>
                      </div>
                    </div>
                  </div>

                  {/* Deterministic NOAA Risk Level Badge */}
                  <div className="mt-3 pt-2 border-t border-[#E8F0EC]">
                    <span
                      className={`block text-center text-[10px] font-bold py-1 px-1 rounded-lg ${styles.bg} ${styles.text}`}
                    >
                      {point.riskLevel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Daily Rhythm Guidance */}
      <div className="mt-6 p-4 rounded-2xl bg-[#FEF5E7]/70 border border-[#F4A340]/30 flex items-start gap-3">
        <svg
          className="w-5 h-5 text-[#F4A340] shrink-0 mt-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <p className="text-xs text-[#A05C0A] leading-relaxed">
          <strong className="font-semibold text-[#8B4B00]">
            Mumbai Coastal Forecast Guidance:
          </strong>{' '}
          Heat index rises sharply when high afternoon solar radiation meets coastal humidity.
          Values shown are server-side Open-Meteo forecasts in Indian Standard Time (IST).
          If planning strenuous outdoor exertion, favor morning hours before 11:00 AM or after 5:30 PM.
        </p>
      </div>
    </section>
  );
}
