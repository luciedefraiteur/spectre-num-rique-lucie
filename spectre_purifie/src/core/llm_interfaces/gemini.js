"use strict";
// src/core/llm_interfaces/gemini.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryGemini = queryGemini;
const log_writers_1 = require("../log_writers");
const generative_ai_1 = require("@google/generative-ai");
async function queryGemini(prompt, model) {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GOOGLE_API_KEY_HERE') {
        (0, log_writers_1.logToFile)('llm_errors.log', 'Google API Key not set or is a placeholder. Cannot query Gemini.');
        return Promise.resolve(`{
            "goal": "Simulated Gemini plan (API Key missing)",
            "incantations": [
                {"type": "ANALYSE", "description": "Google API Key is missing or invalid. Please set GOOGLE_API_KEY in your .env file.", "parameters": {"context": "API Key Missing"}}
            ]
        }`);
    }
    (0, log_writers_1.logToFile)('llm_calls.log', `Querying Gemini model '${model}' with prompt (first 100 chars):\n${prompt.substring(0, 100)}...`);
    try {
        const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        const geminiModel = genAI.getGenerativeModel({ model });
        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text;
    }
    catch (error) {
        (0, log_writers_1.logToFile)('llm_errors.log', `Error querying Gemini: ${error.message}`);
        return Promise.resolve(`{
            "goal": "Error querying Gemini",
            "incantations": [
                {"type": "ANALYSE", "description": "An error occurred while querying the Gemini API.", "parameters": {"context": "${error.message}"}}
            ]
        }`);
    }
}
//# sourceMappingURL=gemini.js.map