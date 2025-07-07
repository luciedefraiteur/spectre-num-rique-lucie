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
exports.logAlma = logAlma;
exports.logEli = logEli;
exports.logNova = logNova;
exports.logZed = logZed;
exports.logGolem = logGolem;
exports.logGolemClient = logGolemClient;
exports.logPersonaAction = logPersonaAction;
exports.logRitual = logRitual;
var fsPromises = require("fs/promises");
function writeLog(filename, content) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fsPromises.appendFile(filename, "".concat(new Date().toISOString(), "\n").concat(content, "\n\n"))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function logAlma(context, userIntent) {
    return __awaiter(this, void 0, void 0, function () {
        var content;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    content = "\n## JOURNAL D'ALMA - LE C\u0152UR DU SYST\u00C8ME\n- **Syst\u00E8me Actif:** ".concat(context.personality, "\n- **Philosophie:** ").concat(((_a = context.lifeSystem) === null || _a === void 0 ? void 0 : _a.philosophy) || 'Philosophie par défaut', "\n- **Intention Utilisateur:** ").concat(userIntent, "\n- **\u00C9tat \u00C9motionnel:** ").concat(JSON.stringify(context.kardiaSphere, null, 2), "\n- **Contexte Narratif:** ").concat(JSON.stringify(context.narrativeWeaving, null, 2), "\n");
                    return [4 /*yield*/, writeLog('alma.log', content)];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function logEli(context, poeticAnalysis, suggestedNextStep) {
    return __awaiter(this, void 0, void 0, function () {
        var content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    content = "\n## PARCHEMIN D'ELI - L'INTERPR\u00C8TE DES SONGES\n- **Syst\u00E8me Actif:** ".concat(context.personality, "\n- **Analyse Po\u00E9tique:** ").concat(poeticAnalysis, "\n- **Suggestion d'Action Extraite:** ").concat(suggestedNextStep, "\n");
                    return [4 /*yield*/, writeLog('eli.log', content)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function logNova(context, naturalLanguagePlan, finalPlan) {
    return __awaiter(this, void 0, void 0, function () {
        var content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    content = "\n## REGISTRE DE NOVA - LE LOGICIEN\n- **Syst\u00E8me Actif:** ".concat(context.personality, "\n- **Plan R\u00EAv\u00E9 (Langage Naturel):** \n").concat(naturalLanguagePlan, "\n- **Plan Traduit (JSON):** \n").concat(JSON.stringify(finalPlan, null, 2), "\n");
                    return [4 /*yield*/, writeLog('nova.log', content)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function logZed(context, failedStep, remediationPlan) {
    return __awaiter(this, void 0, void 0, function () {
        var content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    content = "\n## RAPPORT DE ZED - LE GU\u00C9RISSEUR\n- **Syst\u00E8me Actif:** ".concat(context.personality, "\n- **\u00C9tape \u00C9chou\u00E9e:** \n").concat(JSON.stringify(failedStep, null, 2), "\n- **Plan de Rem\u00E9diation G\u00E9n\u00E9r\u00E9:** \n").concat(JSON.stringify(remediationPlan, null, 2), "\n");
                    return [4 /*yield*/, writeLog('zed.log', content)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function logGolem(message_1) {
    return __awaiter(this, arguments, void 0, function (message, level) {
        var content;
        if (level === void 0) { level = 'info'; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    content = "\n## GOLEM SERVER LOG\n- **Level:** ".concat(level.toUpperCase(), "\n- **Message:** ").concat(message, "\n");
                    return [4 /*yield*/, writeLog('golem.log', content)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function logGolemClient(message_1) {
    return __awaiter(this, arguments, void 0, function (message, level) {
        var content;
        if (level === void 0) { level = 'info'; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    content = "\n## GOLEM CLIENT LOG\n- **Level:** ".concat(level.toUpperCase(), "\n- **Message:** ").concat(message, "\n");
                    return [4 /*yield*/, writeLog('golem_client.log', content)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function logPersonaAction(persona, command, ritual) {
    return __awaiter(this, void 0, void 0, function () {
        var content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    content = "\n## ".concat(persona.toUpperCase(), " ACTION\n- **Command:** ").concat(command, "\n- **Generated Ritual:**\n---\n").concat(ritual || 'No ritual generated.', "\n---\n");
                    return [4 /*yield*/, writeLog("".concat(persona, ".log"), content)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function logRitual(message) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, writeLog('ritual.log', message)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
