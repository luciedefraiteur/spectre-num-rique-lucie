import 'dotenv/config';
import './src/bootstrap';
import { queryLLM } from './src/core/llm_orchestrator';

async function testTimeout() {
    console.log("Starting LLM timeout test...");
    console.log(`OLLAMA_HOST in test script: ${process.env.OLLAMA_HOST}`);
    try {
        // Assuming Ollama is not running or not accessible to force a timeout
        const response = await queryLLM("This is a test prompt for timeout.", "llama2");
        console.log("LLM responded (unexpected for timeout test):", response);
    } catch (error: any) {
        if (error.message.includes('timed out')) {
            console.log("SUCCESS: LLM query correctly timed out after 30 seconds.");
        } else {
            console.error("FAILURE: LLM query failed with unexpected error:", error.message);
        }
    }
    console.log("LLM timeout test finished.");
}

testTimeout();