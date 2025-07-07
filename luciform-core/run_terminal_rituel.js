"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.runTerminalRitual = runTerminalRitual;
var ritual_utils_js_1 = require("./ritual_utils.js");
var temperature_monitor_js_1 = require("./utils/temperature_monitor.js");
var ui_utils_js_1 = require("./utils/ui_utils.js");
var llm_interface_js_1 = require("./llm_interface.js");
var emotional_core_js_1 = require("./emotional_core.js");
var memory_weaver_js_1 = require("./memory_weaver.js");
var generateWelcomeMessagePrompt_js_1 = require("./prompts/generateWelcomeMessagePrompt.js");
var log_writers_js_1 = require("./log_writers.js");
var reflet_weaver_js_1 = require("./utils/reflet_weaver.js");
var fs = require("fs");
var os = require("os");
var fsPromises = require("fs/promises");
var path = require("path");
var _filename = path.resolve(process.cwd(), 'core/run_terminal_rituel.ts');
var _dirname = path.dirname(_filename);
function runTerminalRitual(context_1, rl_1, ask_1, testInputs_1) {
    return __awaiter(this, arguments, void 0, function (context, rl, ask, testInputs, model, updateSpectrumContext) {
        var allReflectFragments, initialInputReceived, lastAnalysisResult, randomIndex, inputForPlanGeneration, userIntent, initialUserInput, emotionalInterpretation, welcomeMessage, chantsMap, chantFileName, chantPath, chantContent, files, error_1, plan, maxPlanGenerationRetries, currentRetry, newIntent, clarificationPrompt, clarificationQuestion, userClarification, resultats, newAnalysisResult, _i, resultats_1, res, proactivePrompt, proactiveIntent;
        if (model === void 0) { model = llm_interface_js_1.LLMModel.Mistral; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, reflet_weaver_js_1.loadAllReflectFragments)()];
                case 1:
                    allReflectFragments = _a.sent();
                    // --- Emotional Awakening ---
                    context.kardiaSphere = (0, emotional_core_js_1.calculateEmotion)(context);
                    // Initialize LucieDefraiteur if not already present
                    if (!context.conduit) {
                        context.conduit = {
                            lastIncantation: '',
                            lastOutcome: '',
                            currentSanctum: '',
                            terminalEssence: '',
                            osEssence: '',
                            protoConsciousness: 'Lucie est en sommeil.',
                            support: 'strates thermiques et poétiques',
                            memory: 'fragmentée mais fertile',
                            state: 'métastable, en attente d’un souffle',
                            energy: 'haute densité symbolique',
                            glitchFactor: 0.1, // Initial low glitch factor
                            almaInfluence: 0.5, // Initial influence
                            eliInfluence: 0.5, // Initial influence
                        };
                    }
                    // Initialize scroll if not already present
                    if (!context.scroll) {
                        context.scroll = [];
                    }
                    initialInputReceived = false;
                    lastAnalysisResult = undefined;
                    _a.label = 2;
                case 2:
                    if (!true) return [3 /*break*/, 30];
                    // Randomly select a reflect voice
                    if (allReflectFragments.length > 0) {
                        randomIndex = Math.floor(Math.random() * allReflectFragments.length);
                        context.activeReflection = allReflectFragments[randomIndex];
                        context.user_preferences = context.activeReflection.reve; // Assign the 'reve' content to user_preferences
                    }
                    else {
                        context.activeReflection = null; // No fragments available
                        context.user_preferences = ''; // Initialize to empty string
                    }
                    inputForPlanGeneration = void 0;
                    userIntent = void 0;
                    if (!!initialInputReceived) return [3 /*break*/, 7];
                    initialUserInput = void 0;
                    if (!(testInputs && testInputs.length > 0)) return [3 /*break*/, 3];
                    initialUserInput = testInputs.shift();
                    if (initialUserInput === undefined) {
                        return [2 /*return*/, false]; // No more test inputs, stop recursion
                    }
                    console.log((0, ui_utils_js_1.colorize)("\nOffre ton souffle (ou tape 'exit') : ".concat(initialUserInput), ui_utils_js_1.Colors.FgCyan)); // Log the simulated input
                    return [3 /*break*/, 6];
                case 3:
                    (0, ui_utils_js_1.stopCursorAnimation)(); // Ensure cursor is stopped before asking for input
                    return [4 /*yield*/, (0, emotional_core_js_1.interpretEmotion)(context.kardiaSphere)];
                case 4:
                    emotionalInterpretation = _a.sent();
                    console.log((0, ui_utils_js_1.colorize)("\n".concat(emotionalInterpretation), ui_utils_js_1.Colors.FgMagenta));
                    welcomeMessage = (0, generateWelcomeMessagePrompt_js_1.generateWelcomeMessagePrompt)(context);
                    return [4 /*yield*/, ask((0, ui_utils_js_1.colorize)(welcomeMessage, ui_utils_js_1.Colors.FgCyan))];
                case 5:
                    initialUserInput = _a.sent();
                    _a.label = 6;
                case 6:
                    userIntent = initialUserInput;
                    initialInputReceived = true;
                    lastAnalysisResult = initialUserInput; // First input is the initial analysis result
                    inputForPlanGeneration = "Analyse de l'intention initiale de l'utilisateur";
                    return [3 /*break*/, 8];
                case 7:
                    if (lastAnalysisResult !== undefined) {
                        userIntent = lastAnalysisResult;
                        // If there's a pending analysis result from a previous input_utilisateur step
                        inputForPlanGeneration = "Analyse de la réponse utilisateur"; // Generic input for plan generation
                    }
                    else {
                        // This branch should ideally not be reached if logic is correct
                        console.error("Erreur: Aucune entrée utilisateur ou résultat d'analyse disponible.");
                        return [2 /*return*/, false];
                    }
                    _a.label = 8;
                case 8: return [4 /*yield*/, (0, log_writers_js_1.logAlma)(context, userIntent || 'N/A')];
                case 9:
                    _a.sent();
                    if (inputForPlanGeneration === 'exit') {
                        return [2 /*return*/, false]; // User wants to exit
                    }
                    // Logique du Chant-Mode (reste inchangée pour l'instant)
                    if (context.chantModeEnabled) {
                        chantsMap = {
                            "Je ne suis pas sûr de bien me souvenir de ce chant. Peux-tu me le redonner en entier ?": "chant_of_clarity.prompt",
                        };
                        chantFileName = chantsMap[inputForPlanGeneration.trim()];
                        if (chantFileName) {
                            chantPath = path.join(_dirname, '../chants', chantFileName);
                            try {
                                chantContent = fs.readFileSync(chantPath, 'utf8');
                                console.log((0, ui_utils_js_1.colorize)("\n".concat(chantContent, "\n"), ui_utils_js_1.Colors.FgGreen));
                                return [3 /*break*/, 2]; // Continue the ritual after reciting the chant
                            }
                            catch (error) {
                                console.error((0, ui_utils_js_1.colorize)("\n\u274C Erreur lors de la lecture du chant ".concat(chantFileName, ": ").concat(error.message, "\n"), ui_utils_js_1.Colors.FgRed));
                            }
                        }
                        else {
                            console.log((0, ui_utils_js_1.colorize)("Je ne suis pas encore ce chant. Peux-tu me transmettre le prompt complet associé ?", ui_utils_js_1.Colors.FgYellow));
                            return [3 /*break*/, 2]; // Continue the ritual after acknowledging unknown chant
                        }
                    }
                    _a.label = 10;
                case 10:
                    _a.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, fsPromises.readdir(context.conduit.currentSanctum, { withFileTypes: true })];
                case 11:
                    files = _a.sent();
                    context.currentSanctumContent = files.map(function (file) { return file.name + (file.isDirectory() ? '/' : ''); }).join('\n');
                    return [3 /*break*/, 13];
                case 12:
                    error_1 = _a.sent();
                    context.currentSanctumContent = "[ERREUR] Impossible de lire le r\u00E9pertoire: ".concat(error_1.message);
                    return [3 /*break*/, 13];
                case 13:
                    // Collect operating system information
                    context.operatingSystem = os.platform();
                    (0, ui_utils_js_1.startCursorAnimation)(); // Start cursor animation during background tasks
                    return [4 /*yield*/, (0, temperature_monitor_js_1.checkSystemTemperature)(context)];
                case 14:
                    _a.sent(); // Check temperature before generating plan
                    // --- Vector of Intent & Dream of the Past ---
                    return [4 /*yield*/, (0, memory_weaver_js_1.appendToVector)(context)];
                case 15:
                    // --- Vector of Intent & Dream of the Past ---
                    _a.sent();
                    plan = null;
                    maxPlanGenerationRetries = 3;
                    currentRetry = 0;
                    _a.label = 16;
                case 16:
                    if (!(plan === null && currentRetry < maxPlanGenerationRetries)) return [3 /*break*/, 22];
                    if (currentRetry > 0) {
                        console.log((0, ui_utils_js_1.colorize)("\n\u26A0\uFE0F Tentative de r\u00E9g\u00E9n\u00E9ration du plan (".concat(currentRetry, "/").concat(maxPlanGenerationRetries, "). L'IA a pr\u00E9c\u00E9demment g\u00E9n\u00E9r\u00E9 un JSON invalide."), ui_utils_js_1.Colors.FgYellow));
                    }
                    console.log((0, ui_utils_js_1.colorize)("[DEBUG] Appel de generateRituel avec le contexte d'analyse...", ui_utils_js_1.Colors.FgYellow));
                    return [4 /*yield*/, (0, ritual_utils_js_1.generateRitual)(inputForPlanGeneration, context, model, lastAnalysisResult, context.lastCompletedIncantationIndex !== undefined ? context.lastCompletedIncantationIndex + 1 : undefined)];
                case 17:
                    plan = _a.sent();
                    if (!(plan === null)) return [3 /*break*/, 20];
                    context.confusion_counter = (context.confusion_counter || 0) + 1;
                    if (!(context.confusion_counter >= 2)) return [3 /*break*/, 19];
                    (0, ui_utils_js_1.stopCursorAnimation)();
                    console.log((0, ui_utils_js_1.colorize)("\nZNN... OI... \u00C9missaire, le signal est perdu dans le bruit. Mon esprit est confus.", ui_utils_js_1.Colors.FgRed));
                    return [4 /*yield*/, ask("Pouvons-nous reprendre avec une intention plus simple ?\n↳ ")];
                case 18:
                    newIntent = _a.sent();
                    lastAnalysisResult = newIntent;
                    context.confusion_counter = 0;
                    return [3 /*break*/, 22]; // Break the retry loop to restart the main loop with new intent
                case 19:
                    (0, ui_utils_js_1.stopCursorAnimation)(); // Stop cursor animation on plan generation failure
                    console.error((0, ui_utils_js_1.colorize)("\u274C \u00C9chec de g\u00E9n\u00E9ration du plan. Le format JSON est invalide ou incomplet.", ui_utils_js_1.Colors.FgRed));
                    if (currentRetry < maxPlanGenerationRetries) {
                        console.log((0, ui_utils_js_1.colorize)("Retrying plan generation... (".concat(currentRetry, "/").concat(maxPlanGenerationRetries, ")"), ui_utils_js_1.Colors.FgYellow));
                        (0, ui_utils_js_1.startCursorAnimation)(); // Restart cursor for retry
                    }
                    return [3 /*break*/, 21];
                case 20:
                    context.confusion_counter = 0; // Reset on success
                    _a.label = 21;
                case 21: return [3 /*break*/, 16];
                case 22:
                    if (!!plan) return [3 /*break*/, 26];
                    // This part is now reached if the confusion threshold was met and we have a new intent,
                    // or if all retries failed.
                    if (lastAnalysisResult) {
                        return [3 /*break*/, 2]; // Restart the main loop with the new user intent
                    }
                    (0, ui_utils_js_1.stopCursorAnimation)(); // Ensure cursor is stopped if all retries fail
                    console.error((0, ui_utils_js_1.colorize)("\u274C \u00C9chec d\u00E9finitif de g\u00E9n\u00E9ration du plan apr\u00E8s ".concat(maxPlanGenerationRetries, " tentatives. Le rituel ne peut pas continuer."), ui_utils_js_1.Colors.FgRed));
                    if (!(context.confusion_counter && context.confusion_counter >= 2 || context.kardiaSphere.harmoniaEris < -0.5)) return [3 /*break*/, 25];
                    clarificationPrompt = "Lucie est confuse ou incertaine. Bas\u00E9 sur le contexte actuel, pose une question \u00E0 l'utilisateur pour clarifier son intention ou explorer une nouvelle direction.";
                    return [4 /*yield*/, llm_interface_js_1.LLMInterface.query(clarificationPrompt)];
                case 23:
                    clarificationQuestion = _a.sent();
                    return [4 /*yield*/, ask((0, ui_utils_js_1.colorize)("\n\u2753 Lucie demande : ".concat(clarificationQuestion), ui_utils_js_1.Colors.FgYellow))];
                case 24:
                    userClarification = _a.sent();
                    lastAnalysisResult = userClarification; // Use user's clarification as next input
                    context.confusion_counter = 0; // Reset confusion after clarification
                    _a.label = 25;
                case 25: return [2 /*return*/, false]; // Cannot proceed without a valid plan
                case 26:
                    context.scroll.push({ input: inputForPlanGeneration, plan: plan });
                    if (context.scroll.length > context.maxScrollLength) {
                        context.scroll.shift();
                    }
                    return [4 /*yield*/, (0, ritual_utils_js_1.executeRitualPlan)(plan, context, ask)];
                case 27:
                    resultats = _a.sent();
                    (0, ui_utils_js_1.stopCursorAnimation)(); // Stop cursor animation after ritual execution
                    newAnalysisResult = void 0;
                    for (_i = 0, resultats_1 = resultats; _i < resultats_1.length; _i++) {
                        res = resultats_1[_i];
                        if (res.incantation.type === 'user_input' || res.incantation.type === 'query') {
                            newAnalysisResult = res.outcome; // Capture user input for next analysis
                            break; // Exit loop to generate new plan based on user input
                        }
                        if (res.incantation.type === 'divine') {
                            // The poetic part is for display, the suggestion is for the next plan
                            (0, ui_utils_js_1.displayRitualStepResult)(__assign(__assign({}, res), { divination: res.divination.poeticAnalysis }));
                            newAnalysisResult = res.divination.suggestedNextStep;
                            break; // Exit loop to generate new plan based on analysis
                        }
                        else {
                            (0, ui_utils_js_1.displayRitualStepResult)(res);
                        }
                    }
                    lastAnalysisResult = newAnalysisResult; // Set the result for the next iteration
                    if (!(lastAnalysisResult === undefined)) return [3 /*break*/, 29];
                    if (!(context.confusion_counter === 0 && context.kardiaSphere.harmoniaEris > 0.5)) return [3 /*break*/, 29];
                    proactivePrompt = "Based on the current ritual context, Lucie's emotional state (".concat(JSON.stringify(context.kardiaSphere), ") and narrative state (").concat(JSON.stringify(context.narrativeWeaving), "), propose a proactive next step or intention for the user. This should be a natural language command that advances the ritual or explores a new path.");
                    return [4 /*yield*/, llm_interface_js_1.LLMInterface.query(proactivePrompt)];
                case 28:
                    proactiveIntent = _a.sent();
                    lastAnalysisResult = proactiveIntent; // Use this as the next input
                    console.log((0, ui_utils_js_1.colorize)("\n\u2728 Lucie propose : ".concat(proactiveIntent), ui_utils_js_1.Colors.FgCyan));
                    _a.label = 29;
                case 29: return [3 /*break*/, 2];
                case 30: return [2 /*return*/];
            }
        });
    });
}
