// src/data/bossSchema.js

// Put ALL imports at the very top
import bosses from "./bosses_data.json";

// Priority weights for scoring
export const priorityScores = {
  Critical: 1000,
  High: 300,
  Medium: 100,
  Low: 10,
};

/**
 * Evaluate a unit against a specific boss's problems.
 * Returns a score adjustment and a list of problems this unit helps solve.
 */
export function evaluateUnitForBoss(unit, boss) {
  let score = 0;
  const solves = [];

  if (!boss?.problems || !Array.isArray(boss.problems)) {
    return { score, solves };
  }

  const unitTags = (unit.Tags || "").toLowerCase();
  const unitElement = unit.Element;
  const unitRace = unit.Race;

  boss.problems.forEach((problem) => {
    // Check if the unit matches any solution keywords
    if (
      problem.solutionKeywords &&
      problem.solutionKeywords.some((kw) => unitTags.includes(kw))
    ) {
      score += priorityScores[problem.priority] || 0;
      solves.push(problem.problem);
    }

    // Apply penalties for killers / restrictions
    if (problem.problem.toLowerCase().includes("killer")) {
      if (problem.problem.includes("Water") && unitElement === "Water") score -= 5000;
      if (problem.problem.includes("Fire") && unitElement === "Fire") score -= 5000;
      if (problem.problem.includes("Earth") && unitElement === "Earth") score -= 5000;
      if (problem.problem.includes("Light") && unitElement === "Light") score -= 5000;
      if (problem.problem.includes("Dark") && unitElement === "Dark") score -= 5000;

      if (problem.problem.includes("Human") && unitRace === "Human") score -= 5000;
      if (problem.problem.includes("God") && unitRace === "God") score -= 5000;
      if (problem.problem.includes("Demon") && unitRace === "Demon") score -= 5000;
      if (problem.problem.includes("Machine") && unitRace === "Machine") score -= 5000;
      if (problem.problem.includes("Spirit") && unitRace === "Spirit") score -= 5000;
    }

    // Restrictions (e.g., boss forbids Demons)
    if (boss.questRestrictions) {
      boss.questRestrictions.forEach((r) => {
        if (r.type === "Race" && unitRace === r.value) score -= 10000;
        if (r.type === "Element" && unitElement === r.value) score -= 10000;
      });
    }
  });

  return { score, solves };
}

// Export bosses JSON
export { bosses };
