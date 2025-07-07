import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { spawn } from 'child_process';
type ChildProcessWithoutNullStreams = any;
import fetch from 'node-fetch';
import { RitualContext, RitualPlan, Incantation } from '../luciform-core/dist/types.js';

const app = new Hono();
const port = parseInt(process.env.GOLEM_PORT || '3031');
const clientPort = parseInt(process.env.GOLEM_CLIENT_PORT || '3032');

// Map to store pending client requests and their resolvers
const pendingClientRequests = new Map<string, (value: string) => void>();

// Map to store pending luciform-core requests and their resolvers
const pendingLuciformCoreRequests = new Map<string, (value: string) => void>();

// Spawn the luciform-core process
const luciformCoreProcess: ChildProcessWithoutNullStreams = spawn('node', ['../luciform-core/dist/execute_luciform.js'], { stdio: ['pipe', 'pipe', 'inherit'] });

luciformCoreProcess.stdout.on('data', (data: Buffer) => {
  const message = data.toString().trim();
  // Assuming luciform-core sends back JSON responses with a requestId
  try {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.requestId && pendingLuciformCoreRequests.has(parsedMessage.requestId)) {
      pendingLuciformCoreRequests.get(parsedMessage.requestId)!(parsedMessage.response);
      pendingLuciformCoreRequests.delete(parsedMessage.requestId);
    } else {
      console.log(`[Luciform Core STDOUT]: ${message}`);
    }
  } catch (e) {
    console.log(`[Luciform Core STDOUT]: ${message}`);
  }
});

if (luciformCoreProcess.stderr) {
  luciformCoreProcess.stderr.on('data', (data: Buffer) => {
    console.error(`[Luciform Core STDERR]: ${data.toString().trim()}`);
  });
}

luciformCoreProcess.on('close', (code: any) => {
  console.log(`[Luciform Core] Process exited with code ${code}`);
});

app.post('/golem/rituel', async (c) => {
  const { input } = await c.req.json();
  if (!input) {
    return c.json({ error: 'Input missing' }, 400);
  }

  try {
    const requestId = Date.now().toString();
    const command = JSON.stringify({ type: 'generate_ritual', input, requestId });
    luciformCoreProcess.stdin.write(command + '\n');

    const planResponse = await new Promise<string>((resolve) => {
      pendingLuciformCoreRequests.set(requestId, resolve);
    });

    const parsedPlan = JSON.parse(planResponse);
    return c.json({ plan: parsedPlan });
  } catch (err: any) {
    return c.json({ error: 'Internal error', details: err.message || err }, 500);
  }
});

app.post('/golem/execute', async (c) => {
  const { plan } = await c.req.json() as { plan: RitualPlan };

  const serverAsk = async (q: string): Promise<string> => {
    const requestId = Date.now().toString();
    const incantation: any = { type: 'terminal_question', invocation: q };

    const response = await fetch(`http://localhost:${clientPort}/golem/client_action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ incantation, requestId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send question to client: ${response.statusText}`);
    }

    return new Promise<string>((resolve) => {
      pendingClientRequests.set(requestId, resolve);
    });
  };

  try {
    const requestId = Date.now().toString();
    const command = JSON.stringify({ type: 'execute_ritual_plan', plan, context: {} as any, ask: {} as any, requestId }); // Context and ask will be mocked/handled by luciform-core
    luciformCoreProcess.stdin.write(command + '\n');

    const resultsResponse = await new Promise<string>((resolve) => {
      pendingLuciformCoreRequests.set(requestId, resolve);
    });

    const parsedResults = JSON.parse(resultsResponse);
    return c.json({ resultats: parsedResults });
  } catch (err: any) {
    return c.json({ error: 'Execution error', details: err.message || err }, 500);
  }
});

app.post('/golem/client_response', async (c) => {
  const { requestId, response } = await c.req.json();
  const resolver = pendingClientRequests.get(requestId);
  if (resolver) {
    resolver(response);
    pendingClientRequests.delete(requestId);
    return c.text('OK', 200);
  } else {
    return c.text('Request ID not found or already processed.', 404);
  }
});

console.log(`[Golem Server] ✨ Listening on http://localhost:${port}`);

serve({ fetch: app.fetch, port });