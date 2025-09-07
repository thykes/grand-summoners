// src/components/GuideDetailsPage.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from './PageHeader';

export default function GuideDetailsPage({ allGuides }) {
  const { guideId } = useParams();
  const navigate = useNavigate();
  const guide = allGuides.find((g) => g.id === guideId);

  if (!guide) {
    return (
      <div className="w-full text-center text-gray-400 mt-8">
        Guide not found.
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
      <PageHeader title={guide.name} subtitle="Strategy Guide" />
      <main className="card p-6">
        {guide.imageUrl && (
          <img
            src={guide.imageUrl}
            alt={guide.name}
            className="w-full h-40 object-cover rounded-lg mb-6"
          />
        )}
        <p className="text-gray-300 whitespace-pre-line">
          {guide.description || "No content available."}
        </p>
      </main>
    </div>
  );
}
