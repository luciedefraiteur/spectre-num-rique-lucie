"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
const llm_orchestrator_1 = require("./core/llm_orchestrator");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function askQuestion(query) {
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
            const response = await (0, llm_orchestrator_1.queryLLM)(prompt, model);
            console.log("LLM Response:");
            console.log(response);
        }
        catch (error) {
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
//# sourceMappingURL=terminal_llm.js.map