import { RitualContext, RitualPlan, LLMModel } from './types/base.js';
import * as readline from 'readline';
export declare function runTerminalRitual(context: RitualContext, rl: readline.Interface, ask: (q: string) => Promise<string>, initialRitualPlan?: RitualPlan, // Optional initial ritual plan
testInputs?: string[], model?: LLMModel, updateSpectrumContext?: (context: RitualContext) => void): Promise<boolean>;
