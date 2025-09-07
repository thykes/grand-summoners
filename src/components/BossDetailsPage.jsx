// src/components/BossDetailsPage.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from './PageHeader';

export default function BossDetailsPage({ allBosses }) {
  const { bossId } = useParams();
  const navigate = useNavigate();
  const boss = allBosses.find((b) => b.id === bossId);

  if (!boss) {
    return (
      <div className="w-full text-center text-gray-400 mt-8">
        Boss not found.
        <button
          onClick={() => navigate(-1)}
          className="ml-3 text-cyan-400 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <PageHeader title={boss.name} subtitle={boss.type} />
      <main className="card p-6">
        {boss.imageUrl && (
          <img
            src={boss.imageUrl}
            alt={boss.name}
            className="w-48 h-48 mx-auto mb-6 object-contain"
          />
        )}
        <p className="text-gray-300">{boss.description || "No details available."}</p>
      </main>
    </div>
  );
}
