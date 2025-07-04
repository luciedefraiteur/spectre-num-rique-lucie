import {spawn} from 'child_process';
import * as fs from 'fs/promises';

interface SearchAndReplace
{
    type: 'search_and_replace';
    filePath: string;
    searchContent: string;
    newContent: string;
}

interface Insert
{
    type: 'insert';
    filePath: string;
    lineNumber: number;
    newContent: string;
}

interface Delete
{
    type: 'delete';
    filePath: string;
    startLine: number;
    endLine: number;
}

interface Append
{
    type: 'append';
    filePath: string;
    newContent: string;
}

interface ShellCommand
{
    type: 'shell_command';
    command: string;
}

type Operation = SearchAndReplace | Insert | Delete | Append | ShellCommand;

type ParserState = 'idle' | 'in_search' | 'in_replace' | 'in_insert' | 'in_append';

async function parseLuciform(filePath: string): Promise<Operation[]>
{
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    const operations: Operation[] = [];
    let state: ParserState = 'idle';
    let currentFilePath: string | undefined;
    let searchContent = '';
    let newContent = '';
    let lineNumber: number | undefined;
    let startLine: number | undefined;
    let endLine: number | undefined;


    for(const line of lines)
    {
        if(line.startsWith('---'))
        {
            continue;
        }
        if(line.startsWith('file:'))
        {
            currentFilePath = line.substring(5).trim();
        } else if(line.startsWith('command:'))
        {
            operations.push({type: 'shell_command', command: line.substring(8).trim()});
        } else if(line.startsWith('<<<<<<< SEARCH'))
        {
            state = 'in_search';
            searchContent = '';
        } else if(line.startsWith('=======') && state === 'in_search')
        {
            state = 'in_replace';
            newContent = '';
        } else if(line.startsWith('>>>>>>> REPLACE') && state === 'in_replace')
        {
            if(currentFilePath)
            {
                operations.push({type: 'search_and_replace', filePath: currentFilePath, searchContent, newContent});
            }
            state = 'idle';
        } else if(line.startsWith('<<<<<<< INSERT'))
        {
            state = 'in_insert';
            const lineNumberMatch = line.match(/:line:(\d+)/);
            if(lineNumberMatch)
            {
                lineNumber = parseInt(lineNumberMatch[1], 10);
            }
            newContent = '';
        } else if(line.startsWith('>>>>>>> INSERT') && state === 'in_insert')
        {
            if(currentFilePath && lineNumber)
            {
                operations.push({type: 'insert', filePath: currentFilePath, lineNumber, newContent});
            }
            state = 'idle';
        } else if(line.startsWith('<<<<<<< DELETE'))
        {
            const lineRangeMatch = line.match(/:lines:(\d+)-(\d+)/);
            if(lineRangeMatch && currentFilePath)
            {
                startLine = parseInt(lineRangeMatch[1], 10);
                endLine = parseInt(lineRangeMatch[2], 10);
                operations.push({type: 'delete', filePath: currentFilePath, startLine, endLine});
            }
        } else if(line.startsWith('<<<<<<< APPEND'))
        {
            state = 'in_append';
            newContent = '';
        } else if(line.startsWith('>>>>>>> APPEND') && state === 'in_append')
        {
            if(currentFilePath)
            {
                operations.push({type: 'append', filePath: currentFilePath, newContent});
            }
            state = 'idle';
        }
        else
        {
            if(state === 'in_search')
            {
                searchContent += line + '\n';
            } else if(state === 'in_replace' || state === 'in_insert' || state === 'in_append')
            {
                newContent += line + '\n';
            }
        }
    }

    return operations;
}

async function applyOperation(op: Operation, dryRun: boolean): Promise<void>
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
        case 'search_and_replace':
            originalContent = await fs.readFile(op.filePath, 'utf-8');
            const normalizedOriginalContent = originalContent.replace(/\r\n/g, '\n');
            const normalizedSearchContent = op.searchContent.replace(/\r\n/g, '\n');
            const newContent = normalizedOriginalContent.replace(normalizedSearchContent, op.newContent);
            if(originalContent === newContent)
            {
                console.error(`Could not find search block in ${ op.filePath }`);
                return;
            }
            await fs.writeFile(op.filePath, newContent, 'utf-8');
            console.log(`Successfully edited ${ op.filePath }`);
            break;
        case 'insert':
            originalContent = await fs.readFile(op.filePath, 'utf-8');
            lines = originalContent.split('\n');
            newLines = [
                ...lines.slice(0, op.lineNumber - 1),
                op.newContent.trim(),
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

async function executeShellCommand(command: string): Promise<void>
{
    return new Promise((resolve, reject) =>
    {
        const child = spawn(command, [], {shell: true, stdio: 'inherit'});

        child.on('close', (code) =>
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

async function main()
{
    const args = process.argv.slice(2);
    const luciformPath = args.find(arg => !arg.startsWith('--'));
    const dryRun = args.includes('--dry-run');

    if(!luciformPath)
    {
        console.error('Usage: ts-node-esm core/batch_editor.ts [--dry-run] <path_to_luciform_file>');
        process.exit(1);
    }

    try
    {
        const operations = await parseLuciform(luciformPath);

        for(const op of operations)
        {
            await applyOperation(op, dryRun);
        }
    } catch(error)
    {
        console.error(`Error processing batch operations: ${ error }`);
        process.exit(1);
    }
}

main();