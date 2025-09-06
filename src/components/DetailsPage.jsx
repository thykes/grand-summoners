// src/components/DetailsPage.jsx

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from './PageHeader';

const SlotCard = ({ type, rarity }) => {
  if (!type) {
    return null;
  }
  const types = type.split('/').map(t => t.trim());
  return (
    <div className="bg-gray-800 rounded-lg p-3 shadow-inner flex items-center space-x-4">
      <div className="flex -space-x-3">
        {types.map((singleType) => (
          <img 
            key={singleType}
            src={`/assets/slots/${singleType}.png`} 
            alt={`${singleType} slot icon`} 
            className="w-10 h-10" 
            title={singleType}
          />
        ))}
      </div>
      <div>
        <h5 className="font-semibold text-gray-300">{type}</h5>
        <p className="text-sm text-white">{rarity}★</p>
      </div>
    </div>
  );
};


// <-- FIX: Removed default props. Loading is now guaranteed by App.jsx.
export default function DetailsPage({ unit, allUnits }) {
  const navigate = useNavigate();
  const { unitId } = useParams();

  const currentUnit = unit || allUnits.find(u => u.id === unitId);
  
  if (!currentUnit) {
    return (
      <div>
        <PageHeader title="Unit Not Found" subtitle="Please go back and select a unit." onBackClick={() => navigate("/units")} />
      </div>
    );
  }

  const DetailSection = ({ title, children }) => (
    <div className="mt-8">
      <h4 className="text-2xl font-bold text-cyan-400 mb-3">{title}</h4>
      <div className="space-y-3">{children}</div>
    </div>
  );

  const InfoCard = ({ title, value }) => (
    <div className="bg-gray-800 rounded-lg p-3 shadow-inner">
      <h5 className="font-semibold text-gray-300">{title}</h5>
      <p className="text-lg text-white">{value ?? "N/A"}</p>
    </div>
  );

  const AbilityCard = ({ title, description }) => (
    <div className="bg-gray-800 rounded-lg p-4 shadow-inner">
      <h5 className="font-semibold text-gray-300">{title}</h5>
      <p className="text-sm text-gray-400 mt-1 whitespace-pre-wrap">{description || "N/A"}</p>
    </div>
  );

  return (
    <div className="w-full">
      <PageHeader 
        title={currentUnit.Unit_Name}
        subtitle={`${currentUnit.Element} - ${currentUnit.Race} - ${currentUnit.Primary_Archetype}`}
      />
      <main className="w-full">
        <div className="card">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            <img 
              src={currentUnit.Full_Artwork_URL || `https://placehold.co/400x400/1f2937/9ca3af?text=No+Art`}
              alt={`${currentUnit.Unit_Name} Full Artwork`}
              className="rounded-xl w-full sm:w-2/3 lg:w-1/3 object-cover shadow-lg"
            />
            <div className="w-full lg:w-2/3">
              <DetailSection title="Stats">
                <InfoCard title="Level" value={currentUnit.Max_Level} />
                <div className="grid grid-cols-3 gap-4 mt-3">
                  <InfoCard title="HP" value={currentUnit.HP} />
                  <InfoCard title="ATK" value={currentUnit.ATK} />
                  <InfoCard title="DEF" value={currentUnit.DEF} />
                </div>
              </DetailSection>

              <DetailSection title="Equipment Slots">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <SlotCard type={currentUnit.Slot_1_Type} rarity={currentUnit.Slot_1_Rarity} />
                  <SlotCard type={currentUnit.Slot_2_Type} rarity={currentUnit.Slot_2_Rarity} />
                  <SlotCard type={currentUnit.Slot_3_Type} rarity={currentUnit.Slot_3_Rarity} />
                </div>
              </DetailSection>

              <DetailSection title="Abilities">
                <AbilityCard title="Passives" description={currentUnit.Passives_Desc} />
                <AbilityCard title="Skill" description={currentUnit.Skill_Desc} />
                <AbilityCard title="Arts" description={currentUnit.Arts_Desc} />
                <AbilityCard title="True Arts" description={currentUnit.True_Arts_Desc} />
                {currentUnit.Super_Arts_Desc && <AbilityCard title="Super Arts" description={currentUnit.Super_Arts_Desc} />}
                {currentUnit.Cross_Arts_Desc && <AbilityCard title="Cross Arts" description={currentUnit.Cross_Arts_Desc} />}
              </DetailSection>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}