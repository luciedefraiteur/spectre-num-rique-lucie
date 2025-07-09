import * as fs from 'fs/promises';

interface Edit
{
    filePath: string;
    startLine: number;
    endLine: number;
    newContent: string;
}

interface EditLog extends Edit
{
    timestamp: string;
}

async function editFile(edit: Edit): Promise<void>
{
    const originalContent = await fs.readFile(edit.filePath, 'utf-8');
    const lines = originalContent.split('\n');

    const newLines = [
        ...lines.slice(0, edit.startLine - 1),
        edit.newContent,
        ...lines.slice(edit.endLine)
    ];

    await fs.writeFile(edit.filePath, newLines.join('\n'), 'utf-8');

    const logEntry: EditLog = {
        ...edit,
        timestamp: new Date().toISOString(),
    };

    await fs.appendFile('file_edits.log', JSON.stringify(logEntry) + '\n', 'utf-8');
}

async function main()
{
    const [editsFilePath] = process.argv.slice(2);

    if(!editsFilePath)
    {
        console.error('Usage: ts-node core/file_editor.ts <path_to_edits_json_file>');
        process.exit(1);
    }

    try
    {
        const editsJson = await fs.readFile(editsFilePath, 'utf-8');
        const edits: Edit[] = JSON.parse(editsJson);

        for(const edit of edits)
        {
            await editFile(edit);
            console.log(`Successfully edited ${ edit.filePath } from line ${ edit.startLine } to ${ edit.endLine }.`);
        }
    } catch(error)
    {
        console.error(`Error processing edits: ${ error }`);
        process.exit(1);
    }
}

main();