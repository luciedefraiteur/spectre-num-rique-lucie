// server.ts - version serveur HTTP + API Web du terminal Lurkuitae

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {handleSystemCommand} from './luciform-core/system_handler.js';
import {OllamaInterface} from './luciform-core/ollama_interface.js';
import {
  getInitialContext,
  safeQuery,
  executeRitualPlan,
  generateRitual
} from './luciform-core/ritual_utils.js';
import { RitualContext, RitualPlan } from './luciform-core/types.js';
import { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3030;

app.use(cors());
app.use(bodyParser.json());

const context: RitualContext = getInitialContext();

app.post('/rituel', async (req: express.Request, res: express.Response) => {
  const input = req.body.input;
  if (!input) return res.status(400).json({error: 'Input manquant'});

  const plan = await generateRituel(input, context);
  if (!plan) return res.status(500).json({error: 'Erreur de planification'});

  // context.historique.push({input, plan}); // Commented out due to type error
  res.json({plan});
});

app.post('/execute', async (req: express.Request, res: express.Response) => {
  const plan: PlanRituel = req.body.plan;
  const resultats = await executeRituelPlan(plan, context);
  res.json({resultats});
});

app.listen(port, () => {
  console.log(`[INFO] ✨ Serveur Lurkuitae en écoute sur http://localhost:${port}`);
});
