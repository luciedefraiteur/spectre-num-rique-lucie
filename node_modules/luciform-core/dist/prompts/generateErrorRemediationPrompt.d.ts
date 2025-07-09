import { RitualPlan, CommandOutcome } from "../types/base.js";
export declare function generateErrorRemediationPrompt({ command, commandResult, contextHistory, originalInput, currentPlan }: {
    command: string;
    commandResult: CommandOutcome;
    contextHistory: any[];
    originalInput: string;
    currentPlan: RitualPlan;
}): string;
