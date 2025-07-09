"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs/promises"));
async function refactor() {
    const filePath = './execute_luciform.ts';
    let content = await fs.readFile(filePath, 'utf-8');
    const parseLuciformRegex = /async function parseLuciform\(filePath: string\): Promise<Operation\[\]> {([\s\S]*?)}\n/g;
    const match = parseLuciformRegex.exec(content);
    if (!match) {
        console.error('Could not find parseLuciform function');
        return;
    }
    const parseLuciformBody = match[1];
    const newFunctionName = 'parseLinesToOperations';
    const newFunction = `async function ${newFunctionName}(lines: string[]): Promise<Operation[]> {${parseLuciformBody}}`;
    const newParseLuciform = `async function parseLuciform(filePath: string): Promise<Operation[]> {\n    const content = await fs.readFile(filePath, 'utf-8');\n    const lines = content.replace(/\r\n/g, '\n').split('\n');\n    return ${newFunctionName}(lines);\n}`;
    content = content.replace(parseLuciformRegex, newParseLuciform);
    content = content.replace(`type ParserState`, newFunction + `\n\ntype ParserState`);
    await fs.writeFile(filePath, content, 'utf-8');
}
refactor();
//# sourceMappingURL=index.js.map