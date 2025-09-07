// functions/index.js

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { log } = require("firebase-functions/logger");
const OpenAI = require("openai");
const admin = require("firebase-admin");

admin.initializeApp();

// Reuse OpenAI client across function invocations
let openai = null;

// Small helper: retry wrapper with backoff
async function safeCompletion(client, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await client.chat.completions.create(options);
    } catch (err) {
      log(`OpenAI attempt ${i + 1} failed:`, err.message || err);
      if (i === retries - 1) throw err;
      await new Promise((res) => setTimeout(res, 1000 * (i + 1))); // 1s, 2s backoff
    }
  }
}

exports.generateBattlePlan = onCall(
  {
    cors: ["http://localhost:3000", "https://grandsummoner.frb.io"], // Allowed domains
    region: "us-central1",
    memory: "1GiB",
    timeoutSeconds: 300, // Up to 5 minutes
    secrets: ["OPENAI_KEY"],
  },
  async (request) => {
    if (!openai) {
      log("Initializing OpenAI client...");
      openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });
    }

    const { boss, team, fullLoadout } = request.data;

    if (!boss || !team || !fullLoadout) {
      throw new HttpsError(
        "invalid-argument",
        "Missing required data from the frontend."
      );
    }

    // Build team string
    const teamString = team.map((u) => u.Unit_Name).join(", ");

    // Build loadout string
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

    // ===== PROMPT SETUP =====
    const systemPrompt =
      "You are an expert strategy writer for the mobile game Grand Summoners. " +
      "Your tone is helpful, encouraging, and knowledgeable. You provide clear, actionable advice. " +
      "You must format your response with Markdown.";

    const userPrompt = `
A player is fighting the boss: **${boss.name}**.

The player's recommended team is: **${teamString}**.

The team's recommended equipment loadout is:
${loadoutString}

**Your Task:**
Write a detailed, step-by-step battle plan for this specific team and loadout against this specific boss.

**Formatting Rules:**
- Your response MUST have three distinct sections with these exact Markdown headings:
  "### Overall Strategy", "### Unit Roles & Loadout", and "### Execution".
- In "Unit Roles & Loadout", list each unit with their name bolded like "**Unit Name:**"
  and explain their specific job and why their assigned equipment is a good choice for this fight.
    `;

    try {
      const response = await safeCompletion(openai, {
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      });

      const battlePlan = response.choices[0].message.content;
      return { battlePlan };
    } catch (error) {
      log("Final OpenAI API Error:", error);
      throw new HttpsError(
        "internal",
        "The AI took too long or failed to generate a strategy. Please try again."
      );
    }
  }
);
