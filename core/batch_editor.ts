import {spawn} from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import {Operation} from './types.js';

// Arcane du ScryOrb: Fonction pour émettre des fragments de vision
async function emitScryOrbFragment(ritualPhase: string, operation: Operation, details: any = {}, error?: any) {
    const fragment = {
        timestamp: new Date().toISOString(),
        ritual_phase: ritualPhase,
        operation_details: operation,
        details: details,
        error_message: error ? String(error) : undefined,
        stack_trace: error ? error.stack : undefined
    };
    // Émettre le fragment sur stdout pour capture externe
    console.log(`[SCYRING_ORB_FRAGMENT]${JSON.stringify(fragment)}`);
}

async function executeShellCommand(command: string): Promise<void>
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
    await emitScryOrbFragment(`applyOperation:${op.type}:start`, op, {dryRun: dryRun});

    if(dryRun)
    {
        console.log(`[DRY RUN] Would execute: ${ JSON.stringify(op) }`);
        await emitScryOrbFragment(`applyOperation:${op.type}:dry_run`, op);
        return;
    }

    let originalContent: string;

    try {
        switch(op.type)
        {
            case 'create_file':
                if (op.type !== 'create_file') return; // Type guard
                const dir = path.dirname(op.filePath);
                await fs.mkdir(dir, {recursive: true});
                await fs.writeFile(op.filePath, op.content, 'utf-8');
                break;

            case 'search_and_replace':
                if (op.type !== 'search_and_replace') return; // Type guard
                originalContent = await fs.readFile(op.filePath, 'utf-8');
                const normalizedOriginalContent = originalContent.replace(/\r\n/g, '\n');
                const normalizedSearch = op.search.replace(/\r\n/g, '\n');
                const normalizedReplace = op.replace.replace(/\r\n/g, '\n');

                const startIndex = normalizedOriginalContent.indexOf(normalizedSearch);

                if (startIndex === -1) {
                    throw new Error(`Search content not found in ${op.filePath}`);
                }

                const endIndex = startIndex + normalizedSearch.length;
                const newContent = normalizedOriginalContent.substring(0, startIndex) + normalizedReplace + normalizedOriginalContent.substring(endIndex);

                await fs.writeFile(op.filePath, newContent, 'utf-8');
                break;

            case 'insert':
                if (op.type !== 'insert') return; // Type guard
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
                if (op.type !== 'delete') return; // Type guard
                originalContent = await fs.readFile(op.filePath, 'utf-8');
                const linesDelete = originalContent.replace(/\r\n/g, '\n').split('\n');
                const newLinesDelete = [
                    ...linesDelete.slice(0, op.startLine - 1),
                    ...linesDelete.slice(op.endLine)
                ];
                await fs.writeFile(op.filePath, newLinesDelete.join('\n'), 'utf-8');
                break;

            case 'append':
                if (op.type !== 'append') return; // Type guard
                const newContentAppend = op.newContent.replace(/\r\n/g, '\n');
                await fs.appendFile(op.filePath, newContentAppend, 'utf-8');
                break;

            case 'shell_command':
                if (op.type !== 'shell_command') return; // Type guard
                const isWindows = process.platform === 'win32';
                const command = isWindows ? op.command.replace(/rm /g, 'del ') : op.command;
                await executeShellCommand(command);
                break;
        }
        await emitScryOrbFragment(`applyOperation:${op.type}:success`, op);
    } catch (error) {
        await emitScryOrbFragment(`applyOperation:${op.type}:error`, op, {}, error);
        throw error;
    }
}