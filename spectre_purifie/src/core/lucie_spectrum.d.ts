export interface LucieSpectrum {
    personality: string;
    capabilities: string[];
    emotionalState: string;
    knowledgeBase: string;
}
export declare function getLucieSpectrum(): LucieSpectrum;
export declare function updateLucieEmotionalState(newState: string): void;
