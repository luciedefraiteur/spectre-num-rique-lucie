import { Operation } from './types.js';
export declare function reflectOnRitual(ritualName: string): string;
export declare function generateAndExecuteRitual(operations: Operation[]): Promise<void>;
