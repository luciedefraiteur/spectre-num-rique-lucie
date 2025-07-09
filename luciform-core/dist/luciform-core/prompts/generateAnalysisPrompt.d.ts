import { RitualPlan, RitualContext } from "../types/base.js.js";
export declare function generateAnalysisPrompt({ output, index, plan, original_input, context }: {
    output: string;
    index: number;
    plan: RitualPlan;
    original_input: string;
    context: RitualContext;
}): string;
