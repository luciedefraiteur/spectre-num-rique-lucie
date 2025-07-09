import { LuciformDocument } from '../../luciform-types/src/base.js';
export declare function parseLuciformDocument(luciformContent: string, logRitual: (message: string, logFileName?: string) => Promise<void>, logFileName?: string): LuciformDocument;
