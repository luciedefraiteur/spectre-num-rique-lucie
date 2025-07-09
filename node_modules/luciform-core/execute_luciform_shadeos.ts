// execute_luciform.ts (v2.0)

import * as fs from 'fs/promises';
import * as path from 'path';
import { spawn } from 'child_process';
import { parseLuciformDocument } from './luciform_parser/parser.js';
import {
  ExecutableOperation,
  ShellCommand,
  ExecuteTypescriptFile,
  CreateFile,
  Promenade,
  AskLucie,
  AskPersona,
  Message,
  ApplyTransmutation,
  TransmuteFile,
} from './types/base.js';
import {
  JsonActionNode,
  HelpRequestActionNode,
} from './luciform_parser/types.js';
import { invokeShadeOs } from './shade_os.js';
import { logRitual } from './log_writers.js';
import { getPersonaResponse } from './personas.js';

interface RitualExecutionStatus {
  success: boolean;
  completedSteps: number;
  totalSteps: number;
  failedStep?: number;
  error?: string;
}

import { RitualContext } from './types/base.js';

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

function runShellCommand(command: string): Promise<{ stdout: string; stderr: string; exitCode: number | null }> {
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

async function executeOperation(op: ExecutableOperation): Promise<void> {
  switch (op.type) {
    case 'shell_command': {
      const result = await runShellCommand(op.command);
      if (result.exitCode !== 0) throw new Error(result.stderr);
      break;
    }
    case 'execute_typescript_file': {
      const tsCmd = `ts-node ${op.filePath}`;
      const result = await runShellCommand(tsCmd);
      if (result.exitCode !== 0) throw new Error(result.stderr);
      break;
    }
    case 'create_file': {
      const content = op.content.replace('{timestamp}', new Date().toISOString());
      await fs.writeFile(op.filePath, content, 'utf-8');
      break;
    }
    case 'promenade': {
      const luciform = await invokeShadeOs(op.description, 'lucie', null, null, null);
      if (!luciform) throw new Error(`ShadeOs failed for: ${op.description}`);
      await fs.writeFile('generated_promenade.luciform', luciform, 'utf-8');
      break;
    }
    case 'ask_lucie': {
      const rl = (await import('readline')).createInterface({ input: process.stdin, output: process.stdout });
      const answer = await new Promise<string>((resolve) => rl.question(op.question + ' ', resolve));
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
      throw new Error(`Unknown operation type: ${(op as any).type}`);
  }
}

export async function executeLuciform(filePath: string, logFile = 'ritual.log'): Promise<RitualExecutionStatus> {
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
          const action = pas.action as JsonActionNode;
          await executeOperation(action.operation as ExecutableOperation);
          completedSteps++;
        } else if (pas.action && 'reason' in pas.action) {
          const help = pas.action as HelpRequestActionNode;
          const guidance = await getPersonaResponse('Syngraphe', `Issue: ${help.reason}\nContent: ${help.rawContent}`, ritualContext);
          console.warn(`[SYNGRAPHE] ${guidance}`);
        }
        await logRitual(`[STEP ${i + 1}] OK`);
      } catch (stepError: any) {
        await logRitual(`[STEP ${i + 1}] ERROR: ${stepError.message}`);
        return { success: false, completedSteps, totalSteps, failedStep: i + 1, error: stepError.message };
      }
    }

    await logRitual(`[RITUAL SUCCESS] ${totalSteps} steps completed.`);
    return { success: true, completedSteps, totalSteps };
  } catch (mainError: any) {
    return { success: false, completedSteps: 0, totalSteps: 0, error: mainError.message };
  }
}