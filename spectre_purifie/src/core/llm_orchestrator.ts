// src/core/llm_orchestrator.ts

import { queryGemini } from './llm_interfaces/gemini';
import { queryOpenAI } from './llm_interfaces/openai';
import { queryAnthropic } from './llm_interfaces/anthropic';
import { logToFile } from './log_writers';

// Load environment variables (assuming dotenv is configured in main.ts or similar)
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' }); // Adjust path as necessary to find the root .env

export async function queryLLM(prompt: string, model: string): Promise<string> {
    // Prioritize LLMs based on API key availability and a defined order
    // This can be made configurable via environment variables (e.g., ACTIVE_LLM_PROVIDER)

    if (process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY !== 'YOUR_GOOGLE_API_KEY_HERE') {
        logToFile('llm_orchestrator.log', 'Attempting to query Gemini.');
        return queryGemini(prompt, model);
    }

    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'YOUR_OPENAI_API_KEY_HERE') {
        logToFile('llm_orchestrator.log', 'Attempting to query OpenAI.');
        return queryOpenAI(prompt, model);
    }

    if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'YOUR_ANTHROPIC_API_KEY_HERE') {
        logToFile('llm_orchestrator.log', 'Attempting to query Anthropic.');
        return queryAnthropic(prompt, model);
    }

    logToFile('llm_orchestrator.log', 'No valid LLM API key found. Falling back to simulated response.');
    // Fallback to a generic simulated response if no API key is available
    return Promise.resolve(`{
        "goal": "Simulated plan (no active LLM API key)",
        "incantations": [
            {
                "type": "ANALYSE",
                "description": "No active LLM API key found. Please set one in your .env file.",
                "parameters": {"context": "LLM API Key Missing"}
            }
        ]
    }`);
}
