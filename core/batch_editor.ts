import {spawn} from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import {Operation} from './types.js';

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
    if(dryRun)
    {
        console.log(`[DRY RUN] Would execute: ${ JSON.stringify(op) }`);
        return;
    }

    let originalContent: string;
    let lines: string[];
    let newLines: string[];

    switch(op.type)
    {
        case 'create_file':
            const dir = path.dirname(op.filePath);
            await fs.mkdir(dir, {recursive: true});
            await fs.writeFile(op.filePath, op.content, 'utf-8');
            console.log(`Successfully created ${ op.filePath }`);
            break;

        case 'search_and_replace':
            originalContent = await fs.readFile(op.filePath, 'utf-8');
            lines = originalContent.replace(/\r\n/g, '\n').split('\n');
            const searchLines = op.search.split('\n');
            const newContentLines = op.replace.split('\n');

            let contentMatches = true;
            for(let i = 0; i < searchLines.length; i++)
            {
                if(op.startLine - 1 + i >= lines.length)
                {
                    console.error(`[DEBUG] Search block extends beyond end of file in ${ op.filePath }`);
                    contentMatches = false;
                    break;
                }
                const fileLine = lines[op.startLine - 1 + i];
                const searchLine = searchLines[i];
                console.log(`[DEBUG] Comparing line ${op.startLine - 1 + i}:`);
                console.log(`[DEBUG] File Line:  "${fileLine}" (length: ${fileLine.length})`);
                console.log(`[DEBUG] Search Line: "${searchLine}" (length: ${searchLine.length})`);
                if(fileLine !== searchLine)
                {
                    console.error(`[DEBUG] Line mismatch on line ${ op.startLine + i } of ${ op.filePath }`);
                    console.error(`[DEBUG] Expected: "${ searchLine }" (length: ${ searchLine.length })`);
                    console.error(`[DEBUG] Got:      "${ fileLine }" (length: ${ fileLine.length })`);
                    contentMatches = false;
                    break;
                }
            }

            if(!contentMatches)
            {
                console.error(`Search content does not match at line ${ op.startLine } in ${ op.filePath }`);
                return;
            }

            newLines = [
                ...lines.slice(0, op.startLine - 1),
                ...newContentLines,
                ...lines.slice(op.startLine - 1 + searchLines.length)
            ];
            await fs.writeFile(op.filePath, newLines.join('\n'), 'utf-8');
            console.log(`Successfully edited ${ op.filePath }`);
            break;

        case 'insert':
            originalContent = await fs.readFile(op.filePath, 'utf-8');
            lines = originalContent.split('\n');
            newLines = [
                ...lines.slice(0, op.lineNumber - 1),
                op.newContent,
                ...lines.slice(op.lineNumber - 1)
            ];
            await fs.writeFile(op.filePath, newLines.join('\n'), 'utf-8');
            console.log(`Successfully edited ${ op.filePath }`);
            break;

        case 'delete':
            originalContent = await fs.readFile(op.filePath, 'utf-8');
            lines = originalContent.split('\n');
            newLines = [
                ...lines.slice(0, op.startLine - 1),
                ...lines.slice(op.endLine)
            ];
            await fs.writeFile(op.filePath, newLines.join('\n'), 'utf-8');
            console.log(`Successfully edited ${ op.filePath }`);
            break;

        case 'append':
            await fs.appendFile(op.filePath, op.newContent, 'utf-8');
            console.log(`Successfully edited ${ op.filePath }`);
            break;

        case 'shell_command':
            await executeShellCommand(op.command);
            break;
    }
}