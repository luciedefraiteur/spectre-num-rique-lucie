export declare function executeCommand(command: string, cwd: string): Promise<{
    stdout: string;
    stderr: string;
}>;
