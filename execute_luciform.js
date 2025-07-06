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
var fs = require("fs/promises");
var batch_editor_js_1 = require("./core/batch_editor.js");
var readline = require("readline");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function askQuestion(query) {
    return new Promise(function (resolve) { return rl.question(query, function (ans) {
        resolve(ans);
    }); });
}
function parseLuciform(filePath, args) {
    return __awaiter(this, void 0, void 0, function () {
        var content, lines, operations, state, currentFilePath, searchContent, newContent, lineNumber, startLine, endLine, currentSearchStartLine, _i, lines_1, line, processedLine, i, question, answer, lineNumberMatch, lineNumberMatch, lineRangeMatch;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.readFile(filePath, 'utf-8')];
                case 1:
                    content = _a.sent();
                    lines = content.replace(/\r\n/g, '\n').split('\n');
                    operations = [];
                    state = 'idle';
                    searchContent = '';
                    newContent = '';
                    _i = 0, lines_1 = lines;
                    _a.label = 2;
                case 2:
                    if (!(_i < lines_1.length)) return [3 /*break*/, 8];
                    line = lines_1[_i];
                    if (line.startsWith('---')) {
                        return [3 /*break*/, 7];
                    }
                    processedLine = line;
                    for (i = 0; i < args.length; i++) {
                        processedLine = processedLine.replace(new RegExp("\\$".concat(i + 1), 'g'), args[i]);
                    }
                    processedLine = processedLine.replace(/\s*\$\d+/g, '');
                    if (!processedLine.startsWith('§F:')) return [3 /*break*/, 3];
                    currentFilePath = processedLine.substring(3).trim();
                    return [3 /*break*/, 7];
                case 3:
                    if (!processedLine.startsWith('§X:')) return [3 /*break*/, 4];
                    operations.push({ type: 'shell_command', command: processedLine.substring(3).trim() });
                    return [3 /*break*/, 7];
                case 4:
                    if (!processedLine.startsWith('§Q:')) return [3 /*break*/, 6];
                    question = line.substring(3).trim();
                    return [4 /*yield*/, askQuestion(question + ' ')];
                case 5:
                    answer = _a.sent();
                    console.log("R\u00E9ponse de l'utilisateur : ".concat(answer));
                    return [3 /*break*/, 7];
                case 6:
                    if (line.startsWith('<<<<<<< §S')) {
                        state = 'in_search';
                        searchContent = '';
                        lineNumberMatch = line.match(/:line:(\d+)/);
                        if (lineNumberMatch) {
                            currentSearchStartLine = parseInt(lineNumberMatch[1], 10);
                        }
                    }
                    else if (line.startsWith('======= §R') && state === 'in_search') {
                        searchContent = searchContent.replace(/\n/g, '\n').replace(/\n$/, '');
                        state = 'in_replace';
                        newContent = '';
                    }
                    else if (line.startsWith('>>>>>>> §R') && state === 'in_replace') {
                        if (currentFilePath) {
                            operations.push({
                                type: 'search_and_replace',
                                filePath: currentFilePath,
                                startLine: currentSearchStartLine || 0,
                                search: searchContent,
                                replace: newContent.replace(/\n/g, '\n').replace(/\n$/, '')
                            });
                        }
                        state = 'idle';
                    }
                    else if (line.startsWith('<<<<<<< §I')) {
                        state = 'in_insert';
                        lineNumberMatch = line.match(/:line:(\d+)/);
                        if (lineNumberMatch) {
                            lineNumber = parseInt(lineNumberMatch[1], 10);
                        }
                        newContent = '';
                    }
                    else if (line.startsWith('>>>>>>> §I') && state === 'in_insert') {
                        if (currentFilePath && lineNumber) {
                            operations.push({ type: "insert", filePath: currentFilePath, lineNumber: lineNumber, newContent: newContent.replace(/\n/g, '\n').replace(/\n$/, '') });
                        }
                        state = 'idle';
                    }
                    else if (line.startsWith('<<<<<<< §D')) {
                        lineRangeMatch = line.match(/:lines:(\d+)-(\d+)/);
                        if (lineRangeMatch && currentFilePath) {
                            startLine = parseInt(lineRangeMatch[1], 10);
                            endLine = parseInt(lineRangeMatch[2], 10);
                            operations.push({ type: 'delete', filePath: currentFilePath, startLine: startLine, endLine: endLine });
                        }
                    }
                    else if (line.startsWith('<<<<<<< §A')) {
                        state = 'in_append';
                        newContent = '';
                    }
                    else if (line.startsWith('>>>>>>> §A') && state === 'in_append') {
                        if (currentFilePath) {
                            operations.push({ type: 'append', filePath: currentFilePath, newContent: newContent.replace(/\n/g, '\n').replace(/\n$/, '') });
                        }
                        state = 'idle';
                    }
                    else if (line.startsWith('<<<<<<< §C')) {
                        state = 'in_create';
                        newContent = '';
                    }
                    else if (line.startsWith('>>>>>>> §C') && state === 'in_create') {
                        if (currentFilePath) {
                            operations.push({ type: 'create_file', filePath: currentFilePath, content: newContent.replace(/\n/g, '\n').replace(/\n$/, '') });
                        }
                        state = 'idle';
                    }
                    else {
                        if (state === 'in_search') {
                            searchContent += line + '\n';
                        }
                        else if (state === 'in_replace' || state === 'in_insert' || state === 'in_append' || state === 'in_create') {
                            newContent += line + '\n';
                        }
                    }
                    _a.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 2];
                case 8: return [2 /*return*/, operations];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var cliArgs, luciformPath, dryRun, ritualArgs, operations, _i, operations_1, op, dryRunOutput, opError_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cliArgs = process.argv.slice(2);
                    luciformPath = cliArgs.find(function (arg) { return !arg.startsWith('--'); });
                    dryRun = cliArgs.includes('--dry-run');
                    ritualArgs = cliArgs.filter(function (arg) { return arg !== luciformPath && !arg.startsWith('--'); });
                    if (!luciformPath) {
                        console.error('Usage: npm run ritual [--dry-run] <path_to_luciform_file> [args...]');
                        process.exit(1);
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 12, 13, 14]);
                    return [4 /*yield*/, parseLuciform(luciformPath, ritualArgs)];
                case 2:
                    operations = _a.sent();
                    _i = 0, operations_1 = operations;
                    _a.label = 3;
                case 3:
                    if (!(_i < operations_1.length)) return [3 /*break*/, 11];
                    op = operations_1[_i];
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 9, , 10]);
                    if (!dryRun) return [3 /*break*/, 6];
                    dryRunOutput = "[DRY RUN] Operation: ".concat(op.type.toUpperCase(), "\n  File: ").concat(op.filePath || 'N/A', "\n").concat('search' in op ? "  Search: \n---\n".concat(op.search, "\n---") : '').concat('replace' in op ? "  Replace: \n---\n".concat(op.replace, "\n---") : '').concat('newContent' in op ? "  Content: \n---\n".concat(op.newContent, "\n---") : '').concat('command' in op ? "  Command: ".concat(op.command) : '').concat('lineNumber' in op ? "  Line: ".concat(op.lineNumber) : '').concat('startLine' in op && 'endLine' in op ? "  Lines: ".concat(op.startLine, "-").concat(op.endLine) : '', "\n----------------------------------------\n");
                    return [4 /*yield*/, fs.appendFile('luciform_dry_run_temp_output.log', dryRunOutput, 'utf-8')];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, (0, batch_editor_js_1.applyOperation)(op, dryRun)];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [3 /*break*/, 10];
                case 9:
                    opError_1 = _a.sent();
                    console.error("Error applying operation ".concat(JSON.stringify(op), ": ").concat(opError_1));
                    // Decide whether to re-throw or continue
                    throw opError_1; // Re-throw to stop execution on first error
                case 10:
                    _i++;
                    return [3 /*break*/, 3];
                case 11: return [3 /*break*/, 14];
                case 12:
                    error_1 = _a.sent();
                    console.error("Error processing batch operations: ".concat(error_1));
                    process.exit(1);
                    return [3 /*break*/, 14];
                case 13:
                    rl.close();
                    return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
            }
        });
    });
}
main();
