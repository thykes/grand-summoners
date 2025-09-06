// src/utils/teamBuilder.js - V2 with Role-Aware Weighted Scoring

import { getArtGenInfo, getArtGenConflicts } from '../data/artGenGroups';

const priorityScores = { "Critical": 1000, "High": 100, "Medium": 50 };

// --- HELPER FUNCTIONS ---
const canUnitEquipInSlot = (slot, equip) => {
  if (!slot?.type || !equip?.Type || !equip.Rarity) return false;
  return slot.rarity >= equip.Rarity && slot.type.includes(equip.Type);
};
const hasRoleTag = (unit, role) => unit.Role_Tags?.toLowerCase().includes(role);


// --- NEW & IMPROVED SCORING LOGIC ---
const scoreUnitForFight = (unit, boss, expertGuide, desiredRole) => {
  let score = 0;
  const solves = [];

  // 1. Base Score from Numerical Ratings (if they exist)
  if (unit.ratings) {
    // Add a base score for general power level (sum of all stats)
    score += (unit.ratings.defense + unit.ratings.artgen + unit.ratings.damage + unit.ratings.buffs + unit.ratings.heal + unit.ratings.break) * 5;
    
    // HEAVILY weight the score based on the desired role
    switch (desiredRole) {
        case 'dps':       score += (unit.ratings.damage || 0) * 150; break;
        case 'artsgen':   score += (unit.ratings.artgen || 0) * 150; break;
        case 'tank':      score += (unit.ratings.defense || 0) * 150; break;
        case 'healer':    score += (unit.ratings.heal || 0) * 150; break;
        case 'support':   score += (unit.ratings.buffs || 0) * 150; break;
        case 'breaker':   score += (unit.ratings.break || 0) * 150; break;
        default: break;
    }
  } else if (unit?.tier_info?.tier) { // Fallback to old tier system for units not in the new list
    const tierScores = { 'SS': 200, 'S+': 160, 'S': 120, 'A': 80, 'B': 40 };
    score += tierScores[unit.tier_info.tier] || 0;
  }
  
  // 2. Bonus for solving specific boss problems (Critical)
  boss.problems?.forEach(problem => {
    const solutionKeywords = problem.solution.split(',').map(s => s.trim().toLowerCase());
    const unitTags = unit.Tags?.toLowerCase() || '';
    if (solutionKeywords.some(keyword => unitTags.includes(keyword))) {
        score += priorityScores[problem.priority] || 0;
        solves.push(problem.problem);
    }
  });

  // 3. Bonus for being a recommended unit in the guide
  expertGuide.recommendedUnits.forEach(rec => {
    if (rec.units.includes(unit.Unit_Name)) score += 150;
  });

  // 4. Specific Event Bonus
  if (boss.id === 'Okarun_Turbo_Granny' && unit.Tags?.toLowerCase().includes('dan da dan')) {
    score += 200;
    solves.push("Event Bonus Unit");
  }

  // 5. Penalties for being countered by the boss
  const killerProblems = boss.problems?.filter(p => p.problem.toLowerCase().includes('killer')) || [];
  for (const problem of killerProblems) {
      if ((problem.problem.includes('Water') || problem.solution.includes('Avoid Water')) && unit.Element === 'Water') score -= 5000;
      if ((problem.problem.includes('Earth') || problem.solution.includes('Avoid Earth')) && unit.Element === 'Earth') score -= 5000;
      if ((problem.problem.includes('Fire') || problem.solution.includes('Avoid Fire')) && unit.Element === 'Fire') score -= 5000;
      if ((problem.problem.includes('Light') || problem.solution.includes('Avoid Light')) && unit.Element === 'Light') score -= 5000;
      if ((problem.problem.includes('Dark') || problem.solution.includes('Avoid Dark')) && unit.Element === 'Dark') score -= 5000;
      if ((problem.problem.includes('Human') || problem.solution.includes('Avoid Human')) && unit.Race === 'Human') score -= 5000;
      if ((problem.problem.includes('God') || problem.solution.includes('Avoid God')) && unit.Race === 'God') score -= 5000;
      if ((problem.problem.includes('Demon') || problem.solution.includes('Avoid Demon')) && unit.Race === 'Demon') score -= 5000;
  }
  
  return { ...unit, score, solves };
};

// --- Equipment Logic (Unchanged) ---
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
            let score = equip.Rarity * 5;
            boss.problems.forEach(problem => {
                const solutionKeywords = problem.solution.split(',').map(s => s.trim().toLowerCase());
                const equipTags = equip.Tags?.toLowerCase() || '';
                if (solutionKeywords.some(keyword => equipTags.includes(keyword))) {
                    score += priorityScores[problem.priority] || 0;
                }
            });
            if (equip.Tags?.toLowerCase().includes('dmg up')) score += 15;
            if (hasRoleTag(unit, 'dps') && equip.Tags?.toLowerCase().includes('crit dmg up')) score += 10;
            return score;
        };

        const scoredEquips = availableEquips
            .map(e => ({ ...e, score: scoreEquip(e) }))
            .sort((a, b) => b.score - a.score);

        unitSlots.forEach((slot, index) => {
            if (!slot.type) return;
            const bestEquip = scoredEquips.find(equip => 
                availableEquips.some(avail => avail.id === equip.id) && canUnitEquipInSlot(slot, equip)
            );
            if (bestEquip) {
                suggestedSlots[`slot${index + 1}`] = bestEquip;
                const equipIndex = availableEquips.findIndex(e => e.id === bestEquip.id);
                if (equipIndex > -1) {
                    availableEquips.splice(equipIndex, 1);
                }
            }
        });
        return { unit, suggestedSlots };
    });
};


// --- MAIN TEAM BUILDER FUNCTION (HEAVILY REFACTORED) ---
export const buildTeamWithRules = (boss, expertGuide, allUserUnits, allUserEquips) => {
    if (!boss || !expertGuide || !allUserUnits) return { team: [], plan: "Not enough data." };
    
    let availableUnits = [...allUserUnits];
    const team = [];
    let usedArtGenGroups = new Set();

    const findAndAddUnit = (roleToFind) => {
        if (team.length >= 4) return;

        let bestUnit = null;
        let highestScore = -Infinity;

        for (const unit of availableUnits) {
            const artGenInfo = getArtGenInfo(unit.Unit_Name);
            if (artGenInfo && usedArtGenGroups.has(artGenInfo.type)) {
                continue;
            }

            const scoredUnit = scoreUnitForFight(unit, boss, expertGuide, roleToFind);
            if (scoredUnit.score > highestScore) {
                highestScore = scoredUnit.score;
                bestUnit = scoredUnit;
            }
        }
        
        if (bestUnit) {
            team.push({ unit: bestUnit });
            availableUnits = availableUnits.filter(u => u.id !== bestUnit.id);
            const artGenInfo = getArtGenInfo(bestUnit.Unit_Name);
            if (artGenInfo) {
                getArtGenConflicts(artGenInfo.type).forEach(group => usedArtGenGroups.add(group));
            }
        }
    };

    // Build the team with a standard 2 Artsgen, 1 DPS, 1 Flex (Tank/Support) structure
    findAndAddUnit('artsgen');
    findAndAddUnit('artsgen');
    findAndAddUnit('dps');
    findAndAddUnit('tank'); 

    if (team.length < 4) {
        findAndAddUnit('support');
    }
    
    while (team.length < 4 && availableUnits.length > 0) {
        findAndAddUnit('any');
    }
  
    if (team.length < 4) {
        return { team: [], plan: "Could not form a full 4-unit team from your collection." };
    }

    const teamWithEquips = getBestEquipmentLoadout(team, allUserEquips, boss);
    const initialPlan = "";

    return { team: teamWithEquips, plan: initialPlan };
};