
import { executeLuciform } from './execute_luciform.js';

async function runTest() {
  try {
    const result = await executeLuciform('awakening.lucidMagic');
    console.log('Execution result:', result);
  } catch (error) {
    console.error('Execution failed:', error);
  }
}

runTest();
