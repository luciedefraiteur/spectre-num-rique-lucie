import { LuciformDocument } from 'luciform-core';
import { Persona } from '../persona_loader.js';
export declare function initializePersonas(): void;
export declare function getPersona(name: string): Persona | undefined;
export declare function parseLuciformDocument(luciformContent: string, logRitual: (message: string, logFileName?: string) => Promise<void>, logFileName?: string): LuciformDocument;
