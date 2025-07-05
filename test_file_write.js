import * as fs from 'fs/promises';
async function testWrite() {
    try {
        await fs.writeFile('test_output.txt', 'Hello from test_file_write.ts!', 'utf-8');
        console.log('test_output.txt created successfully.');
    }
    catch (error) {
        console.error(`Error writing test_output.txt: ${error}`);
    }
}
testWrite();
//# sourceMappingURL=test_file_write.js.map