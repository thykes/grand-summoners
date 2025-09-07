// src/utils/generalTeamBuilder.js
import { evaluateUnitForBoss } from "../data/bossSchema";

/**
 * Score a unit for a given boss by combining:
 * - Role usefulness
 * - Boss mechanics solved
 * - Base stats (optional extension later)
 */
export function scoreUnit(unit, boss) {
  let score = 0;

  // 🔹 Base role scoring
  const role = (unit.Primary_Archetype || unit.Role_Type || "").toLowerCase();
  if (role.includes("tank")) score += 500;
  if (role.includes("breaker")) score += 600;
  if (role.includes("support")) score += 400;
  if (role.includes("healer")) score += 450;
  if (role.includes("dps") || role.includes("attacker")) score += 300;

  // 🔹 Evaluate against boss mechanics
  const { score: bossScore } = evaluateUnitForBoss(unit, boss);
  score += bossScore;

  return score;
}

/**
 * Pick the best team of up to 4 units
 */
export function buildGeneralTeam(units, boss) {
  if (!units || units.length === 0) return [];

  // Score all units
  const scoredUnits = units
    .map((unit) => ({
      unit,
      score: scoreUnit(unit, boss),
    }))
    .sort((a, b) => b.score - a.score);

  // Return top 4
  return scoredUnits.slice(0, 4);
}
