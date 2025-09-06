// src/components/AllEquipmentPage.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from './PageHeader';
import CompactEquipCard from './CompactEquipCard'; // <-- THE FIX: Import the component

// THE FIX: The local definitions of EquipCounter and CompactEquipCard are now removed.

export default function AllEquipmentPage({ allEquipment, myEquipment, onIncrementEquip, onDecrementEquip, setSelectedEquip, showMyEquipsFilter, setShowMyEquipsFilter, onClearAll }) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ type: 'All', rarity: 'All', searchQuery: '' });
  const [sortOrder, setSortOrder] = useState('release');
  
  const filterOptions = useMemo(() => ({
    types: [...new Set(allEquipment.map(e => e.Type).filter(Boolean))].sort(),
    rarities: [...new Set(allEquipment.map(e => e.Rarity).filter(Boolean))].sort((a,b) => b-a),
  }), [allEquipment]);

  const filteredAndSortedEquips = useMemo(() => {
    let processed = [...allEquipment];
    processed = processed.filter(equip => 
      (showMyEquipsFilter ? myEquipment.has(equip.id) : true) &&
      (filters.type === 'All' || equip.Type === filters.type) &&
      (filters.rarity === 'All' || equip.Rarity === parseInt(filters.rarity)) &&
      (equip.Equip_Name.toLowerCase().includes(filters.searchQuery.toLowerCase()))
    );

    processed.sort((a, b) => {
      switch (sortOrder) {
        case 'A-Z': return a.Equip_Name.localeCompare(b.Equip_Name);
        case 'Z-A': return b.Equip_Name.localeCompare(a.Equip_Name);
        case 'rarity_desc': return (b.Rarity || 0) - (a.Rarity || 0);
        case 'rarity_asc': return (a.Rarity || 0) - (b.Rarity || 0);
        default: return (a.Release_Order_Index || 99999) - (b.Release_Order_Index || 99999);
      }
    });
    
    return processed;
  }, [allEquipment, filters, sortOrder, myEquipment, showMyEquipsFilter]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleEquipClick = (equip) => {
    setSelectedEquip(equip);
    navigate(`/equip/${equip.id}`);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to remove all equipment from your collection?")) {
      onClearAll();
    }
  };

  return (
    <div className="w-full">
      <PageHeader title="Equipment Database" subtitle="Browse all equipment and manage your collection."/>
      <main className="w-full">
        <div className="card mb-8">
          <input type="text" name="searchQuery" placeholder="Search by equipment name..." value={filters.searchQuery} onChange={handleFilterChange} className="bg-gray-700/80 text-white rounded-md p-3 w-full border border-gray-600 focus:ring-2 focus:ring-cyan-500 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <select name="type" onChange={handleFilterChange} value={filters.type} className="bg-gray-700/80 text-white rounded-md p-2 w-full border border-gray-600">
              <option value="All">All Types</option>
              {filterOptions.types.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <select name="rarity" onChange={handleFilterChange} value={filters.rarity} className="bg-gray-700/80 text-white rounded-md p-2 w-full border border-gray-600">
              <option value="All">All Rarities</option>
              {filterOptions.rarities.map(r => <option key={r} value={r}>{r}★</option>)}
            </select>
            <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder} className="bg-gray-700/80 text-white rounded-md p-2 w-full border border-gray-600">
              <option value="release">Sort: Release Order</option>
              <option value="rarity_desc">Sort: Rarity (High-Low)</option>
              <option value="rarity_asc">Sort: Rarity (Low-High)</option>
              <option value="A-Z">Sort: Name (A-Z)</option> 
              <option value="Z-A">Sort: Name (Z-A)</option> 
            </select>
            <div className="flex items-center justify-center p-2 bg-gray-900/50 rounded-md border border-gray-700">
              <label htmlFor="my-equips-toggle" className="mr-3 text-sm font-bold text-gray-300 select-none">Show My Gear</label>
              <input type="checkbox" id="my-equips-toggle" checked={showMyEquipsFilter} onChange={(e) => setShowMyEquipsFilter(e.target.checked)} className="form-checkbox h-5 w-5 text-cyan-500 bg-gray-600 border-gray-500 rounded focus:ring-cyan-500"/>
            </div>
          </div>
          <div className="mt-4 text-center">
            <button onClick={handleClearAll} className="text-sm font-semibold text-red-400 hover:text-red-300">Clear All My Equipment</button>
          </div>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-x-4 gap-y-8">
          {filteredAndSortedEquips.map(equip => (
            <CompactEquipCard 
              equip={equip} 
              key={equip.id} 
              onEquipClick={handleEquipClick}
              count={myEquipment.get(equip.id) || 0}
              onIncrement={onIncrementEquip}
              onDecrement={onDecrementEquip}
            />
          ))}
        </div>
      </main>
    </div>
  );
}