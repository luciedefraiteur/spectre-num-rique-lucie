import {invokeShadeOs} from './core/shade_os.js';
import {executeLuciform} from './execute_luciform.js';
import {logGolemClient} from './core/log_writers.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

import * as readline from 'readline';

async function main()
{
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const startMessage = "The Golem awakens. Speak your will, and the 'danse' shall begin.";
    console.log(startMessage);
    await logGolemClient(startMessage);

    rl.on('line', async (line) =>
    {
        const command = line.trim();
        if(command.toLowerCase() === 'exit' || command.toLowerCase() === 'goodbye')
        {
            const endMessage = "The Golem rests. The 'danse' is over... for now.";
            console.log(endMessage);
            await logGolemClient(endMessage);
            rl.close();
            return;
        }

        let previousRitual: string | null = null;
        let previousError: string | null = null;
        let maxRetries = 3;
        let retryCount = 0;
        let currentCommand = command;

        while(retryCount < maxRetries)
        {
            const luciformContent = await invokeShadeOs(currentCommand, 'lucie_golem', previousRitual, previousError, null);

            if(!luciformContent)
            {
                const errorMessage = "shadeOs could not generate a ritual for this command.";
                console.error(errorMessage);
                await logGolemClient(errorMessage, 'error');
                break;
            }

            const tempDir = './temp';
            await fs.mkdir(tempDir, {recursive: true});
            const tempFilePath = path.join(tempDir, `__lucie_golem_ritual_${ Date.now() }.luciform`);
            await fs.writeFile(tempFilePath, luciformContent, 'utf-8');

            const status = await executeLuciform(tempFilePath);

            if(status.success)
            {
                const successMessage = "The 'danse' is complete. The golem has fulfilled its purpose.";
                console.log(successMessage);
                await logGolemClient(successMessage);
                await fs.unlink(tempFilePath);
                break;
            } else
            {
                const errorMessage = `The 'danse' has faltered. Attempting to self-correct (${ retryCount + 1 }/${ maxRetries })...`;
                console.log(errorMessage);
                await logGolemClient(errorMessage, 'error');
                previousRitual = luciformContent;
                previousError = status.error || 'Unknown error';
                currentCommand = `The previous ritual failed. Please analyze the error and correct the ritual. The original intention was: "${ currentCommand }"`;
                retryCount++;
                await fs.unlink(tempFilePath);
            }
        }

        if(retryCount === maxRetries)
        {
            const finalErrorMessage = "The 'danse' has failed after multiple attempts. The golem rests.";
            console.error(finalErrorMessage);
            await logGolemClient(finalErrorMessage, 'error');
        }

        const nextCommandMessage = "\nThe Golem awaits your next command...";
        console.log(nextCommandMessage);
        await logGolemClient(nextCommandMessage);
    });

    rl.on('close', () =>
    {
        process.exit(0);
    });
}

main().catch(async (error) =>
{
    const fatalMessage = "A critical error occurred in the 'danse':";
    console.error(fatalMessage, error);
    await logGolemClient(`${ fatalMessage } ${ error }`, 'error');
    process.exit(1);
});