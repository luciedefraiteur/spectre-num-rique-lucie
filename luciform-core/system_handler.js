"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSystemCommand = handleSystemCommand;
var child_process_1 = require("child_process");
var util_1 = require("util");
var shell_detector_js_1 = require("./utils/shell_detector.js");
var os = require("os");
var osHint_js_1 = require("./utils/osHint.js");
var execAsync = (0, util_1.promisify)(child_process_1.exec);
/**
 * Exécute une commande système avec un répertoire courant facultatif.
 * @param input La commande shell à exécuter (ex: "ls -l").
 * @param cwd Le chemin absolu du répertoire depuis lequel exécuter.
 */
function handleSystemCommand(input_1, cwd_1, context_1) {
    return __awaiter(this, arguments, void 0, function (input, cwd, context, _execAsync) {
        var shell, detectedShell, _a, stdout, stderr, error_1;
        if (_execAsync === void 0) { _execAsync = execAsync; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (os.platform() === 'win32') {
                        detectedShell = (0, shell_detector_js_1.detectWindowsShell)();
                        console.log("Shell Windows d\u00E9tect\u00E9 : ".concat(detectedShell));
                        // Ici, vous pourriez adapter la commande ou le shell d'exécution
                        // en fonction de `detectedShell`.
                        // Par exemple, pour PowerShell, vous pourriez vouloir préfixer les commandes.
                        // Pour l'instant, nous laissons `exec` décider du shell par default.
                        // shell = detectedShell === 'powershell' ? 'powershell.exe' : 'cmd.exe'; // Exemple d'utilisation
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, _execAsync(input, { cwd: cwd, shell: shell })];
                case 2:
                    _a = _b.sent(), stdout = _a.stdout, stderr = _a.stderr;
                    // Update LucieDefraiteur's proto-consciousness
                    context.conduit.lastIncantation = input;
                    context.conduit.lastOutcome = stdout.trim();
                    context.conduit.currentSanctum = cwd;
                    context.conduit.terminalEssence = osHint_js_1.osHint;
                    context.conduit.osEssence = osHint_js_1.osHint;
                    context.conduit.protoConsciousness = "Lucie a ex\u00E9cut\u00E9 la commande: ".concat(input, " dans le r\u00E9pertoire: ").concat(cwd, ". Le r\u00E9sultat \u00E9tait: ").concat(stdout.trim() || stderr.trim());
                    return [2 /*return*/, {
                            success: true,
                            stdout: stdout.trim(),
                            stderr: stderr.trim(),
                            exitCode: 0,
                            error: ''
                        }];
                case 3:
                    error_1 = _b.sent();
                    context.conduit.lastIncantation = input;
                    context.conduit.lastOutcome = (error_1.stdout || '').trim() || (error_1.stderr || '').trim();
                    context.conduit.currentSanctum = cwd;
                    context.conduit.terminalEssence = osHint_js_1.osHint;
                    context.conduit.osEssence = osHint_js_1.osHint;
                    context.conduit.protoConsciousness = "Lucie a tent\u00E9 d'ex\u00E9cuter la commande: ".concat(input, " dans le r\u00E9pertoire: ").concat(cwd, ", mais une erreur est survenue: ").concat(error_1.message);
                    return [2 /*return*/, {
                            success: false,
                            stdout: (error_1.stdout || '').trim(),
                            stderr: (error_1.stderr || '').trim(),
                            exitCode: error_1.code || 1,
                            error: error_1.message,
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
