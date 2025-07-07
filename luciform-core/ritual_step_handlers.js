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
exports.handleTraverse = handleTraverse;
exports.handleEnact = handleEnact;
exports.handleDivine = handleDivine;
exports.handleLull = handleLull;
exports.handleDiscourse = handleDiscourse;
exports.handleQuery = handleQuery;
exports.handleResponse = handleResponse;
exports.handlePreExecutionCheck = handlePreExecutionCheck;
exports.handleUserConfirmation = handleUserConfirmation;
exports.handleCodeGeneration = handleCodeGeneration;
exports.handleAssistedEditing = handleAssistedEditing;
exports.handleUserInput = handleUserInput;
exports.handleStepProposal = handleStepProposal;
exports.handleDreamNavigation = handleDreamNavigation;
exports.handleReflectionNavigation = handleReflectionNavigation;
exports.handleAddReflection = handleAddReflection;
exports.handleSurveil = handleSurveil;
exports.handleTerminalCommand = handleTerminalCommand;
exports.handleTerminalOutput = handleTerminalOutput;
exports.handleTerminalQuestion = handleTerminalQuestion;
var system_handler_js_1 = require("./system_handler.js");
var llm_interface_js_1 = require("./llm_interface.js");
var generateAnalysisPrompt_js_1 = require("./prompts/generateAnalysisPrompt.js");
var path = require("path");
var fs = require("fs");
var dream_parser_js_1 = require("./utils/dream_parser.js");
function handleTraverse(incantation_1, context_1) {
    return __awaiter(this, arguments, void 0, function (incantation, context, existsSync, statSync) {
        var result, newSanctum;
        if (existsSync === void 0) { existsSync = fs.existsSync; }
        if (statSync === void 0) { statSync = fs.statSync; }
        return __generator(this, function (_a) {
            result = { incantation: incantation, index: -1 };
            newSanctum = path.resolve(context.current_sanctum || process.cwd(), incantation.invocation);
            if (existsSync(newSanctum) && statSync(newSanctum).isDirectory()) {
                context.current_sanctum = newSanctum;
                result.outcome = "[OK] Sanctum changed to ".concat(newSanctum);
            }
            else {
                result.outcome = "[ERROR] Sanctum not found: ".concat(newSanctum);
            }
            return [2 /*return*/, result];
        });
    });
}
function handleEnact(incantation_1, context_1, plan_1, ask_1) {
    return __awaiter(this, arguments, void 0, function (incantation, context, plan, ask, runCommand) {
        var result, cmd, newIncantation, commandOutcome;
        if (runCommand === void 0) { runCommand = system_handler_js_1.handleSystemCommand; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = { incantation: incantation, index: -1, success: false };
                    cmd = incantation.invocation.trim();
                    if (cmd.startsWith('traverse')) {
                        newIncantation = { type: 'traverse', invocation: cmd.replace('traverse', '').trim() };
                        return [2 /*return*/, handleTraverse(newIncantation, context)];
                    }
                    return [4 /*yield*/, runCommand(cmd, context.current_sanctum, context)];
                case 1:
                    commandOutcome = _a.sent();
                    context.incantation_history.push(cmd);
                    if (context.incantation_history.length > context.maxScrollLength) {
                        context.incantation_history.shift();
                    }
                    context.outcome_history.push(commandOutcome.stdout);
                    if (context.outcome_history.length > context.maxScrollLength) {
                        context.outcome_history.shift();
                    }
                    result.outcome = commandOutcome.stdout;
                    result.stderr = commandOutcome.stderr;
                    result.exitCode = commandOutcome.exitCode;
                    result.success = commandOutcome.success;
                    if (!commandOutcome.success) {
                        console.error("[INCANTATION ERROR] '".concat(cmd, "' failed with code ").concat(commandOutcome.exitCode, ". Stderr: ").concat(commandOutcome.stderr));
                    }
                    return [2 /*return*/, result];
            }
        });
    });
}
function handleDivine(incantation, context, index, plan) {
    return __awaiter(this, void 0, void 0, function () {
        var result, lastStepResult, output, prompt, rawResponse, _a, reve, rawAnalysis, suggestionMatch, suggestedNextStep;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    result = { incantation: incantation, index: index };
                    lastStepResult = context.step_results_history.at(-1);
                    output = lastStepResult && lastStepResult.outcome !== undefined ? lastStepResult.outcome : '';
                    prompt = (0, generateAnalysisPrompt_js_1.generateAnalysisPrompt)({
                        output: output,
                        index: index,
                        plan: plan,
                        original_input: ((_b = context.scroll.at(-1)) === null || _b === void 0 ? void 0 : _b.input) || '',
                        context: context,
                    });
                    return [4 /*yield*/, llm_interface_js_1.LLMInterface.query(prompt)];
                case 1:
                    rawResponse = _c.sent();
                    _a = (0, dream_parser_js_1.extraireReveEtChargeUtile)(rawResponse), reve = _a.reve, rawAnalysis = _a.chargeUtile;
                    if (reve) {
                    }
                    suggestionMatch = rawAnalysis.match(/ACTION SUGGÉRÉE\s*:\s*(.*)/);
                    suggestedNextStep = suggestionMatch ? suggestionMatch[1].trim() : "Continuer.";
                    result.divination = {
                        poeticAnalysis: rawAnalysis,
                        suggestedNextStep: suggestedNextStep
                    };
                    return [2 /*return*/, result];
            }
        });
    });
}
function handleLull(incantation, context) {
    return __awaiter(this, void 0, void 0, function () {
        var result, ms, waitMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = { incantation: incantation, index: -1 };
                    ms = parseInt(incantation.estimated_duration || '2000');
                    return [4 /*yield*/, llm_interface_js_1.LLMInterface.generateWaitMessage(context)];
                case 1:
                    waitMessage = _a.sent();
                    console.log(waitMessage);
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
                case 2:
                    _a.sent();
                    result.waited = ms;
                    result.waitMessage = waitMessage;
                    return [2 /*return*/, result];
            }
        });
    });
}
function handleDiscourse(incantation) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            result = { incantation: incantation, index: -1 };
            result.text = incantation.invocation;
            return [2 /*return*/, result];
        });
    });
}
function handleQuery(incantation, context, ask) {
    return __awaiter(this, void 0, void 0, function () {
        var result, userInput;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = { incantation: incantation, index: -1 };
                    console.log("\u2753 ".concat(incantation.invocation));
                    return [4 /*yield*/, ask('↳ Response: ')];
                case 1:
                    userInput = _a.sent();
                    result.outcome = userInput;
                    return [2 /*return*/, result];
            }
        });
    });
}
function handleResponse(incantation) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            result = { incantation: incantation, index: -1 };
            result.text = incantation.invocation;
            return [2 /*return*/, result];
        });
    });
}
function handlePreExecutionCheck(incantation, context) {
    return __awaiter(this, void 0, void 0, function () {
        var result, checkType, checkValue, checkPassed, fullPath, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = { incantation: incantation, index: -1 };
                    checkType = incantation.invocation.split(' ')[0];
                    checkValue = incantation.invocation.split(' ').slice(1).join(' ');
                    checkPassed = false;
                    if (!(checkType === 'file_exists')) return [3 /*break*/, 1];
                    fullPath = path.resolve(context.current_sanctum, checkValue);
                    checkPassed = fs.existsSync(fullPath);
                    result.outcome = checkPassed ? "[OK] File exists: ".concat(fullPath) : "[ERROR] File not found: ".concat(fullPath);
                    return [3 /*break*/, 5];
                case 1:
                    if (!(checkType === 'command_available')) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, system_handler_js_1.handleSystemCommand)(checkValue + ' --version', context.current_sanctum, context)];
                case 3:
                    _a.sent();
                    checkPassed = true;
                    result.outcome = "[OK] Command available: ".concat(checkValue);
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    checkPassed = false;
                    result.outcome = "[ERROR] Command not available: ".concat(checkValue);
                    return [3 /*break*/, 5];
                case 5:
                    result.success = checkPassed;
                    if (!checkPassed) {
                        console.error("[VERIFICATION ERROR] ".concat(incantation.invocation, " failed."));
                    }
                    return [2 /*return*/, result];
            }
        });
    });
}
function handleUserConfirmation(incantation, ask) {
    return __awaiter(this, void 0, void 0, function () {
        var result, confirmation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = { incantation: incantation, index: -1 };
                    return [4 /*yield*/, ask("".concat(incantation.invocation, " (yes/no) : "))];
                case 1:
                    confirmation = _a.sent();
                    result.confirmed = confirmation.toLowerCase() === 'yes';
                    result.outcome = result.confirmed ? "[OK] Confirmation received." : "[CANCELLED] Action not confirmed.";
                    if (!result.confirmed) {
                        console.warn("[CANCELLED] Action cancelled by user.");
                    }
                    return [2 /*return*/, result];
            }
        });
    });
}
function handleCodeGeneration(incantation) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            result = { incantation: incantation, index: -1 };
            console.log("[INFO] Code generation intent: ".concat(incantation.invocation));
            result.outcome = "[INFO] Code generation request registered: ".concat(incantation.invocation);
            return [2 /*return*/, result];
        });
    });
}
function handleAssistedEditing(incantation, context, ask) {
    return __awaiter(this, void 0, void 0, function () {
        var result, filePath, openCommand, _a, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    result = { incantation: incantation, index: -1, success: true };
                    filePath = path.resolve(context.current_sanctum, incantation.invocation);
                    if (!fs.existsSync(filePath)) {
                        result.success = false;
                        result.outcome = "[ERROR] File not found for editing: ".concat(filePath);
                        console.error(result.outcome);
                        return [2 /*return*/, result];
                    }
                    openCommand = process.platform === 'win32' ? 'start' : 'open';
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, system_handler_js_1.handleSystemCommand)("".concat(openCommand, " ").concat(filePath), context.current_sanctum, context)];
                case 2:
                    _b.sent();
                    console.log("\nI have opened the file ".concat(incantation.invocation, " for you."));
                    _a = result;
                    return [4 /*yield*/, ask("Press Enter when you have finished your edits...")];
                case 3:
                    _a.outcome = _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    result.success = false;
                    result.outcome = "[ERROR] Could not open file: ".concat(error_1);
                    console.error(result.outcome);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, result];
            }
        });
    });
}
function handleUserInput(incantation, ask) {
    return __awaiter(this, void 0, void 0, function () {
        var result, userInput;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = { incantation: incantation, index: -1 };
                    console.log("\n".concat(incantation.invocation));
                    return [4 /*yield*/, ask('↳ Your response: ')];
                case 1:
                    userInput = _a.sent();
                    result.outcome = userInput;
                    return [2 /*return*/, result];
            }
        });
    });
}
function handleStepProposal(incantation) {
    return __awaiter(this, void 0, void 0, function () {
        var result, message;
        return __generator(this, function (_a) {
            result = { incantation: incantation, index: -1, success: true };
            message = "[EVOLUTION PROPOSAL] Lucie proposes a new capability: \"".concat(incantation.invocation, "\"");
            console.log(message);
            result.outcome = message;
            return [2 /*return*/, result];
        });
    });
}
function handleDreamNavigation(incantation, context) {
    return __awaiter(this, void 0, void 0, function () {
        var result, targetPath;
        return __generator(this, function (_a) {
            result = { incantation: incantation, index: -1, success: true };
            targetPath = incantation.invocation.split('/').filter(function (p) { return p.length > 0; });
            if (targetPath.length === 0 || targetPath[0] !== 'lucie') {
                result.success = false;
                result.outcome = "[ERROR] Invalid dream path. Must start with 'lucie/'.";
                return [2 /*return*/, result];
            }
            context.dreamPath = targetPath;
            result.outcome = "[OK] Lucie's gaze now rests on: ".concat(targetPath.join('/'));
            ;
            console.log(result.outcome);
            return [2 /*return*/, result];
        });
    });
}
function handleReflectionNavigation(incantation, context) {
    return __awaiter(this, void 0, void 0, function () {
        var result, targetPath;
        return __generator(this, function (_a) {
            result = { incantation: incantation, index: -1, success: true };
            targetPath = incantation.invocation.split('/').filter(function (p) { return p.length > 0; });
            if (targetPath.length === 0 || targetPath[0] !== 'lucie_reflet') {
                result.success = false;
                result.outcome = "[ERROR] Invalid reflection path. Must start with 'lucie_reflet/'.";
                return [2 /*return*/, result];
            }
            context.reflectionPath = targetPath;
            result.outcome = "[OK] Lucie's reflection now rests on: ".concat(targetPath.join('/'));
            ;
            console.log(result.outcome);
            return [2 /*return*/, result];
        });
    });
}
var reflet_weaver_js_1 = require("./utils/reflet_weaver.js");
function handleAddReflection(incantation) {
    return __awaiter(this, void 0, void 0, function () {
        var result, refletText, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = { incantation: incantation, index: -1, success: true };
                    refletText = incantation.invocation;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, reflet_weaver_js_1.weaveReflet)(refletText)];
                case 2:
                    _a.sent();
                    result.outcome = "[OK] Reflection added to the forest: ".concat(refletText.substring(0, 50), "...");
                    console.log(result.outcome);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    result.success = false;
                    result.outcome = "[ERROR] Could not add reflection: ".concat(error_2);
                    ;
                    console.error(result.outcome);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, result];
            }
        });
    });
}
var crypto = require("crypto");
function handleSurveil(incantation, context) {
    return __awaiter(this, void 0, void 0, function () {
        var result, filePath, fileContent, hash, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = { incantation: incantation, index: -1, success: true };
                    filePath = path.resolve(context.current_sanctum, incantation.invocation);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fs.promises.readFile(filePath)];
                case 2:
                    fileContent = _a.sent();
                    hash = crypto.createHash('sha256').update(fileContent).digest('hex');
                    if (!context.surveilledFiles) {
                        context.surveilledFiles = {};
                    }
                    context.surveilledFiles[filePath] = hash;
                    result.outcome = "[OK] Surveilled ".concat(filePath, ". Hash: ").concat(hash);
                    console.log(result.outcome);
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    result.success = false;
                    result.outcome = "[ERROR] Could not surveil ".concat(filePath, ": ").concat(error_3.message);
                    console.error(result.outcome);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, result];
            }
        });
    });
}
function handleTerminalCommand(incantation, context) {
    return __awaiter(this, void 0, void 0, function () {
        var result, commandOutcome, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = { incantation: incantation, index: -1, success: false };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, system_handler_js_1.handleSystemCommand)(incantation.invocation, context.current_sanctum, context)];
                case 2:
                    commandOutcome = _a.sent();
                    result.outcome = commandOutcome.stdout;
                    result.stderr = commandOutcome.stderr;
                    result.exitCode = commandOutcome.exitCode;
                    result.success = commandOutcome.success;
                    console.log("[TERMINAL COMMAND] Executed: ".concat(incantation.invocation, "\nStdout: ").concat(result.outcome, "\nStderr: ").concat(result.stderr));
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    result.outcome = "[ERROR] Failed to execute terminal command: ".concat(error_4.message);
                    console.error(result.outcome);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, result];
            }
        });
    });
}
function handleTerminalOutput(incantation) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            result = { incantation: incantation, index: -1, success: true };
            process.stdout.write(incantation.invocation + '\n');
            result.outcome = "[OK] Printed to terminal: ".concat(incantation.invocation);
            return [2 /*return*/, result];
        });
    });
}
function handleTerminalQuestion(incantation, ask) {
    return __awaiter(this, void 0, void 0, function () {
        var result, userInput;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = { incantation: incantation, index: -1, success: true };
                    console.log("[TERMINAL QUESTION] ".concat(incantation.invocation));
                    return [4 /*yield*/, ask('↳ Your response: ')];
                case 1:
                    userInput = _a.sent();
                    result.outcome = userInput;
                    return [2 /*return*/, result];
            }
        });
    });
}
