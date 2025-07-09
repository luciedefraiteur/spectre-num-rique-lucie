import { LuciformDocument } from '../../luciform-types/src/base.js';
export declare function executeLuciform(document: LuciformDocument, logRitual: (message: string, logFileName?: string) => Promise<void>, logFileName?: string): Promise<void>;
