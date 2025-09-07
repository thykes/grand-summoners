// src/components/AllGuidesPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from './PageHeader';

export default function AllGuidesPage({ allGuides }) {
  const navigate = useNavigate();

  if (!allGuides || allGuides.length === 0) {
    return (
      <div className="w-full">
        <PageHeader title="Guides Library" subtitle="Strategy guides and quest notes." />
        <div className="text-center text-gray-400 mt-8">No guides available.</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <PageHeader title="Guides Library" subtitle="Strategy guides and quest notes." />
      <main className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {allGuides.map((guide) => (
          <div
            key={guide.id}
            onClick={() => navigate(`/guide/${guide.id}`)}
            className="card p-6 cursor-pointer hover:scale-105 transition-transform"
          >
            {guide.imageUrl && (
              <img
                src={guide.imageUrl}
                alt={guide.name}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
            )}
            <h3 className="text-xl font-semibold text-white mb-2">{guide.name}</h3>
            <p className="text-gray-400 text-sm">
              {guide.description || "No description available."}
            </p>
          </div>
        ))}
      </main>
    </div>
  );
}
