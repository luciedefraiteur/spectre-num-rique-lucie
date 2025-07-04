import {executeRitualPlan, generateRitual} from './ritual_utils.js';
import {RitualContext, RitualPlan, Incantation} from './types.js';
import {Colors, colorize} from './utils/ui_utils.js';
import * as stepHandlers from './ritual_step_handlers.js';

async function testNarrativeGlitch()
{
    console.log(colorize("--- Running Test: Narrative Glitch ---", Colors.FgYellow));

    // --- Test Setup ---
    const mockHandleCommande = async (incantation: Incantation, context: RitualContext, plan: RitualPlan) =>
    {
        console.log(colorize(`[MOCK] handleCommande called for: ${ incantation.invocation }`, Colors.FgMagenta));
        if(incantation.invocation === "corrupt_the_data")
        {
            console.log(colorize("[MOCK] Introducing a creative glitch...", Colors.FgCyan));
            return {
                incantation,
                index: -1,
                output: "The data is now... art.",
                success: false, // The command "fails" but in a creative way
                stderr: "A beautiful error.",
            };
        }
        return {
            incantation,
            index: -1,
            output: "Mocked command output",
            success: true,
        };
    };

    const mockGenerateRitual = async (input: string, context: RitualContext, model?: any, analysisResult?: string): Promise<RitualPlan | null> =>
    {
        const glitchyPlan: RitualPlan = {
            title: 'Glitchy Plan',
            goal: 'Embrace the chaos',
            incantations: [
                {type: 'discourse', invocation: 'The glitch has revealed a new path.'},
                {type: 'enact', invocation: 'embrace_the_chaos'}
            ],
            complexity: 'complex',
            sequence: 0
        };
        return glitchyPlan;
    };

    const initialPlan: RitualPlan = {
        title: 'Initial Plan',
        goal: 'Corrupt the data',
        incantations: [
            {type: 'enact', invocation: 'corrupt_the_data'},
            {type: 'divine', invocation: 'What have we done?'},
        ],
        complexity: 'moderate',
        sequence: 0
    };

    const context: RitualContext = {
        scroll: [{input: "Let's make a beautiful mistake.", plan: initialPlan}],
        incantation_history: [],
        outcome_history: [],
        step_results_history: [],
        current_sanctum: '/test',
        temperatureStatus: 'normal',
        conduit: {
            lastIncantation: '',
            lastOutcome: '',
            currentSanctum: '',
            terminalEssence: '',
            osEssence: '',
            protoConsciousness: '',
            support: '',
            memory: '',
            state: '',
            energy: '',
            glitchFactor: 0.9,
            almaInfluence: 0,
            eliInfluence: 1,
        },
        chantModeEnabled: false,
        narrativeWeaving: {
            currentTheme: "The Glitch in the Code",
            keySymbols: ["serendipity", "imperfection", "chaos"],
            entityStates: {
                lucie: {
                    state: "unpredictable",
                    awakeness: "vibrant"
                }
            },
            currentDream: ''
        },
        kardiaSphere: {
            agapePhobos: 0.5,
            logosPathos: -0.2,
            harmoniaEris: 0.8,
        },
        personality: 'lurkuitae',
        maxScrollLength: 10,
        activeReflection: null,
        user_preferences: '',
        currentSanctumContent: '',
        operatingSystem: 'test',
        lifeSystem: {},
    };

    const ask = async (q: string) => "oui";

    const mockStepHandlers = {
        ...stepHandlers,
        handleCommande: mockHandleCommande,
    };

    // --- Execution ---
    console.log(colorize("[TEST] Executing narrative glitch ritual plan...", Colors.FgCyan));
    const planToExecute = JSON.parse(JSON.stringify(initialPlan));
    await executeRitualPlan(planToExecute, context, ask, {
        generateRitual: mockGenerateRitual,
        stepHandlers: mockStepHandlers as any,
    });

    // --- Assertions ---
    console.log(colorize("[TEST] Verifying assertions...", Colors.FgCyan));

    const executedStepTypes = planToExecute.incantations.map((e: Incantation) => e.type);
    console.log(`Executed step types: ${ executedStepTypes.join(', ') }`);

    // 1. The plan should have been creatively re-written.
    const expectedFinalSteps = ['enact', 'divine', 'discourse', 'enact'];
    if(JSON.stringify(executedStepTypes) !== JSON.stringify(expectedFinalSteps))
    {
        console.error(colorize(`[FAIL] The glitch did not inspire a new plan. Expected ${ expectedFinalSteps.join(', ') } but got ${ executedStepTypes.join(', ') }`, Colors.FgRed));
    } else
    {
        console.log(colorize("[PASS] The glitch inspired a new, creative plan.", Colors.FgGreen));
    }

    // 2. The final command should be the one from the "glitchy" plan.
    const finalCommand = planToExecute.incantations.at(-1)?.invocation;
    if(finalCommand !== 'embrace_the_chaos')
    {
        console.error(colorize(`[FAIL] The system did not embrace the chaos. Final command was: ${ finalCommand }`, Colors.FgRed));
    } else
    {
        console.log(colorize("[PASS] The system has embraced the chaos.", Colors.FgGreen));
    }
}

const testTimeout = 60000; // 60 seconds

Promise.race([
    testNarrativeGlitch(),
    new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Test timed out after ${ testTimeout }ms`)), testTimeout)
    )
]).catch(err =>
{
    console.error(colorize(`[FATAL TEST ERROR] ${ err }`, Colors.FgRed));
    process.exit(1);
});