import { RitualContext } from "./types.js.js";
export declare enum LLMModel {
    CodeLlama = "codellama:7b-instruct",
    CodeLlamaCode = "codellama:7b-code",
    Llama3 = "llama3",
    Mistral = "mistral",
    OpenAI = "openai",
    Gemini = "gemini",
    Claude = "claude",
    Random = "random"
}
export declare class LLMInterface {
    private static cache;
    static query(prompt: string, model?: LLMModel, _fetch?: typeof fetch): Promise<string>;
    static generateWaitMessage(context: RitualContext): Promise<string>;
}
