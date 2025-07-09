import * as fs from 'fs/promises';
import { parseLuciformDocument } from './luciform_parser/parser.js';

import { PromenadeActionNode, JsonActionNode, MessageActionNode, HelpRequestActionNode } from './luciform_parser/types.js';
import { logRitual } from './log_writers.js';
import { getPersonaResponse } from './personas.js';
import { executeOperation } from './executor/operation_executor.js';

export interface RitualExecutionStatus {
    success: boolean;
    completedSteps: number;
    totalSteps: number;
    failedStep?: number;
    error?: string;
}



/*
Initialisation de ritualContext commentée pour éviter les duplications.
*/
        console.log("[DEBUG] Getting MOG report...");
        mogReport = await getPersonaResponse('mog', `Analyze the following ritual:\n\n${content}`, ritualContext, undefined);
        console.log(`[DEBUG] MOG Report: ${mogReport}`);
        await logRitual(`[MOG REPORT]\n${mogReport}`);
        console.log("[DEBUG] MOG report successful.");
    } catch (error: any) {
        console.error(`[ERROR] Failed to get MOG report: ${error.message}`);
        mogReport = `[MOG REPORT UNAVAILABLE] Error: ${error.message}`;
        await logRitual(mogReport);
    }

    try {
        await logRitual(`[RITUAL START] Executing luciform: ${filePath}`);
    } catch (logError: any) {
        process.stderr.write(`[ERROR] Failed to write RITUAL START to ritual.log: ${logError.message}\n`);
    }

    const luciformDocument = parseLuciformDocument(content, logRitual);
    const totalSteps = luciformDocument.pas.length;
    let completedSteps = 0;

    for (let i = 0; i < totalSteps; i++) {
        const pas = luciformDocument.pas[i];
        const currentStep = i + 1;
        console.log(`[DEBUG] Processing step ${currentStep}/${totalSteps}`);
        try {
            await logRitual(`\n[STEP ${currentStep} / ${totalSteps}] Processing...`);
        } catch (logError: any) {
            process.stderr.write(`[ERROR] Failed to write STEP Processing log to ritual.log: ${logError.message}\n`);
        }

        try {
            if (pas.action) {
                let operation: Operation | null = null;
                switch (pas.action.type) {
                    case 'json_action':
                        const jsonAction = pas.action as JsonActionNode;
                        if (jsonAction.operation.type === 'shell_command' ||
                            jsonAction.operation.type === 'execute_typescript_file' ||
                            jsonAction.operation.type === 'create_file' ||
                            jsonAction.operation.type === 'promenade' ||
                            jsonAction.operation.type === 'ask_lucie' ||
                            jsonAction.operation.type === 'message' ||
                            jsonAction.operation.type === 'ask_persona') { // Added ask_persona here
                            operation = jsonAction.operation as Operation;
                            console.log(`[DEBUG] JSON action operation detected: ${operation!.type}`);
                        } else {
                            console.warn(`[WARN] Non-executable operation type found in JSON action: ${jsonAction.operation.type}`);
                        }
                        break;
                    case 'help_request':
                        const helpRequestOp = pas.action as HelpRequestActionNode;
                        console.warn(`[WARN] Parser requested help: ${helpRequestOp.reason}. Raw content: ${helpRequestOp.rawContent}`);
                        const syngrapheResponse = await getPersonaResponse('Syngraphe', `The parser encountered an issue: ${helpRequestOp.reason}. The problematic content was: ${helpRequestOp.rawContent}. Please provide guidance on how to correct this Luciform action.`, ritualContext, undefined);
                        console.log(`[SYNGAPHE] Syngraphe says: ${syngrapheResponse}`);
                        break;
                    default:
                        throw new Error(`Unknown operation type: ${(pas.action as any).type}`);
                }

                if (operation) {
                    console.log(`[DEBUG] Executing operation of type: ${operation.type}`);
                    try {
                        await logRitual(`[OPERATION] Found operation of type: ${operation.type}`);
                    } catch (logError: any) {
                        process.stderr.write(`[ERROR] Failed to write OPERATION log: ${logError.message}\n`);
                    }
                    await executeOperation(operation as ExecutableOperation);
                    completedSteps++;
                    try {
                        await logRitual(`[STEP ${currentStep} / ${totalSteps}] Completed successfully.`);
                    } catch (logError: any) {
                        process.stderr.write(`[ERROR] Failed to write STEP Completed log: ${logError.message}\n`);
                    }
                } else {
                    console.warn(`[DEBUG] No operation to execute for step ${currentStep}`);
                    try {
                        await logRitual(`[WARN] No valid operation derived from action in step ${currentStep}`);
                    } catch (logError: any) {
                        process.stderr.write(`[ERROR] Failed to write WARN log: ${logError.message}\n`);
                    }
                }
            } else {
                console.warn(`[DEBUG] No action block found for step ${currentStep}`);
                try {
                    await logRitual(`[WARN] No action block found in step ${currentStep}`);
                } catch (logError: any) {
                    process.stderr.write(`[ERROR] Failed to write WARN log: ${logError.message}\n`);
                }
            }
        } catch (error: any) {
            const errorMessage = `Error during step ${currentStep}: ${error.message}`;
            console.error(`[DEBUG] Error caught in step ${currentStep}: ${errorMessage}`);
            try {
                await logRitual(`[ERROR] ${errorMessage}`);
            } catch (logError: any) {
                process.stderr.write(`[ERROR] Failed to write ERROR log: ${logError.message}\n`);
            }
            const finalReport = await getPersonaResponse('mog', `The ritual has failed. Please provide a final report based on the following status: ${JSON.stringify({ success: false, completedSteps, totalSteps, failedStep: currentStep, error: errorMessage }, null, 2)}`, ritualContext, undefined);
            console.log(finalReport);
            try {
                await logRitual(`[MOG FINAL REPORT]\n${finalReport}`);
            } catch (logError: any) {
                process.stderr.write(`[ERROR] Failed to write MOG FINAL REPORT log: ${logError.message}\n`);
            }
            return {
                success: false,
                completedSteps,
                totalSteps,
                failedStep: currentStep,
                error: errorMessage,
            };
        }
    }

    console.log(`[DEBUG] All steps processed. Finalizing ritual.`);
    try {
        await logRitual(`\n[RITUAL SUCCESS] All ${totalSteps} steps completed successfully.`);
    } catch (logError: any) {
        process.stderr.write(`[ERROR] Failed to write RITUAL SUCCESS log: ${logError.message}\n`);
    }
    const finalReport = await getPersonaResponse('mog', `The ritual has finished. Please provide a final report based on the following status: ${JSON.stringify({ success: true, completedSteps, totalSteps }, null, 2)}`, ritualContext, undefined);
    console.log(finalReport);
    try {
        await logRitual(`[MOG FINAL REPORT]\n${finalReport}`);
    } catch (logError: any) {
        process.stderr.write(`[ERROR] Failed to write MOG FINAL REPORT log: ${logError.message}\n`);
    }
    return {
        success: true,
        completedSteps,
        totalSteps,
    };
}

if (process.argv[2]) {
    executeLuciform(process.argv[2]).then(console.log).catch(console.error);
}