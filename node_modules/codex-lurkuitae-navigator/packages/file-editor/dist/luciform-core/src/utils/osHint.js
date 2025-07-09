"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.osHint = exports.OSContext = exports.detectedShell = void 0;
const shell_detector_1 = require("./shell_detector");
const os = __importStar(require("os"));
const isWindows = os.platform() === 'win32';
exports.detectedShell = isWindows ? (0, shell_detector_1.detectWindowsShell)() : null;
var OSContext;
(function (OSContext) {
    OSContext["WindowsCmd"] = "(Contexte : Windows, shell: cmd)";
    OSContext["WindowsPowershell"] = "(Contexte : Windows, shell: powershell)";
    OSContext["Unix"] = "(Contexte : Linux ou Unix-like, shell: POSIX)";
})(OSContext || (exports.OSContext = OSContext = {}));
exports.osHint = isWindows
    ? (exports.detectedShell === 'powershell' ? OSContext.WindowsPowershell : OSContext.WindowsCmd)
    : OSContext.Unix;
//# sourceMappingURL=osHint.js.map