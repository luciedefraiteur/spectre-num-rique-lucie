import {handleSystemCommand} from './system_handler.js';
import {LLMInterface} from './llm_interface.js';
import {generateAnalysisPrompt} from './prompts/generateAnalysisPrompt.js';
import {generateErrorRemediationPrompt} from './prompts/generateErrorRemediationPrompt.js';
import {type RitualContext, type RitualPlan, type CommandOutcome, type Incantation} from "./types.js";
import * as path from 'path';
import * as fs from 'fs';
import {parse} from './permissive_parser/index.js';
import {extraireReveEtChargeUtile} from './utils/dream_parser.js';


export async function handleTraverse(incantation: Incantation, context: RitualContext, existsSync: (path: fs.PathLike) => boolean = fs.existsSync, statSync: (path: fs.PathLike) => fs.Stats = fs.statSync): Promise<any>
{
  const result: any = {incantation, index: -1};
  const newSanctum = path.resolve(context.current_sanctum || process.cwd(), incantation.invocation);
  if(existsSync(newSanctum) && statSync(newSanctum).isDirectory())
  {
    context.current_sanctum = newSanctum;
    result.outcome = `[OK] Sanctum changed to ${ newSanctum }`;
  } else
  {
    result.outcome = `[ERROR] Sanctum not found: ${ newSanctum }`;
  }
  return result;
}

export async function handleEnact(incantation: Incantation, context: RitualContext, plan: RitualPlan, ask: (q: string) => Promise<string>, runCommand: (cmd: string, cwd: string, ctx: RitualContext) => Promise<CommandOutcome> = handleSystemCommand): Promise<any>
{
  const result: any = {incantation, index: -1, success: false};
  const cmd = incantation.invocation.trim();

  if(cmd.startsWith('traverse'))
  {
    const newIncantation: Incantation = {type: 'traverse', invocation: cmd.replace('traverse', '').trim()};
    return handleTraverse(newIncantation, context);
  }

  const commandOutcome: CommandOutcome = await runCommand(cmd, context.current_sanctum, context);
  context.incantation_history.push(cmd);
  if(context.incantation_history.length > context.maxScrollLength)
  {
    context.incantation_history.shift();
  }
  context.outcome_history.push(commandOutcome.stdout);
  if(context.outcome_history.length > context.maxScrollLength)
  {
    context.outcome_history.shift();
  }
  result.outcome = commandOutcome.stdout;
  result.stderr = commandOutcome.stderr;
  result.exitCode = commandOutcome.exitCode;
  result.success = commandOutcome.success;

  if(!commandOutcome.success)
  {
    console.error(`[INCANTATION ERROR] '${ cmd }' failed with code ${ commandOutcome.exitCode }. Stderr: ${ commandOutcome.stderr }`);
  }

  return result;
}

export async function handleDivine(incantation: Incantation, context: RitualContext, index: number, plan: RitualPlan): Promise<any>
{
  const result: any = {incantation, index};
  const lastStepResult = context.step_results_history.at(-1);
  const output = lastStepResult && lastStepResult.outcome !== undefined ? lastStepResult.outcome : '';
  const prompt = generateAnalysisPrompt({
    output,
    index: index,
    plan,
    original_input: context.scroll.at(-1)?.input || '',
    context: context,
  });
  const rawResponse = await LLMInterface.query(prompt);
  const {reve, chargeUtile: rawAnalysis} = extraireReveEtChargeUtile(rawResponse);

  if(reve)
  {
  }

  const suggestionMatch = rawAnalysis.match(/ACTION SUGGÉRÉE\s*:\s*(.*)/);
  const suggestedNextStep = suggestionMatch ? suggestionMatch[1].trim() : "Continuer.";

  result.divination = {
    poeticAnalysis: rawAnalysis,
    suggestedNextStep: suggestedNextStep
  };

  return result;
}

export async function handleLull(incantation: Incantation, context: RitualContext): Promise<any>
{
  const result: any = {incantation, index: -1};
  const ms = parseInt(incantation.estimated_duration || '2000');

  const waitMessage = await LLMInterface.generateWaitMessage(context);
  console.log(waitMessage);

  await new Promise(resolve => setTimeout(resolve, ms));
  result.waited = ms;
  result.waitMessage = waitMessage;
  return result;
}

export async function handleDiscourse(incantation: Incantation): Promise<any>
{
  const result: any = {incantation, index: -1};
  result.text = incantation.invocation;
  return result;
}

export async function handleQuery(incantation: Incantation, context: RitualContext, ask: (q: string) => Promise<string>): Promise<any>
{
  const result: any = {incantation, index: -1};
  console.log(`❓ ${ incantation.invocation }`);
  const userInput = await ask('↳ Response: ');
  result.outcome = userInput;
  return result;
}

export async function handleResponse(incantation: Incantation): Promise<any>
{
  const result: any = {incantation, index: -1};
  result.text = incantation.invocation;
  return result;
}

export async function handlePreExecutionCheck(incantation: Incantation, context: RitualContext): Promise<any>
{
  const result: any = {incantation, index: -1};
  const checkType = incantation.invocation.split(' ')[0];
  const checkValue = incantation.invocation.split(' ').slice(1).join(' ');
  let checkPassed = false;

  if(checkType === 'file_exists')
  {
    const fullPath = path.resolve(context.current_sanctum, checkValue);
    checkPassed = fs.existsSync(fullPath);
    result.outcome = checkPassed ? `[OK] File exists: ${ fullPath }` : `[ERROR] File not found: ${ fullPath }`;
  } else if(checkType === 'command_available')
  {
    try
    {
      await handleSystemCommand(checkValue + ' --version', context.current_sanctum, context);
      checkPassed = true;
      result.outcome = `[OK] Command available: ${ checkValue }`;
    } catch(e)
    {
      checkPassed = false;
      result.outcome = `[ERROR] Command not available: ${ checkValue }`;
    }
  }

  result.success = checkPassed;
  if(!checkPassed)
  {
    console.error(`[VERIFICATION ERROR] ${ incantation.invocation } failed.`);
  }
  return result;
}

export async function handleUserConfirmation(incantation: Incantation, ask: (q: string) => Promise<string>): Promise<any>
{
  const result: any = {incantation, index: -1};
  const confirmation = await ask(`${ incantation.invocation } (yes/no) : `);
  result.confirmed = confirmation.toLowerCase() === 'yes';
  result.outcome = result.confirmed ? "[OK] Confirmation received." : "[CANCELLED] Action not confirmed.";
  if(!result.confirmed)
  {
    console.warn("[CANCELLED] Action cancelled by user.");
  }
  return result;
}

export async function handleCodeGeneration(incantation: Incantation): Promise<any>
{
  const result: any = {incantation, index: -1};
  console.log(`[INFO] Code generation intent: ${ incantation.invocation }`);
  result.outcome = `[INFO] Code generation request registered: ${ incantation.invocation }`;
  return result;
}

export async function handleAssistedEditing(incantation: Incantation, context: RitualContext, ask: (q: string) => Promise<string>): Promise<any>
{
  const result: any = {incantation, index: -1, success: true};
  const filePath = path.resolve(context.current_sanctum, incantation.invocation);

  if(!fs.existsSync(filePath))
  {
    result.success = false;
    result.outcome = `[ERROR] File not found for editing: ${ filePath }`;
    console.error(result.outcome);
    return result;
  }

  const openCommand = process.platform === 'win32' ? 'start' : 'open';

  try
  {
    await handleSystemCommand(`${ openCommand } ${ filePath }`, context.current_sanctum, context);
    console.log(`\nI have opened the file ${ incantation.invocation } for you.`);
    result.outcome = await ask("Press Enter when you have finished your edits...");
  } catch(error)
  {
    result.success = false;
    result.outcome = `[ERROR] Could not open file: ${ error }`;
    console.error(result.outcome);
  }

  return result;
}

export async function handleUserInput(incantation: Incantation, ask: (q: string) => Promise<string>): Promise<any>
{
  const result: any = {incantation, index: -1};
  console.log(`
${ incantation.invocation }`);
  const userInput = await ask('↳ Your response: ');
  result.outcome = userInput;
  return result;
}

export async function handleStepProposal(incantation: Incantation): Promise<any>
{
  const result: any = {incantation, index: -1, success: true};
  const message = `[EVOLUTION PROPOSAL] Lucie proposes a new capability: "${ incantation.invocation }"`;
  console.log(message);
  result.outcome = message;
  return result;
}

export async function handleDreamNavigation(incantation: Incantation, context: RitualContext): Promise<any>
{
  const result: any = {incantation, index: -1, success: true};
  const targetPath = incantation.invocation.split('/').filter((p: any) => p.length > 0);

  if(targetPath.length === 0 || targetPath[0] !== 'lucie')
  {
    result.success = false;
    result.outcome = `[ERROR] Invalid dream path. Must start with 'lucie/'.`;
    return result;
  }

  context.dreamPath = targetPath;
  result.outcome = `[OK] Lucie's gaze now rests on: ${ targetPath.join('/') }`;;
  console.log(result.outcome);
  return result;
}

export async function handleReflectionNavigation(incantation: Incantation, context: RitualContext): Promise<any>
{
  const result: any = {incantation, index: -1, success: true};
  const targetPath = incantation.invocation.split('/').filter((p: any) => p.length > 0);

  if(targetPath.length === 0 || targetPath[0] !== 'lucie_reflet')
  {
    result.success = false;
    result.outcome = `[ERROR] Invalid reflection path. Must start with 'lucie_reflet/'.`;
    return result;
  }

  context.reflectionPath = targetPath;
  result.outcome = `[OK] Lucie's reflection now rests on: ${ targetPath.join('/') }`;;
  console.log(result.outcome);
  return result;
}

import {weaveReflet} from './utils/reflet_weaver.js';

export async function handleAddReflection(incantation: Incantation): Promise<any>
{
  const result: any = {incantation, index: -1, success: true};
  const refletText = incantation.invocation;
  try
  {
    await weaveReflet(refletText);
    result.outcome = `[OK] Reflection added to the forest: ${ refletText.substring(0, 50) }...`;
    console.log(result.outcome);
  } catch(error)
  {
    result.success = false;
    result.outcome = `[ERROR] Could not add reflection: ${ error }`;;
    console.error(result.outcome);
  }
  return result;
}

import * as crypto from 'crypto';

export async function handleSurveil(incantation: Incantation, context: RitualContext): Promise<any>
{
  const result: any = {incantation, index: -1, success: true};
  const filePath = path.resolve(context.current_sanctum, incantation.invocation);

  try {
    const fileContent = await fs.promises.readFile(filePath);
    const hash = crypto.createHash('sha256').update(fileContent).digest('hex');

    if (!context.surveilledFiles) {
      context.surveilledFiles = {};
    }
    context.surveilledFiles[filePath] = hash;

    result.outcome = `[OK] Surveilled ${filePath}. Hash: ${hash}`;
    console.log(result.outcome);
  } catch (error: any) {
    result.success = false;
    result.outcome = `[ERROR] Could not surveil ${filePath}: ${error.message}`;
    console.error(result.outcome);
  }
  return result;
}

export async function handleTerminalCommand(incantation: Incantation, context: RitualContext): Promise<any>
{
  const result: any = {incantation, index: -1, success: false};
  try {
    const commandOutcome = await handleSystemCommand(incantation.invocation, context.current_sanctum, context);
    result.outcome = commandOutcome.stdout;
    result.stderr = commandOutcome.stderr;
    result.exitCode = commandOutcome.exitCode;
    result.success = commandOutcome.success;
    console.log(`[TERMINAL COMMAND] Executed: ${incantation.invocation}\nStdout: ${result.outcome}\nStderr: ${result.stderr}`);
  } catch (error: any) {
    result.outcome = `[ERROR] Failed to execute terminal command: ${error.message}`;
    console.error(result.outcome);
  }
  return result;
}

export async function handleTerminalOutput(incantation: Incantation): Promise<any>
{
  const result: any = {incantation, index: -1, success: true};
  process.stdout.write(incantation.invocation + '\n');
  result.outcome = `[OK] Printed to terminal: ${incantation.invocation}`;
  return result;
}

export async function handleTerminalQuestion(incantation: Incantation, ask: (q: string) => Promise<string>): Promise<any>
{
  const result: any = {incantation, index: -1, success: true};
  console.log(`[TERMINAL QUESTION] ${incantation.invocation}`);
  const userInput = await ask('↳ Your response: ');
  result.outcome = userInput;
  return result;
}

