import { getPersonaResponse } from './luciform-core/personas.js';
async function testSinglePersona() {
    const persona = 'alma';
    const prompt = `How do you perceive the concept of a 'luciform'?`;
    console.log(`Asking ${persona} about Luciforms...`);
    try {
        const response = await getPersonaResponse(persona, prompt, 'test_single_persona_context', undefined);
        console.log(`--- ${persona}'s Insight ---\n${response}\n---------------------------\n`);
    }
    catch (error) {
        console.error(`Error asking ${persona} about Luciforms:`, error.message || error);
    }
}
testSinglePersona();
