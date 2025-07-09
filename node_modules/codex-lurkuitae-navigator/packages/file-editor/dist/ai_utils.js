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
exports.LLMInterface = exports.LLMModel = void 0;
exports.getPersonaResponse = getPersonaResponse;
const child_process_1 = require("child_process");
const os = __importStar(require("os"));
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
// --- Copied LLMModel from core_types.ts ---
var LLMModel;
(function (LLMModel) {
    LLMModel["Mistral"] = "mistral";
    LLMModel["Claude"] = "claude";
    LLMModel["GPT4"] = "gpt-4";
    LLMModel["GPT3_5_Turbo"] = "gpt-3.5-turbo";
    LLMModel["GeminiPro"] = "gemini-pro";
    LLMModel["CodeLlama"] = "codellama:7b-instruct";
    LLMModel["CodeLlamaCode"] = "codellama:7b-code";
    LLMModel["Llama3"] = "llama3";
    LLMModel["OpenAI"] = "openai";
    LLMModel["Gemini"] = "gemini";
    LLMModel["Random"] = "random";
})(LLMModel || (exports.LLMModel = LLMModel = {}));
// --- Copied LLMInterface from llm_interface.ts (simplified) ---
function escapeJson(input) {
    return input
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
}
function extractBetweenMarkers(input) {
    const match = input.match(/```(?:json)?[\s\S]*?```/);
    return match ? match[1] : input;
}
class LLMInterface {
    static async query(prompt, model = LLMModel.Mistral, _fetch = fetch) {
        const cacheKey = `${model}-${prompt}`;
        if (LLMInterface.cache.has(cacheKey)) {
            return LLMInterface.cache.get(cacheKey);
        }
        let actualModel = model;
        if (model === LLMModel.Random) {
            let availableModels = Object.values(LLMModel).filter(m => m !== LLMModel.Random);
            const hasOpenAI = process.env.OPENAI_API_KEY;
            if (!hasOpenAI) {
                availableModels = availableModels.filter(m => m !== LLMModel.OpenAI);
            }
            actualModel = availableModels[Math.floor(Math.random() * availableModels.length)];
        }
        if (actualModel === LLMModel.OpenAI) {
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
                        model: "gpt-4o",
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
        else if (actualModel === LLMModel.Gemini) {
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
        else if (actualModel === LLMModel.Claude) {
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
        else if (actualModel === LLMModel.CodeLlama || actualModel === LLMModel.CodeLlamaCode || actualModel === LLMModel.Llama3 || actualModel === LLMModel.Mistral) {
            const isWindows = os.platform() === 'win32';
            const cleanPrompt = escapeJson(prompt);
            if (isWindows) {
                try {
                    const body = {
                        model: actualModel,
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
}
exports.LLMInterface = LLMInterface;
LLMInterface.cache = new Map();
// --- Simplified PersonaLoader ---
class PersonaLoader {
    constructor(baseDir) {
        this.personas = new Map();
        this.personasDirectory = path.resolve(baseDir, 'personas');
        this.loadPersonas(); // Load on instantiation
    }
    async loadPersonas() {
        try {
            const entries = await fs.readdir(this.personasDirectory, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(this.personasDirectory, entry.name);
                if (entry.isFile() && entry.name.endsWith('.personae')) {
                    const content = await fs.readFile(fullPath, 'utf-8');
                    const persona = JSON.parse(content);
                    this.personas.set(persona.name.toLowerCase(), persona);
                }
            }
        }
        catch (error) {
            console.error(`Error loading personas: ${error}`);
        }
    }
    getPersona(name) {
        return this.personas.get(name.toLowerCase());
    }
}
const personaLoader = new PersonaLoader(process.cwd()); // Initialize with current working directory
// --- Adapted getPersonaResponse ---
async function getPersonaResponse(personaName, message, context, llmModel = LLMModel.Mistral) {
    let persona = personaLoader.getPersona(personaName);
    if (!persona) {
        // For this standalone tool, we don't create new personas. Just return a default.
        console.warn(`Persona ${personaName} not found. Using default response.`);
        return `[System]: Persona ${personaName} not found.`;
    }
    if (persona.job && persona.job.prompt) {
        const jobPrompt = `${persona.job.prompt}\n\nInput: "${message}"`;
        return await LLMInterface.query(jobPrompt, persona.llm_model || llmModel);
    }
    else {
        const prompt = `${persona.description}\n\nRephrase the following message in this persona's voice: "${message}"`;
        return await LLMInterface.query(prompt, persona.llm_model || llmModel);
    }
}
//# sourceMappingURL=ai_utils.js.map