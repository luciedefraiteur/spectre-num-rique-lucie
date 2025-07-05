import { applyOperation } from './core/batch_editor.js';
import * as path from 'path';
async function runTest() {
    const filePath = path.resolve('./test_batch_editor_output.txt');
    const content = 'This file was created by test_batch_editor.ts';
    const operation = {
        type: 'create_file',
        filePath: filePath,
        content: content
    };
    try {
        console.log(`Attempting to create file: ${filePath}`);
        await applyOperation(operation, false);
        console.log(`Successfully created file: ${filePath}`);
    }
    catch (error) {
        console.error(`Error in test_batch_editor.ts: ${error}`);
    }
}
runTest();
//# sourceMappingURL=test_batch_editor.js.map