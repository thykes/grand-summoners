// src/components/UnitCard.jsx

import React from 'react';

function UnitCard({ unit, onClick, suggestedSlots = {} }) {
  
  const cardClasses = `relative group card p-3 flex flex-col items-center text-center cursor-pointer 
                       transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/20
                       border-2 border-transparent`;

  // Create an array representing the three slots for easy mapping.
  const slots = [
    { type: unit.Slot_1_Type, equip: suggestedSlots.slot1 },
    { type: unit.Slot_2_Type, equip: suggestedSlots.slot2 },
    { type: unit.Slot_3_Type, equip: suggestedSlots.slot3 },
  ];

  return (
    <div onClick={() => onClick(unit)} className={cardClasses}>
      <img
        src={unit.Thumbnail_URL || `https://placehold.co/128x128/1f2937/9ca3af?text=${unit.Unit_Name.substring(0, 3).toUpperCase()}`}
        className="unit-image rounded-lg mb-2 w-24 h-24 object-cover border-2 border-gray-600/50"
        alt={`${unit.Unit_Name} Icon`}
        loading="lazy"
      />
      <h5 className="text-base font-semibold text-gray-200 truncate w-full">
        {unit.Unit_Name}
      </h5>
      {/* Add extra margin to make space for the equipment slots at the bottom */}
      <p className="text-xs italic text-gray-400 mb-10">
        {`${unit.Element} - ${unit.Primary_Archetype}`}
      </p>
      
      {/* --- NEW: Full Equipment Loadout Display --- */}
      <div className="absolute bottom-2 left-2 right-2 h-8 flex justify-center items-center gap-1">
        {slots.map((slot, index) => {
          // If the unit doesn't have a slot in this position, render an empty spacer for alignment
          if (!slot.type) {
            return <div key={index} className="w-8 h-8" />;
          }
          
          return (
            <div 
              key={index}
              className="w-8 h-8 bg-gray-900/70 rounded-md border border-gray-600 flex items-center justify-center"
              title={slot.equip ? `Suggested: ${slot.equip.Equip_Name}` : `Empty ${slot.type} Slot`}
            >
              {/* If an equipment is suggested for this slot, display its thumbnail */}
              {slot.equip ? (
                <img 
                  src={slot.equip.Thumbnail_URL}
                  alt={slot.equip.Equip_Name}
                  className="w-full h-full object-contain p-0.5"
                />
              ) : (
                // Otherwise, display the generic slot type icon
                <img 
                  src={`/assets/slots/${slot.type.split('/')[0]}.png`} // Show first type icon for empty dual slots
                  alt={`${slot.type} slot`}
                  className="w-5 h-5 opacity-30"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(UnitCard);