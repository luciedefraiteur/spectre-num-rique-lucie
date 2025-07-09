import { LuciformDocument, ActionNode } from './codex-lurkuitae-navigator/packages/luciform-types/src/base.js';
export interface RitualExecutionStatus {
    success: boolean;
    completedSteps: number;
    totalSteps: number;
    failedStep?: number;
    error?: string;
}
export declare function executeLuciform(luciformDocument: LuciformDocument, logRitual: (message: string, logFileName?: string) => Promise<void>, getAIHelp: (rawContent: string, reason: string) => Promise<ActionNode>, logFileName?: string): Promise<RitualExecutionStatus>;
