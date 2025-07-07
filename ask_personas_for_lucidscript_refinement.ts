import { getPersonaResponse } from './core/personas.js';
import * as fs from 'fs/promises';
import { Persona } from './core/types.js';

async function askPersonasForLucidScriptRefinement() {
  const personas: Persona[] = ['alma', 'berserker', 'chronicler', 'eli', 'lucie', 'nova', 'zed'];
  const insights: { persona: string; response: string }[] = [];

  const preEstablishedRules = await fs.readFile('lucidscript_rules.txt', 'utf-8');

  const prompt = `Given these pre-established rules for LucidScript, how would you, from your unique perspective, improve or refine them? Provide concrete suggestions and, if possible, a small, refined example of a LucidScript construct that embodies your improvements. Focus on making LucidScript even more universal, clear, and powerful.`;

  for (const persona of personas) {
    console.log(`Asking ${persona} for LucidScript refinement...`);
    try {
      const fullPrompt = `${preEstablishedRules}

${prompt}`;
      const response = await getPersonaResponse(persona, fullPrompt);
      insights.push({ persona, response });
      console.log(`--- ${persona}'s Refinement Insight ---\n${response}\n----------------------------------------\n`);
    } catch (error) {
      console.error(`Error asking ${persona} for LucidScript refinement:`, error);
      insights.push({ persona, response: `Error: ${error}` });
    }
  }

  let markdownContent = "# Persona Insights on LucidScript Refinement\n\n";
  for (const insight of insights) {
    markdownContent += `## ${insight.persona}\n\n`;
    markdownContent += `${insight.response}\n\n`;
  }

  await fs.writeFile('LucidScript_Refinement_Insights.md', markdownContent, 'utf-8');
  console.log("Persona insights on LucidScript refinement saved to LucidScript_Refinement_Insights.md");
}

askPersonasForLucidScriptRefinement();