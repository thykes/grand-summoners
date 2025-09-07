// src/components/LoadingStepper.jsx

import React from 'react';

const CheckmarkIcon = () => (
  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin w-5 h-5 text-cyan-400" viewBox="0 0 24 24" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V2a10 10 0 100 20v-2a8 8 0 01-8-8z" />
  </svg>
);

const PendingIcon = () => (
  <div className="w-5 h-5 flex items-center justify-center">
    <div className="w-2.5 h-2.5 bg-gray-600 rounded-full" />
  </div>
);

export default function LoadingStepper({ steps = [], currentStep = 0 }) {
  const total = steps.length || 1;
  const safeIndex = Math.max(0, Math.min(currentStep, total - 1));
  const percent = Math.round(((safeIndex + 1) / total) * 100);

  return (
    <div
      className="bg-gray-900/50 border border-gray-700 radius-md p-6 space-y-5"
      role="status"
      aria-live="polite"
      aria-label={`Generating battle plan: step ${safeIndex + 1} of ${total}`}
    >
      {/* Header with progress */}
      <div className="flex items-center justify-between">
        <h4 className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
          Crafting your battle plan
        </h4>
        <span className="text-xs sm:text-sm font-semibold text-gray-300">
          Step {safeIndex + 1} of {total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-800/80 radius-sm overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Steps list */}
      <ul className="space-y-3">
        {steps.map((step, index) => {
          const state = index < safeIndex ? 'done' : index === safeIndex ? 'active' : 'pending';
          return (
            <li key={index} className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-6 h-6 radius-pill border ${
                  state === 'done' ? 'bg-emerald-500/10 border-emerald-400' :
                  state === 'active' ? 'bg-cyan-500/10 border-cyan-400' :
                  'bg-gray-800/70 border-gray-700'
                }`}>
                {state === 'done' ? <CheckmarkIcon /> : state === 'active' ? <SpinnerIcon /> : <PendingIcon />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${
                  state === 'done' ? 'text-gray-500 line-through' :
                  state === 'active' ? 'text-cyan-300' :
                  'text-gray-400'
                }`}>
                  {step}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
