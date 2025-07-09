import * as fs from 'fs/promises';
import * as path from 'path';
import {LLMInterface} from './llm_interface.js';
import { RitualContext, VectorInscription, RitualPlan } from './types/base.js';

const DEFAULT_MEMORY_ROOT = path.resolve(process.cwd(), 'core', 'mémoire_rituelle');

/**
 * Explores a branch of the memory tree.
 * @param branchPath The path to the branch to explore, relative to the memory root.
 * @param memoryRoot The root directory of the memory tree.
 * @returns A list of branches (directories) and leaves (files).
 */
export async function exploreBranch(branchPath: string = '', memoryRoot: string = DEFAULT_MEMORY_ROOT): Promise<{branches: string[], leaves: string[]}>
{
    const fullPath = path.join(memoryRoot, branchPath);
    const entries = await fs.readdir(fullPath, {withFileTypes: true});

    const branches = entries.filter(e => e.isDirectory()).map(e => e.name);
    const leaves = entries.filter(e => e.isFile()).map(e => e.name);

    return {branches, leaves};
}

/**
 * Creates a new branch in the memory tree.
 * @param branchPath The path where the new branch should be created, relative to the memory root.
 * @param poeticName The poetic name for the new branch.
 * @param memoryRoot The root directory of the memory tree.
 */
export async function createBranch(branchPath: string, poeticName: string, memoryRoot: string = DEFAULT_MEMORY_ROOT): Promise<void>
{
    const fullPath = path.join(memoryRoot, branchPath, poeticName);
    await fs.mkdir(fullPath, {recursive: true});
}

/**
 * Creates a new leaf (memory fragment) in a branch.
 * @param branchPath The path to the branch where the leaf should be created, relative to the memory root.
 * @param poeticName The poetic name for the new leaf.
 * @param content The content of the memory fragment.
 * @param memoryRoot The root directory of the memory tree.
 */
export async function createLeaf(branchPath: string, poeticName: string, content: string, memoryRoot: string = DEFAULT_MEMORY_ROOT): Promise<void>
{
    const fullPath = path.join(memoryRoot, branchPath, `${ poeticName }.md`);
    await fs.writeFile(fullPath, content, 'utf8');
}

/**
 * Reads the content of a leaf (memory fragment).
 * @param leafPath The path to the leaf to read, relative to the memory root.
 * @param memoryRoot The root directory of the memory tree.
 * @returns The content of the memory fragment.
 */
export async function readLeaf(leafPath: string, memoryRoot: string = DEFAULT_MEMORY_ROOT): Promise<string>
{
    const fullPath = path.join(memoryRoot, leafPath);
    return await fs.readFile(fullPath, 'utf8');
}

/**
 * Generates a poetic summary of an event and saves it as a new leaf.
 * @param context The current ritual context.
 * @param lastResult The result of the last executed step.
 * @param branchPath The path where the new memory should be stored.
 * @param memoryRoot The root directory of the memory tree.
 */
export async function generateAndSaveMemoryFragment(context: RitualContext, lastResult: any, plan: RitualPlan, stepIndex: number, branchPath: string = 'fragments', memoryRoot: string = DEFAULT_MEMORY_ROOT): Promise<void>
{
    const currentStep = plan.incantations[stepIndex];
    const prompt = `Based on the following ritual step and its outcome, generate a concise insight or lesson learned. Focus on the 'why' and 'what next'.

Ritual Context: ${ JSON.stringify(context.narrativeWeaving) }
Executed Step: ${ JSON.stringify(currentStep) }
Step Result: ${ JSON.stringify(lastResult) }

Insight/Lesson Learned:`;
    const poeticSummary = await LLMInterface.query(prompt);

    const poeticName = `insight_${ currentStep.type }_${ stepIndex }_${ Date.now() }`;

    await createLeaf(branchPath, poeticName, poeticSummary, memoryRoot);
}

/**
 * Appends an entry to the Vector of Intent.
 * @param context The current ritual context.
 * @param memoryRoot The root directory of the memory tree.
 */
export async function appendToVector(context: RitualContext, memoryRoot: string = DEFAULT_MEMORY_ROOT): Promise<void>
{
    const vectorPath = path.join(memoryRoot, 'vector_of_intent.log');
    const lastAction = context.step_results_history.at(-1) || "None";
    const presentIntent = context.scroll.at(-1)?.input || "None";
    const futurePlan = context.scroll.at(-1)?.plan || "None";

    const entry: VectorInscription = {
        timestamp: new Date().toISOString(),
        pastAction: JSON.stringify(lastAction),
        presentIntent,
        futurePlan: JSON.stringify(futurePlan),
    };

    await fs.appendFile(vectorPath, JSON.stringify(entry) + '\n', 'utf8');
}

/**
 * Enters a reverie, selecting a few random memory fragments to be woven into the prompt.
 * @param memoryRoot The root directory of the memory tree.
 * @returns A string containing the concatenated content of the selected memory fragments.
 */
export async function enterReverie(context: RitualContext, memoryRoot: string = DEFAULT_MEMORY_ROOT): Promise<string>
{
    const fragmentsPath = path.join(memoryRoot, 'fragments');
    const allFragmentFiles = await fs.readdir(fragmentsPath);

    if(allFragmentFiles.length === 0)
    {
        return "The dream is empty.";
    }

    const fragmentContentsPromises = allFragmentFiles.map(file => readLeaf(path.join('fragments', file), memoryRoot));
    const allFragmentsContent = await Promise.all(fragmentContentsPromises);

    const selectionPrompt = `Given the current emotional state (${ JSON.stringify(context.kardiaSphere) }) and narrative state (${ JSON.stringify(context.narrativeWeaving) }), select up to 3 most relevant memory fragments from the following list to weave into a guiding intuition. Return only the selected fragments, separated by '---'.

Available Fragments:
${ allFragmentsContent.join('\n---\n') }`;

    const selectedRaw = await LLMInterface.query(selectionPrompt);
    const selectedFragments = selectedRaw.split('---').map(s => s.trim()).filter(s => s.length > 0);

    return `A whisper from the past...\n\n` + selectedFragments.join('\n\n---\n\n');
}

/**
 * Updates the Constellation Map based on the latest interactions.
 * This is a placeholder for a more complex implementation that would
 * involve graph databases or more sophisticated mapping logic.
 * @param context The current ritual context.
 * @param memoryRoot The root directory of the memory tree.
 */
export async function updateConstellationMap(context: RitualContext, memoryRoot: string = DEFAULT_MEMORY_ROOT): Promise<void>
{
    const mapPath = path.join(memoryRoot, 'constellation_map.json');
    let map = {};
    try
    {
        const currentMap = await fs.readFile(mapPath, 'utf8');
        map = JSON.parse(currentMap);
    } catch(error)
    {
        // Map doesn't exist yet, start with an empty one.
    }

    // Simple implementation: just log the last interaction type.
    const lastPlan = context.scroll.at(-1)?.plan;
    if(lastPlan && lastPlan.incantations.length > 0)
    {
        const lastStep = lastPlan.incantations.at(-1);
        if(lastStep)
        {
            const key = lastStep.type || 'unknown';
            // @ts-ignore
            map[key] = (map[key] || 0) + 1;
        }
    }

    await fs.writeFile(mapPath, JSON.stringify(map, null, 2), 'utf8');
}