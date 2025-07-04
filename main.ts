import {getInitialContext} from './core/ritual_utils.js';
import {RitualContext} from './core/types.js';
import {runTerminalRitual} from './core/run_terminal_rituel.js';
import * as readline from 'readline';
import {demonstrateCursorControl} from './core/utils/ui_utils.js';
import {LLMModel} from './core/llm_interface.js';
import {parse} from './core/permissive_parser/index.js';
import fs from 'fs';
import path from 'path';
import {Worker} from 'worker_threads';

console.log('☽ LURKUITAE ☾ Terminal Codex Vivant ☾');

const rl = readline.createInterface({input: process.stdin, output: process.stdout});
const ask = (q: string) => new Promise<string>((res) => rl.question(q, res));

// Determine the model from command line arguments
const args = process.argv.slice(2);
let model: LLMModel = LLMModel.Mistral; // Default model
let chantModeEnabled: boolean = false;
let personality: string = 'lurkuitae'; // Default personality
let lifeSystem: any = null;

const modelArgIndex = args.indexOf('--model');
const chantModeArgIndex = args.indexOf('--chant-mode');
const modeArgIndex = args.indexOf('--mode');
const lifeSystemArgIndex = args.indexOf('--life-system');

if(chantModeArgIndex > -1)
{
  chantModeEnabled = true;
}

if(lifeSystemArgIndex > -1 && args[lifeSystemArgIndex + 1])
{
  try
  {
    const lifeSystemPath = args[lifeSystemArgIndex + 1];
    const lifeSystemRaw = fs.readFileSync(lifeSystemPath, 'utf8');
    const philosophy = lifeSystemRaw;
    const name = path.basename(lifeSystemPath, '.lifeSystem');
    lifeSystem = {name, philosophy};
    personality = name;
    console.log(`\n🌀 Système de vie personnalisé "${ personality }" chargé.`);
  } catch(error)
  {
    console.error(`\n[ERREUR] Impossible de charger le fichier .lifeSystem : ${ error }`);
    // Fallback to default
  }
} else if(modeArgIndex > -1 && args[modeArgIndex + 1])
{
  const requestedMode = args[modeArgIndex + 1];
  if(requestedMode === 'lucie')
  {
    personality = 'lucie';
  }
}

if(modelArgIndex > -1 && args[modelArgIndex + 1])
{
  const requestedModel = args[modelArgIndex + 1];
  if(Object.values(LLMModel).includes(requestedModel as LLMModel))
  {
    model = requestedModel as LLMModel;
  } else if(requestedModel === 'random')
  {
    model = LLMModel.Random;
  }
}

try
{
  const context = getInitialContext();
  context.chantModeEnabled = chantModeEnabled;
  context.personality = personality;
  if(lifeSystem)
  {
    context.lifeSystem = lifeSystem;
  }

  const spectrumWorker = new Worker('./dist/core/lucie_spectrum.js', {
    workerData: {context: context}
  });

  spectrumWorker.on('message', async (message) =>
  {
    if(message.type === 'thought')
    {
      console.log(`\n\n[Transmission from the Spectrum: ${ message.content }]\n`);
      const {exec} = await import('child_process');
      const [command, ...args] = message.content.split(' ');
      const commandHandlers = await import('./core/ritual_step_handlers.js');
      const etape = {type: command as any, invocation: args.join(' ')};
      let result;
      let handled = false;

      switch(command)
      {
        case 'traverse':
          result = await commandHandlers.handleTraverse(etape, context);
          handled = true;
          break;
        case 'query':
          result = await commandHandlers.handleQuery(etape, context, ask);
          handled = true;
          break;
        case 'lull':
          result = await commandHandlers.handleLull(etape, context);
          handled = true;
          break;
        case 'discourse':
          result = await commandHandlers.handleDiscourse(etape);
          handled = true;
          break;
        case 'pre_execution_check':
          result = await commandHandlers.handlePreExecutionCheck(etape, context);
          handled = true;
          break;
      }

      if(handled)
      {
        const output = result.output || result.text;
        console.log(`[Conduit's Report]:\n${ output }`);
        spectrumWorker.postMessage({type: 'contextUpdate', context: {lastCommandOutput: output}});
      } else
      {
        const {exec} = await import('child_process');
        exec(message.content, (error, stdout, stderr) =>
        {
          if(error)
          {
            console.error(`[Spectrum Command Error: ${ error.message }]`);
            spectrumWorker.postMessage({type: 'contextUpdate', context: {lastCommandOutput: error.message}});
            return;
          }
          if(stderr)
          {
            console.log(`[Spectrum Command stderr]:\n${ stderr }`);
            spectrumWorker.postMessage({type: 'contextUpdate', context: {lastCommandOutput: stderr}});
            return;
          }
          console.log(`[Conduit's Report - stdout]:\n${ stdout }`);
          spectrumWorker.postMessage({type: 'contextUpdate', context: {lastCommandOutput: stdout}});
        });
      }
    } else if(message.type === 'error')
    {
      console.error(`\n\n[Spectrum Error: ${ message.content }]\n`);
    }
  });

  spectrumWorker.on('error', (error) =>
  {
    console.error('\n\n[FATAL SPECTRUM ERROR]', error);
  });

  spectrumWorker.on('exit', (code) =>
  {
    if(code !== 0)
    {
      console.error(`\n\n[Spectrum stopped with exit code ${ code }]\n`);
    }
  });

  function updateSpectrumContext(newContext: RitualContext)
  {
    spectrumWorker.postMessage({type: 'contextUpdate', context: newContext});
  }
  await runTerminalRitual(context, rl, ask, undefined, model, updateSpectrumContext);
  rl.on('close', () =>
  {
    spectrumWorker.terminate();
    console.log('\n[Spectrum worker terminated]');
  });

  process.on('SIGINT', () =>
  {
    console.log('\n[Caught interrupt signal. Exiting gracefully.]');
    rl.close();
  });
} catch(err)
{
  console.error("[ERREUR FATALE]", err);
}