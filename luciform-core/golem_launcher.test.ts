import { launchGolem } from './golem_launcher.js';
import { LLMModel } from './llm_interface.js';
import * as readline from 'readline';

async function testClaudeGolem() {
  console.log('--- Testing Dreamer Golem with Claude LLM ---');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  try {
    await launchGolem('Dreamer', ['exit'], LLMModel.Claude);
    console.log('Dreamer Golem with Claude LLM test completed.');
  } catch (error) {
    console.error('Error launching Dreamer Golem with Claude LLM:', error);
  } finally {
    rl.close();
  }
}

testClaudeGolem();