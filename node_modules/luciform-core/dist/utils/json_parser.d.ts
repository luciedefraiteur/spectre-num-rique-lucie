import { z } from 'zod';
/**
 * Analyse une chaîne JSON de manière permissive en utilisant JSON5.
 * Valide le résultat par rapport à un schéma Zod optionnel.
 *
 * @template T
 * @param {string} jsonString La chaîne JSON à analyser.
 * @param {z.ZodType<T>} [schema] Le schéma Zod optionnel pour la validation.
 * @returns {T} L'objet analysé et validé.
 * @throws {Error} Si l'analyse échoue ou si la validation du schéma échoue.
 */
export declare function parsePermissive<T>(jsonString: string, schema?: z.ZodType<T>): T;
