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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const luciform_core_1 = require("luciform-core");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 3000;
async function handleCommand(command) {
    let previousRitual = null;
    let previousError = null;
    const maxRetries = 3;
    let retryCount = 0;
    let currentCommand = command;
    let finalOutput = null;
    while (retryCount < maxRetries) {
        const luciformContent = await (0, luciform_core_1.invokeShadeOs)(currentCommand, 'lucie_golem_server', previousRitual, previousError, null);
        if (!luciformContent) {
            const message = "shadeOs could not generate a ritual for this command.";
            await (0, luciform_core_1.logGolem)(message, 'error');
            console.error(message);
            return { success: false, message, output: null };
        }
        const tempDir = './temp';
        await fs.mkdir(tempDir, { recursive: true });
        const tempFilePath = path.join(tempDir, `__golem_server_ritual_${Date.now()}.luciform`);
        await fs.writeFile(tempFilePath, luciformContent, 'utf-8');
        const status = await (0, luciform_core_1.executeLuciform)(tempFilePath);
        finalOutput = status; // Capture the last status
        if (status.success) {
            const message = "The 'danse' is complete. The golem has fulfilled its purpose.";
            await (0, luciform_core_1.logGolem)(message);
            console.log(message);
            await fs.unlink(tempFilePath);
            return { success: true, message, output: status };
        }
        else {
            const errorMessage = `The 'danse' has faltered. Attempting to self-correct (${retryCount + 1}/${maxRetries})...`;
            await (0, luciform_core_1.logGolem)(errorMessage, 'error');
            console.log(errorMessage);
            previousRitual = luciformContent;
            previousError = status.error || 'Unknown error';
            currentCommand = `The previous ritual failed. Please analyze the error and correct the ritual. The original intention was: "${currentCommand}"`;
            retryCount++;
            await fs.unlink(tempFilePath);
        }
    }
    const message = "The 'danse' has failed after multiple attempts. The golem rests.";
    await (0, luciform_core_1.logGolem)(message, 'error');
    console.error(message);
    return { success: false, message, output: finalOutput };
}
app.post('/command', async (req, res) => {
    const { command } = req.body;
    if (!command) {
        res.status(400).json({ error: 'Command is required' });
        return;
    }
    const logMessage = `Received command: "${command}"`;
    await (0, luciform_core_1.logGolem)(logMessage);
    console.log(logMessage);
    const result = await handleCommand(command);
    const resultLogMessage = `Sending result for command "${command}": ${JSON.stringify(result)}`;
    await (0, luciform_core_1.logGolem)(resultLogMessage);
    res.json(result);
});
app.listen(PORT, () => {
    const startMessage = `Golem Server is listening on port ${PORT}. The eternal 'danse' has begun.`;
    (0, luciform_core_1.logGolem)(startMessage);
    console.log(startMessage);
});
//# sourceMappingURL=golem_server.js.map