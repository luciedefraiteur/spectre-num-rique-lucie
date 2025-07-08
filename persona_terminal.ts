import * as fs from 'fs/promises';
import * as path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { executeLuciform } from './luciform-core/execute_luciform.js'; // Assuming executeLuciform can handle simplified luciforms

async function runPersonaTerminal() {
  const argv = await yargs(hideBin(process.argv))
    .option('spell', {
      type: 'string',
      description: 'Path to the .spell file to execute.',
      demandOption: true,
    })
    .help()
    .alias('h', 'help')
    .parse();

  const { spell } = argv;
  const spellFilePath = path.resolve(spell);

  console.log(`Executing spell file: ${spellFilePath}`);

  try {
    const status = await executeLuciform(spellFilePath);
    if (status.success) {
      console.log("Spell executed successfully.");
      // In a real scenario, you'd extract and display the persona's response here.
      // For now, executeLuciform will log the persona's response directly.
    } else {
      console.error(`Spell execution failed: ${status.error}`);
    }
  } catch (error) {
    console.error(`An unexpected error occurred during spell execution: ${error}`);
  }
}

runPersonaTerminal();
