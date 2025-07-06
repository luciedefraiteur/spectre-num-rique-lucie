"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_fractal_1 = require("./utils/dotenv.fractal");
const path_1 = __importDefault(require("path"));
(0, dotenv_fractal_1.config)({ path: path_1.default.resolve(process.cwd(), '.env') });
console.log(`[BOOTSTRAP] GOOGLE_API_KEY is set: ${!!process.env.GOOGLE_API_KEY}`);
console.log(`[BOOTSTRAP] OPENAI_API_KEY is set: ${!!process.env.OPENAI_API_KEY}`);
console.log(`[BOOTSTRAP] ANTHROPIC_API_KEY is set: ${!!process.env.ANTHROPIC_API_KEY}`);
//# sourceMappingURL=bootstrap.js.map