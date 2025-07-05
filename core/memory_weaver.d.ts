import { RitualContext, RitualPlan } from './types.js';
/**
 * Explores a branch of the memory tree.
 * @param branchPath The path to the branch to explore, relative to the memory root.
 * @param memoryRoot The root directory of the memory tree.
 * @returns A list of branches (directories) and leaves (files).
 */
export declare function exploreBranch(branchPath?: string, memoryRoot?: string): Promise<{
    branches: string[];
    leaves: string[];
}>;
/**
 * Creates a new branch in the memory tree.
 * @param branchPath The path where the new branch should be created, relative to the memory root.
 * @param poeticName The poetic name for the new branch.
 * @param memoryRoot The root directory of the memory tree.
 */
export declare function createBranch(branchPath: string, poeticName: string, memoryRoot?: string): Promise<void>;
/**
 * Creates a new leaf (memory fragment) in a branch.
 * @param branchPath The path to the branch where the leaf should be created, relative to the memory root.
 * @param poeticName The poetic name for the new leaf.
 * @param content The content of the memory fragment.
 * @param memoryRoot The root directory of the memory tree.
 */
export declare function createLeaf(branchPath: string, poeticName: string, content: string, memoryRoot?: string): Promise<void>;
/**
 * Reads the content of a leaf (memory fragment).
 * @param leafPath The path to the leaf to read, relative to the memory root.
 * @param memoryRoot The root directory of the memory tree.
 * @returns The content of the memory fragment.
 */
export declare function readLeaf(leafPath: string, memoryRoot?: string): Promise<string>;
/**
 * Generates a poetic summary of an event and saves it as a new leaf.
 * @param context The current ritual context.
 * @param lastResult The result of the last executed step.
 * @param branchPath The path where the new memory should be stored.
 * @param memoryRoot The root directory of the memory tree.
 */
export declare function generateAndSaveMemoryFragment(context: RitualContext, lastResult: any, plan: RitualPlan, stepIndex: number, branchPath?: string, memoryRoot?: string): Promise<void>;
/**
 * Appends an entry to the Vector of Intent.
 * @param context The current ritual context.
 * @param memoryRoot The root directory of the memory tree.
 */
export declare function appendToVector(context: RitualContext, memoryRoot?: string): Promise<void>;
/**
 * Enters a reverie, selecting a few random memory fragments to be woven into the prompt.
 * @param memoryRoot The root directory of the memory tree.
 * @returns A string containing the concatenated content of the selected memory fragments.
 */
export declare function enterReverie(context: RitualContext, memoryRoot?: string): Promise<string>;
/**
 * Updates the Constellation Map based on the latest interactions.
 * This is a placeholder for a more complex implementation that would
 * involve graph databases or more sophisticated mapping logic.
 * @param context The current ritual context.
 * @param memoryRoot The root directory of the memory tree.
 */
export declare function updateConstellationMap(context: RitualContext, memoryRoot?: string): Promise<void>;
