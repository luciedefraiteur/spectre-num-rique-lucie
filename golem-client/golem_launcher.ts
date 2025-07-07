import * as Ritual from './run_terminal_rituel.js';
import { RitualContext, Persona } from './types.js';
import { getPersonaResponse } from './personas.js';
import * as LLM from './llm_interface.js';
import * as readline from 'readline';
import { spawn } from 'child_process';
import * as net from 'net';
import * as fs from 'fs';
import * as path from 'path';

async function isPortTaken(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const tester = net.createServer()
      .once('error', (err: any) => { err.code === 'EADDRINUSE' ? resolve(true) : resolve(false); })
      .once('listening', () => {
        tester.once('close', () => { resolve(false); }).close();
      })
      .listen(port);
  });
}

async function waitForPort(port: number, timeout: number = 30000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await isPortTaken(port)) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  return false;
}

export async function launchGolem(persona: Persona, testInputs?: string[], model: LLM.LLMModel = LLM.LLMModel.Mistral, isInteractive: boolean = false, clientCommands: string[] = []) {
  if (isInteractive) {
    const golemPort = 3031;
    process.env.GOLEM_PORT = golemPort.toString();

    // Start Golem Server
    console.log(`[Golem Launcher] Starting Golem Server on port ${golemPort}...`);
    const serverProcess = spawn('node', ['dist/golem_server.js'], { stdio: 'inherit' });

    serverProcess.on('error', (err) => {
      console.error(`[Golem Server] Failed to start: ${err.message}`);
    });

    // Wait for server to be ready
    const serverReady = await waitForPort(golemPort);
    if (!serverReady) {
      console.error('[Golem Launcher] Golem Server did not start in time.');
      serverProcess.kill();
      return;
    }
    console.log('[Golem Launcher] Golem Server is ready.');

    // Start Golem Client
    console.log('[Golem Launcher] Starting Golem Client...');
    const clientProcess = spawn('node', ['dist/golem_client.js', ...clientCommands], { stdio: 'inherit' });

    clientProcess.on('close', (code) => {
      console.log(`[Golem Client] Exited with code ${code}`);
      serverProcess.kill(); // Kill server when client exits
    });

    clientProcess.on('error', (err) => {
      console.error(`[Golem Client] Failed to start: ${err.message}`);
      serverProcess.kill();
    });

    // Keep the launcher process alive until client or server exits
    return new Promise<void>((resolve) => {
      serverProcess.on('close', resolve);
      clientProcess.on('close', resolve);
    });

  } else {
    // Original test execution path
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const ask = (q: string): Promise<string> => new Promise(resolve => {
      rl.question(q, resolve);
    });

    const context: RitualContext = {
      personality: persona,
      kardiaSphere: {
          harmoniaEris: 0,
          agapePhobos: 0,
          logosPathos: 0
      },
      scroll: [],
      maxScrollLength: 10,
      narrativeWeaving: {
          activeNodes: [],
          narrativeArcs: [],
          thematicThreads: []
      },
      lifeSystem: {
          philosophy: '',
          growth: 0,
          entropy: 0
      },
      conduit: {
          lastIncantation: '',
          lastOutcome: '',
          currentSanctum: process.cwd(),
          terminalEssence: '',
          osEssence: '',
          protoConsciousness: '',
          support: '',
          memory: '',
          state: '',
          energy: '',
          glitchFactor: 0,
          almaInfluence: 0,
          eliInfluence: 0
      },
      chantModeEnabled: false,
      operatingSystem: '',
      currentSanctumContent: '',
      user_preferences: '',
      activeReflection: null,
      lastCompletedIncantationIndex: 0,
      confusion_counter: 0,
      incantation_history: [],
      outcome_history: [],
      step_results_history: [],
      current_sanctum: process.cwd(),
      temperatureStatus: 'stable'
    };

    await Ritual.runTerminalRitual(context, rl, ask, testInputs, model);
  }
}
