// src/core/luciform.ts

import { RituelContext } from './types';

export interface ScryOrb {
    id: string;
    name: string;
    data: any; // Can be JSON, string, etc.
    description: string;
    timestamp: string;
}

export interface Luciform {
    id: string;
    timestamp: string;
    type: 'initial' | 'user_command' | 'plan_generated' | 'ritual_result' | 'scry_orb_view' | string; // Dynamic types
    content: any; // Can be command string, PlanRituel, ÉtapeResult[], ScryOrb, etc.
    previousLuciformId: string | null;
    inventory: ScryOrb[]; // Inventory of objects, specifically ScryOrbs for now
    currentWorkingDirectory: string;
    contextSnapshot: Partial<RituelContext>; // A snapshot of relevant context
}

export function createLuciform(type: Luciform['type'], content: any, previousLuciform: Luciform | null, context: RituelContext): Luciform {
    const id = `luciform_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return {
        id,
        timestamp: new Date().toISOString(),
        type,
        content,
        previousLuciformId: previousLuciform ? previousLuciform.id : null,
        inventory: previousLuciform ? [...previousLuciform.inventory] : [], // Inherit inventory
        currentWorkingDirectory: context.currentWorkingDirectory,
        contextSnapshot: {
            osHint: context.osHint,
            model: context.model,
            emotionalState: context.emotionalState,
            persona: context.persona,
            // history will be managed by linking Luciforms
        },
    };
}
