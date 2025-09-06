// src/components/HomePage.jsx

import React, { useState, useEffect, useMemo, useCallback, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import UnitCard from './UnitCard';
import PageHeader from './PageHeader';
import QuestGuide from './QuestGuide';
import BattlePlanDisplay from './BattlePlanDisplay';
import LoadingStepper from './LoadingStepper';
import { buildTeamWithRules } from '../utils/teamBuilder';
import { getFunctions, httpsCallable } from 'firebase/functions';

const initialState = {
  status: 'idle', // 'idle', 'loading', 'success', 'error'
  result: { team: [], plan: '' },
  loadingStep: 0,
};

const teamBuilderReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, status: 'loading', loadingStep: 0 };
    case 'SET_LOCAL_RESULT':
      return { ...state, status: 'loading', result: action.payload };
    case 'NEXT_LOADING_STEP':
      return { ...state, loadingStep: state.loadingStep + 1 };
    case 'SET_AI_PLAN':
      return { ...state, status: 'success', result: { ...state.result, plan: action.payload }, loadingStep: 0 };
    case 'FETCH_ERROR':
      return { ...state, status: 'success', result: { ...state.result, plan: "Could not generate an enhanced strategy. Displaying local version." }, loadingStep: 0 };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// <-- FIX: Removed all default props. Loading is now guaranteed by App.jsx.
export default function HomePage({ allUnits, allBosses, allGuides, allEquipment, myUnits, myEquipment, setSelectedUnit, setSelectedEquip }) {
  const navigate = useNavigate();
  const [selectedEventType, setSelectedEventType] = useState('Crest Boss');
  const [selectedBoss, setSelectedBoss] = useState(null);
  const [builderState, dispatch] = useReducer(teamBuilderReducer, initialState);
  const [activeTab, setActiveTab] = useState('strategy');

  const filteredBosses = useMemo(() => {
    return allBosses
      .filter(boss => boss.type === selectedEventType && boss.id)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allBosses, selectedEventType]);

  const currentGuide = useMemo(() => {
    if (!selectedBoss || !allGuides) return null;
    return allGuides.find(guide => guide.id === selectedBoss.id);
  }, [selectedBoss, allGuides]);

  const loadingSteps = useMemo(() => [
    "Analyzing Team Synergy...",
    "Evaluating Equipment Loadout...",
    "Cross-Referencing Boss Mechanics...",
    "Formulating Core Strategy...",
    "Writing Step-by-Step Execution...",
    "Formatting the Battle Plan...",
  ], []);

  useEffect(() => {
    let interval;
    if (builderState.status === 'loading' && builderState.loadingStep < loadingSteps.length - 1) {
      interval = setInterval(() => {
        dispatch({ type: 'NEXT_LOADING_STEP' });
      }, 7000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [builderState.status, builderState.loadingStep, loadingSteps.length]);

  const generateTeamAndPlan = useCallback(async (forceRegenerate = false) => {
    if (!selectedBoss || !currentGuide) return;
    if (builderState.status === 'loading' && !forceRegenerate) return;
    if (builderState.result?.team?.length > 0 && builderState.result.bossId === selectedBoss.id && !forceRegenerate) return;
    
    dispatch({ type: 'FETCH_START' });

    const userUnits = myUnits.size > 0 ? allUnits.filter(unit => myUnits.has(unit.id)) : allUnits;
    const userEquips = myEquipment.size > 0 ? Array.from(myEquipment.entries()).flatMap(([id, count]) => Array(count).fill(allEquipment.find(e => e.id === id))).filter(Boolean) : allEquipment;
    
    // Using a timeout to ensure the UI has time to update to the loading state before this potentially blocking call
    setTimeout(async () => {
      const localResult = buildTeamWithRules(selectedBoss, currentGuide, userUnits, userEquips);
      dispatch({ type: 'SET_LOCAL_RESULT', payload: { ...localResult, bossId: selectedBoss.id } });

      try {
        const functions = getFunctions();
        const generateBattlePlanCallable = httpsCallable(functions, 'generateBattlePlan');
        
        const payload = {
          boss: selectedBoss,
          team: localResult.team.map(member => member.unit),
          fullLoadout: localResult.team,
        };

        const aiResult = await generateBattlePlanCallable(payload);
        const { battlePlan } = aiResult.data;

        if (battlePlan) {
          dispatch({ type: 'SET_AI_PLAN', payload: battlePlan });
        } else {
          throw new Error("AI returned an empty plan.");
        }
      } catch (error) {
        console.error("Could not get enhanced AI plan, using local fallback.", error);
        dispatch({ type: 'FETCH_ERROR' });
      }
    }, 100); // Small delay to allow render update
  }, [selectedBoss, currentGuide, allUnits, allEquipment, myUnits, myEquipment, builderState.status, builderState.result]);

  useEffect(() => {
    if (filteredBosses.length > 0 && !selectedBoss) {
      setSelectedBoss(filteredBosses[0]);
    } else if (filteredBosses.length > 0 && selectedBoss) {
      // Ensure selected boss is still valid for the new event type
      if (!filteredBosses.some(b => b.id === selectedBoss.id)) {
        setSelectedBoss(filteredBosses[0]);
      }
    }
  }, [filteredBosses, selectedBoss]);

  useEffect(() => {
    if (selectedBoss) {
        generateTeamAndPlan();
    }
  }, [selectedBoss, generateTeamAndPlan]);

  const handleEventTypeChange = (type) => {
    setSelectedEventType(type);
    setSelectedBoss(null); // Reset boss selection when changing types
  };
  
  const handleBossChange = (event) => {
    const newBoss = allBosses.find(b => b.id === event.target.value);
    setSelectedBoss(newBoss);
    setActiveTab('strategy');
  };
  
  const handleUnitClick = (unit) => {
    setSelectedUnit(unit);
    navigate(`/unit/${unit.id}`);
  };

  const handleEquipClick = (equip) => {
    setSelectedEquip(equip);
    navigate(`/equip/${equip.id}`);
  };

  const isGenerating = builderState.status === 'loading';
  const currentResult = builderState.result;

  return (
    <div className="w-full">
      <PageHeader title="Event Team Builder" subtitle="Rulebook-Powered Suggestions & In-Depth Guides" />
      <main className="w-full">
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex space-x-2 p-1 bg-gray-900/50 rounded-full border border-gray-700">
              <button onClick={() => handleEventTypeChange('Crest Boss')} className={`px-5 py-2 text-sm rounded-full font-semibold transition-colors duration-300 ${selectedEventType === 'Crest Boss' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>Crest Bosses</button>
              <button onClick={() => handleEventTypeChange('Trial Event')} className={`px-5 py-2 text-sm rounded-full font-semibold transition-colors duration-300 ${selectedEventType === 'Trial Event' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>Trial Events</button>
            </div>
            <select id="board-select" onChange={handleBossChange} value={selectedBoss?.id || ''} className="bg-gray-700/80 text-white rounded-md p-3 w-full md:w-auto border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500">
              {filteredBosses.map(boss => (
                <option key={boss.id} value={boss.id}>{boss.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-center mb-6">
            <button 
                onClick={() => generateTeamAndPlan(true)}
                disabled={isGenerating}
                className="btn-secondary disabled:opacity-50"
            >
                {isGenerating ? 'Generating...' : 'Regenerate Team'}
            </button>
        </div>

        {myUnits.size > 0 && ( <div className="text-center text-green-400 mb-6 font-semibold"><p>✓ Using your {myUnits.size} selected units.</p></div> )}
        <h3 className="text-3xl font-bold text-white text-center mb-6">Strategy for {selectedBoss?.name}</h3>
        
        <div className="mb-8 flex justify-center border-b border-gray-700">
            <button onClick={() => setActiveTab('strategy')} className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'strategy' ? 'text-white border-b-2 border-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}>
                Team Breakdown
            </button>
            <button onClick={() => setActiveTab('guide')} className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'guide' ? 'text-white border-b-2 border-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}>
                Quest Guide
            </button>
        </div>

        <div className="card">
            {activeTab === 'strategy' && (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {isGenerating && !currentResult.team?.length > 0 ? (
                           [...Array(4)].map((_, i) => <div key={i} className="card p-3 flex flex-col items-center text-center animate-pulse"><div className="rounded-lg bg-gray-700 h-24 w-24 mb-2"></div><div className="h-4 bg-gray-700 rounded w-2/3"></div></div>)
                        ) : currentResult.team?.length > 0 ? ( 
                            currentResult.team.map(({ unit, suggestedSlots }) => 
                                <UnitCard 
                                    unit={unit} 
                                    key={unit.id} 
                                    onClick={handleUnitClick}
                                    suggestedSlots={suggestedSlots}
                                    onEquipClick={handleEquipClick}
                                />
                            ) 
                        ) : ( 
                           <div className="col-span-full text-center py-8"><h3 className="text-xl font-semibold text-white">Could Not Form a Team</h3><p className="text-gray-400 mt-2">{currentResult.plan}</p></div> 
                        )}
                    </div>
                    
                    {isGenerating && currentResult.team?.length > 0 && (
                      <div className="mt-6">
                        <LoadingStepper steps={loadingSteps} currentStep={builderState.loadingStep} />
                      </div>
                    )}
                    
                    {!isGenerating && currentResult.plan && (
                      <div>
                          <h4 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 mb-4">Battle Plan</h4>
                          <BattlePlanDisplay plan={currentResult.plan} allUnits={allUnits} onUnitClick={handleUnitClick} />
                      </div> 
                    )}
                </>
            )}

            {activeTab === 'guide' && (
                <QuestGuide guideData={currentGuide} allUnits={allUnits} onUnitClick={handleUnitClick} />
            )}
        </div>
      </main>
    </div>
  );
}