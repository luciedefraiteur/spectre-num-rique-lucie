"use strict";
// src/core/batch_editor.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyBatchEdits = applyBatchEdits;
const fs_1 = require("fs");
const log_writers_1 = require("./log_writers");
async function applyBatchEdits(edits, currentWorkingDirectory) {
    const results = [];
    for (const edit of edits) {
        const absolutePath = edit.filePath; // Assuming absolute paths are provided or resolved before this point
        let success = false;
        let message = '';
        try {
            switch (edit.type) {
                case 'replace':
                    if (!edit.oldContent || !edit.newContent) {
                        throw new Error("Replace edit requires oldContent and newContent.");
                    }
                    if (!(0, fs_1.existsSync)(absolutePath)) {
                        throw new Error(`File not found for replace: ${absolutePath}`);
                    }
                    let content = (0, fs_1.readFileSync)(absolutePath, 'utf-8');
                    const newContent = content.replace(edit.oldContent, edit.newContent);
                    (0, fs_1.writeFileSync)(absolutePath, newContent, 'utf-8');
                    success = true;
                    message = `Replaced content in ${absolutePath}`;
                    break;
                case 'create':
                    if (!edit.newContent) {
                        throw new Error("Create edit requires newContent.");
                    }
                    (0, fs_1.writeFileSync)(absolutePath, edit.newContent, 'utf-8');
                    success = true;
                    message = `Created file ${absolutePath}`;
                    break;
                // Other edit types (insert, append, delete) would be implemented here
                default:
                    throw new Error(`Unsupported edit type: ${edit.type}`);
            }
        }
        catch (error) {
            success = false;
            message = `Failed to apply edit to ${absolutePath}: ${error.message}`;
            (0, log_writers_1.logToFile)('lucie_edits.log', message);
        }
        results.push({ success, message });
    }
    return results;
}
//# sourceMappingURL=batch_editor.js.map