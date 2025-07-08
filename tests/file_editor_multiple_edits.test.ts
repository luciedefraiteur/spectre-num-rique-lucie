import { exec } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('File Editor Program - Multiple Edits', () => {
  const file1 = 'temp_file1.txt';
  const file2 = 'temp_file2.txt';
  const editsJson = 'edits.json';

  beforeAll(async () => {
    // Create initial files
    await fs.writeFile(file1, "This is the first line of file1.\nThis is the second line of file1.\nThis is the third line of file1.", 'utf-8');
    await fs.writeFile(file2, "Initial content of file2.\nAnother line in file2.", 'utf-8');

    // Create the edits.json file
    await fs.writeFile(editsJson, JSON.stringify([
      {
        "filePath": file1,
        "edits": [
          {
            "type": "replace",
            "oldString": "This is the second line of file1.",
            "newString": "This line has been replaced in file1."
          },
          {
            "type": "insert",
            "position": 0,
            "content": "A new first line for file1.\n"
          }
        ]
      },
      {
        "filePath": file2,
        "edits": [
          {
            "type": "replace",
            "oldString": "Initial content of file2.",
            "newString": "Modified content for file2."
          },
          {
            "type": "delete",
            "position": 40,
            "length": 20
          }
        ]
      }
    ], null, 2), 'utf-8');
  });

  afterAll(async () => {
    // Clean up test files
    await fs.rm(file1, { force: true });
    await fs.rm(file2, { force: true });
    await fs.rm(editsJson, { force: true });
  });

  it('should apply multiple edits across multiple files', (done) => {
    const command = `node dist/file_editor_program.js ${editsJson}`;
    
    exec(command, async (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        console.error(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        return done(error);
      }

      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);

      // Verify file1 content
      const content1 = await fs.readFile(file1, 'utf-8');
      expect(content1).toContain("A new first line for file1.\nThis is the first line of file1.\nThis line has been replaced in file1.\nThis is the third line of file1.");

      // Verify file2 content
      const content2 = await fs.readFile(file2, 'utf-8');
      expect(content2).toContain("Modified content for file2.\nAnother line in file2."); // Assuming delete position was correct

      done();
    });
  }, 10000); // Increased timeout
});
