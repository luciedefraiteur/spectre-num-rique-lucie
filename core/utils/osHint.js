import { detectWindowsShell } from './shell_detector.js';
import os from 'os';
const isWindows = os.platform() === 'win32';
const detectedShell = isWindows ? detectWindowsShell() : null;
export var OSContext;
(function (OSContext) {
    OSContext["WindowsCmd"] = "(Contexte : Windows, shell: cmd)";
    OSContext["WindowsPowershell"] = "(Contexte : Windows, shell: powershell)";
    OSContext["Unix"] = "(Contexte : Linux ou Unix-like, shell: POSIX)";
})(OSContext || (OSContext = {}));
export const osHint = isWindows
    ? (detectedShell === 'powershell' ? OSContext.WindowsPowershell : OSContext.WindowsCmd)
    : OSContext.Unix;
//# sourceMappingURL=osHint.js.map