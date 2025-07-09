import * as fs from 'fs/promises';

async function modifyFile(filePath: string, startLine: number, endLine: number, newContent: string): Promise<void> {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const lines = content.split('\n');

        if (startLine < 1 || endLine > lines.length || startLine > endLine) {
            console.error(`Invalid line numbers provided. File has ${lines.length} lines.`);
            process.exit(1);
        }

        const linesBefore = lines.slice(0, startLine - 1);
        const linesAfter = lines.slice(endLine);

        const modifiedContent = [...linesBefore, newContent, ...linesAfter].join('\n');

        await fs.writeFile(filePath, modifiedContent, 'utf-8');
        console.log(`Successfully modified ${filePath} from line ${startLine} to ${endLine}.`);
    } catch (error) {
        console.error(`Error modifying file ${filePath}:`, error);
        process.exit(1);
    }
}

const args = process.argv.slice(2);

if (args.length !== 4) {
    console.log('Usage: ts-node file_modifier.ts <filePath> <startLine> <endLine> <newContent>');
    process.exit(1);
}

const filePath = args[0];
const startLine = parseInt(args[1], 10);
const endLine = parseInt(args[2], 10);
const newContent = args[3].replace(/\\n/g, '\n').replace(/\\t/g, '\t'); // Handle escaped newlines and tabs

modifyFile(filePath, startLine, endLine, newContent);
