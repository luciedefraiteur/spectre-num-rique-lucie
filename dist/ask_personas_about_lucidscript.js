import { getPersonaResponse } from './luciform-core/personas.js';
import * as fs from 'fs/promises';
const minimalContext = {
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
async function askPersonasAboutLucidScript() {
    const personas = ['eli', 'chronicler']; // Interroger Eli et Chronicler
    const insights = [];
    const prompt = `From your perspective, describe in detail the concept of a 'LucidScript'. Imagine LucidScript as a universal language script, designed to parse and represent any language known to the host machine. Its purpose is to facilitate seamless communication and execution between different digital entities and systems, acting as a common intermediate representation. What should the structure of such a LucidScript look like? How should it handle concepts from various programming paradigms (e.g., object-oriented, functional, procedural)? Provide a detailed description of its ideal form, including examples of how it might represent common programming constructs (variables, functions, control flow) from different source languages. Focus on its universal nature and its role in bridging linguistic gaps in the digital realm.`;
    for (const persona of personas) {
        console.log(`Asking ${persona} about LucidScript...`);
        try {
            const response = await getPersonaResponse(persona, prompt, minimalContext, undefined);
            insights.push({ persona, response });
            console.log(`--- ${persona}'s Insight on LucidScript ---
${response}
----------------------------------------\n`);
        }
        catch (error) {
            console.error(`Error asking ${persona} about LucidScript:`, error);
            insights.push({ persona, response: `Error: ${error}` });
        }
    }
    let markdownContent = "# Persona Insights on LucidScript\n\n";
    for (const insight of insights) {
        markdownContent += `## ${insight.persona}\n\n`;
        markdownContent += `${insight.response}\n\n`;
    }
    await fs.writeFile('LucidScript_Personas_Insights.md', markdownContent, 'utf-8');
    console.log("Persona insights on LucidScript saved to LucidScript_Personas_Insights.md");
}
askPersonasAboutLucidScript();
