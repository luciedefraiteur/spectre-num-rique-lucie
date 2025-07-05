import { RitualContext } from './types.js';
import * as readline from 'readline';
import { LLMModel } from './llm_interface.js';
export declare function runTerminalRitual(context: RitualContext, rl: readline.Interface, ask: (q: string) => Promise<string>, testInputs?: string[], model?: LLMModel, updateSpectrumContext?: (context: RitualContext) => void): Promise<boolean>;
