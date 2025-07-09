import { LLMInterface } from './llm_interface.js';
import { LLMModel } from './types/base.js';
import { personaLoader } from './persona_loader.js';
import { createPersona } from './persona_creator.js';
// Load personas once when the module is imported
personaLoader.loadPersonas();
export async function getPersonaResponse(personaName, message, context, llmModel = LLMModel.Mistral) {
    console.log(`[DEBUG] Attempting to get persona response for: ${personaName}`);
    let persona = personaLoader.getPersona(personaName);
    if (!persona) {
        console.log(`Persona ${personaName} not found. Invoking Lurkuitae to create it.`);
        try {
            persona = await createPersona(personaName, context); // Pass context to createPersona
            // After creation, the persona is automatically added to the loader's cache
        }
        catch (error) {
            console.error(`Failed to create persona ${personaName}:`, error);
            return `[System]: Failed to create persona ${personaName}.`;
        }
    }
    // The rest of the logic from the original getPersonaResponse will go here,
    // using the 'persona' object instead of reading from file.
    if (!persona) {
        console.error(`Persona ${personaName} not found and could not be created.`);
        return `[System]: Failed to create persona ${personaName}.`;
    }
    if (persona.name.toLowerCase() === 'chaotic') {
        const availablePersonas = personaLoader.getAllPersonas().map(p => p.name);
        const personaList = availablePersonas.join(', ');
        const chaoticPrompt = persona.description.replace('[PERSONA_LIST_PLACEHOLDER]', personaList);
        const chosenPersonaRaw = await LLMInterface.query(chaoticPrompt, llmModel);
        const chosenPersona = chosenPersonaRaw.trim().toLowerCase();
        if (availablePersonas.includes(chosenPersona)) {
            console.log(`Chaotic persona chose to embody: ${chosenPersona}`);
            return await getPersonaResponse(chosenPersona, message, context); // Pass context recursively
        }
        else {
            console.warn(`Chaotic persona chose an invalid persona: ${chosenPersona}. Falling back to default chaotic response.`);
            return `[Chaotic]: I chose a path less traveled, but it led nowhere. My response is: ${message}`; // Fallback
        }
    }
    if (persona && persona.job && persona.job.prompt) {
        console.log(`[DEBUG] Persona ${persona.name} is structured with a job.`);
        const jobPrompt = `${persona.job.prompt}

Input: "${message}"`;
        return await LLMInterface.query(jobPrompt, persona.llm_model || llmModel);
    }
    else if (persona) {
        console.log(`[DEBUG] Persona ${persona.name} is a simple persona.`);
        const prompt = `${persona.description}

Rephrase the following message in this persona's voice: "${message}"`;
        return await LLMInterface.query(prompt, persona.llm_model || llmModel);
    }
    // Add a final return statement to ensure all code paths return a value
    return `[System]: An unexpected error occurred in persona response generation.`;
}
