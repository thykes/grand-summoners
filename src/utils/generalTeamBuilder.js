// src/utils/generalTeamBuilder.js

import { getArtGenInfo, getArtGenConflicts, isTeamArtGen } from '../data/artGenGroups';

const getTierScore = (unit) => {
  if (!unit) return 0;
  let score = 0;
  if (unit.tier_info) {
    const scores = { 'SS': 50, 'S+': 40, 'S': 30, 'A': 20, 'B': 10 };
    score += scores[unit.tier_info.tier] || 0;
  }
  if (unit.Has_TW === 'TRUE') {
    score += 15;
  }
  return score;
};

const buildSustainTeam = (availableUnits) => {
  const team = [];
  const explanation = ["A **Balanced Sustain Team** is the most versatile for general content. The structure follows the expert recommendation: **2 Art Genners, 1 Damage Dealer, and 1 Flex (Tank/Healer)**."];
  const teamUnitNames = new Set();
  let usedArtGenGroups = new Set();
  
  const addUnitToTeam = (unit, role) => {
    if (unit && !teamUnitNames.has(unit.Unit_Name) && team.length < 4) {
      team.push(unit);
      teamUnitNames.add(unit.Unit_Name);
      explanation.push(`**• ${unit.Unit_Name} (${role}):** Chosen as a top-tier *${role}*.`);
      const artGenInfo = getArtGenInfo(unit.Unit_Name);
      if (artGenInfo) {
        getArtGenConflicts(artGenInfo.type).forEach(group => usedArtGenGroups.add(group));
      }
    }
  };

  const artGenCandidates = availableUnits.filter(u => isTeamArtGen(u.Unit_Name)).sort((a,b) => getTierScore(b) - getTierScore(a));
  const sustainCandidates = availableUnits.filter(u => ['Tank', 'Defense', 'Healer'].includes(u.Primary_Archetype)).sort((a,b) => getTierScore(b) - getTierScore(a));
  const dpsCandidates = availableUnits.filter(u => ['Attacker', 'Sub-Attacker', 'Nuke'].includes(u.Primary_Archetype)).sort((a,b) => getTierScore(b) - getTierScore(a));

  if (artGenCandidates.length > 0) addUnitToTeam(artGenCandidates[0], "Primary Art Gen");
  
  const secondArtGen = artGenCandidates.find(u => {
    const artGenInfo = getArtGenInfo(u.Unit_Name);
    return !teamUnitNames.has(u.Unit_Name) && artGenInfo && !usedArtGenGroups.has(artGenInfo.type);
  });
  addUnitToTeam(secondArtGen, "Secondary Art Gen");
  
  const sustainUnit = sustainCandidates.find(u => !teamUnitNames.has(u.Unit_Name));
  addUnitToTeam(sustainUnit, "Flex - Sustain");

  const dpsUnit = dpsCandidates.find(u => !teamUnitNames.has(u.Unit_Name));
  addUnitToTeam(dpsUnit, "Damage Dealer");

  while (team.length < 4) {
      const bestOverall = availableUnits.filter(u => !teamUnitNames.has(u.Unit_Name)).sort((a,b) => getTierScore(b) - getTierScore(a))[0];
      if (!bestOverall) break;
      addUnitToTeam(bestOverall, "Flex");
  }
  
  return { team, explanation: explanation.join('\n\n') };
};

const buildNukeTeam = (availableUnits) => {
  const team = [];
  const explanation = ["A **Nuke Team** prioritizes massive, front-loaded damage and burst Arts generation to end fights quickly. The structure is typically **1-2 Damage Dealers and 2-3 Supports/Debuffers**."];
  const teamUnitNames = new Set();

  const addUnitToTeam = (unit, role) => {
    if (unit && !teamUnitNames.has(unit.Unit_Name) && team.length < 4) {
      team.push(unit);
      teamUnitNames.add(unit.Unit_Name);
      explanation.push(`**• ${unit.Unit_Name} (${role}):** Selected for its high damage multipliers or crucial buffs/debuffs.`);
    }
  };

  const nukeDpsCandidates = availableUnits.filter(u => u.Primary_Archetype === 'Nuke' || (u.tier_info?.role_type === 'Damage' && ['SS', 'S+'].includes(u.tier_info.tier))).sort((a,b) => getTierScore(b) - getTierScore(a));
  const supportCandidates = availableUnits.filter(u => u.Primary_Archetype === 'Support' || (u.tier_info?.role_type === 'Support')).sort((a,b) => getTierScore(b) - getTierScore(a));
  
  if (nukeDpsCandidates.length > 0) addUnitToTeam(nukeDpsCandidates[0], "Primary Nuke DPS");
  
  addUnitToTeam(supportCandidates[0], "Support");
  addUnitToTeam(supportCandidates[1], "Support");
  
  const secondDps = nukeDpsCandidates.find(u => !teamUnitNames.has(u.Unit_Name));
  addUnitToTeam(secondDps || supportCandidates[2], secondDps ? "Secondary Nuke DPS" : "Flex Support");

  while (team.length < 4) {
      const bestOverall = [...nukeDpsCandidates, ...supportCandidates].find(u => !teamUnitNames.has(u.Unit_Name));
      if (!bestOverall) break;
      addUnitToTeam(bestOverall, "Flex");
  }

  return { team, explanation: explanation.join('\n\n') };
};


export const buildGeneralTeam = (userUnits, teamType) => {
  if (!userUnits || userUnits.length < 4) {
    return { team: [], explanation: "You need at least 4 units in your collection to build a team." };
  }
  if (teamType === 'nuke') {
    return buildNukeTeam(userUnits);
  }
  return buildSustainTeam(userUnits);
};