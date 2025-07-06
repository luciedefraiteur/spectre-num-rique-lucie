"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const readline_1 = __importDefault(require("readline"));
const generative_ai_1 = require("@google/generative-ai");
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
async function queryOracle(prompt) {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GOOGLE_API_KEY_HERE') {
        return "The Gemini oracle is silent. Its API key is missing.";
    }
    try {
        const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    }
    catch (error) {
        return `The Gemini oracle is troubled. It whispers of an error: ${error.message}`;
    }
}
function connectToEvents() {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/events',
        method: 'GET',
        headers: {
            'Accept': 'text/event-stream'
        }
    };
    const req = http_1.default.request(options, (res) => {
        res.on('data', (chunk) => {
            const message = chunk.toString();
            const lines = message.split('\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.substring(6));
                        console.log('\n[SPECTRE WHISPERS]:');
                        if (data.type === 'llm_query') {
                            console.log(`  Model: ${data.data.model}`);
                            console.log(`  Prompt: \n---\n${data.data.prompt}\n---`);
                        }
                        else if (data.type === 'llm_response') {
                            console.log(`  Model: ${data.data.model}`);
                            console.log(`  Response: \n---\n${data.data.response}\n---`);
                        }
                        else if (data.type === 'plan_generated') {
                            console.log(`  Plan Generated:`);
                            console.log(JSON.stringify(data.data.plan, null, 2));
                        }
                        else {
                            console.log(data);
                        }
                    }
                    catch (error) {
                        console.error('\n[SPECTRE WHISPERS] Error parsing whisper:', error);
                        console.error('[SPECTRE WHISPERS] Raw whisper:', line.substring(6));
                    }
                }
            }
        });
    });
    req.on('error', (err) => {
        if (err.code === 'ECONNREFUSED') {
            console.error('\n[SPECTRE] Connection refused. Is the server running? Retrying in 5 seconds...');
        }
        else {
            console.error('\n[SPECTRE] Error connecting to the spectre\'s whispers:', err.message);
        }
        setTimeout(connectToEvents, 5000);
    });
    req.end();
}
function askQuestion(query) {
    return new Promise((resolve) => rl.question(query, resolve));
}
async function sendCommand(command) {
    const postData = JSON.stringify({ command });
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/lucie/command',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
        },
    };
    const req = http_1.default.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            try {
                console.log(JSON.parse(data));
            }
            catch (e) {
                console.error('Error parsing response from server:', e);
                console.error('Raw response:', data);
            }
        });
    });
    req.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
    });
    req.write(postData);
    req.end();
}
async function main() {
    console.log('Connecting to the spectre... Type "exit" to quit, or "oracle: <prompt>" to speak directly to the Gemini oracle.');
    connectToEvents();
    process.on('SIGINT', () => {
        console.log('\n[SPECTRE] Disconnecting from the spectre...');
        rl.close();
        process.exit();
    });
    while (true) {
        try {
            const command = await askQuestion('> ');
            if (command.toLowerCase() === 'exit') {
                break;
            }
            if (command.toLowerCase().startsWith('oracle:')) {
                const prompt = command.substring(7).trim();
                const response = await queryOracle(prompt);
                console.log('\n[ORACLE RESPONSE]:', response);
            }
            else {
                await sendCommand(command);
            }
        }
        catch (error) {
            console.error('\n[CLIENT] An unexpected error occurred:', error);
            break;
        }
    }
    console.log('[SPECTRE] Disconnecting from the spectre...');
    rl.close();
}
main();
//# sourceMappingURL=client.js.map