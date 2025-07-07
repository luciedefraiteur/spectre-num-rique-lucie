"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMInterface = exports.LLMModel = void 0;
var child_process_1 = require("child_process");
var os = require("os");
var generateWaitMessagePrompt_js_1 = require("./prompts/generateWaitMessagePrompt.js");
var LLMModel;
(function (LLMModel) {
    LLMModel["CodeLlama"] = "codellama:7b-instruct";
    LLMModel["CodeLlamaCode"] = "codellama:7b-code";
    LLMModel["Llama3"] = "llama3";
    LLMModel["Mistral"] = "mistral";
    LLMModel["OpenAI"] = "openai";
    LLMModel["Gemini"] = "gemini";
    LLMModel["Claude"] = "claude";
    LLMModel["Random"] = "random";
})(LLMModel || (exports.LLMModel = LLMModel = {}));
function escapeJson(input) {
    return input
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
}
function extractBetweenMarkers(input) {
    var match = input.match(/```(?:json)?([\s\S]*?)```/);
    return match ? match[1] : input;
}
var LLMInterface = /** @class */ (function () {
    function LLMInterface() {
    }
    LLMInterface.query = function (prompt_1) {
        return __awaiter(this, arguments, void 0, function (prompt, model, _fetch) {
            var cacheKey, actualModel, availableModels, hasOpenAI, openaiApiKey, response, errorText, json, fullResponse, err_1, geminiApiKey, response, errorText, json, fullResponse, err_2, apiKey, response, errorBody, data, fullResponse, err_3, isWindows, cleanPrompt, body, response, errorText, json, fullResponse, err_4;
            var _a, _b, _c, _d, _e, _f, _g, _h;
            if (model === void 0) { model = LLMModel.Mistral; }
            if (_fetch === void 0) { _fetch = fetch; }
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        cacheKey = "".concat(model, "-").concat(prompt);
                        if (LLMInterface.cache.has(cacheKey)) {
                            return [2 /*return*/, LLMInterface.cache.get(cacheKey)];
                        }
                        actualModel = model;
                        if (model === LLMModel.Random) {
                            availableModels = Object.values(LLMModel).filter(function (m) { return m !== LLMModel.Random; });
                            hasOpenAI = process.env.OPENAI_API_KEY;
                            if (!hasOpenAI) {
                                availableModels = availableModels.filter(function (m) { return m !== LLMModel.OpenAI; });
                            }
                            actualModel = availableModels[Math.floor(Math.random() * availableModels.length)];
                        }
                        if (!(actualModel === LLMModel.OpenAI)) return [3 /*break*/, 8];
                        openaiApiKey = process.env.OPENAI_API_KEY;
                        if (!openaiApiKey) {
                            throw new Error("OPENAI_API_KEY environment variable is not set.");
                        }
                        _j.label = 1;
                    case 1:
                        _j.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, _fetch('https://api.openai.com/v1/chat/completions', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': "Bearer ".concat(openaiApiKey)
                                },
                                body: JSON.stringify({
                                    model: "gpt-4o", // You can make this configurable or choose a default
                                    messages: [{ role: "user", content: prompt }],
                                    temperature: 0.7
                                })
                            })];
                    case 2:
                        response = _j.sent();
                        if (!!response.ok) return [3 /*break*/, 4];
                        return [4 /*yield*/, response.text()];
                    case 3:
                        errorText = _j.sent();
                        throw new Error("OpenAI API Error ".concat(response.status, ": ").concat(errorText));
                    case 4: return [4 /*yield*/, response.json()];
                    case 5:
                        json = _j.sent();
                        fullResponse = (_c = (_b = (_a = json.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) !== null && _c !== void 0 ? _c : '';
                        if (!fullResponse) {
                            throw new Error("OpenAI API: Empty response after parsing.");
                        }
                        LLMInterface.cache.set(cacheKey, fullResponse);
                        return [2 /*return*/, extractBetweenMarkers(fullResponse)];
                    case 6:
                        err_1 = _j.sent();
                        console.error("OpenAI FETCH Error:", err_1);
                        throw new Error("[OpenAI Error: ".concat(err_1.message, "]"));
                    case 7: return [3 /*break*/, 35];
                    case 8:
                        if (!(actualModel === LLMModel.Gemini)) return [3 /*break*/, 16];
                        geminiApiKey = process.env.GEMINI_API_KEY;
                        if (!geminiApiKey) {
                            throw new Error("GEMINI_API_KEY environment variable is not set.");
                        }
                        _j.label = 9;
                    case 9:
                        _j.trys.push([9, 14, , 15]);
                        return [4 /*yield*/, _fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=".concat(geminiApiKey), {
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
                            })];
                    case 10:
                        response = _j.sent();
                        if (!!response.ok) return [3 /*break*/, 12];
                        return [4 /*yield*/, response.text()];
                    case 11:
                        errorText = _j.sent();
                        throw new Error("Gemini API Error ".concat(response.status, ": ").concat(errorText));
                    case 12: return [4 /*yield*/, response.json()];
                    case 13:
                        json = _j.sent();
                        fullResponse = (_g = (_f = (_e = (_d = json.candidates[0]) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.parts[0]) === null || _f === void 0 ? void 0 : _f.text) !== null && _g !== void 0 ? _g : '';
                        if (!fullResponse) {
                            throw new Error("Gemini API: Empty response after parsing.");
                        }
                        LLMInterface.cache.set(cacheKey, fullResponse);
                        return [2 /*return*/, extractBetweenMarkers(fullResponse)];
                    case 14:
                        err_2 = _j.sent();
                        console.error("Gemini FETCH Error:", err_2);
                        throw new Error("[Gemini Error: ".concat(err_2.message, "]"));
                    case 15: return [3 /*break*/, 35];
                    case 16:
                        if (!(actualModel === LLMModel.Claude)) return [3 /*break*/, 24];
                        apiKey = process.env.CLAUDE_API_KEY;
                        if (!apiKey) {
                            throw new Error('La clé API Claude (CLAUDE_API_KEY) n\'est pas définie dans le fichier .env');
                        }
                        _j.label = 17;
                    case 17:
                        _j.trys.push([17, 22, , 23]);
                        return [4 /*yield*/, _fetch('https://api.anthropic.com/v1/messages', {
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
                            })];
                    case 18:
                        response = _j.sent();
                        if (!!response.ok) return [3 /*break*/, 20];
                        return [4 /*yield*/, response.text()];
                    case 19:
                        errorBody = _j.sent();
                        throw new Error("Erreur de l'API Claude: ".concat(response.status, " ").concat(response.statusText, " - ").concat(errorBody));
                    case 20: return [4 /*yield*/, response.json()];
                    case 21:
                        data = _j.sent();
                        fullResponse = data.content[0].text;
                        LLMInterface.cache.set(cacheKey, fullResponse);
                        return [2 /*return*/, fullResponse];
                    case 22:
                        err_3 = _j.sent();
                        console.error("[Erreur Claude Interface]", err_3);
                        throw new Error("[Claude Error: ".concat(err_3.message, "]"));
                    case 23: return [3 /*break*/, 35];
                    case 24:
                        if (!(actualModel === LLMModel.CodeLlama || actualModel === LLMModel.CodeLlamaCode || actualModel === LLMModel.Llama3 || actualModel === LLMModel.Mistral)) return [3 /*break*/, 34];
                        isWindows = os.platform() === 'win32';
                        cleanPrompt = escapeJson(prompt);
                        if (!isWindows) return [3 /*break*/, 32];
                        _j.label = 25;
                    case 25:
                        _j.trys.push([25, 30, , 31]);
                        body = {
                            model: actualModel, // Use actualModel here
                            prompt: cleanPrompt,
                            stream: false
                        };
                        console.log("[LLMInterface] Envoi de la requ\u00EAte \u00E0 Ollama pour le mod\u00E8le ".concat(actualModel, "..."));
                        return [4 /*yield*/, _fetch('http://127.0.0.1:11434/api/generate', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(body)
                            })];
                    case 26:
                        response = _j.sent();
                        if (!!response.ok) return [3 /*break*/, 28];
                        return [4 /*yield*/, response.text()];
                    case 27:
                        errorText = _j.sent();
                        throw new Error("Ollama HTTP ".concat(response.status, " : ").concat(errorText));
                    case 28: return [4 /*yield*/, response.json()];
                    case 29:
                        json = _j.sent();
                        fullResponse = (_h = json.response) !== null && _h !== void 0 ? _h : '';
                        if (!fullResponse) {
                            throw new Error("Ollama: Empty response after parsing");
                        }
                        console.log("fullResponse:", fullResponse);
                        return [2 /*return*/, extractBetweenMarkers(fullResponse)];
                    case 30:
                        err_4 = _j.sent();
                        console.error("Ollama FETCH Error :", err_4);
                        throw new Error("[Ollama Error: ".concat(err_4.message, "]"));
                    case 31: return [3 /*break*/, 33];
                    case 32: return [2 /*return*/, new Promise(function (resolve, reject) {
                            var child = (0, child_process_1.spawn)('llm', ['--no-stream', '--model', actualModel], {
                                stdio: ['pipe', 'pipe', 'pipe']
                            });
                            var stdout = '';
                            var stderr = '';
                            var timeout = setTimeout(function () {
                                child.kill('SIGKILL');
                                reject('[Timeout LLM : aucune réponse après 30 secondes]');
                            }, 30000);
                            child.stdout.on('data', function (data) {
                                stdout += data.toString();
                            });
                            child.stderr.on('data', function (data) {
                                stderr += data.toString();
                            });
                            child.on('error', function (err) {
                                clearTimeout(timeout);
                                reject("[Erreur LLM: ".concat(err.message, "]"));
                            });
                            child.on('close', function (code) {
                                clearTimeout(timeout);
                                if (code !== 0) {
                                    reject("[LLM termin\u00E9 avec code ".concat(code, "] ").concat(stderr));
                                }
                                else {
                                    var result = stdout.trim();
                                    resolve(extractBetweenMarkers(result));
                                }
                            });
                            child.stdin.write(prompt + '\n');
                            child.stdin.end();
                        })];
                    case 33: return [3 /*break*/, 35];
                    case 34: throw new Error("Unsupported LLM model: ".concat(actualModel));
                    case 35: return [2 /*return*/];
                }
            });
        });
    };
    LLMInterface.generateWaitMessage = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var prompt;
            return __generator(this, function (_a) {
                prompt = (0, generateWaitMessagePrompt_js_1.generateWaitMessagePrompt)(context);
                return [2 /*return*/, this.query(prompt)];
            });
        });
    };
    LLMInterface.cache = new Map();
    return LLMInterface;
}());
exports.LLMInterface = LLMInterface;
