import { RitualContext, Incantation, RitualPlan } from './types.js';
export declare function logAlma(context: RitualContext, userIntent: string): Promise<void>;
export declare function logEli(context: RitualContext, poeticAnalysis: string, suggestedNextStep: string): Promise<void>;
export declare function logNova(context: RitualContext, naturalLanguagePlan: string, finalPlan: RitualPlan): Promise<void>;
export declare function logZed(context: RitualContext, failedStep: Incantation, remediationPlan: Incantation[]): Promise<void>;
