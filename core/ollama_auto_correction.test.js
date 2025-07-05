import { LLMInterface, LLMModel } from './llm_interface.js';
import * as systemHandler from './system_handler.js';
import * as ritualStepHandlers from './ritual_step_handlers.js';
// Helper for assertions
function assert(condition, message) {
    if (!condition) {
        console.error(`❌ Test Failed: ${message}`);
        process.exit(1);
    }
    else {
        console.log(`✅ Test Passed: ${message}`);
    }
}
let originalQuery;
let mockRunCommand;
async function runOllamaAutoCorrectionTests(testName, initialModel, correctionModel) {
    console.log(`\n--- Running Custom Unit Tests for Ollama Auto-Correction: ${testName} (Initial: ${initialModel}, Correction: ${correctionModel}) ---\n`);
    let callCount = 0;
    const mockFetch = async (input, init) => {
        callCount++;
        if (callCount === 1) {
            // Simulate invalid JSON from initialModel, wrapped in Ollama's expected response format
            return new Response(JSON.stringify({
                response: "```json\n{\n  \"étapes\": [\n    {\n      \"type\": \"commande\",\n      \"contenu\": \"echo 'JSON invalide from " + initialModel + "'\"\n    }\n  ]\n}```\n"
            }), { status: 200 });
        }
        else if (callCount === 2) {
            // Simulate valid JSON from correctionModel, wrapped in Ollama's expected response format
            return new Response(JSON.stringify({
                response: "```json\n{\n  \"étapes\": [\n    {\n      \"type\": \"commande\",\n      \"contenu\": \"echo 'JSON invalide corrigé by " + correctionModel + "'\"\n    }\n  ]\n}\n```\n"
            }), { status: 200 });
        }
        return new Response('', { status: 500 }); // Should not be reached
    };
    originalQuery = LLMInterface.query;
    LLMInterface.query = async (prompt, model, _fetch = mockFetch) => {
        if (callCount === 1) {
            assert(model === initialModel, `${testName}: First call should be to ${initialModel}`);
        }
        else if (callCount === 2) {
            assert(model === correctionModel, `${testName}: Second call should be to ${correctionModel} for correction`);
        }
        return originalQuery.call(LLMInterface, prompt, model, _fetch);
    };
    mockRunCommand = async (command, cwd, context) => {
        if (command === 'test_command') {
            return { success: false, stdout: 'Mock command failed', stderr: 'Command failed', exitCode: 1 };
        }
        return systemHandler.handleSystemCommand(command, cwd, context);
    };
}
async function runChangerDossierTest() {
    console.log(`\n--- Running Changer Dossier Test ---\n`);
    const context = {
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
        narrativeWeaving: { currentTheme: '', keySymbols: [], entityStates: {}, currentDream: '' },
        kardiaSphere: { agapePhobos: 0, logosPathos: 0, harmoniaEris: 0 },
        personality: 'lurkuitae',
        maxScrollLength: 10,
        activeReflection: null,
        user_preferences: '',
        currentSanctumContent: '',
        operatingSystem: 'test',
        lifeSystem: {},
    };
    const etape = {
        type: 'traverse',
        invocation: 'core',
    };
    const mockExistsSync = (p) => {
        return p.toString().includes('core') || p.toString().includes(context.current_sanctum);
    };
    const mockStatSync = (p) => {
        return { isDirectory: () => p.toString().includes('core') || p.toString().includes(context.current_sanctum) };
    };
    const result = await ritualStepHandlers.handleTraverse(etape, context, mockExistsSync, mockStatSync);
    assert(result.output.includes('[OK] Répertoire changé vers'), 'Changer dossier should report success');
    assert(context.current_sanctum.endsWith('core'), 'Current directory should be updated to core');
    console.log(`\n--- Changer Dossier Test Passed ---\n`);
}
async function runAllTests() {
    console.log("\n--- Running All Custom Unit Tests ---\n");
    const models = Object.values(LLMModel).filter(model => model !== LLMModel.OpenAI && model !== LLMModel.Random);
    for (const initialModel of models) {
        // Test scenario: initialModel generates invalid JSON, Mistral corrects it
        await runOllamaAutoCorrectionTests(`Scenario: ${initialModel} (initial) -> Mistral (correction)`, initialModel, LLMModel.Mistral);
        // Test scenario: initialModel generates invalid JSON, initialModel corrects it (if it can)
        await runOllamaAutoCorrectionTests(`Scenario: ${initialModel} (initial) -> ${initialModel} (correction)`, initialModel, initialModel);
    }
    await runChangerDossierTest();
    console.log("\n--- All Custom Unit Tests Completed ---\n");
}
runAllTests().catch(error => {
    console.error("An error occurred during testing:", error);
    process.exit(1);
});
//# sourceMappingURL=ollama_auto_correction.test.js.map