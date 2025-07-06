import * as readline from 'readline';
import {queryLLM} from './core/llm_orchestrator';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query: string): Promise<string> {
    return new Promise(resolve => rl.question(query, ans => {
        resolve(ans);
    }));
}

async function main() {
    console.log("Lucie's Terminal LLM Interface (Type 'exit' to quit)");
    const model = process.env.OLLAMA_MODEL || 'llama2'; // Default to llama2 or use env var

    while (true) {
        const prompt = await askQuestion(`Enter your prompt (using model: ${model}): `);
        if (prompt.toLowerCase() === 'exit') {
            break;
        }

        try {
            console.log("Querying LLM...");
            const response = await queryLLM(prompt, model);
            console.log("LLM Response:");
            console.log(response);
        } catch (error: any) {
            console.error(`Error querying LLM: ${error.message}`);
            if (error.message.includes('timed out')) {
                console.error("LLM query timed out. Exiting.");
                process.exit(1);
            }
        }
    }

    rl.close();
    console.log("Exiting Lucie's Terminal LLM Interface.");
}

main();