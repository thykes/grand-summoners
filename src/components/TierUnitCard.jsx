// src/components/TierUnitCard.jsx
import React from 'react';

export default function TierUnitCard({ unit, onUnitClick }) {
  return (
    <div
      onClick={() => onUnitClick(unit)}
      className="relative group flex flex-col items-center cursor-pointer transform transition-transform duration-200 hover:scale-110"
    >
      <img
        src={unit.Thumbnail_URL || `https://placehold.co/128x128/1f2937/9ca3af?text=${unit.Unit_Name.substring(0, 3).toUpperCase()}`}
        className="w-20 h-20 object-cover rounded-lg border-2 border-gray-700/80 group-hover:border-cyan-400 transition-colors shadow-md"
        alt={`${unit.Unit_Name} Thumbnail`}
        loading="lazy"
      />
      <p className="mt-1.5 text-xs font-semibold text-center text-gray-300 truncate w-20">
        {unit.Unit_Name}
      </p>
    </div>
  );
}