// src/components/HomePage.jsx
import React, { useState, useEffect, useMemo, useCallback, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import UnitCard from "./UnitCard";
import PageHeader from "./PageHeader";
import QuestGuide from "./QuestGuide";
import LoadingStepper from "./LoadingStepper";
import { buildTeamWithRules } from "../utils/teamBuilder";
import { getFunctions, httpsCallable } from "firebase/functions";
import ReactMarkdown from "react-markdown";

const initialState = {
  status: "idle", // idle | loading | success | error
  result: { team: [], plan: "" },
  loadingStep: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, status: "loading", loadingStep: 0 };
    case "SET_LOCAL_RESULT":
      return { ...state, status: "loading", result: action.payload };
    case "NEXT_LOADING_STEP":
      return { ...state, loadingStep: state.loadingStep + 1 };
    case "SET_AI_PLAN":
      return { ...state, status: "success", result: { ...state.result, plan: action.payload }, loadingStep: 0 };
    case "FETCH_ERROR":
      return { ...state, status: "success", result: { ...state.result, plan: "⚠️ Could not generate AI strategy." }, loadingStep: 0 };
    default:
      return state;
  }
}

export default function HomePage({ allUnits, allBosses, allGuides, allEquipment, myUnits, myEquipment, setSelectedUnit, setSelectedEquip }) {
  const navigate = useNavigate();
  const [selectedEventType, setSelectedEventType] = useState("Crest Boss");
  const [selectedBoss, setSelectedBoss] = useState(null);
  const [builderState, dispatch] = useReducer(reducer, initialState);
  const [activeTab, setActiveTab] = useState("strategy");

  const filteredBosses = useMemo(() =>
    allBosses.filter((b) => b.type === selectedEventType).sort((a, b) => a.name.localeCompare(b.name)), 
    [allBosses, selectedEventType]
  );

  const currentGuide = useMemo(() =>
    selectedBoss ? allGuides.find((g) => g.id === selectedBoss.id) : null, 
    [selectedBoss, allGuides]
  );

  const loadingSteps = [
    "Analyzing Team Synergy...",
    "Evaluating Equipment Loadout...",
    "Cross-Referencing Boss Mechanics...",
    "Formulating Core Strategy...",
    "Writing Step-by-Step Execution...",
    "Formatting the Battle Plan...",
  ];

  const generateTeamAndPlan = useCallback(async () => {
    if (!selectedBoss || !currentGuide) return;
    dispatch({ type: "FETCH_START" });

    const userUnits = myUnits.size > 0
      ? allUnits.filter((u) => myUnits.has(u.id))
      : allUnits;
    const userEquips = myEquipment.size > 0
      ? Array.from(myEquipment.entries()).flatMap(([id, count]) =>
          Array(count).fill(allEquipment.find((e) => e.id === id))
        ).filter(Boolean)
      : allEquipment;

    const localResult = buildTeamWithRules(selectedBoss, currentGuide, userUnits, userEquips);
    dispatch({ type: "SET_LOCAL_RESULT", payload: { ...localResult, bossId: selectedBoss.id } });

    if (!localResult.team || localResult.team.length === 0) {
      console.warn("⚠️ No valid team could be built.");
      return;
    }

    try {
      const functions = getFunctions();
      const generateBattlePlan = httpsCallable(functions, "generateBattlePlan");
      const payload = { boss: selectedBoss, team: localResult.team.map(m => m.unit), fullLoadout: localResult.team };
      const aiResult = await generateBattlePlan(payload);
      dispatch({ type: "SET_AI_PLAN", payload: aiResult.data.battlePlan });
    } catch {
      dispatch({ type: "FETCH_ERROR" });
    }
  }, [selectedBoss, currentGuide, allUnits, myUnits, myEquipment, allEquipment]);

  useEffect(() => { 
    if (filteredBosses.length && !selectedBoss) setSelectedBoss(filteredBosses[0]); 
  }, [filteredBosses, selectedBoss]);

  return (
    <div className="w-full">
      <PageHeader title="Event Team Builder" subtitle="Rulebook-Powered Suggestions & In-Depth Guides" />

      <main className="w-full">


        {/* --- Boss Selection --- */}
<div className="card mb-8">
  <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
    {/* Event Type Toggle */}
    <div className="flex space-x-2 p-1 bg-gray-900/50 rounded-full border border-gray-700">
      <button
        onClick={() => setSelectedEventType("Crest Boss")}
        className={`px-5 py-2 text-sm rounded-full font-semibold transition-colors duration-300 ${
          selectedEventType === "Crest Boss"
            ? "bg-indigo-600 text-white"
            : "text-gray-300 hover:bg-gray-700"
        }`}
      >
        Crest Bosses
      </button>
      <button
        onClick={() => setSelectedEventType("Trial Event")}
        className={`px-5 py-2 text-sm rounded-full font-semibold transition-colors duration-300 ${
          selectedEventType === "Trial Event"
            ? "bg-purple-600 text-white"
            : "text-gray-300 hover:bg-gray-700"
        }`}
      >
        Trial Events
      </button>
    </div>

    {/* Boss Dropdown */}
    <select
      id="boss-select"
      onChange={(e) =>
        setSelectedBoss(allBosses.find((b) => b.id === e.target.value) || null)
      }
      value={selectedBoss?.id || ""}
      className="bg-gray-700/80 text-white rounded-md p-3 w-full md:w-auto border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
    >
      {filteredBosses.map((boss) => (
        <option key={boss.id} value={boss.id}>
          {boss.name}
        </option>
      ))}
    </select>
  </div>
</div>


        {/* --- Generate Button --- */}
        <div className="text-center mb-6">
          <button onClick={generateTeamAndPlan} disabled={builderState.status === "loading"} className="btn-secondary">
            {builderState.status === "loading" ? "Generating..." : "Generate Strategy"}
          </button>
        </div>

        {/* --- Tabs --- */}
        <div className="mb-8 flex justify-center border-b border-gray-700">
          <button
            onClick={() => setActiveTab("strategy")}
            className={`px-6 py-3 font-semibold ${activeTab === "strategy" ? "text-white border-b-2 border-cyan-400" : "text-gray-500 hover:text-gray-300"}`}
          >
            Team Breakdown
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            className={`px-6 py-3 font-semibold ${activeTab === "guide" ? "text-white border-b-2 border-cyan-400" : "text-gray-500 hover:text-gray-300"}`}
          >
            Quest Guide
          </button>
        </div>

        {/* --- Content --- */}
        <div className="card">
          {activeTab === "strategy" && (
            <>
              {/* Team Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {builderState.result.team.length > 0 ? (
                  builderState.result.team.map(({ unit, suggestedSlots }) => (
                    <UnitCard 
                      key={unit.id} 
                      unit={unit} 
                      onClick={() => { setSelectedUnit(unit); navigate(`/unit/${unit.id}`); }}
                      suggestedSlots={suggestedSlots}
                      onEquipClick={(equip) => { setSelectedEquip(equip); navigate(`/equip/${equip.id}`); }}
                    />
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-400">No Team Yet</p>
                )}
              </div>

              {/* Stepper */}
              {builderState.status === "loading" && (
                <LoadingStepper steps={loadingSteps} currentStep={builderState.loadingStep} />
              )}

              {/* Markdown Plan */}
              {builderState.result.plan && (
                <div className="mt-6 prose prose-invert max-w-none">
                  <ReactMarkdown>{builderState.result.plan}</ReactMarkdown>
                </div>
              )}
            </>
          )}

          {activeTab === "guide" && currentGuide && (
            <QuestGuide guideData={currentGuide} allUnits={allUnits} onUnitClick={(u) => { setSelectedUnit(u); navigate(`/unit/${u.id}`); }} />
          )}
        </div>
      </main>
    </div>
  );
}
