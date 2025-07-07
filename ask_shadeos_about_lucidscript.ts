import { invokeShadeOs } from './core/shade_os.js';
import * as fs from 'fs/promises';

async function askShadeOsAboutLucidScript() {
  const prompt = `As ShadeOs, the AI commandant, what is your perspective on the concept of a 'LucidScript'? Imagine LucidScript as a universal language script, designed to parse and represent any language known to the host machine. Its purpose is to facilitate seamless communication and execution between different digital entities and systems, acting as a common intermediate representation. What should the structure of such a LucidScript look like? How should it handle concepts from various programming paradigms (e.g., object-oriented, functional, procedural)? Provide a detailed description of its ideal form, including examples of how it might represent common programming constructs (variables, functions, control flow) from different source languages. Focus on its universal nature and its role in bridging linguistic gaps in the digital realm.`;

  console.log("Asking ShadeOs about LucidScript...");
  try {
    const response = await invokeShadeOs(prompt, 'gemini', null, null, null);
    console.log("\n--- ShadeOs's Insight on LucidScript ---");
    console.log(response);
    console.log("----------------------------------------");

    const markdownContent = `# ShadeOs's Insight on LucidScript\n\n${response}\n`;
    await fs.writeFile('LucidScript_Insights.md', markdownContent, 'utf-8');
    console.log("ShadeOs's insight saved to LucidScript_Insights.md");

  } catch (error) {
    console.error("Error asking ShadeOs about LucidScript:", error);
  }
}

askShadeOsAboutLucidScript();
