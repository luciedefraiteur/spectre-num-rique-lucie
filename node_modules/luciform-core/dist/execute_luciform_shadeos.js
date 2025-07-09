// execute_luciform.ts (v2.0)
import * as fs from 'fs/promises';
import { spawn } from 'child_process';
import { parseLuciformDocument } from './luciform_parser/parser.js';
import { invokeShadeOs } from './shade_os.js';
import { logRitual } from './log_writers.js';
import { getPersonaResponse } from './personas.js';
const ritualContext = {
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
function runShellCommand(command) {
    return new Promise((resolve) => {
        const isWindows = process.platform === 'win32';
        const shell = isWindows ? 'powershell.exe' : '/bin/sh';
        const args = isWindows ? ['-Command', command] : ['-c', command];
        const child = spawn(shell, args);
        let stdout = '';
        let stderr = '';
        child.stdout.on('data', (data) => (stdout += data.toString()));
        child.stderr.on('data', (data) => (stderr += data.toString()));
        child.on('close', (code) => {
            resolve({ stdout, stderr, exitCode: code });
        });
        child.on('error', (err) => {
            resolve({ stdout: '', stderr: err.message, exitCode: 1 });
        });
    });
}
async function executeOperation(op) {
    switch (op.type) {
        case 'shell_command': {
            const result = await runShellCommand(op.command);
            if (result.exitCode !== 0)
                throw new Error(result.stderr);
            break;
        }
        case 'execute_typescript_file': {
            const tsCmd = `ts-node ${op.filePath}`;
            const result = await runShellCommand(tsCmd);
            if (result.exitCode !== 0)
                throw new Error(result.stderr);
            break;
        }
        case 'create_file': {
            const content = op.content.replace('{timestamp}', new Date().toISOString());
            await fs.writeFile(op.filePath, content, 'utf-8');
            break;
        }
        case 'promenade': {
            const luciform = await invokeShadeOs(op.description, 'lucie', null, null, null);
            if (!luciform)
                throw new Error(`ShadeOs failed for: ${op.description}`);
            await fs.writeFile('generated_promenade.luciform', luciform, 'utf-8');
            break;
        }
        case 'ask_lucie': {
            const rl = (await import('readline')).createInterface({ input: process.stdin, output: process.stdout });
            const answer = await new Promise((resolve) => rl.question(op.question + ' ', resolve));
            rl.close();
            break;
        }
        case 'ask_persona': {
            const response = await getPersonaResponse(op.persona.name, op.question, ritualContext, op.llm_model);
            console.log(`[PERSONA ${op.persona}] ${response}`);
            break;
        }
        case 'message': {
            console.log(`[MESSAGE] ${op.message}`);
            break;
        }
        case 'apply_transmutation': {
            await fs.writeFile(op.filePath, op.newLuciformContent, 'utf-8');
            break;
        }
        default:
            throw new Error(`Unknown operation type: ${op.type}`);
    }
}
export async function executeLuciform(filePath, logFile = 'ritual.log') {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const document = parseLuciformDocument(content, logRitual);
        const totalSteps = document.pas.length;
        let completedSteps = 0;
        await logRitual(`[RITUAL] STARTING ${filePath}`);
        for (let i = 0; i < totalSteps; i++) {
            const pas = document.pas[i];
            try {
                if (pas.action && 'operation' in pas.action) {
                    const action = pas.action;
                    await executeOperation(action.operation);
                    completedSteps++;
                }
                else if (pas.action && 'reason' in pas.action) {
                    const help = pas.action;
                    const guidance = await getPersonaResponse('Syngraphe', `Issue: ${help.reason}\nContent: ${help.rawContent}`, ritualContext);
                    console.warn(`[SYNGRAPHE] ${guidance}`);
                }
                await logRitual(`[STEP ${i + 1}] OK`);
            }
            catch (stepError) {
                await logRitual(`[STEP ${i + 1}] ERROR: ${stepError.message}`);
                return { success: false, completedSteps, totalSteps, failedStep: i + 1, error: stepError.message };
            }
        }
        await logRitual(`[RITUAL SUCCESS] ${totalSteps} steps completed.`);
        return { success: true, completedSteps, totalSteps };
    }
    catch (mainError) {
        return { success: false, completedSteps: 0, totalSteps: 0, error: mainError.message };
    }
}
