import { Operation } from './types.js';
export declare function executeShellCommand(command: string): Promise<void>;
export declare function applyOperation(op: Operation, dryRun?: boolean): Promise<void>;
