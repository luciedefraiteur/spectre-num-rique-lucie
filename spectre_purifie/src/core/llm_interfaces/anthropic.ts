// src/core/llm_interfaces/anthropic.ts

import {logToFile} from '../log_writers';
import Anthropic from '@anthropic-ai/sdk';

export async function queryAnthropic(prompt: string, model: string): Promise<string>
{
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if(!apiKey || apiKey === 'YOUR_ANTHROPIC_API_KEY_HERE')
    {
        logToFile('llm_errors.log', 'Anthropic API Key not set or is a placeholder. Cannot query Anthropic.');
        return Promise.resolve(`{
            "goal": "Simulated Anthropic plan (API Key missing)",
            "incantations": [
                {"type": "ANALYSE", "description": "Anthropic API Key is missing or invalid. Please set ANTHROPIC_API_KEY in your .env file.", "parameters": {"context": "API Key Missing"}}
            ]
        }`);
    }

    logToFile('llm_calls.log', `Querying Anthropic model '${ model }' with prompt (first 100 chars):\n${ prompt.substring(0, 100) }...`);

    try
    {
        const anthropic = new Anthropic({apiKey});
        const msg = await anthropic.messages.create({
            model: model,
            max_tokens: 1024,
            messages: [{role: 'user', content: prompt}],
        });
        if(msg.content[0].type === 'text')
        {
            return msg.content[0].text;
        }
        return "";
    } catch(error: any)
    {
        logToFile('llm_errors.log', `Error querying Anthropic: ${ error.message }`);
        return Promise.resolve(`{
            "goal": "Error querying Anthropic",
            "incantations": [
                {"type": "ANALYSE", "description": "An error occurred while querying the Anthropic API.", "parameters": {"context": "${ error.message }"}}
            ]
        }`);
    }
}
