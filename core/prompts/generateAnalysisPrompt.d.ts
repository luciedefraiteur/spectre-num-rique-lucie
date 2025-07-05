import { RitualPlan, RitualContext } from "../types.js";
export declare function generateAnalysisPrompt({ output, index, plan, original_input, context }: {
    output: string;
    index: number;
    plan: RitualPlan;
    original_input: string;
    context: RitualContext;
}): string;
