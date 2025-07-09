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
const path = __importStar(require("path"));
async function applyEdits(edits) {
    const results = [];
    for (const fileEdit of edits) {
        const absolutePath = path.resolve(process.cwd(), fileEdit.filePath);
        console.log(`Processing file: ${absolutePath}`);
        try {
            let content = '';
            let modifiedContent = '';
            // For operations that require reading existing content
            if (fileEdit.edits.some(op => op.type !== 'create')) {
                try {
                    content = await fs.readFile(absolutePath, 'utf-8');
                    modifiedContent = content;
                }
                catch (readError) {
                    if (readError.code === 'ENOENT') {
                        console.warn(`  File not found: ${absolutePath}. Skipping read-dependent operations.`);
                        // Continue to next fileEdit if file doesn't exist for read-dependent ops
                        continue;
                    }
                    else {
                        throw readError;
                    }
                }
            }
            for (const operation of fileEdit.edits) {
                switch (operation.type) {
                    case 'create':
                        if (operation.content !== undefined) {
                            await fs.writeFile(absolutePath, operation.content, 'utf-8');
                            console.log(`  Created file: ${absolutePath}.`);
                        }
                        else {
                            console.warn(`  Skipping create operation for ${absolutePath}: missing content.`);
                        }
                        break;
                    case 'insert':
                        if (operation.position !== undefined && operation.content !== undefined) {
                            modifiedContent = modifiedContent.slice(0, operation.position) + operation.content + modifiedContent.slice(operation.position);
                            console.log(`  Inserted content at position ${operation.position}.`);
                        }
                        else {
                            console.warn(`  Skipping insert operation for ${absolutePath}: missing position or content.`);
                        }
                        break;
                    case 'replace':
                        if (operation.oldString !== undefined && operation.newString !== undefined) {
                            const originalLength = modifiedContent.length;
                            modifiedContent = modifiedContent.replace(operation.oldString, operation.newString);
                            if (modifiedContent.length === originalLength) {
                                console.warn(`  Warning: Old string not found for replacement in ${absolutePath}.`);
                            }
                            else {
                                console.log(`  Replaced "${operation.oldString.substring(0, 20)}..." with "${operation.newString.substring(0, 20)}...".`);
                            }
                        }
                        else {
                            console.warn(`  Skipping replace operation for ${absolutePath}: missing oldString or newString.`);
                        }
                        break;
                    case 'delete':
                        if (operation.position !== undefined && operation.length !== undefined) {
                            modifiedContent = modifiedContent.slice(0, operation.position) + modifiedContent.slice(operation.position + operation.length);
                            console.log(`  Deleted ${operation.length} characters from position ${operation.position}.`);
                        }
                        else {
                            console.warn(`  Skipping delete operation for ${absolutePath}: missing position or length.`);
                        }
                        break;
                    case 'read_part':
                        if (operation.start !== undefined && operation.end !== undefined) {
                            const part = content.substring(operation.start, operation.end);
                            console.log(`  Read part from ${operation.start} to ${operation.end}: "${part.substring(0, 50)}...".`);
                            results.push({
                                type: 'read_part_result',
                                filePath: fileEdit.filePath,
                                start: operation.start,
                                end: operation.end,
                                content: part
                            });
                        }
                        else {
                            console.warn(`  Skipping read_part operation for ${absolutePath}: missing start or end.`);
                        }
                        break;
                    default:
                        console.warn(`  Unknown operation type: ${operation.type} for ${absolutePath}.`);
                }
            }
            // Write back modified content if any modifications were made
            if (modifiedContent !== content) {
                await fs.writeFile(absolutePath, modifiedContent, 'utf-8');
                console.log(`Successfully applied all modifications to ${absolutePath}.`);
            }
        }
        catch (error) {
            console.error(`Error processing file ${absolutePath}: ${error.message}`);
        }
    }
    return results;
}
async function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('Usage: node file_editor_program.js <path_to_edits_json_file> [output_log_file]');
        process.exit(1);
    }
    const editsFilePath = path.resolve(process.cwd(), args[0]);
    const outputLogFile = args[1] ? path.resolve(process.cwd(), args[1]) : undefined;
    let capturedOutput = '';
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    // Redirect console output
    console.log = (...messages) => {
        const msg = messages.join(' ');
        originalLog(msg);
        capturedOutput += msg + '\n';
    };
    console.error = (...messages) => {
        const msg = messages.join(' ');
        originalError(msg);
        capturedOutput += `ERROR: ${msg}\n`;
    };
    console.warn = (...messages) => {
        const msg = messages.join(' ');
        originalWarn(msg);
        capturedOutput += `WARN: ${msg}\n`;
    };
    try {
        console.log(`Reading edits from: ${editsFilePath}`);
        const editsJson = await fs.readFile(editsFilePath, 'utf-8');
        const edits = JSON.parse(editsJson);
        const results = await applyEdits(edits);
        console.log('All specified file edits processed.');
        if (outputLogFile) {
            await fs.writeFile(outputLogFile, capturedOutput + JSON.stringify(results, null, 2), 'utf-8');
            originalLog(`Output and results written to: ${outputLogFile}`);
        }
    }
    catch (error) {
        console.error(`Failed to read or parse edits file ${editsFilePath}: ${error.message}`);
        if (outputLogFile) {
            await fs.writeFile(outputLogFile, capturedOutput + `ERROR: Failed to read or parse edits file ${editsFilePath}: ${error.message}\n`, 'utf-8');
        }
        process.exit(1);
    }
    finally {
        // Restore original console functions
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;
    }
}
main();
//# sourceMappingURL=file_editor_program.js.map