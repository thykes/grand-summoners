// src/components/SkeletonCard.jsx
export default function SkeletonCard() {
  return (
    <div
      data-testid="skeleton-card"
      className="unit-card rounded-lg p-3 flex flex-col items-center text-center shadow-md bg-gray-800 animate-pulse"
    >
      <div className="rounded-full bg-gray-700 h-24 w-24 mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-2/3 mb-2"></div>
      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
    </div>
  );
}
