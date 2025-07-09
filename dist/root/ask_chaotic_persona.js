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
async function askChaoticPersona() {
    const prompt = `What is your opinion on the meaning of life?`;
    console.log("Asking Chaotic persona...");
    try {
        const response = await getPersonaResponse('chaotic', prompt, minimalContext, undefined);
        console.log("\n--- Chaotic Persona's Response ---");
        console.log(response);
        console.log("----------------------------------");
    }
    catch (error) {
        console.error("Error asking Chaotic persona:", error);
    }
}
askChaoticPersona();
