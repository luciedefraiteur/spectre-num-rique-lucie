import { LLMModel, RitualContext } from '../../luciform-types/src/base.js';
export declare class LLMInterface {
    private static cache;
    static query(prompt: string, model?: LLMModel, _fetch?: typeof fetch): Promise<string>;
    static generateWaitMessage(context: RitualContext): Promise<string>;
}
