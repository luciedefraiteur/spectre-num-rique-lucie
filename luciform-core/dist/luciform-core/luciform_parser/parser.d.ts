import { LuciformDocument } from './types.js';
export declare function parseLuciformDocument(luciformContent: string, logRitual: (message: string, logFileName?: string) => Promise<void>, logFileName?: string): LuciformDocument;
