'use client';

import React, { useState } from 'react';
import { SUPPORTIVE_RECOMMENDATIONS } from '@/lib/constants';

export function RecommendationsSection() {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', label: 'All Guidance' },
    { id: 'GENERAL', label: 'Daily Timing' },
    { id: 'HYDRATION', label: 'Cooling Drinks' },
    { id: 'WORKERS', label: 'Work & Transit' },
    { id: 'VULNERABLE', label: 'Elders & Family' },
  ];

  const filteredAdvisories =
    activeCategory === 'ALL'
      ? SUPPORTIVE_RECOMMENDATIONS
      : SUPPORTIVE_RECOMMENDATIONS.filter(
          (adv) => adv.category === activeCategory
        );

  return (
    <section
      id="safety-guidance"
      aria-labelledby="guidance-heading"
      className="aqua-card rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#E2ECE8]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-6 rounded-full bg-[#4CAF7D]" />
            <h2
              id="guidance-heading"
              className="text-xl sm:text-2xl font-bold tracking-tight text-[#132A2F]"
            >
              Comfort & Safety Guidance
            </h2>
          </div>
          <p className="mt-1 text-sm text-[#48656A]">
            Supportive, everyday habits to keep you and your loved ones cool and well
          </p>
        </div>

        {/* Category filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#087F8C] text-[#FFFFFF] shadow-sm'
                    : 'bg-[#F1F6F4] text-[#48656A] hover:bg-[#E8F4F6] hover:text-[#087F8C]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Supportive recommendation cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAdvisories.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#E2ECE8] hover:border-[#D0E6E7] hover:bg-[#FFFFFF] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="font-bold text-base text-[#132A2F]">
                  {item.title}
                </h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EBF7F0] text-[#1E6B43] border border-[#4CAF7D]/30">
                  Helpful Tip
                </span>
              </div>

              <p className="text-xs font-medium text-[#087F8C] mb-3">
                {item.description}
              </p>

              <ul className="space-y-2 text-xs text-[#48656A]">
                {item.bulletPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4FC3C8] mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E8F0EC] flex items-center justify-between text-[11px] text-[#748E92]">
              <span>Recommended by Mumbai Health Advisory</span>
              <span className="text-[#087F8C] font-semibold">Easy habit</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
