import { RituelContext, PlanRituel, ÉtapeResult } from './types';
export declare function getContexteInitial(): RituelContext;
export declare function generateRituel(userCommand: string, contexte: RituelContext): Promise<PlanRituel | null>;
export declare function executeRituelPlan(plan: PlanRituel, contexte: RituelContext): Promise<{
    success: boolean;
    results: ÉtapeResult[];
}>;
