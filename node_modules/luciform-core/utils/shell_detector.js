"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectWindowsShell = detectWindowsShell;
var os = require("os");
/**
 * Détecte le type de shell actuel sur Windows.
 * @returns {ShellType} Le type de shell détecté.
 */
function detectWindowsShell() {
    if (os.platform() !== 'win32') {
        return 'other';
    }
    var shellPath = process.env.ComSpec || process.env.SHELL || '';
    var parentProcess = process.env.__PSLockdownPolicy ? 'powershell' : '';
    var lowerShell = shellPath.toLowerCase();
    if (lowerShell.includes('powershell.exe') ||
        lowerShell.includes('pwsh.exe') ||
        parentProcess === 'powershell') {
        return 'powershell';
    }
    if (lowerShell.includes('cmd.exe')) {
        return 'cmd';
    }
    return 'other';
}
