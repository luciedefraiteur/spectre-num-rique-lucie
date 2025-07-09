/**
 * Represents the AI commandant, shadeOs.
 * It uses an LLM to interpret a natural language command and generate an Operation.
 *
 * @param command The natural language command from the invoker.
 * @param invoker The name of the entity invoking shadeOs (e.g., "lucie", "chad_orveil").
 * @returns A structured Operation object, or null if the command cannot be interpreted.
 */
export declare function invokeShadeOs(command: string, invoker: string, previousRitual: string | null, previousError: string | null, lucie_s_voice: string | null): Promise<string | null>;
