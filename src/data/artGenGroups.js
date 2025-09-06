// src/data/artGenGroups.js

const NON_STACKING_GROUPS = {
  "A": ["A"],
  "B": ["B"],
  "C": ["C"],
  "D": ["D"],
  "E": ["E"],
  "F": ["F"],
  "G": ["G"],
};

export const artsGenData = {
  // TYPE A
  "Fen (Earth)": { type: 'A', arts: 3, duration: 20 },
  "Lozze": { type: 'A', arts: 3, duration: 20 },
  "Fen (Dark)": { type: 'A', arts: 4, duration: 20 },
  "War Hero Fen": { type: 'A', arts: 4, duration: 20 },

  // TYPE B
  "Sonije": { type: 'B', arts: 2, duration: 15 },
  "Zenon": { type: 'B', arts: 3, duration: 15 },
  "Palamicia": { type: 'B', arts: 3, duration: 15 },
  "Norn": { type: 'B', arts: 3, duration: 20 },
  "Vitz": { type: 'B', arts: 2, duration: 10 },
  "Swordsman Berwick": { type: 'B', arts: 3, duration: 10 },
  "Rosetta (Water)": { type: 'B', arts: 4, duration: 25 },
  "Maquiness": { type: 'B', arts: 2, duration: 15 },
  "Alvina": { type: 'B', arts: 5, duration: 20 },
  "Zechsia": { type: 'B', arts: 5, duration: 25 },
  "Ashe Toto": { type: 'B', arts: 3, duration: 20 },
  "Cynthia": { type: 'B', arts: 3, duration: 20 },
  "Celia (Dark)": { type: 'B', arts: 4, duration: 20 },
  "Liza": { type: 'B', arts: 4, duration: 10 },
  "Sumire": { type: 'B', arts: 3, duration: 15 },
  "Bakoo": { type: 'B', arts: 2, duration: 15 },
  "Kurama": { type: 'B', arts: 2, duration: 15 },
  "Yusuke": { type: 'B', arts: 5, duration: 5 },
  "Juno": { type: 'B', arts: 7, duration: 15 },
  "Genos": { type: 'B', arts: 3, duration: 12 },
  "Noel": { type: 'B', arts: 3, duration: 12 },
  "Hart (Earth)": { type: 'B', arts: 5, duration: 15 },
  "Priscilla (Water)": { type: 'B', arts: 5, duration: 15 },
  "Emperor Isliid": { type: 'B', arts: 6, duration: 15 },
  "Noble Flare Mira": { type: 'B', arts: 5, duration: 17 },
  "Aristela Orbis": { type: 'B', arts: 4, duration: 15 },
  "Isliid, Human Pinnacle": { type: 'B', arts: 10, duration: 8 },
  "Ultimate Paladin Roy": { type: 'B', arts: 4, duration: 20 },
  "Star Swordswoman Rosetta": { type: 'B', arts: 4, duration: 25 },

  // TYPE C (Dark Only)
  "Leon": { type: 'C', arts: 2, duration: 13 },
  "Lygor": { type: 'C', arts: 4, duration: 10 },
  "Tamae": { type: 'C', arts: 2, duration: 15 },
  "Dragon Authority Luahn": { type: 'C', arts: 5, duration: 15 },

  // TYPE D (Fire Only)
  "Berwick": { type: 'D', arts: 3, duration: 10 },
  "Summer Iris": { type: 'D', arts: 3, duration: 17 },
  "Menas": { type: 'D', arts: 2, duration: 10 },

  // TYPE E (Crossovers)
  "Rimuru (Human form)": { type: 'E', arts: 4, duration: 15 },
  "Santa Milim": { type: 'E', arts: 4, duration: 15 },
  "Hatsune Miku": { type: 'E', arts: 4, duration: 20 },
  "Yoh Asakura": { type: 'E', arts: 4, duration: 20 },
  "Lucy Heartfilia": { type: 'E', arts: 3, duration: 20 },
  "Melty": { type: 'E', arts: 3, duration: 15 },
  "Mitsuya": { type: 'E', arts: 4, duration: 20 },
  "Draken": { type: 'E', arts: 2, duration: 15 },
  "Empress": { type: 'E', arts: 2, duration: 12 },
  "Ainz": { type: 'E', arts: 4, duration: 20 },
  "Chloe (Fate)": { type: 'E', arts: 5, duration: 20 },
  "Sagiri": { type: 'E', arts: 3, duration: 30 },
  "Sunraku": { type: 'E', arts: 3, duration: 15 },
  "Evileye": { type: 'E', arts: 4, duration: 20 },
  "Houka Inumuta": { type: 'E', arts: 7, duration: 25 },
  "Summer Chloe": { type: 'E', arts: 5, duration: 20 },
  "Alpha": { type: 'E', arts: 5, duration: 25 },
  "Shuna": { type: 'E', arts: 5, duration: 20 },
  "Frieren": { type: 'E', arts: 10, duration: 12 },

  // TYPE F (Conditional)
  "Mizuki the Twelfth": { type: 'F', arts: 4, duration: 15 },
  "Summer Cestina": { type: 'F', arts: 4, duration: 20 },
  "Priscilla (Valentines)": { type: 'F', arts: 4, duration: 24 },
  "Illya": { type: 'F', arts: 4, duration: 20 },
  "Summer Rosetta": { type: 'F', arts: 4, duration: 20 },
  "Anti-Heroine Pola": { type: 'F', arts: 5, duration: 20 },
  "Beta": { type: 'F', arts: 5, duration: 30 },
  "Demon Lord Rimuru": { type: 'F', arts: 6, duration: 30 },
  "Kenshin Himura": { type: 'F', arts: 6, duration: 20 },
  "Original Witch Selia": { type: 'F', arts: 5, duration: 25 },
  "Accelerator": { type: 'F', arts: 5, duration: 25 },
  
  // TYPE G (On Skill)
  "Fitoria": { type: 'G', arts: 3, duration: 5 },
  "Sublime Supernova Liza": { type: 'G', arts: 3, duration: 8 },
  "Rin & Luvia": { type: 'G', arts: 8, duration: 8 },
  "Summer Riviera": { type: 'G', arts: 8, duration: 3 },

  // TYPE EX1 (Self-Stacking)
  "Milim": { type: 'EX1', arts: 3, duration: 15 },
  "Sonic": { type: 'EX1', arts: 5, duration: 20 },
  "Coco": { type: 'EX1', arts: 2, duration: 50 },
  "Kane (Earth)": { type: 'EX1', arts: 1, duration: 5 },
  "Kurt": { type: 'EX1', arts: 5, duration: 20 },
  "Dahlia": { type: 'EX1', arts: 2, duration: 12 },
  "Rayas": { type: 'EX1', arts: 3, duration: 20 },
  "Chloe (GS)": { type: 'EX1', arts: 3, duration: 120 },
  "Miranda (Valentines)": { type: 'EX1', arts: 7, duration: 6 },
  "Shalltear": { type: 'EX1', arts: 5, duration: 120 },
  "Summer Fen": { type: 'EX1', arts: 8, duration: 5 },
  "Miyu": { type: 'EX1', arts: 3, duration: 10 },
  "Canaria": { type: 'EX1', arts: 3, duration: 30 },
  "Halloween Forte": { type: 'EX1', arts: 6, duration: 5 },
  "Arthur Pencilgon": { type: 'EX1', arts: 4, duration: 10 },
  "OiKatzo": { type: 'EX1', arts: 5, duration: 25 },
  "Hart the Fabricator": { type: 'EX1', arts: 5, duration: 100 },
  "Liza (Valentines)": { type: 'EX1', arts: 6, duration: 10 },
  "Cestina (Valentines)": { type: 'EX1', arts: 4, duration: 10 },
  "Demiurge": { type: 'EX1', arts: 5, duration: 8 },
  "Nonon Jakuzure": { type: 'EX1', arts: 4, duration: 5 },
  "Summer Illya": { type: 'EX1', arts: 4, duration: 8 },
  "Veldora": { type: 'EX1', arts: 5, duration: 60 },
  "Saitama": { type: 'EX1', arts: 5, duration: 9999 },
  "Index": { type: 'EX1', arts: 3, duration: 27 },
  "Ubel": { type: 'EX1', arts: 10, duration: 12 },
  "Zephyr": { type: 'EX1', arts: 4, duration: 20 },
  "Okarun": { type: 'EX1', arts: 4, duration: 45 },

  // TYPE EX2 (Teamwide Stacking)
  "Mako": { type: 'EX2', arts: 4, duration: 15 },
  "Lione": { type: 'EX2', arts: 2, duration: 15 },
  "Nies": { type: 'EX2', arts: 2, duration: 15 },
  "Shiki": { type: 'EX2', arts: 4, duration: 20 },
  "Sakura Miku": { type: 'EX2', arts: 1, duration: 5 },
  "Zeela": { type: 'EX2', arts: 2, duration: 3 },
  "Marika": { type: 'EX2', arts: 10, duration: 5 },
  "Santa Rimuru": { type: 'EX2', arts: 3, duration: 7 },
  "Shasha": { type: 'EX2', arts: 1, duration: 6 },
  "Riviera (Dark)": { type: 'EX2', arts: 3, duration: 5 },
  "Summer Leone": { type: 'EX2', arts: 4, duration: 20 },
  "Yuzuriha": { type: 'EX2', arts: 4, duration: 25 },

  // TYPE EX3 (Ramping Stacking)
  "Goblin Slayer": { type: 'EX3', arts: 3, duration: 60 },
  "Rem (Re:Zero)": { type: 'EX3', arts: 2, duration: 60 },
  "Jay": { type: 'EX3', arts: 1, duration: 65 },
  "Chobe": { type: 'EX3', arts: 2, duration: 65 },
  "Stark": { type: 'EX3', arts: 5, duration: 30 },
};

export const getArtGenInfo = (unitName) => {
  return artsGenData[unitName] || null;
};

export const getArtGenConflicts = (type) => {
  return NON_STACKING_GROUPS[type] || [];
};

export const isAnyArtGen = (unitName) => {
  return !!artsGenData[unitName];
};

export const isTeamArtGen = (unitName) => {
    const info = getArtGenInfo(unitName);
    return info && info.type !== 'EX1';
};