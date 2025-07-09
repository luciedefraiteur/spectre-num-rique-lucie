import { spawn } from 'child_process';
import * as fs from 'fs/promises';
async function editFile(edit) {
    const originalContent = await fs.readFile(edit.filePath, 'utf-8');
    const lines = originalContent.split('\n');
    const newLines = [
        ...lines.slice(0, edit.startLine - 1),
        edit.newContent,
        ...lines.slice(edit.endLine)
    ];
    await fs.writeFile(edit.filePath, newLines.join('\n'), 'utf-8');
    const logEntry = {
        ...edit,
        timestamp: new Date().toISOString(),
    };
    await fs.appendFile('file_edits.log', JSON.stringify(logEntry) + '\n', 'utf-8');
}
async function executeShellCommand(command) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, [], { shell: true, stdio: 'inherit' });
        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            }
            else {
                reject(new Error(`Command failed with exit code ${code}`));
            }
        });
    });
}
async function main() {
    const [commandType, ...args] = process.argv.slice(2);
    if (!commandType) {
        console.error('Usage: ts-node core/command_executor.ts <command_type> [args...]');
        process.exit(1);
    }
    try {
        if (commandType === 'file_edits') {
            const [editsFilePath] = args;
            if (!editsFilePath) {
                console.error('Usage: ts-node core/command_executor.ts file_edits <path_to_edits_json_file>');
                process.exit(1);
            }
            const editsJson = await fs.readFile(editsFilePath, 'utf-8');
            const edits = JSON.parse(editsJson);
            for (const edit of edits) {
                await editFile(edit);
                console.log(`Successfully edited ${edit.filePath} from line ${edit.startLine} to ${edit.endLine}.`);
            }
        }
        else if (commandType === 'shell_command') {
            const [command] = args;
            if (!command) {
                console.error('Usage: ts-node core/command_executor.ts shell_command <command_to_execute>');
                process.exit(1);
            }
            await executeShellCommand(command);
        }
        else if (commandType === 'file_edits_and_build') {
            const [editsFilePath] = args;
            if (!editsFilePath) {
                console.error('Usage: ts-node core/command_executor.ts file_edits_and_build <path_to_edits_json_file>');
                process.exit(1);
            }
            const editsJson = await fs.readFile(editsFilePath, 'utf-8');
            const edits = JSON.parse(editsJson);
            for (const edit of edits) {
                await editFile(edit);
                console.log(`Successfully edited ${edit.filePath} from line ${edit.startLine} to ${edit.endLine}.`);
            }
            await executeShellCommand('npm run build');
        }
        else {
            console.error(`Unknown command type: ${commandType}`);
            process.exit(1);
        }
    }
    catch (error) {
        console.error(`Error executing command: ${error}`);
        process.exit(1);
    }
}
main();
