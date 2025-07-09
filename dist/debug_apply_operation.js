import { applyOperation } from './luciform-core/batch_editor.js';
import * as path from 'path';
import * as fs from 'fs/promises';
async function scryingApplyOperation() {
    console.log("\n--- Initiating Scrying Ritual for applyOperation ---");
    const tempFilePath = path.resolve('./temp_apply_operation_test.txt');
    const initialContent = 'This is the initial content.';
    const searchContent = 'initial content';
    const replaceContent = 'new content';
    // --- Invocation 1: Create a temporary file ---
    const createOperation = {
        type: 'create_file',
        filePath: tempFilePath,
        content: initialContent
    };
    try {
        console.log(`[Divination] Attempting to create file: ${tempFilePath}`);
        await applyOperation(createOperation, false);
        console.log(`[Divination] File created successfully: ${tempFilePath}`);
    }
    catch (error) {
        console.error(`[Divination] Error creating file: ${error}`);
        return; // Abort if creation fails
    }
    // --- Invocation 2: Perform a replace operation ---
    const replaceOperation = {
        type: 'search_and_replace',
        filePath: tempFilePath,
        startLine: 0,
        search: searchContent,
        replace: replaceContent
    };
    try {
        console.log(`[Divination] Attempting to replace content in: ${tempFilePath}`);
        await applyOperation(replaceOperation, false);
        console.log(`[Divination] Content replaced successfully in: ${tempFilePath}`);
    }
    catch (error) {
        console.error(`[Divination] Error replacing content: ${error}`);
        return;
    }
    // --- Invocation 3: Verify the content ---
    try {
        const finalContent = await fs.readFile(tempFilePath, 'utf-8');
        console.log(`[Divination] Final content of ${tempFilePath}:\n${finalContent}`);
    }
    catch (error) {
        console.error(`[Divination] Error reading final content: ${error}`);
    }
    console.log("--- Scrying Ritual for applyOperation Complete ---");
}
scryingApplyOperation();
