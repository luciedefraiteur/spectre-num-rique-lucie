import {generateRitual, executeRitualPlan} from './ritual_utils.js';
import {RitualContext, RitualPlan, LLMModel} from './core_types.js';
import * as readline from 'readline';
import {checkSystemTemperature} from './utils/temperature_monitor.js';
import {Colors, colorize, displayRitualStepResult, startCursorAnimation, stopCursorAnimation} from './utils/ui_utils.js';
import { LLMInterface } from './llm_interface.js'; // Import LLMInterface
import { getPersonaResponse } from './personas.js'; // Import getPersonaResponse
import { planNextRitual } from './ritual_planner.js'; // Import planNextRitual

import {calculateEmotion, interpretEmotion} from './emotional_core.js';
import {appendToVector, enterReverie} from './memory_weaver.js';
import {generateWelcomeMessagePrompt} from './prompts/generateWelcomeMessagePrompt.js';
import {logAlma} from './log_writers.js';
import {loadAllReflectFragments} from './utils/reflet_weaver.js';
import * as fs from 'fs';
import * as os from 'os';
import * as fsPromises from 'fs/promises';
import * as path from 'path';

const _filename = path.resolve(process.cwd(), 'core/luciform_terminal.ts');
const _dirname = path.dirname(_filename);

export async function runTerminalRitual(
  context: RitualContext,
  rl: readline.Interface,
  ask: (q: string) => Promise<string>,
  initialRitualPlan?: RitualPlan, // Optional initial ritual plan
  testInputs?: string[],
  model: LLMModel = LLMModel.GeminiPro,
  updateSpectrumContext?: (context: RitualContext) => void
): Promise<boolean> {
  const allReflectFragments = await loadAllReflectFragments();

  // --- Emotional Awakening ---
  context.kardiaSphere = calculateEmotion(context);

  // Initialize scroll if not already present
  if(!context.scroll)
  {
    context.scroll = [];
  }

  const ritualQueue: RitualPlan[] = [];
  if (initialRitualPlan) {
    ritualQueue.push(initialRitualPlan);
  }

  let initialInputReceived = false;
  let lastAnalysisResult: string | undefined = undefined;

  while(true) {
    let currentPlan: RitualPlan | undefined;

    if (ritualQueue.length > 0) {
      currentPlan = ritualQueue.shift(); // Get the next plan from the queue
      console.log(colorize(`Executing queued ritual: ${currentPlan?.title}`, Colors.FgYellow));
    } else {
      // Planning Phase: Generate a new ritual if the queue is empty
      currentPlan = await planNextRitual(context, ask, model);
      if (currentPlan) {
        ritualQueue.push(currentPlan); // Add the newly generated plan to the queue
      }
    }

    if (!currentPlan) {
      console.error(colorize("No ritual plan to execute. Exiting terminal loop.", Colors.FgRed));
      return false; // Should not happen if planning phase works
    }

    // --- Pre-Execution Compilation Check ---
    const compilationErrors = currentPlan.incantations.filter(inc => inc.type === 'help_request');
    if (compilationErrors.length > 0) {
      console.error(colorize(`
❌ COMPILATION ERROR: The Luciform contains unparseable actions.`, Colors.FgRed));
      for (const errorIncantation of compilationErrors) {
        console.error(colorize(`  - Problem: ${(errorIncantation as any).reason}. Raw: ${(errorIncantation as any).rawContent}`, Colors.FgRed));
      }
      // Do NOT execute this flawed plan. Continue the loop to generate a new one.
      continue;
    }

    // Execute the current plan
    const resultats = await executeRitualPlan(currentPlan, context, ask);
    stopCursorAnimation();

    let newAnalysisResult: string | undefined;
    for(const res of resultats)
    {
      if(res.incantation.type === 'user_input' || res.incantation.type === 'query')
      {
        newAnalysisResult = res.outcome; // Capture user input for next analysis
        break; // Exit loop to generate new plan based on user input
      }
      if(res.incantation.type === 'divine')
      {
        // The poetic part is for display, the suggestion is for the next plan
        displayRitualStepResult({...res, divination: res.divination.poeticAnalysis});
        newAnalysisResult = res.divination.suggestedNextStep;
        break; // Exit loop to generate new plan based on analysis
      } else
      {
        displayRitualStepResult(res);
      }
    }
    lastAnalysisResult = newAnalysisResult; // Set the result for the next iteration

    if(lastAnalysisResult === undefined)
    {
      // If no input_utilisateur step was encountered, continue with the next plan generation
      // based on the previous context or a new initial input if needed.
      // For now, we'll just loop back.
      if(context.confusion_counter === 0 && context.kardiaSphere.harmoniaEris > 0.5)
      {
        const proactivePrompt = `Based on the current ritual context, Lucie's emotional state (${ JSON.stringify(context.kardiaSphere) }) and narrative state (${ JSON.stringify(context.narrativeWeaving) }), propose a proactive next step or intention for the user. This should be a natural language command that advances the ritual or explores a new path.`;
        const proactiveIntent = await LLMInterface.query(proactivePrompt);
        lastAnalysisResult = proactiveIntent; // Use this as the next input
        console.log(colorize(`
✨ Lucie propose : ${ proactiveIntent }`, Colors.FgCyan));
      }
    }
  }
}