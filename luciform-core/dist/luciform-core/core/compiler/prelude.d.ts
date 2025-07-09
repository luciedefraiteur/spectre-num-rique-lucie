/**
 * @file prelude.ts
 * @description Phase 0 du compilateur : Normalisation et Détection du Dialecte.
 * Ce fichier contient les fonctions préparatoires pour le rituel de compilation.
 */
export type Dialect = 'typescript' | 'javascript' | 'lucidscript' | 'unknown';
/**
 * Normalise les fins de ligne d'une chaîne de caractères en utilisant le format LF (\n).
 * @param source Le code source à normaliser.
 * @returns Le code source avec des fins de ligne normalisées.
 */
export declare function normalizeLineEndings(source: string): string;
/**
 * Détecte le dialecte d'un fichier en se basant sur son extension.
 * @param filePath Le chemin du fichier à analyser.
 * @returns Le dialecte détecté.
 */
export declare function detectDialect(filePath: string): Dialect;
