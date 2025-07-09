export declare const detectedShell: any;
export declare enum OSContext {
    WindowsCmd = "(Contexte : Windows, shell: cmd)",
    WindowsPowershell = "(Contexte : Windows, shell: powershell)",
    Unix = "(Contexte : Linux ou Unix-like, shell: POSIX)"
}
export declare const osHint: OSContext;
