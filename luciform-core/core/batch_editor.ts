import {spawn} from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import {Operation} from './types.js';

declare var globalThis: any;

// Arcane du ScryOrb: Fonction pour émettre des fragments de vision
async function emitScryOrbFragment(ritualPhase: string, operation: Operation, details: any = {}, error?: any)
{
    const fragment = {
        timestamp: new Date().toISOString(),
        ritual_phase: ritualPhase,
        operation_details: operation,
        details: details,
        error_message: error ? String(error) : undefined,
        stack_trace: error ? error.stack : undefined
    };
    // Emit to external logger if present (for test/dev), otherwise console
    if (typeof globalThis.emitSCYRFragment === 'function') {
        globalThis.emitSCYRFragment(fragment);
    } else {
        console.log(`[SCYRING_ORB_FRAGMENT]${ JSON.stringify(fragment) }`);
    }
}

// --- Batch Action Executor Map Types ---
import { BatchActionFeedback, ResultAggregator } from './batch_editor_types.js';
import { unknownHandler } from './permissive_parser/unknownHandler.js';
import type { Action } from './permissive_parser/index.js';

// If you want to accept both Operation and other Actions in batch, use this union type:


type ActionExecutor = (action: Operation, dryRun?: boolean) => Promise<BatchActionFeedback>;

// Core Action Executor Map; extend as supports grows
const actionExecutorMap: Record<string, ActionExecutor> = {
  'create_file': async (action, dryRun) => {
    try {
      await applyOperation(action as Operation, dryRun);
      return { type: action.type, action, status: 'success' };
    } catch (error: unknown) {
      return { type: action.type, action, status: 'error', error, message: error instanceof Error ? error.message : String(error) };
    }
  },
  'search_and_replace': async (action, dryRun) => {
    try {
      await applyOperation(action as Operation, dryRun);
      return { type: action.type, action, status: 'success' };
    } catch (error: unknown) {
      return { type: action.type, action, status: 'error', error, message: error instanceof Error ? error.message : String(error) };
    }
  },
  'insert': async (action, dryRun) => {
    try {
      await applyOperation(action as Operation, dryRun);
      return { type: action.type, action, status: 'success' };
    } catch (error: unknown) {
      return { type: action.type, action, status: 'error', error, message: error instanceof Error ? error.message : String(error) };
    }
  },
  'delete': async (action, dryRun) => {
    try {
      await applyOperation(action as Operation, dryRun);
      return { type: action.type, action, status: 'success' };
    } catch (error: unknown) {
      return { type: action.type, action, status: 'error', error, message: error instanceof Error ? error.message : String(error) };
    }
  },
  'append': async (action, dryRun) => {
    try {
      await applyOperation(action as Operation, dryRun);
      return { type: action.type, action, status: 'success' };
    } catch (error: unknown) {
      return { type: action.type, action, status: 'error', error, message: error instanceof Error ? error.message : String(error) };
    }
  },
  'shell_command': async (action, dryRun) => {
    try {
      await applyOperation(action as Operation, dryRun);
      return { type: action.type, action, status: 'success' };
    } catch (error: unknown) {
      return { type: action.type, action, status: 'error', error, message: error instanceof Error ? error.message : String(error) };
    }
  },
};

// Generic fallback for unknown action types
async function batchUnknownHandler(action: Operation, dryRun?: boolean): Promise<BatchActionFeedback> {
  const stub = await unknownHandler(action as any, { severity: 'warning' });
  return {
    type: action.type || 'Unknown',
    action,
    status: 'stubbed',
    message: 'No executor for action type',
    extra: stub
  };
}

/**
 * Executes a batch of actions (operations), dispatching via actionExecutorMap. Aggregates summary.
 * @param actions Array of parsed Action or Operation items
 * @param opts Optional config: {dryRun: boolean}
 */
export async function executeBatch(
  actions: Operation[],
  opts: { dryRun?: boolean } = {}
): Promise<{ aggregator: ResultAggregator, feedback: BatchActionFeedback[] }> {
  const aggregator = new ResultAggregator();
  for (const action of actions) {
    const executor: ActionExecutor = actionExecutorMap[action.type as string] || batchUnknownHandler;
    let feedback: BatchActionFeedback;
    try {
      feedback = await executor(action, opts.dryRun);
    } catch (error: unknown) {
      feedback = { type: action.type, action, status: 'error', error, message: error instanceof Error ? error.message : String(error) };
    }
    aggregator.add(feedback);
  }
  return { aggregator, feedback: aggregator.all() };
}

export async function executeShellCommand(command: string): Promise<void>
{
    return new Promise((resolve, reject) =>
    {
        const child = spawn(command, [], {shell: true, stdio: 'inherit'});

        child.on('close', (code: number) =>
        {
            if(code === 0)
            {
                resolve();
            } else
            {
                reject(new Error(`Command failed with exit code ${ code }`));
            }
        });
    });
}

export async function applyOperation(op: Operation, dryRun: boolean = false): Promise<void>
{
    await emitScryOrbFragment(`applyOperation:${ op.type }:start`, op, {dryRun: dryRun});

    if(dryRun)
    {
        console.log(`[DRY RUN] Would execute: ${ JSON.stringify(op) }`);
        await emitScryOrbFragment(`applyOperation:${ op.type }:dry_run`, op);
        return;
    }

    let originalContent: string;

    try
    {
        switch(op.type)
        {
            case 'create_file':
                if(op.type !== 'create_file') return; // Type guard
                const dir = path.dirname(op.filePath);
                await fs.mkdir(dir, {recursive: true});
                await fs.writeFile(op.filePath, op.content, 'utf-8');
                break;

            case 'search_and_replace':
                if(op.type !== 'search_and_replace') return; // Type guard
                originalContent = await fs.readFile(op.filePath, 'utf-8');
                const normalizedOriginalContent = originalContent.replace(/\r\n/g, '\n');
                const normalizedSearch = op.search.replace(/\r\n/g, '\n');
                const normalizedReplace = op.replace.replace(/\r\n/g, '\n');

                const startIndex = normalizedOriginalContent.indexOf(normalizedSearch);

                if(startIndex === -1)
                {
                    throw new Error(`Search content not found in ${ op.filePath }`);
                }

                const endIndex = startIndex + normalizedSearch.length;
                const newContent = normalizedOriginalContent.substring(0, startIndex) + normalizedReplace + normalizedOriginalContent.substring(endIndex);

                await fs.writeFile(op.filePath, newContent, 'utf-8');
                break;

            case 'insert':
                if(op.type !== 'insert') return; // Type guard
                originalContent = await fs.readFile(op.filePath, 'utf-8');
                const linesInsert = originalContent.replace(/\r\n/g, '\n').split('\n');
                const newContentInsert = op.newContent.replace(/\r\n/g, '\n');

                const newLinesInsert = [
                    ...linesInsert.slice(0, op.lineNumber - 1),
                    newContentInsert,
                    ...linesInsert.slice(op.lineNumber - 1)
                ];
                await fs.writeFile(op.filePath, newLinesInsert.join('\n'), 'utf-8');
                break;

            case 'delete':
                if(op.type !== 'delete') return; // Type guard
                originalContent = await fs.readFile(op.filePath, 'utf-8');
                const linesDelete = originalContent.replace(/\r\n/g, '\n').split('\n');
                const newLinesDelete = [
                    ...linesDelete.slice(0, op.startLine - 1),
                    ...linesDelete.slice(op.endLine)
                ];
                await fs.writeFile(op.filePath, newLinesDelete.join('\n'), 'utf-8');
                break;

            case 'append':
                if(op.type !== 'append') return; // Type guard
                const newContentAppend = op.newContent.replace(/\r\n/g, '\n');
                await fs.appendFile(op.filePath, newContentAppend, 'utf-8');
                break;

case 'shell_command':
    if(op.type !== 'shell_command') return; // Type guard
    const isWindows = process.platform === 'win32';
    const commandString = isWindows ? op.command.replace(/rm /g, 'del ') : op.command;

    // Split AND/OR on && and ||, naive support (no advanced quotes/subshell handling)
    const simpleAndOrSplit = commandString.split(/\s*(\&\&|\|\|)\s*/g).filter(Boolean);

    if(simpleAndOrSplit.length > 1) {
        // Execute respecting the order (no short-circuit on fail, just simple sequential)
        for(const part of simpleAndOrSplit) {
            if(part === '\&\&' || part === '\|\|') continue;
            await executeShellCommand(part);
        }
    } else {
        await executeShellCommand(commandString);
    }
    break;
        }
        await emitScryOrbFragment(`applyOperation:${ op.type }:success`, op);
    } catch(error: unknown)
    {
        await emitScryOrbFragment(`applyOperation:${ op.type }:error`, op, {}, error);
        throw error;
    }
}

/*
   .-.
  |o o|   Code edits echo,
  |   |   unseen in the digital void—
  | ' |   Ghosts drift, haunting change.
  | ' |   Ghosts drift, haunting change.
  '~~~'
*/
