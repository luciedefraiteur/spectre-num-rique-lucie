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
exports.launchGolem = launchGolem;
const luciform_core_1 = require("luciform-core");
const child_process_1 = require("child_process");
const net = __importStar(require("net"));
async function isPortTaken(port) {
    return new Promise((resolve) => {
        const tester = net.createServer()
            .once('error', (err) => { err.code === 'EADDRINUSE' ? resolve(true) : resolve(false); })
            .once('listening', () => {
            tester.once('close', () => { resolve(false); }).close();
        })
            .listen(port);
    });
}
async function waitForPort(port, timeout = 30000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        if (await isPortTaken(port)) {
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    return false;
}
async function launchGolem(persona, isInteractive, clientCommands, testInputs, model = luciform_core_1.LLMModel.Mistral) {
    if (isInteractive) {
        const golemPort = 3031;
        process.env.GOLEM_PORT = golemPort.toString();
        // Start Golem Server
        console.log(`[Golem Launcher] Starting Golem Server on port ${golemPort}...`);
        const serverProcess = (0, child_process_1.spawn)('node', ['dist/golem_server.js'], { stdio: 'inherit' });
        serverProcess.on('error', (err) => {
            console.error(`[Golem Server] Failed to start: ${err.message}`);
        });
        // Wait for server to be ready
        const serverReady = await waitForPort(golemPort);
        if (!serverReady) {
            console.error('[Golem Launcher] Golem Server did not start in time.');
            serverProcess.kill();
            return;
        }
        console.log('[Golem Launcher] Golem Server is ready.');
        // Start Golem Client
        console.log('[Golem Launcher] Starting Golem Client...');
        const clientProcess = (0, child_process_1.spawn)('node', ['dist/golem_client.js', ...clientCommands], { stdio: 'inherit' });
        clientProcess.on('close', (code) => {
            console.log(`[Golem Client] Exited with code ${code}`);
            serverProcess.kill(); // Kill server when client exits
        });
        clientProcess.on('error', (err) => {
            console.error(`[Golem Client] Failed to start: ${err.message}`);
            serverProcess.kill();
        });
        // Keep the launcher process alive until client or server exits
        return new Promise((resolve) => {
            serverProcess.on('close', resolve);
            clientProcess.on('close', resolve);
        });
    }
}
//# sourceMappingURL=golem_launcher.js.map