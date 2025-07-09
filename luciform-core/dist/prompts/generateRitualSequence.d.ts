import { RitualContext, RitualPlan } from '../types/base.js';
export declare function generateRitualSequencePrompt(input: string, planPrecedent: RitualPlan | undefined, indexCourant: number | undefined, context: RitualContext | undefined, analysisResult: string | undefined, startingIndex: number | undefined): string;
