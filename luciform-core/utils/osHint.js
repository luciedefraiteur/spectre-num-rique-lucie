"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.osHint = exports.OSContext = exports.detectedShell = void 0;
var shell_detector_js_1 = require("./shell_detector.js");
var os = require("os");
var isWindows = os.platform() === 'win32';
exports.detectedShell = isWindows ? (0, shell_detector_js_1.detectWindowsShell)() : null;
var OSContext;
(function (OSContext) {
    OSContext["WindowsCmd"] = "(Contexte : Windows, shell: cmd)";
    OSContext["WindowsPowershell"] = "(Contexte : Windows, shell: powershell)";
    OSContext["Unix"] = "(Contexte : Linux ou Unix-like, shell: POSIX)";
})(OSContext || (exports.OSContext = OSContext = {}));
exports.osHint = isWindows
    ? (exports.detectedShell === 'powershell' ? OSContext.WindowsPowershell : OSContext.WindowsCmd)
    : OSContext.Unix;
