// src/core/system_handler.ts

import { exec } from 'child_process';

export function executeCommand(command: string, cwd: string): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
        console.log(`[EXEC] Running command: ${command} in ${cwd}`);
        exec(command, { cwd }, (error, stdout, stderr) => {
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
