// src/App.jsx
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useFirestoreData } from './hooks/useFirestoreData';

import HomePage from './components/HomePage';
import AllUnitsPage from './components/AllUnitsPage';
import DetailsPage from './components/DetailsPage';
import AllEquipmentPage from './components/AllEquipmentPage';
import EquipmentDetailsPage from './components/EquipmentDetailsPage';
import PageHeader from './components/PageHeader';
import SkeletonCard from './components/SkeletonCard';
import NavBar from './components/NavBar';
import TierListPage from './components/TierListPage';

const ScrollToTop = ({ children }) => {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return children;
};

function AppContent() {
  const { allUnits, allBosses, allEquipment, allGuides, isLoading, error } = useFirestoreData();

  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedEquip, setSelectedEquip] = useState(null);

  // ✅ Units collection
  const [myUnits, setMyUnits] = useState(() => new Set(JSON.parse(localStorage.getItem('myUnits') || '[]')));
  useEffect(() => {
    localStorage.setItem('myUnits', JSON.stringify(Array.from(myUnits)));
  }, [myUnits]);

  const toggleUnitInCollection = (unitId) =>
    setMyUnits((prev) => {
      const n = new Set(prev);
      n.has(unitId) ? n.delete(unitId) : n.add(unitId);
      return n;
    });
  const clearMyUnits = () => setMyUnits(new Set());

  // ✅ Equipment collection
  const [myEquipment, setMyEquipment] = useState(
    () => new Map(JSON.parse(localStorage.getItem('myEquipment') || '[]'))
  );
  useEffect(() => {
    localStorage.setItem('myEquipment', JSON.stringify(Array.from(myEquipment.entries())));
  }, [myEquipment]);

  const handleIncrementEquip = (equipId) =>
    setMyEquipment((prev) => new Map(prev).set(equipId, (prev.get(equipId) || 0) + 1));
  const handleDecrementEquip = (equipId) =>
    setMyEquipment((prev) => {
      const n = new Map(prev);
      if ((n.get(equipId) || 0) > 1) {
        n.set(equipId, n.get(equipId) - 1);
      } else {
        n.delete(equipId);
      }
      return n;
    });
  const clearMyEquipment = () => setMyEquipment(new Map());

  // ✅ Filters persistence
  const [showMyUnitsFilter, setShowMyUnitsFilter] = useState(
    () => localStorage.getItem('showMyUnitsFilter') === 'true'
  );
  useEffect(() => {
    localStorage.setItem('showMyUnitsFilter', showMyUnitsFilter);
  }, [showMyUnitsFilter]);

  const [showMyEquipsFilter, setShowMyEquipsFilter] = useState(
    () => localStorage.getItem('showMyEquipsFilter') === 'true'
  );
  useEffect(() => {
    localStorage.setItem('showMyEquipsFilter', showMyEquipsFilter);
  }, [showMyEquipsFilter]);

  // ✅ Loading state
  if (isLoading) {
    return (
      <div className="w-full">
        <NavBar />
        <PageHeader title="Fetching Game Data..." subtitle="Please wait a moment." />
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-x-4 gap-y-8 mt-8">
          {[...Array(24)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <>
        <NavBar />
        <PageHeader title="Error" subtitle={error} />
      </>
    );
  }

  // ✅ Main routes
  return (
    <>
      <NavBar />
      <Routes>
        {/* Home / Event Builder */}
        <Route
          path="/"
          element={
            <HomePage
              allUnits={allUnits}
              allBosses={allBosses}
              allGuides={allGuides}
              allEquipment={allEquipment}
              myUnits={myUnits}
              myEquipment={myEquipment}
              setSelectedUnit={setSelectedUnit}
              setSelectedEquip={setSelectedEquip}
            />
          }
        />

        {/* Tier Lists */}
        <Route
          path="/tierlist"
          element={<TierListPage allUnits={allUnits} setSelectedUnit={setSelectedUnit} />}
        />

        {/* Units */}
        <Route
          path="/units"
          element={
            <AllUnitsPage
              allUnits={allUnits}
              myUnits={myUnits}
              onToggleUnit={toggleUnitInCollection}
              setSelectedUnit={setSelectedUnit}
              showMyUnitsFilter={showMyUnitsFilter}
              setShowMyUnitsFilter={setShowMyUnitsFilter}
              onClearAll={clearMyUnits}
            />
          }
        />
        <Route path="/unit/:unitId" element={<DetailsPage unit={selectedUnit} allUnits={allUnits} />} />

        {/* Equipment */}
        <Route
          path="/equipment"
          element={
            <AllEquipmentPage
              allEquipment={allEquipment}
              myEquipment={myEquipment}
              onIncrementEquip={handleIncrementEquip}
              onDecrementEquip={handleDecrementEquip}
              setSelectedEquip={setSelectedEquip}
              showMyEquipsFilter={showMyEquipsFilter}
              setShowMyEquipsFilter={setShowMyEquipsFilter}
              onClearAll={clearMyEquipment}
            />
          }
        />
        <Route
          path="/equip/:equipId"
          element={<EquipmentDetailsPage equip={selectedEquip} allEquipment={allEquipment} />}
        />

        {/* Removed: General Team Builder, Bosses listing/details, Guides listing/details */}
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ScrollToTop>
        <div className="p-4 sm:p-8 flex flex-col items-center min-h-screen bg-gray-900">
          <div className="w-full max-w-7xl">
            <AppContent />
          </div>
        </div>
      </ScrollToTop>
    </BrowserRouter>
  );
}
