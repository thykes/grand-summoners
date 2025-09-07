// src/components/UnitCard.jsx
import React from "react";

export default function UnitCard({ unit, onClick, suggestedSlots = [], onEquipClick }) {
  if (!unit) return null;

  const slotDefs = [
    { type: unit.Slot_1_Type, rarity: unit.Slot_1_Rarity },
    { type: unit.Slot_2_Type, rarity: unit.Slot_2_Rarity },
    { type: unit.Slot_3_Type, rarity: unit.Slot_3_Rarity },
  ];
  const slots = [
    suggestedSlots?.[0] || null,
    suggestedSlots?.[1] || null,
    suggestedSlots?.[2] || null,
  ];

  return (
    <div
      className="flex flex-col items-center bg-gray-900/80 radius-lg p-4 shadow-md hover:shadow-xl transition cursor-pointer border border-gray-700"
      onClick={() => onClick?.(unit)}
    >
      {/* Thumbnail */}
      <img
        src={unit.Thumbnail_URL}
        alt={unit.Unit_Name}
        loading="lazy"
        className="w-24 h-24 rounded-lg object-cover mb-3 border border-gray-700/80 shadow-md"
      />

      {/* Name + Role */}
      <h3 className="text-white text-lg font-semibold text-center">
        {unit.Unit_Name}
      </h3>
      <p className="text-gray-400 text-sm mt-1">
        {unit.Element} • {unit.Primary_Archetype || unit.Role || "Unknown"}
      </p>

      {/* Solves badges */}
      {(unit.solves && unit.solves.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-2 justify-center">
          {unit.solves.slice(0, 3).map((s, i) => (
            <span key={i} className="badge badge-cyan">{s}</span>
          ))}
        </div>
      )}

      {/* Suggested Slots: always show 3 in correct order */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
        {slots.map((slot, i) => {
          const def = slotDefs[i] || {};
          const hasEquip = !!slot;
          const label = hasEquip ? slot.Equip_Name : `Empty`;
          const subtitle = !hasEquip && def.type ? `${def.type} • ${def.rarity || ''}★` : '';
          return (
            <button
              key={i}
              title={hasEquip ? slot.Equip_Name : undefined}
              onClick={(e) => {
                if (!hasEquip) return;
                e.stopPropagation();
                onEquipClick?.(slot);
              }}
              className={`w-full flex flex-col items-center bg-gray-800/70 radius-sm p-2 transition ${
                hasEquip ? 'hover:bg-gray-700 cursor-pointer' : 'opacity-70 cursor-default'
              }`}
            >
              {hasEquip && slot.Thumbnail_URL ? (
                <img
                  src={slot.Thumbnail_URL}
                  alt={slot.Equip_Name}
                  loading="lazy"
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain mb-2"
                />
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded mb-2" />
              )}
              <span className="text-[10px] text-gray-300 text-center leading-tight break-words whitespace-normal w-full clamp-2">
                {label}
              </span>
              {!hasEquip && subtitle && (
                <span className="text-[10px] text-gray-400 text-center w-full mt-0.5 clamp-2">{subtitle}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
