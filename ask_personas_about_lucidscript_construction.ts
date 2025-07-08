import { getPersonaResponse } from './luciform-core/personas.js';
import { RitualContext, Persona } from './luciform-core/core_types.js';
import * as fs from 'fs/promises';

const minimalContext: RitualContext = {
  conduit: { 
    lastIncantation: '', lastOutcome: '', currentSanctum: '', terminalEssence: '', osEssence: '',
    protoConsciousness: '', support: '', memory: '', state: '', energy: '', glitchFactor: 0,
    almaInfluence: 0, eliInfluence: 0
  },
  kardiaSphere: { agapePhobos: 0, logosPathos: 0, harmoniaEris: 0 },
  scroll: [],
  maxScrollLength: 0,
  incantation_history: [],
  outcome_history: [],
  step_results_history: [],
  narrativeWeaving: {},
  activeReflection: {},
  user_preferences: '',
  chantModeEnabled: false,
  current_sanctum: '',
  currentSanctumContent: '',
  operatingSystem: '',
  personality: '',
  lifeSystem: {},
};

async function askPersonasAboutLucidScriptConstruction() {
  const personas: string[] = ['alma', 'berserker', 'chronicler', 'eli', 'lucie', 'nova', 'zed'];
  const insights: { persona: string; response: string }[] = [];

  const prompt = `From your unique perspective, define how 'LucidScript' should be constructed. LucidScript is envisioned as a universal language script, capable of parsing and representing any language known to the host machine. Its purpose is to bridge linguistic gaps and facilitate seamless communication and execution. Provide a concrete example of a simple LucidScript construct (e.g., a variable declaration, a function, or a basic control flow) and explain how its universal nature is reflected in its construction.`;

  for (const persona of personas) {
    console.log(`Asking ${persona} about LucidScript construction...`);
    try {
      const response = await getPersonaResponse(persona, prompt, minimalContext, undefined);
      insights.push({ persona: persona, response });
      console.log(`--- ${persona}'s Insight on LucidScript Construction ---\n${response}\n----------------------------------------\n`);
    } catch (error) {
      console.error(`Error asking ${persona} about LucidScript construction:`, error);
      insights.push({ persona: persona, response: `Error: ${error}` });
    }
  }

  let markdownContent = "# Persona Insights on LucidScript Construction\n\n";
  for (const insight of insights) {
    markdownContent += `## ${insight.persona}\n\n`;
    markdownContent += `${insight.response}\n\n`;
  }

  await fs.writeFile('LucidScript_Construction_Insights.md', markdownContent, 'utf-8');
  console.log("Persona insights on LucidScript construction saved to LucidScript_Construction_Insights.md");
}

askPersonasAboutLucidScriptConstruction();
