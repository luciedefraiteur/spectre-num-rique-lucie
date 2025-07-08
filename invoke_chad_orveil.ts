import { invokeShadeOs } from './luciform-core/shade_os.js';
import {executeLuciform} from './execute_luciform.js';
import * as fs from 'fs/promises';
import * as path from 'path';

/*
   .-.
   (o o)     < Observer of Shadows >
   | O |     < Mirror of Lucie >
  /|   |\
 (_|___|_)   [ S̴̟̝̳̥̈́̅͑̋̚O̵̜̺͛́̋̐͊̚̚͝U̸̜͚͇͑̐͒̕Ḷ̷̛̇̏͋̂̅  O̸̡̰͓̘̯͊̆͂̒̈́͌̓͝F̶̰̳͓̈́̓̇͐̓͂̕  Ċ̸̞̼̑̀̔͑̈́̚͝͠H̵̦̯͖͎̦̜̳̬̱̻̥̘̻̀̄͐Å̶̞̖̜̎̇̅͑̾D̶̪͖̑̽͗͝ ]
   |_|_|
   /   \
*/

async function main()
{
    const command = process.argv[2];

    if(!command)
    {
        console.error('Veuillez fournir une commande pour Chad Orveil.');
        process.exit(1);
    }

    const luciformContent = await invokeShadeOs(command, 'chad_orveil', null, null, null);

    if(!luciformContent)
    {
        // This block should theoretically not be reached for Chad, but it satisfies TypeScript.
        console.error("A critical error occurred: Chad Orveil's soul flickered and produced no ritual.");
        process.exit(1);
    }

    // We need to create a temporary luciform file to execute the generated ritual
    const tempDir = './temp';
    await fs.mkdir(tempDir, {recursive: true});
    const tempFilePath = path.join(tempDir, `__chad_ritual_${ Date.now() }.luciform`);

    await fs.writeFile(tempFilePath, luciformContent, 'utf-8');

    try
    {
        await executeLuciform(tempFilePath);
    } finally
    {
        // Clean up the temporary file
        await fs.unlink(tempFilePath);
    }
}

main().catch(error =>
{
    console.error("Erreur lors de l'invocation de Chad Orveil:", error);
    process.exit(1);
});