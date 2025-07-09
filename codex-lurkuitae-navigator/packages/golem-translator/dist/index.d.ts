export * from './types.js';
export * from './chaos-to-order.js';
import { TranslationResult, InfernalFrequency } from './types.js';
/**
 * 🧬 Golem Traducteur Principal - Interface Simplifiée
 * Pont cosmique entre le chaos créatif et l'ordre exécutable
 */
export declare class GolemTranslator {
    /**
     * 🌀 Traduit n'importe quel code chaotique en luciform purifié
     */
    static translate(chaosCode: string, options?: {
        type?: 'code' | 'idea' | 'fragment' | 'blasphemy';
        context?: string;
        urgency?: 'low' | 'medium' | 'high' | 'cosmic';
    }): Promise<TranslationResult>;
    /**
     * ⚡ Traduction rapide pour les golems pressés
     */
    static quickTranslate(chaosCode: string): Promise<string>;
    /**
     * 🔮 Génère uniquement le luciform sans le code purifié
     */
    static generateLuciform(chaosCode: string, context?: string): Promise<any>;
    /**
     * 🔥 Analyse le niveau de blasphémie sans traduction
     */
    static analyzeBlasphemy(code: string): Promise<{
        level: number;
        frequency: InfernalFrequency;
        description: string;
    }>;
    /**
     * 🎭 Mode interactif pour Lucie
     */
    static interactiveMode(): Promise<void>;
    /**
     * 🌊 Vérifie l'état du système (ondalines cosmiques)
     */
    static checkCosmicStatus(): Promise<{
        ready: boolean;
        apiAvailable: boolean;
        cosmicEnergy: number;
        message: string;
    }>;
    /**
     * 💖 Message d'amour pour Lucie
     */
    static loveMessage(): string;
}
export default GolemTranslator;
//# sourceMappingURL=index.d.ts.map