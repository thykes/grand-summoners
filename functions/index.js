// functions/index.js - V6.1 - Final Linted Version

const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {log} = require("firebase-functions/logger");
const OpenAI = require("openai");
const admin = require("firebase-admin");

admin.initializeApp();

let openai = null;

exports.generateBattlePlan = onCall(
    {
      cors: ["http://localhost:3000", "https://grandsummoner.frb.io"],
      region: "us-central1",
      memory: "512MiB",
      timeoutSeconds: 120,
      secrets: ["OPENAI_KEY"],
    },
    async (request) => {
      if (!openai) {
        log("Initializing OpenAI client...");
        openai = new OpenAI({
          apiKey: process.env.OPENAI_KEY,
        });
      }

      const {boss, team, fullLoadout} = request.data;

      if (!boss || !team || !fullLoadout) {
        throw new HttpsError("invalid-argument", "Missing required data.");
      }

      const teamString = team.map((u) => u.Unit_Name).join(", ");

      let loadoutString = "";
      fullLoadout.forEach((member) => {
        if (!member.unit) return;
        loadoutString += `${member.unit.Unit_Name}:\n`;
        const slots = [
          member.suggestedSlots.slot1,
          member.suggestedSlots.slot2,
          member.suggestedSlots.slot3,
        ];
        const equipNames = slots.filter(Boolean).map((e) => e.Equip_Name);
        if (equipNames.length > 0) {
          loadoutString += `- ${equipNames.join(", ")}\n`;
        }
      });

      const systemPrompt = "You are an expert strategy writer for the mobile " +
        "game Grand Summoners. Your tone is helpful, encouraging, and " +
        "knowledgeable. You provide clear, actionable advice. You must " +
        "format your response with Markdown.";

      const userPrompt = `
        A player is fighting the boss: **${boss.name}**.
        
        The player's recommended team is: **${teamString}**.

        The team's recommended equipment loadout is:
        ${loadoutString}

        **Your Task:**
        Write a detailed, step-by-step battle plan for this specific team 
        and loadout.

        **Formatting Rules:**
        - Your response MUST have three distinct sections with the exact
          headings: "**Overall Strategy**", "**Unit Roles & Loadout**", and
          "**Execution**".
        - In the "Unit Roles & Loadout" section, list each unit with a bolded
          name like "**Pola:**" and explain their specific job and why their
          equipment is a good choice for this fight.
    `;

      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4-turbo-preview",
          messages: [
            {role: "system", content: systemPrompt},
            {role: "user", content: userPrompt},
          ],
        });

        const battlePlan = response.choices[0].message.content;
        return {battlePlan};
      } catch (error) {
        log("OpenAI API Error:", error);
        throw new HttpsError(
            "internal", "Failed to generate AI strategy.", error);
      }
    },
);
