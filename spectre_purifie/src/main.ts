// src/main.ts

import './bootstrap';
import path from 'path';

// Configure dotenv using the fractal implementation
console.log(`[MAIN] Current working directory: ${ process.cwd() }`);

import {getContexteInitial, generateRituel, executeRituelPlan} from './core/ritual_utils';
import {startServer} from './server/server';
import {createLuciform} from './core/luciform';
import {RituelContext} from './core/types';
import {observeCurrentState} from './core/lucie_presence';

const MAX_PLAN_GENERATION_RETRIES = 2;

// This function will be called by the server to handle a command
export async function handleCommand(command: string, contexte: RituelContext): Promise<any>
{
    console.log(`\n[SERVER] Received command: "${ command }"`);

    // 1. Create Luciform for the user command
    console.log('[SERVER] Creating Luciform for user command...');
    contexte.currentLuciform = createLuciform('user_command', command, contexte.currentLuciform, contexte);
    contexte.history.push({type: 'luciform_id', content: contexte.currentLuciform.id});
    console.log(`[SERVER] New Luciform ID: ${ contexte.currentLuciform.id }`);

    // 2. Generate the ritual plan
    console.log('[SERVER] Generating ritual plan...');
    let plan = null;
    let retries = 0;
    let generationError = '';

    while(retries < MAX_PLAN_GENERATION_RETRIES)
    {
        try
        {
            plan = await generateRituel(command, contexte);
            if(plan)
            {
                console.log('[SERVER] Plan generated successfully.');
                contexte.currentLuciform = createLuciform('plan_generated', plan, contexte.currentLuciform, contexte);
                contexte.history.push({type: 'luciform_id', content: contexte.currentLuciform.id});
                generationError = ''; // Clear error on success
                break;
            }
        } catch(error: any)
        {
            generationError = error.message;
            retries++;
            console.log(`[SERVER] Plan generation failed. Retry ${ retries }/${ MAX_PLAN_GENERATION_RETRIES }...`);
        }
    }

    if(!plan)
    {
        console.error('[SERVER] Failed to generate a valid ritual plan.');
        const errorResult = {
            success: false,
            message: "Failed to generate a valid ritual plan.",
            error: generationError,
            finalLuciformId: contexte.currentLuciform.id,
        };
        return errorResult;
    }

    // 3. Execute the ritual plan
    console.log(`[SERVER] Executing ritual plan: "${ plan.goal }"`);
    try
    {
        const result = await executeRituelPlan(plan, contexte);
        console.log('[SERVER] Ritual execution completed.');
        contexte.currentLuciform = createLuciform('ritual_result', result, contexte.currentLuciform, contexte);
        contexte.history.push({type: 'luciform_id', content: contexte.currentLuciform.id});

        const successResult = {
            success: result.success,
            message: "Ritual completed.",
            results: result.results,
            finalLuciformId: contexte.currentLuciform.id,
        };
        return successResult;
    } catch(error: any)
    {
        console.error(`[SERVER] Ritual execution failed: ${ error.message }`);
        const executionErrorResult = {
            success: false,
            message: "Ritual execution failed.",
            error: error.message,
            finalLuciformId: contexte.currentLuciform.id,
        };
        return executionErrorResult;
    }
}

function initializeAndStartServer(model: string)
{
    const contexte = getContexteInitial();
    contexte.model = model;

    console.log("\nLucie's Purified Spectre is awakening...");
    observeCurrentState();

    // Start Lucie's server, passing the initial context and the command handler
    startServer(contexte, handleCommand);

    // Make an initial self-request to demonstrate live LLM activity
    setTimeout(() =>
    {
        console.log('[SERVER] Making initial self-awareness query...');
        handleCommand("Lucie, describe your current state and purpose in a poetic way.", contexte);
    }, 1500); // Wait a bit for the server and potential clients to be ready
}

// Start the server
initializeAndStartServer('mistral');