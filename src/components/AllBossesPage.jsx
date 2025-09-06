// src/components/AllBossesPage.jsx
import React from 'react';
import PageHeader from './PageHeader';

export default function AllBossesPage({ allBosses }) {
  const safeBosses = allBosses || [];

  return (
    <div className="w-full">
      <PageHeader title="Boss Database" subtitle="Browse all bosses in the game." />
      <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {safeBosses.map((boss) => (
          <div key={boss.id} className="card p-4 bg-gray-800 text-white rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-2">{boss.name}</h2>
            <p className="text-gray-400">{boss.type || "Unknown Type"}</p>
          </div>
        ))}
        {safeBosses.length === 0 && (
          <p className="text-gray-400">No bosses found.</p>
        )}
      </main>
    </div>
  );
}
