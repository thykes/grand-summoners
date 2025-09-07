// src/components/CompactEquipCard.jsx
import React from 'react';

const EquipCounter = ({ count, onIncrement, onDecrement }) => {
  if (count === 0) {
    return (
      <button 
        onClick={onIncrement} 
        className="absolute top-1 right-1 z-10 w-6 h-6 flex items-center justify-center rounded-full text-white font-bold text-sm bg-gray-600/80 hover:bg-blue-500 transition-all transform group-hover:scale-110"
        aria-label="Add to collection"
      >
        +
      </button>
    );
  }
  return (
    <div className="absolute top-1 right-1 z-10 flex items-center justify-center bg-green-600 rounded-full text-white shadow-lg text-xs font-bold">
      <button onClick={onDecrement} className="w-5 h-6 rounded-l-full hover:bg-green-500">-</button>
      <span className="px-1.5">{count}</span>
      <button onClick={onIncrement} className="w-5 h-6 rounded-r-full hover:bg-green-500">+</button>
    </div>
  );
};

export default function CompactEquipCard({ equip, onEquipClick, count, onIncrement, onDecrement }) {
  return (
    <div 
      onClick={() => onEquipClick(equip)}
      className="relative group flex flex-col items-center cursor-pointer transform transition-transform duration-200 hover:scale-105"
    >
      <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${count > 0 ? 'glow-border' : 'border-2 border-transparent'}`}></div>
      <EquipCounter 
        count={count}
        onIncrement={(e) => { e.stopPropagation(); onIncrement(equip.id); }}
        onDecrement={(e) => { e.stopPropagation(); onDecrement(equip.id); }}
      />
      <img
        src={equip.Thumbnail_URL || `https://placehold.co/128x128/1f2937/9ca3af?text=EQ`}
        className="w-24 h-24 object-contain bg-gray-900/50 p-1 rounded-lg border-2 border-gray-700/80 group-hover:border-cyan-400 transition-colors shadow-md"
        alt={`${equip.Equip_Name} Thumbnail`}
        loading="lazy"
      />
      <p className="mt-2 text-xs font-semibold text-center text-gray-300 clamp-2 w-24">
        {equip.Equip_Name}
      </p>
      <div className="absolute bottom-full mb-2 w-48 p-3 bg-gray-900/90 backdrop-blur-sm border border-gray-600 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10 transform group-hover:-translate-y-1">
        <h4 className="font-bold text-white text-base">{equip.Equip_Name}</h4>
        <p className="text-sm text-gray-400">{equip.Type} - Rarity: {equip.Rarity}★</p>
        <p className="text-sm text-cyan-400 mt-1 truncate">Tags: {equip.Tags || "None"}</p>
        <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900/90 border-b border-r border-gray-600 transform rotate-45"></div>
      </div>
    </div>
  );
};
