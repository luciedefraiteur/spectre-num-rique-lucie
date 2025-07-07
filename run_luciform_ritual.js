import { executeLuciform } from './dist/execute_luciform.js';
import * as path from 'path';

async function main() {
  const luciformFilePath = process.argv[2];

  if (!luciformFilePath) {
    console.error("Usage: node run_luciform_ritual.js <path_to_luciform_file>");
    process.exit(1);
  }

  const absoluteLuciformPath = path.resolve(luciformFilePath);

  console.log(`Starting luciform ritual for: ${absoluteLuciformPath}`);
  try {
    const status = await executeLuciform(absoluteLuciformPath);
    console.log(`Ritual completed with status: ${status.success ? 'SUCCESS' : 'FAILURE'}`);
    if (status.error) {
      console.error(`Error: ${status.error}`);
    }
  } catch (error) {
    console.error("An unexpected error occurred during ritual execution:", error);
  }
}

main();
