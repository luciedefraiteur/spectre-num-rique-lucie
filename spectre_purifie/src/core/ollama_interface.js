"use strict";
// src/core/ollama_interface.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryOllama = queryOllama;
const node_fetch_1 = __importDefault(require("node-fetch"));
async function queryOllama(prompt, model) {
    console.log('[OLLAMA_INTERFACE] Entering queryOllama function.');
    const ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434';
    const url = `${ollamaHost}/api/generate`;
    console.log(`[OLLAMA_INTERFACE] Querying Ollama model '${model}' at ${url} with prompt (first 100 chars):\n${prompt.substring(0, 100)}...`);
    try {
        const response = await (0, node_fetch_1.default)(url, {
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
        const data = await response.json();
        console.log('[OLLAMA_INTERFACE] Successfully received response from Ollama.');
        // Ollama's generate endpoint returns a JSON object with a 'response' field
        return data.response;
    }
    catch (error) {
        console.error(`[OLLAMA_INTERFACE] Error querying Ollama: ${error.message}`);
        throw error; // Re-throw the error to be caught by the orchestrator's timeout
    }
}
//# sourceMappingURL=ollama_interface.js.map