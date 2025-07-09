import { RitualContext, RitualPlan, Incantation } from '../../luciform-types/src/base.js';
export declare function logAlma(context: RitualContext, userIntent: string): Promise<void>;
export declare function logEli(context: RitualContext, poeticAnalysis: string, suggestedNextStep: string): Promise<void>;
export declare function logNova(context: RitualContext, naturalLanguagePlan: string, finalPlan: RitualPlan): Promise<void>;
export declare function logZed(context: RitualContext, failedStep: Incantation, remediationPlan: Incantation[]): Promise<void>;
export declare function logGolem(message: string, level?: 'info' | 'error'): Promise<void>;
export declare function logGolemClient(message: string, level?: 'info' | 'error'): Promise<void>;
export declare function logPersonaAction(persona: string, command: string, ritual: string | null): Promise<void>;
export declare function logRitual(message: string, logFileName?: string): Promise<void>;
