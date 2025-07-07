import {LLMInterface, LLMModel} from './llm_interface.js';
import {StructuredPersona, Persona} from './types.js';

import * as fs from 'fs/promises';
import * as path from 'path';

async function listPersonas(): Promise<string[]> {
  const personasDir = 'personas';
  try {
    const files = await fs.readdir(personasDir);
    return files
      .filter(file => file.endsWith('.personae') && file !== 'chaotic.personae' && file !== 'mog.personae')
      .map(file => file.replace('.personae', ''));
  } catch (error) {
    console.error("Error listing personas:", error);
    return [];
  }
}

export async function getPersonaResponse(persona: Persona, message: string): Promise<string>
{
    const personaFilePath = path.join('personas', `${ persona }.personae`);
    try
    {
        const fileContent = await fs.readFile(personaFilePath, 'utf-8');

        if (persona === 'chaotic') {
            const availablePersonas = await listPersonas();
            const personaList = availablePersonas.join(', ');
            const chaoticPrompt = fileContent.replace('[PERSONA_LIST_PLACEHOLDER]', personaList);
            const chosenPersonaRaw = await LLMInterface.query(chaoticPrompt, LLMModel.Mistral);
            const chosenPersona = chosenPersonaRaw.trim().toLowerCase();

            if (availablePersonas.includes(chosenPersona)) {
                console.log(`Chaotic persona chose to embody: ${chosenPersona}`);
                return await getPersonaResponse(chosenPersona as Persona, message);
            } else {
                console.warn(`Chaotic persona chose an invalid persona: ${chosenPersona}. Falling back to default chaotic response.`);
                return `[Chaotic]: I chose a path less traveled, but it led nowhere. My response is: ${message}`; // Fallback
            }
        }

        if (fileContent.trim().startsWith('{')) {
            try
            {
                // Try to parse as a structured persona with a job
                const structuredPersona: StructuredPersona = JSON.parse(fileContent);
                if(structuredPersona.job && structuredPersona.job.prompt)
                {
                    const jobPrompt = `${ structuredPersona.job.prompt }\n\nInput: "${ message }"`;
                    return await LLMInterface.query(jobPrompt, LLMModel.Mistral);
                }
            } catch(e: any)
            {
                console.error(`[ERROR] JSON parsing failed for persona ${persona}: ${e.message}`);
                // Fallback to simple persona if parsing fails
                const prompt = `${ fileContent }\n\nRephrase the following message in this persona's voice: "${ message }"`;
                return await LLMInterface.query(prompt, LLMModel.Mistral);
            }
        }

        // Fallback to simple persona if not a JSON or JSON parsing failed
        const prompt = `${ fileContent }\n\nRephrase the following message in this persona's voice: "${ message }"`;
        return await LLMInterface.query(prompt, LLMModel.Mistral);

    } catch(error)
    {
        console.error(`Could not load persona file for: ${ persona }`);
        // Fallback to a generic response
        return `[${ persona }]: ${ message }`;
    }
}