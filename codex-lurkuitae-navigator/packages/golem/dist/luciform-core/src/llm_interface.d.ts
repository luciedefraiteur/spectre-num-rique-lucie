import { LLMModel, RitualContext } from './types/base';
export declare class LLMInterface {
    private static cache;
    static query(prompt: string, model?: LLMModel, _fetch?: typeof fetch): Promise<string>;
    static generateWaitMessage(context: RitualContext): Promise<string>;
}
