/**
 * @file claude_interface.ts
 * @description Ce module gère la communication avec l'API d'Anthropic (Claude).
 */
/**
 * Interroge l'API de Claude avec un prompt donné.
 *
 * @param prompt Le prompt à envoyer à Claude.
 * @returns La réponse textuelle de Claude.
 */
export declare function askClaude(prompt: string): Promise<string>;
