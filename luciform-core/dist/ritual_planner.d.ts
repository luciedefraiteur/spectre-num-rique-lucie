import { RitualContext, RitualPlan, LLMModel } from './types/base.js';
export declare function planNextRitual(context: RitualContext, ask: (q: string) => Promise<string>, model: LLMModel): Promise<RitualPlan | undefined>;
