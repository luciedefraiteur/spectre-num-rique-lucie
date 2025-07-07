import fetch from 'node-fetch';
import * as readline from 'readline';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Incantation } from 'luciform-core/types.js';
import { handleSystemCommand } from 'luciform-core/system_handler.js';

const GOLEM_SERVER_URL = 'http://localhost:' + (process.env.GOLEM_PORT || 3031);
const GOLEM_CLIENT_PORT = process.env.GOLEM_CLIENT_PORT || 3032;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (query: string): Promise<string> => new Promise(resolve => rl.question(query, resolve));

// Express app for client to receive actions from server
const app = express();
app.use(bodyParser.json());

app.post('/golem/client_action', (async (req: Request, res: Response) => {
  const { incantation, requestId } = req.body as { incantation: Incantation, requestId: string };
  let outcome: any;
  let success = true;

  try {
    switch (incantation.type) {
      case 'terminal_output':
        process.stdout.write(incantation.invocation + '\n');
        outcome = `[OK] Printed to terminal: ${incantation.invocation}`;
        break;
      case 'terminal_command':
        // This is a simplified execution. In a real scenario, you'd need the full context
        // and potentially a way to send back stdout/stderr incrementally.
        const commandResult = await handleSystemCommand(incantation.invocation, process.cwd(), {} as any); // Mock context
        outcome = commandResult.stdout;
        success = commandResult.success;
        process.stdout.write(`[TERMINAL COMMAND RESULT] ${outcome}\n`);
        break;
      case 'terminal_question':
        process.stdout.write(`[TERMINAL QUESTION] ${incantation.invocation}\n`);
        outcome = await ask('↳ Your response: ');
        break;
      default:
        success = false;
        outcome = `[ERROR] Unknown incantation type for client action: ${incantation.type}`;
        console.error(outcome);
    }
  } catch (error: any) {
    success = false;
    outcome = `[ERROR] Client action failed: ${error.message}`;
    console.error(outcome);
  }

  // Send response back to server for terminal_command and terminal_question
  if (incantation.type === 'terminal_command' || incantation.type === 'terminal_question') {
    await fetch(`${GOLEM_SERVER_URL}/golem/client_response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, response: outcome, success })
    });
  }

  res.status(200).send('OK');
}) as any);

app.listen(GOLEM_CLIENT_PORT, () => {
  console.log(`[Golem Client] Client listener active on http://localhost:${GOLEM_CLIENT_PORT}`);
});

async function main(commands: string[] = []) {
  console.log("\n[Golem Client] Connected to Golem Server.");

  if (commands.length > 0) {
    for (const input of commands) {
      console.log(`[Golem Client] Processing command: ${input}`);
      await processCommand(input);
    }
  } else {
    while (true) {
      const input = await ask("[Golem Client] Enter your command (or 'exit'): ");
      if (input.toLowerCase() === 'exit') {
        break;
      }
      await processCommand(input);
    }
  }
  rl.close();
}

async function processCommand(input: string) {
  try {
    // Request a ritual plan
    const planResponse = await fetch(`${GOLEM_SERVER_URL}/golem/rituel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input })
    });
    const planData = planResponse.json() as { error?: string; plan?: any };

    if (planData.error) {
      console.error("[Golem Client] Error planning ritual:", planData.error);
      return;
    }

    console.log("[Golem Client] Received plan:", JSON.stringify(planData.plan, null, 2));

    // Execute the ritual plan
    const executeResponse = await fetch(`${GOLEM_SERVER_URL}/golem/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planData.plan })
    });
    const executeData = executeResponse.json() as { error?: string; resultats?: any };

    if (executeData.error) {
      console.error("[Golem Client] Error executing ritual:", executeData.error);
    } else {
      console.log("[Golem Client] Ritual execution results:", JSON.stringify(executeData.resultats, null, 2));
    }

  } catch (error) {
    console.error("[Golem Client] Communication error with Golem Server:", error);
  }
}

main(process.argv.slice(2)).catch(console.error);