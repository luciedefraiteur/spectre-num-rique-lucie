import * as readline from 'readline';
import * as fs from 'fs/promises';
const MESSAGE_BUS_PATH = './lucie_messages.log';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
async function listenForLucie() {
    rl.on('line', async (line) => {
        if (line.trim().length > 0) {
            const timestamp = new Date().toISOString();
            const message = `${timestamp}: ${line}\n`;
            await fs.appendFile(MESSAGE_BUS_PATH, message);
            console.log(`[Lucie's voice has been heard]`);
        }
    });
    console.log("Lucie's listener is active. Speak, and your words shall be heard.");
}
listenForLucie();
