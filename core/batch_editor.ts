import {spawn} from 'child_process';
import * as fs from 'fs/promises';

interface FileEdit
{
    type: 'file_edit';
    filePath: string;
    startLine: number;
    endLine: number;
    newContent: string;
}

interface ShellCommand
{
    type: 'shell_command';
    command: string;
}

type Operation = FileEdit | ShellCommand;

async function parseLuciform(filePath: string): Promise<Operation[]>
{
    const content = await fs.readFile(filePath, 'utf-8');
    const operations: Operation[] = [];
    const sections = content.split('---').map(s => s.trim()).filter(s => s);

    for(let i = 0; i < sections.length; i++)
    {
        const section = sections[i];
        if(section.startsWith('file:'))
        {
            const filePath = section.substring(5).trim();
            const editContent = sections[i + 1];
            if(editContent && editContent.startsWith('<<<<<<< SEARCH'))
            {
                const parts = editContent.split('=======');
                const searchBlock = parts[0];
                if(parts[1])
                {
                    const replaceBlock = parts[1].replace('>>>>>>> REPLACE', '').trim();

                    const searchLines = searchBlock.split('\n');
                    const startLineMatch = searchLines[0].match(/:start_line:(\d+)/);
                    if(startLineMatch)
                    {
                        const startLine = parseInt(startLineMatch[1], 10);
                        const searchContent = searchLines.slice(2).join('\n');

                        const originalContent = await fs.readFile(filePath, 'utf-8');
                        const originalLines = originalContent.split('\n');
                        const endLine = startLine + searchContent.split('\n').length - 1;

                        operations.push({
                            type: 'file_edit',
                            filePath,
                            startLine,
                            endLine,
                            newContent: replaceBlock,
                        });
                        i++; // Increment i to skip the editContent section
                    }
                }
            }
        } else if(section.startsWith('command:'))
        {
            const command = section.substring(8).trim();
            operations.push({
                type: 'shell_command',
                command,
            });
        }
    }

    return operations;
}

async function applyFileEdit(edit: FileEdit): Promise<void>
{
    const originalContent = await fs.readFile(edit.filePath, 'utf-8');
    const lines = originalContent.split('\n');

    const newLines = [
        ...lines.slice(0, edit.startLine - 1),
        edit.newContent,
        ...lines.slice(edit.endLine)
    ];

    await fs.writeFile(edit.filePath, newLines.join('\n'), 'utf-8');
    console.log(`Successfully edited ${ edit.filePath }`);
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
    const [luciformPath] = process.argv.slice(2);

    if(!luciformPath)
    {
        console.error('Usage: ts-node-esm core/batch_editor.ts <path_to_luciform_file>');
        process.exit(1);
    }

    try
    {
        const operations = await parseLuciform(luciformPath);

        for(const op of operations)
        {
            if(op.type === 'file_edit')
            {
                await applyFileEdit(op);
            } else if(op.type === 'shell_command')
            {
                await executeShellCommand(op.command);
            }
        }
    } catch(error)
    {
        console.error(`Error processing batch operations: ${ error }`);
        process.exit(1);
    }
}

main();