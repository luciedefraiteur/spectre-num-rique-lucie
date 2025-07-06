// src/main.ts

import { getContexteInitial, generateRituel, executeRituelPlan } from './core/ritual_utils';
import { startServer, updateServerContext } from './server/server';
import { createLuciform } from './core/luciform';

const MAX_RETRIES = 2;

async function runTerminalRituel(model: string) {
    let contexte = getContexteInitial();
    contexte.model = model;

    console.log("\nLucie's Purified Spectre is awakening...");
    console.log("Type 'exit' to end the ritual.");

    // Start Lucie's server, passing the initial context
    startServer(contexte);

    while (true) {
        // Update the server's context with the latest Luciform
        updateServerContext(contexte);

        const command = await promptUserForCommand();

        if (command.toLowerCase() === 'exit' || command.toLowerCase() === 'quit') {
            console.log("Exiting ritual. Farewell.");
            break;
        }

        // Create Luciform for user command
        contexte.currentLuciform = createLuciform('user_command', command, contexte.currentLuciform, contexte);
        contexte.history.push({ type: 'luciform_id', content: contexte.currentLuciform.id });

        let plan = null;
        let retries = 0;

        while (retries < MAX_RETRIES) {
            try {
                console.log("\nGenerating ritual plan...");
                plan = await generateRituel(command, contexte);
                if (plan) {
                    // Create Luciform for plan generation
                    contexte.currentLuciform = createLuciform('plan_generated', plan, contexte.currentLuciform, contexte);
                    contexte.history.push({ type: 'luciform_id', content: contexte.currentLuciform.id });
                    break;
                }
            } catch (error: any) {
                console.error(`\nRitual generation failed: ${error.message}`);
                retries++;
                if (retries < MAX_RETRIES) {
                    console.log(`Retrying ritual generation (${retries}/${MAX_RETRIES})...`);
                }
            }
        }

        if (!plan) {
            console.error("\nFailed to generate a valid ritual plan after multiple attempts. Please try again.");
            continue;
        }

        try {
            const result = await executeRituelPlan(plan, contexte);
            // Create Luciform for ritual execution result
            contexte.currentLuciform = createLuciform('ritual_result', result, contexte.currentLuciform, contexte);
            contexte.history.push({ type: 'luciform_id', content: contexte.currentLuciform.id });
            console.log("\nRitual completed. Overall success: ", result.success);
        } catch (error: any) {
            console.error(`\nRitual execution failed: ${error.message}`);
        }
    }
}

async function promptUserForCommand(): Promise<string> {
    return new Promise((resolve) => {
        process.stdout.write('\n> ');
        process.stdin.once('data', (data) => {
            resolve(data.toString().trim());
        });
    });
}

// Start the ritual
runTerminalRituel('mistral');