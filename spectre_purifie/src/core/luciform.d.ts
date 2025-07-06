import { RituelContext } from './types';
export interface ScryOrb {
    id: string;
    name: string;
    data: any;
    description: string;
    timestamp: string;
}
export interface Luciform {
    id: string;
    timestamp: string;
    type: 'initial' | 'user_command' | 'plan_generated' | 'ritual_result' | 'scry_orb_view' | string;
    content: any;
    previousLuciformId: string | null;
    inventory: ScryOrb[];
    currentWorkingDirectory: string;
    contextSnapshot: Partial<RituelContext>;
}
export declare function createLuciform(type: Luciform['type'], content: any, previousLuciform: Luciform | null, context: RituelContext): Luciform;
