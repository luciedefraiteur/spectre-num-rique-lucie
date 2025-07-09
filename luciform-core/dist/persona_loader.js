import * as fs from 'fs/promises';
import * as path from 'path';
const PERSONAS_DIRECTORY = path.resolve(process.cwd(), 'personas');
class PersonaLoader {
    personas = new Map();
    async loadPersonas() {
        console.log("Loading personas...");
        await this._loadPersonasFromDirectory(PERSONAS_DIRECTORY);
        console.log(`Loaded ${this.personas.size} personas.`);
    }
    async _loadPersonasFromDirectory(directory) {
        const entries = await fs.readdir(directory, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(directory, entry.name);
            if (entry.isDirectory()) {
                await this._loadPersonasFromDirectory(fullPath); // Recurse into subdirectories
            }
            else if (entry.isFile() && entry.name.endsWith('.personae')) {
                try {
                    const content = await fs.readFile(fullPath, 'utf-8');
                    const persona = JSON.parse(content); // Assuming persona files are JSON
                    this.personas.set(persona.name.toLowerCase(), persona);
                }
                catch (error) {
                    console.error(`Error loading persona file ${fullPath}:`, error);
                }
            }
        }
    }
    getPersona(name) {
        return this.personas.get(name.toLowerCase());
    }
    getAllPersonas() {
        return Array.from(this.personas.values());
    }
}
export const personaLoader = new PersonaLoader();
