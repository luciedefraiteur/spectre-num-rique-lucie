import { exec } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('File Transmutation', () => {
  const testFile = 'tests/transmutation_test_data/sample.txt';
  const transmutedLuciform = 'tests/transmutation_test_data/sample.txt.transmuted.luciform';

  beforeAll(async () => {
    // Ensure the test file exists
    await fs.writeFile(testFile, "This is a sample text file, not a luciform.", 'utf-8');
    // Clean up any previous transmutation artifacts
    await fs.rm(transmutedLuciform, { force: true });
  });

  afterAll(async () => {
    // Clean up test artifacts
    await fs.rm(testFile, { force: true });
    await fs.rm(transmutedLuciform, { force: true });
    await fs.rm(path.dirname(testFile), { recursive: true, force: true });
  });

  it('should transmute a non-luciform file into a luciform', (done) => {
    const command = `node -r dotenv/config --loader ts-node/esm start_golem_terminal.ts ${testFile}`;
    
    exec(command, async (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        console.error(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        return done(error);
      }

      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);

      // Assert that the transmutation process was initiated
      expect(stdout).toContain('Orchestrator: Attempting to transmute file into Luciform.');
      expect(stdout).toContain("Alchemist's diagnosis:"); // Assuming Alchemist will respond

      // Verify that the transmuted luciform file is created
      let transmutedFileExists = false;
      try {
        await fs.access(transmutedLuciform);
        transmutedFileExists = true;
      } catch (e) {
        // File does not exist
      }
      expect(transmutedFileExists).toBe(true);

      // Optionally, check content of the transmuted luciform
      const transmutedContent = await fs.readFile(transmutedLuciform, 'utf-8');
      expect(transmutedContent).toContain('LuciformDocument'); // Should contain a valid Luciform structure

      done();
    });
  }, 60000); // Increase timeout for LLM interaction
});
