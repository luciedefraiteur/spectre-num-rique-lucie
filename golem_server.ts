import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { getInitialContext, executeRitualPlan, generateRitual } from './core/ritual_utils.js';
import { RitualContext, RitualPlan, Incantation } from './core/types.js';
import fetch from 'node-fetch';

const app = express();
const port = process.env.GOLEM_PORT || 3031;
const clientPort = process.env.GOLEM_CLIENT_PORT || 3032;

app.use(cors());
app.use(bodyParser.json());

const context: RitualContext = getInitialContext();

const pendingClientRequests = new Map<string, (value: string) => void>();

app.post('/golem/rituel', async (req: Request, res: Response) => {
  const input: string = req.body.input;
  if (!input) {
    return res.status(400).json({ error: 'Input missing' });
  }

  try {
    const plan = await generateRitual(input, context);
    if (!plan) return res.status(500).json({ error: 'Planning error' });
    res.json({ plan });
  } catch (err) {
    res.status(500).json({ error: 'Internal error', details: err });
  }
});

app.post('/golem/execute', async (req: Request, res: Response) => {
  const plan: RitualPlan = req.body.plan;

  const serverAsk = async (q: string): Promise<string> => {
    const requestId = Date.now().toString();
    const incantation: Incantation = { type: 'terminal_question', invocation: q };

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
    const resultats = await executeRitualPlan(plan, context, serverAsk);
    res.json({ resultats });
  } catch (err) {
    res.status(500).json({ error: 'Execution error', details: err });
  }
});

app.post('/golem/client_response', (req: Request, res: Response) => {
  const { requestId, response } = req.body;
  const resolver = pendingClientRequests.get(requestId);
  if (resolver) {
    resolver(response);
    pendingClientRequests.delete(requestId);
    res.status(200).send('OK');
  } else {
    res.status(404).send('Request ID not found or already processed.');
  }
});

app.listen(port, () => {
  console.log(`[Golem Server] ✨ Listening on http://localhost:${port}`);
});