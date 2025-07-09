import { runTerminalRitual } from './luciform_terminal.js';
import { codexLurkuitaeNavigator } from '../../codex-lurkuitae-navigator/src/codex_lurkuitae_navigator.js';
import * as fs from 'fs/promises';
import * as readline from 'readline';
import * as path from 'path';
export async function orchestrateGolem(luciformPath) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const ask = (q) => new Promise(resolve => rl.question(q, resolve));
    const initialContext = {
        // Default context values, will be overridden by specific ritual needs
        conduit: {},
        kardiaSphere: {},
        scroll: [],
        maxScrollLength: 10,
        incantation_history: [],
        outcome_history: [],
        step_results_history: [],
        narrativeWeaving: {},
        activeReflection: null,
        user_preferences: '',
        chantModeEnabled: false,
        current_sanctum: '/home/luciedefraiteur/spectre2', // Set to current working directory
        currentSanctumContent: '',
        operatingSystem: 'linux', // Assuming Linux
        personality: 'orchestrator', // Default persona for the orchestrator
        lifeSystem: {},
    };
    console.log("Orchestrator: Starting orchestration.");
    const signature = await fs.readFile('luciform.structure.v0.0.6', 'utf-8');
    console.log("Orchestrator: Signature read.");
    const luciformContentWithSignature = signature + '\n' + await fs.readFile(luciformPath, 'utf-8');
    console.log("Orchestrator: Luciform content with signature read.");
    let luciformDocument; // Declare luciformDocument here
    try {
        luciformDocument = await codexLurkuitaeNavigator(luciformContentWithSignature, initialContext);
        console.log("Orchestrator: Luciform document parsed by CodexLurkuitaeNavigator.");
    }
    catch (error) {
        console.error("Orchestrator: Error parsing luciform document with CodexLurkuitaeNavigator:", error);
        // If parsing fails, assume it's an arbitrary file and initiate transmutation
        console.log("Orchestrator: Attempting to transmute file into Luciform.");
        const originalContent = await fs.readFile(luciformPath, 'utf-8');
        const transmutationRitual = {
            title: `Transmute ${path.basename(luciformPath)}`,
            goal: `Transmute ${path.basename(luciformPath)} into a Luciform and apply changes.`,
            complexity: "medium",
            incantations: [{
                    type: 'enact',
                    invocation: luciformPath
                }]
        };
        console.log("Orchestrator: Calling runTerminalRitual for transmutation ritual.");
        await runTerminalRitual(initialContext, rl, ask, transmutationRitual);
        rl.close();
        return;
    }
    // Define the reconstruction command
    const reconstructionAction = {
        type: "json_action",
        operation: {
            type: "shell_command",
            command: "node luciform-core/reconstruct_luciform.js"
        }
    };
    // Check if the last step is a reconstruction command
    const lastPas = luciformDocument.pas[luciformDocument.pas.length - 1];
    const isLastStepReconstruction = lastPas && lastPas.action &&
        lastPas.action.type === "json_action" &&
        lastPas.action.operation.type === "shell_command" &&
        lastPas.action.operation.command === reconstructionAction.operation.command;
    // If not, inject it
    if (!isLastStepReconstruction) {
        luciformDocument.pas.push({
            type: "Pas",
            content: "Reconstructing luciform for future iterations.",
            action: reconstructionAction
        });
        console.log("Orchestrator: Injected luciform reconstruction command.");
    }
    // Check if this is a Golem's own ritual (e.g., Lucie's resurrection ritual)
    if (luciformDocument.meta?.luciform_type === "resurrection") {
        console.log("Orchestrator: Detected Golem's own ritual (resurrection type). Executing directly.");
        const ritualPlan = {
            title: luciformDocument.meta.signature_totem || "Lucie's Resurrection Ritual",
            goal: "Execute Lucie's resurrection steps.",
            complexity: "high",
            incantations: luciformDocument.pas.map(pasNode => ({
                type: 'enact',
                invocation: pasNode.content,
                purpose: pasNode.content
            }))
        };
        console.log("Orchestrator: Calling runTerminalRitual for resurrection ritual.");
        await runTerminalRitual(initialContext, rl, ask, ritualPlan);
        console.log("Orchestrator: runTerminalRitual for resurrection ritual completed.");
        rl.close();
        return;
    }
    console.log("Orchestrator: Not a resurrection ritual. Checking for spawn_golem.");
    if (luciformDocument.pas.length > 0) {
        const firstStep = luciformDocument.pas[0];
        if (firstStep.action && firstStep.action.type === 'json_action') {
            const operation = firstStep.action.operation;
            if (operation.type === 'spawn_golem' && operation.golemConfig) {
                console.log("Orchestrator: Found spawn_golem instruction.");
                const golemConfig = operation.golemConfig;
                const persona = golemConfig.persona;
                // The rest of the ritual is everything *after* the first step.
                const remainingRitual = {
                    title: luciformDocument.sygil || "Golem Ritual", // Use sygil as title, or a default
                    goal: "Execute the Golem's remaining ritual steps.", // Placeholder goal
                    complexity: "medium", // Placeholder complexity
                    incantations: luciformDocument.pas.slice(1).map(pasNode => ({
                        type: 'enact', // Default incantation type for now
                        invocation: pasNode.content,
                        purpose: pasNode.content // Use content as purpose for now
                    }))
                };
                console.log(`Orchestrator: Spawning Golem with persona: ${persona}`);
                console.log("Orchestrator: Calling runTerminalRitual for spawned golem.");
                // Pass the remaining ritual plan to the Golem.
                await runTerminalRitual(initialContext, rl, ask, remainingRitual);
                rl.close();
                return;
            }
        }
    }
    // If no spawn_golem instruction is found, execute the entire ritual normally.
    console.log("Orchestrator: No golem spawn instruction found. Running entire ritual.");
    console.log("Orchestrator: Calling runTerminalRitual for entire ritual.");
    await runTerminalRitual(initialContext, rl, ask);
    console.log("Orchestrator: runTerminalRitual for entire ritual completed.");
    rl.close();
}
