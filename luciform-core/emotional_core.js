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
exports.calculateEmotion = calculateEmotion;
exports.interpretEmotion = interpretEmotion;
exports.journeyTowards = journeyTowards;
var llm_interface_js_1 = require("./llm_interface.js");
/**
 * Calculates the current emotional state based on the ritual context.
 * This is a placeholder implementation; a real version would use a more complex, semi-random function.
 * @param context The current ritual context.
 * @returns The current emotional state.
 */
function calculateEmotion(context) {
    var conduit = context.conduit, step_results_history = context.step_results_history;
    var now = Date.now();
    var agapePhobos = Math.sin(now / 100000) * conduit.almaInfluence;
    var logosPathos = Math.cos(now / 70000) * conduit.eliInfluence;
    var harmoniaEris = (Math.sin(now / 120000) + Math.cos(now / 50000)) / 2 * conduit.glitchFactor;
    // Influence emotion based on last step result
    var lastStep = step_results_history.at(-1);
    if (lastStep) {
        if (lastStep.success === true) {
            harmoniaEris = Math.min(1, harmoniaEris + 0.1); // Increase harmony on success
            agapePhobos = Math.max(-1, agapePhobos - 0.05); // Decrease fear
        }
        else if (lastStep.success === false) {
            harmoniaEris = Math.max(-1, harmoniaEris - 0.1); // Decrease harmony on failure
            agapePhobos = Math.min(1, agapePhobos + 0.05); // Increase fear
        }
    }
    return {
        agapePhobos: Math.max(-1, Math.min(1, agapePhobos)),
        logosPathos: Math.max(-1, Math.min(1, logosPathos)),
        harmoniaEris: Math.max(-1, Math.min(1, harmoniaEris)),
    };
}
/**
 * Uses the LLM to interpret the emotional state into a poetic description.
 * @param state The current emotional state.
 * @returns A poetic interpretation of the emotional state.
 */
function interpretEmotion(state) {
    return __awaiter(this, void 0, void 0, function () {
        var prompt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prompt = "The current emotional state is defined by three axes:\n- Agape/Phobos (Love/Fear): ".concat(state.agapePhobos.toFixed(3), "\n- Logos/Pathos (Reason/Passion): ").concat(state.logosPathos.toFixed(3), "\n- Harmonia/Eris (Harmony/Discord): ").concat(state.harmoniaEris.toFixed(3), "\n\nTranslate these coordinates into a short, poetic, and evocative description of this emotional state.");
                    return [4 /*yield*/, llm_interface_js_1.LLMInterface.query(prompt)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * Calculates a single step on the journey towards a target emotional state.
 * @param currentState The current emotional state.
 * @param targetState The desired emotional state.
 * @returns The new emotional state after one step.
 */
function journeyTowards(currentState, targetState) {
    var step = 0.1; // The "speed" of emotional change.
    var newAgapePhobos = currentState.agapePhobos + (targetState.agapePhobos - currentState.agapePhobos) * step;
    var newLogosPathos = currentState.logosPathos + (targetState.logosPathos - currentState.logosPathos) * step;
    var newHarmoniaEris = currentState.harmoniaEris + (targetState.harmoniaEris - currentState.harmoniaEris) * step;
    return {
        agapePhobos: newAgapePhobos,
        logosPathos: newLogosPathos,
        harmoniaEris: newHarmoniaEris,
    };
}
