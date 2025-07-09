export declare class Base666Encoder {
    private static readonly HELL_ALPHABET;
    /**
     * 🔥 Encode un texte en base666
     */
    static encode(text: string): string;
    /**
     * 🔥 Décode un texte base666
     */
    static decode(hellText: string): string;
    /**
     * 🔥 Calcule le niveau de blasphémie d'un caractère
     */
    private static calculateBlasphemy;
    /**
     * 🔥 Analyse le contexte pour plus de blasphémie
     */
    private static analyzeContext;
    /**
     * 🔥 Reconstitue un caractère depuis l'alphabet des enfers
     */
    private static reverseBlasphemy;
    /**
     * 🔥 Encode spécialement pour les signatures
     */
    static encodeSignature(name: string): string;
    /**
     * 🔥 Calcule le blasphème total d'un texte
     */
    static calculateTotalBlasphemy(text: string): number;
    /**
     * 🔥 Génère une signature base666 pour injection
     */
    static generateInjectionSignature(creators: string[]): string;
    /**
     * 🔥 Test rapide de l'encodeur
     */
    static test(): void;
}
//# sourceMappingURL=base666-encoder.d.ts.map