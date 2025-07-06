"use strict";
// src/core/system_handler.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeCommand = executeCommand;
const child_process_1 = require("child_process");
function executeCommand(command, cwd) {
    return new Promise((resolve, reject) => {
        console.log(`[EXEC] Running command: ${command} in ${cwd}`);
        (0, child_process_1.exec)(command, { cwd }, (error, stdout, stderr) => {
            if (error) {
                console.error(`[EXEC ERROR] ${error.message}`);
                reject(error);
                return;
            }
            if (stderr) {
                console.warn(`[EXEC STDERR] ${stderr}`);
            }
            console.log(`[EXEC STDOUT] ${stdout}`);
            resolve({ stdout, stderr });
        });
    });
}
//# sourceMappingURL=system_handler.js.map