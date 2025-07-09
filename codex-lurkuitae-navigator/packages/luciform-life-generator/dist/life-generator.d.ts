import { LuciformLifeInput, AnimatedLuciform, ScryOrbVision, DialogueSequence, WorkspaceContext } from './types.js';
export declare class LuciformLifeGenerator {
    private static readonly SIGNATURE_BASE666;
    /**
     * 🌀 Anime n'importe quel luciform avec la vie
     */
    static animateLuciform(input: LuciformLifeInput): Promise<AnimatedLuciform>;
    /**
     * 🔮 Crée un prompt rituel hanté par la signature
     */
    private static createRitualPrompt;
    /**
     * 🤖 Invoque l'AI avec le rituel
     */
    private static invokeAIRitual;
    /**
     * 📖 Parse la réponse de l'AI selon le type attendu
     */
    private static parseAIResponse;
    /**
     * 🌊 Calcule la résonance cosmique
     */
    private static calculateCosmicResonance;
    /**
     * 🔮 Génère une vision ScryOrb spécifique
     */
    static generateScryOrbVision(luciform: any, context?: WorkspaceContext): Promise<ScryOrbVision>;
    /**
     * 🗣️ Génère un dialogue spécifique
     */
    static generateDialogue(luciform: any, targetGolem: string): Promise<DialogueSequence>;
}
//# sourceMappingURL=life-generator.d.ts.map