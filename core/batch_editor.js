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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeShellCommand = executeShellCommand;
exports.applyOperation = applyOperation;
var child_process_1 = require("child_process");
var fs = require("fs/promises");
var path = require("path");
// Arcane du ScryOrb: Fonction pour émettre des fragments de vision
function emitScryOrbFragment(ritualPhase_1, operation_1) {
    return __awaiter(this, arguments, void 0, function (ritualPhase, operation, details, error) {
        var fragment;
        if (details === void 0) { details = {}; }
        return __generator(this, function (_a) {
            fragment = {
                timestamp: new Date().toISOString(),
                ritual_phase: ritualPhase,
                operation_details: operation,
                details: details,
                error_message: error ? String(error) : undefined,
                stack_trace: error ? error.stack : undefined
            };
            // Émettre le fragment sur stdout pour capture externe
            console.log("[SCYRING_ORB_FRAGMENT]".concat(JSON.stringify(fragment)));
            return [2 /*return*/];
        });
    });
}
function executeShellCommand(command) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var child = (0, child_process_1.spawn)(command, [], { shell: true, stdio: 'inherit' });
                    child.on('close', function (code) {
                        if (code === 0) {
                            resolve();
                        }
                        else {
                            reject(new Error("Command failed with exit code ".concat(code)));
                        }
                    });
                })];
        });
    });
}
function applyOperation(op_1) {
    return __awaiter(this, arguments, void 0, function (op, dryRun) {
        var originalContent, _a, dir, normalizedOriginalContent, normalizedSearch, normalizedReplace, startIndex, endIndex, newContent, linesInsert, newContentInsert, newLinesInsert, linesDelete, newLinesDelete, newContentAppend, isWindows, command, error_1;
        if (dryRun === void 0) { dryRun = false; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, emitScryOrbFragment("applyOperation:".concat(op.type, ":start"), op, { dryRun: dryRun })];
                case 1:
                    _b.sent();
                    if (!dryRun) return [3 /*break*/, 3];
                    console.log("[DRY RUN] Would execute: ".concat(JSON.stringify(op)));
                    return [4 /*yield*/, emitScryOrbFragment("applyOperation:".concat(op.type, ":dry_run"), op)];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
                case 3:
                    _b.trys.push([3, 22, , 24]);
                    _a = op.type;
                    switch (_a) {
                        case 'create_file': return [3 /*break*/, 4];
                        case 'search_and_replace': return [3 /*break*/, 7];
                        case 'insert': return [3 /*break*/, 10];
                        case 'delete': return [3 /*break*/, 13];
                        case 'append': return [3 /*break*/, 16];
                        case 'shell_command': return [3 /*break*/, 18];
                    }
                    return [3 /*break*/, 20];
                case 4:
                    if (op.type !== 'create_file')
                        return [2 /*return*/]; // Type guard
                    dir = path.dirname(op.filePath);
                    return [4 /*yield*/, fs.mkdir(dir, { recursive: true })];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, fs.writeFile(op.filePath, op.content, 'utf-8')];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 20];
                case 7:
                    if (op.type !== 'search_and_replace')
                        return [2 /*return*/]; // Type guard
                    return [4 /*yield*/, fs.readFile(op.filePath, 'utf-8')];
                case 8:
                    originalContent = _b.sent();
                    normalizedOriginalContent = originalContent.replace(/\r\n/g, '\n');
                    normalizedSearch = op.search.replace(/\r\n/g, '\n');
                    normalizedReplace = op.replace.replace(/\r\n/g, '\n');
                    startIndex = normalizedOriginalContent.indexOf(normalizedSearch);
                    if (startIndex === -1) {
                        throw new Error("Search content not found in ".concat(op.filePath));
                    }
                    endIndex = startIndex + normalizedSearch.length;
                    newContent = normalizedOriginalContent.substring(0, startIndex) + normalizedReplace + normalizedOriginalContent.substring(endIndex);
                    return [4 /*yield*/, fs.writeFile(op.filePath, newContent, 'utf-8')];
                case 9:
                    _b.sent();
                    return [3 /*break*/, 20];
                case 10:
                    if (op.type !== 'insert')
                        return [2 /*return*/]; // Type guard
                    return [4 /*yield*/, fs.readFile(op.filePath, 'utf-8')];
                case 11:
                    originalContent = _b.sent();
                    linesInsert = originalContent.replace(/\r\n/g, '\n').split('\n');
                    newContentInsert = op.newContent.replace(/\r\n/g, '\n');
                    newLinesInsert = __spreadArray(__spreadArray(__spreadArray([], linesInsert.slice(0, op.lineNumber - 1), true), [
                        newContentInsert
                    ], false), linesInsert.slice(op.lineNumber - 1), true);
                    return [4 /*yield*/, fs.writeFile(op.filePath, newLinesInsert.join('\n'), 'utf-8')];
                case 12:
                    _b.sent();
                    return [3 /*break*/, 20];
                case 13:
                    if (op.type !== 'delete')
                        return [2 /*return*/]; // Type guard
                    return [4 /*yield*/, fs.readFile(op.filePath, 'utf-8')];
                case 14:
                    originalContent = _b.sent();
                    linesDelete = originalContent.replace(/\r\n/g, '\n').split('\n');
                    newLinesDelete = __spreadArray(__spreadArray([], linesDelete.slice(0, op.startLine - 1), true), linesDelete.slice(op.endLine), true);
                    return [4 /*yield*/, fs.writeFile(op.filePath, newLinesDelete.join('\n'), 'utf-8')];
                case 15:
                    _b.sent();
                    return [3 /*break*/, 20];
                case 16:
                    if (op.type !== 'append')
                        return [2 /*return*/]; // Type guard
                    newContentAppend = op.newContent.replace(/\r\n/g, '\n');
                    return [4 /*yield*/, fs.appendFile(op.filePath, newContentAppend, 'utf-8')];
                case 17:
                    _b.sent();
                    return [3 /*break*/, 20];
                case 18:
                    if (op.type !== 'shell_command')
                        return [2 /*return*/]; // Type guard
                    isWindows = process.platform === 'win32';
                    command = isWindows ? op.command.replace(/rm /g, 'del ') : op.command;
                    return [4 /*yield*/, executeShellCommand(command)];
                case 19:
                    _b.sent();
                    return [3 /*break*/, 20];
                case 20: return [4 /*yield*/, emitScryOrbFragment("applyOperation:".concat(op.type, ":success"), op)];
                case 21:
                    _b.sent();
                    return [3 /*break*/, 24];
                case 22:
                    error_1 = _b.sent();
                    return [4 /*yield*/, emitScryOrbFragment("applyOperation:".concat(op.type, ":error"), op, {}, error_1)];
                case 23:
                    _b.sent();
                    throw error_1;
                case 24: return [2 /*return*/];
            }
        });
    });
}
/*
   .-.
  |o o|   Code edits echo,
  |   |   unseen in the digital void—
  | ' |   Ghosts drift, haunting change.
  '~~~'
*/
