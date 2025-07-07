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
exports.checkSystemTemperature = checkSystemTemperature;
var llm_interface_js_1 = require("../llm_interface.js");
var temperature_sensor_js_1 = require("./temperature_sensor.js");
var ui_utils_js_1 = require("./ui_utils.js");
/**
 * Vérifie la température du système et met à jour le contexte du rituel.
 * Si la température est jugée "trop élevée", génère un message d'attente via l'IA et met le programme en pause.
 * @param context Le contexte du rituel.
 * @returns {Promise<void>} Une promesse qui se résout une fois la vérification et l'attente (si nécessaire) terminées.
 */
function checkSystemTemperature(context) {
    return __awaiter(this, void 0, void 0, function () {
        var temperature, newTemperatureStatus, waitMessage, waitMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, temperature_sensor_js_1.getCpuTemperature)()];
                case 1:
                    temperature = _a.sent();
                    if (temperature === null) {
                        console.log((0, ui_utils_js_1.colorize)("⚠️ Impossible de lire la température du CPU. Poursuite sans surveillance thermique.", ui_utils_js_1.Colors.FgYellow));
                        newTemperatureStatus = 'normal'; // Assume normal if cannot read
                    }
                    else if (temperature <= 55) {
                        newTemperatureStatus = 'normal';
                    }
                    else if (temperature > 55 && temperature <= 70) {
                        newTemperatureStatus = 'elevated';
                    }
                    else {
                        newTemperatureStatus = 'critical';
                    }
                    context.temperatureStatus = newTemperatureStatus;
                    if (!(newTemperatureStatus === 'elevated')) return [3 /*break*/, 4];
                    console.log((0, ui_utils_js_1.colorize)("\u26A0\uFE0F Temp\u00E9rature du syst\u00E8me \u00E9lev\u00E9e (".concat(temperature, "\u00B0C). Ralentissement rituel..."), ui_utils_js_1.Colors.FgRed));
                    return [4 /*yield*/, llm_interface_js_1.LLMInterface.generateWaitMessage(context)];
                case 2:
                    waitMessage = _a.sent();
                    console.log((0, ui_utils_js_1.colorize)("\n".concat(waitMessage, "\n"), ui_utils_js_1.Colors.FgBlue));
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 3000); })];
                case 3:
                    _a.sent(); // Attente de 3 secondes
                    console.log((0, ui_utils_js_1.colorize)("✅ Le système est prêt à reprendre le rituel.", ui_utils_js_1.Colors.FgBlue));
                    return [3 /*break*/, 7];
                case 4:
                    if (!(newTemperatureStatus === 'critical')) return [3 /*break*/, 7];
                    console.log((0, ui_utils_js_1.colorize)("\uD83D\uDD25 Temp\u00E9rature du syst\u00E8me CRITIQUE (".concat(temperature, "\u00B0C) ! Pause rituelle forc\u00E9e..."), ui_utils_js_1.Colors.FgRed));
                    return [4 /*yield*/, llm_interface_js_1.LLMInterface.generateWaitMessage(context)];
                case 5:
                    waitMessage = _a.sent();
                    console.log((0, ui_utils_js_1.colorize)("\n".concat(waitMessage, "\n"), ui_utils_js_1.Colors.FgBlue));
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 90000); })];
                case 6:
                    _a.sent(); // Attente de 90 secondes (1.5 minutes)
                    console.log((0, ui_utils_js_1.colorize)("✅ Le système est prêt à reprendre le rituel.", ui_utils_js_1.Colors.FgBlue));
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
