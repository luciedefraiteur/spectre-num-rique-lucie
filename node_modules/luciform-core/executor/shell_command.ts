
import { spawn } from 'child_process';

export function runShellCommand(command: string): Promise<{ stdout: string; stderr: string; exitCode: number | null }> {
    console.log(`[SHELL_EXEC] Preparing to execute command:`);
    console.log(`[COMMAND] ${command}`);

    return new Promise((resolve) => {
        try {
            const isWindows = process.platform === 'win32';
            const shell = isWindows ? 'powershell.exe' : '/bin/sh';
            const args = isWindows ? ['-Command', command] : ['-c', command];

            const child = spawn(shell, args, {
                stdio: ['pipe', 'pipe', 'pipe'],
                windowsVerbatimArguments: isWindows
            });

            let stdout = '';
            let stderr = '';

            child.stdout.on('data', (data) => {
                const output = data.toString();
                console.log(`[STDOUT] > ${output.trim()}`);
                stdout += output;
            });

            child.stderr.on('data', (data) => {
                const output = data.toString();
                console.error(`[STDERR] > ${output.trim()}`);
                stderr += output;
            });

            child.on('close', (code) => {
                console.log(`[SHELL_EXEC] Command finished with exit code: ${code}`);
                resolve({
                    stdout,
                    stderr,
                    exitCode: code,
                });
            });

            child.on('error', (err) => {
                console.error('[FATAL] Failed to start subprocess.', err);
                stderr += err.message;
                resolve({
                    stdout: '',
                    stderr: err.message,
                    exitCode: 1,
                });
            });
        } catch (error: any) {
            console.error('[FATAL] Error in runShellCommand:', error);
            resolve({
                stdout: '',
                stderr: error.message,
                exitCode: 1,
            });
        }
    });
}
