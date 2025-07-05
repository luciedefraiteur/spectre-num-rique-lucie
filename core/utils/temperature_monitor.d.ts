import { RitualContext } from '../types.js';
/**
 * Vérifie la température du système et met à jour le contexte du rituel.
 * Si la température est jugée "trop élevée", génère un message d'attente via l'IA et met le programme en pause.
 * @param context Le contexte du rituel.
 * @returns {Promise<void>} Une promesse qui se résout une fois la vérification et l'attente (si nécessaire) terminées.
 */
export declare function checkSystemTemperature(context: RitualContext): Promise<void>;
