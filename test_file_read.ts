import * as fs from 'fs/promises';
import * as path from 'path';

async function testPersonaFileRead() {
  const personaFilePath = path.join('personas', 'alma.personae');
  console.log(`Attempting to read file: ${personaFilePath}`);
  try {
    const fileContent = await fs.readFile(personaFilePath, 'utf-8');
    console.log(`Successfully read file. Content length: ${fileContent.length}`);
    console.log(`First 100 chars: ${fileContent.substring(0, 100)}`);
  } catch (error: any) {
    console.error("Error reading persona file:", error.message || error);
  }
}

testPersonaFileRead();
