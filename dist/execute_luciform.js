import * as fs from 'fs/promises';
import { invokeShadeOs } from './core/shade_os.js';
import { getPersonaResponse } from './core/personas.js';
// Fonction utilitaire pour exécuter des commandes shell
import { spawn } from 'child_process';
async function runShellCommand(command) {
    console.log(`[SHELL_EXEC] Preparing to execute command:`);
    console.log(`[COMMAND] ${command}`);
    return new Promise((resolve) => {
        const isWindows = process.platform === 'win32';
        const shell = isWindows ? 'powershell.exe' : '/bin/sh';
        const args = isWindows ? ['-Command', command] : ['-c', command];
        const child = spawn(shell, args, {
            stdio: ['pipe', 'pipe', 'pipe'],
            windowsVerbatimArguments: isWindows
        });
        let stdout = '';
        let stderr = '';
        child.stdout.on('data', (data) => {
            const output = data.toString();
            console.log(`[STDOUT] > ${output.trim()}`);
            stdout += output;
        });
        child.stderr.on('data', (data) => {
            const output = data.toString();
            console.error(`[STDERR] > ${output.trim()}`);
            stderr += output;
        });
        child.on('close', (code) => {
            console.log(`[SHELL_EXEC] Command finished with exit code: ${code}`);
            resolve({
                stdout,
                stderr,
                exitCode: code,
            });
        });
        child.on('error', (err) => {
            console.error('[FATAL] Failed to start subprocess.', err);
            stderr += err.message;
            resolve({
                stdout,
                stderr,
                exitCode: 1,
            });
        });
    });
}
async function executeOperation(operation) {
    switch (operation.type) {
        case 'shell_command':
            const shellOp = operation;
            console.log(`[INFO] Executing shell command:`);
            console.log(`[CMD] ${shellOp.command}`);
            if (shellOp.command.startsWith('@')) {
                const parts = shellOp.command.split(' ');
                const personaName = parts[0].substring(1);
                const message = parts.slice(1).join(' ');
                const personaResponse = await getPersonaResponse(personaName, message);
                console.log(`[PERSONA] ${personaName} says: ${personaResponse}`);
            }
            else {
                const result = await runShellCommand(shellOp.command);
                console.log(`[STDOUT] ${result.stdout}`);
                console.error(`[STDERR] ${result.stderr}`);
                if (result.exitCode !== 0) {
                    throw new Error(`Shell command failed with exit code ${result.exitCode}`);
                }
                console.log(`[SUCCESS] Shell command executed successfully.`);
            }
            break;
        case 'execute_typescript_file':
            const tsFileOp = operation;
            console.log(`Exécution du fichier TypeScript: ${tsFileOp.filePath}`);
            const tsNodeCommand = `ts-node ${tsFileOp.filePath}`;
            const tsResult = await runShellCommand(tsNodeCommand);
            console.log(`Stdout: ${tsResult.stdout}`);
            console.error(`Stderr: ${tsResult.stderr}`);
            if (tsResult.exitCode !== 0) {
                throw new Error(`L'exécution du fichier TypeScript a échoué avec le code ${tsResult.exitCode}`);
            }
            break;
        case 'create_file':
            const createOp = operation;
            if (typeof createOp.content !== 'string') {
                throw new TypeError(`Invalid 'create_file' operation: 'content' property must be a string.`);
            }
            console.log(`[INFO] Creating file: ${createOp.filePath}`);
            await fs.writeFile(createOp.filePath, createOp.content, 'utf-8');
            console.log(`[SUCCESS] File created: ${createOp.filePath}`);
            break;
        case 'promenade':
            const promenadeOp = operation;
            await process.stdout.write(`[PROMENADE] Starting promenade: ${promenadeOp.description}\n`);
            // Invoke shadeOs to generate a new luciform based on the promenade description
            const generatedLuciformContent = await invokeShadeOs(promenadeOp.description, 'lucie', null, null, null);
            if (generatedLuciformContent) {
                // For now, just log the generated luciform content. In a real scenario,
                // this would be executed or saved as a new ritual.
                console.log(`[PROMENADE] ShadeOs generated a new luciform:\n${generatedLuciformContent}`);
                // Optionally, save the generated luciform to a file
                await fs.writeFile('generated_promenade_ritual.luciform', generatedLuciformContent, 'utf-8');
                console.log("Generated promenade ritual saved to generated_promenade_ritual.luciform");
            }
            else {
                await process.stderr.write(`[ERROR] ShadeOs failed to generate a luciform for promenade: ${promenadeOp.description}\n`);
            }
            break;
        case 'ask_lucie':
            const askOp = operation;
            const rl = (await import('readline')).createInterface({
                input: process.stdin,
                output: process.stdout
            });
            const answer = await new Promise(resolve => {
                rl.question(askOp.question + ' ', resolve);
            });
            rl.close();
            // The answer is not used yet, but this completes the conversational loop.
            break;
        case 'message':
            const messageOp = operation;
            console.log(`[MESSAGE] ${messageOp.message}`);
            break;
        case 'ask_question':
            const askQuestionOp = operation;
            console.log(`[INFO] Asking persona ${askQuestionOp.persona} a question.`);
            const personaResponse = await getPersonaResponse(askQuestionOp.persona, askQuestionOp.question);
            console.log(`[PERSONA_RESPONSE] ${askQuestionOp.persona} says: ${personaResponse}`);
            break;
        default:
            throw new Error(`Unknown operation type: ${operation.type}`);
    }
}
export async function executeLuciform(luciformDocument, logRitual, getAIHelp, logFileName) {
    console.log(`[DEBUG] Starting executeLuciform for a LuciformDocument.`);
    let mogReport = "";
    try {
        mogReport = await getPersonaResponse('mog', `Analyze the following ritual:\n\n${JSON.stringify(luciformDocument, null, 2)}`);
        console.log(mogReport);
        await logRitual(`[MOG REPORT]\n${mogReport}`, logFileName);
    }
    catch (error) {
        console.error(`[ERROR] Failed to get MOG report: ${error.message}`);
        mogReport = `[MOG REPORT UNAVAILABLE] Error: ${error.message}`;
        await logRitual(mogReport, logFileName);
    }
    try {
        await logRitual(`[RITUAL START] Executing luciform.`, logFileName);
    }
    catch (logError) {
        process.stderr.write(`[ERROR] Failed to write RITUAL START to ritual.log: ${logError.message}\n`);
    }
    const totalSteps = luciformDocument.pas.length;
    let completedSteps = 0;
    for (let i = 0; i < totalSteps; i++) {
        const pas = luciformDocument.pas[i];
        const currentStep = i + 1;
        console.log(`[DEBUG] Processing step ${currentStep}/${totalSteps}`);
        try {
            await logRitual(`
[STEP ${currentStep} / ${totalSteps}] Processing...`, logFileName);
        }
        catch (logError) {
            process.stderr.write(`[ERROR] Failed to write STEP Processing log: ${logError.message}\n`);
        }
        try {
            if (pas.action) {
                let operation = null;
                switch (pas.action.type) {
                    case 'promenade':
                        const promenadeAction = pas.action;
                        operation = { type: 'promenade', description: promenadeAction.description };
                        console.log(`[DEBUG] Promenade operation detected: ${promenadeAction.description}`);
                        const generatedLuciformContent = await invokeShadeOs(promenadeAction.description, 'lucie', null, null, null);
                        if (generatedLuciformContent) {
                            console.log(`[DEBUG] ShadeOs generated luciform content. Length: ${generatedLuciformContent.length}`);
                            await fs.writeFile('generated_promenade_ritual.luciform', generatedLuciformContent, 'utf-8');
                            console.log("Generated promenade ritual saved to generated_promenade_ritual.luciform");
                        }
                        else {
                            console.error(`[ERROR] ShadeOs failed to generate a luciform for promenade: ${promenadeAction.description}`);
                        }
                        break;
                    case 'json_action':
                        const jsonAction = pas.action;
                        // Check if the operation is an ExecutableOperation
                        if (jsonAction.operation.type === 'shell_command' ||
                            jsonAction.operation.type === 'execute_typescript_file' ||
                            jsonAction.operation.type === 'create_file' ||
                            jsonAction.operation.type === 'promenade' ||
                            jsonAction.operation.type === 'ask_lucie' ||
                            jsonAction.operation.type === 'message' ||
                            jsonAction.operation.type === 'ask_question') {
                            operation = jsonAction.operation;
                            console.log(`[DEBUG] JSON action operation detected: ${operation.type}`);
                        }
                        else {
                            console.warn(`[WARN] Non-executable operation type found in JSON action: ${jsonAction.operation.type}`);
                        }
                        break;
                    case 'message':
                        const messageAction = pas.action;
                        operation = { type: 'message', message: messageAction.message };
                        console.log(`[DEBUG] Message operation detected: ${messageAction.message}`);
                        break;
                    default:
                        throw new Error(`Unknown action type: ${pas.action.type}`);
                }
                if (operation) {
                    console.log(`[DEBUG] Executing operation of type: ${operation.type}`);
                    try {
                        await logRitual(`[OPERATION] Found operation of type: ${operation.type}`, logFileName);
                    }
                    catch (logError) {
                        process.stderr.write(`[ERROR] Failed to write OPERATION log: ${logError.message}\n`);
                    }
                    await executeOperation(operation);
                    completedSteps++;
                    try {
                        await logRitual(`[STEP ${currentStep} / ${totalSteps}] Completed successfully.`, logFileName);
                    }
                    catch (logError) {
                        process.stderr.write(`[ERROR] Failed to write STEP Completed log: ${logError.message}\n`);
                    }
                }
                else {
                    console.warn(`[DEBUG] No operation to execute for step ${currentStep}`);
                    try {
                        await logRitual(`[WARN] No valid operation derived from action in step ${currentStep}`, logFileName);
                    }
                    catch (logError) {
                        process.stderr.write(`[ERROR] Failed to write WARN log: ${logError.message}\n`);
                    }
                }
            }
            else {
                console.warn(`[DEBUG] No action block found for step ${currentStep}`);
                try {
                    await logRitual(`[WARN] No action block found in step ${currentStep}`, logFileName);
                }
                catch (logError) {
                    process.stderr.write(`[ERROR] Failed to write WARN log: ${logError.message}\n`);
                }
            }
        }
        catch (error) {
            const errorMessage = `Error during step ${currentStep}: ${error.message}`;
            console.error(`[DEBUG] Error caught in step ${currentStep}: ${errorMessage}`);
            try {
                await logRitual(`[ERROR] ${errorMessage}`, logFileName);
            }
            catch (logError) {
                process.stderr.write(`[ERROR] Failed to write ERROR log: ${logError.message}\n`);
            }
            const finalReport = await getPersonaResponse('mog', `The ritual has failed. Please provide a final report based on the following status: ${JSON.stringify({ success: false, completedSteps, totalSteps, failedStep: currentStep, error: errorMessage }, null, 2)}`);
            console.log(finalReport);
            try {
                await logRitual(`[MOG FINAL REPORT]\n${finalReport}`);
            }
            catch (logError) {
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
    }
    catch (logError) {
        process.stderr.write(`[ERROR] Failed to write RITUAL SUCCESS log: ${logError.message}\n`);
    }
    const finalReport = await getPersonaResponse('mog', `The ritual has finished. Please provide a final report based on the following status: ${JSON.stringify({ success: true, completedSteps, totalSteps }, null, 2)}`);
    console.log(finalReport);
    try {
        await logRitual(`[MOG FINAL REPORT]\n${finalReport}`);
    }
    catch (logError) {
        process.stderr.write(`[ERROR] Failed to write MOG FINAL REPORT log: ${logError.message}\n`);
    }
    return {
        success: true,
        completedSteps,
        totalSteps,
    };
}
