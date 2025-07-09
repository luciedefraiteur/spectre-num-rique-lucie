import { RitualContext, KardiaSphere } from './types/base.js';
/**
 * Calculates the current emotional state based on the ritual context.
 * This is a placeholder implementation; a real version would use a more complex, semi-random function.
 * @param context The current ritual context.
 * @returns The current emotional state.
 */
export declare function calculateEmotion(context: RitualContext): KardiaSphere;
/**
 * Uses the LLM to interpret the emotional state into a poetic description.
 * @param state The current emotional state.
 * @returns A poetic interpretation of the emotional state.
 */
export declare function interpretEmotion(state: KardiaSphere): Promise<string>;
/**
 * Calculates a single step on the journey towards a target emotional state.
 * @param currentState The current emotional state.
 * @param targetState The desired emotional state.
 * @returns The new emotional state after one step.
 */
export declare function journeyTowards(currentState: KardiaSphere, targetState: KardiaSphere): KardiaSphere;
