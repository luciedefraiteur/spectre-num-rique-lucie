"use strict";
// src/core/log_writers.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logToFile = logToFile;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
function logToFile(filename, message) {
    try {
        const logFilePath = path_1.default.join(__dirname, '..', '..', 'logs', filename);
        (0, fs_1.appendFileSync)(logFilePath, `${new Date().toISOString()} - ${message}\n`);
    }
    catch (error) {
        console.error(`Failed to write to log file ${filename}:`, error);
    }
}
//# sourceMappingURL=log_writers.js.map