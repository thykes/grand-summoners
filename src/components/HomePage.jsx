// src/components/HomePage.jsx
import React, { useState, useEffect, useMemo, useCallback, useReducer, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UnitCard from "./UnitCard";
import PageHeader from "./PageHeader";
import QuestGuide from "./QuestGuide";
import LoadingStepper from "./LoadingStepper";
import { buildTeamWithRules } from "../utils/teamBuilder";
import { getFunctions, httpsCallable } from "firebase/functions";
import ReactMarkdown from "react-markdown";

const initialState = {
  status: "idle", // idle | loading | success
  result: { team: [], plan: "" },
  loadingStep: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_START": return { ...state, status: "loading", loadingStep: 0 };
    case "SET_LOCAL_RESULT": return { ...state, status: "loading", result: action.payload };
    case "NEXT_LOADING_STEP": return { ...state, loadingStep: state.loadingStep + 1 };
    case "SET_LOADING_STEP": return { ...state, loadingStep: action.payload };
    case "SET_AI_PLAN": return { ...state, status: "success", result: { ...state.result, plan: action.payload } };
    case "FETCH_ERROR": return { ...state, status: "success", result: { ...state.result, plan: "⚠️ Could not generate AI strategy." } };
    case "HYDRATE": return { ...state, status: "success", result: action.payload, loadingStep: 0 };
    default: return state;
  }
}

export default function HomePage({ allUnits, allBosses, allGuides, allEquipment, myUnits, myEquipment, setSelectedUnit, setSelectedEquip }) {
  const navigate = useNavigate();
  const stepperTimerRef = useRef(null);
  const [selectedEventType, setSelectedEventType] = useState("Trials");
  const [selectedBoss, setSelectedBoss] = useState(null);
  const [builderState, dispatch] = useReducer(reducer, initialState);
  const [activeTab, setActiveTab] = useState("strategy");
  const hydratedRef = useRef(false);

  const loadingSteps = [
    "Analyzing Team Synergy...",
    "Evaluating Equipment Loadout...",
    "Cross-Referencing Boss Mechanics...",
    "Formulating Core Strategy...",
    "Writing Step-by-Step Execution...",
    "Formatting the Battle Plan...",
  ];

  const categoryMap = useMemo(() => ({
    "Trials": "Trial Event",
    "Crest Palace": "Crest Boss",
    "Giant Boss": "Crest Boss",
    "Epic Events": "Trial Event",
    "Events": "Trial Event",
    "Assault Events": "Trial Event",
    "Quests": "Trial Event",
    "Side Quests": "Trial Event",
    "Summoners' Road": "Trial Event",
  }), []);

  const filteredBosses = useMemo(() => {
    const mappedType = categoryMap[selectedEventType] || selectedEventType;
    return allBosses
      .filter((b) => b.type === mappedType)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allBosses, selectedEventType, categoryMap]);

  const currentGuide = useMemo(() =>
    selectedBoss ? allGuides.find((g) => g.id === selectedBoss.id) : null, [selectedBoss, allGuides]);

  const generateTeamAndPlan = useCallback(async () => {
    if (!selectedBoss || !currentGuide) return;
    // Reset and start stepper ticking
    dispatch({ type: "FETCH_START" });
    if (stepperTimerRef.current) clearInterval(stepperTimerRef.current);
    // We now align steps to real milestones, not a free-running timer

    const userUnits = myUnits.size > 0
      ? allUnits.filter((u) => myUnits.has(u.id))
      : allUnits;
    const userEquips = myEquipment.size > 0
      ? Array.from(myEquipment.entries()).flatMap(([id, count]) =>
        Array(count).fill(allEquipment.find((e) => e.id === id))).filter(Boolean)
      : allEquipment;

    console.log("User Units Passed:", userUnits.length);

    const localResult = buildTeamWithRules(selectedBoss, currentGuide, userUnits, userEquips);
    dispatch({ type: "SET_LOCAL_RESULT", payload: { ...localResult, bossId: selectedBoss.id } });
    // Completed synergy analysis and equipment evaluation
    dispatch({ type: "SET_LOADING_STEP", payload: 1 });

    if (!localResult.team || localResult.team.length === 0) {
      console.warn("⚠️ No valid team could be built.");
      if (stepperTimerRef.current) {
        clearInterval(stepperTimerRef.current);
        stepperTimerRef.current = null;
      }
      return;
    }

    try {
      // Cross-reference mechanics and formulate request
      dispatch({ type: "SET_LOADING_STEP", payload: 2 });
      const functions = getFunctions();
      const generateBattlePlan = httpsCallable(functions, "generateBattlePlan");
      // Begin AI formulation
      dispatch({ type: "SET_LOADING_STEP", payload: 3 });
      const payload = { boss: selectedBoss, team: localResult.team.map(m => m.unit), fullLoadout: localResult.team };
      const aiResult = await generateBattlePlan(payload);
      // AI returned, now writing/formatting
      dispatch({ type: "SET_LOADING_STEP", payload: 4 });
      dispatch({ type: "SET_AI_PLAN", payload: aiResult.data.battlePlan });
      // Final formatting step completed
      dispatch({ type: "SET_LOADING_STEP", payload: 5 });
    } catch {
      dispatch({ type: "FETCH_ERROR" });
    }
    // Stop stepper when finished
    if (stepperTimerRef.current) {
      clearInterval(stepperTimerRef.current);
      stepperTimerRef.current = null;
    }
  }, [selectedBoss, currentGuide, allUnits, myUnits, myEquipment, allEquipment]);

  // Cleanup on unmount
  useEffect(() => () => {
    if (stepperTimerRef.current) clearInterval(stepperTimerRef.current);
  }, []);

  useEffect(() => {
    // One-time hydration from localStorage when data is available
    if (!hydratedRef.current && allBosses && allBosses.length > 0) {
      let saved = null;
      try { saved = JSON.parse(localStorage.getItem('eventBuilderStateV1') || 'null'); } catch {}
      if (saved) {
        // Try to restore boss first
        let found = null;
        if (saved.bossId) {
          found = allBosses.find(b => b.id === saved.bossId) || null;
          if (found) setSelectedBoss(found);
        }
        // Restore or align category with found boss type so it remains visible in the dropdown
        if (found) {
          const bossType = found.type; // e.g., 'Crest Boss' or 'Trial Event'
          const validCats = Object.keys(categoryMap).filter(k => categoryMap[k] === bossType);
          const savedCat = saved.eventType;
          if (savedCat && validCats.includes(savedCat)) {
            setSelectedEventType(savedCat);
          } else if (validCats.length > 0) {
            // Prefer a sensible default category for each type
            const preferred = bossType === 'Crest Boss' ? 'Giant Boss' : 'Trials';
            setSelectedEventType(validCats.includes(preferred) ? preferred : validCats[0]);
          }
        } else if (saved.eventType) {
          setSelectedEventType(saved.eventType);
        }

        if (saved.builderResult) {
          dispatch({ type: 'HYDRATE', payload: saved.builderResult });
        }
        if (saved.activeTab) setActiveTab(saved.activeTab);
      }
      hydratedRef.current = true;
    }
  }, [allBosses, categoryMap]);

  useEffect(() => {
    if (!filteredBosses.length) {
      if (selectedBoss) setSelectedBoss(null);
      return;
    }
    const inList = selectedBoss && filteredBosses.some(b => b.id === selectedBoss.id);
    if (!selectedBoss || !inList) {
      if (hydratedRef.current) {
        // Skip once right after hydration to preserve restored selection
        hydratedRef.current = false;
        return;
      }
      setSelectedBoss(filteredBosses[0]);
    }
  }, [filteredBosses, selectedBoss]);

  // Persist current builder view/state so navigating away/back or reloading restores instantly
  useEffect(() => {
    const toSave = {
      eventType: selectedEventType,
      bossId: selectedBoss?.id || null,
      builderResult: builderState.result,
      activeTab,
    };
    try { localStorage.setItem('eventBuilderStateV1', JSON.stringify(toSave)); } catch {}
  }, [selectedEventType, selectedBoss, builderState.result, activeTab]);

  return (
    <div className="w-full">
      <div className="mt-28 mb-28">
        <PageHeader title="Event Team Builder" subtitle="Rulebook-Powered Suggestions & In-Depth Guides" />
      </div>

      <main className="w-full">
        {/* Controls (no container) */}
        <section className="mb-28">
          <h3 className="text-2xl font-bold text-white mb-2">Choose a quest</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* Quest Category Dropdown */}
            <div>
              <select
                id="quest-category"
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e.target.value)}
                className="select w-full"
                aria-label="Quest category"
              >
                {[
                  "Quests",
                  "Side Quests",
                  "Events",
                  "Epic Events",
                  "Assault Events",
                  "Giant Boss",
                  "Crest Palace",
                  "Trials",
                  "Summoners' Road",
                ].map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Boss Dropdown */}
            <div>
              <select
                id="boss-select"
                aria-label="Select Boss"
                onChange={(e) => setSelectedBoss(allBosses.find((b) => b.id === e.target.value) || null)}
                value={selectedBoss?.id || ""}
                className="select w-full"
                disabled={filteredBosses.length === 0}
              >
                {filteredBosses.length === 0 ? (
                  <option value="">No bosses available</option>
                ) : (
                  filteredBosses.map((boss) => (
                    <option key={boss.id} value={boss.id}>
                      {boss.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Generate Button */}
            <div className="flex md:justify-start">
              <button
                onClick={generateTeamAndPlan}
                disabled={builderState.status === "loading" || !selectedBoss}
                className="btn-primary w-full md:w-auto"
              >
                {builderState.status === "loading" ? "Generating..." : "Generate Strategy"}
              </button>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <nav className="tabs justify-start mb-8" aria-label="Builder sections">
          <button onClick={() => setActiveTab("strategy")} className={`tab ${activeTab === "strategy" ? "tab-active" : ""}`}>
            Team Breakdown
          </button>
          <button onClick={() => setActiveTab("guide")} className={`tab ${activeTab === "guide" ? "tab-active" : ""}`}>
            Guide
          </button>
        </nav>

        {/* Content */}
        {activeTab === "strategy" && (
          <>
            <h3 className="text-2xl font-bold text-white mb-4">Suggested Team</h3>
            {/* Team Grid (no container) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {builderState.result.team.length > 0 ? (
                builderState.result.team.map(({ unit, suggestedSlots }) => (
                  <UnitCard
                    key={unit.id}
                    unit={unit}
                    onClick={() => {
                      setSelectedUnit(unit);
                      navigate(`/unit/${unit.id}`);
                    }}
                    suggestedSlots={suggestedSlots}
                    onEquipClick={(equip) => {
                      setSelectedEquip(equip);
                      navigate(`/equip/${equip.id}`);
                    }}
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-400">
                  <p className="font-semibold">No Team Yet</p>
                  <p className="text-sm mt-1">Choose an event and boss above, then tap Generate Strategy.</p>
                </div>
              )}
            </div>

            {(builderState.status === "loading" || builderState.result.plan) && (
              <div className="card">
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
              </div>
            )}
          </>
        )}

        {activeTab === "guide" && currentGuide && (
          <div className="card">
            <h3 className="text-2xl font-bold text-white mb-4">Guide</h3>
            <QuestGuide
              guideData={currentGuide}
              allUnits={allUnits}
              onUnitClick={(u) => {
                setSelectedUnit(u);
                navigate(`/unit/${u.id}`);
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
