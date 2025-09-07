// src/components/EquipmentDetailsPage.jsx

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from './PageHeader';

export default function EquipmentDetailsPage({ equip, allEquipment = [] }) {
  const navigate = useNavigate();
  const { equipId } = useParams();

  const currentEquip = equip || allEquipment.find(e => e.id === equipId);

  if (!currentEquip) {
    return (
      <div>
        <PageHeader title="Equipment Not Found" subtitle="Please go back and select an item." onBackClick={() => navigate("/equipment")} />
      </div>
    );
  }

  const DetailSection = ({ title, children }) => (
    <div className="mt-8">
      <h4 className="text-2xl font-bold text-cyan-400 mb-4">{title}</h4>
      <div className="space-y-4">{children}</div>
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
      <div className="mt-28 mb-28">
        <PageHeader 
          title={currentEquip.Equip_Name}
          subtitle={`${currentEquip.Type} - Rarity: ${currentEquip.Rarity}★`}
        />
      </div>
      <main className="w-full">
        <div className="card">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            <img 
              src={currentEquip.Image_URL || currentEquip.Thumbnail_URL || `https://placehold.co/400x400/1f2937/9ca3af?text=No+Art`}
              alt={`${currentEquip.Equip_Name} Full Artwork`}
              loading="lazy"
              className="rounded-xl w-full sm:w-2/3 lg:w-1/3 object-contain bg-gray-900/50 p-2 shadow-lg"
            />
            <div className="w-full lg:w-2/3">
              <DetailSection title="Stats">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <InfoCard title="HP" value={currentEquip.HP} />
                  <InfoCard title="ATK" value={currentEquip.ATK} />
                  <InfoCard title="DEF" value={currentEquip.DEF} />
                </div>
              </DetailSection>

               <DetailSection title="Tags">
                <div className="bg-gray-800 rounded-lg p-3 shadow-inner">
                    <p className="text-base text-cyan-300">{currentEquip.Tags || "No tags specified."}</p>
                </div>
              </DetailSection>

              <DetailSection title="Abilities">
                <AbilityCard title="Description" description={currentEquip.Abilities_Desc} />
              </DetailSection>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
