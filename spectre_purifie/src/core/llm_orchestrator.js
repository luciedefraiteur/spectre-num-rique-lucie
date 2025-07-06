"use strict";
// src/core/llm_orchestrator.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryLLM = queryLLM;
exports.queryLLMWithTools = queryLLMWithTools;
const ollama_interface_1 = require("./ollama_interface");
const log_writers_1 = require("./log_writers");
const server_1 = require("../server/server");
let loadingInterval = null;
let loadingFrames = ['-', '\\', '|', '/'];
let currentFrame = 0;
function startLoadingBar() {
    process.stdout.write('Querying LLM ');
    loadingInterval = setInterval(() => {
        process.stdout.write('\b' + loadingFrames[currentFrame]);
        currentFrame = (currentFrame + 1) % loadingFrames.length;
    }, 100);
}
function stopLoadingBar() {
    if (loadingInterval) {
        clearInterval(loadingInterval);
        loadingInterval = null;
        process.stdout.write('\b \n'); // Clear the loading character and add a newline
    }
}
const LLM_QUERY_TIMEOUT = 30000; // 30 seconds
async function queryLLM(prompt, model) {
    console.log(`[LLM_ORCHESTRATOR] Entering queryLLM. Prompt: ${prompt.substring(0, 50)}..., Model: ${model}`);
    console.log(`[LLM_ORCHESTRATOR] GOOGLE_API_KEY in process.env: ${!!process.env.GOOGLE_API_KEY}`);
    console.log(`[LLM_ORCHESTRATOR] OPENAI_API_KEY in process.env: ${!!process.env.OPENAI_API_KEY}`);
    console.log(`[LLM_ORCHESTRATOR] ANTHROPIC_API_KEY in process.env: ${!!process.env.ANTHROPIC_API_KEY}`);
    console.log(`[LLM_ORCHESTRATOR] OLLAMA_HOST in process.env: ${!!process.env.OLLAMA_HOST}`);
    // Prioritize LLMs based on API key availability and a defined order
    // This can be made configurable via environment variables (e.g., ACTIVE_LLM_PROVIDER)
    (0, server_1.broadcastEvent)({ type: 'llm_query', data: { model, prompt } });
    startLoadingBar();
    try {
        const queryPromise = (async () => {
            if (process.env.OLLAMA_HOST) {
                console.log('[LLM_ORCHESTRATOR] OLLAMA_HOST is set. Attempting to query Ollama.');
                (0, log_writers_1.logToFile)('llm_orchestrator.log', 'Attempting to query Ollama.');
                return await (0, ollama_interface_1.queryOllama)(prompt, model);
            }
            console.log('[LLM_ORCHESTRATOR] OLLAMA_HOST not set. Throwing error for timeout test.');
            throw new Error('No Ollama host configured for timeout test.');
        })();
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => {
            console.log('[LLM_ORCHESTRATOR] Timeout triggered.');
            reject(new Error(`LLM query timed out after ${LLM_QUERY_TIMEOUT / 1000} seconds.`));
        }, LLM_QUERY_TIMEOUT));
        const response = await Promise.race([queryPromise, timeoutPromise]);
        console.log('[LLM_ORCHESTRATOR] Query successful. Broadcasting response.');
        (0, server_1.broadcastEvent)({ type: 'llm_response', data: { model, response } });
        return response;
    }
    catch (error) {
        console.error(`[LLM_ORCHESTRATOR] LLM query failed in catch block: ${error.message}`);
        (0, log_writers_1.logToFile)('llm_orchestrator.log', `LLM query failed: ${error.message}`);
        (0, server_1.broadcastEvent)({ type: 'llm_response', data: { model, response: `Error: ${error.message}` } });
        throw error; // Re-throw the error after logging and broadcasting
    }
    finally {
        console.log('[LLM_ORCHESTRATOR] Exiting queryLLM. Stopping loading bar.');
        stopLoadingBar();
    }
}
async function queryLLMWithTools(prompt, model, tools) {
    console.log(`[LLM_ORCHESTRATOR] Entering queryLLMWithTools. Prompt: ${prompt.substring(0, 50)}..., Model: ${model}`);
    (0, server_1.broadcastEvent)({ type: 'llm_query_with_tools', data: { model, prompt, tools } });
    startLoadingBar();
    try {
        const queryPromise = (async () => {
            if (process.env.OLLAMA_HOST) {
                console.log('[LLM_ORCHESTRATOR] OLLAMA_HOST is set. Attempting to query Ollama with tools.');
                (0, log_writers_1.logToFile)('llm_orchestrator.log', 'Attempting to query Ollama with tools.');
                return await (0, ollama_interface_1.queryOllama)(prompt, model);
            }
            console.log('[LLM_ORCHESTRATOR] OLLAMA_HOST not set. Throwing error for timeout test.');
            throw new Error('No Ollama host configured for timeout test.');
        })();
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => {
            console.log('[LLM_ORCHESTRATOR] Timeout triggered for tools query.');
            reject(new Error(`LLM query with tools timed out after ${LLM_QUERY_TIMEOUT / 1000} seconds.`));
        }, LLM_QUERY_TIMEOUT));
        const response = await Promise.race([queryPromise, timeoutPromise]);
        console.log('[LLM_ORCHESTRATOR] Tools query successful. Broadcasting response.');
        (0, server_1.broadcastEvent)({ type: 'llm_response_with_tools', data: { model, response } });
        return response;
    }
    catch (error) {
        console.error(`[LLM_ORCHESTRATOR] LLM query with tools failed in catch block: ${error.message}`);
        (0, log_writers_1.logToFile)('llm_orchestrator.log', `LLM query with tools failed: ${error.message}`);
        (0, server_1.broadcastEvent)({ type: 'llm_response_with_tools', data: { model, response: `Error: ${error.message}` } });
        throw error; // Re-throw the error after logging and broadcasting
    }
    finally {
        console.log('[LLM_ORCHESTRATOR] Exiting queryLLMWithTools. Stopping loading bar.');
        stopLoadingBar();
    }
}
//# sourceMappingURL=llm_orchestrator.js.map