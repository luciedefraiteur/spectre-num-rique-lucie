console.log('[CANARY] The ritual executor is being invoked.');
import * as fs from 'fs/promises';
import {exec} from 'child_process';
import * as path from 'path';
import {Operation, ShellCommand, ExecuteTypescriptFile, CreateFile, Promenade, AskLucie} from './core/types.js';
import {parseLuciformAction} from './core/luciform_parser.js';
import {invokeShadeOs} from './core/shade_os.js';
import {logRitual} from './core/log_writers.js';
import {detectedShell} from './core/utils/osHint.js';
import {Persona, getPersonaResponse} from './core/personas.js';

// Fonction utilitaire pour exécuter des commandes shell
import {spawn} from 'child_process';

async function runShellCommand(command: string): Promise<{stdout: string; stderr: string; exitCode: number | null}>
{
    console.log(`[SHELL_EXEC] Preparing to execute command:`);
    console.log(`[COMMAND] ${ command }`);

    return new Promise((resolve) =>
    {
        const isWindows = process.platform === 'win32';
        const shell = isWindows ? 'powershell.exe' : '/bin/sh';
        const args = isWindows ? ['-Command', command] : ['-c', command];

        const child = spawn(shell, args, {
            stdio: ['pipe', 'pipe', 'pipe'],
            windowsVerbatimArguments: isWindows
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) =>
        {
            const output = data.toString();
            console.log(`[STDOUT] > ${ output.trim() }`);
            stdout += output;
        });

        child.stderr.on('data', (data) =>
        {
            const output = data.toString();
            console.error(`[STDERR] > ${ output.trim() }`);
            stderr += output;
        });

        child.on('close', (code) =>
        {
            console.log(`[SHELL_EXEC] Command finished with exit code: ${ code }`);
            resolve({
                stdout,
                stderr,
                exitCode: code,
            });
        });

        child.on('error', (err) =>
        {
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

async function executeOperation(operation: Operation): Promise<void>
{
    switch(operation.type)
    {
        case 'shell_command':
            const shellOp = operation as ShellCommand;
            console.log(`[INFO] Executing shell command:`);
            console.log(`[CMD] ${ shellOp.command }`);
            if(shellOp.command.startsWith('@'))
            {
                const parts = shellOp.command.split(' ');
                const personaName = parts[0].substring(1) as Persona;
                const message = parts.slice(1).join(' ');
                const personaResponse = await getPersonaResponse(personaName, message);
                console.log(`[PERSONA] ${ personaName } says: ${ personaResponse }`);
            } else
            {
                const result = await runShellCommand(shellOp.command);
                console.log(`[STDOUT] ${ result.stdout }`);
                console.error(`[STDERR] ${ result.stderr }`);
                if(result.exitCode !== 0)
                {
                    throw new Error(`Shell command failed with exit code ${ result.exitCode }`);
                }
                console.log(`[SUCCESS] Shell command executed successfully.`);
            }
            break;
        case 'execute_typescript_file':
            const tsFileOp = operation as ExecuteTypescriptFile;
            console.log(`Exécution du fichier TypeScript: ${ tsFileOp.filePath }`);
            const tsNodeCommand = `ts-node ${ tsFileOp.filePath }`;
            const tsResult = await runShellCommand(tsNodeCommand);
            console.log(`Stdout: ${ tsResult.stdout }`);
            console.error(`Stderr: ${ tsResult.stderr }`);
            if(tsResult.exitCode !== 0)
            {
                throw new Error(`L'exécution du fichier TypeScript a échoué avec le code ${ tsResult.exitCode }`);
            }
            break;
        case 'create_file':
            const createOp = operation as CreateFile;
            console.log(`[INFO] Creating file: ${ createOp.filePath }`);
            await fs.writeFile(createOp.filePath, createOp.content, 'utf-8');
            console.log(`[SUCCESS] File created: ${ createOp.filePath }`);
            break;
        case 'promenade':
            const promenadeOp = operation as Promenade;
            await logRitual(`[PROMENADE] Starting promenade: ${ promenadeOp.description }`);
            const newRitual = await invokeShadeOs(promenadeOp.description, 'lucie', null, null, null);
            if(newRitual)
            {
                await logRitual(`[PROMENADE] Generated sub-ritual:\n--- SUB-RITUAL START ---\n${ newRitual }\n--- SUB-RITUAL END ---`);
                const tempDir = './temp';
                await fs.mkdir(tempDir, {recursive: true});
                const tempFilePath = path.join(tempDir, `__promenade_ritual_${ Date.now() }.luciform`);
                await fs.writeFile(tempFilePath, newRitual, 'utf-8');
                // Execute the new ritual in a separate process to ensure it has its own context.
                const result = await runShellCommand(`node dist/execute_luciform.js ${ tempFilePath }`);
                if(result.exitCode !== 0)
                {
                    await logRitual(`[ERROR] Promenade sub-ritual failed with exit code ${ result.exitCode }.`);
                } else
                {
                    await logRitual(`[PROMENADE] Sub-ritual executed successfully. The result of the promenade is the output of the sub-ritual.`);
                    // The output of the sub-ritual is the result of the promenade.
                    // We will assume for now that the sub-ritual creates a file.
                }
                await fs.unlink(tempFilePath);
            } else
            {
                await logRitual('[ERROR] shadeOs failed to generate a sub-ritual for the promenade.');
            }
            break;
        case 'ask_lucie':
            const askOp = operation as AskLucie;
            const rl = (await import('readline')).createInterface({
                input: process.stdin,
                output: process.stdout
            });
            const answer = await new Promise<string>(resolve =>
            {
                rl.question(askOp.question + ' ', resolve);
            });
            rl.close();
            // The answer is not used yet, but this completes the conversational loop.
            break;
        default:
            console.warn(`Type d'opération non géré: ${ operation.type }`);
            break;
    }
}

export interface RitualExecutionStatus
{
    success: boolean;
    completedSteps: number;
    totalSteps: number;
    failedStep?: number;
    error?: string;
}

export async function executeLuciform(filePath: string): Promise<RitualExecutionStatus>
{
    const content = await fs.readFile(filePath, 'utf-8');
    const canaryReport = await getPersonaResponse('canary', `Analyze the following ritual:\n\n${ content }`);
    console.log(canaryReport);
    await logRitual(`[CANARY REPORT]\n${ canaryReport }`);

    await logRitual(`[RITUAL START] Executing luciform: ${ filePath }`);
    const pasSeparators = content.split('---PAS---').filter(p => p.trim() !== '');
    const totalSteps = pasSeparators.length;
    let completedSteps = 0;

    for(let i = 0; i < totalSteps; i++)
    {
        const pasContent = pasSeparators[i];
        const currentStep = i + 1;
        await logRitual(`\n[STEP ${ currentStep } / ${ totalSteps }] Processing...`);

        try
        {
            const operation = parseLuciformAction(pasContent);
            if(operation)
            {
                await logRitual(`[OPERATION] Found operation of type: ${ operation.type }`);
                await executeOperation(operation);
                completedSteps++;
                await logRitual(`[STEP ${ currentStep } / ${ totalSteps }] Completed successfully.`);
            } else
            {
                await logRitual(`[WARN] No valid action found in step ${ currentStep }`);
            }
        } catch(error: any)
        {
            const errorMessage = `Error during step ${ currentStep }: ${ error.message }`;
            await logRitual(`[ERROR] ${ errorMessage }`);
            const finalReport = await getPersonaResponse('mog', `The ritual has failed. Please provide a final report based on the following status: ${ JSON.stringify({success: false, completedSteps, totalSteps, failedStep: currentStep, error: errorMessage}, null, 2) }`);
            console.log(finalReport);
            await logRitual(`[MOG FINAL REPORT]\n${ finalReport }`);
            return {
                success: false,
                completedSteps,
                totalSteps,
                failedStep: currentStep,
                error: errorMessage,
            };
        }
    }

    await logRitual(`\n[RITUAL SUCCESS] All ${ totalSteps } steps completed successfully.`);
    const finalReport = await getPersonaResponse('mog', `The ritual has finished. Please provide a final report based on the following status: ${ JSON.stringify({success: true, completedSteps, totalSteps}, null, 2) }`);
    console.log(finalReport);
    await logRitual(`[MOG FINAL REPORT]\n${ finalReport }`);
    return {
        success: true,
        completedSteps,
        totalSteps,
    };
}