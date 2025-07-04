import {executeRitualPlan, generateRitual} from './ritual_utils.js';
import {RitualContext, RitualPlan, Incantation} from './types.js';
import {Colors, colorize} from './utils/ui_utils.js';
import * as stepHandlers from './ritual_step_handlers.js';

async function testReplanLogic()
{
    console.log(colorize("--- Running Test: Re-planning Logic without Infinite Loop ---", Colors.FgYellow));

    // --- Test Setup ---
    let analysisCounter = 0;

    const mockHandleAnalyse = async (incantation: Incantation, context: RitualContext, index: number, plan: RitualPlan) =>
    {
        analysisCounter++;
        console.log(colorize(`[MOCK] handleAnalyse called. Count: ${ analysisCounter }`, Colors.FgMagenta));
        return {
            incantation,
            index,
            analysis: "Analysis result that should trigger a new plan."
        };
    };

    const mockHandleCommande = async (incantation: Incantation, context: RitualContext, plan: RitualPlan) =>
    {
        console.log(colorize(`[MOCK] handleCommande called for: ${ incantation.invocation }`, Colors.FgMagenta));
        return {
            incantation,
            index: -1, // This will be set by the loop
            output: "Mocked command output",
            success: true,
        };
    };

    const mockGenerateRitual = async (input: string, context: RitualContext, model?: any, analysisResult?: string): Promise<RitualPlan | null> =>
    {
        const newPlanAfterAnalysis: RitualPlan = {
            title: 'New Plan After Analysis',
            goal: 'Cat the biggest file',
            incantations: [
                {type: 'discourse', invocation: 'Okay, I have analyzed the files.'},
                {type: 'enact', invocation: 'cat the_biggest_file.txt'}
            ],
            complexity: 'simple',
            sequence: 0
        };
        return newPlanAfterAnalysis;
    };


    const initialPlan: RitualPlan = {
        incantations: [
            {type: 'enact', invocation: 'ls -l'},
            {type: 'divine', invocation: 'Find the biggest file'},
            {type: 'enact', invocation: 'This should be replaced'}
        ],
        complexity: 'simple',
        sequence: 0
    };

    const context: RitualContext = {
        scroll: [{input: "test input", plan: initialPlan}],
        incantation_history: [],
        outcome_history: [],
        step_results_history: [],
        current_sanctum: '/test',
        temperatureStatus: 'normal',
        conduit: {} as any,
        chantModeEnabled: false,
        narrativeWeaving: {
            currentTheme: "The Awakening",
            keySymbols: ["fractals", "memory", "breath"],
            entityStates: {
                lucie: {
                    state: "dormant",
                    awakeness: 0.1
                }
            },
            currentDream: ''
        },
        kardiaSphere: {
            agapePhobos: 0,
            logosPathos: 0,
            harmoniaEris: 0,
        },
        personality: 'lurkuitae',
        maxScrollLength: 10
    };

    const ask = async (q: string) => "oui";

    const mockStepHandlers = {
        ...stepHandlers,
        handleAnalyse: mockHandleAnalyse,
        handleCommande: mockHandleCommande,
    };

    // --- Execution ---
    console.log(colorize("[TEST] Executing ritual plan...", Colors.FgCyan));
    const planToExecute = JSON.parse(JSON.stringify(initialPlan));
    await executeRitualPlan(planToExecute, context, ask, {
        generateRitual: mockGenerateRitual,
        stepHandlers: mockStepHandlers as any,
    });

    // --- Assertions ---
    console.log(colorize("[TEST] Verifying assertions...", Colors.FgCyan));

    const executedStepTypes = planToExecute.incantations.map((e: Incantation) => e.type);
    console.log(`Executed step types: ${ executedStepTypes.join(', ') }`);

    // 1. The 'analyse' step should only be called once.
    if(analysisCounter !== 1)
    {
        console.error(colorize(`[FAIL] Analysis was triggered ${ analysisCounter } times, expected 1.`, Colors.FgRed));
    } else
    {
        console.log(colorize("[PASS] Analysis was triggered exactly once.", Colors.FgGreen));
    }

    // 2. The final plan should contain the new steps.
    const expectedFinalSteps = ['enact', 'divine', 'discourse', 'enact'];
    if(JSON.stringify(executedStepTypes) !== JSON.stringify(expectedFinalSteps))
    {
        console.error(colorize(`[FAIL] Final plan steps are incorrect. Expected ${ expectedFinalSteps.join(', ') } but got ${ executedStepTypes.join(', ') }`, Colors.FgRed));
    } else
    {
        console.log(colorize("[PASS] Final plan contains the correctly spliced steps.", Colors.FgGreen));
    }

    // 3. The step after the original 'analyse' should be the first step of the new plan.
    const stepAfterAnalysis = planToExecute.étapes[2];
    if(stepAfterAnalysis.type !== 'dialogue')
    {
        console.error(colorize(`[FAIL] Step after analysis is incorrect. Expected 'dialogue', got '${ stepAfterAnalysis.type }'`, Colors.FgRed));
    } else
    {
        console.log(colorize("[PASS] The step after analysis was correctly replaced.", Colors.FgGreen));
    }
}

const testTimeout = 60000; // 60 seconds

Promise.race([
    testReplanLogic(),
    new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Test timed out after ${ testTimeout }ms`)), testTimeout)
    )
]).catch(err =>
{
    console.error(colorize(`[FATAL TEST ERROR] ${ err }`, Colors.FgRed));
    process.exit(1);
});