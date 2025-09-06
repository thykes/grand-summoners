// src/components/LoadingStepper.jsx

import React from 'react';

const CheckmarkIcon = () => (
  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin w-5 h-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const PendingIcon = () => (
    <div className="w-5 h-5 flex items-center justify-center">
        <div className="w-2.5 h-2.5 bg-gray-600 rounded-full"></div>
    </div>
);


export default function LoadingStepper({ steps, currentStep }) {
  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 space-y-4">
       <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 mb-4 text-center">
        The AI is crafting your battle plan...
      </h4>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center space-x-4 transition-all duration-300">
          <div className="flex-shrink-0">
            {index < currentStep ? <CheckmarkIcon /> : index === currentStep ? <SpinnerIcon /> : <PendingIcon />}
          </div>
          <p className={`font-semibold ${
            index < currentStep ? 'text-gray-500 line-through' : 
            index === currentStep ? 'text-cyan-300 animate-pulse' : 
            'text-gray-400'
          }`}>
            {step}
          </p>
        </div>
      ))}
    </div>
  );
}