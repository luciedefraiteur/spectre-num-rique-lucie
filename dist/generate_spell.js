import * as fs from 'fs/promises';
import * as path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
async function generateSpellFile() {
    const argv = await yargs(hideBin(process.argv))
        .option('persona', {
        type: 'string',
        description: 'The name of the persona to ask.',
        demandOption: true,
    })
        .option('question', {
        type: 'string',
        description: 'The question to ask the persona.',
        demandOption: true,
    })
        .option('llm', {
        type: 'string',
        description: 'Optional: The LLM model to use (e.g., Mistral, Claude). Defaults to Mistral.',
        default: 'Mistral',
    })
        .help()
        .alias('h', 'help')
        .parse();
    const { persona, question, llm } = argv;
    const spellContent = `→ Ritual .luciform Signature
→ Layers: PAS 1

---PAS---
[Contexte]
Ask the ${persona} persona a question using the ${llm} LLM.
[Action]
{
  "type": "ask_persona",
  "persona": "${persona}",
  "question": "${question}",
  "llm_model": "${llm}"
}
`;
    const fileName = `ask_${persona}_${llm.toLowerCase()}.spell`;
    const filePath = path.join(process.cwd(), fileName);
    try {
        await fs.writeFile(filePath, spellContent, 'utf-8');
        console.log(`Successfully generated spell file: ${filePath}`);
    }
    catch (error) {
        console.error(`Error generating spell file: ${error}`);
    }
}
generateSpellFile();
