import { getPersonaResponse } from './core/personas.js';

async function askLlmAboutLuciform() {
  const prompt = `Provide a detailed specification for the .luciform file format. Include its overall structure, the purpose of each section (like ---PAS---, [Contexte], [Action]), and examples of valid JSON operations within the [Action] block, such as 'create_file', 'shell_command', 'ask_question', and 'promenade'. Explain how these components work together to define a ritual or a sequence of AI actions.`;

  console.log("Asking Mog for a detailed Luciform specification...");
  try {
    const response = await getPersonaResponse('mog', prompt);
    console.log("\n--- Mog's Detailed Luciform Specification ---");
    console.log(response);
    console.log("---------------------------------------------");
  } catch (error) {
    console.error("Error asking LLM about Luciforms:", error);
  }
}

askLlmAboutLuciform();