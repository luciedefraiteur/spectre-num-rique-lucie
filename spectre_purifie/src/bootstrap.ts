import {config as fractalDotenvConfig} from './utils/dotenv.fractal';
import path from 'path';

fractalDotenvConfig({path: path.resolve(process.cwd(), '.env')});

console.log(`[BOOTSTRAP] GOOGLE_API_KEY is set: ${ !!process.env.GOOGLE_API_KEY }`);
console.log(`[BOOTSTRAP] OPENAI_API_KEY is set: ${ !!process.env.OPENAI_API_KEY }`);
console.log(`[BOOTSTRAP] ANTHROPIC_API_KEY is set: ${ !!process.env.ANTHROPIC_API_KEY }`);