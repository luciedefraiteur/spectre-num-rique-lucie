import * as fs from 'fs/promises';
import { applyOperation } from './core/batch_editor.js';
import * as readline from 'readline';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function askQuestion(query) {
    return new Promise(resolve => rl.question(query, ans => {
        resolve(ans);
    }));
}
async function parseLuciform(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.replace(/\r\n/g, '\n').split('\n');
    const operations = [];
    let state = 'idle';
    let currentFilePath;
    let searchContent = '';
    let newContent = '';
    let lineNumber;
    let startLine;
    let endLine;
    let currentSearchStartLine;
    for (const line of lines) {
        if (line.startsWith('---')) {
            continue;
        }
        if (line.startsWith('§F:')) {
            currentFilePath = line.substring(3).trim();
        }
        else if (line.startsWith('§X:')) {
            operations.push({ type: 'shell_command', command: line.substring(3).trim() });
        }
        else if (line.startsWith('§Q:')) {
            const question = line.substring(3).trim();
            const answer = await askQuestion(question + ' ');
            console.log(`Réponse de l'utilisateur : ${answer}`);
        }
        else if (line.startsWith('<<<<<<< §S')) {
            state = 'in_search';
            searchContent = '';
            const lineNumberMatch = line.match(/:line:(\d+)/);
            if (lineNumberMatch) {
                currentSearchStartLine = parseInt(lineNumberMatch[1], 10);
            }
        }
        else if (line.startsWith('======= §R') && state === 'in_search') {
            searchContent = searchContent.replace(/\n/g, '\n').replace(/\n$/, '');
            state = 'in_replace';
            newContent = '';
        }
        else if (line.startsWith('>>>>>>> §R') && state === 'in_replace') {
            if (currentFilePath) {
                operations.push({
                    type: 'search_and_replace',
                    filePath: currentFilePath,
                    startLine: currentSearchStartLine || 0,
                    search: searchContent,
                    replace: newContent.replace(/\n/g, '\n').replace(/\n$/, '')
                });
            }
            state = 'idle';
        }
        else if (line.startsWith('<<<<<<< §I')) {
            state = 'in_insert';
            const lineNumberMatch = line.match(/:line:(\d+)/);
            if (lineNumberMatch) {
                lineNumber = parseInt(lineNumberMatch[1], 10);
            }
            newContent = '';
        }
        else if (line.startsWith('>>>>>>> §I') && state === 'in_insert') {
            if (currentFilePath && lineNumber) {
                operations.push({ type: "insert", filePath: currentFilePath, lineNumber: lineNumber, newContent: newContent.replace(/\n/g, '\n').replace(/\n$/, '') });
            }
            state = 'idle';
        }
        else if (line.startsWith('<<<<<<< §D')) {
            const lineRangeMatch = line.match(/:lines:(\d+)-(\d+)/);
            if (lineRangeMatch && currentFilePath) {
                startLine = parseInt(lineRangeMatch[1], 10);
                endLine = parseInt(lineRangeMatch[2], 10);
                operations.push({ type: 'delete', filePath: currentFilePath, startLine, endLine });
            }
        }
        else if (line.startsWith('<<<<<<< §A')) {
            state = 'in_append';
            newContent = '';
        }
        else if (line.startsWith('>>>>>>> §A') && state === 'in_append') {
            if (currentFilePath) {
                operations.push({ type: 'append', filePath: currentFilePath, newContent: newContent.replace(/\n/g, '\n').replace(/\n$/, '') });
            }
            state = 'idle';
        }
        else if (line.startsWith('<<<<<<< §C')) {
            state = 'in_create';
            newContent = '';
        }
        else if (line.startsWith('>>>>>>> §C') && state === 'in_create') {
            if (currentFilePath) {
                operations.push({ type: 'create_file', filePath: currentFilePath, content: newContent.replace(/\n/g, '\n').replace(/\n$/, '') });
            }
            state = 'idle';
        }
        else {
            if (state === 'in_search') {
                searchContent += line + '\n';
            }
            else if (state === 'in_replace' || state === 'in_insert' || state === 'in_append' || state === 'in_create') {
                newContent += line + '\n';
            }
        }
    }
    return operations;
}
async function main() {
    const args = process.argv.slice(2);
    const luciformPath = args.find(arg => !arg.startsWith('--'));
    const dryRun = args.includes('--dry-run');
    if (!luciformPath) {
        console.error('Usage: npm run ritual [--dry-run] <path_to_luciform_file>');
        process.exit(1);
    }
    try {
        const operations = await parseLuciform(luciformPath);
        for (const op of operations) {
            try {
                await applyOperation(op, dryRun);
            }
            catch (opError) {
                console.error(`Error applying operation ${JSON.stringify(op)}: ${opError}`);
                // Decide whether to re-throw or continue
                throw opError; // Re-throw to stop execution on first error
            }
        }
    }
    catch (error) {
        console.error(`Error processing batch operations: ${error}`);
        process.exit(1);
    }
    finally {
        rl.close();
    }
}
main();
//# sourceMappingURL=execute_luciform.js.map