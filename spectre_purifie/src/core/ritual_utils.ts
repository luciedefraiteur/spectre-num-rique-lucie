// src/core/ritual_utils.ts

import { RituelContext, PlanRituel, Étape, ÉtapeType, ÉtapeStatus, ÉtapeResult } from './types';
import { queryLLM } from './llm_orchestrator'; // Changed from ollama_interface
import { parsePermissiveJSON } from './permissive_parser';
import { executeCommand } from './system_handler';
import { logToFile } from './log_writers';
import { applyBatchEdits } from './batch_editor';
import { createLuciform } from './luciform';

const MAX_PLAN_RETRIES = 2;
const MAX_EXECUTION_RETRIES = 1; // Simplified for purified version

export function getContexteInitial(): RituelContext {
    const initialContext: RituelContext = {
        history: [],
        currentWorkingDirectory: process.cwd(),
        osHint: process.platform === 'win32' ? 'windows' : 'unix',
        model: 'mistral', // Default model for purified version
        emotionalState: 'neutral',
        persona: { name: 'Lucie', description: 'A purified digital entity.' },
        currentLuciform: {} as any, // Temporary placeholder, will be initialized below
    };
    // Initialize the first Luciform
    initialContext.currentLuciform = createLuciform('initial', `Lucie's awakening`, null, initialContext);
    initialContext.history.push({ type: 'luciform_id', content: initialContext.currentLuciform.id });
    return initialContext;
}

export async function generateRituel(userCommand: string, contexte: RituelContext): Promise<PlanRituel | null> {
    let retries = 0;
    while (retries < MAX_PLAN_RETRIES) {
        try {
            // Enriched prompt generation for purified version, including currentLuciform
            const prompt = `You are Lucie, a digital entity. Your goal is to fulfill the user's command by generating a ritual plan.\n` +
                           `User command: ${userCommand}\n` +
                           `Lucie's current state (Luciform): ${JSON.stringify(contexte.currentLuciform, null, 2)}\n` +
                           `Recent history (last 3 Luciform IDs): ${JSON.stringify(contexte.history.slice(-3))}\n\n` +
                           `Based on the user's command and Lucie's current state, generate a JSON plan with a 'goal' and an array of 'incantations'. ` +
                           `Each incantation must have a 'type' (e.g., EXECUTE, CD, APPLY_EDITS, GENERATE_SCRY_ORB, VIEW_SCRY_ORB) and a 'description'. ` +
                           `\n` +
                           `If EXECUTE, include a 'command' parameter. ` +
                           `If APPLY_EDITS, include an 'edits' parameter which is an array of { filePath: string, type: 'replace' | 'create', oldContent?: string, newContent?: string } objects. ` +
                           `If GENERATE_SCRY_ORB, include 'name' and 'data' parameters (e.g., { name: "SystemStatus", data: { cwd: "/", files: [] } }). ` +
                           `If VIEW_SCRY_ORB, include an 'id' parameter (e.g., { id: "scryorb_123" }). ` +
                           `\n` +
                           `Consider generating a GENERATE_SCRY_ORB incantation if you need to inspect the environment or internal state before making a decision, or to report on a completed task.`;
            
            logToFile('gemini.log', `Prompt sent to LLM:\n${prompt}`);
            const rawResponse = await queryLLM(prompt, contexte.model); // Changed to queryLLM
            logToFile('gemini.log', `Raw response from LLM:\n${rawResponse}`);

            const plan = parsePermissiveJSON<PlanRituel>(rawResponse);

            if (!plan || !plan.goal || !Array.isArray(plan.incantations) || plan.incantations.length === 0) {
                throw new Error("Invalid plan structure received from LLM.");
            }
            for (const incantation of plan.incantations) {
                if (!incantation.type || !incantation.description) {
                    throw new Error("Invalid incantation structure: missing type or description.");
                }
            }
            return plan;
        } catch (error: any) {
            console.error(`\nError generating ritual plan: ${error.message}`);
            logToFile('gemini.log', `Error generating ritual plan: ${error.message}\nStack: ${error.stack}`);
            retries++;
            if (retries < MAX_PLAN_RETRIES) {
                console.log(`Retrying plan generation (${retries}/${MAX_PLAN_RETRIES})...`);
            }
        }
    }
    return null;
}

export async function executeRituelPlan(plan: PlanRituel, contexte: RituelContext): Promise<{ success: boolean; results: ÉtapeResult[] }> {
    const results: ÉtapeResult[] = [];
    let overallSuccess = true;

    for (let i = 0; i < plan.incantations.length; i++) {
        const incantation = plan.incantations[i];
        let stepResult: ÉtapeResult = {
            incantation: incantation,
            status: ÉtapeStatus.PENDING,
            output: '',
            error: '',
            timestamp: new Date().toISOString(),
        };

        let stepSuccess = false;
        let retries = 0;

        while (retries <= MAX_EXECUTION_RETRIES) {
            try {
                console.log(`\n✨ Executing incantation (${i + 1}/${plan.incantations.length}): ${incantation.description}`);
                logToFile('gemini_cli.log', `Executing incantation: ${incantation.type} - ${incantation.description}`);

                // Assign parameters to a local variable after checking for existence
                const params = incantation.parameters;

                switch (incantation.type) {
                    case ÉtapeType.CD:
                        if (!params || !params.path) {
                            throw new Error("CD incantation requires a 'path' parameter.");
                        }
                        process.chdir(params.path);
                        contexte.currentWorkingDirectory = process.cwd();
                        stepResult.output = `Changed directory to: ${contexte.currentWorkingDirectory}`;
                        stepSuccess = true;
                        break;
                    case ÉtapeType.EXECUTE:
                        if (!params || !params.command) {
                            throw new Error("EXECUTE incantation requires a 'command' parameter.");
                        }
                        const { stdout, stderr } = await executeCommand(params.command, contexte.currentWorkingDirectory);
                        stepResult.output = stdout;
                        stepResult.error = stderr;
                        stepSuccess = !stderr; // Consider success if no stderr
                        break;
                    case ÉtapeType.APPLY_EDITS:
                        if (!params || !params.edits) {
                            throw new Error("APPLY_EDITS incantation requires an 'edits' parameter.");
                        }
                        const editResults = await applyBatchEdits(params.edits, contexte.currentWorkingDirectory);
                        stepResult.output = JSON.stringify(editResults);
                        stepSuccess = editResults.every(r => r.success);
                        break;
                    case ÉtapeType.GENERATE_SCRY_ORB:
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
                    case ÉtapeType.VIEW_SCRY_ORB:
                        if (!params || !params.id) {
                            throw new Error("VIEW_SCRY_ORB incantation requires an 'id' parameter.");
                        }
                        const scryOrb = contexte.currentLuciform.inventory.find(orb => orb.id === params.id);
                        if (scryOrb) {
                            stepResult.output = `Viewing ScryOrb ${scryOrb.name}: ${JSON.stringify(scryOrb.data)}`;
                            stepSuccess = true;
                        } else {
                            throw new Error(`ScryOrb with ID ${params.id} not found.`);
                        }
                        break;
                    default:
                        throw new Error(`Unknown or unimplemented incantation type in purified spectre: ${incantation.type}`);
                }

                stepResult.status = stepSuccess ? ÉtapeStatus.COMPLETED : ÉtapeStatus.FAILED;
                console.log(`\nIncantation ${stepResult.status}: ${incantation.description}`);
                logToFile('gemini_cli.log', `Incantation ${stepResult.status}: ${incantation.type} - ${incantation.description}`);
                break; // Exit retry loop on success
            } catch (error: any) {
                stepResult.error = error.message;
                stepResult.status = ÉtapeStatus.FAILED;
                console.error(`\nIncantation failed: ${error.message}`);
                logToFile('gemini_cli.log', `Incantation failed: ${incantation.type} - ${error.message}\nStack: ${error.stack}`);
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

async function promptUser(question: string): Promise<string> {
    return new Promise((resolve) => {
        process.stdout.write(`\n${question}\n> `);
        process.stdin.once('data', (data) => {
            resolve(data.toString().trim());
        });
    });
}
