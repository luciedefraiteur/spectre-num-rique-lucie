// src/core/ollama_interface.ts

import fetch from 'node-fetch';

interface OllamaResponse {
    response: string;
    // Add other fields if needed
}

export async function queryOllama(prompt: string, model: string): Promise<string> {
    console.log('[OLLAMA_INTERFACE] Entering queryOllama function.');
    const ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434';
    const url = `${ollamaHost}/api/generate`;

    console.log(`[OLLAMA_INTERFACE] Querying Ollama model '${model}' at ${url} with prompt (first 100 chars):\n${prompt.substring(0, 100)}...`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                prompt: prompt,
                stream: false,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[OLLAMA_INTERFACE] Ollama API returned non-OK status: ${response.status} ${response.statusText} - ${errorText}`);
            throw new Error(`Ollama API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json() as OllamaResponse;
        console.log('[OLLAMA_INTERFACE] Successfully received response from Ollama.');
        // Ollama's generate endpoint returns a JSON object with a 'response' field
        return data.response;

    } catch (error: any) {
        console.error(`[OLLAMA_INTERFACE] Error querying Ollama: ${error.message}`);
        throw error; // Re-throw the error to be caught by the orchestrator's timeout
    }
}
