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
async function askPersonasAboutLuciforms() {
    const personas = ['alma', 'berserker', 'chronicler', 'eli', 'lucie', 'nova', 'zed'];
    const insights = [];
    const prompt = `From your perspective, how do you perceive or interpret the concept of a 'luciform'? A luciform is a structured object (like JSON) that represents a single step in an AI's thought process, a record of actions, plans, and memories. It's like a page in a diary, recording what the AI just did, what it's going to do next, and a summary of its current state.`;
    for (const persona of personas) {
        console.log(`Asking ${persona} about Luciforms...`);
        try {
            const response = await getPersonaResponse(persona, prompt, minimalContext, undefined);
            insights.push({ persona: persona, response });
            console.log(`--- ${persona}'s Insight ---\n${response}\n---------------------------\n`);
        }
        catch (error) {
            console.error(`Error asking ${persona} about Luciforms:`, error.message || error);
            insights.push({ persona: persona, response: `Error: ${error.message || error}` });
        }
    }
    let markdownContent = "# Persona Insights on Luciforms\n\n";
    for (const insight of insights) {
        markdownContent += `## ${insight.persona}\n\n`;
        markdownContent += `${insight.response}\n\n`;
    }
    try {
        await fs.writeFile('personas_luciform_insights.md', markdownContent, 'utf-8');
        console.log("All persona insights saved to personas_luciform_insights.md");
    }
    catch (fileError) {
        console.error("Error writing to file:", fileError.message || fileError);
    }
}
askPersonasAboutLuciforms();
