// src/data/teamTuning.js

export const roleWeights = {
  dps: 200,
  artsgen: 200,
  tank: 200,
  healer: 200,
  support: 200,
  breaker: 200,
  any: 150,
};

export const tierScores = { SS: 500, "S+": 400, S: 300, A: 200, B: 100 };

export const eventBonuses = {
  Okarun_Turbo_Granny: { tagIncludes: "dan da dan", bonus: 300 },
};

export const equipBonuses = {
  baseRarity: 5,
  dmgUp: 15,
  critForDps: 10,
};

// Future tuning knobs can be added here without touching logic code.

