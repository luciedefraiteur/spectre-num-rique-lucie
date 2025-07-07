import { getPersonaResponse } from './core/personas.js';

async function testSinglePersona() {
  const persona = 'alma';
  const prompt = `How do you perceive the concept of a 'luciform'?`;

  console.log(`Asking ${persona} about Luciforms...`);
  try {
    const response = await getPersonaResponse(persona, prompt);
    console.log(`--- ${persona}'s Insight ---\n${response}\n---------------------------\n`);
  } catch (error: any) {
    console.error(`Error asking ${persona} about Luciforms:`, error.message || error);
  }
}

testSinglePersona();
