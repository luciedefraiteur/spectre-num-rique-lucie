import {LLMInterface, LLMModel} from './llm_interface.js';
import {StructuredPersona, Persona} from './types.js';

import * as fs from 'fs/promises';
import * as path from 'path';

export async function getPersonaResponse(persona: Persona, message: string): Promise<string>
{
    const personaFilePath = path.join('personas', `${ persona }.personae`);
    try
    {
        const fileContent = await fs.readFile(personaFilePath, 'utf-8');

        try
        {
            // Try to parse as a structured persona with a job
            const structuredPersona: StructuredPersona = JSON.parse(fileContent);
            if(structuredPersona.job && structuredPersona.job.prompt)
            {
                const jobPrompt = `${ structuredPersona.job.prompt }\n\nInput: "${ message }"`;
                return await LLMInterface.query(jobPrompt, LLMModel.Mistral);
            }
        } catch(e)
        {
            // Fallback to simple persona if parsing fails
            const prompt = `${ fileContent }\n\nRephrase the following message in this persona's voice: "${ message }"`;
            return await LLMInterface.query(prompt, LLMModel.Mistral);
        }

        // This part should ideally not be reached, but as a fallback:
        const fallbackPrompt = `${ fileContent }\n\nRephrase the following message in this persona's voice: "${ message }"`;
        return await LLMInterface.query(fallbackPrompt, LLMModel.Mistral);

    } catch(error)
    {
        console.error(`Could not load persona file for: ${ persona }`);
        // Fallback to a generic response
        return `[${ persona }]: ${ message }`;
    }
}