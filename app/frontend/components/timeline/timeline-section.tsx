import React from 'react';
import { HOURLY_TIMELINE_PREVIEW } from '@/lib/constants';
import { StatusBadge } from '@/components/ui/status-badge';

export function TimelineSection() {
  const getLevelColor = (level: string) => {
    switch (level) {
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
      default:
        return {
          bar: 'bg-[#F4A340]',
          bg: 'bg-[#FEF5E7]',
          text: 'text-[#A05C0A]',
          border: 'border-[#F4A340]/30',
        };
    }
  };

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
              24-Hour Heat Timeline
            </h2>
          </div>
          <p className="mt-1 text-sm text-[#48656A]">
            Plan your day around the heat trajectory — color shifts show when to seek shade
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge
            label="Peak Heat Window: 1 PM - 4 PM"
            level="HIGH"
            size="sm"
          />
        </div>
      </div>

      {/* Horizontal timeline cards with gradual risk color change */}
      <div className="mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {HOURLY_TIMELINE_PREVIEW.map((point) => {
            const styles = getLevelColor(point.level);
            const isPeak = point.score >= 82;

            return (
              <div
                key={point.time}
                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  isPeak
                    ? 'bg-[#FFFFFF] border-[#EF6C57]/40 shadow-sm ring-1 ring-[#EF6C57]/20'
                    : 'bg-[#F8FAF7] border-[#E2ECE8] hover:bg-[#FFFFFF]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#132A2F]">
                      {point.time}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${styles.bar}`}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Heat Risk Score */}
                  <div className="mt-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-[#132A2F]">
                        {point.score}
                      </span>
                      <span className="text-[10px] text-[#748E92]">/100</span>
                    </div>

                    <div className="mt-1 text-xs font-semibold text-[#48656A]">
                      {point.temp}°C
                    </div>
                    <div className="text-[10px] text-[#748E92]">
                      Feels {point.feelsLike}°C
                    </div>
                  </div>
                </div>

                {/* Risk Level Badge */}
                <div className="mt-4 pt-2 border-t border-[#E8F0EC]">
                  <span
                    className={`block text-center text-[10px] font-bold py-1 px-1 rounded-lg ${styles.bg} ${styles.text}`}
                  >
                    {point.level}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gentle scheduling advice */}
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
            Helpful Daily Rhythm:
          </strong>{' '}
          Heat rises gradually after 11:00 AM and peaks between 1:00 PM and 4:00 PM
          before sea breezes bring evening relief. If you need to do heavy physical
          activity, consider the morning hours before noon or after 5:30 PM.
        </p>
      </div>
    </section>
  );
}
