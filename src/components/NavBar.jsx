// src/components/NavBar.jsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useFirestoreData } from '../hooks/useFirestoreData';

export default function NavBar() {
  const { allUnits, allBosses, allEquipment, allGuides } = useFirestoreData();

  // Ensure safe defaults (so .filter / .map never crash)
  const safeUnits = allUnits || [];
  const safeBosses = allBosses || [];
  const safeEquipment = allEquipment || [];
  const safeGuides = allGuides || [];

  const unitsByTier = useMemo(() => {
    const tieredUnits = safeUnits.filter((u) => u.ratings?.tier);

    const grouped = tieredUnits.reduce((acc, unit) => {
      const tier = unit.ratings.tier;
      if (!acc[tier]) acc[tier] = [];
      acc[tier].push(unit);
      return acc;
    }, {});

    return grouped;
  }, [safeUnits]);

  return (
    <nav role="navigation" className="navbar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/units">Units ({safeUnits.length})</Link>
        </li>
        <li>
          <Link to="/bosses">Bosses ({safeBosses.length})</Link>
        </li>
        <li>
          <Link to="/equipment">Equipment ({safeEquipment.length})</Link>
        </li>
        <li>
          <Link to="/guides">Guides ({safeGuides.length})</Link>
        </li>
        <li>
          <Link to="/tiers">Tier Lists ({Object.keys(unitsByTier).length})</Link>
        </li>
      </ul>
    </nav>
  );
}
