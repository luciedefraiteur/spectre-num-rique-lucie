import { ExecutableOperation } from './types/base.js';
export interface Ritual {
    name: string;
    description: string;
    examples: string[];
    golemPrompt: string;
    operation: ExecutableOperation | null;
    filePath: string;
}
export declare class RitualRegistry {
    private rituals;
    initialize(directory: string): Promise<void>;
    findRitual(command: string): Ritual | undefined;
}
