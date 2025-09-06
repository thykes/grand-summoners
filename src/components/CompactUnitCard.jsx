// src/components/CompactUnitCard.jsx
import React from 'react';
import { getArtGenInfo } from '../data/artGenGroups';

export default function CompactUnitCard({ unit, onUnitClick, isSelected, onToggleSelect }) {
  const artGenInfo = getArtGenInfo(unit.Unit_Name);
  const artGenString = artGenInfo ? `Type ${artGenInfo.type}` : "None";
  
  const handleToggle = (e) => {
    e.stopPropagation();
    if (onToggleSelect) onToggleSelect(unit.id);
  };
  
  return (
    <div 
      onClick={() => onUnitClick(unit)}
      className="relative group flex flex-col items-center cursor-pointer transform transition-transform duration-200 hover:scale-105"
    >
      <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${isSelected ? 'glow-border' : 'border-2 border-transparent'}`}></div>
      <button 
        onClick={handleToggle}
        className={`absolute top-1 right-1 z-10 w-6 h-6 flex items-center justify-center rounded-full text-white font-bold text-sm 
                   transition-all transform group-hover:scale-110 
                   ${isSelected ? 'bg-green-500 hover:bg-green-400' : 'bg-gray-600/80 hover:bg-blue-500'}`}
        aria-label={isSelected ? 'Remove from collection' : 'Add to collection'}
      >
        {isSelected ? '✓' : '+'}
      </button>
      <img
        src={unit.Thumbnail_URL || `https://placehold.co/128x128/1f2937/9ca3af?text=${unit.Unit_Name.substring(0, 3).toUpperCase()}`}
        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-700/80 group-hover:border-cyan-400 transition-colors shadow-md"
        alt={`${unit.Unit_Name} Thumbnail`}
        loading="lazy"
      />
      <p className="mt-2 text-sm font-semibold text-center text-gray-300 truncate w-24">
        {unit.Unit_Name}
      </p>
      <div className="absolute bottom-full mb-2 w-48 p-3 bg-gray-900/90 backdrop-blur-sm border border-gray-600 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10 transform group-hover:-translate-y-1">
        <h4 className="font-bold text-white text-base">{unit.Unit_Name}</h4>
        <p className="text-sm text-gray-400">{unit.Element} - {unit.Primary_Archetype}</p>
        <p className="text-sm font-bold text-cyan-400 mt-1">Art Gen: {artGenString}</p>
        <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900/90 border-b border-r border-gray-600 transform rotate-45"></div>
      </div>
    </div>
  );
};