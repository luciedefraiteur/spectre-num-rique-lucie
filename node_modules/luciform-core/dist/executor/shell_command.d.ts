export declare function runShellCommand(command: string): Promise<{
    stdout: string;
    stderr: string;
    exitCode: number | null;
}>;
