'use client';

import React, { useState } from 'react';
import { ActivityType } from '@/types/heat-risk';

interface ActivityOption {
  id: ActivityType;
  title: string;
  tagline: string;
  hydration: string;
  breakFrequency: string;
  tips: string;
  icon: (className?: string) => React.ReactNode;
}

export function PersonalExposureSection() {
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityType>('WALKING');

  const activities: ActivityOption[] = [
    {
      id: 'WALKING',
      title: 'Walking',
      tagline: 'Errands, markets & neighborhood strolls',
      hydration: '350 - 500 ml / hour',
      breakFrequency: 'Pause every 20-30 min under tree cover or awnings',
      tips: 'Carry an umbrella or wide hat for direct sunlight. Walk on the shaded side of the street.',
      icon: (className = 'w-6 h-6') => (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="5" r="2" />
          <path d="M10 22l2-7 3 3v6" />
          <path d="M14 13l2-3-4-2-3 4 2 2" />
        </svg>
      ),
    },
    {
      id: 'EXERCISE',
      title: 'Exercise',
      tagline: 'Gym, running, sports & fitness',
      hydration: '750 - 1000 ml / hour + electrolytes',
      breakFrequency: 'Cool down every 15 min with chilled sips',
      tips: 'Schedule workouts before 8:30 AM or after 6:30 PM. Swap heavy outdoor cardio for indoor routines.',
      icon: (className = 'w-6 h-6') => (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 20a6 6 0 0 0-12 0" />
          <circle cx="12" cy="10" r="4" />
          <circle cx="12" cy="12" r="1" />
        </svg>
      ),
    },
    {
      id: 'OUTDOOR_LABOR',
      title: 'Outdoor Work',
      tagline: 'Delivery partners, construction & field staff',
      hydration: '800 - 1000 ml / hour + salted lime water',
      breakFrequency: 'Mandatory 10-15 min rest every 45 min in shaded rest stops',
      tips: 'Dampen a bandana or towel for your neck. Avoid prolonged continuous heavy lifting between 1 PM and 3:30 PM.',
      icon: (className = 'w-6 h-6') => (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V8L2 13z" />
          <path d="M12 4v4" />
        </svg>
      ),
    },
    {
      id: 'TRAVELLING',
      title: 'Travelling',
      tagline: 'Local trains, metro, buses & autos',
      hydration: '500 ml / hour',
      breakFrequency: 'Carry water onto platforms; avoid direct tin-shed heat',
      tips: 'Carry hand fans or wet wipes for packed train compartments. Drink water before boarding and after deboarding.',
      icon: (className = 'w-6 h-6') => (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="15" rx="3" />
          <path d="M3 11h18" />
          <circle cx="7" cy="15" r="1" />
          <circle cx="17" cy="15" r="1" />
          <path d="M6 18l-2 3" />
          <path d="M18 18l2 3" />
        </svg>
      ),
    },
    {
      id: 'SCHOOL_COLLEGE',
      title: 'School / College',
      tagline: 'Students, educators & campus commute',
      hydration: '400 - 600 ml / hour',
      breakFrequency: 'Rest in airy corridors during lunch breaks',
      tips: 'Keep a full refillable water bottle in your bag. Remind classmates to drink water throughout morning classes.',
      icon: (className = 'w-6 h-6') => (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
    {
      id: 'INDOOR',
      title: 'Staying Indoors',
      tagline: 'Working from home, shop or residential',
      hydration: '250 - 350 ml / hour',
      breakFrequency: 'Stand up and stretch near airy windows every hour',
      tips: 'Draw curtains or blinds against afternoon direct sun. Keep cross-ventilation fans circulating air.',
      icon: (className = 'w-6 h-6') => (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
  ];

  const currentOption =
    activities.find((a) => a.id === selectedActivity) || activities[0];

  return (
    <section
      id="personal-safety"
      aria-labelledby="personal-safety-heading"
      className="aqua-card rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#E2ECE8]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-6 rounded-full bg-[#087F8C]" />
            <h2
              id="personal-safety-heading"
              className="text-xl sm:text-2xl font-bold tracking-tight text-[#132A2F]"
            >
              What are you doing today?
            </h2>
          </div>
          <p className="mt-1 text-sm text-[#48656A]">
            Select your activity for personal hydration rates and comfortable pacing
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#EBF7F0] text-[#1E6B43] border border-[#4CAF7D]/30 self-start sm:self-auto">
          Personal Care Mode
        </span>
      </div>

      {/* 6 Large touch-friendly cards */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {activities.map((act) => {
          const isSelected = act.id === selectedActivity;

          return (
            <button
              key={act.id}
              type="button"
              onClick={() => setSelectedActivity(act.id)}
              className={`p-4 rounded-2xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[120px] ${
                isSelected
                  ? 'bg-[#FFFFFF] border-[#087F8C] ring-2 ring-[#087F8C]/20 shadow-[0_6px_16px_-2px_rgba(8,127,140,0.18)] scale-[1.02]'
                  : 'bg-[#F8FAF7] border-[#E2ECE8] hover:border-[#D0E6E7] hover:bg-[#FFFFFF]'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 transition-colors ${
                  isSelected
                    ? 'bg-[#E8F4F6] text-[#087F8C]'
                    : 'bg-[#FFFFFF] text-[#48656A] border border-[#E2ECE8]'
                }`}
              >
                {act.icon('w-6 h-6')}
              </div>

              <div className="font-bold text-sm text-[#132A2F]">
                {act.title}
              </div>
              <div className="text-[10px] text-[#748E92] mt-0.5 line-clamp-1">
                {act.tagline}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Activity Personalized Guidance Box */}
      <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#E8F4F6] to-[#EBF7F0] p-6 border border-[#D0E6E7] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#087F8C]" />
            <h3 className="text-base font-bold text-[#132A2F]">
              Comfort Plan for {currentOption.title}
            </h3>
          </div>
          <p className="text-xs text-[#48656A] leading-relaxed max-w-2xl">
            {currentOption.tips}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0 w-full md:w-auto">
          {/* Hydration badge */}
          <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E2ECE8] text-center min-w-[150px]">
            <span className="text-[11px] font-medium text-[#748E92] block">
              Suggested Fluids
            </span>
            <span className="text-sm font-extrabold text-[#087F8C]">
              {currentOption.hydration}
            </span>
          </div>

          {/* Break frequency */}
          <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E2ECE8] text-center min-w-[150px]">
            <span className="text-[11px] font-medium text-[#748E92] block">
              Pacing Advice
            </span>
            <span className="text-xs font-bold text-[#1E6B43]">
              {currentOption.breakFrequency}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
