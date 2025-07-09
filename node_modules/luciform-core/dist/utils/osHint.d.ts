export declare const detectedShell: import("./shell_detector.js").ShellType | null;
export declare enum OSContext {
    WindowsCmd = "(Contexte : Windows, shell: cmd)",
    WindowsPowershell = "(Contexte : Windows, shell: powershell)",
    Unix = "(Contexte : Linux ou Unix-like, shell: POSIX)"
}
export declare const osHint: OSContext;
