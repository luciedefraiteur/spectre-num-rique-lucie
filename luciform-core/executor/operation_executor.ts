
import * as fs from 'fs/promises';
import { ExecutableOperation, ShellCommand, ExecuteTypescriptFile, CreateFile, Promenade, AskLucie, AskPersona, Message, ApplyTransmutation, TransmuteFile, Persona } from '../types/base.js';
import { invokeShadeOs } from '../shade_os.js';
import { getPersonaResponse } from '../personas.js';
import { runShellCommand } from './shell_command.js';

import { RitualContext } from '../types/base.js';

const ritualContext: RitualContext = {
  conduit: {
    lastIncantation: '', lastOutcome: '', currentSanctum: '', terminalEssence: '', osEssence: '',
    protoConsciousness: '', support: '', memory: '', state: '', energy: '', glitchFactor: 0,
    almaInfluence: 0, eliInfluence: 0
  },
  kardiaSphere: { agapePhobos: 0, logosPathos: 0, harmoniaEris: 0 },
  scroll: [],
  maxScrollLength: 0,
  incantation_history: [],
  outcome_history: [],
  step_results_history: [],
  narrativeWeaving: {},
  activeReflection: {},
  user_preferences: '',
  chantModeEnabled: false,
  current_sanctum: '',
  currentSanctumContent: '',
  operatingSystem: '',
  personality: '',
  lifeSystem: {},
};

export async function executeOperation(operation: ExecutableOperation): Promise<void> {
    console.log(`[EXEC_OP] Executing operation: ${operation.type}`);
    switch (operation.type) {
        case 'shell_command':
            const shellOp = operation as ShellCommand;
            console.log(`[INFO] Executing shell command:`);
            console.log(`[CMD] ${shellOp.command}`);
            if (shellOp.command.startsWith('@')) {
                const parts = shellOp.command.split(' ');
                const personaName = parts[0].substring(1);
                const message = parts.slice(1).join(' ');
                console.log(`[EXEC_OP] Invoking persona: ${personaName}`);
                const personaResponse = await getPersonaResponse(personaName, message, ritualContext, undefined);
                console.log(`[PERSONA] ${personaName} says: ${personaResponse}`);
            } else {
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
            const tsFileOp = operation as ExecuteTypescriptFile;
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
            const createOp = operation as CreateFile;
            console.log(`[INFO] Creating file: ${createOp.filePath}`);
            const fileContent = createOp.content.replace('{timestamp}', new Date().toISOString());
            await fs.writeFile(createOp.filePath, fileContent, 'utf-8');
            console.log(`[SUCCESS] File created: ${createOp.filePath}`);
            break;
        case 'promenade':
            const promenadeOp = operation as Promenade;
            await process.stdout.write(`[PROMENADE] Starting promenade: ${promenadeOp.description}\n`);
            // Invoke shadeOs to generate a new luciform based on the promenade description
            console.log(`[EXEC_OP] Invoking shadeOs for promenade: ${promenadeOp.description}`);
            const generatedLuciformContent = await invokeShadeOs(promenadeOp.description, 'lucie', null, null, null);
            if (generatedLuciformContent) {
                // For now, just log the generated luciform content. In a real scenario,
                // this would be executed or saved as a new ritual.
                console.log(`[PROMENADE] ShadeOs generated a new luciform:\n${generatedLuciformContent}`);
                // Optionally, save the generated luciform to a file
                await fs.writeFile('generated_promenade_ritual.luciform', generatedLuciformContent, 'utf-8');
                console.log("Generated promenade ritual saved to generated_promenade_ritual.luciform");
            } else {
                await process.stderr.write(`[ERROR] ShadeOs failed to generate a luciform for promenade: ${promenadeOp.description}\n`);
            }
            break;
        case 'ask_lucie':
            const askOp = operation as AskLucie;
            const rl = (await import('readline')).createInterface({
                input: process.stdin,
                output: process.stdout
            });
            const answer = await new Promise<string>(resolve => {
                rl.question(askOp.question + ' ', resolve);
            });
            rl.close();
            // The answer is not used yet, but this completes the conversational loop.
            console.log(`[EXEC_OP] User answered: ${answer}`);
            break;
        case 'ask_persona':
            const askPersonaOp = operation as AskPersona;
            console.log(`[EXEC_OP] Invoking persona: ${askPersonaOp.persona} with LLM: ${askPersonaOp.llm_model}`);
            const personaResponse = await getPersonaResponse(askPersonaOp.persona.name, askPersonaOp.question, ritualContext, askPersonaOp.llm_model);
            console.log(`[PERSONA] ${askPersonaOp.persona} says: ${personaResponse}`);
            break;
        case 'message':
            const messageOp = operation as Message;
            console.log(`[MESSAGE] ${messageOp.message}`);
            break;
        case 'apply_transmutation': {
            const op = operation as ApplyTransmutation;
            await fs.writeFile(op.filePath, op.newLuciformContent, 'utf-8');
            break;
        }
        default:
            throw new Error(`Unknown operation type: ${(operation as any).type}`);
    }
    console.log(`[EXEC_OP] Finished operation: ${operation.type}`);
}
