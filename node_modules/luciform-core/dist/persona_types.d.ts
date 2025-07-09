import { LLMModel, KardiaSphere, RitualPlan } from './types/base.js';
export interface Persona {
    name: string;
    description: string;
    job?: {
        prompt: string;
    };
    llm_model?: LLMModel;
}
export interface PersonaJob {
    type: string;
    prompt: string;
}
export interface StructuredPersona {
    description: string;
    job: PersonaJob;
}
export interface LLMRitualContext {
    kardiaSphere: KardiaSphere;
    scroll: {
        input: string;
        plan: RitualPlan;
    }[];
    maxScrollLength: number;
    incantation_history: string[];
    outcome_history: string[];
    user_preferences: string;
    chantModeEnabled: boolean;
    current_sanctum: string;
    currentSanctumContent: string;
    operatingSystem: string;
    personality: string;
}
