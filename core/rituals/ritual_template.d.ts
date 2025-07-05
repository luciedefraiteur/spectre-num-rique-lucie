import { Operation } from '../types.js';
/**
 * A brief description of what this ritual does.
 * @param parameters The parameters for the ritual, as defined in the incantation file.
 * @returns A list of operations to be executed by the batch editor.
 */
export declare function perform(parameters: Record<string, any>): Promise<Operation[]>;
