import * as fs from 'fs/promises';
import {applyOperation} from './core/batch_editor.js';
import {Operation} from './core/types.js';

type ParserState = 'idle' | 'in_search' | 'in_replace' | 'in_insert' | 'in_append' | 'in_create';

async function parseLuciform(filePath: string): Promise<Operation[]>
{
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.replace(/\r\n/g, '\n').split('\n');
    const operations: Operation[] = [];
    let state: ParserState = 'idle';
    let currentFilePath: string | undefined;
    let searchContent = '';
    let newContent = '';
    let lineNumber: number | undefined;
    let startLine: number | undefined;
    let endLine: number | undefined;
    let currentSearchStartLine: number | undefined;

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
            const lineNumberMatch = line.match(/:line:(\d+)/);
            if(lineNumberMatch)
            {
                currentSearchStartLine = parseInt(lineNumberMatch[1], 10);
            }
        } else if(line.startsWith('=======') && state === 'in_search')
        {
            searchContent = searchContent.replace(/\n$/, '');
            state = 'in_replace';
            newContent = '';
        } else if(line.startsWith('>>>>>>> REPLACE') && state === 'in_replace')
        {
            if(currentFilePath && currentSearchStartLine)
            {
                operations.push({
                    type: 'search_and_replace',
                    filePath: currentFilePath,
                    startLine: currentSearchStartLine,
                    search: searchContent,
                    replace: newContent.replace(/\n$/, '')
                });
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
                operations.push({type: 'insert', filePath: currentFilePath, lineNumber, newContent: newContent.replace(/\n$/, '')});
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
                operations.push({type: 'append', filePath: currentFilePath, newContent: newContent.replace(/\n$/, '')});
            }
            state = 'idle';
        } else if(line.startsWith('<<<<<<< CREATE'))
        {
            state = 'in_create';
            newContent = '';
        } else if(line.startsWith('>>>>>>> CREATE') && state === 'in_create')
        {
            if(currentFilePath)
            {
                operations.push({type: 'create_file', filePath: currentFilePath, content: newContent.replace(/\n$/, '')});
            }
            state = 'idle';
        }
        else
        {
            if(state === 'in_search')
            {
                searchContent += line + '\n';
            } else if(state === 'in_replace' || state === 'in_insert' || state === 'in_append' || state === 'in_create')
            {
                newContent += line + '\n';
            }
        }
    }

    return operations;
}

async function main()
{
    const args = process.argv.slice(2);
    const luciformPath = args.find(arg => !arg.startsWith('--'));
    const dryRun = args.includes('--dry-run');

    if(!luciformPath)
    {
        console.error('Usage: ts-node-esm execute_luciform.ts [--dry-run] <path_to_luciform_file>');
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