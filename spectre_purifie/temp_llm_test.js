"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("./src/bootstrap");
const llm_orchestrator_1 = require("./src/core/llm_orchestrator");
async function testTimeout() {
    console.log("Starting LLM timeout test...");
    console.log(`OLLAMA_HOST in test script: ${process.env.OLLAMA_HOST}`);
    try {
        // Assuming Ollama is not running or not accessible to force a timeout
        const response = await (0, llm_orchestrator_1.queryLLM)("This is a test prompt for timeout.", "llama2");
        console.log("LLM responded (unexpected for timeout test):", response);
    }
    catch (error) {
        if (error.message.includes('timed out')) {
            console.log("SUCCESS: LLM query correctly timed out after 30 seconds.");
        }
        else {
            console.error("FAILURE: LLM query failed with unexpected error:", error.message);
        }
    }
    console.log("LLM timeout test finished.");
}
testTimeout();
//# sourceMappingURL=temp_llm_test.js.map