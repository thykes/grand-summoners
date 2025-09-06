// src/components/AllGuidesPage.jsx
import React from 'react';
import PageHeader from './PageHeader';

export default function AllGuidesPage({ allGuides }) {
  const safeGuides = allGuides || [];

  return (
    <div className="w-full">
      <PageHeader title="Guides" subtitle="Browse all player-created guides." />
      <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {safeGuides.map((guide) => (
          <div key={guide.id} className="card p-4 bg-gray-800 text-white rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-2">{guide.name}</h2>
            <p className="text-gray-400">{guide.description || "No description available."}</p>
          </div>
        ))}
        {safeGuides.length === 0 && (
          <p className="text-gray-400">No guides found.</p>
        )}
      </main>
    </div>
  );
}
