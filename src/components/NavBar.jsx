// src/components/TierListPage.jsx
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from './PageHeader';
import TierRow from './TierRow';

// This order ensures the tiers are displayed from best to worst.
const TIER_ORDER = ['SS', 'S+', 'S', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D'];

export default function TierListPage({ allUnits, setSelectedUnit }) {
  const navigate = useNavigate();

  const unitsByTier = useMemo(() => {
    // 1. Filter for units that have the new 'ratings' data and a tier
    const tieredUnits = allUnits.filter(u => u.ratings?.tier);

    // 2. Group units by their tier
    const grouped = tieredUnits.reduce((acc, unit) => {
      const tier = unit.ratings.tier;
      if (!acc[tier]) {
        acc[tier] = [];
      }
      acc[tier].push(unit);
      return acc;
    }, {});

    // 3. Sort units within each tier by release order (or another metric if you prefer)
    for (const tier in grouped) {
      grouped[tier].sort((a, b) => (a.Release_Order_Index || 99999) - (b.Release_Order_Index || 99999));
    }
    
    return grouped;
  }, [allUnits]);

  // Sort the tiers themselves according to our defined order
  const sortedTiers = useMemo(() => {
    return Object.keys(unitsByTier).sort((a, b) => {
      const indexA = TIER_ORDER.indexOf(a);
      const indexB = TIER_ORDER.indexOf(b);
      // Handle tiers not in our explicit order by pushing them to the back
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [unitsByTier]);

  const handleUnitClick = (unit) => {
    setSelectedUnit(unit);
    navigate(`/unit/${unit.id}`);
  };

  return (
    <div className="w-full">
      <PageHeader
        title="Community Tier List"
        subtitle="Unit rankings based on overall power and utility in endgame content."
      />
      <main className="w-full">
        {sortedTiers.map(tier => (
          <TierRow
            key={tier}
            tier={tier}
            units={unitsByTier[tier]}
            onUnitClick={handleUnitClick}
          />
        ))}
      </main>
    </div>
  );
}