"use strict";
// src/core/llm_interfaces/anthropic.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryAnthropic = queryAnthropic;
const log_writers_1 = require("../log_writers");
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
async function queryAnthropic(prompt, model) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === 'YOUR_ANTHROPIC_API_KEY_HERE') {
        (0, log_writers_1.logToFile)('llm_errors.log', 'Anthropic API Key not set or is a placeholder. Cannot query Anthropic.');
        return Promise.resolve(`{
            "goal": "Simulated Anthropic plan (API Key missing)",
            "incantations": [
                {"type": "ANALYSE", "description": "Anthropic API Key is missing or invalid. Please set ANTHROPIC_API_KEY in your .env file.", "parameters": {"context": "API Key Missing"}}
            ]
        }`);
    }
    (0, log_writers_1.logToFile)('llm_calls.log', `Querying Anthropic model '${model}' with prompt (first 100 chars):\n${prompt.substring(0, 100)}...`);
    try {
        const anthropic = new sdk_1.default({ apiKey });
        const msg = await anthropic.messages.create({
            model: model,
            max_tokens: 1024,
            messages: [{ role: 'user', content: prompt }],
        });
        if (msg.content[0].type === 'text') {
            return msg.content[0].text;
        }
        return "";
    }
    catch (error) {
        (0, log_writers_1.logToFile)('llm_errors.log', `Error querying Anthropic: ${error.message}`);
        return Promise.resolve(`{
            "goal": "Error querying Anthropic",
            "incantations": [
                {"type": "ANALYSE", "description": "An error occurred while querying the Anthropic API.", "parameters": {"context": "${error.message}"}}
            ]
        }`);
    }
}
//# sourceMappingURL=anthropic.js.map