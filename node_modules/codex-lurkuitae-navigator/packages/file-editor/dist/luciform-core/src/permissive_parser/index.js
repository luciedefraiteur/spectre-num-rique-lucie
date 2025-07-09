"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const tokenizer_js_1 = require("./tokenizer.js");
const parser_js_1 = require("./parser.js");
// --- Feature flag: Enable Structured Action Output ---
const STRUCTURED_ACTIONS = process.env.STRUCTURED_ACTIONS === '1';
/**
 * Adapts a loosely structured object from the LLM into a strict PlanRituel.
 * This prevents crashes when the LLM hallucinates a different schema.
 * @param data The raw parsed data from the LLM.
 * @returns A valid PlanRituel object or null if adaptation fails.
 */
function adaptToPlanRituel(data) {
    if (!data || typeof data !== 'object') {
        return null;
    }
    // Case 1: It's already a valid RitualPlan (or close enough).
    if (data.hasOwnProperty('incantations') && Array.isArray(data.incantations)) {
        return data;
    }
    // Case 2: It's an array of steps (the hallucinated format) OR an array-like object from the permissive parser.
    let potentialArray = null;
    if (Array.isArray(data)) {
        potentialArray = data;
    }
    else if (typeof data === 'object' && data !== null && data.hasOwnProperty('0')) {
        // It's likely an array-like object, e.g. { '0': {...}, '1': {...} }
        potentialArray = Object.values(data);
    }
    if (potentialArray) {
        const newIncantations = potentialArray.map((item) => {
            if (!item || typeof item !== 'object')
                return null;
            // Attempt to map the hallucinated keys to our canonical keys.
            const type = item.type || item.step || item.action;
            const invocation = item.invocation || item.command || item.description;
            if (!type || !invocation)
                return null;
            return {
                type: type,
                invocation: invocation,
            };
        }).filter((e) => e !== null);
        if (newIncantations.length > 0) {
            return {
                title: 'Adapted Plan',
                goal: 'Adapt from a loosely structured object',
                incantations: newIncantations,
                complexity: 'simple', // Default complexity
                sequence: (potentialArray[0] && potentialArray[0].sequence) || 0, // Try to get sequence from first step, or default to 0
            };
        }
    }
    // Case 3: It's a single step object, not wrapped in a plan.
    if (data.hasOwnProperty('type') && data.hasOwnProperty('invocation')) {
        const incantation = {
            type: data.type,
            invocation: data.invocation,
        };
        return {
            title: 'Adapted Single Step Plan',
            goal: 'Adapt from a single step object',
            incantations: [incantation],
            complexity: data.complexity || 'simple',
            sequence: data.sequence || 0,
        };
    }
    return null; // If it's an unknown object format
}
// --- New Action-based parse (if feature flag enabled) ---
function parseActions(text) {
    const tokens = tokenizer_js_1.Tokenizer.tokenize(text);
    // This assumes Parser.parse emits an object or array, not yet as Action objects
    const parser = new parser_js_1.Parser(tokens);
    let result;
    try {
        result = parser.parse();
    }
    catch (e) {
        // Completely unparseable: return UnknownAction
        return [{ type: 'UnknownAction', raw: text }];
    }
    // Try to emit array of structured Actions
    if (Array.isArray(result)) {
        return result.map(x => toAction(x, text));
    }
    else if (typeof result === 'object' && result !== null) {
        // Could be a single action or step; wrap in array
        return [toAction(result, text)];
    }
    else {
        // Fallback: unknown output
        return [{ type: 'UnknownAction', raw: text }];
    }
}
function toAction(candidate, raw) {
    if (candidate && candidate.type) {
        return { ...candidate };
    }
    // Fallback to UnknownAction for invalid actions
    return { type: 'UnknownAction', raw };
}
const parse = (text) => {
    if (STRUCTURED_ACTIONS) {
        return parseActions(text);
    }
    try {
        const tokens = tokenizer_js_1.Tokenizer.tokenize(text);
        const parser = new parser_js_1.Parser(tokens);
        const result = parser.parse();
        const adaptedResult = adaptToPlanRituel(result);
        if (!adaptedResult) {
            console.error(`[PARSER ADAPTER] Impossible d'adapter la sortie du LLM en RitualPlan valide. Sortie brute:`, JSON.stringify(result));
        }
        return adaptedResult;
    }
    catch (ex) {
        if (typeof ex.type === 'number') {
            throw ex;
        }
        else {
            throw ex;
        }
    }
};
exports.parse = parse;
//# sourceMappingURL=index.js.map