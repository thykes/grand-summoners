// src/components/AllUnitsPage.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from './PageHeader';
import CompactUnitCard from './CompactUnitCard'; // Import the new component
import { getArtGenInfo, artsGenData } from '../data/artGenGroups';

export default function AllUnitsPage({ allUnits, myUnits, onToggleUnit, setSelectedUnit, showMyUnitsFilter, setShowMyUnitsFilter, onClearAll }) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ element: 'All', archetype: 'All', artGenGroup: 'ALL_UNITS', searchQuery: '' });
  const [sortOrder, setSortOrder] = useState('release');

  const orderedArtGenGroups = useMemo(() => {
    return Array.from(new Set(Object.values(artsGenData).map(info => info.type))).sort();
  }, []);
  
  const filterOptions = useMemo(() => ({
    primaryArchetypes: [...new Set(allUnits.map(u => u.Primary_Archetype).filter(Boolean))].sort(),
  }), [allUnits]);

  const filteredAndSortedUnits = useMemo(() => {
    let processedUnits = showMyUnitsFilter ? allUnits.filter(u => myUnits.has(u.id)) : [...allUnits];
    processedUnits = processedUnits.filter(unit => {
      const artGenInfo = getArtGenInfo(unit.Unit_Name);
      let artGenMatch;
      switch (filters.artGenGroup) {
        case 'ALL_UNITS': artGenMatch = true; break;
        case 'NONE': artGenMatch = !artGenInfo; break;
        case 'ANY_ART_GEN': artGenMatch = !!artGenInfo; break;
        default: artGenMatch = artGenInfo?.type === filters.artGenGroup; break;
      }
      return artGenMatch &&
        (filters.element === 'All' || unit.Element === filters.element) &&
        (filters.archetype === 'All' || unit.Primary_Archetype === filters.archetype) &&
        (unit.Unit_Name.toLowerCase().includes(filters.searchQuery.toLowerCase()));
    });
    
    processedUnits.sort((a, b) => {
      if (sortOrder === 'A-Z') return a.Unit_Name.localeCompare(b.Unit_Name);
      if (sortOrder === 'Z-A') return b.Unit_Name.localeCompare(a.Unit_Name);
      return (a.Release_Order_Index || 99999) - (b.Release_Order_Index || 99999);
    });

    return processedUnits;
  }, [allUnits, filters, sortOrder, myUnits, showMyUnitsFilter]);
  
  const handleFilterChange = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleUnitClick = (unit) => {
    setSelectedUnit(unit);
    navigate(`/unit/${unit.id}`);
  };
  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to remove all units from your collection?")) onClearAll();
  };

  return (
    <div className="w-full">
      <PageHeader title="Unit Database" subtitle="Browse all units and manage your collection." />
      <main className="w-full">
        <div className="card mb-8">
          <input type="text" name="searchQuery" placeholder="Search by unit name..." value={filters.searchQuery} onChange={handleFilterChange} className="bg-gray-700/80 text-white rounded-md p-3 w-full border border-gray-600 focus:ring-2 focus:ring-cyan-500 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <select name="element" onChange={handleFilterChange} value={filters.element} className="bg-gray-700/80 text-white rounded-md p-2 w-full border border-gray-600">
              <option value="All">All Elements</option>
              <option value="Fire">Fire</option><option value="Water">Water</option><option value="Earth">Earth</option><option value="Light">Light</option><option value="Dark">Dark</option>
            </select>
            <select name="archetype" onChange={handleFilterChange} value={filters.archetype} className="bg-gray-700/80 text-white rounded-md p-2 w-full border border-gray-600">
              <option value="All">All Archetypes</option>
              {filterOptions.primaryArchetypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <select name="artGenGroup" onChange={handleFilterChange} value={filters.artGenGroup} className="bg-gray-700/80 text-white rounded-md p-2 w-full border border-gray-600">
              <option value="ALL_UNITS">All Art Gen Groups</option>
              <option value="NONE">None</option>
              {orderedArtGenGroups.map(group => <option key={group} value={group}>Type {group}</option>)}
              <option value="ANY_ART_GEN">Any Art Gen Unit</option>
            </select>
            <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder} className="bg-gray-700/80 text-white rounded-md p-2 w-full border border-gray-600">
              <option value="release">Sort: Release Order</option>
              <option value="A-Z">Sort: Name (A-Z)</option> 
              <option value="Z-A">Sort: Name (Z-A)</option> 
            </select>
            <div className="flex items-center justify-center p-2 bg-gray-900/50 rounded-md border border-gray-700">
              <label htmlFor="my-units-toggle" className="mr-3 text-sm font-bold text-gray-300 select-none">Show My Units</label>
              <input type="checkbox" id="my-units-toggle" checked={showMyUnitsFilter} onChange={(e) => setShowMyUnitsFilter(e.target.checked)} className="form-checkbox h-5 w-5"/>
            </div>
          </div>
          <div className="mt-4 text-center">
            <button onClick={handleClearAll} className="text-sm font-semibold text-red-400 hover:text-red-300">Clear All My Units</button>
          </div>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-x-4 gap-y-8">
          {filteredAndSortedUnits.map(unit => (
            <CompactUnitCard 
              unit={unit} 
              key={unit.id} 
              onUnitClick={handleUnitClick}
              isSelected={myUnits.has(unit.id)}
              onToggleSelect={onToggleUnit} // <-- Pass the correct prop
            />
          ))}
        </div>
      </main>
    </div>
  );
}