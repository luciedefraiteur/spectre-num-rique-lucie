"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs/promises"));
const batch_editor_ts_1 = require("./core/batch_editor.ts");
const readline = __importStar(require("readline"));
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function askQuestion(query) {
    return new Promise(resolve => rl.question(query, ans => {
        resolve(ans);
    }));
}
async function parseLuciform(filePath, args) {
    const content = await fs.readFile(filePath, 'utf-8');
    // Try parsing as JSON first
    try {
        const json = JSON.parse(content);
        if (json.incantations && Array.isArray(json.incantations)) {
            const operations = [];
            for (const incantation of json.incantations) {
                if (incantation.type === 'EXECUTE' && incantation.parameters && incantation.parameters.command) {
                    operations.push({ type: 'shell_command', command: incantation.parameters.command });
                }
                else if (incantation.type === 'APPLY_EDITS' && incantation.parameters && Array.isArray(incantation.parameters.edits)) {
                    for (const edit of incantation.parameters.edits) {
                        if (edit.type === 'create' && edit.filePath && edit.newContent) {
                            operations.push({ type: 'create_file', filePath: edit.filePath, content: edit.newContent });
                        }
                        // Add other edit types here as needed
                    }
                }
            }
            return operations;
        }
    }
    catch (e) {
        // Not a JSON file, or not in the expected format, so fall back to legacy parser
    }
    // Legacy parser
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
        let processedLine = line;
        for (let i = 0; i < args.length; i++) {
            processedLine = processedLine.replace(new RegExp(`\\$${i + 1}`, 'g'), args[i]);
        }
        processedLine = processedLine.replace(/\s*\$\d+/g, '');
        if (processedLine.startsWith('§F:')) {
            currentFilePath = processedLine.substring(3).trim();
        }
        else if (processedLine.startsWith('§X:')) {
            operations.push({ type: 'shell_command', command: processedLine.substring(3).trim() });
        }
        else if (processedLine.startsWith('§Q:')) {
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
    const cliArgs = process.argv.slice(2);
    const luciformPath = cliArgs.find(arg => !arg.startsWith('--'));
    const dryRun = cliArgs.includes('--dry-run');
    const ritualArgs = cliArgs.filter(arg => arg !== luciformPath && !arg.startsWith('--'));
    if (!luciformPath) {
        console.error('Usage: npm run ritual [--dry-run] <path_to_luciform_file> [args...]');
        process.exit(1);
    }
    try {
        const operations = await parseLuciform(luciformPath, ritualArgs);
        for (const op of operations) {
            try {
                if (dryRun) {
                    const dryRunOutput = `[DRY RUN] Operation: ${'type' in op ? op.type.toUpperCase() : 'UNKNOWN'}
  File: ${'filePath' in op ? op.filePath : 'N/A'}
${'search' in op ? `  Search: 
---
${op.search}
---` : ''}${'replace' in op ? `  Replace: 
---
${op.replace}
---` : ''}${'newContent' in op ? `  Content: 
---
${op.newContent}
---` : ''}${'command' in op ? `  Command: ${op.command}` : ''}${'lineNumber' in op ? `  Line: ${op.lineNumber}` : ''}${'startLine' in op && 'endLine' in op ? `  Lines: ${op.startLine}-${op.endLine}` : ''}
----------------------------------------
`;
                    await fs.appendFile('luciform_dry_run_temp_output.log', dryRunOutput, 'utf-8');
                }
                else {
                    await (0, batch_editor_ts_1.applyOperation)(op, dryRun);
                }
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