import React from 'react';
import { EMERGENCY_CONTACTS } from '@/lib/constants';

export function EmergencySection() {
  return (
    <section
      id="emergency-help"
      aria-labelledby="emergency-heading"
      className="rounded-3xl p-6 sm:p-8 md:p-10 bg-[#FFFFFF] border-2 border-[#EF6C57]/30 shadow-[0_8px_30px_-6px_rgba(239,108,87,0.12)] relative overflow-hidden"
    >
      {/* Calm protective ambient tint */}
      <div
        className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#EF6C57]/5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F5D8D3]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF0ED] border border-[#EF6C57]/30 text-[#B83E28] text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-[#EF6C57] animate-pulse" />
            Rapid Response & Care
          </div>
          <h2
            id="emergency-heading"
            className="text-2xl sm:text-3xl font-black tracking-tight text-[#132A2F]"
          >
            Need help right now?
          </h2>
          <p className="mt-1 text-sm text-[#48656A]">
            If you or someone near you feels dizzy, faint, or unusually hot, free help is immediately available
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FDF0ED] border border-[#EF6C57]/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D64545] text-white flex items-center justify-center font-black text-sm shrink-0">
            108
          </div>
          <div>
            <div className="text-xs font-bold text-[#961F1F]">
              Maharashtra Ambulance
            </div>
            <a
              href="tel:108"
              className="text-xs font-semibold text-[#D64545] hover:underline"
            >
              Tap to dial 108 (Toll-Free)
            </a>
          </div>
        </div>
      </div>

      {/* Symptom Checker: Heat Exhaustion vs Heat Stroke */}
      <div className="relative z-10 mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Heat Exhaustion Card */}
        <div className="p-5 rounded-2xl bg-[#FEF5E7]/50 border border-[#F4A340]/40">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-base text-[#A05C0A]">
              Heat Exhaustion (Urgent Care)
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF5E7] text-[#A05C0A] border border-[#F4A340]/40">
              Needs Immediate Cool Down
            </span>
          </div>

          <p className="text-xs text-[#48656A] mb-3 leading-relaxed">
            Occurs when the body loses excessive water and salts through heavy sweating.
          </p>

          <div className="space-y-1.5 text-xs text-[#132A2F] mb-4">
            <div className="font-semibold text-[#A05C0A]">Signs to look for:</div>
            <ul className="space-y-1 list-disc list-inside text-[#48656A]">
              <li>Heavy sweating with cool, pale, or clammy skin</li>
              <li>Lightheadedness, dizziness, or mild nausea</li>
              <li>Weakness, fatigue, or headache</li>
              <li>Fast but weak pulse</li>
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#F4A340]/30 text-xs text-[#8B4B00]">
            <strong>What to do:</strong> Move to shade or AC immediately. Loosen tight clothes. Sip cool water or ORS slowly.
          </div>
        </div>

        {/* Heat Stroke Card */}
        <div className="p-5 rounded-2xl bg-[#FDF0ED] border border-[#EF6C57]/50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-base text-[#B83E28]">
              Heat Stroke (Medical Emergency)
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FCEBEB] text-[#961F1F] border border-[#D64545]/40 animate-pulse">
              Call 108 Immediately
            </span>
          </div>

          <p className="text-xs text-[#48656A] mb-3 leading-relaxed">
            The body’s cooling system shuts down. Body temperature climbs above 40°C (104°F).
          </p>

          <div className="space-y-1.5 text-xs text-[#132A2F] mb-4">
            <div className="font-semibold text-[#B83E28]">Red flag danger signs:</div>
            <ul className="space-y-1 list-disc list-inside text-[#7A2516]">
              <li>Hot, red, dry skin (or ceased sweating)</li>
              <li>Confusion, slurred speech, delirium, or passing out</li>
              <li>Rapid, strong, pounding pulse</li>
              <li>Seizures or unresponsiveness</li>
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#EF6C57]/40 text-xs text-[#961F1F]">
            <strong>What to do:</strong> Call <strong>108</strong> without delay. Cool the person with damp towels, cold water, or ice packs around neck and underarms.
          </div>
        </div>
      </div>

      {/* Verified Mumbai Helplines */}
      <div className="relative z-10 mt-8">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#48656A] mb-3">
          Mumbai Emergency & Civic Helplines
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {EMERGENCY_CONTACTS.map((contact) => (
            <div
              key={contact.phone}
              className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2ECE8] flex flex-col justify-between hover:border-[#D0E6E7] hover:bg-[#FFFFFF] transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-[#087F8C]">
                    {contact.phone}
                  </span>
                  {contact.isTollFree && (
                    <span className="text-[10px] font-bold text-[#1E6B43] bg-[#EBF7F0] px-2 py-0.5 rounded-full border border-[#4CAF7D]/30">
                      Toll-Free
                    </span>
                  )}
                </div>

                <div className="text-xs font-bold text-[#132A2F] mt-1.5">
                  {contact.service}
                </div>
                <div className="text-[11px] text-[#48656A] mt-0.5 font-medium">
                  {contact.agency}
                </div>
                <p className="mt-2 text-xs text-[#748E92] leading-relaxed">
                  {contact.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E8F0EC]">
                <a
                  href={`tel:${contact.phone}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#087F8C] hover:bg-[#076873] text-white text-xs font-bold shadow-sm transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Call {contact.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
