"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMInterface = void 0;
const child_process_1 = require("child_process");
const os = __importStar(require("os"));
const base_js_1 = require("../../luciform-types/src/base.js");
const generateWaitMessagePrompt_js_1 = require("../../luciform-personas/src/prompts/generateWaitMessagePrompt.js");
function escapeJson(input) {
    return input
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
}
function extractBetweenMarkers(input) {
    const match = input.match(/```(?:json)?([\s\S]*?)```/);
    return match ? match[1] : input;
}
class LLMInterface {
    static async query(prompt, model = base_js_1.LLMModel.Mistral, _fetch = fetch) {
        const cacheKey = `${model}-${prompt}`;
        if (LLMInterface.cache.has(cacheKey)) {
            return LLMInterface.cache.get(cacheKey);
        }
        let actualModel = model;
        if (model === base_js_1.LLMModel.Random) {
            let availableModels = Object.values(base_js_1.LLMModel).filter(m => m !== base_js_1.LLMModel.Random);
            const hasOpenAI = process.env.OPENAI_API_KEY;
            if (!hasOpenAI) {
                availableModels = availableModels.filter(m => m !== base_js_1.LLMModel.OpenAI);
            }
            actualModel = availableModels[Math.floor(Math.random() * availableModels.length)];
        }
        if (actualModel === base_js_1.LLMModel.OpenAI) {
            const openaiApiKey = process.env.OPENAI_API_KEY;
            if (!openaiApiKey) {
                throw new Error("OPENAI_API_KEY environment variable is not set.");
            }
            try {
                const response = await _fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${openaiApiKey}`
                    },
                    body: JSON.stringify({
                        model: "gpt-4o", // You can make this configurable or choose a default
                        messages: [{ role: "user", content: prompt }],
                        temperature: 0.7
                    })
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`OpenAI API Error ${response.status}: ${errorText}`);
                }
                const json = await response.json();
                const fullResponse = json.choices[0]?.message?.content ?? '';
                if (!fullResponse) {
                    throw new Error("OpenAI API: Empty response after parsing.");
                }
                LLMInterface.cache.set(cacheKey, fullResponse);
                return extractBetweenMarkers(fullResponse);
            }
            catch (err) {
                console.error("OpenAI FETCH Error:", err);
                throw new Error(`[OpenAI Error: ${err.message}]`);
            }
        }
        else if (actualModel === base_js_1.LLMModel.Gemini) {
            const geminiApiKey = process.env.GEMINI_API_KEY;
            if (!geminiApiKey) {
                throw new Error("GEMINI_API_KEY environment variable is not set.");
            }
            try {
                const response = await _fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${geminiApiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            temperature: 0.7,
                        }
                    })
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Gemini API Error ${response.status}: ${errorText}`);
                }
                const json = await response.json();
                const fullResponse = json.candidates[0]?.content?.parts[0]?.text ?? '';
                if (!fullResponse) {
                    throw new Error("Gemini API: Empty response after parsing.");
                }
                LLMInterface.cache.set(cacheKey, fullResponse);
                return extractBetweenMarkers(fullResponse);
            }
            catch (err) {
                console.error("Gemini FETCH Error:", err);
                throw new Error(`[Gemini Error: ${err.message}]`);
            }
        }
        else if (actualModel === base_js_1.LLMModel.Claude) {
            const apiKey = process.env.CLAUDE_API_KEY;
            if (!apiKey) {
                throw new Error('La clé API Claude (CLAUDE_API_KEY) n\'est pas définie dans le fichier .env');
            }
            try {
                const response = await _fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: {
                        'x-api-key': apiKey,
                        'anthropic-version': '2023-06-01',
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: "claude-3-haiku-20240307",
                        max_tokens: 4096,
                        messages: [
                            { role: "user", content: prompt }
                        ]
                    }),
                });
                if (!response.ok) {
                    const errorBody = await response.text();
                    throw new Error(`Erreur de l'API Claude: ${response.status} ${response.statusText} - ${errorBody}`);
                }
                const data = await response.json();
                const fullResponse = data.content[0].text;
                LLMInterface.cache.set(cacheKey, fullResponse);
                return fullResponse;
            }
            catch (err) {
                console.error("[Erreur Claude Interface]", err);
                throw new Error(`[Claude Error: ${err.message}]`);
            }
        }
        else if (actualModel === base_js_1.LLMModel.CodeLlama || actualModel === base_js_1.LLMModel.CodeLlamaCode || actualModel === base_js_1.LLMModel.Llama3 || actualModel === base_js_1.LLMModel.Mistral) {
            const isWindows = os.platform() === 'win32';
            const cleanPrompt = escapeJson(prompt);
            if (isWindows) {
                try {
                    const body = {
                        model: actualModel, // Use actualModel here
                        prompt: cleanPrompt,
                        stream: false
                    };
                    console.log(`[LLMInterface] Envoi de la requête à Ollama pour le modèle ${actualModel}...`);
                    const response = await _fetch('http://127.0.0.1:11434/api/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body)
                    });
                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`Ollama HTTP ${response.status} : ${errorText}`);
                    }
                    const json = await response.json();
                    const fullResponse = json.response ?? '';
                    if (!fullResponse) {
                        throw new Error("Ollama: Empty response after parsing");
                    }
                    console.log("fullResponse:", fullResponse);
                    return extractBetweenMarkers(fullResponse);
                }
                catch (err) {
                    console.error("Ollama FETCH Error :", err);
                    throw new Error(`[Ollama Error: ${err.message}]`);
                }
            }
            else {
                return new Promise((resolve, reject) => {
                    const child = (0, child_process_1.spawn)('llm', ['--no-stream', '--model', actualModel], {
                        stdio: ['pipe', 'pipe', 'pipe']
                    });
                    let stdout = '';
                    let stderr = '';
                    const timeout = setTimeout(() => {
                        child.kill('SIGKILL');
                        reject('[Timeout LLM : aucune réponse après 30 secondes]');
                    }, 30000);
                    child.stdout.on('data', (data) => {
                        stdout += data.toString();
                    });
                    child.stderr.on('data', (data) => {
                        stderr += data.toString();
                    });
                    child.on('error', (err) => {
                        clearTimeout(timeout);
                        reject(`[Erreur LLM: ${err.message}]`);
                    });
                    child.on('close', (code) => {
                        clearTimeout(timeout);
                        if (code !== 0) {
                            reject(`[LLM terminé avec code ${code}] ${stderr}`);
                        }
                        else {
                            const result = stdout.trim();
                            resolve(extractBetweenMarkers(result));
                        }
                    });
                    child.stdin.write(prompt + '\n');
                    child.stdin.end();
                });
            }
        }
        else {
            throw new Error(`Unsupported LLM model: ${actualModel}`);
        }
    }
    static async generateWaitMessage(context) {
        const prompt = (0, generateWaitMessagePrompt_js_1.generateWaitMessagePrompt)(context);
        return this.query(prompt);
    }
}
exports.LLMInterface = LLMInterface;
LLMInterface.cache = new Map();
//# sourceMappingURL=llm_interface.js.map