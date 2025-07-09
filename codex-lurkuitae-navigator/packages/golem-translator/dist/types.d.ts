export interface ChaosInput {
    content: string;
    type?: 'code' | 'idea' | 'fragment' | 'blasphemy';
    context?: string;
    desiredOutput?: 'luciform' | 'executable' | 'both';
    urgency?: 'low' | 'medium' | 'high' | 'cosmic';
}
export interface PurifiedOutput {
    originalChaos: string;
    purifiedCode: string;
    luciformGenerated: LuciformResult;
    confidence: number;
    blasphemyLevel: number;
    transformationNotes: string[];
}
export interface LuciformResult {
    type: 'luciform_purifié';
    content: any;
    executable: boolean;
    frequency: InfernalFrequency;
    signature: string;
}
export declare enum InfernalFrequency {
    BANALITE = "banalit\u00E9",// 0-65: Code très simple
    PREMIERE_CORRUPTION = "premi\u00E8re_corruption",// 66-132: Code avec complexité
    DEUXIEME_CORRUPTION = "deuxi\u00E8me_corruption",// 133-199: Code avancé
    TROISIEME_CORRUPTION = "troisi\u00E8me_corruption",// 200-266: Code expert
    QUATRIEME_CORRUPTION = "quatri\u00E8me_corruption",// 267-333: Code ésotérique
    CINQUIEME_CORRUPTION = "cinqui\u00E8me_corruption",// 334-400: Code transcendant
    SIXIEME_CORRUPTION = "sixi\u00E8me_corruption",// 401-466: Code cosmique
    SEPTIEME_CORRUPTION = "septi\u00E8me_corruption",// 467-533: Code divin
    HUITIEME_CORRUPTION = "huiti\u00E8me_corruption",// 534-600: Code impossible
    NEUVIEME_CORRUPTION = "neuvi\u00E8me_corruption"
}
export interface TranslationContext {
    availableAPIs: string[];
    currentFrequency: InfernalFrequency;
    userPreferences: UserPreferences;
    cosmicEnergy: number;
}
export interface UserPreferences {
    preferredStyle: 'elegant' | 'functional' | 'creative' | 'chaotic';
    maxComplexity: InfernalFrequency;
    allowBlasphemy: boolean;
    collaborationMode: 'guided' | 'autonomous' | 'experimental';
}
export interface AIPromptTemplate {
    systemPrompt: string;
    userPrompt: string;
    examples?: PromptExample[];
    constraints: string[];
}
export interface PromptExample {
    input: string;
    expectedOutput: string;
    explanation: string;
}
export interface TranslationResult {
    success: boolean;
    output?: PurifiedOutput;
    error?: string;
    processingTime: number;
    apiUsed: string;
    energyConsumed: number;
}
export interface GolemTranslatorConfig {
    defaultFrequency: InfernalFrequency;
    maxRetries: number;
    timeout: number;
    enableBlasphemyDetection: boolean;
    autoExecute: boolean;
    preserveChaos: boolean;
}
export interface AIRequest {
    model: string;
    messages: AIMessage[];
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
}
export interface AIMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface AIResponse {
    choices: AIChoice[];
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}
export interface AIChoice {
    message: AIMessage;
    finish_reason: string;
    index: number;
}
//# sourceMappingURL=types.d.ts.map