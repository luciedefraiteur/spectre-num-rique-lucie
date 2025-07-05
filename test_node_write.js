const fs = require('fs').promises;

async function testWrite() {
    try {
        await fs.writeFile('test_node_output.txt', 'Hello from test_node_write.js!', 'utf-8');
        console.log('test_node_output.txt created successfully.');
    } catch (error) {
        console.error(`Error writing test_node_output.txt: ${error}`);
    }
}

testWrite();