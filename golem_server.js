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
var express_1 = require("express");
var cors_1 = require("cors");
var body_parser_1 = require("body-parser");
var ritual_utils_js_1 = require("./core/ritual_utils.js");
var node_fetch_1 = require("node-fetch");
var app = (0, express_1.default)();
var port = process.env.GOLEM_PORT || 3031;
var clientPort = process.env.GOLEM_CLIENT_PORT || 3032;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
var context = (0, ritual_utils_js_1.getInitialContext)();
var pendingClientRequests = new Map();
app.post('/golem/rituel', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var input, plan, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                input = req.body.input;
                if (!input) {
                    return [2 /*return*/, res.status(400).json({ error: 'Input missing' })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, ritual_utils_js_1.generateRitual)(input, context)];
            case 2:
                plan = _a.sent();
                if (!plan)
                    return [2 /*return*/, res.status(500).json({ error: 'Planning error' })];
                res.json({ plan: plan });
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                res.status(500).json({ error: 'Internal error', details: err_1 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post('/golem/execute', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var plan, serverAsk, resultats, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                plan = req.body.plan;
                serverAsk = function (q) { return __awaiter(void 0, void 0, void 0, function () {
                    var requestId, incantation, response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                requestId = Date.now().toString();
                                incantation = { type: 'terminal_question', invocation: q };
                                return [4 /*yield*/, (0, node_fetch_1.default)("http://localhost:".concat(clientPort, "/golem/client_action"), {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ incantation: incantation, requestId: requestId }),
                                    })];
                            case 1:
                                response = _a.sent();
                                if (!response.ok) {
                                    throw new Error("Failed to send question to client: ".concat(response.statusText));
                                }
                                return [2 /*return*/, new Promise(function (resolve) {
                                        pendingClientRequests.set(requestId, resolve);
                                    })];
                        }
                    });
                }); };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, ritual_utils_js_1.executeRitualPlan)(plan, context, serverAsk)];
            case 2:
                resultats = _a.sent();
                res.json({ resultats: resultats });
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                res.status(500).json({ error: 'Execution error', details: err_2 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post('/golem/client_response', function (req, res) {
    var _a = req.body, requestId = _a.requestId, response = _a.response;
    var resolver = pendingClientRequests.get(requestId);
    if (resolver) {
        resolver(response);
        pendingClientRequests.delete(requestId);
        res.status(200).send('OK');
    }
    else {
        res.status(404).send('Request ID not found or already processed.');
    }
});
app.listen(port, function () {
    console.log("[Golem Server] \u2728 Listening on http://localhost:".concat(port));
});
