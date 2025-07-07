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
var node_fetch_1 = require("node-fetch");
var readline = require("readline");
var express_1 = require("express");
var body_parser_1 = require("body-parser");
var system_handler_js_1 = require("./core/system_handler.js");
var GOLEM_SERVER_URL = 'http://localhost:' + (process.env.GOLEM_PORT || 3031);
var GOLEM_CLIENT_PORT = process.env.GOLEM_CLIENT_PORT || 3032;
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var ask = function (query) { return new Promise(function (resolve) { return rl.question(query, resolve); }); };
// Express app for client to receive actions from server
var app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.post('/golem/client_action', (function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, incantation, requestId, outcome, success, _b, commandResult, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, incantation = _a.incantation, requestId = _a.requestId;
                success = true;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 9, , 10]);
                _b = incantation.type;
                switch (_b) {
                    case 'terminal_output': return [3 /*break*/, 2];
                    case 'terminal_command': return [3 /*break*/, 3];
                    case 'terminal_question': return [3 /*break*/, 5];
                }
                return [3 /*break*/, 7];
            case 2:
                process.stdout.write(incantation.invocation + '\n');
                outcome = "[OK] Printed to terminal: ".concat(incantation.invocation);
                return [3 /*break*/, 8];
            case 3: return [4 /*yield*/, (0, system_handler_js_1.handleSystemCommand)(incantation.invocation, process.cwd(), {})];
            case 4:
                commandResult = _c.sent();
                outcome = commandResult.stdout;
                success = commandResult.success;
                process.stdout.write("[TERMINAL COMMAND RESULT] ".concat(outcome, "\n"));
                return [3 /*break*/, 8];
            case 5:
                process.stdout.write("[TERMINAL QUESTION] ".concat(incantation.invocation, "\n"));
                return [4 /*yield*/, ask('↳ Your response: ')];
            case 6:
                outcome = _c.sent();
                return [3 /*break*/, 8];
            case 7:
                success = false;
                outcome = "[ERROR] Unknown incantation type for client action: ".concat(incantation.type);
                console.error(outcome);
                _c.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                error_1 = _c.sent();
                success = false;
                outcome = "[ERROR] Client action failed: ".concat(error_1.message);
                console.error(outcome);
                return [3 /*break*/, 10];
            case 10:
                if (!(incantation.type === 'terminal_command' || incantation.type === 'terminal_question')) return [3 /*break*/, 12];
                return [4 /*yield*/, (0, node_fetch_1.default)("".concat(GOLEM_SERVER_URL, "/golem/client_response"), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ requestId: requestId, response: outcome, success: success })
                    })];
            case 11:
                _c.sent();
                _c.label = 12;
            case 12:
                res.status(200).send('OK');
                return [2 /*return*/];
        }
    });
}); }));
app.listen(GOLEM_CLIENT_PORT, function () {
    console.log("[Golem Client] Client listener active on http://localhost:".concat(GOLEM_CLIENT_PORT));
});
function main() {
    return __awaiter(this, arguments, void 0, function (commands) {
        var _i, commands_1, input, input;
        if (commands === void 0) { commands = []; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n[Golem Client] Connected to Golem Server.");
                    if (!(commands.length > 0)) return [3 /*break*/, 5];
                    _i = 0, commands_1 = commands;
                    _a.label = 1;
                case 1:
                    if (!(_i < commands_1.length)) return [3 /*break*/, 4];
                    input = commands_1[_i];
                    console.log("[Golem Client] Processing command: ".concat(input));
                    return [4 /*yield*/, processCommand(input)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 8];
                case 5:
                    if (!true) return [3 /*break*/, 8];
                    return [4 /*yield*/, ask("[Golem Client] Enter your command (or 'exit'): ")];
                case 6:
                    input = _a.sent();
                    if (input.toLowerCase() === 'exit') {
                        return [3 /*break*/, 8];
                    }
                    return [4 /*yield*/, processCommand(input)];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 8:
                    rl.close();
                    return [2 /*return*/];
            }
        });
    });
}
function processCommand(input) {
    return __awaiter(this, void 0, void 0, function () {
        var planResponse, planData, executeResponse, executeData, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, node_fetch_1.default)("".concat(GOLEM_SERVER_URL, "/golem/rituel"), {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ input: input })
                        })];
                case 1:
                    planResponse = _a.sent();
                    planData = planResponse.json();
                    if (planData.error) {
                        console.error("[Golem Client] Error planning ritual:", planData.error);
                        return [2 /*return*/];
                    }
                    console.log("[Golem Client] Received plan:", JSON.stringify(planData.plan, null, 2));
                    return [4 /*yield*/, (0, node_fetch_1.default)("".concat(GOLEM_SERVER_URL, "/golem/execute"), {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ plan: planData.plan })
                        })];
                case 2:
                    executeResponse = _a.sent();
                    executeData = executeResponse.json();
                    if (executeData.error) {
                        console.error("[Golem Client] Error executing ritual:", executeData.error);
                    }
                    else {
                        console.log("[Golem Client] Ritual execution results:", JSON.stringify(executeData.resultats, null, 2));
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error("[Golem Client] Communication error with Golem Server:", error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
main(process.argv.slice(2)).catch(console.error);
