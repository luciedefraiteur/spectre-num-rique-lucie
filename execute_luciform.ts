import * as fs from 'fs/promises';
import {exec} from 'child_process';
import * as path from 'path';
import {Operation, ShellCommand, ExecuteTypescriptFile, CreateFile, Promenade, AskLucie} from './core/types.js';
import {parseLuciformAction} from './core/luciform_parser.js';
import {invokeShadeOs} from './core/shade_os.js';
import {detectedShell} from './core/utils/osHint.js';
import {Persona, getPersonaResponse} from './core/personas.js';

// Fonction utilitaire pour exécuter des commandes shell
async function runShellCommand(command: string): Promise<{stdout: string; stderr: string; exitCode: number | null}>
{
    const commands = command.split('&&').map(cmd => cmd.trim());
    let stdout = '';
    let stderr = '';
    let exitCode: number | null = 0;

    for(const cmd of commands)
    {
        const result = await new Promise<{stdout: string; stderr: string; exitCode: number | null}>((resolve) =>
        {
            const options = process.platform === 'win32' ? {shell: detectedShell === 'powershell' ? 'powershell.exe' : 'cmd.exe'} : {};
            const child = exec(cmd, options, (error, out, err) =>
            {
                resolve({
                    stdout: out,
                    stderr: err,
                    exitCode: error ? error.code ?? 1 : 0,
                });
            });

            child.stdout?.pipe(process.stdout);
            child.stderr?.pipe(process.stderr);
        });

        stdout += result.stdout;
        stderr += result.stderr;
        if(result.exitCode !== 0)
        {
            exitCode = result.exitCode;
            break; // Stop execution on the first error
        }
    }

    return {stdout, stderr, exitCode};
}

async function executeOperation(operation: Operation): Promise<void>
{
    switch(operation.type)
    {
        case 'shell_command':
            const shellOp = operation as ShellCommand;
            console.log(`Exécution de la commande shell: ${ shellOp.command }`);
            if(shellOp.command.startsWith('@'))
            {
                const parts = shellOp.command.split(' ');
                const personaName = parts[0].substring(1) as Persona;
                const message = parts.slice(1).join(' ');
                const personaResponse = await getPersonaResponse(personaName, message);
                console.log(personaResponse);
            } else
            {
                const result = await runShellCommand(shellOp.command);
                console.log(result.stdout);
                console.error(result.stderr);
                if(result.exitCode !== 0)
                {
                    throw new Error(`La commande shell a échoué avec le code ${ result.exitCode }`);
                }
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
            console.log(`Création du fichier: ${ createOp.filePath }`);
            await fs.writeFile(createOp.filePath, createOp.content, 'utf-8');
            console.log(`Fichier ${ createOp.filePath } créé avec succès.`);
            break;
        case 'promenade':
            const promenadeOp = operation as Promenade;
            console.log(`Début de la promenade: ${ promenadeOp.description }`);
            const newRitual = await invokeShadeOs(promenadeOp.description, 'lucie', null, null, null);
            if(newRitual)
            {
                const tempDir = './temp';
                await fs.mkdir(tempDir, {recursive: true});
                const tempFilePath = path.join(tempDir, `__promenade_ritual_${ Date.now() }.luciform`);
                await fs.writeFile(tempFilePath, newRitual, 'utf-8');
                await executeLuciform(tempFilePath);
                await fs.unlink(tempFilePath);
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
    console.log(`--- Exécution du luciform: ${ filePath } ---`);
    const content = await fs.readFile(filePath, 'utf-8');
    const pasSeparators = content.split('---PAS---').filter(p => p.trim() !== '');
    const totalSteps = pasSeparators.length;
    let completedSteps = 0;

    for(let i = 0; i < totalSteps; i++)
    {
        const pasContent = pasSeparators[i];
        const currentStep = i + 1;
        console.log(`\n--- Traitement du pas ${ currentStep } / ${ totalSteps } ---`);

        try
        {
            const operation = parseLuciformAction(pasContent);
            if(operation)
            {
                await executeOperation(operation);
                completedSteps++;
            } else
            {
                console.warn(`Aucune action valide trouvée dans le pas ${ currentStep }`);
            }
        } catch(error: any)
        {
            const errorMessage = `Erreur lors de l'exécution du pas ${ currentStep }: ${ error.message }`;
            console.error(errorMessage);
            return {
                success: false,
                completedSteps,
                totalSteps,
                failedStep: currentStep,
                error: errorMessage,
            };
        }
    }

    console.log('--- Rituel terminé avec succès ---');
    return {
        success: true,
        completedSteps,
        totalSteps,
    };
}