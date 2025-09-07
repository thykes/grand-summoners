// src/utils/teamBuilder.js
import { getArtGenInfo, getArtGenConflicts } from "../data/artGenGroups";
import { evaluateUnitForBoss, priorityScores } from "../data/bossSchema";
import { roleWeights, tierScores, eventBonuses, equipBonuses } from "../data/teamTuning";

// --- HELPER FUNCTIONS ---
const canUnitEquipInSlot = (slot, equip) => {
  if (!slot?.type || !equip?.Type || !equip.Rarity) return false;
  return slot.rarity >= equip.Rarity && slot.type.includes(equip.Type);
};

const hasRoleTag = (unit, role) =>
  (unit?.Role_Tags || "").toLowerCase().includes(String(role).toLowerCase());

// --- UNIT SCORING ---
const scoreUnitForFight = (unit, boss, expertGuide, desiredRole) => {
  let score = 0;
  const solves = [];

  // Base Ratings
  if (unit.ratings) {
    score +=
      (unit.ratings.defense +
        unit.ratings.artgen +
        unit.ratings.damage +
        unit.ratings.buffs +
        unit.ratings.heal +
        unit.ratings.break) *
      5;

    switch (desiredRole) {
      case "dps":
        score += (unit.ratings.damage || 0) * (roleWeights.dps || 200);
        break;
      case "artsgen":
        score += (unit.ratings.artgen || 0) * (roleWeights.artsgen || 200);
        break;
      case "tank":
        score += (unit.ratings.defense || 0) * (roleWeights.tank || 200);
        break;
      case "healer":
        score += (unit.ratings.heal || 0) * (roleWeights.healer || 200);
        break;
      case "support":
        score += (unit.ratings.buffs || 0) * (roleWeights.support || 200);
        break;
      case "breaker":
        score += (unit.ratings.break || 0) * (roleWeights.breaker || 200);
        break;
      default:
        // Light bias towards versatile units
        score += (unit.ratings.damage || 0) * (roleWeights.any || 150);
        score += (unit.ratings.buffs || 0) * (roleWeights.any || 150) * 0.5;
        score += (unit.ratings.defense || 0) * (roleWeights.any || 150) * 0.5;
        break;
    }
  } else if (unit?.tier_info?.tier) {
    score += tierScores[unit.tier_info.tier] || 0;
  }

  // Boss-specific
  const bossEval = evaluateUnitForBoss(unit, boss);
  score += bossEval.score;
  solves.push(...bossEval.solves);

  // Additional penalties from "avoid" hints in solution keywords
  (boss?.problems || []).forEach((problem) => {
    const kws = (problem?.solutionKeywords || []).map((k) => String(k).toLowerCase());
    const avoid = kws.filter((k) => k.startsWith("avoid "));
    avoid.forEach((k) => {
      if (k.includes("human") && unit.Race === "Human") score -= 1000;
      if (k.includes("god") && unit.Race === "God") score -= 1000;
      if (k.includes("demon") && unit.Race === "Demon") score -= 1000;
      if (k.includes("machine") && unit.Race === "Machine") score -= 1000;
      if (k.includes("spirit") && unit.Race === "Spirit") score -= 1000;

      if (k.includes("fire") && unit.Element === "Fire") score -= 1000;
      if (k.includes("water") && unit.Element === "Water") score -= 1000;
      if (k.includes("earth") && unit.Element === "Earth") score -= 1000;
      if (k.includes("light") && unit.Element === "Light") score -= 1000;
      if (k.includes("dark") && unit.Element === "Dark") score -= 1000;
    });
  });

  // Expert Guide Recommendation
  expertGuide?.recommendedUnits?.forEach((rec) => {
    if (rec.units.includes(unit.Unit_Name)) score += 150;
  });

  // Event-specific bonuses from tuning config
  const evt = eventBonuses[boss?.id];
  if (evt && (unit?.Tags || "").toLowerCase().includes(evt.tagIncludes)) {
    score += evt.bonus || 0;
  }

  return { ...unit, score, solves };
};

// --- EQUIPMENT LOGIC ---
const getBestEquipmentLoadout = (team, allUserEquips, boss) => {
  let availableEquips = [...allUserEquips];
  return team.map(({ unit }) => {
    const unitSlots = [
      { type: unit.Slot_1_Type, rarity: unit.Slot_1_Rarity },
      { type: unit.Slot_2_Type, rarity: unit.Slot_2_Rarity },
      { type: unit.Slot_3_Type, rarity: unit.Slot_3_Rarity },
    ];
    const suggestedSlots = { slot1: null, slot2: null, slot3: null };

    const scoreEquip = (equip) => {
      let score = (equip.Rarity || 0) * (equipBonuses.baseRarity || 5);
      const equipTags = (equip?.Tags || "").toLowerCase();
      boss?.problems?.forEach((problem) => {
        const kws = (problem?.solutionKeywords || []).map((k) => String(k).toLowerCase());
        if (kws.some((kw) => equipTags.includes(kw))) {
          score += priorityScores[problem.priority] || 0;
        }
      });
      if (equipTags.includes("dmg up")) score += (equipBonuses.dmgUp || 0);
      if (hasRoleTag(unit, "dps") && equipTags.includes("crit")) score += (equipBonuses.critForDps || 0);
      return score;
    };

    const scoredEquips = availableEquips
      .map((e) => ({ ...e, score: scoreEquip(e) }))
      .sort((a, b) => b.score - a.score);

    unitSlots.forEach((slot, index) => {
      if (!slot.type) return;
      const bestEquip = scoredEquips.find(
        (equip) => availableEquips.some((av) => av.id === equip.id) && canUnitEquipInSlot(slot, equip)
      );
      if (bestEquip) {
        suggestedSlots[`slot${index + 1}`] = bestEquip;
        availableEquips = availableEquips.filter((e) => e.id !== bestEquip.id);
      }
    });

    const slotsArray = [suggestedSlots.slot1, suggestedSlots.slot2, suggestedSlots.slot3];
    return { unit, suggestedSlots: slotsArray };
  });
};

// --- MAIN BUILDER ---
export const buildTeamWithRules = (
  boss,
  expertGuide,
  allUserUnits,
  allUserEquips
) => {
  if (!boss || !expertGuide || !allUserUnits) {
    return { team: [], plan: "Not enough data." };
  }

  let availableUnits = [...allUserUnits];
  const team = [];
  let usedArtGenGroups = new Set();

  const findAndAddUnit = (roleToFind) => {
    let bestUnit = null;
    let highestScore = -Infinity;

    for (const unit of availableUnits) {
      const artGenInfo = getArtGenInfo(unit.Unit_Name);
      // Only restrict overlapping ArtGen groups when selecting an ArtGen role
      if (roleToFind === "artsgen" && artGenInfo && usedArtGenGroups.has(artGenInfo.type)) continue;

      const scoredUnit = scoreUnitForFight(
        unit,
        boss,
        expertGuide,
        roleToFind
      );

      if (scoredUnit.score > highestScore) {
        highestScore = scoredUnit.score;
        bestUnit = scoredUnit;
      }
    }

    if (bestUnit) {
      team.push({ unit: bestUnit });
      availableUnits = availableUnits.filter((u) => u.id !== bestUnit.id);

      const artGenInfo = getArtGenInfo(bestUnit.Unit_Name);
      if (artGenInfo) {
        getArtGenConflicts(artGenInfo.type).forEach((group) =>
          usedArtGenGroups.add(group)
        );
      }
    }
  };

  // Standard template with boss-aware flex role
  const bossNeedsBreaker = (boss?.problems || []).some((p) => (p.problem || "").toLowerCase().includes("requires breaking"));
  const bossHighDamage = (boss?.problems || []).some((p) => (p.problem || "").toLowerCase().includes("high damage"));

  findAndAddUnit("artsgen");
  findAndAddUnit("artsgen");
  findAndAddUnit("dps");
  if (bossNeedsBreaker) {
    findAndAddUnit("breaker");
  } else if (bossHighDamage) {
    findAndAddUnit("tank");
  } else {
    findAndAddUnit("support");
  }

  if (team.length < 4) findAndAddUnit("support");
  while (team.length < 4 && availableUnits.length > 0) findAndAddUnit("any");

  if (team.length === 0) {
    return { team: [], plan: "⚠️ No valid team could be built." };
  }

  const teamWithEquips = getBestEquipmentLoadout(team, allUserEquips, boss);
  return { team: teamWithEquips, plan: "" };
};
