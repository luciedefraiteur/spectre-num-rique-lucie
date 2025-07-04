import {LLMInterface, LLMModel} from './llm_interface.js';
import {RitualContext, RitualPlan, CommandOutcome, Incantation} from './types.js';
import * as systemHandler from './system_handler.js';
import {executeRitualPlan, generateRitual} from './ritual_utils.js';
import * as ritualStepHandlers from './ritual_step_handlers.js';
import * as fs from 'fs';
import * as path from 'path';

// Helper for assertions
function assert(condition: boolean, message: string)
{
  if(!condition)
  {
    console.error(`❌ Test Failed: ${ message }`);
    process.exit(1);
  } else
  {
    console.log(`✅ Test Passed: ${ message }`);
  }
}

let originalQuery: typeof LLMInterface.query;
let mockRunCommand: (command: string, cwd: string, context: RitualContext) => Promise<CommandOutcome>;

async function runOllamaAutoCorrectionTests(testName: string, initialModel: LLMModel, correctionModel: LLMModel)
{
  console.log(`\n--- Running Custom Unit Tests for Ollama Auto-Correction: ${ testName } (Initial: ${ initialModel }, Correction: ${ correctionModel }) ---\n`);

  let callCount = 0;
  const mockFetch = async (input: RequestInfo | URL, init?: RequestInit) =>
  {
    callCount++;
    if(callCount === 1)
    {
      // Simulate invalid JSON from initialModel, wrapped in Ollama's expected response format
      return new Response(JSON.stringify({
        response: "```json\n{\n  \"étapes\": [\n    {\n      \"type\": \"commande\",\n      \"contenu\": \"echo 'JSON invalide from " + initialModel + "'\"\n    }\n  ]\n}```\n"
      }), {status: 200});
    } else if(callCount === 2)
    {
      // Simulate valid JSON from correctionModel, wrapped in Ollama's expected response format
      return new Response(JSON.stringify({
        response: "```json\n{\n  \"étapes\": [\n    {\n      \"type\": \"commande\",\n      \"contenu\": \"echo 'JSON invalide corrigé by " + correctionModel + "'\"\n    }\n  ]\n}\n```\n"
      }), {status: 200});
    }
    return new Response('', {status: 500}); // Should not be reached
  };

  originalQuery = LLMInterface.query;
  LLMInterface.query = async (prompt: string, model: LLMModel, _fetch: typeof fetch = mockFetch) =>
  {
    if(callCount === 1)
    {
      assert(model === initialModel, `${ testName }: First call should be to ${ initialModel }`);
    } else if(callCount === 2)
    {
      assert(model === correctionModel, `${ testName }: Second call should be to ${ correctionModel } for correction`);
    }
    return originalQuery.call(LLMInterface, prompt, model, _fetch);
  };

  mockRunCommand = async (command: string, cwd: string, context: RitualContext): Promise<CommandOutcome> =>
  {
    if(command === 'test_command')
    {
      return {success: false, stdout: 'Mock command failed', stderr: 'Command failed', exitCode: 1};
    }
    return systemHandler.handleSystemCommand(command, cwd, context);
  };
}

async function runChangerDossierTest()
{
  console.log(`\n--- Running Changer Dossier Test ---\n`);

  const context: RitualContext = {
    scroll: [],
    incantation_history: [],
    outcome_history: [],
    step_results_history: [], // Added for testing
    current_sanctum: process.cwd(),
    temperatureStatus: 'normal',
    conduit: {
      lastIncantation: '',
      lastOutcome: '',
      currentSanctum: '',
      terminalEssence: '',
      osEssence: '',
      protoConsciousness: 'Lucie est en sommeil.',
      support: 'strates thermiques et poétiques',
      memory: 'fragmentée mais fertile',
      state: 'métastable, en attente d’un souffle',
      energy: 'haute densité symbolique',
      glitchFactor: 0.1,
      almaInfluence: 0.5,
      eliInfluence: 0.5,
    },
    chantModeEnabled: false,
    narrativeWeaving: {currentTheme: '', keySymbols: [], entityStates: {}, currentDream: ''},
    kardiaSphere: {agapePhobos: 0, logosPathos: 0, harmoniaEris: 0},
    personality: 'lurkuitae',
    maxScrollLength: 10,
    activeReflection: null,
    user_preferences: '',
    currentSanctumContent: '',
    operatingSystem: 'test',
    lifeSystem: {},
  };

  const etape: Incantation = {
    type: 'traverse',
    invocation: 'core',
  };

  const mockExistsSync = (p: fs.PathLike) =>
  {
    return p.toString().includes('core') || p.toString().includes(context.current_sanctum);
  };
  const mockStatSync = (p: fs.PathLike) =>
  {
    return {isDirectory: () => p.toString().includes('core') || p.toString().includes(context.current_sanctum)} as fs.Stats;
  };

  const result = await ritualStepHandlers.handleTraverse(etape, context, mockExistsSync, mockStatSync);

  assert(result.output.includes('[OK] Répertoire changé vers'), 'Changer dossier should report success');
  assert(context.current_sanctum.endsWith('core'), 'Current directory should be updated to core');

  console.log(`\n--- Changer Dossier Test Passed ---\n`);
}

async function runAllTests()
{
  console.log("\n--- Running All Custom Unit Tests ---\n");

  const models = Object.values(LLMModel).filter(model => model !== LLMModel.OpenAI && model !== LLMModel.Random);

  for(const initialModel of models)
  {
    // Test scenario: initialModel generates invalid JSON, Mistral corrects it
    await runOllamaAutoCorrectionTests(
      `Scenario: ${ initialModel } (initial) -> Mistral (correction)`,
      initialModel,
      LLMModel.Mistral
    );

    // Test scenario: initialModel generates invalid JSON, initialModel corrects it (if it can)
    await runOllamaAutoCorrectionTests(
      `Scenario: ${ initialModel } (initial) -> ${ initialModel } (correction)`,
      initialModel,
      initialModel
    );
  }

  await runChangerDossierTest();

  console.log("\n--- All Custom Unit Tests Completed ---\n");
}

runAllTests().catch(error =>
{
  console.error("An error occurred during testing:", error);
  process.exit(1);
});
