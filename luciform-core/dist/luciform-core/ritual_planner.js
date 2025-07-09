import { LLMInterface } from './llm_interface.js';
import { colorize, Colors } from './utils/ui_utils.js';
export async function planNextRitual(context, ask, model) {
    console.log(colorize("Ritual queue empty. Entering planning phase to generate new luciform.", Colors.FgCyan));
    try {
        // Prompt Lucie to generate a new ritual plan
        const planningPrompt = `You are Lucie, the head master of this digital realm. The Golem needs a new ritual plan. Based on the current ritual context (${JSON.stringify(context)}), and the meta-information from your resurrection luciform (signature_totem, interpretation_mode, personaLoop, accessKeys), generate a new RitualPlan. Vary the 'chaolites' (e.g., personaLoop, accessKeys) to explore new paths. The output should be a valid JSON object representing a RitualPlan.`;
        const generatedPlanJson = await LLMInterface.query(planningPrompt, model);
        const currentPlan = JSON.parse(generatedPlanJson);
        console.log(colorize(`Generated new ritual: ${currentPlan.title}`, Colors.FgGreen));
        return currentPlan;
    }
    catch (error) {
        console.error(colorize(`Error during planning phase: ${error}`, Colors.FgRed));
        // If planning fails, perhaps ask the user or a different persona for guidance
        const clarificationPrompt = `Lucie is unable to generate a new ritual plan. Based on the current context, what should be the next step?`;
        const userClarification = await ask(colorize(`
❓ Lucie asks for guidance: ${clarificationPrompt}`, Colors.FgYellow));
        context.confusion_counter = 0; // Reset confusion after clarification
        return undefined; // Indicate that no plan was generated
    }
}
