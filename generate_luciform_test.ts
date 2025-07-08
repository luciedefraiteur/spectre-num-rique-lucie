import { getPersonaResponse } from './luciform-core/personas.js';
import { RitualContext } from './luciform-core/core_types.js';

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
import * as fs from 'fs/promises';

async function generateLuciformTest() {
  const prompt = `Generate a simple .luciform file that creates a file named 'hello.txt' with the content 'Hello, World!'. Your output MUST ONLY contain the .luciform content, and absolutely nothing else. Do NOT include any conversational text, explanations, or markdown formatting outside of the .luciform structure itself. Begin your output with '---START_LUCIFORM---' and end with '---END_LUCIFORM---'.

---START_LUCIFORM---
---PAS---
[Contexte]
<Your context here>
[Action]
{
  "type": "create_file",
  "filePath": "<file_path>",
  "content": "<file_content>"
}
---END_LUCIFORM---

Replace <Your context here>, <file_path>, and <file_content> with appropriate values.`;

  console.log("Asking Lucie to generate a luciform...");
  try {
    const luciformContent = await getPersonaResponse('lucie', prompt, minimalContext, undefined);
    console.log("\n--- Generated Luciform (Raw) ---");
    console.log(luciformContent);
    console.log("----------------------------------");

    // Extract content between markers
    const startMarker = '---START_LUCIFORM---\n';
    const endMarker = '---END_LUCIFORM---';
    const startIndex = luciformContent.indexOf(startMarker);
    const endIndex = luciformContent.indexOf(endMarker, startIndex + startMarker.length);

    let extractedLuciform = luciformContent;
    if (startIndex !== -1 && endIndex !== -1) {
      extractedLuciform = luciformContent.substring(startIndex + startMarker.length, endIndex).trim();
      console.log("\n--- Generated Luciform (Extracted) ---");
      console.log(extractedLuciform);
      console.log("--------------------------------------");
    } else {
      console.warn("Could not find START_LUCIFORM or END_LUCIFORM markers. Using raw content.");
    }

    // Save the extracted luciform to a file for inspection
    await fs.writeFile('generated_hello.luciform', extractedLuciform, 'utf-8');
    console.log("Generated luciform saved to generated_hello.luciform");

  } catch (error) {
    console.error("Error generating luciform:", error);
  }
}

generateLuciformTest();
