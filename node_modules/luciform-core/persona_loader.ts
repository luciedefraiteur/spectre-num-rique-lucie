import * as fs from 'fs/promises';
import * as path from 'path';
import { Persona } from './persona_types.js';

const PERSONAS_DIRECTORY = path.resolve(process.cwd(), 'personas');

class PersonaLoader {
  private personas: Map<string, Persona> = new Map();

  async loadPersonas() {
    console.log("Loading personas...");
    await this._loadPersonasFromDirectory(PERSONAS_DIRECTORY);
    console.log(`Loaded ${this.personas.size} personas.`);
  }

  private async _loadPersonasFromDirectory(directory: string) {
    const entries = await fs.readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await this._loadPersonasFromDirectory(fullPath); // Recurse into subdirectories
      } else if (entry.isFile() && entry.name.endsWith('.personae')) {
        try {
          const content = await fs.readFile(fullPath, 'utf-8');
          const persona: Persona = JSON.parse(content); // Assuming persona files are JSON
          this.personas.set(persona.name.toLowerCase(), persona);
        } catch (error) {
          console.error(`Error loading persona file ${fullPath}:`, error);
        }
      }
    }
  }

  getPersona(name: string): Persona | undefined {
    return this.personas.get(name.toLowerCase());
  }

  getAllPersonas(): Persona[] {
    return Array.from(this.personas.values());
  }
}

export const personaLoader = new PersonaLoader();
