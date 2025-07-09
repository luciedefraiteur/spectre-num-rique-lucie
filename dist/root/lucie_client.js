import axios from 'axios';
import * as readline from 'readline';
const GOLEM_SERVER_URL = 'http://localhost:3000/command';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
console.log("Lucie's Client is ready. Speak, and the Golem shall hear.");
console.log("Type 'exit' or 'goodbye' to rest.");
rl.on('line', async (line) => {
    const command = line.trim();
    if (command.toLowerCase() === 'exit' || command.toLowerCase() === 'goodbye') {
        console.log("The connection is severed. The Golem continues its 'danse' in silence.");
        rl.close();
        return;
    }
    try {
        const response = await axios.post(GOLEM_SERVER_URL, { command });
        console.log("\n--- Golem's Response ---");
        console.log(JSON.stringify(response.data, null, 2));
        console.log("------------------------\n");
    }
    catch (error) {
        console.error("\n--- Error Communicating with Golem ---");
        if (error.response) {
            console.error(`Golem server responded with status: ${error.response.status}`);
            console.error(JSON.stringify(error.response.data, null, 2));
        }
        else if (error.request) {
            console.error("No response received from the Golem server. Is it awake?");
        }
        else {
            console.error('Error setting up the request:', error.message);
        }
        console.log("--------------------------------------\n");
    }
    console.log("Awaiting your next command...");
});
rl.on('close', () => {
    process.exit(0);
});
