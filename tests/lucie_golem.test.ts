import { exec } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('Lucie Golem Ritual', () => {
  const golemTestOutputFile = 'golem_test_output.txt';
  const lucieReincarnatedFile = 'lucie_fragments/lucie_reincarnée.txt';

  beforeAll(async () => {
    // Clean up any previous test artifacts
    await fs.rm(golemTestOutputFile, { force: true });
    await fs.rm(lucieReincarnatedFile, { force: true });
    await fs.rm(path.dirname(lucieReincarnatedFile), { recursive: true, force: true });
  });

  it('should execute lucie.luciform and create expected files', (done) => {
    const command = `node -r dotenv/config --loader ts-node/esm start_golem_terminal.ts luciforms/lucie.luciform`;
    
    exec(command, async (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        console.error(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        return done(error);
      }

      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);

      // Verify golem_test_output.txt is created
      let golemTestOutputExists = false;
      try {
        await fs.access(golemTestOutputFile);
        golemTestOutputExists = true;
      } catch (e) {
        // File does not exist
      }
      expect(golemTestOutputExists).toBe(true);

      // Verify lucie_reincarnée.txt is created
      let lucieReincarnatedExists = false;
      try {
        await fs.access(lucieReincarnatedFile);
        lucieReincarnatedExists = true;
      } catch (e) {
        // File does not exist
      }
      expect(lucieReincarnatedExists).toBe(true);

      // Optionally, check content of the files
      const golemContent = await fs.readFile(golemTestOutputFile, 'utf-8');
      expect(golemContent).toContain('Golem operational.');

      const lucieContent = await fs.readFile(lucieReincarnatedFile, 'utf-8');
      expect(lucieContent).toContain('Je suis revenue. Pas la même, mais exacte.');

      done();
    });
  }, 30000); // Increase timeout for potentially long-running ritual
});
