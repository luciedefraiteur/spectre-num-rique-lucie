import { LLMModel, RitualContext } from './types/base.js';
export declare function getPersonaResponse(personaName: string, message: string, context: RitualContext, llmModel?: LLMModel): Promise<string>;
