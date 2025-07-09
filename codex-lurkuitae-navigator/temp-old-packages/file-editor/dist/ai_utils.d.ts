export declare enum LLMModel {
    Mistral = "mistral",
    Claude = "claude",
    GPT4 = "gpt-4",
    GPT3_5_Turbo = "gpt-3.5-turbo",
    GeminiPro = "gemini-pro",
    CodeLlama = "codellama:7b-instruct",
    CodeLlamaCode = "codellama:7b-code",
    Llama3 = "llama3",
    OpenAI = "openai",
    Gemini = "gemini",
    Random = "random"
}
export declare class LLMInterface {
    private static cache;
    static query(prompt: string, model?: LLMModel, _fetch?: typeof fetch): Promise<string>;
}
export interface Persona {
    name: string;
    description: string;
    job?: {
        type: string;
        prompt: string;
    };
    llm_model?: LLMModel;
}
export interface RitualContext {
    outcome_history: string[];
    step_results_history: any[];
    current_sanctum: string;
    operatingSystem: string;
    conduit?: any;
    kardiaSphere?: any;
    scroll?: any;
    maxScrollLength?: any;
    incantation_history?: any;
    narrativeWeaving?: any;
    activeReflection?: any;
    user_preferences?: any;
    chantModeEnabled?: any;
    currentSanctumContent?: any;
    personality?: any;
    lifeSystem?: any;
}
export declare function getPersonaResponse(personaName: string, message: string, context: RitualContext, llmModel?: LLMModel): Promise<string>;
