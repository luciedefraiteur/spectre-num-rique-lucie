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
exports.getPersonaResponse = getPersonaResponse;
var llm_interface_js_1 = require("./llm_interface.js");
var fs = require("fs/promises");
var path = require("path");
function listPersonas() {
    return __awaiter(this, void 0, void 0, function () {
        var personasDir, files, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    personasDir = 'personas';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fs.readdir(personasDir)];
                case 2:
                    files = _a.sent();
                    return [2 /*return*/, files
                            .filter(function (file) { return file.endsWith('.personae') && file !== 'chaotic.personae' && file !== 'mog.personae'; })
                            .map(function (file) { return file.replace('.personae', ''); })];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error listing personas:", error_1);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getPersonaResponse(persona, message) {
    return __awaiter(this, void 0, void 0, function () {
        var personaFilePath, fileContent, availablePersonas, personaList, chaoticPrompt, chosenPersonaRaw, chosenPersona, structuredPersona, jobPrompt, e_1, prompt_1, prompt_2, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    personaFilePath = path.join('personas', "".concat(persona, ".personae"));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 15, , 16]);
                    return [4 /*yield*/, fs.readFile(personaFilePath, 'utf-8')];
                case 2:
                    fileContent = _a.sent();
                    if (!(persona === 'chaotic')) return [3 /*break*/, 7];
                    return [4 /*yield*/, listPersonas()];
                case 3:
                    availablePersonas = _a.sent();
                    personaList = availablePersonas.join(', ');
                    chaoticPrompt = fileContent.replace('[PERSONA_LIST_PLACEHOLDER]', personaList);
                    return [4 /*yield*/, llm_interface_js_1.LLMInterface.query(chaoticPrompt, llm_interface_js_1.LLMModel.Mistral)];
                case 4:
                    chosenPersonaRaw = _a.sent();
                    chosenPersona = chosenPersonaRaw.trim().toLowerCase();
                    if (!availablePersonas.includes(chosenPersona)) return [3 /*break*/, 6];
                    console.log("Chaotic persona chose to embody: ".concat(chosenPersona));
                    return [4 /*yield*/, getPersonaResponse(chosenPersona, message)];
                case 5: return [2 /*return*/, _a.sent()];
                case 6:
                    console.warn("Chaotic persona chose an invalid persona: ".concat(chosenPersona, ". Falling back to default chaotic response."));
                    return [2 /*return*/, "[Chaotic]: I chose a path less traveled, but it led nowhere. My response is: ".concat(message)]; // Fallback
                case 7:
                    if (!fileContent.trim().startsWith('{')) return [3 /*break*/, 13];
                    _a.label = 8;
                case 8:
                    _a.trys.push([8, 11, , 13]);
                    structuredPersona = JSON.parse(fileContent);
                    if (!(structuredPersona.job && structuredPersona.job.prompt)) return [3 /*break*/, 10];
                    jobPrompt = "".concat(structuredPersona.job.prompt, "\n\nInput: \"").concat(message, "\"");
                    return [4 /*yield*/, llm_interface_js_1.LLMInterface.query(jobPrompt, llm_interface_js_1.LLMModel.Mistral)];
                case 9: return [2 /*return*/, _a.sent()];
                case 10: return [3 /*break*/, 13];
                case 11:
                    e_1 = _a.sent();
                    console.error("[ERROR] JSON parsing failed for persona ".concat(persona, ": ").concat(e_1.message));
                    prompt_1 = "".concat(fileContent, "\n\nRephrase the following message in this persona's voice: \"").concat(message, "\"");
                    return [4 /*yield*/, llm_interface_js_1.LLMInterface.query(prompt_1, llm_interface_js_1.LLMModel.Mistral)];
                case 12: return [2 /*return*/, _a.sent()];
                case 13:
                    prompt_2 = "".concat(fileContent, "\n\nRephrase the following message in this persona's voice: \"").concat(message, "\"");
                    return [4 /*yield*/, llm_interface_js_1.LLMInterface.query(prompt_2, llm_interface_js_1.LLMModel.Mistral)];
                case 14: return [2 /*return*/, _a.sent()];
                case 15:
                    error_2 = _a.sent();
                    console.error("Could not load persona file for: ".concat(persona));
                    // Fallback to a generic response
                    return [2 /*return*/, "[".concat(persona, "]: ").concat(message)];
                case 16: return [2 /*return*/];
            }
        });
    });
}
