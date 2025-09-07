// src/components/AllBossesPage.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageHeader from './PageHeader';

export default function AllBossesPage({ allBosses }) {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const typeFilter = params.get('type'); // 'crest' | 'trial' | null

  if (!allBosses || allBosses.length === 0) {
    return (
      <div className="w-full">
        <PageHeader title="Boss Database" subtitle="Browse all Crest and Trial bosses." />
        <div className="text-center text-gray-400 mt-8">No bosses available.</div>
      </div>
    );
  }

  const filtered = (() => {
    if (typeFilter === 'crest') return allBosses.filter(b => b.type === 'Crest Boss');
    if (typeFilter === 'trial') return allBosses.filter(b => b.type === 'Trial Event');
    return allBosses;
  })();

  const subtitle = typeFilter === 'crest'
    ? 'Crest Bosses'
    : typeFilter === 'trial'
      ? 'Trial Events'
      : 'Browse all Crest and Trial bosses.';

  return (
    <div className="w-full">
      <PageHeader title="Boss Database" subtitle={subtitle} />
      <main className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-6">
        {filtered.map((boss) => (
          <div
            key={boss.id}
            onClick={() => navigate(`/boss/${boss.id}`)}
            className="card p-4 text-center cursor-pointer hover:scale-105 transition-transform"
          >
            {boss.imageUrl && (
              <img
                src={boss.imageUrl}
                alt={boss.name}
                loading="lazy"
                className="w-24 h-24 mx-auto mb-3 object-contain"
              />
            )}
            <h3 className="text-lg font-semibold text-white">{boss.name}</h3>
            <p className="text-gray-400 text-sm">{boss.type}</p>
          </div>
        ))}
      </main>
    </div>
  );
}
