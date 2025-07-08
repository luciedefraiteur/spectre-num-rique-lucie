import * as fs from 'fs/promises';
import * as path from 'path';
import {applyOperation} from './batch_editor.js';
import { Operation } from './types/base.js';
import {pathToFileURL} from 'url';

interface RitualIncantation
{
    ritual: string;
    parameters: Record<string, any>;
}

async function main()
{
    const args = process.argv.slice(2);
    const incantationPath = args.find(arg => arg.endsWith('.ritual.json'));

    if(!incantationPath)
    {
        console.error('Usage: ts-node-esm core/ritual_conductor.ts <path_to_incantation_file>');
        process.exit(1);
    }

    try
    {
        const incantationJson = await fs.readFile(incantationPath, 'utf-8');
        const incantation: RitualIncantation = JSON.parse(incantationJson);

        const ritualPath = path.resolve(process.cwd(), 'core', 'rituals', `${ incantation.ritual }.ts`);
        const ritualUrl = pathToFileURL(ritualPath).href;
        const ritualModule = await import(ritualUrl);

        if(typeof ritualModule.perform !== 'function')
        {
            throw new Error(`Ritual module ${ incantation.ritual } does not have a 'perform' function.`);
        }

        const operations: Operation[] = await ritualModule.perform(incantation.parameters);

        for(const op of operations)
        {
            await applyOperation(op);
        }

        console.log(`Ritual '${ incantation.ritual }' completed successfully.`);

    } catch(error)
    {
        console.error(`Error conducting ritual: ${ error }`);
        process.exit(1);
    }
}

main();