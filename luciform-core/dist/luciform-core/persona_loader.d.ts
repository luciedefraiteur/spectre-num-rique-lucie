import { Persona } from './persona_types.js';
declare class PersonaLoader {
    private personas;
    loadPersonas(): Promise<void>;
    private _loadPersonasFromDirectory;
    getPersona(name: string): Persona | undefined;
    getAllPersonas(): Persona[];
}
export declare const personaLoader: PersonaLoader;
export {};
