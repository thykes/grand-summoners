// src/components/TierRow.jsx
import React from 'react';
import TierUnitCard from './TierUnitCard';

const tierColorMap = {
  'SS': 'bg-red-600/90 border-red-400 text-red-100',
  'S+': 'bg-orange-500/90 border-orange-300 text-orange-100',
  'S': 'bg-amber-500/90 border-amber-300 text-amber-100',
  'A+': 'bg-yellow-500/90 border-yellow-300 text-yellow-100',
  'A': 'bg-lime-500/90 border-lime-300 text-lime-100',
  'A-': 'bg-lime-600/90 border-lime-400 text-lime-100',
  'B+': 'bg-green-500/90 border-green-300 text-green-100',
  'B': 'bg-teal-500/90 border-teal-300 text-teal-100',
  'B-': 'bg-teal-600/90 border-teal-400 text-teal-100',
  'C+': 'bg-cyan-600/90 border-cyan-400 text-cyan-100',
  'C': 'bg-sky-600/90 border-sky-400 text-sky-100',
  'C-': 'bg-sky-700/90 border-sky-500 text-sky-100',
  'D': 'bg-indigo-600/90 border-indigo-400 text-indigo-100',
  'Default': 'bg-slate-700/90 border-slate-500 text-slate-200'
};

export default function TierRow({ tier, units, onUnitClick }) {
  const tierStyle = tierColorMap[tier] || tierColorMap['Default'];
  
  return (
    <div className="flex flex-col md:flex-row items-start mb-8 card p-4">
      <div className="flex-shrink-0 w-full md:w-24 flex items-center justify-center mb-4 md:mb-0">
        <h2 className={`text-4xl font-black w-20 h-20 rounded-lg flex items-center justify-center border-2 shadow-lg ${tierStyle}`}>
          {tier}
        </h2>
      </div>
      <div className="flex-grow w-full md:pl-4">
         <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-x-2 gap-y-4">
          {units.map(unit => (
            <TierUnitCard unit={unit} key={unit.id} onUnitClick={onUnitClick} />
          ))}
        </div>
      </div>
    </div>
  );
}
