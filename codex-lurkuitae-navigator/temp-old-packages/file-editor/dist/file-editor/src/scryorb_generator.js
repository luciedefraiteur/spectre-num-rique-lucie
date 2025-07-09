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
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const ai_utils_js_1 = require("./ai_utils.js");
async function generateScryOrb(errorOutput, source = 'build') {
    const errors = [];
    // Basic regex to parse TypeScript errors (e.g., "file.ts(line,col): error TSxxxx: message")
    const tsErrorRegex = /(.*?)\((\d+),(\d+)\): error (TS\d+): (.*)/g;
    let match;
    // Create a minimal RitualContext for persona interaction
    const minimalContext = {
        conduit: {},
        kardiaSphere: {},
        scroll: [],
        maxScrollLength: 10,
        incantation_history: [],
        outcome_history: [],
        step_results_history: [],
        narrativeWeaving: {},
        activeReflection: null,
        user_preferences: '',
        chantModeEnabled: false,
        current_sanctum: process.cwd(),
        currentSanctumContent: '',
        operatingSystem: process.platform,
        personality: 'scryorb_generator',
        lifeSystem: {},
    };
    while ((match = tsErrorRegex.exec(errorOutput)) !== null) {
        const [, filePath, lineNumberStr, columnNumberStr, errorCode, errorMessage] = match;
        const lineNumber = parseInt(lineNumberStr);
        const columnNumber = parseInt(columnNumberStr);
        let codeContext;
        let fullFileContent;
        let aiAnalysis;
        try {
            fullFileContent = await fs.readFile(filePath.trim(), 'utf-8');
            const lines = fullFileContent.split(/\r?\n/);
            const startLine = Math.max(0, lineNumber - 6); // 5 lines before + 1 for 0-indexing
            const endLine = Math.min(lines.length, lineNumber + 5); // 5 lines after
            codeContext = lines.slice(startLine, endLine).join('\n');
            // Invoke Syngraphe for AI analysis
            const syngraphePrompt = `You are Syngraphe, the scribe-démon du Damier. Analyze this build error and provide a concise diagnosis and suggested correction.\n\nFile: ${filePath}\nLine: ${lineNumber}\nError: ${errorMessage}\n\nCode Context:\n\`\`\`\n${codeContext}\n\`\`\`\n\nFull File Content (for broader context):\n\`\`\`\n${fullFileContent}\n\`\`\`\n\nDiagnosis and Correction:`;
            aiAnalysis = await (0, ai_utils_js_1.getPersonaResponse)('Syngraphe', syngraphePrompt, minimalContext);
        }
        catch (fileError) {
            console.error(`ScryOrb Generator: Could not read file ${filePath}: ${fileError.message}`);
            codeContext = `Could not read file: ${fileError.message}`;
        }
        errors.push({
            filePath: filePath.trim(),
            lineNumber: lineNumber,
            columnNumber: columnNumber,
            errorMessage: `${errorCode}: ${errorMessage.trim()}`,
            codeContext: codeContext,
            fullFileContent: fullFileContent, // Include full content for now
            aiAnalysis: aiAnalysis,
        });
    }
    const scryOrb = {
        timestamp: new Date().toISOString(),
        source: source,
        errors: errors,
    };
    const outputFileName = `build_error_${Date.now()}.scryOrb`;
    const outputPath = path.join(process.cwd(), outputFileName); // Save in current working directory for now
    await fs.writeFile(outputPath, JSON.stringify(scryOrb, null, 2), 'utf-8');
    console.log(`ScryOrb generated: ${outputPath}`);
}
// Read from stdin if piped, otherwise expect argument
async function main() {
    let input = '';
    if (process.stdin.isTTY) {
        // Not piped, expect argument
        input = process.argv[2];
    }
    else {
        // Piped input
        for await (const chunk of process.stdin) {
            input += chunk;
        }
    }
    if (!input) {
        console.error("No error output provided to scryorb_generator.");
        process.exit(1);
    }
    await generateScryOrb(input);
}
main();
//# sourceMappingURL=scryorb_generator.js.map