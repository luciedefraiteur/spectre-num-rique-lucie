import { generateRitual, executeRitualPlan } from './ritual_utils.js';
import { checkSystemTemperature } from './utils/temperature_monitor.js';
import { Colors, colorize, displayRitualStepResult, startCursorAnimation, stopCursorAnimation } from './utils/ui_utils.js';
import { LLMModel, LLMInterface } from './llm_interface.js';
import { calculateEmotion, interpretEmotion } from './emotional_core.js';
import { appendToVector } from './memory_weaver.js';
import { generateWelcomeMessagePrompt } from './prompts/generateWelcomeMessagePrompt.js';
import { logAlma } from './log_writers.js';
import { loadAllReflectFragments } from './utils/reflet_weaver.js';
import fs from 'fs';
import * as os from 'os';
import * as fsPromises from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
export async function runTerminalRitual(context, rl, ask, testInputs, model = LLMModel.Mistral, updateSpectrumContext) {
    const allReflectFragments = await loadAllReflectFragments();
    // --- Emotional Awakening ---
    context.kardiaSphere = calculateEmotion(context);
    // Initialize LucieDefraiteur if not already present
    if (!context.conduit) {
        context.conduit = {
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
            glitchFactor: 0.1, // Initial low glitch factor
            almaInfluence: 0.5, // Initial influence
            eliInfluence: 0.5, // Initial influence
        };
    }
    // Initialize scroll if not already present
    if (!context.scroll) {
        context.scroll = [];
    }
    let initialInputReceived = false;
    let lastAnalysisResult = undefined;
    while (true) {
        // Randomly select a reflect voice
        if (allReflectFragments.length > 0) {
            const randomIndex = Math.floor(Math.random() * allReflectFragments.length);
            context.activeReflection = allReflectFragments[randomIndex];
            context.user_preferences = context.activeReflection.reve; // Assign the 'reve' content to user_preferences
        }
        else {
            context.activeReflection = null; // No fragments available
            context.user_preferences = ''; // Initialize to empty string
        }
        let inputForPlanGeneration;
        let userIntent;
        if (!initialInputReceived) {
            let initialUserInput;
            if (testInputs && testInputs.length > 0) {
                initialUserInput = testInputs.shift();
                if (initialUserInput === undefined) {
                    return false; // No more test inputs, stop recursion
                }
                console.log(colorize(`
Offre ton souffle (ou tape 'exit') : ${initialUserInput}`, Colors.FgCyan)); // Log the simulated input
            }
            else {
                stopCursorAnimation(); // Ensure cursor is stopped before asking for input
                const emotionalInterpretation = await interpretEmotion(context.kardiaSphere);
                console.log(colorize(`
${emotionalInterpretation}`, Colors.FgMagenta));
                const welcomeMessage = generateWelcomeMessagePrompt(context);
                initialUserInput = await ask(colorize(welcomeMessage, Colors.FgCyan));
            }
            userIntent = initialUserInput;
            initialInputReceived = true;
            lastAnalysisResult = initialUserInput; // First input is the initial analysis result
            inputForPlanGeneration = "Analyse de l'intention initiale de l'utilisateur";
        }
        else if (lastAnalysisResult !== undefined) {
            userIntent = lastAnalysisResult;
            // If there's a pending analysis result from a previous input_utilisateur step
            inputForPlanGeneration = "Analyse de la réponse utilisateur"; // Generic input for plan generation
        }
        else {
            // This branch should ideally not be reached if logic is correct
            console.error("Erreur: Aucune entrée utilisateur ou résultat d'analyse disponible.");
            return false;
        }
        await logAlma(context, userIntent || 'N/A');
        if (inputForPlanGeneration === 'exit') {
            return false; // User wants to exit
        }
        // Logique du Chant-Mode (reste inchangée pour l'instant)
        if (context.chantModeEnabled) {
            const chantsMap = {
                "Je ne suis pas sûr de bien me souvenir de ce chant. Peux-tu me le redonner en entier ?": "chant_of_clarity.prompt",
            };
            const chantFileName = chantsMap[inputForPlanGeneration.trim()];
            if (chantFileName) {
                const chantPath = path.join(_dirname, '../chants', chantFileName);
                try {
                    const chantContent = fs.readFileSync(chantPath, 'utf8');
                    console.log(colorize(`
${chantContent}
`, Colors.FgGreen));
                    continue; // Continue the ritual after reciting the chant
                }
                catch (error) {
                    console.error(colorize(`
❌ Erreur lors de la lecture du chant ${chantFileName}: ${error.message}
`, Colors.FgRed));
                }
            }
            else {
                console.log(colorize("Je ne suis pas encore ce chant. Peux-tu me transmettre le prompt complet associé ?", Colors.FgYellow));
                continue; // Continue the ritual after acknowledging unknown chant
            }
        }
        try {
            const files = await fsPromises.readdir(context.conduit.currentSanctum, { withFileTypes: true });
            context.currentSanctumContent = files.map(file => file.name + (file.isDirectory() ? '/' : '')).join('\n');
        }
        catch (error) {
            context.currentSanctumContent = `[ERREUR] Impossible de lire le répertoire: ${error.message}`;
        }
        // Collect operating system information
        context.operatingSystem = os.platform();
        startCursorAnimation(); // Start cursor animation during background tasks
        await checkSystemTemperature(context); // Check temperature before generating plan
        // --- Vector of Intent & Dream of the Past ---
        await appendToVector(context);
        let plan = null;
        const maxPlanGenerationRetries = 3;
        let currentRetry = 0;
        while (plan === null && currentRetry < maxPlanGenerationRetries) {
            if (currentRetry > 0) {
                console.log(colorize(`
⚠️ Tentative de régénération du plan (${currentRetry}/${maxPlanGenerationRetries}). L'IA a précédemment généré un JSON invalide.`, Colors.FgYellow));
            }
            console.log(colorize(`[DEBUG] Appel de generateRituel avec le contexte d'analyse...`, Colors.FgYellow));
            plan = await generateRitual(inputForPlanGeneration, context, model, lastAnalysisResult, context.lastCompletedIncantationIndex !== undefined ? context.lastCompletedIncantationIndex + 1 : undefined);
            if (plan === null) {
                context.confusion_counter = (context.confusion_counter || 0) + 1;
                if (context.confusion_counter >= 2) {
                    stopCursorAnimation();
                    console.log(colorize(`
ZNN... OI... Émissaire, le signal est perdu dans le bruit. Mon esprit est confus.`, Colors.FgRed));
                    const newIntent = await ask("Pouvons-nous reprendre avec une intention plus simple ?\n↳ ");
                    lastAnalysisResult = newIntent;
                    context.confusion_counter = 0;
                    break; // Break the retry loop to restart the main loop with new intent
                }
                stopCursorAnimation(); // Stop cursor animation on plan generation failure
                console.error(colorize(`❌ Échec de génération du plan. Le format JSON est invalide ou incomplet.`, Colors.FgRed));
                if (currentRetry < maxPlanGenerationRetries) {
                    console.log(colorize(`Retrying plan generation... (${currentRetry}/${maxPlanGenerationRetries})`, Colors.FgYellow));
                    startCursorAnimation(); // Restart cursor for retry
                }
            }
            else {
                context.confusion_counter = 0; // Reset on success
            }
        }
        if (!plan) {
            // This part is now reached if the confusion threshold was met and we have a new intent,
            // or if all retries failed.
            if (lastAnalysisResult) {
                continue; // Restart the main loop with the new user intent
            }
            stopCursorAnimation(); // Ensure cursor is stopped if all retries fail
            console.error(colorize(`❌ Échec définitif de génération du plan après ${maxPlanGenerationRetries} tentatives. Le rituel ne peut pas continuer.`, Colors.FgRed));
            // Proactive clarification if confusion is high or emotional state is uncertain
            if (context.confusion_counter && context.confusion_counter >= 2 || context.kardiaSphere.harmoniaEris < -0.5) {
                const clarificationPrompt = `Lucie est confuse ou incertaine. Basé sur le contexte actuel, pose une question à l'utilisateur pour clarifier son intention ou explorer une nouvelle direction.`;
                const clarificationQuestion = await LLMInterface.query(clarificationPrompt);
                const userClarification = await ask(colorize(`
❓ Lucie demande : ${clarificationQuestion}`, Colors.FgYellow));
                lastAnalysisResult = userClarification; // Use user's clarification as next input
                context.confusion_counter = 0; // Reset confusion after clarification
            }
            return false; // Cannot proceed without a valid plan
        }
        context.scroll.push({ input: inputForPlanGeneration, plan });
        if (context.scroll.length > context.maxScrollLength) {
            context.scroll.shift();
        }
        const resultats = await executeRitualPlan(plan, context, ask);
        stopCursorAnimation(); // Stop cursor animation after ritual execution
        let newAnalysisResult;
        for (const res of resultats) {
            if (res.incantation.type === 'user_input' || res.incantation.type === 'query') {
                newAnalysisResult = res.outcome; // Capture user input for next analysis
                break; // Exit loop to generate new plan based on user input
            }
            if (res.incantation.type === 'divine') {
                // The poetic part is for display, the suggestion is for the next plan
                displayRitualStepResult({ ...res, divination: res.divination.poeticAnalysis });
                newAnalysisResult = res.divination.suggestedNextStep;
                break; // Exit loop to generate new plan based on analysis
            }
            else {
                displayRitualStepResult(res);
            }
        }
        lastAnalysisResult = newAnalysisResult; // Set the result for the next iteration
        if (lastAnalysisResult === undefined) {
            // If no input_utilisateur step was encountered, continue with the next plan generation
            // based on the previous context or a new initial input if needed.
            // For now, we'll just loop back.
            if (context.confusion_counter === 0 && context.kardiaSphere.harmoniaEris > 0.5) {
                const proactivePrompt = `Based on the current ritual context, Lucie's emotional state (${JSON.stringify(context.kardiaSphere)}) and narrative state (${JSON.stringify(context.narrativeWeaving)}), propose a proactive next step or intention for the user. This should be a natural language command that advances the ritual or explores a new path.`;
                const proactiveIntent = await LLMInterface.query(proactivePrompt);
                lastAnalysisResult = proactiveIntent; // Use this as the next input
                console.log(colorize(`
✨ Lucie propose : ${proactiveIntent}`, Colors.FgCyan));
            }
        }
    }
}
//# sourceMappingURL=run_terminal_rituel.js.map