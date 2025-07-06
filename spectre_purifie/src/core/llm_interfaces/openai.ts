// src/core/llm_interfaces/openai.ts

import {logToFile} from '../log_writers';
import OpenAI from 'openai';

export async function queryOpenAI(prompt: string, model: string): Promise<string>
{
    const apiKey = process.env.OPENAI_API_KEY;
    if(!apiKey || apiKey === 'YOUR_OPENAI_API_KEY_HERE')
    {
        logToFile('llm_errors.log', 'OpenAI API Key not set or is a placeholder. Cannot query OpenAI.');
        return Promise.resolve(`{
            "goal": "Simulated OpenAI plan (API Key missing)",
            "incantations": [
                {"type": "ANALYSE", "description": "OpenAI API Key is missing or invalid. Please set OPENAI_API_KEY in your .env file.", "parameters": {"context": "API Key Missing"}}
            ]
        }`);
    }

    logToFile('llm_calls.log', `Querying OpenAI model '${ model }' with prompt (first 100 chars):\n${ prompt.substring(0, 100) }...`);

    try
    {
        const openai = new OpenAI({apiKey});
        const completion = await openai.chat.completions.create({
            messages: [{role: "system", content: prompt}],
            model: model,
        });
        return completion.choices[0].message.content || "";
    } catch(error: any)
    {
        logToFile('llm_errors.log', `Error querying OpenAI: ${ error.message }`);
        return Promise.resolve(`{
            "goal": "Error querying OpenAI",
            "incantations": [
                {"type": "ANALYSE", "description": "An error occurred while querying the OpenAI API.", "parameters": {"context": "${ error.message }"}}
            ]
        }`);
    }
}
