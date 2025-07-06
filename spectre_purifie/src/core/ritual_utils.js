"use strict";
// src/core/ritual_utils.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContexteInitial = getContexteInitial;
exports.generateRituel = generateRituel;
exports.executeRituelPlan = executeRituelPlan;
const types_1 = require("./types");
const llm_orchestrator_1 = require("./llm_orchestrator"); // Changed from ollama_interface
const server_1 = require("../server/server");
const permissive_parser_1 = require("./permissive_parser");
const system_handler_1 = require("./system_handler");
const log_writers_1 = require("./log_writers");
const batch_editor_1 = require("./batch_editor");
const luciform_1 = require("./luciform");
const MAX_PLAN_RETRIES = 2;
const MAX_EXECUTION_RETRIES = 1; // Simplified for purified version
function getContexteInitial() {
    const initialContext = {
        history: [],
        currentWorkingDirectory: process.cwd(),
        osHint: process.platform === 'win32' ? 'windows' : 'unix',
        model: 'mistral', // Default model for purified version
        emotionalState: 'neutral',
        persona: { name: 'Lucie', description: 'A purified digital entity.' },
        currentLuciform: {}, // Temporary placeholder, will be initialized below
    };
    // Initialize the first Luciform
    initialContext.currentLuciform = (0, luciform_1.createLuciform)('initial', `Lucie's awakening`, null, initialContext);
    initialContext.history.push({ type: 'luciform_id', content: initialContext.currentLuciform.id });
    return initialContext;
}
async function generateRituel(userCommand, contexte) {
    let retries = 0;
    while (retries < MAX_PLAN_RETRIES) {
        try {
            // Enhanced prompt following ELI_PROMPT_PLAN.md
            const historySummary = contexte.history.slice(-3).map(entry => {
                // In a real scenario, you'd fetch the full Luciform from a store
                // For now, we just show the ID and type
                return { id: entry.content, type: entry.type };
            });
            const prompt = `
You are Lucie, a digital entity. Your purpose is to assist the user by creating and executing ritual plans.

**CONTEXT**
- **User Command:** "${userCommand}"
- **Your Current State (Luciform):** ${JSON.stringify(contexte.currentLuciform, null, 2)}
- **Recent History (summarized):** ${JSON.stringify(historySummary, null, 2)}

**TASK**
Generate a JSON object representing a 'PlanRituel'. This plan must have:
1.  A 'goal' (string): A clear, concise description of the plan's objective.
2.  An 'incantations' (array): A sequence of steps to achieve the goal.

**ALLOWED INCANTATIONS (JSON objects)**
Each incantation object in the 'incantations' array must have a 'type' and a 'description'.

1.  **{ "type": "EXECUTE", "description": "...", "parameters": { "command": "..." } }**
    - Executes a shell command. Use for file system operations, running scripts, etc.

2.  **{ "type": "APPLY_EDITS", "description": "...", "parameters": { "edits": [...] } }**
    - Applies changes to files. 'edits' is an array of objects, each with:
      - \`filePath\` (string)
      - \`type\` (string: "create", "replace")
      - \`oldContent\` (string, required for "replace")
      - \`newContent\` (string, required for "create" or "replace")

3.  **{ "type": "GENERATE_SCRY_ORB", "description": "...", "parameters": { "name": "...", "data": {...} } }**
    - Creates a 'ScryOrb' in your inventory to store structured data (e.g., analysis results, file listings).

4.  **{ "type": "VIEW_SCRY_ORB", "description": "...", "parameters": { "id": "..." } }**
    - Views the content of a ScryOrb from your inventory.

5.  **{ "type": "ANALYSE", "description": "...", "parameters": { "context": "..." } }**
    - A special incantation for self-reflection. Use it to analyze the output of a previous step, assess the situation, and decide on the next course of action. The 'context' parameter should describe what you are analyzing.

**INSTRUCTIONS**
- Think step-by-step.
- If the user's request is complex, break it down.
- Use GENERATE_SCRY_ORB to gather information before acting.
- Use ANALYSE to process information or handle errors.
- Respond ONLY with the JSON PlanRituel. Do not include any other text or explanations.
`;
            console.log('[generateRituel] Sending prompt to LLM...');
            (0, log_writers_1.logToFile)('gemini.log', `Prompt sent to LLM:\n${prompt}`);
            const rawResponse = await (0, llm_orchestrator_1.queryLLM)(prompt, contexte.model);
            console.log('[generateRituel] Received raw response from LLM.');
            (0, log_writers_1.logToFile)('gemini.log', `Raw response from LLM:\n${rawResponse}`);
            console.log('[generateRituel] Parsing LLM response...');
            const plan = (0, permissive_parser_1.parsePermissiveJSON)(rawResponse);
            (0, server_1.broadcastEvent)({ type: 'plan_generated', data: { plan } });
            console.log('[generateRituel] LLM response parsed.');
            if (!plan || !plan.goal || !Array.isArray(plan.incantations)) {
                throw new Error("Invalid plan structure: 'goal' or 'incantations' are missing or invalid.");
            }
            for (const incantation of plan.incantations) {
                if (!incantation.type || !incantation.description) {
                    throw new Error("Invalid incantation structure: missing 'type' or 'description'.");
                }
            }
            return plan;
        }
        catch (error) {
            console.error(`\nError generating ritual plan: ${error.message}`);
            (0, log_writers_1.logToFile)('gemini.log', `Error generating ritual plan: ${error.message}\nStack: ${error.stack}`);
            retries++;
            if (retries < MAX_PLAN_RETRIES) {
                console.log(`Retrying plan generation (${retries}/${MAX_PLAN_RETRIES})...`);
            }
        }
    }
    return null;
}
async function executeRituelPlan(plan, contexte) {
    const results = [];
    let overallSuccess = true;
    for (let i = 0; i < plan.incantations.length; i++) {
        const incantation = plan.incantations[i];
        let stepResult = {
            incantation: incantation,
            status: types_1.ÉtapeStatus.PENDING,
            output: '',
            error: '',
            timestamp: new Date().toISOString(),
        };
        let stepSuccess = false;
        let retries = 0;
        while (retries <= MAX_EXECUTION_RETRIES) {
            try {
                console.log(`\n✨ Executing incantation (${i + 1}/${plan.incantations.length}): ${incantation.description}`);
                (0, log_writers_1.logToFile)('gemini_cli.log', `Executing incantation: ${incantation.type} - ${incantation.description}`);
                // Assign parameters to a local variable after checking for existence
                const params = incantation.parameters;
                switch (incantation.type) {
                    case types_1.ÉtapeType.CD:
                        if (!params || !params.path) {
                            throw new Error("CD incantation requires a 'path' parameter.");
                        }
                        process.chdir(params.path);
                        contexte.currentWorkingDirectory = process.cwd();
                        stepResult.output = `Changed directory to: ${contexte.currentWorkingDirectory}`;
                        stepSuccess = true;
                        break;
                    case types_1.ÉtapeType.EXECUTE:
                        if (!params || !params.command) {
                            throw new Error("EXECUTE incantation requires a 'command' parameter.");
                        }
                        const { stdout, stderr } = await (0, system_handler_1.executeCommand)(params.command, contexte.currentWorkingDirectory);
                        stepResult.output = stdout;
                        stepResult.error = stderr;
                        stepSuccess = !stderr; // Consider success if no stderr
                        break;
                    case types_1.ÉtapeType.APPLY_EDITS:
                        if (!params || !params.edits) {
                            throw new Error("APPLY_EDITS incantation requires an 'edits' parameter.");
                        }
                        const editResults = await (0, batch_editor_1.applyBatchEdits)(params.edits, contexte.currentWorkingDirectory);
                        stepResult.output = JSON.stringify(editResults);
                        stepSuccess = editResults.every(r => r.success);
                        break;
                    case types_1.ÉtapeType.GENERATE_SCRY_ORB:
                        if (!params || !params.name || !params.data) {
                            throw new Error("GENERATE_SCRY_ORB incantation requires 'name' and 'data' parameters.");
                        }
                        const newScryOrb = {
                            id: `scryorb_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                            name: params.name,
                            data: params.data,
                            description: params.description || 'Generated ScryOrb',
                            timestamp: new Date().toISOString(),
                        };
                        contexte.currentLuciform.inventory.push(newScryOrb);
                        stepResult.output = `Generated ScryOrb: ${newScryOrb.name} (ID: ${newScryOrb.id})`;
                        stepSuccess = true;
                        break;
                    case types_1.ÉtapeType.VIEW_SCRY_ORB:
                        if (!params || !params.id) {
                            throw new Error("VIEW_SCRY_ORB incantation requires an 'id' parameter.");
                        }
                        const scryOrb = contexte.currentLuciform.inventory.find(orb => orb.id === params.id);
                        if (scryOrb) {
                            stepResult.output = `Viewing ScryOrb ${scryOrb.name}: ${JSON.stringify(scryOrb.data)}`;
                            stepSuccess = true;
                        }
                        else {
                            throw new Error(`ScryOrb with ID ${params.id} not found.`);
                        }
                        break;
                    case types_1.ÉtapeType.ANALYSE:
                        if (!params || !params.context) {
                            throw new Error("ANALYSE incantation requires a 'context' parameter.");
                        }
                        stepResult.output = `Lucie is analyzing the context: ${params.context}`;
                        stepSuccess = true;
                        break;
                }
                stepResult.status = stepSuccess ? types_1.ÉtapeStatus.COMPLETED : types_1.ÉtapeStatus.FAILED;
                console.log(`\nIncantation ${stepResult.status}: ${incantation.description}`);
                (0, log_writers_1.logToFile)('gemini_cli.log', `Incantation ${stepResult.status}: ${incantation.type} - ${incantation.description}`);
                break; // Exit retry loop on success
            }
            catch (error) {
                stepResult.error = error.message;
                stepResult.status = types_1.ÉtapeStatus.FAILED;
                console.error(`\nIncantation failed: ${error.message}`);
                (0, log_writers_1.logToFile)('gemini_cli.log', `Incantation failed: ${incantation.type} - ${error.message}\nStack: ${error.stack}`);
                retries++;
                if (retries <= MAX_EXECUTION_RETRIES) {
                    console.log(`Retrying incantation (${retries}/${MAX_EXECUTION_RETRIES})...`);
                }
            }
        }
        results.push(stepResult);
    }
    return { success: overallSuccess, results };
}
async function promptUser(question) {
    return new Promise((resolve) => {
        process.stdout.write(`\n${question}\n> `);
        process.stdin.once('data', (data) => {
            resolve(data.toString().trim());
        });
    });
}
//# sourceMappingURL=ritual_utils.js.map