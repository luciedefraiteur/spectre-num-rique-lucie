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
exports.executeLuciform = executeLuciform;
var fs = require("fs/promises");
var parser_js_1 = require("./core/luciform_parser/parser.js");
var shade_os_js_1 = require("./core/shade_os.js");
var log_writers_js_1 = require("./core/log_writers.js");
var personas_js_1 = require("./core/personas.js");
// Fonction utilitaire pour exécuter des commandes shell
var child_process_1 = require("child_process");
function runShellCommand(command) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("[SHELL_EXEC] Preparing to execute command:");
            console.log("[COMMAND] ".concat(command));
            return [2 /*return*/, new Promise(function (resolve) {
                    var isWindows = process.platform === 'win32';
                    var shell = isWindows ? 'powershell.exe' : '/bin/sh';
                    var args = isWindows ? ['-Command', command] : ['-c', command];
                    var child = (0, child_process_1.spawn)(shell, args, {
                        stdio: ['pipe', 'pipe', 'pipe'],
                        windowsVerbatimArguments: isWindows
                    });
                    var stdout = '';
                    var stderr = '';
                    child.stdout.on('data', function (data) {
                        var output = data.toString();
                        console.log("[STDOUT] > ".concat(output.trim()));
                        stdout += output;
                    });
                    child.stderr.on('data', function (data) {
                        var output = data.toString();
                        console.error("[STDERR] > ".concat(output.trim()));
                        stderr += output;
                    });
                    child.on('close', function (code) {
                        console.log("[SHELL_EXEC] Command finished with exit code: ".concat(code));
                        resolve({
                            stdout: stdout,
                            stderr: stderr,
                            exitCode: code,
                        });
                    });
                    child.on('error', function (err) {
                        console.error('[FATAL] Failed to start subprocess.', err);
                        stderr += err.message;
                        resolve({
                            stdout: stdout,
                            stderr: stderr,
                            exitCode: 1,
                        });
                    });
                })];
        });
    });
}
function executeOperation(operation) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, shellOp, parts, personaName, message, personaResponse_1, result, tsFileOp, tsNodeCommand, tsResult, createOp, promenadeOp, generatedLuciformContent, askOp_1, rl_1, answer, messageOp, askQuestionOp, personaResponse;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = operation.type;
                    switch (_a) {
                        case 'shell_command': return [3 /*break*/, 1];
                        case 'execute_typescript_file': return [3 /*break*/, 6];
                        case 'create_file': return [3 /*break*/, 8];
                        case 'promenade': return [3 /*break*/, 10];
                        case 'ask_lucie': return [3 /*break*/, 17];
                        case 'message': return [3 /*break*/, 20];
                        case 'ask_question': return [3 /*break*/, 21];
                    }
                    return [3 /*break*/, 23];
                case 1:
                    shellOp = operation;
                    console.log("[INFO] Executing shell command:");
                    console.log("[CMD] ".concat(shellOp.command));
                    if (!shellOp.command.startsWith('@')) return [3 /*break*/, 3];
                    parts = shellOp.command.split(' ');
                    personaName = parts[0].substring(1);
                    message = parts.slice(1).join(' ');
                    return [4 /*yield*/, (0, personas_js_1.getPersonaResponse)(personaName, message)];
                case 2:
                    personaResponse_1 = _b.sent();
                    console.log("[PERSONA] ".concat(personaName, " says: ").concat(personaResponse_1));
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, runShellCommand(shellOp.command)];
                case 4:
                    result = _b.sent();
                    console.log("[STDOUT] ".concat(result.stdout));
                    console.error("[STDERR] ".concat(result.stderr));
                    if (result.exitCode !== 0) {
                        throw new Error("Shell command failed with exit code ".concat(result.exitCode));
                    }
                    console.log("[SUCCESS] Shell command executed successfully.");
                    _b.label = 5;
                case 5: return [3 /*break*/, 24];
                case 6:
                    tsFileOp = operation;
                    console.log("Ex\u00E9cution du fichier TypeScript: ".concat(tsFileOp.filePath));
                    tsNodeCommand = "ts-node ".concat(tsFileOp.filePath);
                    return [4 /*yield*/, runShellCommand(tsNodeCommand)];
                case 7:
                    tsResult = _b.sent();
                    console.log("Stdout: ".concat(tsResult.stdout));
                    console.error("Stderr: ".concat(tsResult.stderr));
                    if (tsResult.exitCode !== 0) {
                        throw new Error("L'ex\u00E9cution du fichier TypeScript a \u00E9chou\u00E9 avec le code ".concat(tsResult.exitCode));
                    }
                    return [3 /*break*/, 24];
                case 8:
                    createOp = operation;
                    if (typeof createOp.content !== 'string') {
                        throw new TypeError("Invalid 'create_file' operation: 'content' property must be a string.");
                    }
                    console.log("[INFO] Creating file: ".concat(createOp.filePath));
                    return [4 /*yield*/, fs.writeFile(createOp.filePath, createOp.content, 'utf-8')];
                case 9:
                    _b.sent();
                    console.log("[SUCCESS] File created: ".concat(createOp.filePath));
                    return [3 /*break*/, 24];
                case 10:
                    promenadeOp = operation;
                    return [4 /*yield*/, process.stdout.write("[PROMENADE] Starting promenade: ".concat(promenadeOp.description, "\n"))];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, (0, shade_os_js_1.invokeShadeOs)(promenadeOp.description, 'lucie', null, null, null)];
                case 12:
                    generatedLuciformContent = _b.sent();
                    if (!generatedLuciformContent) return [3 /*break*/, 14];
                    // For now, just log the generated luciform content. In a real scenario,
                    // this would be executed or saved as a new ritual.
                    console.log("[PROMENADE] ShadeOs generated a new luciform:\n".concat(generatedLuciformContent));
                    // Optionally, save the generated luciform to a file
                    return [4 /*yield*/, fs.writeFile('generated_promenade_ritual.luciform', generatedLuciformContent, 'utf-8')];
                case 13:
                    // Optionally, save the generated luciform to a file
                    _b.sent();
                    console.log("Generated promenade ritual saved to generated_promenade_ritual.luciform");
                    return [3 /*break*/, 16];
                case 14: return [4 /*yield*/, process.stderr.write("[ERROR] ShadeOs failed to generate a luciform for promenade: ".concat(promenadeOp.description, "\n"))];
                case 15:
                    _b.sent();
                    _b.label = 16;
                case 16: return [3 /*break*/, 24];
                case 17:
                    askOp_1 = operation;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('readline'); })];
                case 18:
                    rl_1 = (_b.sent()).createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });
                    return [4 /*yield*/, new Promise(function (resolve) {
                            rl_1.question(askOp_1.question + ' ', resolve);
                        })];
                case 19:
                    answer = _b.sent();
                    rl_1.close();
                    // The answer is not used yet, but this completes the conversational loop.
                    return [3 /*break*/, 24];
                case 20:
                    messageOp = operation;
                    console.log("[MESSAGE] ".concat(messageOp.message));
                    return [3 /*break*/, 24];
                case 21:
                    askQuestionOp = operation;
                    console.log("[INFO] Asking persona ".concat(askQuestionOp.persona, " a question."));
                    return [4 /*yield*/, (0, personas_js_1.getPersonaResponse)(askQuestionOp.persona, askQuestionOp.question)];
                case 22:
                    personaResponse = _b.sent();
                    console.log("[PERSONA_RESPONSE] ".concat(askQuestionOp.persona, " says: ").concat(personaResponse));
                    return [3 /*break*/, 24];
                case 23: throw new Error("Unknown operation type: ".concat(operation.type));
                case 24: return [2 /*return*/];
            }
        });
    });
}
function executeLuciform(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var content, mogReport, error_1, logError_1, luciformDocument, totalSteps, completedSteps, i, pas, currentStep, logError_2, operation, _a, promenadeAction, generatedLuciformContent, jsonAction, messageAction, logError_3, logError_4, logError_5, logError_6, error_2, errorMessage, logError_7, finalReport_1, logError_8, logError_9, finalReport, logError_10;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("[DEBUG] Starting executeLuciform for: ".concat(filePath));
                    return [4 /*yield*/, fs.readFile(filePath, 'utf-8')];
                case 1:
                    content = _b.sent();
                    mogReport = "";
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 5, , 7]);
                    return [4 /*yield*/, (0, personas_js_1.getPersonaResponse)('mog', "Analyze the following ritual:\n\n".concat(content))];
                case 3:
                    mogReport = _b.sent();
                    console.log(mogReport);
                    return [4 /*yield*/, (0, log_writers_js_1.logRitual)("[MOG REPORT]\n".concat(mogReport))];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 5:
                    error_1 = _b.sent();
                    console.error("[ERROR] Failed to get MOG report: ".concat(error_1.message));
                    mogReport = "[MOG REPORT UNAVAILABLE] Error: ".concat(error_1.message);
                    return [4 /*yield*/, (0, log_writers_js_1.logRitual)(mogReport)];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 7:
                    _b.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, (0, log_writers_js_1.logRitual)("[RITUAL START] Executing luciform: ".concat(filePath))];
                case 8:
                    _b.sent();
                    return [3 /*break*/, 10];
                case 9:
                    logError_1 = _b.sent();
                    process.stderr.write("[ERROR] Failed to write RITUAL START to ritual.log: ".concat(logError_1.message, "\n"));
                    return [3 /*break*/, 10];
                case 10:
                    luciformDocument = (0, parser_js_1.parseLuciformDocument)(content);
                    totalSteps = luciformDocument.pas.length;
                    completedSteps = 0;
                    i = 0;
                    _b.label = 11;
                case 11:
                    if (!(i < totalSteps)) return [3 /*break*/, 55];
                    pas = luciformDocument.pas[i];
                    currentStep = i + 1;
                    console.log("[DEBUG] Processing step ".concat(currentStep, "/").concat(totalSteps));
                    _b.label = 12;
                case 12:
                    _b.trys.push([12, 14, , 15]);
                    return [4 /*yield*/, (0, log_writers_js_1.logRitual)("\n[STEP ".concat(currentStep, " / ").concat(totalSteps, "] Processing..."))];
                case 13:
                    _b.sent();
                    return [3 /*break*/, 15];
                case 14:
                    logError_2 = _b.sent();
                    process.stderr.write("[ERROR] Failed to write STEP Processing log: ".concat(logError_2.message, "\n"));
                    return [3 /*break*/, 15];
                case 15:
                    _b.trys.push([15, 44, , 54]);
                    if (!pas.action) return [3 /*break*/, 39];
                    operation = null;
                    _a = pas.action.type;
                    switch (_a) {
                        case 'promenade': return [3 /*break*/, 16];
                        case 'json_action': return [3 /*break*/, 21];
                        case 'message': return [3 /*break*/, 22];
                    }
                    return [3 /*break*/, 23];
                case 16:
                    promenadeAction = pas.action;
                    operation = { type: 'promenade', description: promenadeAction.description };
                    console.log("[DEBUG] Promenade operation detected: ".concat(promenadeAction.description));
                    return [4 /*yield*/, (0, shade_os_js_1.invokeShadeOs)(promenadeAction.description, 'lucie', null, null, null)];
                case 17:
                    generatedLuciformContent = _b.sent();
                    if (!generatedLuciformContent) return [3 /*break*/, 19];
                    console.log("[DEBUG] ShadeOs generated luciform content. Length: ".concat(generatedLuciformContent.length));
                    return [4 /*yield*/, fs.writeFile('generated_promenade_ritual.luciform', generatedLuciformContent, 'utf-8')];
                case 18:
                    _b.sent();
                    console.log("Generated promenade ritual saved to generated_promenade_ritual.luciform");
                    return [3 /*break*/, 20];
                case 19:
                    console.error("[ERROR] ShadeOs failed to generate a luciform for promenade: ".concat(promenadeAction.description));
                    _b.label = 20;
                case 20: return [3 /*break*/, 24];
                case 21:
                    jsonAction = pas.action;
                    // Check if the operation is an ExecutableOperation
                    if (jsonAction.operation.type === 'shell_command' ||
                        jsonAction.operation.type === 'execute_typescript_file' ||
                        jsonAction.operation.type === 'create_file' ||
                        jsonAction.operation.type === 'promenade' ||
                        jsonAction.operation.type === 'ask_lucie' ||
                        jsonAction.operation.type === 'message' ||
                        jsonAction.operation.type === 'ask_question') {
                        operation = jsonAction.operation;
                        console.log("[DEBUG] JSON action operation detected: ".concat(operation.type));
                    }
                    else {
                        console.warn("[WARN] Non-executable operation type found in JSON action: ".concat(jsonAction.operation.type));
                    }
                    return [3 /*break*/, 24];
                case 22:
                    messageAction = pas.action;
                    operation = { type: 'message', message: messageAction.message };
                    console.log("[DEBUG] Message operation detected: ".concat(messageAction.message));
                    return [3 /*break*/, 24];
                case 23: throw new Error("Unknown action type: ".concat(pas.action.type));
                case 24:
                    if (!operation) return [3 /*break*/, 34];
                    console.log("[DEBUG] Executing operation of type: ".concat(operation.type));
                    _b.label = 25;
                case 25:
                    _b.trys.push([25, 27, , 28]);
                    return [4 /*yield*/, (0, log_writers_js_1.logRitual)("[OPERATION] Found operation of type: ".concat(operation.type))];
                case 26:
                    _b.sent();
                    return [3 /*break*/, 28];
                case 27:
                    logError_3 = _b.sent();
                    process.stderr.write("[ERROR] Failed to write OPERATION log: ".concat(logError_3.message, "\n"));
                    return [3 /*break*/, 28];
                case 28: return [4 /*yield*/, executeOperation(operation)];
                case 29:
                    _b.sent();
                    completedSteps++;
                    _b.label = 30;
                case 30:
                    _b.trys.push([30, 32, , 33]);
                    return [4 /*yield*/, (0, log_writers_js_1.logRitual)("[STEP ".concat(currentStep, " / ").concat(totalSteps, "] Completed successfully."))];
                case 31:
                    _b.sent();
                    return [3 /*break*/, 33];
                case 32:
                    logError_4 = _b.sent();
                    process.stderr.write("[ERROR] Failed to write STEP Completed log: ".concat(logError_4.message, "\n"));
                    return [3 /*break*/, 33];
                case 33: return [3 /*break*/, 38];
                case 34:
                    console.warn("[DEBUG] No operation to execute for step ".concat(currentStep));
                    _b.label = 35;
                case 35:
                    _b.trys.push([35, 37, , 38]);
                    return [4 /*yield*/, (0, log_writers_js_1.logRitual)("[WARN] No valid operation derived from action in step ".concat(currentStep))];
                case 36:
                    _b.sent();
                    return [3 /*break*/, 38];
                case 37:
                    logError_5 = _b.sent();
                    process.stderr.write("[ERROR] Failed to write WARN log: ".concat(logError_5.message, "\n"));
                    return [3 /*break*/, 38];
                case 38: return [3 /*break*/, 43];
                case 39:
                    console.warn("[DEBUG] No action block found for step ".concat(currentStep));
                    _b.label = 40;
                case 40:
                    _b.trys.push([40, 42, , 43]);
                    return [4 /*yield*/, (0, log_writers_js_1.logRitual)("[WARN] No action block found in step ".concat(currentStep))];
                case 41:
                    _b.sent();
                    return [3 /*break*/, 43];
                case 42:
                    logError_6 = _b.sent();
                    process.stderr.write("[ERROR] Failed to write WARN log: ".concat(logError_6.message, "\n"));
                    return [3 /*break*/, 43];
                case 43: return [3 /*break*/, 54];
                case 44:
                    error_2 = _b.sent();
                    errorMessage = "Error during step ".concat(currentStep, ": ").concat(error_2.message);
                    console.error("[DEBUG] Error caught in step ".concat(currentStep, ": ").concat(errorMessage));
                    _b.label = 45;
                case 45:
                    _b.trys.push([45, 47, , 48]);
                    return [4 /*yield*/, (0, log_writers_js_1.logRitual)("[ERROR] ".concat(errorMessage))];
                case 46:
                    _b.sent();
                    return [3 /*break*/, 48];
                case 47:
                    logError_7 = _b.sent();
                    process.stderr.write("[ERROR] Failed to write ERROR log: ".concat(logError_7.message, "\n"));
                    return [3 /*break*/, 48];
                case 48: return [4 /*yield*/, (0, personas_js_1.getPersonaResponse)('mog', "The ritual has failed. Please provide a final report based on the following status: ".concat(JSON.stringify({ success: false, completedSteps: completedSteps, totalSteps: totalSteps, failedStep: currentStep, error: errorMessage }, null, 2)))];
                case 49:
                    finalReport_1 = _b.sent();
                    console.log(finalReport_1);
                    _b.label = 50;
                case 50:
                    _b.trys.push([50, 52, , 53]);
                    return [4 /*yield*/, (0, log_writers_js_1.logRitual)("[MOG FINAL REPORT]\n".concat(finalReport_1))];
                case 51:
                    _b.sent();
                    return [3 /*break*/, 53];
                case 52:
                    logError_8 = _b.sent();
                    process.stderr.write("[ERROR] Failed to write MOG FINAL REPORT log: ".concat(logError_8.message, "\n"));
                    return [3 /*break*/, 53];
                case 53: return [2 /*return*/, {
                        success: false,
                        completedSteps: completedSteps,
                        totalSteps: totalSteps,
                        failedStep: currentStep,
                        error: errorMessage,
                    }];
                case 54:
                    i++;
                    return [3 /*break*/, 11];
                case 55:
                    console.log("[DEBUG] All steps processed. Finalizing ritual.");
                    _b.label = 56;
                case 56:
                    _b.trys.push([56, 58, , 59]);
                    return [4 /*yield*/, (0, log_writers_js_1.logRitual)("\n[RITUAL SUCCESS] All ".concat(totalSteps, " steps completed successfully."))];
                case 57:
                    _b.sent();
                    return [3 /*break*/, 59];
                case 58:
                    logError_9 = _b.sent();
                    process.stderr.write("[ERROR] Failed to write RITUAL SUCCESS log: ".concat(logError_9.message, "\n"));
                    return [3 /*break*/, 59];
                case 59: return [4 /*yield*/, (0, personas_js_1.getPersonaResponse)('mog', "The ritual has finished. Please provide a final report based on the following status: ".concat(JSON.stringify({ success: true, completedSteps: completedSteps, totalSteps: totalSteps }, null, 2)))];
                case 60:
                    finalReport = _b.sent();
                    console.log(finalReport);
                    _b.label = 61;
                case 61:
                    _b.trys.push([61, 63, , 64]);
                    return [4 /*yield*/, (0, log_writers_js_1.logRitual)("[MOG FINAL REPORT]\n".concat(finalReport))];
                case 62:
                    _b.sent();
                    return [3 /*break*/, 64];
                case 63:
                    logError_10 = _b.sent();
                    process.stderr.write("[ERROR] Failed to write MOG FINAL REPORT log: ".concat(logError_10.message, "\n"));
                    return [3 /*break*/, 64];
                case 64: return [2 /*return*/, {
                        success: true,
                        completedSteps: completedSteps,
                        totalSteps: totalSteps,
                    }];
            }
        });
    });
}
