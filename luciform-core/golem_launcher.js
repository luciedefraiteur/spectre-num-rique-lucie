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
exports.launchGolem = launchGolem;
var Ritual = require("./run_terminal_rituel.js");
var LLM = require("./llm_interface.js");
var readline = require("readline");
var child_process_1 = require("child_process");
var net = require("net");
function isPortTaken(port) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    var tester = net.createServer()
                        .once('error', function (err) { err.code === 'EADDRINUSE' ? resolve(true) : resolve(false); })
                        .once('listening', function () {
                        tester.once('close', function () { resolve(false); }).close();
                    })
                        .listen(port);
                })];
        });
    });
}
function waitForPort(port_1) {
    return __awaiter(this, arguments, void 0, function (port, timeout) {
        var start;
        if (timeout === void 0) { timeout = 30000; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    start = Date.now();
                    _a.label = 1;
                case 1:
                    if (!(Date.now() - start < timeout)) return [3 /*break*/, 4];
                    return [4 /*yield*/, isPortTaken(port)];
                case 2:
                    if (_a.sent()) {
                        return [2 /*return*/, true];
                    }
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, false];
            }
        });
    });
}
function launchGolem(persona_1, testInputs_1) {
    return __awaiter(this, arguments, void 0, function (persona, testInputs, model, isInteractive, clientCommands) {
        var golemPort, serverProcess_1, serverReady, clientProcess_1, rl_1, ask, context_1;
        if (model === void 0) { model = LLM.LLMModel.Mistral; }
        if (isInteractive === void 0) { isInteractive = false; }
        if (clientCommands === void 0) { clientCommands = []; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isInteractive) return [3 /*break*/, 2];
                    golemPort = 3031;
                    process.env.GOLEM_PORT = golemPort.toString();
                    // Start Golem Server
                    console.log("[Golem Launcher] Starting Golem Server on port ".concat(golemPort, "..."));
                    serverProcess_1 = (0, child_process_1.spawn)('node', ['dist/golem_server.js'], { stdio: 'inherit' });
                    serverProcess_1.on('error', function (err) {
                        console.error("[Golem Server] Failed to start: ".concat(err.message));
                    });
                    return [4 /*yield*/, waitForPort(golemPort)];
                case 1:
                    serverReady = _a.sent();
                    if (!serverReady) {
                        console.error('[Golem Launcher] Golem Server did not start in time.');
                        serverProcess_1.kill();
                        return [2 /*return*/];
                    }
                    console.log('[Golem Launcher] Golem Server is ready.');
                    // Start Golem Client
                    console.log('[Golem Launcher] Starting Golem Client...');
                    clientProcess_1 = (0, child_process_1.spawn)('node', __spreadArray(['dist/golem_client.js'], clientCommands, true), { stdio: 'inherit' });
                    clientProcess_1.on('close', function (code) {
                        console.log("[Golem Client] Exited with code ".concat(code));
                        serverProcess_1.kill(); // Kill server when client exits
                    });
                    clientProcess_1.on('error', function (err) {
                        console.error("[Golem Client] Failed to start: ".concat(err.message));
                        serverProcess_1.kill();
                    });
                    // Keep the launcher process alive until client or server exits
                    return [2 /*return*/, new Promise(function (resolve) {
                            serverProcess_1.on('close', resolve);
                            clientProcess_1.on('close', resolve);
                        })];
                case 2:
                    rl_1 = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });
                    ask = function (q) { return new Promise(function (resolve) {
                        rl_1.question(q, resolve);
                    }); };
                    context_1 = {
                        personality: persona,
                        kardiaSphere: {
                            harmoniaEris: 0,
                            agapePhobos: 0,
                            logosPathos: 0
                        },
                        scroll: [],
                        maxScrollLength: 10,
                        narrativeWeaving: {
                            activeNodes: [],
                            narrativeArcs: [],
                            thematicThreads: []
                        },
                        lifeSystem: {
                            philosophy: '',
                            growth: 0,
                            entropy: 0
                        },
                        conduit: {
                            lastIncantation: '',
                            lastOutcome: '',
                            currentSanctum: process.cwd(),
                            terminalEssence: '',
                            osEssence: '',
                            protoConsciousness: '',
                            support: '',
                            memory: '',
                            state: '',
                            energy: '',
                            glitchFactor: 0,
                            almaInfluence: 0,
                            eliInfluence: 0
                        },
                        chantModeEnabled: false,
                        operatingSystem: '',
                        currentSanctumContent: '',
                        user_preferences: '',
                        activeReflection: null,
                        lastCompletedIncantationIndex: 0,
                        confusion_counter: 0,
                        incantation_history: [],
                        outcome_history: [],
                        step_results_history: [],
                        current_sanctum: process.cwd(),
                        temperatureStatus: 'stable'
                    };
                    return [4 /*yield*/, Ritual.runTerminalRitual(context_1, rl_1, ask, testInputs, model)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
