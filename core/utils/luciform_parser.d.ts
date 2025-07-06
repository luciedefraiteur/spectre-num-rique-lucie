import { Operation } from '../types.js';
export declare function parseLuciform(filePath: string, args: string[]): Promise<{
    operations: Operation[];
    luciePresenceData: any | null;
}>;
