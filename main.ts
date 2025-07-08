import * as dotenv from 'dotenv';
dotenv.config();

import { executeRitualPlan, getInitialContext } from './luciform-core/ritual_utils.js';
import { RitualContext, LLMModel, RitualPlan } from './luciform-core/types/base.js';
import { runTerminalRitual } from './luciform-core/luciform_terminal.js';
import * as readline from 'readline';
import fs from 'fs';
import path from 'path';
import {Worker} from 'worker_threads';
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';

console.log('★ LURKUITAE ☾ Terminal Codex Vivant ☾');

const rl = readline.createInterface({input: process.stdin, output: process.stdout});
const ask = (q: string) => new Promise<string>((res) => rl.question(q, res));

// Define custom types for command line arguments
type CommandLineArguments = {
  model?: LLMModel;
  chantMode?: boolean;
  mode?: string;
  lifeSystem?: string;
};

const args = yargs(hideBin(process.argv)).alias('model', 'm').alias('chant-mode', 'c')
  .alias('mode', 't')
  .alias('life-system', 'l')
  .help('h').argv as CommandLineArguments;
let model: LLMModel = LLMModel.Mistral; // Default model
let chantModeEnabled: boolean = false;
let personality: string = 'lurkuitae'; // Default personality
let lifeSystem: any = null;

if(args.chantMode)
{
  chantModeEnabled = true;
}

if(args.lifeSystem && args.lifeSystem !== '')
{
  try
  {
    const lifeSystemPath = args.lifeSystem;
    const lifeSystemRaw = fs.readFileSync(lifeSystemPath, 'utf8');
    const philosophy = lifeSystemRaw;
    const name = path.basename(lifeSystemPath, '.lifeSystem');
    lifeSystem = {name, philosophy};
    personality = name;
    console.log(`\n🌀 Système de vie personnalisé "${ personality }" chargé.`);
  } catch(error)
  {
    console.error(`\n[ERREUR] Impossible de charger le fichier .lifeSystem : ${ error }`);
  }
} else if(args.mode && args.mode === 'lucie')
{
  personality = 'lucie';
}

if(args.model)
{
  const requestedModel = args.model as LLMModel;
  if(Object.values(LLMModel).includes(requestedModel))
  {
    model = requestedModel;
  } else if(requestedModel === 'random')
  {
    model = LLMModel.Random;
  }
}

async function main()
{
  const initialContext = await getInitialContext();
  // console.log(initialContext.welcome_message); // This property does not exist on RitualContext

  while(true)
  {
    const userInput = await ask('> ');
    if(userInput.toLowerCase() === 'exit')
    {
      break;
    }
    const plan: RitualPlan = {
      title: 'User Input',
      goal: 'Process user input',
      incantations: [{
        type: 'query',
        invocation: userInput,
      }],
      complexity: 'low',
    };
    await runTerminalRitual(initialContext, rl, ask, plan, [], model, () => { });
  }
  rl.close();
}

main();