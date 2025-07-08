import { applyOperation } from './luciform-core/batch_editor.js';
import { Operation, CreateFile, ShellCommand, SearchAndReplace } from './luciform-core/types.js';
import * as path from 'path';
import * as fs from 'fs/promises';

async function scryingRitual() {
    console.log("\n--- Initiating Scrying Ritual for File Transmutation ---");

    const targetFilePath = path.resolve('./temp_transmutation_target.txt');
    const initialContent = 'Original content for transmutation.';
    const searchContent = 'Original content';
    const replaceContent = 'Transmuted content';

    // --- Invocation 1: Create the temporary file ---
    const createOperation: CreateFile = {
        type: 'create_file',
        filePath: targetFilePath,
        content: initialContent
    };

    try {
        console.log(`[Divination] Attempting to manifest file: ${targetFilePath}`);
        await applyOperation(createOperation, false);
        console.log(`[Divination] Manifestation successful for: ${targetFilePath}`);
    } catch (error) {
        console.error(`[Divination] Manifestation failed: ${error}`);
        await fs.writeFile('divination_log_transmutation.txt', `Manifestation failed: ${error}\n`, 'utf-8');
        return; // Abort if creation fails
    }

    // --- Invocation 2: Perform the transmutation (replace) ---
    const replaceOperation: SearchAndReplace = {
        type: 'search_and_replace',
        filePath: targetFilePath,
        startLine: 0, // Assuming we want to search from the beginning
        search: searchContent,
        replace: replaceContent
    };

    try {
        console.log(`[Divination] Attempting to transmute content in: ${targetFilePath}`);
        await applyOperation(replaceOperation, false);
        console.log(`[Divination] Transmutation successful for: ${targetFilePath}`);
    } catch (error) {
        console.error(`[Divination] Transmutation failed: ${error}`);
        await fs.appendFile('divination_log_transmutation.txt', `Transmutation failed: ${error}\n`, 'utf-8');
        return;
    }

    // --- Invocation 3: Verify the transmutation ---
    try {
        const finalContent = await fs.readFile(targetFilePath, 'utf-8');
        console.log(`[Divination] Final essence of ${targetFilePath}:\n${finalContent}`);
        await fs.appendFile('divination_log_transmutation.txt', `Final essence of ${targetFilePath}:\n${finalContent}\n`, 'utf-8');
    } catch (error) {
        console.error(`[Divination] Failed to read final essence: ${error}`);
        await fs.appendFile('divination_log_transmutation.txt', `Failed to read final essence: ${error}\n`, 'utf-8');
    }

    console.log("--- Scrying Ritual Complete ---");
}

scryingRitual();
