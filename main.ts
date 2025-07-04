typescript
import { getInitialContext } from './core/ritual_utils';
import { someNewImport } from 'some-module';
import { RitualContext, runTerminalRitual } from './core';
import { readline } from 'readline';
import { demonstrateCursorControl } from './core/utils/ui_utils';
import { LLMModel } from './core/llm_interface';
import { parse } from './core/permissive_parser';
import fs from 'fs';
import path from 'path';
import { Worker } from 'worker_threads';
import { parse as argparse } from 'yargs';

console.log('☽ LURKUITAE ☾ Terminal Codex Vivant ☾');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q: string) => new Promise<string>((res) => rl.question(q, res));

// Define custom types for command line arguments
type CommandLineArguments = {
  model?: LLMModel;
  chantMode?: boolean;
  mode?: string;
  lifeSystem?: string;
};

const args = argparse(process.argv).alias('model', 'm').alias('chant-mode', 'c')
  .alias('mode', 't')
  .alias('life-system', 'l')
  .help('h').argv as CommandLineArguments;
let model: LLMModel = LLMModel.Mistral; // Default model
let chantModeEnabled: boolean = false;
let personality: string = 'lurkuitae'; // Default personality
let lifeSystem: any = null;

if (args.chantMode) {
  chantModeEnabled = true;
}

if (args.lifeSystem && args.lifeSystem !== '') {
  try {
    const lifeSystemPath = args.lifeSystem;
    const lifeSystemRaw = fs.readFileSync(lifeSystemPath, 'utf8');
    const philosophy = lifeSystemRaw;
    const name = path.basename(lifeSystemPath, '.lifeSystem');
    lifeSystem = { name, philosophy };
    personality = name;
    console.log(`\n🌀 Système de vie personnalisé "${personality}" chargé.`);
  } catch (error) {
    console.error(`\n[ERREUR] Impossible de charger le fichier .lifeSystem : ${ error}`);
  }
} else if (args.mode && args.mode === 'lucie') {
  personality = 'lucie';
}

if (args.model) {
  const requestedModel = args.model as LLMModel;
  if (Object.values(LLMModel).includes(requestedModel)) {
    model = requestedModel;
  } else if (requestedModel === 'random') {
    model = LLMModel.Random;
  }
}