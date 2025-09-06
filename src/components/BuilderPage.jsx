// src/components/BuilderPage.jsx

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import UnitCard from './UnitCard';
import PageHeader from './PageHeader';
import { buildGeneralTeam } from '../utils/generalTeamBuilder';

// <-- FIX: Removed default props. Loading is now guaranteed by App.jsx.
export default function BuilderPage({ allUnits, myUnits, setSelectedUnit }) {
  const navigate = useNavigate();
  const [teamType, setTeamType] = useState('sustain');

  const userUnits = useMemo(() => {
    return myUnits.size > 0 ? allUnits.filter(unit => myUnits.has(unit.id)) : allUnits;
  }, [allUnits, myUnits]);

  const { team, explanation } = useMemo(() => {
    return buildGeneralTeam(userUnits, teamType);
  }, [userUnits, teamType]);

  const handleUnitClick = (unit) => {
    setSelectedUnit(unit);
    navigate(`/unit/${unit.id}`);
  };

  return (
    <div className="w-full">
      <PageHeader 
        title="General Team Builder"
        subtitle="Find the best overall Sustain or Nuke team from your collection."
      />
      
      <main className="w-full">
        <div className="card mb-8 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <label className="text-lg font-bold text-gray-300">Select Team Type:</label>
          <div className="flex space-x-2 p-1 bg-gray-700 rounded-full">
            <button 
              onClick={() => setTeamType('sustain')}
              className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${teamType === 'sustain' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
            >
              Balanced Sustain
            </button>
            <button 
              onClick={() => setTeamType('nuke')}
              className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${teamType === 'nuke' ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
            >
              Nuke / Speedrun
            </button>
          </div>
        </div>

        {myUnits.size === 0 && (
          <div className="text-center bg-yellow-900/50 text-yellow-300 p-4 rounded-lg mb-6 border border-yellow-700">
            <p><strong>Note:</strong> You haven't selected any units in "Manage My Units". The teams below are generated from all units in the game. Select your units for a personalized team!</p>
          </div>
        )}

        <h3 className="text-2xl font-bold text-white text-center mb-4">Suggested {teamType === 'sustain' ? 'Sustain' : 'Nuke'} Team</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {team.length > 0 ? (
            team.map(unit => <UnitCard unit={unit} key={unit.id} onClick={handleUnitClick} />)
          ) : (
            <div className="col-span-full card text-center border-dashed border-gray-600">
                <h3 className="text-xl font-semibold text-white">Could Not Form a Team</h3>
                <p className="text-gray-400 mt-2">
                  A balanced {teamType} team could not be generated from the available units. Try adding more units to your collection.
                </p>
            </div>
          )}
        </div>
        
        {explanation && team.length > 0 && (
          <div className="card mb-8">
            <h4 className="text-2xl font-bold text-cyan-400 mb-4">Team Rationale</h4>
            <div className="prose text-gray-300 max-w-none whitespace-pre-wrap">
              {explanation}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}