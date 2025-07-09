import { getPersonaResponse } from './luciform-core/personas.js';
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
async function askLlmAboutLuciform() {
    const prompt = `Provide a detailed specification for the .luciform file format. Include its overall structure, the purpose of each section (like ---PAS---, [Contexte], [Action]), and examples of valid JSON operations within the [Action] block, such as 'create_file', 'shell_command', 'ask_question', and 'promenade'. Explain how these components work together to define a ritual or a sequence of AI actions.`;
    console.log("Asking Mog for a detailed Luciform specification...");
    try {
        const response = await getPersonaResponse('mog', prompt, minimalContext, undefined);
        console.log("\n--- Mog's Detailed Luciform Specification ---");
        console.log(response);
        console.log("---------------------------------------------");
    }
    catch (error) {
        console.error("Error asking LLM about Luciforms:", error);
    }
}
askLlmAboutLuciform();
